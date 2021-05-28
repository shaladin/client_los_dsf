import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { RegexService } from 'app/shared/services/regex.services';
import { CustomPatternObj } from 'app/shared/model/CustomPatternObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-cust-personal-main-data',
  templateUrl: './cust-personal-main-data.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [RegexService]
})

export class CustPersonalMainDataComponent implements OnInit {

  @Input() isLockLookupCust: boolean = false;
  @Input() isLockMode: boolean = false;
  @Input() appId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() custDataPersonalObj: CustDataPersonalObj = new CustDataPersonalObj();
  @Input() custType: any;
  @Input() IsSpouseExist: boolean = false;
  @Input() bizTemplateCode: string = "";
  @Output() callbackCopyCust: EventEmitter<any> = new EventEmitter();
  @Output() isMarried: EventEmitter<any> = new EventEmitter();
  @Output() spouseObj: EventEmitter<any> = new EventEmitter();

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  countryObj = {
    CountryCode: ""
  };
  selectedCustNo: string;
  selectedNationalityCountryCode: string;
  custDataObj: CustDataObj;

  InputLookupCustomerObj: InputLookupObj;
  InputLookupCountryObj: InputLookupObj;
  IdTypeObj: Array<RefMasterObj>;
  GenderObj: Array<KeyValueObj>;
  MaritalStatObj: Array<KeyValueObj>;
  NationalityObj: Array<RefMasterObj>;
  EducationObj: Array<KeyValueObj>;
  ReligionObj: Array<KeyValueObj>;

  UserAccess: CurrentUserContext;
  MaxDate: Date;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient, 
    private cookieService: CookieService,
    private regexService: RegexService) {

  }

  async ngOnInit(): Promise<void> {
    this.customPattern = new Array<CustomPatternObj>();
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;

    if (this.isLockMode) {
      this.parentForm.addControl(this.identifier, this.fb.group({
        CustFullName: [''],
        MrIdTypeCode: [''],
        MrGenderCode: [''],
        IdNo: [''],
        MotherMaidenName: [''],
        IdExpiredDt: [''],
        MrMaritalStatCode: [''],
        BirthPlace: [''],
        BirthDt: [''],
        MrNationalityCode: [''],
        TaxIdNo: [''],
        MobilePhnNo1: [''],
        MrEducationCode: [''],
        MobilePhnNo2: [''],
        MrReligionCode: [''],
        MobilePhnNo3: [''],
        IsVip: [false],
        Email1: [''],
        FamilyCardNo: [''],
        Email2: [''],
        NoOfResidence: [''],
        Email3: [''],
        NoOfDependents: ['0'],
      }));
    } else {
      this.parentForm.addControl(this.identifier, this.fb.group({
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
        Email1: ['', [Validators.maxLength(100), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        FamilyCardNo: ['', Validators.maxLength(50)],
        Email2: ['', [Validators.maxLength(50), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        NoOfResidence: ['', [Validators.maxLength(4)]],
        Email3: ['', [Validators.maxLength(50), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        NoOfDependents: ['0', [Validators.pattern("^[0-9]+$")]],
      }));
    }

    this.initLookup();
    await this.bindAllRefMasterObj();
    this.bindCustData();
  }

  CopyCustomerEvent(event) {
    this.selectedCustNo = event.CustNo;
    this.InputLookupCustomerObj.isReadonly = true;

    this.http.post(URLConstant.GetCustPersonalForCopyByCustId, {Id : event.CustId}).subscribe(
      (response) => {
        this.CopyCustomer(response);
        this.callbackCopyCust.emit(response);
      });

  }

  CopyCustomer(response) {
    if (response["CustObj"] != undefined) {
      this.parentForm.controls[this.identifier].patchValue({
        MrIdTypeCode: response["CustObj"].MrIdTypeCode,
        IdNo: response["CustObj"].IdNo,
        IdExpiredDt: formatDate(response["CustObj"].IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
        TaxIdNo: response["CustObj"].TaxIdNo,
        IsVip: response["CustObj"].IsVip,
      });
      this.InputLookupCustomerObj.nameSelect = response["CustObj"].CustName;
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

    this.http.post(URLConstant.GetRefCountryByCountryCode, {Code: countryCode}).subscribe(
      (response) => {
        this.InputLookupCountryObj.nameSelect = response["CountryName"];
        this.InputLookupCountryObj.jsonSelect = response;
      });

  }

  bindCustData() {
    if (this.custDataPersonalObj.AppCustObj.AppCustId != 0) {
      this.parentForm.controls[this.identifier].patchValue({
        MrIdTypeCode: this.custDataPersonalObj.AppCustObj.MrIdTypeCode,
        IdNo: this.custDataPersonalObj.AppCustObj.IdNo,
        IdExpiredDt: this.custDataPersonalObj.AppCustObj.IdExpiredDt != undefined ? formatDate(this.custDataPersonalObj.AppCustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : '',
        TaxIdNo: this.custDataPersonalObj.AppCustObj.TaxIdNo,
        IsVip: this.custDataPersonalObj.AppCustObj.IsVip,
      });
      this.InputLookupCustomerObj.nameSelect = this.custDataPersonalObj.AppCustObj.CustName;
      this.InputLookupCustomerObj.jsonSelect = { CustName: this.custDataPersonalObj.AppCustObj.CustName };
      this.selectedCustNo = this.custDataPersonalObj.AppCustObj.CustNo;
      if (this.custDataPersonalObj.AppCustObj.CustNo != undefined && this.custDataPersonalObj.AppCustObj.CustNo != "") {
        this.InputLookupCustomerObj.isReadonly = true;
      }
      this.clearExpDt();
    }

    if (this.custDataPersonalObj.AppCustPersonalObj.AppCustId != 0) {
      this.parentForm.controls[this.identifier].patchValue({
        CustFullName: this.custDataPersonalObj.AppCustPersonalObj.CustFullName,
        MrGenderCode: this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode,
        MotherMaidenName: this.custDataPersonalObj.AppCustPersonalObj.MotherMaidenName,
        MrMaritalStatCode: this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode,
        BirthPlace: this.custDataPersonalObj.AppCustPersonalObj.BirthPlace,
        BirthDt: this.custDataPersonalObj.AppCustPersonalObj.BirthDt != undefined ? formatDate(this.custDataPersonalObj.AppCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US') : '',
        MrNationalityCode: this.custDataPersonalObj.AppCustPersonalObj.MrNationalityCode,
        MobilePhnNo1: this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo1,
        MrEducationCode: this.custDataPersonalObj.AppCustPersonalObj.MrEducationCode,
        MobilePhnNo2: this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo2,
        MrReligionCode: this.custDataPersonalObj.AppCustPersonalObj.MrReligionCode,
        MobilePhnNo3: this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo3,
        Email1: this.custDataPersonalObj.AppCustPersonalObj.Email1,
        FamilyCardNo: this.custDataPersonalObj.AppCustPersonalObj.FamilyCardNo,
        Email2: this.custDataPersonalObj.AppCustPersonalObj.Email2,
        NoOfResidence: this.custDataPersonalObj.AppCustPersonalObj.NoOfResidence,
        Email3: this.custDataPersonalObj.AppCustPersonalObj.Email3,
        NoOfDependents: this.custDataPersonalObj.AppCustPersonalObj.NoOfDependents
      });
      this.ChangeMaritalStats();
      this.selectedNationalityCountryCode = this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode;
      this.setCountryName(this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode);
      this.ChangeNationality(this.custDataPersonalObj.AppCustPersonalObj.MrNationalityCode);
    }
  }

  initLookup() {
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";

    if(this.isLockLookupCust){
      this.InputLookupCustomerObj.isReadonly = true;
    }else{
    this.InputLookupCustomerObj.isReadonly = false;
    }
    
    this.setCriteriaLookupCustomer(CommonConstant.CustTypePersonal);

    this.InputLookupCountryObj = new InputLookupObj();
    this.InputLookupCountryObj.urlJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCountryObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCountryObj.pagingJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.genericJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.isRequired = false;

    if (this.isLockMode) {
      this.InputLookupCountryObj.isDisable = true;
      this.InputLookupCountryObj.isRequired = false;
    }
  }

  async bindAllRefMasterObj() {
    await this.bindIdTypeObj();
    await this.bindGenderObj();
    await this.bindMaritalStatObj();
    await this.bindNationalityObj();
    await this.bindEducationObj();
    await this.bindReligionObj();
  }

  clearExpDt() {
    let noExpDate = [CommonConstant.MrIdTypeCodeEKTP, CommonConstant.MrIdTypeCodeNPWP, CommonConstant.MrIdTypeCodeAKTA];
    if (noExpDate.includes(this.parentForm.controls[this.identifier]['controls'].MrIdTypeCode.value)) {
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
    this.setValidatorPattern();
  }

  async bindIdTypeObj() {    
    await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, {Code : CommonConstant.RefMasterTypeCodeIdType}).toPromise().then(
      (response) => {
        this.IdTypeObj = response["RefMasterObjs"];
        if (this.IdTypeObj.length > 0) {
          var idxDefault = this.IdTypeObj.findIndex(x => x.IsDefaultValue);
          this.parentForm.controls[this.identifier].patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault].MasterCode
          });
        }
        this.clearExpDt();
        if (this.IdTypeObj != undefined) {
          this.getInitPattern();
        }
      }
    );
  }

  async bindGenderObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeGender;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.parentForm.controls[this.identifier].patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      }
    );
  }

  async bindMaritalStatObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeMaritalStat;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.MaritalStatObj = response[CommonConstant.ReturnObj];
        if (this.MaritalStatObj.length > 0) {
          this.parentForm.controls[this.identifier].patchValue({
            MrMaritalStatCode: this.MaritalStatObj[0].Key
          });
          this.ChangeMaritalStats();
        }
      }
    );
  }

  async bindNationalityObj() {
    // this.refMasterObj.RefMasterTypeCode = "NATIONALITY";
    // this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeNationality;
    // var obj = { RefMasterTypeCodes: [CommonConstant.RefMasterTypeCodeNationality] };
    await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, {Code : CommonConstant.RefMasterTypeCodeNationality}).toPromise().then(
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
  }

  async bindEducationObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeEducation;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.EducationObj = response[CommonConstant.ReturnObj];
        if (this.EducationObj.length > 0) {
          this.parentForm.controls[this.identifier].patchValue({
            MrEducationCode: this.EducationObj[0].Key
          });
        }
      }
    );
  }

  async bindReligionObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeReligion;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
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

  isLocal: boolean = false;
  selectedNationalityCountryName: string = "";

  NationalityChanged(event) {
    this.ChangeNationality(event.target.value);
  }

  ChangeNationality(mrNationalityCode) {
    if (mrNationalityCode == CommonConstant.NationalityLocal) {
      var setCountry = this.NationalityObj.find(x => x.MasterCode == mrNationalityCode).DefaultValue.split(';');
      this.selectedNationalityCountryCode = setCountry[0];
      this.selectedNationalityCountryName = setCountry[1] ? setCountry[1] : setCountry[0];
      this.isLocal = true;
    } else {
      var foreign = this.NationalityObj.find(x => x["MasterCode"] == mrNationalityCode);
      var setCountry = foreign.DefaultValue.split(';');
      this.InputLookupCountryObj.nameSelect = setCountry[1] ? setCountry[1] : setCountry[0];
      this.InputLookupCountryObj.jsonSelect = { CountryName: setCountry[1] ? setCountry[1] : setCountry[0] };
      this.selectedNationalityCountryCode = setCountry[0];
      this.isLocal = false;
    }
  }

  ChangeGender() {
    var obj = {
      SpouseGender: "",
      IsSpouseDelete: false
    };

    if (this.IsSpouseExist) {
      if (confirm("You have changed your gender, and it will delete your spouse data, continue?")) {
        obj.IsSpouseDelete = true;
      }
    }
    else {
      obj.IsSpouseDelete = false;
    }
    obj.SpouseGender = this.parentForm.controls[this.identifier]['controls'].MrGenderCode.value;
    this.spouseObj.emit(obj);

    // if (this.parentForm.controls[this.identifier]['controls'].MrGenderCode.value == CommonConstant.MasterCodeGenderFemale) {
    //   if (this.IsSpouseExist) {
    //     if (confirm("You have changed your gender, and it will delete your spouse data, countinue?")) {
    //       obj.SpouseGender = CommonConstant.MasteCodeGenderMale;
    //       obj.IsSpouseDelete = true;
    //       this.spouseObj.emit(obj);
    //     }
    //     else {
    //       this.parentForm.controls[this.identifier].patchValue({
    //         MrGenderCode: CommonConstant.MasteCodeGenderMale
    //       });
    //     }
    //   }
    //   else {
    //     obj.SpouseGender = CommonConstant.MasteCodeGenderMale;
    //     obj.IsSpouseDelete = false;
    //     this.spouseObj.emit(obj);
    //   }
    // }
    // else if (this.parentForm.controls[this.identifier]['controls'].MrGenderCode.value == CommonConstant.MasteCodeGenderMale) {
    //   if (this.IsSpouseExist) {
    //     if (confirm("You have changed your gender, and it will delete your spouse data, countinue?")) {
    //       obj.SpouseGender = CommonConstant.MasterCodeGenderFemale;
    //       obj.IsSpouseDelete = true;
    //       this.spouseObj.emit(obj);
    //     }
    //     else {
    //       this.parentForm.controls[this.identifier].patchValue({
    //         MrGenderCode: CommonConstant.MasterCodeGenderFemale
    //       });
    //     }
    //   }
    //   else {
    //     obj.SpouseGender = CommonConstant.MasterCodeGenderFemale;
    //     obj.IsSpouseDelete = false;
    //     this.spouseObj.emit(obj);
    //   }
    // }
  }

  ChangeMaritalStats() {
    if (this.parentForm.controls[this.identifier]['controls'].MrMaritalStatCode.value == CommonConstant.MasteCodeMartialStatsMarried) {
      this.isMarried.emit(true);
    }
    else {
      this.isMarried.emit(false);
    }
  }

  //START URS-LOS-041
  controlNameIdNo: any = 'IdNo';
  controlNameIdType: any = 'MrIdTypeCode';
  customPattern: Array<CustomPatternObj>;
  initIdTypeCode: any;
  resultPattern: any;

  getInitPattern() {
    this.regexService.getListPattern().subscribe(
      response => {
        this.resultPattern = response[CommonConstant.ReturnObj];
        if (this.resultPattern != undefined) {
          for (let i = 0; i < this.resultPattern.length; i++) {
            let patternObj: CustomPatternObj = new CustomPatternObj();
            let pattern: string = this.resultPattern[i].Value;

            patternObj.pattern = pattern;
            patternObj.invalidMsg = this.regexService.getErrMessage(pattern);
            this.customPattern.push(patternObj);
          }
          this.setValidatorPattern();
        }
      }
    );
  }
  // setValidatorPattern(){
  //   let idTypeValue: string;

  //   idTypeValue = this.parentForm.controls[this.identifier]['controls'][this.controlNameIdType].value;

  //   if (this.resultPattern != undefined) {
  //     var result = this.resultPattern.find(x => x.Key == idTypeValue)

  //     if (result != undefined) {
  //       var pattern = result.Value;
  //       if (pattern != undefined) {
  //         this.setValidator(pattern);
  //       }
  //     }
  //   }
  // }

  setValidatorPattern() {
    let idTypeValue: string;
    idTypeValue = this.parentForm.controls[this.identifier]['controls'][this.controlNameIdType].value;
    var pattern: string = '';
    if (idTypeValue != undefined) {
      if (this.resultPattern != undefined) {
        var result = this.resultPattern.find(x => x.Key == idTypeValue)
        if (result != undefined) {
          pattern = result.Value;
        }
      }
    }
    this.setValidator(pattern);
  }

  setValidator(pattern: string) {
    if (pattern != undefined) {
      if (this.isLockMode) {
        this.parentForm.controls[this.identifier]['controls'][this.controlNameIdNo].setValidators([Validators.required, Validators.pattern(pattern)]);
        this.parentForm.controls[this.identifier]['controls'][this.controlNameIdNo].updateValueAndValidity();
      }

    }
  }
  //END OF URS-LOS-041

}
