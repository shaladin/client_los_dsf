import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NapAppCrossObj } from 'app/shared/model/NapAppCrossObj.Model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';

@Component({
  selector: 'app-app-model',
  templateUrl: './app-model.component.html',
  styleUrls: ['./app-model.component.scss'],
  providers: [NGXToastrService]
})
export class AppModelComponent implements OnInit {

  @Input() appId: any;
  ListCrossAppObj: any = {};
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal
  ) { }

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
    Tenor: ['', Validators.pattern("^[0-9]+$")],
    NumOfInst: [''],
    PayFreqCode: [''],
    MrFirstInstTypeCode: [''],
    NumOfAsset: [''],
    MrLcCalcMethodCode: [''],
    LcInstRatePrml: [''],
    LcInsRatePrml: [''],
    MrAppSourceCode: [''],
    MrWopCode: [''],
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
    MrSalesRecommendCode: [''],
    MrCustNotifyOptCode: [''],
    PreviousAppId: [''],
    IsAppInitDone: [''],
    MrOrderInfoCode: [''],
    ApprovalStat: [''],
    RsvField1: [''],
    RsvField2: [''],
    RsvField3: [''],
    RsvField4: [''],
    RsvField5: [''],
    MrInstSchemeCode: [''],
    InterestType: ['']
  });

  inputPagingObj;
  inputLookupObj;
  arrAddCrit;
  employeeIdentifier;
  salesRecommendationItems = [];
  ngOnInit() {
    this.makeNewLookupCriteria();

    this.ListCrossAppObj["appId"]=this.appId;
    this.ListCrossAppObj["result"] = [];

    // Lookup obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.nameSelect = this.NapAppModelForm.controls.SalesOfficerName.value;
    this.inputLookupObj.addCritInput = this.arrAddCrit;
    
    this.getAppModelInfo();

    this.applicationDDLitems = [];
    // data dummy test
    this.getRefMasterTypeCode("CUST_TYPE");
    // data real
    this.getRefMasterTypeCode("SLS_RECOM");
    this.getRefMasterTypeCode("WOP");
    this.getRefMasterTypeCode("INST_SCHM");
    this.getRefMasterTypeCode("INTEREST_TYPE");
    this.getRefMasterTypeCode("CUST_NOTIFY_OPT");
    this.getRefMasterTypeCode("FIRST_INST_TYPE");
    this.getRefMasterTypeCode("INTRSTTYPE");
    this.getPayFregData();

    this.GetCrossInfoData();
  }

  GetCrossInfoData(){
    var url = environment.losUrl + AdInsConstant.GetListAppCross;
    var obj = {
      AppId: this.appId,
      RowVersion: ""
    }
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log("Response Cross App")
        console.log(response);    
        this.resultCrossApp = response["ReturnObject"];
        for(var i = 0; i<this.resultCrossApp.length; i++){
          this.ListCrossAppObj["result"].push(this.resultCrossApp[i].CrossAgrmntNo);
        }
        console.log(this.resultCrossApp);
        console.log(this.ListCrossAppObj);
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
    var url = environment.losUrl + AdInsConstant.GetAppById;

    this.http.post(url, obj).subscribe(
      (response) => {
        // console.log(response);
        this.resultResponse = response;
        console.log(this.resultResponse);
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
          PayFreqCode: this.resultResponse.PayFreqCode,
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
          SalesNotes: this.resultResponse.SalesNotes,
          SalesOfficerNo: this.resultResponse.SalesOfficerNo,
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
        });
        console.log(this.NapAppModelForm);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  getAppSrcData(){
    var url = environment.losUrl + AdInsConstant.GetListKvpActiveRefAppSrc;
    var obj = {
      RowVersion: ""
    };

    this.http.post(url, obj).subscribe(
      (response) => {
        // console.log(response);
        var objTemp = response["ReturnObject"];
        this.applicationDDLitems["APP_SOURCE"] = objTemp;
        console.log(this.applicationDDLitems);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPayFregData(){
    var url = environment.FoundationR3Url + AdInsConstant.GetListActiveRefPayFreq;
    var obj = {
      RowVersion: ""
    };

    this.http.post(url, obj).subscribe(
      (response) => {
        // console.log(response);
        var objTemp = response["ReturnObject"];
        this.applicationDDLitems["Pay_Freq"] = objTemp;
        console.log(this.applicationDDLitems);
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
        // console.log(response);
        var objTemp = response["ReturnObject"];
        this.applicationDDLitems[code] = objTemp;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getLookupEmployeeResponse(ev) {
    console.log(ev);
    this.NapAppModelForm.patchValue({
      SalesOfficerNo: ev.SalesOfficerNo,
      SalesOfficerName: ev.SalesOfficerName,
      SalesHeadNo: ev.SalesHeadNo,
      SalesHeadName: ev.SalesHeadName

    });
    console.log(this.NapAppModelForm);
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
    // console.log(this.arrAddCrit);
  }

  ChangeRecommendation(ev) {
    // console.log(ev);
    // console.log(this.NapAppModelForm);  
  }

  PayFreqVal;
  PayFreqTimeOfYear;
  ChangeNumOfInstallmentTenor(){
    console.log("Change Num from tenor");
    var temp = this.NapAppModelForm.controls.Tenor.value;
    if(!isNaN(temp)){
      console.log("isNUM");
      var total = ((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);      
    }
  }

  ChangeNumOfInstallmentPayFreq(ev){
    console.log(ev);
    console.log("Change Num from pay freq");
    var idx = ev.target.selectedIndex;
    console.log(idx);
    var temp = this.NapAppModelForm.controls.Tenor.value;
    if(!isNaN(temp)){
      console.log("isNUM");
      this.PayFreqVal = this.applicationDDLitems["Pay_Freq"][idx].PayFreqVal;
      this.PayFreqTimeOfYear = this.applicationDDLitems["Pay_Freq"][idx].TimeOfYear;
      var total = ((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);      
    }
  } 

  PatchNumOfInstallment(num){
    this.NapAppModelForm.patchValue({
      NumOfInst: num
    });
  }

  GetAppObjValue(){
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
    return temp;
  }

  GetListAppCrossValue(){
    var arr = [];
    var temp = new NapAppCrossObj();
    for(var i = 0; i < this.resultCrossApp.length; i++){
      if(this.resultCrossApp[i].AppCrossId == null){
        temp.AppId = this.resultCrossApp[i].appId;
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

  GetAppFinDataValue(){
    var temp = {
      AppId: this.appId,
      MrInstSchemeCode: this.NapAppModelForm.controls.MrInstSchemeCode.value,
      InterestType: this.NapAppModelForm.controls.InterestType.value,
    }
    return temp;
  }

  ClickSave(){
    console.log(this.NapAppModelForm);
    var tempAppObj = this.GetAppObjValue();
    // console.log(tempAppObj);
    var tempListAppCrossObj = this.GetListAppCrossValue();
    // console.log(tempListAppCrossObj);
    var tempAppFindDataObj = this.GetAppFinDataValue();
    var url = environment.losUrl + AdInsConstant.EditAppAddAppCross;
    var obj = {
      appObj: tempAppObj,
      listAppCrossObj: tempListAppCrossObj,
      appFinData: tempAppFindDataObj,
      RowVersion: ""
    };

    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    
  }

  closeResult;
  Open(contentCrossApp){
    this.modalService.open(contentCrossApp).result.then(
      (result) =>{
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason): string{
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  AddTemp(contentCrossApp){
    this.Open(contentCrossApp);
  }

  resultCrossApp=[];
  GetDataTemp(ev){
    for(let i of ev){
      this.resultCrossApp.push(i);
      this.ListCrossAppObj["result"].push(i.AgrmntNo);
    }
    // console.log("result cross app");
    // console.log(this.resultCrossApp);
  }

  DeleteCrossApp(idx){
    console.log(idx);
    console.log(this.resultCrossApp);
    console.log(this.resultCrossApp[idx]);
    if(this.resultCrossApp[idx].AppCrossId!=null){
      var url = environment.losUrl + AdInsConstant.DeleteAppCross;
      var obj = new NapAppCrossObj();
      obj = this.resultCrossApp[idx];
      this.http.post(url, obj).subscribe(
        (response) =>{
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      )
    }
    this.resultCrossApp.splice(idx, 1);
  }
}
