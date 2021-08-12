import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-prod-ho-rvw-paging',
  templateUrl: './prod-ho-rvw-paging.component.html'
})
export class ProdHoRvwPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  UserAccess : CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  
  constructor(private cookieService: CookieService) { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductHOReview.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHOReview.json";

    if(environment.isCore){
      this.InputPagingObj._url = "./assets/ucpaging/product/V2/searchProductHOReviewV2.json";
      this.InputPagingObj.pagingJson = "./assets/ucpaging/product/V2/searchProductHOReviewV2.json";

      this.InputPagingObj.isJoinExAPI = true;

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_PROD_HO_APV;
      this.RequestTaskModel.OfficeCode = this.UserAccess[CommonConstant.OFFICE_CODE];
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_PROD_HO_RVW;
      this.RequestTaskModel.RoleCode = this.UserAccess[CommonConstant.ROLE_CODE];
      this.RequestTaskModel.OfficeCode = this.UserAccess[CommonConstant.OFFICE_CODE];
      this.RequestTaskModel.OfficeRoleCodes = [this.UserAccess[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "ProdCode";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.InputPagingObj.integrationObj = this.IntegrationObj;
    }
  }
}
