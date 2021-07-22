import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-ro-potential-inquiry',
  templateUrl: './ro-potential-inquiry.component.html'
})
export class RoPotentialInquiryComponent implements OnInit {

  constructor(private http: HttpClient) { }

  inputPagingObj: UcPagingObj = new UcPagingObj();

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchRoPotentialInquiry.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchRoPotentialInquiry.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "ROP.RO_POTENTIAL_LAST_STEP",
        environment: environment.FoundationR3Url
      },
      {
        name: "ROP.RO_POTENTIAL_STAT",
        environment: environment.FoundationR3Url
      }
    ];
  }

  openView(ev) {
    if (ev.Key == "customer") {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: ev.RowObj.CustNo }).subscribe(
        (response) => {
          AdInsHelper.OpenCustomerViewByCustId(response['CustId']);
        }
      )
    }
  }
}
