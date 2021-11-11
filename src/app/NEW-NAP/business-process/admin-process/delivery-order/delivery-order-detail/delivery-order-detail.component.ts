import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DeliveryOrderObj } from 'app/shared/model/delivery-order-obj.model';
import { AppCollateralDocObj } from 'app/shared/model/app-collateral-doc-obj.model';
import { ListAppCollateralDocObj } from 'app/shared/model/list-app-collateral-doc-obj.model';
import { ListAppTCObj } from 'app/shared/model/list-app-tc-obj.model';
import { AppTCObj } from 'app/shared/model/app-tc-obj.model';
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

@Component({
  selector: 'app-delivery-order-detail',
  templateUrl: './delivery-order-detail.component.html'
})

export class DeliveryOrderDetailComponent implements OnInit {
  appAssetObj: AppAssetObj;
  items: FormArray;
  deliveryOrderObj: any = new DeliveryOrderObj();
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

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_DO_PAGING;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
      this.TaskListId = params['TaskListId'];
    });
  }

  DeliveryOrderForm = this.fb.group({
    ManufacturingYear: ['', Validators.required],
    TempRegisLettNo: [''],
    TempRegisLettDt: [''],
    items: this.fb.array([]),
    DeliveryNo: [''],
    RecipientName: [''],
    DeliveryDt: ['', Validators.required],
    DeliveryAddr: [''],
    MrCustRelationshipCode: [''],
    IsChecked: [''],
    PromisedDt: [''],
    ATExpiredDt: [''],
    Notes: [''],
    listItem: this.fb.array([])
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

    this.items = this.DeliveryOrderForm.get('items') as FormArray;
    this.listItem = this.DeliveryOrderForm.get('listItem') as FormArray;

    this.http.post(URLConstant.GetAppAssetByAgrmntId, appAssetobj).subscribe(
      (response: AppAssetObj) => {
        this.appAssetObj = response;
        this.AppAssetId = this.appAssetObj.AppAssetId;
        this.MrAssetConditionCode = this.appAssetObj.MrAssetConditionCode;
        this.AssetStat = this.appAssetObj.AssetStat;
        this.AssetTypeCode = this.appAssetObj.AssetTypeCode;
        this.FullAssetCode = this.appAssetObj.FullAssetCode;
        this.FullAssetName = this.appAssetObj.FullAssetName;
        this.MrAssetUsageCode = this.appAssetObj.MrAssetUsageCode;
        this.AssetCategoryCode = this.appAssetObj.AssetCategoryCode;

        this.http.post(URLConstant.GetAppCustByAppId, {Id : this.appAssetObj.AppId}).subscribe(
          (response) => {
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
          ManufacturingYear: this.appAssetObj.ManufacturingYear
        });

        var assetDocListobj = {
          AssetTypeCode: this.appAssetObj.AssetTypeCode
        }
        this.http.post(URLConstant.GetRefAssetDocList, assetDocListobj).subscribe(
          (response) => {
            if (response[CommonConstant.ReturnObj].length > 0) {
              for (var i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
                var assetDocumentDetail = this.fb.group({
                  DocCode: response[CommonConstant.ReturnObj][i].AssetDocCode,
                  AssetDocName: response[CommonConstant.ReturnObj][i].AssetDocName,
                  IsValueNeeded: response[CommonConstant.ReturnObj][i].IsValueNeeded,
                  IsMandatoryNew: response[CommonConstant.ReturnObj][i].IsMandatoryNew,
                  IsMandatoryUsed: response[CommonConstant.ReturnObj][i].IsMandatoryUsed,
                  IsReceived: response[CommonConstant.ReturnObj][i].IsReceived,
                  DocNo: response[CommonConstant.ReturnObj][i].DocNo,
                  ACDExpiredDt: response[CommonConstant.ReturnObj][i].ACDExpiredDt,
                  DocNotes: response[CommonConstant.ReturnObj][i].DocNotes
                }) as FormGroup;
                if (response[CommonConstant.ReturnObj][i].IsMandatoryNew == true) {
                  assetDocumentDetail.controls.DocNo.setValidators([Validators.required]);
                }
                this.items.push(assetDocumentDetail);
              }
            }
          }
        );

        this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
          Code: this.appAssetObj.AssetTypeCode
        }).subscribe(
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
                }
              }
            }
          });
      }
    );
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });

    await this.InitDms();
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
  
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
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
    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    // if (Date.parse(this.DeliveryOrderForm.value.TCList[0].PromisedDt) < this.businessDt.getTime()) {
    //   this.toastr.warningMessage("Promised Date Must Bigger Than Business Date")
    //   return;
    // }
    var appAsset = {
      AppAssetId: this.AppAssetId,
      AppId: this.appAssetObj.AppId,
      AssetSeqNo: this.appAssetObj.AssetSeqNo,
      AssetPriceAmt: this.appAssetObj.AssetPriceAmt,
      DownPaymentAmt: this.appAssetObj.DownPaymentAmt,
      IsCollateral: this.appAssetObj.IsCollateral,
      IsInsurance: this.appAssetObj.IsInsurance,
      IsEditableDp: this.appAssetObj.IsEditableDp,
      ManufacturingYear: this.DeliveryOrderForm.controls.ManufacturingYear.value,
      TempRegisLettNo: this.DeliveryOrderForm.controls.TempRegisLettNo.value,
      TempRegisLettDt: this.DeliveryOrderForm.controls.TempRegisLettDt.value,
      AgrmntId: this.AgrmntId,
      MrAssetConditionCode: this.MrAssetConditionCode,
      AssetStat: this.AssetStat,
      AssetTypeCode: this.AssetTypeCode,
      FullAssetCode: this.FullAssetCode,
      FullAssetName: this.FullAssetName,
      MrAssetUsageCode: this.MrAssetUsageCode,
      AssetCategoryCode: this.AssetCategoryCode
    }

    for (var i = 0; i < this.listItem.length; i++) {
      if (this.listItem.controls[i] != null) {
        appAsset["SerialNo" + (i + 1)] = this.listItem.controls[i]["controls"]["SerialNoValue"].value;
      }
    }

    var deliveryOrderH = {
      DeliveryNo: this.DeliveryOrderForm.controls.DeliveryNo.value,
      RecipientName: this.DeliveryOrderForm.controls.RecipientName.value,
      DeliveryDt: this.DeliveryOrderForm.controls.DeliveryDt.value,
      DeliveryAddr: this.DeliveryOrderForm.controls.DeliveryAddr.value,
      MrCustRelationshipCode: this.DeliveryOrderForm.controls.MrCustRelationshipCode.value,
      AgrmntId: this.AgrmntId
    }

    this.listAppCollateralDocObj = new ListAppCollateralDocObj();
    this.listAppCollateralDocObj.AppCollateralDocObj = new Array();

    for (var i = 0; i < this.DeliveryOrderForm.value.items["length"]; i++) {
      this.appCollateralDoc = new AppCollateralDocObj();
      this.appCollateralDoc.DocCode = this.DeliveryOrderForm.value.items[i].DocCode;
      this.appCollateralDoc.IsReceived = this.DeliveryOrderForm.value.items[i].IsReceived == null ? false : this.DeliveryOrderForm.value.items[i].IsReceived;
      this.appCollateralDoc.DocNo = this.DeliveryOrderForm.value.items[i].DocNo;
      this.appCollateralDoc.ExpiredDt = this.DeliveryOrderForm.value.items[i].ExpiredDt;
      this.appCollateralDoc.DocNotes = this.DeliveryOrderForm.value.items[i].DocNotes;
      this.listAppCollateralDocObj.AppCollateralDocObj.push(this.appCollateralDoc);
    }

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

    this.deliveryOrderObj.AgrmntId = this.AgrmntId;
    this.deliveryOrderObj.TaskListId = this.TaskListId;
    this.deliveryOrderObj.AppAssetObj = appAsset;
    this.deliveryOrderObj.DeliveryOrderHObj = deliveryOrderH;
    this.deliveryOrderObj.ListAppCollateralDocObj = this.listAppCollateralDocObj.AppCollateralDocObj;
    this.deliveryOrderObj.ListAgrmntTcObj = this.listAgrmntTcObj;

    let submitDeliveryOrderUrl = environment.isCore? URLConstant.SubmitDeliveryOrderDataV2 : URLConstant.SubmitDeliveryOrderData;
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
}
