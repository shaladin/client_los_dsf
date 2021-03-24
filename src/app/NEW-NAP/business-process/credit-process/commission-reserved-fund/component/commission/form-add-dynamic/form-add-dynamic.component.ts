import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ResponseTaxDetailObj } from 'app/shared/model/Tax/ResponseTaxDetail.Model';
import { ResponseTaxObj } from 'app/shared/model/Tax/ResponseTax.Model';
import { TaxTrxDObj } from 'app/shared/model/Tax/TaxTrxD.Model';
import { VendorBankAccObj } from 'app/shared/model/VendorBankAcc.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-form-add-dynamic',
  templateUrl: './form-add-dynamic.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})

export class FormAddDynamicComponent implements OnInit {

  @Output('update') DataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() FormInputObj;
  @Input() DictMaxIncomeForm: any = {};
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService, private cookieService: CookieService) { }

  FormObj = this.fb.group({
    arr: this.fb.array([])
  });

  arr;
  DDLContentName = new Array();
  DDLBankAccount = new Array();
  UserAccess;
  ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.arr = this.FormObj.get('arr') as FormArray;
    this.GetDDLContentName();
    this.GenerateAutoAtStart();
  }

  GenerateAutoAtStart() {
    if (this.FormInputObj["isAutoGenerate"]) {
      this.FormInputObj["isDataInputed"] = true;
      var len = this.DDLContentName.length;
      for (var i = len - 1; i >= 0; i--) {
        var j = len - i - 1;
        this.AddNewDataForm();
        this.GenerateContentName(i, j);

      }
      this.PassData(CommonConstant.MessagePassData);
    }
  }

  lenDDLContentName = 0;
  totalDDLContentData = 0;
  tempDDLContentName;
  GetDDLContentName() {
    this.DDLContentName = this.FormInputObj["contentObj"];
    this.tempDDLContentName = new Array();
    this.lenDDLContentName = this.DDLContentName.length;
    this.totalDDLContentData = this.DDLContentName.length;
  }

  GetDDLBankAccount(code, idx) {
    var content = this.FormInputObj["content"];
    var obj;
    if (content == CommonConstant.ContentSupplier) {
      obj = {
        VendorCode: code,
        RowVersion: ""
      };
      this.http.post<VendorBankAccObj>(URLConstant.GetListVendorBankAccByVendorCode, {Code : code}).subscribe(
        (response) => {
          var len = response[CommonConstant.ReturnObj].length;
          for (var i = 0; i < len; i++) {
            var eachDDLDetail = this.fb.group({
              Key: response[CommonConstant.ReturnObj][i]["BankAccountNo"],
              Value: response[CommonConstant.ReturnObj][i]["BankAccountName"],
              BankCode: response[CommonConstant.ReturnObj][i]["BankCode"],
              BankName: response[CommonConstant.ReturnObj][i]["BankName"],
              BankBranch: ""
            }) as FormGroup;
            this.FormObj.controls.arr["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
        });
    } else if (content == CommonConstant.ContentSupplierEmp) {
      obj = {
        VendorEmpNo: code,
        VendorCode: this.FormObj.value.arr[idx].SupplCode,
      };
      this.http.post<VendorBankAccObj>(URLConstant.GetListBankByVendorEmpNoAndVendorCode, obj).subscribe(
        (response) => {
          var len = response[CommonConstant.ReturnObj].length;
          for (var i = 0; i < len; i++) {
            var eachDDLDetail = this.fb.group({
              Key: response[CommonConstant.ReturnObj][i]["BankAccountNo"],
              Value: response[CommonConstant.ReturnObj][i]["BankAccountName"],
              BankCode: response[CommonConstant.ReturnObj][i]["BankCode"],
              BankName: response[CommonConstant.ReturnObj][i]["BankName"],
              BankBranch: ""
            }) as FormGroup;
            this.FormObj.controls.arr["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
        });
    } else if (content == CommonConstant.ContentReferantor) {
      var eachDDLDetail = this.fb.group({
        Key: this.FormInputObj["BankData"].BankAccNo,
        Value: this.FormInputObj["BankData"].BankAccName,
        BankCode: this.FormInputObj["BankData"].BankCode,
        BankName: this.FormInputObj["BankData"].BankName,
        BankBranch: this.FormInputObj["BankData"].BankBranch
      }) as FormGroup;
      this.FormObj.controls.arr["controls"][idx].controls.DropDownList.push(eachDDLDetail);
    }
  }

  AddNewDataForm() {
    var NewDataForm = this.fb.group({
      AppCommissionHId: [0],
      ContentName: ['', Validators.required],
      ContentNameValue: [''],
      MrSupplEmpPositionCodeDesc: [''],
      SupplCode: [''],
      BankAccountNo: ['', Validators.required],
      BankAccountName: [''],
      BankBranch: [''],
      BankCode: [''],
      BankName: [''],
      MrIdTypeCode: [''],
      MrTaxCalcMethodCode: [''],
      TaxpayerNo: [''],
      GrossYield: [0],
      TotalCommisionAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalExpenseAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalTaxAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalVATAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalPenaltyAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      TotalDisburseAmount: [0, Validators.pattern("^[0-9]+([,.][0-9]+)?$")],
      RowVersion: [''],
      ListAllocated: this.fb.array([]),
      DropDownList: this.fb.array([])
    }) as FormGroup;
    this.arr.push(NewDataForm);
    this.lenDDLContentName--;
    // if(this.FormInputObj["isAutoGenerate"]){
    // }
  }

  DeleteFromDatabase(AppCommissionHId) {
    var url = URLConstant.DeleteAppCommissionData;
    var obj = {
      AppCommissionHId: AppCommissionHId,
      RowVersion: ""
    };
    this.http.post(url, obj).subscribe(
      (response) => {
      });
  }

  DeleteDataForm(idx) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.FormInputObj["isCalculated"] = false;
      if (this.FormObj.controls.arr["controls"][idx].controls.AppCommissionHId.value != 0)
        this.DeleteFromDatabase(this.FormObj.controls.arr["controls"][idx].controls.AppCommissionHId.value);
      var tempContentName = this.FormObj.controls.arr["controls"][idx].controls.ContentName.value;
      if (tempContentName != "") {
        var i = this.tempDDLContentName.indexOf(this.tempDDLContentName.find(x => x.Key == tempContentName));
        this.DDLContentName.push(this.tempDDLContentName[i]);
        this.tempDDLContentName.splice(i, 1);
      }
      this.lenDDLContentName++;
      if (this.totalDDLContentData == this.lenDDLContentName)
        this.FormInputObj["isDataInputed"] = false;
      this.arr.removeAt(idx);
      this.PassData(CommonConstant.MessageDel);

    }
  }

  CheckData() {
  }

  CalculateTax(CurrCode, AppNo, OriOfficeCode, AppId) {
    this.FormInputObj["isCalculated"] = true;
    var len = this.arr.controls.length;
    if (len == 0) return;
    var vendorCode = new Array();
    var vendorEmpNo = new Array();
    var trxAmt = new Array();
    for (var i = len - 1; i >= 0; i--) {
      if (this.arr.controls[i].controls.ContentName.value != "") {

        var lenAllocated = this.arr.controls[i].controls.ListAllocated.controls.length;
        var tempTrxAmt = new Array();
        let totalCommAmt = 0;
        for (var j = 0; j < lenAllocated; j++) {
          totalCommAmt += this.arr.controls[i].controls.ListAllocated.controls[j].controls.AllocationAmount.value;
          tempTrxAmt.push(this.arr.controls[i].controls.ListAllocated.controls[j].controls.AllocationAmount.value);
        }
        if (totalCommAmt == 0) {
          this.FormInputObj["isCalculated"] = false;
          return this.toastr.warningMessage("Please Allocate at least 1 item for " + this.arr.controls[i].controls.ContentName.value);
        }

        trxAmt.push(tempTrxAmt);
        if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
          let idxTempDDDLContentName = this.tempDDLContentName.indexOf(this.tempDDLContentName.find(x => x.Key == this.arr.controls[i].controls.ContentName.value));
          vendorCode.push(this.tempDDLContentName[idxTempDDDLContentName].SupplCode);
          vendorEmpNo.push(this.arr.controls[i].controls.ContentName.value);
        } else {
          vendorCode.push(this.arr.controls[i].controls.ContentName.value);
        }

      } else {
        this.FormInputObj["isCalculated"] = false;
        return this.toastr.warningMessage("Please Choose " + this.FormInputObj['labelName'] + " Name at Data " + (i + 1));
      }
    }
    if (vendorCode.length > 0) {
      var obj = {
        AppId: AppId,
        UserName: this.UserAccess.UserName,
        Office: this.UserAccess.MrOfficeTypeCode,
        VendorCode: vendorCode,
        VendorEmpNo: vendorEmpNo,
        TrxDt: this.UserAccess.BusinessDt,
        TrxAmt: trxAmt,
        RefNo: AppNo,
        TrxTypeCode: CommonConstant.TrxTypeCode,
        CurrCode: CurrCode,
        OfficeCode: OriOfficeCode,
        ExchangeRateAmt: CommonConstant.ExchangeRateAmt,
        IsSave: false,
        Content: this.FormInputObj["content"],
      };
      this.http.post<ResponseTaxDetailObj>(URLConstant.GetAppCommissionTax, obj).subscribe(
        (response) => {
          len = this.arr.controls.length;
          if (response.ResponseTaxObjs.length == len) {
            for (var i = 0; i < response.ResponseTaxObjs.length; i++) {
              var data: ResponseTaxObj = response.ResponseTaxObjs[i];
              var totalTaxAmount = 0;
              var totalVATAmount = 0;
              var totalExpenseAmount = 0;
              var totalDisburseAmount = 0;
              var totalPenaltyAmt = 0;
              for (var j = 0; j < data.ReturnObject.length; j++) {
                if (data.ReturnObject[j] == null || data.ReturnObject[j] == undefined) {
                  this.FormInputObj["isCalculated"] = false;
                  return this.toastr.warningMessage(this.FormObj.value.arr[len - 1 - i].ContentNameValue + " don't have TaxpayerNo ");
                }

                var taxAmt = 0;
                var vatAmt = 0;
                var totalPenaltyDAmount = 0;
                totalExpenseAmount += data.ReturnObject[j].ExpenseAmt;
                totalDisburseAmount += data.ReturnObject[j].DisburseAmt;
                totalPenaltyAmt += data.ReturnObject[j].PenaltyAmt;
                var TaxTrxDObjData: Array<TaxTrxDObj> = data.ReturnObject[j].TaxTrxD;
                for (var k = 0; k < TaxTrxDObjData.length; k++) {
                  totalPenaltyDAmount += TaxTrxDObjData[k].PenaltyAmt;
                  if (TaxTrxDObjData[k].TaxTypeCode == CommonConstant.TaxTypeCode) {
                    totalTaxAmount += TaxTrxDObjData[k].TaxAmt;
                    taxAmt = TaxTrxDObjData[k].TaxAmt;
                  } else if (TaxTrxDObjData[k].TaxTypeCode == CommonConstant.VATTypeCode) {
                    totalVATAmount += TaxTrxDObjData[k].TaxAmt;
                    vatAmt = TaxTrxDObjData[k].TaxAmt;
                  }
                }
                // grandTotalPenalty += totalPenaltyDAmount;
                this.FormObj.controls.arr["controls"][len - 1 - i].controls.ListAllocated.controls[j].patchValue({
                  TaxAmt: taxAmt,
                  VatAmt: vatAmt,
                  PenaltyAmt: totalPenaltyDAmount,
                });
              }
              this.FormObj.controls.arr["controls"][len - 1 - i].patchValue({
                MrIdTypeCode: data.MrIdTypeCode,
                MrTaxCalcMethodCode: data.MrTaxCalcMethodCode,
                TaxpayerNo: data.TaxpayerNo,
                TotalTaxAmount: totalTaxAmount,
                TotalVATAmount: totalVATAmount,
                TotalExpenseAmount: totalExpenseAmount,
                TotalPenaltyAmount: totalPenaltyAmt,
                TotalDisburseAmount: totalDisburseAmount,
                GrossYield: response["GrossYield"],
              });
            }
          }
          this.CheckData();
          this.PassData(CommonConstant.MessageCalculate);
        });
    }
  }

  PassData(message: string) {
    var tempObj = {
      formObj: this.FormObj,
      message: message
    };
    this.DataEmit.emit(tempObj);
  }

  ChooseContentName(ev, indexFormObj) {
    this.FormInputObj["isCalculated"] = false;
    var idx = ev.target.selectedIndex - 1;

    var obj;
    var code;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      obj = {
        Key: ev.target.selectedOptions[0].value,
        Value: ev.target.selectedOptions[0].text,
        MrSupplEmpPositionCode: this.DDLContentName[idx].MrSupplEmpPositionCode,
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idx].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idx].SupplCode,
      };
      code = this.DDLContentName[idx].SupplCode;
    } else {
      obj = {
        Key: ev.target.selectedOptions[0].value,
        Value: ev.target.selectedOptions[0].text
      };
      code = this.DDLContentName[idx].Key;

    }

    var idxTemp: number = idx;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      idxTemp = this.FormInputObj["contentObj"].indexOf(this.FormInputObj["contentObj"].find(x => x.Key == ev.target.selectedOptions[0].value));
    }
    var temp = this.GetTempRuleObj(code, idxTemp);
    if (temp == undefined || temp == null) {
      this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
        ContentName: "",
        ContentNameValue: ""
      });
      return this.toastr.warningMessage(ExceptionConstant.NO_RULE_SETTING + code);
    }

    this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
      ContentName: ev.target.selectedOptions[0].value,
      ContentNameValue: ev.target.selectedOptions[0].text
    });
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp)
      this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idx].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idx].SupplCode
      });
    this.GetDDLBankAccount(this.FormObj.controls.arr["controls"][indexFormObj].controls.ContentName.value, indexFormObj);
    this.SetRule(indexFormObj, code, idxTemp);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idx, 1);
    this.PassData("ADD");
  }

  GenerateContentName(indexFormObj, idx) {
    var obj;
    var code;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      obj = {
        Key: this.DDLContentName[indexFormObj].Key,
        Value: this.DDLContentName[indexFormObj].Value,
        MrSupplEmpPositionCode: this.DDLContentName[indexFormObj].MrSupplEmpPositionCode,
        MrSupplEmpPositionCodeDesc: this.DDLContentName[indexFormObj].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[indexFormObj].SupplCode,
      };
      code = this.DDLContentName[indexFormObj].SupplCode;
    } else {
      obj = {
        Key: this.DDLContentName[indexFormObj].Key,
        Value: this.DDLContentName[indexFormObj].Value,
      };
      code = this.DDLContentName[indexFormObj].Key;
    }

    var idxTemp: number = indexFormObj;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      idxTemp = this.FormInputObj["contentObj"].indexOf(this.FormInputObj["contentObj"].find(x => x.Key == this.DDLContentName[indexFormObj].Key));
    }
    var temp = this.GetTempRuleObj(code, idxTemp);
    if (temp == undefined || temp == null)
      return this.toastr.warningMessage(ExceptionConstant.NO_RULE_SETTING + code);

    this.FormObj.controls.arr["controls"][idx].patchValue({
      ContentName: this.DDLContentName[indexFormObj].Key,
      ContentNameValue: this.DDLContentName[indexFormObj].Value
    });

    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp)
      this.FormObj.controls.arr["controls"][idx].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[indexFormObj].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[indexFormObj].SupplCode
      });

    this.GetDDLBankAccount(this.FormObj.controls.arr["controls"][idx].controls.ContentName.value, idx);
    this.SetRule(idx, code, idxTemp);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(indexFormObj, 1);
  }

  async GenerateExistingContentName(objExist, idx) {
    var idxDDLContent = this.DDLContentName.indexOf(this.DDLContentName.find(x => x.Key == objExist.CommissionRecipientRefNo));

    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp)
      this.FormObj.controls.arr["controls"][idx].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode
      });

    this.FormObj.controls.arr["controls"][idx].patchValue({
      AppCommissionHId: objExist.AppCommissionHId,
      ContentName: this.DDLContentName[idxDDLContent].Key,
      ContentNameValue: this.DDLContentName[idxDDLContent].Value,
      BankAccountNo: objExist.BankAccNo,
      BankAccountName: objExist.BankAccName,
      BankBranch: objExist.BankBranch,
      BankCode: objExist.BankCode,
      BankName: objExist.BankName,
      MrIdTypeCode: objExist.MrTaxKindCode,
      MrTaxCalcMethodCode: objExist.MrTaxCalcMethodCode,
      TaxpayerNo: objExist.TaxpayerNo,
      TotalCommisionAmount: objExist.TotalCommissionAmt,
      TotalTaxAmount: objExist.TaxAmt,
      TotalVATAmount: objExist.VatAmt,
      TotalPenaltyAmount: objExist.PenaltyAmt,
      TotalDisburseAmount: objExist.TotalDisburseAmt,
      TotalExpenseAmount: objExist.TotalExpenseAmt,
      RowVersion: objExist.RowVersion
    });

    var obj;
    var code;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
        MrSupplEmpPositionCode: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode,
      };
      code = this.DDLContentName[idxDDLContent].SupplCode;
    } else {
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
      };
      code = this.DDLContentName[idxDDLContent].Key;
    }
    var idxTemp: number = idx;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      idxTemp = this.FormInputObj["contentObj"].indexOf(this.FormInputObj["contentObj"].find(x => x.Key == this.DDLContentName[idxDDLContent].Key));
    }
    // var tempRuleObj = this.GetTempRuleObj(code, idxDDLContent);
    this.GetDDLBankAccount(this.FormObj.controls.arr["controls"][idx].controls.ContentName.value, idx);
    this.SetRule(idx, code, idxTemp);

    var TotalCommisionAmount: number = 0;
    // patch value from existing commD
    for (var i = 0; i < this.FormObj.controls.arr["controls"][idx].controls.ListAllocated.controls.length; i++) {
      var objFound = objExist.AppCommissionD.find(x => x.MrCommissionSourceCode == this.FormObj.controls.arr["controls"][idx].controls.ListAllocated.controls[i].value.AllocationFrom);

      if (objFound != undefined || objFound != null) {
        this.FormObj.controls.arr["controls"][idx].controls.ListAllocated.controls[i].patchValue({
          AppCommissionDId: objFound.AppCommissionDId,
          AppCommissionHId: objFound.AppCommissionHId,
          AllocationAmount: objFound.CommissionAmt,
          TaxAmt: objFound.TaxAmt,
          VatAmt: objFound.VatAmt,
          PenaltyAmt: objFound.PenaltyAmt,
          RowVersion: objFound.RowVersion,
        });
        TotalCommisionAmount += objFound.CommissionAmt;
      }
    }
    // patch total
    this.FormObj.controls.arr["controls"][idx].patchValue({
      TotalCommisionAmount: TotalCommisionAmount,
    });

    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idxDDLContent, 1);
    this.PassData(CommonConstant.MessagePassData);
  }

  SortDataAllocationV2(indexFormObj, ruleObj) {
    // sort
    var arrListAllocated = this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.value;
    arrListAllocated.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
    this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.patchValue(arrListAllocated);

    var tempRuleObj = ruleObj;
    for (var i = 0; i < this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls.length; i++) {
      var idxRuleObj = tempRuleObj.indexOf(tempRuleObj.find(x => x.AllocationFrom == this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationFrom.value));
      this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.setValidators([Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(tempRuleObj[idxRuleObj].MaxAllocationAmount)]);
    }
    this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.updateValueAndValidity();
  }

  SortDataAllocation(indexFormObj, code) {
    // sort
    var arrListAllocated = this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.value;
    arrListAllocated.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
    this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.patchValue(arrListAllocated);

    var tempRuleObj = this.GetTempRuleObj(code, indexFormObj);
    for (var i = 0; i < this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls.length; i++) {
      var idxRuleObj = tempRuleObj.indexOf(tempRuleObj.find(x => x.AllocationFrom == this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationFrom.value));
      this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.setValidators([Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(tempRuleObj[idxRuleObj].MaxAllocationAmount)]);
    }
    this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.updateValueAndValidity();
  }

  GetTempRuleObj(code: string, idx: number) {
    var temp;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplier) {
      temp = this.FormInputObj["ruleObj"][code];
    } else if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      var behaviour = this.FormInputObj["contentObj"][idx].MrSupplEmpPositionCode;
      temp = this.FormInputObj["ruleObj"][code][behaviour];
    } else if (this.FormInputObj["content"] == CommonConstant.ContentReferantor) {
      temp = this.FormInputObj["ruleObj"][0];
    }
    return temp;
  }

  SetRule(indexFormObj, code, idx) {
    var temp = this.GetTempRuleObj(code, idx);
    var TotalCommisionAmount = 0;
    for (var i = 0; i < temp.length; i++) {

      let behaviour: string = temp[i].AllocationBehaviour;
      let maxAllocAmt: number = temp[i].MaxAllocationAmount;
      let allocAmt: number = temp[i].AllocationAmount;
      if (this.DictMaxIncomeForm[temp[i].AllocationFrom] != undefined && this.DictMaxIncomeForm[temp[i].AllocationFrom] != null && this.DictMaxIncomeForm[temp[i].AllocationFrom].RefundAmount > 0) {
        if (maxAllocAmt <= 0) {
          behaviour = "LOCK";
          maxAllocAmt = 0;
        }

        if (allocAmt <= 0)
          allocAmt = 0;

      } else {
        behaviour = "LOCK";
        maxAllocAmt = 0;
        allocAmt = 0;
      }

      var eachAllocationDetail = this.fb.group({
        AppCommissionDId: [0],
        AppCommissionHId: [0],
        AllocationFromSeq: [temp[i].AllocationFromSeq],
        AllocationFrom: [temp[i].AllocationFrom],
        AllocationFromDesc: [temp[i].AllocationFromDesc],
        MaxAllocationAmount: [maxAllocAmt],
        AllocationAmount: [allocAmt, [Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(maxAllocAmt)]],
        AllocationBehaviour: [behaviour],
        TaxAmt: [0],
        VatAmt: [0],
        PenaltyAmt: [0],
        RowVersion: [''],
        TotalListAllocatedDivided: [Math.ceil(temp.length / 2)]
      }) as FormGroup;
      TotalCommisionAmount += allocAmt;
      this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.push(eachAllocationDetail);

    }
    this.SortDataAllocationV2(indexFormObj, temp);

    // patch total
    this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: TotalCommisionAmount,
    });
  }

  ChangeDataLabel(indexFormObj) {
    this.FormInputObj["isCalculated"] = false;
    var len = this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls.length;
    var tempTotal = 0;
    for (var i = 0; i < len; i++) {
      var t: number = +this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.value;
      tempTotal += t;
    }
    this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: tempTotal
    });
    this.PassData(CommonConstant.MessagePassData);
  }

  ChangeBankAcc(ev, i) {
    if (ev.target.selectedIndex == 0) return;
    var idxDDL = ev.target.selectedIndex - 1;
    var ddlObj = this.FormObj.controls.arr["controls"][i].controls.DropDownList.value[idxDDL];

    this.FormObj.controls.arr["controls"][i].patchValue({
      BankAccountNo: ddlObj.Key,
      BankAccountName: ddlObj.Value,
      BankBranch: ddlObj.BankBranch,
      BankCode: ddlObj.BankCode,
      BankName: ddlObj.BankName
    });

    this.PassData(CommonConstant.MessagePassData);
  }
}
