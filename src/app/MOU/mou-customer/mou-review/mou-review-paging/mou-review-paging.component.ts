import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-review-paging',
  templateUrl: './mou-review-paging.component.html',
})
export class MouReviewPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  user: any;
  link: string;
  
  constructor(private router: Router, private http:HttpClient) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    if (this.user.MrOfficeTypeCode != CommonConstant.HeadOffice) {
      AdInsHelper.RedirectUrl(this.router,["/Mou/UnauthorizedPage"],{});
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouReview.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouReview.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        }
      ];
    }
  }

  GetCallBack(event)
  {
    if(event.Key == "customer"){
      var custObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
              AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }
}
