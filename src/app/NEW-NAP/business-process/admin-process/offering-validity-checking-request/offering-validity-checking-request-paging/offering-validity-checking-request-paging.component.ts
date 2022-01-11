import { Component, OnInit } from '@angular/core';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { String } from 'typescript-string-operations';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';

@Component({
  selector: 'app-offering-validity-checking-request-paging',
  templateUrl: './offering-validity-checking-request-paging.component.html',
  styleUrls: []
})
export class OfferingValidityCheckingRequestPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  CrdApvResultExpDt: string;
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();
  businessDt: Date;

  constructor(private route: ActivatedRoute, private toastr: NGXToastrService, private httpClient: HttpClient, private router: Router, private cookieService: CookieService, private apvTaskService: ApprovalTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    let arrCrit = new Array();
    this.inputPagingObj._url = "./assets/ucpaging/V2/searchOfferingValidityRequest.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchOfferingValidityRequest.json";
    this.inputPagingObj.isJoinExAPI = true;

    this.RequestTaskModel.ProcessKey = String.Format(CommonConstant.WF_CRP_AFT_ACT, this.BizTemplateCode);
    this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_OFVR + this.BizTemplateCode;
    this.RequestTaskModel.OfficeRoleCodes = [this.userContext[CommonConstant.ROLE_CODE],
    this.userContext[CommonConstant.OFFICE_CODE],
    this.userContext[CommonConstant.ROLE_CODE] + "-" + this.userContext[CommonConstant.OFFICE_CODE]];

    this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
    this.IntegrationObj.requestObj = this.RequestTaskModel;
    this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
    this.IntegrationObj.leftColumnToJoin = "AgrmntNo";
    this.inputPagingObj.integrationObj = this.IntegrationObj;

    var critBizTemplateObj = new CriteriaObj();
    critBizTemplateObj.restriction = AdInsConstant.RestrictionEq;
    critBizTemplateObj.propName = 'agr.BIZ_TEMPLATE_CODE';
    critBizTemplateObj.value = this.BizTemplateCode;
    arrCrit.push(critBizTemplateObj);

    var critCurrStep = new CriteriaObj();
    critCurrStep.restriction = AdInsConstant.RestrictionEq;
    critCurrStep.propName = 'agr.AGRMNT_CURR_STEP';
    critCurrStep.value = CommonConstant.AppStepOFVR;
    arrCrit.push(critCurrStep);
    this.inputPagingObj.addCritInput = arrCrit;
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
  }
}
