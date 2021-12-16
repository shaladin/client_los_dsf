import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { String } from 'typescript-string-operations';
import { CalcBalloonObjX } from 'app/impl/shared/model/AppFinData/CalcBalloonObjX.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ResponseCalculateObjX } from 'app/impl/shared/model/AppFinData/ResponseCalculateObjX.Model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { CalcBalloonObjForTrialCalc } from 'app/shared/model/app-fin-data/calc-balloon-obj-for-trial-calc.model';
import { InstallmentObj } from 'app/shared/model/app-fin-data/installment-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';

@Component({
  selector: 'app-schm-balloon-x',
  templateUrl: './schm-balloon-x.component.html',
})
export class SchmBalloonXComponent implements OnInit {
  @Input() InstAmt: number;
  @Input() TrialCalc: boolean;
  @Input() AppId: number;
  @Input() ParentForm: FormGroup;
  @Output() RefreshSubsidy = new EventEmitter();
  @Input() BizTemplateCode: string;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  CalcBaseOptions: Array<RefMasterObj> = new Array<RefMasterObj>();
  calcBalloonObj: CalcBalloonObjX = new CalcBalloonObjX();
  calcBalloonObjForTrialCalc: CalcBalloonObjForTrialCalc = new CalcBalloonObjForTrialCalc();
  listInstallment: Array<InstallmentObj>;
  PriceLabel: string = CommonConstant.FinancialPriceLabel;
  IsTrialCalc: boolean = false;
  IsFirstCalc: boolean = true;
  EffRateAfterCalc: number = -1;
  FlatRateAfterCalc: number = -1;

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  readonly BhvLock = CommonConstant.ProductBehaviourLock;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.LoadCalcBaseType();

    this.ParentForm.get("FlatRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("EffectiveRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("AppSupplEffectiveRatePrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("FlatRatePrcnt").updateValueAndValidity();
    this.ParentForm.get("EffectiveRatePrcnt").updateValueAndValidity();
    this.ParentForm.get("AppSupplEffectiveRatePrcnt").updateValueAndValidity();
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

  LoadCalcBaseType() {
    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeFinDataCalcBaseOn, MappingCode: null };
    this.http.post(URLConstant.GetListActiveRefMaster, tempReq).subscribe(
      (response) => {
        this.CalcBaseOptions = response[CommonConstant.ReturnObj];
        this.CalcBaseOptions.sort((a,b) => a.SeqNo - b.SeqNo);
        this.CalcBaseOptions = this.CalcBaseOptions.filter(x => x.MappingCode.indexOf(CommonConstant.InstSchmBalloon) !== -1);

        if (this.CalcBaseOptions.length > 0) {
          if (this.ParentForm.get("EffectiveRateBhv").value == this.BhvLock) {
            this.ParentForm.patchValue({
              CalcBase: CommonConstant.FinDataCalcBaseOnRate
            });
            this.ParentForm.get("RateType").disable();
            this.ParentForm.get("EffectiveRatePrcnt").disable();
            this.ParentForm.get("FlatRatePrcnt").disable();
            this.ParentForm.get("InstAmt").disable();
          } else {
            this.ParentForm.get("CalcBase").enable();
            this.ParentForm.patchValue({
              CalcBase: this.CalcBaseOptions[0].MasterCode
            });
            this.SetEnableDisableInputByCalcBase(this.CalcBaseOptions[0].MasterCode);
          }
          if (this.ParentForm.getRawValue().ExistingFinData) {
            this.ParentForm.patchValue({
              IsReCalculate: true
            });
          }
        }
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

  Calculate() {
    if (this.ParentForm.getRawValue().CalcBase == '') {
      this.toastr.warningMessage(ExceptionConstant.CHOOSE_CALCULATE_BASE);
      return;
    }
    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnInst && this.ParentForm.value.InstAmt <= 0) {
      this.toastr.warningMessage(ExceptionConstant.INST_AMOUNT_MUST_HIGHER_THAN + " 0");
      return;
    }

    if (this.ParentForm.controls.DownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "Down Payment");
      return;
    }

    if (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective
      && this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
      && this.ParentForm.controls.IsSubsidyRateExist.value == false
      && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt) {
      this.toastr.warningMessage(String.Format(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_SELL_SUPPL_RATE, this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt));
      return;
    }

    if (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective
      && this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
      && this.ParentForm.controls.IsSubsidyRateExist.value == false
      && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().AppSupplEffectiveRatePrcnt) {
      this.toastr.warningMessage(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_SUPPL_RATE);
    }

    if (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective
      && this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
      && this.ParentForm.controls.IsSubsidyRateExist.value == true
      && this.ParentForm.getRawValue().EffectiveRatePrcnt > this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt) {
      this.toastr.warningMessage(String.Format(ExceptionConstant.EFF_RATE_CANNOT_GREATER_THAN_SELL_SUPPL_RATE, this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt));
      return;
    }
    if (this.ValidateFee() == false) {
      return;
    }
    if (this.ParentForm.get("BalloonValueAmt").value < 1) {
      this.toastr.warningMessage(ExceptionConstant.BALLOON_AMOUNT_MUST_HIGHER_THAN + '0.');
      return;
    }

    if (!this.IsTrialCalc) {
      this.calcBalloonObj = this.ParentForm.getRawValue();
      this.http.post<ResponseCalculateObjX>(URLConstantX.CalculateInstallmentBalloonX, this.calcBalloonObj).subscribe(
        (response: ResponseCalculateObjX) => {
          //Start SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
          response.CommissionAmtFromDiffRate = 0;
          //End SITDSFCFRTHREE-169
          this.listInstallment = response.InstallmentTable;
          this.EffRateAfterCalc = response.EffectiveRatePrcnt;
          this.FlatRateAfterCalc = response.FlatRatePrcnt;
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
            DownPaymentNettAmt: response.DownPaymentNettAmt,

            SubsidyAmtFromDiffRate: response.SubsidyAmtFromDiffRate,
            CommissionAmtFromDiffRate: response.CommissionAmtFromDiffRate,

            //Start SITDSFCFRTHREE-171 : Suppl Rate di DSF selalu sama dng Effective rate
            AppSupplEffectiveRatePrcnt: response.EffectiveRatePrcnt,
            //End SITDSFCFRTHREE-171

            CurrGrossYieldAmt: response.CurrGrossYieldAmt,
            StdGrossYieldAmt: response.StdGrossYieldAmt,
            DiffGrossYieldAmt: response.DiffGrossYieldAmt

          })
          this.ParentForm.patchValue({
            IsReCalculate: true
          });
          this.SetSubsidyAmtFromDiffRateInput(response.SubsidyAmtFromDiffRate);
          this.SetCommissionAmtFromDiffRateInput(response.CommissionAmtFromDiffRate);
          this.SetSupplEffectiveRateInput(response.CommissionAmtFromDiffRate);
          this.SetInstallmentTable();
          this.SetNeedReCalculate(false);

          if (this.ParentForm.controls.IsSubsidyRateExist.value == true) {
            this.RefreshSubsidy.emit();
          }

          if (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective
            && this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
            && this.ParentForm.controls.IsSubsidyRateExist.value == false
            && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt) {
            this.toastr.warningMessage(String.Format(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_SELL_SUPPL_RATE, this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt));
            return;
          }

          if (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective
            && this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
            && this.ParentForm.controls.IsSubsidyRateExist.value == false
            && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().AppSupplEffectiveRatePrcnt) {
            this.toastr.warningMessage(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_SUPPL_RATE);
          }

          if (this.ParentForm.getRawValue().RateType == CommonConstant.RateTypeEffective
            && this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
            && this.ParentForm.controls.IsSubsidyRateExist.value == true
            && this.ParentForm.getRawValue().EffectiveRatePrcnt > this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt) {
            this.toastr.warningMessage(String.Format(ExceptionConstant.EFF_RATE_CANNOT_GREATER_THAN_SELL_SUPPL_RATE, this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt));
            return;
          }

          this.SetNeedReCalculate(false);
        }
      );
    } else {
      this.calcBalloonObjForTrialCalc = this.ParentForm.getRawValue();
      this.http.post<ResponseCalculateObjX>(URLConstant.CalculateInstallmentBalloonForTrialCalc, this.calcBalloonObjForTrialCalc).subscribe(
        (response) => {
          //Start SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
          response.CommissionAmtFromDiffRate = 0;
          //End SITDSFCFRTHREE-169
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
            DownPaymentNettAmt: response.DownPaymentNettAmt,

            SubsidyAmtFromDiffRate: response.SubsidyAmtFromDiffRate,
            CommissionAmtFromDiffRate: response.CommissionAmtFromDiffRate,

            //Start SITDSFCFRTHREE-171 : Suppl Rate di DSF selalu sama dng Effective rate
            AppSupplEffectiveRatePrcnt: response.EffectiveRatePrcnt
            //End SITDSFCFRTHREE-171

          })
          this.SetSubsidyAmtFromDiffRateInput(response.SubsidyAmtFromDiffRate);
          this.SetCommissionAmtFromDiffRateInput(response.CommissionAmtFromDiffRate);
          this.SetSupplEffectiveRateInput(response.CommissionAmtFromDiffRate);
          this.SetInstallmentTable();
          this.SetNeedReCalculate(false);

          if (this.ParentForm.controls.IsSubsidyRateExist.value == true) {
            this.RefreshSubsidy.emit();
          }
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
        OsInterestAmt: this.listInstallment[i].OsInterestAmt
      });
      (this.ParentForm.controls.InstallmentTable as FormArray).push(group);
    }
  }

  EffectiveRatePrcntInput_FocusOut() {
    this.ParentForm.patchValue({
      SubsidyAmtFromDiffRate: 0,
      CommissionAmtFromDiffRate: 0,
      AppSupplEffectiveRatePrcnt: this.ParentForm.get("EffectiveRatePrcnt").value
    });
    this.SetSubsidyAmtFromDiffRateInput(0);
    this.SetCommissionAmtFromDiffRateInput(0);
    this.SetNeedReCalculate(true);
  }

  Rate_Keyup(event: KeyboardEvent) {
    this.SetNeedReCalculate(true);
    if (event.keyCode >= 48 && event.keyCode <= 57 && this.ParentForm.get("CommissionAmtFromDiffRate").value > 0)
      this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  Rate_Paste(event: ClipboardEvent) {
    this.SetNeedReCalculate(true);
    this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  SupplEffectiveRatePrcnt_FocusOut() {
    this.SetCommissionAmtFromDiffRateInput(0);
    this.SetNeedReCalculate(true);
  }

  SupplRate_Keyup(event: KeyboardEvent) {
    this.SetNeedReCalculate(true);
    if (event.keyCode >= 48 && event.keyCode <= 57 && this.ParentForm.get("CommissionAmtFromDiffRate").value > 0)
      this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  SupplRate_Paste(event: ClipboardEvent) {
    this.SetNeedReCalculate(true);
    this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  InstallmentAmount_Keyup(event: KeyboardEvent) {
    this.SetNeedReCalculate(true);
    if (event.keyCode >= 48 && event.keyCode <= 57 && this.ParentForm.get("CommissionAmtFromDiffRate").value > 0)
      this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  InstallmentAmount_Paste(event: ClipboardEvent) {
    this.SetNeedReCalculate(true);
    this.ParentForm.get("CommissionAmtFromDiffRate").patchValue(0);
  }

  SubsidyAmtFromDiffRate_FocusOut(event) {
    this.SetSubsidyAmtFromDiffRateInput(this.ParentForm.get("SubsidyAmtFromDiffRate").value);
    this.SetNeedReCalculate(true);
  }

  SetSubsidyAmtFromDiffRateInput(subsidyAmtFromDiffRate) {
    if (subsidyAmtFromDiffRate > 0) {
      this.ParentForm.patchValue({
        CommissionAmtFromDiffRate: 0
      });
      this.ParentForm.get("CommissionAmtFromDiffRate").disable();
    } else {
      if (this.ParentForm.controls.IsSubsidyRateExist.value == false) {
        //SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
        this.ParentForm.get("CommissionAmtFromDiffRate").disable();
      }
    }
  }

  CommissionAmtFromDiffRate_FocusOut(event) {
    this.SetCommissionAmtFromDiffRateInput(this.ParentForm.get("CommissionAmtFromDiffRate").value);
    this.SetSupplEffectiveRateInput(this.ParentForm.get("CommissionAmtFromDiffRate").value);
    this.SetNeedReCalculate(true);
  }

  SetCommissionAmtFromDiffRateInput(commissionAmtFromDiffRate) {
    if (commissionAmtFromDiffRate > 0) {
      this.ParentForm.patchValue({
        SubsidyAmtFromDiffRate: 0
      });
      if (this.ParentForm.controls.IsSubsidyRateExist.value == false) {
        //SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
        this.ParentForm.get("CommissionAmtFromDiffRate").disable();
      }
    }
  }

  SetSupplEffectiveRateInput(commissionAmtFromDiffRate) {
    if (commissionAmtFromDiffRate > 0) {
      this.ParentForm.get("AppSupplEffectiveRatePrcnt").disable();
    } else {
      this.ParentForm.get("AppSupplEffectiveRatePrcnt").enable();
    }
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
