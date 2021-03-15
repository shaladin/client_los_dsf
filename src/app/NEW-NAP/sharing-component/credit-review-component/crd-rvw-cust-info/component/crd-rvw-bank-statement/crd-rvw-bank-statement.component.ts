import { Component, Input, OnInit } from '@angular/core';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';

@Component({
  selector: 'app-crd-rvw-bank-statement',
  templateUrl: './crd-rvw-bank-statement.component.html',
  styleUrls: ['./crd-rvw-bank-statement.component.scss']
})
export class CrdRvwBankStatementComponent implements OnInit {

  @Input() ListAppCustBankAccObjs: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  constructor() { }
  ngOnInit() {
  }

}
