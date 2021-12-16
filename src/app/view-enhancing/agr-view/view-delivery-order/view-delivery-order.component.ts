import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DeliveryOrderHObj } from 'app/shared/model/delivery-order-h-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { ReqGetDOMultiAssetInformationObj } from 'app/shared/model/request/delivery-order/req-get-do-multi-asset-information-obj.model';

@Component({
  selector: "agrmnt-view-delivery-order",
  templateUrl: "./view-delivery-order.component.html",
  providers: [NGXToastrService]
})
export class ViewDeliveryOrderComponent implements OnInit {
  DeliveryDt: string;
  @Input() agrmntId: number;
  @Input() appId: number;
  isMultiAsset: boolean = false;
  isReady: boolean = false;
  DeliveryOrderHObjs: Array<DeliveryOrderHObj> = new Array<DeliveryOrderHObj>();
  doDetailObj: DeliveryOrderHObj;

  agrmntObj = {
    AgrmntId: 0,
  };

  DeliverOrderData: { DeliveryOrderH: DeliveryOrderHObj, AssetData: AppAssetObj };

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

  }


  async ngOnInit() {
    this.agrmntObj.AgrmntId = this.agrmntId;
    await this.GetDeliveryOrderData();
    await this.GetListDeliveryOrderData();
    this.isReady = true;
  }

  async GetDeliveryOrderData() {
    await this.http.post<{ DeliveryOrderH: DeliveryOrderHObj, AssetData: AppAssetObj }>(URLConstant.GetDeliveryOrderDataForOneAssetByAgrmntId, { Id: this.agrmntId }).toPromise().then(
      (response) => {
        this.DeliverOrderData = response;
        this.DeliveryDt = formatDate(this.DeliverOrderData.DeliveryOrderH.DeliveryDt, 'yyyy-MM-dd', 'en-US');
      }
    );
  }

  async GetListDeliveryOrderData() {
    let GetDoObj = new ReqGetDOMultiAssetInformationObj();
    GetDoObj.AppId = this.appId;
    GetDoObj.AgrmntId = this.agrmntId;
    await this.http.post(URLConstant.GetListDeliveryOrderHByAppIdAgrmntId, GetDoObj).toPromise().then(
      response => {
        this.DeliveryOrderHObjs = response['DeliveryOrderHObjs']; 
        this.doDetailObj = this.DeliveryOrderHObjs[0];
        if(response['DeliveryOrderHObjs'].length > 1){
          this.isMultiAsset = true;
        }
      }
    )
  }

}
