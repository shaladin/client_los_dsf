import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-report-daily-incoming-app',
  templateUrl: './report-daily-incoming-app.component.html'
})
export class ReportDailyIncomingAppComponent implements OnInit {
  inputReportObj: InputReportObj = new InputReportObj();
  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/daily-incoming/ReportDailyIncomingApp.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }
  ngOnInit() {
  }

}
