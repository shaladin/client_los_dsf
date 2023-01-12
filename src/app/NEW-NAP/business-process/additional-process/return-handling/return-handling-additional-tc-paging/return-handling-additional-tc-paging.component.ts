import { Component, OnDestroy, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { HttpClient } from '@angular/common/http';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-return-handling-additional-tc-paging',
  templateUrl: './return-handling-additional-tc-paging.component.html',
  styleUrls: []
})
export class ReturnHandlingAdditionalTcPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  isReady: boolean = false;
  navigationSubscription;

  isFromThingsToDo: boolean = false;
  username: string;
  roleCode: string;
  empNo: string;
  cmoObj: RefEmpForLookupObj;
  listRole: Array<string> = new Array<string>();
  listCrit: Array<CriteriaObj> = new Array<CriteriaObj>();

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router,
              private http: HttpClient) {
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
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }

      if (params['IsFromThingsToDo'] != null) this.isFromThingsToDo = true;
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
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
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.username = UserAccess[CommonConstant.USER_NAME];
    this.roleCode = UserAccess[CommonConstant.ROLE_CODE];
    
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingAdditionalTc.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingAdditionalTc.json";
    this.inputPagingObj.addCritInput = new Array();
    
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchReturnHandlingAdditionalTcV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchReturnHandlingAdditionalTcV2.json";

      if (this.isFromThingsToDo)
      {
        this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingTaskFromThingsToDo.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingTaskFromThingsToDo.json";
        this.inputPagingObj.title = "Return Handling - Additional Terms & Condition"

        var generalSettingObj: GenericObj = new GenericObj();
        generalSettingObj.Code = CommonConstant.GSRoleForCmo;
        await this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).toPromise().then(
          async (response) => {
            this.listRole = response["GsValue"].split(",");
            if(this.listRole.includes(this.roleCode))
            { 
              this.inputPagingObj.isJoinExAPI = true
    
              this.RequestTaskModel.ProcessKey = CommonConstant.RTN_ADD_TC + this.BizTemplateCode;
              this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ADD_TC + this.BizTemplateCode;
              this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                                       UserAccess[CommonConstant.OFFICE_CODE], 
                                                       UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];
              
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

              var critSalesOfficerNo = new CriteriaObj();
              critSalesOfficerNo.restriction = AdInsConstant.RestrictionEq;
              critSalesOfficerNo.propName = 'A.SALES_OFFICER_NO';
              critSalesOfficerNo.value = this.empNo;
              this.listCrit.push(critSalesOfficerNo);
            }
            else
            {
              var critLastUserInput = new CriteriaObj();
              critLastUserInput.restriction = AdInsConstant.RestrictionEq;
              critLastUserInput.propName = 'A.LAST_USER_INPUT';
              critLastUserInput.value = this.username;
              this.listCrit.push(critLastUserInput);
            }
            var critCurrStep = new CriteriaObj();
            critCurrStep.restriction = AdInsConstant.RestrictionEq;
            critCurrStep.propName = 'A.APP_CURR_STEP';
            critCurrStep.value = CommonConstant.AppStepRtn;
            this.listCrit.push(critCurrStep);
    
            var critLobObj = new CriteriaObj();
            critLobObj.restriction = AdInsConstant.RestrictionEq;
            critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
            critLobObj.value = this.BizTemplateCode;
            this.listCrit.push(critLobObj);
    
            var critAppStatObj = new CriteriaObj();
            critAppStatObj.restriction = AdInsConstant.RestrictionEq;
            critAppStatObj.propName = 'A.APP_STAT';
            critAppStatObj.value = "PRP";
            this.listCrit.push(critAppStatObj);

            var critRtnHandlingTask = new CriteriaObj();
            critRtnHandlingTask.restriction = AdInsConstant.RestrictionEq;
            critRtnHandlingTask.propName = 'RD.MR_RETURN_TASK_CODE';
            critRtnHandlingTask.value = "RTN_ADD_TC";
            this.listCrit.push(critRtnHandlingTask);
            this.inputPagingObj.addCritInput = this.listCrit;
          });

        return;
      }

      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.RTN_ADD_TC + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ADD_TC + this.BizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                                UserAccess[CommonConstant.OFFICE_CODE],
                                                UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    else{
      this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
    }
  }

  ActAndOfficeCriteria(): Array<CriteriaObj> {
    var critObjs: Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "ADD_TC_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  GetCallBack(ev) {
    if (ev.Key == "Edit") {
      let wfTaskListIdTemp = environment.isCore? ev.RowObj.Id : ev.RowObj.WfTaskListId;
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": wfTaskListIdTemp, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId });
    }
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
