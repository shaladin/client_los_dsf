import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from "@angular/common";

@Component({
  selector: 'app-return-handling-phone-verif-paging',
  templateUrl: './return-handling-phone-verif-paging.component.html',
  providers: [DecimalPipe]
})
export class ReturnHandlingPhoneVerifPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingPhnVerif.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingPhnVerif.json";
    this.inputPagingObj.addCritInput = new Array();
  }
}
