import { Component, OnInit, Input, Output, EventEmitter,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-collateral-add-edit',
  templateUrl: './collateral-add-edit.component.html'
})
export class CollateralAddEditComponent implements OnInit {
  @Input() AppId: any;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;

  pageType: string = "add";
  AppAssetId: any;
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
  inputFieldCollOwnerObj: any;
  ownerRelationshipObj: any;
  returnOwnerRelationshipObj: any;
  addEditAllCollateralData: any;

  appObj = {
    AppId: 0,
  };
  
  AddCollForm = this.fb.group({
    Collateral: [''],
    AssetTypeCode: [''],
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

    AssetRegion:[''],
    Color:[''],
    Transmition:[''],
    TaxCityIssuer:[''],
    Category:[''],
    BpkpIssueDate:[''],

    CollPercentage:[''],

    FullAssetCode: [''],

    LocationAddrType:[''],

    BranchManagerName: [''],
    BranchManagerNo: [''],
    BranchManagerPosition: ['']
  });

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    this.getListAppAssetData = AdInsConstant.GetListAppAssetData;
    this.getListVendorEmp = AdInsConstant.GetListVendorEmpByVendorIdAndPosition;
    this.getListActiveRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getAppCustAddrByAppCustAddrId = AdInsConstant.GetAppCustAddrByAppCustAddrId;
    this.getAppCustAddrUrl = AdInsConstant.GetListAppCustAddrByAppId;
    this.addEditAllCollateralData = AdInsConstant.AddEditAllCollateralData;

    this.route.queryParams.subscribe(params => {
      if (params["AppAssetId"] != null) {
         this.AppAssetId = params["AppAssetId"];
       }
      if (params["mode"] != null) {
        this.pageType = params["mode"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
       }
    });
  }

  getLookupCollateralTypeResponse(e) {
    this.AddCollForm.patchValue({
      FullAssetCode: e.AssetTypeCode,
      FullAssetName: e.FullAssetName
    });
  }

  getLookupCollateralName(event) {
    this.AddCollForm.patchValue({
      FullAssetCode: event.AssetTypeCode,
      //FullAssetName: event.FullAssetName
    });
  }

  CollChange(){
    this.collateral = this.AddCollForm.controls["Collateral"].value;

    console.log("aaa");
    console.log(this.collateral);
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
      }
      for (var i = 0; i < this.listSelectedId.length; i++) {
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

  SetBpkbCity(event) {
    this.AddCollForm.patchValue({
      TaxCityIssuer: event.DistrictCode,

    });
  }

  ngOnInit() {
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

  SaveExistingCollateral()
  {
    this.appCollateralObj = new AppCollateralObj();
    //this.appCollateralObj.AppId = this.MouCustId;
    this.appCollateralObj.ListCollateralId =  new Array();

    for (let index = 0; index < this.tempData.length; index++) {
      console.log(this.tempData);
      var mouColtr = {
        CollateralId: this.tempData[index].CollateralId
      }
      this.appCollateralObj.ListCollateralId.push(mouColtr.CollateralId);
    }

    if (this.appCollateralObj.ListCollateralId.length == 0) {
      this.toastr.typeErrorCustom('Please Add At Least One Data');
      return;
    }

    this.http.post(AdInsConstant.AddExistingCustCollateralData, this.appCollateralObj).subscribe(
      response => {
        this.toastr.successMessage(response['message']);
      },
      error => {
        console.log(error);
      }
    );
  }

  delete(MouCustCollId) {
    var custCollObj = { MouCustCollateralId: MouCustCollId };
    this.http.post(AdInsConstant.DeleteMouCustCollateral, custCollObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editItem(custAddrObj: any) {
    this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  }

}
