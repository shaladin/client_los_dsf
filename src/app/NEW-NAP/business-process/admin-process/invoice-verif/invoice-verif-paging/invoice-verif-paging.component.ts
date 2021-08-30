import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-invoice-verif-paging',
  templateUrl: './invoice-verif-paging.component.html'
})
export class InvoiceVerifPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private http: HttpClient, private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  ngOnInit() {
    var arrCrit = new Array();
    if (this.BizTemplateCode == "DLFN") {
      this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerifDF.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerifDF.json";
    }
    else {
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'A.BIZ_TEMPLATE_CODE';
      critObj.value = this.BizTemplateCode;
      arrCrit.push(critObj);

      this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerif.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerif.json";
    }

    if (environment.isCore) {
      if (this.BizTemplateCode == "DLFN") {
        this.inputPagingObj._url = "./assets/ucpaging/V2/searchInvoiceVerifDFV2.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchInvoiceVerifDFV2.json";
      }
      else {
        this.inputPagingObj._url = "./assets/ucpaging/V2/searchInvoiceVerifV2.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchInvoiceVerifV2.json";
      }
      this.inputPagingObj.isJoinExAPI = true

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_INV_VERIF;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "ApplicationNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;

      var critCurrStep = new CriteriaObj();
      critCurrStep.restriction = AdInsConstant.RestrictionEq;
      critCurrStep.propName = 'A.APP_CURR_STEP';
      critCurrStep.value = CommonConstant.ACT_CODE_INV_VERIF;
      arrCrit.push(critCurrStep);
      this.inputPagingObj.addCritInput = arrCrit;
    }

  }

  getEvent(ev) {
    if (ev.Key == "prodOff") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
