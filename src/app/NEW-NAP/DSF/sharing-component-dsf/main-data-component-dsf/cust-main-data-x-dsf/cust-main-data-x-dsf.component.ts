import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormArray } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate, KeyValue } from '@angular/common';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { RegexService } from 'app/shared/services/regex.services';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { AppObj } from 'app/shared/model/App/App.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { CustSetData } from 'app/NEW-NAP/sharing-component/main-data-component/components/CustSetData.Service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CustAttrFormComponent } from 'app/NEW-NAP/sharing-component/main-data-component/components/cust-attr-form/cust-attr-form.component';
import { AgrParentObjX } from 'app/impl/shared/model/Response/AgrParentObjX.model';
import { ExceptionConstantX } from 'app/impl/shared/constant/ExceptionConstantX';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CustDataObj } from 'app/shared/model/cust-data-obj.model';
import { CustMainDataPersonalObj } from 'app/shared/model/cust-main-data-personal-obj.model';
import { CustMainDataCompanyObj } from 'app/shared/model/cust-main-data-company-obj.model';
import { AgrmntMasterXObj } from 'app/shared/model/agrmnt-master-x-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { CustomPatternObj } from 'app/shared/model/custom-pattern-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/response-app-cust-main-data-obj.model';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RefProfessionObj } from 'app/shared/model/ref-profession-obj.model';
import { ResListKeyValueObj } from 'app/shared/model/response/generic/res-list-key-value-obj.model';
import { ResponseCustPersonalForCopyObj } from 'app/shared/model/response-cust-personal-for-copy-obj.model';
import { ResponseCustCompanyForCopyObj } from 'app/shared/model/response-cust-company-for-copy-obj.model';
import { ResGetAppCustAddrByAppIdAndAddrTypeCodeObj } from 'app/shared/model/response/nap/cust-main-data/res-get-app-cust-addr-by-app-id-and-addr-type-code-obj.model';
import { AppCustCompanyMgmntShrholderObj } from 'app/shared/model/app-cust-company-mgmnt-shrholder-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/app-cust-personal-job-data-obj.model';
import { AppCustAttrContentObj } from 'app/shared/model/app-cust/cust-attr-content/app-cust-attr-content-obj.model';
import { LeadCustObj } from 'app/shared/model/request/lead/lead-cust-obj.model';
import { CustObj } from 'app/shared/model/cust-obj.model';
import { AddressService } from 'app/shared/services/custAddr.service';
import { String } from 'typescript-string-operations';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { CommonConstantDsf } from 'app/dsf/shared/constant/CommonConstantDsf';
import { ExceptionConstantDsf } from 'app/shared/constant/ExceptionConstantDsf';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { ReqAddAppRoleObj } from 'app/shared/model/Request/NAP/new-application/ReqAddAppRoleObj.Model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';

@Component({
  selector: 'app-cust-main-data-x-dsf',
  templateUrl: './cust-main-data-x-dsf.component.html',
  styleUrls: ['./cust-main-data-x-dsf.component.css'],
  providers: [RegexService]
})
export class CustMainDataXDsfComponent implements OnInit {

  private ucLookupExistingCust: UclookupgenericComponent;
  @ViewChild('LookupExistingCust') set content(content: UclookupgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucLookupExistingCust = content;
    }
  }

  private ucLookupExistingCustCoy: UclookupgenericComponent;
  @ViewChild('LookupExistingCustCoy') set contentCoy(contentCoy: UclookupgenericComponent) {
    if (contentCoy) { // initially setter gets called with undefined
      this.ucLookupExistingCustCoy = contentCoy;
    }
  }

  private ucLookupProfession: UclookupgenericComponent;
  @ViewChild('LookupProfession') set contentProf(contentProf: UclookupgenericComponent) {
    if (contentProf) { // initially setter gets called with undefined
      this.ucLookupProfession = contentProf;
    }
  }

  @Input() MrCustTypeCode: string = CommonConstant.CustTypePersonal;
  @Input() custMainDataMode: string;
  @Input() appId: number;
  @Input() ParentAppCustCompanyId: number = 0;
  @Input() AppCustCompanyMgmntShrholderId: number = 0;
  @Input() appCustId: number = 0;
  @Input() bizTemplateCode: string = "";
  @Input() inputMode: string = "ADD";
  @Input() isMarried: boolean = false;
  @Output() outputAfterSave: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Input() from: string;
  @Input() tempTotalSharePrct: number = 0;
  @Input() critCust: Array<string> = new Array<string>();
  @Input() critCustCompany: Array<string> = new Array<string>();
  @Input() isNonMandatory: boolean = false;
  @Input() isFamily: boolean = false;
  @Input() isEditNap1: boolean = false;

  LeadId: number;
  LeadNo: string;
  CountryCode: string = "";
  CountryName: string = "";
  AppNo: string;

  agrmntParentNo: string = "";
  IsCustAllowedContinue: boolean = true;
  isExisting: boolean = false;
  isUcAddressReady: boolean = false;
  isIncludeCustRelation: boolean = false;
  isDdlMrCustRelationshipReady: boolean = false;
  isDdlMrGenderReady: boolean = false;
  isDdlMrCompanyTypeReady: boolean = false;
  isDdlIdTypeReady: boolean = false;
  isDdlMaritalStatReady: boolean = false;
  isDdlMrCustModelReady: boolean = false;
  isDdlMasterJobPositionReady: boolean = false;
  subjectTitle: string = 'Customer';
  MaritalStatLookup: string = "";
  MaxDate: Date;
  minCustPerAge: number;
  maxCustPerAge: number;
  minCustPerAgeDt: Date;
  maxCustPerAgeDt: Date;
  positionSlikLookUpObj: InputLookupObj = new InputLookupObj();
  InputLookupCustObj: InputLookupObj = new InputLookupObj();
  InputLookupCustCoyObj: InputLookupObj = new InputLookupObj();
  InputLookupCustGrpObj: InputLookupObj = new InputLookupObj();
  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();
  legalAddrObj: AddrObj = new AddrObj();
  IdTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  DictRefMaster: Array<KeyValueObj> = new Array<KeyValueObj>();
  ddlMrCustRelationshipCodeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlGenderObj: UcDropdownListObj = new UcDropdownListObj();
  ddlMrCompanyTypeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlIdTypeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlMaritalStatObj: UcDropdownListObj = new UcDropdownListObj();
  ddlMasterJobPositionObj: UcDropdownListObj = new UcDropdownListObj();
  MrCustRelationshipCodeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  ddlCustModelObj: UcDropdownListObj = new UcDropdownListObj();
  CustModelObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  ArrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  UserAccess: Object;
  custDataObj: CustDataObj;
  custDataPersonalObj: CustMainDataPersonalObj;
  custDataCompanyObj: CustMainDataCompanyObj;
  agrmntMasterXObj: AgrmntMasterXObj;
  rowVersionAppCust: string;
  rowVersionAppCustPersonal: string[];
  rowVersionAppCustCompany: string[];
  rowVersionAppCustAddr: string[];
  rowVersionMgmntShrholder: string[];
  custModelReqObj: ReqRefMasterByTypeCodeAndMappingCodeObj;
  MaxDateEmpEstblshmntDt: Date;
  MaxDtEmpEstblshmntDtValidate: string;
  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  readonly MasterGender = CommonConstant.RefMasterTypeCodeGender;
  MasterCustType: string = "";
  readonly MasterMaritalStat = CommonConstant.RefMasterTypeCodeMaritalStat;
  readonly MasterCompanyType = CommonConstant.RefMasterTypeCodeCompanyType;
  readonly MasterJobPosition = CommonConstant.RefMasterTypeCodeJobPosition;
  readonly CustMainDataMgmntShrholder = CommonConstant.CustMainDataModeMgmntShrholder;
  readonly CustMainDataFamily = CommonConstant.CustMainDataModeFamily;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;
  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypePublic: string = CommonConstant.CustTypePublic;
  readonly AttrGroupCustPersonalOther: string = CommonConstant.AttrGroupCustPersonalOther;
  readonly listAttrCodes: Array<string> = [CommonConstant.AttrCodeDeptAml, CommonConstant.AttrCodeAuthAml];
  MaxDaysThirdPartyChecking: number;
  listAddrRequiredOwnership: Array<string> = new Array();
  LobCode: string;
  checkIsAddressKnown: boolean = false;
  isDisableCustType: boolean = false;
  existShrHolder: boolean = false;
  //Self Custom Changes CR PIC Credit Review
  user: CurrentUserContext;
  //End Self Custom Changes CR PIC Credit Review

  constructor(
    private regexService: RegexService,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    public formValidate: FormValidateService, private cookieService: CookieService,
    private addressService: AddressService) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    })
  }

  CustMainDataForm = this.fb.group({
    MrCustModelCode: ['', Validators.required],
    MrPositionSlikCode: [''],
    MrProfessionCode: [''],
    MrNationalityCode: [CommonConstant.NationalityLocal],
    WnaCountryCode: [''],
    MrCustRelationshipCode: ['', Validators.maxLength(50)],
    CustNo: [],
    CompanyType: [''],
    CustPrefixName: [''],
    CustSuffixName: [''],
    MrMaritalStatCode: ['', Validators.required],
    MrIdTypeCode: ['', Validators.required],
    IdNo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    IdExpiredDt: [''],
    TaxIdNo: ['', [Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
    MrGenderCode: ['', Validators.required],
    BirthPlace: ['', Validators.required],
    BirthDt: ['', Validators.required],
    MotherMaidenName: [''],
    MrCompanyTypeCode: [''],
    MobilePhnNo1: ['', [Validators.pattern("^[0-9]+$")]],
    Email1: ['', [Validators.pattern(CommonConstant.regexEmail)]],
    MrJobPositionCode: [''],
    EstablishmentDt: [''],
    EmploymentEstablishmentDt: [''],
    SharePrcnt: [0, [Validators.min(0.00), Validators.max(100.00)]],
    IsSigner: [false],
    IsActive: [false],
    IsOwner: [false],
    CustName: [""],
    Address: this.fb.group({
      Addr: ['-'],
      AreaCode1: [''],
      AreaCode2: [''],
      AreaCode3: [''],
      AreaCode4: [''],
      City: [''],
      SubZipcode: [''],
      MrHouseOwnershipCode: [''],
    }),
    AddressZipcode: this.fb.group({
      value: [''],
    }),
    isForeigner : [false]
  });

  readonly RefMasterTypeCodeNationality: string = CommonConstant.RefMasterTypeCodeNationality;
  DictUcDDLObj: { [id: string]: UcDropdownListObj } = {};
  async ngOnInit() {
    var AppObj = {
      Id: this.appId
    }

    await this.http.post<AppObj>(URLConstant.GetAppById, AppObj).toPromise().then(
      async (response) => {
        this.AppNo = response.AppNo;
        this.LobCode = response.LobCode;
      }
    );

    this.checkIsDisableCustType();
    this.customPattern = new Array<CustomPatternObj>();
    this.ddlMrCustRelationshipCodeObj.isSelectOutput = true;
    this.ddlIdTypeObj.isSelectOutput = true;
    this.ddlIdTypeObj.customKey = "MasterCode";
    this.ddlIdTypeObj.customValue = "Descr";
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    //Self Custom Changes CR PIC Credit Review
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    //End Self Custom Changes CR PIC Credit Review
    this.MaxDate = this.UserAccess[CommonConstant.BUSINESS_DT];
    var datePipe = new DatePipe("en-US");
    this.MaxDateEmpEstblshmntDt = new Date(this.UserAccess[CommonConstant.BUSINESS_DT]);
    this.MaxDateEmpEstblshmntDt.setDate(this.MaxDateEmpEstblshmntDt.getDate() - 1);
    this.MaxDtEmpEstblshmntDtValidate = datePipe.transform(this.MaxDateEmpEstblshmntDt, "yyyy-MM-dd");

    this.DictUcDDLObj[this.RefMasterTypeCodeNationality] = CustSetData.initDdlRefMaster(this.RefMasterTypeCodeNationality, null, true);
    if (this.MrCustTypeCode == CommonConstant.CustTypePublic) {
      this.MasterCustType = this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder ? CommonConstant.RefMasterTypeCodeShareholderCustType : CommonConstant.RefMasterTypeCodeCustType;
      await this.GetListActiveRefMaster(this.MasterCustType);
      return;
    }
    await this.initcustMainDataMode();
    await this.setLookup();
    await this.getAddrTypeOwnershipRequired();

    this.ddlCustModelObj.isSelectOutput = true;

    this.legalAddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;
    this.inputAddressObj.showAllPhn = false;
    this.inputAddressObj.showFax = false;
    this.inputAddressObj.showOwnership = true;
    this.inputAddressObj.requiredOwnership = false;
    this.isUcAddressReady = true;

    this.http.post(URLConstant.GetGeneralSettingByCode, { GsCode: CommonConstant.GS_MAX_DAYS_CUST_THIRD_PARTY_CHECK }).toPromise().then(
      (response) => {
        this.MaxDaysThirdPartyChecking = response["GsValue"];
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
    await this.getRefMaster();

    let resp = await this.http.post<AppObj>(URLConstant.GetAppById, { AppId: this.appId }).toPromise()

    let isUseLead = false;
    if (resp.LeadId) {
      this.LeadId = resp.LeadId
      isUseLead = await this.getCustDataByLead();

    }

    if (this.inputMode != 'ADD' && isUseLead == false) {
      await this.getCustMainData();
    }
    await this.SetCustModel();
    this.isAddressIsNull();
    if (this.custMainDataMode != this.CustMainDataFamily || this.MrCustTypeCode != this.CustTypePersonal) {
      this.checkIsAddressKnown = true;
    }

    this.jobPositionLookupObj.isReady = true;
    this.positionSlikLookUpObj.isReady = true;
    this.professionLookUpObj.isReady = true;
    this.lookUpObjCountry.isReady = true;
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) this.PatchCriteriaLookupProfession();
    await this.getMinMaxAgeCustPersonalFromGenSet();

    if(this.MrCustTypeCode == CommonConstant.CustTypePersonal && this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder){
      await this.getGsJobPostIsOwner();
      this.CheckJobPostionIsOwner();
    }
  }

  async getAddrTypeOwnershipRequired(){
    this.listAddrRequiredOwnership = await this.addressService.GetListAddrTypeOwnershipMandatory();
  }

  setOwnership(MrCustAddrTypeCode: string) : boolean {
    if(this.listAddrRequiredOwnership.find(addrType => addrType == MrCustAddrTypeCode)){
      return true;
    }
    return false;
  }

  //#region Country
  lookUpObjCountry: InputLookupObj = new InputLookupObj();
  async BindLookupCountry() {
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeDefLocalNationality }).toPromise().then(
      (response: GeneralSettingObj) => {
        this.lookUpObjCountry = new InputLookupObj();
        this.lookUpObjCountry.urlJson = "./assets/uclookup/lookupCustomerCountry.json";
        this.lookUpObjCountry.pagingJson = "./assets/uclookup/lookupCustomerCountry.json";
        this.lookUpObjCountry.genericJson = "./assets/uclookup/lookupCustomerCountry.json";
        this.lookUpObjCountry.isRequired = false;

        let splitCodeDesc = response.GsValue.split(';');
        this.CountryCode = splitCodeDesc[0];
        this.CountryName = splitCodeDesc[1];
        let criteriaList = new Array();
        let criteriaObj = new CriteriaObj();
        criteriaObj.restriction = AdInsConstant.RestrictionNeq;
        criteriaObj.propName = 'COUNTRY_CODE';
        criteriaObj.value = this.CountryCode;
        criteriaList.push(criteriaObj);
        this.lookUpObjCountry.addCritInput = criteriaList;
        this.IsLocal = true;
      }
    );
  }

  ListNationality: Array<RefMasterObj> = new Array();
  GetListRefCountry() {
    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodeNationality }).subscribe(
      (response) => {
        this.ListNationality = response["RefMasterObjs"];
      }
    );
  }

  GetRefCountry(code: string, isLocal: boolean = false) {
    this.http.post(URLConstant.GetRefCountryByCountryCode, { Code: code }).subscribe(
      (response) => {
        if (isLocal) {
          this.CountryName = response["CountryName"];
          this.IsLocal = true;
        }
        else {
          this.IsLocal = false;
          this.lookUpObjCountry.nameSelect = response["CountryName"];
          this.lookUpObjCountry.jsonSelect = response;
        }
      }
    );
  }

  getLookUpCountry(ev) {
    this.CustMainDataForm.patchValue({
      WnaCountryCode: ev.CountryCode,
    });
  }

  IsLocal: boolean = true;
  onOptionsNationality(event: { selectedIndex: number, selectedObj: KeyValueObj, selectedValue: string }) {
    if (event.selectedValue == CommonConstant.NationalityLocal) {
      this.IsLocal = true;
      this.lookUpObjCountry.isRequired = false;
    } else {
      this.IsLocal = false;
      this.lookUpObjCountry.isRequired = true;
    }
  }
  //#endregion

  isCopyBtnLock: boolean = false;
  async initcustMainDataMode() {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    if (!this.isNonMandatory) {
      this.CustMainDataForm.controls.MobilePhnNo1.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.CustMainDataForm.controls.MotherMaidenName.setValidators(Validators.required)
    }
    if (this.isFamily) {
      this.CustMainDataForm.controls.MotherMaidenName.setValidators(null);
    }
    if (this.appCustId) this.custDataObj.AppCustId = this.appCustId;

    switch (this.custMainDataMode) {
      case CommonConstant.CustMainDataModeCust:
        this.isCopyBtnLock = true;
        this.isIncludeCustRelation = false;
        this.custDataObj.IsCustomer = true;
        this.subjectTitle = this.bizTemplateCode == CommonConstant.FL4W ? 'Lessee' : 'Customer';
        this.CustMainDataForm.controls.MrCustRelationshipCode.clearValidators();
        this.CustMainDataForm.controls.MrCustRelationshipCode.updateValueAndValidity();
        break;
      case CommonConstant.CustMainDataModeGuarantor:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsGuarantor = true;
        this.subjectTitle = 'Guarantor';
        this.CustMainDataForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        this.CustMainDataForm.controls.MrGenderCode.setValidators(Validators.required);
        this.CustMainDataForm.controls.MrCustRelationshipCode.updateValueAndValidity();
        this.CustMainDataForm.controls.MrGenderCode.updateValueAndValidity();
        await this.GetAppCustMainDataByAppId();
        break;
      case CommonConstant.CustMainDataModeFamily:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsFamily = true;
        this.subjectTitle = 'Family';
        this.CustMainDataForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        this.CustMainDataForm.controls.MrGenderCode.setValidators(Validators.required);
        this.CustMainDataForm.controls.MrCustRelationshipCode.updateValueAndValidity();
        this.CustMainDataForm.controls.MrGenderCode.updateValueAndValidity();
        await this.GetAppCustMainDataByAppId();
        this.BindLookupJobPosition();
        this.BindLookupProfession();
        await this.BindLookupCountry();
        this.GetListRefCountry();
        break;
      case CommonConstant.CustMainDataModeMgmntShrholder:
        this.isIncludeCustRelation = false;
        this.custDataObj.IsShareholder = true;
        this.subjectTitle = 'Shareholder';
        this.CustMainDataForm.controls.MrPositionSlikCode.setValidators([Validators.required]);
        this.CustMainDataForm.controls.MrPositionSlikCode.updateValueAndValidity();
        /*START X DSF Issue Non Jira, Syafiudin : Disamakan dengan FSD DSF bagian Shareholder => START WORKING DATE tidak mandatory
        if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
          //note: dari html cmn company yang ditampilkan
          this.CustMainDataForm.controls.EstablishmentDt.setValidators([Validators.required]);
          this.CustMainDataForm.controls.EstablishmentDt.updateValueAndValidity();
          this.CustMainDataForm.controls.MrMaritalStatCode.clearValidators();
          this.CustMainDataForm.controls.MrMaritalStatCode.updateValueAndValidity();
        }
        END X DSF Issue Non Jira */
        await this.GetAppCustMainDataByAppId();
        this.BindLookupJobPosition();
        this.BindLookupProfession();
        this.positionSlikLookUpObj = CustSetData.BindLookupPositionSlik();
        break;
      default:
        this.isIncludeCustRelation = false;
        this.subjectTitle = this.bizTemplateCode == CommonConstant.FL4W ? 'Lessee' : 'Customer';
    }
    if (this.isIncludeCustRelation) {
      await this.getCustRelationship();
    }
  }

  jobPositionLookupObj: InputLookupObj = new InputLookupObj();
  BindLookupJobPosition() {
    this.jobPositionLookupObj = new InputLookupObj();
    this.jobPositionLookupObj.isRequired = this.custMainDataMode == this.CustMainDataMgmntShrholder && this.MrCustTypeCode == this.CustTypePersonal ? true : false;
    this.jobPositionLookupObj.urlJson = "./assets/uclookup/customer/lookupJobPosition.json";
    this.jobPositionLookupObj.pagingJson = "./assets/uclookup/customer/lookupJobPosition.json";
    this.jobPositionLookupObj.genericJson = "./assets/uclookup/customer/lookupJobPosition.json";
    this.jobPositionLookupObj.isReady = true;
  }

  professionLookUpObj: InputLookupObj = new InputLookupObj();
  BindLookupProfession() {
    this.professionLookUpObj = new InputLookupObj();
    this.professionLookUpObj.isRequired = false;
    this.professionLookUpObj.urlJson = "./assets/uclookup/customer/lookupCustomerProfession.json";
    this.professionLookUpObj.pagingJson = "./assets/uclookup/customer/lookupCustomerProfession.json";
    this.professionLookUpObj.genericJson = "./assets/uclookup/customer/lookupCustomerProfession.json";
    let listCriteriaObj: Array<CriteriaObj> = new Array();
    let criteriaCustObj = new CriteriaObj();
    criteriaCustObj.DataType = "text";
    criteriaCustObj.restriction = AdInsConstant.RestrictionEq;
    criteriaCustObj.propName = 'MR_CUST_MODEL_CODE';
    criteriaCustObj.value = "";
    listCriteriaObj.push(criteriaCustObj);
    this.professionLookUpObj.addCritInput = listCriteriaObj;
  }

  AppCustData: AppCustObj = new AppCustObj();
  async GetAppCustMainDataByAppId() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.appId;
    await this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, reqObj).toPromise().then(
      async (response) => {
        if (response.AppCustObj) {
          this.AppCustData = response.AppCustObj;
        }
      }
    );
  }

  async setLookup(custType: string = CommonConstant.CustTypePersonal, isChange: boolean = false) {
  	if(this.isEditNap1){
      return;
    }
    if (custType == CommonConstant.CustTypePersonal) {
      this.InputLookupCustObj.isDisable = false;
      this.InputLookupCustCoyObj.isDisable = true;
    } else {
      this.InputLookupCustObj.isDisable = true;
      this.InputLookupCustCoyObj.isDisable = false;
    }
    this.InputLookupCustObj.urlJson = "./assets/uclookup/lookUpExistingCustPersonal.Json";
    this.InputLookupCustObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCustObj.pagingJson = "./assets/uclookup/lookUpExistingCustPersonal.Json";
    this.InputLookupCustObj.genericJson = "./assets/uclookup/lookUpExistingCustPersonal.Json";
    this.InputLookupCustObj.isReadonly = false;
    this.InputLookupCustObj.isRequired = true;

    this.InputLookupCustCoyObj.urlJson = "./assets/uclookup/impl/lookUpExistingCustCompanyX.json";
    this.InputLookupCustCoyObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCustCoyObj.pagingJson = "./assets/uclookup/impl/lookUpExistingCustCompanyX.json";
    this.InputLookupCustCoyObj.genericJson = "./assets/uclookup/impl/lookUpExistingCustCompanyX.json";
    this.InputLookupCustCoyObj.isReadonly = true;

    this.InputLookupCustCoyObj.isRequired = true;
    this.InputLookupCustCoyObj.nameSelect = "";

    this.InputLookupCustGrpObj.urlJson = "./assets/uclookup/lookupCustGrp.json";
    this.InputLookupCustGrpObj.pagingJson = "./assets/uclookup/lookupCustGrp.json";
    this.InputLookupCustGrpObj.genericJson = "./assets/uclookup/lookupCustGrp.json";
    this.InputLookupCustGrpObj.isRequired = false;
    this.InputLookupCustGrpObj.nameSelect = "";

    this.ArrAddCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = "text";
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = custType;

    if(this.critCust.length > 0 && custType == CommonConstant.CustTypePersonal){
      critObj.DataType = "text";
      critObj.propName = 'C.CUST_NO';
      critObj.restriction = AdInsConstant.RestrictionNotIn;
      critObj.listValue = this.critCust;
    }

    if(this.critCustCompany.length > 0 && custType == CommonConstant.CustTypeCompany){
      critObj.DataType = "text";
      critObj.propName = 'C.CUST_NO';
      critObj.restriction = AdInsConstant.RestrictionNotIn;
      critObj.listValue = this.critCustCompany;
    }

    this.ArrAddCrit.push(critObj);

    if(this.custMainDataMode == CommonConstant.CustMainDataModeCust){
      let critObj2 = new CriteriaObj();
      critObj2.DataType = "text";
      critObj2.propName = 'C.IS_CUSTOMER'
      critObj2.restriction = AdInsConstant.RestrictionEq;
      critObj2.value = '1';

      this.ArrAddCrit.push(critObj2);
    }

    this.InputLookupCustObj.addCritInput = this.ArrAddCrit;
    this.InputLookupCustCoyObj.addCritInput = this.ArrAddCrit;

    if (this.bizTemplateCode == CommonConstant.CFNA && this.custMainDataMode == CommonConstant.CustMainDataModeCust)
    {
      let intR2ObjPer: IntegrationObj = new IntegrationObj();
      intR2ObjPer.baseUrl = URLConstantX.R2ApiAgrmntGetListCustNoHaveAgrmntMaster;
      intR2ObjPer.requestObj = { "CustType": "P" };
      intR2ObjPer.leftColumnToJoin = "CustNo";
      intR2ObjPer.rightColumnToJoin = "CustNo";

      this.InputLookupCustObj.urlEnviPaging = environment.FoundationR3Url + "/v2";

      let intR2ObjCoy: IntegrationObj = new IntegrationObj();
      intR2ObjCoy.baseUrl = URLConstantX.R2ApiAgrmntGetListCustNoHaveAgrmntMaster;
      intR2ObjCoy.requestObj = { "CustType": "C" };
      intR2ObjCoy.leftColumnToJoin = "CustNo";
      intR2ObjCoy.rightColumnToJoin = "CustNo";

      this.InputLookupCustCoyObj.urlEnviPaging = environment.FoundationR3Url + "/v2";

      /*
      //Didisable dulu karena kebanyakan data dari sisi R2 nya
      this.InputLookupCustObj.isJoinExAPI = true
      this.InputLookupCustObj.integrationObj = intR2ObjPer;
      this.InputLookupCustCoyObj.isJoinExAPI = true;
      this.InputLookupCustCoyObj.integrationObj = intR2ObjCoy;
      */

      this.disableInput();
    }

    if (isChange) {
      this.ucLookupExistingCust.setAddCritInput();
      this.ucLookupExistingCustCoy.setAddCritInput();
    } else {
      this.InputLookupCustObj.isReady = true;
      this.InputLookupCustCoyObj.isReady = true;
      this.InputLookupCustGrpObj.isReady = true;
      //this.InputLookupAgrmntParentObj.isReady = true;
    }
  }

  async RelationshipChange(relationship: string) {
    let idxMarried = this.DictRefMaster[this.MasterMaritalStat].findIndex(x => x.Key == CommonConstant.MasteCodeMartialStatsMarried);

    if (relationship == CommonConstant.MasteCodeRelationshipSpouse) {
      this.CustMainDataForm.controls.MrMaritalStatCode.patchValue(this.DictRefMaster[this.MasterMaritalStat][idxMarried].Key);
      this.CustMainDataForm.controls.MrMaritalStatCode.disable();
    } else {
      if (this.MaritalStatLookup) this.CustMainDataForm.controls.MrMaritalStatCode.patchValue(this.MaritalStatLookup);
      if (!this.isExisting) this.CustMainDataForm.controls.MrMaritalStatCode.enable();
    }
    this.CustMainDataForm.controls.MrMaritalStatCode.updateValueAndValidity();
    await this.getMinMaxAgeCustPersonalFromGenSet();
  }

  getLookUpSlik(ev: { Code: string, Jabatan: string }) {
    let tempMrPositionSlikCode = this.CustMainDataForm.get("MrPositionSlikCode");
    tempMrPositionSlikCode.patchValue(ev.Code);
    this.CheckJobPostionIsOwner();
  }

  getLookUpJobPosition(ev) {
    this.CustMainDataForm.patchValue({
      MrJobPositionCode: ev.JobCode,
    });
  }

  getLookUpProfession(event: RefProfessionObj) {
    this.CustMainDataForm.patchValue({
      MrProfessionCode: event.ProfessionCode,
    });
    if (this.custMainDataMode == CommonConstant.CustMainDataModeCust) return;
    // this.custAttrForm.SetSearchListInputType(CommonConstant.AttrCodeDeptAml, event.ProfessionCode);
    // this.custAttrForm.ResetValueFromAttrCode(CommonConstant.AttrCodeDeptAml);
  }

  changeCustModel() {
    this.ResetLookupProfession();
  }

  ResetLookupProfession(valueCode: string = null, valueDesc: string = "") {
    this.CustMainDataForm.patchValue({
      MrProfessionCode: valueCode,
    });
    this.professionLookUpObj.nameSelect = valueDesc;
    this.professionLookUpObj.jsonSelect = { JobDesc: valueDesc };
    if (this.custMainDataMode == CommonConstant.CustMainDataModeCust) return;
    // this.custAttrForm.SetSearchListInputType(CommonConstant.AttrCodeDeptAml, valueCode);
    // this.custAttrForm.ResetValueFromAttrCode(CommonConstant.AttrCodeDeptAml);
    this.PatchCriteriaLookupProfession();
  }

  PatchCriteriaLookupProfession() {
    let tempCustModel: string = this.CustMainDataForm.get("MrCustModelCode").value;

    if (tempCustModel != "") {
      let listCriteriaObj: Array<CriteriaObj> = new Array();
      let criteriaCustObj = new CriteriaObj();
      criteriaCustObj.DataType = "text";
      criteriaCustObj.restriction = AdInsConstant.RestrictionEq;
      criteriaCustObj.propName = 'MR_CUST_MODEL_CODE';
      criteriaCustObj.value = tempCustModel;
      listCriteriaObj.push(criteriaCustObj);

      this.professionLookUpObj.addCritInput = listCriteriaObj;
      if (this.ucLookupProfession != undefined) this.ucLookupProfession.setAddCritInput();
    }
  }

  getCustGrpData(event) {
    this.CustMainDataForm.patchValue({
      CustNo: event.CustNo,
      CustName: event.CustName
    });
  }

  async GetListActiveRefMaster(RefMasterTypeCode: string) {
    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: RefMasterTypeCode, MappingCode: null };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, tempReq).toPromise().then(
      (response) => {
        this.DictRefMaster[RefMasterTypeCode] = response[CommonConstant.ReturnObj];
        switch (RefMasterTypeCode) {
          case this.MasterGender:
            this.isDdlMrGenderReady = true;
            break;
          case this.MasterCompanyType:
            this.isDdlMrCompanyTypeReady = true;
            break;
          case this.MasterMaritalStat:
            this.isDdlMaritalStatReady = true;
            break;
          case this.MasterJobPosition:
            this.isDdlMasterJobPositionReady = true;
            break;
          default:
            break;
        }
      });
  }

  async getRefMaster() {
    this.MasterCustType = this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder ? CommonConstant.RefMasterTypeCodeShareholderCustType : CommonConstant.RefMasterTypeCodeCustType;
    await this.GetListActiveRefMaster(this.MasterCustType);
    await this.GetListActiveRefMaster(this.MasterGender);
    await this.GetListActiveRefMaster(this.MasterMaritalStat);
    await this.GetListActiveRefMaster(this.MasterCompanyType);
    await this.GetListActiveRefMaster(this.MasterJobPosition);

    await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodeIdType }).toPromise().then(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        this.isDdlIdTypeReady = true;
        if (this.IdTypeObj.length > 0) {
          let idxDefault = this.IdTypeObj.findIndex(x => x["IsDefaultValue"]);
          this.ChangeIdType(this.IdTypeObj[idxDefault]["MasterCode"]);
          this.getInitPattern();
        }
      });

    if (this.DictRefMaster[this.MasterCustType].length != 0) {
      let custType = this.DictRefMaster[this.MasterCustType][0].Key

      if (this.from == 'SMPLLEAD') {
        this.MrCustTypeCode = CommonConstant.CustTypePersonal;
        this.DictRefMaster[this.MasterCustType] = this.DictRefMaster[this.MasterCustType].filter(x => x.Key == this.MrCustTypeCode);
      }
    }
  }

  async SetCustModel() {
    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel, MappingCode: this.MrCustTypeCode };
    this.CustModelObj = new Array();
    this.isDdlMrCustModelReady = false;
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, tempReq).toPromise().then(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        this.isDdlMrCustModelReady = true;
      }
    );
  }

  async getCustRelationship() {
    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
        var refCustRelObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGuarCompanyRelationship,
          MappingCode: CommonConstant.CustTypePersonal,
        }
      } else {
        var refCustRelObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGuarCompanyRelationship,
          MappingCode: CommonConstant.CustTypeCompany,
        }
      }
      this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, refCustRelObj).subscribe(
        (response) => {
          this.MrCustRelationshipCodeObj = response[CommonConstant.ReturnObj];
          this.isDdlMrCustRelationshipReady = true
        }
      );
    } else {
      let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
      tempReq.RefMasterTypeCode = this.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.RefMasterTypeCodeCustPersonalRelationship : CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
      this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, tempReq).subscribe(
        async (response) => {
          this.MrCustRelationshipCodeObj = response[CommonConstant.ReturnObj];
          if (this.MrCustTypeCode == CommonConstant.CustTypePersonal && !this.isMarried) await this.removeSpouse();
          this.isDdlMrCustRelationshipReady = true
        }
      );
    }
  }

  removeSpouse() {
    let idxSpouse = this.MrCustRelationshipCodeObj.findIndex(x => x.Key == CommonConstant.MasteCodeRelationshipSpouse);
    this.MrCustRelationshipCodeObj.splice(idxSpouse, 1)
  }

  async getCustMainData() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.appCustId;
    //await this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppCustId, reqObj).toPromise().then(
    await this.http.post<ResponseAppCustMainDataObj>(URLConstantX.GetAppCustMainDataByAppCustIdX, reqObj).toPromise().then(
      async (response) => {
        if (response.AppCustObj) {
          this.CustMainDataForm.patchValue({
            CustName: response.AppCustObj.CustName,
          });
          if (!this.appCustId) this.appCustId = response.AppCustObj.AppCustId
          this.MrCustTypeCode = response.AppCustObj.MrCustTypeCode;
          await this.custTypeChange(this.MrCustTypeCode, true);

          if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
            await this.setDataCustomerPersonal(response.AppCustObj, response.AppCustPersonalObj, response.AppCustAddrLegalObj, response.AppCustCompanyMgmntShrholderObj);
            await this.setDataCustPersonalJobData(response.AppCustPersonalJobDataObj);
          }
          else
            await this.setDataCustomerCompany(response.AppCustObj, response.AppCustCompanyObj, response.AppCustAddrLegalObj, response.AppCustCompanyMgmntShrholderObj);

          if (response.AppCustObj.IsExistingCust) {
            this.disableInput();
          }
          this.setValidatorPattern();
        } else {
          this.custTypeChange(CommonConstant.CustTypePersonal, true);
        }

        /*START X DSF Issue Non Jira, Syafiudin : Disamakan dengan FSD DSF bagian Shareholder => START WORKING DATE tidak mandatory
        if (this.MrCustTypeCode == CommonConstant.CustTypePersonal && this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
          //note: dari html cmn company yang ditampilkan
          this.CustMainDataForm.controls.EstablishmentDt.setValidators([Validators.required]);
          this.CustMainDataForm.controls.EstablishmentDt.updateValueAndValidity();
        }
        END X DSF Issue Non Jira*/
      }
    );
  }

  appCustPersonalJobDataRowVersion: string[] = null;
  async setDataCustPersonalJobData(AppCustPersonalJobDataObj: AppCustPersonalJobDataObj) {
    if (!AppCustPersonalJobDataObj) return;
    this.CustMainDataForm.patchValue({
      MrJobPositionCode: AppCustPersonalJobDataObj.MrJobPositionCode,
      MrProfessionCode: AppCustPersonalJobDataObj.MrProfessionCode,
    });

    this.appCustPersonalJobDataRowVersion = AppCustPersonalJobDataObj.RowVersion;
    if (AppCustPersonalJobDataObj.MrJobPositionCode != undefined && AppCustPersonalJobDataObj.MrJobPositionCode != "") {
      let tempDesc: string = await this.PatchValueDesc(AppCustPersonalJobDataObj.MrJobPositionCode, CommonConstant.RefMasterTypeCodeJobPosition);
      this.jobPositionLookupObj.nameSelect = tempDesc;
      this.jobPositionLookupObj.jsonSelect = { JobDesc: tempDesc };
    }

    if (AppCustPersonalJobDataObj.MrProfessionCode !== "") {
      await this.http.post(URLConstant.GetRefProfessionByCode, { Code: AppCustPersonalJobDataObj.MrProfessionCode }).subscribe(
        (response: RefProfessionObj) => {
          this.professionLookUpObj.nameSelect = response.ProfessionName;
          this.professionLookUpObj.jsonSelect = response;
          if (this.custMainDataMode == CommonConstant.CustMainDataModeCust) return;
          //this.custAttrForm.SetSearchListInputType(CommonConstant.AttrCodeDeptAml, AppCustPersonalJobDataObj.MrProfessionCode);
        }
      );
    }

    let datePipe = new DatePipe("en-US");
    this.CustMainDataForm.patchValue({
      EmploymentEstablishmentDt: datePipe.transform(AppCustPersonalJobDataObj.EmploymentEstablishmentDt, 'yyyy-MM-dd'),
    });
  }

  custTypeChange(custType: string = CommonConstant.CustTypePersonal, FirstInit: boolean = false) {
    this.MrCustTypeCode = custType;

    if (!FirstInit) {
      this.custModelReqObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
      this.custModelReqObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustModel;
      this.custModelReqObj.MappingCode = this.MrCustTypeCode;
      this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, this.custModelReqObj).subscribe(
        (response: ResListKeyValueObj) => {
          this.CustModelObj = response[CommonConstant.ReturnObj];
        }
      );
    }

    if (custType == CommonConstant.CustTypePersonal) {
      this.isNonMandatory ? this.CustMainDataForm.controls.MotherMaidenName.setValidators(null) : this.isFamily ? this.CustMainDataForm.controls.MotherMaidenName.setValidators(null) : this.CustMainDataForm.controls.MotherMaidenName.setValidators(Validators.required);
      this.isNonMandatory ? this.CustMainDataForm.controls.MobilePhnNo1.setValidators([Validators.pattern("^[0-9]+$")]) : this.CustMainDataForm.controls.MobilePhnNo1.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.CustMainDataForm.controls.BirthDt.setValidators(Validators.required);
      this.CustMainDataForm.controls.BirthPlace.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrIdTypeCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrGenderCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrMaritalStatCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.IdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      // region IMPORTANT ! email di DSF X tidak mandatory
      this.CustMainDataForm.controls.Email1.setValidators([Validators.pattern(CommonConstant.regexEmail)]);
      // endregion
      this.CustMainDataForm.controls.MrCompanyTypeCode.clearValidators();
      this.CustMainDataForm.controls.MrCompanyTypeCode.updateValueAndValidity();
      this.CustMainDataForm.controls.TaxIdNo.setValidators([Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]);
      this.CustMainDataForm.controls.TaxIdNo.updateValueAndValidity();
    } else {
      if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
        this.CustMainDataForm.patchValue({
          IsSigner: false,
        });
      }
      this.CustMainDataForm.controls.TaxIdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]);
      this.CustMainDataForm.controls.TaxIdNo.updateValueAndValidity();

      this.CustMainDataForm.controls.MrCompanyTypeCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrCompanyTypeCode.updateValueAndValidity();

      this.CustMainDataForm.controls.MotherMaidenName.clearValidators();
      this.CustMainDataForm.controls.BirthPlace.clearValidators();
      this.CustMainDataForm.controls.BirthDt.clearValidators();
      this.CustMainDataForm.controls.MrIdTypeCode.clearValidators();
      this.CustMainDataForm.controls.MrGenderCode.clearValidators();
      this.CustMainDataForm.controls.MrMaritalStatCode.clearValidators();
      this.CustMainDataForm.controls.IdNo.clearValidators();
      this.CustMainDataForm.controls.MobilePhnNo1.clearValidators();
      this.CustMainDataForm.controls.Email1.clearValidators();
    }

    if (this.isIncludeCustRelation) {
      this.getCustRelationship();
      this.CustMainDataForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrCustRelationshipCode.updateValueAndValidity();

    }
    else {
      this.CustMainDataForm.controls.MrCustRelationshipCode.clearValidators();
      this.CustMainDataForm.controls.MrCustRelationshipCode.updateValueAndValidity();
    }

    /*START X DSF Issue Non Jira, Syafiudin : Disamakan dengan FSD DSF bagian Shareholder => START WORKING DATE tidak mandatory
    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      if (custType == CommonConstant.CustTypePersonal) {
        this.CustMainDataForm.controls.EstablishmentDt.setValidators([Validators.required]);
        this.CustMainDataForm.controls.EstablishmentDt.updateValueAndValidity();
      }
    }
    END X DSF Issue Non Jira*/

    this.CustMainDataForm.controls.MotherMaidenName.updateValueAndValidity();
    this.CustMainDataForm.controls.BirthDt.updateValueAndValidity();
    this.CustMainDataForm.controls.BirthPlace.updateValueAndValidity();
    this.CustMainDataForm.controls.MrIdTypeCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MrGenderCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MrMaritalStatCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MrCompanyTypeCode.updateValueAndValidity();
    this.CustMainDataForm.controls.IdNo.updateValueAndValidity();
    this.CustMainDataForm.controls.TaxIdNo.updateValueAndValidity();
    this.CustMainDataForm.controls.MobilePhnNo1.updateValueAndValidity();
    this.CustMainDataForm.controls.Email1.updateValueAndValidity();
    this.setLookup(custType, true);

    if(this.MrCustTypeCode == CommonConstant.CustTypePersonal && (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder || this.custMainDataMode == CommonConstant.CustMainDataModeFamily)){
      this.custAttrForm.GetQuestion();
    }
    else{
      this.custAttrForm.resetForm();
    }
  }

  async copyAgrmntParentEvent(event) {
    var Obj = {
      AgrmntNo: event.AgrmntNo
    }
    this.agrmntParentNo = event.AgrmntNo;
    this.http.post(URLConstant.GetAgrmntByAgrmntNo, Obj).subscribe(
      (response) => {
        this.http.post(URLConstant.GetCustByCustNo, { CustNo: response["CustNo"] }).subscribe(
          (response) => {
            if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
              this.http.post<ResponseCustPersonalForCopyObj>(URLConstant.GetCustPersonalMainDataForCopyByCustId, { CustId: response["CustId"] }).subscribe(
                (response) => {
                  this.setDataCustomerPersonal(response.CustObj, response.CustPersonalObj, response.CustAddrLegalObj, response.CustCompanyMgmntShrholderObj, true);
                });
            } else {
              this.http.post<ResponseCustCompanyForCopyObj>(URLConstant.GetCustCompanyMainDataForCopyByCustId, { CustId: response["CustId"] }).subscribe(
                (response) => {
                  this.setDataCustomerCompany(response.CustObj, response.CustCompanyObj, response.CustAddrLegalObj, response.CustCompanyMgmntShrholderObj, true);
                });
            }
          });
      });

    await this.disableInput();
  }

  async copyCustomerEvent(event) {
    if (this.MrCustTypeCode === CommonConstant.CustTypePersonal) {
      this.http.post<ResponseCustPersonalForCopyObj>(URLConstant.GetCustPersonalMainDataForCopyByCustId, { Id: event.CustId }).toPromise().then(
        (response) => {
          this.setDataCustomerPersonal(response.CustObj, response.CustPersonalObj, response.CustAddrLegalObj, response.CustCompanyMgmntShrholderObj, true);

          if (
            (response.CustAddrLegalObj.AreaCode1 === '' || response.CustAddrLegalObj.AreaCode1 == null || response.CustAddrLegalObj.AreaCode1 == "-") &&
            (response.CustAddrLegalObj.AreaCode2 === '' || response.CustAddrLegalObj.AreaCode2 == null) &&
            (response.CustAddrLegalObj.AreaCode3 === '' || response.CustAddrLegalObj.AreaCode3 == null) &&
            (response.CustAddrLegalObj.AreaCode4 === '' || response.CustAddrLegalObj.AreaCode1 == null) &&
            (response.CustAddrLegalObj.Addr === '' || response.CustAddrLegalObj.Addr == null) &&
            (response.CustAddrLegalObj.City === '' || response.CustAddrLegalObj.City == null)
          ) {
            this.checkIsAddressKnown = false;
          } else {
            this.checkIsAddressKnown = true;
          }
          if (this.custMainDataMode != this.CustMainDataFamily || this.MrCustTypeCode != this.CustTypePersonal) {
            this.checkIsAddressKnown = true;
          }
        });
    } else {
      this.http.post<ResponseCustCompanyForCopyObj>(URLConstant.GetCustCompanyMainDataForCopyByCustId, { Id: event.CustId }).toPromise().then(
        (response) => {
          this.setDataCustomerCompany(response.CustObj, response.CustCompanyObj, response.CustAddrLegalObj, response.CustCompanyMgmntShrholderObj, true);
        });
    }
    await this.disableInput();
  }

  async checkIsCustAllowedContinue()
  {
    if(this.CustMainDataForm.controls.CustNo.value == null)
    {
      this.IsCustAllowedContinue = true;
      return;
    }
    
    await this.http.post(URLConstant.CheckIsNegCustAllowedCreateAppByCustNo, { Code: this.CustMainDataForm.controls.CustNo.value }).toPromise().then(
      (res) => {
        res == undefined? this.IsCustAllowedContinue = false : this.IsCustAllowedContinue = true;
      }
    );
  }
  
  //#region Self Custom Changes CR Validate Negative Customer
  async checkNegativeCustomerFamilyOrShareholder(){
    if(this.CustMainDataForm.controls.CustNo.value == null)
    {
      this.IsCustAllowedContinue = true;
      return;
    }
    
    await this.http.post(URLConstantDsf.CheckIsNegCustAllowedCreateAppDsf, { Code: this.CustMainDataForm.controls.CustNo.value }).toPromise().then(
      (res) => {
        res == undefined? this.IsCustAllowedContinue = false : this.IsCustAllowedContinue = true;
      }
    );
  }
  //#endregion
  ChangeIdType(IdType: string) {
    this.setValidatorPattern();
  }

  CopyAddress() {
    let ReqByIdAndCodeObj = new GenericObj();
    ReqByIdAndCodeObj.Id = this.appId;
    ReqByIdAndCodeObj.Code = CommonConstant.AddrTypeLegal;
    this.http.post(URLConstant.GetAppCustAddrCustomerByAppIdAndMrAddrTypeCode, ReqByIdAndCodeObj).subscribe(
      (response: ResGetAppCustAddrByAppIdAndAddrTypeCodeObj) => {
        this.legalAddrObj.Addr = response.Addr;
        this.legalAddrObj.AreaCode1 = response.AreaCode1;
        this.legalAddrObj.AreaCode2 = response.AreaCode2;
        this.legalAddrObj.AreaCode3 = response.AreaCode3;
        this.legalAddrObj.AreaCode4 = response.AreaCode4;
        this.legalAddrObj.City = response.City;
        this.legalAddrObj.MrHouseOwnershipCode = response.MrHouseOwnershipCode;

        this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
        this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
        this.inputAddressObj.default = this.legalAddrObj;
      });
  }

  resetInput(custType: string = CommonConstant.CustTypePersonal) {
    this.BindLookupJobPosition();
    this.CustMainDataForm.reset();
    this.AppCustCompanyMgmntShrholderId = 0;
    this.MrCustTypeCode = custType;
    this.CustMainDataForm.patchValue({
      SharePrcnt: 0,
      IsActive: true,
      IsSigner: false,
      IsOwner: false
    });
    if (custType == CommonConstant.CustTypePersonal) {
      this.CustMainDataForm.patchValue({
        MrIdTypeCode: "",
        MrGenderCode: "",
        MrMaritalStatCode: "",
        MrCustModelCode: ""
      });
    } else {
      this.CustMainDataForm.patchValue({
        MrCompanyTypeCode: "",
        MrCustModelCode: ""
      });
    }

    /*START X DSF Issue Non Jira, Syafiudin : Disamakan dengan FSD DSF bagian Shareholder => START WORKING DATE tidak mandatory
    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
        //note: dari html cmn company yang ditampilkan
        this.CustMainDataForm.controls.EstablishmentDt.setValidators([Validators.required]);
      } else {
        this.CustMainDataForm.controls.EstablishmentDt.clearValidators();
      }
      this.CustMainDataForm.controls.EstablishmentDt.updateValueAndValidity();
    }
    END X DSF Issue Non Jira*/

    this.enableInput();

    this.SetCustModel();
    this.custTypeChange(custType);
    this.checkIsDisableCustType();
  }

  disableInput() {
 	if(this.isEditNap1){
      this.CustMainDataForm.controls.CustName.setValidators([Validators.required]);
      this.CustMainDataForm.controls.CustName.updateValueAndValidity();
      return;
    }
    this.isExisting = true;
    this.isCopyBtnLock = true;
    // this.CustMainDataForm.controls.MrGenderCode.disable();
    // this.CustMainDataForm.controls.MrIdTypeCode.disable();
    // this.CustMainDataForm.controls.MrMaritalStatCode.disable();
    this.inputAddressObj.isReadonly = true;
    this.InputLookupCustObj.isReadonly = true;
    this.InputLookupCustCoyObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isDisable = true;
    if(this.MrCustTypeCode == CommonConstant.CustTypeCompany){
      this.CheckTaxIdFormat();
      this.CustMainDataForm.get("isForeigner").disable();
    }
  }

  enableInput() {
    this.isExisting = false;
    if (this.custMainDataMode != CommonConstant.CustMainDataModeCust) this.isCopyBtnLock = false;
    // this.CustMainDataForm.controls.MrGenderCode.enable();
    // this.CustMainDataForm.controls.MrIdTypeCode.enable();
    // this.CustMainDataForm.controls.MrMaritalStatCode.enable();
    this.inputAddressObj.isReadonly = false;
    this.InputLookupCustObj.isReadonly = false;
    this.InputLookupCustCoyObj.isReadonly = false;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = false;
    this.inputAddressObj.inputField.inputLookupObj.isDisable = false;
  }

  clearInput() {
    this.CustMainDataForm.patchValue({
      BirthDt: '',
      BirthPlace: '',
      IdNo: '',
      IdExpiredDt: '',
      TaxIdNo: '',
      MotherMaidenName: '',
      MobilePhnNo1: '',
      Email1: '',
      CustPrefixName: '',
      CustSuffixName: ''
    });
  }

  setDataCustomerPersonal(CustObj, CustPersonalObj, CustAddrLegalObj, CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustObj != undefined) {
      if (CustObj.MrIdTypeCode != undefined) {
        this.ChangeIdType(CustObj.MrIdTypeCode);
      }

      this.MrCustTypeCode = CustObj.MrCustTypeCode;
      this.CustMainDataForm.patchValue({
        MrCustModelCode: CustObj.MrCustModelCode,
        CustNo: CustObj.CustNo,
        MrIdTypeCode: CustObj.MrIdTypeCode,
        IdNo: CustObj.IdNo,
        IdExpiredDt: CustObj.IdExpiredDt != null ? formatDate(CustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
        TaxIdNo: CustObj.TaxIdNo
      });
      this.PatchCriteriaLookupProfession();

      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
      if (!IsCopyCust) this.rowVersionAppCust = CustObj.RowVersion;
    }

    if (CustPersonalObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrGenderCode: CustPersonalObj.MrGenderCode,
        WnaCountryCode: CustPersonalObj.NationalityCountryCode,
        MrNationalityCode: CustPersonalObj.MrNationalityCode,
        MotherMaidenName: CustPersonalObj.MotherMaidenName,
        CustPrefixName: CustPersonalObj.CustPrefixName,
        CustSuffixName: CustPersonalObj.CustSuffixName,
        BirthPlace: CustPersonalObj.BirthPlace,
        BirthDt: formatDate(CustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
        MobilePhnNo1: CustPersonalObj.MobilePhnNo1,
        Email1: CustPersonalObj.Email1,
      });

      if (CustPersonalObj.NationalityCountryCode) this.GetRefCountry(CustPersonalObj.NationalityCountryCode, CustPersonalObj.MrNationalityCode == CommonConstant.NationalityLocal);
      this.MaritalStatLookup = CustPersonalObj.MrMaritalStatCode;
      if (!IsCopyCust) {
        this.CustMainDataForm.patchValue({
          MrMaritalStatCode: CustPersonalObj.MrMaritalStatCode
        })
        this.rowVersionAppCustPersonal = CustPersonalObj.RowVersion;
      }
      this.RelationshipChange(CustObj.MrCustRelationshipCode);

      if (this.inputMode == 'EDIT') {
        this.isDdlMrCustRelationshipReady = false;
        setTimeout (() => { 
        this.CustMainDataForm.patchValue({
          MrCustRelationshipCode: this.isIncludeCustRelation ? CustObj.MrCustRelationshipCode : '',
        })
        this.isDdlMrCustRelationshipReady = true; 
        }, 0);
      }
    }

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      this.setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj)
    }

    this.setDataLegalAddr(CustAddrLegalObj, IsCopyCust);
    
  }

  setDataCustomerCompany(CustObj, CustCompanyObj, CustAddrLegalObj, CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustObj != undefined) {
      this.MrCustTypeCode = CustObj.MrCustTypeCode;
      this.CustMainDataForm.patchValue({
        CustNo: CustObj.CustNo,
        TaxIdNo: CustObj.TaxIdNo,
        MrCustModelCode: CustObj.MrCustModelCode,
      });
      this.InputLookupCustCoyObj.nameSelect = CustObj.CustName;
      this.InputLookupCustCoyObj.jsonSelect = { CustName: CustObj.CustName };
      if (!IsCopyCust) this.rowVersionAppCust = CustObj.RowVersion;
      this.CheckTaxIdFormat();
    }

    if (CustCompanyObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrCompanyTypeCode: CustCompanyObj.MrCompanyTypeCode,
      });
      if (!IsCopyCust) this.rowVersionAppCustCompany = CustCompanyObj.RowVersion;

      if (this.inputMode == 'EDIT') {
        this.CustMainDataForm.patchValue({
          MrCustRelationshipCode: this.isIncludeCustRelation ? CustObj.MrCustRelationshipCode : '',
        })
      }
    }

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      this.setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj, CustCompanyObj)
    }

    this.setDataLegalAddr(CustAddrLegalObj, IsCopyCust);
  }

  async setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj: AppCustCompanyMgmntShrholderObj, CustCompanyObj = null, IsCopyCust: boolean = false) {
    if (CustCompanyMgmntShrholderObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrJobPositionCode: CustCompanyMgmntShrholderObj.MrJobPositionCode,
        MrPositionSlikCode: CustCompanyMgmntShrholderObj.MrPositionSlikCode,
        SharePrcnt: CustCompanyMgmntShrholderObj.SharePrcnt,
        IsSigner: CustCompanyMgmntShrholderObj.IsSigner,
        IsActive: CustCompanyMgmntShrholderObj.IsActive,
        IsOwner: CustCompanyMgmntShrholderObj.IsOwner,
        EstablishmentDt: CustCompanyMgmntShrholderObj.EstablishmentDt != null ? formatDate(CustCompanyMgmntShrholderObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",
      });
      if (!IsCopyCust) this.rowVersionMgmntShrholder = CustCompanyMgmntShrholderObj.RowVersion;

      if (CustCompanyMgmntShrholderObj.MrPositionSlikCode != undefined && CustCompanyMgmntShrholderObj.MrPositionSlikCode != "") {
        let tempDesc: string = await this.PatchValueDesc(CustCompanyMgmntShrholderObj.MrPositionSlikCode, CommonConstant.RefMasterTypeCodePositionSlik);
        this.positionSlikLookUpObj.nameSelect = tempDesc;
        this.positionSlikLookUpObj.jsonSelect = { Jabatan: tempDesc };
      }
      //this.ChangeValidityShareOwner();
    }
    else if (CustCompanyObj != null) {
      this.CustMainDataForm.patchValue({
        EstablishmentDt: CustCompanyObj.EstablishmentDt != null ? formatDate(CustCompanyObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",

      });
    }
  }

  async PatchValueDesc(MasterCode: string, refMasterTypeCode: string) {
    let reqMasterObj: ReqRefMasterByTypeCodeAndMasterCodeObj = {
      MasterCode: MasterCode,
      RefMasterTypeCode: refMasterTypeCode
    };
    let tempDesc: string = "";
    await this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, reqMasterObj).toPromise().then(
      (response: RefMasterObj) => {
        tempDesc = response.Descr;
      }
    );
    return tempDesc;
  }

  setDataLegalAddr(response, IsCopyCust: boolean) {
    if (response != undefined) {
      this.legalAddrObj.Addr = response.Addr;
      this.legalAddrObj.AreaCode1 = response.AreaCode1;
      this.legalAddrObj.AreaCode2 = response.AreaCode2;
      this.legalAddrObj.AreaCode3 = response.AreaCode3;
      this.legalAddrObj.AreaCode4 = response.AreaCode4;
      this.legalAddrObj.City = response.City;
      this.legalAddrObj.MrHouseOwnershipCode = response.MrBuildingOwnershipCode ? response.MrBuildingOwnershipCode : response.MrHouseOwnershipCode;

      this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
      this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
      this.inputAddressObj.default = this.legalAddrObj;

      if (!IsCopyCust) this.rowVersionAppCustAddr = response.RowVersion;
    }
  }

  setDataCustomerPersonalForSave() {
    if (this.MrCustTypeCode != CommonConstant.CustTypePersonal) return;
    this.custDataPersonalObj = new CustMainDataPersonalObj();
    this.custDataPersonalObj.AppCustObj.MrCustModelCode = this.CustMainDataForm.controls.MrCustModelCode.value;
    this.custDataPersonalObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
    if(this.isEditNap1){
      this.custDataPersonalObj.AppCustObj.CustName = this.CustMainDataForm.controls.CustName.value;
      this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustMainDataForm.controls.CustName.value;
    }
    else{
      this.custDataPersonalObj.AppCustObj.CustName = this.CustMainDataForm.value.lookupCustomer.value;
      this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustMainDataForm.value.lookupCustomer.value;
    }
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
    this.custDataPersonalObj.AppCustObj.AppId = this.appId;
    this.custDataPersonalObj.AppCustObj.AppCustId = this.appCustId != null ? this.appCustId : 0;
    this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.AppCustId = this.appCustId ? this.appCustId : 0;

    if (this.custMainDataMode != this.CustMainDataFamily || this.MrCustTypeCode != this.CustTypePersonal) {
      this.checkIsAddressKnown = true;
    }

    if (this.checkIsAddressKnown == false) {
      this.CustMainDataForm.patchValue({
        Address: {
          Addr: '-',
          AreaCode1: "",
          AreaCode2: "",
          AreaCode3: "",
          AreaCode4: "",
          City: "",
          SubZipcode: "",
          MrHouseOwnershipCode: ""
        },
        AddressZipcode: {
          value: ""
        }
      });
    }

    if (this.isIncludeCustRelation)
      this.custDataPersonalObj.AppCustObj.MrCustRelationshipCode = this.CustMainDataForm.controls.MrCustRelationshipCode.value;

    this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode = this.CustMainDataForm.controls.MrMaritalStatCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode = this.CustMainDataForm.controls.MrGenderCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthPlace = this.CustMainDataForm.controls.BirthPlace.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthDt = this.CustMainDataForm.controls.BirthDt.value;
    this.custDataPersonalObj.AppCustPersonalObj.MotherMaidenName = this.CustMainDataForm.controls.MotherMaidenName.value;

    this.custDataPersonalObj.AppCustPersonalObj.CustSuffixName = this.CustMainDataForm.controls.CustSuffixName.value;
    this.custDataPersonalObj.AppCustPersonalObj.CustPrefixName = this.CustMainDataForm.controls.CustPrefixName.value;

    this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo1 = this.CustMainDataForm.controls.MobilePhnNo1.value,
      this.custDataPersonalObj.AppCustPersonalObj.Email1 = this.CustMainDataForm.controls.Email1.value,

      this.custDataPersonalObj.AppCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
    this.custDataPersonalObj.AppCustAddrLegalObj.Addr = this.CustMainDataForm.controls["Address"]["controls"].Addr.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode3 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode3.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode4 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode4.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Zipcode = this.CustMainDataForm.controls["AddressZipcode"]["controls"].value.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode1 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode1.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode2 = this.CustMainDataForm.controls["Address"]["controls"].AreaCode2.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.City = this.CustMainDataForm.controls["Address"]["controls"].City.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.SubZipcode = this.CustMainDataForm.controls["Address"]["controls"].SubZipcode.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.MrHouseOwnershipCode = this.CustMainDataForm.controls["Address"]["controls"].MrHouseOwnershipCode.value;

    if (this.custDataPersonalObj.AppCustObj.IsFamily) {
      this.custDataPersonalObj.AppCustPersonalObj.MrNationalityCode = this.CustMainDataForm.controls.MrNationalityCode.value;
      this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode = this.CustMainDataForm.controls.WnaCountryCode.value;
    }

    if (this.custDataPersonalObj.AppCustObj.IsShareholder) {
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MrJobPositionCode = this.CustMainDataForm.controls.MrJobPositionCode.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.SharePrcnt = this.CustMainDataForm.controls.SharePrcnt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsSigner = this.CustMainDataForm.controls.IsSigner.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MrPositionSlikCode = this.CustMainDataForm.controls.MrPositionSlikCode.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.rowVersionMgmntShrholder;
      if(this.isEditNap1){
        this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustMainDataForm.controls.CustName.value;
      }
      else{
        this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustMainDataForm.value.lookupCustomer.value;
      }
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MrCustTypeCode = this.MrCustTypeCode;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.CustNo = this.CustMainDataForm.controls.CustNo.value;
    }

    if (!this.custDataPersonalObj.AppCustObj.IsCustomer && !this.custDataPersonalObj.AppCustObj.IsGuarantor) {
      this.custDataPersonalObj.AppCustPersonalJobDataObj = this.SetCustPersonalJobData();
      this.custDataPersonalObj.AppCustAttrObjs = this.SetCustAttrContent();
    }

    this.custDataPersonalObj.AppCustObj.RowVersion = this.rowVersionAppCust;
    this.custDataPersonalObj.AppCustPersonalObj.RowVersion = this.rowVersionAppCustPersonal;
    this.custDataPersonalObj.AppCustAddrLegalObj.RowVersion = this.rowVersionAppCustAddr;
  }

  setDataCustomerCompanyForSave() {
    if (this.MrCustTypeCode != CommonConstant.CustTypeCompany) return;
    this.custDataCompanyObj = new CustMainDataCompanyObj();
    this.custDataCompanyObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
    if(this.isEditNap1){
      this.custDataCompanyObj.AppCustObj.CustName = this.CustMainDataForm.controls.CustName.value;
      this.custDataCompanyObj.AppCustCompanyObj.CompanyBrandName = this.CustMainDataForm.controls.CustName.value;
    }
    else{
      this.custDataCompanyObj.AppCustObj.CustName = this.CustMainDataForm.value.lookupCustomerCoy.value;
      this.custDataCompanyObj.AppCustCompanyObj.CompanyBrandName = this.CustMainDataForm.value.lookupCustomerCoy.value;
    }
    this.custDataCompanyObj.AppCustObj.CustNo = this.CustMainDataForm.controls.CustNo.value;
    this.custDataCompanyObj.AppCustObj.MrIdTypeCode = "NPWP";
    this.custDataCompanyObj.AppCustObj.IdNo = this.CustMainDataForm.controls.TaxIdNo.value;
    this.custDataCompanyObj.AppCustObj.TaxIdNo = this.CustMainDataForm.controls.TaxIdNo.value;
    this.custDataCompanyObj.AppCustObj.IsCustomer = (this.custMainDataMode == CommonConstant.CustMainDataModeCust);
    this.custDataCompanyObj.AppCustObj.IsGuarantor = (this.custMainDataMode == CommonConstant.CustMainDataModeGuarantor);
    this.custDataCompanyObj.AppCustObj.IsShareholder = (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder);
    this.custDataCompanyObj.AppCustObj.AppId = this.appId;
    this.custDataCompanyObj.AppCustObj.IsExistingCust = this.isExisting;
    this.custDataCompanyObj.AppCustObj.AppCustId = this.appCustId != null ? this.appCustId : 0;
    this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.AppCustId = this.appCustId != null ? this.appCustId : 0;
    this.custDataCompanyObj.AppCustObj.MrCustModelCode = this.CustMainDataForm.controls.MrCustModelCode.value;

    if (this.isIncludeCustRelation)
      this.custDataCompanyObj.AppCustObj.MrCustRelationshipCode = this.CustMainDataForm.controls.MrCustRelationshipCode.value;

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
    this.custDataCompanyObj.AppCustAddrLegalObj.MrHouseOwnershipCode = this.CustMainDataForm.controls["Address"]["controls"].MrHouseOwnershipCode.value;

    if (this.custDataCompanyObj.AppCustObj.IsShareholder) {
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.SharePrcnt = this.CustMainDataForm.controls.SharePrcnt.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.MrPositionSlikCode = this.CustMainDataForm.controls.MrPositionSlikCode.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      if(this.isEditNap1){
        this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustMainDataForm.controls.CustName.value;
      }
      else{
        this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustMainDataForm.value.lookupCustomerCoy.value;
      }
      if(this.CustMainDataForm.controls.isForeigner.value == null || this.CustMainDataForm.controls.isForeigner.value == false){
        this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsForeigner = false;
      }
      else{
        this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsForeigner = this.CustMainDataForm.controls.isForeigner.value;
      }
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.MrCustTypeCode = this.MrCustTypeCode;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.rowVersionMgmntShrholder;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.CustNo = this.CustMainDataForm.controls.CustNo.value;
    }

    this.custDataCompanyObj.AppCustObj.RowVersion = this.rowVersionAppCust;
    this.custDataCompanyObj.AppCustCompanyObj.RowVersion = this.rowVersionAppCustCompany;
    this.custDataCompanyObj.AppCustAddrLegalObj.RowVersion = this.rowVersionAppCustAddr;
  }

  SetCustPersonalJobData(): AppCustPersonalJobDataObj {
    let tempForm = this.CustMainDataForm.getRawValue();
    let tempReqObj: AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
    // let tempReqObj: AppCustPersonalJobDataObj //= this.ExistingFormObj.CustPersonalJob;

    tempReqObj.MrProfessionCode = tempForm["MrProfessionCode"];
    tempReqObj.MrJobPositionCode = tempForm["MrJobPositionCode"];
    tempReqObj.RowVersion = this.appCustPersonalJobDataRowVersion;
    if (this.custMainDataMode == this.CustMainDataFamily) {
      tempReqObj.EmploymentEstablishmentDt = tempForm["EmploymentEstablishmentDt"];
      if (!tempReqObj.MrProfessionCode && !tempReqObj.MrJobPositionCode && !tempReqObj.EmploymentEstablishmentDt) tempReqObj = null;
    }
    else if(this.custMainDataMode == this.CustMainDataMgmntShrholder) {
      tempReqObj.EmploymentEstablishmentDt = tempForm["EstablishmentDt"];
      if (!tempReqObj.MrProfessionCode && !tempReqObj.MrJobPositionCode && !tempReqObj.EmploymentEstablishmentDt) tempReqObj = null;
    }
    else {
      if (!tempReqObj.MrProfessionCode && !tempReqObj.MrJobPositionCode) tempReqObj = null;
    }
    return tempReqObj
  }

  @ViewChild('CustAttrForm') custAttrForm: CustAttrFormComponent;
  identifierCustAttr: string = "CustAttrForm";
  SetCustAttrContent(): Array<AppCustAttrContentObj> {
    let tempAttr: Array<AppCustAttrContentObj> = new Array();
    let tempFormArray = this.CustMainDataForm.get(this.identifierCustAttr) as FormArray;
    for (let index = 0; index < tempFormArray.length; index++) {
      const element = tempFormArray.get(index.toString()).value;
      let tempAttrToPush: AppCustAttrContentObj = new AppCustAttrContentObj();
      tempAttrToPush.AppCustId = this.appCustId;
      tempAttrToPush.RefAttrCode = element["AttrCode"];
      tempAttrToPush.AttrValue = element["AttrValue"];
      tempAttr.push(tempAttrToPush);
    }
    return tempAttr;
  }


  CekIsCustomer() {
    if (this.custMainDataMode != CommonConstant.CustMainDataModeCust) {
      // if (this.CustMainDataForm.controls.CustNo.value == this.AppCustData.CustNo) {
      //   throw this.toastr.warningMessage(ExceptionConstant.CANT_CHOOSE_ALREADY_SELFCUST_FOR_THIS_NAP);
      // }

      // Sementara
      var TempCust1 = "";
       if(this.isEditNap1){
        TempCust1 = this.CustMainDataForm.controls.CustName.value.toLowerCase();
      }
      else{
        if (this.MrCustTypeCode == CommonConstant.CustTypePersonal)
        TempCust1 = this.CustMainDataForm.value.lookupCustomer.value.toLowerCase();
      else {
        TempCust1 = this.CustMainDataForm.value.lookupCustomerCoy.value.toLowerCase();
      }
      }
      const TempCust2 = this.AppCustData.CustName.toLowerCase();
      if (TempCust1 == TempCust2) {
        this.toastr.warningMessage(ExceptionConstant.CANT_CHOOSE_ALREADY_SELFCUST_FOR_THIS_NAP);
        return true;
      }
    }
    if (this.custMainDataMode == this.CustMainDataMgmntShrholder) {
      if (this.CustMainDataForm.controls.IsActive.value) {
        let tempTotalSharePrctTobeAdd = this.tempTotalSharePrct + this.CustMainDataForm.controls.SharePrcnt.value;
        if (tempTotalSharePrctTobeAdd > 100) {
          this.toastr.warningMessage(ExceptionConstant.TOTAL_SHARE_CAN_NOT_100);
          this.toastr.warningMessage("Total Share now is " + this.tempTotalSharePrct + "%");
          return true;
        }
      }
    }
    return false;
  }

  async SaveCustomer() {
    if (this.CekIsCustomer()) return;

    var isCustAgeValid = await this.validateCustPersonalAge();
    if(!isCustAgeValid) return;

    this.existShrHolder = false;
    let obj = {
      AppCustId : this.appCustId,
      AppId : this.appId,
      MrIdTypeCode : this.CustMainDataForm.controls.MrIdTypeCode.value,
      IdNo : this.CustMainDataForm.controls.IdNo.value,
      IsActive : this.CustMainDataForm.controls.IsActive.value
    }
    // get method baru check idno idtype dan isactive
    await this.http.post(URLConstantX.ShareHolderDuplicateCheck, obj).toPromise().then(
      (response : boolean) => {
        this.existShrHolder = response;
      }
    )

    if(this.existShrHolder)
    {
      this.toastr.warningMessage(String.Format(ExceptionConstant.DUPLICATE_SHRHLDR_ID_NO));
      return false;
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.setDataCustomerPersonalForSave();

      if(this.custMainDataMode != CommonConstant.CustMainDataModeCust && this.custMainDataMode != CommonConstant.CustMainDataModeGuarantor){
        if(this.custDataPersonalObj.AppCustPersonalJobDataObj != null){
          if(this.custDataPersonalObj.AppCustPersonalJobDataObj.EmploymentEstablishmentDt.toString() > this.MaxDtEmpEstblshmntDtValidate){
            this.toastr.warningMessage(String.Format(ExceptionConstant.EMP_EST_DATE_MUST_BE_LESS_THAN_BIZ_DATE));
            return false;
          }
        }
      }
      if (this.custDataPersonalObj.AppCustObj.IsShareholder && this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsOwner && this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.SharePrcnt < 0.0001) {
        this.toastr.warningMessage(String.Format(ExceptionConstantX.IS_OWNER_NEED_SHARE_PRCNT));
        return false;
      }

      if (this.custDataPersonalObj.AppCustObj.IsShareholder && !this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsOwner && this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.SharePrcnt > 0.0000) {
        this.toastr.warningMessage(String.Format(ExceptionConstantX.IS_NON_OWNER_NEED_NOT_HAVE_SHARE_PRCNT));
        return false;
      }

      if (this.appCustId == null || this.appCustId == 0) {
        //this.http.post(URLConstant.AddCustMainDataPersonal, this.custDataPersonalObj).subscribe(
        this.http.post(URLConstantX.AddCustMainDataPersonalX, this.custDataPersonalObj).subscribe(
          (response) => {
            if (response["StatusCode"] == 200) {
              this.toastr.successMessage(response["message"]);
              this.outputAfterSave.emit(this.custDataPersonalObj.AppCustPersonalObj);
            }
            else {
              response["ErrorMessages"].forEach((message: string) => {
                this.toastr.warningMessage(message["Message"]);
              });
            }
          }
        );
      } else {
        this.http.post(URLConstantX.EditCustMainDataPersonalXV2, this.custDataPersonalObj).subscribe(
          (response) => {
            if (response["StatusCode"] == 200) {
              this.toastr.successMessage(response["message"]);
              this.outputAfterSave.emit(this.custDataPersonalObj.AppCustPersonalObj);
            }
            else {
              response["ErrorMessages"].forEach((message: string) => {
                this.toastr.warningMessage(message["Message"]);
              });
            }
          }
        );
      }
    }
    else {
      // if (this.CustMainDataForm.controls.MrCustModelCode.value == "") {
      //   this.toastr.warningMessage(ExceptionConstant.COMPLETE_SHAREHOLDER_COMPANY_MODEL)
      //   return;
      // }
      this.setDataCustomerCompanyForSave();
      if (this.custDataCompanyObj.AppCustObj.IsShareholder && this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsOwner && this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.SharePrcnt < 0.0001) {
        this.toastr.warningMessage(String.Format(ExceptionConstantX.IS_OWNER_NEED_SHARE_PRCNT));
        return false;
      }

      if (this.custDataCompanyObj.AppCustObj.IsShareholder && !this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsOwner && this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.SharePrcnt > 0.0000) {
        this.toastr.warningMessage(String.Format(ExceptionConstantX.IS_NON_OWNER_NEED_NOT_HAVE_SHARE_PRCNT));
        return false;
      }
      if (this.appCustId == null || this.appCustId == 0) {
        this.http.post(URLConstantX.AddCustMainDataCompanyData, this.custDataCompanyObj).subscribe(
          (response) => {
            if (response["StatusCode"] == 200) {
              this.outputAfterSave.emit(this.custDataCompanyObj.AppCustObj);
              this.toastr.successMessage(response["message"]);
            }
            else {
              response["ErrorMessages"].forEach((message: string) => {
                this.toastr.warningMessage(message["Message"]);
              });
            }
          }
        );
      } else {
        this.http.post(URLConstant.EditCustMainDataCompanyDataV2, this.custDataCompanyObj).subscribe(
          (response) => {
            if (response["StatusCode"] == 200) {
              this.outputAfterSave.emit(this.custDataCompanyObj.AppCustObj);
              this.toastr.successMessage(response["message"]);
            }
            else {
              response["ErrorMessages"].forEach((message: string) => {
                this.toastr.warningMessage(message["Message"]);
              });
            }
          }
        );
      }
    }
  }

  async SaveForm() {
    if(this.custMainDataMode == CommonConstant.CustMainDataModeCust)
    {
      await this.checkIsCustAllowedContinue();
      if(!this.IsCustAllowedContinue) return;

      //#region Self Custom Changes CR Validate Negative Customer
      await this.checkNegativeCustomerFamilyOrShareholder()
      if(!this.IsCustAllowedContinue) return;
      //#endregion
    }
    let obj = {
      CustNo: this.CustMainDataForm.controls.CustNo.value,
      AppNo: this.AppNo,
      BizTemplateCode: this.bizTemplateCode
    };

    //Self Custom Changes CR MPF & FD Validation
    let objMPFFD = {
      CustNo: this.CustMainDataForm.controls.CustNo.value,
      AppNo: this.AppNo,
      BizTemplateCode: this.bizTemplateCode,
      Lob: this.LobCode
    };
    //End Self Custom Changes CR MPF & FD Validation


    if (this.bizTemplateCode == CommonConstant.CFNA && this.custMainDataMode == CommonConstant.CustMainDataModeCust)
    {
      //Self Custom Changes CR MPF & FD Validation
      if (this.LobCode == CommonConstantDsf.MPF || this.LobCode == CommonConstantDsf.FD || this.LobCode == CommonConstantDsf.FMU)
      {
        // let isHaveAgrmntParent : boolean = false;
        // await this.http.post<Array<AgrParentObjX>>(URLConstantX.GetListAgrmntParentByCustNoX, { CustNo: this.CustMainDataForm.controls.CustNo.value }).toPromise().then(
        //   (response) => {
        //     if (response && response.length > 0) isHaveAgrmntParent = true;
        //   }
        // );
        // if(!isHaveAgrmntParent)
        // {
        //   this.toastr.warningMessage(ExceptionConstantX.CUST_MUST_HAVE_AGRMNT_PARENT);
        //   return;
        // }

        let isOverdue: boolean = false;
        await this.http.post(URLConstantX.CheckAgrmntParentOverdueByCustNo, { CustNo: this.CustMainDataForm.controls.CustNo.value }).toPromise().then(
          (response: any) => {
            if (response.IsOverdue) isOverdue = true;
          }
        );
        if(isOverdue){
          this.toastr.warningMessage(ExceptionConstantX.AGRMNT_PARENT_OVERDUE_EXIST);
          return;
        }

        let isHaveAgrmntParent : boolean = false;
        await this.http.post<Array<AgrParentObjX>>(URLConstantX.GetListAgrmntParentByCustNoX, { CustNo: this.CustMainDataForm.controls.CustNo.value }).toPromise().then(
              (response) => {
                if (response && response.length > 0) isHaveAgrmntParent = true;
              }
            );

        await this.http.post(URLConstantDsf.CheckIfCustHasOngoingAppDsf, objMPFFD).toPromise().then(
          (response) => {

            let ResponseObj = response[CommonConstant.ReturnObj];
            if (!isHaveAgrmntParent)
            {
              this.toastr.warningMessage(ExceptionConstantDsf.CUST_NOT_HAVE_AGR_PARENT);
              return;
            }
            else
            {
              if (ResponseObj.IsAvailable == true)
              {
                if (ResponseObj.IsAvailableLOB == true)
                {
                  this.SaveCustomer();
                }
                else
                {
                  this.toastr.warningMessage(ExceptionConstantDsf.AGR_PARENT_AVAILABLE_NOT_INLINE);
                  return;
                }
              }
              else
              {
                this.toastr.warningMessage(ExceptionConstantDsf.AGR_PARENT_NOT_AVAILABLE);
                return;
              }
            }
          }
        );
      }
      //End Self Custom Changes CR MPF & FD Validation

      else
      {
        let isHaveAgrmntParent : boolean = false;
        await this.http.post<Array<AgrParentObjX>>(URLConstantX.GetListAgrmntParentByCustNoX, { CustNo: this.CustMainDataForm.controls.CustNo.value }).toPromise().then(
          (response) => {
            if (response && response.length > 0) isHaveAgrmntParent = true;
          }
        );
        if(!isHaveAgrmntParent)
        {
          this.toastr.warningMessage(ExceptionConstantX.CUST_MUST_HAVE_AGRMNT_PARENT);
          return;
        }

        let isOverdue: boolean = false;
        await this.http.post(URLConstantX.CheckAgrmntParentOverdueByCustNo, { CustNo: this.CustMainDataForm.controls.CustNo.value }).toPromise().then(
          (response: any) => {
            if (response.IsOverdue) isOverdue = true;
          }
        );
        if(isOverdue){
          this.toastr.warningMessage(ExceptionConstantX.AGRMNT_PARENT_OVERDUE_EXIST);
          return;
        }

        this.http.post(URLConstantX.CheckIfCustHasOngoingAppX, obj).subscribe(
          (response) => {
            this.SaveCustomer();
          }
        );
      }
    } else {
      this.SaveCustomer();
    }
    //Self Custom Changes CR PIC Credit Review
    let requestAddAppRoleObj: ReqAddAppRoleObj = new ReqAddAppRoleObj();

    requestAddAppRoleObj.AppId = this.appId;
    requestAddAppRoleObj.AppRoleCode = this.user.RoleCode;
    
    this.http.post<ReqAddAppRoleObj>(URLConstantDsf.AddNapRole, requestAddAppRoleObj).subscribe(
      (response) => {
        
      }
    )
    //End Self Custom Changes CR PIC Credit Review
  }

  cancel() {
    this.outputCancel.emit();
  }

  //START URS-LOS-041
  customPattern: Array<CustomPatternObj>;
  resultPattern: Array<KeyValueObj>;

  getInitPattern() {
    this.regexService.getListPattern().subscribe(
      response => {
        this.resultPattern = response[CommonConstant.ReturnObj];
        if (this.resultPattern != undefined) {
          for (let i = 0; i < this.resultPattern.length; i++) {
            let patternObj: CustomPatternObj = new CustomPatternObj();
            let pattern: string = this.resultPattern[i].Value;

            patternObj.pattern = pattern;
            patternObj.invalidMsg = this.regexService.getErrMessage(pattern);
            this.customPattern.push(patternObj);
          }
          this.setValidatorPattern();
        }
      }
    );
  }
  setValidatorPattern() {
    let idTypeValue: string = this.CustMainDataForm.controls.MrIdTypeCode.value;
    var pattern: string = "";
    if (idTypeValue != undefined) {
      if (this.resultPattern != undefined) {
        var result = this.resultPattern.find(x => x.Key == idTypeValue)
        if (result != undefined) {
          pattern = result.Value;
        }
      }
    }
    this.setValidator(pattern);
  }
  setValidator(pattern: string) {
    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      this.CustMainDataForm.controls.IdNo.clearValidators();
      this.CustMainDataForm.controls.IdNo.updateValueAndValidity();
    } else {
      if (pattern != undefined) {
        if (!this.isExisting) {
          if (pattern != "") {
            this.CustMainDataForm.controls.IdNo.setValidators([Validators.required, Validators.pattern(pattern)]);
          } else {
            this.CustMainDataForm.controls.IdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
          }
          this.CustMainDataForm.controls.IdNo.updateValueAndValidity();
        } else {
          this.CustMainDataForm.controls.IdNo.clearValidators();
          this.CustMainDataForm.controls.IdNo.updateValueAndValidity();
        }
      }
    }
  }
  //END OF URS-LOS-041

  async getCustDataByLead() {
    //get lead

    let resp4 = await this.http.post<LeadObj>(URLConstant.GetLeadByLeadId, { LeadId: this.LeadId }).toPromise();
    if (resp4 == undefined) return false;

    if (resp4.LeadStep == CommonConstant.LeadStepAppCust) {
      return false;
    } else {
      this.LeadNo = resp4.LeadNo

    }


    //get lead cust
    let resp3 = await this.http.post<LeadCustObj>(URLConstant.GetLeadCustByLeadId, { LeadId: this.LeadId }).toPromise();
    if (resp3 == undefined) return false;

    if (resp3.CustNo == undefined) return false;

    //get cust id
    let resp2 = await this.http.post<CustObj>(URLConstant.GetCustByCustNo, { CustNo: resp3.CustNo }).toPromise()
    if (resp2 == undefined) return false;

    //get cust data
    let resp = await this.http.post<any>(URLConstant.GetCustPersonalForCopyByCustId, { CustId: resp2.CustId }).toPromise();
    if (resp == undefined) return false;

    let resp0 = await this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppCustId, { 'AppCustId': this.appCustId }).toPromise()
    if (resp0 == undefined) return false;


    let response = this.MapFouCustResponseToLosCust(resp, resp0)
    this.MrCustTypeCode = CommonConstant.CustTypePersonal
    await this.setDataCustomerPersonal(response.AppCustObj, response.AppCustPersonalObj, response.AppCustAddrLegalObj, response.AppCustCompanyMgmntShrholderObj);
    await this.setDataCustPersonalJobData(response.AppCustPersonalJobDataObj);
    if (response.AppCustObj.IsExistingCust) {
      this.disableInput();
    }
    this.setValidatorPattern();
    this.custTypeChange(CommonConstant.CustTypePersonal, true);

    return true;


  }

  MapFouCustResponseToLosCust(resp, resp1) {
    let response: any = {
      AppCustObj: {},
      AppCustPersonalObj: {},
      AppCustAddrLegalObj: {},
      AppCustAddrResidenceObj: {},
      AppCustAddrMailingObj: {},
      AppCustPersonalContactPersonObjs: [],
      AppCustPersonalFinDataObj: {},
      AppCustBankAccObjs: [],
      AppCustPersonalJobDataObj: {},
      AppCustGrpObjs: [],
    };

    if (resp.CustObj) {
      this.MrCustTypeCode = resp.CustObj.MrCustTypeCode;
      response.AppCustObj = {
        CustNo: resp.CustObj.CustNo,
        CustName: resp.CustObj.CustName,
        CustModelCode: resp.CustObj.MrCustModelCode,
        MrCustModelCode: resp.CustObj.MrCustModelCode,
        MrIdTypeCode: resp.CustObj.MrIdTypeCode,
        IdNo: resp.CustObj.IdNo,
        IdExpiredDt: resp.CustObj.IdExpiredDt,
        TaxIdNo: resp.CustObj.TaxIdNo,
        IsVip: resp.CustObj.IsVip,
        IsAffiliateWithMf: resp.CustObj.IsAffiliateWithMf,
        IsCustomer: 1,
        VipNotes: resp.CustObj.VipNotes,
        RowVersion: resp1.AppCustObj.RowVersion,
      }
    }

    if (resp.CustPersonalObj) {
      response.AppCustPersonalObj = {
        CustFullName: resp.CustPersonalObj.CustFullName,
        NickName: resp.CustPersonalObj.NickName,
        BirthPlace: resp.CustPersonalObj.BirthPlace,
        BirthDt: resp.CustPersonalObj.BirthDt,
        MotherMaidenName: resp.CustPersonalObj.MotherMaidenName,
        MrGenderCode: resp.CustPersonalObj.MrGenderCode,
        MrReligionCode: resp.CustPersonalObj.MrReligionCode,
        MrEducationCode: resp.CustPersonalObj.MrEducationCode,
        MrNationalityCode: resp.CustPersonalObj.MrNationalityCode,
        NationalityCountryCode: resp.CustPersonalObj.WnaCountryCode,
        MrMaritalStatCode: resp.CustPersonalObj.MrMaritalStatCode,
        FamilyCardNo: resp.CustPersonalObj.FamilyCardNo,
        NoOfResidence: resp.CustPersonalObj.NoOfResidence,
        NoOfDependents: resp.CustPersonalObj.NoOfDependents,
        MobilePhnNo1: resp.CustPersonalObj.MobilePhnNo1,
        MobilePhnNo2: resp.CustPersonalObj.MobilePhnNo2,
        MobilePhnNo3: resp.CustPersonalObj.MobilePhnNo3,
        Email1: resp.CustPersonalObj.Email1,
        Email2: resp.CustPersonalObj.Email2,
        Email3: resp.CustPersonalObj.Email3,
        CustPrefixName: resp.CustPersonalObj.CustPrefixName,
        CustSuffixName: resp.CustPersonalObj.CustSuffixName,
        IsRestInPeace: resp.CustPersonalObj.IsRestInPeace,
        MrSalutationCode: resp.CustPersonalObj.MrSalutationCode,
        RowVersion: resp1.AppCustPersonalObj.RowVersion,


      }
    }

    if (resp.CustAddrLegalObj) {
      response.AppCustAddrLegalObj = {
        MrCustAddrTypeCode: resp.CustAddrLegalObj.MrCustAddrTypeCode,
        MrHouseOwnershipCode: resp.CustAddrLegalObj.MrBuildingOwnershipCode,
        Addr: resp.CustAddrLegalObj.Addr,
        AreaCode1: resp.CustAddrLegalObj.AreaCode1,
        AreaCode2: resp.CustAddrLegalObj.AreaCode2,
        AreaCode3: resp.CustAddrLegalObj.AreaCode3,
        AreaCode4: resp.CustAddrLegalObj.AreaCode4,
        City: resp.CustAddrLegalObj.City,
        Zipcode: resp.CustAddrLegalObj.Zipcode,
        SubZipcode: resp.CustAddrLegalObj.SubZipcode,
        PhnArea1: resp.CustAddrLegalObj.PhnArea1,
        Phn1: resp.CustAddrLegalObj.Phn1,
        PhnExt1: resp.CustAddrLegalObj.PhnExt1,
        PhnArea2: resp.CustAddrLegalObj.PhnArea2,
        Phn2: resp.CustAddrLegalObj.Phn2,
        PhnExt2: resp.CustAddrLegalObj.PhnExt2,
        FaxArea: resp.CustAddrLegalObj.FaxArea,
        Fax: resp.CustAddrLegalObj.Fax,
        FullAddr: resp.CustAddrLegalObj.Addr + " " +
          resp.CustAddrLegalObj.AreaCode3 + " " +
          resp.CustAddrLegalObj.AreaCode4 + " " +
          resp.CustAddrLegalObj.AreaCode1 + " " +
          resp.CustAddrLegalObj.AreaCode2 + " " +
          resp.CustAddrLegalObj.City + " " +
          resp.CustAddrLegalObj.Zipcode,
        StayLength: resp.CustAddrLegalObj.StayLength,
        RowVersion: resp1.AppCustAddrLegalObj.RowVersion,

      }
    }

    if (resp.CustAddrResidenceObj) {
      response.AppCustAddrResidenceObj = {
        MrCustAddrTypeCode: resp.CustAddrResidenceObj.MrCustAddrTypeCode,
        MrHouseOwnershipCode: resp.CustAddrResidenceObj.MrBuildingOwnershipCode,
        Addr: resp.CustAddrResidenceObj.Addr,
        AreaCode1: resp.CustAddrResidenceObj.AreaCode1,
        AreaCode2: resp.CustAddrResidenceObj.AreaCode2,
        AreaCode3: resp.CustAddrResidenceObj.AreaCode3,
        AreaCode4: resp.CustAddrResidenceObj.AreaCode4,
        City: resp.CustAddrResidenceObj.City,
        Zipcode: resp.CustAddrResidenceObj.Zipcode,
        SubZipcode: resp.CustAddrResidenceObj.SubZipcode,
        PhnArea1: resp.CustAddrResidenceObj.PhnArea1,
        Phn1: resp.CustAddrResidenceObj.Phn1,
        PhnExt1: resp.CustAddrResidenceObj.PhnExt1,
        PhnArea2: resp.CustAddrResidenceObj.PhnArea2,
        Phn2: resp.CustAddrResidenceObj.Phn2,
        PhnExt2: resp.CustAddrResidenceObj.PhnExt2,
        FaxArea: resp.CustAddrResidenceObj.FaxArea,
        Fax: resp.CustAddrResidenceObj.Fax,
        FullAddr: resp.CustAddrResidenceObj.Addr + " " +
          resp.CustAddrResidenceObj.AreaCode3 + " " +
          resp.CustAddrResidenceObj.AreaCode4 + " " +
          resp.CustAddrResidenceObj.AreaCode1 + " " +
          resp.CustAddrResidenceObj.AreaCode2 + " " +
          resp.CustAddrResidenceObj.City + " " +
          resp.CustAddrResidenceObj.Zipcode,
        StayLength: resp.CustAddrResidenceObj.StayLength,
      }
    }

    if (resp.CustAddrMailingObj) {
      response.AppCustAddrMailingObj = {
        MrCustAddrTypeCode: resp.CustAddrMailingObj.MrCustAddrTypeCode,
        MrHouseOwnershipCode: resp.CustAddrMailingObj.MrBuildingOwnershipCode,
        Addr: resp.CustAddrMailingObj.Addr,
        AreaCode1: resp.CustAddrMailingObj.AreaCode1,
        AreaCode2: resp.CustAddrMailingObj.AreaCode2,
        AreaCode3: resp.CustAddrMailingObj.AreaCode3,
        AreaCode4: resp.CustAddrMailingObj.AreaCode4,
        City: resp.CustAddrMailingObj.City,
        Zipcode: resp.CustAddrMailingObj.Zipcode,
        SubZipcode: resp.CustAddrMailingObj.SubZipcode,
        PhnArea1: resp.CustAddrMailingObj.PhnArea1,
        Phn1: resp.CustAddrMailingObj.Phn1,
        PhnExt1: resp.CustAddrMailingObj.PhnExt1,
        PhnArea2: resp.CustAddrMailingObj.PhnArea2,
        Phn2: resp.CustAddrMailingObj.Phn2,
        PhnExt2: resp.CustAddrMailingObj.PhnExt2,
        FaxArea: resp.CustAddrMailingObj.FaxArea,
        Fax: resp.CustAddrMailingObj.Fax,
        FullAddr: resp.CustAddrMailingObj.Addr + " " +
          resp.CustAddrMailingObj.AreaCode3 + " " +
          resp.CustAddrMailingObj.AreaCode4 + " " +
          resp.CustAddrMailingObj.AreaCode1 + " " +
          resp.CustAddrMailingObj.AreaCode2 + " " +
          resp.CustAddrMailingObj.City + " " +
          resp.CustAddrMailingObj.Zipcode,
        StayLength: resp.CustAddrMailingObj.StayLength,
      }
    }

    if (resp.CustPersonalContactPersonObjs) {
      response.AppCustPersonalContactPersonObjs = resp.CustPersonalContactPersonObjs.map(x => {
        return {
          ContactPersonName: x.ContactPersonName,
          MrIdTypeCode: x.MrIdTypeCode,
          IdNo: x.IdNo,
          BirthPlace: x.BirthPlace,
          BirthDt: x.BirthDt,
          MotherMaidenName: x.MotherMaidenName,
          MrGenderCode: x.MrGenderCode,
          GenderName: x.GenderName,
          MrReligionCode: x.MrReligionCode,
          MrEducationCode: x.MrEducationCode,
          MrJobProfessionCode: x.MrJobProfessionCode,
          MrMaritalStatCode: x.MrMaritalStatCode,
          MrNationalityCode: x.MrNationalityCode,
          NationalityCountryCode: x.NationalityCountryCode,
          MrCustRelationshipCode: x.MrCustRelationshipCode,
          RelationshipName: x.RelationshipName,
          ContactPersonCustNo: x.ContactPersonCustNo,
          IsEmergencyContact: x.IsEmergencyContact,
          IsFamily: x.IsFamily,
          MobilePhnNo1: x.MobilePhnNo1,
          MobilePhnNo2: x.MobilePhnNo2,
          Email: x.Email,
          Addr: x.Addr,
          AreaCode1: x.AreaCode1,
          AreaCode2: x.AreaCode2,
          AreaCode3: x.AreaCode3,
          AreaCode4: x.AreaCode4,
          City: x.City,
          Zipcode: x.Zipcode,
          SubZipcode: x.SubZipcode,
          FullAddr: x.Addr + " " +
            x.AreaCode3 + " " +
            x.AreaCode4 + " " +
            x.AreaCode1 + " " +
            x.AreaCode2 + " " +
            x.City + " " +
            x.Zipcode,
        }
      })
    }

    if (resp.CustPersonalFinDataObj) {
      response.AppCustPersonalFinDataObj = {
        MonthlyIncomeAmt: resp.CustPersonalFinDataObj.MonthlyIncomeAmt,
        MonthlyExpenseAmt: resp.CustPersonalFinDataObj.MonthlyExpenseAmt,
        MonthlyInstallmentAmt: resp.CustPersonalFinDataObj.MonthlyInstallmentAmt,
        MrSourceOfIncomeTypeCode: resp.CustPersonalFinDataObj.MrSourceOfIncomeCode,
        SpouseMonthlyIncomeAmt: resp.CustPersonalFinDataObj.SpouseMonthlyIncomeAmt,
        IsJoinIncome: resp.CustPersonalFinDataObj.IsJoinIncome,
        OtherIncomeAmt: resp.CustPersonalFinDataObj.OtherIncomeAmt,
        OtherMonthlyInstAmt: resp.CustPersonalFinDataObj.OtherMonthlyInstAmt,
        TotalIncomeAmt: resp.CustPersonalFinDataObj.TotalIncomeAmt,
        NettIncomeAmt: resp.CustPersonalFinDataObj.NettIncomeAmt,
        DateAsOf: resp.CustPersonalFinDataObj.DateAsOf,
      }
    }

    if (resp.CustBankAccObjs) {
      response.AppCustBankAccObjs = resp.CustBankAccObjs.map(x => {
        return {
          AppCustBankAccId: x.AppCustBankAccId,
          AppCustId: x.AppCustId,
          BankCode: x.BankCode,
          BankName: x.BankName,
          BankBranch: x.BankBranch,
          BankAccNo: x.BankAccNo,
          BankAccName: x.BankAccName,
          IsBankStmnt: x.IsBankStmnt,
          BankBranchRegRptCode: x.BankBranchRegRptCode,
          BalanceAmt: x.BalanceAmt,
          IsDefault: x.IsDefault,
          IsActive: x.IsActive,
          AppCustBankStmntObjs: x.AppCustBankStmntObjs,
        }
      })
    }

    if (resp.CustPersonalJobDataObj) {
      this.appCustPersonalJobDataRowVersion = resp.CustPersonalJobDataObj.RowVersion;
      response.AppCustPersonalJobDataObj = {
        AppCustPersonalJobDataId: resp.CustPersonalJobDataObj.AppCustPersonalJobDataId,
        MrProfessionCode: resp.CustPersonalJobDataObj.MrProfessionCode,
        CompanyName: resp.CustPersonalJobDataObj.CompanyName,
        PrevCoyName: resp.CustPersonalJobDataObj.PrevCoyName,
        OthBizName: resp.CustPersonalJobDataObj.OthBizName,
        OthBizType: resp.CustPersonalJobDataObj.OthBizType,
        MrJobPositionCode: resp.CustPersonalJobDataObj.MrJobPositionCode,
        OthBizJobPosition: resp.CustPersonalJobDataObj.OthBizJobPosition,
        MrJobStatCode: resp.CustPersonalJobDataObj.MrJobStatCode,
        IsMfEmp: resp.CustPersonalJobDataObj.IsMfEmp,
        IndustryTypeCode: resp.CustPersonalJobDataObj.IndustryTypeCode,
        OthBizIndustryTypeCode: resp.CustPersonalJobDataObj.OthBizIndustryTypeCode,
        MrCompanyScaleCode: resp.CustPersonalJobDataObj.MrCompanyScaleCode,
        EstablishmentDt: resp.CustPersonalJobDataObj.EstablishmentDt,
        PrevEmploymentDt: resp.CustPersonalJobDataObj.PrevEmploymentDt,
        OthBizEstablishmentDt: resp.CustPersonalJobDataObj.OthBizEstablishmentDt,
        MrJobTitleCode: resp.CustPersonalJobDataObj.MrJobTitleCode,
        ProfessionalNo: resp.CustPersonalJobDataObj.ProfessionalNo,
        MrInvestmentTypeCode: resp.CustPersonalJobDataObj.MrInvestmentTypeCode,
        AppCustAddrJobObj: {
          MrCustAddrTypeCode: resp.CustPersonalJobDataObj.AppCustAddrJobObj.MrCustAddrTypeCode,
          MrHouseOwnershipCode: resp.CustPersonalJobDataObj.AppCustAddrJobObj.MrBuildingOwnershipCode,
          Addr: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Addr,
          AreaCode1: resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode1,
          AreaCode2: resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode2,
          AreaCode3: resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode3,
          AreaCode4: resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode4,
          City: resp.CustPersonalJobDataObj.AppCustAddrJobObj.City,
          Zipcode: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Zipcode,
          SubZipcode: resp.CustPersonalJobDataObj.AppCustAddrJobObj.SubZipcode,
          PhnArea1: resp.CustPersonalJobDataObj.AppCustAddrJobObj.PhnArea1,
          Phn1: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Phn1,
          PhnExt1: resp.CustPersonalJobDataObj.AppCustAddrJobObj.PhnExt1,
          PhnArea2: resp.CustPersonalJobDataObj.AppCustAddrJobObj.PhnArea2,
          Phn2: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Phn2,
          PhnExt2: resp.CustPersonalJobDataObj.AppCustAddrJobObj.PhnExt2,
          FaxArea: resp.CustPersonalJobDataObj.AppCustAddrJobObj.FaxArea,
          Fax: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Fax,
          FullAddr: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Addr + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode3 + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode4 + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode1 + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode2 + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.City + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.Zipcode,
          StayLength: resp.CustPersonalJobDataObj.AppCustAddrJobObj.StayLength,
        },
        NumOfEmployee: resp.CustPersonalJobDataObj.NumOfEmployee,
      }
    }

    if (resp.CustGrpObjs) {
      response.AppCustGrpObjs = resp.CustGrpObjs.map(x => {
        return {
          AppCustGrpId: x.AppCustGrpId,
          AppCustId: x.AppCustId,
          CustNo: x.CustNo,
          MrCustRelationshipCode: x.MrCustRelationshipCode,
          CustGrpNotes: x.CustGrpNotes,
        }
      })
    }

    return response;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.CustMainDataForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }

  OnCheckIsAddressKnown(isChecked: boolean) {
    this.checkIsAddressKnown = isChecked;
    this.setAddressValidator();
  }

  setAddressValidator() {
    if (this.checkIsAddressKnown === true) {
    } else {
      this.CustMainDataForm.get('Address.Addr').clearValidators();
      this.CustMainDataForm.get('Address.AreaCode1').clearValidators();
      this.CustMainDataForm.get('Address.AreaCode2').clearValidators();
      this.CustMainDataForm.get('Address.AreaCode3').clearValidators();
      this.CustMainDataForm.get('Address.AreaCode4').clearValidators();
      this.CustMainDataForm.get('Address.City').clearValidators();
      this.CustMainDataForm.get('Address.SubZipcode').clearValidators();
      this.CustMainDataForm.get('Address.MrHouseOwnershipCode').clearValidators();
      this.CustMainDataForm.get('AddressZipcode.value').clearValidators();

      this.CustMainDataForm.get('Address.Addr').updateValueAndValidity();
      this.CustMainDataForm.get('Address.AreaCode1').updateValueAndValidity();
      this.CustMainDataForm.get('Address.AreaCode2').updateValueAndValidity();
      this.CustMainDataForm.get('Address.AreaCode3').updateValueAndValidity();
      this.CustMainDataForm.get('Address.AreaCode4').updateValueAndValidity();
      this.CustMainDataForm.get('Address.City').updateValueAndValidity();
      this.CustMainDataForm.get('Address.SubZipcode').updateValueAndValidity();
      this.CustMainDataForm.get('Address.MrHouseOwnershipCode').updateValueAndValidity();
      this.CustMainDataForm.get('AddressZipcode.value').updateValueAndValidity();
    }
  }

  isAddressIsNull() {
    if (this.inputAddressObj.default)
      if (
        (this.inputAddressObj.default.Addr === '' || this.inputAddressObj.default.Addr == null || this.inputAddressObj.default.Addr === "-") &&
        (this.inputAddressObj.default.AreaCode1 === '' || this.inputAddressObj.default.AreaCode1 == null) &&
        (this.inputAddressObj.default.AreaCode2 === '' || this.inputAddressObj.default.AreaCode2 == null) &&
        (this.inputAddressObj.default.AreaCode3 === '' || this.inputAddressObj.default.AreaCode3 == null) &&
        (this.inputAddressObj.default.AreaCode4 === '' || this.inputAddressObj.default.AreaCode4 == null) &&
        (this.inputAddressObj.default.City === '' || this.inputAddressObj.default.City == null) &&
        (this.inputAddressObj.default.MrHouseOwnershipCode == null || this.inputAddressObj.default.MrHouseOwnershipCode == "")
      ) {
        this.checkIsAddressKnown = false;
      } else {
        this.checkIsAddressKnown = true;
      }

  }


  isShareOwnerMandatory : boolean = false;
  ChangeValidityShareOwner() {
    if (this.CustMainDataForm.controls.SharePrcnt.value == 0 && this.CustMainDataForm.controls.IsOwner.value == false) {
      this.CustMainDataForm.get("SharePrcnt").setValidators([Validators.min(0), Validators.max(100)]);
      this.CustMainDataForm.get("IsOwner").clearValidators();
      this.isShareOwnerMandatory = false;
    }
    else{
      this.CustMainDataForm.get("SharePrcnt").setValidators([Validators.min(0.000001), Validators.max(100)]);
      this.CustMainDataForm.get("IsOwner").setValidators([Validators.requiredTrue]);
      this.isShareOwnerMandatory = true;

    }
    this.CustMainDataForm.get("SharePrcnt").updateValueAndValidity();
    this.CustMainDataForm.get("IsOwner").updateValueAndValidity();
  }

  CheckTaxIdFormat() {
    if (isNaN(this.CustMainDataForm.controls.TaxIdNo.value)) {
      this.CustMainDataForm.patchValue({
        isForeigner: true
      });
    }
    this.ChangeTaxIdValidity();
  }

  ChangeTaxIdValidity() {
    if (this.CustMainDataForm.controls.isForeigner.value == true) {
      this.CustMainDataForm.get("TaxIdNo").setValidators([Validators.required]);
    }
    else {
      this.CustMainDataForm.get("TaxIdNo").setValidators([Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(16), Validators.maxLength(16)]);
      this.npwpKtpChecking()
    }
    this.CustMainDataForm.get("TaxIdNo").updateValueAndValidity();
  }

  ListJobPostIsOwner : Array<string> = new Array<string>();
  async getGsJobPostIsOwner(){
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstantX.GSCodeShareholderJobPostIsOnwer }).toPromise().then(
      (response: GeneralSettingObj) => {
        let x = response.GsValue;
        this.ListJobPostIsOwner = x.split(';');
      }
    )
  }

  CheckJobPostionIsOwner(){
    if(this.custMainDataMode == this.CustMainDataMgmntShrholder){
      let x = this.ListJobPostIsOwner.find(f=>f == this.CustMainDataForm.controls.MrPositionSlikCode.value);
      console.log(x);
      if(x!= null){
        this.CustMainDataForm.patchValue({
          IsOwner: true,
        });
        this.CustMainDataForm.get("IsOwner").disable();
      }
      else{
        this.CustMainDataForm.patchValue({
          IsOwner: false,
        });
        this.CustMainDataForm.get("IsOwner").disable();
      }
    }
  }

  async getMinMaxAgeCustPersonalFromGenSet()
  {
    var businessDt:Date = new Date(this.UserAccess[CommonConstant.BUSINESS_DT]);
    // jika bukan personal atau (family & bukan spouse) maka skip
    if(this.MrCustTypeCode != CommonConstant.CustTypePersonal ||
      (this.custMainDataMode == CommonConstant.CustMainDataModeFamily && this.CustMainDataForm.get('MrCustRelationshipCode').value != CommonConstant.MasteCodeRelationshipSpouse))
    {
      this.minCustPerAge = 0;
      this.minCustPerAgeDt = new Date(businessDt);
      return;
    }

    await this.http.post(URLConstant.GetGeneralSettingValueByCode, {Code: CommonConstant.GSCodeCustAgeLimit}).toPromise().then(
      (response) => {
        var listGsAge: Array<string> = response && response["GsValue"] ? response["GsValue"].split(';') : [17];
        this.minCustPerAge = Number(listGsAge[0]);
        this.maxCustPerAge = listGsAge && listGsAge.length > 1 ? Number(listGsAge[1]) : 0;

        this.minCustPerAgeDt = new Date(businessDt);
        this.minCustPerAgeDt.setFullYear(this.minCustPerAgeDt.getFullYear() - this.minCustPerAge);

        if(this.maxCustPerAge > 0 && this.maxCustPerAge > this.minCustPerAge) {
          this.maxCustPerAgeDt = new Date(businessDt);
          this.maxCustPerAgeDt.setFullYear(this.maxCustPerAgeDt.getFullYear() - this.maxCustPerAge);
        }
      }
    );
  }

  validateCustPersonalAge()
  {
    // jika bukan personal atau (family & bukan spouse) maka skip
    if(
      this.MrCustTypeCode != CommonConstant.CustTypePersonal ||
      (this.custMainDataMode == CommonConstant.CustMainDataModeFamily && this.CustMainDataForm.get('MrCustRelationshipCode').value != CommonConstant.MasteCodeRelationshipSpouse)
    ) return true;

    var birthDt:Date = new Date(this.CustMainDataForm.get('BirthDt').value);

    if(this.maxCustPerAge > 0 && (birthDt > this.minCustPerAgeDt || birthDt < this.maxCustPerAgeDt))
    {
      this.toastr.warningMessage(String.Format(ExceptionConstant.CUST_AGE_BETWEEN, this.minCustPerAge, this.maxCustPerAge));
      return false;
    }

    if(birthDt > this.minCustPerAgeDt)
    {
      this.toastr.warningMessage(String.Format(ExceptionConstant.CUST_AGE_MIN, this.minCustPerAge));
      return false;
    }

    return true;
  }

  checkIsDisableCustType(){
    if(this.isEditNap1 || this.AppCustCompanyMgmntShrholderId){
      this.isDisableCustType = true;
    }
    else{
      this.isDisableCustType = false;
    }
  }
}
