import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-credit-process-inquiry',
  templateUrl: './credit-process-inquiry.component.html' 
})
export class CreditProcessInquiryComponent implements OnInit {

  constructor() { }
  inputPagingObj : any;
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditProcessInquiry.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditProcessInquiry.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.APP_LAST_STEP",
        environment: environment.FoundationR3Url
      },
      {
        name: "A.APP_CURR_STEP",
        environment: environment.FoundationR3Url
      }
    ];
  }

}
