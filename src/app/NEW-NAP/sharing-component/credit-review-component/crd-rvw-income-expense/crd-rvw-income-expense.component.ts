import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustInfoIncomeAndExpenseDetailsObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoIncomeAndExpenseDetailsObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';

@Component({
  selector: 'app-crd-rvw-income-expense',
  templateUrl: './crd-rvw-income-expense.component.html',
  styleUrls: ['./crd-rvw-income-expense.component.scss']
})
export class CrdRvwIncomeExpenseComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  @Input() crdRvwCustInfoIncomeAndExpenseDetailsObj: CrdRvwCustInfoIncomeAndExpenseDetailsObj = new CrdRvwCustInfoIncomeAndExpenseDetailsObj();

  constructor(
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    this.SetTotalIncome();
    this.SetTacAmt();
  }

  //#region Set Data
  totalIncomeAmt: number = 0;
  SetTotalIncome() {
    this.totalIncomeAmt = this.crdRvwCustInfoIncomeAndExpenseDetailsObj.InsAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.LifeInsAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.SubsidyRateAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.TotalInterestAmt;
    for (let index = 0; index < this.crdRvwCustInfoIncomeAndExpenseDetailsObj.ListAppFeeObj.length; index++) {
      const element = this.crdRvwCustInfoIncomeAndExpenseDetailsObj.ListAppFeeObj[index];
      this.totalIncomeAmt += element.AppFeeAmt;
    }
  }

  tacAmt: number = 0;
  SetTacAmt() {
    this.tacAmt = this.crdRvwCustInfoIncomeAndExpenseDetailsObj.CommissionAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.ReserveFundAmt;
  }
  //#endregion
}
