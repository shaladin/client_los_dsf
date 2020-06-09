import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DeliveryOrderHObj } from 'app/shared/model/DeliveryOrderHObj.Model';

@Component({
  selector: 'app-view-delivery-order-multi-asset',
  templateUrl: './view-delivery-order-multi-asset.component.html',
  styleUrls: ['./view-delivery-order-multi-asset.component.scss']
})
export class ViewDeliveryOrderMultiAssetComponent implements OnInit {
  AgrmntId: number;
  GetDeliveryOrderHByAgrmntId: string;
  doList: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
    });

  }

  ngOnInit() {
    console.log('viewmulti')
    this.GetDeliveryOrderHByAgrmntId = AdInsConstant.GetDeliveryOrderHByAgrmntId;
    var doObj = new DeliveryOrderHObj();
    doObj.AgrmntId = this.AgrmntId;
    this.http.post(this.GetDeliveryOrderHByAgrmntId, doObj).subscribe(
      (response) => { 
       this.doList = response["DeliveryOrderHObjs"];
      });
  }

}
