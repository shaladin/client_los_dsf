import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CookieService } from 'ngx-cookie';
import { DoAssetDetailXComponent } from '../do-asset-detail-x/do-asset-detail-x.component';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';

@Component({
  selector: 'app-create-do-multi-asset-x',
  templateUrl: './create-do-multi-asset-x.component.html',
  styles: [],
  providers: [NGXToastrService]
})
export class CreateDoMultiAssetXComponent implements OnInit {
  @Input() SelectedDOAssetList: any;
  @Input() LicensePlateAttr: string;
  @Input() CustType: string;
  @Input() AppId: number;
  @Input() AgrmntId: number;
  @Input() Mode: string;
  @Input() DeliveryOrderHId: number;
  relationshipList: Array<KeyValueObj>;
  PODt: Date;

  readonly ModeAdd: string = CommonConstant.ADD;
  readonly ModeEdit: string = CommonConstant.EDIT;
  maxDt: any;
  isNeedMaxDt: boolean = false;
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

  async ngOnInit() {
    var datePipe = new DatePipe("en-US");
    this.maxDt = new Date(9999,11,31);
    
    await this.httpClient.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstantX.GsCodeIsDoDtValidation }).toPromise().then(
      (response) => {
        if (response['GsValue'] == "1") {
          this.maxDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
        }
      }
    );
    console.log(this.maxDt);
    this.httpClient.post(URLConstant.GetPurchaseOrderHByAgrmntId, { Id: this.AgrmntId }).subscribe(
      (response) => {
        this.PODt = new Date(response["PurchaseOrderDt"]);
      });

    var rmRelation = new RefMasterObj();
    rmRelation.RefMasterTypeCode = this.CustType == CommonConstant.CustTypePersonal ? CommonConstant.RefMasterTypeCodeCustPersonalRelationship : CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
    if (this.Mode == this.ModeAdd) {
      this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmRelation).subscribe(
        (response: GenericListObj) => {
          this.relationshipList = response.ReturnObject;
          this.DeliveryOrderForm.patchValue({
            MrCustRelationshipCode: this.relationshipList[0].Key
          });
        });
    }
    else if (this.Mode == this.ModeEdit) {
      var reqDeliveryOrderH = { Id: this.DeliveryOrderHId };
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
          this.relationshipList = relationResponse[CommonConstant.ReturnObj];
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
    const modalDOAppAsset = this.modalServiceAsset.open(DoAssetDetailXComponent);
    modalDOAppAsset.componentInstance.AppAssetId = appAssetId;
    modalDOAppAsset.componentInstance.AppId = this.AppId;
    modalDOAppAsset.result.then(
      (response) => {
        this.spinner.show();
        var doRequest = { Id: this.AgrmntId };
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

  // X DSF Non JIRA, Udin : Penambahan async
  async Save() {
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

    // START X DSF Non JIRA, Udin : Fix issue Create DO dengan serial no yang tidak lengkap
    var isValid : boolean = false;
    await this.httpClient.post(URLConstantX.ValidateDeliveryOrderMultiAsset, DOData).toPromise().then(
      (response) => {
        isValid = response && response['StatusCode'] == 200;
      }
    );
    if(!isValid) return;
    // END X DSF Non JIRA

    if (this.Mode == this.ModeAdd) {
      url = URLConstant.AddDeliveryOrderMultiAsset;
    }
    else if (this.Mode == this.ModeEdit) {
      url = URLConstant.EditDeliveryOrderMultiAsset;
    }
    this.httpClient.post(url, DOData).subscribe(
      (response) => {
        this.activeModal.close(response);
      });
  }

}
