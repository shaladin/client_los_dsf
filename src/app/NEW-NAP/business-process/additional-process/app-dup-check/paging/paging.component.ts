import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { HttpClient } from '@angular/common/http';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';


@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: []
})
export class PagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: any;
  BizTemplateCode: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchAppDupCheck.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppDupCheck.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionLike;
    critLobObj.DataType = 'text';
    critLobObj.propName = 'RL.BIZ_TMPLT_CODE';
    critLobObj.value = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.inputPagingObj.addCritInput.push(critLobObj);
  }

  NextScreen(event) {
    if (event.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.ProdOfferingCode, event.RowObj.ProdOfferingVersion);
      return false;
    }

    if (event.RowObj.CustTypeCode == CommonConstant.CustTypePersonal && event.RowObj.IsExistingCust == false) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PERSONAL], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });

    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypePersonal && event.RowObj.IsExistingCust == true) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });

    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypeCompany && event.RowObj.IsExistingCust == false) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_COY], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });

    }
    if (event.RowObj.CustTypeCode == CommonConstant.CustTypeCompany && event.RowObj.IsExistingCust == true) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_COY], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });
    }
  }
}
