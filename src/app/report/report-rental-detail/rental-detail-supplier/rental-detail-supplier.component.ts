import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-rental-detail-supplier',
  templateUrl: './rental-detail-supplier.component.html'
})
export class RentalDetailSupplierReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-detail/rental-detail-supplier-report.json";
    this.inputReportObj.EnvironmentUrl = environment.FoundationR3Url;
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";  
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
