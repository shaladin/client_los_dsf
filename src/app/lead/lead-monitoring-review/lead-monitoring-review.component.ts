import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from '@adins/ucupload/lib/models/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-lead-monitoring-review',
  templateUrl: './lead-monitoring-review.component.html',
  styles: []
})
export class LeadMonitoringReviewComponent implements OnInit {
  inputPagingObj: UcPagingObj

  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReviewUploadNegativeAsset.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReviewUploadNegativeAsset.json";
  }

}
