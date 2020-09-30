import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormGroup, ControlContainer } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio/typings/public-api';

@Component({
  selector: 'app-cust-main-data',
  templateUrl: './cust-main-data.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustMainDataComponent implements OnInit {
  @Input() identifier: string;
  @Input() ParentForm: FormGroup;
  AppId: number;
  isExisting: boolean;
  MrCustTypeCode: string;
  MaxDate: Date;
  CustTypeObj: Array<Object>;
  IdTypeObj: Array<Object>;
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
    AppCust: this.fb.group({
      MrCustTypeCode: [],
      CustName: [],
      CompanyType: [],
      CustModelCode: [],
      MrIdTypeCode: [],
      IdNo: [],
      IdExpiredDt: [],
      TaxIdNo: [],
    }),
    AppCustPersonal: this.fb.group({
      MrGenderCode: [],
      BirthPlace: [],
      BirthDt: [],
      MotherMaidenName: []
    })
  });

  ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess["BusinessDt"];
    this.getRefMaster();
  }

  getRefMaster(){
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType}).subscribe(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
        this.CustMainDataForm.controls.AppCust.patchValue({
          MrCustTypeCode: this.CustTypeObj[0]["Key"]
        })
        this.CheckBox();
      }
    );

    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType}).subscribe(
      (response) => {
        this.IdTypeObj = response["RefMasterObjs"];
        if(this.IdTypeObj.length > 0){
          var idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
          this.CustMainDataForm.controls.AppCust.patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
        }
        this.ClearExpDt();
      }
    );
  }

  CheckBox(value: string = 'PERSONAL') {
    this.MrCustTypeCode = value;
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

  
  ClearExpDt(){

  }
}
