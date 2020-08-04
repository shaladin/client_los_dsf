import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { MouCustPersonalJobDataObj } from 'app/shared/model/MouCustPersonalJobDataObj.Model';

@Component({
  selector: 'app-mou-cust-job-data',
  templateUrl: './mou-cust-job-data.component.html',
  styleUrls: ['./mou-cust-job-data.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class MouCustJobDataComponent implements OnInit {
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() MouCustPersonalJobDataObj: MouCustPersonalJobDataObj = new MouCustPersonalJobDataObj();
  @Input() custModelCode: string;

  refMasterObj = {
    RefMasterTypeCode: "",
  };

  professionObj = {
    ProfessionCode: ""
  };

  industryTypeObj = {
    IndustryTypeCode: ""
  };

  custModelReqObj = {
    MrCustTypeCode: ""
  }

  jobDataAddrObj: AddrObj;
  inputFieldJobDataObj: InputFieldObj;

  InputLookupProfessionObj: any;
  selectedProfessionCode: any;
  InputLookupIndustryTypeObj: any;
  selectedIndustryTypeCode: any;

  JobPositionObj: any;
  JobStatObj: any;
  CompanyScaleObj: any;
  InvestmentTypeObj: any;
  CustModelObj: any;

  testing: Date = new Date();

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {

     }

   MaxDate: Date;
   UserAccess: any;
   ngOnInit() {
    console.log(this.testing);
    console.log(this.parentForm);
    // console.log("User Access");
    // console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;

    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.group({
      CustModelCode: ['', [Validators.required, Validators.maxLength(50)]],
      ProfessionalNo: ['', Validators.maxLength(50)],
      EstablishmentDt: [''],
      JobTitleName: ['', Validators.maxLength(50)],
      IsMfEmp: [false],
      CompanyName: ['', [Validators.required, Validators.maxLength(100)]],
      MrJobPositionCode: ['', Validators.maxLength(50)],
      MrCompanyScaleCode: ['', Validators.maxLength(50)],
      NumOfEmployee: [0, Validators.min(0)],
      MrJobStatCode: ['', Validators.maxLength(50)],
      MrInvestmentTypeCode: ['', Validators.maxLength(50)]
    }));

    this.inputFieldJobDataObj = new InputFieldObj();
    this.inputFieldJobDataObj.inputLookupObj = new InputLookupObj();
    
    this.initLookup();
    this.bindCustModelObj();
    this.bindAllRefMasterObj();
    this.bindAppCustPersonalJobData();
  }

  CriteriaAddLookUpProfessionName(){
    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "MR_CUST_MODEL_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.custModelCode];
    arrCopyLookupCrit.push(addCrit);
    this.InputLookupProfessionObj.addCritInput = arrCopyLookupCrit;
  }

  CustModelChanged(){
    console.log(this.parentForm);
    this.custModelCode = this.parentForm.controls[this.identifier]["controls"].CustModelCode.value;
    this.CriteriaAddLookUpProfessionName();
    if(this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "NONPROF"){
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators(null);
      this.parentForm.removeControl("jobDataAddr");
      this.parentForm.removeControl("jobDataAddrZipcode");
      this.parentForm.removeControl("lookupIndustryType");
    }
    if(this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "PROF"){
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators(null);
    }
    if(this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "EMP"){
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators([Validators.required, Validators.maxLength(100)]);
    }
    if(this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "SME"){
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators([Validators.required, Validators.maxLength(100)]);
    }
  }

  GetProfession(event){
    this.selectedProfessionCode = event.ProfessionCode;
  }

  GetIndustryType(event){
    this.selectedIndustryTypeCode = event.IndustryTypeCode;
  }

  setProfessionName(professionCode){
    this.professionObj.ProfessionCode = professionCode;
    this.http.post(URLConstant.GetRefProfessionByCode, this.professionObj).subscribe(
      (response) => {
        console.log(response);
        this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
        this.InputLookupProfessionObj.jsonSelect = response;     
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setIndustryTypeName(industryTypeCode){
    this.industryTypeObj.IndustryTypeCode = industryTypeCode;
    this.http.post(URLConstant.GetRefIndustryTypeByCode, this.industryTypeObj).subscribe(
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

  setAddrJobDataObj(){
    this.inputFieldJobDataObj = new InputFieldObj();
    this.inputFieldJobDataObj.inputLookupObj = new InputLookupObj();

    if(this.MouCustPersonalJobDataObj.MouCustAddrJobObj != undefined){
      this.jobDataAddrObj = new AddrObj();
      this.jobDataAddrObj.Addr = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Addr;
      this.jobDataAddrObj.AreaCode1 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode1;
      this.jobDataAddrObj.AreaCode2 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode2;
      this.jobDataAddrObj.AreaCode3 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode3;
      this.jobDataAddrObj.AreaCode4 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode4;
      this.jobDataAddrObj.City = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.City;
      this.jobDataAddrObj.Fax = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Fax;
      this.jobDataAddrObj.FaxArea = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.FaxArea;
      this.jobDataAddrObj.Phn1 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Phn1;
      this.jobDataAddrObj.Phn2 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Phn2;
      this.jobDataAddrObj.PhnArea1 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnArea1;
      this.jobDataAddrObj.PhnArea2 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnArea2;
      this.jobDataAddrObj.PhnExt1 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnExt1;
      this.jobDataAddrObj.PhnExt2 = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnExt2;
      
      this.inputFieldJobDataObj.inputLookupObj.nameSelect = this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Zipcode;
      this.inputFieldJobDataObj.inputLookupObj.jsonSelect = {Zipcode: this.MouCustPersonalJobDataObj.MouCustAddrJobObj.Zipcode};  
    }
  }

  initLookup(){
    this.InputLookupProfessionObj = new InputLookupObj();
    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupProfessionObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
  }

  bindAppCustPersonalJobData(){
    console.log("bind")
    console.log(this.custModelCode);
    console.log(this.MouCustPersonalJobDataObj);
    if (this.custModelCode != null && this.custModelCode != undefined && this.custModelCode != "")
      this.CriteriaAddLookUpProfessionName();
    if(this.MouCustPersonalJobDataObj.MouCustPersonalId != 0){
      this.parentForm.controls[this.identifier].patchValue({
        CustModelCode: this.custModelCode,
        ProfessionalNo: this.MouCustPersonalJobDataObj.ProfessionalNo,
        EstablishmentDt: this.MouCustPersonalJobDataObj.EstablishmentDt != undefined ? formatDate(this.MouCustPersonalJobDataObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : '',
        JobTitleName: this.MouCustPersonalJobDataObj.MrJobTitleCode,
        IsMfEmp: this.MouCustPersonalJobDataObj.IsMfEmp,
        CompanyName: this.MouCustPersonalJobDataObj.CompanyName,
        MrJobPositionCode: this.MouCustPersonalJobDataObj.MrJobPositionCode,
        MrCompanyScaleCode: this.MouCustPersonalJobDataObj.MrCompanyScaleCode,
        NumOfEmployee: this.MouCustPersonalJobDataObj.NumOfEmployee,
        MrJobStatCode: this.MouCustPersonalJobDataObj.MrJobStatCode,
        MrInvestmentTypeCode: this.MouCustPersonalJobDataObj.MrInvestmentTypeCode
      });
      this.selectedProfessionCode = this.MouCustPersonalJobDataObj.MrProfessionCode;
      this.setProfessionName(this.MouCustPersonalJobDataObj.MrProfessionCode);
      this.selectedIndustryTypeCode = this.MouCustPersonalJobDataObj.IndustryTypeCode;
      this.setIndustryTypeName(this.MouCustPersonalJobDataObj.IndustryTypeCode);
      this.CustModelChanged();
      this.setAddrJobDataObj();
    }
  }

  bindAllRefMasterObj(){
    this.bindJobPositionObj();
    this.bindCompanyScaleObj();
    this.bindInvestmentTypeObj();
    this.bindJobStatObj();
  }
  

  bindJobPositionObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeJobPosition;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        console.log("job position");
        if(this.JobPositionObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrJobPositionCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrJobPositionCode.value == "")){
          this.parentForm.controls[this.identifier].patchValue({
            MrJobPositionCode: this.JobPositionObj[0].Key
          });
        }
      }
    );
  }

  bindCompanyScaleObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCoyScale;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CompanyScaleObj = response[CommonConstant.ReturnObj];
        if(this.CompanyScaleObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrCompanyScaleCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrCompanyScaleCode.value == "")){
          this.parentForm.controls[this.identifier].patchValue({
            MrCompanyScaleCode: this.CompanyScaleObj[0].Key
          });
        }
      }
    );
  }

  bindJobStatObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeJobStat;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.JobStatObj = response[CommonConstant.ReturnObj];
        if(this.JobStatObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrJobStatCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrJobStatCode.value == "")){
          this.parentForm.controls[this.identifier].patchValue({
            MrJobStatCode: this.JobStatObj[0].Key
          });
        }
      }
    );
  }

  bindInvestmentTypeObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInvestmentType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.InvestmentTypeObj = response[CommonConstant.ReturnObj];
        if(this.InvestmentTypeObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrInvestmentTypeCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrInvestmentTypeCode.value == "")){
          this.parentForm.controls[this.identifier].patchValue({
            MrInvestmentTypeCode: this.InvestmentTypeObj[0].Key
          });
        }
      }
    );
  }

 bindCustModelObj(){
    this.custModelReqObj.MrCustTypeCode = CommonConstant.CustTypePersonal;
     this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, this.custModelReqObj).toPromise().then(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        if(this.CustModelObj.length > 0 && this.custModelCode == undefined){
          this.custModelCode = this.CustModelObj[0].Key;
          this.parentForm.controls[this.identifier].patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
          this.CriteriaAddLookUpProfessionName();
        }
      }
    );
  }

}