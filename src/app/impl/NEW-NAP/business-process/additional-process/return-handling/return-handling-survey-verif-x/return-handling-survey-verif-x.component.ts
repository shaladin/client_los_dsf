import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import {AdInsHelper} from 'app/shared/AdInsHelper';
import {CommonConstant} from 'app/shared/constant/CommonConstant';
import {CookieService} from 'ngx-cookie';
import {RequestTaskModelObj} from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import {IntegrationObj} from 'app/shared/model/library/IntegrationObj.model';

@Component({
  selector: 'app-return-handling-survey-verif-x',
  templateUrl: './return-handling-survey-verif-x.component.html'
})
export class ReturnHandlingSurveyVerifXComponent implements OnInit {
  RequestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj : IntegrationObj = new IntegrationObj();

  BizTemplateCode: string;
  inputPagingObj: UcPagingObj;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(
      params => {
        if (params["BizTemplateCode"] != null) {
          this.BizTemplateCode = params["BizTemplateCode"];
          localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
        }
      }
    );
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();

    if(environment.isCore){
      const UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.inputPagingObj._url = "./assets/impl/ucpaging/survey/V2/searchReturnHandlingSurveyVerifV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/survey/V2/searchReturnHandlingSurveyVerifV2.json";
      this.inputPagingObj.isJoinExAPI = true;

      //Request Obj
      this.RequestTaskModel.ProcessKey = "RTN_ADD_SRVY_" + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = "ADD_SRVY_" + this.BizTemplateCode;
      // this.RequestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE];
      // this.RequestTaskModel.RoleCode = UserAccess[CommonConstant.ROLE_CODE];
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE], UserAccess[CommonConstant.OFFICE_CODE]];

      //Integration Obj
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";

      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    else{
      this.inputPagingObj._url="./assets/ucpaging/survey/searchReturnHandlingSurveyVerif.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = "/v1" + URLConstant.GetPagingObjectBySQL;
      this.inputPagingObj.pagingJson = "./assets/ucpaging/survey/searchReturnHandlingSurveyVerif.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "a.ORI_OFFICE_CODE",
          environment: environment.FoundationR3Url
        }
      ];
      this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
    }
  }

  ActAndOfficeCriteria() : Array<CriteriaObj> {
    var critObjs : Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "ADD_SRVY_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  event(ev) {
    // this.TrxNo = ev.RowObj.AppNo;
    // window.location.href = environment.FoundationR3Web + "/Survey/ViewOrderExternal?TrxNo=" + this.TrxNo + "&TrxType=" + this.TrxType + "&Token=" + this.Token;
  }
}
