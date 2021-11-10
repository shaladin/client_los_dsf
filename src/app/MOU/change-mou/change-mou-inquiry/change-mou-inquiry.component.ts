import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CookieService } from "ngx-cookie";
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-change-mou-inquiry',
  templateUrl: './change-mou-inquiry.component.html',
  styleUrls: []
})
export class ChangeMouInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  user: CurrentUserContext;

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService, 
    private adInsHelperService: AdInsHelperService) { }

  ngOnInit(): void {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchChangeMouInquiry.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchChangeMouInquiry.json";
  }
  getEvent(event){
    if (event.Key == "customer") {
     let CustNoObj = { CustNo : event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }
}
