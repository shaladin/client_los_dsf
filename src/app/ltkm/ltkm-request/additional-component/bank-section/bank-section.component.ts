import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustBankStmntObj } from 'app/shared/model/AppCustBankStmntObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { LtkmCustBankAccObj } from 'app/shared/model/LTKM/LtkmCustBankAccObj.Model';
import { LtkmCustBankStmntObj } from 'app/shared/model/LTKM/LtkmCustBankStmntObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-ltkm-bank-section',
    templateUrl: './bank-section.component.html',
    viewProviders: [{
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
})
export class LtkmBankSectionComponent implements OnInit {
    @Input() enjiForm: NgForm;
    @Input() parentForm: FormGroup;
    @Input() identifier: string;
    @Input() isLockMode: boolean = false;
    @Input() LtkmCustBankAccList: Array<LtkmCustBankAccObj> = new Array<LtkmCustBankAccObj>();
    @Output() UpdateBankSection: EventEmitter<any> = new EventEmitter();

    Mode: string = CommonConstant.ADD;
    Title: string = "Add Bank Account"
    DefaultMonth: string;
    IsDetail: boolean = false;
    BankAccObj: LtkmCustBankAccObj = new LtkmCustBankAccObj();
    LtkmBankAccObj: LtkmCustBankAccObj = new LtkmCustBankAccObj();
    BankStmntObj: LtkmCustBankStmntObj = new LtkmCustBankStmntObj();
    MonthObj: Array<KeyValueObj> = new Array<KeyValueObj>();
    AppCustBankStmntList: Array<AppCustBankStmntObj> = new Array();
    LtkmCustBankStmntList: Array<LtkmCustBankStmntObj> = new Array();
    ListBankStmntObj: Array<LtkmCustBankStmntObj> = new Array();
    RowAppCustBankStmnt: number;
    InputLookupBankObj: InputLookupObj = new InputLookupObj();
    isAlreadyCalc: boolean = false;
    begBalance: number;

    BankAccStmntForm = this.fb.group({
        BankCode: [''],
        BankBranch: ['', Validators.required],
        BankAccName: ['', Validators.required],
        BankAccNo: ['', Validators.required],
        IsDefault: [false],
        IsActive: [false],
        BegBalanceAmt: [0, [Validators.required]],
        BankStmntObjs: this.fb.array([])
    })

    currentIndex: number = -1;

    constructor(private fb: FormBuilder,
        private http: HttpClient,
        private toastr: NGXToastrService,
        public formValidate: FormValidateService,
        private cookieService: CookieService) { }

    ngOnInit() {

        this.parentForm.addControl(this.identifier, this.fb.group({
            BankCode: [''],
            BankBranch: [''],
            BankAccName: [''],
            BankAccNo: [''],
            IsDefault: [false],
            IsActive: [false],
            BegBalanceAmt: [0],
            BankStmntObjs: this.fb.array([])
        }));

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
        this.FormValidity(this.IsDetail, true);
    }

    GetBank(event) {
        this.BankAccObj.BankCode = event.bankCode;
        this.BankAccObj.BankName = event.bankName;
    }

    readonly ModeConstAdd: string = CommonConstant.ADD;
    readonly ModeConstEdit: string = CommonConstant.EDIT;
    readonly ModeConstDel: string = CommonConstant.DELETE;
    readonly ModeConstCan: string = CommonConstant.CANCEL;

    CustBankHandler(Mode: string, BankAccAndStmntObj: LtkmCustBankAccObj = undefined, index: number) {
        this.ClearForm();

        switch (Mode) {
            case CommonConstant.ADD:
                this.IsDetail = true;
                this.Mode = CommonConstant.ADD;
                this.BankAccObj = new LtkmCustBankAccObj();
                break;
            case CommonConstant.EDIT:
                this.currentIndex = index;
                this.IsDetail = true;
                this.Mode = CommonConstant.EDIT;
                this.Title = "Edit Bank Account";
                this.isAlreadyCalc = false;
                this.SetForEdit(BankAccAndStmntObj);
                break;
            case CommonConstant.DELETE:
                this.currentIndex = index;
                this.IsDetail = false;
                this.DeleteBankAcc(BankAccAndStmntObj);
                break;
            case CommonConstant.CANCEL:
                this.ClearForm();
                this.IsDetail = false;
                break;
        }
        this.FormValidity(this.IsDetail);
        this.UpdateBankSection.emit({
            Key: 'IsDetail',
            Value: this.IsDetail,
            LtkmCustBankAccList: this.LtkmCustBankAccList
        });
    }

    SetForEdit(BankAccAndStmntObj: LtkmCustBankAccObj) {
        this.BankAccObj = new LtkmCustBankAccObj();
        this.InputLookupBankObj.nameSelect = BankAccAndStmntObj.BankName;
        this.InputLookupBankObj.jsonSelect = {
            bankName: BankAccAndStmntObj.BankName
        };
        this.BankAccObj.LtkmCustBankAccId = BankAccAndStmntObj.LtkmCustBankAccId;
        this.BankAccObj.BankCode = BankAccAndStmntObj.BankCode;
        this.BankAccObj.RowVersion = BankAccAndStmntObj.RowVersion;

        this.parentForm['controls'][this.identifier].patchValue({
            BankBranch: BankAccAndStmntObj.BankBranch,
            BankAccName: BankAccAndStmntObj.BankAccName,
            BankAccNo: BankAccAndStmntObj.BankAccNo,
            IsDefault: BankAccAndStmntObj.IsDefault,
            IsActive: BankAccAndStmntObj.IsActive,
            BegBalanceAmt: BankAccAndStmntObj.BegBalanceAmt
        })

        if (BankAccAndStmntObj.LtkmCustBankStmntObjs != undefined) {
            var bankStmnObjs = this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs'] as FormArray;
            for (let i = 0; i < BankAccAndStmntObj.LtkmCustBankStmntObjs.length; i++) {
                bankStmnObjs.push(this.AddGroup(BankAccAndStmntObj.LtkmCustBankStmntObjs[i]));
            }
        }

        this.AppCustBankStmntList = BankAccAndStmntObj.LtkmCustBankStmntObjs;
    }

    SetForEditLtkm(BankAccAndStmntObj: LtkmCustBankAccObj) {
        this.InputLookupBankObj.nameSelect = BankAccAndStmntObj.BankName;
        this.InputLookupBankObj.jsonSelect = {
            BankName: BankAccAndStmntObj.BankName
        };
        this.LtkmBankAccObj.LtkmCustBankAccId = BankAccAndStmntObj.LtkmCustBankAccId;
        this.LtkmBankAccObj.BankCode = BankAccAndStmntObj.BankCode;
        this.LtkmBankAccObj.RowVersion = BankAccAndStmntObj.RowVersion;

        this.parentForm['controls'][this.identifier].patchValue({
            BankBranch: BankAccAndStmntObj.BankBranch,
            BankAccName: BankAccAndStmntObj.BankAccName,
            BankAccNo: BankAccAndStmntObj.BankAccNo,
            IsDefault: BankAccAndStmntObj.IsDefault,
            IsActive: BankAccAndStmntObj.IsActive,
            BegBalanceAmt: BankAccAndStmntObj.BegBalanceAmt
        })

        if (BankAccAndStmntObj.LtkmCustBankStmntObjs != undefined) {
            var bankStmnObjs = this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs'] as FormArray;
            for (let i = 0; i < BankAccAndStmntObj.LtkmCustBankStmntObjs.length; i++) {
                bankStmnObjs.push(this.AddGroup(BankAccAndStmntObj.LtkmCustBankStmntObjs[i]));
            }
        }

        this.LtkmCustBankStmntList = BankAccAndStmntObj.LtkmCustBankStmntObjs;
    }

    ClearForm() {
        this.parentForm['controls'][this.identifier].patchValue({
            BankCode: "",
            BankBranch: "",
            BankAccName: "",
            BankAccNo: "",
            IsDefault: false,
            IsActive: false,
            BegBalanceAmt: 0
        })

        this.begBalance = 0;

        this.InputLookupBankObj.nameSelect = "";
        this.InputLookupBankObj.jsonSelect = {
            BankName: ""
        };

        var bankStmnObjs = this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs'] as FormArray;
        bankStmnObjs.reset();
        while (bankStmnObjs.length !== 0) bankStmnObjs.removeAt(0)
    }

    FormValidity(IsDetail: boolean, IsFirstInit: boolean = false) {
        if (IsDetail) {
            if (this.isLockMode) {
                this.InputLookupBankObj.isRequired = false;
                this.InputLookupBankObj.isDisable = true;
            } else {
                this.InputLookupBankObj.isRequired = true;
            }

            if (this.isLockMode) { } else {
                this.parentForm['controls'][this.identifier]['controls']['BankBranch'].setValidators([Validators.required]);
                this.parentForm['controls'][this.identifier]['controls']['BankAccName'].setValidators([Validators.required]);
                this.parentForm['controls'][this.identifier]['controls']['BankAccNo'].setValidators([Validators.required]);

                this.parentForm['controls'][this.identifier]['controls']['BankBranch'].updateValueAndValidity();
                this.parentForm['controls'][this.identifier]['controls']['BankAccName'].updateValueAndValidity();
                this.parentForm['controls'][this.identifier]['controls']['BankAccNo'].updateValueAndValidity();
            }

            for (let i = 0; i < this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"].length; i++) {
                this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["Month"].setValidators([Validators.required]);
                this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["Year"].setValidators([Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]+$")]);
                this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["DebitAmt"].setValidators([Validators.required]);
                this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["CreditAmt"].setValidators([Validators.required]);

                this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["DebitTrxCount"].setValidators([Validators.required, Validators.min(0), Validators.max(9999)]);
                this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["CreditTrxCount"].setValidators([Validators.required, Validators.min(0), Validators.max(9999)]);
                //this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["BalanceAmt"].setValidators([Validators.required]);
            }

            this.parentForm['controls'][this.identifier].updateValueAndValidity();
        } else {
            this.InputLookupBankObj.isRequired = false;
            this.parentForm['controls'][this.identifier]['controls']['BankBranch'].clearValidators();
            this.parentForm['controls'][this.identifier]['controls']['BankAccName'].clearValidators();
            this.parentForm['controls'][this.identifier]['controls']['BankAccNo'].clearValidators();
            this.parentForm['controls'][this.identifier]['controls']['BegBalanceAmt'].clearValidators();

            this.parentForm['controls'][this.identifier]['controls']['BankBranch'].updateValueAndValidity();
            this.parentForm['controls'][this.identifier]['controls']['BankAccName'].updateValueAndValidity();
            this.parentForm['controls'][this.identifier]['controls']['BankAccNo'].updateValueAndValidity();
            this.parentForm['controls'][this.identifier]['controls']['BegBalanceAmt'].updateValueAndValidity();

            if (!IsFirstInit) {
                for (let i = 0; i < this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"].length; i++) {
                    this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["Month"].clearValidators();
                    this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["Year"].clearValidators();
                    this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["DebitAmt"].clearValidators();
                    this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["CreditAmt"].clearValidators();

                    this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["DebitTrxCount"].clearValidators();
                    this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["CreditTrxCount"].clearValidators();
                    //this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs']["controls"][i]["controls"]["BalanceAmt"].clearValidators();
                }
                this.parentForm['controls'][this.identifier].updateValueAndValidity();
            }
        }
        console.log('see mana yg invalid nih');
        console.log(this.parentForm['controls'][this.identifier]);
    }

    AddRowCustBankStmnt() {
        var bankStmnObjs = this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs'] as FormArray;
        bankStmnObjs.push(this.AddGroup(undefined));
        this.FormValidity(this.IsDetail);

        this.isAlreadyCalc = false;
    }

    AddGroup(bankStmntObj) {
        if (bankStmntObj == undefined) {
            var dateYear = 0;
            if (this.parentForm['controls'][this.identifier].value['BankStmntObjs'].length > 0)
                dateYear = this.parentForm['controls'][this.identifier].value['BankStmntObjs'][0].Year;
            else {
                var userAcc: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
                var month = new Date(userAcc.BusinessDt).getMonth();
                dateYear = new Date(userAcc.BusinessDt).getFullYear();
                if (month == 0) dateYear--;
            }

            if (this.isLockMode) {
                return this.fb.group({
                    Month: [this.DefaultMonth],
                    Year: [dateYear],
                    DebitTrxCount: [0],
                    DebitAmt: [0],
                    CreditTrxCount: [0],
                    CreditAmt: [0],
                    BalanceAmt: [0] //, Validators.required]
                })
            } else {
                return this.fb.group({
                    Month: [this.DefaultMonth, [Validators.required, Validators.maxLength(2)]],
                    Year: [dateYear, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
                    DebitTrxCount: [0, [Validators.required, Validators.min(0), Validators.max(9999)]],
                    DebitAmt: [0, Validators.required],
                    CreditTrxCount: [0, [Validators.required, Validators.min(0), Validators.max(9999)]],
                    CreditAmt: [0, Validators.required],
                    BalanceAmt: [0] //, Validators.required]
                })
            }

        } else {
            if (this.isLockMode) {
                return this.fb.group({
                    Month: [bankStmntObj.Month],
                    Year: [bankStmntObj.Year],
                    DebitTrxCount: [bankStmntObj.DebitTrxCount],
                    DebitAmt: [bankStmntObj.DebitAmt],
                    CreditTrxCount: [bankStmntObj.CreditTrxCount],
                    CreditAmt: [bankStmntObj.CreditAmt],
                    BalanceAmt: [bankStmntObj.BalanceAmt] //, Validators.required]
                })
            } else {
                return this.fb.group({
                    Month: [bankStmntObj.Month, [Validators.required, Validators.maxLength(2)]],
                    Year: [bankStmntObj.Year, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
                    DebitTrxCount: [bankStmntObj.DebitTrxCount, [Validators.required, Validators.min(0), Validators.max(9999)]],
                    DebitAmt: [bankStmntObj.DebitAmt, Validators.required],
                    CreditTrxCount: [bankStmntObj.CreditTrxCount, [Validators.required, Validators.min(0), Validators.max(9999)]],
                    CreditAmt: [bankStmntObj.CreditAmt, Validators.required],
                    BalanceAmt: [bankStmntObj.BalanceAmt] //, Validators.required]
                })
            }

        }
    }

    RemoveCustBankStmnt(i) {
        var confirmation = confirm(ExceptionConstant.DELETE_CONFIRMATION);
        if (confirmation == true) {
            var formArray = this.parentForm['controls'][this.identifier].get('BankStmntObjs') as FormArray;
            formArray.removeAt(i);
            this.RowAppCustBankStmnt--;
        }
    }

    DeleteBankAcc(BankAccAndStmntObj: LtkmCustBankAccObj) {
        if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
            this.LtkmCustBankAccList.splice(this.currentIndex, 1);
        }
    }


    DeleteBankStmnt(index: number) {
        if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
            var bankStmnObjs = this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs'] as FormArray;
            bankStmnObjs.removeAt(index);
            this.LtkmCustBankAccList[this.currentIndex].LtkmCustBankStmntObjs.splice(index, 1);

            this.isAlreadyCalc = false;
        }
    }

    calculate() {
        this.begBalance = this.parentForm['controls'][this.identifier]['controls']['BegBalanceAmt'].value;

        var startBegBalance = this.parentForm['controls'][this.identifier]['controls']['BegBalanceAmt'].value;

        var arrayControl = this.parentForm['controls'][this.identifier].get('BankStmntObjs') as FormArray;

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


    SaveForm(enjiForm: NgForm) {
        if (this.isAlreadyCalc == false) {
            this.toastr.warningMessage(ExceptionConstant.CALC_FIRST);
            return false;
        }

        this.BankAccObj.BankBranch = this.parentForm['controls'][this.identifier]['controls'].BankBranch.value;
        this.BankAccObj.BankAccName = this.parentForm['controls'][this.identifier]['controls'].BankAccName.value;
        this.BankAccObj.BankAccNo = this.parentForm['controls'][this.identifier]['controls'].BankAccNo.value;
        this.BankAccObj.IsDefault = this.parentForm['controls'][this.identifier]['controls'].IsDefault.value;
        this.BankAccObj.IsActive = this.parentForm['controls'][this.identifier]['controls'].IsActive.value;
        this.BankAccObj.BegBalanceAmt = this.parentForm['controls'][this.identifier]['controls'].BegBalanceAmt.value;

        if (this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs'].value.length == 0) {
            this.toastr.warningMessage("Please input at least one bank account statement");
            return false;
        }

        console.log(this.parentForm);

        if (this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs'] != undefined) {
            this.ListBankStmntObj = new Array();
            for (let i = 0; i < this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs'].value.length; i++) {
                this.BankStmntObj = this.parentForm['controls'][this.identifier]['controls']['BankStmntObjs'].value[i];
                this.BankStmntObj.MonthName = this.MonthObj.filter(x => x.Key = this.BankStmntObj.Month)[0].Value;
                this.ListBankStmntObj.push(this.BankStmntObj)
                this.BankStmntObj = new LtkmCustBankStmntObj();
            }
            this.BankAccObj.LtkmCustBankStmntObjs = this.ListBankStmntObj;
        }

        if (this.Mode != "Edit") {
            this.LtkmCustBankAccList.push(this.BankAccObj);
            this.UpdateBankSection.emit({
                Key: 'IsDetail',
                Value: false,
                LtkmCustBankAccList: this.LtkmCustBankAccList
            });

            this.ClearForm();
        } else {
            this.LtkmCustBankAccList[this.currentIndex].BankBranch = this.parentForm['controls'][this.identifier]['controls'].BankBranch.value;
            this.LtkmCustBankAccList[this.currentIndex].BankAccName = this.parentForm['controls'][this.identifier]['controls'].BankAccName.value;
            this.LtkmCustBankAccList[this.currentIndex].BankAccNo = this.parentForm['controls'][this.identifier]['controls'].BankAccNo.value;
            this.LtkmCustBankAccList[this.currentIndex].IsDefault = this.parentForm['controls'][this.identifier]['controls'].IsDefault.value;
            this.LtkmCustBankAccList[this.currentIndex].IsActive = this.parentForm['controls'][this.identifier]['controls'].IsActive.value;
            this.LtkmCustBankAccList[this.currentIndex].BegBalanceAmt = this.parentForm['controls'][this.identifier]['controls'].BegBalanceAmt.value;
            this.LtkmCustBankAccList[this.currentIndex].LtkmCustBankStmntObjs = this.ListBankStmntObj;

            this.UpdateBankSection.emit({
                Key: 'IsDetail',
                Value: false,
                LtkmCustBankAccList: this.LtkmCustBankAccList
            });

            this.ClearForm();

        }

        this.IsDetail = false
        this.FormValidity(this.IsDetail);
    }

    ChangeTrxCountDebit(i) {
        var formArray = this.parentForm['controls'][this.identifier].get('BankStmntObjs') as FormArray;
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
        var formArray = this.parentForm['controls'][this.identifier].get('BankStmntObjs') as FormArray;
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

}
