import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-fraud-detection-paging',
  templateUrl: './fraud-detection-paging.component.html',
  styleUrls: ['./fraud-detection-paging.component.scss']
})
export class FraudDetectionPagingComponent implements OnInit {
  inputPagingObj: any;

  constructor() { }

  ngOnInit() {
    this.inputPagingObj= new UcpagingModule();
    this.inputPagingObj._url="./assets/ucpaging/searchFraudDetection.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchFraudDetection.json";
  }

}
