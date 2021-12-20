import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';

@Component({
  selector: 'app-ltkm-inquiry',
  templateUrl: './ltkm-inquiry.component.html'
})
export class LtkmInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  CustNoObj: GenericObj = new GenericObj();

  constructor(private http: HttpClient, private adInsHelperService: AdInsHelperService) { }

  ngOnInit() {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchLtkmInquiry.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLtkmInquiry.json";
      if (environment.isCore) {
        this.inputPagingObj._url = "./assets/ucpaging/V2/searchLtkmInquiryV2.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchLtkmInquiryV2.json";
      }
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "LC.MR_CUST_TYPE_CODE",
          environment: environment.FoundationR3Url + "/v1"
        },
        {
          name: "LR.LTKM_STEP",
          environment: environment.FoundationR3Url + "/v1"
        }
      ];
  }
  getEvent(event){
    if(event.Key == "ltkmno"){
        AdInsHelper.OpenLtkmViewByLtkmCustId(event.RowObj.LtkmCustId);
    } else if (event.Key == "appno") {
      if (event.RowObj.AppId != 0) {
        AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
      }
    }
    else if (event.Key == "customer"){
      this.CustNoObj.CustNo = event.RowObj.CustNo;      
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }
}
