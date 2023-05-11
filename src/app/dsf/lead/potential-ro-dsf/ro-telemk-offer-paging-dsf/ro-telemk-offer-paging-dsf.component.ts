import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { HttpClient } from '@angular/common/http';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-ro-telemk-offer-paging-dsf',
  templateUrl: './ro-telemk-offer-paging-dsf.component.html'
})
export class RoTelemkOfferPagingDsfComponent implements OnInit {

  constructor(private http: HttpClient, private adInsHelperService: AdInsHelperService) { }

  inputPagingObj: UcPagingObj = new UcPagingObj();

  ngOnInit() {
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchRoTelemkOfferDsf.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchRoTelemkOfferDsf.json";
    // Self Custom Changes
    this.inputPagingObj.listEnvironments.push({environment:"LOS_DSF", url: environment.losUrl});
    // End Self Custom Changes

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
