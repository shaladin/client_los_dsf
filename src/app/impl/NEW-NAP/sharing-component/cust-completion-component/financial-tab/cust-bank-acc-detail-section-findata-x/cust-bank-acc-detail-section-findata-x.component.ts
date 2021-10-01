import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustBankAccObjX } from 'app/impl/shared/model/AppCustBankAccObjX.model';
import { AppCustBankStmntObj } from 'app/shared/model/AppCustBankStmntObj.Model';
import { AppCustBankStmntObjX } from 'app/impl/shared/model/AppCustBankStmntObjX.Model';


@Component({
  selector: 'app-cust-bank-acc-detail-section-findata-x',
  templateUrl: './cust-bank-acc-detail-section-findata-x.component.html',
  styleUrls: ['./cust-bank-acc-detail-section-findata-x.component.css']
})
export class CustBankAccDetailSectionFindataXComponent implements OnInit {

  @Input() AppCustId: number;
  @Input() pageType: string;
  @Input() modalTitle: string;
  @Input() isAddBankStatement: boolean;
  @Input() AppCustBankAccId: number;
  @Input() BankAccAndStmntObjX: AppCustBankAccObjX
  monthOfYear: Array<string>;
  rowCustBankStmnt: number;
  InputLookupBankObj: InputLookupObj = new InputLookupObj();
  maxYear: number;
  bankName: string;
  IsActive: boolean;
  begBalance: number;
  isAlreadyCalc: boolean = false;
  BankAccObj: AppCustBankAccObj = new AppCustBankAccObj();
  ListBankStmntObj: Array<AppCustBankStmntObj> = new Array();

  private custBankStmnt: AppCustBankStmntObjX;//yang dipakai tanpa H&D
  // private custBankAccObjX: CustBankAccObjX;

  CustBankAccForm = this.fb.group({
    AppCustBankAccId: [0, [Validators.required]],
    AppCustId: [0, [Validators.required]],
    BankCode: [0, [Validators.required]],
    BankBranch: ['', [Validators.required]],
    BankAccNo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    BankAccName: ['', [Validators.required]],
    IsBankStmnt: [false],
    BankBranchRegRptCode: [''],
    BalanceAmt: [0],
    IsDefault: [false],
    IsActive: [false],
    BegBalanceAmt: [0],
    RowVersion: [''],
    MrPlafonFromBank: [''],
    CustBankStmnts: this.fb.array([])
  });


  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private cookieService: CookieService
  ) {
    moment.locale('en');
    this.monthOfYear = new Array(...moment.months());
    this.rowCustBankStmnt = 0;
    this.maxYear = moment().year();
    this.custBankStmnt = new AppCustBankStmntObjX();
  }

  ngOnInit() {
    this.InputLookupBankObj = new InputLookupObj();
    this.InputLookupBankObj.urlJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupBankObj.pagingJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.genericJson = "./assets/uclookup/lookupBank.json";
    this.InputLookupBankObj.isReady = true;



    var criteriaList = new Array();
    var criteriaObj = new CriteriaObj();
    criteriaObj.restriction = AdInsConstant.RestrictionEq;
    criteriaObj.propName = 'IS_ACTIVE';
    criteriaObj.value = CommonConstantX.TRUE_CONDITION;
    criteriaList.push(criteriaObj);

    this.CustBankAccForm.patchValue({
      AppCustId: this.AppCustId,
    });

    if (this.pageType == "edit") {

      this.InputLookupBankObj.nameSelect = this.BankAccAndStmntObjX.BankName;
      this.InputLookupBankObj.jsonSelect = { BankName: this.BankAccAndStmntObjX.BankName }
      this.CustBankAccForm.patchValue({
        AppCustBankAccId: this.BankAccAndStmntObjX.AppCustBankAccId,
        AppCustId: this.BankAccAndStmntObjX.AppCustId,
        BankCode: this.BankAccAndStmntObjX.BankCode,
        BankBranch: this.BankAccAndStmntObjX.BankBranch,
        BankAccNo: this.BankAccAndStmntObjX.BankAccNo,
        BankAccName: this.BankAccAndStmntObjX.BankAccName,
        IsBankStmnt: this.BankAccAndStmntObjX.IsBankStmnt,
        BankBranchRegRptCode: this.BankAccAndStmntObjX.BankBranchRegRptCode,
        // BalanceAmt: parseFloat(this.BankAccAndStmntObj.BalanceAmt),
        BalanceAmt: this.BankAccAndStmntObjX.BalanceAmt,
        IsDefault: this.BankAccAndStmntObjX.IsDefault,
        IsActive: this.BankAccAndStmntObjX.IsActive,
        RowVersion: this.BankAccAndStmntObjX.RowVersion,
        MrPlafonFromBank: this.BankAccAndStmntObjX.MrPlafonFromBank,
        BegBalanceAmt: this.BankAccAndStmntObjX.BegBalanceAmt,
      });


      this.BankAccObj.AppCustBankAccId = this.BankAccAndStmntObjX.AppCustBankAccId;
      this.BankAccObj.BankCode = this.BankAccAndStmntObjX.BankCode;
      this.BankAccObj.RowVersion = this.BankAccAndStmntObjX.RowVersion;
      this.ListBankStmntObj = this.BankAccAndStmntObjX.ListAppCustBankAccStmntObjX != null ? this.BankAccAndStmntObjX.ListAppCustBankAccStmntObjX : [];
      this.CheckDefault();
    }
    else if (this.pageType == "editStmnt") {
      // var custBankAcc = new CustBankAccObj();
      // custBankAcc.CustBankAccId = this.CustBankAccId;

      var ReqCustBankAcc = {
        Id: this.AppCustBankAccId
      }

      this.CustBankAccForm.controls['BegBalanceAmt'].setValidators([Validators.required]);
      this.bankName = this.BankAccAndStmntObjX.BankName;

      this.CustBankAccForm.patchValue({
        AppCustBankAccId: this.BankAccAndStmntObjX.AppCustBankAccId,
        AppCustId: this.BankAccAndStmntObjX.AppCustId,
        BankCode: this.BankAccAndStmntObjX.BankCode,
        BankBranch: this.BankAccAndStmntObjX.BankBranch,
        BankAccNo: this.BankAccAndStmntObjX.BankAccNo,
        BankAccName: this.BankAccAndStmntObjX.BankAccName,
        IsBankStmnt: this.BankAccAndStmntObjX.IsBankStmnt,
        BankBranchRegRptCode: this.BankAccAndStmntObjX.BankBranchRegRptCode,
        BalanceAmt: this.BankAccAndStmntObjX.BalanceAmt,
        IsDefault: this.BankAccAndStmntObjX.IsDefault,
        IsActive: this.BankAccAndStmntObjX.IsActive,
        RowVersion: this.BankAccAndStmntObjX.RowVersion,
        MrPlafonFromBank: this.BankAccAndStmntObjX.MrPlafonFromBank,
        BegBalanceAmt: this.BankAccAndStmntObjX.BegBalanceAmt,
      });

      this.CheckDefault();
      this.BankAccObj.AppCustBankAccId = this.BankAccAndStmntObjX.AppCustBankAccId;
      this.BankAccObj.BankCode = this.BankAccAndStmntObjX.BankCode;
      this.BankAccObj.RowVersion = this.BankAccAndStmntObjX.RowVersion;
      this.ListBankStmntObj = this.BankAccAndStmntObjX.ListAppCustBankAccStmntObjX;

      //tidak dipakai
      var formArray = this.CustBankAccForm.get('CustBankStmnts') as FormArray;
      for (const item of this.BankAccAndStmntObjX.ListAppCustBankAccStmntObjX) {
        var formGroup = this.fb.group({
          AppCustBankStmntId: [item.AppCustBankStmntId, [Validators.required]],
          // AppCustBankId: [item.AppCustBankId, [Validators.required]],
          Month: [this.monthOfYear.indexOf(item.Month), [Validators.required]],
          Year: [item.Year, [Validators.required, Validators.pattern("^[0-9]+$")]],
          DebitTrxCount: [(item.DebitTrxCount == undefined ? 0 : item.DebitTrxCount), [Validators.required, Validators.min(0), Validators.max(9999)]],
          CreditTrxCount: [(item.CreditTrxCount == undefined ? 0 : item.CreditTrxCount), [Validators.required, Validators.min(0), Validators.max(9999)]],
          DebitAmt: [item.DebitAmt, [Validators.required]],
          CreditAmt: [item.CreditAmt, [Validators.required]],
          BalanceAmt: item.BalanceAmt,
          // RowVersion: [item.RowVersion]
        });
        formArray.push(formGroup);
        this.rowCustBankStmnt++;
      }

    }
  }

  addRowCustBankStmnt() {
    if (this.rowCustBankStmnt == 12) {
      return false;
    }

    var formArray = this.CustBankAccForm.get('CustBankStmnts') as FormArray;
    var formGroup = this.fb.group({
      AppCustBankStmntId: [this.custBankStmnt.AppCustBankStmntId, [Validators.required]],
      Month: ['', [Validators.required]],
      Year: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      DebitTrxCount: [0, [Validators.required, Validators.min(0), Validators.max(9999)]],
      CreditTrxCount: [0, [Validators.required, Validators.min(0), Validators.max(9999)]],
      DebitAmt: [0, [Validators.required]],
      CreditAmt: [0, [Validators.required]],
      BalanceAmt: [''],
      // RowVersion: ['']
    });
    formArray.push(formGroup);
    this.rowCustBankStmnt++;

    this.isAlreadyCalc = false;
  }

  ChangeTrxCountDebit(i) {
    var formArray = this.CustBankAccForm.get('CustBankStmnts') as FormArray;
    var controlDebitAmt = formArray.at(i).get('DebitAmt');
    var controlDebitTrxCount = formArray.at(i).value.DebitTrxCount;
    if (controlDebitTrxCount != undefined) {
      if (controlDebitTrxCount > 0) {
        controlDebitAmt.setValidators([Validators.required, Validators.min(0.01)]);
        controlDebitAmt.updateValueAndValidity();
      } else if (controlDebitTrxCount == 0) {
        controlDebitAmt.clearValidators();
        controlDebitAmt.updateValueAndValidity();
      }
    }
  }

  ChangeTrxCountCredit(i) {
    var formArray = this.CustBankAccForm.get('CustBankStmnts') as FormArray;
    var controlCreditAmt = formArray.at(i).get('CreditAmt');
    var controlCreditTrxCount = formArray.at(i).value.CreditTrxCount;
    if (controlCreditTrxCount != undefined) {
      if (controlCreditTrxCount > 0) {
        controlCreditAmt.setValidators([Validators.required, Validators.min(0.01)]);
        controlCreditAmt.updateValueAndValidity();
      } else if (controlCreditTrxCount == 0) {
        controlCreditAmt.clearValidators();
        controlCreditAmt.updateValueAndValidity();
      }
    }
  }

  removeCustBankStmnt(i) {
    var confirmation = confirm(ExceptionConstant.DELETE_CONFIRMATION);
    if (confirmation == true) {
      var formArray = this.CustBankAccForm.get('CustBankStmnts') as FormArray;
      formArray.removeAt(i);
      this.rowCustBankStmnt--;
    }
  }

  getLookupRefBankResponse(e) {
    this.CustBankAccForm.patchValue({
      BankCode: e.BankCode,
      BankBranchRegRptCode: e.RegRptCode
    });
  }

  calculate() {
    this.begBalance = this.CustBankAccForm.controls['BegBalanceAmt'].value;

    var startBegBalance = this.begBalance;

    var arrayControl = this.CustBankAccForm.get('CustBankStmnts') as FormArray;

    for (let i = 0; i < arrayControl.length; i++) {
      const bankStmntD = arrayControl.at(i).value;

      bankStmntD.BalanceAmt = startBegBalance - bankStmntD.DebitAmt + bankStmntD.CreditAmt;
      startBegBalance = bankStmntD.BalanceAmt;
    }

    this.isAlreadyCalc = true;
  }

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

  Save(enjiForm) {

    var formData = this.CustBankAccForm.value;
    var custBankAccObjX = new AppCustBankAccObjX();
    if (this.pageType != "add") {
      custBankAccObjX.AppCustBankAccId = formData.AppCustBankAccId;
    }
    custBankAccObjX.AppCustId = formData.AppCustId;
    custBankAccObjX.BankCode = formData.BankCode;
    custBankAccObjX.BankBranch = formData.BankBranch;
    custBankAccObjX.BankAccNo = formData.BankAccNo;
    custBankAccObjX.BankAccName = formData.BankAccName;
    custBankAccObjX.IsBankStmnt = formData.IsBankStmnt;
    custBankAccObjX.BankBranchRegRptCode = formData.BankBranchRegRptCode;
    custBankAccObjX.BalanceAmt = parseFloat(formData.BalanceAmt);
    custBankAccObjX.IsDefault = formData.IsDefault;
    custBankAccObjX.RowVersion = formData.RowVersion;
    custBankAccObjX.IsActive = formData.IsActive;
    // this.appCustBankAccObjX = new AppCustBankAccObjX();
    custBankAccObjX.BegBalanceAmt = formData.BegBalanceAmt;
    // this.appCustBankAccObjX.AppCustBankAccObj = custBankAccObj;
    custBankAccObjX.MrPlafonFromBank = formData.MrPlafonFromBank;

    var reqObjX = {
      BankAccObj: custBankAccObjX,
      ListBankStmntObj: this.ListBankStmntObj,
      MrPlafonFromBank: formData.MrPlafonFromBank
    }

    // var reqObjX = {
    //   AppCustBankAccObjX: reqObj,
    //   MrPlafonFromBank: formData.MrPlafonFromBank
    // }

    if (this.pageType == "add") {
      this.CheckDefault();
      this.httpClient.post(URLConstantX.AddAppCustBankAccAndStmnt, reqObjX).subscribe(
        (response) => {
          this.activeModal.close(response);
        }
      );
    }
    else {
      if (this.pageType == "edit") {
        this.CheckDefault();
        this.httpClient.post(URLConstantX.EditAppCustBankAccAndStmnt, reqObjX).subscribe(
          (response) => {
            this.activeModal.close(response);
          });
      }
      else if (this.pageType == "editStmnt") {
        if (this.isAlreadyCalc == false) {
          this.toastr.warningMessage(ExceptionConstant.CALC_FIRST);
          return false;
        }
        var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        var formArray = this.CustBankAccForm.get('CustBankStmnts') as FormArray;
        var listCustBankStmnt = new Array<AppCustBankStmntObj>();
        var totalBalance = 0;

        if (formArray.length == 0) {
          this.toastr.warningMessage("Please input at least one bank account statement");
          return false;
        }

        for (var i = 0; i < formArray.length; i++) {
          const bankStmnt = formArray.at(i).value;
          for (var j = 0; j < formArray.length; j++) {
            if (i == j) {
              continue;
            }
            const bankStmntCompare = formArray.at(j).value;
            if (bankStmnt.Month == bankStmntCompare.Month && bankStmnt.Year == bankStmntCompare.Year) {
              this.toastr.warningMessage(ExceptionConstant.STATEMENT_WITH_SAME_MONTH_AND_YEAR);
              return false;
            }
          }
          var appCustBankStmnt = new AppCustBankStmntObjX();
          appCustBankStmnt.AppCustBankId = formData.AppCustBankAccId;
          // custBankStmnt.RowVersion = bankStmnt.RowVersion;
          appCustBankStmnt.Month = this.monthOfYear[bankStmnt.Month];
          appCustBankStmnt.Year = bankStmnt.Year;
          appCustBankStmnt.DebitTrxCount = bankStmnt.DebitTrxCount == "" ? null : bankStmnt.DebitTrxCount;
          appCustBankStmnt.DebitAmt = bankStmnt.DebitAmt;
          appCustBankStmnt.CreditTrxCount = bankStmnt.CreditTrxCount == "" ? null : bankStmnt.CreditTrxCount;
          appCustBankStmnt.CreditAmt = bankStmnt.CreditAmt;
          appCustBankStmnt.BalanceAmt = parseFloat(bankStmnt.BalanceAmt);
          listCustBankStmnt.push(appCustBankStmnt);
          totalBalance += parseFloat(bankStmnt.BalanceAmt);
        }
        var reqObjAddStatement = {
          BankAccObj: custBankAccObjX,
          ListBankStmntObj: listCustBankStmnt,
          MrPlafonFromBank: formData.MrPlafonFromBank
        }

        this.httpClient.post(URLConstantX.EditAppCustBankAccAndStmnt, reqObjAddStatement).subscribe(
          (response) => {
            this.activeModal.close(response);
          });

      }
    }
  }
  CheckDefault() {
    if (this.CustBankAccForm.controls.IsDefault.value) {
      this.CustBankAccForm.patchValue({
        IsActive: true
      });
      this.CustBankAccForm.controls.IsActive.disable();
    }
    else {
      this.CustBankAccForm.controls.IsActive.enable();
    }
  }

}
