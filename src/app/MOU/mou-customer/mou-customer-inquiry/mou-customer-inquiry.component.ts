import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-mou-customer-inquiry',
  templateUrl: './mou-customer-inquiry.component.html'
})
export class MouCustomerInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj;

  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCustomerInquiry.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputPagingObj.deleteUrl = "";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCustomerInquiry.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "MOU_STAT",
        environment: environment.FoundationR3Url
      }
    ];
  }

}
