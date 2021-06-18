import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-report-app-pending',
  templateUrl: './report-app-pending.component.html'
})
export class ReportAppPendingComponent implements OnInit {
  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/report-app-pending.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";    
  }

  ngOnInit() {
  }

}
