import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-lead-inquiry',
  templateUrl: './lead-inquiry.component.html'
})
export class LeadInquiryComponent implements OnInit {

  constructor() { }
  inputPagingObj : UcPagingObj = new UcPagingObj();
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchLeadInquiry.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
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
