import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-new-lead-input',
  templateUrl: './new-lead-input.component.html',
  styleUrls: ['./new-lead-input.component.css']
})
export class NewLeadInputDsfComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() {

  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchNewLeadDsf.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchNewLeadDsf.json";

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
