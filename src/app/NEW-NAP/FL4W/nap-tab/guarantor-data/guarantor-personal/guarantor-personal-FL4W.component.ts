import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AppGuarantorPersonalObj } from 'app/shared/model/AppGuarantorPersonalObj.Model';
import { GuarantorPersonalObj } from 'app/shared/model/GuarantorPersonalObj.Model';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';

@Component({
  selector: 'app-guarantor-personal-FL4W',
  templateUrl: './guarantor-personal-FL4W.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class GuarantorPersonalFL4WComponent implements OnInit {
  @Input() AppId: number;
  @Input() AppGuarantorId: number;
  @Input() showCancel: boolean = true;
  @Input() mode: string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  param: string;
  resultData: any;
  inputLookupObj: InputLookupObj;
  MrCustRelationshipCode: any;
  MrIdTypeCode: any;
  MrGenderCode: any;
  MrMaritalStatCode: any;
  MrNationalityCode: any;
  MrReligionCode: any;
  AddrObj: AddrObj;
  inputFieldObj: InputFieldObj;
  inputLookupObj1: InputLookupObj;
  appGuarantorPersonalObj: AppGuarantorPersonalObj;
  guarantorPersonalObj: GuarantorPersonalObj;
  AppGuarantorPersonalId: number;
  selectedNationalityCountryCode: string;
  isLocal: boolean = false;
  countryCode: string;
  tempCustNo: string;
  isIdExpiredDateMandatory: boolean = false;
  businessDt: Date;
  @Input() ListCustNoPersonal: any[];
  inputAddressObj: InputAddressObj;
  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private modalService: NgbModal, private cookieService: CookieService) {
  }

  PersonalForm = this.fb.group({
    MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrIdTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrGenderCode: ['', [Validators.maxLength(50)]],
    IdNo: ['', [Validators.required, Validators.maxLength(50)]],
    MrMaritalStatCode: ['', [Validators.maxLength(50)]],
    IdExpDt: ['', [Validators.required]],
    MrNationalityCode: ['', [Validators.required, Validators.maxLength(50)]],
    BirthPlace: ['', [Validators.required, Validators.maxLength(200)]],
    BirthDt: ['', [Validators.required]],
    TaxIdNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
    MrReligionCode: ['', [Validators.maxLength(50)]],
    MobilePhnNo: ['', [Validators.required, Validators.maxLength(50)]],
    CountryCode: ['']
  });

  countryObj = {
    CountryCode: ""
  };

  async ngOnInit(): Promise<void> {
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.title = "Address";
    this.inputAddressObj.showAllPhn = false;

    this.getDate();
    this.initLookup();
    this.initAddr();

    if (this.mode == "edit") {
      var guarantorPersonalObj = new GuarantorPersonalObj();
      guarantorPersonalObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      await this.http.post(URLConstant.GetAppGuarantorPersonalByAppGuarantorId, guarantorPersonalObj).toPromise().then(
        (response) => {

          this.resultData = response;
          this.AppGuarantorPersonalId = this.resultData.AppGuarantorPersonalObj.AppGuarantorPersonalId;
          this.inputLookupObj.jsonSelect = { CustName: this.resultData.AppGuarantorObj.GuarantorName };
          this.inputLookupObj.nameSelect = this.resultData.AppGuarantorObj.GuarantorName;

          this.PersonalForm.patchValue({
            MrCustRelationshipCode: this.resultData.AppGuarantorObj.MrCustRelationshipCode,
            MrIdTypeCode: this.resultData.AppGuarantorPersonalObj.MrIdTypeCode,
            MrGenderCode: this.resultData.AppGuarantorPersonalObj.MrGenderCode,
            IdNo: this.resultData.AppGuarantorPersonalObj.IdNo,
            MrMaritalStatCode: this.resultData.AppGuarantorPersonalObj.MrMaritalStatCode,
            MrNationalityCode: this.resultData.AppGuarantorPersonalObj.MrNationalityCode,
            BirthPlace: this.resultData.AppGuarantorPersonalObj.BirthPlace,
            BirthDt: formatDate(this.resultData.AppGuarantorPersonalObj['BirthDt'], 'yyyy-MM-dd', 'en-US'),
            TaxIdNo: this.resultData.AppGuarantorObj.TaxIdNo,
            MrReligionCode: this.resultData.AppGuarantorPersonalObj.MrReligionCode,
            MobilePhnNo: this.resultData.AppGuarantorPersonalObj.MobilePhnNo,
          })
          this.clearExpDt();
          this.PersonalForm.patchValue({
            IdExpDt: this.resultData.AppGuarantorPersonalObj.IdExpDt != undefined ? formatDate(this.resultData.AppGuarantorPersonalObj.IdExpDt, 'yyyy-MM-dd', 'en-US') : '',
          });
          this.setCountryName(this.resultData.AppGuarantorPersonalObj.CountryCode);
          this.setAddrLegalObj();
        });

      if (this.resultData.AppGuarantorObj.CustNo != null) {
        this.tempCustNo = this.resultData.AppGuarantorObj.CustNo;
        this.inputLookupObj.isReadonly = true;
        this.PersonalForm.controls["MobilePhnNo"].disable();
        this.PersonalForm.controls["MrMaritalStatCode"].disable();
        this.PersonalForm.controls["MrNationalityCode"].disable();
        this.PersonalForm.controls["MrReligionCode"].disable();
        this.PersonalForm.controls["MrGenderCode"].disable();
        this.PersonalForm.controls["BirthPlace"].disable();
        this.PersonalForm.controls["BirthDt"].disable();
        this.PersonalForm.controls["IdNo"].disable();
        this.PersonalForm.controls["IdExpDt"].disable();
        this.PersonalForm.controls["MrIdTypeCode"].disable();
        this.PersonalForm.controls["TaxIdNo"].disable();
        // this.PersonalForm.controls["MrCustRelationshipCode"].disable();
        this.PersonalForm.controls["AddrObj"]["controls"].Addr.disable();
        this.PersonalForm.controls["AddrObj"]["controls"].AreaCode3.disable();
        this.PersonalForm.controls["AddrObj"]["controls"].AreaCode4.disable();
      }
    }
    else {
      this.ClearForm();
      this.inputLookupObj1.isReady = true;
    }

    var idTypeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType,
      RowVersion: ""
    }
    var genderObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender,
      RowVersion: ""
    }
    var maritalObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMaritalStat,
      RowVersion: ""
    }
    var religionObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeReligion,
      RowVersion: ""
    }
    this.http.post(URLConstant.GetListActiveRefMaster, idTypeObj).subscribe(
      (response) => {
        this.MrIdTypeCode = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.PersonalForm.patchValue({
            MrIdTypeCode: this.MrIdTypeCode[0].MasterCode
          });
        }
        this.clearExpDt();
      }
    );

    var AppCust = {
      Id: this.AppId,
      RowVersion: ""
    }
    this.http.post(URLConstant.GetAppCustByAppId, AppCust).subscribe(
      (response) => {
        if (response["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
          var refCustRelObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
            RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGuarPersonalRelationship,
            MappingCode: CommonConstant.CustTypePersonal,
          }
        } else {
          var refCustRelObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
            RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGuarCompanyRelationship,
            MappingCode: CommonConstant.CustTypePersonal,
          }
        }
        this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, refCustRelObj).subscribe(
          (response) => {
            this.MrCustRelationshipCode = response[CommonConstant.ReturnObj];
            if (this.mode != "edit") {
              this.PersonalForm.patchValue({
                MrCustRelationshipCode: this.MrCustRelationshipCode[0].Key
              });
            }
          }
        );

      }
    );




    this.http.post(URLConstant.GetListActiveRefMaster, genderObj).subscribe(
      (response) => {
        this.MrGenderCode = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.PersonalForm.patchValue({
            MrGenderCode: this.MrGenderCode[0].MasterCode
          });
        }
      }
    );
    this.http.post(URLConstant.GetListActiveRefMaster, maritalObj).subscribe(
      (response) => {
        this.MrMaritalStatCode = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.PersonalForm.patchValue({
            MrMaritalStatCode: this.MrMaritalStatCode[0].MasterCode
          });
        }
      }
    );
    let obj: GenericObj = new GenericObj();
    obj.Codes = [CommonConstant.RefMasterTypeCodeNationality];
    this.http.post(URLConstant.GetListRefMasterByRefMasterTypeCodes, obj).toPromise().then(
      (response) => {
        this.MrNationalityCode = response[CommonConstant.ReturnObj];
      }
    );
    this.http.post(URLConstant.GetListActiveRefMaster, religionObj).subscribe(
      (response) => {
        this.MrReligionCode = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.PersonalForm.patchValue({
            MrReligionCode: this.MrReligionCode[0].MasterCode
          });
        }
      }
    );
  }

  IdTypeHandler() {
    var value = this.PersonalForm.controls["MrIdTypeCode"].value;
    if (value != CommonConstant.MrIdTypeCodeEKTP) {
      this.PersonalForm.controls["IdExpDt"].setValidators([Validators.required]);
      this.PersonalForm.controls["IdExpDt"].updateValueAndValidity();
      var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
      this.isIdExpiredDateMandatory = true;
    }
    else {
      this.PersonalForm.patchValue({
        IdExpDt: ''
      });
      this.PersonalForm.controls["IdExpDt"].clearValidators();
      this.PersonalForm.controls["IdExpDt"].updateValueAndValidity();
      var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
      this.isIdExpiredDateMandatory = false;
    }
  }

  UserAccess: any;
  MaxDate: Date;
  Max17YO: Date;
  getDate() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = new Date(this.UserAccess.BusinessDt);
    this.Max17YO = new Date(this.UserAccess.BusinessDt);
    this.Max17YO.setFullYear(this.MaxDate.getFullYear() - 17);
  }

  setAddrLegalObj() {
    this.AddrObj = new AddrObj();
    this.AddrObj.Addr = this.resultData.AppGuarantorPersonalObj.Addr;
    this.AddrObj.AreaCode1 = this.resultData.AppGuarantorPersonalObj.AreaCode1;
    this.AddrObj.AreaCode2 = this.resultData.AppGuarantorPersonalObj.AreaCode2;
    this.AddrObj.AreaCode3 = this.resultData.AppGuarantorPersonalObj.AreaCode3;
    this.AddrObj.AreaCode4 = this.resultData.AppGuarantorPersonalObj.AreaCode4;
    this.AddrObj.City = this.resultData.AppGuarantorPersonalObj.City;

    this.inputFieldObj.inputLookupObj.nameSelect = this.resultData.AppGuarantorPersonalObj.Zipcode;
    this.inputFieldObj.inputLookupObj.jsonSelect = { Zipcode: this.resultData.AppGuarantorPersonalObj.Zipcode };
    this.inputAddressObj.default = this.AddrObj;
    this.inputAddressObj.inputField = this.inputFieldObj;
  }

  setCountryName(countryCode) {
    this.countryObj.CountryCode = countryCode;

    this.http.post(URLConstant.GetRefCountryByCountryCode, {Code: countryCode}).subscribe(
      (response) => {
        this.inputLookupObj1.nameSelect = response["CountryName"];
        this.inputLookupObj1.jsonSelect = { CountryName: response["CountryName"] };
        if (this.resultData.AppGuarantorPersonalObj.MrNationalityCode == CommonConstant.NationalityLocal) {
          this.isLocal = true;
          this.selectedNationalityCountryName = response["CountryName"];
        } else {
          this.isLocal = false
          this.countryCode = countryCode;
        }
      });

  }
  selectedNationalityCountryName: string = "";
  ChangeNationality(ev) {
    if (this.PersonalForm.controls.MrNationalityCode.value == CommonConstant.NationalityLocal) {
      var idx = ev.target.selectedIndex - 1;
      var setCountry = this.MrNationalityCode[idx].DefaultValue.split(';')
      this.selectedNationalityCountryCode = setCountry[0];
      this.selectedNationalityCountryName = setCountry[1] || setCountry[0];
      this.isLocal = true;
    } else {
      var foreign = this.MrNationalityCode.find(x => x["MasterCode"] == ev.target.value);
      var setCountry = foreign.DefaultValue.split(';')
      this.inputLookupObj1.nameSelect = setCountry[1] || setCountry[0];
      this.inputLookupObj1.jsonSelect = { CountryName: setCountry[1] || setCountry[0] };
      this.countryCode = setCountry[0];
      this.isLocal = false;
    }
  }

  initLookup() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/lookupGuarantorName.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.pagingJson = "./assets/uclookup/lookupGuarantorName.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/lookupGuarantorName.json";
    this.inputLookupObj.isReadonly = false;

    this.inputLookupObj1 = new InputLookupObj();
    this.inputLookupObj1.urlJson = "./assets/uclookup/lookupCountry.json";
    this.inputLookupObj1.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj1.pagingJson = "./assets/uclookup/lookupCountry.json";
    this.inputLookupObj1.genericJson = "./assets/uclookup/lookupCountry.json";
    this.inputLookupObj1.isRequired = false;

    if (this.ListCustNoPersonal.length > 0) {
      var arrCopyLookupCrit = new Array();
      var addCrit = new CriteriaObj();
      addCrit.DataType = "text";
      addCrit.propName = "A.CUST_NO";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.ListCustNoPersonal;
      arrCopyLookupCrit.push(addCrit);
      this.inputLookupObj.addCritInput = arrCopyLookupCrit;
    }
  }

  initAddr() {
    this.inputFieldObj = new InputFieldObj();
    this.inputFieldObj.inputLookupObj = new InputLookupObj();
  }

  // GuarantorName="";
  lookupGuarantor(event) {
    this.tempCustNo = event.CustNo;
    this.inputLookupObj.isReadonly = true;
    this.http.post(URLConstant.GetCustByCustId, { Id: event.CustId }).subscribe(
      (response) => {
        this.clearExpDt();
        this.resultData = response;
        this.PersonalForm.patchValue(
          {
            GuarantorName: event.CustName,
            IdNo: this.resultData.IdNo,
            IdExpDt: formatDate(this.resultData.IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
            MrIdTypeCode: this.resultData.MrIdTypeCode,
            TaxIdNo: this.resultData.TaxIdNo
          }
        );
        this.http.post(URLConstant.GetCustPersonalByCustId, { CustId: event.CustId }).subscribe(
          (response) => {
            this.resultData = response;
            this.PersonalForm.patchValue({
              MobilePhnNo: this.resultData.MobilePhnNo1,
              MrMaritalStatCode: this.resultData.MrMaritalStatCode,
              MrNationalityCode: this.resultData.MrNationalityCode,
              MrReligionCode: this.resultData.MrReligionCode,
              MrGenderCode: this.resultData.MrGenderCode,
              BirthPlace: this.resultData.BirthPlace,
              BirthDt: formatDate(this.resultData.BirthDt, 'yyyy-MM-dd', 'en-US')
            });
            if (this.resultData.MrNationalityCode == CommonConstant.NationalityLocal) {
              this.isLocal = true;
              var idx = 1;
              var setCountry = this.MrNationalityCode[idx].DefaultValue.split(';')
              this.selectedNationalityCountryCode = setCountry[0];
              this.selectedNationalityCountryName = setCountry[1] || setCountry[0];
            } else {
              this.isLocal = false;
              this.http.post(URLConstant.GetRefCountryByCountryCode, {Code: this.resultData.WnaCountryCode }).subscribe(
                (response) => {
                  this.inputLookupObj1.nameSelect = response["CountryName"];
                  this.countryCode = response["CountryCode"];
                }
              );
            }

          });
        this.http.post(URLConstant.GetCustAddrByMrCustAddrType, {
          CustId: event.CustId, MrCustAddrTypeCode: CommonConstant.AddrTypeLegal
        }).subscribe(
          (response) => {
            this.resultData = response;
            this.AddrObj = new AddrObj();
            this.AddrObj.Addr = this.resultData.Addr;
            this.AddrObj.AreaCode1 = this.resultData.AreaCode1;
            this.AddrObj.AreaCode2 = this.resultData.AreaCode2;
            this.AddrObj.AreaCode3 = this.resultData.AreaCode3;
            this.AddrObj.AreaCode4 = this.resultData.AreaCode4;
            this.AddrObj.City = this.resultData.City;
            this.AddrObj.Phn1 = this.resultData.Phn1;
            this.AddrObj.Phn2 = this.resultData.Phn2;
            this.AddrObj.PhnArea1 = this.resultData.PhnArea1;
            this.AddrObj.PhnArea2 = this.resultData.PhnArea2;
            this.AddrObj.PhnExt1 = this.resultData.PhnExt1;
            this.AddrObj.PhnExt2 = this.resultData.PhnExt2;
            this.AddrObj.Fax = this.resultData.Fax;
            this.AddrObj.FaxArea = this.resultData.FaxArea;
            this.inputFieldObj.inputLookupObj.nameSelect = this.resultData.Zipcode;
            this.inputFieldObj.inputLookupObj.jsonSelect = { Zipcode: this.resultData.Zipcode };
            this.inputAddressObj.default = this.AddrObj;
            this.inputAddressObj.inputField = this.inputFieldObj;
          }
        );
      }
    );
    this.PersonalForm.controls["MobilePhnNo"].disable();
    this.PersonalForm.controls["MrMaritalStatCode"].disable();
    this.PersonalForm.controls["MrNationalityCode"].disable();
    this.PersonalForm.controls["MrReligionCode"].disable();
    this.PersonalForm.controls["MrGenderCode"].disable();
    this.PersonalForm.controls["BirthPlace"].disable();
    this.PersonalForm.controls["BirthDt"].disable();
    this.PersonalForm.controls["IdNo"].disable();
    this.PersonalForm.controls["IdExpDt"].disable();
    this.PersonalForm.controls["MrIdTypeCode"].disable();
    this.PersonalForm.controls["TaxIdNo"].disable();
    this.PersonalForm.controls["AddrObj"]["controls"].Addr.disable();
    this.PersonalForm.controls["AddrObj"]["controls"].AreaCode3.disable();
    this.PersonalForm.controls["AddrObj"]["controls"].AreaCode4.disable();
  }

  lookupCountry(event) {
    this.PersonalForm.patchValue(
      {
        CountryCode: event.CountryCode
      }
    );
  }

  Add() {
    this.setAppGuarantor();
    this.setAppGuarantorPersonal();
  }

  clearExpDt() {
    if (this.PersonalForm.controls.MrIdTypeCode.value == CommonConstant.MrIdTypeCodeEKTP) {
      this.PersonalForm.patchValue({
        IdExpDt: '',
      });
      this.PersonalForm.controls.IdExpDt.clearValidators();
      this.PersonalForm.controls.IdExpDt.updateValueAndValidity();
      this.isIdExpiredDateMandatory = false;
    }
    else {
      this.isIdExpiredDateMandatory = true;
    }
  }

  setAppGuarantor() {
    if (this.tempCustNo != null) {
      this.guarantorPersonalObj.AppGuarantorObj.CustNo = this.tempCustNo;
    }
    this.guarantorPersonalObj.AppGuarantorObj.GuarantorName = this.inputLookupObj.nameSelect;
    this.guarantorPersonalObj.AppGuarantorObj.MrGuarantorTypeCode = CommonConstant.CustTypePersonal;
    this.guarantorPersonalObj.AppGuarantorObj.TaxIdNo = this.PersonalForm.controls.TaxIdNo.value;
    this.guarantorPersonalObj.AppGuarantorObj.MrCustRelationshipCode = this.PersonalForm.controls.MrCustRelationshipCode.value;
    this.guarantorPersonalObj.AppGuarantorObj.RowVersion = "";
    this.guarantorPersonalObj.AppGuarantorObj.AppId = this.AppId;
  }

  setAppGuarantorPersonal() {
    var flag: boolean = true;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MrIdTypeCode = this.PersonalForm.controls.MrIdTypeCode.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MrGenderCode = this.PersonalForm.controls.MrGenderCode.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.IdNo = this.PersonalForm.controls.IdNo.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.BirthPlace = this.PersonalForm.controls.BirthPlace.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.BirthDt = this.PersonalForm.controls.BirthDt.value;
    let d3 = new Date(this.guarantorPersonalObj.AppGuarantorPersonalObj.BirthDt);
    let d4 = new Date(this.Max17YO);
    if (d3 > d4) {
      this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
      flag = false;
    }
    this.guarantorPersonalObj.AppGuarantorPersonalObj.IdExpDt = this.PersonalForm.controls.IdExpDt.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MrNationalityCode = this.PersonalForm.controls.MrNationalityCode.value;
    if (this.PersonalForm.controls.MrNationalityCode.value == CommonConstant.NationalityLocal) {
      this.guarantorPersonalObj.AppGuarantorPersonalObj.CountryCode = this.selectedNationalityCountryCode;
    } else {
      this.guarantorPersonalObj.AppGuarantorPersonalObj.CountryCode = this.countryCode;
    }
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MrReligionCode = this.PersonalForm.controls.MrReligionCode.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MrMaritalStatCode = this.PersonalForm.controls.MrMaritalStatCode.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.TaxIdNo = this.PersonalForm.controls.TaxIdNo.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MobilePhnNo = this.PersonalForm.controls.MobilePhnNo.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.Addr = this.PersonalForm.controls["AddrObj"]["controls"].Addr.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.AreaCode1 = this.PersonalForm.controls["AddrObj"]["controls"].AreaCode1.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.AreaCode2 = this.PersonalForm.controls["AddrObj"]["controls"].AreaCode2.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.AreaCode3 = this.PersonalForm.controls["AddrObj"]["controls"].AreaCode3.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.AreaCode4 = this.PersonalForm.controls["AddrObj"]["controls"].AreaCode4.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.City = this.PersonalForm.controls["AddrObj"]["controls"].City.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.Zipcode = this.inputFieldObj.inputLookupObj.nameSelect;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.RowVersion = "";
    return flag;
  }

  SaveForm() {
    this.guarantorPersonalObj = new GuarantorPersonalObj();
    this.Add();
    if (this.mode == "edit") {
      this.guarantorPersonalObj.RowVersion = this.resultData.RowVersion;
      this.guarantorPersonalObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      this.guarantorPersonalObj.AppGuarantorPersonalObj.AppGuarantorPersonalId = this.AppGuarantorPersonalId;
      this.http.post(URLConstant.EditAppGuarantorPersonal, this.guarantorPersonalObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          this.close.emit(1);
        });
    } else {
      this.http.post(URLConstant.AddAppGuarantorPersonal, this.guarantorPersonalObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.close.emit(1);
        });
    }
  }

  ClearForm() {
    this.PersonalForm = this.fb.group({
      MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
      MrIdTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      MrGenderCode: ['', [Validators.maxLength(50)]],
      IdNo: ['', [Validators.required, Validators.maxLength(50)]],
      MrMaritalStatCode: ['', [Validators.maxLength(50)]],
      IdExpDt: ['', [Validators.required]],
      MrNationalityCode: ['', [Validators.required, Validators.maxLength(50)]],
      BirthPlace: ['', [Validators.required, Validators.maxLength(200)]],
      BirthDt: ['', [Validators.required]],
      TaxIdNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
      MrReligionCode: ['', [Validators.maxLength(50)]],
      MobilePhnNo: ['', [Validators.required, Validators.maxLength(50)]],
      CountryCode: ['']
    });

    this.initLookup();
    this.initAddr();
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
