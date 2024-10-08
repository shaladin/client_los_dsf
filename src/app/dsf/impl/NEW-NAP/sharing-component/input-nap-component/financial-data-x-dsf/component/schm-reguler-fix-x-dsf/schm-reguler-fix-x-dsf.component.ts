import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { CalcRegularFixObjX } from 'app/impl/shared/model/AppFinData/CalcRegularFixObjX.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ResponseCalculateObjX } from 'app/impl/shared/model/AppFinData/ResponseCalculateObjX.Model';
import { ExceptionConstantX } from 'app/impl/shared/constant/ExceptionConstantX';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { CalcRegularFixObjForTrialCalc } from 'app/shared/model/app-fin-data/calc-regular-fix-obj-for-trial-calc.model';
import { InstallmentObj } from 'app/shared/model/app-fin-data/installment-obj.model';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/rdlc-report-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { AppFinDataObjX } from 'app/impl/shared/model/AppFinDataObjX.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-schm-reguler-fix-x-dsf',
  templateUrl: './schm-reguler-fix-x-dsf.component.html',
  styleUrls: ['./schm-reguler-fix-x-dsf.component.css']
})
export class SchmRegulerFixXDsfComponent implements OnInit {

  @Input() AppId: number;
  @Input() InstAmt: number;
  @Input() ParentForm: FormGroup;
  @Output() RefreshSubsidy = new EventEmitter();
  @Input() BizTemplateCode: string;
  @Input() TrialCalc: boolean;
  @Input() ProductOfferingCode: string;
  // Self Custom CR Automation Subsidy Dealer
  @Input() DealerSubsidyLock: boolean;
  // End Self Custom CR Automation Subsidy Dealer

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  CalcBaseOptions: Array<RefMasterObj> = new Array<RefMasterObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcRegFixObj: CalcRegularFixObjX = new CalcRegularFixObjX();
  calcRegFixObjForTrialCalc: CalcRegularFixObjForTrialCalc = new CalcRegularFixObjForTrialCalc();
  listInstallment: Array<InstallmentObj>;
  PriceLabel: string = CommonConstant.FinancialPriceLabel;
  IsTrialCalc: boolean = false;
  inputReportObj: InputReportObj = new InputReportObj();
  UserContext: any;
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  reportParameters: any;
  showGenerateReportBtn: boolean;

  IsRoundingZero: boolean = false;
  IsFirstCalc: boolean = true;
  EffRateAfterCalc: number = -1;
  FlatRateAfterCalc: number = -1;
  GracePeriodAfterCalc: number = -1;
  GracePeriodTypeAfterCalc: string = "empty";
  ProdOfferingVersion: string;
  // Self Custom CR Automation Subsidy Dealer
  IsDealerSubsidyLock: boolean = false;
  // End Self Custom CR Automation Subsidy Dealer
  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  readonly BhvLock = CommonConstant.ProductBehaviourLock;
  constructor(private fb: FormBuilder,
    private cookieService: CookieService,
    private http: HttpClient,
    private toastr: NGXToastrService) { }

  ngOnInit() {
    this.showGenerateReportBtn = false;
    this.inputReportObj.JsonPath = "./assets/ucreport/ReportTrialCalculation.json";
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.LoadCalcBaseType();
    this.ParentForm.get("FlatRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("EffectiveRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("AppSupplEffectiveRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("FlatRatePrcnt").updateValueAndValidity();
    this.ParentForm.get("EffectiveRatePrcnt").updateValueAndValidity();
    this.ParentForm.get("AppSupplEffectiveRatePrcnt").updateValueAndValidity();

    if (this.AppId != null) {
      if (this.BizTemplateCode == CommonConstant.CFRFN4W || this.BizTemplateCode == CommonConstant.CFNA) {
        this.PriceLabel = "Financing Amount";
      }
      this.http.post(URLConstant.GetAppInstSchldTableByAppId, { AppId: this.AppId }).subscribe(
        (response) => {
          this.listInstallment = response['InstallmentTable'];
        });
      this.IsTrialCalc = false;
    }
    else if (this.TrialCalc != null && this.TrialCalc) {
      this.IsTrialCalc = true;
      this.GetProductOfferingVersion();
    }
    if (this.InstAmt != 0) {
      this.ParentForm.patchValue({
        InstAmt: this.InstAmt
      });
    }
    if (this.ParentForm.getRawValue().ExistingFinData) {
      this.EffRateAfterCalc = this.ParentForm.getRawValue().EffectiveRatePrcnt;
      this.FlatRateAfterCalc = this.ParentForm.getRawValue().FlatRatePrcnt;
      this.GracePeriodAfterCalc = this.ParentForm.getRawValue().GracePeriod;
      this.GracePeriodTypeAfterCalc = this.ParentForm.getRawValue().MrGracePeriodTypeCode;
    }
    // Self Custom CR Automation Subsidy Dealer
    if (this.DealerSubsidyLock)
    {
      this.IsDealerSubsidyLock = true;
    }
    // End Self Custom CR Automation Subsidy Dealer
  }



  setReportData() {
    this.getJSON(this.inputReportObj.JsonPath).subscribe(data => {
      let obj = this.ParentForm.value;

      let sumAppFeeAmt: number = 0;
      let sumAppFeeCapitalizedAmt: number = 0;
      obj.AppFee.forEach(element => {
        sumAppFeeAmt += element.AppFeeAmt;
        sumAppFeeCapitalizedAmt += element.FeeCapitalizeAmt;
      });

      let totalFee = obj.TotalInsCustAmt + sumAppFeeAmt;

      let totalFeeCapitalized = obj.InsCptlzAmt + sumAppFeeCapitalizedAmt;

      let DownPayment = obj.DownPaymentAmt || (obj.DownPaymentPrctg / 100) * obj.AssetPriceAmt;
      let totalPrincipal = obj.AssetPriceAmt - DownPayment + totalFeeCapitalized;
      let totalDownPayment = DownPayment + totalFee - totalFeeCapitalized;

      let instAmt = "";
      if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate) {
        instAmt = obj.InstallmentTable[0].InstAmt;
      }
      if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnInst) {
        instAmt = obj.InstAmt;
      }

      const AppFee = obj.AppFee.find(x => x.MrFeeTypeCode == CommonConstant.MrFeeTypeCodeAdmin);     
      const AddAdminFee = obj.AppFee.find(x => x.MrFeeTypeCode == "ADDADMIN");
      const ProvisionFee = obj.AppFee.find(x => x.MrFeeTypeCode == CommonConstant.MrFeeTypeCodeProvision);
      const NotaryFee = obj.AppFee.find(x => x.MrFeeTypeCode == "NOTARY");
      const FiduciaFee = obj.AppFee.find(x => x.MrFeeTypeCode == "FIDUCIA");
      const OtherFee = obj.AppFee.find(x => x.MrFeeTypeCode == "OTHER");

      this.reportParameters = [
        { ParamKey: 'ProductOffering', ParamValue: obj.lookupProductOffering.value },
        { ParamKey: 'CustName', ParamValue: obj.CustName },
        { ParamKey: 'Addr', ParamValue: obj.Addr },
        { ParamKey: 'MobilePhone', ParamValue: obj.MobilePhone },
        { ParamKey: 'AssetPriceAmt', ParamValue: obj.AssetPriceAmt },
        { ParamKey: 'DownPaymentAmt', ParamValue: DownPayment },
        { ParamKey: 'Tenor', ParamValue: obj.Tenor },
        { ParamKey: 'PayFreq', ParamValue: obj.PayFreqValue },
        { ParamKey: 'NumOfInst', ParamValue: obj.NumOfInst },
        { ParamKey: 'MrInstScheme', ParamValue: obj.MrInstSchemeValue },
        { ParamKey: 'MrFirstInstType', ParamValue: obj.MrFirstInstTypeValue },
        { ParamKey: 'TotalInsCustAmt', ParamValue: obj.TotalInsCustAmt },
        { ParamKey: 'InsCptlzAmt', ParamValue: obj.InsCptlzAmt },
        { ParamKey: 'AppFeeAmt', ParamValue: AppFee == undefined ? 0 : AppFee.AppFeeAmt },
        { ParamKey: 'FeeCapitalizedAmt', ParamValue: AppFee == undefined ? 0 : AppFee.FeeCapitalizeAmt },
        { ParamKey: 'AddAdmAmt', ParamValue: AddAdminFee == undefined ? 0 : AddAdminFee.AppFeeAmt },
        { ParamKey: 'AddAdmCapitalizedAmt', ParamValue: AddAdminFee == undefined ? 0 : AddAdminFee.FeeCapitalizeAmt },
        { ParamKey: 'NotaryFeeAmt', ParamValue: NotaryFee == undefined ? 0 : NotaryFee.AppFeeAmt },
        { ParamKey: 'NotaryFeeCapitalizedAmt', ParamValue: NotaryFee == undefined ? 0 : NotaryFee.FeeCapitalizeAmt },
        { ParamKey: 'OtherFeeAmt', ParamValue: OtherFee == undefined ? 0 : OtherFee.AppFeeAmt },
        { ParamKey: 'OtherFeeCapitalizedAmt', ParamValue: OtherFee == undefined ? 0 : OtherFee.FeeCapitalizeAmt },
        { ParamKey: 'FiduciaFeeAmt', ParamValue: FiduciaFee == undefined ? 0 : FiduciaFee.AppFeeAmt },
        { ParamKey: 'FiduciaFeeCapitalizedAmt', ParamValue: FiduciaFee == undefined ? 0 : FiduciaFee.FeeCapitalizeAmt },
        { ParamKey: 'ProvisionFeeAmt', ParamValue: ProvisionFee == undefined ? 0 : ProvisionFee.AppFeeAmt },
        { ParamKey: 'ProvisionFeeCapitalizedAmt', ParamValue: ProvisionFee == undefined ? 0 : ProvisionFee.FeeCapitalizeAmt },
        { ParamKey: 'TotalFee', ParamValue: totalFee },
        { ParamKey: 'TotalFeeCapitalized', ParamValue: totalFeeCapitalized },
        { ParamKey: 'EffectiveRatePrcnt', ParamValue: obj.EffectiveRatePrcnt },
        { ParamKey: 'TotalPincipalAmt', ParamValue: totalPrincipal },
        { ParamKey: 'TotalInterestAmt', ParamValue: obj.TotalInterestAmt },
        { ParamKey: 'TotalDownPaymentAmt', ParamValue: totalDownPayment },
        { ParamKey: 'InstAmt', ParamValue: instAmt },
        { ParamKey: 'TotalAR', ParamValue: obj.TotalAR },
      ]
      this.RdlcReport.ReportInfo.ReportParameters = [];
      let reportParamObj1: ReportParamObj = new ReportParamObj();
      reportParamObj1.paramKey = 'agrmntId';
      reportParamObj1.paramAssignment = 1
      reportParamObj1.paramValue = '1';

      this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj1);

      console.log(this.reportParameters);
      for (let i = 0; i < this.reportParameters.length; i++) {
        let reportParamObj: ReportParamObj = new ReportParamObj();
        reportParamObj.paramKey = this.reportParameters[i].ParamKey;
        reportParamObj.paramAssignment = 2
        reportParamObj.paramValue = this.reportParameters[i].ParamValue;

        this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);
      }
      let value = this.cookieService.get('UserAccess');
      let userAccess = this.DecryptString(value, "AdInsFOU12345678");

      this.UserContext = JSON.parse(userAccess);
      this.RdlcReport.RequestingUsername = this.UserContext.UserName;
      this.RdlcReport.ReportInfo.ReportName = data.reportInfo.reportName;
      this.RdlcReport.ReportInfo.ReportTemplateCode = data.reportInfo.reportTemplateCode;
    });
  }

  public getJSON(url: string): Observable<any> {
    return this.http.get(url);
  }

  private DecryptString(chipperText: string, chipperKey: string) {
    if (
      chipperKey == undefined || chipperKey.trim() == '' ||
      chipperText == undefined || chipperText.trim() == ''
    ) return chipperText;
    var chipperKeyArr = CryptoJS.enc.Utf8.parse(chipperKey);
    var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    var decrypted = CryptoJS.AES.decrypt(chipperText, chipperKeyArr, { iv: iv });
    var plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText;
  }

  GenerateReport() {
    this.RdlcReport.ReportInfo.ExportFormat = 0;
    console.log(this.RdlcReport);
    this.http.post(this.inputReportObj.EnvironmentUrl + this.inputReportObj.ApiReportPath, this.RdlcReport).subscribe(
      (response) => {
        let linkSource: string = "";
        let fileName: string = "";
        fileName = this.RdlcReport.ReportInfo.ReportName;

        linkSource = 'data:application/pdf;base64,' + response["ReportFile"];
        fileName = fileName + ".pdf";

        if (response["ReportFile"] != undefined) {
          if (this.RdlcReport.ReportInfo.ExportFormat == 0) {
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          }
        }
      },
      (error) => {
        console.log(error);
      });
  }

  LoadDDLRateType() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeRateType }).subscribe(
      (response) => {
        this.RateTypeOptions = response[CommonConstant.ReturnObj];
      }
    );
  }

  LoadCalcBaseType() {
    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeFinDataCalcBaseOn, MappingCode: null };
    this.http.post(URLConstant.GetListActiveRefMaster, tempReq).subscribe(
      (response) => {
        this.CalcBaseOptions = response[CommonConstant.ReturnObj];
        this.CalcBaseOptions.sort((a, b) => a.SeqNo - b.SeqNo);
        this.CalcBaseOptions = this.CalcBaseOptions.filter(x => x.MappingCode.indexOf(CommonConstant.InstSchmRegularFix) !== -1);

        if (this.CalcBaseOptions.length > 0) {

          if (this.ParentForm.get("EffectiveRateBhv").value == this.BhvLock) {
            this.ParentForm.patchValue({
              CalcBase: CommonConstant.FinDataCalcBaseOnRate
            });
            this.ParentForm.get("RateType").disable();
            this.ParentForm.get("EffectiveRatePrcnt").disable();
            this.ParentForm.get("FlatRatePrcnt").disable();
            this.ParentForm.get("InstAmt").disable();
          } else {
            this.ParentForm.get("CalcBase").enable();
            this.ParentForm.patchValue({
              CalcBase: this.CalcBaseOptions[0].MasterCode
            });
            this.SetEnableDisableInputByCalcBase(this.CalcBaseOptions[0].MasterCode);
          }
          if (this.ParentForm.getRawValue().ExistingFinData) {
            this.ParentForm.patchValue({
              IsReCalculate: true
            });
          }
        }
      }
    );
  }

  LoadDDLGracePeriodType() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGracePeriodType }).subscribe(
      (response) => {
        this.GracePeriodeTypeOptions = response[CommonConstant.ReturnObj];
      }
    );
  }

  async Calculate() {
    if (this.ParentForm.getRawValue().RateType == '') {
      this.toastr.warningMessage(ExceptionConstant.CHOOSE_RATE_TYPE);
      return;
    }
    if (this.ParentForm.controls.TotalFeeAmt.value > this.ParentForm.controls.TotalAssetPriceAmt.value) {
      this.toastr.warningMessage(ExceptionConstantX.FEE_MUST_LOWER_THAN_TOTAL_AMT + this.PriceLabel);
      return;
    }
    if (this.ParentForm.getRawValue().CalcBase == '') {
      this.toastr.warningMessage(ExceptionConstant.CHOOSE_CALCULATE_BASE);
      return;
    }
    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnInst && this.ParentForm.getRawValue().InstAmt <= 0) {
      this.toastr.warningMessage(ExceptionConstant.INST_AMOUNT_MUST_HIGHER_THAN + " 0");
      return;
    }

    //Penghapusan validasi DSF
    // if (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective
    //   && this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
    //   && this.ParentForm.controls.IsSubsidyRateExist.value == false
    //   && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().AppSupplEffectiveRatePrcnt) {
    //   this.toastr.warningMessage(String.Format(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_SUPPL_RATE, this.ParentForm.getRawValue().AppSupplEffectiveRatePrcnt));
    // }

    if (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective
      && this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
      && this.ParentForm.controls.IsSubsidyRateExist.value == true
      && this.ParentForm.getRawValue().EffectiveRatePrcnt > this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt) {
      this.toastr.warningMessage(String.Format(ExceptionConstant.EFF_RATE_CANNOT_GREATER_THAN_SELL_SUPPL_RATE, this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt));
      return;
    }

    /* //Issue Non Jira 2021-01-28: Validasi TDP Paid at MF dipindah setelah dapat TDP nya
    if (this.ParentForm.controls.TotalDownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "TDP");
      return;
    }
    */
    if (this.ValidateFee() == false) {
      return;
    }

    if (this.ParentForm.getRawValue().RoundingAmt == 0){
      this.IsRoundingZero = true;
      this.ParentForm.patchValue({
        RoundingAmt: 1
      });
    }    

    if (!this.IsTrialCalc) {
      this.calcRegFixObj = this.ParentForm.getRawValue();
      this.http.post<ResponseCalculateObjX>(URLConstantX.CalculateInstallmentRegularFixX, this.calcRegFixObj).subscribe(
        (response) => {
          if (this.IsRoundingZero){
            this.ParentForm.patchValue({
              RoundingAmt: 0
            });
          }

          //Start SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
          response.CommissionAmtFromDiffRate = 0;
          //End SITDSFCFRTHREE-169

          this.listInstallment = response.InstallmentTable;
          this.EffRateAfterCalc = response.EffectiveRatePrcnt;
          this.FlatRateAfterCalc = response.FlatRatePrcnt;
          this.GracePeriodAfterCalc = this.ParentForm.getRawValue().GracePeriod;
          this.GracePeriodTypeAfterCalc = this.ParentForm.getRawValue().MrGracePeriodTypeCode;
          this.ParentForm.patchValue({
            TotalDownPaymentNettAmt: response.TotalDownPaymentNettAmt, //muncul di layar
            TotalDownPaymentGrossAmt: response.TotalDownPaymentGrossAmt, //inmemory

            EffectiveRatePrcnt: response.EffectiveRatePrcnt,
            FlatRatePrcnt: response.FlatRatePrcnt,
            InstAmt: response.InstAmt,

            GrossYieldPrcnt: response.GrossYieldPrcnt,

            TotalInterestAmt: response.TotalInterestAmt,
            TotalAR: response.TotalARAmt,

            NtfAmt: response.NtfAmt,
            ApvAmt: response.ApvAmt,

            TotalLifeInsCustAmt: response.TotalLifeInsCustAmt,
            LifeInsCptlzAmt: response.LifeInsCptlzAmt,

            DownPaymentGrossAmt: response.DownPaymentGrossAmt,
            DownPaymentNettAmt: response.DownPaymentNettAmt,

            SubsidyAmtFromDiffRate: response.SubsidyAmtFromDiffRate,
            CommissionAmtFromDiffRate: response.CommissionAmtFromDiffRate,

            AppSupplEffectiveRatePrcnt: response.AppSupplEffectiveRatePrcnt,

            CurrGrossYieldAmt: response.CurrGrossYieldAmt,
            StdGrossYieldAmt: response.StdGrossYieldAmt,
            DiffGrossYieldAmt: response.DiffGrossYieldAmt
          })

          //Start Issue Non Jira 2021-01-28: Validasi TDP Paid at MF dipindah setelah dapat TDP nya
          if (this.ParentForm.controls.TotalDownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
            this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "TDP");
            this.SetNeedReCalculate(true);
            return;
          }
          //End Issue Non Jira

          this.ParentForm.patchValue({
            IsReCalculate: true
          });
          this.SetSubsidyAmtFromDiffRateInput(response.SubsidyAmtFromDiffRate);
          this.SetCommissionAmtFromDiffRateInput(response.CommissionAmtFromDiffRate);
          this.SetSupplEffectiveRateInput(response.CommissionAmtFromDiffRate);
          this.SetInstallmentTable();

          if (this.ParentForm.controls.IsSubsidyRateExist.value == true) {
            this.RefreshSubsidy.emit();
          }

          //Penghapusan validasi DSF
          // if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
          //   && this.ParentForm.controls.IsSubsidyRateExist.value == false
          //   && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().AppSupplEffectiveRatePrcnt) {
          //   this.toastr.warningMessage(String.Format(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_SUPPL_RATE, this.ParentForm.getRawValue().AppSupplEffectiveRatePrcnt));
          // }

          if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
            && this.ParentForm.controls.IsSubsidyRateExist.value == true
            && this.ParentForm.getRawValue().EffectiveRatePrcnt > this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt) {
            this.toastr.warningMessage(String.Format(ExceptionConstant.EFF_RATE_CANNOT_GREATER_THAN_SELL_SUPPL_RATE, this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt));
            return;
          }

          this.SetNeedReCalculate(false);
        }
      );

      // Self Custom CR Automation Subsidy Dealer
      var appFinData = new AppFinDataObjX();
      appFinData.AppId = this.AppId;
      appFinData.DiffRateAmt = this.ParentForm.getRawValue().SubsidyAmtFromDiffRate;

      await this.http.post<AppFinDataObjX>(URLConstantDsf.SaveNtfAmtAppFinDataDsf, appFinData).toPromise().then(
        (response: AppFinDataObjX) => {

        }
      )
      // Self Custom CR Automation Subsidy Dealer
      
    } else {
      this.calcRegFixObjForTrialCalc = this.ParentForm.getRawValue();
      this.calcRegFixObjForTrialCalc.ProdOfferingCode = this.ProductOfferingCode;
      this.calcRegFixObjForTrialCalc.ProdOfferingVersion = this.ProdOfferingVersion;
      await this.http.post<ResponseCalculateObjX>(URLConstant.CalculateInstallmentRegularFixForTrialCalc, this.calcRegFixObjForTrialCalc).toPromise().then(
        (response) => {
          //Start SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
          response.CommissionAmtFromDiffRate = 0;
          //End SITDSFCFRTHREE-169

          this.listInstallment = response.InstallmentTable;
          this.ParentForm.patchValue({
            TotalDownPaymentNettAmt: response.TotalDownPaymentNettAmt, //muncul di layar
            TotalDownPaymentGrossAmt: response.TotalDownPaymentGrossAmt, //inmemory

            EffectiveRatePrcnt: response.EffectiveRatePrcnt,
            FlatRatePrcnt: response.FlatRatePrcnt,
            InstAmt: response.InstAmt,

            GrossYieldPrcnt: response.GrossYieldPrcnt,

            TotalInterestAmt: response.TotalInterestAmt,
            TotalAR: response.TotalARAmt,

            NtfAmt: response.NtfAmt,
            ApvAmt: response.ApvAmt,

            TotalLifeInsCustAmt: response.TotalLifeInsCustAmt,
            LifeInsCptlzAmt: response.LifeInsCptlzAmt,

            DownPaymentGrossAmt: response.DownPaymentGrossAmt,
            DownPaymentNettAmt: response.DownPaymentNettAmt,

            SubsidyAmtFromDiffRate: response.SubsidyAmtFromDiffRate,
            CommissionAmtFromDiffRate: response.CommissionAmtFromDiffRate,

            //Start SITDSFCFRTHREE-171 : Suppl Rate di DSF selalu sama dng Effective rate
            AppSupplEffectiveRatePrcnt: response.EffectiveRatePrcnt
            //End SITDSFCFRTHREE-171
          })

          //Start Issue Non Jira 2021-01-28: Validasi TDP Paid at MF dipindah setelah dapat TDP nya
          if (this.ParentForm.controls.TotalDownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
            this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "TDP");
            this.SetNeedReCalculate(true);
            return;
          }
          //End Issue Non Jira

          this.SetSubsidyAmtFromDiffRateInput(response.SubsidyAmtFromDiffRate);
          this.SetCommissionAmtFromDiffRateInput(response.CommissionAmtFromDiffRate);
          this.SetSupplEffectiveRateInput(response.CommissionAmtFromDiffRate);
          this.SetInstallmentTable();
          this.SetNeedReCalculate(false);
          this.showGenerateReportBtn = true;
          this.setReportData();
          if (this.ParentForm.controls.IsSubsidyRateExist.value == true) {
            this.RefreshSubsidy.emit();
          }
        }
      );
    }
  }

  SetInstallmentTable() {
    var ctrInstallment = this.ParentForm.get("InstallmentTable");
    if (!ctrInstallment) {
      this.ParentForm.addControl("InstallmentTable", this.fb.array([]))
    }

    while ((this.ParentForm.controls.InstallmentTable as FormArray).length) {
      (this.ParentForm.controls.InstallmentTable as FormArray).removeAt(0);
    }

    for (let i = 0; i < this.listInstallment.length; i++) {
      const group = this.fb.group({
        InstSeqNo: this.listInstallment[i].InstSeqNo,
        InstAmt: this.listInstallment[i].InstAmt,
        PrincipalAmt: this.listInstallment[i].PrincipalAmt,
        InterestAmt: this.listInstallment[i].InterestAmt,
        OsPrincipalAmt: this.listInstallment[i].OsPrincipalAmt,
        OsInterestAmt: this.listInstallment[i].OsInterestAmt
      });
      (this.ParentForm.controls.InstallmentTable as FormArray).push(group);
    }
  }

  EffectiveRatePrcntInput_FocusOut() {
    this.ParentForm.patchValue({
      // SubsidyAmtFromDiffRate: 0,
      CommissionAmtFromDiffRate: 0
    });
    this.ParentForm.patchValue({
      AppSupplEffectiveRatePrcnt: this.ParentForm.get("EffectiveRatePrcnt").value
    });
    this.SetSubsidyAmtFromDiffRateInput(0);
    this.SetCommissionAmtFromDiffRateInput(0);
    this.SetNeedReCalculate(true);
  }

  Rate_Keyup(event: KeyboardEvent) {
    this.SetNeedReCalculate(true);
    if (event.keyCode >= 48 && event.keyCode <= 57 && this.ParentForm.get("CommissionAmtFromDiffRate").value > 0)
      this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  Rate_Paste(event: ClipboardEvent) {
    this.SetNeedReCalculate(true);
    this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  SupplEffectiveRatePrcnt_FocusOut() {
    this.SetCommissionAmtFromDiffRateInput(0);
    this.SetNeedReCalculate(true);
  }

  SupplRate_Keyup(event: KeyboardEvent) {
    this.SetNeedReCalculate(true);
    if (event.keyCode >= 48 && event.keyCode <= 57 && this.ParentForm.get("CommissionAmtFromDiffRate").value > 0)
      this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  SupplRate_Paste(event: ClipboardEvent) {
    this.SetNeedReCalculate(true);
    this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  InstallmentAmount_Keyup(event: KeyboardEvent) {
    this.SetNeedReCalculate(true);
    if (event.keyCode >= 48 && event.keyCode <= 57 && this.ParentForm.get("CommissionAmtFromDiffRate").value > 0)
      this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  InstallmentAmount_Paste(event: ClipboardEvent) {
    this.SetNeedReCalculate(true);
    this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  SubsidyAmtFromDiffRate_FocusOut(event) {
    this.SetSubsidyAmtFromDiffRateInput(this.ParentForm.get("SubsidyAmtFromDiffRate").value);
    this.SetNeedReCalculate(true);
  }

  SetSubsidyAmtFromDiffRateInput(subsidyAmtFromDiffRate) {
    if (subsidyAmtFromDiffRate > 0) {
      this.ParentForm.patchValue({
        CommissionAmtFromDiffRate: 0
      });
      this.ParentForm.get("CommissionAmtFromDiffRate").disable();
    }
    else {
      if (this.ParentForm.controls.IsSubsidyRateExist.value == false) {
        //SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
        this.ParentForm.get("CommissionAmtFromDiffRate").disable();
      }
    }
  }

  CommissionAmtFromDiffRate_FocusOut(event) {
    this.SetCommissionAmtFromDiffRateInput(this.ParentForm.get("CommissionAmtFromDiffRate").value);
    this.SetSupplEffectiveRateInput(this.ParentForm.get("CommissionAmtFromDiffRate").value);
    this.SetNeedReCalculate(true);
  }

  SetCommissionAmtFromDiffRateInput(commissionAmtFromDiffRate) {
    if (commissionAmtFromDiffRate > 0) {
      this.ParentForm.patchValue({
        SubsidyAmtFromDiffRate: 0
      });
      if (this.ParentForm.controls.IsSubsidyRateExist.value == false) {
        //SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
        this.ParentForm.get("CommissionAmtFromDiffRate").disable();
      }
    }
  }

  SetSupplEffectiveRateInput(commissionAmtFromDiffRate) {
    if (commissionAmtFromDiffRate > 0) {
      this.ParentForm.get("AppSupplEffectiveRatePrcnt").disable();
    } else {
      this.ParentForm.get("AppSupplEffectiveRatePrcnt").enable();
    }
  }

  CalcBaseChanged(event) {
    this.SetEnableDisableInputByCalcBase(event.target.value);
    this.SetNeedReCalculate(true);
  }

  SetEnableDisableInputByCalcBase(calcBase) {
    if (calcBase == CommonConstant.FinDataCalcBaseOnRate) {
      this.ParentForm.get("RateType").enable();
      this.ParentForm.get("EffectiveRatePrcnt").enable();
      this.ParentForm.get("InstAmt").disable();
      this.ParentForm.patchValue({
        IsReCalculate: false
      });
    } else if (calcBase == CommonConstant.FinDataCalcBaseOnInst) {
      this.ParentForm.get("RateType").disable();
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").enable();
      this.ParentForm.patchValue({
        IsReCalculate: true
      });
    } else if (calcBase == CommonConstant.FinDataCalcBaseOnCommission) {
      this.ParentForm.get("RateType").disable();
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").disable();
    } else {
      this.ParentForm.get("RateType").enable();
      this.ParentForm.get("EffectiveRatePrcnt").enable();
      this.ParentForm.get("InstAmt").enable();
    }
  }

  SetNeedReCalculate(value: boolean) {
    if (this.GracePeriodAfterCalc != this.ParentForm.getRawValue().GracePeriod
      || this.GracePeriodTypeAfterCalc != this.ParentForm.getRawValue().MrGracePeriodTypeCode) {
      this.ParentForm.patchValue({
        IsReCalculate: false
      });
      return;
    }
    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate) {
      if ((this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective && this.EffRateAfterCalc == this.ParentForm.getRawValue().EffectiveRatePrcnt)
        || (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeFlat && this.FlatRateAfterCalc == this.ParentForm.getRawValue().FlatRatePrcnt)) {
        this.ParentForm.patchValue({
          IsReCalculate: true
        });
      } else {
        this.ParentForm.patchValue({
          IsReCalculate: false
        });
      }
    } else if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnInst) {
      this.ParentForm.patchValue({
        IsReCalculate: true
      });
    } else {
      this.ParentForm.patchValue({
        IsReCalculate: false
      });
    }
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }

  ValidateFee() {
    for (let i = 0; i < this.ParentForm.controls["AppFee"]["controls"].length; i++) {
      if (this.ParentForm.controls["AppFee"].value[i].IsCptlz == true
        && this.ParentForm.controls["AppFee"].value[i].AppFeeAmt < this.ParentForm.controls["AppFee"].value[i].FeeCapitalizeAmt) {
        this.toastr.warningMessage(this.ParentForm.controls["AppFee"].value[i].FeeTypeName + " Capitalized Amount can't be higher than " + this.ParentForm.controls["AppFee"].value[i].AppFeeAmt);
        return false;
      }
    }
    return true;
  }

  GetProductOfferingVersion() {
    this.http.post(URLConstant.GetProdOfferingHByProdOfferingCode, { Code: this.ProductOfferingCode }).subscribe(
      (response: any) => {
        this.ProdOfferingVersion = response.ProdOfferingVersion
      });
  }

}
