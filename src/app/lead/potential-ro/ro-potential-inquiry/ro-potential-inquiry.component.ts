import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-ro-potential-inquiry',
  templateUrl: './ro-potential-inquiry.component.html'
})
export class RoPotentialInquiryComponent implements OnInit {

  constructor(private http: HttpClient, private adInsHelperService: AdInsHelperService) { }

  inputPagingObj: UcPagingObj = new UcPagingObj();

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchRoPotentialInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchRoPotentialInquiry.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "ROP.RO_POTENTIAL_LAST_STEP",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "ROP.RO_POTENTIAL_STAT",
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
