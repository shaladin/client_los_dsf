import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormGroup, ControlContainer, Validators, NgForm } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio/typings/public-api';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { formatDate, KeyValue } from '@angular/common';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-cust-main-data',
  templateUrl: './cust-main-data.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustMainDataComponent implements OnInit {
  AppId: number;
  isExisting: boolean = false;
  isUcAddressReady: boolean = false;
  MrCustTypeCode: string;
  MaxDate: Date;
  InputLookupPersonalObj: InputLookupObj = new InputLookupObj();
  InputLookupCompanyObj: InputLookupObj = new InputLookupObj();
  inputAddressObj: InputAddressObj;
  inputFieldAddressObj: InputFieldObj;
  legalAddrObj: AddrObj;
  CustTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  IdTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  GenderObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  CustModelObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  CompanyTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  ArrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  UserAccess: Object;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    public formValidate: FormValidateService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  CustMainDataForm = this.fb.group({
    MrCustTypeCode: [],
    CustName: ['', Validators.required],
    CompanyType: ['', Validators.required],
    CustModelCode: ['', Validators.required],
    MrIdTypeCode: ['', Validators.required],
    IdNo: ['', Validators.required],
    IdExpiredDt: [''],
    TaxIdNo: [''],
    MrGenderCode: ['', Validators.required],
    BirthPlace: ['', Validators.required],
    BirthDt: ['', Validators.required],
    MotherMaidenName: ['', Validators.required],
    MrCompanyTypeCode: [''],
  });

  ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess[CommonConstant.BUSINESS_DT];

    this.SetLookup();

    this.legalAddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.title = "Address";
    this.inputAddressObj.showOwnership = true;
    this.inputFieldAddressObj = new InputFieldObj();
    this.inputFieldAddressObj.inputLookupObj = new InputLookupObj();
    this.isUcAddressReady = true;

    this.GetRefMasterPersonal();
  }

  SetLookup(value: string = "PERSONAL") {
    this.ArrAddCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = "text";
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = value;
    this.ArrAddCrit.push(critObj);

    if (value == CommonConstant.CustTypePersonal) {
      this.InputLookupPersonalObj = new InputLookupObj();
      this.InputLookupPersonalObj.urlJson = "./assets/uclookup/lookupCustomer.json";
      this.InputLookupPersonalObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputLookupPersonalObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputLookupPersonalObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
      this.InputLookupPersonalObj.genericJson = "./assets/uclookup/lookupCustomer.json";
      this.InputLookupPersonalObj.isReadonly = false;

      this.InputLookupPersonalObj.addCritInput = this.ArrAddCrit;
      this.InputLookupPersonalObj.isReady = true;
    } else {
      this.InputLookupCompanyObj = new InputLookupObj();
      this.InputLookupCompanyObj.urlJson = "./assets/uclookup/lookupCustomer.json";
      this.InputLookupCompanyObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputLookupCompanyObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputLookupCompanyObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
      this.InputLookupCompanyObj.genericJson = "./assets/uclookup/lookupCustomer.json";
      this.InputLookupCompanyObj.isReadonly = false;

      this.InputLookupCompanyObj.addCritInput = this.ArrAddCrit;
      this.InputLookupCompanyObj.isReady = true;
    }
  }

  GetRefMasterPersonal() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType }).subscribe(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
        this.CustMainDataForm.patchValue({
          MrCustTypeCode: this.CustTypeObj[0].Key
        })
        this.CheckBox(this.CustTypeObj[0].Key, true);
      }
    );

    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          var idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
          this.CustMainDataForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
        }
        this.ClearExpDt();
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      }
    );

    this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, { MrCustTypeCode: CommonConstant.CustTypePersonal }).subscribe(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        if (this.CustModelObj.length > 0) {
          this.CustMainDataForm.patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
        }
      }
    );
  }

  GetRefMasterCompany() {
    this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, { MrCustTypeCode: CommonConstant.CustTypeCompany }).subscribe(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        if (this.CustModelObj.length > 0) {
          this.CustMainDataForm.patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
        }
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).subscribe(
      (response) => {
        this.CompanyTypeObj = response[CommonConstant.ReturnObj];
        if (this.CompanyTypeObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrCompanyTypeCode: this.CompanyTypeObj[0].Key
          });
        }
      }
    );
  }

  CheckBox(value: string = 'PERSONAL', firstInit: boolean = false) {
    this.MrCustTypeCode = value;
    this.SetLookup(value);
    
    if (!firstInit) {
      this.CustMainDataForm.clearValidators();
      this.CustMainDataForm.reset();
      this.CustMainDataForm.enable();
      if (value == CommonConstant.CustTypePersonal) {
        this.GetRefMasterPersonal();
        this.CustMainDataForm.controls.MotherMaidenName.setValidators([Validators.required]);
        this.CustMainDataForm.controls.BirthDt.setValidators([Validators.required]);
        this.CustMainDataForm.controls.BirthPlace.setValidators([Validators.required]);
        this.CustMainDataForm.controls.MrIdTypeCode.setValidators([Validators.required]);
        this.CustMainDataForm.controls.IdNo.setValidators([Validators.required]);
        this.CustMainDataForm.controls.TaxIdNo.clearValidators();
      } else {
        this.GetRefMasterCompany();
        this.CustMainDataForm.controls.TaxIdNo.setValidators([Validators.required]);
        this.CustMainDataForm.controls.MotherMaidenName.clearValidators();
        this.CustMainDataForm.controls.BirthDt.clearValidators();
        this.CustMainDataForm.controls.BirthPlace.clearValidators();
        this.CustMainDataForm.controls.MrIdTypeCode.clearValidators();
        this.CustMainDataForm.controls.IdNo.clearValidators();
      }
      this.CustMainDataForm.updateValueAndValidity();
    }
  }

  CopyCustomerEvent(event) {
    if (event.MrCustTypeCode == CommonConstant.CustTypePersonal)
      this.InputLookupPersonalObj.isReadonly = true;
    else
      this.InputLookupCompanyObj.isReadonly = true;


    this.http.post(URLConstant.GetCustPersonalForCopyByCustId, { CustId: event.CustId }).subscribe(
      (response) => {
        if (event.MrCustTypeCode == CommonConstant.CustTypePersonal)
          this.CopyCustomerPersonal(response);
        else
          this.CopyCustomerCompany(response);

        this.CustMainDataForm.disable();
      });
  }

  CopyCustomerPersonal(response) {
    if (response["CustObj"] != undefined) {
      this.CustMainDataForm.patchValue({
        MrIdTypeCode: response["CustObj"].MrIdTypeCode,
        IdNo: response["CustObj"].IdNo,
        IdExpiredDt: formatDate(response["CustObj"].IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
        TaxIdNo: response["CustObj"].TaxIdNo
      });
      this.InputLookupPersonalObj.jsonSelect = { CustName: response["CustObj"].CustName };
    }

    if (response["CustPersonalObj"] != undefined) {
      this.CustMainDataForm.patchValue({
        MrGenderCode: response["CustPersonalObj"].MrGenderCode,
        MotherMaidenName: response["CustPersonalObj"].MotherMaidenName,
        BirthPlace: response["CustPersonalObj"].BirthPlace,
        BirthDt: formatDate(response["CustPersonalObj"].BirthDt, 'yyyy-MM-dd', 'en-US'),
      });
      this.CustMainDataForm.controls["BirthPlace"].disable();
      this.CustMainDataForm.controls["BirthDt"].disable();
    }

    this.CopyLegalAddr(response["CustAddrLegalObj"]);
  }

  CopyCustomerCompany(response) {
    if (response["CustObj"] != undefined) {
      this.CustMainDataForm.patchValue({
        MrIdTypeCode: response["CustObj"].MrIdTypeCode,
        TaxIdNo: response["CustObj"].TaxIdNo,
      });
      this.InputLookupPersonalObj.jsonSelect = { CustName: response["CustObj"].CustName };
    }

    if (response["CustCompanyObj"] != undefined){
      this.CustMainDataForm.patchValue({
        MrCompanyTypeCode: response["CustCompanyObj"].MrIdTypeCode,
      });
    }
    this.CopyLegalAddr(response["CustAddrLegalObj"]);
  }

  CopyLegalAddr(reponse){
    if (reponse != undefined) {
      this.legalAddrObj.Addr = reponse.Addr;
      this.legalAddrObj.AreaCode1 = reponse.AreaCode1;
      this.legalAddrObj.AreaCode2 = reponse.AreaCode2;
      this.legalAddrObj.AreaCode3 = reponse.AreaCode3;
      this.legalAddrObj.AreaCode4 = reponse.AreaCode4;
      this.legalAddrObj.City = reponse.City;
      this.legalAddrObj.Fax = reponse.Fax;
      this.legalAddrObj.FaxArea = reponse.FaxArea;
      this.legalAddrObj.Phn1 = reponse.Phn1;
      this.legalAddrObj.Phn2 = reponse.Phn2;
      this.legalAddrObj.PhnArea1 = reponse.PhnArea1;
      this.legalAddrObj.PhnArea2 = reponse.PhnArea2;
      this.legalAddrObj.PhnExt1 = reponse.PhnExt1;
      this.legalAddrObj.PhnExt2 = reponse.PhnExt2;

      this.inputFieldAddressObj.inputLookupObj.nameSelect = reponse.Zipcode;
      this.inputFieldAddressObj.inputLookupObj.jsonSelect = { Zipcode: reponse.Zipcode };
      this.inputAddressObj.default = this.legalAddrObj;
      this.inputAddressObj.inputField = this.inputFieldAddressObj;
    }
  }

  ClearExpDt() {

  }

  SaveForm(enjiForm: NgForm) {
    enjiForm.resetForm();
    console.log(this.CustMainDataForm)
  }

  Cancel() {
    console.log(this.CustMainDataForm.value)

  }
}
