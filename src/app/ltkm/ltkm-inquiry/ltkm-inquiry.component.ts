import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-ltkm-inquiry',
  templateUrl: './ltkm-inquiry.component.html'
})
export class LtkmInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj;

  constructor() { }

  ngOnInit() {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchLtkmInquiry.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLtkmInquiry.json";
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
  }
}
