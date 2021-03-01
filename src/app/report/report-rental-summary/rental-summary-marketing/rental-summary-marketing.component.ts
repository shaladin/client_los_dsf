import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/Report/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-rental-summary-marketing',
  templateUrl: './rental-summary-marketing.component.html'
})
export class RentalSummaryMarketingReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-summary/rental-summary-marketing-report.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportSync";    
    this.inputReportObj.ddlEnvironments = [
      {
        name: 'OfficeCode',
        environment: environment.FoundationR3Url
      }      
      
    ]   
  }

  ngOnInit() {
  }

}
