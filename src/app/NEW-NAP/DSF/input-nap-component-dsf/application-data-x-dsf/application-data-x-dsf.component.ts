import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NgxSpinnerService } from 'ngx-spinner';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { DatePipe } from '@angular/common';
import { ResCalculatePlafondAgrmntXObj } from 'app/impl/shared/model/ResCalculatePlafondAgrmntXObj.Model';
import { ReqCalculatePlafondAgrmntXObj } from 'app/impl/shared/model/ReqCalculatePlafondAgrmntXObj.Model';
import { ReqAgrmntMasterDataObjX } from 'app/impl/shared/model/ReqAgrmntMasterDataObjX.model';
import { AgrParentObjX } from 'app/impl/shared/model/Response/AgrParentObjX.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppOtherInfoObj } from 'app/shared/model/app-other-info.model';
import { UcDropdownListObj, UcDropdownListConstant, UcDropdownListCallbackObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { GenerateAppAttrContentObj } from 'app/shared/model/app-attr-content/generate-app-attr-content-obj.model';
import { MouCustDlrFinObj } from 'app/shared/model/mou-cust-dlr-fin.model';
import { MouCustClauseObj } from 'app/shared/model/mou-cust-clause-obj.model';
import { MouCustFctrObj } from 'app/shared/model/mou-cust-fctr-obj.model';
import { ResRefEmpObj } from 'app/shared/model/response/ref-emp/res-ref-emp-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { NapAppCrossObj } from 'app/shared/model/nap-app-cross-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { AppAttrContentObj } from 'app/shared/model/app-attr-content/app-attr-content-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { RefAttrSettingObj } from 'app/shared/model/ref-attr-setting-obj.model';

@Component({
  selector: 'app-application-data-x-dsf',
  templateUrl: './application-data-x-dsf.component.html',
  styleUrls: ['./application-data-x-dsf.component.css']
})
export class ApplicationDataXDsfComponent implements OnInit {
  @Input() isCollateral: boolean;
  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Input() IsLoanObject: boolean = false;
  @Input() BizTemplateCode: string = "";
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  isTenorValid = true;
  isFromMouCust: boolean = false;
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
  ListCrossAppObj: object = {};
  inputLookupObj: InputLookupObj;
  inputLookupEconomicSectorObj: InputLookupObj;
  inputLookupCommodityObj: InputLookupObj;
  arrAddCrit: Array<CriteriaObj>;
  user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  isInputLookupObj: boolean = false;
  isFixedRate: boolean = false;
  PayFreqVal: number;
  PayFreqTimeOfYear: number;
  FirstInstType: string;
  resMouCustObj;
  CustNo: string;
  CustName: string;
  isProdOfrUpToDate: boolean = true;
  missingProdOfrComp: string = "";
  listCustBankAcc: Array<AppCustBankAccObj>;
  GetBankInfo: AppOtherInfoObj = new AppOtherInfoObj();
  totalAgrmntMpfDt: number = 0;
  maxTenor: number = 0;
  goLiveDt: Date;
  isDdlMrAppSourceReady: boolean = false;
  ddlMrAppSourceObj: UcDropdownListObj = new UcDropdownListObj();
  ddlMrFirstInstTypeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlPayFreqObj: UcDropdownListObj = new UcDropdownListObj();
  ddlMrWopObj: UcDropdownListObj = new UcDropdownListObj();
  ddlMrCustNotifyOptObj: UcDropdownListObj = new UcDropdownListObj();
  isDdlMrFirstInstTypeReady: boolean = false;
  isDdlPayFreqReady: boolean = false;
  tempCommodityName: string = '';
  agrmntParentNo: string;
  resCalculatePlafondAgrmntXObj: ResCalculatePlafondAgrmntXObj;
  reqAgrmntMasterDataObjX: ReqAgrmntMasterDataObjX;
  agrParent: AgrParentObjX;
  agrParentList: Array<AgrParentObjX>;
  plafondDict: { [id: string]: ResCalculatePlafondAgrmntXObj } = {};
  DictRefMaster: Array<KeyValueObj> = new Array<KeyValueObj>();
  IdTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  isDdlIdTypeReady: boolean = false;
  isShowAppCustBankAcc: boolean = false;
  isAppAttrContentReady: boolean = false;
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
    Tenor: ["", [Validators.pattern("^[0-9]+$"), Validators.required, Validators.min(1)]],
    NumOfInst: [''],
    PayFreqCode: ['', Validators.required],
    PayFreqCodeDesc: [''],
    MrFirstInstTypeCode: ["", Validators.required],
    NumOfAsset: [''],
    MrLcCalcMethodCode: [""],
    LcInstRatePrml: [''],
    LcInsRatePrml: [''],
    MrAppSourceCode: ["", Validators.required],
    MrAppSourceCodeDesc: [""],
    MrWopCode: ["", Validators.required],
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
    MrCustNotifyOptCode: ["", Validators.required],
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
    FloatingPeriod: [''],
    CharaCredit: ['', [Validators.required, Validators.maxLength(50)]],
    PrevAgrNo: [''],
    MrSlikSecEcoCode: [''],
    WayRestructure: [''],
    EconomicSector: [''],
    ApplicationNotes: [''],
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
  slikSecDescr: string = "";
  defaultSlikSecEcoCode: string;
  MouCustDlrFindData: MouCustDlrFinObj = new MouCustDlrFinObj();
  mouCustClause: MouCustClauseObj;
  mouCustFctr: MouCustFctrObj;

  salesOfficerCode: Array<string> = new Array();
  isSalesOfficerCode: boolean = false;
  refEmpSpvObj: ResRefEmpObj;
  isMrCustTypeCompany: boolean = false;
  MasterCustType: string = "";
  MasterIdNoType: string = "";

  AgrmntDt: Date = new Date();
  OsPrincipal: number = 0;
  OsInterest: number = 0;
  NumberOfAsset: number = 0;
  EffRate: number = 0;
  PurposeOfFinancing: string = "";
  WayOfFinancing: string = "";
  ProductType: string = "";
  ApToSupplierDisburseDt: Date = new Date();
  EffectiveDt: Date = new Date();
  TotalAssetPrice: number = 0;
  Tenor: number = 0;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    });
  }

  async ngOnInit() {
    this.spinner.show();
    if (this.BizTemplateCode == CommonConstant.OPL) {
      this.NapAppModelForm.controls.InterestType.clearValidators();
      this.NapAppModelForm.controls.InterestType.updateValueAndValidity();
    }

    this.defaultSlikSecEcoCode = CommonConstantX.DefaultSlikSecEcoCode;
    this.ListCrossAppObj["appId"] = this.appId;
    this.ListCrossAppObj["result"] = [];

    this.applicationDDLitems = [];
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCustType);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeSlsRecom);
    this.SetRefAttrSettingObj();
    this.initDdlMrWop();
    this.initDdlMrCustNotifyOpt();
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeInterestTypeGeneral);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCharacteristicCredit);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeWayOfRestructure);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCspUslAml);
    this.getRefMasterTypeCode(CommonConstantX.RefMasterTypeCodeOrdStatus);
    this.getRefMasterTypeCode(CommonConstantX.RefMasterTypeCodeStatusBpkb);
    this.getAppSrcData();
    await this.getRefMaster();

    setTimeout(async() => { this.getAppModelInfo() }, 2000);

    await this.http.post(URLConstant.GetAppCustByAppId, { Id: this.appId }).toPromise().then(
      (response: AppCustObj) => {
        this.CustNo = response.CustNo;
        this.CustName = response.CustName;
        this.GetListAppCustBankAcc(response.AppCustId);

        this.http.post(URLConstant.GetListMouCustByCustNo, {
          CustNo: this.CustNo,
          StartDt: this.user.BusinessDt,
          MrMouTypeCode: CommonConstant.GENERAL
        }).subscribe(
          (response) => {
            this.resMouCustObj = response[CommonConstant.ReturnObj];
          }
        );
      }
    );

    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeAppDataOfficer }).toPromise().then(
      (response: GeneralSettingObj) => {
        this.salesOfficerCode = response.GsValue.split(',');
        if (this.salesOfficerCode.some(x => x === this.user.JobTitleCode)) {
          this.isSalesOfficerCode = true;
          this.NapAppModelForm.patchValue({
            SalesOfficerNo: this.user.EmpNo,
            SalesOfficerName: this.user.EmpName
          });

          let ReqGetRefEmpSpvByEmpNo: GenericObj = new GenericObj();
          ReqGetRefEmpSpvByEmpNo.EmpNo = this.user.EmpNo;

          this.http.post<ResRefEmpObj>(URLConstant.GetRefEmpSpvByEmpNo, ReqGetRefEmpSpvByEmpNo).subscribe(
            (response) => {
              this.refEmpSpvObj = response;
              if (this.refEmpSpvObj !== null) {
                this.NapAppModelForm.patchValue({
                  SalesHeadNo: this.refEmpSpvObj.EmpNo,
                  SalesHeadName: this.refEmpSpvObj.EmpName
                });
              }
            }
          );
        }
      }
    );
  }


  checkIdNoType() {
    if (this.NapAppModelForm.controls.MrWopCode.value == this.WopAutoDebit && this.NapAppModelForm.controls.MrIdTypeOwnerBnkAcc.value == CommonConstant.MrIdTypeCodeEKTP) {
      this.NapAppModelForm.get("IdNoOwnerBankAcc").setValidators([Validators.pattern("^[0-9]+$"), Validators.minLength(16), Validators.maxLength(16)]);
      this.NapAppModelForm.get("IdNoOwnerBankAcc").updateValueAndValidity();
    }
  }

  initCustBankAccDetail() {
    this.NapAppModelForm.get('MrIdTypeOwnerBnkAcc').disable();
    this.NapAppModelForm.patchValue({
      MrIdTypeOwnerBnkAcc: CommonConstant.MrIdTypeCodeEKTP,
      MrCustTypeOwnerBnkAcc: CommonConstant.CustTypePersonal,
    });
  }

  inputAddressOwnerBankAccObj: InputAddressObj = new InputAddressObj();
  inputAddrObj: AddrObj = new AddrObj();
  inputAddrObjDefault: AddrObj = new AddrObj();
  initAddressCustBankAcc() {
    this.inputAddressOwnerBankAccObj.showSubsection = false;
    this.inputAddressOwnerBankAccObj.title = "Customer Bank Acc Owner Address";
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
    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: RefMasterTypeCode, MappingCode: null };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, tempReq).toPromise().then(
      (response) => {
        this.DictRefMaster[RefMasterTypeCode] = response[CommonConstant.ReturnObj];
      });
  }

  async getRefMaster() {
    this.MasterCustType = CommonConstant.RefMasterTypeCodeCustType;
    this.MasterIdNoType = CommonConstant.RefMasterTypeCodeIdType;
    await this.GetListActiveRefMaster(this.MasterCustType);
    await this.GetListActiveRefMaster(this.MasterIdNoType);
  }

  changeCustomerType(custType: string = CommonConstant.CustTypePersonal) {
    this.NapAppModelForm.patchValue({
      MrCustTypeOwnerBnkAcc: custType
    });
    if (custType == CommonConstant.CustTypeCompany) {
      this.isMrCustTypeCompany = true;
    } else {
      this.isMrCustTypeCompany = false;
      this.NapAppModelForm.patchValue({
        PrsdntDirectorOwnerBnkAcc: ''
      });
    }
  }

  isCustomerTypeCompany() {
    if (this.NapAppModelForm.controls.MrCustTypeOwnerBnkAcc.value == CommonConstant.CustTypeCompany) {
      this.isMrCustTypeCompany = true;
    } else {
      this.isMrCustTypeCompany = false;
    }
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

  getDDLFromProdOffering(refProdCompntCode: string) {
    let obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    obj.ProdOfferingCode = this.resultResponse.ProdOfferingCode;
    obj.RefProdCompntCode = refProdCompntCode;
    obj.ProdOfferingVersion = this.resultResponse.ProdOfferingVersion;
    this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, obj).subscribe(
      (response) => {
        let listDDL = response["DDLRefProdComptCode"];
        this.applicationDDLitems[refProdCompntCode] = listDDL;
        if (refProdCompntCode == CommonConstant.RefProdCompFirstInstType && !this.NapAppModelForm.controls.MrFirstInstTypeCode.value) {
          this.FirstInstType = this.applicationDDLitems['FIRSTINSTTYPE'][0].Value;
          this.NapAppModelForm.patchValue({
            MrFirstInstTypeCode: this.applicationDDLitems['FIRSTINSTTYPE'][0].Key
          });
        }
      }
    );
  }

  async getInterestTypeCode(ProdOfferingCode: string, ProdOfferingVersion: string) {
    let obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    obj.ProdOfferingCode = ProdOfferingCode;
    obj.RefProdCompntCode = CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
    obj.ProdOfferingVersion = ProdOfferingVersion;
    let noValue: boolean = !this.NapAppModelForm.controls.InterestType.value;

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
      (response) => {
        if (response && response["StatusCode"] == "200") {
          if(noValue){
          this.NapAppModelForm.patchValue({
            InterestType: response["CompntValue"],
            InterestTypeDesc: response["CompntValueDesc"],
          });
									
        }
        this.ChangeInterestType();
        if(response["MrProdBehaviourCode"] == CommonConstant.ProductBehaviourLock) this.NapAppModelForm.controls.InterestType.disable();
      }
        else {
          // throw new Error("Interest Type component not found, please use the latest product offering");
          this.isProdOfrUpToDate = false;
          this.missingProdOfrComp += CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetCrossInfoData() {
    let obj = {
      Id: this.appId,
      RowVersion: ""
    }
    this.http.post(URLConstant.GetListAppCross, obj).subscribe(
      (response) => {
        this.resultCrossApp = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.resultCrossApp.length; i++) {
          this.ListCrossAppObj["result"].push(this.resultCrossApp[i].CrossAgrmntNo);
        }
      }
    );
  }

  applicationDDLitems;
  resultResponse;

  async getAppModelInfo() {
    const obj = {
      Id: this.appId,
      RowVersion: ""
    };

    await this.getAppXData();

    await this.http.post(URLConstantX.GetAppDetailForTabAddEditAppByIdX, obj).toPromise().then(
      async (response) => {

        this.resultResponse = response;
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
          PayFreqCode: this.resultResponse.PayFreqCode == null ? "" : this.resultResponse.PayFreqCode,
          MrFirstInstTypeCode: this.resultResponse.MrFirstInstTypeCode,
          NumOfAsset: this.resultResponse.NumOfAsset,
          MrLcCalcMethodCode: this.resultResponse.MrLcCalcMethodCode,
          LcInstRatePrml: this.resultResponse.LcInstRatePrml,
          LcInsRatePrml: this.resultResponse.LcInsRatePrml,
          MrAppSourceCode: this.resultResponse.MrAppSourceCode != null ? this.resultResponse.MrAppSourceCode : "",
          MrWopCode: this.resultResponse.MrWopCode,
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
          MrCustNotifyOptCode: this.resultResponse.MrCustNotifyOptCode,
          PreviousAppId: this.resultResponse.PreviousAppId,
          IsAppInitDone: this.resultResponse.IsAppInitDone,
          MrOrderInfoCode: this.resultResponse.MrOrderInfoCode,
          ApprovalStat: this.resultResponse.ApprovalStat,
          RsvField1: this.resultResponse.RsvField1,
          RsvField2: this.resultResponse.RsvField2,
          RsvField3: this.resultResponse.RsvField3,
          RsvField4: this.resultResponse.RsvField4,
          RsvField5: this.resultResponse.RsvField5,
          MrInstSchemeCode: this.resultResponse.MrInstSchemeCode != null ? this.resultResponse.MrInstSchemeCode : "",
          InterestType: this.resultResponse.InterestType,
          FloatingPeriod: this.resultResponse.FloatingPeriodCode,
          ApplicationNotes: this.resultResponse.ApplicationNotes,
          CharaCredit: this.resultResponse.MrCharacteristicOfCreditCode,
          PrevAgrNo: this.resultResponse.PrevAgrmntNo,
          WayRestructure: this.resultResponse.MrWayOfRestructureCode,
          MrSlikSecEcoCode: this.resultResponse.MrSlikSecEcoCode,
          DpSrcPaymentCode: this.resultResponse.MrDpSrcPaymentCode,
          InstSrcPaymentCode: this.resultResponse.MrInstSrcPaymentCode
        });

        if (this.NapAppModelForm.controls.MrWopCode.value == this.WopAutoDebit) {
          this.GetBankAccCust();
          this.setBankAcc(this.NapAppModelForm.controls.MrWopCode.value)
        }
        if (this.resultResponse.MouCustId != undefined && this.resultResponse.MouCustId != null && this.resultResponse.MouCustId != 0) {
          this.isFromMouCust = true;
          this.setTenor(this.resultResponse.MouCustId);
        }

        this.getAgrmntParent();
        this.makeNewLookupCriteria();
        this.initMailingAddress();

        if (this.BizTemplateCode != CommonConstant.OPL) {
          await this.getInterestTypeCode(this.resultResponse.ProdOfferingCode, this.resultResponse.ProdOfferingVersion);
          this.GetCrossInfoData();
        } else {
          this.NapAppModelForm.controls.InterestType.clearValidators();
          this.NapAppModelForm.controls.InterestType.updateValueAndValidity();
          this.NapAppModelForm.controls.FloatingPeriod.clearValidators();
          this.NapAppModelForm.controls.FloatingPeriod.updateValueAndValidity();
          this.NapAppModelForm.controls.MrInstSchemeCode.clearValidators();
          this.NapAppModelForm.controls.MrInstSchemeCode.updateValueAndValidity();
        }
        this.getDDLFromProdOffering(CommonConstant.RefMasterTypeCodeInstSchm);
        this.initDdlMrFirstInstType();
        this.initDdlPayFreq();
        this.getPayFregData();
        // this.GenerateAppAttrContent();
        this.spinner.hide();
      }
    );
    this.checkIdNoType();
  }

  getAgrmntParent() {
    if (this.resultResponse.AgrmntParentNo != null) {
      this.resCalculatePlafondAgrmntXObj = new ResCalculatePlafondAgrmntXObj();
      this.resCalculatePlafondAgrmntXObj.PlafondAgrmntAmt = this.resultResponse.PlafondAgrmntAmt;
      this.resCalculatePlafondAgrmntXObj.MaxPlafondAgrmntAmt = this.resultResponse.MaxPlafondAgrmntAmt;
      this.totalAgrmntMpfDt = this.resultResponse.TotalAgrmntMpfDt;
      this.maxTenor = this.resultResponse.MaxTenor;
    }
  }

  getAppSrcData() {
    this.ddlMrAppSourceObj.apiUrl = URLConstant.GetListKvpActiveRefAppSrc;
    this.ddlMrAppSourceObj.requestObj = { RowVersion: "" };
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


  initDdlMrWop() {
    this.ddlMrWopObj.apiUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.ddlMrWopObj.requestObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeWOP
    }
    this.ddlMrWopObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.ddlMrWopObj.isSelectOutput = true;
  }

  initDdlMrCustNotifyOpt() {
    this.ddlMrCustNotifyOptObj.apiUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.ddlMrCustNotifyOptObj.requestObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustNotifyOpt
    }
    this.ddlMrCustNotifyOptObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
  }

  getRefMasterTypeCode(code) {
    let obj = {
      RefMasterTypeCode: code,
      RowVersion: ""
    };

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, obj).subscribe(
      (response) => {
        let objTemp = response[CommonConstant.ReturnObj];
        this.applicationDDLitems[code] = objTemp;
        if (code == CommonConstant.RefMasterTypeCodeCharacteristicCredit && this.NapAppModelForm.value.CharaCredit == "") {
          if (this.BizTemplateCode == CommonConstant.OPL) {
            this.NapAppModelForm.patchValue({
              CharaCredit: CommonConstant.CharacteristicOfCreditTypeOther,
              MrSlikSecEcoCode: this.defaultSlikSecEcoCode
            });
            this.NapAppModelForm.controls.CharaCredit.disable();
            this.NapAppModelForm.controls.CharaCredit.updateValueAndValidity();
          } else {
            this.NapAppModelForm.patchValue({
              CharaCredit: this.applicationDDLitems['CHARACTERISTIC_OF_CREDIT'][1].Key,
              MrSlikSecEcoCode: this.defaultSlikSecEcoCode
            });
          }
        } else if (code == CommonConstantX.RefMasterTypeCodeStatusBpkb) {
          this.NapAppModelForm.patchValue({
            BpkbStatCode: objTemp[0].Key
          });
        }
      }
    );
  }

  GenerateAppAttrContent() {
    this.isAppAttrContentReady = false;
    var GenObj =
    {
      AppId: this.appId,
      AttrGroup: CommonConstant.AttrGroupApplicationData + "_" + this.BizTemplateCode,
    };
    this.http.post(URLConstant.GenerateAppAttrContent, GenObj).subscribe(
      (response) => {
        this.GenerateAppAttrContentObjs = response['GenerateAppAttrContentObjs'];

        this.GenerateAppAttrContentForm();
        this.isAppAttrContentReady = true;
      });
  }

  attrSettingObj: RefAttrSettingObj = new RefAttrSettingObj();
  readonly identifierAppAttr: string = "AppAttrContentObjs";
  SetRefAttrSettingObj() {
    let GenObj =
    {
      AppId: this.appId,
      AttrGroup: CommonConstant.AttrGroupApplicationData + "_" + this.BizTemplateCode,
      IsRefresh: false
    };
    this.attrSettingObj.ReqGetListAttrObj = GenObj;
    this.attrSettingObj.Title = "Application Attribute";
    this.attrSettingObj.UrlGetListAttr = URLConstant.GenerateAppAttrContentV2;
  }
  GenerateAppAttrContentForm() {
    if (this.GenerateAppAttrContentObjs != null) {
      this.ListAttrAnswer = [];
      for (let i = 0; i < this.GenerateAppAttrContentObjs.length; i++) {
        this.ListAttrAnswer.push([]);
        if (this.GenerateAppAttrContentObjs[i].AttrQuestionValue != null) {
          this.ListAttrAnswer[i].push(this.GenerateAppAttrContentObjs[i].AttrQuestionValue);
        }
        else {
          this.ListAttrAnswer[i].push("");
        }
      }
      var listAppAssetAttrs = this.NapAppModelForm.controls["AppAttrContentObjs"] as FormArray;
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
    let ListValidator: Array<ValidatorFn> = this.setAppAttrContentValidators(generateAppAttrContentObj);

    return this.setFbGroupAppAttrContent(generateAppAttrContentObj, i, ListValidator);
  }

  private setAppAttrContentValidators(generateAppAttrContentObj: GenerateAppAttrContentObj) {
    let ListValidator: Array<ValidatorFn> = new Array<ValidatorFn>();

    if (generateAppAttrContentObj.IsMandatory == true) {
      ListValidator.push(Validators.required);
    }
    if (generateAppAttrContentObj.AttrLength != null && generateAppAttrContentObj.AttrLength != 0) {
      ListValidator.push(Validators.maxLength(generateAppAttrContentObj.AttrLength));
    }
    if (generateAppAttrContentObj.PatternValue != null && generateAppAttrContentObj.PatternValue != "") {
      ListValidator.push(Validators.pattern(generateAppAttrContentObj.PatternValue));
    }

    return ListValidator;
  }

  private setFbGroupAppAttrContent(generateAppAttrContentObj: GenerateAppAttrContentObj, i: number, ListValidator: Array<ValidatorFn>) {

    let tempFB = this.fb.group({
      No: [i],
      RefAttrCode: [generateAppAttrContentObj.RefAttrCode],
      RefAttrName: [generateAppAttrContentObj.RefAttrName],
      AttrInputType: [generateAppAttrContentObj.AttrInputType],
      AttrValue: [generateAppAttrContentObj.AttrValue],
      IsMandatory: [generateAppAttrContentObj.IsMandatory]
    });
    if (ListValidator.length > 0) {
      tempFB.get("AttrValue").setValidators(ListValidator);
    }

    if (generateAppAttrContentObj.AttrInputType == this.AttrInputTypeRefMaster) {
      this.tempLookup[generateAppAttrContentObj.RefAttrCode] = new InputLookupObj();
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].isReady = false;
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].urlJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].urlEnviPaging = environment.FoundationR3Url + "/v1";
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].pagingJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].genericJson = "./assets/uclookup/lookupRefMaster.json";
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].title = generateAppAttrContentObj.RefAttrName;
      if (generateAppAttrContentObj.IsMandatory == true) {
        this.tempLookup[generateAppAttrContentObj.RefAttrCode].isRequired = true;
      }
      else {
        this.tempLookup[generateAppAttrContentObj.RefAttrCode].isRequired = false;
      }

      var arrAddCrit = new Array();
      var critAssetObj = new CriteriaObj();
      critAssetObj.DataType = 'text';
      critAssetObj.restriction = AdInsConstant.RestrictionEq;
      critAssetObj.propName = 'REF_MASTER_TYPE_CODE';
      critAssetObj.value = generateAppAttrContentObj.RefAttrValue;
      arrAddCrit.push(critAssetObj);
      this.tempLookup[generateAppAttrContentObj.RefAttrCode].addCritInput = arrAddCrit;

      if (generateAppAttrContentObj.AttrValue != null && generateAppAttrContentObj.AttrValue != "") {
        let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
          RefMasterTypeCode: generateAppAttrContentObj.RefAttrValue,
          MasterCode: generateAppAttrContentObj.AttrValue
        };
        this.http.post(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
          (response: KeyValueObj) => {
            this.tempLookup[generateAppAttrContentObj.RefAttrCode].nameSelect = response.Value;
            this.tempLookup[generateAppAttrContentObj.RefAttrCode].jsonSelect = { Descr: response.Value };
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

  async makeLookUpObj() {
    // Lookup obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.jsonSelect = this.resultResponse;
    // this.inputLookupObj.nameSelect = this.resultResponse.SalesName;
    this.inputLookupObj.addCritInput = this.arrAddCrit;

    this.inputLookupEconomicSectorObj = new InputLookupObj();
    this.inputLookupEconomicSectorObj.urlJson = './assets/impl/uclookup/NAP/lookupEconomicSectorSlikX.json';
    this.inputLookupEconomicSectorObj.urlEnviPaging = environment.FoundationR3Url + '/v1';
    this.inputLookupEconomicSectorObj.pagingJson = './assets/impl/uclookup/NAP/lookupEconomicSectorSlikX.json';
    this.inputLookupEconomicSectorObj.genericJson = './assets/impl/uclookup/NAP/lookupEconomicSectorSlikX.json';

    if (this.BizTemplateCode == CommonConstant.CFNA) {
      //lookup Agreement Parent
      await this.http.post<Array<AgrParentObjX>>(URLConstantX.GetListAgrmntParentByCustNoX, { CustNo: this.CustNo }).toPromise().then(
        (response) => {
          this.agrParentList = response;
        }
      );
      this.agrmntParentNo = this.resultResponse.AgrmntParentNo;

      if (this.agrParentList.length) {
        var idx = -1;
        for (var i = 0; i < this.agrParentList.length; i++) if (this.agrParentList[i].AgrmntNo == this.agrmntParentNo) idx = i;
        if (idx > -1) this.copyAgrmntParentEvent(idx);
      }
    }

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

    //Lookup Commodity
    this.inputLookupCommodityObj = new InputLookupObj();
    this.inputLookupCommodityObj.urlJson = "./assets/impl/uclookup/lookupCommodity.json";
    this.inputLookupCommodityObj.pagingJson = "./assets/impl/uclookup/lookupCommodity.json";
    this.inputLookupCommodityObj.genericJson = "./assets/impl/uclookup/lookupCommodity.json";
    if (this.BizTemplateCode != CommonConstant.CF4W && this.BizTemplateCode != CommonConstant.FL4W) {
      this.inputLookupCommodityObj.isRequired = false;
    }

    if (this.NapAppModelForm.controls.CommodityCode.value != "" && this.NapAppModelForm.controls.CommodityCode.value != null) {
      //this.inputLookupCommodityObj.idSelect = this.NapAppModelForm.controls.CommodityCode.value;
      this.inputLookupCommodityObj.nameSelect = this.tempCommodityName;
      this.inputLookupCommodityObj.jsonSelect = { Descr: this.tempCommodityName };
    }

    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeAppDataOfficer }).toPromise().then(
      (response: GeneralSettingObj) => {
        this.salesOfficerCode = response.GsValue.split(',');
        if (this.salesOfficerCode.some(x => x === this.user.JobTitleCode)) {
          this.isSalesOfficerCode = true;
          this.NapAppModelForm.patchValue({
            SalesOfficerNo: this.user.EmpNo,
            SalesOfficerName: this.user.EmpName
          });

          let ReqGetRefEmpSpvByEmpNo: GenericObj = new GenericObj();
          ReqGetRefEmpSpvByEmpNo.EmpNo = this.user.EmpNo;

          this.http.post<ResRefEmpObj>(URLConstant.GetRefEmpSpvByEmpNo, ReqGetRefEmpSpvByEmpNo).subscribe(
            (response) => {
              this.refEmpSpvObj = response;
              if (this.refEmpSpvObj !== null) {
                this.NapAppModelForm.patchValue({
                  SalesHeadNo: this.refEmpSpvObj.EmpNo,
                  SalesHeadName: this.refEmpSpvObj.EmpName
                });
              }
            }
          );
        }
      }
    );
    this.isInputLookupObj = true;
  }

  async makeNewLookupCriteria() {
    this.arrAddCrit = new Array<CriteriaObj>();

    let addCrit1 = new CriteriaObj();
    addCrit1.DataType = "bit";
    addCrit1.propName = "re.IS_ACTIVE";
    addCrit1.restriction = AdInsConstant.RestrictionEq;
    addCrit1.value = "1";
    this.arrAddCrit.push(addCrit1);

    let addCrit2 = new CriteriaObj();
    addCrit2.DataType = "bit";
    addCrit2.propName = "ru.IS_ACTIVE";
    addCrit2.restriction = AdInsConstant.RestrictionEq;
    addCrit2.value = "1";
    this.arrAddCrit.push(addCrit2);

    let addCrit4 = new CriteriaObj();
    addCrit4.DataType = "text";
    addCrit4.propName = "ro.OFFICE_CODE";
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

    await this.makeLookUpObj();
  }

  async copyAgrmntParentEvent(idx) {
    if (idx == null) return;

    this.agrParent = this.agrParentList[idx];

    this.totalAgrmntMpfDt = this.agrParent.TotalAgrmntMpfDt;
    this.maxTenor = this.agrParent.MaxTenor;
    this.goLiveDt = this.agrParent.GoLiveDt;
    this.AgrmntDt = this.agrParent.AgrmntDt;
    this.OsPrincipal = this.agrParent.OsPrincipal;
    this.OsInterest = this.agrParent.OsInterest;
    this.NumberOfAsset = this.agrParent.NumOfAsset;
    this.EffRate = this.agrParent.EffRate;
    this.PurposeOfFinancing = this.agrParent.PurposeOfFinancing;
    this.WayOfFinancing = this.agrParent.WayOfFinancing;
    this.ProductType = this.agrParent.ProductType;
    this.ApToSupplierDisburseDt = this.agrParent.ApToSupplierDisburseDt;
    this.EffectiveDt = this.agrParent.EffectiveDt;
    this.Tenor = this.agrParent.Tenor;
    this.TotalAssetPrice = this.agrParent.TotalAssetPrice;

    const reqCalculatePlafondAgrmntXObj = new ReqCalculatePlafondAgrmntXObj();
    reqCalculatePlafondAgrmntXObj.AppId = this.appId;
    reqCalculatePlafondAgrmntXObj.AgrmntParentNo = this.agrParent.AgrmntNo;
    reqCalculatePlafondAgrmntXObj.TotalAssetPrice = this.agrParent.TotalAssetPrice;
    reqCalculatePlafondAgrmntXObj.OsArAgrmntMasterAmt = this.agrParent.OsArAgrmntMasterAmt;
    reqCalculatePlafondAgrmntXObj.OsArMpfDtAmt = this.agrParent.OsArMpfDtAmt;
    reqCalculatePlafondAgrmntXObj.LobCode = this.resultResponse.LobCode;
    reqCalculatePlafondAgrmntXObj.AssetTypeCode = this.agrParent.AssetTypeCode;
    reqCalculatePlafondAgrmntXObj.EffectiveDt = this.agrParent.EffectiveDt;
    reqCalculatePlafondAgrmntXObj.GoLiveDt = this.agrParent.GoLiveDt;
    reqCalculatePlafondAgrmntXObj.Tenor = this.agrParent.Tenor;

    if (this.plafondDict[this.agrParent.AgrmntId] == undefined) {
      this.http.post<ResCalculatePlafondAgrmntXObj>(URLConstantX.CalculatePlafondAgrmntX, reqCalculatePlafondAgrmntXObj).subscribe(
        (response) => {
          this.resCalculatePlafondAgrmntXObj = new ResCalculatePlafondAgrmntXObj();
          this.resCalculatePlafondAgrmntXObj.PlafondAgrmntAmt = response.PlafondAgrmntAmt;
          this.resCalculatePlafondAgrmntXObj.MaxPlafondAgrmntAmt = response.MaxPlafondAgrmntAmt;
          this.resCalculatePlafondAgrmntXObj.IsAppInProgress = response.IsAppInProgress;

          if (this.resCalculatePlafondAgrmntXObj.IsAppInProgress) {
            this.toastr.warningMessage(ExceptionConstant.THERE_IS_APP_ON_PROGRESS);
          }
          this.plafondDict[this.agrParent.AgrmntId] = this.resCalculatePlafondAgrmntXObj;
        });
    } else {
      this.resCalculatePlafondAgrmntXObj = this.plafondDict[this.agrParent.AgrmntId]
    }



    var tempCrossApp = new NapAppCrossObj();
    tempCrossApp.CrossAgrmntNo = this.agrParent.AgrmntNo;
    tempCrossApp.CrossAppNo = this.agrParent.AppNo;
    tempCrossApp.CustName = this.CustName;
    tempCrossApp.ContractStat = this.agrParent.ContractStat;
    tempCrossApp.MaturityDt = this.agrParent.MaturityDt;
    let appCross = this.resultCrossApp.find(x => x.CrossAgrmntNo == this.agrmntParentNo);
    if (appCross != undefined) {

      let index = this.resultCrossApp.indexOf(appCross);
      this.resultCrossApp[index] = tempCrossApp;
      this.agrmntParentNo = this.agrParent.AgrmntNo;

    } else {
      this.resultCrossApp = [tempCrossApp];
      this.agrmntParentNo = this.agrParent.AgrmntNo;
    }
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

  ChangeNumOfInstallmentTenor() {
    let temp: number = +this.NapAppModelForm.controls.Tenor.value;

    let tempPayFreq = this.DictRefPayFreq[this.NapAppModelForm.controls.PayFreqCode.value];
    if (tempPayFreq != undefined && tempPayFreq != null) {
      this.PayFreqVal = this.DictRefPayFreq[this.NapAppModelForm.controls.PayFreqCode.value].PayFreqVal;
      this.PayFreqTimeOfYear = this.DictRefPayFreq[this.NapAppModelForm.controls.PayFreqCode.value].TimeOfYear;
    }

    if (!isNaN(temp) && !isNaN(this.PayFreqTimeOfYear) && !isNaN(this.PayFreqVal)) {
      let total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
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

  ChangeCharacteristicOfCredit() {
    if (this.NapAppModelForm.value.CharaCredit == CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.NapAppModelForm.controls.WayRestructure.setValidators(Validators.required);
    } else {
      this.NapAppModelForm.controls.WayRestructure.clearValidators();
    }
    this.NapAppModelForm.controls.WayRestructure.updateValueAndValidity();
  }

  PatchNumOfInstallment(num: number) {
    this.NapAppModelForm.patchValue({
      NumOfInst: num
    });
  }

  GetAppObjValue() {
    let temp = new NapAppModel();
    temp.AppId = this.resultResponse.AppId;
    temp.SalesHeadNo = this.NapAppModelForm.controls.SalesHeadNo.value;
    temp.SalesNotes = this.NapAppModelForm.controls.SalesNotes.value;
    temp.SalesOfficerNo = this.NapAppModelForm.controls.SalesOfficerNo.value;
    temp.MrAppSourceCode = this.NapAppModelForm.controls.MrAppSourceCode.value;
    temp.MrFirstInstTypeCode = this.NapAppModelForm.controls.MrFirstInstTypeCode.value;
    temp.PayFreqCode = this.NapAppModelForm.controls.PayFreqCode.value;
    temp.Tenor = this.NapAppModelForm.controls.Tenor.value;
    temp.NumOfInst = this.NapAppModelForm.controls.NumOfInst.value;
    temp.MouCustId = this.NapAppModelForm.controls.MouCustId.value;
    temp.FloatingPeriodCode = this.NapAppModelForm.controls.FloatingPeriod.value;
    temp.MrWopCode = this.NapAppModelForm.controls.MrWopCode.value;
    temp.MrCustNotifyOptCode = this.NapAppModelForm.controls.MrCustNotifyOptCode.value;
    temp.CharaCredit = this.NapAppModelForm.getRawValue().CharaCredit;
    temp.PrevAgrNo = this.NapAppModelForm.controls.PrevAgrNo.value;
    temp.WayRestructure = this.NapAppModelForm.controls.WayRestructure.value;
    temp.BizTemplateCode = this.BizTemplateCode;
    temp.MrSlikSecEcoCode = this.NapAppModelForm.getRawValue().MrSlikSecEcoCode;
    temp.RowVersion = this.resultResponse.RowVersion;
    temp.MrDpSrcPaymentCode = this.NapAppModelForm.controls.DpSrcPaymentCode.value;
    temp.MrInstSrcPaymentCode = this.NapAppModelForm.controls.InstSrcPaymentCode.value;
    if (this.NapAppModelForm.controls.MouCustId.value == "null") {
      temp.MouCustId = "";
    }
    else {
      temp.MouCustId = this.NapAppModelForm.controls.MouCustId.value;
    }
    return temp;
  }

  GetListAppCrossValue() {
    let arr = [];
    for (let i = 0; i < this.resultCrossApp.length; i++) {
      let temp = new NapAppCrossObj();
      temp.AppId = this.appId;
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
    let temp = {
      AppId: this.appId,
      MrInstSchemeCode: this.NapAppModelForm.controls.MrInstSchemeCode.value,
      InterestType: this.NapAppModelForm.controls.InterestType.value,
    }
    if (this.BizTemplateCode == CommonConstant.OPL) {
      temp.MrInstSchemeCode = CommonConstant.INST_SCHM_REGULAR_FIXED;
      temp.InterestType = CommonConstant.InterestTypeFixed;
    }
    return temp;
  }

  MissingProdOfrHandler(e) {
    if (this.isProdOfrUpToDate) {
      this.isProdOfrUpToDate = e.isProdOfrUpToDate;
    }
    if (this.missingProdOfrComp) {
      this.missingProdOfrComp += ', ' + e.missingProdOfrComp;
    } else {
      this.missingProdOfrComp += e.missingProdOfrComp;
    }
  }

  ClickSave() {
    if (!this.isProdOfrUpToDate) {
      this.toastr.warningMessage("Prod Offering Component \"" + this.missingProdOfrComp + "\" Is Missing, Please Update Product Offering");
      return false;
    }
    if (this.NapAppModelForm.value.CharaCredit != CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.NapAppModelForm.patchValue({
        PrevAgrNo: null,
        WayRestructure: null
      });
    }
    if (this.BizTemplateCode == CommonConstant.CFNA) {
      this.http.post(URLConstant.GetListAppLoanPurposeByAppId, { Id: this.appId }).subscribe(
        (response) => {
          if (response['listResponseAppLoanPurpose'] && response['listResponseAppLoanPurpose'].length > 0) {
            if (!this.checkPlafondAndTenorAgrmnt(response['listResponseAppLoanPurpose'])) {
              return;
            }
            this.reqAgrmntMasterDataObjX = new ReqAgrmntMasterDataObjX();
            let tempAppObj = this.GetAppObjValue();
            let tempListAppCrossObj = this.GetListAppCrossValue();
            let tempAppFindDataObj = this.GetAppFinDataValue();
            let tempAppCustMailingAddr = this.getMailingAddrForSave();
            let tempAppCustAttrContentObj = this.getAppAttrContentObj();
            let appXobj = {};
            if (this.isShowAppCustBankAcc == false) {
              this.resetCustBankAccDetailForm();
              appXobj = {
                AppId: this.appId,
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
                AppId: this.appId,
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
            this.reqAgrmntMasterDataObjX =
            {
              AppId: this.appId,
              AppNo: this.NapAppModelForm.value.AppNo.value,
              AgrmntParentNo: this.agrParent.AgrmntNo,
              TotalAgrmntMpfDt: this.totalAgrmntMpfDt,
              PlafondAgrmntAmt: this.resCalculatePlafondAgrmntXObj.PlafondAgrmntAmt,
              MaxPlafondAgrmntAmt: this.resCalculatePlafondAgrmntXObj.MaxPlafondAgrmntAmt,
              MaxTenor: this.maxTenor,
              AgrmntDt: this.AgrmntDt,
              OsPrincipal: this.OsPrincipal,
              OsInterest: this.OsInterest,
              NumOfAsset: this.NumberOfAsset,
              EffRate: this.EffRate,
              PurposeOfFinancing: this.PurposeOfFinancing,
              WayOfFinancing: this.WayOfFinancing,
              ProductType: this.ProductType,
              ApToSupplierDisburseDt: this.ApToSupplierDisburseDt,
              EffectiveDt: this.EffectiveDt,
              GoLiveDt: this.goLiveDt,
              Tenor: this.Tenor,
              TotalAssetPrice: this.TotalAssetPrice,
              RowVersion: this.resultResponse.RowVersionAgrmntMasterX
            }
            let obj = {
              AppObj: tempAppObj,
              ListAppCrossObj: tempListAppCrossObj,
              AppFinData: tempAppFindDataObj,
              AppCustMailingAddr: tempAppCustMailingAddr,
              AppOtherInfoObj: this.GetBankInfo,
              RowVersion: '',
              AppXObj: appXobj,
              ReqAgrnntMasterX: this.reqAgrmntMasterDataObjX,
              TotalAgrmntMpfDt: this.totalAgrmntMpfDt,
              MaxTenor: this.maxTenor,
              RowVersionAgrmntMasterX: this.resultResponse.RowVersionAgrmntMasterX
            };
            this.http.post(URLConstantX.EditAppAddAppCrossX, obj).subscribe(
              (response) => {
                this.toastr.successMessage('Save Application Data');
                this.outputTab.emit();
              });
          } else {
            this.toastr.warningMessage('At Least 1 Loan Object Is Required');
            return false;
          }
        });
    } else {
      let tempAppObj = this.GetAppObjValue();
      let tempListAppCrossObj = this.GetListAppCrossValue();
      let tempAppFindDataObj = this.GetAppFinDataValue();
      let tempAppCustAttrContentObj = this.getAppAttrContentObj();
      let appXobj = {};
      if (this.isShowAppCustBankAcc == false) {
        this.resetCustBankAccDetailForm();
        appXobj = {
          AppId: this.appId,
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
          AppId: this.appId,
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
      let obj = {
        AppObj: tempAppObj,
        ListAppCrossObj: tempListAppCrossObj,
        AppFinData: tempAppFindDataObj,
        AppOtherInfoObj: this.GetBankInfo,
        AppAttrContentObjs: tempAppCustAttrContentObj,
        RowVersion: "",
        AppXObj: appXobj
      };
      // DSF
      if (this.isFromMouCust == true) {
        if (this.NapAppModelForm.controls.Tenor.value > this.TenorTo || this.NapAppModelForm.controls.Tenor.value < this.TenorFrom) {
          this.isTenorValid = false;
        } else {
          this.isTenorValid = true;
        }
      }
      if (this.isTenorValid == true) {
        obj['AppCustMailingAddr'] = this.getMailingAddrForSave();
        this.http.post(URLConstantX.EditAppAddAppCrossX, obj).subscribe(
          (response) => {
            this.toastr.successMessage('Save Application Data Success!');
            this.outputTab.emit();
          });
      }
      if (this.isTenorValid == false) {
        this.toastr.errorMessage('Tenor must be between ' + this.TenorFrom + ' and ' + this.TenorTo)
      }
    }

  }

  getAppAttrContentObj() {
    var appAttrContentObjs = new Array<AppAttrContentObj>();
    if (this.GenerateAppAttrContentObjs != null) {
      for (let i = 0; i < this.NapAppModelForm.controls["AppAttrContentObjs"].value.length; i++) {
        var appAttrContentObj = new AppAttrContentObj();
        appAttrContentObj.AppId = this.appId;
        appAttrContentObj.RefAttrCode = this.NapAppModelForm.controls["AppAttrContentObjs"].value[i].AttrCode;
        appAttrContentObj.AttrValue = this.NapAppModelForm.controls["AppAttrContentObjs"].value[i].AttrValue;

        appAttrContentObjs.push(appAttrContentObj);
      }
    }

    return appAttrContentObjs;
  }
  checkPlafondAndTenorAgrmnt(listAppLoanPurpose) {
    if (this.resCalculatePlafondAgrmntXObj == undefined) {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_INPUT_AGREEMENT_PARENT);
      return false;
    }

    if (this.resCalculatePlafondAgrmntXObj.IsAppInProgress) {
      this.toastr.warningMessage(ExceptionConstant.THERE_IS_APP_ON_PROGRESS);
      return false;
    }
    var plafondUsed = 0;

    if (this.resCalculatePlafondAgrmntXObj.PlafondAgrmntAmt > this.resCalculatePlafondAgrmntXObj.MaxPlafondAgrmntAmt) {
      plafondUsed = this.resCalculatePlafondAgrmntXObj.MaxPlafondAgrmntAmt;
    } else {
      plafondUsed = this.resCalculatePlafondAgrmntXObj.PlafondAgrmntAmt;
    }
    var financingAmt = 0;
    if (listAppLoanPurpose) {
      for (let i = 0; i < listAppLoanPurpose.length; i++) {
        financingAmt += listAppLoanPurpose[i].FinancingAmt;
      }
    }

    if(this.NapAppModelForm.controls.LobCode.value == 'FD')
    {
      if (plafondUsed < financingAmt) {
        this.toastr.warningMessage(ExceptionConstant.FINANCING_AMOUNT_EXCEEDED);
        return false;
      }
    }

    if (this.NapAppModelForm.controls.Tenor.value >= this.maxTenor) {
      this.toastr.warningMessage(ExceptionConstant.TENOR_EXCEEDED);
      return false;
    }
    return true;
  }

  Cancel() {
    this.outputCancel.emit();
  }

  closeResult;
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

  AddTemp(contentCrossApp) {
    this.Open(contentCrossApp);
  }

  resultCrossApp: Array<NapAppCrossObj> = new Array<NapAppCrossObj>();
  GetDataTemp(ev) {
    for (let i of ev) {
      let tempCrossApp = new NapAppCrossObj();
      tempCrossApp.CrossAgrmntNo = i.AgrmntNo;
      tempCrossApp.CrossAppNo = i.AppNo;
      tempCrossApp.CustName = i.CustName;
      tempCrossApp.ContractStat = i.AgrmntStat;
      tempCrossApp.MaturityDt;
      this.resultCrossApp.push(tempCrossApp);
      this.ListCrossAppObj["result"].push(i.AgrmntNo);
    }
  }

  DeleteCrossApp(idx) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      if (this.resultCrossApp[idx].AppCrossId != null) {
        let obj = new NapAppCrossObj();
        obj = this.resultCrossApp[idx];
        this.http.post(URLConstant.DeleteAppCross, obj).subscribe(
          (response) => {
          }
        )
      }
      this.resultCrossApp.splice(idx, 1);
      this.ListCrossAppObj["result"].splice(idx, 1);
    }
  }

  ChangeInterestType() {
    if (this.NapAppModelForm.value.InterestType == "FIXED") {
      this.isFixedRate = true;
      this.NapAppModelForm.controls.FloatingPeriod.clearValidators();
    } else {
      this.isFixedRate = false;
      this.NapAppModelForm.controls.FloatingPeriod.setValidators(Validators.required);
      if (this.BizTemplateCode == CommonConstant.OPL) {
        this.NapAppModelForm.controls.FloatingPeriod.clearValidators();
      }
    }
    this.NapAppModelForm.controls.FloatingPeriod.updateValueAndValidity();
  }

  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();
  mailingAddrObj: AddrObj = new AddrObj();
  AppCustAddrObj: Array<AppCustAddrObj> = new Array();
  copyToMailingTypeObj: Array<KeyValueObj> = [
    { Key: "LEGAL", Value: "Legal" },
    { Key: "RESIDENCE", Value: "Residence" }
  ];
  IsAddrReady: boolean = false;
  async initMailingAddress() {
    this.mailingAddrObj = new AddrObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;

    await this.http.post(URLConstant.GetListAppCustAddrByAppId, { 'Id': this.appId }).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.copyToMailing(CommonConstant.AddrTypeMailing);
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
    }
    this.IsAddrReady = true;
  }

  getMailingAddrForSave() {
    let mailingAddr: AppCustAddrObj = new AppCustAddrObj();
    mailingAddr.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
    mailingAddr.Addr = this.NapAppModelForm.controls["Address"]["controls"].Addr.value;
    mailingAddr.AreaCode3 = this.NapAppModelForm.controls["Address"]["controls"].AreaCode3.value;
    mailingAddr.AreaCode4 = this.NapAppModelForm.controls["Address"]["controls"].AreaCode4.value;
    mailingAddr.Zipcode = this.NapAppModelForm.controls["AddressZipcode"]["controls"].value.value;
    mailingAddr.AreaCode1 = this.NapAppModelForm.controls["Address"]["controls"].AreaCode1.value;
    mailingAddr.AreaCode2 = this.NapAppModelForm.controls["Address"]["controls"].AreaCode2.value;
    mailingAddr.City = this.NapAppModelForm.controls["Address"]["controls"].City.value;
    mailingAddr.PhnArea1 = this.NapAppModelForm.controls["Address"]["controls"].PhnArea1.value;
    mailingAddr.Phn1 = this.NapAppModelForm.controls["Address"]["controls"].Phn1.value;
    mailingAddr.PhnExt1 = this.NapAppModelForm.controls["Address"]["controls"].PhnExt1.value;
    mailingAddr.PhnArea2 = this.NapAppModelForm.controls["Address"]["controls"].PhnArea2.value;
    mailingAddr.Phn2 = this.NapAppModelForm.controls["Address"]["controls"].Phn2.value;
    mailingAddr.PhnExt2 = this.NapAppModelForm.controls["Address"]["controls"].PhnExt2.value;
    mailingAddr.PhnArea3 = this.NapAppModelForm.controls["Address"]["controls"].PhnArea3.value;
    mailingAddr.Phn3 = this.NapAppModelForm.controls["Address"]["controls"].Phn3.value;
    mailingAddr.PhnExt3 = this.NapAppModelForm.controls["Address"]["controls"].PhnExt3.value;
    mailingAddr.FaxArea = this.NapAppModelForm.controls["Address"]["controls"].FaxArea.value;
    mailingAddr.Fax = this.NapAppModelForm.controls["Address"]["controls"].Fax.value;
    mailingAddr.SubZipcode = this.NapAppModelForm.controls["Address"]["controls"].SubZipcode.value;
    return mailingAddr;
  }

  GetBankAccCust() {
    this.http.post<AppOtherInfoObj>(URLConstant.GetAppOtherInfoByAppId, { Id: this.appId }).subscribe(
      (response) => {
        this.GetBankInfo = response;
        if (this.GetBankInfo.AppOtherInfoId != 0) {
          let selectedBankAcc: AppCustBankAccObj = this.listCustBankAcc.find(x => x.BankAccNo == this.GetBankInfo.BankAccNo);
          this.NapAppModelForm.patchValue({
            CustBankAcc: selectedBankAcc.AppCustBankAccId
          });

          this.GetBankInfo.AppOtherInfoId = response.AppOtherInfoId;
          this.GetBankInfo.BankCode = selectedBankAcc.BankCode;
          this.GetBankInfo.BankBranch = selectedBankAcc.BankBranch;
          this.GetBankInfo.AppId = this.appId;
          this.GetBankInfo.BankAccNo = selectedBankAcc.BankAccNo;
          this.GetBankInfo.BankAccName = selectedBankAcc.BankAccName;
        }
      }
    );
  }

  GetListAppCustBankAcc(appCustId: number) {
    this.http.post<GenericListObj>(URLConstant.GetListAppCustBankAccByAppCustId, { Id: appCustId }).subscribe(
      (response) => {
        this.listCustBankAcc = response.ReturnObject["AppCustBankAccObjs"];
      }
    );
  }

  readonly WopAutoDebit: string = CommonConstant.WopAutoDebit;
  setBankAcc(WOP: string) {
    if (WOP == this.WopAutoDebit) {
      if (this.BizTemplateCode == CommonConstant.CFNA){
        this.NapAppModelForm.controls['CustBankAcc'].setValidators([Validators.required]);
        this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity();
      }

      if (this.NapAppModelForm.controls.MrIdTypeOwnerBnkAcc.value == CommonConstant.MrIdTypeCodeEKTP) {
        this.NapAppModelForm.get('IdNoOwnerBankAcc').setValidators([Validators.pattern('^[0-9]+$'), Validators.minLength(16), Validators.maxLength(16)]);
        this.NapAppModelForm.get('IdNoOwnerBankAcc').updateValueAndValidity();
      }
      this.isShowAppCustBankAcc = true;
    }
    else {
      this.NapAppModelForm.controls['CustBankAcc'].clearValidators();
      this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity();

      this.NapAppModelForm.controls['IdNoOwnerBankAcc'].clearValidators();
      this.NapAppModelForm.controls['IdNoOwnerBankAcc'].updateValueAndValidity();
      this.isShowAppCustBankAcc = false;
    }
    this.NapAppModelForm.controls.CustBankAcc.updateValueAndValidity();
  }

  setBankAccDDL(event: UcDropdownListCallbackObj) {
    if (event.selectedValue == this.WopAutoDebit) {
      if (this.BizTemplateCode == CommonConstant.CFNA){
        this.NapAppModelForm.controls['CustBankAcc'].setValidators([Validators.required]);
        this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity();
        }

      if (this.NapAppModelForm.controls.MrIdTypeOwnerBnkAcc.value == CommonConstant.MrIdTypeCodeEKTP) {
        this.NapAppModelForm.get('IdNoOwnerBankAcc').setValidators([Validators.pattern('^[0-9]+$'), Validators.minLength(16), Validators.maxLength(16)]);
        this.NapAppModelForm.get('IdNoOwnerBankAcc').updateValueAndValidity();
      }
      this.isShowAppCustBankAcc = true;
    } else {
      this.NapAppModelForm.controls['CustBankAcc'].clearValidators();
      this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity();

      this.NapAppModelForm.controls['IdNoOwnerBankAcc'].clearValidators();
      this.NapAppModelForm.controls['IdNoOwnerBankAcc'].updateValueAndValidity();
      this.isShowAppCustBankAcc = false;
    }
    this.NapAppModelForm.controls.CustBankAcc.updateValueAndValidity();
  }

  setTenorOnChange(event) {
    if (event != 'null') {
      this.isFromMouCust = true;
      let mouCustObj = { Id: event }
      this.http.post(URLConstant.GetMouCustDataByMouCustId, mouCustObj).subscribe(
        (response) => {
          this.mouCust = response["MouCustObj"];
          if (this.mouCust.MrMouTypeCode == CommonConstant.GENERAL) {
            this.mouCustClause = response["MouCustClauseObj"];
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
        }
      );
    } else {
      this.isFromMouCust = false;
    }
  }

  setTenor(event) {
    let mouCustObj = { Id: event }
    this.http.post(URLConstant.GetMouCustDataByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.mouCust = response["MouCustObj"];
        if (this.mouCust.MrMouTypeCode == CommonConstant.GENERAL) {
          this.mouCustClause = response["MouCustClauseObj"];
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
      }
    );
  }

  selectedBank() {
    if (this.NapAppModelForm.controls.MrWopCode.value != this.WopAutoDebit) return;
    
    if(this.NapAppModelForm.get("CustBankAcc").value == "")
    {
      this.GetBankInfo.BankCode = "";
      this.GetBankInfo.BankBranch = "";
      this.GetBankInfo.AppId = 0;
      this.GetBankInfo.BankAccNo = "";
      this.GetBankInfo.BankAccName = "";
      return;
    }
    
    let custBankAccId: number = this.NapAppModelForm.get("CustBankAcc").value;
    let selectedBankAcc: AppCustBankAccObj = this.listCustBankAcc.find(x => x.AppCustBankAccId == custBankAccId);
    this.GetBankInfo.BankCode = selectedBankAcc.BankCode;
    this.GetBankInfo.BankBranch = selectedBankAcc.BankBranch;
    this.GetBankInfo.AppId = this.appId;
    this.GetBankInfo.BankAccNo = selectedBankAcc.BankAccNo;
    this.GetBankInfo.BankAccName = selectedBankAcc.BankAccName;
  }

  async getAppXData() {
    await this.http.post(URLConstantX.GetAppXDataByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.initCustBankAccDetail();
        this.initAddressCustBankAcc();
        if (response["AppId"] != 0) {
          let datePipe = new DatePipe("en-US");
          this.NapAppModelForm.patchValue({
            BpkbStatCode: response["MrStatusBpkbCode"],
            OrdStatCode: response["MrOrdStatusCode"],
            CommodityCode: response["MrCommodityCode"],
            MrCustTypeOwnerBnkAcc: response["MrCustTypeOwnerBnkAcc"],
            PrsdntDirectorOwnerBnkAcc: response["PrsdntDirectorOwnerBnkAcc"],
            MrIdTypeOwnerBnkAcc: response["MrIdTypeOwnerBnkAcc"],
            IdNoOwnerBankAcc: response["IdNoOwnerBankAcc"],
            BirthDtOwnerBankAcc: datePipe.transform(response['BirthDtOwnerBankAcc'], 'yyyy-MM-dd'),
            BirthPlaceOwnerBankAcc: response["BirthPlaceOwnerBankAcc"],
          });

          this.inputAddrObj.Addr = response["AddrOwnerBankAcc"];
          this.inputAddrObj.AreaCode1 = response["AreaCode1OwnerBankAcc"];
          this.inputAddrObj.AreaCode2 = response["AreaCode2OwnerBankAcc"];
          this.inputAddrObj.AreaCode3 = response["AreaCode3OwnerBankAcc"];
          this.inputAddrObj.AreaCode4 = response["AreaCode4OwnerBankAcc"];
          this.inputAddrObj.City = response["CityOwnerBankAcc"];

          this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.nameSelect = response["ZipcodeOwnerBankAcc"];
          this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["ZipcodeOwnerBankAcc"] };
          this.inputAddressOwnerBankAccObj.default = this.inputAddrObj;

          if (response["MrCustTypeOwnerBnkAcc"] != null && response["MrIdTypeOwnerBnkAcc"] != null) {
            this.NapAppModelForm.patchValue({
              MrCustTypeOwnerBnkAcc: response["MrCustTypeOwnerBnkAcc"],
              MrIdTypeOwnerBnkAcc: response["MrIdTypeOwnerBnkAcc"],
            });
          } else {
            this.initCustBankAccDetail();
            this.initAddressCustBankAcc();
          }

          this.tempCommodityName = response["CommodityName"];
        }
        this.isCustomerTypeCompany();
      }
    );
  }
}