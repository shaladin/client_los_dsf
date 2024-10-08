import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { formatDate } from '@angular/common';
import { LeadCustAddrObj } from 'app/shared/model/request/lead/lead-cust-addr-obj.model';
import { LeadCustSocmedObj } from 'app/shared/model/request/lead/lead-cust-socmed-obj.model';
import { LeadCustObj } from 'app/shared/model/request/lead/lead-cust-obj.model';
import { LeadCustPersonalObj } from 'app/shared/model/request/lead/lead-cust-personal-obj.model';
import { LeadCustPersonalFinDataObj } from 'app/shared/model/request/lead/lead-cust-personal-fin-data-obj.model';
import { LeadCustPersonalJobDataObj } from 'app/shared/model/request/lead/lead-cust-personal-job-data-obj.model';
import { RefProfessionObj } from 'app/shared/model/ref-profession-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { LeadObj } from 'app/shared/model/lead.model';
import { ThirdPartyResultHForFraudChckObj } from 'app/shared/model/third-party-result-h-for-fraud-chck-obj.model';
import { LeadCustCompareObj } from 'app/shared/model/lead-cust-compare-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { String } from 'typescript-string-operations';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ReqInputLeadCustPersonalObj } from 'app/shared/model/request/lead/req-add-edit-input-lead-cust-personal-obj.model';
import { ResThirdPartyRsltHObj } from 'app/shared/model/response/third-party-result/res-third-party-rslt-h-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ResGeneralSettingObj, ResListGeneralSettingObj } from 'app/shared/model/response/general-setting/res-general-setting-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { CustomPatternObj } from 'app/shared/model/custom-pattern-obj.model';
import { RegexService } from 'app/shared/services/regex.services';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';

@Component({
  selector: 'app-lead-input-cust-data',
  templateUrl: './lead-input-cust-data.component.html',
  providers: [NGXToastrService, RegexService]
})

export class LeadInputCustDataComponent implements OnInit {
  @Input() LeadId: string;
  @Input() showCancelButton: boolean = true;
  @Output() outputTab: EventEmitter<object> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  businessDt: Date = new Date();
  CopyFrom: string;
  rowVersion: string;
  typePage: string;
  WfTaskListId: any;
  inputLegalAddressObj: InputFieldObj;
  inputResidenceAddressObj: InputFieldObj;
  tempProfession: string;
  professionLookUpObj: InputLookupObj;
  legalAddressObj: LeadCustAddrObj;
  residenceAddressObj: LeadCustAddrObj;
  idTypeCode: RefMasterObj;
  tempIdType: Array<KeyValueObj>;
  maritalStatCode: RefMasterObj;
  tempMrMaritalStatCode: Array<KeyValueObj>;
  custModel: ReqRefMasterByTypeCodeAndMappingCodeObj;
  listCustModel: Array<KeyValueObj>;
  leadInputObj: ReqInputLeadCustPersonalObj;
  leadCustFacebookObj: LeadCustSocmedObj;
  leadCustInstagramObj: LeadCustSocmedObj;
  leadCustTwitterObj: LeadCustSocmedObj;
  genderType: RefMasterObj;
  tempGender: Array<KeyValueObj>;
  reqLeadCustObj: LeadCustObj;
  resLeadCustObj: LeadCustObj;
  reqLeadCustPersonalObj: LeadCustPersonalObj;
  resLeadCustPersonalObj: LeadCustPersonalObj;
  reqLeadCustPersonalJobDataObj: LeadCustPersonalJobDataObj;
  resLeadCustPersonalJobDataObj: LeadCustPersonalJobDataObj;
  reqLeadCustPersonalFinDataObj: LeadCustPersonalFinDataObj;
  resLeadCustPersonalFinDataObj: LeadCustPersonalFinDataObj;
  reqLeadCustAddrLegalObj: LeadCustAddrObj;
  resLeadCustAddrLegalObj: LeadCustAddrObj;
  reqLeadCustAddrResObj: LeadCustAddrObj;
  resLeadCustAddrResObj: LeadCustAddrObj;
  refProfessionObj: RefProfessionObj;
  returnRefProfessionObj: RefProfessionObj;
  reqLeadCustSocmedObj: LeadCustSocmedObj;
  resLeadCustSocmedObj: Array<LeadCustSocmedObj>;
  CustModelKey: string = "";
  @ViewChild("ProfessionModal", { read: ViewContainerRef }) professionModal: ViewContainerRef;
  @ViewChild("enjiForm") enjiForm: NgForm;
  CustomerDataForm = this.fb.group({
    CustType: [''],
    Gender: [''],
    CustName: [''],
    BirthPlace: [''],
    BirthDate: [''],
    MrIdTypeCode: [''],
    MotherName: ['', [Validators.required]],
    IdNo: [''],
    MrMaritalStatCode: ['', [Validators.required]],
    Npwp: ['', [Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
    Email: ['', [Validators.required, Validators.pattern(CommonConstant.regexEmail)]],
    MobilePhone1: ['', [Validators.pattern("^[0-9]+$")]],
    MobilePhone2: ['', Validators.pattern("^[0-9]+$")],
    Facebook: [''],
    Instagram: [''],
    Twitter: [''],
    CustModel: [''],
    CompanyName: [''],
    MonthlyIncome: [0, [Validators.required, Validators.min(1.00)]],
    MonthlyExpense: [0]
  });
  inputAddressObjForLegalAddr: InputAddressObj;
  inputAddressObjForResidenceAddr: InputAddressObj;
  generalSettingObj: GenericListByCodeObj;
  returnGeneralSettingObj: Array<ResGeneralSettingObj>;
  isNeedCheckBySystem: string;
  isUseDigitalization: string;
  IsSvcExist: boolean = false;
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  leadObj: LeadObj;
  returnLeadObj: Object;
  thirdPartyObj: ThirdPartyResultHForFraudChckObj;
  leadNo: string;
  latestReqDtCheckIntegrator: Date;
  thirdPartyRsltHId: number;
  reqLatestJson: any;
  latestCustDataObj: LeadCustCompareObj;
  dmsObj: DMSObj;
  Max17YO: Date;
  context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver,
    private claimTaskService: ClaimTaskService,
    private regexService: RegexService,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      if (params["mode"] != null) {
        this.typePage = params["mode"];
      }
      if (params["CopyFrom"] != null) {
        this.CopyFrom = params["CopyFrom"];
      }
      if (params["WfTaskListId"] != null) {
        this.WfTaskListId = params["WfTaskListId"];
      }
    });
  }

  getLookUpProfession(event) {
    this.tempProfession = event.ProfessionCode;
  }

  custModelChange(event) {
    this.CustModelKey = this.listCustModel.find(x => x.Key == event.target.value).Key;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
    this.professionModal.clear();
    this.professionLookUpObj.nameSelect = "";
    this.professionLookUpObj.jsonSelect = "";
    this.tempProfession = "";
    const component = this.professionModal.createComponent(componentFactory);
    component.instance.lookupInput = this.professionLookUpObj;
    component.instance.parentForm = this.CustomerDataForm;
    component.instance.enjiForm = this.enjiForm;
    component.instance.identifier = 'MrJobProfessionCode';
    component.instance.lookup.subscribe((e) => this.getLookUpProfession(e));
    let arrAddCrit = new Array();
    let addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "MR_CUST_MODEL_CODE";
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = this.CustModelKey;
    arrAddCrit.push(addCrit);
    this.professionLookUpObj.addCritInput = arrAddCrit;
  }

  ClaimTask() {
    if(environment.isCore){	
      if(this.WfTaskListId!= "" && this.WfTaskListId!= undefined){	
          this.claimTaskService.ClaimTaskV2(this.WfTaskListId);	
      }	
    }	
    else if (this.WfTaskListId> 0) {	
        this.claimTaskService.ClaimTask(this.WfTaskListId);	
    }
  }

  async ngOnInit() : Promise<void> {
    this.businessDt = new Date(this.context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);
    this.Max17YO = new Date(this.context.BusinessDt);
    this.Max17YO.setFullYear(new Date(this.context.BusinessDt).getFullYear() - 17);

    this.customPattern = new Array<CustomPatternObj>();
    this.inputAddressObjForLegalAddr = new InputAddressObj();
    this.inputAddressObjForLegalAddr.showSubsection = false;
    this.inputAddressObjForLegalAddr.title = "Legal Address";
    this.inputAddressObjForLegalAddr.showPhn3 = false;
    this.inputAddressObjForLegalAddr.showOwnership = false;

    this.inputAddressObjForResidenceAddr = new InputAddressObj();
    this.inputAddressObjForResidenceAddr.showSubsection = false;
    this.inputAddressObjForResidenceAddr.title = "Residence Address";
    this.inputAddressObjForResidenceAddr.showPhn3 = false;
    this.inputAddressObjForResidenceAddr.showOwnership = false;

    this.InitDms();
    this.ClaimTask();

    this.inputLegalAddressObj = new InputFieldObj();
    this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
    this.inputResidenceAddressObj = new InputFieldObj();
    this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
    this.professionLookUpObj = new InputLookupObj();
    this.professionLookUpObj.isRequired = false;
    this.professionLookUpObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.professionLookUpObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.isRequired = true;


    this.generalSettingObj = new GenericListByCodeObj();
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization);
    this.http.post<ResListGeneralSettingObj>(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).subscribe(
      (response) => {
        this.returnGeneralSettingObj = response['ResGetListGeneralSettingObj'];
        let gsNeedCheckBySystem = this.returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        let gsUseDigitalization = this.returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);

        if (gsNeedCheckBySystem != undefined) {
          this.isNeedCheckBySystem = gsNeedCheckBySystem.GsValue;
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if (gsUseDigitalization != undefined) {
          this.isUseDigitalization = gsUseDigitalization.GsValue;
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }

        this.leadObj = new LeadObj();
        this.leadObj.LeadId = parseInt(this.LeadId);
        let leadObj = { Id: this.LeadId };
        this.http.post(URLConstant.GetLeadNoByLeadId, leadObj).subscribe(
          (response: GenericObj) => {
            this.returnLeadObj = response;
            this.leadNo = response.TrxNo;

            this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
            this.thirdPartyObj.TrxTypeCode = CommonConstant.LEAD_TRX_TYPE_CODE;
            this.thirdPartyObj.TrxNo = this.leadNo;
            this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_CUST;
            if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0") {
              this.getDigitalizationSvcType();
              this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
                (response: ResThirdPartyRsltHObj) => {
                  this.latestReqDtCheckIntegrator = response.ReqDt;
                  this.thirdPartyRsltHId = response.ThirdPartyRsltHId;
                  this.reqLatestJson = JSON.parse(response.ReqJson);
                  if (this.reqLatestJson != null && this.reqLatestJson != "") {
                    //   this.latestCheckChassisNo = this.reqLatestJson['AppAssetObj'][0]['SerialNo1'];
                    this.latestCustDataObj = new LeadCustCompareObj();
                    this.latestCustDataObj.CustName = this.reqLatestJson['CustName'];
                    this.latestCustDataObj.Gender = this.reqLatestJson['Gender'];
                    this.latestCustDataObj.BirthPlace = this.reqLatestJson['BirthPlace'];
                    this.latestCustDataObj.BirthDt = formatDate(new Date(this.reqLatestJson['BirthDt']), 'yyyy-MM-dd', 'en-US');
                    this.latestCustDataObj.MaritalStatus = this.reqLatestJson['MaritalStatus'];
                    this.latestCustDataObj.CustPhnNo = this.reqLatestJson['CustPhnNo'];
                    this.latestCustDataObj.CustEmail = this.reqLatestJson['CustEmail'];
                    this.latestCustDataObj.IdNo = this.reqLatestJson['IdNo'];
                    this.latestCustDataObj.IdType = this.reqLatestJson['IdType'];
                    this.latestCustDataObj.TaxNo = this.reqLatestJson['TaxNo'];
                    this.latestCustDataObj.Profession = this.reqLatestJson['Profession'];
                    this.latestCustDataObj.HomeAddr = this.reqLatestJson['HomeAddr'];
                    this.latestCustDataObj.HomeRt = this.reqLatestJson['HomeRt'];
                    this.latestCustDataObj.HomeRw = this.reqLatestJson['HomeRw'];
                    this.latestCustDataObj.HomeZipCode = this.reqLatestJson['HomeZipCode'];
                    this.latestCustDataObj.HomeKelurahan = this.reqLatestJson['HomeKelurahan'];
                    this.latestCustDataObj.HomeKecamatan = this.reqLatestJson['HomeKecamatan'];
                    this.latestCustDataObj.HomeCity = this.reqLatestJson['HomeCity'];
                  }
                }
              );
            }
          }
        );
      }
    );
    this.genderType = new RefMasterObj();
    this.genderType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeGender;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.genderType).subscribe(
      (response) => {
        this.tempGender = response[CommonConstant.ReturnObj];
        this.CustomerDataForm.patchValue({ Gender: this.tempGender[0].Key });
      }
    );

    this.idTypeCode = new RefMasterObj();
    this.idTypeCode.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.idTypeCode).subscribe(
      (response) => {
        this.tempIdType = response[CommonConstant.ReturnObj];
        this.CustomerDataForm.patchValue({ MrIdTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
        this.ChangeIdType(response[CommonConstant.ReturnObj][0]['Key']);
      });

    this.maritalStatCode = new RefMasterObj();
    this.maritalStatCode.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeMaritalStat;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.maritalStatCode).subscribe(
      (response) => {
        this.tempMrMaritalStatCode = response[CommonConstant.ReturnObj];
        this.CustomerDataForm.patchValue({ MrMaritalStatCode: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.custModel = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    this.custModel.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustModel;
    this.custModel.MappingCode = CommonConstant.CustTypePersonal;
    this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, this.custModel).subscribe(
      (response) => {
        this.listCustModel = response[CommonConstant.ReturnObj];
        this.CustomerDataForm.patchValue({ CustModel: response[CommonConstant.ReturnObj][0]['Key'] });
        this.CustModelKey = response[CommonConstant.ReturnObj][0]['Key'];
        let arrAddCrit = new Array();
        let addCrit = new CriteriaObj();
        addCrit.DataType = "text";
        addCrit.propName = "MR_CUST_MODEL_CODE";
        addCrit.restriction = AdInsConstant.RestrictionEq;
        addCrit.value = this.CustModelKey;
        arrAddCrit.push(addCrit);
        this.professionLookUpObj.addCritInput = arrAddCrit;

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
        this.professionModal.clear();
        this.professionLookUpObj.nameSelect = "";
        const component = this.professionModal.createComponent(componentFactory);
        component.instance.lookupInput = this.professionLookUpObj;
        component.instance.parentForm = this.CustomerDataForm;
        component.instance.enjiForm = this.enjiForm;
        component.instance.identifier = 'MrJobProfessionCode';
        component.instance.lookup.subscribe((e) => this.getLookUpProfession(e));
      });

    if (this.CopyFrom != null) {
      this.reqLeadCustObj = new LeadCustObj();
      this.reqLeadCustObj.LeadId = this.CopyFrom;
      let objLeadCust = { Id: this.CopyFrom };
      this.http.post(URLConstant.GetLeadCustByLeadId, objLeadCust).subscribe(
        (response: LeadCustObj) => {
          this.resLeadCustObj = response;
          this.CustomerDataForm.patchValue({
            CustName: this.resLeadCustObj.CustName,
            MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
            CustModel: this.resLeadCustObj.MrCustModelCode,
            IdNo: this.resLeadCustObj.IdNo,
            Npwp: this.resLeadCustObj.TaxIdNo,
          });
          this.ChangeIdType(this.resLeadCustObj.MrIdTypeCode);
          this.CustModelKey = this.resLeadCustObj.MrCustModelCode;
          let arrAddCrit = new Array();
          let addCrit = new CriteriaObj();
          addCrit.DataType = "text";
          addCrit.propName = "MR_CUST_MODEL_CODE";
          addCrit.restriction = AdInsConstant.RestrictionEq;
          addCrit.value = this.CustModelKey;
          arrAddCrit.push(addCrit);
          this.professionLookUpObj.addCritInput = arrAddCrit;

          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
          this.professionModal.clear();
          this.professionLookUpObj.nameSelect = "";
          const component = this.professionModal.createComponent(componentFactory);
          component.instance.lookupInput = this.professionLookUpObj;
          component.instance.parentForm = this.CustomerDataForm;
          component.instance.enjiForm = this.enjiForm;
          component.instance.identifier = 'MrJobProfessionCode';
          component.instance.lookup.subscribe((e) => this.getLookUpProfession(e));

          this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
          this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          let objListLeadCustSocmed = { Id: this.resLeadCustObj.LeadCustId };
          this.http.post(URLConstant.GetListLeadCustSocmedByLeadCustId, objListLeadCustSocmed).subscribe(
            (response) => {
              this.resLeadCustSocmedObj = response[CommonConstant.ReturnObj];
              this.CustomerDataForm.patchValue({
                Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
              });
            });

          let objLeadCustAddrLegalObj: GenericObj = new GenericObj();
          objLeadCustAddrLegalObj.Id = this.resLeadCustObj.LeadCustId;
          objLeadCustAddrLegalObj.Code = CommonConstant.AddrTypeLegal;
          this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, objLeadCustAddrLegalObj).subscribe(
            (response: LeadCustAddrObj) => {
              this.resLeadCustAddrLegalObj = response;
              this.legalAddressObj = new LeadCustAddrObj();
              this.legalAddressObj.Addr = this.resLeadCustAddrLegalObj.Addr;
              this.legalAddressObj.AreaCode3 = this.resLeadCustAddrLegalObj.AreaCode3;
              this.legalAddressObj.AreaCode4 = this.resLeadCustAddrLegalObj.AreaCode4;
              this.legalAddressObj.AreaCode1 = this.resLeadCustAddrLegalObj.AreaCode1;
              this.legalAddressObj.AreaCode2 = this.resLeadCustAddrLegalObj.AreaCode2;
              this.legalAddressObj.City = this.resLeadCustAddrLegalObj.City;
              this.legalAddressObj.PhnArea1 = this.resLeadCustAddrLegalObj.PhnArea1;
              this.legalAddressObj.Phn1 = this.resLeadCustAddrLegalObj.Phn1;
              this.legalAddressObj.PhnExt1 = this.resLeadCustAddrLegalObj.PhnExt1;
              this.legalAddressObj.PhnArea2 = this.resLeadCustAddrLegalObj.PhnArea2;
              this.legalAddressObj.Phn2 = this.resLeadCustAddrLegalObj.Phn2;
              this.legalAddressObj.PhnExt2 = this.resLeadCustAddrLegalObj.PhnExt2;
              this.legalAddressObj.FaxArea = this.resLeadCustAddrLegalObj.FaxArea;
              this.legalAddressObj.Fax = this.resLeadCustAddrLegalObj.Fax;
              this.legalAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrLegalObj.MrHouseOwnershipCode;

              this.inputLegalAddressObj = new InputFieldObj();
              this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
              this.inputLegalAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrLegalObj.Zipcode;
              this.inputLegalAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrLegalObj.Zipcode };
              this.inputAddressObjForLegalAddr.default = this.legalAddressObj;
              this.inputAddressObjForLegalAddr.inputField = this.inputLegalAddressObj;
            });

          let objLeadCustAddrResObj: GenericObj = new GenericObj();
          objLeadCustAddrResObj.Id = this.resLeadCustObj.LeadCustId;
          objLeadCustAddrResObj.Code = CommonConstant.AddrTypeResidence;
          this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, objLeadCustAddrResObj).subscribe(
            (response: LeadCustAddrObj) => {
              this.resLeadCustAddrResObj = response;
              this.residenceAddressObj = new LeadCustAddrObj();
              this.residenceAddressObj.Addr = this.resLeadCustAddrResObj.Addr;
              this.residenceAddressObj.AreaCode3 = this.resLeadCustAddrResObj.AreaCode3;
              this.residenceAddressObj.AreaCode4 = this.resLeadCustAddrResObj.AreaCode4;
              this.residenceAddressObj.AreaCode1 = this.resLeadCustAddrResObj.AreaCode1;
              this.residenceAddressObj.AreaCode2 = this.resLeadCustAddrResObj.AreaCode2;
              this.residenceAddressObj.City = this.resLeadCustAddrResObj.City;
              this.residenceAddressObj.PhnArea1 = this.resLeadCustAddrResObj.PhnArea1;
              this.residenceAddressObj.Phn1 = this.resLeadCustAddrResObj.Phn1;
              this.residenceAddressObj.PhnExt1 = this.resLeadCustAddrResObj.PhnExt1;
              this.residenceAddressObj.PhnArea2 = this.resLeadCustAddrResObj.PhnArea2;
              this.residenceAddressObj.Phn2 = this.resLeadCustAddrResObj.Phn2;
              this.residenceAddressObj.PhnExt2 = this.resLeadCustAddrResObj.PhnExt2;
              this.residenceAddressObj.FaxArea = this.resLeadCustAddrResObj.FaxArea;
              this.residenceAddressObj.Fax = this.resLeadCustAddrResObj.Fax;
              this.residenceAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrResObj.MrHouseOwnershipCode;

              this.inputResidenceAddressObj = new InputFieldObj();
              this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
              this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrResObj.Zipcode;
              this.inputResidenceAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrResObj.Zipcode };

              this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
              this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;
            });

          this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
          this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          let objLeadCustPersonal = { Id: this.resLeadCustObj.LeadCustId };
          this.http.post(URLConstant.GetLeadCustPersonalByLeadCustId, objLeadCustPersonal).subscribe(
            (response: LeadCustPersonalObj) => {
              this.resLeadCustPersonalObj = response;
              this.CustomerDataForm.patchValue({
                Gender: this.resLeadCustPersonalObj.MrGenderCode,
                BirthPlace: this.resLeadCustPersonalObj.BirthPlace,
                BirthDate: formatDate(this.resLeadCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
                MotherName: this.resLeadCustPersonalObj.MotherMaidenName,
                MrMaritalStatCode: this.resLeadCustPersonalObj.MrMaritalStatCode,
                Email: this.resLeadCustPersonalObj.Email1,
                MobilePhone1: this.resLeadCustPersonalObj.MobilePhnNo1,
                MobilePhone2: this.resLeadCustPersonalObj.MobilePhnNo2,
              });

              this.reqLeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
              this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              let objLeadCustPersonalJobData = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
              this.http.post(URLConstant.GetLeadCustPersonalJobDataByLeadCustPersonalId, objLeadCustPersonalJobData).subscribe(
                (response: LeadCustPersonalJobDataObj) => {
                  this.resLeadCustPersonalJobDataObj = response;
                  this.CustomerDataForm.patchValue({
                    CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                  });

                  this.refProfessionObj = new RefProfessionObj();
                  this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                  this.http.post(URLConstant.GetRefProfessionByCode, { Code: this.resLeadCustPersonalJobDataObj.MrProfessionCode }).subscribe(
                    (response: RefProfessionObj) => {
                      this.returnRefProfessionObj = response;
                      this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                      this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                      this.tempProfession = this.returnRefProfessionObj.ProfessionCode;
                    });
                });

              this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
              this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              let objCustPersonalFinData = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
              this.http.post(URLConstant.GetLeadCustPersonalFinDataByLeadCustPersonalId, objCustPersonalFinData).subscribe(
                (response: LeadCustPersonalFinDataObj) => {
                  this.resLeadCustPersonalFinDataObj = response;
                  this.CustomerDataForm.patchValue({
                    MonthlyIncome: this.resLeadCustPersonalFinDataObj.MonthlyIncomeAmt,
                    MonthlyExpense: this.resLeadCustPersonalFinDataObj.MonthlyExpenseAmt,
                  });
                });
            });
        });
    }

    if (this.typePage == "edit" || this.typePage == "update") {
      this.reqLeadCustObj = new LeadCustObj();
      this.reqLeadCustObj.LeadId = this.LeadId;
      let objLeadCust1 = { Id: this.LeadId };
      this.http.post(URLConstant.GetLeadCustByLeadId, objLeadCust1).subscribe(
        (response: LeadCustObj) => {
          this.resLeadCustObj = response;

          if (this.resLeadCustObj.LeadId != 0) {
            this.CustomerDataForm.patchValue({
              CustName: this.resLeadCustObj.CustName,
              MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
              CustModel: this.resLeadCustObj.MrCustModelCode,
              IdNo: this.resLeadCustObj.IdNo,
              Npwp: this.resLeadCustObj.TaxIdNo,
            });
            this.ChangeIdType(this.resLeadCustObj.MrIdTypeCode);
            this.CustModelKey = this.resLeadCustObj.MrCustModelCode;
            let arrAddCrit = new Array();
            let addCrit = new CriteriaObj();
            addCrit.DataType = "text";
            addCrit.propName = "MR_CUST_MODEL_CODE";
            addCrit.restriction = AdInsConstant.RestrictionEq;
            addCrit.value = this.CustModelKey;
            arrAddCrit.push(addCrit);
            this.professionLookUpObj.addCritInput = arrAddCrit;

            this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
            this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
            let objListLeadCustSocmed1 = { Id: this.resLeadCustObj.LeadCustId };
            this.http.post(URLConstant.GetListLeadCustSocmedByLeadCustId, objListLeadCustSocmed1).subscribe(
              (response) => {
                this.resLeadCustSocmedObj = response[CommonConstant.ReturnObj];
                this.CustomerDataForm.patchValue({
                  Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                  Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                  Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
                });
              });

            let objLeadCustAddrLegalObj: GenericObj = new GenericObj();
            objLeadCustAddrLegalObj.Id = this.resLeadCustObj.LeadCustId;
            objLeadCustAddrLegalObj.Code = CommonConstant.AddrTypeLegal;
            this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, objLeadCustAddrLegalObj).subscribe(
              (response: LeadCustAddrObj) => {
                this.resLeadCustAddrLegalObj = response;

                this.legalAddressObj = new LeadCustAddrObj();
                this.legalAddressObj.Addr = this.resLeadCustAddrLegalObj.Addr;
                this.legalAddressObj.AreaCode3 = this.resLeadCustAddrLegalObj.AreaCode3;
                this.legalAddressObj.AreaCode4 = this.resLeadCustAddrLegalObj.AreaCode4;
                this.legalAddressObj.AreaCode1 = this.resLeadCustAddrLegalObj.AreaCode1;
                this.legalAddressObj.AreaCode2 = this.resLeadCustAddrLegalObj.AreaCode2;
                this.legalAddressObj.City = this.resLeadCustAddrLegalObj.City;
                this.legalAddressObj.PhnArea1 = this.resLeadCustAddrLegalObj.PhnArea1;
                this.legalAddressObj.Phn1 = this.resLeadCustAddrLegalObj.Phn1;
                this.legalAddressObj.PhnExt1 = this.resLeadCustAddrLegalObj.PhnExt1;
                this.legalAddressObj.PhnArea2 = this.resLeadCustAddrLegalObj.PhnArea2;
                this.legalAddressObj.Phn2 = this.resLeadCustAddrLegalObj.Phn2;
                this.legalAddressObj.PhnExt2 = this.resLeadCustAddrLegalObj.PhnExt2;
                this.legalAddressObj.FaxArea = this.resLeadCustAddrLegalObj.FaxArea;
                this.legalAddressObj.Fax = this.resLeadCustAddrLegalObj.Fax;
                this.legalAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrLegalObj.MrHouseOwnershipCode;

                this.inputLegalAddressObj = new InputFieldObj();
                this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
                this.inputLegalAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrLegalObj.Zipcode;
                this.inputLegalAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrLegalObj.Zipcode };
                this.inputAddressObjForLegalAddr.default = this.legalAddressObj;
                this.inputAddressObjForLegalAddr.inputField = this.inputLegalAddressObj;
              });

            let objLeadCustAddrResObj: GenericObj = new GenericObj();
            objLeadCustAddrResObj.Id = this.resLeadCustObj.LeadCustId;
            objLeadCustAddrResObj.Code = CommonConstant.AddrTypeResidence;
            this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, objLeadCustAddrResObj).subscribe(
              (response: LeadCustAddrObj) => {
                this.resLeadCustAddrResObj = response;

                this.residenceAddressObj = new LeadCustAddrObj();
                this.residenceAddressObj.Addr = this.resLeadCustAddrResObj.Addr;
                this.residenceAddressObj.AreaCode3 = this.resLeadCustAddrResObj.AreaCode3;
                this.residenceAddressObj.AreaCode4 = this.resLeadCustAddrResObj.AreaCode4;
                this.residenceAddressObj.AreaCode1 = this.resLeadCustAddrResObj.AreaCode1;
                this.residenceAddressObj.AreaCode2 = this.resLeadCustAddrResObj.AreaCode2;
                this.residenceAddressObj.City = this.resLeadCustAddrResObj.City;
                this.residenceAddressObj.PhnArea1 = this.resLeadCustAddrResObj.PhnArea1;
                this.residenceAddressObj.Phn1 = this.resLeadCustAddrResObj.Phn1;
                this.residenceAddressObj.PhnExt1 = this.resLeadCustAddrResObj.PhnExt1;
                this.residenceAddressObj.PhnArea2 = this.resLeadCustAddrResObj.PhnArea2;
                this.residenceAddressObj.Phn2 = this.resLeadCustAddrResObj.Phn2;
                this.residenceAddressObj.PhnExt2 = this.resLeadCustAddrResObj.PhnExt2;
                this.residenceAddressObj.FaxArea = this.resLeadCustAddrResObj.FaxArea;
                this.residenceAddressObj.Fax = this.resLeadCustAddrResObj.Fax;
                this.residenceAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrResObj.MrHouseOwnershipCode;

                this.inputResidenceAddressObj = new InputFieldObj();
                this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
                this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrResObj.Zipcode;
                this.inputResidenceAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrResObj.Zipcode };
                this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
                this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;
              });

            this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
            this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
            let objLeadCustPersonal1 = { Id: this.resLeadCustObj.LeadCustId };
            this.http.post(URLConstant.GetLeadCustPersonalByLeadCustId, objLeadCustPersonal1).subscribe(
              (response: LeadCustPersonalObj) => {
                this.resLeadCustPersonalObj = response;
                this.CustomerDataForm.patchValue({
                  Gender: this.resLeadCustPersonalObj.MrGenderCode,
                  BirthPlace: this.resLeadCustPersonalObj.BirthPlace,
                  BirthDate: formatDate(this.resLeadCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
                  MotherName: this.resLeadCustPersonalObj.MotherMaidenName,
                  MrMaritalStatCode: this.resLeadCustPersonalObj.MrMaritalStatCode,
                  Email: this.resLeadCustPersonalObj.Email1,
                  MobilePhone1: this.resLeadCustPersonalObj.MobilePhnNo1,
                  MobilePhone2: this.resLeadCustPersonalObj.MobilePhnNo2,
                });

                this.reqLeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
                this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
                let objLeadCustPersonalJobData1 = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
                this.http.post(URLConstant.GetLeadCustPersonalJobDataByLeadCustPersonalId, objLeadCustPersonalJobData1).subscribe(
                  (response: LeadCustPersonalJobDataObj) => {
                    this.resLeadCustPersonalJobDataObj = response;
                    this.CustomerDataForm.patchValue({
                      CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                    });
                    this.refProfessionObj = new RefProfessionObj();
                    this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                    this.http.post(URLConstant.GetRefProfessionByCode, { Code: this.resLeadCustPersonalJobDataObj.MrProfessionCode }).subscribe(
                      (response: RefProfessionObj) => {
                        this.returnRefProfessionObj = response;
                        this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                        this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                        this.tempProfession = this.returnRefProfessionObj.ProfessionCode;

                        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
                        this.professionModal.clear();
                        const component = this.professionModal.createComponent(componentFactory);
                        component.instance.lookupInput = this.professionLookUpObj;
                        component.instance.parentForm = this.CustomerDataForm;
                        component.instance.enjiForm = this.enjiForm;
                        component.instance.identifier = 'MrJobProfessionCode';
                        component.instance.lookup.subscribe((e) => this.getLookUpProfession(e));
                      });
                  });

                this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
                this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
                let objCustPersonalFinData1 = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
                this.http.post(URLConstant.GetLeadCustPersonalFinDataByLeadCustPersonalId, objCustPersonalFinData1).subscribe(
                  (response: LeadCustPersonalFinDataObj) => {
                    this.resLeadCustPersonalFinDataObj = response;
                    this.CustomerDataForm.patchValue({
                      MonthlyIncome: this.resLeadCustPersonalFinDataObj.MonthlyIncomeAmt,
                      MonthlyExpense: this.resLeadCustPersonalFinDataObj.MonthlyExpenseAmt,
                    });
                  });
              });
          }

        });
    }

    await this.getLeadData();
  }

  InitDms() {
    this.dmsObj = new DMSObj();
    this.dmsObj.User = "Admin";
    this.dmsObj.Role = "SUPUSR";
    this.dmsObj.ViewCode = "ConfinsLead";

    this.dmsObj.MetadataObject.push(new DMSLabelValueObj("Lead Id", this.LeadId.toString()));
    this.dmsObj.Option.push(new DMSLabelValueObj("OverideSecurity", CommonConstant.DmsOverideUploadDownload));
  }

  setEnableZipcodeLookup() {
    this.inputAddressObjForLegalAddr.inputField.inputLookupObj.isDisable = false;
    this.inputAddressObjForLegalAddr.inputField.inputLookupObj.isReadonly = false;

    this.inputAddressObjForResidenceAddr.inputField.inputLookupObj.isDisable = false;
    this.inputAddressObjForResidenceAddr.inputField.inputLookupObj.isReadonly = false;
  }

  copyAddress() {
    this.residenceAddressObj = new LeadCustAddrObj();
    this.residenceAddressObj.Addr = this.CustomerDataForm.controls["legalAddress"]["controls"].Addr.value;
    this.residenceAddressObj.AreaCode3 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode3.value;
    this.residenceAddressObj.AreaCode4 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode4.value;
    this.residenceAddressObj.AreaCode1 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode1.value;
    this.residenceAddressObj.AreaCode2 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode2.value;
    this.residenceAddressObj.City = this.CustomerDataForm.controls["legalAddress"]["controls"].City.value;
    this.residenceAddressObj.PhnArea1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea1.value;
    this.residenceAddressObj.Phn1 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn1.value;
    this.residenceAddressObj.PhnExt1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt1.value;
    this.residenceAddressObj.PhnArea2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea2.value;
    this.residenceAddressObj.Phn2 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn2.value;
    this.residenceAddressObj.PhnExt2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt2.value;
    this.residenceAddressObj.FaxArea = this.CustomerDataForm.controls["legalAddress"]["controls"].FaxArea.value;
    this.residenceAddressObj.Fax = this.CustomerDataForm.controls["legalAddress"]["controls"].Fax.value;
    this.residenceAddressObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["legalAddress"]["controls"].MrHouseOwnershipCode.value;

    this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value;
    this.inputResidenceAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value };
    this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
    this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;

    this.setEnableZipcodeLookup();
  }

  setLegalAddr() {
    this.leadInputObj.LeadCustLegalAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal
    this.leadInputObj.LeadCustLegalAddrObj.Addr = this.CustomerDataForm.controls["legalAddress"]["controls"].Addr.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode3 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode3.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode4 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode4.value;
    this.leadInputObj.LeadCustLegalAddrObj.Zipcode = this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode1 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode1.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode2 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode2.value;
    this.leadInputObj.LeadCustLegalAddrObj.City = this.CustomerDataForm.controls["legalAddress"]["controls"].City.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnArea1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea1.value;
    this.leadInputObj.LeadCustLegalAddrObj.Phn1 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn1.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnExt1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt1.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnArea2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea2.value;
    this.leadInputObj.LeadCustLegalAddrObj.Phn2 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn2.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnExt2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt2.value;
    this.leadInputObj.LeadCustLegalAddrObj.FaxArea = this.CustomerDataForm.controls["legalAddress"]["controls"].FaxArea.value;
    this.leadInputObj.LeadCustLegalAddrObj.Fax = this.CustomerDataForm.controls["legalAddress"]["controls"].Fax.value;
    this.leadInputObj.LeadCustLegalAddrObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["legalAddress"]["controls"].MrHouseOwnershipCode.value;
  }

  setResidenceAddr() {
    this.leadInputObj.LeadCustResidenceAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence
    this.leadInputObj.LeadCustResidenceAddrObj.Addr = this.CustomerDataForm.controls["residenceAddress"]["controls"].Addr.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode3 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode3.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode4 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode4.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Zipcode = this.CustomerDataForm.controls["residenceAddressZipcode"]["controls"].value.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.City = this.CustomerDataForm.controls["residenceAddress"]["controls"].City.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnArea1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnArea1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Phn1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].Phn1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnExt1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnExt1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnArea2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnArea2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Phn2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].Phn2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnExt2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnExt2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.FaxArea = this.CustomerDataForm.controls["residenceAddress"]["controls"].FaxArea.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Fax = this.CustomerDataForm.controls["residenceAddress"]["controls"].Fax.value;
    this.leadInputObj.LeadCustResidenceAddrObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["residenceAddress"]["controls"].MrHouseOwnershipCode.value;
  }

  setLeadCust() {
    this.leadInputObj.LeadCustObj.MrCustTypeCode = CommonConstant.CustTypePersonal;
    this.leadInputObj.LeadCustObj.LeadId = this.LeadId;
    this.leadInputObj.LeadCustObj.CustName = this.CustomerDataForm.controls["CustName"].value;
    this.leadInputObj.LeadCustObj.MrIdTypeCode = this.CustomerDataForm.controls["MrIdTypeCode"].value;
    this.leadInputObj.LeadCustObj.MrCustModelCode = this.CustomerDataForm.controls["CustModel"].value;
    this.leadInputObj.LeadCustObj.IdNo = this.CustomerDataForm.controls["IdNo"].value;
    this.leadInputObj.LeadCustObj.TaxIdNo = this.CustomerDataForm.controls["Npwp"].value;
  }

  setLeadCustPersonal() {
    let isValid = true;
    let age = new Date(this.context.BusinessDt);
    age.setFullYear(new Date(this.CustomerDataForm.controls["BirthDate"].value).getFullYear())
    if ( age > this.Max17YO) {
      this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
      isValid = false;
    }

    this.leadInputObj.LeadCustPersonalObj.CustFullName = this.CustomerDataForm.controls["CustName"].value;
    this.leadInputObj.LeadCustPersonalObj.MrGenderCode = this.CustomerDataForm.controls["Gender"].value;
    this.leadInputObj.LeadCustPersonalObj.BirthPlace = this.CustomerDataForm.controls["BirthPlace"].value;
    this.leadInputObj.LeadCustPersonalObj.BirthDt = this.CustomerDataForm.controls["BirthDate"].value;
    this.leadInputObj.LeadCustPersonalObj.MotherMaidenName = this.CustomerDataForm.controls["MotherName"].value;
    this.leadInputObj.LeadCustPersonalObj.MrMaritalStatCode = this.CustomerDataForm.controls["MrMaritalStatCode"].value;
    this.leadInputObj.LeadCustPersonalObj.Email1 = this.CustomerDataForm.controls["Email"].value;
    this.leadInputObj.LeadCustPersonalObj.MobilePhnNo1 = this.CustomerDataForm.controls["MobilePhone1"].value;
    this.leadInputObj.LeadCustPersonalObj.MobilePhnNo2 = this.CustomerDataForm.controls["MobilePhone2"].value;

    return isValid;
  }

  setLeadCustSocmed() {
    this.leadCustFacebookObj = new LeadCustSocmedObj();
    this.leadCustFacebookObj.MrSocmedCode = CommonConstant.FACEBOOK;
    this.leadCustFacebookObj.MrSocmedName = "Facebook";
    this.leadCustFacebookObj.SocmedId = this.CustomerDataForm.controls["Facebook"].value;

    this.leadCustInstagramObj = new LeadCustSocmedObj();
    this.leadCustInstagramObj.MrSocmedCode = CommonConstant.INSTAGRAM;
    this.leadCustInstagramObj.MrSocmedName = "Instagram";
    this.leadCustInstagramObj.SocmedId = this.CustomerDataForm.controls["Instagram"].value;

    this.leadCustTwitterObj = new LeadCustSocmedObj();
    this.leadCustTwitterObj.MrSocmedCode = CommonConstant.TWITTER;
    this.leadCustTwitterObj.MrSocmedName = "Twitter";
    this.leadCustTwitterObj.SocmedId = this.CustomerDataForm.controls["Twitter"].value;

    if (this.CustomerDataForm.controls["Facebook"].value != "") {
      this.leadInputObj.LeadCustSocmedObj.push(this.leadCustFacebookObj);
    }
    if (this.CustomerDataForm.controls["Instagram"].value != "") {
      this.leadInputObj.LeadCustSocmedObj.push(this.leadCustInstagramObj);
    }
    if (this.CustomerDataForm.controls["Twitter"].value != "") {
      this.leadInputObj.LeadCustSocmedObj.push(this.leadCustTwitterObj);
    }
  }

  setLeadCustPersonalJobData() {
    this.leadInputObj.LeadCustPersonalJobDataObj.MrProfessionCode = this.tempProfession;
    this.leadInputObj.LeadCustPersonalJobDataObj.CompanyName = this.CustomerDataForm.controls["CompanyName"].value;
  }

  setLeadCustPersonalFinData() {
    this.leadInputObj.LeadCustPersonalFinDataObj.MonthlyIncomeAmt = this.CustomerDataForm.controls["MonthlyIncome"].value;
    let monthlyExpense = this.CustomerDataForm.controls["MonthlyExpense"].value;
    if (monthlyExpense == '') {
      this.leadInputObj.LeadCustPersonalFinDataObj.MonthlyExpenseAmt = 0;
    }
    else {
      this.leadInputObj.LeadCustPersonalFinDataObj.MonthlyExpenseAmt = monthlyExpense;
    }

  }

  SaveForm() {
    if (this.typePage == "edit" || this.typePage == "update") {
      if (this.resLeadCustObj.LeadCustId != 0) {
        this.leadInputObj = new ReqInputLeadCustPersonalObj();
        this.leadInputObj.LeadCustObj.LeadCustId = this.resLeadCustObj.LeadCustId;
        this.leadInputObj.LeadCustObj.RowVersion = this.resLeadCustObj.RowVersion;
        this.setLeadCust();
        this.leadInputObj.LeadCustPersonalObj.RowVersion = this.resLeadCustPersonalObj.RowVersion;
        if (!this.setLeadCustPersonal()) return;
        this.setLeadCustSocmed();
        this.leadInputObj.LeadCustLegalAddrObj.RowVersion = this.resLeadCustAddrLegalObj.RowVersion;
        this.setLegalAddr();
        this.leadInputObj.LeadCustResidenceAddrObj.RowVersion = this.resLeadCustAddrResObj.RowVersion;
        this.setResidenceAddr();
        this.leadInputObj.LeadCustPersonalJobDataObj.RowVersion = this.resLeadCustPersonalJobDataObj.RowVersion;
        this.setLeadCustPersonalJobData();
        this.leadInputObj.LeadCustPersonalFinDataObj.RowVersion = this.resLeadCustPersonalFinDataObj.RowVersion;
        this.setLeadCustPersonalFinData();
        if (this.confirmFraudCheck()) {
          this.http.post(URLConstant.EditLeadCust, this.leadInputObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.outputTab.emit({ stepMode: "next" });
            }
          );
        }
      } else {
        this.leadInputObj = new ReqInputLeadCustPersonalObj();
        this.setLeadCust();
        if (!this.setLeadCustPersonal()) return;
        this.setLeadCustSocmed();
        this.setLegalAddr();
        this.setResidenceAddr();
        this.setLeadCustPersonalJobData();
        this.setLeadCustPersonalFinData();
        if (this.confirmFraudCheck()) {
          this.http.post(URLConstant.AddLeadCust, this.leadInputObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.outputTab.emit({ stepMode: "next" });
            }
          );
        }
      }
    }
    else {
      this.leadInputObj = new ReqInputLeadCustPersonalObj();
      this.setLeadCust();
      if (!this.setLeadCustPersonal()) return;
      this.setLeadCustSocmed();
      this.setLegalAddr();
      this.setResidenceAddr();
      this.setLeadCustPersonalJobData();
      this.setLeadCustPersonalFinData();
      if (this.confirmFraudCheck()) {
        this.http.post(URLConstant.AddLeadCust, this.leadInputObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.outputTab.emit({ stepMode: "next" });
          });
      }
    }
  }

  async getLeadData() {
    this.reqLeadCustObj = new LeadCustObj();
    this.reqLeadCustObj.LeadId = this.LeadId;
    let objLeadCust2 = { Id: this.LeadId };
    await this.http.post(URLConstant.GetLeadCustByLeadId, objLeadCust2).toPromise().then(
      (response: LeadCustObj) => {
        this.resLeadCustObj = response;
        if (this.resLeadCustObj.LeadCustId != 0) {
          this.typePage = "edit";
          this.CopyFrom = null;
        }
        if (this.resLeadCustObj.LeadCustId != 0) {
          this.CustomerDataForm.patchValue({
            CustName: this.resLeadCustObj.CustName,
            MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
            CustModel: this.resLeadCustObj.MrCustModelCode,
            IdNo: this.resLeadCustObj.IdNo,
            Npwp: this.resLeadCustObj.TaxIdNo,
          });
          this.ChangeIdType(this.resLeadCustObj.MrIdTypeCode);
          this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
          this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          let objListLeadCustSocmed2 = { Id: this.resLeadCustObj.LeadCustId };
          this.http.post(URLConstant.GetListLeadCustSocmedByLeadCustId, objListLeadCustSocmed2).subscribe(
            (response) => {
              this.resLeadCustSocmedObj = response[CommonConstant.ReturnObj];
              this.CustomerDataForm.patchValue({
                Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.FACEBOOK) == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.FACEBOOK).SocmedId,
                Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.INSTAGRAM) == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.INSTAGRAM).SocmedId,
                Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.TWITTER) == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.TWITTER).SocmedId,
              });
            });

          let objLeadCustAddrLegalObj: GenericObj = new GenericObj();
          objLeadCustAddrLegalObj.Id = this.resLeadCustObj.LeadCustId;
          objLeadCustAddrLegalObj.Code = CommonConstant.AddrTypeLegal;
          this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, objLeadCustAddrLegalObj).subscribe(
            (response: LeadCustAddrObj) => {
              this.resLeadCustAddrLegalObj = response;
              this.legalAddressObj = new LeadCustAddrObj();
              this.legalAddressObj.Addr = this.resLeadCustAddrLegalObj.Addr;
              this.legalAddressObj.AreaCode3 = this.resLeadCustAddrLegalObj.AreaCode3;
              this.legalAddressObj.AreaCode4 = this.resLeadCustAddrLegalObj.AreaCode4;
              this.legalAddressObj.AreaCode1 = this.resLeadCustAddrLegalObj.AreaCode1;
              this.legalAddressObj.AreaCode2 = this.resLeadCustAddrLegalObj.AreaCode2;
              this.legalAddressObj.City = this.resLeadCustAddrLegalObj.City;
              this.legalAddressObj.PhnArea1 = this.resLeadCustAddrLegalObj.PhnArea1;
              this.legalAddressObj.Phn1 = this.resLeadCustAddrLegalObj.Phn1;
              this.legalAddressObj.PhnExt1 = this.resLeadCustAddrLegalObj.PhnExt1;
              this.legalAddressObj.PhnArea2 = this.resLeadCustAddrLegalObj.PhnArea2;
              this.legalAddressObj.Phn2 = this.resLeadCustAddrLegalObj.Phn2;
              this.legalAddressObj.PhnExt2 = this.resLeadCustAddrLegalObj.PhnExt2;
              this.legalAddressObj.FaxArea = this.resLeadCustAddrLegalObj.FaxArea;
              this.legalAddressObj.Fax = this.resLeadCustAddrLegalObj.Fax;
              this.legalAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrLegalObj.MrHouseOwnershipCode;

              this.inputLegalAddressObj = new InputFieldObj();
              this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
              this.inputLegalAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrLegalObj.Zipcode;
              this.inputLegalAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrLegalObj.Zipcode };
              this.inputAddressObjForLegalAddr.default = this.legalAddressObj;
              this.inputAddressObjForLegalAddr.inputField = this.inputLegalAddressObj;
              this.setEnableZipcodeLookup();
            });

          let objLeadCustAddrResObj: GenericObj = new GenericObj();
          objLeadCustAddrResObj.Id = this.resLeadCustObj.LeadCustId;
          objLeadCustAddrResObj.Code = CommonConstant.AddrTypeResidence;
          this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, objLeadCustAddrResObj).subscribe(
            (response: LeadCustAddrObj) => {
              this.resLeadCustAddrResObj = response;
              this.residenceAddressObj = new LeadCustAddrObj();
              this.residenceAddressObj.Addr = this.resLeadCustAddrResObj.Addr;
              this.residenceAddressObj.AreaCode3 = this.resLeadCustAddrResObj.AreaCode3;
              this.residenceAddressObj.AreaCode4 = this.resLeadCustAddrResObj.AreaCode4;
              this.residenceAddressObj.AreaCode1 = this.resLeadCustAddrResObj.AreaCode1;
              this.residenceAddressObj.AreaCode2 = this.resLeadCustAddrResObj.AreaCode2;
              this.residenceAddressObj.City = this.resLeadCustAddrResObj.City;
              this.residenceAddressObj.PhnArea1 = this.resLeadCustAddrResObj.PhnArea1;
              this.residenceAddressObj.Phn1 = this.resLeadCustAddrResObj.Phn1;
              this.residenceAddressObj.PhnExt1 = this.resLeadCustAddrResObj.PhnExt1;
              this.residenceAddressObj.PhnArea2 = this.resLeadCustAddrResObj.PhnArea2;
              this.residenceAddressObj.Phn2 = this.resLeadCustAddrResObj.Phn2;
              this.residenceAddressObj.PhnExt2 = this.resLeadCustAddrResObj.PhnExt2;
              this.residenceAddressObj.FaxArea = this.resLeadCustAddrResObj.FaxArea;
              this.residenceAddressObj.Fax = this.resLeadCustAddrResObj.Fax;
              this.residenceAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrResObj.MrHouseOwnershipCode;
              this.inputResidenceAddressObj = new InputFieldObj();
              this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
              this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrResObj.Zipcode;
              this.inputResidenceAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrResObj.Zipcode };
              this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
              this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;
              this.setEnableZipcodeLookup();
            });
            
          this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
          this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          let objLeadCustPersonal2 = { Id: this.resLeadCustObj.LeadCustId };
          this.http.post(URLConstant.GetLeadCustPersonalByLeadCustId, objLeadCustPersonal2).subscribe(
            (response: LeadCustPersonalObj) => {
              this.resLeadCustPersonalObj = response;
              this.CustomerDataForm.patchValue({
                Gender: this.resLeadCustPersonalObj.MrGenderCode,
                BirthPlace: this.resLeadCustPersonalObj.BirthPlace,
                BirthDate: formatDate(this.resLeadCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
                MotherName: this.resLeadCustPersonalObj.MotherMaidenName,
                MrMaritalStatCode: this.resLeadCustPersonalObj.MrMaritalStatCode,
                Email: this.resLeadCustPersonalObj.Email1,
                MobilePhone1: this.resLeadCustPersonalObj.MobilePhnNo1,
                MobilePhone2: this.resLeadCustPersonalObj.MobilePhnNo2,
              });
              this.reqLeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
              this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              let objLeadCustPersonalJobData2 = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
              this.http.post(URLConstant.GetLeadCustPersonalJobDataByLeadCustPersonalId, objLeadCustPersonalJobData2).subscribe(
                (response: LeadCustPersonalJobDataObj) => {
                  this.resLeadCustPersonalJobDataObj = response;
                  this.CustomerDataForm.patchValue({
                    CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                  });
                  this.refProfessionObj = new RefProfessionObj();
                  this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                  this.http.post(URLConstant.GetRefProfessionByCode, { Code: this.resLeadCustPersonalJobDataObj.MrProfessionCode }).subscribe(
                    (response: RefProfessionObj) => {
                      this.returnRefProfessionObj = response;
                      this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                      this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                      this.tempProfession = this.returnRefProfessionObj.ProfessionCode;
                    });
                });
              this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
              this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              let objCustPersonalFinData2 = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
              this.http.post(URLConstant.GetLeadCustPersonalFinDataByLeadCustPersonalId, objCustPersonalFinData2).subscribe(
                (response: LeadCustPersonalFinDataObj) => {
                  this.resLeadCustPersonalFinDataObj = response;
                  this.CustomerDataForm.patchValue({
                    MonthlyIncome: this.resLeadCustPersonalFinDataObj.MonthlyIncomeAmt,
                    MonthlyExpense: this.resLeadCustPersonalFinDataObj.MonthlyExpenseAmt,
                  });
                });
            });
        }
      });

  }

  checkIntegrator() {
    if (this.isUseDigitalization == '1' && this.isNeedCheckBySystem == "0" && this.IsSvcExist) {
      this.leadInputObj = new ReqInputLeadCustPersonalObj();
      this.setLeadCust();
      if (!this.setLeadCustPersonal()) return;
      this.setLegalAddr();
      this.setLeadCustPersonalJobData();
      this.http.post(URLConstant.CheckIntegrator, this.leadInputObj).subscribe(
        () => {
          this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
            (response: ResThirdPartyRsltHObj) => {
              this.latestReqDtCheckIntegrator = response.ReqDt;
              this.thirdPartyRsltHId = response.ThirdPartyRsltHId;
              this.reqLatestJson = JSON.parse(response.ReqJson);
              if (this.reqLatestJson != null && this.reqLatestJson != "") {
                this.latestCustDataObj = new LeadCustCompareObj();
                this.latestCustDataObj.CustName = this.reqLatestJson['CustName'];
                this.latestCustDataObj.Gender = this.reqLatestJson['Gender'];
                this.latestCustDataObj.BirthPlace = this.reqLatestJson['BirthPlace'];
                this.latestCustDataObj.BirthDt = formatDate(new Date(this.reqLatestJson['BirthDt']), 'yyyy-MM-dd', 'en-US');
                this.latestCustDataObj.MaritalStatus = this.reqLatestJson['MaritalStatus'];
                this.latestCustDataObj.CustPhnNo = this.reqLatestJson['CustPhnNo'];
                this.latestCustDataObj.CustEmail = this.reqLatestJson['CustEmail'];
                this.latestCustDataObj.IdNo = this.reqLatestJson['IdNo'];
                this.latestCustDataObj.IdType = this.reqLatestJson['IdType'];
                this.latestCustDataObj.TaxNo = this.reqLatestJson['TaxNo'];
                this.latestCustDataObj.Profession = this.reqLatestJson['Profession'];
                this.latestCustDataObj.HomeAddr = this.reqLatestJson['HomeAddr'];
                this.latestCustDataObj.HomeRt = this.reqLatestJson['HomeRt'];
                this.latestCustDataObj.HomeRw = this.reqLatestJson['HomeRw'];
                this.latestCustDataObj.HomeZipCode = this.reqLatestJson['HomeZipCode'];
                this.latestCustDataObj.HomeKelurahan = this.reqLatestJson['HomeKelurahan'];
                this.latestCustDataObj.HomeKecamatan = this.reqLatestJson['HomeKecamatan'];
                this.latestCustDataObj.HomeCity = this.reqLatestJson['HomeCity'];
              }
            }
          );
        }
      );
    }
  }


  confirmFraudCheck() {
    let inputLeadCustObj = new LeadCustCompareObj();
    inputLeadCustObj.CustName = this.CustomerDataForm.controls["CustName"].value;
    inputLeadCustObj.Gender = this.CustomerDataForm.controls["Gender"].value;
    inputLeadCustObj.BirthPlace = this.CustomerDataForm.controls["BirthPlace"].value;
    inputLeadCustObj.BirthDt = this.CustomerDataForm.controls["BirthDate"].value;
    inputLeadCustObj.MaritalStatus = this.CustomerDataForm.controls["MrMaritalStatCode"].value;
    inputLeadCustObj.CustPhnNo = this.CustomerDataForm.controls["MobilePhone1"].value;
    inputLeadCustObj.CustEmail = this.CustomerDataForm.controls["Email"].value;
    inputLeadCustObj.IdNo = this.CustomerDataForm.controls["IdNo"].value;
    inputLeadCustObj.IdType = this.CustomerDataForm.controls["MrIdTypeCode"].value;
    inputLeadCustObj.TaxNo = this.CustomerDataForm.controls["Npwp"].value;
    inputLeadCustObj.Profession = this.professionLookUpObj.nameSelect;
    inputLeadCustObj.HomeAddr = this.CustomerDataForm.controls["legalAddress"]["controls"].Addr.value;
    inputLeadCustObj.HomeRt = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode4.value;
    inputLeadCustObj.HomeRw = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode3.value;
    inputLeadCustObj.HomeZipCode = this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value;
    inputLeadCustObj.HomeKelurahan = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode2.value;
    inputLeadCustObj.HomeKecamatan = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode1.value;
    inputLeadCustObj.HomeCity = this.CustomerDataForm.controls["legalAddress"]["controls"].City.value;

    let inputLeadString = JSON.stringify(inputLeadCustObj);
    let latestCustDataString = JSON.stringify(this.latestCustDataObj);

    if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0" && this.IsSvcExist && inputLeadString != latestCustDataString) {
      if (confirm("Recent Customer Main Data and Legal Address different with previous data. Are you sure want to submit without fraud check again?")) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }
  //START URS-LOS-041

  ChangeIdType(IdType: string) {
    this.CustomerDataForm.controls[this.controlNameIdNo].setValidators(Validators.required);
    this.CustomerDataForm.controls[this.controlNameIdNo].updateValueAndValidity();

    if (IdType == "EKTP") {
      this.CustomerDataForm.controls[this.controlNameIdNo].setValidators([Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(16), Validators.maxLength(16)]);
      this.CustomerDataForm.controls[this.controlNameIdNo].updateValueAndValidity();
    }
    if (IdType == "NPWP") {
      this.CustomerDataForm.controls[this.controlNameIdNo].setValidators([Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]);
      this.CustomerDataForm.controls[this.controlNameIdNo].updateValueAndValidity();
    }
    if (IdType == "SIM" || IdType == "KITAS") {
      this.CustomerDataForm.controls[this.controlNameIdNo].setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
      this.CustomerDataForm.controls[this.controlNameIdNo].updateValueAndValidity();
    }
  }

  controlNameIdNo: string = 'IdNo';
  controlNameIdType: string = 'MrIdTypeCode';
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
    let idTypeValue: string;

    idTypeValue = this.CustomerDataForm.controls[this.controlNameIdType].value;
    let pattern: string = '';
    if (idTypeValue != undefined) {
      if (this.resultPattern != undefined) {
        let result = this.resultPattern.find(x => x.Key == idTypeValue)
        if (result != undefined) {
          pattern = result.Value;
        }
      }
    }
    this.setValidator(pattern);
  }
  setValidator(pattern: string) {
    if (pattern != undefined) {
      this.CustomerDataForm.controls[this.controlNameIdNo].setValidators(Validators.pattern(pattern));
      this.CustomerDataForm.controls[this.controlNameIdNo].updateValueAndValidity();
    }
  }
  //END OF URS-LOS-041

  async getDigitalizationSvcType(){
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType}).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if(this.sysConfigResultObj.ConfigValue != null){
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");
      var refSvcType = "";
      await this.http.post(URLConstant.GetRuleIntegratorPackageMapCust, { TrxNo: "-"}).toPromise().then(
        (response) => {
            refSvcType = response["Result"];
        });

        var svcType = listSvcType.find(x => x == refSvcType);
      if(svcType != null){
        this.IsSvcExist = true;
      }
    }
  }

  Cancel(){
    this.outputCancel.emit();
  }
}
