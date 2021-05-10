import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustObj } from 'app/shared/model/CustObj.Model';
import { CustPersonalObj } from 'app/shared/model/CustPersonalObj.Model';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ReqByCustNoObj } from 'app/shared/model/Request/ReqByCustNoObj.model';
import { ResponseAppCustCompletionPersonalDataObj } from 'app/shared/model/ResponseAppCustCompletionPersonalDataObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-nap-cust-personal-full-data',
  templateUrl: './new-nap-cust-personal-full-data.component.html',
  styles: []
})
export class NewNapCustPersonalFullDataComponent implements OnInit {
  @Input() ParentForm: FormGroup;
  @Input() AppCustId: number;
  @Input() IsPersonalSubmitted: boolean;
  @Output() ResponseCustGrp: EventEmitter<any> = new EventEmitter<any>();
  @Output() ResponseIsLocal: EventEmitter<any> = new EventEmitter<any>();
  @Output() ResponseLocalCountry: EventEmitter<any> = new EventEmitter<any>();
  @Output() ResponseNationalityCountry: EventEmitter<any> = new EventEmitter<any>();
  isLocal: boolean = true;
  CustFullName: string;
  NationalityCountryCode: string;
  Country: GeneralSettingObj = new GeneralSettingObj();
  LocalCountry: any;
  AppCustGrpObj: AppCustGrpObj = new AppCustGrpObj();
  ListAppCustGrpObj: Array<AppCustGrpObj> = new Array<AppCustGrpObj>();
  CustNoObj: ReqByCustNoObj = new ReqByCustNoObj();
  lookupCountryObj: InputLookupObj = new InputLookupObj();
  lookupCustGrpObj: InputLookupObj = new InputLookupObj();
  SalutationObj: Array<KeyValueObj> = new Array();
  NationalityObj: Array<Object> = new Array();
  EducationObj: Array<KeyValueObj> = new Array();
  ReligionObj: Array<KeyValueObj> = new Array();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) { 
    this.IsPersonalSubmitted = false;
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
    if(this.AppCustId && this.AppCustId > 0){
      this.GetData();
    }
  }

  async GetRefMaster() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeSalutation }).toPromise().then(
      (response) => {
        this.SalutationObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
          MrSalutationCode: this.SalutationObj[0].Key
        });
      });

      await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodeNationality }).toPromise().then(
      (response) => {
        this.NationalityObj = response[CommonConstant.RefMasterObjs];
        this.ParentForm.patchValue({
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

        this.http.post(URLConstant.GetRefCountryByCountryCode, { Code: this.Country.GsValue }).subscribe(
          (response) => {
            this.LocalCountry = response;
            this.ChangeNationality(this.Country.GsValue)
            this.lookupCountryObj.isReady = true;
            this.ResponseLocalCountry.emit(this.LocalCountry.CountryCode);
          });
      });

      await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeEducation }).toPromise().then(
      (response) => {
        this.EducationObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
          MrEducationCode: this.EducationObj[0].Key
        });
      });

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeReligion }).toPromise().then(
      (response) => {
        this.ReligionObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
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
      this.lookupCountryObj.nameSelect = foreign["ReserveField2"];
      this.lookupCountryObj.jsonSelect = { CountryName: foreign["ReserveField2"] };
      this.NationalityCountryCode = foreign["ReserveField1"];
      this.lookupCountryObj.isRequired = true;
      this.ResponseNationalityCountry.emit(this.NationalityCountryCode);
    }
    this.ResponseIsLocal.emit(this.isLocal);
  }

  GetCustGrpData(event) {
    this.ListAppCustGrpObj = new Array();
    this.AppCustGrpObj.AppCustId = this.AppCustId;
    this.AppCustGrpObj.CustNo = event.CustNo;
    this.ListAppCustGrpObj.push(this.AppCustGrpObj);
    this.ResponseCustGrp.emit(this.ListAppCustGrpObj);
  }

  GetCountryData(event) {
    this.NationalityCountryCode = event.CountryCode;
    this.ResponseNationalityCountry.emit(event.CountryCode);
  }

  GetData() {
    this.http.post<ResponseAppCustCompletionPersonalDataObj>(URLConstant.GetAppCustAndAppCustPersonalDataByAppCustId, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.CustFullName = response.AppCustObj.CustName;
        this.ParentForm.patchValue({
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
          MrNationalityCode: response.AppCustPersonalObj.MrNationalityCode != "" ? response.AppCustPersonalObj.MrNationalityCode : this.NationalityObj[1]["MasterCode"],
          MrEducationCode: response.AppCustPersonalObj.MrEducationCode != null ? response.AppCustPersonalObj.MrEducationCode : this.EducationObj[0].Key,
          MrReligionCode: response.AppCustPersonalObj.MrReligionCode != null ? response.AppCustPersonalObj.MrReligionCode : this.ReligionObj[0].Key,
          MrSalutationCode: response.AppCustPersonalObj.MrSalutationCode != null ? response.AppCustPersonalObj.MrSalutationCode : this.SalutationObj[0].Key,
          RowVersionAppCust: response.AppCustObj.RowVersion,
          RowVersionAppCustPersonal: response.AppCustPersonalObj.RowVersion
        });
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
          this.NationalityCountryCode = response.AppCustPersonalObj.NationalityCountryCode;
          this.ResponseNationalityCountry.emit(this.NationalityCountryCode);
        }
          
        if (response.AppCustPersonalObj.MrNationalityCode != "" && response.AppCustPersonalObj.MrNationalityCode != CommonConstant.NationalityLocal) {
          this.isLocal = false;
          this.ResponseIsLocal.emit(this.isLocal);
          this.http.post(URLConstant.GetRefCountryByCountryCode, { Code: response.AppCustPersonalObj.NationalityCountryCode }).subscribe(
            (responseCountry) => {
              this.lookupCountryObj.nameSelect = responseCountry["CountryName"];
              this.lookupCountryObj.jsonSelect = { CountryName: responseCountry["CountryName"]};
              this.lookupCountryObj.isReady = true;
            });
        }

        this.ChangeNationality(response.AppCustPersonalObj.MrNationalityCode);

      }
    );
  }

  CopyExistingCust(custObj: CustObj, custPersonalObj: CustPersonalObj, custGrpObj: Array<AppCustGrpObj>){
    this.ParentForm.patchValue({
      FamilyCardNo: custPersonalObj.FamilyCardNo,
          NoOfDependents: custPersonalObj.NoOfDependents,
          NoOfResidence: custPersonalObj.NoOfResidence,
          IsVip: custObj.IsVip,
          IsAffiliateWithMf: custObj.IsAffiliateWithMf,
          IsRestInPeace: custPersonalObj.IsRestInPeace,
          NickName: custPersonalObj.NickName,
          VIPNotes: custObj.VipNotes,
          CustPrefixName: custPersonalObj.CustPrefixName,
          CustSuffixName: custPersonalObj.CustSuffixName,
          MrNationalityCode: custPersonalObj.MrNationalityCode != "" ? custPersonalObj.MrNationalityCode : this.NationalityObj[1]["MasterCode"],
          MrEducationCode: custPersonalObj.MrEducationCode != null ? custPersonalObj.MrEducationCode : this.EducationObj[0].Key,
          MrReligionCode: custPersonalObj.MrReligionCode != null ? custPersonalObj.MrReligionCode : this.ReligionObj[0].Key,
          MrSalutationCode: custPersonalObj.MrSalutationCode != null ? custPersonalObj.MrSalutationCode : this.SalutationObj[0].Key,
    });

    if (custGrpObj != null && custGrpObj.length > 0 && custGrpObj[0].CustNo != "") {
      this.CustNoObj.CustNo = custGrpObj[0].CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        (responseCustGrp) => {
          this.lookupCustGrpObj.nameSelect = responseCustGrp["CustName"];
          this.lookupCustGrpObj.jsonSelect = { CustName: responseCustGrp["CustName"]};
          this.lookupCustGrpObj.isReady = true;
          this.GetCustGrpData({ CustNo: responseCustGrp["CustNo"]});
        });
    }

    this.VIPCheck();

    if(custPersonalObj.WnaCountryCode != null){
      this.NationalityCountryCode = custPersonalObj.WnaCountryCode;
      this.ResponseNationalityCountry.emit(this.NationalityCountryCode);
    }
      
    if (custPersonalObj.MrNationalityCode != "" && custPersonalObj.MrNationalityCode != CommonConstant.NationalityLocal) {
      this.isLocal = false;
      this.ResponseIsLocal.emit(this.isLocal);
      this.http.post(URLConstant.GetRefCountryByCountryCode, { Code: custPersonalObj.WnaCountryCode }).subscribe(
        (responseCountry) => {
          this.lookupCountryObj.nameSelect = responseCountry["CountryName"];
          this.lookupCountryObj.jsonSelect = { CountryName: responseCountry["CountryName"]};
          this.lookupCountryObj.isReady = true;
        });
    }

    this.ChangeNationality(custPersonalObj.MrNationalityCode);

  }

  VIPCheck(){
    let Vip = false;
    Vip = this.ParentForm.controls.IsVip.value;
    if (Vip == true) {
      this.ParentForm.controls.VIPNotes.enable();     
      this.ParentForm.controls.VIPNotes.setValidators([Validators.required]);
    } else {
      this.ParentForm.controls.VIPNotes.disable();
      this.ParentForm.controls.VIPNotes.patchValue(null);
      this.ParentForm.controls.VIPNotes.clearValidators();
    }
    this.ParentForm.controls.VIPNotes.updateValueAndValidity();
  }

}
