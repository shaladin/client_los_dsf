import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-credit-process-inquiry',
  templateUrl: './credit-process-inquiry.component.html'
})
export class CreditProcessInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditProcessInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditProcessInquiry.json";
  }
}
