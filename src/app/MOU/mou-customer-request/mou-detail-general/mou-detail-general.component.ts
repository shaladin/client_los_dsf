import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationFormsComponent } from 'app/forms/validation/validation-forms.component';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { MouCustClauseObj } from 'app/shared/model/MouCustClauseObj.Model';
import { MouCustAssetComponent } from './mou-cust-asset/mou-cust-asset.component';

@Component({
  selector: 'app-mou-detail-general',
  templateUrl: './mou-detail-general.component.html'
})
export class MouDetailGeneralComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() Mode: string;
  @Output() ResponseMouDetailGeneral: EventEmitter<any> = new EventEmitter();
  @ViewChild(MouCustAssetComponent) mouCustAssetComp: MouCustAssetComponent;
  currencyList: any;
  intrstTypeList: any;
  instSchmList: any;
  payFreqList: any;
  firstInstList: any;
  mode: string = "add";
  isDPInvalid: boolean;
  dpInvalidMsg: string;
  isTenorInvalid: boolean;
  tenorInvalidMsg: string; 
  mouCustClause : any; 
  url : string;
  tempMouCustClause : any;
  MouDetailGeneralForm = this.fb.group({
    MouCustClauseId: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    AssetTypeCode: [''],
    MrInterestTypeCode: ['', [Validators.required]],
    MrInstSchmCode: ['', [Validators.required]],
    MrFirstInstTypeCode: [''],
    PayFreqCode: ['', [Validators.required]],
    DownPaymentFromPrcnt: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(100)]],
    DownPaymentToPrcnt: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(100)]],
    TenorFrom: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0)]] ,
    TenorTo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]], 
    CurrCode: ['', [Validators.required]]
  });

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder
  ) { 
    this.isDPInvalid = false;
    this.isTenorInvalid = false;
  }

  ngOnInit() {
    this.MouDetailGeneralForm.patchValue({
      MouCustId: this.MouCustId
    });

    var refMasterCurrency = new RefMasterObj();
    refMasterCurrency.RefMasterTypeCode = "CURRENCY";
    let reqCurrency = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterCurrency);
    var refMasterIntrstType = new RefMasterObj();
    // refMasterIntrstType.RefMasterTypeCode = "INTEREST_TYPE";
    refMasterIntrstType.RefMasterTypeCode = "INTRSTTYPE";
    let reqIntrstType = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterIntrstType);
    var refMasterInstSchm = new RefMasterObj();
    refMasterInstSchm.RefMasterTypeCode = "INST_SCHM";
    let reqInstSchm = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterInstSchm);
    var refMasterPayFreq = new RefMasterObj();
    refMasterPayFreq.RefMasterTypeCode = "PAY_FREQ";
    let reqPayFreq = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterPayFreq);
    var refMasterFirstInst = new RefMasterObj();
    refMasterFirstInst.RefMasterTypeCode = "FIRST_INST_TYPE";
    let reqFirstInst = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterFirstInst);
    var mouCustClause = new MouCustClauseObj();
    mouCustClause.MouCustId = this.MouCustId;
    let getMouCustClause = this.httpClient.post(AdInsConstant.GetMouCustClauseByMouCustId, mouCustClause);
    forkJoin([reqCurrency, reqIntrstType, reqInstSchm, reqPayFreq, reqFirstInst, getMouCustClause]).subscribe(
      (response) => {
        this.currencyList = response[0];
        this.intrstTypeList = response[1];
        this.instSchmList = response[2];
        this.payFreqList = response[3];
        this.firstInstList = response[4];
        this.tempMouCustClause = response[5];
        this.MouDetailGeneralForm.patchValue({
          CurrCode: this.currencyList.ReturnObject[0].Key,
          MrInterestTypeCode: this.intrstTypeList.ReturnObject[0].Key,
          MrInstSchmCode: this.instSchmList.ReturnObject[0].Key,
          PayFreqCode: this.payFreqList.ReturnObject[0].Key,
          MrFirstInstTypeCode : this.firstInstList.ReturnObject[0].Key
        });

        if(this.tempMouCustClause["MouCustClauseId"] != 0){
          this.mode = "edit";
          this.MouDetailGeneralForm.patchValue({
            ...this.tempMouCustClause
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  Save(enjiForm){
  
    if(this.Mode != null){ 
      this.mouCustClause = new MouCustClauseObj();
       this.mouCustClause.MouCustId = this.MouCustId;
       this.httpClient.post(AdInsConstant.GetMouCustClauseByMouCustId, this.mouCustClause).subscribe(
        (response) => { 
          this.tempMouCustClause = response;  
          this.getData();
        },
        (error) => {
          console.log(error);
        }
      );
    } 
    else{
      this.getData();
    }
  }
getData(){
  
  this.mouCustClause = this.tempMouCustClause;
  this.mouCustClause = this.MouDetailGeneralForm.value;
  if(this.tempMouCustClause!=null ){ 
    this.mouCustClause.RowVersion = this.tempMouCustClause.RowVersion;
    this.mouCustClause.MouCustClauseId = this.tempMouCustClause.MouCustClauseId;
  }
  this.mouCustClause["AssetTypeCode"] = this.mouCustAssetComp.MouCustClauseAssetForm.controls["AssetTypeCode"].value;
  this.url = "";

  if(this.mouCustClause.DownPaymentFromPrcnt >= this.mouCustClause.DownPaymentToPrcnt){
    console.log("DP Invalid");
    this.isDPInvalid = true;
    this.dpInvalidMsg = "Invalid Down Payment Range";
    return false;
  }
  else{
    console.log("DP Valid");
    this.isDPInvalid = false;
    this.dpInvalidMsg = "";
  }

  if(this.mouCustClause.TenorFrom >= this.mouCustClause.TenorTo){
    console.log("Tenor Invalid");
    this.isTenorInvalid = true;
    this.tenorInvalidMsg = "Invalid Tenor Range";
    return false;
  }
  else{
    console.log("Tenor Valid");
    this.isTenorInvalid = false;
    this.tenorInvalidMsg = "";
  }

  // console.log("Continue Submit...");

  if(this.mode == "add" && this.Mode != "edit"){
    console.log(this.Mode);
     this.url = AdInsConstant.AddMouCustClause;
   
    // console.log( this.url);
  }
  else if(this.mode == "edit" || this.Mode == "edit"){
    console.log(this.Mode);
    console.log("awdwad");
     this.url = AdInsConstant.EditMouCustClause;
    // console.log( this.url);
  }

  this.httpClient.post( this.url, this.mouCustClause).subscribe(
    (response) => {
      // console.log(response);
      this.toastr.successMessage(response["Message"]);
      this.ResponseMouDetailGeneral.emit(response);
    },
    (error) => {
      console.log(error);
    }
  );
}

  back(){
    this.ResponseMouDetailGeneral.emit({StatusCode: "-2"});
  }
}
