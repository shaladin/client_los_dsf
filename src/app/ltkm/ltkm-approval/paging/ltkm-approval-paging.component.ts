import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
@Component({
  selector: 'app-ltkm-approval-paging',
  templateUrl: './ltkm-approval-paging.component.html',
  providers: [NGXToastrService]
})
export class LtkmApprovalPagingComponent implements OnInit {
  arrCrit: Array<CriteriaObj>;
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();
  constructor(
    private route: ActivatedRoute, 
    private toastr: NGXToastrService, 
    private httpClient: HttpClient, 
    private router: Router,
    private cookieService: CookieService,
    private apvTaskService: ApprovalTaskService) {
    this.route.queryParams.subscribe(params => {
     
    });
  }

  ngOnInit() {
    
    this.inputPagingObj._url = "./assets/ucpaging/searchLtkmApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLtkmApproval.json";
    
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchLtkmApprovalV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchLtkmApprovalV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_AML_APV;
      this.apvReqObj.Username = this.userContext.UserName;
      this.apvReqObj.RoleCode = this.userContext.RoleCode;
      this.integrationObj.baseUrl = URLConstant.GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCode;
      this.integrationObj.requestObj = this.apvReqObj;
      this.integrationObj.leftColumnToJoin = "LtkmNo";
      this.integrationObj.rightColumnToJoin = "TransactionNo";
      this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.integrationObj; 
    }
  }

  GetCallBack(ev: any) {
    var ApvReqObj = new ApprovalObj();
    var isRoleAssignment = ev.RowObj.IsRoleAssignment.toString();
    if(ev.Key == "customer"){
      this.CustNoObj.CustNo = ev.RowObj.CustNo;      
      this.httpClient.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
    else if (ev.Key == "ltkmno") { 
        AdInsHelper.OpenLtkmViewByLtkmCustId(ev.RowObj.LtkmCustId);
    }
    else if(ev.Key == "Process"){
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
        }
      }
      else if (ev.RowObj.CurrentUser == "-") {
        this.apvTaskService.ClaimApvTask(ev.RowObj.TaskId);
      }
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.LTKM_VERIFY_APV_DETAIL],{ "LtkmCustId": ev.RowObj.LtkmCustId, "LtkmNo": ev.RowObj.LtkmNo, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "MrCustTypeCode": ev.RowObj.MrCustTypeCode, "ApvReqId": ev.RowObj.ApvReqId, "WfTaskListId": ev.RowObj.WfTaskListId, "IsRoleAssignment": isRoleAssignment });
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
