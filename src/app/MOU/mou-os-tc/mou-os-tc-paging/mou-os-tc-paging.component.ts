import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';

@Component({
  selector: 'app-mou-os-tc-paging',
  templateUrl: './mou-os-tc-paging.component.html'
})
export class MouOsTcPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  CustNoObj: GenericObj = new GenericObj();
  user: any;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if (this.user.MrOfficeTypeCode != CommonConstant.HeadOffice) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_UNAUTHORIZED_PAGE], {});
      return;
    }
    else {
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouOsTc.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouOsTc.json";
    }
  }

  getEvent(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
  }
}