import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { HttpClient } from '@angular/common/http';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { RequestTaskModelForThingsToDoObj } from 'app/shared/model/workflow/request-task-model-for-things-to-do-obj.model';

@Component({
  selector: 'app-dup-check-md-paging',
  templateUrl: './dup-check-md-paging.component.html',
  styleUrls: []
})
export class DupCheckMdPagingComponent implements OnInit, OnDestroy {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  isReady: boolean = false;
  navigationSubscription;
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private http: HttpClient,
    private toastr: NGXToastrService) {
      this.SubscribeParam();
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.RefetchData();
        }
      });

    this.RequestTaskModel = new RequestTaskModelObj();

  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
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
    this.inputPagingObj._url = "./assets/ucpaging/searchAppDupCheckMainData.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppDupCheckMainData.json";
    this.inputPagingObj.addCritInput = new Array();

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchAppDupCheckMainDataV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchAppDupCheckMainDataV2.json";

      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_DUP_CHECK_MD + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CDC_MANUAL + this.BizTemplateCode;
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
      critCurrStep.propName = 'a.CUST_CHECKING_STEP';
      critCurrStep.value = "CDC";
      this.inputPagingObj.addCritInput.push(critCurrStep);
    }else{
      var critWorflowAct = new CriteriaObj();
      critWorflowAct.restriction = AdInsConstant.RestrictionEq;
      critWorflowAct.propName = 'WTL.ACT_CODE';
      critWorflowAct.value = "CDC_MANUAL";
      this.inputPagingObj.addCritInput.push(critWorflowAct);
    }

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.DataType = 'text';
    critLobObj.propName = 'RL.BIZ_TMPLT_CODE';
    critLobObj.value = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.inputPagingObj.addCritInput.push(critLobObj);
  }

  //#region Things To Do Pending Application R3LOS-164 - RTHREE-410
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
          this.inputPagingObj._url = "./assets/ucpaging/searchAppDupCheckMainDataFromThingsToDoForCmo.json";
          this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppDupCheckMainDataFromThingsToDoForCmo.json";
          
          this.inputPagingObj.isJoinExAPI = true

          this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_DUP_CHECK_MD + this.BizTemplateCode;
          this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CDC_MANUAL + this.BizTemplateCode;

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
      
          let whereValueObj = new WhereValueObj();
          whereValueObj.property = "SalesOfficerNo";
          whereValueObj.value = this.cmoObj.EmpNo;
          this.inputPagingObj.whereValue.push(whereValueObj);
      
          whereValueObj = new WhereValueObj();
          whereValueObj.property = "LastUserInput";
          whereValueObj.value = this.username;
          this.inputPagingObj.whereValue.push(whereValueObj);

          this.isCmo = true;
        }
        else
        {
          this.inputPagingObj._url = "./assets/ucpaging/searchAppDupCheckMainDataFromThingsToDo.json";
          this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppDupCheckMainDataFromThingsToDo.json";

          this.inputPagingObj.isJoinExAPI = true
      
          this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_DUP_CHECK_MD + this.BizTemplateCode;
          this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CDC_MANUAL + this.BizTemplateCode;
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
        critCurrStep.propName = 'A.CUST_CHECKING_STEP';
        critCurrStep.value = 'CDC';
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
  //#endregion

  async NextScreen(event) {
    if (event.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.ProdOfferingCode, event.RowObj.ProdOfferingVersion);
      return false;
    }

    if(this.isFromThingsToDo && event.RowObj.LastUserInput != null  && event.RowObj.LastUserInput != this.username)
      {
        this.lastUserInput = new RefEmpForLookupObj();
        this.lastUserInput.Username = event.RowObj.LastUserInput;
        await this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.lastUserInput).toPromise().then(
          (response: RefEmpForLookupObj) => {
            this.lastUserInput = response;
          });
        this.toastr.warningMessage("Please contact " + event.RowObj.LastUserInput + " (" + this.lastUserInput.EmpName +") to edit this application");
        return;
      }

    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST], { "AppId": event.RowObj.AppId, "WfTaskListId": environment.isCore ? event.RowObj.Id : event.RowObj.WfTaskListId });
  }
}
