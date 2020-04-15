import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-purchase-order-paging',
  templateUrl: './purchase-order-paging.component.html',
  styleUrls: ['./purchase-order-paging.component.scss']
})
export class PurchaseOrderPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;

  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchPurchaseOrderFL4W.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPurchaseOrderFL4W.json";
    
    var criteriaList = new Array<CriteriaObj>();
    var criteria = new CriteriaObj();
    criteria.restriction = AdInsConstant.RestrictionEq;
    criteria.propName = 'WF.ACT_CODE';
    criteria.value = "PO";
    criteriaList.push(criteria);

    criteria = new CriteriaObj();
    criteria.restriction = AdInsConstant.RestrictionEq;
    criteria.propName = 'A.LOB_CODE';
    criteria.value = "FL4W";
    criteriaList.push(criteria);
    this.inputPagingObj.addCritInput = criteriaList;
  }

}
