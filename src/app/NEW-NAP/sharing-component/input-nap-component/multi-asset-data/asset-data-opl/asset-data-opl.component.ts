import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { AllAssetDataObj } from 'app/shared/model/all-asset-data-obj.model';
import { AppAssetAttrCustomObj } from 'app/shared/model/app-asset/app-asset-attr-custom.model';
import { AppAssetAccessoryObj } from 'app/shared/model/app-asset-accessory-obj.model';
import { AppAssetAttrObj } from 'app/shared/model/app-asset-attr-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppCollateralAccessoryObj } from 'app/shared/model/app-collateral-accessory-obj.model';
import { AppCollateralAttrObj } from 'app/shared/model/app-collateral-attr-obj.model';
import { AppDataObj } from 'app/shared/model/app-data-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { UcDropdownListCallbackObj, UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj } from 'app/shared/model/request/vendor/req-vendor-emp.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-asset-data-opl',
  templateUrl: './asset-data-opl.component.html',
  styleUrls: []
})
export class AssetDataOplComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  
  ddlSalesPersonObj: UcDropdownListObj = new UcDropdownListObj();
  isDdlSalesPersonReady: boolean = false;
  // ddlAdminHeadObj: UcDropdownListObj = new UcDropdownListObj();
  // isDdlAdminHeadReady: boolean = false;
  // ddlBranchManagerObj: UcDropdownListObj = new UcDropdownListObj();
  // isDdlBranchManagerReady: boolean = false;
  ddlAssetConditionObj: UcDropdownListObj = new UcDropdownListObj();
  ddlAssetUsageObj: UcDropdownListObj = new UcDropdownListObj();
  dllAppCustAddrObj: UcDropdownListObj = new UcDropdownListObj();

  inputFieldDelivAddrObj: InputFieldObj;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AddrObj;
  delivAddrObj: AddrObj;
  inputAddressObjForDeliv: InputAddressObj;
  inputAddressObjForLoc: InputAddressObj;
  
  listAsset: Array<any> = new Array<any>();
  originalAppAssetAccessory: Array<AppAssetAccessoryObj>;
  appAssetAttrObjs: Array<AppAssetAttrCustomObj>;
  InputLookupAcceObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  InputLookupSupplObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  
  deleteAppAssetObj: AppAssetObj;
  copyAppAssetObj: AppAssetObj;
  allAssetDataObj: AllAssetDataObj;
  generalSettingObj: GeneralSettingObj = new GeneralSettingObj();
  
  dictAccLookup: { [key: string]: any; } = {};
  dictSuppLookup: { [key: string]: any; } = {};

  ListAttrAnswer = [];

  appObj = {
    Id: 0,
  };

  vendorAccSuppObj = {
    VendorId: 0,
    VendorCode: "",
  };

  accObj = {
    AssetAccessoryCode: "",
  };
  
  refMasterObj = {
    RefMasterTypeCode: "",
  };

  vendorObj = {
    VendorId: 0,
    VendorCode: "",
    // MrVendorEmpPositionCodes: [CommonConstant.ADMIN_HEAD_JOB_CODE, CommonConstant.SALES_JOB_CODE, CommonConstant.BRANCH_MANAGER_JOB_CODE]
    MrVendorEmpPositionCodes: [CommonConstant.SALES_JOB_CODE]
  };

  assetMasterObj = {
    FullAssetCode: "",
  };
  
  InputLookupSupplierObj: any;
  InputLookupCityIssuerObj: any;
  InputLookupAssetObj: any;
  InputLookupSupplAccObj: any;
  InputLookupAccObj: any;
  InputLookupAccSupObj: any;
  // AdminHeadObj: any;
  SalesPersonObj: any;
  // BranchManagerObj: any;
  OfficeCode: any;
  appData: any;
  AddrObj: any;
  AppObj: any;
  appAssetObj: any;
  AppAssetAttrObj: any;
  AppCustObj: any;
  AppCustCoyObj: any;
  AppCustAddrObj: any;
  AssetMasterObj: any;
  // EmpObj: any;
  VendorObj: any;
  SupervisorObj: any;
  RefProdCmptAssetType: any;
  RefProdCmptSupplSchm: any;
  RefProdCmptAssetSchm: any;
  copyFromAppCustAddrForDelivery: any;
  copyFromAppCustAddrForLocation: any;
  
  appAssetId: number = 0;
  index: number = 0;
  units: number = 0;
  priceAfterDiscount: number = 0;

  isListAsset: boolean = false;
  isDiffWithRefAttr: boolean = false;
  isAssetAttrReady: boolean = false;
  isOnlookup: boolean = false;
  
  adminHead: string;
  salesSupervisor: string;
  branchManager: string;
  mode: string = "Add";
  CustType: string = "";
  IntegratorCheckBySystemGsValue: string = "1";
  AssetConditionName: string = "";

  AssetDataForm = this.fb.group({
    /* AppAsset Value that in form*/
    FullAssetName: ['', [Validators.required, Validators.maxLength(1000)]], 
    MrAssetConditionCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrAssetUsageCode: ['', [Validators.required, Validators.maxLength(50)]],
    SupplName: ['', Validators.maxLength(500)],
    AssetPriceAmt: ['', Validators.required],
    AssetNotes: ['', [Validators.maxLength(4000)]],
    Color: ['', Validators.maxLength(50)],
    TaxCityIssuer: ['', Validators.required],
    TaxIssueDt: [''],
    Discount: [0],
    ExpectedDelivDt: [''],
    IsNeedReplacementCar: [false],
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],

    /* AppAsset Value That required but not in form*/
    AssetSeqNo: ['1', Validators.required],
    FullAssetCode: ['', [Validators.required, Validators.maxLength(500)]],
    AssetStat: ['NEW', [Validators.required, Validators.maxLength(50)]],
    AssetTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    AssetCategoryCode: ['', [Validators.required, Validators.maxLength(50)]],
    SupplCode: ['', Validators.maxLength(50)],

    /*Admin Head SuppEmp*/
    AdminHeadId: [''],
    AdminHeadName: ['', [Validators.maxLength(500)]],
    AdminHeadNo: ['', [Validators.maxLength(50)]],
    AdminHeadPositionCode: ['', [Validators.maxLength(50)]],

    /*Sales Person SuppEmp*/
    SalesPersonId: ['', Validators.required],
    SalesPersonName: ['', [Validators.required, Validators.maxLength(500)]],
    SalesPersonNo: ['', [Validators.required, Validators.maxLength(50)]],
    SalesPersonPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    /*Branch Manager SuppEmp*/
    BranchManagerId: [''],
    BranchManagerName: ['', Validators.maxLength(500)],
    BranchManagerNo: ['', Validators.maxLength(50)],
    BranchManagerPositionCode: ['', Validators.maxLength(50)],

    DelivAddr: [''],
    DelivAreaCode1: ['', Validators.maxLength(50)],
    DelivAreaCode2: ['', Validators.maxLength(50)],
    DelivAreaCode3: ['', Validators.maxLength(50)],
    DelivAreaCode4: ['', Validators.maxLength(50)],
    DelivCity: ['', Validators.maxLength(50)],
    DelivZipcode: ['', Validators.maxLength(50)],
    LocationAddr: [''],
    LocationAreaCode1: ['', Validators.maxLength(50)],
    LocationAreaCode2: ['', Validators.maxLength(50)],
    LocationAreaCode3: ['', Validators.maxLength(50)],
    LocationAreaCode4: ['', Validators.maxLength(50)],
    LocationCity: ['', Validators.maxLength(50)],
    LocationZipcode: ['', Validators.maxLength(50)],

    LocationAddrType: [''],
    DelivAddrType: [''],
    OwnerAddrType: [''],
    AssetAccessoriesObjs: this.fb.array([]),
    AppAssetAttrObjs: this.fb.array([]),
  });
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"] ? params["AppId"] : this.AppId;
    });
    this.originalAppAssetAccessory = new Array<AppAssetAccessoryObj>();
  }

  async ngOnInit(): Promise<void> {
    this.ddlSalesPersonObj.isSelectOutput = true;
    // this.ddlAdminHeadObj.isSelectOutput = true;
    // this.ddlBranchManagerObj.isSelectOutput = true;
    this.ddlSalesPersonObj.customKey = "VendorEmpId"
    this.ddlSalesPersonObj.customValue = "VendorEmpName"
    // this.ddlAdminHeadObj.customKey = "VendorEmpId"
    // this.ddlAdminHeadObj.customValue = "VendorEmpName"
    // this.ddlBranchManagerObj.customKey = "VendorEmpId"
    // this.ddlBranchManagerObj.customValue = "VendorEmpName"

    this.isListAsset = true;

    this.inputAddressObjForDeliv = new InputAddressObj();
    this.inputAddressObjForDeliv.showSubsection = false;
    this.inputAddressObjForDeliv.showAllPhn = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;

    this.isOnlookup = false;
    await this.GetAppData();
    await this.GetRefProdCompt();
    await this.GetAppCust();
    await this.GetAppCustPhone();
    await this.bindAllRefMasterObj();
    this.initLookup();
    this.locationAddrObj = new AddrObj();
    this.delivAddrObj = new AddrObj();
    this.inputFieldDelivAddrObj = new InputFieldObj();
    this.inputFieldDelivAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();

    if (this.CustType == CommonConstant.CustTypeCompany) {
      await this.GetAppCustCoy();
    }
    await this.GetListAddr();
    this.AssetDataForm.removeControl("AssetAccessoriesObjs");
    this.AssetDataForm.addControl("AssetAccessoriesObjs", this.fb.array([]));

    await this.getListAllAssetData();
    
    this.GenerataAppAssetAttr(false);
  }

  AddAsset() {
    this.mode = "Add";
    this.adminHead = "";
    this.salesSupervisor = "";
    this.branchManager = "";
    this.isDdlSalesPersonReady = false;
    // this.isDdlAdminHeadReady = false;
    // this.isDdlBranchManagerReady = false;
    this.copyFromAppCustAddrForDelivery = undefined;
    this.copyFromAppCustAddrForLocation = undefined;

    this.InputLookupSupplierObj.jsonSelect = "";
    this.InputLookupSupplierObj.nameSelect = "";

    this.InputLookupAssetObj.jsonSelect = "";
    this.InputLookupAssetObj.nameSelect = "";

    this.InputLookupCityIssuerObj.jsonSelect = "";
    this.InputLookupCityIssuerObj.nameSelect = "";

    this.inputAddressObjForDeliv.showSubsection = false;
    this.inputAddressObjForDeliv.showAllPhn = false;
    this.inputFieldDelivAddrObj.inputLookupObj.nameSelect = "";
    this.inputFieldDelivAddrObj.inputLookupObj.jsonSelect = "";
    this.inputAddressObjForDeliv.default = null;
    this.inputAddressObjForDeliv.inputField = this.inputFieldDelivAddrObj;

    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;
    this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = "";
    this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = "";
    this.inputAddressObjForLoc.default = null;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
    
    // this.AdminHeadObj = null;
    this.SalesPersonObj = null;
    // this.BranchManagerObj = null;

    this.AssetDataForm.patchValue({
      FullAssetName: "",
      FullAssetCode: "",
      AssetTypeCode: "",
      AssetCategoryCode: "",
      MrAssetConditionCode: "",
      MrAssetUsageCode: "",
      ManufacturingYear: "",
      AssetPriceAmt: "",
      Discount: 0,
      ExpectedDelivDt: "",
      IsNeedReplacementCar: false,
      AssetNotes: "",
      Color: "",
      SalesPersonId: 0,
      SalesPersonName: "",
      SalesPersonNo: "",
      SalesPersonPositionCode: "",
      AdminHeadId: 0,
      AdminHeadName: "",
      AdminHeadNo: "",
      AdminHeadPositionCode: "",
      BranchManagerId: 0,
      BranchManagerName: "",
      BranchManagerNo: "",
      BranchManagerPositionCode: ""
    });

    this.AssetDataForm.removeControl("AssetAccessoriesObjs");
    this.AssetDataForm.addControl("AssetAccessoriesObjs", this.fb.array([]));
    
    var appAttrObjs = this.AssetDataForm.controls["AppAssetAttrObjs"] as FormArray;
    for (let i = 0; i < appAttrObjs.value.length; i++) {
      appAttrObjs.controls[i].patchValue({
        AttrValue: ""
      });
    }
    
    this.isListAsset = false;
  }

  async Edit(index: any) {
    this.mode = "Edit";
    this.index = index;

    this.allAssetDataObj = this.listAsset[this.index];
    this.appAssetId = this.allAssetDataObj.AppAssetObj.AppAssetId;

    // this.AdminHeadObj = null;
    this.SalesPersonObj = null;
    // this.BranchManagerObj = null;
    this.vendorObj.VendorCode = this.allAssetDataObj.AppAssetObj.SupplCode;
    await this.GetVendor();
    this.GetVendorEmpList();

    this.InputLookupAssetObj.jsonSelect = { FullAssetName: this.allAssetDataObj.AppAssetObj.FullAssetName };
    this.InputLookupAssetObj.nameSelect = this.allAssetDataObj.AppAssetObj.FullAssetName;

    this.InputLookupCityIssuerObj.jsonSelect = { DistrictName: this.allAssetDataObj.AppAssetObj.TaxCityIssuer };
    this.InputLookupCityIssuerObj.nameSelect = this.allAssetDataObj.AppAssetObj.TaxCityIssuer;

    this.inputAddressObjForDeliv.showSubsection = false;
    this.inputAddressObjForDeliv.showAllPhn = false;
    this.inputFieldDelivAddrObj.inputLookupObj.nameSelect = this.allAssetDataObj.AppCollateralRegistrationObj.DelivZipcode;
    this.inputFieldDelivAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.allAssetDataObj.AppCollateralRegistrationObj.DelivZipcode };
    this.delivAddrObj = new AddrObj();
    this.delivAddrObj.Addr = this.allAssetDataObj.AppCollateralRegistrationObj.DelivAddr;
    this.delivAddrObj.AreaCode1 = this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode1;
    this.delivAddrObj.AreaCode2 = this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode2;
    this.delivAddrObj.AreaCode3 = this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode3;
    this.delivAddrObj.AreaCode4 = this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode4;
    this.delivAddrObj.City = this.allAssetDataObj.AppCollateralRegistrationObj.DelivCity;
    this.inputAddressObjForDeliv.default = this.delivAddrObj;
    this.inputAddressObjForDeliv.inputField = this.inputFieldDelivAddrObj;

    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;
    this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.allAssetDataObj.AppCollateralRegistrationObj.LocationZipcode;
    this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.allAssetDataObj.AppCollateralRegistrationObj.LocationZipcode };
    this.locationAddrObj = new AddrObj();
    this.locationAddrObj.Addr = this.allAssetDataObj.AppCollateralRegistrationObj.LocationAddr;
    this.locationAddrObj.AreaCode1 = this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode1;
    this.locationAddrObj.AreaCode2 = this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode2;
    this.locationAddrObj.AreaCode3 = this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode3;
    this.locationAddrObj.AreaCode4 = this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode4;
    this.locationAddrObj.City = this.allAssetDataObj.AppCollateralRegistrationObj.LocationCity;
    this.inputAddressObjForLoc.default = this.locationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;

    this.AssetDataForm.patchValue({
      FullAssetName: this.allAssetDataObj.AppAssetObj.FullAssetName,
      FullAssetCode: this.allAssetDataObj.AppAssetObj.FullAssetCode,
      AssetTypeCode: this.allAssetDataObj.AppAssetObj.AssetTypeCode,
      AssetCategoryCode: this.allAssetDataObj.AppAssetObj.AssetCategoryCode,
      MrAssetConditionCode: this.allAssetDataObj.AppAssetObj.MrAssetConditionCode,
      MrAssetUsageCode: this.allAssetDataObj.AppAssetObj.MrAssetUsageCode,
      ManufacturingYear: this.allAssetDataObj.AppAssetObj.ManufacturingYear,
      AssetPriceAmt: this.allAssetDataObj.AppAssetObj.AssetPriceAmt,
      Discount: this.allAssetDataObj.AppAssetObj.Discount,
      ExpectedDelivDt: this.allAssetDataObj.AppAssetObj.ExpectedDelivDt,
      IsNeedReplacementCar: this.allAssetDataObj.AppAssetObj.IsNeedReplacementCar,
      AssetNotes: this.allAssetDataObj.AppAssetObj.AssetNotes,
      Color: this.allAssetDataObj.AppAssetObj.Color,
      SalesPersonId: this.allAssetDataObj.AppAssetSupplEmpSalesObj.VendorEmpId,
      SalesPersonName: this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName,
      SalesPersonNo: this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo,
      SalesPersonPositionCode: this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode,
      AdminHeadId: this.allAssetDataObj.AppAssetSupplEmpAdminObj.VendorEmpId,
      AdminHeadName: this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName,
      AdminHeadNo: this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo,
      AdminHeadPositionCode: this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode,
      BranchManagerId: this.allAssetDataObj.AppAssetSupplEmpManagerObj.VendorEmpId,
      BranchManagerName: this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName,
      BranchManagerNo: this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo,
      BranchManagerPositionCode: this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode,
      TaxCityIssuer: this.allAssetDataObj.AppAssetObj.TaxCityIssuer
    });

    this.priceAfterDiscount = this.allAssetDataObj.AppAssetObj.AssetPriceAmt - this.allAssetDataObj.AppAssetObj.Discount;

    this.AssetDataForm.removeControl("AssetAccessoriesObjs");
    this.AssetDataForm.addControl("AssetAccessoriesObjs", this.fb.array([]));
    for (let i = 0; i < this.allAssetDataObj.AppAssetAccessoryObjs.length; i++) {
      var appAccessoryObjs = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
      appAccessoryObjs.push(this.addGroup(this.allAssetDataObj.AppAssetAccessoryObjs[i], i));

      var InputLookupAccObj = this.initLookupAcc();
      var InputLookupAccSupObj = this.initLookupSuppAcc();
      this.dictAccLookup[i] = InputLookupAccObj;
      this.dictSuppLookup[i] = InputLookupAccSupObj;
      this.InputLookupAcceObjs.push(InputLookupAccObj);
      this.InputLookupSupplObjs.push(InputLookupAccSupObj);

      this.setAppAccessorySupplier(i, this.allAssetDataObj.AppAssetAccessoryObjs[i].SupplCode);
      this.setAppAccessory(i, this.allAssetDataObj.AppAssetAccessoryObjs[i].AssetAccessoryCode);
    }

    var appAttrObjs = this.AssetDataForm.controls["AppAssetAttrObjs"] as FormArray;
    for (let i = 0; i < this.allAssetDataObj.AppCollateralAttrObj.length; i++) {
      appAttrObjs.controls[i].patchValue({
        AttrValue: this.allAssetDataObj.AppCollateralAttrObj[i].AttrValue
      });
    }
    
    this.isListAsset = false;
  }

  Delete(index: any) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.allAssetDataObj = this.listAsset[index];
      this.deleteAppAssetObj = new AppAssetObj();
      this.deleteAppAssetObj.AppAssetId = this.allAssetDataObj.AppAssetObj.AppAssetId;
      this.deleteAppAssetObj.AppId = this.AppId;
      this.http.post(URLConstant.DeleteAppAsset, this.deleteAppAssetObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.getListAllAssetData();
        }
      );
    }
  }

  ChangeAssetName(index: any) {
    this.index = index;
  }

  CopyAsset() {
    if(this.units !== 0) {
      this.allAssetDataObj = this.listAsset[this.index];
      this.copyAppAssetObj = new AppAssetObj();
      this.copyAppAssetObj.AppId = this.AppId;
      this.copyAppAssetObj.AppAssetId = this.allAssetDataObj.AppAssetObj.AppAssetId;
      this.copyAppAssetObj.BizTemplateCode = CommonConstant.OPL;
      this.copyAppAssetObj.count = this.units;
      this.http.post(URLConstant.CopyAppAsset, this.copyAppAssetObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.getListAllAssetData();
        }
      );
    }
  }

  Cancel() {
    this.outputCancel.emit();
  }

  Save() {
    this.toastr.successMessage("Save Asset Data Success!");
    this.outputTab.emit();
  }

  async SetSupplier(event) {
    this.salesSupervisor = "";
    this.vendorObj.VendorCode = event.VendorCode;
    this.vendorObj.VendorId = event.VendorId;
    await this.GetVendor();
    this.GetVendorEmpList();
  }

  SalesPersonChanged(event) {
    this.salesSupervisor = "";
    this.adminHead = "";
    this.branchManager = "";
    this.AssetDataForm.patchValue({
      SalesPersonId: "",
      SalesPersonName: "",
      SalesPersonNo: "",
      SalesPersonPositionCode: "",
      AdminHeadName: "",
      AdminHeadNo: "",
      AdminHeadPositionCode: "",
      BranchManagerName: "",
      BranchManagerNo: "",
      BranchManagerPositionCode: ""
    });
    if (event.selectedObj != undefined) {
      var temp: any;
      temp = this.SalesPersonObj.filter(emp => emp.VendorEmpId == event.selectedValue);
      this.AssetDataForm.patchValue({
        SalesPersonId: temp[0].VendorEmpId,
        SalesPersonName: temp[0].VendorEmpName,
        SalesPersonNo: temp[0].VendorEmpNo,
        SalesPersonPositionCode: temp[0].MrVendorEmpPositionCode
      });
      if(temp[0].SupervisorId !== null) {
        this.http.post(URLConstant.GetAllSupervisorFromSalesPersonBySupervisorId, { Id : temp[0].SupervisorId }).subscribe(
          (response) => {
            this.SupervisorObj = response[CommonConstant.ReturnObj];
  
            for(let i = 0; i < this.SupervisorObj.length; i++) {
              switch (this.SupervisorObj[i].MrVendorEmpPositionCode) {
                case CommonConstant.ADMIN_HEAD_JOB_CODE: {
                  this.adminHead = this.SupervisorObj[i].VendorEmpName;
                  this.AssetDataForm.patchValue({
                    AdminHeadName: this.SupervisorObj[i].VendorEmpName,
                    AdminHeadNo: this.SupervisorObj[i].VendorEmpNo,
                    AdminHeadPositionCode: this.SupervisorObj[i].MrVendorEmpPositionCode
                  });
                  break;
                }
                case CommonConstant.BRANCH_MANAGER_JOB_CODE: {
                  this.branchManager = this.SupervisorObj[i].VendorEmpName;
                  this.AssetDataForm.patchValue({
                    BranchManagerName: this.SupervisorObj[i].VendorEmpName,
                    BranchManagerNo: this.SupervisorObj[i].VendorEmpNo,
                    BranchManagerPositionCode: this.SupervisorObj[i].MrVendorEmpPositionCode
                  });
                  break;
                }
                case CommonConstant.SUPERVISOR_JOB_CODE: {
                  this.salesSupervisor = this.SupervisorObj[i].VendorEmpName;
                  break;
                }
                default: {
                  break;
                }
              }
              // if(this.SupervisorObj[i].MrVendorEmpPositionCode === CommonConstant.ADMIN_HEAD_JOB_CODE) {
              //   this.adminHead = this.SupervisorObj[i].VendorEmpName;
              //   this.AssetDataForm.patchValue({
              //     AdminHeadName: this.SupervisorObj[i].VendorEmpName,
              //     AdminHeadNo: this.SupervisorObj[i].VendorEmpNo,
              //     AdminHeadPositionCode: this.SupervisorObj[i].MrVendorEmpPositionCode
              //   });
              // }
              // else if(this.SupervisorObj[i].MrVendorEmpPositionCode === CommonConstant.BRANCH_MANAGER_JOB_CODE) {
              //   this.branchManager = this.SupervisorObj[i].VendorEmpName;
              //   this.AssetDataForm.patchValue({
              //     BranchManagerName: this.SupervisorObj[i].VendorEmpName,
              //     BranchManagerNo: this.SupervisorObj[i].VendorEmpNo,
              //     BranchManagerPositionCode: this.SupervisorObj[i].MrVendorEmpPositionCode
              //   });
              // }
              // else if(this.SupervisorObj[i].MrVendorEmpPositionCode === CommonConstant.SUPERVISOR_JOB_CODE) {
              //   this.salesSupervisor = this.SupervisorObj[i].VendorEmpName;
              // }
            }
          }
        );
      }
    }
  }

  // AdminHeadChanged(event) {
  //   if (event.selectedObj != undefined) {
  //     var temp: any;
  //     temp = this.EmpObj.filter(emp => emp.VendorEmpId == event.selectedValue);
  //     this.AssetDataForm.patchValue({
  //       AdminHeadId: temp[0].VendorEmpId,
  //       AdminHeadName: temp[0].VendorEmpName,
  //       AdminHeadNo: temp[0].VendorEmpNo,
  //       AdminHeadPositionCode: temp[0].MrVendorEmpPositionCode,
  //     });
  //   }
  //   else {
  //     this.AssetDataForm.patchValue({
  //       AdminHeadId: "",
  //       AdminHeadName: "",
  //       AdminHeadNo: "",
  //       AdminHeadPositionCode: "",
  //     });
  //   }
  // }

  // BranchManagerChanged(event) {
  //   if (event.selectedObj != undefined) {
  //     var temp: any;
  //     temp = this.EmpObj.filter(emp => emp.VendorEmpId == event.selectedValue);
  //     this.AssetDataForm.patchValue({
  //       BranchManagerId: temp[0].VendorEmpId,
  //       BranchManagerName: temp[0].VendorEmpName,
  //       BranchManagerNo: temp[0].VendorEmpNo,
  //       BranchManagerPositionCode: temp[0].MrVendorEmpPositionCode,
  //     });
  //   }
  //   else {
  //     this.AssetDataForm.patchValue({
  //       BranchManagerId: "",
  //       BranchManagerName: "",
  //       BranchManagerNo: "",
  //       BranchManagerPositionCode: "",
  //     });
  //   }
  // }

  SetAsset(event) {
    this.assetMasterObj.FullAssetCode = event.FullAssetCode;
    this.GetAssetMaster(this.assetMasterObj);
    this.AssetDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode
    });
  }

  AssetConditionChanged(event : UcDropdownListCallbackObj) {
    this.AssetConditionName = event.selectedObj.Value;
  }
  
  updateValueAssetPrice() {
    var assetPriceAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    var discount = this.AssetDataForm.controls.Discount.value;
    this.priceAfterDiscount = assetPriceAmt - discount;
  }

  SetBpkbCity(event) {
    this.AssetDataForm.patchValue({
      TaxCityIssuer: event.DistrictCode,
    });
  }

  addAccessories() {
    if (this.AssetDataForm.get("AssetTypeCode").value == "") {
      return this.toastr.warningMessage("Please Choose Asset First");
    }
    var appAccessoryObj = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
    var length = this.AssetDataForm.value["AssetAccessoriesObjs"].length;
    var max = 0;
    if (length > 0) {
      max = this.AssetDataForm.value["AssetAccessoriesObjs"][length - 1].No;
    }

    appAccessoryObj.push(this.addGroup(undefined, max + 1));

    var InputLookupAccObj = this.initLookupAcc();
    var InputLookupAccSupObj = this.initLookupSuppAcc();
    this.InputLookupAcceObjs.push(InputLookupAccObj);
    this.InputLookupSupplObjs.push(InputLookupAccSupObj);

    this.dictAccLookup[max + 1] = InputLookupAccObj;
    this.dictSuppLookup[max + 1] = InputLookupAccSupObj;
  }

  SetSupplierAccessory(i, event) {
    this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i].patchValue({
      SupplNameAccessory: event.VendorName,
      SupplCodeAccessory: event.VendorCode
    });
  }

  SetAccessory(i, event) {
    this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i].patchValue({
      AssetAccessoryName: event.AssetAccessoryName,
      AssetAccessoryCode: event.AssetAccessoryCode
    });
  }

  deleteAccessory(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var appAccessoryObjs = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
      var no = appAccessoryObjs.controls[i]["controls"]["No"].value;
      appAccessoryObjs.removeAt(i);
      this.AssetDataForm.removeControl("lookupSupplierObj" + no);
      this.AssetDataForm.removeControl("lookupAccObj" + no);
    }
  }

  SetDelivAddrType(event : UcDropdownListCallbackObj) {
    this.copyFromAppCustAddrForDelivery = event.selectedObj;
  }

  copyToDelivAddr() {
    if (this.copyFromAppCustAddrForDelivery != undefined) {
      this.AssetDataForm.patchValue({
        DelivAddr: this.copyFromAppCustAddrForDelivery.Addr,
        DelivAreaCode1: this.copyFromAppCustAddrForDelivery.AreaCode1,
        DelivAreaCode2: this.copyFromAppCustAddrForDelivery.AreaCode2,
        DelivAreaCode3: this.copyFromAppCustAddrForDelivery.AreaCode3,
        DelivAreaCode4: this.copyFromAppCustAddrForDelivery.AreaCode4,
        DelivCity: this.copyFromAppCustAddrForDelivery.City,
        DelivZipcode: this.copyFromAppCustAddrForDelivery.Zipcode,
      });
      this.delivAddrObj = new AddrObj();
      this.delivAddrObj.Addr = this.copyFromAppCustAddrForDelivery.Addr;
      this.delivAddrObj.AreaCode1 = this.copyFromAppCustAddrForDelivery.AreaCode1;
      this.delivAddrObj.AreaCode2 = this.copyFromAppCustAddrForDelivery.AreaCode2;
      this.delivAddrObj.AreaCode3 = this.copyFromAppCustAddrForDelivery.AreaCode3;
      this.delivAddrObj.AreaCode4 = this.copyFromAppCustAddrForDelivery.AreaCode4;
      this.delivAddrObj.City = this.copyFromAppCustAddrForDelivery.City;

      this.inputFieldDelivAddrObj.inputLookupObj.nameSelect = this.AssetDataForm.controls.DelivZipcode.value;
      this.inputFieldDelivAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AssetDataForm.controls.DelivZipcode.value };

      this.inputAddressObjForDeliv.default = this.delivAddrObj;
      this.inputAddressObjForDeliv.inputField = this.inputFieldDelivAddrObj;
    }
  }

  SetLocationAddrType(event: UcDropdownListCallbackObj) {
    this.copyFromAppCustAddrForLocation = event.selectedObj;
  }

  copyToLocationAddr() {
    if (this.copyFromAppCustAddrForLocation != undefined) {
      this.AssetDataForm.patchValue({
        LocationAddr: this.copyFromAppCustAddrForLocation.Addr,
        LocationAreaCode1: this.copyFromAppCustAddrForLocation.AreaCode1,
        LocationAreaCode2: this.copyFromAppCustAddrForLocation.AreaCode2,
        LocationAreaCode3: this.copyFromAppCustAddrForLocation.AreaCode3,
        LocationAreaCode4: this.copyFromAppCustAddrForLocation.AreaCode4,
        LocationCity: this.copyFromAppCustAddrForLocation.City,
        LocationZipcode: this.copyFromAppCustAddrForLocation.Zipcode,
      });
      this.locationAddrObj = new AddrObj();
      this.locationAddrObj.Addr = this.copyFromAppCustAddrForLocation.Addr;
      this.locationAddrObj.AreaCode1 = this.copyFromAppCustAddrForLocation.AreaCode1;
      this.locationAddrObj.AreaCode2 = this.copyFromAppCustAddrForLocation.AreaCode2;
      this.locationAddrObj.AreaCode3 = this.copyFromAppCustAddrForLocation.AreaCode3;
      this.locationAddrObj.AreaCode4 = this.copyFromAppCustAddrForLocation.AreaCode4;
      this.locationAddrObj.City = this.copyFromAppCustAddrForLocation.City;

      this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.AssetDataForm.controls.LocationZipcode.value;
      this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AssetDataForm.controls.LocationZipcode.value };
      
      this.inputAddressObjForLoc.default = this.locationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
    }
  }

  Back() {
    this.isListAsset = true;
    this.getListAllAssetData();
  }

  async SaveForm() {
    this.allAssetDataObj = new AllAssetDataObj();
    this.setAllAssetObj();
    this.allAssetDataObj.BizTemplateCode = CommonConstant.OPL;
    if (this.allAssetDataObj.AppAssetAccessoryObjs && this.allAssetDataObj.AppAssetAccessoryObjs.length > 0) {
      if (this.originalAppAssetAccessory && this.originalAppAssetAccessory.length > 0) {
        for (const newAcc of this.allAssetDataObj.AppAssetAccessoryObjs) {
          if (!this.allAssetDataObj.IsAppAssetAccessoryChanged) {
            for (const oriAcc of this.originalAppAssetAccessory) {
              if (newAcc.AssetAccessoryCode == oriAcc.AssetAccessoryCode) {
                if (newAcc.AssetAccessoryName != oriAcc.AssetAccessoryName) {
                  this.allAssetDataObj.IsAppAssetAccessoryChanged = true;
                  break;
                }
                if (newAcc.SupplCode != oriAcc.SupplCode) {
                  this.allAssetDataObj.IsAppAssetAccessoryChanged = true;
                  break;
                }
                if (newAcc.SupplName != oriAcc.SupplName) {
                  this.allAssetDataObj.IsAppAssetAccessoryChanged = true;
                  break;
                }
                if (newAcc.AccessoryPriceAmt != oriAcc.AccessoryPriceAmt) {
                  this.allAssetDataObj.IsAppAssetAccessoryChanged = true;
                  break;
                }
                if (newAcc.DownPaymentAmt != oriAcc.DownPaymentAmt) {
                  this.allAssetDataObj.IsAppAssetAccessoryChanged = true;
                  break;
                }
                if (newAcc.AccessoryNotes != oriAcc.AccessoryNotes) {
                  this.allAssetDataObj.IsAppAssetAccessoryChanged = true;
                  break;
                }
              }
            }
          }
          else {
            break;
          }
        }
      }
      else {
        this.allAssetDataObj.IsAppAssetAccessoryChanged = true;
      }
    }
    
    this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        if(this.isListAsset === true) {
          this.outputTab.emit();
        }
        else if(this.isListAsset === false) {
          if(this.mode === "Add") {
            this.listAsset.push(this.allAssetDataObj);
          }
          else if(this.mode === "Edit") {
            this.listAsset[this.index] = this.allAssetDataObj;
          }
          this.isListAsset = true;
          this.getListAllAssetData();
        }
      }
    );
  }

  async GetAppData() {
    this.appObj.Id = this.AppId;
    await this.http.post(URLConstant.GetAppById, this.appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.OfficeCode = this.AppObj.OriOfficeCode;
      }
    );
  }

  async GetRefProdCompt() {
    var appObj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefProdCompntAssetType,
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion,
    };
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
      (response) => {
        this.RefProdCmptAssetType = response;
      }
    );

    appObj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefProdCompntSupplSchm,
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion,
    };
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
      (response) => {
        this.RefProdCmptSupplSchm = response;
      }
    );

    appObj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefProdCompntAssetSchm,
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion,
    };
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
      (response) => {
        this.RefProdCmptAssetSchm = response;
      }
    );
  }
  
  async GetAppCust() {
    var appObj = {
      Id: this.AppId,
    };
    await this.http.post(URLConstant.GetAppCustByAppId, appObj).toPromise().then(
      (response) => {
        this.AppCustObj = response;
        this.CustType = this.AppCustObj.MrCustTypeCode;
      }
    );
  }

  async GetAppCustPhone() {
    if (typeof (this.AppCustObj) != 'undefined') {
      var appObj = {
        Id: this.AppId,
      };
      await this.http.post(URLConstant.GetCustDataByAppId, appObj).toPromise().then(
        (response) => {
          if (typeof (response['AppCustPersonalObj']) != 'undefined') this.AppCustObj.MobilePhnNo1 = response['AppCustPersonalObj']['MobilePhnNo1'];
        }
      );
    }
  }

  async bindAllRefMasterObj() {
    await this.bindAssetUsageObj();
    await this.bindAsseConditionObj();
  }

  async bindAssetUsageObj() {
    this.ddlAssetUsageObj.apiUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.ddlAssetUsageObj.requestObj = {"RefMasterTypeCode":CommonConstant.RefMasterTypeCodeAssetUsage};
    this.ddlAssetUsageObj.isSelectOutput = true;
  }

  async bindAsseConditionObj() {
    this.ddlAssetConditionObj.apiUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.ddlAssetConditionObj.requestObj = {"RefMasterTypeCode":CommonConstant.RefMasterTypeCodeAssetCondition};
    this.ddlAssetConditionObj.isSelectOutput = true;
  }

  initLookup() {
    this.InputLookupSupplierObj = this.initLookupSupp();

    this.InputLookupCityIssuerObj = new InputLookupObj();
    this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCityIssuerObj.pagingJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.genericJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.isRequired = true;
    var disCrit = new Array();
    var critDisObj = new CriteriaObj();
    critDisObj.DataType = 'text';
    critDisObj.restriction = AdInsConstant.RestrictionEq;
    critDisObj.propName = 'TYPE';
    critDisObj.value = 'DIS';
    disCrit.push(critDisObj);
    this.InputLookupCityIssuerObj.addCritInput = disCrit;

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    var assetCrit = new Array();
    var critAssetObj = new CriteriaObj();
    critAssetObj.DataType = 'text';
    critAssetObj.restriction = AdInsConstant.RestrictionEq;
    critAssetObj.propName = 'B.ASSET_TYPE_CODE';
    critAssetObj.value = this.RefProdCmptAssetType.CompntValue;
    assetCrit.push(critAssetObj);

    var critAssetSchmObj = new CriteriaObj();
    critAssetSchmObj.DataType = 'text';
    critAssetSchmObj.restriction = AdInsConstant.RestrictionEq;
    critAssetSchmObj.propName = 'E.ASSET_SCHM_CODE';
    critAssetSchmObj.value = this.RefProdCmptAssetSchm.CompntValue;
    assetCrit.push(critAssetSchmObj);
    this.InputLookupAssetObj.addCritInput = assetCrit;

    this.InputLookupAccObj = this.initLookupAcc();
    this.isOnlookup = true;
  }

  initLookupSupp() {
    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";
    var suppCrit = new Array();
    var critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'ro.OFFICE_CODE';
    critSuppObj.value = this.OfficeCode;
    suppCrit.push(critSuppObj);

    var critSuppSupplSchmObj = new CriteriaObj();
    critSuppSupplSchmObj.DataType = 'text';
    critSuppSupplSchmObj.restriction = AdInsConstant.RestrictionEq;
    critSuppSupplSchmObj.propName = 'vs.VENDOR_SCHM_CODE';
    critSuppSupplSchmObj.value = this.RefProdCmptSupplSchm.CompntValue;
    suppCrit.push(critSuppSupplSchmObj);
    this.InputLookupSupplierObj.addCritInput = suppCrit;

    return this.InputLookupSupplierObj;
  }

  async GetAppCustCoy() {
    var appObj = {
      Id: this.AppCustObj.AppCustId,
    };
    await this.http.post(URLConstant.GetAppCustCompanyByAppCustId, appObj).toPromise().then(
      (response) => {
        this.AppCustCoyObj = response;
      }
    );
  }

  async GetListAddr() {
    this.appObj.Id = this.AppId;
    this.dllAppCustAddrObj.customKey = "MrCustAddrTypeCode";
    this.dllAppCustAddrObj.customValue = "MrCustAddrTypeCode";
    this.dllAppCustAddrObj.apiUrl = URLConstant.GetListAppCustAddrByAppId;
    this.dllAppCustAddrObj.requestObj = {"Id":this.AppId};
    this.dllAppCustAddrObj.isSelectOutput = true;
  }

  async getListAllAssetData() {
    this.appData = new AppDataObj();
    this.appData.AppId = this.AppId;
    var appData = { Id: this.AppId };
    await this.http.post(URLConstant.GetListAllAssetDataByAppId, appData).toPromise().then(
      (response) => {
        this.listAsset = [];
        this.appAssetObj = response[CommonConstant.ReturnObj];

        if (this.appAssetObj != null) {
          for(let i = 0; i < this.appAssetObj.length; i++) {
            this.allAssetDataObj = new AllAssetDataObj();
            
            this.allAssetDataObj.VendorEmpId = this.appAssetObj[i].ResponseSalesPersonSupp.AppAssetSupplEmpId;

            this.allAssetDataObj.AppAssetObj.AppAssetId = this.appAssetObj[i].ResponseAppAssetObj.AppAssetId;
            this.allAssetDataObj.AppAssetObj.AppId = this.appAssetObj[i].ResponseAppAssetObj.AppId;
            this.allAssetDataObj.AppAssetObj.FullAssetName = this.appAssetObj[i].ResponseAppAssetObj.FullAssetName;
            this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.appAssetObj[i].ResponseAppAssetObj.MrAssetConditionCode;
            this.allAssetDataObj.AppAssetObj.MrAssetUsageCode = this.appAssetObj[i].ResponseAppAssetObj.MrAssetUsageCode;

            this.allAssetDataObj.AppAssetObj.SupplName = this.appAssetObj[i].ResponseAppAssetObj.SupplName;
            this.allAssetDataObj.AppAssetObj.AssetNotes = this.appAssetObj[i].ResponseAppAssetObj.AssetNotes;
            this.allAssetDataObj.AppAssetObj.Color = this.appAssetObj[i].ResponseAppAssetObj.Color;
            this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.appAssetObj[i].ResponseAppAssetObj.TaxCityIssuer;
            this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.appAssetObj[i].ResponseAppAssetObj.TaxIssueDt;
            this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.appAssetObj[i].ResponseAppAssetObj.ManufacturingYear;

            if(this.appAssetObj[i].ResponseAssetDataOplObj != null) {
              this.allAssetDataObj.AppAssetObj.AssetPriceAmt = this.appAssetObj[i].ResponseAssetDataOplObj.AssetPriceBefDiscAmt;
              this.allAssetDataObj.AppAssetObj.Discount = this.appAssetObj[i].ResponseAssetDataOplObj.DiscountAmt;
              this.allAssetDataObj.AppAssetObj.ExpectedDelivDt = this.appAssetObj[i].ResponseAssetDataOplObj.ExpectedDeliveryDt;
              this.allAssetDataObj.AppAssetObj.IsNeedReplacementCar = this.appAssetObj[i].ResponseAssetDataOplObj.IsNeedReplacementCar;

              this.allAssetDataObj.AppCollateralRegistrationObj.DelivAddr = this.appAssetObj[i].ResponseAssetDataOplObj.DlvryAddr;
              this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode1 = this.appAssetObj[i].ResponseAssetDataOplObj.DlvryAreaCode1;
              this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode2 = this.appAssetObj[i].ResponseAssetDataOplObj.DlvryAreaCode2;
              this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode3 = this.appAssetObj[i].ResponseAssetDataOplObj.DlvryAreaCode3;
              this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode4 = this.appAssetObj[i].ResponseAssetDataOplObj.DlvryAreaCode4;
              this.allAssetDataObj.AppCollateralRegistrationObj.DelivCity = this.appAssetObj[i].ResponseAssetDataOplObj.DlvryCity;
              this.allAssetDataObj.AppCollateralRegistrationObj.DelivZipcode = this.appAssetObj[i].ResponseAssetDataOplObj.DlvryZipcode;
              
              this.allAssetDataObj.AppCollateralRegistrationObj.LocationAddr = this.appAssetObj[i].ResponseAssetDataOplObj.LocationAddr;
              this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.appAssetObj[i].ResponseAssetDataOplObj.LocationAreaCode1;
              this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.appAssetObj[i].ResponseAssetDataOplObj.LocationAreaCode2;
              this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.appAssetObj[i].ResponseAssetDataOplObj.LocationAreaCode3;
              this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.appAssetObj[i].ResponseAssetDataOplObj.LocationAreaCode4;
              this.allAssetDataObj.AppCollateralRegistrationObj.LocationCity = this.appAssetObj[i].ResponseAssetDataOplObj.LocationCity;
              this.allAssetDataObj.AppCollateralRegistrationObj.LocationZipcode = this.appAssetObj[i].ResponseAssetDataOplObj.LocationZipcode;
            }
        
            this.allAssetDataObj.AppAssetObj.AssetSeqNo = this.appAssetObj[i].ResponseAppAssetObj.AssetSeqNo;
            this.allAssetDataObj.AppAssetObj.FullAssetCode = this.appAssetObj[i].ResponseAppAssetObj.FullAssetCode;
            this.allAssetDataObj.AppAssetObj.AssetStat = this.appAssetObj[i].ResponseAppAssetObj.AssetStat;
            this.allAssetDataObj.AppCollateralObj.CollateralStat = this.appAssetObj[i].ResponseAppAssetObj.AssetStat;
            this.allAssetDataObj.AppCollateralObj.AppAssetId = this.appAssetObj[i].ResponseAppAssetObj.AppAssetId;

            this.allAssetDataObj.AppAssetObj.AssetTypeCode = this.appAssetObj[i].ResponseAppAssetObj.AssetTypeCode;
            this.allAssetDataObj.AppAssetObj.AssetCategoryCode = this.appAssetObj[i].ResponseAppAssetObj.AssetCategoryCode;
            this.allAssetDataObj.AppAssetObj.SupplCode = this.appAssetObj[i].ResponseAppAssetObj.SupplCode;

            if (this.appAssetObj[i].ResponseBranchManagerSupp != null) {
              this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = this.appAssetObj[i].ResponseBranchManagerSupp.SupplEmpName;
              this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = this.appAssetObj[i].ResponseBranchManagerSupp.SupplEmpNo;
              this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = this.appAssetObj[i].ResponseBranchManagerSupp.MrSupplEmpPositionCode;
            }
            else {
              this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = "-";
              this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = "-";
              this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = "-";
            }

            if (this.appAssetObj[i].ResponseAdminHeadSupp != null) {
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = this.appAssetObj[i].ResponseAdminHeadSupp.SupplEmpName;
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = this.appAssetObj[i].ResponseAdminHeadSupp.SupplEmpNo;
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = this.appAssetObj[i].ResponseAdminHeadSupp.MrSupplEmpPositionCode;
            }
            else {
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = "-";
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = "-";
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = "-";
            }

            if (this.appAssetObj[i].ResponseSalesPersonSupp != null) {
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName = this.appAssetObj[i].ResponseSalesPersonSupp.SupplEmpName;
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo = this.appAssetObj[i].ResponseSalesPersonSupp.SupplEmpNo;
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode = this.appAssetObj[i].ResponseSalesPersonSupp.MrSupplEmpPositionCode;
            }
            else {
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName = "-";
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo = "-";
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode = "-";
            }

            this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.appAssetObj[i].ResponseAppAssetObj.TaxCityIssuer;
            this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.appAssetObj[i].ResponseAppAssetObj.TaxIssueDt;
            this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.appAssetObj[i].ResponseAppAssetObj.ManufacturingYear;
        
            this.allAssetDataObj.AppCollateralObj.AppId = this.appAssetObj[i].ResponseAppAssetObj.AppId;
            this.allAssetDataObj.AppCollateralObj.CollateralSeqNo = this.appAssetObj[i].ResponseAppAssetObj.AssetSeqNo;
            this.allAssetDataObj.AppCollateralObj.FullAssetCode = this.appAssetObj[i].ResponseAppAssetObj.FullAssetCode;
            this.allAssetDataObj.AppCollateralObj.FullAssetName = this.appAssetObj[i].ResponseAppAssetObj.FullAssetName;
            this.allAssetDataObj.AppCollateralObj.MrCollateralConditionCode = this.appAssetObj[i].ResponseAppAssetObj.MrAssetConditionCode;
            this.allAssetDataObj.AppCollateralObj.MrCollateralUsageCode = this.appAssetObj[i].ResponseAppAssetObj.MrAssetUsageCode;

            this.allAssetDataObj.AppCollateralObj.CollateralValueAmt = this.appAssetObj[i].ResponseAppAssetObj.AssetPriceAmt;
            this.allAssetDataObj.AppCollateralObj.AssetTypeCode = this.appAssetObj[i].ResponseAppAssetObj.AssetTypeCode;
            this.allAssetDataObj.AppCollateralObj.AssetCategoryCode = this.appAssetObj[i].ResponseAppAssetObj.AssetCategoryCode;
            this.allAssetDataObj.AppCollateralObj.ManufacturingYear = this.appAssetObj[i].ResponseAppAssetObj.ManufacturingYear;

            this.allAssetDataObj.AppAssetAccessoryObjs = new Array<AppAssetAccessoryObj>();
            this.allAssetDataObj.AppCollateralAccessoryObjs = new Array<AppCollateralAccessoryObj>();
            this.allAssetDataObj.AppCollateralAttrObj = new Array<AppCollateralAttrObj>();
            this.allAssetDataObj.AppAssetAttrObj = new Array<AppAssetAttrObj>();
            if(this.appAssetObj[i].ResponseAppAssetAccessoryObjs != null){
              for (let j = 0; j < this.appAssetObj[i].ResponseAppAssetAccessoryObjs.length; j++) {
                var appAssetAccObj = new AppAssetAccessoryObj();
                var appCollateralAccObj = new AppCollateralAccessoryObj();
                appAssetAccObj.AssetAccessoryCode = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].AssetAccessoryCode;
                appAssetAccObj.AssetAccessoryName = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].AssetAccessoryName;
                appAssetAccObj.SupplCode = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].SupplCode;
                appAssetAccObj.SupplName = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].SupplName;
                appAssetAccObj.AccessoryPriceAmt = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].AccessoryPriceAmt;
                appAssetAccObj.DownPaymentAmt = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].DownPaymentAmt;
                appAssetAccObj.AccessoryNotes = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].AccessoryNotes;
          
                appCollateralAccObj.CollateralAccessoryCode = appAssetAccObj.AssetAccessoryCode;
                appCollateralAccObj.CollateralAccessoryName = appAssetAccObj.AssetAccessoryName;
                appCollateralAccObj.AccessoryPriceAmt = appAssetAccObj.AccessoryPriceAmt;
                appCollateralAccObj.DownPaymentAmt = appAssetAccObj.DownPaymentAmt;
                appCollateralAccObj.AccessoryNotes = appAssetAccObj.AccessoryNotes;
          
                this.allAssetDataObj.AppAssetAccessoryObjs.push(appAssetAccObj);
                this.allAssetDataObj.AppCollateralAccessoryObjs.push(appCollateralAccObj);
              }
            }

            if (this.appAssetObj[i].ResponseAppAssetAttrObjs != null) {
              for (let k = 0; k < this.appAssetObj[i].ResponseAppAssetAttrObjs.length; k++) {
                var appAssetAttrObj = new AppAssetAttrObj();
                var appCollAttrcObj = new AppCollateralAttrObj();
                appAssetAttrObj.AssetAttrName = this.appAssetObj[i].ResponseAppAssetAttrObjs[k].AssetAttrName;
                appAssetAttrObj.AssetAttrCode = this.appAssetObj[i].ResponseAppAssetAttrObjs[k].AssetAttrCode;
                appAssetAttrObj.AttrValue = this.appAssetObj[i].ResponseAppAssetAttrObjs[k].AttrValue;
        
                appCollAttrcObj.CollateralAttrName = appAssetAttrObj.AssetAttrName;
                appCollAttrcObj.CollateralAttrCode = appAssetAttrObj.AssetAttrCode;
                appCollAttrcObj.AttrValue = appAssetAttrObj.AttrValue;
        
                this.allAssetDataObj.AppAssetAttrObj.push(appAssetAttrObj);
                this.allAssetDataObj.AppCollateralAttrObj.push(appCollAttrcObj);
              }
            }

            this.listAsset.push(this.allAssetDataObj);
          }
        }
      }
    );
  }

  GenerataAppAssetAttr(isRefresh: boolean) {
    var GenObj = {
      AppAssetId: this.appAssetId,
      AssetTypeCode: this.RefProdCmptAssetType.CompntValue,
      AttrTypeCode: CommonConstant.AttrTypeCodeTrx,
      IsRefresh: isRefresh
    };
    this.http.post(URLConstant.GenerateAppAssetAttr, GenObj).subscribe(
      (response) => {
        this.AppAssetAttrObj = response['ResponseAppAssetAttrObjs'];
        if (response['IsDiffWithRefAttr']) {
          this.isDiffWithRefAttr = true;
          this.toastr.warningMessage(ExceptionConstant.REF_ATTR_CHANGE);
        }

        this.GenerateAppAssetAttrForm();
      }
    );
  }

  GenerateAppAssetAttrForm() {
    if (this.AppAssetAttrObj != null) {
      this.appAssetAttrObjs = new Array<AppAssetAttrCustomObj>();
      for (let i = 0; i < this.AppAssetAttrObj.length; i++) {
        this.ListAttrAnswer.push([]);
        var appAssetAttrObj = new AppAssetAttrCustomObj();
        appAssetAttrObj.AssetAttrCode = this.AppAssetAttrObj[i].AttrCode;
        appAssetAttrObj.AssetAttrName = this.AppAssetAttrObj[i].AttrName;
        appAssetAttrObj.AttrValue = this.AppAssetAttrObj[i].AttrValue;
        appAssetAttrObj.AttrInputType = this.AppAssetAttrObj[i].AttrInputType;
        appAssetAttrObj.AttrLength = this.AppAssetAttrObj[i].AttrLength;
        if (this.AppAssetAttrObj[i].AttrQuestionValue != null) {
          this.ListAttrAnswer[i].push(this.AppAssetAttrObj[i].AttrQuestionValue);
          if (appAssetAttrObj.AttrValue == null) {
            appAssetAttrObj.AttrValue = this.AppAssetAttrObj[i].AttrQuestionValue[0]
          }
        }
        else {
          this.ListAttrAnswer[i].push("");
        }
        this.appAssetAttrObjs.push(appAssetAttrObj);

      }
      var listAppAssetAttrs = this.AssetDataForm.controls["AppAssetAttrObjs"] as FormArray;
      while (listAppAssetAttrs.length !== 0) {
        listAppAssetAttrs.removeAt(0);
      }
      for (let j = 0; j < this.appAssetAttrObjs.length; j++) {
        listAppAssetAttrs.push(this.addGroupAppAssetAttr(this.appAssetAttrObjs[j], j));
      }
      this.isAssetAttrReady = true;
    }
  }

  addGroupAppAssetAttr(appAssetAttrObj: AppAssetAttrCustomObj, i: number) {
    let ListValidator: Array<ValidatorFn> = this.setValidators(appAssetAttrObj);

    return this.setFbGroupAssetAttribute(appAssetAttrObj, i, ListValidator);
  }

  private setValidators(appAssetAttrObjs: AppAssetAttrCustomObj) {
    let ListValidator: Array<ValidatorFn> = new Array<ValidatorFn>();

    if (appAssetAttrObjs.AttrLength != null && appAssetAttrObjs.AttrLength != 0) {
      ListValidator.push(Validators.maxLength(appAssetAttrObjs.AttrLength));
    }

    return ListValidator;
  }

  private setFbGroupAssetAttribute(appAssetAttrObj: AppAssetAttrCustomObj, i: number, ListValidator: Array<ValidatorFn>) {
    let tempFB = this.fb.group({
      No: [i],
      AssetAttrCode: [appAssetAttrObj.AssetAttrCode],
      AssetAttrName: [appAssetAttrObj.AssetAttrName],
      AttrInputType: [appAssetAttrObj.AttrInputType],
      AttrValue: [appAssetAttrObj.AttrValue]
    });
    if (ListValidator.length > 0) {
      tempFB.get("AttrValue").setValidators(ListValidator);
    }

    return tempFB;
  }

  addGroup(appAssetAccessoriesObj, i) {
    if (appAssetAccessoriesObj == undefined) {
      return this.fb.group({
        No: [i],
        AssetAccessoryCode: ['', [Validators.required, Validators.maxLength(50)]],
        AssetAccessoryName: ['', [Validators.maxLength(1000)]],
        SupplCodeAccessory: ['', [Validators.required, Validators.maxLength(50)]],
        SupplNameAccessory: ['', [Validators.required, Validators.maxLength(1000)]],
        AccessoryPriceAmt: ['', Validators.required],
        AccessoryDownPaymentAmt: [0, Validators.required],
        AccessoryNotes: ['']
      })
    }
    else {
      return this.fb.group({
        No: [i],
        AssetAccessoryCode: [appAssetAccessoriesObj.AssetAccessoryCode, [Validators.required, Validators.maxLength(50)]],
        AssetAccessoryName: [appAssetAccessoriesObj.AssetAccessoryName, [Validators.maxLength(1000)]],
        SupplCodeAccessory: [appAssetAccessoriesObj.SupplCode, [Validators.required, Validators.maxLength(50)]],
        SupplNameAccessory: [appAssetAccessoriesObj.SupplName, [Validators.required, Validators.maxLength(1000)]],
        AccessoryPriceAmt: [appAssetAccessoriesObj.AccessoryPriceAmt, Validators.required],
        AccessoryDownPaymentAmt: [appAssetAccessoriesObj.DownPaymentAmt, Validators.required],
        AccessoryNotes: [appAssetAccessoriesObj.AccessoryNotes, Validators.maxLength(4000)]
      })
    }
  }

  initLookupAcc() {
    let arrAddCrit = new Array();
    if (this.AssetDataForm.get("AssetTypeCode").value != "") {
      var addCrit = new CriteriaObj();
      addCrit.DataType = "string";
      addCrit.propName = "atp.ASSET_TYPE_CODE";
      addCrit.restriction = AdInsConstant.RestrictionIn;
      addCrit.listValue = [this.AssetDataForm.get("AssetTypeCode").value];
      arrAddCrit.push(addCrit);
    }

    this.InputLookupAccObj = new InputLookupObj();
    this.InputLookupAccObj.urlJson = "./assets/uclookup/NAP/lookupAcc.json";
    this.InputLookupAccObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupAccObj.pagingJson = "./assets/uclookup/NAP/lookupAcc.json";
    this.InputLookupAccObj.genericJson = "./assets/uclookup/NAP/lookupAcc.json";
    this.InputLookupAccObj.addCritInput = arrAddCrit;

    return this.InputLookupAccObj;
  }

  initLookupSuppAcc() {
    this.InputLookupAccSupObj = new InputLookupObj();
    this.InputLookupAccSupObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupAccSupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupAccSupObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupAccSupObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";
    var suppCrit = new Array();
    var critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'ro.OFFICE_CODE';
    critSuppObj.value = this.OfficeCode;
    suppCrit.push(critSuppObj);

    var critSupp2Obj = new CriteriaObj();
    critSupp2Obj.DataType = 'text';
    critSupp2Obj.restriction = AdInsConstant.RestrictionEq;
    critSupp2Obj.propName = 'v.MR_VENDOR_CATEGORY_CODE';
    critSupp2Obj.value = 'SUPPLIER';
    suppCrit.push(critSupp2Obj);

    var critSuppSupplSchmObj = new CriteriaObj();
    critSuppSupplSchmObj.DataType = 'text';
    critSuppSupplSchmObj.restriction = AdInsConstant.RestrictionEq;
    critSuppSupplSchmObj.propName = 'vs.VENDOR_SCHM_CODE';
    critSuppSupplSchmObj.value = this.RefProdCmptSupplSchm.CompntValue;
    suppCrit.push(critSuppSupplSchmObj);
    this.InputLookupAccSupObj.addCritInput = suppCrit;

    return this.InputLookupAccSupObj;
  }

  setAppAccessorySupplier(i, SupplCode) {
    this.vendorAccSuppObj.VendorCode = SupplCode;
    this.http.post(URLConstant.GetVendorByVendorCode, {Code : SupplCode}).subscribe(
      (response) => {
        this.dictSuppLookup[i].nameSelect = response["VendorName"];
        this.dictSuppLookup[i].jsonSelect = response;
        this.InputLookupSupplObjs[i].jsonSelect = response;
      }
    );
  }

  setAppAccessory(i, AssetAccessoryCode) {
    this.accObj.AssetAccessoryCode = AssetAccessoryCode;
    let obj = {Code: this.accObj.AssetAccessoryCode}
    this.http.post(URLConstant.GetAssetAccessoryByCode, obj).subscribe(
      (response) => {
        this.dictAccLookup[i].nameSelect = response["AssetAccessoryName"];
        this.dictAccLookup[i].jsonSelect = response;
        this.InputLookupAcceObjs[i].jsonSelect = response;
      }
    );
  }

  async GetVendor() {
    await this.http.post(URLConstant.GetVendorByVendorCode, {Code : this.vendorObj.VendorCode}).toPromise().then(
      (response) => {
        this.VendorObj = response;
        this.AssetDataForm.patchValue({
          SupplName: this.VendorObj.VendorName,
          SupplCode: this.VendorObj.VendorCode,
        });
        this.vendorObj.VendorId = this.VendorObj.VendorId;
        this.InputLookupSupplierObj.jsonSelect = this.VendorObj;
        this.InputLookupSupplierObj.nameSelect = this.VendorObj.VendorName;
      }
    );
  }

  GetVendorEmpList() {
    this.salesSupervisor = "";
    this.adminHead = "";
    this.branchManager = "";
    this.AssetDataForm.patchValue({
      SalesPersonId: "",
      SalesPersonName: "",
      SalesPersonNo: "",
      SalesPersonPositionCode: "",
      AdminHeadName: "",
      AdminHeadNo: "",
      AdminHeadPositionCode: "",
      BranchManagerName: "",
      BranchManagerNo: "",
      BranchManagerPositionCode: ""
    });
    this.isDdlSalesPersonReady = false;
    // this.isDdlAdminHeadReady = false;
    // this.isDdlBranchManagerReady = false;
    let ReqGetListActiveVendorSales : ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj = new ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj;
    ReqGetListActiveVendorSales.VendorId = this.vendorObj.VendorId;
    ReqGetListActiveVendorSales.MrVendorEmpPositionCodes = this.vendorObj.MrVendorEmpPositionCodes;
    this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, ReqGetListActiveVendorSales).subscribe(
      (response) => {
        this.SalesPersonObj = response[CommonConstant.ReturnObj];
        // this.EmpObj = response[CommonConstant.ReturnObj];

        // for(let i = 0; i < this.EmpObj.length; i++) {
        //   if(this.EmpObj[i]["SupervisorId"] !== null) {
        //     this.http.post(URLConstant.GetVendorEmpByVendorEmpId, {Id : this.EmpObj[i]["SupervisorId"]}).subscribe(
        //       (response) => {
        //         this.salesSupervisor = response["VendorEmpName"];
        //       }
        //     )
        //   }

        //   if(this.EmpObj[i]["MrVendorEmpPositionCode"] === CommonConstant.ADMIN_HEAD_JOB_CODE) {
        //     this.adminHead = this.EmpObj[i]["VendorEmpName"];
        //   }
        //   else if(this.EmpObj[i]["MrVendorEmpPositionCode"] === CommonConstant.BRANCH_MANAGER_JOB_CODE) {
        //     this.branchManager = this.EmpObj[i]["VendorEmpName"];
        //   }
        // }

        // this.AdminHeadObj = this.EmpObj.filter(
        //   emp => emp.MrVendorEmpPositionCode === CommonConstant.ADMIN_HEAD_JOB_CODE
        // );
        // this.SalesPersonObj = this.EmpObj.filter(
        //   emp => emp.MrVendorEmpPositionCode === CommonConstant.SALES_JOB_CODE
        // );
        // this.BranchManagerObj = this.EmpObj.filter(
        //   emp => emp.MrVendorEmpPositionCode === CommonConstant.BRANCH_MANAGER_JOB_CODE
        // );
        // if(this.AdminHeadObj.length > 0) {
        //   this.isDdlAdminHeadReady = true;
        // }
        if(this.SalesPersonObj.length > 0) {
          this.isDdlSalesPersonReady = true;
        }
        // if(this.BranchManagerObj.length > 0) {
        //   this.isDdlBranchManagerReady = true;
        // }
      }
    );
  }

  GetAssetMaster(assetMasterObj) {
    this.http.post(URLConstant.GetAssetMasterTypeByFullAssetCode, {Code: assetMasterObj.FullAssetCode}).subscribe(
      (response) => {
        this.AssetMasterObj = response;
        this.AssetDataForm.patchValue({
          FullAssetCode: this.AssetMasterObj.FullAssetCode,
          FullAssetName: this.AssetMasterObj.FullAssetName,
          AssetTypeCode: this.AssetMasterObj.AssetTypeCode,
          AssetCategoryCode: this.AssetMasterObj.AssetCategoryCode
        });
        this.InputLookupAssetObj.jsonSelect = this.AssetMasterObj;
        this.InputLookupAssetObj.nameSelect = this.AssetMasterObj.FullAssetName;
      }
    );
  }

  setAllAssetObj() {
    this.allAssetDataObj.AppAssetObj.AppAssetId = this.appAssetId;
    this.allAssetDataObj.AppAssetObj.AppId = this.AppId;
    this.allAssetDataObj.AppAssetObj.FullAssetName = this.AssetDataForm.controls.FullAssetName.value;
    this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.AssetDataForm.controls.MrAssetConditionCode.value;
    this.allAssetDataObj.AppAssetObj.MrAssetUsageCode = this.AssetDataForm.controls.MrAssetUsageCode.value;
    this.allAssetDataObj.VendorEmpId = this.AssetDataForm.controls.SalesPersonId.value;
    this.allAssetDataObj.AppAssetSupplEmpAdminObj.VendorEmpId = this.AssetDataForm.controls.AdminHeadId.value;
    this.allAssetDataObj.AppAssetSupplEmpManagerObj.VendorEmpId = this.AssetDataForm.controls.BranchManagerId.value;
    
    this.allAssetDataObj.AppAssetObj.SupplName = this.AssetDataForm.controls.SupplName.value;
    this.allAssetDataObj.AppAssetObj.AssetPriceAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    this.allAssetDataObj.AppAssetObj.AssetNotes = this.AssetDataForm.controls.AssetNotes.value;
    this.allAssetDataObj.AppAssetObj.Color = this.AssetDataForm.controls.Color.value;
    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value;
    this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.AssetDataForm.controls.TaxIssueDt.value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;
    this.allAssetDataObj.AppAssetObj.Discount = this.AssetDataForm.controls.Discount.value;
    
    if(this.AssetDataForm.controls.ExpectedDelivDt.value !== null) {
      this.allAssetDataObj.AppAssetObj.ExpectedDelivDt = this.AssetDataForm.controls.ExpectedDelivDt.value;
    }
    if(this.AssetDataForm.controls.IsNeedReplacementCar.value !== null) {
      this.allAssetDataObj.AppAssetObj.IsNeedReplacementCar = this.AssetDataForm.controls.IsNeedReplacementCar.value;
    }

    this.allAssetDataObj.AppAssetObj.AssetSeqNo = this.AssetDataForm.controls.AssetSeqNo.value;
    this.allAssetDataObj.AppAssetObj.FullAssetCode = this.AssetDataForm.controls.FullAssetCode.value;
    if (this.appAssetId == 0) {
      this.allAssetDataObj.AppAssetObj.AssetStat = "NEW";
      this.allAssetDataObj.AppCollateralObj.CollateralStat = "NEW";
      this.allAssetDataObj.AppCollateralObj.AppAssetId = this.appAssetId;
      this.allAssetDataObj.AppCollateralObj.IsMainCollateral = true;
    }
    else {
      this.allAssetDataObj.AppAssetObj.AssetStat = this.AssetDataForm.controls.AssetStat.value;
      this.allAssetDataObj.AppCollateralObj.CollateralStat = this.AssetDataForm.controls.AssetStat.value;
      this.allAssetDataObj.AppCollateralObj.AppAssetId = this.appAssetId;
      if (this.appAssetObj.ResponseAppCollateralObj != null) {
        this.allAssetDataObj.AppCollateralObj.IsMainCollateral = this.appAssetObj.ResponseAppCollateralObj.IsMainCollateral;
      }
      else {
        this.allAssetDataObj.AppCollateralObj.IsMainCollateral = true;
      }
    }

    this.allAssetDataObj.AppAssetObj.AssetTypeCode = this.AssetDataForm.controls.AssetTypeCode.value;
    this.allAssetDataObj.AppAssetObj.AssetCategoryCode = this.AssetDataForm.controls.AssetCategoryCode.value;
    this.allAssetDataObj.AppAssetObj.SupplCode = this.AssetDataForm.controls.SupplCode.value;
    
    if (this.AssetDataForm.controls.AdminHeadNo.value != "") {
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = this.AssetDataForm.controls.AdminHeadName.value;
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = this.AssetDataForm.controls.AdminHeadNo.value;
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = this.AssetDataForm.controls.AdminHeadPositionCode.value;
    }
    else {
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = "-";
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = "-";
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = "-";
    }

    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName = this.AssetDataForm.controls.SalesPersonName.value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo = this.AssetDataForm.controls.SalesPersonNo.value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode = this.AssetDataForm.controls.SalesPersonPositionCode.value;
    
    if (this.AssetDataForm.controls.BranchManagerNo.value != "") {
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = this.AssetDataForm.controls.BranchManagerName.value;
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = this.AssetDataForm.controls.BranchManagerNo.value;
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = this.AssetDataForm.controls.BranchManagerPositionCode.value;
    }
    else {
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = "-";
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = "-";
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = "-";
    }

    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value;
    this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.AssetDataForm.controls.TaxIssueDt.value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;

    this.allAssetDataObj.AppCollateralObj.AppId = this.AppId;
    this.allAssetDataObj.AppCollateralObj.CollateralSeqNo = this.AssetDataForm.controls.AssetSeqNo.value;
    this.allAssetDataObj.AppCollateralObj.FullAssetCode = this.AssetDataForm.controls.FullAssetCode.value;
    this.allAssetDataObj.AppCollateralObj.FullAssetName = this.AssetDataForm.controls.FullAssetName.value;
    this.allAssetDataObj.AppCollateralObj.MrCollateralConditionCode = this.AssetDataForm.controls.MrAssetConditionCode.value;
    this.allAssetDataObj.AppCollateralObj.MrCollateralUsageCode = this.AssetDataForm.controls.MrAssetUsageCode.value;

    this.allAssetDataObj.AppCollateralObj.CollateralValueAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    this.allAssetDataObj.AppCollateralObj.AssetTypeCode = this.AssetDataForm.controls.AssetTypeCode.value;
    this.allAssetDataObj.AppCollateralObj.AssetCategoryCode = this.AssetDataForm.controls.AssetCategoryCode.value;
    this.allAssetDataObj.AppCollateralObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;
    
    this.allAssetDataObj.AppCollateralRegistrationObj.DelivAddr = this.AssetDataForm.controls["delivData"]["controls"].Addr.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode1 = this.AssetDataForm.controls["delivData"]["controls"].AreaCode1.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode2 = this.AssetDataForm.controls["delivData"]["controls"].AreaCode2.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode3 = this.AssetDataForm.controls["delivData"]["controls"].AreaCode3.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode4 = this.AssetDataForm.controls["delivData"]["controls"].AreaCode4.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.DelivCity = this.AssetDataForm.controls["delivData"]["controls"].City.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.DelivZipcode = this.AssetDataForm.controls["delivDataZipcode"]["controls"].value.value;
    
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAddr = this.AssetDataForm.controls["locationData"]["controls"].Addr.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AssetDataForm.controls["locationData"]["controls"].AreaCode1.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AssetDataForm.controls["locationData"]["controls"].AreaCode2.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AssetDataForm.controls["locationData"]["controls"].AreaCode3.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AssetDataForm.controls["locationData"]["controls"].AreaCode4.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationCity = this.AssetDataForm.controls["locationData"]["controls"].City.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AssetDataForm.controls["locationDataZipcode"]["controls"].value.value;

    this.allAssetDataObj.AppAssetAccessoryObjs = new Array<AppAssetAccessoryObj>();
    this.allAssetDataObj.AppCollateralAccessoryObjs = new Array<AppCollateralAccessoryObj>();
    this.allAssetDataObj.AppCollateralAttrObj = new Array<AppCollateralAttrObj>();
    this.allAssetDataObj.AppAssetAttrObj = new Array<AppAssetAttrObj>();

    for (let i = 0; i < this.AssetDataForm.controls["AssetAccessoriesObjs"].value.length; i++) {
      var appAssetAccObj = new AppAssetAccessoryObj();
      var appCollateralAccObj = new AppCollateralAccessoryObj();
      appAssetAccObj.AssetAccessoryCode = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryCode;
      appAssetAccObj.AssetAccessoryName = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryName;
      appAssetAccObj.SupplCode = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].SupplCodeAccessory;
      appAssetAccObj.SupplName = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].SupplNameAccessory;
      appAssetAccObj.AccessoryPriceAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryPriceAmt;
      appAssetAccObj.DownPaymentAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryDownPaymentAmt;
      appAssetAccObj.AccessoryNotes = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryNotes;

      appCollateralAccObj.CollateralAccessoryCode = appAssetAccObj.AssetAccessoryCode;
      appCollateralAccObj.CollateralAccessoryName = appAssetAccObj.AssetAccessoryName;
      appCollateralAccObj.AccessoryPriceAmt = appAssetAccObj.AccessoryPriceAmt;
      appCollateralAccObj.DownPaymentAmt = appAssetAccObj.DownPaymentAmt;
      appCollateralAccObj.AccessoryNotes = appAssetAccObj.AccessoryNotes;

      this.allAssetDataObj.AppAssetAccessoryObjs.push(appAssetAccObj);
      this.allAssetDataObj.AppCollateralAccessoryObjs.push(appCollateralAccObj);
    }
    if (this.AppAssetAttrObj != null) {
      for (let i = 0; i < this.AssetDataForm.controls["AppAssetAttrObjs"].value.length; i++) {
        var appAssetAttrObj = new AppAssetAttrObj();
        var appCollAttrcObj = new AppCollateralAttrObj();
        appAssetAttrObj.AssetAttrName = this.AssetDataForm.controls["AppAssetAttrObjs"].value[i].AssetAttrName;
        appAssetAttrObj.AssetAttrCode = this.AssetDataForm.controls["AppAssetAttrObjs"].value[i].AssetAttrCode;
        appAssetAttrObj.AttrValue = this.AssetDataForm.controls["AppAssetAttrObjs"].value[i].AttrValue;

        appCollAttrcObj.CollateralAttrName = appAssetAttrObj.AssetAttrName;
        appCollAttrcObj.CollateralAttrCode = appAssetAttrObj.AssetAttrCode;
        appCollAttrcObj.AttrValue = appAssetAttrObj.AttrValue;

        this.allAssetDataObj.AppAssetAttrObj.push(appAssetAttrObj);
        this.allAssetDataObj.AppCollateralAttrObj.push(appCollAttrcObj);
      }
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.AssetDataForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }
}