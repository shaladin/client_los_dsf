import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-credit-inquiry',
  templateUrl: './credit-inquiry.component.html',
  styleUrls: []
})
export class CreditInquiryComponent implements OnInit {

  constructor(private http: HttpClient) { }

  inputPagingObj;
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchCreditProcessInquiry.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditProcessInquiry.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "ISNULL(AGR.AGRMNT_LAST_STEP,A.APP_LAST_STEP)",
        environment: environment.FoundationR3Url
      },
      {
        name: "ISNULL(AGR.AGRMNT_CURR_STEP,A.APP_CURR_STEP)",
        environment: environment.FoundationR3Url
      },
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }
  openView(ev){
    if(ev.Key == "application"){
      AdInsHelper.OpenAppViewByAppId(ev.RowObj.AppId);
    }
    else if(ev.Key == "customer"){
      this.http.post(AdInsConstant.GetCustByCustNo, {CustNo: ev.RowObj.CustNo}).subscribe(
        (response)=>{
          AdInsHelper.OpenCustomerViewByCustId(response['CustId']);
        }
      )
    }
    else if(ev.Key == "agreement"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.agrmntId);
    }
  }
}
