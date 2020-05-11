import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AllAssetDataObj } from 'app/shared/model/AllAssetDataObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppAssetAccessoryObj } from 'app/shared/model/AppAssetAccessoryObj.model';
import { AppDataObj } from 'app/shared/model/AppDataObj.model';


@Component({
  selector: 'app-asset-data',
  templateUrl: './asset-data.component.html',
})

export class AssetDataComponent implements OnInit {

  @Input() AppId: any;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  BranchManagerName: string = "-";
  inputFieldOwnerAddrObj: InputFieldObj;
  ownerAddrObj: AddrObj;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AddrObj;
  appAssetAccessoriesObjs: Array<AppAssetAccessoryObj>;
  appAssetId: number = 0;

  AssetDataForm = this.fb.group({
    /* AppAsset Value that in form*/

    FullAssetName: ['', [Validators.required, Validators.maxLength(1000)]],
    MrAssetConditionCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrAssetUsageCode: ['', [Validators.required, Validators.maxLength(50)]],
    SerialNo1: [''],
    IsSerialNo1: [false],
    SerialNo2: [''],
    IsSerialNo2: [false],
    SerialNo3: [''],
    IsSerialNo3: [false],
    SerialNo4: [''],
    IsSerialNo4: [false],
    SerialNo5: [''],
    IsSerialNo5: [false],
    SupplName: ['', Validators.maxLength(500)],
    AssetPriceAmt: ['', Validators.required],
    DownPaymentAmt: ['', Validators.required],
    AssetNotes: ['', Validators.maxLength(4000)],
    Color: ['', Validators.maxLength(50)],
    TaxCityIssuer: [''],
    TaxIssueDt: [''],
    ManufacturingYear: [''],


    /* AppAsset Value That required but not in form*/
    AssetSeqNo: ['1', Validators.required],
    FullAssetCode: ['', [Validators.required, Validators.maxLength(500)]],
    AssetStat: ['NEW', [Validators.required, Validators.maxLength(50)]],
    AssetTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    AssetCategoryCode: ['', [Validators.required, Validators.maxLength(50)]],
    SupplCode: ['', Validators.maxLength(50)],
    IsCollateral: [true, Validators.required],
    IsInsurance: [true, Validators.required],
    IsEditableDp: [true, Validators.required],

    /*Admin Head SuppEmp*/
    AdminHeadId: [''],
    AdminHeadName: ['', [Validators.required, Validators.maxLength(500)]],
    AdminHeadNo: ['', [Validators.required, Validators.maxLength(50)]],
    AdminHeadPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    /*Sales Person SuppEmp*/
    SalesPersonId: [''],
    SalesPersonName: ['', [Validators.required, Validators.maxLength(500)]],
    SalesPersonNo: ['', [Validators.required, Validators.maxLength(50)]],
    SalesPersonPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    /*Branch Manager SuppEmp*/
    BranchManagerName: [''],
    BranchManagerNo: [''],
    BranchManagerPositionCode: [''],

    /*App Collateral Regist*/
    UserName: ['', Validators.maxLength(50)],
    MrUserRelationshipCode: ['', Validators.maxLength(20)],
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

    LocationAddrType: [''],
    OwnerAddrType: [''],
    selectedDpType: [''],
    SelfUsage: [false],
    AssetAccessoriesObjs: this.fb.array([])
    //AssetAccessoryCode: ['', [Validators.required, Validators.maxLength(50)]],
    //AssetAccessoryName: ['', [Validators.maxLength(100)]],
    //SupplCodeAccessory: ['', [Validators.required, Validators.maxLength(50)]],
    //SupplNameAccessory: ['', [Validators.required, Validators.maxLength(100)]],
    //AccessoryPriceAmt: ['', Validators.required],
    //AccessoryDownPaymentAmt: ['', Validators.required],
    //AccessoryNotes: ['']

  });
  CustType: string = "";
  AddrObj: any;
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  appObj = {
    AppId: 0,
  };

  vendorObj = {
    VendorId: 0,
    VendorCode: "",
    MrVendorEmpPositionCodes: ['ADMIN_HEAD', 'SALES_PERSON'],
  };

  vendorAccSuppObj = {
    VendorId: 0,
    VendorCode: "",
  };

  accObj = {
    AssetAccessoryCode: "",
  };

  vendorEmpObj = {
    VendorId: 0,
    VendorEmpId: 0,
    VendorEmpNo: "",
  };

  vendorEmpSalesObj = {
    VendorId: 0,
    VendorEmpId: 0,
    VendorEmpNo: "",
  };

  vendorEmpAdminObj = {
    VendorId: 0,
    VendorEmpId: 0,
    VendorEmpNo: "",
  };

  assetMasterObj = {
    FullAssetCode: "",
  };

  districtObj = {
    ProvDistrictCode: "",
  };

  selectedSupplCode: any;
  selectedSupplName: any;

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
  AppCustAddrObj: any;
  AddrLegalObj: any;
  AddrMailingObj: any;
  AddrResidenceObj: any;
  appAssetObj: any;
  DistrictObj: any;
  VendorEmpSalesObj: any;
  VendorAdminHeadObj: any;
  AppCustObj: any;
  RefProdCmpt: any;
  AppCustCoyObj: any;

  getRefMasterUrl: any;
  AddEditAllAssetDataUrl: any;
  GetAllAssetDataUrl: any;
  getAppUrl: any;
  getVendorUrl: any;
  getVendorEmpUrl: any;
  getAssetMasterTypeUrl: any;
  getVendorEmpSupervisiUrl: any;
  getAppCustAddrUrl: any;
  getProvDistrictUrl: any;
  getVendorEmpforGetUrl: any;
  getAssetAccessoryUrl: any;
  getAppCustUrl: any;

  OfficeCode: any;


  copyFromAppCustAddrForOwner: any;
  copyFromAppCustAddrForLocation: any;
  copyAddrObj: any = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
    {
      Key: "RESIDENCE",
      Value: "Residence"
    },
    {
      Key: "MAILING",
      Value: "Mailing"
    }
  ];

  dpTypeValue: any = [
    {
      Key: "AMT",
      Value: "Amount"
    },
    {
      Key: "PRCTG",
      Value: "Percentage"
    }
  ];

  appData: any;
  InputLookupAcceObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  InputLookupSupplObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  dictAccLookup: { [key: string]: any; } = {};
  dictSuppLookup: { [key: string]: any; } = {};
  isOnlookup: any;

  //AllAssetObjs: [{
  //  list: []
  //}] = [{ list: [] }];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"] ? params["AppId"] : this.AppId;
    })
  }

  async ngOnInit(): Promise<void> {
    this.isOnlookup = false;
    this.initUrl();
    await this.GetAppData();
    await this.GetRefProdCompt();
    await this.GetAppCust();
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();

    if (this.CustType == AdInsConstant.CustTypeCompany) {
      await this.GetAppCustCoy();
    }
    this.initLookup();
    this.bindAllRefMasterObj();
    await this.GetListAddr();
    //this.assetMasterObj.FullAssetCode = 'CAR';
    //this.GetAssetMaster(this.assetMasterObj);

    this.AssetDataForm.removeControl("AssetAccessoriesObjs");
    this.AssetDataForm.addControl("AssetAccessoriesObjs", this.fb.array([]));
    //this.AllAssetObjs.splice(0, 1);

    this.getAllAssetData();

  }

  initUrl() {
    this.getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.GetAllAssetDataUrl = AdInsConstant.GetAllAssetDataByAppId;
    this.getAppUrl = AdInsConstant.GetAppById;
    this.getVendorUrl = AdInsConstant.GetVendorByVendorCode;
    this.getVendorEmpUrl = AdInsConstant.GetListVendorEmpByVendorIdAndPositionCodes;
    this.getAssetMasterTypeUrl = AdInsConstant.GetAssetMasterTypeByFullAssetCode;
    this.AddEditAllAssetDataUrl = AdInsConstant.AddEditAllAssetData;
    this.getVendorEmpSupervisiUrl = AdInsConstant.GetVendorEmpSupervisorByVendorEmpId;
    this.getAppCustAddrUrl = AdInsConstant.GetListAppCustAddrByAppId;
    this.getProvDistrictUrl = AdInsConstant.GetRefProvDistrictByProvDistrictCode;
    this.getVendorEmpforGetUrl = AdInsConstant.GetVendorEmpByVendorIdVendorEmpNo;
    this.getAssetAccessoryUrl = AdInsConstant.GetAssetAccessoryByCode;
    this.getAppCustUrl = AdInsConstant.GetAppCustByAppId;
  }

  SaveForm() {
    this.allAssetDataObj = new AllAssetDataObj();
    this.setAllAssetObj();
    this.http.post(this.AddEditAllAssetDataUrl, this.allAssetDataObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.outputTab.emit();
      },
      (error) => {
        console.log(error);
      }
    );

  }

  setAllAssetObj() {
    console.log(this.AssetDataForm.controls.MrUserRelationshipCode.value)

    this.allAssetDataObj.AppAssetObj.AppId = this.AppId;
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
    if (this.appAssetId == 0) {
      this.allAssetDataObj.AppAssetObj.AssetStat = "NEW";
      this.allAssetDataObj.AppCollateralObj.CollateralStat = "NEW";
      this.allAssetDataObj.AppCollateralObj.AppAssetId = this.appAssetId;
      this.allAssetDataObj.AppCollateralObj.IsMainCollateral = true;
    }
    else {
      this.allAssetDataObj.AppAssetObj.AssetStat = this.AssetDataForm.controls.AssetStat.value;
      this.allAssetDataObj.AppCollateralObj.CollateralStat = this.AssetDataForm.controls.AssetStat.value;
      this.allAssetDataObj.AppCollateralObj.AppAssetId = this.appAssetObj.ResponseAppCollateralObj.AppAssetId;
      this.allAssetDataObj.AppCollateralObj.IsMainCollateral = this.appAssetObj.ResponseAppCollateralObj.IsMainCollateral;
    }
    this.allAssetDataObj.AppAssetObj.AssetTypeCode = this.AssetDataForm.controls.AssetTypeCode.value;
    this.allAssetDataObj.AppAssetObj.AssetCategoryCode = this.AssetDataForm.controls.AssetCategoryCode.value;
    this.allAssetDataObj.AppAssetObj.SupplCode = this.AssetDataForm.controls.SupplCode.value;
    this.allAssetDataObj.AppAssetObj.IsCollateral = this.AssetDataForm.controls.IsCollateral.value;
    this.allAssetDataObj.AppAssetObj.IsInsurance = this.AssetDataForm.controls.IsInsurance.value;
    this.allAssetDataObj.AppAssetObj.IsEditableDp = this.AssetDataForm.controls.IsEditableDp.value;

    this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = this.AssetDataForm.controls.AdminHeadName.value;
    this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = this.AssetDataForm.controls.AdminHeadNo.value;
    this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = this.AssetDataForm.controls.AdminHeadPositionCode.value;

    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName = this.AssetDataForm.controls.SalesPersonName.value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo = this.AssetDataForm.controls.SalesPersonNo.value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode = this.AssetDataForm.controls.SalesPersonPositionCode.value;

    this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = this.AssetDataForm.controls.BranchManagerName.value;
    this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = this.AssetDataForm.controls.BranchManagerNo.value;
    this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = "BRANCH_MANAGER";


    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value;
    this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.AssetDataForm.controls.TaxIssueDt.value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;

    this.allAssetDataObj.AppCollateralObj.AppId = this.AppId;
    this.allAssetDataObj.AppCollateralObj.CollateralSeqNo = this.AssetDataForm.controls.AssetSeqNo.value;
    this.allAssetDataObj.AppCollateralObj.FullAssetCode = this.AssetDataForm.controls.FullAssetCode.value;
    this.allAssetDataObj.AppCollateralObj.FullAssetName = this.AssetDataForm.controls.FullAssetName.value;
    this.allAssetDataObj.AppCollateralObj.MrCollateralConditionCode = this.AssetDataForm.controls.MrAssetConditionCode.value;
    this.allAssetDataObj.AppCollateralObj.MrCollateralUsageCode = this.AssetDataForm.controls.MrAssetUsageCode.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo1 = this.AssetDataForm.controls.SerialNo1.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo2 = this.AssetDataForm.controls.SerialNo2.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo3 = this.AssetDataForm.controls.SerialNo3.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo4 = this.AssetDataForm.controls.SerialNo4.value;
    this.allAssetDataObj.AppCollateralObj.SerialNo5 = this.AssetDataForm.controls.SerialNo5.value;
    this.allAssetDataObj.AppCollateralObj.CollateralValueAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    this.allAssetDataObj.AppCollateralObj.AssetTypeCode = this.AssetDataForm.controls.AssetTypeCode.value;
    this.allAssetDataObj.AppCollateralObj.AssetCategoryCode = this.AssetDataForm.controls.AssetCategoryCode.value;
    this.allAssetDataObj.AppCollateralObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;


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

    this.allAssetDataObj.AppAssetAccessoryObjs = new Array<AppAssetAccessoryObj>();
    for (let i = 0; i < this.AssetDataForm.controls["AssetAccessoriesObjs"].value.length; i++) {
      var appAssetAccObj = new AppAssetAccessoryObj();
      appAssetAccObj.AssetAccessoryCode = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryCode;
      appAssetAccObj.AssetAccessoryName = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryName;
      appAssetAccObj.SupplCode = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].SupplCodeAccessory;
      appAssetAccObj.SupplName = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].SupplNameAccessory;
      appAssetAccObj.AccessoryPriceAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryPriceAmt;
      appAssetAccObj.DownPaymentAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryDownPaymentAmt;
      appAssetAccObj.AccessoryNotes = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryNotes;
      this.allAssetDataObj.AppAssetAccessoryObjs.push(appAssetAccObj);
    }
  }

  async SetSupplier(event) {
    this.AdminHeadObj = null;
    this.SalesPersonObj = null;
    this.vendorObj.VendorCode = event.VendorCode;
    this.vendorObj.VendorId = event.VendorId;
    await this.GetVendor();
    await this.GetVendorEmpList();
    console.log(this.GetVendorEmpList);
  }

  SetBpkbCity(event) {
    this.AssetDataForm.patchValue({
      TaxCityIssuer: event.DistrictCode,

    });
  }

  SetAsset(event) {
    this.assetMasterObj.FullAssetCode = event.FullAssetCode;
    console.log(event);
    this.GetAssetMaster(this.assetMasterObj);
    this.AssetDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode
    });
    console.log(event);
  }


  SalesPersonChanged(event) {
    this.vendorEmpObj.VendorEmpId = event.target.value;
    this.GetVendorEmpSupervisi();

    console.log(event);
    var temp: any;
    temp = this.EmpObj.filter(
      emp => emp.VendorEmpId == event.target.value);
    this.AssetDataForm.patchValue({
      SalesPersonId: temp[0].VendorEmpId,
      SalesPersonName: temp[0].VendorEmpName,
      SalesPersonNo: temp[0].VendorEmpNo,
      SalesPersonPositionCode: temp[0].MrVendorEmpPositionCode,
    });

  }

  AdminHeadChanged(event) {
    var tempId = event.target.value;
    var temp: any;
    temp = this.EmpObj.filter(
      emp => emp.VendorEmpId == tempId);
    this.AssetDataForm.patchValue({
      AdminHeadId: temp[0].VendorEmpId,
      AdminHeadName: temp[0].VendorEmpName,
      AdminHeadNo: temp[0].VendorEmpNo,
      AdminHeadPositionCode: temp[0].MrVendorEmpPositionCode,
    });
  }

  DpTypeChange(event) {
    console.log(event);
    if (event.value == 'AMT') {
      this.AssetDataForm.patchValue({
        DownPaymentAmt: this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentAmt.value / 100
      });
    };
    if (event.value == 'PRCTG') {
      this.AssetDataForm.patchValue({
        DownPaymentAmt: this.AssetDataForm.controls.DownPaymentAmt.value / this.AssetDataForm.controls.AssetPriceAmt.value * 100
      });
    };

  }

  async SelfUsageChange(event) {
    console.log(event);
    if (event.checked == true) {
      this.AssetDataForm.patchValue({
        UserName: this.AppCustObj.CustName,
        MrUserRelationshipCode: "SELF",
        OwnerName: this.AppCustObj.CustName,
        MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
        OwnerIdNo: this.AppCustObj.IdNo,
        MrOwnerRelationshipCode: "SELF",
        OwnerAddr: this.AddrLegalObj[0].Addr,
        OwnerAreaCode1: this.AddrLegalObj[0].AreaCode1,
        OwnerAreaCode2: this.AddrLegalObj[0].AreaCode2,
        OwnerAreaCode3: this.AddrLegalObj[0].AreaCode3,
        OwnerAreaCode4: this.AddrLegalObj[0].AreaCode4,
        OwnerCity: this.AddrLegalObj[0].City,
        OwnerZipcode: this.AddrLegalObj[0].Zipcode
      });
      if (this.CustType = AdInsConstant.CustTypePersonal) {
        this.AssetDataForm.patchValue({
          MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
          OwnerIdNo: this.AppCustObj.IdNo,
        });
      }
      if (this.CustType = AdInsConstant.CustTypeCompany) {
        this.AssetDataForm.patchValue({
          MrIdTypeCode: "",
          OwnerIdNo: this.AppCustCoyObj.RegistrationNo,
        });
      }

      this.inputFieldOwnerAddrObj = new InputFieldObj();
      this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
      this.ownerAddrObj = new AddrObj();
      this.ownerAddrObj.Addr = this.AddrLegalObj[0].Addr;
      this.ownerAddrObj.AreaCode1 = this.AddrLegalObj[0].AreaCode1;
      this.ownerAddrObj.AreaCode2 = this.AddrLegalObj[0].AreaCode2;
      this.ownerAddrObj.AreaCode3 = this.AddrLegalObj[0].AreaCode3;
      this.ownerAddrObj.AreaCode4 = this.AddrLegalObj[0].AreaCode4;
      this.ownerAddrObj.City = this.AddrLegalObj[0].City;
      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AddrLegalObj[0].Zipcode;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrLegalObj[0].Zipcode };


      this.AssetDataForm.controls.UserName.clearValidators();
      this.AssetDataForm.controls.UserName.updateValueAndValidity();
      this.AssetDataForm.controls.MrUserRelationshipCode.clearValidators();
      this.AssetDataForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.AssetDataForm.controls["UserName"].disable();
      this.AssetDataForm.controls["MrUserRelationshipCode"].disable();
    };
    if (event.checked == false) {
      this.AssetDataForm.controls.UserName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.AssetDataForm.controls.UserName.updateValueAndValidity();
      this.AssetDataForm.controls.MrUserRelationshipCode.setValidators([Validators.required, Validators.maxLength(50)]);
      this.AssetDataForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.AssetDataForm.controls["UserName"].enable();
      this.AssetDataForm.controls["MrUserRelationshipCode"].enable();
    };

  }


  getAllAssetData() {
    this.appData = new AppDataObj();
    this.appData.AppId = this.AppId;
    console.log(this.appData);
    this.http.post(this.GetAllAssetDataUrl, this.appData).subscribe(
      (response) => {
        console.log("RESPOOOON");
        this.appAssetObj = response;
        console.log(this.appAssetObj);
        if (this.appAssetObj != "") {

          console.log("AAAA");
          this.AssetDataForm.patchValue({
            FullAssetCode: this.appAssetObj.ResponseAppAssetObj.FullAssetCode,
            FullAssetName: this.appAssetObj.ResponseAppAssetObj.FullAssetName,
            MrAssetConditionCode: this.appAssetObj.ResponseAppAssetObj.MrAssetConditionCode,
            MrAssetUsageCode: this.appAssetObj.ResponseAppAssetObj.MrAssetUsageCode,
            SerialNo1: this.appAssetObj.ResponseAppAssetObj.SerialNo1,
            SerialNo2: this.appAssetObj.ResponseAppAssetObj.SerialNo2,
            SerialNo3: this.appAssetObj.ResponseAppAssetObj.SerialNo3,
            SerialNo4: this.appAssetObj.ResponseAppAssetObj.SerialNo4,
            SerialNo5: this.appAssetObj.ResponseAppAssetObj.SerialNo5,
            SupplName: this.appAssetObj.ResponseAppAssetObj.SupplName,
            SupplCode: this.appAssetObj.ResponseAppAssetObj.SupplCode,
            ManufacturingYear: this.appAssetObj.ResponseAppAssetObj.ManufacturingYear,
            AssetPriceAmt: this.appAssetObj.ResponseAppAssetObj.AssetPriceAmt,
            DownPaymentAmt: this.appAssetObj.ResponseAppAssetObj.DownPaymentAmt,
            AssetNotes: this.appAssetObj.ResponseAppAssetObj.AssetNotes,
            Color: this.appAssetObj.ResponseAppAssetObj.Color,
            TaxCityIssuer: this.appAssetObj.ResponseAppAssetObj.TaxCityIssuer,
            TaxIssueDt: formatDate(this.appAssetObj.ResponseAppAssetObj.TaxIssueDt, 'yyyy-MM-dd', 'en-US'),
            AssetSeqNo: this.appAssetObj.ResponseAppAssetObj.AssetSeqNo,
            AssetStat: this.appAssetObj.ResponseAppAssetObj.AssetStat,
            AssetTypeCode: this.appAssetObj.ResponseAppAssetObj.AssetTypeCode,
            AssetCategoryCode: this.appAssetObj.ResponseAppAssetObj.AssetCategoryCode,
            IsCollateral: this.appAssetObj.ResponseAppAssetObj.IsCollateral,
            IsInsurance: this.appAssetObj.ResponseAppAssetObj.IsInsurance,
            IsEditableDp: this.appAssetObj.ResponseAppAssetObj.IsEditableDp,

            AdminHeadName: this.appAssetObj.ResponseAdminHeadSupp.SupplEmpName,
            AdminHeadNo: this.appAssetObj.ResponseAdminHeadSupp.SupplEmpNo,
            AdminHeadPositionCode: this.appAssetObj.ResponseAdminHeadSupp.MrSupplEmpPositionCode,
            SalesPersonName: this.appAssetObj.ResponseSalesPersonSupp.SupplEmpName,
            SalesPersonNo: this.appAssetObj.ResponseSalesPersonSupp.SupplEmpNo,
            SalesPersonPositionCode: this.appAssetObj.ResponseSalesPersonSupp.MrSupplEmpPositionCode,
            BranchManagerName: "-",
            BranchManagerNo: "-",
            BranchManagerPositionCode: "-",

            UserName: this.appAssetObj.ResponseAppCollateralRegistrationObj.UserName,
            MrUserRelationshipCode: this.appAssetObj.ResponseAppCollateralRegistrationObj.MrUserRelationshipCode,
            OwnerName: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerName,
            MrIdTypeCode: this.appAssetObj.ResponseAppCollateralRegistrationObj.MrIdTypeCode,
            OwnerIdNo: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerIdNo,
            MrOwnerRelationshipCode: this.appAssetObj.ResponseAppCollateralRegistrationObj.MrOwnerRelationshipCode,
            OwnerAddr: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAddr,
            OwnerAreaCode1: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode1,
            OwnerAreaCode2: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode2,
            OwnerAreaCode3: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode3,
            OwnerAreaCode4: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode4,
            OwnerCity: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerCity,
            OwnerZipcode: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerZipcode,
            OwnerMobilePhnNo: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerMobilePhnNo,
            LocationAddr: this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAddr,
            LocationAreaCode1: this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAreaCode1,
            LocationAreaCode2: this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAreaCode2,
            LocationAreaCode3: this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAreaCode3,
            LocationAreaCode4: this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAreaCode4,
            LocationCity: this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationCity,
            LocationZipcode: this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationZipcode,
            selectedDpType: 'AMT'
          });
          if (this.appAssetObj.ResponseBranchManagerSupp != null) {
            this.AssetDataForm.patchValue({
              BranchManagerName: this.appAssetObj.ResponseBranchManagerSupp.SupplEmpName,
              BranchManagerNo: this.appAssetObj.ResponseBranchManagerSupp.SupplEmpNo,
              BranchManagerPositionCode: this.appAssetObj.ResponseBranchManagerSupp.MrSupplEmpPositionCode
            });
            this.BranchManagerName = this.appAssetObj.ResponseBranchManagerSupp.SupplEmpName;
          }
          console.log(this.AssetDataForm.value)

          this.appAssetAccessoriesObjs = this.appAssetObj.ResponseAppAssetAccessoryObjs;
          this.appAssetId = this.appAssetObj.ResponseAppAssetObj.AppAssetId;
          this.setAddrOwnerObj();
          this.setAddrLocationObj();
          this.assetMasterObj.FullAssetCode = this.appAssetObj.ResponseAppAssetObj.FullAssetCode;
          this.GetAssetMaster(this.assetMasterObj);
          this.vendorObj.VendorCode = this.appAssetObj.ResponseAppAssetObj.SupplCode;
          this.GetVendorForView();
          this.districtObj.ProvDistrictCode = this.appAssetObj.ResponseAppAssetObj.TaxCityIssuer;
          this.GetProvDistrict();
          this.bindAccessories();
        }

      },
      (error) => {
        console.log(error);
      }
    );

  }


  initLookup() {
    this.InputLookupSupplierObj = this.initLookupSupp();

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
    this.InputLookupAssetObj.isRequired = false;

    var assetCrit = new Array();
    var critAssetObj = new CriteriaObj();
    critAssetObj.DataType = 'text';
    critAssetObj.restriction = AdInsConstant.RestrictionEq;
    critAssetObj.propName = 'B.ASSET_TYPE_NAME';
    critAssetObj.value = this.RefProdCmpt.CompntValue;
    assetCrit.push(critAssetObj);
    this.InputLookupAssetObj.addCritInput = assetCrit;


    this.InputLookupAccObj = this.initLookupAcc();
    this.isOnlookup = true;
  }
  initLookupAcc() {
    this.InputLookupAccObj = new InputLookupObj();
    this.InputLookupAccObj.urlJson = "./assets/uclookup/NAP/lookupAcc.json";
    this.InputLookupAccObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAccObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAccObj.pagingJson = "./assets/uclookup/NAP/lookupAcc.json";
    this.InputLookupAccObj.genericJson = "./assets/uclookup/NAP/lookupAcc.json";

    return this.InputLookupAccObj;
  }

  initLookupSupp() {
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

    return this.InputLookupSupplierObj;
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
    if (this.CustType == AdInsConstant.CustTypePersonal) {
      this.refMasterObj.RefMasterTypeCode = "CUST_PERSONAL_RELATIONSHIP";
    }
    else {
      this.refMasterObj.RefMasterTypeCode = "CUST_COMPANY_RELATIONSHIP";
    }
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

  async GetAppData() {
    this.appObj.AppId = this.AppId;
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {
        console.log(response);
        this.AppObj = response;
        this.OfficeCode = this.AppObj.OriOfficeCode;
        console.log(this.OfficeCode);
      }
    );
  }

  async GetVendor() {
    await this.http.post(this.getVendorUrl, this.vendorObj).toPromise().then(
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

  async GetVendorForView() {
    await this.http.post(this.getVendorUrl, this.vendorObj).toPromise().then(
      (response) => {
        this.VendorObj = response;
        this.AssetDataForm.patchValue({
          SupplName: this.VendorObj.VendorName,
          SupplCode: this.VendorObj.VendorCode,
        });
        this.vendorEmpSalesObj.VendorId = this.VendorObj.VendorId;
        this.vendorEmpAdminObj.VendorId = this.VendorObj.VendorId;
        this.vendorEmpAdminObj.VendorEmpNo = this.appAssetObj.ResponseAdminHeadSupp.SupplEmpNo;
        this.vendorEmpSalesObj.VendorEmpNo = this.appAssetObj.ResponseSalesPersonSupp.SupplEmpNo;
        this.GetVendorEmpSalesPerson();
        this.GetVendorEmpAdminHead();

        this.vendorObj.VendorId = this.VendorObj.VendorId;
        this.GetVendorEmpList();
        this.InputLookupSupplierObj.jsonSelect = this.VendorObj;
        this.InputLookupSupplierObj.nameSelect = this.VendorObj.VendorName;

      }
    );
  }

  GetProvDistrict() {
    this.http.post(this.getProvDistrictUrl, this.districtObj).subscribe(
      (response) => {
        this.DistrictObj = response;
        this.AssetDataForm.patchValue({
          TaxCityIssuer: this.DistrictObj.ProvDistrictCode
        });
        this.InputLookupCityIssuerObj.jsonSelect = this.DistrictObj;
        this.InputLookupCityIssuerObj.nameSelect = this.DistrictObj.ProvDistrictName;
      }
    );
  }

  GetVendorEmpSalesPerson() {
    this.http.post(this.getVendorEmpforGetUrl, this.vendorEmpSalesObj).subscribe(
      (response) => {
        console.log(response);
        this.VendorEmpSalesObj = response;
        this.AssetDataForm.patchValue({
          SalesPersonId: this.VendorEmpSalesObj.VendorEmpId
        });
        this.vendorEmpObj.VendorEmpId = this.VendorEmpSalesObj.VendorEmpId;
        //this.GetVendorEmpSupervisi();
      }
    );
  }

  GetVendorEmpAdminHead() {
    this.http.post(this.getVendorEmpforGetUrl, this.vendorEmpAdminObj).subscribe(
      (response) => {
        console.log(response);
        this.VendorAdminHeadObj = response;
        this.AssetDataForm.patchValue({
          AdminHeadId: this.VendorAdminHeadObj.VendorEmpId
        });
      }
    );
  }

  async GetVendorEmpList() {
    this.http.post(this.getVendorEmpUrl, this.vendorObj).subscribe(
      (response) => {
        console.log(response);
        console.log(this.vendorObj);
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
        };
      }
    );
  }

  GetAssetMaster(assetMasterObj) {
    this.http.post(this.getAssetMasterTypeUrl, assetMasterObj).subscribe(
      (response) => {
        this.AssetMasterObj = response;
        this.AssetDataForm.patchValue({
          FullAssetCode: this.AssetMasterObj.FullAssetCode,
          FullAssetName: this.AssetMasterObj.FullAssetName,
          AssetTypeCode: this.AssetMasterObj.AssetTypeCode,
        });
        this.InputLookupAssetObj.jsonSelect = this.AssetMasterObj;
        this.InputLookupAssetObj.nameSelect = this.AssetMasterObj.FullAssetName;
        if (this.AssetDataForm.controls.MrAssetConditionCode.value == 'NEW') {
          if (this.AssetMasterObj.SerialNo1Label != "" && this.AssetMasterObj.SerialNo1Label != null) {
            if (this.AssetMasterObj.IsMndtrySerialNo1 == true) {
              this.AssetDataForm.controls.SerialNo1.setValidators([Validators.required, Validators.maxLength(50)]);
              this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
            }
            else {
              this.AssetDataForm.controls.SerialNo1.clearValidators;
              this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
            }
          }
          else {
            this.AssetDataForm.controls.SerialNo1.clearValidators;
            this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
          }
          if (this.AssetMasterObj.SerialNo2Label != "" && this.AssetMasterObj.SerialNo2Label != null) {
            if (this.AssetMasterObj.IsMndtrySerialNo2 == true) {
              this.AssetDataForm.controls.SerialNo2.setValidators([Validators.required, Validators.maxLength(50)]);
              this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
            }
            else {
              this.AssetDataForm.controls.SerialNo2.clearValidators;
              this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
            }
          }
          else {
            this.AssetDataForm.controls.SerialNo2.clearValidators;
            this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
          }
          if (this.AssetMasterObj.SerialNo3Label != "" && this.AssetMasterObj.SerialNo3Label != null) {
            if (this.AssetMasterObj.IsMndtrySerialNo3 == true) {
              this.AssetDataForm.controls.SerialNo3.setValidators([Validators.required, Validators.maxLength(50)]);
              this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
            }
            else {
              this.AssetDataForm.controls.SerialNo3.clearValidators;
              this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
            }
          }
          else {
            this.AssetDataForm.controls.SerialNo3.clearValidators;
            this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
          }
          if (this.AssetMasterObj.SerialNo4Label != "" && this.AssetMasterObj.SerialNo4Label != null) {
            if (this.AssetMasterObj.IsMndtrySerialNo4 == true) {
              this.AssetDataForm.controls.SerialNo4.setValidators([Validators.required, Validators.maxLength(50)]);
              this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
            }
            else {
              this.AssetDataForm.controls.SerialNo4.clearValidators;
              this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
            }
          }
          else {
            this.AssetDataForm.controls.SerialNo4.clearValidators;
            this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
          }
          if (this.AssetMasterObj.SerialNo5Label != "" && this.AssetMasterObj.SerialNo5Label != null) {
            if (this.AssetMasterObj.IsMndtrySerialNo5 == true) {
              this.AssetDataForm.controls.SerialNo5.setValidators([Validators.required, Validators.maxLength(50)]);
              this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
            }
            else {
              this.AssetDataForm.controls.SerialNo5.clearValidators;
              this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
            }
          }
          else {
            this.AssetDataForm.controls.SerialNo5.clearValidators;
            this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
          }
        }
        if (this.AssetDataForm.controls.MrAssetConditionCode.value == 'USED') {
          if (this.AssetMasterObj.SerialNo1Label != "" && this.AssetMasterObj.SerialNo1Label != null) {
            this.AssetDataForm.controls.SerialNo1.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo1.clearValidators;
            this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
          }
          if (this.AssetMasterObj.SerialNo2Label != "" && this.AssetMasterObj.SerialNo2Label != null) {
            this.AssetDataForm.controls.SerialNo2.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo2.clearValidators;
            this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
          }
          if (this.AssetMasterObj.SerialNo3Label != "" && this.AssetMasterObj.SerialNo3Label != null) {
            this.AssetDataForm.controls.SerialNo3.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo3.clearValidators;
            this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
          }
          if (this.AssetMasterObj.SerialNo4Label != "" && this.AssetMasterObj.SerialNo4Label != null) {
            this.AssetDataForm.controls.SerialNo4.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo4.clearValidators;
            this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
          }
          if (this.AssetMasterObj.SerialNo5Label != "" && this.AssetMasterObj.SerialNo5Label != null) {
            this.AssetDataForm.controls.SerialNo5.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo5.clearValidators;
            this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
          }
        }
      }
    );
  }

  AssetConditionChanged() {
    if (this.AssetMasterObj != null) {
      if (this.AssetDataForm.controls.MrAssetConditionCode.value == 'NEW') {
        if (this.AssetMasterObj.SerialNo1Label != "" && this.AssetMasterObj.SerialNo1Label != null) {
          if (this.AssetMasterObj.IsMndtrySerialNo1 == true) {
            this.AssetDataForm.controls.SerialNo1.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo1.clearValidators;
            this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
          }
        }
        else {
          this.AssetDataForm.controls.SerialNo1.clearValidators;
          this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
        }
        if (this.AssetMasterObj.SerialNo2Label != "" && this.AssetMasterObj.SerialNo2Label != null) {
          if (this.AssetMasterObj.IsMndtrySerialNo2 == true) {
            this.AssetDataForm.controls.SerialNo2.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo2.clearValidators;
            this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
          }
        }
        else {
          this.AssetDataForm.controls.SerialNo2.clearValidators;
          this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
        }
        if (this.AssetMasterObj.SerialNo3Label != "" && this.AssetMasterObj.SerialNo3Label != null) {
          if (this.AssetMasterObj.IsMndtrySerialNo3 == true) {
            this.AssetDataForm.controls.SerialNo3.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo3.clearValidators;
            this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
          }
        }
        else {
          this.AssetDataForm.controls.SerialNo3.clearValidators;
          this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
        }
        if (this.AssetMasterObj.SerialNo4Label != "" && this.AssetMasterObj.SerialNo4Label != null) {
          if (this.AssetMasterObj.IsMndtrySerialNo4 == true) {
            this.AssetDataForm.controls.SerialNo4.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo4.clearValidators;
            this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
          }
        }
        else {
          this.AssetDataForm.controls.SerialNo4.clearValidators;
          this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
        }
        if (this.AssetMasterObj.SerialNo5Label != "" && this.AssetMasterObj.SerialNo5Label != null) {
          if (this.AssetMasterObj.IsMndtrySerialNo5 == true) {
            this.AssetDataForm.controls.SerialNo5.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
          }
          else {
            this.AssetDataForm.controls.SerialNo5.clearValidators;
            this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
          }
        }
        else {
          this.AssetDataForm.controls.SerialNo5.clearValidators;
          this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
        }
      }
      if (this.AssetDataForm.controls.MrAssetConditionCode.value == 'USED') {
        if (this.AssetMasterObj.SerialNo1Label != "" && this.AssetMasterObj.SerialNo1Label != null) {
          this.AssetDataForm.controls.SerialNo1.setValidators([Validators.required, Validators.maxLength(50)]);
          this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
        }
        else {
          this.AssetDataForm.controls.SerialNo1.clearValidators;
          this.AssetDataForm.controls.SerialNo1.updateValueAndValidity();
        }
        if (this.AssetMasterObj.SerialNo2Label != "" && this.AssetMasterObj.SerialNo2Label != null) {
          this.AssetDataForm.controls.SerialNo2.setValidators([Validators.required, Validators.maxLength(50)]);
          this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
        }
        else {
          this.AssetDataForm.controls.SerialNo2.clearValidators;
          this.AssetDataForm.controls.SerialNo2.updateValueAndValidity();
        }
        if (this.AssetMasterObj.SerialNo3Label != "" && this.AssetMasterObj.SerialNo3Label != null) {
          this.AssetDataForm.controls.SerialNo3.setValidators([Validators.required, Validators.maxLength(50)]);
          this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
        }
        else {
          this.AssetDataForm.controls.SerialNo3.clearValidators;
          this.AssetDataForm.controls.SerialNo3.updateValueAndValidity();
        }
        if (this.AssetMasterObj.SerialNo4Label != "" && this.AssetMasterObj.SerialNo4Label != null) {
          this.AssetDataForm.controls.SerialNo4.setValidators([Validators.required, Validators.maxLength(50)]);
          this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
        }
        else {
          this.AssetDataForm.controls.SerialNo4.clearValidators;
          this.AssetDataForm.controls.SerialNo4.updateValueAndValidity();
        }
        if (this.AssetMasterObj.SerialNo5Label != "" && this.AssetMasterObj.SerialNo5Label != null) {
          this.AssetDataForm.controls.SerialNo5.setValidators([Validators.required, Validators.maxLength(50)]);
          this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
        }
        else {
          this.AssetDataForm.controls.SerialNo5.clearValidators;
          this.AssetDataForm.controls.SerialNo5.updateValueAndValidity();
        }
      }
    }
  }

  setAddrOwnerObj() {
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();


    this.ownerAddrObj = new AddrObj();
    this.ownerAddrObj.Addr = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAddr;
    this.ownerAddrObj.AreaCode1 = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode1;
    this.ownerAddrObj.AreaCode2 = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode2;
    this.ownerAddrObj.AreaCode3 = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode3;
    this.ownerAddrObj.AreaCode4 = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode4;
    this.ownerAddrObj.City = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerCity;


    this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerZipcode;
    this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerZipcode };

  }

  setAddrLocationObj() {
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();


    this.locationAddrObj = new AddrObj();
    this.locationAddrObj.Addr = this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAddr;
    this.locationAddrObj.AreaCode1 = this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAreaCode1;
    this.locationAddrObj.AreaCode2 = this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAreaCode2;
    this.locationAddrObj.AreaCode3 = this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAreaCode3;
    this.locationAddrObj.AreaCode4 = this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationAreaCode4;
    this.locationAddrObj.City = this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationCity;


    this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationZipcode;
    this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.appAssetObj.ResponseAppCollateralRegistrationObj.LocationZipcode };

  }

  addAccessories() {
    var appAccessoryObj = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
    var length = this.AssetDataForm.value["AssetAccessoriesObjs"].length;
    var max = 0;
    if (length > 0) {
      max = this.AssetDataForm.value["AssetAccessoriesObjs"][length - 1].No;
    }

    appAccessoryObj.push(this.addGroup(undefined, max + 1));

    var InputLookupAccObj = this.initLookupAcc();
    var InputLookupAccSupObj = this.initLookupSupp();
    this.InputLookupAcceObjs.push(InputLookupAccObj);
    this.InputLookupSupplObjs.push(InputLookupAccSupObj);

    this.dictAccLookup[max + 1] = InputLookupAccObj;
    this.dictSuppLookup[max + 1] = InputLookupAccSupObj;

    //this.AllAssetObjs.push({ list: [] });
  }

  deleteAccessory(i) {
    var appAccessoryObjs = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
    var no = appAccessoryObjs.controls[i]["controls"]["No"].value;
    appAccessoryObjs.removeAt(i);
    //this.AllAssetObjs.splice(i, 1);
    this.AssetDataForm.removeControl("lookupSupplierObj" + no);
    this.AssetDataForm.removeControl("lookupAccObj" + no);
  }

  bindAccessories() {
    if (this.appAssetAccessoriesObjs != undefined) {
      for (let i = 0; i < this.appAssetAccessoriesObjs.length; i++) {
        var listAppAccessories = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
        listAppAccessories.push(this.addGroup(this.appAssetAccessoriesObjs[i], i));

        var InputLookupAccObj = this.initLookupAcc();
        var InputLookupAccSupObj = this.initLookupSupp();
        this.dictAccLookup[i] = InputLookupAccObj;
        this.dictSuppLookup[i] = InputLookupAccSupObj;
        this.InputLookupAcceObjs.push(InputLookupAccObj);
        this.InputLookupSupplObjs.push(InputLookupAccSupObj);

        this.setAppAccessorySupplier(i, this.appAssetAccessoriesObjs[i].SupplCode);
        this.setAppAccessory(i, this.appAssetAccessoriesObjs[i].AssetAccessoryCode);
      }
      console.log(this.appAssetAccessoriesObjs);
    }
  }

  setAppAccessorySupplier(i, SupplCode) {
    this.vendorAccSuppObj.VendorCode = SupplCode;
    this.http.post(this.getVendorUrl, this.vendorAccSuppObj).subscribe(
      (response) => {
        console.log(response);
        this.dictSuppLookup[i].nameSelect = response["VendorName"];
        this.dictSuppLookup[i].jsonSelect = response;
        this.InputLookupSupplObjs[i].jsonSelect = response;

      },
      (error) => {
        console.log(error);
      }
    );
  }

  setAppAccessory(i, AssetAccessoryCode) {
    this.accObj.AssetAccessoryCode = AssetAccessoryCode;
    this.http.post(this.getAssetAccessoryUrl, this.accObj).subscribe(
      (response) => {
        console.log(response);
        this.dictAccLookup[i].nameSelect = response["AssetAccessoryName"];
        this.dictAccLookup[i].jsonSelect = response;
        this.InputLookupAcceObjs[i].jsonSelect = response;

      },
      (error) => {
        console.log(error);
      }
    );
  }

  addGroup(appAssetAccessoriesObj, i) {
    if (appAssetAccessoriesObj == undefined) {
      return this.fb.group({
        No: [i],
        AssetAccessoryCode: ['', [Validators.required, Validators.maxLength(50)]],
        AssetAccessoryName: ['', [Validators.maxLength(100)]],
        SupplCodeAccessory: ['', [Validators.required, Validators.maxLength(50)]],
        SupplNameAccessory: ['', [Validators.required, Validators.maxLength(100)]],
        AccessoryPriceAmt: ['', Validators.required],
        AccessoryDownPaymentAmt: ['', Validators.required],
        AccessoryNotes: ['']
      })
    } else {
      return this.fb.group({
        No: [i],
        AssetAccessoryCode: [appAssetAccessoriesObj.AssetAccessoryCode, [Validators.required, Validators.maxLength(50)]],
        AssetAccessoryName: [appAssetAccessoriesObj.AssetAccessoryName, [Validators.maxLength(100)]],
        SupplCodeAccessory: [appAssetAccessoriesObj.SupplCode, [Validators.required, Validators.maxLength(50)]],
        SupplNameAccessory: [appAssetAccessoriesObj.SupplName, [Validators.required, Validators.maxLength(100)]],
        AccessoryPriceAmt: [appAssetAccessoriesObj.AccessoryPriceAmt, Validators.required],
        AccessoryDownPaymentAmt: [appAssetAccessoriesObj.DownPaymentAmt, Validators.required],
        AccessoryNotes: [appAssetAccessoriesObj.AccessoryNotes, Validators.maxLength(4000)]
      })
    }
  }

  //setAccessoryName(i) {
  //  this.AssetDataForm.controls[this.identifier]["controls"][i].patchValue({
  //    AssetAccessoryName: this.SocmedObj.find(x => x.Key == this.AssetDataForm.controls["Accessories"].value[i].AssetAccessoryName).Value
  //  });
  //}
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

  //setSupplierName(i) {
  //  this.AssetDataForm.controls[this.identifier]["controls"][i].patchValue({
  //    SupplNameAccessory: this.SocmedObj.find(x => x.Key == this.AssetDataForm.controls["Accessories"].value[i].SupplNameAccessory).Value
  //  });
  //}

  GetVendorAccessories() {
    this.http.post(this.getVendorUrl, this.vendorObj).subscribe(
      (response) => {
        this.VendorObj = response;
        this.AssetDataForm.patchValue({
          SupplNameAccessory: this.VendorObj.VendorName,
          SupplCodeAccessory: this.VendorObj.VendorCode,
        });
      }
    );
  }

  GetVendorEmpSupervisi() {
    this.http.post(this.getVendorEmpSupervisiUrl, this.vendorEmpObj).subscribe(
      (response) => {
        this.BranchManagerObj = response;
        if (this.BranchManagerObj.VendorEmpName != null) {
          this.AssetDataForm.patchValue({
            BranchManagerName: this.BranchManagerObj.VendorEmpName,
            BranchManagerNo: this.BranchManagerObj.VendorEmpNo,
            BranchManagerPositionCode: this.BranchManagerObj.MrVendorEmpPositionCode,
          });
          this.BranchManagerName = this.BranchManagerObj.VendorEmpName;
        }
        else {
          this.AssetDataForm.patchValue({
            BranchManagerName: "-",
            BranchManagerNo: "-",
            BranchManagerPositionCode: "-",
          });
          this.BranchManagerName = "-";
        }

      }
    );
  }

  async GetListAddr() {
    this.appObj.AppId = this.AppId;
    await this.http.post(this.getAppCustAddrUrl, this.appObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response["ReturnObject"];
        this.AddrLegalObj = this.AppCustAddrObj.filter(
          emp => emp.MrCustAddrTypeCode === AdInsConstant.AddrTypeLegal);
      }
    );
  }

  copyToOwnerAddr() {
    this.AddrObj = this.AppCustAddrObj.filter(
      emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForOwner);

    this.AssetDataForm.patchValue({
      OwnerAddr: this.AddrObj[0].Addr,
      OwnerAreaCode1: this.AddrObj[0].AreaCode1,
      OwnerAreaCode2: this.AddrObj[0].AreaCode2,
      OwnerAreaCode3: this.AddrObj[0].AreaCode3,
      OwnerAreaCode4: this.AddrObj[0].AreaCode4,
      OwnerCity: this.AddrObj[0].City,
      OwnerZipcode: this.AddrObj[0].Zipcode
    });
    this.ownerAddrObj = new AddrObj();
    this.ownerAddrObj.Addr = this.AddrObj[0].Addr;
    this.ownerAddrObj.AreaCode1 = this.AddrObj[0].AreaCode1;
    this.ownerAddrObj.AreaCode2 = this.AddrObj[0].AreaCode2;
    this.ownerAddrObj.AreaCode3 = this.AddrObj[0].AreaCode3;
    this.ownerAddrObj.AreaCode4 = this.AddrObj[0].AreaCode4;
    this.ownerAddrObj.City = this.AddrObj[0].City;
    this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AssetDataForm.controls.OwnerZipcode.value;
    this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AssetDataForm.controls.OwnerZipcode.value };
  }

  copyToLocationAddr() {
    this.AddrObj = this.AppCustAddrObj.filter(
      emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForLocation);

    this.AssetDataForm.patchValue({
      LocationAddr: this.AddrObj[0].Addr,
      LocationAreaCode1: this.AddrObj[0].AreaCode1,
      LocationAreaCode2: this.AddrObj[0].AreaCode2,
      LocationAreaCode3: this.AddrObj[0].AreaCode3,
      LocationAreaCode4: this.AddrObj[0].AreaCode4,
      LocationCity: this.AddrObj[0].City,
      LocationZipcode: this.AddrObj[0].Zipcode
    });
    this.locationAddrObj = new AddrObj();
    this.locationAddrObj.Addr = this.AddrObj[0].Addr;
    this.locationAddrObj.AreaCode1 = this.AddrObj[0].AreaCode1;
    this.locationAddrObj.AreaCode2 = this.AddrObj[0].AreaCode2;
    this.locationAddrObj.AreaCode3 = this.AddrObj[0].AreaCode3;
    this.locationAddrObj.AreaCode4 = this.AddrObj[0].AreaCode4;
    this.locationAddrObj.City = this.AddrObj[0].City;

    this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.AssetDataForm.controls.LocationZipcode.value;
    this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AssetDataForm.controls.LocationZipcode.value };

  }

  CheckValue() {
    this.allAssetDataObj = new AllAssetDataObj();
    this.setAllAssetObj();
    console.log(this.allAssetDataObj);
    console.log(this.AssetDataForm);
    console.log(this.appAssetId);
  }
  SetLocationAddrType(event) {
    this.copyFromAppCustAddrForLocation = event;
  }

  SetOwnerAddrType(event) {
    this.copyFromAppCustAddrForOwner = event;
  }

  async GetAppCust() {
    var appObj = {
      AppId: this.AppId,
    };
    await this.http.post(this.getAppCustUrl, appObj).toPromise().then(
      (response) => {
        this.AppCustObj = response;
        console.log(response);
        this.CustType = this.AppCustObj.MrCustTypeCode;
      }
    );
  }

  async GetRefProdCompt() {
    var appObj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      RefProdCompntCode: "ASSETTYPE",
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion,
    };
    await this.http.post(AdInsConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
      (response) => {
        this.RefProdCmpt = response;
        console.log("AWWWWWW");
        console.log(response);
      }
    );
  }

  async GetAppCustCoy() {
    var appObj = {
      AppId: this.AppCustObj.AppCustId,
    };
    await this.http.post(AdInsConstant.GetAppCustCompanyByAppCustId, appObj).toPromise().then(
      (response) => {
        this.AppCustCoyObj = response;
        console.log(response);
      }
    );
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.AssetDataForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid)
    console.log(this.AssetDataForm);
  }

}
