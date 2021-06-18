import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { HttpClient } from '@angular/common/http';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { formatDate } from '@angular/common';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppCollateralDataObj } from 'app/shared/model/AppCollateralDataObj.Model';
import { ListAppCollateralDocObj } from 'app/shared/model/ListAppCollateralDocObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppCollateralAttrObj } from 'app/shared/model/AppCollateralAttrObj.Model';
import { AppCollateralAttrCustomObj } from 'app/shared/model/AppCollateralAttrCustom.Model';
import { String } from 'typescript-string-operations';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { GenericListByCodeObj } from 'app/shared/model/Generic/GenericListByCodeObj.model';
import { ResGeneralSettingObj, ResListGeneralSettingObj } from 'app/shared/model/Response/GeneralSetting/ResGeneralSettingObj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AssetTypeSerialNoLabelObj } from 'app/shared/model/SerialNo/AssetTypeSerialNoLabelObj.Model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';

@Component({
  selector: 'app-collateral-detail',
  templateUrl: './collateral-detail.component.html'
})
export class CollateralDetailComponent implements OnInit {

  @ViewChild('LookupCollateral') ucLookupCollateral: UclookupgenericComponent;
  private ucLookupCollateralExisting: UclookupgenericComponent;
  generalSettingObj: GenericListByCodeObj;
  indexChassis: number;
  currentChassisNo: string;
  LastRequestedDate: Date;
  IsIntegrator: boolean = false;
  ThirdPartyRsltHId: number = 0;
  @ViewChild('LookupCollateralExisting') set content(content: UclookupgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucLookupCollateralExisting = content;
    }
  }
  @Input() mode: string = "add";
  @Input() isSingleAsset = true;
  @Input() AppId: number = 0;
  @Input() AppCollateralId: number = 0;
  @Output() outputValue: EventEmitter<number> = new EventEmitter<number>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  bizTemplateCode: string = "";

  AppCollateralAttrObj: Array<AppCollateralAttrCustomObj>;
  ListAttrAnswer = [];
  inputLookupExistColl: InputLookupObj = new InputLookupObj();
  inputLookupColl: InputLookupObj = new InputLookupObj();
  inputFieldLegalObj: InputFieldObj = new InputFieldObj();
  inputFieldLocationObj: InputFieldObj = new InputFieldObj();
  LocationAddrObj: AddrObj = new AddrObj();

  isAssetAttrReady: boolean = false;
  AppCollateralAttrObjs: Array<AppCollateralAttrCustomObj>;
  AppCustObj: AppCustObj = new AppCustObj();
  AppCustAddrObj: AppCustAddrObj = new AppCustAddrObj();
  AppCustCompanyObj: AppCustCompanyObj = new AppCustCompanyObj();
  AppCustPersonalObj: AppCustPersonalObj = new AppCustPersonalObj();
  OwnerAddrObj: AddrObj = new AddrObj();
  appCollateralDataObj: AppCollateralDataObj = new AppCollateralDataObj();
  listAppCollateralDocObj: ListAppCollateralDocObj = new ListAppCollateralDocObj();
  appCollateralDoc: AppCollateralDocObj = new AppCollateralDocObj();
  appCollateralObj: AppCollateralObj = new AppCollateralObj();
  editAppCollateralObj: AppCollateralObj = new AppCollateralObj();
  collateralRegistrationObj: AppCollateralRegistrationObj;
  editCollateralRegistrationObj: AppCollateralRegistrationObj;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;
  items: FormArray;
  SerialNoList: Array<AssetTypeSerialNoLabelObj>;
  isUsed: boolean = true;
  isCopy: boolean = true;
  AddCollForm = this.fb.group({
    AppCollateralId: [''],
    FullAssetCode: ['', Validators.required],
    MrCollateralConditionCode: ['', Validators.required],
    MrCollateralUsageCode: ['', Validators.required],
    CollateralStat: ['NEW', Validators.required],
    CollateralValueAmt: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
    AssetTypeCode: ['', Validators.required],
    AssetCategoryCode: ['', Validators.required],
    AssetTaxCode: [''],
    CollateralNotes: [''],
    CollateralPrcnt: [0, [Validators.required, Validators.max(100)]],
    IsMainCollateral: true,
    ManufacturingYear: ['', [Validators.pattern("^[0-9]*$"), Validators.required]],
    CollateralNo: [''],
    AssetTaxDt: [''],
    UserName: ['', Validators.required],
    MrUserRelationshipCode: [''],
    OwnerMobilePhnNo: ['', Validators.required],
    OwnerName: ['', Validators.required],
    OwnerIdNo: ['', Validators.required],
    MrIdTypeCode: [''],
    MrOwnerRelationshipCode: [''],
    Notes: [''],
    ListDoc: this.fb.array([]),
    ListAttr: this.fb.array([]),
    OwnerRelationship: [''],
    MrIdType: [''],
    CopyFromLegal: ['LEGAL'],
    AppAttrName: [''],
    SelfUsage: [false],
    SelfOwner: [false],
    CollateralPortionAmt: [0],
    OutstandingCollPrcnt: [0],
    items: this.fb.array([]),
    AppCollateralAttrObjs: this.fb.array([])
  });

  CollTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CollConditionList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CollUsageList: Array<KeyValueObj> = new Array<KeyValueObj>();
  IdTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  OwnerRelationList: Array<KeyValueObj> = new Array<KeyValueObj>();
  AssetTypeCode: string = "";
  inputAddressObjForLegal: InputAddressObj;
  inputAddressObjForLoc: InputAddressObj;
  appAssetId: number = 0;
  isDiffWithRefAttr: boolean;
  AppCustData: AppCustObj;
  IntegratorCheckBySystemGsValue: string = "0";
  IsUseDigitalization: string;
  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: NGXToastrService) { }

  async ngOnInit() {
    this.inputAddressObjForLegal = new InputAddressObj();
    this.inputAddressObjForLegal.showSubsection = false;
    this.inputAddressObjForLegal.showAllPhn = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;

    this.items = this.AddCollForm.get('items') as FormArray;


    this.GetLegalAddr();
    this.initUcLookup();
    await this.GetAppCustByAppId();
    await this.initDropdownList();
    await this.getAppData();

    if(this.AppCustData.MrCustTypeCode == CommonConstant.CustTypeCompany){
      this.AddCollForm.controls.OwnerMobilePhnNo.clearValidators();
      this.AddCollForm.controls.OwnerMobilePhnNo.updateValueAndValidity();
    }

    if (this.mode == "edit") {
      await this.getAppCollData(0, this.AppCollateralId);
    }
    if (this.isSingleAsset) {
      await this.getAppCollData(this.AppId, 0);
    }
    if(this.bizTemplateCode == CommonConstant.CFRFN4W){
      this.AddCollForm.patchValue({
        SelfUsage: true,
        SelfOwner: true
      });
      await this.CopyUserForSelfUsage();
      await this.CopyUserForSelfOwner();
      if(this.AppCustData.MrCustTypeCode == CommonConstant.CustTypePersonal){
        await this.setOwnerRelationListDdl();
      }
    }
    this.GenerateAppCollateralAttr(false);
    this.GetGS();
  }

  initUcLookup() {
    this.SetInputLookupCollExisting();
    this.SetInputLookupColl();
  }

  SetInputLookupCollExisting() {
    this.inputLookupExistColl = new InputLookupObj();
    this.inputLookupExistColl.urlJson = "./assets/uclookup/NAP/lookupAppCollateralCFNA.json";
    this.inputLookupExistColl.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupExistColl.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupExistColl.pagingJson = "./assets/uclookup/NAP/lookupAppCollateralCFNA.json";
    this.inputLookupExistColl.genericJson = "./assets/uclookup/NAP/lookupAppCollateralCFNA.json";
    this.inputLookupExistColl.isRequired = false;
  }
  async GetThirdPartyResultH() {
    var ChassisNoValue = this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value;
    await this.http.post(URLConstant.GetAppAssetFromThirdPartyResultHByTrxTypeCodeAndTrxNoAndChassisNoForFraudChecking, { TrxNo: this.AppNo, TrxTypeCode: "APP", ChassisNo: ChassisNoValue }).toPromise().then(
      (response) => {
        this.ThirdPartyRsltHId = response["ResponseThirdPartyRsltH"]["ThirdPartyRsltHId"];
        if (response["AppAssetObject"]["SerialNo1"] != null) {
          this.currentChassisNo = response["AppAssetObject"]["SerialNo1"];
        }
        if (response["ResponseThirdPartyRsltH"]["ThirdPartyRsltHId"] != null) {
          this.LastRequestedDate = response["ResponseThirdPartyRsltH"]["ReqDt"];
        }
      }
    );
  }
  async GetGS() {
    this.generalSettingObj = new GenericListByCodeObj();
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization);

    await this.http.post<ResListGeneralSettingObj>(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).toPromise().then(
      (response) => {
        var returnGeneralSettingObj: Array<ResGeneralSettingObj> = new Array<ResGeneralSettingObj>();
        returnGeneralSettingObj = response['ResGetListGeneralSettingObj'];

        var gsNeedCheckBySystem = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        var gsUseDigitalization = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);
        
        if(gsNeedCheckBySystem != undefined){
          this.IntegratorCheckBySystemGsValue = gsNeedCheckBySystem.GsValue;
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if(gsUseDigitalization != undefined){
          this.IsUseDigitalization = gsUseDigitalization.GsValue;
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }

        if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0") {
          this.GetThirdPartyResultH();
        }
      }
    );
  }
  HitAPI() {
    if (this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value == '') {
      this.toastr.warningMessage("Please Input Chassis No !");
    }
    else {
      this.toastr.successMessage("Submit with Integrator");
      this.IsIntegrator = true;
    }
  }

  SetInputLookupColl() {
    this.inputLookupColl = new InputLookupObj();
    this.inputLookupColl.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupColl.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupColl.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupColl.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupColl.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
  }

  async GenerateAppCollateralAttr(isRefresh: boolean) {
    var GenObj =
    {
      AppCollateralId: this.appCollateralObj.AppCollateralId,
      AssetTypeCode: this.AddCollForm.controls["AssetTypeCode"].value,
      AttrTypeCode: CommonConstant.AttrTypeCodeTrx,
      IsRefresh: isRefresh
    };
    this.http.post(URLConstant.GenerateAppCollateralAttr, GenObj).subscribe(
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
  addGroupAppCollateralAttr(AppCollateralAttrObjs, i) {
    if (AppCollateralAttrObjs.AttrInputType == 'L') {
      return this.fb.group({
        No: [i],
        AssetAttrCode: [AppCollateralAttrObjs.CollateralAttrCode],
        AssetAttrName: [AppCollateralAttrObjs.CollateralAttrName],
        AttrInputType: [AppCollateralAttrObjs.AttrInputType],
        AttrValue: [AppCollateralAttrObjs.AttrValue]
      })
    }
    else {
      return this.fb.group({
        No: [i],
        AssetAttrCode: [AppCollateralAttrObjs.CollateralAttrCode],
        AssetAttrName: [AppCollateralAttrObjs.CollateralAttrName],
        AttrInputType: [AppCollateralAttrObjs.AttrInputType],
        AttrValue: [AppCollateralAttrObjs.AttrValue, [Validators.maxLength(AppCollateralAttrObjs.AttrLength)]]
      })
    }
  }

  async initDropdownList() {
    await this.http.post(URLConstant.GetAssetTypeListKeyValueActiveByCode, {}).toPromise().then(
      async (response) => {
        this.CollTypeList = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.AssetTypeCode = this.CollTypeList[0].Key;
          this.AddCollForm.patchValue({
            AssetTypeCode: this.CollTypeList[0].Key
          });
          await this.onItemChange(this.AddCollForm.controls.AssetTypeCode.value, false);
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetCondition }).subscribe(
      (response) => {
        this.CollConditionList = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            MrCollateralConditionCode: this.CollConditionList[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetUsage }).subscribe(
      (response) => {
        this.CollUsageList = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            MrCollateralUsageCode: this.CollUsageList[0].Key
          });
        }
        this.AddCollForm.controls.MrCollateralConditionCode.disable();
      });

    this.http.post(URLConstant.GetListRefAppAttrCollateral, {}).subscribe(
      (response) => {
        let ListAttr = this.AddCollForm.get('ListAttr') as FormArray;
        let listRefAppAttr = new Array();
        listRefAppAttr = response[CommonConstant.ReturnObj];

        for (let i = 0; i < listRefAppAttr.length; i++) {
          var Attr = this.fb.group({
            AppAttrValue: listRefAppAttr[i].AppAttrValue,
          }) as FormGroup;
          ListAttr.push(Attr);
        }
      });

    let refMasterTypeCode = CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
    if(this.AppCustData.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      refMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship
    }
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: refMasterTypeCode }).subscribe(
      (response) => {
        this.OwnerRelationList = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          if (this.OwnerRelationList.length > 0) {
            this.AddCollForm.patchValue({
              MrOwnerRelationshipCode: this.OwnerRelationList[0].Key,
              MrUserRelationshipCode: this.OwnerRelationList[0].Key,
              CopyFromLegal: CommonConstant.AddrTypeLegal
            });
          }
        }
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeList = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            MrIdTypeCode: this.IdTypeList[0].Key
          });
        }
      });
  }

  AppCustId: number = 0;
  AppNo: string = "";
  async GetAppCustByAppId() {
    await this.http.post<AppCustObj>(URLConstant.GetAppCustByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.AppCustData = response;
        this.AppCustId = response.AppCustId;
      });
  }
  async getAppData() {
    await this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      async (response) => {
        this.AppNo = response["AppNo"];
        this.bizTemplateCode = response["BizTemplateCode"];
        await this.getProdOffering(response.ProdOfferingCode, response.ProdOfferingVersion);
        if (response["BizTemplateCode"] == CommonConstant.CFRFN4W) {
          this.AddCollForm.patchValue({
            MrCollateralConditionCode: this.CollConditionList[1].Key
          });
        }
      });
  }

  async getProdOffering(ProdOfferingCode, ProdOfferingVersion) {
    var ProdOfferingObj = {
      ProdOfferingCode: ProdOfferingCode,
      ProdOfferingVersion: ProdOfferingVersion,
    };
    await this.http.post(URLConstant.GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion, ProdOfferingObj).toPromise().then(
      async (response) => {
        var temp = response["ListProdOfferingDObj"];
        var LobCode: string = "";
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].RefProdCompntCode == "ASSETTYPE") {
            LobCode = temp[i].CompntValue;
          }
        }
        if (LobCode != "") {
          this.AssetTypeCode = LobCode;
          this.AddCollForm.patchValue({
            AssetTypeCode: this.AssetTypeCode
          });
          await this.onItemChange(this.AssetTypeCode);
        }
        // Generate Collateral Doc
        // this.getRefAssetDocList();

      });
  }

  async getRefAssetDocList(AssetTypeCode: string) {
    await this.http.post(URLConstant.GetRefAssetDocList, { AssetTypeCode: AssetTypeCode }).toPromise().then(
      async (response) => {
        let ListDoc: FormArray = this.AddCollForm.get('ListDoc') as FormArray;
        while (ListDoc.length > 0) {
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
        await this.setAppCollateralDoc(this.appCollateralObj.AppCollateralId);
      });
  }

  async setAppCollateralDoc(AppCollateralId: number = 0) {
    await this.http.post(URLConstant.GetListAppCollateralDocsByAppCollateralId, { Id: AppCollateralId }).toPromise().then(
      (response) => {
        var AppCollateralDocs = new Array();
        AppCollateralDocs = response["AppCollateralDocs"];
        if (AppCollateralDocs["length"] > 0) {
          for (var i = 0; i < AppCollateralDocs.length; i++) {
            this.AddCollForm.controls.ListDoc["controls"][i].patchValue({
              DocNo: AppCollateralDocs[i].DocNo,
              DocNotes: AppCollateralDocs[i].DocNotes,
              ACDExpiredDt: formatDate(AppCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
              IsReceived: AppCollateralDocs[i].IsReceived,
              RowVersion: AppCollateralDocs[i].RowVersion,
            })
          }
        }
      });
  }

  async getAppCollData(AppId: number = 0, AppCollateralId: number = 0, IsExisting: boolean = false, IsFromLookup: boolean = false, fouExistObj: object = null) {
    if (IsExisting) {
      this.AddCollForm.patchValue({
        AppCollateralId: this.AppCollateralId,
        AssetTypeCode: fouExistObj["AssetTypeCode"],
        FullAssetCode: fouExistObj["FullAssetCode"],
        AssetCategoryCode: fouExistObj["AssetCategoryCode"],
        MrCollateralConditionCode: fouExistObj["MrCollateralConditionCode"],
        MrCollateralUsageCode: fouExistObj["MrCollateralUsageCode"],
        CollateralValueAmt: fouExistObj["CollateralPriceAmt"],
        CollateralNotes: fouExistObj["Notes"],
        AssetTaxDt: fouExistObj["AssetTaxDate"] ? formatDate(fouExistObj["AssetTaxDate"], 'yyyy-MM-dd', 'en-US') : "",
        ManufacturingYear: "2020",

        OwnerName: fouExistObj["OwnerName"],
        OwnerIdNo: fouExistObj["OwnerIdNo"],
        MrIdTypeCode: fouExistObj["MrIdTypeCode"],
        OwnerMobilePhnNo: fouExistObj["OwnerMobilePhnNo"],
        MrOwnerRelationshipCode: fouExistObj["MrOwnerRelationshipCode"],
        UserName: fouExistObj["Username"],
        MrUserRelationshipCode: fouExistObj["MrUserRelationshipCode"],
        SelfOwner: fouExistObj["MrOwnerRelationshipCode"] == "SELF" ? true : false
      });

      if (this.AddCollForm.controls.MrUserRelationshipCode.value == "SELF") {
        this.AddCollForm.patchValue({
          SelfUsage: true
        })
      }

      this.changeSerialNoValidators(fouExistObj["MrCollateralConditionCode"]);
      await this.onItemChange(fouExistObj["AssetTypeCode"], true, true, fouExistObj);

      this.inputLookupExistColl.nameSelect = fouExistObj["FullAssetName"];
      this.inputLookupExistColl.jsonSelect = { FullAssetName: fouExistObj["FullAssetName"] };
      this.inputLookupColl.nameSelect = fouExistObj["FullAssetName"];
      this.inputLookupColl.jsonSelect = { FullAssetName: fouExistObj["FullAssetName"] };
      // set data Location Address
      this.LocationAddrObj.Addr = fouExistObj["LocationAddr"];
      this.LocationAddrObj.AreaCode1 = fouExistObj["LocationAreaCode1"];
      this.LocationAddrObj.AreaCode2 = fouExistObj["LocationAreaCode2"];
      this.LocationAddrObj.AreaCode3 = fouExistObj["LocationAreaCode3"];
      this.LocationAddrObj.AreaCode4 = fouExistObj["LocationAreaCode4"];
      this.LocationAddrObj.City = fouExistObj["LocationCity"];
      this.inputFieldLocationObj.inputLookupObj.nameSelect = fouExistObj["LocationZipcode"];
      this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: fouExistObj["LocationZipcode"] };
      this.inputAddressObjForLoc.default = this.LocationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;
      // set data Owner Address
      this.OwnerAddrObj.Addr = fouExistObj["OwnerAddr"];
      this.OwnerAddrObj.AreaCode1 = fouExistObj["OwnerAreaCode1"];
      this.OwnerAddrObj.AreaCode2 = fouExistObj["OwnerAreaCode2"];
      this.OwnerAddrObj.AreaCode3 = fouExistObj["OwnerAreaCode3"];
      this.OwnerAddrObj.AreaCode4 = fouExistObj["OwnerAreaCode4"];
      this.OwnerAddrObj.City = fouExistObj["OwnerCity"];
      this.inputFieldLegalObj.inputLookupObj.nameSelect = fouExistObj["OwnerZipcode"];
      this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: fouExistObj["OwnerZipcode"] };
      this.inputAddressObjForLegal.default = this.OwnerAddrObj;
      this.inputAddressObjForLegal.inputField = this.inputFieldLegalObj;

      this.AddCollForm.controls.AssetTypeCode.disable();
      this.AddCollForm.controls.ManufacturingYear.disable();
      this.AddCollForm.controls.CollateralValueAmt.disable();
      this.AddCollForm.controls.MrCollateralUsageCode.disable();
      this.AddCollForm.controls.AssetTaxDt.disable();
      this.AddCollForm.controls.CollateralNotes.disable();
      this.AddCollForm.controls.AssetTaxDt.disable();
      this.AddCollForm.controls.UserName.disable();
      this.AddCollForm.controls.MrUserRelationshipCode.disable();
      this.AddCollForm.controls.OwnerName.disable();
      this.AddCollForm.controls.MrOwnerRelationshipCode.disable();
      this.AddCollForm.controls.OwnerMobilePhnNo.disable();
      this.AddCollForm.controls.OwnerIdNo.disable();
      this.AddCollForm.controls.MrIdTypeCode.disable();
      this.inputAddressObjForLegal.isReadonly = true;
      this.inputAddressObjForLoc.isReadonly = true;
      this.getRefAssetDocList(fouExistObj["AssetTypeCode"]);
      this.AddCollForm.patchValue({
        CollateralStat: CommonConstant.AssetStatExisting
      });

    } else {
      await this.http.post(URLConstant.GetAppCollateralAndRegistrationByAppCollateralId, { AppId: AppId, AppCollateralId: AppCollateralId }).toPromise().then(
        async (response) => {
          this.appCollateralObj = response['AppCollateral'];
          this.appAssetId = this.appCollateralObj.AppAssetId;
          this.collateralRegistrationObj = response['AppCollateralRegistration'];
          if (!IsExisting) {
            if (this.appCollateralObj.AppCollateralId != 0) {
              this.mode = "edit";
            } else {
              if (this.mode == "add") {
                this.editAppCollateralObj = response['AppCollateral'];
                this.editCollateralRegistrationObj = response['AppCollateralRegistration'];
                this.AddCollForm.patchValue({
                  CollateralStat: "NEW"
                });
              }
              return true;
            }
            this.editAppCollateralObj = response['AppCollateral'];
            this.editCollateralRegistrationObj = response['AppCollateralRegistration'];
            this.AddCollForm.patchValue({
              CollateralStat: this.editAppCollateralObj.CollateralStat
            });
          } else {
            this.AddCollForm.patchValue({
              CollateralStat: CommonConstant.AssetStatExisting
            });
          }

          if (IsExisting || response['AppCollateral']['CollateralStat'] == CommonConstant.AssetStatExisting) {
            // this.isExisting = true;
            this.isCopy = false;
            this.AddCollForm.controls.ManufacturingYear.disable();
            this.AddCollForm.controls.CollateralValueAmt.disable();
            this.AddCollForm.controls.MrCollateralUsageCode.disable();
            this.AddCollForm.controls.AssetTaxDt.disable();
            this.AddCollForm.controls.CollateralNotes.disable();
            this.AddCollForm.controls.AssetTaxDt.disable();
            this.AddCollForm.controls.UserName.disable();
            this.AddCollForm.controls.MrUserRelationshipCode.disable();
            this.AddCollForm.controls.OwnerName.disable();
            this.AddCollForm.controls.MrOwnerRelationshipCode.disable();
            this.AddCollForm.controls.OwnerMobilePhnNo.disable();
            this.AddCollForm.controls.OwnerIdNo.disable();
            this.AddCollForm.controls.MrIdTypeCode.disable();
            this.inputAddressObjForLegal.isReadonly = true;
            this.inputAddressObjForLoc.isReadonly = true;
          }


          if (this.appCollateralObj.AppCollateralId == 0) {
            return true;
          } else {
            if (this.isSingleAsset) {
              this.mode = "edit";
            }
          }

          this.AddCollForm.patchValue({
            AssetTypeCode: this.appCollateralObj.AssetTypeCode,
            FullAssetCode: this.appCollateralObj.FullAssetCode,
            AssetCategoryCode: this.appCollateralObj.AssetCategoryCode,
            MrCollateralConditionCode: this.appCollateralObj.MrCollateralConditionCode,
            MrCollateralUsageCode: this.appCollateralObj.MrCollateralUsageCode,
            CollateralValueAmt: this.appCollateralObj.CollateralValueAmt,
            CollateralNotes: this.appCollateralObj.CollateralNotes,
            AssetTaxDt: formatDate(this.appCollateralObj.AssetTaxDt, 'yyyy-MM-dd', 'en-US'),
            // CollateralPrcnt: this.appCollateralObj.CollateralPrcnt,
            IsMainCollateral: this.appCollateralObj.IsMainCollateral,
            ManufacturingYear: this.appCollateralObj.ManufacturingYear,
            RowVersionCollateral: this.appCollateralObj.RowVersion,

            AppCollateralRegistrationId: this.collateralRegistrationObj.AppCollateralRegistrationId,
            OwnerName: this.collateralRegistrationObj.OwnerName,
            OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
            MrIdTypeCode: this.collateralRegistrationObj.MrIdTypeCode,
            OwnerMobilePhnNo: this.collateralRegistrationObj.OwnerMobilePhnNo,
            MrOwnerRelationshipCode: this.collateralRegistrationObj.MrOwnerRelationshipCode,
            UserName: this.collateralRegistrationObj.UserName,
            MrUserRelationshipCode: this.collateralRegistrationObj.MrUserRelationshipCode,
            RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion,
            SelfOwner: (this.collateralRegistrationObj.MrOwnerRelationshipCode == "SELF")
          });

          if (!IsExisting) {
            this.AddCollForm.patchValue({
              CollateralPrcnt: this.appCollateralObj.CollateralPrcnt
            });
          }

          if (this.AddCollForm.controls.MrUserRelationshipCode.value == "SELF") {
            this.AddCollForm.patchValue({
              SelfUsage: true
            })
          }

          // this.collateralPortionHandler();

          this.changeSerialNoValidators(this.appCollateralObj.MrCollateralConditionCode);
          await this.onItemChange(this.appCollateralObj.AssetTypeCode);
          this.inputLookupExistColl.nameSelect = this.appCollateralObj.FullAssetName;
          this.inputLookupExistColl.jsonSelect = { FullAssetName: this.appCollateralObj.FullAssetName };
          this.inputLookupColl.nameSelect = this.appCollateralObj.FullAssetName;
          this.inputLookupColl.jsonSelect = { FullAssetName: this.appCollateralObj.FullAssetName };
          // set data Location Address
          this.LocationAddrObj.Addr = this.collateralRegistrationObj.LocationAddr;
          this.LocationAddrObj.AreaCode1 = this.collateralRegistrationObj.LocationAreaCode1;
          this.LocationAddrObj.AreaCode2 = this.collateralRegistrationObj.LocationAreaCode2;
          this.LocationAddrObj.AreaCode3 = this.collateralRegistrationObj.LocationAreaCode3;
          this.LocationAddrObj.AreaCode4 = this.collateralRegistrationObj.LocationAreaCode4;
          this.LocationAddrObj.City = this.collateralRegistrationObj.LocationCity;
          this.inputFieldLocationObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.LocationZipcode;
          this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.LocationZipcode };
          this.inputAddressObjForLoc.default = this.LocationAddrObj;
          this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;
          // set data Owner Address
          this.OwnerAddrObj.Addr = this.collateralRegistrationObj.OwnerAddr;
          this.OwnerAddrObj.AreaCode1 = this.collateralRegistrationObj.OwnerAreaCode1;
          this.OwnerAddrObj.AreaCode2 = this.collateralRegistrationObj.OwnerAreaCode2;
          this.OwnerAddrObj.AreaCode3 = this.collateralRegistrationObj.OwnerAreaCode3;
          this.OwnerAddrObj.AreaCode4 = this.collateralRegistrationObj.OwnerAreaCode4;
          this.OwnerAddrObj.City = this.collateralRegistrationObj.OwnerCity;
          this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
          this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.OwnerZipcode };
          this.inputAddressObjForLegal.default = this.OwnerAddrObj;
          this.inputAddressObjForLegal.inputField = this.inputFieldLegalObj;
        })
    }
  }

  async collateralPortionHandler() {
    const fullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    const assetType = this.AddCollForm.controls["AssetTypeCode"].value;
    var serialNoForm = this.items.controls[0] as FormGroup;
    const serialNo1 = serialNoForm.controls["SerialNoValue"].value;
    const currCollPrcnt = this.AddCollForm.controls["CollateralPrcnt"].value;
    const currCollValue = this.AddCollForm.controls["CollateralValueAmt"].value;

    if (fullAssetCode && assetType && serialNo1) {
      await this.http.post(URLConstant.GetCollateralByFullAssetCodeAssetTypeSerialNoForAppCollateral, { FullAssetCode: fullAssetCode, AssetTypeCode: assetType, SerialNo1: serialNo1 }).toPromise().then(
        (response) => {
          var outCollPrcnt = 100;
          if (response) {
            if (response["CollateralPrcnt"]) {
              outCollPrcnt -= response["CollateralPrcnt"];
            }
          }
          outCollPrcnt -= currCollPrcnt;
          var collPortionAmt = currCollValue * (currCollPrcnt / 100);
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

  getExistingColl(event) {
    this.getAppCollData(0, event.AppCollateralId, true, true, event);
  }

  getLookupCollateral(e) {
    this.AddCollForm.patchValue({
      FullAssetCode: e.FullAssetCode,
      FullAssetName: e.FullAssetName,
      AssetCategoryCode: e.AssetCategoryCode
    });
    this.collateralPortionHandler();
  }

  resetCollateralName() {
    //#region reset Collateral Name
    this.inputLookupColl.nameSelect = "";
    this.inputLookupColl.jsonSelect = { FullAssetName: "" };
    this.AddCollForm.patchValue({
      FullAssetCode: "",
      FullAssetName: "",
      AssetCategoryCode: ""
    });
    //#endregion
  }

  async onItemChange(AssetTypeCode: string, IsChange: boolean = true, isFou: boolean = false, fouExistingObj: object = null) {
    let arrAddCrit = new Array();
    let addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = 'B.ASSET_TYPE_CODE';
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = AssetTypeCode;
    arrAddCrit.push(addCrit);
    this.inputLookupColl.addCritInput = arrAddCrit;
    this.ucLookupCollateral.setAddCritInput();

    if (this.AddCollForm.controls.MrCollateralConditionCode.value == "USED") {
      this.isUsed = true;
    } else {
      this.isUsed = false;
    }

    await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {Code: AssetTypeCode }).toPromise().then(
      async (response: GenericListObj) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }

        this.SerialNoList = response.ReturnObject;
        for (var i = 0; i < this.SerialNoList.length; i++) {
          var eachDataDetail = this.fb.group({
            SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
            SerialNoValue: [''],
            IsMandatory: [this.SerialNoList[i].IsMandatory]
          }) as FormGroup;
          // if(this.isExisting){ 
          //   eachDataDetail.controls.SerialNoValue.disable(); 
          // }
          this.items.push(eachDataDetail);
          if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
            this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }
        if (isFou) {
          for (var i = 0; i < this.items.controls.length; i++) {
            var formGroupItem = this.items.controls[i] as FormGroup;
            formGroupItem.patchValue({
              SerialNoValue: fouExistingObj["SerialNo" + (i + 1)]
            });
            this.items["controls"][i]["controls"]["SerialNoValue"].disable();
          }
        } else {
          if (this.appCollateralObj != null) {
            for (var i = 0; i < this.items.length; i++) {
              if (this.items.controls[i] != null) {
                this.items.controls[i]['controls']['SerialNoValue'].value = this.appCollateralObj["SerialNo" + (i + 1)];
                if (this.items.controls[i]["controls"]["SerialNoLabel"].value == "Chassis No") {
                  this.indexChassis = i;
                }
              }
            }
          }
        }
        await this.collateralPortionHandler();
      });

    await this.getRefAssetDocList(AssetTypeCode);

    //#region Criteria For inputLookupExistColl
    this.inputLookupExistColl.nameSelect = "";
    this.inputLookupExistColl.jsonSelect = { FullAssetName: "" };

    // let criteriaList = new Array();
    // this.criteriaObj = new CriteriaObj();
    // this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    // this.criteriaObj.propName = 'AC.ASSET_TYPE_CODE';
    // this.criteriaObj.value = AssetTypeCode;
    // criteriaList.push(this.criteriaObj);

    // // tambah filter cust no
    // this.criteriaObj = new CriteriaObj();
    // this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    // this.criteriaObj.propName = 'ACU.APP_CUST_ID';
    // this.criteriaObj.value = this.AppCustId.toString();
    // criteriaList.push(this.criteriaObj);

    this.criteriaList = new Array();
    this.criteriaObj = new CriteriaObj();
    this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    this.criteriaObj.propName = 'CU.CUST_NO';
    if (this.AppCustData.CustNo) {
      this.criteriaObj.value = this.AppCustData.CustNo;
      this.criteriaList.push(this.criteriaObj);
      this.inputLookupExistColl.addCritInput = this.criteriaList;
    }
    else {
      this.criteriaObj.value = "null";
      this.criteriaList.push(this.criteriaObj);
      this.inputLookupExistColl.addCritInput = this.criteriaList;
    }

    this.inputLookupExistColl.addCritInput = this.criteriaList;
    this.inputLookupExistColl.isReady = true;
    if (IsChange) this.ucLookupCollateralExisting.setAddCritInput();
    //#endregion
    this.GenerateAppCollateralAttr(false);
  }

  changeSerialNoValidators(MrCollateralConditionCode: string) {
    if (MrCollateralConditionCode == "USED") {
      this.isUsed = true;
    } else {
      this.isUsed = false;
    }
  }

  GetLegalAddr() {
    this.AppCustAddrObj = new AppCustAddrObj();
    this.http.post(URLConstant.GetCustDataByAppId, { "Id": this.AppId }).subscribe(
      response => {
        this.AppCustAddrObj = response['AppCustAddrLegalObj'];
      }
    );
  }

  async CopyUserForSelfUsage() {
    if (this.AddCollForm.controls.SelfUsage.value == true) {
      this.AddCollForm.controls.UserName.disable();
      this.AddCollForm.controls.MrUserRelationshipCode.disable();

      this.AppCustObj = new AppCustObj();
      this.AppCustCompanyObj = new AppCustCompanyObj();
      this.AppCustPersonalObj = new AppCustPersonalObj();

      var appObj = { "Id": this.AppId };
      await this.http.post(URLConstant.GetCustDataByAppId, appObj).toPromise().then(
        response => {
          this.AppCustObj = response['AppCustObj'];
          this.AppCustCompanyObj = response['AppCustCompanyObj'];
          this.AppCustPersonalObj = response['AppCustPersonalObj'];

          this.AddCollForm.patchValue({
            UserName: this.AppCustObj.CustName,
            MrUserRelationshipCode: "SELF"
          })
        }
      )
      this.AddCollForm.controls.UserName.clearValidators();
      this.AddCollForm.controls.UserName.updateValueAndValidity();
      this.AddCollForm.controls.MrUserRelationshipCode.clearValidators();
      this.AddCollForm.controls.MrUserRelationshipCode.updateValueAndValidity();
    }
    else {
      this.AddCollForm.controls.UserName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.AddCollForm.controls.UserName.updateValueAndValidity();
      this.AddCollForm.controls.MrUserRelationshipCode.setValidators([Validators.required, Validators.maxLength(50)]);
      this.AddCollForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.AddCollForm.controls.UserName.enable();
      this.AddCollForm.controls.MrUserRelationshipCode.enable();
    }
  }

  async CopyUserForSelfOwner() {
    if (this.AddCollForm.controls.SelfOwner.value == true) {

      this.AddCollForm.controls.OwnerName.disable();
      this.AddCollForm.controls.MrOwnerRelationshipCode.disable();
      this.AddCollForm.controls.OwnerMobilePhnNo.disable();
      this.AddCollForm.controls.MrIdTypeCode.disable();
      this.AddCollForm.controls.OwnerIdNo.disable();
      this.AddCollForm.controls.OwnerAddrObj.disable();

      this.AppCustObj = new AppCustObj();
      this.AppCustCompanyObj = new AppCustCompanyObj();
      this.AppCustAddrObj = new AppCustAddrObj();

      var appObj = { "Id": this.AppId };
      await this.http.post(URLConstant.GetCustDataByAppId, appObj).toPromise().then(
        response => {
          this.AppCustObj = response['AppCustObj'];
          this.AppCustCompanyObj = response['AppCustCompanyObj'];
          this.AppCustAddrObj = response['AppCustAddrLegalObj'];

          this.AddCollForm.patchValue({
            OwnerName: this.AppCustObj.CustName,
            MrOwnerRelationshipCode: "SELF",
            MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
            OwnerIdNo: this.AppCustObj.IdNo,
            OwnerMobilePhnNo: typeof (response['AppCustPersonalObj']) != 'undefined' ? response['AppCustPersonalObj']['MobilePhnNo1'] : ''
          })
          this.OwnerAddrObj.Addr = this.AppCustAddrObj.Addr
          this.OwnerAddrObj.AreaCode1 = this.AppCustAddrObj.AreaCode1
          this.OwnerAddrObj.AreaCode2 = this.AppCustAddrObj.AreaCode2
          this.OwnerAddrObj.AreaCode3 = this.AppCustAddrObj.AreaCode3
          this.OwnerAddrObj.AreaCode4 = this.AppCustAddrObj.AreaCode4
          this.OwnerAddrObj.City = this.AppCustAddrObj.City
          this.inputFieldLegalObj.inputLookupObj.nameSelect = this.AppCustAddrObj.Zipcode;
          this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.AppCustAddrObj.Zipcode };
          this.inputAddressObjForLegal.default = this.OwnerAddrObj;
          this.inputAddressObjForLegal.inputField = this.inputFieldLegalObj;
        }
      )

    }
    else {
      this.AddCollForm.controls.OwnerName.enable();
      this.AddCollForm.controls.MrOwnerRelationshipCode.enable();
      this.AddCollForm.controls.OwnerMobilePhnNo.enable();
      this.AddCollForm.controls.MrIdTypeCode.enable();
      this.AddCollForm.controls.OwnerIdNo.enable();
      this.AddCollForm.controls.OwnerAddrObj.enable();
    }
  }

  copyToLocation() {
    if(this.isCopy == true){
      this.LocationAddrObj.Addr = this.AppCustAddrObj.Addr;
      this.LocationAddrObj.AreaCode1 = this.AppCustAddrObj.AreaCode1;
      this.LocationAddrObj.AreaCode2 = this.AppCustAddrObj.AreaCode2;
      this.LocationAddrObj.AreaCode3 = this.AppCustAddrObj.AreaCode3;
      this.LocationAddrObj.AreaCode4 = this.AppCustAddrObj.AreaCode4;
      this.LocationAddrObj.City = this.AppCustAddrObj.City;
      this.LocationAddrObj.Fax = this.AppCustAddrObj.Fax;
      this.LocationAddrObj.FaxArea = this.AppCustAddrObj.FaxArea;
      this.LocationAddrObj.Phn1 = this.AppCustAddrObj.Phn1;
      this.LocationAddrObj.Phn2 = this.AppCustAddrObj.Phn2;
      this.LocationAddrObj.PhnArea1 = this.AppCustAddrObj.PhnArea1;
      this.LocationAddrObj.PhnArea2 = this.AppCustAddrObj.PhnArea2;
      this.LocationAddrObj.PhnExt1 = this.AppCustAddrObj.PhnExt1;
      this.LocationAddrObj.PhnExt2 = this.AppCustAddrObj.PhnExt2;
      this.LocationAddrObj.SubZipcode = this.AppCustAddrObj.SubZipcode;

      this.inputFieldLocationObj.inputLookupObj.nameSelect = this.AppCustAddrObj.Zipcode;
      this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.AppCustAddrObj };
      this.inputAddressObjForLoc.default = this.LocationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;
    }

  }

  async setOwnerRelationListDdl(){
    let res: Array<KeyValueObj> = new Array();
    if(this.AppCustPersonalObj.MrMaritalStatCode == 'MARRIED'){
      res.push(this.OwnerRelationList.find(x => x.Key == 'SPOUSE'));
    }
    res.push(this.OwnerRelationList.find(x => x.Key == 'SELF'));
    this.OwnerRelationList = res;
  }

  SaveForm() {
    const fullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    const assetType = this.AddCollForm.controls["AssetTypeCode"].value;
    var serialNoForm = this.items.controls[0] as FormGroup;
    const serialNo1 = serialNoForm.controls["SerialNoValue"].value;
    const currCollPrcnt = this.AddCollForm.controls["CollateralPrcnt"].value;
    const currCollValue = this.AddCollForm.controls["CollateralValueAmt"].value;
    if (!fullAssetCode) {
      this.toastr.warningMessage("Full Asset Code Must be Filled");
      return false;
    }
    if (!assetType) {
      this.toastr.warningMessage("Asset Type Code Must be Filled");
      return false;
    }
    if (!serialNo1) {
      this.toastr.warningMessage("Serial No 1 Must be Filled");
      return false;
    }
    if (!currCollPrcnt) {
      this.toastr.warningMessage("Collateral Portion Percentage Must be Filled");
      return false;
    }
    if (!currCollValue) {
      this.toastr.warningMessage("Collateral Amount Must be Filled");
      return false;
    }
    if (this.AddCollForm.controls["OutstandingCollPrcnt"].value < 0) {
      this.toastr.warningMessage("Collateral Portion Usage Cannot Exceed Outstanding Collateral Percentage");
      return false;
    }

    this.setCollateralInfo();
    this.setCollateralOwner();
    this.setCollateralLocation();
    this.setCollateralPercentage();
    this.setCollateralAttribute();
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
      this.appCollateralDoc.DocNo = this.AddCollForm.getRawValue().ListDoc[i].DocNo;
      this.appCollateralDoc.ExpiredDt = this.AddCollForm.getRawValue().ListDoc[i].ACDExpiredDt;
      this.appCollateralDoc.DocNotes = this.AddCollForm.getRawValue().ListDoc[i].DocNotes;
      this.appCollateralDoc.RowVersion = this.AddCollForm.getRawValue().ListDoc[i].RowVersion;
      this.listAppCollateralDocObj.AppCollateralDocObj.push(this.appCollateralDoc);
    }
    this.appCollateralDataObj.ListAppCollateralDocObj = this.listAppCollateralDocObj.AppCollateralDocObj;
    if (this.bizTemplateCode == CommonConstant.CFRFN4W) {
      if (this.IsUseDigitalization == "0" || this.IntegratorCheckBySystemGsValue == "1") {
        if (this.mode == 'add') {
          this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.outputValue.emit();

            });
        }
        else {
          this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.outputValue.emit();
            });
        }
      }
      else if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0") {
        if (this.IsIntegrator && this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value != "") {
          if (this.mode == 'add') {
            this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
              (response) => {
                this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDOMultiAsset, { AppId: this.AppId }).subscribe(
                  (response) => {
                    this.toastr.successMessage(response["message"]);
                    this.outputValue.emit();
                  });
              });
          }

          else {
            this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
              (response) => {
                this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDOMultiAsset, { AppId: this.AppId }).subscribe(
                  (response) => {

                    this.toastr.successMessage(response["message"]);
                    this.outputValue.emit();
                  });
              });
          }
        }
        else if (this.IsIntegrator && this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value == "") {
          if (confirm("Chassis No not filled, submit data without Integrator ?")) {
            if (this.mode == 'add') {
              this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
                (response) => {
                  this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDOMultiAsset, { AppId: this.AppId }).subscribe(
                    (response) => {
                      this.toastr.successMessage(response["message"]);
                      this.outputValue.emit();
                    });
                });
            }

            else {
              this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
                (response) => {
                  this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDOMultiAsset, { AppId: this.AppId }).subscribe(
                    (response) => {

                      this.toastr.successMessage(response["message"]);
                      this.outputValue.emit();
                    });
                });
            }
          }
        }
        else if (!this.IsIntegrator) {
          if (confirm("Submit without Integrator ?")) {
            if (this.mode == 'add') {
              this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
                (response) => {
                  this.toastr.successMessage(response["message"]);
                  this.outputValue.emit();
                });
            }

            else {
                this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
                  (response) => {
                    this.toastr.successMessage(response["message"]);
                    this.outputValue.emit();
                  });
            }
          }
        }

      }
    }
    else {
      if (this.mode == 'add') {
        this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.outputValue.emit();

          });
      }
      else {
        this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.outputValue.emit();
          });
      }
    }
  }

  Cancel() {
    this.outputValue.emit();
    this.outputCancel.emit();
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

  setCollateralInfo() {
    this.appCollateralDataObj.AppCollateralObj.AppId = this.AppId;
    this.appCollateralDataObj.AppCollateralObj.AppAssetId = null;
    this.appCollateralDataObj.AppCollateralObj.AgrmntId = null;
    this.appCollateralDataObj.AppCollateralObj.CollateralSeqNo = 1;
    this.appCollateralDataObj.AppCollateralObj.FullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    this.appCollateralDataObj.AppCollateralObj.FullAssetName = this.AddCollForm.controls["FullAssetName"].value.value;
    this.appCollateralDataObj.AppCollateralObj.CollateralValueAmt = this.AddCollForm.controls["CollateralValueAmt"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralNotes = this.AddCollForm.controls["CollateralNotes"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetTypeCode = this.AddCollForm.controls["AssetTypeCode"].value;
    if (this.AddCollForm.controls["CollateralStat"].value == null) {
      this.appCollateralDataObj.AppCollateralObj.CollateralStat = "NEW";
    } else {
      this.appCollateralDataObj.AppCollateralObj.CollateralStat = this.AddCollForm.controls["CollateralStat"].value;
    }
    this.appCollateralDataObj.AppCollateralObj.MrCollateralConditionCode = this.AddCollForm.controls["MrCollateralConditionCode"].value;
    this.appCollateralDataObj.AppCollateralObj.MrCollateralUsageCode = this.AddCollForm.controls["MrCollateralUsageCode"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetCategoryCode = this.AddCollForm.controls["AssetCategoryCode"].value;
    this.appCollateralDataObj.AppCollateralObj.ManufacturingYear = this.AddCollForm.controls["ManufacturingYear"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetTaxDt = this.AddCollForm.controls["AssetTaxDt"].value;
    this.appCollateralDataObj.AppCollateralObj.IsMainCollateral = true;

    for (var i = 0; i < this.items.length; i++) {
      if (this.items.controls[i] != null) {
        this.appCollateralDataObj.AppCollateralObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
      }
    }

    if (this.mode == 'edit') {
      this.appCollateralDataObj.AppCollateralObj.AppCollateralId = this.editAppCollateralObj.AppCollateralId;
      this.appCollateralDataObj.AppCollateralObj.RowVersion = this.editAppCollateralObj.RowVersion;
      this.appCollateralDataObj.AppCollateralRegistrationObj.AppCollateralRegistrationId = this.appCollateralObj.AppCollateralRegistrationId;
      this.appCollateralDataObj.AppCollateralRegistrationObj.AppCollateralId = this.editCollateralRegistrationObj.AppCollateralId;
      this.appCollateralDataObj.AppCollateralRegistrationObj.RowVersion = this.editCollateralRegistrationObj.RowVersion;
    }

  }

  setCollateralOwner() {
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.AddCollForm.controls["MrOwnerRelationshipCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.AddCollForm.controls["MrUserRelationshipCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.UserName = this.AddCollForm.controls["UserName"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerName = this.AddCollForm.controls["OwnerName"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AddCollForm.controls["MrIdTypeCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AddCollForm.controls["OwnerIdNo"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Addr.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode1.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode2.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode3.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode4.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerCity = this.AddCollForm.controls["OwnerAddrObj"]["controls"].City.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AddCollForm.controls["OwnerMobilePhnNo"].value;
  }

  setCollateralLocation() {
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAddr = this.AddCollForm.controls["LocationAddrObj"]["controls"].Addr.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AddCollForm.controls["LocationAddrObj"]["controls"].AreaCode1.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AddCollForm.controls["LocationAddrObj"]["controls"].AreaCode2.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AddCollForm.controls["LocationAddrObj"]["controls"].AreaCode3.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AddCollForm.controls["LocationAddrObj"]["controls"].AreaCode4.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationCity = this.AddCollForm.controls["LocationAddrObj"]["controls"].City.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AddCollForm.controls["LocationAddrObjZipcode"]["controls"].value.value;
  }

  setCollateralPercentage() {
    this.appCollateralDataObj.AppCollateralObj.CollateralPrcnt = this.AddCollForm.controls["CollateralPrcnt"].value;
  }
  refreshAttr() {
    this.isAssetAttrReady = false;
    this.GenerateAppCollateralAttr(true);
  }
}
