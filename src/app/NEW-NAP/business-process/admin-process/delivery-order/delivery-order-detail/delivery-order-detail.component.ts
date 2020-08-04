import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DeliveryOrderObj } from 'app/shared/model/DeliveryOrderObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { ListAppCollateralDocObj } from 'app/shared/model/ListAppCollateralDocObj.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

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

  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
      this.TaskListId = params['TaskListId'];
    });
  }

  DeliveryOrderForm = this.fb.group({
    SerialNo1: ['', Validators.required],
    SerialNo2: ['', Validators.required],
    SerialNo3: ['', Validators.required],
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
  })

  ngOnInit() {
    this.claimTask();
    this.arrValue.push(this.AgrmntId);
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;

    var appAssetobj = {
      AgrmntId: this.AgrmntId
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
                if (response[CommonConstant.ReturnObj][i].IsValueNeeded == true) {
                  assetDocumentDetail.controls.DocNo.setValidators([Validators.required]);
                }
                this.items.push(assetDocumentDetail);
              }


            }
          }
        );
      }
    );
  }
  SaveForm() {
    var businessDt = new Date(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));
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
      SerialNo1: this.DeliveryOrderForm.controls.SerialNo1.value,
      SerialNo2: this.DeliveryOrderForm.controls.SerialNo2.value,
      SerialNo3: this.DeliveryOrderForm.controls.SerialNo3.value,
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
      this.appTC.IsChecked = this.DeliveryOrderForm.value.TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.DeliveryOrderForm.value.TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.DeliveryOrderForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.DeliveryOrderForm.value.TCList[i].PromisedDt;
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
        this.router.navigate(["/Nap/AdminProcess/DeliveryOrder/Paging"]);
      }
    );
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.TaskListId;
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
}
