import { Component, OnInit } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-lead-view',
  templateUrl: './lead-view.component.html'
})

export class LeadViewComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor() { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewLeadHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
    ];
  }
}
