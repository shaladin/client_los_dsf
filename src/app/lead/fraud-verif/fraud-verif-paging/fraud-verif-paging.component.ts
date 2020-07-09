import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-fraud-verif-paging',
  templateUrl: './fraud-verif-paging.component.html'
})
export class FraudVerifPagingComponent implements OnInit {

  constructor() { }
  inputPagingObj: UcPagingObj = new UcPagingObj();
  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchFraudVerif.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchFraudVerif.json";

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

}
