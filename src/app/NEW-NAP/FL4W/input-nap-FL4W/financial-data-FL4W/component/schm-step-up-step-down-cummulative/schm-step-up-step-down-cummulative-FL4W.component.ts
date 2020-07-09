import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlContainer, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { CalcStepUpStepDownObj } from 'app/shared/model/AppFinData/CalcStepUpStepDownObj.Model';
import { AppInstStepSchmObj } from 'app/shared/model/AppInstStepSchm/AppInstStepSchmObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-schm-step-up-step-down-cummulative-FL4W',
  templateUrl: './schm-step-up-step-down-cummulative-FL4W.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SchmStepUpStepDownCummulativeFL4WComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcStepUpStepDownObj: CalcStepUpStepDownObj = new CalcStepUpStepDownObj();
  listInstallment: any;
  listAppInstStepSchm: Array<AppInstStepSchmObj> = new Array<AppInstStepSchmObj>();
  responseCalc: any;
  result: AppObj = new AppObj();
  PriceLabel: string = "Asset Price";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.http.post<AppObj>(AdInsConstant.GetAppById, { AppId: this.AppId}).subscribe(
      (response) => {
        this.result = response;
        if(this.result.BizTemplateCode == "CFRFN4W"){
          this.PriceLabel = "Financing Amount";
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  LoadDDLRateType() {
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeRateType }).subscribe(
      (response) => {
        this.RateTypeOptions = response["ReturnObject"];
      }
    );
  }

  LoadDDLGracePeriodType() {
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGracePeriodType }).subscribe(
      (response) => {
        this.GracePeriodeTypeOptions = response["ReturnObject"];
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

  SetNeedReCalculate(value) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }

  CalcBaseOnRate() {
    if(this.ValidateFee() == false){
      return;
    }    
    if(this.ParentForm.controls.CummulativeTenor.value <= 0){
      this.toastr.warningMessage(ExceptionConstant.CUMMULATIVE_TENOR_MUST_HIGHER_THAN + '0.');
      return;
    }

    this.calcStepUpStepDownObj = this.ParentForm.value;
    this.calcStepUpStepDownObj["IsRecalculate"] = false;
    this.calcStepUpStepDownObj["StepUpStepDownType"] = this.ParentForm.value.MrInstSchemeCode;

    this.http.post(AdInsConstant.CalculateInstallmentStepUpStepDown, this.calcStepUpStepDownObj).subscribe(
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
        this.SetInstallmentTable();
        this.SetInstStepSchm();
        this.SetNeedReCalculate(false);
      }
    );
  }

  CalcBaseOnInst() {
    if(this.ValidateFee() == false){
      return;
    }    
    if(this.ParentForm.controls.CummulativeTenor.value <= 0){
      this.toastr.errorMessage("Cummulative Tenor must be higher than 0.");
      return;
    }
    this.calcStepUpStepDownObj = this.ParentForm.value;
    this.calcStepUpStepDownObj["IsRecalculate"] = true;
    this.calcStepUpStepDownObj["StepUpStepDownType"] = this.ParentForm.value.MrInstSchemeCode;

    this.http.post<ResponseCalculateObj>(AdInsConstant.CalculateInstallmentStepUpStepDown, this.calcStepUpStepDownObj).subscribe(
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

        this.SetNeedReCalculate(false);
      }
    );
  }

  SaveAndContinue() {
    var isValidGrossYield = this.ValidateGrossYield();
    var isValidGracePeriod = this.ValidateGracePeriode();

    if (isValidGrossYield && isValidGracePeriod) {
      console.log("GROSSSS");
    }
  }

  ValidateGracePeriode() {
    var valid: boolean = true;
    var gracePeriodType = this.ParentForm.get("MrGracePeriodTypeCode").value
    var gracePeriod = this.ParentForm.get("GracePeriod").value

    if (gracePeriodType != "") {
      if (gracePeriod == 0) {
        valid = false;
        this.toastr.errorMessage("Grace Period must be set");
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
        this.toastr.errorMessage("Gross Yield cannot be less than " + StdGrossYieldPrcnt + "%");
        valid = false;
      }
    }
    else {
      if (GrossYieldPrcnt > StdGrossYieldPrcnt) {
        this.toastr.errorMessage("Gross Yield cannot be greater than " + StdGrossYieldPrcnt + "%");
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
        this.toastr.errorMessage(this.ParentForm.controls["AppFee"].value[i].FeeTypeName + " Capitalized Amount can't be higher than " +  this.ParentForm.controls["AppFee"].value[i].AppFeeAmt);
        return false;
      }
    }
    return true;
  }

  test() {
    console.log(this.ParentForm)
    console.log(this.ParentForm.value);
  }


}
