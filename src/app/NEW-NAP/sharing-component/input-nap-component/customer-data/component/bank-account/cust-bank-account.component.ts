import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';

import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppCustBankStmntObj } from 'app/shared/model/app-cust-bank-stmnt-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-cust-bank-account',
  templateUrl: './cust-bank-account.component.html',
  styles: [
    '.disabledLink { color: #ccc; pointer-events:none;}'
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustBankAccountComponent implements OnInit {

  @Input() listBankAcc: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  @Input() isLockMode: boolean = false;
  @Output() callbackSubmit: EventEmitter<any> = new EventEmitter();

  mode: string;
  currentEditedIndex: number;
  selectedBankCode: string;

  closeResult: string;
  appCustBankAccObj: AppCustBankAccObj;
  refMasterObj = {
    RefMasterTypeCode: ""
  };
  bankObj = {
    RefBankId: 0,
    BankCode: ""
  };
  MonthObj: Array<KeyValueObj>;
  defaultMonth: string;
  InputLookupBankObj: InputLookupObj;
  selectedBankName: string;



  CustBankAccountForm = this.fb.group({
    BankBranch: ['', [Validators.required, Validators.maxLength(50)]],
    BankAccName: ['', [Validators.required, Validators.maxLength(50)]],
    BankAccNo: ['', [Validators.required, Validators.maxLength(50)]],
    IsDefault: [false],
    BankStmntObjs: this.fb.array([])
  });


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private modalService: NgbModal, private cookieService: CookieService) {

  }

  ngOnInit() {
    this.initLookup();
    this.bindMonthObj();
  }

  SaveForm() {
    this.appCustBankAccObj = new AppCustBankAccObj();
    if (this.listBankAcc == undefined) {
      this.listBankAcc = new Array<AppCustBankAccObj>();
    }
    this.setAppCustBankAcc();
    if (this.mode == "add") {
      if (this.CustBankAccountForm.controls.IsDefault.value == true) {
        var check = this.listBankAcc.find(x => x.IsDefault == true);

        if (check != undefined) {
          this.toastr.warningMessage(ExceptionConstant.OTHER_BANK_ACCOUNT_ALREADY_DEFAULT);
          return;
        }
      }

      this.listBankAcc.push(this.appCustBankAccObj);
    }
    if (this.mode == "edit") {
      if (this.CustBankAccountForm.controls.IsDefault.value == true && this.listBankAcc[this.currentEditedIndex].IsDefault == false) {
        var check = this.listBankAcc.find(x => x.IsDefault == true);

        if (check != undefined) {
          this.toastr.warningMessage(ExceptionConstant.OTHER_BANK_ACCOUNT_ALREADY_DEFAULT);
          return;
        }
      }
      this.listBankAcc[this.currentEditedIndex] = this.appCustBankAccObj;
    }
    this.callbackSubmit.emit(this.listBankAcc);
    this.modalService.dismissAll();
    this.clearForm();
  }

  add(content) {
    this.mode = "add";
    this.clearForm();
    this.open(content);
  }

  edit(i, content) {
    this.clearForm();
    this.mode = "edit";
    this.currentEditedIndex = i;
    this.CustBankAccountForm.patchValue({
      BankBranch: this.listBankAcc[i].BankBranch,
      BankAccName: this.listBankAcc[i].BankAccName,
      BankAccNo: this.listBankAcc[i].BankAccNo,
      IsDefault: this.listBankAcc[i].IsDefault
    });

    if (this.listBankAcc[i].ListAppCustBankAccStmntObj != undefined) {
      for (let j = 0; j < this.listBankAcc[i].ListAppCustBankAccStmntObj.length; j++) {
        var bankStmnObjs = this.CustBankAccountForm.controls['BankStmntObjs'] as FormArray;
        bankStmnObjs.push(this.addGroup(this.listBankAcc[i].ListAppCustBankAccStmntObj[j]));
      }
    }

    this.selectedBankCode = this.listBankAcc[i].BankCode;
    this.selectedBankName = this.listBankAcc[i].BankName;
    this.InputLookupBankObj.nameSelect = this.listBankAcc[i].BankName;
    this.InputLookupBankObj.jsonSelect = { BankName: this.listBankAcc[i].BankName };

    this.open(content);
  }

  delete(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.listBankAcc.splice(i, 1);
      this.callbackSubmit.emit(this.listBankAcc);
    }
  }

  clearForm() {
    this.CustBankAccountForm = this.fb.group({
      BankBranch: ['', [Validators.required, Validators.maxLength(50)]],
      BankAccName: ['', [Validators.required, Validators.maxLength(50)]],
      BankAccNo: ['', [Validators.required, Validators.maxLength(50)]],
      IsDefault: [false],
      BankStmntObjs: this.fb.array([])
    });
    this.selectedBankCode = "";
    this.selectedBankName = "";
    this.initLookup();
  }

  setAppCustBankAcc() {
    this.appCustBankAccObj.BankCode = this.selectedBankCode;
    this.appCustBankAccObj.BankName = this.selectedBankName;
    this.appCustBankAccObj.BankBranch = this.CustBankAccountForm.controls.BankBranch.value;
    this.appCustBankAccObj.BankAccName = this.CustBankAccountForm.controls.BankAccName.value;
    this.appCustBankAccObj.BankAccNo = this.CustBankAccountForm.controls.BankAccNo.value;
    this.appCustBankAccObj.BalanceAmt = 0;
    this.appCustBankAccObj.IsDefault = this.CustBankAccountForm.controls.IsDefault.value;
    this.appCustBankAccObj.ListAppCustBankAccStmntObj = new Array<AppCustBankStmntObj>();
    for (let i = 0; i < this.CustBankAccountForm.controls["BankStmntObjs"].value.length; i++) {
      var appCustBankStmntObj = new AppCustBankStmntObj();
      appCustBankStmntObj.Month = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].Month;
      appCustBankStmntObj.Year = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].Year;
      appCustBankStmntObj.DebitAmt = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].DebitAmt;
      appCustBankStmntObj.CreditAmt = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].CreditAmt;
      appCustBankStmntObj.BalanceAmt = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].BalanceAmt;
      this.appCustBankAccObj.ListAppCustBankAccStmntObj.push(appCustBankStmntObj);
    }

    if (this.appCustBankAccObj.ListAppCustBankAccStmntObj.length > 0) {
      this.appCustBankAccObj.IsBankStmnt = true;
    } else {
      this.appCustBankAccObj.IsBankStmnt = false;
    }
  }

  GetBank(event) {
    this.selectedBankCode = event.BankCode;
    this.selectedBankName = event.BankName;
  }

  setBankName(bankCode) {
    this.bankObj.BankCode = bankCode;
    this.http.post(URLConstant.GetRefBankByBankCodeAsync, {Code: bankCode}).subscribe(
      (response) => {
        this.InputLookupBankObj.nameSelect = response["BankName"];
        this.InputLookupBankObj.jsonSelect = response;
      });
  }

  addBankStmnt() {
    var bankStmnObjs = this.CustBankAccountForm.controls['BankStmntObjs'] as FormArray;
    bankStmnObjs.push(this.addGroup(undefined));
  }

  deleteBankStmnt(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var bankStmnObjs = this.CustBankAccountForm.controls['BankStmntObjs'] as FormArray;
      bankStmnObjs.removeAt(i);
    }
  }

  addGroup(bankStmntObj) {
    if (bankStmntObj == undefined) {
      var dateYear = 0;
      if (this.CustBankAccountForm.value['BankStmntObjs'].length > 0)
        dateYear = this.CustBankAccountForm.value['BankStmntObjs'][0].Year;
      else {
        var userAcc = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        var month = new Date(userAcc.BusinessDt).getMonth();
        dateYear = new Date(userAcc.BusinessDt).getFullYear();
        if (month == 0) dateYear--;
      }

      return this.fb.group({
        Month: [this.defaultMonth, [Validators.required, Validators.maxLength(2)]],
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

  initLookup() {
    this.InputLookupBankObj = new InputLookupObj();
    this.InputLookupBankObj.urlJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupBankObj.pagingJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.genericJson = "./assets/uclookup/lookupBank.json";
  }

  bindMonthObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeMonth;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.MonthObj = response[CommonConstant.ReturnObj];
        if (this.MonthObj.length > 0) {
          this.defaultMonth = this.MonthObj[0].Key;
        }
      }
    );
  }


  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
