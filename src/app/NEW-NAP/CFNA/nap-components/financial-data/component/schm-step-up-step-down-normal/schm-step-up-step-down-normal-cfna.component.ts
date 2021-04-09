import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { CalcStepUpStepDownObj } from 'app/shared/model/AppFinData/CalcStepUpStepDownObj.Model';
import { AppInstStepSchmObj } from 'app/shared/model/AppInstStepSchm/AppInstStepSchmObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-schm-step-up-step-down-normal-cfna',
  templateUrl: './schm-step-up-step-down-normal-cfna.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SchmStepUpStepDownNormalCFNAComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  StepUpStepDownInputOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcStepUpStepDownObj: CalcStepUpStepDownObj = new CalcStepUpStepDownObj();
  listInstallment: any;
  listAppInstStepSchm: Array<AppInstStepSchmObj> = new Array<AppInstStepSchmObj>();
  responseCalc: any;
  result: AppObj = new AppObj();
  PriceLabel : string = "Financing Amount";

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.LoadDDLStepUpStepDownInputType();
    this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
      (response) => {
        this.result = response;
        if(this.result.BizTemplateCode == CommonConstant.CFRFN4W){
          this.PriceLabel = "Financing Amount";
        }
      });
  }

  LoadDDLRateType() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeRateType  }).subscribe(
      (response) => {
        this.RateTypeOptions = response[CommonConstant.ReturnObj];
      }
    );
  }

  LoadDDLGracePeriodType() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGracePeriodType  }).subscribe(
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

  InputTypeChanged(){
    for(let i = 0; i < (this.ParentForm.controls.ListEntryInst as FormArray).length; i++){
      this.ParentForm.controls.ListEntryInst["controls"][i].patchValue({
        InstAmt: 0
      });
      if(this.ParentForm.controls.StepUpStepDownInputType.value == CommonConstant.RefMasterTypeStepUpStepDownInputTypePrcnt)
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

  SetEntryInstallment(){
    if(this.ParentForm.get("NumOfStep").value < 1){
      this.toastr.warningMessage( ExceptionConstant.NUM_OF_STEP_MUST_HIGHER + '0.');
      return;
    }
    if(this.ParentForm.controls.StepUpStepDownInputType.value == ""){
      this.toastr.warningMessage(ExceptionConstant.STEP_UP_STEP_DOWN_TYPE);
      return;
    }
    while ((this.ParentForm.controls.ListEntryInst as FormArray).length) {
      (this.ParentForm.controls.ListEntryInst as FormArray).removeAt(0);
    }
    for(let i = 0 ; i < this.ParentForm.controls.NumOfStep.value-1 ; i++){
      const group = this.fb.group({
        InstSeqNo: i + 1,
        NumOfInst: [0],
        InstAmt: [0, this.ParentForm.controls.StepUpStepDownInputType.value == CommonConstant.RefMasterTypeStepUpStepDownInputTypePrcnt ? [Validators.max(100)] : []]
      });
      (this.ParentForm.controls.ListEntryInst as FormArray).push(group);
    }
    this.SetNeedReCalculate(true);
  }


  CalculateAmortization() {
    if(this.ValidateFee() == false){
      return;
    }    
    if(this.ParentForm.controls.StepUpStepDownInputType.value == ""){
      this.toastr.warningMessage(ExceptionConstant.STEP_UP_STEP_DOWN_TYPE);
      return;
    } 

    this.calcStepUpStepDownObj = this.ParentForm.value;
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
      }
    );
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

  ValidateFee(){
    for(let i = 0; i < this.ParentForm.controls["AppFee"]["controls"].length; i++){
      if(this.ParentForm.controls["AppFee"].value[i].IsCptlz == true
          && this.ParentForm.controls["AppFee"].value[i].AppFeeAmt < this.ParentForm.controls["AppFee"].value[i].FeeCapitalizeAmt){
        this.toastr.warningMessage(this.ParentForm.controls["AppFee"].value[i].FeeTypeName + " Capitalized Amount can't be higher than " +  this.ParentForm.controls["AppFee"].value[i].AppFeeAmt);
        return false;
      }
    }
    return true;
  }

  test() {

  }
}