import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-rental-summary-supplier',
  templateUrl: './rental-summary-supplier.component.html'
})
export class RentalSummarySupplierReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-summary/rental-summary-supplier-report.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3"; 
  }

  ngOnInit() {
  }

}
