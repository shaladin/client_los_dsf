import { Component, OnDestroy, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { HttpClient } from '@angular/common/http';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { RequestTaskModelForThingsToDoObj } from 'app/shared/model/workflow/request-task-model-for-things-to-do-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-return-handling-collateral-paging',
  templateUrl: './return-handling-collateral-paging.component.html',
})
export class ReturnHandlingCollateralPagingComponent implements OnInit, OnDestroy {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  isReady: boolean = false;
  navigationSubscription;
  context: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router,
              private http: HttpClient, private toastr: NGXToastrService) {
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
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingCollateral.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingCollateral.json";
    this.inputPagingObj.addCritInput = new Array();
    if (environment.isCore) {
      this.username = this.context[CommonConstant.USER_NAME];
      this.roleCode = this.context[CommonConstant.ROLE_CODE];

      this.inputPagingObj._url = "./assets/ucpaging/V2/searchReturnHandlingCollateralV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchReturnHandlingCollateralV2.json";

      this.inputPagingObj.isJoinExAPI = true

      let RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
      RequestTaskModel.ProcessKey = CommonConstant.RTN_ADD_COLTR + this.BizTemplateCode;
      RequestTaskModel.TaskDefinitionKey = CommonConstant.ADD_COLTR + this.BizTemplateCode;
      let officeCode: string = this.context[CommonConstant.OFFICE_CODE];
      let roleCode: string = this.context[CommonConstant.ROLE_CODE];
      RequestTaskModel.OfficeRoleCodes = [officeCode, roleCode + "-" + officeCode, roleCode];

      let integrationObj: IntegrationObj = new IntegrationObj();
      integrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      integrationObj.requestObj = RequestTaskModel;
      integrationObj.leftColumnToJoin = "AppNo";
      integrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = integrationObj;

      if (this.isFromThingsToDo)
      {
        await this.setUcsetUcPagingFromThingsToDo();
      }
      return;
    }
    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria(): Array<CriteriaObj> {
    var critObjs: Array<CriteriaObj> = new Array<CriteriaObj>();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "ADD_COLTR_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  //#region Things To Do Pending Application R3LOS-164 - RTHREE-410
  isFromThingsToDo: boolean = false;
  username: string;
  roleCode: string;
  cmoObj: RefEmpForLookupObj;
  lastUserInput: RefEmpForLookupObj;
  RequestTaskModelForThingsToDo: RequestTaskModelForThingsToDoObj = new RequestTaskModelForThingsToDoObj();
  listRole: Array<string> = new Array<string>();
  listCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  async setUcsetUcPagingFromThingsToDo()
  {
    var generalSettingObj: GenericObj = new GenericObj();
    generalSettingObj.Code = CommonConstant.GSRoleForCmo;
    await this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).toPromise().then(
      async (response) => {
        this.inputPagingObj.isSearched = true;
        this.inputPagingObj.delay = 1000;
        this.listRole = response["GsValue"].split(",");
        if(this.listRole.includes(this.roleCode))
        { 
          this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingTaskFromThingsToDoForCmo.json";
          this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingTaskFromThingsToDoForCmo.json";
          this.inputPagingObj.title = "Return Handling - Collateral"

          this.inputPagingObj.isJoinExAPI = true

          let RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
          RequestTaskModel.ProcessKey = CommonConstant.RTN_ADD_COLTR + this.BizTemplateCode;
          RequestTaskModel.TaskDefinitionKey = CommonConstant.ADD_COLTR + this.BizTemplateCode;
          RequestTaskModel.OfficeRoleCodes = [this.context[CommonConstant.ROLE_CODE],
                                              this.context[CommonConstant.OFFICE_CODE], 
                                              this.context[CommonConstant.ROLE_CODE] + "-" + this.context[CommonConstant.OFFICE_CODE]];
          
          let integrationObj: IntegrationObj = new IntegrationObj();
          integrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
          integrationObj.requestObj = RequestTaskModel;
          integrationObj.leftColumnToJoin = "AppNo";
          integrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
          this.inputPagingObj.integrationObj = integrationObj;

          this.cmoObj = new RefEmpForLookupObj();
          this.cmoObj.Username = this.username;
          await this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.cmoObj).toPromise().then(
            (response: RefEmpForLookupObj) => {
              this.cmoObj = response;
            });

          var critSalesOfficerNo = new CriteriaObj();
          critSalesOfficerNo.restriction = AdInsConstant.RestrictionEq;
          critSalesOfficerNo.propName = 'A.SALES_OFFICER_NO';
          critSalesOfficerNo.value = this.cmoObj.EmpNo;
          this.listCrit.push(critSalesOfficerNo);
        }
        else
        {
          this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingTaskFromThingsToDo.json";
          this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingTaskFromThingsToDo.json";
          this.inputPagingObj.title = "Return Handling - Collateral"

          let RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
          RequestTaskModel.ProcessKey = CommonConstant.RTN_ADD_COLTR + this.BizTemplateCode;
          RequestTaskModel.TaskDefinitionKey = CommonConstant.ADD_COLTR + this.BizTemplateCode;
          RequestTaskModel.OfficeRoleCodes = [this.context[CommonConstant.ROLE_CODE],
                                              this.context[CommonConstant.OFFICE_CODE], 
                                              this.context[CommonConstant.ROLE_CODE] + "-" + this.context[CommonConstant.OFFICE_CODE]];
                                              
          this.RequestTaskModelForThingsToDo.RequestTaskModel = RequestTaskModel;
          this.RequestTaskModelForThingsToDo.UserName = this.username;
          
          let integrationObj: IntegrationObj = new IntegrationObj();
          integrationObj.baseUrl = URLConstant.GetAllTaskWorkflowForThingsToDo;
          integrationObj.requestObj = this.RequestTaskModelForThingsToDo;
          integrationObj.leftColumnToJoin = "AppNo";
          integrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
          this.inputPagingObj.integrationObj = integrationObj;
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
        critRtnHandlingTask.value = "RTN_ADD_COLTR";
        this.listCrit.push(critRtnHandlingTask);
        this.inputPagingObj.addCritInput = this.listCrit;
      });
  }
  //#endregion

  async GetCallBack(ev) {
    if (ev.Key == "Edit") {
      let wfTaskListIdTemp = environment.isCore? ev.RowObj.Id : ev.RowObj.WfTaskListId;
      if(this.isFromThingsToDo && ev.RowObj.LastUserInput != null  && ev.RowObj.LastUserInput != this.username)
      {
        this.lastUserInput = new RefEmpForLookupObj();
        this.lastUserInput.Username = ev.RowObj.LastUserInput;
        await this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.lastUserInput).toPromise().then(
          (response: RefEmpForLookupObj) => {
            this.lastUserInput = response;
          });
        this.toastr.warningMessage("Please contact " + ev.RowObj.LastUserInput + " (" + this.lastUserInput.EmpName +") to edit this application");
        return;
      }

      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_EDIT], { "AppId": ev.RowObj.AppId, "WfTaskListId": wfTaskListIdTemp, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId });
    }
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
  }
}
