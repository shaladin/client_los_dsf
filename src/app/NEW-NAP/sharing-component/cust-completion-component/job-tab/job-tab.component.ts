import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-job-tab',
  templateUrl: './job-tab.component.html',
  styleUrls: ['./job-tab.component.scss']
})
export class JobTabComponent implements OnInit {

  private ucLookupProfession: UclookupgenericComponent;
  @ViewChild('LookupProfession') set content(content: UclookupgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucLookupProfession = content;
    }
  }
  @Input() appId: number;
  @Input() AppCustId: number;
  InputLookupProfessionObj: InputLookupObj = new InputLookupObj();
  InputLookupIndustryTypeObj: InputLookupObj = new InputLookupObj();
  InputJobAddrObj: InputAddressObj = new InputAddressObj();
  InputFieldJobAddrObj: InputFieldObj = new InputFieldObj();
  JobAddrObj: AddrObj = new AddrObj();
  InputPrevJobAddrObj: InputAddressObj = new InputAddressObj();
  InputFieldPrevJobAddrObj: InputFieldObj = new InputFieldObj();
  PrevJobAddrObj: AddrObj = new AddrObj();
  InputOtherBusinessObj: InputAddressObj = new InputAddressObj();
  InputFieldOtherBusinessObj: InputFieldObj = new InputFieldObj();
  OtherBusinessObj: AddrObj = new AddrObj();
  CustModelObj: Array<KeyValueObj> = new Array();
  CompanyScaleObj: Array<KeyValueObj> = new Array();
  JobPositionObj: Array<KeyValueObj> = new Array();
  JobStatObj: Array<KeyValueObj> = new Array();
  InvestmentTypeObj: Array<KeyValueObj> = new Array();
  ArrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  isUcAddrReady: boolean = false
  CustModelCode: string;
  UserAccess: any;
  BusinessDt: Date;

  JobDataForm = this.fb.group({
    CustModelCode: ['', Validators.required],
    MrProfessionCode: ['', Validators.required],
    IndustryTypeCode: [Validators.required],
    CoyName: ['', Validators.required],
    MrJobPositionCode:[''],
    MrJobStatCode:[''],
    MrCoyScaleCode:[''],
    EmploymentEstablishmentDt: [''],
    NumOfEmployee: [''],
    JobTitleName: [''],
    IsMfEmp:[false],
    MrInvestmentTypeCode: [''],
    ProfessionalNo: [''],
    PrevCoyName: [''],
    PrevEmploymentDt: [''],
    OthBizName: [''],
    OthBizType: [''],
    OthBizIndustryTypeCode: [''],
    OthBizJobPosition: [''],
    OthBizEstablishmentDt: [''],
  })
  
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {
  }

  async ngOnInit() {
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.BusinessDt = this.UserAccess.BusinessDt;

    this.InputJobAddrObj.showPhn3 = false;
    this.InputJobAddrObj.title = "Job Address";
    this.InputPrevJobAddrObj.title = "Previous Job Address";
    this.InputPrevJobAddrObj.isRequired = false;
    this.InputOtherBusinessObj.title = "Other Business Address";
    this.InputOtherBusinessObj.isRequired = false;
    this.InputFieldJobAddrObj.inputLookupObj = new InputLookupObj();
    this.InputFieldPrevJobAddrObj.inputLookupObj = new InputLookupObj();
    this.InputFieldPrevJobAddrObj.inputLookupObj.isRequired = false;
    this.InputPrevJobAddrObj.inputField = this.InputFieldPrevJobAddrObj;
    this.InputFieldOtherBusinessObj.inputLookupObj = new InputLookupObj();
    this.InputFieldOtherBusinessObj.inputLookupObj.isRequired = false;
    this.InputOtherBusinessObj.inputField = this.InputFieldOtherBusinessObj;
    this.isUcAddrReady = true;
    
    await this.InitLookup();
    this.SetDropdown();
  }

  JobDataObj: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
  JobDataAddrObj: AppCustAddrObj = new AppCustAddrObj();
  PrevJobDataAddrObj: AppCustAddrObj = new AppCustAddrObj();
  OthBizDataAddrObj: AppCustAddrObj = new AppCustAddrObj();

  SaveForm(){
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
      this.JobDataAddrObj.FaxArea = this.JobDataForm.controls["JobAddr"]["controls"]["FaxArea"].value;
      this.JobDataAddrObj.Fax = this.JobDataForm.controls["JobAddr"]["controls"]["Fax"].value;
      this.JobDataAddrObj.SubZipcode = this.JobDataForm.controls["JobAddr"]["controls"]["SubZipcode"].value;
      this.JobDataAddrObj.AreaCode2 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode2"].value;
      this.JobDataAddrObj.AreaCode1 = this.JobDataForm.controls["JobAddr"]["controls"]["AreaCode1"].value;
      this.JobDataAddrObj.City = this.JobDataForm.controls["JobAddr"]["controls"]["City"].value;
      this.JobDataAddrObj.Zipcode = this.JobDataForm.controls["JobAddrZipcode"]["value"].value;

      this.OthBizDataAddrObj.Addr = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["Addr"].value == null ? "" : this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["Addr"].value;
      this.OthBizDataAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypeOthBiz;
      this.OthBizDataAddrObj.AreaCode4 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["AreaCode4"].value;
      this.OthBizDataAddrObj.AreaCode3 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["AreaCode3"].value;
      this.OthBizDataAddrObj.PhnArea1 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["PhnArea1"].value;
      this.OthBizDataAddrObj.Phn1 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["Phn1"].value;
      this.OthBizDataAddrObj.PhnExt1 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["PhnExt1"].value;
      this.OthBizDataAddrObj.PhnArea2 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["PhnArea2"].value;
      this.OthBizDataAddrObj.Phn2 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["Phn2"].value;
      this.OthBizDataAddrObj.PhnExt2 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["PhnExt2"].value;
      this.OthBizDataAddrObj.FaxArea = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["FaxArea"].value;
      this.OthBizDataAddrObj.Fax = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["Fax"].value;
      this.OthBizDataAddrObj.SubZipcode = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["SubZipcode"].value;
      this.OthBizDataAddrObj.AreaCode2 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["AreaCode2"].value;
      this.OthBizDataAddrObj.AreaCode1 = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["AreaCode1"].value;
      this.OthBizDataAddrObj.City = this.JobDataForm.controls["OtherBusinessAddr"]["controls"]["City"].value;
      this.OthBizDataAddrObj.Zipcode = this.JobDataForm.controls["OtherBusinessAddr"]["value"].value;

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
      this.PrevJobDataAddrObj.FaxArea = this.JobDataForm.controls["PrevJobAddr"]["controls"]["FaxArea"].value;
      this.PrevJobDataAddrObj.Fax = this.JobDataForm.controls["PrevJobAddr"]["controls"]["Fax"].value;
      this.PrevJobDataAddrObj.SubZipcode = this.JobDataForm.controls["PrevJobAddr"]["controls"]["SubZipcode"].value;
      this.PrevJobDataAddrObj.AreaCode2 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode2"].value;
      this.PrevJobDataAddrObj.AreaCode1 = this.JobDataForm.controls["PrevJobAddr"]["controls"]["AreaCode1"].value;
      this.PrevJobDataAddrObj.City = this.JobDataForm.controls["PrevJobAddr"]["controls"]["City"].value;
      this.PrevJobDataAddrObj.Zipcode = this.JobDataForm.controls["PrevJobAddr"]["value"].value;

    let requestObj={
      AppId: this.appId,
      AppCustId: this.AppCustId,
      CustModelCode: this.JobDataForm.controls.CustModelCode.value,
      JobDataObj: this.JobDataObj,
      JobDataAddrObj: this.JobDataAddrObj,
      PrevJobAddrObj: this.PrevJobDataAddrObj,
      OthBizAddrObj: this.OthBizDataAddrObj
    }

    this.http.post(URLConstant.AddAppCustPersonalJobAndAppCustAddr, requestObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
      },
      error => {
        console.log(error);
      });

    
  }
  
  SetCriteriaAndRequired(CustModelCode: string, isChange: boolean = false){
    this.CustModelCode = CustModelCode;
    this.ArrAddCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = "text";
    critObj.propName = 'MR_CUST_MODEL_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = CustModelCode;
    this.ArrAddCrit.push(critObj);
    this.InputLookupProfessionObj.addCritInput = this.ArrAddCrit;
    if(isChange) this.ucLookupProfession.setAddCritInput();
    this.InputLookupProfessionObj.isReady = true;

    if(CustModelCode == CommonConstant.CustModelNonProfessional){
      this.InputLookupIndustryTypeObj.isRequired = false;
      this.JobDataForm.controls.CoyName.clearValidators();
    }else{
      this.InputLookupIndustryTypeObj.isRequired = true;
      this.JobDataForm.controls.CoyName.setValidators(Validators.required);
    }

    this.JobDataForm.updateValueAndValidity();
  }

  SetDropdown(){
    this.http.post(URLConstant.GetListKeyValueByMrCustTypeCode, {MrCustTypeCode: CommonConstant.CustTypePersonal}).subscribe(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        this.JobDataForm.patchValue({
          CustModelCode: this.CustModelObj[0].Key
        });
        this.SetCriteriaAndRequired(this.CustModelObj[0].Key)
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCoyScale}).subscribe(
      (response) => {
        this.CompanyScaleObj = response[CommonConstant.ReturnObj];
        this.JobDataForm.patchValue({
          MrCoyScaleCode: this.CompanyScaleObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition}).subscribe(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        this.JobDataForm.patchValue({
          MrJobPositionCode: this.JobPositionObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobStat}).subscribe(
      (response) => {
        this.JobStatObj = response[CommonConstant.ReturnObj];
        this.JobDataForm.patchValue({
          MrJobStatCode: this.JobStatObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInvestmentType}).subscribe(
      (response) => {
        this.InvestmentTypeObj = response[CommonConstant.ReturnObj];
        this.JobDataForm.patchValue({
          MrInvestmentTypeCode: this.InvestmentTypeObj[0].Key
        });
      }
    );
  }

  InitLookup(){
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
    this.InputLookupIndustryTypeObj.isReady = true;
  }

  GetProfession(event){
    this.JobDataForm.patchValue({
      MrProfessionCode: event.ProfessionCode
    });
  }

  GetIndustryType(event){
    this.JobDataForm.patchValue({
      IndustryTypeCode: event.IndustryTypeCode
    });
  }
}
