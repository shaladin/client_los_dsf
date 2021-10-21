import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { CalcStepUpStepDownObj } from 'app/shared/model/AppFinData/CalcStepUpStepDownObj.Model';
import { AppInstStepSchmObj } from 'app/shared/model/AppInstStepSchm/AppInstStepSchmObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CalcStepUpStepDownObjForTrialCalc } from 'app/shared/model/AppFinData/CalcStepUpStepDownObjForTrialCalc.Model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-schm-step-up-step-down-normal',
  templateUrl: './schm-step-up-step-down-normal.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SchmStepUpStepDownNormalComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm: FormGroup;
  @Input() BizTemplateCode: string;
  @Input() TrialCalc: boolean;
  @Input() InstAmt: number;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  StepUpStepDownInputOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcStepUpStepDownObj: CalcStepUpStepDownObj = new CalcStepUpStepDownObj();
  calcStepUpStepDownObjForTrialCalc: CalcStepUpStepDownObjForTrialCalc = new CalcStepUpStepDownObjForTrialCalc();
  listInstallment: Array<InstallmentObj>;
  listAppInstStepSchm: Array<AppInstStepSchmObj> = new Array<AppInstStepSchmObj>();
  PriceLabel: string = CommonConstant.FinancialPriceLabel;
  IsTrialCalc: boolean = false;
  ListExistingAppInstStepSchm: Array<AppInstStepSchmObj> = new Array<AppInstStepSchmObj>();

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  readonly BhvLock = CommonConstant.ProductBehaviourLock;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.LoadDDLStepUpStepDownInputType();

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

      this.http.post(URLConstant.GetAppInsStepSchmForSUSDByAppId, { Id: this.AppId }).subscribe(
        (response) => {
          if (response["ListAppInstStepSchm"] != 0) {
            this.ListExistingAppInstStepSchm = response["ListAppInstStepSchm"];
            this.ParentForm.patchValue({
              NumOfStep: this.ListExistingAppInstStepSchm.length,
              StepUpStepDownInputType: CommonConstant.InputTypeAmt
            });

            this.SetEntryInstallment(true);
          }
        });

      this.IsTrialCalc = false;
    }
    else if (this.TrialCalc != null && this.TrialCalc) {
      this.IsTrialCalc = true;
    }
    if (this.InstAmt != 0) {
      this.ParentForm.patchValue({
        InstAmt: this.InstAmt
      });
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

  LoadDDLStepUpStepDownInputType() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeStepUpStepDownInputType }).subscribe(
      (response) => {
        this.StepUpStepDownInputOptions = response[CommonConstant.ReturnObj];
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

  InputTypeChanged() {
    for (let i = 0; i < (this.ParentForm.controls.ListEntryInst as FormArray).length; i++) {
      this.ParentForm.controls.ListEntryInst["controls"][i].patchValue({
        InstAmt: 0
      });
      if (this.ParentForm.controls.StepUpStepDownInputType.value == CommonConstant.RefMasterTypeStepUpStepDownInputTypePrcnt)
        this.ParentForm.controls.ListEntryInst["controls"][i]['controls']["InstAmt"].setValidators([Validators.max(100)]);
      else
        this.ParentForm.controls.ListEntryInst["controls"][i]['controls']["InstAmt"].clearValidators();

      this.ParentForm.controls.ListEntryInst["controls"][i]['controls']["InstAmt"].updateValueAndValidity();
    }

    this.SetNeedReCalculate(true);
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

  SetNeedReCalculate(value) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }

  SetEntryInstallment(IsExisting: boolean = false) {
    if (this.ParentForm.get("NumOfStep").value < 1) {
      this.toastr.warningMessage(ExceptionConstant.NUM_OF_STEP_MUST_HIGHER + '0.');
      return;
    }
    if (this.ParentForm.controls.StepUpStepDownInputType.value == "") {
      this.toastr.warningMessage(ExceptionConstant.STEP_UP_STEP_DOWN_TYPE);
      return;
    }
    while ((this.ParentForm.controls.ListEntryInst as FormArray).length) {
      (this.ParentForm.controls.ListEntryInst as FormArray).removeAt(0);
    }
    if (IsExisting) {
      for (let i = 0; i < this.ParentForm.controls.NumOfStep.value - 1; i++) {
        const group = this.fb.group({
          InstSeqNo: i + 1,
          NumOfInst: [this.ListExistingAppInstStepSchm[i].NumOfInst],
          InstAmt: [this.ListExistingAppInstStepSchm[i].InstAmt]
        });
        (this.ParentForm.controls.ListEntryInst as FormArray).push(group);
      }
    } else {
      for (let i = 0; i < this.ParentForm.controls.NumOfStep.value - 1; i++) {
        const group = this.fb.group({
          InstSeqNo: i + 1,
          NumOfInst: [0],
          InstAmt: [0, this.ParentForm.controls.StepUpStepDownInputType.value == CommonConstant.RefMasterTypeStepUpStepDownInputTypePrcnt ? [Validators.max(100)] : []]
        });
        (this.ParentForm.controls.ListEntryInst as FormArray).push(group);
      }
    }
    this.SetNeedReCalculate(true);
  }


  CalculateAmortization() {
    this.calcStepUpStepDownObj = this.ParentForm.value;
    if (this.ValidateFee() == false) {
      return;
    }
    if (this.ParentForm.controls.StepUpStepDownInputType.value == "") {
      this.toastr.warningMessage(ExceptionConstant.STEP_UP_STEP_DOWN_TYPE);
      return;
    }
    if (this.ParentForm.controls.DownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "Down Payment");
      return;
    }

    let NumOfInstKosong = this.calcStepUpStepDownObj.ListEntryInst.findIndex(x => x.NumOfInst == 0);
    if (NumOfInstKosong != -1) {
      this.toastr.warningMessage(ExceptionConstant.INPUT_NUM_OF_INST + (NumOfInstKosong + 1));
      return;
    }
    let InstAmtKosong = this.calcStepUpStepDownObj.ListEntryInst.findIndex(x => x.InstAmt == 0);
    if (InstAmtKosong != -1) {
      this.toastr.warningMessage(ExceptionConstant.INPUT_INST_AMOUNT + (InstAmtKosong + 1));
      return;
    }
    for (let i = 0; i < this.calcStepUpStepDownObj.ListEntryInst.length; i++) {
      let indexI = this.calcStepUpStepDownObj.ListEntryInst[i].InstAmt;
      for (let j = 0; j < this.calcStepUpStepDownObj.ListEntryInst.length; j++) {
        if (i != j) {
          let indexJ = this.calcStepUpStepDownObj.ListEntryInst[j].InstAmt;
          if (indexI == indexJ) {
            this.toastr.warningMessage(String.Format(ExceptionConstant.INPUT_INST_AMOUNT_SUSD, i + 1, j + 1));
            return;
          }
        }
      }
    }

    if (!this.IsTrialCalc) {
      this.calcStepUpStepDownObj["IsRecalculate"] = false;
      this.calcStepUpStepDownObj["StepUpStepDownType"] = this.ParentForm.value.MrInstSchemeCode;
      this.calcStepUpStepDownObj["StepUpNormalInputType"] = this.ParentForm.value.StepUpStepDownInputType;
      this.calcStepUpStepDownObj["InstAmt"] = 0;


      this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentStepUpStepDown, this.calcStepUpStepDownObj).subscribe(
        (response) => {
          this.listInstallment = response.InstallmentTable;
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

          });
          this.SetInstallmentTable();
          this.SetInstStepSchm();
          this.SetNeedReCalculate(false);
          this.SetSubsidyAmtFromDiffRateInput(response.SubsidyAmtFromDiffRate);
          this.SetCommissionAmtFromDiffRateInput(response.CommissionAmtFromDiffRate);
        }
      );
    } else {
      this.calcStepUpStepDownObjForTrialCalc["IsRecalculate"] = false;
      this.calcStepUpStepDownObjForTrialCalc["StepUpStepDownType"] = this.ParentForm.value.MrInstSchemeCode;
      this.calcStepUpStepDownObjForTrialCalc["StepUpNormalInputType"] = this.ParentForm.value.StepUpStepDownInputType;
      this.calcStepUpStepDownObjForTrialCalc["InstAmt"] = 0;


      this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentStepUpStepDownForTrialCalc, this.calcStepUpStepDownObjForTrialCalc).subscribe(
        (response) => {
          this.listInstallment = response.InstallmentTable;
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

          });
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
    this.ParentForm.patchValue({
      SubsidyAmtFromDiffRate: 0,
      CommissionAmtFromDiffRate: 0
    });
    this.SetSubsidyAmtFromDiffRateInput(0);
    this.SetCommissionAmtFromDiffRateInput(0);
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
