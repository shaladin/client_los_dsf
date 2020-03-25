import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-purchase-order-paging',
  templateUrl: './purchase-order-paging.component.html',
  styleUrls: ['./purchase-order-paging.component.scss']
})
export class PurchaseOrderPagingComponent implements OnInit {

  inputPagingObj: any;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcpagingModule();
    this.inputPagingObj._url = "./assets/ucpaging/searchPurchaseOrder.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPurchaseOrder.json";
  }

}
