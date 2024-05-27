import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { AppAssetAttrCustomObj } from 'app/shared/model/app-asset/app-asset-attr-custom.model';
import { AppAssetAttrObj } from 'app/shared/model/app-asset-attr-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/app-collateral-registration-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { ProdOfferingDObj } from 'app/shared/model/product/prod-offering-d-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';
import { ReqGetVendorByCategoryCodeAndOfficeCodeObj } from 'app/shared/model/request/vendor/req-vendor.model';
import { ResProdOfferingDObj } from 'app/shared/model/response/product/res-get-prod-offering-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/app-cust-personal-job-data-obj.model';
import { ResponseJobDataPersonalObj } from 'app/shared/model/response-job-data-personal-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { formatDate } from '@angular/common';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-edit-app-after-approval-asset-data-x-dsf',
  templateUrl: './edit-app-after-approval-asset-data-x-dsf.component.html'
})
export class EditAppAfterApprovalAssetDataXDsfComponent implements OnInit {
  @Input() AgrmntCurrStep: string;
  @Input() AppAssetObj: AppAssetObj;
  @Input() ListAppAssetAttrObjs: Array<AppAssetAttrObj>;
  @Input() AppCollateralObj: AppCollateralObj;
  @Input() AppCollateralRegistrationObj: AppCollateralRegistrationObj;
  @Input() EditedAssetData: any
  //@Input() AppCollateralAttrObjs = new Array();
  @Output() outputPage: EventEmitter<object> = new EventEmitter();

  EditAppAssetForm = this.fb.group({
    SelfOwner: [false],
    OwnerName: ['', Validators.maxLength(500)],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    MrOwnerRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrAssetUsageCode: ['', [Validators.required, Validators.maxLength(50)]],
    OwnerIdNo: ['', Validators.maxLength(50)],
    OwnerAddrType: [''],
    OwnerMobilePhnNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    OwnerAddr: [''],
    OwnerAreaCode1: ['', Validators.maxLength(50)],
    OwnerAreaCode2: ['', Validators.maxLength(50)],
    OwnerAreaCode3: ['', Validators.maxLength(50)],
    OwnerAreaCode4: ['', Validators.maxLength(50)],
    OwnerCity: ['', Validators.maxLength(50)],
    OwnerZipcode: ['', Validators.maxLength(50)],
    OwnerProfessionCode: ['', Validators.required],
    MrOwnerTypeCode: [''],
    SelfUser: [false],
    UserName: ['', Validators.maxLength(500)],
    MrUserRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
    AppAssetAttrObjs: this.fb.array([]),
    InscoBranchCode: [''],
    InscoBranchName: [''],
    ManufacturingYear: ['', Validators.required],
    AssetColor: [''],
    SerialNo1: [''],
    SerialNo2: [''],
    SerialNo3: [''],
    SerialNo4: [''],
    SerialNo5: [''],
    ListDoc: this.fb.array([])
    // Self Custom Changes CR Runner KTB 398912
    , selectedRunnerActivation: ['']
    // End Self Custom Changes CR Runner KTB 398912
  });

  AppObj: NapAppModel;
  AppId: number;
  AppAssetId: number;
  AppCollateralId: number;
  RefAssetDocId: number;
  AssetTypeCode: string;
  AppCustObj: AppCustObj;
  AppCustPersonalJobData: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();

  CustType: string = "";
  IdTypeObj: Array<KeyValueObj>;
  refMasterObj : RefMasterObj = new RefMasterObj();
  OwnerRelationObj: Array<KeyValueObj>;
  UserRelationObj: Array<KeyValueObj>;
  AppCustAddrObj: Array<AppCustAddrObj>;
  AddrObj: Array<AppCustAddrObj>;
  AddrLegalObj: Array<AppCustAddrObj>;
  AssetUsageObj: Array<KeyValueObj>;
  inputFieldOwnerAddrObj: InputFieldObj;
  ownerAddrObj: AddrObj;
  inputAddressObjForOwner: InputAddressObj;
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();
  copyFromAppCustAddrForOwner: string;
  ListAttrAnswer = [];
  AppAssetAttrObj: Array<AppAssetAttrObj>;
  appAssetAttrObjs: Array<AppAssetAttrCustomObj>;
  isAssetAttrReady: boolean = false;
  RefProdCmptAssetType: ProdOfferingDObj;
  inscoBranchObj: Array<KeyValueObj>;
  InsAssetCoveredBy: string = "";
  appInsObjObj: AppInsObjObj;
  RefProdCmptPurposeOfFinancing: ProdOfferingDObj;

  AppAssetRelatedOutput: any;
  tempColor:boolean = false;

  SerialNoLabelList:Array<string> = new Array();
  SerialNoLabelMandatory:Array<boolean> = new Array();
  ListAgrStepToCheckMandatory: Array<string> = new Array();
  IsCheckSerialMandatory: boolean = false;
  OwnerTypeObj: Array<KeyValueObj> = new Array();
  OwnerProfessionObj: Array<KeyValueObj> = new Array();

  isFromDB = true;
  // Self Custom Changes CR Runner KTB 398912
  runnerActivationValue: Array<KeyValueObj>;
  returnAppAssetDsfObj: any;
  // End Self Custom Changes CR Runner KTB 398912

  npwpOrKtp:Array<string> = [CommonConstant.MrIdTypeCodeEKTP, CommonConstant.MrIdTypeCodeNPWP]
  isReadOnly:boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private http: HttpClient) { }

  async ngOnInit(): Promise<void> {

    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isReady = true;
    this.InputLookupProfessionObj.isRequired = false;

    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.showAllPhn = false;
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
    this.ownerAddrObj = new AddrObj();
    this.AppId = this.AppAssetObj.AppId;
    this.AppAssetId = this.AppAssetObj.AppAssetId;
    this.AssetTypeCode = this.AppAssetObj.AssetTypeCode;
    this.AppCollateralId = this.AppCollateralObj.AppCollateralId

    await this.bindOwnerTypeObj();
    await this.bindCompanyTypeObj();
    await this.SetAssetTypeData()
    await this.SetAssetInformation()
    await this.GetAppData();
    await this.GetRefProdCompt();
    await this.GetAppCust();
    this.bindIdTypeObj();
    this.bindUserOwnerRelationshipObj();
    this.setAddrOwnerObj();
    await this.GetListAddr();
    await this.SetOwnerData();
    await this.SetUserData();
    await this.GetAppCustPersonalJobData();
    this.GenerataAppAssetAttr(false);
    await this.bindInscoBranchObj();
    await this.getInsuranceData();
    await this.bindAppInsObj();
    await this.GetRefProdCmptPurposeOfFinancing();    
    await this.bindAssetUsageObj();
    await this.GetRefAssetDocList();
    await this.setFormValidators();

    if (this.EditAppAssetForm.controls['SelfOwner'].value) this.SelfOwnerChange({ 'checked': this.EditAppAssetForm.controls['SelfOwner'].value }, this.EditAppAssetForm.controls['MrOwnerTypeCode'].value);

    if (this.EditAppAssetForm.controls['MrOwnerTypeCode'].value) this.OwnerTypeChange(this.EditAppAssetForm.controls['MrOwnerTypeCode'].value, !this.isFromDB);

    // Self Custom Changes CR Runner KTB 398912
    console.log(this.AppAssetObj);
    let appAssetDsfObj = { Id: this.AppAssetId };
    await this.http.post(URLConstantDsf.GetAppAssetByAppAssetIdDsf, appAssetDsfObj).toPromise().then(
      async (response2) => {
        this.returnAppAssetDsfObj = response2;
        await this.setRunnerActivation();
        if(this.runnerActivationValue.length == 0)
        {
          let keyValueRunner = new KeyValueObj();
          keyValueRunner.Key = response2["RunnerActivation"];
          keyValueRunner.Value = response2["RunnerActivation"];
          this.runnerActivationValue.push(keyValueRunner);
          this.EditAppAssetForm.patchValue({
            selectedRunnerActivation: response2["RunnerActivation"]
          });
          this.EditAppAssetForm.controls.selectedRunnerActivation.disable();
        }
      }
    );
    // End Self Custom Changes CR Runner KTB 398912
    this.onOptionsSelected()
  }

  async SetAssetTypeData()
  {
    await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {Code: this.AppAssetObj.AssetTypeCode}).toPromise().then(
      (response) => {
        for(var i=0;i<response[CommonConstant.ReturnObj].length;i++)
        {
          this.SerialNoLabelList.push(response[CommonConstant.ReturnObj][i].SerialNoLabel)
          this.SerialNoLabelMandatory.push(response[CommonConstant.ReturnObj][i].IsMandatory)
        }
      }
    );
  }

  async SetAssetInformation()
  {
    this.EditAppAssetForm.patchValue({
      ManufacturingYear: this.AppAssetObj.ManufacturingYear,
      MrAssetUsageCode: this.AppAssetObj.MrAssetUsageCode,
      AssetColor: this.AppAssetObj.Color,
      SerialNo1: this.AppAssetObj.SerialNo1,
      SerialNo2: this.AppAssetObj.SerialNo2,
      SerialNo3: this.AppAssetObj.SerialNo3,
      SerialNo4: this.AppAssetObj.SerialNo4,
      SerialNo5: this.AppAssetObj.SerialNo5
    });

    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeAgrStepToCheckSerialMandatoryEaaa }).toPromise().then(
      (response: GeneralSettingObj) => {
        this.ListAgrStepToCheckMandatory = response["GsValue"].split(',')
        if(this.ListAgrStepToCheckMandatory.includes(this.AgrmntCurrStep) == true)
        {
          this.IsCheckSerialMandatory = true;
        }
      });

    if(this.EditAppAssetForm.controls.AssetColor.value != null && this.EditAppAssetForm.controls.AssetColor.value != "")
    {
      this.tempColor = true;
      this.EditAppAssetForm.controls.AssetColor.setValidators(Validators.required);
      this.EditAppAssetForm.controls.AssetColor.updateValueAndValidity();
    }

    if(this.IsCheckSerialMandatory)
    {
      if(this.SerialNoLabelMandatory[0]){
        this.EditAppAssetForm.controls.SerialNo1.setValidators(Validators.required);
        this.EditAppAssetForm.controls.SerialNo1.updateValueAndValidity();
      }
      if(this.SerialNoLabelMandatory[1]){
        this.EditAppAssetForm.controls.SerialNo2.setValidators(Validators.required);
        this.EditAppAssetForm.controls.SerialNo2.updateValueAndValidity();
      }
      if(this.SerialNoLabelMandatory[2]){
        this.EditAppAssetForm.controls.SerialNo3.setValidators(Validators.required);
        this.EditAppAssetForm.controls.SerialNo3.updateValueAndValidity();
      }
      if(this.SerialNoLabelMandatory[3]){
        this.EditAppAssetForm.controls.SerialNo4.setValidators(Validators.required);
        this.EditAppAssetForm.controls.SerialNo4.updateValueAndValidity();
      }
      if(this.SerialNoLabelMandatory[4]){
        this.EditAppAssetForm.controls.SerialNo5.setValidators(Validators.required);
        this.EditAppAssetForm.controls.SerialNo5.updateValueAndValidity();
      }
    }

    await this.http.post(URLConstant.GetListRefChangeItem, {}).toPromise().then(
      (response) => {
        var refChangeItemList = response[CommonConstant.ReturnObj]
        var changeItemSerial1Exist = false;
        var changeItemSerial2Exist = false;
        var changeItemSerial3Exist = false;
        var changeItemSerial4Exist = false;
        var changeItemSerial5Exist = false;
        var changeItemManufacturExist = false;
        var changeItemColorExist = false;
        for(var i=0;i<refChangeItemList.length;i++)
        {
          if(refChangeItemList[i].ChangeItemCode == CommonConstant.ChangeItemCodeAssetDataSerialNo1)
          {
            changeItemSerial1Exist = true;
            if(refChangeItemList[i].IsActive == false){this.EditAppAssetForm.controls.SerialNo1.disable()}
          }

          if(refChangeItemList[i].ChangeItemCode == CommonConstant.ChangeItemCodeAssetDataSerialNo2)
          {
            changeItemSerial2Exist = true;
            if(refChangeItemList[i].IsActive == false){this.EditAppAssetForm.controls.SerialNo2.disable()}
          }

          if(refChangeItemList[i].ChangeItemCode == CommonConstant.ChangeItemCodeAssetDataSerialNo3)
          {
            changeItemSerial3Exist = true;
            if(refChangeItemList[i].IsActive == false){this.EditAppAssetForm.controls.SerialNo3.disable()}
          }

          if(refChangeItemList[i].ChangeItemCode == CommonConstant.ChangeItemCodeAssetDataSerialNo4)
          {
            changeItemSerial4Exist = true;
            if(refChangeItemList[i].IsActive == false){this.EditAppAssetForm.controls.SerialNo4.disable()}
          }

          if(refChangeItemList[i].ChangeItemCode == CommonConstant.ChangeItemCodeAssetDataSerialNo5)
          {
            changeItemSerial5Exist = true;
            if(refChangeItemList[i].IsActive == false){this.EditAppAssetForm.controls.SerialNo5.disable()}
          }

          if(refChangeItemList[i].ChangeItemCode == CommonConstant.ChangeItemCodeAssetDataManufacturYear)
          {
            changeItemManufacturExist = true;
            if(refChangeItemList[i].IsActive == false){this.EditAppAssetForm.controls.ManufacturingYear.disable()}
          }

          if(refChangeItemList[i].ChangeItemCode == CommonConstant.ChangeItemCodeAssetDataColor)
          {
            changeItemColorExist = true;
            if(refChangeItemList[i].IsActive == false){this.EditAppAssetForm.controls.AssetColor.disable()}
          }
        }

        if(changeItemColorExist == false){this.EditAppAssetForm.controls.AssetColor.disable()}
        if(changeItemManufacturExist == false){this.EditAppAssetForm.controls.ManufacturingYear.disable()}
        if(changeItemSerial1Exist == false){this.EditAppAssetForm.controls.SerialNo1.disable()}
        if(changeItemSerial2Exist == false){this.EditAppAssetForm.controls.SerialNo2.disable()}
        if(changeItemSerial3Exist == false){this.EditAppAssetForm.controls.SerialNo3.disable()}
        if(changeItemSerial4Exist == false){this.EditAppAssetForm.controls.SerialNo4.disable()}
        if(changeItemSerial5Exist == false){this.EditAppAssetForm.controls.SerialNo5.disable()}
      }
    );

  }

  onOptionsSelected(){
    if(this.npwpOrKtp.includes(this.EditAppAssetForm.controls.MrIdTypeCode.value)){
      this.EditAppAssetForm.controls.OwnerIdNo.setValidators([Validators.required,Validators.maxLength(16),Validators.minLength(16),Validators.pattern("^[0-9]+$")])
    }
    else{
      this.EditAppAssetForm.controls.OwnerIdNo.setValidators(Validators.maxLength(50))
    }
    this.EditAppAssetForm.controls.OwnerIdNo.updateValueAndValidity();
  }

  async GetAppData() {
    let reqGetAppById : GenericObj = new GenericObj();
    reqGetAppById.Id = this.AppId;
    await this.http.post<NapAppModel>(URLConstant.GetAppById, reqGetAppById).toPromise().then(
      (response) => {
        this.AppObj = response;
      }
    );
  }

  async GetAppCustPersonalJobData() {
    await this.http.post<ResponseJobDataPersonalObj>(URLConstant.GetAppCustPersonalJobData, { Id: this.AppCustObj.AppCustId }).toPromise().then(
      (response) => {
        if (response.AppCustPersonalJobDataObj != null) {
          this.AppCustPersonalJobData = response.AppCustPersonalJobDataObj;
        }
      }
    );
  }

  async GetRefProdCmptPurposeOfFinancing() {
    let tempAppObj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    tempAppObj.ProdOfferingCode = this.AppObj.ProdOfferingCode;
    tempAppObj.RefProdCompntCode = CommonConstant.RefProdCompntCodePurposeOfFinancing;
    tempAppObj.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, tempAppObj).toPromise().then(
      (response: any) => {
        this.RefProdCmptPurposeOfFinancing = response;
      }
    );
  }
  
  bindIdTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  bindUserOwnerRelationshipObj() {
    if (this.CustType == CommonConstant.CustTypePersonal) {
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    }
    else {
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
    }
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.UserRelationObj = response[CommonConstant.ReturnObj];
        this.OwnerRelationObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  setAddrOwnerObj() {
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();

    this.ownerAddrObj = new AddrObj();
    this.ownerAddrObj.Addr = this.AppCollateralRegistrationObj.OwnerAddr;
    this.ownerAddrObj.AreaCode1 = this.AppCollateralRegistrationObj.OwnerAreaCode1;
    this.ownerAddrObj.AreaCode2 = this.AppCollateralRegistrationObj.OwnerAreaCode2;
    this.ownerAddrObj.AreaCode3 = this.AppCollateralRegistrationObj.OwnerAreaCode3;
    this.ownerAddrObj.AreaCode4 = this.AppCollateralRegistrationObj.OwnerAreaCode4;
    this.ownerAddrObj.City = this.AppCollateralRegistrationObj.OwnerCity;


    this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AppCollateralRegistrationObj.OwnerZipcode;
    this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AppCollateralRegistrationObj.OwnerZipcode };
    this.inputAddressObjForOwner.default = this.ownerAddrObj;
    this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
  }

  async SelfOwnerChange(event, OwnerType: string = this.CustType) {
    if (event.checked == true) {
      this.EditAppAssetForm.patchValue({
        OwnerName: this.AppCustObj.CustName,
        MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
        OwnerIdNo: this.AppCustObj.IdNo,
        MrOwnerRelationshipCode: CommonConstant.SelfCustomer,
        OwnerAddr: this.AddrLegalObj[0].Addr,
        OwnerAreaCode1: this.AddrLegalObj[0].AreaCode1,
        OwnerAreaCode2: this.AddrLegalObj[0].AreaCode2,
        OwnerAreaCode3: this.AddrLegalObj[0].AreaCode3,
        OwnerAreaCode4: this.AddrLegalObj[0].AreaCode4,
        OwnerCity: this.AddrLegalObj[0].City,
        OwnerZipcode: this.AddrLegalObj[0].Zipcode,
        OwnerMobilePhnNo: typeof (this.AppCustObj.MobilePhnNo1) != 'undefined' ? this.AppCustObj.MobilePhnNo1 : '',
        OwnerAddrType: CommonConstant.AddrTypeLegal,
        OwnerProfessionCode: this.AppCustPersonalJobData.MrProfessionCode,
        MrOwnerTypeCode: OwnerType
      });
      this.inputFieldOwnerAddrObj = new InputFieldObj();
      this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
      this.ownerAddrObj = new AddrObj();
      this.ownerAddrObj.Addr = this.AddrLegalObj[0].Addr;
      this.ownerAddrObj.AreaCode1 = this.AddrLegalObj[0].AreaCode1;
      this.ownerAddrObj.AreaCode2 = this.AddrLegalObj[0].AreaCode2;
      this.ownerAddrObj.AreaCode3 = this.AddrLegalObj[0].AreaCode3;
      this.ownerAddrObj.AreaCode4 = this.AddrLegalObj[0].AreaCode4;
      this.ownerAddrObj.City = this.AddrLegalObj[0].City;
      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AddrLegalObj[0].Zipcode;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrLegalObj[0].Zipcode };
      this.inputAddressObjForOwner.default = this.ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
      this.InputLookupProfessionObj.nameSelect = this.AppCustPersonalJobData.MrProfessionName;
      this.InputLookupProfessionObj.jsonSelect = { ProfessionName: this.AppCustPersonalJobData.MrProfessionName };

      this.inputFieldOwnerAddrObj.inputLookupObj.isDisable = true;
      this.InputLookupProfessionObj.isDisable = true;
      this.EditAppAssetForm.controls["OwnerName"].disable();
      this.EditAppAssetForm.controls["MrIdTypeCode"].disable();
      this.EditAppAssetForm.controls["OwnerIdNo"].disable();
      this.EditAppAssetForm.controls["MrOwnerRelationshipCode"].disable();
      this.EditAppAssetForm.controls["OwnerMobilePhnNo"].disable();
      this.EditAppAssetForm.controls["ownerData"].disable();
      this.EditAppAssetForm.controls["OwnerAddrType"].disable();
      this.EditAppAssetForm.controls["MrOwnerTypeCode"].disable();
      this.isReadOnly = true
    } else {
      this.inputFieldOwnerAddrObj.inputLookupObj.isDisable = false;
      this.InputLookupProfessionObj.isDisable = false;
      this.EditAppAssetForm.controls["OwnerName"].enable();
      this.EditAppAssetForm.controls["MrIdTypeCode"].enable();
      this.EditAppAssetForm.controls["OwnerIdNo"].enable();
      this.EditAppAssetForm.controls["MrOwnerRelationshipCode"].enable();
      this.EditAppAssetForm.controls["OwnerMobilePhnNo"].enable();
      this.EditAppAssetForm.controls["ownerData"].enable();
      this.EditAppAssetForm.controls["OwnerAddrType"].enable();
      this.EditAppAssetForm.controls["MrOwnerTypeCode"].enable();
      this.isReadOnly = false
    };
  }

  async SelfUsageChange(event) {
    if (event.checked == true) {
      this.EditAppAssetForm.patchValue({
        UserName: this.AppCustObj.CustName,
        MrUserRelationshipCode: CommonConstant.SelfCustomer,
      });

      this.EditAppAssetForm.controls.UserName.clearValidators();
      this.EditAppAssetForm.controls.UserName.updateValueAndValidity();
      this.EditAppAssetForm.controls.MrUserRelationshipCode.clearValidators();
      this.EditAppAssetForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.EditAppAssetForm.controls["UserName"].disable();
      this.EditAppAssetForm.controls["MrUserRelationshipCode"].disable();
    };
    if (event.checked == false) {
      this.EditAppAssetForm.controls.UserName.setValidators([Validators.required, Validators.maxLength(500)]);
      this.EditAppAssetForm.controls.UserName.updateValueAndValidity();
      this.EditAppAssetForm.controls.MrUserRelationshipCode.setValidators([Validators.required, Validators.maxLength(50)]);
      this.EditAppAssetForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.EditAppAssetForm.controls["UserName"].enable();
      this.EditAppAssetForm.controls["MrUserRelationshipCode"].enable();
    };
  }

  copyToOwnerAddr() {
    if (this.copyFromAppCustAddrForOwner != "") {
      this.AddrObj = this.AppCustAddrObj.filter(
        emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForOwner);

      this.EditAppAssetForm.patchValue({
        OwnerAddr: this.AddrObj[0].Addr,
        OwnerAreaCode1: this.AddrObj[0].AreaCode1,
        OwnerAreaCode2: this.AddrObj[0].AreaCode2,
        OwnerAreaCode3: this.AddrObj[0].AreaCode3,
        OwnerAreaCode4: this.AddrObj[0].AreaCode4,
        OwnerCity: this.AddrObj[0].City,
        OwnerZipcode: this.AddrObj[0].Zipcode
      });
      this.ownerAddrObj = new AddrObj();
      this.ownerAddrObj.Addr = this.AddrObj[0].Addr;
      this.ownerAddrObj.AreaCode1 = this.AddrObj[0].AreaCode1;
      this.ownerAddrObj.AreaCode2 = this.AddrObj[0].AreaCode2;
      this.ownerAddrObj.AreaCode3 = this.AddrObj[0].AreaCode3;
      this.ownerAddrObj.AreaCode4 = this.AddrObj[0].AreaCode4;
      this.ownerAddrObj.City = this.AddrObj[0].City;
      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.EditAppAssetForm.controls.OwnerZipcode.value;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.EditAppAssetForm.controls.OwnerZipcode.value };
      this.inputAddressObjForOwner.default = this.ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
    }
  }

  SetOwnerAddrType(event: string) {
    this.copyFromAppCustAddrForOwner = event;
  }

  async GetAppCust() {
    var appObj = {
      Id: this.AppId,
    };
    await this.http.post(URLConstant.GetCustDataByAppId, appObj).toPromise().then(
      async (response: AppCustObj) => {
        this.AppCustObj = response['AppCustObj'];
        if(response['AppCustPersonalObj'] != undefined && response['AppCustPersonalObj'] != null)
          this.AppCustObj.MobilePhnNo1 = response['AppCustPersonalObj']['MobilePhnNo1'];

        this.CustType = this.AppCustObj.MrCustTypeCode;
        if (this.CustType == CommonConstant.CustTypePersonal) {
          this.EditAppAssetForm.controls.MrIdTypeCode.setValidators([Validators.required, Validators.maxLength(50)]);
          this.EditAppAssetForm.controls.MrIdTypeCode.updateValueAndValidity();
        }
        await this.OwnerTypeChange(this.CustType, true);
      }
    );
  }

  async GetListAddr() {
    var reqAppCustAddrObj = { Id: this.AppId };
    await this.http.post(URLConstant.GetListAppCustAddrByAppId, reqAppCustAddrObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AddrLegalObj = this.AppCustAddrObj.filter(
          emp => emp.MrCustAddrTypeCode === CommonConstant.AddrTypeLegal);
      }
    );
  }

  GetProfession(event) {
    this.EditAppAssetForm.patchValue({
      OwnerProfessionCode: event.ProfessionCode
    });
  }

  async SetOwnerData() {
    this.EditAppAssetForm.patchValue({
      // SelfOwner: (this.AppCollateralRegistrationObj.MrOwnerRelationshipCode == "SELF"),
      OwnerName: this.AppCollateralRegistrationObj.OwnerName,
      MrIdTypeCode: this.AppCollateralRegistrationObj.MrIdTypeCode,
      OwnerIdNo: this.AppCollateralRegistrationObj.OwnerIdNo,
      MrOwnerRelationshipCode: this.AppCollateralRegistrationObj.MrOwnerRelationshipCode,
      OwnerAddr: this.AppCollateralRegistrationObj.OwnerAddr,
      OwnerAreaCode1: this.AppCollateralRegistrationObj.OwnerAreaCode1,
      OwnerAreaCode2: this.AppCollateralRegistrationObj.OwnerAreaCode2,
      OwnerAreaCode3: this.AppCollateralRegistrationObj.OwnerAreaCode3,
      OwnerAreaCode4: this.AppCollateralRegistrationObj.OwnerAreaCode4,
      OwnerCity: this.AppCollateralRegistrationObj.OwnerCity,
      OwnerZipcode: this.AppCollateralRegistrationObj.OwnerZipcode,
      OwnerMobilePhnNo: this.AppCollateralRegistrationObj.OwnerMobilePhnNo,
      OwnerProfessionCode: this.AppCollateralRegistrationObj.OwnerProfessionCode,
      MrOwnerTypeCode: this.AppCollateralRegistrationObj.MrOwnerTypeCode
    });
  }

  async SetUserData() {
    this.EditAppAssetForm.patchValue({
      UserName: this.AppCollateralRegistrationObj.UserName,
      MrUserRelationshipCode: this.AppCollateralRegistrationObj.MrUserRelationshipCode
    });
  }

  GenerataAppAssetAttr(isRefresh: boolean) {
    var GenObj =
      {
        AppAssetId: this.AppAssetObj.AppAssetId,
        AssetTypeCode: this.RefProdCmptAssetType.CompntValue,
        AttrTypeCode: CommonConstant.AttrTypeCodeTrx,
        IsRefresh: isRefresh
      };
    this.http.post(URLConstant.GenerateAppAssetAttrForEditAppAftApv, GenObj).subscribe(
      (response) => {
        this.AppAssetAttrObj = response['ResponseAppAssetAttrObjs'];

        this.GenerateAppAssetAttrForm();
      });
  }

  refreshAttr() {
    this.isAssetAttrReady = false;
    this.GenerataAppAssetAttr(true);
  }

  GenerateAppAssetAttrForm() {
    if (this.AppAssetAttrObj != null) {
      this.appAssetAttrObjs = new Array<AppAssetAttrCustomObj>();
      for (let i = 0; i < this.AppAssetAttrObj.length; i++) {
        this.ListAttrAnswer.push([]);
        var appAssetAttrObj = new AppAssetAttrCustomObj();
        appAssetAttrObj.AssetAttrCode = this.AppAssetAttrObj[i].AttrCode;
        appAssetAttrObj.AssetAttrName = this.AppAssetAttrObj[i].AttrName;

        //find prev edited value
        let prevEditedAttr;
        if (this.ListAppAssetAttrObjs) prevEditedAttr = this.ListAppAssetAttrObjs.filter(x => x.AssetAttrCode == appAssetAttrObj.AssetAttrCode)[0];
        appAssetAttrObj.AttrValue = prevEditedAttr ? prevEditedAttr['AttrValue'] : this.AppAssetAttrObj[i].AttrValue;

        appAssetAttrObj.AttrInputType = this.AppAssetAttrObj[i].AttrInputType;
        appAssetAttrObj.AttrLength = this.AppAssetAttrObj[i].AttrLength;
        if (this.AppAssetAttrObj[i].AttrQuestionValue != null) {
          this.ListAttrAnswer[i].push(this.AppAssetAttrObj[i].AttrQuestionValue);
          if (appAssetAttrObj.AttrValue == null) {
            appAssetAttrObj.AttrValue = this.AppAssetAttrObj[i].AttrQuestionValue[0]
          }
        }
        else {
          this.ListAttrAnswer[i].push("");
        }
        this.appAssetAttrObjs.push(appAssetAttrObj);

      }
      var listAppAssetAttrs = this.EditAppAssetForm.controls["AppAssetAttrObjs"] as FormArray;
      while (listAppAssetAttrs.length !== 0) {
        listAppAssetAttrs.removeAt(0);
      }
      for (let j = 0; j < this.appAssetAttrObjs.length; j++) {
        listAppAssetAttrs.push(this.addGroupAppAssetAttr(this.appAssetAttrObjs[j], j));
      }
      this.isAssetAttrReady = true;
    }

  }

  private setFbGroupAssetAttribute(appAssetAttrObj: AppAssetAttrCustomObj, i: number, ListValidator: Array<ValidatorFn>) {
    let tempFB = this.fb.group({
      No: [i],
      AssetAttrCode: [appAssetAttrObj.AssetAttrCode],
      AssetAttrName: [appAssetAttrObj.AssetAttrName],
      AttrInputType: [appAssetAttrObj.AttrInputType],
      AttrValue: [appAssetAttrObj.AttrValue]
    });
    if (ListValidator.length > 0) {
      tempFB.get("AttrValue").setValidators(ListValidator);
    }

    return tempFB;
  }

  private setValidators(appAssetAttrObjs: AppAssetAttrCustomObj) {
    let ListValidator: Array<ValidatorFn> = new Array<ValidatorFn>();

    if (appAssetAttrObjs.AttrLength != null && appAssetAttrObjs.AttrLength != 0) {
      ListValidator.push(Validators.maxLength(appAssetAttrObjs.AttrLength));
    }

    return ListValidator;
  }

  addGroupAppAssetAttr(appAssetAttrObj: AppAssetAttrCustomObj, i: number) {
    let ListValidator: Array<ValidatorFn> = this.setValidators(appAssetAttrObj);

    return this.setFbGroupAssetAttribute(appAssetAttrObj, i, ListValidator);
  }

  async GetRefProdCompt() {
    var appObj : ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    appObj.ProdOfferingCode = this.AppObj.ProdOfferingCode,
      appObj.RefProdCompntCode = CommonConstant.RefProdCompntAssetType,
      appObj.ProdOfferingVersion = this.AppObj.ProdOfferingVersion,

      await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
        (response: ProdOfferingDObj) => {
          this.RefProdCmptAssetType = response;
        }
      );

  }

  async bindInscoBranchObj() {
    let ReqInscoBranchObj : ReqGetVendorByCategoryCodeAndOfficeCodeObj = new ReqGetVendorByCategoryCodeAndOfficeCodeObj();
    ReqInscoBranchObj.MrVendorCategory = CommonConstant.VendorCategoryAssetInscoBranch;
    ReqInscoBranchObj.OfficeCode =  this.AppObj.OriOfficeCode;
    await this.http.post(URLConstant.GetListKeyValueActiveVendorByCategoryCodeAndOfficeCode, ReqInscoBranchObj).toPromise().then(
      (response) => {
        this.inscoBranchObj = response[CommonConstant.ReturnObj];
        if (this.inscoBranchObj.length > 0 && this.inscoBranchObj.length == 1) {
          this.EditAppAssetForm.patchValue({
            InscoBranchCode: this.inscoBranchObj[0].Key,
            InscoBranchName: this.inscoBranchObj[0].Value
          });
        }
      }
    );
  }

  async getInsuranceData() {
    const reqObj = {
      AppId: this.AppId,
      AppAssetId: this.AppAssetId
    }
    await this.http.post(URLConstant.GetInsDataByAppIdAndAssetId, reqObj).toPromise().then(
      (response) => {
        // this.appObj = response["AppObj"];
        // this.appAssetObj = response["AppAssetObj"];
        // this.appAssetAccessoryObjs = response["AppAssetAccessoryObjs"];
        // this.appFinDataObj = response["AppFinDataObj"];
        // this.appInsuranceObj = response["AppInsuranceObj"];
        this.appInsObjObj = response["AppInsObjObj"];
        // this.appInsMainCvgObj = response["AppInsMainCvgObjs"];
        // this.appCollateralObj = response["AppCollateralObj"];
        // this.appCollateralAccessoryObjs = response["AppCollateralAccessoryObjs"];
        // this.defaultInsAssetRegion = response["DefaultInsAssetRegion"];

        // if(this.appCollateralAccessoryObjs.length > 0){
        //   var totalAccessoryPriceAmt = 0;

        //   for (let i = 0; i < this.appCollateralAccessoryObjs.length; i++) {
        //     totalAccessoryPriceAmt += this.appCollateralAccessoryObjs[i].AccessoryPriceAmt;
        //   }

        //   this.totalAssetPriceAmt = this.appCollateralObj.CollateralValueAmt + totalAccessoryPriceAmt;
        // }else{
        //   this.totalAssetPriceAmt = this.appCollateralObj.CollateralValueAmt
        // }

        // if (this.appFinDataObj != undefined) {
        //   this.InsuranceDataForm.patchValue({
        //     CvgAmt: this.appCollateralObj.CollateralValueAmt,
        //     CustCvgAmt: this.appCollateralObj.CollateralValueAmt
        //   });
        // }
        // if (this.appAssetObj != undefined) {
        //   this.appAssetId = this.appAssetObj.AppAssetId;
        // }
        // if (this.appCollateralObj != undefined) {
        //   this.appCollateralId = this.appCollateralObj.AppCollateralId;
        // }
      });
  }

  InscoBranchCodeChanged(event) {
    if (event.target.value != "") {
      this.EditAppAssetForm.patchValue({
        InscoBranchName: this.inscoBranchObj.find(x => x.Key == event.target.value).Value
      });
    } else {
      this.EditAppAssetForm.patchValue({
        InscoBranchName: ""
      });
    }
  }

  async bindAppInsObj() {
    if (this.appInsObjObj != null) {
      switch(this.appInsObjObj.InsAssetCoveredBy){
        case CommonConstant.InsuredByCustomer:
          this.EditAppAssetForm.patchValue({
            InscoBranchCode: "",
            InscoBranchName: this.appInsObjObj.CustInscoBranchName,
          });
          break;
        case CommonConstant.InsuredByCompany:
          this.EditAppAssetForm.patchValue({
            InscoBranchCode: this.appInsObjObj.InscoBranchCode,
            InscoBranchName: this.appInsObjObj.InscoBranchName,
          });
          break;
      }
    }
  }

  async setFormValidators() {
    switch(this.appInsObjObj.InsAssetCoveredBy){
      case CommonConstant.InsuredByOffSystem:
        this.EditAppAssetForm.controls.InscoBranchCode.clearValidators();
        this.EditAppAssetForm.controls.InscoBranchName.clearValidators();
        break;
      case CommonConstant.InsuredByCustomer:
        this.EditAppAssetForm.controls.InscoBranchCode.clearValidators();
        this.EditAppAssetForm.controls.InscoBranchName.setValidators([Validators.required]);
        break;
      case CommonConstant.InsuredByCompany:
        this.EditAppAssetForm.controls.InscoBranchCode.setValidators([Validators.required]);
        this.EditAppAssetForm.controls.InscoBranchName.clearValidators();
        break;
    }
    this.EditAppAssetForm.controls.InscoBranchCode.updateValueAndValidity();
    this.EditAppAssetForm.controls.InscoBranchName.updateValueAndValidity();
  }

  CancelClick() {
    this.outputPage.emit({ pageType: "cancelAssetData" });
  }

  async SaveData() {
    let ArraySerial = [this.EditAppAssetForm.controls.SerialNo1.value, this.EditAppAssetForm.controls.SerialNo2.value, 
    this.EditAppAssetForm.controls.SerialNo3.value, this.EditAppAssetForm.controls.SerialNo4.value, this.EditAppAssetForm.controls.SerialNo5.value];

    for(let i = 0; i < ArraySerial.length; i++){
      if(ArraySerial[i] == ""){
        continue;
      }
      else if(ArraySerial[i] == null){
        continue;
      }
      let x = ArraySerial.filter(f=>f == ArraySerial[i])

      if(x.length > 1){
        this.toastr.warningMessage("Serial number can't duplicate");
        return;
      }
    }

    // region: additional validation transaction leasseback
    let purposeOfFinancing = '';
    const prodOffferingPOFRequestObj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion,
      RefProdCompntCode: CommonConstant.RefProdCompntCodePurposeOfFinancing
    }
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, prodOffferingPOFRequestObj).toPromise().then((res) =>{
      const componentValue = res['CompntValue']
      if(componentValue !== null){
        purposeOfFinancing = componentValue
      }
    });

    let wayOfFinancing = '';
    const prodOffferingWOFRequestObj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion,
      RefProdCompntCode: CommonConstant.RefProdCompntCodeWayOfFinancing
    }
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, prodOffferingWOFRequestObj).toPromise().then((res) =>{
      const componentValue = res['CompntValue']
      if(componentValue !== null){
        wayOfFinancing = componentValue
      }
    });

    const errorMessage: string = await this.CheckValidationTransactionLeasseback(this.AppObj.Tenor, purposeOfFinancing, wayOfFinancing)
    if(errorMessage !== ''){
      this.toastr.warningMessage(errorMessage);
      return;
    }

    this.AppAssetRelatedOutput =
      {
        AppAssetId: this.AppAssetObj.AppAssetId,
        AppAssetObj:
          {
            ManufacturingYear: this.EditAppAssetForm.controls.ManufacturingYear.value,
            MrAssetUsageCode: this.EditAppAssetForm.controls.MrAssetUsageCode.value,
            Color:this.EditAppAssetForm.controls.AssetColor.value,
            SerialNo1: this.EditAppAssetForm.controls.SerialNo1.value,
            SerialNo2: this.EditAppAssetForm.controls.SerialNo2.value,
            SerialNo3: this.EditAppAssetForm.controls.SerialNo3.value,
            SerialNo4: this.EditAppAssetForm.controls.SerialNo4.value,
            SerialNo5: this.EditAppAssetForm.controls.SerialNo5.value
          },
        AppCollateralRegistrationObj:
          {
            AppCollateralRegistrationId: this.AppCollateralRegistrationObj.AppCollateralRegistrationId,
            OwnerName: this.EditAppAssetForm.controls.OwnerName.value,
            MrIdTypeCode: this.EditAppAssetForm.controls.MrIdTypeCode.value,
            MrOwnerRelationshipCode: this.EditAppAssetForm.controls.MrOwnerRelationshipCode.value,
            OwnerIdNo: this.EditAppAssetForm.controls.OwnerIdNo.value,
            OwnerAddrType: this.EditAppAssetForm.controls.OwnerAddrType.value,
            OwnerMobilePhnNo: this.EditAppAssetForm.controls.OwnerMobilePhnNo.value,
            OwnerAddr: this.EditAppAssetForm.controls.ownerData['controls'].Addr.value,
            OwnerAreaCode1: this.EditAppAssetForm.controls.ownerData['controls'].AreaCode1.value,
            OwnerAreaCode2: this.EditAppAssetForm.controls.ownerData['controls'].AreaCode2.value,
            OwnerAreaCode3: this.EditAppAssetForm.controls.ownerData['controls'].AreaCode3.value,
            OwnerAreaCode4: this.EditAppAssetForm.controls.ownerData['controls'].AreaCode4.value,
            OwnerCity: this.EditAppAssetForm.controls.ownerData['controls'].City.value,
            OwnerZipcode: this.EditAppAssetForm.controls.OwnerZipcode.value,
            MrOwnerTypeCode: this.EditAppAssetForm.controls.MrOwnerTypeCode.value,
            OwnerProfessionCode: this.EditAppAssetForm.controls.OwnerProfessionCode.value,
            UserName: this.EditAppAssetForm.controls.UserName.value,
            MrUserRelationshipCode: this.EditAppAssetForm.controls.MrUserRelationshipCode.value
          },
        AppAssetAttrObjs: [],
        AppInsObj:
          {
            InsAssetCoverPeriod: '-',
            InsAssetCoveredBy: this.appInsObjObj.InsAssetCoveredBy,
            InscoBranchCode: "",
            InscoBranchName: "",
          },
      AppCollateralDocsObj: []
      }

    for (var i = 0; i < this.EditAppAssetForm.controls.ListDoc.value.length; i++) {
      var listDoc = {
        DocNo: this.EditAppAssetForm.controls.ListDoc.value[i].DocNo,
        DocNotes: this.EditAppAssetForm.controls.ListDoc.value[i].DocNotes,
        ExpiredDt: this.EditAppAssetForm.controls.ListDoc.value[i].ACDExpiredDt == "" ? "" : formatDate(this.EditAppAssetForm.controls.ListDoc.value[i].ACDExpiredDt, 'yyyy-MM-dd', 'en-US'),
        IsReceived: this.EditAppAssetForm.controls.ListDoc.value[i].IsReceived,
        RowVersion: this.EditAppAssetForm.controls.ListDoc.value[i].RowVersion
      }
      this.AppAssetRelatedOutput.AppCollateralDocsObj.push(listDoc);
    }
    
    var listAppAssetAttrs = this.EditAppAssetForm.controls["AppAssetAttrObjs"] as FormArray;

    for (var i = 0; i < listAppAssetAttrs.length; i++) {
      const assetAttr = listAppAssetAttrs.at(i).value;

      var appAssetAttr =
        {
          AssetAttrCode: assetAttr.AssetAttrCode,
          AssetAttrName: assetAttr.AssetAttrName,
          AttrValue: assetAttr.AttrValue
        }

      this.AppAssetRelatedOutput.AppAssetAttrObjs.push(appAssetAttr);
    }

    switch(this.appInsObjObj.InsAssetCoveredBy){
      case CommonConstant.InsuredByOffSystem:
        this.AppAssetRelatedOutput.AppInsObj =
          {
            InscoBranchCode: "",
            InscoBranchName: "",
            InsAssetCoverPeriod: '-',
            InsAssetCoveredBy: '-',
          };
        break;
      case CommonConstant.InsuredByCustomer:
        this.AppAssetRelatedOutput.AppInsObj =
          {
            InscoBranchCode: "",
            InscoBranchName: this.EditAppAssetForm.controls.InscoBranchName.value,
            InsAssetCoverPeriod: this.appInsObjObj.InsAssetCoverPeriod,
            InsAssetCoveredBy: this.appInsObjObj.InsAssetCoveredBy
          };
        break;
      case CommonConstant.InsuredByCompany:
        this.AppAssetRelatedOutput.AppInsObj =
          {
            InscoBranchCode: this.EditAppAssetForm.controls.InscoBranchCode.value,
            InscoBranchName: this.EditAppAssetForm.controls.InscoBranchName.value,
            InsAssetCoverPeriod: this.appInsObjObj.InsAssetCoverPeriod,
            InsAssetCoveredBy: this.appInsObjObj.InsAssetCoveredBy
          };
        break;
    }

    this.outputPage.emit({ AppAssetRelatedOutput: this.AppAssetRelatedOutput, pageType: "submitAssetData" });
  }
  
  async CheckValidationTransactionLeasseback(tenor: number, purposeOfFinancing: string, wayOfFinancing: string){
    let errorMessage: string = '';

    // Get Attribute Tag Color
    let attrPlatColor: string | null | undefined = '';
    for (let i = 0; i < this.EditAppAssetForm.controls.AppAssetAttrObjs['controls'].length; i++) {
      const attribute = this.EditAppAssetForm.controls.AppAssetAttrObjs['controls'][i];
      if(attribute['controls']['AssetAttrCode'].value === CommonConstantX.APP_ASSET_ATTRIBUTE_PLAT_COLOR){
        attrPlatColor = attribute['controls']['AttrValue'].value;
        break;
      }
    }

    if(attrPlatColor === '' || attrPlatColor === null || attrPlatColor === undefined){
      // Return error message for plat color not selected at select option input
      return 'Asset Attribute Plat Color is not selected';
    }

    // Get GS Tenor
    let arrMinTenorAssetFL: any[]
    const minTenorAssetFLRequestObj = {
      Code: CommonConstantX.GsCodeMinTenorAssetFL
    }
    await this.http.post(URLConstant.GetGeneralSettingByCode, minTenorAssetFLRequestObj).toPromise().then((res) =>{
      const GsValue = res['GsValue']
      if(GsValue !== null){
        let tempArr: any[] = GsValue.split(";")
        if(tempArr.length > 0){
          for (let i = 0; i < tempArr.length; i++) {
            tempArr[i] = tempArr[i].split(":")
          }
        }
        arrMinTenorAssetFL = tempArr
      }
    });

    // Get GS Map POF n WOF
    let arrMapPofWofFL: string[] = [];
    const MapPofWofFLRequestObj = {
      Code: CommonConstantX.GsCodeMapPofWofFL
    }
    await this.http.post(URLConstant.GetGeneralSettingByCode, MapPofWofFLRequestObj).toPromise().then((res) =>{
      const GsValue = res['GsValue']
      if(GsValue !== null){
        arrMapPofWofFL = GsValue.split(";")
      }
    });

    const mapPofWof = purposeOfFinancing+":"+wayOfFinancing;
    for (let i = 0; i < arrMapPofWofFL.length; i++) {
      if(mapPofWof === arrMapPofWofFL[i]){
        for (let x = 0; x < arrMinTenorAssetFL.length; x++) {
          const gsPlatColor = arrMinTenorAssetFL[x][0];
          const gsTenorMonth = arrMinTenorAssetFL[x][1];
          if(attrPlatColor === gsPlatColor && tenor < gsTenorMonth){
            let messageColor = 'Yellow';
            if(attrPlatColor === 'BLACK' || attrPlatColor === 'WHITE'){
              messageColor = 'Black/White'
            }
            errorMessage = `Plat Color ${messageColor} must have minimum tenor of ${gsTenorMonth}`
            break;
          }
        }
      }
    }
    
    return errorMessage
  }

  async bindAssetUsageObj() {
    let reqByCode: GenericObj = new GenericObj();
    await this.GetRefProdCmptPurposeOfFinancing();
    reqByCode.Code = this.RefProdCmptPurposeOfFinancing.CompntValue;
    await this.http.post(URLConstant.GetListKeyValueAssetUsageByPurposeOfFinCode, reqByCode).subscribe(
      (response) => {
        this.AssetUsageObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async bindOwnerTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.OwnerTypeObj = response[CommonConstant.ReturnObj];
        this.EditAppAssetForm.patchValue({
          MrOwnerTypeCode : this.CustType
        });
      }
    );
  }

  async bindCompanyTypeObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCompanyType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.OwnerProfessionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async OwnerTypeChange(OwnerType: string, IsOwnerTypeChanged: boolean = false){
    if(OwnerType == CommonConstant.CustTypePersonal){
      if(IsOwnerTypeChanged){
        this.EditAppAssetForm.patchValue({
          OwnerProfessionCode : ""
        });

        this.InputLookupProfessionObj.nameSelect = "";
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
      }else{
        let reqByCode: GenericObj = new GenericObj();
        reqByCode.Code = this.AppCollateralRegistrationObj.OwnerProfessionCode;

        await this.http.post(URLConstant.GetRefProfessionByCode, reqByCode).toPromise().then(
          (response) =>{
            this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response["ProfessionName"] };
          }
        );
      }
    }else{
      if(IsOwnerTypeChanged){
        this.EditAppAssetForm.patchValue({
          OwnerProfessionCode : ""
        });
      }else{
        this.EditAppAssetForm.patchValue({
          OwnerProfessionCode : this.AppCollateralRegistrationObj.OwnerProfessionCode
        });
      }
    }
  }

  async SetAssetDocument() {
    let isChangedDataExists = false;
    let currAssetIndex = -1;
    if (this.EditedAssetData.length != 0)
    {
      this.EditedAssetData.forEach((value, index) => {
        if (value['AppAssetId'] == this.AppAssetId)
        {
          currAssetIndex = index;
          isChangedDataExists = true;
        }
      });
    }
    if (isChangedDataExists && currAssetIndex > -1) {
      for (var i = 0; i < this.EditAppAssetForm.controls.ListDoc.value.length; i++){
        let currDoc = this.EditedAssetData[currAssetIndex].AppCollateralDocsObj[i];
        this.EditAppAssetForm.controls.ListDoc["controls"][i].patchValue({
          DocNo: currDoc.DocNo,
          DocNotes: currDoc.DocNotes,
          ACDExpiredDt: currDoc.ExpiredDt == "" ? "" : formatDate(currDoc.ExpiredDt, 'yyyy-MM-dd', 'en-US'),
          IsReceived: currDoc.IsReceived
        });
      }
    } else {
      await this.http.post(URLConstant.GetListAppCollateralDocsByAppCollateralId, { Id: this.AppCollateralId }).toPromise().then(
        (response) => {
          let AppCollateralDocs = new Array();
          AppCollateralDocs = response["AppCollateralDocs"];
          if (AppCollateralDocs["length"] > 0) {
            for (let i = 0; i < AppCollateralDocs.length; i++) {
              let AppCollatralDocId = AppCollateralDocs.findIndex(x => x.DocCode == this.EditAppAssetForm.controls.ListDoc["controls"][i]["controls"].DocCode.value);
  
              this.EditAppAssetForm.controls.ListDoc["controls"][i].patchValue({
                DocNo: AppCollateralDocs[AppCollatralDocId].DocNo,
                DocNotes: AppCollateralDocs[AppCollatralDocId].DocNotes,
                ACDExpiredDt: AppCollateralDocs[AppCollatralDocId].ExpiredDt == null ? "" : formatDate(AppCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                IsReceived: AppCollateralDocs[AppCollatralDocId].IsReceived,
                RowVersion: AppCollateralDocs[AppCollatralDocId].RowVersion,
              })
            }
          }
        });
    }
  }
  async GetRefAssetDocList() {
    await this.http.post(URLConstant.GetRefAssetDocList, { Code: this.AssetTypeCode }).toPromise().then(
      (response) => {
        let ListDoc = this.EditAppAssetForm.get('ListDoc') as FormArray;
        ListDoc.reset();
        while(ListDoc.length) {
          ListDoc.removeAt(0);
        }
        if (response[CommonConstant.ReturnObj].length > 0) {
          for (let i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
            this.RefAssetDocId = response[CommonConstant.ReturnObj][i].RefAssetDocId
            let assetDocumentDetail = this.fb.group({
              DocCode: response[CommonConstant.ReturnObj][i].AssetDocCode,
              AssetDocName: response[CommonConstant.ReturnObj][i].AssetDocName,
              IsValueNeeded: response[CommonConstant.ReturnObj][i].IsValueNeeded,
              IsMandatoryNew: response[CommonConstant.ReturnObj][i].IsMandatoryNew,
              IsMandatoryUsed: response[CommonConstant.ReturnObj][i].IsMandatoryUsed,
              IsReceived: response[CommonConstant.ReturnObj][i].IsReceived,
              DocNo: response[CommonConstant.ReturnObj][i].DocNo,
              ACDExpiredDt: response[CommonConstant.ReturnObj][i].ACDExpiredDt,
              DocNotes: response[CommonConstant.ReturnObj][i].DocNotes,
              RowVersion: "",
            }) as FormGroup;
            ListDoc.push(assetDocumentDetail);
          }
        }
        this.SetAssetDocument();
      });
  }

  // Self Custom Changes CR Runner KTB 398912
  async setRunnerActivation(){
    var requestObj = {
      FullAssetCode: this.AppAssetObj.FullAssetCode,
      AssetCondition: this.AppAssetObj.MrAssetConditionCode,
      CurrAppStep: CommonConstant.AppStepAgr,
      AppNo: this.AppObj.AppNo
    }
    await this.http.post(URLConstantDsf.GetListRunnerActivationDsf, requestObj).toPromise().then(
        async (response) => {
         this.runnerActivationValue = response['ReturnObject'];
    });
  }
  // End Self Custom Changes CR Runner KTB 398912
}
