import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';

@Component({
  selector: 'app-factoring-review-paging-dsf',
  templateUrl: './factoring-review-paging-dsf.component.html',
  styleUrls: ['./factoring-review-paging-dsf.component.css']
})
export class FactoringReviewPagingDsfComponent implements OnInit {

  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  userAccess: CurrentUserContext;

  constructor(private router: Router, private route: ActivatedRoute, private cookieService: CookieService) {

  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.inputPagingObj._url = "./assets/ucpaging/searchCessieFactoringReviewPaging.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCessieFactoringReviewPaging.json";

    // this.inputPagingObj.enviromentUrl = environment.losUrl + '/v1';
    // this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    if (environment.isCore) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/V2/searchCessieFactoringReviewPagingV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/V2/searchCessieFactoringReviewPagingV2.json";
      this.inputPagingObj.isJoinExAPI = true

      this.RequestTaskModel.ProcessKey = 'WF_CESSIE_PROCESS';
      this.RequestTaskModel.TaskDefinitionKey = 'FCTR_REVIEW';
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "CessieNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      // this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.IntegrationObj;
      console.log(this.inputPagingObj)
    }

  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    if (ev.Key == "edit") {
      console.log(ev)
      if (ev.RowObj.ProdOfferingCode != CommonConstantX.INIT_CRT_CESSIE_PROCESS_DEFAULT_STAT_NOT_YET_SET) {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.CESSIE_FACTORING_REVIEW_DETAIL_DSF], { "CessieHXId": ev.RowObj.CessieHXId, "WfTaskListId": ev.RowObj.Id, "CessieNo": ev.RowObj.CessieNo, "OfficeCode": ev.RowObj.OfficeCode, "OfficeName": ev.RowObj.OfficeName, "CustNo": ev.RowObj.CustNo, "CustId": ev.RowObj.CustId });
      } else {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.CESSIE_FACTORING_REVIEW_ASSIGN_PROD_DSF], { "CessieHXId": ev.RowObj.CessieHXId, "WfTaskListId": ev.RowObj.Id, "CessieNo": ev.RowObj.CessieNo, "OfficeCode": ev.RowObj.OfficeCode, "OfficeName": ev.RowObj.OfficeName, "CustNo": ev.RowObj.CustNo, "CustId": ev.RowObj.CustId });
      }
    }
  }

}
