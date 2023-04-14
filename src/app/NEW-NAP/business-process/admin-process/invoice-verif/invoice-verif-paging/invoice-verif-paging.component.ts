import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { CookieService } from 'ngx-cookie';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { RequestTaskModelForThingsToDoObj } from 'app/shared/model/workflow/request-task-model-for-things-to-do-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-invoice-verif-paging',
  templateUrl: './invoice-verif-paging.component.html'
})
export class InvoiceVerifPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private http: HttpClient, private route: ActivatedRoute, private cookieService: CookieService, private toastr: NGXToastrService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }

      if (params['IsFromThingsToDo'] != null) this.isFromThingsToDo = true;
    });
  }

  async ngOnInit() {
    this.username = this.userAccess[CommonConstant.USER_NAME];
    this.roleCode = this.userAccess[CommonConstant.ROLE_CODE];
    
    var arrCrit = new Array();
    if (this.BizTemplateCode == "DLFN") {
      this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerifDF.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerifDF.json";
    }
    else {
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'A.BIZ_TEMPLATE_CODE';
      critObj.value = this.BizTemplateCode;
      arrCrit.push(critObj);

      this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerif.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerif.json";
    }

    if (environment.isCore) {
      if (this.BizTemplateCode == "DLFN") {
        this.inputPagingObj._url = "./assets/ucpaging/V2/searchInvoiceVerifDFV2.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchInvoiceVerifDFV2.json";
      }
      else {
        this.inputPagingObj._url = "./assets/ucpaging/V2/searchInvoiceVerifV2.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchInvoiceVerifV2.json";
      }

      this.inputPagingObj.isJoinExAPI = true

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_INV_VERIF + this.BizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                               this.userAccess[CommonConstant.OFFICE_CODE], 
                                               this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "ApplicationNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;

      if (this.isFromThingsToDo)
      {
        await this.setUcsetUcPagingFromThingsToDo();
        if (this.isCmo)
        {
          this.isReady = true;
          return;
        }
      }

      var critCurrStep = new CriteriaObj();
      critCurrStep.restriction = AdInsConstant.RestrictionEq;
      critCurrStep.propName = 'A.APP_CURR_STEP';
      critCurrStep.value = CommonConstant.ACT_INV_VERIF;
      arrCrit.push(critCurrStep);
      this.inputPagingObj.addCritInput = arrCrit;
    }

    this.isReady = true;
  }

  //#region Things To Do Pending Application R3LOS-164 - RTHREE-410
  isFromThingsToDo: boolean = false;
  isReady: boolean = false;
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
          this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerifDFFromThingsToDoForCmo.json";
          this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerifDFFromThingsToDoForCmo.json";
          
          this.inputPagingObj.isJoinExAPI = true

          this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
          this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_INV_VERIF + this.BizTemplateCode
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
          this.inputPagingObj.whereValue.push(whereValueObj)
          this.isCmo = true;
        }
        else
        {
          if (this.BizTemplateCode == "DLFN")
          {
            this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerifDFFromThingsToDo.json";
            this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerifDFFromThingsToDo.json";
          } 
          else
          {
            this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerifFromThingsToDo.json";
            this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerifFromThingsToDo.json";
          }
          
          this.inputPagingObj.isJoinExAPI = true

          this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
          this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_INV_VERIF + this.BizTemplateCode
          this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                                   this.userAccess[CommonConstant.OFFICE_CODE], 
                                                   this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]]
          this.RequestTaskModelForThingsToDo.RequestTaskModel = this.RequestTaskModel;
          this.RequestTaskModelForThingsToDo.UserName = this.username;
          
          this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflowForThingsToDo;
          this.IntegrationObj.requestObj = this.RequestTaskModelForThingsToDo;
          this.IntegrationObj.leftColumnToJoin = "ApplicationNo";
          this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
          this.inputPagingObj.integrationObj = this.IntegrationObj
          return;
        }
        var critCurrStep = new CriteriaObj();
        critCurrStep.restriction = AdInsConstant.RestrictionEq;
        critCurrStep.propName = 'A.APP_CURR_STEP';
        critCurrStep.value = CommonConstant.ACT_INV_VERIF;
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
        this.listCrit.push(critAppStatObj)
        var critIsAppInitDone = new CriteriaObj();
        critIsAppInitDone.restriction = AdInsConstant.RestrictionEq;
        critIsAppInitDone.propName = 'A.IS_APP_INIT_DONE';
        critIsAppInitDone.value = "1";
        this.listCrit.push(critIsAppInitDone);
        this.inputPagingObj.addCritInput = this.listCrit;
      })

    this.isReady = true;
  }
  //#endregion

  async getEvent(ev) {
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

      switch (this.BizTemplateCode) {
        case CommonConstant.DF:
          AdInsHelper.RedirectUrl(this.router, ["/Nap/AdminProcess/InvoiceVerif/InvoiceDetailDF"], { "AppId": ev.RowObj.AppId, "TaskListId": WfTaskListId});
          break;
        case CommonConstant.FCTR:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_DETAIL], { "AppId": ev.RowObj.AppId, "TaskListId": WfTaskListId});
          break;
      }
    }
    if (ev.Key == "prodOff") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
