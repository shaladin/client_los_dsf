import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, NgForm, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ResponseTaxDetailObj } from 'app/shared/model/Tax/ResponseTaxDetail.Model';
import { ResponseTaxObj } from 'app/shared/model/Tax/ResponseTax.Model';
import { TaxTrxDObj } from 'app/shared/model/Tax/TaxTrxD.Model';
import { VendorBankAccObj } from 'app/shared/model/VendorBankAcc.Model';

@Component({
  selector: 'app-form-commission-generate',
  templateUrl: './form-commission-generate.component.html',
  styleUrls: ['./form-commission-generate.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class FormCommissionGenerateComponent implements OnInit {


  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() FormInputObj: any = {};
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
    console.log(this.arr);
    console.log(this.parentForm);
    console.log(this.identifier);
    this.GetDDLContentName();
  }

  ngOnInit() {
    this.initData();
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
    console.log(this.parentForm);
    this.lenDDLContentName--;
    // if(this.FormInputObj["isAutoGenerate"]){
    // }
  }
  
  GetDDLContentName() {
    this.DDLContentName = this.FormInputObj["contentObj"];
    // console.log("DDL Content " + this.FormInputObj["content"]);
    // console.log(this.DDLContentName);
    this.tempDDLContentName = new Array();
    this.lenDDLContentName = this.DDLContentName.length;
    this.totalDDLContentData = this.DDLContentName.length;
  }

  
  ChooseContentName(ev, indexFormObj) {
    // console.log(ev);
    var idx = ev.target.selectedIndex - 1;

    var obj;
    var code;
    if (this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp) {
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
    // var temp = this.GetTempRuleObj(code, idxTemp);
    // if (temp == undefined || temp == null) {
    //   this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
    //     ContentName: "",
    //     ContentNameValue: ""
    //   });
    //   return this.toastr.warningMessage("There no rule setting for " + code);
    // }

    this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
      ContentName: ev.target.selectedOptions[0].value,
      ContentNameValue: ev.target.selectedOptions[0].text
    });
    if (this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp)
      this.parentForm.controls[this.identifier]["controls"][indexFormObj].patchValue({
        MrSupplEmpPositionCodeDesc: this.DDLContentName[idx].MrSupplEmpPositionCodeDesc,
        SupplCode: this.DDLContentName[idx].SupplCode
      });
    this.GetDDLBankAccount(this.parentForm.controls[this.identifier]["controls"][indexFormObj].controls.ContentName.value, indexFormObj);
    // this.SetRule(indexFormObj, code, idxTemp);
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idx, 1);
    // console.log(this.tempDDLContentName);
    // console.log(this.DDLContentName);
    console.log(this.parentForm);
  }
  
  GetTempRuleObj(code: string, idx: number) {
    var temp;
    if (this.FormInputObj["content"] == AdInsConstant.ContentSupplier) {
      temp = this.FormInputObj["ruleObj"][code];
      // console.log("Rule Suppl");   
    } else if (this.FormInputObj["content"] == AdInsConstant.ContentSupplierEmp) {
      // console.log(idx);
      var behaviour = this.FormInputObj["contentObj"][idx].MrSupplEmpPositionCode;
      // console.log("behaviour");
      // console.log(behaviour);
      // console.log(code);
      temp = this.FormInputObj["ruleObj"][code][behaviour];
      // console.log("Rule Suppl Emp");
    } else if (this.FormInputObj["content"] == AdInsConstant.ContentReferantor) {
      temp = this.FormInputObj["ruleObj"][0];
      // console.log("Rule Referantor");
    }
    return temp;
  }
  
  GetDDLBankAccount(code, idx) {
    var content = this.FormInputObj["content"];
    // console.log("Obj Code");
    // console.log(code);
    var obj;
    if (content == AdInsConstant.ContentSupplier) {
      obj = {
        VendorCode: code,
        RowVersion: ""
      };
      this.http.post<VendorBankAccObj>(AdInsConstant.GetListVendorBankAccByVendorCode, obj).subscribe(
        (response) => {
          // console.log("response bank");
          // console.log(response);
          var len = response["ReturnObject"].length;
          for (var i = 0; i < len; i++) {
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankName: response["ReturnObject"][i]["BankName"],
              BankBranch: ""
            }) as FormGroup;
            this.parentForm.controls[this.identifier]["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          // console.log(this.FormObj);
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (content == AdInsConstant.ContentSupplierEmp) {
      obj = {
        VendorEmpNo: code,
        VendorCode: this.parentForm.value[this.identifier][idx].SupplCode,
      };
      this.http.post<VendorBankAccObj>(AdInsConstant.GetListBankByVendorEmpNoAndVendorCode, obj).subscribe(
        (response) => {
          // console.log("response bank");
          // console.log(response);
          var len = response["ReturnObject"].length;
          for (var i = 0; i < len; i++) {
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankName: response["ReturnObject"][i]["BankName"],
              BankBranch: ""
            }) as FormGroup;
            this.parentForm.controls[this.identifier]["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          // console.log(this.FormObj);
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (content == AdInsConstant.ContentReferantor) {
      var eachDDLDetail = this.fb.group({
        Key: this.FormInputObj["BankData"].BankAccNo,
        Value: this.FormInputObj["BankData"].BankAccName,
        BankCode: this.FormInputObj["BankData"].BankCode,
        BankName: this.FormInputObj["BankData"].BankName,
        BankBranch: this.FormInputObj["BankData"].BankBranch
      }) as FormGroup;
      this.parentForm.controls[this.identifier]["controls"][idx].controls.DropDownList.push(eachDDLDetail);
      // console.log(this.FormObj);
    }
  }
}
