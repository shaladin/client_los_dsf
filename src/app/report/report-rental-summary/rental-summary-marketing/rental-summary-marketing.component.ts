import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-rental-summary-marketing',
  templateUrl: './rental-summary-marketing.component.html'
})
export class RentalSummaryMarketingReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-summary/rental-summary-marketing-report.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportSync";    
  }

  ngOnInit() {
  }

}
