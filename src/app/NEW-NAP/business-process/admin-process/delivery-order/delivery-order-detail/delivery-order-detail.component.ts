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

@Component({
  selector: 'app-delivery-order-detail',
  templateUrl: './delivery-order-detail.component.html',
  styleUrls: ['./delivery-order-detail.component.scss']
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

  arrValue = [];

  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
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
    DeliveryDt: [''],
    DeliveryAddr: [''],
    MrCustRelationshipCode: [''],
    IsChecked: [''],
    PromisedDt: [''],
    ATExpiredDt: [''],
    Notes: [''],
  })

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);

    var refMasterTypeObj = {
      RefMasterTypeCode: "CUST_RELATIONSHIP",
    }
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterTypeObj).subscribe(
      (response) => {
        this.itemType = response["ReturnObject"];
        this.DeliveryOrderForm.patchValue({
          MrCustRelationshipCode: this.itemType[0].Key
        });
      }
    );

    var appAssetobj = {
      AgrmntId: this.AgrmntId
    }
    this.items = this.DeliveryOrderForm.get('items') as FormArray;

    this.http.post(AdInsConstant.GetAppAssetByAgrmntId, appAssetobj).subscribe(
      (response) => {
        console.log(response);
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
        this.http.post(AdInsConstant.GetRefAssetDocList, assetDocListobj).subscribe(
          (response) => {
            if (response["ReturnObject"].length > 0) {
              for (var i = 0; i < response["ReturnObject"].length; i++) {
                var assetDocumentDetail = this.fb.group({
                  DocCode: response["ReturnObject"][i].AssetDocCode,
                  AssetDocName: response["ReturnObject"][i].AssetDocName,
                  IsValueNeeded: response["ReturnObject"][i].IsValueNeeded,
                  IsMandatoryNew: response["ReturnObject"][i].IsMandatoryNew,
                  IsMandatoryUsed: response["ReturnObject"][i].IsMandatoryUsed,
                  IsReceived: response["ReturnObject"][i].IsReceived,
                  DocNo: response["ReturnObject"][i].DocNo,
                  ACDExpiredDt: response["ReturnObject"][i].ACDExpiredDt,
                  DocNotes: response["ReturnObject"][i].DocNotes
                }) as FormGroup;
                this.items.push(assetDocumentDetail);
              }
            }
          }
        );
      }
    );
  }

  SaveForm() {
    var appAsset = {
      AppAssetId: this.AppAssetId,
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
      this.appCollateralDoc.IsReceived = this.DeliveryOrderForm.value.items[i].IsReceived;
      this.appCollateralDoc.DocNo = this.DeliveryOrderForm.value.items[i].DocNo;
      this.appCollateralDoc.ACDExpiredDt = this.DeliveryOrderForm.value.items[i].ACDExpiredDt;
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
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    this.deliveryOrderObj.AppAssetObj = appAsset;
    this.deliveryOrderObj.DeliveryOrderHObj = deliveryOrderH;
    this.deliveryOrderObj.ListAppCollateralDocObj = this.listAppCollateralDocObj.AppCollateralDocObj;
    this.deliveryOrderObj.ListAppTCObj = this.listAppTCObj.AppTCObj;

    this.http.post(AdInsConstant.SubmitDeliveryOrderData, this.deliveryOrderObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Nap/AdminProcess/DeliveryOrder/Paging"]);
      },
      error => {
        console.log(error);
      }
    );
  }
}
