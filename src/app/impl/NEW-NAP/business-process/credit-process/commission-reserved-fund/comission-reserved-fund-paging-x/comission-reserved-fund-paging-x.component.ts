import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { HttpClient } from '@angular/common/http';
import { ResultRefundObj } from 'app/shared/model/app-fin-data/result-refund.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { forkJoin } from 'rxjs';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CookieService } from 'ngx-cookie';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { RequestTaskModelForThingsToDoObj } from 'app/shared/model/workflow/request-task-model-for-things-to-do-obj.model';

@Component({
  selector: 'app-comission-reserved-fund-paging-x',
  templateUrl: './comission-reserved-fund-paging-x.component.html',
  styleUrls: ['./comission-reserved-fund-paging-x.component.css']
})
export class ComissionReservedFundPagingXComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  isReady: boolean = false;
  navigationSubscription;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService) {
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

    //   if (params['IsFromThingsToDo'] != null) this.isFromThingsToDo = true;
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

    // this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    // this.inputPagingObj._url = "./assets/ucpaging/searchCommission.json";
    // this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCommission.json";

    // if(environment.isCore){
    //   this.inputPagingObj._url = "./assets/ucpaging/V2/searchCommissionV2.json";
    //   this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchCommissionV2.json";
    //   this.inputPagingObj.isJoinExAPI = true
      
    //   this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
    //   this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_COM_RSV + this.BizTemplateCode;
    //   this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
    //                                            this.userAccess[CommonConstant.OFFICE_CODE], 
    //                                            this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];
      
    //   this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
    //   this.IntegrationObj.requestObj = this.RequestTaskModel;
    //   this.IntegrationObj.leftColumnToJoin = "AppNo";
    //   this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
    //   this.inputPagingObj.integrationObj = this.IntegrationObj;
      
    //   var critCurrStep = new CriteriaObj();
    //   critCurrStep.restriction = AdInsConstant.RestrictionIn;
    //   critCurrStep.propName = 'a.APP_CURR_STEP';
    //   critCurrStep.listValue = [CommonConstant.AppStepComm,CommonConstant.AppStepRSVFund];
    //   this.inputPagingObj.addCritInput.push(critCurrStep);
    // }else{
    //   var critObj = new CriteriaObj();
    //   critObj.restriction = AdInsConstant.RestrictionLike;
    //   critObj.propName = 'WTL.ACT_CODE';
    //   critObj.value = "COM_RSV_" + this.BizTemplateCode;
    //   this.inputPagingObj.addCritInput.push(critObj);
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
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.username = this.userAccess[CommonConstant.USER_NAME];
    this.roleCode = this.userAccess[CommonConstant.ROLE_CODE];

    this.inputPagingObj._url = "./assets/ucpaging/searchCommission.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCommission.json";
    this.inputPagingObj.addCritInput = new Array();

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchCommissionV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchCommissionV2.json";

      this.inputPagingObj.isJoinExAPI = true

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_COM_RSV + this.BizTemplateCode;
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
        await this.setUcPagingFromThingsToDo();
        if(this.isCmo) return;
      }
      
      var critCurrStep = new CriteriaObj();
      critCurrStep.restriction = AdInsConstant.RestrictionIn;
      critCurrStep.propName = 'a.APP_CURR_STEP';
      critCurrStep.listValue = [CommonConstant.AppStepComm,CommonConstant.AppStepRSVFund];
      this.inputPagingObj.addCritInput.push(critCurrStep);
    }else{
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "COM_RSV_" + this.BizTemplateCode;
      this.inputPagingObj.addCritInput.push(critObj);
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
  async setUcPagingFromThingsToDo()
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
        this.inputPagingObj.title = "Application Commission/Reserved-Fund Paging";
        
        this.inputPagingObj.isJoinExAPI = true
        this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
        this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_COM_RSV + this.BizTemplateCode;
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
      }
      else
      {
        this.inputPagingObj._url = "./assets/ucpaging/searchComissionFromThingsToDo.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/searchComissionFromThingsToDo.json";

        this.inputPagingObj.isJoinExAPI = true
        this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
        this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_COM_RSV + this.BizTemplateCode;
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
      critCurrStep.restriction = AdInsConstant.RestrictionIn;
      critCurrStep.propName = 'A.APP_CURR_STEP';
      critCurrStep.listValue = [CommonConstant.AppStepComm,CommonConstant.AppStepRSVFund];
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

      var critIsAppInitDone = new CriteriaObj();
      critIsAppInitDone.restriction = AdInsConstant.RestrictionEq;
      critIsAppInitDone.propName = 'A.IS_APP_INIT_DONE';
      critIsAppInitDone.value = "1";
      this.listCrit.push(critIsAppInitDone);
      this.inputPagingObj.addCritInput = this.listCrit;
    });
  }
  //#endregion

  async GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      let wfTaskListIdTemp = environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId;
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
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });      
    }
  }

}
