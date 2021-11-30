import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-prod-offering-rvw-paging',
  templateUrl: './prod-offering-rvw-paging.component.html'
})
export class ProdOfferingRvwPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  user: CurrentUserContext;
  constructor( private cookieService: CookieService) { }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductOfferingReview.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingReview.json";

    if(environment.isCore){
      this.InputPagingObj._url = "./assets/ucpaging/V2/searchProductOfferingReviewV2.json";
      this.InputPagingObj.pagingJson = "./assets/ucpaging/V2/searchProductOfferingReviewV2.json";

      this.InputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKey = CommonConstant.PROD_OFF_APV;
      this.requestTaskModel.TaskDefinitionKey = CommonConstant.PROD_OFFERING_RVW;
      this.requestTaskModel.OfficeRoleCodes = [this.user[CommonConstant.ROLE_CODE],
                                               this.user[CommonConstant.OFFICE_CODE],
                                               this.user[CommonConstant.ROLE_CODE] + "-" + this.user[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.requestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "ProdOfferingCode";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.InputPagingObj.integrationObj = this.IntegrationObj;
    }
  }
}
