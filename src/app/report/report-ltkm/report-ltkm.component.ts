import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-report-ltkm',
  templateUrl: './report-ltkm.component.html'
})
export class ReportLtkmComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/ucreport/report-ltkm/ReportLTKM.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/v1/Report/GenerateReportR3";
   }
  ngOnInit() {
  }

}
