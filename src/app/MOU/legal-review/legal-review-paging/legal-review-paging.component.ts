import { Component, OnInit } from "@angular/core";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { environment } from "environments/environment";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { CriteriaObj } from "app/shared/model/CriteriaObj.model";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CookieService } from "ngx-cookie";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { GenericObj } from "app/shared/model/Generic/GenericObj.Model";
import { CurrentUserContext } from "app/shared/model/CurrentUserContext.model";

@Component({
  selector: "app-legal-review-paging",
  templateUrl: "./legal-review-paging.component.html",
})
export class LegalReviewPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  user: CurrentUserContext;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(
      AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS)
    );

    this.inputPagingObj._url = "./assets/ucpaging/searchLegalReview.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLegalReview.json";

    const addCritMouStat = new CriteriaObj();
    addCritMouStat.DataType = "text";
    addCritMouStat.propName = "MOU.MOU_STAT";
    addCritMouStat.restriction = AdInsConstant.RestrictionNotIn;
    addCritMouStat.value = "LRV";
    this.arrCrit.push(addCritMouStat);
  }

  getEvent(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http
        .post(URLConstant.GetCustByCustNo, this.CustNoObj)
        .subscribe((response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }
}
