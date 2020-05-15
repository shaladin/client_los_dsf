import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

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
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchFraudVerif.json";
  }

}
