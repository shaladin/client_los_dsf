import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormGroupDirective, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CalcStepUpStepDownObj } from 'app/shared/model/app-fin-data/calc-step-up-step-down-obj.model';
import { AppInstStepSchmObj } from 'app/shared/model/app-inst-step-schm/app-inst-step-schm-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { CalcStepUpStepDownObjForTrialCalc } from 'app/shared/model/app-fin-data/calc-step-up-step-down-obj-for-trial-calc.model';
import { InstallmentObj } from 'app/shared/model/app-fin-data/installment-obj.model';
import { ResponseCalculateObj } from 'app/shared/model/app-fin-data/response-calculate-obj.model';

@Component({
  selector: 'app-schm-step-up-step-down-cummulative',
  templateUrl: './schm-step-up-step-down-cummulative.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SchmStepUpStepDownCummulativeComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm: FormGroup;
  @Input() BizTemplateCode: string;
  @Input() TrialCalc: boolean;
  @Input() InstAmt: number;
  @Input() ProductOfferingCode: string;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  CalcBaseOptions: Array<RefMasterObj> = new Array<RefMasterObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcStepUpStepDownObj: CalcStepUpStepDownObj = new CalcStepUpStepDownObj();
  calcStepUpStepDownObjForTrialCalc: CalcStepUpStepDownObjForTrialCalc = new CalcStepUpStepDownObjForTrialCalc();
  listInstallment: Array<InstallmentObj>;
  listAppInstStepSchm: Array<AppInstStepSchmObj> = new Array<AppInstStepSchmObj>();
  PriceLabel: string = CommonConstant.FinancialPriceLabel;
  IsTrialCalc: boolean = false;
  IsFirstCalc: boolean = true;
  EffRateAfterCalc: number = -1;
  FlatRateAfterCalc: number = -1;
  GracePeriodAfterCalc: number = -1;
  GracePeriodTypeAfterCalc: string = "empty";
  ProdOfferingVersion: string;

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  readonly BhvLock = CommonConstant.ProductBehaviourLock;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService) { }

  ngOnInit() {
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
        this.CalcBaseOptions.sort((a,b) => a.SeqNo - b.SeqNo);
        this.CalcBaseOptions = this.CalcBaseOptions.filter(x => x.MappingCode.indexOf(CommonConstant.InstSchmStepUpStepDownCummulative) !== -1);

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

  SetInstStepSchm() {
    var ctrInstallment = this.ParentForm.get("AppInstStepSchmObjs");
    if (!ctrInstallment) {
      this.ParentForm.addControl("AppInstStepSchmObjs", this.fb.array([]))
    }

    while ((this.ParentForm.controls.AppInstStepSchmObjs as FormArray).length) {
      (this.ParentForm.controls.AppInstStepSchmObjs as FormArray).removeAt(0);
    }

    for (let i = 0; i < this.listAppInstStepSchm.length; i++) {
      const group = this.fb.group({
        StepPrcnt: this.listAppInstStepSchm[i].StepPrcnt,
        PresentValueAmt: this.listAppInstStepSchm[i].PresentValueAmt,
        FutureValueAmt: this.listAppInstStepSchm[i].FutureValueAmt,
        InstAmt: this.listAppInstStepSchm[i].InstAmt,
        FirstStepSeqNo: this.listAppInstStepSchm[i].FirstStepSeqNo,
        LastStepSeqNo: this.listAppInstStepSchm[i].LastStepSeqNo,
        NumOfInst: this.listAppInstStepSchm[i].NumOfInst
      });
      (this.ParentForm.controls.AppInstStepSchmObjs as FormArray).push(group);
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

  SetNeedReCalculate(value, overrideIsNotRecalculate = false) {
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

    if (overrideIsNotRecalculate) this.ParentForm.patchValue({ IsReCalculate: false });
  }

  Calculate() {
    if (this.ParentForm.getRawValue().RateType == '') {
      this.toastr.warningMessage(ExceptionConstant.CHOOSE_RATE_TYPE);
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
    if (this.ValidateFee() == false) {
      return;
    }
    if (this.ParentForm.controls.CummulativeTenor.value <= 1) {
      this.toastr.warningMessage(ExceptionConstant.CUMMULATIVE_TENOR_MUST_HIGHER_THAN + '1.');
      return;
    }
    /* //Issue Non Jira 2021-01-28: Validasi TDP Paid at MF dipindah setelah dapat TDP nya
    if (this.ParentForm.controls.TotalDownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "TDP");
      return;
    }
    */
    if (!this.IsTrialCalc) {
      this.calcStepUpStepDownObj = this.ParentForm.getRawValue();
      this.calcStepUpStepDownObj["StepUpStepDownType"] = this.ParentForm.getRawValue().MrInstSchemeCode;

      this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentStepUpStepDown, this.calcStepUpStepDownObj).subscribe(
        (response) => {
          this.listInstallment = response.InstallmentTable;
          this.EffRateAfterCalc = response.EffectiveRatePrcnt;
          this.FlatRateAfterCalc = response.FlatRatePrcnt;
          this.GracePeriodAfterCalc = this.ParentForm.getRawValue().GracePeriod;
          this.GracePeriodTypeAfterCalc = this.ParentForm.getRawValue().MrGracePeriodTypeCode;
          this.listAppInstStepSchm = response.AppInstStepSchmObjs;
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
          this.SetInstallmentTable();
          this.SetInstStepSchm();
          this.SetNeedReCalculate(false);
        }
      );
    } else {
      this.calcStepUpStepDownObjForTrialCalc = this.ParentForm.getRawValue();
      this.calcStepUpStepDownObjForTrialCalc.ProdOfferingCode = this.ProductOfferingCode;
      this.calcStepUpStepDownObjForTrialCalc.ProdOfferingVersion = this.ProdOfferingVersion;
      this.calcStepUpStepDownObjForTrialCalc["StepUpStepDownType"] = this.ParentForm.getRawValue().MrInstSchemeCode;

      this.http.post(URLConstant.CalculateInstallmentStepUpStepDownForTrialCalc, this.calcStepUpStepDownObjForTrialCalc).subscribe(
        (response) => {
          this.listInstallment = response["InstallmentTable"];
          this.listAppInstStepSchm = response["AppInstStepSchmObjs"];
          this.ParentForm.patchValue({
            TotalDownPaymentNettAmt: response["TotalDownPaymentNettAmt"], //muncul di layar
            TotalDownPaymentGrossAmt: response["TotalDownPaymentGrossAmt"], //inmemory

            EffectiveRatePrcnt: response["EffectiveRatePrcnt"],
            FlatRatePrcnt: response["FlatRatePrcnt"],
            InstAmt: response["InstAmt"],

            GrossYieldPrcnt: response["GrossYieldPrcnt"],

            TotalInterestAmt: response["TotalInterestAmt"],
            TotalAR: response["TotalARAmt"],

            NtfAmt: response["NtfAmt"],
            ApvAmt: response["ApvAmt"],

            TotalLifeInsCustAmt: response["TotalLifeInsCustAmt"],
            LifeInsCptlzAmt: response["LifeInsCptlzAmt"],

            DownPaymentGrossAmt: response["DownPaymentGrossAmt"],
            DownPaymentNettAmt: response["DownPaymentNettAmt"]

          })

          //Start Issue Non Jira 2021-01-28: Validasi TDP Paid at MF dipindah setelah dapat TDP nya
          if (this.ParentForm.controls.TotalDownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
            this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "TDP");
            this.SetNeedReCalculate(true);
            return;
          }
          //End Issue Non Jira

          this.SetInstallmentTable();
          this.SetInstStepSchm();
          this.SetNeedReCalculate(false);
        }
      );

    }
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

  test() {
  }

  GetProductOfferingVersion() {
    this.http.post(URLConstant.GetProdOfferingHByProdOfferingCode, { Code: this.ProductOfferingCode }).subscribe(
      (response: any) => {
        this.ProdOfferingVersion = response.ProdOfferingVersion
      });
  }

}
