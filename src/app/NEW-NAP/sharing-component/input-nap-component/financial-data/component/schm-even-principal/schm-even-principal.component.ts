import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormGroupDirective, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { CalcEvenPrincipleObj } from 'app/shared/model/AppFinData/CalcEvenPrincipleObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { CalcEvenPrincipleObjForTrialCalc } from 'app/shared/model/AppFinData/CalcEvenPrincipleObjForTrialCalc.Model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import {InputReportObj} from 'app/shared/model/library/InputReportObj.model';
import {RdlcReportObj, ReportParamObj} from 'app/shared/model/library/RdlcReportObj.model';
import {CookieService} from 'ngx-cookie';
import {AdInsHelper} from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-schm-even-principal',
  templateUrl: './schm-even-principal.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SchmEvenPrincipalComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm: FormGroup;
  @Input() BizTemplateCode: string;
  @Input() TrialCalc: boolean;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  CalcBaseOptions: Array<RefMasterObj> = new Array<RefMasterObj>();
  calcEvenPrincipleObj: CalcEvenPrincipleObj = new CalcEvenPrincipleObj();
  calcEvenPrincipleObjForTrialCalc: CalcEvenPrincipleObjForTrialCalc = new CalcEvenPrincipleObjForTrialCalc();
  listInstallment: Array<InstallmentObj>;
  PriceLabel: string = CommonConstant.FinancialPriceLabel;
  IsTrialCalc: boolean = false;
  IsFirstCalc: boolean = true;
  EffRateAfterCalc: number = 0;
  FlatRateAfterCalc: number = 0;

  showGenerateReportBtn: boolean;
  reportParameters: any;
  inputReportObj: InputReportObj = new InputReportObj();
  RdlcReport: RdlcReportObj = new RdlcReportObj();

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  readonly BhvLock = CommonConstant.ProductBehaviourLock;
  constructor(private fb: FormBuilder,
    private cookieService: CookieService,
    private http: HttpClient,
    private toastr: NGXToastrService
  ) { }

  ngOnInit() {
    this.showGenerateReportBtn = false;
    this.inputReportObj.JsonPath = "./assets/ucreport/ReportTrialCalculation.json";
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.LoadCalcBaseType();
    this.ParentForm.get("FlatRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("EffectiveRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("FlatRatePrcnt").updateValueAndValidity();
    this.ParentForm.get("EffectiveRatePrcnt").updateValueAndValidity();

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
    }
    if (this.ParentForm.getRawValue().ExistingFinData) {
      this.EffRateAfterCalc = this.ParentForm.getRawValue().EffectiveRatePrcnt;
      this.FlatRateAfterCalc = this.ParentForm.getRawValue().FlatRatePrcnt;
    }
  }

  setReportData() {
    this.http.get(this.inputReportObj.JsonPath).subscribe(data => {
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

      const UserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.RdlcReport.RequestingUsername = UserContext.UserName;
      this.RdlcReport.ReportInfo.ReportName = data['reportInfo'].reportName;
      this.RdlcReport.ReportInfo.ReportTemplateCode = data['reportInfo'].reportTemplateCode;
    });
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

  LoadDDLGracePeriodType() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGracePeriodType }).subscribe(
      (response) => {
        this.GracePeriodeTypeOptions = response[CommonConstant.ReturnObj];
      }
    );
  }

  LoadCalcBaseType() {
    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeFinDataCalcBaseOn, MappingCode: null };
    this.http.post(URLConstant.GetListActiveRefMaster, tempReq).subscribe(
      (response) => {
        this.CalcBaseOptions = response[CommonConstant.ReturnObj];
        this.CalcBaseOptions = this.CalcBaseOptions.filter(x => x.MappingCode.indexOf(CommonConstant.InstSchmEvenPrincipal) !== -1);

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


  Calculate() {
    if (this.ParentForm.getRawValue().CalcBase == '') {
      this.toastr.warningMessage(ExceptionConstant.CHOOSE_CALCULATE_BASE);
      return;
    }

    if (this.ValidateFee() == false) {
      return;
    }
    if (this.ParentForm.controls.DownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "Down Payment");
      return;
    }
    if (!this.IsTrialCalc) {
      this.calcEvenPrincipleObj = this.ParentForm.getRawValue();

      this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentEvenPrincipal, this.calcEvenPrincipleObj).subscribe(
        (response) => {
          this.listInstallment = response.InstallmentTable;
          this.EffRateAfterCalc = response.EffectiveRatePrcnt;
          this.FlatRateAfterCalc = response.FlatRatePrcnt;
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
            DownPaymentNettAmt: response.DownPaymentNettAmt

          })

          this.ParentForm.patchValue({
            IsReCalculate: true
          });
          this.SetInstallmentTable();
          this.SetNeedReCalculate(false);

        }
      );
    } else {
      this.calcEvenPrincipleObjForTrialCalc = this.ParentForm.getRawValue();

      this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentEvenPrincipalForTrialCalc, this.calcEvenPrincipleObjForTrialCalc).subscribe(
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
            DownPaymentNettAmt: response.DownPaymentNettAmt

          })
          this.SetInstallmentTable();
          this.SetNeedReCalculate(false);
          this.setReportData();
          this.showGenerateReportBtn = true;

        }
      );

    }
  }

  CalcBaseChanged(event) {
    this.SetEnableDisableInputByCalcBase(event.target.value);
    this.SetNeedReCalculate(true);
  }

  SetEnableDisableInputByCalcBase(calcBase) {
    if (calcBase == CommonConstant.FinDataCalcBaseOnRate) {
      this.ParentForm.get("EffectiveRatePrcnt").enable();
      this.ParentForm.get("InstAmt").disable();
      this.ParentForm.patchValue({
        IsReCalculate: false
      });
    } else if (calcBase == CommonConstant.FinDataCalcBaseOnInst) {
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").enable();
      this.ParentForm.patchValue({
        IsReCalculate: true
      });
    } else if (calcBase == CommonConstant.FinDataCalcBaseOnCommission) {
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").disable();
    } else {
      this.ParentForm.get("EffectiveRatePrcnt").enable();
      this.ParentForm.get("InstAmt").enable();
    }
  }

  SetNeedReCalculate(value: boolean) {
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

  SaveAndContinue() {
    var isValidGrossYield = this.ValidateGrossYield();
    var isValidGracePeriod = this.ValidateGracePeriode();

    if (isValidGrossYield && isValidGracePeriod) {
    }
  }

  ValidateGracePeriode() {
    var valid: boolean = true;
    var gracePeriodType = this.ParentForm.get("MrGracePeriodTypeCode").value
    var gracePeriod = this.ParentForm.get("GracePeriod").value

    if (gracePeriodType != "") {
      if (gracePeriod == 0) {
        valid = false;
        this.toastr.warningMessage(ExceptionConstant.GRACE_PERIOD_MUST_SET);
      }
    }

    return valid;
  }

  ValidateGrossYield() {
    this.ParentForm.patchValue({
      GrossYieldPrcnt: 10
    });
    var GrossYieldBhv = this.ParentForm.get("GrossYieldBhv").value
    var StdGrossYieldPrcnt = this.ParentForm.get("StdGrossYieldPrcnt").value
    var GrossYieldPrcnt = this.ParentForm.get("GrossYieldPrcnt").value
    var valid: boolean = true;

    if (GrossYieldBhv == 'MIN') {
      if (GrossYieldPrcnt < StdGrossYieldPrcnt) {
        this.toastr.warningMessage(ExceptionConstant.GROSS_YIELD_CANNOT_LESS_THAN + StdGrossYieldPrcnt + "%");
        valid = false;
      }
    }
    else {
      if (GrossYieldPrcnt > StdGrossYieldPrcnt) {
        this.toastr.warningMessage(ExceptionConstant.GROSS_YIELD_CANNOT_GREATER_THAN + StdGrossYieldPrcnt + "%");
        valid = false;
      }
    }
    return valid;
  }

  EffectiveRatePrcntInput_FocusOut() {
    var EffectiveRatePrcnt = this.ParentForm.get("EffectiveRatePrcnt").value
    var SupplEffectiveRatePrcnt = this.ParentForm.get("SupplEffectiveRatePrcnt").value
    var StdEffectiveRatePrcnt = this.ParentForm.get("StdEffectiveRatePrcnt").value
    var DiffRateAmtStd = +StdEffectiveRatePrcnt - +SupplEffectiveRatePrcnt

    var diffRate = +EffectiveRatePrcnt - +SupplEffectiveRatePrcnt;
    if (diffRate < DiffRateAmtStd) {
      this.ParentForm.patchValue({
        DiffRateAmt: 0
      });
    }
    else {
      this.ParentForm.patchValue({
        DiffRateAmt: DiffRateAmtStd
      });
    }

    this.SetNeedReCalculate(true);
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

  test() {
  }
}
