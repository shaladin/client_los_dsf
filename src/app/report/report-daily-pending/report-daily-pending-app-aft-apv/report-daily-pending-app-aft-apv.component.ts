import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-report-daily-pending-app-aft-apv',
  templateUrl: './report-daily-pending-app-aft-apv.component.html'
})
export class ReportDailyPendingAppAftApvComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/daily-pending/ReportDailyPendingAppAftApv.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }
  ngOnInit() {
  }

}
