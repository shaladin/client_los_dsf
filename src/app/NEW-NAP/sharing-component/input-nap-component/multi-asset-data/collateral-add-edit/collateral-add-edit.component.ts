import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, NgForm, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { environment } from 'environments/environment';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { AppCollateralAttrObj } from 'app/shared/model/app-collateral-attr-obj.model';
import { AppCollateralDataObj } from 'app/shared/model/app-collateral-data-obj.model';
import { AssetTypeObj } from 'app/shared/model/asset-type-obj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/app-collateral-registration-obj.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupTaxCityIssuerComponent } from './lookup-tax-city-issuer/lookup-tax-city-issuer.component';
import { LookupCollateralComponent } from './lookup-collateral/lookup-collateral.component';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { AppAssetAttrCustomObj } from 'app/shared/model/app-asset/app-asset-attr-custom.model';
import { AppCollateralAttrCustomObj } from 'app/shared/model/app-collateral-attr-custom.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CustomPatternObj } from 'app/shared/model/library/custom-pattern-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { AssetTypeSerialNoLabelCustomObj } from 'app/shared/model/asset-type-serial-no-label-custom-obj.model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/app-cust-personal-job-data-obj.model';
import { ResponseJobDataPersonalObj } from 'app/shared/model/response-job-data-personal-obj.model';
import { formatDate } from '@angular/common';
import { ListAppCollateralDocObj } from 'app/shared/model/list-app-collateral-doc-obj.model';
import { AppCollateralDocObj } from 'app/shared/model/app-collateral-doc-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppCustCompanyObj } from 'app/shared/model/app-cust-company-obj.model';
import { RefAttrSettingObj } from 'app/shared/model/ref-attr-setting-obj.model';
import { UcAttributeComponent } from '@adins/uc-attribute';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';

@Component({
  selector: 'app-collateral-add-edit',
  templateUrl: './collateral-add-edit.component.html'
})
export class CollateralAddEditComponent implements OnInit {
  @Input() AppId: number;
  @Input() mode: string = CommonConstant.ModeAddColl;
  @Input() AppCollateralId: number;
  @Input() showCancel: boolean = true;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() collValue: EventEmitter<object> = new EventEmitter();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;

  isAssetAttrReady: boolean = false;
  AppCollateralAttrObjs: Array<AppCollateralAttrCustomObj>;
  AppAssetAttrObj: any;
  LobCode: any;
  custNo: string;
  branchObj: any;
  listBranchObj: any;
  InputLookupSupplierObj: any;
  inputLookupCollNameObj: any;
  inputFieldLegalObj: any;
  inputFieldLocationObj: any;
  inputLookupObj: any;
  collateral: string = "New";
  inputObj: any;
  arrCrit: any[];
  checkboxAll = false;
  listCollateralData: any;
  listSelectedId: Array<number> = new Array<number>();
  tempListId: any;
  orderByKey: any;
  orderByValue: any;
  pageNow: number;
  pageSize: number;
  apiUrl: any;
  totalData: any;
  resultData: any;
  tempData: any;
  arrAddCrit: any[];
  viewObj: any;
  Data = [];
  appCollateralObj: AppCollateralObj;
  returnAppCollateralObj: any;
  idTypeCode: any;
  ListAttrAnswer = [];
  tempIdType: any;
  appCustAddrObj: any;
  returnAppCustAddrObj: any;
  locationAddrObj: any;
  inputFieldLocationAddrObj: any;
  AppCustAddrObj: any;
  InputLookupCityIssuerObj: any;
  collOwnerObj: any;
  returnCollOwnerObj: any;
  collOwnerAddrObj: any;
  collLocationAddrObj: any;
  inputFieldCollOwnerObj: any;
  ownerRelationshipObj: any;
  returnOwnerRelationshipObj: any;
  appCollateralDataObj: AppCollateralDataObj;
  listAppCollateralDocObj: ListAppCollateralDocObj = new ListAppCollateralDocObj();
  appCollateralDoc: AppCollateralDocObj = new AppCollateralDocObj();
  assetRegionObj: any;
  returnAssetRegionObj: any;
  assetRegionAttrObj: AppCollateralAttrObj;
  colorAttrObj: AppCollateralAttrObj;
  categoryAttrObj: AppCollateralAttrObj;
  transmitionAttrObj: AppCollateralAttrObj;
  bpkbCityIssuerAttrObj: AppCollateralAttrObj;
  bpkbIssueDateAttrObj: AppCollateralAttrObj;
  collTypeObj: any;
  returnCollTypeObj: any;
  assetCategoryObj: any;
  returnAssetCategoryObj: any;
  reqAssetMasterObj: any;
  resAssetMasterObj: any;
  appCollateralRegistObj: any;
  returnAppCollateralRegistObj: any;
  businessDt: Date;
  isSerialReady: boolean = false;
  IsDisable: boolean = false;

  appAssetAttrObjs: Array<AppAssetAttrCustomObj>;
  AppCustObj: AppCustObj;
  SerialNoRegex: string;
  ListPattern: Array<CustomPatternObj> = new Array<CustomPatternObj>();

  // @ViewChild("CollateralModal", { read: ViewContainerRef }) collateralModal: ViewContainerRef;
  @ViewChild("CityIssuerModal", { read: ViewContainerRef }) cityIssuerModal: ViewContainerRef;
  @ViewChild("enjiForm") enjiForm: NgForm;
  private ucAttrComp: UcAttributeComponent;
  @ViewChild('ucAttrComp') set content(content: UcAttributeComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucAttrComp = content;
    }
  }
  items: FormArray;
  SerialNoList: Array<AssetTypeSerialNoLabelCustomObj>;

  isDiffWithRefAttr: any;
  AddCollForm = this.fb.group({
    Collateral: ['New'],
    AssetTypeCode: [''],
    CollateralSeqNo: [1],
    CollateralName: ['', [Validators.required]],
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    MrCollateralConditionCode: ['', Validators.required],
    MrCollateralUsageCode: ['', Validators.required],
    AssetTaxDt: [''],

    AppCollateralAttrObjs: this.fb.array([]),


    FullAssetCode: ['', [Validators.required]],
    FullAssetName: ['', [Validators.required]],
    AssetCategoryCode: [''],
    CollateralValueAmt: [0, [Validators.required, Validators.min(1)]],
    Notes: [''],

    SelfOwner: [false],
    OwnerName: [''],
    MrIdTypeCode: [''],
    OwnerRelationship: [''],
    OwnerIdNo: [''],
    CollateralOwnerAddr: [''],
    OwnerMobilePhn: [''],
    OwnerProfessionCode: [''],
    MrOwnerTypeCode: [''],

    CopyFromLegal: [''],

    LocationAddrType: [''],

    CollPercentage: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
    CollateralPortionAmt: [0],
    OutstandingCollPrcnt: [0],
    items: this.fb.array([]),
    ListDoc: this.fb.array([])
  });
  inputAddressObjForColl: any;
  inputAddressObjForLoc: any;
  appAssetId: number;
  AppCollateralAttrObj: any;
  AppCustPersonalJobData: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();
  CollConditionList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CollUsageList: Array<KeyValueObj> = new Array<KeyValueObj>();
  inputLookupExistColl: InputLookupObj = new InputLookupObj();
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;
  existingSelected: boolean = false;
  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  isReturnHandlingSave: boolean = false;
  ReturnHandlingHId: number = 0;
  WfTaskListId;
  isParamReady: boolean = false;  
  OwnerTypeObj: Array<KeyValueObj>;
  OwnerProfessionObj: Array<KeyValueObj> = new Array();
  custType: string;
  AppCustCoyObj: AppCustCompanyObj;
  listCollTypeMandatoryManufacturingYear: Array<string> = new Array<string>();
  isMandatoryManufacturingYear: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private modalService: NgbModal, private cookieService: CookieService, public formValidate: FormValidateService) {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;

    this.route.queryParams.subscribe(params => {
      if (params["AppCollateralId"] != null) {
        this.AppCollateralId = params["AppCollateralId"];
      }
      if (params["Mode"] != null) {
        this.mode = params["Mode"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["LobCode"] != null) {
        this.LobCode = params["LobCode"];
      }
      if (params["WfTaskListId"] != null) {
        this.WfTaskListId = params["WfTaskListId"];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
        this.isReturnHandlingSave = true;
      }
      this.isParamReady=true;
    });
  }

  isReadyAttrSetting: boolean = false;
  attrSettingObj: RefAttrSettingObj = new RefAttrSettingObj();
  identifierAppCollAttr: string = "appCollateralAttrTestObjs";
  SetRefAttrSettingObj() {
    let GenObj =
    {
      AppCollateralId: this.AppCollateralId,
      AssetTypeCode: this.AddCollForm.get("AssetTypeCode").value,
      AttrTypeCode: CommonConstant.AttrTypeCodeTrx,
      IsRefresh: false
    };
    this.attrSettingObj.ReqGetListAttrObj = GenObj;
    this.attrSettingObj.Title = "Collateral Attribute";
    this.attrSettingObj.UrlGetListAttr = URLConstant.GenerateAppCollateralAttrV2;
    this.isReadyAttrSetting = true;
  }
  back() {
    if (this.isReturnHandlingSave) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_EDIT], { AppId: this.AppId, ReturnHandlingHId: this.ReturnHandlingHId, WfTaskListId: this.WfTaskListId });
      return;
    }
    this.collValue.emit({ mode: 'paging' });
  }

  SetBpkbCity(event) {
    this.AddCollForm.patchValue({
      TaxCityIssuer: event.DistrictCode,
    });
  }

  getLookupCollateralName(event) {
    this.AddCollForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode
    });
  }

  getRefAssetDocList(isInit: boolean) {
    this.http.post(URLConstant.GetRefAssetDocList, { Code: this.AddCollForm.get("AssetTypeCode").value }).subscribe(
      (response) => {
        let ListDoc = this.AddCollForm.get('ListDoc') as FormArray;
        ListDoc.reset();
        while(ListDoc.length){
          ListDoc.removeAt(0);
        } 
        if (response[CommonConstant.ReturnObj].length > 0) {
          for (let i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
            let assetDocumentDetail = this.fb.group({
              DocCode: response[CommonConstant.ReturnObj][i].AssetDocCode,
              AssetDocName: response[CommonConstant.ReturnObj][i].AssetDocName,
              IsValueNeeded: response[CommonConstant.ReturnObj][i].IsValueNeeded,
              IsMandatoryNew: response[CommonConstant.ReturnObj][i].IsMandatoryNew,
              IsMandatoryUsed: response[CommonConstant.ReturnObj][i].IsMandatoryUsed,
              IsReceived: response[CommonConstant.ReturnObj][i].IsReceived,
              DocNo: response[CommonConstant.ReturnObj][i].DocNo,
              ACDExpiredDt: response[CommonConstant.ReturnObj][i].ACDExpiredDt,
              DocNotes: response[CommonConstant.ReturnObj][i].DocNotes,
              RowVersion: "",
            }) as FormGroup;
            ListDoc.push(assetDocumentDetail);
          }
        }
        if(isInit){
          this.setAppCollateralDoc(this.appCollateralObj.AppCollateralId);
        }
      });
  }

  setAppCollateralDoc(AppCollateralId: number = 0) {
    this.http.post(URLConstant.GetListAppCollateralDocsByAppCollateralId, { Id: AppCollateralId }).subscribe(
      (response) => {
        let AppCollateralDocs = new Array();
        AppCollateralDocs = response["AppCollateralDocs"];
        if (AppCollateralDocs["length"] > 0) {
          for (let i = 0; i < this.AddCollForm.controls.ListDoc["controls"].length; i++) {
            let AppCollatralDocId = AppCollateralDocs.findIndex(x => x.DocCode == this.AddCollForm.controls.ListDoc["controls"][i]["controls"].DocCode.value);

            this.AddCollForm.controls.ListDoc["controls"][i].patchValue({
              DocNo: AppCollateralDocs[AppCollatralDocId].DocNo,
              DocNotes: AppCollateralDocs[AppCollatralDocId].DocNotes,
              ACDExpiredDt: AppCollateralDocs[AppCollatralDocId].ExpiredDt == null ? "" : formatDate(AppCollateralDocs[AppCollatralDocId].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
              IsReceived: AppCollateralDocs[AppCollatralDocId].IsReceived,
              RowVersion: AppCollateralDocs[AppCollatralDocId].RowVersion,
            })
          }
        }
      });
  }

  async GetAppCust() {
    let reqById: GenericObj = new GenericObj();
    reqById.Id = this.AppId;
    await this.http.post<AppCustObj>(URLConstant.GetAppCustByAppId, reqById).toPromise().then(
      async (response) => {
        this.AppCustObj = response;
        this.custNo = this.AppCustObj.CustNo;
        this.custType = this.AppCustObj.MrCustTypeCode;
        if(this.mode != CommonConstant.ModeEditColl) await this.OwnerTypeChange(this.AppCustObj.MrCustTypeCode, true);
      }
    );
  }

  async GetAppCustPersonalJobData() {
    await this.http.post<ResponseJobDataPersonalObj>(URLConstant.GetAppCustPersonalJobData, { Id: this.AppCustObj.AppCustId }).toPromise().then(
      (response) => {
        if(response.AppCustPersonalJobDataObj != null){
          this.AppCustPersonalJobData = response.AppCustPersonalJobDataObj;
        }
      }
    );
  }

  async bindDDLFromRefMaster(){
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetCondition }).toPromise().then(
      (response) => {
        this.CollConditionList = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({
          MrCollateralConditionCode: this.CollConditionList[1].Key
        });
        this.AddCollForm.controls.MrCollateralConditionCode.disable();
      }
    );

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetUsage }).toPromise().then(
      (response) => {
        this.CollUsageList = response[CommonConstant.ReturnObj];
        if (this.mode != CommonConstant.ModeEditColl) {
          this.AddCollForm.patchValue({
            MrCollateralUsageCode: this.CollUsageList[1].Key
          });
        }
        this.AddCollForm.controls.MrCollateralUsageCode.disable();
      }
    );
    
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode : CommonConstant.RefMasterTypeCodeCustType}).toPromise().then(
      (response) => {
        this.OwnerTypeObj = response[CommonConstant.ReturnObj];
        if(this.mode == CommonConstant.ModeAddColl){
          this.AddCollForm.patchValue({
            MrOwnerTypeCode : this.custType
          });
        }
      }
    );
    
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode : CommonConstant.RefMasterTypeCodeCompanyType}).toPromise().then(
      (response) => {    
        this.OwnerProfessionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  showModalCollateral() {
    const modalCollateral = this.modalService.open(LookupCollateralComponent);
    modalCollateral.componentInstance.AssetTypeCode = this.AddCollForm.controls["AssetTypeCode"].value;
    modalCollateral.result.then(
      (response) => {
        this.AddCollForm.patchValue({
          FullAssetCode: response.FullAssetCode,
          FullAssetName: response.FullAssetName,
          AssetCategoryCode: response.AssetCategoryCode,
          CollateralName: response.FullAssetName
        });
        this.collateralPortionHandler();
      }
    ).catch(() => {
    });
  }

  clearForm(isOnInit: boolean = false){
    this.AddCollForm.patchValue({
      CollateralSeqNo: 1,
      CollateralName: '',
      ManufacturingYear: '',
      AssetTaxDt: '',
      FullAssetCode: '',
      FullAssetName: '',
      AssetCategoryCode: '',
      CollateralValueAmt: '',
      Notes: '',
      SelfOwner: false,
      OwnerName: '',
      OwnerIdNo: '',
      OwnerMobilePhn: '',
      OwnerProfessionCode: '',
      CopyFromLegal: '',
      CollPercentage: 0,
      CollateralPortionAmt: 0,
      OutstandingCollPrcnt: 0
    });

    this.collateralTypeHandler(false);
    this.enabledForm();
    this.bindDDLFromRefMaster();
    this.SetInputLookupCollExisting();

    if(!isOnInit){
      this.inputLookupExistColl.nameSelect = "";
      this.inputLookupExistColl.jsonSelect = "";
    }

    this.locationAddrObj = new AppCustAddrObj();
    this.inputFieldLocationObj = new InputFieldObj();
    this.inputFieldLocationObj.inputLookupObj = new InputLookupObj();
    this.inputAddressObjForLoc.default = this.locationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;

    this.collOwnerAddrObj = new AppCustAddrObj();
    this.inputFieldCollOwnerObj = new InputFieldObj();
    this.inputFieldCollOwnerObj.inputLookupObj = new InputLookupObj();
    this.inputAddressObjForColl.default = this.collOwnerAddrObj;
    this.inputAddressObjForColl.inputField = this.inputFieldCollOwnerObj;

    this.InputLookupProfessionObj.nameSelect = "";
    this.InputLookupProfessionObj.jsonSelect = "";
    this.InputLookupProfessionObj.isDisable = false;
  }

  CollChange(isOnInit: boolean = false) {
    this.clearForm(isOnInit);
    this.collateral = this.AddCollForm.controls["Collateral"].value;
    this.IsDisable = false;

    if (this.collateral == 'Exist') {
      this.inputLookupExistColl.isRequired = true;
      this.IsDisable = true;

      this.criteriaList = new Array();
      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = 'CU.CUST_NO';
      if (this.custNo) {
        this.criteriaObj.value = this.custNo;
        this.criteriaList.push(this.criteriaObj);
        this.inputLookupExistColl.addCritInput = this.criteriaList;
      }

      this.inputLookupExistColl.addCritInput = this.criteriaList;
      this.inputLookupExistColl.isReady = true;
    }

  }

  SetInputLookupCollExisting() {
    this.inputLookupExistColl = new InputLookupObj();
    this.inputLookupExistColl.urlJson = "./assets/uclookup/NAP/lookupAppCollateralCFNA.json";
    this.inputLookupExistColl.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupExistColl.pagingJson = "./assets/uclookup/NAP/lookupAppCollateralCFNA.json";
    this.inputLookupExistColl.genericJson = "./assets/uclookup/NAP/lookupAppCollateralCFNA.json";
    this.inputLookupExistColl.isRequired = false;
  }

  getExistingColl(event) {
    this.existingSelected = true;
    this.getExistingCollData(event);
  }

  async getExistingCollData(fouExistObj: object){
    this.AddCollForm.patchValue({
      AssetTypeCode: fouExistObj["AssetTypeCode"],
      FullAssetCode: fouExistObj["FullAssetCode"],
      FullAssetName: fouExistObj["FullAssetName"],
      CollateralName: fouExistObj["FullAssetName"],
      AssetCategoryCode: fouExistObj["AssetCategoryCode"],
      MrCollateralConditionCode: fouExistObj["MrCollateralConditionCode"],
      MrCollateralUsageCode: fouExistObj["MrCollateralUsageCode"],
      CollateralValueAmt: fouExistObj["CollateralPriceAmt"],
      Notes: fouExistObj["Notes"],
      AssetTaxDt: fouExistObj["AssetTaxDate"] ? formatDate(fouExistObj["AssetTaxDate"], 'yyyy-MM-dd', 'en-US') : "",
      ManufacturingYear: "2020",
      OwnerName: fouExistObj["OwnerName"],
      OwnerIdNo: fouExistObj["OwnerIdNo"],
      MrIdTypeCode: fouExistObj["MrIdTypeCode"],
      OwnerMobilePhn: fouExistObj["OwnerMobilePhnNo"],
      MrOwnerRelationshipCode: fouExistObj["MrOwnerRelationshipCode"],
      UserName: fouExistObj["Username"],
      OwnerRelationship: fouExistObj["MrUserRelationshipCode"],
      SelfOwner: fouExistObj["MrOwnerRelationshipCode"] == "SELF" ? true : false,
      CollPercentage: 0,
      CollateralPortionAmt: 0,
      OutstandingCollPrcnt: 0,
      MrOwnerTypeCode: fouExistObj["MrOwnerTypeCode"],
    });

    await this.collateralTypeHandler(true);

    for (var i = 0; i < this.items.controls.length; i++) {
      var formGroupItem = this.items.controls[i] as FormGroup;
      formGroupItem.patchValue({
        SerialNoValue: fouExistObj["SerialNo" + (i + 1)]
      });
    }

    this.CopyUserForSelfOwner();

    // set data Location Address
    this.locationAddrObj = new AppCustAddrObj();
    this.locationAddrObj.Addr = fouExistObj["LocationAddr"];
    this.locationAddrObj.AreaCode1 = fouExistObj["LocationAreaCode1"];
    this.locationAddrObj.AreaCode2 = fouExistObj["LocationAreaCode2"];
    this.locationAddrObj.AreaCode3 = fouExistObj["LocationAreaCode3"];
    this.locationAddrObj.AreaCode4 = fouExistObj["LocationAreaCode4"];
    this.locationAddrObj.City = fouExistObj["LocationCity"];
    this.inputFieldLocationObj.inputLookupObj.nameSelect = fouExistObj["LocationZipcode"];
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: fouExistObj["LocationZipcode"] };
    this.inputAddressObjForLoc.default = this.locationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;
    // // set data Owner Address
    this.collOwnerAddrObj = new AppCustAddrObj();
    this.collOwnerAddrObj.Addr = fouExistObj["OwnerAddr"];
    this.collOwnerAddrObj.AreaCode1 = fouExistObj["OwnerAreaCode1"];
    this.collOwnerAddrObj.AreaCode2 = fouExistObj["OwnerAreaCode2"];
    this.collOwnerAddrObj.AreaCode3 = fouExistObj["OwnerAreaCode3"];
    this.collOwnerAddrObj.AreaCode4 = fouExistObj["OwnerAreaCode4"];
    this.collOwnerAddrObj.City = fouExistObj["OwnerCity"];

    this.inputFieldCollOwnerObj = new InputFieldObj();
    this.inputFieldCollOwnerObj.inputLookupObj = new InputLookupObj();
    this.inputFieldCollOwnerObj.inputLookupObj.nameSelect = fouExistObj["OwnerZipcode"];
    this.inputFieldCollOwnerObj.inputLookupObj.jsonSelect = { Zipcode: fouExistObj["OwnerZipcode"] };
    this.inputAddressObjForColl.default = this.collOwnerAddrObj;
    this.inputAddressObjForColl.inputField = this.inputFieldCollOwnerObj;

    this.disabledForm();
    this.getRefAssetDocList(false);
    this.AddCollForm.patchValue({
      CollateralStat: CommonConstant.AssetStatExisting
    });
  }

  disabledForm(isOnInit: boolean = false){
    this.AddCollForm.controls.AssetTypeCode.disable();
    this.AddCollForm.controls.ManufacturingYear.disable();
    this.AddCollForm.controls.CollateralValueAmt.disable();
    this.AddCollForm.controls.AssetTaxDt.disable();
    this.AddCollForm.controls.Notes.disable();
    this.AddCollForm.controls.AssetTaxDt.disable();
    this.AddCollForm.controls.OwnerRelationship.disable();
    this.AddCollForm.controls.OwnerName.disable();
    this.AddCollForm.controls.SelfOwner.disable();
    this.AddCollForm.controls.OwnerMobilePhn.disable();
    this.AddCollForm.controls.OwnerIdNo.disable();
    this.AddCollForm.controls.MrIdTypeCode.disable();
    this.inputAddressObjForColl.isReadonly = true;
    this.inputAddressObjForLoc.isReadonly = true;

    for(let i = 0; i < this.AddCollForm.controls.items["controls"].length; i++){
      let formGroupItem = this.AddCollForm.controls.items["controls"][i] as FormGroup;
      formGroupItem["controls"]["SerialNoValue"].disable();
    }

    for(let i = 0; i < this.AddCollForm.controls.AppCollateralAttrObjs["controls"].length; i++){
      let formGroupItem = this.AddCollForm.controls.AppCollateralAttrObjs["controls"][i] as FormGroup;
      formGroupItem["controls"]["AttrValue"].disable();
    }

    for(let i = 0; i < this.AddCollForm.controls.ListDoc["controls"].length; i++){
      let formGroupItem = this.AddCollForm.controls.ListDoc["controls"][i] as FormGroup;
      formGroupItem["controls"]["IsReceived"].disable();
      formGroupItem["controls"]["DocNo"].disable();
      formGroupItem["controls"]["ACDExpiredDt"].disable();
      formGroupItem["controls"]["DocNotes"].disable();
    }
  }

  enabledForm(){
    this.AddCollForm.controls.AssetTypeCode.enable();
    this.AddCollForm.controls.ManufacturingYear.enable();
    this.AddCollForm.controls.CollateralValueAmt.enable();
    this.AddCollForm.controls.AssetTaxDt.enable();
    this.AddCollForm.controls.Notes.enable();
    this.AddCollForm.controls.AssetTaxDt.enable();
    this.AddCollForm.controls.OwnerRelationship.enable();
    this.AddCollForm.controls.OwnerName.enable();
    this.AddCollForm.controls.SelfOwner.enable();
    this.AddCollForm.controls.OwnerMobilePhn.enable();
    this.AddCollForm.controls.OwnerIdNo.enable();
    this.AddCollForm.controls.MrIdTypeCode.enable();
    this.inputAddressObjForColl.isReadonly = false;
    this.inputAddressObjForLoc.isReadonly = false;
    this.AddCollForm.controls.collOwnerAddress.enable();
  }

  async collateralTypeHandler(isOnInit: boolean = false) {
    this.inputLookupObj.isReady = false;
    var criteriaList = new Array<CriteriaObj>();
    var criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionEq;
    criteriaObj.propName = 'B.ASSET_TYPE_CODE';
    criteriaObj.value = this.AddCollForm.controls["AssetTypeCode"].value;
    criteriaList.push(criteriaObj);
    this.inputLookupObj.addCritInput = criteriaList;
    this.inputLookupObj.isReady = true;
    if(!isOnInit){
      this.AddCollForm.patchValue({
        FullAssetCode: "",
        FullAssetName: "",
        AssetCategoryCode: "",
        CollateralName: ""
      });
    }

    await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
      Code: this.AddCollForm.controls["AssetTypeCode"].value
    }).toPromise().then(
      (response: any) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }

        this.SerialNoList = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.SerialNoList.length; i++) {
          let eachDataDetail = this.fb.group({
            SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
            SerialNoValue: ['', [Validators.pattern(this.SerialNoRegex)]],
            IsMandatory: [this.SerialNoList[i].IsMandatory]
          }) as FormGroup;
          this.items.push(eachDataDetail);
        }

        for (let i = 0; i < this.items.length; i++) {
          if (this.items.controls[i]['controls']['IsMandatory'].value == true) {
            this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required, Validators.pattern(this.SerialNoRegex)]);
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }

        if (this.returnAppCollateralObj != undefined || this.returnAppCollateralObj != null) {
          for (let i = 0; i < this.items.length; i++) {
            if (this.items.controls[i] != null) {
              this.items.controls[i]['controls']['SerialNoValue'].value = this.returnAppCollateralObj["SerialNo" + (i + 1)];
            }
          }
        }
        let listDocExisting = this.AddCollForm.get('ListDoc') as FormArray;
        listDocExisting.reset();
        while(listDocExisting.length !== 0){
          listDocExisting.removeAt(0);
        }
        this.getRefAssetDocList(isOnInit);
        this.collateralPortionHandler();
      });

    await this.GenerateAppCollateralAttr(false);
    // let GenObj =
    // {
    //   AppCollateralId: this.AppCollateralId,
    //   AssetTypeCode: this.AddCollForm.get("AssetTypeCode").value,
    //   AttrTypeCode: CommonConstant.AttrTypeCodeTrx,
    //   IsRefresh: false
    // };
    // this.attrSettingObj.GetQuestionReqObj = GenObj;
    // this.ucAttrComp.GetListAttribute();
    await this.CheckManufacturingYearMandatory();
  }


  GetListAddr() {
    this.http.post(URLConstant.GetListAppCustAddrByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({
          LocationAddrType: response[CommonConstant.ReturnObj][0]['AppCustAddrId'],
          CollateralOwnerAddr: response[CommonConstant.ReturnObj][0]['AppCustAddrId']
        });
      }
    );
  }

  CopyUserForSelfOwner() {
    if (this.AddCollForm.controls.SelfOwner.value == true) {
      this.AppCustObj = new AppCustObj();
      this.collOwnerAddrObj = new AppCustAddrObj();

      var appObj = { "Id": this.AppId };
      this.http.post(URLConstant.GetCustDataByAppId, appObj).subscribe(
        async response => {
          this.AppCustObj = response['AppCustObj'];
          this.returnCollOwnerObj = response['AppCustAddrLegalObj'];

          this.AddCollForm.patchValue({
            OwnerName: this.AppCustObj.CustName,
            OwnerRelationship: "SELF",
            MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
            OwnerIdNo: this.AppCustObj.IdNo,
            OwnerMobilePhn: typeof (response['AppCustPersonalObj']) != 'undefined' ? response['AppCustPersonalObj']['MobilePhnNo1'] : '',
            OwnerProfessionCode: this.custType == CommonConstant.CustTypePersonal ? this.AppCustPersonalJobData.MrProfessionCode : this.AppCustCoyObj.MrCompanyTypeCode,
            MrOwnerTypeCode : this.custType
          });

          this.collOwnerAddrObj = new AppCustAddrObj();
          this.collOwnerAddrObj.Addr = this.returnCollOwnerObj.Addr;
          this.collOwnerAddrObj.AreaCode3 = this.returnCollOwnerObj.AreaCode3;
          this.collOwnerAddrObj.AreaCode4 = this.returnCollOwnerObj.AreaCode4;
          this.collOwnerAddrObj.AreaCode1 = this.returnCollOwnerObj.AreaCode1;
          this.collOwnerAddrObj.AreaCode2 = this.returnCollOwnerObj.AreaCode2;
          this.collOwnerAddrObj.City = this.returnCollOwnerObj.City;

          this.inputFieldCollOwnerObj = new InputFieldObj();
          this.inputFieldCollOwnerObj.inputLookupObj = new InputLookupObj();
          this.inputFieldCollOwnerObj.inputLookupObj.nameSelect = this.returnCollOwnerObj.Zipcode;
          this.inputFieldCollOwnerObj.inputLookupObj.jsonSelect = { Zipcode: this.returnCollOwnerObj.Zipcode };
          this.inputAddressObjForColl.default = this.collOwnerAddrObj;
          this.inputAddressObjForColl.inputField = this.inputFieldCollOwnerObj;

          this.InputLookupProfessionObj.nameSelect = this.AppCustPersonalJobData.MrProfessionName;
          this.InputLookupProfessionObj.jsonSelect = { ProfessionName: this.AppCustPersonalJobData.MrProfessionName };
          this.InputLookupProfessionObj.isDisable = true;
          
          this.AddCollForm.controls.OwnerName.disable();
          this.AddCollForm.controls.OwnerRelationship.disable();
          this.AddCollForm.controls.OwnerMobilePhn.disable();
          this.AddCollForm.controls.MrIdTypeCode.disable();
          this.AddCollForm.controls.OwnerIdNo.disable();
          this.AddCollForm.controls.collOwnerAddress.disable();
          this.AddCollForm.controls.OwnerProfessionCode.disable();
          this.AddCollForm.controls.MrOwnerTypeCode.disable();
        }
      )
    }else {
      this.AddCollForm.controls.OwnerName.enable();
      this.AddCollForm.controls.OwnerRelationship.enable();
      this.AddCollForm.controls.OwnerMobilePhn.enable();
      this.AddCollForm.controls.MrIdTypeCode.enable();
      this.AddCollForm.controls.OwnerIdNo.enable();
      this.AddCollForm.controls.collOwnerAddress.enable();
      this.AddCollForm.controls.OwnerProfessionCode.enable();
      this.AddCollForm.controls.MrOwnerTypeCode.enable();
      this.InputLookupProfessionObj.isDisable = false;
    }
  }

  copyToLocationAddr() {
    var appCustAddrObj = { Id: this.AddCollForm.controls["LocationAddrType"].value };
    this.http.post(URLConstant.GetAppCustAddrByAppCustAddrId, appCustAddrObj).subscribe(
      (response) => {
        this.returnAppCustAddrObj = response;

        this.locationAddrObj = new AppCustAddrObj();
        this.locationAddrObj.Addr = this.returnAppCustAddrObj.Addr;
        this.locationAddrObj.AreaCode3 = this.returnAppCustAddrObj.AreaCode3;
        this.locationAddrObj.AreaCode4 = this.returnAppCustAddrObj.AreaCode4;
        this.locationAddrObj.AreaCode1 = this.returnAppCustAddrObj.AreaCode1;
        this.locationAddrObj.AreaCode2 = this.returnAppCustAddrObj.AreaCode2;
        this.locationAddrObj.City = this.returnAppCustAddrObj.City;

        this.inputFieldLocationAddrObj = new InputFieldObj();
        this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
        this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.returnAppCustAddrObj.Zipcode;
        this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCustAddrObj.Zipcode };
        this.inputAddressObjForLoc.default = this.locationAddrObj;
        this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
      });
  }

  copyToCollateralOwnerAddr() {
    var collOwnerObj = { Id: this.AddCollForm.controls["CollateralOwnerAddr"].value };
    this.http.post(URLConstant.GetAppCustAddrByAppCustAddrId, collOwnerObj).subscribe(
      (response) => {
        this.returnCollOwnerObj = response;

        this.collOwnerAddrObj = new AppCustAddrObj();
        this.collOwnerAddrObj.Addr = this.returnCollOwnerObj.Addr;
        this.collOwnerAddrObj.AreaCode3 = this.returnCollOwnerObj.AreaCode3;
        this.collOwnerAddrObj.AreaCode4 = this.returnCollOwnerObj.AreaCode4;
        this.collOwnerAddrObj.AreaCode1 = this.returnCollOwnerObj.AreaCode1;
        this.collOwnerAddrObj.AreaCode2 = this.returnCollOwnerObj.AreaCode2;
        this.collOwnerAddrObj.City = this.returnCollOwnerObj.City;

        this.inputFieldCollOwnerObj = new InputFieldObj();
        this.inputFieldCollOwnerObj.inputLookupObj = new InputLookupObj();
        this.inputFieldCollOwnerObj.inputLookupObj.nameSelect = this.returnCollOwnerObj.Zipcode;
        this.inputFieldCollOwnerObj.inputLookupObj.jsonSelect = { Zipcode: this.returnCollOwnerObj.Zipcode };
        this.inputAddressObjForColl.default = this.collOwnerAddrObj;
        this.inputAddressObjForColl.inputField = this.inputFieldCollOwnerObj;
      });
  }

  async ngOnInit() {
    this.items = this.AddCollForm.get('items') as FormArray;
    this.inputAddressObjForColl = new InputAddressObj();
    this.inputAddressObjForColl.title = "Collateral Owner";
    this.inputAddressObjForColl.showAllPhn = false;
    this.inputAddressObjForColl.showOwnership = false;
    this.inputAddressObjForColl.showSubsection = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;
    this.appCollateralObj = new AppCollateralObj();

    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isRequired = false;
    this.InputLookupProfessionObj.isReady = true;
    // this.SetRefAttrSettingObj();
    await this.GetAppCust()
    if(this.custType == CommonConstant.CustTypePersonal){
      await this.GetAppCustPersonalJobData();
    }else{
      await this.GetAppCustCoy();
    }
    await this.bindDDLFromRefMaster();
    this.SetInputLookupCollExisting();
    await this.SetManufacturingYearMandatory();

    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);

    if (this.mode == CommonConstant.ModeEditColl) {
      this.AddCollForm.controls.Collateral.disable();
      this.appCollateralObj.AppCollateralId = this.AppCollateralId;
      this.appCollateralObj.Id = this.AppCollateralId;
      this.appAssetId = this.appCollateralObj.AppAssetId;
      await this.http.post(URLConstant.GetAppCollateralByAppCollateralId, this.appCollateralObj).toPromise().then(
        async (response) => {
          this.returnAppCollateralObj = response;
          if (this.returnAppCollateralObj.CollateralStat == CommonConstant.AssetStatNew) {
            this.AddCollForm.patchValue({
              Collateral: 'New'
            });
          }
          else {
            this.AddCollForm.patchValue({
              Collateral: 'Exist'
            });
            this.existingSelected = true;
            this.inputLookupExistColl.nameSelect = this.returnAppCollateralObj.FullAssetName;
            this.inputLookupExistColl.jsonSelect = this.returnAppCollateralObj;
          }
          this.collateral = this.returnAppCollateralObj.CollateralStat
          this.CollChange(true);
          this.AddCollForm.patchValue({
            CollateralValueAmt: this.returnAppCollateralObj.CollateralValueAmt,
            Notes: this.returnAppCollateralObj.CollateralNotes,
            AssetTypeCode: this.returnAppCollateralObj.AssetTypeCode,
            AssetCategoryCode: this.returnAppCollateralObj.AssetCategoryCode,
            CollPercentage: this.returnAppCollateralObj.CollateralPrcnt,
            CollateralSeqNo: this.returnAppCollateralObj.CollateralSeqNo,
            ManufacturingYear: this.returnAppCollateralObj.ManufacturingYear,
            MrCollateralUsageCode: this.returnAppCollateralObj.MrCollateralUsageCode,
            MrCollateralConditionCode: this.returnAppCollateralObj.MrCollateralConditionCode
          });

          var reqByCode = new GenericObj();
          reqByCode.Code = this.returnAppCollateralObj.FullAssetCode;
          await this.http.post(URLConstant.GetAssetMasterForLookup, reqByCode).toPromise().then(
            (response) => {
              this.resAssetMasterObj = response;
              this.inputLookupObj.nameSelect = this.resAssetMasterObj.FullAssetName;
              this.inputLookupObj.jsonSelect = this.resAssetMasterObj;
              this.AddCollForm.patchValue({
                FullAssetCode: this.resAssetMasterObj.FullAssetCode,
                FullAssetName: this.resAssetMasterObj.FullAssetName,
                CollateralName: this.resAssetMasterObj.FullAssetName
              });
            });
        });

      this.appCollateralRegistObj = new AppCollateralRegistrationObj();
      this.appCollateralRegistObj.AppCollateralId = this.AppCollateralId;
      this.appCollateralRegistObj.Id = this.AppCollateralId;
      this.http.post(URLConstant.GetAppCollateralRegistrationByAppCollateralId, this.appCollateralRegistObj).subscribe(
        async (response) => {
          this.returnAppCollateralRegistObj = response;

          let MrOwnerTypeCode = this.returnAppCollateralRegistObj.MrOwnerTypeCode;
          let isFromDB = true;
          if (MrOwnerTypeCode == null){
            MrOwnerTypeCode = this.custType;
            isFromDB = false;
          }

          this.AddCollForm.patchValue({
            OwnerRelationship: this.returnAppCollateralRegistObj.MrOwnerRelationshipCode,
            OwnerName: this.returnAppCollateralRegistObj.OwnerName,
            MrIdTypeCode: this.returnAppCollateralRegistObj.MrIdTypeCode,
            OwnerIdNo: this.returnAppCollateralRegistObj.OwnerIdNo,
            OwnerMobilePhn: this.returnAppCollateralRegistObj.OwnerMobilePhnNo,
            SelfOwner: (this.returnAppCollateralRegistObj.MrOwnerRelationshipCode == "SELF"),
            OwnerProfessionCode: this.returnAppCollateralRegistObj.OwnerProfessionCode,
            MrOwnerTypeCode: MrOwnerTypeCode
          });
          
          await this.OwnerTypeChange(MrOwnerTypeCode, !isFromDB);

          if (this.AddCollForm.controls.SelfOwner.value == true) {
            this.AddCollForm.controls.OwnerName.disable();
            this.AddCollForm.controls.OwnerRelationship.disable();
            this.AddCollForm.controls.OwnerMobilePhn.disable();
            this.AddCollForm.controls.MrIdTypeCode.disable();
            this.AddCollForm.controls.OwnerIdNo.disable();
            this.AddCollForm.controls.collOwnerAddress.disable();
            this.AddCollForm.controls.OwnerProfessionCode.disable();
            this.AddCollForm.controls.MrOwnerTypeCode.disable();
            this.InputLookupProfessionObj.isDisable = true;
          }

          this.collOwnerAddrObj = new AppCustAddrObj();
          this.collOwnerAddrObj.Addr = this.returnAppCollateralRegistObj.OwnerAddr;
          this.collOwnerAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.OwnerAreaCode3;
          this.collOwnerAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.OwnerAreaCode4;
          this.collOwnerAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.OwnerAreaCode1;
          this.collOwnerAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.OwnerAreaCode2;
          this.collOwnerAddrObj.City = this.returnAppCollateralRegistObj.OwnerCity;

          this.inputFieldCollOwnerObj = new InputFieldObj();
          this.inputFieldCollOwnerObj.inputLookupObj = new InputLookupObj();
          this.inputFieldCollOwnerObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.OwnerZipcode;
          this.inputFieldCollOwnerObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.OwnerZipcode };
          this.inputAddressObjForColl.default = this.collOwnerAddrObj;
          this.inputAddressObjForColl.inputField = this.inputFieldCollOwnerObj;

          this.locationAddrObj = new AppCustAddrObj();
          this.locationAddrObj.Addr = this.returnAppCollateralRegistObj.LocationAddr;
          this.locationAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.LocationAreaCode3;
          this.locationAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.LocationAreaCode4;
          this.locationAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.LocationAreaCode1;
          this.locationAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.LocationAreaCode2;
          this.locationAddrObj.City = this.returnAppCollateralRegistObj.LocationCity;

          this.inputFieldLocationAddrObj = new InputFieldObj();
          this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
          this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.LocationZipcode;
          this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.LocationZipcode };
          this.inputAddressObjForLoc.default = this.locationAddrObj;
          this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
        });

      await this.http.post(URLConstant.GetAppCollateralAttrByAppCollateralId, { Id: this.AppCollateralId }).toPromise().then(
        (response) => {
          var colObj = {
            AssetRegion: "",
            Color: "",
            Category: "",
            Transmition: "",
            TaxCityIssuer: "",
            BpkpIssueDate: "",
          };
          for (const item of response["AppCollateralAttrObjs"]) {
            switch (item["CollateralAttrCode"]) {
              case CommonConstant.AppCollateralAttrAssetRegion:
                colObj.AssetRegion = item["AttrValue"];
                break;

              case CommonConstant.AppCollateralAttrColor:
                colObj.Color = item["AttrValue"];
                break;

              case CommonConstant.AppCollateralAttrCategory:
                colObj.Category = item["AttrValue"];
                break;

              case CommonConstant.AppCollateralAttrTransmition:
                colObj.Transmition = item["AttrValue"];
                break;

              case CommonConstant.AppCollateralAttrTaxCityIssuer:
                colObj.TaxCityIssuer = item["AttrValue"];
                break;

              case CommonConstant.AppCollateralAttrBpkbIssueDate:
                colObj.BpkpIssueDate = item["AttrValue"];
                break;

              default:
                break;
            }
          }
          this.AddCollForm.patchValue({
            AssetRegion: colObj.AssetRegion,
            Color: colObj.Color,
            Category: colObj.Category,
            Transmition: colObj.Transmition,
            TaxCityIssuer: colObj.TaxCityIssuer,
            BpkpIssueDate: colObj.BpkpIssueDate
          });
          this.InputLookupCityIssuerObj = new InputLookupObj();
          this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/NAP/lookupDistrict.json";
          this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
          this.InputLookupCityIssuerObj.pagingJson = "./assets/uclookup/NAP/lookupDistrict.json";
          this.InputLookupCityIssuerObj.genericJson = "./assets/uclookup/NAP/lookupDistrict.json";
          var disCrit = new Array();
          var critDisObj = new CriteriaObj();
          critDisObj.DataType = 'text';
          critDisObj.restriction = AdInsConstant.RestrictionEq;
          critDisObj.propName = 'TYPE';
          critDisObj.value = 'DIS';
          disCrit.push(critDisObj);
          this.InputLookupCityIssuerObj.addCritInput = disCrit;
          this.InputLookupCityIssuerObj.nameSelect = colObj.TaxCityIssuer;
          this.InputLookupCityIssuerObj.jsonSelect = { DistrictCode: colObj.TaxCityIssuer };
        });
    }
    
    this.GetListAddr();

    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldCollOwnerObj = new InputFieldObj();
    this.inputFieldCollOwnerObj.inputLookupObj = new InputLookupObj();

    this.inputFieldLegalObj = new InputFieldObj();
    this.inputFieldLegalObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationObj = new InputFieldObj();
    this.inputFieldLocationObj.inputLookupObj = new InputLookupObj();

    this.idTypeCode = new RefMasterObj();
    this.idTypeCode.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.idTypeCode).subscribe(
      (response) => {
        this.tempIdType = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({ MrIdTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
      });

    this.ownerRelationshipObj = new RefMasterObj();
    this.ownerRelationshipObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.ownerRelationshipObj).subscribe(
      (response) => {
        this.returnOwnerRelationshipObj = response[CommonConstant.ReturnObj];
        if(this.mode != CommonConstant.ModeEditColl){
          this.AddCollForm.patchValue({ OwnerRelationship: response[CommonConstant.ReturnObj][0]['Key'] });
        }
      }
    );

    this.assetRegionObj = new RefMasterObj();
    this.assetRegionObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetInsRegion;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.assetRegionObj).subscribe(
      (response) => {
        this.returnAssetRegionObj = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({ AssetRegion: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.collTypeObj = new AssetTypeObj();
    await this.http.post(URLConstant.GetListAssetTypeByCode, this.collTypeObj).toPromise().then(
      async (response) => {
        this.returnCollTypeObj = response[CommonConstant.ReturnObj];
        if (this.mode != CommonConstant.ModeEditColl) {
          this.AddCollForm.patchValue({ AssetTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
        }
        await this.collateralTypeHandler(true);
        this.collateralPortionHandler();
        this.AddCollForm.removeControl("AssetAccessoriesObjs");
        this.AddCollForm.addControl("AssetAccessoriesObjs", this.fb.array([]));
        if(this.returnAppCollateralObj != undefined)
        {
            this.AddCollForm.patchValue({
            AssetCategoryCode: this.returnAppCollateralObj.AssetCategoryCode
          });
        }
        this.inputLookupObj = new InputLookupObj();
        this.inputLookupObj.isReady = false;
        this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
        this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
        this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
        this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
        var criteriaList = new Array<CriteriaObj>();
        var criteriaObj = new CriteriaObj();
        criteriaObj.restriction = AdInsConstant.RestrictionEq;
        criteriaObj.propName = 'B.ASSET_TYPE_CODE';
        criteriaObj.value = response[CommonConstant.ReturnObj][0]['Key'];
        criteriaList.push(criteriaObj);
        this.inputLookupObj.addCritInput = criteriaList;
        this.inputLookupObj.isReady = true;
      }
    );

    this.InputLookupCityIssuerObj = new InputLookupObj();
    this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCityIssuerObj.pagingJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.genericJson = "./assets/uclookup/NAP/lookupDistrict.json";
    var disCrit = new Array();
    var critDisObj = new CriteriaObj();
    critDisObj.DataType = 'text';
    critDisObj.restriction = AdInsConstant.RestrictionEq;
    critDisObj.propName = 'TYPE';
    critDisObj.value = 'DIS';
    disCrit.push(critDisObj);
    this.InputLookupCityIssuerObj.addCritInput = disCrit;

    await this.GenerateAppCollateralAttr(false);


    this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSSerialNoRegex }).subscribe(
      (response) => {
        this.SerialNoRegex = response["GsValue"];

        let obj: CustomPatternObj = {
          pattern: this.SerialNoRegex,
          invalidMsg: "Cannot input special character"
        }
        this.ListPattern.push(obj);
      }
    );

    if(this.collateral == 'Exist'){
      this.disabledForm(true);
    }
  }

  async GenerateAppCollateralAttr(isRefresh: boolean) {
    var GenObj =
    {
      AppCollateralId: this.AppCollateralId,
      AssetTypeCode: this.AddCollForm.controls["AssetTypeCode"].value,
      AttrTypeCode: CommonConstant.AttrTypeCodeTrx,
      IsRefresh: isRefresh
    };
    await this.http.post(URLConstant.GenerateAppCollateralAttr, GenObj).toPromise().then(
      (response) => {
        this.AppCollateralAttrObj = response['ResponseAppCollateralAttrObjs'];
        if (response['IsDiffWithRefAttr']) {
          this.isDiffWithRefAttr = true;
          this.toastr.warningMessage(ExceptionConstant.REF_ATTR_CHANGE);
        }

        this.GenerateAppCollateralAttrForm();
      });
  }
  GenerateAppCollateralAttrForm() {
    if (this.AppCollateralAttrObj != null) {
      this.AppCollateralAttrObjs = new Array<AppCollateralAttrCustomObj>();
      for (let i = 0; i < this.AppCollateralAttrObj.length; i++) {
        this.ListAttrAnswer.push([]);
        var AppCollateralAttrObj = new AppCollateralAttrCustomObj();
        AppCollateralAttrObj.CollateralAttrCode = this.AppCollateralAttrObj[i].AttrCode;
        AppCollateralAttrObj.CollateralAttrName = this.AppCollateralAttrObj[i].AttrName;
        AppCollateralAttrObj.AttrValue = this.AppCollateralAttrObj[i].AttrValue;
        AppCollateralAttrObj.AttrInputType = this.AppCollateralAttrObj[i].AttrInputType;
        AppCollateralAttrObj.AttrLength = this.AppCollateralAttrObj[i].AttrLength;
        if (this.AppCollateralAttrObj[i].AttrQuestionValue != null) {
          this.ListAttrAnswer[i].push(this.AppCollateralAttrObj[i].AttrQuestionValue);
          if (AppCollateralAttrObj.AttrValue == null) {
            AppCollateralAttrObj.AttrValue = this.AppCollateralAttrObj[i].AttrQuestionValue[0]
          }
        }
        else {
          this.ListAttrAnswer[i].push("");
        }
        this.AppCollateralAttrObjs.push(AppCollateralAttrObj);

      }
      var listAppAssetAttrs = this.AddCollForm.controls["AppCollateralAttrObjs"] as FormArray;
      while (listAppAssetAttrs.length !== 0) {
        listAppAssetAttrs.removeAt(0);
      }
      for (let j = 0; j < this.AppCollateralAttrObjs.length; j++) {
        listAppAssetAttrs.push(this.addGroupAppCollateralAttr(this.AppCollateralAttrObjs[j], j));
      }
      this.isAssetAttrReady = true;
    }

  }

  private setValidators(appCollateralAttrObj: AppCollateralAttrCustomObj) {
    let ListValidator: Array<ValidatorFn> = new Array<ValidatorFn>();

    if (appCollateralAttrObj.AttrLength != null && appCollateralAttrObj.AttrLength != 0) {
      ListValidator.push(Validators.maxLength(appCollateralAttrObj.AttrLength));
    }

    return ListValidator;
  }

  private setFbGroupAssetAttribute(appCollateralAttrObj: AppCollateralAttrCustomObj, i: number, ListValidator: Array<ValidatorFn>) {
    let tempFB = this.fb.group({
      No: [i],
      AssetAttrCode: [appCollateralAttrObj.CollateralAttrCode],
      AssetAttrName: [appCollateralAttrObj.CollateralAttrName],
      AttrInputType: [appCollateralAttrObj.AttrInputType],
      AttrValue: [appCollateralAttrObj.AttrValue]
    });
    if (ListValidator.length > 0) {
      tempFB.get("AttrValue").setValidators(ListValidator);
    }

    return tempFB;
  }

  addGroupAppCollateralAttr(appCollateralAttrObj: AppCollateralAttrCustomObj, i: number) {
    let ListValidator: Array<ValidatorFn> = this.setValidators(appCollateralAttrObj);

    return this.setFbGroupAssetAttribute(appCollateralAttrObj, i, ListValidator);
  }

  refreshAttr() {
    this.isAssetAttrReady = false;
    this.GenerateAppCollateralAttr(true);
  }
  collateralPortionHandler() {
    const fullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    const assetType = this.AddCollForm.controls["AssetTypeCode"].value;
    var serialNoForm = this.items.controls[0] as FormGroup;
    
    let serialNo1: [];

    if(serialNoForm != undefined)
    {
      serialNo1 = serialNoForm.controls["SerialNoValue"].value;
    }

    const currCollPrcnt = this.AddCollForm.controls["CollPercentage"].value;
    const collValueAmt = this.AddCollForm.controls["CollateralValueAmt"].value;

    if (fullAssetCode && assetType && serialNo1) {
      this.http.post(URLConstant.GetCollateralByFullAssetCodeAssetTypeSerialNoForAppCollateral, { FullAssetCode: fullAssetCode, AssetTypeCode: assetType, SerialNo1: serialNo1 }).toPromise().then(
        (response) => {
          var outCollPrcnt = 100;
          if (response) {
            if (response["CollateralPrcnt"]) {
              outCollPrcnt -= response["CollateralPrcnt"];
            }
          }
          outCollPrcnt -= currCollPrcnt;
          var collPortionAmt = collValueAmt * (currCollPrcnt / 100);
          this.AddCollForm.patchValue({
            OutstandingCollPrcnt: outCollPrcnt,
            CollateralPortionAmt: collPortionAmt
          });
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }
  }

  showModalTaxCityIssuer() {
    const modalTaxCityIssuer = this.modalService.open(LookupTaxCityIssuerComponent);
    modalTaxCityIssuer.result.then(
      (response) => {
        this.AddCollForm.patchValue({
          TaxCityIssuer: response.DistrictCode
        });
      }
    ).catch(() => {
    });
  }

  setCollateralInfo() {
    var collateralStat = this.AddCollForm.controls["Collateral"].value;
    this.appCollateralDataObj.AppCollateralObj.AppId = this.AppId;
    this.appCollateralDataObj.AppCollateralObj.CollateralSeqNo = this.AddCollForm.controls["CollateralSeqNo"].value;
    this.appCollateralDataObj.AppCollateralObj.FullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    this.appCollateralDataObj.AppCollateralObj.FullAssetName = this.AddCollForm.controls["FullAssetName"].value;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items.controls[i] != null) {
        this.appCollateralDataObj.AppCollateralObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
      }
    }

    this.appCollateralDataObj.AppCollateralObj.CollateralNotes = this.AddCollForm.controls["Notes"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetTypeCode = this.AddCollForm.controls["AssetTypeCode"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralStat = collateralStat == "New" ? CommonConstant.AssetStatNew : CommonConstant.AssetStatExisting;
    this.appCollateralDataObj.AppCollateralObj.MrCollateralConditionCode = CommonConstant.AssetConditionUsed;
    this.appCollateralDataObj.AppCollateralObj.MrCollateralUsageCode = CommonConstant.AssetUsageNonComm;
    this.appCollateralDataObj.AppCollateralObj.AssetCategoryCode = this.AddCollForm.controls["AssetCategoryCode"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralValueAmt = this.AddCollForm.controls["CollateralValueAmt"].value;
    this.appCollateralDataObj.AppCollateralObj.ManufacturingYear = this.AddCollForm.controls["ManufacturingYear"].value;
  }

  setCollateralOwner() {
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.AddCollForm.controls["OwnerRelationship"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerName = this.AddCollForm.controls["OwnerName"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AddCollForm.controls["MrIdTypeCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AddCollForm.controls["OwnerIdNo"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AddCollForm.controls["collOwnerAddress"]["controls"].Addr.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AddCollForm.controls["collOwnerAddress"]["controls"].AreaCode1.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AddCollForm.controls["collOwnerAddress"]["controls"].AreaCode2.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AddCollForm.controls["collOwnerAddress"]["controls"].AreaCode3.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AddCollForm.controls["collOwnerAddress"]["controls"].AreaCode4.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerCity = this.AddCollForm.controls["collOwnerAddress"]["controls"].City.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AddCollForm.controls["collOwnerAddressZipcode"]["controls"].value.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AddCollForm.controls["OwnerMobilePhn"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerProfessionCode = this.AddCollForm.controls["OwnerProfessionCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrOwnerTypeCode = this.AddCollForm.controls["MrOwnerTypeCode"].value;
  }

  setCollateralAttribute() {
    if (this.AppCollateralAttrObj != null) {
      for (let i = 0; i < this.AddCollForm.controls["AppCollateralAttrObjs"].value.length; i++) {
        var appCollAttrcObj = new AppCollateralAttrObj();
        appCollAttrcObj.CollateralAttrName = this.AddCollForm.controls["AppCollateralAttrObjs"].value[i].AssetAttrName;
        appCollAttrcObj.CollateralAttrCode = this.AddCollForm.controls["AppCollateralAttrObjs"].value[i].AssetAttrCode;
        appCollAttrcObj.AttrValue = this.AddCollForm.controls["AppCollateralAttrObjs"].value[i].AttrValue;

        this.appCollateralDataObj.AppCollateralAttrObj.push(appCollAttrcObj);
      }
    }
  }

  setCollateralLocation() {
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAddr = this.AddCollForm.controls["collLocationAddr"]["controls"].Addr.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AddCollForm.controls["collLocationAddr"]["controls"].AreaCode1.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AddCollForm.controls["collLocationAddr"]["controls"].AreaCode2.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AddCollForm.controls["collLocationAddr"]["controls"].AreaCode3.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AddCollForm.controls["collLocationAddr"]["controls"].AreaCode4.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationCity = this.AddCollForm.controls["collLocationAddr"]["controls"].City.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AddCollForm.controls["collLocationAddrZipcode"]["controls"].value.value;
  }

  setCollateralPercentage() {
    this.appCollateralDataObj.AppCollateralObj.CollateralPrcnt = this.AddCollForm.controls["CollPercentage"].value;
  }

  SaveNewCollateral() {
    if (this.AddCollForm.controls["OutstandingCollPrcnt"].value < 0) {
      this.toastr.warningMessage("Collateral Portion Usage Cannot Exceed Outstanding Collateral Percentage");
      return false;
    }
    if (this.AddCollForm.valid) {
      this.appCollateralDataObj = new AppCollateralDataObj();
      this.listAppCollateralDocObj.AppCollateralDocObj = new Array();

      for (var i = 0; i < this.AddCollForm.value.ListDoc["length"]; i++) {
        this.appCollateralDoc = new AppCollateralDocObj();
        if (this.AddCollForm.value.ListDoc[i].IsReceived == null) {
          this.appCollateralDoc.IsReceived = false;
        }
        else {
          this.appCollateralDoc.IsReceived = this.AddCollForm.value.ListDoc[i].IsReceived;
        }
        this.appCollateralDoc.DocCode = this.AddCollForm.value.ListDoc[i].DocCode;
        this.appCollateralDoc.DocNo = this.AddCollForm.value.ListDoc[i].DocNo;
        this.appCollateralDoc.ExpiredDt = this.AddCollForm.value.ListDoc[i].ACDExpiredDt;
        this.appCollateralDoc.DocNotes = this.AddCollForm.value.ListDoc[i].DocNotes;
        this.appCollateralDoc.RowVersion = this.AddCollForm.value.ListDoc[i].RowVersion;
        this.listAppCollateralDocObj.AppCollateralDocObj.push(this.appCollateralDoc);
      }
      this.appCollateralDataObj.ListAppCollateralDocObj = this.listAppCollateralDocObj.AppCollateralDocObj;

      if (this.mode == CommonConstant.ModeAddColl) {
        this.setCollateralInfo();

        if (this.AddCollForm.controls["CollateralValueAmt"].value != "") {
          this.appCollateralDataObj.AppCollateralObj.CollateralValueAmt = this.AddCollForm.controls["CollateralValueAmt"].value;
        }
        else {
          this.toastr.warningMessage("Please Fill The Collateral Price!");
          return
        }

        this.setCollateralOwner();
        this.setCollateralLocation();
        this.setCollateralPercentage();
        this.setCollateralAttribute();
        this.appCollateralDataObj.AppCollateralObj.AppAssetId = null;
        this.appCollateralDataObj.AppCollateralObj.AgrmntId = null;
        this.http.post(URLConstant.AddEditAllCollateralData, this.appCollateralDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.back();
          }
        );
      }
      else {
        this.setCollateralInfo();
        this.setCollateralOwner();
        this.setCollateralLocation();
        this.setCollateralPercentage();
        this.setCollateralAttribute();
        this.appCollateralDataObj.AppCollateralObj.AppAssetId = null;
        this.appCollateralDataObj.AppCollateralObj.AgrmntId = null;
        this.appCollateralDataObj.AppCollateralObj.AppCollateralId = this.AppCollateralId;
        this.appCollateralDataObj.AppCollateralObj.RowVersion = this.returnAppCollateralObj.RowVersion;
        this.appCollateralDataObj.AppCollateralRegistrationObj.AppCollateralRegistrationId = this.returnAppCollateralRegistObj.AppCollateralRegistrationId;
        this.appCollateralDataObj.AppCollateralRegistrationObj.AppCollateralId = this.returnAppCollateralRegistObj.AppCollateralId;
        this.appCollateralDataObj.AppCollateralRegistrationObj.RowVersion = this.returnAppCollateralRegistObj.RowVersion;
        this.http.post(URLConstant.AddEditAllCollateralData, this.appCollateralDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.back();
          }
        );
      }
    }
  }

  GetProfession(event) {
    this.AddCollForm.patchValue({
      OwnerProfessionCode: event.ProfessionCode
    });
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListId;
  }

  SaveForm() {
    
  }

  async SetManufacturingYearMandatory(){
    await this.http.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstant.GsCodeManufacturingYearMandatoryByCollType }).toPromise().then(
      (result: GeneralSettingObj) => {
        if (result.GsValue) {
          this.listCollTypeMandatoryManufacturingYear  = result.GsValue.split(';');
          console.log(this.listCollTypeMandatoryManufacturingYear);
        }
      }
    );
  }

  CheckManufacturingYearMandatory(){
    let temp = this.AddCollForm.controls.AssetTypeCode.value;
    this.isMandatoryManufacturingYear = this.listCollTypeMandatoryManufacturingYear.includes(temp);

    if (this.isMandatoryManufacturingYear) {
      this.AddCollForm.controls.ManufacturingYear.setValidators([Validators.required]);
      this.AddCollForm.controls.ManufacturingYear.updateValueAndValidity();
    }
    else{
      this.AddCollForm.controls.ManufacturingYear.clearValidators();
      this.AddCollForm.controls.ManufacturingYear.updateValueAndValidity();
    }
  }
  
  async GetAppCustCoy() {
    await this.http.post(URLConstant.GetAppCustCompanyByAppCustId, {Id: this.AppCustObj.AppCustId}).toPromise().then(
      (response: any) => {
        this.AppCustCoyObj = response;
      }
    );
  }

  async OwnerTypeChange(OwnerType: string, IsOwnerTypeChanged: boolean = false){
    if(OwnerType == CommonConstant.CustTypePersonal){
      if(IsOwnerTypeChanged){
        this.AddCollForm.patchValue({
          OwnerProfessionCode : ""
        });

        this.InputLookupProfessionObj.nameSelect = "";
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
      }else{
        let reqByCode: GenericObj = new GenericObj();
        reqByCode.Code = this.AppCustPersonalJobData.MrProfessionCode;
        
        await this.http.post(URLConstant.GetRefProfessionByCode, reqByCode).toPromise().then(
          (response) =>{
            this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response["ProfessionName"] };
          }
        );
      }
    }else{
      if(IsOwnerTypeChanged){
        this.AddCollForm.patchValue({
          OwnerProfessionCode : ""
        });
      }else{
        this.AddCollForm.patchValue({
          OwnerProfessionCode : this.returnAppCollateralRegistObj.OwnerProfessionCode
        });
      }
    }
  }
}
