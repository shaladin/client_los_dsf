import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { String } from 'typescript-string-operations';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-application-approval-paging',
  templateUrl: './application-approval-paging.component.html',
})
export class ApplicationApprovalPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();
  Token: any = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private httpClient: HttpClient,
    private router: Router,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchApplicationApproval.json";
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApplicationApproval.json";
    this.inputPagingObj.isJoinExAPI = true;

    this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_APP_OPL_APV;
    this.apvReqObj.Username = this.userContext.UserName;
    this.apvReqObj.RoleCode = this.userContext.RoleCode;

    this.integrationObj.baseUrl = environment.ApprovalR3OplUrl;
    this.integrationObj.apiPath = URLConstant.GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCode;
    this.integrationObj.requestObj = this.apvReqObj;
    this.integrationObj.leftColumnToJoin = "AppNo";
    this.integrationObj.rightColumnToJoin = "TransactionNo";
    this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;

    this.inputPagingObj.integrationObj = this.integrationObj;

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critObj.value = this.BizTemplateCode;

    this.inputPagingObj.addCritInput.push(critObj);
  }

  GetCallBack(ev: any) {
    var ApvReqObj = new ApprovalObj();
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    else if (ev.Key == "Process") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      }
      else {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_APPRV_DETAIL], { "AppId": ev.RowObj.AppId, "TaskId": ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "MrCustTypeCode": ev.RowObj.MrCustTypeCode, "ApvReqId": ev.RowObj.RequestId });
      }
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      }
      else {
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
      }
      else {
        ApvReqObj.TaskId = ev.RowObj.TaskId
        this.httpClient.post(URLConstant.ApvTakeBackTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else {
      this.toastr.warningMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }
}