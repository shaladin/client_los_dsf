import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-credit-review-cfna-paging',
  templateUrl: './credit-review-cfna-paging.component.html'
})
export class CreditReviewCfnaPagingComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditReview.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditReview.json";

    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "RVW_" + this.BizTemplateCode;
    arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = arrCrit;
  }
  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
  }
}
