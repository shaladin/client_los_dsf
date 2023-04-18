import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { UcPagingObj, WhereValueObj} from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { RequestTaskModelForThingsToDoObj } from 'app/shared/model/workflow/request-task-model-for-things-to-do-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';

@Component({
  selector: 'app-survey-paging-x',
  templateUrl: './survey-paging-x.component.html'
})
export class SurveyPagingXComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  navigationSubscription;
  isReady: boolean = false;
  BizTemplateCode: string;
  context: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private toastr: NGXToastrService
  ) {
    this.SubscribeParam();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.RefetchData();
      }
    });
    // this.route.queryParams.subscribe(params => {
    //   if (params['BizTemplateCode'] != null) {
    //     this.BizTemplateCode = params['BizTemplateCode'];
    //     localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
    //   }
    // if (params['IsFromThingsToDo'] != null) this.isFromThingsToDo = true;
    // });
    // });
  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
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

    // this.inputPagingObj = new UcPagingObj();
    // let arrCrit = new Array();
    // let critObj: CriteriaObj;

    // if (environment.isCore) {
    //   const UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    //   this.username = this.context[CommonConstant.USER_NAME];
    //   this.roleCode = this.context[CommonConstant.ROLE_CODE];
    //   this.inputPagingObj._url = "./assets/impl/ucpaging/survey/V2/searchSurveyV2.json";
    //   this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/survey/V2/searchSurveyV2.json";
    //   this.inputPagingObj.isJoinExAPI = true;

    //   //Request Obj
    //   let RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
    //   RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
    //   RequestTaskModel.TaskDefinitionKey = CommonConstantX.ACT_CODE_SURVEY_VERIF + this.BizTemplateCode;
    //   let officeCode: string = this.context[CommonConstant.OFFICE_CODE];
    //   let roleCode: string = this.context[CommonConstant.ROLE_CODE];
    //   RequestTaskModel.OfficeRoleCodes = [officeCode, roleCode + "-" + officeCode, roleCode];

    //   //Integration Obj
    //   let integrationObj: IntegrationObj = new IntegrationObj();
    //   integrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
    //   integrationObj.requestObj = RequestTaskModel;
    //   integrationObj.leftColumnToJoin = "AppNo";
    //   integrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
    //   this.inputPagingObj.integrationObj = integrationObj;

    //   critObj = new CriteriaObj();
    //   critObj.restriction = AdInsConstant.RestrictionIn;
    //   critObj.propName = 'A.APP_CURR_STEP';
    //   critObj.listValue = this.initListValueCurrStep();
    //   arrCrit.push(critObj);
    //   this.inputPagingObj.addCritInput = arrCrit

    //   if (this.isFromThingsToDo)
    //   {
    //     await this.setUcsetUcPagingFromThingsToDo();
    //   }
    //   return;

    // } else {
    //   this.inputPagingObj._url = "./assets/ucpaging/survey/searchSurvey.json";
    //   this.inputPagingObj.pagingJson = "./assets/ucpaging/survey/searchSurvey.json";
    //   this.inputPagingObj.apiQryPaging = "/v1" + URLConstant.GetPagingObjectBySQL;

    //   this.inputPagingObj.ddlEnvironments = [
    //     {
    //       name: "A.ORI_OFFICE_CODE",
    //       environment: environment.FoundationR3Url
    //     },
    //     {
    //       name: "TASK_CLAIM_STAT",
    //       environment: environment.FoundationR3Url
    //     }
    //   ];

    //   critObj = new CriteriaObj();
    //   critObj.restriction = AdInsConstant.RestrictionLike;
    //   critObj.propName = 'WF.ACT_CODE';
    //   critObj.value = CommonConstantX.ACT_CODE_SURVEY_VERIF + this.BizTemplateCode;
    //   arrCrit.push(critObj);
    //   this.inputPagingObj.addCritInput = arrCrit;
    // }
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
    this.inputPagingObj = new UcPagingObj();
    let arrCrit = new Array();
    let critObj: CriteriaObj;

    if (environment.isCore) {
      const UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.username = this.context[CommonConstant.USER_NAME];
      this.roleCode = this.context[CommonConstant.ROLE_CODE];
      this.inputPagingObj._url = "./assets/impl/ucpaging/survey/V2/searchSurveyV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/survey/V2/searchSurveyV2.json";
      this.inputPagingObj.isJoinExAPI = true;

      //Request Obj
      let RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
      RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      RequestTaskModel.TaskDefinitionKey = CommonConstantX.ACT_CODE_SURVEY_VERIF + this.BizTemplateCode;
      let officeCode: string = this.context[CommonConstant.OFFICE_CODE];
      let roleCode: string = this.context[CommonConstant.ROLE_CODE];
      RequestTaskModel.OfficeRoleCodes = [officeCode, roleCode + "-" + officeCode, roleCode];

      //Integration Obj
      let integrationObj: IntegrationObj = new IntegrationObj();
      integrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      integrationObj.requestObj = RequestTaskModel;
      integrationObj.leftColumnToJoin = "AppNo";
      integrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = integrationObj;

      critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionIn;
      critObj.propName = 'A.APP_CURR_STEP';
      critObj.listValue = this.initListValueCurrStep();
      arrCrit.push(critObj);
      this.inputPagingObj.addCritInput = arrCrit

      if (this.isFromThingsToDo)
      {
        await this.setUcsetUcPagingFromThingsToDo();
        if(this.isCmo) return;
      }

    } else {
      this.inputPagingObj._url = "./assets/ucpaging/survey/searchSurvey.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/survey/searchSurvey.json";
      this.inputPagingObj.apiQryPaging = "/v1" + URLConstant.GetPagingObjectBySQL;

      this.inputPagingObj.ddlEnvironments = [
        {
          name: "A.ORI_OFFICE_CODE",
          environment: environment.FoundationR3Url
        },
        {
          name: "TASK_CLAIM_STAT",
          environment: environment.FoundationR3Url
        }
      ];

      critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WF.ACT_CODE';
      critObj.value = CommonConstantX.ACT_CODE_SURVEY_VERIF + this.BizTemplateCode;
      arrCrit.push(critObj);
      this.inputPagingObj.addCritInput = arrCrit;
    }
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
          this.inputPagingObj._url = "./assets/ucpaging/searchPagingFromThingsToDoForCmo.json";
          this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPagingFromThingsToDoForCmo.json";
          this.inputPagingObj.title = "Survey Paging"

          this.inputPagingObj.isJoinExAPI = true

          let RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
          RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
          RequestTaskModel.TaskDefinitionKey = CommonConstantX.ACT_CODE_SURVEY_VERIF + this.BizTemplateCode;
          RequestTaskModel.OfficeRoleCodes = [this.context[CommonConstant.ROLE_CODE],
                                              this.context[CommonConstant.OFFICE_CODE], 
                                              this.context[CommonConstant.ROLE_CODE] + "-" + this.context[CommonConstant.OFFICE_CODE]];
          
        
        this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
        this.IntegrationObj.requestObj = this.RequestTaskModel;
        this.IntegrationObj.leftColumnToJoin = "AppNo";
        this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
        this.inputPagingObj.integrationObj = this.IntegrationObj;

        this.cmoObj = new RefEmpForLookupObj();
        this.cmoObj.Username = this.username;
        await this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.cmoObj).toPromise().then(
          (response: RefEmpForLookupObj) => {
            this.cmoObj = response
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
      }else
      {
        
        this.inputPagingObj._url = "./assets/impl/ucpaging/survey/V2/searchSurveyV2FromThingsToDo.json";
        this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/survey/V2/searchSurveyV2FromThingsToDo.json";

        let RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
        RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
        RequestTaskModel.TaskDefinitionKey = CommonConstantX.ACT_CODE_SURVEY_VERIF + this.BizTemplateCode;
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
        critCurrStep.restriction = AdInsConstant.RestrictionIn;
        critCurrStep.propName = 'A.APP_CURR_STEP';
        critCurrStep.listValue = this.initListValueCurrStep();
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

        // var critRtnHandlingTask = new CriteriaObj();
        // critRtnHandlingTask.restriction = AdInsConstant.RestrictionEq;
        // critRtnHandlingTask.propName = 'RD.MR_RETURN_TASK_CODE';
        // critRtnHandlingTask.value = "RTN_ADD_COLTR";
        // this.listCrit.push(critRtnHandlingTask);
        this.inputPagingObj.addCritInput = this.listCrit;
      });
  }
  //#endregion

  async GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
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
      }
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.Id, "TrxNo": ev.RowObj.TrxNo });
    }
  }

  initListValueCurrStep(){
    let tempList: Array<string> = new Array();
    tempList = [CommonConstant.AppStepNapd, CommonConstant.AppStepRef, CommonConstant.AppStepApp, CommonConstant.AppStepAsset, CommonConstant.AppStepColl, CommonConstant.AppStepIns, CommonConstant.AppStepLIns, CommonConstant.AppStepFin, CommonConstant.AppStepTC, CommonConstant.AppStepUplDoc, CommonConstant.AppStepInvoice, CommonConstant.AppStepRSVFund, CommonConstant.AppStepComm, CommonConstant.ACT_CODE_CDC];
    return tempList;
  }
}
