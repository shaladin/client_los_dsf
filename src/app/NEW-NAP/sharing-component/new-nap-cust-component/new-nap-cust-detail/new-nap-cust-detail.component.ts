import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustCompanyContactPersonObj } from 'app/shared/model/AppCustCompany/AppCustCompanyContactPersonObj.Model';
import { AppCustCompanyFinDataObj } from 'app/shared/model/AppCustCompanyFinDataObj.Model';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppCustEmrgncCntctObj } from 'app/shared/model/AppCustEmrgncCntctObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustOtherInfoObj } from 'app/shared/model/AppCustOtherInfoObj.model';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/AppCustPersonalJobDataObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { CustMainDataCompanyObj } from 'app/shared/model/CustMainDataCompanyObj.Model';
import { CustMainDataPersonalObj } from 'app/shared/model/CustMainDataPersonalObj.Model';
import { ResponseAppCustCompletionCompanyDataObj } from 'app/shared/model/ResponseAppCustCompletionCompanyDataObj.Model';
import { ResponseAppCustCompletionPersonalDataObj } from 'app/shared/model/ResponseAppCustCompletionPersonalDataObj.Model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { ResponseCustCompanyForCopyObj } from 'app/shared/model/ResponseCustCompanyForCopyObj.Model';
import { ResponseCustPersonalForCopyObj } from 'app/shared/model/ResponseCustPersonalForCopyObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { CookieService } from 'ngx-cookie';
import { NewNapCustCompanyContactInfoComponent } from './component/company/new-nap-cust-company-contact-info/new-nap-cust-company-contact-info.component';
import { NewNapCustCompanyFinDataComponent } from './component/company/new-nap-cust-company-fin-data/new-nap-cust-company-fin-data.component';
import { NewNapCustCompanyFullDataComponent } from './component/company/new-nap-cust-company-full-data/new-nap-cust-company-full-data.component';
import { NewNapCustCompanyLegalDocComponent } from './component/company/new-nap-cust-company-legal-doc/new-nap-cust-company-legal-doc.component';
import { NewNapCustAddrComponent } from './component/new-nap-cust-addr/new-nap-cust-addr.component';
import { NewNapOtherInfoComponent } from './component/new-nap-other-info/new-nap-other-info.component';
import { NewNapCustPersonalEmergencyComponent } from './component/personal/new-nap-cust-personal-emergency/new-nap-cust-personal-emergency.component';
import { NewNapCustPersonalFinancialComponent } from './component/personal/new-nap-cust-personal-financial/new-nap-cust-personal-financial.component';
import { NewNapCustPersonalFullDataComponent } from './component/personal/new-nap-cust-personal-full-data/new-nap-cust-personal-full-data.component';
import { NewNapCustPersonalJobComponent } from './component/personal/new-nap-cust-personal-job/new-nap-cust-personal-job.component';

@Component({
  selector: 'app-new-nap-cust-detail',
  templateUrl: './new-nap-cust-detail.component.html',
  styles: []
})
export class NewNapCustDetailComponent implements OnInit {
  @ViewChild("NewNapPersonalJobContainer", { read: ViewContainerRef }) personalJobContainer: ViewContainerRef;
  @ViewChild(NewNapCustPersonalFullDataComponent) custPersonalFullDataComponent;
  @ViewChild(NewNapCustAddrComponent) custAddrComponent;
  @ViewChild(NewNapCustPersonalEmergencyComponent) custPersonalEmergencyComponent;
  @ViewChild(NewNapCustPersonalFinancialComponent) custPersonalFinancialComponent;
  @ViewChild(NewNapOtherInfoComponent) otherInfoComponent;

  @ViewChild(NewNapCustCompanyFullDataComponent) custCompanyFullDataComponent: NewNapCustCompanyFullDataComponent;
  @ViewChild(NewNapCustCompanyContactInfoComponent) custCompanyContactInfoComponent: NewNapCustCompanyContactInfoComponent;
  @ViewChild(NewNapCustCompanyFinDataComponent) custCompanyFinDataComponent: NewNapCustCompanyFinDataComponent;
  @ViewChild(NewNapCustCompanyLegalDocComponent) custCompanyLegalDocComponent: NewNapCustCompanyLegalDocComponent;

  @Input() AppId: number;
  @Input() AppCustIdInput: number;
  @Input() custMainDataMode: string;
  @Input() IsMainCustMarried: boolean;

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
  CustAttrRequestFinData: Array<Object>;
  ListAddress: Array<AppCustAddrObj>;
  AppCustBankAccList: Array<AppCustBankAccObj>;
  AppCustCompanyObj: AppCustCompanyObj;
  TempAppCustCompanyContactPersonObj: AppCustCompanyContactPersonObj;
  AppCustCompanyFinData: AppCustCompanyFinDataObj;
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
  AppCustCompanyId: number;
  IsCompletion: boolean;
  IsMarried: boolean;
  AttrGroup: string;
  IsSubmitted: boolean;
  IsDataLoaded: boolean = false;
  IsLoadEmergency: boolean = true;
  custAttrRequest = new Array<Object>();
  ListLegalDoc: Array<AppCustCompanyLegalDocObj>;
  readonly InputAddressObjForCc_Identifier: string = "CcDataAddr";

  //#region FormAppCustMainData
  CustMainDataForm = this.fb.group({
    MrCustModelCode: ['', Validators.required],
    MrCustTypeCode: [],
    MrCustRelationshipCode: ['',Validators.maxLength(50)],
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
    MrEducationCode: ['', Validators.required],
    MrReligionCode: ['', Validators.required],
    VIPNotes: [''],
    CustPrefixName: [''],
    CustSuffixName: [''],
    MrSalutationCode: [''],
    RowVersionAppCust: [''],
    RowVersionAppCustPersonal: ['']
  });

  JobDataForm = this.fb.group({
    MrProfessionCode: [''],
    IndustryTypeCode: [''],
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
    RowVersion: ['']
  });

  EmergencyContactForm = this.fb.group({
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
    CopyAddrFrom: [''],
    RowVersion: ['']
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
  CustDetailFormCompany = this.fb.group({
    NoOfEmployee: ['', Validators.required],
    IsAffiliateWithMF: [false],
    EstablishmentDate: ['', Validators.required],
    IndustryTypeCode: ['', Validators.required],
    MrCustModelCode: ['', Validators.required],
    RowVersionAppCust: [''],
    RowVersionAppCustCompany: ['']
  })

  CcForm = this.fb.group({
    ContactPersonName: ['', Validators.required],
    MrGenderCode: ['', Validators.required],
    JobTitleName: ['', Validators.required],
    MrJobPositionCode: ['', Validators.required],
    MrIdTypeCode: [''],
    IdNo: [''],
    IdExpiredDt: [''],
    BirthPlace: [''],
    BirthDt: [''],
    MrCustRelationshipCode: [''],
    MobilePhnNo1: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    MobilePhnNo2: ['', Validators.pattern("^[0-9]*$")],
    Email1: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
    Email2: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
    PhnArea1: ['', Validators.pattern("^[0-9]*$")],
    PhnArea2: ['', Validators.pattern("^[0-9]*$")],
    Phn1: ['', Validators.pattern("^[0-9]*$")],
    Phn2: ['', Validators.pattern("^[0-9]*$")],
    PhnExt1: ['', Validators.pattern("^[0-9]*$")],
    PhnExt2: ['', Validators.pattern("^[0-9]*$")],
  });

  FinancialFormCompany = this.fb.group({
    AppCustCompanyFinDataId: [0],
    AppCustId: [0],
    GrossMonthlyIncomeAmt: ['', Validators.required],
    ReturnOfInvestmentPrcnt: [0],
    ReturnOfAssetPrcnt: [0],
    CurrentRatioPrcnt: [0],
    InvTurnOverPrcnt: [0],
    GrowthPrcnt: [0],
    OthMonthlyInstAmt: [0],
    Revenue: [0],
    ProfitBeforeTax: [0],
    NetFixedAsset: [0],
    CurrLiablts: [0],
    ShareholderEquity: [0],
    GrossMonthlyExpenseAmt: [0],
    ReturnOfEquityPrcnt: [0],
    ProfitMarginPrcnt: [0],
    DebtEquityRatioPrcnt: [0],
    ArTurnOverPrcnt: [0],
    WorkingCapitalAmt: [0],
    DateAsOf: [''],
    OprCost: [0],
    CurrAsset: [0],
    TotalAsset: [0],
    LongTermLiablts: [0],
    CurrRatio: [0],
    RowVersion: ['']
  })
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
  
  OtherInformationCompanyForm = this.fb.group({
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
    public formValidate: FormValidateService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cookieService: CookieService
  ) { 
    this.custDataPersonalObj = new CustMainDataPersonalObj();
    this.AppCustObj = new AppCustObj();
    this.AppCustPersonalObj = new AppCustPersonalObj();
    this.ListAppCustGrpObj = new Array<AppCustGrpObj>();
    this.inputMode = "ADD";
    this.InputAppCustObjMainData = new Object();
    this.JobDataObj = new AppCustPersonalJobDataObj();
    this.appCustEmrgncCntctObj = new AppCustEmrgncCntctObj();
    this.CustAttrRequestFinData = new Array<Object>();
    this.AppCustPersonalFinData = new AppCustPersonalFinDataObj();
    this.appCustOtherInfo = new AppCustOtherInfoObj();
    this.ListAddress = new Array<AppCustAddrObj>();
    this.outputTab = new EventEmitter<any>();
    this.outputCancel = new EventEmitter<any>();
    this.AppCustBankAccList = new Array<AppCustBankAccObj>();
    this.AppCustCompanyObj = new AppCustCompanyObj();
    this.TempAppCustCompanyContactPersonObj = new AppCustCompanyContactPersonObj();
    this.AppCustCompanyFinData = new AppCustCompanyFinDataObj();
    this.isExisting = false;
    this.isIncludeCustRelation = false;
    this.AppCustPersonalId = 0;
    this.AppCustCompanyId = 0;
    this.IsCompletion = false;
    this.AppCustIdInput = 0;
    this.appCustId = 0;
    this.IsMarried = false;
    this.AttrGroup = CommonConstant.AttrGroupCustPersonalFinData;
    this.custAttrRequest = new Array<Object>();
    this.custMainDataMode = CommonConstant.CustMainDataModeCust;
    this.IsSubmitted = false;
    this.ListLegalDoc = new Array<AppCustCompanyLegalDocObj>();
  }

  ngOnInit() {
    var userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
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
              await this.http.post<ResponseAppCustCompletionPersonalDataObj>(URLConstant.GetAppCustAndAppCustPersonalDataByAppCustId, {Id: this.AppCustIdInput}).toPromise().then(
                (response) => {
                  if(response.AppCustPersonalObj.MrMaritalStatCode != null && response.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried)
                  {
                    this.IsMarried = true;
                  }
                  this.CustModelCode = response.AppCustObj.MrCustModelCode;
                  this.AppCustPersonalId = response.AppCustPersonalObj.AppCustPersonalId;
                  this.IsCompletion = response.AppCustObj.IsCompletion;
                }
              );
            }
            else{
              await this.http.post<ResponseAppCustCompletionCompanyDataObj>(URLConstant.GetAppCustAndAppCustCompanyDataByAppCustId, {AppCustId: this.AppCustIdInput}).toPromise().then(
                (response) => {
                  this.AppCustCompanyId = response.AppCustCompanyObj.AppCustCompanyId;
                }
              );
            }
          }
          else{
            this.inputMode = "ADD";
          }
          this.IsDataLoaded = true;
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }else{
      this.IsDataLoaded = true;
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
    this.IsSubmitted = false;
  }

  MainDataCustIsExistingHandler(e){
    this.isExisting = e;
  }

  IsMarriedHandler(e: boolean){
    this.IsMarried = e;
    this.custPersonalEmergencyComponent.CheckIsMarried(this.IsMarried);
  }

  GetExistingCustHandler(e: ResponseCustPersonalForCopyObj){
    this.custPersonalFullDataComponent.CopyExistingCust(e.CustObj, e.CustPersonalObj, e.CustGrpObjs);
    this.custAddrComponent.LoadListCustAddress(e.CustAddrObjs);
    this.ListAddress = e.CustAddrObjs;

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NewNapCustPersonalJobComponent);
    this.personalJobContainer.clear();
    const component = this.personalJobContainer.createComponent(componentFactory);
    component.instance.IsJobSubmitted = this.IsSubmitted;
    component.instance.ParentForm = this.JobDataForm;
    component.instance.appId = this.AppId;
    component.instance.AppCustId = this.AppCustIdInput;
    component.instance.CustModelCode = this.CustModelCode;
    component.instance.IsCopy = true;
    component.instance.CustPersonalJobData = e.CustPersonalJobDataObj;

    this.custPersonalEmergencyComponent.CopyCustomerEmergency(e.CustPersonalEmergencyContactObj);
    this.custPersonalFinancialComponent.CopyCustomerFinData(e.CustPersonalFinDataObj, e.CustBankAccObjs, e.CustAttrContentObjs.NewCustAttrContentObjs);
    this.AppCustBankAccList = e.CustBankAccObjs;
    this.otherInfoComponent.CopyCustOtherInfo(e.CustOtherInfoObj, e.CustAttrContentObjs.NewCustAttrContentObjs);
  }

  GetExistingCustHandlerCompany(e){
    this.custCompanyFullDataComponent.CopyCustCompanyFullData(e.CustObj, e.CustCompanyObj, e.CustGrpObjs);
    this.custAddrComponent.LoadListCustAddress(e.CustAddrObj, false);
    this.ListAddress = e.CustAddrObj;
    this.custCompanyContactInfoComponent.CopyCustCompanyContactPerson(e.CustCompanyContactPersonObjs[0]);
    this.custCompanyFinDataComponent.CopyCustomerFinDataCompany(e.CustCompanyFinDataObj, e.CustBankAccObjs, e.CustAttrContentObjs.NewCustAttrContentObjs);
    this.AppCustBankAccList = e.CustBankAccObjs;
    this.custCompanyLegalDocComponent.CopyCustLegalDoc(e.CustCompanyLegalDocObjs);
    this.ListLegalDoc = e.CustCompanyLegalDocObjs;
    this.otherInfoComponent.CopyCustOtherInfo(e.CustOtherInfoObj, e.CustAttrContentObjs.NewCustAttrContentObjs);
  }

  MainDataCustIsIncludeCustRelation(e){
    this.isIncludeCustRelation = e;
  }

  MainDataCustModel(e){
    this.CustModelCode = e;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NewNapCustPersonalJobComponent);
    this.personalJobContainer.clear();
    const component = this.personalJobContainer.createComponent(componentFactory);
    component.instance.IsJobSubmitted = this.IsSubmitted;
    component.instance.ParentForm = this.JobDataForm;
    component.instance.appId = this.AppId;
    component.instance.AppCustId = this.AppCustIdInput;
    component.instance.CustModelCode = this.CustModelCode;
    component.instance.IsCopy = false;
    component.instance.CustPersonalJobData = new AppCustPersonalJobDataObj();
    this.JobDataForm.patchValue({
      MrProfessionCode: '',
      IndustryTypeCode: '',
      CoyName: '',
      MrJobPositionCode: '',
      MrJobStatCode: '',
      MrCoyScaleCode: '',
      EmploymentEstablishmentDt: null,
      NumOfEmployee: '',
      JobTitleName: '',
      IsMfEmp: false,
      MrInvestmentTypeCode: '',
      ProfessionalNo: '',
      PrevCoyName: '',
      PrevEmploymentDt: null,
      OthBizName: '',
      OthBizType: '',
      OthBizIndustryTypeCode: '',
      OthBizJobPosition: '',
      OthBizEstablishmentDt: null,
      JobNotes: '',
      PrevJobNotes: '',
      OthBizNotes: '',
    });
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
    this.custDataPersonalObj.AppCustObj.IsCompletion = true;
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


    if (this.custDataPersonalObj.AppCustObj.IsShareholder) {
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MrJobPositionCode = this.CustMainDataForm.controls.MrJobPositionCode.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.SharePrcnt = this.CustMainDataForm.controls.SharePrcnt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsSigner = this.CustMainDataForm.controls.IsSigner.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.CustMainDataForm.controls.RowVersionShareholder.value;
    }

    this.custDataPersonalObj.AppCustObj.RowVersion = this.CustDetailForm.controls.RowVersionAppCust.value;
    this.custDataPersonalObj.AppCustPersonalObj.RowVersion = this.CustDetailForm.controls.RowVersionAppCustPersonal.value;
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
    this.custDataCompanyObj.AppCustObj.IsCompletion = true;
    this.custDataCompanyObj.AppCustObj.AppId = this.AppId;
    this.custDataCompanyObj.AppCustObj.IsExistingCust = this.isExisting;
    this.custDataCompanyObj.AppCustObj.AppCustId = this.appCustId != null ? this.appCustId : 0;
    this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.AppCustId = this.appCustId != null ? this.appCustId : 0;

    if (this.isIncludeCustRelation)
      this.custDataCompanyObj.AppCustObj.MrCustRelationshipCode = this.CustMainDataForm.controls.MrCustRelationshipCode.value;

    this.custDataCompanyObj.AppCustCompanyObj.CompanyBrandName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataCompanyObj.AppCustCompanyObj.MrCompanyTypeCode = this.CustMainDataForm.controls.MrCompanyTypeCode.value;

    if (this.custDataCompanyObj.AppCustObj.IsShareholder) {
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.SharePrcnt = this.CustMainDataForm.controls.SharePrcnt.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsSigner = this.CustMainDataForm.controls.IsSigner.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.CustMainDataForm.controls.RowVersionShareholder.value;
    }

    this.custDataCompanyObj.AppCustObj.RowVersion = this.CustDetailFormCompany.controls.RowVersionAppCust.value;
    this.custDataCompanyObj.AppCustCompanyObj.RowVersion = this.CustDetailFormCompany.controls.RowVersionAppCustCompany.value;
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
    this.ListAddress = e.ListAddress;

    if(this.ListAddress != null && this.ListAddress.length > 0){
      this.EmergencyContactForm.patchValue({ CopyAddrFrom: this.ListAddress[0].MrCustAddrTypeCode });
    }
  }
  //#endregion

  //#region CustPersonalJobData
  SetAppCustPersonalJobData(){
    if(this.CustMainDataForm.controls.MrCustModelCode.value == CommonConstant.CustModelEmployee){
      this.JobDataObj.MrProfessionCode = this.JobDataForm.controls.MrProfessionCode.value;
      this.JobDataObj.IndustryTypeCode = this.JobDataForm.controls.IndustryTypeCode.value;
      this.JobDataObj.CoyName = this.JobDataForm.controls.CoyName.value;
      this.JobDataObj.EmploymentEstablishmentDt = this.JobDataForm.controls.EmploymentEstablishmentDt.value;
      this.JobDataObj.MrJobPositionCode = this.JobDataForm.controls.MrJobPositionCode.value;
      this.JobDataObj.MrCoyScaleCode = this.JobDataForm.controls.MrCoyScaleCode.value;
      this.JobDataObj.JobTitleName = this.JobDataForm.controls.JobTitleName.value;
      this.JobDataObj.NumOfEmployee = this.JobDataForm.controls.NumOfEmployee.value;
      this.JobDataObj.MrJobStatCode = this.JobDataForm.controls.MrJobStatCode.value;
      this.JobDataObj.IsMfEmp = this.JobDataForm.controls.IsMfEmp.value;
      this.JobDataObj.PrevCoyName = this.JobDataForm.controls.PrevCoyName.value;
      this.JobDataObj.PrevEmploymentDt = this.JobDataForm.controls.PrevEmploymentDt.value;
      this.JobDataObj.OthBizName = this.JobDataForm.controls.OthBizName.value;
      this.JobDataObj.OthBizType = this.JobDataForm.controls.OthBizType.value;
      this.JobDataObj.OthBizIndustryTypeCode = this.JobDataForm.controls.OthBizIndustryTypeCode.value;
      this.JobDataObj.OthBizJobPosition = this.JobDataForm.controls.OthBizJobPosition.value;
      this.JobDataObj.OthBizEstablishmentDt = this.JobDataForm.controls.OthBizEstablishmentDt.value;
    }

    if(this.CustMainDataForm.controls.MrCustModelCode.value == CommonConstant.CustModelProfessional){
      this.JobDataObj.MrProfessionCode = this.JobDataForm.controls.MrProfessionCode.value;
      this.JobDataObj.IndustryTypeCode = this.JobDataForm.controls.IndustryTypeCode.value;
      this.JobDataObj.ProfessionalNo = this.JobDataForm.controls.ProfessionalNo.value;
      this.JobDataObj.EmploymentEstablishmentDt = this.JobDataForm.controls.EmploymentEstablishmentDt.value;
      this.JobDataObj.JobTitleName = this.JobDataForm.controls.JobTitleName.value;
      this.JobDataObj.PrevCoyName = this.JobDataForm.controls.PrevCoyName.value;
      this.JobDataObj.PrevEmploymentDt = this.JobDataForm.controls.PrevEmploymentDt.value;
      this.JobDataObj.OthBizName = this.JobDataForm.controls.OthBizName.value;
      this.JobDataObj.OthBizType = this.JobDataForm.controls.OthBizType.value;
      this.JobDataObj.OthBizIndustryTypeCode = this.JobDataForm.controls.OthBizIndustryTypeCode.value;
      this.JobDataObj.OthBizJobPosition = this.JobDataForm.controls.OthBizJobPosition.value;
      this.JobDataObj.OthBizEstablishmentDt = this.JobDataForm.controls.OthBizEstablishmentDt.value;
    }

    if(this.CustMainDataForm.controls.MrCustModelCode.value == CommonConstant.CustModelSmallMediumEnterprise){
      this.JobDataObj.MrProfessionCode = this.JobDataForm.controls.MrProfessionCode.value;
      this.JobDataObj.IndustryTypeCode = this.JobDataForm.controls.IndustryTypeCode.value;
      this.JobDataObj.CoyName = this.JobDataForm.controls.CoyName.value;
      this.JobDataObj.EmploymentEstablishmentDt = this.JobDataForm.controls.EmploymentEstablishmentDt.value;
      this.JobDataObj.MrJobPositionCode = this.JobDataForm.controls.MrJobPositionCode.value;
      this.JobDataObj.MrCoyScaleCode = this.JobDataForm.controls.MrCoyScaleCode.value;
      this.JobDataObj.JobTitleName = this.JobDataForm.controls.JobTitleName.value;
      this.JobDataObj.NumOfEmployee = this.JobDataForm.controls.NumOfEmployee.value;
      this.JobDataObj.MrInvestmentTypeCode = this.JobDataForm.controls.MrInvestmentTypeCode.value;
      this.JobDataObj.PrevCoyName = this.JobDataForm.controls.PrevCoyName.value;
      this.JobDataObj.PrevEmploymentDt = this.JobDataForm.controls.PrevEmploymentDt.value;
      this.JobDataObj.OthBizName = this.JobDataForm.controls.OthBizName.value;
      this.JobDataObj.OthBizType = this.JobDataForm.controls.OthBizType.value;
      this.JobDataObj.OthBizIndustryTypeCode = this.JobDataForm.controls.OthBizIndustryTypeCode.value;
      this.JobDataObj.OthBizJobPosition = this.JobDataForm.controls.OthBizJobPosition.value;
      this.JobDataObj.OthBizEstablishmentDt = this.JobDataForm.controls.OthBizEstablishmentDt.value;
    }

    if(this.CustMainDataForm.controls.MrCustModelCode.value == CommonConstant.CustModelNonProfessional){
      this.JobDataObj.MrProfessionCode = this.JobDataForm.controls.MrProfessionCode.value;
    }
    
    this.JobDataObj.RowVersion = this.JobDataForm.controls.RowVersion.value;
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
    this.appCustEmrgncCntctObj.RowVersion = this.EmergencyContactForm.controls.RowVersion.value;
  }
  //#endregion

  //#region CustPersonalFinData
  SetAttrContentFinData(){
    var formValue = this.PersonalFinancialForm['controls']['AttrList'].value;
    this.CustAttrRequestFinData = new Array<Object>();
     
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
          this.CustAttrRequestFinData.push(custAttr);
        }
      }  
    }
  }

  GetPersonalBankAcc(e){
    this.AppCustBankAccList = e;
  }
  //#endregion

  //#region OtherInfo
  GetAppCustOtherInfo(e){
    this.ResponseCustOtherInfo = e;
  }

  setAttrContent(){
    var formValue;

    if(this.MrCustTypeCode == CommonConstant.CustTypePersonal){
      formValue = this.OtherInformationForm['controls']['AttrList'].value;
    }else{
      formValue = this.OtherInformationCompanyForm['controls']['AttrList'].value;
    }
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
    if(this.MrCustTypeCode == CommonConstant.CustTypePersonal){
      this.appCustOtherInfo.LbppmsBizSclLbppCode = this.OtherInformationForm.controls.LbppmsBizSclLbppCode.value;
      this.appCustOtherInfo.LbppmsBizSustainLbppCode = this.OtherInformationForm.controls.LbppmsBizSustainLbppCode.value;
      this.appCustOtherInfo.LbppmsCntrprtLbppCode = this.OtherInformationForm.controls.LbppmsCntrprtLbppCode.value;
      this.appCustOtherInfo.LbppmsDebtGrpLbppCode = this.OtherInformationForm.controls.LbppmsDebtGrpLbppCode.value;
      this.appCustOtherInfo.LbppmsCntrprtLbppDescr = this.OtherInformationForm.controls.LbppmsCntrprtLbppDescr.value;
      this.appCustOtherInfo.LbppmsDebtGrpLbppDescr = this.OtherInformationForm.controls.LbppmsDebtGrpLbppDescr.value;
      this.appCustOtherInfo.LbppmsBizSustainLbppDescr = this.OtherInformationForm.controls.LbppmsBizSustainLbppDescr.value;
      this.appCustOtherInfo.LbppmsBizSclLbppDescr = this.OtherInformationForm.controls.LbppmsBizSclLbppDescr.value;
    }else{
      this.appCustOtherInfo.LbppmsBizSclLbppCode = this.OtherInformationCompanyForm.controls.LbppmsBizSclLbppCode.value;
      this.appCustOtherInfo.LbppmsBizSustainLbppCode = this.OtherInformationCompanyForm.controls.LbppmsBizSustainLbppCode.value;
      this.appCustOtherInfo.LbppmsCntrprtLbppCode = this.OtherInformationCompanyForm.controls.LbppmsCntrprtLbppCode.value;
      this.appCustOtherInfo.LbppmsDebtGrpLbppCode = this.OtherInformationCompanyForm.controls.LbppmsDebtGrpLbppCode.value;
      this.appCustOtherInfo.LbppmsCntrprtLbppDescr = this.OtherInformationCompanyForm.controls.LbppmsCntrprtLbppDescr.value;
      this.appCustOtherInfo.LbppmsDebtGrpLbppDescr = this.OtherInformationCompanyForm.controls.LbppmsDebtGrpLbppDescr.value;
      this.appCustOtherInfo.LbppmsBizSustainLbppDescr = this.OtherInformationCompanyForm.controls.LbppmsBizSustainLbppDescr.value;
      this.appCustOtherInfo.LbppmsBizSclLbppDescr = this.OtherInformationCompanyForm.controls.LbppmsBizSclLbppDescr.value;
    }
    
  }
  //#endregion

  //#region CustCompanyFullData
  CustCompanyFullDataCustGrpHandler(e){
    this.ListAppCustGrpObj = e;
  }

  SetDataCompanyFullData(){
    this.custDataCompanyObj.AppCustObj.AppCustId = this.AppCustIdInput;
    this.custDataCompanyObj.AppCustObj.MrCustModelCode = this.CustDetailFormCompany.controls.MrCustModelCode.value;
    this.custDataCompanyObj.AppCustObj.IsAffiliateWithMf = this.CustDetailFormCompany.controls.IsAffiliateWithMF.value; 
   
    this.custDataCompanyObj.AppCustCompanyObj.IndustryTypeCode   = this.CustDetailFormCompany.controls.IndustryTypeCode.value;
    this.custDataCompanyObj.AppCustCompanyObj.NumOfEmp = this.CustDetailFormCompany.controls.NoOfEmployee.value;
    this.custDataCompanyObj.AppCustCompanyObj.EstablishmentDt = this.CustDetailFormCompany.controls.EstablishmentDate.value; 
  }

  //#endregion

  //#region CustCompanyContactPerson
  GetTempContactPerson(e){
    this.TempAppCustCompanyContactPersonObj = e;
  }


  CheckDt(inputDate: Date, type: string) {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let MaxDate = formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    let Max17YO = formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    let max17Yodt = new Date(Max17YO);
    let d1 = new Date(inputDate);
    let d2 = new Date(MaxDate);
    max17Yodt.setFullYear(d2.getFullYear() - 17);

    if (type == ExceptionConstant.DateErrorMessageIdExpiredDate) {
      d2.setDate(d2.getDate() - 1);
      if (d1 < d2) {
        throw this.toastr.warningMessage(type + "  can not be less than " + MaxDate);
      }
      return;
    }

    if (d1 > d2) {
      throw this.toastr.warningMessage(type + "  can not be more than " + MaxDate);
    } else if (type == ExceptionConstant.DateErrorMessageBirthDate && d1 > max17Yodt) {
      throw this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
    }
  }

  SetReqAddrObj(obj: any) {
    let TempAddr = obj[this.InputAddressObjForCc_Identifier];
    let TempZipVal = obj[this.InputAddressObjForCc_Identifier + "Zipcode"];

    let ReqAddr: AppCustAddrObj = new AppCustAddrObj();
    ReqAddr.Phn1 = TempAddr.Phn1;
    ReqAddr.Phn2 = TempAddr.Phn2;
    ReqAddr.PhnArea1 = TempAddr.PhnArea1;
    ReqAddr.PhnArea2 = TempAddr.PhnArea2;
    ReqAddr.PhnExt1 = TempAddr.PhnExt1;
    ReqAddr.PhnExt2 = TempAddr.PhnExt2;
    ReqAddr.Addr = TempAddr.Addr;
    ReqAddr.AppCustId = this.AppCustIdInput;
    ReqAddr.AreaCode1 = TempAddr.AreaCode1;
    ReqAddr.AreaCode2 = TempAddr.AreaCode2;
    ReqAddr.AreaCode3 = TempAddr.AreaCode3;
    ReqAddr.AreaCode4 = TempAddr.AreaCode4;
    ReqAddr.City = TempAddr.City;
    ReqAddr.Fax = TempAddr.Fax;
    ReqAddr.FaxArea = TempAddr.FaxArea;
    ReqAddr.MrCustAddrTypeCode = CommonConstant.AddrTypeCompany;
    ReqAddr.MrHouseOwnershipCode = "";
    ReqAddr.Zipcode = TempZipVal.value;
    ReqAddr.SubZipcode = TempAddr.SubZipcode;

    if (this.TempAppCustCompanyContactPersonObj.AppCustCompanyContactPersonId != 0) {
      ReqAddr.AppCustAddrId = this.TempAppCustCompanyContactPersonObj.AppCustAddrObj.AppCustAddrId;
      ReqAddr.RowVersion = this.TempAppCustCompanyContactPersonObj.AppCustAddrObj.RowVersion;
    }

    return ReqAddr;
  }

  SetReqCcObj(obj: any) {
    let ReqCcObj: AppCustCompanyContactPersonObj = new AppCustCompanyContactPersonObj();
    ReqCcObj.AppCustId = this.AppCustIdInput;
    ReqCcObj.AppCustCompanyId = this.TempAppCustCompanyContactPersonObj.AppCustCompanyId;
    ReqCcObj.AppCustCompanyContactPersonId = this.TempAppCustCompanyContactPersonObj.AppCustCompanyContactPersonId;
    ReqCcObj.RowVersion = this.TempAppCustCompanyContactPersonObj.RowVersion;
    ReqCcObj.BirthDt = obj.BirthDt
    if(ReqCcObj.BirthDt != "" && ReqCcObj.BirthDt != null) this.CheckDt(new Date(ReqCcObj.BirthDt), ExceptionConstant.DateErrorMessageBirthDate);
    ReqCcObj.BirthPlace = obj.BirthPlace;
    ReqCcObj.ContactPersonName = obj.ContactPersonName;
    ReqCcObj.Email1 = obj.Email1;
    ReqCcObj.Email2 = obj.Email2;
    ReqCcObj.IdExpiredDt = obj.IdExpiredDt;
    if(ReqCcObj.IdExpiredDt != "" && ReqCcObj.IdExpiredDt != null) this.CheckDt(new Date(ReqCcObj.IdExpiredDt), ExceptionConstant.DateErrorMessageIdExpiredDate);
    ReqCcObj.IdNo = obj.IdNo;
    ReqCcObj.JobTitleName = obj.JobTitleName;
    ReqCcObj.MobilePhnNo1 = obj.MobilePhnNo1;
    ReqCcObj.MobilePhnNo2 = obj.MobilePhnNo2;
    ReqCcObj.MrCustRelationshipCode = obj.MrCustRelationshipCode;
    ReqCcObj.MrGenderCode = obj.MrGenderCode;
    ReqCcObj.MrIdTypeCode = obj.MrIdTypeCode;
    ReqCcObj.MrJobPositionCode = obj.MrJobPositionCode;
    return ReqCcObj;
  }
  //#endregion

  //#region CustCompanyFinData
  GetCompanyBankAcc(e){
    this.AppCustBankAccList = e;
  }

  SetAttrContentFinDataCompany(){
    var formValue = this.FinancialFormCompany['controls']['AttrList'].value;
    this.CustAttrRequestFinData = new Array<Object>();
     
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
        this.CustAttrRequestFinData.push(custAttr);}

      }  
    }
  }
  //#endregion

  //#region CustCompanyLegalDoc
  GetLegalDoc(e){
    this.ListLegalDoc = e;
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
    else{
      if(!this.CustMainDataForm.valid || !this.CustDetailFormCompany.valid || !this.CcForm.valid || 
          !this.FinancialFormCompany.valid || !this.OtherInformationCompanyForm.valid){
        return false;
      }
    }
    
    if(this.CekIsCustomer()) return;
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      let max17Yodt = new Date(this.MaxDate);
      let d1 = new Date(this.CustMainDataForm.controls.BirthDt.value);
      let d2 = new Date(this.MaxDate);
      max17Yodt.setFullYear(d2.getFullYear() - 17);
  
      if (d1 > max17Yodt) {
        this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
        return;
      }
    }
    else{
      let max17Yodt = new Date(this.MaxDate);
      let d1 = new Date(this.CcForm.controls.BirthDt.value);
      let d2 = new Date(this.MaxDate);
      max17Yodt.setFullYear(d2.getFullYear() - 17);

      if (d1 > max17Yodt) {
        this.toastr.warningMessage("Contact Person age must be at least 17 year old");
        return;
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      var addrMessage = "";
      var addrValidation = {Legal: false, Residence: false, Job: false};
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
        if(item.MrCustAddrTypeCode == CommonConstant.AddrTypeJob){
          if(this.CustModelCode != CommonConstant.CustModelNonProfessional){
            addrValidation.Job = true;
          }
        }
      }
      if(this.CustModelCode == CommonConstant.CustModelNonProfessional){
        addrValidation.Job = true;
      }

      if(!addrValidation.Legal){
        addrMessage == "" ? addrMessage += "Legal" : addrMessage += ",Legal";
      }
      if(!addrValidation.Residence){
        addrMessage == "" ? addrMessage += "Residence" : addrMessage += ",Residence";
      }
      if(!addrValidation.Job){
        addrMessage == "" ? addrMessage += "Job" : addrMessage += ",Job";
      }
      
      if(addrMessage){
        this.toastr.warningMessage("Please Add " + addrMessage + " Address");
        return false;
      }

      this.setMainDataCustomerPersonalForSave();
      this.SetDataCustPersonalFullData();
      this.SetAppCustPersonalJobData();
      this.SetAttrContentFinData();
      this.SetAppCustPersonalEmergency();
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
        ListAppCustAttrObj: this.CustAttrRequestFinData,
        AppCustPersonalFinDataObj: this.AppCustPersonalFinData
      };
      let appCustOtherInfoRequest = {
        ListRequestAppCustAttrObject: this.custAttrRequest,
        RequestAppCustOtherInfoObj: this.appCustOtherInfo
      };
      var appCustBankAccRequest = new Array<Object>();
      for (const bank of this.AppCustBankAccList) {
        var obj = new Object();
        var bankAccObj = new AppCustBankAccObj();
        bankAccObj.AppCustBankAccId = bank.AppCustBankAccId;
        bankAccObj.BankCode = bank.BankCode;
        bankAccObj.AppCustId = bank.AppCustId;
        bankAccObj.BankBranch = bank.BankBranch;
        bankAccObj.BankAccName = bank.BankAccName;
        bankAccObj.BankAccNo = bank.BankAccNo;
        bankAccObj.IsDefault = bank.IsDefault;
        bankAccObj.IsActive = bank.IsActive;
        obj["BankAccObj"] = bankAccObj;
        obj["ListBankStmntObj"] = bank.AppCustBankStmntObjs;
        appCustBankAccRequest.push(obj);
      }
      var requestPersonal = {
        AppCustObj: this.custDataPersonalObj.AppCustObj,
        AppCustPersonalObj: this.custDataPersonalObj.AppCustPersonalObj,
        AppCustAddrObjList: this.ListAddress,
        AppCustCompanyMgmntShrholderObj: this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj,
        AppCustGrpObjs: this.ListAppCustGrpObj,
        AppCustPersonalJobDataObj: appCustPersonalJobRequest,
        AppCustEmergency: this.appCustEmrgncCntctObj,
        AppCustPersonalFinData: appCustPersonalFinDataRequest,
        AppCustOtherInfo: appCustOtherInfoRequest,
        AppCustBankAccList: appCustBankAccRequest
      }
      this.http.post(URLConstant.AddEditCustDataPersonal, requestPersonal).toPromise().then(
        (response) => {
          if (response["StatusCode"] == 200) {
            this.toastr.successMessage(response["message"]);
            this.outputTab.emit(this.custDataPersonalObj.AppCustPersonalObj);
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
      var addrMessage = "";
      var addrValidationCompany = {Legal: false, Company: false};
      for (const item of this.ListAddress) {
        switch (item.MrCustAddrTypeCode) {
          case CommonConstant.AddrTypeLegal:
            addrValidationCompany.Legal = true;
            break;
          case CommonConstant.AddrTypeCompany:
            addrValidationCompany.Company = true;
            break;
          default:
            break;
        }
      }

      if(!addrValidationCompany.Legal){
        addrMessage == "" ? addrMessage += "Legal" : addrMessage += ",Legal";
      }
      if(!addrValidationCompany.Company){
        addrMessage == "" ? addrMessage += "Company" : addrMessage += ",Company";
      }
      
      if(addrMessage){
        this.toastr.warningMessage("Please Add " + addrMessage + " Address");
        return false;
      }

      if(this.ListLegalDoc.length < 1){
        this.toastr.warningMessage("Please add at least 1 legal doc");
        return false;
      }

      this.setMainDataCustomerCompanyForSave();
      this.SetDataCompanyFullData();  
      let temp = this.CcForm.getRawValue();
      let requestContactInfo = this.SetReqCcObj(temp);
      this.SetAttrContentFinDataCompany();
      this.AppCustCompanyFinData = this.FinancialFormCompany.value;
      this.AppCustCompanyFinData.GrossProfitAmt = this.AppCustCompanyFinData.GrossMonthlyIncomeAmt - this.AppCustCompanyFinData.GrossMonthlyExpenseAmt;
      this.AppCustCompanyFinData.AppCustId = this.AppCustIdInput;
      let requestAppCustCompanyFinData = {
        ListAppCustAttrObj: this.CustAttrRequestFinData,
        AppCustCompanyFinDataObj: this.AppCustCompanyFinData
      }
      var appCustBankAccRequest = new Array<Object>();
      for (const bank of this.AppCustBankAccList) {
        var obj = new Object();
        var bankAccObj = new AppCustBankAccObj();
        bankAccObj.AppCustBankAccId = bank.AppCustBankAccId;
        bankAccObj.AppCustId = bank.AppCustId;
        bankAccObj.BankCode = bank.BankCode;
        bankAccObj.BankBranch = bank.BankBranch;
        bankAccObj.BankAccName = bank.BankAccName;
        bankAccObj.BankAccNo = bank.BankAccNo;
        bankAccObj.IsDefault = bank.IsDefault;
        bankAccObj.IsActive = bank.IsActive;
        obj["BankAccObj"] = bankAccObj;
        obj["ListBankStmntObj"] = bank.AppCustBankStmntObjs;
        appCustBankAccRequest.push(obj);
      }
      this.setAttrContent();
      this.setAppCustOtherInfoData();
      let appCustOtherInfoRequest = {
        ListRequestAppCustAttrObject: this.custAttrRequest,
        RequestAppCustOtherInfoObj: this.appCustOtherInfo
      };
      let requestCompany={
        AppCustObj: this.custDataCompanyObj.AppCustObj, 
        AppCustCompanyObj: this.custDataCompanyObj.AppCustCompanyObj,
        AppCustCompanyMgmntShrholderObj: this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj,
        AppCustGrpObjs: this.ListAppCustGrpObj,
        AppCustAddrObjList: this.ListAddress,
        AppCustCompanyContactPersonObj: requestContactInfo,
        AppCustCompanyFinDataObj: requestAppCustCompanyFinData,
        AppCustBankAccList: appCustBankAccRequest,
        AppCustCompanyLegalDocList: this.ListLegalDoc,
        AppCustOtherInfo: appCustOtherInfoRequest
      };

      this.http.post(URLConstant.AddEditCustDataCompany, requestCompany).toPromise().then(
        (response) => {
          if (response["StatusCode"] == 200) {
            this.toastr.successMessage(response["message"]);
            this.outputTab.emit(this.custDataCompanyObj.AppCustObj);
          }
          else {
            response["ErrorMessages"].forEach((message: string) => {
              this.toastr.errorMessage(message["Message"]);
            });
          }
        },
        error => {
          console.log(error);
        });
      
    }
  }
}
