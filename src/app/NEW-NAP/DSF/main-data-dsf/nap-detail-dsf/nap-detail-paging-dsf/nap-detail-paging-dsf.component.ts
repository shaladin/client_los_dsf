import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { RequestTaskModelForThingsToDoObj } from 'app/shared/model/workflow/request-task-model-for-things-to-do-obj.model';

@Component({
  selector: 'app-nap-detail-paging-dsf',
  templateUrl: './nap-detail-paging-dsf.component.html',
  styleUrls: ['./nap-detail-paging-dsf.component.css']
})
export class NapDetailPagingDsfComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj>;
  bizTemplateCode: string;
  userAccess: CurrentUserContext;
  token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  isReady: boolean = false;
  navigationSubscription;
  
  constructor(
    private router: Router, private http: HttpClient,
    private route: ActivatedRoute, private cookieService: CookieService, private toastr: NGXToastrService) {
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
      if (params["BizTemplateCode"] != null) this.bizTemplateCode = params["BizTemplateCode"];
      if (params['IsFromThingsToDo'] != null) this.isFromThingsToDo = true;
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  initListValueCurrStep(){
    let tempList: Array<string> = new Array();
    tempList = [CommonConstant.AppStepNapd, CommonConstant.AppStepRef, CommonConstant.AppStepApp, CommonConstant.AppStepAsset, CommonConstant.AppStepColl, CommonConstant.AppStepIns, CommonConstant.AppStepLIns, CommonConstant.AppStepFin, CommonConstant.AppStepTC, CommonConstant.AppStepUplDoc, CommonConstant.AppStepInvoice];
    return tempList;
  }

  makeCriteria() {
    if(environment.isCore){
      var critObj2 = new CriteriaObj();
      critObj2.restriction = AdInsConstant.RestrictionIn;
      critObj2.propName = 'a.APP_CURR_STEP';
      critObj2.listValue = this.initListValueCurrStep();
      this.arrCrit.push(critObj2);
    }else{
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "NAPD_MD_" + this.bizTemplateCode;
      this.arrCrit.push(critObj);
    }
  
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'a.BIZ_TEMPLATE_CODE';
    critObj.value = this.bizTemplateCode;
    this.arrCrit.push(critObj);
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
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.arrCrit = new Array();

    this.inputPagingObj.title = "Application Data Paging";
    this.inputPagingObj._url = "./assets/ucpaging/searchAppCustMainData.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppCustMainData.json";

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchAppCustMainDataV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchAppCustMainDataV2.json";
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.bizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_NAPD_MD + this.bizTemplateCode;
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
    }

    this.makeCriteria();
    this.inputPagingObj.addCritInput = this.arrCrit;
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
  async setUcPagingFromThingsToDo()
  {
    this.username = this.userAccess[CommonConstant.USER_NAME];
    this.roleCode = this.userAccess[CommonConstant.ROLE_CODE];

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
          this.inputPagingObj.title = "Application Data Paging";
          
          this.inputPagingObj.isJoinExAPI = true

          this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.bizTemplateCode;
          this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_NAPD_MD + this.bizTemplateCode;

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
          this.inputPagingObj._url = "./assets/ucpaging/searchPagingFromThingsToDo.json";
          this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPagingFromThingsToDo.json";
          this.inputPagingObj.title = "Application Data Paging";

          this.inputPagingObj.isJoinExAPI = true

          this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.bizTemplateCode;
          this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_NAPD_MD + this.bizTemplateCode;

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
        critCurrStep.listValue = [CommonConstant.AppStepNapd, CommonConstant.AppStepRef, CommonConstant.AppStepApp, CommonConstant.AppStepAsset, CommonConstant.AppStepColl, CommonConstant.AppStepIns, CommonConstant.AppStepLIns, CommonConstant.AppStepFin, CommonConstant.AppStepTC, CommonConstant.AppStepUplDoc, CommonConstant.AppStepInvoice];
        this.arrCrit.push(critCurrStep);

        var critLobObj = new CriteriaObj();
        critLobObj.restriction = AdInsConstant.RestrictionEq;
        critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
        critLobObj.value = this.bizTemplateCode;
        this.arrCrit.push(critLobObj);

        var critAppStatObj = new CriteriaObj();
        critAppStatObj.restriction = AdInsConstant.RestrictionEq;
        critAppStatObj.propName = 'A.APP_STAT';
        critAppStatObj.value = "PRP";
        this.arrCrit.push(critAppStatObj);

        var critIsAppInitDone = new CriteriaObj();
        critIsAppInitDone.restriction = AdInsConstant.RestrictionEq;
        critIsAppInitDone.propName = 'A.IS_APP_INIT_DONE';
        critIsAppInitDone.value = "0";
        this.arrCrit.push(critIsAppInitDone);
        this.inputPagingObj.addCritInput = this.arrCrit;
      });
  }
  //#endregion

  async GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      let WfTaskListId = environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId;
      if(this.isFromThingsToDo && ev.RowObj.LastUserInput != null  && ev.RowObj.LastUserInput != this.username)
      {
        this.lastUserInput = new RefEmpForLookupObj();
        this.lastUserInput.Username = ev.RowObj.LastUserInput;
        await this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.lastUserInput).toPromise().then(
          (response: RefEmpForLookupObj) => {
            this.lastUserInput = response
          });
        this.toastr.warningMessage("Please contact " + ev.RowObj.LastUserInput + " (" + this.lastUserInput.EmpName +") to edit this application");
        return;
      }
      switch (this.bizTemplateCode) {
        case CommonConstant.CF4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CF4W_NAP2_X], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.CFRFN4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFRFN4W_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.FCTR:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.FL4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_FL4W_NAP2_X], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        // Self Custom CR MPF Validation
        case CommonConstant.CFNA:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CFNA_NAP2_X], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        // End Self Custom CR MPF Validation
        case CommonConstant.OPL:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ROS_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.DF :
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_DLFN_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true});
        break;
      }
    }
  }
}
