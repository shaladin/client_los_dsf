import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';

@Component({
  selector: 'cust-main-data-paging',
  templateUrl: './cust-main-data-paging.component.html'
})
export class CustMainDataPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj>;
  bizTemplateCode: string;
  userAccess: CurrentUserContext;
  token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
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
  
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService) {
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

  makeCriteria() {
    if(environment.isCore){
      var critObj2 = new CriteriaObj();
      critObj2.restriction = AdInsConstant.RestrictionIn;
      critObj2.propName = 'a.APP_CURR_STEP';
      critObj2.listValue = [CommonConstant.AppStepCust, CommonConstant.AppStepFamily, CommonConstant.AppStepGuar, CommonConstant.AppStepShr];
      this.arrCrit.push(critObj2);
    }else{
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "CUST_MD_" + this.bizTemplateCode;
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
    this.username = this.userAccess[CommonConstant.USER_NAME];
    this.roleCode = this.userAccess[CommonConstant.ROLE_CODE];

    this.arrCrit = new Array();

    this.inputPagingObj.title = "Customer Main Data";
    this.inputPagingObj._url = "./assets/ucpaging/searchAppCustMainData.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppCustMainData.json";

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchAppCustMainDataV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchAppCustMainDataV2.json";

      if (this.isFromThingsToDo)
      {
        var generalSettingObj: GenericObj = new GenericObj();
        generalSettingObj.Code = CommonConstant.GSRoleForCmo;
        await this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).toPromise().then(
          async (response) => {
            this.listRole = response["GsValue"].split(",");
            if(this.listRole.includes(this.roleCode))
            {
              this.inputPagingObj._url = "./assets/ucpaging/searchCustMainDataFromThingsToDoForCmo.json";
              this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustMainDataFromThingsToDoForCmo.json";
              
              this.inputPagingObj.isJoinExAPI = true
    
              this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.bizTemplateCode;
              this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CUST_MD + this.bizTemplateCode;

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
              this.inputPagingObj._url = "./assets/ucpaging/searchCustMainDataFromThingsToDo.json";
              this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustMainDataFromThingsToDo.json";

              var critLastUserInput = new CriteriaObj();
              critLastUserInput.restriction = AdInsConstant.RestrictionEq;
              critLastUserInput.propName = 'A.LAST_USER_INPUT';
              critLastUserInput.value = this.username;
              this.arrCrit.push(critLastUserInput);
            }
            var critCurrStep = new CriteriaObj();
            critCurrStep.restriction = AdInsConstant.RestrictionIn;
            critCurrStep.propName = 'A.APP_CURR_STEP';
            critCurrStep.listValue = [CommonConstant.AppStepCust, CommonConstant.AppStepFamily, CommonConstant.AppStepGuar, CommonConstant.AppStepShr];
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
            this.inputPagingObj.addCritInput = this.arrCrit;
          });

        return;
      }
      
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.bizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CUST_MD + this.bizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                               this.userAccess[CommonConstant.OFFICE_CODE],
                                               this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }

    this.makeCriteria();
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  AddApp() {
    if (!this.bizTemplateCode) return;
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, {Code : this.userAccess.OfficeCode}).subscribe(
      (response) => {
        if (response["IsAllowAppCreated"] == true) {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_MAIN_DATA_NAP1_ADD], { "BizTemplateCode": this.bizTemplateCode });
        } else {
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      switch (this.bizTemplateCode) {
        case CommonConstant.CF4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CF4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.CFRFN4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFRFN4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.FCTR:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.FL4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FL4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.CFNA:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFNA_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.OPL:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ROS_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.DF :
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_DLFN_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId});
        break;
      }
    }
  }
}
