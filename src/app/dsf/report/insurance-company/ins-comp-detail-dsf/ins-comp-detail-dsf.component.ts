import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-ins-comp-detail-dsf',
  templateUrl: './ins-comp-detail-dsf.component.html',
  styleUrls: ['./ins-comp-detail-dsf.component.css']
})
export class InsCompDetailDsfComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/dsf/ucreport/ReportInsCompDetailDsf.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
