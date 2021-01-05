import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-bank-stmnt',
  templateUrl: './crd-rvw-bank-stmnt.component.html',
  styleUrls: ['./crd-rvw-bank-stmnt.component.scss']
})
export class CrdRvwBankStmntComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;

  constructor() { }

  ngOnInit() {
  }

}
