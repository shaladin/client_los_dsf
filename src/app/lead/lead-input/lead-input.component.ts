import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-lead-input',
  templateUrl: './lead-input.component.html',
})
export class LeadInputComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  readonly AddLink: string = NavigationConstant.LEAD_INPUT_MAIN_INFO;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchLead.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLead.json";
  }
}