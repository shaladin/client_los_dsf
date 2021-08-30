import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { RdlcReportObj, ReportParamObj } from 'app/shared/model/library/RdlcReportObj.model';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-schm-reguler-fix-cfna',
  templateUrl: './schm-reguler-fix-cfna.component.html',
})
export class SchmRegulerFixCFNAComponent implements OnInit {
  @Input() AppId: number = 0;
  @Input() ParentForm: FormGroup;
  @Output() RefreshSubsidy = new EventEmitter();
  @Input() TrialCalc: boolean = false;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  CalcBaseOptions: Array<RefMasterObj> = new Array<RefMasterObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  listInstallment: any;
  result: AppObj = new AppObj();
  PriceLabel: string = "Financing Amount";
  inputReportObj: InputReportObj = new InputReportObj();
  UserContext: any;
  RdlcReport: RdlcReportObj = new RdlcReportObj();
  reportParameters: any;
  showGenerateReportBtn: boolean;

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
    if (this.AppId != 0) {
      this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
        (response) => {
          this.result = response;
          if (this.result.BizTemplateCode == CommonConstant.CFRFN4W) {
            this.PriceLabel = "Financing Amount";
          }
        });
      this.TrialCalc = false;
    }
  }


  setReportData() {
    this.getJSON(this.inputReportObj.JsonPath).subscribe(data => {
      let obj = this.ParentForm.value;
      let totalFee = obj.TotalInsCustAmt
        + obj.AppFee[0].AppFeeAmt
        + obj.AppFee[1].AppFeeAmt
        + obj.AppFee[2].AppFeeAmt
        + obj.AppFee[3].AppFeeAmt
        + obj.AppFee[4].AppFeeAmt
        + obj.AppFee[5].AppFeeAmt;

      let totalFeeCapitalized = obj.TotalInsCustAmt
        + obj.AppFee[0].FeeCapitalizeAmt
        + obj.AppFee[1].FeeCapitalizeAmt
        + obj.AppFee[2].FeeCapitalizeAmt
        + obj.AppFee[3].FeeCapitalizeAmt
        + obj.AppFee[4].FeeCapitalizeAmt
        + obj.AppFee[5].FeeCapitalizeAmt;

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
        { ParamKey: 'AppFeeAmt', ParamValue: obj.AppFee[0].AppFeeAmt },
        { ParamKey: 'FeeCapitalizedAmt', ParamValue: obj.AppFee[0].FeeCapitalizeAmt },
        { ParamKey: 'AddAdmAmt', ParamValue: obj.AppFee[1].AppFeeAmt },
        { ParamKey: 'AddAdmCapitalizedAmt', ParamValue: obj.AppFee[1].FeeCapitalizeAmt },
        { ParamKey: 'NotaryFeeAmt', ParamValue: obj.AppFee[2].AppFeeAmt },
        { ParamKey: 'NotaryFeeCapitalizedAmt', ParamValue: obj.AppFee[2].FeeCapitalizeAmt },
        { ParamKey: 'OtherFeeAmt', ParamValue: obj.AppFee[3].AppFeeAmt },
        { ParamKey: 'OtherFeeCapitalizedAmt', ParamValue: obj.AppFee[3].FeeCapitalizeAmt },
        { ParamKey: 'FiduciaFeeAmt', ParamValue: obj.AppFee[4].AppFeeAmt },
        { ParamKey: 'FiduciaFeeCapitalizedAmt', ParamValue: obj.AppFee[4].FeeCapitalizeAmt },
        { ParamKey: 'ProvisionFeeAmt', ParamValue: obj.AppFee[5].AppFeeAmt },
        { ParamKey: 'ProvisionFeeCapitalizedAmt', ParamValue: obj.AppFee[5].FeeCapitalizeAmt },
        { ParamKey: 'TotalFee', ParamValue: obj.TotalFeeAmt },
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
        this.CalcBaseOptions = this.CalcBaseOptions.filter(x => x.MappingCode.indexOf(CommonConstant.InstSchmRegularFix) !== -1);

        if (this.CalcBaseOptions.length == 1) {
          this.ParentForm.patchValue({
            CalcBase: this.CalcBaseOptions[0].MasterCode
          });
          this.SetEnableDisableInputByCalcBase(this.CalcBaseOptions[0].MasterCode);
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

  Calculate() {
    if (this.ParentForm.getRawValue().CalcBase == '') {
      this.toastr.warningMessage(ExceptionConstant.CHOOSE_CALCULATE_BASE);
      return;
    }
    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnInst && this.ParentForm.getRawValue().InstAmt <= 0) {
      this.toastr.warningMessage(ExceptionConstant.INST_AMOUNT_MUST_HIGHER_THAN + " 0");
      return;
    }
    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
      && this.ParentForm.controls.IsSubsidyRateExist.value == false
      && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().StdEffectiveRatePrcnt) {
      this.toastr.warningMessage(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_STD_RATE);
      return;
    }

    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
      && this.ParentForm.controls.IsSubsidyRateExist.value == true
      && this.ParentForm.getRawValue().EffectiveRatePrcnt > this.ParentForm.getRawValue().StdEffectiveRatePrcnt) {
      this.toastr.warningMessage(ExceptionConstant.EFF_RATE_CANNOT_GREATER_THAN_STD_RATE);
      return;
    }

    if (this.ValidateFee() == false) {
      return;
    }

    this.http.post<ResponseCalculateObj>(this.GetUrlCalc(), this.ParentForm.getRawValue()).subscribe(
      (response) => {
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
          SupplEffectiveRatePrcnt: response.AppSupplEffectiveRatePrcnt
        })
        this.SetSubsidyAmtFromDiffRateInput(response.SubsidyAmtFromDiffRate);
        this.SetCommissionAmtFromDiffRateInput(response.CommissionAmtFromDiffRate);
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

  GetUrlCalc(): string {
    if (!this.TrialCalc) return URLConstant.CalculateInstallmentRegularFix;
    return URLConstant.CalculateInstallmentRegularFixForTrialCalc;
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
      SubsidyAmtFromDiffRate: 0,
      CommissionAmtFromDiffRate: 0
    });
    this.SetSubsidyAmtFromDiffRateInput(0);
    this.SetCommissionAmtFromDiffRateInput(0);
    this.SetNeedReCalculate(true);
  }

  SubsidyAmtFromDiffRate_FocusOut(event) {
    this.SetSubsidyAmtFromDiffRateInput(event.target.value);
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
        this.ParentForm.get("CommissionAmtFromDiffRate").enable();
      }
    }
  }

  CommissionAmtFromDiffRate_FocusOut(event) {
    this.SetCommissionAmtFromDiffRateInput(event.target.value);
    this.SetNeedReCalculate(true);
  }

  SetCommissionAmtFromDiffRateInput(commissionAmtFromDiffRate) {
    if (commissionAmtFromDiffRate > 0) {
      this.ParentForm.patchValue({
        SubsidyAmtFromDiffRate: 0
      });
      if (this.ParentForm.controls.IsSubsidyRateExist.value == false) {
        this.ParentForm.get("CommissionAmtFromDiffRate").enable();
      }
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
    } else if (calcBase == CommonConstant.FinDataCalcBaseOnInst) {
      this.ParentForm.get("RateType").disable();
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").enable();
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
}