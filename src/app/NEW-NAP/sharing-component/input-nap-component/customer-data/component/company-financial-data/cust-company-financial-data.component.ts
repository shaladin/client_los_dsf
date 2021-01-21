import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { formatDate } from '@angular/common';
import { AppCustCompanyFinDataObj } from 'app/shared/model/AppCustCompanyFinDataObj.Model';

@Component({
  selector: 'app-cust-company-financial-data',
  templateUrl: './cust-company-financial-data.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustCompanyFinancialDataComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() appCustCompanyFinDataObj: AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
  isReady : boolean = false;


  constructor(
    private fb: FormBuilder) {

     }

  ngOnInit() {
    this.parentForm.removeControl(this.identifier);
this.addControl();
    this.bindAppCustCompanyFinData();
  }

  bindAppCustCompanyFinData(){
    if(this.appCustCompanyFinDataObj.AppCustCompanyFinDataId != 0){
      this.parentForm.controls[this.identifier].patchValue({
        DateAsOf: this.appCustCompanyFinDataObj.DateAsOf != undefined ? formatDate(this.appCustCompanyFinDataObj.DateAsOf, 'yyyy-MM-dd', 'en-US') : ''
      });
    }
  }
  addControl(){
    this.parentForm.addControl(this.identifier, this.fb.group({
      GrossMonthlyIncomeAmt: [0],
      GrossMonthlyExpenseAmt: [0],
      ReturnOfInvestmentPrcnt: [0],
      ReturnOfEquityPrcnt: [0],
      ReturnOfAssetPrcnt: [0],
      ProfitMarginPrcnt: [0],
      CurrentRatioPrcnt: [0],
      DebtEquityRatioPrcnt: [0],
      InvTurnOverPrcnt: [0],
      ArTurnOverPrcnt: [0],
      GrowthPrcnt: [0],
      WorkingCapitalAmt: [0],
      OthMonthlyInstAmt: [0],
      Revenue: [0],
      OprCost: [0],
      ProfitBeforeTax: [0],
      CurrAsset: [0],
      NetFixedAsset: [0],
      TotalAsset: [0],
      CurrLiablts: [0],
      LongTemrLiablts: [0],
      ShareholderEquity: [0],
      CurrRatio: [0],
      DateAsOf: ['']
    }));
    this.isReady = true;
  }
}
