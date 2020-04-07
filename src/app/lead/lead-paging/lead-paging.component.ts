import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-lead-paging',
  templateUrl: './lead-paging.component.html' 
})
export class LeadPagingComponent implements OnInit {

  constructor() { }

  inputPagingObj : any;
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchLead.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLead.json";

    // this.arrCrit = new Array();
    // var critObj = new CriteriaObj();
    // critObj.restriction = AdInsConstant.RestrictionEq;
    // critObj.propName = 'AG.AGRMNT_CURR_STEP';
    // critObj.value = "DELIVERY_ORDER";
    // this.arrCrit.push(critObj);
    // this.inputPagingObj.addCritInput = this.arrCrit;
  }

}
