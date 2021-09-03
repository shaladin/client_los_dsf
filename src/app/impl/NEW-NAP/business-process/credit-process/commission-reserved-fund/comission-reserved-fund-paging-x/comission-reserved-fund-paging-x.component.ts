import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-comission-reserved-fund-paging-x',
  templateUrl: './comission-reserved-fund-paging-x.component.html',
  styleUrls: ['./comission-reserved-fund-paging-x.component.css']
})
export class ComissionReservedFundPagingXComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchCommission.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCommission.json";

    var arrCrit = new Array();

    if(environment.isCore){
    this.inputPagingObj._url = "./assets/ucpaging/V2/searchCommissionV2.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchCommissionV2.json";
    this.inputPagingObj.isJoinExAPI = true

    this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
    this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_COM_RSV + this.BizTemplateCode;
    this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE]];

    this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
    this.IntegrationObj.requestObj = this.RequestTaskModel;
    this.IntegrationObj.leftColumnToJoin = "AppNo";
    this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
    this.inputPagingObj.integrationObj = this.IntegrationObj;
    
    var critCurrStep = new CriteriaObj();
    critCurrStep.restriction = AdInsConstant.RestrictionIn;
    critCurrStep.propName = 'a.APP_CURR_STEP';
    critCurrStep.listValue = [CommonConstant.AppStepComm,CommonConstant.AppStepRSVFund];
    this.inputPagingObj.addCritInput.push(critCurrStep);
    }else{
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "COM_RSV_" + this.BizTemplateCode;
      arrCrit.push(critObj);  
    }


    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchCommissionV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchCommissionV2.json";
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      this.RequestTaskModel.OfficeCode = this.userAccess[CommonConstant.OFFICE_CODE];
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_COM_RSV + this.BizTemplateCode;
      this.RequestTaskModel.RoleCode = this.userAccess[CommonConstant.ROLE_CODE];
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                               this.userAccess[CommonConstant.OFFICE_CODE], 
                                               this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    else{
      this.inputPagingObj.addCritInput = arrCrit;
    }
  }

  async GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
    }
  }

}
