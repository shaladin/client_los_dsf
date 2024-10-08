import { Component, OnDestroy, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/uc-paging-obj.model";
import { CriteriaObj } from "app/shared/model/criteria-obj.model";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CurrentUserContext } from "app/shared/model/current-user-context.model";
import { IntegrationObj } from "app/shared/model/library/integration-obj.model";
import { RequestTaskModelObj } from "app/shared/model/workflow/v2/request-task-model-obj.model";

@Component({
  selector: "phone-verification-paging",
  templateUrl: "./phone-verification-paging.component.html"
})

export class PhoneVerificationPagingComponent implements OnInit, OnDestroy {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  isReady: boolean = false;
  navigationSubscription;

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router) {
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
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.SetUcPaging();
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging() {
    this.inputPagingObj._url = "./assets/ucpaging/searchAppPhoneVerif.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppPhoneVerif.json";

    var arrCrit = new Array();

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchAppPhoneVerifV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchAppPhoneVerifV2.json";
      this.inputPagingObj.isJoinExAPI = true
  
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_PHN + this.BizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE], 
                                               this.userAccess[CommonConstant.OFFICE_CODE], 
                                               this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];
  
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
      
      var critCurrStep = new CriteriaObj();
      critCurrStep.restriction = AdInsConstant.RestrictionEq;
      critCurrStep.propName = 'a.APP_CURR_STEP';
      critCurrStep.value = CommonConstant.AppStepPhnVerif;
      arrCrit.push(critCurrStep);
    }else{
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "PHN_" + this.BizTemplateCode;
      arrCrit.push(critObj);
    }

    this.inputPagingObj.addCritInput = arrCrit;
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
  }
}
