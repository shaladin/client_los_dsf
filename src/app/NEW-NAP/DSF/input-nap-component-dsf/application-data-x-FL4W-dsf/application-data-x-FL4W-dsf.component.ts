import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppObj } from 'app/shared/model/app/app.model';
import { LeadObj } from 'app/shared/model/lead.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { DatePipe } from '@angular/common';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppOtherInfoObj } from 'app/shared/model/app-other-info.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { GenerateAppAttrContentObj } from 'app/shared/model/app-attr-content/generate-app-attr-content-obj.model';
import { MouCustDlrFinObj } from 'app/shared/model/mou-cust-dlr-fin.model';
import { MouCustClauseObj } from 'app/shared/model/mou-cust-clause-obj.model';
import { MouCustFctrObj } from 'app/shared/model/mou-cust-fctr-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { UcDropdownListObj, UcDropdownListConstant, UcDropdownListCallbackObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { NapAppCrossObj } from 'app/shared/model/nap-app-cross-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { AppAttrContentObj } from 'app/shared/model/app-attr-content/app-attr-content-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';

@Component({
  selector: 'app-application-data-x-FL4W-dsf',
  templateUrl: './application-data-x-FL4W-dsf.component.html',
  styleUrls: ['./application-data-x-FL4W-dsf.component.css']
})
export class ApplicationDataXFL4WDsfComponent implements OnInit {

  @Input() AppId: number;
  @Input() showCancel = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  FirstInstType: string;
  mode: string;
  ListCrossAppObj: any = {};

  listCustBankAcc: Array<AppCustBankAccObj>;
  GetBankInfo: AppOtherInfoObj = new AppOtherInfoObj();

  isTenorValid = true;
  isFromMouCust = false;
  PayFreqCode: string;
  DownPaymentFromPrcnt: number;
  DownPaymentToPrcnt: number;
  TenorFrom: number;
  TenorTo: number;
  MrFirstInstTypeCode: string;
  MrInterestTypeCode: string;
  MrInstTypeCode: string;
  MrInstSchmCode: string;
  mouCust: MouCustObj;
  isAppAttrContentReady = false;
  isDdlMrFirstInstTypeReady: boolean = false;
  isDdlPayFreqReady: boolean = false;
  isDdlInterestTypeReady: boolean = false;
  isDdlInstallmentSchemeReady: boolean = false;
  ddlMrFirstInstTypeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlInterestTypeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlInstallmentSchemeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlPayFreqObj: UcDropdownListObj = new UcDropdownListObj();
  GenerateAppAttrContentObjs: Array<GenerateAppAttrContentObj> = new Array<GenerateAppAttrContentObj>();
  ListAttrAnswer = [];
  ListInputLookUpObj = new Array();
  tempLookup = {};
  readonly AttrInputTypeText = CommonConstant.AttrInputTypeText;
  readonly AttrInputTypeDate = CommonConstant.AttrInputTypeDate;
  readonly AttrInputTypeNum = CommonConstant.AttrInputTypeNum;
  readonly AttrInputTypeNumPerc = CommonConstant.AttrInputTypeNumPerc;
  readonly AttrInputTypeList = CommonConstant.AttrInputTypeList;
  readonly AttrInputTypeTextArea = CommonConstant.AttrInputTypeTextArea;
  readonly AttrInputTypeRefMaster = CommonConstant.AttrInputTypeRefMaster;


  NapAppModelForm = this.fb.group({
    MouCustId: [''],
    LeadId: [''],
    AppNo: [''],
    OriOfficeCode: [''],
    OriOfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    ProdOfferingCode: [''],
    ProdOfferingName: [''],
    ProdOfferingVersion: [''],
    AppCreatedDt: [''],
    AppStat: [''],
    AppCurrStep: [''],
    AppLastStep: [''],
    CurrCode: [''],
    LobCode: [''],
    RefProdTypeCode: [''],
    Tenor: ['', [Validators.pattern('^[0-9]+$'), Validators.required, Validators.min(1)]],
    NumOfInst: [''],
    PayFreqCode: ['', Validators.required],
    MrFirstInstTypeCode: ['', Validators.required],
    NumOfAsset: [''],
    MrLcCalcMethodCode: ['AD'],
    LcInstRatePrml: [''],
    LcInsRatePrml: [''],
    MrAppSourceCode: ['', Validators.required],
    MrWopCode: ['', Validators.required],
    SrvyOrderNo: [''],
    ApvDt: [''],
    SalesHeadNo: [''],
    SalesHeadName: [''],
    SalesNotes: [''],
    SalesOfficerNo: [''],
    SalesOfficerName: [''],
    CreditAdminNo: [''],
    CreditAnalystNo: [''],
    CreditRiskNo: [''],
    DataEntryNo: [''],
    MrCustNotifyOptCode: ['', Validators.required],
    PreviousAppId: [''],
    IsAppInitDone: [''],
    MrOrderInfoCode: [''],
    ApprovalStat: [''],
    RsvField1: [''],
    RsvField2: [''],
    RsvField3: [''],
    RsvField4: [''],
    RsvField5: [''],
    MrInstSchemeCode: ['', Validators.required],
    InterestType: ['', Validators.required],
    InterestTypeDesc: [''],
    CharaCredit: ['', [Validators.required, Validators.maxLength(50)]],
    PrevAgrNo: [''],
    WayRestructure: [''],
    MrSlikSecEcoCode: [''],
    CopyFromMailing: [''],
    CustBankAcc: [''],
    DpSrcPaymentCode: ['', Validators.required],
    InstSrcPaymentCode: ['', Validators.required],
    AppAttrContentObjs: this.fb.array([]),
    BpkbStatCode: ['', Validators.required],
    OrdStatCode: [''],
    CommodityCode: [''],
    MrCustTypeOwnerBnkAcc: [''],
    MrIdTypeOwnerBnkAcc: [''],
    PrsdntDirectorOwnerBnkAcc: [''],
    IdNoOwnerBankAcc: [''],
    BirthPlaceOwnerBankAcc: [''],
    BirthDtOwnerBankAcc: [''],
  });

  slikSecDescr = '';
  defaultSlikSecEcoCode: string;

  MouCustDlrFindData: MouCustDlrFinObj = new MouCustDlrFinObj();
  mouCustClause: MouCustClauseObj;
  mouCustFctr: MouCustFctrObj;

  inputLookupObj: InputLookupObj;
  arrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  employeeIdentifier;
  salesRecommendationItems = [];
  isInputLookupObj: boolean;
  inputLookupEconomicSectorObj: InputLookupObj;
  inputLookupCommodityObj: InputLookupObj;
  resMouCustObj: Array<KeyValueObj>;
  CustNo: string;
  tempCommodityName = '';
  ddlMrWopObj: UcDropdownListObj = new UcDropdownListObj();
  MasterCustType = '';
  MasterIdNoType = '';
  DictRefMaster: Array<KeyValueObj> = new Array<KeyValueObj>();
  IdTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  isDdlIdTypeReady = false;
  isShowAppCustBankAcc = false;
  isMrCustTypeCompany = false;
  inputAddressOwnerBankAccObj: InputAddressObj = new InputAddressObj();
  isFixedRate = false;
  inputAddrObj: AddrObj = new AddrObj();
  inputAddrObjDefault: AddrObj = new AddrObj();
  applicationDDLitems;
  resultResponse: AppObj;

  PayFreqVal = 1;
  PayFreqTimeOfYear = 1;

  closeResult;

  resultCrossApp: Array<NapAppCrossObj> = new Array<NapAppCrossObj>();

  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();
  mailingAddrObj: AddrObj = new AddrObj();
  AppCustAddrObj: Array<AppCustAddrObj>;
  copyToMailingTypeObj: Array<KeyValueObj> = [
    { Key: 'LEGAL', Value: 'Legal' },
    { Key: 'RESIDENCE', Value: 'Residence' }
  ];

  readonly WopAutoDebit: string = CommonConstant.WopAutoDebit;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,
    private route: ActivatedRoute, private cookieService: CookieService, private toastr: NGXToastrService
  ) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.mode = params['mode'];
    });
  }

  async ngOnInit() {
    this.defaultSlikSecEcoCode = CommonConstantX.DefaultSlikSecEcoCode;
    this.ListCrossAppObj['appId'] = this.AppId;
    this.ListCrossAppObj['result'] = [];
    this.isInputLookupObj = false;
    this.applicationDDLitems = [];
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCustType);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeSlsRecom);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeWOP);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeInstSchm);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCustNotifyOpt);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeFirstInstType);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeInterestTypeGeneral);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCharacteristicCredit);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeWayOfRestructure);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCspUslAml);
    this.getRefMasterTypeCode(CommonConstantX.RefMasterTypeCodeOrdStatus);
    this.getRefMasterTypeCode(CommonConstantX.RefMasterTypeCodeStatusBpkb);
    this.initDdlMrWop();
    this.getPayFregData();
    this.getAppSrcData();
    this.GetCrossInfoData();
    this.initMailingAddress();

    const user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    await this.http.post(URLConstant.GetAppCustByAppId, { Id: this.AppId }).toPromise().then(
      async (response: AppCustObj) => {
        this.CustNo = response.CustNo;
        await this.GetListAppCustBankAcc(response.AppCustId);

        this.http.post(URLConstant.GetListMouCustByCustNo, { CustNo: this.CustNo, StartDt: user.BusinessDt, MrMouTypeCode: CommonConstant.GENERAL }).subscribe(
          (response) => {
            this.resMouCustObj = response[CommonConstant.ReturnObj];
          }
        );
      });
    this.getAppModelInfo();
    await this.getRefMaster();
  }

  Cancel() {
    this.outputCancel.emit();
  }


  checkIdNoType() {
    if (this.NapAppModelForm.controls.MrWopCode.value == this.WopAutoDebit && this.NapAppModelForm.controls.MrIdTypeOwnerBnkAcc.value == CommonConstant.MrIdTypeCodeEKTP) {
      this.NapAppModelForm.get('IdNoOwnerBankAcc').setValidators([Validators.pattern('^[0-9]+$'), Validators.minLength(16), Validators.maxLength(16)]);
      this.NapAppModelForm.get('IdNoOwnerBankAcc').updateValueAndValidity();
    }
  }

  initCustBankAccDetail() {
    this.NapAppModelForm.get('MrIdTypeOwnerBnkAcc').disable();
    this.NapAppModelForm.patchValue({
      MrIdTypeOwnerBnkAcc: CommonConstant.MrIdTypeCodeEKTP,
      MrCustTypeOwnerBnkAcc: CommonConstant.CustTypePersonal,
    });
  }


  initAddressCustBankAcc() {
    this.inputAddressOwnerBankAccObj.showSubsection = false;
    this.inputAddressOwnerBankAccObj.title = 'Customer Bank Acc Owner Address';
    this.inputAddressOwnerBankAccObj.showAllPhn = false;
    this.inputAddressOwnerBankAccObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressOwnerBankAccObj.isRequired = false;
    this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.isRequired = false;
  }

  resetCustBankAccDetailForm() {
    this.NapAppModelForm.patchValue({
      MrIdTypeOwnerBnkAcc: CommonConstant.MrIdTypeCodeEKTP,
      MrCustTypeOwnerBnkAcc: CommonConstant.CustTypePersonal,
      PrsdntDirectorOwnerBnkAcc: '',
      IdNoOwnerBankAcc: '',
      BirthDtOwnerBankAcc: '',
      BirthPlaceOwnerBankAcc: '',
      BankAccOwnerAddress: {
        Addr: '',
        AreaCode1: '',
        AreaCode2: '',
        AreaCode3: '',
        AreaCode4: '',
        City: '',
      },
      BankAccOwnerAddressZipcode: {
        value: ''
      }
    });
  }

  async GetListActiveRefMaster(RefMasterTypeCode: string) {
    const tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: RefMasterTypeCode, MappingCode: null };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, tempReq).toPromise().then(
      (response) => {
        this.DictRefMaster[RefMasterTypeCode] = response[CommonConstant.ReturnObj];
      });
  }

  isCustomerTypeCompany() {
    if (this.NapAppModelForm.controls.MrCustTypeOwnerBnkAcc.value == CommonConstant.CustTypeCompany) {
      this.isMrCustTypeCompany = true;
    } else {
      this.isMrCustTypeCompany = false;
    }
  }

  initDdlMrWop() {
    this.ddlMrWopObj.apiUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.ddlMrWopObj.requestObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeWOP
    }
    this.ddlMrWopObj.ddlType = UcDropdownListConstant.DDL_TYPE_ONE;
    this.ddlMrWopObj.isSelectOutput = true;
  }

  initDdlMrFirstInstType() {
    this.ddlMrFirstInstTypeObj.apiUrl = URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL;
    this.ddlMrFirstInstTypeObj.requestObj = {
      ProdOfferingCode: this.resultResponse.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefProdCompFirstInstType,
      ProdOfferingVersion: this.resultResponse.ProdOfferingVersion
    };
    this.ddlMrFirstInstTypeObj.customObjName = "DDLRefProdComptCode";
    this.ddlMrFirstInstTypeObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.isDdlMrFirstInstTypeReady = true;
  }

  initDdlInterestType() {
    this.ddlInterestTypeObj.apiUrl = URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL;
    this.ddlInterestTypeObj.requestObj = {
      ProdOfferingCode: this.resultResponse.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefProdCompIntrstType,
      ProdOfferingVersion: this.resultResponse.ProdOfferingVersion
    };
    this.ddlInterestTypeObj.customObjName = "DDLRefProdComptCode";
    this.ddlInterestTypeObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.isDdlInterestTypeReady = true;
  }

  initDdlInstallmentScheme() {
    this.ddlInstallmentSchemeObj.apiUrl = URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL;
    this.ddlInstallmentSchemeObj.requestObj = {
      ProdOfferingCode: this.resultResponse.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefProdCompInstScheme,
      ProdOfferingVersion: this.resultResponse.ProdOfferingVersion
    };
    this.ddlInstallmentSchemeObj.customObjName = "DDLRefProdComptCode";
    this.ddlInstallmentSchemeObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.isDdlInstallmentSchemeReady = true;
  }
  
  initDdlPayFreq() {
    this.ddlPayFreqObj.apiUrl = URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL;
    this.ddlPayFreqObj.requestObj = {
      ProdOfferingCode: this.resultResponse.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefMasterTypeCodePayFreq,
      ProdOfferingVersion: this.resultResponse.ProdOfferingVersion
    };
    this.ddlPayFreqObj.customObjName = "DDLRefProdComptCode";
    this.ddlPayFreqObj.ddlType = UcDropdownListConstant.DDL_TYPE_ONE;
    this.ddlPayFreqObj.isSelectOutput = true;
    this.isDdlPayFreqReady = true;
  }

  getInterestTypeCode() {
    const obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    obj.ProdOfferingCode = this.resultResponse.ProdOfferingCode;
    obj.RefProdCompntCode = CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
    obj.ProdOfferingVersion = this.resultResponse.ProdOfferingVersion;

    this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).subscribe(
      (response) => {
        this.NapAppModelForm.patchValue({
          InterestType: response['CompntValue'],
          InterestTypeDesc: response['CompntValueDesc'],
        });
        this.ChangeInterestType();
      });
  }

  async getRefMaster() {
    this.MasterCustType = CommonConstant.RefMasterTypeCodeCustType;
    this.MasterIdNoType = CommonConstant.RefMasterTypeCodeIdType;
    await this.GetListActiveRefMaster(this.MasterCustType);
    await this.GetListActiveRefMaster(this.MasterIdNoType);
  }

  ChangeInterestType() {
    if (this.NapAppModelForm.value.InterestType === CommonConstant.InterestTypeFixed) {
      this.isFixedRate = true;
    } else {
      this.isFixedRate = false;
    }
  }
  ChangeCharacteristicOfCredit() {
    if (this.NapAppModelForm.value.CharaCredit === CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.NapAppModelForm.controls.WayRestructure.setValidators(Validators.required);
    } else {
      this.NapAppModelForm.controls.WayRestructure.clearValidators();
    }
    this.NapAppModelForm.controls.WayRestructure.updateValueAndValidity();
  }

  GetCrossInfoData() {
    this.http.post(URLConstant.GetListAppCross, { Id: this.AppId, RowVersion: '' }).subscribe(
      (response) => {
        this.resultCrossApp = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.resultCrossApp.length; i++) {
          this.ListCrossAppObj['result'].push(this.resultCrossApp[i].CrossAgrmntNo);
        }
      });
  }

  getLeadSrcCodeByLeadId(leadId: number) {
    this.http.post<LeadObj>(URLConstant.GetLeadByLeadId, { Id: leadId }).subscribe(
      resp => {
        this.NapAppModelForm.patchValue({
          MrAppSourceCode: resp.MrLeadSourceCode
        })
      }
    )
  }


  async getAppModelInfo() {
    await this.getAppXData();

    await this.http.post(URLConstant.GetAppDetailForTabAddEditAppById, { Id: this.AppId }).toPromise().then(
      async (response: AppObj) => {
        this.resultResponse = response;

        this.initDdlMrFirstInstType();
        this.initDdlInterestType();
        this.initDdlInstallmentScheme();
        this.initDdlPayFreq();

        this.NapAppModelForm.patchValue({
          MouCustId: this.resultResponse.MouCustId,
          LeadId: this.resultResponse.LeadId,
          AppNo: this.resultResponse.AppNo,
          OriOfficeCode: this.resultResponse.OriOfficeCode,
          OriOfficeName: this.resultResponse.OriOfficeName,
          CrtOfficeCode: this.resultResponse.CrtOfficeCode,
          CrtOfficeName: this.resultResponse.CrtOfficeName,
          ProdOfferingCode: this.resultResponse.ProdOfferingCode,
          ProdOfferingName: this.resultResponse.ProdOfferingName,
          ProdOfferingVersion: this.resultResponse.ProdOfferingVersion,
          AppCreatedDt: this.resultResponse.AppCreatedDt,
          AppStat: this.resultResponse.AppStat,
          AppCurrStep: this.resultResponse.AppCurrStep,
          AppLastStep: this.resultResponse.AppLastStep,
          CurrCode: this.resultResponse.CurrCode,
          LobCode: this.resultResponse.LobCode,
          RefProdTypeCode: this.resultResponse.RefProdTypeCode,
          Tenor: this.resultResponse.Tenor,
          NumOfInst: this.resultResponse.NumOfInst,
          PayFreqCode: this.resultResponse.PayFreqCode == null ? '' : this.resultResponse.PayFreqCode,
          MrFirstInstTypeCode: this.resultResponse.MrFirstInstTypeCode == null ? '' : this.resultResponse.MrFirstInstTypeCode,
          NumOfAsset: this.resultResponse.NumOfAsset,
          MrLcCalcMethodCode: this.resultResponse.MrLcCalcMethodCode,
          LcInstRatePrml: this.resultResponse.LcInstRatePrml,
          LcInsRatePrml: this.resultResponse.LcInsRatePrml,
          MrAppSourceCode: this.resultResponse.MrAppSourceCode == null ? '' : this.resultResponse.MrAppSourceCode,
          MrWopCode: this.resultResponse.MrWopCode == null ? '' : this.resultResponse.MrWopCode,
          SrvyOrderNo: this.resultResponse.SrvyOrderNo,
          ApvDt: this.resultResponse.ApvDt,
          SalesHeadNo: this.resultResponse.SalesHeadNo,
          SalesHeadName: this.resultResponse.SalesHeadName,
          SalesNotes: this.resultResponse.SalesNotes,
          SalesOfficerNo: this.resultResponse.SalesOfficerNo,
          SalesOfficerName: this.resultResponse.SalesOfficerName,
          CreditAdminNo: this.resultResponse.CreditAdminNo,
          CreditAnalystNo: this.resultResponse.CreditAnalystNo,
          CreditRiskNo: this.resultResponse.CreditRiskNo,
          DataEntryNo: this.resultResponse.DataEntryNo,
          MrCustNotifyOptCode: this.resultResponse.MrCustNotifyOptCode == null ? '' : this.resultResponse.MrCustNotifyOptCode,
          PreviousAppId: this.resultResponse.PreviousAppId,
          IsAppInitDone: this.resultResponse.IsAppInitDone,
          MrOrderInfoCode: this.resultResponse.MrOrderInfoCode,
          ApprovalStat: this.resultResponse.ApprovalStat,
          RsvField1: this.resultResponse.RsvField1,
          RsvField2: this.resultResponse.RsvField2,
          RsvField3: this.resultResponse.RsvField3,
          RsvField4: this.resultResponse.RsvField4,
          RsvField5: this.resultResponse.RsvField5,
          MrInstSchemeCode: this.resultResponse.MrInstSchemeCode == null ? '' : this.resultResponse.MrInstSchemeCode,
          InterestType: this.resultResponse.InterestType,
          CharaCredit: this.resultResponse.MrCharacteristicOfCreditCode,
          PrevAgrNo: this.resultResponse.PrevAgrmntNo,
          WayRestructure: this.resultResponse.MrWayOfRestructureCode,
          DpSrcPaymentCode: this.resultResponse.MrDpSrcPaymentCode,
          InstSrcPaymentCode: this.resultResponse.MrInstSrcPaymentCode
        });

        if(this.resultResponse.MrSlikSecEcoCode){
          this.NapAppModelForm.patchValue({
            MrSlikSecEcoCode: this.resultResponse.MrSlikSecEcoCode,
          });
        }

        if (this.resultResponse.LeadId != null) {
          this.getLeadSrcCodeByLeadId(this.resultResponse.LeadId);
        }
        if (this.resultResponse.MouCustId != 0 && this.resultResponse.MouCustId != undefined && this.resultResponse.MouCustId != null) {
          this.isFromMouCust = true;
          this.setTenor(this.resultResponse.MouCustId);
        }
        if (this.NapAppModelForm.controls.MrWopCode.value == this.WopAutoDebit) {
          this.GetBankAccCust();
          this.setBankAcc(this.NapAppModelForm.controls.MrWopCode.value)
        }

        this.makeNewLookupCriteria();
        this.getInterestTypeCode();
        this.GenerateAppAttrContent();
      });

    if (this.NapAppModelForm.controls.PayFreqCode.value == CommonConstant.PAY_FREQ_MONTHLY) {
      const total = this.NapAppModelForm.controls.Tenor.value
      this.PatchNumOfInstallment(total)
    }
    this.checkIdNoType();
  }

  GenerateAppAttrContent() {
    this.isAppAttrContentReady = false;
    const GenObj = {
      AppId: this.AppId,
      AttrGroup: CommonConstant.AttrGroupApplicationData + '_' + CommonConstant.FL4W,
    };
    this.http.post(URLConstant.GenerateAppAttrContent, GenObj).subscribe(
      (response) => {
        this.GenerateAppAttrContentObjs = response['GenerateAppAttrContentObjs'];

        this.GenerateAppAttrContentForm();
        this.isAppAttrContentReady = true;
      });
  }

  GenerateAppAttrContentForm() {
    if (this.GenerateAppAttrContentObjs != null) {
      this.ListAttrAnswer = [];
      for (let i = 0; i < this.GenerateAppAttrContentObjs.length; i++) {
        this.ListAttrAnswer.push([]);
        if (this.GenerateAppAttrContentObjs[i].AttrQuestionValue != null) {
          this.ListAttrAnswer[i].push(this.GenerateAppAttrContentObjs[i].AttrQuestionValue);
        } else {
          this.ListAttrAnswer[i].push('');
        }
      }
      const listAppAssetAttrs = this.NapAppModelForm.controls['AppAttrContentObjs'] as FormArray;
      while (listAppAssetAttrs.length !== 0) {
        listAppAssetAttrs.removeAt(0);
      }
      for (let i = 0; i < this.GenerateAppAttrContentObjs.length; i++) {
        listAppAssetAttrs.push(this.addGroupAppAttrContent(this.GenerateAppAttrContentObjs[i], i));
      }
      this.ListInputLookUpObj.push(this.tempLookup);
    }
  }

  addGroupAppAttrContent(generateAppAttrContentObj: GenerateAppAttrContentObj, i: number) {
    const ListValidator: Array<ValidatorFn> = this.setAppAttrContentValidators(generateAppAttrContentObj);

    return this.setFbGroupAppAttrContent(generateAppAttrContentObj, i, ListValidator);
  }

  private setAppAttrContentValidators(generateAppAttrContentObj: GenerateAppAttrContentObj) {
    const ListValidator: Array<ValidatorFn> = new Array<ValidatorFn>();

    if (generateAppAttrContentObj.IsMandatory == true) {
      ListValidator.push(Validators.required);
    }
    if (generateAppAttrContentObj.AttrLength != null && generateAppAttrContentObj.AttrLength != 0) {
      ListValidator.push(Validators.maxLength(generateAppAttrContentObj.AttrLength));
    }
    if (generateAppAttrContentObj.PatternValue != null && generateAppAttrContentObj.PatternValue != '') {
      ListValidator.push(Validators.pattern(generateAppAttrContentObj.PatternValue));
    }

    return ListValidator;
  }

  private setFbGroupAppAttrContent(generateAppAttrContentObj: GenerateAppAttrContentObj, i: number, ListValidator: Array<ValidatorFn>) {

    const tempFB = this.fb.group({
      No: [i],
      RefAttrCode: [generateAppAttrContentObj.RefAttrCode],
      RefAttrName: [generateAppAttrContentObj.RefAttrName],
      AttrInputType: [generateAppAttrContentObj.AttrInputType],
      AttrValue: [generateAppAttrContentObj.AttrValue],
      IsMandatory: [generateAppAttrContentObj.IsMandatory]
    });
    if (ListValidator.length > 0) {
      tempFB.get('AttrValue').setValidators(ListValidator);
    }

    if (generateAppAttrContentObj.AttrInputType == this.AttrInputTypeRefMaster) {
      this.tempLookup[generateAppAttrContentObj.RefAttrCode] = new InputLookupObj();
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].isReady = false;
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].urlJson = './assets/uclookup/lookupRefMaster.json';
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].urlEnviPaging = environment.FoundationR3Url + '/v1';
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].pagingJson = './assets/uclookup/lookupRefMaster.json';
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].genericJson = './assets/uclookup/lookupRefMaster.json';
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].title = generateAppAttrContentObj.RefAttrName;
      if (generateAppAttrContentObj.IsMandatory == true) {
        this.tempLookup[generateAppAttrContentObj.RefAttrCode].isRequired = true;
      } else {
        this.tempLookup[generateAppAttrContentObj.RefAttrCode].isRequired = false;
      }

      const arrAddCrit = new Array();
      const critAssetObj = new CriteriaObj();
      critAssetObj.DataType = 'text';
      critAssetObj.restriction = AdInsConstant.RestrictionEq;
      critAssetObj.propName = 'REF_MASTER_TYPE_CODE';
      critAssetObj.value = generateAppAttrContentObj.RefAttrValue;
      arrAddCrit.push(critAssetObj);
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].addCritInput = arrAddCrit;

      if (generateAppAttrContentObj.AttrValue != null && generateAppAttrContentObj.AttrValue != '') {
        const refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
          RefMasterTypeCode: generateAppAttrContentObj.RefAttrValue,
          MasterCode: generateAppAttrContentObj.AttrValue
        };
        this.http.post(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
          (response: KeyValueObj) => {
            this.tempLookup[generateAppAttrContentObj.RefAttrCode].nameSelect = response.Value;
            this.tempLookup[generateAppAttrContentObj.RefAttrCode].jsonSelect = { Descr: response.Value }
            this.tempLookup[generateAppAttrContentObj.RefAttrCode].isReady = true;
          });
      } else {
        this.tempLookup[generateAppAttrContentObj.RefAttrCode].isReady = true;
      }
    }

    return tempFB;
  }

  SetAttrValueRm(e, i) {
    this.NapAppModelForm.controls['AppAttrContentObjs']['controls'][i].patchValue({
      AttrValue: e.MasterCode
    });
  }

  getAppSrcData() {
    this.http.post(URLConstant.GetListKvpActiveRefAppSrc, null).subscribe(
      (response) => {
        this.applicationDDLitems['APP_SOURCE'] = response[CommonConstant.ReturnObj];
      });
  }

  DictRefPayFreq: object = {};
  getPayFregData() {
    let obj = { RowVersion: "" };

    this.http.post(URLConstant.GetListActiveRefPayFreq, obj).subscribe(
      (response) => {
        let objTemp = response[CommonConstant.ReturnObj];
        for (let i = 0; i < objTemp.length; i++) {
          this.DictRefPayFreq[objTemp[i].PayFreqCode] = objTemp[i];
        }
        this.applicationDDLitems["Floating_Period"] = objTemp;

        if (this.resultResponse.PayFreqCode != null) {
          this.PayFreqVal = this.DictRefPayFreq[this.resultResponse.PayFreqCode].PayFreqVal;
          this.PayFreqTimeOfYear = this.DictRefPayFreq[this.resultResponse.PayFreqCode].TimeOfYear;
        }
        this.ChangeNumOfInstallmentTenor();
      }
    );
  }

  getRefMasterTypeCode(code) {
    const obj = {
      RefMasterTypeCode: code,
      RowVersion: ''
    };

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, obj).subscribe(
      (response) => {
        const objTemp = response[CommonConstant.ReturnObj];
        this.applicationDDLitems[code] = objTemp;
        if (code == CommonConstant.RefMasterTypeCodeCharacteristicCredit && this.NapAppModelForm.value.CharaCredit == '') {
          this.NapAppModelForm.patchValue({
            CharaCredit: this.applicationDDLitems['CHARACTERISTIC_OF_CREDIT'][1].Key,
            MrSlikSecEcoCode: this.defaultSlikSecEcoCode
          });
        } else if (code == CommonConstantX.RefMasterTypeCodeStatusBpkb) {
          this.NapAppModelForm.patchValue({
            BpkbStatCode: objTemp[0].Key
          });
        }
      });
  }

  changeCustomerType(custType: string = CommonConstant.CustTypePersonal) {
    this.NapAppModelForm.patchValue({
      MrCustTypeOwnerBnkAcc: custType
    });
    if (custType === CommonConstant.CustTypeCompany) {
      this.isMrCustTypeCompany = true;
    } else {
      this.isMrCustTypeCompany = false;
      this.NapAppModelForm.patchValue({
        PrsdntDirectorOwnerBnkAcc: ''
      });
    }
  }

  getLookupEmployeeResponse(ev) {
    this.NapAppModelForm.patchValue({
      SalesOfficerNo: ev.SalesOfficerNo,
      SalesOfficerName: ev.SalesOfficerName,
      SalesHeadNo: ev.SalesHeadNo,
      SalesHeadName: ev.SalesHeadName

    });
  }
  getLookupEconomicSector(ev) {
    this.NapAppModelForm.patchValue({
      MrSlikSecEcoCode: ev.RefSectorEconomySlikCode
    });
  }

  setLookupCommodityData(ev) {
    this.NapAppModelForm.patchValue({
      CommodityCode: ev.MasterCode
    });
  }

  makeLookUpObj() {
    // Lookup obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = './assets/uclookup/NAP/lookupEmp.json';
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + '/v1';
    this.inputLookupObj.pagingJson = './assets/uclookup/NAP/lookupEmp.json';
    this.inputLookupObj.genericJson = './assets/uclookup/NAP/lookupEmp.json';
    this.inputLookupObj.jsonSelect = this.resultResponse;
    // this.inputLookupObj.nameSelect = this.NapAppModelForm.controls.SalesOfficerName.value;
    this.inputLookupObj.addCritInput = this.arrAddCrit;
    this.inputLookupEconomicSectorObj = new InputLookupObj();
    this.inputLookupEconomicSectorObj.urlJson = './assets/impl/uclookup/NAP/lookupEconomicSectorSlikX.json';
    this.inputLookupEconomicSectorObj.urlEnviPaging = environment.FoundationR3Url + '/v1';
    this.inputLookupEconomicSectorObj.pagingJson = './assets/impl/uclookup/NAP/lookupEconomicSectorSlikX.json';
    this.inputLookupEconomicSectorObj.genericJson = './assets/impl/uclookup/NAP/lookupEconomicSectorSlikX.json';

    let slikReqCode = {
      Code: this.defaultSlikSecEcoCode
    }

    if (this.resultResponse["MrSlikSecEcoCode"] != null && this.resultResponse["MrSlikSecEcoCode"] != "") {
      slikReqCode.Code = this.resultResponse["MrSlikSecEcoCode"];
    }

    this.http.post(URLConstantX.GetRefSectorEconomySlikXByCode, slikReqCode).subscribe(
      (response: any) => {
        this.slikSecDescr = response.SectorEconomySlikName;
        this.inputLookupEconomicSectorObj.nameSelect = response.SectorEconomySlikName;
        this.inputLookupEconomicSectorObj.jsonSelect = { RefSectorEconomySlikName: response.SectorEconomySlikName };
        this.NapAppModelForm.patchValue({
          MrSlikSecEcoCode: response.SectorEconomySlikCode
        });
      });

    // Lookup Commodity
    this.inputLookupCommodityObj = new InputLookupObj();
    // Self Custom Changes CR API Data Robot 413750
    this.inputLookupCommodityObj.urlJson = "./assets/dsf/uclookup/lookupCommodityDsf.json";
    this.inputLookupCommodityObj.pagingJson = "./assets/dsf/uclookup/lookupCommodityDsf.json";
    this.inputLookupCommodityObj.genericJson = "./assets/dsf/uclookup/lookupCommodityDsf.json";
    // Self Custom Changes CR API Data Robot 413750

    if (this.NapAppModelForm.controls.CommodityCode.value != '' && this.NapAppModelForm.controls.CommodityCode.value != null) {
      // this.inputLookupCommodityObj.idSelect = this.NapAppModelForm.controls.CommodityCode.value;
      this.inputLookupCommodityObj.nameSelect = this.tempCommodityName;
      this.inputLookupCommodityObj.jsonSelect = { Descr: this.tempCommodityName };
    }

    this.isInputLookupObj = true;
  }

  async makeNewLookupCriteria() {
    this.arrAddCrit = new Array();

    const addCrit1 = new CriteriaObj();
    addCrit1.DataType = 'bit';
    addCrit1.propName = 're.IS_ACTIVE';
    addCrit1.restriction = AdInsConstant.RestrictionEq;
    addCrit1.value = '1';
    this.arrAddCrit.push(addCrit1);

    const addCrit2 = new CriteriaObj();
    addCrit2.DataType = 'bit';
    addCrit2.propName = 'ru.IS_ACTIVE';
    addCrit2.restriction = AdInsConstant.RestrictionEq;
    addCrit2.value = '1';
    this.arrAddCrit.push(addCrit2);

    const addCrit4 = new CriteriaObj();
    addCrit4.DataType = 'text';
    addCrit4.propName = 'ro.OFFICE_CODE';
    addCrit4.restriction = AdInsConstant.RestrictionIn;
    addCrit4.listValue = [this.resultResponse.OriOfficeCode];
    this.arrAddCrit.push(addCrit4);

    let addCrit5 = new CriteriaObj();
    addCrit5.DataType = "bit";
    addCrit5.propName = "RUR.IS_ACTIVE";
    addCrit5.restriction = AdInsConstant.RestrictionEq;
    addCrit5.value = "1";
    this.arrAddCrit.push(addCrit5);

    await this.GetGSValueSalesOfficer();
    // this.inputLookupObj.addCritInput = this.arrAddCrit;
    this.makeLookUpObj();
  }

  async GetGSValueSalesOfficer() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeFilterAppDataSalesOfficerCode }).toPromise().then(
      async (response) => {
        let FilterBy = response.GsValue;
        await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeAppDataOfficer }).toPromise().then(
          (response) => {
            let addCrit3 = new CriteriaObj();
            addCrit3.DataType = "text";
            addCrit3.propName = FilterBy == "ROLE" ? "rr.ROLE_CODE" : "rbt.JOB_TITLE_CODE";
            addCrit3.restriction = AdInsConstant.RestrictionIn;
            addCrit3.listValue = response.GsValue.split(',');
            this.arrAddCrit.push(addCrit3);
          }
        );
      });
  }

  ChangeRecommendation(ev) {
  }
  ChangeNumOfInstallmentTenor() {
    const temp = this.NapAppModelForm.controls.Tenor.value;
    if (this.NapAppModelForm.controls.PayFreqCode.value == CommonConstant.PAY_FREQ_MONTHLY) {
      this.PatchNumOfInstallment(temp)
    } else {
      const total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }

  ChangeNumOfInstallmentPayFreq(ev) {
    let temp = this.NapAppModelForm.controls.Tenor.value;
    if (!isNaN(temp)) {
      this.PayFreqVal = this.DictRefPayFreq[ev.selectedValue].PayFreqVal;
      this.PayFreqTimeOfYear = this.DictRefPayFreq[ev.selectedValue].TimeOfYear;
      let total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }

  PatchNumOfInstallment(num) {
    this.NapAppModelForm.patchValue({
      NumOfInst: num
    });
  }

  GetAppObjValue() {
    const temp = new NapAppModel();
    temp.AppId = this.resultResponse.AppId;

    if (this.NapAppModelForm.controls.MouCustId.value == 'null') {
      temp.MouCustId = '';
    } else {
      temp.MouCustId = this.NapAppModelForm.controls.MouCustId.value;
    }

    temp.LeadId = this.NapAppModelForm.controls.LeadId.value;
    temp.AppNo = this.NapAppModelForm.controls.AppNo.value;
    temp.OriOfficeCode = this.NapAppModelForm.controls.OriOfficeCode.value;
    temp.OriOfficeName = this.NapAppModelForm.controls.OriOfficeName.value;
    temp.CrtOfficeCode = this.NapAppModelForm.controls.CrtOfficeCode.value;
    temp.CrtOfficeName = this.NapAppModelForm.controls.CrtOfficeName.value;
    temp.ProdOfferingCode = this.NapAppModelForm.controls.ProdOfferingCode.value;
    temp.ProdOfferingName = this.NapAppModelForm.controls.ProdOfferingName.value;
    temp.ProdOfferingVersion = this.NapAppModelForm.controls.ProdOfferingVersion.value;
    temp.AppCreatedDt = this.NapAppModelForm.controls.AppCreatedDt.value;
    temp.AppStat = this.NapAppModelForm.controls.AppStat.value;
    temp.AppCurrStep = this.NapAppModelForm.controls.AppCurrStep.value;
    temp.AppLastStep = this.NapAppModelForm.controls.AppLastStep.value;
    temp.CurrCode = this.NapAppModelForm.controls.CurrCode.value;
    temp.LobCode = this.NapAppModelForm.controls.LobCode.value;
    temp.RefProdTypeCode = this.NapAppModelForm.controls.RefProdTypeCode.value;
    temp.Tenor = this.NapAppModelForm.controls.Tenor.value;
    temp.NumOfInst = this.NapAppModelForm.controls.NumOfInst.value;
    temp.PayFreqCode = this.NapAppModelForm.controls.PayFreqCode.value;
    temp.MrFirstInstTypeCode = this.NapAppModelForm.controls.MrFirstInstTypeCode.value;
    temp.NumOfAsset = this.NapAppModelForm.controls.NumOfAsset.value;
    temp.MrLcCalcMethodCode = this.NapAppModelForm.controls.MrLcCalcMethodCode.value;
    temp.LcInstRatePrml = this.NapAppModelForm.controls.LcInstRatePrml.value;
    temp.LcInsRatePrml = this.NapAppModelForm.controls.LcInsRatePrml.value;
    temp.MrAppSourceCode = this.NapAppModelForm.controls.MrAppSourceCode.value;
    temp.MrWopCode = this.NapAppModelForm.controls.MrWopCode.value;
    temp.SrvyOrderNo = this.NapAppModelForm.controls.SrvyOrderNo.value;
    temp.ApvDt = this.NapAppModelForm.controls.ApvDt.value;
    temp.SalesHeadNo = this.NapAppModelForm.controls.SalesHeadNo.value;
    temp.SalesNotes = this.NapAppModelForm.controls.SalesNotes.value;
    temp.SalesOfficerNo = this.NapAppModelForm.controls.SalesOfficerNo.value;
    temp.CreditAdminNo = this.NapAppModelForm.controls.CreditAdminNo.value;
    temp.CreditAnalystNo = this.NapAppModelForm.controls.CreditAnalystNo.value;
    temp.CreditRiskNo = this.NapAppModelForm.controls.CreditRiskNo.value;
    temp.DataEntryNo = this.NapAppModelForm.controls.DataEntryNo.value;
    temp.MrCustNotifyOptCode = this.NapAppModelForm.controls.MrCustNotifyOptCode.value;
    temp.PreviousAppId = this.NapAppModelForm.controls.PreviousAppId.value;
    temp.IsAppInitDone = this.NapAppModelForm.controls.IsAppInitDone.value;
    temp.MrOrderInfoCode = this.NapAppModelForm.controls.MrOrderInfoCode.value;
    temp.ApprovalStat = this.NapAppModelForm.controls.ApprovalStat.value;
    temp.RsvField1 = this.NapAppModelForm.controls.RsvField1.value;
    temp.RsvField2 = this.NapAppModelForm.controls.RsvField2.value;
    temp.RsvField3 = this.NapAppModelForm.controls.RsvField3.value;
    temp.RsvField4 = this.NapAppModelForm.controls.RsvField4.value;
    temp.RsvField5 = this.NapAppModelForm.controls.RsvField5.value;
    temp.RowVersion = this.resultResponse.RowVersion;
    temp.MrSlikSecEcoCode = this.NapAppModelForm.controls.MrSlikSecEcoCode.value;
    temp.CharaCredit = this.NapAppModelForm.controls.CharaCredit.value;
    temp.PrevAgrNo = this.NapAppModelForm.controls.PrevAgrNo.value;
    temp.WayRestructure = this.NapAppModelForm.controls.WayRestructure.value;
    temp.MrDpSrcPaymentCode = this.NapAppModelForm.controls.DpSrcPaymentCode.value;
    temp.MrInstSrcPaymentCode = this.NapAppModelForm.controls.InstSrcPaymentCode.value;
    return temp;
  }

  GetListAppCrossValue() {
    const arr = [];
    for (let i = 0; i < this.resultCrossApp.length; i++) {
      const temp = new NapAppCrossObj();
      temp.AppId = this.AppId;
      temp.CrossAgrmntNo = this.resultCrossApp[i].CrossAgrmntNo;
      temp.CrossAppNo = this.resultCrossApp[i].CrossAppNo;
      temp.CustName = this.resultCrossApp[i].CustName;
      temp.MaturityDt = this.resultCrossApp[i].MaturityDt;
      temp.ContractStat = this.resultCrossApp[i].ContractStat;
      arr.push(temp);
    }
    return arr;
  }
  GetAppFinDataValue() {
    const temp = {
      AppId: this.AppId,
      MrInstSchemeCode: this.NapAppModelForm.controls.MrInstSchemeCode.value,
      InterestType: this.NapAppModelForm.controls.InterestType.value,
    }
    return temp;
  }

  async ClickSave() {
    if (this.NapAppModelForm.value.CharaCredit != CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.NapAppModelForm.patchValue({
        PrevAgrNo: null,
        WayRestructure: null
      });
    }
    const tempAppObj = this.GetAppObjValue();
    const tempListAppCrossObj = this.GetListAppCrossValue();
    const tempAppFindDataObj = this.GetAppFinDataValue();
    const tempAppCustAttrContentObj = this.getAppAttrContentObj();
    let appXobj = {};
    if (this.isShowAppCustBankAcc == false) {
      this.resetCustBankAccDetailForm();
      appXobj = {
        AppId: this.AppId,
        MrStatusBpkbCode: this.NapAppModelForm.controls.BpkbStatCode.value,
        MrOrdStatusCode: this.NapAppModelForm.controls.OrdStatCode.value,
        MrCommodityCode: this.NapAppModelForm.controls.CommodityCode.value,
        MrCustTypeOwnerBnkAcc: this.NapAppModelForm.controls.MrCustTypeOwnerBnkAcc.value,
        PrsdntDirectorOwnerBnkAcc: this.NapAppModelForm.controls.PrsdntDirectorOwnerBnkAcc.value,
        MrIdTypeOwnerBnkAcc: this.NapAppModelForm.controls.MrIdTypeOwnerBnkAcc.value,
        IdNoOwnerBankAcc: this.NapAppModelForm.controls.IdNoOwnerBankAcc.value,
        BirthPlaceOwnerBankAcc: this.NapAppModelForm.controls.BirthPlaceOwnerBankAcc.value,
        BirthDtOwnerBankAcc: this.NapAppModelForm.controls.BirthDtOwnerBankAcc.value,
        AddrOwnerBankAcc: "",
        AreaCode1OwnerBankAcc: "",
        AreaCode2OwnerBankAcc: "",
        AreaCode3OwnerBankAcc: "",
        AreaCode4OwnerBankAcc: "",
        CityOwnerBankAcc: "",
        ZipcodeOwnerBankAcc: "",
      };
    } else {
      appXobj = {
        AppId: this.AppId,
        MrStatusBpkbCode: this.NapAppModelForm.controls.BpkbStatCode.value,
        MrOrdStatusCode: this.NapAppModelForm.controls.OrdStatCode.value,
        MrCommodityCode: this.NapAppModelForm.controls.CommodityCode.value,
        MrCustTypeOwnerBnkAcc: this.NapAppModelForm.controls.MrCustTypeOwnerBnkAcc.value,
        PrsdntDirectorOwnerBnkAcc: this.NapAppModelForm.controls.PrsdntDirectorOwnerBnkAcc.value,
        MrIdTypeOwnerBnkAcc: this.NapAppModelForm.controls.MrIdTypeOwnerBnkAcc.value,
        IdNoOwnerBankAcc: this.NapAppModelForm.controls.IdNoOwnerBankAcc.value,
        BirthPlaceOwnerBankAcc: this.NapAppModelForm.controls.BirthPlaceOwnerBankAcc.value,
        BirthDtOwnerBankAcc: this.NapAppModelForm.controls.BirthDtOwnerBankAcc.value,
        AddrOwnerBankAcc: this.NapAppModelForm.controls['BankAccOwnerAddress']['controls'].Addr.value,
        AreaCode1OwnerBankAcc: this.NapAppModelForm.controls['BankAccOwnerAddress']['controls'].AreaCode1.value,
        AreaCode2OwnerBankAcc: this.NapAppModelForm.controls['BankAccOwnerAddress']['controls'].AreaCode2.value,
        AreaCode3OwnerBankAcc: this.NapAppModelForm.controls['BankAccOwnerAddress']['controls'].AreaCode3.value,
        AreaCode4OwnerBankAcc: this.NapAppModelForm.controls['BankAccOwnerAddress']['controls'].AreaCode4.value,
        CityOwnerBankAcc: this.NapAppModelForm.controls['BankAccOwnerAddress']['controls'].City.value,
        ZipcodeOwnerBankAcc: this.NapAppModelForm.controls['BankAccOwnerAddressZipcode']['controls'].value.value,
      };
    }
    const obj = {
      AppObj: tempAppObj,
      ListAppCrossObj: tempListAppCrossObj,
      AppFinData: tempAppFindDataObj,
      AppOtherInfoObj: this.GetBankInfo,
      AppAttrContentObjs: tempAppCustAttrContentObj,
      RowVersion: this.resultResponse.RowVersion,
      AppXObj: appXobj
    };

    if (this.isFromMouCust == true) {
      if (this.NapAppModelForm.controls.Tenor.value > this.TenorTo || this.NapAppModelForm.controls.Tenor.value < this.TenorFrom) {
        this.isTenorValid = false;
      } else { this.isTenorValid = true; }
    }

    obj['AppCustMailingAddr'] = this.getMailingAddrForSave();

    if (this.isTenorValid == true) {
      // region: additional validation transaction leasseback
      let isAlreadyHasAsset: boolean = false;
      let allAssetName: string[] = []
      let allAssetAttributePlatColor: string[] = []
      let platColorRequestObj = {
        Id: this.AppId
      }
      await this.http.post(URLConstant.GetListAllAssetDataByAppId, platColorRequestObj).toPromise().then((res: any) => {
        if (res['ReturnObject'] !== null && res['ReturnObject'].length > 0) {
          isAlreadyHasAsset = true;
          if (res['ReturnObject'].length > 0) {
            for (let i = 0; i < res['ReturnObject'].length; i++) {
              // ASSET NAMES
              if (res['ReturnObject'][i].ResponseAppAssetObj) {
                let fullAssetName = '';
                if (res['ReturnObject'][i].ResponseAppAssetObj.FullAssetName !== null) {
                  fullAssetName = res['ReturnObject'][i].ResponseAppAssetObj.FullAssetName
                }
                allAssetName.push(fullAssetName);
              }

              // ASSET ATTRIBUTES
              const attributes: any[] = res['ReturnObject'][i].ResponseAppAssetAttrObjs
              if (attributes.length > 0) {
                for (let x = 0; x < attributes.length; x++) {
                  if (attributes[x].AssetAttrCode === CommonConstantX.APP_ASSET_ATTRIBUTE_PLAT_COLOR) {
                    allAssetAttributePlatColor.push(attributes[x].AttrValue)
                  }
                }
              }
            }
          }
        }
      });
      if (isAlreadyHasAsset) {
        let purposeOfFinancing = '';
        const prodOffferingPOFRequestObj = {
          ProdOfferingCode: tempAppObj.ProdOfferingCode,
          ProdOfferingVersion: tempAppObj.ProdOfferingVersion,
          RefProdCompntCode: CommonConstant.RefProdCompntCodePurposeOfFinancing
        }
        await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, prodOffferingPOFRequestObj).toPromise().then((res) => {
          const componentValue = res['CompntValue']
          if (componentValue !== null) {
            purposeOfFinancing = componentValue
          }
        });

        let wayOfFinancing = '';
        const prodOffferingWOFRequestObj = {
          ProdOfferingCode: tempAppObj.ProdOfferingCode,
          ProdOfferingVersion: tempAppObj.ProdOfferingVersion,
          RefProdCompntCode: CommonConstant.RefProdCompntCodeWayOfFinancing
        }
        await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, prodOffferingWOFRequestObj).toPromise().then((res) => {
          const componentValue = res['CompntValue']
          if (componentValue !== null) {
            wayOfFinancing = componentValue
          }
        });
        const errorMessages: string[] = await this.CheckValidationTransactionLeasseback(tempAppObj.Tenor, purposeOfFinancing, wayOfFinancing, allAssetAttributePlatColor, allAssetName)
        console.log(errorMessages)
        if (errorMessages.length > 0) {
          for (let i = 0; i < errorMessages.length; i++) {
            this.toastr.warningMessage(errorMessages[i]);
          }
          return;
        }
      }
      // endregion: additional validation transaction leasseback

      this.http.post(URLConstantX.EditAppAddAppCrossX, obj).subscribe(
        (response) => {
          if (response['StatusCode'] == 200) {
            this.toastr.successMessage('Save Application Data');
            this.outputTab.emit();
          } else {
            this.toastr.warningMessage(response['message']);
          }
        });
    }
    if (this.isTenorValid == false) {
      this.toastr.errorMessage('Tenor must be between ' + this.TenorFrom + ' and ' + this.TenorTo)
    }
  }

  async CheckValidationTransactionLeasseback(tenor: number, purposeOfFinancing: string, wayOfFinancing: string, allAssetAttributePlatColor: string[], allAssetName: string[]) {
    // get GS Tenor
    let errorMessages: string[] = [];

    let arrMinTenorAssetFL: any[]
    const minTenorAssetFLRequestObj = {
      Code: CommonConstantX.GsCodeMinTenorAssetFL
    }
    await this.http.post(URLConstant.GetGeneralSettingByCode, minTenorAssetFLRequestObj).toPromise().then((res) => {
      const GsValue = res['GsValue']
      if (GsValue !== null) {
        let tempArr: any[] = GsValue.split(";")
        if (tempArr.length > 0) {
          for (let i = 0; i < tempArr.length; i++) {
            tempArr[i] = tempArr[i].split(":")
          }
        }
        arrMinTenorAssetFL = tempArr
      }
    });

    // get GS Tenor
    let arrMapPofWofFL: string[] = [];
    const MapPofWofFLRequestObj = {
      Code: CommonConstantX.GsCodeMapPofWofFL
    }
    await this.http.post(URLConstant.GetGeneralSettingByCode, MapPofWofFLRequestObj).toPromise().then((res) => {
      const GsValue = res['GsValue']
      if (GsValue !== null) {
        arrMapPofWofFL = GsValue.split(";")
      }
    });

    const mapPofWof = purposeOfFinancing + ":" + wayOfFinancing
    if (arrMapPofWofFL.length > 0) {
      for (let i = 0; i < arrMapPofWofFL.length; i++) {
        if (mapPofWof === arrMapPofWofFL[i]) {
          if (allAssetAttributePlatColor.length > 0) {
            for (let x = 0; x < allAssetAttributePlatColor.length; x++) {
              const assetName = allAssetName[x]
              const attrPlatColor = allAssetAttributePlatColor[x]
              for (let gsIdx = 0; gsIdx < arrMinTenorAssetFL.length; gsIdx++) {
                const gsPlatColor = arrMinTenorAssetFL[gsIdx][0];
                const gsTenorMonth = arrMinTenorAssetFL[gsIdx][1];
                if (attrPlatColor === gsPlatColor && tenor < gsTenorMonth) {
                  let messageColor = 'Yellow';
                  if (attrPlatColor === 'BLACK' || attrPlatColor === 'WHITE') {
                    messageColor = 'Black/White'
                  }
                  errorMessages.push(`Plat Color ${messageColor} must have minimum tenor of ${gsTenorMonth} for asset ${assetName}`)
                }
              }
            }
          }
          break;  // to stop POF and WOF Validation loop
        }
      }
    }
    return errorMessages
  }

  Open(contentCrossApp) {
    this.modalService.open(contentCrossApp).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAppAttrContentObj() {
    const appAttrContentObjs = new Array<AppAttrContentObj>();
    if (this.GenerateAppAttrContentObjs != null) {
      for (let i = 0; i < this.NapAppModelForm.controls['AppAttrContentObjs'].value.length; i++) {
        const appAttrContentObj = new AppAttrContentObj();
        appAttrContentObj.AppId = this.AppId;
        appAttrContentObj.RefAttrCode = this.NapAppModelForm.controls['AppAttrContentObjs'].value[i].RefAttrCode;
        appAttrContentObj.AttrValue = this.NapAppModelForm.controls['AppAttrContentObjs'].value[i].AttrValue;

        appAttrContentObjs.push(appAttrContentObj);
      }
    }

    return appAttrContentObjs;
  }

  AddTemp(contentCrossApp) {
    this.Open(contentCrossApp);
  }
  GetDataTemp(ev) {
    for (const i of ev) {
      const tempCrossApp = new NapAppCrossObj();
      tempCrossApp.CrossAgrmntNo = i.AgrmntNo;
      tempCrossApp.CrossAppNo = i.AppNo;
      tempCrossApp.CustName = i.CustName;
      tempCrossApp.ContractStat = i.AgrmntStat;
      tempCrossApp.MaturityDt;
      this.resultCrossApp.push(tempCrossApp);
      this.ListCrossAppObj['result'].push(i.AgrmntNo);
    }
  }


  DeleteCrossApp(idx) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      if (this.resultCrossApp[idx].AppCrossId != null) {
        let obj = new NapAppCrossObj();
        obj = this.resultCrossApp[idx];
        this.resultCrossApp.splice(idx, 1);
        this.ListCrossAppObj["result"].splice(idx, 1);
      }
    }
  }
  async initMailingAddress() {

    this.mailingAddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;

    await this.http.post(URLConstant.GetListAppCustAddrByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.copyToMailing(CommonConstant.AddrTypeMailing);
        this.copyToMailingTypeObj = this.copyToMailingTypeObj.filter((x, i) => {
          let isExists = this.AppCustAddrObj.findIndex(y => y.MrCustAddrTypeCode == x.Key);
          return isExists > -1;
        })
      }
    );
  }

  copyToMailing(addrType: string = '') {

    if (!addrType) addrType = this.NapAppModelForm.controls.CopyFromMailing.value;
    if (!addrType) return;

    let address = this.AppCustAddrObj.find(emp => emp.MrCustAddrTypeCode === addrType);
    if (address != null && address != undefined) {
      this.mailingAddrObj.Addr = address.Addr;
      this.mailingAddrObj.AreaCode1 = address.AreaCode1;
      this.mailingAddrObj.AreaCode2 = address.AreaCode2;
      this.mailingAddrObj.AreaCode3 = address.AreaCode3;
      this.mailingAddrObj.AreaCode4 = address.AreaCode4;
      this.mailingAddrObj.City = address.City;
      this.mailingAddrObj.Fax = address.Fax;
      this.mailingAddrObj.FaxArea = address.FaxArea;
      this.mailingAddrObj.Phn1 = address.Phn1;
      this.mailingAddrObj.Phn2 = address.Phn2;
      this.mailingAddrObj.Phn3 = address.Phn3;
      this.mailingAddrObj.PhnArea1 = address.PhnArea1;
      this.mailingAddrObj.PhnArea2 = address.PhnArea2;
      this.mailingAddrObj.PhnArea3 = address.PhnArea3;
      this.mailingAddrObj.PhnExt1 = address.PhnExt1;
      this.mailingAddrObj.PhnExt2 = address.PhnExt2;
      this.mailingAddrObj.PhnExt3 = address.PhnExt3;

      this.inputAddressObj.inputField.inputLookupObj.nameSelect = address.Zipcode;
      this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: address.Zipcode };
      this.inputAddressObj.default = this.mailingAddrObj;

      this.NapAppModelForm.patchValue({
        CopyFromMailing: ""
      });
    }
  }

  getMailingAddrForSave() {
    const mailingAddr: AppCustAddrObj = new AppCustAddrObj();
    mailingAddr.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
    mailingAddr.Addr = this.NapAppModelForm.controls['Address']['controls'].Addr.value;
    mailingAddr.AreaCode3 = this.NapAppModelForm.controls['Address']['controls'].AreaCode3.value;
    mailingAddr.AreaCode4 = this.NapAppModelForm.controls['Address']['controls'].AreaCode4.value;
    mailingAddr.Zipcode = this.NapAppModelForm.controls['AddressZipcode']['controls'].value.value;
    mailingAddr.AreaCode1 = this.NapAppModelForm.controls['Address']['controls'].AreaCode1.value;
    mailingAddr.AreaCode2 = this.NapAppModelForm.controls['Address']['controls'].AreaCode2.value;
    mailingAddr.City = this.NapAppModelForm.controls['Address']['controls'].City.value;
    mailingAddr.PhnArea1 = this.NapAppModelForm.controls['Address']['controls'].PhnArea1.value;
    mailingAddr.Phn1 = this.NapAppModelForm.controls['Address']['controls'].Phn1.value;
    mailingAddr.PhnExt1 = this.NapAppModelForm.controls['Address']['controls'].PhnExt1.value;
    mailingAddr.PhnArea2 = this.NapAppModelForm.controls['Address']['controls'].PhnArea2.value;
    mailingAddr.Phn2 = this.NapAppModelForm.controls['Address']['controls'].Phn2.value;
    mailingAddr.PhnExt2 = this.NapAppModelForm.controls['Address']['controls'].PhnExt2.value;
    mailingAddr.PhnArea3 = this.NapAppModelForm.controls['Address']['controls'].PhnArea3.value;
    mailingAddr.Phn3 = this.NapAppModelForm.controls['Address']['controls'].Phn3.value;
    mailingAddr.PhnExt3 = this.NapAppModelForm.controls['Address']['controls'].PhnExt3.value;
    mailingAddr.FaxArea = this.NapAppModelForm.controls['Address']['controls'].FaxArea.value;
    mailingAddr.Fax = this.NapAppModelForm.controls['Address']['controls'].Fax.value;
    mailingAddr.SubZipcode = this.NapAppModelForm.controls['Address']['controls'].SubZipcode.value;
    return mailingAddr;
  }
  setBankAcc(WOP: string) {
    if (WOP == this.WopAutoDebit) {
      // this.NapAppModelForm.controls['CustBankAcc'].setValidators([Validators.required]);
      // this.NapAppModelForm.controls['CustBankAcc'].updateValueAndValidity();

      if (this.NapAppModelForm.controls.MrIdTypeOwnerBnkAcc.value == CommonConstant.MrIdTypeCodeEKTP) {
        this.NapAppModelForm.get('IdNoOwnerBankAcc').setValidators([Validators.pattern('^[0-9]+$'), Validators.minLength(16), Validators.maxLength(16)]);
        this.NapAppModelForm.get('IdNoOwnerBankAcc').updateValueAndValidity();
      }
      this.isShowAppCustBankAcc = true;
    } else {
      // this.NapAppModelForm.controls['CustBankAcc'].clearValidators();
      // this.NapAppModelForm.controls['CustBankAcc'].updateValueAndValidity();

      this.NapAppModelForm.controls['IdNoOwnerBankAcc'].clearValidators();
      this.NapAppModelForm.controls['IdNoOwnerBankAcc'].updateValueAndValidity();
      this.isShowAppCustBankAcc = false;
    }
    this.NapAppModelForm.controls.CustBankAcc.updateValueAndValidity();
  }

  setBankAccDDL(event: UcDropdownListCallbackObj) {
    if (event.selectedValue == this.WopAutoDebit) {
      // this.NapAppModelForm.controls['CustBankAcc'].setValidators([Validators.required]);
      // this.NapAppModelForm.controls['CustBankAcc'].updateValueAndValidity()

      if (this.NapAppModelForm.controls.MrIdTypeOwnerBnkAcc.value == CommonConstant.MrIdTypeCodeEKTP) {
        this.NapAppModelForm.get('IdNoOwnerBankAcc').setValidators([Validators.pattern('^[0-9]+$'), Validators.minLength(16), Validators.maxLength(16)]);
        this.NapAppModelForm.get('IdNoOwnerBankAcc').updateValueAndValidity();
      }

      this.isShowAppCustBankAcc = true;
    } else {
      // this.NapAppModelForm.controls['CustBankAcc'].clearValidators();
      // this.NapAppModelForm.controls['CustBankAcc'].updateValueAndValidity();

      this.NapAppModelForm.controls['IdNoOwnerBankAcc'].clearValidators();
      this.NapAppModelForm.controls['IdNoOwnerBankAcc'].updateValueAndValidity();
      this.isShowAppCustBankAcc = false;
    }
    this.NapAppModelForm.controls.CustBankAcc.updateValueAndValidity();
  }

  GetBankAccCust() {
    this.http.post<AppOtherInfoObj>(URLConstant.GetAppOtherInfoByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.GetBankInfo = response;
        if (this.GetBankInfo.AppOtherInfoId != 0) {
          const selectedBankAcc: AppCustBankAccObj = this.listCustBankAcc.find(x => x.BankAccNo == this.GetBankInfo.BankAccNo);
          this.NapAppModelForm.patchValue({
            CustBankAcc: selectedBankAcc.AppCustBankAccId
          });

          this.GetBankInfo.AppOtherInfoId = response.AppOtherInfoId;
          this.GetBankInfo.BankCode = selectedBankAcc.BankCode;
          this.GetBankInfo.BankBranch = selectedBankAcc.BankBranch;
          this.GetBankInfo.AppId = this.AppId;
          this.GetBankInfo.BankAccNo = selectedBankAcc.BankAccNo;
          this.GetBankInfo.BankAccName = selectedBankAcc.BankAccName;
        }
      }
    );
  }

  async GetListAppCustBankAcc(appCustId: number) {
    await this.http.post<GenericListObj>(URLConstant.GetListAppCustBankAccByAppCustId, { Id: appCustId }).toPromise().then(
      (response) => {
        this.listCustBankAcc = response.ReturnObject['AppCustBankAccObjs'];
      }
    );
  }

  selectedBank() {
    if (this.NapAppModelForm.controls.MrWopCode.value != this.WopAutoDebit) { return; }

    const custBankAccId: number = this.NapAppModelForm.get('CustBankAcc').value;
    const selectedBankAcc: AppCustBankAccObj = this.listCustBankAcc.find(x => x.AppCustBankAccId == custBankAccId);
    this.GetBankInfo.BankCode = selectedBankAcc.BankCode;
    this.GetBankInfo.BankBranch = selectedBankAcc.BankBranch;
    this.GetBankInfo.AppId = this.AppId;
    this.GetBankInfo.BankAccNo = selectedBankAcc.BankAccNo;
    this.GetBankInfo.BankAccName = selectedBankAcc.BankAccName;
  }

  setTenorOnChange(event) {
    if (event != 'null') {
      this.isFromMouCust = true;
      const mouCustObj = { Id: event }
      this.http.post(URLConstant.GetMouCustDataByMouCustId, mouCustObj).subscribe(
        (response) => {
          this.mouCust = response['MouCustObj'];
          if (this.mouCust.MrMouTypeCode == CommonConstant.GENERAL) {
            this.mouCustClause = response['MouCustClauseObj'];
            this.MrInterestTypeCode = this.mouCustClause.InterestTypeDescr;
            this.MrFirstInstTypeCode = this.mouCustClause.MrFirstInstTypeCode;
            this.MrInstSchmCode = this.mouCustClause.MrInstSchmCode;
            this.PayFreqCode = this.mouCustClause.PayFreqCode;
            this.DownPaymentFromPrcnt = this.mouCustClause.DownPaymentFromPrcnt;
            this.DownPaymentToPrcnt = this.mouCustClause.DownPaymentToPrcnt;
            this.TenorFrom = this.mouCustClause.TenorFrom;
            this.TenorTo = this.mouCustClause.TenorTo;
            if (this.NapAppModelForm.controls.Tenor.value > this.TenorTo) {
              this.isTenorValid = false
            } else {
              this.isTenorValid = true;
            }
          } else if (this.mouCust.MrMouTypeCode == CommonConstant.FACTORING) {
            this.mouCustFctr = response['MouCustFctrObj'];
            this.MrFirstInstTypeCode = this.mouCustFctr.MrFirstInstTypeCode;
            this.MrInstTypeCode = this.mouCustFctr.InstTypeDescr;
            this.MrInstSchmCode = this.mouCustFctr.MrInstSchmCode;
            this.PayFreqCode = this.mouCustFctr.PayFreqCode;
            this.DownPaymentFromPrcnt = this.mouCustFctr.DownPaymentFromPrcnt;
            this.DownPaymentToPrcnt = this.mouCustFctr.DownPaymentToPrcnt;
            this.TenorFrom = this.mouCustFctr.TenorFrom;
            this.TenorTo = this.mouCustFctr.TenorTo;
            if (this.NapAppModelForm.controls.Tenor.value > this.TenorTo || this.NapAppModelForm.controls.Tenor.value < this.TenorFrom) {
              this.isTenorValid = false
            } else {
              this.isTenorValid = true;
            }

          }

        })
    } else {
      this.isFromMouCust = false;
      this.isTenorValid = true;
    }
  }
  setTenor(event) {

    const mouCustObj = { Id: event }
    this.http.post(URLConstant.GetMouCustDataByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.mouCust = response['MouCustObj'];
        if (this.mouCust.MrMouTypeCode == CommonConstant.GENERAL) {
          this.mouCustClause = response['MouCustClauseObj'];
          this.MrInterestTypeCode = this.mouCustClause.InterestTypeDescr;
          this.MrFirstInstTypeCode = this.mouCustClause.MrFirstInstTypeCode;
          this.MrInstSchmCode = this.mouCustClause.MrInstSchmCode;
          this.PayFreqCode = this.mouCustClause.PayFreqCode;
          this.DownPaymentFromPrcnt = this.mouCustClause.DownPaymentFromPrcnt;
          this.DownPaymentToPrcnt = this.mouCustClause.DownPaymentToPrcnt;
          this.TenorFrom = this.mouCustClause.TenorFrom;
          this.TenorTo = this.mouCustClause.TenorTo;
        } else if (this.mouCust.MrMouTypeCode == CommonConstant.FACTORING) {
          this.mouCustFctr = response['MouCustFctrObj'];
          this.MrFirstInstTypeCode = this.mouCustFctr.MrFirstInstTypeCode;
          this.MrInstTypeCode = this.mouCustFctr.InstTypeDescr;
          this.MrInstSchmCode = this.mouCustFctr.MrInstSchmCode;
          this.PayFreqCode = this.mouCustFctr.PayFreqCode;
          this.DownPaymentFromPrcnt = this.mouCustFctr.DownPaymentFromPrcnt;
          this.DownPaymentToPrcnt = this.mouCustFctr.DownPaymentToPrcnt;
          this.TenorFrom = this.mouCustFctr.TenorFrom;
          this.TenorTo = this.mouCustFctr.TenorTo;
        }
      })
  }

  async getAppXData() {
    await this.http.post(URLConstantX.GetAppXDataByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.initCustBankAccDetail();
        this.initAddressCustBankAcc();
        if (response['AppId'] !== 0) {
          const datePipe = new DatePipe('en-US');
          this.NapAppModelForm.patchValue({
            BpkbStatCode: response['MrStatusBpkbCode'],
            OrdStatCode: response['MrOrdStatusCode'],
            CommodityCode: response['MrCommodityCode'],
            MrCustTypeOwnerBnkAcc: response['MrCustTypeOwnerBnkAcc'],
            PrsdntDirectorOwnerBnkAcc: response['PrsdntDirectorOwnerBnkAcc'],
            MrIdTypeOwnerBnkAcc: response['MrIdTypeOwnerBnkAcc'],
            IdNoOwnerBankAcc: response['IdNoOwnerBankAcc'],
            BirthDtOwnerBankAcc: datePipe.transform(response['BirthDtOwnerBankAcc'], 'yyyy-MM-dd'),
            BirthPlaceOwnerBankAcc: response['BirthPlaceOwnerBankAcc'],
          });

          this.inputAddrObj.Addr = response['AddrOwnerBankAcc'];
          this.inputAddrObj.AreaCode1 = response['AreaCode1OwnerBankAcc'];
          this.inputAddrObj.AreaCode2 = response['AreaCode2OwnerBankAcc'];
          this.inputAddrObj.AreaCode3 = response['AreaCode3OwnerBankAcc'];
          this.inputAddrObj.AreaCode4 = response['AreaCode4OwnerBankAcc'];
          this.inputAddrObj.City = response['CityOwnerBankAcc'];

          this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.nameSelect = response['ZipcodeOwnerBankAcc'];
          this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response['ZipcodeOwnerBankAcc'] };
          this.inputAddressOwnerBankAccObj.default = this.inputAddrObj;
          if (response['MrCustTypeOwnerBnkAcc'] != null && response['MrIdTypeOwnerBnkAcc'] != null) {
            this.NapAppModelForm.patchValue({
              MrCustTypeOwnerBnkAcc: response['MrCustTypeOwnerBnkAcc'],
              MrIdTypeOwnerBnkAcc: response['MrIdTypeOwnerBnkAcc'],
            });
          } else {
            this.initCustBankAccDetail();
            this.initAddressCustBankAcc();
          }
          this.tempCommodityName = response['CommodityName'];
        }
        this.isCustomerTypeCompany();
      }
    );
  }
}
