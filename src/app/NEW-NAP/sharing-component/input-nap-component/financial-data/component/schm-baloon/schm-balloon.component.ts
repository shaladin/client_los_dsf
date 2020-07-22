import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { environment } from 'environments/environment';
import { CalcBalloonObj } from 'app/shared/model/AppFinData/CalcBalloonObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-schm-balloon',
  templateUrl: './schm-balloon.component.html',
})
export class SchmBalloonComponent implements OnInit {

  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcBalloonObj : CalcBalloonObj = new CalcBalloonObj();
  listInstallment: any;
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

    this.http.post<AppObj>(URLConstant.GetAppById, { AppId: this.AppId}).subscribe(
      (response) => {
        this.result = response;
        if(this.result.BizTemplateCode == CommonConstant.CFRFN4W){
          this.PriceLabel = "Financing Amount";
        }
      },
      (error) => {
        console.log(error);
      }
    );
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

  CalcBaseOnRate() {
    if(this.ValidateFee() == false){
      return;
    }
    if(this.ParentForm.get("BalloonValueAmt").value < 1){
      this.toastr.warningMessage(ExceptionConstant.BALLOON_AMOUNT_MUST_HIGHER_THAN + '0.');
      return;
    }
    this.calcBalloonObj = this.ParentForm.value;
    this.calcBalloonObj["IsRecalculate"] = false;
    this.http.post<ResponseCalculateObj>(environment.losUrl + "/AppFinData/CalculateInstallmentBalloon", this.calcBalloonObj).subscribe(
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
          DiffRateAmt: response.DiffRateAmt,
          ApvAmt: response.ApvAmt,

          TotalLifeInsCustAmt: response.TotalLifeInsCustAmt,
          LifeInsCptlzAmt: response.LifeInsCptlzAmt,

          DownPaymentGrossAmt: response.DownPaymentGrossAmt,
          DownPaymentNettAmt: response.DownPaymentNettAmt

        })

        this.SetInstallmentTable();
        this.SetNeedReCalculate(false);
      }
    );
  }

  CalcBaseOnInst() {
    if(this.ValidateFee() == false){
      return;
    }    
    if(this.ParentForm.get("BalloonValueAmt").value < 1){
      this.toastr.warningMessage(ExceptionConstant.BALLOON_AMOUNT_MUST_HIGHER_THAN + '0.');
      return;
    }
    
    this.calcBalloonObj = this.ParentForm.value;
    this.calcBalloonObj["IsRecalculate"] = true;
    this.http.post<ResponseCalculateObj>(environment.losUrl + "/AppFinData/CalculateInstallmentBalloon", this.calcBalloonObj).subscribe(
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
          DiffRateAmt: response.DiffRateAmt,
          ApvAmt: response.ApvAmt,

          TotalLifeInsCustAmt: response.TotalLifeInsCustAmt,
          LifeInsCptlzAmt: response.LifeInsCptlzAmt,

          DownPaymentGrossAmt: response.DownPaymentGrossAmt,
          DownPaymentNettAmt: response.DownPaymentNettAmt

        });

        this.SetInstallmentTable();
        this.SetNeedReCalculate(false);
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
    // var EffectiveRatePrcnt = this.ParentForm.get("EffectiveRatePrcnt").value
    // var SupplEffectiveRatePrcnt = this.ParentForm.get("SupplEffectiveRatePrcnt").value
    // var StdEffectiveRatePrcnt = this.ParentForm.get("StdEffectiveRatePrcnt").value
    // var DiffRateAmtStd = +StdEffectiveRatePrcnt - +SupplEffectiveRatePrcnt

    // var diffRate = +EffectiveRatePrcnt - +SupplEffectiveRatePrcnt;
    // if (diffRate < DiffRateAmtStd) {
    //   this.ParentForm.patchValue({
    //     DiffRateAmt: 0
    //   });
    // }
    // else {
    //   this.ParentForm.patchValue({
    //     DiffRateAmt: DiffRateAmtStd
    //   });
    // }

    this.ParentForm.patchValue({
          DiffRateAmt: 0
        });

    this.SetNeedReCalculate(true);
  }

  SetNeedReCalculate(value) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
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

}
