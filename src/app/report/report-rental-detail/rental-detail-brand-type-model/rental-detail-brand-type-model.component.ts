import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-rental-detail-brand-type-model',
  templateUrl: './rental-detail-brand-type-model.component.html'
})
export class RentalDetailBrandTypeModelReportComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/rental-detail/rental-detail-brand-type-model-report.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportSync"; 
  }

  ngOnInit() {
  }

}
