import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { VendorEmpObj } from 'app/shared/model/VendorEmp.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AllAssetDataObj } from 'app/shared/model/AllAssetDataObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AppCollateralAttrObj } from 'app/shared/model/AppCollateralAttrObj.Model';
import { LookupTaxCityIssuerComponent } from '../collateral-add-edit/lookup-tax-city-issuer/lookup-tax-city-issuer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { map, mergeMap, first } from 'rxjs/operators';
import { AppObj } from 'app/shared/model/App/App.Model';
import { forkJoin } from 'rxjs';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { AppAssetAccessoryObj } from 'app/shared/model/AppAssetAccessoryObj.model';
import { AppCollateralAccessoryObj } from 'app/shared/model/AppCollateralAccessoryObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { AppAssetAttrCustomObj } from 'app/shared/model/AppAsset/AppAssetAttrCustom.Model';
import { AppAssetAttrObj } from 'app/shared/model/AppAssetAttrObj.Model';
import { CustomPatternObj } from 'app/shared/model/library/CustomPatternObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj } from 'app/shared/model/Request/Vendor/ReqVendorEmp.model';
import { String } from 'typescript-string-operations';
import { AssetTypeSerialNoLabelCustomObj } from 'app/shared/model/AssetTypeSerialNoLabelCustomObj.Model';
import { GenericListByCodeObj } from 'app/shared/model/Generic/GenericListByCodeObj.model';

@Component({
  selector: 'app-asset-data-add-edit',
  templateUrl: './asset-data-add-edit.component.html'
})
export class AssetDataAddEditComponent implements OnInit {
  @Input() mode: string;
  @Input() AppAssetId: number;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() assetValue: EventEmitter<object> = new EventEmitter();
  currentChassisNo: string = "";
  @Input() AppId: number;
  LobCode: string;
  pageType: string = "add";
  custType: string;
  listBranchObj: any;
  salesObj: VendorEmpObj;
  listSalesObj: any;
  adminHeadObj: any;
  listAdminHeadObj: any;
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
  IsIntegrator: boolean = false;

  AddrResidenceObj: any;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AppCustAddrObj;
  AppCustAddrObj: any;
  appCustAddrObj: any;
  returnAppCustAddrObj: any;
  allAssetDataObj: AllAssetDataObj;
  returnRefCoyObj: any;
  appCustObj: any;
  assetUsageObj: any
  returnAssetUsageObj: any;
  appAssetObj: any;
  returnAppAssetObj: any;
  reqAssetMasterObj: any;
  resAssetMasterObj: any;
  appCollateralObj: any;
  returnAppCollateralObj: any;
  appCollateralRegistObj: any;
  returnAppCollateralRegistObj: any;
  appAssetSupplEmpObj: any;
  returnAppAssetSupplEmpObj: any;
  vendorObj: any;
  returnVendorObj: any;
  salesAppAssetSupplEmpObj: any;
  headAppAssetSupplEmpObj: any;
  appAssetSupplEmpBranchObj: any;
  branchAppAssetSupplEmpObj: any;
  isLicensePlateMandatory: boolean = false;
  isEngineNoMandatory: boolean = false;
  isChassisNoMandatory: boolean = false;
  appData: AppObj;
  grossDPPrcnt: number = 0;
  items: FormArray;
  SerialNoList: Array<AssetTypeSerialNoLabelCustomObj>;
  originalAssetAccs: Array<AppAssetAccessoryObj>;
  assetTypeCompntValue: string;
  AppAssetAttrObj: any;
  isDiffWithRefAttr: boolean;
  appAssetAttrObjs: Array<AppAssetAttrCustomObj>;
  ListAttrAnswer = [];
  isAssetAttrReady: boolean = false;
  isUsed : boolean = false;


  InputLookupAccObj: any;
  InputLookupAccSupObj: any;
  appAssetAccessoriesObjs: Array<AppAssetAccessoryObj>;
  OfficeCode: any;
  dictAccLookup: { [key: string]: any; } = {};
  dictSuppLookup: { [key: string]: any; } = {};
  InputLookupAcceObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  InputLookupSupplObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  accObj = {
    AssetAccessoryCode: "",
  };
  vendorAccSuppObj = {
    VendorId: 0,
    VendorCode: "",
  };
  vendorSchmCode: any;
  AssetValidationResult: any;
  AssetDataForm = this.fb.group({
    SupplName: [''],
    SupplCode: [''],

    BranchManagerName: [''],
    BranchManagerNo: [''],
    BranchManagerCode: [''],

    SalesPersonId: ['', Validators.required],
    SalesPersonName: ['', [Validators.required, Validators.maxLength(500)]],
    SalesPersonNo: ['', [Validators.required, Validators.maxLength(50)]],
    SalesPersonPositionCode: ['', [Validators.required, Validators.maxLength(50)]],

    AdminHeadId: [''],
    AdminHeadName: [''],
    AdminHeadNo: [''],
    AdminHeadPositionCode: [''],

    FullAssetCode: [''],
    FullAssetName: [''],
    AssetCategoryCode: [''],
    AssetTypeCode: [''],
    MrDownPaymentTypeCode: ['', Validators.required],
    AssetPrice: ['', [Validators.required, Validators.min(1.00)]],
    DownPayment: ['', Validators.required],
    MrAssetConditionCode: [''],
    AssetUsage: [''],
    LicensePlate: [''],
    ChassisNo: [''],
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.max(new Date().getFullYear())]],
    EngineNo: [''],
    Notes: [''],

    TaxIssueDt: [''],
    Color: [''],
    TaxCityIssuer: [''],

    SelfUsage: [false],
    Username: [''],
    UserRelationship: [''],
    OwnerName: [''],
    OwnerIdType: [''],
    OwnerIdNo: [''],
    OwnerAddr: [''],
    OwnerAreaCode1: [''],
    OwnerAreaCode2: [''],
    OwnerAreaCode3: [''],
    OwnerAreaCode4: [''],
    OwnerZipcode: [''],
    OwnerMobilePhn: [''],

    LocationAddrType: [''],

    DownPaymentPrctg: [''],
    DownPaymentAmt: [''],
    items: this.fb.array([]),
    AssetAccessoriesObjs: this.fb.array([]),
    AppAssetAttrObjs: this.fb.array([])
  });

  appObj = {
    Id: 0,
  };
  inputAddressObjForLoc: InputAddressObj;
  EmpObj: any;
  vendorEmpSalesObj = {
    VendorId: 0,
    VendorEmpId: 0,
    VendorEmpNo: "",
  };
  vendorEmpAdminHeadObj = {
    VendorId: 0,
    VendorEmpId: 0,
    VendorEmpNo: "",
  };
  generalSettingObj: GenericListByCodeObj;
  IntegratorCheckBySystemGsValue: string = "1";
  IsUseDigitalization: string;
  LastRequestedDate: Date;
  indexChassis: number = 0;
  SerialNoRegex: string;
  ListPattern: Array<CustomPatternObj> = new Array<CustomPatternObj>();
  InputLookupCityIssuerObj : any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private modalService: NgbModal, private cookieService: CookieService) {
    this.originalAssetAccs = new Array<AppAssetAccessoryObj>();

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
      if (params["LobCode"] != null) {
        this.LobCode = params["LobCode"];
      }
    });
  }

  back() {
    this.assetValue.emit({ mode: 'paging' });
  }
  AssetPrice: number;
  DPAmount: number;
  DPAmtChange() {
    this.AssetPrice = this.AssetDataForm.controls["AssetPrice"].value;
    this.DPAmount = this.AssetDataForm.controls["DownPayment"].value;

    if (this.DPAmount > this.AssetPrice) {
      this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_LESS_THAN + "Asset Price!");
      return;
    }
  }

  SetAsset(event) {
    this.AssetDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode,
      AssetTypeCode: event.AssetTypeCode
    });
    if (this.checkAssetValidationRequirement()) {
      this.CheckDP();
    }
  }

  async GetGS(){
    this.generalSettingObj = new GenericListByCodeObj();
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization); 

    await this.http.post(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).toPromise().then(
      (response) => {
        var returnGeneralSettingObj = response;

        var gsNeedCheckBySystem = returnGeneralSettingObj["ResGetListGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        var gsUseDigitalization = returnGeneralSettingObj["ResGetListGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);
        
        if(gsNeedCheckBySystem != undefined){
          this.IntegratorCheckBySystemGsValue = gsNeedCheckBySystem.GsValue;
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if(gsUseDigitalization != undefined){
          this.IsUseDigitalization = gsUseDigitalization.GsValue;
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }        
      }
    );
  }
  async GetThirdPartyResultH(){
    var ChassisNoValue = this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value;
    await this.http.post(URLConstant.GetAppAssetFromThirdPartyResultHByTrxTypeCodeAndTrxNoAndChassisNoForFraudChecking, {TrxNo : this.appData.AppNo, TrxTypeCode : "APP", ChassisNo : ChassisNoValue}).toPromise().then(
      (response) => {
        console.log(response);
        if(response["AppAssetObject"]["SerialNo1"] != null){
          this.currentChassisNo = response["AppAssetObject"]["SerialNo1"];
        }
        if(response["ResponseThirdPartyRsltH"]["ThirdPartyRsltHId"] != null){
        this.LastRequestedDate = response["ResponseThirdPartyRsltH"]["ReqDt"];
        }
      }
    );
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
  GetListAddr() {
    this.appObj.Id = this.AppId;
    this.http.post(URLConstant.GetListAppCustAddrByAppId, this.appObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ LocationAddrType: response[CommonConstant.ReturnObj][0]['AppCustAddrId'] });
      }
    );
  }

  copyToLocationAddr() {
    // this.appCustAddrObj = new AppCustAddrObj();
    // this.appCustAddrObj.AppCustAddrId = this.AssetDataForm.controls["LocationAddrType"].value;
    var appCustAddrObj = { Id: this.AssetDataForm.controls["LocationAddrType"].value };
    this.http.post(URLConstant.GetAppCustAddrByAppCustAddrId, appCustAddrObj).subscribe(
      (response) => {
        this.returnAppCustAddrObj = response;

        this.locationAddrObj = new AppCustAddrObj();
        this.locationAddrObj.Addr = this.returnAppCustAddrObj.Addr;
        this.locationAddrObj.AreaCode3 = this.returnAppCustAddrObj.AreaCode3;
        this.locationAddrObj.AreaCode4 = this.returnAppCustAddrObj.AreaCode4;
        this.locationAddrObj.AreaCode1 = this.returnAppCustAddrObj.AreaCode1;
        this.locationAddrObj.AreaCode2 = this.returnAppCustAddrObj.AreaCode2;
        this.locationAddrObj.City = this.returnAppCustAddrObj.City;

        this.inputFieldLocationAddrObj.inputLookupObj.isRequired = false;
        this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.returnAppCustAddrObj.Zipcode;
        this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCustAddrObj.Zipcode };
        this.inputAddressObjForLoc.default = this.locationAddrObj;
        this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
      });
  }

  SetSupplier(event) {
    this.AssetDataForm.patchValue({
      SupplName: event.VendorName,
      SupplCode: event.VendorCode
    });


    this.salesObj = new VendorEmpObj();
    this.salesObj.VendorId = event.VendorId;
    this.salesObj.MrVendorEmpPositionCode = CommonConstant.SALES_JOB_CODE;
    this.GetSalesList();
    this.GetAdminHeadList();
  }

  GetSalesList() {
    let ReqGetListActiveVendorSales : ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj = new ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj;
    ReqGetListActiveVendorSales.VendorId =this.salesObj.VendorId;
    ReqGetListActiveVendorSales.MrVendorEmpPositionCodes = [CommonConstant.SALES_JOB_CODE];
    this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, ReqGetListActiveVendorSales).subscribe(
      (response) => {
        this.EmpObj = response[CommonConstant.ReturnObj];
        this.listSalesObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === CommonConstant.SALES_JOB_CODE);
      }
    );
  }

  GetAdminHeadList() {
    let ReqGetListActiveVendorAdminHead : ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj = new ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj;
    ReqGetListActiveVendorAdminHead.VendorId = this.salesObj.VendorId;
    ReqGetListActiveVendorAdminHead.MrVendorEmpPositionCodes = [CommonConstant.ADMIN_HEAD_JOB_CODE];
    this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, ReqGetListActiveVendorAdminHead).subscribe(
      (response) => {
        this.EmpObj = response[CommonConstant.ReturnObj];
        this.listAdminHeadObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === CommonConstant.ADMIN_HEAD_JOB_CODE);
      }
    );
  }

  GetAppCust() {
    var appObj = {
      Id: this.AppId,
    };
    this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
      (response) => {
        this.appCustObj = response;
        this.AssetDataForm.patchValue({
          Username: this.appCustObj.CustName,
          UserRelationship: "SELF",
        });
      }
    );
  }

  assetUsageHandler() {
    if (this.checkAssetValidationRequirement()) {
      this.CheckDP();
    }
  }

  manufacturingYearHandler() {
    if (this.checkAssetValidationRequirement()) {
      this.CheckDP();
    }
  }

  checkAssetValidationRequirement() {
    var hasAssetCondition = this.AssetDataForm.controls["MrAssetConditionCode"].value != '' && this.AssetDataForm.controls["MrAssetConditionCode"].value != undefined ? true : false;
    var hasAssetUsage = this.AssetDataForm.controls["AssetUsage"].value != '' && this.AssetDataForm.controls["AssetUsage"].value != undefined ? true : false;
    var hasManufacturingYear = this.AssetDataForm.controls["ManufacturingYear"].value != '' && this.AssetDataForm.controls["ManufacturingYear"].value != undefined ? true : false;
    var hasAssetCategory = this.AssetDataForm.controls["AssetCategoryCode"].value != '' && this.AssetDataForm.controls["AssetCategoryCode"].value != undefined ? true : false;
    if (hasAssetCondition && hasAssetUsage && hasManufacturingYear && hasAssetCategory) {
      return true;
    }
    else {
      return false;
    }
  }

  SelfUsageChange(event) {
    if (event.checked == true) {
      this.GetAppCust();
      this.AssetDataForm.controls.Username.clearValidators();
      this.AssetDataForm.controls.Username.updateValueAndValidity();
      this.AssetDataForm.controls.UserRelationship.clearValidators();
      this.AssetDataForm.controls.UserRelationship.updateValueAndValidity();
      this.AssetDataForm.controls["Username"].disable();
      this.AssetDataForm.controls["UserRelationship"].disable();
    };

    if (event.checked == false) {
      this.AssetDataForm.controls.Username.setValidators([Validators.required, Validators.maxLength(100)]);
      this.AssetDataForm.controls.Username.updateValueAndValidity();
      this.AssetDataForm.controls.UserRelationship.setValidators([Validators.required, Validators.maxLength(50)]);
      this.AssetDataForm.controls.UserRelationship.updateValueAndValidity();
      this.AssetDataForm.controls["Username"].enable();
      this.AssetDataForm.controls["UserRelationship"].enable();
    };
  }

  BranchChanged(event) {
    this.AssetDataForm.patchValue({
      BranchManagerName: this.listBranchObj.find(x => x.Key == event.target.value).Value
    });
  }

  SalesPersonChanged(event) {
    if (event.target.value != "") {
      var temp: any;
      temp = this.listSalesObj.filter(
        emp => emp.VendorEmpId == event.target.value);
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

  AdminChanged(event) {
    if (event.target.value != "") {
      //this.vendorEmpObj.VendorEmpId = event.target.value;
      //this.GetVendorEmpSupervisi();

      var temp: any;
      temp = this.listAdminHeadObj.filter(
        emp => emp.VendorEmpId == event.target.value);
      this.AssetDataForm.patchValue({
        AdminHeadId: temp[0].VendorEmpId,
        AdminHeadName: temp[0].VendorEmpName,
        AdminHeadNo: temp[0].VendorEmpNo,
        AdminHeadPositionCode: temp[0].MrVendorEmpPositionCode,
      });
    }
    else {
      this.AssetDataForm.patchValue({
        AdminHeadName: "",
        AdminHeadNo: "",
        AdminHeadPositionCode: "",
      });
    }
  }

  async AssetValidationForSave() {
    var CheckValidObj = {
      AssetCondition: this.AssetDataForm.controls["MrAssetConditionCode"].value,
      ManufacturingYear: this.AssetDataForm.controls["ManufacturingYear"].value,
      Tenor: this.appData.Tenor,
      AssetCategoryCode: this.AssetDataForm.controls["AssetCategoryCode"].value,
      MrAssetUsageCode: this.AssetDataForm.controls["AssetUsage"].value,
      AppId: this.AppId
    }
    await this.http.post(URLConstant.CheckAssetValidationRule, CheckValidObj).toPromise().then(
      (response) => {
        this.AssetValidationResult = response;
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  AssetValidation() {
    var CheckValidObj = {
      AppId: this.AppId,
      AssetCondition: this.AssetDataForm.controls["MrAssetConditionCode"].value,
      ManufacturingYear: this.AssetDataForm.controls["ManufacturingYear"].value,
      Tenor: this.appData.Tenor,
      AssetCategoryCode: this.AssetDataForm.controls["AssetCategoryCode"].value,
      MrAssetUsageCode: this.AssetDataForm.controls["AssetUsage"].value
    }
    return this.http.post(URLConstant.CheckAssetValidationRule, CheckValidObj).pipe(first());
  }

  CheckDP() {
    const assetCondition = this.AssetDataForm.controls["MrAssetConditionCode"].value;
    const manufacturingYear = this.AssetDataForm.controls["ManufacturingYear"].value;
    const assetCategory = this.AssetDataForm.controls["AssetCategoryCode"].value;
    const assetUsage = this.AssetDataForm.controls["AssetUsage"].value;
    if (assetCondition && manufacturingYear && assetCategory && assetUsage) {
      let getAssetValidationRule = this.AssetValidation();
      getAssetValidationRule.subscribe(
        (response) => {
          var assetValidationRule = response;
          this.AssetValidationResult = response;
          this.grossDPPrcnt = assetValidationRule["DPPrcnt"];
          if (assetValidationRule["DPPrcnt"] != null) {
            this.AssetDataForm.patchValue({
              DownPaymentPrctg: assetValidationRule["DPPrcnt"],
              DownPayment: (assetValidationRule["DPPrcnt"] / 100) * this.AssetDataForm.controls["AssetPrice"].value
            });
          }
          if (assetValidationRule["DPBhv"] == CommonConstant.RuleBehaviourLock) {
            if (this.AssetDataForm.controls.MrDownPaymentTypeCode.value == 'PRCTG') {
              this.AssetDataForm.controls.DownPaymentPrctg.disable();
              this.AssetDataForm.controls["DownPaymentPrctg"].clearValidators();
              this.AssetDataForm.controls["DownPaymentPrctg"].updateValueAndValidity();
            }
            else {
              this.AssetDataForm.controls.DownPayment.disable();
              this.AssetDataForm.controls["DownPayment"].clearValidators();
              this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
            }
          }
          else {
            if (this.AssetDataForm.controls.MrDownPaymentTypeCode.value == 'PRCTG') {
              this.AssetDataForm.controls.DownPaymentPrctg.enable();
              this.AssetDataForm.controls.DownPayment.disable();
              this.AssetDataForm.controls["DownPaymentPrctg"].setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
              this.AssetDataForm.controls["DownPaymentPrctg"].updateValueAndValidity();
            }
            else {
              this.AssetDataForm.controls.DownPayment.enable();
              this.AssetDataForm.controls.DownPaymentPrctg.disable();
              this.AssetDataForm.controls["DownPayment"].setValidators([Validators.required, Validators.min(0)]);
              this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
            }
          }
          // this.grossDPPrcnt = assetValidationRule["GrossDPPrctg"];
          // if (this.AssetDataForm.controls["MrDownPaymentTypeCode"].value == CommonConstant.DownPaymentTypePrcnt) {
          //   if (assetValidationRule["DPGrossBehaviour"] == 'MIN') {
          //     this.AssetDataForm.patchValue({
          //       DownPayment: assetValidationRule["GrossDPPrctg"]
          //     });
          //     this.AssetDataForm.controls["DownPayment"].setValidators([Validators.required, Validators.min(assetValidationRule["GrossDPPrctg"]), Validators.max(100)]);
          //     this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
          //   }
          // }
          // if (this.AssetDataForm.controls["MrDownPaymentTypeCode"].value == 'AMT') {
          //   if (assetValidationRule["DPGrossBehaviour"] == 'MIN') {
          //     var minDP = this.AssetDataForm.controls["AssetPrice"].value * assetValidationRule["GrossDPPrctg"] / 100;
          //     this.AssetDataForm.patchValue({
          //       DownPayment: minDP
          //     });
          //     this.AssetDataForm.controls["DownPayment"].setValidators([Validators.required, Validators.min(minDP)]);
          //     this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
          //   }
          // }
        });
    }
  }

  downPaymentChange() {
    var value = this.AssetDataForm.controls["MrDownPaymentTypeCode"].value;
    if (this.AssetValidationResult && this.AssetValidationResult["DPBhv"]) {
      if (this.AssetValidationResult["DPBhv"] == CommonConstant.RuleBehaviourLock) {
        if (value == "AMT") {
          this.AssetDataForm.controls["DownPayment"].disable();
          this.AssetDataForm.controls["DownPayment"].clearValidators();
          this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
        }
        else {
          this.AssetDataForm.controls["DownPaymentPrctg"].disable();
          this.AssetDataForm.controls["DownPaymentPrctg"].clearValidators();
          this.AssetDataForm.controls["DownPaymentPrctg"].updateValueAndValidity();
        }
      }
      else {
        if (value == "AMT") {
          this.AssetDataForm.controls["DownPayment"].enable();
          this.AssetDataForm.controls["DownPaymentPrctg"].disable();
          this.AssetDataForm.controls["DownPayment"].setValidators([Validators.required, Validators.min(0)]);
          this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
        }
        else {
          this.AssetDataForm.controls["DownPaymentPrctg"].enable();
          this.AssetDataForm.controls["DownPayment"].disable();
          this.AssetDataForm.controls["DownPaymentPrctg"].setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
          this.AssetDataForm.controls["DownPaymentPrctg"].updateValueAndValidity();
        }
      }
    } else {
      if (value == "AMT") {
        this.AssetDataForm.controls["DownPayment"].enable();
        this.AssetDataForm.controls["DownPaymentPrctg"].disable();
        this.AssetDataForm.controls["DownPayment"].setValidators([Validators.required, Validators.min(0)]);
        this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
      }
      else {
        this.AssetDataForm.controls["DownPaymentPrctg"].enable();
        this.AssetDataForm.controls["DownPayment"].disable();
        this.AssetDataForm.controls["DownPaymentPrctg"].setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
        this.AssetDataForm.controls["DownPaymentPrctg"].updateValueAndValidity();
      }
    }
  }
  readonly AssetUsed: string = CommonConstant.AssetConditionUsed;
  async ngOnInit(): Promise<void> {
    this.InputLookupCityIssuerObj = new InputLookupObj();
    this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url;
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

    this.AssetDataForm.updateValueAndValidity();

    this.items = this.AssetDataForm.get('items') as FormArray;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.title = "Asset Location";
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;
    this.inputAddressObjForLoc.showOwnership = false;

    var datePipe = new DatePipe("en-US");
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationAddrObj.inputLookupObj.isRequired = false;
    this.AssetDataForm.controls.MrAssetConditionCode.disable();
    if (this.mode == 'editAsset') {
      // this.AssetDataForm.controls['ManufacturingYear'].setValidators([Validators.required]);
      // this.AssetDataForm.controls['ManufacturingYear'].updateValueAndValidity();

      this.appAssetObj = new AppAssetObj();
      this.appAssetObj.AppAssetId = this.AppAssetId;
      var appAssetObj = { Id: this.AppAssetId };
      await this.http.post(URLConstant.GetAllAssetDataByAppAssetId, appAssetObj).toPromise().then(
        (response) => {
          this.returnAppAssetObj = response["ResponseAppAssetObj"];
          this.AssetDataForm.patchValue({
            MrAssetConditionCode: this.returnAppAssetObj.MrAssetConditionCode,
            MrAssetConditionCodeView: this.returnAppAssetObj.MrAssetConditionCode,
            AssetUsage: this.returnAppAssetObj.MrAssetUsageCode,
            AssetPrice: this.returnAppAssetObj.AssetPriceAmt,
            DownPayment: this.returnAppAssetObj.DownPaymentAmt,
            Notes: this.returnAppAssetObj.AssetNotes,
            ManufacturingYear: this.returnAppAssetObj.ManufacturingYear,
            AssetTypeCode: this.returnAppAssetObj.AssetTypeCode,
            AssetCategoryCode: this.returnAppAssetObj.AssetCategoryCode,
            Color: this.returnAppAssetObj.Color,
            TaxCityIssuer: this.returnAppAssetObj.TaxCityIssuer,
            TaxIssueDt: datePipe.transform(this.returnAppAssetObj.TaxIssueDt, "yyyy-MM-dd")
          });

          this.ChangeAssetCondition();
          this.updateValueDownPaymentPrctg();
          this.appAssetAccessoriesObjs = response["ResponseAppAssetAccessoryObjs"];
        });

        this.InputLookupCityIssuerObj.nameSelect = this.returnAppAssetObj.TaxCityIssuer;
        this.InputLookupCityIssuerObj.jsonSelect = { provDistrictCode: this.returnAppAssetObj.TaxCityIssuer };

      var reqByCode = new GenericObj();
      reqByCode.Code = this.returnAppAssetObj.FullAssetCode;
      this.http.post(URLConstant.GetAssetMasterForLookup, reqByCode).subscribe(
        (response) => {
          this.resAssetMasterObj = response;
          this.InputLookupAssetObj.nameSelect = this.resAssetMasterObj.FullAssetName;
          this.InputLookupAssetObj.jsonSelect = this.resAssetMasterObj;
          this.AssetDataForm.patchValue({
            FullAssetCode: this.resAssetMasterObj.FullAssetCode,
            FullAssetName: this.resAssetMasterObj.FullAssetName,
          });
        });

      let ReqGetVendorLookup : GenericObj = new GenericObj();
      ReqGetVendorLookup.Code = this.returnAppAssetObj.SupplCode;
      this.http.post(URLConstant.GetVendorForLookup, ReqGetVendorLookup).subscribe(
        (response) => {
          this.returnVendorObj = response;
          this.InputLookupSupplierObj.nameSelect = this.returnVendorObj.VendorName;
          this.InputLookupSupplierObj.jsonSelect = this.returnVendorObj;
          this.AssetDataForm.patchValue({
            SupplCode: this.returnVendorObj.VendorCode,
            SupplName: this.returnVendorObj.VendorName,
          });

          let getAppAssetSupplEmpByAdminHead = new GenericObj();
          getAppAssetSupplEmpByAdminHead.Id = this.AppAssetId;
          getAppAssetSupplEmpByAdminHead.Code = CommonConstant.ADMIN_HEAD_JOB_CODE;
          this.http.post(URLConstant.GetAppAssetSupplEmpByAppAssetIdAndMrSupplEmpPositionCode, getAppAssetSupplEmpByAdminHead).subscribe(
            (response) => {
              this.headAppAssetSupplEmpObj = response;
              let ReqGetListActiveVendor : ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj = new ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj;
              ReqGetListActiveVendor.VendorId = this.returnVendorObj.VendorId;
              ReqGetListActiveVendor.MrVendorEmpPositionCodes = [CommonConstant.ADMIN_HEAD_JOB_CODE];
              this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, ReqGetListActiveVendor).subscribe(
                (response) => {
                  this.listAdminHeadObj = response[CommonConstant.ReturnObj];
                  if (this.headAppAssetSupplEmpObj.AppAssetSupplEmpId != 0) {
                    var temp: any;
                    temp = this.listAdminHeadObj.filter(
                      emp => emp.VendorEmpNo == this.headAppAssetSupplEmpObj.SupplEmpNo);
                    this.AssetDataForm.patchValue({
                      AdminHeadId: temp[0].VendorEmpId,
                      AdminHeadName: temp[0].VendorEmpName,
                      AdminHeadNo: temp[0].VendorEmpNo,
                      AdminHeadPositionCode: temp[0].MrVendorEmpPositionCode,
                    });
                  }
                });
            });

          let getAppAssetSupplEmpBySales = new GenericObj();
          getAppAssetSupplEmpBySales.Id = this.AppAssetId;
          getAppAssetSupplEmpBySales.Code = CommonConstant.SALES_JOB_CODE;
          this.http.post(URLConstant.GetAppAssetSupplEmpByAppAssetIdAndMrSupplEmpPositionCode, getAppAssetSupplEmpBySales).subscribe(
            (response) => {
              this.salesAppAssetSupplEmpObj = response;
              let ReqGetListActiveVendorSales : ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj = new ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj;
              ReqGetListActiveVendorSales.VendorId = this.returnVendorObj.VendorId;
              ReqGetListActiveVendorSales.MrVendorEmpPositionCodes = [CommonConstant.SALES_JOB_CODE];
              this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, ReqGetListActiveVendorSales).subscribe(
                (response) => {
                  this.listSalesObj = response[CommonConstant.ReturnObj];
                  var temp: any;
                    temp = this.listSalesObj.filter(
                      emp => emp.VendorEmpNo == this.salesAppAssetSupplEmpObj.SupplEmpNo);
                  this.AssetDataForm.patchValue({
                    SalesPersonId: temp[0].VendorEmpId,
                    SalesPersonName: temp[0].VendorEmpName,
                    SalesPersonNo: temp[0].VendorEmpNo,
                    SalesPersonPositionCode: temp[0].MrVendorEmpPositionCode,
                  });
                });
            });
        });

      this.appCollateralObj = new AppCollateralObj();
      this.appCollateralObj.AppAssetId = this.AppAssetId;
      this.appCollateralObj.Id = this.AppAssetId;
      this.http.post(URLConstant.GetAppCollateralByAppAssetId, this.appCollateralObj).subscribe(
        (response) => {
          this.returnAppCollateralObj = response;
          this.appCollateralObj.IsMainCollateral = this.returnAppCollateralObj.IsMainCollateral;

          this.appCollateralRegistObj = new AppCollateralRegistrationObj();
          this.appCollateralRegistObj.AppCollateralId = this.returnAppCollateralObj.AppCollateralId;
          this.appCollateralRegistObj.Id = this.returnAppCollateralObj.AppCollateralId;
          this.http.post(URLConstant.GetAppCollateralRegistrationByAppCollateralId, this.appCollateralRegistObj).subscribe(
            (response) => {
              this.returnAppCollateralRegistObj = response;
              this.AssetDataForm.patchValue({
                Username: this.returnAppCollateralRegistObj.UserName,
                UserRelationship: this.returnAppCollateralRegistObj.MrUserRelationshipCode
              });

              if (this.returnAppCollateralRegistObj.MrUserRelationshipCode == "SELF") {
                this.AssetDataForm.patchValue({
                  SelfUsage: true
                });
                this.AssetDataForm.controls.Username.clearValidators();
                this.AssetDataForm.controls.Username.updateValueAndValidity();
                this.AssetDataForm.controls.UserRelationship.clearValidators();
                this.AssetDataForm.controls.UserRelationship.updateValueAndValidity();
                this.AssetDataForm.controls["Username"].disable();
                this.AssetDataForm.controls["UserRelationship"].disable();
              }

              this.locationAddrObj = new AppCustAddrObj();
              this.locationAddrObj.Addr = this.returnAppCollateralRegistObj.LocationAddr;
              this.locationAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.LocationAreaCode3;
              this.locationAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.LocationAreaCode4;
              this.locationAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.LocationAreaCode1;
              this.locationAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.LocationAreaCode2;
              this.locationAddrObj.City = this.returnAppCollateralRegistObj.LocationCity;

              this.inputFieldLocationAddrObj.inputLookupObj.isRequired = false;
              this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.LocationZipcode;
              this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.LocationZipcode };
              this.inputAddressObjForLoc.default = this.locationAddrObj;
              this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
            });
        });
    }

    this.GetListAddr();

    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplier_CollateralAsset_FL4W.json";
    this.InputLookupSupplierObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier_CollateralAsset_FL4W.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplier_CollateralAsset_FL4W.json";

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    this.http.post(URLConstant.GetAppById, { Id: this.AppId }).pipe(
      map((response: AppObj) => {
        this.appData = response;
        return response;
      }),
      mergeMap((response: AppObj) => {
        let getVendorSchmCode = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "SUPPLSCHM", ProdOfferingVersion: response.ProdOfferingVersion });
        let getAssetCond = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETCOND", ProdOfferingVersion: response.ProdOfferingVersion });
        let getAssetType = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETTYPE", ProdOfferingVersion: response.ProdOfferingVersion });
        let getAssetSchm = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETSCHM", ProdOfferingVersion: response.ProdOfferingVersion });
        let RegexSerialNo = this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSSerialNoRegex });

        return forkJoin([getVendorSchmCode, getAssetCond, getAssetType, getAssetSchm, RegexSerialNo]);
      })
    ).subscribe(
      (response) => {
        this.vendorSchmCode = response[0];
        this.bindAccessories();
        var assetCond = response[1];
        var assetType = response[2];
        var assetSchm = response[3];
        this.SerialNoRegex = response[4]["GsValue"];
        this.assetTypeCompntValue = assetType["CompntValue"];
        
        let obj: CustomPatternObj = {
          pattern: this.SerialNoRegex,
          invalidMsg: "Cannot input special character"
        }
        this.ListPattern.push(obj);
        
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

        if (this.mode != 'editAsset') {
          this.AssetDataForm.patchValue({
            MrAssetConditionCode: assetCond["CompntValue"],
            MrAssetConditionCodeView: assetCond["CompntValue"]
          });
          this.ChangeAssetCondition();
        }
        
        if(this.AssetDataForm.controls.MrAssetConditionCode.value == "USED") { 
          this.isUsed = true;
          this.InputLookupCityIssuerObj.isRequired = true;
        }

        this.GenerataAppAssetAttr(false);

        this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
          Code: assetType["CompntValue"]
        }).subscribe(
          (response: any) => {
            while (this.items.length) {
              this.items.removeAt(0);
            }

            this.SerialNoList = response[CommonConstant.ReturnObj];
            for (let i = 0; i < this.SerialNoList.length; i++) {
              let eachDataDetail = this.fb.group({
                SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                SerialNoValue: ['',[Validators.pattern(this.SerialNoRegex)]],
                IsMandatory: [this.SerialNoList[i].IsMandatory]
              }) as FormGroup;
              this.items.push(eachDataDetail);
            }

            for (let i = 0; i < this.items.length; i++) {
              if (this.items.controls[i]['controls']['IsMandatory'].value == true) {
                this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required, Validators.pattern(this.SerialNoRegex)]);
                this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
              }
            }

            if (this.returnAppAssetObj != undefined || this.returnAppAssetObj != null) {
              for (let i = 0; i < this.items.length; i++) {
                if (this.items.controls[i] != null) {
                  this.items.controls[i]['controls']['SerialNoValue'].value = this.returnAppAssetObj["SerialNo" + (i + 1)];
                  if (this.items.controls[i]["controls"]["SerialNoLabel"].value == "Chassis No"){
                    this.indexChassis = i;
                  }
                }
              }
			  this.GetThirdPartyResultH();
            }
            this.UcAddressHandler();

          });

        var arrCritSuppl = new Array<CriteriaObj>();
        var critObjSuppl = new CriteriaObj();
        critObjSuppl.DataType = "text";
        critObjSuppl.restriction = AdInsConstant.RestrictionEq;
        critObjSuppl.propName = "vs.VENDOR_SCHM_CODE";
        critObjSuppl.value = this.vendorSchmCode["CompntValue"];
        arrCritSuppl.push(critObjSuppl);

        critObjSuppl = new CriteriaObj();
        critObjSuppl.DataType = "text";
        critObjSuppl.restriction = AdInsConstant.RestrictionEq;
        critObjSuppl.propName = "ro.OFFICE_CODE";
        critObjSuppl.value = currentUserContext[CommonConstant.OFFICE_CODE];
        arrCritSuppl.push(critObjSuppl);
        this.InputLookupSupplierObj.addCritInput = arrCritSuppl;
        this.InputLookupSupplierObj.isReady = true;

        var arrCritAsset = new Array<CriteriaObj>();
        var critObjAsset = new CriteriaObj();
        critObjAsset.DataType = "text";
        critObjAsset.restriction = AdInsConstant.RestrictionEq;
        critObjAsset.propName = 'B.ASSET_TYPE_CODE';
        critObjAsset.value = assetType["CompntValue"];
        arrCritAsset.push(critObjAsset);

        critObjAsset = new CriteriaObj();
        critObjAsset.DataType = "text";
        critObjAsset.restriction = AdInsConstant.RestrictionEq;
        critObjAsset.propName = 'E.ASSET_SCHM_CODE';
        critObjAsset.value = assetSchm["CompntValue"];
        arrCritAsset.push(critObjAsset);
        this.InputLookupAssetObj.addCritInput = arrCritAsset;
        this.InputLookupAssetObj.isReady = true;
      });

    this.assetConditionObj = new RefMasterObj();
    this.assetConditionObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetCondition;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.assetConditionObj).subscribe(
      (response) => {
        this.returnAssetConditionObj = response[CommonConstant.ReturnObj];
        if (this.mode != 'editAsset') {
          this.AssetDataForm.patchValue(
            {
              MrAssetConditionCode: this.returnAssetConditionObj[0].Key
            }
          )
          this.ChangeAssetCondition();
        }

        this.UcAddressHandler();
      }
    );

    this.downPaymentObj = new RefMasterObj();
    this.downPaymentObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeDownPaymentType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.downPaymentObj).subscribe(
      (response) => {
        this.returnDownPaymentObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ MrDownPaymentTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
        this.downPaymentChange();
      }
    );

    this.userRelationshipObj = new RefMasterObj();
    this.userRelationshipObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.userRelationshipObj).subscribe(
      (response) => {
        this.returnUserRelationshipObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ UserRelationship: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.assetUsageObj = new RefMasterObj();
    this.assetUsageObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetUsage;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.assetUsageObj).subscribe(
      (response) => {
        this.returnAssetUsageObj = response[CommonConstant.ReturnObj];
        if (this.mode != 'editAsset') {
          this.AssetDataForm.patchValue({
            AssetUsage: response[CommonConstant.ReturnObj][0]['Key']
          });
        }
      }
    );

    this.http.post(URLConstant.GetRefCoy, null).subscribe(
      (response) => {
        this.returnRefCoyObj = response;
        this.AssetDataForm.patchValue({
          OwnerName: this.returnRefCoyObj.FullName,
          OwnerIdType: "NPWP",
          OwnerIdNo: this.returnRefCoyObj.TaxIdNo,
          OwnerAddr: this.returnRefCoyObj.Addr,
          OwnerAreaCode1: this.returnRefCoyObj.AreaCode1,
          OwnerAreaCode2: this.returnRefCoyObj.AreaCode2,
          OwnerAreaCode3: this.returnRefCoyObj.AreaCode3,
          OwnerAreaCode4: this.returnRefCoyObj.AreaCode4,
          OwnerZipcode: this.returnRefCoyObj.Zipcode,
          OwnerMobilePhn: this.returnRefCoyObj.Phn1
        });
      }
    );
	await this.GetGS();
  }

  GenerataAppAssetAttr(isRefresh: boolean) {
    var GenObj =
    {
      AppAssetId: this.AppAssetId,
      AssetTypeCode: this.assetTypeCompntValue,
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

  private setValidators(appAssetAttrObjs: AppAssetAttrCustomObj) {
    let ListValidator: Array<ValidatorFn> = new Array<ValidatorFn>();

    if (appAssetAttrObjs.AttrLength != null && appAssetAttrObjs.AttrLength != 0) {
      ListValidator.push(Validators.maxLength(appAssetAttrObjs.AttrLength));
    }

    return ListValidator;
  }

  refreshAttr() {
    this.isAssetAttrReady = false;
    this.GenerataAppAssetAttr(true);
  }

  showModalTaxCityIssuer() {
    const modalTaxCityIssuer = this.modalService.open(LookupTaxCityIssuerComponent);
    modalTaxCityIssuer.result.then(
      (response) => {
        this.AssetDataForm.patchValue({
          TaxCityIssuer: response.DistrictCode
        });
      }
    ).catch(() => {
    });
  }

  SetBpkbCity(event) {
    this.AssetDataForm.patchValue({
      TaxCityIssuer: event.provDistrictCode,
    });
  }

  setAssetAttr(){
    this.allAssetDataObj.AppAssetAttrObj = new Array<AppAssetAttrObj>();

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

  setSupplierInfo() {
    // if(this.AssetDataForm.controls["AdminHeadName"].value == "undefined" || this.AssetDataForm.controls["AdminHeadName"].value == "")
    if (!this.AssetDataForm.controls["AdminHeadName"].value) {
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = "-";
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = "-";
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = "-";
    }
    else {
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = this.AssetDataForm.controls["AdminHeadName"].value;
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = this.AssetDataForm.controls["AdminHeadNo"].value;
      this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = CommonConstant.ADMIN_HEAD_JOB_CODE;
    }

    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName = this.AssetDataForm.controls["SalesPersonName"].value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo = this.AssetDataForm.controls["SalesPersonNo"].value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode = CommonConstant.SALES_JOB_CODE;
    this.allAssetDataObj["VendorEmpId"] = this.AssetDataForm.controls.SalesPersonId.value;

    if (!this.AssetDataForm.controls["BranchManagerName"].value) {
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = "-";
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = "-";
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = "-";
    } else {
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = this.AssetDataForm.controls["BranchManagerName"].value;
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = this.AssetDataForm.controls["BranchManagerNo"].value;
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = CommonConstant.BRANCH_MANAGER_JOB_CODE;
    }
  }

  // MrDownPaymentTypeCode:[''],

  setAssetInfo() {
    var assetForm = this.AssetDataForm.getRawValue();
    this.allAssetDataObj.AppAssetObj.AppId = this.AppId;
    this.allAssetDataObj.AppAssetObj.FullAssetName = this.AssetDataForm.controls["FullAssetName"].value;
    this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.AssetDataForm.controls["MrAssetConditionCode"].value;
    this.allAssetDataObj.AppAssetObj.MrAssetUsageCode = this.AssetDataForm.controls["AssetUsage"].value;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items.controls[i] != null) {
        this.allAssetDataObj.AppAssetObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
        this.allAssetDataObj.AppCollateralObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
      }
    }
    this.allAssetDataObj.AppAssetObj.SupplName = this.AssetDataForm.controls["SupplName"].value;
    this.allAssetDataObj.AppAssetObj.SupplCode = this.AssetDataForm.controls["SupplCode"].value;
    this.allAssetDataObj.AppAssetObj.AssetPriceAmt = this.AssetDataForm.controls["AssetPrice"].value;

    if (this.AssetDataForm.controls["MrDownPaymentTypeCode"].value == CommonConstant.DownPaymentTypeAmt) {
      this.allAssetDataObj.AppAssetObj.DownPaymentAmt = assetForm["DownPayment"];
      this.allAssetDataObj.AppAssetObj.DownPaymentPrcnt = (assetForm["DownPayment"] / assetForm["AssetPrice"]) * 100;
    }
    else {
      this.allAssetDataObj.AppAssetObj.DownPaymentAmt = assetForm["AssetPrice"] * (assetForm["DownPaymentPrctg"] / 100);
      this.allAssetDataObj.AppAssetObj.DownPaymentPrcnt = assetForm["DownPaymentPrctg"];
    }
    this.allAssetDataObj.AppAssetObj.MinDownPaymentPrcnt = this.AssetValidationResult && this.AssetValidationResult.DPMin ? this.AssetValidationResult.DPMin : 0;
    this.allAssetDataObj.AppAssetObj.MaxDownPaymentPrcnt = this.AssetValidationResult && this.AssetValidationResult.DPMax ? this.AssetValidationResult.DPMax : 0;

    this.allAssetDataObj.AppAssetObj.AssetNotes = this.AssetDataForm.controls["Notes"].value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls["ManufacturingYear"].value;

    this.allAssetDataObj.AppAssetObj.AssetSeqNo = 1;
    this.allAssetDataObj.AppAssetObj.FullAssetCode = this.AssetDataForm.controls["FullAssetCode"].value;

    if (this.AppAssetId == 0) {
      this.allAssetDataObj.AppAssetObj.AssetStat = CommonConstant.AssetStatNew;
      this.allAssetDataObj.AppCollateralObj.CollateralStat = CommonConstant.AssetStatNew;
      this.allAssetDataObj.AppCollateralObj.IsMainCollateral = true;
    }
    else {
      this.allAssetDataObj.AppAssetObj.AssetStat = CommonConstant.AssetStatNew;
      this.allAssetDataObj.AppCollateralObj.CollateralStat = CommonConstant.AssetStatNew;
      if (this.appCollateralObj != null) {
        this.allAssetDataObj.AppCollateralObj.IsMainCollateral = this.appCollateralObj.IsMainCollateral;
      }
      else {
        this.allAssetDataObj.AppCollateralObj.IsMainCollateral = true;
      }
    }

    this.allAssetDataObj.AppAssetObj.AssetTypeCode = this.AssetDataForm.controls["AssetTypeCode"].value;
    this.allAssetDataObj.AppAssetObj.AssetCategoryCode = this.AssetDataForm.controls["AssetCategoryCode"].value;
    this.allAssetDataObj.AppAssetObj.IsCollateral = true;
    this.allAssetDataObj.AppAssetObj.IsInsurance = true;
    this.allAssetDataObj.AppAssetObj.Color = this.AssetDataForm.controls["Color"].value;
    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls["TaxCityIssuer"].value;
    this.allAssetDataObj.AppAssetObj.TaxIssueDt = this.AssetDataForm.controls["TaxIssueDt"].value;

    this.allAssetDataObj.AppCollateralObj.AppId = this.AppId;
    this.allAssetDataObj.AppCollateralObj.CollateralSeqNo = 1;
    this.allAssetDataObj.AppCollateralObj.FullAssetCode = this.AssetDataForm.controls["FullAssetCode"].value;
    this.allAssetDataObj.AppCollateralObj.FullAssetName = this.AssetDataForm.controls["FullAssetName"].value;
    this.allAssetDataObj.AppCollateralObj.MrCollateralConditionCode = CommonConstant.AssetConditionUsed;
    this.allAssetDataObj.AppCollateralObj.MrCollateralUsageCode = this.AssetDataForm.controls["AssetUsage"].value;
    this.allAssetDataObj.AppCollateralObj.CollateralValueAmt = this.AssetDataForm.controls["AssetPrice"].value;
    this.allAssetDataObj.AppCollateralObj.AssetTypeCode = this.AssetDataForm.controls["AssetTypeCode"].value;
    this.allAssetDataObj.AppCollateralObj.AssetCategoryCode = this.AssetDataForm.controls["AssetCategoryCode"].value;
    this.allAssetDataObj.AppCollateralObj.ManufacturingYear = this.AssetDataForm.controls["ManufacturingYear"].value;

  }

  updateValueDownPayment() {
    var DownPayment = this.AssetDataForm.controls.AssetPrice.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100;
    if (DownPayment > this.AssetDataForm.controls.AssetPrice.value) {
      this.toastr.warningMessage("Down Payment Amount exceeded Asset Price Amount !");
      this.AssetDataForm.patchValue({
        DownPayment: 0,
        DownPaymentPrctg: 0
      });
    }
    else {
      this.AssetDataForm.patchValue({
        DownPayment: this.AssetDataForm.controls.AssetPrice.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100
      });
    }
  }
  updateValueDownPaymentPrctg() {
    var DownPaymentPrctg = this.AssetDataForm.controls.DownPayment.value / this.AssetDataForm.controls.AssetPrice.value * 100;
    if (DownPaymentPrctg > 100) {
      this.toastr.warningMessage("Down Payment Amount exceeded Asset Price Amount !");
      this.AssetDataForm.patchValue({
        DownPayment: 0,
        DownPaymentPrctg: 0
      });
    }
    else {
      this.AssetDataForm.patchValue({
        DownPaymentPrctg: this.AssetDataForm.controls.DownPayment.value / this.AssetDataForm.controls.AssetPrice.value * 100
      });
    }
  }
  setAssetUser() {
    this.allAssetDataObj.AppCollateralRegistrationObj.UserName = this.AssetDataForm.controls["Username"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.AssetDataForm.controls["UserRelationship"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerName = this.AssetDataForm.controls["OwnerName"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AssetDataForm.controls["OwnerIdType"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AssetDataForm.controls["OwnerIdNo"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AssetDataForm.controls["OwnerAddr"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AssetDataForm.controls["OwnerAreaCode1"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AssetDataForm.controls["OwnerAreaCode2"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AssetDataForm.controls["OwnerAreaCode3"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AssetDataForm.controls["OwnerAreaCode4"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AssetDataForm.controls["OwnerZipcode"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AssetDataForm.controls["OwnerMobilePhn"].value;

  }

  setAssetLocation() {
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAddr = this.AssetDataForm.controls["assetLocationAddress"]["controls"].Addr.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode1.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode2.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode3.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode4.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationCity = this.AssetDataForm.controls["assetLocationAddress"]["controls"].City.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AssetDataForm.controls["assetLocationAddressZipcode"]["controls"].value.value;
  }

  setCollateralAttribute() {
    var collAttr;
    if (this.AssetDataForm.controls["Color"].value != "" && this.AssetDataForm.controls["Color"].value != null) {
      collAttr = new AppCollateralAttrObj();
      collAttr.CollateralAttrCode = "COLOR";
      collAttr.CollateralAttrName = "Color";
      collAttr.AttrValue = this.AssetDataForm.controls["Color"].value;
      this.allAssetDataObj.AppCollateralAttrObj.push(collAttr);
    }
    if (this.AssetDataForm.controls["TaxCityIssuer"].value != "" && this.AssetDataForm.controls["TaxCityIssuer"].value != null) {
      collAttr = new AppCollateralAttrObj();
      collAttr.CollateralAttrCode = "TAX_CITY_ISSUER";
      collAttr.CollateralAttrName = "Tax City Issuer";
      collAttr.AttrValue = this.AssetDataForm.controls["TaxCityIssuer"].value;
      this.allAssetDataObj.AppCollateralAttrObj.push(collAttr);
    }
    if (this.AssetDataForm.controls["TaxIssueDt"].value != "" && this.AssetDataForm.controls["TaxIssueDt"].value != null) {
      collAttr = new AppCollateralAttrObj();
      collAttr.CollateralAttrCode = "BPKB_ISSUE_DATE";
      collAttr.CollateralAttrName = "BPKB Issue Date";
      collAttr.AttrValue = this.AssetDataForm.controls["TaxIssueDt"].value;
      this.allAssetDataObj.AppCollateralAttrObj.push(collAttr);
    }
  }

  async SaveForm() {
    var assetForm = this.AssetDataForm.getRawValue();
    var confirmMsg = "";
    var isValidOk = true;
    await this.AssetValidationForSave();


    if (this.AssetValidationResult) {
      if (this.AssetDataForm.controls.MrDownPaymentTypeCode.value == 'PRCNT') {
        if (assetForm.DownPaymentPrctg < this.AssetValidationResult.DPMin) {
          isValidOk = false;
          confirmMsg = "Down Payment Percentage is Lower than Minimum Percentage";
        }
        else if (assetForm.DownPaymentPrctg > this.AssetValidationResult.DPMax) {
          isValidOk = false;
          confirmMsg = "Down Payment Percentage is Higher than Maximum Percentage";
        }
      }
      else {
        var assetDPMin = this.AssetValidationResult.DPMin * assetForm.AssetPrice / 100;
        var assetDPMax = this.AssetValidationResult.DPMax * assetForm.AssetPrice / 100;
        if (assetForm.DownPayment < assetDPMin) {
          isValidOk = false;
          confirmMsg = "Down Payment Amount is Lower than Minimum Amount";
        }
        else if (assetForm.DownPayment > assetDPMax) {
          isValidOk = false;
          confirmMsg = "Down Payment Amount is Higher than Maximum Amount";
        }
      }


    }
    if (!isValidOk) {
      confirmMsg += ", Are You Sure to Save This Data ?";
      var confirmation = confirm(confirmMsg);
      if (!confirmation) {
        return false;
      }
    }


    if (this.mode == 'addAsset') {
      this.allAssetDataObj = new AllAssetDataObj();
      this.setSupplierInfo();
      this.setAssetInfo();
      this.setAssetUser();
      this.setAssetLocation();
      this.setCollateralAttribute();
      this.setAppAccessoryForSave();
      this.setAssetAttr();
      this.allAssetDataObj.AppAssetObj.AppAssetId = 0;

      if (this.allAssetDataObj.AppAssetObj.DownPaymentAmt > this.allAssetDataObj.AppAssetObj.AssetPriceAmt) {
        this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_LESS_THAN + "Asset Price!");
        return false;
      }

      this.allAssetDataObj.LOBCode = CommonConstant.FL4W;

      if (this.originalAssetAccs && this.allAssetDataObj.AppAssetAccessoryObjs && this.originalAssetAccs.length > 0 && this.allAssetDataObj.AppAssetAccessoryObjs.length > 0) {
        for (const newAcc of this.allAssetDataObj.AppAssetAccessoryObjs) {
          if (!this.allAssetDataObj.IsAppAssetAccessoryChanged) {
            for (const oriAcc of this.originalAssetAccs) {
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
      if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0") {
        if (this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value == '' && this.IsIntegrator) {
          if (confirm("Chassis No not filled, submit data without Integrator ?")) {
            this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.AssetDataForm.reset();
                //this.router.navigate(["/Nap/AssetData/Paging"]);
                this.assetValue.emit({ mode: 'paging' });
              });
          }
        }
        else if (!this.IsIntegrator) {
            if (confirm("Submit data without Integrator ?")) {
            this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.AssetDataForm.reset();
                //this.router.navigate(["/Nap/AssetData/Paging"]);
                this.assetValue.emit({ mode: 'paging' });
              });
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
            });
        }
      }else{
        this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.AssetDataForm.reset();
            this.assetValue.emit({ mode: 'paging' });
          });
      }
    }
    else {
      this.allAssetDataObj = new AllAssetDataObj();
      this.setSupplierInfo();
      this.setAssetInfo();
      this.setAssetUser();
      this.setAssetLocation();
      this.setCollateralAttribute();
      this.setAppAccessoryForSave();
      this.setAssetAttr();
      this.allAssetDataObj.AppCollateralObj.RowVersion = this.returnAppCollateralObj.RowVersion;
      this.allAssetDataObj.AppCollateralRegistrationObj.RowVersion = this.returnAppCollateralRegistObj.RowVersion;
      this.allAssetDataObj.AppAssetObj.AppAssetId = this.AppAssetId;
      this.allAssetDataObj.AppAssetObj.RowVersion = this.returnAppAssetObj.RowVersion;
      if (this.salesAppAssetSupplEmpObj != null) this.allAssetDataObj.AppAssetSupplEmpSalesObj.RowVersion = this.salesAppAssetSupplEmpObj.RowVersion;
      this.allAssetDataObj.AppCollateralObj.AppCollateralId = this.returnAppCollateralObj.AppCollateralId;
      this.allAssetDataObj.AppCollateralRegistrationObj.AppCollateralRegistrationId = this.returnAppCollateralRegistObj.AppCollateralRegistrationId;

      if (this.allAssetDataObj.AppAssetObj.DownPaymentAmt > this.allAssetDataObj.AppAssetObj.AssetPriceAmt) {
        this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_LESS_THAN + "Asset Price!");
        return false;
      }

      this.allAssetDataObj.LOBCode = CommonConstant.FL4W;

      if (this.allAssetDataObj.AppAssetAccessoryObjs && this.allAssetDataObj.AppAssetAccessoryObjs.length > 0) {
        if (this.originalAssetAccs && this.originalAssetAccs.length > 0) {
          for (const newAcc of this.allAssetDataObj.AppAssetAccessoryObjs) {
            if (!this.allAssetDataObj.IsAppAssetAccessoryChanged) {
              for (const oriAcc of this.originalAssetAccs) {
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

      if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0") {
        if (this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value == '' && this.IsIntegrator) {
          if (confirm("Chassis No not filled, submit data without Integrator ?")) {
            this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.AssetDataForm.reset();
                //this.router.navigate(["/Nap/AssetData/Paging"]);
                this.assetValue.emit({ mode: 'paging' });
              });
          }
        }
        else if (!this.IsIntegrator) {
          
          if (this.currentChassisNo == this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value && this.returnAppAssetObj.AppAssetId != 0) {
            this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.AssetDataForm.reset();
                this.assetValue.emit({ mode: 'paging' });
              });
          }
          else{
            if (confirm("Submit data without Integrator ?")) {
            this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                this.AssetDataForm.reset();
                this.assetValue.emit({ mode: 'paging' });
              });
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
            });
        }
      }else{
        this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.AssetDataForm.reset();
            this.assetValue.emit({ mode: 'paging' });
          });
      }
    }
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
        AccessoryDownPaymentAmt: [0, Validators.required],
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
    this.InputLookupAccObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAccObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAccObj.pagingJson = "./assets/uclookup/NAP/lookupAcc.json";
    this.InputLookupAccObj.genericJson = "./assets/uclookup/NAP/lookupAcc.json";
    this.InputLookupAccObj.addCritInput = arrAddCrit;

    return this.InputLookupAccObj;
  }


  initLookupSuppAcc() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputLookupAccSupObj = new InputLookupObj();
    this.InputLookupAccSupObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupAccSupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAccSupObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAccSupObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupAccSupObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";
    var suppCrit = new Array();
    var critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'ro.OFFICE_CODE';
    critSuppObj.value = currentUserContext[CommonConstant.OFFICE_CODE];
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
    critSuppSupplSchmObj.value = this.vendorSchmCode["CompntValue"];
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

      });
  }

  setAppAccessory(i, AssetAccessoryCode) {
    this.accObj.AssetAccessoryCode = AssetAccessoryCode;
    let obj = {Code: this.accObj.AssetAccessoryCode}
    this.http.post(URLConstant.GetAssetAccessoryByCode, obj).subscribe(
      (response) => {
        this.dictAccLookup[i].nameSelect = response["AssetAccessoryName"];
        this.dictAccLookup[i].jsonSelect = response;
        this.InputLookupAcceObjs[i].jsonSelect = response;

      });
  }
  addAccessories() {
    if (this.AssetDataForm.get("AssetTypeCode").value == "") {
      return this.toastr.warningMessage("Please Choose Asset First");
    }
    var appAccessoryObj = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
    // appAccessoryObj.controls[0]["AccessoryDownPaymentAmt"].value = 0;
    var length = this.AssetDataForm.value["AssetAccessoriesObjs"].length;
    var max = 0;
    if (length > 0) {
      max = this.AssetDataForm.value["AssetAccessoriesObjs"][length - 1].No;
    }

    appAccessoryObj.push(this.addGroup(undefined, max + 1));
    if (max != 0) {
      appAccessoryObj.controls[max + 1]["controls"]["AccessoryDownPaymentAmt"].value = 0;
    }
    else {
      appAccessoryObj.controls[max]["controls"]["AccessoryDownPaymentAmt"].value = 0;
    }

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
      this.originalAssetAccs = [...this.appAssetAccessoriesObjs];
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
      }
    }
  }

  setAppAccessoryForSave() {
    this.allAssetDataObj.AppAssetAccessoryObjs = new Array<AppAssetAccessoryObj>();
    this.allAssetDataObj.AppCollateralAccessoryObjs = new Array<AppCollateralAccessoryObj>();
    this.allAssetDataObj.AppCollateralAttrObj = new Array<AppCollateralAttrObj>();

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

  UcAddressHandler() {
    if (this.AssetDataForm.controls.MrAssetConditionCode.value == CommonConstant.AssetConditionUsed) {
      this.inputAddressObjForLoc.inputField.inputLookupObj.isRequired = false;
      this.inputAddressObjForLoc.isRequired = false;
      for (let i = 0; i < this.AssetDataForm.controls["items"]["controls"].length; i++) {
        if (this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoLabel"].value == AdInsConstant.Chassis_No || this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoLabel"].value == AdInsConstant.License_Plate_No || this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoLabel"].value == AdInsConstant.Engine_No) {
          this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoValue"].setValidators([Validators.required, Validators.pattern(this.SerialNoRegex)]);
          this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoValue"].updateValueAndValidity();
        }
      }
    } else {
      this.inputAddressObjForLoc.inputField.inputLookupObj.isRequired = true;
      this.inputAddressObjForLoc.isRequired = true;
      for (let i = 0; i < this.AssetDataForm.controls["items"]["controls"].length; i++) {
        if (this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoLabel"].value == AdInsConstant.Chassis_No || this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoLabel"].value == AdInsConstant.License_Plate_No || this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoLabel"].value == AdInsConstant.Engine_No) {
          this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoValue"].setValidators([Validators.pattern(this.SerialNoRegex)]);
          this.AssetDataForm.controls["items"]["controls"][i]["controls"]["SerialNoValue"].updateValueAndValidity();
        }
      }
    }
  }

  ChangeAssetCondition(){
    if(this.AssetDataForm.controls.MrAssetConditionCode.value == CommonConstant.AssetConditionUsed){
      this.AssetDataForm.controls.TaxCityIssuer.setValidators([Validators.required]);
    }else{
      this.AssetDataForm.controls.TaxCityIssuer.clearValidators();
    }
    this.AssetDataForm.controls.TaxCityIssuer.updateValueAndValidity();
  }
}