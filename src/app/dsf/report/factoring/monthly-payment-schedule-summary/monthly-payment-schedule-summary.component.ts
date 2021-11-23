import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-monthly-payment-schedule-summary',
  templateUrl: './monthly-payment-schedule-summary.component.html',
  styleUrls: ['./monthly-payment-schedule-summary.component.css']
})
export class MonthlyPaymentScheduleSummaryComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/dsf/ucreport/ReportFactMonthlyPaymentScheduleSummaryDsf.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/v1/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
