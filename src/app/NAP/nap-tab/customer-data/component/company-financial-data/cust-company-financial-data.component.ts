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
      GrossMonthlyIncomeAmt: ['0', Validators.required],
      GrossMonthlyExpenseAmt: ['0', Validators.required],
      ReturnOfInvestmentPrcnt: ['0', Validators.required],
      ReturnOfEquityPrcnt: ['0', Validators.required],
      ProfitMarginPrcnt: ['0', Validators.required],
      ReturnOfAssetPrcnt: ['0', Validators.required],
      DebtEquityRatioPrcnt: ['0', Validators.required],
      CurrentRatioPrcnt: ['0', Validators.required],
      InvTurnOverPrcnt: ['0', Validators.required],
      GrowthPrcnt: ['0', Validators.required],
      ArTurnOverPrcnt: ['0', Validators.required],
      WorkingCapitalAmt: ['0', Validators.required],
      OthMonthlyInstAmt: ['0', Validators.required],
      DateAsOf: [''],
      Revenue: ['0', Validators.required],
      OprCost: ['0', Validators.required],
      CurrAsset: ['0', Validators.required],
      NetFixedAsset: ['0', Validators.required],
      TotalAsset: ['0', Validators.required],
      CurrLiablts: ['0', Validators.required],
      LongTermLiablts: ['0', Validators.required],
      ShareholderEquity: ['0', Validators.required],
      CurrRatio: ['0', Validators.required]
    }));

    this.bindAppCustCompanyFinData();
  }

  bindAppCustCompanyFinData(){
    if(this.appCustCompanyFinDataObj != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        GrossMonthlyIncomeAmt: this.appCustCompanyFinDataObj.GrossMonthlyIncomeAmt,
        GrossMonthlyExpenseAmt: this.appCustCompanyFinDataObj.GrossMonthlyExpenseAmt,
        ReturnOfInvestmentPrcnt: this.appCustCompanyFinDataObj.ReturnOfInvestmentPrcnt,
        ProfitMarginPrcnt: this.appCustCompanyFinDataObj.ProfitMarginPrcnt,
        ReturnOfAssetPrcnt: this.appCustCompanyFinDataObj.ReturnOfAssetPrcnt,
        DebtEquityRatioPrcnt: this.appCustCompanyFinDataObj.DebtEquityRatioPrcnt,
        CurrentRatioPrcnt: this.appCustCompanyFinDataObj.CurrentRatioPrcnt,
        InvTurnOverPrcnt: this.appCustCompanyFinDataObj.InvTurnOverPrcnt,
        GrowthPrcnt: this.appCustCompanyFinDataObj.GrowthPrcnt,
        ArTurnOverPrcnt: this.appCustCompanyFinDataObj.ArTurnOverPrcnt,
        WorkingCapitalAmt: this.appCustCompanyFinDataObj.WorkingCapitalAmt,
        OthMonthlyInstAmt: this.appCustCompanyFinDataObj.OthMonthlyInstAmt,
        DateAsOf: this.appCustCompanyFinDataObj.DateAsOf,
        Revenue: this.appCustCompanyFinDataObj.Revenue,
        OprCost: this.appCustCompanyFinDataObj.OprCost,
        CurrAsset: this.appCustCompanyFinDataObj.CurrAsset,
        NetFixedAsset: this.appCustCompanyFinDataObj.NetFixedAsset,
        TotalAsset: this.appCustCompanyFinDataObj.TotalAsset,
        CurrLiablts: this.appCustCompanyFinDataObj.CurrLiablts,
        LongTermLiablts: this.appCustCompanyFinDataObj.LongTermLiablts,
        ShareholderEquity: this.appCustCompanyFinDataObj.ShareholderEquity,
        CurrRatio: this.appCustCompanyFinDataObj.CurrRatio
      });
    }
  }

}
