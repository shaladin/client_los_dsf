import {Component, OnInit} from '@angular/core';
import {AdInsConstant} from 'app/shared/AdInstConstant';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NGXToastrService} from 'app/components/extra/toastr/toastr.service';
import {String} from 'typescript-string-operations';
import {CommonConstant} from 'app/shared/constant/CommonConstant';
import {ExceptionConstant} from 'app/shared/constant/ExceptionConstant';
import {URLConstant} from 'app/shared/constant/URLConstant';
import {AdInsHelper} from 'app/shared/AdInsHelper';
import {NavigationConstant} from 'app/shared/constant/NavigationConstant';
import {CookieService} from 'ngx-cookie';
import {environment} from 'environments/environment';
import {ApprovalReqObj, UcPagingObj} from 'app/shared/model/uc-paging-obj.model';
import {CurrentUserContext} from 'app/shared/model/current-user-context.model';
import {CriteriaObj} from 'app/shared/model/criteria-obj.model';
import {ApprovalObj} from 'app/shared/model/approval/approval-obj.model';
import {IntegrationObj} from 'app/shared/model/library/integration-obj.model';
import {CommonConstantX} from 'app/impl/shared/constant/CommonConstantX';
import {ApprovalTaskService} from 'app/shared/services/ApprovalTask.service';


@Component({
  selector: 'app-go-live-approval-paging-x',
  templateUrl: './go-live-approval-paging-x.component.html'
})
export class GoLiveApprovalPagingXComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));


  constructor(private route: ActivatedRoute,
              private httpClient: HttpClient,
              private toastr: NGXToastrService,
              private router: Router, private cookieService: CookieService,
              private apvTaskService: ApprovalTaskService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem('BizTemplateCode', this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj.addCritInput = new Array();

    if (environment.isCore) {
      const UserContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.inputPagingObj._url = './assets/impl/ucpaging/V2/searchGoLiveApprovalV2.json';
      this.inputPagingObj.pagingJson = './assets/impl/ucpaging/V2/searchGoLiveApprovalV2.json';

      this.inputPagingObj.isJoinExAPI = true;

      let apvReqObj = new ApprovalReqObj();
      let integrationObj = new IntegrationObj();

      apvReqObj.CategoryCode = CommonConstantX.CAT_CODE_GO_LIVE_APV;
      apvReqObj.Username = UserContext.UserName;
      apvReqObj.RoleCode = UserContext.RoleCode;
      apvReqObj.OfficeCode = UserContext.OfficeCode;

      integrationObj.baseUrl = URLConstant.GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCode;
      integrationObj.leftColumnToJoin = 'TrxNo';
      integrationObj.rightColumnToJoin = 'TransactionNo';
      integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      integrationObj.requestObj = apvReqObj;

      this.inputPagingObj.integrationObj = integrationObj;
    } else {
      this.inputPagingObj._url = './assets/impl/ucpaging/searchGoLiveApproval.json';
      this.inputPagingObj.pagingJson = './assets/impl/ucpaging/searchGoLiveApproval.json';

      var critInputOnlyOffering = new CriteriaObj();
      critInputOnlyOffering.propName = 'vApv.CATEGORY_CODE';
      critInputOnlyOffering.restriction = AdInsConstant.RestrictionEq;
      critInputOnlyOffering.value = 'GO_LIVE_APV';
      this.inputPagingObj.addCritInput.push(critInputOnlyOffering);

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

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'agr.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critBizTemplate);
  }

  async GetCallBack(ev: any) {
    var ApvReqObj = new ApprovalObj();
    const isRoleAssignment = ev.RowObj.IsRoleAssignment.toString();
    if (ev.Key == 'Process') {
      if (isRoleAssignment != CommonConstant.TRUE) {
        if (String.Format('{0:L}', ev.RowObj.CurrentUserId) != String.Format('{0:L}', this.userContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
          return;
        }
      } else if (ev.RowObj.CurrentUser == '-') {
        await this.apvTaskService.ClaimApvTask(ev.RowObj.TaskId);
      }
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.GO_LIVE_APV_DETAIL], {
        'AgrmntId': ev.RowObj.AgrmntId,
        'AppId': ev.RowObj.AppId,
        'TrxNo': ev.RowObj.TrxNo,
        'TaskId': ev.RowObj.TaskId,
        'InstanceId': ev.RowObj.InstanceId,
        'ApvReqId': ev.RowObj.ApvReqId
      });
    } else if (ev.Key == 'HoldTask') {
      if (String.Format('{0:L}', ev.RowObj.CurrentUserId) != String.Format('{0:L}', this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId
        this.httpClient.post(URLConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response['Message']);
          }
        )
      }
    } else if (ev.Key == 'TakeBack') {
      if (String.Format('{0:L}', ev.RowObj.MainUserId) != String.Format('{0:L}', this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId;
        ApvReqObj.Username = ev.RowObj.MainUserId;
        this.httpClient.post(URLConstant.ApvTakeBackTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response['Message']);
          }
        )
      }
    } else if (ev.Key == 'UnClaim') {
      if (String.Format('{0:L}', ev.RowObj.CurrentUserId) != String.Format('{0:L}', this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_UNCLAIM);
      } else {
        this.apvTaskService.UnclaimApvTask(ev.RowObj.TaskId);
      }
    } else {
      this.toastr.warningMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }

}
