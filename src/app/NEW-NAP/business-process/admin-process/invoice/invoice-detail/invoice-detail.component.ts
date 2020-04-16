import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  viewObj: any;

  constructor() { }

  ngOnInit() {
  this.viewObj = "./assets/ucviewgeneric/viewInvoiceAgrmntInformation.json";
  }

}
