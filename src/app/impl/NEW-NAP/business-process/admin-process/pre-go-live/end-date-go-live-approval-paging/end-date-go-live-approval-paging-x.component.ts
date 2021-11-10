import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { String } from 'typescript-string-operations';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';


@Component({
  selector: 'app-end-date-go-live-approval-paging-x',
  templateUrl: './end-date-go-live-approval-paging-x.component.html'
})
export class EndDateForGoLiveApprovalPagingXComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));


  constructor(private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private router: Router, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/impl/ucpaging/searchEndDtGoLiveApproval.json";
    this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchEndDtGoLiveApproval.json";
    this.inputPagingObj.addCritInput = new Array();

    if(environment.isCore) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/V2/searchEndDtGoLiveApprovalV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/V2/searchEndDtGoLiveApprovalV2.json";
    }

    var critInputOnlyOffering = new CriteriaObj();
    critInputOnlyOffering.propName = "vApv.CATEGORY_CODE";
    critInputOnlyOffering.restriction = AdInsConstant.RestrictionEq;
    critInputOnlyOffering.value = "END_DATE_GO_LIVE_APV";
    this.inputPagingObj.addCritInput.push(critInputOnlyOffering);

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'agr.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critBizTemplate);

    var critCurrentUser = new CriteriaObj();
    critCurrentUser.DataType = 'text';
    critCurrentUser.restriction = AdInsConstant.RestrictionEq;
    critCurrentUser.propName = 'vApv.CURRENT_USER_ID';
    critCurrentUser.value = this.userContext.UserName;
    this.inputPagingObj.addCritInput.push(critCurrentUser);

    var critMainUser = new CriteriaObj();
    critMainUser.DataType = 'text';
    critMainUser.restriction = AdInsConstant.RestrictionOr;
    critMainUser.propName = 'vApv.MAIN_USER_ID';
    critMainUser.value = this.userContext.UserName;
    this.inputPagingObj.addCritInput.push(critMainUser);

  }

  GetCallBack(ev: any) {
    var ApvReqObj = new ApprovalObj();
    if (ev.Key == "Process") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUserId) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.END_DT_GO_LIVE_APV_DETAIL],{ "AgrmntId": ev.RowObj.AgrmntId, "AppId": ev.RowObj.AppId, "TrxNo": ev.RowObj.TrxNo, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": ev.RowObj.ApvReqId });
      }
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUserId) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId
        this.httpClient.post(URLConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else if (ev.Key == "TakeBack") {
      if (String.Format("{0:L}", ev.RowObj.MainUserId) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId;
        ApvReqObj.Username = ev.RowObj.MainUserId;
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
