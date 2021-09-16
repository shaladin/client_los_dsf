import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-task-reassignment',
  templateUrl: './task-reassignment.component.html',
  styles: []
})
export class TaskReassignmentComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(private cookieService: CookieService) {
  }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/searchTaskReassignmentPaging.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/searchTaskReassignmentPaging.json";
    let nameActivity: string = "T.ACT_CODE";
    let nameOffice: string = "T.OFFICE_CODE";

    let activityVersion: string = "/v1";
    if (environment.isCore) {
      this.InputPagingObj._url = "./assets/ucpaging/V2/searchTaskReassignmentPagingV2.json";
      this.InputPagingObj.pagingJson = "./assets/ucpaging/V2/searchTaskReassignmentPagingV2.json";
      this.InputPagingObj.enviromentUrl = environment.losUrl + "/v1";
      this.InputPagingObj.apiQryPaging = URLConstant.GetPagingObjectForTaskReassignment;
      this.InputPagingObj.isJoinExAPI = true

      let userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      let RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
      RequestTaskModel.OfficeRoleCodes = [userAccess[CommonConstant.ROLE_CODE],
      userAccess[CommonConstant.OFFICE_CODE],
      userAccess[CommonConstant.ROLE_CODE] + "-" + userAccess[CommonConstant.OFFICE_CODE]];

      let integrationObj: IntegrationObj = new IntegrationObj();
      integrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      integrationObj.requestObj = RequestTaskModel;
      integrationObj.joinType = "LEFT";
      this.InputPagingObj.integrationObj = integrationObj;
      nameActivity = "TaskDefinitionKey";
      nameOffice = "TaskOfficeCode";
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

}
