import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CookieService } from 'ngx-cookie';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefPayFreqObj } from 'app/shared/model/RefPayFreqObj.model';

@Component({
  selector: 'app-trial-calculation',
  templateUrl: './trial-calculation.component.html',
  providers: [NGXToastrService]
})
export class TrialCalculationComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: HttpClient,
    private toastr: NGXToastrService, private cookieService: CookieService) {
  }
  user: CurrentUserContext;
  InputLookupProductOfferingObj: InputLookupObj = new InputLookupObj();
  ProdOfferingCode: string;
  TrialCalc: boolean = true;
  BizTmpltCode: string;
  IsProdSelected: boolean = false;
  IsGenerate: boolean = false;
  PayFreqVal: number;
  PayFreqTimeOfYear: number;
  FirstInstType: string;
  DictRefPayFreq: { [id: string]: RefPayFreqObj } = {};
  TrialForm = this.fb.group({
    OfficeCode: [''],
    CustName: ['', [Validators.maxLength(50)]],
    Addr: ['', [Validators.maxLength(100)]],
    MobilePhone: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    AssetPriceAmt: ['', Validators.required],
    selectedDpType: ['', [Validators.required, Validators.maxLength(50)]],
    DownPaymentPrctg: ['', [Validators.required]],
    DownPaymentAmt: ['', [Validators.required]],
    Tenor: ['', [Validators.required]],
    PayFreqCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrInstSchemeCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrFirstInstTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    NumOfInst: [''],
    AppFee: this.fb.array([]),
    LobCode: [''],
    BizTemplateCode: [''],

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

    RoundingAmt: 0,
    SellSupplEffectiveRatePrcnt: 0,
    SupplFlatRatePrcnt: 0,
    AppSupplEffectiveRatePrcnt: 0,

    DiffRateAmt: 0,
    SubsidyAmtFromDiffRate: { value: 0, disabled: true },
    CommissionAmtFromDiffRate: 0,
    IsSubsidyRateExist: false,
    ResidualValueAmt: 0,

    TotalInterestAmt: 0,
    TotalAR: 0,

    GrossYieldPrcnt: 0,

    NumOfStep: 0,
    CummulativeTenor: 0,
    StepUpStepDownInputType: "",

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
  });
  appFinDataObj: AppFinDataObj = new AppFinDataObj();
  applicationDDLitems = new Array();
  dpTypeValue: Array<KeyValueObj> = [
    {
      Key: "AMT",
      Value: "Amount"
    },
    {
      Key: "PRCTG",
      Value: "Percentage"
    }
  ];
  IsParentLoaded: boolean = false;

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.TrialForm.patchValue({
      OfficeCode: this.user.OfficeCode
    });
    this.initLookup();
    this.getPayFregData();
  }

  initLookup() {
    var bizTmpltCrit = new Array();
    var critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionIn;
    critSuppObj.propName = 'RL.BIZ_TMPLT_CODE';
    critSuppObj.listValue = ['CF4W', 'CFNA', 'FL4W', 'CFRFN4W'];
    bizTmpltCrit.push(critSuppObj);

    this.InputLookupProductOfferingObj.urlJson = "./assets/uclookup/lookupProductOffering.json";
    this.InputLookupProductOfferingObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupProductOfferingObj.urlEnviPaging = environment.losUrl;
    this.InputLookupProductOfferingObj.pagingJson = "./assets/uclookup/lookupProductOffering.json";
    this.InputLookupProductOfferingObj.genericJson = "./assets/uclookup/lookupProductOffering.json";
    this.InputLookupProductOfferingObj.isReadonly = false;
    this.InputLookupProductOfferingObj.addCritInput = bizTmpltCrit;
  }

  ProductOfferingEvent(event) {
    this.ProdOfferingCode = event.ProdCode;
    this.BizTmpltCode = event.BizTmpltCode;
    this.IsProdSelected = true;
    this.TrialForm.patchValue({
      LobCode: event.LobCode
    });

    this.resetDDL();
    this.getDDLFromProdOffering(CommonConstant.RefMasterTypeCodeInstSchm);
    this.getDDLFromProdOffering(CommonConstant.RefMasterTypeCodePayFreq);
    this.getDDLFromProdOffering(CommonConstant.RefProdCompFirstInstType);

    this.IsGenerate = false;
  }

  resetDDL() {
    this.TrialForm.patchValue({
      PayFreqCode: '',
      MrInstSchemeCode: '',
      MrFirstInstTypeCode: ''
    });
  }

  getDDLFromProdOffering(refProdCompntCode: string) {
    var obj = {
      ProdOfferingCode: this.ProdOfferingCode,
      RefProdCompntCode: refProdCompntCode,
    };
    this.http.post(URLConstant.GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, obj).subscribe(
      (response) => {
        var listDDL = response["DDLRefProdComptCode"];
        this.applicationDDLitems[refProdCompntCode] = listDDL;
        if (refProdCompntCode == CommonConstant.RefProdCompFirstInstType && !this.TrialForm.controls.MrFirstInstTypeCode.value) {
          this.FirstInstType = this.applicationDDLitems['FIRSTINSTTYPE'][0].Value;
          this.TrialForm.patchValue({
            MrFirstInstTypeCode: this.applicationDDLitems['FIRSTINSTTYPE'][0].Key
          });
        }
      });
  }

  DpTypeChange() {
    if (this.TrialForm.controls.selectedDpType.value != '') {
      if (this.TrialForm.controls.selectedDpType.value == 'AMT') {
        this.TrialForm.controls["DownPaymentAmt"].enable()
        this.TrialForm.patchValue({
          DownPaymentAmt: this.TrialForm.controls.AssetPriceAmt.value * this.TrialForm.controls.DownPaymentPrctg.value / 100
        });
        this.TrialForm.controls["DownPaymentPrctg"].disable();
        this.TrialForm.controls["DownPaymentAmt"].updateValueAndValidity();
      }
      else if (this.TrialForm.controls.selectedDpType.value == 'PRCTG') {
        this.TrialForm.controls["DownPaymentPrctg"].enable();
        if (this.TrialForm.controls.AssetPriceAmt.value == 0) {
          this.TrialForm.patchValue({
            DownPaymentAmt: this.TrialForm.controls.AssetPriceAmt.value * this.TrialForm.controls.DownPaymentPrctg.value / 100
          });
        }
        else {
          this.TrialForm.patchValue({
            DownPaymentPrctg: this.TrialForm.controls.DownPaymentAmt.value / this.TrialForm.controls.AssetPriceAmt.value * 100
          });
        }
        this.TrialForm.controls["DownPaymentAmt"].disable();
        this.TrialForm.controls["DownPaymentPrctg"].updateValueAndValidity();
      };
    }
  }

  updateValueDownPaymentAmt() {
    var AssetPriceAmt = this.TrialForm.controls.AssetPriceAmt.value;
    var DownPaymentAmt = this.TrialForm.controls.AssetPriceAmt.value * this.TrialForm.controls.DownPaymentPrctg.value / 100;
    if (DownPaymentAmt > this.TrialForm.controls.AssetPriceAmt.value) {
      this.toastr.warningMessage("Down Payment Amount exceeded Asset Price Amount !");
      this.TrialForm.patchValue({
        DownPaymentAmt: 0,
        DownPaymentPrctg: 0,
      });
    }
    else {
      this.TrialForm.patchValue({
        DownPaymentAmt: this.TrialForm.controls.AssetPriceAmt.value * this.TrialForm.controls.DownPaymentPrctg.value / 100,
        TotalAssetPriceAmt: AssetPriceAmt
      });
    }
  }
  updateValueDownPaymentPrctg() {
    var AssetPriceAmt = this.TrialForm.controls.AssetPriceAmt.value;
    var DownPaymentPrctg = this.TrialForm.controls.DownPaymentAmt.value / this.TrialForm.controls.AssetPriceAmt.value * 100;
    if (DownPaymentPrctg > 100) {
      this.toastr.warningMessage("Down Payment Amount exceeded Asset Price Amount !");
      this.TrialForm.patchValue({
        DownPaymentAmt: 0,
        DownPaymentPrctg: 0
      });
    }
    else {
      this.TrialForm.patchValue({
        DownPaymentPrctg: this.TrialForm.controls.DownPaymentAmt.value / this.TrialForm.controls.AssetPriceAmt.value * 100,
        TotalAssetPriceAmt: AssetPriceAmt
      });
    }
  }

  updateInsuranceAmt() {
    var TotalInsCustAmt = this.TrialForm.controls.TotalInsCustAmt.value;
    var InsCptlzAmt = this.TrialForm.controls.InsCptlzAmt.value;
    this.TrialForm.patchValue({
      TotalInsCustAmt: TotalInsCustAmt,
      InsCptlzAmt: InsCptlzAmt
    });
  }

  getPayFregData() {
    var obj = { RowVersion: "" };

    this.http.post(URLConstant.GetListActiveRefPayFreq, obj).subscribe(
      (response) => {
        var objTemp = response[CommonConstant.ReturnObj];

        for (var i = 0; i < objTemp.length; i++) {
          this.DictRefPayFreq[objTemp[i].PayFreqCode] = objTemp[i];
        }
        this.applicationDDLitems["Floating_Period"] = objTemp;

        this.ChangeNumOfInstallmentTenor();
      });
  }

  ChangeNumOfInstallmentTenor() {
    var temp: number = +this.TrialForm.controls.Tenor.value;
    if (!isNaN(temp) && !isNaN(this.PayFreqTimeOfYear) && !isNaN(this.PayFreqVal)) {
      var total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }

  ChangeNumOfInstallmentPayFreq(ev) {
    if (ev.target.selectedIndex == 0) return;
    var idx = ev.target.selectedIndex - 1;
    var temp = this.TrialForm.controls.Tenor.value;
    if (!isNaN(temp)) {
      this.PayFreqVal = this.DictRefPayFreq[this.applicationDDLitems[CommonConstant.RefMasterTypeCodePayFreq][idx].Key].PayFreqVal;
      this.PayFreqTimeOfYear = this.DictRefPayFreq[this.applicationDDLitems[CommonConstant.RefMasterTypeCodePayFreq][idx].Key].TimeOfYear;
      var total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
      this.TrialForm.patchValue({
        PayFreqCode: this.applicationDDLitems[CommonConstant.RefMasterTypeCodePayFreq][idx].Key
      });
    }
  }

  PatchNumOfInstallment(num) {
    this.TrialForm.patchValue({
      NumOfInst: num
    });
  }

  Generate() {
    if (this.TrialForm.getRawValue().AssetPriceAmt == '' || this.TrialForm.getRawValue().Tenor == '' || this.TrialForm.getRawValue().MrFirstInstTypeCode == ''
      || this.TrialForm.getRawValue().selectedDpType == '' || this.TrialForm.getRawValue().DownPaymentAmt == '' || this.TrialForm.getRawValue().DownPaymentPrctg == ''
      || this.TrialForm.getRawValue().MrInstSchemeCode == '' || this.TrialForm.getRawValue().PayFreqCode == '' || this.TrialForm.getRawValue().MrFirstInstTypeCode == ''
      || this.ProdOfferingCode == '') {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_COMPLETE_MANDATORY_INPUT);
      return;
    }
    else {
      if (!this.IsGenerate) {
        var listAppFee = this.TrialForm.controls["AppFee"] as FormArray;
        while (listAppFee.length !== 0) {
          listAppFee.removeAt(0);
        }
      }
      this.IsGenerate = true;
      this.LoadFinData();
      this.TrialForm.patchValue({
        Tenor: this.TrialForm.controls.Tenor.value,
        PayFreqCode: this.TrialForm.controls.PayFreqCode.value,
        MrInstSchemeCode: this.TrialForm.controls.MrInstSchemeCode.value,
        MrFirstInstTypeCode: this.TrialForm.controls.MrFirstInstTypeCode.value,
        BizTemplateCode: this.BizTmpltCode,
        TotalAssetPriceAmt: this.TrialForm.controls.AssetPriceAmt.value,
        DownPaymentGrossAmt: this.TrialForm.controls.DownPaymentAmt.value,
        DownPaymentNettAmt: this.TrialForm.controls.DownPaymentAmt.value,
        TotalDownPaymentNettAmt: this.TrialForm.controls.DownPaymentAmt.value,
        TotalDownPaymentGrossAmt: this.TrialForm.controls.DownPaymentAmt.value,
        TotalInsCustAmt: this.TrialForm.controls.TotalInsCustAmt.value,
        InsCptlzAmt: this.TrialForm.controls.InsCptlzAmt.value,
      });
    }
  }

  LoadFinData() {
    var reqObj = {
      ProdOfferingCode: this.ProdOfferingCode,
      LobCode: this.TrialForm.controls["LobCode"].value,
      OfficeCode: this.TrialForm.controls["OfficeCode"].value,
      Tenor: this.TrialForm.controls["Tenor"].value,
      TotalAssetPrice: this.TrialForm.controls["AssetPriceAmt"].value,
      MrFirstInstTypeCode: this.TrialForm.controls["MrFirstInstTypeCode"].value
    }
    this.http.post<AppFinDataObj>(URLConstant.GetInitFinDataForTrialCalc, reqObj).subscribe(
      (response) => {
        this.appFinDataObj = response;

        if (this.appFinDataObj.MrInstSchemeCode != CommonConstant.InstSchmRegularFix) {
          this.TrialForm.get("RateType").disable();
        }

        this.TrialForm.patchValue({
          EffectiveRatePrcnt: this.appFinDataObj.EffectiveRatePrcnt,
          StdEffectiveRatePrcnt: this.appFinDataObj.StdEffectiveRatePrcnt,

          RoundingAmt: this.appFinDataObj.RoundingAmt,
          EffectiveRateBhv: this.appFinDataObj.EffectiveRateBhv,
          SellSupplEffectiveRatePrcnt: this.appFinDataObj.SellSupplEffectiveRatePrcnt,
          AppSupplEffectiveRatePrcnt: this.appFinDataObj.AppSupplEffectiveRatePrcnt,

          DiffRateAmt: +this.appFinDataObj.DiffRateAmt,

          GrossYieldPrcnt: this.appFinDataObj.GrossYieldPrcnt,
          CummulativeTenor: this.appFinDataObj.CummulativeTenor,

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
        this.setValidator(this.TrialForm.controls.MrInstSchemeCode.value);
      }
    );
  }

  setValidator(mrInstSchemeCode) {
    if (mrInstSchemeCode == CommonConstant.InstSchmBalloon) {
      this.TrialForm.controls.BalloonValueAmt.setValidators([Validators.required]);
      this.TrialForm.controls.BalloonValueAmt.updateValueAndValidity();
    }
    if (mrInstSchemeCode == CommonConstant.InstSchmStepUpStepDownNormal || mrInstSchemeCode == CommonConstant.InstSchmStepUpStepDownLeasing) {
      this.TrialForm.controls.NumOfStep.setValidators([Validators.required, Validators.min(1)]);
      this.TrialForm.controls.NumOfStep.updateValueAndValidity();
      this.TrialForm.controls.StepUpStepDownInputType.setValidators([Validators.required]);
      this.TrialForm.controls.NumOfStep.updateValueAndValidity();
    }
  }

  Print() {

  }

}
