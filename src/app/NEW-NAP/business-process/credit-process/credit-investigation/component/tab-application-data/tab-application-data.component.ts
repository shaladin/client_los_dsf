import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Sort } from '@angular/material';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-tab-application-data',
  templateUrl: './tab-application-data.component.html',
  styleUrls: []
})
export class TabApplicationDataComponent implements OnInit {

  @Input() AppId;
  @Input() MrCustTypeCode;
  constructor(
    private http: HttpClient,
  ) { }

  GuarantorData;
  CommData;
  ReferantorData;
  AppDetailAssetData;
  DealerData;
  AppDetailFinData;
  AssetInsuranceAndLifeInsuranceData;
  InsuranceTitle;
  inputGridObj: InputGridObj;
  IsGridTcReady: boolean = false;

  InitData() {
    // this.appId = 31;
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
    this.DealerData = {
      DealerName: "",
      Address: "",
      SalesDealerPositionCode: "",
      SalesDealerName: "",
      SpvPositionCode: "",
      SpvName: "",
      AdminPositionCode: "",
      AdminName: "",
      BMPositionCode: "",
      BMName: "",
      NumOfApplication: 0,
      CooperationDate: "",
      InAmount: 0,
      TotalProfit: 0,
      TotalLoss: 0,
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

  async ngOnInit() {
    this.InitData();
    await this.GetGuarantorData();
    await this.GetReferantorData();
    await this.GetAppDetailData();
    await this.GetDealerData();
    await this.GetCommData();
    await this.GetAppTc();
    if (this.AssetInsuranceAndLifeInsuranceData.CoverBy == CommonConstant.InsuredByCompany) {
      this.InsuranceTitle = "Asset Insurance";
    } else {
      this.InsuranceTitle = "Asset Insurance & Life Insurance"
    }
    console.log(this.AssetInsuranceAndLifeInsuranceData);
  }

  async GetGuarantorData() {
    var obj = {
      AppGuarantorObj: {
        AppID: this.AppId
      },
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetListAppGuarantorDetail, obj).toPromise().then(
      (response) => {
        console.log(response);
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
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetReferantorData() {
    var obj = {
      AppID: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetAppReferantorForAppsData, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.ReferantorData.ReferantorName = response["ReferantorName"];
        this.ReferantorData.NumOfSales = response["NumOfSales"];
        this.ReferantorData.CooperationDate = response["CooperationDt"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetAppDetailData() {
    var obj = {
      AppID: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetAppDetailForAppTabById, obj).toPromise().then(
      (response) => {
        console.log(response);

        this.AppDetailAssetData = {
          SalesName: response["SalesOfficerName"],
          SpvName: response["SalesHeadName"],
          JoinDt: response["JoinDt"],
          TotalProfit: 0,
          NumOfApplication: 0,
          TotalLoss: 0,
          InAmount: 0,
        };
        // console.log(this.AppDetailAssetData);

        this.AppDetailFinData = {
          InstScheme: response["MrInstSchemeCodeDesc"],
          PayFreqDesc: response["PayFreqCodeDesc"],
          NumOfInst: response["NumOfInst"],
          InterestTypeDesc: response["InterestTypeDesc"],
          InstAmt: response["TotalInstAmt"],
          AssetName: response["FullAssetName"],
        };
        // console.log(this.AppDetailFinData);

        this.AssetInsuranceAndLifeInsuranceData = {
          CoverBy: response["AssetCoverBy"],
          AssetInsuranceCompany: response["AssetInsuranceCompany"],
          AssetInsuranceCustomer: response["AssetInsuranceCustomer"],
          IsLifeInsurance: response["IsLifeInsurance"],
          LifeInsuranceCompany: response["LifeInsuranceCompany"],
        }
        // console.log(this.AssetInsuranceAndLifeInsuranceData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetDealerData() {
    var obj = {
      AppID: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetAppAssetForDealerDataByAppId, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.DealerData = {
          DealerName: response["DealerName"],
          Address: response["Addr"],
          SalesDealerPositionCode: response["SalesDealerPositionCode"],
          SalesDealerName: response["SalesDealerName"],
          SpvPositionCode: response["SpvDealerPositionCode"],
          SpvName: response["SpvDealerName"],
          AdminPositionCode: response["AdmDealerPositionCode"],
          AdminName: response["AdmDealerName"],
          BMPositionCode: response["BMDealerPositionCode"],
          BMName: response["BMDealerName"],
          NumOfApplication: 0,
          CooperationDate: response["CooperationDt"],
          InAmount: 0,
          TotalProfit: 0,
          TotalLoss: 0,
        };
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetCommData() {
    var obj = {
      AppID: this.AppId,
      RowVersion: ""
    };
    await this.http.post(URLConstant.GetAppCommissionDataDetailByAppId, obj).toPromise().then(
      (response) => {
        console.log(response);
        var temp = response[CommonConstant.ReturnObj];
        for (var i = 0; i < temp.length; i++) {
          var tempObj = {
            Subject: temp[i].MrCommissionRecipientTypeCodeDesc,
            Name: temp[i].CommissionRecipientRefNoDesc,
            TotalCommAmt: temp[i].TotalCommissionAmt,
          }
          this.CommData.push(tempObj);
        }
        console.log(this.CommData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetAppTc() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppTc.json";


    var AppObj = {
      AppId: this.AppId
    }

    this.http.post(URLConstant.GetListTCbyAppId, AppObj).toPromise().then(
      (response) => {
        console.log(response);
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["AppTcs"]
      },
      (error) => {
        console.log(error);
      }
    );
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
