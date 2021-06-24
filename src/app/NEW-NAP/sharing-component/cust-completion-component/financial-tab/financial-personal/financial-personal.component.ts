import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-financial-personal',
  templateUrl: './financial-personal.component.html',
  styleUrls: ['./financial-personal.component.scss']
})
export class FinancialPersonalComponent implements OnInit {
  @Input() AppCustId: number;
  @Input() AppCustPersonalId: number;
  @Input() IsMarried: boolean;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();

  IsDetail: boolean = false;
  AttrGroups: Array<string> = [
    CommonConstant.AttrGroupCustPersonalFinDataIncome,
    CommonConstant.AttrGroupCustPersonalFinDataExpense
  ];
  AppCustPersonalFinData: AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
  CustAttrRequest: Array<Object> = new Array<Object>();
  MrSourceOfIncomeTypeObj: Array<KeyValueObj> = new Array();
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();
  IncomeList: Array<{Index: number, Amount: number}> = new Array<{Index: number, Amount: number}>();
  TotalIncomeListAmt: number = 0;
  ExpenseList: Array<{Index: number, Amount: number}> = new Array<{Index: number, Amount: number}>();
  TotalExpenseListAmt: number = 0;

  FinancialForm = this.fb.group({
    AppCustPersonalId: [0],
    MonthlyIncomeAmt: ['', Validators.required],
    MrSourceOfIncomeTypeCode: [''],
    OtherIncomeAmt: [0],
    IsJoinIncome: [false],
    MonthlyExpenseAmt: [0],
    MonthlyInstallmentAmt: [0],
    OtherMonthlyInstAmt: [0],
    SpouseMonthlyIncomeAmt: [0],
    TotalIncomeAmt: [0],
    NettIncomeAmt: [0],
    RowVersion: ['']
  })

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) { }

  async ngOnInit() {
    await this.GetRefMaster();
    await this.GetFinData();
  }

  GetRefMaster() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeSourceIncome }).subscribe(
      (response) => {
        this.MrSourceOfIncomeTypeObj = response[CommonConstant.ReturnObj];
        this.FinancialForm.patchValue({
          MrSourceOfIncomeTypeCode: this.MrSourceOfIncomeTypeObj[0].Key
        });
      }
    );
  }

  isDataExist: boolean = false;
  GetFinData() {
    this.http.post<AppCustPersonalFinDataObj>(URLConstant.GetAppCustPersonalFinDataByAppCustPersonalId, { Id: this.AppCustPersonalId }).subscribe(
      async (response) => {
        if (response.AppCustPersonalFinDataId != 0) {
          this.isDataExist = true;
          await this.FinancialForm.patchValue({
            MonthlyIncomeAmt: response.MonthlyIncomeAmt,
            MrSourceOfIncomeTypeCode: response.MrSourceOfIncomeTypeCode,
            OtherIncomeAmt: response.OtherIncomeAmt,
            IsJoinIncome: response.IsJoinIncome,
            MonthlyExpenseAmt: response.MonthlyExpenseAmt,
            MonthlyInstallmentAmt: response.MonthlyInstallmentAmt,
            OtherMonthlyInstAmt: response.OtherMonthlyInstallmentAmt,
            SpouseMonthlyIncomeAmt: response.SpouseMonthlyIncomeAmt,
            RowVersion: response.RowVersion
          });
          await this.CalculateFinData();
        }
      }
    );
  }

  GetEvent(event) {
    if (event != undefined && event.Key == "IsDetail") {
      this.IsDetail = event.Value;
    }
  }

  CalculateFinData() {
    let FormData = this.FinancialForm.value;
    let MonthlyIncomeAmt = FormData.MonthlyIncomeAmt;
    let OtherIncomeAmt = FormData.OtherIncomeAmt;
    let SpouseMonthlyIncomeAmt = FormData.SpouseMonthlyIncomeAmt;
    let MonthlyExpenseAmt = FormData.MonthlyExpenseAmt;
    let MonthlyInstallmentAmt = FormData.MonthlyInstallmentAmt;
    let OtherMonthlyInstAmt = FormData.OtherMonthlyInstAmt;
    let TotalIncomeAmt = FormData.TotalIncomeAmt;
    let NettIncomeAmt = FormData.NettIncomeAmt;

    if (FormData.IsJoinIncome) {
      TotalIncomeAmt = MonthlyIncomeAmt + SpouseMonthlyIncomeAmt + OtherIncomeAmt + this.TotalIncomeListAmt;
    }
    else {
      TotalIncomeAmt = MonthlyIncomeAmt + OtherIncomeAmt + this.TotalIncomeListAmt;
    }

    NettIncomeAmt = TotalIncomeAmt - (MonthlyExpenseAmt + MonthlyInstallmentAmt + OtherMonthlyInstAmt + this.TotalExpenseListAmt);

    this.FinancialForm.patchValue({
      TotalIncomeAmt: TotalIncomeAmt,
      NettIncomeAmt: NettIncomeAmt
    });
  }

  SetAttrContent() {
    var formValue = this.FinancialForm['controls']['AttrList'].value;
    this.CustAttrRequest = new Array<Object>();

    if (Object.keys(formValue).length > 0 && formValue.constructor === Object) {
      for (const key in formValue) {
        if (formValue[key]["AttrValue"] != null) {
          var custAttr = {
            CustAttrContentId: formValue[key]["CustAttrContentId"],
            AppCustId: this.AppCustId,
            RefAttrCode: formValue[key]["AttrCode"],
            AttrValue: formValue[key]["AttrValue"],
            AttrGroup: formValue[key]["AttrGroup"]
          };
          this.CustAttrRequest.push(custAttr);
        }
      }
    }
  }

  SaveForm() {
    if (this.FinancialForm.get('AttrList') != undefined) {
      this.SetAttrContent();
    }

    this.AppCustPersonalFinData = this.FinancialForm.value;
    this.AppCustPersonalFinData.AppCustPersonalId = this.AppCustPersonalId;

    let request = {
      ListAppCustAttrObj: this.CustAttrRequest,
      AppCustPersonalFinDataObj: this.AppCustPersonalFinData,
      AttrGroups: this.AttrGroups
    }
    if (!this.isDataExist) {
      this.http.post(URLConstant.AddAppCustPersonalFinData, request).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit({ IsComplete: true });
        });
    }
    else {
      this.http.post(URLConstant.EditAppCustPersonalFinData, request).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit({ IsComplete: true });
        }
      );
    }
  }

  CalculateIncomeAmt(event: any) {
    let objectAmount = this.IncomeList.find(f => f.Index === event.Index);
    if(objectAmount === undefined) {
      this.IncomeList.push({Index: event.Index, Amount: event.Amount});
    }
    else {
      objectAmount.Amount = event.Amount;
    }

    this.TotalIncomeListAmt = 0
    this.IncomeList.forEach(fe => this.TotalIncomeListAmt += fe.Amount);
    this.CalculateFinData();
  }

  CalculateExpenseAmt(event: any) {
    let objectAmount = this.ExpenseList.find(f => f.Index === event.Index);
    if(objectAmount === undefined) {
      this.ExpenseList.push({Index: event.Index, Amount: event.Amount});
    }
    else {
      objectAmount.Amount = event.Amount;
    }

    this.TotalExpenseListAmt = 0
    this.ExpenseList.forEach(fe => this.TotalExpenseListAmt += fe.Amount);
    this.CalculateFinData();
  }
}