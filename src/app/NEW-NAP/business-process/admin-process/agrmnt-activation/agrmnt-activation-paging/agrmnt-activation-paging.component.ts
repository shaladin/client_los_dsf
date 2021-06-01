import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcPagingObj, WorkflowReqObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';

@Component({
  selector: 'app-agrmnt-activation-paging',
  templateUrl: './agrmnt-activation-paging.component.html'
})
export class AgrmntActivationPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  wfReqObj: WorkflowReqObj = new WorkflowReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchAgrmntActivation.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAgrmntActivation.json";
    this.inputPagingObj.isJoinExAPI = true;
    // this.inputPagingObj.ddlEnvironments = [
    //   {
    //     name: "DISTRIBUTION_STAT",
    //     environment: environment.FoundationR3Url
    //   },
    //   {
    //     name: "TASK_CLAIM_STAT",
    //     environment: environment.FoundationR3Url
    //   }
    // ];

    this.wfReqObj.ActCode = CommonConstant.ACT_CODE_AGR + this.BizTemplateCode;

    this.integrationObj.baseUrl = environment.WfR3Url;
    this.integrationObj.apiPath = URLConstant.GetListOSWfTaskListByActCode;
    this.integrationObj.requestObj = this.wfReqObj;
    this.integrationObj.leftColumnToJoin = "AppNo";
    this.integrationObj.rightColumnToJoin = "TransactionCode";
    this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;

    this.inputPagingObj.integrationObj = this.integrationObj;

    // var arrCrit = new Array();
    // var critObj = new CriteriaObj();
    // critObj.restriction = AdInsConstant.RestrictionLike;
    // critObj.propName = 'WF.ACT_CODE';
    // critObj.value = "AGR_" + this.BizTemplateCode;
    // arrCrit.push(critObj);

    // this.inputPagingObj.addCritInput = arrCrit;
  }

  GetCallBack(ev: any) {
    console.log("Isi dari ev: ", ev);
    // if (ev.Key == "ViewProdOffering") {
    //   AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    // }
  }
}