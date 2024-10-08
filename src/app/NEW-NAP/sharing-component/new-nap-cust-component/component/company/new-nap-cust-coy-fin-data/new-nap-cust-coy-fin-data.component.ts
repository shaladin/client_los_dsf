import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppCustCompanyFinDataObj } from 'app/shared/model/app-cust-company-fin-data-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { NewCustAttrContentObj } from 'app/shared/model/new-cust-attr-content-obj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { NewNapCustBankAccComponent } from '../../new-nap-cust-bank-acc/new-nap-cust-bank-acc.component';
import { NewNapAttrContentComponent } from '../../new-nap-other-info/new-nap-attr-content/new-nap-attr-content.component';

@Component({
  selector: 'app-new-nap-cust-company-fin-data',
  templateUrl: './new-nap-cust-coy-fin-data.component.html',
  styles: []
})
export class NewNapCustCompanyFinDataComponent implements OnInit {
  @ViewChild(NewNapCustBankAccComponent) custBankAccComponent: NewNapCustBankAccComponent;
  @ViewChild(NewNapAttrContentComponent) attrContentComponent: NewNapAttrContentComponent;
  @Input() ParentForm: FormGroup;
  @Input() AppCustId: number;
  @Input() IsCompanyFinDataSubmitted: boolean;
  @Output() ResponseBankAcc: EventEmitter<any> = new EventEmitter();
  IsDetail: boolean = false;
  AttrGroup: string = CommonConstant.AttrGroupCustCompanyFinData;
  AppCustCompanyFinData: AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
  CustAttrRequest: Array<Object>;
  MrSourceOfIncomeTypeObj: Array<KeyValueObj> = new Array();
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) { 
    this.IsCompanyFinDataSubmitted = false;
  }

  ngOnInit() {
    if(this.AppCustId && this.AppCustId > 0){
      this.GetFinData();
    }
    this.ParentForm.get("ReturnOfInvestmentPrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("ReturnOfInvestmentPrcnt").updateValueAndValidity();
    this.ParentForm.get("ReturnOfAssetPrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("ReturnOfAssetPrcnt").updateValueAndValidity();
    this.ParentForm.get("CurrentRatioPrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("CurrentRatioPrcnt").updateValueAndValidity();
    this.ParentForm.get("InvTurnOverPrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("InvTurnOverPrcnt").updateValueAndValidity();
    this.ParentForm.get("GrowthPrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("GrowthPrcnt").updateValueAndValidity();
    this.ParentForm.get("ReturnOfEquityPrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("ReturnOfEquityPrcnt").updateValueAndValidity();
    this.ParentForm.get("ProfitMarginPrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("ProfitMarginPrcnt").updateValueAndValidity();
    this.ParentForm.get("DebtEquityRatioPrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("DebtEquityRatioPrcnt").updateValueAndValidity();
    this.ParentForm.get("ArTurnOverPrcnt").setValidators([Validators.min(0.00), Validators.max(100.00)]);
    this.ParentForm.get("ArTurnOverPrcnt").updateValueAndValidity();
  }

  GetFinData(){
    this.http.post<AppCustCompanyFinDataObj>(URLConstant.GetAppCustCompanyFinDataByAppCustId, { Id: this.AppCustId }).subscribe(
      async (response) => {
        if(response.AppCustCompanyFinDataId != 0){
          this.ParentForm.patchValue({
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
      this.ResponseBankAcc.emit(event.AppCustBankAccList);
    }
  }

  CopyCustomerFinDataCompany(custCompanyFinDataObj, custBankAccObjs: Array<AppCustBankAccObj>, custAttrContentObjs: Array<NewCustAttrContentObj>){
    this.ParentForm.patchValue({
      GrossMonthlyIncomeAmt: custCompanyFinDataObj.GrossMonthlyIncomeAmt,
      ReturnOfInvestmentPrcnt: custCompanyFinDataObj.ReturnOfInvestmentPrcnt,
      ReturnOfAssetPrcnt: custCompanyFinDataObj.ReturnOfAssetPrcnt,
      CurrentRatioPrcnt: custCompanyFinDataObj.CurrentRatioPrcnt,
      InvTurnOverPrcnt: custCompanyFinDataObj.InvTurnOverPrcnt,
      GrowthPrcnt: custCompanyFinDataObj.GrowthPrcnt,
      OthMonthlyInstAmt: custCompanyFinDataObj.OthMonthlyInstAmt,
      Revenue: custCompanyFinDataObj.Revenue,
      ProfitBeforeTax: custCompanyFinDataObj.ProfitBeforeTax,
      NetFixedAsset: custCompanyFinDataObj.NetFixedAsset,
      CurrLiablts: custCompanyFinDataObj.CurrLiablts,
      ShareholderEquity: custCompanyFinDataObj.ShareholderEquity,
      GrossMonthlyExpenseAmt: custCompanyFinDataObj.GrossMonthlyExpenseAmt,
      ReturnOfEquityPrcnt: custCompanyFinDataObj.ReturnOfEquityPrcnt,
      ProfitMarginPrcnt: custCompanyFinDataObj.ProfitMarginPrcnt,
      DebtEquityRatioPrcnt: custCompanyFinDataObj.DebtEquityRatioPrcnt,
      ArTurnOverPrcnt: custCompanyFinDataObj.ArTurnOverPrcnt,
      WorkingCapitalAmt: custCompanyFinDataObj.WorkingCapitalAmt,
      DateAsOf: custCompanyFinDataObj.DateAsOf ? formatDate(custCompanyFinDataObj.DateAsOf, 'yyyy-MM-dd', 'en-US') : "",
      OprCost: custCompanyFinDataObj.OprCost,
      CurrAsset: custCompanyFinDataObj.CurrAsset,
      TotalAsset: custCompanyFinDataObj.TotalAsset,
      LongTermLiablts: custCompanyFinDataObj.LongTemrLiablts,
      CurrRatio: custCompanyFinDataObj.CurrRatio
    });

    this.custBankAccComponent.AppCustBankAccList = custBankAccObjs;

    var finDataAttrContentObjs = custAttrContentObjs.filter(x => x.AttrGroup == this.AttrGroup);
    this.attrContentComponent.CopyCustAttrContent(finDataAttrContentObjs);
  }
}
