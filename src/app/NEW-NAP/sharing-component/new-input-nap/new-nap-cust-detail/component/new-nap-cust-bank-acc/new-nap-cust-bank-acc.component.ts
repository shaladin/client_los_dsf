import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, NgForm, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustBankStmntObj } from 'app/shared/model/AppCustBankStmntObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-nap-cust-bank-acc',
  templateUrl: './new-nap-cust-bank-acc.component.html',
  styles: []
})
export class NewNapCustBankAccComponent implements OnInit {
  @Input() AppCustId: number;
  @Input() AppCustBankAccList: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  @Output() OutputObj: EventEmitter<any> = new EventEmitter();
  Mode: string = "Add";
  Title: string = "Add Bank Account"
  DefaultMonth: string;
  IsDetail: boolean = false;
  BankAccObj: AppCustBankAccObj = new AppCustBankAccObj();
  BankStmntObj: AppCustBankStmntObj = new AppCustBankStmntObj();
  MonthObj: Array<KeyValueObj> = new Array();
  AppCustBankStmntList: Array<AppCustBankStmntObj> = new Array();
  ListBankStmntObj: Array<AppCustBankStmntObj> = new Array();
  RowAppCustBankStmnt: number;
  InputLookupBankObj: InputLookupObj = new InputLookupObj();

  BankAccStmntForm = this.fb.group({
    AppCustBankAccId: [0],
    BankCode: [''],
    BankBranch: ['', Validators.required],
    BankAccName: ['', Validators.required],
    BankAccNo: ['', Validators.required],
    IsDefault: [false],
    IsActive: [false],
    BankStmntObjs: this.fb.array([])
  })

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) { }

  ngOnInit() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMonth }).subscribe(
      (response) => {
        this.MonthObj = response[CommonConstant.ReturnObj];
        if (this.MonthObj.length > 0) {
          this.DefaultMonth = this.MonthObj[0].Key;
        }
      }
    );

    this.InputLookupBankObj = new InputLookupObj();
    this.InputLookupBankObj.urlJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupBankObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupBankObj.pagingJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.genericJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.isReady = true;
    
    this.GetAppCustBankAccList();
    this.FormValidity(this.IsDetail, true);
  }

  GetAppCustBankAccList() {
    this.http.post<Array<AppCustBankAccObj>>(URLConstant.GetAppCustBankAccAndStatementForView, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        this.AppCustBankAccList = response["AppCustBankAccList"]
      });
  }

  GetBank(event){
    this.BankAccObj.BankCode = event.BankCode;
  }

  CustBankHandler(Mode: string, BankAccAndStmntObj: AppCustBankAccObj = undefined, idx: number = 0) {
    this.ClearForm();

    switch (Mode) {
      case "Add":
        this.IsDetail = true;
        this.Mode = "Add";
        break;
      case "Edit":
        this.IsDetail = true;
        this.Mode = "Edit";
        this.Title = "Edit Bank Account";
        this.SetForEdit(BankAccAndStmntObj);
        break;
      case "Delete":
        this.IsDetail = false;
        this.DeleteBankAcc(BankAccAndStmntObj, idx);
        break;
      case "Cancel":
        this.IsDetail = false;
        break;
    }
    this.FormValidity(this.IsDetail);
    this.OutputObj.emit({Key: 'IsDetail', Value: this.IsDetail});
  }

  SetForEdit(BankAccAndStmntObj: AppCustBankAccObj){
    this.InputLookupBankObj.nameSelect = BankAccAndStmntObj.BankName;
    this.InputLookupBankObj.jsonSelect = {BankName: BankAccAndStmntObj.BankName};
    this.BankAccObj.AppCustBankAccId = BankAccAndStmntObj.AppCustBankAccId;
    this.BankAccObj.BankCode = BankAccAndStmntObj.BankCode;
    this.BankAccObj.RowVersion = BankAccAndStmntObj.RowVersion;

    this.BankAccStmntForm.patchValue({
      AppCustBankAccId: BankAccAndStmntObj.AppCustBankAccId,
      BankBranch : BankAccAndStmntObj.BankBranch,
      BankAccName : BankAccAndStmntObj.BankAccName,
      BankAccNo : BankAccAndStmntObj.BankAccNo,
      IsDefault : BankAccAndStmntObj.IsDefault,
      IsActive : BankAccAndStmntObj.IsActive,
    }) 

    if (BankAccAndStmntObj.AppCustBankStmntObjs != undefined) {
      var bankStmnObjs = this.BankAccStmntForm.controls['BankStmntObjs'] as FormArray;
      for (let i = 0; i < BankAccAndStmntObj.AppCustBankStmntObjs.length; i++) {
        bankStmnObjs.push(this.AddGroup(BankAccAndStmntObj.AppCustBankStmntObjs[i]));
      }
    }

    this.AppCustBankStmntList = BankAccAndStmntObj.AppCustBankStmntObjs;
  }

  ClearForm(){
    this.BankAccStmntForm.patchValue({
      AppCustBankAccId: 0,
      BankCode: "",
      BankBranch: "",
      BankAccName: "",
      BankAccNo: "",
      IsDefault: false,
      IsActive: false
    })

    this.InputLookupBankObj.nameSelect = "";
    this.InputLookupBankObj.jsonSelect = {BankName: ""};

    // reset bank statement
    var bankStmnObjs = this.BankAccStmntForm.controls['BankStmntObjs'] as FormArray;
    bankStmnObjs.reset();
    while (bankStmnObjs.length !== 0) bankStmnObjs.removeAt(0)
  }

  FormValidity(IsDetail: boolean, IsFirstInit: boolean = false) {
    if (IsDetail) {
      this.InputLookupBankObj.isRequired = true;
      this.BankAccStmntForm.controls.BankBranch.setValidators([Validators.required]);
      this.BankAccStmntForm.controls.BankAccName.setValidators([Validators.required]);
      this.BankAccStmntForm.controls.BankAccNo.setValidators([Validators.required]);
      for (let i = 0; i < this.BankAccStmntForm.controls.BankStmntObjs["controls"].length; i++) {
        this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["Month"].setValidators([Validators.required]);
        this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["Year"].setValidators([Validators.required]);
        this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["DebitAmt"].setValidators([Validators.required]);
        this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["CreditAmt"].setValidators([Validators.required]);
        this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["BalanceAmt"].setValidators([Validators.required]);
      }
    } else {
      this.InputLookupBankObj.isRequired = false;
      this.BankAccStmntForm.controls.BankBranch.clearValidators();
      this.BankAccStmntForm.controls.BankAccName.clearValidators();
      this.BankAccStmntForm.controls.BankAccNo.clearValidators();
      if (!IsFirstInit) {
        for (let i = 0; i < this.BankAccStmntForm.controls.BankStmntObjs["controls"].length; i++) {
          this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["Month"].clearValidators();
          this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["Year"].clearValidators();
          this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["DebitAmt"].clearValidators();
          this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["CreditAmt"].clearValidators();
          this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["BalanceAmt"].clearValidators();
        }
      }
    }
    this.BankAccStmntForm.updateValueAndValidity();
  }

  AddRowCustBankStmnt() {
    var bankStmnObjs = this.BankAccStmntForm.controls['BankStmntObjs'] as FormArray;
    bankStmnObjs.push(this.AddGroup(undefined));
    this.FormValidity(this.IsDetail);
  }

  AddGroup(bankStmntObj) {
    if (bankStmntObj == undefined) {
      var dateYear = 0;
      if (this.BankAccStmntForm.value['BankStmntObjs'].length > 0)
        dateYear = this.BankAccStmntForm.value['BankStmntObjs'][0].Year;
      else {
        var userAcc = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
        var month = new Date(userAcc.BusinessDt).getMonth();
        dateYear = new Date(userAcc.BusinessDt).getFullYear();
        if (month == 0) dateYear--;
      }

      return this.fb.group({
        Month: [this.DefaultMonth, [Validators.required, Validators.maxLength(2)]],
        Year: [dateYear, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
        DebitAmt: [0, Validators.required],
        CreditAmt: [0, Validators.required],
        BalanceAmt: [0, Validators.required]
      })
    } else {
      return this.fb.group({
        Month: [bankStmntObj.Month, [Validators.required, Validators.maxLength(2)]],
        Year: [bankStmntObj.Year, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
        DebitAmt: [bankStmntObj.DebitAmt, Validators.required],
        CreditAmt: [bankStmntObj.CreditAmt, Validators.required],
        BalanceAmt: [bankStmntObj.BalanceAmt, Validators.required]
      })
    }
  }

  RemoveCustBankStmnt(i) {
    var confirmation = confirm(ExceptionConstant.DELETE_CONFIRMATION);
    if (confirmation == true) {
      var formArray = this.BankAccStmntForm.get('BankStmntObjs') as FormArray;
      formArray.removeAt(i);
      this.RowAppCustBankStmnt--;
    }
  }

  DeleteBankAcc(BankAccAndStmntObj: AppCustBankAccObj, idx){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      if(this.BankAccStmntForm.controls.AppCustBankAccId.value && this.BankAccStmntForm.controls.AppCustBankAccId.value > 0){
        this.http.post(URLConstant.DeleteAppCustBankAccAndStmnt, {BankAccObj : BankAccAndStmntObj}).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.GetAppCustBankAccList();
          });
      }
      else{
        this.AppCustBankAccList.splice(idx, 1);
        this.toastr.successMessage("Success");
      }
    }
  }

  DeleteBankStmnt(index: number){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var bankStmnObjs = this.BankAccStmntForm.controls['BankStmntObjs'] as FormArray;
      bankStmnObjs.removeAt(index);

      if(this.AppCustBankStmntList[index].AppCustBankStmntId && this.AppCustBankStmntList[index].AppCustBankStmntId > 0){
        this.http.post(URLConstant.DeleteAppCustBankStmnt, this.AppCustBankStmntList[index]).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
          });
      }
      else{
        this.toastr.successMessage("Success");
      }
    }
  }

  SaveForm(enjiForm: NgForm) {
    this.ListBankStmntObj = new Array();
    if(this.BankAccStmntForm.controls.AppCustBankAccId.value && this.BankAccStmntForm.controls.AppCustBankAccId.value > 0){
      this.BankAccObj.AppCustBankAccId = this.BankAccStmntForm.controls.AppCustBankAccId.value;
      this.BankAccObj.AppCustId = this.AppCustId;
      this.BankAccObj.BankBranch = this.BankAccStmntForm.controls.BankBranch.value;
      this.BankAccObj.BankAccName = this.BankAccStmntForm.controls.BankAccName.value;
      this.BankAccObj.BankAccNo = this.BankAccStmntForm.controls.BankAccNo.value;
      this.BankAccObj.IsDefault = this.BankAccStmntForm.controls.IsDefault.value;
      this.BankAccObj.IsActive = this.BankAccStmntForm.controls.IsActive.value;
      
      for(let i = 0; i < this.BankAccStmntForm.controls.BankStmntObjs.value.length; i++){
        this.BankStmntObj = this.BankAccStmntForm.controls.BankStmntObjs.value[i]
        var monthObj = this.MonthObj.find(x => x.Key == this.BankStmntObj.Month);
        this.BankStmntObj.MonthName = monthObj.Value;
        this.ListBankStmntObj.push(this.BankStmntObj);
      }
      this.BankAccObj.AppCustBankStmntObjs = this.ListBankStmntObj;
      this.BankAccObj.ListBankStmntObj = this.ListBankStmntObj;
  
      var reqObj = {
        BankAccObj : this.BankAccObj,
        ListBankStmntObj : this.ListBankStmntObj
      }
  
      this.AppCustBankAccList.push(this.BankAccObj);
    }
    else{
      this.BankAccObj = this.AppCustBankAccList.find(x => x.AppCustBankAccId == this.BankAccStmntForm.controls.AppCustBankAccId.value);
      this.BankAccObj.BankBranch = this.BankAccStmntForm.controls.BankBranch.value;
      this.BankAccObj.BankAccName = this.BankAccStmntForm.controls.BankAccName.value;
      this.BankAccObj.BankAccNo = this.BankAccStmntForm.controls.BankAccNo.value;
      this.BankAccObj.IsDefault = this.BankAccStmntForm.controls.IsDefault.value;
      this.BankAccObj.IsActive = this.BankAccStmntForm.controls.IsActive.value;

      for(let i = 0; i < this.BankAccStmntForm.controls.BankStmntObjs.value.length; i++){
        this.BankStmntObj = this.BankAccStmntForm.controls.BankStmntObjs.value[i]
        var monthObj = this.MonthObj.find(x => x.Key == this.BankStmntObj.Month);
        this.BankStmntObj.MonthName = monthObj.Value;
        this.ListBankStmntObj.push(this.BankStmntObj);
      }
      this.BankAccObj.AppCustBankStmntObjs = this.ListBankStmntObj;
      this.BankAccObj.ListBankStmntObj = this.ListBankStmntObj;
    }
    
    this.OutputObj.emit({Key: 'IsDetail', Value: false, AppCustBankAccList: this.AppCustBankAccList});
    enjiForm.resetForm();

    // if(this.Mode != "Edit"){
      // this.http.post(URLConstant.AddAppCustBankAccAndStmnt, reqObj).subscribe(
      //   (response) => {
      //     this.toastr.successMessage(response["message"]);
      //     this.OutputObj.emit({Key: 'IsDetail', Value: false});
      //     this.GetAppCustBankAccList();
      //     enjiForm.resetForm();
      //   });
    // }else{
      // this.http.post(URLConstant.EditAppCustBankAccAndStmnt, reqObj).subscribe(
      //   (response) => {
      //     this.toastr.successMessage(response["message"]);
      //     this.OutputObj.emit({Key: 'IsDetail', Value: false});
      //     this.GetAppCustBankAccList();
      //     enjiForm.resetForm();
      //   });
    // }
    this.IsDetail = false
  }

}
