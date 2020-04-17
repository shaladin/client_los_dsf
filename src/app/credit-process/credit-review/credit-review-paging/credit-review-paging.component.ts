import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-credit-review-paging',
  templateUrl: './credit-review-paging.component.html',
  styleUrls: ['./credit-review-paging.component.scss']
})
export class CreditReviewPagingComponent implements OnInit {

  constructor() { }
  
  inputPagingObj;
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchCreditReview.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    // this.inputPagingObj.deleteUrl = "/RefBank/DeleteRefBank";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditReview.json";
  }

}
