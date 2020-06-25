import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { HttpClient } from '@angular/common/http';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { formatDate } from '@angular/common';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppCollateralDataObj } from 'app/shared/model/AppCollateralDataObj.Model';
import { ListAppCollateralDocObj } from 'app/shared/model/ListAppCollateralDocObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';

@Component({
  selector: 'app-collateral-detail',
  templateUrl: './collateral-detail.component.html',
  styleUrls: ['./collateral-detail.component.scss']
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


  AddCollForm = this.fb.group({
    AppCollateralId: [''],
    FullAssetCode: ['', Validators.required],
    MrCollateralConditionCode: ['', Validators.required],
    MrCollateralUsageCode: ['', Validators.required],
    CollateralStat: ['NEW', Validators.required],
    SerialNo1: [''],
    SerialNo2: [''],
    SerialNo3: [''],
    CollateralValueAmt: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    AssetTypeCode: ['', Validators.required],
    AssetCategoryCode: ['', Validators.required],
    AssetTaxCode: [''],
    CollateralNotes: [''],
    CollateralPrcnt: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.max(100)]],
    IsMainCollateral: true,
    ManufacturingYear: ['', Validators.pattern("^[0-9]*$")],
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
    SelfUsage: [false]
  });

  CollTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CollConditionList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CollUsageList: Array<KeyValueObj> = new Array<KeyValueObj>();
  IdTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  OwnerRelationList: Array<KeyValueObj> = new Array<KeyValueObj>();
  AssetTypeCode: string = "";
 

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    console.log("rey collateral");
    this.initUcLookup();
    this.initDropdownList();
    this.getAppData();

    if (this.mode == "edit") {
      this.getAppCollData(0, this.AppCollateralId);
    }
    if (this.isSingleAsset) {
      this.getAppCollData(this.AppId, 0);
    }

    this.AddCollForm.controls.AssetTypeCode.disable();
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
    this.http.post(AdInsConstant.GetListKeyValueByCode, {}).subscribe(
      (response) => {
        this.CollTypeList = response['ReturnObject'];
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            AssetTypeCode: this.CollTypeList[0].Key
          });
          this.onItemChange(this.AddCollForm.controls.AssetTypeCode.value)
        }
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: 'ASSET_CONDITION' }).subscribe(
      (response) => {
        this.CollConditionList = response['ReturnObject'];
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            MrCollateralConditionCode: this.CollConditionList[0].Key
          });
        }
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: 'ASSET_USAGE' }).subscribe(
      (response) => {
        this.CollUsageList = response['ReturnObject'];
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            MrCollateralUsageCode: this.CollUsageList[0].Key
          });
        }
        this.AddCollForm.controls.MrCollateralConditionCode.disable();
      });

    this.http.post(AdInsConstant.GetListRefAppAttrCollateral, {}).subscribe(
      (response) => {
        let ListAttr = this.AddCollForm.get('ListAttr') as FormArray;
        let listRefAppAttr = new Array();
        listRefAppAttr = response['ReturnObject'];

        for (let i = 0; i < listRefAppAttr.length; i++) {
          var Attr = this.fb.group({
            AppAttrValue: listRefAppAttr[i].AppAttrValue,
          }) as FormGroup;
          ListAttr.push(Attr);
        }
      });

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: "CUST_PERSONAL_RELATIONSHIP" }).subscribe(
      (response) => {
        this.OwnerRelationList = response["ReturnObject"];
        if (this.mode != "edit") {
          if (this.OwnerRelationList.length > 0) {
            this.AddCollForm.patchValue({
              MrOwnerRelationshipCode: this.OwnerRelationList[0].Key,
              MrUserRelationshipCode: this.OwnerRelationList[0].Key,
              CopyFromLegal: "LEGAL"
            });
          }
        }
      }
    );

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: 'ID_TYPE' }).subscribe(
      (response) => {
        this.IdTypeList = response['ReturnObject'];
        if (this.mode != "edit") {
          this.AddCollForm.patchValue({
            MrIdTypeCode: this.IdTypeList[0].Key
          });
        }
      });
  }

  getAppData() {
    this.http.post<AppObj>(AdInsConstant.GetAppById, { AppId: this.AppId }).subscribe(
      (response) => {
        this.getProdOffering(response.ProdOfferingCode, response.ProdOfferingVersion);
      });
  }

  getProdOffering(ProdOfferingCode, ProdOfferingVersion) {
    var ProdOfferingObj = {
      ProdOfferingCode: ProdOfferingCode,
      ProdOfferingVersion: ProdOfferingVersion,
    };
    this.http.post(AdInsConstant.GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion, ProdOfferingObj).subscribe(
      (response) => {
        console.log(response);
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
        this.inputLookupExistColl.addCritInput = this.criteriaList;
        this.inputLookupExistColl.isReady = true;
      });

  }

  getRefAssetDocList() {
    this.http.post(AdInsConstant.GetRefAssetDocList, { AssetTypeCode: this.AssetTypeCode }).subscribe(
      (response) => {
        if (response["ReturnObject"].length > 0) {
          var ListDoc = this.AddCollForm.get('ListDoc') as FormArray;
          for (var i = 0; i < response["ReturnObject"].length; i++) {
            var assetDocumentDetail = this.fb.group({
              DocCode: response["ReturnObject"][i].AssetDocCode,
              AssetDocName: response["ReturnObject"][i].AssetDocName,
              IsValueNeeded: response["ReturnObject"][i].IsValueNeeded,
              IsMandatoryNew: response["ReturnObject"][i].IsMandatoryNew,
              IsMandatoryUsed: response["ReturnObject"][i].IsMandatoryUsed,
              IsReceived: response["ReturnObject"][i].IsReceived,
              DocNo: response["ReturnObject"][i].DocNo,
              ACDExpiredDt: response["ReturnObject"][i].ACDExpiredDt,
              DocNotes: response["ReturnObject"][i].DocNotes
            }) as FormGroup;
            ListDoc.push(assetDocumentDetail);
          }
        }
        this.setAppCollateralDoc(this.AppCollateralId);
      });
  }

  setAppCollateralDoc(AppCollateralId: number = 0) {
    this.http.post(AdInsConstant.GetListAppCollateralDocsByAppCollateralId, { AppCollateralId: AppCollateralId }).subscribe(
      (response) => {
        var AppCollateralDocs = new Array();
        AppCollateralDocs = response["AppCollateralDocs"];
        if (AppCollateralDocs["length"] > 0) {
          for (var i = 0; i < AppCollateralDocs.length; i++) {
            this.AddCollForm.controls.ListDoc["controls"][i].patchValue({
              DocNo: AppCollateralDocs[i].DocNo,
              DocNotes: AppCollateralDocs[i].DocNotes,
              ACDExpiredDt: formatDate(AppCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
              IsReceived: AppCollateralDocs[i].IsReceived
            })
          }
        }
      });
  }

  getAppCollData(AppId: number = 0, AppCollateralId: number = 0, IsExisting: boolean = false) {
    this.http.post(AdInsConstant.GetAppCollateralAndRegistrationByAppCollateralId, { AppId: AppId, AppCollateralId: AppCollateralId }).subscribe(
      (response) => {
        this.appCollateralObj = response['AppCollateral'];
        this.collateralRegistrationObj = response['AppCollateralRegistration'];
        if (!IsExisting) {
          if (this.appCollateralObj.AppCollateralId != 0) {
            this.mode = "edit";
          }else{
            return true;
          }
          this.AddCollForm.patchValue({
            CollateralStat: "NEW"
          });
        } else {
          this.AddCollForm.patchValue({
            CollateralStat: "EXISTING"
          });
          this.editAppCollateralObj = response['AppCollateral'];
          this.editCollateralRegistrationObj = response['AppCollateralRegistration'];
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
          SerialNo1: this.appCollateralObj.SerialNo1,
          SerialNo2: this.appCollateralObj.SerialNo2,
          SerialNo3: this.appCollateralObj.SerialNo3,
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
          RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion
        });

        if (this.AddCollForm.controls.MrUserRelationshipCode.value == "SELF") {
          this.AddCollForm.patchValue({
            SelfUsage: true
          })
        }

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

        // set data Owner Address
        this.OwnerAddrObj.Addr = this.collateralRegistrationObj.OwnerAddr;
        this.OwnerAddrObj.AreaCode1 = this.collateralRegistrationObj.OwnerAreaCode1;
        this.OwnerAddrObj.AreaCode2 = this.collateralRegistrationObj.OwnerAreaCode2;
        this.OwnerAddrObj.AreaCode3 = this.collateralRegistrationObj.OwnerAreaCode3;
        this.OwnerAddrObj.AreaCode4 = this.collateralRegistrationObj.OwnerAreaCode4;
        this.OwnerAddrObj.City = this.collateralRegistrationObj.OwnerCity;
        this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.OwnerZipcode };
      })
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
  }

  onItemChange(AssetCode: string) {
    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = 'B.ASSET_TYPE_CODE';
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = AssetCode;
    arrAddCrit.push(addCrit);
    this.inputLookupColl.addCritInput = arrAddCrit;
    this.ucLookupCollateral.setAddCritInput();
  }

  changeSerialNoValidators(AssetCode: string) {
    if (AssetCode == "USED" || AssetCode == "Used") {
      this.AddCollForm.controls.SerialNo1.setValidators(Validators.required);
      this.AddCollForm.controls.SerialNo2.setValidators(Validators.required);
    }
    else if (AssetCode == "NEW" || AssetCode == "New") {
      this.AddCollForm.controls.SerialNo1.clearValidators();
      this.AddCollForm.controls.SerialNo2.clearValidators();
    }

    this.AddCollForm.controls.SerialNo1.updateValueAndValidity();
    this.AddCollForm.controls.SerialNo2.updateValueAndValidity();
  }

  CopyUser() {
    if (this.AddCollForm.controls.SelfUsage.value == true) {
      this.AddCollForm.controls.UserName.disable();
      this.AddCollForm.controls.MrUserRelationshipCode.disable();

      this.AppCustObj = new AppCustObj();
      this.AppCustCompanyObj = new AppCustCompanyObj();
      this.AppCustAddrObj = new AppCustAddrObj();
      
      var appObj = { "AppId": this.AppId };
      this.http.post(AdInsConstant.GetCustDataByAppId, appObj).subscribe(
        response => { 
          this.AppCustObj = response['AppCustObj'];        
          this.AppCustCompanyObj = response['AppCustCompanyObj'];
          this.AppCustAddrObj = response['AppCustAddrLegalObj'];
          

          this.AddCollForm.patchValue({
            UserName: this.AppCustObj.CustName,
            OwnerName: this.AppCustObj.CustName,
            MrOwnerRelationshipCode: "SELF",
            MrUserRelationshipCode: "SELF"
          })
          this.OwnerAddrObj.Addr = this.AppCustAddrObj.Addr
          this.OwnerAddrObj.AreaCode1 = this.AppCustAddrObj.AreaCode1
          this.OwnerAddrObj.AreaCode2 = this.AppCustAddrObj.AreaCode2
          this.OwnerAddrObj.AreaCode3 = this.AppCustAddrObj.AreaCode3
          this.OwnerAddrObj.AreaCode4 = this.AppCustAddrObj.AreaCode4
          this.OwnerAddrObj.City = this.AppCustAddrObj.City
          this.inputFieldLegalObj.inputLookupObj.nameSelect = this.AppCustAddrObj.Zipcode;
          this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.AppCustAddrObj.Zipcode };

          if (this.AppCustObj.MrCustTypeCode == AdInsConstant.CustTypePersonal) {
            this.AddCollForm.patchValue({
              MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
              OwnerIdNo: this.AppCustObj.IdNo,
            });
          }
          if (this.AppCustObj.MrCustTypeCode == AdInsConstant.CustTypeCompany) {
            this.AddCollForm.patchValue({
              MrIdTypeCode: this.collateralRegistrationObj.MrIdTypeCode,
              OwnerIdNo: this.AppCustCompanyObj.RegistrationNo,
            });
          }
        }
      )
      this.AddCollForm.controls.UserName.clearValidators();
      this.AddCollForm.controls.UserName.updateValueAndValidity();
      this.AddCollForm.controls.MrUserRelationshipCode.clearValidators();
      this.AddCollForm.controls.MrUserRelationshipCode.updateValueAndValidity();
    }
    else{
      this.AddCollForm.controls.UserName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.AddCollForm.controls.UserName.updateValueAndValidity();
      this.AddCollForm.controls.MrUserRelationshipCode.setValidators([Validators.required, Validators.maxLength(50)]);
      this.AddCollForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.AddCollForm.controls.UserName.enable();
      this.AddCollForm.controls.MrUserRelationshipCode.enable();
    }
  }

  copyToLocation() {
    this.LocationAddrObj.Addr = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Addr.value;
    this.LocationAddrObj.AreaCode1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode1.value;
    this.LocationAddrObj.AreaCode2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode2.value;
    this.LocationAddrObj.AreaCode3 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode3.value;
    this.LocationAddrObj.AreaCode4 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode4.value;
    this.LocationAddrObj.City = this.AddCollForm.controls["OwnerAddrObj"]["controls"].City.value;
    this.LocationAddrObj.Fax = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Fax.value;
    this.LocationAddrObj.FaxArea = this.AddCollForm.controls["OwnerAddrObj"]["controls"].FaxArea.value;
    this.LocationAddrObj.Phn1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Phn1.value;
    this.LocationAddrObj.Phn2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Phn2.value;
    this.LocationAddrObj.PhnArea1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].PhnArea1.value;
    this.LocationAddrObj.PhnArea2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].PhnArea2.value;
    this.LocationAddrObj.PhnExt1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].PhnExt1.value;
    this.LocationAddrObj.PhnExt2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].PhnExt2.value;
    this.LocationAddrObj.SubZipcode = this.AddCollForm.controls["OwnerAddrObj"]["controls"].SubZipcode.value;

    this.inputFieldLocationObj.inputLookupObj.nameSelect = this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value;
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value };
  }

  SaveForm() {
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
      this.appCollateralDoc.DocNo = this.AddCollForm.value.ListDoc[i].DocNo;
      this.appCollateralDoc.ExpiredDt = this.AddCollForm.value.ListDoc[i].ACDExpiredDt;
      this.appCollateralDoc.DocNotes = this.AddCollForm.value.ListDoc[i].DocNotes;
      this.listAppCollateralDocObj.AppCollateralDocObj.push(this.appCollateralDoc);
    }
    this.appCollateralDataObj.ListAppCollateralDocObj = this.listAppCollateralDocObj.AppCollateralDocObj;

    if (this.mode == 'add') {
      this.http.post(AdInsConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputValue.emit();
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      this.http.post(AdInsConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputValue.emit();
        },
        (error) => {
          console.log(error);
        }
      );
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
    this.appCollateralDataObj.AppCollateralObj.SerialNo1 = this.AddCollForm.controls["SerialNo1"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo2 = this.AddCollForm.controls["SerialNo2"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo3 = this.AddCollForm.controls["SerialNo3"].value;
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
