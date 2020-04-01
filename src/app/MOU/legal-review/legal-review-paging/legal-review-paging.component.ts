import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-legal-review-paging',
  templateUrl: './legal-review-paging.component.html',
  styleUrls: ['./legal-review-paging.component.scss']
})
export class LegalReviewPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;

  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchLegalReview.json";
    // this.inputPagingObj.enviromentUrl = "http://localhost:5000";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLegalReview.json";
  }

}
