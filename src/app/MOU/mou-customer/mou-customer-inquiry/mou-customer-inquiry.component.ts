import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-mou-customer-inquiry',
  templateUrl: './mou-customer-inquiry.component.html'
})
export class MouCustomerInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  user:any;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    if (this.user.MrOfficeTypeCode !=CommonConstant.HeadOffice ) {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_UNAUTHORIZED_PAGE],{});
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCustomerInquiry.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
      this.inputPagingObj.deleteUrl = "";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCustomerInquiry.json";
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
  }
  getEvent(event){
    if(event.Key == "customer"){
        var link : string;
        var custObj = { CustNo: event.RowObj.CustNo };
        this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
        );
    }
  }
}
