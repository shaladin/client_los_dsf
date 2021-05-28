import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppAssetAttrCustomObj } from 'app/shared/model/AppAsset/AppAssetAttrCustom.Model';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';
import { ReqGetVendorByCategoryCodeAndOfficeCodeObj } from 'app/shared/model/Request/Vendor/ReqVendor.model';

@Component({
  selector: 'app-edit-app-after-approval-asset-data',
  templateUrl: './edit-app-after-approval-asset-data.component.html',
  styleUrls: ['./edit-app-after-approval-asset-data.component.css']
})
export class EditAppAfterApprovalAssetDataComponent implements OnInit {
  @Input() AppAssetObj: any;
  @Input() ListAppAssetAttrObjs: Array<any>;
  @Input() AppCollateralObj: any;
  @Input() AppCollateralRegistrationObj: any;
  @Input() EditedAssetData: any
  //@Input() AppCollateralAttrObjs = new Array();
  @Output() outputPage: EventEmitter<object> = new EventEmitter();

  EditAppAssetForm = this.fb.group({
    SelfOwner: [false],
    OwnerName: ['', Validators.maxLength(50)],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    MrOwnerRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
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
    AppAssetAttrObjs: this.fb.array([]),
    InscoBranchCode: [''],
    InscoBranchName: [''],
  });

  AppObj: any;
  AppId: any;
  AppCustObj: any;
  appObj = {
    AppId: 0,
  };

  CustType: string = "";
  IdTypeObj: any;
  refMasterObj : RefMasterObj;
  OwnerRelationObj: any;
  AppCustAddrObj: any;
  AddrObj: any;
  AddrLegalObj: any;
  inputFieldOwnerAddrObj: InputFieldObj;
  ownerAddrObj: AddrObj;
  inputAddressObjForOwner: InputAddressObj;
  copyFromAppCustAddrForOwner: any;
  ListAttrAnswer = [];
  AppAssetAttrObj: any;
  appAssetAttrObjs: Array<AppAssetAttrCustomObj>;
  isDiffWithRefAttr: any;
  isAssetAttrReady: boolean = false;
  RefProdCmptAssetType: any;
  inscoBranchObj: Array<KeyValueObj>;
  InsAssetCoveredBy: string = "";
  appInsObjObj: AppInsObjObj;

  AppAssetRelatedOutput: any;
  AppCollateralRegistrationOutput: any;
  AppAssetAttrOutput: any;
  AppInsObjOutput: any;

  constructor(
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private http: HttpClient) { }

  async ngOnInit(): Promise<void> {

    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.showAllPhn = false;
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
    this.ownerAddrObj = new AddrObj();
    this.AppId = this.AppAssetObj.AppId;

    await this.GetAppData();
    await this.GetRefProdCompt();
    this.bindIdTypeObj();
    this.bindUserOwnerRelationshipObj();
    this.setAddrOwnerObj();
    await this.GetListAddr();
    await this.SetOwnerData();
    await this.GetAppCust();
    this.GenerataAppAssetAttr(false);
    await this.bindInscoBranchObj();
    await this.getInsuranceData();
    await this.bindAppInsObj();
    await this.setFormValidators();

    if (this.EditAppAssetForm.controls['SelfOwner'].value) this.SelfOwnerChange({ 'checked': this.EditAppAssetForm.controls['SelfOwner'].value })
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

  async SelfOwnerChange(event) {
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

      this.inputFieldOwnerAddrObj.inputLookupObj.isDisable = true;
      this.EditAppAssetForm.controls["OwnerName"].disable();
      this.EditAppAssetForm.controls["MrIdTypeCode"].disable();
      this.EditAppAssetForm.controls["OwnerIdNo"].disable();
      this.EditAppAssetForm.controls["MrOwnerRelationshipCode"].disable();
      this.EditAppAssetForm.controls["OwnerMobilePhnNo"].disable();
      this.EditAppAssetForm.controls["ownerData"].disable();
      this.EditAppAssetForm.controls["OwnerAddrType"].disable();
    } else {
      this.inputFieldOwnerAddrObj.inputLookupObj.isDisable = false;
      this.EditAppAssetForm.controls["OwnerName"].enable();
      this.EditAppAssetForm.controls["MrIdTypeCode"].enable();
      this.EditAppAssetForm.controls["OwnerIdNo"].enable();
      this.EditAppAssetForm.controls["MrOwnerRelationshipCode"].enable();
      this.EditAppAssetForm.controls["OwnerMobilePhnNo"].enable();
      this.EditAppAssetForm.controls["ownerData"].enable();
      this.EditAppAssetForm.controls["OwnerAddrType"].enable();

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

  SetOwnerAddrType(event) {
    this.copyFromAppCustAddrForOwner = event;
  }

  async GetAppCust() {
    var appObj = {
      Id: this.AppId,
    };
    await this.http.post(URLConstant.GetAppCustByAppId, appObj).toPromise().then(
      (response) => {
        this.AppCustObj = response;
        this.CustType = this.AppCustObj.MrCustTypeCode;
        if (this.CustType == CommonConstant.CustTypePersonal) {
          this.EditAppAssetForm.controls.MrIdTypeCode.setValidators([Validators.required, Validators.maxLength(50)]);
          this.EditAppAssetForm.controls.MrIdTypeCode.updateValueAndValidity();
        }
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

  async SetOwnerData() {
    this.EditAppAssetForm.patchValue({
      SelfOwner: (this.AppCollateralRegistrationObj.MrOwnerRelationshipCode == "SELF"),
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
      (response) => {
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
    var reqObj = { Id: this.AppId }
    await this.http.post(URLConstant.GetInsuranceDataByAppId, reqObj).toPromise().then(
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
      if (this.appInsObjObj.InsAssetCoveredBy == CommonConstant.InsuredByCompany)
        this.EditAppAssetForm.patchValue({
          InscoBranchCode: this.appInsObjObj.InscoBranchCode,
          InscoBranchName: this.appInsObjObj.InscoBranchName,
        });
    }
  }

  async setFormValidators() {
    if (this.appInsObjObj.InsAssetCoveredBy != 'OFF')
      this.EditAppAssetForm.controls.InscoBranchCode.setValidators([Validators.required]);
  }
  CancelClick() {
    this.outputPage.emit({ pageType: "cancelAssetData" });
  }

  SaveData() {
    this.AppAssetRelatedOutput =
    {
      AppAssetId: this.AppAssetObj.AppAssetId,
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
      },
      AppAssetAttrObjs: [],
      AppInsObj:
      {
        InsAssetCoverPeriod: '-',
        InsAssetCoveredBy: '-',
      }
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

    if (this.appInsObjObj.InsAssetCoveredBy != 'OFF') {
      this.AppAssetRelatedOutput.AppInsObj =
      {
        InscoBranchCode: this.EditAppAssetForm.controls.InscoBranchCode.value,
        InscoBranchName: this.EditAppAssetForm.controls.InscoBranchName.value,
        InsAssetCoverPeriod: this.appInsObjObj.InsAssetCoverPeriod,
        InsAssetCoveredBy: this.appInsObjObj.InsAssetCoveredBy
      };
    }

    this.outputPage.emit({ AppAssetRelatedOutput: this.AppAssetRelatedOutput, pageType: "submitAssetData" });
  }

}
