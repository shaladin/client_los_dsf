import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { Sort } from '@angular/material';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';

@Component({
  selector: 'app-tab-app-data',
  templateUrl: './tab-app-data.component.html',
  styleUrls: []
})
export class TabAppDataComponent implements OnInit {

  @Input() AppId;
  @Input() MrCustTypeCode;
  constructor(
    private http: HttpClient,
  ) { }

  GuarantorData;
  CommData;
  ReferantorData;
  AppDetailAssetData;
  AppDetailFinData;
  AssetInsuranceAndLifeInsuranceData;
  LoanObjectData;
  CrossData;
  LifeInsData;
  RsvFundData;
  inputGridObj: InputGridObj;
  InputGridColl : InputGridObj;
  InputGridCollIns : InputGridObj;
  InputGridLifeIns : InputGridObj;
  IsGridTcReady: boolean = false;
  IsGridCollReady : boolean = false;
  IsGridCollInsReady : boolean = false;
  IsGridLifeInsReady : boolean = false;
  IsLifeIns : boolean = false ;
  appFinDataObj: AppFinDataObj = new AppFinDataObj();
  listInstallment: Array<InstallmentObj> = new Array<InstallmentObj>();
  listSubsidy: Array<AppSubsidyObj> = new Array<AppSubsidyObj>();
  TotalSubsidy : number = 0;
  TotalCommission : number = 0 ;
  TotalReservedFund : number = 0 ;

  InitData() {
    // this.appId = 31;
    this.GuarantorData = new Array();
    this.CommData = new Array();
    this.LoanObjectData = new Array ();
    this.CrossData = new Array();
    this.RsvFundData = new Array();
    this.ReferantorData = {
      ReferantorName: "",
      CooperationDate: "",
      NumOfSales: 0,
      NumOfApplication: 0,
      TotalSalesAmount: 0,
      InAmount: 0,
      TotalProfit: 0,
      TotalLoss: 0
    };
    this.AppDetailAssetData = {
      SalesName: "",
      SpvName: "",
      JoinDt: "",
      TotalProfit: 0,
      NumOfApplication: 0,
      TotalLoss: 0,
      InAmount: 0,
    };
    this.AppDetailFinData = {
      InstScheme: "",
      PayFreqDesc: "",
      NumOfInst: 0,
      InterestTypeDesc: "",
      InstAmt: 0,
      AssetName: "",
    };
    this.LifeInsData = {
      IsCover: false,
      LifeInscoBranchName: "",
      NewCoverNotes: 0,
      LifeInsFee: "",
    };
  }

  async ngOnInit() {
     console.log("aaaa")
    this.InitData();
    await this.GetGuarantorData();
    await this.GetReferantorData();
    await this.GetAppDetailData();
    await this.GetCommData();
    await this.GetAppTc();
    await this.GetCrossData();
    await this.GetLoanObjectData();
    await this.GetAppCollateral();
    await this.GetAppCollateralIns();
    await this.GetRsvFundData();
    await this.GetFinData();
    if(this.IsLifeIns){
      await this.GetLifeInsData();
    }
  }

  async GetGuarantorData() {
    var obj = {
      AppGuarantorObj: {
        AppId: this.AppId
      },
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetListAppGuarantorDetail, obj).toPromise().then(
      (response) => {
        for (var i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
          var tempResponse = response[CommonConstant.ReturnObj][i];
          var temp = {
            GuarantorName: tempResponse.appGuarantorObj.GuarantorName,
            GuarantorType: tempResponse.appGuarantorObj.GuarantorTypeCodeDesc,
            Relationship: tempResponse.appGuarantorObj.CustRelationshipCodeDesc,
            IdNo: "",
            Address: "",
            MobilePhone: ""
          };
          if (tempResponse.appGuarantorObj.MrGuarantorTypeCode == CommonConstant.GuarantorTypeCodeCompany) {
            temp.IdNo = tempResponse.appGuarantorObj.TaxIdNo;
            temp.Address = tempResponse.appGuarantorCompanyObj.Addr;
            temp.MobilePhone = tempResponse.appGuarantorCompanyObj.MobilePhnNo1 + " / " + tempResponse.appGuarantorCompanyObj.MobilePhnNo2;
          }
          if (tempResponse.appGuarantorObj.MrGuarantorTypeCode == CommonConstant.GuarantorTypeCodePersonal) {
            temp.IdNo = tempResponse.appGuarantorPersonalObj.IdNo;
            temp.Address = tempResponse.appGuarantorPersonalObj.Addr;
            temp.MobilePhone = tempResponse.appGuarantorPersonalObj.MobilePhnNo;
          }
          this.GuarantorData.push(temp);
        }
      });
  }

  async GetReferantorData() {
    var obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetAppReferantorForAppsData, obj).toPromise().then(
      (response) => {
        this.ReferantorData.ReferantorName = response["ReferantorName"];
        this.ReferantorData.NumOfSales = response["NumOfSales"];
        this.ReferantorData.CooperationDate = response["CooperationDt"];
      });
  }

  async GetAppDetailData() {
    var obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetAppDetailForAppTabById, obj).toPromise().then(
      (response) => {

        this.AppDetailAssetData = {
          SalesName: response["SalesOfficerName"],
          SpvName: response["SalesHeadName"],
          JoinDt: response["JoinDt"],
          TotalProfit: 0,
          NumOfApplication: 0,
          TotalLoss: 0,
          InAmount: 0,
        };

        this.AppDetailFinData = {
          InstScheme: response["MrInstSchemeCodeDesc"],
          PayFreqDesc: response["PayFreqCodeDesc"],
          NumOfInst: response["NumOfInst"],
          InterestTypeDesc: response["InterestTypeDesc"],
          InstAmt: response["TotalInstAmt"],
          AssetName: response["FullAssetName"],
        };

        if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
          this.IsLifeIns = true;
        }

      });
  }

  async GetCommData() {
    var obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetAppCommissionDataDetailByAppId, obj).toPromise().then(
      (response) => {
        var temp = response[CommonConstant.ReturnObj];
        for (var i = 0; i < temp.length; i++) {
          var tempObj = {
            Subject: temp[i].MrCommissionRecipientTypeCodeDesc,
            Name: temp[i].CommissionRecipientRefNoDesc,
            TotalCommAmt: temp[i].TotalCommissionAmt,
          }
          this.CommData.push(tempObj);
          this.TotalCommission += tempObj.TotalCommAmt;
        }
      });
  }

  async GetRsvFundData() {
    var obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetListAppReservedFundByAppId, obj).toPromise().then(
      (response) => {
        var temp = response[CommonConstant.ReturnObj];
        for (var i = 0; i < temp.length; i++) {
          var tempObj = {
            MrReservedFundCode: temp[i].MrReservedFundCode,
            ReservedFundAmt: temp[i].ReservedFundAmt,
          }
          this.RsvFundData.push(tempObj);
          this.TotalReservedFund += tempObj.ReservedFundAmt;
        }
      });
  }

  async GetAppTc() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppTc.json";


    var AppObj = {
      AppId: this.AppId
    }

    this.http.post(URLConstant.GetListTCbyAppId, AppObj).toPromise().then(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["AppTcs"]
      });
    this.IsGridTcReady = true;
  }

  async GetAppCollateral() {
    this.InputGridColl = new InputGridObj();
    this.InputGridColl.pagingJson = "./assets/ucgridview/gridAppCollateralView.json";


    var AppObj = {
      AppId: this.AppId
    }

    this.http.post(URLConstant.GetListAppCollateralByAppId, AppObj).toPromise().then(
      (response) => {
        this.InputGridColl.resultData = {
          Data: ""
        }
        this.InputGridColl.resultData["Data"] = new Array();
        this.InputGridColl.resultData.Data = response["ReturnObject"]
      });
    this.IsGridCollReady = true;
  }

  async GetAppCollateralIns() {
    this.InputGridCollIns = new InputGridObj();
    this.InputGridCollIns.pagingJson = "./assets/ucgridview/gridAppCollateralInsuranceView.json";


    var AppObj = {
      AppId: this.AppId
    }

    this.http.post(URLConstant.GetAppCollateralListForInsuranceByAppId, AppObj).toPromise().then(
      (response) => {
        this.InputGridCollIns.resultData = {
          Data: ""
        }
        this.InputGridCollIns.resultData["Data"] = new Array();
        this.InputGridCollIns.resultData.Data = response["ReturnObject"]
      });
    this.IsGridCollInsReady = true;
  }

  async GetLoanObjectData(){
    var obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetListAppLoanPurposeByAppId, obj).toPromise().then(
      (response) => {
        var temp = response["listResponseAppLoanPurpose"];
        for (var i = 0; i < temp.length; i++) {
          var tempObj = {
            MrLoanPurposeDescr: temp[i].MrLoanPurposeDescr,
            IsDisburseToCust: temp[i].IsDisburseToCust,
            BudgetPlanAmt: temp[i].BudgetPlanAmt,
            SelfFinancingAmt: temp[i].SelfFinancingAmt,
            FinancingAmt: temp[i].FinancingAmt,
          }
          this.LoanObjectData.push(tempObj);
        }
      });
  }

  async GetCrossData(){
    var obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetListAppCross, obj).toPromise().then(
      (response) => {
        var temp = response[CommonConstant.ReturnObj];
        for (var i = 0; i < temp.length; i++) {
          var tempObj = {
            CrossAgrmntNo: temp[i].CrossAgrmntNo,
            CustName: temp[i].CustName,
          }
          this.CrossData.push(tempObj);
        }
      });
  }  
  
  async GetLifeInsData() {
    this.InputGridLifeIns = new InputGridObj();
    this.InputGridLifeIns.pagingJson = "./assets/ucgridview/gridAppLifeInsurance.json";
    var obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetAppLifeInsHByAppId, obj).toPromise().then(
      (response) => {
        this.LifeInsData.IsCover = true;
        this.LifeInsData.LifeInscoBranchName = response["LifeInscoBranchName"];
        this.LifeInsData.NewCoverNotes = response["NewCoverNotes"];
        this.LifeInsData.LifeInsFee = response["CustAdminFeeAmt"] + response["InscoAdminFeeAmt"];
        this.InputGridLifeIns.resultData = {
          Data: ""
        }
        this.InputGridLifeIns.resultData["Data"] = new Array();
        this.InputGridLifeIns.resultData.Data = response["ListAppLifeInsD"]
      });
    this.IsGridLifeInsReady = true;
  }

  async GetFinData(){
    var reqObj = { AppId: this.AppId };
    this.http.post(URLConstant.GetFinancialDataByAppIdForView, reqObj).subscribe(
      (response) => {
        this.appFinDataObj = response["AppFinDataObj"];
        this.listInstallment = response["InstallmentObjs"];
        this.listSubsidy = response["AppSubsidyObjs"];
        for(var i =0 ; i<this.listSubsidy.length; i++){
          this.TotalSubsidy+=this.listSubsidy[i].SubsidyAmt;
        }
      });
  }

  sortGuarantorData(sort: Sort) {
    const data = this.GuarantorData.slice();
    if (!sort.active || sort.direction === '') {
      this.GuarantorData = data;
      return;
    }

    this.GuarantorData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'GuarantorName': return this.compare(a.GuarantorName, b.GuarantorName, isAsc);
        case 'GuarantorType': return this.compare(a.GuarantorType, b.GuarantorType, isAsc);
        case 'Relationship': return this.compare(a.Relationship, b.Relationship, isAsc);
        case 'IdNo': return this.compare(a.IdNo, b.IdNo, isAsc);
        case 'Address': return this.compare(a.Address, b.Address, isAsc);
        case 'MobilePhone': return this.compare(a.MobilePhone, b.MobilePhone, isAsc);
        default: return 0;
      }
    });
  }

  sortCommData(sort: Sort) {
    const data = this.CommData.slice();
    if (!sort.active || sort.direction === '') {
      this.CommData = data;
      return;
    }

    this.CommData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Subject': return this.compare(a.Subject, b.Subject, isAsc);
        case 'Name': return this.compare(a.Name, b.Name, isAsc);
        case 'TotalCommAmt': return this.compare(a.TotalCommAmt, b.TotalCommAmt, isAsc);
        default: return 0;
      }
    });
  }

  sortRsvFundData(sort: Sort) {
    const data = this.RsvFundData.slice();
    if (!sort.active || sort.direction === '') {
      this.RsvFundData = data;
      return;
    }

    this.RsvFundData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'MrReservedFundCode': return this.compare(a.MrReservedFundCode, b.MrReservedFundCode, isAsc);
        case 'ReservedFundAmt': return this.compare(a.ReservedFundAmt, b.ReservedFundAmt, isAsc);
        default: return 0;
      }
    });
  }

  sortLoanData(sort : Sort){
    const data = this.LoanObjectData.slice();
    if (!sort.active || sort.direction === '') {
      this.LoanObjectData = data;
      return;
    }

    this.LoanObjectData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'MrLoanPurposeDescr': return this.compare(a.MrLoanPurposeDescr, b.MrLoanPurposeDescr, isAsc);
        case 'IsDisburseToCust': return this.compare(a.IsDisburseToCust, b.IsDisburseToCust, isAsc);
        case 'BudgetPlanAmt': return this.compare(a.BudgetPlanAmt, b.BudgetPlanAmt, isAsc);
        case 'SelfFinancingAmt': return this.compare(a.SelfFinancingAmt, b.SelfFinancingAmt, isAsc);
        case 'FinancingAmt': return this.compare(a.FinancingAmt, b.FinancingAmt, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
