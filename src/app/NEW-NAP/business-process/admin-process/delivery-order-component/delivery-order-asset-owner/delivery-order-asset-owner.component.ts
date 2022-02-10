import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/app-collateral-registration-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/app-cust-personal-job-data-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ResponseJobDataPersonalObj } from 'app/shared/model/response-job-data-personal-obj.model';

@Component({
  selector: 'app-delivery-order-asset-owner',
  templateUrl: './delivery-order-asset-owner.component.html'
})
export class DeliveryOrderAssetOwnerComponent implements OnInit {
  @Input() CustType: string;
  @Input() AppId: number;
  @Input() AppCustObj: any;
  @Input() AppCustAddrObj: Array<AppCustAddrObj>;
  @Input() AppCollateralRegistrationObj: AppCollateralRegistrationObj;
  @Input() identifier: string;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  copyFromAppCustAddrForOwner: any;
  OwnerRelationObj: Array<KeyValueObj>;
  IdTypeObj: Array<KeyValueObj>;
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();
  AddrLegalObj: Array<AppCustAddrObj> = new Array();
  AddrObj: Array<AppCustAddrObj> = new Array();
  inputAddressObjForOwner: InputAddressObj;
  inputFieldOwnerAddrObj: InputFieldObj;
  ownerAddrObj: AddrObj;
  AppCustPersonalJobData: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();

  async ngOnInit() {
    this.parentForm.addControl(this.identifier, this.fb.group({
      OwnerName: ['', [Validators.required, Validators.maxLength(500)]],
      MrIdTypeCode: ['', Validators.maxLength(50)],
      OwnerIdNo: ['', Validators.maxLength(50)],
      MrOwnerRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
      OwnerAddr: [''],
      OwnerAreaCode1: ['', Validators.maxLength(50)],
      OwnerAreaCode2: ['', Validators.maxLength(50)],
      OwnerAreaCode3: ['', Validators.maxLength(50)],
      OwnerAreaCode4: ['', Validators.maxLength(50)],
      OwnerCity: ['', Validators.maxLength(50)],
      OwnerZipcode: ['', Validators.maxLength(50)],
      OwnerMobilePhnNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      OwnerProfessionCode: [''],
      OwnerAddrType: [''],
      MrOwnerTypeCode: [''],
      SelfOwner: [false]
    }));


    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.showAllPhn = false;
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();

    await this.bindAllRefMasterObj();
    await this.bindOwnerTypeObj();
    await this.bindCompanyTypeObj();
    await this.GetListAddr();
    this.initLookup();

    await this.GetAppCustPersonalJobData();
    await this.setAssetOwnerData();
  }

  async setAssetOwnerData() {
    this.parentForm.controls[this.identifier].patchValue({
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
      SelfOwner: (this.AppCollateralRegistrationObj.MrOwnerRelationshipCode == CommonConstant.SelfCustomer),
      OwnerProfessionCode: this.AppCollateralRegistrationObj.OwnerProfessionCode,
      MrOwnerTypeCode: this.AppCollateralRegistrationObj.MrOwnerTypeCode == null ? this.CustType : this.AppCollateralRegistrationObj.MrOwnerTypeCode
    });
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
    await this.GetOwnerProfessionByCode();
    if (this.AppCollateralRegistrationObj.MrOwnerRelationshipCode == CommonConstant.SelfCustomer) {
      this.disableAssetDataForm();
    }
  }

  async GetOwnerProfessionByCode() {
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = this.AppCollateralRegistrationObj.OwnerProfessionCode;
    await this.http.post(URLConstant.GetRefProfessionByCode, reqByCode).toPromise().then(
      (response) => {
        this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response["ProfessionName"] };
      }
    );
  }

  async GetAppCustPersonalJobData() {
    await this.http.post(URLConstant.GetAppCustPersonalJobData, { Id: this.AppCustObj.AppCustId }).toPromise().then(
      (response: ResponseJobDataPersonalObj) => {
        if (response.AppCustPersonalJobDataObj != null) {
          this.AppCustPersonalJobData = response.AppCustPersonalJobDataObj;
        }
      }
    );
  }

  async bindAllRefMasterObj() {
    await this.bindIdTypeObj();
    await this.bindUserOwnerRelationshipObj();
  }

  async bindIdTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async bindUserOwnerRelationshipObj() {
    if (this.CustType == CommonConstant.CustTypePersonal) {
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    }
    else {
      this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
    }
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.OwnerRelationObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async GetListAddr() {
    this.AddrLegalObj = this.AppCustAddrObj.filter(
      emp => emp.MrCustAddrTypeCode === CommonConstant.AddrTypeLegal);
  }

  initLookup() {
    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isRequired = false;
    this.InputLookupProfessionObj.isReady = true;
  }

  GetProfession(event) {
    this.parentForm.controls[this.identifier].patchValue({
      OwnerProfessionCode: event.ProfessionCode
    });
  }

  async SelfOwnerChange(event) {
    if (event.checked == true) {
      this.parentForm.controls[this.identifier].patchValue({
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
        MrOwnerTypeCode: this.AppCustObj.MrCustTypeCode
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
      this.disableAssetDataForm();
    }
    else {
      this.enableAssetDataForm();
    };
  }

  disableAssetDataForm() {
    this.inputFieldOwnerAddrObj.inputLookupObj.isDisable = true;
    this.InputLookupProfessionObj.isDisable = true;
    this.parentForm.controls[this.identifier]["controls"]["OwnerName"].disable();
    this.parentForm.controls[this.identifier]["controls"]["MrIdTypeCode"].disable();
    this.parentForm.controls[this.identifier]["controls"]["OwnerIdNo"].disable();
    this.parentForm.controls[this.identifier]["controls"]["MrOwnerRelationshipCode"].disable();
    this.parentForm.controls[this.identifier]["controls"]["OwnerMobilePhnNo"].disable();
    this.parentForm.controls[this.identifier]["controls"]["OwnerAddrType"].disable();
    this.parentForm.controls[this.identifier]["controls"]["MrOwnerTypeCode"].disable();
    this.parentForm.controls["ownerData"].disable();
  }

  enableAssetDataForm() {
    this.inputFieldOwnerAddrObj.inputLookupObj.isDisable = false;
    this.InputLookupProfessionObj.isDisable = false;
    this.parentForm.controls[this.identifier]["controls"]["OwnerName"].enable();
    this.parentForm.controls[this.identifier]["controls"]["MrIdTypeCode"].enable();
    this.parentForm.controls[this.identifier]["controls"]["OwnerIdNo"].enable();
    this.parentForm.controls[this.identifier]["controls"]["MrOwnerRelationshipCode"].enable();
    this.parentForm.controls[this.identifier]["controls"]["OwnerMobilePhnNo"].enable();
    this.parentForm.controls[this.identifier]["controls"]["OwnerAddrType"].enable();
    this.parentForm.controls[this.identifier]["controls"]["MrOwnerTypeCode"].enable();
    this.parentForm.controls["ownerData"].enable();
  }

  SetOwnerAddrType(event) {
    this.copyFromAppCustAddrForOwner = event;
  }

  copyToOwnerAddr() {
    if (this.copyFromAppCustAddrForOwner != "") {
      this.AddrObj = this.AppCustAddrObj.filter(
        emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForOwner);

      this.parentForm.patchValue({
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

      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.parentForm.controls[this.identifier]["controls"].OwnerZipcode.value;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.parentForm.controls[this.identifier]["controls"].OwnerZipcode.value };

      this.inputAddressObjForOwner.default = this.ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
    }
  }

  OwnerTypeObj: Array<KeyValueObj> = new Array();
  async bindOwnerTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.OwnerTypeObj = response[CommonConstant.ReturnObj];
        this.parentForm.controls[this.identifier].patchValue({
          MrOwnerTypeCode: this.CustType
        });
      }
    );
  }

  OwnerProfessionObj: Array<KeyValueObj> = new Array();
  async bindCompanyTypeObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCompanyType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.OwnerProfessionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  MrOwnerTypeCodePersonal: string = CommonConstant.CustTypePersonal;
  MrOwnerTypeCodeCompany: string = CommonConstant.CustTypeCompany;
  async OwnerTypeChange(OwnerType: string, IsOwnerTypeChanged: boolean = false) {
    if (OwnerType == CommonConstant.CustTypePersonal) {
      if (IsOwnerTypeChanged) {
        this.parentForm.controls[this.identifier].patchValue({
          OwnerProfessionCode: ""
        });

        this.InputLookupProfessionObj.nameSelect = "";
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
      } else {
        let reqByCode: GenericObj = new GenericObj();
        reqByCode.Code = this.AppCollateralRegistrationObj.OwnerProfessionCode;

        await this.http.post(URLConstant.GetRefProfessionByCode, reqByCode).toPromise().then(
          (response) => {
            this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response["ProfessionName"] };
          }
        );
      }
    } else {
      if (IsOwnerTypeChanged) {
        this.parentForm.controls[this.identifier].patchValue({
          OwnerProfessionCode: ""
        });
      } else {
        this.parentForm.controls[this.identifier].patchValue({
          OwnerProfessionCode: this.AppCollateralRegistrationObj.OwnerProfessionCode
        });
      }
    }
  }
}
