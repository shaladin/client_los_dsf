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
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { LtkmCustPersonalJobDataObj } from 'app/shared/model/LTKM/LtkmCustPersonalJobDataObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-ltkm-cust-job-data',
  templateUrl: './cust-job-data.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class LtkmCustJobDataComponent implements OnInit {
  @Input() isLockMode: boolean = false;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() ltkmCustPersonalJobDataObj: LtkmCustPersonalJobDataObj = new LtkmCustPersonalJobDataObj();
  @Input() custModelCode: string;

  jobDataAddrObj: AddrObj;
  inputFieldJobDataObj: InputFieldObj;

  InputLookupProfessionObj: InputLookupObj;
  InputLookupIndustryTypeObj: InputLookupObj;
  IsInitJobData: boolean = true;
  IsCopy: boolean = false;
  JobPositionObj: Array<KeyValueObj>;
  JobStatObj: Array<KeyValueObj>;
  CompanyScaleObj: Array<KeyValueObj>;
  InvestmentTypeObj: Array<KeyValueObj>;
  CustModelObj: Array<KeyValueObj>;

  IsLookupIndustryTypeReady: boolean = false;

  testing: Date = new Date();
  inputAddressObjForJobData: InputAddressObj;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private cookieService: CookieService) {
  }

  MaxDate: Date;
  UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  ngOnInit() {
    this.inputAddressObjForJobData = new InputAddressObj();
    this.inputAddressObjForJobData.showSubsection = false;
    this.inputAddressObjForJobData.showPhn3 = false;
    this.inputAddressObjForJobData.showOwnership = true;

    if (this.isLockMode) {
      this.inputAddressObjForJobData.isReadonly = true;
      this.inputAddressObjForJobData.isRequired = false;
      this.inputAddressObjForJobData.inputField.inputLookupObj.isReadonly = true;
      this.inputAddressObjForJobData.inputField.inputLookupObj.isDisable = true;
    }

    this.MaxDate = this.UserAccess.BusinessDt;
    this.parentForm.removeControl(this.identifier);
    if (this.isLockMode) {
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
        MrInvestmentTypeCode: [''],
        IndustryTypeCode: [''],
        RefSectorEconomySlikCode: [''],
        MrProfessionCode: ['']
      }));
    } else {
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
        MrInvestmentTypeCode: ['', Validators.maxLength(50)],
        IndustryTypeCode: [Validators.required],
        RefSectorEconomySlikCode: ['', Validators.required],
        MrProfessionCode: ['']
      }));
    }

    this.inputFieldJobDataObj = new InputFieldObj();
    this.inputFieldJobDataObj.inputLookupObj = new InputLookupObj();

    this.initLookup();
    // this.bindCustModelObj();
    this.bindAllRefMasterObj();
    if (this.ltkmCustPersonalJobDataObj != undefined) {
      this.bindLtkmCustPersonalJobData();
    }
    this.IsLookupIndustryTypeReady = true;
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
      this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
    }
    this.custModelCode = this.parentForm.controls[this.identifier]["controls"].CustModelCode.value;
    this.CriteriaAddLookUpProfessionName();
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == CommonConstant.CustModelNonProfessional) {
      this.InputLookupIndustryTypeObj.isRequired = false;
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators(null);
      this.parentForm.removeControl("jobDataAddr");
      this.parentForm.removeControl("jobDataAddrZipcode");
      this.parentForm.removeControl("lookupIndustryType");
    }
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == CommonConstant.CustModelProfessional) {
      this.InputLookupIndustryTypeObj.isRequired = false;
      this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators(null);
    }
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == CommonConstant.CustModelEmployee) {
      if (!this.isLockMode) {
        this.InputLookupIndustryTypeObj.isRequired = true;
        this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators([Validators.required, Validators.maxLength(100)]);
      }
    }
    if (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == CommonConstant.CustModelSmallMediumEnterprise) {
      if (!this.isLockMode) {
        this.InputLookupIndustryTypeObj.isRequired = true;
        this.parentForm.controls[this.identifier]["controls"].CompanyName.setValidators([Validators.required, Validators.maxLength(100)]);
      }
    }
  }


  GetProfession(event) {
    this.parentForm.controls[this.identifier].patchValue({
      MrProfessionCode: event.ProfessionCode
    });
  }

  GetIndustryType(event) {
    this.parentForm.controls[this.identifier].patchValue({
      IndustryTypeCode: event.IndustryTypeCode,
      RefSectorEconomySlikCode: event.RefSectorEconomySlikCode
    });
  }

  setProfessionName(professionCode: string) {
    this.http.post(URLConstant.GetRefProfessionByCode, { Code: professionCode }).subscribe(
      (response) => {
        this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
        this.InputLookupProfessionObj.jsonSelect = response;
      });
  }

  setIndustryTypeName(industryTypeCode: string) {
    this.http.post(URLConstant.GetRefIndustryTypeByCode, { Code: industryTypeCode }).subscribe(
      (response) => {
        this.InputLookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
        this.InputLookupIndustryTypeObj.jsonSelect = response;
      });
  }

  setAddrJobDataObj() {
    this.inputFieldJobDataObj = new InputFieldObj();
    this.inputFieldJobDataObj.inputLookupObj = new InputLookupObj();

    if (this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj != undefined) {
      this.jobDataAddrObj = new AddrObj();
      this.jobDataAddrObj.Addr = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.Addr;
      this.jobDataAddrObj.AreaCode1 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.AreaCode1;
      this.jobDataAddrObj.AreaCode2 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.AreaCode2;
      this.jobDataAddrObj.AreaCode3 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.AreaCode3;
      this.jobDataAddrObj.AreaCode4 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.AreaCode4;
      this.jobDataAddrObj.City = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.City;
      this.jobDataAddrObj.Fax = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.Fax;
      this.jobDataAddrObj.FaxArea = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.FaxArea;
      this.jobDataAddrObj.Phn1 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.Phn1;
      this.jobDataAddrObj.Phn2 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.Phn2;
      this.jobDataAddrObj.PhnArea1 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.PhnArea1;
      this.jobDataAddrObj.PhnArea2 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.PhnArea2;
      this.jobDataAddrObj.PhnExt1 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.PhnExt1;
      this.jobDataAddrObj.PhnExt2 = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.PhnExt2;

      this.jobDataAddrObj.MrHouseOwnershipCode = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.MrHouseOwnershipCode;

      this.inputFieldJobDataObj.inputLookupObj.nameSelect = this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.Zipcode;
      this.inputFieldJobDataObj.inputLookupObj.jsonSelect = { Zipcode: this.ltkmCustPersonalJobDataObj.LtkmCustAddrJobObj.Zipcode };
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
    if (this.isLockMode) {
      this.InputLookupProfessionObj.isDisable = true;
    }

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupRefSectorEconomySlik.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupRefSectorEconomySlik.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupRefSectorEconomySlik.json";
    if (this.isLockMode) {
      this.InputLookupIndustryTypeObj.isDisable = true;
    }
  }

  bindLtkmCustPersonalJobData() {
    this.IsInitJobData = true;

    if (this.custModelCode != null && this.custModelCode != undefined && this.custModelCode != "")
      this.CriteriaAddLookUpProfessionName();
    if (this.ltkmCustPersonalJobDataObj.LtkmCustPersonalId != 0 || this.IsCopy == true) {
      this.parentForm.controls[this.identifier].patchValue({
        CustModelCode: this.custModelCode,
        ProfessionalNo: this.ltkmCustPersonalJobDataObj.ProfessionalNo,
        EstablishmentDt: this.ltkmCustPersonalJobDataObj.EstablishmentDt != undefined ? formatDate(this.ltkmCustPersonalJobDataObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : '',
        JobTitleName: this.ltkmCustPersonalJobDataObj.MrJobTitleCode,
        IsMfEmp: this.ltkmCustPersonalJobDataObj.IsMfEmp,
        CompanyName: this.ltkmCustPersonalJobDataObj.CompanyName,
        MrJobPositionCode: this.ltkmCustPersonalJobDataObj.MrJobPositionCode,
        MrCompanyScaleCode: this.ltkmCustPersonalJobDataObj.MrCompanyScaleCode,
        NumOfEmployee: this.ltkmCustPersonalJobDataObj.NumOfEmployee,
        MrJobStatCode: this.ltkmCustPersonalJobDataObj.MrJobStatCode,
        MrInvestmentTypeCode: this.ltkmCustPersonalJobDataObj.MrInvestmentTypeCode,
        IndustryTypeCode: this.ltkmCustPersonalJobDataObj.IndustryTypeCode,
        RefSectorEconomySlikCode: this.ltkmCustPersonalJobDataObj.RefSectorEconomySlikCode,
        MrProfessionCode: this.ltkmCustPersonalJobDataObj.MrProfessionCode
      });

      this.setProfessionName(this.ltkmCustPersonalJobDataObj.MrProfessionCode);
      this.CustModelChanged(false);
      this.setAddrJobDataObj();
      this.IsInitJobData = false
      this.IsCopy = false
    }
  }

  bindAllRefMasterObj() {
    this.bindCustModelObj();
    this.bindJobPositionObj();
    this.bindCompanyScaleObj();
    this.bindInvestmentTypeObj();
    this.bindJobStatObj();
  }


  bindJobPositionObj() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition }).subscribe(
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
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCoyScale }).subscribe(
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
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobStat }).subscribe(
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
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInvestmentType }).subscribe(
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
    // this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, { Code: CommonConstant.CustTypePersonal }).toPromise().then(
    //   (response) => {
    //     this.CustModelObj = response[CommonConstant.ReturnObj];
    //     if (this.CustModelObj.length > 0 && this.custModelCode == undefined) {
    //       this.custModelCode = this.CustModelObj[0].Key;
    //       this.parentForm.controls[this.identifier].patchValue({
    //         CustModelCode: this.CustModelObj[0].Key
    //       });
    //       this.CriteriaAddLookUpProfessionName();
    //     }
    //   }
    // );
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel }).subscribe(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        if (this.CustModelObj.length > 0 && (this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == undefined || this.parentForm.controls[this.identifier]["controls"].CustModelCode.value == "")) {
          this.parentForm.controls[this.identifier].patchValue({
            CustModelCode: this.CustModelObj[0].Key
          });
          this.CriteriaAddLookUpProfessionName();
        }
      }
    );
  }
}
