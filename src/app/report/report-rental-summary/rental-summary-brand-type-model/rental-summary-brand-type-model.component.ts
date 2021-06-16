import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-rental-summary-brand-type-model',
  templateUrl: './rental-summary-brand-type-model.component.html'
})
export class RentalSummaryBrandTypeModelReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-summary/rental-summary-brand-type-model-report.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";   
  }

  ngOnInit() {
  }

}
