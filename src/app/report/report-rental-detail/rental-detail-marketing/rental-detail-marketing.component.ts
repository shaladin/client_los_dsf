import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-rental-detail-marketing',
  templateUrl: './rental-detail-marketing.component.html'
})
export class RentalDetailMarketingReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-detail/rental-detail-marketing-report.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportSync";  
    this.inputReportObj.ddlEnvironments = [
      {
        name: 'OfficeCode',
        environment: environment.FoundationR3Url
      },
      {
        name: 'MarketingOff',
        environment: environment.FoundationR3Url
      }
    ]     
  }

  ngOnInit() {
  }

}
