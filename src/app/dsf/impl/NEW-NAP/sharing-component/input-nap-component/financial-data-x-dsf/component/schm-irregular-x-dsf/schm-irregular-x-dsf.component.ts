import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CalcIrregularObjX } from 'app/impl/shared/model/AppFinData/CalcIrregularObjX.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ResponseCalculateObjX } from 'app/impl/shared/model/AppFinData/ResponseCalculateObjX.Model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { CalcIrregularObjForTrialCalc } from 'app/shared/model/app-fin-data/calc-irregular-obj-for-trial-calc.model';
import { InstallmentObj } from 'app/shared/model/app-fin-data/installment-obj.model';
import { CalcIrregularObj } from 'app/shared/model/app-fin-data/calc-irregular-obj.model';
import { ResponseCalculateObj } from 'app/shared/model/app-fin-data/response-calculate-obj.model';

@Component({
  selector: 'app-schm-irregular-x-dsf',
  templateUrl: './schm-irregular-x-dsf.component.html',
  styleUrls: ['./schm-irregular-x-dsf.component.css']
})
export class SchmIrregularXDsfComponent implements OnInit {

  @Input() InstAmt: number;
  @Input() AppId: number;
  @Input() ParentForm: FormGroup;
  @Input() NumOfInst: number;
  @Input() BizTemplateCode: string;
  @Input() TrialCalc: boolean;
  @Input() ProductOfferingCode: string;
  // Self Custom CR Automation Subsidy Dealer
  @Input() DealerSubsidyLock: boolean;
  // End Self Custom CR Automation Subsidy Dealer

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcIrregularObj: CalcIrregularObj = new CalcIrregularObj();
  calcIrregularObjForTrialCalc: CalcIrregularObjForTrialCalc = new CalcIrregularObjForTrialCalc();
  listInstallment: Array<InstallmentObj>;
  PriceLabel: string = CommonConstant.FinancialPriceLabel;
  IsTrialCalc: boolean = false;
  EffRateAfterCalc: number = -1;
  FlatRateAfterCalc: number = -1;
  GracePeriodAfterCalc: number = -1;
  GracePeriodTypeAfterCalc: string = "empty";
  ProdOfferingVersion: string;
  // Self Custom CR Automation Subsidy Dealer
  IsDealerSubsidyLock: boolean = false;
  // End Self Custom CR Automation Subsidy Dealer

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  readonly BhvLock = CommonConstant.ProductBehaviourLock;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
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
          this.SetEntryInstallment();
        });
      this.IsTrialCalc = false;
    }
    else if (this.TrialCalc != null && this.TrialCalc) {
      this.IsTrialCalc = true;
      this.SetEntryInstallment();
      this.GetProductOfferingVersion();
    }
    if (this.InstAmt != 0) {
      this.ParentForm.patchValue({
        InstAmt: this.InstAmt
      });
    }
    if (this.ParentForm.getRawValue().ExistingFinData) {
      this.EffRateAfterCalc = this.ParentForm.getRawValue().EffectiveRatePrcnt;
      this.FlatRateAfterCalc = this.ParentForm.getRawValue().FlatRatePrcnt;
      this.GracePeriodAfterCalc = this.ParentForm.getRawValue().GracePeriod;
      this.GracePeriodTypeAfterCalc = this.ParentForm.getRawValue().MrGracePeriodTypeCode;
      this.ParentForm.patchValue({
        IsReCalculate: true
      });
    }
    this.http.post(URLConstant.GetAppInstSchldTableByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.listInstallment = response['InstallmentTable'];
      });
    // Self Custom CR Automation Subsidy Dealer
    if (this.DealerSubsidyLock)
    {
      this.IsDealerSubsidyLock = true;
    }
    // End Self Custom CR Automation Subsidy Dealer

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
    
    if (this.listInstallment && this.listInstallment.length != 0) {
      for (let i = 0; i < numOfStep; i++) {
        const group = this.fb.group({
          InstSeqNo: i + 1,
          NumOfInst: [0],
          InstAmt: [this.listInstallment[i].InstAmt]
        });
        (this.ParentForm.controls.ListEntryInst as FormArray).push(group);
      }
    } else {
      for (let i = 0; i < numOfStep; i++) {
        const group = this.fb.group({
          InstSeqNo: i + 1,
          NumOfInst: [0],
          InstAmt: [0]
        });
        (this.ParentForm.controls.ListEntryInst as FormArray).push(group);
      }
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

  async CalculateAmortization() {
    /* //Issue Non Jira 2021-01-28: Validasi TDP Paid at MF dipindah setelah dapat TDP nya   
    if (this.ParentForm.controls.TotalDownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "TDP");
      return;
    }
    */
    if (this.ValidateFee() == false) {
      return;
    }
    this.calcIrregularObj = this.ParentForm.value;

    var IdxKosong = this.calcIrregularObj.ListEntryInst.findIndex(x => x.InstAmt == 0);
    if (IdxKosong != -1) {
      this.toastr.warningMessage(ExceptionConstant.INPUT_INST_AMOUNT + (IdxKosong + 1));
      return;
    }
    if (!this.IsTrialCalc) {
      this.ParentForm.patchValue({ IsReCalculate: false });
      this.calcIrregularObj = this.ParentForm.value;
      //BEGIN RTHREE-614 - Fix Recalculate Irregular
      if (this.calcIrregularObj.IsReCalculate && this.listInstallment && this.listInstallment[this.listInstallment.length-1]) 
      this.calcIrregularObj.InstAmt = this.listInstallment[this.listInstallment.length-1]['InstAmt'];
      //END RTHREE-614
      this.http.post<ResponseCalculateObjX>(URLConstantX.CalculateIrregularX, this.calcIrregularObj).subscribe(
        (response) => {
          //Start SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
          response.CommissionAmtFromDiffRate = 0;
          //End SITDSFCFRTHREE-169
          this.listInstallment = response.InstallmentTable;
          this.EffRateAfterCalc = response.EffectiveRatePrcnt;
          this.FlatRateAfterCalc = response.FlatRatePrcnt;
          this.GracePeriodAfterCalc = this.ParentForm.getRawValue().GracePeriod;
          this.GracePeriodTypeAfterCalc = this.ParentForm.getRawValue().MrGracePeriodTypeCode;
          //BEGIN RTHREE-614 - Fix Recalculate Irregular
          if (this.calcIrregularObj.IsReCalculate && this.listInstallment && this.listInstallment[0]) 
          response.InstAmt = this.listInstallment[0]['InstAmt'];
          //END RTHREE-614
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
            
            CurrGrossYieldAmt: response.CurrGrossYieldAmt,
            StdGrossYieldAmt: response.StdGrossYieldAmt,
            DiffGrossYieldAmt: response.DiffGrossYieldAmt,

            //Start SITDSFCFRTHREE-171 : Suppl Rate di DSF selalu sama dng Effective rate
            AppSupplEffectiveRatePrcnt: response.EffectiveRatePrcnt
            //End SITDSFCFRTHREE-171
          })

          //Start Issue Non Jira 2021-01-28: Validasi TDP Paid at MF dipindah setelah dapat TDP nya
          if (this.ParentForm.controls.TotalDownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
            this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "TDP");
            this.SetNeedReCalculate(true);
            return;
          }
          //End Issue Non Jira

          this.SetInstallmentTable();
          this.SetNeedReCalculate(false);
          this.SetSubsidyAmtFromDiffRateInput(response.SubsidyAmtFromDiffRate);
          this.SetCommissionAmtFromDiffRateInput(response.CommissionAmtFromDiffRate);
        }
      );
    } else {
      this.calcIrregularObjForTrialCalc = this.ParentForm.value;
      this.calcIrregularObjForTrialCalc.ProdOfferingCode = this.ProductOfferingCode;
      this.calcIrregularObjForTrialCalc.ProdOfferingVersion = this.ProdOfferingVersion;
      await this.http.post<ResponseCalculateObjX>(environment.losUrl + "/v1" + "/AppFinData/CalculateIrregularForTrialCalc", this.calcIrregularObjForTrialCalc).toPromise().then(
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
            ApvAmt: response.ApvAmt,

            TotalLifeInsCustAmt: response.TotalLifeInsCustAmt,
            LifeInsCptlzAmt: response.LifeInsCptlzAmt,

            DownPaymentGrossAmt: response.DownPaymentGrossAmt,
            DownPaymentNettAmt: response.DownPaymentNettAmt,

            //Start SITDSFCFRTHREE-171 : Suppl Rate di DSF selalu sama dng Effective rate
            AppSupplEffectiveRatePrcnt: response.EffectiveRatePrcnt
            //End SITDSFCFRTHREE-171
          })

          //Start Issue Non Jira 2021-01-28: Validasi TDP Paid at MF dipindah setelah dapat TDP nya
          if (this.ParentForm.controls.TotalDownPaymentNettAmt.value < this.ParentForm.controls.TdpPaidCoyAmt.value) {
            this.toastr.warningMessage(ExceptionConstant.TOTAL_PAID_AT_COY_MUST_LESS_THAN + "TDP");
            this.SetNeedReCalculate(true);
            return;
          }
          //End Issue Non Jira

          this.SetInstallmentTable();
          this.SetNeedReCalculate(false);
          this.SetSubsidyAmtFromDiffRateInput(response.SubsidyAmtFromDiffRate);
          this.SetCommissionAmtFromDiffRateInput(response.CommissionAmtFromDiffRate);
        }
      );
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

  SetSubsidyAmtFromDiffRateInput(subsidyAmtFromDiffRate) {
    if (subsidyAmtFromDiffRate > 0) {
      this.ParentForm.patchValue({
        CommissionAmtFromDiffRate: 0
      });
      this.ParentForm.get("CommissionAmtFromDiffRate").disable();
    }
    else {
      if (this.ParentForm.controls.IsSubsidyRateExist.value == false) {
        //SITDSFCFRTHREE-169 : di DSF ga ada upping rate, jadi commission diff rate = 0 & disabled
        this.ParentForm.get("CommissionAmtFromDiffRate").disable();
      }
    }
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

  SetNeedReCalculate(value: boolean) {
    if (this.GracePeriodAfterCalc != this.ParentForm.getRawValue().GracePeriod
      || this.GracePeriodTypeAfterCalc != this.ParentForm.getRawValue().MrGracePeriodTypeCode) {
      this.ParentForm.patchValue({
        IsReCalculate: false
      });
      return;
    }
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
