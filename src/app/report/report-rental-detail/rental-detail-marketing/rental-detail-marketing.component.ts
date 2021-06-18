import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-rental-detail-marketing',
  templateUrl: './rental-detail-marketing.component.html'
})
export class RentalDetailMarketingReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-detail/rental-detail-marketing-report.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";   
  }

  ngOnInit() {
  }

}
