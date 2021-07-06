import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.css']
})
export class CollateralComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/ucreport/ReportFactCollateral.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
