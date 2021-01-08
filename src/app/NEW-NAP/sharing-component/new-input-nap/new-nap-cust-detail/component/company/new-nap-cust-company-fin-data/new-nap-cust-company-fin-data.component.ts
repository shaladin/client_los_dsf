import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustCompanyFinDataObj } from 'app/shared/model/AppCustCompanyFinDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-new-nap-cust-company-fin-data',
  templateUrl: './new-nap-cust-company-fin-data.component.html',
  styles: []
})
export class NewNapCustCompanyFinDataComponent implements OnInit {
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
  }

  GetFinData(){
    this.http.post<AppCustCompanyFinDataObj>(URLConstant.GetAppCustCompanyFinDataByAppCustId, { AppCustId: this.AppCustId }).subscribe(
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
}
