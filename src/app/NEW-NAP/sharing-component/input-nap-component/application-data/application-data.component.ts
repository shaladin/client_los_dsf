import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NapAppCrossObj } from 'app/shared/model/NapAppCrossObj.Model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-application-data',
  templateUrl: './application-data.component.html',
  styleUrls: []
})
export class ApplicationDataComponent implements OnInit {
  @Input() isCollateral: boolean;
  @Input() appId: number;
  @Input() AppId: any;
  @Input() showCancel: boolean = true;
  @Input() IsLoanObject: boolean = false;
  @Input() BizTemplateCode: string = "";
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  ListCrossAppObj: any = {};
  inputLookupObj;
  inputLookupEconomicSectorObj;
  arrAddCrit;
  isInputLookupObj: boolean = false;
  isFixedRate: boolean = false;
  PayFreqVal: number;
  PayFreqTimeOfYear: number;
  FirstInstType : string;
  resMouCustObj;  
  mouCustObj;
  CustNo: string;

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
    MrInstSchemeCode: ["", Validators.required],
    InterestType: ['', Validators.required],
    InterestTypeDesc: [''],
    FloatingPeriod: [''],
    CharaCredit: ['',[Validators.required, Validators.maxLength(50)]],
    PrevAgrNo: [''],
    MrSlikSecEcoCode: [''],
    WayRestructure: [''],
    EconomicSector: [''],
    ApplicationNotes: ['']
  });

  constructor(private fb: FormBuilder, private http: HttpClient,
    private toastr: NGXToastrService, private modalService: NgbModal, private route: ActivatedRoute) { 
      this.route.queryParams.subscribe(params => {
        this.AppId = params["AppId"];
      });  
    }

  ngOnInit() {
    console.log(this.BizTemplateCode);
    this.ListCrossAppObj["appId"] = this.appId;
    this.ListCrossAppObj["result"] = [];
    this.getAppModelInfo();

    this.applicationDDLitems = [];
    // data dummy test
    // data real
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCustType);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeSlsRecom);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeWOP);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCustNotifyOpt);
    // this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeFirstInstType);
    // this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeInterestType);
    // this.getPayFregData();
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeInterestTypeGeneral);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeCharacteristicCredit);
    this.getRefMasterTypeCode(CommonConstant.RefMasterTypeCodeWayOfRestructure);
    this.getAppSrcData();
    var AppObj = {
      AppId: this.appId
    }
    var user = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.http.post(URLConstant.GetAppCustByAppId, AppObj).subscribe(
      (response) => { 
        this.CustNo = response["CustNo"];

        this.mouCustObj = new MouCustObj();
        this.mouCustObj.CustNo = this.CustNo;
        this.mouCustObj.StartDt = user.BusinessDt;
        this.mouCustObj.MrMouTypeCode = CommonConstant.GENERAL;

        this.http.post(URLConstant.GetListMouCustByCustNo, this.mouCustObj).subscribe(
          (response) => {
            this.resMouCustObj = response[CommonConstant.ReturnObj];
            

            // if(this.resMouCustObj.length > 0)
            // {
            //   this.NapAppModelForm.patchValue({ MouCustId: this.resMouCustObj[0].Key });
            // }
          }
        );
      });
    if (this.BizTemplateCode != CommonConstant.OPL) {
      this.GetCrossInfoData();
    }
    else {
      this.NapAppModelForm.controls.PayFreqCode.clearValidators();
      this.NapAppModelForm.controls.PayFreqCode.updateValueAndValidity();
      this.NapAppModelForm.controls.InterestTypeDesc.clearValidators();
      this.NapAppModelForm.controls.InterestTypeDesc.updateValueAndValidity();
      this.NapAppModelForm.controls.FloatingPeriod.clearValidators();
      this.NapAppModelForm.controls.FloatingPeriod.updateValueAndValidity();
      this.NapAppModelForm.controls.MrInstSchemeCode.clearValidators();
      this.NapAppModelForm.controls.MrInstSchemeCode.updateValueAndValidity();
    }
    
  }

  getDDLFromProdOffering(refProdCompntCode:string){
    var obj = {
      ProdOfferingCode: this.resultResponse.ProdOfferingCode,
      RefProdCompntCode: refProdCompntCode,
      ProdOfferingVersion: this.resultResponse.ProdOfferingVersion
    };
    this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, obj).subscribe(
      (response) => {
        var listDDL = response["DDLRefProdComptCode"];
        this.applicationDDLitems[refProdCompntCode]=listDDL;
        if(refProdCompntCode == CommonConstant.RefProdCompFirstInstType){
          this.FirstInstType = this.applicationDDLitems['FIRSTINSTTYPE'][0].Value;
          this.NapAppModelForm.patchValue({
            MrFirstInstTypeCode: this.applicationDDLitems['FIRSTINSTTYPE'][0].Key
          });
        }
      });
  }

  getInterestTypeCode(){
    var obj = {
      ProdOfferingCode: this.resultResponse.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefMasterTypeCodeInterestTypeGeneral,
      ProdOfferingVersion: this.resultResponse.ProdOfferingVersion
    };

    this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).subscribe(
      (response) => {
        this.NapAppModelForm.patchValue({
          InterestType: response["CompntValue"],
          InterestTypeDesc: response["CompntValueDesc"],
        });
        this.ChangeInterestType();
      });
  }

  GetCrossInfoData(){
    var obj = {
      AppId: this.appId,
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
      AppId: this.appId,
      RowVersion: ""
    };
    var url = URLConstant.GetAppDetailForTabAddEditAppById;

    this.http.post(url, obj).subscribe(
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
          PayFreqCode: this.resultResponse.PayFreqCode == null ? "": this.resultResponse.PayFreqCode,
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
          FloatingPeriod: this.resultResponse.FloatingPeriodCode,
          ApplicationNotes: this.resultResponse.ApplicationNotes,
          CharaCredit: this.resultResponse.MrCharacteristicOfCreditCode,
          PrevAgrNo: this.resultResponse.PrevAgrmntNo,
          WayRestructure: this.resultResponse.MrWayOfRestructureCode,
          MrSlikSecEcoCode : this.resultResponse.MrSlikSecEcoCode
        }); 
        
        this.makeNewLookupCriteria();
        this.getInterestTypeCode();
        this.getDDLFromProdOffering(CommonConstant.RefMasterTypeCodeInstSchm);
        this.getDDLFromProdOffering(CommonConstant.RefMasterTypeCodePayFreq);
        this.getDDLFromProdOffering(CommonConstant.RefProdCompFirstInstType);
        this.getPayFregData();
      });
  }

  getAppSrcData() {
    var url = URLConstant.GetListKvpActiveRefAppSrc;
    var obj = {
      RowVersion: ""
    };

    this.http.post(url, obj).subscribe(
      (response) => {
        this.applicationDDLitems["APP_SOURCE"] = response[CommonConstant.ReturnObj];
      });
  }

  DictRefPayFreq: any = {};
  getPayFregData() {
    var url = URLConstant.GetListActiveRefPayFreq;
    var obj = { RowVersion: "" };

    this.http.post(url, obj).subscribe(
      (response) => {
        var objTemp = response[CommonConstant.ReturnObj];

        for(var i=0;i<objTemp.length;i++){
          this.DictRefPayFreq[objTemp[i].PayFreqCode] = objTemp[i];
        }
        this.applicationDDLitems["Floating_Period"] = objTemp;

        if(this.resultResponse.PayFreqCode != null){
          this.PayFreqVal = this.DictRefPayFreq[this.resultResponse.PayFreqCode].PayFreqVal;
          this.PayFreqTimeOfYear = this.DictRefPayFreq[this.resultResponse.PayFreqCode].TimeOfYear;
        }

        this.ChangeNumOfInstallmentTenor();
      });
  }

  getRefMasterTypeCode(code) {
    var url = URLConstant.GetRefMasterListKeyValueActiveByCode;
    var obj = {
      RefMasterTypeCode: code,
      RowVersion: ""
    };

    this.http.post(url, obj).subscribe(
      (response) => {
        var objTemp = response[CommonConstant.ReturnObj];
        this.applicationDDLitems[code] = objTemp;
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
    this.inputLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.jsonSelect = this.resultResponse;
    // this.inputLookupObj.nameSelect = this.resultResponse.SalesName;
    this.inputLookupObj.addCritInput = this.arrAddCrit;
    
    this.inputLookupEconomicSectorObj = new InputLookupObj();
    this.inputLookupEconomicSectorObj.urlJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupEconomicSectorObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupEconomicSectorObj.pagingJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json";
    this.inputLookupEconomicSectorObj.genericJson = "./assets/uclookup/NAP/lookupEconomicSectorSlik.json"; 
    this.inputLookupEconomicSectorObj.nameSelect = this.resultResponse["MrSlikSecEcoDescr"];
    this.inputLookupEconomicSectorObj.jsonSelect =  { Descr: this.resultResponse["MrSlikSecEcoDescr"] };
    this.isInputLookupObj = true;
  }

  makeNewLookupCriteria() {
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

    var addCrit3 = new CriteriaObj();
    addCrit3.DataType = "text";
    addCrit3.propName = "rbt.JOB_TITLE_CODE";
    addCrit3.restriction = AdInsConstant.RestrictionIn;
    addCrit3.listValue = [CommonConstant.SALES_JOB_CODE];
    this.arrAddCrit.push(addCrit3);

    var addCrit4 = new CriteriaObj();
    addCrit4.DataType = "text";
    addCrit4.propName = "ro.OFFICE_CODE";
    addCrit4.restriction = AdInsConstant.RestrictionIn;
    addCrit4.listValue = [this.resultResponse.OriOfficeCode];
    this.arrAddCrit.push(addCrit4);

    this.makeLookUpObj();
  }

  ChangeNumOfInstallmentTenor() {
    var temp:number = +this.NapAppModelForm.controls.Tenor.value;
    if (!isNaN(temp) && !isNaN(this.PayFreqTimeOfYear) && !isNaN(this.PayFreqVal)) {
      var total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }

  ChangeNumOfInstallmentPayFreq(ev) {
    if (ev.target.selectedIndex == 0) return;
    var idx = ev.target.selectedIndex - 1;
    var temp = this.NapAppModelForm.controls.Tenor.value;
    if (!isNaN(temp)) {
      this.PayFreqVal = this.DictRefPayFreq[this.applicationDDLitems[CommonConstant.RefMasterTypeCodePayFreq][idx].Key].PayFreqVal;
      this.PayFreqTimeOfYear = this.DictRefPayFreq[this.applicationDDLitems[CommonConstant.RefMasterTypeCodePayFreq][idx].Key].TimeOfYear;
      var total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }
  ChangeCharacteristicOfCredit(){
    if (this.NapAppModelForm.value.CharaCredit == CommonConstant.CharacteristicOfCreditTypeCredit) {  
     this.NapAppModelForm.controls.WayRestructure.setValidators(Validators.required);
    }else{
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
    temp.FloatingPeriodCode = this.NapAppModelForm.controls.FloatingPeriod.value;
    temp.MrSlikSecEcoCode = this.NapAppModelForm.controls.MrSlikSecEcoCode.value;
    if (this.BizTemplateCode == CommonConstant.OPL) {
      temp.ApplicationNotes = this.NapAppModelForm.controls.ApplicationNotes.value;
      temp.IsRos = true;
    }
    temp.CharaCredit = this.NapAppModelForm.controls.CharaCredit.value;
    temp.PrevAgrNo = this.NapAppModelForm.controls.PrevAgrNo.value;
    temp.WayRestructure = this.NapAppModelForm.controls.WayRestructure.value;
    if(this.NapAppModelForm.controls.MouCustId.value == "null")
    {
      temp.MouCustId = "";
    }
    else
    {
      temp.MouCustId = this.NapAppModelForm.controls.MouCustId.value;
    }
    return temp;
  }

  GetListAppCrossValue() {
    var arr = [];
    for (var i = 0; i < this.resultCrossApp.length; i++) {
        var temp = new NapAppCrossObj();
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
    var temp = {
      AppId: this.appId,
      MrInstSchemeCode: this.NapAppModelForm.controls.MrInstSchemeCode.value,
      InterestType: this.NapAppModelForm.controls.InterestType.value,
    }
    if (this.BizTemplateCode == CommonConstant.OPL) {
      temp.MrInstSchemeCode= CommonConstant.INST_SCHM_REGULAR_FIXED;
    }
    return temp;
  }

  ClickSave() { 
    if(this.NapAppModelForm.value.CharaCredit != CommonConstant.CharacteristicOfCreditTypeCredit){
      this.NapAppModelForm.patchValue({
        PrevAgrNo: null,
        WayRestructure: null
      });   
     }
    if(this.BizTemplateCode == CommonConstant.CFNA){
      this.http.post(URLConstant.GetListAppLoanPurposeByAppId, { AppId: this.appId }).subscribe(
        (response) => {
          if(response["listResponseAppLoanPurpose"] && response["listResponseAppLoanPurpose"].length > 0){
            var tempAppObj = this.GetAppObjValue();
            var tempListAppCrossObj = this.GetListAppCrossValue();
            var tempAppFindDataObj = this.GetAppFinDataValue();
            var url = URLConstant.EditAppAddAppCross;
            var obj = {
              appObj: tempAppObj,
              listAppCrossObj: tempListAppCrossObj,
              appFinData: tempAppFindDataObj,
              RowVersion: ""
            };
            this.http.post(url, obj).subscribe(
              (response) => {
                this.toastr.successMessage('Save Application Data');
                this.outputTab.emit();
              });
          }
          else{
            this.toastr.errorMessage("At Least 1 Loan Object Is Required");
            return false;
          }
        });
    }
    else{
      var tempAppObj = this.GetAppObjValue();
      var tempListAppCrossObj = this.GetListAppCrossValue();
      var tempAppFindDataObj = this.GetAppFinDataValue();
      var url = URLConstant.EditAppAddAppCross;
      var obj = {
        appObj: tempAppObj,
        listAppCrossObj: tempListAppCrossObj,
        appFinData: tempAppFindDataObj,
        RowVersion: ""
      };
      this.http.post(url, obj).subscribe(
        (response) => {
          this.toastr.successMessage('Save Application Data');
          this.outputTab.emit();
        });
    }
  }

  Cancel(){
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
      var tempCrossApp = new NapAppCrossObj();
      tempCrossApp.CrossAgrmntNo=i.AgrmntNo;
      tempCrossApp.CrossAppNo=i.AppNo;
      tempCrossApp.CustName=i.CustName;
      tempCrossApp.ContractStat=i.AgrmntStat;
      tempCrossApp.MaturityDt;
      this.resultCrossApp.push(tempCrossApp);
      this.ListCrossAppObj["result"].push(i.AgrmntNo);
    }
  }

  DeleteCrossApp(idx) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      if (this.resultCrossApp[idx].AppCrossId != null) {
        var url = URLConstant.DeleteAppCross;
        var obj = new NapAppCrossObj();
        obj = this.resultCrossApp[idx];
        this.http.post(url, obj).subscribe(
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
    }
    this.NapAppModelForm.controls.FloatingPeriod.updateValueAndValidity();
  }
}
