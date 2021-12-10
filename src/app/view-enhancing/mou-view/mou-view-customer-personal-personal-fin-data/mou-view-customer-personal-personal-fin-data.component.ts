import { Component, Input, OnInit } from '@angular/core';
import { MouCustPersonalFinDataObj } from 'app/shared/model/mou-cust-personal-fin-data-obj.model';

@Component({
  selector: 'app-mou-view-customer-personal-personal-fin-data',
  templateUrl: './mou-view-customer-personal-personal-fin-data.component.html'
})
export class MouViewCustomerPersonalPersonalFinDataComponent implements OnInit {

  @Input() MouCustPersonalFinDataObj: MouCustPersonalFinDataObj = new MouCustPersonalFinDataObj();
  @Input() MrMaritalStatCode: string;
  
  TotalMonthlyIncome: number;
  TotalMonthlyExpense: number;
  NettMonthlyIncome: number;
  
  constructor() { }

  ngOnInit() {
    this.setMouCustFinData();
  }

  setMouCustFinData(){
    this.TotalMonthlyIncome = this.MouCustPersonalFinDataObj.MonthlyIncomeAmt + this.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt;
    this.TotalMonthlyExpense = this.MouCustPersonalFinDataObj.MonthlyExpenseAmt + this.MouCustPersonalFinDataObj.MonthlyInstallmentAmt;
    this.NettMonthlyIncome = (this.MouCustPersonalFinDataObj.MonthlyIncomeAmt + this.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt)-(this.MouCustPersonalFinDataObj.MonthlyExpenseAmt + this.MouCustPersonalFinDataObj.MonthlyInstallmentAmt);
  }

}
