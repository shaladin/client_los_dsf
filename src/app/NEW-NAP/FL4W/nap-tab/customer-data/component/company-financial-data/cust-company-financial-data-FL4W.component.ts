import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { formatDate } from '@angular/common';
import { AppCustCompanyFinDataObj } from 'app/shared/model/AppCustCompanyFinDataObj.Model';

@Component({
  selector: 'app-cust-company-financial-data-FL4W',
  templateUrl: './cust-company-financial-data-Fl4W.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustCompanyFinancialDataFL4WComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() appCustCompanyFinDataObj: AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
  constructor(
    private fb: FormBuilder) {

     }

  ngOnInit() {
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.group({
      GrossMonthlyIncomeAmt: [0,  Validators.min(1)],
      GrossMonthlyExpenseAmt: [0, Validators.min(0)],
      ReturnOfInvestmentPrcnt: [0, Validators.min(0)],
      ReturnOfEquityPrcnt: [0, Validators.min(0)],
      ReturnOfAssetPrcnt: [0, Validators.min(0)],
      ProfitMarginPrcnt: [0, Validators.min(0)],
      CurrentRatioPrcnt: [0, Validators.min(0)],
      DebtEquityRatioPrcnt: [0, Validators.min(0)],
      InvTurnOverPrcnt: [0, Validators.min(0)],
      ArTurnOverPrcnt: [0, Validators.min(0)],
      GrowthPrcnt: [0, Validators.min(0)],
      WorkingCapitalAmt: [0, Validators.min(0)],
      OthMonthlyInstAmt: [0, Validators.min(0)],
      Revenue: [0, Validators.min(0)],
      OprCost: [0, Validators.min(0)],
      ProfitBeforeTax: [0, Validators.min(0)],
      CurrAsset: [0, Validators.min(0)],
      NetFixedAsset: [0, Validators.min(0)],
      TotalAsset: [0, Validators.min(0)],
      CurrLiablts: [0, Validators.min(0)],
      LongTemrLiablts: [0, Validators.min(0)],
      ShareholderEquity: [0, Validators.min(0)],
      CurrRatio: [0, Validators.min(0)],
      DateAsOf: ['']
    }));

    this.bindAppCustCompanyFinData();
  }

  bindAppCustCompanyFinData(){
    if(this.appCustCompanyFinDataObj != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        DateAsOf: this.appCustCompanyFinDataObj.DateAsOf != undefined ? formatDate(this.appCustCompanyFinDataObj.DateAsOf, 'yyyy-MM-dd', 'en-US') : ''
      });
    }
  }
}
