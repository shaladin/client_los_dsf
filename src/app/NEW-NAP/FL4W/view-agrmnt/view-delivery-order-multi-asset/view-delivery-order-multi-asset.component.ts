import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DeliveryOrderHObj } from 'app/shared/model/DeliveryOrderHObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetDOMultiAssetInformationObj } from 'app/shared/model/Request/DeliveryOrder/ReqGetDOMultiAssetInformationObj.model';
@Component({
  selector: 'app-view-delivery-order-multi-asset',
  templateUrl: './view-delivery-order-multi-asset.component.html'
})
export class ViewDeliveryOrderMultiAssetComponent implements OnInit {
  @Input() AgrmntId: number;
  doList: Array<DeliveryOrderHObj>;
  AppId: number;

  readonly CancelLink: string = NavigationConstant.NAP_FL4W_VIEW_DO_DETAIL;
  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
  }

  async ngOnInit() {
    let GetDoObj = new ReqGetDOMultiAssetInformationObj();
    GetDoObj.AppId = this.AppId;
    GetDoObj.AgrmntId = this.AgrmntId;
    this.http.post(URLConstant.GetListDeliveryOrderHByAppIdAgrmntId, GetDoObj).subscribe(
      (response) => {
        this.doList = response["DeliveryOrderHObjs"];
      });
    (error) => {
    }
  }
}
