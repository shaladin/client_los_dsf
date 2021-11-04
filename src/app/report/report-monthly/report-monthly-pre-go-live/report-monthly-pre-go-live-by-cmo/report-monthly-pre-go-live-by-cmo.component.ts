import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';

@Component({
  selector: 'app-report-monthly-pre-go-live-by-cmo',
  templateUrl: './report-monthly-pre-go-live-by-cmo.component.html'
})
export class ReportMonthlyPreGoLiveByCmoComponent implements OnInit {
  inputReportObj: InputReportObj = new InputReportObj();
  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/monthly/ReportMonthlyPreGoLiveByCMO.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }

  ngOnInit() {
  }

}
