import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-ltkm-return-handling-paging',
  templateUrl: './ltkm-return-handling.component.html',
  styleUrls: []
})
export class LtkmReturnHandlingPagingComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        AdInsHelper.SetCookie(this.cookieService, CommonConstant.BIZ_TEMPLATE_CODE, this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchLtkmReturnHandling.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLtkmReturnHandling.json";
    
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchLtkmReturnHandlingV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchLtkmReturnHandlingV2.json";
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKeys = [CommonConstant.WF_LTKM_REQ_MANUAL, CommonConstant. WF_LTKM_REQ_AUTO];
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.LTKM_RTN;
      this.RequestTaskModel.OfficeRoleCodes = [this.userContext[CommonConstant.OFFICE_CODE],
                                               this.userContext[CommonConstant.ROLE_CODE],
                                               this.userContext[CommonConstant.ROLE_CODE] + "-" + this.userContext[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "LtkmNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    else{
      var arrCrit = new Array();
      var critObj = new CriteriaObj();
  
      critObj = new CriteriaObj();
      critObj.DataType = 'text';
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'WTL.USERNAME';
      critObj.value = this.userContext.UserName;
      arrCrit.push(critObj);
    }
    
  }
  getEvent(ev: any) {
    if (ev.Key == "ltkmno") { 
      AdInsHelper.OpenLtkmViewByLtkmCustId(ev.RowObj.LtkmCustId);
    }
  }

}
