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
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMasterCodeObj.Model';


@Component({
  selector: 'app-application-data-FL4W',
  templateUrl: './application-data-FL4W.component.html'
})
export class ApplicationDataFL4WComponent implements OnInit {

  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  FirstInstType: string;
  mode: string;
  ListCrossAppObj: any = {};
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,
    private route: ActivatedRoute, private cookieService: CookieService
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
    CopyFromMailing: [''],
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
    this.defaultSlikSecEcoCode = CommonConstant.DefaultSlikSecEcoCode;
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
    this.initMailingAddress();

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

  Cancel() {
    this.outputCancel.emit();
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
        if (refProdCompntCode == CommonConstant.RefProdCompFirstInstType) {
          this.FirstInstType = this.applicationDDLitems['FIRSTINSTTYPE'][0].Value;
          this.NapAppModelForm.patchValue({
            MrFirstInstTypeCode: this.applicationDDLitems['FIRSTINSTTYPE'][0].Key
          });
        }
      });
  }

  getInterestTypeCode() {
    let obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
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
    if (this.NapAppModelForm.value.InterestType == CommonConstant.InterestTypeFixed) {
      this.isFixedRate = true;
    }
    else {
      this.isFixedRate = false;
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
  resultResponse;
  getAppModelInfo() {
    var obj = {
      Id: this.AppId,
      RowVersion: ""
    };

    this.http.post(URLConstant.GetAppDetailForTabAddEditAppById, obj).subscribe(
      (response) => {
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
          CharaCredit: this.resultResponse.MrCharacteristicOfCreditCode,
          PrevAgrNo: this.resultResponse.PrevAgrmntNo,
          WayRestructure: this.resultResponse.MrWayOfRestructureCode,
          MrSlikSecEcoCode: this.resultResponse.MrSlikSecEcoCode
          // FloatingPeriod: this.resultResponse.FloatingPeriodCode
        });
        this.makeNewLookupCriteria();
        this.getInterestTypeCode();
        this.getDDLFromProdOffering(CommonConstant.RefMasterTypeCodeInstSchm);
        this.getDDLFromProdOffering(CommonConstant.RefMasterTypeCodePayFreq);
        this.getDDLFromProdOffering(CommonConstant.RefProdCompFirstInstType);
      });

    if (this.NapAppModelForm.controls.PayFreqCode.value == CommonConstant.PAY_FREQ_MONTHLY) {
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
    //this.inputLookupObj.nameSelect = this.NapAppModelForm.controls.SalesOfficerName.value;
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
      this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, reqSecObj).subscribe(
        (response) => {
          console.log(response);
          this.slikSecDescr = response['Descr'];
          this.inputLookupEconomicSectorObj.nameSelect = response['Descr'];
          this.inputLookupEconomicSectorObj.jsonSelect = { Descr: response['Descr'] };
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
    // this.inputLookupObj.addCritInput = this.arrAddCrit;
    this.makeLookUpObj();
  }

  async GetGSValueSalesOfficer() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingByCode, { Code: CommonConstant.GSCodeAppDataOfficer }).toPromise().then(
      (response) => {
        console.log(response);
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
    if (this.NapAppModelForm.controls.PayFreqCode.value == CommonConstant.PAY_FREQ_MONTHLY) {
      this.PatchNumOfInstallment(temp)
    }
    else {
      var total = Math.floor((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
    // if(!isNaN(temp)){
    //   var total = Math.floor((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
    //   this.PatchNumOfInstallment(total);      
    // }
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

    if (this.NapAppModelForm.controls.MouCustId.value == "null") {
      temp.MouCustId = "";
    }
    else {
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
    return temp;
  }

  GetListAppCrossValue() {
    var arr = [];
    for (var i = 0; i < this.resultCrossApp.length; i++) {
      // if (this.resultCrossApp[i].AppCrossId == 0) {
      var temp = new NapAppCrossObj();
      temp.AppId = this.AppId;
      temp.CrossAgrmntNo = this.resultCrossApp[i].CrossAgrmntNo;
      temp.CrossAppNo = this.resultCrossApp[i].CrossAppNo;
      temp.CustName = this.resultCrossApp[i].CustName;
      temp.MaturityDt = this.resultCrossApp[i].MaturityDt;
      temp.ContractStat = this.resultCrossApp[i].ContractStat;
      arr.push(temp);
      // }
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

  ClickSave() {
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
      RowVersion: this.resultResponse.RowVersion
    };

    obj['AppCustMailingAddr'] = this.getMailingAddrForSave();
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

  resultCrossApp: Array<NapAppCrossObj> = new Array<NapAppCrossObj>();
  GetDataTemp(ev) {
    for (let i of ev) {
      var tempCrossApp = new NapAppCrossObj();
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

  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();
  mailingAddrObj: AddrObj = new AddrObj();
  AppCustAddrObj: any;
  copyToMailingTypeObj: Array<KeyValueObj> = [
    { Key: "LEGAL", Value: "Legal" },
    { Key: "RESIDENCE", Value: "Residence" }
  ];
  async initMailingAddress() {

    this.mailingAddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;

    await this.http.post(URLConstant.GetListAppCustAddrByAppId, { 'Id': this.AppId }).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.copyToMailing(CommonConstant.AddrTypeMailing);
      }
    );
  }

  copyToMailing(addrType: string = '') {
    if (!addrType) addrType = this.NapAppModelForm.controls.CopyFromMailing.value;
    if (!addrType) return;

    let address = this.AppCustAddrObj.filter(emp => emp.MrCustAddrTypeCode === addrType);
    if (address.length && address[0] != undefined) {
      address = address[0];
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

}
