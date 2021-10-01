import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-plafond-factoring-dsf',
  templateUrl: './plafond-factoring-dsf.component.html',
  styleUrls: ['./plafond-factoring-dsf.component.css']
})
export class PlafondFactoringDsfComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/dsf/ucreport/ReportPlafondFactDsf.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/v1/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
