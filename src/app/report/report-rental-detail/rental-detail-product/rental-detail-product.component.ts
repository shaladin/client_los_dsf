import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-rental-detail-product',
  templateUrl: './rental-detail-product.component.html'
})
export class RentalDetailProductReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-detail/rental-detail-product-report.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportSync";    
  }

  ngOnInit() {
  }

}
