import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DeliveryOrderObj } from 'app/shared/model/DeliveryOrderObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { ListAppCollateralDocObj } from 'app/shared/model/ListAppCollateralDocObj.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-delivery-order-detail',
  templateUrl: './delivery-order-detail.component.html'
})

export class DeliveryOrderDetailComponent implements OnInit {
  appAssetObj: any;
  items: any;
  deliveryOrderObj: any = new DeliveryOrderObj();
  appCollateralDoc: any;
  listAppCollateralDocObj: ListAppCollateralDocObj;
  appTC: any;
  listAppTCObj: ListAppTCObj;
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
  UserAccess: any;
  MaxDate: Date;
  businessDt: Date = new Date();
  PurchaseOrderDt: Date = new Date();
  listItem: FormArray;
  SerialNoList: any;
  isDmsReady: boolean;
  dmsObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  dmsAppObj: DMSObj;
  mouCustNo: string;

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_DO_PAGING;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService, private cookieService: CookieService) {
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

  async ngOnInit() {
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

    var refMasterTypeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustRelationship,
    }
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterTypeObj).subscribe(
      (response) => {
        this.itemType = response[CommonConstant.ReturnObj];
        this.DeliveryOrderForm.patchValue({
          MrCustRelationshipCode: this.itemType[0].Key
        });
      }
    );

    this.items = this.DeliveryOrderForm.get('items') as FormArray;
    this.listItem = this.DeliveryOrderForm.get('listItem') as FormArray;

    this.http.post(URLConstant.GetAppAssetByAgrmntId, appAssetobj).subscribe(
      (response) => {
        this.appAssetObj = response;
        this.AppAssetId = this.appAssetObj.AppAssetId;
        this.MrAssetConditionCode = this.appAssetObj.MrAssetConditionCode;
        this.AssetStat = this.appAssetObj.AssetStat;
        this.AssetTypeCode = this.appAssetObj.AssetTypeCode;
        this.FullAssetCode = this.appAssetObj.FullAssetCode;
        this.FullAssetName = this.appAssetObj.FullAssetName;
        this.MrAssetUsageCode = this.appAssetObj.MrAssetUsageCode;
        this.AssetCategoryCode = this.appAssetObj.AssetCategoryCode;

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
          AssetTypeCode: this.appAssetObj.AssetTypeCode
        }).subscribe(
          (response: any) => {
            while (this.listItem.length) {
              this.listItem.removeAt(0);
            }

            this.SerialNoList = response[CommonConstant.ReturnObj];
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
          });
      }
    );
    await this.InitDms();
  }

  async InitDms() {
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
    var appObj = { AppId: this.AppId };
    var appObj1 = { Id: this.AppId };

    let getAgr = await this.http.post(URLConstant.GetAgrmntByAgrmntId, agrObj)
    let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
    let getApp = await this.http.post(URLConstant.GetAppById, appObj1)
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
          let mouObj = { MouCustId: mouId };
          this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
            result => {
              this.mouCustNo = result['MouCustNo'];
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

  SaveForm() {
    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    // if (Date.parse(this.DeliveryOrderForm.value.TCList[0].PromisedDt) < this.businessDt.getTime()) {
    //   this.toastr.errorMessage("Promised Date Must Bigger Than Business Date")
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

    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    for (var i = 0; i < this.DeliveryOrderForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.DeliveryOrderForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.DeliveryOrderForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.DeliveryOrderForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.DeliveryOrderForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.DeliveryOrderForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.DeliveryOrderForm.getRawValue().TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.DeliveryOrderForm.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.DeliveryOrderForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.DeliveryOrderForm.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.DeliveryOrderForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.DeliveryOrderForm.value.TCList[i].Notes;
      this.appTC.IsAdditional = this.DeliveryOrderForm.value.TCList[i].IsAdditional;

      var prmsDt = new Date(this.appTC.PromisedDt);
      var prmsDtForm = this.DeliveryOrderForm.value.TCList[i].PromisedDt;
      if (this.appTC.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + this.appTC.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    this.deliveryOrderObj.TaskListId = this.TaskListId;
    this.deliveryOrderObj.AppAssetObj = appAsset;
    this.deliveryOrderObj.DeliveryOrderHObj = deliveryOrderH;
    this.deliveryOrderObj.ListAppCollateralDocObj = this.listAppCollateralDocObj.AppCollateralDocObj;
    this.deliveryOrderObj.ListAppTCObj = this.listAppTCObj.AppTCObj;

    this.http.post(URLConstant.SubmitDeliveryOrderData, this.deliveryOrderObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[this.CancelLink], {});
      }
    );
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.TaskListId;
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
}
