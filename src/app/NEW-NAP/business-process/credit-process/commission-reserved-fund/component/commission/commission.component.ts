import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
import { AppAssetDetailObj } from 'app/shared/model/AppAsset/AppAssetDetailObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';
import { RuleCommissionObj } from 'app/shared/model/RuleCommission/RuleCommissionObj.Model';
import { NapAppReferantorModel } from 'app/shared/model/NapAppReferantor.Model';
import { ResultRefundObj } from 'app/shared/model/AppFinData/ResultRefund.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

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
  @Input() showCancel: boolean = true;
  @Input() maxAllocAmt: number = 0;
  @Input() totalExpenseAmt: number = 0;
  @Input() totalRsvFundAmt: number = 0;
  @Input() DictMaxIncomeForm: any = {};
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputUpdateRemainingAlloc: EventEmitter<any> = new EventEmitter();

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
  DictSupplierCode: any = {};
  OnForm1;
  OnForm2;
  OnForm3;
  Summary;
  isAutoGenerate: boolean = true;
  async ngOnInit() {
    this.OnForm1 = false;
    this.OnForm2 = false;
    this.OnForm3 = false;
    this.isFinishGetAppReferantorData = false;
    this.isFinishGetAppFeeData = false;
    this.isFinishGetAppData = false;
    this.isAutoGenerate = true;

    this.viewIncomeInfoObj = {
      UppingRate: 0,
      InsuranceIncome: 0,
      LifeInsuranceIncome: 0,
      MaxAllocatedAmount: 0,
      RemainingAllocatedAmount: 0,
      InterestIncome: 0,
      ReservedFundAllocatedAmount: 0,
      ExpenseAmount: 0,
      Other: []
    };

    this.Summary = {
      TotalCommisionAmount: 0,
      TotalTaxAmmount: 0,
      TotalVATAmount: 0,
      GrossYield: 0
    }

    await this.GetAppData();
    this.GetAppFeeData();
    this.GetContentName(CommonConstant.ContentSupplier);
    this.GetContentName(CommonConstant.ContentReferantor);
  }

  GetInfoCommission() {
    var objApi = {
      Id: this.AppId,
      RowVersion: "",
    };
    this.http.post(URLConstant.GetAppCommissionDataForEditByAppId, objApi).subscribe(
      (response) => {
        var tempObj: Array<AppCommissionHObj> = response[CommonConstant.ReturnObj];
        if (tempObj.length > 0) {
          this.isAutoGenerate = false;
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplier);
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(CommonConstant.ContentReferantor);

          setTimeout(() => {
            var FormAdd1Idx = 0;
            var FormAdd2Idx = 0;
            var FormAdd3Idx = 0;
            var totalExpenseAmt = 0;
            for (var i = 0; i < tempObj.length; i++) {
              var obj = tempObj[i];
              totalExpenseAmt += obj.TotalExpenseAmt;
              if (obj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplier) {
                this.FormAdd1.AddNewDataForm();
                this.FormAdd1.GenerateExistingContentName(obj, FormAdd1Idx);
                this.FormInputObjSupplier["isDataInputed"] = true;
                FormAdd1Idx++;
              } else if (obj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp) {
                this.FormAdd2.AddNewDataForm();
                this.FormAdd2.GenerateExistingContentName(obj, FormAdd2Idx);
                this.FormInputObjSupplierEmpl["isDataInputed"] = true;
                FormAdd2Idx++;
              } else if (obj.MrCommissionRecipientTypeCode == CommonConstant.CommissionReceipientTypeCodeReferantor) {
                this.FormAdd3.AddNewDataForm();
                this.FormAdd3.GenerateExistingContentName(obj, FormAdd3Idx);
                this.FormInputObjReferantor["isDataInputed"] = true;
                FormAdd3Idx++;
              }
            }
            this.viewIncomeInfoObj.ExpenseAmount = totalExpenseAmt;
            this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - this.viewIncomeInfoObj.ExpenseAmount - this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
            this.outputUpdateRemainingAlloc.emit(this.viewIncomeInfoObj.ExpenseAmount);
          }, 1000);

        } else {
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplier);
          this.GetFormAddDynamicObj(CommonConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(CommonConstant.ContentReferantor);
        }
      });
  }

  isFinishGetAppReferantorData;
  isFinishGetAppFeeData;
  isFinishGetAppData;
  ResultAppData: AppObj;
  async GetAppData() {
    var obj = {
      // AppId: this.AppId,
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post<AppObj>(URLConstant.GetAppById, obj).toPromise().then(
      (response) => {
        this.ResultAppData = response;
        this.isFinishGetAppData = true;
      });
  }

  ListResultRefundIncomeInfo: Array<ResultRefundObj>;
  TotalHalfListResultRefundIncomeInfo: number = 0;
  GetIncomeInfoObj() {
    var app = new AppObj();
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
    this.http.post<AppFinDataObj>(URLConstant.GetAppFinDataWithRuleByAppId, obj).subscribe(
      (response) => {
        this.ListResultRefundIncomeInfo = response.ResultRefundRsvFundObjs;
        this.TotalHalfListResultRefundIncomeInfo = Math.floor(this.ListResultRefundIncomeInfo.length / 2);
        this.viewIncomeInfoObj.UppingRate = response.DiffRateAmt,
          this.viewIncomeInfoObj.InsuranceIncome = response.TotalInsCustAmt - response.TotalInsInscoAmt,
          this.viewIncomeInfoObj.LifeInsuranceIncome = response.TotalLifeInsCustAmt - response.TotalLifeInsInscoAmt,
          this.viewIncomeInfoObj.MaxAllocatedAmount = this.maxAllocAmt,
          this.viewIncomeInfoObj.ReservedFundAllocatedAmount = this.totalRsvFundAmt,
          this.viewIncomeInfoObj.RemainingAllocatedAmount = this.maxAllocAmt - this.totalExpenseAmt - this.totalRsvFundAmt,
          this.viewIncomeInfoObj.InterestIncome = response.TotalInterestAmt;
        this.viewIncomeInfoObj.ExpenseAmount = this.totalExpenseAmt;
        this.GetRuleDataForForm();
        // this.GetAppFeeData();
      });
  }

  AdminFee;
  ProvisionFee;
  UppingAdminFee;
  UppingProvisionFee;
  GetAppFeeData() {
    var obj = {
      // AppId: this.AppId,
      AppId: this.AppId,
      RowVersion: ""
    };
    this.http.post(URLConstant.GetListAppFeeByAppId, obj).subscribe(
      (response) => {
        var listData: Array<AppFeeObj> = response[CommonConstant.ReturnObj];
        for (var i = 0; i < listData.length; i++) {
          var otherObj = {
            FeeTypeName: listData[i].FeeTypeName,
            AppFeeAmt: listData[i].AppFeeAmt,
          };
          this.viewIncomeInfoObj.Other.push(otherObj);
          if (listData[i].MrFeeTypeCode == CommonConstant.MrFeeTypeCodeAdmin) {
            this.AdminFee = listData[i].AppFeeAmt;
            this.UppingAdminFee = listData[i].SellFeeAmt - listData[i].AppFeeAmt;
          } else if (listData[i].MrFeeTypeCode == CommonConstant.MrFeeTypeCodeProvision) {
            this.ProvisionFee = listData[i].AppFeeAmt;
            this.UppingProvisionFee = listData[i].SellFeeAmt - listData[i].AppFeeAmt;
          }
        }
        this.isFinishGetAppFeeData = true;
        this.GetIncomeInfoObj();
      });
  }

  GetRuleDataForForm() {
    var obj = { AppId: this.AppId };
    this.http.post(URLConstant.GetAppCommissionRule, obj).subscribe(
      (response) => {

        if (response["length"] != 0) {
          for (var i = 0; i < response["length"]; i++) {
            var temp: RuleCommissionObj = response[i][CommonConstant.ReturnObj].RuleDataObjects;
            if (this.ContentObjSupplier.length > 0) {
              this.SaveRuleData(temp["ResultSupplier"], CommonConstant.ContentSupplier, this.ContentObjSupplier[i].Key);
              this.SaveRuleData(temp["ResultSupplierEmp"], CommonConstant.ContentSupplierEmp, this.ContentObjSupplier[i].Key);
            }
          }
          if (response[0][CommonConstant.ReturnObj].RuleDataObjects["ResultReferantor"] != null)
            this.SaveRuleData(response[0][CommonConstant.ReturnObj].RuleDataObjects["ResultReferantor"], CommonConstant.ContentReferantor, "");
        }
        this.GetInfoCommission();

      });
  }

  isAllocationFromDesc: any = {};
  RuleSupplierData: any = {};
  RuleSupplierEmpData: any = {};
  RuleReferantorData = new Array();
  private async SaveRuleData(obj, dataTo, content) {
    var len = obj.AllocationFrom.length;
    var tempObj;
    var tempJobPosition = "";
    var listTempObj = new Array();
    var tempSuppEmpData: any = {};
    if (dataTo == CommonConstant.ContentSupplier) {
      for (var i = 0; i < len; i++) {
        tempObj = {
          AllocationFrom: obj.AllocationFrom[i],
          AllocationFromDesc: obj.AllocationFromDesc[obj.AllocationFrom[i]],
          AllocationFromSeq: obj.AllocationFromSeq[obj.AllocationFrom[i]],
          MaxAllocationAmount: obj.MaxAllocationAmount[i],
          AllocationAmount: obj.AllocationAmount[i],
          AllocationBehaviour: obj.AllocationBehaviour[i]
        };
        listTempObj.push(tempObj);
        this.RuleSupplierData[content] = listTempObj;
      }
    } else if (dataTo == CommonConstant.ContentSupplierEmp) {
      for (var i = 0; i < len; i++) {
        if (tempJobPosition != obj.JobPositionCode[i]) {
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
        tempSuppEmpData[obj.JobPositionCode[i]] = listTempObj;
        this.RuleSupplierEmpData[content] = tempSuppEmpData;
      }
    } else if (dataTo == CommonConstant.ContentReferantor) {
      for (var i = 0; i < len; i++) {
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
    var obj;
    if (content == CommonConstant.ContentSupplier) {
      obj = {
        AppId: this.AppId,
        RowVersion: ""
      };
      this.http.post<AppAssetDetailObj>(URLConstant.GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId, obj).subscribe(
        (response) => {
          if (response.ListAppAssetObj.length != 0) {
            this.GetDDLContent(response.ListAppAssetObj, CommonConstant.ContentSupplier);
            this.GetDDLContent(response.ListAppAssetSupplEmpObj, CommonConstant.ContentSupplierEmp);
          }
          // this.GetContentName(AdInsConstant.ContentSupplierEmp);
        });
    } else if (content == CommonConstant.ContentSupplierEmp) {
    } else if (content == CommonConstant.ContentReferantor) {
      obj = {
        AppId: this.AppId,
        RowVersion: ""
      };
      this.http.post<NapAppReferantorModel>(URLConstant.GetAppReferantorByAppId, obj).subscribe(
        (response) => {
          this.ResultAppReferantor = response;
          this.isFinishGetAppReferantorData = true;
          this.GetDDLContent(response, CommonConstant.ContentReferantor);
        });
    }
  }

  AppAssetIdList = new Array();
  GetDDLContent(ReturnObject, content: string) {
    if (content == CommonConstant.ContentReferantor) {
      if (ReturnObject.AppId == null) return;
      var KVPObj;
      KVPObj = {
        Key: ReturnObject.ReferantorCode,
        Value: ReturnObject.ReferantorName
      };
      this.ContentObjReferantor.push(KVPObj);
      this.FormInputObjReferantor["BankData"] = {
        BankCode: ReturnObject.RefBankCode,
        BankName: "",
        BankAccNo: ReturnObject.BankAccNo,
        BankAccName: ReturnObject.BankAccName,
        BankBranch: ReturnObject.BankBranch,
      };
    } else {
      for (var i = 0; i < ReturnObject.length; i++) {
        var KVPObj;
        if (content == CommonConstant.ContentSupplier) {
          KVPObj = {
            Key: ReturnObject[i].SupplCode,
            Value: ReturnObject[i].SupplName
          };
          this.DictSupplierCode[ReturnObject[i].SupplCode] = ReturnObject[i].SupplName;
          this.ContentObjSupplier.push(KVPObj);
          this.AppAssetIdList.push(ReturnObject[i].AppAssetId);
        } else if (content == CommonConstant.ContentSupplierEmp) {
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
    if (content == CommonConstant.ContentSupplier) {
      this.FormInputObjSupplier["title"] = CommonConstant.TitleSupplier;
      this.FormInputObjSupplier["content"] = CommonConstant.ContentSupplier;
      this.FormInputObjSupplier["labelName"] = CommonConstant.LabelSupplier;
      this.FormInputObjSupplier["AppId"] = this.AppId;
      this.FormInputObjSupplier["contentObj"] = this.ContentObjSupplier;
      this.FormInputObjSupplier["ruleObj"] = this.RuleSupplierData;
      this.FormInputObjSupplier["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplier["isCalculated"] = false;
      this.FormInputObjSupplier["isDataInputed"] = false;
      this.OnForm1 = true;
    } else if (content == CommonConstant.ContentSupplierEmp) {
      this.FormInputObjSupplierEmpl["title"] = CommonConstant.TitleSupplierEmp;
      this.FormInputObjSupplierEmpl["content"] = CommonConstant.ContentSupplierEmp;
      this.FormInputObjSupplierEmpl["labelName"] = CommonConstant.LabelSupplierEmp;
      this.FormInputObjSupplierEmpl["AppId"] = this.AppId;
      this.FormInputObjSupplierEmpl["contentObj"] = this.ContentObjSupplierEmp;
      this.FormInputObjSupplierEmpl["ruleObj"] = this.RuleSupplierEmpData;
      this.FormInputObjSupplierEmpl["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplierEmpl["isCalculated"] = false;
      this.FormInputObjSupplierEmpl["isDataInputed"] = false;
      this.FormInputObjSupplierEmpl["dictSuppl"] = this.DictSupplierCode;
      this.OnForm2 = true;
    } else if (content == CommonConstant.ContentReferantor) {
      this.FormInputObjReferantor["title"] = CommonConstant.TitleReferantor;
      this.FormInputObjReferantor["content"] = CommonConstant.ContentReferantor;
      this.FormInputObjReferantor["labelName"] = CommonConstant.LabelReferantor;
      this.FormInputObjReferantor["AppId"] = this.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      this.FormInputObjReferantor["ruleObj"] = this.RuleReferantorData;
      this.FormInputObjReferantor["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjReferantor["isCalculated"] = false;
      this.FormInputObjReferantor["isDataInputed"] = false;
      this.OnForm3 = true;
    }
  }

  GetData(ev, data) {
    this.FormGetObj[data] = ev.formObj;
    if (ev.message == CommonConstant.MessageCalculate) {
      if (this.FormGetObj[CommonConstant.ContentSupplier] && data == CommonConstant.ContentSupplier) {
        this.CalculateEachData(this.FormGetObj[CommonConstant.ContentSupplier]);
        this.isCalcSuppl = true;
      }
      if (this.FormGetObj[CommonConstant.ContentSupplierEmp] && data == CommonConstant.ContentSupplierEmp) {
        this.CalculateEachData(this.FormGetObj[CommonConstant.ContentSupplierEmp]);
        this.isCalcSupplEmp = true;
      }
      if (this.FormGetObj[CommonConstant.ContentReferantor] && data == CommonConstant.ContentReferantor) {
        this.CalculateEachData(this.FormGetObj[CommonConstant.ContentReferantor]);
        this.isCalcReferantor = true;
      }

      if (this.isCalcSuppl && this.isCalcSupplEmp && this.isCalcReferantor) {
        this.CalculateGrossYield(this.viewIncomeInfoObj.ExpenseAmount);
      }
    }
  }

  CalculateGrossYield(expenseAmt: number) {
    var obj = {
      AppId: this.AppId,
      TotalExpenseAmt: expenseAmt
    };
    this.http.post(URLConstant.CalCulateGrossYield, obj).subscribe(
      (response) => {
        this.Summary.GrossYield = response["GrossYield"];
        this.outputUpdateRemainingAlloc.emit(expenseAmt);
      });
  }

  isCalcTotal: boolean = false;
  isCalcSuppl: boolean = true;
  isCalcSupplEmp: boolean = true;
  isCalcReferantor: boolean = true;
  CalculateTotal() {
    this.isCalcTotal = true;
    this.Summary = {
      TotalCommisionAmount: 0,
      TotalTaxAmmount: 0,
      TotalVATAmount: 0,
      GrossYield: 0
    };
    
    for (var i = 0; i < this.ListAllocFromForDict.length; i++) {
      this.DictTotalIncomeForm[this.ListAllocFromForDict[i]] = 0;
    }

    this.viewIncomeInfoObj.ExpenseAmount = 0;
    if (this.FormGetObj[CommonConstant.ContentSupplier] != undefined && this.FormGetObj[CommonConstant.ContentSupplier].value.arr.length != 0) {
      this.isCalcSuppl = false;
      this.FormAdd1.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo, this.ResultAppData.OriOfficeCode, this.AppId);
    } else {
      this.FormInputObjSupplier["isCalculated"] = true;
    }
    if (this.FormGetObj[CommonConstant.ContentSupplierEmp] != undefined && this.FormGetObj[CommonConstant.ContentSupplierEmp].value.arr.length != 0) {
      this.isCalcSupplEmp = false;
      this.FormAdd2.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo, this.ResultAppData.OriOfficeCode, this.AppId);
    } else {
      this.FormInputObjSupplierEmpl["isCalculated"] = true;
    }
    if (this.FormGetObj[CommonConstant.ContentReferantor] != undefined && this.FormGetObj[CommonConstant.ContentReferantor].value.arr.length != 0) {
      this.isCalcReferantor = false;
      this.FormAdd3.CalculateTax(this.ResultAppData.CurrCode, this.ResultAppData.AppNo, this.ResultAppData.OriOfficeCode, this.AppId);
    } else {
      this.FormInputObjReferantor["isCalculated"] = true;
    }

    if (this.isCalcSuppl && this.isCalcSupplEmp && this.isCalcReferantor) {
      this.CalculateGrossYield(this.viewIncomeInfoObj.ExpenseAmount);
    }
  }

  DictTotalIncomeForm: any = {};
  ListAllocFromForDict: Array<string> = new Array();
  CalculateEachData(FormObj) {
    var arr = FormObj.get('arr') as FormArray;
    var len = arr["controls"].length;
    var tempTotalCommisionAmount = 0;
    var tempTotalTaxAmmount = 0;
    var tempTotalVATAmount = 0;
    var tempTotalExpenseAmount = 0;
    for (var i = 0; i < len; i++) {
      var temp = arr["controls"][i].value;
      for (var j = 0; j < temp.ListAllocated.length; j++) {
        if (this.DictTotalIncomeForm[temp.ListAllocated[j].AllocationFrom] == undefined){
          this.DictTotalIncomeForm[temp.ListAllocated[j].AllocationFrom] = 0;
          this.ListAllocFromForDict.push(temp.ListAllocated[j].AllocationFrom);
        }
        this.DictTotalIncomeForm[temp.ListAllocated[j].AllocationFrom] += temp.ListAllocated[j].AllocationAmount;
      }
      tempTotalCommisionAmount += temp.TotalCommisionAmount;
      tempTotalTaxAmmount += temp.TotalTaxAmount;
      tempTotalVATAmount += temp.TotalVATAmount;
      tempTotalExpenseAmount += temp.TotalExpenseAmount;
    }
    this.Summary.TotalCommisionAmount += tempTotalCommisionAmount;
    this.Summary.TotalTaxAmmount += tempTotalTaxAmmount;
    this.Summary.TotalVATAmount += tempTotalVATAmount;
    // this.Summary.GrossYield = arr["controls"][0].value.GrossYield;
    this.viewIncomeInfoObj.ExpenseAmount += tempTotalExpenseAmount;
    this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - this.viewIncomeInfoObj.ExpenseAmount - this.viewIncomeInfoObj.ReservedFundAllocatedAmount;

  }

  listAppCommissionHObj;
  private DataFilterAppCommH(FormObj, CommReceipientTypeCode) {
    var arr = FormObj.get('arr') as FormArray;
    var len = arr["controls"].length;
    for (var i = 0; i < len; i++) {
      var tempAppCommHObj = new AppCommissionHObj();
      var temp = arr["controls"][i].value;
      if (temp.ContentName == "") continue;
      tempAppCommHObj = this.PatchTempDataValue(temp, CommReceipientTypeCode);

      this.listAppCommissionHObj.push(tempAppCommHObj);
    }
  }

  private PatchTempDataValue(obj, CommReceipientTypeCode) {
    var temp = new AppCommissionHObj();
    if (obj.AppCommissionHId != 0) temp.AppCommissionHId = obj.AppCommissionHId;
    temp.AppId = this.AppId;
    temp.BankAccNo = obj.BankAccountNo;
    temp.BankAccName = obj.BankAccountName;
    temp.BankCode = obj.BankCode;
    temp.BankName = obj.BankName;
    temp.BankBranch = obj.BankBranch;
    temp.TaxAmt = obj.TotalTaxAmount;
    temp.VatAmt = obj.TotalVATAmount;
    temp.PenaltyAmt = obj.TotalPenaltyAmount;
    temp.TotalCommissionAfterTaxAmt = obj.TotalCommisionAmount - (obj.TotalTaxAmount + obj.TotalVATAmount);
    temp.TotalCommissionAmt = obj.TotalCommisionAmount;
    temp.TotalExpenseAmt = obj.TotalExpenseAmount;
    temp.TotalDisburseAmt = obj.TotalDisburseAmount;
    temp.MrCommissionRecipientTypeCode = CommReceipientTypeCode;
    temp.CommissionRecipientRefNo = obj.ContentName;
    temp.MrTaxKindCode = obj.MrIdTypeCode;
    temp.MrTaxCalcMethodCode = obj.MrTaxCalcMethodCode;
    temp.TaxpayerNo = obj.TaxpayerNo;
    temp.RowVersion = obj.RowVersion;
    if (CommReceipientTypeCode == CommonConstant.CommissionReceipientTypeCodeSupplierEmp) {
      temp.ReservedField1 = obj.SupplCode;
      temp.ReservedField2 = obj.MrSupplEmpPositionCodeDesc;
    }
    temp.ListappCommissionDObj = this.DataFilterAppCommD(obj);
    return temp;
  }

  private DataFilterAppCommD(obj) {
    var listAppCommissionDObj = new Array();
    var temp = obj.ListAllocated;
    for (var i = 0; i < temp.length; i++) {
      var tempObj = temp[i];
      var tempAppCommissionDObj = new AppCommissionDObj();
      if (tempObj.AppCommissionDId != 0) {
        tempAppCommissionDObj.AppCommissionHId = tempObj.AppCommissionHId;
        tempAppCommissionDObj.AppCommissionDId = tempObj.AppCommissionDId;
      } else {
        tempAppCommissionDObj.AppCommissionDId = 0;
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

  CekMaxValueIncomeInfo(){
    var flag = false;
    for (var i = 0; i < this.ListAllocFromForDict.length; i++) {
      if (this.DictMaxIncomeForm[this.ListAllocFromForDict[i]].RefundAmount < this.DictTotalIncomeForm[this.ListAllocFromForDict[i]]){
        flag = true;
        this.toastr.warningMessage(this.DictMaxIncomeForm[this.ListAllocFromForDict[i]].RefundAllocationFromDesc + " cannot be more than " + this.DictMaxIncomeForm[this.ListAllocFromForDict[i]].RefundAmount);
      }
    }
    return flag;
  }

  isCalculated;
  SaveData() {
    if ((!this.FormInputObjSupplier["isCalculated"] && this.FormInputObjSupplier["isDataInputed"]) || (!this.FormInputObjSupplierEmpl["isCalculated"] && this.FormInputObjSupplierEmpl["isDataInputed"]) || (!this.FormInputObjReferantor["isCalculated"] && this.FormInputObjReferantor["isDataInputed"]) || !this.isCalcTotal) {
      this.toastr.warningMessage(ExceptionConstant.MUST_CALCUCATE_FIRST);
      return;
    }
    if (this.Summary.TotalCommisionAmount > this.viewIncomeInfoObj.MaxAllocatedAmount) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Max Allocated Amount");
      return;
    }
    if (0 > this.viewIncomeInfoObj.RemainingAllocatedAmount) {
      this.toastr.warningMessage(ExceptionConstant.TOTAL_COMMISION_AMOUNT_CANNOT_MORE_THAN + "Remaining Allocated Amount");
      return;
    }
    if (this.CekMaxValueIncomeInfo()) {
      return;
    }
    this.listAppCommissionHObj = new Array();
    if (this.FormGetObj != null) {
      if (this.FormGetObj[CommonConstant.ContentSupplier] && this.FormGetObj[CommonConstant.ContentSupplier].value.arr.length > 0) {
        this.DataFilterAppCommH(this.FormGetObj[CommonConstant.ContentSupplier], CommonConstant.CommissionReceipientTypeCodeSupplier);
      }
      if (this.FormGetObj[CommonConstant.ContentSupplierEmp] && this.FormGetObj[CommonConstant.ContentSupplierEmp].value.arr.length > 0) {
        this.DataFilterAppCommH(this.FormGetObj[CommonConstant.ContentSupplierEmp], CommonConstant.CommissionReceipientTypeCodeSupplierEmp);
      }
      if (this.FormGetObj[CommonConstant.ContentReferantor] && this.FormGetObj[CommonConstant.ContentReferantor].value.arr.length > 0) {
        this.DataFilterAppCommH(this.FormGetObj[CommonConstant.ContentReferantor], CommonConstant.CommissionReceipientTypeCodeReferantor);
      }

      var obj = {
        AppId: this.AppId,
        GrossYield: this.Summary.GrossYield,
        ListAppCommissionHObj: this.listAppCommissionHObj,
        RowVersion: ""
      };
      this.http.post(URLConstant.AddOrEditAppCommissionData, obj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
        });
    }
  }

  Cancel() {
    this.outputCancel.emit();
  }
}
