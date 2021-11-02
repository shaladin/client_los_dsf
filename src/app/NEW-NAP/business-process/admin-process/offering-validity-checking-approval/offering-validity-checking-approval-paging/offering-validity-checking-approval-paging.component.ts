import { Component, OnInit } from '@angular/core';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { String } from 'typescript-string-operations';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { environment } from 'environments/environment';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';

@Component({
  selector: 'app-offering-validity-checking-approval-paging',
  templateUrl: './offering-validity-checking-approval-paging.component.html',
  styleUrls: []
})
export class OfferingValidityCheckingApprovalPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();

  constructor(private route: ActivatedRoute, private toastr: NGXToastrService, private httpClient: HttpClient, private router: Router, private cookieService: CookieService, private apvTaskService: ApprovalTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    var arrCrit = new Array();

    var critInputOnlyOffering = new CriteriaObj();
    critInputOnlyOffering.propName = "vApv.CATEGORY_CODE";
    critInputOnlyOffering.restriction = AdInsConstant.RestrictionEq;
    critInputOnlyOffering.value = CommonConstant.OFFERING_VALIDITY_APV;

    this.inputPagingObj._url = "./assets/ucpaging/searchOfferingValidityCheckingAndApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchOfferingValidityCheckingAndApproval.json";

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchOfferingValidityCheckingAndApprovalV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchOfferingValidityCheckingAndApprovalV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.apvReqObj.CategoryCode = CommonConstant.ApvCategoryOfferingValidity;
      this.apvReqObj.Username = this.userContext.UserName;
      this.apvReqObj.RoleCode = this.userContext.RoleCode;
      this.apvReqObj.OfficeCode = this.userContext.OfficeCode;
      this.integrationObj.requestObj = this.apvReqObj;
      this.integrationObj.leftColumnToJoin = "AgrmntNo";
      this.integrationObj.rightColumnToJoin = "TransactionNo";
      this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.integrationObj; 
    }
    
    this.inputPagingObj.addCritInput = new Array();
    arrCrit.push(critInputOnlyOffering);

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'agr.BIZ_TEMPLATE_CODE';
    critObj.value = this.BizTemplateCode;
    arrCrit.push(critObj);
  }

  async CallbackHandler(ev) {
    var isRoleAssignment = ev.RowObj.IsRoleAssignment.toString();
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    else if (ev.Key == "Process") {
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
          return;
        }
      }
      else if(ev.RowObj.CurrentUser == "-") {
        await this.apvTaskService.ClaimApvTask(ev.RowObj.TaskId);
      }
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_DETAIL],{"TrxNo": ev.RowObj.TrxNo, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": environment.isCore ? ev.RowObj.RequestId : ev.RowObj.ApvReqId  });
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
