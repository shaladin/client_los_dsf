import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ResponseCalculateObj } from 'app/shared/model/app-fin-data/response-calculate-obj.model';
import { environment } from 'environments/environment';
import { AppObj } from 'app/shared/model/app/app.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CalcIrregularObjForTrialCalc } from 'app/shared/model/app-fin-data/calc-irregular-obj-for-trial-calc.model';

@Component({
  selector: 'app-schm-irregular-cfna',
  templateUrl: './schm-irregular-cfna.component.html',
})
export class SchmIrregularCFNAComponent implements OnInit {
  @Input() AppId: number = 0;
  @Input() ParentForm: FormGroup;
  @Input() NumOfInst: number;
  @Input() TrialCalc: boolean = false;
  @Input() ProductOfferingCode: string;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  listInstallment: any;
  result: AppObj = new AppObj();
  PriceLabel: string = "Financing Amount";
  ProdOfferingVersion: string;
  calcIrregularObjForTrialCalc: CalcIrregularObjForTrialCalc = new CalcIrregularObjForTrialCalc();

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.SetEntryInstallment();
    this.ParentForm.get("FlatRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("EffectiveRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("FlatRatePrcnt").updateValueAndValidity();
    this.ParentForm.get("EffectiveRatePrcnt").updateValueAndValidity();
    if (this.AppId != 0) {
      this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
        (response) => {
          this.result = response;
          if (this.result.BizTemplateCode == CommonConstant.CFRFN4W) {
            this.PriceLabel = "Financing Amount";
          }
        });
      this.TrialCalc = false;
    }
    if (this.TrialCalc) {
      this.GetProductOfferingVersion();
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

  SetEntryInstallment() {
    var numOfStep = +this.ParentForm.get("NumOfInst").value - 1
    while ((this.ParentForm.controls.ListEntryInst as FormArray).length) {
      (this.ParentForm.controls.ListEntryInst as FormArray).removeAt(0);
    }
    for (let i = 0; i < numOfStep; i++) {
      const group = this.fb.group({
        InstSeqNo: i + 1,
        NumOfInst: [0],
        InstAmt: [0]
      });
      (this.ParentForm.controls.ListEntryInst as FormArray).push(group);
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

  CalculateAmortization() {
    var calcIrregularObj = this.ParentForm.value;
    calcIrregularObj["IsRecalculate"] = false;

    var IdxKosong = calcIrregularObj.ListEntryInst.findIndex(x => x.InstAmt == 0);
    if (IdxKosong != -1) {
      this.toastr.warningMessage(ExceptionConstant.INPUT_INST_AMOUNT + (IdxKosong + 1));
      return;
    }
    if (this.ValidateFee() == false) {
      return;
    }

    if (this.TrialCalc) {
      this.calcIrregularObjForTrialCalc = this.ParentForm.getRawValue();
      this.calcIrregularObjForTrialCalc.ProdOfferingCode = this.ProductOfferingCode;
      this.calcIrregularObjForTrialCalc.ProdOfferingVersion = this.ProdOfferingVersion;
      this.calcIrregularObjForTrialCalc["IsRecalculate"] = false;
    }
    this.http.post<ResponseCalculateObj>(this.GetUrlCalc(), this.TrialCalc ? this.calcIrregularObjForTrialCalc : calcIrregularObj).subscribe(
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
      }
    );
  }

  GetUrlCalc(): string {
    if (!this.TrialCalc) return URLConstant.CalculateIrregular;
    return URLConstant.CalculateIrregularForTrialCalc;
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

  SetNeedReCalculate(value: boolean) {
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

  GetProductOfferingVersion() {
    this.http.post(URLConstant.GetProdOfferingHByProdOfferingCode, { Code: this.ProductOfferingCode }).subscribe(
      (response: any) => {
        this.ProdOfferingVersion = response.ProdOfferingVersion
      });
  }
}