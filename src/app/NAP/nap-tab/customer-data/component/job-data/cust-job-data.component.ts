import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppCustPersonalJobDataObj } from 'app/shared/model/AppCustPersonalJobDataObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';

@Component({
  selector: 'app-cust-job-data',
  templateUrl: './cust-job-data.component.html',
  styleUrls: ['./cust-job-data.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustJobDataComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() appCustPersonalJobDataObj: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
  @Input() custModelCode: any;

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



  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {

     }

   ngOnInit() {
    console.log(this.identifier);
    console.log(this.parentForm);

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
      NumOfEmployee: [0],
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

  CustModelChanged(){
    console.log(this.parentForm);
    this.custModelCode = this.parentForm.controls[this.identifier]["controls"].CustModelCode.value;
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
    this.http.post(AdInsConstant.GetRefProfessionByCode, this.professionObj).subscribe(
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
    this.http.post(AdInsConstant.GetRefIndustryTypeByCode, this.industryTypeObj).subscribe(
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

    if(this.appCustPersonalJobDataObj.AppCustAddrJobObj != undefined){
      this.jobDataAddrObj = new AddrObj();
      this.jobDataAddrObj.Addr = this.appCustPersonalJobDataObj.AppCustAddrJobObj.Addr;
      this.jobDataAddrObj.AreaCode1 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.AreaCode1;
      this.jobDataAddrObj.AreaCode2 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.AreaCode2;
      this.jobDataAddrObj.AreaCode3 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.AreaCode3;
      this.jobDataAddrObj.AreaCode4 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.AreaCode4;
      this.jobDataAddrObj.City = this.appCustPersonalJobDataObj.AppCustAddrJobObj.City;
      this.jobDataAddrObj.Fax = this.appCustPersonalJobDataObj.AppCustAddrJobObj.Fax;
      this.jobDataAddrObj.FaxArea = this.appCustPersonalJobDataObj.AppCustAddrJobObj.FaxArea;
      this.jobDataAddrObj.Phn1 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.Phn1;
      this.jobDataAddrObj.Phn2 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.Phn2;
      this.jobDataAddrObj.PhnArea1 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.PhnArea1;
      this.jobDataAddrObj.PhnArea2 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.PhnArea2;
      this.jobDataAddrObj.PhnExt1 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.PhnExt1;
      this.jobDataAddrObj.PhnExt2 = this.appCustPersonalJobDataObj.AppCustAddrJobObj.PhnExt2;
      
      this.inputFieldJobDataObj.inputLookupObj.nameSelect = this.appCustPersonalJobDataObj.AppCustAddrJobObj.Zipcode;
      this.inputFieldJobDataObj.inputLookupObj.jsonSelect = {Zipcode: this.appCustPersonalJobDataObj.AppCustAddrJobObj.Zipcode};  
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
    if(this.appCustPersonalJobDataObj != undefined){
      this.parentForm.controls[this.identifier].patchValue({
        CustModelCode: this.custModelCode,
        ProfessionalNo: this.appCustPersonalJobDataObj.ProfessionalNo,
        EstablishmentDt: this.appCustPersonalJobDataObj.EstablishmentDt != undefined ? formatDate(this.appCustPersonalJobDataObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : '',
        JobTitleName: this.appCustPersonalJobDataObj.MrJobTitleCode,
        IsMfEmp: this.appCustPersonalJobDataObj.IsMfEmp,
        CompanyName: this.appCustPersonalJobDataObj.CompanyName,
        MrJobPositionCode: this.appCustPersonalJobDataObj.MrJobPositionCode,
        MrCompanyScaleCode: this.appCustPersonalJobDataObj.MrCompanyScaleCode,
        NumOfEmployee: this.appCustPersonalJobDataObj.NumOfEmployee,
        MrJobStatCode: this.appCustPersonalJobDataObj.MrJobStatCode,
        MrInvestmentTypeCode: this.appCustPersonalJobDataObj.MrInvestmentTypeCode
      });
    }
    this.selectedProfessionCode = this.appCustPersonalJobDataObj.MrProfessionCode;
    this.setProfessionName(this.appCustPersonalJobDataObj.MrProfessionCode);
    this.selectedIndustryTypeCode = this.appCustPersonalJobDataObj.IndustryTypeCode;
    this.setIndustryTypeName(this.appCustPersonalJobDataObj.IndustryTypeCode);
    this.CustModelChanged();
    this.setAddrJobDataObj();
  }

  bindAllRefMasterObj(){
    this.bindJobPositionObj();
    this.bindCompanyScaleObj();
    this.bindInvestmentTypeObj();
    this.bindJobStatObj();
  }
  

  bindJobPositionObj(){
    this.refMasterObj.RefMasterTypeCode = "JOB_POSITION";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.JobPositionObj = response["ReturnObject"];
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
    this.refMasterObj.RefMasterTypeCode = "COY_SCALE";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CompanyScaleObj = response["ReturnObject"];
        if(this.CompanyScaleObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrCompanyScaleCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrCompanyScaleCode.value == "")){
          this.parentForm.controls[this.identifier].patchValue({
            MrCompanyScaleCode: this.CompanyScaleObj[0].Key
          });
        }
      }
    );
  }

  bindJobStatObj(){
    this.refMasterObj.RefMasterTypeCode = "JOB_STAT";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.JobStatObj = response["ReturnObject"];
        if(this.JobStatObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrJobStatCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrJobStatCode.value == "")){
          this.parentForm.controls[this.identifier].patchValue({
            MrJobStatCode: this.JobStatObj[0].Key
          });
        }
      }
    );
  }

  bindInvestmentTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "INVESTMENT_TYPE";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.InvestmentTypeObj = response["ReturnObject"];
        if(this.InvestmentTypeObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrInvestmentTypeCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrInvestmentTypeCode.value == "")){
          this.parentForm.controls[this.identifier].patchValue({
            MrInvestmentTypeCode: this.InvestmentTypeObj[0].Key
          });
        }
      }
    );
  }

 bindCustModelObj(){
    this.custModelReqObj.MrCustTypeCode = AdInsConstant.CustTypePersonal;
     this.http.post(AdInsConstant.GetListKeyValueByMrCustTypeCode, this.custModelReqObj).toPromise().then(
      (response) => {
        this.CustModelObj = response["ReturnObject"];
        if(this.CustModelObj.length > 0 && this.custModelCode == undefined){
          this.custModelCode = this.CustModelObj[0].Key;
          this.parentForm.controls[this.identifier].patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
        }
      }
    );
  }

}
