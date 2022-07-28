import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { String } from 'typescript-string-operations';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';

@Component({
  selector: 'app-invoice-data-paging-x',
  templateUrl: './invoice-data-paging-x.component.html'
})
export class InvoiceDataPagingXComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit = [];
  bizTemplateCode: string;
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  CustNoObj: GenericObj = new GenericObj();

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private http: HttpClient,) {
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

    this.inputPagingObj._url = "./assets/impl/ucpaging/searchInvoiceData.json";
    this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchInvoiceData.json";
    // this.arrCrit = new Array();
    // this.inputPagingObj.isJoinExAPI = true

    // this.RequestTaskModel.ProcessKey = String.Format(CommonConstant.WF_CRP_AFT_ACT, this.bizTemplateCode);
    // this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CNFR + this.bizTemplateCode;
    // this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
    // UserAccess[CommonConstant.OFFICE_CODE],
    // UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];

    this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
    this.IntegrationObj.requestObj = this.RequestTaskModel;
    this.IntegrationObj.leftColumnToJoin = "AgrmntNo";
    this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
    this.inputPagingObj.integrationObj = this.IntegrationObj;


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
    else if(ev.Key == "customer"){
      this.CustNoObj.CustNo = ev.RowObj.CustNo;      
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }

}
