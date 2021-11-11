import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-lead-input',
  templateUrl: './new-lead-input.component.html',
  styles: []
})
export class NewLeadInputComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() {

  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchNewLead.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchNewLead.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.losUrl + "/v1"
      }
    ];
  }

}
