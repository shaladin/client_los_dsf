import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-schm-reguler-fix-fctr',
  templateUrl: './schm-reguler-fix-fctr.component.html',
})
export class SchmRegulerFixFctrComponent implements OnInit {

  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcRegFixObj: CalcRegularFixObj = new CalcRegularFixObj();
  listInstallment: any;
  responseCalc: any;
  IsAppFeePrcntValid: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
  }

  LoadDDLRateType() {
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: "RATE_TYPE" }).subscribe(
      (response) => {
        this.RateTypeOptions = response["ReturnObject"];
      }
    );
  }

  LoadDDLGracePeriodType() {
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: "GRACE_PERIOD_TYPE" }).subscribe(
      (response) => {
        this.GracePeriodeTypeOptions = response["ReturnObject"];
      }
    );
  }

  CalcBaseOnRate() {
    if(this.ParentForm.value.EstEffDt == "")
    {
      this.toastr.errorMessage("Insert Estimation Effective Date");
      return;
    }
    this.calcRegFixObj = this.ParentForm.value;
    this.calcRegFixObj["IsRecalculate"] = false;
    this.http.post<ResponseCalculateObj>(AdInsConstant.CalculateInstallmentRegularFixFctr, this.calcRegFixObj).subscribe(
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
          DiffRateAmt: response.DiffRateAmt

        })

        this.SetInstallmentTable();
        this.SetNeedReCalculate(false);
      }
    );
  }

  CalcBaseOnInst() {
    this.IsAppFeePrcntValid = true;
    if (this.ParentForm.value.EstEffDt == "") {
      this.toastr.errorMessage("Insert Estimation Effective Date");
      return;
    }
    for (let i = 0; i < this.ParentForm.value.AppFee.length; i++) {
      if (this.ParentForm.value.AppFee[i].AppFeePrcnt < 0) {
        this.IsAppFeePrcntValid = false;
      }
    }
    if (this.IsAppFeePrcntValid == false) {
      this.toastr.errorMessage("App Fee Prcnt must be greater than 0");
      return;
    }
    if (this.ParentForm.value.EffectiveRatePrcnt < 0) {
      this.toastr.errorMessage("Effective Rate must be greater than 0");
      return;
    }
    this.calcRegFixObj = this.ParentForm.value;
    this.calcRegFixObj["IsRecalculate"] = true;
    this.http.post<ResponseCalculateObj>(AdInsConstant.CalculateInstallmentRegularFixFctr, this.calcRegFixObj).subscribe(
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
          DiffRateAmt: response.DiffRateAmt


        })

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

  EstEffDtFocusOut(event){
    var maturityDate: Date = new Date(this.ParentForm.get("EstEffDt").value);
    maturityDate.setMonth(maturityDate.getMonth() + this.ParentForm.get("Tenor").value);

    this.ParentForm.patchValue({
      MaturityDate: maturityDate
    });
  }
}
