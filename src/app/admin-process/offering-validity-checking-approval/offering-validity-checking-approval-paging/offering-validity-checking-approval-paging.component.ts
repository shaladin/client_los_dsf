import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-offering-validity-checking-approval-paging',
  templateUrl: './offering-validity-checking-approval-paging.component.html',
  styleUrls: ['./offering-validity-checking-approval-paging.component.scss']
})
export class OfferingValidityCheckingApprovalPagingComponent implements OnInit {
  inputPagingObj: any;

  constructor() { }

  ngOnInit() {

    // var critInputAppStatNotCancel = new CriteriaObj();
    // critInputAppStatNotCancel.propName = "ap.APP_STAT";
    // critInputAppStatNotCancel.restriction = AdInsConstant.RestrictionNeq;
    // critInputAppStatNotCancel.value = "CANCEL";

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchOfferingValidityCheckingAndApproval.json";
    this.inputPagingObj.enviromentUrl = environment.localhost;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchOfferingValidityCheckingAndApproval.json";
    this.inputPagingObj.addCritInput = new Array();

    
  }

}
