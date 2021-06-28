import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefLobObj } from 'app/shared/model/RefLobObj.Model';
import { ReqAddNapFromCopyObj } from 'app/shared/model/Request/NAP/NewApplication/ReqAddNapObj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-copy-can-app-multi-bl-detail',
  templateUrl: './copy-can-app-multi-bl-detail.component.html',
  styleUrls: ['./copy-can-app-multi-bl-detail.component.css']
})
export class CopyCanAppMultiBlDetailComponent implements OnInit {
  @ViewChild('LookupOffering') ucLookupOffering: UclookupgenericComponent;
  //@ViewChild('LookupCopyProduct') ucLookupCopyProduct: UclookupgenericComponent;
  //inputLookupObjCopyProduct: InputLookupObj = new InputLookupObj();
  inputLookupObjName: InputLookupObj = new InputLookupObj();
  officeItems: Array<KeyValueObj> = new Array<KeyValueObj>();
  userAccess: CurrentUserContext;

  refLobObj: RefLobObj;
  listRefLob: Array<KeyValueObj>;
  CurrCode: string;
  AppNo: string;
  AppId: number;
  LobCode: string;
  BizTemplateCode: string;

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
    MrFirstInstTypeCode: "",
    NumOfAsset: 0,
    MrLcCalcMethodCode: [''],
    LcInstRatePrml: [''],
    LcInsRatePrml: [''],
    MrAppSourceCode: "",
    MrWopCode: "",
    SrvyOrderNo: [''],
    ApvDt: [''],
    SalesHeadNo: [''],
    SalesNotes: [''],
    SalesOfficerNo: "",
    CreditAdminNo: [''],
    CreditAnalystNo: [''],
    CreditRiskNo: [''],
    DataEntryNo: [''],
    MrSalesRecommendCode: [''],
    MrCustNotifyOptCode: "",
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

  constructor(private fb: FormBuilder, private router: Router,
    private http: HttpClient, private toastr: NGXToastrService, private route: ActivatedRoute, private cookieService: CookieService) {

    this.route.queryParams.subscribe(params => {
      this.AppNo = params["AppNo"];
      this.CurrCode = params["CurrCode"];
      this.AppId = params["AppId"];
      console.log(params);
    })

  }

  isCopyData: boolean = false;
  ngOnInit() {
    // Lookup Obj
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.http.post(URLConstant.GetRefOfficeByOfficeCode, { Code: this.userAccess.OfficeCode }).subscribe(
      (response) => {
        if (response["IsAllowAppCreated"] == true) {
        } else {
          AdInsHelper.RedirectUnauthorized(this.router);
        }
      });

    this.MakeLookUpObj();
    this.GetOfficeDDL();
    this.GetLOBDDL();

    if (this.userAccess.MrOfficeTypeCode == CommonConstant.CENTER_GROUP_CODE) {
      this.NapAppForm.patchValue({
        CrtOfficeCode: this.userAccess.OfficeCode,
        CrtOfficeName: this.userAccess.OfficeName,
      });
    }
    else {
      this.NapAppForm.controls.OriOfficeCode.disable();
      this.NapAppForm.patchValue({
        OriOfficeCode: this.userAccess.OfficeCode,
        OriOfficeName: this.userAccess.OfficeName,
        CrtOfficeCode: this.userAccess.OfficeCode,
        CrtOfficeName: this.userAccess.OfficeName,
      });
    }

    // Test Data
  }

  MakeLookUpObj() {
    // this.inputLookupObjCopyProduct = new InputLookupObj();
    // this.inputLookupObjCopyProduct.urlJson = "./assets/uclookup/NAP/lookupApp.json";
    // this.inputLookupObjCopyProduct.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    // this.inputLookupObjCopyProduct.urlEnviPaging = environment.losUrl;
    // this.inputLookupObjCopyProduct.pagingJson = "./assets/uclookup/NAP/lookupApp.json";
    // this.inputLookupObjCopyProduct.genericJson = "./assets/uclookup/NAP/lookupApp.json";
    // this.inputLookupObjCopyProduct.isRequired = false;

    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObjName.urlEnviPaging = environment.losUrl;
    this.inputLookupObjName.pagingJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.genericJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.nameSelect = this.NapAppForm.controls.ProdOfferingName.value;
    this.inputLookupObjName.isRequired = true;

    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "a.ORI_OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.userAccess.OfficeCode];
    arrCopyLookupCrit.push(addCrit);

    // var critObj = new CriteriaObj();
    // critObj.restriction = AdInsConstant.RestrictionEq;
    // critObj.propName = 'vrl.BIZ_TMPLT_CODE';
    // critObj.value = CommonConstant.CF4W;
    // arrCopyLookupCrit.push(critObj);
    // this.inputLookupObjCopyProduct.addCritInput = arrCopyLookupCrit;

    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.userAccess.OfficeCode];
    arrAddCrit.push(addCrit);

    // var addCritBizTempalte = new CriteriaObj();
    // addCritBizTempalte.DataType = "text";
    // addCritBizTempalte.propName = "rlob.BIZ_TMPLT_CODE";
    // addCritBizTempalte.restriction = AdInsConstant.RestrictionEq;
    // addCritBizTempalte.value = CommonConstant.CF4W;
    // arrAddCrit.push(addCritBizTempalte);

    this.inputLookupObjName.addCritInput = arrAddCrit;

    if (this.userAccess.MrOfficeTypeCode != "CG") {
      this.NapAppForm.patchValue({
        OriOfficeCode: this.userAccess.OfficeCode,
        OriOfficeName: this.userAccess.OfficeName,
      });
    }

  }

  GetLOBDDL() {

    this.http.post(URLConstant.GetListActiveLob, {}).subscribe(
      (response) => {
        this.listRefLob = response[CommonConstant.ReturnObj];
        console.log(this.listRefLob);
        for (let _Obj of this.listRefLob) {
          if (_Obj.Key === "FACTORING" || _Obj.Key === "DLRFNCNG")
            this.listRefLob = this.listRefLob.filter(obj => obj !== _Obj);
        }
        // this.NapAppForm.patchValue({
        //   LobCode: response[CommonConstant.ReturnObj][0]['Key'],
        //   LobName: response[CommonConstant.ReturnObj][0]['Value']
        // });
      });


  }

  GetOfficeDDL() {
    // Office DDL
    this.http.post(URLConstant.GetListKvpActiveRefOfficeForPaging, {}).subscribe(
      (response) => {
        this.officeItems = response[CommonConstant.ReturnObj];
      });
  }

  CheckValue(obj) {
    if (obj.MrWopCode == null) {
      obj.MrWopCode = "";
    }
    if (obj.SalesOfficerNo == null) {
      obj.SalesOfficerNo = "";
    }
    if (obj.MrAppSourceCode == null) {
      obj.MrAppSourceCode = "";
    }
    if (obj.MrCustNotifyOptCode == null) {
      obj.MrCustNotifyOptCode = "";
    }
    if (obj.MrFirstInstTypeCode == null) {
      obj.MrFirstInstTypeCode = "";
    }

    return obj;
  }

  testData() {
    this.getFormValidationErrors();
  }

  getFormValidationErrors() {
    const invalid = [];
    const controls = this.NapAppForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
  }

  SaveForm() {

    this.NapAppForm.patchValue({
      AppNo: this.AppNo
    });

    let reqAddApp: ReqAddNapFromCopyObj = new ReqAddNapFromCopyObj();
    reqAddApp.AppNo = this.NapAppForm.controls['AppNo'].value;
    reqAddApp.OriOfficeCode = this.NapAppForm.controls['OriOfficeCode'].value;

    this.http.post(URLConstant.AddAppFromCopyCancledApp, reqAddApp).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate([NavigationConstant.NAP_ADD_PRCS_COPY_CANCEL_APP_CROSS_BL], { queryParams: { "IsNapVersionMainData": true } });
      });
  }

  getLookupAppResponseCopy(ev) {
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
    this.NapAppForm.get("ProductOfferingNameIdentifier").patchValue({
      value: ev.ProdOfferingName
    });
    // this.inputLookupObjName.nameSelect = ev.ProdOfferingName;
    this.inputLookupObjName.isRequired = false;
    this.isCopyData = true;
  }

  getLookupAppResponseName(ev) {
    var tempLobCode;
    var tempCurrCode;
    var tempPayFreqCode;
    var tempRefProdTypeCode;
    var ProdOfferingObj = {
      ProdOfferingCode: ev.ProdOfferingCode,
      ProdOfferingVersion: ev.ProdOfferingVersion
    };
    this.http.post(URLConstant.GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion, ProdOfferingObj).subscribe(
      (response) => {
        var temp = response["ListProdOfferingDObj"];
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntLob) {
            tempLobCode = temp[i].CompntValue;
          } else if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntCurr) {
            tempCurrCode = temp[i].CompntValue;
          } else if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntPayFreq) {
            var listPayFreqCode = temp[i].CompntValue.split(";");
            if (listPayFreqCode.length == 1) {
              tempPayFreqCode = temp[i].CompntValue;
            } else {
              tempPayFreqCode = null;
            }
          } else if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntProdType) {
            tempRefProdTypeCode = temp[i].CompntValue;
          } else {
          }
        }
        this.BizTemplateCode = ev.BusinessTemplate;
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

  ChangeValueOffice(ev) {
    this.NapAppForm.patchValue({
      OriOfficeCode: ev.target.selectedOptions[0].value,
      OriOfficeName: ev.target.selectedOptions[0].text
    });

    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "a.ORI_OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [ev.target.selectedOptions[0].value];
    arrCopyLookupCrit.push(addCrit);

    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [ev.target.selectedOptions[0].value];
    arrAddCrit.push(addCrit);

    this.inputLookupObjName.addCritInput = arrAddCrit;
    this.ucLookupOffering.setAddCritInput();
  }

  LobChanged(event) {

    this.LobCode = this.listRefLob.find(x => x.Key == event.target.value).Key;

    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.userAccess.OfficeCode];
    arrAddCrit.push(addCrit);

    var addCritBizTempalte = new CriteriaObj();
    addCritBizTempalte.DataType = "text";
    addCritBizTempalte.propName = "pod.COMPNT_VALUE";
    addCritBizTempalte.restriction = AdInsConstant.RestrictionEq;
    addCritBizTempalte.value = this.LobCode;
    arrAddCrit.push(addCritBizTempalte);
    this.inputLookupObjName.addCritInput = arrAddCrit;
    this.ucLookupOffering.setAddCritInput();
    this.inputLookupObjName.nameSelect = "";
    this.inputLookupObjName.jsonSelect = {};

  }

}
