import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppCustCompanyFinDataObj } from 'app/shared/model/app-cust-company-fin-data-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { LtkmCustCompanyFinDataObj } from 'app/shared/model/ltkm/ltkm-cust-company-fin-data-obj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-ltkm-financial-company-x',
  templateUrl: './financial-company-x.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class LtkmFinancialCompanyXComponent implements OnInit {
  @Input() AppCustId: number;
  @Input() ltkmCustId: number;
  @Output() UpdateSource: EventEmitter<object> = new EventEmitter();
  @ViewChild('ModalCoyFinData') ModalCoyFinData;
  IsDetail: boolean = false;
  AttrGroup: string = CommonConstant.AttrGroupCustCompanyFinData;
  AppCustCompanyFinData: AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
  CustAttrRequest: Array<Object>;
  MrSourceOfIncomeTypeObj: Array<KeyValueObj> = new Array();
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();
  NettIncomeAmtCoy: number;
  isCalculated: boolean = false;
  IsShowDetailCustFin: boolean = false;

  //PERUBAHAN START
  // VARIABEL VIEW
  CustId: number = 0;
  CustNoObj: GenericObj = new GenericObj();
  ListCustCoyFinData: Array<LtkmCustCompanyFinDataObj>;
  TitleCustFinSuffix: string = '';
  CustCoyFinData: object;
  //PERUBAHAN START

  @Input() ListLtkmCustCoyFinData: Array<LtkmCustCompanyFinDataObj> = [];
  IsAddFinData: boolean = true;
  currentCustFinDataIndex: number;
  currentModal: any;

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

  AppCustAttrListForm = this.fb.group({
  });

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() isLockMode: boolean = false;

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private modalService: NgbModal) { }

  async ngOnInit() {
    this.parentForm.addControl(this.identifier, this.fb.group({
      LtkmCustCompanyFinDataId: [0],
      LtkmCustId: [0],
      GrossMonthlyIncomeAmt: [''],
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
    }));    
  }

  GetFinData(currentCustFinDataIndex: number) {
    this.IsAddFinData = false;
    this.currentCustFinDataIndex = currentCustFinDataIndex;
    let custFinData: LtkmCustCompanyFinDataObj = this.ListLtkmCustCoyFinData[this.currentCustFinDataIndex];
    if (!custFinData) {
      custFinData = new LtkmCustCompanyFinDataObj();
      this.IsAddFinData = true;
    }
    this.parentForm['controls'][this.identifier].patchValue({
      LtkmCustCompanyFinDataId: custFinData.LtkmCustCompanyFinDataId,
      // LtkmCustId: this.LtkmCustId,
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
      DateAsOf: custFinData.DateAsOf != null ? formatDate(custFinData.DateAsOf, 'yyyy-MM-dd', 'en-US') : "",
      OprCost: custFinData.OprCost,
      CurrAsset: custFinData.CurrAsset,
      TotalAsset: custFinData.TotalAsset,
      LongTermLiablts: custFinData.LongTermLiablts,
      CurrRatio: custFinData.CurrRatio
      // ,
      // RowVersion: custFinData.RowVersion
    });

    if(this.isLockMode)
      this.calculateCompanyFinData();

    this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].setValidators([Validators.required]);
    this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].updateValueAndValidity();

    this.currentModal = this.modalService.open(this.ModalCoyFinData, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  GetEvent(event) {
    if (event != undefined && event.Key == "IsDetail") {
      this.IsDetail = event.Value;
    }
  }

  // SetAttrContent(){
  //   var formValue = this.AppCustAttrListForm['controls']['AttrList'].value;
  //   this.CustAttrRequest = new Array<Object>();

  //   if(Object.keys(formValue).length > 0 && formValue.constructor === Object){
  //     for (const key in formValue) {
  //       if(formValue[key]["AttrValue"]!=null ) { 
  //       var custAttr = {
  //         CustAttrContentId: formValue[key]["CustAttrContentId"],
  //         AppCustId: this.AppCustId,
  //         RefAttrCode: formValue[key]["AttrCode"],
  //         AttrValue: formValue[key]["AttrValue"],
  //         AttrGroup: this.AttrGroup
  //       };
  //       this.CustAttrRequest.push(custAttr);}

  //     }  
  //   }
  // }

  calculateCompanyFinData(){
    this.NettIncomeAmtCoy = this.parentForm['controls'][this.identifier]['controls']['GrossMonthlyIncomeAmt'].value - 
                            this.parentForm['controls'][this.identifier]['controls']['OthMonthlyInstAmt'].value -
                            // this.parentForm['controls'][this.identifier]['controls']['OtherMonthlyInstallmentDsf'].value
                            this.parentForm['controls'][this.identifier]['controls']['OprCost'].value;
    this.isCalculated = true;
  }

  CloseModal() {
    this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].clearValidators();
    this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].updateValueAndValidity();
    this.modalService.dismissAll();
  }

  SaveModal() {
    this.SaveForm();
    // this.SaveAppCustPersonalFinData();
    this.modalService.dismissAll();
  }

  SaveForm() {
    if (!this.ListLtkmCustCoyFinData.length) {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_INPUT_FIN_DATA);
      return;
    }

    if (!this.parentForm['controls'][this.identifier].valid) return;

    var newObj = new LtkmCustCompanyFinDataObj;
    newObj.LtkmCustCompanyFinDataId = this.parentForm['controls'][this.identifier]['controls']['LtkmCustCompanyFinDataId'].value;
    newObj.LtkmCustId = this.parentForm['controls'][this.identifier]['controls']['LtkmCustId'].value;
    newObj.GrossMonthlyIncomeAmt = this.parentForm['controls'][this.identifier]['controls']['GrossMonthlyIncomeAmt'].value;
    newObj.ReturnOfInvestmentPrcnt = this.parentForm['controls'][this.identifier]['controls']['ReturnOfInvestmentPrcnt'].value;
    newObj.ReturnOfAssetPrcnt = this.parentForm['controls'][this.identifier]['controls']['ReturnOfAssetPrcnt'].value;
    newObj.CurrentRatioPrcnt = this.parentForm['controls'][this.identifier]['controls']['CurrentRatioPrcnt'].value;
    newObj.InvTurnOverPrcnt = this.parentForm['controls'][this.identifier]['controls']['InvTurnOverPrcnt'].value;
    newObj.GrowthPrcnt = this.parentForm['controls'][this.identifier]['controls']['GrowthPrcnt'].value;
    newObj.OthMonthlyInstAmt = this.parentForm['controls'][this.identifier]['controls']['OthMonthlyInstAmt'].value;
    newObj.Revenue = this.parentForm['controls'][this.identifier]['controls']['Revenue'].value;
    newObj.ProfitBeforeTax = this.parentForm['controls'][this.identifier]['controls']['ProfitBeforeTax'].value;
    newObj.NetFixedAsset = this.parentForm['controls'][this.identifier]['controls']['NetFixedAsset'].value;
    newObj.CurrLiablts = this.parentForm['controls'][this.identifier]['controls']['CurrLiablts'].value;
    newObj.ShareholderEquity = this.parentForm['controls'][this.identifier]['controls']['ShareholderEquity'].value;
    newObj.GrossMonthlyExpenseAmt = this.parentForm['controls'][this.identifier]['controls']['GrossMonthlyExpenseAmt'].value;
    newObj.ReturnOfEquityPrcnt = this.parentForm['controls'][this.identifier]['controls']['ReturnOfEquityPrcnt'].value;
    newObj.ProfitMarginPrcnt = this.parentForm['controls'][this.identifier]['controls']['ProfitMarginPrcnt'].value;
    newObj.DebtEquityRatioPrcnt = this.parentForm['controls'][this.identifier]['controls']['DebtEquityRatioPrcnt'].value;
    newObj.ArTurnOverPrcnt = this.parentForm['controls'][this.identifier]['controls']['ArTurnOverPrcnt'].value;
    newObj.WorkingCapitalAmt = this.parentForm['controls'][this.identifier]['controls']['WorkingCapitalAmt'].value;
    newObj.DateAsOf = this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].value;
    newObj.OprCost = this.parentForm['controls'][this.identifier]['controls']['OprCost'].value;
    newObj.CurrAsset = this.parentForm['controls'][this.identifier]['controls']['CurrAsset'].value;
    newObj.TotalAsset = this.parentForm['controls'][this.identifier]['controls']['TotalAsset'].value;
    newObj.LongTermLiablts = this.parentForm['controls'][this.identifier]['controls']['LongTermLiablts'].value;
    newObj.CurrRatio = this.parentForm['controls'][this.identifier]['controls']['CurrRatio'].value;
    // newObj.RowVersion= this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].value;

    if (this.IsAddFinData == false) {
      this.ListLtkmCustCoyFinData[this.currentCustFinDataIndex] = newObj;
    } else {
      this.ListLtkmCustCoyFinData.push(newObj);
    }
    this.UpdateSource.emit({ Key: 'IsDetail', Value: false, ListLtkmCustCoyFinData: this.ListLtkmCustCoyFinData });
    this.IsDetail = false;
  }

  //PERUBAHAN START
  //FUNGSI VIEW
  showDetailCustFinData(index: number) {
    let datePipe = new DatePipe("en-US");
    this.currentCustFinDataIndex = index;
    this.CustCoyFinData = this.ListLtkmCustCoyFinData[this.currentCustFinDataIndex];
    this.calculate()
    this.TitleCustFinSuffix = 'Date as of ' + datePipe.transform(this.CustCoyFinData['DateAsOf'], 'dd-MMM-yyyy')
    this.IsShowDetailCustFin = true;
    console.log("haloooo")
    console.log(this.CustCoyFinData)
  }
  calculate(){
    this.NettIncomeAmtCoy = this.CustCoyFinData['GrossMonthlyIncomeAmt'] - (this.CustCoyFinData['OthMonthlyInstAmt'] + this.CustCoyFinData['OtherMonthlyInstallmentDsf']) - this.CustCoyFinData['OprCost'];
  }
  hideDetailCustFinData() {
    this.TitleCustFinSuffix = '';
    this.IsShowDetailCustFin = false;
    this.CustCoyFinData = {};
  }
  //PERUBAHAN END
  
}
