import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MouCustCompanyFinDataObj } from 'app/shared/model/mou-cust-company-fin-data-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-cust-company-financial',
  templateUrl: './mou-cust-company-financial.component.html',
  styleUrls: ['./mou-cust-company-financial.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

export class MouCustCompanyFinancialComponent implements OnInit {
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() MouCustCompanyFinDataObj: MouCustCompanyFinDataObj = new MouCustCompanyFinDataObj();

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
    private fb: FormBuilder) {

     }

  ngOnInit() {
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.group({
      GrossMonthlyIncomeAmt: [0],
      GrossMonthlyExpenseAmt: [0],
      ReturnOfInvestmentPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      ReturnOfEquityPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      ReturnOfAssetPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      ProfitMarginPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      CurrentRatioPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      DebtEquityRatioPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      InvTurnOverPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      ArTurnOverPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
      GrowthPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
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

    this.bindAppCustCompanyFinData();
  }

  bindAppCustCompanyFinData(){
    if(this.MouCustCompanyFinDataObj.MouCustCompanyFinDataId != 0){
      this.parentForm.controls[this.identifier].patchValue({
        DateAsOf: this.MouCustCompanyFinDataObj.DateAsOf != undefined ? formatDate(this.MouCustCompanyFinDataObj.DateAsOf, 'yyyy-MM-dd', 'en-US') : ''
      });
    }
  }

}