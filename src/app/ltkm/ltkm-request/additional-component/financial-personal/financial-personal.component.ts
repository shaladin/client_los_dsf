import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { BankSectionComponent } from 'app/NEW-NAP/sharing-component/cust-completion-component/financial-tab/bank-section/bank-section.component';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { LtkmCustBankAccObj } from 'app/shared/model/LTKM/LtkmCustBankAccObj.Model';
import { LtkmCustPersonalFinDataObj } from 'app/shared/model/LTKM/LtkmCustPersonalFinDataObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-ltkm-financial-personal',
  templateUrl: './financial-personal.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class LtkmFinancialPersonalComponent implements OnInit, AfterViewInit {
  
  @ViewChild(BankSectionComponent) bankSectionComponent;

  @Input() AppCustId: number;
  @Input() LtkmCustId: number;

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() isLockMode: boolean = false;
  
  @Input() AppCustPersonalId: number;
  @Input() IsMarried: boolean;
  @Output() UpdateSource: EventEmitter<object> = new EventEmitter();
  @ViewChild('ModalPersonalFinData') ModalPersonalFinData : ElementRef;
  @ViewChild('btnclosemodal') btnclosemodal : ElementRef;


  IsDetail: boolean = false;
  AttrGroup: string = CommonConstant.AttrGroupCustPersonalFinData;
  AppCustPersonalFinData: AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
  CustAttrRequest: Array<Object>;
  MrSourceOfIncomeTypeObj: Array<KeyValueObj> = new Array();
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();
  LtkmCustBankAccList: Array<LtkmCustBankAccObj> = new Array();
  CustBankAccList: Array<any> = new Array();


  @Input() ListLtkmCustPersonalFinData : Array<LtkmCustPersonalFinDataObj> = [];
  IsAddFinData: boolean = true;
  currentCustFinDataIndex: number;
  currentModal: any;

  // FinancialForm = this.fb.group({
  //   LtkmCustPersonalFinDataId: [0],
  //   LtkmCustPersonalId: [0, Validators.required],
  //   MonthlyIncomeAmt: ['', Validators.required],
  //   MrSourceOfIncomeTypeCode: [''],
  //   OtherIncomeAmt: [0],
  //   IsJoinIncome: [false],
  //   MonthlyExpenseAmt: [0],
  //   MonthlyInstallmentAmt: [0],
  //   OtherMonthlyInstAmt: [0],
  //   SpouseMonthlyIncomeAmt: [0],
  //   TotalIncomeAmt: [0],
  //   NettIncomeAmt: [0],
  //   DateAsOf: [0],
  //   RowVersion: ['']
  // })

  AppCustAttrListForm = this.fb.group({
  });

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private modalService: NgbModal) { }

    ngAfterViewInit(){
      console.log(this.ModalPersonalFinData);
      console.log(this.btnclosemodal);
    }

  async ngOnInit() {
        this.parentForm.addControl(this.identifier, this.fb.group({
          LtkmCustPersonalFinDataId: [0],
          LtkmCustPersonalId: [0],
          MonthlyIncomeAmt: [''],
          MrSourceOfIncomeTypeCode: [''],
          OtherIncomeAmt: [0],
          IsJoinIncome: [false],
          MonthlyExpenseAmt: [0],
          MonthlyInstallmentAmt: [0],
          OtherMonthlyInstAmt: [0],
          SpouseMonthlyIncomeAmt: [0],
          TotalIncomeAmt: [0],
          NettIncomeAmt: [0],
          DateAsOf: [0],
          RowVersion: ['']
          }));
    await this.GetRefMaster();
  }

  GetRefMaster() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeSourceIncome }).subscribe(
      (response) => {
        this.MrSourceOfIncomeTypeObj = response[CommonConstant.ReturnObj];
        this.parentForm['controls'][this.identifier].patchValue({
          MrSourceOfIncomeTypeCode: this.MrSourceOfIncomeTypeObj[0].Key
        });
      }
    );
  }

  //perlu tambah get data dari foundation
  GetListFinData()
  {
    this.http.post<LtkmCustPersonalFinDataObj>(URLConstant.GetListLtkmCustPersonalFinDataByLtkmCustlId, { LtkmCustlId: this.LtkmCustId }).subscribe(
      (response) => {
        this.ListLtkmCustPersonalFinData = response['ListLtkmCustPersonalFinData'];
      }
    );
  }

  GetFinData(currentCustFinDataIndex:number)
  {
    this.IsAddFinData = false;
    this.currentCustFinDataIndex = currentCustFinDataIndex;
    let custFinData:LtkmCustPersonalFinDataObj = this.ListLtkmCustPersonalFinData[this.currentCustFinDataIndex];
    let datePipe = new DatePipe("en-US");
    if(!custFinData) 
    {
      custFinData = new LtkmCustPersonalFinDataObj();
      this.IsAddFinData = true;
    }

    console.log('richard check here');
    console.log(custFinData);

    this.parentForm['controls'][this.identifier].patchValue({
      AppCustPersonalFinDataId: custFinData.LtkmCustPersonalFinDataId,
      AppCustPersonalId: this.AppCustPersonalId,
      MonthlyIncomeAmt: custFinData.MonthlyIncomeAmt,
      MrSourceOfIncomeTypeCode: custFinData.MrSourceOfIncomeTypeCode,
      OtherIncomeAmt: custFinData.OtherIncomeAmt,
      IsJoinIncome: custFinData.IsJoinIncome,
      MonthlyExpenseAmt: custFinData.MonthlyExpenseAmt,
      MonthlyInstallmentAmt: custFinData.MonthlyInstallmentAmt,
      OtherMonthlyInstAmt: custFinData.OtherMonthlyInstAmt,
      SpouseMonthlyIncomeAmt: custFinData.SpouseMonthlyIncomeAmt,
      DateAsOf: custFinData.DateAsOf ? datePipe.transform(custFinData.DateAsOf, 'yyyy-MM-dd') : '',
      RowVersion: custFinData.RowVersion
    });
    this.CalculateFinData();

    this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].setValidators([Validators.required]);
    this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].updateValueAndValidity();

    this.currentModal = this.modalService.open(this.ModalPersonalFinData, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false});
  }

  GetEvent(event) {
    if (event != undefined && event.Key == "IsDetail") {
      this.IsDetail = event.Value;
    }
  }

  SaveModal(){
    this.SaveAppCustPersonalFinData();
    this.modalService.dismissAll();
  }

  CloseModal(){
    this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].clearValidators();
    this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].updateValueAndValidity();
    this.modalService.dismissAll();
  }

  CalculateFinData() {
    let FormData = this.parentForm['controls'][this.identifier].value;
    let MonthlyIncomeAmt = FormData.MonthlyIncomeAmt;
    let OtherIncomeAmt = FormData.OtherIncomeAmt;
    let SpouseMonthlyIncomeAmt = FormData.SpouseMonthlyIncomeAmt;
    let MonthlyExpenseAmt = FormData.MonthlyExpenseAmt;
    let MonthlyInstallmentAmt = FormData.MonthlyInstallmentAmt;
    let OtherMonthlyInstAmt = FormData.OtherMonthlyInstAmt;
    let TotalIncomeAmt = FormData.TotalIncomeAmt;
    let NettIncomeAmt = FormData.NettIncomeAmt;

    if (FormData.IsJoinIncome) {
      TotalIncomeAmt = MonthlyIncomeAmt + SpouseMonthlyIncomeAmt + OtherIncomeAmt;
    } else {
      TotalIncomeAmt = MonthlyIncomeAmt + OtherIncomeAmt;
    }

    NettIncomeAmt = TotalIncomeAmt - (MonthlyExpenseAmt + MonthlyInstallmentAmt + OtherMonthlyInstAmt);

    this.parentForm['controls'][this.identifier].patchValue({
      TotalIncomeAmt: TotalIncomeAmt,
      NettIncomeAmt: NettIncomeAmt
    });
  }

  SaveAppCustPersonalFinData()
  {
    if (!this.parentForm['controls'][this.identifier].valid) return;

      var newObj = new LtkmCustPersonalFinDataObj;
      newObj.DateAsOf = this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].value;
      newObj.LtkmCustPersonalFinDataId = this.parentForm['controls'][this.identifier]['controls']['LtkmCustPersonalFinDataId'].value;
      newObj.LtkmCustPersonalId = this.parentForm['controls'][this.identifier]['controls']['LtkmCustPersonalId'].value;
      newObj.MonthlyIncomeAmt = this.parentForm['controls'][this.identifier]['controls']['MonthlyIncomeAmt'].value;
      newObj.MrSourceOfIncomeTypeCode = this.parentForm['controls'][this.identifier]['controls']['MrSourceOfIncomeTypeCode'].value;
      newObj.OtherIncomeAmt = this.parentForm['controls'][this.identifier]['controls']['OtherIncomeAmt'].value;
      newObj.IsJoinIncome = this.parentForm['controls'][this.identifier]['controls']['IsJoinIncome'].value;
      newObj.MonthlyExpenseAmt = this.parentForm['controls'][this.identifier]['controls']['MonthlyExpenseAmt'].value;
      newObj.MonthlyInstallmentAmt = this.parentForm['controls'][this.identifier]['controls']['MonthlyInstallmentAmt'].value;
      newObj.OtherMonthlyInstAmt = this.parentForm['controls'][this.identifier]['controls']['OtherMonthlyInstAmt'].value;
      newObj.SpouseMonthlyIncomeAmt = this.parentForm['controls'][this.identifier]['controls']['SpouseMonthlyIncomeAmt'].value;
      newObj.TotalIncomeAmt = this.parentForm['controls'][this.identifier]['controls']['TotalIncomeAmt'].value;
      newObj.NettIncomeAmt = this.parentForm['controls'][this.identifier]['controls']['NettIncomeAmt'].value;
      newObj.DateAsOf = this.parentForm['controls'][this.identifier]['controls']['DateAsOf'].value;
    
      if(this.IsAddFinData == false){
        this.ListLtkmCustPersonalFinData[this.currentCustFinDataIndex] = newObj;
      }else{
        this.ListLtkmCustPersonalFinData.push(newObj);
      }
      this.UpdateSource.emit({Key: 'IsDetail', Value: false, ListLtkmCustPersonalFinData: this.ListLtkmCustPersonalFinData});
      this.IsDetail = false;
    }

    DeleteFinData(index: number){
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        this.ListLtkmCustPersonalFinData.splice(index, 1);
        this.UpdateSource.emit({Key: 'IsDetail', Value: false, ListLtkmCustPersonalFinData: this.ListLtkmCustPersonalFinData});
      }
    }
}
