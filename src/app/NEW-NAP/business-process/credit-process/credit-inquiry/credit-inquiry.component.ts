import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';

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
    var key = ev.Key;
    var appId = ev.RowObj.AppId;
    var custNo = ev.RowObj.CustNo;
    var agrmntId = ev.RowObj.agrmntId;

    if(key == "application"){
      window.open( environment.losR3Web + "/Nap/View/AppView?AppId=" + appId, "_blank");
    }
    else if(key == "customer"){
      var custObj = {CustNo : custNo};
      this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
        (response)=>{
          window.open( environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response['CustId'], "_blank");
        }
      )
    }
    else if(key == "agreement"){
      window.open( environment.losR3Web + "/Nap/View/AgrmntView?AgrmntId=" + agrmntId, "_blank");
    }
  }
}
