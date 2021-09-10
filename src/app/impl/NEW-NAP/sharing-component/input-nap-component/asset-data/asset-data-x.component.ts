import { DatePipe, formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { String } from 'typescript-string-operations';
import { ExceptionConstant } from "app/shared/constant/ExceptionConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { AddrObj } from "app/shared/model/AddrObj.Model";
import { AllAssetDataObj } from "app/shared/model/AllAssetDataObj.Model";
import { AppObj } from "app/shared/model/App/App.Model";
import { AppAssetAttrCustomObj } from "app/shared/model/AppAsset/AppAssetAttrCustom.Model";
import { AppAssetAccessoryObj } from "app/shared/model/AppAssetAccessoryObj.model";
import { AppAssetAttrObj } from "app/shared/model/AppAssetAttrObj.Model";
import { AppAssetObj } from "app/shared/model/AppAssetObj.Model";
import { AppCollateralAccessoryObj } from "app/shared/model/AppCollateralAccessoryObj.Model";
import { AppCollateralAttrObj } from "app/shared/model/AppCollateralAttrObj.Model";
import { AppCollateralRegistrationObj } from "app/shared/model/AppCollateralRegistrationObj.Model";
import { AppCustCompanyObj } from "app/shared/model/AppCustCompanyObj.Model";
import { AppDataObj } from "app/shared/model/AppDataObj.model";
import { CriteriaObj } from "app/shared/model/CriteriaObj.model";
import { CustomPatternObj } from "app/shared/model/CustomPatternObj.model";
import { GeneralSettingObj } from "app/shared/model/GeneralSettingObj.Model";
import { GenericListByCodeObj } from "app/shared/model/Generic/GenericListByCodeObj.model";
import { GenericObj } from "app/shared/model/Generic/GenericObj.Model";
import { InputAddressObj } from "app/shared/model/InputAddressObj.Model";
import { InputFieldObj } from "app/shared/model/InputFieldObj.Model";
import { InputLookupObj } from "app/shared/model/InputLookupObj.Model";
import { KeyValueObj } from "app/shared/model/KeyValue/KeyValueObj.model";
import { ProdOfferingDObj } from "app/shared/model/Product/ProdOfferingDObj.model";
import { RefProvDistrictObj } from "app/shared/model/RefProvDistrictObj.Model";
import { ReqGetProdOffDByProdOffVersion } from "app/shared/model/Request/Product/ReqGetProdOfferingObj.model";
import { ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj } from "app/shared/model/Request/Vendor/ReqVendorEmp.model";
import { ResListGeneralSettingObj, ResGeneralSettingObj } from "app/shared/model/Response/GeneralSetting/ResGeneralSettingObj.model";
import { ResGetVendorEmpByVendorIdAndEmpNoObj, ResGetVendorEmpSpvByEmpNoObj } from "app/shared/model/Response/VendorEmp/ResVendorEmp.model";
import { ResAssetValidationRuleObj } from "app/shared/model/Rule/ResAssetValidationRuleObj.model";
import { AssetTypeSerialNoLabelObj } from "app/shared/model/SerialNo/AssetTypeSerialNoLabelObj.Model";
import { VendorObj } from "app/shared/model/Vendor.Model";
import { VendorEmpObj } from "app/shared/model/VendorEmp.Model";
import { environment } from "environments/environment";
import { AppCustPersonalJobDataObj } from "app/shared/model/AppCustPersonalJobDataObj.Model";
import { ResponseJobDataPersonalObj } from "app/shared/model/ResponseJobDataPersonalObj.Model";
import { ListAppCollateralDocObj } from "app/shared/model/ListAppCollateralDocObj.Model";
import { AppCollateralDocObj } from "app/shared/model/AppCollateralDocObj.Model";
import { CommonConstantX } from "app/impl/shared/constant/CommonConstantX";
import { URLConstantX } from "app/impl/shared/constant/URLConstantX";

@Component({
    selector: 'app-asset-data-x',
    templateUrl: './asset-data-x.component.html',
  })
  
  export class AssetDataXComponent implements OnInit {
    @Input() AppId: number;
    @Input() showCancel: boolean = true;
    @Input() BizTemplateCode: string = "";
    @Input() AppAssetId: number;
    @Input() mode: string;
    @Output() outputTab: EventEmitter<any> = new EventEmitter();
    @Output() assetValue: EventEmitter<object> = new EventEmitter();
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
      AssetPriceAmt: ['', Validators.required],
      DownPaymentAmt: ['', [Validators.required, Validators.min(0.00)]],
      DownPaymentPrctg: ['', Validators.max(100)],
      AssetNotes: ['', [Validators.maxLength(4000)]],
      Color: ['', Validators.maxLength(50)],
      TaxCityIssuer: [''],
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
      UserName: ['', Validators.maxLength(50)],
      MrUserRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
      OwnerName: ['', [Validators.required, Validators.maxLength(50)]],
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
    AddrObj: AddrObj;
    refMasterObj = {
      RefMasterTypeCode: "",
    };
    appObj = {
      Id: 0,
    };
  
    assetCondObj: ProdOfferingDObj;
  
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
  
    assetMasterObj = {
      FullAssetCode: "",
    };
  
    districtObj = {
      ProvDistrictCode: "",
    };
  
    allAssetDataObj: AllAssetDataObj;
  
    InputLookupSupplierObj: InputLookupObj;
    InputLookupCityIssuerObj: InputLookupObj;
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
    DpObj: Array<KeyValueObj>;
    AppObj: AppObj;
    VendorObj: VendorObj;
    AssetMasterObj: any;
    AppCustAddrObj: any;
    AddrLegalObj: any;
    AddrMailingObj: any;
    AddrResidenceObj: any;
    appAssetObj: any;
    returnAppAssetObj: any;
    returnBranchManagerSupp: any;
    returnAdminHeadSupp: any;
    returnSalesPersonSupp: any;
    returnAppCollateralObj: any;
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
    AppCustCoyObj: AppCustCompanyObj;
    CheckValidationObj: ResAssetValidationRuleObj;
    SetManuYearObj: ResAssetValidationRuleObj;
    SetDpObj: ResAssetValidationRuleObj;
    isValidOk: boolean = true;
  
    AssetConditionName: string = "";
    OfficeCode: string;
    DpTypeBefore: string = "";
    AppAssetAttrObj: Array<AppAssetAttrObj>;
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
  
    generalSettingObj: GenericListByCodeObj = new GenericListByCodeObj();
    IntegratorCheckBySystemGsValue: string = "1";
    IsUseDigitalization: string;
    SerialNoRegex: string;
    ListPattern: Array<CustomPatternObj> = new Array<CustomPatternObj>();
    LastRequestedDate: any = "";
  
    readonly CurrencyMaskPrct = CommonConstantX.CurrencyMaskPrct;
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
  
      this.items = this.AssetDataForm.get('items') as FormArray;
      this.isOnlookup = false;
      await this.GetAppData();
      await this.GetRefProdCompt();
      await this.GetAppCust();
      await this.GetAppCustPersonalJobData();
      await this.GetAppCustPhone();
      await this.bindAllRefMasterObj();
      this.initLookup();
      this.locationAddrObj = new AddrObj();
      this.delivAddrObj = new AddrObj();
      this.ownerAddrObj = new AddrObj();
      this.inputFieldOwnerAddrObj = new InputFieldObj();
      this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
      this.inputFieldDelivAddrObj = new InputFieldObj();
      this.inputFieldDelivAddrObj.inputLookupObj = new InputLookupObj();
      this.inputFieldLocationAddrObj = new InputFieldObj();
      this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
  
      if (this.CustType == CommonConstant.CustTypeCompany) {
        await this.GetAppCustCoy();
      }
      await this.GetListAddr();
      if (this.BizTemplateCode !== CommonConstant.OPL) {
        this.AssetConditionChanged();
      }
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
      else if(this.mode == 'editAsset') {
        await this.getAllAssetData();
      }
  
      this.GenerataAppAssetAttr(false);
      var appObj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
      appObj.ProdOfferingCode = this.AppObj.ProdOfferingCode,
        appObj.RefProdCompntCode = CommonConstant.RefProdCompntAssetCond,
        appObj.ProdOfferingVersion = this.AppObj.ProdOfferingVersion,
  
        await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
          (response: any) => {
            this.RefProdCmptAssetCond = response;
            if (this.RefProdCmptAssetCond.CompntValue == "USED") {
              this.isUsed = true;
            } else {
              this.isUsed = false;
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
  
  
          if(this.mode == 'editAsset'){
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
          }
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
  
      var appAttrObjs = this.AssetDataForm.controls["AppAssetAttrObjs"] as FormArray;
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
  
        this.setAppAccessorySupplier(i, this.appAssetAccessoriesObjs[i].SupplCode);
        this.setAppAccessory(i, this.appAssetAccessoriesObjs[i].AssetAccessoryCode);
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
      var assetPriceAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
      var discount = this.AssetDataForm.controls.Discount.value;
      this.priceAfterDiscount = assetPriceAmt - discount;
    }
  
    async GetGS() {
      this.generalSettingObj = new GenericListByCodeObj();
      this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
      this.generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization);
  
      await this.http.post<ResListGeneralSettingObj>(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).toPromise().then(
        (response) => {
          var returnGeneralSettingObj: Array<ResGeneralSettingObj> = new Array<ResGeneralSettingObj>();
          returnGeneralSettingObj = response['ResGetListGeneralSettingObj'];
  
          var gsNeedCheckBySystem = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
          var gsUseDigitalization = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);
  
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
            this.GetThirdPartyResultH();
          }
        }
      );
    }

  
    async SaveForm() {
      var assetForm = this.AssetDataForm.getRawValue();
      if (this.BizTemplateCode !== "OPL") {
        var confirmMsg = "";
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
            var assetDPMin = (this.CheckValidationObj.DPMin / 100) * (assetForm.AssetPriceAmt + sumAssetAccessories);
            var assetDPMax = (this.CheckValidationObj.DPMax / 100) * assetForm.AssetPriceAmt;
            if (assetForm.DownPaymentAmt < assetDPMin) {
              this.isValidOk = false;
              confirmMsg = "Down Payment Amount is Lower than Minimum Amount";
            }
            else if (assetForm.DownPaymentAmt > assetDPMax) {
              this.isValidOk = false;
              confirmMsg = "Down Payment Amount is Higher than Maximum Amount";
            }
          }
  
          if (!this.isValidOk) {
            confirmMsg += ", Are You Sure to Save This Data ?";
            var confirmation = confirm(confirmMsg);
            if (!confirmation) {
              return false;
            }
          }
        }
      }
  
      this.allAssetDataObj = new AllAssetDataObj();
      this.setAllAssetObj();
      this.allAssetDataObj.BizTemplateCode = this.BizTemplateCode;
      this.allAssetDataObj.LOBCode = CommonConstant.FL4W; // penjagaan supplier tidak boleh berbeda (sama seperti FL4W) - CF4W fleet
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
        if(this.mode == 'editAsset'){
          if (this.returnAppAssetObj != null && this.returnAppAssetObj != undefined) {
            this.allAssetDataObj.AppCollateralObj.RowVersion = this.returnAppCollateralObj.RowVersion;
            if (this.appAssetObj.ResponseAppCollateralRegistrationObj != null) this.allAssetDataObj.AppCollateralRegistrationObj.RowVersion = this.returnAppCollateralRegistObj.RowVersion;
            this.allAssetDataObj.AppAssetObj.RowVersion = this.returnAppAssetObj.RowVersion;
            if (this.appAssetObj.ResponseAdminHeadSupp != null) this.allAssetDataObj.AppAssetSupplEmpAdminObj.RowVersion = this.returnAdminHeadSupp.RowVersion;
            if (this.appAssetObj.ResponseSalesPersonSupp != null) this.allAssetDataObj.AppAssetSupplEmpSalesObj.RowVersion = this.returnSalesPersonSupp.RowVersion;
            if (this.appAssetObj.ResponseBranchManagerSupp != null)this.allAssetDataObj.AppAssetSupplEmpManagerObj.RowVersion = this.returnBranchManagerSupp.RowVersion;
          }
        }
        if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0") {
          if (this.IsIntegrator) {
            if (confirm("Submit data without Integrator ?")) {
              this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
                (response) => {
                  this.toastr.successMessage(response["message"]);
                  this.AssetDataForm.reset();
                  this.assetValue.emit({ mode: 'paging' });
                }
              );
            }
          }
          else if (!this.IsIntegrator) {
            if (this.currentChassisNo == this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value) {
              this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
                (response) => {
                  this.toastr.successMessage(response["message"]);
                  this.AssetDataForm.reset();
                  this.assetValue.emit({ mode: 'paging' });
                }
              );
            }
            else {
              if (confirm("Submit data without Integrator ?")) {
                this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
                  (response) => {
                    this.toastr.successMessage(response["message"]);
                    this.AssetDataForm.reset();
                  this.assetValue.emit({ mode: 'paging' });
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
                this.AssetDataForm.reset();
                this.assetValue.emit({ mode: 'paging' });
              }
            );
          }
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
      this.assetValue.emit({ mode: 'paging' });
    }
  
    Save() {
      this.toastr.successMessage("");
      this.outputTab.emit();
    }
  
    async GetThirdPartyResultH() {
      var ChassisNoValue = this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value;
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
      var CheckValidObj = {
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
        (response: any) => {
          this.CheckValidationObj = response;
        },
        (error) => {
          this.isValidOk = false;
        }
      );
    }
  
    SetDpValue(mode: string = "add") {
      var CheckValidObj = {
        AppId: this.AppId,
        AssetCondition: this.AssetDataForm.controls.MrAssetConditionCode.value,
        ManufacturingYear: this.AssetDataForm.controls.ManufacturingYear.value,
        Tenor: this.AppObj.Tenor,
        AssetCategoryCode: this.AssetDataForm.controls.AssetCategoryCode.value,
        MrAssetUsageCode: this.AssetDataForm.controls.MrAssetUsageCode.value
      }
      this.http.post(URLConstant.CheckAssetValidationRule, CheckValidObj).subscribe(
        (response: any) => {
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
      var CheckValidObj = {
        AppId: this.AppId,
        SupplCode: this.AssetDataForm.controls.SupplCode.value,
        FullAssetCode: this.AssetDataForm.controls.FullAssetCode.value,
      }
      this.http.post(URLConstant.CheckAssetValidationRule, CheckValidObj).subscribe(
        (response: any) => {
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
  
    setAllAssetObj() {
      var assetForm = this.AssetDataForm.getRawValue();
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
      this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls.TaxCityIssuer.value;
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
  
      this.allAssetDataObj.AppCollateralRegistrationObj.UserName = this.AssetDataForm.controls.UserName.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.AssetDataForm.controls.MrUserRelationshipCode.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerName = this.AssetDataForm.controls.OwnerName.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AssetDataForm.controls.MrIdTypeCode.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AssetDataForm.controls.OwnerIdNo.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.AssetDataForm.controls.MrOwnerRelationshipCode.value;
      this.allAssetDataObj.AppCollateralRegistrationObj.OwnerProfessionCode = this.AssetDataForm.controls.OwnerProfessionCode.value;
  
      if (this.BizTemplateCode !== "OPL") {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items.controls[i] != null) {
            this.allAssetDataObj.AppAssetObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
          }
        }
  
        if (this.AssetDataForm.controls.selectedDpType.value == 'PRCTG') {
          // this.allAssetDataObj.AppAssetObj.DownPaymentAmt = this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100;
          this.allAssetDataObj.AppAssetObj.DownPaymentPrcnt = assetForm.DownPaymentPrctg;
          this.allAssetDataObj.AppAssetObj.DownPaymentAmt = assetForm.AssetPriceAmt * assetForm.DownPaymentPrctg / 100;
        }
        else {
          this.allAssetDataObj.AppAssetObj.DownPaymentAmt = assetForm.DownPaymentAmt;
          this.allAssetDataObj.AppAssetObj.DownPaymentPrcnt = (assetForm.DownPaymentAmt / assetForm.AssetPriceAmt) * 100;
        }
  
        for (var i = 0; i < this.items.length; i++) {
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
        var appAssetAccObj = new AppAssetAccessoryObj();
        var appCollateralAccObj = new AppCollateralAccessoryObj();
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
        TaxCityIssuer: event.DistrictCode,
      });
    }
  
    async SetAsset(event) {
      this.assetMasterObj.FullAssetCode = event.FullAssetCode;
      await this.GetAssetMaster(this.assetMasterObj);
      this.GetRefAssetDocList(false);
      this.AssetDataForm.patchValue({
        FullAssetCode: event.FullAssetCode,
        FullAssetName: event.FullAssetName,
        AssetCategoryCode: event.AssetCategoryCode
      });
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
        var temp: any;
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
        var tempId = event.target.value;
        var temp: any;
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
          this.AssetDataForm.controls["DownPaymentAmt"].enable()
          this.AssetDataForm.patchValue({
            DownPaymentAmt: this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100
          });
          this.AssetDataForm.controls["DownPaymentPrctg"].disable();
          this.AssetDataForm.controls["DownPaymentAmt"].updateValueAndValidity();
        }
        else if (this.AssetDataForm.controls.selectedDpType.value == 'PRCTG' && this.DpTypeBefore == 'AMT') {
          this.AssetDataForm.controls["DownPaymentPrctg"].enable();
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
          this.AssetDataForm.controls["DownPaymentAmt"].disable();
          this.AssetDataForm.controls["DownPaymentPrctg"].updateValueAndValidity();
        };
        this.DpTypeBefore = this.AssetDataForm.controls.selectedDpType.value;
      }
    }
    updateValueDownPaymentAmt() {
      var DownPaymentAmt = this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100;
      if (DownPaymentAmt > this.AssetDataForm.controls.AssetPriceAmt.value) {
        this.toastr.warningMessage("Down Payment Amount exceeded Asset Price Amount !");
        this.AssetDataForm.patchValue({
          DownPaymentAmt: 0,
          DownPaymentPrctg: 0
        });
      }
      else {
        this.AssetDataForm.patchValue({
          DownPaymentAmt: this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100
        });
      }
    }
  
    updateValueDownPaymentPrctg() {
      var DownPaymentPrctg = this.AssetDataForm.controls.DownPaymentAmt.value / this.AssetDataForm.controls.AssetPriceAmt.value * 100;
      if (DownPaymentPrctg > 100) {
        this.toastr.warningMessage("Down Payment Amount exceeded Asset Price Amount !");
        this.AssetDataForm.patchValue({
          DownPaymentAmt: 0,
          DownPaymentPrctg: 0
        });
      }
      else {
        this.AssetDataForm.patchValue({
          DownPaymentPrctg: this.AssetDataForm.controls.DownPaymentAmt.value / this.AssetDataForm.controls.AssetPriceAmt.value * 100
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
        this.AssetDataForm.controls.UserName.setValidators([Validators.required, Validators.maxLength(100)]);
        this.AssetDataForm.controls.UserName.updateValueAndValidity();
        this.AssetDataForm.controls.MrUserRelationshipCode.setValidators([Validators.required, Validators.maxLength(50)]);
        this.AssetDataForm.controls.MrUserRelationshipCode.updateValueAndValidity();
        this.AssetDataForm.controls["UserName"].enable();
        this.AssetDataForm.controls["MrUserRelationshipCode"].enable();
      };
    }
  
    async SelfOwnerChange(event) {
      if (event.checked == true) {
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
          OwnerAddrType: CommonConstant.AddrTypeLegal,
          OwnerProfessionCode: this.AppCustPersonalJobData.MrProfessionCode
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
  
        this.inputFieldOwnerAddrObj.inputLookupObj.isDisable = true;
        this.InputLookupProfessionObj.isDisable = true;
        this.AssetDataForm.controls["OwnerName"].disable();
        this.AssetDataForm.controls["MrIdTypeCode"].disable();
        this.AssetDataForm.controls["OwnerIdNo"].disable();
        this.AssetDataForm.controls["MrOwnerRelationshipCode"].disable();
        this.AssetDataForm.controls["OwnerMobilePhnNo"].disable();
        this.AssetDataForm.controls["ownerData"].disable();
        this.AssetDataForm.controls["OwnerAddrType"].disable();
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
      };
    }

    async getAllAssetData() {
      let appAssetObj = { Id: this.AppAssetId };
      await this.http.post(URLConstant.GetAllAssetDataByAppAssetId, appAssetObj).toPromise().then(
        async (response) => {
          this.appAssetObj = response;
          this.returnAppAssetObj = response["ResponseAppAssetObj"];
          this.returnBranchManagerSupp = response["ResponseBranchManagerSupp"];
          this.returnAdminHeadSupp =  response["ResponseAdminHeadSupp"];
          this.returnSalesPersonSupp = response["ResponseSalesPersonSupp"];
          this.returnAppCollateralObj = response["ResponseAppCollateralObj"];
          this.returnAppCollateralRegistObj = response["ResponseAppCollateralRegistrationObj"]

          this.AssetDataForm.patchValue({
            FullAssetCode: this.returnAppAssetObj.FullAssetCode,
            FullAssetName: this.returnAppAssetObj.FullAssetName,
            MrAssetConditionCode: this.returnAppAssetObj.MrAssetConditionCode,
            MrAssetUsageCode: this.returnAppAssetObj.MrAssetUsageCode,
            SupplName: this.returnAppAssetObj.SupplName,
            SupplCode: this.returnAppAssetObj.SupplCode,
            ManufacturingYear: this.returnAppAssetObj.ManufacturingYear,
            AssetPriceAmt: this.returnAppAssetObj.AssetPriceAmt,
            Discount: this.returnAppAssetObj.Discount,
            ExpectedDelivDt: this.returnAppAssetObj.ExpectedDelivDt,
            IsNeedReplacementCar: this.returnAppAssetObj.IsNeedReplacementCar,
            DownPaymentAmt: this.returnAppAssetObj.DownPaymentAmt,
            DownPaymentPrctg: this.returnAppAssetObj.DownPaymentPrctg,
            AssetNotes: this.returnAppAssetObj.AssetNotes,
            Color: this.returnAppAssetObj.Color,
            TaxCityIssuer: this.returnAppAssetObj.TaxCityIssuer,
            AssetSeqNo: this.returnAppAssetObj.AssetSeqNo,
            AssetStat: this.returnAppAssetObj.AssetStat,
            AssetTypeCode: this.returnAppAssetObj.AssetTypeCode,
            AssetCategoryCode: this.returnAppAssetObj.AssetCategoryCode,
            IsCollateral: this.returnAppAssetObj.IsCollateral,
            IsInsurance: this.returnAppAssetObj.IsInsurance,
            IsEditableDp: this.returnAppAssetObj.IsEditableDp,
            selectedDpType: 'AMT'
          });

          this.updateValueDownPaymentPrctg();
          this.appAssetAccessoriesObjs = response["ResponseAppAssetAccessoryObjs"];
        }
      );
      this.InputLookupCityIssuerObj.nameSelect = this.returnAppAssetObj.TaxCityIssuer;
      this.InputLookupCityIssuerObj.jsonSelect = { provDistrictCode: this.returnAppAssetObj.TaxCityIssuer };

      if (this.returnAppAssetObj.TaxIssueDt != null) {
        this.AssetDataForm.patchValue({
          TaxIssueDt: formatDate(this.returnAppAssetObj.TaxIssueDt, 'yyyy-MM-dd', 'en-US')
        });
      }

      if (this.returnBranchManagerSupp != null) {
        this.AssetDataForm.patchValue({
          BranchManagerName: this.returnBranchManagerSupp.SupplEmpName,
          BranchManagerNo: this.returnBranchManagerSupp.SupplEmpNo,
          BranchManagerPositionCode: this.returnBranchManagerSupp.MrSupplEmpPositionCode
        });
        this.BranchManagerName = this.returnBranchManagerSupp.SupplEmpName;
      }

      if (this.returnAdminHeadSupp != null) {
        this.AssetDataForm.patchValue({
          AdminHeadName: this.returnAdminHeadSupp.SupplEmpName,
          AdminHeadNo: this.returnAdminHeadSupp.SupplEmpNo,
          AdminHeadPositionCode: this.returnAdminHeadSupp.MrSupplEmpPositionCode,
        })
      }

      if (this.returnSalesPersonSupp != null) {
        this.AssetDataForm.patchValue({
          SalesPersonName:this.returnSalesPersonSupp.SupplEmpName,
          SalesPersonNo:this.returnSalesPersonSupp.SupplEmpNo,
          SalesPersonPositionCode:this.returnSalesPersonSupp.MrSupplEmpPositionCode,
        });
      }

      if (this.returnAppCollateralRegistObj != null) {
        let reqByCode: GenericObj = new GenericObj();
        reqByCode.Code = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionCode;
        this.http.post(URLConstant.GetRefProfessionByCode, reqByCode).subscribe(
          (response) =>{
            this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response["ProfessionName"] };
          }
        );

        this.AssetDataForm.patchValue({
          UserName: this.returnAppCollateralRegistObj.UserName,
          MrUserRelationshipCode: this.returnAppCollateralRegistObj.MrUserRelationshipCode,
          OwnerName: this.returnAppCollateralRegistObj.OwnerName,
          MrIdTypeCode: this.returnAppCollateralRegistObj.MrIdTypeCode,
          OwnerIdNo: this.returnAppCollateralRegistObj.OwnerIdNo,
          MrOwnerRelationshipCode: this.returnAppCollateralRegistObj.MrOwnerRelationshipCode,
          OwnerAddr: this.returnAppCollateralRegistObj.OwnerAddr,
          OwnerAreaCode1: this.returnAppCollateralRegistObj.OwnerAreaCode1,
          OwnerAreaCode2: this.returnAppCollateralRegistObj.OwnerAreaCode2,
          OwnerAreaCode3: this.returnAppCollateralRegistObj.OwnerAreaCode3,
          OwnerAreaCode4: this.returnAppCollateralRegistObj.OwnerAreaCode4,
          OwnerCity: this.returnAppCollateralRegistObj.OwnerCity,
          OwnerZipcode: this.returnAppCollateralRegistObj.OwnerZipcode,
          OwnerMobilePhnNo: this.returnAppCollateralRegistObj.OwnerMobilePhnNo,
          LocationAddr: this.returnAppCollateralRegistObj.LocationAddr,
          LocationAreaCode1: this.returnAppCollateralRegistObj.LocationAreaCode1,
          LocationAreaCode2: this.returnAppCollateralRegistObj.LocationAreaCode2,
          LocationAreaCode3: this.returnAppCollateralRegistObj.LocationAreaCode3,
          LocationAreaCode4: this.returnAppCollateralRegistObj.LocationAreaCode4,
          LocationCity: this.returnAppCollateralRegistObj.LocationCity,
          LocationZipcode: this.returnAppCollateralRegistObj.LocationZipcode,
          SelfUsage: (this.returnAppCollateralRegistObj.MrUserRelationshipCode == "SELF"),
          SelfOwner: (this.returnAppCollateralRegistObj.MrOwnerRelationshipCode == "SELF"),
          OwnerProfessionCode: this.returnAppCollateralRegistObj.OwnerProfessionCode
        });

        this.SelfUsageChange({checked : (this.appAssetObj.ResponseAppCollateralRegistrationObj.MrUserRelationshipCode == "SELF")});
        this.SelfOwnerChange({checked : (this.appAssetObj.ResponseAppCollateralRegistrationObj.MrOwnerRelationshipCode == "SELF")});
      }
      
      this.AssetConditionChanged(this.mode);
      this.appAssetAccessoriesObjs = this.appAssetAccessoriesObjs;
      this.appAssetId = this.returnAppAssetObj.AppAssetId;
      this.appAssetObj.RowVersion = this.returnAppAssetObj.RowVersion;

      if (this.returnAppCollateralRegistObj != null) {
        this.setAddrOwnerObj();
        this.setAddrDelivObj();
        this.setAddrLocationObj();
      }

      this.DpTypeBefore = "AMT";
      this.assetMasterObj.FullAssetCode = this.returnAppAssetObj.FullAssetCode;
      await this.GetAssetMaster(this.assetMasterObj);
      this.GetRefAssetDocList(true);
      this.vendorObj.VendorCode = this.returnAppAssetObj.SupplCode;
      this.GetVendorForView();
      this.districtObj.ProvDistrictCode = this.returnAppAssetObj.TaxCityIssuer;
      this.GetProvDistrict();
      this.bindAccessories();
      this.updateValueDownPaymentPrctg();

      if (this.appAssetObj != null) {
        for (var i = 0; i < this.items.length; i++) {
          if (this.items.controls[i] != null) {
            this.items.controls[i]["controls"]["SerialNoValue"].value = this.appAssetObj["SerialNo" + (i + 1)];
          }
        }
      }
    }
  
    async getListAllAssetData() {
      this.appData = new AppDataObj();
      this.appData.AppId = this.AppId;
      var appData = { Id: this.AppId };
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
                  var appAssetAccObj = new AppAssetAccessoryObj();
                  var appCollateralAccObj = new AppCollateralAccessoryObj();
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
  
    initLookup() {
      this.InputLookupSupplierObj = this.initLookupSupp();
  
      this.InputLookupCityIssuerObj = new InputLookupObj();
      this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/NAP/lookupDistrict.json";
      this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
      this.InputLookupCityIssuerObj.pagingJson = "./assets/uclookup/NAP/lookupDistrict.json";
      this.InputLookupCityIssuerObj.genericJson = "./assets/uclookup/NAP/lookupDistrict.json";
      this.InputLookupCityIssuerObj.isRequired = false;
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

      this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
      this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
      this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
      this.InputLookupProfessionObj.isReady = true;
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
      console.log('TEST REF PROD COMPONENT SUPPL SCHEME');
      console.log(this.RefProdCmptSupplSchm.CompntValue);
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
  
    async bindAllRefMasterObj() {
      await this.bindAssetUsageObj();
      await this.bindIdTypeObj();
      await this.bindUserOwnerRelationshipObj();
      await this.bindAsseConditionObj();
      await this.bindDownPaymentTypeObj();
    }
  
    async bindAssetUsageObj() {
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetUsage;
      await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
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
          this.BizTemplateCode = this.AppObj.BizTemplateCode;
          this.OfficeCode = this.AppObj.OriOfficeCode;
          if (this.BizTemplateCode != CommonConstant.OPL) {
            this.GetProdOfferingAssetCond();
          }
        }
      );
    }
  
    GetProdOfferingAssetCond() {
      var obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
      obj.ProdOfferingCode = this.AppObj.ProdOfferingCode;
      obj.RefProdCompntCode = CommonConstant.RefProdCompAssetCond;
      obj.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;
  
      this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).subscribe(
        (response: any) => {
          this.assetCondObj = response;
          this.AssetDataForm.patchValue({
            MrAssetConditionCode: this.assetCondObj.CompntValue
          });
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
          this.AssetDataForm.patchValue({
            TaxCityIssuer: this.DistrictObj.provDistrictCode
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
              var supervisor = {
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
  
    async GetAssetMaster(assetMasterObj) {
      await this.http.post(URLConstant.GetAssetMasterTypeByFullAssetCode, { Code: assetMasterObj.FullAssetCode }).toPromise().then(
        (response: any) => {
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
  
    AssetConditionChanged(mode: string = "add") {
      if (this.AssetConditionObj != null) {
        var filter: any;
        filter = this.AssetConditionObj.filter(
          cond => cond.Key == this.AssetDataForm.controls.MrAssetConditionCode.value);
        
        this.AssetConditionName = filter[0].Value;
        if(this.AssetConditionName == CommonConstantX.REF_MASTER_ASSET_CONDITION_DESCR_USED)
        {
          for (let i = 0; i < this.items.length; i++) 
          {
            this.items.controls[i]['controls']['SerialNoValue'].setValidators(Validators.pattern(this.SerialNoRegex));
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }
 
      }
      if (this.AssetDataForm.controls.MrAssetConditionCode.value != '' && this.AssetDataForm.controls.MrAssetConditionCode.value != undefined && this.AssetDataForm.controls.ManufacturingYear.value != '' && this.AssetDataForm.controls.ManufacturingYear.value != undefined && this.AssetDataForm.controls.AssetCategoryCode.value != '' && this.AssetDataForm.controls.AssetCategoryCode.value != undefined && this.AssetDataForm.controls.MrAssetUsageCode.value != '' && this.AssetDataForm.controls.MrAssetUsageCode.value != undefined) {
        this.SetDpValue(mode);
      }
    }
  
    setAddrOwnerObj() {
      this.inputFieldOwnerAddrObj = new InputFieldObj();
      this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
  
      this.ownerAddrObj = new AddrObj();
      this.ownerAddrObj.Addr = this.returnAppCollateralRegistObj.OwnerAddr;
      this.ownerAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.OwnerAreaCode1;
      this.ownerAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.OwnerAreaCode2;
      this.ownerAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.OwnerAreaCode3;
      this.ownerAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.OwnerAreaCode4;
      this.ownerAddrObj.City = this.returnAppCollateralRegistObj.OwnerCity;
  
      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.OwnerZipcode;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.OwnerZipcode };
      this.inputAddressObjForOwner.default = this.ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
    }
  
    setAddrDelivObj() {
      this.inputFieldDelivAddrObj = new InputFieldObj();
      this.inputFieldDelivAddrObj.inputLookupObj = new InputLookupObj();
  
      this.delivAddrObj = new AddrObj();
      this.delivAddrObj.Addr = this.returnAppCollateralRegistObj.DelivAddr;
      this.delivAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.DelivAreaCode1;
      this.delivAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.DelivAreaCode2;
      this.delivAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.DelivAreaCode3;
      this.delivAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.DelivAreaCode4;
      this.delivAddrObj.City = this.returnAppCollateralRegistObj.DelivCity;
  
      this.inputFieldDelivAddrObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.DelivZipcode;
      this.inputFieldDelivAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.DelivZipcode };
      this.inputAddressObjForDeliv.default = this.delivAddrObj;
      this.inputAddressObjForDeliv.inputField = this.inputFieldDelivAddrObj;
    }
  
    setAddrLocationObj() {
      this.inputFieldLocationAddrObj = new InputFieldObj();
      this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
  
      this.locationAddrObj = new AddrObj();
      this.locationAddrObj.Addr = this.returnAppCollateralRegistObj.LocationAddr;
      this.locationAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.LocationAreaCode1;
      this.locationAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.LocationAreaCode2;
      this.locationAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.LocationAreaCode3;
      this.locationAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.LocationAreaCode4;
      this.locationAddrObj.City = this.returnAppCollateralRegistObj.LocationCity;
  
      this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.LocationZipcode;
      this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.LocationZipcode };
      this.inputAddressObjForLoc.default = this.locationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
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
  
    deleteAccessory(i) {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        var appAccessoryObjs = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
        var no = appAccessoryObjs.controls[i]["controls"]["No"].value;
        appAccessoryObjs.removeAt(i);
        this.AssetDataForm.removeControl("lookupSupplierObj" + no);
        this.AssetDataForm.removeControl("lookupAccObj" + no);
      }
    }
  
    bindAccessories() {
      if (this.appAssetAccessoriesObjs != undefined) {
        this.originalAppAssetAccessory = [...this.appAssetAccessoriesObjs];
        for (let i = 0; i < this.appAssetAccessoriesObjs.length; i++) {
          var listAppAccessories = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
          listAppAccessories.push(this.addGroup(this.appAssetAccessoriesObjs[i], i));
  
          var InputLookupAccObj = this.initLookupAcc();
          var InputLookupAccSupObj = this.initLookupSuppAcc();
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
          AssetAccessoryName: ['', [Validators.maxLength(100)]],
          SupplCodeAccessory: ['', [Validators.required, Validators.maxLength(50)]],
          SupplNameAccessory: ['', [Validators.required, Validators.maxLength(100)]],
          AccessoryPriceAmt: [0, [Validators.required,Validators.min(0.00)]],
          AccessoryDownPaymentType: [''],
          AccessoryDownPaymentPrcnt: [0, Validators.required],
          AccessoryDownPaymentAmt: [0, [Validators.required,Validators.min(0.00)]],
          AccessoryNotes: ['']
        })
      }
      else {
        return this.fb.group({
          No: [i],
          AssetAccessoryCode: [appAssetAccessoriesObj.AssetAccessoryCode, [Validators.required, Validators.maxLength(50)]],
          AssetAccessoryName: [appAssetAccessoriesObj.AssetAccessoryName, [Validators.maxLength(100)]],
          SupplCodeAccessory: [appAssetAccessoriesObj.SupplCode, [Validators.required, Validators.maxLength(50)]],
          SupplNameAccessory: [appAssetAccessoriesObj.SupplName, [Validators.required, Validators.maxLength(100)]],
          AccessoryPriceAmt: [appAssetAccessoriesObj.AccessoryPriceAmt, [Validators.required,Validators.min(0.00)]],
          AccessoryDownPaymentType: [this.DpObj[0].Key],
          AccessoryDownPaymentPrcnt: [appAssetAccessoriesObj.DownPaymentPrcnt, Validators.required],
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
  
        this.inputAddressObjForLoc.default = this.locationAddrObj;
        this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
      }
    }
  
    CheckValue() {
      this.allAssetDataObj = new AllAssetDataObj();
      this.setAllAssetObj();
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
      var appObj = {
        Id: this.AppId,
      };
      await this.http.post(URLConstant.GetAppCustByAppId, appObj).toPromise().then(
        (response) => {
          this.AppCustObj = response;
          this.CustType = this.AppCustObj.MrCustTypeCode;
          if (this.CustType == CommonConstant.CustTypePersonal) {
            this.AssetDataForm.controls.MrIdTypeCode.setValidators([Validators.required, Validators.maxLength(50)]);
            this.AssetDataForm.controls.MrIdTypeCode.updateValueAndValidity();
          }
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
  
    async GetRefProdCompt() {
      var appObj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
      appObj.ProdOfferingCode = this.AppObj.ProdOfferingCode;
      appObj.RefProdCompntCode = CommonConstant.RefProdCompntAssetType;
      appObj.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;
  
      await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
        (response: any) => {
          this.RefProdCmptAssetType = response;
        }
      );
  
      var appObj2: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
      appObj2.ProdOfferingCode = this.AppObj.ProdOfferingCode;
      appObj2.RefProdCompntCode = CommonConstant.RefProdCompntSupplSchm;
      appObj2.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;
  
      await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj2).toPromise().then(
        (response: any) => {
          this.RefProdCmptSupplSchm = response;
        }
      );
  
      var appObj3: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
      appObj3.ProdOfferingCode = this.AppObj.ProdOfferingCode;
      appObj3.RefProdCompntCode = CommonConstant.RefProdCompntAssetSchm;
      appObj3.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;
  
      await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj3).toPromise().then(
        (response: any) => {
          this.RefProdCmptAssetSchm = response;
        }
      );
    }

    GetRefAssetDocList(isInit: boolean) {
      this.http.post(URLConstantX.GetRefAssetDocList, { Code: this.AssetDataForm.get("AssetTypeCode").value }).subscribe(
        (response) => {
          let ListDoc = this.AssetDataForm.get('ListDoc') as FormArray;
          ListDoc.reset();
          while(ListDoc.length !== 0) {
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
                IsExpDtMandatory: response[CommonConstant.ReturnObj][i].IsExpDtMandatory,
                RowVersion: "",
              }) as FormGroup;
              ListDoc.push(assetDocumentDetail);
            }

            //Validasi AssetDoc Asset Condition
            if(this.AssetDataForm.controls.MrAssetConditionCode.value == CommonConstantX.APP_ASSET_CONDITION_CODE_NEW)
            {
              for (let i = 0; i < ListDoc.length; i++) 
              {
                if(ListDoc.controls[i]['controls']['IsMandatoryNew'].value)
                {
                  ListDoc.controls[i]['controls']['IsReceived'].setValidators(Validators.requiredTrue);
                  ListDoc.controls[i]['controls']['IsReceived'].updateValueAndValidity();
                }
              }
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
              this.AssetDataForm.controls.ListDoc["controls"][i].patchValue({
                DocNo: AppCollateralDocs[i].DocNo,
                DocNotes: AppCollateralDocs[i].DocNotes,
                ACDExpiredDt: AppCollateralDocs[i].ExpiredDt == null ? "" : formatDate(AppCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                IsReceived: AppCollateralDocs[i].IsReceived,
                RowVersion: AppCollateralDocs[i].RowVersion,
              });
            }
          }
        });
    }

    ReceiveDocument(idx)
    {
      var listDoc = this.AssetDataForm.get('ListDoc') as FormArray;
      var DocReceived = listDoc.at(idx);

      if(DocReceived['controls']['IsReceived'].value){
        if(DocReceived['controls']['IsValueNeeded'].value){
          DocReceived['controls']['DocNo'].setValidators(Validators.required);
          DocReceived['controls']['DocNo'].updateValueAndValidity();
        }

        if(DocReceived['controls']['IsExpDtMandatory'].value){
          DocReceived['controls']['ACDExpiredDt'].setValidators(Validators.required);
          DocReceived['controls']['ACDExpiredDt'].updateValueAndValidity();
        }
      }
      else{
        DocReceived['controls']['DocNo'].clearValidators();
        DocReceived['controls']['DocNo'].updateValueAndValidity();

        DocReceived['controls']['ACDExpiredDt'].clearValidators();
        DocReceived['controls']['ACDExpiredDt'].updateValueAndValidity();
      }
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
  
    GenerataAppAssetAttr(isRefresh: boolean) {
      var GenObj =
      {
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
        });
    }
  
    refreshAttr() {
      this.isAssetAttrReady = false;
      this.GenerataAppAssetAttr(true);
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
  
    addGroupAppAssetAttr(appAssetAttrObj: AppAssetAttrCustomObj, i: number) {
      let ListValidator: Array<ValidatorFn> = this.setValidators(appAssetAttrObj);
  
      return this.setFbGroupAssetAttribute(appAssetAttrObj, i, ListValidator);
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
  
    CheckAccessoryDPValue(i: number, from: string){
      var InputAccessoryPrice = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryPriceAmt.value
  
      if(InputAccessoryPrice == 0){
        this.toastr.warningMessage(ExceptionConstant.ACCESSORY_PRICE_NOT_SET + " No " + (i+1));
        this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(0);
        this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(0);
        return;
      }
  
      var InputDPAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.value
  
      if(InputDPAmt > InputAccessoryPrice){
        this.toastr.warningMessage("Down Payment Amount " + (i+1) + ExceptionConstant.CANNOT_BE_HIGHER_THAN_ACCESSORY_PRICE + " No " + (i+1));
        this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(0);
        this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(0);
        return;
      }
  
      var InputDPPrcnt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.value
      
      if(from == CommonConstant.DownPaymentTypeAmt){
        var DPPrcnt = InputDPAmt / InputAccessoryPrice * 100;
        this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(DPPrcnt);
      }else if(from == CommonConstant.DownPaymentTypePrcnt){
        var DPAmt = InputAccessoryPrice * InputDPPrcnt / 100;
        this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(DPAmt);
      }else{
        if(this.AssetDataForm.controls['AssetAccessoriesObjs']['controls'][i]['controls'].AccessoryDownPaymentType.value == CommonConstant.DownPaymentTypeAmt){
          var DPPrcnt = InputDPAmt / InputAccessoryPrice * 100;
          this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(DPPrcnt);
        }else{
          var DPAmt = InputAccessoryPrice * InputDPPrcnt / 100;
          this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(DPAmt);
        }
      }
    }
  }
  