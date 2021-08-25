import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-cust-completion-paging',
  templateUrl: './cust-completion-paging.component.html',
  styleUrls: ['./cust-completion-paging.component.scss']
})
export class CustCompletionPagingComponent implements OnInit {
  bizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.bizTemplateCode = params['BizTemplateCode'];
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCustCompletion.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustCompletion.json";

    if (environment.isCore) {
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchCustCompletionV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchCustCompletionV2.json";
      this.inputPagingObj.isJoinExAPI = true

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_DUP_CHECK_MD;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CDA;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
      
      var critCurrStep = new CriteriaObj();
      critCurrStep.restriction = AdInsConstant.RestrictionEq;
      critCurrStep.propName = 'A.CUST_CHECKING_STEP';
      critCurrStep.value = "CDA_REQ";
      this.inputPagingObj.addCritInput.push(critCurrStep);
    } else {
      var critWorflowAct = new CriteriaObj();
      critWorflowAct.restriction = AdInsConstant.RestrictionEq;
      critWorflowAct.propName = 'WTL.ACT_CODE';
      critWorflowAct.value = "CDA";
      this.inputPagingObj.addCritInput.push(critWorflowAct);
    }

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.bizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);
  }

  getUcPagingCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CUST_COMPL_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId, "BizTemplateCode": ev.RowObj.BizTemplateCode });
    }
  }
}
