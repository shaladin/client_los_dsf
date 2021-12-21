import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { MouCustCompanyMgmntShrholderObj } from 'app/shared/model/mou-cust-company-mgmnt-shrholder-obj.model';

@Component({
  selector: 'app-mou-view-customer-mgmnt-shrholder',
  templateUrl: './mou-view-customer-mgmnt-shrholder.component.html'
})
export class MouViewCustomerMgmntShrholderComponent implements OnInit {

  @Input() listShareholder: Array<MouCustCompanyMgmntShrholderObj> = new Array<MouCustCompanyMgmntShrholderObj>();
  
  CustTypeObj: Array<KeyValueObj>;
  
  constructor(private http: HttpClient) { }

  ngOnInit() { 
  }

}
