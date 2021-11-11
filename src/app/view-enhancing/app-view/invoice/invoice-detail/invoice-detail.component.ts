import { Component, OnInit } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor() { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewInvoiceAgrmntInformation.json";
  }

}
