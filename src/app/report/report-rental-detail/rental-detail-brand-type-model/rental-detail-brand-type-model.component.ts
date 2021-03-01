import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/Report/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-rental-detail-brand-type-model',
  templateUrl: './rental-detail-brand-type-model.component.html'
})
export class RentalDetailBrandTypeModelReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-detail/rental-detail-brand-type-model-report.json";
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
