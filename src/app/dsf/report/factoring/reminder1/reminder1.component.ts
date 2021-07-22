import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-reminder1',
  templateUrl: './reminder1.component.html',
  styleUrls: ['./reminder1.component.css']
})
export class Reminder1Component implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/ucreport/ReportFactReminder1.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
