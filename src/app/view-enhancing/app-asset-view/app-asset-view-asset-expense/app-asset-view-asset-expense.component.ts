import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-app-asset-view-asset-expense',
  templateUrl: './app-asset-view-asset-expense.component.html',
  styleUrls: []
})
export class AppAssetViewAssetExpenseComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() BizTemplateCode: string;

  InsuranceObj: any;
  MaintenanceObj: any;
  ExpenseObj: any;
  FeeObj: any;

  InsuranceAmt: number = 0;
  MaintenanceAmt: number = 0;
  ExpenseAmt: number = 0;
  FeeAmt: number = 0;
  VatAmt: number = 0;
  FeeCapitalizedAmt: number = 0;
  AssetExpenseAmt: number = 0;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.GetAllAssetExpenseData();
  }

  async GetAllAssetExpenseData() {
    var requestAppAssetId = {
      Id: this.AppAssetId
    };

    await this.http.post(URLConstant.GetAllAssetExpenseData, requestAppAssetId).toPromise().then(
      (response) => {
        this.InsuranceObj = response["InsuranceData"];
        this.InsuranceAmt = this.InsuranceObj.TotalPremi;

        this.MaintenanceObj = response["MaintenanceData"];
        this.MaintenanceAmt = this.MaintenanceObj.TotalServiceAmt + this.MaintenanceObj.TotalSparepartAmt;

        this.ExpenseObj = response["OtherExpensesData"];
        for(let i = 0; i < this.ExpenseObj.length; i++) {
          this.ExpenseAmt += this.ExpenseObj[i].OthExpenseAmt;
        }

        this.FeeObj = response["FeesData"];
        for(let j = 0; j < this.FeeObj.length; j++) {
          this.FeeAmt += this.FeeObj[j].FeeAmt;
          this.VatAmt += this.FeeObj[j].VatAmt
          this.FeeCapitalizedAmt += this.FeeObj[j].CapitalizedAmt;
        }

        this.AssetExpenseAmt = this.InsuranceAmt + this.MaintenanceAmt + this.ExpenseAmt + this.FeeCapitalizedAmt;
      }
    );
  }
}