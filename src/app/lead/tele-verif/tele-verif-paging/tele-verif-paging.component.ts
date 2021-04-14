import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-tele-verif-paging',
  templateUrl: './tele-verif-paging.component.html'
})
export class TeleVerifPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchTeleVerif.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchTeleVerif.json";
    this.inputPagingObj.deleteUrl = "";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }

}
