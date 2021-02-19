import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppCustBankStmntObj } from 'app/shared/model/AppCustBankStmntObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MouCustBankAccObj } from 'app/shared/model/MouCustBankAccObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-mou-cust-bank-acc',
  templateUrl: './mou-cust-bank-acc.component.html',
  styleUrls: ['./mou-cust-bank-acc.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class MouCustBankAccComponent implements OnInit {

  @Input() listBankAcc: Array<MouCustBankAccObj> = new Array<MouCustBankAccObj>();
  @Output() callbackSubmit: EventEmitter<any> = new EventEmitter();

  mode: any;
  currentEditedIndex: any;
  selectedBankCode: any;

  closeResult: any;
  MouCustBankAccObj: MouCustBankAccObj;
  refMasterObj = {
    RefMasterTypeCode: ""
  };
  bankObj = {
    RefBankId: 0,
    BankCode: ""
  };
  RefBankObj: any;
  MonthObj: any;
  defaultMonth: any;
  InputLookupBankObj: any;
  selectedBankName: any;



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
    this.MouCustBankAccObj = new MouCustBankAccObj();
    if (this.listBankAcc == undefined) {
      this.listBankAcc = new Array<MouCustBankAccObj>();
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

      this.listBankAcc.push(this.MouCustBankAccObj);
    }
    if (this.mode == "edit") {
      if (this.CustBankAccountForm.controls.IsDefault.value == true && this.listBankAcc[this.currentEditedIndex].IsDefault == false) {
        var check = this.listBankAcc.find(x => x.IsDefault == true);

        if (check != undefined) {
          this.toastr.warningMessage(ExceptionConstant.OTHER_BANK_ACCOUNT_ALREADY_DEFAULT);
          return;
        }
      }
      this.listBankAcc[this.currentEditedIndex] = this.MouCustBankAccObj;
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

    if (this.listBankAcc[i].MouCustBankStmntObjs != undefined) {
      for (let j = 0; j < this.listBankAcc[i].MouCustBankStmntObjs.length; j++) {
        var bankStmnObjs = this.CustBankAccountForm.controls['BankStmntObjs'] as FormArray;
        bankStmnObjs.push(this.addGroup(this.listBankAcc[i].MouCustBankStmntObjs[j]));
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
    this.MouCustBankAccObj.BankCode = this.selectedBankCode;
    this.MouCustBankAccObj.BankName = this.selectedBankName;
    this.MouCustBankAccObj.BankBranch = this.CustBankAccountForm.controls.BankBranch.value;
    this.MouCustBankAccObj.BankAccName = this.CustBankAccountForm.controls.BankAccName.value;
    this.MouCustBankAccObj.BankAccNo = this.CustBankAccountForm.controls.BankAccNo.value;
    this.MouCustBankAccObj.BalanceAmt = 0;
    this.MouCustBankAccObj.IsDefault = this.CustBankAccountForm.controls.IsDefault.value;
    this.MouCustBankAccObj.MouCustBankStmntObjs = new Array<AppCustBankStmntObj>();
    for (let i = 0; i < this.CustBankAccountForm.controls["BankStmntObjs"].value.length; i++) {
      var appCustBankStmntObj = new AppCustBankStmntObj();
      appCustBankStmntObj.Month = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].Month;
      appCustBankStmntObj.Year = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].Year;
      appCustBankStmntObj.DebitAmt = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].DebitAmt;
      appCustBankStmntObj.CreditAmt = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].CreditAmt;
      appCustBankStmntObj.BalanceAmt = this.CustBankAccountForm.controls["BankStmntObjs"].value[i].BalanceAmt;
      this.MouCustBankAccObj.MouCustBankStmntObjs.push(appCustBankStmntObj);
    }

    if (this.MouCustBankAccObj.MouCustBankStmntObjs.length > 0) {
      this.MouCustBankAccObj.IsBankStmnt = true;
    } else {
      this.MouCustBankAccObj.IsBankStmnt = false;
    }
  }

  GetBank(event) {
    this.selectedBankCode = event.BankCode;
    this.selectedBankName = event.BankName;
  }

  setBankName(bankCode) {
    this.bankObj.BankCode = bankCode;
    this.http.post(environment.FoundationR3Url + URLConstant.GetRefBankByBankCodeAsync, this.bankObj).subscribe(
      (response) => {
        this.InputLookupBankObj.nameSelect = response["BankName"];
        this.InputLookupBankObj.jsonSelect = response;
      },
      (error) => {
        console.log(error);
      }
    );
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
    this.InputLookupBankObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupBankObj.urlEnviPaging = environment.FoundationR3Url;
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
