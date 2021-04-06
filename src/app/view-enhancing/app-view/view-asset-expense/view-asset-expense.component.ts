import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
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
      Id: this.AppId
    };

    await this.http.post(URLConstant.GetListAllAssetExpenseData, requestAppId).toPromise().then(
      (response) => {
        if(response[CommonConstant.ReturnObj].length > 0) {
          this.listAsset = response[CommonConstant.ReturnObj];
          
          for(let i = 0; i < this.listAsset.length; i++) {
            this.InsuranceObj = this.listAsset[i].InsuranceData;
            this.listAsset[i].TotalInsuranceAmt = this.InsuranceObj.TotalPremi;
  
            this.MaintenanceObj = this.listAsset[i].MaintenanceData;
            this.listAsset[i].TotalMaintenanceAmt = this.MaintenanceObj.TotalServiceAmt + this.MaintenanceObj.TotalSparepartAmt;
  
            this.ExpenseObj = this.listAsset[i].OtherExpensesData;
            if(this.ExpenseObj.length > 0) {
              for(let j = 0; j < this.ExpenseObj.length; j++) {
                this.listAsset[i].TotalExpenseAmt += this.ExpenseObj[j].OthExpenseAmt;
              }
            }
  
            this.FeeObj = this.listAsset[i].FeesData;
            if(this.FeeObj.length > 0) {
              for(let k = 0; k < this.FeeObj.length; k++) {
                this.listAsset[i].TotalFeeAmt += this.FeeObj[k].CapitalizedAmt;
              }
            }
  
            this.listAsset[i].TotalAssetExpenseAmt = this.listAsset[i].TotalInsuranceAmt + this.listAsset[i].TotalMaintenanceAmt + this.listAsset[i].TotalExpenseAmt + this.listAsset[i].TotalFeeAmt;
          }
        }
      }
    );
  }
}