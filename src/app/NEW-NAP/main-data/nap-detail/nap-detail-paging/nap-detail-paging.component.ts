import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'nap-detail-paging',
  templateUrl: './nap-detail-paging.component.html',
  styleUrls: []
})
export class NapDetailPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  bizTemplateCode: string;
  userAccess: any;
  token: string = localStorage.getItem(CommonConstant.TOKEN);
  constructor(
    private router: Router,
    private route: ActivatedRoute) 
  {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) this.bizTemplateCode = params["BizTemplateCode"];
    });
  }

  makeCriteria() {
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "NAPD_MD_" + this.bizTemplateCode;
    this.arrCrit.push(critObj);
  }

  async ngOnInit() {
    this.userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    this.arrCrit = new Array();
    this.makeCriteria();

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj.title = "NAP 2 Paging";
    this.inputPagingObj._url = "./assets/ucpaging/searchAppCustMainData.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppCustMainData.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      switch(this.bizTemplateCode)
      {
        case CommonConstant.CF4W :
          AdInsHelper.RedirectUrl(this.router,["Nap/ConsumerFinance/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "IsMainData": true});
        break;
        case CommonConstant.CFRFN4W :
          AdInsHelper.RedirectUrl(this.router,["Nap/CFRefinancing/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "IsMainData": true});
        break;
        case CommonConstant.FCTR :
          AdInsHelper.RedirectUrl(this.router,["Nap/Factoring/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "IsMainData": true});
        break;
        case CommonConstant.FL4W :
          AdInsHelper.RedirectUrl(this.router,["Nap/FinanceLeasing/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "IsMainData": true});
        break;
        case CommonConstant.CFNA :
          AdInsHelper.RedirectUrl(this.router,["Nap/CFNA/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "IsMainData": true});
        break;
        case CommonConstant.OPL :
          AdInsHelper.RedirectUrl(this.router,["Nap/OPL/NAP2"], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "IsMainData": true});
        break;
      }
    }
  }
}
