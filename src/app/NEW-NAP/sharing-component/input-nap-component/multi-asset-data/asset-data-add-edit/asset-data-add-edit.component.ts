import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { VendorEmpObj } from 'app/shared/model/VendorEmp.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';

@Component({
  selector: 'app-asset-data-add-edit',
  templateUrl: './asset-data-add-edit.component.html'
})
export class AssetDataAddEditComponent implements OnInit {
  @Input() AppId: any;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  pageType: string = "add";
  custType: string;
  AppAssetId: any;
  branchObj : any;
  listBranchObj: any;
  salesObj: any;
  listSalesObj: any;
  adminHeadObj: any;
  listAdminHeadObj: any;
  getListAppAssetData: any;
  getListVendorEmp: any;
  getListActiveRefMasterUrl: any;
  InputLookupSupplierObj: any;
  InputLookupAssetObj: any;
  inputAssetLocAddressObj: any;
  assetConditionObj: any;
  returnAssetConditionObj: any;
  downPaymentObj: any;
  returnDownPaymentObj: any;
  userRelationshipObj: any;
  returnUserRelationshipObj: any;
  AddrLegalObj: any;
  AddrMailingObj: any;
  AddrResidenceObj: any;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AppCustAddrObj;
  getAppCustAddrUrl: any;
  AppCustAddrObj: any;
  getAppCustAddrByAppCustAddrId: any;
  appCustAddrObj: any;
  returnAppCustAddrObj: any;

  AssetDataForm = this.fb.group({
    BranchManagerName:[''],
    SalesPersonName:[''],
    AdminHead:[''],

    MrDownPaymentTypeCode:[''],
    AssetPrice:[''],
    DownPayment:[''],
    MrAssetConditionCode:[''],
    AssetUsage:[''],
    LicensePlate:[''],
    ChassisNo:[''],
    ManufacturingYear:[''],
    EngineNo:[''],
    Notes:[''],

    SelfUsage: false,
    Username:[''],
    UserRelationship:[''],

    CopyAddr:[''],
    LocationAddr: ['', Validators.maxLength(50)],
    LocationAreaCode1: ['', Validators.maxLength(50)],
    LocationAreaCode2: ['', Validators.maxLength(50)],
    LocationAreaCode3: ['', Validators.maxLength(50)],
    LocationAreaCode4: ['', Validators.maxLength(50)],
    LocationCity: ['', Validators.maxLength(50)],
    LocationZipcode: ['', Validators.maxLength(50)],

    LocationAddrType: [''],

    //BranchManagerName: [''],
    BranchManagerNo: [''],
    BranchManagerPosition: ['']
  });

  appObj = {
    AppId: 0,
  };

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    this.getListAppAssetData = AdInsConstant.GetListAppAssetData;
    this.getListVendorEmp = AdInsConstant.GetListKeyValueVendorEmpByVendorIdAndPosition;
    this.getListActiveRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getAppCustAddrUrl = AdInsConstant.GetListAppCustAddrByAppId;
    this.getAppCustAddrByAppCustAddrId = AdInsConstant.GetAppCustAddrByAppCustAddrId;

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

  SetAsset(event) {
    this.AssetDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode
    });
    console.log(event);
  }

GetListAddr() {
  this.appObj.AppId = this.AppId;
  this.http.post(this.getAppCustAddrUrl, this.appObj).toPromise().then(
    (response) => {
      this.AppCustAddrObj = response["ReturnObject"];
      this.AssetDataForm.patchValue({ LocationAddrType: response['ReturnObject'][0]['AppCustAddrId'] });
    }
  );
}

copyToLocationAddr() {
  this.appCustAddrObj = new AppCustAddrObj();
  this.appCustAddrObj.AppCustAddrId = this.AssetDataForm.controls["LocationAddrType"].value;
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

  SetSupplier(event){
    this.branchObj = new VendorEmpObj();
    this.branchObj.VendorId = event.VendorId;
    this.branchObj.MrVendorEmpPositionCode = 'BRANCH_MANAGER';
    this.http.post(this.getListVendorEmp, this.branchObj).subscribe(
    (response) => {
        this.listBranchObj = response["ReturnObject"];
        this.AssetDataForm.patchValue({ BranchManagerName: response['ReturnObject'][0]['Key'] });
      
    });

    this.salesObj = new VendorEmpObj();
    this.salesObj.VendorId = event.VendorId;
    this.salesObj.MrVendorEmpPositionCode = 'SALES_PERSON';
    this.http.post(this.getListVendorEmp, this.salesObj).subscribe(
    (response) => {
        this.listSalesObj = response["ReturnObject"];
        this.AssetDataForm.patchValue({ SalesPersonName: response['ReturnObject'][0]['Key'] });
      
    });

    this.adminHeadObj = new VendorEmpObj();
    this.adminHeadObj.VendorId = event.VendorId;
    this.adminHeadObj.MrVendorEmpPositionCode = 'ADMIN_HEAD';
    this.http.post(this.getListVendorEmp, this.adminHeadObj).subscribe(
    (response) => {
        this.listAdminHeadObj = response["ReturnObject"];
        this.AssetDataForm.patchValue({ AdminHead: response['ReturnObject'][0]['Key'] });
      
    });
  }

  BranchChanged(event){
    this.AssetDataForm.patchValue({
      OfficeName: this.listBranchObj.find(x => x.Key == event.target.value).Value
    });
  }

  ngOnInit() {
    this.GetListAddr();

    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();

    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    this.assetConditionObj = new RefMasterObj();
    this.assetConditionObj.RefMasterTypeCode = "ASSET_CONDITION";
    this.http.post(this.getListActiveRefMasterUrl, this.assetConditionObj).subscribe(
      (response) => {
        this.returnAssetConditionObj = response["ReturnObject"];
        this.AssetDataForm.patchValue({ MrAssetConditionCode: response['ReturnObject'][0]['Key'] });
      }
    );

    this.downPaymentObj = new RefMasterObj();
    this.downPaymentObj.RefMasterTypeCode = "DOWN_PAYMENT_TYPE";
    this.http.post(this.getListActiveRefMasterUrl, this.downPaymentObj).subscribe(
      (response) => {
        this.returnDownPaymentObj = response["ReturnObject"];
        this.AssetDataForm.patchValue({ MrDownPaymentTypeCode: response['ReturnObject'][0]['Key'] });
      }
    );

    this.userRelationshipObj = new RefMasterObj();
    this.userRelationshipObj.RefMasterTypeCode = "CUST_PERSONAL_RELATIONSHIP";
    this.http.post(this.getListActiveRefMasterUrl, this.userRelationshipObj).subscribe(
      (response) => {
        this.returnUserRelationshipObj = response["ReturnObject"];
        this.AssetDataForm.patchValue({ UserRelationship: response['ReturnObject'][0]['Key'] });
      }
    );
  }

  editItem(custAddrObj: any) {
    this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  }

  // deleteItem(custAddrObj: any) {
  //   var custAddr = new CustAddrObj();
  //   custAddr.CustAddrId = custAddrObj.CustAddrId;
  //   this.http.post(this.deleteCustAddr, custAddr).subscribe(
  //     (response: any) => {
  //       this.toastr.successMessage(response["message"]);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  //   //this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  // }

}
