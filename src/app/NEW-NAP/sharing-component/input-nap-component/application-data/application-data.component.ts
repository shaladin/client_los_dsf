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

@Component({
  selector: 'app-application-data',
  templateUrl: './application-data.component.html',
  styleUrls: []
})
export class ApplicationDataComponent implements OnInit {
  @Input() isRefinancing: string;
  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Input() IsLoanObject: boolean = false;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  ListCrossAppObj: any = {};
  inputLookupObj;
  arrAddCrit;
  salesRecommendationItems = [];
  isInputLookupObj: boolean = false;
  isFixedRate: boolean = false;
  PayFreqVal: number;
  PayFreqTimeOfYear: number;

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
    Tenor: ["", [Validators.pattern("^[0-9]+$"), Validators.required]],
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
    FloatingPeriod: ['']
  });

  constructor(private fb: FormBuilder, private http: HttpClient,
    private toastr: NGXToastrService, private modalService: NgbModal) { }

  ngOnInit() {
    this.ListCrossAppObj["appId"] = this.appId;
    this.ListCrossAppObj["result"] = [];

    this.getAppModelInfo();

    this.applicationDDLitems = [];
    // data dummy test
    // data real
    this.getRefMasterTypeCode(AdInsConstant.RefMasterTypeCodeCustType);
    this.getRefMasterTypeCode(AdInsConstant.RefMasterTypeCodeSlsRecom);
    this.getRefMasterTypeCode(AdInsConstant.RefMasterTypeCodeWOP);
    this.getRefMasterTypeCode(AdInsConstant.RefMasterTypeCodeInstSchm);
    this.getRefMasterTypeCode(AdInsConstant.RefMasterTypeCodeCustNotifyOpt);
    this.getRefMasterTypeCode(AdInsConstant.RefMasterTypeCodeFirstInstType);
    // this.getRefMasterTypeCode(AdInsConstant.RefMasterTypeCodeInterestType);
    // this.getPayFregData();
    this.getRefMasterTypeCode(AdInsConstant.RefMasterTypeCodeInterestType);
    this.getAppSrcData();
    this.GetCrossInfoData();
  }

  getDDLFromProdOffering(refProdCompntCode:string){
    var obj = {
      ProdOfferingCode: this.resultResponse.ProdOfferingCode,
      RefProdCompntCode: refProdCompntCode,
      ProdOfferingVersion: this.resultResponse.ProdOfferingVersion
    };
    this.http.post(AdInsConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForDDL, obj).subscribe(
      (response) => {
        console.log(response);
        var listDDL = response["DDLRefProdComptCode"];
        // console.log(listDDL);
        this.applicationDDLitems[refProdCompntCode]=listDDL;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getInterestTypeCode(){
    var obj = {
      ProdOfferingCode: this.resultResponse.ProdOfferingCode,
      RefProdCompntCode: AdInsConstant.RefMasterTypeCodeInterestType,
      ProdOfferingVersion: this.resultResponse.ProdOfferingVersion
    };

    this.http.post(AdInsConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).subscribe(
      (response) => {
        // console.log(response);   
        this.NapAppModelForm.patchValue({
          InterestType: response["CompntValue"],
          InterestTypeDesc: response["CompntValueDesc"],
        });
        this.ChangeInterestType();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetCrossInfoData(){
    var obj = {
      AppId: this.appId,
      RowVersion: ""
    }
    this.http.post(AdInsConstant.GetListAppCross, obj).subscribe(
      (response) => {
        console.log(response);
        this.resultCrossApp = response["ReturnObject"];
        console.log(this.resultCrossApp);
        for (var i = 0; i < this.resultCrossApp.length; i++) {
          this.ListCrossAppObj["result"].push(this.resultCrossApp[i].CrossAgrmntNo);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  applicationDDLitems;
  resultResponse;
  getAppModelInfo() {
    var obj = {
      AppId: this.appId,
      RowVersion: ""
    };
    var url = AdInsConstant.GetAppDetailForTabAddEditAppById;

    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
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
          FloatingPeriod: this.resultResponse.FloatingPeriodCode
        });
        this.makeNewLookupCriteria();
        this.getInterestTypeCode();
        this.getDDLFromProdOffering(AdInsConstant.RefMasterTypeCodeInstSchm);
        this.getDDLFromProdOffering(AdInsConstant.RefMasterTypeCodePayFreq);
        this.getPayFregData();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAppSrcData() {
    var url = AdInsConstant.GetListKvpActiveRefAppSrc;
    var obj = {
      RowVersion: ""
    };

    this.http.post(url, obj).subscribe(
      (response) => {
        this.applicationDDLitems["APP_SOURCE"] = response["ReturnObject"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  DictRefPayFreq: any = {};
  getPayFregData() {
    var url = AdInsConstant.GetListActiveRefPayFreq;
    var obj = { RowVersion: "" };

    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        var objTemp = response["ReturnObject"];

        for(var i=0;i<objTemp.length;i++){
          this.DictRefPayFreq[objTemp[i].PayFreqCode] = objTemp[i];
        }
        this.applicationDDLitems["Floating_Period"] = objTemp;

        if(this.resultResponse.PayFreqCode != null){
          this.PayFreqVal = this.DictRefPayFreq[this.resultResponse.PayFreqCode].PayFreqVal;
          this.PayFreqTimeOfYear = this.DictRefPayFreq[this.resultResponse.PayFreqCode].TimeOfYear;
        }

        this.ChangeNumOfInstallmentTenor();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getRefMasterTypeCode(code) {
    var url = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    var obj = {
      RefMasterTypeCode: code,
      RowVersion: ""
    };

    this.http.post(url, obj).subscribe(
      (response) => {
        var objTemp = response["ReturnObject"];
        this.applicationDDLitems[code] = objTemp;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getLookupEmployeeResponse(ev) {
    this.NapAppModelForm.patchValue({
      SalesOfficerNo: ev.SalesOfficerNo,
      SalesOfficerName: ev.SalesOfficerName,
      SalesHeadNo: ev.SalesHeadNo,
      SalesHeadName: ev.SalesHeadName

    });
  }

  makeLookUpObj() {
    // Lookup obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.jsonSelect = this.resultResponse;
    // this.inputLookupObj.nameSelect = this.resultResponse.SalesName;
    this.inputLookupObj.addCritInput = this.arrAddCrit;
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
    addCrit3.listValue = [AdInsConstant.SALES_JOB_CODE];
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
      this.PayFreqVal = this.DictRefPayFreq[this.applicationDDLitems[AdInsConstant.RefMasterTypeCodePayFreq][idx].Key].PayFreqVal;
      this.PayFreqTimeOfYear = this.DictRefPayFreq[this.applicationDDLitems[AdInsConstant.RefMasterTypeCodePayFreq][idx].Key].TimeOfYear;
      var total = Math.ceil((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
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
    temp.FloatingPeriodCode = this.NapAppModelForm.controls.FloatingPeriod.value;
    return temp;
  }

  GetListAppCrossValue() {
    var arr = [];
    for (var i = 0; i < this.resultCrossApp.length; i++) {
      if (this.resultCrossApp[i].AppCrossId == 0) {
        console.log(this.resultCrossApp[i]);
        var temp = new NapAppCrossObj();
        temp.AppId = this.appId;
        temp.CrossAgrmntNo = this.resultCrossApp[i].CrossAgrmntNo;
        temp.CrossAppNo = this.resultCrossApp[i].CrossAppNo;
        temp.CustName = this.resultCrossApp[i].CustName;
        temp.MaturityDt = this.resultCrossApp[i].MaturityDt;
        temp.ContractStat = this.resultCrossApp[i].ContractStat;
        arr.push(temp);
      }
    }
    return arr;
  }

  GetAppFinDataValue() {
    var temp = {
      AppId: this.appId,
      MrInstSchemeCode: this.NapAppModelForm.controls.MrInstSchemeCode.value,
      InterestType: this.NapAppModelForm.controls.InterestType.value,
    }
    return temp;
  }

  ClickSave() {
    console.log(this.NapAppModelForm);
    var tempAppObj = this.GetAppObjValue();
    var tempListAppCrossObj = this.GetListAppCrossValue();
    var tempAppFindDataObj = this.GetAppFinDataValue();
    var url = AdInsConstant.EditAppAddAppCross;
    var obj = {
      appObj: tempAppObj,
      listAppCrossObj: tempListAppCrossObj,
      appFinData: tempAppFindDataObj,
      RowVersion: ""
    };
    console.log(obj);
    console.log("test");
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage('Save Application Data');
        this.outputTab.emit();
      },
      (error) => {
        console.log(error);
      }
    );

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
    console.log(this.resultCrossApp);
  }

  DeleteCrossApp(idx) {
    if (confirm('Are you sure to delete this record?')) {
      if (this.resultCrossApp[idx].AppCrossId != null) {
        var url = AdInsConstant.DeleteAppCross;
        var obj = new NapAppCrossObj();
        obj = this.resultCrossApp[idx];
        this.http.post(url, obj).subscribe(
          (response) => {
          },
          (error) => {
            console.log(error);
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

  test(){
    console.log(this.NapAppModelForm);
  }
}
