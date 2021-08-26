import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-cust-confirmation-paging',
  templateUrl: './cust-confirmation-paging.component.html'
})
export class CustConfirmationPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit = [];
  bizTemplateCode: string;
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();

  constructor(private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.bizTemplateCode);
      }
      else {
        this.bizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      }
    });
  }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchCustConfirmation.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustConfirmation.json";
    this.arrCrit = new Array();

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchCustConfirmationV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchCustConfirmationV2.json";
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = String.Format(CommonConstant.WF_CRP_AFT_ACT, this.bizTemplateCode);
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CNFR + this.bizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [ UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE] ];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AgrmntNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    else{
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WF.ACT_CODE';
      critObj.value = "CNFR_" + this.bizTemplateCode;
      this.arrCrit.push(critObj);
    }

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.propName = "A.BIZ_TEMPLATE_CODE";
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.value = this.bizTemplateCode;

    this.arrCrit.push(critBizTemplate);
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }

}
