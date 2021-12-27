import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NGXToastrService} from 'app/components/extra/toastr/toastr.service';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AdInsConstant} from 'app/shared/AdInstConstant';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe, formatDate} from '@angular/common';
import {first, map, mergeMap} from 'rxjs/operators';
import {AppObj} from 'app/shared/model/App/App.Model';
import {forkJoin} from 'rxjs';
import {CommonConstant} from 'app/shared/constant/CommonConstant';
import {URLConstant} from 'app/shared/constant/URLConstant';
import {ExceptionConstant} from 'app/shared/constant/ExceptionConstant';
import {AdInsHelper} from 'app/shared/AdInsHelper';
import {CookieService} from 'ngx-cookie';
import {String} from 'typescript-string-operations';
import {LookupTaxCityIssuerComponent} from 'app/NEW-NAP/sharing-component/input-nap-component/multi-asset-data/collateral-add-edit/lookup-tax-city-issuer/lookup-tax-city-issuer.component';
import {CommonConstantX} from 'app/impl/shared/constant/CommonConstantX';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';
import {VendorEmpObj} from 'app/shared/model/vendor-emp.model';
import {InputFieldObj} from 'app/shared/model/input-field-obj.model';
import {AppCustAddrObj} from 'app/shared/model/app-cust-addr-obj.model';
import {AllAssetDataObj} from 'app/shared/model/all-asset-data-obj.model';
import {AssetTypeSerialNoLabelCustomObj} from 'app/shared/model/asset-type-serial-no-label-custom-obj.model';
import {AppAssetAccessoryObj} from 'app/shared/model/app-asset-accessory-obj.model';
import {AppAssetAttrCustomObj} from 'app/shared/model/app-asset/app-asset-attr-custom.model';
import {ListAppCollateralDocObj} from 'app/shared/model/list-app-collateral-doc-obj.model';
import {AppCollateralDocObj} from 'app/shared/model/app-collateral-doc-obj.model';
import {InputLookupObj} from 'app/shared/model/input-lookup-obj.model';
import {InputAddressObj} from 'app/shared/model/input-address-obj.model';
import {GenericListByCodeObj} from 'app/shared/model/generic/generic-list-by-code-obj.model';
import {ResSysConfigResultObj} from 'app/shared/model/response/res-sys-config-result-obj.model';
import {CustomPatternObj} from 'app/shared/model/custom-pattern-obj.model';
import {KeyValueObj} from 'app/shared/model/key-value/key-value-obj.model';
import {GenericObj} from 'app/shared/model/generic/generic-obj.model';
import {ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj} from 'app/shared/model/request/vendor/req-vendor-emp.model';
import {environment} from 'environments/environment';
import {CriteriaObj} from 'app/shared/model/criteria-obj.model';
import {AppAssetObj} from 'app/shared/model/app-asset-obj.model';
import {AppCollateralObj} from 'app/shared/model/app-collateral-obj.model';
import {AppCollateralRegistrationObj} from 'app/shared/model/app-collateral-registration-obj.model';
import {RefMasterObj} from 'app/shared/model/ref-master-obj.model';
import {GeneralSettingObj} from 'app/shared/model/general-setting-obj.model';
import {AppAssetAttrObj} from 'app/shared/model/app-asset-attr-obj.model';
import {AppCollateralAttrObj} from 'app/shared/model/app-collateral-attr-obj.model';
import {AppCollateralAccessoryObj} from 'app/shared/model/app-collateral-accessory-obj.model';
import {AddrObj} from 'app/shared/model/addr-obj.model';
import {ResponseJobDataPersonalObj} from 'app/shared/model/response-job-data-personal-obj.model';
import {AppCustPersonalJobDataObj} from 'app/shared/model/app-cust-personal-job-data-obj.model';
import {RefCoyObj} from 'app/shared/model/ref-coy-obj.model';
import {UcDropdownListObj} from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { AppCustCompanyObj } from 'app/shared/model/app-cust-company-obj.model';

@Component({
  selector: 'app-asset-data-add-edit-x',
  templateUrl: './asset-data-add-edit-x.component.html',
  styleUrls: ['./asset-data-add-edit-x.component.css']
})
export class AssetDataAddEditXComponent implements OnInit {

  @Input() mode: string;
  @Input() AppAssetId: number;
  @Input() BizTemplateCode: string = "-";
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() assetValue: EventEmitter<object> = new EventEmitter();
  currentChassisNo: string = "";
  @Input() AppId: number;
  LobCode: string = "";
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
  AddrLegalObj: AppCustAddrObj = new AppCustAddrObj();
  AddrMailingObj: any;
  IsIntegrator: boolean = false;
  isSerialReady: boolean = false;
  isAddressReady: boolean = false;

  AddrResidenceObj: any;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AppCustAddrObj;
  AppCustAddrObj: Array<AppCustAddrObj> = new Array();
  appCustAddrObj: any;
  returnAppCustAddrObj: any;
  allAssetDataObj: AllAssetDataObj;
  appCustObj: any;
  assetUsageObj: any
  returnAssetUsageObj: any;
  appAssetObj: any;
  returnAppAssetObj: any;
  returnAppCollateralRegistrationObj: any;
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
  isSLB : boolean = false;

  listAppCollateralDocObj: ListAppCollateralDocObj = new ListAppCollateralDocObj();
  appCollateralDoc: AppCollateralDocObj = new AppCollateralDocObj();



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
    MrAssetConditionCode: ['', Validators.required],
    AssetUsage: [''],
    LicensePlate: [''],
    ChassisNo: [''],
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.max(new Date().getFullYear())]],
    EngineNo: [''],
    Notes: [''],

    TaxIssueDt: [''],
    Color: [''],

    SelfUsage: [false],
    SelfOwner: [false],
    Username: [''],
    UserRelationship: [''],
    OwnerName: [''],
    MrOwnerRelationshipCode: ['', Validators.required],
    OwnerIdType: [''],
    MrIdTypeCode: ['', Validators.required],
    OwnerProfessionCode: [''],
    OwnerIdNo: [''],
    OwnerAddr: [''],
    OwnerAreaCode1: [''],
    OwnerAreaCode2: [''],
    OwnerAreaCode3: [''],
    OwnerAreaCode4: [''],
    OwnerZipcode: [''],
    OwnerMobilePhn: [''],
    OwnerMobilePhnNo: [''],
    OwnerAddrType: [''],
    MrOwnerTypeCode: [''],

    LocationAddrType: [''],

    DownPaymentPrctg: [''],
    DownPaymentAmt: [''],
    items: this.fb.array([]),
    AssetAccessoriesObjs: this.fb.array([]),
    AppAssetAttrObjs: this.fb.array([]),
    ListDoc: this.fb.array([])
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
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  IsSvcExist: boolean = false;
  LastRequestedDate: Date;
  indexChassis: number = 0;
  SerialNoRegex: string;
  ListPattern: Array<CustomPatternObj> = new Array<CustomPatternObj>();
  InputLookupCityIssuerObj : any;
  DpObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  IsReady: boolean = false;
  OwnerTypeObj: Array<KeyValueObj>;
  OwnerProfessionObj: Array<KeyValueObj> = new Array();
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();
  AppCustCoyObj: AppCustCompanyObj;
  RMAssetCondObj: Array<KeyValueObj> = new Array<KeyValueObj>();

  //URS-LOS-166
  generalSettingVendorSLBObj: GenericObj;
  vendorSLBId : 0;
  ReqGetVendorSLB : GenericObj = new GenericObj();

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
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
      // if (params["LobCode"] != null) {
      //   this.LobCode = params["LobCode"];
      // }
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
    this.GetRefAssetDocList(false);
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
        let returnGeneralSettingObj = response;

        let gsNeedCheckBySystem = returnGeneralSettingObj["ResGetListGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        let gsUseDigitalization = returnGeneralSettingObj["ResGetListGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);

        if(gsNeedCheckBySystem != undefined){
          this.IntegratorCheckBySystemGsValue = gsNeedCheckBySystem.GsValue;
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if(gsUseDigitalization != undefined){
          this.IsUseDigitalization = gsUseDigitalization.GsValue;
          this.getDigitalizationSvcType();
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }
      }
    );
  }
  async GetThirdPartyResultH(){
    let ChassisNoValue = this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value;
    await this.http.post(URLConstant.GetAppAssetFromThirdPartyResultHByTrxTypeCodeAndTrxNoAndChassisNoForFraudChecking, {TrxNo : this.appData.AppNo, TrxTypeCode : "APP", ChassisNo : ChassisNoValue}).toPromise().then(
      (response) => {
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
  async GetListAddr() {
    this.appObj.Id = this.AppId;
    await this.http.post(URLConstant.GetListAppCustAddrByAppId, this.appObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AddrLegalObj = this.AppCustAddrObj.find(
          emp => emp.MrCustAddrTypeCode === CommonConstant.AddrTypeLegal);
        this.AssetDataForm.patchValue({ LocationAddrType: response[CommonConstant.ReturnObj][0]['AppCustAddrId'] });
      }
    );
  }

  GetRefAssetDocList(isInit: boolean) {
    this.http.post(URLConstantX.GetRefAssetDocList, { Code: this.AssetDataForm.get("AssetTypeCode").value }).subscribe(
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
          else if(this.AssetDataForm.controls.MrAssetConditionCode.value == CommonConstantX.APP_ASSET_CONDITION_CODE_USED)
          {
            for (let i = 0; i < ListDoc.length; i++)
            {
              if(ListDoc.controls[i]['controls']['IsMandatoryUsed'].value)
              {
                ListDoc.controls[i]['controls']['IsReceived'].setValidators(Validators.requiredTrue);
                ListDoc.controls[i]['controls']['IsReceived'].updateValueAndValidity();
              }
            }
          }
        }
        if(isInit){
          this.setAppCollateralDoc(this.returnAppCollateralObj.AppCollateralId);
        }
      });
  }

  setAppCollateralDoc(AppCollateralId: number = 0) {
    this.http.post(URLConstantX.GetListAppCollateralDocsByAppCollateralId, { Id: AppCollateralId }).subscribe(
      (response) => {
        let AppCollateralDocs = new Array();
        AppCollateralDocs = response["AppCollateralDocs"];
        if (AppCollateralDocs["length"] > 0) {
          for (let i = 0; i < this.AssetDataForm.controls.ListDoc["controls"].length; i++) {
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

  copyToLocationAddr() {
    // this.appCustAddrObj = new AppCustAddrObj();
    // this.appCustAddrObj.AppCustAddrId = this.AssetDataForm.controls["LocationAddrType"].value;
    let appCustAddrObj = { Id: this.AssetDataForm.controls["LocationAddrType"].value };
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

  async GetAppCust() {
    let appObj = {
      Id: this.AppId,
    };
    await this.http.post(URLConstant.GetAppCustByAppId, appObj).toPromise().then(
      (response) => {
        this.appCustObj = response;
        this.custType = this.appCustObj.MrCustTypeCode;
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
    let hasAssetCondition = this.AssetDataForm.controls["MrAssetConditionCode"].value != '' && this.AssetDataForm.controls["MrAssetConditionCode"].value != undefined ? true : false;
    let hasAssetUsage = this.AssetDataForm.controls["AssetUsage"].value != '' && this.AssetDataForm.controls["AssetUsage"].value != undefined ? true : false;
    let hasManufacturingYear = this.AssetDataForm.controls["ManufacturingYear"].value != '' && this.AssetDataForm.controls["ManufacturingYear"].value != undefined ? true : false;
    let hasAssetCategory = this.AssetDataForm.controls["AssetCategoryCode"].value != '' && this.AssetDataForm.controls["AssetCategoryCode"].value != undefined ? true : false;
    if (hasAssetCondition && hasAssetUsage && hasManufacturingYear && hasAssetCategory) {
      return true;
    }
    else {
      return false;
    }
  }

  SelfUsageChange(event) {
    if (event.checked == true) {
      this.AssetDataForm.controls.Username.clearValidators();
      this.AssetDataForm.controls.Username.updateValueAndValidity();
      this.AssetDataForm.controls.UserRelationship.clearValidators();
      this.AssetDataForm.controls.UserRelationship.setValue(CommonConstant.SelfCustomer);
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
      let temp: any;
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

      let temp: any;
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
    let CheckValidObj = {
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
    let CheckValidObj = {
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
          let assetValidationRule = response;
          this.AssetValidationResult = response;
          this.grossDPPrcnt = assetValidationRule["DPPrcnt"];
          // X DSF Non Jora Udin : Fix issue DP tereset ketika input manucfaturing year
          if (assetValidationRule["DPPrcnt"] != null && !this.AssetDataForm.controls['DownPayment'].value) {
          //if (assetValidationRule["DPPrcnt"] != null) {
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
          //     let minDP = this.AssetDataForm.controls["AssetPrice"].value * assetValidationRule["GrossDPPrctg"] / 100;
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
    let value = this.AssetDataForm.controls["MrDownPaymentTypeCode"].value;
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

    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isRequired = false;
    this.InputLookupProfessionObj.isReady = true;

    this.AssetDataForm.updateValueAndValidity();

    this.SetOwnerAddress();
    this.SetLookupAsset();
    this.SetLookupSupplier();
    await this.GetAppCust();
    await this.bindIdTypeObj();
    await this.bindAssetConditionObj();
    if(this.custType == CommonConstant.CustTypePersonal){
      await this.GetAppCustPersonalJobData();
    }else{
      await this.GetAppCustCoy();
    }

    await this.bindOwnerTypeAndProfessionObj();
    this.items = this.AssetDataForm.get('items') as FormArray;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.title = "Asset Location";
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;
    this.inputAddressObjForLoc.showOwnership = false;

    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationAddrObj.inputLookupObj.isRequired = false;

    await this.bindDownPaymentTypeObj();
    await this.GetListAddr();
    await this.GetGS();

    await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).pipe(
      map((response: AppObj) => {
        this.appData = response;
        return response;
      }),
      mergeMap((response: AppObj) => {
        let getVendorSchmCode = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "SUPPLSCHM", ProdOfferingVersion: response.ProdOfferingVersion });
        let getAssetCond = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETCOND", ProdOfferingVersion: response.ProdOfferingVersion });
        let getAssetType = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETTYPE", ProdOfferingVersion: response.ProdOfferingVersion });
        let getAssetSchm = this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, { ProdOfferingCode: response.ProdOfferingCode, RefProdCompntCode: "ASSETSCHM", ProdOfferingVersion: response.ProdOfferingVersion });
        let RegexSerialNo = this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSSerialNoRegex });

        return forkJoin([getVendorSchmCode, getAssetCond, getAssetType, getAssetSchm, RegexSerialNo]);
      })
    ).toPromise().then(
      async (response) => {
        this.vendorSchmCode = response[0];
        this.bindAccessories();
        this.returnAssetConditionObj = response[1]['DDLRefProdComptCode'];
        let assetType = response[2];
        let assetSchm = response[3];
        this.SerialNoRegex = response[4]["GsValue"];
        this.assetTypeCompntValue = assetType["CompntValue"];

        let obj: CustomPatternObj = {
          pattern: this.SerialNoRegex,
          invalidMsg: "Cannot input special character"
        }
        this.ListPattern.push(obj);

        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

        this.AssetDataForm.patchValue({
          MrAssetConditionCode: this.returnAssetConditionObj[0]["Key"],
          MrAssetConditionCodeView: this.returnAssetConditionObj[0]["Value"]
        });


        if(this.returnAssetConditionObj.length > 1){
          this.AssetDataForm.controls["MrAssetConditionCode"].enable();
        }else{
          this.AssetDataForm.controls["MrAssetConditionCode"].disable();
        }

        this.GenerataAppAssetAttr(false);

        await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
          Code: assetType["CompntValue"]
        }).toPromise().then(
          async (response: any) => {
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

            if(this.isUsed){
              for (let i = 0; i < this.items.length; i++) {
                if (this.items.controls[i]['controls']['IsMandatory'].value == true) {
                  this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required, Validators.pattern(this.SerialNoRegex)]);
                  this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
                }
              }
            }

            this.isSerialReady = true;
          });

        let arrCritSuppl = new Array<CriteriaObj>();
        let critObjSuppl = new CriteriaObj();
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

        let arrCritAsset = new Array<CriteriaObj>();
        let critObjAsset = new CriteriaObj();
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
    this.userRelationshipObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
    if (this.appCustObj.CustType == CommonConstant.CustTypePersonal) {
      this.userRelationshipObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    }
    this.userRelationshipObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.userRelationshipObj).subscribe(
      (response) => {
        this.returnUserRelationshipObj = response[CommonConstant.ReturnObj];
        this.OwnerRelationObj = response[CommonConstant.ReturnObj];
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
    //URS-LOS-166
    if(this.appData.LobCode == CommonConstantX.SLB)
    {
      this.LobCode = CommonConstantX.SLB;
      this.isSLB = true;
      this.generalSettingVendorSLBObj = new GenericObj();

      await this.http.post(URLConstant.GetGeneralSettingValueByCode, {Code: CommonConstantX.GSVendorSlbCode}).toPromise().then(
        (response: GeneralSettingObj) => {
          this.generalSettingVendorSLBObj.Code = response.GsValue;
        }
      );
      this.ReqGetVendorSLB.Code = this.generalSettingVendorSLBObj.Code;
      await this.http.post(URLConstantX.GetVendorForSLB, this.ReqGetVendorSLB).toPromise().then(
        (response) => {
          this.returnVendorObj = response;
          this.InputLookupSupplierObj.nameSelect = this.returnVendorObj.VendorName;
          this.InputLookupSupplierObj.jsonSelect = this.returnVendorObj;
          this.vendorSLBId = this.returnVendorObj.VendorId;
          this.AssetDataForm.patchValue({
            SupplCode: this.returnVendorObj.VendorCode,
            SupplName: this.returnVendorObj.VendorName,
          });
        }
      );

      this.InputLookupSupplierObj.isDisable = true;

      let ReqGetListActiveVendorSalesSlb : ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj = new ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj;
      ReqGetListActiveVendorSalesSlb.VendorId = this.vendorSLBId;
      ReqGetListActiveVendorSalesSlb.MrVendorEmpPositionCodes = [CommonConstant.SALES_JOB_CODE];
      await this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, ReqGetListActiveVendorSalesSlb).toPromise().then(
        (response) => {
          this.listSalesObj = response[CommonConstant.ReturnObj];
          this.AssetDataForm.patchValue({
            SalesPersonId: this.listSalesObj[0].VendorEmpId,
            SalesPersonName: this.listSalesObj[0].VendorEmpName,
            SalesPersonNo: this.listSalesObj[0].VendorEmpNo,
            SalesPersonPositionCode: this.listSalesObj[0].MrVendorEmpPositionCode,
        });
      });
    }
    this.isAddressReady = true;
    this.GetEditData();
  }

  async GetEditData() {
    let datePipe = new DatePipe("en-US");
    if (this.mode == 'editAsset') {
      // this.AssetDataForm.controls['ManufacturingYear'].setValidators([Validators.required]);
      // this.AssetDataForm.controls['ManufacturingYear'].updateValueAndValidity();

      this.appAssetObj = new AppAssetObj();
      this.appAssetObj.AppAssetId = this.AppAssetId;
      let appAssetObj = { Id: this.AppAssetId };
      await this.http.post(URLConstant.GetAllAssetDataByAppAssetId, appAssetObj).toPromise().then(
        async (response) => {
          this.returnAppCollateralRegistrationObj = response["ResponseAppCollateralRegistrationObj"];
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
            TaxCityIssuer: {value: this.returnAppAssetObj.TaxCityIssuer},
            TaxIssueDt: datePipe.transform(this.returnAppAssetObj.TaxIssueDt, "yyyy-MM-dd")
          });

          if (this.returnAppAssetObj != null) {
            for (let i = 0; i < this.items.length; i++) {
              if (this.items.controls[i] != null) {
                this.items.controls[i]["controls"]["SerialNoValue"].value = this.returnAppAssetObj["SerialNo" + (i + 1)];
              }
            }
          }

          this.UcAddressHandler(this.returnAppAssetObj.MrAssetConditionCode); 

          this.updateValueDownPaymentPrctg();
          this.appAssetAccessoriesObjs = response["ResponseAppAssetAccessoryObjs"];

          if (this.returnAppAssetObj) 
          {
            for (let i = 0; i < this.items.length; i++) 
            {
              if (!this.items.controls[i]) continue;
              
              this.items.controls[i].patchValue({
                'SerialNoValue' : this.returnAppAssetObj["SerialNo" + (i + 1)]
              });
              this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
              if (this.items.controls[i]["controls"]["SerialNoLabel"].value == "Chassis No"){
                this.indexChassis = i;
              }
            }
            this.GetThirdPartyResultH();
          }
        });

      this.InputLookupCityIssuerObj.nameSelect = this.returnAppAssetObj.TaxCityIssuer;
      this.InputLookupCityIssuerObj.jsonSelect = { DistrictName: this.returnAppAssetObj.TaxCityIssuer };

      let reqByCode = new GenericObj();
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

      let ReqGetVendorLookup: GenericObj = new GenericObj();
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
              let ReqGetListActiveVendor: ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj = new ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj;
              ReqGetListActiveVendor.VendorId = this.returnVendorObj.VendorId;
              ReqGetListActiveVendor.MrVendorEmpPositionCodes = [CommonConstant.ADMIN_HEAD_JOB_CODE];
              this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, ReqGetListActiveVendor).subscribe(
                (response) => {
                  this.listAdminHeadObj = response[CommonConstant.ReturnObj];
                  if (this.headAppAssetSupplEmpObj.AppAssetSupplEmpId != 0) {
                    let temp: any;
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
              let ReqGetListActiveVendorSales: ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj = new ReqGetListActiveVendorEmpByVendorIdAndPositionCodeObj;
              ReqGetListActiveVendorSales.VendorId = this.returnVendorObj.VendorId;
              ReqGetListActiveVendorSales.MrVendorEmpPositionCodes = [CommonConstant.SALES_JOB_CODE];
              this.http.post(URLConstant.GetListActiveVendorEmpByVendorIdAndPositionCodes, ReqGetListActiveVendorSales).subscribe(
                (response) => {
                  this.listSalesObj = response[CommonConstant.ReturnObj];
                  let temp: any;
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
            async (response) => {
              this.returnAppCollateralRegistObj = response;
              
              let MrOwnerTypeCode = this.returnAppCollateralRegistObj.MrOwnerTypeCode;
              let isFromDB = true;
              if (MrOwnerTypeCode == null){
                MrOwnerTypeCode = this.custType;
                isFromDB = false;
              }

              this.AssetDataForm.patchValue({
                Username: this.returnAppCollateralRegistObj.UserName,
                UserRelationship: this.returnAppCollateralRegistObj.MrUserRelationshipCode,
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
                SelfUsage: (this.returnAppCollateralRegistObj.MrUserRelationshipCode == CommonConstant.SelfCustomer),
                SelfOwner: (this.returnAppCollateralRegistObj.MrOwnerRelationshipCode == CommonConstant.SelfCustomer),
                OwnerProfessionCode: this.returnAppCollateralRegistObj.OwnerProfessionCode,
                MrOwnerTypeCode: MrOwnerTypeCode
              });

              await this.SelfUsageChange({ checked: (this.returnAppCollateralRegistObj.MrUserRelationshipCode == CommonConstant.SelfCustomer) });
              await this.SelfOwnerChange(false, MrOwnerTypeCode);
              await this.OwnerTypeChange(MrOwnerTypeCode, !isFromDB);

              this.inputFieldOwnerAddrObj = new InputFieldObj();
              this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
              let ownerAddrObj = new AddrObj();
              ownerAddrObj.Addr = this.returnAppCollateralRegistObj.OwnerAddr;
              ownerAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.OwnerAreaCode1;
              ownerAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.OwnerAreaCode2;
              ownerAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.OwnerAreaCode3;
              ownerAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.OwnerAreaCode4;
              ownerAddrObj.City = this.returnAppCollateralRegistObj.OwnerCity;
              this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.OwnerZipcode;
              this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.OwnerZipcode };
              this.inputAddressObjForOwner.default = ownerAddrObj;
              this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
              
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

              this.GetRefAssetDocList(true);
            });
        });
    }else{
      this.http.post(URLConstant.GetRefCoy, null).subscribe(
        (response: RefCoyObj) => {
          this.AssetDataForm.patchValue({
            MrIdTypeCode: CommonConstant.ID_TYPE_NPWP,
            OwnerName: response.FullName,
            OwnerIdNo: response.TaxIdNo,
            OwnerAddr: response.Addr,
            OwnerAreaCode1: response.AreaCode1,
            OwnerAreaCode2: response.AreaCode2,
            OwnerAreaCode3: response.AreaCode3,
            OwnerAreaCode4: response.AreaCode4,
            OwnerZipcode: response.Zipcode,
            OwnerCity: response.City,
            MrOwnerTypeCode: CommonConstant.CustTypeCompany,
          });
          this.inputFieldOwnerAddrObj = new InputFieldObj();
          this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
          let ownerAddrObj = new AddrObj();
          ownerAddrObj.Addr = response.Addr;
          ownerAddrObj.AreaCode1 = response.AreaCode1;
          ownerAddrObj.AreaCode2 = response.AreaCode2;
          ownerAddrObj.AreaCode3 = response.AreaCode3;
          ownerAddrObj.AreaCode4 = response.AreaCode4;
          ownerAddrObj.City = response.City;
          this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = response.Zipcode;
          this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
          this.inputAddressObjForOwner.default = ownerAddrObj;
          this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;

          this.OwnerTypeChange(CommonConstant.CustTypeCompany, true);
          this.AssetDataForm.patchValue({
            OwnerProfessionCode : this.OwnerProfessionObj.find(x=>x.Key == CommonConstant.CompanyTypePT).Key
          });
        }
      );
    }
  }
  
  GenerataAppAssetAttr(isRefresh: boolean) {
    let GenObj =
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
        let appAssetAttrObj = new AppAssetAttrCustomObj();
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
      let listAppAssetAttrs = this.AssetDataForm.controls["AppAssetAttrObjs"] as FormArray;
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
          TaxCityIssuer: {value: response.DistrictCode}
        });
      }
    ).catch(() => {
    });
  }

  SetBpkbCity(event) {
    this.AssetDataForm.patchValue({
      TaxCityIssuer: {value: event.DistrictCode},
    });
  }

  async setAssetAttr(){
    this.allAssetDataObj.AppAssetAttrObj = new Array<AppAssetAttrObj>();

    if (this.AppAssetAttrObj != null) {
      for (let i = 0; i < this.AssetDataForm.controls["AppAssetAttrObjs"].value.length; i++) {
        let appAssetAttrObj = new AppAssetAttrObj();
        let appCollAttrcObj = new AppCollateralAttrObj();
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

  GetProfession(event) {
    this.AssetDataForm.patchValue({
      OwnerProfessionCode: event.ProfessionCode
    });
  }

  SetLookupAsset() {
    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";
  }
  SetLookupSupplier() {
    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplier_CollateralAsset_FL4W.json";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier_CollateralAsset_FL4W.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplier_CollateralAsset_FL4W.json";
  }

  setAppCollateralRegistration() {
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerName = this.AssetDataForm.controls.OwnerName.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AssetDataForm.controls.MrIdTypeCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AssetDataForm.controls.OwnerIdNo.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.AssetDataForm.controls.MrOwnerRelationshipCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerProfessionCode = this.AssetDataForm.controls.OwnerProfessionCode.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AssetDataForm.controls["ownerData"]["controls"].Addr.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode1.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode2.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode3.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AssetDataForm.controls["ownerData"]["controls"].AreaCode4.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerCity = this.AssetDataForm.controls["ownerData"]["controls"].City.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AssetDataForm.controls["ownerDataZipcode"]["controls"].value.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AssetDataForm.controls.OwnerMobilePhnNo.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrOwnerTypeCode = this.AssetDataForm.controls.MrOwnerTypeCode.value;
  }

  async setSupplierInfo() {
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

  async setAssetInfo() {
    let assetForm = this.AssetDataForm.getRawValue();
    this.allAssetDataObj.AppAssetObj.AppId = this.AppId;
    this.allAssetDataObj.AppAssetObj.FullAssetName = this.AssetDataForm.controls["FullAssetName"].value;
    this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.AssetDataForm.controls["MrAssetConditionCode"].value;
    this.allAssetDataObj.AppAssetObj.MrAssetUsageCode = this.AssetDataForm.controls["AssetUsage"].value;
    for (let i = 0; i < this.items.length; i++) {
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
    this.allAssetDataObj.AppAssetObj.TaxCityIssuer = this.AssetDataForm.controls["TaxCityIssuer"].value.value;
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
    let DownPayment = this.AssetDataForm.controls.AssetPrice.value * this.AssetDataForm.controls.DownPaymentPrctg.value / 100;
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
    let DownPaymentPrctg = this.AssetDataForm.controls.DownPayment.value / this.AssetDataForm.controls.AssetPrice.value * 100;
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
  async setAssetUser() {
    this.allAssetDataObj.AppCollateralRegistrationObj.UserName = this.AssetDataForm.controls["Username"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.AssetDataForm.controls["UserRelationship"].value;
  }

  async setAssetLocation() {
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAddr = this.AssetDataForm.controls["assetLocationAddress"]["controls"].Addr.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode1.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode2.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode3.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode4.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationCity = this.AssetDataForm.controls["assetLocationAddress"]["controls"].City.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AssetDataForm.controls["assetLocationAddressZipcode"]["controls"].value.value;
  }

  async setCollateralAttribute() {
    let collAttr;
    if (this.AssetDataForm.controls["Color"].value != "" && this.AssetDataForm.controls["Color"].value != null) {
      collAttr = new AppCollateralAttrObj();
      collAttr.CollateralAttrCode = "COLOR";
      collAttr.CollateralAttrName = "Color";
      collAttr.AttrValue = this.AssetDataForm.controls["Color"].value;
      this.allAssetDataObj.AppCollateralAttrObj.push(collAttr);
    }
    if (this.AssetDataForm.controls["TaxCityIssuer"].value.value != "" && this.AssetDataForm.controls["TaxCityIssuer"].value.value != null) {
      collAttr = new AppCollateralAttrObj();
      collAttr.CollateralAttrCode = "TAX_CITY_ISSUER";
      collAttr.CollateralAttrName = "Tax City Issuer";
      collAttr.AttrValue = this.AssetDataForm.controls["TaxCityIssuer"].value.value;
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

  async setCollateralDocs() {
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

  async SaveForm() {
    let assetForm = this.AssetDataForm.getRawValue();
    let confirmMsg = "";
    let isValidOk = true;
    await this.AssetValidationForSave();


    if (this.AssetValidationResult) {
      let sumAssetAccessories: number = 0;
      if(assetForm.AssetAccessoriesObjs.length > 0){
        sumAssetAccessories = assetForm.AssetAccessoriesObjs.map(x => x.AccessoryPriceAmt).reduce((acc, curr) => acc + curr);
      }

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
        let assetDPMin = this.AssetValidationResult.DPMin * (assetForm.AssetPrice + sumAssetAccessories) / 100;
        let assetDPMax = this.AssetValidationResult.DPMax * assetForm.AssetPrice / 100;
        if (assetForm.DownPayment < assetDPMin) {
          isValidOk = false;
          confirmMsg = "Down Payment Amount is Lower than Minimum Amount";
        }
        else if (assetForm.DownPayment > assetDPMax) {
          isValidOk = false;
          confirmMsg = "Down Payment Amount is Higher than Maximum Amount";
        }
      }

      if (this.AssetValidationResult.Behaviour == CommonConstant.RuleBehaviourLock) {
        if (this.AssetValidationResult.MinManufYear > this.AssetDataForm.get("ManufacturingYear").value) {
          this.toastr.warningMessage(ExceptionConstant.MANUFACTURING_YEAR_CAN_NOT_LESS_THAN + this.AssetValidationResult.MinManufYear);
          return false;
        }
      }
      if (this.AssetValidationResult.MinManufYear > this.AssetDataForm.get("ManufacturingYear").value) {
        if (confirmMsg != "") confirmMsg += "\n"
        isValidOk = false;
        confirmMsg += ExceptionConstant.MANUFACTURING_YEAR_IS_LESS_THAN + this.AssetValidationResult.MinManufYear;
      }


    }
    if (!isValidOk) {
      confirmMsg += ", Are You Sure to Save This Data ?";
      let confirmation = confirm(confirmMsg);
      if (!confirmation) {
        return false;
      }
    }


    if (this.mode == 'addAsset') {
      this.allAssetDataObj = new AllAssetDataObj();
      await this.setSupplierInfo();
      await this.setAssetInfo();
      await this.setAssetUser();
      await this.setAssetLocation();
      await this.setCollateralAttribute();
      await this.setAppAccessoryForSave();
      await this.setAssetAttr();
      this.setAppCollateralRegistration();
      await this.setCollateralDocs();
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
      //DSF TIDAK MEMAKAI RAPINDO
      // if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0" && this.IsSvcExist) {
      //   if (this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value == '' && this.IsIntegrator) {
      //     if (confirm("Chassis No not filled, submit data without Integrator ?")) {
      //       this.http.post(URLConstantX.AddEditAllAssetDataX, this.allAssetDataObj).subscribe(
      //         (response) => {
      //           this.toastr.successMessage(response["message"]);
      //           this.AssetDataForm.reset();
      //           //this.router.navigate(["/Nap/AssetData/Paging"]);
      //           this.assetValue.emit({ mode: 'paging' });
      //         });
      //     }
      //   }
      //   else if (!this.IsIntegrator) {
      //       if (confirm("Submit data without Integrator ?")) {
      //       this.http.post(URLConstantX.AddEditAllAssetDataX, this.allAssetDataObj).subscribe(
      //         (response) => {
      //           this.toastr.successMessage(response["message"]);
      //           this.AssetDataForm.reset();
      //           //this.router.navigate(["/Nap/AssetData/Paging"]);
      //           this.assetValue.emit({ mode: 'paging' });
      //         });
      //       }
      //   }
      //   else if (this.IsIntegrator) {
      //     this.http.post(URLConstantX.AddEditAllAssetDataX, this.allAssetDataObj).subscribe(
      //       (response) => {
      //         this.toastr.successMessage(response["message"]);
      //         this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDO, this.allAssetDataObj).subscribe(
      //           (response) => {
      //           });
      //           this.AssetDataForm.reset();
      //           this.assetValue.emit({ mode: 'paging' });
      //       });
      //   }
      // }

      await this.http.post(URLConstantX.AddEditAllAssetDataX, this.allAssetDataObj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.AssetDataForm.reset();
          this.assetValue.emit({ mode: 'paging' });
        });
    }
    else {
      this.allAssetDataObj = new AllAssetDataObj();
      await this.setSupplierInfo();
      await this.setAssetInfo();
      await this.setAssetUser();
      await this.setAssetLocation();
      await this.setCollateralAttribute();
      await this.setAppAccessoryForSave();
      await this.setAssetAttr();
      this.setAppCollateralRegistration();
      await this.setCollateralDocs();
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

      //DSF TIDAK MEMAKAI RAPINDO
      // if (this.IsUseDigitalization == "1" && this.IntegratorCheckBySystemGsValue == "0" && this.IsSvcExist) {
      //   if (this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value == '' && this.IsIntegrator) {
      //     if (confirm("Chassis No not filled, submit data without Integrator ?")) {
      //       this.http.post(URLConstantX.AddEditAllAssetDataX, this.allAssetDataObj).subscribe(
      //         (response) => {
      //           this.toastr.successMessage(response["message"]);
      //           this.AssetDataForm.reset();
      //           //this.router.navigate(["/Nap/AssetData/Paging"]);
      //           this.assetValue.emit({ mode: 'paging' });
      //         });
      //     }
      //   }
      //   else if (!this.IsIntegrator) {

      //     if (this.currentChassisNo == this.items.controls[this.indexChassis]['controls']['SerialNoValue'].value && this.returnAppAssetObj.AppAssetId != 0) {
      //       this.http.post(URLConstantX.AddEditAllAssetDataX, this.allAssetDataObj).subscribe(
      //         (response) => {
      //           this.toastr.successMessage(response["message"]);
      //           this.AssetDataForm.reset();
      //           this.assetValue.emit({ mode: 'paging' });
      //         });
      //     }
      //     else{
      //       if (confirm("Submit data without Integrator ?")) {
      //       this.http.post(URLConstantX.AddEditAllAssetDataX, this.allAssetDataObj).subscribe(
      //         (response) => {
      //           this.toastr.successMessage(response["message"]);
      //           this.AssetDataForm.reset();
      //           this.assetValue.emit({ mode: 'paging' });
      //         });
      //       }
      //     }
      //   }
      //   else if (this.IsIntegrator) {
      //     this.http.post(URLConstantX.AddEditAllAssetDataX, this.allAssetDataObj).subscribe(
      //       (response) => {
      //         this.toastr.successMessage(response["message"]);
      //         this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingAssetRAPINDO, this.allAssetDataObj).subscribe(
      //           (response) => {
      //           });
      //           this.AssetDataForm.reset();
      //           this.assetValue.emit({ mode: 'paging' });
      //       });
      //   }
      // }

      await this.http.post(URLConstantX.AddEditAllAssetDataX, this.allAssetDataObj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.AssetDataForm.reset();
          this.assetValue.emit({ mode: 'paging' });
        });
    }
  }
  addGroup(appAssetAccessoriesObj, i) {
    if (appAssetAccessoriesObj == undefined) {
      if (this.appData.LobCode == CommonConstantX.FL4W_LOB_CODE_SLB) {
        return this.fb.group({
          No: [i],
          AssetAccessoryCode: ['', [Validators.required, Validators.maxLength(50)]],
          AssetAccessoryName: ['', [Validators.maxLength(100)]],
          AccessoryPriceAmt: ['', [Validators.required,Validators.min(0.00)]],
          AccessoryDownPaymentType: [''],
          AccessoryDownPaymentPrcnt: [0, [Validators.required, Validators.min(0.00), Validators.max(100.00)]],
          AccessoryDownPaymentAmt: [0, [Validators.required,Validators.min(0.00)]],
          AccessoryNotes: ['']
        })
      } else {
        return this.fb.group({
          No: [i],
          AssetAccessoryCode: ['', [Validators.required, Validators.maxLength(50)]],
          AssetAccessoryName: ['', [Validators.maxLength(100)]],
          SupplCodeAccessory: ['', [Validators.required, Validators.maxLength(50)]],
          SupplNameAccessory: ['', [Validators.required, Validators.maxLength(100)]],
          AccessoryPriceAmt: ['', [Validators.required,Validators.min(0.00)]],
          AccessoryDownPaymentType: [''],
          AccessoryDownPaymentPrcnt: [0, [Validators.required, Validators.min(0.00), Validators.max(100.00)]],
          AccessoryDownPaymentAmt: [0, [Validators.required,Validators.min(0.00)]],
          AccessoryNotes: ['']
        })
      }
    } else {
      if (this.appData.LobCode == CommonConstantX.FL4W_LOB_CODE_SLB) {
        return this.fb.group({
          No: [i],
          AssetAccessoryCode: [appAssetAccessoriesObj.AssetAccessoryCode, [Validators.required, Validators.maxLength(50)]],
          AssetAccessoryName: [appAssetAccessoriesObj.AssetAccessoryName, [Validators.maxLength(100)]],
          AccessoryPriceAmt: [appAssetAccessoriesObj.AccessoryPriceAmt, [Validators.required,Validators.min(0.00)]],
          AccessoryDownPaymentType: [this.DpObj[0].Key],
          AccessoryDownPaymentPrcnt: [appAssetAccessoriesObj.DownPaymentPrcnt, [Validators.required, Validators.min(0.00), Validators.max(100.00)]],
          AccessoryDownPaymentAmt: [appAssetAccessoriesObj.DownPaymentAmt, [Validators.required,Validators.min(0.00)]],
          AccessoryNotes: [appAssetAccessoriesObj.AccessoryNotes, Validators.maxLength(4000)]
        })
      } else {
        return this.fb.group({
          No: [i],
          AssetAccessoryCode: [appAssetAccessoriesObj.AssetAccessoryCode, [Validators.required, Validators.maxLength(50)]],
          AssetAccessoryName: [appAssetAccessoriesObj.AssetAccessoryName, [Validators.maxLength(100)]],
          SupplCodeAccessory: [appAssetAccessoriesObj.SupplCode, [Validators.required, Validators.maxLength(50)]],
          SupplNameAccessory: [appAssetAccessoriesObj.SupplName, [Validators.required, Validators.maxLength(100)]],
          AccessoryPriceAmt: [appAssetAccessoriesObj.AccessoryPriceAmt, [Validators.required,Validators.min(0.00)]],
          AccessoryDownPaymentType: [this.DpObj[0].Key],
          AccessoryDownPaymentPrcnt: [appAssetAccessoriesObj.DownPaymentPrcnt, [Validators.required, Validators.min(0.00), Validators.max(100.00)]],
          AccessoryDownPaymentAmt: [appAssetAccessoriesObj.DownPaymentAmt, [Validators.required,Validators.min(0.00)]],
          AccessoryNotes: [appAssetAccessoriesObj.AccessoryNotes, Validators.maxLength(4000)]
        })
      }

    }
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


  initLookupSuppAcc() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
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
    critSuppObj.value = currentUserContext[CommonConstant.OFFICE_CODE];
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
    let appAccessoryObj = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
    let length = this.AssetDataForm.value["AssetAccessoriesObjs"].length;
    let max = 0;
    if (length > 0) {
      max = this.AssetDataForm.value["AssetAccessoriesObjs"][length - 1].No;
    }

    appAccessoryObj.push(this.addGroup(undefined, max + 1));

    if (this.appData.LobCode == CommonConstantX.FL4W_LOB_CODE_SLB) {
      let InputLookupAccObj = this.initLookupAcc();
      this.InputLookupAcceObjs.push(InputLookupAccObj);
      this.dictAccLookup[max + 1] = InputLookupAccObj;
    } else {
      let InputLookupAccObj = this.initLookupAcc();
      let InputLookupAccSupObj = this.initLookupSuppAcc();
      this.InputLookupAcceObjs.push(InputLookupAccObj);
      this.InputLookupSupplObjs.push(InputLookupAccSupObj);
      this.dictAccLookup[max + 1] = InputLookupAccObj;
      this.dictSuppLookup[max + 1] = InputLookupAccSupObj;
    }

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
      this.originalAssetAccs = [...this.appAssetAccessoriesObjs];
      for (let i = 0; i < this.appAssetAccessoriesObjs.length; i++) {
        let listAppAccessories = this.AssetDataForm.controls["AssetAccessoriesObjs"] as FormArray;
        listAppAccessories.push(this.addGroup(this.appAssetAccessoriesObjs[i], i));

        if (this.appData.LobCode == CommonConstantX.FL4W_LOB_CODE_SLB) {
          let InputLookupAccObj = this.initLookupAcc();
          this.dictAccLookup[i] = InputLookupAccObj;
          this.InputLookupAcceObjs.push(InputLookupAccObj);
        } else {
          let InputLookupAccObj = this.initLookupAcc();
          let InputLookupAccSupObj = this.initLookupSuppAcc();
          this.dictAccLookup[i] = InputLookupAccObj;
          this.dictSuppLookup[i] = InputLookupAccSupObj;
          this.InputLookupAcceObjs.push(InputLookupAccObj);
          this.InputLookupSupplObjs.push(InputLookupAccSupObj);
        }

        this.setAppAccessorySupplier(i, this.appAssetAccessoriesObjs[i].SupplCode);
        this.setAppAccessory(i, this.appAssetAccessoriesObjs[i].AssetAccessoryCode);
        this.ChangeAccessoryDPType(i, 'AMT');
      }
    }
  }

  async setAppAccessoryForSave() {
    this.allAssetDataObj.AppAssetAccessoryObjs = new Array<AppAssetAccessoryObj>();
    this.allAssetDataObj.AppCollateralAccessoryObjs = new Array<AppCollateralAccessoryObj>();
    this.allAssetDataObj.AppCollateralAttrObj = new Array<AppCollateralAttrObj>();

    for (let i = 0; i < this.AssetDataForm.controls["AssetAccessoriesObjs"].value.length; i++) {
      let appAssetAccObj = new AppAssetAccessoryObj();
      let appCollateralAccObj = new AppCollateralAccessoryObj();
      appAssetAccObj.AssetAccessoryCode = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryCode;
      appAssetAccObj.AssetAccessoryName = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryName;

      if (this.appData.LobCode == CommonConstantX.FL4W_LOB_CODE_SLB) {
        await this.http.post(URLConstantX.GetVendorForSLB, this.ReqGetVendorSLB).toPromise().then(
          (response) => {
            appAssetAccObj.SupplCode = response["VendorCode"];
            appAssetAccObj.SupplName = response["VendorName"]
          }
        );
      } else {
        appAssetAccObj.SupplCode = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].SupplCodeAccessory;
        appAssetAccObj.SupplName = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].SupplNameAccessory;
      }

      appAssetAccObj.AccessoryPriceAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryPriceAmt;
      appAssetAccObj.DownPaymentPrcnt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.value;
      appAssetAccObj.DownPaymentAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.value;
      appAssetAccObj.AccessoryNotes = this.AssetDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryNotes;

      appCollateralAccObj.CollateralAccessoryCode = appAssetAccObj.AssetAccessoryCode;
      appCollateralAccObj.CollateralAccessoryName = appAssetAccObj.AssetAccessoryName;
      appCollateralAccObj.AccessoryPriceAmt = appAssetAccObj.AccessoryPriceAmt;
      appCollateralAccObj.DownPaymentPrcnt = appAssetAccObj.DownPaymentPrcnt;
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

  UcAddressHandler(AssetCondition: string = "") {
    let serialNoIsRequired: boolean = false;
    this.inputAddressObjForLoc.inputField.inputLookupObj.isRequired = true;
    this.inputAddressObjForLoc.isRequired = true;
    if (this.AssetDataForm.controls.MrAssetConditionCode.value == CommonConstant.AssetConditionUsed || AssetCondition == CommonConstant.AssetConditionUsed) {
      this.inputAddressObjForLoc.inputField.inputLookupObj.isRequired = false;
      this.inputAddressObjForLoc.isRequired = false;
      serialNoIsRequired = true;
    }
    this.SetValidatorItemsSerialNo(serialNoIsRequired);
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

  async bindDownPaymentTypeObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode : CommonConstant.RefMasterTypeCodeDownPaymentType}).subscribe(
      (response) => {
        this.DpObj = response[CommonConstant.ReturnObj];
        this.IsReady = true;
      }
    );
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
    let InputAccessoryPrice = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryPriceAmt.value

    if(InputAccessoryPrice == 0){
      this.toastr.warningMessage(ExceptionConstant.ACCESSORY_PRICE_NOT_SET + " No " + (i+1));
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(0);
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(0);
      return;
    }

    let InputDPAmt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.value

    if(InputDPAmt > InputAccessoryPrice){
      this.toastr.warningMessage("Security Deposit Amount " + (i+1) + ExceptionConstant.CANNOT_BE_HIGHER_THAN_ACCESSORY_PRICE + " No " + (i+1));
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(0);
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(0);
      return;
    }

    let InputDPPrcnt = this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.value

    if(from == CommonConstant.DownPaymentTypeAmt){
      let DPPrcnt = InputDPAmt / InputAccessoryPrice * 100;
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(DPPrcnt);
    }else if(from == CommonConstant.DownPaymentTypePrcnt){
      let DPAmt = InputAccessoryPrice * InputDPPrcnt / 100;
      this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(DPAmt);
    }else{
      if(this.AssetDataForm.controls['AssetAccessoriesObjs']['controls'][i]['controls'].AccessoryDownPaymentType.value == CommonConstant.DownPaymentTypeAmt){
        let DPPrcnt = InputDPAmt / InputAccessoryPrice * 100;
        this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentPrcnt.setValue(DPPrcnt);
      }else{
        let DPAmt = InputAccessoryPrice * InputDPPrcnt / 100;
        this.AssetDataForm.controls["AssetAccessoriesObjs"]["controls"][i]["controls"].AccessoryDownPaymentAmt.setValue(DPAmt);
      }
    }
  }

  SetOwnerAddress() {
    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.showAllPhn = false;
  }

  async SelfOwnerChange(isEdit: boolean = false, OwnerType: string = this.custType) {
    let isChecked: boolean = this.AssetDataForm.get("SelfOwner").value;
    if (isChecked) {
      this.AssetDataForm.patchValue({
        OwnerName: this.appCustObj.CustName,
        MrIdTypeCode: this.appCustObj.MrIdTypeCode,
        OwnerIdNo: this.appCustObj.IdNo,
        MrOwnerRelationshipCode: CommonConstant.SelfCustomer,
        OwnerAddr: this.AddrLegalObj.Addr,
        OwnerAreaCode1: this.AddrLegalObj.AreaCode1,
        OwnerAreaCode2: this.AddrLegalObj.AreaCode2,
        OwnerAreaCode3: this.AddrLegalObj.AreaCode3,
        OwnerAreaCode4: this.AddrLegalObj.AreaCode4,
        OwnerCity: this.AddrLegalObj.City,
        OwnerZipcode: this.AddrLegalObj.Zipcode,
        OwnerMobilePhnNo: typeof (this.appCustObj.MobilePhnNo1) != 'undefined' ? this.appCustObj.MobilePhnNo1 : '',
        OwnerAddrType: CommonConstant.AddrTypeLegal,
        OwnerProfessionCode: OwnerType == CommonConstant.CustTypePersonal ? this.AppCustPersonalJobData.MrProfessionCode : this.AppCustCoyObj.MrCompanyTypeCode,
        MrOwnerTypeCode : OwnerType
      });

      if (!isEdit) {
        this.inputFieldOwnerAddrObj = new InputFieldObj();
        this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
        let ownerAddrObj = new AddrObj();
        ownerAddrObj.Addr = this.AddrLegalObj.Addr;
        ownerAddrObj.AreaCode1 = this.AddrLegalObj.AreaCode1;
        ownerAddrObj.AreaCode2 = this.AddrLegalObj.AreaCode2;
        ownerAddrObj.AreaCode3 = this.AddrLegalObj.AreaCode3;
        ownerAddrObj.AreaCode4 = this.AddrLegalObj.AreaCode4;
        ownerAddrObj.City = this.AddrLegalObj.City;
        this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AddrLegalObj.Zipcode;
        this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrLegalObj.Zipcode };
        this.inputAddressObjForOwner.default = ownerAddrObj;
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
  inputAddressObjForOwner: InputAddressObj = new InputAddressObj();
  inputFieldOwnerAddrObj: InputFieldObj = new InputFieldObj();
  setAddrOwnerObj() {
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();

    let ownerAddrObj = new AddrObj();
    ownerAddrObj.Addr = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAddr;
    ownerAddrObj.AreaCode1 = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode1;
    ownerAddrObj.AreaCode2 = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode2;
    ownerAddrObj.AreaCode3 = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode3;
    ownerAddrObj.AreaCode4 = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerAreaCode4;
    ownerAddrObj.City = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerCity;

    this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerZipcode;
    this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.appAssetObj.ResponseAppCollateralRegistrationObj.OwnerZipcode };
    this.inputAddressObjForOwner.default = ownerAddrObj;
    this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
  }

  AppCustPersonalJobData: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
  async GetAppCustPersonalJobData() {
    await this.http.post<ResponseJobDataPersonalObj>(URLConstant.GetAppCustPersonalJobData, { Id: this.appCustObj.AppCustId }).toPromise().then(
      (response) => {
        if(response.AppCustPersonalJobDataObj != null){
          this.AppCustPersonalJobData = response.AppCustPersonalJobDataObj;
        }
      }
    );
  }

  copyToOwnerAddr() {
    let OwnerAddrType: string = this.AssetDataForm.get("OwnerAddrType").value;
    if (OwnerAddrType != "") {
      let addrObj: AddrObj = this.AppCustAddrObj.find(emp => emp.MrCustAddrTypeCode === OwnerAddrType);

      this.AssetDataForm.patchValue({
        OwnerAddr: addrObj.Addr,
        OwnerAreaCode1: addrObj.AreaCode1,
        OwnerAreaCode2: addrObj.AreaCode2,
        OwnerAreaCode3: addrObj.AreaCode3,
        OwnerAreaCode4: addrObj.AreaCode4,
        OwnerCity: addrObj.City,
        OwnerZipcode: addrObj.Zipcode
      });
      let ownerAddrObj = new AddrObj();
      ownerAddrObj.Addr = addrObj.Addr;
      ownerAddrObj.AreaCode1 = addrObj.AreaCode1;
      ownerAddrObj.AreaCode2 = addrObj.AreaCode2;
      ownerAddrObj.AreaCode3 = addrObj.AreaCode3;
      ownerAddrObj.AreaCode4 = addrObj.AreaCode4;
      ownerAddrObj.City = addrObj.City;

      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AssetDataForm.controls.OwnerZipcode.value;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AssetDataForm.controls.OwnerZipcode.value };

      this.inputAddressObjForOwner.default = ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
    }
  }

  IdTypeObj: Array<KeyValueObj> = new Array();
  async bindIdTypeObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).toPromise().then(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  OwnerRelationObj: Array<KeyValueObj> = new Array();

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

  async GetAppCustCoy() {
    await this.http.post(URLConstant.GetAppCustCompanyByAppCustId, {Id: this.appCustObj.AppCustId}).toPromise().then(
      (response: any) => {
        this.AppCustCoyObj = response;
      }
    );
  }

  async bindOwnerTypeAndProfessionObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType }).toPromise().then(
      (response) => {
        this.OwnerTypeObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({
          MrOwnerTypeCode : this.custType
        });
      }
    );

    let ReqCompanyTypeObj = new RefMasterObj();
    ReqCompanyTypeObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCompanyType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, ReqCompanyTypeObj).toPromise().then(
      (response) => {              
        this.OwnerProfessionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async bindAssetConditionObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetCondition }).toPromise().then(
      (response) => {
        this.RMAssetCondObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async OwnerTypeChange(OwnerType: string, IsOwnerTypeChanged: boolean = false){
    let ownerCode: string = "";
    if (this.returnAppCollateralRegistrationObj) ownerCode = this.returnAppCollateralRegistrationObj.OwnerProfessionCode;
    if(OwnerType == CommonConstant.CustTypePersonal){
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
      if(IsOwnerTypeChanged){
        this.AssetDataForm.patchValue({
          OwnerProfessionCode : ""
        });
      } else {
        this.AssetDataForm.patchValue({
          OwnerProfessionCode : ownerCode
        });
      }
    }
  }
}