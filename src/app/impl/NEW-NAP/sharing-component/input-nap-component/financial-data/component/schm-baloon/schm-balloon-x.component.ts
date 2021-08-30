import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { String } from 'typescript-string-operations';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { CalcBalloonObjForTrialCalc } from 'app/shared/model/AppFinData/CalcBalloonObjForTrialCalc.Model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { CalcBalloonObjX } from 'app/impl/shared/model/AppFinData/CalcBalloonObjX.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ResponseCalculateObjX } from 'app/impl/shared/model/AppFinData/ResponseCalculateObjX.Model';

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
  PriceLabel: string = "Asset Price";
  IsTrialCalc: boolean = false;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
    this.LoadCalcBaseType();

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
        this.CalcBaseOptions = this.CalcBaseOptions.filter(x => x.MappingCode.indexOf(CommonConstant.InstSchmBalloon) !== -1);

        if (this.CalcBaseOptions.length == 1) {
          this.ParentForm.patchValue({
            CalcBase: this.CalcBaseOptions[0].MasterCode
          });
          this.SetEnableDisableInputByCalcBase(this.CalcBaseOptions[0].MasterCode);
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

    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
      && this.ParentForm.controls.IsSubsidyRateExist.value == false
      && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt) {
      this.toastr.warningMessage(String.Format(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_SELL_SUPPL_RATE, this.ParentForm.getRawValue().SellSupplEffectiveRatePrcnt));
      return;
    }

    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
      && this.ParentForm.controls.IsSubsidyRateExist.value == false
      && this.ParentForm.getRawValue().EffectiveRatePrcnt < this.ParentForm.getRawValue().AppSupplEffectiveRatePrcnt) {
      this.toastr.warningMessage(ExceptionConstant.EFF_RATE_CANNOT_LESS_THAN_SUPPL_RATE);
      return;
    }

    if (this.ParentForm.getRawValue().CalcBase == CommonConstant.FinDataCalcBaseOnRate
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
            AppSupplEffectiveRatePrcnt: response.AppSupplEffectiveRatePrcnt,

            CurrGrossYieldAmt: response.CurrGrossYieldAmt,
            StdGrossYieldAmt: response.StdGrossYieldAmt,
            DiffGrossYieldAmt: response.DiffGrossYieldAmt

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
    } else {
      this.calcBalloonObjForTrialCalc = this.ParentForm.getRawValue();
      this.http.post<ResponseCalculateObjX>(URLConstant.CalculateInstallmentBalloonForTrialCalc, this.calcBalloonObjForTrialCalc).subscribe(
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
            DownPaymentNettAmt: response.DownPaymentNettAmt,

            SubsidyAmtFromDiffRate: response.SubsidyAmtFromDiffRate,
            CommissionAmtFromDiffRate: response.CommissionAmtFromDiffRate,
            AppSupplEffectiveRatePrcnt: response.AppSupplEffectiveRatePrcnt

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
        this.ParentForm.get("CommissionAmtFromDiffRate").enable();
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
        this.ParentForm.get("CommissionAmtFromDiffRate").enable();
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
    } else if (calcBase == CommonConstant.FinDataCalcBaseOnInst) {
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").enable();
    } else if (calcBase == CommonConstant.FinDataCalcBaseOnCommission) {
      this.ParentForm.get("EffectiveRatePrcnt").disable();
      this.ParentForm.get("InstAmt").disable();
    } else {
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
