import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, CheckboxControlValueAccessor } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';

@Component({
  selector: 'app-app-add-fixed',
  templateUrl: './app-add-fixed.component.html',
  providers: [NGXToastrService]
})
export class AppAddFixedComponent implements OnInit {

  param;
  ProductOfferingIdentifier;
  ProductOfferingNameIdentifier;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService
  ) { }

  NapAppForm = this.fb.group({
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
    Tenor: 0,
    NumOfInst: 0,
    PayFreqCode: [''],
    MrFirstInstTypeCode: "test",
    NumOfAsset: 1,
    MrLcCalcMethodCode: [''],
    LcInstRatePrml: [''],
    LcInsRatePrml: [''],
    MrAppSourceCode: "test",
    MrWopCode: "test",
    SrvyOrderNo: [''],
    ApvDt: [''],
    SalesHeadNo: [''],
    SalesNotes: [''],
    SalesOfficerNo: "test",
    CreditAdminNo: [''],
    CreditAnalystNo: [''],
    CreditRiskNo: [''],
    DataEntryNo: [''],
    MrSalesRecommendCode: [''],
    MrCustNotifyOptCode: "test",
    PreviousAppId: [''],
    IsAppInitDone: [''],
    MrOrderInfoCode: [''],
    ApprovalStat: [''],
    RsvField1: [''],
    RsvField2: [''],
    RsvField3: [''],
    RsvField4: [''],
    RsvField5: ['']
  });

  inputLookupObjCopyProduct;
  InputLookupAssetObj;
  inputLookupObjName;
  inputLookupSupplierObj;
  officeItems;
  user;

  ngOnInit() {
    // Lookup Obj
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    this.MakeLookUpObj();

    this.GetOfficeDDL();

    if (this.user.MrOfficeTypeCode == "HO") {
      this.NapAppForm.controls.OriOfficeCode.disable();
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    } else if (this.user.MrOfficeTypeCode == "Center Group") {
      this.NapAppForm.patchValue({
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }

    // Test Data
    console.log(this.user);
    console.log(this.NapAppForm);

  }

  refOfficeObj;
  returnRefOfficeObj;
  arrAddCrit;
  critSupplier;
  MakeLookUpObj(){
    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    this.inputLookupObjCopyProduct = new InputLookupObj();
    this.inputLookupObjCopyProduct.urlJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObjCopyProduct.urlEnviPaging = environment.losUrl;
    this.inputLookupObjCopyProduct.pagingJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.genericJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.isRequired = false;
    
    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObjName.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObjName.pagingJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.genericJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.nameSelect = this.NapAppForm.controls.ProdOfferingName.value;
    
    this.arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE ";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.MrOfficeTypeCode];
    this.arrAddCrit.push(addCrit);
    this.inputLookupObjName.addCritInput = this.arrAddCrit;

    this.inputLookupSupplierObj = new InputLookupObj();
    this.inputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplierBranch.json";
    this.inputLookupSupplierObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplierBranch.json";
    this.inputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplierBranch.json";

    this.refOfficeObj = new RefOfficeObj();
    this.http.post(AdInsConstant.GetListKvpActiveRefOfficeIdForPaging, this.refOfficeObj).subscribe(
      (response) => {
        this.returnRefOfficeObj = response["ReturnObject"];
      }
    );

    // this.critSupplier = new Array();
    // var addCritSupp = new CriteriaObj();
    // addCritSupp.DataType = "text";
    // addCritSupp.propName = "VOM.REF_OFFICE_ID";
    // addCritSupp.restriction = AdInsConstant.RestrictionIn;
    // addCritSupp.listValue = [this.user.MrOfficeTypeCode];
    // this.critSupplier.push(addCritSupp);
    // this.inputLookupSupplierObj.addCritInput = this.critSupplier;
  }

  GetOfficeDDL() {
    // Office DDL
    var obj = {
      RowVersion: ""
    };
    var url = environment.FoundationR3Url + AdInsConstant.GetListKvpActiveRefOffice;
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        this.officeItems = response["ReturnObject"];
        this.NapAppForm.patchValue({
          OriOfficeCode: this.officeItems[0].Key,
          OriOfficeName: this.officeItems[0].Value,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  CheckValue(obj){
    if(obj.MrWopCode == null){
      obj.MrWopCode = "";
    }
    if(obj.SalesOfficerNo == null){
      obj.SalesOfficerNo = "";
    }
    if(obj.MrAppSourceCode == null){
      obj.MrAppSourceCode = "";
    }
    if(obj.MrCustNotifyOptCode == null){
      obj.MrCustNotifyOptCode = "";
    }
    if(obj.MrFirstInstTypeCode == null){
      obj.MrFirstInstTypeCode = "";
    }

    return obj;
  }

  SaveForm() {
    // this.router.navigate(["Nap/AppAddDetail"], { queryParams: { "AppId": response["AppId"] } });
    var napAppObj = new NapAppModel();
    napAppObj = this.NapAppForm.value;
    napAppObj.AppCreatedDt = this.user.BusinessDt;
    napAppObj.IsAppInitDone = false;
    napAppObj.AppStat = AdInsConstant.AppStepNew;
    napAppObj.AppCurrStep = AdInsConstant.AppStepNew;

    napAppObj = this.CheckValue(napAppObj);
    if (this.user.MrOfficeTypeCode == "HO") {
      napAppObj.OriOfficeCode = this.user.OfficeCode;
    } else if (this.user.MrOfficeTypeCode == "Center Group") {

    }
    console.log(napAppObj);

    var url = environment.losUrl + AdInsConstant.AddApp;
    this.http.post(url, napAppObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        //this.router.navigate(["Nap/ConsumerFinance/InputNap/Add/Detail"], { queryParams: { "AppId": response["AppId"] } });
      },
      (error) => {
        console.log(error);
      }
    );

  }

  SetAsset(event) {
    this.NapAppForm.patchValue({
    //   FullAssetCode: event.FullAssetCode,
    //   FullAssetName: event.FullAssetName
    });
  }

  getLookupAppResponseCopy(ev: any) {
    // console.log(ev);
    this.NapAppForm.patchValue({
      ProdOfferingCode: ev.ProdOfferingCode,
      ProdOfferingName: ev.ProdOfferingName,
      ProdOfferingVersion: ev.ProdOfferingVersion,
      AppNo: ev.AppNo,
      MouCustId: ev.MouCustId,
      LeadId: ev.LeadId,
      CurrCode: ev.CurrCode,
      LobCode: ev.LobCode,
      RefProdTypeCode: ev.RefProdTypeCode,
      Tenor: ev.Tenor,
      NumOfInst: ev.NumOfInst,
      NumOfAsset: ev.NumOfAsset,
      PayFreqCode: ev.PayFreqCode,
      MrFirstInstTypeCode: ev.MrFirstInstTypeCode,
      MrAppSourceCode: ev.MrAppSourceCode,
      MrWopCode: ev.MrWopCode,
      MrCustNotifyOptCode: ev.MrCustNotifyOptCode,
      SalesOfficerNo: ev.SalesOfficerNo
    });
    console.log(this.NapAppForm);
    this.inputLookupObjName.nameSelect = ev.ProdOfferingName;
  }

  getLookupAppResponseName(ev: any) {
    console.log(ev);
    var url = environment.FoundationR3Url + AdInsConstant.GetListProdOfferingDByProdOfferingCode;
    var obj = {
      ProdOfferingCode: ev.ProdOfferingCode
    };
    var tempLobCode;
    var tempCurrCode;
    var tempPayFreqCode;
    var tempRefProdTypeCode;
    this.http.post(url,obj).subscribe(
      (response) => {
        // console.log(response);
        var temp = response["ReturnObject"];
        for(var i=0;i<temp.length;i++){
          if(temp[i].RefProdCompntCode == "LOB"){
            tempLobCode = temp[i].CompntValue;
          }else if(temp[i].RefProdCompntCode == "CURR"){
            tempCurrCode = temp[i].CompntValue;
          }else if(temp[i].RefProdCompntCode == "PAYFREQ"){
            tempPayFreqCode = temp[i].CompntValue;
          }else if(temp[i].RefProdCompntCode == "PROD_TYPE"){
            tempRefProdTypeCode = temp[i].CompntValue;
          }else{
            console.log("Not");
          }
        }
        this.NapAppForm.patchValue({
          ProdOfferingCode: ev.ProdOfferingCode,
          ProdOfferingName: ev.ProdOfferingName,
          ProdOfferingVersion: ev.ProdOfferingVersion,
          CurrCode: tempCurrCode,
          LobCode: tempLobCode,
          PayFreqCode: tempPayFreqCode,
          RefProdTypeCode: tempRefProdTypeCode
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ChangeValueOffice(ev: any) {
    // console.log(ev);
    this.NapAppForm.patchValue({
      OriOfficeCode: ev.target.selectedOptions[0].value,
      OriOfficeName: ev.target.selectedOptions[0].text
    });
    // console.log(this.NapAppForm);
  }

}
