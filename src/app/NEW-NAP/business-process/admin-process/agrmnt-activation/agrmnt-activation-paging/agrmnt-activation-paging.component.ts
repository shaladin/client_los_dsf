import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-agrmnt-activation-paging',
  templateUrl: './agrmnt-activation-paging.component.html'
})
export class AgrmntActivationPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  navigationSubscription;
  isReady:boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private cookieService: CookieService) {
    this.SubscribeParam();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.RefetchData();
      }
    });
  }

  ngOnInit() {
    this.SetUcPaging();
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  
  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem('BizTemplateCode', this.BizTemplateCode);
      }
    });
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging(){    
    this.inputPagingObj.addCritInput = new Array();
    this.inputPagingObj._url = "./assets/ucpaging/searchAgrmntActivation.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAgrmntActivation.json";
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchAgrmntActivationV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchAgrmntActivationV2.json";
      this.inputPagingObj.isJoinExAPI = true
  
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_AGR + this.BizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                               this.userAccess[CommonConstant.OFFICE_CODE], 
                                               this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;

      var critCurrStep = new CriteriaObj();
      critCurrStep.restriction = AdInsConstant.RestrictionIn;
      critCurrStep.propName = 'A.APP_CURR_STEP';
      critCurrStep.listValue = [CommonConstant.AppStepAgr];
      this.inputPagingObj.addCritInput.push(critCurrStep);
    }
    else {
      var arrCrit = new Array();

      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WF.ACT_CODE';
      critObj.value = "AGR_" + this.BizTemplateCode;
      arrCrit.push(critObj);

      this.inputPagingObj.addCritInput = arrCrit;
    }
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }

}
