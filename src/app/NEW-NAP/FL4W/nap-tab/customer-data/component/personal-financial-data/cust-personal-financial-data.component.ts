import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';

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
      SpouseMonthlyIncomeAmt: [0]
    }));

    this.initUrl();
    this.bindSourceOfIncomeObj();
    this.bindAppCustPersonalFinData();
  }

  setSpouseMonthlyIncome(){
    if(this.parentForm.controls[this.identifier]["controls"].IsJoinIncome.value == false){
      this.appCustPersonalFinDataObj.SpouseMonthlyIncomeAmt = 0;
    }
  }

  bindAppCustPersonalFinData(){
    if(this.appCustPersonalFinDataObj != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        MonthlyIncomeAmt: this.appCustPersonalFinDataObj.MonthlyIncomeAmt,
        MonthlyExpenseAmt: this.appCustPersonalFinDataObj.MonthlyExpenseAmt,
        MonthlyInstallmentAmt: this.appCustPersonalFinDataObj.MonthlyInstallmentAmt,
        MrSourceOfIncomeTypeCode: this.appCustPersonalFinDataObj.MrSourceOfIncomeTypeCode,
        IsJoinIncome: this.appCustPersonalFinDataObj.IsJoinIncome,
      });
    }
  }
  

  initUrl(){
    this.getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
  }

  bindSourceOfIncomeObj(){
    this.refMasterObj.RefMasterTypeCode = "SOURCE_INCOME";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.SourceOfIncomeObj = response["ReturnObject"];
        if(this.SourceOfIncomeObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            MrSourceOfIncomeTypeCode: this.SourceOfIncomeObj[0].Key
          });
        }
      }
    );
  }

}
