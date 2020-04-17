import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcLookupObj } from 'app/shared/model/UcLookupObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AppGuarantorPersonalObj } from 'app/shared/model/AppGuarantorPersonalObj.Model';
import { GuarantorPersonalObj } from 'app/shared/model/GuarantorPersonalObj.Model';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-guarantor-personal',
  templateUrl: './guarantor-personal.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class GuarantorPersonalComponent implements OnInit {

  @Input() AppGuarantorId: any;
  @Input() mode: any;
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

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
  }

  PersonalForm = this.fb.group({
    GuarantorName: [''],
    MrCustRelationshipCode: [''],
    MrIdTypeCode: [''],
    MrGenderCode: [''],
    IdNo: ['', Validators.required],
    MrMaritalStatCode: [''],
    IdExpDt: [''],
    MrNationalityCode: [''],
    BirthPlace: [''],
    BirthDt: [''],
    CountryCode: [''],
    TaxIdNo: [''],
    MrReligionCode: [''],
    MobilePhnNo: [''],
    Addr: [''],
    Phn: [''],
    AreaCode1: [''],
    AreaCode2: [''],
    AreaCode3: [''],
    AreaCode4: [''],
    City: [''],
    Zipcode: [''],
    Email: ['']
  });

  ngOnInit() {

    this.initLookup();
    this.initAddr();
    if (this.mode == "edit") {
      var guarantorPersonalObj = new GuarantorPersonalObj();
      guarantorPersonalObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      this.http.post(AdInsConstant.GetAppGuarantorPersonalByAppGuarantorId, guarantorPersonalObj).subscribe(
        (response) => {
          console.log("response: ");
          console.log(response);
          this.resultData = response;
          this.AppGuarantorPersonalId = this.resultData.appGuarantorPersonalObj.AppGuarantorPersonalId;
          this.inputLookupObj.nameSelect = this.resultData.appGuarantorObj.GuarantorName;
          this.inputLookupObj1.nameSelect = this.resultData.appGuarantorPersonalObj.CountryCode;
          this.PersonalForm.patchValue({
            MrCustRelationshipCode: this.resultData.appGuarantorObj.MrCustRelationshipCode,
            MrIdTypeCode: this.resultData.appGuarantorPersonalObj.MrIdTypeCode,
            MrGenderCode: this.resultData.appGuarantorPersonalObj.MrGenderCode,
            IdNo: this.resultData.appGuarantorPersonalObj.IdNo,
            MrMaritalStatCode: this.resultData.appGuarantorPersonalObj.MrMaritalStatCode,
            IdExpDt: formatDate(this.resultData.appGuarantorPersonalObj['IdExpDt'], 'yyyy-MM-dd', 'en-US'),
            MrNationalityCode: this.resultData.appGuarantorPersonalObj.MrNationalityCode,
            BirthPlace: this.resultData.appGuarantorPersonalObj.BirthPlace,
            BirthDt: formatDate(this.resultData.appGuarantorPersonalObj['BirthDt'], 'yyyy-MM-dd', 'en-US'),
            TaxIdNo: this.resultData.appGuarantorObj.TaxIdNo,
            MrReligionCode: this.resultData.appGuarantorPersonalObj.MrReligionCode,
            MobilePhnNo: this.resultData.appGuarantorPersonalObj.MobilePhnNo,
          })
          this.setAddrLegalObj();
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else{
      this.ClearForm();
    }

    var refCustRelObj = {
      RefMasterTypeCode: "CUST_PERSONAL_RELATIONSHIP",
      RowVersion: ""
    }
    var idTypeObj = {
      RefMasterTypeCode: "ID_TYPE",
      RowVersion: ""
    }
    var genderObj = {
      RefMasterTypeCode: "GENDER",
      RowVersion: ""
    }
    var maritalObj = {
      RefMasterTypeCode: "MARITAL_STAT",
      RowVersion: ""
    }
    var natObj = {
      RefMasterTypeCode: "NATIONALITY",
      RowVersion: ""
    }
    var religionObj = {
      RefMasterTypeCode: "RELIGION",
      RowVersion: ""
    }
    this.http.post(AdInsConstant.GetListActiveRefMaster, idTypeObj).subscribe(
      (response) => {
        this.MrIdTypeCode = response["ReturnObject"];
        this.PersonalForm.patchValue({
          MrIdTypeCode: this.MrIdTypeCode[0].MasterCode
        });
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, refCustRelObj).subscribe(
      (response) => {
        this.MrCustRelationshipCode = response["ReturnObject"];
        this.PersonalForm.patchValue({
          MrCustRelationshipCode: this.MrCustRelationshipCode[0].MasterCode
        });
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, genderObj).subscribe(
      (response) => {
        this.MrGenderCode = response["ReturnObject"];
        this.PersonalForm.patchValue({
          MrGenderCode: this.MrGenderCode[0].Key
        });
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, maritalObj).subscribe(
      (response) => {
        this.MrMaritalStatCode = response["ReturnObject"];
        this.PersonalForm.patchValue({
          MrMaritalStatCode: this.MrMaritalStatCode[0].MasterCode
        });
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, natObj).subscribe(
      (response) => {
        this.MrNationalityCode = response["ReturnObject"];
        this.PersonalForm.patchValue({
          MrNationalityCode: this.MrNationalityCode[0].MasterCode
        });
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, religionObj).subscribe(
      (response) => {
        this.MrReligionCode = response["ReturnObject"];
        this.PersonalForm.patchValue({
          MrReligionCode: this.MrReligionCode[0].MasterCode
        });
      }
    );

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

  initLookup(){
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/lookupGuarantorName.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.pagingJson = "./assets/uclookup/lookupGuarantorName.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/lookupGuarantorName.json";

    this.inputLookupObj1 = new InputLookupObj();
    this.inputLookupObj1.urlJson = "./assets/uclookup/lookupCountry.json";
    this.inputLookupObj1.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj1.pagingJson = "./assets/uclookup/lookupCountry.json";
    this.inputLookupObj1.genericJson = "./assets/uclookup/lookupCountry.json";

  }

  initAddr(){
    this.inputFieldObj = new InputFieldObj();
    this.inputFieldObj.inputLookupObj = new InputLookupObj();
  }

  // GuarantorName="";
  lookupGuarantor(event) {
    console.log(event);
    this.PersonalForm.patchValue(
      {
        GuarantorName: event.CustName
      }
    );
    console.log(this.PersonalForm);
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

  setAppGuarantor() {
    this.guarantorPersonalObj.AppGuarantorObj.GuarantorName = this.inputLookupObj.nameSelect;
    this.guarantorPersonalObj.AppGuarantorObj.MrGuarantorTypeCode = "Personal";
    this.guarantorPersonalObj.AppGuarantorObj.TaxIdNo = this.PersonalForm.controls.TaxIdNo.value;
    this.guarantorPersonalObj.AppGuarantorObj.MrCustRelationshipCode = this.PersonalForm.controls.MrCustRelationshipCode.value;
    this.guarantorPersonalObj.AppGuarantorObj.RowVersion = "";
  }

  setAppGuarantorPersonal() {
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MrIdTypeCode = this.PersonalForm.controls.MrIdTypeCode.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MrGenderCode = this.PersonalForm.controls.MrGenderCode.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.IdNo = this.PersonalForm.controls.IdNo.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.BirthPlace = this.PersonalForm.controls.BirthPlace.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.BirthDt = this.PersonalForm.controls.BirthDt.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.IdExpDt = this.PersonalForm.controls.IdExpDt.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.MrNationalityCode = this.PersonalForm.controls.MrNationalityCode.value;
    this.guarantorPersonalObj.AppGuarantorPersonalObj.CountryCode = this.inputLookupObj1.nameSelect;
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
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  ClearForm() {
    this.PersonalForm = this.fb.group({
      MrCustRelationshipCode: [''],
      MrIdTypeCode: [''],
      MrGenderCode:[''],
      IdNo: ['',Validators.required],
      MrMaritalStatCode: [''],
      IdExpDt: [''],
      MrNationalityCode: [''],
      BirthPlace: [''],
      BirthDt: [''],
      TaxIdNo: [''],
      MrReligionCode: [''],
      MobilePhnNo: [''],
    });

    this.initLookup();
    this.initAddr();
  }

}
