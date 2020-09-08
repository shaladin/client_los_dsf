import { Component, OnInit, Input } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { forkJoin } from 'rxjs';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-new-application-data',
  templateUrl: './new-application-data.component.html',
  styles: []
})
export class NewApplicationDataComponent implements OnInit {
  @Input() AppId;

  GuarantorData;
  CommData;
  ReferantorData;
  AppDetailAssetData;
  AppDetailFinData;
  AssetInsuranceAndLifeInsuranceData;
  InsuranceTitle;
  inputGridObj: InputGridObj;
  IsGridTcReady: boolean = false;
  LoanObjectData: Array<Object>;
  AppCollateralInsData: Array<Object>;
  AppLifeInsData: Object;
  IsLifeIns: boolean = false;

  constructor(
    private http: HttpClient
  ) {
    this.LoanObjectData = new Array<Object>();
    this.AppCollateralInsData = new Array<Object>();
    this.AppLifeInsData = new Object();
    this.GuarantorData = new Array();
    this.CommData = new Array();
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
    this.AssetInsuranceAndLifeInsuranceData = {
      CoverBy: "",
      AssetInsuranceCompany: "",
      AssetInsuranceCustomer: "",
      IsLifeInsurance: false,
      LifeInsuranceCompany: ""
    }
  }

  ngOnInit() {
    var objGuarantor = {
      AppId: this.AppId,
      RowVersion: ""
    };
    var objReferantor = {
      AppId: this.AppId,
      RowVersion: ""
    };
    var objAppDetail = {
      AppId: this.AppId,
      RowVersion: ""
    };
    var objComm = {
      AppId: this.AppId,
      RowVersion: ""
    };
    var objTc = {
      AppId: this.AppId
    }

    this.http.post(URLConstant.GetListAppGuarantorDetail, objGuarantor).subscribe(
      (response) => {
        this.GetGuarantorData(response);
      });
    this.http.post(URLConstant.GetAppReferantorForAppsData, objReferantor).subscribe(
      (response) => {
        this.GetReferantorData(response);
      });
    this.http.post(URLConstant.GetAppDetailForAppTabById, objAppDetail).subscribe(
      (response) => {
        this.GetAppDetailData(response);
      });
    this.http.post(URLConstant.GetAppCommissionDataDetailByAppId, objComm).subscribe(
      (response) => {
        this.GetCommData(response);
      });
    this.http.post(URLConstant.GetListTCbyAppId, objTc).subscribe(
      (response) => {
        this.GetAppTc(response);
      });
    this.http.post(URLConstant.GetListAppLoanPurposeByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.LoanObjectData = response["listResponseAppLoanPurpose"];
      });
    this.http.post(URLConstant.GetListCollateralAppInsObjForViewByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.AppCollateralInsData = response["ListAppInsObjForView"];
      });
    this.http.post(URLConstant.GetAppLifeInsHByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        if (response != null && response["AppLifeInsHId"] > 0) {
          this.AppLifeInsData["CoverLifeIns"] = "Yes";
          this.AppLifeInsData["LifeInscoBranchName"] = response["LifeInscoBranchName"];
        }
        else {
          this.AppLifeInsData["CoverLifeIns"] = "No";
          this.AppLifeInsData["LifeInscoBranchName"] = "-";
        }
      });
    // let getGuarantor = this.http.post(URLConstant.GetListAppGuarantorDetail, objGuarantor).toPromise();
    // let getReferantor = this.http.post(URLConstant.GetAppReferantorForAppsData, objReferantor).toPromise();
    // let getAppDetail = this.http.post(URLConstant.GetAppDetailForAppTabById, objAppDetail).toPromise();
    // let getCommission = this.http.post(URLConstant.GetAppCommissionDataDetailByAppId, objComm).toPromise();
    // let getAppTc = this.http.post(URLConstant.GetListTCbyAppId, objTc).toPromise();
    // let getLoanObj = this.http.post(URLConstant.GetListAppLoanPurposeByAppId, { AppId: this.AppId }).toPromise();
    // let getCollateralIns = this.http.post(URLConstant.GetListCollateralAppInsObjForViewByAppId, { AppId: this.AppId }).toPromise();
    // let getLifeInsurance = this.http.post(URLConstant.GetAppLifeInsHByAppId, { AppId: this.AppId }).toPromise();
    // forkJoin([getGuarantor, getReferantor, getAppDetail, getCommission, getAppTc, getLoanObj, getCollateralIns, getLifeInsurance]).toPromise().then(
    //   (response) => {
    //     this.GetGuarantorData(response[0]);
    //     this.GetReferantorData(response[1]);
    //     this.GetAppDetailData(response[2]);
    //     this.GetCommData(response[3]);
    //     this.GetAppTc(response[4]);
    //     this.LoanObjectData = response[5]["listResponseAppLoanPurpose"];
    //     this.AppCollateralInsData = response[6]["ListAppInsObjForView"];

    //     if(response[7] != null && response[7]["AppLifeInsHId"] > 0){
    //       this.AppLifeInsData["CoverLifeIns"] = "Yes";
    //       this.AppLifeInsData["LifeInscoBranchName"] = response[7]["LifeInscoBranchName"];
    //     }
    //     else{
    //       this.AppLifeInsData["CoverLifeIns"] = "No";
    //       this.AppLifeInsData["LifeInscoBranchName"] = "-";
    //     }
    //   });
    if (this.AssetInsuranceAndLifeInsuranceData.CoverBy == CommonConstant.InsuredByCompany) {
      this.InsuranceTitle = "Asset Insurance";
    } else {
      this.InsuranceTitle = "Asset Insurance & Life Insurance"
    }
  }

  GetGuarantorData(guarantorData) {
    for (var i = 0; i < guarantorData[CommonConstant.ReturnObj].length; i++) {
      var tempResponse = guarantorData[CommonConstant.ReturnObj][i];
      var temp = {
        GuarantorName: tempResponse.AppGuarantorObj.GuarantorName,
        GuarantorType: tempResponse.AppGuarantorObj.GuarantorTypeCodeDesc,
        Relationship: tempResponse.AppGuarantorObj.CustRelationshipCodeDesc,
        IdNo: "",
        Address: "",
        MobilePhone: ""
      };
      if (tempResponse.AppGuarantorObj.MrGuarantorTypeCode == CommonConstant.GuarantorTypeCodeCompany) {
        temp.IdNo = tempResponse.AppGuarantorObj.TaxIdNo;
        temp.Address = tempResponse.AppGuarantorCompanyObj.Addr;
        temp.MobilePhone = tempResponse.AppGuarantorCompanyObj.MobilePhnNo1 + " / " + tempResponse.AppGuarantorCompanyObj.MobilePhnNo2;
      }
      if (tempResponse.AppGuarantorObj.MrGuarantorTypeCode == CommonConstant.GuarantorTypeCodePersonal) {
        temp.IdNo = tempResponse.AppGuarantorPersonalObj.IdNo;
        temp.Address = tempResponse.AppGuarantorPersonalObj.Addr;
        temp.MobilePhone = tempResponse.AppGuarantorPersonalObj.MobilePhnNo;
      }
      this.GuarantorData.push(temp);
    }
  }

  GetReferantorData(referantorData) {
    this.ReferantorData.ReferantorName = referantorData["ReferantorName"];
    this.ReferantorData.NumOfSales = referantorData["NumOfSales"];
    this.ReferantorData.CooperationDate = referantorData["CooperationDt"];
  }

  GetAppDetailData(appData) {
    this.AppDetailAssetData = {
      SalesName: appData["SalesOfficerName"],
      SpvName: appData["SalesHeadName"],
      JoinDt: appData["JoinDt"],
      TotalProfit: 0,
      NumOfApplication: 0,
      TotalLoss: 0,
      InAmount: 0,
    };

    this.AppDetailFinData = {
      InstScheme: appData["MrInstSchemeCodeDesc"],
      PayFreqDesc: appData["PayFreqCodeDesc"],
      NumOfInst: appData["NumOfInst"],
      InterestTypeDesc: appData["InterestTypeDesc"],
      InstAmt: appData["TotalInstAmt"],
      AssetName: appData["FullAssetName"],
    };
    if (appData["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
      this.IsLifeIns = true;
      this.AssetInsuranceAndLifeInsuranceData = {
        CoverBy: appData["AssetCoverBy"],
        AssetInsuranceCompany: appData["AssetInsuranceCompany"],
        AssetInsuranceCustomer: appData["AssetInsuranceCustomer"],
        IsLifeInsurance: appData["IsLifeInsurance"],
        LifeInsuranceCompany: appData["LifeInsuranceCompany"],
      }
    }

  }

  GetCommData(commissionData) {
    var temp = commissionData[CommonConstant.ReturnObj];
    for (var i = 0; i < temp.length; i++) {
      var tempObj = {
        Subject: temp[i].MrCommissionRecipientTypeCodeDesc,
        Name: temp[i].CommissionRecipientRefNoDesc,
        TotalCommAmt: temp[i].TotalCommissionAmt,
      }
      this.CommData.push(tempObj);
    }
  }

  GetAppTc(appTcData) {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppTc.json";
    this.inputGridObj.resultData = {
      Data: ""
    }
    this.inputGridObj.resultData["Data"] = new Array();
    this.inputGridObj.resultData.Data = appTcData["AppTcs"]
    this.IsGridTcReady = true;
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

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
