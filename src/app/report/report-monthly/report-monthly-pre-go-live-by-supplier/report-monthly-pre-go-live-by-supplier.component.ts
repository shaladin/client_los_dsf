import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/input-report-obj.model';

@Component({
  selector: 'app-report-monthly-pre-go-live-by-supplier',
  templateUrl: './report-monthly-pre-go-live-by-supplier.component.html'
})
export class ReportMonthlyPreGoLiveBySupplierComponent implements OnInit {
  inputReportObj: InputReportObj = new InputReportObj();
  constructor() { 
    this.inputReportObj.JsonPath = "./assets/ucreport/monthly/ReportMonthlyPreGoLiveBySupplier.json";
    this.inputReportObj.ApiReportPath = "/Report/GenerateReportR3";
  }
  ngOnInit() {
  }

}
