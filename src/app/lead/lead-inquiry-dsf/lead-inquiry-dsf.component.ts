import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';

@Component({
  selector: 'app-lead-inquiry-dsf',
  templateUrl: './lead-inquiry-dsf.component.html'
})
export class LeadInquiryDsfComponent implements OnInit {
  inputPagingObj : UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchLeadInquiryDsf.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLeadInquiryDsf.json";
  }

}
