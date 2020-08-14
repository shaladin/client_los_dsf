import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { environment } from 'environments/environment';
import { AppObj } from 'app/shared/model/App/App.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';

@Component({
  selector: 'app-schm-reguler-fix-cfna',
  templateUrl: './schm-reguler-fix-cfna.component.html',
})
export class SchmRegulerFixCFNAComponent implements OnInit {

  @Input() AppId: number;
  @Input() ParentForm: FormGroup;
  @Output() RefreshSubsidy = new EventEmitter();


  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  CalcBaseOptions: Array<RefMasterObj> = new Array<RefMasterObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcRegFixObj: CalcRegularFixObj = new CalcRegularFixObj();
  listInstallment: any;
  responseCalc: any;
  result: AppObj = new AppObj();
  PriceLabel: string = "Financing Amount";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.LoadCalcBaseType();
    this.http.post<AppObj>(URLConstant.GetAppById, { AppId: this.AppId }).subscribe(
      (response) => {
        this.result = response;
        if (this.result.BizTemplateCode == CommonConstant.CFRFN4W) {
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

  LoadCalcBaseType() {
    this.http.post(URLConstant.GetListActiveRefMaster, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeFinDataCalcBaseOn  }).subscribe(
      (response) => {
        this.CalcBaseOptions = response[CommonConstant.ReturnObj];
        this.CalcBaseOptions = this.CalcBaseOptions.filter(x => x.ReserveField1.indexOf(CommonConstant.InstSchmRegularFix) !== -1);

        if(this.CalcBaseOptions.length == 1){
          this.ParentForm.patchValue({
            CalcBase: this.CalcBaseOptions[0].MasterCode
          });
          this.SetEnableDisableInputByCalcBase(this.CalcBaseOptions[0].MasterCode);
        }
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

  Calculate(){
    if(this.ParentForm.getRawValue().CalcBase == ''){
      this.toastr.warningMessage(ExceptionConstant.CHOOSE_CALCULATE_BASE);
      return;
    }
    if(this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnInst && this.ParentForm.getRawValue().InstAmt <= 0){
      this.toastr.warningMessage(ExceptionConstant.INST_AMOUNT_MUST_HIGHER_THAN + " 0");
      return;
    }
    if(this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
        && this.ParentForm.controls.IsSubsidyRateExist.value == false 
        && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().StdEffectiveRatePrcnt)
    {
      this.toastr.warningMessage(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_STD_RATE);
      return;  
    }

    if(this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
        && this.ParentForm.controls.IsSubsidyRateExist.value == true 
        && this.ParentForm.getRawValue().EffectiveRatePrcnt > this.ParentForm.getRawValue().StdEffectiveRatePrcnt)
    {
      this.toastr.warningMessage(ExceptionConstant.EFF_RATE_CANNOT_GREATER_THAN_STD_RATE);
      return;  
    }

    if (this.ValidateFee() == false) {
      return;
    }

    this.calcRegFixObj = this.ParentForm.getRawValue();
    this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentRegularFix, this.calcRegFixObj).subscribe(
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
          SupplEffectiveRatePrcnt: response.SupplEffectiveRatePrcnt
        })
        this.SetSubsidyAmtFromDiffRateInput(response.SubsidyAmtFromDiffRate);
        this.SetCommissionAmtFromDiffRateInput(response.CommissionAmtFromDiffRate);
        this.SetInstallmentTable();
        this.SetNeedReCalculate(false);

        if(this.ParentForm.controls.IsSubsidyRateExist.value == true){
          this.RefreshSubsidy.emit();
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

  SetSubsidyAmtFromDiffRateInput(subsidyAmtFromDiffRate){
    if(subsidyAmtFromDiffRate > 0){
      this.ParentForm.patchValue({
        CommissionAmtFromDiffRate: 0
      });
      this.ParentForm.get("CommissionAmtFromDiffRate").disable();
    }
    else{
      if(this.ParentForm.controls.IsSubsidyRateExist.value == false){
        this.ParentForm.get("CommissionAmtFromDiffRate").enable(); 
      }
    }
  }

  CommissionAmtFromDiffRate_FocusOut(event){
    this.SetCommissionAmtFromDiffRateInput(event.target.value);
    this.SetNeedReCalculate(true);
  }

  SetCommissionAmtFromDiffRateInput(commissionAmtFromDiffRate){
    if(commissionAmtFromDiffRate > 0){
      this.ParentForm.patchValue({
        SubsidyAmtFromDiffRate: 0
      });
      if(this.ParentForm.controls.IsSubsidyRateExist.value == false){
        this.ParentForm.get("CommissionAmtFromDiffRate").enable();
      }
    }
  }

  CalcBaseChanged(event){
    this.SetEnableDisableInputByCalcBase(event.target.value);
    this.SetNeedReCalculate(true);
  }

  SetEnableDisableInputByCalcBase(calcBase){
    if(calcBase == CommonConstant.FinDataCalcBaseOnRate){
      this.ParentForm.get("RateType").enable();
      this.ParentForm.get("EffectiveRatePrcnt").enable();
      this.ParentForm.get("InstAmt").disable();
    }else if(calcBase == CommonConstant.FinDataCalcBaseOnInst){
      this.ParentForm.get("RateType").disable();
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").enable();
    }else if(calcBase == CommonConstant.FinDataCalcBaseOnCommission){
      this.ParentForm.get("RateType").disable();
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").disable();
    }else{
      this.ParentForm.get("RateType").enable();
      this.ParentForm.get("EffectiveRatePrcnt").enable();
      this.ParentForm.get("InstAmt").enable();
    }
  }

  SetNeedReCalculate(value) {
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
