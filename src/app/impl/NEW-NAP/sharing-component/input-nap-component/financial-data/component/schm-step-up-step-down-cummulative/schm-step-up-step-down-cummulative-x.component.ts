import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormGroupDirective, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppInstStepSchmObj } from 'app/shared/model/AppInstStepSchm/AppInstStepSchmObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { CalcStepUpStepDownObjForTrialCalc } from 'app/shared/model/AppFinData/CalcStepUpStepDownObjForTrialCalc.Model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { CalcStepUpStepDownObjX } from 'app/impl/shared/model/AppFinData/CalcStepUpStepDownObjX.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-schm-step-up-step-down-cummulative-x',
  templateUrl: './schm-step-up-step-down-cummulative-x.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SchmStepUpStepDownCummulativeXComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm: FormGroup;
  @Input() BizTemplateCode: string;
  @Input() TrialCalc: boolean;
  @Input() InstAmt: number;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  CalcBaseOptions: Array<RefMasterObj> = new Array<RefMasterObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcStepUpStepDownObj: CalcStepUpStepDownObjX = new CalcStepUpStepDownObjX();
  calcStepUpStepDownObjForTrialCalc: CalcStepUpStepDownObjForTrialCalc = new CalcStepUpStepDownObjForTrialCalc();
  listInstallment: Array<InstallmentObj>;
  listAppInstStepSchm: Array<AppInstStepSchmObj> = new Array<AppInstStepSchmObj>();
  PriceLabel: string = CommonConstant.FinancialPriceLabel;
  IsTrialCalc: boolean = false;
  IsFirstCalc: boolean = true;
  EffRateAfterCalc: number = 0;
  FlatRateAfterCalc: number = 0;

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.LoadCalcBaseType();
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
    if (this.ParentForm.getRawValue().ExistingFinData) {
      this.EffRateAfterCalc = this.ParentForm.getRawValue().EffectiveRatePrcnt;
      this.FlatRateAfterCalc = this.ParentForm.getRawValue().FlatRatePrcnt;
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
        this.CalcBaseOptions = this.CalcBaseOptions.filter(x => x.MappingCode.indexOf(CommonConstant.InstSchmStepUpStepDownCummulative) !== -1);

        if (this.CalcBaseOptions.length > 0) {
          this.ParentForm.patchValue({
            CalcBase: this.CalcBaseOptions[0].MasterCode
          });
          this.SetEnableDisableInputByCalcBase(this.CalcBaseOptions[0].MasterCode);
          if (this.ParentForm.getRawValue().ExistingFinData) {
            this.ParentForm.patchValue({
              IsReCalculate: true
            });
          }
        }
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
    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate) {
      if ((this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective && this.EffRateAfterCalc == this.ParentForm.getRawValue().EffectiveRatePrcnt)
        || (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeFlat && this.FlatRateAfterCalc == this.ParentForm.getRawValue().FlatRatePrcnt)) {
        this.ParentForm.patchValue({
          IsReCalculate: true
        });
      } else {
        this.ParentForm.patchValue({
          IsReCalculate: false
        });
      }
    } else if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnInst) {
      this.ParentForm.patchValue({
        IsReCalculate: true
      });
    } else {
      this.ParentForm.patchValue({
        IsReCalculate: false
      });
    }
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }

  Calculate() {
    if (this.ParentForm.getRawValue().CalcBase == '') {
      this.toastr.warningMessage(ExceptionConstant.CHOOSE_CALCULATE_BASE);
      return;
    }
    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnInst && this.ParentForm.getRawValue().InstAmt <= 0) {
      this.toastr.warningMessage(ExceptionConstant.INST_AMOUNT_MUST_HIGHER_THAN + " 0");
      return;
    }
    if (this.ValidateFee() == false) {
      return;
    }
    if (this.ParentForm.controls.CummulativeTenor.value <= 0) {
      this.toastr.warningMessage(ExceptionConstant.CUMMULATIVE_TENOR_MUST_HIGHER_THAN + '0.');
      return;
    }
    if (this.ParentForm.controls.DownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "Down Payment");
      return;
    }
    if (!this.IsTrialCalc) {
      this.calcStepUpStepDownObj = this.ParentForm.getRawValue();
      this.calcStepUpStepDownObj["StepUpStepDownType"] = this.ParentForm.getRawValue().MrInstSchemeCode;

      this.http.post(URLConstantX.CalculateInstallmentStepUpStepDownX, this.calcStepUpStepDownObj).subscribe(
        (response) => {
          //Start SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
          response["CommissionAmtFromDiffRate"] = 0;
          //End SITDSFCFRTHREE-169
          this.listInstallment = response["InstallmentTable"];
          this.listAppInstStepSchm = response["AppInstStepSchmObjs"];
          this.EffRateAfterCalc = response["EffectiveRatePrcnt"];
          this.FlatRateAfterCalc = response["FlatRatePrcnt"];
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
            DownPaymentNettAmt: response["DownPaymentNettAmt"],

            
            CurrGrossYieldAmt: response["CurrGrossYieldAmt"],
            StdGrossYieldAmt: response["StdGrossYieldAmt"],
            DiffGrossYieldAmt: response["DiffGrossYieldAmt"],

            //Start SITDSFCFRTHREE-171 : Suppl Rate di DSF selalu sama dng Effective rate
            AppSupplEffectiveRatePrcnt: response["EffectiveRatePrcnt"]
            //End SITDSFCFRTHREE-171

          })
          this.ParentForm.patchValue({
            IsReCalculate: true
          });
          this.SetInstallmentTable();
          this.SetInstStepSchm();
          this.SetNeedReCalculate(false);
        }
      );
    } else {
      this.calcStepUpStepDownObjForTrialCalc = this.ParentForm.getRawValue();
      this.calcStepUpStepDownObjForTrialCalc["StepUpStepDownType"] = this.ParentForm.getRawValue().MrInstSchemeCode;

      this.http.post(URLConstant.CalculateInstallmentStepUpStepDownForTrialCalc, this.calcStepUpStepDownObjForTrialCalc).subscribe(
        (response) => {
          //Start SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
          response["CommissionAmtFromDiffRate"] = 0;
          //End SITDSFCFRTHREE-169
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
            DownPaymentNettAmt: response["DownPaymentNettAmt"],

            //Start SITDSFCFRTHREE-171 : Suppl Rate di DSF selalu sama dng Effective rate
            AppSupplEffectiveRatePrcnt: response["EffectiveRatePrcnt"]
            //End SITDSFCFRTHREE-171

          })
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
    var EffectiveRatePrcnt = this.ParentForm.get("EffectiveRatePrcnt").value
    this.ParentForm.patchValue({
      AppSupplEffectiveRatePrcnt: this.ParentForm.get("EffectiveRatePrcnt").value
    });
    var SupplEffectiveRatePrcnt = this.ParentForm.get("AppSupplEffectiveRatePrcnt").value
    var StdEffectiveRatePrcnt = this.ParentForm.get("StdEffectiveRatePrcnt").value
    var DiffRateAmtStd = +StdEffectiveRatePrcnt - +SupplEffectiveRatePrcnt

    var diffRate = +EffectiveRatePrcnt - +SupplEffectiveRatePrcnt;
    if (diffRate < DiffRateAmtStd) {
      this.ParentForm.patchValue({
        DiffRateAmt: 0
      });
    }
    else if (DiffRateAmtStd < 0) {
      this.ParentForm.patchValue({
        DiffRateAmt: 0,
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

  CalcBaseChanged(event) {
    this.SetEnableDisableInputByCalcBase(event.target.value);
    this.SetNeedReCalculate(true);
  }

  SetEnableDisableInputByCalcBase(calcBase) {
    if (calcBase == CommonConstant.FinDataCalcBaseOnRate) {
      this.ParentForm.get("EffectiveRatePrcnt").enable();
      this.ParentForm.get("InstAmt").disable();
      this.ParentForm.patchValue({
        IsReCalculate: false
      });
    } else if (calcBase == CommonConstant.FinDataCalcBaseOnInst) {
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").enable();
      this.ParentForm.patchValue({
        IsReCalculate: true
      });
    } else if (calcBase == CommonConstant.FinDataCalcBaseOnCommission) {
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").disable();
    } else {
      this.ParentForm.get("EffectiveRatePrcnt").enable();
      this.ParentForm.get("InstAmt").enable();
    }
  }

  test() {
  }


}
