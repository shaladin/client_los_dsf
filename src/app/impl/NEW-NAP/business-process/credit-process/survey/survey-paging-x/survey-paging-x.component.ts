import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-survey-paging-x',
  templateUrl: './survey-paging-x.component.html'
})
export class SurveyPagingXComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  BizTemplateCode: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    let arrCrit = new Array();
    let critObj: CriteriaObj;

    if (environment.isCore) {
      const UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.inputPagingObj._url = "./assets/impl/ucpaging/survey/V2/searchSurveyV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/survey/V2/searchSurveyV2.json";
      this.inputPagingObj.isJoinExAPI = true;

      //Request Obj
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstantX.ACT_CODE_SURVEY_VERIF + this.BizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE], UserAccess[CommonConstant.OFFICE_CODE]];

      //Integration Obj
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";

      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.inputPagingObj.integrationObj = this.IntegrationObj;

      critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'A.APP_CURR_STEP';
      critObj.value = CommonConstantX.APP_STEP_SURVEY_VERIF;
      arrCrit.push(critObj);
      this.inputPagingObj.addCritInput = arrCrit
    } else {
      this.inputPagingObj._url = "./assets/ucpaging/survey/searchSurvey.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/survey/searchSurvey.json";
      this.inputPagingObj.apiQryPaging = "/v1" + URLConstant.GetPagingObjectBySQL;

      this.inputPagingObj.ddlEnvironments = [
        {
          name: "A.ORI_OFFICE_CODE",
          environment: environment.FoundationR3Url
        },
        {
          name: "TASK_CLAIM_STAT",
          environment: environment.FoundationR3Url
        }
      ];

      critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WF.ACT_CODE';
      critObj.value = CommonConstantX.ACT_CODE_SURVEY_VERIF + this.BizTemplateCode;
      arrCrit.push(critObj);
      this.inputPagingObj.addCritInput = arrCrit;
    }
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    if (ev.Key == "Edit") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.Id, "TrxNo": ev.RowObj.TrxNo });
    }
  }

}
