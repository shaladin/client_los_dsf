import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustDataCompanyObj } from 'app/shared/model/CustDataCompanyObj.Model';

@Component({
  selector: 'app-cust-company-main-data',
  templateUrl: './cust-company-main-data.component.html',
  styleUrls: ['./cust-company-main-data.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustCompanyMainDataComponent implements OnInit {

  @Input() appId;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() custDataCompanyObj: CustDataCompanyObj = new CustDataCompanyObj();
  @Input() custType: any;

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  refIndustryObj = {
    IndustryTypeCode: ""
  };
  selectedCustNo: any;
  selectedIndustryTypeCode: any;
  custDataObj: CustDataObj;

  InputLookupCustomerObj: any;
  InputLookupIndustryTypeObj: any;
  IdTypeObj: any;
  CompanyTypeObj: any;
  CustModelObj: any;
  custModelReqObj= {
    MrCustTypeCode: ""
  };


  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {

     }

  ngOnInit() {

    this.parentForm.addControl(this.identifier, this.fb.group({
      CustModelCode: ['', [Validators.required, Validators.maxLength(50)]],
      CompanyBrandName: ['', Validators.maxLength(100)],
      MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      NumOfEmp: [0],
      IsAffiliation: [false],
      EstablishmentDt: [''],
      TaxIdNo: ['', Validators.maxLength(50)],
      IsVip: [false]
    }));

    this.initLookup();
    this.bindAllRefMasterObj();
    this.bindCustData();
    this.bindCustModelObj();
  }

  CopyCustomer(event) {
    this.selectedCustNo = event.CustNo;
    this.InputLookupCustomerObj.isReadonly = true;
  }

  
  GetIndustryType(event){
    this.selectedIndustryTypeCode = event.IndustryTypeCode;
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

  setIndustryTypeName(industryTypeCode){
    this.refIndustryObj.IndustryTypeCode = industryTypeCode;

    this.http.post(AdInsConstant.GetRefIndustryTypeByCode, this.refIndustryObj).subscribe(
      (response) => {
        console.log(response);
        this.InputLookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
        this.InputLookupIndustryTypeObj.jsonSelect = response;     
      },
      (error) => {
        console.log(error);
      }
    );

  }

  bindCustData(){
    if(this.custDataCompanyObj.AppCustObj != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        MrIdTypeCode: this.custDataCompanyObj.AppCustObj.MrIdTypeCode,
        IdNo: this.custDataCompanyObj.AppCustObj.IdNo,
        TaxIdNo: this.custDataCompanyObj.AppCustObj.TaxIdNo,
        IsVip: this.custDataCompanyObj.AppCustObj.IsVip
      });
      this.setCriteriaLookupCustomer(this.custDataCompanyObj.AppCustObj.MrCustTypeCode);
      this.InputLookupCustomerObj.nameSelect = this.custDataCompanyObj.AppCustObj.CustName;
      this.InputLookupCustomerObj.jsonSelect = {CustName: this.custDataCompanyObj.AppCustObj.CustName};
      this.selectedCustNo = this.custDataCompanyObj.AppCustObj.CustNo;
    }
    
    // if(this.custDataCompanyObj.AppCustPersonalObj != undefined){
    //   this.parentForm.controls[this.identifier].patchValue({
    //     CustFullName: this.custDataCompanyObj.AppCustPersonalObj.CustFullName,
    //     MrGenderCode: this.custDataCompanyObj.AppCustPersonalObj.MrGenderCode,		
    //     MotherMaidenName: this.custDataCompanyObj.AppCustPersonalObj.MotherMaidenName,
    //     MrMaritalStatCode: this.custDataCompanyObj.AppCustPersonalObj.MrMaritalStatCode,
    //     BirthPlace: this.custDataCompanyObj.AppCustPersonalObj.BirthPlace,
    //     BirthDt: formatDate(this.custDataCompanyObj.AppCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
    //     MrNationalityCode: this.custDataCompanyObj.AppCustPersonalObj.MrNationalityCode,
    //     MobilePhnNo1: this.custDataCompanyObj.AppCustPersonalObj.MobilePhnNo1,
    //     MrEducationCode: this.custDataCompanyObj.AppCustPersonalObj.MrEducationCode,
    //     MobilePhnNo2: this.custDataCompanyObj.AppCustPersonalObj.MobilePhnNo2,
    //     MrReligionCode: this.custDataCompanyObj.AppCustPersonalObj.MrReligionCode,
    //     MobilePhnNo3: this.custDataCompanyObj.AppCustPersonalObj.MobilePhnNo3,
    //     Email1: this.custDataCompanyObj.AppCustPersonalObj.Email1,
    //     FamilyCardNo: this.custDataCompanyObj.AppCustPersonalObj.FamilyCardNo,
    //     Email2: this.custDataCompanyObj.AppCustPersonalObj.Email2,
    //     NoOfResidence: this.custDataCompanyObj.AppCustPersonalObj.NoOfResidence,
    //     Email3: this.custDataCompanyObj.AppCustPersonalObj.Email3,
    //     NoOfDependents: this.custDataCompanyObj.AppCustPersonalObj.NoOfDependents
    //   });
      
      // this.selectedNationalityCountryCode = this.custDataCompanyObj.AppCustPersonalObj.NationalityCountryCode;
      // this.setCountryName(this.custDataCompanyObj.AppCustPersonalObj.NationalityCountryCode);
    //}
  }

  initLookup(){
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReadonly = false;

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";

  }

  bindAllRefMasterObj(){
    this.bindIdTypeObj();
    this.bindCompanyTypeObj();
  }

  bindIdTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "ID_TYPE";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
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

  bindCompanyTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "COMPANY_TYPE";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CompanyTypeObj = response["ReturnObject"];
        if(this.CompanyTypeObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            MrCompanyTypeCode: this.CompanyTypeObj[0].Key
          });
        }
      }
    );
  }

  bindCustModelObj(){
    this.custModelReqObj.MrCustTypeCode = AdInsConstant.CustTypeCompany;
     this.http.post(AdInsConstant.GetListKeyValueByMrCustTypeCode, this.custModelReqObj).toPromise().then(
      (response) => {
        this.CustModelObj = response["ReturnObject"];
        if(this.CustModelObj.length > 0){
          this.parentForm.controls[this.identifier].patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
        }
      }
    );
  }

}
