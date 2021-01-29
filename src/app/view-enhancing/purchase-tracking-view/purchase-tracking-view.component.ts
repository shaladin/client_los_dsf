import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-purchase-tracking-view',
  templateUrl: './purchase-tracking-view.component.html',
  styleUrls: []
})
export class PurchaseTrackingViewComponent implements OnInit {
  AppId: number;
  isReady: boolean = false;
  viewPurchaseTrackingMainInfoObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
    });
  }

  ngOnInit() {
    this.viewPurchaseTrackingMainInfoObj.viewInput = "./assets/ucviewgeneric/viewPurchaseTrackingMainInfo.json";
    this.viewPurchaseTrackingMainInfoObj.viewEnvironment = environment.losUrl;

    this.isReady = true;
  }

  getEvent(event) {
    if(event.Key == "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if(event.Key == "Agreement") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.ViewObj.AgrmntId);
    }
    else if(event.Key == "AppAsset") {
      
    }
  }
}