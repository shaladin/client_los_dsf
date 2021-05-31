import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { forkJoin } from 'rxjs';
import { MouCustClauseObj } from 'app/shared/model/MouCustClauseObj.Model';
import { ChangeMouCustAssetComponent } from './change-mou-cust-asset/change-mou-cust-asset.component';
import { MouCustAssetObj } from 'app/shared/model/MouCustAssetObj.Model';
import { MouCustAssetListObj } from 'app/shared/model/MouCustAssetListObj.Model';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefPayFreqObj } from 'app/shared/model/RefPayFreqObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-change-mou-detail-general',
  templateUrl: './change-mou-detail-general.component.html'
})
export class ChangeMouDetailGeneralComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() Mode: string;
  @Output() ResponseMouDetailGeneral: EventEmitter<any> = new EventEmitter();
  @ViewChild(ChangeMouCustAssetComponent) mouCustAssetComp: ChangeMouCustAssetComponent;
  currencyList: Array<KeyValueObj>;
  intrstTypeList: Array<KeyValueObj>;
  instSchmList: Array<KeyValueObj>;
  payFreqList: Array<RefPayFreqObj>;
  firstInstList: Array<KeyValueObj>;
  mode: string = "add";
  isDPInvalid: boolean;
  dpInvalidMsg: string;
  isTenorInvalid: boolean;
  tenorInvalidMsg: string;
  mouCustClause: MouCustClauseObj;
  url: string;
  tempMouCustClause: MouCustClauseObj;
  tempChangeMouCustClause: any;
  tempMouCustAsset: MouCustAssetListObj;
  isReady: boolean = false;
  AssetForm = this.fb.group({
  });
  MouDetailGeneralForm = this.fb.group({
    MouCustClauseId: [0],
    ChangeMouCustClauseId: [0],
    MouCustId: [0],
    AssetTypeCode: [''],
    MrInterestTypeCode: [''],
    MrInstSchmCode: [''],
    MrFirstInstTypeCode: [''],
    PayFreqCode: [''],
    DownPaymentFromPrcnt: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(100)]],
    DownPaymentToPrcnt: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(100)]],
    TenorFrom: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0)]],
    TenorTo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    CurrCode: [''],
    VirAccNo: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private fb: FormBuilder
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['mouCustId'] != null) {
        this.MouCustId = params['mouCustId'];
      }
    });
  }

  ngOnInit() {
    this.isDPInvalid = false;
    this.isTenorInvalid = false;

    var refMasterCurrency = new RefMasterObj();
    refMasterCurrency.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCurrency;
    let reqCurrency = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterCurrency);

    var refMasterIntrstType = new RefMasterObj();
    refMasterIntrstType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
    let reqIntrstType = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterIntrstType);

    var refMasterInstSchm = new RefMasterObj();
    refMasterInstSchm.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstSchm;
    let reqInstSchm = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterInstSchm);

    let reqPayFreq = this.httpClient.post(URLConstant.GetListActiveRefPayFreq, null);

    var refMasterFirstInst = new RefMasterObj();
    refMasterFirstInst.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeFirstInstType;
    let reqFirstInst = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterFirstInst);

    var mouCustClause = new GenericObj();
    mouCustClause.Id = this.MouCustId;
    let getMouCustClause = this.httpClient.post(URLConstant.GetMouCustClauseByMouCustId, mouCustClause);

    let getChangeMouCustClause = this.httpClient.post(URLConstant.GetChangeMouCustClauseByMouCustId, mouCustClause);

    forkJoin([reqCurrency, reqIntrstType, reqInstSchm, reqPayFreq, reqFirstInst, getMouCustClause, getChangeMouCustClause]).subscribe(
      (response: any) => {
        this.currencyList = response[0];
        this.intrstTypeList = response[1].ReturnObject;
        this.instSchmList = response[2].ReturnObject;
        this.payFreqList = response[3].ReturnObject;
        this.firstInstList = response[4].ReturnObject;
        this.tempMouCustClause = response[5];
        this.tempChangeMouCustClause = response[6]

        if (this.tempChangeMouCustClause['Status'] == "Failed") {
          this.MouDetailGeneralForm.patchValue({
            MouCustId: this.MouCustId,
            CurrCode: this.currencyList[0].Key,
            MrInterestTypeCode: this.intrstTypeList[0].Key,
            MrInstSchmCode: this.instSchmList[0].Key,
            PayFreqCode: this.payFreqList[0].PayFreqCode,
            MrFirstInstTypeCode: this.firstInstList[0].Key,
            AssetTypeCode: this.tempMouCustClause.AssetTypeCode
          });

          if (this.tempMouCustClause["MouCustClauseId"] != 0) {
            this.mode = "edit";
            this.MouDetailGeneralForm.patchValue({
              ...this.tempMouCustClause
            });
          }
        }
        else {
          this.mode = "edit";
          this.MouDetailGeneralForm.patchValue({
            ...this.tempChangeMouCustClause
          });
        }
        this.isReady = true;
      });
  }

  Save(enjiForm) {
    
    if (this.AssetForm.controls.Asset["controls"]["length"] <= 0) {
      this.toastr.warningMessage("Must Have At Least 1 Asset Data");
      return;
    }
    if (this.Mode != null) {
      this.saveMouCustAssetDetail();
      this.mouCustClause = new MouCustClauseObj();
      this.mouCustClause.MouCustId = this.MouCustId;
      this.httpClient.post(URLConstant.GetMouCustClauseByMouCustId, this.mouCustClause).subscribe(
        (response: MouCustClauseObj) => {
          this.tempMouCustClause = response;
          this.saveMouDetail();
        });
    }
    else {
      this.saveMouCustAssetDetail();
      this.saveMouDetail();
    }
  }

  saveMouCustAssetDetail() {
    this.tempMouCustAsset = new MouCustAssetListObj();
    this.tempMouCustAsset.RequestMouCustAssetObj = new Array<MouCustAssetObj>();
    for (var i = 0; i < this.AssetForm.controls.Asset["controls"]["length"]; i++) {
      this.tempMouCustAsset.RequestMouCustAssetObj[i] = new MouCustAssetObj();
      this.tempMouCustAsset.RequestMouCustAssetObj[i].MouCustId = this.MouCustId;
      this.tempMouCustAsset.RequestMouCustAssetObj[i].FullAssetName = this.AssetForm.controls.Asset["controls"][i]["controls"]["FullAssetName"].value;
      this.tempMouCustAsset.RequestMouCustAssetObj[i].FullAssetCode = this.AssetForm.controls.Asset["controls"][i]["controls"]["FullAssetCode"].value;
    }
    this.tempMouCustAsset.MouCustId = this.MouCustId;
    this.httpClient.post(URLConstant.AddChangeMouCustAssets, this.tempMouCustAsset).subscribe(
      (response) => {
      }
    );
  }

  saveMouDetail() {
console.log("GET")
    this.mouCustClause = this.tempMouCustClause;
    this.mouCustClause = this.MouDetailGeneralForm.value;
    if (this.tempMouCustClause != null) {
      this.mouCustClause.RowVersion = this.tempMouCustClause.RowVersion;
      this.mouCustClause.MouCustClauseId = this.tempMouCustClause.MouCustClauseId;
    }

    if (this.mouCustClause.DownPaymentFromPrcnt >= this.mouCustClause.DownPaymentToPrcnt) {
      this.isDPInvalid = true;
      this.dpInvalidMsg = "Invalid Down Payment Range";
      return ;
    }
    else {
      this.isDPInvalid = false;
      this.dpInvalidMsg = "";
    }

    if (this.mouCustClause.TenorFrom >= this.mouCustClause.TenorTo) {
      this.isTenorInvalid = true;
      this.tenorInvalidMsg = "Invalid Tenor Range";
      return;
    }
    else {
      this.isTenorInvalid = false;
      this.tenorInvalidMsg = "";
    }

    this.httpClient.post(URLConstant.AddEditChangeMouCustClause, this.mouCustClause).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        this.ResponseMouDetailGeneral.emit(response);
      });
  }
}
