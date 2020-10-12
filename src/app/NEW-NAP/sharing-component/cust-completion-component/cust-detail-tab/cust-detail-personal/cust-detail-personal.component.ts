import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
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
  CustModelObj: Array<KeyValueObj> = new Array();
  SalutationObj: Array<KeyValueObj> = new Array();
  NationalityObj: Array<KeyValueObj> = new Array();
  EducationObj: Array<KeyValueObj> = new Array();
  ReligionObj: Array<KeyValueObj> = new Array();

  CustDetailForm = this.fb.group({
    CustModelCode: ['', Validators.required],
    FamilyCardNo: [''],
    NoOfDependents: [''],
    NoOfResidence: [''],
    IsVip: [false],
    IsAffiliateWithMF: [false],
    NickName: [''],
    MrNationalityCode: ['', Validators.required],
    MrEducationCode: ['', Validators.required],
    MrReligionCode: ['', Validators.required],
    VIPNotes: [''],
    CustPrefixName: [''],
    CustSuffixName: [''],
    MrSalutationCode: [''],
    IsRestInPeace: [false]
  })

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {
  }

  ngOnInit() {
    this.GetRefMaster();
    
    this.lookupCustGrpObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.lookupCustGrpObj.urlEnviPaging = environment.FoundationR3Url;
    this.lookupCustGrpObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.isRequired = false;
    this.lookupCustGrpObj.isReady = true;

    this.GetData();
  }

  GetRefMaster(){
    this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, {MrCustTypeCode: CommonConstant.CustTypePersonal}).subscribe(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        this.CustDetailForm.patchValue({
          CustModelCode: this.CustModelObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode : CommonConstant.RefMasterTypeCodeSalutation}).subscribe(
      (response) => {
        this.SalutationObj = response[CommonConstant.ReturnObj];
        this.CustDetailForm.patchValue({
          MrSalutationCode: this.SalutationObj[0].Key
        });
      });

      this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, {RefMasterTypeCode : CommonConstant.RefMasterTypeCodeNationality}).subscribe(
        (response) => {
          this.NationalityObj = response[CommonConstant.RefMasterObjs];
          this.CustDetailForm.patchValue({
            MrNationalityCode: this.NationalityObj[1]["MasterCode"]
          });
        });
        
      this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingByCode, {GsCode: CommonConstant.GSCodeDefLocalNationality}).subscribe(
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
  
          this.http.post(URLConstant.GetRefCountryByCountryCode, {CountryCode: this.Country.GsValue}).subscribe(
            (response) => {
              this.LocalCountry = response;
              this.lookupCountryObj.isReady = true;
            });
        });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode : CommonConstant.RefMasterTypeCodeEducation}).subscribe(
      (response) => {
        this.EducationObj = response[CommonConstant.ReturnObj];
        this.CustDetailForm.patchValue({
          MrEducationCode: this.EducationObj[0].Key
        });
      });
    
      this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode : CommonConstant.RefMasterTypeCodeReligion}).subscribe(
        (response) => {
          this.ReligionObj = response[CommonConstant.ReturnObj];
          this.CustDetailForm.patchValue({
            MrReligionCode: this.ReligionObj[0].Key
          });
        });
  }

  ChangeNationality(value: string){
    if(value == CommonConstant.NationalityLocal || value == "IDN"){
      this.isLocal = true;
      this.lookupCountryObj.isRequired = false;
    }else{
      this.isLocal = false;
      var foreign = this.NationalityObj.find(x => x["MasterCode"] == value);
      this.lookupCountryObj.nameSelect = foreign["ReserveField2"];
      this.lookupCountryObj.jsonSelect =  { CountryName: foreign["ReserveField2"]};
      this.NationalityCountryCode = foreign["ReserveField1"];
      this.lookupCountryObj.isRequired = true;
    }
  }

  GetCustGrpData(event){
    this.ListAppCustGrpObj = new Array();
    this.AppCustGrpObj.AppCustId = this.AppCustId;
    this.AppCustGrpObj.CustNo = event.CustNo;
    this.ListAppCustGrpObj.push(this.AppCustGrpObj);
  }

  GetCountryData(event){
    this.NationalityCountryCode = event.CountryCode;
  }

  GetData(){
    this.http.post(URLConstant.GetAppCustAndAppCustPersonalDataByAppCustId, {AppCustId: this.AppCustId}).subscribe(
      (response) => {
        this.CustFullName = response["CustFullName"];
        this.CustDetailForm.patchValue({
          FamilyCardNo : response["FamilyCardNo"],
          NoOfDependents : response["NoOfDependents"],
          NoOfResidence : response["NoOfResidence"],
          IsVip : response["IsVip"],
          IsAffiliateWithMF : response["IsAffiliateWithMF"],
          NickName : response["NickName"],
          VIPNotes : response["VipNotes"],
          CustPrefixName : response["CustPrefixName"],
          CustSuffixName : response["CustSuffixName"],
          IsRestInPeace : response["IsRestInPeace"],
          MrNationalityCode : response["MrNationalityCode"] != "" ? response["MrNationalityCode"] : this.NationalityObj[1]["MasterCode"],
          MrEducationCode : response["MrEducationCode"] != "" ? response["MrEducationCode"] : this.EducationObj[0].Key,
          MrReligionCode : response["MrReligionCode"] != "" ? response["MrReligionCode"] : this.ReligionObj[0].Key,
          MrSalutationCode : response["MrSalutationCode"] != "" ? response["MrSalutationCode"] : this.SalutationObj[0].Key,
          CustModelCode : response["CustModelCode"] != "" ? response["CustModelCode"] : this.CustModelObj[0].Key,
        })
        this.AppCustObj.RowVersion = response["AppCustRowVersion"];
        this.AppCustPersonalObj.RowVersion = response["AppCustPersonalRowVersion"];

        if(response["CustNoParent"] != ""){
          this.http.post(URLConstant.GetCustByCustNo, {CustNo: response["CustNoParent"]}).subscribe(
            (responseCustGrp) => {
              this.lookupCustGrpObj.nameSelect = responseCustGrp["CustName"];
              this.lookupCustGrpObj.jsonSelect = {CustName: responseCustGrp["CustName"]};
              this.lookupCustGrpObj.isReady = true;
              this.GetCustGrpData({CustNo:responseCustGrp["CustNo"]});
            });
        }

        this.NationalityCountryCode = response["NationalityCountryCode"]

        if(response["MrNationalityCode"] != CommonConstant.NationalityLocal){
          this.isLocal = false;
          this.http.post(URLConstant.GetRefCountryByCountryCode, {CountryCode: response["NationalityCountryCode"]}).subscribe(
            (responseCountry) => {
              this.lookupCountryObj.nameSelect = responseCountry["CountryName"];
              this.lookupCountryObj.jsonSelect = {CountryName: responseCountry["CountryName"]};
              this.lookupCountryObj.isReady = true;
            });
        }
      }
    );
  }

  SetData(){
    this.AppCustObj.AppCustId = this.AppCustId;
    this.AppCustObj.CustModelCode = this.CustDetailForm.controls.CustModelCode.value;
    this.AppCustObj.IsVip = this.CustDetailForm.controls.IsVip.value;
    this.AppCustObj.IsAffiliateWithMF = this.CustDetailForm.controls.IsAffiliateWithMF.value;
    this.AppCustObj.VIPNotes = this.CustDetailForm.controls.VIPNotes.value;
    
    this.AppCustPersonalObj.CustFullName = this.CustFullName;
    this.AppCustPersonalObj.CustPrefixName = this.CustDetailForm.controls.CustPrefixName.value;
    this.AppCustPersonalObj.CustSuffixName = this.CustDetailForm.controls.CustSuffixName.value;
    this.AppCustPersonalObj.MrNationalityCode = this.CustDetailForm.controls.MrNationalityCode.value;
    this.AppCustPersonalObj.NationalityCountryCode = this.isLocal? this.LocalCountry.CountryCode : this.NationalityCountryCode;
    this.AppCustPersonalObj.MrEducationCode = this.CustDetailForm.controls.MrEducationCode.value;
    this.AppCustPersonalObj.MrReligionCode = this.CustDetailForm.controls.MrReligionCode.value;
    this.AppCustPersonalObj.MrSalutationCode = this.CustDetailForm.controls.MrSalutationCode.value;
    this.AppCustPersonalObj.FamilyCardNo = this.CustDetailForm.controls.FamilyCardNo.value;
    this.AppCustPersonalObj.NoOfDependents = this.CustDetailForm.controls.NoOfDependents.value;
    this.AppCustPersonalObj.NoOfResidence = this.CustDetailForm.controls.NoOfResidence.value;
    this.AppCustPersonalObj.NickName = this.CustDetailForm.controls.NickName.value;
    this.AppCustPersonalObj.IsRestInPeace = this.CustDetailForm.controls.IsRestInPeace.value;
  }

  SaveForm(){
    this.SetData();
    let requestObj={
      AppCustObj: this.AppCustObj, 
      AppCustPersonalObj: this.AppCustPersonalObj,
      AppCustGrpObjs: this.ListAppCustGrpObj
    }

    this.http.post(URLConstant.UpdateAppCustCompletionPersonal, requestObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.OutputTab.emit();
      },
      error => {
        console.log(error);
      });
  }
}
