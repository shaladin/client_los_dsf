import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { DatePipe, formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: "agrmnt-view-delivery-order",
  templateUrl: "./view-delivery-order.component.html",
  providers: [NGXToastrService]
})
export class ViewDeliveryOrderComponent implements OnInit {
  DeliveryDt: string;
  @Input() agrmntId: number;

  DeliverOrderData: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.agrmntId = params['AppId'];
    //  }
    //});
  }


  ngOnInit() {
    this.GetDeliveryOrderData();
  }

  GetDeliveryOrderData() {
    this.http.post(URLConstant.GetDeliveryOrderDataForOneAssetByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response) => {
        this.DeliverOrderData = response;
        this.DeliveryDt = formatDate(this.DeliverOrderData.DeliveryOrderH.DeliveryDt, 'yyyy-MM-dd', 'en-US');
      }
    );
  }

}
