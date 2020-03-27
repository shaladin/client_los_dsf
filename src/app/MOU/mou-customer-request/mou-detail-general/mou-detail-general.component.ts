import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationFormsComponent } from 'app/forms/validation/validation-forms.component';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { MouCustClauseObj } from 'app/shared/model/MouCustClauseObj.Model';

@Component({
  selector: 'app-mou-detail-general',
  templateUrl: './mou-detail-general.component.html',
  styleUrls: ['./mou-detail-general.component.scss']
})
export class MouDetailGeneralComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() Mode: string;
  @Output() ResponseMouDetailGeneral: EventEmitter<any> = new EventEmitter();
  currencyList: any;
  intrstTypeList: any;
  instSchmList: any;
  payFreqList: any;
  firstInstList: any;

  MouDetailGeneralForm = this.fb.group({
    MouCustClauseId: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    AssetTypeCode: ['', [Validators.required]],
    MrInterestTypeCode: ['', [Validators.required]],
    MrInstSchmCode: ['', [Validators.required]],
    MrFirstInstTypeCode: [''],
    PayFreqCode: ['', [Validators.required]],
    DownPaymentFromPrcnt: ['', [Validators.required]],
    DownPaymentToPrcnt: ['', [Validators.required]],
    TenorFrom: ['', [Validators.required]],
    TenorTo: ['', [Validators.required]],
    RowVersion: [''],
    CurrCode: ['', [Validators.required]]
  });

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder
  ) { 
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
    refMasterFirstInst.RefMasterTypeCode = "FIRSTINSTTYPE";
    let reqFirstInst = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterFirstInst);
    forkJoin([reqCurrency, reqIntrstType, reqInstSchm, reqPayFreq, reqFirstInst]).subscribe(
      (response) => {
        this.currencyList = response[0];
        this.intrstTypeList = response[1];
        this.instSchmList = response[2];
        this.payFreqList = response[3];
        this.firstInstList = response[4];
        this.MouDetailGeneralForm.patchValue({
          CurrCode: this.currencyList.ReturnObject[0].Key,
          MrInterestTypeCode: this.intrstTypeList.ReturnObject[0].Key,
          MrInstSchmCode: this.instSchmList.ReturnObject[0].Key,
          PayFreqCode: this.payFreqList.ReturnObject[0].Key
        });
      },
      (error) => {
        console.log("ERROR");
        console.log(error);
      }
    );

  }

  ngOnInit() {
    this.MouDetailGeneralForm.patchValue({
      MouCustId: this.MouCustId
    });

    if(this.Mode == "edit"){
      var mouCustClause = new MouCustClauseObj();
      mouCustClause.MouCustId = this.MouCustId;
      this.httpClient.post(AdInsConstant.GetMouCustClauseByMouCustId, mouCustClause).subscribe(
        (response) => {
          this.MouDetailGeneralForm.patchValue({
            ...response
          });
        },
        (error) => {
          console.log("ERROR");
          console.log(error);
        }
      );
    }
  }

  Save(enjiForm){
    var mouCustClauseData = this.MouDetailGeneralForm.value;
    var url = "";

    if(this.Mode == "add"){
      url = AdInsConstant.AddMouCustClause;
    }
    else if(this.Mode == "edit"){
      url = AdInsConstant.EditMouCustClause;
    }

    this.httpClient.post(url, mouCustClauseData).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        this.ResponseMouDetailGeneral.emit(response);
      },
      (error) => {
        console.log("ERROR");
        console.log(error);
      }
    );
  }

}
