import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-delivery-order-paging',
  templateUrl: './delivery-order-paging.component.html',
  styleUrls: ['./delivery-order-paging.component.scss']
})
export class DeliveryOrderPagingComponent implements OnInit {
  inputPagingObj: any;

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchDeliveryOrder.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDeliveryOrder.json";
    //this.inputPagingObj.deleteUrl = ;
  }
}
