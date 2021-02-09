import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/AppCustPersonalJobDataObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { ResponseJobDataPersonalObj } from 'app/shared/model/ResponseJobDataPersonalObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-job-tab',
  templateUrl: './job-tab.component.html',
  styleUrls: ['./job-tab.component.scss']
})
export class JobTabComponent implements OnInit {
  requestedDate: any = "";
  private ucLookupProfession: UclookupgenericComponent;
  @ViewChild('LookupProfession') set content(content: UclookupgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucLookupProfession = content;
    }
  }
  @Input() appId: number;
  @Input() AppCustId: number;
  @Input() CustModelCode: string;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();
  InputLookupIndustryTypeObj: InputLookupObj = new InputLookupObj();
  InputJobAddrObj: InputAddressObj = new InputAddressObj();
  InputFieldJobAddrObj: InputFieldObj = new InputFieldObj();
  JobAddrObj: AddrObj = new AddrObj();
  InputPrevJobAddrObj: InputAddressObj = new InputAddressObj();
  InputFieldPrevJobAddrObj: InputFieldObj = new InputFieldObj();
  PrevJobAddrObj: AddrObj = new AddrObj();
  InputOthBizAddrObj: InputAddressObj = new InputAddressObj();
  InputFieldOthBizObj: InputFieldObj = new InputFieldObj();
  JobDataObj: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
  JobDataAddrObj: AppCustAddrObj = new AppCustAddrObj();
  PrevJobDataAddrObj: AppCustAddrObj = new AppCustAddrObj();
  OthBizDataAddrObj: AppCustAddrObj = new AppCustAddrObj();
  OthBizAddrObj: AddrObj = new AddrObj();
  CustModelObj: Array<KeyValueObj> = new Array();
  CompanyScaleObj: Array<KeyValueObj> = new Array();
  JobPositionObj: Array<KeyValueObj> = new Array();
  JobStatObj: Array<KeyValueObj> = new Array();
  InvestmentTypeObj: Array<KeyValueObj> = new Array();
  ArrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  isUcAddrReady: boolean = false
  MrCustModelDescr: string = "Employee";
  IsIntegratorCheckBySystem: string = "0";
  IsCustomer: boolean = false;
  BusinessDt: Date;
  UserAccess: any;

  JobDataForm = this.fb.group({
    MrProfessionCode: ['', Validators.required],
    IndustryTypeCode: [Validators.required],
    CoyName: ['', Validators.required],
    MrJobPositionCode: [''],
    MrJobStatCode: [''],
    MrCoyScaleCode: [''],
    EmploymentEstablishmentDt: [''],
    NumOfEmployee: [''],
    JobTitleName: [''],
    IsMfEmp: [false],
    MrInvestmentTypeCode: [''],
    ProfessionalNo: [''],
    PrevCoyName: [''],
    PrevEmploymentDt: [''],
    OthBizName: [''],
    OthBizType: [''],
    OthBizIndustryTypeCode: [''],
    OthBizJobPosition: [''],
    OthBizEstablishmentDt: [''],
    JobNotes: [''],
    PrevJobNotes: [''],
    OthBizNotes: [''],
  })
  IsNeedIntegrator: boolean = false;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {

      if (params['AppCustId'] != null) {
        this.AppCustId = params['AppCustId'];
      }
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
    });
  }

  async ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BusinessDt = this.UserAccess.BusinessDt;
    this.GetGeneralSetting();
    await this.InitLookup();
    await this.GetThirdPartyResultHByTrxTypeCodeAndTrxNo();
    this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppCustId, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        this.IsCustomer = response.AppCustObj.IsCustomer;
      }
    );
    this.http.post<RefMasterObj>(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, { MasterCode: this.CustModelCode, RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel }).subscribe(
      (response) => {
        this.MrCustModelDescr = response.Descr;
        this.CheckCustModel();
      }
    );

    if (this.CustModelCode != CommonConstant.CustModelNonProfessional) {
      this.SetDropdown();
    }

    this.InputJobAddrObj.title = "Job Address";
    this.InputPrevJobAddrObj.title = "Previous Job Address";
    this.InputPrevJobAddrObj.isRequired = false;
    this.InputOthBizAddrObj.title = "Other Business Address";
    this.InputOthBizAddrObj.isRequired = false;
    this.InputFieldJobAddrObj.inputLookupObj = new InputLookupObj();
    this.InputFieldPrevJobAddrObj.inputLookupObj = new InputLookupObj();
    this.InputFieldPrevJobAddrObj.inputLookupObj.isRequired = false;
    this.InputPrevJobAddrObj.inputField = this.InputFieldPrevJobAddrObj;
    this.InputFieldOthBizObj.inputLookupObj = new InputLookupObj();
    this.InputFieldOthBizObj.inputLookupObj.isRequired = false;
    this.InputOthBizAddrObj.inputField = this.InputFieldOthBizObj;

    this.GetData();
  }

  async GetGeneralSetting() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingByCode, { GsCode: CommonConstant.GSCodeIntegratorCheckBySystem }).toPromise().then(
      (response) => {
        this.IsIntegratorCheckBySystem = response.GsValue;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetData() {
    this.http.post<ResponseJobDataPersonalObj>(URLConstant.GetAppCustPersonalJobData, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        if (response.AppCustPersonalJobDataObj != null) {
          this.JobDataForm.patchValue({
            MrProfessionCode: response.AppCustPersonalJobDataObj.MrProfessionCode,
            IndustryTypeCode: response.AppCustPersonalJobDataObj.IndustryTypeCode,
            CoyName: response.AppCustPersonalJobDataObj.CoyName,
            MrJobPositionCode: response.AppCustPersonalJobDataObj.MrJobPositionCode,
            MrJobStatCode: response.AppCustPersonalJobDataObj.MrJobStatCode,
            MrCoyScaleCode: response.AppCustPersonalJobDataObj.MrCoyScaleCode,
            EmploymentEstablishmentDt: response.AppCustPersonalJobDataObj.EmploymentEstablishmentDt != null ? formatDate(response.AppCustPersonalJobDataObj.EmploymentEstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",
            NumOfEmployee: response.AppCustPersonalJobDataObj.NumOfEmployee,
            JobTitleName: response.AppCustPersonalJobDataObj.JobTitleName,
            IsMfEmp: response.AppCustPersonalJobDataObj.IsMfEmp,
            MrInvestmentTypeCode: response.AppCustPersonalJobDataObj.MrInvestmentTypeCode,
            ProfessionalNo: response.AppCustPersonalJobDataObj.ProfessionalNo != "" ? response.AppCustPersonalJobDataObj.ProfessionalNo : "",
            PrevCoyName: response.AppCustPersonalJobDataObj.PrevCoyName != "" ? response.AppCustPersonalJobDataObj.PrevCoyName : "",
            PrevEmploymentDt: response.AppCustPersonalJobDataObj.PrevEmploymentDt != null ? response.AppCustPersonalJobDataObj.PrevEmploymentDt : "",
            OthBizName: response.AppCustPersonalJobDataObj.OthBizName != "" ? response.AppCustPersonalJobDataObj.OthBizName : "",
            OthBizType: response.AppCustPersonalJobDataObj.OthBizType != "" ? response.AppCustPersonalJobDataObj.OthBizType : "",
            OthBizIndustryTypeCode: response.AppCustPersonalJobDataObj.OthBizIndustryTypeCode != "" ? response.AppCustPersonalJobDataObj.OthBizIndustryTypeCode : "",
            OthBizJobPosition: response.AppCustPersonalJobDataObj.OthBizJobPosition != "" ? response.AppCustPersonalJobDataObj.OthBizJobPosition : "",
            OthBizEstablishmentDt: response.AppCustPersonalJobDataObj.OthBizEstablishmentDt != null ? response.AppCustPersonalJobDataObj.OthBizEstablishmentDt : ""
          })
          this.JobDataObj.RowVersion = response.AppCustPersonalJobDataObj.RowVersion;
          this.InputLookupProfessionObj.nameSelect = response.AppCustPersonalJobDataObj.MrProfessionName;
          this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response.AppCustPersonalJobDataObj.MrProfessionName };
          this.InputLookupIndustryTypeObj.nameSelect = response.AppCustPersonalJobDataObj.IndustryTypeName;
          this.InputLookupIndustryTypeObj.jsonSelect = { IndustryTypeName: response.AppCustPersonalJobDataObj.IndustryTypeName };
        }


        if (response.JobAddr.AppCustAddrId != 0) {
          this.JobAddrObj = response.JobAddr;
          this.InputJobAddrObj.inputField.inputLookupObj.nameSelect = response.JobAddr.Zipcode;
          this.InputJobAddrObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.JobAddr.Zipcode };
          this.InputJobAddrObj.default = this.JobAddrObj;
          this.JobDataAddrObj.RowVersion = response.JobAddr.RowVersion;
        }

        if (response.PrevJobAddr.AppCustAddrId != 0) {
          this.PrevJobAddrObj = response.PrevJobAddr;
          this.InputPrevJobAddrObj.inputField.inputLookupObj.nameSelect = response.PrevJobAddr.Zipcode;
          this.InputPrevJobAddrObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.PrevJobAddr.Zipcode };
          this.InputPrevJobAddrObj.default = this.PrevJobAddrObj;
          this.PrevJobDataAddrObj.RowVersion = response.PrevJobAddr.RowVersion;
        }

        if (response.OthBizAddr.AppCustAddrId != 0) {
          this.OthBizAddrObj = response.OthBizAddr;
          this.InputOthBizAddrObj.inputField.inputLookupObj.nameSelect = response.OthBizAddr.Zipcode;
          this.InputOthBizAddrObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.OthBizAddr.Zipcode };
          this.InputOthBizAddrObj.default = this.OthBizAddrObj;
          this.OthBizDataAddrObj.RowVersion = response.OthBizAddr.RowVersion;
        }
        this.isUcAddrReady = true;
      },
      error => {
        console.log(error);
      });
  }

  CheckCustModel() {
    if (this.CustModelCode == CommonConstant.CustModelEmployee) {
      this.JobDataForm.controls.MrJobPositionCode.setValidators([Validators.required]);
      this.JobDataForm.controls.MrJobStatCode.setValidators([Validators.required]);
      this.JobDataForm.controls.EmploymentEstablishmentDt.setValidators([Validators.required]);
    } else if (this.CustModelCode == CommonConstant.CustModelProfessional) {
      this.JobDataForm.controls.EmploymentEstablishmentDt.setValidators([Validators.required]);
    }
    this.JobDataForm.controls.MrJobPositionCode.updateValueAndValidity();
    this.JobDataForm.controls.MrJobStatCode.updateValueAndValidity();
    this.JobDataForm.controls.EmploymentEstablishmentDt.updateValueAndValidity();
  }

  SaveForm() {
    if (this.IsIntegratorCheckBySystem == "0") {
      if (this.IsCustomer) {
        if (!this.IsNeedIntegrator) {
          if (confirm("Do you want to submit this data without Integrator ?")) {
            this.SubmitData();
          }
        }
        else {
          this.SubmitData();
        }
      }
      else {
        this.SubmitData();
      }
    }
    else if (this.IsIntegratorCheckBySystem == "1") {
      this.SubmitData();
    }
  }

  SubmitData() {
    this.JobDataObj.MrProfessionCode = this.JobDataForm.controls.MrProfessionCode.value;
    this.JobDataObj.IndustryTypeCode = this.JobDataForm.controls.IndustryTypeCode.value;
    this.JobDataObj.CoyName = this.JobDataForm.controls.CoyName.value;
    this.JobDataObj.MrJobPositionCode = this.JobDataForm.controls.MrJobPositionCode.value;
    this.JobDataObj.MrJobStatCode = this.JobDataForm.controls.MrJobStatCode.value;
    this.JobDataObj.MrCoyScaleCode = this.JobDataForm.controls.MrCoyScaleCode.value;
    this.JobDataObj.EmploymentEstablishmentDt = this.JobDataForm.controls.EmploymentEstablishmentDt.value;
    this.JobDataObj.NumOfEmployee = this.JobDataForm.controls.NumOfEmployee.value;
    this.JobDataObj.JobTitleName = this.JobDataForm.controls.JobTitleName.value;
    this.JobDataObj.IsMfEmp = this.JobDataForm.controls.IsMfEmp.value;
    this.JobDataObj.MrInvestmentTypeCode = this.JobDataForm.controls.MrInvestmentTypeCode.value;
    this.JobDataObj.ProfessionalNo = this.JobDataForm.controls.ProfessionalNo.value;
    this.JobDataObj.PrevCoyName = this.JobDataForm.controls.PrevCoyName.value;
    this.JobDataObj.PrevEmploymentDt = this.JobDataForm.controls.PrevEmploymentDt.value;
    this.JobDataObj.OthBizName = this.JobDataForm.controls.OthBizName.value;
    this.JobDataObj.OthBizType = this.JobDataForm.controls.OthBizType.value;
    this.JobDataObj.OthBizIndustryTypeCode = this.JobDataForm.controls.OthBizIndustryTypeCode.value;
    this.JobDataObj.OthBizJobPosition = this.JobDataForm.controls.OthBizJobPosition.value;
    this.JobDataObj.OthBizEstablishmentDt = this.JobDataForm.controls.OthBizEstablishmentDt.value

    if (this.CustModelCode != CommonConstant.CustModelNonProfessional) {
      this.JobDataAddrObj.Addr = this.JobDataForm.controls["JobAddr"]["controls"]["Addr"].value;
      this.JobDataAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypeJob;
      this.JobDataAddrObj.AreaCode4 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode4"].value;
      this.JobDataAddrObj.AreaCode3 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode3"].value;
      this.JobDataAddrObj.PhnArea1 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnArea1"].value;
      this.JobDataAddrObj.Phn1 = this.JobDataForm.controls["JobAddr"]["controls"]["Phn1"].value;
      this.JobDataAddrObj.PhnExt1 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnExt1"].value;
      this.JobDataAddrObj.PhnArea2 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnArea2"].value;
      this.JobDataAddrObj.Phn2 = this.JobDataForm.controls["JobAddr"]["controls"]["Phn2"].value;
      this.JobDataAddrObj.PhnExt2 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnExt2"].value;
      this.JobDataAddrObj.PhnArea3 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnArea3"].value;
      this.JobDataAddrObj.Phn3 = this.JobDataForm.controls["JobAddr"]["controls"]["Phn3"].value;
      this.JobDataAddrObj.PhnExt3 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnExt3"].value;
      this.JobDataAddrObj.FaxArea = this.JobDataForm.controls["JobAddr"]["controls"]["FaxArea"].value;
      this.JobDataAddrObj.Fax = this.JobDataForm.controls["JobAddr"]["controls"]["Fax"].value;
      this.JobDataAddrObj.SubZipcode = this.JobDataForm.controls["JobAddr"]["controls"]["SubZipcode"].value;
      this.JobDataAddrObj.AreaCode2 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode2"].value;
      this.JobDataAddrObj.AreaCode1 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode1"].value;
      this.JobDataAddrObj.City = this.JobDataForm.controls["JobAddr"]["controls"]["City"].value;
      this.JobDataAddrObj.Zipcode = this.JobDataForm.controls["JobAddrZipcode"]["value"].value;
      this.JobDataAddrObj.RowVersion = this.JobAddrObj.RowVersion;

      this.OthBizDataAddrObj.Addr = this.JobDataForm.controls["OthBizAddr"]["controls"]["Addr"].value;
      this.OthBizDataAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypeOthBiz;
      this.OthBizDataAddrObj.AreaCode4 = this.JobDataForm.controls["OthBizAddr"]["controls"]["AreaCode4"].value;
      this.OthBizDataAddrObj.AreaCode3 = this.JobDataForm.controls["OthBizAddr"]["controls"]["AreaCode3"].value;
      this.OthBizDataAddrObj.PhnArea1 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnArea1"].value;
      this.OthBizDataAddrObj.Phn1 = this.JobDataForm.controls["OthBizAddr"]["controls"]["Phn1"].value;
      this.OthBizDataAddrObj.PhnExt1 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnExt1"].value;
      this.OthBizDataAddrObj.PhnArea2 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnArea2"].value;
      this.OthBizDataAddrObj.Phn2 = this.JobDataForm.controls["OthBizAddr"]["controls"]["Phn2"].value;
      this.OthBizDataAddrObj.PhnExt2 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnExt2"].value;
      this.OthBizDataAddrObj.PhnArea3 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnArea3"].value;
      this.OthBizDataAddrObj.Phn3 = this.JobDataForm.controls["OthBizAddr"]["controls"]["Phn3"].value;
      this.OthBizDataAddrObj.PhnExt3 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnExt3"].value;
      this.OthBizDataAddrObj.FaxArea = this.JobDataForm.controls["OthBizAddr"]["controls"]["FaxArea"].value;
      this.OthBizDataAddrObj.Fax = this.JobDataForm.controls["OthBizAddr"]["controls"]["Fax"].value;
      this.OthBizDataAddrObj.SubZipcode = this.JobDataForm.controls["OthBizAddr"]["controls"]["SubZipcode"].value;
      this.OthBizDataAddrObj.AreaCode2 = this.JobDataForm.controls["OthBizAddr"]["controls"]["AreaCode2"].value;
      this.OthBizDataAddrObj.AreaCode1 = this.JobDataForm.controls["OthBizAddr"]["controls"]["AreaCode1"].value;
      this.OthBizDataAddrObj.City = this.JobDataForm.controls["OthBizAddr"]["controls"]["City"].value;
      this.OthBizDataAddrObj.Zipcode = this.JobDataForm.controls["OthBizAddrZipcode"]["value"].value;
      this.OthBizDataAddrObj.RowVersion = this.OthBizAddrObj.RowVersion;

      this.PrevJobDataAddrObj.Addr = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Addr"].value;
      this.PrevJobDataAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypePrevJob;
      this.PrevJobDataAddrObj.AreaCode4 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode4"].value;
      this.PrevJobDataAddrObj.AreaCode3 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode3"].value;
      this.PrevJobDataAddrObj.PhnArea1 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnArea1"].value;
      this.PrevJobDataAddrObj.Phn1 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Phn1"].value;
      this.PrevJobDataAddrObj.PhnExt1 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnExt1"].value;
      this.PrevJobDataAddrObj.PhnArea2 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnArea2"].value;
      this.PrevJobDataAddrObj.Phn2 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Phn2"].value;
      this.PrevJobDataAddrObj.PhnExt2 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnExt2"].value;
      this.PrevJobDataAddrObj.PhnArea3 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnArea3"].value;
      this.PrevJobDataAddrObj.Phn3 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Phn3"].value;
      this.PrevJobDataAddrObj.PhnExt3 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnExt3"].value;
      this.PrevJobDataAddrObj.FaxArea = this.JobDataForm.controls["PrevJobAddr"]["controls"]["FaxArea"].value;
      this.PrevJobDataAddrObj.Fax = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Fax"].value;
      this.PrevJobDataAddrObj.SubZipcode = this.JobDataForm.controls["PrevJobAddr"]["controls"]["SubZipcode"].value;
      this.PrevJobDataAddrObj.AreaCode2 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode2"].value;
      this.PrevJobDataAddrObj.AreaCode1 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode1"].value;
      this.PrevJobDataAddrObj.City = this.JobDataForm.controls["PrevJobAddr"]["controls"]["City"].value;
      this.PrevJobDataAddrObj.Zipcode = this.JobDataForm.controls["PrevJobAddrZipcode"]["value"].value;
      this.PrevJobDataAddrObj.RowVersion = this.PrevJobAddrObj.RowVersion;
    }

    let requestObj = {
      AppId: this.appId,
      AppCustId: this.AppCustId,
      MrCustModelCode: this.CustModelCode,
      JobDataObj: this.JobDataObj,
      JobDataAddrObj: this.JobDataAddrObj,
      PrevJobAddrObj: this.PrevJobDataAddrObj,
      OthBizAddrObj: this.OthBizDataAddrObj
    }

    this.http.post(URLConstant.AddEditAppCustPersonalJobData, requestObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.OutputTab.emit({ IsComplete: true });
      },
      error => {
        console.log(error);
      });
  }

  SetCriteriaAndRequired(CustModelCode: string, isChange: boolean = false) {
    this.InputLookupProfessionObj.nameSelect = "";
    this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
    this.InputLookupIndustryTypeObj.nameSelect = "";
    this.InputLookupIndustryTypeObj.jsonSelect = { IndustryTypeName: "" };

    this.ArrAddCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = "text";
    critObj.propName = 'MR_CUST_MODEL_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = CustModelCode;
    this.ArrAddCrit.push(critObj);
    this.InputLookupProfessionObj.addCritInput = this.ArrAddCrit;
    if (isChange) this.ucLookupProfession.setAddCritInput();
    this.InputLookupProfessionObj.isReady = true;

    if (CustModelCode == CommonConstant.CustModelNonProfessional || CustModelCode == CommonConstant.CustModelProfessional) {
      this.InputLookupIndustryTypeObj.isRequired = false;
      this.JobDataForm.controls.CoyName.clearValidators();
    } else {
      this.InputLookupIndustryTypeObj.isRequired = true;
      this.JobDataForm.controls.CoyName.setValidators(Validators.required);
    }

    this.JobDataForm.updateValueAndValidity();
  }

  SetDropdown() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCoyScale }).subscribe(
      (response) => {
        this.CompanyScaleObj = response[CommonConstant.ReturnObj];
        this.JobDataForm.patchValue({
          MrCoyScaleCode: this.CompanyScaleObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition }).subscribe(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        this.JobDataForm.patchValue({
          MrJobPositionCode: this.JobPositionObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobStat }).subscribe(
      (response) => {
        this.JobStatObj = response[CommonConstant.ReturnObj];
        this.JobDataForm.patchValue({
          MrJobStatCode: this.JobStatObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInvestmentType }).subscribe(
      (response) => {
        this.InvestmentTypeObj = response[CommonConstant.ReturnObj];
        this.JobDataForm.patchValue({
          MrInvestmentTypeCode: this.InvestmentTypeObj[0].Key
        });
      }
    );
  }

  InitLookup() {
    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupProfessionObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.addCritInput = new Array();

    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.SetCriteriaAndRequired(this.CustModelCode);
    this.InputLookupIndustryTypeObj.isReady = true;
  }

  GetProfession(event) {
    console.log(event);
    this.JobDataForm.patchValue({
      MrProfessionCode: event.ProfessionCode
    });
  }

  GetIndustryType(event) {
    this.JobDataForm.patchValue({
      IndustryTypeCode: event.IndustryTypeCode
    });
  }
  GetThirdPartyResultHByTrxTypeCodeAndTrxNo() {
    this.http.post(URLConstant.GetAppById, { AppId: this.appId }).subscribe(
      (response) => {
        this.http.post(URLConstant.GetThirdPartyResultHByTrxTypeCodeAndTrxNo, { TrxTypeCode: CommonConstant.APP_TRX_TYPE_CODE, TrxNo: response["AppNo"] }).subscribe(
          (response) => {
            if (response["ThirdPartyRsltHId"] != 0 && response["ThirdPartyRsltHId"] != null) {
              this.requestedDate = response["ReqDt"];
            }
          },
          (error) => {
            console.log(error);
          }
        );

      },
      (error) => {
        console.log(error);
      }
    );
  }

  FlaggingIsNeedIntegrator() {
    this.JobDataObj.MrProfessionCode = this.JobDataForm.controls.MrProfessionCode.value;
    this.JobDataObj.IndustryTypeCode = this.JobDataForm.controls.IndustryTypeCode.value;
    this.JobDataObj.CoyName = this.JobDataForm.controls.CoyName.value;
    this.JobDataObj.MrJobPositionCode = this.JobDataForm.controls.MrJobPositionCode.value;
    this.JobDataObj.MrJobStatCode = this.JobDataForm.controls.MrJobStatCode.value;
    this.JobDataObj.MrCoyScaleCode = this.JobDataForm.controls.MrCoyScaleCode.value;
    this.JobDataObj.EmploymentEstablishmentDt = this.JobDataForm.controls.EmploymentEstablishmentDt.value;
    this.JobDataObj.NumOfEmployee = this.JobDataForm.controls.NumOfEmployee.value;
    this.JobDataObj.JobTitleName = this.JobDataForm.controls.JobTitleName.value;
    this.JobDataObj.IsMfEmp = this.JobDataForm.controls.IsMfEmp.value;
    this.JobDataObj.MrInvestmentTypeCode = this.JobDataForm.controls.MrInvestmentTypeCode.value;
    this.JobDataObj.ProfessionalNo = this.JobDataForm.controls.ProfessionalNo.value;
    this.JobDataObj.PrevCoyName = this.JobDataForm.controls.PrevCoyName.value;
    this.JobDataObj.PrevEmploymentDt = this.JobDataForm.controls.PrevEmploymentDt.value;
    this.JobDataObj.OthBizName = this.JobDataForm.controls.OthBizName.value;
    this.JobDataObj.OthBizType = this.JobDataForm.controls.OthBizType.value;
    this.JobDataObj.OthBizIndustryTypeCode = this.JobDataForm.controls.OthBizIndustryTypeCode.value;
    this.JobDataObj.OthBizJobPosition = this.JobDataForm.controls.OthBizJobPosition.value;
    this.JobDataObj.OthBizEstablishmentDt = this.JobDataForm.controls.OthBizEstablishmentDt.value

    if (this.CustModelCode != CommonConstant.CustModelNonProfessional) {
      this.JobDataAddrObj.Addr = this.JobDataForm.controls["JobAddr"]["controls"]["Addr"].value;
      this.JobDataAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypeJob;
      this.JobDataAddrObj.AreaCode4 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode4"].value;
      this.JobDataAddrObj.AreaCode3 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode3"].value;
      this.JobDataAddrObj.PhnArea1 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnArea1"].value;
      this.JobDataAddrObj.Phn1 = this.JobDataForm.controls["JobAddr"]["controls"]["Phn1"].value;
      this.JobDataAddrObj.PhnExt1 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnExt1"].value;
      this.JobDataAddrObj.PhnArea2 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnArea2"].value;
      this.JobDataAddrObj.Phn2 = this.JobDataForm.controls["JobAddr"]["controls"]["Phn2"].value;
      this.JobDataAddrObj.PhnExt2 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnExt2"].value;
      this.JobDataAddrObj.PhnArea3 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnArea3"].value;
      this.JobDataAddrObj.Phn3 = this.JobDataForm.controls["JobAddr"]["controls"]["Phn3"].value;
      this.JobDataAddrObj.PhnExt3 = this.JobDataForm.controls["JobAddr"]["controls"]["PhnExt3"].value;
      this.JobDataAddrObj.FaxArea = this.JobDataForm.controls["JobAddr"]["controls"]["FaxArea"].value;
      this.JobDataAddrObj.Fax = this.JobDataForm.controls["JobAddr"]["controls"]["Fax"].value;
      this.JobDataAddrObj.SubZipcode = this.JobDataForm.controls["JobAddr"]["controls"]["SubZipcode"].value;
      this.JobDataAddrObj.AreaCode2 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode2"].value;
      this.JobDataAddrObj.AreaCode1 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode1"].value;
      this.JobDataAddrObj.City = this.JobDataForm.controls["JobAddr"]["controls"]["City"].value;
      this.JobDataAddrObj.Zipcode = this.JobDataForm.controls["JobAddrZipcode"]["value"].value;
      this.JobDataAddrObj.RowVersion = this.JobAddrObj.RowVersion;

      this.OthBizDataAddrObj.Addr = this.JobDataForm.controls["OthBizAddr"]["controls"]["Addr"].value;
      this.OthBizDataAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypeOthBiz;
      this.OthBizDataAddrObj.AreaCode4 = this.JobDataForm.controls["OthBizAddr"]["controls"]["AreaCode4"].value;
      this.OthBizDataAddrObj.AreaCode3 = this.JobDataForm.controls["OthBizAddr"]["controls"]["AreaCode3"].value;
      this.OthBizDataAddrObj.PhnArea1 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnArea1"].value;
      this.OthBizDataAddrObj.Phn1 = this.JobDataForm.controls["OthBizAddr"]["controls"]["Phn1"].value;
      this.OthBizDataAddrObj.PhnExt1 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnExt1"].value;
      this.OthBizDataAddrObj.PhnArea2 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnArea2"].value;
      this.OthBizDataAddrObj.Phn2 = this.JobDataForm.controls["OthBizAddr"]["controls"]["Phn2"].value;
      this.OthBizDataAddrObj.PhnExt2 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnExt2"].value;
      this.OthBizDataAddrObj.PhnArea3 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnArea3"].value;
      this.OthBizDataAddrObj.Phn3 = this.JobDataForm.controls["OthBizAddr"]["controls"]["Phn3"].value;
      this.OthBizDataAddrObj.PhnExt3 = this.JobDataForm.controls["OthBizAddr"]["controls"]["PhnExt3"].value;
      this.OthBizDataAddrObj.FaxArea = this.JobDataForm.controls["OthBizAddr"]["controls"]["FaxArea"].value;
      this.OthBizDataAddrObj.Fax = this.JobDataForm.controls["OthBizAddr"]["controls"]["Fax"].value;
      this.OthBizDataAddrObj.SubZipcode = this.JobDataForm.controls["OthBizAddr"]["controls"]["SubZipcode"].value;
      this.OthBizDataAddrObj.AreaCode2 = this.JobDataForm.controls["OthBizAddr"]["controls"]["AreaCode2"].value;
      this.OthBizDataAddrObj.AreaCode1 = this.JobDataForm.controls["OthBizAddr"]["controls"]["AreaCode1"].value;
      this.OthBizDataAddrObj.City = this.JobDataForm.controls["OthBizAddr"]["controls"]["City"].value;
      this.OthBizDataAddrObj.Zipcode = this.JobDataForm.controls["OthBizAddrZipcode"]["value"].value;
      this.OthBizDataAddrObj.RowVersion = this.OthBizAddrObj.RowVersion;

      this.PrevJobDataAddrObj.Addr = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Addr"].value;
      this.PrevJobDataAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypePrevJob;
      this.PrevJobDataAddrObj.AreaCode4 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode4"].value;
      this.PrevJobDataAddrObj.AreaCode3 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode3"].value;
      this.PrevJobDataAddrObj.PhnArea1 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnArea1"].value;
      this.PrevJobDataAddrObj.Phn1 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Phn1"].value;
      this.PrevJobDataAddrObj.PhnExt1 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnExt1"].value;
      this.PrevJobDataAddrObj.PhnArea2 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnArea2"].value;
      this.PrevJobDataAddrObj.Phn2 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Phn2"].value;
      this.PrevJobDataAddrObj.PhnExt2 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnExt2"].value;
      this.PrevJobDataAddrObj.PhnArea3 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnArea3"].value;
      this.PrevJobDataAddrObj.Phn3 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Phn3"].value;
      this.PrevJobDataAddrObj.PhnExt3 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["PhnExt3"].value;
      this.PrevJobDataAddrObj.FaxArea = this.JobDataForm.controls["PrevJobAddr"]["controls"]["FaxArea"].value;
      this.PrevJobDataAddrObj.Fax = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Fax"].value;
      this.PrevJobDataAddrObj.SubZipcode = this.JobDataForm.controls["PrevJobAddr"]["controls"]["SubZipcode"].value;
      this.PrevJobDataAddrObj.AreaCode2 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode2"].value;
      this.PrevJobDataAddrObj.AreaCode1 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode1"].value;
      this.PrevJobDataAddrObj.City = this.JobDataForm.controls["PrevJobAddr"]["controls"]["City"].value;
      this.PrevJobDataAddrObj.Zipcode = this.JobDataForm.controls["PrevJobAddrZipcode"]["value"].value;
      this.PrevJobDataAddrObj.RowVersion = this.PrevJobAddrObj.RowVersion;
    }
    let requestObj = {
      AppId: this.appId,
      AppCustId: this.AppCustId,
      MrCustModelCode: this.CustModelCode,
      JobDataObj: this.JobDataObj,
      JobDataAddrObj: this.JobDataAddrObj,
      PrevJobAddrObj: this.PrevJobDataAddrObj,
      OthBizAddrObj: this.OthBizDataAddrObj
    }
    this.hitAPIIntegrator(requestObj);

  }

  hitAPIIntegrator(requestObj: any) {
    this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudChecking, requestObj).subscribe(
      (response) => {
        console.log(response);
        this.GetThirdPartyResultHByTrxTypeCodeAndTrxNo()
        this.IsNeedIntegrator = true;
        this.toastr.successMessage("Success with Integrator Checking.");

      },
      (error) => {
        console.log(error);
      }
    );
  }
}
