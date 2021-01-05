import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-os-tc-paging',
  templateUrl: './mou-os-tc-paging.component.html'
})
export class MouOsTcPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  user: any;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    if (this.user.MrOfficeTypeCode !=CommonConstant.HeadOffice ) {
      AdInsHelper.RedirectUrl(this.router,["/Mou/UnauthorizedPage"],{});
      return;
    }
    else {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouOsTc.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouOsTc.json";

      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MOU.MR_MOU_TYPE_CODE",
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