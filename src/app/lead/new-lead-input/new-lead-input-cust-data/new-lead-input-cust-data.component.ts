import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CustomPatternObj } from 'app/shared/model/CustomPatternObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { LeadCustAddrObj } from 'app/shared/model/LeadCustAddrObj.Model';
import { LeadCustCompareObj } from 'app/shared/model/LeadCustCompareObj.Model';
import { LeadCustObj } from 'app/shared/model/LeadCustObj.Model';
import { LeadCustPersonalFinDataObj } from 'app/shared/model/LeadCustPersonalFinDataObj.Model';
import { LeadCustPersonalJobDataObj } from 'app/shared/model/LeadCustPersonalJobDataObj.Model';
import { LeadCustPersonalObj } from 'app/shared/model/LeadCustPersonalObj.Model';
import { LeadCustSocmedObj } from 'app/shared/model/LeadCustSocmedObj.Model';
import { LeadInputObj } from 'app/shared/model/LeadInputObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { RefProfessionObj } from 'app/shared/model/RefProfessionObj.Model';
import { ThirdPartyResultHForFraudChckObj } from 'app/shared/model/ThirdPartyResultHForFraudChckObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { RegexService } from 'app/shared/services/regex.services';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-lead-input-cust-data',
  templateUrl: './new-lead-input-cust-data.component.html',
  providers: [RegexService]
})
export class NewLeadInputCustDataComponent implements OnInit {
  @Input() LeadId: number;
  @Output() outputTab: EventEmitter<object> = new EventEmitter();
  businessDt: Date = new Date();
  CopyFrom: number;
  typePage: string;
  WfTaskListId: number;
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
  custModel: RefMasterObj;
  listCustModel: Array<KeyValueObj>;
  leadInputObj: LeadInputObj = new LeadInputObj();
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
  IsSimpleLeadUpdate = false;
  @ViewChild("ProfessionModal", { read: ViewContainerRef }) professionModal: ViewContainerRef;
  @ViewChild("enjiForm") enjiForm: NgForm;
  CustomerDataForm = this.fb.group({
    CustType: [''],
    Gender: [''],
    CustName: ['', [Validators.required]],
    BirthPlace: [''],
    BirthDate: ['', [Validators.required]],
    MrIdTypeCode: [''],
    MotherName: [''],
    IdNo: [''],
    MrMaritalStatCode: [''],
    Npwp: [''],
    Email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    MobilePhone1: ['', [Validators.pattern("^[0-9]+$"), Validators.required]],
    MobilePhone2: ['', Validators.pattern("^[0-9]+$")],
    Facebook: [''],
    Instagram: [''],
    Twitter: [''],
    CustModel: [''],
    CompanyName: [''],
    MonthlyIncome: [0],
    MonthlyExpense: [0]
  });
  inputAddressObjForLegalAddr: InputAddressObj;
  inputAddressObjForResidenceAddr: InputAddressObj;
  generalSettingObj: GeneralSettingObj;
  returnGeneralSettingObj: GeneralSettingObj;
  isNeedCheckBySystem: string;
  leadObj: LeadObj;
  returnLeadObj: LeadObj;
  thirdPartyObj: ThirdPartyResultHForFraudChckObj;
  leadNo: string;
  latestReqDtCheckIntegrator: string;
  thirdPartyRsltHId: number;
  reqLatestJson: any;
  latestCustDataObj: LeadCustCompareObj;
  dmsObj: DMSObj;
  IsReady: boolean = false;
  customPattern: Array<CustomPatternObj>;
  resultPattern: Array<KeyValueObj>;

  constructor(
    private regexService: RegexService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cookieService: CookieService
  ) {
  }

  async ngOnInit() {

    this.customPattern = new Array<CustomPatternObj>();
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

    this.setValidatorForUpdate();

    this.inputAddressObjForLegalAddr = new InputAddressObj();
    this.inputAddressObjForLegalAddr.showSubsection = false;
    this.inputAddressObjForLegalAddr.title = "Legal Address";
    this.inputAddressObjForLegalAddr.showPhn3 = false;
    this.inputAddressObjForLegalAddr.showOwnership = false;
    this.inputAddressObjForLegalAddr.isRequired = false;

    this.inputAddressObjForLegalAddr.inputField.inputLookupObj.isRequired = false;


    this.inputAddressObjForResidenceAddr = new InputAddressObj();
    this.inputAddressObjForResidenceAddr.showSubsection = false;
    this.inputAddressObjForResidenceAddr.title = "Residence Address";
    this.inputAddressObjForResidenceAddr.showPhn3 = false;
    this.inputAddressObjForResidenceAddr.showOwnership = false;
    this.inputAddressObjForResidenceAddr.isRequired = false;

    this.inputAddressObjForResidenceAddr.inputField.inputLookupObj.isRequired = false;


    this.InitDms();
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    let context: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);
    await this.getLeadData();

    this.inputLegalAddressObj = new InputFieldObj();
    this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
    this.inputResidenceAddressObj = new InputFieldObj();
    this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
    this.professionLookUpObj = new InputLookupObj();
    this.professionLookUpObj.isRequired = false;
    this.professionLookUpObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.professionLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.professionLookUpObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.isRequired = false;


    this.generalSettingObj = new GeneralSettingObj();
    this.generalSettingObj.GsCode = "INTEGRATOR_CHECK_BY_SYSTEM";
    let obj = {
      Code: this.generalSettingObj.GsCode
    }
    this.http.post(URLConstant.GetGeneralSettingByCode, obj).subscribe(
      (response: GeneralSettingObj) => {
        this.returnGeneralSettingObj = response;
        this.isNeedCheckBySystem = this.returnGeneralSettingObj.GsValue;
        this.leadObj = new LeadObj();
        this.leadObj.LeadId = this.LeadId;
        let obj = {
          Id: this.leadObj.LeadId
        }
        this.http.post(URLConstant.GetLeadByLeadId, obj).subscribe(
          (response: LeadObj) => {
            this.returnLeadObj = response;
            this.leadNo = response.LeadNo;

            this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
            this.thirdPartyObj.TrxTypeCode = CommonConstant.LEAD_TRX_TYPE_CODE;
            this.thirdPartyObj.TrxNo = this.leadNo;
            this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_CUST;
            this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
              (response) => {
                this.latestReqDtCheckIntegrator = response['ReqDt'];
                this.thirdPartyRsltHId = response['ThirdPartyRsltHId'];
                this.reqLatestJson = JSON.parse(response['ReqJson']);
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
      });

    this.maritalStatCode = new RefMasterObj();
    this.maritalStatCode.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeMaritalStat;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.maritalStatCode).subscribe(
      (response) => {
        this.tempMrMaritalStatCode = response[CommonConstant.ReturnObj];
        this.CustomerDataForm.patchValue({ MrMaritalStatCode: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.custModel = new RefMasterObj();
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
        this.professionLookUpObj.isRequired = false;
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
      let obj = {
        Id: this.CopyFrom
      }
      this.http.post(URLConstant.GetLeadCustByLeadId, obj).subscribe(
        (response: LeadCustObj) => {
          this.resLeadCustObj = response;
          this.CustomerDataForm.patchValue({
            CustName: this.resLeadCustObj.CustName,
            MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
            CustModel: this.resLeadCustObj.MrCustModelCode,
            IdNo: this.resLeadCustObj.IdNo,
            Npwp: this.resLeadCustObj.TaxIdNo,
          });
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
          let obj = {
            Id: this.reqLeadCustSocmedObj.LeadCustId
          }
          this.http.post(URLConstant.GetListLeadCustSocmedByLeadCustId, obj).subscribe(
            (response) => {
              this.resLeadCustSocmedObj = response[CommonConstant.ReturnObj];
              this.CustomerDataForm.patchValue({
                Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
              });
            });

          this.reqLeadCustAddrLegalObj = new LeadCustAddrObj();
          this.reqLeadCustAddrLegalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
          let idAndCodeObj = {
            Id: this.reqLeadCustAddrLegalObj.LeadCustId,
            Code: this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode
          }
          this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, idAndCodeObj).subscribe(
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

              this.inputLegalAddressObj.inputLookupObj.isRequired = false;

              this.inputAddressObjForLegalAddr.default = this.legalAddressObj;
              this.inputAddressObjForLegalAddr.inputField = this.inputLegalAddressObj;
            });

          this.reqLeadCustAddrResObj = new LeadCustAddrObj();
          this.reqLeadCustAddrResObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.reqLeadCustAddrResObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence;
          idAndCodeObj = {
            Id: this.reqLeadCustAddrResObj.LeadCustId,
            Code: this.reqLeadCustAddrResObj.MrCustAddrTypeCode
          }
          this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, idAndCodeObj).subscribe(
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

              this.inputResidenceAddressObj.inputLookupObj.isRequired = false;

              this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
              this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;
            });

          this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
          this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          obj = {
            Id: this.resLeadCustObj.LeadCustId
          }
          this.http.post(URLConstant.GetLeadCustPersonalByLeadCustId, obj).subscribe(
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
              let obj = {
                Id: this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId
              }
              this.http.post(URLConstant.GetLeadCustPersonalJobDataByLeadCustPersonalId, obj).subscribe(
                (response: LeadCustPersonalJobDataObj) => {
                  this.resLeadCustPersonalJobDataObj = response;
                  this.CustomerDataForm.patchValue({
                    CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                  });

                  this.refProfessionObj = new RefProfessionObj();
                  this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                  let obj = {
                    Code: this.refProfessionObj.ProfessionCode
                  }
                  this.http.post(URLConstant.GetRefProfessionByCode, obj).subscribe(
                    (response: RefProfessionObj) => {
                      this.returnRefProfessionObj = response;
                      this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                      this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                      this.tempProfession = this.returnRefProfessionObj.ProfessionCode;
                    });
                });

              this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
              this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              obj = {
                Id: this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId
              }
              this.http.post(URLConstant.GetLeadCustPersonalFinDataByLeadCustPersonalId, obj).subscribe(
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
      let obj = {
        Id: this.LeadId
      }
      this.http.post(URLConstant.GetLeadCustByLeadId, obj).subscribe(
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
            let obj = {
              Id: this.reqLeadCustSocmedObj.LeadCustId
            }
            this.http.post(URLConstant.GetListLeadCustSocmedByLeadCustId, obj).subscribe(
              (response) => {
                this.resLeadCustSocmedObj = response[CommonConstant.ReturnObj];
                this.CustomerDataForm.patchValue({
                  Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                  Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                  Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
                });
              });

            this.reqLeadCustAddrLegalObj = new LeadCustAddrObj();
            this.reqLeadCustAddrLegalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
            this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
            let idAndCodeObj = {
              Id: this.reqLeadCustAddrLegalObj.LeadCustId,
              Code: this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode
            }
            this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, idAndCodeObj).subscribe(
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

                this.inputLegalAddressObj.inputLookupObj.isRequired = false;

                this.inputAddressObjForLegalAddr.default = this.legalAddressObj;
                this.inputAddressObjForLegalAddr.inputField = this.inputLegalAddressObj;

                // this.inputAddressObjForLegalAddr.isRequired = true;
              });

            this.reqLeadCustAddrResObj = new LeadCustAddrObj();
            this.reqLeadCustAddrResObj.LeadCustId = this.resLeadCustObj.LeadCustId;
            this.reqLeadCustAddrResObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence;
            idAndCodeObj = {
              Id: this.reqLeadCustAddrResObj.LeadCustId,
              Code: this.reqLeadCustAddrResObj.MrCustAddrTypeCode
            }
            this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, idAndCodeObj).subscribe(
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

                this.inputResidenceAddressObj.inputLookupObj.isRequired = false;

                this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
                this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;

                this.inputAddressObjForResidenceAddr.isRequired = false;
              });

            this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
            this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
            obj = {
              Id: this.reqLeadCustPersonalObj.LeadCustId
            }
            this.http.post(URLConstant.GetLeadCustPersonalByLeadCustId, obj).subscribe(
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
                let obj = {
                  Id: this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId
                }
                this.http.post(URLConstant.GetLeadCustPersonalJobDataByLeadCustPersonalId, obj).subscribe(
                  (response: LeadCustPersonalJobDataObj) => {
                    this.resLeadCustPersonalJobDataObj = response;
                    this.CustomerDataForm.patchValue({
                      CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                    });
                    this.refProfessionObj = new RefProfessionObj();
                    this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                    let obj = {
                      Code: this.refProfessionObj.ProfessionCode
                    }
                    this.http.post(URLConstant.GetRefProfessionByCode, obj).subscribe(
                      (response: RefProfessionObj) => {
                        this.returnRefProfessionObj = response;
                        this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                        this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                        this.professionLookUpObj.isRequired = false;
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
                obj = {
                  Id: this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId
                }
                this.http.post(URLConstant.GetLeadCustPersonalFinDataByLeadCustPersonalId, obj).subscribe(
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
    this.IsReady = true;
    this.getInitPattern();
  }

  ChangeIdType(IdType: string) {
    this.setValidatorPattern();
  }
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
    let idTypeValue: string = this.CustomerDataForm.controls.MrIdTypeCode.value;
    let pattern: string = "";
    if (idTypeValue != undefined) {
      if (this.resultPattern != undefined) {
        if (idTypeValue == 'EKTP') {
          let result = this.resultPattern.find(x => x.Key == idTypeValue)
          if (result != undefined) {
            pattern = result.Value;
          }
        }
      }
    }
    this.setValidator(pattern);
  }
  setValidator(pattern: string) {
    if (pattern != undefined) {
      if (this.CustomerDataForm.controls.MrIdTypeCode.value == 'EKTP') {
        if (pattern != "") {
          this.CustomerDataForm.controls.IdNo.setValidators([Validators.pattern(pattern)]);
        } else {
          this.CustomerDataForm.controls.IdNo.setValidators([Validators.pattern("^[0-9]+$")]);
        }
      }
      else {
        this.CustomerDataForm.controls.IdNo.clearValidators();
      }
      this.CustomerDataForm.controls.IdNo.updateValueAndValidity();
    } else {
      this.CustomerDataForm.controls.IdNo.clearValidators();
      this.CustomerDataForm.controls.IdNo.updateValueAndValidity();
    }
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

  InitDms() {
    this.dmsObj = new DMSObj();
    this.dmsObj.User = "Admin";
    this.dmsObj.Role = "SUPUSR";
    this.dmsObj.ViewCode = "ConfinsLead";
    this.dmsObj.MetadataObject.push(new DMSLabelValueObj("Lead Id", this.LeadId.toString()));
    this.dmsObj.Option.push(new DMSLabelValueObj("OverideSecurity", "Upload"));
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
  }

  setLegalAddr() {
    //this.legalAddressObj = new LeadCustAddrObj();
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
    //this.residenceAddressObj = new LeadCustAddrObj();
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
    this.leadInputObj.LeadCustPersonalObj.CustFullName = this.CustomerDataForm.controls["CustName"].value;
    this.leadInputObj.LeadCustPersonalObj.MrGenderCode = this.CustomerDataForm.controls["Gender"].value;
    this.leadInputObj.LeadCustPersonalObj.BirthPlace = this.CustomerDataForm.controls["BirthPlace"].value;
    this.leadInputObj.LeadCustPersonalObj.BirthDt = this.CustomerDataForm.controls["BirthDate"].value;
    this.leadInputObj.LeadCustPersonalObj.MotherMaidenName = this.CustomerDataForm.controls["MotherName"].value;
    this.leadInputObj.LeadCustPersonalObj.MrMaritalStatCode = this.CustomerDataForm.controls["MrMaritalStatCode"].value;
    this.leadInputObj.LeadCustPersonalObj.Email1 = this.CustomerDataForm.controls["Email"].value;
    this.leadInputObj.LeadCustPersonalObj.MobilePhnNo1 = this.CustomerDataForm.controls["MobilePhone1"].value;
    this.leadInputObj.LeadCustPersonalObj.MobilePhnNo2 = this.CustomerDataForm.controls["MobilePhone2"].value;
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
        this.leadInputObj = new LeadInputObj();
        this.leadInputObj.LeadCustObj.LeadCustId = this.resLeadCustObj.LeadCustId;
        this.leadInputObj.LeadCustObj.RowVersion = this.resLeadCustObj.RowVersion;
        this.setLeadCust();
        this.leadInputObj.LeadCustPersonalObj.RowVersion = this.resLeadCustPersonalObj.RowVersion;
        this.setLeadCustPersonal();
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
        this.leadInputObj = new LeadInputObj();
        this.setLeadCust();
        this.setLeadCustPersonal();
        this.setLeadCustSocmed();
        this.setLegalAddr();
        this.setResidenceAddr();
        this.setLeadCustPersonalJobData();
        this.setLeadCustPersonalFinData();
        if (this.confirmFraudCheck()) {
          this.http.post(URLConstant.EditLeadCust, this.leadInputObj).subscribe(
            (response) => {
              this.toastr.successMessage(response["message"]);
              this.outputTab.emit({ stepMode: "next" });
            }
          );
        }
      }
    }
    else {
      this.leadInputObj = new LeadInputObj();
      this.setLeadCust();
      this.setLeadCustPersonal();
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
    console.log('LEEEROOOYY')
    console.log(this.leadInputObj)

  }

  async claimTask() {
    let currentUserContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  async getLeadData() {
    this.reqLeadCustObj = new LeadCustObj();
    this.reqLeadCustObj.LeadId = this.LeadId;
    let obj = {
      Id: this.LeadId
    }
    await this.http.post(URLConstant.GetLeadCustByLeadId, obj).toPromise().then(
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
          this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
          this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          let obj = {
            Id: this.reqLeadCustSocmedObj.LeadCustId
          }
          this.http.post(URLConstant.GetListLeadCustSocmedByLeadCustId, obj).subscribe(
            (response) => {
              this.resLeadCustSocmedObj = response[CommonConstant.ReturnObj];
              this.CustomerDataForm.patchValue({
                Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.FACEBOOK) == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.FACEBOOK).SocmedId,
                Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.INSTAGRAM) == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.INSTAGRAM).SocmedId,
                Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.TWITTER) == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == CommonConstant.TWITTER).SocmedId,
              });
            });

          this.reqLeadCustAddrLegalObj = new LeadCustAddrObj();
          this.reqLeadCustAddrLegalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
          let idAndCodeObj = {
            Id: this.reqLeadCustAddrLegalObj.LeadCustId,
            Code: this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode
          }
          this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, idAndCodeObj).subscribe(
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

          this.reqLeadCustAddrResObj = new LeadCustAddrObj();
          this.reqLeadCustAddrResObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.reqLeadCustAddrResObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence;
          idAndCodeObj = {
            Id: this.reqLeadCustAddrResObj.LeadCustId,
            Code: this.reqLeadCustAddrResObj.MrCustAddrTypeCode
          }
          this.http.post(URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode, idAndCodeObj).subscribe(
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
          obj = {
            Id: this.reqLeadCustPersonalObj.LeadCustId
          }
          this.http.post(URLConstant.GetLeadCustPersonalByLeadCustId, obj).subscribe(
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
              let obj = {
                Id: this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId
              }
              this.http.post(URLConstant.GetLeadCustPersonalJobDataByLeadCustPersonalId, obj).subscribe(
                (response: LeadCustPersonalJobDataObj) => {
                  this.resLeadCustPersonalJobDataObj = response;
                  this.CustomerDataForm.patchValue({
                    CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                  });
                  this.refProfessionObj = new RefProfessionObj();
                  this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                  let obj = {
                    Code: this.refProfessionObj.ProfessionCode
                  }
                  this.http.post(URLConstant.GetRefProfessionByCode, obj).subscribe(
                    (response: RefProfessionObj) => {
                      this.returnRefProfessionObj = response;
                      this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                      this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                      this.tempProfession = this.returnRefProfessionObj.ProfessionCode;
                    });
                });
              this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
              this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              obj = {
                Id: this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId
              }
              this.http.post(URLConstant.GetLeadCustPersonalFinDataByLeadCustPersonalId, obj).subscribe(
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
    if (this.isNeedCheckBySystem == "0") {
      this.leadInputObj = new LeadInputObj();
      this.setLeadCust();
      this.setLeadCustPersonal();
      this.setLegalAddr();
      this.setLeadCustPersonalJobData();
      this.http.post(URLConstant.CheckIntegrator, this.leadInputObj).subscribe(
        (response1) => {
          this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
            (response) => {
              this.latestReqDtCheckIntegrator = response['ReqDt'];
              this.thirdPartyRsltHId = response['ThirdPartyRsltHId'];
              this.reqLatestJson = JSON.parse(response['ReqJson']);
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
    console.log('inputLeadString = ', inputLeadString);
    let latestCustDataString = JSON.stringify(this.latestCustDataObj);
    console.log('latestCustDataString = ', latestCustDataString);

    console.log(latestCustDataString);
    console.log(inputLeadString);
    console.log(inputLeadString != latestCustDataString);

    if (this.isNeedCheckBySystem == "0" && inputLeadString != latestCustDataString && latestCustDataString != undefined) {
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

  setValidatorForUpdate() {
    if (this.typePage == "update") {
      this.IsSimpleLeadUpdate = true;
      this.CustomerDataForm.controls['Gender'].setValidators([Validators.required]);
      this.CustomerDataForm.controls['Gender'].updateValueAndValidity();
      this.CustomerDataForm.controls['BirthPlace'].setValidators([Validators.required]);
      this.CustomerDataForm.controls['BirthPlace'].updateValueAndValidity();
      this.CustomerDataForm.controls['MrIdTypeCode'].setValidators([Validators.required]);
      this.CustomerDataForm.controls['MrIdTypeCode'].updateValueAndValidity();
      this.CustomerDataForm.controls['MotherName'].setValidators([Validators.required]);
      this.CustomerDataForm.controls['MotherName'].updateValueAndValidity();
      this.CustomerDataForm.controls['IdNo'].setValidators([Validators.required]);
      this.CustomerDataForm.controls['IdNo'].updateValueAndValidity();
      this.CustomerDataForm.controls['MrMaritalStatCode'].setValidators([Validators.required]);
      this.CustomerDataForm.controls['MrMaritalStatCode'].updateValueAndValidity();
    }
  }

}

