import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { formatDate, KeyValue } from '@angular/common';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { CustMainDataCompanyObj } from 'app/shared/model/CustMainDataCompanyObj.Model';
import { CustMainDataPersonalObj } from 'app/shared/model/CustMainDataPersonalObj.Model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { ResponseCustPersonalForCopyObj } from 'app/shared/model/ResponseCustPersonalForCopyObj.Model';
import { ResponseCustCompanyForCopyObj } from 'app/shared/model/ResponseCustCompanyForCopyObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { CustomPatternObj } from 'app/shared/model/CustomPatternObj.model';
import { RegexService } from 'app/shared/services/regex.services';
import { AgrmntMasterXObj } from 'app/shared/model/AgrmntMasterXObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ResListKeyValueObj } from 'app/shared/model/Response/Generic/ResListKeyValueObj.model';
import { ResGetAppCustAddrByAppIdAndAddrTypeCodeObj } from 'app/shared/model/Response/NAP/CustMainData/ResGetAppCustAddrByAppIdAndAddrTypeCodeObj.model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { LeadCustObj } from 'app/shared/model/Request/LEAD/LeadCustObj.model';
import { CustObj } from 'app/shared/model/CustObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cust-main-data',
  templateUrl: './cust-main-data.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [RegexService]
})
export class CustMainDataComponent implements OnInit {

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

  @Input() custMainDataMode: string;
  @Input() appId: number;
  @Input() appCustId: number = 0;
  @Input() bizTemplateCode: string = "";
  @Input() inputMode: string = "ADD";
  @Input() isMarried: boolean = false;
  @Output() outputAfterSave: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Input() from: string;

  LeadId: number;
  LeadNo: string;

  MrCustModelCode: string = "";
  agrmntParentNo: string = "";
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
  MrCustTypeCode: string = CommonConstant.CustTypePersonal;
  subjectTitle: string = 'Customer';
  MaritalStatLookup: string = "";
  MaxDate: Date;
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
  readonly MasterGender = CommonConstant.RefMasterTypeCodeGender;
  readonly MasterCustType = CommonConstant.RefMasterTypeCodeCustType;
  readonly MasterMaritalStat = CommonConstant.RefMasterTypeCodeMaritalStat;
  readonly MasterCompanyType = CommonConstant.RefMasterTypeCodeCompanyType;
  readonly MasterJobPosition = CommonConstant.RefMasterTypeCodeJobPosition;
  readonly CustMainDataMgmntShrholder = CommonConstant.CustMainDataModeMgmntShrholder;
  MaxDaysThirdPartyChecking: number;

  constructor(
    private regexService: RegexService,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    public formValidate: FormValidateService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    })
  }

  CustMainDataForm = this.fb.group({
    MrCustModelCode: ['', Validators.required],
    MrCustTypeCode: [],
    MrCustRelationshipCode: ['', Validators.maxLength(50)],
    CustNo: [],
    CompanyType: [''],
    MrMaritalStatCode: ['', Validators.required],
    MrIdTypeCode: ['', Validators.required],
    IdNo: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    IdExpiredDt: [''],
    TaxIdNo: ['', [Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
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
    IsOwner: [false]
  });

  async ngOnInit() {
    this.customPattern = new Array<CustomPatternObj>();
    this.ddlMrCustRelationshipCodeObj.isSelectOutput = true;
    this.ddlIdTypeObj.isSelectOutput = true;
    this.ddlIdTypeObj.customKey = "MasterCode";
    this.ddlIdTypeObj.customValue = "Descr";
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = this.UserAccess[CommonConstant.BUSINESS_DT];

    await this.setLookup();

    this.legalAddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;
    this.inputAddressObj.showAllPhn = false;
    this.inputAddressObj.showFax = false;
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

    await this.initcustMainDataMode();
  }

  async initcustMainDataMode() {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    if (this.appCustId) this.custDataObj.AppCustId = this.appCustId;

    switch (this.custMainDataMode) {
      case CommonConstant.CustMainDataModeCust:
        this.isIncludeCustRelation = false;
        this.custDataObj.IsCustomer = true;
        this.subjectTitle = this.bizTemplateCode == CommonConstant.FL4W ? 'Lessee' : 'Customer';
        this.CustMainDataForm.controls.MrCustRelationshipCode.clearValidators();
        break;
      case CommonConstant.CustMainDataModeGuarantor:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsGuarantor = true;
        this.subjectTitle = 'Guarantor';
        this.CustMainDataForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        this.CustMainDataForm.controls.MrGenderCode.setValidators(Validators.required);
        await this.GetAppCustMainDataByAppId();
        break;
      case CommonConstant.CustMainDataModeFamily:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsFamily = true;
        this.subjectTitle = 'Family';
        this.CustMainDataForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        this.CustMainDataForm.controls.MrGenderCode.setValidators(Validators.required);
        await this.GetAppCustMainDataByAppId();
        break;
      case CommonConstant.CustMainDataModeMgmntShrholder:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsShareholder = true;
        this.subjectTitle = 'Shareholder';
        if(this.MrCustTypeCode == CommonConstant.CustTypeCompany){
          //note: dari html cmn company yang ditampilkan
          this.CustMainDataForm.controls.EstablishmentDt.setValidators([Validators.required]);
        }
        this.CustMainDataForm.controls.MrCustRelationshipCode.setValidators(Validators.required);
        this.CustMainDataForm.controls.MrJobPositionCode.setValidators(Validators.required);
        await this.GetAppCustMainDataByAppId();
        break;
      default:
        this.isIncludeCustRelation = false;
        this.subjectTitle = this.bizTemplateCode == CommonConstant.FL4W ? 'Lessee' : 'Customer';
    }
    this.CustMainDataForm.updateValueAndValidity();
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

  setLookup(custType: string = CommonConstant.CustTypePersonal, isChange: boolean = false) {
    if (custType == CommonConstant.CustTypePersonal) {
      this.InputLookupCustObj.isDisable = false;
      this.InputLookupCustCoyObj.isDisable = true;
    } else {
      this.InputLookupCustObj.isDisable = true;
      this.InputLookupCustCoyObj.isDisable = false;
    }
    this.InputLookupCustObj.urlJson = "./assets/uclookup/lookUpExistingCustPersonal.Json";
    this.InputLookupCustObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustObj.pagingJson = "./assets/uclookup/lookUpExistingCustPersonal.Json";
    this.InputLookupCustObj.genericJson = "./assets/uclookup/lookUpExistingCustPersonal.Json";
    this.InputLookupCustObj.isReadonly = false;
    this.InputLookupCustObj.isRequired = true;

    this.InputLookupCustCoyObj.urlJson = "./assets/uclookup/lookUpExistingCustCompany.json";
    this.InputLookupCustCoyObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupCustCoyObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustCoyObj.pagingJson = "./assets/uclookup/lookUpExistingCustCompany.json";
    this.InputLookupCustCoyObj.genericJson = "./assets/uclookup/lookUpExistingCustCompany.json";
    this.InputLookupCustCoyObj.isReadonly = false;
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
    this.ArrAddCrit.push(critObj);

    this.InputLookupCustObj.addCritInput = this.ArrAddCrit;
    this.InputLookupCustCoyObj.addCritInput = this.ArrAddCrit;

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

  RelationshipChange(relationship: string) {
    let idxMarried = this.DictRefMaster[this.MasterMaritalStat].findIndex(x => x.Key == CommonConstant.MasteCodeMartialStatsMarried);

    if (relationship == CommonConstant.MasteCodeRelationshipSpouse) {
      this.CustMainDataForm.controls.MrMaritalStatCode.patchValue(this.DictRefMaster[this.MasterMaritalStat][idxMarried].Key);
      this.CustMainDataForm.controls.MrMaritalStatCode.disable();
    } else {
      this.CustMainDataForm.controls.MrMaritalStatCode.patchValue(this.MaritalStatLookup != "" ? this.MaritalStatLookup : this.DictRefMaster[this.MasterMaritalStat][idxMarried].Key);
      if (!this.isExisting) this.CustMainDataForm.controls.MrMaritalStatCode.enable();
    }
    this.CustMainDataForm.controls.MrMaritalStatCode.updateValueAndValidity();
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
    await this.GetListActiveRefMaster(this.MasterCustType);
    await this.GetListActiveRefMaster(this.MasterGender);
    await this.GetListActiveRefMaster(this.MasterMaritalStat);
    await this.GetListActiveRefMaster(this.MasterCompanyType);
    await this.GetListActiveRefMaster(this.MasterJobPosition);

    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel, MappingCode: this.MrCustTypeCode };
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, tempReq).toPromise().then(
      (response) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        this.isDdlMrCustModelReady = true;
      }
    );

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

    if (this.DictRefMaster[this.MasterCustType].length != 0) await this.CustMainDataForm.controls.MrCustTypeCode.patchValue(this.DictRefMaster[this.MasterCustType][0].Key);
    if (this.DictRefMaster[this.MasterCustType].length != 0 && this.from == 'SMPLLEAD') {
      this.CustMainDataForm.controls.MrCustTypeCode.patchValue(CommonConstant.CustTypePersonal)
      for (var i = 0; this.DictRefMaster[this.MasterCustType].length != 0; i++) {
        if (this.DictRefMaster[this.MasterCustType][i].Key != CommonConstant.CustTypePersonal) {
          this.DictRefMaster[this.MasterCustType].splice(i, 1);
        }
      }
    }
    if (this.isIncludeCustRelation) {
      await this.getCustRelationship();
    }
  }

  getCustRelationship() {
    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      if (this.CustMainDataForm.controls.MrCustTypeCode.value == CommonConstant.CustTypePersonal) {
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
          if (this.CustMainDataForm.controls.MrCustTypeCode.value == CommonConstant.CustTypePersonal && !this.isMarried) await this.removeSpouse();
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
    await this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppCustId, reqObj).toPromise().then(
      async (response) => {
        if (response.AppCustObj) {
          if (!this.appCustId) this.appCustId = response.AppCustObj.AppCustId
          this.MrCustTypeCode = response.AppCustObj.MrCustTypeCode;
          await this.custTypeChange(this.MrCustTypeCode, true);

          if (this.MrCustTypeCode == CommonConstant.CustTypePersonal)
            await this.setDataCustomerPersonal(response.AppCustObj, response.AppCustPersonalObj, response.AppCustAddrLegalObj, response.AppCustCompanyMgmntShrholderObj);
          else
            await this.setDataCustomerCompany(response.AppCustObj, response.AppCustCompanyObj, response.AppCustAddrLegalObj, response.AppCustCompanyMgmntShrholderObj);

          if (response.AppCustObj.IsExistingCust) {
            this.disableInput();
          }
          this.setValidatorPattern();
        } else
          this.custTypeChange(CommonConstant.CustTypePersonal, true);
      }
    );
  }

  custTypeChange(custType: string = CommonConstant.CustTypePersonal, FirstInit: boolean = false) {
    this.MrCustTypeCode = custType;
    this.MrCustModelCode = "";
    this.CustMainDataForm.controls.MrCustTypeCode.setValue(this.MrCustTypeCode);

    if (!FirstInit) {
      this.custModelReqObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
      this.custModelReqObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustModel;
      this.custModelReqObj.MappingCode = this.MrCustTypeCode;
      this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, this.custModelReqObj).subscribe(
        (response : ResListKeyValueObj) => {
          this.CustModelObj = response[CommonConstant.ReturnObj];
        }
      );
    }

    if (custType == CommonConstant.CustTypePersonal) {
      this.CustMainDataForm.controls.MrCustModelCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MotherMaidenName.setValidators(Validators.required);
      this.CustMainDataForm.controls.BirthDt.setValidators(Validators.required);
      this.CustMainDataForm.controls.BirthPlace.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrIdTypeCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrGenderCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrMaritalStatCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.IdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.CustMainDataForm.controls.MobilePhnNo1.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.CustMainDataForm.controls.Email1.setValidators([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]);
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

      this.CustMainDataForm.controls.MrCustModelCode.clearValidators();
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

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      if (custType == CommonConstant.CustTypePersonal) {
        this.CustMainDataForm.controls.MrJobPositionCode.setValidators(Validators.required);
        this.CustMainDataForm.controls.MrJobPositionCode.updateValueAndValidity();
      } else {
        this.CustMainDataForm.controls.MrJobPositionCode.clearValidators();
        this.CustMainDataForm.controls.MrJobPositionCode.updateValueAndValidity();

      }
    }

    this.CustMainDataForm.controls.MrCustModelCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MotherMaidenName.updateValueAndValidity();
    this.CustMainDataForm.controls.BirthDt.updateValueAndValidity();
    this.CustMainDataForm.controls.BirthPlace.updateValueAndValidity();
    this.CustMainDataForm.controls.MrIdTypeCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MrGenderCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MrMaritalStatCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MrJobPositionCode.updateValueAndValidity();
    this.CustMainDataForm.controls.MrCompanyTypeCode.updateValueAndValidity();
    this.CustMainDataForm.controls.IdNo.updateValueAndValidity();
    this.CustMainDataForm.controls.TaxIdNo.updateValueAndValidity();
    this.CustMainDataForm.controls.MobilePhnNo1.updateValueAndValidity();
    this.CustMainDataForm.controls.Email1.updateValueAndValidity();
    this.setLookup(custType, true);
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
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.http.post<ResponseCustPersonalForCopyObj>(URLConstant.GetCustPersonalMainDataForCopyByCustId, { Id: event.CustId }).subscribe(
        (response) => {
          this.setDataCustomerPersonal(response.CustObj, response.CustPersonalObj, response.CustAddrLegalObj, response.CustCompanyMgmntShrholderObj, true);
        });
    } else {
      this.http.post<ResponseCustCompanyForCopyObj>(URLConstant.GetCustCompanyMainDataForCopyByCustId, { Id: event.CustId }).subscribe(
        (response) => {
          this.setDataCustomerCompany(response.CustObj, response.CustCompanyObj, response.CustAddrLegalObj, response.CustCompanyMgmntShrholderObj, true);
        });
    }
    await this.disableInput();
  }

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

        this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
        this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
        this.inputAddressObj.default = this.legalAddrObj;
      });
  }

  resetInput(custType: string = CommonConstant.CustTypePersonal) {
    this.CustMainDataForm.reset();
    this.CustMainDataForm.patchValue({
      MrCustTypeCode: custType,
      SharePrcnt: 0,
      IsActive: false,
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
        MrCompanyTypeCode: ""
      });
    }

    this.enableInput();

    this.custTypeChange(custType);
  }

  disableInput() {
    this.isExisting = true;
    this.CustMainDataForm.controls.MrGenderCode.disable();
    this.CustMainDataForm.controls.MrIdTypeCode.disable();
    this.CustMainDataForm.controls.MrMaritalStatCode.disable();
    this.CustMainDataForm.controls.MrCustModelCode.disable();
    this.inputAddressObj.isReadonly = true;
    this.InputLookupCustObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isDisable = true;
  }

  enableInput() {
    this.isExisting = false;
    this.CustMainDataForm.controls.MrGenderCode.enable();
    this.CustMainDataForm.controls.MrIdTypeCode.enable();
    this.CustMainDataForm.controls.MrMaritalStatCode.enable();
    this.CustMainDataForm.controls.MrCustModelCode.enable();
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
      Email1: ''
    });
  }

  setDataCustomerPersonal(CustObj, CustPersonalObj, CustAddrLegalObj, CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustObj != undefined) {
      if (CustObj.MrIdTypeCode != undefined) {
        this.ChangeIdType(CustObj.MrIdTypeCode);
      }

      this.CustMainDataForm.patchValue({
        MrCustModelCode: CustObj.MrCustModelCode,
        MrCustTypeCode: CustObj.MrCustTypeCode,
        CustNo: CustObj.CustNo,
        MrIdTypeCode: CustObj.MrIdTypeCode,
        IdNo: CustObj.IdNo,
        IdExpiredDt: CustObj.IdExpiredDt != null ? formatDate(CustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
        TaxIdNo: CustObj.TaxIdNo
      });

      this.InputLookupCustObj.nameSelect = CustObj.CustName;
      this.InputLookupCustObj.jsonSelect = { CustName: CustObj.CustName };
      this.MrCustModelCode = CustObj.MrCustModelCode;
      if (!IsCopyCust) this.rowVersionAppCust = CustObj.RowVersion;
    }

    if (CustPersonalObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrGenderCode: CustPersonalObj.MrGenderCode,
        MotherMaidenName: CustPersonalObj.MotherMaidenName,
        BirthPlace: CustPersonalObj.BirthPlace,
        BirthDt: formatDate(CustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
        MobilePhnNo1: CustPersonalObj.MobilePhnNo1,
        Email1: CustPersonalObj.Email1,
      });
      this.MaritalStatLookup = CustPersonalObj.MrMaritalStatCode;
      if (!IsCopyCust) {
        this.CustMainDataForm.patchValue({
          MrMaritalStatCode: CustPersonalObj.MrMaritalStatCode
        })
        this.rowVersionAppCustPersonal = CustPersonalObj.RowVersion;
      }
      this.RelationshipChange(CustObj.MrCustRelationshipCode);

      if (this.inputMode == 'EDIT') {
        this.CustMainDataForm.patchValue({
          MrCustRelationshipCode: this.isIncludeCustRelation ? CustObj.MrCustRelationshipCode : '',
        })
      }
    }

    if (this.custMainDataMode == CommonConstant.CustMainDataModeMgmntShrholder) {
      this.setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj)
    }

    this.setDataLegalAddr(CustAddrLegalObj, IsCopyCust);
  }

  setDataCustomerCompany(CustObj, CustCompanyObj, CustAddrLegalObj, CustCompanyMgmntShrholderObj, IsCopyCust: boolean = false) {
    if (CustObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrCustTypeCode: CustObj.MrCustTypeCode,
        CustNo: CustObj.CustNo,
        TaxIdNo: CustObj.TaxIdNo,
      });
      this.InputLookupCustCoyObj.nameSelect = CustObj.CustName;
      this.InputLookupCustCoyObj.jsonSelect = { CustName: CustObj.CustName };
      if (!IsCopyCust) this.rowVersionAppCust = CustObj.RowVersion;
      this.MrCustModelCode = CustObj.MrCustModelCode;
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

  setDataCustomerMgmntShrholder(CustCompanyMgmntShrholderObj, CustCompanyObj = null, IsCopyCust: boolean = false) {
    if (CustCompanyMgmntShrholderObj != undefined) {
      this.CustMainDataForm.patchValue({
        MrJobPositionCode: CustCompanyMgmntShrholderObj.MrJobPositionCode,
        SharePrcnt: CustCompanyMgmntShrholderObj.SharePrcnt,
        IsSigner: CustCompanyMgmntShrholderObj.IsSigner,
        IsActive: CustCompanyMgmntShrholderObj.IsActive,
        IsOwner: CustCompanyMgmntShrholderObj.IsOwner,
        EstablishmentDt: CustCompanyMgmntShrholderObj.EstablishmentDt != null ? formatDate(CustCompanyMgmntShrholderObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",
      });
      if (!IsCopyCust) this.rowVersionMgmntShrholder = CustCompanyMgmntShrholderObj.RowVersion;
    }
    else if (CustCompanyObj != null) {
      this.CustMainDataForm.patchValue({
        EstablishmentDt: CustCompanyObj.EstablishmentDt != null ? formatDate(CustCompanyObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",

      });
    }
  }

  setDataLegalAddr(response, IsCopyCust: boolean) {
    if (response != undefined) {
      this.legalAddrObj.Addr = response.Addr;
      this.legalAddrObj.AreaCode1 = response.AreaCode1;
      this.legalAddrObj.AreaCode2 = response.AreaCode2;
      this.legalAddrObj.AreaCode3 = response.AreaCode3;
      this.legalAddrObj.AreaCode4 = response.AreaCode4;
      this.legalAddrObj.City = response.City;

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
    this.custDataPersonalObj.AppCustObj.MrCustModelCode = this.MrCustModelCode;

    if (this.isIncludeCustRelation)
      this.custDataPersonalObj.AppCustObj.MrCustRelationshipCode = this.CustMainDataForm.controls.MrCustRelationshipCode.value;

    this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustMainDataForm.value.lookupCustomer.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode = this.CustMainDataForm.controls.MrMaritalStatCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode = this.CustMainDataForm.controls.MrGenderCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthPlace = this.CustMainDataForm.controls.BirthPlace.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthDt = this.CustMainDataForm.controls.BirthDt.value;
    this.custDataPersonalObj.AppCustPersonalObj.MotherMaidenName = this.CustMainDataForm.controls.MotherMaidenName.value;
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

    if (this.custDataPersonalObj.AppCustObj.IsShareholder) {
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MrJobPositionCode = this.CustMainDataForm.controls.MrJobPositionCode.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.SharePrcnt = this.CustMainDataForm.controls.SharePrcnt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsSigner = this.CustMainDataForm.controls.IsSigner.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      //this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.rowVersionMgmntShrholder;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustMainDataForm.value.lookupCustomer.value;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.MrCustTypeCode = this.MrCustTypeCode;
      this.custDataPersonalObj.AppCustCompanyMgmntShrholderObj.CustNo = this.CustMainDataForm.controls.CustNo.value;
    }

    this.custDataPersonalObj.AppCustObj.RowVersion = this.rowVersionAppCust;
    this.custDataPersonalObj.AppCustPersonalObj.RowVersion = this.rowVersionAppCustPersonal;
    this.custDataPersonalObj.AppCustAddrLegalObj.RowVersion = this.rowVersionAppCustAddr;
  }

  setDataCustomerCompanyForSave() {
    if (this.MrCustTypeCode != CommonConstant.CustTypeCompany) return;
    this.custDataCompanyObj = new CustMainDataCompanyObj();
    this.custDataCompanyObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
    this.custDataCompanyObj.AppCustObj.CustName = this.CustMainDataForm.value.lookupCustomerCoy.value;
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
    this.custDataCompanyObj.AppCustObj.MrCustModelCode = this.MrCustModelCode;

    if (this.isIncludeCustRelation)
      this.custDataCompanyObj.AppCustObj.MrCustRelationshipCode = this.CustMainDataForm.controls.MrCustRelationshipCode.value;

    this.custDataCompanyObj.AppCustCompanyObj.CompanyBrandName = this.CustMainDataForm.value.lookupCustomerCoy.value;
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
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsActive = this.CustMainDataForm.controls.IsActive.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.IsOwner = this.CustMainDataForm.controls.IsOwner.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustMainDataForm.controls.EstablishmentDt.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustMainDataForm.value.lookupCustomerCoy.value;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.MrCustTypeCode = this.MrCustTypeCode;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.RowVersion = this.rowVersionMgmntShrholder;
      this.custDataCompanyObj.AppCustCompanyMgmntShrholderObj.CustNo = this.CustMainDataForm.controls.CustNo.value;
    }

    this.custDataCompanyObj.AppCustObj.RowVersion = this.rowVersionAppCust;
    this.custDataCompanyObj.AppCustCompanyObj.RowVersion = this.rowVersionAppCustCompany;
    this.custDataCompanyObj.AppCustAddrLegalObj.RowVersion = this.rowVersionAppCustAddr;
  }

  CekIsCustomer() {
    if (this.custMainDataMode != CommonConstant.CustMainDataModeCust) {
      // if (this.CustMainDataForm.controls.CustNo.value == this.AppCustData.CustNo) {
      //   throw this.toastr.warningMessage(ExceptionConstant.CANT_CHOOSE_ALREADY_SELFCUST_FOR_THIS_NAP);
      // }

      // Sementara
      var TempCust1 = "";
      if (this.MrCustTypeCode == 'PERSONAL')
        TempCust1 = this.CustMainDataForm.value.lookupCustomer.value.toLowerCase();
      else {
        TempCust1 = this.CustMainDataForm.value.lookupCustomerCoy.value.toLowerCase();
      }
      const TempCust2 = this.AppCustData.CustName.toLowerCase();
      if (TempCust1 == TempCust2) {
        this.toastr.warningMessage(ExceptionConstant.CANT_CHOOSE_ALREADY_SELFCUST_FOR_THIS_NAP);
        return true;
      }
    }
    return false;
  }

  async SaveForm() {
    if (this.CekIsCustomer()) return;
    let max17Yodt = new Date(this.MaxDate);
    let d1 = new Date(this.CustMainDataForm.controls.BirthDt.value);
    let d2 = new Date(this.MaxDate);
    max17Yodt.setFullYear(d2.getFullYear() - 17);

    if (d1 > max17Yodt) {
      this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
      return;
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.setDataCustomerPersonalForSave();
      if (this.appCustId == null || this.appCustId == 0) {
        this.http.post(URLConstant.AddCustMainDataPersonal, this.custDataPersonalObj).subscribe(
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
        this.http.post(URLConstant.EditCustMainDataPersonal, this.custDataPersonalObj).subscribe(
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
      this.setDataCustomerCompanyForSave();
      console.log(this.custDataCompanyObj);
      if (this.appCustId == null || this.appCustId == 0) {
        this.http.post(URLConstant.AddCustMainDataCompanyData, this.custDataCompanyObj).subscribe(
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
        this.http.post(URLConstant.EditCustMainDataCompanyData, this.custDataCompanyObj).subscribe(
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
    if (this.CustMainDataForm.get("MrCustTypeCode").value == CommonConstant.CustTypeCompany) {
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
    console.log('richard check');
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
      response.AppCustObj = {
        CustNo: resp.CustObj.CustNo,
        CustName: resp.CustObj.CustName,
        MrCustTypeCode: resp.CustObj.MrCustTypeCode,
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
}