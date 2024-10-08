import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CalcRegularFixObj } from 'app/shared/model/app-fin-data/calc-regular-fix-obj.model';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-financial-data-fctr',
  templateUrl: './financial-data-fctr.component.html',
})
export class FinancialDataFctrComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  FinDataForm: FormGroup;
  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  appFinDataObj: AppFinDataObj = new AppFinDataObj();
  calcRegFixObj: CalcRegularFixObj = new CalcRegularFixObj();
  NumOfInst: number;
  MouCustId: number;
  MouCustFctrId: number;
  EffectiveRatePrcnt: number;
  IsParentLoaded: boolean = false;
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

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

  async ngOnInit() {
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
        AppSupplEffectiveRatePrcnt: 0,
        SupplFlatRatePrcnt: 0,
        DiffRateAmt: 0,

        TotalInterestAmt: 0,
        TotalAR: 0,

        GrossYieldPrcnt: 0,

        NumOfStep: 0,
        MrInstSchemeCode: "",
        MrInstSchemeName: "",
        CummulativeTenor: 0,
        StepUpStepDownInputType: "",

        AppFee: this.fb.array([]),
        ListEntryInst: this.fb.array([]),

        MrProvisionFeeTypeCode: '',
        MrProvisionFeeCalcMethodCode: '',
        BalloonValueAmt: 0,
        MrInstTypeCode: "",
        InstTypeName: "",
        MrSingleInstCalcMthdCode: "",
        SingleInstCalcMthdName: "",
        TopBased: "",
        TopBasedName: "",
        InvcDt: "",
        MaturityDate: "",
        EstEffDt: "",
        TotalInvcAmt: 0,
        TopDays: 0,
        RetentionPrcnt: 0,
        TotalRetentionAmt: 0,
        TotalDisbAmt: 0,
        Tenor: 0,
        InterestType: "",
        RefundInterestAmt: 0,

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
        NeedReCalculate: true,
        IsReCalculate: false,
        ExistingFinData: false
      }
    );
    await this.LoadMouCust();
    await this.LoadMouCustFctr();
    await this.LoadAppFinData();
  }

  Cancel() {
    this.outputCancel.emit();
  }

  async LoadMouCust() {
     await this.http.post(URLConstant.GetMouCustByAppId, { Id: this.AppId }).toPromise().then(
      (response: any) => {
        this.MouCustId = response.MouCustId;
      }
    );
  }

  async LoadMouCustFctr() {
    await this.http.post(URLConstant.GetMouCustFctrByMouCustId, { Id: this.MouCustId }).toPromise().then(
      (response: any) => {
        this.MouCustFctrId = response.MouCustId;
        this.EffectiveRatePrcnt = response.InterestRatePrcnt;
      }
    );
  }

  async LoadAppFinData() {
    let InitAppFinDataUrl = environment.isCore ? URLConstant.GetInitAppFinDataFctrByAppIdV2 : URLConstant.GetInitAppFinDataFctrByAppId;
    this.http.post<AppFinDataObj>(InitAppFinDataUrl, { Id: this.AppId }).subscribe(
      (response) => {
        this.appFinDataObj = response;

        if (this.appFinDataObj.MrInstSchemeCode != 'RF') {
          this.FinDataForm.get("RateType").disable();
        }

        this.FinDataForm.patchValue({
          TotalAssetPriceAmt: this.appFinDataObj.TotalInvcAmt - this.appFinDataObj.TotalRetentionAmt,
          TotalInsCustAmt: this.appFinDataObj.TotalInsCustAmt,
          InsCptlzAmt: this.appFinDataObj.InsCptlzAmt,
          TotalInsInscoAmt: this.appFinDataObj.TotalInsInscoAmt,
          TotalLifeInsCustAmt: this.appFinDataObj.TotalLifeInsCustAmt,
          LifeInsCptlzAmt: this.appFinDataObj.LifeInsCptlzAmt,
          DownPaymentGrossAmt: this.appFinDataObj.DownPaymentGrossAmt,
          DownPaymentNettAmt: this.appFinDataObj.DownPaymentNettAmt,
          TotalDownPaymentGrossAmt: this.appFinDataObj.TotalDownPaymentGrossAmt,
          TotalDownPaymentNettAmt: this.appFinDataObj.TotalDownPaymentNettAmt,

          EffectiveRatePrcnt: this.EffectiveRatePrcnt,
          EffectiveRateBhv: this.appFinDataObj.EffectiveRateBhv,
          StdEffectiveRatePrcnt: this.appFinDataObj.StdEffectiveRatePrcnt,

          NumOfInst: this.appFinDataObj.NumOfInst,
          RoundingAmt: this.appFinDataObj.RoundingAmt,
          SellSupplEffectiveRatePrcnt: this.appFinDataObj.SellSupplEffectiveRatePrcnt,
          AppSupplEffectiveRatePrcnt: this.appFinDataObj.AppSupplEffectiveRatePrcnt,

          DiffRateAmt: this.appFinDataObj.DiffRateAmt,
          SubsidyAmtFromDiffRate: this.appFinDataObj.SubsidyAmtFromDiffRate,
          CommissionAmtFromDiffRate: this.appFinDataObj.CommissionAmtFromDiffRate,

          GrossYieldPrcnt: this.appFinDataObj.GrossYieldPrcnt,

          MrInstSchemeCode: this.appFinDataObj.MrInstSchemeCode,
          MrInstSchemeName: this.appFinDataObj.MrInstSchemeName,
          CummulativeTenor: this.appFinDataObj.CummulativeTenor,
          TotalInterestAmt: this.appFinDataObj.TotalInterestAmt,

          MrInstTypeCode: this.appFinDataObj.MrInstTypeCode,
          InstTypeName: this.appFinDataObj.InstTypeName,
          MrSingleInstCalcMthdCode: this.appFinDataObj.MrSingleInstCalcMthdCode,
          SingleInstCalcMthdName: this.appFinDataObj.SingleInstCalcMthdName,
          TopBased: this.appFinDataObj.TopBased,
          TopBasedName: this.appFinDataObj.TopBasedName,
          InvcDt: this.appFinDataObj.InvcDt,
          MaturityDate: this.appFinDataObj.MaturityDate,
          EstEffDt: this.appFinDataObj.EstEffDt != undefined ? formatDate(this.appFinDataObj.EstEffDt, 'yyyy-MM-dd', 'en-US') : '',
          TotalInvcAmt: this.appFinDataObj.TotalInvcAmt,
          TopDays: this.appFinDataObj.TopDays,
          RetentionPrcnt: this.appFinDataObj.RetentionPrcnt,
          TotalRetentionAmt: this.appFinDataObj.TotalRetentionAmt,
          TotalDisbAmt: this.appFinDataObj.TotalDisbAmt,
          Tenor: this.appFinDataObj.Tenor,
          RefundInterestAmt: this.appFinDataObj.RefundInterestAmt,

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
          InstAmt: this.appFinDataObj.InstAmt,
          ExistingFinData: this.appFinDataObj.ExistingFinData
        });

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

      this.http.post(URLConstant.SaveAppFinDataFctr, this.FinDataForm.getRawValue()).subscribe(
        (response) => {
          if (response["StatusCode"] == 200) {
            this.toastr.successMessage(response["Message"]);
            this.outputTab.emit();
          } else {
            this.toastr.warningMessage(response["message"]);
          }
        }
      );
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
}
