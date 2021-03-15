import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-return-handling-edit-cust-paging',
  templateUrl: './return-handling-edit-cust-paging.component.html',
  styleUrls: []
})
export class ReturnHandlingEditCustPagingComponent implements OnInit {
  inputPagingObj: any;
  userAccess: any;
  BizTemplateCode: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/new-nap/business-process/additional-process/return-handling/search-return-handling-edit-cust-paging.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/new-nap/business-process/additional-process/return-handling/search-return-handling-edit-cust-paging.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria(): Array<CriteriaObj> {
    var critObjs: Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "EDIT_CUST_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  GetCallback(ev) {
    if (ev.Key == "Edit") {
      if (this.BizTemplateCode === CommonConstant.OPL) {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CUST_COMPL_OPL_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId, "ReturnHandlingHId": ev.RowObj.ReturnHandlingHId });
      }
    }
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
  }
}