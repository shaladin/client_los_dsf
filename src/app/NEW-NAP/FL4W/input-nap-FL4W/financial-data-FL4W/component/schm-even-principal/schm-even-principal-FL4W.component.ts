import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormGroupDirective, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ResponseCalculateObj } from 'app/shared/model/app-fin-data/response-calculate-obj.model';
import { CalcEvenPrincipleObj } from 'app/shared/model/app-fin-data/calc-even-principle-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { CalcEvenPrincipleObjForTrialCalc } from 'app/shared/model/app-fin-data/calc-even-principle-obj-for-trial-calc.model';

@Component({
  selector: 'app-schm-even-principal-FL4W',
  templateUrl: './schm-even-principal-FL4W.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SchmEvenPrincipalFL4WComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm: FormGroup;
  @Input() TrialCalc: boolean;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  CalcBaseOptions: Array<RefMasterObj> = new Array<RefMasterObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcEvenPrincipleObj: CalcEvenPrincipleObj = new CalcEvenPrincipleObj();
  calcEvenPrincipleObjForTrialCalc: CalcEvenPrincipleObjForTrialCalc = new CalcEvenPrincipleObjForTrialCalc();
  listInstallment: any;
  result: AppObj = new AppObj();
  PriceLabel: string = "Asset Price";
  IsTrialCalc: boolean = false;

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
  private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService
    ) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.LoadCalcBaseType();
    this.ParentForm.get("FlatRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("EffectiveRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("FlatRatePrcnt").updateValueAndValidity();
    this.ParentForm.get("EffectiveRatePrcnt").updateValueAndValidity();
    if (this.AppId != null) {
    this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
      (response) => {
        this.result = response;
        if (this.result.BizTemplateCode == CommonConstant.CFRFN4W) {
          this.PriceLabel = "Financing Amount";
        }
      });
      this.IsTrialCalc = false;
    }
    else if (this.TrialCalc != null && this.TrialCalc) {
      this.IsTrialCalc = true;
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
        this.CalcBaseOptions = this.CalcBaseOptions.filter(x => x.MappingCode.indexOf(CommonConstant.InstSchmEvenPrincipal) !== -1);

        if(this.CalcBaseOptions.length == 1){
          this.ParentForm.patchValue({
            CalcBase: this.CalcBaseOptions[0].MasterCode
          });
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


  Calculate() {
    if(this.ParentForm.getRawValue().CalcBase == ''){
      this.toastr.warningMessage(ExceptionConstant.CHOOSE_CALCULATE_BASE);
      return;
    }

    if (this.ValidateFee() == false) {
      return;
    }

    if (!this.IsTrialCalc) {
    this.calcEvenPrincipleObj = this.ParentForm.getRawValue();

    this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentEvenPrincipal, this.calcEvenPrincipleObj).subscribe(
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
  }else {
      this.calcEvenPrincipleObjForTrialCalc = this.ParentForm.getRawValue();

      this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentEvenPrincipalForTrialCalc, this.calcEvenPrincipleObjForTrialCalc).subscribe(
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
  }

  SetNeedReCalculate(value: boolean) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
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
        this.toastr.warningMessage(ExceptionConstant.GROSS_YIELD_CANNOT_GREATER_THAN+ StdGrossYieldPrcnt + "%");
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

  test() {

  }
}