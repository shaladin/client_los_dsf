import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit {

  arrValue = [];
  AgrmntId: number;
  AppId: number;
  AppAssetId: number;
  SupplCode: string;
  AssetObj: Object;
  MouNo: string = "";
  Notes: string = "";
  ProportionalValue: number;
  TotalPurchaseOrderAmt: number;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AppAssetId"] != null) {
        this.AppAssetId = params["AppAssetId"];
      }
      if (params["SupplCode"] != null) {
        this.SupplCode = params["SupplCode"];
      }
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    var appAssetObj = {
      AppId: this.AppId,
      AgrmntId: this.AgrmntId,
      SupplCode: this.SupplCode
    }
    this.http.post(AdInsConstant.GetAllAssetDataForPOByAsset, appAssetObj).subscribe(
      (response) => {
        this.AssetObj = response["ReturnObject"];
        this.ProportionalValue = this.AssetObj["ProportionalValue"];

        this.TotalPurchaseOrderAmt = this.AssetObj["AgrmntFinDataObj"].TotalAssetPriceAmt +
          this.AssetObj["AgrmntFinDataObj"].TotalDownPaymentNettAmt +
          (this.AssetObj["AgrmntFinDataObj"].TdpPaidCoyAmt * this.ProportionalValue) +
          (this.AssetObj["AgrmntFinDataObj"].InstAmt * this.ProportionalValue) +
          (this.AssetObj["AgrmntFinDataObj"].TotalInsCustAmt * this.ProportionalValue) +
          (this.AssetObj["AgrmntFinDataObj"].TotalLifeInsCustAmt * this.ProportionalValue);

        if (this.AssetObj["AgrmntFeeListObj"].length != 0) {
          for (let i = 0; i < this.AssetObj["AgrmntFeeListObj"].length; i++) {
            this.TotalPurchaseOrderAmt = this.TotalPurchaseOrderAmt + (this.AssetObj["AgrmntFeeListObj"][i].AppFeeAmt);
          }
        }
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}