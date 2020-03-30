import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-delivery-order-paging',
  templateUrl: './delivery-order-paging.component.html',
  styleUrls: ['./delivery-order-paging.component.scss']
})
export class DeliveryOrderPagingComponent implements OnInit {
  inputPagingObj: any;
  arrCrit: any = new Array();
  
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchDeliveryOrder.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDeliveryOrder.json";

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'AG.AGRMNT_CURR_STEP';
    critObj.value = "DELIVERY_ORDER";
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;

  }
}
