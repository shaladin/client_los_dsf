import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ro-telemk-offer-paging',
  templateUrl: './ro-telemk-offer-paging.component.html'
})
export class RoTelemkOfferPagingComponent implements OnInit {

  constructor(private http: HttpClient) { }

  inputPagingObj: UcPagingObj = new UcPagingObj();

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchRoTelemkOffer.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchRoTelemkOffer.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.MR_CUST_TYPE_CODE",
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
