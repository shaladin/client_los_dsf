import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-mou-review-paging',
  templateUrl: './mou-review-paging.component.html',
})
export class MouReviewPagingComponent implements OnInit {
  inputPagingObj: any;
  arrCrit: any;
  
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouReview.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    console.log(AdInsConstant.GetPagingObjectBySQL);
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouReview.json";
  }
}
