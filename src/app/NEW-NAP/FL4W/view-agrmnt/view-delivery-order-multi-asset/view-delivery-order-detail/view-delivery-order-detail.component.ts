import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-view-delivery-order-detail',
  templateUrl: './view-delivery-order-detail.component.html',
  styleUrls: ['./view-delivery-order-detail.component.scss']
})
export class ViewDeliveryOrderDetailComponent implements OnInit {
  AgrmntId: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
    });
  }

  ngOnInit() {
    // console.log('viewmultidetail')
    // this.GetDeliveryOrderHByAgrmntId = AdInsConstant.GetDeliveryOrderHByAgrmntId;
    // var doObj = new DeliveryOrderHObj();
    // doObj.AgrmntId = this.AgrmntId;
    // this.http.post(this.GetDeliveryOrderHByAgrmntId, doObj).subscribe(
    //   (response) => { 
    //    this.doList = response["DeliveryOrderHObjs"];
    //   });
  }

}
