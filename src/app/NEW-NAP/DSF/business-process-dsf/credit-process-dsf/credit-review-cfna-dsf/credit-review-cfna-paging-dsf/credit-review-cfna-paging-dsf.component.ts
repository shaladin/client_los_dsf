import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-credit-review-cfna-paging-dsf',
  templateUrl: './credit-review-cfna-paging-dsf.component.html',
  styleUrls: ['./credit-review-cfna-paging-dsf.component.css']
})
export class CreditReviewCfnaPagingDsfComponent implements OnInit {

  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<any> = new Array();
  userAccess: any;

  constructor(private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchCreditReview.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditReview.json";

    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "RVW_" + this.BizTemplateCode;
    arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = arrCrit;

    var critUserObj = new CriteriaObj();
    critUserObj.restriction = AdInsConstant.RestrictionLike;
    critUserObj.propName = 'WTL.USERNAME';
    critUserObj.value = this.userAccess.UserName;
    
    this.inputPagingObj.addCritInput.push(critUserObj);
  }
  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
  }

}
