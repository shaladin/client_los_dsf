import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-return-handling-survey',
  templateUrl: './return-handling-survey.component.html',
  styleUrls: []
})
export class ReturnHandlingSurveyComponent implements OnInit {
  BizTemplateCode: string;
  TrxType: string = "APP";
  inputPagingObj: UcPagingObj = new UcPagingObj();
  Token: any = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);

  constructor(private route: ActivatedRoute,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingSurvey.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingSurvey.json";
    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria(): Array<CriteriaObj> {
    var critObjs: Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "ADD_SRVY_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  event(ev) {
    switch (ev.Key) {
      case "ViewProdOffering": {
        AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
        break;
      }
      case "Edit": {
        window.open(environment.FoundationR3Web + "/Survey/ViewOrderExternal?TrxNo=" + ev.RowObj.AppNo + "&TrxType=" + this.TrxType + "&Token=" + this.Token);
        break;
      }
    }
  }
}