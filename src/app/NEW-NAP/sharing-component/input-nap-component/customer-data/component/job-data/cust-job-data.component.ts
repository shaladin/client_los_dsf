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
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ResListKeyValueObj } from 'app/shared/model/Response/Generic/ResListKeyValueObj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';

@Component({
  selector: 'app-cust-job-data',
  templateUrl: './cust-job-data.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustJobDataComponent implements OnInit {
  @Input() isLockMode: boolean = null;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() appCustPersonalJobDataObj: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
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

  jobDataAddrObj: AddrObj;
  inputFieldJobDataObj: InputFieldObj;

  InputLookupProfessionObj: InputLookupObj;
  selectedProfessionCode: string;
  InputLookupIndustryTypeObj: InputLookupObj;
  selectedIndustryTypeCode: string;
  IsInitJobData: boolean = true;
  IsCopy: boolean = false;
  JobPositionObj: Array<KeyValueObj>;
  JobStatObj: Array<KeyValueObj>;
  CompanyScaleObj: Array<KeyValueObj>;
  InvestmentTypeObj: Array<KeyValueObj>;
  CustModelObj: Array<KeyValueObj> = new Array<KeyValueObj>();

  testing: Date = new Date();
  inputAddressObjForJobData: InputAddressObj;
  custModelReqObj: ReqRefMasterByTypeCodeAndMappingCodeObj;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, private cookieService: CookieService) {
  }

  MaxDate: Date;
  UserAccess: CurrentUserContext;

  ngOnInit() {
    this.inputAddressObjForJobData = new InputAddressObj();
    this.inputAddressObjForJobData.showSubsection = false;
    this.inputAddressObjForJobData.showPhn3 = false;

    if(this.isLockMode){
      this.inputAddressObjForJobData.isReadonly = true;
      this.inputAddressObjForJobData.isRequired = false;
      this.inputAddressObjForJobData.inputField.inputLookupObj.isReadonly = true;
      this.inputAddressObjForJobData.inputField.inputLookupObj.isDisable = true;
    }

    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess.BusinessDt;
    this.parentForm.removeControl(this.identifier);

    if(this.isLockMode){
      this.parentForm.addControl(this.identifier, this.fb.group({
        CustModelCode: [''],
        ProfessionalNo: [''],
        EstablishmentDt: [''],
        JobTitleName: [''],
        IsMfEmp: [false],
        CompanyName: [''],
        MrJobPositionCode: [''],
        MrCompanyScaleCode: [''],
        NumOfEmployee: [0],
        MrJobStatCode: [''],
        MrInvestmentTypeCode: ['']
      }));
    }else{
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
    }

    this.inputFieldJobDataObj = new InputFieldObj();
    this.inputFieldJobDataObj.inputLookupObj = new InputLookupObj();

    this.initLookup();
    this.bindCustModelObj();
    this.bindAllRefMasterObj();
    this.bindAppCustPersonalJobData();
  }

  CriteriaAddLookUpProfessionName() {
    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "MR_CUST_MODEL_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.custModelCode];
    arrCopyLookupCrit.push(addCrit);
    this.InputLookupProfessionObj.addCritInput = arrCopyLookupCrit;
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
    this.CriteriaAddLookUpProfessionName();
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "NONPROF") {
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators(null);
      this.parentForm.removeControl("jobDataAddr");
      this.parentForm.removeControl("jobDataAddrZipcode");
      this.parentForm.removeControl("lookupIndustryType");
    }
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "PROF") {
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators(null);
    }
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "EMP") {
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators([Validators.required, Validators.maxLength(100)]);
    }
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "SME") {
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators([Validators.required, Validators.maxLength(100)]);
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

    if(this.isLockMode)
    {
      this.InputLookupProfessionObj.isDisable = true;
    }

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    
    if(this.isLockMode)
    {
      this.InputLookupIndustryTypeObj.isDisable = true;
    }
  }

  bindAppCustPersonalJobData() {
    this.IsInitJobData = true;

    if (this.custModelCode != null && this.custModelCode != undefined && this.custModelCode != "")
      this.CriteriaAddLookUpProfessionName();
    if (this.appCustPersonalJobDataObj.AppCustPersonalId != 0 || this.IsCopy == true) {
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
      this.setAddrJobDataObj();
      this.IsInitJobData = false
      this.IsCopy = false
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
          this.parentForm.controls[this.identifier].patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
          this.CriteriaAddLookUpProfessionName();
        }
      }
    );
  }

}
