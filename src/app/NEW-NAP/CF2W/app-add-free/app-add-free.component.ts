import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, CheckboxControlValueAccessor } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-app-add-free',
  templateUrl: './app-add-free.component.html',
  providers: [NGXToastrService]
})
export class AppAddFreeComponent implements OnInit {

  param;
  ProductOfferingIdentifier;
  ProductOfferingNameIdentifier;
  LobCode;
  
  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService
  ) { 
      this.route.queryParams.subscribe(params => {
      if (params["LobCode"] != null) {
        this.LobCode = params["LobCode"];
      }
     });
  }

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
  inputLookupObjName;
  officeItems;
  user;
  ngOnInit() {
    // Lookup Obj
    this.user = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    this.MakeLookUpObj();

    this.GetOfficeDDL();

    if (this.user.MrOfficeTypeCode == CommonConstant.HeadOffice) {
      this.NapAppForm.controls.OriOfficeCode.disable();
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    } else if (this.user.MrOfficeTypeCode == CommonConstant.CENTER_GROUP_CODE) {
      this.NapAppForm.patchValue({
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }

    // Test Data

  }

  arrAddCrit;
  MakeLookUpObj(){
    this.inputLookupObjCopyProduct = new InputLookupObj();
    this.inputLookupObjCopyProduct.urlJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObjCopyProduct.urlEnviPaging = environment.losUrl;
    this.inputLookupObjCopyProduct.pagingJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.genericJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.isRequired = false;
    
    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlQryPaging = URLConstant.GetPagingObjectBySQL;
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
  }

  GetOfficeDDL() {
    // Office DDL
    var obj = {
      RowVersion: ""
    };
    var url = environment.FoundationR3Url + URLConstant.GetListKvpActiveRefOffice;
    this.http.post(url, obj).subscribe(
      (response) => {
        this.officeItems = response[CommonConstant.ReturnObj];
        this.NapAppForm.patchValue({
          OriOfficeCode: this.officeItems[0].Key,
          OriOfficeName: this.officeItems[0].Value,
        });
      });
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
    napAppObj.AppStat = CommonConstant.AppStepNew;
    napAppObj.AppCurrStep = CommonConstant.AppStepNew;

    napAppObj = this.CheckValue(napAppObj);
    if (this.user.MrOfficeTypeCode == CommonConstant.HeadOffice) {
      napAppObj.OriOfficeCode = this.user.OfficeCode;
    } else if (this.user.MrOfficeTypeCode == CommonConstant.CenterGroup) {

    }

    var url = URLConstant.AddApp;
    this.http.post(url, napAppObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CF2W_ADD_DETAIL], { "AppId": response["AppId"], "LobCode": this.LobCode });
      });

  }

  getLookupAppResponseCopy(ev: any) {
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
      NumOfAsset: "1",
      PayFreqCode: ev.PayFreqCode,
      MrFirstInstTypeCode: ev.MrFirstInstTypeCode,
      MrAppSourceCode: ev.MrAppSourceCode,
      MrWopCode: ev.MrWopCode,
      MrCustNotifyOptCode: ev.MrCustNotifyOptCode,
      SalesOfficerNo: ev.SalesOfficerNo
    });
    this.inputLookupObjName.nameSelect = ev.ProdOfferingName;
  }

  getLookupAppResponseName(ev: any) {
    var url = environment.FoundationR3Url + URLConstant.GetListProdOfferingDByProdOfferingCode;
    var obj = {
      ProdOfferingCode: ev.ProdOfferingCode
    };
    var tempLobCode;
    var tempCurrCode;
    var tempPayFreqCode;
    var tempRefProdTypeCode;
    this.http.post(url,obj).subscribe(
      (response) => {
        var temp = response[CommonConstant.ReturnObj];
        for(var i=0;i<temp.length;i++){
          if(temp[i].RefProdCompntCode == CommonConstant.RefProdCompntLob){
            tempLobCode = temp[i].CompntValue;
          }else if(temp[i].RefProdCompntCode == CommonConstant.RefProdCompntCurr){
            tempCurrCode = temp[i].CompntValue;
          }else if(temp[i].RefProdCompntCode == CommonConstant.RefProdCompntPayFreq){
            tempPayFreqCode = temp[i].CompntValue;
          }else if(temp[i].RefProdCompntCode == CommonConstant.RefProdCompntProdType){
            tempRefProdTypeCode = temp[i].CompntValue;
          }else{
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
      });
  }

  ChangeValueOffice(ev: any) {
    this.NapAppForm.patchValue({
      OriOfficeCode: ev.target.selectedOptions[0].value,
      OriOfficeName: ev.target.selectedOptions[0].text
    });
  }

}
