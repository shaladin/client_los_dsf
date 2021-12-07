import { Component, Input, OnInit } from '@angular/core';
import { MouCustPersonalContactPersonObj } from 'app/shared/model/mou-cust-personal-contact-person-obj.model';

@Component({
  selector: 'app-mou-view-customer-personal-contact-info',
  templateUrl: './mou-view-customer-personal-contact-info.component.html'
})
export class MouViewCustomerPersonalContactInfoComponent implements OnInit {

  @Input() listContactPersonPersonal: Array<MouCustPersonalContactPersonObj> = new Array<MouCustPersonalContactPersonObj>();
  
  constructor() { }

  ngOnInit() {
  }

}
