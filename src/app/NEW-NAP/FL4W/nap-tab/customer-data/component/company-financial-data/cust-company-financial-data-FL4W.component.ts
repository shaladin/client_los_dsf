import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { formatDate } from '@angular/common';
import { AppCustCompanyFinDataObj } from 'app/shared/model/app-cust-company-fin-data-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

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
  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
    private fb: FormBuilder) {

     }

  ngOnInit() {
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.group({
      GrossMonthlyIncomeAmt: [0,  Validators.min(1)],
      GrossMonthlyExpenseAmt: [0, Validators.min(0)],
      ReturnOfInvestmentPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      ReturnOfEquityPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      ReturnOfAssetPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      ProfitMarginPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      CurrentRatioPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      DebtEquityRatioPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      InvTurnOverPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      ArTurnOverPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      GrowthPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
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
