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
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
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
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));;
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();

  constructor(
    private route: ActivatedRoute, 
    private toastr: NGXToastrService, 
    private httpClient: HttpClient, 
    private router: Router,
    private cookieService: CookieService,
    private apvTaskService: ApprovalTaskService
  ) { 
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchTaskReassignmentApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchTaskReassignmentApproval.json";
    let activityVersion: string = "/v1";
    let nameOffice: string = "WF.OFFICE_CODE";
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchTaskReassignmentApprovalV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchTaskReassignmentApprovalV2.json";
      
      nameOffice = "TaskOfficeCode";
      activityVersion = "/v2";

      this.inputPagingObj.isJoinExAPI = true;

      this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_TASK_RASGN;
      this.apvReqObj.Username = this.userContext.UserName;
      this.apvReqObj.RoleCode = this.userContext.RoleCode;
      this.integrationObj.baseUrl = URLConstant.GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCode;
      this.integrationObj.requestObj = this.apvReqObj;
      this.integrationObj.leftColumnToJoin = "TransactionCode";
      this.integrationObj.rightColumnToJoin = "TransactionNo";
      this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.integrationObj; 
    }
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "T.WF_ACTIVITY_CODE",
        environment: environment.losUrl + activityVersion
      },
      {
        name: nameOffice,
        environment: environment.FoundationR3Url + "/v1"
      },
    ];
  }

    ngOnInit() {
      if(!environment.isCore){
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
    }

    async GetCallBack(ev) {
      var isRoleAssignment = ev.RowObj.IsRoleAssignment.toString();
      if(ev.Key == "Process"){
        if(isRoleAssignment != CommonConstant.TRUE){
          if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
            this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
            return;
          }
        }
        else if (ev.RowObj.CurrentUser == "-") {
          await this.apvTaskService.ClaimApvTask(ev.RowObj.TaskId);
        }
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.TASK_REASSIGN_APV_DETAIL],{ "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": ev.RowObj.ApvReqId, "TaskReassignmentTrxId": ev.RowObj.TaskReassignmentTrxId});
      }
      else if (ev.Key == "HoldTask") {
        if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
        } else {
          this.apvTaskService.HoldApvTask(ev.RowObj.TaskId);
        }
      }
      else if (ev.Key == "TakeBack") {
        if (String.Format("{0:L}", ev.RowObj.MainUser) != String.Format("{0:L}", this.userContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
        } else {
          this.apvTaskService.TakeBackApvTask(ev.RowObj.TaskId, ev.RowObj.MainUser);
        }
      }
      else if (ev.Key == "UnClaim") {
        if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_UNCLAIM);
        } else {
          this.apvTaskService.UnclaimApvTask(ev.RowObj.TaskId);
        }
      }
      else {
        this.toastr.errorMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
      }
    
  }
}
