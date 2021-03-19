import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';
import { SubsidyComponent } from './component/subsidy/subsidy.component';
import { AppObj } from 'app/shared/model/App/App.Model';


@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
})
export class FinancialDataComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  @ViewChild(SubsidyComponent) subsidyComponent;


  //AppId : number;
  FinDataForm: FormGroup;
  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  appFinDataObj: AppFinDataObj = new AppFinDataObj();
  calcRegFixObj: CalcRegularFixObj = new CalcRegularFixObj();
  listInstallment: any;
  responseCalc: any;
  NumOfInst: number;
  IsParentLoaded: boolean = false;

  listSubsidy: Array<AppSubsidyObj> = new Array<AppSubsidyObj>();
  AppData: AppObj;
  isReady: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != undefined || params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
    });
  }

  ngOnInit() {
    this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId}).subscribe(
      (response) => {
        this.AppData = response;
        this.FinDataForm = this.fb.group(
          {
            AppId: this.AppId,
    
            TotalAssetPriceAmt: 0,
            TotalFeeAmt: 0,
            TotalFeeCptlzAmt: 0,
            TotalInsCustAmt: 0,
            InsCptlzAmt: 0,
            TotalInsInscoAmt: 0,
            TotalLifeInsCustAmt: 0,
            LifeInsCptlzAmt: 0,
            DownPaymentGrossAmt: 0,
            DownPaymentNettAmt: 0,
    
            TotalDownPaymentNettAmt: 0, //muncul di layar
            TotalDownPaymentGrossAmt: 0, //inmemory
            TdpPaidCoyAmt: 0, // input layar
    
            NtfAmt: 0,
            RateType: "EFCTV",
            EffectiveRatePrcnt: 0, //eff rate to cust
            EffectiveRateBhv: "",
            StdEffectiveRatePrcnt: 0, //base eff rate to cust
            FlatRatePrcnt: 0, //flat rate to cust
            InstAmt: 0,
            GracePeriod: 0,
            MrGracePeriodTypeCode: "",
    
            NumOfInst: 0,
            RoundingAmt: 0,
            SellSupplEffectiveRatePrcnt: 0,
            SupplFlatRatePrcnt: 0,
            AppSupplEffectiveRatePrcnt: 0,

            DiffRateAmt: 0,
            SubsidyAmtFromDiffRate: {value: 0, disabled: true},
            CommissionAmtFromDiffRate: 0,
            IsSubsidyRateExist: false,
            ResidualValueAmt: [0, response.BizTemplateCode == CommonConstant.FL4W ? [Validators.min(0)] : []],
    
            TotalInterestAmt: 0,
            TotalAR: 0,
    
            GrossYieldPrcnt: 0,
    
            NumOfStep: 0,
            MrInstSchemeCode: "",
            CummulativeTenor: 0,
            StepUpStepDownInputType: "",
    
            AppFee: this.fb.array([]),
            ListEntryInst: this.fb.array([]),
    
            MrProvisionFeeTypeCode: '',
            MrProvisionFeeCalcMethodCode: '',
            BalloonValueAmt: 0,
    
            LcRate: 0,
            MrLcCalcMethodCode: '',
            LcGracePeriod: 0,
            PrepaymentPenaltyRate: 0,
    
            ApvAmt: 0,
            TotalDpAmt: 0,
            VendorAtpmCode: '',

            MinEffectiveRatePrcnt: 0,
            MaxEffectiveRatePrcnt: 0,
            MinInterestIncomeAmt: 0,
            MinGrossYieldPrcnt: 0,
            MaxGrossYieldPrcnt: 0,
            MinBalloonAmt: 0,
            MaxBalloonAmt: 0,
            BalloonBhv: '',
            MinDownPaymentNettPrcnt: 0,
            MaxDownPaymentNettPrcnt: 0,
    
            CalcBase: '',
            NeedReCalculate: true
          }
        );
        this.isReady = true;
        this.LoadAppFinData();
      });
  }

  LoadAppFinData() {
    this.http.post<AppFinDataObj>(URLConstant.GetInitAppFinDataByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.appFinDataObj = response;

        if (this.appFinDataObj.MrInstSchemeCode != CommonConstant.InstSchmRegularFix) {
          this.FinDataForm.get("RateType").disable();
        }

        this.FinDataForm.patchValue({
          TotalAssetPriceAmt: this.appFinDataObj.TotalAssetPriceAmt,
          TotalFeeAmt: this.appFinDataObj.TotalFeeAmt,
          TotalFeeCptlzAmt: this.appFinDataObj.TotalFeeCptlzAmt,
          TotalInsCustAmt: this.appFinDataObj.TotalInsCustAmt,
          InsCptlzAmt: this.appFinDataObj.InsCptlzAmt,
          TotalInsInscoAmt: this.appFinDataObj.TotalInsInscoAmt,
          TotalLifeInsCustAmt: this.appFinDataObj.TotalLifeInsCustAmt,
          LifeInsCptlzAmt: this.appFinDataObj.LifeInsCptlzAmt,
          DownPaymentGrossAmt: this.appFinDataObj.DownPaymentGrossAmt,
          DownPaymentNettAmt: this.appFinDataObj.DownPaymentNettAmt,

          EffectiveRatePrcnt: this.appFinDataObj.EffectiveRatePrcnt,
          StdEffectiveRatePrcnt: this.appFinDataObj.StdEffectiveRatePrcnt,

          NumOfInst: this.appFinDataObj.NumOfInst,
          RoundingAmt: this.appFinDataObj.RoundingAmt,
          EffectiveRateBhv: this.appFinDataObj.EffectiveRateBhv,
          SellSupplEffectiveRatePrcnt: this.appFinDataObj.SellSupplEffectiveRatePrcnt,
          AppSupplEffectiveRatePrcnt: this.appFinDataObj.AppSupplEffectiveRatePrcnt,

          DiffRateAmt: +this.appFinDataObj.DiffRateAmt,

          GrossYieldPrcnt: this.appFinDataObj.GrossYieldPrcnt,

          MrInstSchemeCode: this.appFinDataObj.MrInstSchemeCode,
          CummulativeTenor: this.appFinDataObj.CummulativeTenor,

          NtfAmt: this.appFinDataObj.NtfAmt,
          ApvAmt: this.appFinDataObj.ApvAmt,

          LcRate: this.appFinDataObj.LcRate,
          MrLcCalcMethodCode: this.appFinDataObj.MrLcCalcMethodCode,
          LcGracePeriod: this.appFinDataObj.LcGracePeriod,
          PrepaymentPenaltyRate: this.appFinDataObj.PrepaymentPenaltyRate,
          TotalDpAmt: this.appFinDataObj.TotalDpAmt,
          VendorAtpmCode: this.appFinDataObj.VendorAtpmCode,
          BalloonValueAmt: this.appFinDataObj.BalloonValueAmt,
          ResidualValueAmt: this.appFinDataObj.ResidualValueAmt && this.appFinDataObj.ResidualValueAmt > 0 ? this.appFinDataObj.ResidualValueAmt : 0,

          MinEffectiveRatePrcnt: this.appFinDataObj.MinEffectiveRatePrcnt,
          MaxEffectiveRatePrcnt: this.appFinDataObj.MaxEffectiveRatePrcnt,
          MinInterestIncomeAmt: this.appFinDataObj.MinInterestIncomeAmt,
          MinGrossYieldPrcnt: this.appFinDataObj.MinGrossYieldPrcnt,
          MaxGrossYieldPrcnt: this.appFinDataObj.MaxGrossYieldPrcnt,
          MinBalloonAmt: this.appFinDataObj.MinBalloonAmt,
          MaxBalloonAmt: this.appFinDataObj.MaxBalloonAmt,
          BalloonBhv: this.appFinDataObj.BalloonBhv,
          MinDownPaymentNettPrcnt: this.appFinDataObj.MinDownPaymentNettPrcnt,
          MaxDownPaymentNettPrcnt: this.appFinDataObj.MaxDownPaymentNettPrcnt,
        });
        this.setValidator(this.appFinDataObj.MrInstSchemeCode);
        this.IsParentLoaded = true;
      }
    );
  }

  SaveAndContinue() {
    var isValidGracePeriod = this.ValidateGracePeriode();

    var NeedReCalculate = this.FinDataForm.get("NeedReCalculate").value;

    if (NeedReCalculate) {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_CALCULATE_AGAIN);
      return;
    }
    if (isValidGracePeriod) {
      this.SetDiffRateAmt();
      this.http.post(URLConstant.SaveAppFinData, this.FinDataForm.getRawValue()).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.outputTab.emit();
        }
      );
    }
  }

  Cancel() {
    this.outputCancel.emit();
  }

  CheckSubsidyRate(event){
    if (this.appFinDataObj.MrInstSchemeCode == CommonConstant.InstSchmRegularFix || this.appFinDataObj.MrInstSchemeCode == CommonConstant.InstSchmBalloon) {
      var listSubsidy: Array<AppSubsidyObj> = event;

      var subsidyRate = listSubsidy.find(x => x.MrSubsidyAllocCode == CommonConstant.SubsidyAllocSubsidyRate);
  
      if(subsidyRate != undefined){
        this.FinDataForm.patchValue({
          CommissionAmtFromDiffRate: 0,
          IsSubsidyRateExist: true
        });
        this.FinDataForm.get("CommissionAmtFromDiffRate").disable();
        this.FinDataForm.get("AppSupplEffectiveRatePrcnt").disable();
      }else{
        this.FinDataForm.patchValue({
          SubsidyAmtFromDiffRate: 0,
          IsSubsidyRateExist: false
        });
        this.FinDataForm.get("CommissionAmtFromDiffRate").enable();
        this.FinDataForm.get("AppSupplEffectiveRatePrcnt").enable();
      }
    }  
  }

  SetInputByCalcBase(calcBase){
    if(calcBase == CommonConstant.FinDataCalcBaseOnRate){
      if(this.appFinDataObj.MrInstSchemeCode == CommonConstant.InstSchmRegularFix){
        this.FinDataForm.get("RateType").enable();
      }      
      this.FinDataForm.get("EffectiveRatePrcnt").enable();
      this.FinDataForm.get("InstAmt").disable();
    }else if(calcBase == CommonConstant.FinDataCalcBaseOnInst){      
      this.FinDataForm.get("RateType").disable();
      this.FinDataForm.get("EffectiveRatePrcnt").disable();
      this.FinDataForm.get("InstAmt").enable();
    }else if(calcBase == CommonConstant.FinDataCalcBaseOnCommission){
      this.FinDataForm.get("RateType").disable();
      this.FinDataForm.get("EffectiveRatePrcnt").disable();
      this.FinDataForm.get("InstAmt").disable();
    }else{
      if(this.appFinDataObj.MrInstSchemeCode == CommonConstant.InstSchmRegularFix){
        this.FinDataForm.get("RateType").enable();
      }      
      this.FinDataForm.get("EffectiveRatePrcnt").enable();
      this.FinDataForm.get("InstAmt").enable();
    }
  }

  RefreshSubsidy(){
    this.subsidyComponent.LoadSubsidyData();
  }

  SetDiffRateAmt(){
    if(this.FinDataForm.getRawValue().SubsidyAmtFromDiffRate > 0){
      this.FinDataForm.patchValue({
        DiffRateAmt: this.FinDataForm.getRawValue().SubsidyAmtFromDiffRate * -1
      });
    }
    if(this.FinDataForm.getRawValue().CommissionAmtFromDiffRate > 0){
      this.FinDataForm.patchValue({
        DiffRateAmt: this.FinDataForm.getRawValue().CommissionAmtFromDiffRate
      });
    }
  }

  ValidateGracePeriode() {
    var valid: boolean = true;
    var gracePeriodType = this.FinDataForm.get("MrGracePeriodTypeCode").value
    var gracePeriod = this.FinDataForm.get("GracePeriod").value

    if (gracePeriodType != "") {
      if (gracePeriod == 0) {
        valid = false;
        this.toastr.warningMessage(ExceptionConstant.GRACE_PERIOD_MUST_SET);
      }
    }

    return valid;
  }

  ValidateGrossYield() {
    var GrossYieldBhv = this.FinDataForm.get("GrossYieldBhv").value
    var StdGrossYieldPrcnt = this.FinDataForm.get("StdGrossYieldPrcnt").value
    var GrossYieldPrcnt = this.FinDataForm.get("GrossYieldPrcnt").value
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

  setValidator(mrInstSchemeCode) {
    if (mrInstSchemeCode == CommonConstant.InstSchmBalloon) {
      this.FinDataForm.controls.BalloonValueAmt.setValidators([Validators.required]);
      this.FinDataForm.controls.BalloonValueAmt.updateValueAndValidity();
    }
    if (mrInstSchemeCode == CommonConstant.InstSchmStepUpStepDownNormal || mrInstSchemeCode == CommonConstant.InstSchmStepUpStepDownLeasing) {
      this.FinDataForm.controls.NumOfStep.setValidators([Validators.required, Validators.min(1)]);
      this.FinDataForm.controls.NumOfStep.updateValueAndValidity();
      this.FinDataForm.controls.StepUpStepDownInputType.setValidators([Validators.required]);
      this.FinDataForm.controls.NumOfStep.updateValueAndValidity();
    }
  }

  // test() {
  //   console.log(this.FinDataForm)
  //   console.log(this.FinDataForm.getRawValue());
  // }
}
