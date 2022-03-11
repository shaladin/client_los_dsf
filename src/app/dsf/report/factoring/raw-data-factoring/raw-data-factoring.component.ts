import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-raw-data-factoring',
  templateUrl: './raw-data-factoring.component.html',
  styleUrls: ['./raw-data-factoring.component.css']
})
export class RawDataFactoringComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/dsf/ucreport/ReportFactRawDataFactoring.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/v1/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
