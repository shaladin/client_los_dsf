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
    let activityVersion: string = "/v1";
    let nameActivity: string = "T.ACT_CODE";
    let nameOffice: string = "T.OFFICE_CODE";
    if (environment.isCore) {
      this.InputPagingObj._url = "./assets/ucpaging/V2/searchTaskReassignmentInquiryV2.json";
      this.InputPagingObj.pagingJson = "./assets/ucpaging/V2/searchTaskReassignmentInquiryV2.json";
      nameActivity = "TRT.WF_ACTIVITY_CODE";
      nameOffice = "TRT.OFFICE_CODE";
      activityVersion = "/v2";
    }
    this.InputPagingObj.ddlEnvironments = [
      {
        name: nameActivity,
        environment: environment.losUrl + activityVersion
      },
      {
        name: nameOffice,
        environment: environment.FoundationR3Url + "/v1"
      }
    ];
  }

  ngOnInit() {
  }

}
