import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, NgForm, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppCustBankStmntObj } from 'app/shared/model/app-cust-bank-stmnt-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-nap-cust-bank-acc',
  templateUrl: './new-nap-cust-bank-acc.component.html'
})
export class NewNapCustBankAccComponent implements OnInit {
  @Input() AppCustId: number;
  @Input() AppCustBankAccList: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  @Output() OutputObj: EventEmitter<any> = new EventEmitter();
  Mode: string = "Add";
  Title: string = "Add Bank Account"
  DefaultMonth: string;
  IsDetail: boolean = false;
  BankStmntObj: AppCustBankStmntObj = new AppCustBankStmntObj();
  MonthObj: Array<KeyValueObj> = new Array();
  AppCustBankStmntList: Array<AppCustBankStmntObj> = new Array();
  ListBankStmntObj: Array<AppCustBankStmntObj> = new Array();
  InputLookupBankObj: InputLookupObj = new InputLookupObj();
  EditedIndex: number;

  BankAccStmntForm = this.fb.group({
    BankCode: [''],
    BankName: [''],
    BankBranch: ['', Validators.required],
    BankAccName: ['', Validators.required],
    BankAccNo: ['', Validators.required],
    IsDefault: [false],
    IsActive: [false],
    RowVersion: [''],
    BankStmntObjs: this.fb.array([])
  })

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public formValidate: FormValidateService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMonth }).subscribe(
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
        this.AppCustBankAccList = response["AppCustBankAccList"];
        this.OutputObj.emit({ Key: 'IsDetail', Value: false, AppCustBankAccList: this.AppCustBankAccList });
      });
  }

  GetBank(event) {
    this.BankAccStmntForm.patchValue({
      BankCode: event.BankCode,
      BankName: event.BankName
    });
  }

  CustBankHandler(Mode: string, BankAccAndStmntObj: AppCustBankAccObj = undefined, index: number = 0) {
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
        this.SetForEdit(BankAccAndStmntObj, index);
        break;
      case "Delete":
        this.IsDetail = false;
        this.DeleteBankAcc(index);
        break;
      case "Cancel":
        this.IsDetail = false;
        break;
    }
    this.FormValidity(this.IsDetail);
    this.OutputObj.emit({ Key: 'IsDetail', Value: this.IsDetail, AppCustBankAccList: this.AppCustBankAccList });
  }

  SetForEdit(BankAccAndStmntObj: AppCustBankAccObj, index: number) {
    this.EditedIndex = index;
    this.InputLookupBankObj.nameSelect = BankAccAndStmntObj.BankName;
    this.InputLookupBankObj.jsonSelect = { BankName: BankAccAndStmntObj.BankName };


    this.BankAccStmntForm.patchValue({
      BankCode: BankAccAndStmntObj.BankCode,
      BankName: BankAccAndStmntObj.BankName,
      BankBranch: BankAccAndStmntObj.BankBranch,
      BankAccName: BankAccAndStmntObj.BankAccName,
      BankAccNo: BankAccAndStmntObj.BankAccNo,
      IsDefault: BankAccAndStmntObj.IsDefault,
      IsActive: BankAccAndStmntObj.IsActive,
      RowVersion: BankAccAndStmntObj.RowVersion
    });

    if (BankAccAndStmntObj.ListAppCustBankAccStmntObj != undefined) {
      var bankStmnObjs = this.BankAccStmntForm.controls['BankStmntObjs'] as FormArray;
      for (let i = 0; i < BankAccAndStmntObj.ListAppCustBankAccStmntObj.length; i++) {
        bankStmnObjs.push(this.AddGroup(BankAccAndStmntObj.ListAppCustBankAccStmntObj[i]));
      }
    }

    this.AppCustBankStmntList = BankAccAndStmntObj.ListAppCustBankAccStmntObj;
  }

  ClearForm() {
    this.BankAccStmntForm.patchValue({
      BankCode: "",
      BankName: "",
      BankBranch: "",
      BankAccName: "",
      BankAccNo: "",
      IsDefault: false,
      IsActive: false
    })

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

  DeleteCustBankStmnt(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var formArray = this.BankAccStmntForm.get('BankStmntObjs') as FormArray;
      formArray.removeAt(i);
    }
  }

  DeleteBankAcc(index: number) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.AppCustBankAccList.splice(index, 1);
      this.OutputObj.emit({ Key: 'IsDetail', Value: false, AppCustBankAccList: this.AppCustBankAccList });
    }
  }

  SaveForm(enjiForm: NgForm) {
    this.ListBankStmntObj = new Array();

    var bankAccObj = new AppCustBankAccObj();
    bankAccObj.AppCustId = this.AppCustId;
    bankAccObj.BankCode = this.BankAccStmntForm.controls.BankCode.value;
    bankAccObj.BankName = this.BankAccStmntForm.controls.BankName.value;
    bankAccObj.BankBranch = this.BankAccStmntForm.controls.BankBranch.value;
    bankAccObj.BankAccName = this.BankAccStmntForm.controls.BankAccName.value;
    bankAccObj.BankAccNo = this.BankAccStmntForm.controls.BankAccNo.value;
    bankAccObj.IsDefault = this.BankAccStmntForm.controls.IsDefault.value;
    bankAccObj.IsActive = this.BankAccStmntForm.controls.IsActive.value;

    for (let i = 0; i < this.BankAccStmntForm.controls.BankStmntObjs.value.length; i++) {
      this.BankStmntObj = this.BankAccStmntForm.controls.BankStmntObjs.value[i]
      this.ListBankStmntObj.push(this.BankStmntObj);
    }
    bankAccObj.ListAppCustBankAccStmntObj = this.ListBankStmntObj;

    if (this.Mode == "Edit") {
      this.AppCustBankAccList[this.EditedIndex] = bankAccObj;
    } else {
      this.AppCustBankAccList.push(bankAccObj);
    }
    this.OutputObj.emit({ Key: 'IsDetail', Value: false, AppCustBankAccList: this.AppCustBankAccList });
    enjiForm.resetForm();

    this.IsDetail = false;
  }

}
