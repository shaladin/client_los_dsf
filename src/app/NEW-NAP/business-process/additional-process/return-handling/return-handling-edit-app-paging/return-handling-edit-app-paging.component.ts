import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-return-handling-edit-app-paging',
  templateUrl: './return-handling-edit-app-paging.component.html',
  styleUrls: ['./return-handling-edit-app-paging.component.scss']
})
export class ReturnHandlingEditAppPagingComponent implements OnInit {

  constructor() { }
  
  inputPagingObj;
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingApp.json";
    this.inputPagingObj.addCritInput = new Array();
  }

}
