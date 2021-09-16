import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-report-daily-pre-go-live-by-cmo',
  templateUrl: './report-daily-pre-go-live-by-cmo.component.html'
})
export class ReportDailyPreGoLiveByCmoComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/ucreport/daily-pre-go-live/ReportDailyPreGoLiveByCMO.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
