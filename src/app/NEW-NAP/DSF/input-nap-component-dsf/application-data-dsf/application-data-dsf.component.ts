import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NapAppCrossObj } from 'app/shared/model/nap-app-cross-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ActivatedRoute } from '@angular/router';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcDropdownListCallbackObj, UcDropdownListConstant, UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResRefEmpObj } from 'app/shared/model/response/ref-emp/res-ref-emp-obj.model';
import { MouCustDlrFinObj } from 'app/shared/model/mou-cust-dlr-fin.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { MouCustClauseObj } from 'app/shared/model/mou-cust-clause-obj.model';
import { MouCustFctrObj } from 'app/shared/model/mou-cust-fctr-obj.model';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { AppOtherInfoObj } from 'app/shared/model/app-other-info.model';
import { GenerateAppAttrContentObj } from 'app/shared/model/app-attr-content/generate-app-attr-content-obj.model';
import { AppAttrContentObj } from 'app/shared/model/app-attr-content/app-attr-content-obj.model';
import { RefAttrSettingObj } from 'app/shared/model/ref-attr-setting-obj.model';

@Component({
  selector: 'app-application-data-dsf',
  templateUrl: './application-data-dsf.component.html',
  styleUrls: ['./application-data-dsf.component.css']
})
export class ApplicationDataDsfComponent implements OnInit {

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
  arrAddCrit: Array<CriteriaObj>;
  user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  isInputLookupObj: boolean = false;
  isFixedRate: boolean = false;
  PayFreqVal: number;
  PayFreqTimeOfYear: number;
  FirstInstType: string;
  resMouCustObj;
  CustNo: string;
  isProdOfrUpToDate: boolean = true;
  missingProdOfrComp: string = "";
  listCustBankAcc: Array<AppCustBankAccObj>;
  GetBankInfo: AppOtherInfoObj = new AppOtherInfoObj();
  totalAgrmntMpfDt: number = 0;
  maxTenor: number = 0;
  isDdlMrAppSourceReady: boolean = false;
  ddlMrAppSourceObj: UcDropdownListObj = new UcDropdownListObj();
  ddlMrFirstInstTypeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlInterestTypeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlInstallmentSchemeObj: UcDropdownListObj = new UcDropdownListObj();
  ddlPayFreqObj: UcDropdownListObj = new UcDropdownListObj();
  ddlMrWopObj: UcDropdownListObj = new UcDropdownListObj();
  ddlMrCustNotifyOptObj: UcDropdownListObj = new UcDropdownListObj();
  isDdlMrFirstInstTypeReady: boolean = false;
  isDdlPayFreqReady: boolean = false;
  isDdlInterestTypeReady: boolean = false;
  isDdlInstallmentSchemeReady: boolean = false;
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
    DpSrcPaymentCode: [''],
    InstSrcPaymentCode: [''],
    AppAttrContentObjs: this.fb.array([]),
  });
  slikSecDescr: string = "";
  defaultSlikSecEcoCode: string;
  MouCustDlrFindData: MouCustDlrFinObj = new MouCustDlrFinObj();
  mouCustClause: MouCustClauseObj;
  mouCustFctr: MouCustFctrObj;

  salesOfficerCode: Array<string> = new Array();
  isSalesOfficerCode: boolean = false;
  refEmpSpvObj: ResRefEmpObj;

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

    this.defaultSlikSecEcoCode = CommonConstant.DefaultSlikSecEcoCode;
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
    this.getAppSrcData();
    setTimeout(async() => { this.getAppModelInfo() }, 2000);

    this.http.post(URLConstant.GetAppCustByAppId, { Id: this.appId }).subscribe(
      (response: AppCustObj) => {
        this.CustNo = response.CustNo;
        this.GetListAppCustBankAcc(response.AppCustId);

        this.http.post(URLConstant.GetListMouCustByCustNo, {CustNo: this.CustNo, StartDt: this.user.BusinessDt, MrMouTypeCode: CommonConstant.GENERAL}).subscribe(
          (response) => {
            this.resMouCustObj = response[CommonConstant.ReturnObj];
          }
        );
      }
    );
    
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeAppDataOfficer }).toPromise().then(
      (response: GeneralSettingObj) => {
        this.salesOfficerCode = response.GsValue.split(',');
        if(this.salesOfficerCode.some(x => x === this.user.JobTitleCode)) {
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
              if(this.refEmpSpvObj !== null) {
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

  initDdlInterestType()
  {
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

  initDdlInstallmentScheme()
  {
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

  async getInterestTypeCode(ProdOfferringCode: string, ProdOfferingVersion: string) {
    let obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    obj.ProdOfferingCode = ProdOfferringCode;
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
    let obj = {
      Id: this.appId,
      RowVersion: ""
    };

    await this.http.post(URLConstant.GetAppDetailForTabAddEditAppById, obj).toPromise().then(
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
        this.makeNewLookupCriteria();
        this.initMailingAddress();

        if (this.BizTemplateCode != CommonConstant.OPL) {
          this.initDdlInterestType();
          await this.getInterestTypeCode(this.resultResponse.ProdOfferingCode, this.resultResponse.ProdOfferingVersion);
          this.GetCrossInfoData();
        }
        else {
          this.NapAppModelForm.controls.InterestType.clearValidators();
          this.NapAppModelForm.controls.InterestType.updateValueAndValidity();
          this.NapAppModelForm.controls.FloatingPeriod.clearValidators();
          this.NapAppModelForm.controls.FloatingPeriod.updateValueAndValidity();
          this.NapAppModelForm.controls.MrInstSchemeCode.clearValidators();
          this.NapAppModelForm.controls.MrInstSchemeCode.updateValueAndValidity();
        }
        this.initDdlMrFirstInstType();
        this.initDdlInstallmentScheme();
        this.initDdlPayFreq();
        this.getPayFregData();
        // this.GenerateAppAttrContent();
        this.spinner.hide();
      }
    );
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
          }
          else {
            this.NapAppModelForm.patchValue({
              CharaCredit: this.applicationDDLitems['CHARACTERISTIC_OF_CREDIT'][1].Key,
              MrSlikSecEcoCode: this.defaultSlikSecEcoCode
            });
          }
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

    if(generateAppAttrContentObj.IsMandatory == true){
      ListValidator.push(Validators.required);
    }
    if (generateAppAttrContentObj.AttrLength != null && generateAppAttrContentObj.AttrLength != 0) {
      ListValidator.push(Validators.maxLength(generateAppAttrContentObj.AttrLength));
    }
    if(generateAppAttrContentObj.PatternValue != null && generateAppAttrContentObj.PatternValue != ""){
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
      }else{
        this.tempLookup[generateAppAttrContentObj.RefAttrCode].isReady = true;
      }
    }

    return tempFB;
  }

  SetAttrValueRm(e, i){
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
      MrSlikSecEcoCode: ev.MasterCode
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
    this.inputLookupEconomicSectorObj.urlJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupEconomicSectorObj.pagingJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.genericJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";

    if (this.resultResponse["MrSlikSecEcoDescr"] != null && this.resultResponse["MrSlikSecEcoDescr"] != "") {
      this.inputLookupEconomicSectorObj.nameSelect = this.resultResponse["MrSlikSecEcoDescr"];
      this.inputLookupEconomicSectorObj.jsonSelect = { Descr: this.resultResponse["MrSlikSecEcoDescr"] };
    }
    else {
      let reqSecObj: ReqRefMasterByTypeCodeAndMasterCodeObj = new ReqRefMasterByTypeCodeAndMasterCodeObj();
      reqSecObj.MasterCode = this.defaultSlikSecEcoCode;
      reqSecObj.RefMasterTypeCode = "SLIK_SEC_ECO";
      this.http.post(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, reqSecObj).subscribe(
        (response: KeyValueObj) => {
          this.slikSecDescr = response.Value;
          this.inputLookupEconomicSectorObj.nameSelect = response.Value;
          this.inputLookupEconomicSectorObj.jsonSelect = { Descr: response.Value };
          this.NapAppModelForm.patchValue({
            MrSlikSecEcoCode: this.defaultSlikSecEcoCode
          });
        });
    }

    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeAppDataOfficer }).toPromise().then(
      (response: GeneralSettingObj) => {
        this.salesOfficerCode = response.GsValue.split(',');
        if(this.salesOfficerCode.some(x => x === this.user.JobTitleCode)) {
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
              if(this.refEmpSpvObj !== null) {
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
    }
    else {
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
      this.missingProdOfrComp += ", " + e.missingProdOfrComp;
    }
    else {
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
          if (response["listResponseAppLoanPurpose"] && response["listResponseAppLoanPurpose"].length > 0) {
            let tempAppObj = this.GetAppObjValue();
            let tempListAppCrossObj = this.GetListAppCrossValue();
            let tempAppFindDataObj = this.GetAppFinDataValue();
            let tempAppCustMailingAddr = this.getMailingAddrForSave();
            let tempAppCustAttrContentObj = this.getAppAttrContentObj();
            let obj = {
              AppModelObj: {
                AppObj: tempAppObj,
                ListAppCrossObj: tempListAppCrossObj,
                AppFinData: tempAppFindDataObj,
                AppCustMailingAddr: tempAppCustMailingAddr,
                AppOtherInfoObj: this.GetBankInfo,
                AppAttrContentObjs: tempAppCustAttrContentObj,
                RowVersion: "",
              },
              TotalAgrmntMpfDt: this.totalAgrmntMpfDt,
              MaxTenor: this.maxTenor,
              RowVersionAgrmntMasterX: this.resultResponse.RowVersionAgrmntMasterX
            };
            this.http.post(URLConstant.EditAppAddAppCross, obj.AppModelObj).subscribe(
              (response) => {
                this.toastr.successMessage('Save Application Data');
                this.outputTab.emit();
              });
          }
          else {
            this.toastr.warningMessage("At Least 1 Loan Object Is Required");
            return false;
          }
        });
    }
    else {
      let tempAppObj = this.GetAppObjValue();
      let tempListAppCrossObj = this.GetListAppCrossValue();
      let tempAppFindDataObj = this.GetAppFinDataValue();
      let tempAppCustAttrContentObj = this.getAppAttrContentObj();
      let obj = {
        AppObj: tempAppObj,
        ListAppCrossObj: tempListAppCrossObj,
        AppFinData: tempAppFindDataObj,
        AppOtherInfoObj: this.GetBankInfo,
        AppAttrContentObjs: tempAppCustAttrContentObj,
        RowVersion: ""
      };
      // DSF
      if (this.isFromMouCust == true) {
        if (this.NapAppModelForm.controls.Tenor.value > this.TenorTo || this.NapAppModelForm.controls.Tenor.value < this.TenorFrom) {
          this.isTenorValid = false;
        }
        else { this.isTenorValid = true; }
      }
      if (this.isTenorValid == true) {
        obj['AppCustMailingAddr'] = this.getMailingAddrForSave();
        this.http.post(URLConstant.EditAppAddAppCross, obj).subscribe(
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

  getAppAttrContentObj(){
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
    }
    else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    }
    else {
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
    }
    else {
      this.isFixedRate = false;
      this.NapAppModelForm.controls.FloatingPeriod.setValidators(Validators.required);
      if(this.BizTemplateCode == CommonConstant.OPL)
      {
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
      this.NapAppModelForm.controls['CustBankAcc'].setValidators([Validators.required]);
      this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity()
    }
    else {
      this.NapAppModelForm.controls['CustBankAcc'].clearValidators();
      this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity()
    }
    this.NapAppModelForm.controls.CustBankAcc.updateValueAndValidity();
  }

  setBankAccDDL(event: UcDropdownListCallbackObj) {
    if (event.selectedValue == this.WopAutoDebit) {
      this.NapAppModelForm.controls['CustBankAcc'].setValidators([Validators.required]);
      this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity()
    }
    else {
      this.NapAppModelForm.controls['CustBankAcc'].clearValidators();
      this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity()
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
            }
            else {
              this.isTenorValid = true;
            }
          }
          else if (this.mouCust.MrMouTypeCode == CommonConstant.FACTORING) {
            this.mouCustFctr = response["MouCustFctrObj"];
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
            }
            else {
              this.isTenorValid = true;
            }
          }
        }
      );
    }
    else {
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
        }
        else if (this.mouCust.MrMouTypeCode == CommonConstant.FACTORING) {
          this.mouCustFctr = response["MouCustFctrObj"];
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

    let custBankAccId: number = this.NapAppModelForm.get("CustBankAcc").value;
    let selectedBankAcc: AppCustBankAccObj = this.listCustBankAcc.find(x => x.AppCustBankAccId == custBankAccId);
    this.GetBankInfo.BankCode = selectedBankAcc.BankCode;
    this.GetBankInfo.BankBranch = selectedBankAcc.BankBranch;
    this.GetBankInfo.AppId = this.appId;
    this.GetBankInfo.BankAccNo = selectedBankAcc.BankAccNo;
    this.GetBankInfo.BankAccName = selectedBankAcc.BankAccName; 
  }
}
