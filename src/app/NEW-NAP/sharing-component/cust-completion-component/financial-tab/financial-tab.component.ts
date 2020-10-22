import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-financial-tab',
  templateUrl: './financial-tab.component.html',
  styleUrls: ['./financial-tab.component.scss']
})
export class FinancialTabComponent implements OnInit {

  @Input() AppCustId: number;
  @Input() AppCustPersonalId: number;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  IsDetail: boolean = false;
  AppCustPersonalFinData: AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
  MrSourceOfIncomeTypeObj: Array<KeyValueObj> = new Array();
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();

  FinancialForm = this.fb.group({
    MonthlyIncomeAmt: ['', Validators.required],
    MrSourceOfIncomeTypeCode: [''],
    OtherIncomeAmt: [0],
    IsJoinIncome: [false],
    MonthlyExpenseAmt: [0],
    MonthlyInstallmentAmt: [0],
    OtherMonthlyInstAmt: [0],
    SpouseMonthlyIncomeAmt: [0],
    TotalIncomeAmt: [0],
    NettIncomeAmt: [0]
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

  GetFinData(){
    this.http.post(URLConstant.GetAppCustPersonalFinDataByAppCustPersonalId, { AppCustPersonalId: this.AppCustPersonalId }).subscribe(
      async (response) => {
        if(response["AppCustPersonalFinDataId"] != 0){
          await this.FinancialForm.patchValue({
            MonthlyIncomeAmt: response["MonthlyIncomeAmt"],
            MrSourceOfIncomeTypeCode: response["MrSourceOfIncomeTypeCode"],
            OtherIncomeAmt: response["OtherIncomeAmt"],
            IsJoinIncome: response["IsJoinIncome"],
            MonthlyExpenseAmt: response["MonthlyExpenseAmt"],
            MonthlyInstallmentAmt: response["MonthlyInstallmentAmt"],
            OtherMonthlyInstAmt: response["OtherMonthlyInstAmt"],
            SpouseMonthlyIncomeAmt: response["SpouseMonthlyIncomeAmt"]
          });
          this.AppCustPersonalFinData.RowVersion = response["RowVersion"];
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
      TotalIncomeAmt = MonthlyIncomeAmt + SpouseMonthlyIncomeAmt + OtherIncomeAmt;
    } else {
      TotalIncomeAmt = MonthlyIncomeAmt + OtherIncomeAmt;
    }

    NettIncomeAmt = TotalIncomeAmt - (MonthlyExpenseAmt + MonthlyInstallmentAmt + OtherMonthlyInstAmt);

    this.FinancialForm.patchValue({
      TotalIncomeAmt: TotalIncomeAmt,
      NettIncomeAmt: NettIncomeAmt
    });
  }

  SaveForm() {
    this.AppCustPersonalFinData.AppCustPersonalId = this.AppCustPersonalId;
    this.AppCustPersonalFinData.MonthlyIncomeAmt = this.FinancialForm.controls.MonthlyIncomeAmt.value;
    this.AppCustPersonalFinData.MrSourceOfIncomeTypeCode = this.FinancialForm.controls.MrSourceOfIncomeTypeCode.value;
    this.AppCustPersonalFinData.OtherIncomeAmt = this.FinancialForm.controls.OtherIncomeAmt.value;
    this.AppCustPersonalFinData.IsJoinIncome = this.FinancialForm.controls.IsJoinIncome.value;
    this.AppCustPersonalFinData.MonthlyExpenseAmt = this.FinancialForm.controls.MonthlyExpenseAmt.value;
    this.AppCustPersonalFinData.MonthlyInstallmentAmt = this.FinancialForm.controls.MonthlyInstallmentAmt.value;
    this.AppCustPersonalFinData.OtherMonthlyInstAmt = this.FinancialForm.controls.OtherMonthlyInstAmt.value;
    this.AppCustPersonalFinData.SpouseMonthlyIncomeAmt = this.FinancialForm.controls.SpouseMonthlyIncomeAmt.value;
    this.AppCustPersonalFinData.TotalIncomeAmt = this.FinancialForm.controls.TotalIncomeAmt.value;
    this.AppCustPersonalFinData.NettIncomeAmt = this.FinancialForm.controls.NettIncomeAmt.value;

    this.http.post(URLConstant.AddEditAppCustPersonalFinData, this.AppCustPersonalFinData).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.OutputTab.emit();
      });

  }
}
