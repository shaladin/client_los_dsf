import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
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

@Component({
  selector: 'app-collateral-detail',
  templateUrl: './collateral-detail.component.html'
})
export class CollateralDetailComponent implements OnInit {

  @ViewChild('LookupCollateral') ucLookupCollateral: UclookupgenericComponent;
  @Input() mode: string = "add";
  @Input() isSingleAsset = true;
  @Input() AppId: number = 0;
  @Input() AppCollateralId: number = 0;
  @Output() outputValue: EventEmitter<number> = new EventEmitter<any>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  inputLookupExistColl: InputLookupObj = new InputLookupObj();
  inputLookupColl: InputLookupObj = new InputLookupObj();
  inputFieldLegalObj: InputFieldObj = new InputFieldObj();
  inputFieldLocationObj: InputFieldObj = new InputFieldObj();
  LocationAddrObj: AddrObj = new AddrObj();

  AppCustObj: AppCustObj = new AppCustObj();
  AppCustAddrObj: AppCustAddrObj = new AppCustAddrObj();
  AppCustCompanyObj: AppCustCompanyObj = new AppCustCompanyObj();
  OwnerAddrObj: AddrObj = new AddrObj();
  appCollateralDataObj: AppCollateralDataObj = new AppCollateralDataObj();
  listAppCollateralDocObj: ListAppCollateralDocObj = new ListAppCollateralDocObj();
  appCollateralDoc: AppCollateralDocObj = new AppCollateralDocObj();
  appCollateralObj: AppCollateralObj = new AppCollateralObj();
  editAppCollateralObj: AppCollateralObj = new AppCollateralObj();
  collateralRegistrationObj: any;
  editCollateralRegistrationObj: any;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;
  items: FormArray;
  SerialNoList: any;
  isUsed: boolean = true;
  isCopy: boolean = true;
  // isExisting: boolean = false;
  AddCollForm = this.fb.group({
    AppCollateralId: [''],
    FullAssetCode: ['', Validators.required],
    MrCollateralConditionCode: ['', Validators.required],
    MrCollateralUsageCode: ['', Validators.required],
    CollateralStat: ['NEW', Validators.required],
    CollateralValueAmt: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    AssetTypeCode: ['', Validators.required],
    AssetCategoryCode: ['', Validators.required],
    AssetTaxCode: [''],
    CollateralNotes: [''],
    CollateralPrcnt: ['', [Validators.required, Validators.max(100)]],
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
  });

  CollTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CollConditionList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CollUsageList: Array<KeyValueObj> = new Array<KeyValueObj>();
  IdTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  OwnerRelationList: Array<KeyValueObj> = new Array<KeyValueObj>();
  AssetTypeCode: string = "";
  inputAddressObjForLegal: InputAddressObj;
  inputAddressObjForLoc: InputAddressObj;


  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    this.inputAddressObjForLegal = new InputAddressObj();
    this.inputAddressObjForLegal.showSubsection = false;
    this.inputAddressObjForLegal.showAllPhn = false;
    
    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;
    
    this.items = this.AddCollForm.get('items') as FormArray;

    this.GetLegalAddr();
    this.initUcLookup();
    this.initDropdownList();
    this.getAppData();

    if (this.mode == "edit") {
      this.getAppCollData(0, this.AppCollateralId);
    }
    if (this.isSingleAsset) {
      this.getAppCollData(this.AppId, 0);
    }

    // this.AddCollForm.controls.AssetTypeCode.disable();
  }

  initUcLookup() {
    this.inputLookupExistColl.urlJson = "./assets/uclookup/NAP/lookupAppCollateral.json";
    this.inputLookupExistColl.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupExistColl.urlEnviPaging = environment.losUrl;
    this.inputLookupExistColl.pagingJson = "./assets/uclookup/NAP/lookupAppCollateral.json";
    this.inputLookupExistColl.genericJson = "./assets/uclookup/NAP/lookupAppCollateral.json";
    this.inputLookupExistColl.isRequired = false;

    this.inputLookupColl.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupColl.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupColl.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupColl.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupColl.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";

    // this.criteriaList = new Array();
    // this.criteriaObj = new CriteriaObj();
    // this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    // this.criteriaObj.propName = 'apctrl.ASSET_TYPE_CODE';
    // this.criteriaObj.value = this.AssetTypeCode;
    // this.criteriaList.push(this.criteriaObj);
  }

  initDropdownList() {
    this.http.post(URLConstant.GetListKeyValueByCode, {}).subscribe(
      (response) => {
        this.CollTypeList = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            AssetTypeCode: this.CollTypeList[0].Key
          });
          this.onItemChange(this.AddCollForm.controls.AssetTypeCode.value)
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

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).subscribe(
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

  getAppData() {
    this.http.post<AppObj>(URLConstant.GetAppById, { AppId: this.AppId }).subscribe(
      (response) => {
        this.getProdOffering(response.ProdOfferingCode, response.ProdOfferingVersion);
        if(response["BizTemplateCode"] == CommonConstant.CFRFN4W){
          this.AddCollForm.patchValue({
            MrCollateralConditionCode: this.CollConditionList[1].Key
          });
        }
      });
  }

  getProdOffering(ProdOfferingCode, ProdOfferingVersion) {
    var ProdOfferingObj = {
      ProdOfferingCode: ProdOfferingCode,
      ProdOfferingVersion: ProdOfferingVersion,
    };
    this.http.post(URLConstant.GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion, ProdOfferingObj).subscribe(
      (response) => {
        var temp = response["ListProdOfferingDObj"];
        var LobCode: string = "";
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].RefProdCompntCode == "ASSETTYPE") {
            LobCode = temp[i].CompntValue;
          }
        }
        this.AssetTypeCode = LobCode;
        this.AddCollForm.patchValue({
          AssetTypeCode: this.AssetTypeCode
        });
        this.onItemChange(this.AssetTypeCode);
        // Generate Collateral Doc
        this.getRefAssetDocList();

        this.criteriaList = new Array();
        this.criteriaObj = new CriteriaObj();
        this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
        this.criteriaObj.propName = 'AC.ASSET_TYPE_CODE';
        this.criteriaObj.value = this.AssetTypeCode;
        this.criteriaList.push(this.criteriaObj);

        // tambah filter cust no
        this.http.post<AppCustObj>(URLConstant.GetAppCustByAppId, { AppId: this.AppId }).subscribe(
          (response) => {
            this.criteriaObj = new CriteriaObj();
            this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
            this.criteriaObj.propName = 'ACU.CUST_NO';
            this.criteriaObj.value = response.CustNo;
            this.criteriaList.push(this.criteriaObj);
            this.inputLookupExistColl.addCritInput = this.criteriaList;
            this.inputLookupExistColl.isReady = true;
        });
      });
  }

  getRefAssetDocList() {
    this.http.post(URLConstant.GetRefAssetDocList, { AssetTypeCode: this.AssetTypeCode }).subscribe(
      (response) => {
        if (response[CommonConstant.ReturnObj].length > 0) {
          var ListDoc = this.AddCollForm.get('ListDoc') as FormArray;
          for (var i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
            var assetDocumentDetail = this.fb.group({
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
            // if(this.isExisting){
            //   assetDocumentDetail.controls.DocNo.disable();
            //   assetDocumentDetail.controls.IsReceived.disable();
            //   assetDocumentDetail.controls.ACDExpiredDt.disable();
            //   assetDocumentDetail.controls.DocNotes.disable(); 
            // }
            ListDoc.push(assetDocumentDetail);
          }
        }
        this.setAppCollateralDoc(this.appCollateralObj.AppCollateralId);
      });
  }

  setAppCollateralDoc(AppCollateralId: number = 0) {
    this.http.post(URLConstant.GetListAppCollateralDocsByAppCollateralId, { AppCollateralId: AppCollateralId }).subscribe(
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

  getAppCollData(AppId: number = 0, AppCollateralId: number = 0, IsExisting: boolean = false) {
    this.http.post(URLConstant.GetAppCollateralAndRegistrationByAppCollateralId, { AppId: AppId, AppCollateralId: AppCollateralId }).subscribe(
      (response) => {
        this.appCollateralObj = response['AppCollateral'];
        this.collateralRegistrationObj = response['AppCollateralRegistration'];
        if (!IsExisting) {
          if (this.appCollateralObj.AppCollateralId != 0) {
            this.mode = "edit";
            // if(this.collateralRegistrationObj.MrUserRelationshipCode == 'SELF'){
            //   this.AddCollForm.controls.UserName.disable();
            //   this.AddCollForm.controls.MrUserRelationshipCode.disable();
            // }
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

        if(IsExisting || response['AppCollateral']['CollateralStat'] == CommonConstant.AssetStatExisting){
          // this.isExisting = true;
          this.isCopy=false;  
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
          SelfOwner: (this.collateralRegistrationObj.MrOwnerRelationshipCode == "SELF")
        });

        if (this.AddCollForm.controls.MrUserRelationshipCode.value == "SELF") {
          this.AddCollForm.patchValue({
            SelfUsage: true
          })
        }

        this.collateralPortionHandler();

        this.changeSerialNoValidators(this.appCollateralObj.MrCollateralConditionCode);
        this.onItemChange(this.appCollateralObj.AssetTypeCode);
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

  collateralPortionHandler(){
    const fullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    const assetType = this.AddCollForm.controls["AssetTypeCode"].value;
    var serialNoForm = this.items.controls[0] as FormGroup;
    const serialNo1 = serialNoForm.controls["SerialNoValue"].value;
    const currCollPrcnt = this.AddCollForm.controls["CollateralPrcnt"].value;
    const currCollValue = this.AddCollForm.controls["CollateralValueAmt"].value;

    if(fullAssetCode && assetType && serialNo1 && currCollValue && currCollPrcnt){
      this.http.post(URLConstant.GetCollateralByFullAssetCodeAssetTypeSerialNoForAppCollateral, { FullAssetCode: fullAssetCode, AssetTypeCode: assetType, SerialNo1: serialNo1 }).toPromise().then(
        (response) => {
          var outCollPrcnt = 100;
          if(response){
            if(response["CollateralPrcnt"]){
              outCollPrcnt = response["CollateralPrcnt"]; 
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
    this.getAppCollData(0, event.AppCollateralId, true);
  }

  getLookupCollateral(e) {
    this.AddCollForm.patchValue({
      FullAssetCode: e.FullAssetCode,
      FullAssetName: e.FullAssetName,
      AssetCategoryCode: e.AssetCategoryCode
    });
    this.collateralPortionHandler();
  }

  onItemChange(AssetTypeCode: string) {
    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = 'B.ASSET_TYPE_CODE';
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = AssetTypeCode;
    arrAddCrit.push(addCrit);
    this.inputLookupColl.addCritInput = arrAddCrit;
    this.ucLookupCollateral.setAddCritInput();

    if(this.AddCollForm.controls.MrCollateralConditionCode.value == "USED"){
      this.isUsed = true;
    }else{
      this.isUsed = false;
    }

    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {AssetTypeCode: AssetTypeCode}).subscribe(
      (response: any) => {
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
          // if(this.isExisting){ 
          //   eachDataDetail.controls.SerialNoValue.disable(); 
          // }
          this.items.push(eachDataDetail);
          if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
            this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }

        if(this.appCollateralObj != null){
          for(var i = 0; i < this.items.length ; i++){
            if (this.items.controls[i] != null) {
              this.items.controls[i]['controls']['SerialNoValue'].value = this.appCollateralObj["SerialNo"+(i+1)];
            }
          }
        }
        this.collateralPortionHandler();
      });
  }

  changeSerialNoValidators(MrCollateralConditionCode: string) {
    if(MrCollateralConditionCode == "USED"){
      this.isUsed = true;
    }else{
      this.isUsed = false;
    }
  }

  GetLegalAddr(){
    this.AppCustAddrObj = new AppCustAddrObj();
    this.http.post(URLConstant.GetCustDataByAppId, { "AppId": this.AppId }).subscribe(
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

      var appObj = { "AppId": this.AppId };
      this.http.post(URLConstant.GetCustDataByAppId, appObj).subscribe(
        response => {
          this.AppCustObj = response['AppCustObj'];
          this.AppCustCompanyObj = response['AppCustCompanyObj'];


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

  CopyUserForSelfOwner() {
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

      var appObj = { "AppId": this.AppId };
      this.http.post(URLConstant.GetCustDataByAppId, appObj).subscribe(
        response => {
          this.AppCustObj = response['AppCustObj'];
          this.AppCustCompanyObj = response['AppCustCompanyObj'];
          this.AppCustAddrObj = response['AppCustAddrLegalObj'];

          this.AddCollForm.patchValue({
            OwnerName: this.AppCustObj.CustName,
            MrOwnerRelationshipCode: "SELF",
            MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
            OwnerIdNo: this.AppCustObj.IdNo,
            OwnerMobilePhnNo: typeof(response['AppCustPersonalObj']) != 'undefined' ? response['AppCustPersonalObj']['MobilePhnNo1'] : ''
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

  // copyToLocation() {
  //   if(this.isCopy == true){
  //     this.LocationAddrObj.Addr = this.AppCustAddrObj.Addr;
  //     this.LocationAddrObj.AreaCode1 = this.AppCustAddrObj.AreaCode1;
  //     this.LocationAddrObj.AreaCode2 = this.AppCustAddrObj.AreaCode2;
  //     this.LocationAddrObj.AreaCode3 = this.AppCustAddrObj.AreaCode3;
  //     this.LocationAddrObj.AreaCode4 = this.AppCustAddrObj.AreaCode4;
  //     this.LocationAddrObj.City = this.AppCustAddrObj.City;
  //     this.LocationAddrObj.Fax = this.AppCustAddrObj.Fax;
  //     this.LocationAddrObj.FaxArea = this.AppCustAddrObj.FaxArea;
  //     this.LocationAddrObj.Phn1 = this.AppCustAddrObj.Phn1;
  //     this.LocationAddrObj.Phn2 = this.AppCustAddrObj.Phn2;
  //     this.LocationAddrObj.PhnArea1 = this.AppCustAddrObj.PhnArea1;
  //     this.LocationAddrObj.PhnArea2 = this.AppCustAddrObj.PhnArea2;
  //     this.LocationAddrObj.PhnExt1 = this.AppCustAddrObj.PhnExt1;
  //     this.LocationAddrObj.PhnExt2 = this.AppCustAddrObj.PhnExt2;
  //     this.LocationAddrObj.SubZipcode = this.AppCustAddrObj.SubZipcode;
  
  //     this.inputFieldLocationObj.inputLookupObj.nameSelect = this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value;
  //     this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value };
  //     this.inputAddressObjForLoc.default = this.LocationAddrObj;
  //     this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;
  //   }

  // }

  SaveForm() {
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

    for(var i = 0; i < this.items.length ; i++){
      if (this.items.controls[i] != null) {
        this.appCollateralDataObj.AppCollateralObj["SerialNo"+(i+1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
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
}
