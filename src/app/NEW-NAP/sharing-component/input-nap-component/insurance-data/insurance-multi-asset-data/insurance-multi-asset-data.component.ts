import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { FormBuilder, Validators, FormArray, FormGroupDirective, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { AppAssetAccessoryObj } from 'app/shared/model/app-asset-accessory-obj.model';
import { AppInsuranceObj } from 'app/shared/model/app-insurance-obj.model';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { AppInsMainCvgObj } from 'app/shared/model/app-ins-main-cvg-obj.model';
import { ResultInsRateRuleObj } from 'app/shared/model/result-ins-rate-rule-obj.model';
import { ResultCalcInsObj } from 'app/shared/model/result-calc-ins-obj.model';
import { InsuranceDataObj } from 'app/shared/model/insurance-data-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { AppCollateralAccessoryObj } from 'app/shared/model/app-collateral-accessory-obj.model';
import { ResultSubsidySchmRuleObj } from 'app/shared/model/subsidy-schm/result-subsidy-schm-rule-obj.model';
import { formatDate } from '@angular/common';
import { InsuranceDataInsRateRuleObj } from 'app/shared/model/insurance-data-ins-rate-rule-obj.model';
import { RequestCalcInsObj } from 'app/shared/model/request-calc-ins-obj.model';
import { CalcInsMainCvgObj } from 'app/shared/model/calc-ins-main-cvg-obj.model';
import { CalcInsAddCvgObj } from 'app/shared/model/calc-ins-add-cvg-obj.model';
import { AppInsAddCvgObj } from 'app/shared/model/app-ins-add-cvg-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InsRateAddCvgRuleObj } from 'app/shared/model/ins-rate-add-cvg-rule-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ReqGetVendorByCategoryCodeAndOfficeCodeObj } from 'app/shared/model/request/vendor/req-vendor.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { AppAssetCollateralForInsuranceObj } from 'app/shared/model/app-asset-collateral-for-insurance.model';
import { InsuranceLenObj, ResInsuranceLenObj } from 'app/shared/model/insurance-len-obj.model';
import { ReqAppCollateralForCopyInsuranceCustomObj } from 'app/shared/model/request/app-collateral/req-collateral-for-copy-insurance-obj.model';
import { ReqCopyInsuranceCustomObj } from 'app/shared/model/request/app-ins/req-copy-insurance-custom-obj.model';

@Component({
  selector: 'app-insurance-multi-asset-data',
  templateUrl: './insurance-multi-asset-data.component.html',
  styleUrls: ['./insurance-multi-asset-data.component.css']

})
export class InsuranceMultiAssetDataComponent implements OnInit {
  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Input() BLCode: string = "";
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  // Insurance Data
  AppAssetId: number = 0;
  AppCollateralId: number = 0;
  appInsObjId: number = 0;
  totalAssetPriceAmt: number;
  totalAssetInclAccessoryPriceAmt: number = 0;
  InsSeqNo: number = 0;
  defaultInsAssetRegion: string;
  IsMultiAsset: string = "false";
  BizTemplateCode: string = "";

  appObj: NapAppModel = new NapAppModel();
  appAssetObj: AppAssetObj = new AppAssetObj();
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
  insMainCvgTypeRuleObj = [{
    Key: "",
    Value: ""
  }];
  insAddCvgTypeObj: Array<KeyValueObj>;
  insAddCvgTypeRuleObj: Array<KeyValueObj>;
  groupedAddCvgType: Array<string>;
  insAssetCoverPeriodObj: Array<KeyValueObj>;
  insAssetRegionObj: Array<KeyValueObj>;
  payPeriodToInscoObj: Array<KeyValueObj>;
  defaultInsMainCvgType: string;
  listDataCollateral: Array<any> = new Array();
  listDataInsuranceForCopy: Array<any> = new Array();
  selectedCollateral: any = "";
  selectedInsuranceForCopy: any = "";

  existingListAppColl: Array<AppCollateralObj> = new Array<AppCollateralObj>();

  showGenerate: boolean = false;
  isGenerate: boolean = false;
  isCalculate: boolean = false;
  businessDt: Date = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
  defInsPaidBy: string = CommonConstant.InsPaidByCustomer;
  adminFeeLock: boolean = false;
  stampdutyFeeLock: boolean = false;
  paidByBhv: Array<{ PaidByYearNo: number, PaidBy: string, PaidByBhv: string }>;
  isYearlyCapitalized: boolean = false;
  groupAddCvrSumInsuredDropDown: Object;
  isUsingSeatCount: boolean = false;
  AddCvgNeedSeatCount: Array<string> = [CommonConstant.MrAddCvgTypeCodePap];

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
    TotalInscoFeeAmt: [0],
    TotalCustMainPremiAmt: [0],
    TotalCustAddPremiAmt: [0],
    TotalInscoMainPremiAmt: [0],
    TotalInscoAddPremiAmt: [0],
    InscoAdminFeeAmt: [0],
    CustAdminFeeAmt: [0],
    CustStampDutyFeeAmt: [0],
    InscoStampDutyFeeAmt: [0],
    CvgAmt: [0, Validators.required],
    CustCvgAmt: [0, Validators.required],
    TotalCustDiscAmt: [0],
    InsCpltzAmt: [0],
    PayPeriodToInsco: ['', Validators.required],
    IsFullCapitalizedAmount: [false]
  });
  // End Insurance Data

  PageState: string = 'Paging';
  listAppAssetObj: Array<AppAssetCollateralForInsuranceObj>;
  listAppCollateralObj: Array<AppAssetCollateralForInsuranceObj>;
  gridAssetDataObj: InputGridObj = new InputGridObj();
  gridAppCollateralObj: InputGridObj = new InputGridObj();

  InsCpltzAmt: number = 0;
  InsDiscAmt: number = 0;
  TotalPremiumToCust: number = 0;
  PaidAmtByCust: number = 0;
  textTitle: string;
  AppInsForm = this.fb.group({
    // PaidAmtByCust: [0]
  });

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    })
  }

  ngOnInit() {
    this.gridAssetDataObj.pagingJson = "./assets/ucgridview/gridAssetDataView.json";
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateralInsurance.json";
    this.BindMultiInsGridData();
    if (this.BLCode == CommonConstant.FCTR) {
      this.GetExistingAppCollateralWithInsurance();
      this.textTitle = "Collateral";
    }
    this.GetCollateralDDLForCopy();
  }

  CancelHandler() {
    this.outputCancel.emit();
  }

  CopyInsuranceHandler() {
    if(this.selectedCollateral == ""){
      this.toastr.warningMessage("Please Choose Collateral First");
      return;
    }

    if(this.selectedInsuranceForCopy == ""){
      this.toastr.warningMessage("Please Choose Insurance Data to Copy");
      return;
    }

    let reqObj: ReqCopyInsuranceCustomObj = new ReqCopyInsuranceCustomObj();
    let splittedCollateral: Array<any> = this.selectedCollateral.split(";");
    let splittedInsurance: Array<any>  = this.selectedInsuranceForCopy.split(";");
    reqObj = this.setCopyInsuranceData(reqObj, splittedCollateral, splittedInsurance);

    this.http.post(URLConstant.CopyInsuranceData, reqObj).subscribe(
      (response) => {
        this.selectedInsuranceForCopy = "";
        this.selectedCollateral = "";
        this.BindMultiInsGridData();
        this.toastr.successMessage(response["message"]);
      }
    )
  }

  setCopyInsuranceData(reqObj: ReqCopyInsuranceCustomObj, splittedCollateral: Array<any>, splittedInsurance: Array<any>) {
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.AppId = this.appId;
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.FullAssetCode = splittedCollateral[0];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.ManufacturingYear = splittedCollateral[1];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.MrCollateralConditionCode = splittedCollateral[2];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.MrCollateralUsageCode = splittedCollateral[3];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.CollateralValueAmt = +splittedCollateral[4];
    reqObj.ReqAppCollateralForCopyInsuranceCustomObj.TotalAccessoryPriceAmt = +splittedCollateral[5];

    reqObj.ReqInsuranceForCopyInsuranceCustomObj.InscoBranchCode = splittedInsurance[0];
    reqObj.ReqInsuranceForCopyInsuranceCustomObj.InsLength = +splittedInsurance[1];
    reqObj.ReqInsuranceForCopyInsuranceCustomObj.InsAssetPaidBy = splittedInsurance[2];
    reqObj.ReqInsuranceForCopyInsuranceCustomObj.InsAssetCoveredBy = splittedInsurance[3];
    reqObj.ReqInsuranceForCopyInsuranceCustomObj.TotalInsCustAmt = +splittedInsurance[4];

    return reqObj;
  }

  BindMultiInsGridData() {
    this.InsuranceDataForm.reset();
    this.InsuranceDataForm.patchValue({
      InsAssetCoveredBy: '',
      InsAssetCoverPeriod: '',
      InscoBranchCode: '',
      InscoBranchName: '',
      CustInscoBranchName: '',
      InsPolicyNo: '',
      InsPolicyName: '',
      CustCoverStartDt: '',
      EndDt: '',
      Notes: '',
      CustNotes: '',
      InsMainCvgType: '',
      InsAddCvgTypes: [],
      InsLength: '',
      InsAssetRegion: '',
      AppInsMainCvgs: [],
      PayPeriodToInsco: '',
      TotalCustMainPremiAmt: 0,
      TotalCustAddPremiAmt: 0,
      TotalInscoMainPremiAmt: 0,
      TotalInscoAddPremiAmt: 0,
      InscoAdminFeeAmt: 0,
      CustAdminFeeAmt: 0,
      CvgAmt: 0,
      CustCvgAmt: 0,
      TotalCustDiscAmt: 0,
      InsCpltzAmt: 0,
      TotalCustFeeAmt: 0,
      TotalInscoFeeAmt: 0
    });

    let appObj = { Id: this.appId }
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response) => {
        this.BizTemplateCode = response["BizTemplateCode"];
        this.textTitle = "Collateral";
        this.appObj.ProdOfferingCode = response["ProdOfferingCode"];
        this.appObj.ProdOfferingVersion = response["ProdOfferingVersion"];
      });

    this.appAssetObj.Id = this.appId;
    this.http.post(URLConstant.GetAppAssetListForInsuranceByAppId, this.appAssetObj).subscribe(
      (response) => {
        this.listAppAssetObj = response[CommonConstant.ReturnObj];

        let DetailForGridAsset = {
          Data: response[CommonConstant.ReturnObj],
          Count: "0"
        }
        this.gridAssetDataObj.resultData = DetailForGridAsset;
      });

    this.http.post(URLConstant.GetAppCollateralListForInsuranceByAppId, this.appAssetObj).subscribe(
      (response) => {
        this.listAppCollateralObj = response[CommonConstant.ReturnObj];

        let DetailForGridCollateral = {
          Data: response[CommonConstant.ReturnObj],
          Count: "0"
        }
        this.gridAppCollateralObj.resultData = DetailForGridCollateral;

        this.PaidAmtByCust = 0;
        this.InsCpltzAmt = 0;
        this.TotalPremiumToCust = 0;
        this.InsDiscAmt = 0;

        if (this.listAppCollateralObj[0].PaidAmtByCust != null)
          this.PaidAmtByCust = this.listAppCollateralObj[0].PaidAmtByCust;

        if (this.listAppCollateralObj[0].InsCpltzAmt != null)
          this.InsCpltzAmt += this.listAppCollateralObj[0].InsCpltzAmt;

        if (this.listAppCollateralObj[0].InsDiscAmt != null)
          this.InsDiscAmt += this.listAppCollateralObj[0].InsDiscAmt;

        if (this.listAppCollateralObj[0].TotalCustPremiAmt != null)
          this.TotalPremiumToCust = this.listAppCollateralObj[0].TotalCustPremiAmt;
      });
  }

  GetExistingAppCollateralWithInsurance() {
    this.http.post(URLConstant.GetListExistingAppCollateralWithInsurance, { Id: this.appId }).subscribe(
      (response) => {
        this.existingListAppColl = response["AppCollateralObjs"];
      });
  }

  async GetInsMultiData(): Promise<void> {
    await this.getInsuranceData();
    await this.bindInsMainCvgTypeObj();
    await this.bindInsAddCvgTypeObj();
    await this.bindCapitalizeGeneralSetting();
    this.bindInsuredByObj();
    this.bindPaidByObj();
    this.bindInsAssetCoverPeriodObj();
    this.bindInsAssetRegionObj();
    this.bindInscoBranchObj();
    this.bindPayPeriodToInscoObj();
    if (this.appInsObjObj != null) {
      await this.bindAppInsAndAppInsObj(this.appInsObjObj.InsAssetCoveredBy);
    } else {
      this.InsuranceDataForm.patchValue({
        InsAssetRegion: this.defaultInsAssetRegion
      });
    }

    if (this.BLCode == CommonConstant.FCTR && this.existingListAppColl.length != 0) {
      for (let i = 0; i < this.existingListAppColl.length; i++) {
        if (this.existingListAppColl[i].CollateralNo == this.appCollateralObj.CollateralNo) {
          this.InsuranceDataForm.patchValue({
            InsAssetCoveredBy: "OFF"
          });
          this.setValidator(this.InsuranceDataForm.get("InsAssetCoveredBy").value);
          this.InsuranceDataForm.controls.InsAssetCoveredBy.disable();
          break;
        }
      }
    }
  }

  GetCollateralDDLForCopy() {
    let appAssetObj = { Id: this.appId };
    this.http.post(URLConstant.GetListAppCollateralForCopyInsuranceByAppId, appAssetObj).subscribe(
      (response) => {
        this.listDataCollateral = response[CommonConstant.ReturnObj];
      }
    );
  }

  async GetInsuranceDDLForCopy() {
    this.selectedInsuranceForCopy = "";
    if(this.selectedCollateral == ""){
      this.listDataInsuranceForCopy = null;
      return;
    }

    let splitted = this.selectedCollateral.split(";");

    if(splitted.length == 1){
      this.toastr.warningMessage(ExceptionConstant.ASSET_DATA_NOT_COMPLETE);
      return;
    }

    let reqObj: ReqAppCollateralForCopyInsuranceCustomObj = new ReqAppCollateralForCopyInsuranceCustomObj();
    reqObj.AppId = this.appId;
    reqObj.FullAssetCode = splitted[0];
    reqObj.ManufacturingYear = splitted[1];
    reqObj.MrCollateralConditionCode = splitted[2];
    reqObj.MrCollateralUsageCode = splitted[3];
    reqObj.CollateralValueAmt = +splitted[4];
    reqObj.TotalAccessoryPriceAmt = +splitted[5];

    await this.http.post(URLConstant.GetListInsuranceDataForCopyInsuranceByAppId, reqObj).toPromise().then(
      (response) => {
        this.listDataInsuranceForCopy = response[CommonConstant.ReturnObj];
        if (this.listDataInsuranceForCopy.length > 0) this.selectedInsuranceForCopy = this.listDataInsuranceForCopy[0].Code;
      }
    );
  }

  // PaidAmtChanged(ev) {
  //   this.InsCpltzAmt = this.TotalPremiumToCust - Number(ev.replace(/,/g, ''));
  //   if (this.InsCpltzAmt < 0) this.toastr.warningMessage('Paid Amount by Cust cannot be greater than Total Premium to Customer!!!');
  // }

  event2(e) {
    this.PageState = 'EditAsset';
  }

  getValue(e) {
    this.PageState = 'Paging';
  }

  event(ev) {
    this.AppCollateralId = ev.RowObj.AppCollateralId;
    this.AppAssetId = ev.RowObj.AppAssetId;
    if (this.AppAssetId == null || this.AppAssetId == undefined) { }
    this.AppAssetId = 0;

    this.appInsObjId = ev.RowObj.AppInsObjId;
    this.InsSeqNo = ev.RowObj.InsSeqNo;
    this.GetInsMultiData();
    this.PageState = 'EditInsurance';
  }

  SubmitForm() {
    this.appAssetObj.Id = this.appId;
    this.http.post(URLConstant.GetAppCollateralListForInsuranceByAppId, this.appAssetObj).subscribe(
      (response) => {
        let isValid = true;
        let validateObj = response[CommonConstant.ReturnObj];
        for (let i = 0; i < validateObj.length; i++) {
          if (validateObj[i].AppInsObjId == 0)
            isValid = false;
        }
        if (isValid)
          this.outputTab.emit();
        else
          this.toastr.warningMessage("Please Complete Insurance Data on All Collateral.");
      });
  }

  // Insurance Methods
  SaveForm(formDirective: FormGroupDirective) {
    let insuredBy = this.InsuranceDataForm.controls.InsAssetCoveredBy.value;
    let insCpltzAmt: number;
    if (insuredBy == CommonConstant.InsuredByCompany || insuredBy == CommonConstant.InsuredByCustomerCompany) {
      let custDiscAmt = this.InsuranceDataForm.controls.TotalCustDiscAmt.value;
      let totalPremiToCust = this.InsuranceDataForm.controls.TotalCustMainPremiAmt.value + this.InsuranceDataForm.controls.TotalCustAddPremiAmt.value + this.InsuranceDataForm.controls.TotalCustFeeAmt.value;
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
      let startDt = new Date(this.InsuranceDataForm.controls.CustCoverStartDt.value);
      let endDt = new Date(this.InsuranceDataForm.controls.EndDt.value);

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

    if (this.appInsObjId == 0) {
      this.http.post(URLConstant.AddInsuranceDataMultiAsset, this.saveObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.BindMultiInsGridData();
          formDirective.resetForm();
          this.PageState = 'Paging';
          this.falseValue();
        });
    } else {
      this.http.post(URLConstant.EditInsuranceDataMultiAsset, this.saveObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.BindMultiInsGridData();
          formDirective.resetForm();
          this.PageState = 'Paging';
          this.falseValue();
        });
    }
    this.selectedInsuranceForCopy = "";
    this.listDataInsuranceForCopy = null;
    this.selectedCollateral = "";
  }

  Cancel() {
    this.BindMultiInsGridData();
    this.PageState = 'Paging';
    this.falseValue();
    this.selectedInsuranceForCopy = "";
    this.listDataInsuranceForCopy = null;
    this.selectedCollateral = "";
  }

  falseValue(){
    this.isGenerate = false;
    this.isCalculate = false;
    this.showGenerate = false;
  }

  setSaveObj(insuredBy) {
    this.saveObj = new InsuranceDataObj();
    this.saveObj.AppId = this.appId;
    this.saveObj.AppInsuranceObj.AppId = this.appId;
    this.saveObj.AppInsObjObj.AppId = this.appId;
    this.saveObj.AppInsObjObj.InsAssetCoveredBy = insuredBy;
    this.saveObj.AppInsObjObj.InsSeqNo = this.InsSeqNo;

    if (this.AppAssetId != 0) {
      this.saveObj.AppInsObjObj.AppAssetId = this.AppAssetId;
    }
    if (this.AppCollateralId != 0) {
      this.saveObj.AppInsObjObj.AppCollateralId = this.AppCollateralId;
    }
    if (this.appInsObjId != 0) {
      this.saveObj.AppInsObjObj.AppInsObjId = this.appInsObjId;
    }

    if (insuredBy == CommonConstant.InsuredByCustomer) {
      this.saveObj.AppInsObjObj.CustInscoBranchName = this.InsuranceDataForm.controls.CustInscoBranchName.value;
      this.saveObj.AppInsObjObj.InsPolicyNo = this.InsuranceDataForm.controls.InsPolicyNo.value;
      this.saveObj.AppInsObjObj.InsPolicyName = this.InsuranceDataForm.controls.InsPolicyName.value;
      this.saveObj.AppInsObjObj.CustCvgAmt = this.InsuranceDataForm.controls.CustCvgAmt.value;
      this.saveObj.AppInsObjObj.CustCoverStartDt = this.InsuranceDataForm.controls.CustCoverStartDt.value;
      this.saveObj.AppInsObjObj.EndDt = this.InsuranceDataForm.controls.EndDt.value;
      this.saveObj.AppInsObjObj.CustNotes = this.InsuranceDataForm.controls.CustNotes.value;
    }

    if (insuredBy == CommonConstant.InsuredByCompany) {
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

      this.saveObj.AppInsObjObj.CustAdminFeeAmt = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;;
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
            let addCoverage = new AppInsAddCvgObj();

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

    if (insuredBy == CommonConstant.InsuredByCustomerCompany) {
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
        insCoverage.Tenor = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
        insCoverage.MrMainCvgTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;
        insCoverage.MrInsPaidByCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrInsPaidByCode.value;
        insCoverage.IsCapitalized = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].IsCapitalized.value;

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
            let addCoverage = new AppInsAddCvgObj();

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
    if(!this.isGenerate){
      this.toastr.warningMessage(ExceptionConstant.CLICK_GENERATE_INSURANCE);
      return;
    }
    if (!this.InsuranceDataForm.controls["AppInsMainCvgs"].valid) return;
    let reqObj = new RequestCalcInsObj();
    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      var insCoverage = new CalcInsMainCvgObj();

      insCoverage.YearNo = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].YearNo.value;
      insCoverage.Month = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].Tenor.value;
      insCoverage.CoverageAmt = this.InsuranceDataForm.controls.CvgAmt.value;;
      insCoverage.SumInsured = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].SumInsuredPrcnt.value;
      insCoverage.Rate = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].CustMainPremiRate.value;
      insCoverage.MainCoverageTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].MrMainCvgTypeCode.value;
      insCoverage.RateToInsco = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"].InscoMainPremiRate.value;

      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
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
    reqObj.AdminFee = this.InsuranceDataForm.controls.CustAdminFeeAmt.value;
    reqObj.StampDutyFee = this.InsuranceDataForm.controls.CustStampDutyFeeAmt.value;
    reqObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    reqObj.ProdOfferingCode = this.appObj.ProdOfferingCode;
    reqObj.ProdOfferingVersion = this.appObj.ProdOfferingVersion;
    reqObj.AppId = this.appId;
    reqObj.AppAssetId = this.AppAssetId;
    reqObj.AppCollateralId = this.AppCollateralId;

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
              if (this.groupAddCvrSumInsuredDropDown[currAddCvgType]) {
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
              let sumInsuredAmt = 0;
              if (this.groupAddCvrSumInsuredDropDown[currAddCvgType]) {
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
    reqObj.InscoCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    reqObj.AssetCategory = this.appCollateralObj.AssetCategoryCode;
    reqObj.AssetCondition = this.appCollateralObj.MrCollateralConditionCode;
    reqObj.AssetPriceAmount = this.totalAssetInclAccessoryPriceAmt;
    reqObj.RegionCode = this.InsuranceDataForm.controls.InsAssetRegion.value;
    reqObj.ProdOfferingCode = this.appObj.ProdOfferingCode;
    reqObj.ProdOfferingVersion = this.appObj.ProdOfferingVersion;
    reqObj.AppCollateralId = this.appCollateralObj.AppCollateralId;

    await this.http.post(URLConstant.ExecuteInsRateRule, reqObj).toPromise().then(
      async (response) => {
        this.ruleObj = response["Result"];
        console.log(this.ruleObj);
        if (this.ruleObj.InsAssetCategory == "") {
          this.toastr.warningMessage(ExceptionConstant.SETTING_RULE_FIRST);
          return;
        }
        // group sum insurace for dropdown premium Type AMT
        //this.insRateAddCvgRuleTplObjs = response["InsRateAddCvgRuleTplObjs"];
        this.groupAddCvrSumInsuredDropDown = {};
        this.isUsingSeatCount = false;
        let InsRateAddCvgRuleObjs = response['InsRateAddCvgRuleObjs'];
        if (response["InsRateAddCvgRuleTplObjs"]) InsRateAddCvgRuleObjs = InsRateAddCvgRuleObjs.concat(response["InsRateAddCvgRuleTplObjs"]);
        InsRateAddCvgRuleObjs.forEach(currAddCvrItem => {
          if (currAddCvrItem.PremiumType == CommonConstant.PremiumTypeAmt) {
            if (typeof (this.groupAddCvrSumInsuredDropDown[currAddCvrItem.AdditionalCoverageType]) == 'undefined')
              this.groupAddCvrSumInsuredDropDown[currAddCvrItem.AdditionalCoverageType] = new Array<InsRateAddCvgRuleObj>();
            this.groupAddCvrSumInsuredDropDown[currAddCvrItem.AdditionalCoverageType].push(currAddCvrItem);
          }
        });

        this.bindInsMainCvgTypeRuleObj();
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

  DictInsCustRate: { [id: string]: number } = {};
  async GenerateMainAndAddCvgTable() {

    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);

    let loadingFeeCountType: string = await this.GetLoadingFeeCountType();
    switch (loadingFeeCountType) {
      case CommonConstant.LoadingFeeCountType_CountingYear:
        this.CountTypeCountingYear();
        break;
      case CommonConstant.LoadingFeeCountType_FirstYear:
        this.CountTypeFirstYear();
        break;
      case CommonConstant.LoadingFeeCountType_LastYear:
        this.CountTypeLastYear();
        break;
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

  CountTypeCountingYear(){
    let ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    let yearCount = this.InsuranceDataForm.controls.InsLength.value;
    let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
    let month: number = 12;
    for (let i = 0; i < noOfYear; i++) {
      let obj = { Tenor: 0, SumInsuredPrcnt: 0, CustMainPremiRate: 0, InscoMainPremiRate: 0 };

      if (yearCount - 12 >= 0) {
        month = 12;
      } else {
        month = yearCount;
      }

      obj.Tenor = month;
      obj.SumInsuredPrcnt = this.ruleObj.SumInsuredPercentage[i];
      let index = this.ruleObj.MainCoverageType.findIndex(x => x == this.InsuranceDataForm.controls.InsMainCvgType.value);
      obj.CustMainPremiRate = this.ruleObj.MainRateToCust[index];
      obj.InscoMainPremiRate = this.ruleObj.MainRateToInsco[index];
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroup(i, obj, ManufYearDiff));
      ManufYearDiff++;
      yearCount -= 12;
    }
  }

  CountTypeFirstYear(){
    let ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    let yearCount = this.InsuranceDataForm.controls.InsLength.value;
    let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
    let month: number = 12;
    for (let i = 0; i < noOfYear; i++) {
      let obj = { Tenor: 0, SumInsuredPrcnt: 0, CustMainPremiRate: 0, InscoMainPremiRate: 0 };

      if (yearCount - 12 >= 0) {
        month = 12;
      } else {
        month = yearCount;
      }

      obj.Tenor = month;
      obj.SumInsuredPrcnt = this.ruleObj.SumInsuredPercentage[i];
      let index = this.ruleObj.MainCoverageType.findIndex(x => x == this.InsuranceDataForm.controls.InsMainCvgType.value);
      obj.CustMainPremiRate = this.ruleObj.MainRateToCust[index];
      obj.InscoMainPremiRate = this.ruleObj.MainRateToInsco[index];
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroup(i, obj, ManufYearDiff));
      yearCount -= 12;
    }

  }

  CountTypeLastYear(){
    let ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    let yearCount = this.InsuranceDataForm.controls.InsLength.value;
    let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
    ManufYearDiff += (noOfYear - 1);
    let month: number = 12;
    for (let i = 0; i < noOfYear; i++) {
      let obj = { Tenor: 0, SumInsuredPrcnt: 0, CustMainPremiRate: 0, InscoMainPremiRate: 0 };

      if (yearCount - 12 >= 0) {
        month = 12;
      } else {
        month = yearCount;
      }

      obj.Tenor = month;
      obj.SumInsuredPrcnt = this.ruleObj.SumInsuredPercentage[i];
      let index = this.ruleObj.MainCoverageType.findIndex(x => x == this.InsuranceDataForm.controls.InsMainCvgType.value);
      obj.CustMainPremiRate = this.ruleObj.MainRateToCust[index];
      obj.InscoMainPremiRate = this.ruleObj.MainRateToInsco[index];
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroup(i, obj, ManufYearDiff));
      yearCount -= 12;
    }
  }

  async GenerateMainAndAddCvgTableFromDB(appInsMainCvgObj: Array<AppInsMainCvgObj>) {
    let ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    let loadingFeeCountType: string = await this.GetLoadingFeeCountType();
    if (loadingFeeCountType == CommonConstant.LoadingFeeCountType_LastYear) {
      let noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);
      ManufYearDiff += noOfYear;
    }
    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);
    for (let i = 0; i < appInsMainCvgObj.length; i++) {
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroupFromDB(appInsMainCvgObj[i], ManufYearDiff));
      if (loadingFeeCountType == CommonConstant.LoadingFeeCountType_CountingYear) ManufYearDiff++;
    }
  }

  bindInsAddCvgTypeRuleObj() {
    (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray) = this.fb.array([]);
    this.insAddCvgTypeRuleObj = [{ Key: "", Value: "" }];
    this.groupedAddCvgType = Array.from(new Set(this.ruleObj.AdditionalCoverageType));
    this.groupedAddCvgType.forEach((o) => {
      if (o == CommonConstant.MrAddCvgTypeCodeLoading) {
        let isLoadingExist = this.insAddCvgTypeRuleObj.find(x => x.Key == CommonConstant.MrAddCvgTypeCodeLoading);
        if (!isLoadingExist) {
          let item = this.insAddCvgTypeObj.find(x => x.Key == o);
          this.insAddCvgTypeRuleObj.push(item);
        }
      }
      else {
        let item = this.insAddCvgTypeObj.find(x => x.Key == o);
        this.insAddCvgTypeRuleObj.push(item);
      }
    });
    this.insAddCvgTypeRuleObj.splice(0, 1);
    this.addCheckbox();
  }

  bindInsMainCvgTypeRuleObj() {
    this.insMainCvgTypeRuleObj = [{ Key: "", Value: "" }];
    this.ruleObj.MainCoverageType.forEach((o, i) => {
      if (i == 0) {
        this.defaultInsMainCvgType = o
      }

      let item = this.insMainCvgTypeObj.find(x => x.Key == o);
      this.insMainCvgTypeRuleObj.push(item);
    });
    this.insMainCvgTypeRuleObj.splice(0, 1);
    this.InsuranceDataForm.patchValue({
      InsMainCvgType: this.defaultInsMainCvgType
    });
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

  addGroup(i, obj, ManufYearDiff) {
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
      MrMainCvgTypeCode: this.defaultInsMainCvgType,
      CustMainPremiRate: obj.CustMainPremiRate,
      CustMainPremiAmt: 0,
      InscoMainPremiRate: obj.InscoMainPremiRate,
      InscoMainPremiAmt: 0,
      TotalInscoAddPremiAmt: 0,
      TotalCustAddPremiAmt: 0,
      AppInsAddCvgs: new FormArray([])
    });

    this.insAddCvgTypeRuleObj.forEach((o) => {
      let defaultSumInsuredAmt = 0;
      let index = this.ruleObj.AdditionalCoverageType.findIndex(x => x == o.Key);
      let premiumType = this.ruleObj.PremiumType[index];
      let custAddPremiRate = 0;
      let inscoAddPremiRate = 0;


      if (premiumType == CommonConstant.PremiumTypeAmt) {
        if (this.groupAddCvrSumInsuredDropDown[o.Key]) {
          defaultSumInsuredAmt = this.groupAddCvrSumInsuredDropDown[o.Key][0].SumInsuredAmt;
          custAddPremiRate = this.groupAddCvrSumInsuredDropDown[o.Key][0].PremiToCust;
          inscoAddPremiRate = this.groupAddCvrSumInsuredDropDown[o.Key][0].PremiToInsco;
        } else {
          custAddPremiRate = this.ruleObj.PremiToCust[index];
          inscoAddPremiRate = this.ruleObj.PremiToInsco[index];
        }
      }

      if (premiumType == CommonConstant.PremiumTypePrcnt) {
        custAddPremiRate = this.ruleObj.RateToCust[index];
        inscoAddPremiRate = this.ruleObj.RateToInsco[index];
      }

      // if (o.Key == CommonConstant.MrAddCvgTypeCodeTpl) {
      //   defaultSumInsuredAmt = this.insRateAddCvgRuleTplObjs[0].SumInsuredAmt;
      //   custAddPremiRate = this.insRateAddCvgRuleTplObjs[0].PremiToCust;
      //   inscoAddPremiRate = this.insRateAddCvgRuleTplObjs[0].PremiToInsco;
      // }

      this.AddDictInsCustRate(o.Key, custAddPremiRate);
      let checkboxValue = false;
      if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
        for (let i = 0; i < this.ruleObj["AdditionalCoverageType"].length; i++) {
          if (this.ruleObj["AdditionalCoverageType"][i] == CommonConstant.MrAddCvgTypeCodeLoading) {
            let assetAgeMin = this.ruleObj["AssetAgeFrom"][i] ? parseInt(this.ruleObj["AssetAgeFrom"][i], 10) : 0;
            let assetAgeMax = this.ruleObj["AssetAgeTo"][i] ? parseInt(this.ruleObj["AssetAgeTo"][i], 10) : 0;
            if (ManufYearDiff >= assetAgeMin && ManufYearDiff <= assetAgeMax) {
              checkboxValue = true;
              const control = this.fb.group({
                MrAddCvgTypeCode: o.Key,
                AddCvgTypeName: o.Value,
                Value: checkboxValue,
                SumInsuredPercentage: obj.SumInsuredPercentage,
                SumInsuredAmt: defaultSumInsuredAmt,
                PremiumType: premiumType,
                CustAddPremiRate: custAddPremiRate,
                CustAddPremiAmt: 0,
                BaseCalculation: this.ruleObj.BaseCalc[index],
                InscoAddPremiRate: inscoAddPremiRate,
                InscoAddPremiAmt: 0,
                SeatCount: 0,
              });
              (group.controls.AppInsAddCvgs as FormArray).push(control);
              break;
            }
          }
        }
      }
      else {
        const control = this.fb.group({
          MrAddCvgTypeCode: o.Key,
          AddCvgTypeName: o.Value,
          Value: checkboxValue,
          SumInsuredPercentage: obj.SumInsuredPercentage,
          SumInsuredAmt: defaultSumInsuredAmt,
          PremiumType: premiumType,
          CustAddPremiRate: custAddPremiRate,
          CustAddPremiAmt: 0,
          BaseCalculation: this.ruleObj.BaseCalc[index],
          InscoAddPremiRate: inscoAddPremiRate,
          InscoAddPremiAmt: 0,
          SeatCount: 0,
        });
        (group.controls.AppInsAddCvgs as FormArray).push(control);
      }

      // if (ManufYearDiff <= 5)
      //     checkboxValue = false;
      //   else
      //     checkboxValue = true;
    });
    return group;
  }

  AddDictInsCustRate(MrAddCvgTypeCode: string, rate: number) {
    if (this.DictInsCustRate[MrAddCvgTypeCode] == null || this.DictInsCustRate[MrAddCvgTypeCode] == undefined) this.DictInsCustRate[MrAddCvgTypeCode] = rate;
  }

  addGroupFromDB(insMainCvg: AppInsMainCvgObj, ManufYearDiff) {
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
      CustMainPremiRate: insMainCvg.CustMainPremiRate,
      CustMainPremiAmt: insMainCvg.CustMainPremiAmt,
      InscoMainPremiRate: insMainCvg.InscoMainPremiRate,
      InscoMainPremiAmt: insMainCvg.InscoMainPremiAmt,
      TotalInscoAddPremiAmt: insMainCvg.TotalInscoAddPremiAmt,
      TotalCustAddPremiAmt: insMainCvg.TotalCustAddPremiAmt,
      AppInsAddCvgs: new FormArray([])
    });

    this.insAddCvgTypeRuleObj.forEach((o) => {
      let check;
      if (insMainCvg.AppInsAddCvgObjs == undefined) {
        check = undefined;
      } else {
        check = insMainCvg.AppInsAddCvgObjs.find(x => x.MrAddCvgTypeCode == o.Key);
      }
      let defaultSumInsuredAmt = 0;
      let index = this.ruleObj.AdditionalCoverageType.findIndex(x => x == o.Key);
      let premiumType = this.ruleObj.PremiumType[index];
      let custAddPremiRate = 0;
      let inscoAddPremiRate = 0;

      if (premiumType == CommonConstant.PremiumTypeAmt) {
        this.AddDictInsCustRate(o.Key, this.ruleObj.PremiToCust[index]);
        if(this.groupAddCvrSumInsuredDropDown[o.Key] && check == undefined)
        {
          defaultSumInsuredAmt = this.groupAddCvrSumInsuredDropDown[o.Key][0].SumInsuredAmt;
          custAddPremiRate = this.groupAddCvrSumInsuredDropDown[o.Key][0].PremiToCust;
          inscoAddPremiRate = this.groupAddCvrSumInsuredDropDown[o.Key][0].PremiToInsco;
        }
        else
        {
          custAddPremiRate = check == undefined ? this.ruleObj.PremiToCust[index] : check.CustAddPremiAmt;
          inscoAddPremiRate = check == undefined ? this.ruleObj.PremiToInsco[index] : check.InscoAddPremiAmt;
        }
      }

      if (premiumType == CommonConstant.PremiumTypePrcnt) {
        this.AddDictInsCustRate(o.Key, this.ruleObj.RateToCust[index]);
        custAddPremiRate = check == undefined ? this.ruleObj.RateToCust[index] : check.CustAddPremiRate;
        inscoAddPremiRate = check == undefined ? this.ruleObj.RateToInsco[index] : check.InscoAddPremiRate;
      }

      // if (o.Key == CommonConstant.MrAddCvgTypeCodeTpl) {
      //   defaultSumInsuredAmt = this.insRateAddCvgRuleTplObjs[0].SumInsuredAmt;
      //   this.AddDictInsCustRate(o.Key, this.insRateAddCvgRuleTplObjs[0].PremiToCust);
      //   custAddPremiRate = check == undefined ? this.insRateAddCvgRuleTplObjs[0].PremiToCust : check.CustAddPremiAmt;
      //   inscoAddPremiRate = check == undefined ? this.insRateAddCvgRuleTplObjs[0].PremiToInsco : check.InscoAddPremiAmt;
      // }

      if (o.Key.toString() == CommonConstant.MrAddCvgTypeCodeLoading) {
        if (check) {
          const control = this.fb.group({
            MrAddCvgTypeCode: o.Key,
            AddCvgTypeName: o.Value,
            Value: check == undefined ? false : true,
            SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
            SumInsuredAmt: check == undefined ? defaultSumInsuredAmt : check.SumInsuredAmt,
            PremiumType: premiumType,
            CustAddPremiRate: custAddPremiRate,
            CustAddPremiAmt: check == undefined ? 0 : check.CustAddPremiAmt,
            BaseCalculation: this.ruleObj.BaseCalc[index],
            InscoAddPremiRate: inscoAddPremiRate,
            InscoAddPremiAmt: check == undefined ? 0 : check.InscoAddPremiAmt,
            SeatCount: 0,
          });
          (group.controls.AppInsAddCvgs as FormArray).push(control);
        }
      }
      else {
        // cek Seat Count
        let seatCount = 0;
        if (this.AddCvgNeedSeatCount.includes(o.Key)) {
          if (!this.isUsingSeatCount) this.isUsingSeatCount = true;
          if (check && this.groupAddCvrSumInsuredDropDown[o.Key]) {
            let DdlAddCvgSumInsured = this.groupAddCvrSumInsuredDropDown[o.Key].find(x => x.SumInsuredAmt == check.SumInsuredAmt);
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
          Value: check == undefined ? false : true,
          SumInsuredPercentage: insMainCvg.SumInsuredPrcnt,
          SumInsuredAmt: check == undefined ? defaultSumInsuredAmt : check.SumInsuredAmt,
          PremiumType: premiumType,
          CustAddPremiRate: custAddPremiRate,
          CustAddPremiAmt: check == undefined ? 0 : check.CustAddPremiAmt,
          BaseCalculation: this.ruleObj.BaseCalc[index],
          InscoAddPremiRate: inscoAddPremiRate,
          InscoAddPremiAmt: check == undefined ? 0 : check.InscoAddPremiAmt,
          SeatCount: seatCount
        });
        (group.controls.AppInsAddCvgs as FormArray).push(control);
      }
    });
    return group;
  }

  MainCvgTypeDetailChanged(event, i: number) {
    this.setRate(event.target.value, i);
    this.isCalculate = false;
    this.ResetAddCvgAtIdx(i);
  }

  ResetAddCvgAtIdx(idx: number) {
    let listAppInsMainCvgs = this.InsuranceDataForm.get("AppInsMainCvgs") as FormArray;
    let listAppInsAddCvgs =  listAppInsMainCvgs.at(idx).get("AppInsAddCvgs") as FormArray;
    for (let index = 0; index < listAppInsAddCvgs.value.length; index++) {
      let tempFb = listAppInsAddCvgs.get(index.toString()) as FormGroup;
      const tempMrAddCvgTypeCode: string = tempFb.get("MrAddCvgTypeCode").value;
      tempFb.patchValue({
        CustAddPremiRate: this.DictInsCustRate[tempMrAddCvgTypeCode]
      })
    }
  }

  IsMainCvgChaged(event, i) {
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

  IsAddCvgChanged() {
    this.isCalculate = false;
    this.cekSeatCount();
  }

  setRate(mainCoverageType, i) {
    let index = this.ruleObj.MainCoverageType.findIndex(x => x == mainCoverageType);
    this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
      CustMainPremiRate: this.ruleObj.MainRateToCust[index],
      InscoMainPremiRate: this.ruleObj.MainRateToInsco[index]
    });
  }

  SumInsuredAmtAddCvgChanged(event, i, j) {
    this.isCalculate = false;
    let addInsTypeCode = this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].controls.MrAddCvgTypeCode.value;
    if (this.groupAddCvrSumInsuredDropDown[addInsTypeCode]) {
      let addCvgTplObj = this.groupAddCvrSumInsuredDropDown[addInsTypeCode].find(x => x.SumInsuredAmt == event.target.value);
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j].patchValue({
        CustAddPremiRate: addCvgTplObj.PremiToCust,
        InscoAddPremiRate: addCvgTplObj.PremiToInsco,
        StdAddPremiRate: addCvgTplObj.BaseRate
      });
    }
  }

  ApplyToCoverage() {
    let ManufYearDiff = this.businessDt.getFullYear() - parseInt(this.appCollateralObj.ManufacturingYear);
    for (let i = 0; i < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"].length; i++) {
      this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i].patchValue({
        MrMainCvgTypeCode: this.InsuranceDataForm.controls.InsMainCvgType.value
      });
      this.setRate(this.InsuranceDataForm.controls.InsMainCvgType.value, i);
      this.ResetAddCvgAtIdx(i);
      const formAddCvgChecked = this.InsuranceDataForm.controls.InsAddCvgTypes["controls"].filter(x => x.value.Value == true);

      for (let j = 0; j < this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"].length; j++) {
        let check = formAddCvgChecked.find(x => x.value.Key == this.InsuranceDataForm.controls["AppInsMainCvgs"]["controls"][i]["controls"]["AppInsAddCvgs"]["controls"][j]["controls"].AddCvgTypeName.value);

        if (check != undefined) {
          if (check.value.Key == CommonConstant.AddCvgTypeNameLoading) {
            if (ManufYearDiff <= 5) {
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
      ManufYearDiff++;
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

  InsLengthChanged() {
    this.isGenerate = false;
  }

  EndDt_FocusOut() {
    if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
      this.GetGetCuCoInsLength();
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

    // tenor = tenor - months;
    return months;
  }

  setDateWithoutTimezone(inputDate) {
    let date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);
    let userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
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
  
  setInsLengthDefaultValue(coverPeriod) {
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
      let tenor = this.appObj.Tenor;
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
      let tenor = this.appObj.Tenor;
      if (this.InsuranceDataForm.controls.InsAssetCoveredBy.value == CommonConstant.InsuredByCustomerCompany) {
        tenor = this.setInsLengthTenorCustCompany(tenor);
      }
      this.minInsLength = 1;
      this.maxInsLength = tenor - 1;
      this.InsuranceDataForm.controls.InsLength.enable();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength), Validators.max(this.maxInsLength)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }

    if (coverPeriod == CommonConstant.CoverPeriodOverTenor) {
      this.minInsLength = this.appObj.Tenor + 1;
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
    } else {
      this.InsuranceDataForm.patchValue({
        InscoBranchName: ""
      });
    }
    this.isGenerate = false;
  }

  InsuredByChanged(event) {
    this.setValidator(event.target.value, true);
  }

  setValidator(insuredBy, isNotFromDB: boolean = false) {
    if (insuredBy == CommonConstant.InsuredByOffSystem) {
      this.InsuranceDataForm.patchValue({
        // InsAssetCoveredBy: '',
        InsAssetCoverPeriod: '',
        InscoBranchCode: '',
        InscoBranchName: '',
        CustInscoBranchName: '',
        InsPolicyNo: '',
        InsPolicyName: '',
        CustCoverStartDt: '',
        EndDt: '',
        Notes: '',
        CustNotes: '',
        InsMainCvgType: '',
        InsAddCvgTypes: [],
        InsLength: '',
        InsAssetRegion: '',
        AppInsMainCvgs: [],
        PayPeriodToInsco: '',
        TotalCustMainPremiAmt: 0,
        TotalCustAddPremiAmt: 0,
        TotalInscoMainPremiAmt: 0,
        TotalInscoAddPremiAmt: 0,
        InscoAdminFeeAmt: 0,
        CustAdminFeeAmt: 0,
        CvgAmt: 0,
        CustCvgAmt: 0,
        TotalCustDiscAmt: 0,
        InsCpltzAmt: 0,
        TotalCustFeeAmt: 0,
        TotalInscoFeeAmt: 0
      });
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
      this.InsuranceDataForm.controls.CustStampDutyFeeAmt.clearValidators();
      this.InsuranceDataForm.controls.CustStampDutyFeeAmt.updateValueAndValidity();

      this.InsuranceDataForm.controls.CustAdminFeeAmt.clearValidators();
      this.InsuranceDataForm.controls.CustAdminFeeAmt.updateValueAndValidity();


      let AppInsMainCvgs = this.InsuranceDataForm.get("AppInsMainCvgs") as FormArray;
      AppInsMainCvgs.reset();
      while (AppInsMainCvgs.length !== 0) {
        AppInsMainCvgs.removeAt(0);
      }
    }

    if (insuredBy == CommonConstant.InsuredByCustomer) {
      if(isNotFromDB){
        this.InsuranceDataForm.patchValue({
          CustCvgAmt: this.totalAssetInclAccessoryPriceAmt
        });
      }
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
      if(isNotFromDB){
        this.InsuranceDataForm.patchValue({
          CvgAmt: this.totalAssetInclAccessoryPriceAmt
        });
      }
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
      if(isNotFromDB){
        this.InsuranceDataForm.patchValue({
          CvgAmt: this.totalAssetInclAccessoryPriceAmt,
          CustCvgAmt: this.totalAssetInclAccessoryPriceAmt
        });
      }
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
    }
  }

  async getInsuranceData() {
    let reqObj = { AppId: this.appId, AppAssetId: this.AppAssetId, AppCollateralId: this.AppCollateralId }
    await this.http.post(URLConstant.GetInsDataByAppAssetId, reqObj).toPromise().then(
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
        this.totalAssetInclAccessoryPriceAmt = this.totalAssetPriceAmt
        if (this.appCollateralAccessoryObjs.length > 0) {
          for (let i = 0; i < this.appCollateralAccessoryObjs.length; i++) {
            this.totalAssetInclAccessoryPriceAmt += this.appCollateralAccessoryObjs[i].AccessoryPriceAmt;
          }

        }

        this.InsuranceDataForm.patchValue({
          CvgAmt: this.totalAssetInclAccessoryPriceAmt,
          CustCvgAmt: this.totalAssetInclAccessoryPriceAmt
        });

        if (this.appAssetObj != undefined) {
          this.AppAssetId = this.appCollateralObj.AppAssetId;
        }
        if (this.appCollateralObj != undefined) {
          this.AppCollateralId = this.appCollateralObj.AppCollateralId;
        }
        if (this.appInsObjObj != undefined) {
          this.appInsObjId = this.appInsObjObj.AppInsObjId;
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
          CustAdminFeeAmt: this.appInsObjObj.CustAdminFeeAmt,
          CustStampDutyFeeAmt: this.appInsObjObj.CustStampDutyFee,
          InscoStampDutyFeeAmt: this.appInsObjObj.InscoStampDutyFee,
          TotalCustFeeAmt: this.appInsObjObj.CustAdminFeeAmt + this.appInsObjObj.CustStampDutyFee,
          TotalInscoFeeAmt: this.appInsObjObj.InscoAdminFeeAmt + this.appInsObjObj.InscoStampDutyFee,
          CvgAmt: this.appInsObjObj.CvgAmt,
          TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt,
          PayPeriodToInsco: this.appInsObjObj.PayPeriodToInsco
        });
        this.setInsLengthValidator(this.appInsObjObj.InsAssetCoverPeriod);
        await this.GenerateInsurance(this.appInsMainCvgObj);
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
          CustAdminFeeAmt: this.appInsObjObj.CustAdminFeeAmt,
          CustStampDutyFeeAmt: this.appInsObjObj.CustStampDutyFee,
          InscoStampDutyFeeAmt: this.appInsObjObj.InscoStampDutyFee,
          TotalCustFeeAmt: this.appInsObjObj.CustAdminFeeAmt + this.appInsObjObj.CustStampDutyFee,
          TotalInscoFeeAmt: this.appInsObjObj.InscoAdminFeeAmt + this.appInsObjObj.InscoStampDutyFee,
          CustInscoBranchName: this.appInsObjObj.CustInscoBranchName,
          InsPolicyNo: this.appInsObjObj.InsPolicyNo,
          InsPolicyName: this.appInsObjObj.InsPolicyName,
          CustCoverStartDt: formatDate(this.appInsObjObj.CustCoverStartDt, 'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.appInsObjObj.StartDt, 'yyyy-MM-dd', 'en-US'),
          CustNotes: this.appInsObjObj.CustNotes,
          CustCvgAmt: this.appInsObjObj.CustCvgAmt,
          CvgAmt: this.appInsObjObj.CvgAmt,
          TotalCustDiscAmt: this.appInsObjObj.TotalCustDiscAmt,
          PayPeriodToInsco: this.appInsObjObj.PayPeriodToInsco
        });
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

  bindInsuredByObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsuredBy };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.insuredByObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  bindPaidByObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsPaidBy };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.paidByObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async bindInsMainCvgTypeObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsMainCvgType };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insMainCvgTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async bindInsAddCvgTypeObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsAddCvgType };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        console.log(response);
        this.insAddCvgTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  addCheckbox() {
    this.insAddCvgTypeRuleObj.forEach((o) => {

      let checkboxValue;
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

  bindInsAssetCoverPeriodObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInsCoverPeriod };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.insAssetCoverPeriodObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  bindInsAssetRegionObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetInsRegion };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.insAssetRegionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  bindInscoBranchObj() {
    let ReqInscoBranchObj: ReqGetVendorByCategoryCodeAndOfficeCodeObj = new ReqGetVendorByCategoryCodeAndOfficeCodeObj();
    ReqInscoBranchObj.MrVendorCategory = CommonConstant.VendorCategoryAssetInscoBranch;
    ReqInscoBranchObj.OfficeCode = this.appObj.OriOfficeCode;
    this.http.post(URLConstant.GetListKeyValueActiveVendorByCategoryCodeAndOfficeCode, ReqInscoBranchObj).subscribe(
      (response) => {
        this.inscoBranchObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  bindPayPeriodToInscoObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodePayPeriodToInsco };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.payPeriodToInscoObj = response[CommonConstant.ReturnObj];
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

  IsFullCapitalizedAmount() {
    if (this.InsuranceDataForm["controls"]["IsFullCapitalizedAmount"].value == true && !this.isYearlyCapitalized) {
      this.InsuranceDataForm.patchValue({
        InsCpltzAmt: this.InsuranceDataForm["controls"]["TotalCustMainPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustAddPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustFeeAmt"].value - this.InsuranceDataForm["controls"]["TotalCustDiscAmt"].value
      });
      this.InsuranceDataForm["controls"]["InsCpltzAmt"].disable();
    } else {
      this.InsuranceDataForm["controls"]["InsCpltzAmt"].enable();
    }
  }

  BindCapitalize() {
    if (this.InsuranceDataForm["controls"]["IsFullCapitalizedAmount"].value == true && !this.isYearlyCapitalized) {
      this.InsuranceDataForm.patchValue({
        InsCpltzAmt: this.InsuranceDataForm["controls"]["TotalCustMainPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustAddPremiAmt"].value + this.InsuranceDataForm["controls"]["TotalCustFeeAmt"].value - this.InsuranceDataForm["controls"]["TotalCustDiscAmt"].value
      });
    }
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
  // End Insurance Method
}