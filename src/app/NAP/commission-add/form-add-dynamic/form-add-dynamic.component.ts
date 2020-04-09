import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { error } from 'protractor';

@Component({
  selector: 'app-form-add-dynamic',
  templateUrl: './form-add-dynamic.component.html',
  styleUrls: ['./form-add-dynamic.component.scss'],
  providers: [NGXToastrService]
})

export class FormAddDynamicComponent implements OnInit {

  @Output('update') DataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() FormInputObj;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService
  ) { }

  FormObj = this.fb.group({
    arr: this.fb.array([])
  });

  arr;
  DDLContentName = new Array();
  DDLBankAccount = new Array();
  UserAccess;
  ngOnInit() {
    console.log("User Access");
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.UserAccess = JSON.parse(localStorage.getItem("UserAccess"));
    this.arr = this.FormObj.get('arr') as FormArray;
    // console.log(this.FormInputObj);
    this.GetDDLContentName();
    console.log(this.FormInputObj["ruleObj"]);
  }

  lenDDLContentName = 0;
  tempDDLContentName;
  GetDDLContentName(){
    this.DDLContentName = this.FormInputObj["contentObj"];
    // console.log(this.DDLContentName);
    this.tempDDLContentName = new Array();
    this.lenDDLContentName = this.DDLContentName.length;
  }

  GetDDLBankAccount(code, idx){
    var content = this.FormInputObj["content"];
    // console.log("Obj Code");
    // console.log(code);
    var url;
    var obj;
    if(content == "Supplier"){
      url = environment.FoundationR3Url + AdInsConstant.GetListVendorBankAccByVendorCode;
      obj = {
        VendorCode: code,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) =>{
          console.log(response);
          var len = response["ReturnObject"].length;
          for(var i=0;i<len;i++){
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankBranch: ""
            }) as FormGroup;
            this.FormObj.controls.arr["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          // console.log(this.FormObj);
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(content == "Supplier Employee"){
      url = environment.FoundationR3Url + AdInsConstant.GetListVendorBankAccByListVendorEmpNo;
      obj = {
        VendorEmpNo: code,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) =>{
          console.log(response);
          var len = response["ReturnObject"].length;
          for(var i=0;i<len;i++){
            var eachDDLDetail = this.fb.group({
              Key: response["ReturnObject"][i]["BankAccountNo"],
              Value: response["ReturnObject"][i]["BankAccountName"],
              BankCode: response["ReturnObject"][i]["BankCode"],
              BankBranch: ""
            }) as FormGroup;
            this.FormObj.controls.arr["controls"][idx].controls.DropDownList.push(eachDDLDetail);
          }
          // console.log(this.FormObj);
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(content == "Referantor"){
      var eachDDLDetail = this.fb.group({
        Key: this.FormInputObj["BankData"].BankAccNo,
        Value: this.FormInputObj["BankData"].BankAccName,
        BankCode: this.FormInputObj["BankData"].BankCode,
        BankBranch: this.FormInputObj["BankData"].BankBranch
      }) as FormGroup;
      this.FormObj.controls.arr["controls"][idx].controls.DropDownList.push(eachDDLDetail);
      // console.log(this.FormObj);
    }
  }

  AddNewDataForm(){
    var NewDataForm = this.fb.group({
      ContentName: ['', Validators.required],
      ContentNameValue: [''],
      BankAccountNo: ['', Validators.required],
      BankAccountName: [''],
      BankBranch: [''],
      BankCode: [''],
      TaxAmount: [0, Validators.pattern("^[0-9]+$")],
      TotalCommisionAmount: [0, Validators.pattern("^[0-9]+$")],
      VATAmount: [0, Validators.pattern("^[0-9]+$")],
      ListAllocated: this.fb.array([]),
      DropDownList: this.fb.array([])
    }) as FormGroup;
    this.arr.push(NewDataForm);
    // console.log(this.FormObj);
    this.lenDDLContentName--;
  }

  DeleteDataForm(idx){
    // console.log(idx);
    if (confirm('Are you sure to delete this record?')) {
      var tempContentName = this.FormObj.controls.arr["controls"][idx].controls.ContentName.value;
      if(tempContentName != ""){
        var i = this.tempDDLContentName.indexOf(this.tempDDLContentName.find(x => x.Key == tempContentName));
        this.DDLContentName.push(this.tempDDLContentName[i]);
        this.tempDDLContentName.splice(i,1);
      }
      this.lenDDLContentName++;
      // console.log(this.tempDDLContentName);
      // console.log(this.DDLContentName);
      this.arr.removeAt(idx);
      this.PassData();

    }
  }

  CheckData(){
    console.log("User Access");
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
    console.log(this.FormObj);
  }

  CalculateTax(CurrCode, AppNo, OriOfficeCode){
    var len = this.arr.controls.length;
    var vendorCode = new Array();
    var trxAmt = new Array();
    for(var i = len-1; i >= 0; i--){
      if(this.arr.controls[i].controls.ContentName.value != ""){
        vendorCode.push(this.arr.controls[i].controls.ContentName.value);
        trxAmt.push(this.arr.controls[i].controls.TotalCommisionAmount.value);
      }else{
        this.DeleteDataForm(i);
        len--;
      }
    }
    if(vendorCode.length > 0){
      var obj = {
        UserName: this.UserAccess.UserName,
        Office: this.UserAccess.MrOfficeTypeCode,
        VendorCode: vendorCode,
        TrxDt: this.UserAccess.BusinessDt,
        TrxAmt: trxAmt,
        RefNo: AppNo,
        TrxTypeCode: AdInsConstant.AppCom,
        CurrCode: CurrCode,
        OfficeCode: OriOfficeCode,
        ExchangeRateAmt: AdInsConstant.ExchangeRateAmt, 
        IsSave: true,
        Content: this.FormInputObj["content"],
      };
      var url = environment.losUrl + AdInsConstant.GetAppCommissionTax;
      this.http.post(url, obj).subscribe(
        (response) => {
          console.log("response Tax");
          console.log(response);
          var temp = response["ReturnObject"];
          len = this.arr.controls.length;
          if(temp.length == len){
            for(var i=0;i<temp.length;i++){
              console.log(len - i - 1);
              var data = temp[i]["ReturnObject"];
              var taxAmount = 0;
              var vATAmount = 0;
              for(var j=0;j<data.length;j++){
                if(data[j].TaxTypeCode == AdInsConstant.TaxTypeCode){
                  taxAmount = data[j].TaxAmt;
                }else if(data[j].TaxTypeCode == AdInsConstant.VATTypeCode){
                  vATAmount = data[j].TaxAmt;
                }
                this.FormObj.controls.arr["controls"][len - 1 - i].patchValue({
                  TaxAmount: taxAmount,
                  VATAmount: vATAmount
                });
              }
            }
          }
          this.CheckData();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  PassData(){
    // console.log("change data");
    this.DataEmit.emit(this.FormObj);
  }
  
  ChooseContentName(ev, indexFormObj){
    // console.log(ev);
    var idx = ev.target.selectedIndex - 1;
    this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
      ContentName: ev.target.selectedOptions[0].value,
      ContentNameValue: ev.target.selectedOptions[0].text
    });
    var obj = {
      Key: ev.target.selectedOptions[0].value,
      Value: ev.target.selectedOptions[0].text
    };
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idx,1);
    // console.log(this.tempDDLContentName);
    // console.log(this.DDLContentName);
    this.GetDDLBankAccount(this.FormObj.controls.arr["controls"][indexFormObj].controls.ContentName.value, idx);
    this.SetRule(indexFormObj, this.FormObj.controls.arr["controls"][indexFormObj].controls.ContentName.value, idx);
    this.PassData();
  }

  TotalCommisionAmount;
  SetRule(indexFormObj, code, idx){
    if (this.FormInputObj["content"] == "Supplier") {
      var temp = this.FormInputObj["ruleObj"][code];
      console.log("Rule Suppl");   
    } else if (this.FormInputObj["content"] == "Supplier Employee") {
      var behaviour = this.FormInputObj["contentObj"][idx].MrSupplEmpPositionCode;
      var temp = this.FormInputObj["ruleObj"][code][behaviour];
      console.log("Rule Suppl Emp");
    } else if (this.FormInputObj["content"] == "Referantor") {
      var temp = this.FormInputObj["ruleObj"][0];
      console.log("Rule Referantor");
    }
    this.TotalCommisionAmount = 0;
    for(var i=0;i<temp.length;i++){
      var eachDDLDetail = this.fb.group({
        AllocationFrom: temp[i].AllocationFrom,
        MaxAllocationAmount: temp[i].MaxAllocationAmount,
        AllocationAmount: temp[i].AllocationAmount,
        AllocationBehaviour: temp[i].AllocationBehaviour,
        TotalListAllocatedDivided: Math.ceil(temp.length / 2)
      }) as FormGroup;
      this.TotalCommisionAmount += temp[i].AllocationAmount;
      this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.push(eachDDLDetail);
      // this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[idx].controls.AllocationFrom.value;
    }
    this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: this.TotalCommisionAmount,
    });
    console.log(this.FormObj);
  }

  ChangeDataLabel(indexFormObj){
    // console.log(idx);
    var len = this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls.length;
    var tempTotal = 0;
    for(var i = 0; i < len; i++){
      var t: number = +this.FormObj.controls.arr["controls"][indexFormObj].controls.ListAllocated.controls[i].controls.AllocationAmount.value;
      tempTotal += t;
    }
    this.FormObj.controls.arr["controls"][indexFormObj].patchValue({
      TotalCommisionAmount: tempTotal
    });
    this.PassData();
  }

  ChangeBankAcc(ev, i){
    // console.log(ev);
    var idxDDL = ev.target.selectedIndex - 1;
    var ddlObj = this.FormObj.controls.arr["controls"][i].controls.DropDownList.value[idxDDL];
    // console.log(ddlObj);
    
    this.FormObj.controls.arr["controls"][i].patchValue({
      BankAccountNo: ddlObj.Key,
      BankAccountName: ddlObj.Value,
      BankBranch: ddlObj.BankBranch,
      BankCode: ddlObj.BankCode
    });
    
    this.PassData();
  }
}
