import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { UcPagingObj, WorkflowReqObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-application-review-paging',
  templateUrl: './application-review-paging.component.html',
  styleUrls: ['./application-review-paging.component.scss']
})
export class ApplicationReviewPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  wfReqObj: WorkflowReqObj = new WorkflowReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchAppReviewNew.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppReviewNew.json";
    this.inputPagingObj.isJoinExAPI = true;

    this.wfReqObj.ActCode = CommonConstant.ACT_CODE_RVW + this.BizTemplateCode;
    this.integrationObj.baseUrl = environment.WfR3Url;
    this.integrationObj.apiPath = URLConstant.GetListOSWfTaskListByActCode;
    this.integrationObj.requestObj = this.wfReqObj;
    this.integrationObj.leftColumnToJoin = "AppNo";
    this.integrationObj.rightColumnToJoin = "TransactionCode";
    this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
    this.inputPagingObj.integrationObj = this.integrationObj;
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
  }
}