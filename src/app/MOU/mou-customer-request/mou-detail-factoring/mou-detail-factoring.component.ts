import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { MouCustFctrObj } from 'app/shared/model/MouCustFctrObj.Model';
import { MouCustListedCustFctrComponent } from '../mou-cust-listed-cust-fctr/mou-cust-listed-cust-fctr.component';

@Component({
  selector: 'app-mou-detail-factoring',
  templateUrl: './mou-detail-factoring.component.html'
})
export class MouDetailFactoringComponent implements OnInit {
  @Input() MouCustId: number;
  @Output() ResponseMouCustFactoring: EventEmitter<any> = new EventEmitter();
  @ViewChild(MouCustListedCustFctrComponent) MouListedFctrComp: MouCustListedCustFctrComponent;
  recourseTypeList: any;
  wopList: any;
  paidByList: any;
  instTypeList: any;
  singleInstCalcMthdList: any;
  payFreqList: any;
  instSchmList: any;
  currencyList: any;
  isListedFctr: boolean;
  shouldComponentLoad: boolean;
  isTenorInvalid: boolean;
  tenorInvalidMsg: string;
  private mode: string = "add";

  MouDetailFactoringForm = this.fb.group({
    MouCustFctrId: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    MrRecourseTypeCode: [''],
    IsDisclosed: [false],
    WopCode: [''],
    MrPaidByCode: [''],
    MrInstTypeCode: [''],
    SingleInstCalcMthd: [''],
    TopDays: ['', [Validators.min(0)]],
    TenorFrom: ['', [Validators.min(0)]],
    TenorTo: ['', [Validators.min(0)]],
    PayFreqCode: [''],
    MrInstSchmCode: [''],
    InterestRatePrcnt: ['', [Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(100)]],
    RetentionPrcnt: ['', [Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(100)]],
    IsListedCust: [false],
    Notes: [''],
    CurrCode: ['', [Validators.required]],
    RowVersion: ['']
  });
  
  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder
  ) { 
    this.isListedFctr = false;
    this.shouldComponentLoad = false;
  }

  ngOnInit() {
    var rmRecourseType = new RefMasterObj();
    rmRecourseType.RefMasterTypeCode = "RECOURSE_TYPE";
    let getRecourseType = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmRecourseType);
    var rmWop = new RefMasterObj();
    rmWop.RefMasterTypeCode = "WOP";
    let getWop = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmWop);
    var rmPaidBy = new RefMasterObj();
    rmPaidBy.RefMasterTypeCode = "PAID_BY";
    let getPaidBy = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmPaidBy);
    var rmInstType = new RefMasterObj();
    rmInstType.RefMasterTypeCode = "INST_TYPE";
    let getInstType = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmInstType);
    var rmSingleInstCalcMethod = new RefMasterObj();
    rmSingleInstCalcMethod.RefMasterTypeCode = "SINGLE_INST_CALC_METHOD";
    let getSingleInstCalcMethod = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmSingleInstCalcMethod);
    var rmPayFreq = new RefMasterObj();
    rmPayFreq.RefMasterTypeCode = "PAY_FREQ";
    let getPayFreq = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmPayFreq);
    var rmInstSchm = new RefMasterObj();
    rmInstSchm.RefMasterTypeCode = "INST_SCHM";
    let getInstSchm = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmInstSchm);
    var refMasterCurrency = new RefMasterObj();
    refMasterCurrency.RefMasterTypeCode = "CURRENCY";
    let getCurrency = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterCurrency);
    var mouCustFctr = new MouCustFctrObj();
    mouCustFctr.MouCustId = this.MouCustId;
    let getMouFctr = this.httpClient.post(AdInsConstant.GetMouCustFctrByMouCustId, mouCustFctr);
    forkJoin([getRecourseType, getWop, getPaidBy, getInstType, getSingleInstCalcMethod, getPayFreq, getInstSchm, getCurrency, getMouFctr]).subscribe(
      (response) => {
        this.recourseTypeList = response[0];
        this.wopList = response[1];
        this.paidByList = response[2];
        this.instTypeList = response[3];
        this.singleInstCalcMthdList = response[4];
        this.payFreqList = response[5];
        this.instSchmList = response[6];
        this.currencyList = response[7];
        var mouFctrData = response[8];
        this.MouDetailFactoringForm.patchValue({
          MrRecourseTypeCode: this.recourseTypeList.ReturnObject[0].Key,
          WopCode: this.wopList.ReturnObject[0].Key,
          MrPaidByCode: this.paidByList.ReturnObject[0].Key,
          MrInstTypeCode: this.instTypeList.ReturnObject[0].Key,
          SingleInstCalcMthd: this.singleInstCalcMthdList.ReturnObject[0].Key,
          PayFreqCode: this.payFreqList.ReturnObject[0].Key,
          MrInstSchmCode: this.instSchmList.ReturnObject[0].Key,
          CurrCode: this.currencyList.ReturnObject[0].Key
        });
        this.isListedFctr = mouFctrData["IsListedCust"];
        if(mouFctrData["MouCustFctrId"] != 0){
          this.mode = "edit";
          this.MouDetailFactoringForm.patchValue({
            ...mouFctrData
          });
        }
        else{
          this.MouDetailFactoringForm.patchValue({
            MouCustId: this.MouCustId
          });
        }
        this.instTypeHandler();
        this.shouldComponentLoad = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  instTypeHandler(){
    var value = this.MouDetailFactoringForm.controls["MrInstTypeCode"].value;
    if(value == AdInsConstant.SINGLE_INST_TYPE){
      this.MouDetailFactoringForm.patchValue({
        PayFreqCode: AdInsConstant.PAY_FREQ_MONTHLY,
        MrInstSchmCode: AdInsConstant.INST_SCHM_REGULAR_FIXED
      });
      this.MouDetailFactoringForm.controls["PayFreqCode"].disable();
      this.MouDetailFactoringForm.controls["MrInstSchmCode"].disable();
      this.MouDetailFactoringForm.controls["SingleInstCalcMthd"].enable();
      this.MouDetailFactoringForm.patchValue({
        SingleInstCalcMthd: this.singleInstCalcMthdList.ReturnObject[0].Key
      });
    }
    else if(value == AdInsConstant.MULTIPLE_INST_TYPE){
      this.MouDetailFactoringForm.controls["PayFreqCode"].enable();
      this.MouDetailFactoringForm.controls["MrInstSchmCode"].enable();
      this.MouDetailFactoringForm.controls["SingleInstCalcMthd"].disable();
      this.MouDetailFactoringForm.patchValue({
        SingleInstCalcMthd : ''
      });
    }
  }

  Save(enjiForm){
    var formData = this.MouDetailFactoringForm.getRawValue();
    var url;

    formData.IsListedCust = this.MouListedFctrComp.MouCustIsListedForm.controls["IsListedCust"].value;

    if((formData.TenorFrom != "" || formData.TenorTo != "") && formData.TenorFrom > formData.TenorTo){
      console.log("Tenor Invalid");
      this.isTenorInvalid = true;
      this.tenorInvalidMsg = "Invalid Tenor Range";
      return false;
    }
    else{
      if(formData.TenorFrom == ""){
        formData.TenorFrom = 0;
      }
      if(formData.TenorTo == ""){
        formData.TenorTo = 0;
      }
      console.log("Tenor Valid");
      this.isTenorInvalid = false;
      this.tenorInvalidMsg = "";
    }

    if(this.mode == "add"){
      url = AdInsConstant.AddMouCustFctr;
    }
    else{
      url = AdInsConstant.EditMouCustFctr;
    }

    this.httpClient.post(url, formData).subscribe(
      (response) => {
        this.ResponseMouCustFactoring.emit(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  back(){
    this.ResponseMouCustFactoring.emit({StatusCode: "-2"});
  }

}
