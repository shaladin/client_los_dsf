import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';
import { FormAddDynamicComponent } from '../form-add-dynamic/form-add-dynamic.component';
import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';

@Component({
  selector: 'app-commission-add',
  templateUrl: './commission-add.component.html',
  styleUrls: ['./commission-add.component.scss']
})
export class CommissionAddComponent implements OnInit {

  @ViewChild("FormAdd") FormAdd: FormAddDynamicComponent;
  AppId;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    });
  }

  viewProdMainInfoObj;
  viewIncomeInfoObj;
  tempViewIncomeInfoObj;
  FormGetObj: any = {};
  FormInputObjSupplier: any = {};
  FormInputObjSupplierEmpl: any = {};
  FormInputObjReferantor: any = {};
  OnForm1;
  OnForm2;
  OnForm3;
  ngOnInit() {
    this.OnForm1 = false;
    this.OnForm2 = false;
    this.OnForm3 = false;

    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";

    this.viewIncomeInfoObj = {
      UppingRate: 0,
      InsuranceIncome: 0,
      LifeInsuranceIncome: 0,
      MaxAllocatedAmount: 0,
      RemainingAllocatedAmount: 0,
      Other: []
    };
    // console.log("View Income Info");
    // console.log(this.viewIncomeInfoObj);
    this.GetAppData();
    this.GetIncomeInfoObj();
    this.GetContentName("Supplier");
    this.GetContentName("Referantor");

    // this.GetRuleData();
  }

  ResultAppData;
  GetAppData(){
    var url = environment.losUrl + AdInsConstant.GetAppById;
    var obj = {
      // AppId: this.AppId,
      AppId: this.AppId,
      RowVersion: ""
    };
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        this.ResultAppData = response;
        console.log("Result app data");
        console.log(this.ResultAppData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetIncomeInfoObj() {
    var url = environment.losUrl + AdInsConstant.GetAppFinDataByAppId;
    var obj = {
      // AppId: this.AppId,
      AppId: 31,
      RowVersion: ""
    };
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        this.viewIncomeInfoObj = {
          UppingRate: response["DiffRateAmt"],
          InsuranceIncome: response["TotalInsCustAmt"] - response["TotalInsInscoAmt"],
          LifeInsuranceIncome: response["TotalLifeInsCustAmt"] - response["TotalLifeInsInscoAmt"],
          MaxAllocatedAmount: response["MaxAllocatedRefundAmt"],
          RemainingAllocatedAmount: response["MaxAllocatedRefundAmt"] - response["CommissionAllocatedAmt"] - response["ReservedFundAllocatedAmt"],
          TotalInterestAmount: response["TotalInterestAmt"],
          Other: []
        };
        this.GetAppFeeData();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  AdminFee;
  ProvisionFee;
  GetAppFeeData() {
    var url = environment.losUrl + AdInsConstant.GetListAppFeeByAppId;
    var obj = {
      // AppId: this.AppId,
      AppId: 31,
      RowVersion: ""
    };
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        var listData = response["ReturnObject"];
        for (var i = 0; i < listData.length; i++) {
          this.viewIncomeInfoObj.Other.push(listData[i].AppFeeAmt);
          if(listData[i].MrFeeTypeCode == "ADMIN"){
            this.AdminFee = listData[i].AppFeeAmt;
          }else if(listData[i].MrFeeTypeCode == "PROVISION"){
            this.ProvisionFee = listData[i].AppFeeAmt;
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetRuleData() {
    var url = AdInsConstant.Rule;
    var obj = {
      "RequestObject": {
        "RuleSetName": this.ResultAppData.ProdOfferingCode,
        "RuleDataObjects": {
          "AppIncentiveScheme": {
            "LobCode": this.ResultAppData.LobCode,
            "SupplBranchCode": "SUPPL",
            "ReferantorCode": this.ResultAppReferantor.ReferantorCode,
            "InterestIncome": this.viewIncomeInfoObj.TotalInterestAmount,
            "UppingRate": this.viewIncomeInfoObj.UppingRate,
            "InsuranceIncome": this.viewIncomeInfoObj.InsuranceIncome,
            "LifeInsuranceIncome": this.viewIncomeInfoObj.LifeInsuranceIncome,
            "AdminFee": this.AdminFee,
            "ProvisionFee": this.ProvisionFee
          },
          "ResultSupplier": {
            "AllocationFrom": [],
            "MaxAllocationAmount": [],
            "AllocationAmount": [],
            "AllocationBehaviour": []
          },
          "ResultSupplierEmp": {
            "JobPositionCode": [],
            "AllocationFrom": [],
            "MaxAllocationAmount": [],
            "AllocationAmount": [],
            "AllocationBehaviour": []
          },
          "ResultReferantor": {
            "AllocationFrom": [],
            "MaxAllocationAmount": [],
            "AllocationAmount": [],
            "AllocationBehaviour": []
          }
        }
      }
    };
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log("Cek Rule");
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ContentObjSupplier = new Array();
  ContentObjSupplierEmp = new Array();
  ContentObjReferantor = new Array();
  ResultAppReferantor;
  GetContentName(content) {
    var url;
    var obj;
    if (content == "Supplier") {
      url = environment.losUrl + AdInsConstant.GetAppAssetListByAppIdForCommision;
      obj = {
        AppId: this.AppId,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log(response);
          this.GetDDLContent(response["ReturnObject"], "Supplier");
          this.GetContentName("Supplier Employee");
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (content == "Supplier Employee") {
      url = environment.losUrl + AdInsConstant.GetListAppAssetSupplEmpByListAppAssetId;
      obj = {
        AppAssetId: this.AppAssetIdList,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log(response);
          this.GetDDLContent(response["ReturnObject"], "Supplier Employee");
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (content == "Referantor") {
      url = environment.losUrl + AdInsConstant.GetAppReferantorByAppId;
      obj = {
        AppId: this.AppId,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log(response);
          this.ResultAppReferantor = response;
          console.log("Result app ref");
          console.log(this.ResultAppReferantor);
          this.GetDDLContent(response, "Referantor");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  AppAssetIdList = new Array();
  GetDDLContent(ReturnObject, content) {
    if (content == "Referantor") {
      var KVPObj;
      KVPObj = {
        Key: ReturnObject.ReferantorCode,
        Value: ReturnObject.ReferantorName
      };
      this.ContentObjReferantor.push(KVPObj);
      this.FormInputObjReferantor["BankData"] = {
        BankCode: ReturnObject.RefBankCode,
        BankAccNo: ReturnObject.BankAccNo,
        BankAccName: ReturnObject.BankAccName,
        BankBranch: ReturnObject.BankBranch,
      };
    } else {
      for (var i = 0; i < ReturnObject.length; i++) {
        var KVPObj;
        if (content == "Supplier") {
          KVPObj = {
            Key: ReturnObject[i].SupplCode,
            Value: ReturnObject[i].SupplName
          };
          this.ContentObjSupplier.push(KVPObj);
          this.AppAssetIdList.push(ReturnObject[i].AppAssetId);
        } else if (content == "Supplier Employee") {
          KVPObj = {
            Key: ReturnObject[i].SupplEmpNo,
            Value: ReturnObject[i].SupplEmpName
          };
          this.ContentObjSupplierEmp.push(KVPObj);
        }
      }
    }
    // console.log("cek ddl data");
    // console.log(this.ContentObjSupplier);
    // console.log(this.ContentObjSupplierEmp);
    // console.log(this.ContentObjReferantor);
    this.GetFormAddDynamicObj(content);
  }

  GetFormAddDynamicObj(content) {
    if (content == "Supplier") {
      this.FormInputObjSupplier["title"] = "List Supplier Commission Data";
      this.FormInputObjSupplier["content"] = "Supplier";
      this.FormInputObjSupplier["AppId"] = this.AppId;
      this.FormInputObjSupplier["contentObj"] = this.ContentObjSupplier;
      this.OnForm1 = true;
    } else if (content == "Supplier Employee") {
      this.FormInputObjSupplierEmpl["title"] = "List Supplier Employee Commission Data";
      this.FormInputObjSupplierEmpl["content"] = "Supplier Employee";
      this.FormInputObjSupplierEmpl["AppId"] = this.AppId;
      this.FormInputObjSupplierEmpl["contentObj"] = this.ContentObjSupplierEmp;
      this.OnForm2 = true;
    } else if (content == "Referantor") {
      this.FormInputObjReferantor["title"] = "List Referantor Commission Data";
      this.FormInputObjReferantor["content"] = "Referantor";
      this.FormInputObjReferantor["AppId"] = this.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      this.OnForm3 = true;
    }
  }

  GetData(ev, data) {
    console.log(ev);
    console.log(data);
    this.FormGetObj[data] = ev;
    console.log(this.FormGetObj);
  }

  CalculateTotal() {

  }

  listAppCommissionHObj;
  private DataFilterAppCommH(FormObj, CommReceipientTypeCode) {
    console.log(FormObj);
    var arr = FormObj.get('arr') as FormArray;
    var len = arr["controls"].length;
    console.log(arr);
    console.log(len);
    for (var i = 0; i < len; i++) {
      var tempAppCommHObj = new AppCommissionHObj();
      var temp = arr["controls"][i].value;
      console.log(temp);
      tempAppCommHObj = this.PatchTempDataValue(temp, CommReceipientTypeCode);


      console.log(tempAppCommHObj);
      this.listAppCommissionHObj.push(tempAppCommHObj);
    }
  }

  private GetVendorData(VendorCode, status) {
    var MrVendorTypeCode;
    var MrTaxCalcMethodCode;
    if (status == "Supplier Emp") {
      var url = environment.FoundationR3Url + AdInsConstant.GetVendorEmpByVendorEmpNo;
      var obj = {
        VendorCode: VendorCode,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log(response);
          MrTaxCalcMethodCode = response["MrTaxCalcMethodCode"];
        },
        (error) => {
          console.log(error);
        }
      );
      MrVendorTypeCode = "P";
    } else {
      var url = environment.FoundationR3Url + AdInsConstant.GetVendorByVendorCode;
      var obj = {
        VendorCode: VendorCode,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log(response);
          MrVendorTypeCode = response["MrVendorTypeCode"];
          MrTaxCalcMethodCode = response["MrTaxCalcMethodCode"];
        },
        (error) => {
          console.log(error);
        }
      );
    }
    return { MrVendorTypeCode, MrTaxCalcMethodCode };
  }

  private PatchTempDataValue(obj, CommReceipientTypeCode) {
    var temp = new AppCommissionHObj();
    var tempVendorData = this.GetVendorData(obj.ContentName, CommReceipientTypeCode);
    temp.AppId = this.AppId;
    temp.BankAccNo = obj.BankAccountNo;
    temp.BankAccName = obj.BankAccountName;
    temp.BankCode = obj.BankCode;
    temp.BankBranch = obj.BankBranch;
    temp.TaxAmt = obj.TaxAmount;
    temp.VatAmt = obj.VATAmount;
    temp.TotalCommissionAmt = obj.TotalCommisionAmount;
    temp.MrCommissionRecipientTypeCode = CommReceipientTypeCode;
    temp.CommissionRecipientRefNo = obj.ContentName;
    temp.ListappCommissionDObj = this.DataFilterAppCommD(obj);
    temp.MrTaxKindCode = tempVendorData.MrVendorTypeCode;
    temp.MrTaxCalcMethodCode = tempVendorData.MrTaxCalcMethodCode;
    return temp;
  }

  private DataFilterAppCommD(obj) {
    // console.log(obj);
    var listAppCommissionDObj = new Array();
    var tempAppCommissionHObj = new AppCommissionHObj();
    return listAppCommissionDObj;
  }

  SaveData() {
    this.listAppCommissionHObj = new Array();
    if (this.FormGetObj != null) {
      if (this.FormGetObj["supplier"]) {
        this.DataFilterAppCommH(this.FormGetObj["supplier"], "Supplier");
      }
      if (this.FormGetObj["supplierEmp"]) {
        this.DataFilterAppCommH(this.FormGetObj["supplierEmp"], "Supplier Emp");
      }
      if (this.FormGetObj["referantor"]) {
        this.DataFilterAppCommH(this.FormGetObj["referantor"], "Referantor");
      }

      console.log(this.listAppCommissionHObj);
      var url = environment.losUrl + AdInsConstant.AddAppCommissionData;
      var obj = {
        AppId: this.AppId,
        ListAppCommissionHObj: this.listAppCommissionHObj,
        RowVersion: ""
      }
    }
  }


}
