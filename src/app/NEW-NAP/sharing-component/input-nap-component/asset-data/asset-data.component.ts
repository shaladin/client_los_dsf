import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, FormArray, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AllAssetDataObj } from 'app/shared/model/all-asset-data-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { AppAssetAccessoryObj } from 'app/shared/model/app-asset-accessory-obj.model';
import { AppDataObj } from 'app/shared/model/app-data-obj.model';
import { AppCollateralAccessoryObj } from 'app/shared/model/app-collateral-accessory-obj.model';
import { AppCollateralAttrObj } from '../../../../shared/model/app-collateral-attr-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppAssetAttrCustomObj } from 'app/shared/model/app-asset/app-asset-attr-custom.model';
import { AppAssetAttrObj } from 'app/shared/model/app-asset-attr-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { String } from 'typescript-string-operations';
import { CustomPatternObj } from 'app/shared/model/library/custom-pattern-obj.model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';
import { ResGetVendorEmpSpvByEmpNoObj, ResGetVendorEmpByVendorIdAndEmpNoObj } from 'app/shared/model/response/vendor-emp/res-vendor-emp.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj } from 'app/shared/model/request/vendor/req-vendor-emp.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ResGeneralSettingObj, ResListGeneralSettingObj } from 'app/shared/model/response/general-setting/res-general-setting-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/app-collateral-registration-obj.model';
import { AssetTypeSerialNoLabelObj } from 'app/shared/model/serial-no/asset-type-serial-no-label-obj.model';
import { ProdOfferingDObj } from 'app/shared/model/product/prod-offering-d-obj.model';
import { VendorEmpObj } from 'app/shared/model/vendor-emp.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { VendorObj } from 'app/shared/model/vendor-obj.model';
import { RefProvDistrictObj } from 'app/shared/model/ref-prov-district-obj.model';
import { AppCustCompanyObj } from 'app/shared/model/app-cust-company-obj.model';
import { ResAssetValidationRuleObj } from 'app/shared/model/rule/res-asset-validation-rule-obj.model';
import { ResponseJobDataPersonalObj } from 'app/shared/model/response-job-data-personal-obj.model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/app-cust-personal-job-data-obj.model';
import { ListAppCollateralDocObj } from 'app/shared/model/list-app-collateral-doc-obj.model';
import { AppCollateralDocObj } from 'app/shared/model/app-collateral-doc-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { RefAttrSettingObj } from 'app/shared/model/ref-attr-setting-obj.model';

@Component({
  selector: 'app-asset-data',
  templateUrl: './asset-data.component.html',
})

export class AssetDataComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Input() BizTemplateCode: string = "";
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  BranchManagerName: string = "-";
  inputFieldOwnerAddrObj: InputFieldObj;
  ownerAddrObj: AddrObj;
  inputFieldDelivAddrObj: InputFieldObj;
  delivAddrObj: AddrObj;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AddrObj;
  appAssetAccessoriesObjs: Array<AppAssetAccessoryObj>;
  appAssetId: number = 0;
  items: FormArray;
  SerialNoList: Array<AssetTypeSerialNoLabelObj>;
  isUsed: boolean = false;
  isAssetAttrReady: boolean = false;
  originalAppAssetAccessory: Array<AppAssetAccessoryObj>;
  salesSupervisor: string;
  priceAfterDiscount: number = 0;
  isListAsset: boolean = false;
  listAsset: Array<AllAssetDataObj> = new Array<AllAssetDataObj>();
  index: number = 0;
  units: number = 0;
  mode: string = "Add";
  deleteAppAssetObj: AppAssetObj = new AppAssetObj();
  IsIntegrator: boolean = false;
  indexChassis: number = 0;
  returnAppCollateralRegistObj: AppCollateralRegistrationObj;
  appCollateralRegistObj: AppCollateralRegistrationObj;
  isAddressObjDelvReady: boolean = false;
  isAddressObjLocReady: boolean = false;
  IsReady: boolean = false;
  listAppCollateralDocObj: ListAppCollateralDocObj = new ListAppCollateralDocObj();
  appCollateralDoc: AppCollateralDocObj = new AppCollateralDocObj();

  AssetDataForm = this.fb.group({
    /* AppAsset Value that in form*/
    FullAssetName: ['', [Validators.required, Validators.maxLength(1000)]],
    MrAssetConditionCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrAssetUsageCode: ['', [Validators.required, Validators.maxLength(50)]],
    SupplName: ['', Validators.maxLength(500)],
    AssetPriceAmt: ['', [Validators.required, Validators.min(0.01)]],
    DownPaymentAmt: ['', [Validators.required, Validators.min(0.01)]],
    DownPaymentPrctg: [0, [Validators.min(0.000001), Validators.max(100)]],
    AssetNotes: ['', [Validators.maxLength(4000)]],
    Color: ['', Validators.maxLength(50)],
    TaxIssueDt: [''],
    Discount: [0],
    ExpectedDelivDt: [],
    IsNeedReplacementCar: [false],
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],

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

    /*App Collateral Regist*/
    UserName: ['', Validators.maxLength(500)],
    MrUserRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
    OwnerName: ['', [Validators.required, Validators.maxLength(500)]],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    OwnerIdNo: ['', Validators.maxLength(50)],
    MrOwnerRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
    OwnerAddr: [''],
    OwnerAreaCode1: ['', Validators.maxLength(50)],
    OwnerAreaCode2: ['', Validators.maxLength(50)],
    OwnerAreaCode3: ['', Validators.maxLength(50)],
    OwnerAreaCode4: ['', Validators.maxLength(50)],
    OwnerCity: ['', Validators.maxLength(50)],
    OwnerZipcode: ['', Validators.maxLength(50)],
    OwnerMobilePhnNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
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
    OwnerProfessionCode: [''],
    MrOwnerTypeCode: [''],

    LocationAddrType: [''],
    DelivAddrType: [''],
    OwnerAddrType: [''],
    selectedDpType: ['', Validators.required],
    SelfUsage: [false],
    SelfOwner: [false],
    AssetAccessoriesObjs: this.fb.array([]),
    items: this.fb.array([]),
    AppAssetAttrObjs: this.fb.array([]),
    ListDoc: this.fb.array([])
  });

  CustType: string = "";
  AddrObj: Array<AppCustAddrObj> = new Array();
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  appObj = {
    Id: 0,
  };

  ProdOffAssetCondObj: ProdOfferingDObj;

  vendorObj = {
    VendorId: 0,
    VendorCode: "",
    MrVendorEmpPositionCodes: [CommonConstant.ADMIN_HEAD_JOB_CODE, CommonConstant.SALES_JOB_CODE, CommonConstant.BRANCH_MANAGER_JOB_CODE],
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

  vendorEmpBMObj = {
    VendorId: 0,
    VendorEmpId: 0,
    VendorEmpNo: "",
  };

  districtObj = {
    ProvDistrictCode: "",
  };

  allAssetDataObj: AllAssetDataObj;

  InputLookupSupplierObj: InputLookupObj;
  InputLookupCityIssuerObj: InputLookupObj = new InputLookupObj();
  InputLookupAssetObj: InputLookupObj;
  InputLookupSupplAccObj: InputLookupObj;
  InputLookupAccObj: InputLookupObj;
  InputLookupAccSupObj: InputLookupObj;
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();

  EmpObj: Array<VendorEmpObj>;
  AdminHeadObj: any;
  SalesPersonObj: any;
  BranchManagerObj: any;
  UserRelationObj: Array<KeyValueObj>;
  OwnerRelationObj: Array<KeyValueObj>;
  IdTypeObj: Array<KeyValueObj>;
  AssetUsageObj: Array<KeyValueObj>;
  AssetConditionObj: Array<KeyValueObj>;
  DpObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  AppObj: AppObj;
  VendorObj: VendorObj;
  AssetMasterObj: any;
  AppCustAddrObj: Array<AppCustAddrObj> = new Array();
  AddrLegalObj: Array<AppCustAddrObj> = new Array();
  AddrMailingObj: any;
  AddrResidenceObj: any;
  appAssetObj: any;
  DistrictObj: RefProvDistrictObj;
  VendorEmpSalesObj: ResGetVendorEmpByVendorIdAndEmpNoObj;
  VendorAdminHeadObj: ResGetVendorEmpByVendorIdAndEmpNoObj;
  VendorEmpBMObj: ResGetVendorEmpByVendorIdAndEmpNoObj;
  AppCustObj: any;
  AppCustPersonalJobData: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
  RefProdCmptAssetType: ProdOfferingDObj;
  RefProdCmptAssetCond: ProdOfferingDObj;
  RefProdCmptSupplSchm: ProdOfferingDObj;
  RefProdCmptAssetSchm: ProdOfferingDObj;
  RefProdCmptPurposeOfFinancing: ProdOfferingDObj;
  AppCustCoyObj: AppCustCompanyObj;
  CheckValidationObj: ResAssetValidationRuleObj;
  SetManuYearObj: ResAssetValidationRuleObj;
  SetDpObj: ResAssetValidationRuleObj;
  isValidOk: boolean = true;

  AssetConditionName: string = "";
  OfficeCode: string;
  DpTypeBefore: string = "";
  copyFromAppCustAddrForOwner: any;
  copyFromAppCustAddrForDelivery: any;
  copyFromAppCustAddrForLocation: any;
  appAssetAttrObjs: Array<AppAssetAttrCustomObj>;
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
  currentChassisNo: string = "";
  appData: AppDataObj;
  InputLookupAcceObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  InputLookupSupplObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  dictAccLookup: { [key: string]: any; } = {};
  dictSuppLookup: { [key: string]: any; } = {};
  isOnlookup: boolean = false;
  ListAttrAnswer = [];
  inputAddressObjForOwner: InputAddressObj;
  inputAddressObjForDeliv: InputAddressObj;
  inputAddressObjForLoc: InputAddressObj;
  isDiffWithRefAttr: boolean;
  serialNoIsRequired: boolean = false;

  generalSettingObj: GenericListByCodeObj = new GenericListByCodeObj();
  IntegratorCheckBySystemGsValue: string = "1";
  IsUseDigitalization: string;
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  IsSvcExist: boolean = false;
  SerialNoRegex: string;
  ListPattern: Array<CustomPatternObj> = new Array<CustomPatternObj>();
  LastRequestedDate: any = "";
  OwnerTypeObj: Array<KeyValueObj> = new Array();
  OwnerProfessionObj: Array<KeyValueObj> = new Array();
  RoundedAmt: number = 2;
  attrSettingObj: RefAttrSettingObj = new RefAttrSettingObj();
  readonly identifierAssetAttr: string = "AppAssetAttrObjs";

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
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
    this.isListAsset = true;

    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.showAllPhn = false;

    this.inputAddressObjForDeliv = new InputAddressObj();
    this.inputAddressObjForDeliv.showSubsection = false;
    this.inputAddressObjForDeliv.showAllPhn = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;

    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isRequired = false;
    this.InputLookupProfessionObj.isReady = true;

    this.items = this.AssetDataForm.get('items') as FormArray;
    this.isOnlookup = false;
    await this.GetAppData();
    await this.GetRefProdCompt();
    await this.GetAppCust();
    if (this.CustType == CommonConstant.CustTypeCompany) {
      await this.GetAppCustCoy();
    }else{
      await this.GetAppCustPersonalJobData();
    }
    await this.GetAppCustPhone();
    await this.bindAllRefMasterObj();
    await this.initLookup();
    this.locationAddrObj = new AddrObj();
    this.delivAddrObj = new AddrObj();
    this.ownerAddrObj = new AddrObj();
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldDelivAddrObj = new InputFieldObj();
    this.inputFieldDelivAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();

    await this.GetListAddr();
    this.AssetDataForm.removeControl("AssetAccessoriesObjs");
    this.AssetDataForm.addControl("AssetAccessoriesObjs", this.fb.array([]));

    if (this.BizTemplateCode === "OPL") {
      this.AssetDataForm.controls.DownPaymentAmt.clearValidators();
      this.AssetDataForm.controls.MrUserRelationshipCode.clearValidators();
      this.AssetDataForm.controls.MrOwnerRelationshipCode.clearValidators();
      this.AssetDataForm.controls.selectedDpType.clearValidators();
      this.AssetDataForm.controls.MrIdTypeCode.clearValidators();
      this.AssetDataForm.controls.OwnerName.clearValidators();
      await this.getListAllAssetData();
    }
    else {
      await this.getAllAssetData();
    }

    await this.SetRefAttrSettingObj();
    let appObj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    appObj.ProdOfferingCode = this.AppObj.ProdOfferingCode,
    appObj.RefProdCompntCode = CommonConstant.RefProdCompntAssetCond,
    appObj.ProdOfferingVersion = this.AppObj.ProdOfferingVersion,

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
      (response: any) => {
        this.RefProdCmptAssetCond = response;
        if(this.mode != "Edit"){
          if (this.RefProdCmptAssetCond.CompntValue == "USED") {
            this.isUsed = true;
          } else {
            this.isUsed = false;
          }
        }
      }
    );

    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSSerialNoRegex }).toPromise().then(
      (response: GeneralSettingObj) => {
        this.SerialNoRegex = response.GsValue;

        let obj: CustomPatternObj = {
          pattern: this.SerialNoRegex,
          invalidMsg: "Cannot input special character"
        }
        this.ListPattern.push(obj);
      }
    )

    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: this.RefProdCmptAssetType.CompntValue }).subscribe(
      (response: any) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }

        this.SerialNoList = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.SerialNoList.length; i++) {
          let eachDataDetail = this.fb.group({
            SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
            SerialNoValue: ['', [Validators.pattern(this.SerialNoRegex)]],
            IsMandatory: [this.SerialNoList[i].IsMandatory]
          }) as FormGroup;
          this.items.push(eachDataDetail);
        }

        if(this.isUsed){
          for (let i = 0; i < this.items.length; i++) {
            if (this.items.controls[i]['controls']['IsMandatory'].value == true) {
              this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required, Validators.pattern(this.SerialNoRegex)]);
              this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
            }
          }
        }

        if (this.appAssetObj.ResponseAppAssetObj != null) {
          for (let i = 0; i < this.items.length; i++) {
            if (this.items.controls[i] != null) {
              this.items.controls[i]['controls']['SerialNoValue'].value = this.appAssetObj.ResponseAppAssetObj["SerialNo" + (i + 1)];
              if (this.items.controls[i]["controls"]["SerialNoLabel"].value == "Chassis No") {
                this.indexChassis = i;
              }
            }
          }
        }
        this.SetValidatorItemsSerialNo(this.serialNoIsRequired);
      });
    await this.GetGS();
  }

  AddAsset() {
    this.mode = "Add";
    this.salesSupervisor = "";
    this.InputLookupSupplierObj.jsonSelect = null;
    this.InputLookupSupplierObj.nameSelect = "";

    this.InputLookupAssetObj.jsonSelect = null;
    this.InputLookupAssetObj.nameSelect = "";

    this.InputLookupCityIssuerObj.jsonSelect = null;
    this.InputLookupCityIssuerObj.nameSelect = "";

    this.inputAddressObjForDeliv.showSubsection = false;
    this.inputAddressObjForDeliv.showAllPhn = false;
    this.inputFieldDelivAddrObj.inputLookupObj.nameSelect = "";
    this.inputFieldDelivAddrObj.inputLookupObj.jsonSelect = null;
    this.inputAddressObjForDeliv.default = null;
    this.inputAddressObjForDeliv.inputField = this.inputFieldDelivAddrObj;

    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;
    this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = "";
    this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = null;
    this.inputAddressObjForLoc.default = null;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;

    this.AdminHeadObj = null;
    this.SalesPersonObj = null;
    this.BranchManagerObj = null;

    this.AssetDataForm.patchValue({
      MrAssetConditionCode: "",
      MrAssetUsageCode: "",
      ManufacturingYear: "",
      AssetPriceAmt: "",
      Discount: 0,
      ExpectedDelivDt: "",
      IsNeedReplacementCar: false,
      AssetNotes: "",
      Color: "",
      SalesPersonId: "",
      AdminHeadId: "",
      BranchManagerId: ""
    });

    this.AssetDataForm.removeControl("AssetAccessoriesObjs");
    this.AssetDataForm.addControl("AssetAccessoriesObjs", this.fb.array([]));

    let appAttrObjs = this.AssetDataForm.controls["AppAssetAttrObjs"] as FormArray;
    for (let i = 0; i < appAttrObjs.value.length; i++) {
      appAttrObjs.controls[i].patchValue({
        AttrValue: ""
      });
    }

    this.isListAsset = false;
  }

  Edit(index: any) {
    this.mode = "Edit";
    this.index = index;

    this.allAssetDataObj = this.listAsset[this.index];

    this.InputLookupSupplierObj.jsonSelect = null;
    this.InputLookupSupplierObj.nameSelect = this.allAssetDataObj.AppAssetObj.SupplName;

    this.InputLookupAssetObj.jsonSelect = null;
    this.InputLookupAssetObj.nameSelect = this.allAssetDataObj.AppAssetObj.FullAssetName;

    this.InputLookupCityIssuerObj.jsonSelect = null;
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

    this.AdminHeadObj = this.allAssetDataObj.AppAssetSupplEmpAdminObj;
    this.SalesPersonObj = this.allAssetDataObj.AppAssetSupplEmpSalesObj;
    this.BranchManagerObj = this.allAssetDataObj.AppAssetSupplEmpManagerObj;

    this.AssetDataForm.patchValue({
      MrAssetConditionCode: this.allAssetDataObj.AppAssetObj.MrAssetConditionCode,
      MrAssetUsageCode: this.allAssetDataObj.AppAssetObj.MrAssetUsageCode,
      ManufacturingYear: this.allAssetDataObj.AppAssetObj.ManufacturingYear,
      AssetPriceAmt: this.allAssetDataObj.AppAssetObj.AssetPriceAmt,
      Discount: this.allAssetDataObj.AppAssetObj.Discount,
      ExpectedDelivDt: this.allAssetDataObj.AppAssetObj.ExpectedDelivDt,
      IsNeedReplacementCar: this.allAssetDataObj.AppAssetObj.IsNeedReplacementCar,
      AssetNotes: this.allAssetDataObj.AppAssetObj.AssetNotes,
      Color: this.allAssetDataObj.AppAssetObj.Color,
      SalesPersonId: this.allAssetDataObj.VendorEmpId,
      AdminHeadId: this.allAssetDataObj.AppAssetSupplEmpAdminObj.VendorEmpId,
      BranchManagerId: this.allAssetDataObj.AppAssetSupplEmpManagerObj.VendorEmpId
    });
    this.setValidatorBpkb();

    this.priceAfterDiscount = this.allAssetDataObj.AppAssetObj.AssetPriceAmt - this.allAssetDataObj.AppAssetObj.Discount;

    this.AssetDataForm.removeControl("AssetAccessoriesObjs");
    this.AssetDataForm.addControl("AssetAccessoriesObjs", this.fb.array([]));
    for (let i = 0; i < this.allAssetDataObj.AppAssetAccessoryObjs.length; i++) {
      let appAccessoryObjs = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
      appAccessoryObjs.push(this.addGroup(this.allAssetDataObj.AppAssetAccessoryObjs[i], i));

      let InputLookupAccObj = this.initLookupAcc();
      let InputLookupAccSupObj = this.initLookupSuppAcc();
      this.dictAccLookup[i] = InputLookupAccObj;
      this.dictSuppLookup[i] = InputLookupAccSupObj;
      this.InputLookupAcceObjs.push(InputLookupAccObj);
      this.InputLookupSupplObjs.push(InputLookupAccSupObj);

      this.setAppAccessorySupplier(i, this.appAssetAccessoriesObjs[i].SupplCode);
      this.setAppAccessory(i, this.appAssetAccessoriesObjs[i].AssetAccessoryCode);
    }

    let appAttrObjs = this.AssetDataForm.controls["AppAssetAttrObjs"] as FormArray;
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
      this.deleteAppAssetObj.AppAssetId = this.allAssetDataObj.AppAssetObj.AppAssetId;
      this.deleteAppAssetObj.AppId = this.allAssetDataObj.AppAssetObj.AppId;
      this.http.post(URLConstant.DeleteAppAsset, this.deleteAppAssetObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.listAsset.splice(index, 1);
        }
      );
    }
  }

  ChangeAssetName(index: any) {
    this.index = index;
  }

  CopyAsset() {
    this.allAssetDataObj = this.listAsset[this.index];
    this.allAssetDataObj.BizTemplateCode = this.BizTemplateCode;
    this.allAssetDataObj.Copy = "Yes";
    this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        for (let i = 0; i < this.units; i++) {
          this.listAsset.push(this.listAsset[this.index]);
        }
      }
    );
  }

  updateValueAssetPrice() {
    let assetPriceAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    let discount = this.AssetDataForm.controls.Discount.value;
    this.priceAfterDiscount = assetPriceAmt - discount;
  }

  async GetGS() {
    this.generalSettingObj = new GenericListByCodeObj();
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization);

    await this.http.post<ResListGeneralSettingObj>(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).toPromise().then(
      (response) => {
        let returnGeneralSettingObj: Array<ResGeneralSettingObj> = new Array<ResGeneralSettingObj>();
        returnGeneralSettingObj = response['ResGetListGeneralSettingObj'];

        let gsNeedCheckBySystem = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        let gsUseDigitalization = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);

        if (gsNeedCheckBySystem != undefined) {
          this.IntegratorCheckBySystemGsValue = gsNeedCheckBySystem.GsValue;
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if (gsUseDigitalization != undefined) {
          this.IsUseDigitalization = gsUseDigitalization.GsValue;
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }

        if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0") {
          this.getDigitalizationSvcType();
          this.GetThirdPartyResultH();
        }
      }
    );
  }

  async SaveForm() {
    let assetForm = this.AssetDataForm.getRawValue();
    if (this.BizTemplateCode !== "OPL") {
      let confirmMsg = "";
      this.isValidOk = true;
      await this.CheckValidation();
      if (this.CheckValidationObj) {
        let sumAssetAccessories: number = 0;
        if(assetForm.AssetAccessoriesObjs.length > 0){
          sumAssetAccessories = assetForm.AssetAccessoriesObjs.map(x => x.AccessoryPriceAmt).reduce((acc, curr) => acc + curr);
        }

        if (this.AssetDataForm.controls.selectedDpType.value == 'PRCTG') {
          if (assetForm.DownPaymentPrctg < this.CheckValidationObj.DPMin) {
            this.isValidOk = false;
            confirmMsg = "Down Payment Percentage is Lower than Minimum Percentage";
          }
          else if (assetForm.DownPaymentPrctg > this.CheckValidationObj.DPMax) {
            this.isValidOk = false;
            confirmMsg = "Down Payment Percentage is Higher than Maximum Percentage";
          }
        }
        else {
          let assetDPMin = (this.CheckValidationObj.DPMin / 100) * (assetForm.AssetPriceAmt + sumAssetAccessories);
          let assetDPMax = (this.CheckValidationObj.DPMax / 100) * assetForm.AssetPriceAmt;
          if (assetForm.DownPaymentAmt < assetDPMin) {
            this.isValidOk = false;
            confirmMsg = "Down Payment Amount is Lower than Minimum Amount";
          }
          else if (assetForm.DownPaymentAmt > assetDPMax) {
            this.isValidOk = false;
            confirmMsg = "Down Payment Amount is Higher than Maximum Amount";
          }
        }

        if (this.CheckValidationObj.Behaviour == CommonConstant.RuleBehaviourLock) {
          if (this.CheckValidationObj.MinManufYear > this.AssetDataForm.get("ManufacturingYear").value) {
            this.toastr.warningMessage(ExceptionConstant.MANUFACTURING_YEAR_CAN_NOT_LESS_THAN + this.CheckValidationObj.MinManufYear);
            return false;
          }
        }
        if (this.CheckValidationObj.MinManufYear > this.AssetDataForm.get("ManufacturingYear").value) {
          if (confirmMsg != "") confirmMsg += "\n"
          this.isValidOk = false;
          confirmMsg += ExceptionConstant.MANUFACTURING_YEAR_IS_LESS_THAN + this.CheckValidationObj.MinManufYear;
        }

        if (!this.isValidOk) {
          confirmMsg += ", Are You Sure to Save This Data ?";
          let confirmation = confirm(confirmMsg);
          if (!confirmation) {
            return false;
          }
        }
      }
    }

    this.allAssetDataObj = new AllAssetDataObj();
    await this.setAllAssetObj();
    this.allAssetDataObj.BizTemplateCode = this.BizTemplateCode;
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
                if (newAcc.DownPaymentPrcnt != oriAcc.DownPaymentPrcnt || newAcc.DownPaymentAmt != oriAcc.DownPaymentAmt) {
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

    if (this.BizTemplateCode !== "OPL") {
      if (this.appAssetObj.ResponseAppAssetObj != null && this.appAssetObj.ResponseAppAssetObj != undefined) {
        this.allAssetDataObj.AppCollateralObj.RowVersion = this.appAssetObj.ResponseAppCollateralObj.RowVersion;
        if (this.appAssetObj.ResponseAppCollateralRegistrationObj != null) this.allAssetDataObj.AppCollateralRegistrationObj.RowVersion = this.appAssetObj.ResponseAppCollateralRegistrationObj.RowVersion;
        this.allAssetDataObj.AppAssetObj.RowVersion = this.appAssetObj.ResponseAppAssetObj.RowVersion;
        if (this.appAssetObj.ResponseAdminHeadSupp != null) this.allAssetDataObj.AppAssetSupplEmpAdminObj.RowVersion = this.appAssetObj.ResponseAdminHeadSupp.RowVersion;
        if (this.appAssetObj.ResponseSalesPersonSupp != null) this.allAssetDataObj.AppAssetSupplEmpSalesObj.RowVersion = this.appAssetObj.ResponseSalesPersonSupp.RowVersion;
        if (this.appAssetObj.ResponseBranchManagerSupp != null) this.allAssetDataObj.AppAssetSupplEmpManagerObj.RowVersion = this.appAssetObj.ResponseBranchManagerSupp.RowVersion;
      }
      if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0" && this.IsSvcExist) {
        if (this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value == '' && this.IsIntegrator) {
          if (confirm("Chassis No not filled, submit data without Integrator ?")) {
            this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.outputTab.emit();
              }
            );
          }
        }
        else if (!this.IsIntegrator) {
          if (this.currentChassisNo == this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value) {
            this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.outputTab.emit();
              }
            );
          }
          else {
            if(this.allAssetDataObj.AppAssetObj.MrAssetConditionCode == CommonConstant.AssetConditionUsed){
              if (confirm("Submit data without Integrator ?")) {
                this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
                  (response) => {
                    this.toastr.successMessage(response["message"]);
                    this.outputTab.emit();
                  }
                );
              }
            }
            else{
              this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
                (response) => {
                  this.toastr.successMessage(response["message"]);
                  this.outputTab.emit();
                }
              );
            }
          }
        }
        else if (this.IsIntegrator) {
          this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDO, this.allAssetDataObj).subscribe(
                (response) => {
                });
              this.outputTab.emit();
            }
          );
        }
      }
      else {
        this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.isListAsset === true) {
              this.outputTab.emit();
            }
            else if (this.isListAsset === false) {
              if (this.mode === "Add") {
                this.listAsset.push(this.allAssetDataObj);
              }
              else if (this.mode === "Edit") {
                this.listAsset[this.index] = this.allAssetDataObj;
              }
              this.isListAsset = true;
            }
          }
        );
      }
    }
    else if (this.BizTemplateCode === "OPL") {
      this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          if (this.isListAsset === true) {
            this.outputTab.emit();
          }
          else if (this.isListAsset === false) {
            if (this.mode === "Add") {
              this.listAsset.push(this.allAssetDataObj);
            }
            else if (this.mode === "Edit") {
              this.listAsset[this.index] = this.allAssetDataObj;
            }
            this.isListAsset = true;
          }
        }
      );
    }
  }

  Cancel() {
    this.outputCancel.emit();
  }

  Back() {
    this.isListAsset = true;
  }

  Save() {
    this.toastr.successMessage("");
    this.outputTab.emit();
  }

  async GetThirdPartyResultH() {
    let ChassisNoValue = this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value;
    await this.http.post(URLConstant.GetAppAssetFromThirdPartyResultHByTrxTypeCodeAndTrxNoAndChassisNoForFraudChecking, { TrxNo: this.AppObj.AppNo, TrxTypeCode: "APP", ChassisNo: ChassisNoValue }).toPromise().then(
      (response) => {
        if (response["AppAssetObject"]["SerialNo1"] != null) {
          this.currentChassisNo = response["AppAssetObject"]["SerialNo1"];
        }
        if (response["ResponseThirdPartyRsltH"]["ThirdPartyRsltHId"] != null) {
          this.LastRequestedDate = response["ResponseThirdPartyRsltH"]["ReqDt"];
        }
      }
    );
  }

  async CheckValidation() {
    let CheckValidObj = {
      AppId: this.AppId,
      SupplCode: this.AssetDataForm.controls.SupplCode.value,
      FullAssetCode: this.AssetDataForm.controls.FullAssetCode.value,
      AssetCondition: this.AssetDataForm.controls.MrAssetConditionCode.value,
      ManufacturingYear: this.AssetDataForm.controls.ManufacturingYear.value,
      Tenor: this.AppObj.Tenor,
      AssetCategoryCode: this.AssetDataForm.controls.AssetCategoryCode.value,
      MrAssetUsageCode: this.AssetDataForm.controls.MrAssetUsageCode.value
    }
    await this.http.post(URLConstant.CheckAssetValidationRule, CheckValidObj).toPromise().then(
      (response: ResAssetValidationRuleObj) => {
        this.CheckValidationObj = response;
      },
      (error) => {
        this.isValidOk = false;
      }
    );
  }

  SetDpValue(mode: string = "add") {
    let CheckValidObj = {
      AppId: this.AppId,
      AssetCondition: this.AssetDataForm.controls.MrAssetConditionCode.value,
      ManufacturingYear: this.AssetDataForm.controls.ManufacturingYear.value,
      Tenor: this.AppObj.Tenor,
      AssetCategoryCode: this.AssetDataForm.controls.AssetCategoryCode.value,
      MrAssetUsageCode: this.AssetDataForm.controls.MrAssetUsageCode.value
    }
    this.http.post(URLConstant.CheckAssetValidationRule, CheckValidObj).subscribe(
      (response: ResAssetValidationRuleObj) => {
        this.SetDpObj = response;
        if (mode == "add") {
          this.AssetDataForm.patchValue({
            DownPaymentAmt: (this.SetDpObj.DPPrcnt / 100) * this.AssetDataForm.controls.AssetPriceAmt.value,
            DownPaymentPrctg: this.SetDpObj.DPPrcnt
          });
        }
        if (this.SetDpObj.DPBhv == CommonConstant.RuleBehaviourLock) {
          if (this.AssetDataForm.controls.selectedDpType.value == 'PRCTG') {
            this.AssetDataForm.controls.DownPaymentPrctg.disable();
          }
          else {
            this.AssetDataForm.controls.DownPaymentAmt.disable();
          }
        }
        else {
          if (this.AssetDataForm.controls.selectedDpType.value == 'PRCTG') {
            this.AssetDataForm.controls.DownPaymentPrctg.enable();
          }
          else {
            this.AssetDataForm.controls.DownPaymentAmt.enable();
          }
        }
      });
  }

  SetMinManuYear() {
    let CheckValidObj = {
      AppId: this.AppId,
      SupplCode: this.AssetDataForm.controls.SupplCode.value,
      FullAssetCode: this.AssetDataForm.controls.FullAssetCode.value,
    }
    this.http.post(URLConstant.CheckAssetValidationRule, CheckValidObj).subscribe(
      (response: ResAssetValidationRuleObj) => {
        this.SetManuYearObj = response;
        this.AssetDataForm.patchValue({
          ManufacturingYear: this.SetManuYearObj.MinManufYear
        });
      });
  }

  ChangeManuYear() {
    if (this.AssetDataForm.controls.MrAssetConditionCode.value != '' && this.AssetDataForm.controls.MrAssetConditionCode.value != undefined && this.AssetDataForm.controls.ManufacturingYear.value != '' && this.AssetDataForm.controls.ManufacturingYear.value != undefined && this.AssetDataForm.controls.AssetCategoryCode.value != '' && this.AssetDataForm.controls.AssetCategoryCode.value != undefined && this.AssetDataForm.controls.MrAssetUsageCode.value != '' && this.AssetDataForm.controls.MrAssetUsageCode.value != undefined) {
      this.SetDpValue();
    }
  }

  async setAllAssetObj() {
    let assetForm = this.AssetDataForm.getRawValue();
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

    this.allAssetDataObj.AppAssetObj.MinDownPaymentPrcnt = this.CheckValidationObj && this.CheckValidationObj.DPMin ? this.CheckValidationObj.DPMin : 0;
    this.allAssetDataObj.AppAssetObj.MaxDownPaymentPrcnt = this.CheckValidationObj && this.CheckValidationObj.DPMax ? this.CheckValidationObj.DPMax : 0;
    this.allAssetDataObj.AppAssetObj.AssetNotes = this.AssetDataForm.controls.AssetNotes.value;
    this.allAssetDataObj.AppAssetObj.Color = this.AssetDataForm.controls.Color.value;
    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value.value;
    this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.AssetDataForm.controls.TaxIssueDt.value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls.ManufacturingYear.value;
    this.allAssetDataObj.AppAssetObj.Discount = this.AssetDataForm.controls.Discount.value;

    if (this.AssetDataForm.controls.ExpectedDelivDt.value !== null) {
      this.allAssetDataObj.AppAssetObj.ExpectedDelivDt = this.AssetDataForm.controls.ExpectedDelivDt.value;
    }
    if (this.AssetDataForm.controls.IsNeedReplacementCar.value !== null) {
      this.allAssetDataObj.AppAssetObj.IsNeedReplacementCar = this.AssetDataForm.controls.IsNeedReplacementCar.value;
    }

    this.allAssetDataObj.AppAssetObj.AssetSeqNo = this.AssetDataForm.controls.AssetSeqNo.value;
    
    await this.GetAssetMaster(this.AssetDataForm.controls.FullAssetCode.value, true);
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
    this.allAssetDataObj.AppAssetObj.IsCollateral = this.AssetDataForm.controls.IsCollateral.value;
    this.allAssetDataObj.AppAssetObj.IsInsurance = this.AssetDataForm.controls.IsInsurance.value;
    this.allAssetDataObj.AppAssetObj.IsEditableDp = this.AssetDataForm.controls.IsEditableDp.value;
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

    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value.value;
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

    this.allAssetDataObj.AppCollateralRegistrationObj.UserName = this.AssetDataForm.controls.UserName.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.AssetDataForm.controls.MrUserRelationshipCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerName = this.AssetDataForm.controls.OwnerName.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AssetDataForm.controls.MrIdTypeCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AssetDataForm.controls.OwnerIdNo.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.AssetDataForm.controls.MrOwnerRelationshipCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerProfessionCode = this.AssetDataForm.controls.OwnerProfessionCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrOwnerTypeCode = this.AssetDataForm.controls.MrOwnerTypeCode.value;

    if (this.BizTemplateCode !== "OPL") {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items.controls[i] != null) {
          this.allAssetDataObj.AppAssetObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
        }
      }

      this.allAssetDataObj.AppAssetObj.DownPaymentPrcnt = assetForm.DownPaymentPrctg;
      this.allAssetDataObj.AppAssetObj.DownPaymentAmt = assetForm.DownPaymentAmt;

      for (let i = 0; i < this.items.length; i++) {
        if (this.items.controls[i] != null) {
          this.allAssetDataObj.AppCollateralObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
        }
      }

      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AssetDataForm.controls["ownerData"]["controls"].Addr.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode1.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode2.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode3.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode4.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerCity = this.AssetDataForm.controls["ownerData"]["controls"].City.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AssetDataForm.controls["ownerDataZipcode"]["controls"].value.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AssetDataForm.controls.OwnerMobilePhnNo.value;
    }
    else if (this.BizTemplateCode === "OPL") {
      this.allAssetDataObj.AppCollateralRegistrationObj.DelivAddr = this.AssetDataForm.controls["delivData"]["controls"].Addr.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode1 = this.AssetDataForm.controls["delivData"]["controls"].AreaCode1.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode2 = this.AssetDataForm.controls["delivData"]["controls"].AreaCode2.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode3 = this.AssetDataForm.controls["delivData"]["controls"].AreaCode3.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.DelivAreaCode4 = this.AssetDataForm.controls["delivData"]["controls"].AreaCode4.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.DelivCity = this.AssetDataForm.controls["delivData"]["controls"].City.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.DelivZipcode = this.AssetDataForm.controls["delivDataZipcode"]["controls"].value.value;
    }

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
      let appAssetAccObj = new AppAssetAccessoryObj();
      let appCollateralAccObj = new AppCollateralAccessoryObj();
      appAssetAccObj.AssetAccessoryCode = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryCode;
      appAssetAccObj.AssetAccessoryName = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryName;
      appAssetAccObj.SupplCode = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].SupplCodeAccessory;
      appAssetAccObj.SupplName = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].SupplNameAccessory;
      appAssetAccObj.AccessoryPriceAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryPriceAmt;
      appAssetAccObj.DownPaymentPrcnt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.value;
      appAssetAccObj.DownPaymentAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.value;
      appAssetAccObj.AccessoryNotes = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryNotes;

      appCollateralAccObj.CollateralAccessoryCode = appAssetAccObj.AssetAccessoryCode;
      appCollateralAccObj.CollateralAccessoryName = appAssetAccObj.AssetAccessoryName;
      appCollateralAccObj.AccessoryPriceAmt = appAssetAccObj.AccessoryPriceAmt;
      appCollateralAccObj.DownPaymentAmt = appAssetAccObj.DownPaymentAmt;
      appCollateralAccObj.AccessoryNotes = appAssetAccObj.AccessoryNotes;

      this.allAssetDataObj.AppAssetAccessoryObjs.push(appAssetAccObj);
      this.allAssetDataObj.AppCollateralAccessoryObjs.push(appCollateralAccObj);
    }

    for (let i = 0; i < this.AssetDataForm.controls["AppAssetAttrObjs"].value.length; i++) {
      let appAssetAttrObj = new AppAssetAttrObj();
      let appCollAttrcObj = new AppCollateralAttrObj();
      appAssetAttrObj.AssetAttrCode = this.AssetDataForm.controls["AppAssetAttrObjs"].value[i].AttrCode;
      appAssetAttrObj.AssetAttrName = this.AssetDataForm.controls["AppAssetAttrObjs"].value[i].AttrName;
      appAssetAttrObj.AttrValue = this.AssetDataForm.controls["AppAssetAttrObjs"].value[i].AttrValue;

      appCollAttrcObj.CollateralAttrName = appAssetAttrObj.AssetAttrName;
      appCollAttrcObj.CollateralAttrCode = appAssetAttrObj.AssetAttrCode;
      appCollAttrcObj.AttrValue = appAssetAttrObj.AttrValue;

      this.allAssetDataObj.AppAssetAttrObj.push(appAssetAttrObj);
      this.allAssetDataObj.AppCollateralAttrObj.push(appCollAttrcObj);
    }

    this.listAppCollateralDocObj.AppCollateralDocObj = new Array();
    for (let i = 0; i < this.AssetDataForm.value.ListDoc["length"]; i++) {
      this.appCollateralDoc = new AppCollateralDocObj();
      if (this.AssetDataForm.value.ListDoc[i].IsReceived == null) {
        this.appCollateralDoc.IsReceived = false;
      }
      else {
        this.appCollateralDoc.IsReceived = this.AssetDataForm.value.ListDoc[i].IsReceived;
      }
      this.appCollateralDoc.DocCode = this.AssetDataForm.value.ListDoc[i].DocCode;
      this.appCollateralDoc.DocName = this.AssetDataForm.value.ListDoc[i].AssetDocName;
      this.appCollateralDoc.DocNo = this.AssetDataForm.value.ListDoc[i].DocNo;
      this.appCollateralDoc.ExpiredDt = this.AssetDataForm.value.ListDoc[i].ACDExpiredDt;
      this.appCollateralDoc.DocNotes = this.AssetDataForm.value.ListDoc[i].DocNotes;
      this.appCollateralDoc.RowVersion = this.AssetDataForm.value.ListDoc[i].RowVersion;
      this.listAppCollateralDocObj.AppCollateralDocObj.push(this.appCollateralDoc);
    }
    this.allAssetDataObj.ListAppCollateralDocObj = this.listAppCollateralDocObj.AppCollateralDocObj;
  }

  async SetSupplier(event) {
    this.AdminHeadObj = null;
    this.SalesPersonObj = null;
    this.BranchManagerObj = null;

    this.vendorObj.VendorCode = event.VendorCode;
    this.vendorObj.VendorId = event.VendorId;
    await this.GetVendor();
    this.GetVendorEmpList();
  }

  SetBpkbCity(event) {
    this.AssetDataForm.patchValue({
      TaxCityIssuer: {value: event.DistrictCode},
    });
  }

  async SetAsset(event) {
    this.AssetDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode
    });
    await this.GetAssetMaster(event.FullAssetCode);
    this.GetRefAssetDocList(false);
    if (this.BizTemplateCode != CommonConstant.OPL) {
      if (this.AssetDataForm.controls.SupplCode.value != undefined && this.AssetDataForm.controls.SupplCode.value != '') {
        this.SetMinManuYear()
      }
      if (this.AssetDataForm.controls.MrAssetConditionCode.value != '' && this.AssetDataForm.controls.MrAssetConditionCode.value != undefined && this.AssetDataForm.controls.ManufacturingYear.value != '' && this.AssetDataForm.controls.ManufacturingYear.value != undefined && this.AssetDataForm.controls.AssetCategoryCode.value != '' && this.AssetDataForm.controls.AssetCategoryCode.value != undefined && this.AssetDataForm.controls.MrAssetUsageCode.value != '' && this.AssetDataForm.controls.MrAssetUsageCode.value != undefined) {
        this.SetDpValue();
      }
    }
  }

  SalesPersonChanged(event) {
    if (event.target.value != "") {
      let temp: any;
      temp = this.EmpObj.filter(emp => emp.VendorEmpId == event.target.value);
      this.AssetDataForm.patchValue({
        SalesPersonId: temp[0].VendorEmpId,
        SalesPersonName: temp[0].VendorEmpName,
        SalesPersonNo: temp[0].VendorEmpNo,
        SalesPersonPositionCode: temp[0].MrVendorEmpPositionCode,
      });
    }
    else {
      this.AssetDataForm.patchValue({
        SalesPersonId: "",
        SalesPersonName: "",
        SalesPersonNo: "",
        SalesPersonPositionCode: "",
      });
    }
  }

  AdminHeadChanged(event) {
    if (event.target.value != "") {
      let tempId = event.target.value;
      let temp: any;
      temp = this.EmpObj.filter(
        emp => emp.VendorEmpId == tempId);
      this.AssetDataForm.patchValue({
        AdminHeadId: temp[0].VendorEmpId,
        AdminHeadName: temp[0].VendorEmpName,
        AdminHeadNo: temp[0].VendorEmpNo,
        AdminHeadPositionCode: temp[0].MrVendorEmpPositionCode,
      });
    }
    else {
      this.AssetDataForm.patchValue({
        AdminHeadId: "",
        AdminHeadName: "",
        AdminHeadNo: "",
        AdminHeadPositionCode: "",
      });
    }
  }

  BranchManagerChanged(event) {
    if (event.target.value != "") {
      let tempId = event.target.value;
      let temp: any;
      temp = this.EmpObj.filter(
        emp => emp.VendorEmpId == tempId);
      this.AssetDataForm.patchValue({
        BranchManagerId: temp[0].VendorEmpId,
        BranchManagerName: temp[0].VendorEmpName,
        BranchManagerNo: temp[0].VendorEmpNo,
        BranchManagerPositionCode: temp[0].MrVendorEmpPositionCode,
      });
    }
    else {
      this.AssetDataForm.patchValue({
        BranchManagerId: "",
        BranchManagerName: "",
        BranchManagerNo: "",
        BranchManagerPositionCode: "",
      });
    }
  }

  DpTypeChange() {
    if (this.AssetDataForm.controls.selectedDpType.value != '') {
      if (this.AssetDataForm.controls.selectedDpType.value == 'AMT' && this.DpTypeBefore == 'PRCTG') {
        this.AssetDataForm.patchValue({
          DownPaymentAmt: this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100
        });
        this.AssetDataForm.controls["DownPaymentAmt"].updateValueAndValidity();
      }
      else if (this.AssetDataForm.controls.selectedDpType.value == 'PRCTG' && this.DpTypeBefore == 'AMT') {
        if (this.AssetDataForm.controls.AssetPriceAmt.value == 0) {
          this.AssetDataForm.patchValue({
            DownPaymentAmt: this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100
          });
        }
        else {
          this.AssetDataForm.patchValue({
            DownPaymentPrctg: this.AssetDataForm.controls.DownPaymentAmt.value / this.AssetDataForm.controls.AssetPriceAmt.value * 100
          });
        }
        this.AssetDataForm.controls["DownPaymentPrctg"].updateValueAndValidity();
      };
      this.DpTypeBefore = this.AssetDataForm.controls.selectedDpType.value;
    }
  }
  updateValueDownPaymentAmt() {
    let DownPaymentPrctg = Math.round(this.AssetDataForm.controls.DownPaymentPrctg.value * 1000000) / 1000000;
    let DownPaymentAmt = this.AssetDataForm.controls.AssetPriceAmt.value * DownPaymentPrctg / 100;
    if (DownPaymentAmt > this.AssetDataForm.controls.AssetPriceAmt.value) {
      this.toastr.warningMessage("Down Payment Amount exceeded Asset Price Amount!");
      this.AssetDataForm.patchValue({
        DownPaymentAmt: 0,
        DownPaymentPrctg: 0
      });
    }
    else {
      this.AssetDataForm.patchValue({
        DownPaymentAmt: DownPaymentAmt
      });

      let roundedAmt = 0;
      if(this.RoundedAmt == 0){
        DownPaymentAmt = Math.round(this.AssetDataForm.controls.DownPaymentAmt.value);
      }else{
        roundedAmt = Math.pow(10, this.RoundedAmt);
        DownPaymentAmt = Math.round(this.AssetDataForm.controls.DownPaymentAmt.value * roundedAmt) / roundedAmt;
      }

      DownPaymentPrctg = Math.round((DownPaymentAmt / this.AssetDataForm.controls.AssetPriceAmt.value) * 100 * 1000000) / 1000000;
      this.AssetDataForm.patchValue({
        DownPaymentPrctg: DownPaymentPrctg
      });
    }
  }

  updateValueDownPaymentPrctg() {
    let DownPaymentPrctg = Math.round(this.AssetDataForm.controls.DownPaymentAmt.value) / this.AssetDataForm.controls.AssetPriceAmt.value * 100;
    if(isNaN(DownPaymentPrctg)){
      this.AssetDataForm.patchValue({
        DownPaymentAmt: 0,
        DownPaymentPrctg: 0
      });
    }
    else if (DownPaymentPrctg > 100) {
      this.toastr.warningMessage("Down Payment Amount exceeded Asset Price Amount!");
      this.AssetDataForm.patchValue({
        DownPaymentAmt: 0,
        DownPaymentPrctg: 0
      });
    }
      else {
        this.AssetDataForm.patchValue({
          DownPaymentPrctg: DownPaymentPrctg
        });

        DownPaymentPrctg = Math.round(DownPaymentPrctg * 1000000) / 1000000;

        this.AssetDataForm.patchValue({
          DownPaymentPrctg: DownPaymentPrctg
        });
      }
  }

  async SelfUsageChange(event) {
    if (event.checked == true) {
      this.AssetDataForm.patchValue({
        UserName: this.AppCustObj.CustName,
        MrUserRelationshipCode: "SELF",
      });

      this.AssetDataForm.controls.UserName.clearValidators();
      this.AssetDataForm.controls.UserName.updateValueAndValidity();
      this.AssetDataForm.controls.MrUserRelationshipCode.clearValidators();
      this.AssetDataForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.AssetDataForm.controls["UserName"].disable();
      this.AssetDataForm.controls["MrUserRelationshipCode"].disable();
    };
    if (event.checked == false) {
      this.AssetDataForm.controls.UserName.setValidators([Validators.required, Validators.maxLength(500)]);
      this.AssetDataForm.controls.UserName.updateValueAndValidity();
      this.AssetDataForm.controls.MrUserRelationshipCode.setValidators([Validators.required, Validators.maxLength(50)]);
      this.AssetDataForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.AssetDataForm.controls["UserName"].enable();
      this.AssetDataForm.controls["MrUserRelationshipCode"].enable();
    };
  }

  async SelfOwnerChange(isEdit: boolean = false, OwnerType: string = this.CustType, isFromOnInit:boolean=false) {
    let isChecked: boolean = this.AssetDataForm.get("SelfOwner").value;
    if (isChecked == true) {

      if(!isFromOnInit)
      {
        this.AssetDataForm.patchValue({
          OwnerName: this.AppCustObj.CustName,
          MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
          OwnerIdNo: this.AppCustObj.IdNo,
          MrOwnerRelationshipCode: CommonConstant.SelfCustomer,
          OwnerAddr: this.AddrLegalObj[0].Addr,
          OwnerAreaCode1: this.AddrLegalObj[0].AreaCode1,
          OwnerAreaCode2: this.AddrLegalObj[0].AreaCode2,
          OwnerAreaCode3: this.AddrLegalObj[0].AreaCode3,
          OwnerAreaCode4: this.AddrLegalObj[0].AreaCode4,
          OwnerCity: this.AddrLegalObj[0].City,
          OwnerZipcode: this.AddrLegalObj[0].Zipcode,
          OwnerMobilePhnNo: typeof (this.AppCustObj.MobilePhnNo1) != 'undefined' ? this.AppCustObj.MobilePhnNo1 : '',
          OwnerAddrType: !isEdit ? CommonConstant.AddrTypeLegal : "",
          MrOwnerTypeCode: OwnerType
        });
      }

      if (!isEdit) {
        this.AssetDataForm.patchValue({
          OwnerProfessionCode: OwnerType == CommonConstant.CustTypePersonal ? this.AppCustPersonalJobData.MrProfessionCode : this.AppCustCoyObj.MrCompanyTypeCode
        });
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
        this.inputAddressObjForOwner.default = this.ownerAddrObj;
        this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
        this.InputLookupProfessionObj.nameSelect = this.AppCustPersonalJobData.MrProfessionName;
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: this.AppCustPersonalJobData.MrProfessionName };
      }

      this.inputFieldOwnerAddrObj.inputLookupObj.isDisable = true;
      this.InputLookupProfessionObj.isDisable = true;
      this.AssetDataForm.controls["OwnerName"].disable();
      this.AssetDataForm.controls["MrIdTypeCode"].disable();
      this.AssetDataForm.controls["OwnerIdNo"].disable();
      this.AssetDataForm.controls["MrOwnerRelationshipCode"].disable();
      this.AssetDataForm.controls["OwnerMobilePhnNo"].disable();
      this.AssetDataForm.controls["ownerData"].disable();
      this.AssetDataForm.controls["OwnerAddrType"].disable();
      this.AssetDataForm.controls["OwnerProfessionCode"].disable();
      this.AssetDataForm.controls["MrOwnerTypeCode"].disable();
    }
    else {
      this.inputFieldOwnerAddrObj.inputLookupObj.isDisable = false;
      this.InputLookupProfessionObj.isDisable = false;
      this.AssetDataForm.controls["OwnerName"].enable();
      this.AssetDataForm.controls["MrIdTypeCode"].enable();
      this.AssetDataForm.controls["OwnerIdNo"].enable();
      this.AssetDataForm.controls["MrOwnerRelationshipCode"].enable();
      this.AssetDataForm.controls["OwnerMobilePhnNo"].enable();
      this.AssetDataForm.controls["ownerData"].enable();
      this.AssetDataForm.controls["OwnerAddrType"].enable();
      this.AssetDataForm.controls["OwnerProfessionCode"].enable();
      this.AssetDataForm.controls["MrOwnerTypeCode"].enable();
    };
  }

  async getAllAssetData() {
    this.appData = new AppDataObj();
    this.appData.AppId = this.AppId;
    let appData = { Id: this.AppId };
    await this.http.post(URLConstant.GetAllAssetDataByAppId, appData).toPromise().then(
      async (response) => {
        this.appAssetObj = response;

        if (this.appAssetObj.ResponseAppAssetObj != null) {
          this.mode = "Edit";
          this.appCollateralRegistObj = new AppCollateralRegistrationObj();
          this.appCollateralRegistObj.AppCollateralId = this.appAssetObj['ResponseAppCollateralObj']['AppCollateralId'];
          this.http.post(URLConstant.GetAppCollateralRegistrationByAppCollateralId, this.appCollateralRegistObj).subscribe(
            (response: any) => {
              this.returnAppCollateralRegistObj = response;
            });


          let mode = this.appAssetObj.ResponseAppAssetObj.AppAssetId != 0 ? "edit" : "add";
          this.AssetDataForm.patchValue({
            FullAssetCode: this.appAssetObj.ResponseAppAssetObj.FullAssetCode,
            FullAssetName: this.appAssetObj.ResponseAppAssetObj.FullAssetName,
            MrAssetConditionCode: this.appAssetObj.ResponseAppAssetObj.MrAssetConditionCode,
            MrAssetUsageCode: this.appAssetObj.ResponseAppAssetObj.MrAssetUsageCode,
            SupplName: this.appAssetObj.ResponseAppAssetObj.SupplName,
            SupplCode: this.appAssetObj.ResponseAppAssetObj.SupplCode,
            ManufacturingYear: this.appAssetObj.ResponseAppAssetObj.ManufacturingYear,
            AssetPriceAmt: this.appAssetObj.ResponseAppAssetObj.AssetPriceAmt,
            Discount: this.appAssetObj.ResponseAppAssetObj.Discount,
            ExpectedDelivDt: this.appAssetObj.ResponseAppAssetObj.ExpectedDelivDt,
            IsNeedReplacementCar: this.appAssetObj.ResponseAppAssetObj.IsNeedReplacementCar,
            DownPaymentAmt: this.appAssetObj.ResponseAppAssetObj.DownPaymentAmt,
            DownPaymentPrctg: this.appAssetObj.ResponseAppAssetObj.DownPaymentPrctg,
            AssetNotes: this.appAssetObj.ResponseAppAssetObj.AssetNotes,
            Color: this.appAssetObj.ResponseAppAssetObj.Color,
            TaxCityIssuer: {value: this.appAssetObj.ResponseAppAssetObj.TaxCityIssuer},
            AssetSeqNo: this.appAssetObj.ResponseAppAssetObj.AssetSeqNo,
            AssetStat: this.appAssetObj.ResponseAppAssetObj.AssetStat,
            AssetTypeCode: this.appAssetObj.ResponseAppAssetObj.AssetTypeCode,
            AssetCategoryCode: this.appAssetObj.ResponseAppAssetObj.AssetCategoryCode,
            IsCollateral: this.appAssetObj.ResponseAppAssetObj.IsCollateral,
            IsInsurance: this.appAssetObj.ResponseAppAssetObj.IsInsurance,
            IsEditableDp: this.appAssetObj.ResponseAppAssetObj.IsEditableDp,
            selectedDpType: 'AMT'
          });
          this.ChangeMrIdTypeCode(this.AssetDataForm.controls.MrIdTypeCode.value);
          this.setValidatorBpkb();


          if(this.mode == "Edit"){
            if(this.appAssetObj.ResponseAppAssetObj.MrAssetConditionCode == CommonConstant.AssetConditionUsed){
              this.isUsed = true;
            }else{
              this.isUsed = false;
            }
          }

          if (this.appAssetObj.ResponseAppAssetObj.TaxIssueDt != null) {
            this.AssetDataForm.patchValue({
              TaxIssueDt: formatDate(this.appAssetObj.ResponseAppAssetObj.TaxIssueDt, 'yyyy-MM-dd', 'en-US')
            });
          }

          if (this.appAssetObj.ResponseBranchManagerSupp != null) {
            this.AssetDataForm.patchValue({
              BranchManagerName: this.appAssetObj.ResponseBranchManagerSupp.SupplEmpName,
              BranchManagerNo: this.appAssetObj.ResponseBranchManagerSupp.SupplEmpNo,
              BranchManagerPositionCode: this.appAssetObj.ResponseBranchManagerSupp.MrSupplEmpPositionCode
            });
            this.BranchManagerName = this.appAssetObj.ResponseBranchManagerSupp.SupplEmpName;
          }

          if (this.appAssetObj.ResponseAdminHeadSupp != null) {
            this.AssetDataForm.patchValue({
              AdminHeadName: this.appAssetObj.ResponseAdminHeadSupp.SupplEmpName,
              AdminHeadNo: this.appAssetObj.ResponseAdminHeadSupp.SupplEmpNo,
              AdminHeadPositionCode: this.appAssetObj.ResponseAdminHeadSupp.MrSupplEmpPositionCode,
            })
          }

          if (this.appAssetObj.ResponseSalesPersonSupp != null) {
            this.AssetDataForm.patchValue({
              SalesPersonName: this.appAssetObj.ResponseSalesPersonSupp.SupplEmpName,
              SalesPersonNo: this.appAssetObj.ResponseSalesPersonSupp.SupplEmpNo,
              SalesPersonPositionCode: this.appAssetObj.ResponseSalesPersonSupp.MrSupplEmpPositionCode,
            });
          }

          if (this.appAssetObj.ResponseAppCollateralRegistrationObj != null) {

            let MrOwnerTypeCode = this.appAssetObj.ResponseAppCollateralRegistrationObj.MrOwnerTypeCode;
            let isFromDB = true;
            if (MrOwnerTypeCode == null){
              MrOwnerTypeCode = this.CustType;
              isFromDB = false;
            }

            this.AssetDataForm.patchValue({
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
              SelfUsage: (this.appAssetObj.ResponseAppCollateralRegistrationObj.MrUserRelationshipCode == "SELF"),
              SelfOwner: (this.appAssetObj.ResponseAppCollateralRegistrationObj.MrOwnerRelationshipCode == "SELF"),
              OwnerProfessionCode: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionCode,
              MrOwnerTypeCode: MrOwnerTypeCode
            });
            this.ChangeMrIdTypeCode(this.AssetDataForm.controls.MrIdTypeCode.value);
            await this.SelfUsageChange({checked : (this.appAssetObj.ResponseAppCollateralRegistrationObj.MrUserRelationshipCode == "SELF")});
            await this.SelfOwnerChange(true, MrOwnerTypeCode, true);
            await this.OwnerTypeChange(MrOwnerTypeCode, !isFromDB);
          }

          this.AssetConditionChanged(mode);
          this.appAssetAccessoriesObjs = this.appAssetObj.ResponseAppAssetAccessoryObjs;
          this.appAssetId = this.appAssetObj.ResponseAppAssetObj.AppAssetId;
          this.appAssetObj.RowVersion = this.appAssetObj.ResponseAppAssetObj.RowVersion;

          if (this.appAssetObj.ResponseAppCollateralRegistrationObj != null) {
            this.setAddrOwnerObj();
            this.setAddrDelivObj();
            this.setAddrLocationObj();
          }

          this.DpTypeBefore = "AMT";
          await this.GetAssetMaster(this.appAssetObj.ResponseAppAssetObj.FullAssetCode);
          this.GetRefAssetDocList(true);
          this.vendorObj.VendorCode = this.appAssetObj.ResponseAppAssetObj.SupplCode;
          this.GetVendorForView();
          this.districtObj.ProvDistrictCode = this.appAssetObj.ResponseAppAssetObj.TaxCityIssuer;
          this.GetProvDistrict();
          this.bindAccessories();
          this.updateValueDownPaymentPrctg();

          if (this.appAssetObj != null) {
            for (let i = 0; i < this.items.length; i++) {
              if (this.items.controls[i] != null) {
                this.items.controls[i]["controls"]["SerialNoValue"].value = this.appAssetObj["SerialNo" + (i + 1)];
              }
            }
          }
        }
      }
    );
  }

  async getListAllAssetData() {
    this.appData = new AppDataObj();
    this.appData.AppId = this.AppId;
    let appData = { Id: this.AppId };
    await this.http.post(URLConstant.GetListAllAssetDataByAppId, appData).toPromise().then(
      (response) => {
        this.appAssetObj = response[CommonConstant.ReturnObj];

        if (this.appAssetObj != null) {
          for (let i = 0; i < this.appAssetObj.length; i++) {
            this.allAssetDataObj = new AllAssetDataObj();

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

            if (this.appAssetObj[i].ResponseAssetDataOplObj != null) {
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
              this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = "";
              this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = "";
              this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = "";
            }

            if (this.appAssetObj[i].ResponseAdminHeadSupp != null) {
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = this.appAssetObj[i].ResponseAdminHeadSupp.SupplEmpName;
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = this.appAssetObj[i].ResponseAdminHeadSupp.SupplEmpNo;
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = this.appAssetObj[i].ResponseAdminHeadSupp.MrSupplEmpPositionCode;
            }
            else {
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = "";
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = "";
              this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = "";
            }

            if (this.appAssetObj[i].ResponseSalesPersonSupp != null) {
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName = this.appAssetObj[i].ResponseSalesPersonSupp.SupplEmpName;
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo = this.appAssetObj[i].ResponseSalesPersonSupp.SupplEmpNo;
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode = this.appAssetObj[i].ResponseSalesPersonSupp.MrSupplEmpPositionCode;
            }
            else {
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName = "";
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo = "";
              this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode = "";
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
            if (this.appAssetObj[i].ResponseAppAssetAccessoryObjs != null) {
              for (let j = 0; j < this.appAssetObj[i].ResponseAppAssetAccessoryObjs.length; j++) {
                let appAssetAccObj = new AppAssetAccessoryObj();
                let appCollateralAccObj = new AppCollateralAccessoryObj();
                appAssetAccObj.AssetAccessoryCode = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].AssetAccessoryCode;
                appAssetAccObj.AssetAccessoryName = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].AssetAccessoryName;
                appAssetAccObj.SupplCode = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].SupplCode;
                appAssetAccObj.SupplName = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].SupplName;
                appAssetAccObj.AccessoryPriceAmt = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].AccessoryPriceAmt;
                appAssetAccObj.DownPaymentPrcnt = this.appAssetObj[i].ResponseAppAssetAccessoryObjs[j].AccessoryDownPaymentPrcnt;
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
                let appAssetAttrObj = new AppAssetAttrObj();
                let appCollAttrcObj = new AppCollateralAttrObj();
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

  async initLookup() {
    this.InputLookupSupplierObj = this.initLookupSupp();

    this.InputLookupCityIssuerObj = new InputLookupObj();
    this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCityIssuerObj.pagingJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.genericJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.isRequired = false;
    let disCrit = new Array();
    let critDisObj = new CriteriaObj();
    critDisObj.DataType = 'text';
    critDisObj.restriction = AdInsConstant.RestrictionEq;
    critDisObj.propName = 'TYPE';
    critDisObj.value = 'DIS';
    disCrit.push(critDisObj);
    this.InputLookupCityIssuerObj.addCritInput = disCrit;

    if (this.BizTemplateCode !== CommonConstant.OPL) {
      this.AssetConditionChanged();
    }

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    let assetCrit = new Array();
    let critAssetObj = new CriteriaObj();
    critAssetObj.DataType = 'text';
    critAssetObj.restriction = AdInsConstant.RestrictionEq;
    critAssetObj.propName = 'B.ASSET_TYPE_CODE';
    critAssetObj.value = this.RefProdCmptAssetType.CompntValue;
    assetCrit.push(critAssetObj);

    let critAssetSchmObj = new CriteriaObj();
    critAssetSchmObj.DataType = 'text';
    critAssetSchmObj.restriction = AdInsConstant.RestrictionEq;
    critAssetSchmObj.propName = 'E.ASSET_SCHM_CODE';
    critAssetSchmObj.value = this.RefProdCmptAssetSchm.CompntValue;
    assetCrit.push(critAssetSchmObj);
    this.InputLookupAssetObj.addCritInput = assetCrit;


    this.InputLookupAccObj = this.initLookupAcc();
    this.isOnlookup = true;
  }

  initLookupAcc() {
    let arrAddCrit = new Array();
    if (this.AssetDataForm.get("AssetTypeCode").value != "") {
      let addCrit = new CriteriaObj();
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

  initLookupSupp() {
    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";
    let suppCrit = new Array();
    let critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'ro.OFFICE_CODE';
    critSuppObj.value = this.OfficeCode;
    suppCrit.push(critSuppObj);

    let critSuppSupplSchmObj = new CriteriaObj();
    critSuppSupplSchmObj.DataType = 'text';
    critSuppSupplSchmObj.restriction = AdInsConstant.RestrictionEq;
    critSuppSupplSchmObj.propName = 'vs.VENDOR_SCHM_CODE';
    critSuppSupplSchmObj.value = this.RefProdCmptSupplSchm.CompntValue;
    suppCrit.push(critSuppSupplSchmObj);
    this.InputLookupSupplierObj.addCritInput = suppCrit;

    return this.InputLookupSupplierObj;
  }

  initLookupSuppAcc() {
    this.InputLookupAccSupObj = new InputLookupObj();
    this.InputLookupAccSupObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupAccSupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupAccSupObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupAccSupObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";
    let suppCrit = new Array();
    let critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'ro.OFFICE_CODE';
    critSuppObj.value = this.OfficeCode;
    suppCrit.push(critSuppObj);

    let critSupp2Obj = new CriteriaObj();
    critSupp2Obj.DataType = 'text';
    critSupp2Obj.restriction = AdInsConstant.RestrictionEq;
    critSupp2Obj.propName = 'v.MR_VENDOR_CATEGORY_CODE';
    critSupp2Obj.value = 'SUPPLIER';
    suppCrit.push(critSupp2Obj);

    let critSuppSupplSchmObj = new CriteriaObj();
    critSuppSupplSchmObj.DataType = 'text';
    critSuppSupplSchmObj.restriction = AdInsConstant.RestrictionEq;
    critSuppSupplSchmObj.propName = 'vs.VENDOR_SCHM_CODE';
    critSuppSupplSchmObj.value = this.RefProdCmptSupplSchm.CompntValue;
    suppCrit.push(critSuppSupplSchmObj);
    this.InputLookupAccSupObj.addCritInput = suppCrit;

    return this.InputLookupAccSupObj;
  }

  async bindAllRefMasterObj() {
    await this.bindAssetUsageObj();
    await this.bindIdTypeObj();
    await this.bindUserOwnerRelationshipObj();
    await this.bindAsseConditionObj();
    await this.bindDownPaymentTypeObj();
    await this.bindOwnerTypeObj();
    await this.bindCompanyTypeObj();
  }

  setValidatorBpkb() {
    let MrAssetConditionCode: string = this.AssetDataForm.controls.MrAssetConditionCode.value;
    if (MrAssetConditionCode == 'USED') {
      this.AssetDataForm.controls.TaxIssueDt.setValidators(Validators.required);
      this.InputLookupCityIssuerObj.isRequired = true;
    } else {
      this.AssetDataForm.controls.TaxIssueDt.clearValidators();
      this.InputLookupCityIssuerObj.isRequired = false;
    }
    this.AssetDataForm.controls.TaxIssueDt.updateValueAndValidity();
  }

  async bindAssetUsageObj() {
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = this.RefProdCmptPurposeOfFinancing.CompntValue;
    await this.http.post(URLConstant.GetListKeyValueAssetUsageByPurposeOfFinCode, reqByCode).subscribe(
      (response) => {
        this.AssetUsageObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async bindAsseConditionObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetCondition;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.AssetConditionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async bindIdTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async bindDownPaymentTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeDownPaymentType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.DpObj = response[CommonConstant.ReturnObj];
        this.IsReady = true;
      }
    );
  }

  async bindUserOwnerRelationshipObj() {
    if (this.CustType == CommonConstant.CustTypePersonal) {
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    }
    else {
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
    }
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.UserRelationObj = response[CommonConstant.ReturnObj];
        this.OwnerRelationObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async GetAppData() {
    this.appObj.Id = this.AppId;
    await this.http.post(URLConstant.GetAppById, this.appObj).toPromise().then(
      (response: any) => {
        this.AppObj = response;
        this.getRoundedAmt();
        this.BizTemplateCode = this.AppObj.BizTemplateCode;
        this.OfficeCode = this.AppObj.OriOfficeCode;
        if (this.BizTemplateCode != CommonConstant.OPL) {
          this.GetProdOfferingAssetCond();
        }
      }
    );
  }

  GetProdOfferingAssetCond() {
    let obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    obj.ProdOfferingCode = this.AppObj.ProdOfferingCode;
    obj.RefProdCompntCode = CommonConstant.RefProdCompAssetCond;
    obj.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;

    this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, obj).subscribe(
      (response: any) => {
        this.ProdOffAssetCondObj = response;

        if(this.mode != "Edit"){
          this.AssetDataForm.patchValue({
            MrAssetConditionCode: this.ProdOffAssetCondObj.DDLRefProdComptCode[0].Key
          });
        }

        if(this.ProdOffAssetCondObj.DDLRefProdComptCode.length > 1){
          this.AssetDataForm.controls["MrAssetConditionCode"].enable();
        }else{
          this.AssetDataForm.controls["MrAssetConditionCode"].disable();
        }

        this.setValidatorBpkb();
      }
    );
  }

  GetProfession(event) {
    this.AssetDataForm.patchValue({
      OwnerProfessionCode: event.ProfessionCode
    });
  }

  async GetVendor() {
    await this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.vendorObj.VendorCode }).toPromise().then(
      (response: any) => {
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
    await this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.vendorObj.VendorCode }).toPromise().then(
      (response: any) => {
        this.VendorObj = response;
        this.AssetDataForm.patchValue({
          SupplName: this.VendorObj.VendorName,
          SupplCode: this.VendorObj.VendorCode,
        });
        if (this.appAssetObj.ResponseAdminHeadSupp != null) {
          let GetVendorEmpAdminHead: GenericObj = new GenericObj();
          GetVendorEmpAdminHead.Id = this.VendorObj.VendorId;
          GetVendorEmpAdminHead.Code = this.appAssetObj.ResponseAdminHeadSupp.SupplEmpNo;
          this.GetVendorEmpAdminHead(GetVendorEmpAdminHead);
        }
        if (this.appAssetObj.ResponseSalesPersonSupp != null) {
          let GetVendorEmpSales: GenericObj = new GenericObj();
          GetVendorEmpSales.Id = this.VendorObj.VendorId;
          GetVendorEmpSales.Code = this.appAssetObj.ResponseSalesPersonSupp.SupplEmpNo;
          this.GetVendorEmpSalesPerson(GetVendorEmpSales);
        }
        if (this.appAssetObj.ResponseBranchManagerSupp != null) {
          let GetVendorEmpBM: GenericObj = new GenericObj();
          GetVendorEmpBM.Id = this.VendorObj.VendorId;
          GetVendorEmpBM.Code = this.appAssetObj.ResponseBranchManagerSupp.SupplEmpNo;
          this.GetVendorEmpBM(GetVendorEmpBM);
        }

        this.vendorObj.VendorId = this.VendorObj.VendorId;
        this.GetVendorEmpList();
        this.InputLookupSupplierObj.jsonSelect = this.VendorObj;
        this.InputLookupSupplierObj.nameSelect = this.VendorObj.VendorName;

      }
    );
  }

  GetProvDistrict() {
    this.http.post(URLConstant.GetRefProvDistrictByProvDistrictCode, { Code: this.districtObj.ProvDistrictCode }).subscribe(
      (response: any) => {
        this.DistrictObj = response;
        if(this.DistrictObj.RefProvDistrictId == 0) return;
        this.AssetDataForm.patchValue({
          TaxCityIssuer: this.DistrictObj.ProvDistrictCode
        });
        this.InputLookupCityIssuerObj.jsonSelect = this.DistrictObj;
        this.InputLookupCityIssuerObj.nameSelect = this.DistrictObj.ProvDistrictName;
      }
    );
  }

  GetVendorEmpSalesPerson(ReqGetVendorEmpSales: GenericObj) {
    this.http.post<ResGetVendorEmpByVendorIdAndEmpNoObj>(URLConstant.GetVendorEmpByVendorIdVendorEmpNo, ReqGetVendorEmpSales).subscribe(
      (response) => {
        this.VendorEmpSalesObj = response;
        this.AssetDataForm.patchValue({
          SalesPersonId: this.VendorEmpSalesObj.VendorEmpId
        });
        this.vendorEmpObj.VendorEmpId = this.VendorEmpSalesObj.VendorEmpId;
      }
    );
  }

  GetVendorEmpAdminHead(ReqGetVendorEmpAdminHead: GenericObj) {
    this.http.post<ResGetVendorEmpByVendorIdAndEmpNoObj>(URLConstant.GetVendorEmpByVendorIdVendorEmpNo, ReqGetVendorEmpAdminHead).subscribe(
      (response) => {
        this.VendorAdminHeadObj = response;
        this.AssetDataForm.patchValue({
          AdminHeadId: this.VendorAdminHeadObj.VendorEmpId
        });
      }
    );
  }

  GetVendorEmpBM(ReqGetVendorEmpBM: GenericObj) {
    this.http.post<ResGetVendorEmpByVendorIdAndEmpNoObj>(URLConstant.GetVendorEmpByVendorIdVendorEmpNo, ReqGetVendorEmpBM).subscribe(
      (response) => {
        this.VendorEmpBMObj = response;
        this.AssetDataForm.patchValue({
          BranchManagerId: this.VendorEmpBMObj.VendorEmpId
        });
      }
    );
  }

  GetVendorEmpList() {
    let ReqGetListActiveVendor: ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj = new ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj;
    ReqGetListActiveVendor.VendorId = this.vendorObj.VendorId;
    ReqGetListActiveVendor.MrVendorEmpPositionCodes = this.vendorObj.MrVendorEmpPositionCodes;
    this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, ReqGetListActiveVendor).subscribe(
      (response) => {
        this.EmpObj = response[CommonConstant.ReturnObj];

        for (let i = 0; i < this.EmpObj.length; i++) {
          if (this.EmpObj[i]["SupervisorId"] !== null) {
            let supervisor = {
              "VendorEmpId": this.EmpObj[i]["SupervisorId"]
            }
            this.http.post(URLConstant.GetVendorEmpByVendorEmpId, { Id: this.EmpObj[i]["SupervisorId"] }).subscribe(
              (response) => {
                this.salesSupervisor = response["VendorEmpName"];
              }
            )
            break;
          }
        }

        this.AdminHeadObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === CommonConstant.ADMIN_HEAD_JOB_CODE);
        this.SalesPersonObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === CommonConstant.SALES_JOB_CODE);
        this.BranchManagerObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === CommonConstant.BRANCH_MANAGER_JOB_CODE);
      }
    );
  }

  async GetAssetMaster(FullAssetCode: string, isFromSave: boolean = false) {
    await this.http.post(URLConstant.GetAssetMasterTypeByFullAssetCode, { Code: FullAssetCode }).toPromise().then(
      (response: any) => {
        this.AssetMasterObj = response;
        this.AssetDataForm.patchValue({
          FullAssetCode: this.AssetMasterObj.FullAssetCode,
          FullAssetName: this.AssetMasterObj.FullAssetName,
          AssetTypeCode: this.AssetMasterObj.AssetTypeCode,
          AssetCategoryCode: this.AssetMasterObj.AssetCategoryCode
        });

        if(!isFromSave){
          this.InputLookupAssetObj.jsonSelect = this.AssetMasterObj;
          this.InputLookupAssetObj.nameSelect = this.AssetMasterObj.FullAssetName;
        }
      }
    );
  }

  GetOwnerRelationship(){
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.OwnerRelationObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ UserRelationship: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );
  }

  AssetConditionChanged(mode: string = "add") {
    if (this.AssetConditionObj != null && this.AssetDataForm.controls.MrAssetConditionCode.value != "") {
      let filter: any;
      // this.AssetDataForm.patchValue({ //delete later
      //   MrAssetConditionCode : 'USED'
      // });
      filter = this.AssetConditionObj.filter(
        cond => cond.Key == this.AssetDataForm.controls.MrAssetConditionCode.value);
      this.AssetConditionName = filter[0].Value;
    }
    if (this.AssetDataForm.controls.MrAssetConditionCode.value != '' && this.AssetDataForm.controls.MrAssetConditionCode.value != undefined && this.AssetDataForm.controls.ManufacturingYear.value != '' && this.AssetDataForm.controls.ManufacturingYear.value != undefined && this.AssetDataForm.controls.AssetCategoryCode.value != '' && this.AssetDataForm.controls.AssetCategoryCode.value != undefined && this.AssetDataForm.controls.MrAssetUsageCode.value != '' && this.AssetDataForm.controls.MrAssetUsageCode.value != undefined) {
      this.SetDpValue(mode);
    }

    //let serialNoIsRequired: boolean = false;
    this.serialNoIsRequired = false;
    this.inputAddressObjForLoc.inputField.inputLookupObj.isRequired = true;
    this.inputAddressObjForLoc.isRequired = true;
    if (this.AssetDataForm.controls.MrAssetConditionCode.value == CommonConstant.AssetConditionUsed) {
      this.inputAddressObjForLoc.inputField.inputLookupObj.isRequired = false;
      this.inputAddressObjForLoc.isRequired = false;
      this.serialNoIsRequired = true;
    }
    this.SetValidatorItemsSerialNo(this.serialNoIsRequired);
    this.setValidatorBpkb();
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
    this.inputAddressObjForOwner.default = this.ownerAddrObj;
    this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
  }

  setAddrDelivObj() {
    this.inputFieldDelivAddrObj = new InputFieldObj();
    this.inputFieldDelivAddrObj.inputLookupObj = new InputLookupObj();

    this.delivAddrObj = new AddrObj();
    this.delivAddrObj.Addr = this.appAssetObj.ResponseAppCollateralRegistrationObj.DelivAddr;
    this.delivAddrObj.AreaCode1 = this.appAssetObj.ResponseAppCollateralRegistrationObj.DelivAreaCode1;
    this.delivAddrObj.AreaCode2 = this.appAssetObj.ResponseAppCollateralRegistrationObj.DelivAreaCode2;
    this.delivAddrObj.AreaCode3 = this.appAssetObj.ResponseAppCollateralRegistrationObj.DelivAreaCode3;
    this.delivAddrObj.AreaCode4 = this.appAssetObj.ResponseAppCollateralRegistrationObj.DelivAreaCode4;
    this.delivAddrObj.City = this.appAssetObj.ResponseAppCollateralRegistrationObj.DelivCity;

    this.inputFieldDelivAddrObj.inputLookupObj.nameSelect = this.appAssetObj.ResponseAppCollateralRegistrationObj.DelivZipcode;
    this.inputFieldDelivAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.appAssetObj.ResponseAppCollateralRegistrationObj.DelivZipcode };
    this.inputAddressObjForDeliv.default = this.delivAddrObj;
    this.inputAddressObjForDeliv.inputField = this.inputFieldDelivAddrObj;
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
    this.inputAddressObjForLoc.default = this.locationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
  }

  addAccessories() {
    if (this.AssetDataForm.get("AssetTypeCode").value == "") {
      return this.toastr.warningMessage("Please Choose Asset First");
    }
    let appAccessoryObj = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
    let length = this.AssetDataForm.value["AssetAccessoriesObjs"].length;
    let max = 0;
    if (length > 0) {
      max = this.AssetDataForm.value["AssetAccessoriesObjs"][length - 1].No;
    }

    appAccessoryObj.push(this.addGroup(undefined, max + 1));

    let InputLookupAccObj = this.initLookupAcc();
    let InputLookupAccSupObj = this.initLookupSuppAcc();
    this.InputLookupAcceObjs.push(InputLookupAccObj);
    this.InputLookupSupplObjs.push(InputLookupAccSupObj);

    this.dictAccLookup[max + 1] = InputLookupAccObj;
    this.dictSuppLookup[max + 1] = InputLookupAccSupObj;
  }

  deleteAccessory(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      let appAccessoryObjs = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
      let no = appAccessoryObjs.controls[i]["controls"]["No"].value;
      appAccessoryObjs.removeAt(i);
      this.AssetDataForm.removeControl("lookupSupplierObj" + no);
      this.AssetDataForm.removeControl("lookupAccObj" + no);
    }
  }

  bindAccessories() {
    if (this.appAssetAccessoriesObjs != undefined) {
      this.originalAppAssetAccessory = [...this.appAssetAccessoriesObjs];
      for (let i = 0; i < this.appAssetAccessoriesObjs.length; i++) {
        let listAppAccessories = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
        listAppAccessories.push(this.addGroup(this.appAssetAccessoriesObjs[i], i));

        let InputLookupAccObj = this.initLookupAcc();
        let InputLookupAccSupObj = this.initLookupSuppAcc();
        this.dictAccLookup[i] = InputLookupAccObj;
        this.dictSuppLookup[i] = InputLookupAccSupObj;
        this.InputLookupAcceObjs.push(InputLookupAccObj);
        this.InputLookupSupplObjs.push(InputLookupAccSupObj);

        this.setAppAccessorySupplier(i, this.appAssetAccessoriesObjs[i].SupplCode);
        this.setAppAccessory(i, this.appAssetAccessoriesObjs[i].AssetAccessoryCode);
        this.ChangeAccessoryDPType(i, 'AMT');
      }
    }
  }

  setAppAccessorySupplier(i, SupplCode) {
    this.vendorAccSuppObj.VendorCode = SupplCode;
    this.http.post(URLConstant.GetVendorByVendorCode, { Code: SupplCode }).subscribe(
      (response) => {
        this.dictSuppLookup[i].nameSelect = response["VendorName"];
        this.dictSuppLookup[i].jsonSelect = response;
        this.InputLookupSupplObjs[i].jsonSelect = response;

      });
  }

  setAppAccessory(i, AssetAccessoryCode) {
    this.accObj.AssetAccessoryCode = AssetAccessoryCode;
    let obj = { Code: this.accObj.AssetAccessoryCode }
    this.http.post(URLConstant.GetAssetAccessoryByCode, obj).subscribe(
      (response) => {
        this.dictAccLookup[i].nameSelect = response["AssetAccessoryName"];
        this.dictAccLookup[i].jsonSelect = response;
        this.InputLookupAcceObjs[i].jsonSelect = response;
      });
  }

  addGroup(appAssetAccessoriesObj, i) {
    if (appAssetAccessoriesObj == undefined) {
      return this.fb.group({
        No: [i],
        AssetAccessoryCode: ['', [Validators.required, Validators.maxLength(50)]],
        AssetAccessoryName: ['', [Validators.maxLength(1000)]],
        SupplCodeAccessory: ['', [Validators.required, Validators.maxLength(50)]],
        SupplNameAccessory: ['', [Validators.required, Validators.maxLength(500)]],
        AccessoryPriceAmt: [0, [Validators.required,Validators.min(0.00)]],
        AccessoryDownPaymentType: [''],
        AccessoryDownPaymentPrcnt: [0, [Validators.required, Validators.min(0.00), Validators.max(100.00)]],
        AccessoryDownPaymentAmt: [0, [Validators.required,Validators.min(0.00)]],
        AccessoryNotes: ['']
      })
    }
    else {
      return this.fb.group({
        No: [i],
        AssetAccessoryCode: [appAssetAccessoriesObj.AssetAccessoryCode, [Validators.required, Validators.maxLength(50)]],
        AssetAccessoryName: [appAssetAccessoriesObj.AssetAccessoryName, [Validators.maxLength(1000)]],
        SupplCodeAccessory: [appAssetAccessoriesObj.SupplCode, [Validators.required, Validators.maxLength(50)]],
        SupplNameAccessory: [appAssetAccessoriesObj.SupplName, [Validators.required, Validators.maxLength(500)]],
        AccessoryPriceAmt: [appAssetAccessoriesObj.AccessoryPriceAmt, [Validators.required,Validators.min(0.00)]],
        AccessoryDownPaymentType: [this.DpObj[0].Key],
        AccessoryDownPaymentPrcnt: [appAssetAccessoriesObj.DownPaymentPrcnt, [Validators.required, Validators.min(0.00), Validators.max(100.00)]],
        AccessoryDownPaymentAmt: [appAssetAccessoriesObj.DownPaymentAmt, [Validators.required,Validators.min(0.00)]],
        AccessoryNotes: [appAssetAccessoriesObj.AccessoryNotes, Validators.maxLength(4000)]
      })
    }
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

  HitAPI() {
    if (this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value == '') {
      this.toastr.warningMessage("Please Input Chassis No !");
    }
    else {
      this.toastr.successMessage("Submit with Integrator");
      this.IsIntegrator = true;
    }
  }

  GetVendorAccessories() {
    this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.vendorObj.VendorCode }).subscribe(
      (response: any) => {
        this.VendorObj = response;
        this.AssetDataForm.patchValue({
          SupplNameAccessory: this.VendorObj.VendorName,
          SupplCodeAccessory: this.VendorObj.VendorCode,
        });
      }
    );
  }

  GetVendorEmpSupervisi() {
    let ReqGerVendorEmpSpvByVendorEmpNo: GenericObj = new GenericObj();
    ReqGerVendorEmpSpvByVendorEmpNo.EmpNo = this.vendorEmpObj.VendorEmpNo;
    this.http.post<ResGetVendorEmpSpvByEmpNoObj>(URLConstant.GetVendorEmpSupervisorByVendorEmpNo, ReqGerVendorEmpSpvByVendorEmpNo).subscribe(
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
    this.appObj.Id = this.AppId;
    await this.http.post(URLConstant.GetListAppCustAddrByAppId, this.appObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AddrLegalObj = this.AppCustAddrObj.filter(
          emp => emp.MrCustAddrTypeCode === CommonConstant.AddrTypeLegal);
      }
    );
  }

  copyToOwnerAddr() {
    if (this.copyFromAppCustAddrForOwner != "") {
      this.AddrObj = this.AppCustAddrObj.filter(
        emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForOwner);

      this.AssetDataForm.patchValue({
        OwnerAddr: this.AddrObj[0].Addr,
        OwnerAreaCode1: this.AddrObj[0].AreaCode1,
        OwnerAreaCode2: this.AddrObj[0].AreaCode2,
        OwnerAreaCode3: this.AddrObj[0].AreaCode3,
        OwnerAreaCode4: this.AddrObj[0].AreaCode4,
        OwnerCity: this.AddrObj[0].City,
        OwnerZipcode: this.AddrObj[0].Zipcode,
        OwnerAddrType: ''
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

      this.inputAddressObjForOwner.default = this.ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
    }
  }

  copyToDelivAddr() {
    if (this.copyFromAppCustAddrForDelivery != "") {
      this.AddrObj = this.AppCustAddrObj.filter(
        emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForDelivery);

      this.AssetDataForm.patchValue({
        DelivAddr: this.AddrObj[0].Addr,
        DelivAreaCode1: this.AddrObj[0].AreaCode1,
        DelivAreaCode2: this.AddrObj[0].AreaCode2,
        DelivAreaCode3: this.AddrObj[0].AreaCode3,
        DelivAreaCode4: this.AddrObj[0].AreaCode4,
        DelivCity: this.AddrObj[0].City,
        DelivZipcode: this.AddrObj[0].Zipcode,
      });
      this.delivAddrObj = new AddrObj();
      this.delivAddrObj.Addr = this.AddrObj[0].Addr;
      this.delivAddrObj.AreaCode1 = this.AddrObj[0].AreaCode1;
      this.delivAddrObj.AreaCode2 = this.AddrObj[0].AreaCode2;
      this.delivAddrObj.AreaCode3 = this.AddrObj[0].AreaCode3;
      this.delivAddrObj.AreaCode4 = this.AddrObj[0].AreaCode4;
      this.delivAddrObj.City = this.AddrObj[0].City;

      this.inputFieldDelivAddrObj.inputLookupObj.nameSelect = this.AssetDataForm.controls.DelivZipcode.value;
      this.inputFieldDelivAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AssetDataForm.controls.DelivZipcode.value };

      this.inputAddressObjForDeliv.default = this.delivAddrObj;
      this.inputAddressObjForDeliv.inputField = this.inputFieldDelivAddrObj;
    }
  }

  copyToLocationAddr() {
    if (this.copyFromAppCustAddrForLocation != "") {
      this.AddrObj = this.AppCustAddrObj.filter(
        emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForLocation);

      this.AssetDataForm.patchValue({
        LocationAddr: this.AddrObj[0].Addr,
        LocationAreaCode1: this.AddrObj[0].AreaCode1,
        LocationAreaCode2: this.AddrObj[0].AreaCode2,
        LocationAreaCode3: this.AddrObj[0].AreaCode3,
        LocationAreaCode4: this.AddrObj[0].AreaCode4,
        LocationCity: this.AddrObj[0].City,
        LocationZipcode: this.AddrObj[0].Zipcode,
        LocationAddrType: ""
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

      this.inputAddressObjForLoc.default = this.locationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
    }
  }

  async CheckValue() {
    this.allAssetDataObj = new AllAssetDataObj();
    await this.setAllAssetObj();
  }

  SetLocationAddrType(event) {
    this.copyFromAppCustAddrForLocation = event;
  }

  SetDelivAddrType(event) {
    this.copyFromAppCustAddrForDelivery = event;
  }

  SetOwnerAddrType(event) {
    this.copyFromAppCustAddrForOwner = event;
  }

  async GetAppCust() {
    let appObj = {
      Id: this.AppId,
    };
    await this.http.post(URLConstant.GetAppCustByAppId, appObj).toPromise().then(
      async (response) => {
        this.AppCustObj = response;
        this.CustType = this.AppCustObj.MrCustTypeCode;
        if (this.CustType == CommonConstant.CustTypePersonal) {
          this.AssetDataForm.controls.MrIdTypeCode.setValidators([Validators.required, Validators.maxLength(50)]);
          this.AssetDataForm.controls.MrIdTypeCode.updateValueAndValidity();
        }
        await this.OwnerTypeChange(this.CustType, true);
      }
    );
  }

  async GetAppCustPersonalJobData() {
    await this.http.post<ResponseJobDataPersonalObj>(URLConstant.GetAppCustPersonalJobData, { Id: this.AppCustObj.AppCustId }).toPromise().then(
      (response) => {
        if(response.AppCustPersonalJobDataObj != null){
          this.AppCustPersonalJobData = response.AppCustPersonalJobDataObj;
        }
      }
    );
  }

  async GetAppCustPhone() {
    if (typeof (this.AppCustObj) != 'undefined') {
      let appObj = {
        Id: this.AppId,
      };
      await this.http.post(URLConstant.GetCustDataByAppId, appObj).toPromise().then(
        (response) => {
          if (typeof (response['AppCustPersonalObj']) != 'undefined') this.AppCustObj.MobilePhnNo1 = response['AppCustPersonalObj']['MobilePhnNo1'];
        }
      );
    }
  }

  async GetRefProdCompt() {
    let appObj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    appObj.ProdOfferingCode = this.AppObj.ProdOfferingCode;
    appObj.RefProdCompntCode = CommonConstant.RefProdCompntAssetType;
    appObj.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
      (response: any) => {
        this.RefProdCmptAssetType = response;
      }
    );

    let appObj2: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    appObj2.ProdOfferingCode = this.AppObj.ProdOfferingCode;
    appObj2.RefProdCompntCode = CommonConstant.RefProdCompntSupplSchm;
    appObj2.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj2).toPromise().then(
      (response: any) => {
        this.RefProdCmptSupplSchm = response;
      }
    );

    let appObj3: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    appObj3.ProdOfferingCode = this.AppObj.ProdOfferingCode;
    appObj3.RefProdCompntCode = CommonConstant.RefProdCompntAssetSchm;
    appObj3.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj3).toPromise().then(
      (response: any) => {
        this.RefProdCmptAssetSchm = response;
      }
    );
    
    let appObj4: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    appObj4.ProdOfferingCode = this.AppObj.ProdOfferingCode;
    appObj4.RefProdCompntCode = CommonConstant.RefProdCompntCodePurposeOfFinancing;
    appObj4.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj4).toPromise().then(
      (response: any) => {
        this.RefProdCmptPurposeOfFinancing = response;
      }
    );
  }

  GetRefAssetDocList(isInit: boolean) {
    this.http.post(URLConstant.GetRefAssetDocList, { Code: this.AssetDataForm.get("AssetTypeCode").value }).subscribe(
      (response) => {
        let ListDoc = this.AssetDataForm.get('ListDoc') as FormArray;
        ListDoc.reset();
        while(ListDoc.length) {
          ListDoc.removeAt(0);
        }
        if (response[CommonConstant.ReturnObj].length > 0) {
          for (let i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
            let assetDocumentDetail = this.fb.group({
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
            ListDoc.push(assetDocumentDetail);
          }
        }
        if(isInit){
          this.setAppCollateralDoc(this.appAssetObj['ResponseAppCollateralObj']['AppCollateralId']);
        }
      });
  }

  setAppCollateralDoc(AppCollateralId: number = 0) {
    this.http.post(URLConstant.GetListAppCollateralDocsByAppCollateralId, { Id: AppCollateralId }).subscribe(
      (response) => {
        let AppCollateralDocs = new Array();
        AppCollateralDocs = response["AppCollateralDocs"];
        if (AppCollateralDocs["length"] > 0) {
          for (let i = 0; i < AppCollateralDocs.length; i++) {
            let AppCollatralDocId = AppCollateralDocs.findIndex(x => x.DocCode == this.AssetDataForm.controls.ListDoc["controls"][i]["controls"].DocCode.value);

            this.AssetDataForm.controls.ListDoc["controls"][i].patchValue({
              DocNo: AppCollateralDocs[AppCollatralDocId].DocNo,
              DocNotes: AppCollateralDocs[AppCollatralDocId].DocNotes,
              ACDExpiredDt: AppCollateralDocs[AppCollatralDocId].ExpiredDt == null ? "" : formatDate(AppCollateralDocs[AppCollatralDocId].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
              IsReceived: AppCollateralDocs[AppCollatralDocId].IsReceived,
              RowVersion: AppCollateralDocs[AppCollatralDocId].RowVersion,
            })
          }
        }
      });
  }

  async GetAppCustCoy() {
    await this.http.post(URLConstant.GetAppCustCompanyByAppCustId, {Id: this.AppCustObj.AppCustId}).toPromise().then(
      (response: any) => {
        this.AppCustCoyObj = response;
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
  }

  ChangeAccessoryDPType(i: number, ev){
    if(ev == CommonConstant.DownPaymentTypeAmt){
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.disable();
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.enable();
    }else{
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.disable();
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.enable();
    }
  }

  CheckAccessoryDPValue(i: number) {
    let InputAccessoryPrice = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryPriceAmt.value

    if (InputAccessoryPrice == 0) {
      this.toastr.warningMessage(ExceptionConstant.ACCESSORY_PRICE_NOT_SET + " No " + (i + 1));
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(0);
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(0);
      return;
    }

    let InputDPPrcnt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.value;
    let InputDPAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.value;

    if (InputDPAmt > InputAccessoryPrice) {
      this.toastr.warningMessage("Security Deposit Amount " + (i + 1) + ExceptionConstant.CANNOT_BE_HIGHER_THAN_ACCESSORY_PRICE + " No " + (i + 1));
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(0);
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(0);
      return;
    }

    let DownPayment, DownPaymentPrctg, roundedAmt = 0;
    if (this.AssetDataForm.controls['AssetAccessoriesObjs']['controls'][i]['controls'].AccessoryDownPaymentType.value == CommonConstant.DownPaymentTypeAmt) {
      let DownPaymentPrctg = Math.round(InputDPAmt) / InputAccessoryPrice * 100;
      DownPaymentPrctg = Math.round(DownPaymentPrctg * 1000000) / 1000000;

      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(DownPaymentPrctg);
    } else{
      DownPaymentPrctg = Math.round(InputDPPrcnt * 1000000) / 1000000;
      DownPayment = InputAccessoryPrice * DownPaymentPrctg / 100;

      if(this.RoundedAmt == 0){
        DownPayment = Math.round(DownPayment);
      }else{
        roundedAmt = Math.pow(10, this.RoundedAmt);
        DownPayment = Math.round(DownPayment * roundedAmt) / roundedAmt;
      }

      DownPaymentPrctg = Math.round((DownPayment / InputAccessoryPrice) * 100 * 1000000) / 1000000;

      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(DownPayment);
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(DownPaymentPrctg);
    }
  }

  ChangeMrIdTypeCode(MrIdTypeCode: string){
    if (MrIdTypeCode == CommonConstant.MrIdTypeCodeEKTP) {
      this.AssetDataForm.controls.OwnerIdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(16), Validators.maxLength(16)]);
      this.AssetDataForm.controls.OwnerIdNo.updateValueAndValidity();
    }
    else {
      this.AssetDataForm.controls.OwnerIdNo.setValidators(Validators.required);
      this.AssetDataForm.controls.OwnerIdNo.updateValueAndValidity();
    }
  }

  async getDigitalizationSvcType(){
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType}).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if(this.sysConfigResultObj.ConfigValue != null){
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");
      var refSvcType = "";
      await this.http.post(URLConstant.GetRuleIntegratorPackageMapAsset, { TrxNo: this.BizTemplateCode}).toPromise().then(
        (response) => {
            refSvcType = response["Result"];
        });

      var svcType = listSvcType.find(x => x == refSvcType);

      if(svcType != null){
        this.IsSvcExist = true;
      }
    }
  }

  async bindOwnerTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.OwnerTypeObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({
          MrOwnerTypeCode : this.CustType
        });
      }
    );
  }

  async OwnerTypeChange(OwnerType: string, IsOwnerTypeChanged: boolean = false){
    let ownerCode: string = "";
    if (this.appAssetObj) ownerCode = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionCode;

    if(OwnerType == CommonConstant.CustTypePersonal){
      this.InputLookupProfessionObj.isRequired = false;
      this.AssetDataForm.controls.OwnerProfessionCode.clearValidators();
      
      this.refMasterObj.RefMasterTypeCode = this.CustType == CommonConstant.CustTypeCompany ? CommonConstant.RefMasterTypeCodeCustCompanyRelationship :  CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
      this.GetOwnerRelationship();
      
      if(IsOwnerTypeChanged){
        this.AssetDataForm.patchValue({
          OwnerProfessionCode : ""
        });

        this.InputLookupProfessionObj.nameSelect = "";
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
      }else{
        let reqByCode: GenericObj = new GenericObj();
        reqByCode.Code = ownerCode;

        await this.http.post(URLConstant.GetRefProfessionByCode, reqByCode).toPromise().then(
          (response) =>{
            this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response["ProfessionName"] };
          }
        );
      }
    }else{
      this.InputLookupProfessionObj.isRequired = true;
      this.AssetDataForm.controls.OwnerProfessionCode.setValidators([Validators.required]);
      
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
      this.GetOwnerRelationship();
      
      if(IsOwnerTypeChanged){
        this.AssetDataForm.patchValue({
          OwnerProfessionCode : ""
        });
      }else{
        this.AssetDataForm.patchValue({
          OwnerProfessionCode : ownerCode
        });
      }
    }
  }

  async bindCompanyTypeObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCompanyType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.OwnerProfessionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  private SetValidatorItemsSerialNo(SerialNoIsRequired: boolean) {
    let itemsSerialNo: FormArray = this.AssetDataForm.get("items") as FormArray;
    for (let i = 0; i < itemsSerialNo.length; i++) {
      let tempForm: FormGroup = itemsSerialNo.get(i.toString()) as FormGroup;
      let tempValidators: Array<ValidatorFn> = new Array();
      if (this.SerialNoRegex) tempValidators.push(Validators.pattern(this.SerialNoRegex));
      if (SerialNoIsRequired) {
        let tempIsMandatory: boolean = tempForm.get("IsMandatory").value;
        if (tempIsMandatory) tempValidators.push(Validators.required);
      }
      let tempSerialNo = tempForm.get("SerialNoValue") as AbstractControl;
      if (tempValidators.length) {
        tempSerialNo.setValidators(tempValidators);
        tempSerialNo.updateValueAndValidity();
      }
    }
  }

  async getRoundedAmt(){
    const prodObj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.REF_PROD_COMPNT_CODE_CURR,
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion
    }

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, prodObj).toPromise().then(
      async (response: any) => {
        await this.http.post(URLConstant.GetRefCurrByCode, {Code : response.CompntValue}).toPromise().then(
          (response: any) => {
            this.RoundedAmt = response.RoundedAmt;
          });
      });
  }

  SetRefAttrSettingObj() {
    let GenObj =
    {
      AppAssetId: this.appAssetId,
      AssetTypeCode: this.RefProdCmptAssetType.CompntValue,
      IsRefresh: false
    };
    this.attrSettingObj.ReqGetListAttrObj = GenObj;
    this.attrSettingObj.Title = "Asset Attribute";
    this.attrSettingObj.UrlGetListAttr = URLConstant.GenerateAppAssetAttrV2;
    this.isAssetAttrReady = true;
  }
}
