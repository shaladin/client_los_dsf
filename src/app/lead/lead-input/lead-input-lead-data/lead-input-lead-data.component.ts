import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AssetTypeObj } from 'app/shared/model/AssetTypeObj.Model';
import { LeadInputLeadDataObj } from 'app/shared/model/LeadInputLeadDataObj.Model';
import { LeadAppObj } from 'app/shared/model/LeadAppObj.Model';
import { LeadAssetObj } from 'app/shared/model/LeadAssetObj.Model';
import { AssetMasterObj } from 'app/shared/model/AssetMasterObj.Model';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ThirdPartyRsltHObj } from 'app/shared/model/ThirdPartyRsltHObj.Model';
import { ThirdPartyResultHForFraudChckObj } from 'app/shared/model/ThirdPartyResultHForFraudChckObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';


@Component({
  selector: 'app-lead-input-lead-data',
  templateUrl: './lead-input-lead-data.component.html',
  providers: [NGXToastrService]
})

export class LeadInputLeadDataComponent implements OnInit {
  @Input() originPage: string = "";
  @Output() outputTab: EventEmitter<object> = new EventEmitter();
  typePage: string = "";
  CopyFrom: string;
  LeadId: string;
  assetConditionObj: RefMasterObj;
  returnAssetConditionObj: [];
  downPaymentObj: RefMasterObj;
  returnDownPaymentObj: [];
  firstInstObj: RefMasterObj;
  returnFirstInstObj: any;
  isNeedCheckBySystem: string;
  checkRapindoUrl: string;
  latestReqDtCheckRapindo: string;
  getThirdPartyResultHByTrxTypeCodeAndTrxNo: string;
  leadNo: string;
  reqLatestJson: any;
  latestCheckChassisNo: any;
  isAssetReady: boolean =false;
  InputLookupAssetObj: InputLookupObj;
  getListActiveRefMasterUrl: string;
  assetTypeId: string;
  leadInputLeadDataObj: LeadInputLeadDataObj;
  addEditLeadData: string;
  getLeadAssetByLeadId: string;
  getLeadAppByLeadId: string;
  getAssetMasterForLookupEmployee: string;
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
  resLeadAssetObj: any;
  reqLeadAppObj: LeadAppObj;
  resLeadAppObj: any;
  reqAssetMasterObj: AssetMasterObj;
  resAssetMasterObj: any;
  isUsed: boolean;
  LeadDataForm = this.fb.group({
    FullAssetCode: [''],
    FullAssetName: [''],
    MrAssetConditionCode: [''],
    MrDownPaymentTypeCode: [''],
    ManufacturingYear: ['', Validators.min(0)],
    AssetPrice: ['', [Validators.required, Validators.min(1.00)]],
    DownPaymentAmount: ['', [Validators.required]],
    DownPaymentPercent: ['', [Validators.min(1.00), Validators.max(100.00)]],
    Tenor: ['', [Validators.required, Validators.min(0)]],
    MrFirstInstTypeCode: ['', Validators.required],
    NTFAmt: [''],
    TotalDownPayment: [''],
    InstallmentAmt: ['', Validators.required],
    items: this.fb.array([]),
  });
  getListGeneralSettingByListGsCode: string;
  getLeadByLeadId: string;
  submitWorkflowLeadInput: string;
  generalSettingObj: GeneralSettingObj;
  returnGeneralSettingObj: any;
  lobKta = new Array();
  leadObj: LeadObj;
  returnLeadObj: any;
  returnLobCode: string;
  WfTaskListId: number;
  editLead: string;
  editLeadObj: LeadObj;
  InstAmt: number;
  TotalDownPayment: number;
  AssetPrice: number;
  NTFAmt: number;
  Calculate: boolean = false;
  DPAmount: number;
  DPPercentage: number;
  year: number = new Date().getFullYear();
  Tenor
  isDataLoad: boolean = false;
  SerialNoList: any;
  items: FormArray;
  isAbleToSubmit: boolean = false;
  thirdPartyRsltHId: string;
  getThirdPartyResultHForFraudChecking: string;
  thirdPartyObj: ThirdPartyResultHForFraudChckObj;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.getListActiveRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.addEditLeadData = URLConstant.AddEditLeadData;
    this.getLeadAssetByLeadId = URLConstant.GetLeadAssetByLeadId;
    this.getLeadAppByLeadId = URLConstant.GetLeadAppByLeadId;
    this.getAssetMasterForLookupEmployee = URLConstant.GetAssetMasterForLookupEmployee;
    this.getListGeneralSettingByListGsCode = URLConstant.GetListGeneralSettingByListGsCode;
    this.getThirdPartyResultHByTrxTypeCodeAndTrxNo = URLConstant.GetThirdPartyResultHByTrxTypeCodeAndTrxNo;
    this.checkRapindoUrl = URLConstant.CheckRapindo;
    this.getLeadByLeadId = URLConstant.GetLeadByLeadId;
    this.editLead = URLConstant.EditLead;
    this.submitWorkflowLeadInput = URLConstant.SubmitWorkflowLeadInput;
    this.getThirdPartyResultHForFraudChecking = URLConstant.GetThirdPartyResultHForFraudChecking;
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      if (params["mode"] != null) {
        this.typePage = params["mode"];
      }
      if (params["WfTaskListId"] == null) {
        this.WfTaskListId = 0;
      }
      else {
        this.WfTaskListId = params["WfTaskListId"];
      }
      if (params["CopyFrom"] != null) {
        this.CopyFrom = params["CopyFrom"];
      }
    });
  }

  SetAsset(event) {
    this.LeadDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName
    });
    this.assetTypeId = event.AssetTypeId;

    var AssetTypeCode = { 'AssetTypeCode': event.AssetTypeCode };
    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, AssetTypeCode).subscribe(
      (response: any) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }
        this.SerialNoList = response[CommonConstant.ReturnObj];
        for (var i = 0; i < this.SerialNoList["length"]; i++) {
          var eachDataDetail = this.fb.group({
            SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
            SerialNoValue: [''],
            IsMandatory: [this.SerialNoList[i].IsMandatory]
          }) as FormGroup;
          this.items.push(eachDataDetail);
          if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
            this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }
      });

  }

  // downPaymentChange(event) {
  //   this.LeadDataForm.patchValue({
  //     MrDownPaymentTypeCode: event.value,
  //   });
  // }

  radioChange(event) {
    if (event.target.value == CommonConstant.AssetConditionUsed) {
      this.isUsed = true;
    } else {
      this.isUsed = false;
    }
    for (var i = 0; i < this.items["length"]; i++) {
      if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
        this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
        this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
      } else {
        this.items.controls[i]['controls']['SerialNoValue'].clearValidators();
        this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
      }
    }
  }

  ngOnInit() {
    this.items = this.LeadDataForm.get('items') as FormArray;

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/Lead/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/Lead/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/Lead/lookupAsset.json";

    this.generalSettingObj = new GeneralSettingObj();
    this.generalSettingObj.ListGsCode.push("LOB_KTA");
    this.generalSettingObj.ListGsCode.push("INTEGRATOR_CHECK_BY_SYSTEM");

    this.http.post(this.getListGeneralSettingByListGsCode, this.generalSettingObj).subscribe(
      (response) => {
        this.returnGeneralSettingObj = response;
        this.lobKta = this.returnGeneralSettingObj["ResponseGeneralSettingObj"][0].GsValue.split(',');
        this.isNeedCheckBySystem = this.returnGeneralSettingObj["ResponseGeneralSettingObj"][1].GsValue;
        this.leadObj = new LeadObj();
        this.leadObj.LeadId = this.LeadId;
        this.http.post(this.getLeadByLeadId, this.leadObj).subscribe(
          (response) => {
            this.returnLeadObj = response;
            this.leadNo = response['LeadNo'];
            this.returnLobCode = response['LobCode'];
            this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
            this.thirdPartyObj.TrxTypeCode = CommonConstant.LEAD_TRX_TYPE_CODE;
            this.thirdPartyObj.TrxNo = this.leadNo;
            this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_ASSET;
            this.http.post(this.getThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
              (response) => {
                this.latestReqDtCheckRapindo = response['ReqDt'];
                this.thirdPartyRsltHId = response['ThirdPartyRsltHId'];
                this.reqLatestJson = JSON.parse(response['ReqJson']);
                if(this.reqLatestJson != null && this.reqLatestJson != "" ){
                  this.latestCheckChassisNo = this.reqLatestJson['AppAssetObj'][0]['SerialNo1'];
                }
              }
            );
            if (this.lobKta.includes(this.returnLobCode) == true) {
              this.LeadDataForm.controls['NTFAmt'].setValidators([Validators.required]);

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
    this.http.post(this.getListActiveRefMasterUrl, this.assetConditionObj).subscribe(
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
    this.http.post(this.getListActiveRefMasterUrl, this.downPaymentObj).subscribe(
      (response) => {
        this.returnDownPaymentObj = response[CommonConstant.ReturnObj];
        this.LeadDataForm.patchValue({ MrDownPaymentTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.firstInstObj = new RefMasterObj();
    this.firstInstObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeFirstInstType;
    this.http.post(this.getListActiveRefMasterUrl, this.firstInstObj).subscribe(
      (response) => {
        this.returnFirstInstObj = response[CommonConstant.ReturnObj];
        this.LeadDataForm.patchValue({ MrFirstInstTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );



    if (this.CopyFrom != null) {
      this.reqLeadAssetObj = new LeadAssetObj();
      this.reqLeadAssetObj.LeadId = this.CopyFrom;
      this.http.post(this.getLeadAssetByLeadId, this.reqLeadAssetObj).subscribe(
        (response) => {
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
              AssetPrice: this.resLeadAssetObj.AssetPriceAmt,
              DownPaymentAmount: this.resLeadAssetObj.DownPaymentAmt,
              DownPaymentPercent: this.resLeadAssetObj.DownPaymentPrcnt,
            });
          }

          this.reqAssetMasterObj = new AssetMasterObj();
          this.reqAssetMasterObj.FullAssetCode = this.resLeadAssetObj.FullAssetCode;
          this.http.post(this.getAssetMasterForLookupEmployee, this.reqAssetMasterObj).subscribe(
            (response) => {
              this.resAssetMasterObj = response;

              this.InputLookupAssetObj.nameSelect = this.resAssetMasterObj.FullAssetName;
              this.InputLookupAssetObj.jsonSelect = this.resAssetMasterObj;
              this.LeadDataForm.patchValue({
                FullAssetCode: this.resAssetMasterObj.FullAssetCode,
                FullAssetName: this.resAssetMasterObj.FullAssetName,
              });
              this.assetTypeId = this.resAssetMasterObj.AssetTypeId;
              var assetType = new AssetTypeObj();
              assetType.AssetTypeId = this.resAssetMasterObj.AssetTypeId;
              this.http.post(URLConstant.GetAssetTypeById, assetType).subscribe(
                (response: any) => {

                  var AssetTypeCode = { 'AssetTypeCode': response.AssetTypeCode };
                  this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, AssetTypeCode).subscribe(
                    (response: any) => {
                      while (this.items.length) {
                        this.items.removeAt(0);
                      }
                      this.SerialNoList = response[CommonConstant.ReturnObj];
                      for (var i = 0; i < this.SerialNoList["length"]; i++) {
                        var eachDataDetail = this.fb.group({
                          SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                          SerialNoValue: [''],
                          IsMandatory: [this.SerialNoList[i].IsMandatory]
                        }) as FormGroup;
                        this.items.push(eachDataDetail);
                        if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
                          this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
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
                      this.isAssetReady = true;
                    });
                });
            });
        });

      this.reqLeadAppObj = new LeadAppObj();
      this.reqLeadAppObj.LeadId = this.CopyFrom;
      this.http.post(this.getLeadAppByLeadId, this.reqLeadAppObj).subscribe(
        (response) => {
          this.resLeadAppObj = response;
          if (this.resLeadAppObj.LeadAppId != 0) {
            this.LeadDataForm.patchValue({
              Tenor: this.resLeadAppObj.Tenor,
              MrFirstInstTypeCode: this.resLeadAppObj.MrFirstInstTypeCode != null ? this.resLeadAppObj.MrFirstInstTypeCode : this.returnFirstInstObj[0]['Key'],
              NTFAmt: this.resLeadAppObj.NtfAmt,
              TotalDownPayment: this.resLeadAppObj.TotalDownPaymentAmt,
              InstallmentAmt: this.resLeadAppObj.InstAmt,
            });
          }
        });
    }
    if (this.typePage == "edit" || this.typePage == "update") {
      this.reqLeadAssetObj = new LeadAssetObj();
      this.reqLeadAssetObj.LeadId = this.LeadId;
      this.http.post(this.getLeadAssetByLeadId, this.reqLeadAssetObj).subscribe(
        (response) => {
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
              AssetPrice: this.resLeadAssetObj.AssetPriceAmt,
              DownPaymentAmount: this.resLeadAssetObj.DownPaymentAmt,
              DownPaymentPercent: this.resLeadAssetObj.DownPaymentPrcnt,
            });

            if (this.resLeadAssetObj.MrDownPaymentTypeCode == CommonConstant.DownPaymentTypeAmt) {
              this.LeadDataForm.controls.DownPaymentPercent.disable();
              this.LeadDataForm.controls.DownPaymentAmount.enable();
            }
            else {
              this.LeadDataForm.controls.DownPaymentPercent.enable();
              this.LeadDataForm.controls.DownPaymentAmount.disable();
            }

            // this.AssetSelected = true;

            this.reqAssetMasterObj = new AssetMasterObj();
            this.reqAssetMasterObj.FullAssetCode = this.resLeadAssetObj.FullAssetCode;
            this.http.post(this.getAssetMasterForLookupEmployee, this.reqAssetMasterObj).subscribe(
              (response) => {
                this.resAssetMasterObj = response;

                this.InputLookupAssetObj.nameSelect = this.resAssetMasterObj.FullAssetName;
                this.InputLookupAssetObj.jsonSelect = this.resAssetMasterObj;
                this.LeadDataForm.patchValue({
                  FullAssetCode: this.resAssetMasterObj.FullAssetCode,
                  FullAssetName: this.resAssetMasterObj.FullAssetName,
                });
                this.assetTypeId = this.resAssetMasterObj.AssetTypeId;
                var assetType = new AssetTypeObj();
                assetType.AssetTypeId = this.resAssetMasterObj.AssetTypeId;
                this.http.post(URLConstant.GetAssetTypeById, assetType).subscribe(
                  (response: any) => {

                    var AssetTypeCode = { 'AssetTypeCode': response.AssetTypeCode };
                    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, AssetTypeCode).subscribe(
                      (response: any) => {
                        while (this.items.length) {
                          this.items.removeAt(0);
                        }
                        this.SerialNoList = response[CommonConstant.ReturnObj];
                        for (var i = 0; i < this.SerialNoList["length"]; i++) {
                          var eachDataDetail = this.fb.group({
                            SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                            SerialNoValue: [''],
                            IsMandatory: [this.SerialNoList[i].IsMandatory]
                          }) as FormGroup;
                          this.items.push(eachDataDetail);
                          if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
                            this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
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
                      });
                  });
              });
            this.reqLeadAppObj = new LeadAppObj();
            this.reqLeadAppObj.LeadId = this.LeadId;
            this.http.post(this.getLeadAppByLeadId, this.reqLeadAppObj).subscribe(
              (response) => {
                this.resLeadAppObj = response;
                this.LeadDataForm.patchValue({
                  Tenor: this.resLeadAppObj.Tenor,
                  MrFirstInstTypeCode: this.resLeadAppObj.MrFirstInstTypeCode != null ? this.resLeadAppObj.MrFirstInstTypeCode : this.returnFirstInstObj[0]['Key'],
                  NTFAmt: this.resLeadAppObj.NtfAmt,
                  TotalDownPayment: this.resLeadAppObj.TotalDownPaymentAmt,
                  InstallmentAmt: this.resLeadAppObj.InstAmt,
                });
              });
          }
          else
            this.reqLeadAppObj = new LeadAppObj();
          this.reqLeadAppObj.LeadId = this.LeadId;
          this.http.post(this.getLeadAppByLeadId, this.reqLeadAppObj).subscribe(
            (response) => {
              this.resLeadAppObj = response;
              this.LeadDataForm.patchValue({
                Tenor: this.resLeadAppObj.Tenor,
                MrFirstInstTypeCode: this.resLeadAppObj.MrFirstInstTypeCode != null ? this.resLeadAppObj.MrFirstInstTypeCode : this.returnFirstInstObj[0]['Key'],
                NTFAmt: this.resLeadAppObj.NtfAmt,
                InstallmentAmt: this.resLeadAppObj.InstAmt,
              });
            });
        });
    }

  }

  DownPaymentChange() {
    if (this.LeadDataForm.controls["MrDownPaymentTypeCode"].value == CommonConstant.DownPaymentTypeAmt) {
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

    this.LeadDataForm.controls['DownPaymentAmount'].clearValidators();
    this.LeadDataForm.controls['DownPaymentAmount'].setValidators([Validators.required, Validators.min(1.00), Validators.max(this.AssetPrice)]);
    this.LeadDataForm.controls['DownPaymentAmount'].updateValueAndValidity();

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
    var minAmt = this.NTFAmt / this.Tenor;
    if (!this.LeadDataForm.controls["InstallmentAmt"].value) this.LeadDataForm.patchValue({ InstallmentAmt: minAmt });
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
    if (this.Tenor == '') {
      this.toastr.warningMessage("Fill The Tenor First!");
      return;
    }

    this.LeadDataForm.patchValue({
      NTFAmt: this.NTFAmt
    });

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

  calculateKta() {
    this.Tenor = this.LeadDataForm.controls["Tenor"].value;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;
    this.DPAmount = this.LeadDataForm.controls["DownPaymentAmount"].value;
    this.NTFAmt = this.LeadDataForm.controls["NTFAmt"].value;
    var minAmt = this.NTFAmt / this.Tenor;
    if (!this.LeadDataForm.controls["InstallmentAmt"].value) this.LeadDataForm.patchValue({ InstallmentAmt: minAmt });
    this.InstAmt = this.LeadDataForm.controls["InstallmentAmt"].value;

    if (this.NTFAmt && this.InstAmt > this.NTFAmt) {
      this.toastr.warningMessage("Installment Amount cannot be bigger than NTF Amount");
      return;
    }

    if (this.DPAmount > this.AssetPrice) {
      this.toastr.warningMessage("Down Payment Amount Must Be Lower Than Asset Price!");
      return;
    }
    if (this.Tenor == '') {
      this.toastr.warningMessage("Fill The Tenor First!");
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

  save() {
    if (this.Calculate == false && this.returnLobCode != CommonConstant.CFNA) {
      this.toastr.warningMessage("Calculate First");
      return;
    } else {
      this.CheckSubmitForCFNA();
      if (!this.isAbleToSubmit) return;
    }

    if (this.LeadDataForm.status == CommonConstant.INVALID_FORM) {
      return;
    }

    if (this.typePage == "edit" || this.typePage == "update") {
      if (this.resLeadAssetObj.LeadAssetId != 0) {
        this.leadInputLeadDataObj = new LeadInputLeadDataObj();
        this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
        this.setLeadAsset();
        this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
        this.setLeadApp();
        if(this.confirmFraudCheck()){
          this.http.post(this.addEditLeadData, this.leadInputLeadDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              if (this.originPage == "teleVerif") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
              }
              else if (this.typePage == "update") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
              }
              else {
                this.SaveForm();
              }
            });
        }
      }
      else {
        if (this.lobKta.includes(this.returnLobCode) == true) {
          this.leadInputLeadDataObj = new LeadInputLeadDataObj();
          this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
          //this.setLeadAsset();
          this.setLeadApp();
          this.http.post(URLConstant.AddEditLeadDataKta, this.leadInputLeadDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              if (this.originPage == "teleVerif") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
              }
              else if (this.typePage == "update") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
              }
              else {
                this.SaveForm();
              }
            }
          );
        }
        else {
          if (this.LeadDataForm.controls["ManufacturingYear"].value > this.year) {
            this.toastr.warningMessage("Manufacturing Year must be lower or equal than current year.");
            return;
          }
          this.leadInputLeadDataObj = new LeadInputLeadDataObj();
          this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
          this.setLeadAsset();
          this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
          this.setLeadApp();
          if(this.confirmFraudCheck()){
            this.http.post(this.addEditLeadData, this.leadInputLeadDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                if (this.originPage == "teleVerif") {
                  AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
                }
                else if (this.typePage == "update") {
                  AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
                }
                else {
                  this.SaveForm();
                }
              }
            );
          }
        }
      }
    }
    else {
      if (this.lobKta.includes(this.returnLobCode) == true) {
        this.leadInputLeadDataObj = new LeadInputLeadDataObj();
        //this.setLeadAsset();
        this.setLeadApp();
        this.http.post(URLConstant.AddEditLeadDataKta, this.leadInputLeadDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.originPage == "teleVerif") {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
            }
            else if (this.typePage == "update") {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
            }
            else {
              this.SaveForm();
            }
          }
        );
      }
      else {
        this.leadInputLeadDataObj = new LeadInputLeadDataObj();
        this.setLeadAsset();
        this.setLeadApp();
        if(this.confirmFraudCheck()){
          this.http.post(this.addEditLeadData, this.leadInputLeadDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              if (this.originPage == "teleVerif") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
              }
              else if (this.typePage == "update") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
              }
              else {
                this.SaveForm();
              }
            }
          );
        }
      }
    }
  }

  confirmFraudCheck(){
    if(this.isNeedCheckBySystem == "0" && this.leadInputLeadDataObj.LeadAssetObj.SerialNo1 != this.latestCheckChassisNo){
      if(confirm("Recent Chassis No different with previous Chassis No. Are you sure want to submit without fraud check again?")){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return true;
    }
  }

  SaveForm() {
    if (this.Calculate == false && this.returnLobCode != CommonConstant.CFNA) {
      this.toastr.warningMessage("Calculate First");
      return;
    } else {
      this.CheckSubmitForCFNA();
      if (!this.isAbleToSubmit) return;
    }

    if (this.LeadDataForm.status == CommonConstant.INVALID_FORM) {
      return;
    }
    this.leadInputLeadDataObj = new LeadInputLeadDataObj();
    this.leadInputLeadDataObj.WfTaskListId = this.WfTaskListId;
    this.setLeadApp();
    if (this.typePage == "edit" || this.typePage == "update") {
      this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
      if (this.resLeadAssetObj.LeadAssetId != 0) {
        this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
        this.setLeadAsset();
        if (this.originPage == "teleVerif" || this.typePage == "update") {
        if(this.confirmFraudCheck()){
          // this.leadInputLeadDataObj.IsEdit = true;
          this.http.post(this.submitWorkflowLeadInput, this.leadInputLeadDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              if (this.originPage == "teleVerif") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
              }
              else if (this.typePage == "update") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
              }
            }
          );
        }
        }
        else{
          this.outputTab.emit({ stepMode: "next", LeadInputLeadDataObj: this.leadInputLeadDataObj, urlPost: this.submitWorkflowLeadInput, paging: "/Lead/Lead/Paging" });
        }
      }
      else {
        if (this.lobKta.includes(this.returnLobCode) == true) {
          //this.setLeadAsset();
          if(this.originPage == "teleVerif" || this.typePage == "update"){
          this.http.post(URLConstant.SubmitWorkflowLeadInputKta, this.leadInputLeadDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              if (this.originPage == "teleVerif") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
              }
              else if (this.typePage == "update") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
              }

            }
          );
          }
          else {
            this.outputTab.emit({ stepMode: "next", LeadInputLeadDataObj: this.leadInputLeadDataObj, urlPost: URLConstant.SubmitWorkflowLeadInputKta, paging: "/Lead/Lead/Paging" });
          }
        }
        else {
          if (this.LeadDataForm.controls["ManufacturingYear"].value > this.year) {
            this.toastr.warningMessage("Manufacturing Year must be lower or equal than current year.");
            return;
          }
          this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
          this.setLeadAsset();
          if(this.originPage == "teleVerif" || this.typePage == "update"){
          if(this.confirmFraudCheck()){
            this.http.post(this.submitWorkflowLeadInput, this.leadInputLeadDataObj).subscribe(
              (response) => {
                this.toastr.successMessage(response["message"]);
                if (this.originPage == "teleVerif") {
                  AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
                }
                else if (this.typePage == "update") {
                  AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
                }

              }
            );
          }
          }
          else {
            this.outputTab.emit({ stepMode: "next", LeadInputLeadDataObj: this.leadInputLeadDataObj, urlPost: this.submitWorkflowLeadInput, paging: "/Lead/Lead/Paging" });
          }
        }
      }
    }
    else {
      if (this.lobKta.includes(this.returnLobCode) == true) {
        //this.setLeadAsset();
        if (this.originPage == "teleVerif" || this.typePage == "update") {
        this.http.post(URLConstant.SubmitWorkflowLeadInputKta, this.leadInputLeadDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.originPage == "teleVerif") {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
            }
            else if (this.typePage == "update") {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
            }
            
          }
        );
        }
        else {   
          this.outputTab.emit({ stepMode: "next", LeadInputLeadDataObj: this.leadInputLeadDataObj, urlPost: URLConstant.SubmitWorkflowLeadInputKta, paging: "/Lead/LeadUpdate/Paging" });
        }
      }
      else {
        this.setLeadAsset();
        if (this.originPage == "teleVerif" || this.typePage == "update") {

        if(this.confirmFraudCheck()){
          this.http.post(this.submitWorkflowLeadInput, this.leadInputLeadDataObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              if (this.originPage == "teleVerif") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_TELE_VERIF_PAGING], {});
              }
              else if (this.typePage == "update") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
              }
            }
          );
        }
        }
        else{
          this.outputTab.emit({ stepMode: "next", LeadInputLeadDataObj: this.leadInputLeadDataObj, urlPost: this.submitWorkflowLeadInput, paging: "/Lead/LeadUpdate/Paging" });
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
    if (this.isNeedCheckBySystem == "0"){
        if (this.LeadDataForm.controls.items.value[0]['SerialNoLabel'] == CommonConstant.Chassis_No && this.LeadDataForm.controls.items.value[0]['SerialNoValue'] != "") {

          this.leadInputLeadDataObj = new LeadInputLeadDataObj();
          this.setLeadAsset();
          this.http.post(URLConstant.CheckRapindo, this.leadInputLeadDataObj).subscribe(
            (response1) => {
              this.http.post(this.getThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
                (response) => {
                  this.latestReqDtCheckRapindo = response['ReqDt'];
                  this.thirdPartyRsltHId = response['ThirdPartyRsltHId'];
                  this.reqLatestJson = JSON.parse(response['ReqJson']);
                  if(this.reqLatestJson != null && this.reqLatestJson != "" ){
                    this.latestCheckChassisNo = this.reqLatestJson['AppAssetObj'][0]['SerialNo1'];
                  }
                }
              );
            }
          );
        }
      
    }
  }

  CheckSubmitForCFNA() {
    var minAmt = this.LeadDataForm.controls["NTFAmt"].value / this.LeadDataForm.controls["Tenor"].value;
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
}
