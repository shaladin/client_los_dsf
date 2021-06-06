import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-report-app-pending',
  templateUrl: './report-app-pending.component.html'
})
export class ReportAppPendingComponent implements OnInit {
  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/report-app-pending.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";    
    this.inputReportObj.ddlEnvironments = [
      {
        name: 'OfficeCode',
        environment: environment.FoundationR3Url
      },
      {
        name: 'AppCurrStep',
        environment: environment.FoundationR3Url
      }
    ]
  }

  ngOnInit() {
  }

}
