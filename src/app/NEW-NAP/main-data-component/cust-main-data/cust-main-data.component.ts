import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio/typings/public-api';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { formatDate } from '@angular/common';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-cust-main-data',
  templateUrl: './cust-main-data.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustMainDataComponent implements OnInit {
  @Input() identifier: string;
  @Input() ParentForm: FormGroup;
  AppId: number;
  isExisting: boolean = false;
  isUcAddressReady: boolean = false;
  MrCustTypeCode: string;
  MaxDate: Date;
  InputLookupCustomerObj: InputLookupObj;
  inputAddressObj: InputAddressObj;
  inputFieldAddressObj: InputFieldObj;
  CustTypeObj: Array<Object>;
  IdTypeObj: Array<Object>;
  GenderObj: Array<Object>;
  CustModelObj: Array<Object>;
  CompanyTypeObj: Array<Object>;
  UserAccess: Object;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  CustMainDataForm = this.fb.group({
    MrCustTypeCode: [Validators.required],
    CustName: [Validators.required],
    CompanyType: [Validators.required],
    CustModelCode: [Validators.required],
    MrIdTypeCode: [Validators.required],
    IdNo: [Validators.required],
    IdExpiredDt: [],
    TaxIdNo: [Validators.required],
    MrGenderCode: [Validators.required],
    BirthPlace: [Validators.required],
    BirthDt: [Validators.required],
    MotherMaidenName: [Validators.required],
    MrCompanyTypeCode: [],
  });

  ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess["BusinessDt"];

    this.SetLookup();

    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.title = "Address";
    this.inputAddressObj.showOwnership = true;
    this.inputFieldAddressObj = new InputFieldObj();
    this.inputFieldAddressObj.inputLookupObj = new InputLookupObj();
    this.isUcAddressReady = true;
    
    this.GetRefMasterPersonal();
  }

  SetLookup(value: string = "PERSONAL"){
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReady = false;
    this.InputLookupCustomerObj.addCritInput = new Array();
    this.InputLookupCustomerObj.isReadonly = false;

    let critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MR_CUST_TYPE_CODE';
    critObj.value = value;
    this.InputLookupCustomerObj.addCritInput.push(critObj);
    this.InputLookupCustomerObj.isReady = true;
  }

  GetRefMasterPersonal(){
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType}).subscribe(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
        this.CustMainDataForm.patchValue({
          MrCustTypeCode: this.CustTypeObj[0]["Key"]
        })
        this.CheckBox(this.CustTypeObj[0]["Key"], true);
      }
    );

    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType}).subscribe(
      (response) => {
        this.IdTypeObj = response["RefMasterObjs"];
        if(this.IdTypeObj.length > 0){
          var idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
          this.CustMainDataForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
        }
        this.ClearExpDt();
      }
    );

     this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode : CommonConstant.RefMasterTypeCodeGender}).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if(this.GenderObj.length > 0){
          this.CustMainDataForm.patchValue({
            MrGenderCode: this.GenderObj[0]["Key"]
          });
        }
      }
    );

    this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, {MrCustTypeCode : CommonConstant.CustTypePersonal}).subscribe(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        if(this.CustModelObj.length > 0){
          this.CustMainDataForm.patchValue({
            CustModelCode: this.CustModelObj[0]["Key"]
          });
        }
      }
    );
  }

  GetRefMasterCompany(){
    this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, {MrCustTypeCode : CommonConstant.CustTypeCompany}).subscribe(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        if(this.CustModelObj.length > 0){
          this.CustMainDataForm.patchValue({
            CustModelCode: this.CustModelObj[0]["Key"]
          });
        }
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode : CommonConstant.RefMasterTypeCodeCompanyType}).subscribe(
      (response) => {
        this.CompanyTypeObj = response[CommonConstant.ReturnObj];
        if (this.CompanyTypeObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrCompanyTypeCode: this.CompanyTypeObj[0]["Key"]
          });
        }
      }
    );
  }

  CheckBox(value: string = 'PERSONAL', firstInit: boolean = false) {
    this.MrCustTypeCode = value;
    this.CustMainDataForm.reset();
    this.CustMainDataForm.clearValidators();
    this.CustMainDataForm.enable();

    this.SetLookup(value);
    if(!firstInit){
      if(value == CommonConstant.CustTypePersonal){
        this.GetRefMasterPersonal();
      }else{
        this.GetRefMasterCompany();
      }
    }

    // // clearing if not edit
    // if (!this.isExisting) {
    //   if (ev.value == CommonConstant.CustTypePersonal) {
    //     this.CustDataForm.controls['personalMainData'].patchValue({
    //       CustFullName: [''],
    //       MrIdTypeCode: [''],
    //       MrGenderCode: [''],
    //       IdNo: [''],
    //       MotherMaidenName: [''],
    //       IdExpiredDt: [''],
    //       MrMaritalStatCode: [''],
    //       BirthPlace: [''],
    //       BirthDt: [''],
    //       MrNationalityCode: [''],
    //       TaxIdNo: [''],
    //       MobilePhnNo1: [''],
    //       MrEducationCode: [''],
    //       MobilePhnNo2: [''],
    //       MrReligionCode: [''],
    //       MobilePhnNo3: [''],
    //       IsVip: [false],
    //       Email1: [''],
    //       FamilyCardNo: [''],
    //       Email2: [''],
    //       NoOfResidence: [''],
    //       Email3: [''],
    //       NoOfDependents: ['0'],
    //     });

    //     // this.legalAddrObj = new AddrObj();
    //     // this.inputFieldLegalObj.inputLookupObj.nameSelect = "";
    //     // this.inputFieldLegalObj.inputLookupObj.jsonSelect = {};
    //     // this.inputAddressObjForLegal.default = null;
    //     // this.inputAddressObjForLegal.inputField = new InputFieldObj();

    //     // this.mailingAddrObj = new AddrObj();
    //     // this.inputFieldMailingObj.inputLookupObj.nameSelect = "";
    //     // this.inputFieldMailingObj.inputLookupObj.jsonSelect = {};
    //     // this.inputAddressObjForMailing.default = null;
    //     // this.inputAddressObjForMailing.inputField = new InputFieldObj();

    //     // this.residenceAddrObj = new AddrObj();
    //     // this.inputFieldResidenceObj.inputLookupObj.nameSelect = "";
    //     // this.inputFieldResidenceObj.inputLookupObj.jsonSelect = {};
    //     // this.inputAddressObjForResidence.default = null;
    //     // this.inputAddressObjForResidence.inputField = new InputFieldObj();

    //     // this.listAppCustPersonalContactInformation = new Array<AppCustPersonalContactPersonObj>();
    //     // this.listAppCustBankAcc = new Array<AppCustBankAccObj>();
    //     // this.custDataPersonalObj.AppCustSocmedObjs = new Array<AppCustSocmedObj>();
    //     // this.custDataPersonalObj.AppCustPersonalFinDataObj= new AppCustPersonalFinDataObj();
    //     // this.custDataPersonalObj.AppCustGrpObjs=new Array<AppCustGrpObj>();
    //     // this.custDataPersonalObj.AppCustPersonalJobDataObj=new AppCustPersonalJobDataObj();

    //     // this.CustDataForm.controls['personalMainData']['controls']["MrIdTypeCode"].enable();
    //     // this.CustDataForm.controls['personalMainData']['controls']["IdNo"].enable();
    //     // this.CustDataForm.controls['personalMainData']['controls']["TaxIdNo"].enable();
    //     // this.CustDataForm.controls['personalMainData']['controls']["BirthPlace"].enable();
    //     // this.CustDataForm.controls['personalMainData']['controls']["BirthDt"].enable();
    //   }
    //   if (ev.value == CommonConstant.CustTypeCompany) {
    //     this.CustDataCompanyForm.controls['companyMainData'].patchValue({
    //       CustNo: [''],
    //       IndustryTypeCode: [''],
    //       CustModelCode: [''],
    //       CompanyBrandName: [''],
    //       MrCompanyTypeCode: [''],
    //       NumOfEmp: [0],
    //       IsAffiliated: [false],
    //       EstablishmentDt: [''],
    //       TaxIdNo: [''],
    //       IsVip: [false]
    //     });
        
    //     // this.legalAddrCompanyObj = new AddrObj();
    //     // this.inputFieldLegalCompanyObj.inputLookupObj.nameSelect = "";
    //     // this.inputFieldLegalCompanyObj.inputLookupObj.jsonSelect = {};
    //     // this.inputAddressObjForLegalCoy.default = null;
    //     // this.inputAddressObjForLegalCoy.inputField = new InputFieldObj();

    //     // this.mailingAddrCompanyObj = new AddrObj();
    //     // this.inputFieldMailingCompanyObj.inputLookupObj.nameSelect = "";
    //     // this.inputFieldMailingCompanyObj.inputLookupObj.jsonSelect = {};
    //     // this.inputAddressObjForMailingCoy.default = null;
    //     // this.inputAddressObjForMailingCoy.inputField = new InputFieldObj();

    //     // this.listShareholder = new Array<AppCustCompanyMgmntShrholderObj>();
    //     // this.listContactPersonCompany = new Array<AppCustCompanyContactPersonObj>();
    //     // this.custDataCompanyObj.AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
    //     // this.listAppCustBankAccCompany = new Array<AppCustBankAccObj>();
    //     // this.listLegalDoc = new Array<AppCustCompanyLegalDocObj>();
    //     // this.custDataCompanyObj.AppCustGrpObjs = new Array<AppCustGrpObj>();

    //     // this.CustDataCompanyForm.controls['companyMainData']['controls']["TaxIdNo"].enable();
    //   }
    // }
  }

  CopyCustomerEvent(event) {
    this.InputLookupCustomerObj.isReadonly = true;

    this.http.post(URLConstant.GetCustPersonalForCopyByCustId, {CustId: event.CustId}).subscribe(
      (response) => {
        this.CopyCustomer(response);
      });
  }

  CopyCustomer(response){
    if(response["CustObj"] != undefined){
      this.CustMainDataForm.patchValue({
        MrIdTypeCode: response["CustObj"].MrIdTypeCode,
        IdNo: response["CustObj"].IdNo,
        IdExpiredDt: formatDate(response["CustObj"].IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
        TaxIdNo: response["CustObj"].TaxIdNo
      });
      this.InputLookupCustomerObj.jsonSelect = {CustName: response["CustObj"].CustName};
      this.CustMainDataForm.controls["MrIdTypeCode"].disable();
      this.CustMainDataForm.controls["IdNo"].disable();
      this.CustMainDataForm.controls["TaxIdNo"].disable();
    }
    
    if(response["CustPersonalObj"] != undefined){
      this.CustMainDataForm.patchValue({
        MrGenderCode: response["CustPersonalObj"].MrGenderCode,		
        MotherMaidenName: response["CustPersonalObj"].MotherMaidenName,
        BirthPlace: response["CustPersonalObj"].BirthPlace,
        BirthDt: formatDate(response["CustPersonalObj"].BirthDt, 'yyyy-MM-dd', 'en-US'),
      });
      this.CustMainDataForm.controls["BirthPlace"].disable();
      this.CustMainDataForm.controls["BirthDt"].disable();
    }
  }

  ClearExpDt(){

  }
}
