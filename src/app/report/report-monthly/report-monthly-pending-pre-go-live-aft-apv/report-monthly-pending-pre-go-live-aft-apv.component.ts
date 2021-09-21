import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-report-monthly-pending-pre-go-live-aft-apv',
  templateUrl: './report-monthly-pending-pre-go-live-aft-apv.component.html'
})
export class ReportMonthlyPendingPreGoLiveAftApvComponent implements OnInit {
  inputReportObj: InputReportObj = new InputReportObj();
  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/monthly/ReportMonthlyPendingPreGoLiveAftApv.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }
  ngOnInit() {
  }

}
