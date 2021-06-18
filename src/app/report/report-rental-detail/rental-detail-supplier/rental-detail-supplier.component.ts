import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-rental-detail-supplier',
  templateUrl: './rental-detail-supplier.component.html'
})
export class RentalDetailSupplierReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-detail/rental-detail-supplier-report.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3"; 
  }

  ngOnInit() {
  }

}
