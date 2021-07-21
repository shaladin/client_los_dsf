import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-task-reassigmnet-inquiry',
  templateUrl: './task-reassigmnet-inquiry.component.html'
})
export class TaskReassigmnetInquiryComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() {
    this.InputPagingObj._url = "./assets/ucpaging/searchTaskReassignmentInquiry.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/searchTaskReassignmentInquiry.json";
    this.InputPagingObj.ddlEnvironments = [
      {
        name: "T.ACT_CODE",
        environment: environment.losUrl + "/v1"
      },
      {
        name: "T.OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];
  }

  ngOnInit() {
  }

}
