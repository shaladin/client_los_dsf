import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cust-personal-main-data-FL4W',
  templateUrl: './cust-personal-main-data-FL4W.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustPersonalMainDataFL4WComponent implements OnInit {

  @Input() appId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() custDataPersonalObj: CustDataPersonalObj = new CustDataPersonalObj();
  @Input() custType: any;

  @Output() callbackCopyCust: EventEmitter<any> = new EventEmitter();


  refMasterObj = {
    RefMasterTypeCode: "",
  };
  countryObj = {
    CountryCode: ""
  };
  selectedCustNo: any;
  selectedNationalityCountryCode: any;
  custDataObj: CustDataObj;

  InputLookupCustomerObj: any;
  InputLookupCountryObj: any;
  CustTypeObj: any;
  IdTypeObj: any;
  GenderObj: any;
  MaritalStatObj: any;
  NationalityObj: any;
  EducationObj: any;
  ReligionObj: any;

  getRefMasterUrl: any;
  getCountryUrl: any;
  businessDt: Date = new Date();

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {

     }

  async ngOnInit() : Promise<void> {
    var context = JSON.parse(localStorage.getItem("UserAccess"));
    this.businessDt = new Date(context["BusinessDt"]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);
    console.log(this.identifier);
    console.log(this.parentForm);

    this.parentForm.addControl(this.identifier, this.fb.group({
      CustFullName: ['', [Validators.required, Validators.maxLength(500)]],
      MrIdTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      MrGenderCode: ['', [Validators.required, Validators.maxLength(50)]],
      IdNo: ['', [Validators.required, Validators.maxLength(50),Validators.pattern("^[0-9]+$")]],
      MotherMaidenName: ['', [Validators.required, Validators.maxLength(500)]],
      IdExpiredDt: [''],
      MrMaritalStatCode: ['', Validators.maxLength(50)],
      BirthPlace: ['', [Validators.required, Validators.maxLength(100)]],
      BirthDt: ['', Validators.required],
      MrNationalityCode: ['', Validators.maxLength(50)],
      TaxIdNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      MobilePhnNo1: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      MrEducationCode: ['', Validators.maxLength(50)],
      MobilePhnNo2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      MrReligionCode: ['', Validators.maxLength(50)],
      MobilePhnNo3: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      IsVip: [false],
      Email1: ['', Validators.maxLength(100)],
      FamilyCardNo: ['', Validators.maxLength(50)],
      Email2: ['', Validators.maxLength(100)],
      NoOfResidence: ['', [Validators.pattern("^[0-9]+$"), Validators.maxLength(4)]],
      Email3: ['', Validators.maxLength(100)],
      NoOfDependents: ['', [Validators.pattern("^[0-9]+$"), Validators.maxLength(4)]],
    }));

    this.initUrl();
    this.initLookup();
    await this.bindAllRefMasterObj();
    this.bindCustData();
  }

  CopyCustomerEvent(event) {
    this.selectedCustNo = event.CustNo;
    this.InputLookupCustomerObj.isReadonly = true;

    var custObj = {CustId: event.CustId};
    this.http.post(AdInsConstant.GetCustPersonalForCopyByCustId, custObj).subscribe(
      (response) => {
        console.log(response);
        this.CopyCustomer(response);
        this.callbackCopyCust.emit(response);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  CopyCustomer(response){
    if(response["CustObj"] != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        MrIdTypeCode: response["CustObj"].MrIdTypeCode,
        IdNo: response["CustObj"].IdNo,
        IdExpiredDt: formatDate(response["CustObj"].IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
        TaxIdNo: response["CustObj"].TaxIdNo,
        IsVip: response["CustObj"].IsVip,
      });
      this.InputLookupCustomerObj.nameSelect = response["CustObj"].CustName;
      this.InputLookupCustomerObj.jsonSelect = {CustName: response["CustObj"].CustName};
      this.selectedCustNo = response["CustObj"].CustNo;
      this.parentForm.controls[this.identifier]['controls']["MrIdTypeCode"].disable();
      this.parentForm.controls[this.identifier]['controls']["IdNo"].disable();
      this.parentForm.controls[this.identifier]['controls']["TaxIdNo"].disable();
    }
    
    if(response["CustPersonalObj"] != undefined){
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
      
      this.selectedNationalityCountryCode = response["CustPersonalObj"].NationalityCountryCode;
      this.setCountryName(response["CustPersonalObj"].NationalityCountryCode);
      this.parentForm.controls[this.identifier]['controls']["BirthPlace"].disable();
      this.parentForm.controls[this.identifier]['controls']["BirthDt"].disable();
    }
  }

  
  GetCountry(event){
    this.selectedNationalityCountryCode = event.CountryCode;
  }

  setCriteriaLookupCustomer(custTypeCode){
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    arrCrit.push(critObj);
    this.InputLookupCustomerObj.addCritInput = arrCrit;
  }

  setCriteriaLookupCountry(){
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionNotIn;
    critObj.propName = 'COUNTRY_CODE';
    critObj.listValue = ['IDN'];
    arrCrit.push(critObj);
    this.InputLookupCountryObj.addCritInput = arrCrit;
  }

  setCountryName(countryCode){
    this.countryObj.CountryCode = countryCode;

    this.http.post(this.getCountryUrl, this.countryObj).subscribe(
      (response) => {
        console.log(response);
        this.InputLookupCountryObj.nameSelect = response["CountryName"];
        this.InputLookupCountryObj.jsonSelect = response;
        if(countryCode == "LOCAL"){
          this.selectedNationalityCountryName = response["CountryName"];
          this.isLocal = true;
        }else{
          this.isLocal = false
        }     
      },
      (error) => {
        console.log(error);
      }
    );

  }

  bindCustData(){
    if(this.custDataPersonalObj.AppCustObj != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        MrIdTypeCode: this.custDataPersonalObj.AppCustObj.MrIdTypeCode,
        IdNo: this.custDataPersonalObj.AppCustObj.IdNo,
        IdExpiredDt: this.custDataPersonalObj.AppCustObj.IdExpiredDt != undefined ? formatDate(this.custDataPersonalObj.AppCustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : '',
        TaxIdNo: this.custDataPersonalObj.AppCustObj.TaxIdNo,
        IsVip: this.custDataPersonalObj.AppCustObj.IsVip,
      });
      this.InputLookupCustomerObj.nameSelect = this.custDataPersonalObj.AppCustObj.CustName;
      this.InputLookupCustomerObj.jsonSelect = {CustName: this.custDataPersonalObj.AppCustObj.CustName};
      this.selectedCustNo = this.custDataPersonalObj.AppCustObj.CustNo;
      if(this.custDataPersonalObj.AppCustObj.CustNo != undefined && this.custDataPersonalObj.AppCustObj.CustNo != ""){
        this.InputLookupCustomerObj.isReadonly = true;
      }
    }
    
    if(this.custDataPersonalObj.AppCustPersonalObj != undefined){
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
      
      this.selectedNationalityCountryCode = this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode;
      this.setCountryName(this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode);
    }
  }

  initUrl(){
    this.getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getCountryUrl = AdInsConstant.GetRefCountryByCountryCode;
  }

  initLookup(){
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReadonly = false;
    this.setCriteriaLookupCustomer(AdInsConstant.CustTypePersonal);

    this.InputLookupCountryObj = new InputLookupObj();
    this.InputLookupCountryObj.urlJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCountryObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCountryObj.pagingJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.genericJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.isRequired = false;
    this.setCriteriaLookupCountry();
  }

  async bindAllRefMasterObj(){
    await this.bindIdTypeObj();
    await this.bindGenderObj();
    await this.bindMaritalStatObj();
    await this.bindNationalityObj();
    await this.bindEducationObj();
    await this.bindReligionObj();
  }

  async bindIdTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "ID_TYPE";
    await this.http.post(this.getRefMasterUrl, this.refMasterObj).toPromise().then(
      (response) => {
        this.IdTypeObj = response["ReturnObject"];
        if(this.IdTypeObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            MrIdTypeCode: this.IdTypeObj[0].Key
          });
        }
      }
    );
  }

  async bindGenderObj(){
    this.refMasterObj.RefMasterTypeCode = "GENDER";
    await this.http.post(this.getRefMasterUrl, this.refMasterObj).toPromise().then(
      (response) => {
        this.GenderObj = response["ReturnObject"];
        if(this.GenderObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      }
    );
  }

  async bindMaritalStatObj(){
    this.refMasterObj.RefMasterTypeCode = "MARITAL_STAT";
    await this.http.post(this.getRefMasterUrl, this.refMasterObj).toPromise().then(
      (response) => {
        this.MaritalStatObj = response["ReturnObject"];
        if(this.MaritalStatObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            MrMaritalStatCode: this.MaritalStatObj[0].Key
          });
        }
      }
    );
  }

  async bindNationalityObj(){
    // this.refMasterObj.RefMasterTypeCode = "NATIONALITY";
    var obj = { RefMasterTypeCodes: ["NATIONALITY"] };
    await this.http.post(AdInsConstant.GetListRefMasterByRefMasterTypeCodes, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.NationalityObj = response["ReturnObject"];
        if(this.NationalityObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            MrNationalityCode: this.NationalityObj[0].MasterCode
          });
        }
      }
    );
  }

  async bindEducationObj(){
    this.refMasterObj.RefMasterTypeCode = "EDUCATION";
    await this.http.post(this.getRefMasterUrl, this.refMasterObj).toPromise().then(
      (response) => {
        this.EducationObj = response["ReturnObject"];
        if(this.EducationObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            MrEducationCode: this.EducationObj[0].Key
          });
        }
      }
    );
  }

  async bindReligionObj(){
    this.refMasterObj.RefMasterTypeCode = "RELIGION";
    await this.http.post(this.getRefMasterUrl, this.refMasterObj).toPromise().then(
      (response) => {
        this.ReligionObj = response["ReturnObject"];
        if(this.ReligionObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            MrReligionCode: this.ReligionObj[0].Key
          });
        }
      }
    );
  }

  isLocal: boolean = false;
  selectedNationalityCountryName: string = "";
  ChangeNationality(ev){
    if(this.parentForm.controls[this.identifier]['controls'].MrNationalityCode.value == "LOCAL"){
      console.log(this.parentForm);
      console.log(this.identifier);
      console.log(this.NationalityObj);
      console.log(ev);
      var idx = ev.target.selectedIndex - 1;
      this.selectedNationalityCountryCode = this.NationalityObj[idx].ReserveField1;
      this.selectedNationalityCountryName = this.NationalityObj[idx].ReserveField2;
      this.isLocal = true;
    }else{
      this.isLocal = false;
    }
  }

}
