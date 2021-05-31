import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { forkJoin } from 'rxjs';
import { MouCustClauseObj } from 'app/shared/model/MouCustClauseObj.Model';
import { MouCustAssetComponent } from './mou-cust-asset/mou-cust-asset.component';
import { MouCustAssetObj } from 'app/shared/model/MouCustAssetObj.Model';
import { MouCustAssetListObj } from 'app/shared/model/MouCustAssetListObj.Model';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefPayFreqObj } from 'app/shared/model/RefPayFreqObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-mou-detail-general',
  templateUrl: './mou-detail-general.component.html'
})
export class MouDetailGeneralComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() Mode: string;
  @Output() ResponseMouDetailGeneral: EventEmitter<any> = new EventEmitter();
  @ViewChild(MouCustAssetComponent) mouCustAssetComp: MouCustAssetComponent;
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
  tempMouCustAsset: MouCustAssetListObj;
  isReady: boolean = false;
  AssetForm = this.fb.group({
  });
  MouDetailGeneralForm = this.fb.group({
    MouCustClauseId: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    AssetTypeCode: [''],
    MrInterestTypeCode: ['', [Validators.required]],
    MrInstSchmCode: ['', [Validators.required]],
    MrFirstInstTypeCode: [''],
    PayFreqCode: ['', [Validators.required]],
    DownPaymentFromPrcnt: ['', [Validators.required, Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.min(0), Validators.max(100)]],
    DownPaymentToPrcnt: ['', [Validators.required, Validators.pattern("^[0-9]+([,.][0-9]+)?$"), Validators.min(0), Validators.max(100)]],
    TenorFrom: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0)]],
    TenorTo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    CurrCode: ['', [Validators.required]]
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

    this.isDPInvalid = false;
    this.isTenorInvalid = false;
    var refCurr; 
    let reqCurrency = this.httpClient.post(URLConstant.GetListKvpActiveRefCurr, refCurr);
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
    let getMouCustClause = this.httpClient.post(URLConstant.GetMouCustClauseByMouCustId, { Id: this.MouCustId });
    forkJoin([reqCurrency, reqIntrstType, reqInstSchm, reqPayFreq, reqFirstInst, getMouCustClause]).subscribe(
      (response: any) => {
        this.currencyList = response[0];
        this.intrstTypeList = response[1];
        this.instSchmList = response[2];
        this.payFreqList = response[3];
        this.firstInstList = response[4];
        this.tempMouCustClause = response[5];
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
        this.isReady = true;
      });
  }

  ngOnInit() {
    console.log("aaa")
  }

  Save(enjiForm) {
    if (this.Mode != null) {
      this.saveMouCustAssetDetail();
      this.mouCustClause = new MouCustClauseObj();
      this.mouCustClause.MouCustId = this.MouCustId;
      this.httpClient.post(URLConstant.GetMouCustClauseByMouCustId, { Id: this.MouCustId }).subscribe(
        (response: MouCustClauseObj) => {
          this.tempMouCustClause = response;
          this.getData();
        });
    }
    else {
      this.saveMouCustAssetDetail();
      this.getData();
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
    this.httpClient.post(URLConstant.AddMouCustAsset, this.tempMouCustAsset).subscribe(
      (response) => {
      }
    );
  }

  getData() {

    this.mouCustClause = this.tempMouCustClause;
    this.mouCustClause = this.MouDetailGeneralForm.value;
    if (this.tempMouCustClause != null) {
      this.mouCustClause.RowVersion = this.tempMouCustClause.RowVersion;
      this.mouCustClause.MouCustClauseId = this.tempMouCustClause.MouCustClauseId;
    }
    this.mouCustClause["AssetTypeCode"] = this.mouCustAssetComp.MouCustClauseAssetForm.controls["AssetTypeCode"].value;
    this.url = "";

    if (this.mouCustClause.DownPaymentFromPrcnt >= this.mouCustClause.DownPaymentToPrcnt) {
      this.isDPInvalid = true;
      this.dpInvalidMsg = "Invalid Down Payment Range";
      return false;
    }
    else {
      this.isDPInvalid = false;
      this.dpInvalidMsg = "";
    }

    if (this.mouCustClause.TenorFrom >= this.mouCustClause.TenorTo) {
      this.isTenorInvalid = true;
      this.tenorInvalidMsg = "Invalid Tenor Range";
      return false;
    }
    else {
      this.isTenorInvalid = false;
      this.tenorInvalidMsg = "";
    }


    if (this.mode == "add" && this.Mode != "edit") {
      this.url = URLConstant.AddMouCustClause;

    }
    else if (this.mode == "edit" || this.Mode == "edit") {
      this.url = URLConstant.EditMouCustClause;
    }

    this.httpClient.post(this.url, this.mouCustClause).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        this.ResponseMouDetailGeneral.emit(response);
      });
  }

}
