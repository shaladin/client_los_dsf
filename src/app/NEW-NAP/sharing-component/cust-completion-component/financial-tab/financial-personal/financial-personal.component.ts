import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
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
    CommonConstant.AttrGroupCustPersonalFinData,
    CommonConstant.AttrGroupCustPersonalFinDataIncome,
    CommonConstant.AttrGroupCustPersonalFinDataExpense,
    CommonConstant.AttrGroupCustPersonalFinDataOther
  ];
  AppCustPersonalFinData: AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();

  @ViewChild('ModalPersonalFinData') ModalPersonalFinData;
  ListAppCustPersonalFinData: Array<AppCustPersonalFinDataObj> = [];
  IsAddFinData: boolean = true;
  currentCustFinDataIndex: number;
  currentModal: any;
  isCalculated: boolean = true;
  spouseMonthlyIncomeAmt: number;
  mrMaritalStatCode: string;
  maritalConstant: string = CommonConstant.MasteCodeMartialStatsMarried;

  CustAttrRequest: Array<Object> = new Array<Object>();
  MrSourceOfIncomeTypeObj: Array<KeyValueObj> = new Array();
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();
  IncomeList: Array<{ Index: number, Amount: number }> = new Array<{ Index: number, Amount: number }>();
  TotalIncomeListAmt: number = 0;
  ExpenseList: Array<{ Index: number, Amount: number }> = new Array<{ Index: number, Amount: number }>();
  TotalExpenseListAmt: number = 0;

  FinancialForm = this.fb.group({
    AppCustPersonalFinDataId: [0],
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
    NettProfitMonthlyAmt: [0],
    DateAsOf: [0],
    RowVersion: ['']
  })

  AppCustAttrListForm = this.fb.group({
  });



  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private modalService: NgbModal) { }

  async ngOnInit() {
    this.http.post<AppCustPersonalObj>(URLConstant.GetAppCustPersonalByAppCustId, { Id: this.AppCustId }).subscribe(
      (response) => {
        if (!response || response.MrMaritalStatCode == null) {
          this.mrMaritalStatCode = CommonConstant.MasteCodeMartialStatsSingle;
        }
        else {
          this.AppCustPersonalId = response.AppCustPersonalId
          this.mrMaritalStatCode = response.MrMaritalStatCode;
        }
      }
    );
    // await this.GetFinData();
    await this.GetListFinData();
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

  GetListFinData() {
    this.http.post<AppCustPersonalFinDataObj>(URLConstant.GetListAppCustPersonalFinDataByAppCustPersonalId, { Id: this.AppCustPersonalId }).subscribe(
      (response) => {
        this.ListAppCustPersonalFinData = response['ListAppCustPersonalFinData'];
      }
    );
  }

  GetFinData(currentCustFinDataIndex: number) {
    this.IsAddFinData = false;
    this.currentCustFinDataIndex = currentCustFinDataIndex;
    let custFinData: AppCustPersonalFinDataObj = this.ListAppCustPersonalFinData[this.currentCustFinDataIndex];
    let datePipe = new DatePipe("en-US");
    if (!custFinData) {
      custFinData = new AppCustPersonalFinDataObj();
      this.IsAddFinData = true;
    }
    this.FinancialForm.patchValue({
      AppCustPersonalFinDataId: custFinData.AppCustPersonalFinDataId,
      AppCustPersonalId: this.AppCustPersonalId,
      MonthlyIncomeAmt: custFinData.MonthlyIncomeAmt,
      MrSourceOfIncomeTypeCode: custFinData.MrSourceOfIncomeTypeCode,
      OtherIncomeAmt: custFinData.OtherIncomeAmt,
      IsJoinIncome: custFinData.IsJoinIncome,
      MonthlyExpenseAmt: custFinData.MonthlyExpenseAmt,
      MonthlyInstallmentAmt: custFinData.MonthlyInstallmentAmt,
      OtherMonthlyInstAmt: custFinData.OtherMonthlyInstallmentAmt,
      SpouseMonthlyIncomeAmt: custFinData.SpouseMonthlyIncomeAmt,
      DateAsOf: custFinData.DateAsOf ? datePipe.transform(custFinData.DateAsOf, 'yyyy-MM-dd') : '',
      RowVersion: custFinData.RowVersion
    });
    // this.CalculateFinData();

    if (this.IsAddFinData) this.FinancialForm.controls['DateAsOf'].setValidators([Validators.required]);
    else this.FinancialForm.controls['DateAsOf'].clearValidators();
    this.FinancialForm.controls['DateAsOf'].updateValueAndValidity();

    this.currentModal = this.modalService.open(this.ModalPersonalFinData, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  showModalCustFinData(FinDataIndex: number) {
    this.isCalculated = false;
    this.GetRefMaster();
    this.getSingleCustPersonalFinData(FinDataIndex);
    this.currentModal = this.modalService.open(this.ModalPersonalFinData, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  getSingleCustPersonalFinData(currentCustFinDataIndex: number) {
    this.IsAddFinData = false;
    this.currentCustFinDataIndex = currentCustFinDataIndex;
    let custFinData: AppCustPersonalFinDataObj = this.ListAppCustPersonalFinData[this.currentCustFinDataIndex];
    let datePipe = new DatePipe("en-US");
    if (!custFinData) {
      custFinData = new AppCustPersonalFinDataObj();
      this.IsAddFinData = true;
    }
    this.FinancialForm.patchValue({
      AppCustPersonalFinDataId: custFinData.AppCustPersonalFinDataId,
      AppCustPersonalId: custFinData.AppCustPersonalId,
      MonthlyIncomeAmt: custFinData.MonthlyIncomeAmt,
      MonthlyExpenseAmt: custFinData.MonthlyExpenseAmt,
      MonthlyInstallmentAmt: custFinData.MonthlyInstallmentAmt,
      MrSourceOfIncomeTypeCode: custFinData.MrSourceOfIncomeTypeCode,//beda
      SpouseMonthlyIncomeAmt: this.mrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried ? custFinData.SpouseMonthlyIncomeAmt : 0,
      IsJoinIncome: this.mrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried ? custFinData.IsJoinIncome : false,
      TotalIncomeAmt: custFinData.TotalIncomeAmt,
      NettIncomeAmt: custFinData.NettIncomeAmt,
      NettProfitMonthlyAmt: custFinData.NettProfitMonthlyAmt,
      OtherIncomeAmt: custFinData.OtherIncomeAmt,
      OtherMonthlyInstAmt: custFinData.OtherMonthlyInstallmentAmt,
      DateAsOf: custFinData.DateAsOf ? datePipe.transform(custFinData.DateAsOf, 'yyyy-MM-dd') : '',
      RowVersion: custFinData.RowVersion
    });

    if (this.IsAddFinData) this.FinancialForm.controls['DateAsOf'].setValidators([Validators.required]);
    else this.FinancialForm.controls['DateAsOf'].clearValidators();
    this.FinancialForm.controls['DateAsOf'].updateValueAndValidity();
  }

  GetEvent(event) {
    if (event != undefined && event.Key == "IsDetail") {
      this.IsDetail = event.Value;
    }
  }

  calculatePersonalFinData() {
    Object.keys(this.FinancialForm.controls).forEach(key => {
      this.FinancialForm.get(key).markAsTouched();
    });
    if (this.FinancialForm.valid) {
      var formData = this.FinancialForm.value;
      var monthlyIncomeAmt = formData.MonthlyIncomeAmt == "" ? 0 : formData.MonthlyIncomeAmt;

      var spouseMonthlyIncomeAmt = formData.SpouseMonthlyIncomeAmt == "" ? 0 : formData.SpouseMonthlyIncomeAmt;
      var totalIncomeAmt = 0;
      var nettIncomeAmt = 0;
      // var nettProfitMonthlyAmt = formData.NettProfitMonthlyAmt == "" ? 0 : formData.NettProfitMonthlyAmt;
      var otherIncomeAmt = formData.OtherIncomeAmt == "" ? 0 : formData.OtherIncomeAmt;
      var monthlyExpenseAmt = formData.MonthlyExpenseAmt == "" ? 0 : formData.MonthlyExpenseAmt;
      var monthlyInstallmentAmt = formData.MonthlyInstallmentAmt == "" ? 0 : formData.MonthlyInstallmentAmt;
      var otherMonthlyInstAmt = formData.OtherMonthlyInstAmt == "" ? 0 : formData.OtherMonthlyInstAmt;
      var totalAmt = 0;


      if (formData.IsJoinIncome) {
        totalAmt = monthlyIncomeAmt + spouseMonthlyIncomeAmt + totalIncomeAmt + nettIncomeAmt 
        // + nettProfitMonthlyAmt 
        + otherIncomeAmt;
      }
      else {
        totalAmt = monthlyIncomeAmt + totalIncomeAmt + nettIncomeAmt 
        // + nettProfitMonthlyAmt 
        + otherIncomeAmt;
      }
      var netIncomeAmt = totalAmt - (monthlyExpenseAmt + monthlyInstallmentAmt + otherMonthlyInstAmt);

      this.FinancialForm.patchValue({
        TotalIncomeAmt: totalAmt,
        NettIncomeAmt: netIncomeAmt
      });
      this.isCalculated = true;
      this.spouseMonthlyIncomeAmt = this.FinancialForm.controls["SpouseMonthlyIncomeAmt"].value;
    }
  }

  onChangeCustFinInput() {
    this.isCalculated = false;
  }

  SetAttrContent() {
    var formValue = this.AppCustAttrListForm['controls']['AttrList'].value;
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
    if (this.AppCustAttrListForm.get('AttrList') != undefined) {
      this.SetAttrContent();
    }

    if (!this.ListAppCustPersonalFinData.length) {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_INPUT_FIN_DATA);
      return;
    }

    // this.AppCustPersonalFinData = this.AppCustAttrListForm.value;
    // this.AppCustPersonalFinData.AppCustPersonalId = this.AppCustPersonalId;

    let request = {
      ListAppCustFinDataAttrObj: this.CustAttrRequest,
      // AppCustPersonalFinDataObj: this.AppCustPersonalFinData,
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

  async SaveAppCustPersonalFinData() {
    if (!this.FinancialForm.valid) return;

    if (!this.isCalculated) {
      this.toastr.warningMessage("Please Calculate First");
      return;
    }

    let custFinData: AppCustPersonalFinDataObj = {
      AppCustPersonalFinDataId: this.FinancialForm.controls['AppCustPersonalFinDataId'].value,
      AppCustPersonalId: this.AppCustPersonalId,
      DateAsOf: this.FinancialForm.controls['DateAsOf'].value,
      MonthlyIncomeAmt: this.FinancialForm.controls['MonthlyIncomeAmt'].value,
      MonthlyExpenseAmt: this.FinancialForm.controls['MonthlyExpenseAmt'].value,
      MonthlyInstallmentAmt: this.FinancialForm.controls['MonthlyInstallmentAmt'].value,
      MrSourceOfIncomeTypeCode: this.FinancialForm.controls['MrSourceOfIncomeTypeCode'].value,
      SpouseMonthlyIncomeAmt: this.FinancialForm.controls['SpouseMonthlyIncomeAmt'].value,
      IsJoinIncome: this.FinancialForm.controls['IsJoinIncome'].value,
      TotalIncomeAmt: this.FinancialForm.controls['TotalIncomeAmt'].value,
      NettIncomeAmt: this.FinancialForm.controls['NettIncomeAmt'].value,
      NettProfitMonthlyAmt: this.FinancialForm.controls['NettProfitMonthlyAmt'].value,
      OtherIncomeAmt: this.FinancialForm.controls['OtherIncomeAmt'].value,
      OtherMonthlyInstallmentAmt: this.FinancialForm.controls['OtherMonthlyInstAmt'].value,
      RowVersion: this.FinancialForm.controls['RowVersion'].value,
    };

    await this.http.post(URLConstant.AddEditAppCustPersonalFinData, { AppCustPersonalFinDataObj: custFinData }).toPromise().then(
      (response) => {
        if (this.currentModal) this.currentModal.close();
      }
    );

    await this.GetListFinData();
  }

  async deleteModalCustFinData(FinDataIndex: number) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var CustPersonalFinDataCustomObj = { Id: this.ListAppCustPersonalFinData[FinDataIndex].AppCustPersonalFinDataId };
      await this.http.post(URLConstant.DeleteAppCustPersonalFinData, CustPersonalFinDataCustomObj).toPromise().then(
        (response) => {
          this.ListAppCustPersonalFinData.splice(FinDataIndex, 1);
        }
      );
    }
  }
}