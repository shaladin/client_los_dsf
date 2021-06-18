import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-rental-summary-product',
  templateUrl: './rental-summary-product.component.html'
})
export class RentalSummaryProductReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-summary/rental-summary-product-report.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }

  ngOnInit() {
  }

}
