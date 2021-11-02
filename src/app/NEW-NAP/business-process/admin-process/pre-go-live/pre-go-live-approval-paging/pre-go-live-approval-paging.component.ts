import { Component, OnInit } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { String } from 'typescript-string-operations';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { environment } from 'environments/environment';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';


@Component({
  selector: 'app-pre-go-live-approval-paging',
  templateUrl: './pre-go-live-approval-paging.component.html'
})
export class PreGoLiveApprovalPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));


  constructor(private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private router: Router, private cookieService: CookieService,
    private apvTaskService: ApprovalTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchPreGoLiveApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPreGoLiveApproval.json";

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchPreGoLiveApprovalV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchPreGoLiveApprovalV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_PRE_GO_LIVE_APV;
      this.apvReqObj.Username = this.userContext.UserName;
      this.apvReqObj.RoleCode = this.userContext.RoleCode;
      this.apvReqObj.OfficeCode = this.userContext.OfficeCode;
      this.IntegrationObj.baseUrl = URLConstant.GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCode;
      this.IntegrationObj.requestObj = this.apvReqObj;
      this.IntegrationObj.leftColumnToJoin = "AgrmntNo";
      this.IntegrationObj.rightColumnToJoin = "TransactionNo";
      this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.IntegrationObj; 
    }
    
    this.inputPagingObj.addCritInput = new Array();

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'agr.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critBizTemplate);

  }

  async GetCallBack(ev: any) {
    var isRoleAssignment = ev.RowObj.IsRoleAssignment.toString();
    if (ev.Key == "Process") {
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
          return;
        }
      }
      else if(ev.RowObj.CurrentUser == "-") {
        await this.apvTaskService.ClaimApvTask(ev.RowObj.TaskId);
      }

      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_DETAIL],{ "AgrmntId": ev.RowObj.AgrmntId, "AppId": ev.RowObj.AppId, "TrxNo": ev.RowObj.TrxNo, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": environment.isCore ? ev.RowObj.RequestId : ev.RowObj.ApvReqId });
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
      this.toastr.warningMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }

}
