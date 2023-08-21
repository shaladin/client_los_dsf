import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CookieService } from 'ngx-cookie';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { RequestTaskModelForThingsToDoObj } from 'app/shared/model/workflow/request-task-model-for-things-to-do-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';

@Component({
  selector: 'app-return-handling-paging-x-dsf',
  templateUrl: './return-handling-paging-x-dsf.component.html'
})
export class ReturnHandlingPagingXDsfComponent implements OnInit, OnDestroy {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  isReady: boolean = false;
  navigationSubscription;

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router, private http: HttpClient, private toastr: NGXToastrService) {
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
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandling.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandling.json";
    this.inputPagingObj.addCritInput = new Array();

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/impl/ucpaging/V2/searchReturnHandlingV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/V2/searchReturnHandlingV2.json";
      this.inputPagingObj.addCritInput = new Array();
      this.inputPagingObj.isJoinExAPI = true

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_RTN + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_RTN + this.BizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                               this.userAccess[CommonConstant.OFFICE_CODE],
                                               this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
      if (this.isFromThingsToDo)
      {
        await this.setUcsetUcPagingFromThingsToDo();
        if (this.isCmo) return;
      }
      var critCurrStep = new CriteriaObj();
      critCurrStep.restriction = AdInsConstant.RestrictionEq;
      critCurrStep.propName = 'a.APP_CURR_STEP';
      critCurrStep.value = CommonConstant.AppStepRtn;
      this.inputPagingObj.addCritInput.push(critCurrStep);
    }else{
      var critLobObj = new CriteriaObj();
      critLobObj.restriction = AdInsConstant.RestrictionEq;
      critLobObj.propName = 'WTL.ACT_CODE';
      critLobObj.value = "RTN_" + this.BizTemplateCode;
      this.inputPagingObj.addCritInput.push(critLobObj);
    }
  }

  isFromThingsToDo: boolean = false;
  isCmo: boolean = false;
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
          this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingFromThingsToDoForCmo.json";
          this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingFromThingsToDoForCmo.json";

          this.inputPagingObj.isJoinExAPI = true

          this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_RTN + this.BizTemplateCode;
          this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_RTN + this.BizTemplateCode;

          this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                                   this.userAccess[CommonConstant.OFFICE_CODE],
                                                   this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];

          this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
          this.IntegrationObj.requestObj = this.RequestTaskModel;
          this.IntegrationObj.leftColumnToJoin = "AppNo";
          this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
          this.inputPagingObj.integrationObj = this.IntegrationObj;

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

          this.isCmo = true;
        }
        else
        {
          this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingFromThingsToDo.json";
          this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingFromThingsToDo.json";

          this.inputPagingObj.isJoinExAPI = true

          this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_RTN + this.BizTemplateCode;
          this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_RTN + this.BizTemplateCode;
          this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                                   this.userAccess[CommonConstant.OFFICE_CODE],
                                                   this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];

          this.RequestTaskModelForThingsToDo.RequestTaskModel = this.RequestTaskModel;
          this.RequestTaskModelForThingsToDo.UserName = this.username;

          this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflowForThingsToDo;
          this.IntegrationObj.requestObj = this.RequestTaskModelForThingsToDo;
          this.IntegrationObj.leftColumnToJoin = "AppNo";
          this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
          this.inputPagingObj.integrationObj = this.IntegrationObj;

          return;
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
        this.inputPagingObj.addCritInput = this.listCrit;
      });
  }

  async GetCallBack(ev) {
    if (ev.Key == "Edit")
    {
      let WfTaskListId = environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId;
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

      // Modify by Self Custom
      AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_ADD_PRCS_RETURN_HANDLING_DETAIL], { "AppId": ev.RowObj.AppId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId, "WfTaskListId": WfTaskListId, "MrCustTypeCode": ev.RowObj.MrCustTypeCode});
      // End Modify by Self Custom
    }

    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
