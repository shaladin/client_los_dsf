import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-app-inquiry',
  templateUrl: './app-inquiry.component.html'
})
export class AppInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchAppInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppInquiry.json";
  }
}
