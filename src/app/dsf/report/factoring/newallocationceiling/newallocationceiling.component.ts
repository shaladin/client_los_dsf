import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-newallocationceiling',
  templateUrl: './newallocationceiling.component.html',
  styleUrls: ['./newallocationceiling.component.css']
})
export class NewallocationceilingComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/dsf/ucreport/ReportFactNewAllocationCeiling.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/v1/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
