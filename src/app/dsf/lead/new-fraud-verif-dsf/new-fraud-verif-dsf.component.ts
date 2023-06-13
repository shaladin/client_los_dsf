import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-fraud-verif-dsf',
  templateUrl: './new-fraud-verif-dsf.component.html',
  styles: []
})
export class NewFraudVerifDsfComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  constructor(private cookieService : CookieService) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchSimpleFraudVerifDsf.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchSimpleFraudVerifDsf.json";

    if(environment.isCore){
      let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      this.inputPagingObj._url = "./assets/dsf/ucpaging/V2/searchSimpleFraudVerifV2Dsf.json";
      this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/V2/searchSimpleFraudVerifV2Dsf.json";
      this.inputPagingObj.isJoinExAPI = true;
      this.inputPagingObj.navigationConst = NavigationConstantDsf;

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_SIMPLE_LEAD;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_SIMPLE_FRAUD_VERIFICATION;
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                               UserAccess[CommonConstant.OFFICE_CODE],
                                               UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "LeadNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;

      let AddCrit = new CriteriaObj();
      AddCrit.DataType = "text";
      AddCrit.propName = "L.LEAD_STEP";
      AddCrit.restriction = AdInsConstant.RestrictionEq;
      AddCrit.value = CommonConstant.LeadStepSimpleLeadFraudVerif;
      this.inputPagingObj.addCritInput.push(AddCrit);
    }

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.losUrl + "/v1"
      },
      {
        name: "L.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];
  }

}
