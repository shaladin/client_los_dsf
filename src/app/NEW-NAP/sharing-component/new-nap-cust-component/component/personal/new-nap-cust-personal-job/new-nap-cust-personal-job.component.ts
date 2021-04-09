import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/AppCustPersonalJobDataObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ResponseJobDataPersonalObj } from 'app/shared/model/ResponseJobDataPersonalObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-nap-cust-personal-job',
  templateUrl: './new-nap-cust-personal-job.component.html',
  styles: []
})
export class NewNapCustPersonalJobComponent implements OnInit {
  private ucLookupProfession: UclookupgenericComponent;
  @ViewChild('LookupProfession') set content(content: UclookupgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucLookupProfession = content;
    }
  }
  @Input() ParentForm: FormGroup;
  @Input() appId: number;
  @Input() AppCustId: number;
  @Input() CustModelCode: string;
  @Input() IsJobSubmitted: boolean;
  @Input() IsCopy: boolean;
  @Input() CustPersonalJobData: AppCustPersonalJobDataObj;
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();
  InputLookupIndustryTypeObj: InputLookupObj = new InputLookupObj();
  JobDataObj: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
  CustModelObj: Array<KeyValueObj> = new Array();
  CompanyScaleObj: Array<KeyValueObj> = new Array();
  JobPositionObj: Array<KeyValueObj> = new Array();
  JobStatObj: Array<KeyValueObj> = new Array();
  InvestmentTypeObj: Array<KeyValueObj> = new Array();
  ArrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  isUcAddrReady: boolean = false
  MrCustModelDescr: string = "Employee";
  BusinessDt: Date;
  UserAccess: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private cookieService: CookieService
  ) { 
    this.IsJobSubmitted = false;
  }

  async ngOnInit() : Promise<void> {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BusinessDt = this.UserAccess.BusinessDt;

    await this.http.post<RefMasterObj>(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, { MasterCode: this.CustModelCode, RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel}).toPromise().then(
      (response) => {
        this.MrCustModelDescr = response.Descr;
        this.CheckCustModel();
        this.InitLookup();
      }
    );

    if (this.CustModelCode != CommonConstant.CustModelNonProfessional) {
      await this.SetDropdown();
    }
    await this.GetData(this.IsCopy, this.CustPersonalJobData);
  }

  async GetData(isCopy: boolean, custPersonalJobData: AppCustPersonalJobDataObj) {
    var datePipe = new DatePipe("en-US");
    if(!isCopy){
      await this.http.post<ResponseJobDataPersonalObj>(URLConstant.GetAppCustPersonalJobData, { Id: this.AppCustId }).toPromise().then(
        (response) => {
          if (response.AppCustPersonalJobDataObj != null) {
            this.ParentForm.patchValue({
              MrProfessionCode: response.AppCustPersonalJobDataObj.MrProfessionCode,
              IndustryTypeCode: response.AppCustPersonalJobDataObj.IndustryTypeCode,
              CoyName: response.AppCustPersonalJobDataObj.CoyName,
              MrJobPositionCode: response.AppCustPersonalJobDataObj.MrJobPositionCode,
              MrJobStatCode: response.AppCustPersonalJobDataObj.MrJobStatCode,
              MrCoyScaleCode: response.AppCustPersonalJobDataObj.MrCoyScaleCode,
              EmploymentEstablishmentDt: response.AppCustPersonalJobDataObj.EmploymentEstablishmentDt != null ? formatDate(response.AppCustPersonalJobDataObj.EmploymentEstablishmentDt, 'yyyy-MM-dd', 'en-US') : null,
              NumOfEmployee: response.AppCustPersonalJobDataObj.NumOfEmployee,
              JobTitleName: response.AppCustPersonalJobDataObj.JobTitleName,
              IsMfEmp: response.AppCustPersonalJobDataObj.IsMfEmp,
              MrInvestmentTypeCode: response.AppCustPersonalJobDataObj.MrInvestmentTypeCode,
              ProfessionalNo: response.AppCustPersonalJobDataObj.ProfessionalNo != "" ? response.AppCustPersonalJobDataObj.ProfessionalNo : "",
              PrevCoyName: response.AppCustPersonalJobDataObj.PrevCoyName != "" ? response.AppCustPersonalJobDataObj.PrevCoyName : "",
              PrevEmploymentDt: response.AppCustPersonalJobDataObj.PrevEmploymentDt != null ? datePipe.transform(response.AppCustPersonalJobDataObj.PrevEmploymentDt, "yyyy-MM-dd") : null,
              OthBizName: response.AppCustPersonalJobDataObj.OthBizName != "" ? response.AppCustPersonalJobDataObj.OthBizName : "",
              OthBizType: response.AppCustPersonalJobDataObj.OthBizType != "" ? response.AppCustPersonalJobDataObj.OthBizType : "",
              OthBizIndustryTypeCode: response.AppCustPersonalJobDataObj.OthBizIndustryTypeCode != "" ? response.AppCustPersonalJobDataObj.OthBizIndustryTypeCode : "",
              OthBizJobPosition: response.AppCustPersonalJobDataObj.OthBizJobPosition != "" ? response.AppCustPersonalJobDataObj.OthBizJobPosition : "",
              OthBizEstablishmentDt: response.AppCustPersonalJobDataObj.OthBizEstablishmentDt != null ? datePipe.transform(response.AppCustPersonalJobDataObj.OthBizEstablishmentDt, "yyyy-MM-dd") : null,
              RowVersion: response.AppCustPersonalJobDataObj.RowVersion
            })
            this.InputLookupProfessionObj.nameSelect = response.AppCustPersonalJobDataObj.MrProfessionName;
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response.AppCustPersonalJobDataObj.MrProfessionName };
            this.InputLookupIndustryTypeObj.nameSelect = response.AppCustPersonalJobDataObj.IndustryTypeName;
            this.InputLookupIndustryTypeObj.jsonSelect = { IndustryTypeName: response.AppCustPersonalJobDataObj.IndustryTypeName };
          }
          
        },
        error => {
          console.log(error);
        });
    }else{
      if (custPersonalJobData != null) {
        this.ParentForm.patchValue({
          MrProfessionCode: custPersonalJobData.MrProfessionCode,
          IndustryTypeCode: custPersonalJobData.IndustryTypeCode,
          CoyName: custPersonalJobData.CompanyName,
          MrJobPositionCode: custPersonalJobData.MrJobPositionCode,
          MrJobStatCode: custPersonalJobData.MrJobStatCode,
          MrCoyScaleCode: custPersonalJobData.MrCompanyScaleCode,
          EmploymentEstablishmentDt: custPersonalJobData.EstablishmentDt != null ? formatDate(custPersonalJobData.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : null,
          NumOfEmployee: custPersonalJobData.NumOfEmployee,
          JobTitleName: custPersonalJobData.JobTitleName,
          IsMfEmp: custPersonalJobData.IsMfEmp,
          MrInvestmentTypeCode: custPersonalJobData.MrInvestmentTypeCode,
          ProfessionalNo: custPersonalJobData.ProfessionalNo != "" ? custPersonalJobData.ProfessionalNo : "",
          PrevCoyName: custPersonalJobData.PrevCoyName != "" ? custPersonalJobData.PrevCoyName : "",
          PrevEmploymentDt: custPersonalJobData.PrevEmploymentDt != null ? datePipe.transform(custPersonalJobData.PrevEmploymentDt, "yyyy-MM-dd") : null,
          OthBizName: custPersonalJobData.OthBizName != "" ? custPersonalJobData.OthBizName : "",
          OthBizType: custPersonalJobData.OthBizType != "" ? custPersonalJobData.OthBizType : "",
          OthBizIndustryTypeCode: custPersonalJobData.OthBizIndustryTypeCode != "" ? custPersonalJobData.OthBizIndustryTypeCode : "",
          OthBizJobPosition: custPersonalJobData.OthBizJobPosition != "" ? custPersonalJobData.OthBizJobPosition : "",
          OthBizEstablishmentDt: custPersonalJobData.OthBizEstablishmentDt != null ? datePipe.transform(custPersonalJobData.OthBizEstablishmentDt, "yyyy-MM-dd") : null,
        })
        this.InputLookupProfessionObj.nameSelect = custPersonalJobData.MrProfessionName;
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: custPersonalJobData.MrProfessionName };
        this.InputLookupIndustryTypeObj.nameSelect = custPersonalJobData.IndustryTypeName;
        this.InputLookupIndustryTypeObj.jsonSelect = { IndustryTypeName: custPersonalJobData.IndustryTypeName };
      }     
    }  
  }

  CheckCustModel(){
    if(this.CustModelCode == CommonConstant.CustModelEmployee){
      this.ParentForm.controls.MrJobPositionCode.setValidators([Validators.required]);
      this.ParentForm.controls.MrJobStatCode.setValidators([Validators.required]);
      this.ParentForm.controls.EmploymentEstablishmentDt.setValidators([Validators.required]);
      this.ParentForm.controls.CoyName.setValidators([Validators.required]);
    }else if(this.CustModelCode == CommonConstant.CustModelProfessional){
      this.ParentForm.controls.EmploymentEstablishmentDt.setValidators([Validators.required]);
      this.ParentForm.controls.MrJobPositionCode.clearValidators();
      this.ParentForm.controls.MrJobStatCode.clearValidators();
      this.ParentForm.controls.CoyName.clearValidators();
    }else if(this.CustModelCode == CommonConstant.CustModelNonProfessional){
      this.ParentForm.controls.MrJobPositionCode.clearValidators();
      this.ParentForm.controls.MrJobStatCode.clearValidators();
      this.ParentForm.controls.EmploymentEstablishmentDt.clearValidators();
      this.ParentForm.controls.CoyName.clearValidators();
    }else if(this.CustModelCode == CommonConstant.CustModelSmallMediumEnterprise){
      this.ParentForm.controls.EmploymentEstablishmentDt.clearValidators();
      this.ParentForm.controls.MrJobPositionCode.setValidators([Validators.required]);
      this.ParentForm.controls.MrJobStatCode.clearValidators();
      this.ParentForm.controls.CoyName.setValidators([Validators.required]);
    }
    this.ParentForm.controls.MrJobPositionCode.updateValueAndValidity();
    this.ParentForm.controls.MrJobStatCode.updateValueAndValidity();
    this.ParentForm.controls.EmploymentEstablishmentDt.updateValueAndValidity();
    this.ParentForm.controls.CoyName.updateValueAndValidity();
  }

  SetCriteriaAndRequired(CustModelCode: string, isChange: boolean = false) {
    this.InputLookupIndustryTypeObj.isReady = false;
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
      if(this.ParentForm.controls.lookupIndustryType != undefined){
        this.ParentForm.controls.lookupIndustryType['controls']['value'].clearValidators();
      }
    } else {
      this.InputLookupIndustryTypeObj.isRequired = true;
      if(this.ParentForm.controls.lookupIndustryType != undefined){
        this.ParentForm.controls.lookupIndustryType['controls']['value'].setValidators([Validators.required]);
      }
    }
    this.InputLookupIndustryTypeObj.isReady = true;

  }

  async SetDropdown() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCoyScale }).toPromise().then(
      (response) => {
        this.CompanyScaleObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
          MrCoyScaleCode: this.CompanyScaleObj[0].Key
        });
      }
    );

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition }).toPromise().then(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
          MrJobPositionCode: this.JobPositionObj[0].Key
        });
      }
    );

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobStat }).toPromise().then(
      (response) => {
        this.JobStatObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
          MrJobStatCode: this.JobStatObj[0].Key
        });
      }
    );

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInvestmentType }).toPromise().then(
      (response) => {
        this.InvestmentTypeObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
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
  }

  GetProfession(event) {
    this.ParentForm.patchValue({
      MrProfessionCode: event.ProfessionCode
    });
  }

  GetIndustryType(event) {
    this.ParentForm.patchValue({
      IndustryTypeCode: event.IndustryTypeCode
    });
  }

}
