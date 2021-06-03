import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-lead-inquiry',
  templateUrl: './lead-inquiry.component.html'
})
export class LeadInquiryComponent implements OnInit {
  inputPagingObj : UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchLeadInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLeadInquiry.json";
  }

}
