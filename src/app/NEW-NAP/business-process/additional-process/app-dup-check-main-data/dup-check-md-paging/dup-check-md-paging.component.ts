import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router, ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-dup-check-md-paging',
  templateUrl: './dup-check-md-paging.component.html',
  styleUrls: []
})
export class DupCheckMdPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
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
    this.inputPagingObj._url = "./assets/ucpaging/searchAppDupCheckMainData.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppDupCheckMainData.json";

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionLike;
    critLobObj.DataType = 'text';
    critLobObj.propName = 'RL.BIZ_TMPLT_CODE';
    critLobObj.value = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.inputPagingObj.addCritInput.push(critLobObj);

    var critWorflowAct = new CriteriaObj();
    critWorflowAct.restriction = AdInsConstant.RestrictionEq;
    critWorflowAct.propName = 'WTL.ACT_CODE';
    critWorflowAct.value = "CDC_MANUAL";
    this.inputPagingObj.addCritInput.push(critWorflowAct);
  }

  NextScreen(event) {
    if (event.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.ProdOfferingCode, event.RowObj.ProdOfferingVersion);
      return false;
    }
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });
  }
}
