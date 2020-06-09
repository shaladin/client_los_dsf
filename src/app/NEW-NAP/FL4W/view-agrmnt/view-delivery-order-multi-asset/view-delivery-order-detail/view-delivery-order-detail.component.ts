import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DeliveryOrderHObj } from 'app/shared/model/DeliveryOrderHObj.Model';

@Component({
  selector: 'app-view-delivery-order-detail',
  templateUrl: './view-delivery-order-detail.component.html',
  styleUrls: ['./view-delivery-order-detail.component.scss']
})
export class ViewDeliveryOrderDetailComponent implements OnInit {
  GetListAppAssetByDOHId: string;
  DOHId: number;
  assetDetailList: Array<any>;
  GetDeliveryOrderHByDeliveryOrderHId: string;
  doData: Object;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['DOHId'] != null) {
        this.DOHId = params['DOHId'];
      }
    });
  }

  ngOnInit() {
    console.log('viewmultidetail')
    this.GetListAppAssetByDOHId = AdInsConstant.GetListAppAssetByDOHId;
    this.GetDeliveryOrderHByDeliveryOrderHId = AdInsConstant.GetDeliveryOrderHByDeliveryOrderHId;
    var doObj = new DeliveryOrderHObj();
    doObj.DeliveryOrderHId = this.DOHId;
    this.http.post(this.GetListAppAssetByDOHId, doObj).subscribe(
      (response) => { 
       this.assetDetailList = response["ReturnObject"];
      });

    this.http.post(this.GetDeliveryOrderHByDeliveryOrderHId, doObj).subscribe(
      (response) => { 
        this.doData = response;
      });
  }

}
