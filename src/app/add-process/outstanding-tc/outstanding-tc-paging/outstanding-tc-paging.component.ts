import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-outstanding-tc-paging',
  templateUrl: './outstanding-tc-paging.component.html',
  styleUrls: ['./outstanding-tc-paging.component.scss']
})
export class OutstandingTcPagingComponent implements OnInit {
  inputPagingObj: any;
  
  constructor(){}
  
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchOutstandingTC.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchOutstandingTC.json";
  }
}
