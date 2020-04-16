import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase-order-paging',
  templateUrl: './purchase-order-paging.component.html',
  styleUrls: ['./purchase-order-paging.component.scss']
})
export class PurchaseOrderPagingComponent implements OnInit {
  lobCode: string;
  pagingJSONLocation: string;
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["LobCode"] != null) {
        this.lobCode = params["LobCode"];
      }
      else{
        this.lobCode = "CF4W";
      }
      switch (this.lobCode) {
        case "FL4W":
          this.pagingJSONLocation = "./assets/ucpaging/FL4W/searchPurchaseOrderFL4W.json";
          break;
      
        default:
          this.pagingJSONLocation = "./assets/ucpaging/searchPurchaseOrder.json";
          break;
      }
    });
  }

  ngOnInit() {
    // "./assets/ucpaging/searchPurchaseOrder.json"
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = this.pagingJSONLocation;
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = this.pagingJSONLocation;
    
    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WF.ACT_CODE';
    critObj.value = "PO";
    this.arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'A.LOB_CODE';
    critObj.value = this.lobCode;
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

}
