import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LeadObj } from 'app/shared/model/lead.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { AssetTypeObj } from 'app/shared/model/asset-type-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { LeadAssetObj } from 'app/shared/model/request/lead/lead-asset-obj.model';
import { LeadAppObj } from 'app/shared/model/request/lead/lead-app-obj.model';
import { AssetMasterObj } from 'app/shared/model/asset-master-obj.model';
import { LeadInputLeadDataObj } from 'app/shared/model/lead-input-lead-data-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqLeadInputLeadDataObj } from 'app/shared/model/request/lead/req-input-lead-data-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { AssetMasterForLookupObj } from 'app/shared/model/asset-master-for-lookup-obj.model';
import { AssetTypeSerialNoLabelObj } from 'app/shared/model/serial-no/asset-type-serial-no-label-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';

@Component({
  selector: 'app-lead-data',
  templateUrl: './lead-data.component.html',
  providers: [NGXToastrService]
})
export class LeadDataComponent implements OnInit {
  @Input() originPage: string;
  @Output() outputPage: EventEmitter<object> = new EventEmitter();

  typePage: string;
  CopyFrom: number = 0;
  LeadId: number;
  assetConditionObj: RefMasterObj;
  returnAssetConditionObj: Array<KeyValueObj>;
  downPaymentObj: RefMasterObj;
  returnDownPaymentObj: Array<KeyValueObj>;
  firstInstObj: RefMasterObj;
  returnFirstInstObj: Array<KeyValueObj>;
  InputLookupAssetObj: InputLookupObj;
  assetTypeId: Number;
  leadInputLeadDataObj: ReqLeadInputLeadDataObj;
  reqLeadAssetObj: LeadAssetObj;
  resLeadAssetObj: LeadAssetObj;
  resLeadAppObj: LeadAppObj;
  reqAssetMasterObj: AssetMasterObj;
  resAssetMasterObj: AssetMasterForLookupObj;
  LeadDataForm = this.fb.group({
    FullAssetCode: [''],
    FullAssetName: [''],
    MrAssetConditionCode: [''],
    MrDownPaymentTypeCode: [''],
    ManufacturingYear: ['', Validators.min(0)],
    AssetPrice: ['', [Validators.required, Validators.min(1.00)]],
    DownPaymentAmount: ['', [Validators.required, Validators.min(1.00)]],
    DownPaymentPercent: [''],
    Tenor: ['', [Validators.required, Validators.min(0)]],
    MrFirstInstTypeCode: ['', Validators.required],
    NTFAmt: [''],
    TotalDownPayment: [''],
    InstallmentAmt: ['', Validators.required],
    items: this.fb.array([]),
  });
  generalSettingObj: GeneralSettingObj;
  lobKta: Array<string> = new Array();
  leadObj: LeadObj;
  returnLeadObj: LeadObj;
  returnLobCode: string;
  WfTaskListId: number;
  editLeadObj: LeadObj;
  isUsed: boolean;
  SerialNoList: Array<AssetTypeSerialNoLabelObj>;
  items: FormArray;
  tempMrAssetConditionCode: string;
  tempMrDownPaymentTypeCode: string;
  tempMrFirstInstTypeCode: string;
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
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

    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: event.AssetTypeCode }).subscribe(
      (response: GenericListObj) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }
        this.SerialNoList = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.SerialNoList["length"]; i++) {
          let eachDataDetail = this.fb.group({
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

    let assetType: AssetTypeObj = new AssetTypeObj();
    assetType.AssetTypeId = this.assetTypeId;
    this.http.post(URLConstant.GetAssetTypeById, { Id: this.assetTypeId }).subscribe(
      (response: AssetTypeObj) => {

      }
    );
  }

  ngOnInit() {
    this.items = this.LeadDataForm.get('items') as FormArray;
    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url; + "/v1"
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    this.generalSettingObj = new GeneralSettingObj();
    this.generalSettingObj.GsCode = "LOB_KTA";
    this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: "LOB_KTA" }).subscribe(
      (response: GeneralSettingObj) => {
        this.lobKta = response.GsValue.split(',');
        this.leadObj = new LeadObj();
        this.leadObj.LeadId = this.LeadId;
        let leadObj = { Id: this.LeadId };
        this.http.post(URLConstant.GetLeadByLeadId, leadObj).subscribe(
          (response: LeadObj) => {
            this.returnLeadObj = response;
            this.returnLobCode = response['LobCode'];
            if (this.lobKta.includes(this.returnLobCode) == true) {
              this.LeadDataForm.controls['NTFAmt'].setValidators([Validators.required]);
            }
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

    if (this.CopyFrom != 0) {
      this.reqLeadAssetObj = new LeadAssetObj();
      this.reqLeadAssetObj.LeadId = this.CopyFrom;
      let reqLeadAssetObj = { Id: this.CopyFrom };
      this.http.post(URLConstant.GetLeadAssetByLeadId, reqLeadAssetObj).subscribe(
        (response: LeadAssetObj) => {
          this.resLeadAssetObj = response;
          if (this.resLeadAssetObj.MrAssetConditionCode == CommonConstant.AssetConditionUsed) {
            this.isUsed = true;
          } else {
            this.isUsed = false;
          }
          if (this.resLeadAssetObj.LeadAssetId != 0) {
            this.assetConditionObj = new RefMasterObj();
            this.assetConditionObj.MasterCode = this.resLeadAssetObj.MrAssetConditionCode;
            this.http.post(URLConstant.GetRefMasterByMasterCode, { Code: this.resLeadAssetObj.MrAssetConditionCode }).subscribe(
              (response: RefMasterObj) => {
                this.tempMrAssetConditionCode = response["Descr"];
              }
            );
            this.assetConditionObj = new RefMasterObj();
            this.assetConditionObj.MasterCode = this.resLeadAssetObj.MrDownPaymentTypeCode;
            this.http.post(URLConstant.GetRefMasterByMasterCode, { Code: this.resLeadAssetObj.MrDownPaymentTypeCode }).subscribe(
              (response: RefMasterObj) => {
                this.tempMrDownPaymentTypeCode = response["Descr"];
              }
            );
            this.LeadDataForm.patchValue({
              FullAssetName: this.reqLeadAssetObj.FullAssetName,
              MrDownPaymentTypeCode: this.resLeadAssetObj.MrDownPaymentTypeCode,
              MrAssetConditionCode: this.resLeadAssetObj.MrAssetConditionCode,
              ManufacturingYear: this.resLeadAssetObj.ManufacturingYear,
              AssetPrice: this.resLeadAssetObj.AssetPriceAmt,
              DownPaymentAmount: this.resLeadAssetObj.DownPaymentAmt,
              DownPaymentPercent: this.resLeadAssetObj.DownPaymentPrcnt,
            });
          }
          let reqByCode = new GenericObj();
          reqByCode.Code = this.resLeadAssetObj.FullAssetCode;
          this.http.post(URLConstant.GetAssetMasterForLookup, reqByCode).subscribe(
            (response: AssetMasterForLookupObj) => {
              this.resAssetMasterObj = response;
              this.InputLookupAssetObj.nameSelect = this.resAssetMasterObj.FullAssetName;
              this.InputLookupAssetObj.jsonSelect = this.resAssetMasterObj;
              this.LeadDataForm.patchValue({
                FullAssetCode: this.resAssetMasterObj.FullAssetCode,
                FullAssetName: this.resAssetMasterObj.FullAssetName,
              });
              this.assetTypeId = this.resAssetMasterObj.AssetTypeId;
              let assetType = new AssetTypeObj();
              assetType.AssetTypeId = this.resAssetMasterObj.AssetTypeId;
              this.http.post(URLConstant.GetAssetTypeById, { Id: this.resAssetMasterObj.AssetTypeId }).subscribe(
                (response: AssetTypeObj) => {

                  this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: response.AssetTypeCode }).subscribe(
                    (response: GenericListObj) => {
                      while (this.items.length) {
                        this.items.removeAt(0);
                      }
                      this.SerialNoList = response[CommonConstant.ReturnObj];
                      for (let i = 0; i < this.SerialNoList["length"]; i++) {
                        let eachDataDetail = this.fb.group({
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
        });

      let reqLeadAppObj = { Id: this.CopyFrom };
      this.http.post(URLConstant.GetLeadAppByLeadId, reqLeadAppObj).subscribe(
        (response: LeadAppObj) => {
          this.resLeadAppObj = response;
          this.assetConditionObj = new RefMasterObj();
          this.assetConditionObj.MasterCode = this.resLeadAppObj.MrFirstInstTypeCode;
          this.http.post(URLConstant.GetRefMasterByMasterCode, { Code: this.resLeadAppObj.MrFirstInstTypeCode }).subscribe(
            (response: RefMasterObj) => {
              this.tempMrFirstInstTypeCode = response["Descr"];
            }
          );
          if (this.resLeadAppObj.LeadAppId != 0) {
            this.LeadDataForm.patchValue({
              Tenor: this.resLeadAppObj.Tenor,
              MrFirstInstTypeCode: this.resLeadAppObj.MrFirstInstTypeCode,
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
      this.http.post(URLConstant.GetLeadAssetByLeadId, { Id: this.LeadId }).subscribe(
        (response: LeadAssetObj) => {

          this.resLeadAssetObj = response;
          if (this.resLeadAssetObj.LeadAssetId != 0) {
            this.assetConditionObj = new RefMasterObj();
            this.assetConditionObj.MasterCode = this.resLeadAssetObj.MrAssetConditionCode;
            this.http.post(URLConstant.GetRefMasterByMasterCode, { Code: this.resLeadAssetObj.MrAssetConditionCode }).subscribe(
              (response) => {
                this.tempMrAssetConditionCode = response["Descr"];
              }
            );
            this.assetConditionObj = new RefMasterObj();
            this.assetConditionObj.MasterCode = this.resLeadAssetObj.MrDownPaymentTypeCode;
            this.http.post(URLConstant.GetRefMasterByMasterCode, { Code: this.resLeadAssetObj.MrDownPaymentTypeCode }).subscribe(
              (response) => {
                this.tempMrDownPaymentTypeCode = response["Descr"];
              }
            );

            this.LeadDataForm.patchValue({
              FullAssetName: this.reqLeadAssetObj.FullAssetName,
              MrDownPaymentTypeCode: this.resLeadAssetObj.MrDownPaymentTypeCode,
              MrAssetConditionCode: this.resLeadAssetObj.MrAssetConditionCode,
              ManufacturingYear: this.resLeadAssetObj.ManufacturingYear,
              AssetPrice: this.resLeadAssetObj.AssetPriceAmt,
              DownPaymentAmount: this.resLeadAssetObj.DownPaymentAmt,
              DownPaymentPercent: this.resLeadAssetObj.DownPaymentPrcnt,

            });
            let reqByCode = new GenericObj();
            reqByCode.Code = this.resLeadAssetObj.FullAssetCode;
            this.http.post(URLConstant.GetAssetMasterForLookup, reqByCode).subscribe(
              (response: AssetMasterForLookupObj) => {
                this.resAssetMasterObj = response;
                this.InputLookupAssetObj.nameSelect = this.resAssetMasterObj.FullAssetName;
                this.InputLookupAssetObj.jsonSelect = this.resAssetMasterObj;
                this.LeadDataForm.patchValue({
                  FullAssetCode: this.resAssetMasterObj.FullAssetCode,
                  FullAssetName: this.resAssetMasterObj.FullAssetName,
                });
                this.assetTypeId = this.resAssetMasterObj.AssetTypeId;
                let assetType = new AssetTypeObj();
                assetType.AssetTypeId = this.resAssetMasterObj.AssetTypeId;
                this.http.post(URLConstant.GetAssetTypeById, { Id: this.resAssetMasterObj.AssetTypeId }).subscribe(
                  (response: AssetTypeObj) => {

                    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: response.AssetTypeCode }).subscribe(
                      (response: GenericListObj) => {
                        while (this.items.length) {
                          this.items.removeAt(0);
                        }
                        this.SerialNoList = response[CommonConstant.ReturnObj];
                        for (let i = 0; i < this.SerialNoList["length"]; i++) {
                          let eachDataDetail = this.fb.group({
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
          }

          let reqLeadAppObj = { Id: this.LeadId };
          this.http.post(URLConstant.GetLeadAppByLeadId, reqLeadAppObj).subscribe(
            (response: LeadAppObj) => {
              this.resLeadAppObj = response;
              this.assetConditionObj = new RefMasterObj();
              this.assetConditionObj.MasterCode = this.resLeadAppObj.MrFirstInstTypeCode;
              this.http.post(URLConstant.GetRefMasterByMasterCode, { Code: this.resLeadAppObj.MrFirstInstTypeCode }).subscribe(
                (response) => {
                  this.tempMrFirstInstTypeCode = response["Descr"];
                }
              );
              this.LeadDataForm.patchValue({
                Tenor: this.resLeadAppObj.Tenor,
                MrFirstInstTypeCode: this.resLeadAppObj.MrFirstInstTypeCode,
                NTFAmt: this.resLeadAppObj.NtfAmt,
                TotalDownPayment: this.resLeadAppObj.TotalDownPaymentAmt,
                InstallmentAmt: this.resLeadAppObj.InstAmt,
              });
            });
        });
    }


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
    if (this.typePage == "edit" || this.typePage == "update") {
      if (this.resLeadAssetObj.LeadAssetId != 0) {
        this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
        this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
        this.setLeadAsset();
        this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
        this.setLeadApp();
        this.http.post(URLConstant.EditLeadData, this.leadInputLeadDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CONTENT_PAGE_SELF_VERIF], { LeadId: this.LeadId, WfTaskListId: this.WfTaskListId, LobCode: this.returnLobCode });
          }
        );
      }
    }
    else {
      this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
      this.setLeadAsset();
      this.setLeadApp();
      this.http.post(URLConstant.AddLeadData, this.leadInputLeadDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CONTENT_PAGE_SELF_VERIF], { LeadId: this.LeadId, WfTaskListId: this.WfTaskListId, LobCode: this.returnLobCode });
        });
    }
  }

  SaveForm() {    
    let SubmitWorkflowLeadInputUrl = URLConstant.SubmitWorkflowLeadInput; 
    let SubmitWorkflowLeadInputKtaUrl = URLConstant.SubmitWorkflowLeadInputKta;

    if(environment.isCore){
      SubmitWorkflowLeadInputUrl = URLConstant.SubmitWorkflowLeadInputV2; 
      SubmitWorkflowLeadInputKtaUrl = URLConstant.SubmitWorkflowLeadInputKtaV2;
    }

    if (this.typePage == "edit" || this.typePage == "update") {
      if (this.resLeadAssetObj.LeadAssetId != 0) {
        this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
        this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
        this.setLeadAsset();
        this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
        this.setLeadApp();
        this.leadInputLeadDataObj.WfTaskListId = this.WfTaskListId;
        // this.leadInputLeadDataObj.IsEdit = true;
        this.http.post(SubmitWorkflowLeadInputUrl, this.leadInputLeadDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.originPage == "teleVerif") {

              this.outputPage.emit({ pageType: "submit" });
            }
            else if (this.typePage == "edit") {

              this.outputPage.emit({ pageType: "submit" });
            }
            else {
              this.outputPage.emit({ pageType: "submit" });
            }
          }
        );
      } else {
        this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
        this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
        this.setLeadApp();
        this.leadInputLeadDataObj.WfTaskListId = this.WfTaskListId;
        // this.leadInputLeadDataObj.IsEdit = true;
        this.http.post(SubmitWorkflowLeadInputKtaUrl, this.leadInputLeadDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.originPage == "teleVerif") {
              this.outputPage.emit({ pageType: "submit" });
            }
            else if (this.typePage == "edit") {

              this.outputPage.emit({ pageType: "submit" });
            }
            else {
              this.outputPage.emit({ pageType: "submit" });
            }
          }
        );


      }
    }
    else {
      this.leadInputLeadDataObj = new ReqLeadInputLeadDataObj();
      this.setLeadAsset();
      this.setLeadApp();
      this.leadInputLeadDataObj.WfTaskListId = this.WfTaskListId;
      this.http.post(SubmitWorkflowLeadInputUrl, this.leadInputLeadDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_PAGING], {});
        });
    }
    this.editLeadObj = new LeadObj();
    this.editLeadObj = this.returnLeadObj;
    this.editLeadObj.IsSubmit = true;
    this.http.post(URLConstant.EditLead, this.editLeadObj).subscribe(
      (response) => {
      }
    );
  }
}
