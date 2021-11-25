import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppAssetAccessoryObj } from 'app/shared/model/app-asset-accessory-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { AppInsuranceObj } from 'app/shared/model/app-insurance-obj.model';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { InsuranceDataObj } from 'app/shared/model/insurance-data-obj.model';
import { InsuranceDataInsRateRuleObj } from 'app/shared/model/insurance-data-ins-rate-rule-obj.model';
import { ResultInsRateRuleObj } from 'app/shared/model/result-ins-rate-rule-obj.model';
import { RequestCalcInsObj } from 'app/shared/model/request-calc-ins-obj.model';
import { CalcInsMainCvgObj } from 'app/shared/model/calc-ins-main-cvg-obj.model';
import { CalcInsAddCvgObj } from 'app/shared/model/calc-ins-add-cvg-obj.model';
import { ResultCalcInsObj } from 'app/shared/model/result-calc-ins-obj.model';
import { AppInsMainCvgObj } from 'app/shared/model/app-ins-main-cvg-obj.model';
import { AppInsAddCvgObj } from 'app/shared/model/app-ins-add-cvg-obj.model';
import { ResultSubsidySchmRuleObj } from 'app/shared/model/subsidy-schm/result-subsidy-schm-rule-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { AppCollateralAccessoryObj } from 'app/shared/model/app-collateral-accessory-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InsRateAddCvgRuleObj } from 'app/shared/model/ins-rate-add-cvg-rule-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ReqGetVendorByCategoryCodeAndOfficeCodeObj } from 'app/shared/model/request/vendor/req-vendor.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { InsuranceLenObj, ResInsuranceLenObj } from 'app/shared/model/insurance-len-obj.model';
import { String } from 'typescript-string-operations';
import { ResInsuranceDataInsRateCvgRuleObj } from 'app/shared/model/Response/app-insurance/res-insurance-data-ins-rate-cvg-rule-obj.model';
import { InsuranceDataInsRateCvgRuleObj } from 'app/shared/model/insurance-data-ins-rate-cvg-rule-obj.model';

@Component({
  selector: 'app-insurance-data',
  templateUrl: './insurance-data.component.html',
  styleUrls: ['./insurance-data.component.css']
})

export class InsuranceDataComponent implements OnInit {

  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  appAssetId: number = 0;
  appCollateralId: number = 0;
  totalAssetPriceAmt: number;
  totalAssetInclAccessoryPriceAmt: number = 0;
  defaultInsAssetRegion: string;
  IsMultiAsset: string = "false";

  appObj: NapAppModel;
  appAssetObj: AppAssetObj;
  appAssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  appFinDataObj: AppFinDataObj;
  appInsuranceObj: AppInsuranceObj;
  appInsObjObj: AppInsObjObj;
  appInsMainCvgObj: Array<AppInsMainCvgObj>;
  appCollateralObj: AppCollateralObj;
  appCollateralAccessoryObjs: Array<AppCollateralAccessoryObj>;
  ruleObj: ResultInsRateRuleObj;
  subsidyRuleObj: ResultSubsidySchmRuleObj;
  calcInsObj: ResultCalcInsObj;
  saveObj: InsuranceDataObj;

  minInsLength: number = 1;
  maxInsLength: number = 9999;

  insuredByObj: Array<KeyValueObj>;
  inscoBranchObj: Array<KeyValueObj>;
  paidByObj: Array<KeyValueObj>;
  insMainCvgTypeObj: Array<KeyValueObj>;
  insAddCvgTypeObj: Array<KeyValueObj>;
  insAddCvgTypeRuleObj: Array<KeyValueObj>;
  groupedAddCvgType: Array<string>;
  insAssetCoverPeriodObj: Array<KeyValueObj>;
  insAssetRegionObj: Array<KeyValueObj>;
  payPeriodToInscoObj: Array<KeyValueObj>;
  defaultInsMainCvgType: string;
  showGenerate: boolean = false;
  isGenerate: boolean = false;
  isCalculate: boolean = false;
  businessDt: Date = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
  defInsPaidBy: string = CommonConstant.InsPaidByCustomer;
  adminFeeLock: boolean = false;
  stampdutyFeeLock: boolean = false;
  paidByBhv: Array<{ PaidByYearNo: number, PaidBy: string, PaidByBhv: string }>;
  isYearlyCapitalized: boolean = false;
  groupAddCvrSumInsuredDropDown: Object = new Object();
  isUsingSeatCount: boolean = false;
  AddCvgNeedSeatCount: Array<string> = [CommonConstant.MrAddCvgTypeCodePap];
  DictInsCustRate: { [id: string]: number } = {};
  ManufYearDiff: number;
  RuleRateCvgName: string;
  ListRuleNotComplete: Array<{ index: number, AddCvg: string }> = new Array();
  LoadingFeeCountType: string
  InscoHoCode: string;
  DefaultLoadingFeeYear: number;
  isFromDB: boolean = false;
  PageState: string = "AddInsurance";
  readonly EditInsurance = "EditInsurance";
  readonly DefaultPremiumType = CommonConstant.PremiumTypeAmt;
  RoundedAmt: number;

  InsuranceDataForm = this.fb.group({
    InsAssetCoveredBy: ['', [Validators.required, Validators.maxLength(50)]],
    InsAssetCoverPeriod: ['', [Validators.required, Validators.maxLength(50)]],
    InscoBranchCode: ['', [Validators.required, Validators.maxLength(100)]],
    InscoBranchName: [''],
    CustInscoBranchName: ['', [Validators.required, Validators.maxLength(100)]],
    InsPolicyNo: ['', Validators.maxLength(50)],
    InsPolicyName: ['', Validators.maxLength(100)],
    CustCoverStartDt: ['', Validators.required],
    EndDt: ['', Validators.required],
    Notes: ['', Validators.maxLength(4000)],
    CustNotes: ['', Validators.maxLength(4000)],
    InsMainCvgType: [''],
    InsAddCvgTypes: new FormArray([]),
    InsLength: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    InsAssetRegion: ['', [Validators.required, Validators.maxLength(50)]],
    AppInsMainCvgs: new FormArray([]),
    TotalCustFeeAmt: [0],
    TotalCustMainPremiAmt: [0],
    TotalCustAddPremiAmt: [0],
    TotalInscoMainPremiAmt: [0],
    TotalInscoAddPremiAmt: [0],
    InscoAdminFeeAmt: [0],
    CustAdminFeeAmt: [0],
    CustStampDutyFeeAmt: [0],
    InscoStampDutyFeeAmt: [0],
    TotalInscoFeeAmt: [0],
    CvgAmt: [0, Validators.required],
    CustCvgAmt: [0, Validators.required],
    TotalCustDiscAmt: [0],
    InsCpltzAmt: [0],
    PayPeriodToInsco: ['', Validators.required],
    IsFullCapitalizedAmount: [false]
  });

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) this.appId = params["AppId"];
      if (params["IsMultiAsset"] != null) this.IsMultiAsset = params["IsMultiAsset"];
    })
  }
  async ngOnInit(): Promise<void> {
    this.GetGeneralSettingDefaultLoadingFeeYear();
    await this.getInsuranceData();
    await this.bindInsMainCvgTypeObj();
    await this.bindInsAddCvgTypeObj();
    await this.bindInsuredByObj();
    await this.bindPaidByObj();
    await this.bindInsAssetCoverPeriodObj();
    await this.bindInsAssetRegionObj();
    await this.bindInscoBranchObj();
    await this.bindPayPeriodToInscoObj();
    await this.bindCapitalizeGeneralSetting();
    if (this.appInsObjObj != null) {
      await this.bindAppInsAndAppInsObj(this.appInsObjObj.InsAssetCoveredBy);
    } else {
      this.InsuranceDataForm.patchValue({
        InsAssetRegion: this.defaultInsAssetRegion
      });
    }
  }

  SaveForm() {
    var insuredBy = this.InsuranceDataForm.controls.InsAssetCoveredBy.value;
    var insCpltzAmt;
    if (insuredBy == CommonConstant.InsuredByCompany || insuredBy == CommonConstant.InsuredByCustomerCompany) {
      var custDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      var totalPremiToCust = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value + this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value + this.InsuranceDataForm.controls.TotalCustFeeAmt.value;
      if (this.InsuranceDataForm.controls.InsCpltzAmt.value == null) {
        insCpltzAmt = 0;
      }
      else {
        insCpltzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      }


      if (this.isGenerate == false) {
        this.toastr.warningMessage(ExceptionConstant.CLICK_GENERATE_INSURANCE);
        return;
      }
      if (this.isCalculate == false) {
        this.toastr.warningMessage(ExceptionConstant.CLICK_CALCULATE_INSURANCE);
        return;
      }
      if (custDiscAmt > totalPremiToCust) {
        this.toastr.warningMessage(ExceptionConstant.DISCOUNT_AMOUNT_CANNOT_HIGHER_THAN + "Total Premi to Customer.");
        return;
      }
      if (insCpltzAmt > totalPremiToCust - custDiscAmt) {
        this.toastr.warningMessage(ExceptionConstant.CAPITALIZE_AMOUNT_CANNOT_HIGHER_THAN + "Total Premi to Customer after Discount.");
        return;
      }
    }

    if (insuredBy == CommonConstant.InsuredByCustomer || insuredBy == CommonConstant.InsuredByCustomerCompany) {
      var startDt = new Date(this.InsuranceDataForm.controls.CustCoverStartDt.value);
      var endDt = new Date(this.InsuranceDataForm.controls.EndDt.value);

      if (endDt < this.businessDt) {
        this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LOWER_THAN + "Business Date.");
        return;
      }

      if (endDt < startDt) {
        this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LOWER_THAN + "Start Date.");
        return;
      }
    }
    this.setSaveObj(insuredBy);

    // if (this.IsMultiAsset = "false") {
    this.http.post(URLConstant.AddEditInsuranceData, this.saveObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        this.outputTab.emit();
      });
    // }
    // else {
    //   this.http.post(URLConstant.AddEditInsuranceDataMultiAsset, this.saveObj).subscribe(
    //     (response) => {
    //       this.toastr.successMessage(response["Message"]);
    //       this.outputTab.emit();
    //     });
    // }
  }

  Cancel() {
    this.outputCancel.emit();
  }

  setSaveObj(insuredBy) {
    this.saveObj = new InsuranceDataObj();
    this.saveObj.AppId = this.appId;
    this.saveObj.AppInsuranceObj.AppId = this.appId;
    this.saveObj.AppInsObjObj.AppId = this.appId;
    this.saveObj.AppInsObjObj.InsAssetCoveredBy = insuredBy;
    this.saveObj.AppInsObjObj.InsSeqNo = 1;

    if (this.appAssetId != 0) {
      this.saveObj.AppInsObjObj.AppAssetId = this.appAssetId;
    }
    if (this.appCollateralId != 0) {
      this.saveObj.AppInsObjObj.AppCollateralId = this.appCollateralId;
    }

    if (insuredBy == CommonConstant.InsuredByOffSystem) {
      this.saveObj.AppInsObjObj.InsAssetPaidBy = CommonConstant.InsPaidByCustomer;
    }

    if (insuredBy == CommonConstant.InsuredByCustomer) {
      this.saveObj.AppInsObjObj.InsAssetPaidBy = CommonConstant.InsPaidByCustomer;
      this.saveObj.AppInsObjObj.CustInscoBranchName = this.InsuranceDataForm.controls.CustInscoBranchName.value;
      this.saveObj.AppInsObjObj.InsPolicyNo = this.InsuranceDataForm.controls.InsPolicyNo.value;
      this.saveObj.AppInsObjObj.InsPolicyName = this.InsuranceDataForm.controls.InsPolicyName.value;
      this.saveObj.AppInsObjObj.CustCvgAmt = this.InsuranceDataForm.controls.CustCvgAmt.value;
      this.saveObj.AppInsObjObj.CustCoverStartDt = this.InsuranceDataForm.controls.CustCoverStartDt.value;
      this.saveObj.AppInsObjObj.EndDt = this.InsuranceDataForm.controls.EndDt.value;
      this.saveObj.AppInsObjObj.CustNotes = this.InsuranceDataForm.controls.CustNotes.value;
    }

    if (insuredBy == CommonConstant.InsuredByCompany) {
      this.saveObj.AppInsObjObj.InsAssetPaidBy = CommonConstant.InsPaidByCustomer;
      this.saveObj.AppInsObjObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
      this.saveObj.AppInsObjObj.InscoBranchName = this.InsuranceDataForm.controls.InscoBranchName.value;
      this.saveObj.AppInsObjObj.InsAssetCoverPeriod = this.InsuranceDataForm.controls.InsAssetCoverPeriod.value;
      this.saveObj.AppInsObjObj.InsLength = this.InsuranceDataForm.controls.InsLength.value;
      this.saveObj.AppInsObjObj.CvgAmt = this.InsuranceDataForm.controls.CvgAmt.value;
      this.saveObj.AppInsObjObj.Notes = this.InsuranceDataForm.controls.Notes.value;
      this.saveObj.AppInsObjObj.InsAssetRegion = this.InsuranceDataForm.controls.InsAssetRegion.value;
      if (this.InsuranceDataForm.controls.InsCpltzAmt.value == null) {
        this.saveObj.AppInsObjObj.InsCpltzAmt = 0;
      }
      else {
        this.saveObj.AppInsObjObj.InsCpltzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      }
      this.saveObj.AppInsObjObj.CustAdminFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
      this.saveObj.AppInsObjObj.InscoAdminFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value;
      this.saveObj.AppInsObjObj.CustStampDutyFee = this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
      this.saveObj.AppInsObjObj.InscoStampDutyFee = this.InsuranceDataForm.controls.InscoStampDutyFeeAmt.value;
      this.saveObj.AppInsObjObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsObjObj.TotalInsCustAmt = this.saveObj.AppInsObjObj.TotalCustMainPremiAmt + this.saveObj.AppInsObjObj.TotalCustAddPremiAmt + this.InsuranceDataForm.controls.TotalCustFeeAmt.value - this.saveObj.AppInsObjObj.TotalCustDiscAmt;
      this.saveObj.AppInsObjObj.TotalInsInscoAmt = this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt + this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt + this.InsuranceDataForm.controls.TotalInscoFeeAmt.value - this.saveObj.AppInsObjObj.TotalInscoDiscAmt;
      this.saveObj.AppInsObjObj.StartDt = this.setDateWithoutTimezone(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
      this.saveObj.AppInsObjObj.EndDt = this.setDateWithoutTimezone(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
      this.saveObj.AppInsObjObj.EndDt.setMonth(this.saveObj.AppInsObjObj.EndDt.getMonth() + this.saveObj.AppInsObjObj.InsLength);
      this.saveObj.AppInsObjObj.PayPeriodToInsco = this.InsuranceDataForm.controls.PayPeriodToInsco.value;

      let startDt = new Date(this.saveObj.AppInsObjObj.StartDt);
      let totalTenor = this.saveObj.AppInsObjObj.InsLength;
      let mainCvgEndDt: Date = new Date(startDt);
      for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
        var insCoverage = new AppInsMainCvgObj();
        insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
        insCoverage.MrInsPaidByCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrInsPaidByCode.value;
        insCoverage.IsCapitalized = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].IsCapitalized.value;
        insCoverage.Tenor = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
        insCoverage.MrMainCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;

        insCoverage.StartDt = startDt;
        let tenorAdded: number = 12;
        if (totalTenor < 12) tenorAdded = totalTenor;
        mainCvgEndDt.setMonth(mainCvgEndDt.getMonth() + totalTenor);
        insCoverage.EndDt = mainCvgEndDt;

        totalTenor -= 12;
        if (totalTenor > 12) {
          startDt = new Date(mainCvgEndDt);
          startDt.setDate(startDt.getDate() + 1);
          mainCvgEndDt = new Date(startDt);
        }

        insCoverage.IsMainIns = true;
        insCoverage.SumInsuredPrcnt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
        insCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredAmt.value;
        insCoverage.CustMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
        insCoverage.InscoMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;
        insCoverage.CustMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiAmt.value;
        insCoverage.InscoMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiAmt.value;
        insCoverage.TotalCustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalCustAddPremiAmt.value;
        insCoverage.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalInscoAddPremiAmt.value;

        for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
          if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
            var addCoverage = new AppInsAddCvgObj();

            addCoverage.MrAddCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
            addCoverage.SumInsuredPrcnt = insCoverage.SumInsuredPrcnt;
            addCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
            addCoverage.PremiumType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value;
            addCoverage.BaseCalc = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].BaseCalculation.value;
            if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value == CommonConstant.PremiumTypeAmt) {
              addCoverage.InscoAddPremiRate = 0;
              addCoverage.CustAddPremiRate = 0;
            } else {
              addCoverage.InscoAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiRate.value;
              addCoverage.CustAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiRate.value;
            }
            addCoverage.InscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiAmt.value;
            addCoverage.CustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiAmt.value;
            insCoverage.AppInsAddCvgObjs.push(addCoverage);
          }
        }
        this.saveObj.AppInsMainCvgObjs.push(insCoverage);
      }

      this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value + this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustPremiAmt = this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt + this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt + this.saveObj.AppInsuranceObj.TotalCustFeeAmt - this.saveObj.AppInsuranceObj.TotalCustDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value + this.InsuranceDataForm.controls.InscoStampDutyFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoDiscAmt = 0;
      this.saveObj.AppInsuranceObj.TotalInscoPremiAmt = this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoFeeAmt - this.saveObj.AppInsuranceObj.TotalInscoDiscAmt;
      if (this.InsuranceDataForm.controls.InsCpltzAmt.value == null) {
        this.saveObj.AppInsuranceObj.TotalInsCptlzAmt = 0;

      }
      else {
        this.saveObj.AppInsuranceObj.TotalInsCptlzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      }
      this.saveObj.AppInsuranceObj.TotalPremiPaidByCustAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInsCptlzAmt;
      this.saveObj.AppInsuranceObj.TotalInsIncomeAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInscoPremiAmt;
    }

    if (insuredBy == CommonConstant.InsuredByCustomerCompany) {
      this.saveObj.AppInsObjObj.InsAssetPaidBy = CommonConstant.InsPaidByCustomer;
      this.saveObj.AppInsObjObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
      this.saveObj.AppInsObjObj.InscoBranchName = this.InsuranceDataForm.controls.InscoBranchName.value;
      this.saveObj.AppInsObjObj.InsAssetCoverPeriod = this.InsuranceDataForm.controls.InsAssetCoverPeriod.value;
      this.saveObj.AppInsObjObj.InsLength = this.InsuranceDataForm.controls.InsLength.value;
      this.saveObj.AppInsObjObj.CvgAmt = this.InsuranceDataForm.controls.CvgAmt.value;;
      this.saveObj.AppInsObjObj.Notes = this.InsuranceDataForm.controls.Notes.value;
      this.saveObj.AppInsObjObj.InsAssetRegion = this.InsuranceDataForm.controls.InsAssetRegion.value;
      if (this.InsuranceDataForm.controls.InsCpltzAmt.value == null) {
        this.saveObj.AppInsObjObj.InsCpltzAmt = 0;
      }
      else {
        this.saveObj.AppInsObjObj.InsCpltzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      }
      this.saveObj.AppInsObjObj.CustAdminFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
      this.saveObj.AppInsObjObj.InscoAdminFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value;
      this.saveObj.AppInsObjObj.CustStampDutyFee = this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
      this.saveObj.AppInsObjObj.InscoStampDutyFee = this.InsuranceDataForm.controls.InscoStampDutyFeeAmt.value;
      this.saveObj.AppInsObjObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsObjObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsObjObj.TotalInsCustAmt = this.saveObj.AppInsObjObj.TotalCustMainPremiAmt + this.saveObj.AppInsObjObj.TotalCustAddPremiAmt + this.InsuranceDataForm.controls.TotalCustFeeAmt.value - this.saveObj.AppInsObjObj.TotalCustDiscAmt;
      this.saveObj.AppInsObjObj.TotalInsInscoAmt = this.saveObj.AppInsObjObj.TotalInscoMainPremiAmt + this.saveObj.AppInsObjObj.TotalInscoAddPremiAmt + this.InsuranceDataForm.controls.TotalInscoFeeAmt.value - this.saveObj.AppInsObjObj.TotalInscoDiscAmt;
      this.saveObj.AppInsObjObj.CustInscoBranchName = this.InsuranceDataForm.controls.CustInscoBranchName.value;
      this.saveObj.AppInsObjObj.InsPolicyNo = this.InsuranceDataForm.controls.InsPolicyNo.value;
      this.saveObj.AppInsObjObj.InsPolicyName = this.InsuranceDataForm.controls.InsPolicyName.value;
      this.saveObj.AppInsObjObj.CustCvgAmt = this.InsuranceDataForm.controls.CustCvgAmt.value;
      this.saveObj.AppInsObjObj.CustCoverStartDt = this.InsuranceDataForm.controls.CustCoverStartDt.value;
      let startDt: Date = new Date(this.InsuranceDataForm.get("EndDt").value);
      startDt.setDate(startDt.getDate() + 1);
      this.saveObj.AppInsObjObj.StartDt = startDt;
      let endDt: Date = new Date(startDt);
      endDt.setMonth(endDt.getMonth() + this.saveObj.AppInsObjObj.InsLength);
      this.saveObj.AppInsObjObj.EndDt = endDt;
      this.saveObj.AppInsObjObj.CustNotes = this.InsuranceDataForm.controls.CustNotes.value;
      this.saveObj.AppInsObjObj.PayPeriodToInsco = this.InsuranceDataForm.controls.PayPeriodToInsco.value;

      let totalTenor = this.saveObj.AppInsObjObj.InsLength;
      let mainCvgEndDt: Date = new Date(startDt);
      for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
        var insCoverage = new AppInsMainCvgObj();
        insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
        insCoverage.MrInsPaidByCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrInsPaidByCode.value;
        insCoverage.IsCapitalized = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].IsCapitalized.value;
        insCoverage.Tenor = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
        insCoverage.MrMainCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;

        insCoverage.StartDt = startDt;
        let tenorAdded: number = 12;
        if (totalTenor < 12) tenorAdded = totalTenor;
        mainCvgEndDt.setMonth(mainCvgEndDt.getMonth() + totalTenor);
        insCoverage.EndDt = mainCvgEndDt;

        totalTenor -= 12;
        if (totalTenor > 12) {
          startDt = new Date(mainCvgEndDt);
          startDt.setDate(startDt.getDate() + 1);
          mainCvgEndDt = new Date(startDt);
        }

        insCoverage.IsMainIns = true;
        insCoverage.SumInsuredPrcnt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
        insCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredAmt.value;
        insCoverage.CustMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
        insCoverage.InscoMainPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;
        insCoverage.CustMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiAmt.value;
        insCoverage.InscoMainPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiAmt.value;
        insCoverage.TotalCustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalCustAddPremiAmt.value;
        insCoverage.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].TotalInscoAddPremiAmt.value;

        for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
          if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
            var addCoverage = new AppInsAddCvgObj();

            addCoverage.MrAddCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
            addCoverage.SumInsuredPrcnt = insCoverage.SumInsuredPrcnt;
            addCoverage.SumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
            if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value == CommonConstant.PremiumTypeAmt) {

              addCoverage.InscoAddPremiRate = 0;
              addCoverage.CustAddPremiRate = 0;
            } else {
              addCoverage.InscoAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiRate.value;
              addCoverage.CustAddPremiRate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiRate.value;
            }
            addCoverage.InscoAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiAmt.value;
            addCoverage.CustAddPremiAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiAmt.value;
            insCoverage.AppInsAddCvgObjs.push(addCoverage);
          }
        }
        this.saveObj.AppInsMainCvgObjs.push(insCoverage);
      }

      this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt = this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value + this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      this.saveObj.AppInsuranceObj.TotalCustPremiAmt = this.saveObj.AppInsuranceObj.TotalCustMainPremiAmt + this.saveObj.AppInsuranceObj.TotalCustAddPremiAmt + this.saveObj.AppInsuranceObj.TotalCustFeeAmt - this.saveObj.AppInsuranceObj.TotalCustDiscAmt;
      this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt = this.InsuranceDataForm.controls.TotalInscoMainPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt = this.InsuranceDataForm.controls.TotalInscoAddPremiAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoFeeAmt = this.InsuranceDataForm.controls.InscoAdminFeeAmt.value + this.InsuranceDataForm.controls.InscoStampDutyFeeAmt.value;
      this.saveObj.AppInsuranceObj.TotalInscoDiscAmt = 0;
      this.saveObj.AppInsuranceObj.TotalInscoPremiAmt = this.saveObj.AppInsuranceObj.TotalInscoMainPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoAddPremiAmt + this.saveObj.AppInsuranceObj.TotalInscoFeeAmt - this.saveObj.AppInsuranceObj.TotalInscoDiscAmt;
      if (this.InsuranceDataForm.controls.InsCpltzAmt.value == null) {
        this.saveObj.AppInsuranceObj.TotalInsCptlzAmt = 0;
      }
      else {
        this.saveObj.AppInsuranceObj.TotalInsCptlzAmt = this.InsuranceDataForm.controls.InsCpltzAmt.value;
      }
      this.saveObj.AppInsuranceObj.TotalPremiPaidByCustAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInsCptlzAmt;
      this.saveObj.AppInsuranceObj.TotalInsIncomeAmt = this.saveObj.AppInsuranceObj.TotalCustPremiAmt - this.saveObj.AppInsuranceObj.TotalInscoPremiAmt;
    }

    if (this.appInsuranceObj != undefined) {
      this.saveObj.AppInsuranceObj.RowVersion = this.appInsuranceObj.RowVersion;
    }

    if (this.appInsObjObj != undefined) {
      this.saveObj.AppInsObjObj.RowVersion = this.appInsObjObj.RowVersion;
    }
  }

 
  async CalculateInsurance() {
    if (!this.isGenerate) {
      this.toastr.warningMessage(ExceptionConstant.CLICK_GENERATE_INSURANCE);
      return;
    }

    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value == "") {
        this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.markAsTouched();
      }
    }

    let isRuleComplete = true;
    if (!this.InsuranceDataForm.controls["AppInsMainCvgs"].valid) return;
    let reqObj = new RequestCalcInsObj();
    
    await this.getRoundedAmt();

    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      var insCoverage = new CalcInsMainCvgObj();

      insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
      insCoverage.Month = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
      insCoverage.CoverageAmt = this.InsuranceDataForm.controls.CvgAmt.value;;
      insCoverage.SumInsured = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
      insCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
      insCoverage.MainCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;
      insCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;

      let ruleNotCompletes = this.ListRuleNotComplete.filter(x => x.index == i);
      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
        for (let k = 0; k < ruleNotCompletes.length; k++) {
          if (ruleNotCompletes[k].AddCvg == this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value && this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value) {
            this.toastr.warningMessage(String.Format(ExceptionConstant.SETTING_COMPONENT_RULE_FIRST, this.RuleRateCvgName, this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].AddCvgTypeName.value, insCoverage.YearNo));
            isRuleComplete = false;
          }
        }

        if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
          let addCoverage = new CalcInsAddCvgObj();

          addCoverage.BaseCalculation = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].BaseCalculation.value;
          addCoverage.SumInsured = insCoverage.SumInsured;
          addCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].CustAddPremiRate.value;
          addCoverage.RateType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value;
          addCoverage.AddCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
          addCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].InscoAddPremiRate.value;
          addCoverage.SeatCount = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SeatCount.value;
          insCoverage.AddInsCoverage.push(addCoverage);
        }
      }
      reqObj.InsCoverage.push(insCoverage);
    }

    if (!isRuleComplete) return;

    reqObj.AdminFee = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
    reqObj.StampDutyFee = this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
    reqObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    reqObj.ProdOfferingCode = this.appObj.ProdOfferingCode;
    reqObj.ProdOfferingVersion = this.appObj.ProdOfferingVersion;
    reqObj.AppId = this.appId;
    reqObj.AppAssetId = this.appAssetId;
    reqObj.AppCollateralId = this.appCollateralId;
    reqObj.RoundedAmt = this.RoundedAmt;

    await this.http.post(URLConstant.CalculateInsurance, reqObj).toPromise().then(
      (response) => {
        this.calcInsObj = response["Result"];
        this.subsidyRuleObj = response["ResultSubsidy"];
        let custDiscAmt = 0;
        let capitalised = 0;
        // cek ins paid by AtCost to calculate DiscountAmt & capitalised
        if (this.calcInsObj.InsCoverage.length) for (let resInsCovItem of this.calcInsObj.InsCoverage) {
          let currReq = this.InsuranceDataForm.controls['AppInsMainCvgs']['controls'].find(i => i['controls']['YearNo'].value === resInsCovItem.YearNo);
          let mrInsPaidByCode = currReq ? currReq['controls']['MrInsPaidByCode'].value : this.defInsPaidBy;
          let isCapitalized = this.isYearlyCapitalized && currReq ? currReq['controls']['IsCapitalized'].value : false;
          if (mrInsPaidByCode == CommonConstant.InsPaidByAtCost) {
            custDiscAmt += resInsCovItem.MainPremiAmt + resInsCovItem.AdditionalPremiAmt;
          }
          else if (resInsCovItem.YearNo == 1 && currReq['controls']['IsCapitalized'].value) {
            let totalFee = this.InsuranceDataForm.controls.CustAdminFeeAmt.value + this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value
            capitalised += totalFee + resInsCovItem.MainPremiAmt + resInsCovItem.AdditionalPremiAmt;
          }
          else if (isCapitalized) {
            capitalised += resInsCovItem.MainPremiAmt + resInsCovItem.AdditionalPremiAmt;
          }
        }

        this.InsuranceDataForm.patchValue({
          TotalCustFeeAmt: this.calcInsObj.TotalFeeAmt,
          TotalCustMainPremiAmt: this.calcInsObj.TotalMainPremiAmt,
          TotalCustAddPremiAmt: this.calcInsObj.TotalAdditionalPremiAmt,
          TotalInscoMainPremiAmt: this.calcInsObj.TotalMainPremiToInscoAmt,
          TotalInscoAddPremiAmt: this.calcInsObj.TotalAdditionalPremiToInscoAmt,
          TotalCustDiscAmt: custDiscAmt,
          InsCpltzAmt: capitalised,
        });

        for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
          this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
            CustMainPremiRate: this.calcInsObj.InsCoverage[i].Rate,
            InscoMainPremiRate: this.calcInsObj.InsCoverage[i].RateToInsco,
            SumInsuredAmt: this.calcInsObj.InsCoverage[i].SumInsuredAmt,
            CustMainPremiAmt: this.calcInsObj.InsCoverage[i].MainPremiAmt,
            InscoMainPremiAmt: this.calcInsObj.InsCoverage[i].MainPremiToInscoAmt,
            TotalInscoAddPremiAmt: this.calcInsObj.InsCoverage[i].AdditionalPremiToInscoAmt,
            TotalCustAddPremiAmt: this.calcInsObj.InsCoverage[i].AdditionalPremiAmt,
          });

          for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
            let currAddCvgType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;

            if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
              let currAddCvg = this.calcInsObj.InsCoverage[i].AddInsCoverage.find(x => x.AddCoverageTypeCode == currAddCvgType);

              let sumInsuredAmt = currAddCvg.SumInsuredAmt;
              if (this.groupAddCvrSumInsuredDropDown[i][currAddCvgType]) {
                sumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
              }

              this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                CustAddPremiRate: currAddCvg.Rate,
                InscoAddPremiRate: currAddCvg.RateToInsco,
                SumInsuredAmt: sumInsuredAmt,
                CustAddPremiAmt: currAddCvg.AddPremiAmt,
                InscoAddPremiAmt: currAddCvg.AddPremiToInscoAmt
              });
            } else {
              let sumInsuredAmt = null;
              if (this.groupAddCvrSumInsuredDropDown[i][currAddCvgType]) {
                sumInsuredAmt = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].SumInsuredAmt.value;
              }

              this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                SumInsuredAmt: sumInsuredAmt,
                CustAddPremiAmt: 0,
                InscoAddPremiAmt: 0
              });
            }
          }
          reqObj.InsCoverage.push(insCoverage);
        }
        this.isCalculate = true;
        this.checkPaidBy();
      }
    );
    this.BindCapitalize();
  }

  async GenerateInsurance(appInsMainCvgObj: Array<AppInsMainCvgObj>) {
    this.ListRuleNotComplete = new Array();
    if(this.PageState == this.EditInsurance) this.isFromDB = false;

    if (appInsMainCvgObj == undefined) {
      if (this.InsuranceDataForm.controls.InscoBranchCode.value == "") {
        this.toastr.warningMessage(ExceptionConstant.CHOOSE_INSCO_BRANCH);
        return;
      }
      if (this.InsuranceDataForm.controls.InsAssetRegion.value == "") {
        this.toastr.warningMessage(ExceptionConstant.CHOOSE_REGION);
        return;
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == "") {
        this.toastr.warningMessage(ExceptionConstant.CHOOSE_COVER_PERIOD);
        return;
      }
      if (this.InsuranceDataForm.controls.InsLength.value == "") {
        this.toastr.warningMessage(ExceptionConstant.INPUT_INSURANCE_LENGTH);
        return;
      }
      if (this.InsuranceDataForm.controls.InsLength.value < this.minInsLength) {
        this.toastr.warningMessage(ExceptionConstant.INSURANCE_LENGTH_MUST_HIGHER_THAN + (this.minInsLength - 1).toString());
        return;
      }
      if (this.InsuranceDataForm.controls.InsLength.value > this.maxInsLength) {
        this.toastr.warningMessage(ExceptionConstant.INSURANCE_LENGTH_MUST_LOWER_THAN + (this.maxInsLength + 1).toString());
        return;
      }
      // this.InsuranceDataForm.controls.InscoBranchCode.markAsTouched();
      // this.InsuranceDataForm.controls.InsAssetPaidBy.markAsTouched();
      // this.InsuranceDataForm.controls.InsAssetRegion.markAsTouched();
      // this.InsuranceDataForm.controls.InsAssetCoverPeriod.markAsTouched();
      // this.InsuranceDataForm.controls.CvgAmt.markAsTouched();
      // this.InsuranceDataForm.controls.InsLength.markAsTouched();
      // if(!this.InsuranceDataForm.valid){
      //   return;
      // }
    }
    if (this.InsuranceDataForm.controls.CvgAmt.value == 0) {
      this.toastr.warningMessage(ExceptionConstant.COVERAGE_CANT_0_LESS);
      return;
    }
    let reqObj = new InsuranceDataInsRateRuleObj();
    reqObj.InscoHoCode = this.InscoHoCode;
    reqObj.InscoCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    reqObj.RegionCode = this.InsuranceDataForm.controls.InsAssetRegion.value;
    reqObj.AppId = this.appId;
    reqObj.AppAssetId = this.appAssetId;
    reqObj.AppCollateralId = this.appCollateralId;

    await this.http.post(URLConstant.ExecuteInsRateRuleV2, reqObj).toPromise().then(
      async (response) => {
        this.ruleObj = response["Result"];
        if (this.ruleObj.InsAssetCategory == "") {
          this.toastr.warningMessage(ExceptionConstant.INS_ASSET_CATEGORY_NOT_FOUND);
          return;
        }
        // group sum insurace for dropdown premium Type AMT
        //this.insRateAddCvgRuleTplObjs = response["InsRateAddCvgRuleTplObjs"];
        this.isUsingSeatCount = false;
        let InsRateAddCvgRuleObjs = response['InsRateAddCvgRuleObjs'];
        if (response["InsRateAddCvgRuleTplObjs"]) InsRateAddCvgRuleObjs = InsRateAddCvgRuleObjs.concat(response["InsRateAddCvgRuleTplObjs"]);

        await this.bindInsMainCvgTypeObj();
        this.bindInsAddCvgTypeRuleObj();
        this.bindInsPaidByRuleObj();

        if (appInsMainCvgObj == undefined) {
          this.InsuranceDataForm.patchValue({
            CustAdminFeeAmt: this.ruleObj.AdminFeeToCust,
            InscoAdminFeeAmt: this.ruleObj.AdminFeeFromInsco,
            CustStampDutyFeeAmt: this.ruleObj.CustStampdutyFeeToCust,
            InscoStampDutyFeeAmt: this.ruleObj.InscoStampdutyFeeToCust,
            TotalInscoFeeAmt: this.ruleObj.AdminFeeFromInsco + this.ruleObj.InscoStampdutyFeeToCust
          });
          await this.GenerateMainAndAddCvgTable();
        } else {
          this.PageState = this.EditInsurance;
          this.isFromDB = true;
          await this.GenerateMainAndAddCvgTableFromDB(appInsMainCvgObj);
        }
        this.isGenerate = true;
        this.bindInsFeeBehaviorRuleObj();
        this.showGenerate = true;
        this.checkPaidBy();
      }
    );
    this.BindCapitalize();
  }

  async GenerateMainAndAddCvgTable() {

    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);
    this.GenerateAddCvgForm();
  }
  
  GenerateAddCvgForm() {
    let yearCount = this.InsuranceDataForm.controls.InsLength.value;
    let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
    let month: number = 12;
    for (let i = 0; i < noOfYear; i++) {
      this.groupAddCvrSumInsuredDropDown[i] = new Object();
      let obj = { Tenor: 0, SumInsuredPrcnt: 0, CustMainPremiRate: 0, InscoMainPremiRate: 0 };

      if (yearCount - 12 >= 0) {
        month = 12;
      } else {
        month = yearCount;
      }

      obj.Tenor = month;
      obj.SumInsuredPrcnt = this.ruleObj.SumInsuredPercentage[i];
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroup(i, obj));
      yearCount -= 12;
    }
  }

  async GetLoadingFeeCountType(): Promise<string> {
    let loadingFeeCountType: string = "";
    await this.http.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstant.GSCodeLoadingFeeCountType }).toPromise().then(
      (response: GeneralSettingObj) => {
        loadingFeeCountType = response.GsValue ? response.GsValue : CommonConstant.LoadingFeeCountType_CountingYear;
      }
    );
    console.log(loadingFeeCountType);
    return loadingFeeCountType;
  }

  CountTypeCountingYear(index: number) {
    this.ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    this.ManufYearDiff += index;
  }

  CountTypeFirstYear() {
    this.ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
  }

  CountTypeLastYear() {
    this.ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
    this.ManufYearDiff += (noOfYear - 1);
  }

  async GenerateMainAndAddCvgTableFromDB(appInsMainCvgObj: Array<AppInsMainCvgObj>) {
    this.ListRuleNotComplete = new Array();
    this.ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    let loadingFeeCountType: string = await this.GetLoadingFeeCountType();
    if (loadingFeeCountType == CommonConstant.LoadingFeeCountType_LastYear) {
      let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
      this.ManufYearDiff += (noOfYear - 1);
    }
    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);
    for (let i = 0; i < appInsMainCvgObj.length; i++) {
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(await this.addGroupFromDB(i, appInsMainCvgObj[i], this.ManufYearDiff));
      if (loadingFeeCountType == CommonConstant.LoadingFeeCountType_CountingYear) this.ManufYearDiff++;
    }
  }

  bindInsAddCvgTypeRuleObj() {
    (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray) = this.fb.array([]);
    this.insAddCvgTypeRuleObj = [{ Key: "", Value: "" }];
    this.groupedAddCvgType = Array.from(new Set(this.ruleObj.AdditionalCoverageType));
    this.groupedAddCvgType.forEach((o) => {
      if (o == CommonConstant.MrAddCvgTypeCodeLoading) {
        var isLoadingExist = this.insAddCvgTypeRuleObj.find(x => x.Key == CommonConstant.MrAddCvgTypeCodeLoading);
        if (!isLoadingExist) {
          var item = this.insAddCvgTypeObj.find(x => x.Key == o);
          this.insAddCvgTypeRuleObj.push(item);
        }
      }
      else {
        var item = this.insAddCvgTypeObj.find(x => x.Key == o);
        this.insAddCvgTypeRuleObj.push(item);
      }
    });
    this.insAddCvgTypeRuleObj.splice(0, 1);
    this.addCheckbox();
  }

  bindInsFeeBehaviorRuleObj() {
    this.adminFeeLock = false;
    this.stampdutyFeeLock = false;
    let CustAdminFeeAmt = this.InsuranceDataForm.get("CustAdminFeeAmt");
    let CustAdminFeeAmtValidator = [Validators.required];
    switch (this.ruleObj.AdminFeeToCustBhv) {
      case CommonConstant.InsFeeBhvDef:
        //set default jika pertama kali create
        if (this.appInsObjObj == null) this.InsuranceDataForm.patchValue({ CustAdminFeeAmt: this.ruleObj.AdminFeeToCust });
        break;
      case CommonConstant.InsFeeBhvMin:
        CustAdminFeeAmtValidator.push(Validators.min(this.ruleObj.AdminFeeToCust));
        break;
      case CommonConstant.InsFeeBhvMax:
        CustAdminFeeAmtValidator.push(Validators.max(this.ruleObj.AdminFeeToCust));
        break;
      case CommonConstant.InsFeeBhvLock:
        this.adminFeeLock = true;
        break;
    }
    CustAdminFeeAmt.setValidators(CustAdminFeeAmtValidator);
    CustAdminFeeAmt.updateValueAndValidity();

    let CustStampDutyFeeAmt = this.InsuranceDataForm.get("CustStampDutyFeeAmt");
    let CustStampDutyFeeAmtValidator = [Validators.required];
    switch (this.ruleObj.CustStampdutyFeeToCustBhv) {
      case CommonConstant.InsFeeBhvDef:
        //set default jika pertama kali create
        if (this.appInsObjObj == null) this.InsuranceDataForm.patchValue({ CustStampDutyFeeAmt: this.ruleObj.AdminFeeToCust });
        break;
      case CommonConstant.InsFeeBhvMin:
        CustStampDutyFeeAmtValidator.push(Validators.min(this.ruleObj.CustStampdutyFeeToCust));
        break;
      case CommonConstant.InsFeeBhvMax:
        CustStampDutyFeeAmtValidator.push(Validators.max(this.ruleObj.CustStampdutyFeeToCust));
        break;
      case CommonConstant.InsFeeBhvLock:
        this.stampdutyFeeLock = true;
        break;
    }
    CustStampDutyFeeAmt.setValidators(CustStampDutyFeeAmtValidator);
    CustStampDutyFeeAmt.updateValueAndValidity();
  }

  bindInsPaidByRuleObj() {
    this.paidByBhv = [];
    this.ruleObj.PaidByYearNo.forEach((o, i) => {
      this.paidByBhv.push({
        PaidByYearNo: o,
        PaidBy: this.ruleObj.PaidBy[i],
        PaidByBhv: this.ruleObj.PaidByBhv[i],
      });
    });
  }

  addGroup(i, obj) {
    let currYear = i + 1
    let currPaidByBhv = this.paidByBhv.find(i => i.PaidByYearNo == currYear);

    let group = this.fb.group({
      MrInsPaidByCode: currPaidByBhv ? currPaidByBhv.PaidBy : this.defInsPaidBy,
      isPaidByLock: (currPaidByBhv && currPaidByBhv.PaidByBhv == CommonConstant.InsPaidByBhvLock),
      IsCapitalized: false,
      YearNo: currYear,
      Tenor: obj.Tenor,
      SumInsuredPrcnt: [obj.SumInsuredPrcnt, [Validators.required, Validators.min(0), Validators.max(100)]],
      SumInsuredAmt: 0,
      MrMainCvgTypeCode: ['', Validators.required],
      CustMainPremiRate: 0,
      CustMainPremiAmt: 0,
      InscoMainPremiRate: obj.InscoMainPremiRate,
      InscoMainPremiAmt: 0,
      TotalInscoAddPremiAmt: 0,
      TotalCustAddPremiAmt: 0,
      AppInsAddCvgs: new FormArray([])
    });

    this.insAddCvgTypeRuleObj.forEach((o) => {
      this.AddDictInsCustRate(o.Key, 0);

      const control = this.fb.group({
        MrAddCvgTypeCode: o.Key,
        AddCvgTypeName: o.Value,
        Value: false,
        SumInsuredPercentage: obj.SumInsuredPercentage,
        SumInsuredAmt: 0,
        PremiumType: this.DefaultPremiumType,
        CustAddPremiRate: 0,
        CustAddPremiAmt: 0,
        BaseCalculation: "",
        InscoAddPremiRate: 0,
        InscoAddPremiAmt: 0,
        SeatCount: 0,
      });
      (group.controls.AppInsAddCvgs as FormArray).push(control);


      // if (ManufYearDiff <= 5)
      //     checkboxValue = false;
      //   else
      //     checkboxValue = true;
    });
    return group;
  }

  AddDictInsCustRate(MrAddCvgTypeCode: string, rate: number) {
    if (this.DictInsCustRate[MrAddCvgTypeCode] == null || this.DictInsCustRate[MrAddCvgTypeCode] == undefined || this.DictInsCustRate[MrAddCvgTypeCode] == 0) this.DictInsCustRate[MrAddCvgTypeCode] = rate;
  }
  
  async addGroupFromDB(MainCvgIndex: number, insMainCvg: AppInsMainCvgObj, ManufYearDiff) {
    let response: ResInsuranceDataInsRateCvgRuleObj;
    response = await this.ExecuteInstRateCvgRule(insMainCvg.MrMainCvgTypeCode);

    this.groupAddCvrSumInsuredDropDown[MainCvgIndex] = new Object();
    response.InsRateAddCvgRuleObjs.forEach(currAddCvrItem => {
      if (currAddCvrItem.PremiumType == CommonConstant.PremiumTypeAmt) {
        if (typeof (this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType]) == 'undefined')
          this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType] = new Array<InsRateAddCvgRuleObj>();
        this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType].push(currAddCvrItem);
      }
    });

    let currPaidByBhv = this.paidByBhv.find(i => i.PaidByYearNo == insMainCvg.YearNo);
    let group = this.fb.group({
      MrInsPaidByCode: insMainCvg.MrInsPaidByCode,
      isPaidByLock: (currPaidByBhv && currPaidByBhv.PaidByBhv == CommonConstant.InsPaidByBhvLock),
      IsCapitalized: insMainCvg.IsCapitalized,
      YearNo: insMainCvg.YearNo,
      Tenor: insMainCvg.Tenor,
      SumInsuredPrcnt: [insMainCvg.SumInsuredPrcnt, [Validators.required, Validators.min(0), Validators.max(100)]],
      SumInsuredAmt: insMainCvg.SumInsuredAmt,
      MrMainCvgTypeCode: insMainCvg.MrMainCvgTypeCode,
      MainCvgTypeName: this.insMainCvgTypeObj.find(x => x.Key == insMainCvg.MrMainCvgTypeCode).Value,
      CustMainPremiRate: insMainCvg.CustMainPremiRate,
      CustMainPremiAmt: insMainCvg.CustMainPremiAmt,
      InscoMainPremiRate: insMainCvg.InscoMainPremiRate,
      InscoMainPremiAmt: insMainCvg.InscoMainPremiAmt,
      TotalInscoAddPremiAmt: insMainCvg.TotalInscoAddPremiAmt,
      TotalCustAddPremiAmt: insMainCvg.TotalCustAddPremiAmt,
      AppInsAddCvgs: new FormArray([])
    });

    let count = 0;
    this.insAddCvgTypeRuleObj.forEach((o) => {
      let check;
      if (insMainCvg.AppInsAddCvgObjs == undefined) {
        check = undefined;
      } else {
        check = insMainCvg.AppInsAddCvgObjs.find(x => x.MrAddCvgTypeCode == o.Key);
      }

      let defaultSumInsuredAmt = 0;
      let AddCvgIndex = response.InsRateAddCvgRuleObjs.findIndex(x => x.AdditionalCoverageType == o.Key);
      let premiumType = check != undefined ? check.PremiumType : AddCvgIndex != -1 ? response.InsRateAddCvgRuleObjs[AddCvgIndex].PremiumType : null;
      let custAddPremiRate = 0;
      let inscoAddPremiRate = 0;

      if (premiumType) {
        if (premiumType == CommonConstant.PremiumTypeAmt) {
          this.AddDictInsCustRate(o.Key, response.InsRateAddCvgRuleObjs[AddCvgIndex].PremiToCust);
          if (this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key] && check == undefined) {
            defaultSumInsuredAmt = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key][0].SumInsuredAmt;
            custAddPremiRate = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key][0].PremiToCust;
            inscoAddPremiRate = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key][0].PremiToInsco;
          }
          else {
            let AddCvgRateIndex = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key].findIndex(x => x.SumInsuredAmt == check.SumInsuredAmt);
            custAddPremiRate = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key][AddCvgRateIndex].PremiToCust;
            inscoAddPremiRate = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key][AddCvgRateIndex].PremiToInsco;
          }
        }

        if (premiumType == CommonConstant.PremiumTypePrcnt) {
          this.AddDictInsCustRate(o.Key, response.InsRateAddCvgRuleObjs[AddCvgIndex].RateToCust);
          custAddPremiRate = check == undefined ? response.InsRateAddCvgRuleObjs[AddCvgIndex].RateToCust : check.CustAddPremiRate;
          inscoAddPremiRate = check == undefined ? response.InsRateAddCvgRuleObjs[AddCvgIndex].RateToInsco : check.InscoAddPremiRate;
        }
      }
      // if (o.Key == CommonConstant.MrAddCvgTypeCodeTpl) {
      //   defaultSumInsuredAmt = this.insRateAddCvgRuleTplObjs[0].SumInsuredAmt;
      //   this.AddDictInsCustRate(o.Key, this.insRateAddCvgRuleTplObjs[0].PremiToCust);
      //   custAddPremiRate = check == undefined ? this.insRateAddCvgRuleTplObjs[0].PremiToCust : check.CustAddPremiAmt;
      //   inscoAddPremiRate = check == undefined ? this.insRateAddCvgRuleTplObjs[0].PremiToInsco : check.InscoAddPremiAmt;
      // }

      if (check) {
        if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
          const control = this.fb.group({
            MrAddCvgTypeCode: o.Key,
            AddCvgTypeName: o.Value,
            Value: true,
            SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
            SumInsuredAmt: check.SumInsuredAmt,
            PremiumType: check.PremiumType,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: check.CustAddPremiAmt,
            BaseCalculation: check.BaseCalc,
            InscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiAmt: check.InscoAddPremiAmt,
            SeatCount: 0,
          });
          (group.controls.AppInsAddCvgs as FormArray).push(control);
        }
        else {
          // cek Seat Count
          let seatCount = 0;
          if (this.AddCvgNeedSeatCount.includes(o.Key)) {
            if (!this.isUsingSeatCount) this.isUsingSeatCount = true;
            if (check && this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key]) {
              let DdlAddCvgSumInsured = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key].find(x => x.SumInsuredAmt == check.SumInsuredAmt);
              if (DdlAddCvgSumInsured) {
                seatCount = check.CustAddPremiAmt / DdlAddCvgSumInsured.PremiToCust;
                custAddPremiRate = DdlAddCvgSumInsured.PremiToCust;
                inscoAddPremiRate = DdlAddCvgSumInsured.PremiToInsco;
              }
            }
          }
          const control = this.fb.group({
            MrAddCvgTypeCode: o.Key,
            AddCvgTypeName: o.Value,
            Value: true,
            SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
            SumInsuredAmt: check.SumInsuredAmt,
            PremiumType: check.PremiumType,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: check.CustAddPremiAmt,
            BaseCalculation: check.BaseCalc,
            InscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiAmt: check.InscoAddPremiAmt,
            SeatCount: seatCount
          });
          (group.controls.AppInsAddCvgs as FormArray).push(control);
        }
      } else {
        const control = this.fb.group({
          MrAddCvgTypeCode: o.Key,
          AddCvgTypeName: o.Value,
          Value: false,
          SumInsuredPercentage: 0,
          SumInsuredAmt: null,
          PremiumType: this.DefaultPremiumType,
          CustAddPremiRate: null,
          CustAddPremiAmt: 0,
          BaseCalculation: "",
          InscoAddPremiRate: 0,
          InscoAddPremiAmt: 0,
          SeatCount: 0
        });
        (group.controls.AppInsAddCvgs as FormArray).push(control);
      }

      if (!response.InsRateAddCvgRuleObjs.find(x => x.AdditionalCoverageType == group.controls.AppInsAddCvgs["controls"][count].controls.MrAddCvgTypeCode.value)) {
        this.ListRuleNotComplete.push({ index: MainCvgIndex, AddCvg: group.controls.AppInsAddCvgs["controls"][count].controls.MrAddCvgTypeCode.value });
      } else if (group.controls.AppInsAddCvgs["controls"][count].controls.CustAddPremiRate.value == null) {
        this.ListRuleNotComplete.push({ index: MainCvgIndex, AddCvg: group.controls.AppInsAddCvgs["controls"][count].controls.MrAddCvgTypeCode.value })
      }

      count++;
    });

    return group;
  }

  async MainCvgTypeDetailChanged(event: any, index: number) {    
    if (event.target.value != '') {   
      if(this.PageState == this.EditInsurance && this.isFromDB){
        this.ListRuleNotComplete = new Array();
        this.ResetFormForEdit();
      }else{
        let response: ResInsuranceDataInsRateCvgRuleObj;
        response = await this.ExecuteInstRateCvgRule(event.target.value);
        this.ListRuleNotComplete = this.ListRuleNotComplete.filter(x => x.index != index);
        await this.PatchInsRateCvg(index, response.InsRateMainCvgRuleObj, response.InsRateAddCvgRuleObjs);
      }
    }
    this.isCalculate = false;
  }

  IsMainCvgChaged(event, i: number) {
    this.isCalculate = false;
    if (i != undefined && this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["MrInsPaidByCode"].value == CommonConstant.InsPaidByAtCost) {
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
        IsCapitalized: false,
      });
    }
    this.checkPaidBy();
  }

  IsAllPaidByCust: boolean = true;
  checkPaidBy() {
    this.IsAllPaidByCust = true;
    let tempListAppInsMainCvgs = this.InsuranceDataForm.get("AppInsMainCvgs") as FormArray;
    let totalDiscAmt: number = 0;
    for (let index = 0; index < tempListAppInsMainCvgs.length; index++) {
      const element = tempListAppInsMainCvgs.get(index.toString()) as FormGroup;
      if (element.get("MrInsPaidByCode").value == CommonConstant.InsPaidByAtCost) {
        totalDiscAmt += (element.get("CustMainPremiAmt").value + element.get("TotalCustAddPremiAmt").value);
        this.IsAllPaidByCust = false;
      }
    }
    this.InsuranceDataForm.get("TotalCustDiscAmt").patchValue(totalDiscAmt);
  }

  async IsAddCvgChanged(event: any, MainCvgIndex: number, AddCvgIndex: number) {
    this.isCalculate = false;
    this.cekSeatCount();

    if (this.PageState == this.EditInsurance && this.isFromDB) {
      this.ListRuleNotComplete = new Array();
      let checked = event.target.checked;
      
      await this.ResetFormForEdit();
      this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][MainCvgIndex].controls.AppInsAddCvgs["controls"][AddCvgIndex].patchValue({
        Value: checked
      });
    }
  }

  setRate(mainCoverageType, i) {
    var index = this.ruleObj.MainCoverageType.findIndex(x => x == mainCoverageType);
    this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
      CustMainPremiRate: this.ruleObj.MainRateToCust[index],
      InscoMainPremiRate: this.ruleObj.MainRateToInsco[index]
    });
    for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
      var currAddCvgType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
      var indexAdd = this.ruleObj.AdditionalCoverageType.findIndex(x => x == currAddCvgType);

      var premiumType = this.ruleObj.PremiumType[indexAdd];
      var custAddPremiRate = 0;
      var inscoAddPremiRate = 0;

      if (premiumType == CommonConstant.PremiumTypeAmt) {
        custAddPremiRate = this.ruleObj.PremiToCust[indexAdd];
        inscoAddPremiRate = this.ruleObj.PremiToInsco[indexAdd];
      }

      if (premiumType == CommonConstant.PremiumTypePrcnt) {
        custAddPremiRate = this.ruleObj.RateToCust[indexAdd];
        inscoAddPremiRate = this.ruleObj.RateToInsco[indexAdd];
      }

      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
        CustAddPremiRate: custAddPremiRate,
        InscoAddPremiRate: inscoAddPremiRate,
      });
    }
  }

  SumInsuredAmtAddCvgChanged(event, i, j) {
    this.isCalculate = false;
    let addInsTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].controls.MrAddCvgTypeCode.value;
    if (this.groupAddCvrSumInsuredDropDown[i][addInsTypeCode]) {
      let addCvgTplObj = this.groupAddCvrSumInsuredDropDown[i][addInsTypeCode].find(x => x.SumInsuredAmt == event.target.value);
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
        CustAddPremiRate: addCvgTplObj.PremiToCust,
        InscoAddPremiRate: addCvgTplObj.PremiToInsco,
        StdAddPremiRate: addCvgTplObj.BaseRate
      });
    }
  }

  async ApplyToCoverage() {
    this.ListRuleNotComplete = new Array();
    if(this.PageState == this.EditInsurance) this.isFromDB = false;
    let MainCoverageType = this.InsuranceDataForm.controls.InsMainCvgType.value;

    let response: ResInsuranceDataInsRateCvgRuleObj;
    response = await this.ExecuteInstRateCvgRule(MainCoverageType);
    
    this.ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
        MrMainCvgTypeCode: MainCoverageType
      });

      // this.setRate(MainCoverageType, i);
      // this.ResetAddCvgAtIdx(i);
      await this.PatchInsRateCvg(i, response["InsRateMainCvgRuleObj"], response["InsRateAddCvgRuleObjs"]);

      const formAddCvgChecked = this.InsuranceDataForm.controls.InsAddCvgTypes["controls"].filter(x => x.value.Value == true);

      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
        let check = formAddCvgChecked.find(x => x.value.Key == this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].AddCvgTypeName.value);

        if (check != undefined) {
          if (check.value.Key == CommonConstant.AddCvgTypeNameLoading) {
            if (this.ManufYearDiff <= this.DefaultLoadingFeeYear) {
              this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                Value: false
              });
            }
            else {
              this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
                Value: true
              });
            }
          }
          else {
            this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
              Value: check.value.Value
            });
          };
        } else {
          this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
            Value: false
          });
        }
      }
    }
    this.cekSeatCount();
    this.isCalculate = false;
  }

  CvgAmtChanged() {
    this.isGenerate = false;
  }

  CustAdminFeeAmtChanged() {
    this.isCalculate = false;
  }

  CoverPeriodChanged(event) {
    this.setInsLengthDefaultValue(event.target.value);
    this.isGenerate = false;
  }

  AssetRegionChanged() {
    this.isGenerate = false;
  }

  InsAssetPaidByChanged(event) {
    this.setPaidByInput(event.target.value);
    this.isGenerate = false;
  }

  InsLengthChanged() {
    this.isGenerate = false;
  }

  EndDt_FocusOut() {
    this.setInsLength();
  }

  setInsLength() {
    if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
      this.GetGetCuCoInsLength();
      return;
    }
    if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCompany) {
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodFullTenor) {
        this.InsuranceDataForm.patchValue({
          InsLength: this.appObj.Tenor
        });
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodPartialTenor) {
        this.setInsLengthValidator(CommonConstant.CoverPeriodPartialTenor);
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodOverTenor) {
        this.setInsLengthValidator(CommonConstant.CoverPeriodOverTenor);
      }
    }

  }

  setPaidByInput(paidBy) {
    if (paidBy == CommonConstant.InsPaidByAtCost) {
      this.InsuranceDataForm.controls.TotalCustDiscAmt.disable();
      this.InsuranceDataForm.controls.IsFullCapitalizedAmount.disable();
      this.InsuranceDataForm.controls.InsCpltzAmt.disable();
    } else {
      this.InsuranceDataForm.controls.TotalCustDiscAmt.enable();
      this.InsuranceDataForm.controls.IsFullCapitalizedAmount.enable();
      this.InsuranceDataForm.controls.InsCpltzAmt.enable();
      this.BindCapitalize();
      this.IsFullCapitalizedAmount();
    }
  }

  setTenorCustCompany(tenor: number) {
    var months;
    var endDt: Date = new Date(this.setDateWithoutTimezone(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW)));
    endDt.setMonth(endDt.getMonth() + tenor);

    //Calculate the differences between the start and end dates
    var yearsDifference: number = endDt.getFullYear() - this.businessDt.getFullYear();
    var monthsDifference: number = endDt.getMonth() - this.businessDt.getMonth();
    var daysDifference: number = endDt.getDate() - this.businessDt.getDate();

    var monthCorrection = 0;
    if (daysDifference > 0) {
      monthCorrection = 1;
    }

    months = (yearsDifference * 12 + monthsDifference + monthCorrection);

    // tenor = tenor - months;
    return months;
  }

  insLenCust: number = 0;
  GetGetCuCoInsLength() {
    let tempForm = this.InsuranceDataForm as FormGroup;
    let tempReq: InsuranceLenObj = new InsuranceLenObj();
    tempReq.CustEndDt = tempForm.get("EndDt").value;
    tempReq.Tenor = this.appObj.Tenor;
    tempReq.VendorCode = tempForm.get("InscoBranchCode").value;
    tempReq.MrCoverPeriod = tempForm.get("InsAssetCoverPeriod").value;

    if(this.CheckInsuranceLenObj(tempReq)) return;
    this.http.post(URLConstant.GetCuCoInsLength, tempReq).subscribe(
      (response: ResInsuranceLenObj) => {
        let InsuranceLen = response.InsuranceLen;

        let tempInsLength = tempForm.get("InsLength");
        let tempPartialMinus = 0;
        if (tempReq.MrCoverPeriod != CommonConstant.CoverPeriodOverTenor) {
          this.minInsLength = 1;
          this.maxInsLength = 9999;
          tempInsLength.enable();
          if (tempReq.MrCoverPeriod == CommonConstant.CoverPeriodFullTenor || tempReq.MrCoverPeriod == CommonConstant.CoverPeriodAnnually){
            tempInsLength.disable();
            tempInsLength.patchValue(InsuranceLen);
          } 
          if (tempReq.MrCoverPeriod == CommonConstant.CoverPeriodPartialTenor) {
            this.maxInsLength = InsuranceLen;
            tempPartialMinus = 1;
          }
        } else {
          this.minInsLength = InsuranceLen + 1;
          this.maxInsLength = 9999;
          tempInsLength.enable();
        }
        this.insLenCust = this.appObj.Tenor - InsuranceLen - tempPartialMinus;
        tempInsLength.setValidators([Validators.required, Validators.min(this.minInsLength), Validators.max(this.maxInsLength)]);
        tempInsLength.updateValueAndValidity();
      }
    );
  }

  CheckInsuranceLenObj(tempReq: InsuranceLenObj): boolean {
    let flag = false;
    if (!tempReq.CustEndDt) flag = true;
    let tempEndDt: Date = new Date(tempReq.CustEndDt);
    if (tempEndDt < this.businessDt) {
      this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LOWER_THAN + "Business Date.");
      flag = true;
    }
    if (!tempReq.VendorCode) flag = true;
    if (!tempReq.MrCoverPeriod) flag = true;
    return flag;
  }

  setInsLengthDefaultValue(coverPeriod: string) {
    if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
      this.GetGetCuCoInsLength();
      return;
    }
    if (coverPeriod == CommonConstant.CoverPeriodAnnually) {
      this.InsuranceDataForm.patchValue({
        InsLength: 12
      });
    }

    if (coverPeriod == CommonConstant.CoverPeriodFullTenor) {
      var tenor = this.appObj.Tenor;
      if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
        tenor = this.setTenorCustCompany(tenor);
      }
      this.InsuranceDataForm.patchValue({
        InsLength: tenor
      });
    }

    if (coverPeriod == CommonConstant.CoverPeriodPartialTenor) {
      this.InsuranceDataForm.patchValue({
        InsLength: 1
      });
    }

    if (coverPeriod == CommonConstant.CoverPeriodOverTenor) {
      this.InsuranceDataForm.patchValue({
        InsLength: this.appObj.Tenor + 1
      });
    }

    this.setInsLengthValidator(coverPeriod);
  }

  setInsLengthValidator(coverPeriod) {
    if (coverPeriod == CommonConstant.CoverPeriodAnnually) {
      this.minInsLength = 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.disable();
    }

    if (coverPeriod == CommonConstant.CoverPeriodFullTenor) {
      this.minInsLength = 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.disable();
    }

    if (coverPeriod == CommonConstant.CoverPeriodPartialTenor) {
      var tenor = this.appObj.Tenor;
      if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
        tenor = this.setTenorCustCompany(tenor);
      }
      this.minInsLength = 1;
      this.maxInsLength = tenor - 1;
      this.InsuranceDataForm.controls.InsLength.enable();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength), Validators.max(this.maxInsLength)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }

    if (coverPeriod == CommonConstant.CoverPeriodOverTenor) {
      var tenor = this.appObj.Tenor;
      if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
        tenor = this.setTenorCustCompany(tenor);
      }
      this.minInsLength = tenor + 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.enable();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength), Validators.max(this.maxInsLength)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }
  }

  InscoBranchCodeChanged(event) {
    if (event.target.value != "") {
      this.InsuranceDataForm.patchValue({
        InscoBranchName: this.inscoBranchObj.find(x => x.Key == event.target.value).Value
      });
      this.GetVendorParent(event.target.value);
    } else {
      this.InsuranceDataForm.patchValue({
        InscoBranchName: ""
      });
    }
    this.isGenerate = false;
  }

  GetVendorParent(ChildVendorCode: string) {
    this.http.post(URLConstant.GetVendorParentByVendorCode, { Code: ChildVendorCode }).subscribe(
      (response) => {
        this.InscoHoCode = response["VendorCode"];
      }
    );
  }

  InsuredByChanged(event) {
    this.setInsLength();
    this.setValidator(event.target.value);
  }

  setValidator(insuredBy) {
    if (insuredBy == CommonConstant.InsuredByOffSystem) {
      this.InsuranceDataForm.controls.CustInscoBranchName.clearValidators();
      this.InsuranceDataForm.controls.CustInscoBranchName.updateValueAndValidity()
      this.InsuranceDataForm.controls.InscoBranchCode.clearValidators();
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyNo.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.clearValidators();
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.clearValidators();
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.Notes.clearValidators();
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustNotes.clearValidators();
      this.InsuranceDataForm.controls.CustNotes.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.clearValidators();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsLength.clearValidators();
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.clearValidators();
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCvgAmt.clearValidators();
      this.InsuranceDataForm.controls.CustCvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CvgAmt.clearValidators();
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.PayPeriodToInsco.clearValidators();
      this.InsuranceDataForm.controls.PayPeriodToInsco.updateValueAndValidity();
    }

    if (insuredBy == CommonConstant.InsuredByCustomer) {
      this.InsuranceDataForm.controls.CustInscoBranchName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.CustInscoBranchName.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyNo.setValidators(Validators.maxLength(50));
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.setValidators(Validators.maxLength(100));
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustNotes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.CustNotes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCvgAmt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CustCvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.clearValidators();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsLength.clearValidators();
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.clearValidators();
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.InsuranceDataForm.controls.InscoBranchCode.clearValidators();
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();
      this.InsuranceDataForm.controls.Notes.clearValidators();
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CvgAmt.clearValidators();
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.PayPeriodToInsco.clearValidators();
      this.InsuranceDataForm.controls.PayPeriodToInsco.updateValueAndValidity();
    }

    if (insuredBy == CommonConstant.InsuredByCompany) {
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.setInsLengthValidator(this.InsuranceDataForm.controls.InsAssetCoverPeriod.value);
      this.InsuranceDataForm.controls.Notes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.InsuranceDataForm.controls.CvgAmt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.PayPeriodToInsco.setValidators(Validators.required);
      this.InsuranceDataForm.controls.PayPeriodToInsco.updateValueAndValidity();
      this.InsuranceDataForm.controls.InscoBranchCode.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();

      this.InsuranceDataForm.controls.InsPolicyNo.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.clearValidators();
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.clearValidators();
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustInscoBranchName.clearValidators();
      this.InsuranceDataForm.controls.CustInscoBranchName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustNotes.clearValidators();
      this.InsuranceDataForm.controls.CustNotes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCvgAmt.clearValidators();
      this.InsuranceDataForm.controls.CustCvgAmt.updateValueAndValidity();
    }

    if (insuredBy == CommonConstant.InsuredByCustomerCompany) {
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.setInsLengthValidator(this.InsuranceDataForm.controls.InsAssetCoverPeriod.value);
      this.InsuranceDataForm.controls.Notes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustInscoBranchName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.CustInscoBranchName.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyNo.setValidators(Validators.maxLength(50));
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.setValidators(Validators.maxLength(100));
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustNotes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.CustNotes.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCvgAmt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CustCvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.CvgAmt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CvgAmt.updateValueAndValidity();
      this.InsuranceDataForm.controls.PayPeriodToInsco.setValidators(Validators.required);
      this.InsuranceDataForm.controls.PayPeriodToInsco.updateValueAndValidity();
      this.InsuranceDataForm.controls.InscoBranchCode.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();
    }
  }

  setDateWithoutTimezone(inputDate) {
    var date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);
    var userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
  }

  async getInsuranceData() {
    var reqObj = { Id: this.appId }
    await this.http.post(URLConstant.GetInsuranceDataByAppId, reqObj).toPromise().then(
      (response) => {
        this.appObj = response["AppObj"];
        this.appAssetObj = response["AppAssetObj"];
        this.appAssetAccessoryObjs = response["AppAssetAccessoryObjs"];
        this.appFinDataObj = response["AppFinDataObj"];
        this.appInsuranceObj = response["AppInsuranceObj"];
        this.appInsObjObj = response["AppInsObjObj"];
        this.appInsMainCvgObj = response["AppInsMainCvgObjs"];
        this.appCollateralObj = response["AppCollateralObj"];
        this.appCollateralAccessoryObjs = response["AppCollateralAccessoryObjs"];
        this.defaultInsAssetRegion = response["DefaultInsAssetRegion"];

        this.totalAssetPriceAmt = this.appCollateralObj.CollateralValueAmt
        this.totalAssetInclAccessoryPriceAmt = this.totalAssetPriceAmt;
        if (this.appCollateralAccessoryObjs.length > 0) {
          for (let i = 0; i < this.appCollateralAccessoryObjs.length; i++) {
            this.totalAssetInclAccessoryPriceAmt += this.appCollateralAccessoryObjs[i].AccessoryPriceAmt;
          }
        }

        if (this.appFinDataObj != undefined) {
          this.InsuranceDataForm.patchValue({
            CvgAmt: this.totalAssetInclAccessoryPriceAmt,
            CustCvgAmt: this.totalAssetInclAccessoryPriceAmt
          });
        }
        if (this.appAssetObj != undefined) {
          this.appAssetId = this.appAssetObj.AppAssetId;
        }
        if (this.appCollateralObj != undefined) {
          this.appCollateralId = this.appCollateralObj.AppCollateralId;
        }

        if (this.appInsObjObj != undefined) {
          if (this.appInsObjObj.InsAssetCoveredBy == CommonConstant.InsuredByCompany || this.appInsObjObj.InsAssetCoveredBy == CommonConstant.InsuredByCustomerCompany) {
            this.GetVendorParent(this.appInsObjObj.InscoBranchCode);
          }
        }
      });
  }

  async bindAppInsAndAppInsObj(insuredBy) {
    if (this.appInsuranceObj != null && this.appInsObjObj != null) {
      if (insuredBy == CommonConstant.InsuredByOffSystem) {
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy
        });
      }

      if (insuredBy == CommonConstant.InsuredByCustomer) {
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy,
          CustInscoBranchName: this.appInsObjObj.CustInscoBranchName,
          InsPolicyNo: this.appInsObjObj.InsPolicyNo,
          InsPolicyName: this.appInsObjObj.InsPolicyName,
          CustCoverStartDt: formatDate(this.appInsObjObj.CustCoverStartDt, 'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.appInsObjObj.EndDt, 'yyyy-MM-dd', 'en-US'),
          CustNotes: this.appInsObjObj.CustNotes,
          CustCvgAmt: this.appInsObjObj.CustCvgAmt
        });
      }

      if (insuredBy == CommonConstant.InsuredByCustomerCompany) {
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy,
          InscoBranchCode: this.appInsObjObj.InscoBranchCode,
          InscoBranchName: this.appInsObjObj.InscoBranchName,
          InsAssetCoverPeriod: this.appInsObjObj.InsAssetCoverPeriod,
          InsAssetRegion: this.appInsObjObj.InsAssetRegion,
          InsLength: this.appInsObjObj.InsLength,
          Notes: this.appInsObjObj.Notes,
          TotalCustMainPremiAmt: this.appInsObjObj.TotalCustMainPremiAmt,
          TotalCustAddPremiAmt: this.appInsObjObj.TotalCustAddPremiAmt,
          TotalInscoMainPremiAmt: this.appInsObjObj.TotalInscoMainPremiAmt,
          TotalInscoAddPremiAmt: this.appInsObjObj.TotalInscoAddPremiAmt,
          InsCpltzAmt: this.appInsObjObj.InsCpltzAmt,
          InscoAdminFeeAmt: this.appInsObjObj.InscoAdminFeeAmt,
          InscoStampDutyFeeAmt: this.appInsObjObj.InscoStampDutyFee,
          CustAdminFeeAmt: this.appInsObjObj.CustAdminFeeAmt,
          CustStampDutyFeeAmt: this.appInsObjObj.CustStampDutyFee,
          CustInscoBranchName: this.appInsObjObj.CustInscoBranchName,
          InsPolicyNo: this.appInsObjObj.InsPolicyNo,
          InsPolicyName: this.appInsObjObj.InsPolicyName,
          CustCoverStartDt: formatDate(this.appInsObjObj.CustCoverStartDt, 'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.appInsObjObj.StartDt, 'yyyy-MM-dd', 'en-US'),
          CustNotes: this.appInsObjObj.CustNotes,
          CustCvgAmt: this.appInsObjObj.CustCvgAmt,
          CvgAmt: this.appInsObjObj.CvgAmt,
          TotalCustFeeAmt: this.appInsObjObj.CustAdminFeeAmt + this.appInsObjObj.CustStampDutyFee,
          TotalInscoFeeAmt: this.appInsObjObj.InscoAdminFeeAmt + this.appInsObjObj.InscoStampDutyFee,
          TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt,
          PayPeriodToInsco: this.appInsObjObj.PayPeriodToInsco
        });
        // this.setPaidByInput(this.appInsObjObj.InsAssetPaidBy);
        this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
        await this.GenerateInsurance(this.appInsMainCvgObj);
      }

      if (insuredBy == CommonConstant.InsuredByCompany) {
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy,
          InscoBranchCode: this.appInsObjObj.InscoBranchCode,
          InscoBranchName: this.appInsObjObj.InscoBranchName,
          InsAssetCoverPeriod: this.appInsObjObj.InsAssetCoverPeriod,
          InsAssetRegion: this.appInsObjObj.InsAssetRegion,
          InsLength: this.appInsObjObj.InsLength,
          Notes: this.appInsObjObj.Notes,
          TotalCustMainPremiAmt: this.appInsObjObj.TotalCustMainPremiAmt,
          TotalCustAddPremiAmt: this.appInsObjObj.TotalCustAddPremiAmt,
          TotalInscoMainPremiAmt: this.appInsObjObj.TotalInscoMainPremiAmt,
          TotalInscoAddPremiAmt: this.appInsObjObj.TotalInscoAddPremiAmt,
          InsCpltzAmt: this.appInsObjObj.InsCpltzAmt,
          InscoAdminFeeAmt: this.appInsObjObj.InscoAdminFeeAmt,
          InscoStampDutyFeeAmt: this.appInsObjObj.InscoStampDutyFee,
          CustAdminFeeAmt: this.appInsObjObj.CustAdminFeeAmt,
          CustStampDutyFeeAmt: this.appInsObjObj.CustStampDutyFee,
          CvgAmt: this.appInsObjObj.CvgAmt,
          TotalCustFeeAmt: this.appInsObjObj.CustAdminFeeAmt + this.appInsObjObj.CustStampDutyFee,
          TotalInscoFeeAmt: this.appInsObjObj.InscoAdminFeeAmt + this.appInsObjObj.InscoStampDutyFee,
          TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt,
          PayPeriodToInsco: this.appInsObjObj.PayPeriodToInsco
        });
        // this.setPaidByInput(this.appInsObjObj.InsAssetPaidBy);
        this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
        await this.GenerateInsurance(this.appInsMainCvgObj);
      }

      this.setValidator(insuredBy);

      if (this.InsuranceDataForm["controls"]["InsCpltzAmt"].value == this.InsuranceDataForm["controls"]["TotalCustMainPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustAddPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustFeeAmt"].value - this.InsuranceDataForm["controls"]["TotalCustDiscAmt"].value) {
        this.InsuranceDataForm["controls"]["InsCpltzAmt"].disable();
        this.InsuranceDataForm.patchValue({
          IsFullCapitalizedAmount: true
        });
      }
    }
  }

  async bindInsuredByObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsuredBy };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insuredByObj = response[CommonConstant.ReturnObj];
        // if(this.insuredByObj.length > 0){
        //   this.InsuranceDataForm.patchValue({
        //     InsAssetCoveredBy: this.insuredByObj[0].Key
        //   });
        //   this.setValidator(this.insuredByObj[0].Key);
        // }
      }
    );
  }

  async bindPaidByObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsPaidBy };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.paidByObj = response[CommonConstant.ReturnObj];
        // if(this.paidByObj.length > 0){
        //   this.InsuranceDataForm.patchValue({
        //     InsAssetPaidBy: this.paidByObj[0].Key
        //   });
        // }
      }
    );
  }

  async bindInsMainCvgTypeObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsMainCvgType };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insMainCvgTypeObj = response[CommonConstant.ReturnObj];
        this.InsuranceDataForm.patchValue({
          InsMainCvgType: this.insMainCvgTypeObj[0].Key
        });
      }
    );
  }

  async bindInsAddCvgTypeObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsAddCvgType };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAddCvgTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  addCheckbox() {
    this.insAddCvgTypeRuleObj.forEach((o) => {

      var checkboxValue;
      if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading)
        checkboxValue = true;
      else
        checkboxValue = false;

      const control = this.fb.group({
        Key: o.Value,
        Value: checkboxValue
      });
      (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray).push(control);
    });
  }

  async bindInsAssetCoverPeriodObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsCoverPeriod };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAssetCoverPeriodObj = response[CommonConstant.ReturnObj];
        if (this.insAssetCoverPeriodObj.length > 0) {
          let idxTemp = this.insAssetCoverPeriodObj.findIndex(x => x.Key == CommonConstant.CoverPeriodFullTenor);
          this.InsuranceDataForm.patchValue({
            InsAssetCoverPeriod: this.insAssetCoverPeriodObj[idxTemp].Key
          });

          this.setInsLengthDefaultValue(this.insAssetCoverPeriodObj[idxTemp].Key);
        }
      }
    );
  }

  async bindInsAssetRegionObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetInsRegion };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAssetRegionObj = response[CommonConstant.ReturnObj];
        // if(this.insAssetRegionObj.length > 0){
        //   this.InsuranceDataForm.patchValue({
        //     InsAssetRegion: this.insAssetRegionObj[0].Key
        //   });
        // }
      }
    );
  }

  async bindInscoBranchObj() {
    let ReqInscoBranchObj: ReqGetVendorByCategoryCodeAndOfficeCodeObj = new ReqGetVendorByCategoryCodeAndOfficeCodeObj();
    ReqInscoBranchObj.MrVendorCategory = CommonConstant.VendorCategoryAssetInscoBranch;
    ReqInscoBranchObj.OfficeCode = this.appObj.OriOfficeCode;
    await this.http.post(URLConstant.GetListKeyValueActiveVendorByCategoryCodeAndOfficeCode, ReqInscoBranchObj).toPromise().then(
      (response) => {
        this.inscoBranchObj = response[CommonConstant.ReturnObj];
        if (this.inscoBranchObj.length > 0 && this.inscoBranchObj.length == 1) {
          this.InsuranceDataForm.patchValue({
            InscoBranchCode: this.inscoBranchObj[0].Key,
            InscoBranchName: this.inscoBranchObj[0].Value
          });
        }
      }
    );
  }

  async bindPayPeriodToInscoObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodePayPeriodToInsco };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.payPeriodToInscoObj = response[CommonConstant.ReturnObj];
        if (this.payPeriodToInscoObj.length > 0) {
          this.InsuranceDataForm.patchValue({
            PayPeriodToInsco: this.payPeriodToInscoObj[0].Key
          });
        }
      }
    );
  }

  async bindCapitalizeGeneralSetting() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingByCode, { Code: CommonConstant.GsCptlzInsSetting }).toPromise().then(
      (response) => {
        this.isYearlyCapitalized = response && response.GsValue && response.GsValue == CommonConstant.InsGSCapitalizeYearly;
      }
    );
  }

  back() {
    this.outputTab.emit();
  }

  cekSeatCount() {
    this.isUsingSeatCount = false;
    this.InsuranceDataForm.controls.AppInsMainCvgs['controls'].forEach(appInsMainCvgs => {
      appInsMainCvgs.controls.AppInsAddCvgs.controls.forEach(appInsAddCvgs => {
        let addCvgType = appInsAddCvgs.controls.MrAddCvgTypeCode.value;
        let isChecked = appInsAddCvgs.controls.Value.value;
        if (this.AddCvgNeedSeatCount.includes(addCvgType) && isChecked) this.isUsingSeatCount = true;
      });
    });
  }

  SeatCountChange() {
    this.isCalculate = false;
  }

  IsFullCapitalizedAmount() {
    let tempForm = this.InsuranceDataForm as FormGroup;
    if (tempForm.get("IsFullCapitalizedAmount").value == true && !this.isYearlyCapitalized) {
      this.InsuranceDataForm.patchValue({
        InsCpltzAmt: tempForm.get("TotalCustMainPremiAmt").value + tempForm.get("TotalCustAddPremiAmt").value + tempForm.get("TotalCustFeeAmt").value - tempForm.get("TotalCustDiscAmt").value
      });
      tempForm.get("InsCpltzAmt").disable();
    } else {
      tempForm.get("InsCpltzAmt").enable();
    }
  }
  BindCapitalize() {
    let tempForm = this.InsuranceDataForm as FormGroup;
    if (tempForm.get("IsFullCapitalizedAmount").value == true && !this.isYearlyCapitalized) {
      this.InsuranceDataForm.patchValue({
        InsCpltzAmt: tempForm.get("TotalCustMainPremiAmt").value + tempForm.get("TotalCustAddPremiAmt").value + tempForm.get("TotalCustFeeAmt").value - tempForm.get("TotalCustDiscAmt").value
      });
    }
  }

  async ExecuteInstRateCvgRule(MainCoverageType: string) {
    let resInsuranceDataInsRateCvgRuleObj: ResInsuranceDataInsRateCvgRuleObj;

    let ReqObj = new InsuranceDataInsRateCvgRuleObj();
    ReqObj.InscoHoCode = this.InscoHoCode;
    ReqObj.InscoCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    ReqObj.RegionCode = this.InsuranceDataForm.controls.InsAssetRegion.value;
    ReqObj.MainCoverageType = MainCoverageType;
    ReqObj.InsAssetCategory = this.ruleObj.InsAssetCategory;
    ReqObj.AppId = this.appId;
    ReqObj.AppAssetId = this.appAssetId;
    ReqObj.AppCollateralId = this.appCollateralId;

    await this.http.post(URLConstant.ExecuteInsRateCvgRule, ReqObj).toPromise().then(
      async (response: ResInsuranceDataInsRateCvgRuleObj) => {
        resInsuranceDataInsRateCvgRuleObj = response;
        this.RuleRateCvgName = response.RuleSetName;
        if (response.InsRateAddCvgRuleTplObjs) response.InsRateAddCvgRuleObjs = response.InsRateAddCvgRuleObjs.concat(response.InsRateAddCvgRuleTplObjs);
      });
    return resInsuranceDataInsRateCvgRuleObj;
  }

  
  async PatchInsRateCvg(MainCvgIndex: number, MainCvg: any, AddCvg: Array<InsRateAddCvgRuleObj>) {
    this.groupAddCvrSumInsuredDropDown[MainCvgIndex] = new Object();
    AddCvg.forEach(currAddCvrItem => {
      if (currAddCvrItem.PremiumType == CommonConstant.PremiumTypeAmt) {
        if (typeof (this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType]) == 'undefined')
          this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType] = new Array<InsRateAddCvgRuleObj>();
        this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType].push(currAddCvrItem);
      }
    });

    var AppInsMainCvg = this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][MainCvgIndex]
    await this.GetManuDiffYear(MainCvgIndex);

    AppInsMainCvg.patchValue({
      CustMainPremiRate: MainCvg.MainRateToCust,
      InscoMainPremiRate: MainCvg.MainRateToInsco,
      CustMainPremiAmt: 0,
      TotalCustAddPremiAmt: 0
    });

    var AppInsAddCvgs = AppInsMainCvg.controls.AppInsAddCvgs.controls;
    this.insAddCvgTypeRuleObj.forEach((o) => {
      let AddCvgIndex = AddCvg.findIndex(x => x.AdditionalCoverageType == o.Key);
      let AppInsAddCvg = AppInsAddCvgs.find(x => x["controls"].MrAddCvgTypeCode.value == o.Key);

      if (AddCvgIndex != -1) {
        let defaultSumInsuredAmt = 0;
        let premiumType = AddCvg[AddCvgIndex].PremiumType;
        let custAddPremiRate = 0;
        let inscoAddPremiRate = 0;

        if (premiumType == CommonConstant.PremiumTypeAmt) {
          if (this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key]) {
            defaultSumInsuredAmt = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key][0].SumInsuredAmt;
            custAddPremiRate = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key][0].PremiToCust;
            inscoAddPremiRate = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key][0].PremiToInsco;
          } else {
            custAddPremiRate = AddCvg[AddCvgIndex].PremiToCust;
            inscoAddPremiRate = AddCvg[AddCvgIndex].PremiToInsco;
          }
        }

        if (premiumType == CommonConstant.PremiumTypePrcnt) {
          custAddPremiRate = AddCvg[AddCvgIndex].RateToCust;
          inscoAddPremiRate = AddCvg[AddCvgIndex].RateToInsco;
        }

        // if (o.Key == CommonConstant.MrAddCvgTypeCodeTpl) {
        //   defaultSumInsuredAmt = this.insRateAddCvgRuleTplObjs[0].SumInsuredAmt;
        //   custAddPremiRate = this.insRateAddCvgRuleTplObjs[0].PremiToCust;
        //   inscoAddPremiRate = this.insRateAddCvgRuleTplObjs[0].PremiToInsco;
        // }

        this.AddDictInsCustRate(o.Key, custAddPremiRate);
        if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
          let AddCvgFee = AddCvg.filter(x => x.AdditionalCoverageType == CommonConstant.MrAddCvgTypeCodeLoading);
          let LoadingObj = this.GetLoadingFeeRate(AddCvgFee);
          if (LoadingObj) {
            AppInsAddCvg.patchValue({
              Value: this.ManufYearDiff <= this.DefaultLoadingFeeYear ? false : true,
              SumInsuredAmt: LoadingObj.SumInsuredAmt,
              PremiumType: premiumType,
              CustAddPremiRate: premiumType == CommonConstant.PremiumTypePrcnt ? LoadingObj.RateToCust : LoadingObj.PremiToCust,
              CustAddPremiAmt: 0,
              BaseCalculation: LoadingObj.BaseCalc,
              InscoAddPremiRate: premiumType == CommonConstant.PremiumTypePrcnt ? LoadingObj.RateToInsco : LoadingObj.PremiToInsco,
              InscoAddPremiAmt: 0,
              SeatCount: 0
            });
          } else {
            AppInsAddCvg.patchValue({
              Value: this.ManufYearDiff <= this.DefaultLoadingFeeYear ? false : true,
              SumInsuredAmt: 0,
              PremiumType: this.DefaultPremiumType,
              CustAddPremiRate: null,
              CustAddPremiAmt: 0,
              BaseCalculation: "",
              InscoAddPremiRate: 0,
              InscoAddPremiAmt: 0,
              SeatCount: 0
            });
          }
        }
        else {
          AppInsAddCvg.patchValue({
            Value: false,
            SumInsuredAmt: AddCvg[AddCvgIndex].SumInsuredAmt,
            PremiumType: premiumType,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: 0,
            BaseCalculation: AddCvg[AddCvgIndex].BaseCalc,
            InscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiAmt: 0,
            SeatCount: 0
          });
        }
      } else {
        AppInsAddCvg.patchValue({
          Value: false,
          SumInsuredAmt: 0,
          PremiumType: this.DefaultPremiumType,
          CustAddPremiRate: null,
          CustAddPremiAmt: 0,
          BaseCalculation: "",
          InscoAddPremiRate: 0,
          InscoAddPremiAmt: 0,
          SeatCount: 0
        });
      }

    });
    this.InsuranceDataForm.updateValueAndValidity();

    for (var j = 0; j < AppInsAddCvgs.length; j++) {
      if (!AddCvg.find(x => x.AdditionalCoverageType == AppInsAddCvgs[j].controls.MrAddCvgTypeCode.value)) {
        this.ListRuleNotComplete.push({ index: MainCvgIndex, AddCvg: AppInsAddCvgs[j].controls.MrAddCvgTypeCode.value })
      } else if (AppInsAddCvgs[j].controls.CustAddPremiRate.value == null) {
        this.ListRuleNotComplete.push({ index: MainCvgIndex, AddCvg: AppInsAddCvgs[j].controls.MrAddCvgTypeCode.value })
      }
    }
  }

  async ResetFormForEdit(){
    this.isFromDB = false;

    let MainCvgs = this.InsuranceDataForm.controls.AppInsMainCvgs["controls"];
    for (let i = 0; i < MainCvgs.length; i++) {
      let MainCvg = this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][i].controls;
      let response: ResInsuranceDataInsRateCvgRuleObj;
      response = await this.ExecuteInstRateCvgRule(MainCvg.MrMainCvgTypeCode.value);
      await this.PatchInsRateCvg(i, response["InsRateMainCvgRuleObj"], response["InsRateAddCvgRuleObjs"]);
    }
  }

  GetLoadingFeeRate(AddCvg: Array<InsRateAddCvgRuleObj>) {
    for (var i = 0; i < AddCvg.length; i++) {
      let assetAgeMin = AddCvg[i].AssetAgeFrom ? AddCvg[i].AssetAgeFrom : 0;
      let assetAgeMax = AddCvg[i].AssetAgeTo ? AddCvg[i].AssetAgeTo : 0;
      if (this.ManufYearDiff >= assetAgeMin && this.ManufYearDiff <= assetAgeMax) {
        return AddCvg[i];
      }
    };
    return null;
  }

  async GetManuDiffYear(index: number) {
    this.LoadingFeeCountType = await this.GetLoadingFeeCountType();
    switch (this.LoadingFeeCountType) {
      case CommonConstant.LoadingFeeCountType_CountingYear:
        this.CountTypeCountingYear(index);
        break;
      case CommonConstant.LoadingFeeCountType_FirstYear:
        this.CountTypeFirstYear();
        break;
      case CommonConstant.LoadingFeeCountType_LastYear:
        this.CountTypeLastYear();
        break;
    }
  }

  GetGeneralSettingDefaultLoadingFeeYear() {
    this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingByCode, { Code: CommonConstant.GSCodeDefaultLoadingFeeYear }).subscribe(
      (response) => {
        this.DefaultLoadingFeeYear = parseInt(response.GsValue);
      }
    );
  }

  async getRoundedAmt(){
    const prodObj = {
      ProdOfferingCode: this.appObj.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.REF_PROD_COMPNT_CODE_CURR,
      ProdOfferingVersion: this.appObj.ProdOfferingVersion
    }

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, prodObj).toPromise().then(
      async (response: any) => {
        await this.http.post(URLConstant.GetRefCurrByCode, {Code : response.CompntValue}).toPromise().then(
          (response: any) => {
            this.RoundedAmt = response.RoundedAmt;
          });
      });
  }
}