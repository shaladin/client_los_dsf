import { Component, OnInit, Input, Output, EventEmitter,ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
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
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupTaxCityIssuerComponent } from './lookup-tax-city-issuer/lookup-tax-city-issuer.component';
import { LookupCollateralComponent } from './lookup-collateral/lookup-collateral.component';

@Component({
  selector: 'app-collateral-add-edit',
  templateUrl: './collateral-add-edit.component.html'
})
export class CollateralAddEditComponent implements OnInit {
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
  branchObj : any;
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
  businessDt: Date;
  // @ViewChild("CollateralModal", { read: ViewContainerRef }) collateralModal: ViewContainerRef;
  @ViewChild("CityIssuerModal", { read: ViewContainerRef }) cityIssuerModal: ViewContainerRef;
  @ViewChild("enjiForm") enjiForm: NgForm;

  appObj = {
    AppId: 0,
  };
  
  AddCollForm = this.fb.group({
    Collateral: ['New'],
    AssetTypeCode:[''],
    CollateralSeqNo: [1],
    CollateralName: ['', [Validators.required]],

    FullAssetCode: ['', [Validators.required]],
    FullAssetName: ['', [Validators.required]],
    AssetCategoryCode: [''],
    SerialNo1: [''],
    SerialNo2: [''],
    CollateralValueAmt: [''],
    SerialNo3: [''],
    Notes: [''],
    SerialNo4:[''],

    OwnerName:[''],
    MrIdTypeCode:[''],
    OwnerRelationship:[''],
    OwnerIdNo:[''],
    CollateralOwnerAddr: [''],
    OwnerMobilePhn:[''],

    AssetRegion:[''],
    Color:[''],
    Transmition:[''],
    TaxCityIssuer:[''],
    Category:[''],
    CopyFromLegal:[''],
    BpkpIssueDate:[''],

    LocationAddrType:[''],

    CollPercentage:['', [Validators.required, Validators.min(1), Validators.max(100)]],
  });

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private componentFactoryResolver: ComponentFactoryResolver, private modalService: NgbModal) { 
    this.getListAppAssetData = AdInsConstant.GetListAppAssetData;
    this.getListVendorEmp = AdInsConstant.GetListVendorEmpByVendorIdAndPosition;
    this.getListActiveRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getAppCustAddrByAppCustAddrId = AdInsConstant.GetAppCustAddrByAppCustAddrId;
    this.getAppCustAddrUrl = AdInsConstant.GetListAppCustAddrByAppId;
    this.addEditAllCollateralData = AdInsConstant.AddEditAllCollateralData;
    this.getListAssetTypeByCode = AdInsConstant.GetListAssetTypeByCode;
    this.getAssetCategoryById = AdInsConstant.GetAssetCategoryById;
    this.getAppCollateralByAppCollateralId = AdInsConstant.GetAppCollateralByAppCollateralId;
    this.getAssetMasterForLookupEmployee = AdInsConstant.GetAssetMasterForLookupEmployee;
    this.getAppCollateralRegistByAppCollateralId = AdInsConstant.GetAppCollateralRegistrationByAppCollateralId;
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;

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

  back(){
    this.collValue.emit({mode : 'paging'});
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
    // this.assetCategoryObj = new AssetCategoryObj();
    // this.assetCategoryObj.AssetCategoryId = event.AssetCategoryId;
    // this.http.post(this.getAssetCategoryById, this.assetCategoryObj).subscribe(
    //   (response) => {
    //     this.returnAssetCategoryObj = response;
    //     this.AddCollForm.patchValue({ 
    //       AssetCategoryCode: this.returnAssetCategoryObj.AssetCategoryCode 
    //     });
    //   }
    // );
  }

  showModalCollateral(){
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
      }
    ).catch((error) => {
      if (error != 0) {
        console.log(error);
      }
    });
  }

  CollChange(){
    this.collateral = this.AddCollForm.controls["Collateral"].value;

    console.log("aaa");
    console.log(this.collateral);
  }

  collateralTypeHandler(){
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
    // this.collateralModal.clear();
    this.inputLookupObj.isReady = false;
    var criteriaList = new Array<CriteriaObj>();
    var criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionEq;
    criteriaObj.propName = 'B.ASSET_TYPE_CODE';
    criteriaObj.value = this.AddCollForm.controls["AssetTypeCode"].value;
    criteriaList.push(criteriaObj);
    this.inputLookupObj.addCritInput = criteriaList;
    this.inputLookupObj.isReady = true;
    console.log("Asset Type Code : " + this.AddCollForm.controls["AssetTypeCode"].value);
    console.log("ColTypeHandler InputLookup : " + JSON.stringify(this.inputLookupObj));
    this.AddCollForm.patchValue({
      FullAssetCode: "",
      FullAssetName: "",
      AssetCategoryCode: "",
      CollateralName: ""
    });
    // bookmark
    // const component = this.collateralModal.createComponent(componentFactory);
    // component.instance.lookupInput = this.inputLookupObj;
    // component.instance.parentForm = this.AddCollForm;
    // component.instance.enjiForm = this.enjiForm;
    // component.instance.identifier = 'CollateralName';
    // component.instance.lookup.subscribe((e) => this.getLookupCollateralName(e));
  }

  bindUcSearch()
  {
    this.arrCrit = new Array();

    this.listSelectedId = new Array();
    this.tempListId = new Array();
    this.tempData = new Array();
    this.arrCrit = new Array();
    
    this.inputObj = new InputSearchObj();
    this.inputObj._url = "./assets/ucpaging/mou/searchMouCustCollateral.json";
    this.inputObj.enviromentUrl = environment.FoundationR3Url; 
    this.inputObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;

    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.FoundationR3Url + AdInsConstant.GetPagingObjectBySQL;
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
    console.log(condition);
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
        console.log(this.resultData.Data[i]);
      }
    }
    console.log(this.checkboxAll);
    console.log(this.listSelectedId);
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
    if (confirm('Are you sure to delete this record?')) {
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
        this.AppCustAddrObj = response["ReturnObject"];
        this.AddCollForm.patchValue({ 
          LocationAddrType: response['ReturnObject'][0]['AppCustAddrId'],
          CollateralOwnerAddr: response['ReturnObject'][0]['AppCustAddrId'] 
        });
      }
    );
  }

  copyToLocationAddr() {
    this.appCustAddrObj = new AppCustAddrObj();
    this.appCustAddrObj.AppCustAddrId = this.AddCollForm.controls["LocationAddrType"].value;
    this.http.post(this.getAppCustAddrByAppCustAddrId, this.appCustAddrObj).subscribe(
      (response) => {
        console.log("Collateral Location : " + JSON.stringify(response));
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
          this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = {Zipcode: this.returnAppCustAddrObj.Zipcode};
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
          this.inputFieldCollOwnerObj.inputLookupObj.jsonSelect = {Zipcode: this.returnCollOwnerObj.Zipcode};
          
      });
  }
  
  ngOnInit() {
    console.log("ccc")
    console.log(this.mode)
    console.log(this.AppCollateralId)
    var context = JSON.parse(localStorage.getItem("UserAccess"));
    this.businessDt = new Date(context["BusinessDt"]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);
    if(this.mode == 'editColl'){
      this.appCollateralObj = new AppCollateralObj();
      this.appCollateralObj.AppCollateralId = this.AppCollateralId;
      this.http.post(this.getAppCollateralByAppCollateralId, this.appCollateralObj).subscribe(
      (response) => {
          this.returnAppCollateralObj = response;
          if(this.returnAppCollateralObj.CollateralStat == "NEW"){
            this.AddCollForm.patchValue({
              Collateral: "New"
            });
          }
          else{
            this.AddCollForm.patchValue({
              Collateral: "Exist"
            });
          }
          this.CollChange();
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
            CollateralSeqNo: this.returnAppCollateralObj.CollateralSeqNo
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
                CollateralName: this.resAssetMasterObj.FullAssetName
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
            this.inputFieldCollOwnerObj.inputLookupObj.jsonSelect = {Zipcode: this.returnAppCollateralRegistObj.OwnerZipcode};

            // this.collLocationAddrObj = new AppCustAddrObj();
            // this.collLocationAddrObj.Addr = this.returnAppCollateralRegistObj.LocationAddr;
            // this.collLocationAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.LocationAreaCode3;
            // this.collLocationAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.LocationAreaCode4;
            // this.collLocationAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.LocationAreaCode1;
            // this.collLocationAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.LocationAreaCode2;
            // this.collLocationAddrObj.City = this.returnAppCollateralRegistObj.LocationCity;

            this.locationAddrObj = new AppCustAddrObj();
            this.locationAddrObj.Addr = this.returnAppCollateralRegistObj.LocationAddr;
            this.locationAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.LocationAreaCode3;
            this.locationAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.LocationAreaCode4;
            this.locationAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.LocationAreaCode1;
            this.locationAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.LocationAreaCode2;
            this.locationAddrObj.City = this.returnAppCollateralRegistObj.LocationCity;

            // this.inputFieldLocationObj = new InputFieldObj();
            // this.inputFieldLocationObj.inputLookupObj = new InputLookupObj();
            // this.inputFieldLocationObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.LocationZipcode;
            // this.inputFieldLocationObj.inputLookupObj.jsonSelect = {Zipcode: this.returnAppCollateralRegistObj.LocationZipcode};

            this.inputFieldLocationAddrObj = new InputFieldObj();
            this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
            this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.LocationZipcode;
            this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = {Zipcode: this.returnAppCollateralRegistObj.LocationZipcode};
        });

        this.http.post(AdInsConstant.GetAppCollateralAttrByAppCollateralId, { AppCollateralId: this.AppCollateralId }).subscribe(
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
                case "ASSET_REGION":
                  colObj.AssetRegion = item["AttrValue"];
                  break;

                case "COLOR":
                  colObj.Color = item["AttrValue"];
                  break;

                case "CATEGORY":
                  colObj.Category = item["AttrValue"];
                  break;

                case "TRANSMITION":
                  colObj.Transmition = item["AttrValue"];
                  break;

                case "TAX_CITY_ISSUER":
                  colObj.TaxCityIssuer = item["AttrValue"];
                  break;

                case "BPKB_ISSUE_DATE":
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
            this.InputLookupCityIssuerObj.nameSelect = colObj.TaxCityIssuer;
            this.InputLookupCityIssuerObj.jsonSelect = { DistrictCode: colObj.TaxCityIssuer };
            console.log("Name Select Issuer : " + this.InputLookupCityIssuerObj.nameSelect);
            console.log("InputLookupCityIssuerObj : " + JSON.stringify(this.InputLookupCityIssuerObj));
          },
          (error) => {
            console.log(error);
          }
        );
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
    this.idTypeCode.RefMasterTypeCode = "ID_TYPE";
    this.http.post(this.getListActiveRefMasterUrl, this.idTypeCode).subscribe(
    (response) => {
        this.tempIdType = response['ReturnObject'];
        this.AddCollForm.patchValue({ MrIdTypeCode: response['ReturnObject'][0]['Key'] });
    });

    this.ownerRelationshipObj = new RefMasterObj();
    this.ownerRelationshipObj.RefMasterTypeCode = "CUST_PERSONAL_RELATIONSHIP";
    this.http.post(this.getListActiveRefMasterUrl, this.ownerRelationshipObj).subscribe(
      (response) => {
        this.returnOwnerRelationshipObj = response["ReturnObject"];
        this.AddCollForm.patchValue({ OwnerRelationship: response['ReturnObject'][0]['Key'] });
      }
    );

    this.assetRegionObj = new RefMasterObj();
    this.assetRegionObj.RefMasterTypeCode = "ASSET_INS_REGION";
    this.http.post(this.getListActiveRefMasterUrl, this.assetRegionObj).subscribe(
      (response) => {
        this.returnAssetRegionObj = response["ReturnObject"];
        this.AddCollForm.patchValue({ AssetRegion: response['ReturnObject'][0]['Key'] });
      }
    );
    
    this.collTypeObj = new AssetTypeObj();
    this.http.post(this.getListAssetTypeByCode, this.collTypeObj).subscribe(
      (response) => {
        this.returnCollTypeObj = response["ReturnObject"];
        console.log("aaa");
        console.log(this.returnCollTypeObj);
        this.AddCollForm.patchValue({ AssetTypeCode: response['ReturnObject'][0]['Key'] });

        this.inputLookupObj = new InputLookupObj();
        this.inputLookupObj.isReady = false;
        this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
        this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
        this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
        this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
        this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
        var criteriaList = new Array<CriteriaObj>();
        var criteriaObj = new CriteriaObj();
        criteriaObj.restriction = AdInsConstant.RestrictionEq;
        criteriaObj.propName = 'B.ASSET_TYPE_CODE';
        criteriaObj.value = response['ReturnObject'][0]['Key'];
        criteriaList.push(criteriaObj);
        this.inputLookupObj.addCritInput = criteriaList;
        this.inputLookupObj.isReady = true;

        // bookmark
        // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
        // const component = this.collateralModal.createComponent(componentFactory);
        // component.instance.lookupInput = this.inputLookupObj;
        // component.instance.parentForm = this.AddCollForm;
        // component.instance.enjiForm = this.enjiForm;
        // component.instance.identifier = 'CollateralName';
        // component.instance.lookup.subscribe((e) => this.getLookupCollateralName(e));
      }
    );

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

  showModalTaxCityIssuer(){
    const modalTaxCityIssuer = this.modalService.open(LookupTaxCityIssuerComponent);
    modalTaxCityIssuer.result.then(
      (response) => {
        this.AddCollForm.patchValue({
          TaxCityIssuer: response.DistrictCode
        });
      }
    ).catch((error) => {
      if (error != 0) {
        console.log(error);
      }
    });
  }

  setCollateralInfo(){
    var collateralStat = this.AddCollForm.controls["Collateral"].value;
    this.appCollateralDataObj.AppCollateralObj.AppId = this.AppId;
    this.appCollateralDataObj.AppCollateralObj.CollateralSeqNo = this.AddCollForm.controls["CollateralSeqNo"].value;
    this.appCollateralDataObj.AppCollateralObj.FullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    this.appCollateralDataObj.AppCollateralObj.FullAssetName = this.AddCollForm.controls["FullAssetName"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo1 = this.AddCollForm.controls["SerialNo1"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo2 = this.AddCollForm.controls["SerialNo2"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo3 = this.AddCollForm.controls["SerialNo3"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo4 = this.AddCollForm.controls["SerialNo4"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralValueAmt = this.AddCollForm.controls["CollateralValueAmt"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralNotes = this.AddCollForm.controls["Notes"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetTypeCode = this.AddCollForm.controls["AssetTypeCode"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralStat = collateralStat == "New" ? "NEW" : "EXISTING";
    this.appCollateralDataObj.AppCollateralObj.MrCollateralConditionCode = "USED";
    this.appCollateralDataObj.AppCollateralObj.MrCollateralUsageCode = "NON_COMM";
    this.appCollateralDataObj.AppCollateralObj.AssetCategoryCode = this.AddCollForm.controls["AssetCategoryCode"].value;
    // console.log("SetCollateralInfo : " + JSON.stringify(this.appCollateralDataObj.AppCollateralObj));
    // console.log("Asset Category Code Final : " + this.AddCollForm.controls["AssetCategoryCode"].value);
    // this.appCollateralDataObj.AppCollateralObj.AssetCategoryCode = "MOBIL1000";
  }

  setCollateralOwner(){
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
  }
  
  setCollateralAttribute(){
    this.assetRegionAttrObj = new AppCollateralAttrObj();
    this.assetRegionAttrObj.CollateralAttrCode = "ASSET_REGION";
    this.assetRegionAttrObj.CollateralAttrName  = "Asset Region";
    this.assetRegionAttrObj.AttrValue = this.AddCollForm.controls["AssetRegion"].value;

    this.colorAttrObj = new AppCollateralAttrObj();
    this.colorAttrObj.CollateralAttrCode = "COLOR";
    this.colorAttrObj.CollateralAttrName = "Color";
    this.colorAttrObj.AttrValue = this.AddCollForm.controls["Color"].value;

    this.categoryAttrObj = new AppCollateralAttrObj();
    this.categoryAttrObj.CollateralAttrCode = "CATEGORY";
    this.categoryAttrObj.CollateralAttrName = "Category";
    this.categoryAttrObj.AttrValue = this.AddCollForm.controls["Category"].value;

    this.transmitionAttrObj = new AppCollateralAttrObj();
    this.transmitionAttrObj.CollateralAttrCode = "TRANSMITION";
    this.transmitionAttrObj.CollateralAttrName = "Transmition";
    this.transmitionAttrObj.AttrValue = this.AddCollForm.controls["Transmition"].value;

    this.bpkbCityIssuerAttrObj = new AppCollateralAttrObj();
    this.bpkbCityIssuerAttrObj.CollateralAttrCode = "TAX_CITY_ISSUER";
    this.bpkbCityIssuerAttrObj.CollateralAttrName = "Tax City Issuer";
    this.bpkbCityIssuerAttrObj.AttrValue = this.AddCollForm.controls["TaxCityIssuer"].value;

    this.bpkbIssueDateAttrObj = new AppCollateralAttrObj();
    this.bpkbIssueDateAttrObj.CollateralAttrCode = "BPKB_ISSUE_DATE";
    this.bpkbIssueDateAttrObj.CollateralAttrName = "BPKB Issue Date";
    this.bpkbIssueDateAttrObj.AttrValue = this.AddCollForm.controls["BpkpIssueDate"].value;

    if(this.AddCollForm.controls["AssetRegion"].value != "")
    {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.assetRegionAttrObj);
    } 
    if(this.AddCollForm.controls["Color"].value != "")
    {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.colorAttrObj);
    }
    if(this.AddCollForm.controls["Category"].value != "")
    {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.categoryAttrObj);
    }
    if(this.AddCollForm.controls["Transmition"].value != "")
    {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.transmitionAttrObj);
    }
    if(this.AddCollForm.controls["TaxCityIssuer"].value != "")
    {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.bpkbCityIssuerAttrObj);
    }
    if(this.AddCollForm.controls["BpkpIssueDate"].value != "")
    {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.bpkbIssueDateAttrObj);
    }
  }

  setCollateralLocation(){
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAddr = this.AddCollForm.controls["collLocationAddr"]["controls"].Addr.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AddCollForm.controls["collLocationAddr"]["controls"].AreaCode1.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AddCollForm.controls["collLocationAddr"]["controls"].AreaCode2.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AddCollForm.controls["collLocationAddr"]["controls"].AreaCode3.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AddCollForm.controls["collLocationAddr"]["controls"].AreaCode4.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationCity = this.AddCollForm.controls["collLocationAddr"]["controls"].City.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AddCollForm.controls["collLocationAddrZipcode"]["controls"].value.value;
  }

  setCollateralPercentage(){
    this.appCollateralDataObj.AppCollateralObj.CollateralPrcnt = this.AddCollForm.controls["CollPercentage"].value;
  }

  SaveNewCollateral()
  {
    if(this.AddCollForm.valid){
      if(this.mode == 'addColl')
      {
        this.appCollateralDataObj = new AppCollateralDataObj();
        this.setCollateralInfo();
        this.setCollateralOwner();
        this.setCollateralLocation();
        this.setCollateralPercentage();
        this.setCollateralAttribute();
        this.appCollateralDataObj.AppCollateralObj.AppAssetId = null;
        this.appCollateralDataObj.AppCollateralObj.AgrmntId = null;
        // console.log("Request New Collateral : " + JSON.stringify(this.appCollateralDataObj));
        this.http.post(this.addEditAllCollateralData, this.appCollateralDataObj).subscribe(
          (response) => {
            console.log(response);
            this.toastr.successMessage(response["message"]);
            //this.router.navigate(["/Nap/AssetData/Paging"]);
            this.collValue.emit({mode : 'paging'});
          },
          (error) => {
            console.log(error);
          }
        );
      }
      else
      {
        this.appCollateralDataObj = new AppCollateralDataObj();
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
        // console.log("Request New Collateral : " + JSON.stringify(this.appCollateralDataObj));
        this.http.post(this.addEditAllCollateralData, this.appCollateralDataObj).subscribe(
          (response) => {
            console.log(response);
            this.toastr.successMessage(response["message"]);
            //this.router.navigate(["/Nap/AssetData/Paging"]);
            this.collValue.emit({mode : 'paging'});
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  SaveExistingCollateral()
  {
    this.appCollateralObj = new AppCollateralObj();
    this.appCollateralObj.AppId = this.AppId;
    this.appCollateralObj.ListCollateralId =  new Array();

    for (let index = 0; index < this.tempData.length; index++) {
      console.log(this.tempData);
      var appColtr = {
        CollateralId: this.tempData[index].CollateralId
      }
      this.appCollateralObj.ListCollateralId.push(appColtr.CollateralId);
    }

    if (this.appCollateralObj.ListCollateralId.length == 0) {
      this.toastr.typeErrorCustom('Please Add At Least One Data');
      return;
    }

    this.http.post(AdInsConstant.AddExistingAppCollateralData, this.appCollateralObj).subscribe(
      response => {
        this.toastr.successMessage(response['message']);
        //this.router.navigate(["/Nap/AssetData/Paging"]);
        this.collValue.emit({mode : 'paging'});
      },
      error => {
        console.log(error);
      }
    );
  }

  SaveForm()
  {

  }

  // delete(MouCustCollId) {
  //   var custCollObj = { MouCustCollateralId: MouCustCollId };
  //   this.http.post(AdInsConstant.DeleteMouCustCollateral, custCollObj).subscribe(
  //     (response) => {
  //       console.log(response);
  //       this.toastr.successMessage(response["message"]);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  // editItem(custAddrObj: any) {
  //   this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  // }

}
