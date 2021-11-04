import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';

@Component({
  selector: 'app-report-daily-incoming-lead',
  templateUrl: './report-daily-incoming-lead.component.html'
})
export class ReportDailyIncomingLeadComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/daily-incoming/ReportDailyIncomingLead.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }

  ngOnInit() {
  }

}
