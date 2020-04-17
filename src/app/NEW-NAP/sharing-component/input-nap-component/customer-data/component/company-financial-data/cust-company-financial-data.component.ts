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
import { AppCustCompanyFinDataObj } from 'app/shared/model/AppCustCompanyFinDataObj.Model';

@Component({
  selector: 'app-cust-company-financial-data',
  templateUrl: './cust-company-financial-data.component.html',
  styleUrls: ['./cust-company-financial-data.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustCompanyFinancialDataComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() appCustCompanyFinDataObj: AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();



  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {

     }

  ngOnInit() {
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.group({
      GrossMonthlyIncomeAmt: [0],
      GrossMonthlyExpenseAmt: [0],
      ReturnOfInvestmentPrcnt: [0, Validators.min(0)],
      ReturnOfEquityPrcnt: [0, Validators.min(0)],
      ReturnOfAssetPrcnt: [0, Validators.min(0)],
      ProfitMarginPrcnt: [0, Validators.min(0)],
      CurrentRatioPrcnt: [0, Validators.min(0)],
      DebtEquityRatioPrcnt: [0, Validators.min(0)],
      InvTurnOverPrcnt: [0, Validators.min(0)],
      ArTurnOverPrcnt: [0, Validators.min(0)],
      GrowthPrcnt: [0, Validators.min(0)],
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
    if(this.appCustCompanyFinDataObj != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        DateAsOf: this.appCustCompanyFinDataObj.DateAsOf != undefined ? formatDate(this.appCustCompanyFinDataObj.DateAsOf, 'yyyy-MM-dd', 'en-US') : ''
      });
    }
  }

}
