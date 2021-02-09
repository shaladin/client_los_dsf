import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-customer-doc-printing-paging',
  templateUrl: './customer-doc-printing-paging.component.html',
})
export class CustomerDocPrintingPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  user: any;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { }
  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if (this.user.MrOfficeTypeCode != "HO") {
      AdInsHelper.RedirectUrl(this.router, ["/Mou/UnauthorizedPage"], {});
      return;
    }
    else {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchCustomerDocPrinting.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustomerDocPrinting.json";

      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MC.MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        }
      ];
    }
  }

  getEvent(event) {
    if (event.Key == "customer") {
      var link: string;
      var custObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
  }
}
