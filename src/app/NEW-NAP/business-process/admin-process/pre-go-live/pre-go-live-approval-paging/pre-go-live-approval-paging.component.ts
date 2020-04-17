import { Component, OnInit } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-pre-go-live-approval-paging',
  templateUrl: './pre-go-live-approval-paging.component.html',
  styleUrls: ['./pre-go-live-approval-paging.component.scss']
})
export class PreGoLiveApprovalPagingComponent implements OnInit {
  inputPagingObj: any;

  constructor() { }

  ngOnInit() {
    var critInputOnlyOffering = new CriteriaObj();
    critInputOnlyOffering.propName = "vApv.CATEGORY_CODE";
    critInputOnlyOffering.restriction = AdInsConstant.RestrictionEq;
    critInputOnlyOffering.value = "PRE_GPV_APV";

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchPreGoLiveApproval.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPreGoLiveApproval.json";
    this.inputPagingObj.addCritInput = new Array();
    this.inputPagingObj.addCritInput.push(critInputOnlyOffering);
  }

}
