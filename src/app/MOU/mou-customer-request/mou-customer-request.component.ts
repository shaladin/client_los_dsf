import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';

@Component({
  selector: 'app-mou-customer-request',
  templateUrl: './mou-customer-request.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class MouCustomerRequestComponent implements OnInit {
  @ViewChild(UcpagingComponent) ucpaging;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  user: CurrentUserContext;

  readonly AddLink: string = NavigationConstant.MOU_REQ_DETAIL;
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchMouCustomerRequest.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputPagingObj.deleteUrl = "";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouCustomerRequest.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

  }

  customerView(ev) {
    var custId: number;
    this.CustNoObj.CustNo = ev.RowObj.CustNo;
    this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
      (response) => {
        custId = response['CustId'];
        AdInsHelper.OpenCustomerViewByCustId(custId);
      });
  }
}
