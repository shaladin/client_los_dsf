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
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { String } from 'typescript-string-operations';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-edit-app-after-approval-approval-paging',
  templateUrl: './edit-app-after-approval-approval-paging.component.html',
  styleUrls: ['./edit-app-after-approval-approval-paging.component.css']
})
export class EditAppAfterApprovalApprovalPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  UserAccess: CurrentUserContext;
  BizTemplateCode: string;
  CustNoObj: GenericObj = new GenericObj();
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();

  constructor(private toastr: NGXToastrService,
              private httpClient: HttpClient,
              private router: Router,
              private cookieService: CookieService,
              private route: ActivatedRoute,
              private apvTaskService: ApprovalTaskService,
              private adInsHelperService: AdInsHelperService) {
                
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }});
  }

  ngOnInit() {
    this.UserAccess  = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchEditAppAfterApprovalApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchEditAppAfterApprovalApproval.json";

    if(environment.isCore) {
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchEditAppAfterApprovalApprovalV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchEditAppAfterApprovalApprovalV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_EDIT_APP_AFT_APV_APV;
      this.apvReqObj.Username = this.UserAccess.UserName;
      this.apvReqObj.RoleCode = this.UserAccess.RoleCode;
      this.apvReqObj.OfficeCode = this.UserAccess.OfficeCode;
      this.integrationObj.baseUrl = URLConstant.GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCodeDistinctByTransaction;
      this.integrationObj.requestObj = this.apvReqObj;
      this.integrationObj.leftColumnToJoin = "EditAppAftApvTrxNo";
      this.integrationObj.rightColumnToJoin = "TransactionNo";
      this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.integrationObj; 
    }

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = "A.BIZ_TEMPLATE_CODE";
    critObj.value = this.BizTemplateCode;
    this.arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  async CallBackHandler(ev) {
    var isRoleAssignment = ev.RowObj.IsRoleAssignment.toString();
    if(ev.Key == "Process"){
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.UserAccess.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
          return;
        }
      }
      else if (ev.RowObj.CurrentUser == "-") {
        await this.apvTaskService.ClaimApvTask(ev.RowObj.TaskId);
      }
        
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_EDIT_APP_AFT_APV_APPRV_DETAIL],{ "EditAppAftApvTrxHId": ev.RowObj.EditAppAftApvTrxHId, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": environment.isCore ? ev.RowObj.RequestId : ev.RowObj.ApvReqId });
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.UserAccess.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } 
      else {
        this.apvTaskService.HoldApvTask(ev.RowObj.TaskId);
      }
    }
    else if (ev.Key == "TakeBack") {
      if (String.Format("{0:L}", ev.RowObj.MainUser) != String.Format("{0:L}", this.UserAccess.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        this.apvTaskService.TakeBackApvTask(ev.RowObj.TaskId, ev.RowObj.MainUser);
      }
    }
    else if (ev.Key == "UnClaim") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.UserAccess.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_UNCLAIM);
      } else {
        this.apvTaskService.UnclaimApvTask(ev.RowObj.TaskId);
      }
    }
    else if (ev.Key == "agreement") {
        AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
    else if (ev.Key == "customer") {
      this.CustNoObj.CustNo = ev.RowObj.CustNo;
      this.httpClient.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
    else {
      this.toastr.warningMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }
}
