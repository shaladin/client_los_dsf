import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-view-delivery-order-asset-detail',
  templateUrl: './view-delivery-order-asset-detail.component.html',
  styleUrls: ['./view-delivery-order-asset-detail.component.scss']
})
export class ViewDeliveryOrderAssetDetailComponent implements OnInit {
  GetAllAssetDataByAppAssetId: string;
  AppAssetId: number;
  assetData: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['AppAssetId'] != null) {
        this.AppAssetId = params['AppAssetId'];
      }
    });
  }

  ngOnInit() {
    this.GetAllAssetDataByAppAssetId = AdInsConstant.GetAllAssetDataByAppAssetId;
    var assetObj = { "AppAssetId" : this.AppAssetId};

    this.http.post(this.GetAllAssetDataByAppAssetId, assetObj).subscribe(
      (response) => { 
       this.assetData = response["ReturnObject"];
      });

  //   this.http.post(this.GetDeliveryOrderHByDeliveryOrderHId, doObj).subscribe(
  //     (response) => { 
  //       this.doData = response;
  //     });
  }

}
