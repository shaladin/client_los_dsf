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
  selector: 'app-change-mou-inquiry-x',
  templateUrl: './change-mou-inquiry-x.component.html',
  styleUrls: []
})
export class ChangeMouInquiryXComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  user: CurrentUserContext;

  constructor( private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchChangeMouInquiryX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchChangeMouInquiryX.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url + "/v1"
        },
        {
          name: "STATUS",
          environment: environment.FoundationR3Url + "/v1"
        }
      ];
  }
  getEvent(event){
    let custId: number;
    let mrCustTypeCode: string;
    if (event.Key == "customer") {
     let CustNoObj = { CustNo : event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
        (response) => {
          custId = response['CustId'];
          mrCustTypeCode = response['MrCustTypeCode'];

          if(mrCustTypeCode == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(custId);
          }
          
          if(mrCustTypeCode == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(custId);
          }
        });
    }
  }
}
