import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { ResponseAppCustCompletionPersonalDataObj } from 'app/shared/model/ResponseAppCustCompletionPersonalDataObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-cust-detail-personal',
  templateUrl: './cust-detail-personal.component.html',
  styleUrls: ['./cust-detail-personal.component.scss']
})
export class CustDetailPersonalComponent implements OnInit {
  @Input() AppCustId: number;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  isLocal: boolean = true;
  CustFullName: string;
  NationalityCountryCode: string;
  Country: GeneralSettingObj = new GeneralSettingObj();
  LocalCountry: any;
  AppCustObj: AppCustObj = new AppCustObj();
  AppCustPersonalObj: AppCustPersonalObj = new AppCustPersonalObj();
  AppCustGrpObj: AppCustGrpObj = new AppCustGrpObj();
  ListAppCustGrpObj: Array<AppCustGrpObj> = new Array<AppCustGrpObj>();
  lookupCountryObj: InputLookupObj = new InputLookupObj();
  lookupCustGrpObj: InputLookupObj = new InputLookupObj();
  SalutationObj: Array<KeyValueObj> = new Array();
  NationalityObj: Array<Object> = new Array();
  EducationObj: Array<KeyValueObj> = new Array();
  ReligionObj: Array<KeyValueObj> = new Array();
  CustNoObj: GenericObj = new GenericObj();
  CustDetailForm = this.fb.group({
    FamilyCardNo: ['', Validators.pattern("^[0-9]+$")],
    NoOfDependents: ['', Validators.pattern("^[0-9]+$")],
    NoOfResidence: ['', Validators.pattern("^[0-9]+$")],
    IsRestInPeace: [false],
    IsVip: [false],
    IsAffiliateWithMf: [false],
    NickName: [''],
    MrNationalityCode: ['', Validators.required],
    MrEducationCode: ['', Validators.required],
    MrReligionCode: ['', Validators.required],
    VIPNotes: [''],
    CustPrefixName: [''],
    CustSuffixName: [''],
    MrSalutationCode: ['']
  })

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {
  }

  async ngOnInit() {
    this.lookupCustGrpObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.lookupCustGrpObj.urlEnviPaging = environment.FoundationR3Url;
    this.lookupCustGrpObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.isRequired = false;
    this.lookupCustGrpObj.isReady = true;
    await this.GetRefMaster();
    this.GetData();
  }

  async GetRefMaster() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeSalutation }).toPromise().then(
      (response) => {
        this.SalutationObj = response[CommonConstant.ReturnObj];
        this.CustDetailForm.patchValue({
          MrSalutationCode: this.SalutationObj[0].Key
        });
      });

      await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodeNationality }).toPromise().then(
      (response) => {
        this.NationalityObj = response[CommonConstant.RefMasterObjs];
        this.CustDetailForm.patchValue({
          MrNationalityCode: this.NationalityObj[1]["MasterCode"]
        });
      });

    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeDefLocalNationality }).toPromise().then(
      (response) => {
        this.Country = response;
        this.lookupCountryObj.urlJson = "./assets/uclookup/lookupCustomerCountry.json";
        this.lookupCountryObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
        this.lookupCountryObj.urlEnviPaging = environment.FoundationR3Url;
        this.lookupCountryObj.pagingJson = "./assets/uclookup/lookupCustomerCountry.json";
        this.lookupCountryObj.genericJson = "./assets/uclookup/lookupCustomerCountry.json";
        this.lookupCountryObj.addCritInput = new Array();

        var criteriaObj = new CriteriaObj();
        criteriaObj.restriction = AdInsConstant.RestrictionNeq;
        criteriaObj.propName = 'COUNTRY_CODE';
        criteriaObj.value = this.Country.GsValue;
        this.lookupCountryObj.addCritInput.push(criteriaObj);
        this.ChangeNationality(this.Country.GsValue)

        this.http.post(URLConstant.GetRefCountryByCountryCode, { Code: this.Country.GsValue }).subscribe(
          (response) => {
            this.LocalCountry = response;
            this.lookupCountryObj.isReady = true;
          });
      });

      await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeEducation }).toPromise().then(
      (response) => {
        this.EducationObj = response[CommonConstant.ReturnObj];
        this.CustDetailForm.patchValue({
          MrEducationCode: this.EducationObj[0].Key
        });
      });

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeReligion }).toPromise().then(
      (response) => {
        this.ReligionObj = response[CommonConstant.ReturnObj];
        this.CustDetailForm.patchValue({
          MrReligionCode: this.ReligionObj[0].Key
        });
      });
  }

  ChangeNationality(value: string) {
    if (value == CommonConstant.NationalityLocal || value == "IDN") {
      this.isLocal = true;
      this.lookupCountryObj.isRequired = false;
    } else {
      this.isLocal = false;
      var foreign = this.NationalityObj.find(x => x["MasterCode"] == value);

      var setCountry = foreign["DefaultValue"].split(';');
      this.lookupCountryObj.nameSelect = setCountry[1] || setCountry[0];
      this.lookupCountryObj.jsonSelect = { CountryName: setCountry[1] || setCountry[0] };
      this.NationalityCountryCode = setCountry[0];
      this.lookupCountryObj.isRequired = true;
    }
  }

  GetCustGrpData(event) {
    this.ListAppCustGrpObj = new Array();
    this.AppCustGrpObj.AppCustId = this.AppCustId;
    this.AppCustGrpObj.CustNo = event.CustNo;
    this.ListAppCustGrpObj.push(this.AppCustGrpObj);
  }

  GetCountryData(event) {
    this.NationalityCountryCode = event.CountryCode;
  }

  GetData() {
    this.http.post<ResponseAppCustCompletionPersonalDataObj>(URLConstant.GetAppCustAndAppCustPersonalDataByAppCustId, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.CustFullName = response.AppCustObj.CustName;
        this.CustDetailForm.patchValue({
          FamilyCardNo: response.AppCustPersonalObj.FamilyCardNo,
          NoOfDependents: response.AppCustPersonalObj.NoOfDependents,
          NoOfResidence: response.AppCustPersonalObj.NoOfResidence,
          IsVip: response.AppCustObj.IsVip,
          IsAffiliateWithMf: response.AppCustObj.IsAffiliateWithMf,
          IsRestInPeace: response.AppCustPersonalObj.IsRestInPeace,
          NickName: response.AppCustPersonalObj.NickName,
          VIPNotes: response.AppCustObj.VipNotes,
          CustPrefixName: response.AppCustPersonalObj.CustPrefixName,
          CustSuffixName: response.AppCustPersonalObj.CustSuffixName,
          MrNationalityCode: response.AppCustPersonalObj.MrNationalityCode != null && response.AppCustPersonalObj.MrNationalityCode != "" ? response.AppCustPersonalObj.MrNationalityCode : this.NationalityObj[1]["MasterCode"],
          MrEducationCode: response.AppCustPersonalObj.MrEducationCode != null ? response.AppCustPersonalObj.MrEducationCode : this.EducationObj[0].Key,
          MrReligionCode: response.AppCustPersonalObj.MrReligionCode != null ? response.AppCustPersonalObj.MrReligionCode : this.ReligionObj[0].Key,
          MrSalutationCode: response.AppCustPersonalObj.MrSalutationCode != null ? response.AppCustPersonalObj.MrSalutationCode : this.SalutationObj[0].Key
        })
        this.AppCustObj.RowVersion = response.AppCustObj.RowVersion;
        this.AppCustPersonalObj.RowVersion = response.AppCustPersonalObj.RowVersion;
        if (response.AppCustGrpObj != null && response.AppCustGrpObj.CustNo != "") {
          this.CustNoObj.CustNo = response.AppCustGrpObj.CustNo;
          this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
            (responseCustGrp) => {
              this.lookupCustGrpObj.nameSelect = responseCustGrp["CustName"];
              this.lookupCustGrpObj.jsonSelect = { CustName: responseCustGrp["CustName"]};
              this.lookupCustGrpObj.isReady = true;
              this.GetCustGrpData({ CustNo: responseCustGrp["CustNo"]});
            });
        }

        this.VIPCheck();

        if(response.AppCustPersonalObj.NationalityCountryCode != null){
          this.NationalityCountryCode = response.AppCustPersonalObj.NationalityCountryCode
        }
          
        if ((response.AppCustPersonalObj.MrNationalityCode != null && response.AppCustPersonalObj.MrNationalityCode != "" ) && response.AppCustPersonalObj.MrNationalityCode != CommonConstant.NationalityLocal) {
          this.isLocal = false;
          this.http.post(URLConstant.GetRefCountryByCountryCode, { Code: response.AppCustPersonalObj.NationalityCountryCode }).subscribe(
            (responseCountry) => {
              this.lookupCountryObj.nameSelect = responseCountry["CountryName"];
              this.lookupCountryObj.jsonSelect = { CountryName: responseCountry["CountryName"]};
              this.lookupCountryObj.isReady = true;
            });
        }else{
          this.ChangeNationality(CommonConstant.NationalityLocal);
        }
      }
    );
  }
  
  SetData() {
    this.AppCustObj.AppCustId = this.AppCustId;
    this.AppCustObj.IsVip = this.CustDetailForm.controls.IsVip.value;
    this.AppCustObj.IsAffiliateWithMf = this.CustDetailForm.controls.IsAffiliateWithMf.value;
    this.AppCustObj.VipNotes = this.CustDetailForm.controls.VIPNotes.value;

    this.AppCustPersonalObj.CustFullName = this.CustFullName;
    this.AppCustPersonalObj.CustPrefixName = this.CustDetailForm.controls.CustPrefixName.value;
    this.AppCustPersonalObj.CustSuffixName = this.CustDetailForm.controls.CustSuffixName.value;
    this.AppCustPersonalObj.MrNationalityCode = this.CustDetailForm.controls.MrNationalityCode.value;
    this.AppCustPersonalObj.NationalityCountryCode = this.isLocal ? this.LocalCountry.CountryCode : this.NationalityCountryCode;
    this.AppCustPersonalObj.MrEducationCode = this.CustDetailForm.controls.MrEducationCode.value;
    this.AppCustPersonalObj.MrReligionCode = this.CustDetailForm.controls.MrReligionCode.value;
    this.AppCustPersonalObj.MrSalutationCode = this.CustDetailForm.controls.MrSalutationCode.value;
    this.AppCustPersonalObj.FamilyCardNo = this.CustDetailForm.controls.FamilyCardNo.value;
    this.AppCustPersonalObj.NoOfDependents = this.CustDetailForm.controls.NoOfDependents.value;
    this.AppCustPersonalObj.NoOfResidence = this.CustDetailForm.controls.NoOfResidence.value;
    this.AppCustPersonalObj.NickName = this.CustDetailForm.controls.NickName.value;
    this.AppCustPersonalObj.IsRestInPeace = this.CustDetailForm.controls.IsRestInPeace.value;
  }

  SaveForm() {
    this.SetData();
    let requestObj = {
      AppCustObj: this.AppCustObj,
      AppCustPersonalObj: this.AppCustPersonalObj,
      AppCustGrpObjs: this.ListAppCustGrpObj
    }
    this.http.post(URLConstant.UpdateAppCustCompletionPersonal, requestObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.OutputTab.emit({IsComplete: true});
      },
      error => {
        console.log(error);
      });
  }

  VIPCheck(IsVip: boolean = false){
  if (IsVip == true) {
    this.CustDetailForm.controls.VIPNotes.enable();     
    this.CustDetailForm.controls.VIPNotes.setValidators([Validators.required]);
  } else {
    this.CustDetailForm.controls.VIPNotes.patchValue(null);
    this.CustDetailForm.controls.VIPNotes.disable();
    this.CustDetailForm.controls.VIPNotes.clearValidators();
  }
  this.CustDetailForm.controls.VIPNotes.updateValueAndValidity();
  }
}
