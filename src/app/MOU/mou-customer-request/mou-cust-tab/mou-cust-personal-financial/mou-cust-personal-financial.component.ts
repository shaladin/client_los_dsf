import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MouCustPersonalFinDataObj } from 'app/shared/model/MouCustPersonalFinDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-mou-cust-personal-financial',
  templateUrl: './mou-cust-personal-financial.component.html',
  styleUrls: ['./mou-cust-personal-financial.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class MouCustPersonalFinancialComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() MouCustPersonalFinDataObj: MouCustPersonalFinDataObj = new MouCustPersonalFinDataObj();
  @Input() isMarried: boolean = true;
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  SourceOfIncomeObj: Array<KeyValueObj>;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient) {

     }

  ngOnInit() {
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.group({
      MonthlyIncomeAmt: [0, Validators.required],
      MonthlyExpenseAmt: [0],
      MonthlyInstallmentAmt: [0],
      MrSourceOfIncomeTypeCode: [''],
      IsJoinIncome: [false],
      SpouseMonthlyIncomeAmt: [0],
      TotalMonthlyIncome: [this.MouCustPersonalFinDataObj.MonthlyIncomeAmt + this.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt],
      TotalMonthlyExpense: [this.MouCustPersonalFinDataObj.MonthlyExpenseAmt + this.MouCustPersonalFinDataObj.MonthlyInstallmentAmt],
      NettMonthlyIncome: [(this.MouCustPersonalFinDataObj.MonthlyIncomeAmt + this.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt)-(this.MouCustPersonalFinDataObj.MonthlyExpenseAmt + this.MouCustPersonalFinDataObj.MonthlyInstallmentAmt)]
    }));

    this.bindSourceOfIncomeObj();
  }

  setSpouseMonthlyIncome(){
    if(this.parentForm.controls[this.identifier]["controls"].IsJoinIncome.value == false){
      this.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt = 0;
      this.parentForm.controls[this.identifier].patchValue({
        SpouseMonthlyIncomeAmt: 0
      });
    }
    this.ChangeTotalMonthly();
  }

  bindAppCustPersonalFinData(){
    if(this.MouCustPersonalFinDataObj.MouCustPersonalId!= 0){
      this.parentForm.controls[this.identifier].patchValue({
        MonthlyIncomeAmt: this.MouCustPersonalFinDataObj.MonthlyIncomeAmt,
        MonthlyExpenseAmt: this.MouCustPersonalFinDataObj.MonthlyExpenseAmt,
        MonthlyInstallmentAmt: this.MouCustPersonalFinDataObj.MonthlyInstallmentAmt,
        MrSourceOfIncomeTypeCode: this.MouCustPersonalFinDataObj.MrSourceOfIncomeTypeCode,
        IsJoinIncome: this.MouCustPersonalFinDataObj.IsJoinIncome,
        SpouseMonthlyIncomeAmt: this.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt,
      });
      this.ChangeTotalMonthly();
    }
  }

  bindSourceOfIncomeObj(){
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {"RefMasterTypeCode": CommonConstant.RefMasterTypeCodeSourceIncome}).subscribe(
      (response) => {
        this.SourceOfIncomeObj = response[CommonConstant.ReturnObj];
        if(this.SourceOfIncomeObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            MrSourceOfIncomeTypeCode: this.SourceOfIncomeObj[0].Key
          });
        }
      }
    );
  }

  ChangeTotalMonthly(){
    let TotalMonthlyIncome = this.parentForm.controls[this.identifier].get("MonthlyIncomeAmt").value + this.parentForm.controls[this.identifier].get("SpouseMonthlyIncomeAmt").value;
    let TotalMonthlyExpense = this.parentForm.controls[this.identifier].get("MonthlyExpenseAmt").value + this.parentForm.controls[this.identifier].get("MonthlyInstallmentAmt").value;
    this.parentForm.controls[this.identifier].patchValue({
      TotalMonthlyIncome: TotalMonthlyIncome,
      TotalMonthlyExpense: TotalMonthlyExpense,
      NettMonthlyIncome: TotalMonthlyIncome - TotalMonthlyExpense
    });
  }
}
