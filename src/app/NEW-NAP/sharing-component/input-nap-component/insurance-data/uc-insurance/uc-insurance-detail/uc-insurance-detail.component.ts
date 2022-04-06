import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { AppInsAddCvgObj } from 'app/shared/model/app-ins-add-cvg-obj.model';
import { AppInsMainCvgObj } from 'app/shared/model/app-ins-main-cvg-obj.model';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { AppInsuranceObj } from 'app/shared/model/app-insurance-obj.model';
import { CalcInsAddCvgObj } from 'app/shared/model/calc-ins-add-cvg-obj.model';
import { CalcInsMainCvgObj } from 'app/shared/model/calc-ins-main-cvg-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { InsRateAddCvgRuleObj } from 'app/shared/model/ins-rate-add-cvg-rule-obj.model';
import { InsuranceDataInsRateCvgRuleObj } from 'app/shared/model/insurance-data-ins-rate-cvg-rule-obj.model';
import { InsuranceDataInsRateRuleObj } from 'app/shared/model/insurance-data-ins-rate-rule-obj.model';
import { InsuranceDataObj } from 'app/shared/model/insurance-data-obj.model';
import { InsuranceLenObj, ResInsuranceLenObj } from 'app/shared/model/insurance-len-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { RequestCalcInsV2Obj } from 'app/shared/model/request-calc-ins-obj.model';
import { ReqGetVendorByCategoryCodeAndOfficeCodeObj } from 'app/shared/model/request/vendor/req-vendor.model';
import { AdditionalCoverageObj, InsRateCoverageObj, ResExecRuleInsRateCvgV2_1obj } from 'app/shared/model/Response/app-insurance/res-insurance-data-ins-rate-cvg-rule-obj.model';
import { ResultCalcInsObj } from 'app/shared/model/result-calc-ins-obj.model';
import { ResultInsRateRuleObj } from 'app/shared/model/result-ins-rate-rule-obj.model';
import { ResultSubsidySchmRuleObj } from 'app/shared/model/subsidy-schm/result-subsidy-schm-rule-obj.model';
import { CookieService } from 'ngx-cookie';
import { String } from 'typescript-string-operations';
import { formatDate } from '@angular/common';
import { AppCollateralAccessoryObj } from 'app/shared/model/app-collateral-accessory-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResponseAppCollateralAttrObj } from 'app/shared/model/app-collateral-attr/res-app-collateral-attr-obj.model';

@Component({
  selector: 'app-uc-insurance-detail',
  templateUrl: './uc-insurance-detail.component.html',
  styleUrls: ['./uc-insurance-detail.component.css']
})
export class UcInsuranceDetailComponent implements OnInit {
  @Input() appObj: NapAppModel;
  @Input() appAssetId: number;
  @Input() appCollateralId: number;
  @Input() bizTemplateCode: string;
  @Input() isMultiAsset: boolean = false;
  @Input() insSeqNo: number = 1;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  
  insLenCust: number = 0;
  manufYearDiff: number = 0;
  minInsLength: number = 1;
  maxInsLength: number = 9999;
  totalAssetPriceAmt: number = 0;
  defaultLoadingFeeYear: number = 0;
  totalAssetInclAccessoryPriceAmt: number = 0;

  isFromDB: boolean = false;
  isGenerate: boolean = false;
  isOffTheRoadOrHE: boolean = false;
  isCalculate: boolean = false;
  isApplyToAll: boolean = false;
  showGenerate: boolean = false;
  adminFeeLock: boolean = false;
  isAllPaidByCust: boolean = true;
  stampdutyFeeLock: boolean = false;
  isUsingSeatCount: boolean = false;
  isYearlyCapitalized: boolean = false;

  assetType: string = "";
  inscoHoCode: string = "";
  ruleRateCvgName: string = "";
  loadingFeeCountType: string = "";
  defaultInsAssetRegion: string = "";
  pageState: string = "AddInsurance";
  readonly editInsurance: string = "EditInsurance";
  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  readonly defInsPaidBy: string = CommonConstant.InsPaidByCustomer;
  readonly defaultPremiumType: string = CommonConstant.PremiumTypeAmt;

  appAssetObj: AppAssetObj;
  saveObj: InsuranceDataObj;
  appInsObjObj: AppInsObjObj;
  appInsuranceObj: AppInsuranceObj;
  appCollateralObj: AppCollateralObj;
  DictInsCustRate: { [id: string]: number } = {};
  groupAddCvrSumInsuredDropDown: Object = new Object();
  calcInsObj: ResultCalcInsObj = new ResultCalcInsObj();
  ruleObj: ResultInsRateRuleObj = new ResultInsRateRuleObj();
  subsidyRuleObj: ResultSubsidySchmRuleObj = new ResultSubsidySchmRuleObj();

  listYear: Array<number> = new Array();
  groupedAddCvgType: Array<string> = new Array<string>();
  paidByObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  insuredByObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  appCollateralAccessoryObjs: Array<AppCollateralAccessoryObj>;
  inscoBranchObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  insAddCvgTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  insMainCvgTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  insAssetRegionObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  payPeriodToInscoObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  insAddCvgTypeRuleObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  insAssetCoverPeriodObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  addCvgNeedSeatCount: Array<string> = [CommonConstant.MrAddCvgTypeCodePap];
  appInsMainCvgObj: Array<AppInsMainCvgObj> = new Array<AppInsMainCvgObj>();
  listRuleNotComplete: Array<{ index: number, AddCvg: string }> = new Array();
  paidByBhv: Array<{ PaidByYearNo: number, PaidBy: string, PaidByBhv: string }>;

  businessDt: Date = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));

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
    IsFullCapitalizedAmount: [false],
    DiscountToInsco: [0]
  });

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private cookieService: CookieService, 
              private toastr: NGXToastrService) {
  }

  async ngOnInit() {
    await this.loadGeneralSetting();
    await this.loadDDL();
    await this.getInsuranceData();
  }

  async loadDDL() {
    this.insuredByObj = await this.bindDDL(CommonConstant.RefMasterTypeCodeInsuredBy);
    this.paidByObj = await this.bindDDL(CommonConstant.RefMasterTypeCodeInsPaidBy);
    if(this.bizTemplateCode == CommonConstant.FCTR){
      let PaidByCustIdx = this.paidByObj.findIndex(x => x.Key == CommonConstant.InsPaidByCustomer)
      this.paidByObj = this.paidByObj.slice(PaidByCustIdx, 1);
    }
    await this.bindInscoBranchObj();
    this.payPeriodToInscoObj = await this.bindDDL(CommonConstant.RefMasterTypeCodePayPeriodToInsco);
    if (this.payPeriodToInscoObj.length > 0) {
      this.InsuranceDataForm.patchValue({
        PayPeriodToInsco: this.payPeriodToInscoObj[0].Key
      });
    }
    this.insAssetRegionObj = await this.bindDDL(CommonConstant.RefMasterTypeCodeAssetInsRegion);
    this.insAssetCoverPeriodObj = await this.bindDDL(CommonConstant.RefMasterTypeCodeInsCoverPeriod);
    if (this.insAssetCoverPeriodObj.length > 0) {
      let idxTemp = this.insAssetCoverPeriodObj.findIndex(x => x.Key == CommonConstant.CoverPeriodFullTenor);
      this.InsuranceDataForm.patchValue({
        InsAssetCoverPeriod: this.insAssetCoverPeriodObj[idxTemp].Key
      });

      this.setInsLengthDefaultValue(this.insAssetCoverPeriodObj[idxTemp].Key);
    }
    this.insAddCvgTypeObj = await this.bindDDL(CommonConstant.RefMasterTypeCodeInsAddCvgType);
  }

  async bindDDL(RefMasterTypeCode: string) {
    let returnValue;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: RefMasterTypeCode }).toPromise().then(
      (response) => {
        returnValue = response[CommonConstant.ReturnObj];
      });
    return returnValue;
  }

  async bindInscoBranchObj() {
    let ReqInscoBranchObj: ReqGetVendorByCategoryCodeAndOfficeCodeObj = new ReqGetVendorByCategoryCodeAndOfficeCodeObj();
    ReqInscoBranchObj.MrVendorCategory = CommonConstant.VendorCategoryAssetInscoBranch;
    ReqInscoBranchObj.OfficeCode = this.appObj.OriOfficeCode;
    await this.http.post(URLConstant.GetListKeyValueActiveVendorByCategoryCodeAndOfficeCode, ReqInscoBranchObj).toPromise().then(
      async (response) => {
        this.inscoBranchObj = response[CommonConstant.ReturnObj];
        if (this.inscoBranchObj.length > 0) {
          this.InsuranceDataForm.patchValue({
            InscoBranchCode: this.inscoBranchObj[0].Key,
            InscoBranchName: this.inscoBranchObj[0].Value
          });
        }
        await this.getVendorParent(this.InsuranceDataForm.controls.InscoBranchCode.value);
      }
    );
  }

  async setInsLengthDefaultValue(coverPeriod: string) {
    let InsAssetCoveredBy = this.InsuranceDataForm.controls.InsAssetCoveredBy.value;

    if (InsAssetCoveredBy == CommonConstant.InsuredByCustomerCompany) {
      await this.getCuCoInsLength();
      return;
    }

    let InsLength = 0;
    switch (coverPeriod) {
      case CommonConstant.CoverPeriodAnnually:
        InsLength = 12;
        break;
      case CommonConstant.CoverPeriodFullTenor:
        InsLength = this.appObj.Tenor;
        if (InsAssetCoveredBy == CommonConstant.InsuredByCustomerCompany) {
          InsLength = this.setTenorCustCompany(InsLength);
        }
        break;
      case CommonConstant.CoverPeriodPartialTenor:
        InsLength = 1
        break;
      case CommonConstant.CoverPeriodOverTenor:
        InsLength = this.appObj.Tenor + 1
        break;
    }

    this.InsuranceDataForm.patchValue({
      InsLength: InsLength
    })

    this.setInsLengthValidator(coverPeriod);
  }

  checkInsuranceLenObj(tempReq: InsuranceLenObj): boolean {
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

  setTenorCustCompany(tenor: number) {
    let endDt: Date = new Date(this.setDateWithoutTimezone(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW)));
    endDt.setMonth(endDt.getMonth() + tenor);

    //Calculate the differences between the start and end dates
    let yearsDifference: number = endDt.getFullYear() - this.businessDt.getFullYear();
    let monthsDifference: number = endDt.getMonth() - this.businessDt.getMonth();
    let daysDifference: number = endDt.getDate() - this.businessDt.getDate();

    let monthCorrection = 0;
    if (daysDifference > 0) monthCorrection = 1;

    return (yearsDifference * 12 + monthsDifference + monthCorrection);
  }

  setDateWithoutTimezone(inputDate) {
    let date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);
    let userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
  }

  setInsLengthValidator(coverPeriod: string) {
    switch (coverPeriod) {
      case CommonConstant.CoverPeriodAnnually:
        this.minInsLength = 1;
        this.maxInsLength = 9999;
        this.InsuranceDataForm.controls.InsLength.disable();
        this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
        break;
      case CommonConstant.CoverPeriodFullTenor:
        this.minInsLength = 1;
        this.maxInsLength = 9999;
        this.InsuranceDataForm.controls.InsLength.disable();
        this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
        break;
      case CommonConstant.CoverPeriodPartialTenor:
        var tenor = this.appObj.Tenor;
        if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
          tenor = this.setTenorCustCompany(tenor);
        }
        this.minInsLength = 1;
        this.maxInsLength = tenor - 1;
        this.InsuranceDataForm.controls.InsLength.enable();
        this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength), Validators.max(this.maxInsLength)]);
        this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
        break;
      case CommonConstant.CoverPeriodOverTenor:
        var tenor = this.appObj.Tenor;
        if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
          tenor = this.setTenorCustCompany(tenor);
        }
        this.minInsLength = tenor + 1;
        this.maxInsLength = 9999;
        this.InsuranceDataForm.controls.InsLength.enable();
        this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength), Validators.max(this.maxInsLength)]);
        this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
        break;
    }
  }

  setInsLengthTenorCustCompany(tenor) {
    let months;
    let endDt: Date = new Date(this.setDateWithoutTimezone(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW)));
    endDt.setMonth(endDt.getMonth() + tenor);

    //Calculate the differences between the start and end dates
    let yearsDifference: number = endDt.getFullYear() - this.businessDt.getFullYear();
    let monthsDifference: number = endDt.getMonth() - this.businessDt.getMonth();
    let daysDifference: number = endDt.getDate() - this.businessDt.getDate();

    let monthCorrection = 0;
    if (daysDifference > 0) {
      monthCorrection = 1;
    }

    months = (yearsDifference * 12 + monthsDifference + monthCorrection);
    return months;
  }
  
  insuredByChanged(event: any) {
    this.setInsLength();
    this.setValidator(event.target.value);
  }

  setInsLength() {
    if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
      this.getCuCoInsLength();
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

  setValidator(insuredBy: string) {
    switch (insuredBy) {
      case CommonConstant.InsuredByOffSystem:
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
        break;
      case CommonConstant.InsuredByCustomer:
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
        break;
      case CommonConstant.InsuredByCompany:
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
        break;
      case CommonConstant.InsuredByCustomerCompany: this.InsuranceDataForm.controls.InsAssetCoverPeriod.setValidators([Validators.required, Validators.maxLength(50)]);
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
        break;
    }
  }

  async loadGeneralSetting() {
    let generalSetting : GeneralSettingObj = new GeneralSettingObj();
    generalSetting = await this.getGeneralSetting(CommonConstant.GSCodeDefaultLoadingFeeYear);
    this.defaultLoadingFeeYear = parseInt(generalSetting.GsValue);

    generalSetting = new GeneralSettingObj();
    generalSetting = await this.getGeneralSetting(CommonConstant.GsCptlzInsSetting);
    this.isYearlyCapitalized = generalSetting && generalSetting.GsValue && generalSetting.GsValue == CommonConstant.InsGSCapitalizeYearly;
  }

  async getInsuranceData() {
    let reqObj = {};
    let url = "";
    
    if(this.isMultiAsset){
      reqObj = { AppId: this.appObj.AppId, AppAssetId: this.appAssetId, AppCollateralId: this.appCollateralId }
      url = URLConstant.GetInsDataByAppAssetId;
    }else{
      reqObj = { Id: this.appObj.AppId }
      url = URLConstant.GetInsuranceDataByAppId;
    }
    await this.http.post(url, reqObj).toPromise().then(
      async (response) => {
        this.appObj = response["AppObj"];
        this.appAssetObj = response["AppAssetObj"];
        this.appInsObjObj = response["AppInsObjObj"];
        this.appInsuranceObj = response["AppInsuranceObj"];
        this.appCollateralObj = response["AppCollateralObj"];
        this.appInsMainCvgObj = response["AppInsMainCvgObjs"];
        this.appCollateralAccessoryObjs = response["AppCollateralAccessoryObjs"];
        this.defaultInsAssetRegion = response["DefaultInsAssetRegion"] == null ? "" : response["DefaultInsAssetRegion"];

        this.totalAssetPriceAmt = this.appCollateralObj.CollateralValueAmt
        this.totalAssetInclAccessoryPriceAmt = this.totalAssetPriceAmt + this.appCollateralObj.TotalAccessoryPriceAmt;

        this.InsuranceDataForm.patchValue({
          CvgAmt: this.totalAssetInclAccessoryPriceAmt,
          CustCvgAmt: this.totalAssetInclAccessoryPriceAmt
        });

        if (this.appAssetObj != undefined) {
          this.appAssetId = this.appAssetObj.AppAssetId;
          this.assetType = this.appAssetObj.AssetTypeCode;
        }

        if (this.appCollateralObj != undefined) {
          this.appCollateralId = this.appCollateralObj.AppCollateralId;
          this.assetType = this.appCollateralObj.AssetTypeCode;
        }

        let genericObj = new GenericObj();
        genericObj.Id = this.appCollateralObj.AppCollateralId;
        genericObj.Code = CommonConstant.AttrCodeRoadWorthinessDoc;
        await this.http.post(URLConstant.GetAppCollAttrContentByIdAndCode, genericObj).toPromise().then(
          async (appCollAttr : ResponseAppCollateralAttrObj) => {
            if(appCollAttr.AttrValue != null){
              if(appCollAttr.AttrValue == CommonConstant.AttrValueOffTheRoad) this.isOffTheRoadOrHE = true;
            }else{
              let generalSetting : GeneralSettingObj = await this.getGeneralSetting(CommonConstant.GsCodeAssetTypeForHeavyEquipment);
              let listHECode = generalSetting.GsValue.split(";");
              let foundHECode = listHECode.find(x => x == this.assetType);
              if(foundHECode != undefined || foundHECode != null) this.isOffTheRoadOrHE = true;
            }
          }
        )

        if (this.appInsObjObj != undefined && this.appInsObjObj != null) {
          if (this.appInsObjObj.InsAssetCoveredBy == CommonConstant.InsuredByCompany || this.appInsObjObj.InsAssetCoveredBy == CommonConstant.InsuredByCustomerCompany) {
            await this.getVendorParent(this.appInsObjObj.InscoBranchCode);
          }
          await this.bindAppInsAndAppInsObj(this.appInsObjObj.InsAssetCoveredBy);
        }else {
          this.InsuranceDataForm.patchValue({
            InsAssetRegion: this.defaultInsAssetRegion
          });
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
        this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
        await this.generateInsurance(this.appInsMainCvgObj);
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
        this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
        await this.generateInsurance(this.appInsMainCvgObj);
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

  endDt_FocusOut() {
    if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
      this.getCuCoInsLength();
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodFullTenor) {
        let tenor = this.appObj.Tenor;
        tenor = this.setInsLengthTenorCustCompany(tenor);
        this.InsuranceDataForm.patchValue({
          InsLength: tenor
        });
      }
      if (this.InsuranceDataForm.controls.InsAssetCoverPeriod.value == CommonConstant.CoverPeriodPartialTenor) {
        this.setInsLengthValidator(CommonConstant.CoverPeriodPartialTenor);
      }
    }
    this.setInsLength();
  }

  async getCuCoInsLength() {
    let tempForm = this.InsuranceDataForm as FormGroup;
    let tempReq: InsuranceLenObj = new InsuranceLenObj();
    tempReq.CustEndDt = tempForm.get("EndDt").value;
    tempReq.Tenor = this.appObj.Tenor;
    tempReq.VendorCode = tempForm.get("InscoBranchCode").value;
    tempReq.MrCoverPeriod = tempForm.get("InsAssetCoverPeriod").value;

    if (this.checkInsuranceLenObj(tempReq)) return;
    await this.http.post(URLConstant.GetCuCoInsLength, tempReq).toPromise().then(
      async (response: ResInsuranceLenObj) => {
        let InsuranceLen = response.InsuranceLen;

        let tempInsLength = tempForm.get("InsLength");
        let tempPartialMinus = 0;
        if (tempReq.MrCoverPeriod != CommonConstant.CoverPeriodOverTenor) {
          this.minInsLength = 1;
          this.maxInsLength = 9999;
          tempInsLength.enable();
          if (tempReq.MrCoverPeriod == CommonConstant.CoverPeriodFullTenor || tempReq.MrCoverPeriod == CommonConstant.CoverPeriodAnnually) {
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

  async generateInsurance(appInsMainCvgObj: Array<AppInsMainCvgObj>){
    this.listRuleNotComplete = new Array();
    if(this.pageState == this.editInsurance) this.isFromDB = false;

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
    }

    if (this.InsuranceDataForm.controls.CvgAmt.value == 0) {
      this.toastr.warningMessage(ExceptionConstant.COVERAGE_CANT_0_LESS);
      return;
    }

    let reqObj = new InsuranceDataInsRateRuleObj();
    reqObj.InscoHoCode = this.inscoHoCode;
    reqObj.InscoCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    reqObj.RegionCode = this.InsuranceDataForm.controls.InsAssetRegion.value;
    reqObj.AppId = this.appObj.AppId;
    reqObj.AppAssetId = this.appAssetId;
    reqObj.AppCollateralId = this.appCollateralId;

    await this.http.post(URLConstant.ExecuteInsRateRuleV2, reqObj).toPromise().then(
      async (response) => {
        this.ruleObj = response["Result"];
        if (this.ruleObj.InsAssetCategory == "") {
          this.toastr.warningMessage(ExceptionConstant.INS_ASSET_CATEGORY_NOT_FOUND);
          return;
        }

        this.isUsingSeatCount = false;
        let InsRateAddCvgRuleObjs = response['InsRateAddCvgRuleObjs'];
        if (response["InsRateAddCvgRuleTplObjs"]) InsRateAddCvgRuleObjs = InsRateAddCvgRuleObjs.concat(response["InsRateAddCvgRuleTplObjs"]);

        this.insMainCvgTypeObj = await this.bindDDL(CommonConstant.RefMasterTypeCodeInsMainCvgType);
        this.InsuranceDataForm.patchValue({
          InsMainCvgType: this.insMainCvgTypeObj[0].Key
        });
        
        await this.bindInsAddCvgTypeRuleObj();
        await this.bindInsPaidByRuleObj();

        if (appInsMainCvgObj == undefined) {
          this.InsuranceDataForm.patchValue({
            CustAdminFeeAmt: this.ruleObj.AdminFeeToCust,
            InscoAdminFeeAmt: this.ruleObj.AdminFeeFromInsco,
            CustStampDutyFeeAmt: this.ruleObj.CustStampdutyFeeToCust,
            InscoStampDutyFeeAmt: this.ruleObj.InscoStampdutyFeeToCust,
            TotalInscoFeeAmt: this.ruleObj.AdminFeeFromInsco + this.ruleObj.InscoStampdutyFeeToCust,
            DiscountToInsco : 0
          });
          await this.generateMainAndAddCvgTable();
        } else {
          this.pageState = this.editInsurance;
          this.isFromDB = true;
          await this.generateMainAndAddCvgTableFromDB(appInsMainCvgObj);
        }
        this.isGenerate = true;
        this.bindInsFeeBehaviorRuleObj();
        this.showGenerate = true;
        this.checkPaidBy();
      }
    );
    this.bindCapitalize();
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
  
  addCheckbox() {
    this.insAddCvgTypeRuleObj.forEach((o) => {
      let checkboxValue = false;
      if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) checkboxValue = true;        

      const control = this.fb.group({
        Key: o.Value,
        Value: checkboxValue
      });

      (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray).push(control);
    });
  }

  async generateMainAndAddCvgTable() {
    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);
    await this.generateAddCvgForm();
  }
  
  generateAddCvgForm() {
    this.listYear = new Array();
    let yearCount = this.InsuranceDataForm.controls.InsLength.value;
    let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
    let month: number = 12;
    for (let i = 0; i < noOfYear; i++) {
      this.groupAddCvrSumInsuredDropDown[i] = new Object();
      let obj = { Tenor: 0, SumInsuredPrcnt: 0, CustMainPremiRate: 0, InscoMainPremiRate: 0 };

      month = yearCount
      if (yearCount - 12 >= 0) month = 12;

      obj.Tenor = month;
      obj.SumInsuredPrcnt = this.ruleObj.SumInsuredPercentage[i];
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroup(i, obj));
      yearCount -= 12;
      this.listYear.push(i+1);
    }

    
  }

  async generateMainAndAddCvgTableFromDB(appInsMainCvgObj: Array<AppInsMainCvgObj>) {
    this.listRuleNotComplete = new Array();
    this.manufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    let loadingFeeCountType: string = await this.getLoadingFeeCountType();
    if (loadingFeeCountType == CommonConstant.LoadingFeeCountType_LastYear) {
      let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
      this.manufYearDiff += (noOfYear - 1);
    }
    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);
    for (let i = 0; i < appInsMainCvgObj.length; i++) {
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(await this.addGroupFromDB(i, appInsMainCvgObj[i], this.manufYearDiff));
      if (loadingFeeCountType == CommonConstant.LoadingFeeCountType_CountingYear) this.manufYearDiff++;
    }
    
    await this.calcDiscount();
  }
  
  async getLoadingFeeCountType(){
    let generalSetting : GeneralSettingObj = await this.getGeneralSetting(CommonConstant.GSCodeLoadingFeeCountType);
    return generalSetting.GsValue ? generalSetting.GsValue : CommonConstant.LoadingFeeCountType_CountingYear;
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

  checkPaidBy() {
    this.isAllPaidByCust = true;
    let tempListAppInsMainCvgs = this.InsuranceDataForm.get("AppInsMainCvgs") as FormArray;
    let totalDiscAmt: number = 0;
    for (let index = 0; index < tempListAppInsMainCvgs.length; index++) {
      const element = tempListAppInsMainCvgs.get(index.toString()) as FormGroup;
      if (element.get("MrInsPaidByCode").value == CommonConstant.InsPaidByAtCost) {
        totalDiscAmt += (element.get("CustMainPremiAmt").value + element.get("TotalCustAddPremiAmt").value);
        this.isAllPaidByCust = false;
      }
    }
    this.InsuranceDataForm.get("TotalCustDiscAmt").patchValue(totalDiscAmt);
  }

  bindCapitalize() {
    let tempForm = this.InsuranceDataForm as FormGroup;
    if (tempForm.get("IsFullCapitalizedAmount").value == true && !this.isYearlyCapitalized) {
      this.InsuranceDataForm.patchValue({
        InsCpltzAmt: tempForm.get("TotalCustMainPremiAmt").value + tempForm.get("TotalCustAddPremiAmt").value + tempForm.get("TotalCustFeeAmt").value - tempForm.get("TotalCustDiscAmt").value
      });
    }
  }

  custAdminFeeAmtChanged(){
    this.isCalculate = false;
  }

  addGroup(i, obj) {
    let currYear = i + 1
    let currPaidByBhv = this.paidByBhv.find(i => i.PaidByYearNo == currYear);

    let group = this.fb.group({
      MrInsPaidByCode: this.defInsPaidBy, //currPaidByBhv != undefined ? currPaidByBhv.PaidBy : this.defInsPaidBy
      isPaidByLock: false, //(currPaidByBhv && currPaidByBhv.PaidByBhv == CommonConstant.InsPaidByBhvLock),
      IsCapitalized: false,
      YearNo: currYear,
      Tenor: obj.Tenor,
      SumInsuredPrcnt: [obj.SumInsuredPrcnt, [Validators.required, Validators.min(0), Validators.max(100)]],
      SumInsuredAmt: 0,
      MrMainCvgTypeCode: ['', Validators.required],
      BaseCustMainPremiRate: 0,
      CustMainPremiRate: 0,
      CustMainPremiAmt: 0,
      BaseInscoMainPremiRate: obj.InscoMainPremiRate,
      InscoMainPremiRate: obj.InscoMainPremiRate,
      InscoMainPremiAmt: 0,
      TotalInscoAddPremiAmt: 0,
      TotalCustAddPremiAmt: 0,
      AppInsAddCvgs: new FormArray([])
    });

    this.insAddCvgTypeRuleObj.forEach((o) => {
      this.addDictInsCustRate(o.Key, 0);

      const control = this.fb.group({
        MrAddCvgTypeCode: o.Key,
        AddCvgTypeName: o.Value,
        Value: false,
        SumInsuredPercentage: obj.SumInsuredPercentage,
        SumInsuredAmt: 0,
        PremiumType: this.defaultPremiumType,
        BaseCustAddPremiRate: 0,
        CustAddPremiRate: 0,
        CustAddPremiAmt: 0,
        BaseCalculation: "",
        BaseInscoAddPremiRate: 0,
        InscoAddPremiRate: 0,
        InscoAddPremiAmt: 0,
        SeatCount: 0,
      });
      (group.controls.AppInsAddCvgs as FormArray).push(control);
    });
    return group;
  }

  addDictInsCustRate(MrAddCvgTypeCode: string, rate: number) {
    if (this.DictInsCustRate[MrAddCvgTypeCode] == null || this.DictInsCustRate[MrAddCvgTypeCode] == undefined || this.DictInsCustRate[MrAddCvgTypeCode] == 0) this.DictInsCustRate[MrAddCvgTypeCode] = rate;
  }

  async addGroupFromDB(MainCvgIndex: number, insMainCvg: AppInsMainCvgObj, ManufYearDiff) {
    let response: ResExecRuleInsRateCvgV2_1obj;
    response = await this.executeInstRateCvgRule(insMainCvg.MrMainCvgTypeCode, MainCvgIndex);
    let AddCvg = response.ReturnObject[0].AdditionalCoverage;
    
    this.groupAddCvrSumInsuredDropDown[MainCvgIndex] = new Object();
    AddCvg.forEach(currAddCvrItem => {
      if (currAddCvrItem.PremiumType == CommonConstant.PremiumTypeAmt) {
        if (typeof (this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType]) == 'undefined')
          this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType] = new Array<InsRateAddCvgRuleObj>();
        this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType].push(currAddCvrItem);
      }
    });
    
    let BaseCustMainPremiRate = response.ReturnObject[0].MainRateToCust;
    let BaseInscoMainPremiRate = response.ReturnObject[0].MainRateToInsco;
    
    if(this.isOffTheRoadOrHE && MainCvgIndex != 0){
      BaseCustMainPremiRate = insMainCvg.CustMainPremiRate;
      BaseInscoMainPremiRate = insMainCvg.InscoMainPremiRate;
    }

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
      BaseCustMainPremiRate: BaseCustMainPremiRate,
      CustMainPremiRate: insMainCvg.CustMainPremiRate,
      CustMainPremiAmt: insMainCvg.CustMainPremiAmt,
      BaseInscoMainPremiRate: BaseInscoMainPremiRate,
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

      let defaultSumInsuredAmt = null;
      let AddCvgIndex = AddCvg.findIndex(x => x.AdditionalCoverageType == o.Key);
      let premiumType = check != undefined ? check.PremiumType : AddCvgIndex != -1 ? AddCvg[AddCvgIndex].PremiumType : null;
      let custAddPremiRate = null;
      let inscoAddPremiRate = null;
  
      if (AddCvgIndex == -1) {
        this.addDictInsCustRate(o.Key, null);

        if (check != undefined && premiumType == CommonConstant.PremiumTypePrcnt) {
          custAddPremiRate = check.CustAddPremiRate;
          inscoAddPremiRate = check.InscoAddPremiRate;
        }
      } else {
        if (premiumType) {
          if (premiumType == CommonConstant.PremiumTypeAmt) {
            this.addDictInsCustRate(o.Key, AddCvg[AddCvgIndex].PremiToCust);
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
            this.addDictInsCustRate(o.Key, AddCvg[AddCvgIndex].RateToCust);
            custAddPremiRate = check == undefined ? AddCvg[AddCvgIndex].RateToCust : check.CustAddPremiRate;
            inscoAddPremiRate = check == undefined ? AddCvg[AddCvgIndex].RateToInsco : check.InscoAddPremiRate;
          }
        }
      }

      let BaseCustAddPremiRate = 0;
      let BaseInscoAddPremiRate = 0;

      if (check) {
        if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
          let control = this.fb.group({
            MrAddCvgTypeCode: o.Key,
            AddCvgTypeName: o.Value,
            Value: true,
            SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
            SumInsuredAmt: check.SumInsuredAmt,
            PremiumType: check.PremiumType,
            BaseCustAddPremiRate: custAddPremiRate,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: check.CustAddPremiAmt,
            BaseCalculation: check.BaseCalc,
            BaseInscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiAmt: check.InscoAddPremiAmt,
            SeatCount: 0,
          });

          let AddCvgFee = AddCvg.filter(x => x.AdditionalCoverageType == CommonConstant.MrAddCvgTypeCodeLoading);
          let LoadingObj = this.getLoadingFeeRate(AddCvgFee);

          BaseCustAddPremiRate = LoadingObj.RateToCust;
          BaseInscoAddPremiRate = LoadingObj.RateToInsco;

          if(this.isOffTheRoadOrHE){
            BaseCustAddPremiRate = check.CustAddPremiRate;
            BaseInscoAddPremiRate = check.InscoAddPremiRate;
          }

          control = this.fb.group({
            MrAddCvgTypeCode: o.Key,
            AddCvgTypeName: o.Value,
            Value: true,
            SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
            SumInsuredAmt: check.SumInsuredAmt,
            PremiumType: check.PremiumType,
            BaseCustAddPremiRate: BaseCustAddPremiRate,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: check.CustAddPremiAmt,
            BaseCalculation: check.BaseCalc,
            BaseInscoAddPremiRate: BaseInscoAddPremiRate,
            InscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiAmt: check.InscoAddPremiAmt,
            SeatCount: 0,
          });
          (group.controls.AppInsAddCvgs as FormArray).push(control);
        }
        else {
          // cek Seat Count
          let seatCount = 0;
          if (this.addCvgNeedSeatCount.includes(o.Key)) {
            if (!this.isUsingSeatCount) this.isUsingSeatCount = true;
            if (check && this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key]) {
              let DdlAddCvgSumInsured = this.groupAddCvrSumInsuredDropDown[MainCvgIndex][o.Key].find(x => x.SumInsuredAmt == check.SumInsuredAmt);
              if (DdlAddCvgSumInsured) {
                seatCount = check.CustAddPremiAmt / DdlAddCvgSumInsured.PremiToCust;
                custAddPremiRate = DdlAddCvgSumInsured.PremiToCust;
                inscoAddPremiRate = DdlAddCvgSumInsured.PremiToInsco;
                BaseCustAddPremiRate = check.CustAddPremiAmt;
                BaseInscoAddPremiRate = check.InscoAddPremiAmt;
              }
            }
          }
          
          if(this.isOffTheRoadOrHE){
            BaseCustAddPremiRate = check.PremiumType == CommonConstant.PremiumTypePrcnt ? check.CustAddPremiRate : check.CustAddPremiAmt;
            BaseInscoAddPremiRate = check.PremiumType == CommonConstant.PremiumTypePrcnt ? check.InscoAddPremiRate : check.InscoAddPremiAmt;
          }else{
            BaseCustAddPremiRate = premiumType == CommonConstant.PremiumTypePrcnt && AddCvgIndex != -1? AddCvg[AddCvgIndex].RateToCust : custAddPremiRate;
            BaseInscoAddPremiRate = premiumType == CommonConstant.PremiumTypePrcnt && AddCvgIndex != -1? AddCvg[AddCvgIndex].RateToInsco : inscoAddPremiRate;
          }

          const control = this.fb.group({
            MrAddCvgTypeCode: o.Key,
            AddCvgTypeName: o.Value,
            Value: true,
            SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
            SumInsuredAmt: check.SumInsuredAmt,
            PremiumType: check.PremiumType,
            BaseCustAddPremiRate: BaseCustAddPremiRate,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: check.CustAddPremiAmt,
            BaseCalculation: check.BaseCalc,
            BaseInscoAddPremiRate: BaseInscoAddPremiRate,
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
          SumInsuredAmt: defaultSumInsuredAmt,
          PremiumType: premiumType,
          BaseCustAddPremiRate: custAddPremiRate,
          CustAddPremiRate: custAddPremiRate,
          CustAddPremiAmt: 0,
          BaseCalculation: "",
          BaseInscoAddPremiRate: inscoAddPremiRate,
          InscoAddPremiRate: inscoAddPremiRate,
          InscoAddPremiAmt: 0,
          SeatCount: 0
        });
        (group.controls.AppInsAddCvgs as FormArray).push(control);
      }

      if (!AddCvg.find(x => x.AdditionalCoverageType == group.controls.AppInsAddCvgs["controls"][count].controls.MrAddCvgTypeCode.value)) {
        if(custAddPremiRate == null) this.listRuleNotComplete.push({ index: MainCvgIndex, AddCvg: group.controls.AppInsAddCvgs["controls"][count].controls.MrAddCvgTypeCode.value });
      } else if (group.controls.AppInsAddCvgs["controls"][count].controls.CustAddPremiRate.value == null) {
        this.listRuleNotComplete.push({ index: MainCvgIndex, AddCvg: group.controls.AppInsAddCvgs["controls"][count].controls.MrAddCvgTypeCode.value })
      }

      count++;
    });

    return group;
  }

  async executeInstRateCvgRule(MainCoverageType: string, editedIndex: number = 0) {
    this.listYear = new Array();
    let resInsuranceDataInsRateCvgRuleObj: ResExecRuleInsRateCvgV2_1obj;

    let ListSumInsuredPercentage = new Array();
    if(this.isFromDB){
      this.listYear.push(this.appInsMainCvgObj[editedIndex].YearNo);
      ListSumInsuredPercentage.push(this.appInsMainCvgObj[editedIndex].SumInsuredPrcnt);
    }else{
      if(this.isApplyToAll){
        let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
        for (var i = 0; i < noOfYear; i++) {
          this.listYear.push(i + 1);
          ListSumInsuredPercentage.push(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["SumInsuredPrcnt"].value);
        }
      }else{
        this.listYear.push(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][editedIndex]["controls"]["YearNo"].value);
        ListSumInsuredPercentage.push(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][editedIndex]["controls"]["SumInsuredPrcnt"].value)
      }
    }

    let ReqObj = new InsuranceDataInsRateCvgRuleObj();
    ReqObj.InscoHoCode = this.inscoHoCode;
    ReqObj.InscoCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    ReqObj.RegionCode = this.InsuranceDataForm.controls.InsAssetRegion.value;
    ReqObj.MainCoverageType = MainCoverageType;
    ReqObj.InsAssetCategory = this.ruleObj.InsAssetCategory;
    ReqObj.AppId = this.appObj.AppId;
    ReqObj.AppAssetId = this.appAssetId;
    ReqObj.AppCollateralId = this.appCollateralId;
    ReqObj.CoverageAmt = this.InsuranceDataForm.controls.CvgAmt.value;
    ReqObj.SumInsuredPercentage = ListSumInsuredPercentage;
    ReqObj.YearNo = this.listYear;
    
    await this.http.post(URLConstant.ExecuteInsRateCvgRuleV2_1, ReqObj).toPromise().then(
      async (response: ResExecRuleInsRateCvgV2_1obj) => {
        resInsuranceDataInsRateCvgRuleObj = response;
        this.ruleRateCvgName = response.RuleSetName;
      });
    return resInsuranceDataInsRateCvgRuleObj;
  }

  getLoadingFeeRate(AddCvg: Array<AdditionalCoverageObj>) {
    for (var i = 0; i < AddCvg.length; i++) {
      let assetAgeMin = AddCvg[i].AssetAgeFrom ? AddCvg[i].AssetAgeFrom : 0;
      let assetAgeMax = AddCvg[i].AssetAgeTo ? AddCvg[i].AssetAgeTo : 0;
      if (this.manufYearDiff >= assetAgeMin && this.manufYearDiff <= assetAgeMax) {
        return AddCvg[i];
      }
    };
    return null;
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

  assetRegionChanged(){
    this.isGenerate = false;
  }  
  
  coverPeriodChanged(event) {
    this.setInsLengthDefaultValue(event.target.value);
    this.isGenerate = false;
  }
  
  async inscoBranchCodeChanged(event) {
    if (event.target.value != "") {
      this.InsuranceDataForm.patchValue({
        InscoBranchName: this.inscoBranchObj.find(x => x.Key == event.target.value).Value
      });
      await this.getVendorParent(event.target.value);
    } else {
      this.InsuranceDataForm.patchValue({
        InscoBranchName: ""
      });
    }
    this.isGenerate = false;
  }
  
  async getVendorParent(ChildVendorCode: string) {
    if(ChildVendorCode == "") return;
    await this.http.post(URLConstant.GetVendorParentByVendorCode, { Code: ChildVendorCode }).toPromise().then(
      (response) => {
        this.inscoHoCode = response["VendorCode"];
      }
    );
  }
  
  cvgAmtChanged() {
    this.isGenerate = false;
  }
  
  insLengthChanged() {
    this.isGenerate = false;
  }
  
  async mainCvgTypeDetailChanged(event: any, index: number) {
    if(this.pageState == this.editInsurance) this.isFromDB = false;
    this.isApplyToAll = false;
    if (event.target.value != '') {
      let response: ResExecRuleInsRateCvgV2_1obj;
      response = await this.executeInstRateCvgRule(event.target.value, index);
      this.listRuleNotComplete = this.listRuleNotComplete.filter(x => x.index != index);
      await this.patchInsRateCvg(index, response.ReturnObject[0]);
    }
    this.isCalculate = false;
  }

  async patchInsRateCvg(MainCvgIndex: number, MainCvg: InsRateCoverageObj) {
    this.groupAddCvrSumInsuredDropDown[MainCvgIndex] = new Object();
    let AddCvg = MainCvg.AdditionalCoverage;

    AddCvg.forEach(currAddCvrItem => {
      if (currAddCvrItem.PremiumType == CommonConstant.PremiumTypeAmt) {
        if (typeof (this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType]) == 'undefined')
          this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType] = new Array<InsRateAddCvgRuleObj>();
        this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType].push(currAddCvrItem);
      }
    });

    var AppInsMainCvg = this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][MainCvgIndex]
    await this.getManuDiffYear(MainCvgIndex);

    AppInsMainCvg.patchValue({
      BaseCustMainPremiRate: MainCvg.MainRateToCust,
      CustMainPremiRate: MainCvg.MainRateToCust,
      BaseInscoMainPremiRate: MainCvg.MainRateToInsco,
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

        this.addDictInsCustRate(o.Key, custAddPremiRate);
        if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
          let AddCvgFee = AddCvg.filter(x => x.AdditionalCoverageType == CommonConstant.MrAddCvgTypeCodeLoading);
          let LoadingObj = this.getLoadingFeeRate(AddCvgFee);
          if (LoadingObj) {
            AppInsAddCvg.patchValue({
              Value: this.manufYearDiff < this.defaultLoadingFeeYear ? false : true,
              SumInsuredAmt: LoadingObj.SumInsuredAmt,
              PremiumType: premiumType,
              BaseCustAddPremiRate: premiumType == CommonConstant.PremiumTypePrcnt ? LoadingObj.RateToCust : LoadingObj.PremiToCust,
              CustAddPremiRate: premiumType == CommonConstant.PremiumTypePrcnt ? LoadingObj.RateToCust : LoadingObj.PremiToCust,
              CustAddPremiAmt: 0,
              BaseCalculation: LoadingObj.BaseCalc,
              BaseInscoAddPremiRate: premiumType == CommonConstant.PremiumTypePrcnt ? LoadingObj.RateToInsco : LoadingObj.PremiToInsco,
              InscoAddPremiRate: premiumType == CommonConstant.PremiumTypePrcnt ? LoadingObj.RateToInsco : LoadingObj.PremiToInsco,
              InscoAddPremiAmt: 0,
              SeatCount: 0
            });
          } else {
            AppInsAddCvg.patchValue({
              Value: this.manufYearDiff < this.defaultLoadingFeeYear ? false : true,
              SumInsuredAmt: 0,
              PremiumType: CommonConstant.PremiumTypePrcnt,
              BaseCustAddPremiRate: null,
              CustAddPremiRate: null,
              CustAddPremiAmt: 0,
              BaseCalculation: "",
              BaseInscoAddPremiRate: 0,
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
            BaseCustAddPremiRate: custAddPremiRate,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: 0,
            BaseCalculation: AddCvg[AddCvgIndex].BaseCalc,
            BaseInscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiAmt: 0,
            SeatCount: 0
          });
        }
      } else {
        AppInsAddCvg.patchValue({
          Value: false,
          SumInsuredAmt: 0,
          PremiumType: this.defaultPremiumType,
          BaseCustAddPremiRate: null,
          CustAddPremiRate: null,
          CustAddPremiAmt: 0,
          BaseCalculation: "",
          BaseInscoAddPremiRate: 0,
          InscoAddPremiRate: 0,
          InscoAddPremiAmt: 0,
          SeatCount: 0
        });
      }

    });
    this.InsuranceDataForm.updateValueAndValidity();

    await this.calcDiscount();

    for (var j = 0; j < AppInsAddCvgs.length; j++) {
      if (!AddCvg.find(x => x.AdditionalCoverageType == AppInsAddCvgs[j].controls.MrAddCvgTypeCode.value)) {
        this.listRuleNotComplete.push({ index: MainCvgIndex, AddCvg: AppInsAddCvgs[j].controls.MrAddCvgTypeCode.value })
      } else if (AppInsAddCvgs[j].controls.CustAddPremiRate.value == null) {
        this.listRuleNotComplete.push({ index: MainCvgIndex, AddCvg: AppInsAddCvgs[j].controls.MrAddCvgTypeCode.value })
      }
    }
  }

  async getManuDiffYear(index: number) {
    this.loadingFeeCountType = await this.getLoadingFeeCountType();
    switch (this.loadingFeeCountType) {
      case CommonConstant.LoadingFeeCountType_CountingYear:
        this.countTypeCountingYear(index);
        break;
      case CommonConstant.LoadingFeeCountType_FirstYear:
        this.countTypeFirstYear();
        break;
      case CommonConstant.LoadingFeeCountType_LastYear:
        this.countTypeLastYear();
        break;
    }
  }

  countTypeCountingYear(index: number) {
    this.manufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    this.manufYearDiff += index;
  }

  countTypeFirstYear() {
    this.manufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
  }

  countTypeLastYear() {
    this.manufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
    this.manufYearDiff += (noOfYear - 1);
  }

  isMainCvgChaged(i: number) {
    this.isCalculate = false;
    if (i != undefined && this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["MrInsPaidByCode"].value == CommonConstant.InsPaidByAtCost) {
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
        IsCapitalized: false,
      });
    }
    this.checkPaidBy();

    var obj = {
      target : {
        value : this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["MrMainCvgTypeCode"].value
      }
    };
    this.mainCvgTypeDetailChanged(obj, i);
  }

  async isAddCvgChanged(event: any, MainCvgIndex: number, AddCvgIndex: number) {
    this.isCalculate = false;
    this.cekSeatCount();

    if (this.pageState == this.editInsurance && this.isFromDB) {
      this.listRuleNotComplete = new Array();
      let checked = event.target.checked;
      
      let MainCvg = this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][MainCvgIndex].controls;
      let AddCvg = MainCvg.AppInsAddCvgs.controls[AddCvgIndex].controls;
      let response: ResExecRuleInsRateCvgV2_1obj;
      response = await this.executeInstRateCvgRule(MainCvg.MrMainCvgTypeCode.value, MainCvgIndex);
  
      response.ReturnObject[0].AdditionalCoverage.forEach(currAddCvrItem => {
        if (currAddCvrItem.PremiumType == CommonConstant.PremiumTypeAmt) {
          if (typeof (this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType]) == 'undefined')
            this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType] = new Array<InsRateAddCvgRuleObj>();
          this.groupAddCvrSumInsuredDropDown[MainCvgIndex][currAddCvrItem.AdditionalCoverageType].push(currAddCvrItem);
        }
      });
  
      let AddCvgToPatch = response.ReturnObject[0].AdditionalCoverage.find(x => x.AdditionalCoverageType == AddCvg.MrAddCvgTypeCode.value);
      this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][MainCvgIndex].controls.AppInsAddCvgs["controls"][AddCvgIndex].patchValue({
        SumInsuredAmt: AddCvgToPatch.PremiumType == CommonConstant.PremiumTypeAmt ? this.groupAddCvrSumInsuredDropDown[MainCvgIndex][AddCvgToPatch.AdditionalCoverageType][0].SumInsuredAmt : null,
        PremiumType: AddCvgToPatch.PremiumType,
        BaseCustAddPremiRate: AddCvgToPatch.PremiToCust,
        CustAddPremiRate: AddCvgToPatch.PremiumType == CommonConstant.PremiumTypePrcnt ? AddCvgToPatch.RateToCust : AddCvgToPatch.PremiToCust,
        BaseCalculation: AddCvgToPatch.BaseCalc,
        BaseInscoAddPremiRate: AddCvgToPatch.PremiToInsco,
        InscoAddPremiRate: AddCvgToPatch.PremiumType == CommonConstant.PremiumTypePrcnt ? AddCvgToPatch.RateToInsco :AddCvgToPatch.PremiToInsco,
        SeatCount: 0,
        Value: checked
      });
    }
  }
  
  cekSeatCount() {
    this.isUsingSeatCount = false;
    this.InsuranceDataForm.controls.AppInsMainCvgs['controls'].forEach(appInsMainCvgs => {
      appInsMainCvgs.controls.AppInsAddCvgs.controls.forEach(appInsAddCvgs => {
        let addCvgType = appInsAddCvgs.controls.MrAddCvgTypeCode.value;
        let isChecked = appInsAddCvgs.controls.Value.value;
        if (this.addCvgNeedSeatCount.includes(addCvgType) && isChecked) this.isUsingSeatCount = true;
      });
    });
  }

  sumInsuredAmtAddCvgChanged(event, i, j) {
    this.isCalculate = false;
    let addInsTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].controls.MrAddCvgTypeCode.value;
    if (this.groupAddCvrSumInsuredDropDown[i][addInsTypeCode]) {
      let addCvgTplObj = this.groupAddCvrSumInsuredDropDown[i][addInsTypeCode].find(x => x.SumInsuredAmt == event.target.value);
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
        BaseCustAddPremiRate: addCvgTplObj.PremiToCust,
        CustAddPremiRate: addCvgTplObj.PremiToCust,
        BaseInscoAddPremiRate: addCvgTplObj.PremiToInsco,
        InscoAddPremiRate: addCvgTplObj.PremiToInsco,
        StdAddPremiRate: addCvgTplObj.BaseRate
      });
    }
  }

  seatCountChange() {
    this.isCalculate = false;
  }

  isFullCapitalizedAmount() {
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

  async applyToCoverage() {
    this.isApplyToAll = true;
    this.listRuleNotComplete = new Array();
    if(this.pageState == this.editInsurance) this.isFromDB = false;
    let MainCoverageType = this.InsuranceDataForm.controls.InsMainCvgType.value;

    let response: ResExecRuleInsRateCvgV2_1obj;
    response = await this.executeInstRateCvgRule(MainCoverageType);
    
    let MainCvgIdxToPatch;
    this.manufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
        MrMainCvgTypeCode: MainCoverageType
      });

      for(let k = 0 ; k < response.ReturnObject.length; k++){
        if(this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["YearNo"].value == response.ReturnObject[k].YearNo){
          MainCvgIdxToPatch = k;
          break;
        }
      }
      await this.patchInsRateCvg(i, response.ReturnObject[MainCvgIdxToPatch]);

      const formAddCvgChecked = this.InsuranceDataForm.controls.InsAddCvgTypes["controls"].filter(x => x.value.Value == true);

      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
        let check = formAddCvgChecked.find(x => x.value.Key == this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].AddCvgTypeName.value);

        if (check != undefined) {
          if (check.value.Key == CommonConstant.AddCvgTypeNameLoading) {
            if (this.manufYearDiff < this.defaultLoadingFeeYear) {
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

  async calculateInsurance() {
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
    let reqObj = new RequestCalcInsV2Obj();

    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      var insCoverage = new CalcInsMainCvgObj();

      insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
      insCoverage.Month = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
      insCoverage.CoverageAmt = this.InsuranceDataForm.controls.CvgAmt.value;
      insCoverage.SumInsured = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
      insCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].BaseCustMainPremiRate.value;
      insCoverage.MainCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;
      insCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].BaseInscoMainPremiRate.value;

      let ruleNotCompletes = this.listRuleNotComplete.filter(x => x.index == i);
      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
        for (let k = 0; k < ruleNotCompletes.length; k++) {
          if (ruleNotCompletes[k].AddCvg == this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value && this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value) {
            this.toastr.warningMessage(String.Format(ExceptionConstant.SETTING_COMPONENT_RULE_FIRST, this.ruleRateCvgName, this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].AddCvgTypeName.value, insCoverage.YearNo));
            isRuleComplete = false;
          }
        }

        if (this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].Value.value == true) {
          let addCoverage = new CalcInsAddCvgObj();

          addCoverage.BaseCalculation = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].BaseCalculation.value;
          addCoverage.SumInsured = insCoverage.SumInsured;
          addCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].BaseCustAddPremiRate.value;
          addCoverage.RateType = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].PremiumType.value;
          addCoverage.AddCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].MrAddCvgTypeCode.value;
          addCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].BaseInscoAddPremiRate.value;
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
    reqObj.AppId = this.appObj.AppId;
    reqObj.AppAssetId = this.appAssetId;
    reqObj.AppCollateralId = this.appCollateralId;
    reqObj.IsOffTheRoadOrHE = this.isOffTheRoadOrHE;
    reqObj.DiscountToInsco = this.InsuranceDataForm.controls.DiscountToInsco.value;

    await this.http.post(URLConstant.CalculateInsuranceV2, reqObj).toPromise().then(
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
    this.bindCapitalize();
  }

  async saveForm(formDirective: FormGroupDirective){
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
    await this.setSaveObj(insuredBy);
    this.outputTab.emit(this.saveObj);
    if(this.isMultiAsset) formDirective.resetForm();
  }

  setSaveObj(insuredBy) {
    this.saveObj = new InsuranceDataObj();
    this.saveObj.AppId = this.appObj.AppId;
    this.saveObj.AppInsuranceObj.AppId = this.appObj.AppId;
    this.saveObj.AppInsObjObj.AppInsObjId = this.appInsObjObj != undefined || this.appInsObjObj != null ? this.appInsObjObj.AppInsObjId : 0;
    this.saveObj.AppInsObjObj.AppId = this.appObj.AppId;
    this.saveObj.AppInsObjObj.InsAssetCoveredBy = insuredBy;
    this.saveObj.AppInsObjObj.InsSeqNo = this.insSeqNo;

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

  cancel() {
    this.outputCancel.emit();
  }

  back() {
    this.outputTab.emit();
  }

  calcDiscount(){
    if(!this.isOffTheRoadOrHE) return;
    
    let CustMainPremiRate = this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][0].controls.CustMainPremiRate.value;
    let InscoMainPremiRate = this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][0].controls.InscoMainPremiRate.value;
    let DiscountToInsco = (1 - (InscoMainPremiRate / CustMainPremiRate)) * 100;

    if(DiscountToInsco < 0){
      this.toastr.warningMessage(String.Format(ExceptionConstant.X_CANT_BE_GREATER_THAN_Y , "Main Coverage Rate to Insurance Company", "Main Coverage Rate to Customer"));
      DiscountToInsco = 0;
    }

    this.InsuranceDataForm.patchValue({
      DiscountToInsco : DiscountToInsco
    })
  }

  discountChanged(){
    this.isCalculate = false;
  }

  premiRateChanged(at: string, MainCvgIdx: number, AddCvgIdx : number = 0){
    switch(at){
      case 'MAIN' :
        this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][MainCvgIdx].patchValue({
          BaseCustMainPremiRate : this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][MainCvgIdx].controls.CustMainPremiRate.value,
          BaseInscoMainPremiRate : this.InsuranceDataForm.controls.AppInsMainCvgs["controls"][MainCvgIdx].controls.CustMainPremiRate.value
        });
        break;
      case 'ADD' :
        this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][MainCvgIdx]["controls"]["AppInsAddCvgs"]["controls"][AddCvgIdx].patchValue({
          BaseCustAddPremiRate: this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][MainCvgIdx]["controls"]["AppInsAddCvgs"]["controls"][AddCvgIdx].controls.CustAddPremiRate.value,
          BaseInscoAddPremiRate : this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][MainCvgIdx]["controls"]["AppInsAddCvgs"]["controls"][AddCvgIdx].controls.CustAddPremiRate.value,
        });
        break;
    }
  }

  async getGeneralSetting(GsCode: string){
    let generalSetting: GeneralSettingObj = new GeneralSettingObj();
    let genericObj = new GenericObj();
    genericObj.Code = GsCode;
    
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingByCode, genericObj).toPromise().then(
      (response) => {
        generalSetting = response;
      }
    );
    return generalSetting;
  }
}
