import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, NgForm, FormGroup, FormArray } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCollateralAttrObj } from 'app/shared/model/AppCollateralAttrObj.Model';
import { AppCollateralDataObj } from 'app/shared/model/AppCollateralDataObj.Model';
import { AssetTypeObj } from 'app/shared/model/AssetTypeObj.Model';
import { AssetMasterObj } from 'app/shared/model/AssetMasterObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupTaxCityIssuerComponent } from './lookup-tax-city-issuer/lookup-tax-city-issuer.component';
import { LookupCollateralComponent } from './lookup-collateral/lookup-collateral.component';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';

@Component({
  selector: 'app-collateral-add-edit',
  templateUrl: './collateral-add-edit.component.html'
})
export class CollateralAddEditComponent implements OnInit {
  @Input() AppId: any;
  @Input() mode: any;
  @Input() AppCollateralId: number;
  @Input() showCancel: boolean = true;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() collValue: EventEmitter<object> = new EventEmitter();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;

  pageType: string = "add";
  LobCode: any;
  custNo: string;
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
  listCollateralData: any;
  listSelectedId: Array<number> = new Array<number>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
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
  AppCustObj: AppCustObj;
  // @ViewChild("CollateralModal", { read: ViewContainerRef }) collateralModal: ViewContainerRef;
  @ViewChild("CityIssuerModal", { read: ViewContainerRef }) cityIssuerModal: ViewContainerRef;
  @ViewChild("enjiForm") enjiForm: NgForm;
  items: FormArray;
  SerialNoList: any;
  
  appObj = {
    AppId: 0,
  };

  AddCollForm = this.fb.group({
    Collateral: ['New'],
    AssetTypeCode: [''],
    CollateralSeqNo: [1],
    CollateralName: ['', [Validators.required]],

    FullAssetCode: ['', [Validators.required]],
    FullAssetName: ['', [Validators.required]],
    AssetCategoryCode: [''],
    CollateralValueAmt: ['', [Validators.required, Validators.min(1)]],
    Notes: [''],

    SelfOwner: [false],
    OwnerName: [''],
    MrIdTypeCode: [''],
    OwnerRelationship: [''],
    OwnerIdNo: [''],
    CollateralOwnerAddr: [''],
    OwnerMobilePhn: [''],

    AssetRegion: [''],
    Color: [''],
    Transmition: [''],
    TaxCityIssuer: ['', [Validators.required]],
    Category: [''],
    CopyFromLegal: [''],
    BpkpIssueDate: [''],

    LocationAddrType: [''],

    CollPercentage: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
    CollateralPortionAmt: [0],
    OutstandingCollPrcnt: [0],
    items: this.fb.array([])
  });
  inputAddressObjForColl: any;
  inputAddressObjForLoc: any;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private componentFactoryResolver: ComponentFactoryResolver, private modalService: NgbModal) {
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
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode
    });
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
    ).catch((error) => {
    });
  }

  CollChange() {
    this.collateral = this.AddCollForm.controls["Collateral"].value;

    if (this.collateral == 'Exist') {
      this.clearList();
      var listCollateralNo: Array<string> = new Array();
      this.appCollateralObj = new AppCollateralObj();
      this.appCollateralObj.AppId = this.AppId;
      this.http.post(URLConstant.GetListAppCollateralByAppId, this.appCollateralObj).subscribe(
        (response) => {
          this.listCollateralData = response[CommonConstant.ReturnObj];
          for (let index = 0; index < this.listCollateralData.length; index++) {
            if (this.listCollateralData[index].CollateralStat == CommonConstant.AssetStatExisting)
              listCollateralNo.push(this.listCollateralData[index].CollateralNo);
          }

          if (listCollateralNo.length > 0)
            this.BindExistingCollateralSavedData(listCollateralNo);
        });
    }

  }

  BindExistingCollateralSavedData(listCollateralNo: any) {
    const addCritCollateralNo = new CriteriaObj();
    addCritCollateralNo.DataType = 'text';
    addCritCollateralNo.propName = 'CL.COLLATERAL_NO';
    addCritCollateralNo.restriction = AdInsConstant.RestrictionNotIn;
    addCritCollateralNo.listValue = listCollateralNo;
    this.tempPagingObj.addCritInput.push(addCritCollateralNo);
    this.tempPagingObj.isReady = true;
  }

  collateralTypeHandler() {
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
    this.AddCollForm.patchValue({
      FullAssetCode: "",
      FullAssetName: "",
      AssetCategoryCode: "",
      CollateralName: ""
    });

    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { AssetTypeCode: this.AddCollForm.controls["AssetTypeCode"].value
  }).subscribe(
   (response: any) => {
     while (this.items.length) {
       this.items.removeAt(0);
     }
     
     this.SerialNoList = response[CommonConstant.ReturnObj];
     for (let i = 0; i < this.SerialNoList.length; i++) {
       let eachDataDetail = this.fb.group({
         SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
         SerialNoValue: [''],
         IsMandatory: [this.SerialNoList[i].IsMandatory]
       }) as FormGroup;
       this.items.push(eachDataDetail);
     }

     for (let i = 0; i < this.items.length; i++) {
       if (this.items.controls[i]['controls']['IsMandatory'].value == true) {
         this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
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
     this.collateralPortionHandler();
   });
    // bookmark
    // const component = this.collateralModal.createComponent(componentFactory);
    // component.instance.lookupInput = this.inputLookupObj;
    // component.instance.parentForm = this.AddCollForm;
    // component.instance.enjiForm = this.enjiForm;
    // component.instance.identifier = 'CollateralName';
    // component.instance.lookup.subscribe((e) => this.getLookupCollateralName(e));
  }

  bindUcAddToTempData() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.tempPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";

    var appObj = { AppId: this.AppId }
    this.http.post(URLConstant.GetCustDataByAppId, appObj).subscribe(
      (response) => {
        var custObj = response['AppCustObj'];
        this.custNo = custObj["CustNo"];

        const addCritCustNo = new CriteriaObj();
        addCritCustNo.DataType = 'text';
        addCritCustNo.propName = 'CU.CUST_NO';
        addCritCustNo.restriction = AdInsConstant.RestrictionEq;
        addCritCustNo.value = this.custNo;
        this.tempPagingObj.addCritInput.push(addCritCustNo);
        this.tempPagingObj.isReady = true;
      });
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

  CopyUserForSelfOwner(){
    if (this.AddCollForm.controls.SelfOwner.value == true) {

      this.AddCollForm.controls.OwnerName.disable();
      this.AddCollForm.controls.OwnerRelationship.disable();
      this.AddCollForm.controls.OwnerMobilePhn.disable();
      this.AddCollForm.controls.MrIdTypeCode.disable();
      this.AddCollForm.controls.OwnerIdNo.disable();
      this.AddCollForm.controls.collOwnerAddress.disable();

      this.AppCustObj = new AppCustObj();
      this.collOwnerAddrObj = new AppCustAddrObj();

      var appObj = { "AppId": this.AppId };
      this.http.post(URLConstant.GetCustDataByAppId, appObj).subscribe(
        response => {
          this.AppCustObj = response['AppCustObj'];
          this.returnCollOwnerObj = response['AppCustAddrLegalObj'];

          this.AddCollForm.patchValue({
            OwnerName: this.AppCustObj.CustName,
            OwnerRelationship: "SELF",
            MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
            OwnerIdNo: this.AppCustObj.IdNo,
            OwnerMobilePhn: typeof(response['AppCustPersonalObj']) != 'undefined' ? response['AppCustPersonalObj']['MobilePhnNo1'] : ''
          })
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
        }
      )
    }
    else {
      this.AddCollForm.controls.OwnerName.enable();
      this.AddCollForm.controls.OwnerRelationship.enable();
      this.AddCollForm.controls.OwnerMobilePhn.enable();
      this.AddCollForm.controls.MrIdTypeCode.enable();
      this.AddCollForm.controls.OwnerIdNo.enable();
      this.AddCollForm.controls.collOwnerAddress.enable();
    }
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
        this.inputAddressObjForLoc.default = this.locationAddrObj;
        this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
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
        this.inputAddressObjForColl.default = this.collOwnerAddrObj;
        this.inputAddressObjForColl.inputField = this.inputFieldCollOwnerObj;
      });
  }

  ngOnInit() {
    this.items = this.AddCollForm.get('items') as FormArray;
    this.inputAddressObjForColl = new InputAddressObj();
    this.inputAddressObjForColl.title = "Collateral Owner";
    this.inputAddressObjForColl.showAllPhn = false;
    this.inputAddressObjForColl.showOwnership = false;
    this.inputAddressObjForColl.showSubsection = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;
    
    var context = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);
    if (this.mode == 'editColl') {
      this.appCollateralObj = new AppCollateralObj();
      this.appCollateralObj.AppCollateralId = this.AppCollateralId;
      this.http.post(this.getAppCollateralByAppCollateralId, this.appCollateralObj).subscribe(
        (response) => {
          this.returnAppCollateralObj = response;
          if (this.returnAppCollateralObj.CollateralStat == CommonConstant.AssetStatNew) {
            this.AddCollForm.patchValue({
              Collateral: "New"
            });
          }
          else {
            this.AddCollForm.patchValue({
              Collateral: "Exist"
            });
          }
          this.CollChange();
          this.AddCollForm.patchValue({
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
            SelfOwner: (this.returnAppCollateralRegistObj.MrOwnerRelationshipCode=="SELF"),
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
          this.inputAddressObjForColl.default = this.collOwnerAddrObj;
          this.inputAddressObjForColl.inputField = this.inputFieldCollOwnerObj;
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
          this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.LocationZipcode };
          this.inputAddressObjForLoc.default = this.locationAddrObj;
          this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
        });

      this.http.post(URLConstant.GetAppCollateralAttrByAppCollateralId, { AppCollateralId: this.AppCollateralId }).subscribe(
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

    this.collTypeObj = new AssetTypeObj();
    this.http.post(this.getListAssetTypeByCode, this.collTypeObj).subscribe(
      (response) => {
        this.returnCollTypeObj = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({ AssetTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
        this.collateralTypeHandler();
        
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
        criteriaObj.value = response[CommonConstant.ReturnObj][0]['Key'];
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

    this.bindUcAddToTempData();
  }

  collateralPortionHandler(){
    const fullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    const assetType = this.AddCollForm.controls["AssetTypeCode"].value;
    var serialNoForm = this.items.controls[0] as FormGroup;
    const serialNo1 = serialNoForm.controls["SerialNo1"].value;
    const currCollPrcnt = this.AddCollForm.controls["CollPercentage"].value;

    if(fullAssetCode && assetType && serialNo1){
      this.http.post(URLConstant.GetCollateralByFullAssetCodeAssetTypeSerialNoForAppCollateral, { FullAssetCode: fullAssetCode, AssetTypeCode: assetType, SerialNo1: serialNo1 }).toPromise().then(
        (response) => {
          var outCollPrcnt = 100;
          if(response){
            if(response["CollateralPrcnt"] && response["CollateralPrcnt"] > 0){
              outCollPrcnt = response["CollateralPrcnt"]; 
            }
          }
          outCollPrcnt -= currCollPrcnt;
          var collPortionAmt = this.AddCollForm.controls["CollateralValueAmt"].value * (this.AddCollForm.controls["CollateralPrcnt"].value / 100);
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
    ).catch((error) => {
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
    // this.appCollateralDataObj.AppCollateralObj.AssetCategoryCode = "MOBIL1000";
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
  }

  setCollateralAttribute() {
    this.assetRegionAttrObj = new AppCollateralAttrObj();
    this.assetRegionAttrObj.CollateralAttrCode = CommonConstant.AppCollateralAttrAssetRegion;
    this.assetRegionAttrObj.CollateralAttrName = "Asset Region";
    this.assetRegionAttrObj.AttrValue = this.AddCollForm.controls["AssetRegion"].value;

    this.colorAttrObj = new AppCollateralAttrObj();
    this.colorAttrObj.CollateralAttrCode = CommonConstant.AppCollateralAttrColor;
    this.colorAttrObj.CollateralAttrName = "Color";
    this.colorAttrObj.AttrValue = this.AddCollForm.controls["Color"].value;

    this.categoryAttrObj = new AppCollateralAttrObj();
    this.categoryAttrObj.CollateralAttrCode = CommonConstant.AppCollateralAttrCategory;
    this.categoryAttrObj.CollateralAttrName = "Category";
    this.categoryAttrObj.AttrValue = this.AddCollForm.controls["Category"].value;

    this.transmitionAttrObj = new AppCollateralAttrObj();
    this.transmitionAttrObj.CollateralAttrCode = CommonConstant.AppCollateralAttrTransmition;
    this.transmitionAttrObj.CollateralAttrName = "Transmition";
    this.transmitionAttrObj.AttrValue = this.AddCollForm.controls["Transmition"].value;

    this.bpkbCityIssuerAttrObj = new AppCollateralAttrObj();
    this.bpkbCityIssuerAttrObj.CollateralAttrCode = CommonConstant.AppCollateralAttrTaxCityIssuer;
    this.bpkbCityIssuerAttrObj.CollateralAttrName = "Tax City Issuer";
    this.bpkbCityIssuerAttrObj.AttrValue = this.AddCollForm.controls["TaxCityIssuer"].value;

    this.bpkbIssueDateAttrObj = new AppCollateralAttrObj();
    this.bpkbIssueDateAttrObj.CollateralAttrCode = CommonConstant.AppCollateralAttrBpkbIssueDate;
    this.bpkbIssueDateAttrObj.CollateralAttrName = "BPKB Issue Date";
    this.bpkbIssueDateAttrObj.AttrValue = this.AddCollForm.controls["BpkpIssueDate"].value;

    if (this.AddCollForm.controls["AssetRegion"].value != "" && this.AddCollForm.controls["AssetRegion"].value != null) {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.assetRegionAttrObj);
    }
    if (this.AddCollForm.controls["Color"].value != "" && this.AddCollForm.controls["Color"].value != null) {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.colorAttrObj);
    }
    if (this.AddCollForm.controls["Category"].value != "" && this.AddCollForm.controls["Category"].value != null) {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.categoryAttrObj);
    }
    if (this.AddCollForm.controls["Transmition"].value != "" && this.AddCollForm.controls["Transmition"].value != null) {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.transmitionAttrObj);
    }
    if (this.AddCollForm.controls["TaxCityIssuer"].value != "" && this.AddCollForm.controls["TaxCityIssuer"].value != null) {
      this.appCollateralDataObj.AppCollateralAttrObj.push(this.bpkbCityIssuerAttrObj);
    }
    if (this.AddCollForm.controls["BpkpIssueDate"].value != "" && this.AddCollForm.controls["BpkpIssueDate"].value != null) {
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
    const fullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    const assetType = this.AddCollForm.controls["AssetTypeCode"].value;
    var serialNoForm = this.items.controls[0] as FormGroup;
    const serialNo1 = serialNoForm.controls["SerialNo1"].value;
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
    if(this.AddCollForm.controls["OutstandingCollPrcnt"].value < 0){
      this.toastr.warningMessage("Collateral Portion Usage Cannot Exceed Outstanding Collateral Percentage");
      return false;
    }
    if (this.AddCollForm.valid) {
      if (this.mode == 'addColl') {
        this.appCollateralDataObj = new AppCollateralDataObj();
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
        this.http.post(this.addEditAllCollateralData, this.appCollateralDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.collValue.emit({ mode: 'paging' });
            this.clearList();
          }
        );
      }
      else {
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
        this.http.post(this.addEditAllCollateralData, this.appCollateralDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            //this.router.navigate(["/Nap/AssetData/Paging"]);
            this.collValue.emit({ mode: 'paging' });
          }
        );
      }
    }
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListId;
  }

  clearList() {
    this.listSelectedId = [];
    this.tempPagingObj.addCritInput = new Array<CriteriaObj>();

    const addCritCustNo = new CriteriaObj();
    addCritCustNo.DataType = 'text';
    addCritCustNo.propName = 'CU.CUST_NO';
    addCritCustNo.restriction = AdInsConstant.RestrictionEq;
    addCritCustNo.value = this.custNo;
    this.tempPagingObj.addCritInput.push(addCritCustNo);
  }

  SaveExistingCollateral() {
    this.appCollateralObj = new AppCollateralObj();
    this.appCollateralObj.AppId = this.AppId;
    this.appCollateralObj.ListCollateralId = new Array();

    if (this.listSelectedId.length == 0) {
      this.toastr.warningMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }
    this.appCollateralObj.ListCollateralId = this.listSelectedId;

    this.http.post(URLConstant.AddExistingAppCollateralData, this.appCollateralObj).subscribe(
      response => {
        this.toastr.successMessage(response['message']);
        this.collValue.emit({ mode: 'paging' });
        this.clearList();
      }
    );
  }

  SaveForm() {
    this.clearList();
  }
}