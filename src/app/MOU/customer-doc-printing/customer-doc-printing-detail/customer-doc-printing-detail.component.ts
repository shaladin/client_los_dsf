import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-doc-printing-detail',
  templateUrl: './customer-doc-printing-detail.component.html',
  styleUrls: ['./customer-doc-printing-detail.component.css']
})
export class CustomerDocPrintingDetailComponent implements OnInit {
  viewObj: string;

  constructor() { }

  ngOnInit(): void {
    this.viewObj = "./assets/ucviewgeneric/viewCustomerDocPrinting.json";
  }

}
