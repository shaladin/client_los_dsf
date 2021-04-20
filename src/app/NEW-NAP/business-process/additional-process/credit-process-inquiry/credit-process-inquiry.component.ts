import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-credit-process-inquiry',
  templateUrl: './credit-process-inquiry.component.html'
})
export class CreditProcessInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditProcessInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditProcessInquiry.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.APP_LAST_STEP",
        environment: environment.FoundationR3Url
      },
      {
        name: "A.APP_CURR_STEP",
        environment: environment.FoundationR3Url
      },
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }
}
