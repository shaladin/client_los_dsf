import { Component, OnInit, Output, ViewChild, Input, EventEmitter } from '@angular/core';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { AppCustCompanyObj } from 'app/shared/model/app-cust-company-obj.model';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { AppCollateralDataObj } from 'app/shared/model/app-collateral-data-obj.model';
import { AppCollateralDocObj } from 'app/shared/model/app-collateral-doc-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ListAppCollateralDocObj } from 'app/shared/model/list-app-collateral-doc-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { AppObj } from 'app/shared/model/app/app.model';
import { environment } from 'environments/environment';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppCollateralAttrCustomObj } from 'app/shared/model/app-collateral-attr-custom.model';
import { AppCollateralAttrObj } from 'app/shared/model/app-collateral-attr-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { String } from 'typescript-string-operations';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ResGeneralSettingObj, ResListGeneralSettingObj } from 'app/shared/model/response/general-setting/res-general-setting-obj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/app-collateral-registration-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { AssetTypeSerialNoLabelCustomObj } from 'app/shared/model/asset-type-serial-no-label-custom-obj.model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/app-cust-personal-job-data-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { RefAttrSettingObj } from 'app/shared/model/ref-attr-setting-obj.model';

@Component({
  selector: 'app-collateral-data-cfna-detail',
  templateUrl: './collateral-data-cfna-detail.component.html',
  styles: []
})
export class CollateralDataCfnaDetailComponent implements OnInit {
  @ViewChild('LookupCollateral') ucLookupCollateral: UclookupgenericComponent;
  @Input() mode: string = "add";
  @Input() isSingleAsset = true;
  @Input() AppId: number = 0;
  @Input() AppCollateralId: number = 0;
  @Output() outputValue: EventEmitter<number> = new EventEmitter<number>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  readonly ownerTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly ownerTypeCompany: string = CommonConstant.CustTypeCompany;
  inputLookupExistColl: InputLookupObj = new InputLookupObj();
  inputLookupColl: InputLookupObj = new InputLookupObj();
  inputFieldLegalObj: InputFieldObj = new InputFieldObj();
  inputFieldLocationObj: InputFieldObj = new InputFieldObj();
  LocationAddrObj: AddrObj = new AddrObj();

  ListAttrAnswer = [];

  isAssetAttrReady: boolean = false;
  AppCollateralAttrObjs: Array<AppCollateralAttrCustomObj>;
  AppCollateralAttrObj: Array<AppCollateralAttrCustomObj>;
  AppCustObj: AppCustObj = new AppCustObj();
  AppCustAddrObj: AppCustAddrObj = new AppCustAddrObj();
  AppCustCompanyObj: AppCustCompanyObj = new AppCustCompanyObj();
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
  SerialNoList: Array<AssetTypeSerialNoLabelCustomObj>;
  isUsed: boolean = true;
  isCopy: boolean = true;
  isExisting : boolean = false;
  AddCollForm = this.fb.group({
    AppCollateralId: [0],
    FullAssetCode: ['', Validators.required],
    MrCollateralConditionCode: ['', Validators.required],
    MrCollateralUsageCode: ['', Validators.required],
    CollateralStat: ['NEW', Validators.required],
    CollateralValueAmt: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
    AssetTypeCode: ['', Validators.required],
    AssetCategoryCode: ['', Validators.required],
    AssetTaxCode: [''],
    CollateralNotes: [''],
    OwnerProfessionCode: [''],
    CollateralPrcnt: [0, [Validators.required, Validators.max(100), Validators.min(0)]],
    IsMainCollateral: true,
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    CollateralNo: [''],
    AssetTaxDt: [''],
    UserName: ['', Validators.required],
    MrUserRelationshipCode: [''],
    OwnerMobilePhnNo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    OwnerName: ['', Validators.required],
    OwnerIdNo: ['', Validators.required],
    MrIdTypeCode: [''],
    MrOwnerRelationshipCode: [''],
    Notes: [''],
    ListDoc: this.fb.array([]),
    ListAttr: this.fb.array([]),
    OwnerRelationship: [''],
    MrIdType: [''],
    CopyFromLegal: [''],
    AppAttrName: [''],
    SelfUsage: [false],
    SelfOwner: [false],
    MrOwnerTypeCode: [""],
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
  AppData: AppObj;
  AppCustData: AppCustObj = new AppCustObj();
  inputAddressObjForOwner: InputAddressObj;
  inputAddressObjForLoc: InputAddressObj;
  isDiffWithRefAttr: boolean = false;
  generalSettingObj: GenericListByCodeObj;
  IntegratorCheckBySystemGsValue: string = "1";
  IsUseDigitalization: string;
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  IsSvcExist: boolean = false;
  currentChassisNo: string = "";
  LastRequestedDate: string = "";
  indexChassis: number = 0  ;
  IsIntegrator: boolean = false;
  listCollTypeMandatoryManufacturingYear: Array<string> = new Array<string>();
  isMandatoryManufacturingYear: boolean = false;

  AppCustPersonalJobData: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();


  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: NGXToastrService) { }

  async ngOnInit() {
    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.showAllPhn = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;

    this.items = this.AddCollForm.get('items') as FormArray;

    this.GetLegalAddr();
    this.initUcLookup();
    await this.SetManufacturingYearMandatory();
    await this.bindOwnerTypeObj();
    await this.bindCompanyTypeObj();
    await this.GetGS();
    await this.initDropdownList();
    await this.getAppData();

    if (this.mode == "edit") {
      await this.getAppCollData(0, this.AppCollateralId, false, false, new Object());
    }
    this.SetRefAttrSettingObj();

    // if (this.isSingleAsset) {
    //   this.getAppCollData(this.AppId, 0);
    // }

    // SEMENTARA DI COMMENT BUAT CFNA
    // this.AddCollForm.controls.AssetTypeCode.disable();

  }

  OwnerTypeObj: Array<KeyValueObj> = new Array();
  async bindOwnerTypeObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType }).subscribe(
      (response) => {
        this.OwnerTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  OwnerProfessionObj: Array<KeyValueObj> = new Array();
  async bindCompanyTypeObj(){
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).toPromise().then(
      (response) => {
        this.OwnerProfessionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async OwnerTypeChange(OwnerType: string, IsOwnerTypeChanged: boolean = false) {
    if (OwnerType == CommonConstant.CustTypePersonal) {
      if (IsOwnerTypeChanged) {
        this.AddCollForm.patchValue({
          OwnerProfessionCode: ""
        });

        this.InputLookupProfessionObj.nameSelect = "";
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
      } else {
        await this.http.post(URLConstant.GetRefProfessionByCode, { Code: this.collateralRegistrationObj.OwnerProfessionCode }).toPromise().then(
          (response) => {
            this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response["ProfessionName"] };
          }
        );
      }
    } else {
      if (IsOwnerTypeChanged) {
        this.AddCollForm.patchValue({
          OwnerProfessionCode: ""
        });
      } else {
        this.AddCollForm.patchValue({
          OwnerProfessionCode: this.collateralRegistrationObj.OwnerProfessionCode
        });
      }
    }
  }

  setCollateralAttribute() {
    console.log("adwadawfawf")
    //if (this.AppCollateralAttrObj != null) {
      this.appCollateralDataObj.AppCollateralAttrObj = new Array<AppCollateralAttrObj>();
      for (let i = 0; i < this.AddCollForm.controls["AppCollateralAttrObjs"].value.length; i++) {
        var appCollAttrcObj = new AppCollateralAttrObj();
        appCollAttrcObj.CollateralAttrName = this.AddCollForm.controls["AppCollateralAttrObjs"].value[i].AttrName;
        appCollAttrcObj.CollateralAttrCode = this.AddCollForm.controls["AppCollateralAttrObjs"].value[i].AttrCode;
        appCollAttrcObj.AttrValue = this.AddCollForm.controls["AppCollateralAttrObjs"].value[i].AttrValue;

        this.appCollateralDataObj.AppCollateralAttrObj.push(appCollAttrcObj);
      }
    //}
  }

  initUcLookup() {
    this.inputLookupExistColl.urlJson = "./assets/uclookup/NAP/lookupAppCollateralCFNA.json";
    this.inputLookupExistColl.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupExistColl.pagingJson = "./assets/uclookup/NAP/lookupAppCollateralCFNA.json";
    this.inputLookupExistColl.genericJson = "./assets/uclookup/NAP/lookupAppCollateralCFNA.json";
    this.inputLookupExistColl.isRequired = false;

    this.inputLookupColl.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupColl.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupColl.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupColl.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";

    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isRequired = false;
    this.InputLookupProfessionObj.isReady = true;

    // this.criteriaList = new Array();
    // this.criteriaObj = new CriteriaObj();
    // this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    // this.criteriaObj.propName = 'apctrl.ASSET_TYPE_CODE';
    // this.criteriaObj.value = this.AssetTypeCode;
    // this.criteriaList.push(this.criteriaObj);
  }

  async initDropdownList() {
    this.http.post(URLConstant.GetAssetTypeListKeyValueActiveByCode, {}).subscribe(
      async (response) => {
        this.CollTypeList = response[CommonConstant.ReturnObj];
        this.CollTypeList.sort((a,b) => a.Key.localeCompare(b.Key));
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            AssetTypeCode: this.CollTypeList[0].Key
          });
          // SEMENTARA DI COMMENT BUAT CFNA
          await this.onItemChange(this.AddCollForm.controls.AssetTypeCode.value, true)
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetCondition }).subscribe(
      (response) => {
        this.CollConditionList = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            MrCollateralConditionCode: this.CollConditionList[1].Key
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

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).subscribe(
      (response) => {
        this.OwnerRelationList = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          if (this.OwnerRelationList.length > 0) {
            this.AddCollForm.patchValue({
              MrOwnerRelationshipCode: this.OwnerRelationList[0].Key,
              MrUserRelationshipCode: this.OwnerRelationList[0].Key,
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

  
  async GenerateAppCollateralAttr(isRefresh : boolean) {
    var GenObj =
    {
      AppCollateralId: this.AppCollateralId,
      AssetTypeCode: this.AddCollForm.controls["AssetTypeCode"].value,
      AttrTypeCode : CommonConstant.AttrTypeCodeTrx,
      IsRefresh : isRefresh
    };
    this.http.post(URLConstant.GenerateAppCollateralAttr, GenObj).subscribe(
      (response) => {
         this.AppCollateralAttrObj = response['ResponseAppCollateralAttrObjs'];
        if(response['IsDiffWithRefAttr']){
          this.isDiffWithRefAttr = true;
          this.toastr.warningMessage(ExceptionConstant.REF_ATTR_CHANGE);
        }

        //this.GenerateAppCollateralAttrForm();
      });
  }
  GenerateAppCollateralAttrForm() {
    if (this.AppCollateralAttrObj != null) {
      this.AppCollateralAttrObjs = new Array<AppCollateralAttrCustomObj>();
      this.ListAttrAnswer = [];
      for (let i = 0; i < this.AppCollateralAttrObj.length; i++) {
        this.ListAttrAnswer[i] = [];
        var AppCollateralAttrObj = new AppCollateralAttrCustomObj();
        AppCollateralAttrObj.CollateralAttrCode = this.AppCollateralAttrObj[i].AttrCode;
        AppCollateralAttrObj.CollateralAttrName = this.AppCollateralAttrObj[i].AttrName;
        AppCollateralAttrObj.AttrValue = this.AppCollateralAttrObj[i].AttrValue;
        AppCollateralAttrObj.AttrInputType = this.AppCollateralAttrObj[i].AttrInputType;
        AppCollateralAttrObj.AttrLength = this.AppCollateralAttrObj[i].AttrLength;
        AppCollateralAttrObj.IsMandatory = this.AppCollateralAttrObj[i].IsMandatory;
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
      while(listAppAssetAttrs.length !== 0){
        listAppAssetAttrs.removeAt(0);
      }
      for (let j = 0; j < this.AppCollateralAttrObjs.length; j++) {
        listAppAssetAttrs.push(this.addGroupAppCollateralAttr(this.AppCollateralAttrObjs[j], j));
      }
      this.isAssetAttrReady = true;
    }
  }
  
  addGroupAppCollateralAttr(AppCollateralAttrObjs, i) {
    if(AppCollateralAttrObjs.AttrInputType == 'L') {
      return this.fb.group({
        No: [i],
        AssetAttrCode: [AppCollateralAttrObjs.CollateralAttrCode],
        AssetAttrName: [AppCollateralAttrObjs.CollateralAttrName],
        AttrInputType: [AppCollateralAttrObjs.AttrInputType],
        IsMandatory: [AppCollateralAttrObjs.IsMandatory],
        AttrValue: [AppCollateralAttrObjs.AttrValue, AppCollateralAttrObjs.IsMandatory ? [Validators.required] : []]
      })
    }
    else {
      var arrValidators = [Validators.maxLength(AppCollateralAttrObjs.AttrLength)];
      if(AppCollateralAttrObjs.IsMandatory) arrValidators.push(Validators.required)
      return this.fb.group({
        No: [i],
        AssetAttrCode: [AppCollateralAttrObjs.CollateralAttrCode],
        AssetAttrName: [AppCollateralAttrObjs.CollateralAttrName],
        AttrInputType: [AppCollateralAttrObjs.AttrInputType],
        IsMandatory: [AppCollateralAttrObjs.IsMandatory],
        AttrValue: [AppCollateralAttrObjs.AttrValue, arrValidators]
      })
    }
  }

  async getAppData() {
    await this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response: AppObj) => {
        this.AppData = response;
        
        this.AddCollForm.patchValue({
          MrOwnerTypeCode: this.AppData.MrCustTypeCode
        });

        this.http.post(URLConstant.GetAppCustByAppId, { Id: this.AppId }).toPromise().then(
          (response: AppCustObj) => {
            this.AppCustData = response;
            this.criteriaList = new Array();
            this.criteriaObj = new CriteriaObj();
            this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
            this.criteriaObj.propName = 'CU.CUST_NO';
            if(this.AppCustData.CustNo){
              this.criteriaObj.value = this.AppCustData.CustNo;
              this.criteriaList.push(this.criteriaObj);
              this.inputLookupExistColl.addCritInput = this.criteriaList;
            }
            else{
              this.criteriaObj.value = "null";
              this.criteriaList.push(this.criteriaObj);
              this.inputLookupExistColl.addCritInput = this.criteriaList;
            }
            this.inputLookupExistColl.isReady = true;

            if(this.AppCustData.MrCustTypeCode == CommonConstant.CustTypeCompany){
              this.AddCollForm.controls.OwnerMobilePhnNo.clearValidators();
              this.AddCollForm.controls.OwnerMobilePhnNo.updateValueAndValidity();
            }
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        );
        this.getProdOffering(response.ProdOfferingCode, response.ProdOfferingVersion);
      });
  }

  getProdOffering(ProdOfferingCode, ProdOfferingVersion) {
    var ProdOfferingObj = {
      ProdOfferingCode: ProdOfferingCode,
      ProdOfferingVersion: ProdOfferingVersion,
    };
    // this.http.post(URLConstant.GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion, ProdOfferingObj).subscribe(
    //   (response) => {
    //     var temp = response["ListProdOfferingDObj"];
    //     var LobCode: string = "";
    //     for (var i = 0; i < temp.length; i++) {
    //       if (temp[i].RefProdCompntCode == "ASSETTYPE") {
    //         LobCode = temp[i].CompntValue;
    //       }
    //     }
    //     this.AssetTypeCode = LobCode;
        // this.AddCollForm.patchValue({
        //   AssetTypeCode: this.AssetTypeCode
        // });
        // SEMENTARA DI COMMENT BUAT CFNA
        // this.onItemChange(this.AssetTypeCode);
        // Generate Collateral Doc
        // this.getRefAssetDocList();
      // });
  }

  getRefAssetDocList(isInit: boolean) {
    this.http.post(URLConstant.GetRefAssetDocList, { Code: this.AddCollForm.get("AssetTypeCode").value }).subscribe(
      (response) => {
        //console.log("getRefAssetDocList: " + JSON.stringify(response));
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
            if(this.isExisting){
              assetDocumentDetail.controls.DocNo.disable();
              assetDocumentDetail.controls.IsReceived.disable();
              assetDocumentDetail.controls.ACDExpiredDt.disable();
              assetDocumentDetail.controls.DocNotes.disable(); 
            }
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
          for (let i = 0; i < AppCollateralDocs.length; i++) {
            const tempForm = this.AddCollForm.controls.ListDoc["controls"][i];
            if (tempForm) {
              tempForm.patchValue({
                DocNo: AppCollateralDocs[i].DocNo,
                DocNotes: AppCollateralDocs[i].DocNotes,
                ACDExpiredDt: AppCollateralDocs[i].ExpiredDt == null ? "" : formatDate(AppCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                IsReceived: AppCollateralDocs[i].IsReceived,
                RowVersion: AppCollateralDocs[i].RowVersion,
              });
            }
          }
        }
      });
  }

  collateralPortionHandler(){
    const fullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    const assetType = this.AddCollForm.controls["AssetTypeCode"].value;
    var serialNoForm = this.items.controls[0] as FormGroup;
    const serialNo1 = serialNoForm.controls["SerialNoValue"].value;
    const currCollPrcnt = this.AddCollForm.controls["CollateralPrcnt"].value;
    const currCollValue = this.AddCollForm.controls["CollateralValueAmt"].value;

    if(fullAssetCode && assetType && serialNo1){
      this.http.post(URLConstant.GetCollateralByFullAssetCodeAssetTypeSerialNoForAppCollateral, { FullAssetCode: fullAssetCode, AssetTypeCode: assetType, SerialNo1: serialNo1 }).toPromise().then(
        (response) => {
          var outCollPrcnt = 100;
          if(response){
            if(response["CollateralPrcnt"]){
              outCollPrcnt -= response["CollateralPrcnt"]; 
            }
          }
          outCollPrcnt -= currCollPrcnt;
          
          if(outCollPrcnt < 0 || currCollPrcnt < 0){
            if(outCollPrcnt != 100){
              this.AddCollForm.controls['CollateralPrcnt'].setValidators([Validators.required, Validators.max(100 - response["CollateralPrcnt"]), Validators.min(0)]);
              this.AddCollForm.controls.CollateralPrcnt.updateValueAndValidity(); 
            } 
          } 

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

  async getAppCollData(AppId: number = 0, AppCollateralId: number = 0, IsExisting: boolean = false, IsFromLookup: boolean, response: object) {
    if (IsFromLookup) {
      this.AddCollForm.patchValue({
        AppCollateralId: AppCollateralId,
        AssetTypeCode: response["AssetTypeCode"],
        FullAssetCode: response["FullAssetCode"],
        AssetCategoryCode: response["AssetCategoryCode"],
        MrCollateralConditionCode: response["MrCollateralConditionCode"],
        MrCollateralUsageCode: response["MrCollateralUsageCode"],
        CollateralValueAmt: response["CollateralPriceAmt"],
        CollateralNotes: response["Notes"],
        AssetTaxDt: response["AssetTaxDate"] ? formatDate(response["AssetTaxDate"], 'yyyy-MM-dd', 'en-US') : "",
        // CollateralPrcnt: response["CollateralPrcnt"],
        // IsMainCollateral: this.appCollateralObj.IsMainCollateral,
        // ManufacturingYear: this.appCollateralObj.ManufacturingYear,
        // RowVersionCollateral: this.appCollateralObj.RowVersion,

        // AppCollateralRegistrationId: this.collateralRegistrationObj.AppCollateralRegistrationId,
        OwnerName: response["OwnerName"],
        OwnerIdNo: response["OwnerIdNo"],
        MrIdTypeCode: response["MrIdTypeCode"],
        OwnerMobilePhnNo: response["OwnerMobilePhnNo"],
        MrOwnerRelationshipCode: response["MrOwnerRelationshipCode"],
        UserName: response["Username"],
        MrUserRelationshipCode: response["MrUserRelationshipCode"],
        SelfOwner: response["MrOwnerRelationshipCode"] == CommonConstant.SelfCustomer ? true : false,
        MrOwnerTypeCode: response["MrOwnerTypeCode"]
        // RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion
      });
      await this.onItemChange(response["AssetTypeCode"], true);

      this.CopyUserForSelfOwner();
      
      for (var i = 0; i < this.items.controls.length; i++) {
        var formGroupItem = this.items.controls[i] as FormGroup;
        formGroupItem.patchValue({
          SerialNoValue: response["SerialNo"+(i+1)]
        });    
            this.items["controls"][i]["controls"]["SerialNoValue"].disable(); 
      }

      if (this.AddCollForm.controls.MrUserRelationshipCode.value == CommonConstant.SelfCustomer) {
        this.AddCollForm.patchValue({
          SelfUsage: true
        })
      }

      // this.changeSerialNoValidators(this.appCollateralObj.MrCollateralConditionCode);
      this.changeSerialNoValidators(response["MrCollateralConditionCode"]);
      this.inputLookupExistColl.nameSelect = response["FullAssetName"];
      this.inputLookupExistColl.jsonSelect = { FullAssetName: response["FullAssetName"] };
      this.inputLookupColl.nameSelect = response["FullAssetName"];
      this.inputLookupColl.jsonSelect = { FullAssetName: response["FullAssetName"] };
      // set data Location Address
      this.LocationAddrObj.Addr = response["LocationAddr"];
      this.LocationAddrObj.AreaCode1 = response["LocationAreaCode1"];
      this.LocationAddrObj.AreaCode2 = response["LocationAreaCode2"];
      this.LocationAddrObj.AreaCode3 = response["LocationAreaCode3"];
      this.LocationAddrObj.AreaCode4 = response["LocationAreaCode4"];
      this.LocationAddrObj.City = response["LocationCity"];
      this.inputFieldLocationObj.inputLookupObj.nameSelect = response["LocationZipcode"];
      this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: response["LocationZipcode"] };
      this.inputAddressObjForLoc.default = this.LocationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;
      // set data Owner Address
      this.OwnerAddrObj.Addr = response["OwnerAddr"];
      this.OwnerAddrObj.AreaCode1 = response["OwnerAreaCode1"];
      this.OwnerAddrObj.AreaCode2 = response["OwnerAreaCode2"];
      this.OwnerAddrObj.AreaCode3 = response["OwnerAreaCode3"];
      this.OwnerAddrObj.AreaCode4 = response["OwnerAreaCode4"];
      this.OwnerAddrObj.City = response["OwnerCity"];
      this.inputFieldLegalObj.inputLookupObj.nameSelect = response["OwnerZipcode"];
      this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: response["OwnerZipcode"] };
      this.inputAddressObjForOwner.default = this.OwnerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldLegalObj;
    
      this.isExisting = true;
      this.isCopy=false;   
      this.AddCollForm.controls.AssetTypeCode.disable();
      if (response["ManufacturingYear"]) this.AddCollForm.controls.ManufacturingYear.disable();
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
      this.AddCollForm.controls.MrOwnerTypeCode.disable(); 
      this.inputAddressObjForOwner.isReadonly = true;
      this.inputAddressObjForLoc.isReadonly = true; 
      this.AddCollForm.patchValue({
        CollateralStat: CommonConstant.AssetStatExisting
        });

      this.collateralPortionHandler();
    }
    else {
      if (this.mode == "edit") {
        await this.http.post(URLConstant.GetAppCollateralAndRegistrationByAppCollateralId, { AppId: AppId, AppCollateralId: AppCollateralId }).toPromise().then(
          async (response) => {
            this.appCollateralObj = response['AppCollateral'];
            //console.log("appCollateralObj: " + JSON.stringify(this.appCollateralObj));
            this.collateralRegistrationObj = response['AppCollateralRegistration'];
            this.editAppCollateralObj = response['AppCollateral'];
            this.editCollateralRegistrationObj = response['AppCollateralRegistration'];
            this.AddCollForm.patchValue({
              CollateralStat: this.editAppCollateralObj.CollateralStat
            });
            this.AddCollForm.patchValue({
              AppCollateralId: this.appCollateralObj.AppCollateralId,
              AssetTypeCode: this.appCollateralObj.AssetTypeCode,
              FullAssetCode: this.appCollateralObj.FullAssetCode,
              AssetCategoryCode: this.appCollateralObj.AssetCategoryCode,
              MrCollateralConditionCode: this.appCollateralObj.MrCollateralConditionCode,
              MrCollateralUsageCode: this.appCollateralObj.MrCollateralUsageCode,
              CollateralValueAmt: this.appCollateralObj.CollateralValueAmt,
              CollateralNotes: this.appCollateralObj.CollateralNotes,
              AssetTaxDt: formatDate(this.appCollateralObj.AssetTaxDt, 'yyyy-MM-dd', 'en-US'),
              CollateralPrcnt: this.appCollateralObj.CollateralPrcnt,
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
              SelfOwner: (this.collateralRegistrationObj.MrOwnerRelationshipCode == CommonConstant.SelfCustomer),
              OwnerProfessionCode: this.collateralRegistrationObj.OwnerProfessionCode,
              MrOwnerTypeCode: this.collateralRegistrationObj.MrOwnerTypeCode
            });
            this.ChangeMrIdTypeCode(this.AddCollForm.controls.MrIdTypeCode.value);
            //this.GenerateAppCollateralAttr(false);
            for (var i = 0; i < this.items.controls.length; i++) {
              var formGroupItem = this.items.controls[i] as FormGroup;
              formGroupItem.patchValue({
                SerialNoValue: this.appCollateralObj["SerialNo"+(i+1)]
              });    
            }
            // this.collateralPortionHandler();

            if (this.AddCollForm.controls.MrUserRelationshipCode.value == CommonConstant.SelfCustomer) {
              this.AddCollForm.patchValue({
                SelfUsage: true
              })
            }

            this.changeSerialNoValidators(this.appCollateralObj.MrCollateralConditionCode);
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
            this.inputAddressObjForOwner.default = this.OwnerAddrObj;
            this.inputAddressObjForOwner.inputField = this.inputFieldLegalObj;
            // set data lookup profession
            await this.GetProfessionName(this.collateralRegistrationObj.OwnerProfessionCode);
            this.InputLookupProfessionObj.nameSelect = this.AppCustPersonalJobData.MrProfessionName;
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: this.AppCustPersonalJobData.MrProfessionName }
            this.InputLookupProfessionObj.isDisable = true;

            await this.onItemChange(this.appCollateralObj.AssetTypeCode, true);

            if(this.appCollateralObj['CollateralStat'] == CommonConstant.AssetStatExisting){
              this.isExisting = true;
              this.isCopy=false;   
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
              this.AddCollForm.controls.MrOwnerTypeCode.disable(); 
              this.inputAddressObjForOwner.isReadonly = true;
              this.inputAddressObjForLoc.isReadonly = true; 
            }

            if(this.AddCollForm.controls.SelfOwner.value) {
              this.AddCollForm.controls.OwnerName.disable();
              this.AddCollForm.controls.MrOwnerRelationshipCode.disable();
              this.AddCollForm.controls.OwnerMobilePhnNo.disable();
              this.AddCollForm.controls.MrIdTypeCode.disable();
              this.AddCollForm.controls.OwnerIdNo.disable();
              this.AddCollForm.controls.OwnerAddrObj.disable();
              this.AddCollForm.controls.MrOwnerTypeCode.disable(); 
              this.InputLookupProfessionObj.isDisable = true;
            }

            if(this.AddCollForm.controls.SelfUsage.value) {
              this.AddCollForm.controls.UserName.disable();
              this.AddCollForm.controls.MrUserRelationshipCode.disable();
            }
 
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
    this.CheckManufacturingYearMandatory();
    this.SetRefAttrSettingObj();
  }

  async getExistingColl(event) {
    await this.getAppCollData(0, this.AppCollateralId, true, true, event);
  }

  getLookupCollateral(e) {
    this.AddCollForm.patchValue({
      FullAssetCode: e.FullAssetCode,
      FullAssetName: e.FullAssetName,
      AssetCategoryCode: e.AssetCategoryCode
    });
    this.collateralPortionHandler();
  }

  GetProfession(event) {
    this.AddCollForm.patchValue({
      OwnerProfessionCode: event.ProfessionCode
    });
  }

  async onItemChange(AssetTypeCode: string, isInit: boolean = false) {
    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = 'B.ASSET_TYPE_CODE';
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = AssetTypeCode;
    arrAddCrit.push(addCrit);
    this.inputLookupColl.addCritInput = arrAddCrit;
    this.ucLookupCollateral.setAddCritInput();

    if (this.AddCollForm.controls.MrCollateralConditionCode.value == CommonConstant.AssetConditionUsed) {
      this.isUsed = true;
    } else {
      this.isUsed = false;
    }

    await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {Code: AssetTypeCode }).toPromise().then(
      (response: GenericListObj) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }

        this.SerialNoList = response[CommonConstant.ReturnObj];
        for (var i = 0; i < this.SerialNoList.length; i++) {
          var eachDataDetail = this.fb.group({
            SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
            SerialNoValue: [''],
            IsMandatory: [this.SerialNoList[i].IsMandatory]
          }) as FormGroup;
          this.items.push(eachDataDetail);
          if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
            this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
            // this.items.controls[i]['controls']['SerialNoValue'].disable();
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }

        if (this.appCollateralObj != null) {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items.controls[i] != null) {
              this.items.controls[i]['controls']['SerialNoValue'].value = this.appCollateralObj["SerialNo" + (i + 1)];
            }
            if(this.appCollateralObj['CollateralStat'] == CommonConstant.AssetStatExisting){
              this.items["controls"][i]["controls"]["SerialNoValue"].disable(); 
            }
            if (this.items.controls[i]["controls"]["SerialNoLabel"].value == "Chassis No") {
              this.indexChassis = i;
            }
          }
        }
        if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0" && this.IsSvcExist) {
          this.GetThirdPartyResultH();
        }
        this.AssetTypeCode = AssetTypeCode;
        var listDocExisting = this.AddCollForm.get('ListDoc') as FormArray;
        listDocExisting.reset();
        while(listDocExisting.length !== 0){
          listDocExisting.removeAt(0);
        }
        this.getRefAssetDocList(isInit);
        this.collateralPortionHandler();
      });
      //this.GenerateAppCollateralAttr(false);

      this.CheckManufacturingYearMandatory();
      this.SetRefAttrSettingObj();
  }

  changeSerialNoValidators(MrCollateralConditionCode: string) {
    if (MrCollateralConditionCode == CommonConstant.AssetConditionUsed) {
      this.isUsed = true;
    } else {
      this.isUsed = false;
    }
  }

  ChangeMrIdTypeCode(MrIdTypeCode: string){
    if (MrIdTypeCode == CommonConstant.MrIdTypeCodeEKTP) {
      this.AddCollForm.controls.OwnerIdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(16), Validators.maxLength(16)]);
      this.AddCollForm.controls.OwnerIdNo.updateValueAndValidity();
    }
    else {
      this.AddCollForm.controls.OwnerIdNo.setValidators(Validators.required);
      this.AddCollForm.controls.OwnerIdNo.updateValueAndValidity();
    }
  }

  async GetThirdPartyResultH() {
    var ChassisNoValue = this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value;
    await this.http.post(URLConstant.GetAppAssetFromThirdPartyResultHByTrxTypeCodeAndTrxNoAndChassisNoForFraudChecking, { TrxNo: this.AppData.AppNo, TrxTypeCode: "APP", ChassisNo: ChassisNoValue }).toPromise().then(
      (response) => {
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
          this.getDigitalizationSvcType();
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
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

  GetLegalAddr() {
    this.AppCustAddrObj = new AppCustAddrObj();
    this.http.post(URLConstant.GetCustDataByAppId, { "Id": this.AppId }).subscribe(
      response => {
        this.AppCustAddrObj = response['AppCustAddrLegalObj'];
      }
    );
  }

  CopyUserForSelfUsage() {
    if (this.AddCollForm.controls.SelfUsage.value == true) {
      this.AddCollForm.controls.UserName.disable();
      this.AddCollForm.controls.MrUserRelationshipCode.disable();

      this.AppCustObj = new AppCustObj();
      this.AppCustCompanyObj = new AppCustCompanyObj();

      var appObj = { "Id": this.AppId };
      this.http.post(URLConstant.GetCustDataByAppId, appObj).subscribe(
        response => {
          this.AppCustObj = response['AppCustObj'];
          this.AppCustCompanyObj = response['AppCustCompanyObj'];
          this.AddCollForm.patchValue({
            UserName: this.AppCustObj.CustName,
            MrUserRelationshipCode: CommonConstant.SelfCustomer
          })
        }
      )
      this.AddCollForm.controls.UserName.clearValidators();
      this.AddCollForm.controls.UserName.updateValueAndValidity();
      this.AddCollForm.controls.MrUserRelationshipCode.clearValidators();
      this.AddCollForm.controls.MrUserRelationshipCode.updateValueAndValidity();
    }
    else {
      this.AddCollForm.controls.UserName.setValidators([Validators.required, Validators.maxLength(500)]);
      this.AddCollForm.controls.UserName.updateValueAndValidity();
      this.AddCollForm.controls.MrUserRelationshipCode.setValidators([Validators.required, Validators.maxLength(50)]);
      this.AddCollForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.AddCollForm.controls.UserName.enable();
      this.AddCollForm.controls.MrUserRelationshipCode.enable();
    }
  }

  async CopyUserForSelfOwner() {
    if (this.AddCollForm.controls.SelfOwner.value == true) 
    {
      this.AddCollForm.controls.OwnerName.disable();
      this.AddCollForm.controls.MrOwnerTypeCode.disable();
      this.AddCollForm.controls.MrOwnerRelationshipCode.disable();
      this.AddCollForm.controls.OwnerMobilePhnNo.disable();
      this.AddCollForm.controls.MrIdTypeCode.disable();
      this.AddCollForm.controls.OwnerIdNo.disable();
      this.AddCollForm.controls.OwnerAddrObj.disable();
      this.InputLookupProfessionObj.isDisable = true;

      this.AppCustObj = new AppCustObj();
      this.AppCustCompanyObj = new AppCustCompanyObj();
      this.AppCustAddrObj = new AppCustAddrObj();

      var appObj = { "Id": this.AppId };
      await this.http.post(URLConstant.GetCustDataByAppId, appObj).toPromise().then(
        async response => {
          this.AppCustObj = response['AppCustObj'];
          this.AppCustCompanyObj = response['AppCustCompanyObj'];
          this.AppCustAddrObj = response['AppCustAddrLegalObj'];
          this.AppCustPersonalJobData = response['AppCustPersonalJobDataObj'];

          this.AddCollForm.patchValue({
            OwnerName: this.AppCustObj.CustName,
            MrOwnerRelationshipCode: CommonConstant.SelfCustomer,
            MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
            MrOwnerTypeCode: this.AppCustObj.MrCustTypeCode,
            OwnerIdNo: this.AppCustObj.IdNo,
            OwnerMobilePhnNo: typeof(response['AppCustPersonalObj']) != 'undefined' ? response['AppCustPersonalObj']['MobilePhnNo1'] : '',
            OwnerProfessionCode: typeof(response['AppCustPersonalJobDataObj']) != 'undefined' ? this.AppCustPersonalJobData.MrProfessionCode : '' 
          })
          this.OwnerAddrObj.Addr = this.AppCustAddrObj.Addr
          this.OwnerAddrObj.AreaCode1 = this.AppCustAddrObj.AreaCode1
          this.OwnerAddrObj.AreaCode2 = this.AppCustAddrObj.AreaCode2
          this.OwnerAddrObj.AreaCode3 = this.AppCustAddrObj.AreaCode3
          this.OwnerAddrObj.AreaCode4 = this.AppCustAddrObj.AreaCode4
          this.OwnerAddrObj.City = this.AppCustAddrObj.City
          this.inputFieldLegalObj.inputLookupObj.nameSelect = this.AppCustAddrObj.Zipcode;
          this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.AppCustAddrObj.Zipcode };
          this.inputAddressObjForOwner.default = this.OwnerAddrObj;
          this.inputAddressObjForOwner.inputField = this.inputFieldLegalObj;

          this.InputLookupProfessionObj.nameSelect = "";
          this.InputLookupProfessionObj.jsonSelect = "";

          if(typeof(response['AppCustPersonalJobDataObj']) != 'undefined'){
            await this.GetProfessionName(this.AppCustPersonalJobData.MrProfessionCode);
            this.InputLookupProfessionObj.nameSelect = this.AppCustPersonalJobData.MrProfessionName;
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: this.AppCustPersonalJobData.MrProfessionName }
          }
        }
      )
    }
    else {
      this.AddCollForm.controls.MrOwnerTypeCode.enable();
      this.AddCollForm.controls.OwnerName.enable();
      this.AddCollForm.controls.MrOwnerRelationshipCode.enable();
      this.AddCollForm.controls.OwnerMobilePhnNo.enable();
      this.AddCollForm.controls.MrIdTypeCode.enable();
      this.AddCollForm.controls.OwnerIdNo.enable();
      this.AddCollForm.controls.OwnerAddrObj.enable();
      this.InputLookupProfessionObj.isDisable = false;
    }
  }

  async GetProfessionName(professionCode: string) {
    await this.http.post(URLConstant.GetRefProfessionByCode, { Code: professionCode }).toPromise().then(
      (response) => {
        this.AppCustPersonalJobData.MrProfessionName = response["ProfessionName"];
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
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

    this.inputFieldLocationObj.inputLookupObj.nameSelect = this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value;
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value };
    this.inputAddressObjForLoc.default = this.LocationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;

    this.AddCollForm.patchValue({
      CopyFromLegal: ""
    });
    }
  }

  async SaveForm() {
    const fullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    const assetType = this.AddCollForm.controls["AssetTypeCode"].value;
    var serialNoForm = this.items.controls[0] as FormGroup;
    const serialNo1 = serialNoForm.controls["SerialNoValue"].value;
    const currCollPrcnt = this.AddCollForm.controls["CollateralPrcnt"].value;
    const currCollValue = this.AddCollForm.controls["CollateralValueAmt"].value;
    if(!fullAssetCode){
      this.toastr.warningMessage("Full Asset Code Must be Filled");
      return false;
    }
    if(!assetType){
      this.toastr.warningMessage("Asset Type Code Must be Filled");
      return false;
    }
    if(!serialNo1){
      this.toastr.warningMessage("Serial No 1 Must be Filled");
      return false;
    }
    if(!currCollPrcnt){
      this.toastr.warningMessage("Collateral Portion Percentage Must be Filled");
      return false;
    }
    if(!currCollValue){
      this.toastr.warningMessage("Collateral Amount Must be Filled");
      return false;
    }
    if(this.AddCollForm.controls["OutstandingCollPrcnt"].value < 0){
      this.toastr.warningMessage("Collateral Portion Usage Cannot Exceed Outstanding Collateral Percentage");
      return false;
    }
    this.setCollateralInfo();
    this.setCollateralOwner();
    this.setCollateralLocation();
    this.setCollateralPercentage();
    this.setCollateralAttribute();
    for (const key in this.appCollateralDataObj.AppCollateralRegistrationObj) {
      if(key === "Id" || key === "AppCollateralRegistrationId" || key === "AppCollateralId" || key === "RowVersion" || key === "Notes" || key === "OwnerProfessionCode" || key === "MrOwnerTypeCode"){
        continue;
      }
      if(key === "OwnerMobilePhnNo" && this.AppCustData.MrCustTypeCode == CommonConstant.CustTypeCompany){
        continue;
      }
      if(!this.appCollateralDataObj.AppCollateralRegistrationObj[key]){
        this.toastr.warningMessage("Please complete Collateral Owner or Collateral User Data first");
        this.IsCollateralOwnerInvalid = true;
        return false;
      }
    }

    this.appCollateralDataObj.BizTemplateCode = CommonConstant.CFNA;
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
    if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0" && this.IsSvcExist) {
      if (this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value == '' && this.IsIntegrator) {  
        if (confirm("Chassis No not filled, submit data without Integrator ?")) {
            this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.outputValue.emit();
              });
        }
      }
      else if (!this.IsIntegrator) {
        if (this.currentChassisNo == this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value) {
            this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.outputValue.emit();
              });
        }
        else {
          if (confirm("Submit data without Integrator ?")) {
              this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
                (response) => {
                  this.toastr.successMessage(response["message"]);
                  this.outputValue.emit();
                });
          }
        }
      }
      else if (this.IsIntegrator) {

        this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
          (response)=>{
            this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingCollRAPINDO, this.appCollateralDataObj).subscribe(
              (response)=>{
              }
            );
            this.toastr.successMessage(response["message"]);
            this.outputValue.emit();
          }
        );
      }
    }
    else{
      this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputValue.emit();
        });
    }
  }

  Cancel() {
    this.outputValue.emit();
    this.outputCancel.emit();
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
  refreshAttr(){
    this.isAssetAttrReady = false;
    this.GenerateAppCollateralAttr(true);
  }
  IsCollateralOwnerInvalid: boolean = false;
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
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerProfessionCode = this.AddCollForm.controls["OwnerProfessionCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrOwnerTypeCode = this.AddCollForm.controls["MrOwnerTypeCode"].value;
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

  async getDigitalizationSvcType(){
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType}).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if(this.sysConfigResultObj.ConfigValue != null){
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");
      var refSvcType = "";
      await this.http.post(URLConstant.GetRuleIntegratorPackageMapAsset, { TrxNo: CommonConstant.CFNA}).toPromise().then(
        (response) => {
            refSvcType = response["Result"];
        });

      var svcType = listSvcType.find(x => x == refSvcType);

      if(svcType != null){
        this.IsSvcExist = true;
      }
    }
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

  attrSettingObj: RefAttrSettingObj = new RefAttrSettingObj();
  identifierAppCollAttr: string = "AppCollateralAttrObjs";
  isReadyAttrSetting : boolean = false;
  SetRefAttrSettingObj() {
    this.isReadyAttrSetting = false;
    let GenObj =
    {
      AppCollateralId: this.AppCollateralId,
      AssetTypeCode: this.AddCollForm.get("AssetTypeCode").value,
      IsRefresh: false
    }
    this.attrSettingObj.ReqGetListAttrObj = GenObj;
    this.attrSettingObj.Title = "Collateral Attribute";
    this.attrSettingObj.UrlGetListAttr = URLConstant.GenerateAppCollateralAttrV2;
    setTimeout(() => {
      this.isReadyAttrSetting = true;
    }, 100);
    
  }

}
