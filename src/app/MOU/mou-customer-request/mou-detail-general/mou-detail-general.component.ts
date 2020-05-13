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
  templateUrl: './mou-detail-general.component.html',
  styleUrls: ['./mou-detail-general.component.scss']
})
export class MouDetailGeneralComponent implements OnInit {
  @Input() MouCustId: number;
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
    TenorFrom: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    TenorTo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    RowVersion: [''],
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
    refMasterIntrstType.RefMasterTypeCode = "INTEREST_TYPE";
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
        var mouCustClauseData = response[5];
        this.MouDetailGeneralForm.patchValue({
          CurrCode: this.currencyList.ReturnObject[0].Key,
          MrInterestTypeCode: this.intrstTypeList.ReturnObject[0].Key,
          MrInstSchmCode: this.instSchmList.ReturnObject[0].Key,
          PayFreqCode: this.payFreqList.ReturnObject[0].Key
        });

        if(mouCustClauseData["MouCustClauseId"] != 0){
          this.mode = "edit";
          this.MouDetailGeneralForm.patchValue({
            ...mouCustClauseData
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  Save(enjiForm){
    var mouCustClauseData = this.MouDetailGeneralForm.value;
    mouCustClauseData["AssetTypeCode"] = this.mouCustAssetComp.MouCustClauseAssetForm.controls["AssetTypeCode"].value;
    var url = "";

    if(mouCustClauseData.DownPaymentFromPrcnt >= mouCustClauseData.DownPaymentToPrcnt){
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

    if(mouCustClauseData.TenorFrom >= mouCustClauseData.TenorTo){
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

    if(this.mode == "add"){
      url = AdInsConstant.AddMouCustClause;
      // console.log(url);
    }
    else if(this.mode == "edit"){
      url = AdInsConstant.EditMouCustClause;
      // console.log(url);
    }

    this.httpClient.post(url, mouCustClauseData).subscribe(
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
