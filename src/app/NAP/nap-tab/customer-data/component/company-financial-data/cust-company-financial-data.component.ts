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
      GrossMonthlyIncomeAmt: [0, Validators.pattern("^[0-9]+$")],
      GrossMonthlyExpenseAmt: [0, Validators.pattern("^[0-9]+$")],
      ReturnOfInvestmentPrcnt: [0, Validators.pattern("^[0-9]+$")],
      ReturnOfEquityPrcnt: [0, Validators.pattern("^[0-9]+$")],
      ProfitMarginPrcnt: [0, Validators.pattern("^[0-9]+$")],
      ReturnOfAssetPrcnt: [0, Validators.pattern("^[0-9]+$")],
      DebtEquityRatioPrcnt: [0, Validators.pattern("^[0-9]+$")],
      CurrentRatioPrcnt: [0, Validators.pattern("^[0-9]+$")],
      InvTurnOverPrcnt: [0, Validators.pattern("^[0-9]+$")],
      GrowthPrcnt: [0, Validators.pattern("^[0-9]+$")],
      ArTurnOverPrcnt: [0, Validators.pattern("^[0-9]+$")],
      WorkingCapitalAmt: [0, Validators.pattern("^[0-9]+$")],
      OthMonthlyInstAmt: [0, Validators.pattern("^[0-9]+$")],
      DateAsOf: [''],
      Revenue: [0, Validators.pattern("^[0-9]+$")],
      OprCost: [0, Validators.pattern("^[0-9]+$")],
      ProfitBeforeTax: [0, Validators.pattern("^[0-9]+$")],
      CurrAsset: [0, Validators.pattern("^[0-9]+$")],
      NetFixedAsset: [0, Validators.pattern("^[0-9]+$")],
      TotalAsset: [0, Validators.pattern("^[0-9]+$")],
      CurrLiablts: [0, Validators.pattern("^[0-9]+$")],
      LongTemrLiablts: [0, Validators.pattern("^[0-9]+$")],
      ShareholderEquity: [0, Validators.pattern("^[0-9]+$")],
      CurrRatio: [0, Validators.pattern("^[0-9]+$")]
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
        ReturnOfEquityPrcnt: this.appCustCompanyFinDataObj.ReturnOfEquityPrcnt,
        DebtEquityRatioPrcnt: this.appCustCompanyFinDataObj.DebtEquityRatioPrcnt,
        CurrentRatioPrcnt: this.appCustCompanyFinDataObj.CurrentRatioPrcnt,
        InvTurnOverPrcnt: this.appCustCompanyFinDataObj.InvTurnOverPrcnt,
        GrowthPrcnt: this.appCustCompanyFinDataObj.GrowthPrcnt,
        ArTurnOverPrcnt: this.appCustCompanyFinDataObj.ArTurnOverPrcnt,
        WorkingCapitalAmt: this.appCustCompanyFinDataObj.WorkingCapitalAmt,
        OthMonthlyInstAmt: this.appCustCompanyFinDataObj.OthMonthlyInstAmt,
        DateAsOf: formatDate(this.appCustCompanyFinDataObj.DateAsOf, 'yyyy-MM-dd', 'en-US'),
        Revenue: this.appCustCompanyFinDataObj.Revenue,
        OprCost: this.appCustCompanyFinDataObj.OprCost,
        ProfitBeforeTax: this.appCustCompanyFinDataObj.ProfitBeforeTax,
        CurrAsset: this.appCustCompanyFinDataObj.CurrAsset,
        NetFixedAsset: this.appCustCompanyFinDataObj.NetFixedAsset,
        TotalAsset: this.appCustCompanyFinDataObj.TotalAsset,
        CurrLiablts: this.appCustCompanyFinDataObj.CurrLiablts,
        LongTemrLiablts: this.appCustCompanyFinDataObj.LongTemrLiablts,
        ShareholderEquity: this.appCustCompanyFinDataObj.ShareholderEquity,
        CurrRatio: this.appCustCompanyFinDataObj.CurrRatio
      });
    }
  }

}
