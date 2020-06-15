import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-mou-os-tc-paging',
  templateUrl: './mou-os-tc-paging.component.html'
})
export class MouOsTcPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouOsTc.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    console.log(AdInsConstant.GetPagingObjectBySQL);
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouOsTc.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MOU.MOU_CUST_NO",
        environment: environment.FoundationR3Url
      }
    ];
  }
}