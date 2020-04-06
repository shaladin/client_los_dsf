import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-customer-data',
  templateUrl: './view-customer-data.component.html',
  styleUrls: ['./view-customer-data.component.scss']
})
export class ViewCustomerDataComponent implements OnInit {

  constructor() { }
  viewLeadCustomerPersonalMaindata : any;

  ngOnInit() {
    
    this.viewLeadCustomerPersonalMaindata = "./assets/ucviewgeneric/viewLeadCustomerPersonal.json";
  }

}
