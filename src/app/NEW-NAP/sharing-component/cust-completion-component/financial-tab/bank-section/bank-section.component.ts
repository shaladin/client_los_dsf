import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, NgForm, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppCustBankStmntObj } from 'app/shared/model/app-cust-bank-stmnt-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';

@Component({
  selector: 'app-bank-section',
  templateUrl: './bank-section.component.html',
  styleUrls: ['./bank-section.component.scss']
})
export class BankSectionComponent implements OnInit {

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
    BankCode: [''],
    BankBranch: ['', Validators.required],
    BankAccName: ['', Validators.required],
    BankAccNo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    IsDefault: [false],
    IsActive: [false],
    BegBalanceAmt: [0, Validators.required],
    BankStmntObjs: this.fb.array([])
  })

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService, private cookieService: CookieService) { }

  ngOnInit() {
    this.http.post(URLConstant.GetListKeyValueActiveByCodeOrderBySeqNo, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMonth }).subscribe(
      (response) => {
        this.MonthObj = response[CommonConstant.ReturnObj];
        if (this.MonthObj.length > 0) {
          this.DefaultMonth = this.MonthObj[0].Value;
        }
      }
    );

    this.InputLookupBankObj = new InputLookupObj();
    this.InputLookupBankObj.urlJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupBankObj.pagingJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.genericJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.isReady = true;

    this.GetAppCustBankAccList();
    this.FormValidity(this.IsDetail, true);
  }

  GetAppCustBankAccList() {
    this.http.post<Array<AppCustBankAccObj>>(URLConstant.GetAppCustBankAccAndStatementForView, { Id: this.AppCustId }).subscribe(
      (response) => {
        console.log(response);
        this.AppCustBankAccList = response["AppCustBankAccList"]
      });
  }

  GetBank(event) {
    this.BankAccObj.BankCode = event.BankCode;
  }

  CustBankHandler(Mode: string, BankAccAndStmntObj: AppCustBankAccObj = undefined) {
    this.ClearForm();

    switch (Mode) {
      case "Add":
        this.IsDetail = true;
        this.Mode = "Add";
        this.CheckDefault();
        break;
      case "Edit":
        this.IsDetail = true;
        this.Mode = "Edit";
        this.Title = "Edit Bank Account";
        this.SetForEdit(BankAccAndStmntObj);
        break;
      case "Delete":
        this.IsDetail = false;
        this.DeleteBankAcc(BankAccAndStmntObj);
        break;
      case "Cancel":
        this.IsDetail = false;
        break;
    }
    this.FormValidity(this.IsDetail);
    this.OutputObj.emit({ Key: 'IsDetail', Value: this.IsDetail });
  }

  CheckDefault() {
    if (this.BankAccStmntForm.controls.IsDefault.value) {
      this.BankAccStmntForm.patchValue({
        IsActive: true
      });
      this.BankAccStmntForm.controls.IsActive.disable();
    }
    else {
      this.BankAccStmntForm.controls.IsActive.enable();
    }
  }

  SetForEdit(BankAccAndStmntObj: AppCustBankAccObj) {
    this.InputLookupBankObj.nameSelect = BankAccAndStmntObj.BankName;
    this.InputLookupBankObj.jsonSelect = { BankName: BankAccAndStmntObj.BankName };
    this.BankAccObj.AppCustBankAccId = BankAccAndStmntObj.AppCustBankAccId;
    this.BankAccObj.BankCode = BankAccAndStmntObj.BankCode;
    this.BankAccObj.RowVersion = BankAccAndStmntObj.RowVersion;

    this.BankAccStmntForm.patchValue({
      BankBranch: BankAccAndStmntObj.BankBranch,
      BankAccName: BankAccAndStmntObj.BankAccName,
      BankAccNo: BankAccAndStmntObj.BankAccNo,
      IsDefault: BankAccAndStmntObj.IsDefault,
      IsActive: BankAccAndStmntObj.IsActive,
      BegBalanceAmt: BankAccAndStmntObj.BegBalanceAmt,
    })

    this.CheckDefault();

    if (BankAccAndStmntObj.ListAppCustBankAccStmntObj != undefined) {
      var bankStmnObjs = this.BankAccStmntForm.controls['BankStmntObjs'] as FormArray;
      for (let i = 0; i < BankAccAndStmntObj.ListAppCustBankAccStmntObj.length; i++) {
        bankStmnObjs.push(this.AddGroup(BankAccAndStmntObj.ListAppCustBankAccStmntObj[i]));
      }
    }

    this.AppCustBankStmntList = BankAccAndStmntObj.ListAppCustBankAccStmntObj;
  }

  ClearForm() {
    this.BankAccStmntForm.reset();

      this.BankAccStmntForm.patchValue({
        IsActive: false,
        IsDefault: false
      });

    this.InputLookupBankObj.nameSelect = "";
    this.InputLookupBankObj.jsonSelect = { BankName: "" };

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
      this.BankAccStmntForm.controls.BankAccNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      for (let i = 0; i < this.BankAccStmntForm.controls.BankStmntObjs["controls"].length; i++) {
        this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["Month"].setValidators([Validators.required]);
        this.BankAccStmntForm.controls.BankStmntObjs["controls"][i]["controls"]["Year"].setValidators([Validators.required, Validators.pattern("^[0-9]+$"), Validators.maxLength(4)]);
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
    if (bankStmnObjs.length == 12) {
      return false;
    }
    bankStmnObjs.push(this.AddGroup(undefined));
    this.FormValidity(this.IsDetail);
    this.isAlreadyCalc = false;
  }

  AddGroup(bankStmntObj: AppCustBankStmntObj = undefined) {
    this.isAlreadyCalc = false;
    if (bankStmntObj == undefined) {
      var dateYear = 0;
      if (this.BankAccStmntForm.value['BankStmntObjs'].length > 0)
        dateYear = this.BankAccStmntForm.value['BankStmntObjs'][0].Year;
      else {
        var userAcc = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        var month = new Date(userAcc.BusinessDt).getMonth();
        dateYear = new Date(userAcc.BusinessDt).getFullYear();
        if (month == 0) dateYear--;
      }

      return this.fb.group({
        Month: [this.DefaultMonth, [Validators.required, Validators.maxLength(2)]],
        Year: [dateYear, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
        DebitAmt: [0, Validators.required],
        CreditAmt: [0, Validators.required],
        BalanceAmt: [0, Validators.required],
        DebitTrxCount: [0, Validators.required],
        CreditTrxCount: [0, Validators.required]
      })
    } else {
      return this.fb.group({
        Month: [bankStmntObj.Month, [Validators.required, Validators.maxLength(2)]],
        Year: [bankStmntObj.Year, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
        DebitAmt: [bankStmntObj.DebitAmt, Validators.required],
        CreditAmt: [bankStmntObj.CreditAmt, Validators.required],
        BalanceAmt: [bankStmntObj.BalanceAmt, Validators.required],
        DebitTrxCount: [bankStmntObj.DebitTrxCount, Validators.required],
        CreditTrxCount: [bankStmntObj.CreditTrxCount, Validators.required]
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

  DeleteBankAcc(BankAccAndStmntObj: AppCustBankAccObj) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      let tempObj: GenericObj = new GenericObj();
      tempObj.Id = BankAccAndStmntObj.AppCustBankAccId;
      this.http.post(URLConstant.DeleteAppCustBankAccAndStmnt, tempObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.GetAppCustBankAccList();
        });
    }
  }

  DeleteBankStmnt(index: number) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var bankStmnObjs = this.BankAccStmntForm.controls['BankStmntObjs'] as FormArray;
      bankStmnObjs.removeAt(index);
    }
  }

  SaveForm(enjiForm: NgForm) {
    if (!this.isAlreadyCalc) {
      this.toastr.warningMessage(ExceptionConstant.CALC_FIRST);
      return false;
    }
    this.ListBankStmntObj = new Array();
    this.BankAccObj.AppCustId = this.AppCustId;
    this.BankAccObj.BankBranch = this.BankAccStmntForm.controls.BankBranch.value;
    this.BankAccObj.BankAccName = this.BankAccStmntForm.controls.BankAccName.value;
    this.BankAccObj.BankAccNo = this.BankAccStmntForm.controls.BankAccNo.value;
    this.BankAccObj.IsDefault = this.BankAccStmntForm.controls.IsDefault.value;
    this.BankAccObj.IsActive = this.BankAccStmntForm.controls.IsActive.value;
    this.BankAccObj.BegBalanceAmt = this.BankAccStmntForm.controls.BegBalanceAmt.value;

    for (let i = 0; i < this.BankAccStmntForm.controls.BankStmntObjs.value.length; i++) {
      this.BankStmntObj = this.BankAccStmntForm.controls.BankStmntObjs.value[i]
      this.ListBankStmntObj.push(this.BankStmntObj)
    }

    for (let i = 0; i < this.ListBankStmntObj.length; i++) {
      for (let j = i + 1; j < this.ListBankStmntObj.length; j++) {
        if (this.ListBankStmntObj[i]["Month"] == this.ListBankStmntObj[j]["Month"] && this.ListBankStmntObj[i]["Year"] == this.ListBankStmntObj[j]["Year"]) {
          this.toastr.warningMessage(ExceptionConstant.STATEMENT_WITH_SAME_MONTH_AND_YEAR);
          return;
        }
      }
    }
    var reqObj = {
      BankAccObj: this.BankAccObj,
      ListBankStmntObj: this.ListBankStmntObj
    }

    if (this.Mode != "Edit") {
      this.http.post(URLConstant.AddAppCustBankAccAndStmnt, reqObj).subscribe(
        (response) => {
          if (response["StatusCode"] != 200) return;
          this.toastr.successMessage(response["message"]);
          this.OutputObj.emit({ Key: 'IsDetail', Value: false });
          this.GetAppCustBankAccList();
          enjiForm.resetForm();
        });
    } else {
      this.http.post(URLConstant.EditAppCustBankAccAndStmnt, reqObj).subscribe(
        (response) => {
          if (response["StatusCode"] != 200) return;
          this.toastr.successMessage(response["message"]);
          this.OutputObj.emit({ Key: 'IsDetail', Value: false });
          this.GetAppCustBankAccList();
          enjiForm.resetForm();
        });
    }
    this.IsDetail = false
  }

  //#region Calculate
  calculate() {
    let begBalance: number = this.BankAccStmntForm.controls['BegBalanceAmt'].value;

    let startBegBalance = begBalance;
    let arrayControl = this.BankAccStmntForm.get('BankStmntObjs') as FormArray;

    for (let i = 0; i < arrayControl.length; i++) {
      const bankStmntD = arrayControl.at(i).value;

      bankStmntD.BalanceAmt = startBegBalance - bankStmntD.DebitAmt + bankStmntD.CreditAmt;
      startBegBalance = bankStmntD.BalanceAmt;
    }

    this.isAlreadyCalc = true;
  }
  
  isAlreadyCalc: boolean = false;
  onBegBalanceAmtChange(e) {
    this.isAlreadyCalc = false;
  }
  onDebitAmtChange(e) {
    this.isAlreadyCalc = false;
  }

  onCreditAmtChange(e) {
    this.isAlreadyCalc = false;
  }

  onMonthChange() {
    this.isAlreadyCalc = false;
  }
  //#endregion
}
