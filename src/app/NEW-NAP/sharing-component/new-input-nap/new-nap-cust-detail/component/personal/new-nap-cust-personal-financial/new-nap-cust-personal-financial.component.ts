import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-new-nap-cust-personal-financial',
  templateUrl: './new-nap-cust-personal-financial.component.html',
  styles: []
})
export class NewNapCustPersonalFinancialComponent implements OnInit {
  @Input() ParentForm: FormGroup;
  @Input() AppCustId: number;
  @Input() AppCustPersonalId: number;
  @Input() IsMarried: boolean;
  @Input() IsFinancialSubmitted: boolean;
  @Output() ResponseBankAcc: EventEmitter<any>;
  IsDetail: boolean = false;
  AttrGroup: string = CommonConstant.AttrGroupCustPersonalFinData;
  AppCustPersonalFinData: AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
  CustAttrRequest: Array<Object>;
  MrSourceOfIncomeTypeObj: Array<KeyValueObj> = new Array();
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) { 
    this.IsFinancialSubmitted = false;
    this.ResponseBankAcc = new EventEmitter<any>();
  }

  async ngOnInit() {
    await this.GetRefMaster();
    if(this.AppCustPersonalId && this.AppCustPersonalId > 0){
      await this.GetFinData();
    }
  }

  GetRefMaster() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeSourceIncome }).subscribe(
      (response) => {
        this.MrSourceOfIncomeTypeObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
          MrSourceOfIncomeTypeCode: this.MrSourceOfIncomeTypeObj[0].Key
        });
      }
    );
  }

  GetFinData(){
    this.http.post<AppCustPersonalFinDataObj>(URLConstant.GetAppCustPersonalFinDataByAppCustPersonalId, { AppCustPersonalId: this.AppCustPersonalId }).subscribe(
      async (response) => {
        if(response.AppCustPersonalFinDataId != 0){
          await this.ParentForm.patchValue({
            MonthlyIncomeAmt: response.MonthlyIncomeAmt,
            MrSourceOfIncomeTypeCode: response.MrSourceOfIncomeTypeCode,
            OtherIncomeAmt: response.OtherIncomeAmt,
            IsJoinIncome: response.IsJoinIncome,
            MonthlyExpenseAmt: response.MonthlyExpenseAmt,
            MonthlyInstallmentAmt: response.MonthlyInstallmentAmt,
            OtherMonthlyInstAmt: response.OtherMonthlyInstAmt,
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
      this.ResponseBankAcc.emit(event.AppCustBankAccList);
    }
  }

  CalculateFinData() {
    let FormData = this.ParentForm.value;
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

    this.ParentForm.patchValue({
      TotalIncomeAmt: TotalIncomeAmt,
      NettIncomeAmt: NettIncomeAmt
    });
  }
}
