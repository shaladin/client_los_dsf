import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { HttpClient } from '@angular/common/http';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-ro-telemk-offer-paging',
  templateUrl: './ro-telemk-offer-paging.component.html'
})
export class RoTelemkOfferPagingComponent implements OnInit {

  constructor(private http: HttpClient, private adInsHelperService: AdInsHelperService) { }

  inputPagingObj: UcPagingObj = new UcPagingObj();

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchRoTelemkOffer.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchRoTelemkOffer.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "L.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];
  }

  openView(ev) {
    if (ev.Key == "customer") {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: ev.RowObj.CustNo }).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      )
    }
  }
}
