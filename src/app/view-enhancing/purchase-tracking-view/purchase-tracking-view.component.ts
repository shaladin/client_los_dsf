import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
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
  AssetReqObj: any;

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
      this.http.post(URLConstant.GetAppAssetOplByAppAssetId, { Id: this.AppAssetId }).subscribe(
        (response: any) => {
          this.AppAssetNo = response["AppAssetNo"];
          this.http.post(URLConstant.GetListAssetReqInProgress, { AppAssetNo: this.AppAssetNo }).subscribe(
            (response) => {
              if(response["ListAsset"][0] !== undefined) {
                this.AssetReqObj = response["ListAsset"][0];
                console.log("Isi Obj: ", this.AssetReqObj);
                this.isReady = true;
              }
              else {
                this.isReady = true;
              }
            },
            (error) => {
              console.log(error);
            }
          );
        },
        (error) => {
          console.log(error);
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

  // OpenView(key: string) {
  //   if (key == 'AGR') {
  //     AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
  //   }
  // }
}