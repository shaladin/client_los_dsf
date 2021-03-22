import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: "view-financial",
  templateUrl: "./view-financial.component.html"
})

export class ViewFinancialComponent implements OnInit {
  @Input() AppId: number = 0;
  @Input() BizTemplateCode: string;
  listAsset: Array<any> = new Array<any>();
  
  listSubsidy: Array<AppSubsidyObj> = new Array<AppSubsidyObj>();
  listAppFeeObj: Array<AppFeeObj> = new Array<AppFeeObj>();
  listInstallment: Array<InstallmentObj> = new Array<InstallmentObj>();
  
  appFinDataObj: AppFinDataObj = new AppFinDataObj();
  appObj: NapAppModel = new NapAppModel();

  TotalAssetValue: number;
  TotalRentAmt: number;
  TotalAssetResidualValuePrcnt: number;
  TotalAssetResidualValueAmt: number;
  TotalRentAfterVatAmt: number;
  TotalDepreciationPrcnt: number;
  TotalDepreciationAmt: number;
  GrossYieldPrcnt: number;
  TotalAssetExpense: number;
  TotalCostBeforeMargin: number;
  FeeNonCapitalized: number;
  TotalMarginPrcnt: number;
  TotalMarginAmt: number;
  TotalSecurityDepositAmt: number;
  TotalCostAfterMargin: number;
  TotalPaidInAdvance: number;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
  }

  async ngOnInit() {
    if(this.BizTemplateCode === "OPL") {
      await this.InitData();
      await this.GetListAllAssetFinancialData();
    }
    else {
      this.getFinancialData();
    }
  }

  async InitData() {
    this.TotalAssetValue = 0;
    this.TotalRentAmt = 0;
    this.TotalAssetResidualValuePrcnt = 0;
    this.TotalAssetResidualValueAmt = 0;
    this.TotalRentAfterVatAmt = 0;
    this.TotalDepreciationPrcnt = 0;
    this.TotalDepreciationAmt = 0;
    this.GrossYieldPrcnt = 0;
    this.TotalAssetExpense = 0;
    this.TotalCostBeforeMargin = 0;
    this.FeeNonCapitalized = 0;
    this.TotalMarginPrcnt = 0;
    this.TotalMarginAmt = 0;
    this.TotalSecurityDepositAmt = 0;
    this.TotalCostAfterMargin = 0;
    this.TotalPaidInAdvance = 0;
  }

  getFinancialData() {
    var reqObj = { Id: this.AppId };
    this.http.post(URLConstant.GetFinancialDataByAppIdForView, reqObj).subscribe(
      (response) => {
        this.listSubsidy = response["AppSubsidyObjs"];
        this.listAppFeeObj = response["AppFeeObjs"];
        this.appFinDataObj = response["AppFinDataObj"];
        this.appObj = response["AppObj"];
        this.listInstallment = response["InstallmentObjs"];
      }
    );
  }

  async GetListAllAssetFinancialData() {
    var requestAppId = {
      Id: this.AppId
    };

    await this.http.post(URLConstant.GetListAllAssetFinancialData, requestAppId).toPromise().then(
      (response) => {
        this.listAsset = response["ReturnObject"];

        if(this.listAsset !== null) {
          var length = this.listAsset.length;

          for(let i = 0; i < length; i++) {
            this.TotalAssetValue += this.listAsset[i].AssetValue;
            this.TotalRentAmt += this.listAsset[i].RentAmt;
            this.TotalAssetResidualValuePrcnt += this.listAsset[i].ResidualValuePrcnt;
            this.TotalAssetResidualValueAmt += this.listAsset[i].ResidualValueAmt;
            this.TotalRentAfterVatAmt += this.listAsset[i].RentAfterVatAmt;
            this.TotalDepreciationPrcnt += this.listAsset[i].DepreciationPrcnt;
            this.TotalDepreciationAmt += this.listAsset[i].DepreciationAmt;
            this.GrossYieldPrcnt += this.listAsset[i].GrossYieldPrcnt;
            this.TotalAssetExpense += this.listAsset[i].AssetExpense;
            this.TotalCostBeforeMargin += this.listAsset[i].TotalCostBeforeMargin;
            this.FeeNonCapitalized += this.listAsset[i].FeeNonCapitalized;
            this.TotalMarginPrcnt += this.listAsset[i].MarginPrcnt;
            this.TotalMarginAmt += this.listAsset[i].MarginAmt;
            this.TotalSecurityDepositAmt += this.listAsset[i].SecurityDepositAmt;
            this.TotalCostAfterMargin += this.listAsset[i].TotalCostAfterMargin;
            this.TotalPaidInAdvance += this.listAsset[i].TotalPaidInAdvance;
          }

          this.TotalAssetResidualValuePrcnt /= length;
          this.TotalDepreciationPrcnt /= length;
          this.GrossYieldPrcnt /= length;
          this.TotalMarginPrcnt /= length;
        }
      }
    );
  }
}
