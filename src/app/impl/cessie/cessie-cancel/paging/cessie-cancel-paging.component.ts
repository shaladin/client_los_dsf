
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'cessie-cancel-paging',
    templateUrl: './cessie-cancel-paging.component.html',
    styleUrls: []
})
export class CessieCancellationPagingComponent implements OnInit {
    inputPagingObj: UcPagingObj = new UcPagingObj();
    RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
    IntegrationObj: IntegrationObj = new IntegrationObj();
    userAccess: CurrentUserContext;
    constructor(private router: Router,private cookieService: CookieService) {
    }

    ngOnInit() {
        this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.inputPagingObj._url = "./assets/ucpaging/searchCessieCancelPaging.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCessieCancelPaging.json";

        // this.inputPagingObj.enviromentUrl = environment.losUrl + '/v1',
        // this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
        if (environment.isCore) {
          this.inputPagingObj._url = "./assets/impl/ucpaging/V2/searchCessieCancelPagingV2.json";
          this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/V2/searchCessieCancelPagingV2.json";
          this.inputPagingObj.isJoinExAPI = true
    
          this.RequestTaskModel.ProcessKey = 'WF_CESSIE_PROCESS';
          this.RequestTaskModel.TaskDefinitionKey = 'FCTR_REVIEW';
          this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE]];
    
          this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
          this.IntegrationObj.requestObj = this.RequestTaskModel;
          this.IntegrationObj.leftColumnToJoin = "CessieNo";
          this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
          this.inputPagingObj.integrationObj = this.IntegrationObj;
        }
    }
    GetCallBack(ev) {
        if (ev.Key == "ViewProdOffering") {
          AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
        }
        if (ev.Key == "edit") {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_CANCEL_DETAIL], { "CessieHXId": ev.RowObj.CessieHXId});
        }
      }
}
