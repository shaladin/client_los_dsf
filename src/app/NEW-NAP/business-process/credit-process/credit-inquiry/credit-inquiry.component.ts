import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReqByCustNoObj } from 'app/shared/model/Request/ReqByCustNoObj.model';

@Component({
  selector: 'app-credit-inquiry',
  templateUrl: './credit-inquiry.component.html'
})
export class CreditInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: ReqByCustNoObj = new ReqByCustNoObj();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditProcessInquiry.json";
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
  openView(ev) {
    if (ev.Key == "application") {
      AdInsHelper.OpenAppViewByAppId(ev.RowObj.AppId);
    }
    else if (ev.Key == "customer") {
      this.CustNoObj.CustNo = ev.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        (response) => {
          AdInsHelper.OpenCustomerViewByCustId(response['CustId']);
        }
      )
    }
    else if (ev.Key == "agreement") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.agrmntId);
    }
  }
}
