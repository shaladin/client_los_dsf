import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AssetTypeObj } from 'app/shared/model/AssetTypeObj.Model';
import { LeadInputLeadDataObj } from 'app/shared/model/LeadInputLeadDataObj.Model';
import { LeadAppObj } from 'app/shared/model/LeadAppObj.Model';
import { LeadAssetObj } from 'app/shared/model/LeadAssetObj.Model';
import { AssetMasterObj } from 'app/shared/model/AssetMasterObj.Model';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';


@Component({
  selector: 'app-lead-input-lead-data',
  templateUrl: './lead-input-lead-data.component.html',
  providers: [NGXToastrService]
})

export class LeadInputLeadDataComponent implements OnInit {
  @Input() originPage: string;
  typePage: string;
  CopyFrom: number;
  LeadId: number;
  assetConditionObj: RefMasterObj;
  returnAssetConditionObj: [];
  downPaymentObj: RefMasterObj;
  returnDownPaymentObj: [];
  firstInstObj: RefMasterObj;
  returnFirstInstObj: [];
  InputLookupAssetObj: InputLookupObj;
  getListActiveRefMasterUrl: string;
  assetTypeId: number;
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
  LeadDataForm = this.fb.group({
    FullAssetCode: [''],
    FullAssetName: [''],
    MrAssetConditionCode: [''],
    MrDownPaymentTypeCode: [''],
    ManufacturingYear: [''],
    AssetPrice: ['', Validators.required],
    DownPaymentAmount: ['', Validators.required],
    DownPaymentPercent: [''],
    SerialNo1: [''],
    SerialNo2: [''],
    SerialNo3: [''],
    SerialNo4: [''],
    SerialNo5: [''],
    Tenor: ['', Validators.required],
    MrFirstInstTypeCode: ['', Validators.required],
    NTFAmt: [''],
    TotalDownPayment: [''],
    InstallmentAmt: ['', Validators.required]
  });
  getGeneralSettingByCode: string;
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
  Tenor

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.getListActiveRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.addEditLeadData = AdInsConstant.AddEditLeadData;
    this.getLeadAssetByLeadId = AdInsConstant.GetLeadAssetByLeadId;
    this.getLeadAppByLeadId = AdInsConstant.GetLeadAppByLeadId;
    this.getAssetMasterForLookupEmployee = AdInsConstant.GetAssetMasterForLookupEmployee;
    this.getGeneralSettingByCode = AdInsConstant.GetGeneralSettingByCode;
    this.getLeadByLeadId = AdInsConstant.GetLeadByLeadId;
    this.editLead = AdInsConstant.EditLead;
    this.submitWorkflowLeadInput = AdInsConstant.SubmitWorkflowLeadInput;
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
  }

  // downPaymentChange(event) {
  //   this.LeadDataForm.patchValue({
  //     MrDownPaymentTypeCode: event.value,
  //   });
  // }

  radioChange(event) {
    this.serial2Mandatory = false;
    this.serial3Mandatory = false;
    this.serial4Mandatory = false;
    this.serial5Mandatory = false;

    var assetType = new AssetTypeObj();
    assetType.AssetTypeId = this.assetTypeId;
    this.http.post(AdInsConstant.GetAssetTypeById, assetType).subscribe(
      (response: any) => {
        if (response.IsMndtrySerialNo1 == "1" && event.target.value == "USED") {
          this.LeadDataForm.controls['SerialNo1'].setValidators([Validators.required]);
          this.LeadDataForm.controls['SerialNo1'].updateValueAndValidity();
          this.serial1Mandatory = true;
        }
        else {
          this.LeadDataForm.controls['SerialNo1'].clearValidators();
          this.LeadDataForm.controls['SerialNo1'].updateValueAndValidity();
          this.serial1Mandatory = false;
        }

        if (response.IsMndtrySerialNo2 == "1" && event.target.value == "USED") {
          this.LeadDataForm.controls['SerialNo2'].setValidators([Validators.required]);
          this.LeadDataForm.controls['SerialNo2'].updateValueAndValidity();
          this.serial2Mandatory = true;
        }
        else {
          this.LeadDataForm.controls['SerialNo2'].clearValidators();
          this.LeadDataForm.controls['SerialNo2'].updateValueAndValidity();
          this.serial2Mandatory = false;
        }

        if (response.IsMndtrySerialNo3 == "1" && event.target.value == "USED") {
          this.LeadDataForm.controls['SerialNo3'].setValidators([Validators.required]);
          this.LeadDataForm.controls['SerialNo3'].updateValueAndValidity();
          this.serial3Mandatory = true;
        }
        else {
          this.LeadDataForm.controls['SerialNo3'].clearValidators();
          this.LeadDataForm.controls['SerialNo3'].updateValueAndValidity();
          this.serial3Mandatory = false;
        }

        if (response.IsMndtrySerialNo4 == "1" && event.target.value == "USED") {
          this.LeadDataForm.controls['SerialNo4'].setValidators([Validators.required]);
          this.LeadDataForm.controls['SerialNo4'].updateValueAndValidity();
          this.serial4Mandatory = true;
        }
        else {
          this.LeadDataForm.controls['SerialNo4'].clearValidators();
          this.LeadDataForm.controls['SerialNo4'].updateValueAndValidity();
          this.serial4Mandatory = false;
        }

        if (response.IsMndtrySerialNo5 == "1" && event.target.value == "USED") {
          this.LeadDataForm.controls['SerialNo5'].setValidators([Validators.required]);
          this.LeadDataForm.controls['SerialNo5'].updateValueAndValidity();
          this.serial5Mandatory = true;
        }
        else {
          this.LeadDataForm.controls['SerialNo5'].clearValidators();
          this.LeadDataForm.controls['SerialNo5'].updateValueAndValidity();
          this.serial5Mandatory = false;
        }

        this.serial1Disabled = response.SerialNo1Label == "" ? true : false;
        this.serial2Disabled = response.SerialNo2Label == "" ? true : false;
        this.serial3Disabled = response.SerialNo3Label == "" ? true : false;
        this.serial4Disabled = response.SerialNo4Label == "" ? true : false;
        this.serial5Disabled = response.SerialNo5Label == "" ? true : false;
      }
    );
  }

  ngOnInit() {
    console.log('leaddata');
    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    this.generalSettingObj = new GeneralSettingObj();
    this.generalSettingObj.gsCode = "LOB_KTA";
    this.http.post(this.getGeneralSettingByCode, this.generalSettingObj).subscribe(
      (response) => {
        this.returnGeneralSettingObj = response;
        this.lobKta = this.returnGeneralSettingObj.GsValue.split(',');
        this.leadObj = new LeadObj();
        this.leadObj.LeadId = this.LeadId;
        this.http.post(this.getLeadByLeadId, this.leadObj).subscribe(
          (response) => {
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
    this.assetConditionObj.RefMasterTypeCode = "ASSET_CONDITION";
    this.http.post(this.getListActiveRefMasterUrl, this.assetConditionObj).subscribe(
      (response) => {
        this.returnAssetConditionObj = response["ReturnObject"];
        this.LeadDataForm.patchValue({ MrAssetConditionCode: response['ReturnObject'][0]['Key'] });
      }
    );

    this.downPaymentObj = new RefMasterObj();
    this.downPaymentObj.RefMasterTypeCode = "DOWN_PAYMENT_TYPE";
    this.http.post(this.getListActiveRefMasterUrl, this.downPaymentObj).subscribe(
      (response) => {
        this.returnDownPaymentObj = response["ReturnObject"];
        this.LeadDataForm.patchValue({ MrDownPaymentTypeCode: response['ReturnObject'][0]['Key'] });
      }
    );

    this.firstInstObj = new RefMasterObj();
    this.firstInstObj.RefMasterTypeCode = "FIRST_INST_TYPE";
    this.http.post(this.getListActiveRefMasterUrl, this.firstInstObj).subscribe(
      (response) => {
        this.returnFirstInstObj = response["ReturnObject"];
        this.LeadDataForm.patchValue({ MrFirstInstTypeCode: response['ReturnObject'][0]['Key'] });
      }
    );

    if (this.CopyFrom != null) {
      this.reqLeadAssetObj = new LeadAssetObj();
      this.reqLeadAssetObj.LeadId = this.CopyFrom;
      this.http.post(this.getLeadAssetByLeadId, this.reqLeadAssetObj).subscribe(
        (response) => {
          this.resLeadAssetObj = response;
          if (this.resLeadAssetObj.LeadAssetId != 0) {
            this.LeadDataForm.patchValue({
              MrDownPaymentTypeCode: this.resLeadAssetObj.MrDownPaymentTypeCode,
              MrAssetConditionCode: this.resLeadAssetObj.MrAssetConditionCode,
              ManufacturingYear: this.resLeadAssetObj.ManufacturingYear,
              AssetPrice: this.resLeadAssetObj.AssetPriceAmt,
              DownPaymentAmount: this.resLeadAssetObj.DownPaymentAmt,
              SerialNo1: this.resLeadAssetObj.SerialNo1,
              SerialNo2: this.resLeadAssetObj.SerialNo2,
              SerialNo3: this.resLeadAssetObj.SerialNo3,
              SerialNo4: this.resLeadAssetObj.SerialNo4,
              SerialNo5: this.resLeadAssetObj.SerialNo5,
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
              this.http.post(AdInsConstant.GetAssetTypeById, assetType).subscribe(
                (response: any) => {
                  console.log(response);
                  if (response.IsMndtrySerialNo1 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                    this.LeadDataForm.controls['SerialNo1'].setValidators([Validators.required]);
                    this.LeadDataForm.controls['SerialNo1'].updateValueAndValidity();
                    this.serial1Mandatory = true;
                  }
                  else {
                    this.LeadDataForm.controls['SerialNo1'].clearValidators();
                    this.LeadDataForm.controls['SerialNo1'].updateValueAndValidity();
                    this.serial1Mandatory = false;
                  }

                  if (response.IsMndtrySerialNo2 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                    this.LeadDataForm.controls['SerialNo2'].setValidators([Validators.required]);
                    this.LeadDataForm.controls['SerialNo2'].updateValueAndValidity();
                    this.serial2Mandatory = true;
                  }
                  else {
                    this.LeadDataForm.controls['SerialNo2'].clearValidators();
                    this.LeadDataForm.controls['SerialNo2'].updateValueAndValidity();
                    this.serial2Mandatory = false;
                  }

                  if (response.IsMndtrySerialNo3 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                    this.LeadDataForm.controls['SerialNo3'].setValidators([Validators.required]);
                    this.LeadDataForm.controls['SerialNo3'].updateValueAndValidity();
                    this.serial3Mandatory = true;
                  }
                  else {
                    this.LeadDataForm.controls['SerialNo3'].clearValidators();
                    this.LeadDataForm.controls['SerialNo3'].updateValueAndValidity();
                    this.serial3Mandatory = false;
                  }

                  if (response.IsMndtrySerialNo4 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                    this.LeadDataForm.controls['SerialNo4'].setValidators([Validators.required]);
                    this.LeadDataForm.controls['SerialNo4'].updateValueAndValidity();
                    this.serial4Mandatory = true;
                  }
                  else {
                    this.LeadDataForm.controls['SerialNo4'].clearValidators();
                    this.LeadDataForm.controls['SerialNo4'].updateValueAndValidity();
                    this.serial4Mandatory = false;
                  }

                  if (response.IsMndtrySerialNo5 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                    this.LeadDataForm.controls['SerialNo5'].setValidators([Validators.required]);
                    this.LeadDataForm.controls['SerialNo5'].updateValueAndValidity();
                    this.serial5Mandatory = true;
                  }
                  else {
                    this.LeadDataForm.controls['SerialNo5'].clearValidators();
                    this.LeadDataForm.controls['SerialNo5'].updateValueAndValidity();
                    this.serial5Mandatory = false;
                  }

                  this.serial1Disabled = response.SerialNo1Label == "" ? true : false;
                  this.serial2Disabled = response.SerialNo2Label == "" ? true : false;
                  this.serial3Disabled = response.SerialNo3Label == "" ? true : false;
                  this.serial4Disabled = response.SerialNo4Label == "" ? true : false;
                  this.serial5Disabled = response.SerialNo5Label == "" ? true : false;
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
      this.http.post(this.getLeadAssetByLeadId, this.reqLeadAssetObj).subscribe(
        (response) => {
          this.resLeadAssetObj = response;
          if (this.resLeadAssetObj.LeadAssetId != 0) {
            this.LeadDataForm.patchValue({
              MrDownPaymentTypeCode: this.resLeadAssetObj.MrDownPaymentTypeCode,
              MrAssetConditionCode: this.resLeadAssetObj.MrAssetConditionCode,
              ManufacturingYear: this.resLeadAssetObj.ManufacturingYear,
              AssetPrice: this.resLeadAssetObj.AssetPriceAmt,
              DownPaymentAmount: this.resLeadAssetObj.DownPaymentAmt,
              SerialNo1: this.resLeadAssetObj.SerialNo1,
              SerialNo2: this.resLeadAssetObj.SerialNo2,
              SerialNo3: this.resLeadAssetObj.SerialNo3,
              SerialNo4: this.resLeadAssetObj.SerialNo4,
              SerialNo5: this.resLeadAssetObj.SerialNo5,
            });

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
                this.http.post(AdInsConstant.GetAssetTypeById, assetType).subscribe(
                  (response: any) => {
                    if (response.IsMndtrySerialNo1 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                      this.LeadDataForm.controls['SerialNo1'].setValidators([Validators.required]);
                      this.LeadDataForm.controls['SerialNo1'].updateValueAndValidity();
                      this.serial1Mandatory = true;
                    }
                    else {
                      this.LeadDataForm.controls['SerialNo1'].clearValidators();
                      this.LeadDataForm.controls['SerialNo1'].updateValueAndValidity();
                      this.serial1Mandatory = false;
                    }

                    if (response.IsMndtrySerialNo2 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                      this.LeadDataForm.controls['SerialNo2'].setValidators([Validators.required]);
                      this.LeadDataForm.controls['SerialNo2'].updateValueAndValidity();
                      this.serial2Mandatory = true;
                    }
                    else {
                      this.LeadDataForm.controls['SerialNo2'].clearValidators();
                      this.LeadDataForm.controls['SerialNo2'].updateValueAndValidity();
                      this.serial2Mandatory = false;
                    }

                    if (response.IsMndtrySerialNo3 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                      this.LeadDataForm.controls['SerialNo3'].setValidators([Validators.required]);
                      this.LeadDataForm.controls['SerialNo3'].updateValueAndValidity();
                      this.serial3Mandatory = true;
                    }
                    else {
                      this.LeadDataForm.controls['SerialNo3'].clearValidators();
                      this.LeadDataForm.controls['SerialNo3'].updateValueAndValidity();
                      this.serial3Mandatory = false;
                    }

                    if (response.IsMndtrySerialNo4 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                      this.LeadDataForm.controls['SerialNo4'].setValidators([Validators.required]);
                      this.LeadDataForm.controls['SerialNo4'].updateValueAndValidity();
                      this.serial4Mandatory = true;
                    }
                    else {
                      this.LeadDataForm.controls['SerialNo4'].clearValidators();
                      this.LeadDataForm.controls['SerialNo4'].updateValueAndValidity();
                      this.serial4Mandatory = false;
                    }

                    if (response.IsMndtrySerialNo5 == "1" && this.resLeadAssetObj.MrAssetConditionCode == "USED") {
                      this.LeadDataForm.controls['SerialNo5'].setValidators([Validators.required]);
                      this.LeadDataForm.controls['SerialNo5'].updateValueAndValidity();
                      this.serial5Mandatory = true;
                    }
                    else {
                      this.LeadDataForm.controls['SerialNo5'].clearValidators();
                      this.LeadDataForm.controls['SerialNo5'].updateValueAndValidity();
                      this.serial5Mandatory = false;
                    }

                    this.serial1Disabled = response.SerialNo1Label == "" ? true : false;
                    this.serial2Disabled = response.SerialNo2Label == "" ? true : false;
                    this.serial3Disabled = response.SerialNo3Label == "" ? true : false;
                    this.serial4Disabled = response.SerialNo4Label == "" ? true : false;
                    this.serial5Disabled = response.SerialNo5Label == "" ? true : false;
                  });
              });

            this.reqLeadAppObj = new LeadAppObj();
            this.reqLeadAppObj.LeadId = this.LeadId;
            this.http.post(this.getLeadAppByLeadId, this.reqLeadAppObj).subscribe(
              (response) => {
                this.resLeadAppObj = response;
                this.LeadDataForm.patchValue({
                  Tenor: this.resLeadAppObj.Tenor,
                  MrFirstInstTypeCode: this.resLeadAppObj.MrFirstInstTypeCode,
                  NTFAmt: this.resLeadAppObj.NtfAmt,
                  TotalDownPayment: this.resLeadAppObj.TotalDownPaymentAmt,
                  InstallmentAmt: this.resLeadAppObj.InstAmt,
                });
              });
          }
        });
    }
  }

  DownPaymentChange()
  {
    if(this.LeadDataForm.controls["MrDownPaymentTypeCode"].value == "AMT")
    {
      this.LeadDataForm.controls.DownPaymentPercent.disable();
      this.LeadDataForm.controls.DownPaymentAmount.enable();

    }
    else
    {
      this.LeadDataForm.controls.DownPaymentPercent.enable();
      this.LeadDataForm.controls.DownPaymentAmount.disable();
    }
  }

  DPAmtChange()
  {
    this.DPAmount = this.LeadDataForm.controls["DownPaymentAmount"].value;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;

    this.DPPercentage = this.DPAmount / this.AssetPrice * 100;

    this.LeadDataForm.patchValue({
      DownPaymentPercent: this.DPPercentage,
    });
  }

  DPPrcntChange()
  {
    this.DPPercentage = this.LeadDataForm.controls["DownPaymentPercent"].value;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;

    this.DPAmount = this.AssetPrice * this.DPPercentage/100;

    this.LeadDataForm.patchValue({
      DownPaymentAmount: this.DPAmount,
    });
  }

  FirstInstChange()
  {
    this.Calculate = false;
    this.LeadDataForm.patchValue({
      NTFAmt: '',
      TotalDownPayment: '',
      InstallmentAmt: '',
    });
  }

  TenorChange()
  {
    this.Calculate = false;
    
    console.log("test tenor");
    console.log(this.Calculate);
  }

  calculateNonKta()
  {
    this.Calculate = true;
    this.Tenor = this.LeadDataForm.controls["Tenor"].value;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;
    this.DPAmount = this.LeadDataForm.controls["DownPaymentAmount"].value;

    if(this.DPAmount > this.AssetPrice)
    {
      this.toastr.errorMessage("Down Payment Amount Must Be Lower Than Asset Price!");
      return;
    }

    if(this.Tenor == '')
    {
      this.toastr.errorMessage("Fill The Tenor First!");
      return;
    }

    this.NTFAmt = this.AssetPrice - this.DPAmount;
    this.InstAmt = this.NTFAmt / this.Tenor;
    if(this.LeadDataForm.controls["MrFirstInstTypeCode"].value == "AD")
    {
      this.TotalDownPayment = this.DPAmount + this.InstAmt;
    }
    else
    {
      this.TotalDownPayment = this.DPAmount;
    }

    this.LeadDataForm.patchValue({
      NTFAmt: this.NTFAmt,
      TotalDownPayment: this.TotalDownPayment,
      InstallmentAmt: this.InstAmt,
    });
  }

  calculateKta()
  {
    this.Calculate = true;
    this.Tenor = this.LeadDataForm.controls["Tenor"].value;
    this.AssetPrice = this.LeadDataForm.controls["AssetPrice"].value;
    this.DPAmount = this.LeadDataForm.controls["DownPaymentAmount"].value;

    if(this.DPAmount > this.AssetPrice)
    {
      this.toastr.errorMessage("Down Payment Amount Must Be Lower Than Asset Price!");
      return;
    }

    if(this.Tenor == '')
    {
      this.toastr.errorMessage("Fill The Tenor First!");
      return;
    }

    this.NTFAmt = this.AssetPrice - this.DPAmount;
    this.InstAmt = this.NTFAmt / this.Tenor;

    this.LeadDataForm.patchValue({
      NTFAmt: this.NTFAmt,
      InstallmentAmt: this.InstAmt,
    });
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
    this.leadInputLeadDataObj.LeadAssetObj.SerialNo1 = this.LeadDataForm.controls["SerialNo1"].value;
    this.leadInputLeadDataObj.LeadAssetObj.SerialNo2 = this.LeadDataForm.controls["SerialNo2"].value;
    this.leadInputLeadDataObj.LeadAssetObj.SerialNo3 = this.LeadDataForm.controls["SerialNo3"].value;
    this.leadInputLeadDataObj.LeadAssetObj.SerialNo4 = this.LeadDataForm.controls["SerialNo4"].value;
    this.leadInputLeadDataObj.LeadAssetObj.SerialNo5 = this.LeadDataForm.controls["SerialNo5"].value;
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
    if(this.Calculate == false)
    {
      this.toastr.errorMessage("Calculate First");
      return;
    }

    if (this.typePage == "edit" || this.typePage == "update") {
      if (this.resLeadAssetObj.LeadAssetId != 0) {
        this.leadInputLeadDataObj = new LeadInputLeadDataObj();
        this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
        this.setLeadAsset();
        this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
        this.setLeadApp();
        this.http.post(this.addEditLeadData, this.leadInputLeadDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.originPage == "teleVerif") {
              this.router.navigate(["/Lead/TeleVerif/Paging"]);
            }
            else if (this.typePage == "edit") {
              this.router.navigate(["/Lead/Lead/Paging"]);
            }
            else {
              this.router.navigate(["/Lead/LeadUpdate/Paging"]);
            }
          },
          (error) => {
            console.log(error);
          });
      }
      else {
        this.leadInputLeadDataObj = new LeadInputLeadDataObj();
        this.setLeadAsset();
        this.setLeadApp();
        this.http.post(this.addEditLeadData, this.leadInputLeadDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.originPage == "teleVerif") {
              this.router.navigate(["/Lead/TeleVerif/Paging"]);
            }
            else if (this.typePage == "edit") {
              this.router.navigate(["/Lead/Lead/Paging"]);
            }
            else {
              this.router.navigate(["/Lead/LeadUpdate/Paging"]);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
    else {
      this.leadInputLeadDataObj = new LeadInputLeadDataObj();
      this.setLeadAsset();
      this.setLeadApp();
      this.http.post(this.addEditLeadData, this.leadInputLeadDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          if (this.originPage == "teleVerif") {
            this.router.navigate(["/Lead/TeleVerif/Paging"]);
          }
          else if (this.typePage == "edit") {
            this.router.navigate(["/Lead/Lead/Paging"]);
          }
          else {
            this.router.navigate(["/Lead/LeadUpdate/Paging"]);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  SaveForm() {
    if(this.Calculate == false)
    {
      this.toastr.errorMessage("Calculate First");
      return;
    }

    if (this.typePage == "edit" || this.typePage == "update") {
      if (this.resLeadAssetObj.LeadAssetId != 0) {
        this.leadInputLeadDataObj = new LeadInputLeadDataObj();
        this.leadInputLeadDataObj.LeadAssetObj.RowVersion = this.resLeadAssetObj.RowVersion;
        this.setLeadAsset();
        this.leadInputLeadDataObj.LeadAppObj.RowVersion = this.resLeadAppObj.RowVersion;
        this.setLeadApp();
        this.leadInputLeadDataObj.WfTaskListId = this.WfTaskListId;
        // this.leadInputLeadDataObj.IsEdit = true;
        this.http.post(this.submitWorkflowLeadInput, this.leadInputLeadDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.originPage == "teleVerif") {
              this.router.navigate(["/Lead/TeleVerif/Paging"]);
            }
            else if (this.typePage == "update") {
              this.router.navigate(["/Lead/LeadUpdate/Paging"]);
            }
            else {
              this.router.navigate(["/Lead/Lead/Paging"]);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
      else {
        this.leadInputLeadDataObj = new LeadInputLeadDataObj();
        this.setLeadAsset();
        this.setLeadApp();
        this.leadInputLeadDataObj.WfTaskListId = this.WfTaskListId;
        this.http.post(this.submitWorkflowLeadInput, this.leadInputLeadDataObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.originPage == "teleVerif") {
              this.router.navigate(["/Lead/TeleVerif/Paging"]);
            }
            else if (this.typePage == "edit") {
              this.router.navigate(["/Lead/Lead/Paging"]);
            }
            else {
              this.router.navigate(["/Lead/LeadUpdate/Paging"]);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
    else {
      this.leadInputLeadDataObj = new LeadInputLeadDataObj();
      this.setLeadAsset();
      this.setLeadApp();
      this.leadInputLeadDataObj.WfTaskListId = this.WfTaskListId;
      this.http.post(this.submitWorkflowLeadInput, this.leadInputLeadDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          if (this.originPage == "teleVerif") {
            this.router.navigate(["/Lead/TeleVerif/Paging"]);
          }
          else if (this.typePage == "edit") {
            this.router.navigate(["/Lead/Lead/Paging"]);
          }
          else {
            this.router.navigate(["/Lead/LeadUpdate/Paging"]);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
