import { Component, Input, OnInit } from '@angular/core';
import { MouCustCompanyFinDataObj } from 'app/shared/model/mou-cust-company-fin-data-obj.model';

@Component({
  selector: 'app-mou-view-customer-comp-fin-data',
  templateUrl: './mou-view-customer-comp-fin-data.component.html'
})
export class MouViewCustomerCompFinDataComponent implements OnInit {

  @Input() MouCustCompanyFinDataObj: MouCustCompanyFinDataObj = new MouCustCompanyFinDataObj();
  
  constructor() { }

  ngOnInit() {
  }

}
