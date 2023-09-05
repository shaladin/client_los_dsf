import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ExceptionConstantDsf } from 'app/shared/constant/ExceptionConstantDsf';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { RefPayFreqObj } from 'app/shared/model/ref-pay-freq-obj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-plafond-installment-simulation-detail-dsf',
  templateUrl: './plafond-installment-simulation-detail-dsf.component.html',
  styleUrls: ['./plafond-installment-simulation-detail-dsf.component.css']
})
export class PlafondInstallmentSimulationDetailDsfComponent implements OnInit {

  ReqByIdObj: GenericObj = new GenericObj();
  AgrmntParentNo: string;
  AgrmntParentId: string;
  CustNo: string;
  CustName: string;
  RequestedPlafond: number;
  RemainingPlafond: number;
  MaxPlafondMasterAgreement: number;
  AssetPrice: number;
  applicationDDLitems = new Array();
  PayFreqVal: number;
  PayFreqTimeOfYear: number;
  DictRefPayFreq: { [id: string]: RefPayFreqObj } = {};
  InstAmt: number = 0;
  Tenor: number = 0;
  MaxTenor: number = 0;
  EffRate: number = 0;
  FlatRate: number = 0;
  ProdOfferingCode: string;
  IsGenerate: boolean = false;
  TrialCalc: boolean = true;
  appFinDataObj: AppFinDataObj = new AppFinDataObj();
  BizTmpltCode: string;
  user: CurrentUserContext;

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AgrmntParentId = params["AgrmntParentId"];
      this.CustNo = params["CustNo"];
    });
   }

   SimulationDetailForm = this.fb.group({
    OfficeCode: "",
    CustName: ['', [Validators.maxLength(500)]],
    Addr: ['', [Validators.maxLength(100)]],
    MobilePhone: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    AssetPriceAmt: ['', Validators.required],
    selectedDpType: ['', [Validators.required, Validators.maxLength(50)]],
    DownPaymentPrctg: ['', [Validators.required]],
    DownPaymentAmt: ['', [Validators.required]],
    Tenor: [0, [Validators.required]],
    PayFreqCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrInstSchemeCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrFirstInstTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrInstSchemeName: "",
    MrFirstInstTypeName: "",
    PayFreqValue: "",
    MrInstSchemeValue: "",
    MrFirstInstTypeValue: "",
    NumOfInst: 0,
    AppFee: this.fb.array([]),
    LobCode: "",
    BizTemplateCode: "",
    PrcntDp: 0,
    PrcntDpNett: 0,
    DownPaymentGrossAmt: 0,
    TotalAccessoryPriceAmt: 0,
    TotalAssetPriceAmtOnly: 0,
    TotalAssetPriceAmt: [0, [Validators.required]],
    TotalFeeAmt: 0,
    TotalFeeCptlzAmt: 0,
    TotalInsCustAmt: 0,
    InsCptlzAmt: 0,
    TotalInsInscoAmt: 0,
    TotalLifeInsCustAmt: 0,
    LifeInsCptlzAmt: 0,
    DownPaymentNettAmt: 0,
    TotalDownPaymentNettAmt: 0,
    TotalDownPaymentGrossAmt: 0,
    TdpPaidCoyAmt: 0,
    NtfAmt: 0,
    RateType: ["EFCTV", [Validators.required]],
    EffectiveRatePrcnt: 0,
    EffectiveRateBhv: "",
    StdEffectiveRatePrcnt: 0,
    FlatRatePrcnt: 0,
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
    MrProvisionFeeTypeCode: "",
    MrProvisionFeeCalcMethodCode: "",
    BalloonValueAmt: 0,
    LcRate: 0,
    MrLcCalcMethodCode: "",
    LcGracePeriod: 0,
    PrepaymentPenaltyRate: 0,
    ApvAmt: 0,
    TotalDpAmt: 0,
    VendorAtpmCode: null,
    MinEffectiveRatePrcnt: 0,
    MaxEffectiveRatePrcnt: 0,
    MinInterestIncomeAmt: 0,
    MinGrossYieldPrcnt: 0,
    MaxGrossYieldPrcnt: 0,
    MinBalloonAmt: 0,
    MaxBalloonAmt: 0,
    BalloonBhv: "",
    MinDownPaymentNettPrcnt: 0,
    MaxDownPaymentNettPrcnt: 0,
    CalcBase: "",
    NeedReCalculate: true,
    InstAmt: 0,

    CurrGrossYieldAmt: 0,
    StdGrossYieldAmt: 0,
    DiffGrossYieldAmt: 0
  });

  async ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BizTmpltCode = "CFNA";

    var searchParam = {
      CustNo : this.CustNo,
      AgrmntParentId : this.AgrmntParentId
    }
    await this.http.post(URLConstantDsf.GetAgrmntMasterXByAgrmntParentId, searchParam).toPromise().then(
      (response) => {
        this.AgrmntParentNo = response["MasterAgreementNo"];
        this.RequestedPlafond = response["RequestedPlafond"];
        this.RemainingPlafond = response["RemainingPlafond"];
        this.MaxPlafondMasterAgreement = response["MaxPlafondMasterAgreement"];
        this.AssetPrice = response["AssetPrice"];
        this.MaxTenor = response["MaxTenor"];
      }
    )

    this.ReqByIdObj.CustNo = this.CustNo;
    this.http.post(URLConstant.GetCustByCustNo, this.ReqByIdObj).subscribe(
      response => {
        this.CustName = response["CustName"];
      }
    );

    this.resetDDL();
    this.getDropdownValue(CommonConstant.RefMasterTypeCodeInstSchm);
    this.getDropdownValue(CommonConstant.RefMasterTypeCodePayFreq);
    this.getDropdownValue(CommonConstant.RefProdCompFirstInstType);

    this.getPayFregData();
  }

  resetDDL() {
    this.SimulationDetailForm.patchValue({
      PayFreqCode: '',
      MrInstSchemeCode: '',
      MrFirstInstTypeCode: '',
      PayFreqValue: '',
      MrInstSchemeValue: '',
      MrFirstInstTypeValue: '',
      MrInstSchemeName: '',
      MrFirstInstTypeName: '',
    });
  }

  ChangeLoanAmount()
  {
    this.IsGenerate = false;
  }

  changeNumOfInstallmentTenor() {
    var temp: number = +this.SimulationDetailForm.controls.Tenor.value;
    if (!isNaN(temp) && !isNaN(this.PayFreqTimeOfYear) && !isNaN(this.PayFreqVal)) {
      var total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }

    this.IsGenerate = false;
  }

  ChangeNumOfInstallmentPayFreq(ev) {
    if (ev.target.selectedIndex == 0) return;
    var idx = ev.target.selectedIndex - 1;
    var temp = this.SimulationDetailForm.controls.Tenor.value;
    if (!isNaN(temp)) {
      this.PayFreqVal = this.DictRefPayFreq[this.applicationDDLitems[CommonConstant.RefMasterTypeCodePayFreq][idx].Key].PayFreqVal;
      this.PayFreqTimeOfYear = this.DictRefPayFreq[this.applicationDDLitems[CommonConstant.RefMasterTypeCodePayFreq][idx].Key].TimeOfYear;
      var total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
      this.SimulationDetailForm.patchValue({
        PayFreqCode: this.applicationDDLitems[CommonConstant.RefMasterTypeCodePayFreq][idx].Key
      });
    }

    this.IsGenerate = false;
  }

  ChooseInstScheme(ev) {
    if (ev.target.selectedIndex == 0) return;
    var idx = ev.target.selectedIndex - 1;

    this.SimulationDetailForm.patchValue({
      MrInstSchemeCode: this.applicationDDLitems['INST_SCHM'][idx].Key,
      MrInstSchemeValue: this.applicationDDLitems['INST_SCHM'][idx].Value,
      MrInstSchemeName: this.applicationDDLitems['INST_SCHM'][idx].Value,
    });

    this.IsGenerate = false;
  }

  ChooseFirstInstType(ev) {
    if (ev.target.selectedIndex == 0) return;
    var idx = ev.target.selectedIndex - 1;

    this.SimulationDetailForm.patchValue({
      MrFirstInstTypeCode: this.applicationDDLitems['FIRSTINSTTYPE'][idx].Key,
      MrFirstInstTypeName: this.applicationDDLitems['FIRSTINSTTYPE'][idx].Value,
      MrFirstInstTypeValue: this.applicationDDLitems['FIRSTINSTTYPE'][idx].Value,
    });

    this.IsGenerate = false;
  }

  getDropdownValue(refProdCompntCode: string) {
    var obj = {
      ProdOfferingCode: 'NMG',
      RefProdCompntCode: refProdCompntCode,
    };
    this.http.post(URLConstant.GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, obj).subscribe(
      (response) => {
        var listDDL = response["DDLRefProdComptCode"];
        this.applicationDDLitems[refProdCompntCode] = listDDL;
        if (refProdCompntCode == CommonConstant.RefProdCompFirstInstType)
        {
        for (let i = 0; i < this.applicationDDLitems['FIRSTINSTTYPE'].length; i++) {
          if (this.SimulationDetailForm.value.MrFirstInstTypeCode == this.applicationDDLitems['FIRSTINSTTYPE'][i].Key) {
            this.SimulationDetailForm.patchValue({
              MrFirstInstTypeValue: this.applicationDDLitems['FIRSTINSTTYPE'][i].Value
            });
            break;
          }
        }
        }
        if (refProdCompntCode == CommonConstant.RefMasterTypeCodeInstSchm)
        {
        for (let i = 0; i < this.applicationDDLitems['INST_SCHM'].length; i++) {
          if (this.SimulationDetailForm.value.MrInstSchemeCode == this.applicationDDLitems['INST_SCHM'][i].Key) {
            this.SimulationDetailForm.patchValue({
              MrInstSchemeValue: this.applicationDDLitems['INST_SCHM'][i].Value
            });
            break;
          }
        }
        }
        if (refProdCompntCode == CommonConstant.RefMasterTypeCodePayFreq)
        {
        for (let i = 0; i < this.applicationDDLitems['PAYFREQ'].length; i++) {
          if (this.SimulationDetailForm.value.PayFreqCode == this.applicationDDLitems['PAYFREQ'][i].Key) {
            this.SimulationDetailForm.patchValue({
              PayFreqValue: this.applicationDDLitems['PAYFREQ'][i].Value
            });
            break;
          }
        }
        }
      });
  }

  PatchNumOfInstallment(num) {
    this.SimulationDetailForm.patchValue({
      NumOfInst: num
    });
  }

  Generate() {
    if (this.SimulationDetailForm.getRawValue().TotalAssetPriceAmt == '' || this.SimulationDetailForm.getRawValue().Tenor == '' || this.SimulationDetailForm.getRawValue().MrFirstInstTypeCode == ''
      || this.SimulationDetailForm.getRawValue().MrInstSchemeCode == '' || this.SimulationDetailForm.getRawValue().PayFreqCode == '') {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_COMPLETE_MANDATORY_INPUT);
      return false;
    }

    if (this.SimulationDetailForm.getRawValue().TotalAssetPriceAmt > this.MaxPlafondMasterAgreement) {
      this.toastr.warningMessage(ExceptionConstantDsf.EXCEEDED_FROM_PLAFOND_MASTER);
      return false;
    }


    if (this.RemainingPlafond > 0 && this.SimulationDetailForm.getRawValue().TotalAssetPriceAmt > this.RemainingPlafond) {
      this.toastr.warningMessage(ExceptionConstantDsf.EXCEEDED_FROM_REMAINING_PLAFOND);
      return false;
    }

    if (this.SimulationDetailForm.getRawValue().Tenor > this.MaxTenor) {
      this.toastr.warningMessage(ExceptionConstant.TENOR_EXCEEDED);
      return false;
    }

    else {

      var mrFirstInstTypeName = this.SimulationDetailForm.controls.MrFirstInstTypeCode.value;
      if(this.applicationDDLitems['FIRSTINSTTYPE'])
      {
        var itemFirstInstType = this.applicationDDLitems['FIRSTINSTTYPE'].find((obj) => {
          return obj["Key"] === this.SimulationDetailForm.controls.MrFirstInstTypeCode.value;
        });
        if (itemFirstInstType) mrFirstInstTypeName = itemFirstInstType["Value"];
      }

      var mrInstSchemeName = this.SimulationDetailForm.controls.MrInstSchemeCode.value;
      if(this.applicationDDLitems['INST_SCHM'])
      {
        var itemInstSchemeName = this.applicationDDLitems['INST_SCHM'].find((obj) => {
          return obj["Key"] === this.SimulationDetailForm.controls.MrInstSchemeCode.value;
        });
        if (itemInstSchemeName) mrInstSchemeName = itemInstSchemeName["Value"];
      }

      this.IsGenerate = true;
      this.LoadFinData();
      this.SimulationDetailForm.patchValue({
        Tenor: this.SimulationDetailForm.controls.Tenor.value,
        PayFreqCode: this.SimulationDetailForm.controls.PayFreqCode.value,
        MrInstSchemeCode: this.SimulationDetailForm.controls.MrInstSchemeCode.value,
        MrFirstInstTypeCode: this.SimulationDetailForm.controls.MrFirstInstTypeCode.value,
        BizTemplateCode: "CFNA",
        MrFirstInstTypeName: this.SimulationDetailForm.controls.MrFirstInstTypeName.value,
        MrInstSchemeName:this.SimulationDetailForm.controls.MrInstSchemeName.value,
        EffectiveRateBhv: "DEF"
      });
      this.getValueForReport();
    }
  }

  getValueForReport() {
    this.SimulationDetailForm.patchValue({
      PayFreqValue: '',
      MrInstSchemeValue: '',
      MrFirstInstTypeValue: ''
    });
    this.getDropdownValue(CommonConstant.RefMasterTypeCodeInstSchm);
    this.getDropdownValue(CommonConstant.RefMasterTypeCodePayFreq);
    this.getDropdownValue(CommonConstant.RefProdCompFirstInstType);
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

        this.changeNumOfInstallmentTenor();
      });
  }

  LoadFinData() {
    var reqObj = {
      ProdOfferingCode: "NMG",
      LobCode: "MPF",
      OfficeCode: this.user.OfficeCode,
      Tenor: this.SimulationDetailForm.controls.Tenor.value,
      TotalAssetPrice: this.AssetPrice,
      MrFirstInstTypeCode: this.SimulationDetailForm.controls.MrFirstInstTypeCode.value,
      DpNettPrcnt: 0
    }
    this.http.post<AppFinDataObj>(URLConstantDsf.GetInitFinDataForTrialCalcX, reqObj).subscribe(
      (response) => {
        this.appFinDataObj = response;

        if (this.SimulationDetailForm.controls["MrInstSchemeCode"].value != CommonConstant.InstSchmRegularFix) {
          this.SimulationDetailForm.get("RateType").disable();
        } else {
          this.SimulationDetailForm.get("RateType").enable();
        }

        this.SimulationDetailForm.patchValue({
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
          TotalDpAmt: this.SimulationDetailForm.getRawValue().DownPaymentAmt == "" ? 0 : this.SimulationDetailForm.getRawValue().DownPaymentAmt,
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
        this.setValidator(this.SimulationDetailForm.controls.MrInstSchemeCode.value);
      }
    );
  }

  setValidator(mrInstSchemeCode) {
    if (mrInstSchemeCode == CommonConstant.InstSchmBalloon) {
      this.SimulationDetailForm.controls.BalloonValueAmt.setValidators([Validators.required]);
      this.SimulationDetailForm.controls.BalloonValueAmt.updateValueAndValidity();
    }
    if (mrInstSchemeCode == CommonConstant.InstSchmStepUpStepDownNormal || mrInstSchemeCode == CommonConstant.InstSchmStepUpStepDownLeasing) {
      this.SimulationDetailForm.controls.NumOfStep.setValidators([Validators.required, Validators.min(1)]);
      this.SimulationDetailForm.controls.NumOfStep.updateValueAndValidity();
      this.SimulationDetailForm.controls.StepUpStepDownInputType.setValidators([Validators.required]);
      this.SimulationDetailForm.controls.NumOfStep.updateValueAndValidity();
    }
  }

  RefreshSummary()
  {
    this.InstAmt = this.SimulationDetailForm.controls.InstAmt.value;
    this.Tenor = this.SimulationDetailForm.controls.Tenor.value;
    this.EffRate = this.SimulationDetailForm.controls.EffectiveRatePrcnt.value;
    this.FlatRate = this.SimulationDetailForm.controls.FlatRatePrcnt.value;
  }

  ClickSave()
  {

  }

}
