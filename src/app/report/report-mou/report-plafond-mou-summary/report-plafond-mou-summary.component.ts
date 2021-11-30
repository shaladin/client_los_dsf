import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';

@Component({
  selector: 'app-report-plafond-mou-summary',
  templateUrl: './report-plafond-mou-summary.component.html'
})
export class ReportPlafondMouSummaryComponent implements OnInit {
  inputReportObj: InputReportObj = new InputReportObj();
  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/report-mou/ReportPlafondMouSummary.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }
  ngOnInit() {
  }

}
