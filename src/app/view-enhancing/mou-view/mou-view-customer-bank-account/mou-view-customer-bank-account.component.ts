import { Component, Input, OnInit } from '@angular/core';
import { MouCustBankAccObj } from 'app/shared/model/mou-cust-bank-acc-obj.model';

@Component({
  selector: 'app-mou-view-customer-bank-account',
  templateUrl: './mou-view-customer-bank-account.component.html'
})
export class MouViewCustomerBankAccountComponent implements OnInit {

  @Input() listBankAcc: Array<MouCustBankAccObj> = new Array<MouCustBankAccObj>();
  
  constructor() { }

  ngOnInit() {
  }

}
