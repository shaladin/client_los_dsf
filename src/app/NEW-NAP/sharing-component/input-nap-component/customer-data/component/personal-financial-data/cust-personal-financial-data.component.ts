import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-cust-personal-financial-data',
  templateUrl: './cust-personal-financial-data.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustPersonalFinancialDataComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() appCustPersonalFinDataObj: AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  custDataObj: CustDataObj;

  SourceOfIncomeObj: any;

  getRefMasterUrl: any;


  constructor(
    private fb: FormBuilder, 
    private http: HttpClient) {

     }

  ngOnInit() {
    console.log(this.identifier);
    console.log(this.parentForm);

    this.parentForm.removeControl(this.identifier);
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

    this.initUrl();
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
    console.log(this.appCustPersonalFinDataObj);
    if(this.appCustPersonalFinDataObj != undefined){
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
  
  initUrl(){
    this.getRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
  }

  bindSourceOfIncomeObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeSourceIncome;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
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
    console.log("Calc Total");
    let TotalMonthlyIncome = this.parentForm.controls[this.identifier].get("MonthlyIncomeAmt").value + this.parentForm.controls[this.identifier].get("SpouseMonthlyIncomeAmt").value;
    let TotalMonthlyExpense = this.parentForm.controls[this.identifier].get("MonthlyExpenseAmt").value + this.parentForm.controls[this.identifier].get("MonthlyInstallmentAmt").value;
    this.parentForm.controls[this.identifier].patchValue({
      TotalMonthlyIncome: TotalMonthlyIncome,
      TotalMonthlyExpense: TotalMonthlyExpense,
      NettMonthlyIncome: TotalMonthlyIncome - TotalMonthlyExpense
    });
  }
}
