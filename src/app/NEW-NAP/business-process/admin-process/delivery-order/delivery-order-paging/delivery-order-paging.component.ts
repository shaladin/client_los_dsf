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
  inputPagingObj: UcPagingObj;
  
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchDeliveryOrder.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDeliveryOrder.json";
    this.inputPagingObj.addCritInput = new Array();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'WF.ACT_CODE';
    critObj.value = "DO";
    this.inputPagingObj.addCritInput.push(critObj);
  }
}
