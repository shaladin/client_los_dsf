import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-morningmonitoring',
  templateUrl: './morningmonitoring.component.html',
  styleUrls: ['./morningmonitoring.component.css']
})
export class MorningmonitoringComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/ucreport/ReportFactMorningMonitoring.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
