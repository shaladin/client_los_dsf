import { Component, Input, OnInit } from '@angular/core';
import { MouCustCompanyContactPersonObj } from 'app/shared/model/mou-cust-company-contact-person-obj.model';

@Component({
  selector: 'app-mou-view-customer-comp-contact-info',
  templateUrl: './mou-view-customer-comp-contact-info.component.html'
})
export class MouViewCustomerCompContactInfoComponent implements OnInit {

  @Input() listContactPersonCompany: Array<MouCustCompanyContactPersonObj> = new Array<MouCustCompanyContactPersonObj>();
  
  constructor() { }

  ngOnInit() {
  }

}
