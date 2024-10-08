import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { LeadObj } from 'app/shared/model/lead.model';
import { environment } from 'environments/environment';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { ReqLeadInputLeadDataObj } from 'app/shared/model/request/lead/req-input-lead-data-obj.model';
import { LeadAssetObj } from 'app/shared/model/request/lead/lead-asset-obj.model';
import { LeadAppObj } from 'app/shared/model/request/lead/lead-app-obj.model';
import { AssetMasterObj } from 'app/shared/model/asset-master-obj.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ThirdPartyResultHForFraudChckObj } from 'app/shared/model/third-party-result-h-for-fraud-chck-obj.model';
import { AssetTypeObj } from 'app/shared/model/asset-type-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { ElementRef, Renderer2, AfterViewInit } from "@angular/core";
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';

@Component({
  selector: 'app-new-lead-input-lead-data-x-dsf',
  templateUrl: './new-lead-input-lead-data-x-dsf.component.html'
})
export class NewLeadInputLeadDataXDsfComponent implements OnInit {

  @Input() originPage: string;
  @Input() isEndOfTab: string = "";
  @Input() showCancelButton: boolean = true;
  @Output() outputTab: EventEmitter<object> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  typePage: string;
  CopyFrom: number;
  LeadId: number;
  assetConditionObj: RefMasterObj;
  returnAssetConditionObj: [];
  downPaymentObj: RefMasterObj;
  returnDownPaymentObj: [];
  firstInstObj: RefMasterObj;
  returnFirstInstObj: Array<KeyValueObj>;
  isNeedCheckBySystem: string;
  latestReqDtCheckRapindo: string;
  leadNo: string;
  latestCheckChassisNo: string = "";
  isAssetReady: boolean = false;
  InputLookupAssetObj: InputLookupObj;
  assetTypeId: string;
  leadInputLeadDataObj: ReqLeadInputLeadDataObj;
  serial1Disabled: boolean = false;
  serial2Disabled: boolean = false;
  serial3Disabled: boolean = false;
  serial4Disabled: boolean = false;
  serial5Disabled: boolean = false;
  serial1Mandatory: boolean = false;
  serial2Mandatory: boolean = false;
  serial3Mandatory: boolean = false;
  serial4Mandatory: boolean = false;
  serial5Mandatory: boolean = false;
  reqLeadAssetObj: LeadAssetObj;
  resLeadAssetObj: LeadAssetObj = new LeadAssetObj();
  reqLeadAppObj: LeadAppObj;
  resLeadAppObj: LeadAppObj = new LeadAppObj();
  reqAssetMasterObj: AssetMasterObj;
  resAssetMasterObj: AssetMasterObj;
  isUsed: boolean;
  LeadDataForm = this.fb.group({
    FullAssetCode: [''],
    FullAssetName: [''],
    MrAssetConditionCode: [''],
    MrDownPaymentTypeCode: [''],
    ManufacturingYear: [''],
    AssetPrice: [''],
    DownPaymentAmount: [''],
    DownPaymentPercent: ['', [Validators.min(0.00), Validators.max(100.00)]],
    Tenor: [''],
    MrFirstInstTypeCode: [''],
    NTFAmt: [''],
    TotalDownPayment: [''],
    InstallmentAmt: [''],
    items: this.fb.array([]),
  });
  generalSettingObj: GenericListByCodeObj;
  lobKta = new Array();
  leadObj: LeadObj;
  returnLobCode: string;
  WfTaskListId: any;
  editLeadObj: LeadObj;
  InstAmt: number;
  TotalDownPayment: number;
  AssetPrice: number;
  NTFAmt: number;
  Calculate: boolean = false;
  DPAmount: number;
  DPPercentage: number;
  year: number = new Date().getFullYear();
  Tenor: number;
  isDataLoad: boolean = false;
  items: FormArray;
  isAbleToSubmit: boolean = false;
  thirdPartyRsltHId: string;
  thirdPartyObj: ThirdPartyResultHForFraudChckObj;
  textButton: string;

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private elementRef: ElementRef, private renderer: Renderer2) {

    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      if (params["mode"] != null) {
        this.typePage = params["mode"];
      }
      if (params["WfTaskListId"] == null) {
        this.WfTaskListId = environment.isCore ? "" : 0;
      }
      else {
        this.WfTaskListId = params["WfTaskListId"];
      }
      if (params["CopyFrom"] != null) {
        this.CopyFrom = params["CopyFrom"];
      }
    });
  }

  async ngOnInit() {
    this.isEndOfTab == '0' ? this.textButton = 'Save' : this.textButton = 'Save and Continue'
    this.items = this.LeadDataForm.get('items') as FormArray;

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/Lead/lookupSimpleLeadAsset.json";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/Lead/lookupSimpleLeadAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/Lead/lookupSimpleLeadAsset.json";
    this.InputLookupAssetObj.isRequired = false;

    this.generalSettingObj = new GenericListByCodeObj();
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeLobKta);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);

    this.http.post(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).subscribe(
      (response) => {
        let returnGeneralSettingObj = response;
        this.lobKta = returnGeneralSettingObj["ResGetListGeneralSettingObj"][0].GsValue.split(',');
        this.isNeedCheckBySystem = returnGeneralSettingObj["ResGetListGeneralSettingObj"][1].GsValue;
        this.leadObj = new LeadObj();
        this.leadObj.LeadId = this.LeadId;
        let obj = {
          Id: this.leadObj.LeadId
        }
        this.http.post(URLConstant.GetLeadByLeadId, obj).subscribe(
          (response) => {
            this.leadNo = response['LeadNo'];
            this.returnLobCode = response['LobCode'];
            // this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
            // this.thirdPartyObj.TrxTypeCode = CommonConstant.LEAD_TRX_TYPE_CODE;
            // this.thirdPartyObj.TrxNo = this.leadNo;
            // this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_ASSET;
            // this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
            //   (response) => {
            //     this.latestReqDtCheckRapindo = response['ReqDt'];
            //     this.thirdPartyRsltHId = response['ThirdPartyRsltHId'];
            //     let reqLatestJson = JSON.parse(response['ReqJson']);
            //     if (reqLatestJson != null && reqLatestJson != "") {
            //       this.latestCheckChassisNo = reqLatestJson['AppAssetObj'][0]['SerialNo1'];
            //     }
            //   }
            // );
            if (this.lobKta.includes(this.returnLobCode) == true) {
              this.LeadDataForm.controls['DownPaymentPercent'].clearValidators();
              this.LeadDataForm.controls['DownPaymentPercent'].updateValueAndValidity();

              this.LeadDataForm.controls['DownPaymentAmount'].clearValidators();
              this.LeadDataForm.controls['DownPaymentAmount'].updateValueAndValidity();

              this.LeadDataForm.controls['AssetPrice'].clearValidators();
              this.LeadDataForm.controls['AssetPrice'].updateValueAndValidity();

              this.InputLookupAssetObj.isRequired = false;
            }

            this.InputLookupAssetObj.isReady = true;
            this.isDataLoad = true;
          }
        );
      }
    );

    this.assetConditionObj = new RefMasterObj();
    this.assetConditionObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetCondition;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.assetConditionObj).subscribe(
      (response) => {
        this.returnAssetConditionObj = response[CommonConstant.ReturnObj];
        this.LeadDataForm.patchValue({ MrAssetConditionCode: response[CommonConstant.ReturnObj][0]['Key'] });

        if (response[CommonConstant.ReturnObj][0]['Key'] == CommonConstant.AssetConditionUsed) {
          this.isUsed = true;
        } else {
          this.isUsed = false;
        }
      }
    );

    this.downPaymentObj = new RefMasterObj();
    this.downPaymentObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeDownPaymentType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.downPaymentObj).subscribe(
      (response) => {
        this.returnDownPaymentObj = response[CommonConstant.ReturnObj];
        this.LeadDataForm.patchValue({ MrDownPaymentTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.firstInstObj = new RefMasterObj();
    this.firstInstObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeFirstInstType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.firstInstObj).subscribe(
      (response) => {
        this.returnFirstInstObj = response[CommonConstant.ReturnObj];
        this.LeadDataForm.patchValue({ MrFirstInstTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );




      this.reqLeadAssetObj = new LeadAssetObj();
      this.reqLeadAssetObj.LeadId = this.LeadId;
      this.reqLeadAppObj = new LeadAppObj();
      this.reqLeadAppObj.LeadId = this.LeadId;
      let obj = {
        Id: this.LeadId
      }
      let isCopyFrom: boolean = false;
      if (this.CopyFrom != null) {
        this.reqLeadAssetObj.LeadId = this.LeadId;
        this.reqLeadAppObj.LeadId = this.CopyFrom;
        obj.Id = this.CopyFrom;
        isCopyFrom = true;
      }

      this.GetLeadAppByLeadId(obj, isCopyFrom);
      this.GetLeadAssetByLeadId(obj, isCopyFrom);
    }

    ngAfterViewInit() {
      this.collapsOnInit();
    }

    GetLeadAssetByLeadId(getObj, isCopyFrom: boolean) {
      this.http.post(URLConstant.GetLeadAssetByLeadId, getObj).subscribe(
        (response: LeadAssetObj) => {
          this.resLeadAssetObj = response;
          if (this.resLeadAssetObj.MrAssetConditionCode == CommonConstant.AssetConditionUsed) {
            this.isUsed = true;
          } else {
            this.isUsed = false;
          }
          if (this.resLeadAssetObj.LeadAssetId != 0) {
            this.LeadDataForm.patchValue({
              MrDownPaymentTypeCode: this.resLeadAssetObj.MrDownPaymentTypeCode,
              MrAssetConditionCode: this.resLeadAssetObj.MrAssetConditionCode,
              ManufacturingYear: this.resLeadAssetObj.ManufacturingYear,
              AssetPrice: this.resLeadAssetObj.AssetPriceAmt == null ? '' : this.resLeadAssetObj.AssetPriceAmt,
              DownPaymentAmount: this.resLeadAssetObj.DownPaymentAmt == null ? '' : this.resLeadAssetObj.DownPaymentAmt,
              DownPaymentPercent: this.resLeadAssetObj.DownPaymentPrcnt == null ? '' : this.resLeadAssetObj.DownPaymentPrcnt
            });
          }
          this.DownPaymentChange(isCopyFrom);

          this.reqAssetMasterObj = new AssetMasterObj();
          this.reqAssetMasterObj.FullAssetCode = this.resLeadAssetObj.FullAssetCode;
          let codeObj = {
            Code: this.reqAssetMasterObj.FullAssetCode
          }
          this.http.post(URLConstant.GetAssetMasterForLookup, codeObj).subscribe(
            (response: AssetMasterObj) => {
              this.resAssetMasterObj = response;

              this.InputLookupAssetObj.nameSelect = this.resAssetMasterObj.FullAssetName;
              this.InputLookupAssetObj.jsonSelect = this.resAssetMasterObj;
              this.LeadDataForm.patchValue({
                FullAssetCode: this.resAssetMasterObj.FullAssetCode,
                FullAssetName: this.resAssetMasterObj.FullAssetName,
              });
              this.assetTypeId = this.resAssetMasterObj.AssetTypeId;
              let obj = {
                Id: this.resAssetMasterObj.AssetTypeId
              }
              this.http.post(URLConstant.GetAssetTypeById, obj).subscribe(
                (response: AssetTypeObj) => {

                  let AssetTypeCode = { Code: response.AssetTypeCode };
                  this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, AssetTypeCode).subscribe(
                    (response: GenericListObj) => {
                      while (this.items.length) {
                        this.items.removeAt(0);
                      }
                      let SerialNoList = response[CommonConstant.ReturnObj];
                      for (let i = 0; i < SerialNoList.length; i++) {
                        let eachDataDetail = this.fb.group({
                          SerialNoLabel: [SerialNoList[i].SerialNoLabel],
                          SerialNoValue: [''],
                          IsMandatory: [SerialNoList[i].IsMandatory]
                        }) as FormGroup;
                        this.items.push(eachDataDetail);
                        if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
                          // this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
                          this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
                        }
                        if (this.items.controls[0] != null) {
                          this.items['controls'][0].patchValue({
                            SerialNoValue: this.resLeadAssetObj.SerialNo1,
                          });
                        }
                        if (this.items.controls[1] != null) {
                          this.items['controls'][1].patchValue({
                            SerialNoValue: this.resLeadAssetObj.SerialNo2,
                          });
                        }
                        if (this.items.controls[2] != null) {
                          this.items['controls'][2].patchValue({
                            SerialNoValue: this.resLeadAssetObj.SerialNo3,
                          });
                        }
                        if (this.items.controls[3] != null) {
                          this.items['controls'][3].patchValue({
                            SerialNoValue: this.resLeadAssetObj.SerialNo4,
                          });
                        }
                        if (this.items.controls[4] != null) {
                          this.items['controls'][4].patchValue({
                            SerialNoValue: this.resLeadAssetObj.SerialNo4,
                          });
                        }
                      }
                      if (isCopyFrom) this.isAssetReady = true;
                    });
                });
            });
        });
    }

    GetLeadAppByLeadId(obj, isCopyFrom: boolean) {
      this.http.post(URLConstant.GetLeadAppByLeadId, obj).toPromise().then(
        (response: LeadAppObj) => {
          this.resLeadAppObj = response;
          if (isCopyFrom) {
            if (this.resLeadAppObj.LeadAppId == 0) return;
          }
          this.LeadDataForm.patchValue({
            Tenor: this.resLeadAppObj.Tenor,
            MrFirstInstTypeCode: this.resLeadAppObj.MrFirstInstTypeCode != null ? this.resLeadAppObj.MrFirstInstTypeCode : this.returnFirstInstObj[0]['Key'],
            NTFAmt: this.resLeadAppObj.NtfAmt,
            TotalDownPayment: this.resLeadAppObj.TotalDownPaymentAmt,
            InstallmentAmt: this.resLeadAppObj.InstAmt,
          });
        });
  }

  SetAsset(event) {
    this.LeadDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName
    });
    this.assetTypeId = event.AssetTypeId;

    let obj = { Code: event.AssetTypeCode };
    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, obj).subscribe(
      (response: GenericListObj) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }
        let SerialNoList = response[CommonConstant.ReturnObj];
        for (let i = 0; i < SerialNoList.length; i++) {
          let eachDataDetail = this.fb.group({
            SerialNoLabel: [SerialNoList[i].SerialNoLabel],
            SerialNoValue: [''],
            IsMandatory: [SerialNoList[i].IsMandatory]
          }) as FormGroup;
          this.items.push(eachDataDetail);
          if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
            // this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }
      });

  }

  radioChange(event) {
    if (event.target.value == CommonConstant.AssetConditionUsed) {
      this.isUsed = true;
    } else {
      this.isUsed = false;
    }
    for (let i = 0; i < this.items["length"]; i++) {
      if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
        this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
      } else {
        this.items.controls[i]['controls']['SerialNoValue'].clearValidators();
        this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
      }
    }
  }

  DownPaymentChange(isCopyFrom: boolean) {
    let valueToCheck = this.resLeadAssetObj.MrDownPaymentTypeCode;
    if (isCopyFrom) valueToCheck = this.LeadDataForm.controls["MrDownPaymentTypeCode"].value;
    if (valueToCheck == CommonConstant.DownPaymentTypeAmt) {
      this.LeadDataForm.controls.DownPaymentPercent.disable();
      this.LeadDataForm.controls.DownPaymentAmount.enable();
    }
    else {
      this.LeadDataForm.controls.DownPaymentPercent.enable();
      this.LeadDataForm.controls.DownPaymentAmount.disable();
    }
  }

  DPAmtChange() {
    this.Calculate = false;
    this.DPAmount = this.LeadDataForm.controls["DownPaymentAmount"].value;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;
    this.DPPercentage = this.DPAmount / this.AssetPrice * 100;
    this.LeadDataForm.patchValue({
      DownPaymentPercent: this.DPPercentage,
    });
  }

  DPPrcntChange() {
    this.Calculate = false;
    this.DPPercentage = this.LeadDataForm.controls["DownPaymentPercent"].value;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;
    this.DPAmount = this.AssetPrice * this.DPPercentage / 100;
    this.LeadDataForm.patchValue({
      DownPaymentAmount: this.DPAmount,
    });
  }

  AssetPriceChange() {
    this.Calculate = false;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;
    this.DPAmount = this.LeadDataForm.controls["DownPaymentAmount"].value;
    this.DPPercentage = this.LeadDataForm.controls["DownPaymentPercent"].value;


    if (this.typePage != "update") {
      this.LeadDataForm.controls['DownPaymentAmount'].clearValidators();
      //this.LeadDataForm.controls['DownPaymentAmount'].setValidators([Validators.required, Validators.min(1.00), Validators.max(this.AssetPrice)]);
      this.LeadDataForm.controls['DownPaymentAmount'].updateValueAndValidity();
    }


    if (this.LeadDataForm.controls["MrDownPaymentTypeCode"].value == CommonConstant.DownPaymentTypeAmt) {
      this.DPPercentage = this.DPAmount / this.AssetPrice * 100;

      this.LeadDataForm.patchValue({
        DownPaymentPercent: this.DPPercentage,
      });
    }
    else {
      this.DPAmount = this.AssetPrice * this.DPPercentage / 100;

      this.LeadDataForm.patchValue({
        DownPaymentAmount: this.DPAmount,
      });
    }
  }

  FirstInstChange() {
    this.Calculate = false;
    this.LeadDataForm.patchValue({
      NTFAmt: '',
      TotalDownPayment: '',
      InstallmentAmt: '',
    });
  }

  TenorChange() {
    this.Calculate = false;
    this.LeadDataForm.patchValue({
      InstallmentAmt: this.NTFAmt / this.Tenor,
    });
  }

  calculateNonKta() {
    this.Tenor = this.LeadDataForm.controls["Tenor"].value;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;
    this.DPAmount = this.LeadDataForm.controls["DownPaymentAmount"].value;
    this.NTFAmt = this.AssetPrice - this.DPAmount;
    let minAmt = this.NTFAmt / this.Tenor;
    if (!this.LeadDataForm.controls["InstallmentAmt"].value || this.LeadDataForm.controls["InstallmentAmt"].value < minAmt) this.LeadDataForm.patchValue({ InstallmentAmt: minAmt });
    this.InstAmt = this.LeadDataForm.controls["InstallmentAmt"].value;

    if (this.NTFAmt && this.InstAmt > this.NTFAmt) {
      this.toastr.warningMessage("Installment Amount cannot be bigger than NTF Amount");
      return;
    }

    if (this.AssetPrice <= 0) {
      this.toastr.warningMessage("Please input Asset Price!");
      return;
    }
    if (this.DPAmount > this.AssetPrice) {
      this.toastr.warningMessage("Down Payment Amount Must Be Lower Than Asset Price!");
      return;
    }
    if (this.DPAmount <= 0) {
      this.toastr.warningMessage("Please input Down Payment Amount!");
      return;
    }
    if (this.Tenor == null || this.Tenor == undefined) {
      this.toastr.warningMessage("Fill The Tenor First!");
      return;
    }

    this.LeadDataForm.patchValue({
      NTFAmt: this.NTFAmt
    });

    if (this.LeadDataForm.controls["MrFirstInstTypeCode"].value == CommonConstant.FirstInstTypeAdvance) {
      this.TotalDownPayment = this.DPAmount + this.InstAmt;
    }
    else {
      this.TotalDownPayment = this.DPAmount;
    }
    this.LeadDataForm.patchValue({
      TotalDownPayment: this.TotalDownPayment
    });

    this.Calculate = true;
  }

  calculateKta() {
    this.Tenor = this.LeadDataForm.controls["Tenor"].value;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;
    this.DPAmount = this.LeadDataForm.controls["DownPaymentAmount"].value;
    this.NTFAmt = this.LeadDataForm.controls["NTFAmt"].value;
    let minAmt = this.NTFAmt / this.Tenor;

    if (this.Tenor == 0 || (this.Tenor == null)) {
      this.toastr.warningMessage("Fill The Tenor First!");
      return;
    }
    if (!this.LeadDataForm.controls["InstallmentAmt"].value) this.LeadDataForm.patchValue({ InstallmentAmt: minAmt });
    this.InstAmt = this.LeadDataForm.controls["InstallmentAmt"].value;


    if (this.DPAmount > this.AssetPrice) {
      this.toastr.warningMessage("Down Payment Amount Must Be Lower Than Asset Price!");
      return;
    }

    if (this.NTFAmt && this.InstAmt > this.NTFAmt) {
      this.toastr.warningMessage("Installment Amount cannot be bigger than NTF Amount");
      return;
    }
    if (this.LeadDataForm.controls.InstallmentAmt.value < minAmt) {
      this.toastr.warningMessage("Installment Amount must be bigger than " + minAmt);
      return;
    } else {
      if (this.LeadDataForm.controls["MrFirstInstTypeCode"].value == CommonConstant.FirstInstTypeAdvance) {
        this.TotalDownPayment = this.DPAmount + this.InstAmt;
      }
      else {
        this.TotalDownPayment = this.DPAmount;
      }
      this.LeadDataForm.patchValue({
        TotalDownPayment: this.TotalDownPayment
      });
    }
    this.Calculate = true;
  }

  setLeadAsset() {
    this.leadInputLeadDataObj.LeadAssetObj.LeadId = this.LeadId;
    if (this.LeadDataForm.controls["FullAssetCode"].value == null || this.LeadDataForm.controls["FullAssetCode"].value == "" || this.LeadDataForm.controls["FullAssetCode"].value == "-") {
      this.LeadDataForm.patchValue({
        FullAssetCode: "-",
      });
    }
    if (this.LeadDataForm.controls["FullAssetName"].value == null || this.LeadDataForm.controls["FullAssetName"].value == "" || this.LeadDataForm.controls["FullAssetName"].value == "-") {
      this.LeadDataForm.patchValue({
        FullAssetName: "-",
      });
    }
    this.leadInputLeadDataObj.LeadAssetObj.FullAssetCode = this.LeadDataForm.controls["FullAssetCode"].value;
    this.leadInputLeadDataObj.LeadAssetObj.FullAssetName = this.LeadDataForm.controls["FullAssetName"].value;
    this.leadInputLeadDataObj.LeadAssetObj.MrDownPaymentTypeCode = this.LeadDataForm.controls["MrDownPaymentTypeCode"].value;
    this.leadInputLeadDataObj.LeadAssetObj.MrAssetConditionCode = this.LeadDataForm.controls["MrAssetConditionCode"].value;
    this.leadInputLeadDataObj.LeadAssetObj.ManufacturingYear = this.LeadDataForm.controls["ManufacturingYear"].value;
    this.leadInputLeadDataObj.LeadAssetObj.AssetPriceAmt = this.LeadDataForm.controls["AssetPrice"].value;
    this.leadInputLeadDataObj.LeadAssetObj.DownPaymentAmt = this.LeadDataForm.controls["DownPaymentAmount"].value;
    this.leadInputLeadDataObj.LeadAssetObj.DownPaymentPrcnt = this.LeadDataForm.controls["DownPaymentPercent"].value;
    this.leadInputLeadDataObj.LeadAssetObj.AssetSeqNo = 1;
    if (this.items.controls[0] != null) {
      this.leadInputLeadDataObj.LeadAssetObj.SerialNo1 = this.items.controls[0]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[1] != null) {
      this.leadInputLeadDataObj.LeadAssetObj.SerialNo2 = this.items.controls[1]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[2] != null) {
      this.leadInputLeadDataObj.LeadAssetObj.SerialNo3 = this.items.controls[2]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[3] != null) {
      this.leadInputLeadDataObj.LeadAssetObj.SerialNo4 = this.items.controls[3]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[4] != null) {
      this.leadInputLeadDataObj.LeadAssetObj.SerialNo5 = this.items.controls[4]["controls"]["SerialNoValue"].value;
    }

  }

  setLeadApp() {
    this.leadInputLeadDataObj.LeadAppObj.LeadId = this.LeadId;
    this.leadInputLeadDataObj.LeadAppObj.Tenor = this.LeadDataForm.controls["Tenor"].value;
    this.leadInputLeadDataObj.LeadAppObj.MrFirstInstTypeCode = this.LeadDataForm.controls["MrFirstInstTypeCode"].value;
    this.leadInputLeadDataObj.LeadAppObj.NtfAmt = this.LeadDataForm.controls["NTFAmt"].value;
    this.leadInputLeadDataObj.LeadAppObj.TotalDownPaymentAmt = this.LeadDataForm.controls["TotalDownPayment"].value;
    this.leadInputLeadDataObj.LeadAppObj.InstAmt = this.LeadDataForm.controls["InstallmentAmt"].value;
  }

  postLeadData(url: string) {
    this.http.post(url, this.leadInputLeadDataObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        if (this.originPage == "teleVerif") {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
        }
        else {
          this.SaveForm();
        }
      });
  }

  save() {
    if (this.resLeadAppObj.LeadAppId != 0 && this.resLeadAssetObj.LeadAssetId != 0) {
      this.typePage = "edit";
    }
    if (this.Calculate == false && this.returnLobCode != CommonConstant.CFNA) {
    } else {
      this.CheckSubmitForCFNA();
      if (!this.isAbleToSubmit) return;
    }

    if (this.LeadDataForm.status == CommonConstant.INVALID_FORM) {
      return;
    }

    if (this.typePage == "edit" || this.typePage == "update") {
      if (this.resLeadAssetObj.LeadAssetId != 0 && this.lobKta.includes(this.returnLobCode) == false) {
        this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
        this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
        this.setLeadAsset();
        this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
        this.setLeadApp();
        if (this.confirmFraudCheck()) {
          this.postLeadData(URLConstant.EditLeadData);
        }
      }
      else {
        if (this.lobKta.includes(this.returnLobCode) == true) {
          if (this.resLeadAppObj.LeadAppId != 0) {
            this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
            this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
            this.setLeadApp();
            this.postLeadData(URLConstant.EditLeadDataKta);
          }
          else {
            this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
            this.setLeadApp();
            this.postLeadData(URLConstant.AddLeadDataKta);
          }
        }
        else {
          if (this.LeadDataForm.controls["ManufacturingYear"].value > this.year) {
            this.toastr.warningMessage("Manufacturing Year must be lower or equal than current year.");
            return;
          }
          this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
          this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
          this.setLeadAsset();
          this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
          this.setLeadApp();
          if (this.confirmFraudCheck()) {
            this.postLeadData(URLConstant.EditLeadData);
          }
        }

      }
    }
    else {
      if (this.lobKta.includes(this.returnLobCode) == true) {
        if (this.resLeadAppObj.LeadAppId != 0) {
          this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
          this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
          this.setLeadApp();
          this.postLeadData(URLConstant.EditLeadDataKta);
        }
        else {
          this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
          this.setLeadApp();
          this.postLeadData(URLConstant.AddLeadDataKta);
        }
      }
      else {
        this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
        this.setLeadAsset();
        this.setLeadApp();
        if (this.leadInputLeadDataObj.LeadAssetObj.FullAssetCode == '') {
          this.SaveForm();
          return;
        }

        if (this.confirmFraudCheck()) {
          this.postLeadData(URLConstant.AddLeadData);
        }
      }

    }
  }

  confirmFraudCheck() {
    if (this.isNeedCheckBySystem == "0" && this.leadInputLeadDataObj.LeadAssetObj.SerialNo1 != this.latestCheckChassisNo && this.leadInputLeadDataObj.LeadAssetObj.MrAssetConditionCode == CommonConstant.AssetConditionUsed) {
      if (confirm("Recent Chassis No different with previous Chassis No. Are you sure want to submit without fraud check again?")) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }

  SaveForm() {
    let urlPost = environment.isCore ? URLConstant.SubmitWorkflowSimpleLeadInputV2 : URLConstant.SubmitWorkflowSimpleLeadInput;

    if (this.resLeadAppObj.LeadAppId != 0 && this.resLeadAssetObj.LeadAssetId != 0) {
      this.typePage = "edit";
    }
    if (this.Calculate == false && this.returnLobCode != CommonConstant.CFNA) {
    } else {
      this.CheckSubmitForCFNA();
      if (!this.isAbleToSubmit) return;
    }

    if (this.LeadDataForm.status == CommonConstant.INVALID_FORM) {
      return;
    }
    this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
    this.leadInputLeadDataObj.WfTaskListId = this.WfTaskListId;
    this.setLeadApp();
    if (this.typePage == "edit" || this.typePage == "update") {
      this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
      if (this.resLeadAssetObj.LeadAssetId != 0) {
        this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
        this.setLeadAsset();
        if (this.originPage == "teleVerif") {
          if (this.confirmFraudCheck()) {
            this.http.post(urlPost, this.leadInputLeadDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
              }
            );
          }
        }
        else if (this.typePage == "update") {

          this.outputTab.emit({
            stepMode: "next",
            LeadInputLeadDataObj: this.leadInputLeadDataObj,
            urlPost: urlPost,
            // Self Custom Changes
            paging: NavigationConstantDsf.SIMPLE_LEAD_PAGING_DSF,
            // End Self Custom Changes
            typePage: this.typePage,
            originPage: this.originPage,
            resLeadAssetObj: this.resLeadAssetObj,
            lobKta: this.lobKta,
            returnLobCode: this.returnLobCode,
            WfTaskListId: this.WfTaskListId
          });

        }
        else {
          this.outputTab.emit({
            stepMode: "next",
            LeadInputLeadDataObj: this.leadInputLeadDataObj,
            urlPost: urlPost,
            // Self Custom Changes
            paging: NavigationConstantDsf.SIMPLE_LEAD_PAGING_DSF,
            // End Self Custom Changes
            typePage: this.typePage,
            originPage: this.originPage,
            resLeadAssetObj: this.resLeadAssetObj,
            lobKta: this.lobKta,
            returnLobCode: this.returnLobCode,
            WfTaskListId: this.WfTaskListId
          });
        }
      }
      else {
        if (this.lobKta.includes(this.returnLobCode) == true) {
          this.leadInputLeadDataObj.IsKta = true;
          //this.setLeadAsset();
          if (this.originPage == "teleVerif") {
            this.http.post(urlPost, this.leadInputLeadDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
              }
            );
          }
          else {
            this.outputTab.emit({ stepMode: "next", LeadInputLeadDataObj: this.leadInputLeadDataObj, urlPost: urlPost });
          }
        }
        else {
          if (this.LeadDataForm.controls["ManufacturingYear"].value > this.year) {
            this.toastr.warningMessage("Manufacturing Year must be lower or equal than current year.");
            return;
          }
          this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
          this.setLeadAsset();
          if (this.originPage == "teleVerif") {
            if (this.confirmFraudCheck()) {
              this.http.post(urlPost, this.leadInputLeadDataObj).subscribe(
                (response) => {
                  this.toastr.successMessage(response["message"]);
                  AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
                }
              );
            }
          }
          else {
            this.outputTab.emit({ stepMode: "next", LeadInputLeadDataObj: this.leadInputLeadDataObj, urlPost: urlPost });
          }
        }
      }
    }
    else {
      if (this.lobKta.includes(this.returnLobCode) == true) {
        this.leadInputLeadDataObj.IsKta = true;
        //this.setLeadAsset();
        if (this.originPage == "teleVerif") {
          this.http.post(urlPost, this.leadInputLeadDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
            }
          );
        }
        else {
          this.outputTab.emit({ stepMode: "next", LeadInputLeadDataObj: this.leadInputLeadDataObj, urlPost: urlPost });
        }
      }
      else {
        this.setLeadAsset();
        if (this.originPage == "teleVerif") {

          if (this.confirmFraudCheck()) {
            this.http.post(urlPost, this.leadInputLeadDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
              }
            );
          }
        }
        else {
          this.outputTab.emit({ stepMode: "next", LeadInputLeadDataObj: this.leadInputLeadDataObj, urlPost: urlPost });
        }
      }
    }
  }

  InstAmtCheck() {
    if (this.returnLobCode != CommonConstant.CFNA) {
      this.Calculate = false;
      this.InstAmt = this.LeadDataForm.controls.InstallmentAmt.value;
      this.LeadDataForm.patchValue({
        InstallmentAmt: this.InstAmt,
      });
    }
  }


  checkRapindo() {
    if (this.isNeedCheckBySystem == "0") {
      if (this.LeadDataForm.controls.items.value[0]['SerialNoLabel'] == CommonConstant.Chassis_No && this.LeadDataForm.controls.items.value[0]['SerialNoValue'] != "") {

        this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
        this.setLeadAsset();
        this.http.post(URLConstant.CheckRapindo, this.leadInputLeadDataObj).subscribe(
          (response1) => {
            this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
              (response) => {
                this.latestReqDtCheckRapindo = response['ReqDt'];
                this.thirdPartyRsltHId = response['ThirdPartyRsltHId'];
                let reqLatestJson = JSON.parse(response['ReqJson']);
                if (reqLatestJson != null && reqLatestJson != "") {
                  this.latestCheckChassisNo = reqLatestJson['AppAssetObj'][0]['SerialNo1'];
                }
              }
            );
          }
        );
      }

    }
  }

  CheckSubmitForCFNA() {
    let minAmt = this.LeadDataForm.controls["NTFAmt"].value / this.LeadDataForm.controls["Tenor"].value;
    if (this.LeadDataForm.controls.InstallmentAmt.value < minAmt) {
      this.toastr.warningMessage("Installment Amount must be bigger than " + minAmt);
      this.isAbleToSubmit = false;
      return;
    } else if (this.LeadDataForm.controls["InstallmentAmt"].value > this.LeadDataForm.controls["NTFAmt"].value) {
      this.toastr.warningMessage("Installment Amount cannot be bigger than NTF Amount");
      this.isAbleToSubmit = false;
      return;
    } else {
      this.isAbleToSubmit = true;
    }
  }

  Cancel(){
    this.outputCancel.emit();
  }

  collapsOnInit() {
    //handle icon
    const assetDataIdElement = this.elementRef.nativeElement.querySelector("#assetDataId");
    const iassetDataIdTag = assetDataIdElement.querySelector('i');

    if (iassetDataIdTag) {
      iassetDataIdTag.className = iassetDataIdTag.className.replace('fa-chevron-down', 'fa-chevron-right');
    }

    const financialDataIdElement = this.elementRef.nativeElement.querySelector("#financialDataId");
    const ifinancialDataIdTag = financialDataIdElement.querySelector('i');
    if (ifinancialDataIdTag) {
      ifinancialDataIdTag.className = ifinancialDataIdTag.className.replace('fa-chevron-down', 'fa-chevron-right');
    }

    // handle modal
    const assetDataElement = this.elementRef.nativeElement.querySelector("#assetData");
    if (assetDataElement) {
      this.renderer.setStyle(assetDataElement, 'display', 'none');
    }

    const financialDataElement = this.elementRef.nativeElement.querySelector("#financialData");
    if (financialDataElement) {
      this.renderer.setStyle(financialDataElement, 'display', 'none');
    }
  }
}
