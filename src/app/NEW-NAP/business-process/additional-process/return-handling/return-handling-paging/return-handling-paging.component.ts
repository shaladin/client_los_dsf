import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-return-handling-paging',
  templateUrl: './return-handling-paging.component.html'
})
export class ReturnHandlingPagingComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  TaskDefinitionKeyList(){
    let arrTaskDefKey = new Array<string>();
    for(var i = 1; i < 4; i++){
      arrTaskDefKey.push(CommonConstant.ACT_CODE_RTN + this.BizTemplateCode + "_" + i);
    }
    return arrTaskDefKey;
  }
  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandling.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandling.json";
    this.inputPagingObj.addCritInput = new Array();

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchReturnHandlingV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchReturnHandlingV2.json";
      this.inputPagingObj.isJoinExAPI = true
  
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKeys = this.TaskDefinitionKeyList();
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE]];
  
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
      
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

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}