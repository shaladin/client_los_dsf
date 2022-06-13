import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { String } from 'typescript-string-operations';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
import { UcpagingComponent } from '@adins/ucpaging';

@Component({
  selector: 'app-credit-approval-result-extension-approval-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.css']
})
export class CreditApprovalResultExtensionApprovalPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  UserAccess: CurrentUserContext;
  BizTemplateCode: string = '';
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();
  ExtendBasedOn = "APP";
  isReady: boolean = false;
  navigationSubscription;

  constructor(
    private toastr: NGXToastrService, 
    private httpClient: HttpClient, 
    private router: Router, 
    private cookieService: CookieService, 
    private route: ActivatedRoute,
    private apvTaskService: ApprovalTaskService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { 
    this.SubscribeParam();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.RefetchData();
      }
    });
  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null)  this.BizTemplateCode = params["BizTemplateCode"];
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.SetUcPaging();
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging() {
    this.ChangeExtendBasedOn(this.ExtendBasedOn);
  }

  async CallBackHandler(ev) {
    var isRoleAssignment = ev.RowObj.IsRoleAssignment.toString();
    if (ev.Key == "Process") {
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.UserAccess.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
          return;
        }
      }
      else if (ev.RowObj.CurrentUser == "-") {
        await this.apvTaskService.ClaimApvTask(ev.RowObj.TaskId);
      }

      this.router.navigate([NavigationConstant.NAP_ADD_PRCS_CRD_APPR_RES_EXT_APPRVL_DETAIL], { queryParams: { "CrdApvResultExtId": ev.RowObj.CrdApvResultExtId, "TaskId": ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "AppId": ev.RowObj.AppId, "AgrmntId": ev.RowObj.AgrmntId, "ApvReqId": environment.isCore ? ev.RowObj.RequestId : ev.RowObj.ApvReqId, "BizTemplateCode": this.BizTemplateCode} });
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.UserAccess.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } else {
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
    else if(ev.Key == "application"){
      AdInsHelper.OpenAppViewByAppId(ev.RowObj.AppId);
    }
    else if(ev.Key == "agrmnt"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
    else {
      this.toastr.warningMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }

  ExtendBasedOnChanged(event){
    this.isReady = false;
    this.ChangeExtendBasedOn(event.target.value);
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  ChangeExtendBasedOn(extendBasedOn){
    if (extendBasedOn == "APP")
    {
      this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchCreditApprovalPagingResultExt.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditApprovalPagingResultExt.json";
      if (environment.isCore) {
        this.inputPagingObj._url = "./assets/ucpaging/V2/searchCreditApprovalPagingResultExtForAppV2.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchCreditApprovalPagingResultExtForAppV2.json";
        this.inputPagingObj.isJoinExAPI = true

        this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_APV_RES_EXP_D;
        this.apvReqObj.Username = this.UserAccess.UserName;
        this.apvReqObj.RoleCode = this.UserAccess.RoleCode;
        this.apvReqObj.OfficeCode = this.UserAccess.OfficeCode;
        this.integrationObj.requestObj = this.apvReqObj;
        this.integrationObj.leftColumnToJoin = "AppNo";
        this.integrationObj.rightColumnToJoin = "TransactionNo";
        this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
        this.inputPagingObj.integrationObj = this.integrationObj; 
      }
      
      this.arrCrit = new Array();
      if(this.BizTemplateCode != '')
      {
        var critObjBizTmpl = new CriteriaObj();
        critObjBizTmpl.DataType = 'text';
        critObjBizTmpl.propName = 'APP.BIZ_TEMPLATE_CODE';
        critObjBizTmpl.restriction = AdInsConstant.RestrictionEq;
        critObjBizTmpl.value = this.BizTemplateCode;
        this.arrCrit.push(critObjBizTmpl);  
        this.inputPagingObj.addCritInput = this.arrCrit; 
      }
    }
    else if (extendBasedOn == "AGR")
    {
      this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchCreditApprovalPagingResultExt.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditApprovalPagingResultExt.json";
      if (environment.isCore) {
        this.inputPagingObj._url = "./assets/ucpaging/V2/searchCreditApprovalPagingResultExtV2.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchCreditApprovalPagingResultExtV2.json";
        this.inputPagingObj.isJoinExAPI = true

        this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_APV_RES_EXP_D;
        this.apvReqObj.Username = this.UserAccess.UserName;
        this.apvReqObj.RoleCode = this.UserAccess.RoleCode;
        this.apvReqObj.OfficeCode = this.UserAccess.OfficeCode;
        this.integrationObj.requestObj = this.apvReqObj;
        this.integrationObj.leftColumnToJoin = "AgrmntNo";
        this.integrationObj.rightColumnToJoin = "TransactionNo";
        this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
        this.inputPagingObj.integrationObj = this.integrationObj; 
      }
      
      this.arrCrit = new Array();
      if(this.BizTemplateCode != '')
      {
        var critObjBizTmpl = new CriteriaObj();
        critObjBizTmpl.DataType = 'text';
        critObjBizTmpl.propName = 'APP.BIZ_TEMPLATE_CODE';
        critObjBizTmpl.restriction = AdInsConstant.RestrictionEq;
        critObjBizTmpl.value = this.BizTemplateCode;
        this.arrCrit.push(critObjBizTmpl);  
        this.inputPagingObj.addCritInput = this.arrCrit; 
      }
    }
  }
}
