import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { NapAppCrossObj } from 'app/shared/model/NapAppCrossObj.Model';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMasterCodeObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { AppOtherInfoObj } from 'app/shared/model/AppOtherInfo.Model';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-application-data-refinancing',
  templateUrl: './application-data-refinancing.component.html'
})
export class ApplicationDataRefinancingComponent implements OnInit {

  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  mode: string;
  ListCrossAppObj: any = {};
  isProdOfrUpToDate: boolean = true;
  missingProdOfrComp: string = "";
  listCustBankAcc: Array<AppCustBankAccObj>;
  selectedBankAcc: any;
  GetBankInfo: any;
  responseBankAccCust: any;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private toastr: NGXToastrService, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.mode = params["mode"];
    });

  }

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
    MrFirstInstTypeCode: ["", Validators.required],
    NumOfAsset: [''],
    MrLcCalcMethodCode: ["AD"],
    LcInstRatePrml: [''],
    LcInsRatePrml: [''],
    MrAppSourceCode: ["", Validators.required],
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
    MrSalesRecommendCode: ["", Validators.required],
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
    MrInstSchemeCode: ["", Validators.required],
    InterestType: ['', Validators.required],
    InterestTypeDesc: [''],
    CharaCredit: ['', [Validators.required, Validators.maxLength(50)]],
    PrevAgrNo: [''],
    WayRestructure: [''],
    MrSlikSecEcoCode: [''],
    CustBankAcc: ['']
  });
  slikSecDescr: string = "";
  defaultSlikSecEcoCode: string;
  inputPagingObj;
  inputLookupObj;
  arrAddCrit;
  employeeIdentifier;
  salesRecommendationItems = [];
  isInputLookupObj;
  inputLookupEconomicSectorObj;
  resMouCustObj;
  CustNo: string;
  ngOnInit() {
    this.ListCrossAppObj["appId"] = this.AppId;
    this.ListCrossAppObj["result"] = [];
    this.isInputLookupObj = false;
    this.getAppModelInfo();


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
    this.getPayFregData();
    this.getAppSrcData();
    this.GetCrossInfoData();

    var user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var AppObj = {
      Id: this.AppId
    }
    this.http.post(URLConstant.GetAppCustByAppId, AppObj).subscribe(
      (response) => {
        this.CustNo = response["CustNo"];

        this.http.post(URLConstant.GetListMouCustByCustNo, {CustNo: this.CustNo, StartDt: user.BusinessDt, MrMouTypeCode: CommonConstant.GENERAL}).subscribe(
          (response) => {
            this.resMouCustObj = response[CommonConstant.ReturnObj];
          }
        );
      });

  }

  getDDLFromProdOffering(refProdCompntCode: string) {
    var obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    obj.ProdOfferingCode = this.resultResponse.ProdOfferingCode;
    obj.RefProdCompntCode = refProdCompntCode;
    obj.ProdOfferingVersion = this.resultResponse.ProdOfferingVersion;

    this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, obj).subscribe(
      (response) => {
        var listDDL = response["DDLRefProdComptCode"];
        this.applicationDDLitems[refProdCompntCode] = listDDL;
      });
  }

  getInterestTypeCode() {
    var obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
    obj.ProdOfferingCode = this.resultResponse.ProdOfferingCode;
    obj.RefProdCompntCode = CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
    obj.ProdOfferingVersion = this.resultResponse.ProdOfferingVersion;

    this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).subscribe(
      (response) => {
        this.NapAppModelForm.patchValue({
          InterestType: response["CompntValue"],
          InterestTypeDesc: response["CompntValueDesc"],
        });
        this.ChangeInterestType();
      });
  }

  isFixedRate: boolean = false;
  ChangeInterestType() {
    if (this.NapAppModelForm.value.InterestType == "FIXED") {
      this.isFixedRate = true;
      this.NapAppModelForm.controls.FloatingPeriod.clearValidators();
    }
    else {
      this.isFixedRate = false;
      this.NapAppModelForm.controls.FloatingPeriod.setValidators(Validators.required);
    }
    this.NapAppModelForm.controls.FloatingPeriod.updateValueAndValidity();
  }
  ChangeCharacteristicOfCredit() {
    if (this.NapAppModelForm.value.CharaCredit == CommonConstant.CharacteristicOfCreditTypeCredit) {
      this.NapAppModelForm.controls.WayRestructure.setValidators(Validators.required);
    } else {
      this.NapAppModelForm.controls.WayRestructure.clearValidators();
    }
    this.NapAppModelForm.controls.WayRestructure.updateValueAndValidity();
  }
  GetCrossInfoData() {
    var obj = {
      Id: this.AppId,
      RowVersion: ""
    }
    this.http.post(URLConstant.GetListAppCross, obj).subscribe(
      (response) => {
        this.resultCrossApp = response[CommonConstant.ReturnObj];
        for (var i = 0; i < this.resultCrossApp.length; i++) {
          this.ListCrossAppObj["result"].push(this.resultCrossApp[i].CrossAgrmntNo);
        }
      });
  }

  applicationDDLitems;
  resultResponse: AppObj; 
  getAppModelInfo() {
    this.http.post(URLConstant.GetAppDetailForTabAddEditAppById, {Id: this.AppId}).subscribe(
      (response: any) => {
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
          MrAppSourceCode: this.resultResponse.MrAppSourceCode,
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
          MrSalesRecommendCode: this.resultResponse.MrSalesRecommendCode,
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
          MrInstSchemeCode: this.resultResponse.MrInstSchemeCode,
          InterestType: this.resultResponse.InterestType,
          FloatingPeriod: this.resultResponse.FloatingPeriodCode,
          CharaCredit: this.resultResponse.MrCharacteristicOfCreditCode,
          PrevAgrNo: this.resultResponse.PrevAgrmntNo,
          WayRestructure: this.resultResponse.MrWayOfRestructureCode,
          MrSlikSecEcoCode: this.resultResponse.MrSlikSecEcoCode
        });
        if (this.NapAppModelForm.controls.MrWopCode.value == 'AUTOCOLLECTION') {
          this.GetBankAccCust();
          this.setBankAcc(this.NapAppModelForm.controls.MrWopCode.value)
        }
        this.makeNewLookupCriteria();
        this.getInterestTypeCode();
        this.getDDLFromProdOffering(CommonConstant.RefMasterTypeCodeInstSchm);
        this.getDDLFromProdOffering(CommonConstant.RefMasterTypeCodePayFreq);
      });

    if (this.NapAppModelForm.controls.PayFreqCode.value == "MONTHLY") {
      var total = this.NapAppModelForm.controls.Tenor.value
      this.PatchNumOfInstallment(total)
    }
  }

  getAppSrcData() {
    this.http.post(URLConstant.GetListKvpActiveRefAppSrc, null).subscribe(
      (response) => {
        this.applicationDDLitems["APP_SOURCE"] = response[CommonConstant.ReturnObj];
      });
  }

  getPayFregData() {
    var obj = {
      RowVersion: ""
    };

    this.http.post(URLConstant.GetListActiveRefPayFreq, obj).subscribe(
      (response) => {
        var objTemp = response[CommonConstant.ReturnObj];
        this.applicationDDLitems["Pay_Freq"] = objTemp;

      });
  }

  getRefMasterTypeCode(code) {
    var obj = {
      RefMasterTypeCode: code,
      RowVersion: ""
    };

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, obj).subscribe(
      (response) => {
        var objTemp = response[CommonConstant.ReturnObj];
        this.applicationDDLitems[code] = objTemp;
        if (code == CommonConstant.RefMasterTypeCodeCharacteristicCredit && this.NapAppModelForm.value.CharaCredit == "") {
          this.NapAppModelForm.patchValue({
            CharaCredit: this.applicationDDLitems['CHARACTERISTIC_OF_CREDIT'][1].Key,
            MrSlikSecEcoCode: this.defaultSlikSecEcoCode
          });
        }
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
  makeLookUpObj() {
    // Lookup obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.jsonSelect = this.resultResponse;
    this.inputLookupObj.addCritInput = this.arrAddCrit;
    this.inputLookupEconomicSectorObj = new InputLookupObj();
    this.inputLookupEconomicSectorObj.urlJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.urlEnviPaging = environment.FoundationR3Url;
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
          console.log(response);
          this.slikSecDescr = response.Value;
          this.inputLookupEconomicSectorObj.nameSelect = response.Value;
          this.inputLookupEconomicSectorObj.jsonSelect = { Descr: response.Value };
        });
    }
    this.isInputLookupObj = true;
  }

  async makeNewLookupCriteria() {
    this.arrAddCrit = new Array();

    var addCrit1 = new CriteriaObj();
    addCrit1.DataType = "bit";
    addCrit1.propName = "re.IS_ACTIVE";
    addCrit1.restriction = AdInsConstant.RestrictionEq;
    addCrit1.value = "1";
    this.arrAddCrit.push(addCrit1);

    var addCrit2 = new CriteriaObj();
    addCrit2.DataType = "bit";
    addCrit2.propName = "ru.IS_ACTIVE";
    addCrit2.restriction = AdInsConstant.RestrictionEq;
    addCrit2.value = "1";
    this.arrAddCrit.push(addCrit2);


    var addCrit4 = new CriteriaObj();
    addCrit4.DataType = "text";
    addCrit4.propName = "ro.OFFICE_CODE";
    addCrit4.restriction = AdInsConstant.RestrictionIn;
    addCrit4.listValue = [this.resultResponse.OriOfficeCode];
    this.arrAddCrit.push(addCrit4);
    await this.GetGSValueSalesOfficer();
    this.makeLookUpObj();
  }

  async GetGSValueSalesOfficer() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeAppDataOfficer }).toPromise().then(
      (response) => {
        var addCrit3 = new CriteriaObj();
        addCrit3.DataType = "text";
        addCrit3.propName = "rbt.JOB_TITLE_CODE";
        addCrit3.restriction = AdInsConstant.RestrictionIn;
        addCrit3.listValue = [response.GsValue];
        this.arrAddCrit.push(addCrit3);
      });
  }

  ChangeRecommendation(ev) {
  }

  PayFreqVal: number = 1;
  PayFreqTimeOfYear: number = 1;
  ChangeNumOfInstallmentTenor() {
    var temp = this.NapAppModelForm.controls.Tenor.value;
    if (this.NapAppModelForm.controls.PayFreqCode.value == "MONTHLY") {
      this.PatchNumOfInstallment(temp)
    }
    else {
      var total = Math.floor((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }

  ChangeNumOfInstallmentPayFreq(ev) {
    if (ev.target.selectedIndex == 0) return;
    var idx = ev.target.selectedIndex - 1;
    var temp = this.NapAppModelForm.controls.Tenor.value;
    if (!isNaN(temp)) {
      this.PayFreqVal = this.applicationDDLitems["Pay_Freq"][idx].PayFreqVal;
      this.PayFreqTimeOfYear = this.applicationDDLitems["Pay_Freq"][idx].TimeOfYear;
      var total = Math.floor((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }

  PatchNumOfInstallment(num) {
    this.NapAppModelForm.patchValue({
      NumOfInst: num
    });
  }

  GetAppObjValue() {
    var temp = new NapAppModel();
    temp.AppId = this.resultResponse.AppId;
    temp.MouCustId = this.NapAppModelForm.controls.MouCustId.value;
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
    temp.MrSalesRecommendCode = this.NapAppModelForm.controls.MrSalesRecommendCode.value;
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
    return temp;
  }

  GetListAppCrossValue() {
    var arr = [];
    var temp = new NapAppCrossObj();
    for (var i = 0; i < this.resultCrossApp.length; i++) {
      if (this.resultCrossApp[i].AppCrossId == null) {
        temp.AppId = this.resultCrossApp[i].AppId;
        temp.CrossAgrmntNo = this.resultCrossApp[i].AgrmntNo;
        temp.CrossAppNo = this.resultCrossApp[i].AppNo;
        temp.CustName = this.resultCrossApp[i].CustName;
        temp.MaturityDt = this.resultCrossApp[i].MaturityDt;
        temp.ContractStat = this.resultCrossApp[i].AgrmntStat;
        arr.push(temp);
      }
    }
    return arr;
  }

  GetAppFinDataValue() {
    var temp = {
      AppId: this.AppId,
      MrInstSchemeCode: this.NapAppModelForm.controls.MrInstSchemeCode.value,
      InterestType: this.NapAppModelForm.controls.InterestType.value,
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
    var tempAppObj = this.GetAppObjValue();
    var tempListAppCrossObj = this.GetListAppCrossValue();
    var tempAppFindDataObj = this.GetAppFinDataValue();
    var obj = {
      AppObj: tempAppObj,
      ListAppCrossObj: tempListAppCrossObj,
      AppFinData: tempAppFindDataObj,
      RowVersion: ""
    };


    this.http.post(URLConstant.EditAppAddAppCross, obj).subscribe(
      (response) => {
        this.outputTab.emit();
      });

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

  resultCrossApp = [];
  GetDataTemp(ev) {
    for (let i of ev) {
      this.resultCrossApp.push(i);
      this.ListCrossAppObj["result"].push(i.AgrmntNo);
    }
  }

  DeleteCrossApp(idx) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      if (this.resultCrossApp[idx].AppCrossId != null) {
        var obj = new NapAppCrossObj();
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

  setBankAcc(event) {
    if (event == 'AUTOCOLLECTION') {
      this.NapAppModelForm.controls['CustBankAcc'].setValidators([Validators.required]);
      this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity()
    }
    else {
      this.NapAppModelForm.controls['CustBankAcc'].clearValidators();
      this.NapAppModelForm.controls["CustBankAcc"].updateValueAndValidity()
    }
    this.NapAppModelForm.controls.CustBankAcc.updateValueAndValidity();
  }

  GetBankAccCust() {
    var obj = {
      AppId: this.AppId
    };
    this.http.post<any>(URLConstant.GetBankAccCustByAppId, obj).subscribe( 
      (response) => {
        this.responseBankAccCust = response
        this.NapAppModelForm.patchValue({
          CustBankAcc: this.responseBankAccCust[0].AppCustBankAccId
        });
        this.GetBankInfo = {
          "BankCode": this.responseBankAccCust[0].BankCode,
          "BankBranch": this.responseBankAccCust[0].BankBranch,
          "AppId": this.AppId,
          "BankAccNo": this.responseBankAccCust[0].BankAccNo,
          "BankAccName": this.responseBankAccCust[0].BankAccName,
        };

        this.http.post<any>(URLConstant.GetAppOtherInfoByAppId, obj).subscribe(
          (response) => {
            this.GetBankInfo = response
            if (this.GetBankInfo.AppId !== 0) {
              this.selectedBankAcc = this.listCustBankAcc.find(x => x.BankAccNo === this.GetBankInfo.BankAccNo);
              this.NapAppModelForm.patchValue({
                CustBankAcc: this.selectedBankAcc.AppCustBankAccId
              });
    
              this.GetBankInfo = {
                "BankCode": this.selectedBankAcc.BankCode,
                "BankBranch": this.selectedBankAcc.BankBranch,
                "AppId": this.AppId,
                "BankAccNo": this.selectedBankAcc.BankAccNo,
                "BankAccName": this.selectedBankAcc.BankAccName,
              };
            }
          })
      });
   
  }

  GetListAppCustBankAcc(appCustId: number) {
    var obj = {
      AppCustId: appCustId
    };
    this.http.post<any>(URLConstant.GetListAppCustBankAccByAppCustId, obj).subscribe(
      (response) => {
        this.listCustBankAcc = response.AppCustBankAccObjs;
      });
  }

  selectedBank(event) {
    if (this.NapAppModelForm.controls.MrWopCode.value == 'AUTOCOLLECTION') {
      this.NapAppModelForm.controls['CustBankAcc'].setValidators([Validators.required]);
      this.NapAppModelForm.controls['CustBankAcc'].updateValueAndValidity();
    }
    else {
      this.NapAppModelForm.controls['CustBankAcc'].clearValidators();
      this.NapAppModelForm.controls['CustBankAcc'].updateValueAndValidity();
    }
    var appOtherInfo = new AppOtherInfoObj();
    appOtherInfo.AppId = event;
    this.selectedBankAcc = this.listCustBankAcc.find(x => x.AppCustBankAccId == event);
    this.GetBankInfo = {
      "BankCode": this.selectedBankAcc.BankCode,
      "BankBranch": this.selectedBankAcc.BankBranch,
      "AppId": this.AppId,
      "BankAccNo": this.selectedBankAcc.BankAccNo,
      "BankAccName": this.selectedBankAcc.BankAccName,
      "AdditionalInterestPaidBy": ""
    };
  }

  SaveAppOtherInfo() {
    if (this.GetBankInfo != undefined && this.GetBankInfo != "" && this.GetBankInfo.BankAccName != null && this.GetBankInfo.BankAccNo != null && this.GetBankInfo.BankBranch != null && this.GetBankInfo.BankCode != null && this.GetBankInfo.AppId != 0) {
      this.http.post<any>(URLConstant.AddAppOtherInfo, this.GetBankInfo).subscribe(
        (response) => {
          response;
        },
        error => {
          console.log(error);
        }
      )
    }else{
      this.GetBankInfo = {
        "BankCode": "",
        "BankBranch": "",
        "AppId": this.AppId,
        "BankAccNo": "",
        "BankAccName": "",
      };
      this.http.post<any>(URLConstant.AddAppOtherInfo, this.GetBankInfo).subscribe(
        (response) => {
          response;
        },
        error => {
          console.log(error);
        }
      )
    }
  }
}
