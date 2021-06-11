import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';

@Component({
  selector: 'app-credit-inquiry',
  templateUrl: './credit-inquiry.component.html'
})
export class CreditInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditProcessInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditProcessInquiry.json";
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
