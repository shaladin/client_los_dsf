import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-afternoonmonitoring',
  templateUrl: './afternoonmonitoring.component.html',
  styleUrls: ['./afternoonmonitoring.component.css']
})
export class AfternoonmonitoringComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/ucreport/ReportFactAfternoonMonitoring.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
