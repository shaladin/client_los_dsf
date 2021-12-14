import { Component, Input, OnInit } from '@angular/core';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/app-cust-company-legal-doc-obj.model';

@Component({
  selector: 'app-mou-view-customer-comp-legal-doc',
  templateUrl: './mou-view-customer-comp-legal-doc.component.html'
})
export class MouViewCustomerCompLegalDocComponent implements OnInit {

  @Input() listLegalDoc: Array<AppCustCompanyLegalDocObj> = new Array<AppCustCompanyLegalDocObj>();
  
  constructor() { }

  ngOnInit() {
  }

}
