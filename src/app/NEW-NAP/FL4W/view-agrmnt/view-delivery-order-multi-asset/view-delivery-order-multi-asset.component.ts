import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DeliveryOrderHObj } from 'app/shared/model/DeliveryOrderHObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-view-delivery-order-multi-asset',
  templateUrl: './view-delivery-order-multi-asset.component.html'
})
export class ViewDeliveryOrderMultiAssetComponent implements OnInit {
  @Input() AgrmntId: number;
  doList: Array<any>;
  AppId: number;
  GetListDeliveryOrderHByAppIdAgrmntId: string;

  readonly CancelLink: string = NavigationConstant.NAP_FL4W_VIEW_DO_DETAIL;
  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
  }

  async ngOnInit() {
    this.GetListDeliveryOrderHByAppIdAgrmntId = URLConstant.GetListDeliveryOrderHByAppIdAgrmntId;
    var doObj = new DeliveryOrderHObj();
    doObj.AgrmntId = this.AgrmntId;
    doObj.AppId = this.AppId;
    this.http.post(this.GetListDeliveryOrderHByAppIdAgrmntId, doObj).subscribe(
      (response) => {
        this.doList = response["DeliveryOrderHObjs"];
      });
    (error) => {
    }
  }
}
