import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DeliveryOrderObj } from 'app/shared/model/DeliveryOrderObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { ListAppCollateralDocObj } from 'app/shared/model/ListAppCollateralDocObj.Model';

@Component({
  selector: 'app-delivery-order-detail',
  templateUrl: './delivery-order-detail.component.html',
  styleUrls: ['./delivery-order-detail.component.scss'],
  providers: [NGXToastrService]
})

export class DeliveryOrderDetailComponent implements OnInit {
  result: any;
  resultData: any;
  items: any;
  deliveryOrderObj: any;
  count: any = 0;
  appCollateralDoc: any;
  listAppCollateralDocObj: ListAppCollateralDocObj;
  itemType: any;

  AppAssetId: number;
  AppId: number;
  AgrmntId: number;
  MrAssetConditionCode: string;

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
        this.result = response;
        this.AppAssetId= this.result.AppAssetId;
        this.MrAssetConditionCode = this.result.MrAssetConditionCode;

        this.DeliveryOrderForm.patchValue({
          ManufacturingYear: this.result.ManufacturingYear
        });

        var assetDocListobj = {
          AssetTypeCode: this.result.AssetTypeCode
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
                this.count = this.count + 1;
              }
            }
          }
        );
      }
    );
  }

  SaveForm() {
    this.deliveryOrderObj = new DeliveryOrderObj();

    var appAsset = {
      AppAssetId: this.AppAssetId,
      SerialNo1: this.DeliveryOrderForm.controls.SerialNo1.value,
      SerialNo2: this.DeliveryOrderForm.controls.SerialNo2.value,
      SerialNo3: this.DeliveryOrderForm.controls.SerialNo3.value,
      ManufacturingYear: this.DeliveryOrderForm.controls.ManufacturingYear.value,
      TempRegisLettNo: this.DeliveryOrderForm.controls.TempRegisLettNo.value,
      TempRegisLettDt: this.DeliveryOrderForm.controls.TempRegisLettDt.value,
      AgrmntId: this.AgrmntId,

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

    for (var i = 0; i < this.count; i++) {
      this.appCollateralDoc = new AppCollateralDocObj();
      this.appCollateralDoc.DocCode = this.DeliveryOrderForm.controls["items"]["controls"][i]["controls"]["DocCode"].value;
      this.appCollateralDoc.IsReceived = this.DeliveryOrderForm.controls["items"]["controls"][i]["controls"]["IsReceived"].value;
      this.appCollateralDoc.DocNo = this.DeliveryOrderForm.controls["items"]["controls"][i]["controls"]["DocNo"].value;
      this.appCollateralDoc.ACDExpiredDt = this.DeliveryOrderForm.controls["items"]["controls"][i]["controls"]["ACDExpiredDt"].value;
      this.appCollateralDoc.DocNotes = this.DeliveryOrderForm.controls["items"]["controls"][i]["controls"]["DocNotes"].value;
      this.listAppCollateralDocObj.AppCollateralDocObj.push(this.appCollateralDoc);
    }

    this.deliveryOrderObj.AppAssetObj = appAsset;
    this.deliveryOrderObj.DeliveryOrderHObj = deliveryOrderH;
    this.deliveryOrderObj.ListAppCollateralDocObj = this.listAppCollateralDocObj.AppCollateralDocObj;

    this.http.post(AdInsConstant.SubmitDeliveryOrderData, this.deliveryOrderObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/AdminProcess/DeliveryOrder/Paging"]);
      },
      error => {
        console.log(error);
      }
    );

  }
}
