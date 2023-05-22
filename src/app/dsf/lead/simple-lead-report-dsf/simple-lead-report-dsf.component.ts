import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-simple-lead-report-dsf',
  templateUrl: './simple-lead-report-dsf.component.html'
})
export class SimpleLeadReportDsfComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/dsf/ucreport/ReportSimpleLead.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/v1/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
