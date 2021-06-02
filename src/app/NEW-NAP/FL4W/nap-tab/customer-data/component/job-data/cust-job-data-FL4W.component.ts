import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResListKeyValueObj } from 'app/shared/model/Response/Generic/ResListKeyValueObj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';

@Component({
  selector: 'app-cust-job-data-FL4W',
  templateUrl: './cust-job-data-FL4W.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustJobDataFL4WComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() appCustPersonalJobDataObj: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
  @Input() custModelCode: string;
  @ViewChild('LookupProfession') ucLookupProfession: UclookupgenericComponent;
  refMasterObj = {
    RefMasterTypeCode: "",
  };

  professionObj = {
    ProfessionCode: ""
  };

  industryTypeObj = {
    IndustryTypeCode: ""
  };

  jobDataAddrObj: AddrObj;
  inputFieldJobDataObj: InputFieldObj;

  InputLookupProfessionObj: InputLookupObj;
  selectedProfessionCode: string;
  InputLookupIndustryTypeObj: InputLookupObj;
  selectedIndustryTypeCode: string;
  JobPositionObj: Array<KeyValueObj>;
  JobStatObj: Array<KeyValueObj>;
  CompanyScaleObj: Array<KeyValueObj>;
  InvestmentTypeObj: Array<KeyValueObj>;
  CustModelObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  businessDt: Date = new Date();
  inputAddressObjForJobData: InputAddressObj;
  custModelReqObj: ReqRefMasterByTypeCodeAndMappingCodeObj;

  IsInitJobData: boolean;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient, private cookieService: CookieService) {

  }

  ngOnInit() {
    this.inputAddressObjForJobData = new InputAddressObj();
    this.inputAddressObjForJobData.showSubsection = false;
    this.inputAddressObjForJobData.showPhn3 = false;

    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);

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
      NumOfEmployee: [0, [Validators.min(0), Validators.pattern("^[0-9]+$")]],
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

  CustModelChanged(IsChanged: boolean) {
    if (IsChanged == true) {
      this.IsInitJobData = false;
    }
    if (this.IsInitJobData == false) {
      this.InputLookupProfessionObj.nameSelect = "";
      this.InputLookupProfessionObj.jsonSelect = "";
      this.selectedProfessionCode = "";
    }

    this.custModelCode = this.parentForm.controls[this.identifier]["controls"].CustModelCode.value;
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == CommonConstant.CustModelNonProfessional) {
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators(null);
      this.parentForm.removeControl("jobDataAddr");
      this.parentForm.removeControl("jobDataAddrZipcode");
      this.parentForm.removeControl("lookupIndustryType");
      this.custModelCode = "NONPROF";
      this.setLookupProfessionCriteria();
    }
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == CommonConstant.CustModelProfessional) {
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators(null);
      this.custModelCode = "PROF";
      this.setLookupProfessionCriteria();
    }
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == CommonConstant.CustModelEmployee) {
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.custModelCode = "EMP";
      this.setLookupProfessionCriteria();
    }
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == CommonConstant.CustModelSmallMediumEnterprise) {
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.custModelCode = "SME";
      this.setLookupProfessionCriteria();
    }

  }

  GetProfession(event) {
    this.selectedProfessionCode = event.ProfessionCode;
  }

  GetIndustryType(event) {
    this.selectedIndustryTypeCode = event.IndustryTypeCode;
  }

  setProfessionName(professionCode) {
    this.professionObj.ProfessionCode = professionCode;
    this.http.post(URLConstant.GetRefProfessionByCode, {Code : professionCode}).subscribe(
      (response) => {
        this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
        this.InputLookupProfessionObj.jsonSelect = response;
      });
  }

  setIndustryTypeName(industryTypeCode) {
    this.industryTypeObj.IndustryTypeCode = industryTypeCode;
    this.http.post(URLConstant.GetRefIndustryTypeByCode, {Code: industryTypeCode}).subscribe(
      (response) => {
        this.InputLookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
        this.InputLookupIndustryTypeObj.jsonSelect = response;
      });
  }

  setAddrJobDataObj() {
    this.inputFieldJobDataObj = new InputFieldObj();
    this.inputFieldJobDataObj.inputLookupObj = new InputLookupObj();

    if (this.appCustPersonalJobDataObj.AppCustAddrJobObj != undefined) {
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
      this.inputFieldJobDataObj.inputLookupObj.jsonSelect = { Zipcode: this.appCustPersonalJobDataObj.AppCustAddrJobObj.Zipcode };
      this.inputAddressObjForJobData.default = this.jobDataAddrObj;
      this.inputAddressObjForJobData.inputField = this.inputFieldJobDataObj;
    }
  }

  initLookup() {
    this.InputLookupProfessionObj = new InputLookupObj();
    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupProfessionObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.setLookupProfessionCriteria();
    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
  }
  setLookupProfessionCriteria() {
    this.InputLookupProfessionObj.addCritInput = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MR_CUST_MODEL_CODE';
    critObj.value = this.custModelCode;
    this.InputLookupProfessionObj.addCritInput.push(critObj);
  }

  bindAppCustPersonalJobData() {
    this.IsInitJobData = true;
    if (this.appCustPersonalJobDataObj != undefined) {
      this.parentForm.controls[this.identifier].patchValue({
        CustModelCode: this.custModelCode,
        ProfessionalNo: this.appCustPersonalJobDataObj.ProfessionalNo,
        EstablishmentDt: this.appCustPersonalJobDataObj.EstablishmentDt != undefined ? formatDate(this.appCustPersonalJobDataObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : '',
        JobTitleName: this.appCustPersonalJobDataObj.JobTitleName,
        IsMfEmp: this.appCustPersonalJobDataObj.IsMfEmp,
        CompanyName: this.appCustPersonalJobDataObj.CompanyName,
        MrJobPositionCode: this.appCustPersonalJobDataObj.MrJobPositionCode,
        MrCompanyScaleCode: this.appCustPersonalJobDataObj.MrCompanyScaleCode,
        NumOfEmployee: this.appCustPersonalJobDataObj.NumOfEmployee,
        MrJobStatCode: this.appCustPersonalJobDataObj.MrJobStatCode,
        MrInvestmentTypeCode: this.appCustPersonalJobDataObj.MrInvestmentTypeCode
      });
      this.selectedProfessionCode = this.appCustPersonalJobDataObj.MrProfessionCode;
      this.setProfessionName(this.appCustPersonalJobDataObj.MrProfessionCode);
      this.selectedIndustryTypeCode = this.appCustPersonalJobDataObj.IndustryTypeCode;
      this.setIndustryTypeName(this.appCustPersonalJobDataObj.IndustryTypeCode);
      this.CustModelChanged(false);
      this.IsInitJobData = false;
      this.setAddrJobDataObj();
    }
  }

  bindAllRefMasterObj() {
    this.bindJobPositionObj();
    this.bindCompanyScaleObj();
    this.bindInvestmentTypeObj();
    this.bindJobStatObj();
  }


  bindJobPositionObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeJobPosition;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        if (this.JobPositionObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrJobPositionCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrJobPositionCode.value == "")) {
          this.parentForm.controls[this.identifier].patchValue({
            MrJobPositionCode: this.JobPositionObj[0].Key
          });
        }
      }
    );
  }

  bindCompanyScaleObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCoyScale;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CompanyScaleObj = response[CommonConstant.ReturnObj];
        if (this.CompanyScaleObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrCompanyScaleCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrCompanyScaleCode.value == "")) {
          this.parentForm.controls[this.identifier].patchValue({
            MrCompanyScaleCode: this.CompanyScaleObj[0].Key
          });
        }
      }
    );
  }

  bindJobStatObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeJobStat;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.JobStatObj = response[CommonConstant.ReturnObj];
        if (this.JobStatObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrJobStatCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrJobStatCode.value == "")) {
          this.parentForm.controls[this.identifier].patchValue({
            MrJobStatCode: this.JobStatObj[0].Key
          });
        }
      }
    );
  }

  bindInvestmentTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInvestmentType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.InvestmentTypeObj = response[CommonConstant.ReturnObj];
        if (this.InvestmentTypeObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].MrInvestmentTypeCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].MrInvestmentTypeCode.value == "")) {
          this.parentForm.controls[this.identifier].patchValue({
            MrInvestmentTypeCode: this.InvestmentTypeObj[0].Key
          });
        }
      }
    );
  }

  bindCustModelObj() {
    this.custModelReqObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    this.custModelReqObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustModel;
    this.custModelReqObj.MappingCode = CommonConstant.CustTypePersonal;
    this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, this.custModelReqObj).subscribe(
      (response : ResListKeyValueObj) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        if (this.CustModelObj.length > 0 && this.custModelCode == undefined) {
          this.custModelCode = this.CustModelObj[0].Key;
          this.setLookupProfessionCriteria();
          this.parentForm.controls[this.identifier].patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
        }
      }
    );
  }

}
