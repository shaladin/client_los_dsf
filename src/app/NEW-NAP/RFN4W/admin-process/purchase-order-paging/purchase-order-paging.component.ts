import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-purchase-order-paging',
  templateUrl: './purchase-order-paging.component.html',
  styleUrls: ['./purchase-order-paging.component.scss']
})
export class PurchaseOrderPagingComponent implements OnInit {
  @Input() LOBCode: string;
  @Input() PagingJSONLocation: string;
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;

  constructor() { }

  ngOnInit() {
    // "./assets/ucpaging/searchPurchaseOrder.json"
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = this.PagingJSONLocation;
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = this.PagingJSONLocation;
    
    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WF.ACT_CODE';
    critObj.value = "PO";
    this.arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'A.LOB_CODE';
    critObj.value = this.LOBCode != null && this.LOBCode != "undefined" && this.LOBCode != "" ? this.LOBCode : "CF4W";
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

}
