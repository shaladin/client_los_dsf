import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustEmrgncCntctObj } from 'app/shared/model/AppCustEmrgncCntctObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustOtherInfoObj } from 'app/shared/model/AppCustOtherInfoObj.model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/AppCustPersonalJobDataObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { CustMainDataCompanyObj } from 'app/shared/model/CustMainDataCompanyObj.Model';
import { CustMainDataPersonalObj } from 'app/shared/model/CustMainDataPersonalObj.Model';
import { ResponseAppCustCompletionPersonalDataObj } from 'app/shared/model/ResponseAppCustCompletionPersonalDataObj.Model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-new-nap-cust-detail',
  templateUrl: './new-nap-cust-detail.component.html',
  styles: []
})
export class NewNapCustDetailComponent implements OnInit {
  @Input() AppId: number;
  @Input() AppCustIdInput: number;
  @Input() custMainDataMode: string;
  inputMode: string;
  @Input() BizTemplateCode: string;
  @Output() outputTab: EventEmitter<any>;
  @Output() outputCancel: EventEmitter<any>;
  custDataPersonalObj: CustMainDataPersonalObj;
  AppCustObj: AppCustObj;
  AppCustPersonalObj: AppCustPersonalObj;
  ListAppCustGrpObj: Array<AppCustGrpObj>;
  custDataCompanyObj: CustMainDataCompanyObj;
  InputAppCustObjMainData: Object;
  AppCustDataForChecking: AppCustObj;
  JobDataObj: AppCustPersonalJobDataObj;
  appCustEmrgncCntctObj: AppCustEmrgncCntctObj;
  AppCustPersonalFinData: AppCustPersonalFinDataObj;
  appCustOtherInfo : AppCustOtherInfoObj;
  ResponseCustOtherInfo : any;
  CustAttrRequest: Array<Object>;
  ListAddress: Array<AppCustAddrObj>;
  MrCustTypeCode: string;
  appCustId: number;
  isExisting: boolean;
  isIncludeCustRelation: boolean;
  isLocal: boolean;
  MaxDate: Date;
  LocalCountryCode: string;
  NationalityCountryCode: string;
  CustModelCode: string;
  AppCustPersonalId: number;
  IsCompletion: boolean;
  IsMarried: boolean;
  AttrGroup: string;
  IsSubmitted: boolean;
  custAttrRequest = new Array<Object>();

  //#region FormAppCustMainData
  CustMainDataForm = this.fb.group({
    MrCustModelCode: ['', Validators.required],
    MrCustTypeCode: [],
    MrCustRelationshipCode: ['',Validators.maxLength(50)],
    CustName: ['', Validators.required],
    CustNo: [],
    CompanyType: [''],
    MrMaritalStatCode: ['', Validators.required],
    MrIdTypeCode: ['', Validators.required],
    IdNo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    IdExpiredDt: [''],
    TaxIdNo: ['', Validators.pattern("^[0-9]+$")],
    MrGenderCode: ['', Validators.required],
    BirthPlace: ['', Validators.required],
    BirthDt: ['', Validators.required],
    MotherMaidenName: ['', Validators.required],
    MrCompanyTypeCode: [''],
    MobilePhnNo1: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    Email1: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    MrJobPositionCode: [''],
    EstablishmentDt: [''],
    SharePrcnt: [0],
    IsSigner: [false],
    IsActive: [false],
    IsOwner: [false],
    RowVersionAppCust: [''],
    RowVersionAppCustPersonal: [''],
    RowVersionAppCustCompany: [''],
    RowVersionLegalAddr: [''],
    RowVersionShareholder: ['']
  });
  //#endregion

  //#region FormAppCustPersonal
  CustDetailForm = this.fb.group({
    FamilyCardNo: ['', Validators.pattern("^[0-9]+$")],
    NoOfDependents: ['', Validators.pattern("^[0-9]+$")],
    NoOfResidence: ['', Validators.pattern("^[0-9]+$")],
    IsRestInPeace: [false],
    IsVip: [false],
    IsAffiliateWithMf: [false],
    NickName: [''],
    MrNationalityCode: ['', Validators.required],
    Country: ['', Validators.required],
    MrEducationCode: ['', Validators.required],
    MrReligionCode: ['', Validators.required],
    VIPNotes: [''],
    CustFullName: ['', Validators.required],
    CustPrefixName: [''],
    CustSuffixName: [''],
    MrSalutationCode: [''],
    RowVersionAppCust: [''],
    RowVersionAppCustPersonal: ['']
  });

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
  });

  EmergencyContactForm = this.fb.group({
    ContactPersonName: ['', Validators.required],
    ContactPersonCustNo: [''],
    MrIdTypeCode: [''],
    MrGenderCode: ['', Validators.required],
    IdNo: [''],
    BirthPlace: [''],
    IdExpiredDt: [''],
    BirthDt: ['', Validators.required],
    MrCustRelationshipCode: ['', Validators.required],
    MobilePhnNo1: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    MobilePhnNo2: ['', Validators.pattern("^[0-9]+$")],
    Email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
    CopyAddrFrom: ['']
  });

  PersonalFinancialForm = this.fb.group({
    AppCustPersonalId: [0],
    MonthlyIncomeAmt: ['', Validators.required],
    MrSourceOfIncomeTypeCode: [''],
    OtherIncomeAmt: [0],
    IsJoinIncome: [false],
    MonthlyExpenseAmt: [0],
    MonthlyInstallmentAmt: [0],
    OtherMonthlyInstAmt: [0],
    SpouseMonthlyIncomeAmt: [0],
    TotalIncomeAmt: [0],
    NettIncomeAmt: [0],
    RowVersion: ['']
  });
  //#endregion

  //#region FormAppCustCompany
  //#endregion

  //#region FormOtherInfo
  OtherInformationForm = this.fb.group({
    LbppmsBizSclLbppCode: ['', [Validators.required]],
    LbppmsBizSustainLbppCode: ['', [Validators.required]],
    LbppmsCntrprtLbppCode: ['', [Validators.required]],
    LbppmsDebtGrpLbppCode: ['', [Validators.required]],
    LbppmsCntrprtLbppDescr: ['', [Validators.required]],
    LbppmsDebtGrpLbppDescr: ['', [Validators.required]],
    LbppmsBizSustainLbppDescr: ['', [Validators.required]],
    LbppmsBizSclLbppDescr: ['', [Validators.required]]
  }); 
  //#endregion

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) { 
    this.custDataPersonalObj = new CustMainDataPersonalObj();
    this.AppCustObj = new AppCustObj();
    this.AppCustPersonalObj = new AppCustPersonalObj();
    this.ListAppCustGrpObj = new Array<AppCustGrpObj>();
    this.inputMode = "ADD";
    this.InputAppCustObjMainData = new Object();
    this.JobDataObj = new AppCustPersonalJobDataObj();
    this.appCustEmrgncCntctObj = new AppCustEmrgncCntctObj();
    this.CustAttrRequest = new Array<Object>();
    this.AppCustPersonalFinData = new AppCustPersonalFinDataObj();
    this.appCustOtherInfo = new AppCustOtherInfoObj();
    this.ListAddress = new Array<AppCustAddrObj>();
    this.outputTab = new EventEmitter<any>();
    this.outputCancel = new EventEmitter<any>();
    this.isExisting = false;
    this.isIncludeCustRelation = false;
    this.AppCustPersonalId = 0;
    this.IsCompletion = false;
    this.AppCustIdInput = 0;
    this.appCustId = 0;
    this.IsMarried = false;
    this.AttrGroup = CommonConstant.AttrGroupCustPersonalFinData;
    this.custAttrRequest = new Array<Object>();
    this.custMainDataMode = CommonConstant.CustMainDataModeCust;
    this.IsSubmitted = false;
  }

  ngOnInit() {
    var userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = userAccess[CommonConstant.BUSINESS_DT];
    var url = URLConstant.GetAppCustMainDataByAppId;
    var req;
    var isGetAppCust = false;
    
    if(this.AppCustIdInput > 0 && this.custMainDataMode != CommonConstant.CustMainDataModeCust){
      url = URLConstant.GetAppCustMainDataByAppCustId;
      req = { AppCustId: this.AppCustIdInput };
      isGetAppCust = true;
    }
    else if(this.custMainDataMode == CommonConstant.CustMainDataModeCust){
      req = { AppId: this.AppId };
      isGetAppCust = true;
    }
    if(isGetAppCust){
      this.http.post<ResponseAppCustMainDataObj>(url, req).toPromise().then(
        async (response) => {
          if(response.StatusCode == "200"){
            this.inputMode = "EDIT";
            this.appCustId = response.AppCustObj.AppCustId;
            if(this.custMainDataMode == CommonConstant.CustMainDataModeCust){
              this.AppCustIdInput = this.appCustId;
            }
            this.MrCustTypeCode = response.AppCustObj.MrCustTypeCode;
            this.isExisting = response.AppCustObj.IsExistingCust;
            this.InputAppCustObjMainData = response;
  
            if(this.MrCustTypeCode == CommonConstant.CustTypePersonal){
              await this.http.post<ResponseAppCustCompletionPersonalDataObj>(URLConstant.GetAppCustAndAppCustPersonalDataByAppCustId, {AppCustId: this.AppCustIdInput}).toPromise().then(
                (response) => {
                  if(response.AppCustPersonalObj.MrMaritalStatCode != null && response.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried) this.IsMarried = true;
                  this.CustModelCode = response.AppCustObj.MrCustModelCode;
                  this.AppCustPersonalId = response.AppCustPersonalObj.AppCustPersonalId;
                  this.IsCompletion = response.AppCustObj.IsCompletion;
                }
              );
            }
          }
          else{
            this.inputMode = "ADD";
          }
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }
    if (this.custMainDataMode != CommonConstant.CustMainDataModeCust) {
      this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, { AppId: this.AppId }).subscribe(
        async (response) => {
          if (response.AppCustObj) {
            this.AppCustDataForChecking = response.AppCustObj;
          }
        }
      );
    }
  }

  cancel(){
    this.outputCancel.emit();
  }

  //#region MainDataCust
  MainDataCustTypeHandler(e){
    this.MrCustTypeCode = e;
  }

  MainDataCustIsExistingHandler(e){
    this.isExisting = e;
  }

  MainDataCustIsIncludeCustRelation(e){
    this.isIncludeCustRelation = e;
  }

  MainDataCustModel(e){
    this.CustModelCode = e;
  }

  setMainDataCustomerPersonalForSave() {
    this.custDataPersonalObj.AppCustObj.MrCustModelCode = this.CustMainDataForm.controls.MrCustModelCode.value;
    this.custDataPersonalObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
    this.custDataPersonalObj.AppCustObj.CustName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataPersonalObj.AppCustObj.CustNo = this.CustMainDataForm.controls.CustNo.value;
    this.custDataPersonalObj.AppCustObj.MrIdTypeCode = this.CustMainDataForm.controls.MrIdTypeCode.value;
    this.custDataPersonalObj.AppCustObj.IdNo = this.CustMainDataForm.controls.IdNo.value;
    this.custDataPersonalObj.AppCustObj.IdExpiredDt = this.CustMainDataForm.controls.IdExpiredDt.value;
    this.custDataPersonalObj.AppCustObj.TaxIdNo = this.CustMainDataForm.controls.TaxIdNo.value;
    this.custDataPersonalObj.AppCustObj.IsCustomer = (this.custMainDataMode == CommonConstant.CustMainDataModeCust);
    this.custDataPersonalObj.AppCustObj.IsGuarantor = (this.custMainDataMode == CommonConstant.CustMainDataModeGuarantor);
    this.custDataPersonalObj.AppCustObj.IsFamily = (this.custMainDataMode == CommonConstant.CustMainDataModeFamily);
    this.custDataPersonalObj.AppCustObj.IsShareholder = (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder);
    this.custDataPersonalObj.AppCustObj.IsExistingCust = this.isExisting;
    this.custDataPersonalObj.AppCustObj.AppId = this.AppId;
    this.custDataPersonalObj.AppCustObj.AppCustId = this.appCustId != null ? this.appCustId : 0;
    this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.AppCustId = this.appCustId ? this.appCustId : 0;
    if (this.isIncludeCustRelation){
      this.custDataPersonalObj.AppCustObj.MrCustRelationshipCode = this.CustMainDataForm.controls.MrCustRelationshipCode.value;
    }

    this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode = this.CustMainDataForm.controls.MrMaritalStatCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode = this.CustMainDataForm.controls.MrGenderCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthPlace = this.CustMainDataForm.controls.BirthPlace.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthDt = this.CustMainDataForm.controls.BirthDt.value;
    this.custDataPersonalObj.AppCustPersonalObj.MotherMaidenName = this.CustMainDataForm.controls.MotherMaidenName.value;
    this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo1 = this.CustMainDataForm.controls.MobilePhnNo1.value;
    this.custDataPersonalObj.AppCustPersonalObj.Email1 = this.CustMainDataForm.controls.Email1.value;

    // this.custDataPersonalObj.AppCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
    // this.custDataPersonalObj.AppCustAddrLegalObj.Addr = this.CustMainDataForm.controls["Address"]["controls"].Addr.value;
    // this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode3 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode3.value;
    // this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode4 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode4.value;
    // this.custDataPersonalObj.AppCustAddrLegalObj.Zipcode = this.CustMainDataForm.controls["AddressZipcode"]["controls"].value.value;
    // this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode1 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode1.value;
    // this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode2 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode2.value;
    // this.custDataPersonalObj.AppCustAddrLegalObj.City = this.CustMainDataForm.controls["Address"]["controls"].City.value;
    // this.custDataPersonalObj.AppCustAddrLegalObj.SubZipcode = this.CustMainDataForm.controls["Address"]["controls"].SubZipcode.value;

    if (this.custDataPersonalObj.AppCustObj.IsShareholder) {
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MrJobPositionCode = this.CustMainDataForm.controls.MrJobPositionCode.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.SharePrcnt = this.CustMainDataForm.controls.SharePrcnt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsSigner = this.CustMainDataForm.controls.IsSigner.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.CustMainDataForm.controls.RowVersionShareholder.value;
    }

    this.custDataPersonalObj.AppCustObj.RowVersion = this.CustMainDataForm.controls.RowVersionAppCust.value;
    this.custDataPersonalObj.AppCustPersonalObj.RowVersion = this.CustMainDataForm.controls.RowVersionAppCustPersonal.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.RowVersion = this.CustMainDataForm.controls.RowVersionLegalAddr.value;
  }

  setMainDataCustomerCompanyForSave() {
    this.custDataCompanyObj = new CustMainDataCompanyObj();
    this.custDataCompanyObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
    this.custDataCompanyObj.AppCustObj.CustName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataCompanyObj.AppCustObj.CustNo = this.CustMainDataForm.controls.CustNo.value;
    this.custDataCompanyObj.AppCustObj.MrIdTypeCode = "NPWP";
    this.custDataCompanyObj.AppCustObj.IdNo = this.CustMainDataForm.controls.TaxIdNo.value;
    this.custDataCompanyObj.AppCustObj.TaxIdNo = this.CustMainDataForm.controls.TaxIdNo.value;
    this.custDataCompanyObj.AppCustObj.IsCustomer = (this.custMainDataMode == CommonConstant.CustMainDataModeCust);
    this.custDataCompanyObj.AppCustObj.IsGuarantor = (this.custMainDataMode == CommonConstant.CustMainDataModeGuarantor);
    this.custDataCompanyObj.AppCustObj.IsShareholder = (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder);
    this.custDataCompanyObj.AppCustObj.AppId = this.AppId;
    this.custDataCompanyObj.AppCustObj.IsExistingCust = this.isExisting;
    this.custDataCompanyObj.AppCustObj.AppCustId = this.appCustId != null ? this.appCustId : 0;
    this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.AppCustId = this.appCustId != null ? this.appCustId : 0;

    if (this.isIncludeCustRelation)
      this.custDataCompanyObj.AppCustObj.MrCustRelationshipCode = this.CustMainDataForm.controls.MrCustRelationshipCode.value;

    this.custDataCompanyObj.AppCustCompanyObj.CompanyBrandName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataCompanyObj.AppCustCompanyObj.MrCompanyTypeCode = this.CustMainDataForm.controls.MrCompanyTypeCode.value;

    this.custDataCompanyObj.AppCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
    this.custDataCompanyObj.AppCustAddrLegalObj.Addr = this.CustMainDataForm.controls["Address"]["controls"].Addr.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode3 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode3.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode4 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode4.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.Zipcode = this.CustMainDataForm.controls["AddressZipcode"]["controls"].value.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode1 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode1.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode2 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode2.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.City = this.CustMainDataForm.controls["Address"]["controls"].City.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.SubZipcode = this.CustMainDataForm.controls["Address"]["controls"].SubZipcode.value;

    if (this.custDataCompanyObj.AppCustObj.IsShareholder) {
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.SharePrcnt = this.CustMainDataForm.controls.SharePrcnt.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsSigner = this.CustMainDataForm.controls.IsSigner.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.CustMainDataForm.controls.RowVersionShareholder.value;
    }

    this.custDataCompanyObj.AppCustObj.RowVersion = this.CustMainDataForm.controls.RowVersionAppCust.value;
    this.custDataCompanyObj.AppCustCompanyObj.RowVersion = this.CustMainDataForm.controls.RowVersionAppCustCompany.value;
    this.custDataCompanyObj.AppCustAddrLegalObj.RowVersion = this.CustMainDataForm.controls.RowVersionLegalAddr.value;
  }

  CekIsCustomer() {
    if (this.custMainDataMode != CommonConstant.CustMainDataModeCust) {
      const TempCust1 = this.CustMainDataForm.value.lookupCustomer.value.toLowerCase();
      const TempCust2 = this.AppCustDataForChecking.CustName.toLowerCase();
      if (TempCust1 == TempCust2) {
        this.toastr.warningMessage(ExceptionConstant.CANT_CHOOSE_ALREADY_SELFCUST_FOR_THIS_NAP);
        return true;
      }
    }
    return false;
  }
  //#endregion

  //#region CustPersonalFullData
  CustPersonalFullDataCustGrpHandler(e){
    this.ListAppCustGrpObj = e;
  }

  CustPersonalFullDataIsLocalHandler(e){
    this.isLocal = e;
  }

  CustPersonalFullDataLocalCountryHandler(e){
    this.LocalCountryCode = e;
  }

  CustPersonalFullDataNationalityCountryHandler(e){
    this.NationalityCountryCode = e;
  }

  SetDataCustPersonalFullData() {
    this.custDataPersonalObj.AppCustObj.AppCustId = this.AppCustIdInput;
    this.custDataPersonalObj.AppCustObj.IsVip = this.CustDetailForm.controls.IsVip.value;
    this.custDataPersonalObj.AppCustObj.IsAffiliateWithMf = this.CustDetailForm.controls.IsAffiliateWithMf.value;
    this.custDataPersonalObj.AppCustObj.VipNotes = this.CustDetailForm.controls.VIPNotes.value;

    this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataPersonalObj.AppCustPersonalObj.CustPrefixName = this.CustDetailForm.controls.CustPrefixName.value;
    this.custDataPersonalObj.AppCustPersonalObj.CustSuffixName = this.CustDetailForm.controls.CustSuffixName.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrNationalityCode = this.CustDetailForm.controls.MrNationalityCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode = this.isLocal ? this.LocalCountryCode : this.NationalityCountryCode;
    this.custDataPersonalObj.AppCustPersonalObj.MrEducationCode = this.CustDetailForm.controls.MrEducationCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrReligionCode = this.CustDetailForm.controls.MrReligionCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrSalutationCode = this.CustDetailForm.controls.MrSalutationCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.FamilyCardNo = this.CustDetailForm.controls.FamilyCardNo.value;
    this.custDataPersonalObj.AppCustPersonalObj.NoOfDependents = this.CustDetailForm.controls.NoOfDependents.value;
    this.custDataPersonalObj.AppCustPersonalObj.NoOfResidence = this.CustDetailForm.controls.NoOfResidence.value;
    this.custDataPersonalObj.AppCustPersonalObj.NickName = this.CustDetailForm.controls.NickName.value;
    this.custDataPersonalObj.AppCustPersonalObj.IsRestInPeace = this.CustDetailForm.controls.IsRestInPeace.value;
  }
  //#endregion
  
  //#region CustAddress
  GetListAddress(e){
    this.ListAddress = e;
  }
  //#endregion

  //#region CustPersonalJobData
  SetAppCustPersonalJobData(){
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
  }
  //#endregion
  
  //#region CustPersonalEmergency
  SetAppCustPersonalEmergency(){
    this.appCustEmrgncCntctObj.AppCustId = this.AppCustIdInput;
    this.appCustEmrgncCntctObj.ContactPersonName = this.EmergencyContactForm.value.lookupCustomer.value;
    this.appCustEmrgncCntctObj.MrIdTypeCode = this.EmergencyContactForm.controls.MrIdTypeCode.value;
    this.appCustEmrgncCntctObj.MrGenderCode = this.EmergencyContactForm.controls.MrGenderCode.value;
    this.appCustEmrgncCntctObj.IdNo = this.EmergencyContactForm.controls.IdNo.value;
    this.appCustEmrgncCntctObj.BirthPlace = this.EmergencyContactForm.controls.BirthPlace.value;
    this.appCustEmrgncCntctObj.IdExpiredDt = this.EmergencyContactForm.controls.IdExpiredDt.value;
    this.appCustEmrgncCntctObj.BirthDt = this.EmergencyContactForm.controls.BirthDt.value;
    this.appCustEmrgncCntctObj.MrCustRelationshipCode = this.EmergencyContactForm.controls.MrCustRelationshipCode.value;
    this.appCustEmrgncCntctObj.MobilePhnNo1 = this.EmergencyContactForm.controls.MobilePhnNo1.value;
    this.appCustEmrgncCntctObj.MobilePhnNo2 = this.EmergencyContactForm.controls.MobilePhnNo2.value;
    this.appCustEmrgncCntctObj.Email = this.EmergencyContactForm.controls.Email.value;
    this.appCustEmrgncCntctObj.Addr = this.EmergencyContactForm.controls["Address"]["controls"].Addr.value;
    this.appCustEmrgncCntctObj.AreaCode1 = this.EmergencyContactForm.controls["Address"]["controls"].AreaCode1.value;
    this.appCustEmrgncCntctObj.AreaCode2 = this.EmergencyContactForm.controls["Address"]["controls"].AreaCode2.value;
    this.appCustEmrgncCntctObj.AreaCode3 = this.EmergencyContactForm.controls["Address"]["controls"].AreaCode3.value;
    this.appCustEmrgncCntctObj.AreaCode4 = this.EmergencyContactForm.controls["Address"]["controls"].AreaCode4.value;
    this.appCustEmrgncCntctObj.City = this.EmergencyContactForm.controls["Address"]["controls"].City.value;
    this.appCustEmrgncCntctObj.Phn1 = this.EmergencyContactForm.controls["Address"]["controls"].Phn1.value;
    this.appCustEmrgncCntctObj.Phn2 = this.EmergencyContactForm.controls["Address"]["controls"].Phn2.value;
    this.appCustEmrgncCntctObj.Phn3 = this.EmergencyContactForm.controls["Address"]["controls"].Phn3.value;
    this.appCustEmrgncCntctObj.PhnArea1 = this.EmergencyContactForm.controls["Address"]["controls"].PhnArea1.value;
    this.appCustEmrgncCntctObj.PhnArea2 = this.EmergencyContactForm.controls["Address"]["controls"].PhnArea2.value;
    this.appCustEmrgncCntctObj.PhnArea3 = this.EmergencyContactForm.controls["Address"]["controls"].PhnArea3.value;
    this.appCustEmrgncCntctObj.PhnExt1 = this.EmergencyContactForm.controls["Address"]["controls"].PhnExt1.value;
    this.appCustEmrgncCntctObj.PhnExt2 = this.EmergencyContactForm.controls["Address"]["controls"].PhnExt2.value;
    this.appCustEmrgncCntctObj.PhnExt3 = this.EmergencyContactForm.controls["Address"]["controls"].PhnExt3.value;
    this.appCustEmrgncCntctObj.Zipcode = this.EmergencyContactForm.controls["AddressZipcode"]["controls"].value.value;
  }
  //#endregion

  //#region CustPersonalFinData
  SetAttrContentFinData(){
    var formValue = this.PersonalFinancialForm['controls']['AttrList'].value;
    this.CustAttrRequest = new Array<Object>();
     
    if(Object.keys(formValue).length > 0 && formValue.constructor === Object){
      for (const key in formValue) {
        if(formValue[key]["AttrValue"]!=null ) { 
          var custAttr = {
            CustAttrContentId: formValue[key]["CustAttrContentId"],
            AppCustId: this.AppCustIdInput,
            RefAttrCode: formValue[key]["AttrCode"],
            AttrValue: formValue[key]["AttrValue"],
            AttrGroup: this.AttrGroup
          };
          this.CustAttrRequest.push(custAttr);
        }
      }  
    }
  }
  //#endregion

  //#region OtherInfo
  GetAppCustOtherInfo(e){
    this.ResponseCustOtherInfo = e;
  }

  setAttrContent(){
    var formValue = this.OtherInformationForm['controls']['AttrList'].value;
    this.custAttrRequest = new Array<Object>();
     
    if(Object.keys(formValue).length > 0 && formValue.constructor === Object){
      for (const key in formValue) {
        if(formValue[key]["AttrValue"]!=null ) { 
        var custAttr = {
          AppCustId: this.AppCustIdInput,
          RefAttrCode: formValue[key]["AttrCode"],
          AttrValue: formValue[key]["AttrValue"],
          AttrGroup: this.AttrGroup
        };
        this.custAttrRequest.push(custAttr);}

      }  
    }
  }
  setAppCustOtherInfoData() {
    this.appCustOtherInfo = new AppCustOtherInfoObj();
    if(this.ResponseCustOtherInfo != undefined){
     this.appCustOtherInfo.RowVersion = this.ResponseCustOtherInfo.RowVersion 
    }
    this.appCustOtherInfo.LbppmsBizSclLbppCode = this.OtherInformationForm.controls.LbppmsBizSclLbppCode.value;
    this.appCustOtherInfo.LbppmsBizSustainLbppCode = this.OtherInformationForm.controls.LbppmsBizSustainLbppCode.value;
    this.appCustOtherInfo.LbppmsCntrprtLbppCode = this.OtherInformationForm.controls.LbppmsCntrprtLbppCode.value;
    this.appCustOtherInfo.LbppmsDebtGrpLbppCode = this.OtherInformationForm.controls.LbppmsDebtGrpLbppCode.value;
    this.appCustOtherInfo.LbppmsCntrprtLbppDescr = this.OtherInformationForm.controls.LbppmsCntrprtLbppDescr.value;
    this.appCustOtherInfo.LbppmsDebtGrpLbppDescr = this.OtherInformationForm.controls.LbppmsDebtGrpLbppDescr.value;
    this.appCustOtherInfo.LbppmsBizSustainLbppDescr = this.OtherInformationForm.controls.LbppmsBizSustainLbppDescr.value;
    this.appCustOtherInfo.LbppmsBizSclLbppDescr = this.OtherInformationForm.controls.LbppmsBizSclLbppDescr.value;

  }
  //#endregion

  SaveForm() {
    this.IsSubmitted = true;
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      if(!this.CustMainDataForm.valid || !this.CustDetailForm.valid || !this.JobDataForm.valid || 
        !this.EmergencyContactForm.valid || !this.PersonalFinancialForm.valid || !this.OtherInformationForm.valid){
        return false;
      }
    }
    
    if(this.CekIsCustomer()) return;
    let max17Yodt = new Date(this.MaxDate);
    let d1 = new Date(this.CustMainDataForm.controls.BirthDt.value);
    let d2 = new Date(this.MaxDate);
    max17Yodt.setFullYear(d2.getFullYear() - 17);

    if (d1 > max17Yodt) {
      this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
      return;
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      var addrMessage = "";
      var addrValidation = {Legal: false, Residence: false};
      for (const item of this.ListAddress) {
        switch (item.MrCustAddrTypeCode) {
          case CommonConstant.AddrTypeLegal:
            addrValidation.Legal = true;
            break;
          case CommonConstant.AddrTypeResidence:
            addrValidation.Residence = true;
            break;
          default:
            break;
        }
      }
      if(!addrValidation.Legal){
        addrMessage == "" ? addrMessage += "Legal" : addrMessage += ",Legal";
      }
      if(!addrValidation.Residence){
        addrMessage == "" ? addrMessage += "Residence" : addrMessage += ",Residence";
      }
      
      if(addrMessage){
        this.toastr.warningMessage("Please Add " + addrMessage + " Address");
        return false;
      }

      this.setMainDataCustomerPersonalForSave();
      this.SetDataCustPersonalFullData();
      this.SetAppCustPersonalJobData();
      this.SetAttrContentFinData();
      this.setAttrContent();
      this.setAppCustOtherInfoData();
      let appCustPersonalJobRequest = {
        AppId: this.AppId,
        AppCustId: this.AppCustIdInput,
        MrCustModelCode: this.CustMainDataForm.controls.MrCustModelCode.value,
        JobDataObj: this.JobDataObj
      };
      this.AppCustPersonalFinData = this.PersonalFinancialForm.value;
      this.AppCustPersonalFinData.AppCustPersonalId = this.AppCustPersonalId;
      let appCustPersonalFinDataRequest = {
        ListAppCustAttrObj: this.CustAttrRequest,
        AppCustPersonalFinDataObj: this.AppCustPersonalFinData
      };
      let appCustOtherInfoRequest = {
        ListRequestAppCustAttrObject: this.custAttrRequest,
        RequestAppCustOtherInfoObj: this.appCustOtherInfo
      };
      var requestPersonal = {
        AppCustObj: this.custDataPersonalObj.AppCustObj,
        AppCustPersonalObj: this.custDataPersonalObj.AppCustPersonalObj,
        AppCustAddrObjList: this.ListAddress,
        AppCustCompanyMgmntShrholderObj: this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj,
        AppCustGrpObjs: this.ListAppCustGrpObj,
        AppCustPersonalJobDataObj: appCustPersonalJobRequest,
        AppCustEmergency: this.appCustEmrgncCntctObj,
        AppCustPersonalFinData: appCustPersonalFinDataRequest,
        AppCustOtherInfo: appCustOtherInfoRequest
      }
      this.http.post(URLConstant.AddEditNewNapCustPersonal, requestPersonal).toPromise().then(
        (response) => {
          if (response["StatusCode"] == 200) {
            this.toastr.successMessage(response["message"]);
            this.outputTab.emit(this.MrCustTypeCode);
          }
          else {
            response["ErrorMessages"].forEach((message: string) => {
              this.toastr.errorMessage(message["Message"]);
            });
          }
        }
      ).catch((error) => {
        console.log(error);
      });
    }
    else {
      this.setMainDataCustomerCompanyForSave();
      // this.http.post(URLConstant.AddEditCustMainDataCompany, this.custDataCompanyObj).subscribe(
      //   (response) => {
      //     if (response["StatusCode"] == 200) {
      //       this.toastr.successMessage(response["message"]);
      //     }
      //     else {
      //       response["ErrorMessages"].forEach((message: string) => {
      //         this.toastr.errorMessage(message["Message"]);
      //       });
      //     }
      //   }
      // );
    }
  }
}
