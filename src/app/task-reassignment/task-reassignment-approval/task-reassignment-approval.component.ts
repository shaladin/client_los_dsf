import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-task-reassignment-approval',
  templateUrl: './task-reassignment-approval.component.html',
  styles: []
})
export class TaskReassignmentApprovalComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  userContext: CurrentUserContext;

  constructor(
    private route: ActivatedRoute, 
    private toastr: NGXToastrService, 
    private httpClient: HttpClient, 
    private router: Router,
    private cookieService: CookieService
  ) { 
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchTaskReassignmentApproval.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchTaskReassignmentApproval.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "T.WF_ACTIVITY_CODE",
        environment: environment.losUrl
      },
      {
        name: "WF.OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
    ];
  }

  ngOnInit() {
    this.userContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var criteriaList = new Array<CriteriaObj>();
    var criteriaObj = new CriteriaObj();
    criteriaObj.DataType = 'text';
    criteriaObj.restriction = AdInsConstant.RestrictionEq;
    criteriaObj.propName = 'A.CURRENT_USER_ID';
    criteriaObj.value = this.userContext.UserName;
    criteriaList.push(criteriaObj);
    
    criteriaObj = new CriteriaObj();
    criteriaObj.DataType = 'text';
    criteriaObj.restriction = AdInsConstant.RestrictionOr;
    criteriaObj.propName = 'A.MAIN_USER_ID';
    criteriaObj.value = this.userContext.UserName;
    criteriaList.push(criteriaObj);

    this.inputPagingObj.addCritInput = criteriaList;
  }

  GetCallBack(ev: any) {
    var ApvReqObj = new ApprovalObj();
    if(ev.Key == "Process"){
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.TASK_REASSIGN_APV_DETAIL],{ "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": ev.RowObj.ApvReqId, "TaskReassignmentTrxId": ev.RowObj.TaskReassignmentTrxId });
      }
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId;
        this.httpClient.post(URLConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else if (ev.Key == "TakeBack") {
      if (String.Format("{0:L}", ev.RowObj.MainUser) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId;
        ApvReqObj.UsernameMemberId = ev.RowObj.MainUsernameMemberId;
        this.httpClient.post(URLConstant.ApvTakeBackTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else {
      this.toastr.errorMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }

}
