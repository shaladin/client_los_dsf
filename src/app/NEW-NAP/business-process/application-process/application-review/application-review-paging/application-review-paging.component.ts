import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-application-review-paging',
  templateUrl: './application-review-paging.component.html',
  styleUrls: ['./application-review-paging.component.scss']
})
export class ApplicationReviewPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchAppReviewNew.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppReviewNew.json";

    let arrCrit = new Array();
    let critObj = new CriteriaObj();
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
