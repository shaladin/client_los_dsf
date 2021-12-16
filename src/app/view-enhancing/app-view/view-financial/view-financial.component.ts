import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppSubsidyObj } from 'app/shared/model/app-subsidy-obj.model';
import { AppFeeObj } from 'app/shared/model/app-fee-obj.model';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { InstallmentObj } from 'app/shared/model/app-fin-data/installment-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppDlrFncng } from 'app/shared/model/app-data/app-dlr-fncng.model';
import { AppFctrObj } from 'app/shared/model/app-fctr/app-fctr.model';

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
  appFctrObj: AppFctrObj = new AppFctrObj();

  //FIN DATA
  provisionFeeType: string = "-";
  calcBase: string = "-";
  calcMethod: string = "-";
  appDlrFncng: AppDlrFncng;
  instTypeDescr: string = "-";
  topCalcBased: string = "-";

  TotalAssetValue: number;
  TotalRentAmtPerPeriod: number;
  TotalAssetResidualValueAmt: number;
  TotalRentAfterVatAmt: number;
  TotalDepreciationAmt: number;
  TotalAssetExpense: number;
  TotalCostBeforeMargin: number;
  FeeNonCapitalized: number;
  TotalMarginAmt: number;
  TotalSecurityDepositAmt: number;
  TotalCostAfterMargin: number;
  TotalPaidInAdvance: number;
  TotalCofInterestAmt: number;

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
      await this.getFinancialData();
      if(this.BizTemplateCode === CommonConstant.FCTR) {
        await this.getAppFctrData();
      }
    }
  }

  async InitData() {
    this.TotalAssetValue = 0;
    this.TotalRentAmtPerPeriod = 0;
    this.TotalAssetResidualValueAmt = 0;
    this.TotalRentAfterVatAmt = 0;
    this.TotalDepreciationAmt = 0;
    this.TotalAssetExpense = 0;
    this.TotalCostBeforeMargin = 0;
    this.FeeNonCapitalized = 0;
    this.TotalMarginAmt = 0;
    this.TotalSecurityDepositAmt = 0;
    this.TotalCostAfterMargin = 0;
    this.TotalPaidInAdvance = 0;
    this.TotalCofInterestAmt = 0;
  }

  async getFinancialData() {
    var reqObj = { Id: this.AppId };
    await this.http.post(URLConstant.GetFinancialDataByAppIdForView, reqObj).toPromise().then(
      async (response) => {
        this.listSubsidy = response["AppSubsidyObjs"];
        this.listAppFeeObj = response["AppFeeObjs"];
        this.appFinDataObj = response["AppFinDataObj"];
        this.appObj = response["AppObj"];
        this.listInstallment = response["InstallmentObjs"];
        if (this.appObj.BizTemplateCode == CommonConstant.DF) {
          await this.getDataForDF(this.appFinDataObj)
        }
      }
    );
  }

  async getAppFctrData() {
    let reqObj = { Id: this.AppId };
    await this.http.post(URLConstant.GetAppFctrByAppId, reqObj).toPromise().then(
      (response: AppFctrObj) => {
        this.appFctrObj = response;
      }
    )
  }

  async GetListAllAssetFinancialData() {
    var requestAppId = {
      Id: this.AppId
    };

    await this.http.post(URLConstant.GetListAllAssetFinancialData, requestAppId).toPromise().then(
      (response) => {
        if(response[CommonConstant.ReturnObj].length > 0) {
          this.listAsset = response[CommonConstant.ReturnObj];

          for(let i = 0; i < this.listAsset.length; i++) {
            this.TotalAssetValue += this.listAsset[i].AssetValue;
            this.TotalRentAmtPerPeriod += this.listAsset[i].RentAmt;
            this.TotalAssetResidualValueAmt += this.listAsset[i].ResidualValueAmt;
            this.TotalRentAfterVatAmt += this.listAsset[i].RentAfterVatAmt;
            this.TotalDepreciationAmt += this.listAsset[i].DepreciationAmt;
            this.TotalAssetExpense += this.listAsset[i].AssetExpense;
            this.TotalCostBeforeMargin += this.listAsset[i].TotalCostBeforeMargin;
            this.FeeNonCapitalized += this.listAsset[i].FeeNonCapitalized;
            this.TotalMarginAmt += this.listAsset[i].MarginAmt;
            this.TotalSecurityDepositAmt += this.listAsset[i].SecurityDepositAmt;
            this.TotalCostAfterMargin += this.listAsset[i].TotalCostAfterMargin;
            this.TotalPaidInAdvance += this.listAsset[i].TotalPaidInAdvance;
            this.TotalCofInterestAmt += this.listAsset[i].CofInterestAmt;
          }
        }
      }
    );
  }
  
  async getDataForDF(appFinDataObj: AppFinDataObj) {
      await this.http.post(URLConstant.GetAppDlrFinByAppId, { Id: this.AppId }).toPromise().then(
      async (response: AppDlrFncng) => {
        this.appDlrFncng = response;

        var obj = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInstType,
          MasterCode: this.appDlrFncng.MrInstTypeCode
        }
        await this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, obj).toPromise().then(
          (response) => {
            this.instTypeDescr = response["Descr"]
          }
        )
        var object  = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeTopCalcBased,
          MasterCode: this.appDlrFncng.TopBased
        }
        await this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, object).toPromise().then(
          (response) => {
            this.topCalcBased = response["Descr"]
          }
        )
      }
    )

    var obj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeProvisionSource,
      MasterCode: appFinDataObj.MrProvisionFeeCalcMethodCode
    }
    await this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, obj).toPromise().then(
      (response) => {
        this.calcBase = response["Descr"]
      }
    )
    obj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeProvisionType,
      MasterCode: appFinDataObj.MrProvisionFeeTypeCode
    }
    await this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, obj).toPromise().then(
      (response) => {
        this.provisionFeeType = response["Descr"]
      }
    )
  }
}