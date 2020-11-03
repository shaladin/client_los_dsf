import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { WizardComponent } from 'angular-archwizard';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { VendorEmpObj } from 'app/shared/model/VendorEmp.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCollateralAttrObj } from 'app/shared/model/AppCollateralAttrObj.Model';
import { AppCollateralDataObj } from 'app/shared/model/AppCollateralDataObj.Model';
import { AssetTypeObj } from 'app/shared/model/AssetTypeObj.Model';
import { AssetCategoryObj } from 'app/shared/model/AssetCategoryObj.Model';
import { AssetMasterObj } from 'app/shared/model/AssetMasterObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';

@Component({
  selector: 'app-collateral-leasing-add-edit',
  templateUrl: './collateral-leasing-add-edit.component.html'
})
export class CollateralLeasingAddEditComponent implements OnInit {
  @Input() AppId: any;
  @Input() mode: any;
  @Input() AppCollateralId: number;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() collValue: EventEmitter<object> = new EventEmitter();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;

  pageType: string = "add";
  LobCode: any;
  //AppCollateralId: any;
  branchObj: any;
  listBranchObj: any;
  getListAppAssetData: any;
  getListVendorEmp: any;
  getListActiveRefMasterUrl: any;
  InputLookupSupplierObj: any;
  inputLookupCollNameObj: any;
  inputFieldLegalObj: any;
  inputFieldLocationObj: any;
  inputLookupObj: any;
  collateral: string = "New";
  inputObj: any;
  arrCrit: any[];
  checkboxAll = false;
  listSelectedId: any;
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
  tempIdType: any;
  getAppCustAddrByAppCustAddrId: any;
  getAppCustAddrUrl: any;
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
  addEditAllCollateralData: any;
  appCollateralDataObj: AppCollateralDataObj;
  assetRegionObj: any;
  returnAssetRegionObj: any;
  assetRegionAttrObj: AppCollateralAttrObj;
  colorAttrObj: AppCollateralAttrObj;
  categoryAttrObj: AppCollateralAttrObj;
  transmitionAttrObj: AppCollateralAttrObj;
  bpkbCityIssuerAttrObj: AppCollateralAttrObj;
  bpkbIssueDateAttrObj: AppCollateralAttrObj;
  getListAssetTypeByCode: any;
  collTypeObj: any;
  returnCollTypeObj: any;
  getAssetCategoryById: any;
  assetCategoryObj: any;
  returnAssetCategoryObj: any;
  getAppCollateralByAppCollateralId: any;
  getAssetMasterForLookupEmployee: any;
  getAppCollateralRegistByAppCollateralId: any;
  reqAssetMasterObj: any;
  resAssetMasterObj: any;
  appCollateralRegistObj: any;
  returnAppCollateralRegistObj: any;
  assetConditionObj: RefMasterObj;
  returnAssetCondition: any;
  appObj = {
    AppId: 0,
  };

  AddCollForm = this.fb.group({
    Collateral: [''],
    AssetTypeCode: [''],

    FullAssetCode: [''],
    FullAssetName: [''],
    AssetCategoryCode: [''],
    SerialNo1: [''],
    SerialNo2: [''],
    CollateralValueAmt: [''],
    SerialNo3: [''],
    Notes: [''],
    SerialNo4: [''],

    OwnerName: [''],
    MrIdTypeCode: [''],
    OwnerRelationship: [''],
    OwnerIdNo: [''],
    CollateralOwnerAddr: [''],
    OwnerMobilePhn: [''],

    AssetRegion: [''],
    Color: [''],
    Transmition: [''],
    TaxCityIssuer: [''],
    Category: [''],
    CopyFromLegal: [''],
    BpkpIssueDate: [''],

    LocationAddrType: [''],

    CollPercentage: [''],
  });
  inputAddressObjForLoc: InputAddressObj;
  inputAddressObjForColl: InputAddressObj;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.getListAppAssetData = URLConstant.GetListAppAssetData;
    this.getListVendorEmp = URLConstant.GetListVendorEmpByVendorIdAndPosition;
    this.getListActiveRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.getAppCustAddrByAppCustAddrId = URLConstant.GetAppCustAddrByAppCustAddrId;
    this.getAppCustAddrUrl = URLConstant.GetListAppCustAddrByAppId;
    this.addEditAllCollateralData = URLConstant.AddEditAllCollateralData;
    this.getListAssetTypeByCode = URLConstant.GetListAssetTypeByCode;
    this.getAssetCategoryById = URLConstant.GetAssetCategoryById;
    this.getAppCollateralByAppCollateralId = URLConstant.GetAppCollateralByAppCollateralId;
    this.getAssetMasterForLookupEmployee = URLConstant.GetAssetMasterForLookupEmployee;
    this.getAppCollateralRegistByAppCollateralId = URLConstant.GetAppCollateralRegistrationByAppCollateralId;

    this.route.queryParams.subscribe(params => {
      if (params["AppCollateralId"] != null) {
        this.AppCollateralId = params["AppCollateralId"];
      }
      if (params["mode"] != null) {
        this.pageType = params["mode"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["LobCode"] != null) {
        this.LobCode = params["LobCode"];
      }
    });
  }

  back() {
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
      FullAssetName: event.FullAssetName
    });

    this.assetCategoryObj = new AssetCategoryObj();
    this.assetCategoryObj.AssetCategoryId = event.AssetCategoryId;
    this.http.post(this.getAssetCategoryById, this.assetCategoryObj).subscribe(
      (response) => {
        this.returnAssetCategoryObj = response;
        this.AddCollForm.patchValue({
          AssetCategoryCode: this.returnAssetCategoryObj.AssetCategoryCode
        });
      }
    );
  }

  CollChange() {
    this.collateral = this.AddCollForm.controls["Collateral"].value;
  }

  bindUcSearch() {
    this.arrCrit = new Array();

    this.listSelectedId = new Array();
    this.tempListId = new Array();
    this.tempData = new Array();
    this.arrCrit = new Array();

    this.inputObj = new InputSearchObj();
    this.inputObj._url = "./assets/ucpaging/mou/searchMouCustCollateral.json";
    this.inputObj.enviromentUrl = environment.FoundationR3Url;
    this.inputObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;

    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.FoundationR3Url + URLConstant.GetPagingObjectBySQL;
    this.inputObj.addCritInput = new Array();

  }

  searchPagination(event: number) {
    this.pageNow = event;
    let order = null;
    if (this.orderByKey != null) {
      order = {
        key: this.orderByKey,
        value: this.orderByValue
      }
    }
    this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order)
  }

  searchSort(event: any) {
    if (this.resultData != null) {
      if (this.orderByKey == event.target.attributes.name.nodeValue) {
        this.orderByValue = !this.orderByValue
      } else {
        this.orderByValue = true
      }
      this.orderByKey = event.target.attributes.name.nodeValue
      let order = {
        key: this.orderByKey,
        value: this.orderByValue
      }
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order)
    }
  }

  getResult(event) {
    this.resultData = event.response;
    this.totalData = event.response.Count;
    this.UCGridFooter.pageNow = event.pageNow;
    this.UCGridFooter.totalData = this.totalData;
    this.UCGridFooter.resultData = this.resultData;
  }

  onSelect(event) {
    this.pageNow = event.pageNow;
    this.pageSize = event.pageSize;
    this.totalData = event.Count;
    this.searchPagination(this.pageNow);
  }

  SelectAll(condition) {
    this.checkboxAll = condition;
    if (condition) {
      for (let i = 0; i < this.resultData.Data.length; i++) {
        if (this.listSelectedId.indexOf(this.resultData.Data[i].CollateralId) < 0) {
          this.listSelectedId.push(this.resultData.Data[i].CollateralId);
        }
      }

    } else {
      for (let i = 0; i < this.resultData.Data.length; i++) {
        let index = this.listSelectedId.indexOf(this.resultData.Data[i].CollateralId);
        if (index > -1) {
          this.listSelectedId.splice(index, 1);
        }
      }
    }
  }

  addToTemp() {
    if (this.listSelectedId.length != 0) {
      for (var i = 0; i < this.listSelectedId.length; i++) {
        this.tempListId.push(this.listSelectedId[i]);
        var object = this.resultData.Data.find(x => x.CollateralId == this.listSelectedId[i]);
        this.tempData.push(object);
      }

      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }
      var addCrit = new CriteriaObj();
      addCrit.DataType = "numeric";
      addCrit.propName = "CL.COLLATERAL_ID";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.tempListId;
      this.arrAddCrit.push(addCrit);

      var order = null;
      if (this.orderByKey != null) {
        order = {
          key: this.orderByKey,
          value: this.orderByValue
        };
      }
      this.inputObj.addCritInput = this.arrAddCrit;
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order, this.arrAddCrit);
      this.listSelectedId = [];
      this.checkboxAll = false;
    } else {
      this.toastr.typeErrorCustom("Please select at least one Collateral");
    }
  }

  deleteFromTemp(CollateralId: any) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }

      var index = this.tempListId.indexOf(CollateralId);
      if (index > -1) {
        this.tempListId.splice(index, 1);
        this.tempData.splice(index, 1);
      }
      var addCrit = new CriteriaObj();
      addCrit.DataType = "numeric";
      addCrit.propName = "CL.COLLATERAL_ID";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.tempListId;
      if (this.tempListId.length != 0) {
        this.arrAddCrit.push(addCrit);
      }
      var order = null;
      if (this.orderByKey != null) {
        order = {
          key: this.orderByKey,
          value: this.orderByValue
        };
      }
      this.inputObj.addCritInput = this.arrAddCrit;
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order, this.arrAddCrit);
    }
  }

  GetListAddr() {
    this.appObj.AppId = this.AppId;
    this.http.post(this.getAppCustAddrUrl, this.appObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({
          LocationAddrType: response[CommonConstant.ReturnObj][0]['AppCustAddrId'],
          CollateralOwnerAddr: response[CommonConstant.ReturnObj][0]['AppCustAddrId']
        });
      }
    );
  }

  copyToLocationAddr() {
    this.appCustAddrObj = new AppCustAddrObj();
    this.appCustAddrObj.AppCustAddrId = this.AddCollForm.controls["LocationAddrType"].value;
    this.http.post(this.getAppCustAddrByAppCustAddrId, this.appCustAddrObj).subscribe(
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

      });
  }

  copyToCollateralOwnerAddr() {
    this.collOwnerObj = new AppCustAddrObj();
    this.collOwnerObj.AppCustAddrId = this.AddCollForm.controls["CollateralOwnerAddr"].value;
    this.http.post(this.getAppCustAddrByAppCustAddrId, this.collOwnerObj).subscribe(
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
        this.inputAddressObjForLoc.default = this.collOwnerAddrObj;
        this.inputAddressObjForLoc.inputField = this.inputFieldCollOwnerObj;
      });
  }

  ngOnInit() {
    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.title = "Collateral Owner";
    this.inputAddressObjForLoc.showAllPhn = false;
    this.inputAddressObjForLoc.showOwnership = false;

    this.inputAddressObjForColl = new InputAddressObj();
    this.inputAddressObjForColl.showSubsection = false;
    this.inputAddressObjForColl.showAllPhn = false;

    if (this.mode == 'editColl') {
      this.appCollateralObj = new AppCollateralObj();
      this.appCollateralObj.AppCollateralId = this.AppCollateralId;
      this.http.post(this.getAppCollateralByAppCollateralId, this.appCollateralObj).subscribe(
        (response) => {
          this.returnAppCollateralObj = response;
          this.AddCollForm.patchValue({
            SerialNo1: this.returnAppCollateralObj.SerialNo1,
            SerialNo2: this.returnAppCollateralObj.SerialNo2,
            SerialNo3: this.returnAppCollateralObj.SerialNo3,
            SerialNo4: this.returnAppCollateralObj.SerialNo4,
            CollateralValueAmt: this.returnAppCollateralObj.CollateralValueAmt,
            Notes: this.returnAppCollateralObj.CollateralNotes,
            AssetTypeCode: this.returnAppCollateralObj.AssetTypeCode,
            AssetCategoryCode: this.returnAppCollateralObj.AssetCategoryCode,
            CollPercentage: this.returnAppCollateralObj.CollateralPrcnt,
          });

          this.reqAssetMasterObj = new AssetMasterObj();
          this.reqAssetMasterObj.FullAssetCode = this.returnAppCollateralObj.FullAssetCode;
          this.http.post(this.getAssetMasterForLookupEmployee, this.reqAssetMasterObj).subscribe(
            (response) => {
              this.resAssetMasterObj = response;
              this.inputLookupObj.nameSelect = this.resAssetMasterObj.FullAssetName;
              this.inputLookupObj.jsonSelect = this.resAssetMasterObj;
              this.AddCollForm.patchValue({
                FullAssetCode: this.resAssetMasterObj.FullAssetCode,
                FullAssetName: this.resAssetMasterObj.FullAssetName,
              });
            });
        });

      this.appCollateralRegistObj = new AppCollateralRegistrationObj();
      this.appCollateralRegistObj.AppCollateralId = this.AppCollateralId;
      this.http.post(this.getAppCollateralRegistByAppCollateralId, this.appCollateralRegistObj).subscribe(
        (response) => {
          this.returnAppCollateralRegistObj = response;
          this.AddCollForm.patchValue({
            OwnerRelationship: this.returnAppCollateralRegistObj.MrOwnerRelationshipCode,
            OwnerName: this.returnAppCollateralRegistObj.OwnerName,
            MrIdTypeCode: this.returnAppCollateralRegistObj.MrIdTypeCode,
            OwnerIdNo: this.returnAppCollateralRegistObj.OwnerIdNo,
            OwnerMobilePhn: this.returnAppCollateralRegistObj.OwnerMobilePhnNo,
          });

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

          this.inputAddressObjForLoc.default = this.collOwnerAddrObj;
          this.inputAddressObjForLoc.inputField = this.inputFieldCollOwnerObj;

          this.collLocationAddrObj = new AppCustAddrObj();
          this.collLocationAddrObj.Addr = this.returnAppCollateralRegistObj.LocationAddr;
          this.collLocationAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.LocationAreaCode3;
          this.collLocationAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.LocationAreaCode4;
          this.collLocationAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.LocationAreaCode1;
          this.collLocationAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.LocationAreaCode2;
          this.collLocationAddrObj.City = this.returnAppCollateralRegistObj.LocationCity;

          this.inputFieldLocationObj = new InputFieldObj();
          this.inputFieldLocationObj.inputLookupObj = new InputLookupObj();
          this.inputFieldLocationObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.LocationZipcode;
          this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.LocationZipcode };
          this.inputAddressObjForColl.default = this.collLocationAddrObj;
          this.inputAddressObjForColl.inputField = this.inputFieldLocationObj;
        });
    }


    this.bindUcSearch();
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
    this.http.post(this.getListActiveRefMasterUrl, this.idTypeCode).subscribe(
      (response) => {
        this.tempIdType = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({ MrIdTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
      });

    this.ownerRelationshipObj = new RefMasterObj();
    this.ownerRelationshipObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(this.getListActiveRefMasterUrl, this.ownerRelationshipObj).subscribe(
      (response) => {
        this.returnOwnerRelationshipObj = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({ OwnerRelationship: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.assetRegionObj = new RefMasterObj();
    this.assetRegionObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetInsRegion;
    this.http.post(this.getListActiveRefMasterUrl, this.assetRegionObj).subscribe(
      (response) => {
        this.returnAssetRegionObj = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({ AssetRegion: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.assetConditionObj = new RefMasterObj();
    this.assetRegionObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetCondition;
    this.http.post(this.getListActiveRefMasterUrl, this.assetConditionObj).subscribe(
      (response) => {
        this.returnAssetCondition = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({ Collateral: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.collTypeObj = new AssetTypeObj();
    this.http.post(this.getListAssetTypeByCode, this.collTypeObj).subscribe(
      (response) => {
        this.returnCollTypeObj = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({ AssetTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";

    this.InputLookupCityIssuerObj = new InputLookupObj();
    this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url;
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
  }

  setCollateralInfo() {
    this.appCollateralDataObj.AppCollateralObj.AppId = this.AppId;
    this.appCollateralDataObj.AppCollateralObj.CollateralSeqNo = 1;
    this.appCollateralDataObj.AppCollateralObj.FullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    this.appCollateralDataObj.AppCollateralObj.FullAssetName = this.AddCollForm.controls["FullAssetName"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo1 = this.AddCollForm.controls["SerialNo1"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo2 = this.AddCollForm.controls["SerialNo2"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo3 = this.AddCollForm.controls["SerialNo3"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo4 = this.AddCollForm.controls["SerialNo4"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralValueAmt = this.AddCollForm.controls["CollateralValueAmt"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralNotes = this.AddCollForm.controls["Notes"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetTypeCode = this.AddCollForm.controls["AssetTypeCode"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralStat = "NEW";
    this.appCollateralDataObj.AppCollateralObj.MrCollateralConditionCode = "USED";
    this.appCollateralDataObj.AppCollateralObj.MrCollateralUsageCode = "NON_COMM";
    this.appCollateralDataObj.AppCollateralObj.AssetCategoryCode = this.AddCollForm.controls["AssetCategoryCode"].value;
    if (this.returnAppCollateralObj != null || this.returnAppCollateralObj != undefined) this.appCollateralDataObj.AppCollateralObj.RowVersion = this.returnAppCollateralObj.RowVersion;
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
    if (this.returnAppCollateralRegistObj != null || this.returnAppCollateralRegistObj != undefined) this.appCollateralDataObj.AppCollateralRegistrationObj.RowVersion = this.returnAppCollateralRegistObj.RowVersion;
  }

  setCollateralAttribute() {
    this.assetRegionAttrObj = new AppCollateralAttrObj();
    this.assetRegionAttrObj.CollateralAttrCode = "FB";
    this.assetRegionAttrObj.CollateralAttrName = "Facebook";
    this.assetRegionAttrObj.AttrValue = this.AddCollForm.controls["AssetRegion"].value;

    this.colorAttrObj = new AppCollateralAttrObj();
    this.colorAttrObj.CollateralAttrCode = "IG";
    this.colorAttrObj.CollateralAttrName = "Instagram";
    this.colorAttrObj.AttrValue = this.AddCollForm.controls["Color"].value;

    this.categoryAttrObj = new AppCollateralAttrObj();
    this.categoryAttrObj.CollateralAttrCode = "TW";
    this.categoryAttrObj.CollateralAttrName = "Twitter";
    this.categoryAttrObj.AttrValue = this.AddCollForm.controls["Category"].value;

    this.transmitionAttrObj = new AppCollateralAttrObj();
    this.transmitionAttrObj.CollateralAttrCode = "TW";
    this.transmitionAttrObj.CollateralAttrName = "Twitter";
    this.transmitionAttrObj.AttrValue = this.AddCollForm.controls["Transmition"].value;

    this.bpkbCityIssuerAttrObj = new AppCollateralAttrObj();
    this.bpkbCityIssuerAttrObj.CollateralAttrCode = "TW";
    this.bpkbCityIssuerAttrObj.CollateralAttrName = "Twitter";
    this.bpkbCityIssuerAttrObj.AttrValue = this.AddCollForm.controls["TaxCityIssuer"].value;

    this.bpkbIssueDateAttrObj = new AppCollateralAttrObj();
    this.bpkbIssueDateAttrObj.CollateralAttrCode = "TW";
    this.bpkbIssueDateAttrObj.CollateralAttrName = "Twitter";
    this.bpkbIssueDateAttrObj.AttrValue = this.AddCollForm.controls["BpkpIssueDate"].value;


    if (this.AddCollForm.controls["AssetRegion"].value != "") {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.assetRegionAttrObj);
    }
    if (this.AddCollForm.controls["Color"].value != "") {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.colorAttrObj);
    }
    if (this.AddCollForm.controls["Category"].value != "") {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.categoryAttrObj);
    }
    if (this.AddCollForm.controls["Transmition"].value != "") {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.transmitionAttrObj);
    }
    if (this.AddCollForm.controls["TaxCityIssuer"].value != "") {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.bpkbCityIssuerAttrObj);
    }
    if (this.AddCollForm.controls["BpkpIssueDate"].value != "") {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.bpkbIssueDateAttrObj);
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
    this.appCollateralDataObj = new AppCollateralDataObj();
    this.setCollateralInfo();
    this.setCollateralOwner();
    this.setCollateralLocation();
    this.setCollateralPercentage();
    //this.setCollateralAttribute();
    this.http.post(this.addEditAllCollateralData, this.appCollateralDataObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        //this.router.navigate(["/Nap/AssetData/Paging"]);
        this.collValue.emit({ mode: 'paging' });
      });
  }

  SaveExistingCollateral() {
    this.appCollateralObj = new AppCollateralObj();
    this.appCollateralObj.AppId = this.AppId;
    this.appCollateralObj.ListCollateralId = new Array();

    for (let index = 0; index < this.tempData.length; index++) {
      var appColtr = {
        CollateralId: this.tempData[index].CollateralId
      }
      this.appCollateralObj.ListCollateralId.push(appColtr.CollateralId);
    }

    if (this.appCollateralObj.ListCollateralId.length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }

    this.http.post(URLConstant.AddExistingAppCollateralData, this.appCollateralObj).subscribe(
      response => {
        this.toastr.successMessage(response['message']);
        //this.router.navigate(["/Nap/AssetData/Paging"]);
        this.collValue.emit({ mode: 'paging' });
      }
    );
  }

  SaveForm() {

  }
}
