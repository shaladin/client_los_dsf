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
  selector: 'app-tele-verif-paging',
  templateUrl: './tele-verif-paging.component.html'
})
export class TeleVerifPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();

  constructor(
    private cookieService: CookieService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchTeleVerif.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchTeleVerif.json";
    
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchTeleVerifV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchTeleVerifV2.json";
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_LEAD,
      this.RequestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE],
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_TELE_VERIFICATION,
      this.RequestTaskModel.RoleCode = UserAccess[CommonConstant.ROLE_CODE]
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "LeadNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
      
      let AddCrit = new CriteriaObj();
      AddCrit.DataType = "text";
      AddCrit.propName = "L.LEAD_STEP";
      AddCrit.restriction = AdInsConstant.RestrictionEq;
      AddCrit.value = CommonConstant.LeadStepTeleVerf;
      this.inputPagingObj.addCritInput.push(AddCrit);
    }
  }

}
