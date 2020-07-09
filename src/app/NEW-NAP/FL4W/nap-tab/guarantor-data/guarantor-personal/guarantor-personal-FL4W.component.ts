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
@Component({
  selector: 'app-guarantor-personal-FL4W',
  templateUrl: './guarantor-personal-FL4W.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class GuarantorPersonalFL4WComponent implements OnInit {

  @Input() AppId: any;
  @Input() AppGuarantorId: any;
  @Input() showCancel: boolean = true;
  @Input() mode: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  param: string;
  resultData: any;
  inputLookupObj: any;
  MrCustRelationshipCode: any;
  MrIdTypeCode: any;
  MrGenderCode: any;
  MrMaritalStatCode: any;
  MrNationalityCode: any;
  MrReligionCode: any;
  AddrObj: AddrObj;
  inputFieldObj: InputFieldObj;
  inputLookupObj1: any;
  appGuarantorPersonalObj: AppGuarantorPersonalObj;
  guarantorPersonalObj: GuarantorPersonalObj;
  AppGuarantorPersonalId: any;
  selectedNationalityCountryCode: any;
  isLocal: boolean = false;
  countryCode: string;
  tempCustNo: string;
  isIdExpiredDateMandatory: boolean = false;
  businessDt: Date;
  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private modalService: NgbModal) {
  }

  PersonalForm = this.fb.group({
    MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrIdTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrGenderCode: ['', [Validators.required, Validators.maxLength(50)]],
    IdNo: ['', [Validators.required, Validators.maxLength(50)]],
    MrMaritalStatCode: ['', [Validators.required, Validators.maxLength(50)]],
    IdExpDt: ['', [Validators.required]],
    MrNationalityCode: ['', [Validators.required, Validators.maxLength(50)]],
    BirthPlace: ['', [Validators.required, Validators.maxLength(200)]],
    BirthDt: ['', [Validators.required]],
    TaxIdNo: ['', [Validators.maxLength(50)]],
    MrReligionCode: ['', [Validators.required, Validators.maxLength(50)]],
    MobilePhnNo: ['', [Validators.required, Validators.maxLength(50)]],
    CountryCode: ['']
  });

  countryObj = {
    CountryCode: ""
  };

  async ngOnInit(): Promise<void> {
    this.getDate();
    this.initLookup();
    this.initAddr();

    if (this.mode == "edit") {
      var guarantorPersonalObj = new GuarantorPersonalObj();
      guarantorPersonalObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      await this.http.post(AdInsConstant.GetAppGuarantorPersonalByAppGuarantorId, guarantorPersonalObj).toPromise().then(
        (response) => {

          this.resultData = response;
          this.AppGuarantorPersonalId = this.resultData.appGuarantorPersonalObj.AppGuarantorPersonalId;
          this.inputLookupObj.jsonSelect = { CustName: this.resultData.appGuarantorObj.GuarantorName };
          this.inputLookupObj.nameSelect = this.resultData.appGuarantorObj.GuarantorName;

          this.PersonalForm.patchValue({
            MrCustRelationshipCode: this.resultData.appGuarantorObj.MrCustRelationshipCode,
            MrIdTypeCode: this.resultData.appGuarantorPersonalObj.MrIdTypeCode,
            MrGenderCode: this.resultData.appGuarantorPersonalObj.MrGenderCode,
            IdNo: this.resultData.appGuarantorPersonalObj.IdNo,
            MrMaritalStatCode: this.resultData.appGuarantorPersonalObj.MrMaritalStatCode,
            MrNationalityCode: this.resultData.appGuarantorPersonalObj.MrNationalityCode,
            BirthPlace: this.resultData.appGuarantorPersonalObj.BirthPlace,
            BirthDt: formatDate(this.resultData.appGuarantorPersonalObj['BirthDt'], 'yyyy-MM-dd', 'en-US'),
            TaxIdNo: this.resultData.appGuarantorObj.TaxIdNo,
            MrReligionCode: this.resultData.appGuarantorPersonalObj.MrReligionCode,
            MobilePhnNo: this.resultData.appGuarantorPersonalObj.MobilePhnNo,
          })
          this.clearExpDt();
          this.PersonalForm.patchValue({
            IdExpDt: this.resultData.appGuarantorPersonalObj.IdExpDt != undefined ? formatDate(this.resultData.appGuarantorPersonalObj.IdExpDt, 'yyyy-MM-dd', 'en-US') : '',
          });
          this.setCountryName(this.resultData.appGuarantorPersonalObj.CountryCode);
          this.setAddrLegalObj();
        },
        (error) => {
          console.log(error);
        }
      );

      if (this.resultData.appGuarantorObj.CustNo != null) {
        this.tempCustNo = this.resultData.appGuarantorObj.CustNo;
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
        this.PersonalForm.controls["MrCustRelationshipCode"].disable();
        this.PersonalForm.controls["AddrObj"]["controls"].Addr.disable();
        this.PersonalForm.controls["AddrObj"]["controls"].AreaCode3.disable();
        this.PersonalForm.controls["AddrObj"]["controls"].AreaCode4.disable();
      }
    }
    else {
      this.ClearForm();
      this.inputLookupObj1.isReady = true;
    }

    var refCustRelObj = {
      RefMasterTypeCode: AdInsConstant.RefMasterTypeCodeCustPersonalRelationship,
      RowVersion: ""
    }
    var idTypeObj = {
      RefMasterTypeCode: AdInsConstant.RefMasterTypeCodeIdType,
      RowVersion: ""
    }
    var genderObj = {
      RefMasterTypeCode: AdInsConstant.RefMasterTypeCodeGender,
      RowVersion: ""
    }
    var maritalObj = {
      RefMasterTypeCode: AdInsConstant.RefMasterTypeCodeMaritalStat,
      RowVersion: ""
    }
    var religionObj = {
      RefMasterTypeCode: AdInsConstant.RefMasterTypeCodeReligion,
      RowVersion: ""
    }
    this.http.post(AdInsConstant.GetListActiveRefMaster, idTypeObj).subscribe(
      (response) => {
        this.MrIdTypeCode = response["ReturnObject"];
        if (this.mode != "edit") {
          this.PersonalForm.patchValue({
            MrIdTypeCode: this.MrIdTypeCode[0].MasterCode
          });
        }
        this.clearExpDt();
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, refCustRelObj).subscribe(
      (response) => {
        this.MrCustRelationshipCode = response["ReturnObject"];
        if (this.mode != "edit") {
          this.PersonalForm.patchValue({
            MrCustRelationshipCode: this.MrCustRelationshipCode[0].MasterCode
          });
        }
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, genderObj).subscribe(
      (response) => {
        this.MrGenderCode = response["ReturnObject"];
        if (this.mode != "edit") {
          this.PersonalForm.patchValue({
            MrGenderCode: this.MrGenderCode[0].MasterCode
          });
        }
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, maritalObj).subscribe(
      (response) => {
        this.MrMaritalStatCode = response["ReturnObject"];
        if (this.mode != "edit") {
          this.PersonalForm.patchValue({
            MrMaritalStatCode: this.MrMaritalStatCode[0].MasterCode
          });
        }
      }
    );
    var obj = { RefMasterTypeCodes: [AdInsConstant.RefMasterTypeCodeNationality]};
    this.http.post(AdInsConstant.GetListRefMasterByRefMasterTypeCodes, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.MrNationalityCode = response["ReturnObject"];
        if (this.mode != "edit") {
          if (this.MrNationalityCode.length > 0) {
            this.PersonalForm.patchValue({
              MrNationalityCode: this.MrNationalityCode[0].MasterCode
            });
          }
        }
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, religionObj).subscribe(
      (response) => {
        this.MrReligionCode = response["ReturnObject"];
        if (this.mode != "edit") {
          this.PersonalForm.patchValue({
            MrReligionCode: this.MrReligionCode[0].MasterCode
          });
        }
      }
    );
  }

  IdTypeHandler(){
    var value = this.PersonalForm.controls["MrIdTypeCode"].value;
    if(value != AdInsConstant.ID_TYPE_EKTP){
      this.PersonalForm.controls["IdExpDt"].setValidators([Validators.required]);
      this.PersonalForm.controls["IdExpDt"].updateValueAndValidity();
      var context = JSON.parse(localStorage.getItem("UserAccess"));
      this.businessDt = new Date(context["BusinessDt"]);
      this.isIdExpiredDateMandatory = true;
    }
    else{
      this.PersonalForm.patchValue({
        IdExpDt: ''
      });
      this.PersonalForm.controls["IdExpDt"].clearValidators();
      this.PersonalForm.controls["IdExpDt"].updateValueAndValidity();
      var context = JSON.parse(localStorage.getItem("UserAccess"));
      this.businessDt = new Date(context["BusinessDt"]);
      this.isIdExpiredDateMandatory = false;
    }
  }

  UserAccess: any;
  MaxDate: Date;
  Max17YO: Date;
  getDate() {
    this.UserAccess = JSON.parse(localStorage.getItem("UserAccess"));
    this.MaxDate = new Date(this.UserAccess.BusinessDt);
    this.Max17YO = new Date(this.UserAccess.BusinessDt);
    this.Max17YO.setFullYear(this.MaxDate.getFullYear() - 17);
  }

  setAddrLegalObj() {
    this.AddrObj = new AddrObj();
    this.AddrObj.Addr = this.resultData.appGuarantorPersonalObj.Addr;
    this.AddrObj.AreaCode1 = this.resultData.appGuarantorPersonalObj.AreaCode1;
    this.AddrObj.AreaCode2 = this.resultData.appGuarantorPersonalObj.AreaCode2;
    this.AddrObj.AreaCode3 = this.resultData.appGuarantorPersonalObj.AreaCode3;
    this.AddrObj.AreaCode4 = this.resultData.appGuarantorPersonalObj.AreaCode4;
    this.AddrObj.City = this.resultData.appGuarantorPersonalObj.City;

    this.inputFieldObj.inputLookupObj.nameSelect = this.resultData.appGuarantorPersonalObj.Zipcode;
    this.inputFieldObj.inputLookupObj.jsonSelect = { Zipcode: this.resultData.appGuarantorPersonalObj.Zipcode };
  }

  setCountryName(countryCode) {
    this.countryObj.CountryCode = countryCode;

    this.http.post(AdInsConstant.GetRefCountryByCountryCode, this.countryObj).subscribe(
      (response) => {
        console.log(response);
        this.inputLookupObj1.nameSelect = response["CountryName"];
        this.inputLookupObj1.jsonSelect = response;
        if (this.resultData.appGuarantorPersonalObj.MrNationalityCode == AdInsConstant.NationalityLocal) {
          this.isLocal = true;
          this.selectedNationalityCountryName = response["CountryName"];

        } else {
          this.isLocal = false
          this.countryCode = countryCode;
        }
      },
      (error) => {
        console.log(error);
      }
    );

  }
  selectedNationalityCountryName: string = "";
  ChangeNationality(ev) {
    if (this.PersonalForm.controls.MrNationalityCode.value == AdInsConstant.NationalityLocal) {
      console.log(this.MrNationalityCode);
      var idx = ev.target.selectedIndex - 1;
      this.selectedNationalityCountryCode = this.MrNationalityCode[idx].ReserveField1;
      this.selectedNationalityCountryName = this.MrNationalityCode[idx].ReserveField2;
      this.isLocal = true;
    } else {
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

  }

  initAddr() {
    this.inputFieldObj = new InputFieldObj();
    this.inputFieldObj.inputLookupObj = new InputLookupObj();
  }

  // GuarantorName="";
  lookupGuarantor(event) {
    console.log(event);
    this.tempCustNo = event.CustNo;
    this.inputLookupObj.isReadonly = true;
    this.http.post(AdInsConstant.GetCustByCustId, { CustId: event.CustId }).subscribe(
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
        this.http.post(AdInsConstant.GetCustPersonalByCustId, { CustId: event.CustId }).subscribe(
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
            if (this.resultData.MrNationalityCode == AdInsConstant.NationalityLocal) {
              this.isLocal = true;
              var idx = 1;
              this.selectedNationalityCountryCode = this.MrNationalityCode[idx].ReserveField1;
              this.selectedNationalityCountryName = this.MrNationalityCode[idx].ReserveField2;
            } else {
              this.isLocal = false;
              this.http.post(AdInsConstant.GetRefCountryByCountryCode, { CountryCode: this.resultData.WnaCountryCode }).subscribe(
                (response) => {
                  this.inputLookupObj1.nameSelect = response["CountryName"];
                  this.countryCode = response["CountryCode"];
                }
              );
            }

          });
        this.http.post(AdInsConstant.GetCustAddrByMrCustAddrType, { CustId: event.CustId, MrCustAddrTypeCode: AdInsConstant.AddrTypeLegal
         }).subscribe(
          (response) => {
            console.log(response);
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
    this.PersonalForm.controls["MrCustRelationshipCode"].disable();
    this.PersonalForm.controls["AddrObj"]["controls"].Addr.disable();
    this.PersonalForm.controls["AddrObj"]["controls"].AreaCode3.disable();
    this.PersonalForm.controls["AddrObj"]["controls"].AreaCode4.disable();
  }

  // CountryCode="";
  lookupCountry(event) {
    console.log(event);
    this.PersonalForm.patchValue(
      {
        CountryCode: event.CountryCode
      }
    );
    console.log(this.PersonalForm);
  }

  Add() {
    this.setAppGuarantor();
    this.setAppGuarantorPersonal();
  }

  clearExpDt() {
    // if (this.PersonalForm.controls.MrIdTypeCode.value == "EKTP") {
    if (this.PersonalForm.controls.MrIdTypeCode.value == AdInsConstant.ID_TYPE_EKTP) {
      this.PersonalForm.patchValue({
        IdExpDt: '',
      });
      this.PersonalForm.controls.IdExpDt.clearValidators();
      this.PersonalForm.controls.IdExpDt.updateValueAndValidity();
      this.isIdExpiredDateMandatory = false;
    }
    else{
      this.isIdExpiredDateMandatory = true;
    }
  }

  setAppGuarantor() {
    if (this.tempCustNo != null) {
      this.guarantorPersonalObj.AppGuarantorObj.CustNo = this.tempCustNo;
    }
    this.guarantorPersonalObj.AppGuarantorObj.GuarantorName = this.inputLookupObj.nameSelect;
    this.guarantorPersonalObj.AppGuarantorObj.MrGuarantorTypeCode = AdInsConstant.CustTypePersonal;
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
      // this.toastr.errorMessage("Birth Date can not be more than " + this.Max17YO);
      this.toastr.warningMessage("Customer age must be at least 17 year old");
      
      flag = false;
    }
    this.guarantorPersonalObj.AppGuarantorPersonalObj.IdExpDt = this.PersonalForm.controls.IdExpDt.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MrNationalityCode = this.PersonalForm.controls.MrNationalityCode.value;
    if (this.PersonalForm.controls.MrNationalityCode.value == AdInsConstant.NationalityLocal) {
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
    console.log(this.PersonalForm);
    this.guarantorPersonalObj = new GuarantorPersonalObj();
    this.Add();
    if (this.mode == "edit") {
      this.guarantorPersonalObj.RowVersion = this.resultData.RowVersion;
      this.guarantorPersonalObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      this.guarantorPersonalObj.AppGuarantorPersonalObj.AppGuarantorPersonalId = this.AppGuarantorPersonalId;
      this.http.post(AdInsConstant.EditAppGuarantorPersonal, this.guarantorPersonalObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          this.close.emit(1);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.http.post(AdInsConstant.AddAppGuarantorPersonal, this.guarantorPersonalObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          this.close.emit(1);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  ClearForm() {
    this.PersonalForm = this.fb.group({
      MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
      MrIdTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      MrGenderCode: ['', [Validators.required, Validators.maxLength(50)]],
      IdNo: ['', [Validators.required, Validators.maxLength(50)]],
      MrMaritalStatCode: ['', [Validators.required, Validators.maxLength(50)]],
      IdExpDt: ['', [Validators.required]],
      MrNationalityCode: ['', [Validators.required, Validators.maxLength(50)]],
      BirthPlace: ['', [Validators.required, Validators.maxLength(200)]],
      BirthDt: ['', [Validators.required]],
      TaxIdNo: ['', [Validators.maxLength(50)]],
      MrReligionCode: ['', [Validators.required, Validators.maxLength(50)]],
      MobilePhnNo: ['', [Validators.required, Validators.maxLength(50)]],
      CountryCode: ['']
    });

    this.initLookup();
    this.initAddr();
  }

  cancel() {
    this.modalService.dismissAll();
  }

  test() {
    console.log(this.PersonalForm);
  }
}
