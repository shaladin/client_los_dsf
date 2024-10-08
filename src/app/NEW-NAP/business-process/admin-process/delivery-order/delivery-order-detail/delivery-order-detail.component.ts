import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DeliveryOrderObj } from 'app/shared/model/delivery-order-obj.model';
import { AppCollateralDocObj } from 'app/shared/model/app-collateral-doc-obj.model';
import { ListAppCollateralDocObj } from 'app/shared/model/list-app-collateral-doc-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { AssetTypeSerialNoLabelCustomObj } from 'app/shared/model/asset-type-serial-no-label-custom-obj.model';
import { environment } from 'environments/environment';
import { AgrmntTcObj } from 'app/shared/model/agrmnt-tc/agrmnt-tc-obj.model';
import { DatePipe } from '@angular/common';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { AppObj } from 'app/shared/model/app/app.model';
import { AppAssetAttrCustomObj } from 'app/shared/model/app-asset/app-asset-attr-custom.model';
import { ReqAppAssetAttrObj } from 'app/shared/model/app-asset-attr-obj.model';
import { ReqAppCollateralAttrObj } from 'app/shared/model/app-collateral-attr-obj.model';
import { DeliveryOrderHObj } from 'app/shared/model/delivery-order-h-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/app-collateral-registration-obj.model';
import { RefAttrSettingObj } from 'app/shared/model/ref-attr-setting-obj.model';

@Component({
  selector: 'app-delivery-order-detail',
  templateUrl: './delivery-order-detail.component.html'
})

export class DeliveryOrderDetailComponent implements OnInit {
  appAssetObj: AppAssetObj;
  deliveryOrderObj: DeliveryOrderObj = new DeliveryOrderObj();
  appCollateralDoc: AppCollateralDocObj;
  listAppCollateralDocObj: ListAppCollateralDocObj;
  agrmntTcObj: AgrmntTcObj;
  listAgrmntTcObj: Array<AgrmntTcObj>;
  itemType: Array<KeyValueObj>;

  AppAssetId: number;
  AppId: number;
  AgrmntId: number;
  MrAssetConditionCode: string;
  AssetStat: string;
  AssetTypeCode: string;
  FullAssetCode: string;
  FullAssetName: string;
  MrAssetUsageCode: string;
  AssetCategoryCode: string;
  TaskListId: any;
  arrValue = [];
  UserAccess: CurrentUserContext;
  MaxDate: Date;
  businessDt: Date = new Date();
  PurchaseOrderDt: Date = new Date();
  listItem: FormArray;
  SerialNoList: Array<AssetTypeSerialNoLabelCustomObj>;
  isDmsReady: boolean;
  dmsObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  dmsAppObj: DMSObj;
  mouCustNo: string;
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();
  InputLookupCityIssuerObj : InputLookupObj = new InputLookupObj();
  IsUseDigitalization: string;
  generalSettingObj: GenericListByCodeObj;
  IntegratorCheckBySystemGsValue: string = "1";
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj(); 
  IsSvcExist: boolean = false;
  IsIntegrator: boolean = false;
  indexChassis: number = 0;
  AppObj: AppObj = new AppObj();
  datePipe = new DatePipe("en-US");
  AppAssetAttrObj: any;
  isAssetAttrReady: boolean = false;
  appAssetAttrObjs: Array<AppAssetAttrCustomObj>;
  ListAttrAnswer = [];
  isDiffWithRefAttr: boolean;
  isUsed : boolean = false;
  CustType: string;
  AppCustObj: any;
  AppCollateralRegistrationObj: AppCollateralRegistrationObj;
  AppCustAddrObj: Array<AppCustAddrObj> = new Array();
  AddrLegalObj: Array<AppCustAddrObj> = new Array();
  isOwnerReady: boolean = false;
  attrSettingObj: RefAttrSettingObj = new RefAttrSettingObj();
  readonly identifierAssetAttr: string = "AppAssetAttrObjs";

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_DO_PAGING;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
      this.TaskListId = params['TaskListId'];
      this.AppAssetId = params['AppAssetId'];
    });
  }

  DeliveryOrderForm = this.fb.group({
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.max(new Date().getFullYear())]],
    TempRegisLettNo: ['', [Validators.required]],
    TempRegisLettDt: ['', [Validators.required]],
    RecipientName: ['', Validators.required],
    DeliveryDt: ['', Validators.required],
    DeliveryAddr: ['', Validators.required],
    MrCustRelationshipCode: ['', Validators.required],
    IsChecked: [''],
    PromisedDt: [''],
    ATExpiredDt: [''],
    Notes: [''],
    AssetNotes: [''],
    Color: [''],
    TaxCityIssuer: [''],
    TaxIssueDt: [''],
    listItem: this.fb.array([]),
    AppAssetAttrObjs: this.fb.array([]),
    DOAssetDocList: this.fb.array([])
  })

  async ngOnInit() : Promise<void> {
    this.claimTask();
    this.arrValue.push(this.AgrmntId);
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;

    var appAssetobj = {
      Id: this.AgrmntId
    }

    this.http.post(URLConstant.GetPurchaseOrderHByAgrmntId, appAssetobj).subscribe(
      (response) => {
        this.PurchaseOrderDt = new Date(response["PurchaseOrderDt"]);
      }
    );
    
    await this.initCityLookupIssuerLookup();
    this.listItem = this.DeliveryOrderForm.get('listItem') as FormArray;

    let reqAppAsset = { AppAssetId: this.AppAssetId, AppId: this.AppId};
    await this.http.post(URLConstant.GetAppAssetForDOMultiAsset, reqAppAsset).toPromise().then(
      async (response) => {
        this.appAssetObj = response["AppAssetObj"];
        this.AppAssetId = this.appAssetObj.AppAssetId;
        this.MrAssetConditionCode = this.appAssetObj.MrAssetConditionCode;
        this.AssetStat = this.appAssetObj.AssetStat;
        this.AssetTypeCode = this.appAssetObj.AssetTypeCode;
        this.FullAssetCode = this.appAssetObj.FullAssetCode;
        this.FullAssetName = this.appAssetObj.FullAssetName;
        this.MrAssetUsageCode = this.appAssetObj.MrAssetUsageCode;
        this.AssetCategoryCode = this.appAssetObj.AssetCategoryCode;
        var appCollateralDocObj = response["AppCollateralDoc"];
        this.InputLookupCityIssuerObj.nameSelect = this.appAssetObj.TaxCityIssuer;
        this.InputLookupCityIssuerObj.jsonSelect = { DistrictName: this.appAssetObj.TaxCityIssuer };

        if(this.MrAssetConditionCode == CommonConstant.AssetConditionUsed) { 
          this.isUsed = true;
          this.InputLookupCityIssuerObj.isRequired = true;
        }

        await this.http.post(URLConstant.GetAppCustByAppId, {Id : this.appAssetObj.AppId}).toPromise().then(
          (response) => {
            this.AppCustObj = response;
            this.CustType = response["MrCustTypeCode"];
            var refMasterTypeObj = {
              RefMasterTypeCode: response["MrCustTypeCode"] == CommonConstant.CustTypePersonal ? CommonConstant.RefMasterTypeCodeCustPersonalRelationship : CommonConstant.RefMasterTypeCodeCustCompanyRelationship,
            }
            this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterTypeObj).subscribe(
              (response) => {
                this.itemType = response[CommonConstant.ReturnObj];
                this.DeliveryOrderForm.patchValue({
                  MrCustRelationshipCode: this.itemType[0].Key
                });
              }
            );
          });

        this.DeliveryOrderForm.patchValue({
          ManufacturingYear: this.appAssetObj.ManufacturingYear,
          Color: this.appAssetObj.Color,
          TempRegisLettNo: this.appAssetObj.TempRegisLettNo,
          TempRegisLettDt: this.appAssetObj.TempRegisLettDt == null? "" : this.datePipe.transform(this.appAssetObj.TempRegisLettDt, "yyyy-MM-dd"),
          AssetNotes: this.appAssetObj.AssetNotes,
          TaxIssueDt: this.appAssetObj.TaxIssueDt == null? "" : this.datePipe.transform(this.appAssetObj.TaxIssueDt, "yyyy-MM-dd"),
          TaxCityIssuer: this.appAssetObj.TaxCityIssuer
        });


        if(!appCollateralDocObj || appCollateralDocObj.length <= 0) {
          this.GenerateDefaultAssetDocs(this.AssetTypeCode);
        }  
        else{
          this.GenerateAppCollateralDocs(appCollateralDocObj);
        }

        await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: this.appAssetObj.AssetTypeCode }).toPromise().then(
          (response: GenericListObj) => {
            while (this.listItem.length) {
              this.listItem.removeAt(0);
            }

            this.SerialNoList = response.ReturnObject;
            for (let i = 0; i < this.SerialNoList.length; i++) {
              let eachDataDetail = this.fb.group({
                SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                SerialNoValue: [''],
                IsMandatory: [this.SerialNoList[i].IsMandatory]
              }) as FormGroup;
              this.listItem.push(eachDataDetail);
            }

            for (let i = 0; i < this.listItem.length; i++) {
              if (this.listItem.controls[i]['controls']['IsMandatory'].value == true) {
                this.listItem.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
                this.listItem.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
              }
            }
            if ( this.appAssetObj  != undefined ||  this.appAssetObj  != null) {
              for (let i = 0; i < this.listItem.length; i++) {
                if (this.listItem.controls[i] != null) {
                  this.listItem.controls[i]['controls']['SerialNoValue'].value =  this.appAssetObj ["SerialNo" + (i + 1)];
                  if (this.listItem.controls[i]["controls"]["SerialNoLabel"].value == "Chassis No"){
                    this.indexChassis = i;
                  }
                }
              }
            }
        });
        await this.GetAppData();
        await this.SetRefAttrSettingObj();
      }
    );
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      }
    );

    await this.InitDms();
    await this.GetGS();
    await this.GetListAddr();
    await this.GetAllAssetData();

    if(this.MrAssetConditionCode == CommonConstant.AssetConditionUsed){
      this.DeliveryOrderForm.controls['TempRegisLettNo'].clearValidators();
      this.DeliveryOrderForm.controls['TempRegisLettDt'].clearValidators();
      this.DeliveryOrderForm.controls['TempRegisLettNo'].updateValueAndValidity();
      this.DeliveryOrderForm.controls['TempRegisLettDt'].updateValueAndValidity();
    }
    this.isOwnerReady = true;
  }

  SetRefAttrSettingObj() {
    let GenObj =
    {
      AppAssetId: this.AppAssetId,
      AssetTypeCode: this.AssetTypeCode,
      IsRefresh: false
    };
    this.attrSettingObj.ReqGetListAttrObj = GenObj;
    this.attrSettingObj.Title = "Asset Attribute";
    this.attrSettingObj.UrlGetListAttr = URLConstant.GenerateAppAssetAttrV2;
    this.isAssetAttrReady = true;
  }

  async InitDms() {
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      this.dmsAppObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;
  
      this.dmsAppObj.User = currentUserContext.UserName;
      this.dmsAppObj.Role = currentUserContext.RoleCode;
      this.dmsAppObj.ViewCode = CommonConstant.DmsViewCodeApp;
  
      var agrObj = { Id: this.AgrmntId };
      var appObj = { Id: this.AppId };
  
      let getAgr = await this.http.post(URLConstant.GetAgrmntByAgrmntId, agrObj)
      let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
      let getApp = await this.http.post(URLConstant.GetAppById, appObj)
      forkJoin([getAgr, getAppCust, getApp]).subscribe(
        (response) => {
          this.agrNo = response[0]['AgrmntNo'];
          this.custNo = response[1]['CustNo'];
          this.appNo = response[2]['AppNo'];
          let mouId = response[2]['MouCustId'];
  
          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
            this.dmsAppObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          }
          else {
            this.dmsAppObj.MetadataParent = null;
          }
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));
  
          this.dmsAppObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
  
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadDownloadView));
          if (mouId != null && mouId != "") {
            this.http.post(URLConstant.GetMouCustById, { Id: mouId }).subscribe(
              (result: MouCustObj) => {
                this.mouCustNo = result.MouCustNo;
                this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
                this.dmsAppObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
                this.isDmsReady = true;
              }
            )
          }
          else {
            this.isDmsReady = true;
          }
        }
      );
    }
  }

  SaveForm() {
    let businessDt = this.UserAccess.BusinessDt;

    this.setAssetDeliveryOrderData();
    this.setAgrmntTcData(businessDt);
        
    let submitDeliveryOrderUrl = environment.isCore? URLConstant.SubmitDeliveryOrderDataV2_1 : URLConstant.SubmitDeliveryOrderData;
    this.http.post(submitDeliveryOrderUrl, this.deliveryOrderObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[this.CancelLink], {});
      }
    );
  }

  claimTask(){
    if(environment.isCore){
        if(this.TaskListId != "" && this.TaskListId!= undefined){
            this.claimTaskService.ClaimTaskV2(this.TaskListId);
          }
      }
      else if (this.TaskListId > 0) {
         this.claimTaskService.ClaimTask(this.TaskListId);
      }
  }

  setAssetDeliveryOrderData(){
    this.deliveryOrderObj.AgrmntId = this.AgrmntId;
    this.deliveryOrderObj.TaskListId = this.TaskListId;

    this.deliveryOrderObj.AppAssetObj = new AppAssetObj();
    this.deliveryOrderObj.AppAssetObj.AppAssetId = this.AppAssetId;
    this.deliveryOrderObj.AppAssetObj.AppId = this.appAssetObj.AppId;
    this.deliveryOrderObj.AppAssetObj.AssetSeqNo = this.appAssetObj.AssetSeqNo;
    this.deliveryOrderObj.AppAssetObj.AssetPriceAmt = this.appAssetObj.AssetPriceAmt;
    this.deliveryOrderObj.AppAssetObj.DownPaymentAmt = this.appAssetObj.DownPaymentAmt;
    this.deliveryOrderObj.AppAssetObj.IsCollateral = this.appAssetObj.IsCollateral;
    this.deliveryOrderObj.AppAssetObj.IsInsurance = this.appAssetObj.IsInsurance;
    this.deliveryOrderObj.AppAssetObj.IsEditableDp = this.appAssetObj.IsEditableDp;
    this.deliveryOrderObj.AppAssetObj.ManufacturingYear = this.DeliveryOrderForm.controls.ManufacturingYear.value;
    this.deliveryOrderObj.AppAssetObj.TempRegisLettNo = this.DeliveryOrderForm.controls.TempRegisLettNo.value;
    this.deliveryOrderObj.AppAssetObj.TempRegisLettDt = this.DeliveryOrderForm.controls.TempRegisLettDt.value;
    this.deliveryOrderObj.AppAssetObj.AgrmntId = this.AgrmntId;
    this.deliveryOrderObj.AppAssetObj.MrAssetConditionCode = this.MrAssetConditionCode;
    this.deliveryOrderObj.AppAssetObj.AssetStat = this.AssetStat;
    this.deliveryOrderObj.AppAssetObj.AssetTypeCode = this.AssetTypeCode;
    this.deliveryOrderObj.AppAssetObj.FullAssetCode = this.FullAssetCode;
    this.deliveryOrderObj.AppAssetObj.FullAssetName = this.FullAssetName;
    this.deliveryOrderObj.AppAssetObj.MrAssetUsageCode = this.MrAssetUsageCode;
    this.deliveryOrderObj.AppAssetObj.AssetCategoryCode = this.AssetCategoryCode;
    this.deliveryOrderObj.AppAssetObj.Color = this.DeliveryOrderForm.controls.Color.value;
    this.deliveryOrderObj.AppAssetObj.TaxCityIssuer = this.DeliveryOrderForm.controls.TaxCityIssuer.value;
    this.deliveryOrderObj.AppAssetObj.TaxIssueDt = this.DeliveryOrderForm.controls.TaxIssueDt.value;
    this.deliveryOrderObj.AppAssetObj.AssetNotes = this.DeliveryOrderForm.controls.AssetNotes.value;
    this.deliveryOrderObj.AppAssetObj.RowVersion = this.appAssetObj.RowVersion;

    for (var i = 0; i < this.listItem.length; i++) {
      if (this.listItem.controls[i] != null) {
        this.deliveryOrderObj.AppAssetObj["SerialNo" + (i + 1)] = this.listItem.controls[i]["controls"]["SerialNoValue"].value;
      }
    }

    this.deliveryOrderObj.DeliveryOrderHObj = new DeliveryOrderHObj();
    this.deliveryOrderObj.DeliveryOrderHObj.RecipientName = this.DeliveryOrderForm.controls.RecipientName.value;
    this.deliveryOrderObj.DeliveryOrderHObj.DeliveryDt = this.DeliveryOrderForm.controls.DeliveryDt.value;
    this.deliveryOrderObj.DeliveryOrderHObj.DeliveryAddr = this.DeliveryOrderForm.controls.DeliveryAddr.value;
    this.deliveryOrderObj.DeliveryOrderHObj.MrCustRelationshipCode = this.DeliveryOrderForm.controls.MrCustRelationshipCode.value;
    this.deliveryOrderObj.DeliveryOrderHObj.AgrmntId = this.AgrmntId;

    this.deliveryOrderObj.AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
    this.deliveryOrderObj.AppCollateralRegistrationObj.AppCollateralId = this.AppCollateralRegistrationObj.AppCollateralId;
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerName = this.DeliveryOrderForm.controls.AssetOwner["controls"].OwnerName.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.MrIdTypeCode = this.DeliveryOrderForm.controls.AssetOwner["controls"].MrIdTypeCode.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.MrOwnerTypeCode = this.DeliveryOrderForm.controls.AssetOwner["controls"].MrOwnerTypeCode.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerIdNo = this.DeliveryOrderForm.controls.AssetOwner["controls"].OwnerIdNo.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerAddr = this.DeliveryOrderForm.controls.ownerData["controls"].Addr.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.DeliveryOrderForm.controls.ownerData["controls"].AreaCode1.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.DeliveryOrderForm.controls.ownerData["controls"].AreaCode2.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.DeliveryOrderForm.controls.ownerData["controls"].AreaCode3.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.DeliveryOrderForm.controls.ownerData["controls"].AreaCode4.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerCity = this.DeliveryOrderForm.controls.ownerData["controls"].City.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerZipcode = this.DeliveryOrderForm.controls.ownerDataZipcode.value['value'];
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.DeliveryOrderForm.controls.AssetOwner["controls"].OwnerMobilePhnNo.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.DeliveryOrderForm.controls.AssetOwner["controls"].MrOwnerRelationshipCode.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.LocationAddr = this.DeliveryOrderForm.controls.locationData["controls"].Addr.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.DeliveryOrderForm.controls.locationData["controls"].AreaCode1.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.DeliveryOrderForm.controls.locationData["controls"].AreaCode2.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.DeliveryOrderForm.controls.locationData["controls"].AreaCode3.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.DeliveryOrderForm.controls.locationData["controls"].AreaCode4.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.LocationCity = this.DeliveryOrderForm.controls.locationData["controls"].City.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.LocationZipcode = this.DeliveryOrderForm.controls.locationDataZipcode.value['value'];
    this.deliveryOrderObj.AppCollateralRegistrationObj.OwnerProfessionCode = this.DeliveryOrderForm.controls.AssetOwner["controls"].OwnerProfessionCode.value;
    this.deliveryOrderObj.AppCollateralRegistrationObj.RowVersion = this.AppCollateralRegistrationObj.RowVersion;

    this.deliveryOrderObj.AppCollateralDocObj = [...this.DeliveryOrderForm.value.DOAssetDocList];

    this.deliveryOrderObj.AppAssetAttrObj = new Array<ReqAppAssetAttrObj>();
    for (let i = 0; i < this.DeliveryOrderForm.controls["AppAssetAttrObjs"].value.length; i++) {
      let appAssetAttrObj = new ReqAppAssetAttrObj();
      let appCollAttrcObj = new ReqAppCollateralAttrObj();
      appAssetAttrObj.AssetAttrName = this.DeliveryOrderForm.controls["AppAssetAttrObjs"].value[i].AttrName;
      appAssetAttrObj.AssetAttrCode = this.DeliveryOrderForm.controls["AppAssetAttrObjs"].value[i].AttrCode;
      appAssetAttrObj.AttrValue = this.DeliveryOrderForm.controls["AppAssetAttrObjs"].value[i].AttrValue;

      appCollAttrcObj.CollateralAttrName = appAssetAttrObj.AssetAttrName;
      appCollAttrcObj.CollateralAttrCode = appAssetAttrObj.AssetAttrCode;
      appCollAttrcObj.AttrValue = appAssetAttrObj.AttrValue;

      this.deliveryOrderObj.AppAssetAttrObj.push(appAssetAttrObj);
      this.deliveryOrderObj.AppCollateralAttrObj.push(appCollAttrcObj);
    }

  }

  setAgrmntTcData(businessDt){
    this.listAgrmntTcObj = new Array<AgrmntTcObj>();

    for (var i = 0; i < this.DeliveryOrderForm.value.TCList["length"]; i++) {
      const tempAgrmntTc = this.DeliveryOrderForm.getRawValue().TCList[i];
      this.agrmntTcObj = new AgrmntTcObj();
      this.agrmntTcObj.AgrmntId = tempAgrmntTc.AgrmntId;
      this.agrmntTcObj.AgrmntTcId = tempAgrmntTc.AgrmntTcId;
      this.agrmntTcObj.TcCode = tempAgrmntTc.TcCode;
      this.agrmntTcObj.TcName = tempAgrmntTc.TcName;
      this.agrmntTcObj.PriorTo = tempAgrmntTc.PriorTo;
      this.agrmntTcObj.IsChecked = tempAgrmntTc.IsChecked;
      this.agrmntTcObj.ExpiredDt = tempAgrmntTc.ExpiredDt;
      this.agrmntTcObj.IsMandatory = tempAgrmntTc.IsMandatory;
      this.agrmntTcObj.PromisedDt = tempAgrmntTc.PromisedDt;
      this.agrmntTcObj.CheckedDt = tempAgrmntTc.CheckedDt;
      this.agrmntTcObj.IsWaived = tempAgrmntTc.IsWaived;
      this.agrmntTcObj.Notes = tempAgrmntTc.Notes;
      this.agrmntTcObj.IsExpDtMandatory = tempAgrmntTc.IsExpDtMandatory;
      this.agrmntTcObj.IsWaivable = tempAgrmntTc.IsWaivable;
      this.agrmntTcObj.IsAdditional = tempAgrmntTc.IsAdditional;

      var prmsDt = new Date(this.agrmntTcObj.PromisedDt);
      var prmsDtForm = tempAgrmntTc.PromisedDt;
      if (this.agrmntTcObj.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + this.agrmntTcObj.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      this.listAgrmntTcObj.push(this.agrmntTcObj);
    }

    this.deliveryOrderObj.ListAgrmntTcObj = this.listAgrmntTcObj;
  }
 
  async GetAppData() {
    await this.http.post<AppObj>(URLConstant.GetAppById, {Id: this.AppId}).toPromise().then(
      (response) => {
        this.AppObj = response;
      }
    );
  }

  async initCityLookupIssuerLookup(){
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
    this.InputLookupCityIssuerObj.isReady = true;
  }

  GenerateDefaultAssetDocs(AssetTypeCode: string)
  {
    var assetDocs = [];
    var assetDocListobj = { Code: AssetTypeCode }
    this.http.post(URLConstant.GetRefAssetDocList, assetDocListobj).subscribe(
      (response) => {
        if (response[CommonConstant.ReturnObj].length > 0)
        {
          response[CommonConstant.ReturnObj].forEach(RefAssetDoc => {
            assetDocs.push({
              AppCollateralDocId: 0,
              AppCollateralId: 0,
              DocCode: RefAssetDoc.AssetDocCode,
              DocNo: null,
              DocName: RefAssetDoc.AssetDocName,
              IsReceived: false,
              ExpiredDt: null,
              DocNotes: RefAssetDoc.DocNotes,
              IsValueNeeded: RefAssetDoc.IsValueNeeded,
              IsMandatoryNew: RefAssetDoc.IsMandatoryNew,
              IsMandatoryUsed: RefAssetDoc.IsMandatoryUsed,
              MrCollateralConditionCode: this.isUsed == true? CommonConstant.AssetConditionUsed : CommonConstant.AssetConditionNew,
            })    
          });
          this.GenerateAppCollateralDocs(assetDocs);
        }
      }
    );
    return assetDocs;
  }

  GenerateAppCollateralDocs(appCollateralDocs)
  {
    var formArray = this.DeliveryOrderForm.get('DOAssetDocList') as FormArray;
    for (let i = 0; i < appCollateralDocs.length; i++) {
      var isMandatory = false;
      if(appCollateralDocs[i].MrCollateralConditionCode == CommonConstant.AssetConditionNew){
        if(appCollateralDocs[i].IsMandatoryNew == true){
          isMandatory = true;
        }
      }
      else{
        if(appCollateralDocs[i].IsMandatoryUsed == true){
          isMandatory = true;
        }
      }
      var formGroup = this.fb.group({
        AppCollateralDocId: [appCollateralDocs[i].AppCollateralDocId],
        AppCollateralId: [appCollateralDocs[i].AppCollateralId],
        DocCode: [appCollateralDocs[i].DocCode],
        DocName: [appCollateralDocs[i].DocName],
        DocNo: [appCollateralDocs[i].DocNo, isMandatory ? [Validators.required] : []],
        IsReceived: [appCollateralDocs[i].IsReceived],
        ExpiredDt: [appCollateralDocs[i].ExpiredDt == null ? "" : this.datePipe.transform(appCollateralDocs[i].ExpiredDt, "yyyy-MM-dd") ],
        DocNotes: [appCollateralDocs[i].DocNotes],
        IsValueNeeded: [appCollateralDocs[i].IsValueNeeded],
        IsMandatoryNew: [appCollateralDocs[i].IsMandatoryNew],
        IsMandatoryUsed: [appCollateralDocs[i].IsMandatoryUsed],
        MrCollateralConditionCode: [appCollateralDocs[i].MrCollateralConditionCode]
      });
      formArray.push(formGroup);
    }
  }

  ChangeIsReceived(idx: number){
    this.DeliveryOrderForm.controls.DOAssetDocList["controls"][idx]["controls"].DocNo.setValue("");
    this.DeliveryOrderForm.controls.DOAssetDocList["controls"][idx]["controls"].ExpiredDt.setValue("");
    this.DeliveryOrderForm.controls.DOAssetDocList["controls"][idx]["controls"].DocNotes.setValue("");
  }

  async GetListAddr() {
    let reqById: GenericObj = new GenericObj();
    reqById.Id = this.AppId;
    await this.http.post(URLConstant.GetListAppCustAddrByAppId, reqById).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AddrLegalObj = this.AppCustAddrObj.filter(
          emp => emp.MrCustAddrTypeCode === CommonConstant.AddrTypeLegal);
      }
    );
  }
  async GetAllAssetData() {
    let reqById: GenericObj = new GenericObj();
    reqById.Id = this.AppId;
    await this.http.post(URLConstant.GetAllAssetDataByAppId, reqById).toPromise().then(
      async (response) => {
        this.AppCollateralRegistrationObj = response["ResponseAppCollateralRegistrationObj"];
        this.AppCollateralRegistrationObj.AppCollateralId = response["ResponseAppCollateralObj"].AppCollateralId;
      }
    )
  }

  //For Fraud Checking
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
  
  async getDigitalizationSvcType(){
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType}).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if(this.sysConfigResultObj.ConfigValue != null){
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");
      var refSvcType = "";
      await this.http.post(URLConstant.GetRuleIntegratorPackageMapAsset, { TrxNo: this.AppObj.BizTemplateCode }).toPromise().then(
        (response) => {
            refSvcType = response["Result"];
        });

      var svcType = listSvcType.find(x => x == refSvcType);

      if(svcType != null){
        this.IsSvcExist = true;
      }
    }
  }

  HitAPI() {
    if (this.listItem.controls[this.indexChassis]['controls']['SerialNoValue'].value == '') {
      this.toastr.warningMessage("Please Input Chassis No !");
    }
    else {
      this.toastr.successMessage("Submit with Integrator");
      this.IsIntegrator = true;
    }
  }

  SetBpkbCity(event) {
    this.DeliveryOrderForm.patchValue({
      TaxCityIssuer: event.DistrictCode,
    });
  }

}
