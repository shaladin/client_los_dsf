import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'cessie-pre-go-live-paging',
  templateUrl: './pre-go-live-paging.component.html'
})
export class CessiePreGoLivePagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  userAccess: CurrentUserContext;
  constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService) {
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchCessiePreGoLive.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCessiePreGoLive.json";
    if (environment.isCore) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/V2/searchCessiePreGoLiveV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/V2/searchCessiePreGoLiveV2.json";
      this.inputPagingObj.isJoinExAPI = true

      this.RequestTaskModel.ProcessKey = 'WF_CESSIE_PROCESS';
      this.RequestTaskModel.TaskDefinitionKey = 'PGLV_CESSIE';
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "CessieNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      // this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.IntegrationObj;

    }

  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    else if (ev.Key == "Edit") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_PGL_DETAIL], { "CessieHXId": ev.RowObj.CessieHXId, "CessieNo": ev.RowObj.CessieNo, "TaskListId": ev.RowObj.Id });
    }
  }
}
