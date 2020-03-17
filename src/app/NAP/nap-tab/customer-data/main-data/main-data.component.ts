import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-data',
  templateUrl: './main-data.component.html',
  styleUrls: ['./main-data.component.scss']
})

export class MainDataComponent implements OnInit {

  @Input() appId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any; 

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  countryObj = {
    CountryCode: ""
  };
  selectedCustNo: any;
  selectedNationalityCountryCode: any;
  custDataObj: CustDataObj;
  custDataPersonalObj: CustDataPersonalObj;

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


  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {

     }

  ngOnInit() {
    console.log(this.identifier);
    console.log(this.parentForm);

    this.parentForm.addControl(this.identifier, this.fb.group({
      MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      CustFullName: ['', [Validators.required, Validators.maxLength(500)]],
      MrIdTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      MrGenderCode: ['', [Validators.required, Validators.maxLength(50)]],
      IdNo: ['', [Validators.required, Validators.maxLength(50)]],
      MotherMaidenName: ['', [Validators.required, Validators.maxLength(500)]],
      IdExpiredDt: [''],
      MrMaritalStatCode: ['', Validators.maxLength(50)],
      BirthPlace: ['', [Validators.required, Validators.maxLength(100)]],
      BirthDt: ['', Validators.required],
      MrNationalityCode: ['', Validators.maxLength(50)],
      TaxIdNo: ['', Validators.maxLength(50)],
      MobilePhnNo1: ['', [Validators.required, Validators.maxLength(50)]],
      MrEducationCode: ['', Validators.maxLength(50)],
      MobilePhnNo2: ['', Validators.maxLength(50)],
      MrReligionCode: ['', Validators.maxLength(50)],
      MobilePhnNo3: ['', Validators.maxLength(50)],
      IsVip: [false],
      Email1: ['', Validators.maxLength(100)],
      FamilyCardNo: ['', Validators.maxLength(50)],
      Email2: ['', Validators.maxLength(50)],
      NoOfResidence: ['', Validators.maxLength(4)],
      Email3: ['', Validators.maxLength(50)],
      NoOfDependents: ['', Validators.maxLength(4)],
    }));

    // this.initUrl();
    // this.initLookup();
    // this.bindAllRefMasterObj();
  }

  setCustPersonalObj(){
    // this.custDataPersonalObj.AppCustObj.MrCustTypeCode = this.CustDataForm.controls.MrCustTypeCode.value;
    // this.custDataPersonalObj.AppCustObj.CustName = this.InputLookupCustomerObj.nameSelect;
    // this.custDataPersonalObj.AppCustObj.CustNo = this.selectedCustNo;
    // this.custDataPersonalObj.AppCustObj.MrIdTypeCode = this.CustDataForm.controls.MrIdTypeCode.value;
    // this.custDataPersonalObj.AppCustObj.IdNo = this.CustDataForm.controls.IdNo.value;
    // this.custDataPersonalObj.AppCustObj.IdExpiredDt = this.CustDataForm.controls.IdExpiredDt.value;
    // this.custDataPersonalObj.AppCustObj.TaxIdNo = this.CustDataForm.controls.TaxIdNo.value;
    // this.custDataPersonalObj.AppCustObj.IsVip = this.CustDataForm.controls.IsVip.value;
    // this.custDataPersonalObj.AppCustObj.CustModelCode = "PROF";
    // this.custDataPersonalObj.AppCustObj.AppId = this.appId;

    // this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustDataForm.controls.CustFullName.value;
    // this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode = this.CustDataForm.controls.MrGenderCode.value;
    // this.custDataPersonalObj.AppCustPersonalObj.MotherMaidenName = this.CustDataForm.controls.MotherMaidenName.value;
    // this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode = this.CustDataForm.controls.MrMaritalStatCode.value;
    // this.custDataPersonalObj.AppCustPersonalObj.BirthPlace = this.CustDataForm.controls.BirthPlace.value;
    // this.custDataPersonalObj.AppCustPersonalObj.BirthDt = this.CustDataForm.controls.BirthDt.value;
    // this.custDataPersonalObj.AppCustPersonalObj.MrNationalityCode = this.CustDataForm.controls.MrNationalityCode.value;
    // this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode = this.selectedNationalityCountryCode;
    // this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo1 = this.CustDataForm.controls.MobilePhnNo1.value;
    // this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo2 = this.CustDataForm.controls.MobilePhnNo2.value;
    // this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo3= this.CustDataForm.controls.MobilePhnNo3.value;
    // this.custDataPersonalObj.AppCustPersonalObj.MrEducationCode = this.CustDataForm.controls.MrEducationCode.value;
    // this.custDataPersonalObj.AppCustPersonalObj.MrReligionCode = this.CustDataForm.controls.MrReligionCode.value;
    // this.custDataPersonalObj.AppCustPersonalObj.Email1 = this.CustDataForm.controls.Email1.value;
    // this.custDataPersonalObj.AppCustPersonalObj.Email2 = this.CustDataForm.controls.Email2.value;
    // this.custDataPersonalObj.AppCustPersonalObj.Email3 = this.CustDataForm.controls.Email3.value;
    // this.custDataPersonalObj.AppCustPersonalObj.FamilyCardNo = this.CustDataForm.controls.FamilyCardNo.value;
    // this.custDataPersonalObj.AppCustPersonalObj.NoOfResidence = this.CustDataForm.controls.NoOfResidence.value;
    // this.custDataPersonalObj.AppCustPersonalObj.NoOfDependents = this.CustDataForm.controls.NoOfDependents.value;
  }

  CopyCustomer(event) {
    this.selectedCustNo = event.CustNo;
    this.InputLookupCustomerObj.isReadonly = true;
  }

  
  GetCountry(event){
    this.selectedNationalityCountryCode = event.CountryCode;
  }

  CustTypeChanged(event){
    this.setCriteriaLookupCustomer(event.value);
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

  setCountryName(countryCode){
    this.countryObj.CountryCode = countryCode;

    this.http.post(this.getCountryUrl, this.countryObj).subscribe(
      (response) => {
        console.log(response);
        this.InputLookupCountryObj.nameSelect = response["CountryName"];     
      },
      (error) => {
        console.log(error);
      }
    );

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

    this.InputLookupCountryObj = new InputLookupObj();
    this.InputLookupCountryObj.urlJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCountryObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCountryObj.pagingJson = "./assets/uclookup/lookupCountry.json";
    this.InputLookupCountryObj.genericJson = "./assets/uclookup/lookupCountry.json";

  }

  bindAllRefMasterObj(){
    // this.bindCustTypeObj();
    // this.bindIdTypeObj();
    // this.bindGenderObj();
    // this.bindMaritalStatObj();
    // this.bindNationalityObj();
    // this.bindEducationObj();
    // this.bindReligionObj();
  }

  // bindCustTypeObj(){
  //   this.refMasterObj.RefMasterTypeCode = "CUST_TYPE";
  //   this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //     (response) => {
  //       this.CustTypeObj = response["ReturnObject"];
  //       if(this.CustTypeObj.length > 0){
  //         this.CustDataForm.patchValue({
  //           MrCustTypeCode: this.CustTypeObj[0].Key
  //         });
  //         this.setCriteriaLookupCustomer(this.CustTypeObj[0].Key);
  //       }
  //     }
  //   );
  // }

  // bindIdTypeObj(){
  //   this.refMasterObj.RefMasterTypeCode = "ID_TYPE";
  //   this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //     (response) => {
  //       this.IdTypeObj = response["ReturnObject"];
  //       if(this.IdTypeObj.length > 0){
  //         this.CustDataForm.patchValue({
  //           MrIdTypeCode: this.IdTypeObj[0].Key
  //         });
  //       }
  //     }
  //   );
  // }

  // bindGenderObj(){
  //   this.refMasterObj.RefMasterTypeCode = "GENDER";
  //   this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //     (response) => {
  //       this.GenderObj = response["ReturnObject"];
  //       if(this.GenderObj.length > 0){
  //         this.CustDataForm.patchValue({
  //           MrGenderCode: this.GenderObj[0].Key
  //         });
  //       }
  //     }
  //   );
  // }

  // bindMaritalStatObj(){
  //   this.refMasterObj.RefMasterTypeCode = "MARITAL_STAT";
  //   this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //     (response) => {
  //       this.MaritalStatObj = response["ReturnObject"];
  //       if(this.MaritalStatObj.length > 0){
  //         this.CustDataForm.patchValue({
  //           MrMaritalStatCode: this.MaritalStatObj[0].Key
  //         });
  //       }
  //     }
  //   );
  // }

  // bindNationalityObj(){
  //   this.refMasterObj.RefMasterTypeCode = "NATIONALITY";
  //   this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //     (response) => {
  //       this.NationalityObj = response["ReturnObject"];
  //       if(this.NationalityObj.length > 0){
  //         this.CustDataForm.patchValue({
  //           MrNationalityCode: this.NationalityObj[0].Key
  //         });
  //       }
  //     }
  //   );
  // }

  // bindEducationObj(){
  //   this.refMasterObj.RefMasterTypeCode = "EDUCATION";
  //   this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //     (response) => {
  //       this.EducationObj = response["ReturnObject"];
  //       if(this.EducationObj.length > 0){
  //         this.CustDataForm.patchValue({
  //           MrEducationCode: this.EducationObj[0].Key
  //         });
  //       }
  //     }
  //   );
  // }

  // bindReligionObj(){
  //   this.refMasterObj.RefMasterTypeCode = "RELIGION";
  //   this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
  //     (response) => {
  //       this.ReligionObj = response["ReturnObject"];
  //       if(this.ReligionObj.length > 0){
  //         this.CustDataForm.patchValue({
  //           MrReligionCode: this.ReligionObj[0].Key
  //         });
  //       }
  //     }
  //   );
  // }

}
