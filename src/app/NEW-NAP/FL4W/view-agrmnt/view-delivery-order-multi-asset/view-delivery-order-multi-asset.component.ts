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
  doList: Array<any>;
  AppId: number;
  GetListDeliveryOrderHByAppIdAgrmntId: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });

  }

  async ngOnInit(){
    console.log('viewmulti')
    this.GetListDeliveryOrderHByAppIdAgrmntId = AdInsConstant.GetListDeliveryOrderHByAppIdAgrmntId;
    var doObj = new DeliveryOrderHObj();
    doObj.AgrmntId = this.AgrmntId;
    doObj.AppId = this.AppId;
    this.http.post(this.GetListDeliveryOrderHByAppIdAgrmntId, doObj).subscribe(
      (response) => { 
       this.doList = response["DeliveryOrderHObjs"];
      });
      (error) =>{
        console.log('error');
      }
  } 
}
