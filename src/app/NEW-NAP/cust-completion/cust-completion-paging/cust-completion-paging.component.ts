import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-cust-completion-paging',
  templateUrl: './cust-completion-paging.component.html',
  styleUrls: ['./cust-completion-paging.component.scss']
})
export class CustCompletionPagingComponent implements OnInit, OnDestroy {
  bizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  isReady: boolean = false;
  isFromThingsToDo: boolean = false;
  username: string;
  roleCode: string;
  empNo: string;
  cmoObj: RefEmpForLookupObj;
  listRole: Array<string> = new Array<string>();
  listCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  
  navigationSubscription;

  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService, private http: HttpClient ) {
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
      if (params['BizTemplateCode'] != null) {
        this.bizTemplateCode = params['BizTemplateCode'];
      }

      if (params['IsFromThingsToDo'] != null) {
        this.isFromThingsToDo = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.username = this.userAccess[CommonConstant.USER_NAME];
    this.roleCode = this.userAccess[CommonConstant.ROLE_CODE];

    await this.SetUcPaging();
  }

  async RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    await this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  async SetUcPaging() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCustCompletion.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustCompletion.json";
    this.inputPagingObj.addCritInput = new Array();

    if (environment.isCore) {
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchCustCompletionV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchCustCompletionV2.json";

      if (this.isFromThingsToDo)
      {
        var generalSettingObj: GenericObj = new GenericObj();
        generalSettingObj.Code = CommonConstant.GSRoleForCmo;
        await this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).toPromise().then(
          async (response) => {
            this.listRole = response["GsValue"].split(",");
            if(this.listRole.includes(this.roleCode))
            {
              this.inputPagingObj._url = "./assets/ucpaging/searchCustCompletionFromThingsToDoForCmo.json";
              this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustCompletionFromThingsToDoForCmo.json";
              
              this.inputPagingObj.isJoinExAPI = true
    
              this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_DUP_CHECK_MD + this.bizTemplateCode;
              this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CDA + this.bizTemplateCode;
              this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                                       this.userAccess[CommonConstant.OFFICE_CODE], 
                                                       this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];
              
              this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
              this.IntegrationObj.requestObj = this.RequestTaskModel;
              this.IntegrationObj.joinType = "LEFT"
              this.IntegrationObj.leftColumnToJoin = "AppNo";
              this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
              this.inputPagingObj.integrationObj = this.IntegrationObj;
    
              this.cmoObj = new RefEmpForLookupObj();
              this.cmoObj.Username = this.username;
              await this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.cmoObj).toPromise().then(
                (response: RefEmpForLookupObj) => {
                  this.empNo = response.EmpNo;
                });
          
              let whereValueObj = new WhereValueObj();
              whereValueObj.property = "SalesOfficerNo";
              whereValueObj.value = this.empNo;
              this.inputPagingObj.whereValue.push(whereValueObj);
          
              whereValueObj = new WhereValueObj();
              whereValueObj.property = "LastUserInput";
              whereValueObj.value = this.username;
              this.inputPagingObj.whereValue.push(whereValueObj);
            }
            else
            {
              this.inputPagingObj._url = "./assets/ucpaging/searchCustCompletionFromThingsToDo.json";
              this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustCompletionFromThingsToDo.json";

              var critLastUserInput = new CriteriaObj();
              critLastUserInput.restriction = AdInsConstant.RestrictionEq;
              critLastUserInput.propName = 'A.LAST_USER_INPUT';
              critLastUserInput.value = this.username;
              this.listCrit.push(critLastUserInput);
            }
            var critCurrStep = new CriteriaObj();
            critCurrStep.restriction = AdInsConstant.RestrictionEq;
            critCurrStep.propName = 'A.CUST_CHECKING_STEP';
            critCurrStep.value = "CDA_REQ";
            this.listCrit.push(critCurrStep);
    
            var critLobObj = new CriteriaObj();
            critLobObj.restriction = AdInsConstant.RestrictionEq;
            critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
            critLobObj.value = this.bizTemplateCode;
            this.listCrit.push(critLobObj);
    
            var critAppStatObj = new CriteriaObj();
            critAppStatObj.restriction = AdInsConstant.RestrictionEq;
            critAppStatObj.propName = 'A.APP_STAT';
            critAppStatObj.value = "PRP";
            this.listCrit.push(critAppStatObj);
            this.inputPagingObj.addCritInput = this.listCrit;
          });

        return;
      }
      
      this.inputPagingObj.isJoinExAPI = true

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_DUP_CHECK_MD + this.bizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CDA + this.bizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                               this.userAccess[CommonConstant.OFFICE_CODE], 
                                               this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;

      var critCurrStep = new CriteriaObj();
      critCurrStep.restriction = AdInsConstant.RestrictionEq;
      critCurrStep.propName = 'A.CUST_CHECKING_STEP';
      critCurrStep.value = "CDA_REQ";
      this.inputPagingObj.addCritInput.push(critCurrStep);
    } else {
      var critWorflowAct = new CriteriaObj();
      critWorflowAct.restriction = AdInsConstant.RestrictionEq;
      critWorflowAct.propName = 'WTL.ACT_CODE';
      critWorflowAct.value = "CDA";
      this.inputPagingObj.addCritInput.push(critWorflowAct);
    }

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.bizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);
  }

  getUcPagingCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {

      this.http.post(URLConstant.CheckIsNegCustAllowedCreateAppByAppId, { Id: ev.RowObj.AppId }).subscribe(
        (res) => {
          if(res) 
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CUST_COMPL_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId, "BizTemplateCode": ev.RowObj.BizTemplateCode });
        }
      );
    }
  }
}
