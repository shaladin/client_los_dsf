import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';
import { FormAddDynamicComponent } from './form-add-dynamic/form-add-dynamic.component';
import { NapAppModel } from 'app/shared/model/NapApp.Model';

@Component({
  selector: 'app-commission-add',
  templateUrl: './commission-add.component.html',
  styleUrls: ['./commission-add.component.scss']
})
export class CommissionAddComponent implements OnInit {

  @ViewChild('Form1') FormAdd1: FormAddDynamicComponent;
  @ViewChild('Form2') FormAdd2: FormAddDynamicComponent;
  @ViewChild('Form3') FormAdd3: FormAddDynamicComponent;
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
    this.isFinishGetAppReferantorData = false;
    this.isFinishGetAppFeeData = false;
    this.isFinishGetAppData = false;

    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";

    this.viewIncomeInfoObj = {
      UppingRate: 0,
      InsuranceIncome: 0,
      LifeInsuranceIncome: 0,
      MaxAllocatedAmount: 0,
      RemainingAllocatedAmount: 0,
      Other: []
    };

    this.GetAppData();
    // this.GetIncomeInfoObj();
    this.GetAppFeeData();
    this.GetContentName("Supplier");
    this.GetContentName("Referantor");
  }

  isFinishGetAppReferantorData;
  isFinishGetAppFeeData;
  isFinishGetAppData;
  ResultAppData;
  GetAppData() {
    var url = environment.losUrl + AdInsConstant.GetAppById;
    var obj = {
      // AppId: this.AppId,
      AppId: this.AppId,
      RowVersion: ""
    };
    this.http.post(url, obj).subscribe(
      (response) => {
        // console.log(response);
        this.ResultAppData = response;
        this.isFinishGetAppData = true;
        console.log("Result app data");
        console.log(this.ResultAppData);
        this.GetRuleSetName();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetIncomeInfoObj() {
    var url = environment.losUrl + AdInsConstant.GetAppFinDataWithRuleByAppId;
    var app = new NapAppModel();
    app = this.ResultAppData;
    var obj = {
      AppId: this.AppId,
      LobCode: this.ResultAppData.LobCode,
      AdminFee: this.AdminFee,
      ProvisionFee: this.ProvisionFee,
      UppingAdminFee: this.UppingAdminFee,
      UppingProvisionFee: this.UppingProvisionFee,
      appObj: app
    };
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        this.viewIncomeInfoObj.UppingRate = response["DiffRateAmt"],
        this.viewIncomeInfoObj.InsuranceIncome = response["TotalInsCustAmt"] - response["TotalInsInscoAmt"],
        this.viewIncomeInfoObj.LifeInsuranceIncome = response["TotalLifeInsCustAmt"] - response["TotalLifeInsInscoAmt"],
        this.viewIncomeInfoObj.MaxAllocatedAmount = response["MaxAllocatedRefundAmt"],
        this.viewIncomeInfoObj.RemainingAllocatedAmount = response["MaxAllocatedRefundAmt"] - response["CommissionAllocatedAmt"] - response["ReservedFundAllocatedAmt"],
        this.viewIncomeInfoObj.TotalInterestAmount = response["TotalInterestAmt"];
        
        // this.GetAppFeeData();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  AdminFee;
  ProvisionFee;
  UppingAdminFee;
  UppingProvisionFee;
  GetAppFeeData() {
    var url = environment.losUrl + AdInsConstant.GetListAppFeeByAppId;
    var obj = {
      // AppId: this.AppId,
      AppId: this.AppId,
      RowVersion: ""
    };
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        var listData = response["ReturnObject"];
        for (var i = 0; i < listData.length; i++) {
          this.viewIncomeInfoObj.Other.push(listData[i].AppFeeAmt);
          if (listData[i].MrFeeTypeCode == "ADMIN") {
            this.AdminFee = listData[i].AppFeeAmt;
            this.UppingAdminFee = listData[i].SellFeeAmt-listData[i].AppFeeAmt;
            console.log("admin fee");
            console.log(this.AdminFee);
            console.log(this.UppingProvisionFee);
          } else if (listData[i].MrFeeTypeCode == "PROVISION") {
            this.ProvisionFee = listData[i].AppFeeAmt;
            this.UppingProvisionFee = listData[i].SellFeeAmt-listData[i].AppFeeAmt;
            console.log("provision fee");
            console.log(this.ProvisionFee);
            console.log(this.UppingProvisionFee);
          }
        }
        this.isFinishGetAppFeeData = true;
        this.GetRuleSetName();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetRuleSetName() {
    if (this.isFinishGetAppReferantorData && this.isFinishGetAppFeeData && this.isFinishGetAppData) {
      var url = environment.FoundationR3Url + AdInsConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode;
      var obj = {
        ProdOfferingCode: this.ResultAppData.ProdOfferingCode,
        RefProdCompntCode: "COMMISSION_SCHM",
        ProdOfferingVersion: this.ResultAppData.ProdOfferingVersion
      }
      this.http.post(url, obj).subscribe(
        (response) => {
          // console.log("Response Prod Offering D");
          // console.log(response);
          this.GetIncomeInfoObj();
          this.GetRuleDataForForm(response["CompntValue"]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  GetRuleDataForForm(ruleSetName) {
    var url = environment.losUrl + AdInsConstant.GetAppCommissionRule;
    var listTemp = new Array();
    for (var i = 0; i < this.ContentObjSupplier.length; i++) {
      var temp = {
        "AppIncentiveScheme": {
          "LobCode": this.ResultAppData.LobCode,
          "SupplBranchCode": this.ContentObjSupplier[i].Key,
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
      listTemp.push(temp);
    }
    console.log("LIst temp");
    console.log(listTemp);
    var obj = {
      "RuleSetName": ruleSetName,
      "ListRequestAppCommissionRuleObjs": listTemp
    };
    console.log(obj);
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log("Cek Rule");
        console.log(response);
        console.log(response["length"]);

        for(var i=0;i<response["length"];i++){
          var temp = response[i]["ReturnObject"].RuleDataObjects;
          console.log(temp);
          this.SaveRuleData(temp["ResultSupplier"], "Supplier", this.ContentObjSupplier[i].Key);
          this.SaveRuleData(temp["ResultSupplierEmp"], "Supplier Employee", this.ContentObjSupplier[i].Key);
        }
        this.SaveRuleData(response[0]["ReturnObject"].RuleDataObjects["ResultReferantor"], "Referantor", "");
        
        this.GetFormAddDynamicObj("Supplier");
        this.GetFormAddDynamicObj("Supplier Employee");
        this.GetFormAddDynamicObj("Referantor");

      },
      (error) => {
        console.log(error);
      }
    );
  }

  RuleSupplierData: any = {};
  RuleSupplierEmpData: any = {};
  RuleReferantorData = new Array();
  private SaveRuleData(obj, dataTo, content){
    console.log(dataTo);
    console.log(obj);
    var len = obj.AllocationFrom.length;
    var tempObj;
    var tempJobPosition = "";
    var listTempObj = new Array();
    var tempSuppEmpData: any = {};
    if (dataTo == "Supplier") {
      for(var i = 0; i < len; i++){
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          MaxAllocationAmount: obj.MaxAllocationAmount[i],
          AllocationAmount: obj.AllocationAmount[i],
          AllocationBehaviour: obj.AllocationBehaviour[i]
        };
        listTempObj.push(tempObj);
        this.RuleSupplierData[content]=listTempObj;
      }
    } else if (dataTo == "Supplier Employee") {
      for(var i = 0; i < len; i++){
        if(tempJobPosition != obj.JobPositionCode[i]){
          listTempObj = new Array();
          tempJobPosition = obj.JobPositionCode[i];
        }
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          MaxAllocationAmount: obj.MaxAllocationAmount[i],
          AllocationAmount: obj.AllocationAmount[i],
          AllocationBehaviour: obj.AllocationBehaviour[i]
        };
        listTempObj.push(tempObj);
        tempSuppEmpData[obj.JobPositionCode[i]]=listTempObj;
        this.RuleSupplierEmpData[content]=tempSuppEmpData;
      }
    } else if (dataTo == "Referantor") {
      for(var i = 0; i < len; i++){
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          MaxAllocationAmount: obj.MaxAllocationAmount[i],
          AllocationAmount: obj.AllocationAmount[i],
          AllocationBehaviour: obj.AllocationBehaviour[i]
        };
        listTempObj.push(tempObj);
      }
      this.RuleReferantorData.push(listTempObj);
    }

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
          this.isFinishGetAppReferantorData = true;
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
      this.GetRuleSetName();
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
            Value: ReturnObject[i].SupplEmpName,
            MrSupplEmpPositionCode: ReturnObject[i].MrSupplEmpPositionCode,
            SupplCode: ReturnObject[i].SupplCode
          };
          this.ContentObjSupplierEmp.push(KVPObj);
        }
      }
    }
    // console.log("cek ddl data");
    // console.log(this.ContentObjSupplier);
    // console.log(this.ContentObjSupplierEmp);
    // console.log(this.ContentObjReferantor);
    // this.GetFormAddDynamicObj(content);
  }

  GetFormAddDynamicObj(content) {
    if (content == "Supplier") {
      this.FormInputObjSupplier["title"] = "List Supplier Commission Data";
      this.FormInputObjSupplier["content"] = "Supplier";
      this.FormInputObjSupplier["AppId"] = this.AppId;
      this.FormInputObjSupplier["contentObj"] = this.ContentObjSupplier;
      this.FormInputObjSupplier["ruleObj"] = this.RuleSupplierData;
      this.OnForm1 = true;
      console.log(this.FormInputObjSupplier);
    } else if (content == "Supplier Employee") {
      this.FormInputObjSupplierEmpl["title"] = "List Supplier Employee Commission Data";
      this.FormInputObjSupplierEmpl["content"] = "Supplier Employee";
      this.FormInputObjSupplierEmpl["AppId"] = this.AppId;
      this.FormInputObjSupplierEmpl["contentObj"] = this.ContentObjSupplierEmp;
      this.FormInputObjSupplierEmpl["ruleObj"] = this.RuleSupplierEmpData;
      this.OnForm2 = true;
      console.log(this.FormInputObjSupplierEmpl);
    } else if (content == "Referantor") {
      this.FormInputObjReferantor["title"] = "List Referantor Commission Data";
      this.FormInputObjReferantor["content"] = "Referantor";
      this.FormInputObjReferantor["AppId"] = this.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      this.FormInputObjReferantor["ruleObj"] = this.RuleReferantorData;
      this.OnForm3 = true;
      console.log(this.FormInputObjReferantor);
    }
  }

  GetData(ev, data) {
    this.FormGetObj[data] = ev;
    console.log(this.FormGetObj);
  }

  CalculateTotal() {
    this.FormAdd1.CheckData();
    this.FormAdd2.CheckData();
    this.FormAdd3.CheckData();
    this.FormAdd1.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo);
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
