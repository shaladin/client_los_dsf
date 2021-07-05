import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CookieService } from "ngx-cookie";

@Component({
  selector: 'app-change-mou-inquiry',
  templateUrl: './change-mou-inquiry.component.html',
  styleUrls: []
})
export class ChangeMouInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  user: CurrentUserContext;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchChangeMouInquiry.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
      this.inputPagingObj.deleteUrl = "";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchChangeMouInquiry.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        },
        {
          name: "MOU_STAT",
          environment: environment.FoundationR3Url
        }
      ];
  }
  getEvent(event){
    if(event.Key == "customer"){
        var custObj = { CustNo: event.RowObj.CustNo };
        this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
              AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
            }
            if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
              AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
            }
          }
        );
    }
  }
}
