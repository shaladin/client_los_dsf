import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AllAssetDataObj } from '../../../shared/model/AllAssetDataObj.Model';
import { InputFieldObj } from '../../../shared/model/InputFieldObj.Model';
import { AddrObj } from '../../../shared/model/AddrObj.Model';
import { AppAssetAccessoryObj } from '../../../shared/model/AppAssetAccessoryObj.model';


@Component({
  selector: 'app-asset-data',
  templateUrl: './asset-data.component.html',
})

export class AssetDataComponent implements OnInit {

  appId: any;
  BranchManagerName: any;
  SelfUsage: boolean = true;
  inputFieldOwnerAddrObj: InputFieldObj;
  ownerAddrObj: AddrObj;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AddrObj;
  identifier: 'Accessories';
  appAssetAccessoriesObjs: Array<AppAssetAccessoryObj>;
  SocmedObj: any;

  AssetDataForm = this.fb.group({
    /* AppAsset Value that in form*/

    FullAssetName: ['', [Validators.required, Validators.maxLength(1000)]],
    MrAssetConditionCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrAssetUsageCode: ['', [Validators.required, Validators.maxLength(50)]],
    SerialNo1: [''],
    SerialNo2: [''],
    SerialNo3: [''],
    SerialNo4: [''],
    SerialNo5: [''],
    SupplName: ['', Validators.maxLength(500)],
    AssetPriceAmt: ['', Validators.required],
    DownPaymentAmt: ['', Validators.required],
    AssetNotes: ['', Validators.maxLength(4000)],
    Color: ['', Validators.maxLength(50)],
    TaxCityIssuer: ['', Validators.maxLength(50)],
    TaxIssueDt: [''],
    ManufacturingYear: [''],


    /* AppAsset Value That required but not in form*/
    AssetSeqNo: ['', Validators.required],
    FullAssetCode: ['', [Validators.required, Validators.maxLength(500)]],
    AssetStat: ['', [Validators.required, Validators.maxLength(50)]],
    AssetTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    AssetCategoryCode: ['', [Validators.required, Validators.maxLength(50)]],
    SupplCode: ['', Validators.maxLength(50)],
    IsCollateral: ['', Validators.required],
    IsInsurance: ['', Validators.required],
    IsEditableDp: ['', Validators.required],

    /*Admin Head SuppEmp*/
    AdminHeadName: ['', [Validators.required, Validators.maxLength(500)]],
    AdminHeadNo: ['', [Validators.required, Validators.maxLength(50)]],
    AdminHeadPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    /*Sales Person SuppEmp*/
    SalesPersonName: ['', [Validators.required, Validators.maxLength(500)]],
    SalesPersonNo: ['', [Validators.required, Validators.maxLength(50)]],
    SalesPersonPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    /*Branch Manager SuppEmp*/
    BranchManagerName: ['', [Validators.required, Validators.maxLength(500)]],
    BranchManagerNo: ['', [Validators.required, Validators.maxLength(50)]],
    BranchManagerPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    /*App Collateral Regist*/
    UserName: ['', Validators.maxLength(50)],
    MrUserRelationshipCode: ['', Validators.maxLength(4)],
    OwnerName: ['', Validators.maxLength(50)],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    OwnerIdNo: ['', Validators.maxLength(50)],
    MrOwnerRelationshipCode: ['', Validators.maxLength(50)],
    OwnerAddr: ['', Validators.maxLength(50)],
    OwnerAreaCode1: ['', Validators.maxLength(50)],
    OwnerAreaCode2: ['', Validators.maxLength(50)],
    OwnerAreaCode3: ['', Validators.maxLength(50)],
    OwnerAreaCode4: ['', Validators.maxLength(50)],
    OwnerCity: ['', Validators.maxLength(50)],
    OwnerZipcode: ['', Validators.maxLength(50)],
    OwnerMobilePhnNo: ['', Validators.maxLength(50)],
    LocationAddr: ['', Validators.maxLength(50)],
    LocationAreaCode1: ['', Validators.maxLength(50)],
    LocationAreaCode2: ['', Validators.maxLength(50)],
    LocationAreaCode3: ['', Validators.maxLength(50)],
    LocationAreaCode4: ['', Validators.maxLength(50)],
    LocationCity: ['', Validators.maxLength(50)],
    LocationZipcode: ['', Validators.maxLength(50)],

    AssetAccessoriesObjs: this.fb.array([])
    //AssetAccessoryCode: ['', [Validators.required, Validators.maxLength(50)]],
    //AssetAccessoryName: ['', [Validators.maxLength(100)]],
    //SupplCodeAccessory: ['', [Validators.required, Validators.maxLength(50)]],
    //SupplNameAccessory: ['', [Validators.required, Validators.maxLength(100)]],
    //AccessoryPriceAmt: ['', Validators.required],
    //AccessoryDownPaymentAmt: ['', Validators.required],
    //AccessoryNotes: ['']

  });


  refMasterObj = {
    RefMasterTypeCode: "",
  };
  appObj = {
    AppId: 0,
  };

  vendorObj = {
    VendorId: 0,
    VendorCode: "",
  };

  assetMasterObj = {
    FullAssetCode: "",
  };

  selectedSupplCode: any;
  selectedSupplName: any;
  selectedDpType: 'AMT';

  allAssetDataObj: AllAssetDataObj;

  InputLookupSupplierObj: any;
  InputLookupCityIssuerObj: any;
  InputLookupAssetObj: any;
  InputLookupSupplAccObj: any;
  InputLookupAccObj: any;

  EmpObj: any;
  AdminHeadObj: any;
  SalesPersonObj: any;
  BranchManagerObj: any;

  UserRelationObj: any;
  OwnerRelationObj: any;
  IdTypeObj: any;
  AssetUsageObj: any;
  AssetConditionObj: any;
  DpObj: any;
  AppObj: any;
  VendorObj: any;
  AssetMasterObj: any;

  getRefMasterUrl: any;
  AddEditAllAssetDataUrl: any;
  GetAllAssetDataUrl: any;
  getAppUrl: any;
  getVendorUrl: any;
  getVendorEmpUrl: any;
  getAssetMasterTypeUrl: any;

  OfficeCode: any;

  defaultSocmedCode: any;
  defaultSocmedName: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    })
  }

  ngOnInit() {
    this.initUrl();
    this.initLookup();
    this.bindAllRefMasterObj();
    this.appId = 11;
    this.GetAppData();
    this.assetMasterObj.FullAssetCode = 'CAR';
    this.GetAssetMaster(this.assetMasterObj);
    this.AssetDataForm.removeControl(this.identifier);
    this.AssetDataForm.addControl(this.identifier, this.fb.array([]));
    //this.getCustData();
  }

  initUrl() {
    this.getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.GetAllAssetDataUrl = AdInsConstant.GetAllAssetDataByAppId;
    this.getAppUrl = AdInsConstant.GetAppById;
    this.getVendorUrl = AdInsConstant.GetVendorByVendorCode;
    this.getVendorEmpUrl = AdInsConstant.GetListVendorEmpByVendorId;
    this.getAssetMasterTypeUrl = AdInsConstant.GetAssetMasterTypeByFullAssetCode;
    this.AddEditAllAssetDataUrl = AdInsConstant.AddEditAllAssetData;
  }

  SaveForm() {
    this.allAssetDataObj = new AllAssetDataObj();
    this.setAllAssetObj();
    this.http.post(this.AddEditAllAssetDataUrl, this.allAssetDataObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  setAllAssetObj() {
    this.allAssetDataObj.AppAssetObj.FullAssetName = this.AssetDataForm.controls.FullAssetName.value;
    this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.AssetDataForm.controls.MrAssetConditionCode.value;
    this.allAssetDataObj.AppAssetObj.MrAssetUsageCode = this.AssetDataForm.controls.MrAssetUsageCode.value;
    this.allAssetDataObj.AppAssetObj.SerialNo1 = this.AssetDataForm.controls.SerialNo1.value;
    this.allAssetDataObj.AppAssetObj.SerialNo2 = this.AssetDataForm.controls.SerialNo2.value;
    this.allAssetDataObj.AppAssetObj.SerialNo3 = this.AssetDataForm.controls.SerialNo3.value;
    this.allAssetDataObj.AppAssetObj.SerialNo4 = this.AssetDataForm.controls.SerialNo4.value;
    this.allAssetDataObj.AppAssetObj.SerialNo5 = this.AssetDataForm.controls.SerialNo5.value;
    this.allAssetDataObj.AppAssetObj.SupplName = this.AssetDataForm.controls.SupplName.value;
    this.allAssetDataObj.AppAssetObj.AssetPriceAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    this.allAssetDataObj.AppAssetObj.DownPaymentAmt = this.AssetDataForm.controls.DownPaymentAmt.value;
    this.allAssetDataObj.AppAssetObj.AssetNotes = this.AssetDataForm.controls.AssetNotes.value;
    this.allAssetDataObj.AppAssetObj.Color = this.AssetDataForm.controls.Color.value;
    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value;
    this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.AssetDataForm.controls.TaxIssueDt.value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;

    this.allAssetDataObj.AppAssetObj.AssetSeqNo = this.AssetDataForm.controls.AssetSeqNo.value;
    this.allAssetDataObj.AppAssetObj.FullAssetCode = this.AssetDataForm.controls.FullAssetCode.value;
    this.allAssetDataObj.AppAssetObj.AssetStat = this.AssetDataForm.controls.AssetStat.value;
    this.allAssetDataObj.AppAssetObj.AssetTypeCode = this.AssetDataForm.controls.AssetTypeCode.value;
    this.allAssetDataObj.AppAssetObj.AssetCategoryCode = this.AssetDataForm.controls.AssetCategoryCode.value;
    this.allAssetDataObj.AppAssetObj.SupplCode = this.AssetDataForm.controls.SupplCode.value;
    this.allAssetDataObj.AppAssetObj.IsCollateral = this.AssetDataForm.controls.IsCollateral.value;
    this.allAssetDataObj.AppAssetObj.IsInsurance = this.AssetDataForm.controls.IsInsurance.value;
    this.allAssetDataObj.AppAssetObj.IsEditableDp = this.AssetDataForm.controls.IsEditableDp.value;

    this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = this.AssetDataForm.controls.AdminHeadName.value;
    this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = this.AssetDataForm.controls.AdminHeadNo.value;
    this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = this.AssetDataForm.controls.AdminHeadPositionCode.value;

    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName = this.AssetDataForm.controls.AdminHeadName.value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo = this.AssetDataForm.controls.AdminHeadNo.value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode = this.AssetDataForm.controls.AdminHeadPositionCode.value;

    this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = this.AssetDataForm.controls.AdminHeadName.value;
    this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = this.AssetDataForm.controls.AdminHeadNo.value;
    this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = this.AssetDataForm.controls.AdminHeadPositionCode.value;

    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value;
    this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.AssetDataForm.controls.TaxIssueDt.value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;

    this.allAssetDataObj.AppCollateralObj.CollateralSeqNo = this.AssetDataForm.controls.AssetSeqNo.value;
    this.allAssetDataObj.AppCollateralObj.FullAssetCode = this.AssetDataForm.controls.FullAssetCode.value;
    this.allAssetDataObj.AppCollateralObj.FullAssetName = this.AssetDataForm.controls.FullAssetName.value;
    this.allAssetDataObj.AppCollateralObj.MrCollateralConditionCode = this.AssetDataForm.controls.MrAssetConditionCode.value;
    this.allAssetDataObj.AppCollateralObj.MrCollateralUsageCode = this.AssetDataForm.controls.MrAssetUsageCode.value;
    this.allAssetDataObj.AppCollateralObj.CollateralStat = this.AssetDataForm.controls.AssetStat.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo1 = this.AssetDataForm.controls.SerialNo1.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo2 = this.AssetDataForm.controls.SerialNo2.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo3 = this.AssetDataForm.controls.SerialNo3.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo4 = this.AssetDataForm.controls.SerialNo4.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo5 = this.AssetDataForm.controls.SerialNo5.value;
    this.allAssetDataObj.AppCollateralObj.CollateralValueAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    this.allAssetDataObj.AppCollateralObj.AssetTypeCode = this.AssetDataForm.controls.AssetTypeCode.value;
    this.allAssetDataObj.AppCollateralObj.AssetCategoryCode = this.AssetDataForm.controls.AssetCategoryCode.value;

    this.allAssetDataObj.AppCollateralRegistrationObj.UserName = this.AssetDataForm.controls.UserName.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.AssetDataForm.controls.MrUserRelationshipCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerName = this.AssetDataForm.controls.OwnerName.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AssetDataForm.controls.MrIdTypeCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AssetDataForm.controls.OwnerIdNo.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.AssetDataForm.controls.MrOwnerRelationshipCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AssetDataForm.controls.OwnerAddr.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AssetDataForm.controls.OwnerAreaCode1.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AssetDataForm.controls.OwnerAreaCode2.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AssetDataForm.controls.OwnerAreaCode3.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AssetDataForm.controls.OwnerAreaCode4.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerCity = this.AssetDataForm.controls.OwnerCity.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AssetDataForm.controls.OwnerZipcode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AssetDataForm.controls.OwnerMobilePhnNo.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAddr = this.AssetDataForm.controls.LocationAddr.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AssetDataForm.controls.LocationAreaCode1.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AssetDataForm.controls.LocationAreaCode2.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AssetDataForm.controls.LocationAreaCode3.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AssetDataForm.controls.LocationAreaCode4.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationCity = this.AssetDataForm.controls.LocationCity.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AssetDataForm.controls.LocationZipcode.value;
  }

  async SetSupplier(event) {
    this.AdminHeadObj = null;
    this.SalesPersonObj = null;
    this.vendorObj.VendorCode = event.VendorCode;
    this.vendorObj.VendorId = event.VendorId;
    console.log(event)
    await this.GetVendor(this.vendorObj);
    await this.GetVendorEmpList(this.vendorObj);
  }


  SetAsset(event) {
    this.assetMasterObj.FullAssetCode = event.FullAssetCode;
    this.GetAssetMaster(this.assetMasterObj);
  }


  SalesPersonChanged(event) {
    var tempId = event.value;
    var temp: any;
    temp = this.EmpObj.filter(
      emp => emp.VendorEmpId === tempId);
    this.AssetDataForm.patchValue({
      SalesPersonName: temp.VendorEmpName,
      SalesPersonNo: temp.VendorEmpNo,
      SalesPersonPositionCode: temp.MrVendorEmpPositionCode,
    });

    var SuperVisorId = 0;
    while (true) {
      if (temp.SupervisorId != null) {
        SuperVisorId = temp.SupervisorId;
        tempId = temp.SupervisorId;
      }
      else {
        break;
      }
    }

    if (SuperVisorId = 0) {
      this.AssetDataForm.patchValue({
        BranchManagerName: temp.VendorEmpName,
        BranchManagerNo: temp.VendorEmpNo,
        BranchManagerPositionCode: temp.MrVendorEmpPositionCode,
      });
      this.BranchManagerName = temp.VendorEmpName;
    }
    else {
      temp = this.EmpObj.filter(
        emp => emp.VendorEmpId === tempId);
      this.AssetDataForm.patchValue({
        BranchManagerName: temp.VendorEmpName,
        BranchManagerNo: temp.VendorEmpNo,
        BranchManagerPositionCode: temp.MrVendorEmpPositionCode,
      });
      this.BranchManagerName = temp.VendorEmpName;
    }

  }

  AdminHeadChanged(event) {
    var tempId = event.value;
    var temp: any;
    temp = this.EmpObj.filter(
      emp => emp.VendorEmpId === tempId);
    this.AssetDataForm.patchValue({
      AdminHeadName: temp.VendorEmpName,
      AdminHeadNo: temp.VendorEmpNo,
      AdminHeadPositionCode: temp.MrVendorEmpPositionCode,
    });
  }



  //getCustData() {
  //  this.custDataObj = new CustDataObj();
  //  this.custDataObj.AppId = this.appId;
  //  console.log(this.custDataObj);
  //  this.http.post(this.GetAllAssetDataUrl, this.custDataObj).subscribe(
  //    (response) => {
  //      console.log(response);
  //      var appCustObj = response["AppCustObj"];
  //      var appCustPersonalObj = response["AppCustPersonalObj"];
  //      this.AssetDataForm.patchValue({
  //        FullAssetCode: appCustObj.FullAssetCode,
  //        FullAssetName: appCustPersonalObj.FullAssetName,
  //        MrAssetConditionCode: appCustObj.MrAssetConditionCode,
  //        ManufacturingYear: appCustPersonalObj.ManufacturingYear,
  //        SerialNo1: appCustObj.SerialNo1,
  //        SerialNo2: appCustPersonalObj.SerialNo2,
  //        SerialNo3: formatDate(appCustObj.SerialNo3, 'yyyy-MM-dd', 'en-US'),
  //        Color: appCustPersonalObj.Color,
  //        AssetNotes: appCustPersonalObj.AssetNotes,
  //        AssetPriceAmt: formatDate(appCustPersonalObj.AssetPriceAmt, 'yyyy-MM-dd', 'en-US'),
  //        DownPaymentAmt: appCustPersonalObj.DownPaymentAmt,
  //        MrAssetUsageCode: appCustObj.MrAssetUsageCode,
  //        TaxCityIssuer: appCustPersonalObj.TaxCityIssuer,
  //        TaxIssueDt: appCustPersonalObj.TaxIssueDt,
  //        SupplName: appCustPersonalObj.SupplName,
  //        SupplCode: appCustPersonalObj.SupplCode,
  //        AdminHead: appCustPersonalObj.AdminHead,
  //        IsVip: appCustObj.IsVip,
  //        SalesPerson: appCustPersonalObj.SalesPerson,
  //        BranchManager: appCustPersonalObj.BranchManager,
  //        Email2: appCustPersonalObj.Email2,
  //        NoOfResidence: appCustPersonalObj.NoOfResidence,
  //        Email3: appCustPersonalObj.Email3,
  //        NoOfDependents: appCustPersonalObj.NoOfDependents
  //      });
  //      this.setCriteriaLookupCustomer(appCustObj.FullAssetCode);
  //      this.InputLookupSupplierObj.nameSelect = appCustObj.CustName;
  //      this.selectedSupplCode = appCustObj.CustNo;
  //      this.selectedDpType = appCustPersonalObj.NationalityCountryCode;
  //      this.setCountryName(appCustPersonalObj.NationalityCountryCode);
  //    },
  //    (error) => {
  //      console.log(error);
  //    }
  //  );
  //}



  initLookup() {
    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";
    var suppCrit = new Array();
    var critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'ro.OFFICE_CODE';
    critSuppObj.value = this.OfficeCode;
    //suppCrit.push(critSuppObj);

    var critSupp2Obj = new CriteriaObj();
    critSupp2Obj.DataType = 'text';
    critSupp2Obj.restriction = AdInsConstant.RestrictionEq;
    critSupp2Obj.propName = 'v.MR_VENDOR_CATEGORY_CODE';
    critSupp2Obj.value = 'SUPPLIER_BRANCH';
    suppCrit.push(critSupp2Obj);
    this.InputLookupSupplierObj.addCritInput = suppCrit;

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

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";


    this.InputLookupAccObj = new InputLookupObj();
    this.InputLookupAccObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupAccObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAccObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAccObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupAccObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";

  }

  bindAllRefMasterObj() {
    this.bindAssetUsageObj();
    this.bindIdTypeObj();
    this.bindUserOwnerRelationshipObj();
    this.bindAsseConditionObj();
    this.bindDownPaymentTypeObj();
  }

  bindAssetUsageObj() {
    this.refMasterObj.RefMasterTypeCode = "ASSET_USAGE";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.AssetUsageObj = response["ReturnObject"];
        if (this.AssetUsageObj.length > 0) {
          this.AssetDataForm.patchValue({
            MrAssetUsageCode: this.AssetUsageObj[0].Key
          });

        }
      }
    );
  }

  bindAsseConditionObj() {
    this.refMasterObj.RefMasterTypeCode = "ASSET_CONDITION";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.AssetConditionObj = response["ReturnObject"];
        if (this.AssetConditionObj.length > 0) {
          this.AssetDataForm.patchValue({
            MrAssetConditionCode: this.AssetConditionObj[0].Key
          });

        }
      }
    );
  }

  bindIdTypeObj() {
    this.refMasterObj.RefMasterTypeCode = "ID_TYPE";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.IdTypeObj = response["ReturnObject"];
        if (this.IdTypeObj.length > 0) {
          this.AssetDataForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[0].Key
          });
        }
      }
    );
  }

  bindDownPaymentTypeObj() {
    this.refMasterObj.RefMasterTypeCode = "DOWN_PAYMENT_TYPE";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.DpObj = response["ReturnObject"];
      }
    );
  }

  bindUserOwnerRelationshipObj() {

    this.refMasterObj.RefMasterTypeCode = "CUST_PERSONAL_RELATIONSHIP";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.UserRelationObj = response["ReturnObject"];
        this.OwnerRelationObj = response["ReturnObject"];
        if (this.UserRelationObj.length > 0) {
          this.AssetDataForm.patchValue({
            MrUserRelationshipCode: this.UserRelationObj[0].Key,
            MrOwnerRelationshipCode: this.UserRelationObj[0].Key
          });
        }
      }
    );
  }

  GetAppData() {
    this.appObj.AppId = this.appId;
    this.http.post(this.getAppUrl, this.appObj).subscribe(
      (response) => {
        console.log(response);
        this.AppObj = response;
        this.OfficeCode = this.AppObj.OriOfficeCode;
        console.log(this.OfficeCode);
      }
    );
  }

  async GetVendor(vendorObj) {
    this.http.post(this.getVendorUrl, this.vendorObj).subscribe(
      (response) => {
        this.VendorObj = response;
        this.AssetDataForm.patchValue({
          SupplName: this.VendorObj.SupplName,
          SupplCode: this.VendorObj.SupplCode,
        });
      }
    );
  }

  async GetVendorEmpList(vendorObj) {
    this.http.post(this.getVendorEmpUrl, this.vendorObj).subscribe(
      (response) => {
        console.log(response);
        this.EmpObj = response["ReturnObject"];
        this.AdminHeadObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === 'ADMIN_HEAD');
        this.SalesPersonObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === 'SALES_PERSON');

        if (this.AdminHeadObj.length > 0) {
          this.AssetDataForm.patchValue({
            AdminHeadName: this.AdminHeadObj[0].VendorEmpName,
            AdminHeadNo: this.AdminHeadObj[0].VendorEmpNo,
            AdminHeadPositionCode: this.AdminHeadObj[0].MrVendorEmpPositionCode,
          });
        };

        if (this.SalesPersonObj.length > 0) {
          this.AssetDataForm.patchValue({
            SalesPersonName: this.SalesPersonObj[0].VendorEmpName,
            SalesPersonNo: this.SalesPersonObj[0].VendorEmpNo,
            SalesPersonPositionCode: this.SalesPersonObj[0].MrVendorEmpPositionCode,
          });

          var SuperVisorId = 0;
          var tempId = 0;
          var temp: any;

          if (this.SalesPersonObj[0].SupervisorId != null) {
            SuperVisorId = this.SalesPersonObj[0].SupervisorId;
            tempId = this.SalesPersonObj[0].SupervisorId;

            while (true) {
              temp = this.EmpObj.filter(
                emp => emp.VendorEmpId === tempId);
              if (temp.SupervisorId != null) {
                SuperVisorId = temp.SupervisorId;
                tempId = temp.SupervisorId;
              }
              else {
                break;
              }
            }
          }

          if (SuperVisorId == 0) {
            this.AssetDataForm.patchValue({
              BranchManagerName: this.SalesPersonObj[0].VendorEmpName,
              BranchManagerNo: this.SalesPersonObj[0].VendorEmpNo,
              BranchManagerPositionCode: this.SalesPersonObj[0].MrVendorEmpPositionCode,
            });
            this.BranchManagerName = this.SalesPersonObj[0].VendorEmpName;
          }
          else {
            temp = this.EmpObj.filter(
              emp => emp.VendorEmpId === tempId);
            this.AssetDataForm.patchValue({
              BranchManagerName: temp.VendorEmpName,
              BranchManagerNo: temp.VendorEmpNo,
              BranchManagerPositionCode: temp.MrVendorEmpPositionCode,
            });
            this.BranchManagerName = temp.VendorEmpName;
          }
        };
      }
    );
  }

  GetAssetMaster(assetMasterObj) {
    this.http.post(this.getAssetMasterTypeUrl, this.assetMasterObj).subscribe(
      (response) => {
        this.AssetMasterObj = response;
        this.AssetDataForm.patchValue({
          FullAssetCode: this.AssetMasterObj.FullAssetCode,
          FullAssetName: this.AssetMasterObj.FullAssetName,
          AssetTypeCode: this.AssetMasterObj.AssetTypeCode,
        });
      }
    );
  }

  setAddrOwnerObj() {
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();


    this.ownerAddrObj = new AddrObj();
    this.ownerAddrObj.Addr = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAddr;
    this.ownerAddrObj.AreaCode1 = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode1;
    this.ownerAddrObj.AreaCode2 = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode2;
    this.ownerAddrObj.AreaCode3 = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode3;
    this.ownerAddrObj.AreaCode4 = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode4;
    this.ownerAddrObj.City = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerCity;


    this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode;
    this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode };

  }

  setAddrLocationObj() {
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();


    this.locationAddrObj = new AddrObj();
    this.locationAddrObj.Addr = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAddr;
    this.locationAddrObj.AreaCode1 = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode1;
    this.locationAddrObj.AreaCode2 = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode2;
    this.locationAddrObj.AreaCode3 = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode3;
    this.locationAddrObj.AreaCode4 = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode4;
    this.locationAddrObj.City = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerCity;


    this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode;
    this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode };

  }

  addAccessories() {
    var appAccessoryObj = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
    appAccessoryObj.push(this.addGroup(undefined));
  }

  deleteSocmed(i) {
    var appAccessoryObj = this.AssetDataForm.controls[this.identifier] as FormArray;
    appAccessoryObj.removeAt(i);
  }

  bindAccessories() {
    var listAppAccessories = this.AssetDataForm.controls[this.identifier] as FormArray;
    if (this.appAssetAccessoriesObjs != undefined) {
      for (let i = 0; i < this.appAssetAccessoriesObjs.length; i++) {
        listAppAccessories.push(this.addGroup(this.appAssetAccessoriesObjs[i]));
      }
    }
  }

  addGroup(appAssetAccessoriesObj) {
    if (appAssetAccessoriesObj == undefined) {
      return this.fb.group({
        AssetAccessoryCode: [this.defaultSocmedCode, [Validators.required, Validators.maxLength(50)]],
        AssetAccessoryName: [this.defaultSocmedName, [Validators.maxLength(100)]],
        SupplCodeAccessory: ['', [Validators.required, Validators.maxLength(50)]],
        SupplNameAccessory: ['', [Validators.required, Validators.maxLength(100)]],
        AccessoryPriceAmt: ['', Validators.required],
        DownPaymentAmt: ['', Validators.required],
        AccessoryNotes: ['']
      })
    } else {
      return this.fb.group({
        AssetAccessoryCode: [this.defaultSocmedCode, [Validators.required, Validators.maxLength(50)]],
        AssetAccessoryName: [this.defaultSocmedName, [Validators.maxLength(100)]],
        SupplCodeAccessory: ['', [Validators.required, Validators.maxLength(50)]],
        SupplNameAccessory: ['', [Validators.required, Validators.maxLength(100)]],
        AccessoryPriceAmt: ['', Validators.required],
        DownPaymentAmt: ['', Validators.required],
        AccessoryNotes: ['', Validators.maxLength(4000)]
      })
    }
  }

  setAccessoryName(i) {
    this.AssetDataForm.controls[this.identifier]["controls"][i].patchValue({
      AssetAccessoryName: this.SocmedObj.find(x => x.Key == this.AssetDataForm.controls["Accessories"].value[i].AssetAccessoryName).Value
    });
  }
  SetSupplierAccessory(i,event) {
    this.vendorObj.VendorCode = event.VendorCode;
    this.GetVendorAccessories(this.vendorObj);
  }

  setSupplierName(i) {
    this.AssetDataForm.controls[this.identifier]["controls"][i].patchValue({
      SupplNameAccessory: this.SocmedObj.find(x => x.Key == this.AssetDataForm.controls["Accessories"].value[i].SupplNameAccessory).Value
    });
  }

  GetVendorAccessories(vendorObj) {
    this.http.post(this.getVendorUrl, this.vendorObj).subscribe(
      (response) => {
        this.VendorObj = response;
        this.AssetDataForm.patchValue({
          SupplNameAccessory: this.VendorObj.SupplName,
          SupplCodeAccessory: this.VendorObj.SupplCode,
        });
      }
    );
  }
}
