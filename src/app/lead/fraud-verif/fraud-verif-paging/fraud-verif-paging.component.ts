import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-fraud-verif-paging',
  templateUrl: './fraud-verif-paging.component.html'
})
export class FraudVerifPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchFraudVerif.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchFraudVerif.json";
  }
}
