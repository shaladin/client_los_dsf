import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { environment } from 'environments/environment';
import { CalcEvenPrincipleObj } from 'app/shared/model/AppFinData/CalcEvenPrincipleObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';

@Component({
  selector: 'app-schm-even-principal-fctr',
  templateUrl: './schm-even-principal-fctr.component.html',
})
export class SchmEvenPrincipalFctrComponent implements OnInit {

  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcEvenPrincipleObj: CalcEvenPrincipleObj = new CalcEvenPrincipleObj();
  listInstallment: Array<InstallmentObj>;
  IsAppFeePrcntValid: boolean = true;

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.ParentForm.get("FlatRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("EffectiveRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("FlatRatePrcnt").updateValueAndValidity();
    this.ParentForm.get("EffectiveRatePrcnt").updateValueAndValidity();
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

  CalculateInstallment() {
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
    if (this.ParentForm.value.EffectiveRatePrcnt < 0) {
      this.toastr.warningMessage(ExceptionConstant.EFFECTIVE_RATE_MUST_GREATER + '0.');
      return;
    }

    this.calcEvenPrincipleObj = this.ParentForm.getRawValue();
    this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentEvenPrincipalFctr, this.calcEvenPrincipleObj).subscribe(
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
    this.ParentForm.patchValue({
      DiffRateAmt: 0
    });

    this.SetNeedReCalculate(true);
  }

  SetNeedReCalculate(value: boolean) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }

  EstEffDtFocusOut(event) {
    var maturityDate: Date = new Date(this.ParentForm.get("EstEffDt").value);
    maturityDate.setMonth(maturityDate.getMonth() + this.ParentForm.get("Tenor").value);

    this.ParentForm.patchValue({
      MaturityDate: maturityDate
    });
  }
}
