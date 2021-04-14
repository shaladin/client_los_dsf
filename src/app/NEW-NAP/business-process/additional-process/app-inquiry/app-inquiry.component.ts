import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-app-inquiry',
  templateUrl: './app-inquiry.component.html'
})
export class AppInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }
  arrCrit: any;

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppInquiry.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "A.APP_STAT",
        environment: environment.FoundationR3Url
      },
      {
        name: "ISNULL(B.AGRMNT_CURR_STEP,A.APP_CURR_STEP)",
        environment: environment.FoundationR3Url
      },
      {
        name: "B.AGRMNT_STAT",
        environment: environment.FoundationR3Url
      }
    ];
  }
}
