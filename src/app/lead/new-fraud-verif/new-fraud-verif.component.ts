import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-fraud-verif',
  templateUrl: './new-fraud-verif.component.html',
  styles: []
})
export class NewFraudVerifComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  
  constructor(private cookieService : CookieService) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchSimpleFraudVerif.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchSimpleFraudVerif.json";

    if(environment.isCore){
      let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      this.inputPagingObj._url = "./assets/ucpaging/V2/searchSimpleFraudVerifV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchSimpleFraudVerifV2.json";
      this.inputPagingObj.isJoinExAPI = true;

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_SIMPLE_LEAD;
      this.RequestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE];      
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
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "L.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];
  }

}
