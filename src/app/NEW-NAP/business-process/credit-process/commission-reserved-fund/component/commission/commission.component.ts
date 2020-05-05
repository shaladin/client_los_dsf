import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';
import { FormAddDynamicComponent } from './form-add-dynamic/form-add-dynamic.component';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { AppCommissionDObj } from 'app/shared/model/AppCommissionDObj.Model';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: []
})
export class CommissionComponent implements OnInit {

  @ViewChild('Form1') FormAdd1: FormAddDynamicComponent;
  @ViewChild('Form2') FormAdd2: FormAddDynamicComponent;
  @ViewChild('Form3') FormAdd3: FormAddDynamicComponent;
  @Input() AppId;
  @Input() ReturnHandlingDId;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
  ) {
    // this.route.queryParams.subscribe(params => {
    //   this.AppId = params["AppId"];
    // });
  }

  viewIncomeInfoObj;
  tempViewIncomeInfoObj;
  FormGetObj: any = {};
  FormInputObjSupplier: any = {};
  FormInputObjSupplierEmpl: any = {};
  FormInputObjReferantor: any = {};
  OnForm1;
  OnForm2;
  OnForm3;
  Summary;
  isCalculateData;
  isAutoGenerate;
  show : boolean = false;
  ngOnInit() {

    if(this.ReturnHandlingDId!=0){
      this.show = true;
    }

    this.OnForm1 = false;
    this.OnForm2 = false;
    this.OnForm3 = false;
    this.isFinishGetAppReferantorData = false;
    this.isFinishGetAppFeeData = false;
    this.isFinishGetAppData = false;
    this.isCalculateData = false;
    this.isAutoGenerate = true;

    this.viewIncomeInfoObj = {
      UppingRate: 0,
      InsuranceIncome: 0,
      LifeInsuranceIncome: 0,
      MaxAllocatedAmount: 0,
      RemainingAllocatedAmount: 0,
      Other: []
    };

    this.Summary = {
      TotalCommisionAmount: 0,
      TotalTaxAmmount: 0,
      TotalVATAmount: 0,
      GrossYield: 0
    }

    this.GetAppData();
    this.GetAppFeeData();
    this.GetContentName(AdInsConstant.ContentSupplier);
    this.GetContentName(AdInsConstant.ContentReferantor);
  }

  GetInfoCommission(){
    var url = AdInsConstant.GetAppCommissionDataForEditByAppId;
    var objApi = {
      AppId: this.AppId,
      RowVersion: "",
    };
    this.http.post(url,objApi).subscribe(
      (response) => {
        // console.log("response edit comm");
        // console.log(response);
        var tempObj = response[AdInsConstant.ReturnObj];
        if(tempObj != null){
          this.isAutoGenerate=false;
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplier);
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(AdInsConstant.ContentReferantor);

          setTimeout(() => {
            // console.log("TimeOut");
            var FormAdd1Idx = 0;
            var FormAdd2Idx = 0;
            var FormAdd3Idx = 0;
            for(var i=0;i<tempObj.length;i++){
              var obj = tempObj[i];
              if(obj.MrCommissionRecipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeSupplier){
                this.FormAdd1.AddNewDataForm();
                this.FormAdd1.GenerateExistingContentName(obj, FormAdd1Idx);
                this.FormInputObjSupplier["isDataInputed"] = true;
                FormAdd1Idx++;
              }else if(obj.MrCommissionRecipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeSupplierEmp){
                this.FormAdd2.AddNewDataForm();
                this.FormAdd2.GenerateExistingContentName(obj, FormAdd2Idx);
                this.FormInputObjSupplierEmpl["isDataInputed"] = true;
                FormAdd2Idx++;
              }else if(obj.MrCommissionRecipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeReferantor){
                this.FormAdd3.AddNewDataForm();
                this.FormAdd3.GenerateExistingContentName(obj, FormAdd3Idx);
                this.FormInputObjReferantor["isDataInputed"] = true;
                FormAdd3Idx++;
              }
            }
          }, 1000);
          
        }else{
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplier);
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(AdInsConstant.ContentReferantor);          
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isFinishGetAppReferantorData;
  isFinishGetAppFeeData;
  isFinishGetAppData;
  ResultAppData;
  GetAppData() {
    var url = AdInsConstant.GetAppById;
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
        // console.log("Result app data");
        // console.log(this.ResultAppData);
        this.GetRuleSetName();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetIncomeInfoObj() {
    var url = AdInsConstant.GetAppFinDataWithRuleByAppId;
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
        // console.log(response);
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
    var url = AdInsConstant.GetListAppFeeByAppId;
    var obj = {
      // AppId: this.AppId,
      AppId: this.AppId,
      RowVersion: ""
    };
    this.http.post(url, obj).subscribe(
      (response) => {
        // console.log("response app fee data");
        // console.log(response);
        var listData = response[AdInsConstant.ReturnObj];
        for (var i = 0; i < listData.length; i++) {
          this.viewIncomeInfoObj.Other.push(listData[i].AppFeeAmt);
          if (listData[i].MrFeeTypeCode == AdInsConstant.MrFeeTypeCodeAdmin) {
            this.AdminFee = listData[i].AppFeeAmt;
            this.UppingAdminFee = listData[i].SellFeeAmt-listData[i].AppFeeAmt;
            // console.log("admin fee");
            // console.log(this.AdminFee);
            // console.log(this.UppingProvisionFee);
          } else if (listData[i].MrFeeTypeCode == AdInsConstant.MrFeeTypeCodeProvision) {
            this.ProvisionFee = listData[i].AppFeeAmt;
            this.UppingProvisionFee = listData[i].SellFeeAmt-listData[i].AppFeeAmt;
            // console.log("provision fee");
            // console.log(this.ProvisionFee);
            // console.log(this.UppingProvisionFee);
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
    // console.log("LIst temp");
    // console.log(listTemp);
    var obj = {
      "RuleSetName": ruleSetName,
      "ListRequestAppCommissionRuleObjs": listTemp
    };
    // console.log(obj);
    this.http.post(url, obj).subscribe(
      (response) => {
        // console.log("Cek Rule");
        // console.log(response);
        // console.log(response["length"]);

        for(var i=0;i<response["length"];i++){
          var temp = response[i][AdInsConstant.ReturnObj].RuleDataObjects;
          // console.log(temp);
          this.SaveRuleData(temp["ResultSupplier"], AdInsConstant.ContentSupplier, this.ContentObjSupplier[i].Key);
          this.SaveRuleData(temp["ResultSupplierEmp"], AdInsConstant.ContentSupplierEmp, this.ContentObjSupplier[i].Key);
        }
        this.SaveRuleData(response[0][AdInsConstant.ReturnObj].RuleDataObjects["ResultReferantor"], AdInsConstant.ContentReferantor, "");
        
        this.GetInfoCommission();
        
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isAllocationFromDesc: any = {};
  RuleSupplierData: any = {};
  RuleSupplierEmpData: any = {};
  RuleReferantorData = new Array();
  private async SaveRuleData(obj, dataTo, content){
    // console.log(dataTo);
    // console.log(obj);
    var len = obj.AllocationFrom.length;
    var tempObj;
    var tempJobPosition = "";
    var listTempObj = new Array();
    var tempSuppEmpData: any = {};
    if (dataTo == AdInsConstant.ContentSupplier) {
      for(var i = 0; i < len; i++){
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          AllocationFromDesc: obj.AllocationFromDesc[obj.AllocationFrom[i]],
          AllocationFromSeq: obj.AllocationFromSeq[obj.AllocationFrom[i]],
          MaxAllocationAmount: obj.MaxAllocationAmount[i],
          AllocationAmount: obj.AllocationAmount[i],
          AllocationBehaviour: obj.AllocationBehaviour[i]
        };
        listTempObj.push(tempObj);
        this.RuleSupplierData[content]=listTempObj;
      }
    } else if (dataTo == AdInsConstant.ContentSupplierEmp) {
      for(var i = 0; i < len; i++){
        if(tempJobPosition != obj.JobPositionCode[i]){
          listTempObj = new Array();
          tempJobPosition = obj.JobPositionCode[i];
        }
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          AllocationFromDesc: obj.AllocationFromDesc[obj.AllocationFrom[i]],
          AllocationFromSeq: obj.AllocationFromSeq[obj.AllocationFrom[i]],
          MaxAllocationAmount: obj.MaxAllocationAmount[i],
          AllocationAmount: obj.AllocationAmount[i],
          AllocationBehaviour: obj.AllocationBehaviour[i]
        };
        listTempObj.push(tempObj);
        tempSuppEmpData[obj.JobPositionCode[i]]=listTempObj;
        this.RuleSupplierEmpData[content]=tempSuppEmpData;
      }
    } else if (dataTo == AdInsConstant.ContentReferantor) {
      for(var i = 0; i < len; i++){
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          AllocationFromDesc: obj.AllocationFromDesc[obj.AllocationFrom[i]],
          AllocationFromSeq: obj.AllocationFromSeq[obj.AllocationFrom[i]],
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
    if (content == AdInsConstant.ContentSupplier) {
      url = AdInsConstant.GetAppAssetListByAppId;
      obj = {
        AppId: this.AppId,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          // console.log(response);
          this.GetDDLContent(response[AdInsConstant.ReturnObj], AdInsConstant.ContentSupplier);
          this.GetContentName(AdInsConstant.ContentSupplierEmp);
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (content == AdInsConstant.ContentSupplierEmp) {
      url = AdInsConstant.GetListAppAssetSupplEmpByListAppAssetId;
      obj = {
        AppAssetId: this.AppAssetIdList,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          // console.log(response);
          this.GetDDLContent(response[AdInsConstant.ReturnObj], AdInsConstant.ContentSupplierEmp);
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (content == AdInsConstant.ContentReferantor) {
      url = environment.losUrl + AdInsConstant.GetAppReferantorByAppId;
      obj = {
        AppId: this.AppId,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          // console.log(response);
          this.ResultAppReferantor = response;
          this.isFinishGetAppReferantorData = true;
          // console.log("Result app ref");
          // console.log(this.ResultAppReferantor);
          this.GetDDLContent(response, AdInsConstant.ContentReferantor);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  AppAssetIdList = new Array();
  GetDDLContent(ReturnObject, content) {
    if (content == AdInsConstant.ContentReferantor) {
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
        if (content == AdInsConstant.ContentSupplier) {
          KVPObj = {
            Key: ReturnObject[i].SupplCode,
            Value: ReturnObject[i].SupplName
          };
          this.ContentObjSupplier.push(KVPObj);
          this.AppAssetIdList.push(ReturnObject[i].AppAssetId);
        } else if (content == AdInsConstant.ContentSupplierEmp) {
          KVPObj = {
            Key: ReturnObject[i].SupplEmpNo,
            Value: ReturnObject[i].SupplEmpName,
            MrSupplEmpPositionCode: ReturnObject[i].MrSupplEmpPositionCode,
            MrSupplEmpPositionCodeDesc: ReturnObject[i].MrSupplEmpPositionCodeDesc,
            SupplCode: ReturnObject[i].SupplCode
          };
          this.ContentObjSupplierEmp.push(KVPObj);
        }
      }
    }
  }

  GetFormAddDynamicObj(content) {
    if (content == AdInsConstant.ContentSupplier) {
      this.FormInputObjSupplier["title"] = AdInsConstant.TitleSupplier;
      this.FormInputObjSupplier["content"] = AdInsConstant.ContentSupplier;
      this.FormInputObjSupplier["AppId"] = this.AppId;
      this.FormInputObjSupplier["contentObj"] = this.ContentObjSupplier;
      this.FormInputObjSupplier["ruleObj"] = this.RuleSupplierData;
      this.FormInputObjSupplier["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplier["isCalculated"] = false;
      this.FormInputObjSupplier["isDataInputed"] = false;
      this.OnForm1 = true;
      // console.log(this.FormInputObjSupplier);
    } else if (content == AdInsConstant.ContentSupplierEmp) {
      this.FormInputObjSupplierEmpl["title"] = AdInsConstant.TitleSupplierEmp;
      this.FormInputObjSupplierEmpl["content"] = AdInsConstant.ContentSupplierEmp;
      this.FormInputObjSupplierEmpl["AppId"] = this.AppId;
      this.FormInputObjSupplierEmpl["contentObj"] = this.ContentObjSupplierEmp;
      this.FormInputObjSupplierEmpl["ruleObj"] = this.RuleSupplierEmpData;
      this.FormInputObjSupplierEmpl["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplierEmpl["isCalculated"] = false;
      this.FormInputObjSupplierEmpl["isDataInputed"] = false;
      this.OnForm2 = true;
      // console.log(this.FormInputObjSupplierEmpl);
    } else if (content == AdInsConstant.ContentReferantor) {
      this.FormInputObjReferantor["title"] = AdInsConstant.TitleReferantor;
      this.FormInputObjReferantor["content"] = AdInsConstant.ContentReferantor;
      this.FormInputObjReferantor["AppId"] = this.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      this.FormInputObjReferantor["ruleObj"] = this.RuleReferantorData;
      this.FormInputObjReferantor["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjReferantor["isCalculated"] = false;
      this.FormInputObjReferantor["isDataInputed"] = false;
      this.OnForm3 = true;
      // console.log(this.FormInputObjReferantor);
    }
  }

  GetData(ev, data) {
    this.FormGetObj[data] = ev;
    // console.log(this.FormGetObj);
    if(this.isCalculateData){
      if (this.FormGetObj[AdInsConstant.ContentSupplier] && data == AdInsConstant.ContentSupplier) {
        this.CalculateEachData(this.FormGetObj[AdInsConstant.ContentSupplier]);
      }
      if (this.FormGetObj[AdInsConstant.ContentSupplierEmp] && data == AdInsConstant.ContentSupplierEmp) {
        this.CalculateEachData(this.FormGetObj[AdInsConstant.ContentSupplierEmp]);      
      }
      if (this.FormGetObj[AdInsConstant.ContentReferantor] && data == AdInsConstant.ContentReferantor) {
        this.CalculateEachData(this.FormGetObj[AdInsConstant.ContentReferantor]);      
      }
    }
  }

  CalculateTotal() {
    this.isCalculateData = true;
    this.Summary = {
      TotalCommisionAmount: 0,
      TotalTaxAmmount: 0,
      TotalVATAmount: 0,
      GrossYield: 0
    }
    if (this.FormGetObj[AdInsConstant.ContentSupplier]) {
      this.FormAdd1.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo, this.ResultAppData.OriOfficeCode, this.AppId);
    }
    if (this.FormGetObj[AdInsConstant.ContentSupplierEmp]) {    
      this.FormAdd2.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo, this.ResultAppData.OriOfficeCode, this.AppId);
    }
    if (this.FormGetObj[AdInsConstant.ContentReferantor]) {
      this.FormAdd3.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo, this.ResultAppData.OriOfficeCode, this.AppId);
    }
  }

  CalculateEachData(FormObj){
    // console.log(FormObj);
    var arr = FormObj.get('arr') as FormArray;
    var len = arr["controls"].length;
    var tempTotalCommisionAmount=0;
    var tempTotalTaxAmmount = 0;
    var tempTotalVATAmount = 0;
    for (var i = 0; i < len; i++) {
      var temp = arr["controls"][i].value;
      tempTotalCommisionAmount += temp.TotalCommisionAmount;
      tempTotalTaxAmmount += temp.TotalTaxAmount;
      tempTotalVATAmount += temp.TotalVATAmount;
    }
    this.Summary.TotalCommisionAmount += tempTotalCommisionAmount;
    this.Summary.TotalTaxAmmount += tempTotalTaxAmmount;
    this.Summary.TotalVATAmount += tempTotalVATAmount;
    this.Summary.GrossYield +=arr["controls"][0].value.GrossYield;
  }

  listAppCommissionHObj;
  private DataFilterAppCommH(FormObj, CommReceipientTypeCode) {
    // console.log(FormObj);
    var arr = FormObj.get('arr') as FormArray;
    var len = arr["controls"].length;
    // console.log(arr);
    // console.log(len);
    for (var i = 0; i < len; i++) {
      var tempAppCommHObj = new AppCommissionHObj();
      var temp = arr["controls"][i].value;
      // console.log("Data at " + i);
      // console.log(temp);
      if(temp.ContentName == "") continue;
      tempAppCommHObj = this.PatchTempDataValue(temp, CommReceipientTypeCode);

      // console.log(tempAppCommHObj);
      this.listAppCommissionHObj.push(tempAppCommHObj);
    }
  }

  private PatchTempDataValue(obj, CommReceipientTypeCode) {
    var temp = new AppCommissionHObj();
    if(obj.AppCommissionHId != 0) temp.AppCommissionHId = obj.AppCommissionHId;
    temp.AppId = this.AppId;
    temp.BankAccNo = obj.BankAccountNo;
    temp.BankAccName = obj.BankAccountName;
    temp.BankCode = obj.BankCode;
    temp.BankBranch = obj.BankBranch;
    temp.TaxAmt = obj.TotalTaxAmount;
    temp.VatAmt = obj.TotalVATAmount;
    temp.PenaltyAmt = obj.TotalPenaltyAmount;
    temp.TotalCommissionAfterTaxAmt = obj.TotalCommisionAmount - (obj.TotalTaxAmount + obj.TotalVATAmount);
    temp.TotalCommissionAmt = obj.TotalCommisionAmount;
    temp.MrCommissionRecipientTypeCode = CommReceipientTypeCode;
    temp.CommissionRecipientRefNo = obj.ContentName;
    temp.MrTaxKindCode = obj.MrIdTypeCode;
    temp.MrTaxCalcMethodCode = obj.MrTaxCalcMethodCode;
    temp.TaxpayerNo = obj.TaxpayerNo;
    temp.RowVersion = obj.RowVersion;
    temp.ListappCommissionDObj = this.DataFilterAppCommD(obj);
    return temp;
  }

  private DataFilterAppCommD(obj) {
    // console.log(obj);
    var listAppCommissionDObj = new Array();
    var temp = obj.ListAllocated;
    for(var i=0;i<temp.length;i++){
      var tempObj = temp[i];
      var tempAppCommissionDObj = new AppCommissionDObj();
      if(tempObj.AppCommissionDId != 0){
        tempAppCommissionDObj.AppCommissionHId = tempObj.AppCommissionHId;
        tempAppCommissionDObj.AppCommissionDId = tempObj.AppCommissionDId;
      }
      tempAppCommissionDObj.MrCommissionSourceCode = tempObj.AllocationFrom;
      tempAppCommissionDObj.CommissionAmt = tempObj.AllocationAmount;
      tempAppCommissionDObj.TaxAmt = tempObj.TaxAmt;
      tempAppCommissionDObj.VatAmt = tempObj.VatAmt;
      tempAppCommissionDObj.PenaltyAmt = tempObj.PenaltyAmt;
      tempAppCommissionDObj.CommissionAmtAfterTax = tempObj.AllocationAmount - (tempObj.TaxAmt + tempObj.VatAmt);
      tempAppCommissionDObj.RowVersion = tempObj.RowVersion;
      listAppCommissionDObj.push(tempAppCommissionDObj);
    }
    return listAppCommissionDObj;
  }

  isCalculated;
  SaveData() {
    if( (!this.FormInputObjSupplier["isCalculated"] && this.FormInputObjSupplier["isDataInputed"]) || (!this.FormInputObjSupplierEmpl["isCalculated"] && this.FormInputObjSupplierEmpl["isDataInputed"]) || (!this.FormInputObjReferantor["isCalculated"] && this.FormInputObjReferantor["isDataInputed"]) ){
      this.toastr.errorMessage("Must Calculate First");
      return ;
    }
    if(this.Summary.TotalCommisionAmount > this.viewIncomeInfoObj.MaxAllocatedAmount){
      this.toastr.errorMessage("Total Commision Amount cannot more than Max Allocated Amount");
      return;
    }
    this.listAppCommissionHObj = new Array();
    if (this.FormGetObj != null) {
      if (this.FormGetObj[AdInsConstant.ContentSupplier] && this.FormGetObj[AdInsConstant.ContentSupplier].value.arr.length > 0) {
        this.DataFilterAppCommH(this.FormGetObj[AdInsConstant.ContentSupplier], AdInsConstant.CommissionReceipientTypeCodeSupplier);
      }
      if (this.FormGetObj[AdInsConstant.ContentSupplierEmp] && this.FormGetObj[AdInsConstant.ContentSupplierEmp].value.arr.length > 0) {
        this.DataFilterAppCommH(this.FormGetObj[AdInsConstant.ContentSupplierEmp], AdInsConstant.CommissionReceipientTypeCodeSupplierEmp);
      }
      if (this.FormGetObj[AdInsConstant.ContentReferantor] && this.FormGetObj[AdInsConstant.ContentReferantor].value.arr.length > 0) {
        this.DataFilterAppCommH(this.FormGetObj[AdInsConstant.ContentReferantor], AdInsConstant.CommissionReceipientTypeCodeReferantor);
      }

      // console.log(this.listAppCommissionHObj);
      var url = environment.losUrl + AdInsConstant.AddOrEditAppCommissionData;
      var obj = {
        AppId: this.AppId,
        GrossYield: this.Summary.GrossYield,
        ListAppCommissionHObj: this.listAppCommissionHObj,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          // Goto
          // Belom Tau kemana
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  Cancel(){
    this.router.navigate(["../CommissionReservedFund/Paging"]);
  }
}
