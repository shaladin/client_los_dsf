import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-customer-doc-printing-paging',
  templateUrl: './customer-doc-printing-paging.component.html',
})
export class CustomerDocPrintingPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  user: any;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { }
  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCustomerDocPrinting.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustomerDocPrinting.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MC.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if (this.user.MrOfficeTypeCode != "HO") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_UNAUTHORIZED_PAGE], {});
      return;
    }
  }

  getEvent(event) {
    if (event.Key == "customer") {
      var link: string;
      this.http.post(URLConstant.GetCustByCustNo, { TrxNo: event.RowObj.CustNo }).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
  }
}
