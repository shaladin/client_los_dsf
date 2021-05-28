import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
@Component({
  selector: 'app-ltkm-return-handling-paging',
  templateUrl: './ltkm-return-handling.component.html',
  styleUrls: []
})
export class LtkmReturnHandlingPagingComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<any> = new Array();
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        AdInsHelper.SetCookie(this.cookieService, CommonConstant.BIZ_TEMPLATE_CODE, this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchLtkmReturnHandling.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLtkmReturnHandling.json";

    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    
    var arrCrit = new Array();
    var critObj = new CriteriaObj();

    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'WTL.USERNAME';
    critObj.value = this.userContext.UserName;
    arrCrit.push(critObj);
  }
  getEvent(ev: any) {
    if (ev.Key == "ltkmno") { 
      AdInsHelper.OpenLtkmViewByLtkmCustId(ev.RowObj.LtkmCustId);
    }
  }

}
