import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, NgForm, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ResponseTaxDetailObj } from 'app/shared/model/Tax/ResponseTaxDetail.Model';
import { ResponseTaxObj } from 'app/shared/model/Tax/ResponseTax.Model';
import { TaxTrxDObj } from 'app/shared/model/Tax/TaxTrxD.Model';
import { VendorBankAccObj } from 'app/shared/model/VendorBankAcc.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';
import { AppCommissionDObj } from 'app/shared/model/AppCommissionDObj.Model';

@Component({
  selector: 'app-form-commission-generate',
  templateUrl: './form-commission-generate.component.html',
  styleUrls: ['./form-commission-generate.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class FormCommissionGenerateComponent implements OnInit {


  @Output('update') DataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() FormInputObj: any = {};
  @Input() DictMaxIncomeForm: any = {};
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,) { }

  arr: FormArray;
  DDLContentName: Array<any>;
  tempDDLContentName: Array<any>;
  lenDDLContentName: number = 0;
  totalDDLContentData: number = 0;
  initData() {
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    this.arr = this.parentForm.get(this.identifier) as FormArray;
    this.GetDDLContentName();
  }

  ngOnInit() {
    this.initData();
    this.GenerateAuto();
  }

  GenerateAuto(){
    if(this.FormInputObj["isAutoGenerate"]){
      let tempTotalData=this.lenDDLContentName;
      for(var i=0;i<tempTotalData;i++){
        this.AddNewDataForm();
        this.NewAutoData();
      }
    }
  }

  NewAutoData(){
    let idxDDLContent = 0;
    let indexFormObj = this.parentForm.value[this.identifier].length - 1;
    var obj;
    var code;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
        MrSupplEmpPositionCode: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode,
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
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

    var temp = this.GetTempRuleObj(code, this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode);
    if (temp == undefined || temp == null) {
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        ContentName: "",
        ContentNameValue: ""
      });
      return this.toastr.warningMessage("There no rule setting for " + code);
    }
    
    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      ContentName: this.DDLContentName[idxDDLContent].Key,
      ContentNameValue: this.DDLContentName[idxDDLContent].Value
    });
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp)
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode
      });
    this.GetDDLBankAccount(this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ContentName.value, indexFormObj);
    this.SetRule(code, indexFormObj, this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idxDDLContent, 1);
    this.PassData();
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

  GetDDLContentName() {
    this.DDLContentName = this.FormInputObj["contentObj"];
    this.tempDDLContentName = new Array();
    this.lenDDLContentName = this.DDLContentName.length;
    this.totalDDLContentData = this.DDLContentName.length;
  }

  ChooseContentName(ev, indexFormObj) {
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
    
    // var idxTemp: number = idx;
    // if (this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp) {
      //   idxTemp = this.FormInputObj["contentObj"].indexOf(this.FormInputObj["contentObj"].find(x => x.Key == ev.target.selectedOptions[0].value));
      // }
    var temp = this.GetTempRuleObj(code, this.DDLContentName[idx].MrSupplEmpPositionCode);
    if (temp == undefined || temp == null) {
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        ContentName: "",
        ContentNameValue: ""
      });
      return this.toastr.warningMessage("There no rule setting for " + code);
    }

    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      ContentName: ev.target.selectedOptions[0].value,
      ContentNameValue: ev.target.selectedOptions[0].text
    });
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp)
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idx].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idx].SupplCode
      });
    this.GetDDLBankAccount(this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ContentName.value, indexFormObj);
    this.SetRule(code, indexFormObj, this.DDLContentName[idx].MrSupplEmpPositionCode);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idx, 1);
    this.PassData();
  }

  SetRule(supplCode: string, formIdx: number, role: string) {
    var ruleObj = this.GetTempRuleObj(supplCode, role);
    var TotalCommisionAmount: number = 0;
    for (var i = 0; i < ruleObj.length; i++) {

      let behaviour: string = ruleObj[i].AllocationBehaviour;
      let maxAllocAmt: number = ruleObj[i].MaxAllocationAmount;
      let allocAmt: number = ruleObj[i].AllocationAmount;
      if (this.DictMaxIncomeForm[ruleObj[i].AllocationFrom] != undefined && this.DictMaxIncomeForm[ruleObj[i].AllocationFrom] != null && this.DictMaxIncomeForm[ruleObj[i].AllocationFrom].RefundAmount > 0) {
        if(ruleObj[i].MaxAllocationAmount > this.DictMaxIncomeForm[ruleObj[i].AllocationFrom].RefundAmount)
          maxAllocAmt = this.DictMaxIncomeForm[ruleObj[i].AllocationFrom].RefundAmount;

        if (maxAllocAmt <= 0) {
          behaviour = CommonConstant.RuleBehaviourLock;
          maxAllocAmt = 0;
        }

        if (allocAmt >= maxAllocAmt)
          allocAmt = maxAllocAmt;
        
        if (allocAmt <= 0)
          allocAmt = 0;

      } else {
        behaviour = CommonConstant.RuleBehaviourLock;
        maxAllocAmt = 0;
        allocAmt = 0;
      }

      var eachAllocationDetail = this.fb.group({
        AppCommissionDId: [0],
        AppCommissionHId: [0],
        AllocationFromSeq: [ruleObj[i].AllocationFromSeq],
        AllocationFrom: [ruleObj[i].AllocationFrom],
        AllocationFromDesc: [ruleObj[i].AllocationFromDesc],
        MaxAllocationAmount: [maxAllocAmt],
        AllocationAmount: [allocAmt, [Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.max(this.DictMaxIncomeForm[ruleObj[i].AllocationFrom].RefundAmount)]],
        AllocationBehaviour: [behaviour],
        TaxAmt: [0],
        VatAmt: [0],
        PenaltyAmt: [0],
        RowVersion: [''],
        TotalListAllocatedDivided: [Math.ceil(ruleObj.length / 2)]
      }) as FormGroup;
      TotalCommisionAmount += allocAmt;
      this.parentForm.controls[this.identifier]["controls"][formIdx].controls.ListAllocated.push(eachAllocationDetail);

    }

    // patch total
    this.parentForm.controls[this.identifier]["controls"][formIdx].patchValue({
      TotalCommisionAmount: TotalCommisionAmount,
    });
  }

  GetTempRuleObj(supplCode: string, role: string) {
    var tempObj;
    console.log("GetTempRuleObj: " + this.FormInputObj['content']);
    console.log(this.FormInputObj);
    if (this.FormInputObj['content'] == CommonConstant.ContentSupplier) {
      console.log("Is Supplier Commission..");
      console.log(supplCode);
      tempObj = this.FormInputObj['ruleObj'][supplCode];
    } else if (this.FormInputObj['content'] == CommonConstant.ContentSupplierEmp) {
      tempObj = this.FormInputObj['ruleObj'][supplCode][role];
    } else if (this.FormInputObj['content'] == CommonConstant.ContentReferantor) {
      tempObj = this.FormInputObj['ruleObj'][supplCode];
    }
    return tempObj;
  }

  GetDDLBankAccount(code, idx) {
    var content = this.FormInputObj["content"];
    let idxDefault = 0;
    var obj;
    if (content == CommonConstant.ContentSupplier) {
      obj = {
        VendorCode: code,
        RowVersion: ""
      };
      this.http.post<VendorBankAccObj>(URLConstant.GetListVendorBankAccByVendorCode, {Code : code}).subscribe(
        (response) => {
          var len = response["ReturnObject"].length;
          for (var i = 0; i < len; i++) {
            if (response["ReturnObject"][i].IsDefault == true) idxDefault = i;
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankName: response["ReturnObject"][i]["BankName"],
              BankBranch: ""
            }) as FormGroup;
            this.parentForm.controls[this.identifier]["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          if (len == 1) idxDefault = 0;
          this.SetDefaultDDLBankAcc(idx, idxDefault);
        });
    } else if (content == CommonConstant.ContentSupplierEmp) {
      obj = {
        VendorEmpNo: code,
        VendorCode: this.parentForm.value[this.identifier][idx].SupplCode,
      };
      this.http.post<VendorBankAccObj>(URLConstant.GetListBankByVendorEmpNoAndVendorCode, obj).subscribe(
        (response) => {
          var len = response["ReturnObject"].length;
          for (var i = 0; i < len; i++) {
            if (response["ReturnObject"][i].IsDefault == true) idxDefault = i;
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankName: response["ReturnObject"][i]["BankName"],
              BankBranch: ""
            }) as FormGroup;
            this.parentForm.controls[this.identifier]["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          if (len == 1) idxDefault = 0;
          this.SetDefaultDDLBankAcc(idx, idxDefault);
        });
    } else if (content == CommonConstant.ContentReferantor) {
      this.http.post(URLConstant.GetRefBankByBankCodeAsync, { Code: this.FormInputObj["BankData"].BankCode }).toPromise().then(
        (response) => {
          var eachDDLDetail = this.fb.group({
            Key: this.FormInputObj["BankData"].BankAccNo,
            Value: this.FormInputObj["BankData"].BankAccName,
            BankCode: this.FormInputObj["BankData"].BankCode,
            BankName: response["BankName"],
            BankBranch: this.FormInputObj["BankData"].BankBranch
          }) as FormGroup;
          this.parentForm.controls[this.identifier]["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          this.SetDefaultDDLBankAcc(idx, idxDefault);
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }
  }

  SetDefaultDDLBankAcc(idxForm: number, idxDefault: number) {
    var ddlObj = this.parentForm.controls[this.identifier]["controls"][idxForm].controls.DropDownList.value[idxDefault];

    this.parentForm.controls[this.identifier]["controls"][idxForm].patchValue({
      BankAccountNo: ddlObj.Key,
      BankAccountName: ddlObj.Value,
      BankBranch: ddlObj.BankBranch,
      BankCode: ddlObj.BankCode,
      BankName: ddlObj.BankName
    });
  }

  DeleteDataForm(idx) {
    if (confirm('Are you sure to delete this record?')) {
      this.FormInputObj["isCalculated"] = false;
      if (this.parentForm.controls[this.identifier]["controls"][idx].controls.AppCommissionHId.value != 0)
        this.DeleteFromDatabase(this.parentForm.controls[this.identifier]["controls"][idx].controls.AppCommissionHId.value);
      var tempContentName = this.parentForm.controls[this.identifier]["controls"][idx].controls.ContentName.value;
      if (tempContentName != "") {
        var i = this.tempDDLContentName.indexOf(this.tempDDLContentName.find(x => x.Key == tempContentName));
        this.DDLContentName.push(this.tempDDLContentName[i]);
        this.tempDDLContentName.splice(i, 1);
      }
      this.lenDDLContentName++;
      if (this.totalDDLContentData == this.lenDDLContentName)
        this.FormInputObj["isDataInputed"] = false;
      this.arr.removeAt(idx);
      this.PassData();
    }
  }

  DeleteFromDatabase(AppCommissionHId) {
    var obj = { AppCommissionHId: AppCommissionHId };
    this.http.post(URLConstant.DeleteAppCommissionData, obj).subscribe(
      (response) => {
      });
  }

  ChangeBankAcc(ev, i) {
    if (ev.target.selectedIndex == 0) return;
    var idxDDL = ev.target.selectedIndex - 1;
    var ddlObj = this.parentForm.controls[this.identifier]["controls"][i].controls.DropDownList.value[idxDDL];

    this.parentForm.controls[this.identifier]["controls"][i].patchValue({
      BankAccountNo: ddlObj.Key,
      BankAccountName: ddlObj.Value,
      BankBranch: ddlObj.BankBranch,
      BankCode: ddlObj.BankCode,
      BankName: ddlObj.BankName
    });
  }
  
  ChangeDataLabel(indexFormObj) {
    this.FormInputObj["isCalculated"] = false;
    var len = this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls.length;
    var tempTotal = 0;
    for (var i = 0; i < len; i++) {
      var t: number = +this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.value;
      tempTotal += t;
    }
    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: tempTotal
    });
    this.PassData();
  }

  PatchDataExisting(appCommObj: any) {
    this.AddNewDataForm();
    
    let idxDDLContent = this.DDLContentName.findIndex(x => x.Key == appCommObj.CommissionRecipientRefNo);
    let indexFormObj = this.parentForm.value[this.identifier].length - 1;
    var obj;
    var code;
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp) {
      obj = {
        Key: this.DDLContentName[idxDDLContent].Key,
        Value: this.DDLContentName[idxDDLContent].Value,
        MrSupplEmpPositionCode: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode,
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
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
    var temp = this.GetTempRuleObj(code, this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode);
    if (temp == undefined || temp == null) {
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        ContentName: "",
        ContentNameValue: ""
      });
      return this.toastr.warningMessage("There no rule setting for " + code);
    }
    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({      
      AppCommissionHId: appCommObj.AppCommissionHId,
      ContentName: this.DDLContentName[idxDDLContent].Key,
      ContentNameValue: this.DDLContentName[idxDDLContent].Value,
      BankAccountNo: appCommObj.BankAccNo,
      BankAccountName: appCommObj.BankAccName,
      BankBranch: appCommObj.BankBranch,
      BankCode: appCommObj.BankCode,
      BankName: appCommObj.BankName,
      MrIdTypeCode: appCommObj.MrTaxKindCode,
      MrTaxCalcMethodCode: appCommObj.MrTaxCalcMethodCode,
      TaxpayerNo: appCommObj.TaxpayerNo,
      TotalCommisionAmount: appCommObj.TotalCommissionAmt,
      TotalExpenseAmount: appCommObj.TotalExpenseAmt,
      TotalTaxAmount: appCommObj.TaxAmt,
      TotalVATAmount: appCommObj.VatAmt,
      TotalPenaltyAmount: appCommObj.PenaltyAmt,
      TotalDisburseAmount: appCommObj.TotalDisburseAmt,
      RowVersion: appCommObj.RowVersion,
    });
    if (this.FormInputObj["content"] == CommonConstant.ContentSupplierEmp)
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idxDDLContent].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idxDDLContent].SupplCode
      });
    this.GetDDLBankAccount(this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ContentName.value, indexFormObj);
    this.SetRule(code, indexFormObj, this.DDLContentName[idxDDLContent].MrSupplEmpPositionCode);
    
    for (var i = 0; i < appCommObj.AppCommissionD.length; i++) {
      let idxFromRuleObj = temp.findIndex(x => x.AllocationFrom == appCommObj.AppCommissionD[i].MrCommissionSourceCode);
      if (idxFromRuleObj >= 0) {
        var allocAmt = 0;
        if (this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated["value"][idxFromRuleObj].AllocationBehaviour != "LOCK") {
          allocAmt = appCommObj.AppCommissionD[i].CommissionAmt;
        }
        this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated["controls"][idxFromRuleObj].patchValue({
          AppCommissionDId: appCommObj.AppCommissionD[i].AppCommissionDId,
          AppCommissionHId: appCommObj.AppCommissionD[i].AppCommissionHId,
          AllocationAmount: allocAmt,
          TaxAmt: appCommObj.AppCommissionD[i].TaxAmt,
          VatAmt: appCommObj.AppCommissionD[i].VatAmt,
          PenaltyAmt: appCommObj.AppCommissionD[i].PenaltyAmt,
          RowVersion: appCommObj.AppCommissionD[i].RowVersion,
        })
      } 
    }
    this.ReCalcListAllocated(indexFormObj);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idxDDLContent, 1);
  }

  ReCalcListAllocated(indexFormObj: number) {
    let totalCommAmt = 0;
    for (var i = 0; i < this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.value.length; i++) {
      totalCommAmt += this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ListAllocated.value[i].AllocationAmount;
    }

    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: totalCommAmt,
    });
  }

  PassData(){
    this.DataEmit.emit();
  }
}
