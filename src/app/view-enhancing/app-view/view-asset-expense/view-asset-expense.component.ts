import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-asset-expense',
  templateUrl: './view-asset-expense.component.html',
  styleUrls: []
})
export class ViewAssetExpenseComponent implements OnInit {
  @Input() AppId: number = 0;
  listAsset: Array<any> = new Array<any>();

  InsuranceObj: any;
  MaintenanceObj: any;
  ExpenseObj: any;
  FeeObj: any;

  constructor(private route: ActivatedRoute,
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
     if (params['AppId'] != null) {
       this.AppId = params['AppId'];
     }
    });
  }

  async ngOnInit() {
    await this.GetListAllAssetExpenseData();
  }

  async GetListAllAssetExpenseData() {
    var requestAppId = {
      AppId: this.AppId
    };

    await this.http.post(URLConstant.GetListAllAssetExpenseData, requestAppId).toPromise().then(
      (response) => {
        this.listAsset = response["ReturnObject"];
        for(let i = 0; i < this.listAsset.length; i++) {
          this.InsuranceObj = response["InsuranceData"];
          this.listAsset[i].TotalInsuranceAmt = this.InsuranceObj.TotalPremi;

          this.MaintenanceObj = response["MaintenanceData"];
          this.listAsset[i].TotalMaintenanceAmt = this.MaintenanceObj.TotalServiceAmt + this.MaintenanceObj.TotalSparepartAmt;

          this.ExpenseObj = response["OtherExpensesData"];
          for(let i = 0; i < this.ExpenseObj.length; i++) {
            this.listAsset[i].TotalExpenseAmt += this.ExpenseObj[i].OthExpenseAmt;
          }

          this.FeeObj = response["FeesData"];
          for(let j = 0; j < this.FeeObj.length; j++) {
            this.listAsset[i].TotalFeeAmt += this.FeeObj[j].CapitalizedAmt;
          }

          this.listAsset[i].TotalAssetExpenseAmt = this.listAsset[i].TotalInsuranceAmt + this.listAsset[i].TotalMaintenanceAmt + this.listAsset[i].TotalExpenseAmt + this.listAsset[i].TotalFeeAmt;
        }
      }
    );
  }
}