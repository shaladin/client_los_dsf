import { Component, Input, OnInit } from '@angular/core';
import { MouCustSocmedObj } from 'app/shared/model/mou-cust-socmed-obj.model';

@Component({
  selector: 'app-mou-view-customer-socmed',
  templateUrl: './mou-view-customer-socmed.component.html'
})
export class MouViewCustomerSocmedComponent implements OnInit {

  @Input() MouCustSocmedObjs: Array<MouCustSocmedObj>;
  
  constructor() { }

  ngOnInit() {
  }

}
