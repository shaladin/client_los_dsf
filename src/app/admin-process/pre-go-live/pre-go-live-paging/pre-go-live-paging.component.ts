import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-pre-go-live-paging',
  templateUrl: './pre-go-live-paging.component.html',
  styleUrls: ['./pre-go-live-paging.component.scss']
})
export class PreGoLivePagingComponent implements OnInit {
  inputPagingObj: any;

  constructor() { }

  ngOnInit() {

    
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchPreGoLive.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPreGoLive.json";

  }

}
