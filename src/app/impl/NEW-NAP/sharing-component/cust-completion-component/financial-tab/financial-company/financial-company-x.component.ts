import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustCompanyFinDataObj } from 'app/shared/model/AppCustCompanyFinDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';
@Component({
  selector: 'app-financial-company-x',
  templateUrl: './financial-company-x.component.html'
})
export class FinancialCompanyXComponent implements OnInit {
  @Input() AppCustId: number;
  @Input() AppId: number;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  
  IsDetail: boolean = false;
  AttrGroups: Array<string> = [
    CommonConstant.AttrGroupCustCompanyFinData,
    CommonConstant.AttrGroupCustCompanyFinDataIncome,
    CommonConstant.AttrGroupCustCompanyFinDataExpense,
    CommonConstant.AttrGroupCustCompanyFinDataOther
  ];
  AppCustCompanyFinData: AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
  CustAttrRequest: Array<Object> = new Array<Object>();
  MrSourceOfIncomeTypeObj: Array<KeyValueObj> = new Array();
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();

  @ViewChild('ModalCoyFinData') ModalCoyFinData;
  ListAppCustCoyFinData : Array<AppCustCompanyFinDataObj> = [];
  IsAddFinData: boolean = true;
  currentCustFinDataIndex: number;
  currentModal: any;
  LobCode: string;
  AppObj: AppObj = new AppObj();
  IsDisburseToCust: boolean = false;

  AppCustAttrListForm = this.fb.group({
  });

  FinancialForm = this.fb.group({
    AppCustCompanyFinDataId: [0],
    AppCustId: [0],
    GrossMonthlyIncomeAmt: ['', Validators.required],
    ReturnOfInvestmentPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    ReturnOfAssetPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    CurrentRatioPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    InvTurnOverPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    GrowthPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    OthMonthlyInstAmt: [0],
    Revenue: [0],
    ProfitBeforeTax: [0],
    NetFixedAsset: [0],
    CurrLiablts: [0],
    ShareholderEquity: [0],
    GrossMonthlyExpenseAmt: [0],
    ReturnOfEquityPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    ProfitMarginPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    DebtEquityRatioPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    ArTurnOverPrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    WorkingCapitalAmt: [0],
    DateAsOf: [''],
    OprCost: [0],
    CurrAsset: [0],
    TotalAsset: [0],
    LongTermLiablts: [0],
    CurrRatio: [0],
    RowVersion: ['']
  })

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private modalService: NgbModal) { }

  ngOnInit() {
    // this.GetFinData();
    this.GetListFinData();
  }

  isDataExist: boolean = false;
  // GetFinData(){
  //   this.http.post<AppCustCompanyFinDataObj>(URLConstant.GetAppCustCompanyFinDataByAppCustId, { Id: this.AppCustId }).subscribe(
  //     async (response) => {
  //       if(response.AppCustCompanyFinDataId != 0){
  //         this.isDataExist = true;
  //         this.FinancialForm.patchValue({
  //           GrossMonthlyIncomeAmt: response.GrossMonthlyIncomeAmt,
  //           ReturnOfInvestmentPrcnt: response.ReturnOfInvestmentPrcnt,
  //           ReturnOfAssetPrcnt: response.ReturnOfAssetPrcnt,
  //           CurrentRatioPrcnt: response.CurrentRatioPrcnt,
  //           InvTurnOverPrcnt: response.InvTurnOverPrcnt,
  //           GrowthPrcnt: response.GrowthPrcnt,
  //           OthMonthlyInstAmt: response.OthMonthlyInstAmt,
  //           Revenue: response.Revenue,
  //           ProfitBeforeTax: response.ProfitBeforeTax,
  //           NetFixedAsset: response.NetFixedAsset,
  //           CurrLiablts: response.CurrLiablts,
  //           ShareholderEquity: response.ShareholderEquity,
  //           GrossMonthlyExpenseAmt: response.GrossMonthlyExpenseAmt,
  //           ReturnOfEquityPrcnt: response.ReturnOfEquityPrcnt,
  //           ProfitMarginPrcnt: response.ProfitMarginPrcnt,
  //           DebtEquityRatioPrcnt: response.DebtEquityRatioPrcnt,
  //           ArTurnOverPrcnt: response.ArTurnOverPrcnt,
  //           WorkingCapitalAmt: response.WorkingCapitalAmt,
  //           DateAsOf: response.DateAsOf != null? formatDate(response.DateAsOf, 'yyyy-MM-dd', 'en-US') : "",
  //           OprCost: response.OprCost,
  //           CurrAsset: response.CurrAsset,
  //           TotalAsset: response.TotalAsset,
  //           LongTermLiablts: response.LongTermLiablts,
  //           CurrRatio: response.CurrRatio,
  //           RowVersion: response.RowVersion
  //         });
  //       }
  //     }
  //   );
  // }

  GetListFinData()
  {
    this.http.post<AppCustCompanyFinDataObj>(URLConstant.GetListAppCustCompanyFinDataByAppCustId, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        this.ListAppCustCoyFinData = response['ListAppCustCompanyFinData'];
      }
    );
  }

  GetFinData(currentCustFinDataIndex:number)
  {
    this.IsAddFinData = false;
    this.currentCustFinDataIndex = currentCustFinDataIndex;
    let custFinData:AppCustCompanyFinDataObj = this.ListAppCustCoyFinData[this.currentCustFinDataIndex];
    if(!custFinData) 
    {
      custFinData = new AppCustCompanyFinDataObj();
      this.IsAddFinData = true;
    }
    this.FinancialForm.patchValue({
      AppCustCompanyFinDataId: custFinData.AppCustCompanyFinDataId,
      AppCustId: this.AppCustId,
      GrossMonthlyIncomeAmt: custFinData.GrossMonthlyIncomeAmt,
      ReturnOfInvestmentPrcnt: custFinData.ReturnOfInvestmentPrcnt,
      ReturnOfAssetPrcnt: custFinData.ReturnOfAssetPrcnt,
      CurrentRatioPrcnt: custFinData.CurrentRatioPrcnt,
      InvTurnOverPrcnt: custFinData.InvTurnOverPrcnt,
      GrowthPrcnt: custFinData.GrowthPrcnt,
      OthMonthlyInstAmt: custFinData.OthMonthlyInstAmt,
      Revenue: custFinData.Revenue,
      ProfitBeforeTax: custFinData.ProfitBeforeTax,
      NetFixedAsset: custFinData.NetFixedAsset,
      CurrLiablts: custFinData.CurrLiablts,
      ShareholderEquity: custFinData.ShareholderEquity,
      GrossMonthlyExpenseAmt: custFinData.GrossMonthlyExpenseAmt,
      ReturnOfEquityPrcnt: custFinData.ReturnOfEquityPrcnt,
      ProfitMarginPrcnt: custFinData.ProfitMarginPrcnt,
      DebtEquityRatioPrcnt: custFinData.DebtEquityRatioPrcnt,
      ArTurnOverPrcnt: custFinData.ArTurnOverPrcnt,
      WorkingCapitalAmt: custFinData.WorkingCapitalAmt,
      DateAsOf: custFinData.DateAsOf != null? formatDate(custFinData.DateAsOf, 'yyyy-MM-dd', 'en-US') : "",
      OprCost: custFinData.OprCost,
      CurrAsset: custFinData.CurrAsset,
      TotalAsset: custFinData.TotalAsset,
      LongTermLiablts: custFinData.LongTermLiablts,
      CurrRatio: custFinData.CurrRatio,
      RowVersion: custFinData.RowVersion
    });

    if(this.IsAddFinData) this.FinancialForm.controls['DateAsOf'].setValidators([Validators.required]);
    else this.FinancialForm.controls['DateAsOf'].clearValidators();
    this.FinancialForm.controls['DateAsOf'].updateValueAndValidity();

    this.currentModal = this.modalService.open(this.ModalCoyFinData, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false});
  }

  GetEvent(event) {
    if (event != undefined && event.Key == "IsDetail") {
      this.IsDetail = event.Value;
    }
  }

  SetAttrContent(){
    var formValue = this.AppCustAttrListForm['controls']['AttrList'].value;
    this.CustAttrRequest = new Array<Object>();
     
    if(Object.keys(formValue).length > 0 && formValue.constructor === Object){
      for (const key in formValue) {
        if(formValue[key]["AttrValue"]!=null ) { 
        var custAttr = {
          CustAttrContentId: formValue[key]["CustAttrContentId"],
          AppCustId: this.AppCustId,
          RefAttrCode: formValue[key]["AttrCode"],
          AttrValue: formValue[key]["AttrValue"],
          AttrGroup: formValue[key]["AttrGroup"]
        };
        this.CustAttrRequest.push(custAttr);}

      }  
    }
  }

  async GetAppCustBankAcc() {
    await this.http.post<Array<AppCustBankAccObj>>(
        URLConstant.GetAppCustBankAccAndStatementForView, { Id: this.AppCustId }
        ).toPromise().then(
      (response) => {
        console.log(response);
        this.AppCustBankAccList = response["AppCustBankAccList"]
      });
    await this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response) => {
          this.LobCode = response.LobCode
      });
  }

  async GetIsDisburseToCust() {
    await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      async (response: AppObj) => {
        this.AppObj = response;
        var objIsDisburse: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
        objIsDisburse.ProdOfferingCode = this.AppObj.ProdOfferingCode;
        objIsDisburse.RefProdCompntCode = CommonConstant.RefProdCompntCodeDisburseToCust;
        objIsDisburse.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;

        await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, objIsDisburse).toPromise().then(
          (response) => {
            if (response && response["StatusCode"] == "200" && response["ProdOfferingDId"] > 0) {
              this.IsDisburseToCust = response["CompntValue"] == 'Y' ? true : false;
            }
          }
        );
      }
    );
  }

  async SaveAppCustPersonalFinData()
  {
    if (!this.FinancialForm.valid) return;

    await this.http.post(URLConstant.AddEditAppCustCompanyFinData, {AppCustCompanyFinDataObj: this.FinancialForm.value}).toPromise().then(
      (response) => {
        if(this.currentModal) this.currentModal.close();
      }
    );
    await this.GetListFinData();
  }

  async SaveForm() {
    if (this.AppCustAttrListForm.get('AttrList') != undefined) {
      this.SetAttrContent();
    }
    
    await this.GetAppCustBankAcc();

    if (!this.AppCustBankAccList.length && this.LobCode == "SLB") {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_INPUT_BANK_ACCOUNT);
      return;
    }

    if (!this.AppCustBankAccList.length && (this.LobCode == "MPF" || this.LobCode == "FD")) {
      await this.GetIsDisburseToCust();
      if (this.IsDisburseToCust === true) {
        this.toastr.warningMessage(ExceptionConstant.PLEASE_INPUT_BANK_ACCOUNT);
        return;
      }
    }

    // this.AppCustCompanyFinData = this.AppCustAttrListForm.value;
    // this.AppCustCompanyFinData.GrossProfitAmt = this.AppCustCompanyFinData.GrossMonthlyIncomeAmt - this.AppCustCompanyFinData.GrossMonthlyExpenseAmt;
    // this.AppCustCompanyFinData.AppCustId = this.AppCustId;

    let request = {
      ListAppCustFinDataAttrObj: this.CustAttrRequest,
      AttrGroups: this.AttrGroups
    }
    
    if (!this.isDataExist) {
      this.http.post(URLConstant.AddAppCustCompanyFinData, request).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit({IsComplete: true});
        }
      );
    }
    else {
      this.http.post(URLConstant.EditAppCustCompanyFinData, request).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit({IsComplete: true});
        }
      );
    }
  }
}