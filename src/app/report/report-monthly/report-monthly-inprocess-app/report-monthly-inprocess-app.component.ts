import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';

@Component({
  selector: 'app-report-monthly-inprocess-app',
  templateUrl: './report-monthly-inprocess-app.component.html'
})
export class ReportMonthlyInprocessAppComponent implements OnInit {
  inputReportObj: InputReportObj = new InputReportObj();
  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/monthly/ReportMonthlyInProcessApp.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }
  ngOnInit() {
  }

}
