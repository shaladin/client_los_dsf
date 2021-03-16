import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { DoAssetDetailComponent } from '../do-asset-detail/do-asset-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-create-do-multi-asset',
  templateUrl: './create-do-multi-asset.component.html',
  styles: [],
  providers: [NGXToastrService]
})
export class CreateDoMultiAssetComponent implements OnInit {
  @Input() SelectedDOAssetList: any;
  @Input() LicensePlateAttr: string;
  @Input() CustType: string;
  @Input() AppId: number;
  @Input() AgrmntId: number;
  @Input() Mode: string;
  @Input() DeliveryOrderHId: number;
  relationshipList: any;
  context: any;
  PODt: Date;

  DeliveryOrderForm = this.fb.group({
    DeliveryOrderHId: [0, [Validators.required]],
    AppId: [0, [Validators.required]],
    AgrmntId: [0, [Validators.required]],
    DeliveryNo: [''],
    DeliveryDt: ['', [Validators.required]],
    DeliveryAddr: ['', [Validators.required]],
    RecipientName: ['', [Validators.required]],
    MrCustRelationshipCode: ['', [Validators.required]],
    RowVersion: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalServiceAsset: NgbModal,
    private spinner: NgxSpinnerService, private cookieService: CookieService) { }

  ngOnInit() {
    var datePipe = new DatePipe("en-US");

    this.httpClient.post(URLConstant.GetPurchaseOrderHByAgrmntId, { Id: this.AgrmntId }).subscribe(
      (response) => {
        this.PODt = new Date(response["PurchaseOrderDt"]);
      });

    this.context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var rmRelation = new RefMasterObj();
    rmRelation.RefMasterTypeCode = this.CustType == CommonConstant.CustTypePersonal ? CommonConstant.RefMasterTypeCodeCustPersonalRelationship : CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
    if (this.Mode == "add") {
      this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmRelation).subscribe(
        (response) => {
          this.relationshipList = response;
          this.DeliveryOrderForm.patchValue({
            MrCustRelationshipCode: this.relationshipList.ReturnObject[0].Key
          });
        });
    }
    else if (this.Mode == "edit") {
      var reqDeliveryOrderH = { DeliveryOrderHId: this.DeliveryOrderHId };
      this.httpClient.post(URLConstant.GetDeliveryOrderHByDeliveryOrderHId, reqDeliveryOrderH).pipe(
        map((response) => {
          return response;
        }),
        mergeMap((response) => {
          let getRelation = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmRelation);
          var tempResponse = [response];
          return forkJoin([tempResponse, getRelation]);
        })
      ).subscribe(
        (response) => {
          var deliveryOrderHData = response[0];
          var relationResponse = response[1];
          this.relationshipList = relationResponse;
          deliveryOrderHData["DeliveryDt"] = datePipe.transform(deliveryOrderHData["DeliveryDt"], "yyyy-MM-dd");
          this.DeliveryOrderForm.patchValue({
            ...deliveryOrderHData
          });
        });
    }
    this.DeliveryOrderForm.patchValue({
      AppId: this.AppId,
      AgrmntId: this.AgrmntId
    });
  }

  AssetTempLetterHandler(appAssetId) {
    const modalDOAppAsset = this.modalServiceAsset.open(DoAssetDetailComponent);
    modalDOAppAsset.componentInstance.AppAssetId = appAssetId;
    modalDOAppAsset.componentInstance.AppId = this.AppId;
    modalDOAppAsset.result.then(
      (response) => {
        this.spinner.show();
        var doRequest = { AppId: this.AppId, AgrmntId: this.AgrmntId };
        this.httpClient.post(URLConstant.GetAssetListForDOMultiAsset, doRequest).subscribe(
          (response) => {
            var doAssetList = response["AssetListForDOMultiAssetObj"];
            for (let selected of this.SelectedDOAssetList) {
              for (let item of doAssetList) {
                if (selected.AppAssetId == item.AppAssetId) {
                  selected.AssetSeqNo = item.AssetSeqNo;
                  selected.FullAssetName = item.FullAssetName;
                  selected.AssetPriceAmt = item.AssetPriceAmt;
                  selected.DownPaymentAmt = item.DownPaymentAmt;
                  selected.SerialNo1 = item.SerialNo1;
                  selected.SerialNo2 = item.SerialNo2;
                  selected.SerialNo3 = item.SerialNo3;
                  selected.SerialNo4 = item.SerialNo4;
                  selected.SerialNo5 = item.SerialNo5;
                  selected.OwnerName = item.OwnerName;
                  selected.DeliveryNo = item.DeliveryNo;
                  selected.DeliveryDt = item.DeliveryDt;
                  selected.IsAvailable = item.IsAvailable;
                  selected.ManufacturingYear = item.ManufacturingYear;
                  selected.TempLetterNo = item.TempLetterNo;
                  break;
                }
              }
            }
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["Message"]);
      }
    ).catch(() => {
    });
  }

  Save() {
    var formData = this.DeliveryOrderForm.value;
    var DeliveryOrderH = { ...formData };
    var DeliveryOrderDs = [];
    var url = "";
    for (const item of this.SelectedDOAssetList) {
      var doDetailObj = {
        DeliveryOrderDId: 0,
        DeliveryOrderHId: 0,
        SeqNo: item.AssetSeqNo,
        AppAssetId: item.AppAssetId
      }
      DeliveryOrderDs.push(doDetailObj);
    }
    var DOData = { DeliveryOrderH, DeliveryOrderDs };

    if (this.Mode == "add") {
      url = URLConstant.AddDeliveryOrderMultiAsset;
    }
    else if (this.Mode == "edit") {
      url = URLConstant.EditDeliveryOrderMultiAsset;
    }
    this.httpClient.post(url, DOData).subscribe(
      (response) => {
        this.activeModal.close(response);
      });
  }

}
