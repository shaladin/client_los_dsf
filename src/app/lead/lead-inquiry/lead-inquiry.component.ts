import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-lead-inquiry',
  templateUrl: './lead-inquiry.component.html'
})
export class LeadInquiryComponent implements OnInit {
  inputPagingObj : UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchLeadInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLeadInquiry.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "l.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "l.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "l.LEAD_STAT",
        environment: environment.FoundationR3Url
      },
      {
        name: "l.LEAD_STEP",
        environment: environment.FoundationR3Url
      }
    ];
  }

}
