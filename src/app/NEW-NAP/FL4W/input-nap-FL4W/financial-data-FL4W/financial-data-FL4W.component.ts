import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';


@Component({
  selector: 'app-financial-data-FL4W',
  templateUrl: './financial-data-FL4W.component.html',
})
export class FinancialDataFL4WComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

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
        StdEffectiveRatePrcnt: 0, //base eff rate to cust
        FlatRatePrcnt: 0, //flat rate to cust
        InstAmt: 0,
        GracePeriod: 0,
        MrGracePeriodTypeCode: "",

        NumOfInst: 0,
        RoundingAmt: 0,
        SupplEffectiveRatePrcnt: 0,
        SupplFlatRatePrcnt: 0,
        DiffRateAmt: 0,
        ResidualValueAmt: [0, [Validators.min(0)]],

        TotalInterestAmt: 0,
        TotalAR: 0,

        StdGrossYieldPrcnt: 0,
        GrossYieldPrcnt: 0,
        GrossYieldBhv: "",

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
        SellEffectiveRatePrcnt: 0,

        ApvAmt: 0,
        TotalDpAmt: 0,

        NeedReCalculate: true
      }
    );
    this.LoadAppFinData();
  }

  LoadAppFinData() {
    console.log("Load App Fin Data Started...");
    this.http.post<AppFinDataObj>(AdInsConstant.GetInitAppFinDataByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.appFinDataObj = response;

        if (this.appFinDataObj.MrInstSchemeCode != 'RF') {
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
          SupplEffectiveRatePrcnt: this.appFinDataObj.SupplEffectiveRatePrcnt,

          DiffRateAmt: +this.appFinDataObj.DiffRateAmt,

          StdGrossYieldPrcnt: this.appFinDataObj.StdGrossYieldPrcnt,
          GrossYieldPrcnt: this.appFinDataObj.GrossYieldPrcnt,
          GrossYieldBhv: this.appFinDataObj.GrossYieldBhv,

          MrInstSchemeCode: this.appFinDataObj.MrInstSchemeCode,
          CummulativeTenor: this.appFinDataObj.CummulativeTenor,

          NtfAmt: this.appFinDataObj.NtfAmt,
          ApvAmt: this.appFinDataObj.ApvAmt,

          LcRate: this.appFinDataObj.LcRate,
          MrLcCalcMethodCode: this.appFinDataObj.MrLcCalcMethodCode,
          LcGracePeriod: this.appFinDataObj.LcGracePeriod,
          PrepaymentPenaltyRate: this.appFinDataObj.PrepaymentPenaltyRate,
          SellEffectiveRatePrcnt: this.appFinDataObj.SellEffectiveRatePrcnt,
          TotalDpAmt: this.appFinDataObj.TotalDpAmt
        });

        this.setValidator(this.appFinDataObj.MrInstSchemeCode);
        this.IsParentLoaded = true;
      }
    );
  }

  SaveAndContinue() {
    var isValidGrossYield = this.ValidateGrossYield();
    var isValidGracePeriod = this.ValidateGracePeriode();

    var NeedReCalculate = this.FinDataForm.get("NeedReCalculate").value;

    if (NeedReCalculate) {
      this.toastr.warningMessage("Please Calculate Again");
      return;
    }
    if (isValidGrossYield && isValidGracePeriod) {
      console.log("GROSSSS");
      console.log(this.FinDataForm.value);

      this.http.post(environment.losUrl + "/AppFinData/SaveAppFinData", this.FinDataForm.value).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["Message"]);
          this.outputTab.emit();
        }
      );
    }
  }

  Cancel(){
    this.outputCancel.emit();
  }

  ValidateGracePeriode() {
    var valid: boolean = true;
    var gracePeriodType = this.FinDataForm.get("MrGracePeriodTypeCode").value
    var gracePeriod = this.FinDataForm.get("GracePeriod").value

    if (gracePeriodType != "") {
      if (gracePeriod == 0) {
        valid = false;
        this.toastr.warningMessage("Grace Period must be set");
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
        this.toastr.warningMessage("Gross Yield cannot be less than " + StdGrossYieldPrcnt + "%");
        valid = false;
      }
    }
    else {
      if (GrossYieldPrcnt > StdGrossYieldPrcnt) {
        this.toastr.warningMessage("Gross Yield cannot be greater than " + StdGrossYieldPrcnt + "%");
        valid = false;
      }
    }
    return valid;
  }

  setValidator(mrInstSchemeCode){
    if(mrInstSchemeCode == AdInsConstant.InstSchmBalloon){
      this.FinDataForm.controls.BalloonValueAmt.setValidators([Validators.required]);
      this.FinDataForm.controls.BalloonValueAmt.updateValueAndValidity();
    }
    if(mrInstSchemeCode == AdInsConstant.InstSchmStepUpStepDownNormal || mrInstSchemeCode == AdInsConstant.InstSchmStepUpStepDownLeasing){
      this.FinDataForm.controls.NumOfStep.setValidators([Validators.required, Validators.min(1)]);
      this.FinDataForm.controls.NumOfStep.updateValueAndValidity();
      this.FinDataForm.controls.StepUpStepDownInputType.setValidators([Validators.required]);
      this.FinDataForm.controls.NumOfStep.updateValueAndValidity();
    }
  }

  // EffectiveRatePrcntInput_FocusOut(){
  //   var EffectiveRatePrcnt = this.FinDataForm.get("EffectiveRatePrcnt").value
  //   var SupplEffectiveRatePrcnt = this.FinDataForm.get("SupplEffectiveRatePrcnt").value
  //   var StdEffectiveRatePrcnt = this.FinDataForm.get("StdEffectiveRatePrcnt").value
  //   var DiffRateAmtStd= +StdEffectiveRatePrcnt - +SupplEffectiveRatePrcnt

  //   var diffRate = +EffectiveRatePrcnt - +SupplEffectiveRatePrcnt;
  //   if(diffRate < DiffRateAmtStd)
  //   {
  //     this.FinDataForm.patchValue({
  //       DiffRateAmt : 0
  //     });
  //   }
  //   else
  //   {
  //     this.FinDataForm.patchValue({
  //       DiffRateAmt : DiffRateAmtStd
  //     });
  //   }
  // }

  test() {
    console.log(this.FinDataForm)
    console.log(this.FinDataForm.value);
  }
}
