import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-app-asset-view-financial-data',
  templateUrl: './app-asset-view-financial-data.component.html',
  styleUrls: []
})
export class AppAssetViewFinancialDataComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() BizTemplateCode: string;
  
  RentalCalculationObj: any;

  RentAmtAndVat: number = 0;
  TotalRentAmtAndVat: number = 0;
  TotalAssetExpense: number = 0;
  FeeNonCapitalized: number = 0;
  TotalCostAfterMargin: number = 0;
  TotalPaidInAdvance: number = 0;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.GetRentalCalculation();
  }

  async GetRentalCalculation() {
    var requestAppAssetId = {
      Id: this.AppAssetId
    };

    await this.http.post(URLConstant.GetRentalCalculationData, requestAppAssetId).toPromise().then(
      (response) => {
        this.RentalCalculationObj = response;
        
        if(this.RentalCalculationObj !== null) {
          this.RentAmtAndVat = this.RentalCalculationObj.RentalAmt + this.RentalCalculationObj.RentalVatAmt;
          this.TotalRentAmtAndVat = this.RentalCalculationObj.Tenor * this.RentAmtAndVat;
          this.TotalAssetExpense = this.RentalCalculationObj.TotalInsuranceAmt + this.RentalCalculationObj.TotalMaintAmt + this.RentalCalculationObj.TotalOthExpenseAmt + this.RentalCalculationObj.TotalFeeAmt;
          this.FeeNonCapitalized = this.RentalCalculationObj.TotalFeeAmt - this.RentalCalculationObj.TotalFeeCapitalizedAmt;
          this.TotalCostAfterMargin = this.RentalCalculationObj.TotalCostBeforeMargin + this.RentalCalculationObj.MarginAmt;
          
          if(this.RentalCalculationObj.FirstInstType === "Advance") {
            this.TotalPaidInAdvance = this.FeeNonCapitalized + this.RentalCalculationObj.SecurityDepositAmt + this.RentAmtAndVat;
          }
          else if(this.RentalCalculationObj.FirstInstType === "Arrear") {
            this.TotalPaidInAdvance = this.FeeNonCapitalized + this.RentalCalculationObj.SecurityDepositAmt;
          }
        }
      }
    );
  }
}