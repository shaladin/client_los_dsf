import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-cust-personal-financial-data',
  templateUrl: './cust-personal-financial-data.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustPersonalFinancialDataComponent implements OnInit, OnChanges {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() appCustPersonalFinDataObj: AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
  @Input() isMarried: boolean;
  @Input() isLockMode: boolean = null;

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  custDataObj: CustDataObj;

  SourceOfIncomeObj: Array<KeyValueObj>;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient) {

     }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes.isMarried.currentValue){
      this.appCustPersonalFinDataObj.IsJoinIncome = false;
      this.appCustPersonalFinDataObj.SpouseMonthlyIncomeAmt = 0;
      this.parentForm.controls[this.identifier].patchValue({
        IsJoinIncome: this.appCustPersonalFinDataObj.IsJoinIncome,
        SpouseMonthlyIncomeAmt: this.appCustPersonalFinDataObj.SpouseMonthlyIncomeAmt
      });
      this.ChangeTotalMonthly();
    }
  }

  ngOnInit() {

    this.parentForm.removeControl(this.identifier);

    if(this.isLockMode){
      this.parentForm.addControl(this.identifier, this.fb.group({
        MonthlyIncomeAmt: [0],
        MonthlyExpenseAmt: [0],
        MonthlyInstallmentAmt: [0],
        MrSourceOfIncomeTypeCode: [''],
        IsJoinIncome: [false],
        SpouseMonthlyIncomeAmt: [0],
        TotalMonthlyIncome: [0],
        TotalMonthlyExpense: [0],
        NettMonthlyIncome: [0]
      }));
    }else{
      this.parentForm.addControl(this.identifier, this.fb.group({
        MonthlyIncomeAmt: [0, Validators.required],
        MonthlyExpenseAmt: [0],
        MonthlyInstallmentAmt: [0],
        MrSourceOfIncomeTypeCode: [''],
        IsJoinIncome: [false],
        SpouseMonthlyIncomeAmt: [0],
        TotalMonthlyIncome: [0],
        TotalMonthlyExpense: [0],
        NettMonthlyIncome: [0]
      }));
    }
    
    this.bindSourceOfIncomeObj();
    this.bindAppCustPersonalFinData();
  }

  setSpouseMonthlyIncome(){
    if(this.parentForm.controls[this.identifier]["controls"].IsJoinIncome.value == false){
      this.appCustPersonalFinDataObj.SpouseMonthlyIncomeAmt = 0;
      this.parentForm.controls[this.identifier].patchValue({
        SpouseMonthlyIncomeAmt: 0
      });
    }
    this.ChangeTotalMonthly();
  }

  bindAppCustPersonalFinData(){
    if(this.appCustPersonalFinDataObj.AppCustPersonalId != 0){
      if(!this.isMarried){
        this.appCustPersonalFinDataObj.IsJoinIncome = false;
        this.appCustPersonalFinDataObj.SpouseMonthlyIncomeAmt = 0;
      }
      this.parentForm.controls[this.identifier].patchValue({
        MonthlyIncomeAmt: this.appCustPersonalFinDataObj.MonthlyIncomeAmt,
        MonthlyExpenseAmt: this.appCustPersonalFinDataObj.MonthlyExpenseAmt,
        MonthlyInstallmentAmt: this.appCustPersonalFinDataObj.MonthlyInstallmentAmt,
        MrSourceOfIncomeTypeCode: this.appCustPersonalFinDataObj.MrSourceOfIncomeTypeCode,
        IsJoinIncome: this.appCustPersonalFinDataObj.IsJoinIncome,
        SpouseMonthlyIncomeAmt: this.appCustPersonalFinDataObj.SpouseMonthlyIncomeAmt,
      });
      this.ChangeTotalMonthly();
    }
  }

  bindSourceOfIncomeObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeSourceIncome;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
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
