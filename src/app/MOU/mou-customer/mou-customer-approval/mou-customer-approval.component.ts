import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-mou-customer-approval',
  templateUrl: './mou-customer-approval.component.html',
  styleUrls: ['./mou-customer-approval.component.scss']
})
export class MouCustomerApprovalComponent implements OnInit {
  inputPagingObj: any;
  arrCrit: any;

  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/mou/searchMouCustomerApproval.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCustomerApproval.json";

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'A.MOU_STAT';
    critObj.value = 'MOU_APV';
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

}
