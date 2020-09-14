import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { VendorEmpObj } from 'app/shared/model/VendorEmp.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AllAssetDataObj } from 'app/shared/model/AllAssetDataObj.Model';
import { RefCoyObj } from 'app/shared/model/RefCoyObj.Model';
import { AssetMasterObj } from 'app/shared/model/AssetMasterObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppAssetSupplEmpObj } from 'app/shared/model/AppAssetSupplEmpObj.Model';
import { VendorObj } from 'app/shared/model/Vendor.Model';
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

@Component({
  selector: 'app-asset-data-add-edit',
  templateUrl: './asset-data-add-edit.component.html'
})
export class AssetDataAddEditComponent implements OnInit {
  //@Input() type: string = "addAsset";
  @Input() mode: any;
  @Input() AppAssetId: number;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() assetValue: EventEmitter<object> = new EventEmitter();
  //AppAssetId: number = 0;
  //type: string = "addAsset";
  @Input() AppId: any;
  LobCode: string;
  pageType: string = "add";
  custType: string;
  branchObj: any;
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
  allAssetDataObj: AllAssetDataObj;
  addEditAllAssetDataUrl: any;
  getRefCoy: any;
  refCoyObj: any;
  returnRefCoyObj: any;
  getAppCustUrl: any;
  appCustObj: any;
  assetUsageObj: any
  returnAssetUsageObj: any;
  getAllAssetDataByAppAssetId: any;
  appAssetObj: any;
  returnAppAssetObj: any;
  reqAssetMasterObj: any;
  resAssetMasterObj: any;
  getAssetMasterForLookupEmployee: any;
  getAppCollateralByAppId: any;
  getAppCollateralRegistByAppCollateralId: any;
  getListAppAssetSupplEmpByAppAssetId: any;
  getVendorForLookup: any;
  getAppAssetSupplEmpByAppAssetIdAndCode: any;
  appCollateralObj: any;
  returnAppCollateralObj: any;
  appCollateralRegistObj: any;
  returnAppCollateralRegistObj: any;
  appAssetSupplEmpObj: any;
  returnAppAssetSupplEmpObj: any;
  vendorObj: any;
  returnVendorObj: any;
  appAssetSupplEmpSalesObj: any;
  salesAppAssetSupplEmpObj: any;
  appAssetSupplEmpHeadObj: any;
  headAppAssetSupplEmpObj: any;
  appAssetSupplEmpBranchObj: any;
  branchAppAssetSupplEmpObj: any;
  isLicensePlateMandatory: boolean = false;
  isEngineNoMandatory: boolean = false;
  isChassisNoMandatory: boolean = false;
  appData: AppObj;
  grossDPPrcnt: number = 0;
  items: FormArray;
  SerialNoList: any;

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
  AssetDataForm = this.fb.group({
    SupplName: [''],
    SupplCode: [''],

    BranchManagerName: [''],
    BranchManagerNo: [''],
    BranchManagerCode: [''],

    SalesPersonName: [''],
    SalesPersonNo: ['', [Validators.required]],
    SalesPersonCode: [''],

    AdminHeadName: [''],
    AdminHeadNo: [''],
    AdminHeadCode: [''],

    FullAssetCode: [''],
    FullAssetName: [''],
    AssetCategoryCode: [''],
    AssetTypeCode: [''],
    MrDownPaymentTypeCode: ['', Validators.required],
    AssetPrice: ['', [Validators.required, Validators.min(1.00)]],
    DownPayment: ['', Validators.required],
    MrAssetConditionCode: [''],
    MrAssetConditionCodeView: [''],
    AssetUsage: [''],
    LicensePlate: [''],
    ChassisNo: [''],
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.max(new Date().getFullYear())]],
    EngineNo: [''],
    Notes: ['', Validators.required],

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
  });

  appObj = {
    AppId: 0,
  };
  inputAddressObjForLoc: InputAddressObj;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private modalService: NgbModal) {
    this.getListAppAssetData = URLConstant.GetListAppAssetData;
    this.getListVendorEmp = URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition;
    this.getListActiveRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.getAppCustAddrUrl = URLConstant.GetListAppCustAddrByAppId;
    this.getAppCustAddrByAppCustAddrId = URLConstant.GetAppCustAddrByAppCustAddrId;
    this.addEditAllAssetDataUrl = URLConstant.AddEditAllAssetData;
    this.getRefCoy = URLConstant.GetRefCoy;
    this.getAppCustUrl = URLConstant.GetAppCustByAppId;
    this.getAllAssetDataByAppAssetId = URLConstant.GetAllAssetDataByAppAssetId;
    this.getAssetMasterForLookupEmployee = URLConstant.GetAssetMasterForLookupEmployee;
    this.getAppCollateralByAppId = URLConstant.GetAppCollateralByAppId;
    this.getAppCollateralRegistByAppCollateralId = URLConstant.GetAppCollateralRegistrationByAppCollateralId;
    this.getListAppAssetSupplEmpByAppAssetId = URLConstant.GetListAppAssetSupplEmpByAppAssetId;
    this.getVendorForLookup = URLConstant.GetVendorForLookup;
    this.getAppAssetSupplEmpByAppAssetIdAndCode = URLConstant.GetAppAssetSupplEmpByAppAssetIdAndCode;

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

  GetListAddr() {
    this.appObj.AppId = this.AppId;
    this.http.post(this.getAppCustAddrUrl, this.appObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ LocationAddrType: response[CommonConstant.ReturnObj][0]['AppCustAddrId'] });
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

    this.branchObj = new VendorEmpObj();
    this.branchObj.VendorId = event.VendorId;
    this.branchObj.MrVendorEmpPositionCode = CommonConstant.BRANCH_MANAGER_JOB_CODE;
    this.http.post(this.getListVendorEmp, this.branchObj).subscribe(
      (response) => {
        this.listBranchObj = response[CommonConstant.ReturnObj];
        if (this.listBranchObj) {
          if (this.listBranchObj.length > 0) {
            this.AssetDataForm.patchValue({
              BranchManagerNo: response[CommonConstant.ReturnObj][0]['Key'],
              BranchManagerName: response[CommonConstant.ReturnObj][0]['Value']
            });
          }
        }
      });

    this.salesObj = new VendorEmpObj();
    this.salesObj.VendorId = event.VendorId;
    this.salesObj.MrVendorEmpPositionCode = CommonConstant.SALES_JOB_CODE;
    this.http.post(this.getListVendorEmp, this.salesObj).subscribe(
      (response) => {
        this.listSalesObj = response[CommonConstant.ReturnObj];
        if (this.listSalesObj) {
          if (this.listSalesObj.length > 0) {
            this.AssetDataForm.patchValue({
              SalesPersonNo: response[CommonConstant.ReturnObj][0]['Key'],
              SalesPersonName: response[CommonConstant.ReturnObj][0]['Value']
            });
          }
        }
      });

    this.adminHeadObj = new VendorEmpObj();
    this.adminHeadObj.VendorId = event.VendorId;
    this.adminHeadObj.MrVendorEmpPositionCode = CommonConstant.ADMIN_HEAD_JOB_CODE;
    this.http.post(this.getListVendorEmp, this.adminHeadObj).subscribe(
      (response) => {
        this.listAdminHeadObj = response[CommonConstant.ReturnObj];
        if (this.listAdminHeadObj) {
          if (this.listAdminHeadObj.length > 0) {
            this.AssetDataForm.patchValue({
              AdminHeadNo: response[CommonConstant.ReturnObj][0]['Key'],
              AdminHeadName: response[CommonConstant.ReturnObj][0]['Value']
            });
          }
        }
      });
  }

  GetAppCust() {
    var appObj = {
      AppId: this.AppId,
    };
    this.http.post(this.getAppCustUrl, appObj).subscribe(
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

  SalesChanged(event) {
    this.AssetDataForm.patchValue({
      SalesPersonName: this.listSalesObj.find(x => x.Key == event.target.value).Value
    });
  }

  AdminChanged(event) {
    this.AssetDataForm.patchValue({
      AdminHeadName: this.listAdminHeadObj.find(x => x.Key == event.target.value).Value
    });
  }

  AssetValidation() {
    var CheckValidObj = {
      AssetCondition: this.AssetDataForm.controls["MrAssetConditionCode"].value,
      ManufacturingYear: this.AssetDataForm.controls["ManufacturingYear"].value,
      Tenor: this.appData.Tenor,
      AssetCategoryCode: this.AssetDataForm.controls["AssetCategoryCode"].value,
      MrAssetUsageCode: this.AssetDataForm.controls["AssetUsage"].value
    }
    return this.http.post(URLConstant.CheckAssetValidationRule, CheckValidObj).pipe(first());
  }

  CheckDP() {
    let getAssetValidationRule = this.AssetValidation();
    getAssetValidationRule.subscribe(
      (response) => {
        var assetValidationRule = response;
        this.grossDPPrcnt = assetValidationRule["GrossDPPrctg"];
        if (this.AssetDataForm.controls["MrDownPaymentTypeCode"].value == CommonConstant.DownPaymentTypePrcnt) {
          if (assetValidationRule["DPGrossBehaviour"] == 'MIN') {
            this.AssetDataForm.patchValue({
              DownPayment: assetValidationRule["GrossDPPrctg"]
            });
            this.AssetDataForm.controls["DownPayment"].setValidators([Validators.required, Validators.min(assetValidationRule["GrossDPPrctg"]), Validators.max(100)]);
            this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
          }
        }
        if (this.AssetDataForm.controls["MrDownPaymentTypeCode"].value == 'AMT') {
          if (assetValidationRule["DPGrossBehaviour"] == 'MIN') {
            var minDP = this.AssetDataForm.controls["AssetPrice"].value * assetValidationRule["GrossDPPrctg"] / 100;
            this.AssetDataForm.patchValue({
              DownPayment: minDP
            });
            this.AssetDataForm.controls["DownPayment"].setValidators([Validators.required, Validators.min(minDP)]);
            this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
          }
        }
      });
  }

  downPaymentChange() {
    var value = this.AssetDataForm.controls["MrDownPaymentTypeCode"].value;
    if (value == "AMT") {
      this.AssetDataForm.controls["DownPayment"].enable()
      var minDP = this.AssetDataForm.controls["AssetPrice"].value * this.grossDPPrcnt / 100;
      this.AssetDataForm.controls["DownPayment"].setValidators(Validators.min(minDP));
      this.AssetDataForm.controls["DownPaymentPrctg"].disable();
      this.AssetDataForm.controls["DownPayment"].updateValueAndValidity();
    }
    else {
      this.AssetDataForm.controls["DownPaymentPrctg"].enable();
      this.AssetDataForm.controls["DownPaymentPrctg"].setValidators([Validators.min(this.grossDPPrcnt), Validators.max(100)]);
      this.AssetDataForm.controls["DownPayment"].disable();
      this.AssetDataForm.controls["DownPaymentPrctg"].updateValueAndValidity();
    }
  }

  async ngOnInit(): Promise<void> {
    console.log("aaaa")
    this.AssetDataForm.controls.MrAssetConditionCodeView.disable();
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

    if (this.mode == 'editAsset') {
      // this.AssetDataForm.controls['ManufacturingYear'].setValidators([Validators.required]);
      // this.AssetDataForm.controls['ManufacturingYear'].updateValueAndValidity();

      this.appAssetObj = new AppAssetObj();
      this.appAssetObj.AppAssetId = this.AppAssetId;
      await this.http.post(this.getAllAssetDataByAppAssetId, this.appAssetObj).toPromise().then(
        (response) => {
          this.returnAppAssetObj = response["ResponseAppAssetObj"];
          this.AssetDataForm.patchValue({
            MrAssetConditionCode: this.returnAppAssetObj.MrAssetConditionCode,
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

          this.updateValueDownPaymentPrctg();
          this.appAssetAccessoriesObjs = response["ResponseAppAssetAccessoryObjs"];

        });

      this.reqAssetMasterObj = new AssetMasterObj();
      this.reqAssetMasterObj.FullAssetCode = this.returnAppAssetObj.FullAssetCode;
      this.http.post(this.getAssetMasterForLookupEmployee, this.reqAssetMasterObj).subscribe(
        (response) => {
          this.resAssetMasterObj = response;
          this.InputLookupAssetObj.nameSelect = this.resAssetMasterObj.FullAssetName;
          this.InputLookupAssetObj.jsonSelect = this.resAssetMasterObj;
          this.AssetDataForm.patchValue({
            FullAssetCode: this.resAssetMasterObj.FullAssetCode,
            FullAssetName: this.resAssetMasterObj.FullAssetName,
          });
        });

      this.vendorObj = new VendorObj();
      this.vendorObj.VendorCode = this.returnAppAssetObj.SupplCode;
      this.http.post(this.getVendorForLookup, this.vendorObj).subscribe(
        (response) => {
          this.returnVendorObj = response;
          this.InputLookupSupplierObj.nameSelect = this.returnVendorObj.VendorName;
          this.InputLookupSupplierObj.jsonSelect = this.returnVendorObj;
          this.AssetDataForm.patchValue({
            SupplCode: this.returnVendorObj.VendorCode,
            SupplName: this.returnVendorObj.VendorName,
          });

          this.appAssetSupplEmpBranchObj = new AppAssetSupplEmpObj();
          this.appAssetSupplEmpBranchObj.AppAssetId = this.AppAssetId;
          this.appAssetSupplEmpBranchObj.MrSupplEmpPositionCode = CommonConstant.BRANCH_MANAGER_JOB_CODE;
          this.http.post(this.getAppAssetSupplEmpByAppAssetIdAndCode, this.appAssetSupplEmpBranchObj).subscribe(
            (response) => {
              this.branchAppAssetSupplEmpObj = response;

              this.branchObj = new VendorEmpObj();
              this.branchObj.VendorId = this.returnVendorObj.VendorId;
              this.branchObj.MrVendorEmpPositionCode = CommonConstant.BRANCH_MANAGER_JOB_CODE;
              this.http.post(this.getListVendorEmp, this.branchObj).subscribe(
                (response) => {
                  this.listBranchObj = response[CommonConstant.ReturnObj];
                  this.AssetDataForm.patchValue({
                    BranchManagerNo: this.branchAppAssetSupplEmpObj.SupplEmpNo,
                    BranchManagerName: this.branchAppAssetSupplEmpObj.SupplEmpName
                  });
                });
            });

          this.appAssetSupplEmpHeadObj = new AppAssetSupplEmpObj();
          this.appAssetSupplEmpHeadObj.AppAssetId = this.AppAssetId;
          this.appAssetSupplEmpHeadObj.MrSupplEmpPositionCode = CommonConstant.ADMIN_HEAD_JOB_CODE;
          this.http.post(this.getAppAssetSupplEmpByAppAssetIdAndCode, this.appAssetSupplEmpHeadObj).subscribe(
            (response) => {
              this.headAppAssetSupplEmpObj = response;

              this.adminHeadObj = new VendorEmpObj();
              this.adminHeadObj.VendorId = this.returnVendorObj.VendorId;
              this.adminHeadObj.MrVendorEmpPositionCode = CommonConstant.ADMIN_HEAD_JOB_CODE;
              this.http.post(this.getListVendorEmp, this.adminHeadObj).subscribe(
                (response) => {
                  this.listAdminHeadObj = response[CommonConstant.ReturnObj];
                  this.AssetDataForm.patchValue({
                    AdminHeadNo: this.headAppAssetSupplEmpObj.SupplEmpNo,
                    AdminHeadName: this.headAppAssetSupplEmpObj.SupplEmpName
                  });
                });
            });

          this.appAssetSupplEmpSalesObj = new AppAssetSupplEmpObj();
          this.appAssetSupplEmpSalesObj.AppAssetId = this.AppAssetId;
          this.appAssetSupplEmpSalesObj.MrSupplEmpPositionCode = CommonConstant.SALES_JOB_CODE;
          this.http.post(this.getAppAssetSupplEmpByAppAssetIdAndCode, this.appAssetSupplEmpSalesObj).subscribe(
            (response) => {
              this.salesAppAssetSupplEmpObj = response;

              this.salesObj = new VendorEmpObj();
              this.salesObj.VendorId = this.returnVendorObj.VendorId;
              this.salesObj.MrVendorEmpPositionCode = CommonConstant.SALES_JOB_CODE;
              this.http.post(this.getListVendorEmp, this.salesObj).subscribe(
                (response) => {
                  this.listSalesObj = response[CommonConstant.ReturnObj];
                  this.AssetDataForm.patchValue({
                    SalesPersonNo: this.salesAppAssetSupplEmpObj.SupplEmpNo,
                    SalesPersonName: this.salesAppAssetSupplEmpObj.SupplEmpName
                  });
                });
            });

        });
      this.appCollateralObj = new AppCollateralObj();
      this.appCollateralObj.AppId = this.AppId;
      this.http.post(this.getAppCollateralByAppId, this.appCollateralObj).subscribe(
        (response) => {
          this.returnAppCollateralObj = response;

          this.appCollateralRegistObj = new AppCollateralRegistrationObj();
          this.appCollateralRegistObj.AppCollateralId = this.returnAppCollateralObj.AppCollateralId;
          this.http.post(this.getAppCollateralRegistByAppCollateralId, this.appCollateralRegistObj).subscribe(
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

              this.inputFieldLocationAddrObj = new InputFieldObj();
              this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
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

    this.http.post(URLConstant.GetAppById, { AppId: this.AppId }).pipe(
      map((response: AppObj) => {
        this.appData = response;
        return response;
      }),
      mergeMap((response: AppObj) => {
        let getVendorSchmCode = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "SUPPLSCHM", ProdOfferingVersion: response.ProdOfferingVersion });
        let getAssetCond = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETCOND", ProdOfferingVersion: response.ProdOfferingVersion });
        let getAssetType = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETTYPE", ProdOfferingVersion: response.ProdOfferingVersion });
        let getAssetSchm = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETSCHM", ProdOfferingVersion: response.ProdOfferingVersion });
        return forkJoin([getVendorSchmCode, getAssetCond, getAssetType, getAssetSchm]);
      })
    ).subscribe(
      (response) => {
        this.vendorSchmCode = response[0];
        this.bindAccessories();
        var assetCond = response[1];
        var assetType = response[2];
        var assetSchm = response[3];
        var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

        this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
          AssetTypeCode: assetType["CompntValue"]
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

            if (this.returnAppAssetObj != undefined || this.returnAppAssetObj != null) {
              for (let i = 0; i < this.items.length; i++) {
                if (this.items.controls[i] != null) {
                  this.items.controls[i]['controls']['SerialNoValue'].value = this.returnAppAssetObj["SerialNo" + (i + 1)];
                }
              }
            }
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
    this.http.post(this.getListActiveRefMasterUrl, this.assetConditionObj).subscribe(
      (response) => {
        this.returnAssetConditionObj = response[CommonConstant.ReturnObj];
        if (this.mode != 'edit') {
          this.AssetDataForm.patchValue(
            {
              MrAssetConditionCode: this.returnAssetConditionObj[1].Key,
              MrAssetConditionCodeView: this.returnAssetConditionObj[1].Key
            }
          )
        }
      }
    );

    this.downPaymentObj = new RefMasterObj();
    this.downPaymentObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeDownPaymentType;
    this.http.post(this.getListActiveRefMasterUrl, this.downPaymentObj).subscribe(
      (response) => {
        this.returnDownPaymentObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ MrDownPaymentTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
        this.downPaymentChange();
      }
    );

    this.userRelationshipObj = new RefMasterObj();
    this.userRelationshipObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(this.getListActiveRefMasterUrl, this.userRelationshipObj).subscribe(
      (response) => {
        this.returnUserRelationshipObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ UserRelationship: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.assetUsageObj = new RefMasterObj();
    this.assetUsageObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetUsage;
    this.http.post(this.getListActiveRefMasterUrl, this.assetUsageObj).subscribe(
      (response) => {
        this.returnAssetUsageObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({
          AssetUsage: response[CommonConstant.ReturnObj][0]['Key']
        });
      }
    );

    this.refCoyObj = new RefCoyObj();
    this.http.post(this.getRefCoy, this.refCoyObj).subscribe(
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
  }
  checkForm() {
  }
  showModalTaxCityIssuer() {
    const modalTaxCityIssuer = this.modalService.open(LookupTaxCityIssuerComponent);
    modalTaxCityIssuer.result.then(
      (response) => {
        this.AssetDataForm.patchValue({
          TaxCityIssuer: response.DistrictCode
        });
      }
    ).catch((error) => {
    });
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

    // if(this.AssetDataForm.controls["BranchManagerName"].value == "undefined" || this.AssetDataForm.controls["BranchManagerName"].value == "")
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
    this.allAssetDataObj.AppAssetObj.AppId = this.AppId;
    this.allAssetDataObj.AppAssetObj.FullAssetName = this.AssetDataForm.controls["FullAssetName"].value;
    this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.AssetDataForm.controls["MrAssetConditionCode"].value;
    this.allAssetDataObj.AppAssetObj.MrAssetUsageCode = this.AssetDataForm.controls["AssetUsage"].value;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items.controls[i] != null) {
        this.allAssetDataObj.AppAssetObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
      }
    }
    this.allAssetDataObj.AppAssetObj.SupplName = this.AssetDataForm.controls["SupplName"].value;
    this.allAssetDataObj.AppAssetObj.SupplCode = this.AssetDataForm.controls["SupplCode"].value;
    this.allAssetDataObj.AppAssetObj.AssetPriceAmt = this.AssetDataForm.controls["AssetPrice"].value;

    if (this.AssetDataForm.controls["MrDownPaymentTypeCode"].value == CommonConstant.DownPaymentTypeAmt) {
      this.allAssetDataObj.AppAssetObj.DownPaymentAmt = this.AssetDataForm.controls["DownPayment"].value;
    }
    else {
      this.allAssetDataObj.AppAssetObj.DownPaymentAmt = this.AssetDataForm.controls["AssetPrice"].value * this.AssetDataForm.controls["DownPaymentPrctg"].value / 100;
    }

    this.allAssetDataObj.AppAssetObj.AssetNotes = this.AssetDataForm.controls["Notes"].value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls["ManufacturingYear"].value;

    this.allAssetDataObj.AppAssetObj.AssetSeqNo = 1;
    this.allAssetDataObj.AppAssetObj.FullAssetCode = this.AssetDataForm.controls["FullAssetCode"].value;

    if (this.AppAssetId == 0) {
      this.allAssetDataObj.AppAssetObj.AssetStat = CommonConstant.AssetStatNew;
      this.allAssetDataObj.AppCollateralObj.CollateralStat = CommonConstant.AssetStatNew;
    }
    else {
      this.allAssetDataObj.AppAssetObj.AssetStat = CommonConstant.AssetStatNew;
      this.allAssetDataObj.AppCollateralObj.CollateralStat = CommonConstant.AssetStatNew;
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
    this.allAssetDataObj.AppCollateralObj.MrCollateralConditionCode = this.AssetDataForm.controls["MrAssetConditionCode"].value;
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

  SaveForm() {
    if (this.mode == 'addAsset') {
      this.allAssetDataObj = new AllAssetDataObj();
      this.setSupplierInfo();
      this.setAssetInfo();
      this.setAssetUser();
      this.setAssetLocation();
      this.setCollateralAttribute();
      this.setAppAccessoryForSave();
      this.allAssetDataObj.AppAssetObj.AppAssetId = 0;

      if (this.allAssetDataObj.AppAssetObj.DownPaymentAmt > this.allAssetDataObj.AppAssetObj.AssetPriceAmt) {
        this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_LESS_THAN + "Asset Price!");
        return false;
      }

      this.allAssetDataObj.LOBCode = CommonConstant.FL4W;

      this.http.post(this.addEditAllAssetDataUrl, this.allAssetDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          //this.router.navigate(["/Nap/AssetData/Paging"]);
          this.assetValue.emit({ mode: 'paging' });
        });
    }
    else {
      this.allAssetDataObj = new AllAssetDataObj();
      this.setSupplierInfo();
      this.setAssetInfo();
      this.setAssetUser();
      this.setAssetLocation();
      this.setCollateralAttribute();
      this.setAppAccessoryForSave();
      this.allAssetDataObj.AppCollateralObj.RowVersion = this.returnAppCollateralObj.RowVersion;
      this.allAssetDataObj.AppCollateralRegistrationObj.RowVersion = this.returnAppCollateralRegistObj.RowVersion;
      this.allAssetDataObj.AppAssetObj.AppAssetId = this.AppAssetId;
      this.allAssetDataObj.AppCollateralObj.AppCollateralId = this.returnAppCollateralObj.AppCollateralId;
      this.allAssetDataObj.AppCollateralRegistrationObj.AppCollateralRegistrationId = this.returnAppCollateralRegistObj.AppCollateralRegistrationId;

      if (this.allAssetDataObj.AppAssetObj.DownPaymentAmt > this.allAssetDataObj.AppAssetObj.AssetPriceAmt) {
        this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_LESS_THAN + "Asset Price!");
        return false;
      }

      this.allAssetDataObj.LOBCode = CommonConstant.FL4W;

      this.http.post(this.addEditAllAssetDataUrl, this.allAssetDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          //this.router.navigate(["/Nap/AssetData/Paging"]);
          this.assetValue.emit({ mode: 'paging' });
        });
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
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
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
    critSupp2Obj.value = 'SUPPLIER_BRANCH';
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
    this.http.post(URLConstant.GetVendorByVendorCode, this.vendorAccSuppObj).subscribe(
      (response) => {
        this.dictSuppLookup[i].nameSelect = response["VendorName"];
        this.dictSuppLookup[i].jsonSelect = response;
        this.InputLookupSupplObjs[i].jsonSelect = response;

      });
  }

  setAppAccessory(i, AssetAccessoryCode) {
    this.accObj.AssetAccessoryCode = AssetAccessoryCode;
    this.http.post(URLConstant.GetAssetAccessoryByCode, this.accObj).subscribe(
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
}
