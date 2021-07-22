import { Component, OnInit } from '@angular/core';
import { UcPagingObj, WorkflowReqObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-doc-checklist-paging',
  templateUrl: './doc-checklist-paging.component.html'
})
export class DocChecklistPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;
  wfReqObj: WorkflowReqObj = new WorkflowReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();

  constructor(private route: ActivatedRoute) {
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
    this.inputPagingObj._url = "./assets/ucpaging/searchDocChecklist.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDocChecklist.json";
    this.inputPagingObj.isJoinExAPI = true;

    this.wfReqObj.ActCode = CommonConstant.ACT_CODE_DCK_DEC + this.bizTemplateCode;
    this.integrationObj.baseUrl = environment.WfR3Url;
    this.integrationObj.apiPath = URLConstant.GetListOSWfTaskListByActCode;
    this.integrationObj.requestObj = this.wfReqObj;
    this.integrationObj.leftColumnToJoin = "AppNo";
    this.integrationObj.rightColumnToJoin = "TransactionCode";
    this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
    this.inputPagingObj.integrationObj = this.integrationObj;
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}