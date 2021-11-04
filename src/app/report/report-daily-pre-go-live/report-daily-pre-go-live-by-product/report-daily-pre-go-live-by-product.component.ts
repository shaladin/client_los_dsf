import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';

@Component({
  selector: 'app-report-daily-pre-go-live-by-product',
  templateUrl: './report-daily-pre-go-live-by-product.component.html'
})
export class ReportDailyPreGoLiveByProductComponent implements OnInit {

  inputReportObj: InputReportObj = new InputReportObj();
  constructor() {
    this.inputReportObj.JsonPath = "./assets/ucreport/daily-pre-go-live/ReportDailyPreGoLiveByProduct.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
   }

  ngOnInit() {
  }

}
