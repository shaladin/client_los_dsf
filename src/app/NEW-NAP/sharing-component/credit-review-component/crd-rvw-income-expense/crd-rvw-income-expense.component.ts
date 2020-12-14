import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crd-rvw-income-expense',
  templateUrl: './crd-rvw-income-expense.component.html',
  styleUrls: ['./crd-rvw-income-expense.component.scss']
})
export class CrdRvwIncomeExpenseComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;

  constructor() { }

  ngOnInit() {
  }

}
