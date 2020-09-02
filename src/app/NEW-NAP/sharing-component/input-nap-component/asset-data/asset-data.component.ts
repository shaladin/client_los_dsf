import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
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
import { AppCollateralAccessoryObj } from 'app/shared/model/AppCollateralAccessoryObj.Model';
import { AppCollateralAttrObj } from '../../../../shared/model/AppCollateralAttrObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppAssetAttrCustomObj } from 'app/shared/model/AppAsset/AppAssetAttrCustom.Model';
import { AppAssetAttrObj } from 'app/shared/model/AppAssetAttrObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';


@Component({
  selector: 'app-asset-data',
  templateUrl: './asset-data.component.html',
})

export class AssetDataComponent implements OnInit {

  @Input() AppId: any;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  BranchManagerName: string = "-";
  inputFieldOwnerAddrObj: InputFieldObj;
  ownerAddrObj: AddrObj;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AddrObj;
  appAssetAccessoriesObjs: Array<AppAssetAccessoryObj>;
  appAssetId: number = 0;
  items: FormArray;
  SerialNoList: any;
  isUsed: boolean = false;
  isAssetAttrReady: boolean = false;
  AssetDataForm = this.fb.group({
    /* AppAsset Value that in form*/

    FullAssetName: ['', [Validators.required, Validators.maxLength(1000)]],
    MrAssetConditionCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrAssetUsageCode: ['', [Validators.required, Validators.maxLength(50)]],
    SupplName: ['', Validators.maxLength(500)],
    AssetPriceAmt: ['', Validators.required],
    DownPaymentAmt: ['', Validators.required],
    DownPaymentPrctg: ['', Validators.max(100)],
    AssetNotes: ['', [Validators.maxLength(4000)]],
    Color: ['', Validators.maxLength(50)],
    TaxCityIssuer: [''],
    TaxIssueDt: [''],
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
    OwnerName: ['', Validators.maxLength(50)],
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
    LocationAddr: [''],
    LocationAreaCode1: ['', Validators.maxLength(50)],
    LocationAreaCode2: ['', Validators.maxLength(50)],
    LocationAreaCode3: ['', Validators.maxLength(50)],
    LocationAreaCode4: ['', Validators.maxLength(50)],
    LocationCity: ['', Validators.maxLength(50)],
    LocationZipcode: ['', Validators.maxLength(50)],

    LocationAddrType: [''],
    OwnerAddrType: [''],
    selectedDpType: ['', Validators.required],
    SelfUsage: [false],
    SelfOwner: [false],
    AssetAccessoriesObjs: this.fb.array([]),
    items: this.fb.array([]),
    AppAssetAttrObjs: this.fb.array([]),
  });

  CustType: string = "";
  AddrObj: any;
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  appObj = {
    AppId: 0,
  };

  assetCondObj: any;

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

  selectedSupplCode: any;
  selectedSupplName: any;

  allAssetDataObj: AllAssetDataObj;

  InputLookupSupplierObj: any;
  InputLookupCityIssuerObj: any;
  InputLookupAssetObj: any;
  InputLookupSupplAccObj: any;
  InputLookupAccObj: any;
  InputLookupAccSupObj: any;

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
  VendorEmpBMObj: any;
  AppCustObj: any;
  RefProdCmptAssetType: any;
  RefProdCmptAssetCond: any;
  RefProdCmptSupplSchm: any;
  RefProdCmptAssetSchm: any;
  AppCustCoyObj: any;
  CheckValidationObj: any;
  SetManuYearObj: any;
  SetDpObj: any;
  isValidOk: boolean = true;

  AssetConditionName: string = "";
  OfficeCode: any;
  DpTypeBefore: string = "";
  AppAssetAttrObj: any;
  copyFromAppCustAddrForOwner: any;
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

  appData: any;
  InputLookupAcceObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  InputLookupSupplObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  dictAccLookup: { [key: string]: any; } = {};
  dictSuppLookup: { [key: string]: any; } = {};
  isOnlookup: boolean = false;
  ListAttrAnswer = [];
  inputAddressObjForOwner: InputAddressObj;
  inputAddressObjForLoc: InputAddressObj;
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
    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.showAllPhn = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;

    this.items = this.AssetDataForm.get('items') as FormArray;
    this.isOnlookup = false;
    await this.GetAppData();
    await this.GetRefProdCompt();
    await this.GetAppCust();
    await this.GetAppCustPhone();
    this.bindAllRefMasterObj();
    this.initLookup();
    this.locationAddrObj = new AddrObj();
    this.ownerAddrObj = new AddrObj();
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();

    if (this.CustType == CommonConstant.CustTypeCompany) {
      await this.GetAppCustCoy();
    }
    await this.GetListAddr();
    this.AssetConditionChanged();
    this.AssetDataForm.removeControl("AssetAccessoriesObjs");
    this.AssetDataForm.addControl("AssetAccessoriesObjs", this.fb.array([]));

    await this.getAllAssetData();
    this.GenerataAppAssetAttr();
    var appObj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefProdCompntAssetCond,
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion,
    };
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
      (response) => {
        this.RefProdCmptAssetCond = response;
        if (this.RefProdCmptAssetCond.CompntValue == "USED") {
          this.isUsed = true;
        } else {
          this.isUsed = false;
        }
      }
    );

    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { AssetTypeCode: this.RefProdCmptAssetType.CompntValue }).subscribe(
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
          if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
            this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }

        if (this.appAssetObj.ResponseAppAssetObj != null) {
          for (let i = 0; i < this.items.length; i++) {
            if (this.items.controls[i] != null) {
              this.items.controls[i]['controls']['SerialNoValue'].value = this.appAssetObj.ResponseAppAssetObj["SerialNo" + (i + 1)];
            }
          }
        }
      });
  }

  async SaveForm() {
    this.isValidOk = true;
    await this.CheckValidation();
    if (this.CheckValidationObj != null) {
      if (this.CheckValidationObj.MinManufYear != 0) {
        if (this.CheckValidationObj.MinManufYear > this.AssetDataForm.controls.ManufacturingYear.value) {
          this.toastr.warningMessage("Manufacturing Year must be more than " + this.CheckValidationObj.MinManufYear);
          this.isValidOk = false;
        }
        if (this.CheckValidationObj.GrossDPPrctg != 0) {
          if (this.AssetDataForm.controls.selectedDpType.value == 'PRCTG') {
            if (this.CheckValidationObj.GrossDPPrctg > this.AssetDataForm.controls.DownPaymentPrctg.value && this.CheckValidationObj.DPGrossBehaviour == 'MIN') {
              this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_MORE_THAN + this.CheckValidationObj.GrossDPPrctg + "% from Asset Price");
              this.isValidOk = false;
            }
            if (this.CheckValidationObj.GrossDPPrctg < this.AssetDataForm.controls.DownPaymentAmt.value && this.CheckValidationObj.DPGrossBehaviour == 'MAX') {
              this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_LESS_THAN + this.CheckValidationObj.GrossDPPrctg + "% from Asset Price");
              this.isValidOk = false;
            }
          }
          if (this.AssetDataForm.controls.selectedDpType.value == 'AMT') {
            var tempPrcnt = this.AssetDataForm.controls.DownPaymentAmt.value / this.AssetDataForm.controls.AssetPriceAmt.value * 100
            if (this.CheckValidationObj.GrossDPPrctg > tempPrcnt && this.CheckValidationObj.DPGrossBehaviour == 'MIN') {
              this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_MORE_THAN + this.CheckValidationObj.GrossDPPrctg + "% from Asset Price");
              this.isValidOk = false;
            }
            if (this.CheckValidationObj.GrossDPPrctg < tempPrcnt && this.CheckValidationObj.DPGrossBehaviour == 'MAX') {
              this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_LESS_THAN + this.CheckValidationObj.GrossDPPrctg + "% from Asset Price");
              this.isValidOk = false;
            }
          }
        }
      }
    }
    if (this.AssetDataForm.controls.selectedDpType.value == 'AMT') {
      if (this.AssetDataForm.controls.DownPaymentAmt.value < 0) {
        this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_MORE_THAN + "0.");
        this.isValidOk = false;
      }
      if (this.AssetDataForm.controls.DownPaymentAmt.value > this.AssetDataForm.controls.AssetPriceAmt.value) {
        this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_LESS_THAN + "Asset Price");
        this.isValidOk = false;
      }
    }
    if (this.AssetDataForm.controls.selectedDpType.value == 'PRCTG') {
      var tempAmt = this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100;
      if (tempAmt < 0) {
        this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_MORE_THAN + "0.");
        this.isValidOk = false;
      }
      if (tempAmt > this.AssetDataForm.controls.AssetPriceAmt.value) {
        this.toastr.warningMessage(ExceptionConstant.DOWN_PAYMENT_MUST_LESS_THAN + "Asset Price");
        this.isValidOk = false;
      }
    }

    if (this.isValidOk == true) {
      this.allAssetDataObj = new AllAssetDataObj();
      this.setAllAssetObj();
      this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
        });
    }


  }

  Cancel() {
    this.outputCancel.emit();
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
      (response) => {
        this.CheckValidationObj = response;
      },
      (error) => {
        this.isValidOk = false;
      }
    );
  }
  SetDpValue() {
    var CheckValidObj = {
      AppId: this.AppId,
      AssetCondition: this.AssetDataForm.controls.MrAssetConditionCode.value,
      ManufacturingYear: this.AssetDataForm.controls.ManufacturingYear.value,
      Tenor: this.AppObj.Tenor,
      AssetCategoryCode: this.AssetDataForm.controls.AssetCategoryCode.value,
      MrAssetUsageCode: this.AssetDataForm.controls.MrAssetUsageCode.value
    }
    this.http.post(URLConstant.CheckAssetValidationRule, CheckValidObj).subscribe(
      (response) => {
        this.SetDpObj = response;
        if (this.SetDpObj.DPGrossBehaviour == 'MIN') {
          var tempDP = this.AssetDataForm.controls.AssetPriceAmt.value * this.SetDpObj.GrossDPPrctg / 100;
          if (this.AssetDataForm.controls.DownPaymentAmt.value < tempDP) {
            this.AssetDataForm.patchValue({
              DownPaymentAmt: tempDP,
              DownPaymentPrctg: this.SetDpObj.GrossDPPrctg
            });
          }
          else {
            if (this.AssetDataForm.controls.AssetPriceAmt.value != 0) {
              this.AssetDataForm.patchValue({
                DownPaymentPrctg: this.AssetDataForm.controls.DownPaymentAmt.value * 100 / this.AssetDataForm.controls.AssetPriceAmt.value
              });
            }
            else {
              this.AssetDataForm.patchValue({
                DownPaymentPrctg: 0
              });
            }
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
      (response) => {
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
    this.allAssetDataObj.AppAssetObj.AppAssetId = this.appAssetId;
    this.allAssetDataObj.AppAssetObj.AppId = this.AppId;
    this.allAssetDataObj.AppAssetObj.FullAssetName = this.AssetDataForm.controls.FullAssetName.value;
    this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.AssetDataForm.controls.MrAssetConditionCode.value;
    this.allAssetDataObj.AppAssetObj.MrAssetUsageCode = this.AssetDataForm.controls.MrAssetUsageCode.value;

    for (var i = 0; i < this.items.length; i++) {
      if (this.items.controls[i] != null) {
        this.allAssetDataObj.AppAssetObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
      }
    }

    this.allAssetDataObj.AppAssetObj.SupplName = this.AssetDataForm.controls.SupplName.value;
    this.allAssetDataObj.AppAssetObj.AssetPriceAmt = this.AssetDataForm.controls.AssetPriceAmt.value;
    if (this.AssetDataForm.controls.selectedDpType.value == 'PRCTG') {
      this.allAssetDataObj.AppAssetObj.DownPaymentAmt = this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100;
    }
    else {
      this.allAssetDataObj.AppAssetObj.DownPaymentAmt = this.AssetDataForm.controls.DownPaymentAmt.value;
    }
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
      this.allAssetDataObj.AppCollateralObj.AppAssetId = this.appAssetId;
      if (this.appAssetObj.ResponseAppCollateralObj != null) {
        this.allAssetDataObj.AppCollateralObj.IsMainCollateral = this.appAssetObj.ResponseAppCollateralObj.IsMainCollateral;
      } else {
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

    for (var i = 0; i < this.items.length; i++) {
      if (this.items.controls[i] != null) {
        this.allAssetDataObj.AppAssetObj["SerialNo" + (i + 1)] = this.items.controls[i]["controls"]["SerialNoValue"].value;
      }
    }

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
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AssetDataForm.controls["ownerData"]["controls"].Addr.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode1.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode2.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode3.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode4.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerCity = this.AssetDataForm.controls["ownerData"]["controls"].City.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AssetDataForm.controls["ownerDataZipcode"]["controls"].value.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AssetDataForm.controls.OwnerMobilePhnNo.value;
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

  SetAsset(event) {
    this.assetMasterObj.FullAssetCode = event.FullAssetCode;
    this.GetAssetMaster(this.assetMasterObj);
    this.AssetDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode
    });
    if (this.AssetDataForm.controls.SupplCode.value != undefined && this.AssetDataForm.controls.SupplCode.value != '') {
      this.SetMinManuYear()
    }
    if (this.AssetDataForm.controls.MrAssetConditionCode.value != '' && this.AssetDataForm.controls.MrAssetConditionCode.value != undefined && this.AssetDataForm.controls.ManufacturingYear.value != '' && this.AssetDataForm.controls.ManufacturingYear.value != undefined && this.AssetDataForm.controls.AssetCategoryCode.value != '' && this.AssetDataForm.controls.AssetCategoryCode.value != undefined && this.AssetDataForm.controls.MrAssetUsageCode.value != '' && this.AssetDataForm.controls.MrAssetUsageCode.value != undefined) {
      this.SetDpValue();
    }
  }

  ChangeAssetUsage() {
    if (this.AssetDataForm.controls.MrAssetConditionCode.value != '' && this.AssetDataForm.controls.MrAssetConditionCode.value != undefined && this.AssetDataForm.controls.ManufacturingYear.value != '' && this.AssetDataForm.controls.ManufacturingYear.value != undefined && this.AssetDataForm.controls.AssetCategoryCode.value != '' && this.AssetDataForm.controls.AssetCategoryCode.value != undefined && this.AssetDataForm.controls.MrAssetUsageCode.value != '' && this.AssetDataForm.controls.MrAssetUsageCode.value != undefined) {
      this.SetDpValue();
    }
  }
  SalesPersonChanged(event) {
    if (event.target.value != "") {
      //this.vendorEmpObj.VendorEmpId = event.target.value;
      //this.GetVendorEmpSupervisi();

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
        this.AssetDataForm.patchValue({
          DownPaymentAmt: this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100
        });
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
      };
      this.DpTypeBefore = this.AssetDataForm.controls.selectedDpType.value;
    }
  }
  updateValueDownPaymentAmt(){
    var DownPaymentAmt = this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100;
    if(DownPaymentAmt > this.AssetDataForm.controls.AssetPriceAmt.value){
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
  updateValueDownPaymentPrctg(){
    var DownPaymentPrctg = this.AssetDataForm.controls.DownPaymentAmt.value / this.AssetDataForm.controls.AssetPriceAmt.value * 100;
    if(DownPaymentPrctg > 100){
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
  //DPAmtChanged() {
  //  if (this.AssetDataForm.controls.AssetPriceAmt.value != 0) {
  //    this.AssetDataForm.patchValue({
  //      DownPaymentPrctg: this.AssetDataForm.controls.DownPaymentAmt.value * 100 / this.AssetDataForm.controls.AssetPriceAmt.value
  //    });
  //  }
  //  else {
  //    this.AssetDataForm.patchValue({
  //      DownPaymentPrctg: 0
  //    });
  //  }
  //}

  //DPPrctgChanged() {
  //  this.AssetDataForm.patchValue({
  //    DownPaymentAmt: this.AssetDataForm.controls.AssetPriceAmt.value * this.AssetDataForm.controls.DownPaymentAmt.value / 100
  //  });
  //}

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
        MrOwnerRelationshipCode: "SELF",
        OwnerAddr: this.AddrLegalObj[0].Addr,
        OwnerAreaCode1: this.AddrLegalObj[0].AreaCode1,
        OwnerAreaCode2: this.AddrLegalObj[0].AreaCode2,
        OwnerAreaCode3: this.AddrLegalObj[0].AreaCode3,
        OwnerAreaCode4: this.AddrLegalObj[0].AreaCode4,
        OwnerCity: this.AddrLegalObj[0].City,
        OwnerZipcode: this.AddrLegalObj[0].Zipcode,
        OwnerMobilePhnNo: typeof(this.AppCustObj.MobilePhnNo1) != 'undefined' ? this.AppCustObj.MobilePhnNo1 : ''
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

      this.AssetDataForm.controls["OwnerName"].disable();
      this.AssetDataForm.controls["MrIdTypeCode"].disable();
      this.AssetDataForm.controls["OwnerIdNo"].disable();
      this.AssetDataForm.controls["MrOwnerRelationshipCode"].disable();
      this.AssetDataForm.controls["OwnerMobilePhnNo"].disable();
      this.AssetDataForm.controls["ownerData"].disable();
    } else {
      this.AssetDataForm.controls["OwnerName"].enable();
      this.AssetDataForm.controls["MrIdTypeCode"].enable();
      this.AssetDataForm.controls["OwnerIdNo"].enable();
      this.AssetDataForm.controls["MrOwnerRelationshipCode"].enable();
      this.AssetDataForm.controls["OwnerMobilePhnNo"].enable();
      this.AssetDataForm.controls["ownerData"].enable();

    };
  }


  async getAllAssetData() {
    this.appData = new AppDataObj();
    this.appData.AppId = this.AppId;
    await this.http.post(URLConstant.GetAllAssetDataByAppId, this.appData).toPromise().then(
      (response) => {
        this.appAssetObj = response;
        if (this.appAssetObj.ResponseAppAssetObj != null) {
          this.AssetDataForm.patchValue({
            FullAssetCode: this.appAssetObj.ResponseAppAssetObj.FullAssetCode,
            FullAssetName: this.appAssetObj.ResponseAppAssetObj.FullAssetName,
            MrAssetConditionCode: this.appAssetObj.ResponseAppAssetObj.MrAssetConditionCode,
            MrAssetUsageCode: this.appAssetObj.ResponseAppAssetObj.MrAssetUsageCode,
            SupplName: this.appAssetObj.ResponseAppAssetObj.SupplName,
            SupplCode: this.appAssetObj.ResponseAppAssetObj.SupplCode,
            ManufacturingYear: this.appAssetObj.ResponseAppAssetObj.ManufacturingYear,
            AssetPriceAmt: this.appAssetObj.ResponseAppAssetObj.AssetPriceAmt,
            DownPaymentAmt: this.appAssetObj.ResponseAppAssetObj.DownPaymentAmt,
            AssetNotes: this.appAssetObj.ResponseAppAssetObj.AssetNotes,
            Color: this.appAssetObj.ResponseAppAssetObj.Color,
            TaxCityIssuer: this.appAssetObj.ResponseAppAssetObj.TaxCityIssuer,
            AssetSeqNo: this.appAssetObj.ResponseAppAssetObj.AssetSeqNo,
            AssetStat: this.appAssetObj.ResponseAppAssetObj.AssetStat,
            AssetTypeCode: this.appAssetObj.ResponseAppAssetObj.AssetTypeCode,
            AssetCategoryCode: this.appAssetObj.ResponseAppAssetObj.AssetCategoryCode,
            IsCollateral: this.appAssetObj.ResponseAppAssetObj.IsCollateral,
            IsInsurance: this.appAssetObj.ResponseAppAssetObj.IsInsurance,
            IsEditableDp: this.appAssetObj.ResponseAppAssetObj.IsEditableDp,

            selectedDpType: 'AMT'
          });
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
              SelfOwner: (this.appAssetObj.ResponseAppCollateralRegistrationObj.MrOwnerRelationshipCode == "SELF")
            });
          }
          this.AssetConditionChanged();
          this.appAssetAccessoriesObjs = this.appAssetObj.ResponseAppAssetAccessoryObjs;
          this.appAssetId = this.appAssetObj.ResponseAppAssetObj.AppAssetId;
          if (this.appAssetObj.ResponseAppCollateralRegistrationObj != null) {
            this.setAddrOwnerObj();
            this.setAddrLocationObj();
          }
          this.DpTypeBefore = "AMT";
          this.AssetDataForm.controls["DownPaymentPrctg"].disable();
          this.AssetDataForm.controls["DownPaymentAmt"].enable();
          this.assetMasterObj.FullAssetCode = this.appAssetObj.ResponseAppAssetObj.FullAssetCode;
          this.GetAssetMaster(this.assetMasterObj);
          this.vendorObj.VendorCode = this.appAssetObj.ResponseAppAssetObj.SupplCode;
          this.GetVendorForView();
          this.districtObj.ProvDistrictCode = this.appAssetObj.ResponseAppAssetObj.TaxCityIssuer;
          this.GetProvDistrict();
          this.bindAccessories();
          this.updateValueDownPaymentPrctg();
        }

        if (this.appAssetObj != null) {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items.controls[i] != null) {
              this.items.controls[i]["controls"]["SerialNoValue"].value = this.appAssetObj["SerialNo" + (i + 1)];
            }
          }
        }
      });
  }


  initLookup() {
    this.InputLookupSupplierObj = this.initLookupSupp();

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

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    var assetCrit = new Array();
    var critAssetObj = new CriteriaObj();
    critAssetObj.DataType = 'text';
    critAssetObj.restriction = AdInsConstant.RestrictionEq;
    critAssetObj.propName = 'B.ASSET_TYPE_NAME';
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
    critSuppSupplSchmObj.value = this.RefProdCmptSupplSchm.CompntValue;
    suppCrit.push(critSuppSupplSchmObj);
    this.InputLookupSupplierObj.addCritInput = suppCrit;

    return this.InputLookupSupplierObj;
  }

  initLookupSuppAcc() {
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
    critSuppObj.value = this.OfficeCode;
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
    critSuppSupplSchmObj.value = this.RefProdCmptSupplSchm.CompntValue;
    suppCrit.push(critSuppSupplSchmObj);
    this.InputLookupAccSupObj.addCritInput = suppCrit;

    return this.InputLookupAccSupObj;
  }

  bindAllRefMasterObj() {
    this.bindAssetUsageObj();
    this.bindIdTypeObj();
    this.bindUserOwnerRelationshipObj();
    this.bindAsseConditionObj();
    this.bindDownPaymentTypeObj();
  }

  bindAssetUsageObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetUsage;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.AssetUsageObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  bindAsseConditionObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetCondition;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.AssetConditionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  bindIdTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  bindDownPaymentTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeDownPaymentType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.DpObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  bindUserOwnerRelationshipObj() {
    if (this.CustType == CommonConstant.CustTypePersonal) {
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    }
    else {
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
    }
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.UserRelationObj = response[CommonConstant.ReturnObj];
        this.OwnerRelationObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async GetAppData() {
    this.appObj.AppId = this.AppId;
    await this.http.post(URLConstant.GetAppById, this.appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.GetProdOfferingAssetCond();
        this.OfficeCode = this.AppObj.OriOfficeCode;
      }
    );
  }

  GetProdOfferingAssetCond() {
    var obj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefProdCompAssetCond,
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion
    };
    this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).subscribe(
      (response) => {
        this.assetCondObj = response;
        this.AssetDataForm.patchValue({
          MrAssetConditionCode: this.assetCondObj.CompntValue
        });
      }
    );
  }

  async GetVendor() {
    await this.http.post(URLConstant.GetVendorByVendorCode, this.vendorObj).toPromise().then(
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
    await this.http.post(URLConstant.GetVendorByVendorCode, this.vendorObj).toPromise().then(
      (response) => {
        this.VendorObj = response;
        this.AssetDataForm.patchValue({
          SupplName: this.VendorObj.VendorName,
          SupplCode: this.VendorObj.VendorCode,
        });
        this.vendorEmpSalesObj.VendorId = this.VendorObj.VendorId;
        this.vendorEmpAdminObj.VendorId = this.VendorObj.VendorId;
        this.vendorEmpBMObj.VendorId = this.VendorObj.VendorId;
        if (this.appAssetObj.ResponseAdminHeadSupp != null) {
          this.vendorEmpAdminObj.VendorEmpNo = this.appAssetObj.ResponseAdminHeadSupp.SupplEmpNo;
          this.GetVendorEmpAdminHead();
        }
        if (this.appAssetObj.ResponseSalesPersonSupp != null) {
          this.vendorEmpSalesObj.VendorEmpNo = this.appAssetObj.ResponseSalesPersonSupp.SupplEmpNo;
          this.GetVendorEmpSalesPerson();
        }
        if (this.appAssetObj.ResponseBranchManagerSupp != null) {
          this.vendorEmpBMObj.VendorEmpNo = this.appAssetObj.ResponseBranchManagerSupp.SupplEmpNo;
          this.GetVendorEmpSalesPerson();
        }
        this.vendorObj.VendorId = this.VendorObj.VendorId;
        this.GetVendorEmpList();
        this.InputLookupSupplierObj.jsonSelect = this.VendorObj;
        this.InputLookupSupplierObj.nameSelect = this.VendorObj.VendorName;

      }
    );
  }

  GetProvDistrict() {
    this.http.post(URLConstant.GetRefProvDistrictByProvDistrictCode, this.districtObj).subscribe(
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
    this.http.post(URLConstant.GetVendorEmpByVendorIdVendorEmpNo, this.vendorEmpSalesObj).subscribe(
      (response) => {
        this.VendorEmpSalesObj = response;
        this.AssetDataForm.patchValue({
          SalesPersonId: this.VendorEmpSalesObj.VendorEmpId
        });
        this.vendorEmpObj.VendorEmpId = this.VendorEmpSalesObj.VendorEmpId;
      }
    );
  }

  GetVendorEmpAdminHead() {
    this.http.post(URLConstant.GetVendorEmpByVendorIdVendorEmpNo, this.vendorEmpAdminObj).subscribe(
      (response) => {
        this.VendorAdminHeadObj = response;
        this.AssetDataForm.patchValue({
          AdminHeadId: this.VendorAdminHeadObj.VendorEmpId
        });
      }
    );
  }

  GetVendorEmpBM() {
    this.http.post(URLConstant.GetVendorEmpByVendorIdVendorEmpNo, this.vendorEmpBMObj).subscribe(
      (response) => {
        this.VendorEmpBMObj = response;
        this.AssetDataForm.patchValue({
          BranchManagerId: this.VendorEmpBMObj.VendorEmpId
        });
      }
    );
  }

  GetVendorEmpList() {
    this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, this.vendorObj).subscribe(
      (response) => {
        this.EmpObj = response[CommonConstant.ReturnObj];
        this.AdminHeadObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === CommonConstant.ADMIN_HEAD_JOB_CODE);
        this.SalesPersonObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === CommonConstant.SALES_JOB_CODE);
        this.BranchManagerObj = this.EmpObj.filter(
          emp => emp.MrVendorEmpPositionCode === CommonConstant.BRANCH_MANAGER_JOB_CODE);
      }
    );
  }

  GetAssetMaster(assetMasterObj) {
    this.http.post(URLConstant.GetAssetMasterTypeByFullAssetCode, assetMasterObj).subscribe(
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

  AssetConditionChanged() {
    if (this.AssetConditionObj != null) {
      var filter: any;
      filter = this.AssetConditionObj.filter(
        cond => cond.Key == this.AssetDataForm.controls.MrAssetConditionCode.value);
      this.AssetConditionName = filter[0].Value;
    }
    if (this.AssetDataForm.controls.MrAssetConditionCode.value != '' && this.AssetDataForm.controls.MrAssetConditionCode.value != undefined && this.AssetDataForm.controls.ManufacturingYear.value != '' && this.AssetDataForm.controls.ManufacturingYear.value != undefined && this.AssetDataForm.controls.AssetCategoryCode.value != '' && this.AssetDataForm.controls.AssetCategoryCode.value != undefined && this.AssetDataForm.controls.MrAssetUsageCode.value != '' && this.AssetDataForm.controls.MrAssetUsageCode.value != undefined) {
      this.SetDpValue();
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
    this.inputAddressObjForOwner.default = this.ownerAddrObj;
    this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
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



  GetVendorAccessories() {
    this.http.post(URLConstant.GetVendorByVendorCode, this.vendorObj).subscribe(
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
    this.http.post(URLConstant.GetVendorEmpSupervisorByVendorEmpNo, this.vendorEmpObj).subscribe(
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

  SetOwnerAddrType(event) {
    this.copyFromAppCustAddrForOwner = event;
  }

  async GetAppCust() {
    var appObj = {
      AppId: this.AppId,
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

  async GetAppCustPhone() {
    if(typeof(this.AppCustObj) != 'undefined')
    {
      var appObj = {
        AppId: this.AppId,
      };
      await this.http.post(URLConstant.GetCustDataByAppId, appObj).toPromise().then(
        (response) => {
          if (typeof(response['AppCustPersonalObj']) != 'undefined') this.AppCustObj.MobilePhnNo1 = response['AppCustPersonalObj']['MobilePhnNo1'];
        }
      );
    }
    
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

  async GetAppCustCoy() {
    var appObj = {
      AppId: this.AppCustObj.AppCustId,
    };
    await this.http.post(URLConstant.GetAppCustCompanyByAppCustId, appObj).toPromise().then(
      (response) => {
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

  GenerataAppAssetAttr() {
    var GenObj =
    {
      AppAssetId: this.appAssetId,
      AssetTypeCode: this.RefProdCmptAssetType.CompntValue
    };
    this.http.post(URLConstant.GenerateAppAssetAttr, GenObj).subscribe(
      (response) => {
        this.AppAssetAttrObj = response[CommonConstant.ReturnObj];
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
      for (let j = 0; j < this.appAssetAttrObjs.length; j++) {
        var listAppRsvFunds = this.AssetDataForm.controls["AppAssetAttrObjs"] as FormArray;        
        listAppRsvFunds.push(this.addGroupAppAssetAttr(this.appAssetAttrObjs[j], j));
      }
      this.isAssetAttrReady = true;
    }
    
  }
  addGroupAppAssetAttr(appAssetAttrObjs, i) {
    
    return this.fb.group({
      No: [i],
      AssetAttrCode: [appAssetAttrObjs.AssetAttrCode],
      AssetAttrName: [appAssetAttrObjs.AssetAttrName],
      AttrInputType: [appAssetAttrObjs.AttrInputType],
      AttrValue: [appAssetAttrObjs.AttrValue, [Validators.maxLength(appAssetAttrObjs.AttrLength)]]
    })

  }
} 
