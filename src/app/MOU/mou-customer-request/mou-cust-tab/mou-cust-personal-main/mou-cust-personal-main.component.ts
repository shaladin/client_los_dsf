import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { MouCustPersonalDataObj } from 'app/shared/model/MouCustPersonalDataObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-mou-cust-personal-main',
  templateUrl: './mou-cust-personal-main.component.html',
  styleUrls: ['./mou-cust-personal-main.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

export class MouCustPersonalMainComponent implements OnInit {
  @Input() MouCustId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() custDataPersonalObj: MouCustPersonalDataObj = new MouCustPersonalDataObj();
  @Input() custType: any;
  @Input() IsSpouseExist: boolean = false;
  @Output() callbackCopyCust: EventEmitter<any> = new EventEmitter();
  @Output() isMarried: EventEmitter<any> = new EventEmitter();
  @Output() spouseObj: EventEmitter<any> = new EventEmitter();

  countryObj = {
    CountryCode: ""
  };
  selectedCustNo: any;
  selectedNationalityCountryCode: any;
  custDataObj: CustDataObj;

  InputLookupCustomerObj: InputLookupObj = new InputLookupObj();
  InputLookupCountryObj: InputLookupObj = new InputLookupObj();
  CustTypeObj: any;
  IdTypeObj: any;
  GenderObj: any;
  MaritalStatObj: any;
  NationalityObj: any;
  EducationObj: any;
  ReligionObj: any;

  getCountryUrl: any;
  UserAccess: any;
  MaxDate: Date;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient, private cookieService: CookieService) {

  }

  async ngOnInit(): Promise<void> {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;

    this.parentForm.addControl(this.identifier, this.fb.group({
      CustNo: [''],
      CustFullName: ['', [Validators.required, Validators.maxLength(500)]],
      MrIdTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      MrGenderCode: ['', [Validators.required, Validators.maxLength(50)]],
      IdNo: ['', [Validators.required, Validators.maxLength(50)]],
      MotherMaidenName: ['', [Validators.required, Validators.maxLength(500)]],
      IdExpiredDt: [''],
      MrMaritalStatCode: ['', [Validators.required, Validators.maxLength(50)]],
      BirthPlace: ['', [Validators.required, Validators.maxLength(100)]],
      BirthDt: ['', [Validators.required]],
      MrNationalityCode: ['', Validators.maxLength(50)],
      TaxIdNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
      MobilePhnNo1: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      MrEducationCode: ['', Validators.maxLength(50)],
      MobilePhnNo2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      MrReligionCode: ['', Validators.maxLength(50)],
      MobilePhnNo3: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      IsVip: [false],
      Email1: ['', [Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
      FamilyCardNo: ['', Validators.maxLength(50)],
      Email2: ['', [Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
      NoOfResidence: ['', [Validators.maxLength(4)]],
      Email3: ['', [Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
      NoOfDependents: ['', [Validators.maxLength(4)]],
    }));

    this.initUrl();
    this.initLookup();
    this.bindAllRefMasterObj();
    await this.bindCustData();
  }

  CopyCustomerEvent(event) {
    this.selectedCustNo = event.CustNo;
    this.InputLookupCustomerObj.isReadonly = true;

    var custObj = { CustId: event.CustId };
    this.http.post(URLConstant.GetCustPersonalForCopyByCustId, custObj).subscribe(
      (response) => {
        this.CopyCustomer(response);
        this.callbackCopyCust.emit(response);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  CopyCustomer(response) {
    if (response["CustObj"] != undefined) {
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: response["CustObj"].CustNo,
        CustName: response["CustObj"].CustName,
        MrIdTypeCode: response["CustObj"].MrIdTypeCode,
        IdNo: response["CustObj"].IdNo,
        IdExpiredDt: formatDate(response["CustObj"].IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
        TaxIdNo: response["CustObj"].TaxIdNo,
        IsVip: response["CustObj"].IsVip,
      });
      this.InputLookupCustomerObj.jsonSelect = { CustName: response["CustObj"].CustName };
      this.selectedCustNo = response["CustObj"].CustNo;
      this.parentForm.controls[this.identifier]['controls']["MrIdTypeCode"].disable();
      this.parentForm.controls[this.identifier]['controls']["IdNo"].disable();
      this.parentForm.controls[this.identifier]['controls']["TaxIdNo"].disable();
    }

    if (response["CustPersonalObj"] != undefined) {
      this.parentForm.controls[this.identifier].patchValue({
        CustFullName: response["CustPersonalObj"].CustFullName,
        MrGenderCode: response["CustPersonalObj"].MrGenderCode,
        MotherMaidenName: response["CustPersonalObj"].MotherMaidenName,
        MrMaritalStatCode: response["CustPersonalObj"].MrMaritalStatCode,
        BirthPlace: response["CustPersonalObj"].BirthPlace,
        BirthDt: formatDate(response["CustPersonalObj"].BirthDt, 'yyyy-MM-dd', 'en-US'),
        MrNationalityCode: response["CustPersonalObj"].MrNationalityCode,
        MobilePhnNo1: response["CustPersonalObj"].MobilePhnNo1,
        MrEducationCode: response["CustPersonalObj"].MrEducationCode,
        MobilePhnNo2: response["CustPersonalObj"].MobilePhnNo2,
        MrReligionCode: response["CustPersonalObj"].MrReligionCode,
        MobilePhnNo3: response["CustPersonalObj"].MobilePhnNo3,
        Email1: response["CustPersonalObj"].Email1,
        FamilyCardNo: response["CustPersonalObj"].FamilyCardNo,
        Email2: response["CustPersonalObj"].Email2,
        NoOfResidence: response["CustPersonalObj"].NoOfResidence,
        Email3: response["CustPersonalObj"].Email3,
        NoOfDependents: response["CustPersonalObj"].NoOfDependents
      });


      this.selectedNationalityCountryCode = response["CustPersonalObj"].WnaCountryCode;
      this.setCountryName(response["CustPersonalObj"].WnaCountryCode);
      this.ChangeNationality(response["CustPersonalObj"].MrNationalityCode);
      this.parentForm.controls[this.identifier]['controls']["BirthPlace"].disable();
      this.parentForm.controls[this.identifier]['controls']["BirthDt"].disable();
      this.ChangeMaritalStats();
    }
  }


  GetCountry(event) {
    this.selectedNationalityCountryCode = event.CountryCode;
  }

  setCriteriaLookupCustomer(custTypeCode) {
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    arrCrit.push(critObj);
    this.InputLookupCustomerObj.addCritInput = arrCrit;
  }

  setCountryName(countryCode) {
    this.countryObj.CountryCode = countryCode;

    this.http.post(this.getCountryUrl, {Code: countryCode}).subscribe(
      (response) => {
        this.InputLookupCountryObj.jsonSelect = { CountryName: response["CountryName"] };
      },
      (error) => {
        console.log(error);
      }
    );

  }

  async bindCustData() {
    if (this.custDataPersonalObj.MouCustObj.MouCustId != 0) {
      this.parentForm.controls[this.identifier].patchValue({
        CustNo: this.custDataPersonalObj.MouCustObj.CustNo,
        CustName: this.custDataPersonalObj.MouCustObj.CustName,
        MrIdTypeCode: this.custDataPersonalObj.MouCustObj.MrIdTypeCode,
        IdNo: this.custDataPersonalObj.MouCustObj.IdNo,
        IdExpiredDt: this.custDataPersonalObj.MouCustObj.IdExpiredDt != undefined ? formatDate(this.custDataPersonalObj.MouCustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : '',
        TaxIdNo: this.custDataPersonalObj.MouCustObj.TaxIdNo,
        IsVip: this.custDataPersonalObj.MouCustObj.IsVip,
      });
      this.InputLookupCustomerObj.jsonSelect = { CustName: this.custDataPersonalObj.MouCustObj.CustName };
      this.selectedCustNo = this.custDataPersonalObj.MouCustObj.CustNo;
      if (this.custDataPersonalObj.MouCustObj.CustNo != undefined && this.custDataPersonalObj.MouCustObj.CustNo != "") {
        this.InputLookupCustomerObj.isReadonly = true;
      }
      this.clearExpDt();
    }

    if (this.custDataPersonalObj.MouCustPersonalObj.MouCustId != 0) {
      this.parentForm.controls[this.identifier].patchValue({
        CustFullName: this.custDataPersonalObj.MouCustPersonalObj.CustFullName,
        MrGenderCode: this.custDataPersonalObj.MouCustPersonalObj.MrGenderCode,
        MotherMaidenName: this.custDataPersonalObj.MouCustPersonalObj.MotherMaidenName,
        MrMaritalStatCode: this.custDataPersonalObj.MouCustPersonalObj.MrMaritalStatCode,
        BirthPlace: this.custDataPersonalObj.MouCustPersonalObj.BirthPlace,
        BirthDt: this.custDataPersonalObj.MouCustPersonalObj.BirthDt != undefined ? formatDate(this.custDataPersonalObj.MouCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US') : '',
        MrNationalityCode: this.custDataPersonalObj.MouCustPersonalObj.MrNationalityCode,
        MobilePhnNo1: this.custDataPersonalObj.MouCustPersonalObj.MobilePhnNo1,
        MrEducationCode: this.custDataPersonalObj.MouCustPersonalObj.MrEducationCode,
        MobilePhnNo2: this.custDataPersonalObj.MouCustPersonalObj.MobilePhnNo2,
        MrReligionCode: this.custDataPersonalObj.MouCustPersonalObj.MrReligionCode,
        MobilePhnNo3: this.custDataPersonalObj.MouCustPersonalObj.MobilePhnNo3,
        Email1: this.custDataPersonalObj.MouCustPersonalObj.Email1,
        FamilyCardNo: this.custDataPersonalObj.MouCustPersonalObj.FamilyCardNo,
        Email2: this.custDataPersonalObj.MouCustPersonalObj.Email2,
        NoOfResidence: this.custDataPersonalObj.MouCustPersonalObj.NoOfResidence,
        Email3: this.custDataPersonalObj.MouCustPersonalObj.Email3,
        NoOfDependents: this.custDataPersonalObj.MouCustPersonalObj.NoOfDependents
      });

      this.selectedNationalityCountryCode = this.custDataPersonalObj.MouCustPersonalObj.NationalityCountryCode;
      this.setCountryName(this.custDataPersonalObj.MouCustPersonalObj.NationalityCountryCode);
      this.ChangeNationality(this.custDataPersonalObj.MouCustPersonalObj.MrNationalityCode);
      this.ChangeMaritalStats();
    }
  }

  initUrl() {
    this.getCountryUrl = URLConstant.GetRefCountryByCountryCode;
  }

  initLookup() {
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReadonly = false;
    this.setCriteriaLookupCustomer(CommonConstant.CustTypePersonal);

    this.InputLookupCountryObj.urlJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupCountryObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCountryObj.pagingJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.genericJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.isRequired = false;

  }

  bindAllRefMasterObj() {
    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeObj = response["RefMasterObjs"];
        if (this.IdTypeObj.length > 0) {
          var idxDefault = this.IdTypeObj.findIndex(x => x.IsDefaultValue);
          this.parentForm.controls[this.identifier].patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault].MasterCode
          });
        }
        this.clearExpDt();
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { "RefMasterTypeCode": CommonConstant.RefMasterTypeCodeGender }).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          if(this.custDataPersonalObj.MouCustPersonalObj.MrGenderCode == null){
            this.parentForm.controls[this.identifier].patchValue({
              MrGenderCode: this.GenderObj[0].Key
            });
          }
        }
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { "RefMasterTypeCode": CommonConstant.RefMasterTypeCodeMaritalStat }).subscribe(
      (response) => {
        this.MaritalStatObj = response[CommonConstant.ReturnObj];
        if (this.MaritalStatObj.length > 0) {
          if (this.custDataPersonalObj.MouCustPersonalObj.MrMaritalStatCode == null) {
            this.parentForm.controls[this.identifier].patchValue({
              MrMaritalStatCode: this.MaritalStatObj[0].Key
            });
          }
          this.ChangeMaritalStats();
        }
      }
    );

    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code : CommonConstant.RefMasterTypeCodeNationality }).subscribe(
      (response) => {
        this.NationalityObj = response["RefMasterObjs"];
        if (this.NationalityObj.length > 0) {
          var idxDefault = this.NationalityObj.findIndex(x => x.IsDefaultValue);
          this.parentForm.controls[this.identifier].patchValue({
            MrNationalityCode: this.NationalityObj[idxDefault].MasterCode
          });
          this.ChangeNationality(this.NationalityObj[idxDefault].MasterCode);
        }
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { "RefMasterTypeCode": CommonConstant.RefMasterTypeCodeEducation }).subscribe(
      (response) => {
        this.EducationObj = response[CommonConstant.ReturnObj];
        if (this.EducationObj.length > 0) {
          this.parentForm.controls[this.identifier].patchValue({
            MrEducationCode: this.EducationObj[0].Key
          });
        }
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { "RefMasterTypeCode": CommonConstant.RefMasterTypeCodeReligion }).subscribe(
      (response) => {
        this.ReligionObj = response[CommonConstant.ReturnObj];
        if (this.ReligionObj.length > 0) {
          this.parentForm.controls[this.identifier].patchValue({
            MrReligionCode: this.ReligionObj[0].Key
          });
        }
      }
    );
  }

  clearExpDt() {
    if (this.parentForm.controls[this.identifier]['controls'].MrIdTypeCode.value == CommonConstant.MrIdTypeCodeEKTP) {
      this.parentForm.controls[this.identifier].patchValue({
        IdExpiredDt: '',
      });
    }
    if (this.parentForm.controls[this.identifier]['controls'].MrIdTypeCode.value == "NPWP") {
      this.parentForm.controls[this.identifier]['controls'].TaxIdNo.setValidators([Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]);
      this.parentForm.controls[this.identifier]['controls'].TaxIdNo.updateValueAndValidity();
    }
    else {
      this.parentForm.controls[this.identifier]['controls'].TaxIdNo.setValidators([Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]);
      this.parentForm.controls[this.identifier]['controls'].TaxIdNo.updateValueAndValidity();
    }
    var idExpiredDate = this.parentForm.controls[this.identifier].get("IdExpiredDt");
    if (this.parentForm.controls[this.identifier]['controls'].MrIdTypeCode.value == CommonConstant.MrIdTypeCodeKITAS || this.parentForm.controls[this.identifier]['controls'].MrIdTypeCode.value == CommonConstant.MrIdTypeCodeSIM) {
      idExpiredDate.setValidators([Validators.required]);
    } else {
      idExpiredDate.clearValidators();
    }
    idExpiredDate.updateValueAndValidity();
  }

  isLocal: boolean = false;
  selectedNationalityCountryName: string = "";

  NationalityChanged(event) {
    this.ChangeNationality(event.target.value);
  }

  ChangeNationality(mrNationalityCode) {
    if (this.NationalityObj != undefined) {
      if (mrNationalityCode == CommonConstant.NationalityLocal) {
        var setCountry = this.NationalityObj.find(x => x.MasterCode == mrNationalityCode).DefaultValue.split(';');
        this.selectedNationalityCountryCode = setCountry[0];
        this.selectedNationalityCountryName = setCountry[1] ? setCountry[1] : setCountry[0];
        this.isLocal = true;
      } else {
        this.isLocal = false;
        var foreign = this.NationalityObj.find(x => x["MasterCode"] == mrNationalityCode);
        var setCountry = foreign.DefaultValue.split(';');
        this.InputLookupCountryObj.nameSelect = setCountry[1] ? setCountry[1] : setCountry[0];
        this.InputLookupCountryObj.jsonSelect = { CountryName: setCountry[1] ? setCountry[1] : setCountry[0] };
        this.selectedNationalityCountryCode = setCountry[0];
      }
    }
  }

  ChangeGender() {
    var obj = {
      SpouseGender: "",
      IsSpouseDelete: false
    };
    if (this.parentForm.controls[this.identifier]['controls'].MrGenderCode.value == CommonConstant.MasterCodeGenderFemale) {
      if (this.IsSpouseExist) {
        if (confirm("You have changed your gender, and it will delete your spouse data, continue?")) {
          obj.SpouseGender = CommonConstant.MasteCodeGenderMale;
          obj.IsSpouseDelete = true;
          this.spouseObj.emit(obj);
        }
        else {
          this.parentForm.controls[this.identifier].patchValue({
            MrGenderCode: CommonConstant.MasteCodeGenderMale
          });
        }
      }
      else {
        obj.SpouseGender = CommonConstant.MasteCodeGenderMale;
        obj.IsSpouseDelete = false;
        this.spouseObj.emit(obj);
      }
    }
    else if (this.parentForm.controls[this.identifier]['controls'].MrGenderCode.value == CommonConstant.MasteCodeGenderMale) {
      if (this.IsSpouseExist) {
        if (confirm("You have changed your gender, and it will delete your spouse data, continue?")) {
          obj.SpouseGender = CommonConstant.MasterCodeGenderFemale;
          obj.IsSpouseDelete = true;
          this.spouseObj.emit(obj);
        }
        else {
          this.parentForm.controls[this.identifier].patchValue({
            MrGenderCode: CommonConstant.MasterCodeGenderFemale
          });
        }
      }
      else {
        obj.SpouseGender = CommonConstant.MasterCodeGenderFemale;
        obj.IsSpouseDelete = false;
        this.spouseObj.emit(obj);
      }
    }
  }

  ChangeMaritalStats() {
    if (this.parentForm.controls[this.identifier]['controls'].MrMaritalStatCode.value == CommonConstant.MasteCodeMartialStatsMarried) {
      this.isMarried.emit(true);
    }
    else {
      this.isMarried.emit(false);
    }
  }
}