import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-offering-validity-checking-approval-paging',
  templateUrl: './offering-validity-checking-approval-paging.component.html',
  styleUrls: ['./offering-validity-checking-approval-paging.component.scss']
})
export class OfferingValidityCheckingApprovalPagingComponent implements OnInit {
  inputPagingObj: any;

  constructor() { }

  ngOnInit() {

    var critInputOnlyOffering = new CriteriaObj();
    critInputOnlyOffering.propName = "vApv.CATEGORY_CODE";
    critInputOnlyOffering.restriction = AdInsConstant.RestrictionEq;
    critInputOnlyOffering.value = "OFF_VLD_APV";

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchOfferingValidityCheckingAndApproval.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchOfferingValidityCheckingAndApproval.json";
    this.inputPagingObj.addCritInput = new Array();
    this.inputPagingObj.addCritInput.push(critInputOnlyOffering);
    
  }

}
