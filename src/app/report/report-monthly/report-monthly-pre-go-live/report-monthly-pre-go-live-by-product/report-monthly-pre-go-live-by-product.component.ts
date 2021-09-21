import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-report-monthly-pre-go-live-by-product',
  templateUrl: './report-monthly-pre-go-live-by-product.component.html'
})

export class ReportMonthlyPreGoLiveByProductComponent implements OnInit {
  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/ucreport/monthly/ReportMonthlyPreGoLiveByProduct.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }

  ngOnInit() {
  }

}
