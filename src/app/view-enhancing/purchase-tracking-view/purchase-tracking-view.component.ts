import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-purchase-tracking-view',
  templateUrl: './purchase-tracking-view.component.html',
  styleUrls: []
})
export class PurchaseTrackingViewComponent implements OnInit {
  AppId: number;
  AppAssetId: any;
  isReady: boolean = false;
  viewPurchaseTrackingMainInfoObj: UcViewGenericObj = new UcViewGenericObj();
  AppAssetNo: string;
  AvaliableStat: string;
  Accessory: string;
  AssetReqObj: any;
  ReqDecObj: any;
  AgrmntObj: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AppAssetId"] != null) {
        this.AppAssetId = params["AppAssetId"];
      }
    });
  }

  ngOnInit() {
    this.viewPurchaseTrackingMainInfoObj.viewInput = "./assets/ucviewgeneric/viewPurchaseTrackingMainInfo.json";
    this.viewPurchaseTrackingMainInfoObj.viewEnvironment = environment.losUrl;

    if(this.AppAssetId !== "null") {
      var requestAppAssetId = { Id: this.AppAssetId };
      var requestAppId = { Id: this.AppId };
      this.http.post(URLConstant.GetAppAssetOplByAppAssetId, requestAppAssetId).subscribe(
        (response: any) => {
          this.AppAssetNo = response["AppAssetNo"];
          this.http.post(URLConstant.GetListAssetReqInProgress, { AppAssetNo: this.AppAssetNo }).subscribe(
            (response) => {
              if(response["ListAsset"][0] !== undefined) {
                this.AssetReqObj = response["ListAsset"][0];

                if(this.AssetReqObj["IsFinal"]) {
                  this.AvaliableStat = "Yes";
                }
                else {
                  this.AvaliableStat = "No";
                }

                this.http.post(URLConstant.GetListAppAssetAccessoryByAppAssetId, requestAppAssetId).subscribe(
                  (response) => {
                    if(response[CommonConstant.ReturnObj].length > 0) {
                      this.Accessory = "Yes";
                    }
                    else {
                      this.Accessory = "No";
                    }
                  }
                );

                this.http.post(URLConstant.GetRequisitionDecisionHByAppId, requestAppId).subscribe(
                  (response) => {
                    this.ReqDecObj = response;
                  }
                );

                this.http.post(URLConstant.GetAgrmntByAppId, requestAppId).subscribe(
                  (response) => {
                    this.AgrmntObj = response;
                  }
                );

                this.isReady = true;
              }
              else {
                this.isReady = true;
              }
            }
          );
        }
      );
    }
    else {
      this.isReady = true;
    }
  }

  getEvent(event: any) {
    if(event.Key == "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if(event.Key == "Agreement") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.ViewObj.AgrmntId);
    }
    else if(event.Key == "AppAsset") {
      window.open(environment.losR3Web + "/View/AppAsset?AppId=" + event.ViewObj.AppId + "&AppAssetId=" + event.ViewObj.AppAssetId, "_blank");
    }
  }

  OpenView(key: string) {
    if (key == 'AGR') {
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntObj.AgrmntId);
    }
  }
}