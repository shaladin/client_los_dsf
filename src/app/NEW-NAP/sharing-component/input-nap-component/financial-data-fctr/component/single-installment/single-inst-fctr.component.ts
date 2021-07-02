import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { CalcSingleInstObj } from 'app/shared/model/AppFinData/CalcSingleInstObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';

@Component({
  selector: 'app-single-inst-fctr',
  templateUrl: './single-inst-fctr.component.html',
})
export class SingleInstFctrComponent implements OnInit {

  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  InterestTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcSingleInstObj: CalcSingleInstObj = new CalcSingleInstObj();
  listInstallment: Array<InstallmentObj>;
  IsAppFeePrcntValid: boolean = true;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  ngOnInit() {
    this.LoadDDLInterestType();
  }

  LoadDDLInterestType() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInterestInputType }).subscribe(
      (response) => {
        this.InterestTypeOptions = response[CommonConstant.ReturnObj];
        if (this.InterestTypeOptions != undefined && this.InterestTypeOptions != null) {
          this.ParentForm.patchValue({
            InterestType: this.InterestTypeOptions[0].Key
          });
          this.SetInterestTypeInput(this.InterestTypeOptions[0].Key);
        }
      }
    );
  }

  Calculate() {
    this.IsAppFeePrcntValid = true;
    if (this.ParentForm.value.EstEffDt == "") {
      this.toastr.warningMessage(ExceptionConstant.INSERT_ESTIMATION_EFFECTIVE_DATE);
      return;
    }
    for (let i = 0; i < this.ParentForm.value.AppFee.length; i++) {
      if (this.ParentForm.value.AppFee[i].AppFeePrcnt < 0) {
        this.IsAppFeePrcntValid = false;
      }
    }
    if (this.IsAppFeePrcntValid == false) {
      this.toastr.warningMessage(ExceptionConstant.APP_FEE_PRCNT_MUST_GREATER + '0.');
      return;
    }
    if (this.ParentForm.value.EffectiveRatePrcnt < 0 && this.ParentForm.value.InterestType == "PRCNT") {
      this.toastr.warningMessage(ExceptionConstant.EFFECTIVE_RATE_MUST_GREATER + '0.');
      return;
    }
    else {
      this.calcSingleInstObj = this.ParentForm.value;
      this.http.post<ResponseCalculateObj>(URLConstant.CalculateSingleInst, this.calcSingleInstObj).subscribe(
        (response) => {
          this.listInstallment = response.InstallmentTable;
          this.ParentForm.patchValue({
            EffectiveRatePrcnt: response.EffectiveRatePrcnt,
            InstAmt: response.InstAmt,
            TotalInterestAmt: response.TotalInterestAmt,
            TotalAR: response.TotalARAmt,
            NtfAmt: response.NtfAmt,
            RefundInterestAmt: response.RefundInterestAmt,
            TotalDisbAmt: response.TotalDisbAmt,
            GrossYieldPrcnt: response.GrossYieldPrcnt
          });

          this.SetInstallmentTable();
          this.SetNeedReCalculate(false);
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
        OsInterestAmt: this.listInstallment[i].OsInterestAmt,
        DueDt: this.listInstallment[i].DueDt
      });
      (this.ParentForm.controls.InstallmentTable as FormArray).push(group);
    }
  }

  InterestTypeChanged(ev) {
    this.SetInterestTypeInput(ev.target.value);
  }

  SetInterestTypeInput(interestInputType: string) {
    if (interestInputType == CommonConstant.InterestInputTypeAmt) {
      this.ParentForm.controls.TotalInterestAmt.enable();
      this.ParentForm.controls.EffectiveRatePrcnt.disable();
    }
    if (interestInputType == CommonConstant.InterestInputTypePrcnt) {
      this.ParentForm.controls.TotalInterestAmt.disable();
      this.ParentForm.controls.EffectiveRatePrcnt.enable();
    }
  }

  SetNeedReCalculate(value: boolean) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }

  EstEffDtFocusOut(event) {
    var topBased = this.ParentForm.get("TopBased").value;
    var maturityDate: Date;
    if (topBased == CommonConstant.TopCalcBasedInvcDt) {
      maturityDate = new Date(this.ParentForm.get("InvcDt").value);
      maturityDate.setDate(maturityDate.getDate() + this.ParentForm.get("TopDays").value);
    }

    if (topBased == CommonConstant.TopCalcBasedEffDt) {
      maturityDate = new Date(this.ParentForm.get("EstEffDt").value);
      maturityDate.setDate(maturityDate.getDate() + this.ParentForm.get("TopDays").value);
    }

    this.ParentForm.patchValue({
      MaturityDate: new Date(Date.UTC(maturityDate.getFullYear(), maturityDate.getMonth(), maturityDate.getDate()))
    });
  }
}
