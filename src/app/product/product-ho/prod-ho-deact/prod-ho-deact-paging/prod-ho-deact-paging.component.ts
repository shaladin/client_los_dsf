import { Component, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/uc-paging-obj.model";
import { CriteriaObj } from "app/shared/model/criteria-obj.model";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie";
@Component({
  selector: 'app-prod-ho-deact-paging',
  templateUrl: './prod-ho-deact-paging.component.html'
})
export class ProdHoDeactPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  ArrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();

  constructor(
    private router: Router,
    private cookieService: CookieService) { }

  ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (context[CommonConstant.MR_OFFICE_TYPE_CODE] != CommonConstant.HeadOffice) {
      this.router.navigate([NavigationConstant.PROD_HO_UNAUTHORIZED], { queryParams: {}, skipLocationChange: false });
    }
    
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductHODeactivate.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHODeactivate.json";

    let critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'A.PROD_STAT';
    critObj.value = 'ACT';
    this.ArrCrit.push(critObj);
    
    this.InputPagingObj.addCritInput = this.ArrCrit;
  }
}
