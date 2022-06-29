import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AppSubsidyProfitablityXObj } from 'app/impl/shared/model/AppSubsidyProfitablityXObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustInfoIncomeAndExpenseDetailsObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-income-and-expense-details-obj.model';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';

@Component({
  selector: 'app-crd-rvw-income-expense-x',
  templateUrl: './crd-rvw-income-expense-x.component.html'
})
export class CrdRvwIncomeExpenseXComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  @Input() appId: number = 0;
  @Input() crdRvwCustInfoIncomeAndExpenseDetailsObj: CrdRvwCustInfoIncomeAndExpenseDetailsObj = new CrdRvwCustInfoIncomeAndExpenseDetailsObj();

  constructor(
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    await this.GetAppSubsidyProfitablityXObj();
    await this.SetTotalIncome();
    await this.SetTacAmt();
  }

  //#region Set Data
  totalIncomeAmt: number = 0;
  SetTotalIncome() {
    this.totalIncomeAmt = this.crdRvwCustInfoIncomeAndExpenseDetailsObj.InsAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.LifeInsAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.SubsidyRateAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.TotalInterestAmt;
    for (let index = 0; index < this.crdRvwCustInfoIncomeAndExpenseDetailsObj.ListAppFeeObj.length; index++) {
      const element = this.crdRvwCustInfoIncomeAndExpenseDetailsObj.ListAppFeeObj[index];
      this.totalIncomeAmt += element.AppFeeAmt;
    }
    for (let index = 0; index < this.ListAppSubsidyProfitablityXObj.length; index++) {
      const element = this.ListAppSubsidyProfitablityXObj[index];
      this.totalIncomeAmt += element.SubsidyAmt;
    }
  }

  tacAmt: number = 0;
  SetTacAmt() {
    this.tacAmt = this.crdRvwCustInfoIncomeAndExpenseDetailsObj.CommissionAmt + this.crdRvwCustInfoIncomeAndExpenseDetailsObj.ReserveFundAmt;
  }
  //#endregion

  ListAppSubsidyProfitablityXObj : Array<AppSubsidyProfitablityXObj> = new  Array<AppSubsidyProfitablityXObj>();
  async GetAppSubsidyProfitablityXObj() {
    await this.http.post<AppSubsidyProfitablityXObj>(URLConstantX.GetListAppSubsidyProfitabilityXForViewByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.ListAppSubsidyProfitablityXObj= response["ListObjs"];
      }
    );
  }
}