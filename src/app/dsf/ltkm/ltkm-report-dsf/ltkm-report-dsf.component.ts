import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-ltkm-report-dsf',
  templateUrl: './ltkm-report-dsf.component.html',
  styleUrls: ['./ltkm-report-dsf.component.css']
})
export class LtkmReportDsfComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/dsf/ucreport/ReportLTKM.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/v1/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
