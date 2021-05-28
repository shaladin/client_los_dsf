import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppDlrFncng } from 'app/shared/model/AppData/AppDlrFncng.Model';

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

  //FIN DATA
  provisionFeeType: any = "-";
  calcBase: any = "-";
  calcMethod: any = "-";
  appDlrFncng: any;
  instTypeDescr: any = "-";
  topCalcBased: any = "-";

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
      this.getFinancialData();
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

  getFinancialData() {
    var reqObj = { Id: this.AppId };
    this.http.post(URLConstant.GetFinancialDataByAppIdForView, reqObj).subscribe(
      (response) => {
        this.listSubsidy = response["AppSubsidyObjs"];
        this.listAppFeeObj = response["AppFeeObjs"];
        this.appFinDataObj = response["AppFinDataObj"];
        this.appObj = response["AppObj"];
        this.listInstallment = response["InstallmentObjs"];
        if (this.appObj.BizTemplateCode == CommonConstant.DF) {
          this.getDataForDF(this.appFinDataObj)
        }
      }
    );
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
  
  getDataForDF(appFinDataObj) {

    var AppOb = {
      AppId: this.AppId
    }
    this.http.post(URLConstant.GetAppDlrFinByAppId, AppOb).subscribe(
      (response) => {
        this.appDlrFncng = response;

        var obj = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInstType,
          MasterCode: this.appDlrFncng.MrInstTypeCode
        }
        this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, obj).subscribe(
          (response) => {
            this.instTypeDescr = response["Descr"]
          }
        )
        var object  = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeTopCalcBased,
          MasterCode: this.appDlrFncng.TopBased
        }
        this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, object).subscribe(
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
    this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, obj).subscribe(
      (response) => {
        this.calcBase = response["Descr"]
      }
    )
    obj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeProvisionType,
      MasterCode: appFinDataObj.MrProvisionFeeTypeCode
    }
    this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, obj).subscribe(
      (response) => {
        this.provisionFeeType = response["Descr"]
      }
    )
  }
}