import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-credit-review-paging-dsf',
  templateUrl: './credit-review-paging-dsf.component.html',
  styleUrls: ['./credit-review-paging-dsf.component.css']
})
export class CreditReviewPagingDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
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

    this.inputPagingObj._url = "./assets/ucpaging/searchCreditReviewCr.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditReviewCr.json";

    let arrCrit = new Array();
    let critObj = new CriteriaObj();
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
