import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/app-cust-personal-job-data-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/response-app-cust-main-data-obj.model';
import { ResponseJobDataPersonalObj } from 'app/shared/model/response-job-data-personal-obj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { String } from 'typescript-string-operations';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ResGeneralSettingObj, ResListGeneralSettingObj } from 'app/shared/model/response/general-setting/res-general-setting-obj.model';
import { ReqGetThirdPartyResultHByTrxTypeCodeAndTrxNoObj } from 'app/shared/model/request/nap/third-party/req-get-third-party-result-h-by-trx-type-code-and-trx-no-obj.model';
import { ResThirdPartyRsltHObj } from 'app/shared/model/response/third-party-result/res-third-party-rslt-h-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';

@Component({
  selector: 'app-job-tab',
  templateUrl: './job-tab.component.html',
  styleUrls: ['./job-tab.component.scss']
})
export class JobTabComponent implements OnInit {
  requestedDate: Date;
  private ucLookupProfession: UclookupgenericComponent;
  mouCustId: number = 0;
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
  InputLookupCompanyObj: InputLookupObj = new InputLookupObj();
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
  ArrAddCritCoy: Array<CriteriaObj> = new Array<CriteriaObj>();
  isUcAddrReady: boolean = false
  MrCustModelDescr: string = "Employee";
  IsIntegratorCheckBySystem: string = "0";
  IsUseDigitalization: string;
  IsSvcExist: boolean = false;
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  IsCustomer: boolean = false;
  IsWellknownCoy: boolean = false;
  BusinessDt: Date;
  MaxDate: Date;
  MaxDtValidate: string;
  UserAccess: CurrentUserContext;
  bizTemplateCode: string = "";
  RowVersion: string[];
  JobDataForm = this.fb.group({
    MrProfessionCode: ['', Validators.required],
    IndustryTypeCode: [Validators.required],
    CoyName: ['', [Validators.required, Validators.minLength(2)]],
    MrJobPositionCode: [''],
    MrJobStatCode: [''],
    MrCoyScaleCode: [''],
    EmploymentEstablishmentDt: [''],
    NumOfEmployee: [''],
    JobTitleName: [''],
    IsMfEmp: [false],
    IsWellknownCoy: [false],
    MrWellknownCoyCode: [''],
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
  IsWellKnownBeforeChanged: boolean = true;
  IsReady: boolean = false;
  listAddrRequiredOwnership: Array<string> = new Array();

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private cookieService: CookieService) {
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
    var datePipe = new DatePipe("en-US");
    this.MaxDate = new Date(this.UserAccess.BusinessDt);
    this.MaxDate.setDate(this.MaxDate.getDate() - 1);
    this.MaxDtValidate = datePipe.transform(this.MaxDate, "yyyy-MM-dd");

    await this.GetGeneralSetting();
    await this.InitLookup();

    await this.GetCustMainData();
    this.http.post<KeyValueObj>(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, { MasterCode: this.CustModelCode, RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel }).toPromise().then(
      (response) => {
        this.MrCustModelDescr = response.Value;
        this.CheckCustModel();
      }
    );

    if (this.CustModelCode != CommonConstant.CustModelNonProfessional) {
      await this.SetDropdown();
    }

    this.InputJobAddrObj.title = "Job Address";
    this.InputJobAddrObj.showOwnership = true;
    this.InputJobAddrObj.requiredOwnership = this.setOwnership(CommonConstant.AddrTypeJob);
    
    this.InputPrevJobAddrObj.title = "Previous Job Address";
    this.InputPrevJobAddrObj.isRequired = false;
    this.InputPrevJobAddrObj.showOwnership = true;
    this.InputPrevJobAddrObj.requiredOwnership = this.setOwnership(CommonConstant.AddrTypePrevJob);

    this.InputOthBizAddrObj.title = "Other Business Address";
    this.InputOthBizAddrObj.isRequired = false;
    this.InputOthBizAddrObj.showOwnership = true;
    this.InputOthBizAddrObj.requiredOwnership = this.setOwnership(CommonConstant.AddrTypeOthBiz);

    this.InputFieldJobAddrObj.inputLookupObj = new InputLookupObj();
    this.InputFieldPrevJobAddrObj.inputLookupObj = new InputLookupObj();
    this.InputFieldPrevJobAddrObj.inputLookupObj.isRequired = false;
    this.InputPrevJobAddrObj.inputField = this.InputFieldPrevJobAddrObj;
    this.InputFieldOthBizObj.inputLookupObj = new InputLookupObj();
    this.InputFieldOthBizObj.inputLookupObj.isRequired = false;
    this.InputOthBizAddrObj.inputField = this.InputFieldOthBizObj;

    await this.GetData();
  }

  setOwnership(MrCustAddrTypeCode: string) : boolean {
    if(this.listAddrRequiredOwnership.find(addrType => addrType == MrCustAddrTypeCode)){
        return true;
    }
    return false;
  }

  async GetCustMainData() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.AppCustId;
    await this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppCustId, reqObj).toPromise().then(
      (response) => {
        this.IsCustomer = response.AppCustObj.IsCustomer;
      }
    );
  }

  async GetGeneralSetting() {
    var generalSettingObj = new GenericListByCodeObj();
    generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization);
    generalSettingObj.Codes.push(CommonConstant.GSCodeOwnershipMandatoryAddrType);

    await this.http.post<ResListGeneralSettingObj>(URLConstant.GetListGeneralSettingByListGsCode, generalSettingObj).toPromise().then(
      (response) => {
        var returnGeneralSettingObj: Array<ResGeneralSettingObj> = new Array<ResGeneralSettingObj>();
        returnGeneralSettingObj = response['ResGetListGeneralSettingObj'];

        var gsNeedCheckBySystem = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        var gsUseDigitalization = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);
        let gsListOwnershipMandatoryType = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeOwnershipMandatoryAddrType);
        this.listAddrRequiredOwnership = gsListOwnershipMandatoryType.GsValue.split(',');

        if (gsNeedCheckBySystem != undefined) {
          this.IsIntegratorCheckBySystem = gsNeedCheckBySystem.GsValue;
        }
        else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if (gsUseDigitalization != undefined) {
          this.IsUseDigitalization = gsUseDigitalization.GsValue;
        }
        else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }

        this.GetThirdPartyResultHByTrxTypeCodeAndTrxNo();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isDataEdit: boolean = false;
  async GetData() {
    var datePipe = new DatePipe("en-US");
    await this.http.post<ResponseJobDataPersonalObj>(URLConstant.GetAppCustPersonalJobData, { Id: this.AppCustId }).toPromise().then(
      (response) => {
        if (response.AppCustPersonalJobDataObj != null) {
          this.isDataEdit = true;
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
            IsWellknownCoy: response.AppCustPersonalJobDataObj.IsWellknownCoy,
            MrWellknownCoyCode: response.AppCustPersonalJobDataObj.MrWellknownCoyCode,
            MrInvestmentTypeCode: response.AppCustPersonalJobDataObj.MrInvestmentTypeCode,
            ProfessionalNo: response.AppCustPersonalJobDataObj.ProfessionalNo != "" ? response.AppCustPersonalJobDataObj.ProfessionalNo : "",
            PrevCoyName: response.AppCustPersonalJobDataObj.PrevCoyName != "" ? response.AppCustPersonalJobDataObj.PrevCoyName : "",
            PrevEmploymentDt: response.AppCustPersonalJobDataObj.PrevEmploymentDt != null ? datePipe.transform(response.AppCustPersonalJobDataObj.PrevEmploymentDt, "yyyy-MM-dd") : "",
            OthBizName: response.AppCustPersonalJobDataObj.OthBizName != "" ? response.AppCustPersonalJobDataObj.OthBizName : "",
            OthBizType: response.AppCustPersonalJobDataObj.OthBizType != "" ? response.AppCustPersonalJobDataObj.OthBizType : "",
            OthBizIndustryTypeCode: response.AppCustPersonalJobDataObj.OthBizIndustryTypeCode != "" ? response.AppCustPersonalJobDataObj.OthBizIndustryTypeCode : "",
            OthBizJobPosition: response.AppCustPersonalJobDataObj.OthBizJobPosition != "" ? response.AppCustPersonalJobDataObj.OthBizJobPosition : "",
            OthBizEstablishmentDt: response.AppCustPersonalJobDataObj.OthBizEstablishmentDt != null ? datePipe.transform(response.AppCustPersonalJobDataObj.OthBizEstablishmentDt, "yyyy-MM-dd") : ""
          })
          this.IsWellknownCoy = response.AppCustPersonalJobDataObj.IsWellknownCoy;
          this.JobDataObj.RowVersion = response.AppCustPersonalJobDataObj.RowVersion;
          this.InputLookupProfessionObj.nameSelect = response.AppCustPersonalJobDataObj.MrProfessionName;
          this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response.AppCustPersonalJobDataObj.MrProfessionName };
          this.InputLookupIndustryTypeObj.nameSelect = response.AppCustPersonalJobDataObj.IndustryTypeName;
          this.InputLookupIndustryTypeObj.jsonSelect = { IndustryTypeName: response.AppCustPersonalJobDataObj.IndustryTypeName };
          if(this.IsWellknownCoy){
            this.InputLookupCompanyObj.nameSelect = response.AppCustPersonalJobDataObj.CoyName;
            this.InputLookupCompanyObj.jsonSelect = { Descr: response.AppCustPersonalJobDataObj.CoyName };
          }
        }

        if (response.JobAddr.AppCustAddrId != 0) {
          this.JobAddrObj = response.JobAddr;
          this.InputJobAddrObj.inputField.inputLookupObj.nameSelect = response.JobAddr.Zipcode;
          this.InputJobAddrObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.JobAddr.Zipcode };
          this.InputJobAddrObj.default = this.JobAddrObj;
          this.JobDataAddrObj.RowVersion = response.JobAddr.RowVersion;
          this.JobDataForm.patchValue({
            JobNotes: this.JobAddrObj.Notes
          });
        }

        if (response.PrevJobAddr.AppCustAddrId != 0) {
          this.PrevJobAddrObj = response.PrevJobAddr;
          this.InputPrevJobAddrObj.inputField.inputLookupObj.nameSelect = response.PrevJobAddr.Zipcode;
          this.InputPrevJobAddrObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.PrevJobAddr.Zipcode };
          this.InputPrevJobAddrObj.default = this.PrevJobAddrObj;
          this.PrevJobDataAddrObj.RowVersion = response.PrevJobAddr.RowVersion;
          this.JobDataForm.patchValue({
            PrevJobNotes: this.PrevJobAddrObj.Notes
          });
        }

        if (response.OthBizAddr.AppCustAddrId != 0) {
          this.OthBizAddrObj = response.OthBizAddr;
          this.InputOthBizAddrObj.inputField.inputLookupObj.nameSelect = response.OthBizAddr.Zipcode;
          this.InputOthBizAddrObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.OthBizAddr.Zipcode };
          this.InputOthBizAddrObj.default = this.OthBizAddrObj;
          this.OthBizDataAddrObj.RowVersion = response.OthBizAddr.RowVersion;
          this.JobDataForm.patchValue({
            OthBizNotes: this.OthBizAddrObj.Notes
          });
        }
        this.isUcAddrReady = true;
        this.IsReady = true;
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
    }
    else if (this.CustModelCode == CommonConstant.CustModelProfessional) {
      this.JobDataForm.controls.EmploymentEstablishmentDt.setValidators([Validators.required]);
    }
    this.JobDataForm.controls.MrJobPositionCode.updateValueAndValidity();
    this.JobDataForm.controls.MrJobStatCode.updateValueAndValidity();
    this.JobDataForm.controls.EmploymentEstablishmentDt.updateValueAndValidity();
  }

  SaveForm() {
    // if (this.JobDataForm.controls.EmploymentEstablishmentDt.value > this.BusinessDt) {
    //   var businessDtStr = formatDate(this.UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    //   this.toastr.errorMessage(String.Format(ExceptionConstant.EMPLOYMENT_ESTABLISHMENT_CANNOT_LESS_THAN + businessDtStr));
    //   return false;
    // }
    if (this.IsUseDigitalization == "1" && this.IsIntegratorCheckBySystem == "0" && this.IsSvcExist && this.mouCustId == 0 && this.bizTemplateCode != CommonConstant.FCTR) {
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
    else {
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
    this.JobDataObj.IsWellknownCoy = this.JobDataForm.controls.IsWellknownCoy.value;
    this.JobDataObj.MrWellknownCoyCode = this.JobDataForm.controls.MrWellknownCoyCode.value;
    this.JobDataObj.MrInvestmentTypeCode = this.JobDataForm.controls.MrInvestmentTypeCode.value;
    this.JobDataObj.ProfessionalNo = this.JobDataForm.controls.ProfessionalNo.value;
    this.JobDataObj.PrevCoyName = this.JobDataForm.controls.PrevCoyName.value;
    this.JobDataObj.PrevEmploymentDt = this.JobDataForm.controls.PrevEmploymentDt.value;
    this.JobDataObj.OthBizName = this.JobDataForm.controls.OthBizName.value;
    this.JobDataObj.OthBizType = this.JobDataForm.controls.OthBizType.value;
    this.JobDataObj.OthBizIndustryTypeCode = this.JobDataForm.controls.OthBizIndustryTypeCode.value;
    this.JobDataObj.OthBizJobPosition = this.JobDataForm.controls.OthBizJobPosition.value;
    this.JobDataObj.OthBizEstablishmentDt = this.JobDataForm.controls.OthBizEstablishmentDt.value;

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
      this.JobDataAddrObj.MrHouseOwnershipCode = this.JobDataForm.controls["JobAddr"]["controls"]["MrHouseOwnershipCode"].value;
      this.JobDataAddrObj.Notes = this.JobDataForm.controls["JobNotes"].value;
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
      this.OthBizDataAddrObj.MrHouseOwnershipCode = this.JobDataForm.controls["OthBizAddr"]["controls"]["MrHouseOwnershipCode"].value;
      this.OthBizDataAddrObj.FaxArea = this.JobDataForm.controls["OthBizAddr"]["controls"]["FaxArea"].value;
      this.OthBizDataAddrObj.Notes = this.JobDataForm.controls["OthBizNotes"].value;
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
      this.PrevJobDataAddrObj.MrHouseOwnershipCode = this.JobDataForm.controls["PrevJobAddr"]["controls"]["MrHouseOwnershipCode"].value;
      this.PrevJobDataAddrObj.Notes = this.JobDataForm.controls["PrevJobNotes"].value;
      this.PrevJobDataAddrObj.RowVersion = this.PrevJobAddrObj.RowVersion;
    }else{
      this.JobDataAddrObj = null;
      this.OthBizDataAddrObj = null;
      this.PrevJobDataAddrObj = null;
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

    if(this.CustModelCode != CommonConstant.CustModelNonProfessional){
      if(this.JobDataObj.EmploymentEstablishmentDt.toString() > this.MaxDtValidate){
        this.toastr.warningMessage(String.Format(ExceptionConstant.START_WORKING_DATE_MUST_BE_LESS_THAN_BIZ_DATE));
        return false;
      }

      if(this.JobDataObj.OthBizEstablishmentDt.toString() > this.MaxDtValidate){
        this.toastr.warningMessage(String.Format(ExceptionConstant.OTHER_BIZ_EST_DATE_MUST_BE_LESS_THAN_BIZ_DATE));
        return false;
      }
    }

    if (!this.isDataEdit) {
      this.http.post(URLConstant.AddAppCustPersonalJobData, requestObj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit({ IsComplete: true });
        },
        error => {
          console.log(error);
        });
    } else {
      this.http.post(URLConstant.EditAppCustPersonalJobData, requestObj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.OutputTab.emit({ IsComplete: true });
        },
        error => {
          console.log(error);
        });
    }
  }

  SetCriteriaAndRequired(CustModelCode: string, isChange: boolean = false) {
    this.InputLookupProfessionObj.nameSelect = "";
    this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
    this.InputLookupIndustryTypeObj.nameSelect = "";
    this.InputLookupIndustryTypeObj.jsonSelect = { IndustryTypeName: "" };
    this.InputLookupCompanyObj.nameSelect = "";
    this.InputLookupCompanyObj.jsonSelect = { Descr: "" };

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

    this.ArrAddCritCoy = new Array<CriteriaObj>();
    let critCoyObj = new CriteriaObj();
    critCoyObj.DataType = "text";
    critCoyObj.propName = 'REF_MASTER_TYPE_CODE';
    critCoyObj.restriction = AdInsConstant.RestrictionEq;
    critCoyObj.value = "WELLKNOWN_COY";
    this.ArrAddCritCoy.push(critCoyObj);
    let critCoyObj1 = new CriteriaObj();
    critCoyObj1.DataType = "text";
    critCoyObj1.propName = 'IS_ACTIVE';
    critCoyObj1.restriction = AdInsConstant.RestrictionEq;
    critCoyObj1.value = "1";
    this.ArrAddCritCoy.push(critCoyObj1);
    this.InputLookupCompanyObj.addCritInput = this.ArrAddCritCoy;
    this.InputLookupCompanyObj.isRequired = true;
    this.InputLookupCompanyObj.isReady = true;

    if (CustModelCode == CommonConstant.CustModelNonProfessional) {
      this.InputLookupIndustryTypeObj.isRequired = false;
      this.JobDataForm.controls.CoyName.clearValidators();
    }
    else {
      this.InputLookupIndustryTypeObj.isRequired = true;
      this.JobDataForm.controls.CoyName.setValidators([Validators.required, Validators.minLength(2)]);
    }
    this.JobDataForm.updateValueAndValidity();
  }

  async SetDropdown() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCoyScale }).toPromise().then(
      (response) => {
        this.CompanyScaleObj = response[CommonConstant.ReturnObj];
      }
    );

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition }).toPromise().then(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
      }
    );

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobStat }).toPromise().then(
      (response) => {
        this.JobStatObj = response[CommonConstant.ReturnObj];
      }
    );

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInvestmentType }).toPromise().then(
      (response) => {
        this.InvestmentTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async InitLookup() {
    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.addCritInput = new Array();

    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";

    this.InputLookupCompanyObj.urlJson = "./assets/uclookup/customer/lookupCompany.json";
    this.InputLookupCompanyObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCompanyObj.pagingJson = "./assets/uclookup/customer/lookupCompany.json";
    this.InputLookupCompanyObj.genericJson = "./assets/uclookup/customer/lookupCompany.json";
    this.InputLookupCompanyObj.addCritInput = new Array();

    this.SetCriteriaAndRequired(this.CustModelCode);
    this.InputLookupIndustryTypeObj.isReady = true;
  }

  GetProfession(event) {
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
    this.http.post(URLConstant.GetAppById, { Id: this.appId }).subscribe(
      (response) => {
        if (response['MouCustId'] != null) {
          this.mouCustId = response['MouCustId'];
        }
        this.bizTemplateCode = response["BizTemplateCode"];
        if (this.IsUseDigitalization == "1" && this.IsIntegratorCheckBySystem == "0") {
          this.getDigitalizationSvcType();
          let ReqGetThirdPartyResultHObj = new ReqGetThirdPartyResultHByTrxTypeCodeAndTrxNoObj();
          ReqGetThirdPartyResultHObj.TrxTypeCode = CommonConstant.APP_TRX_TYPE_CODE;
          ReqGetThirdPartyResultHObj.TrxNo = response["AppNo"];
          this.http.post(URLConstant.GetThirdPartyResultHByTrxTypeCodeAndTrxNo, ReqGetThirdPartyResultHObj).subscribe(
            (response : ResThirdPartyRsltHObj) => {
              if (response.ThirdPartyRsltHId != 0 && response.ThirdPartyRsltHId != null) {
                this.requestedDate = response.ReqDt;
              }
            },
            (error) => {
              console.log(error);
            }
          );
        }
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
    this.JobDataObj.IsWellknownCoy = this.JobDataForm.controls.IsWellknownCoy.value;
    this.JobDataObj.MrWellknownCoyCode = this.JobDataForm.controls.MrWellknownCoyCode.value;
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
        this.GetThirdPartyResultHByTrxTypeCodeAndTrxNo()
        this.IsNeedIntegrator = true;
        this.toastr.successMessage("Success with Integrator Checking.");
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isWellknownCoyChecked(event: any) {
    this.IsWellknownCoy = event.target.checked;
    if(event.target.checked == false){
      this.JobDataForm.controls.lookupCompanyData.disable();
    }
    else if(this.IsWellKnownBeforeChanged != true){
      this.JobDataForm.controls.lookupCompanyData.enable();
    }
    this.IsWellKnownBeforeChanged = event.target.checked;
    this.InputLookupCompanyObj.isRequired = event.target.checked;
  }

  getCoy(event: any) {
    this.JobDataForm.patchValue({
      MrWellknownCoyCode: event.MasterCode,
      CoyName: event.Descr
    });
  }

  async getDigitalizationSvcType(){
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType}).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if(this.sysConfigResultObj.ConfigValue != null){
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");
      var refSvcType = "";
      await this.http.post(URLConstant.GetRuleIntegratorPackageMapCust, { TrxNo: this.bizTemplateCode}).toPromise().then(
        (response) => {
            refSvcType = response["Result"];
        });

        var svcType = listSvcType.find(x => x == refSvcType);
      if(svcType != null){
        this.IsSvcExist = true;
      }
    }
  }
}