import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';

@Component({
  selector: 'app-cust-personal-financial-data',
  templateUrl: './cust-personal-financial-data.component.html',
  styleUrls: ['./cust-personal-financial-data.component.scss'],
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
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {

     }

  ngOnInit() {
    console.log(this.identifier);
    console.log(this.parentForm);

    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.group({
      MonthlyIncomeAmt: ['0', Validators.required],
      MonthlyExpenseAmt: ['0', Validators.required],
      MrSourceOfIncomeTypeCode: [''],
      MonthlyInstallmentAmt: ['0', Validators.required],
      IsJoinIncome: [false],
      SpouseMonthlyIncomeAmt: ['0', Validators.required],
    }));

    this.initUrl();
    this.bindSourceOfIncomeObj();
    this.bindAppCustPersonalFinData();
  }

  setSpouseMonthlyIncome(){
    if(this.parentForm.controls[this.identifier]["controls"].IsJoinIncome.value == false){
      this.parentForm.controls[this.identifier].patchValue({
        SpouseMonthlyIncomeAmt: 0
      });
    }
  }

  bindAppCustPersonalFinData(){
    if(this.appCustPersonalFinDataObj != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        MonthlyIncomeAmt: this.appCustPersonalFinDataObj.MonthlyIncomeAmt,
        MonthlyExpenseAmt: this.appCustPersonalFinDataObj.MonthlyExpenseAmt,
        MrSourceOfIncomeTypeCode: this.appCustPersonalFinDataObj.MrSourceOfIncomeTypeCode,
        MonthlyInstallmentAmt: this.appCustPersonalFinDataObj.MonthlyInstallmentAmt,
        IsJoinIncome: this.appCustPersonalFinDataObj.IsJoinIncome,
        SpouseMonthlyIncomeAmt: this.appCustPersonalFinDataObj.SpouseMonthlyIncomeAmt,
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
