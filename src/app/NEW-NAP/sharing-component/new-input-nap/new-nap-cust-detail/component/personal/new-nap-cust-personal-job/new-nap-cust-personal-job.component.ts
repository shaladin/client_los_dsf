import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
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
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ResponseJobDataPersonalObj } from 'app/shared/model/ResponseJobDataPersonalObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';

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
  BusinessDt: Date;
  UserAccess: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) { 
    this.IsJobSubmitted = false;
  }

  async ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.BusinessDt = this.UserAccess.BusinessDt;

    await this.InitLookup();
    this.http.post<RefMasterObj>(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, { MasterCode: this.CustModelCode, RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel}).subscribe(
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

  GetData() {
    var datePipe = new DatePipe("en-US");
    this.http.post<ResponseJobDataPersonalObj>(URLConstant.GetAppCustPersonalJobData, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        if (response.AppCustPersonalJobDataObj != null) {
          this.ParentForm.patchValue({
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
            PrevEmploymentDt: response.AppCustPersonalJobDataObj.PrevEmploymentDt != null ? datePipe.transform(response.AppCustPersonalJobDataObj.PrevEmploymentDt, "yyyy-MM-dd") : "",
            OthBizName: response.AppCustPersonalJobDataObj.OthBizName != "" ? response.AppCustPersonalJobDataObj.OthBizName : "",
            OthBizType: response.AppCustPersonalJobDataObj.OthBizType != "" ? response.AppCustPersonalJobDataObj.OthBizType : "",
            OthBizIndustryTypeCode: response.AppCustPersonalJobDataObj.OthBizIndustryTypeCode != "" ? response.AppCustPersonalJobDataObj.OthBizIndustryTypeCode : "",
            OthBizJobPosition: response.AppCustPersonalJobDataObj.OthBizJobPosition != "" ? response.AppCustPersonalJobDataObj.OthBizJobPosition : "",
            OthBizEstablishmentDt: response.AppCustPersonalJobDataObj.OthBizEstablishmentDt != null ? datePipe.transform(response.AppCustPersonalJobDataObj.OthBizEstablishmentDt, "yyyy-MM-dd") : "",
            RowVersion: response.AppCustPersonalJobDataObj.RowVersion
          })
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
            this.ParentForm.patchValue({
              JobNotes: this.JobAddrObj.Notes
            });
          }

          if (response.PrevJobAddr.AppCustAddrId != 0) {
            this.PrevJobAddrObj = response.PrevJobAddr;
            this.InputPrevJobAddrObj.inputField.inputLookupObj.nameSelect = response.PrevJobAddr.Zipcode;
            this.InputPrevJobAddrObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.PrevJobAddr.Zipcode };
            this.InputPrevJobAddrObj.default = this.PrevJobAddrObj;
            this.PrevJobDataAddrObj.RowVersion = response.PrevJobAddr.RowVersion;
            this.ParentForm.patchValue({
              PrevJobNotes: this.PrevJobAddrObj.Notes
            });
          }

          if (response.OthBizAddr.AppCustAddrId != 0) {
            this.OthBizAddrObj = response.OthBizAddr;
            this.InputOthBizAddrObj.inputField.inputLookupObj.nameSelect = response.OthBizAddr.Zipcode;
            this.InputOthBizAddrObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.OthBizAddr.Zipcode };
            this.InputOthBizAddrObj.default = this.OthBizAddrObj;
            this.OthBizDataAddrObj.RowVersion = response.OthBizAddr.RowVersion;
            this.ParentForm.patchValue({
              OthBizNotes: this.OthBizAddrObj.Notes
            });
          }
        this.isUcAddrReady = true;
      },
      error => {
        console.log(error);
      });
  }

  CheckCustModel(){
    if(this.CustModelCode == CommonConstant.CustModelEmployee){
      this.ParentForm.controls.MrJobPositionCode.setValidators([Validators.required]);
      this.ParentForm.controls.MrJobStatCode.setValidators([Validators.required]);
      this.ParentForm.controls.EmploymentEstablishmentDt.setValidators([Validators.required]);
    }else if(this.CustModelCode == CommonConstant.CustModelProfessional){
      this.ParentForm.controls.EmploymentEstablishmentDt.setValidators([Validators.required]);
    }
    this.ParentForm.controls.MrJobPositionCode.updateValueAndValidity();
    this.ParentForm.controls.MrJobStatCode.updateValueAndValidity();
    this.ParentForm.controls.EmploymentEstablishmentDt.updateValueAndValidity();
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
      this.ParentForm.controls.CoyName.clearValidators();
    } else {
      this.InputLookupIndustryTypeObj.isRequired = true;
      this.ParentForm.controls.CoyName.setValidators(Validators.required);
    }

    this.ParentForm.updateValueAndValidity();
  }

  SetDropdown() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCoyScale }).subscribe(
      (response) => {
        this.CompanyScaleObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
          MrCoyScaleCode: this.CompanyScaleObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition }).subscribe(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
          MrJobPositionCode: this.JobPositionObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobStat }).subscribe(
      (response) => {
        this.JobStatObj = response[CommonConstant.ReturnObj];
        this.ParentForm.patchValue({
          MrJobStatCode: this.JobStatObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInvestmentType }).subscribe(
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
    this.InputLookupIndustryTypeObj.isReady = true;
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
