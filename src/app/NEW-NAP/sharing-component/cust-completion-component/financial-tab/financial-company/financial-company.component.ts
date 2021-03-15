import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustCompanyFinDataObj } from 'app/shared/model/AppCustCompanyFinDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-financial-company',
  templateUrl: './financial-company.component.html',
  styleUrls: ['./financial-company.component.scss']
})
export class FinancialCompanyComponent implements OnInit {
  @Input() AppCustId: number;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  IsDetail: boolean = false;
  AttrGroup: string = CommonConstant.AttrGroupCustCompanyFinData;
  AppCustCompanyFinData: AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
  CustAttrRequest: Array<Object>;
  MrSourceOfIncomeTypeObj: Array<KeyValueObj> = new Array();
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();

  FinancialForm = this.fb.group({
    AppCustCompanyFinDataId: [0],
    AppCustId: [0],
    GrossMonthlyIncomeAmt: ['', Validators.required],
    ReturnOfInvestmentPrcnt: [0],
    ReturnOfAssetPrcnt: [0],
    CurrentRatioPrcnt: [0],
    InvTurnOverPrcnt: [0],
    GrowthPrcnt: [0],
    OthMonthlyInstAmt: [0],
    Revenue: [0],
    ProfitBeforeTax: [0],
    NetFixedAsset: [0],
    CurrLiablts: [0],
    ShareholderEquity: [0],
    GrossMonthlyExpenseAmt: [0],
    ReturnOfEquityPrcnt: [0],
    ProfitMarginPrcnt: [0],
    DebtEquityRatioPrcnt: [0],
    ArTurnOverPrcnt: [0],
    WorkingCapitalAmt: [0],
    DateAsOf: [''],
    OprCost: [0],
    CurrAsset: [0],
    TotalAsset: [0],
    LongTermLiablts: [0],
    CurrRatio: [0],
    RowVersion: [''],
    AttrList: this.fb.array ([])
  })

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) { }

  ngOnInit() {
    this.GetFinData();
  }

  GetFinData(){
    this.http.post<AppCustCompanyFinDataObj>(URLConstant.GetAppCustCompanyFinDataByAppCustId, { AppCustId: this.AppCustId }).subscribe(
      async (response) => {
        if(response.AppCustCompanyFinDataId != 0){
          this.FinancialForm.patchValue({
            GrossMonthlyIncomeAmt: response.GrossMonthlyIncomeAmt,
            ReturnOfInvestmentPrcnt: response.ReturnOfInvestmentPrcnt,
            ReturnOfAssetPrcnt: response.ReturnOfAssetPrcnt,
            CurrentRatioPrcnt: response.CurrentRatioPrcnt,
            InvTurnOverPrcnt: response.InvTurnOverPrcnt,
            GrowthPrcnt: response.GrowthPrcnt,
            OthMonthlyInstAmt: response.OthMonthlyInstAmt,
            Revenue: response.Revenue,
            ProfitBeforeTax: response.ProfitBeforeTax,
            NetFixedAsset: response.NetFixedAsset,
            CurrLiablts: response.CurrLiablts,
            ShareholderEquity: response.ShareholderEquity,
            GrossMonthlyExpenseAmt: response.GrossMonthlyExpenseAmt,
            ReturnOfEquityPrcnt: response.ReturnOfEquityPrcnt,
            ProfitMarginPrcnt: response.ProfitMarginPrcnt,
            DebtEquityRatioPrcnt: response.DebtEquityRatioPrcnt,
            ArTurnOverPrcnt: response.ArTurnOverPrcnt,
            WorkingCapitalAmt: response.WorkingCapitalAmt,
            DateAsOf: response.DateAsOf != null? formatDate(response.DateAsOf, 'yyyy-MM-dd', 'en-US') : "",
            OprCost: response.OprCost,
            CurrAsset: response.CurrAsset,
            TotalAsset: response.TotalAsset,
            LongTermLiablts: response.LongTermLiablts,
            CurrRatio: response.CurrRatio,
            RowVersion: response.RowVersion
          });
        }
      }
    );
  }

  GetEvent(event) {
    if (event != undefined && event.Key == "IsDetail") {
      this.IsDetail = event.Value;
    }
  }

  SetAttrContent(){
    var formValue = this.FinancialForm['controls']['AttrList'].value;
    this.CustAttrRequest = new Array<Object>();
     
    if(Object.keys(formValue).length > 0 && formValue.constructor === Object){
      for (const key in formValue) {
        if(formValue[key]["AttrValue"]!=null ) { 
        var custAttr = {
          CustAttrContentId: formValue[key]["CustAttrContentId"],
          AppCustId: this.AppCustId,
          RefAttrCode: formValue[key]["AttrCode"],
          AttrValue: formValue[key]["AttrValue"],
          AttrGroup: this.AttrGroup
        };
        this.CustAttrRequest.push(custAttr);}

      }  
    }
  }

  SaveForm() {
    this.SetAttrContent();
    this.AppCustCompanyFinData = this.FinancialForm.value;
    this.AppCustCompanyFinData.GrossProfitAmt = this.AppCustCompanyFinData.GrossMonthlyIncomeAmt - this.AppCustCompanyFinData.GrossMonthlyExpenseAmt;
    this.AppCustCompanyFinData.AppCustId = this.AppCustId;

    let request = {
      ListAppCustAttrObj: this.CustAttrRequest,
      AppCustCompanyFinDataObj: this.AppCustCompanyFinData
    }
    
    this.http.post(URLConstant.AddEditAppCustCompanyFinData, request).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.OutputTab.emit({IsComplete: true});
      });
  }
}
