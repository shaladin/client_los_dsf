import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ReqAddNapFromCopyObj, ReqAddNapObj } from 'app/shared/model/Request/NAP/NewApplication/ReqAddNapObj.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';

@Component({
  selector: 'app-nap-add',
  templateUrl: './nap-add.component.html'
})
export class NapAddComponent implements OnInit {
  @ViewChild('LookupOffering') ucLookupOffering: UclookupgenericComponent;
  @ViewChild('LookupCopyProduct') ucLookupCopyProduct: UclookupgenericComponent;
  inputLookupObjCopyProduct: InputLookupObj = new InputLookupObj();
  inputLookupObjName: InputLookupObj = new InputLookupObj();
  officeItems: Array<KeyValueObj> = new Array<KeyValueObj>();
  user: CurrentUserContext;

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
    NumOfAsset: 1,
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

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  constructor(private fb: FormBuilder, private router: Router,
    private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // Lookup Obj
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.MakeLookUpObj();
    this.GetOfficeDDL();

    if (this.user.MrOfficeTypeCode == "CG") {
      this.NapAppForm.patchValue({
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }
    else {
      this.NapAppForm.controls.OriOfficeCode.disable();
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }
  }

  MakeLookUpObj() {
    this.inputLookupObjCopyProduct = new InputLookupObj();
    this.inputLookupObjCopyProduct.urlJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.urlEnviPaging = environment.losUrl;
    this.inputLookupObjCopyProduct.pagingJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.genericJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.isRequired = false;

    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlEnviPaging = environment.losUrl;
    this.inputLookupObjName.pagingJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.genericJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.nameSelect = this.NapAppForm.controls.ProdOfferingName.value;

    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "a.ORI_OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.OfficeCode];
    arrCopyLookupCrit.push(addCrit);

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'vrl.BIZ_TMPLT_CODE';
    critObj.value = CommonConstant.CFRFN4W;
    arrCopyLookupCrit.push(critObj);
    this.inputLookupObjCopyProduct.addCritInput = arrCopyLookupCrit;

    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.OfficeCode];
    arrAddCrit.push(addCrit);

    var addCritBizTempalte = new CriteriaObj();
    addCritBizTempalte.DataType = "text";
    addCritBizTempalte.propName = "rlob.BIZ_TMPLT_CODE";
    addCritBizTempalte.restriction = AdInsConstant.RestrictionEq;
    addCritBizTempalte.value = CommonConstant.CFRFN4W;
    arrAddCrit.push(addCritBizTempalte);

    this.inputLookupObjName.addCritInput = arrAddCrit;

    if (this.user.MrOfficeTypeCode != "CG") {
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
      });
    }
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

  SaveForm() {
    let requestAddNapObj: Object = new Object();
    let AddNapUrl: string = "";
    let tempFormObj = this.NapAppForm.getRawValue();
    if (tempFormObj.AppNo == "") {
      let reqAddNapObj: ReqAddNapObj = new ReqAddNapObj();

      reqAddNapObj.OriOfficeCode = tempFormObj.OriOfficeCode;
      reqAddNapObj.OriOfficeName = tempFormObj.OriOfficeName;
      reqAddNapObj.CrtOfficeCode = tempFormObj.CrtOfficeCode;
      reqAddNapObj.CrtOfficeName = tempFormObj.CrtOfficeName;
      reqAddNapObj.ProdOfferingCode = tempFormObj.ProdOfferingCode;
      reqAddNapObj.ProdOfferingName = tempFormObj.ProdOfferingName;
      reqAddNapObj.ProdOfferingVersion = tempFormObj.ProdOfferingVersion;
      reqAddNapObj.CurrCode = tempFormObj.CurrCode;
      reqAddNapObj.LobCode = tempFormObj.LobCode;
      reqAddNapObj.RefProdTypeCode = tempFormObj.RefProdTypeCode;
      reqAddNapObj.PayFreqCode = tempFormObj.PayFreqCode;
      reqAddNapObj.BizTemplateCode = CommonConstant.CF4W;

      requestAddNapObj = reqAddNapObj;
      AddNapUrl = URLConstant.AddNewApplication;
    } else {

      let reqAddNapFromCopyObj: ReqAddNapFromCopyObj = new ReqAddNapFromCopyObj();

      reqAddNapFromCopyObj.AppNo = tempFormObj.AppNo;
      reqAddNapFromCopyObj.OriOfficeCode = tempFormObj.OriOfficeCode;

      requestAddNapObj = reqAddNapFromCopyObj;
      AddNapUrl = URLConstant.AddNewApplicationFromCopy;
    }

    this.http.post<GenericObj>(AddNapUrl, requestAddNapObj).subscribe(
      (response) => {
        setTimeout(() => { this.spinner.show(); }, 10);
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFRFN4W_ADD_DETAIL], { "AppId": response.Id });
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
      NumOfAsset: ev.NumOfAsset,
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
    var url = URLConstant.GetListProdOfferingDByProdOfferingCode;

    var tempLobCode;
    var tempCurrCode;
    var tempPayFreqCode;
    var tempRefProdTypeCode;
    this.http.post(url, { Code: ev.ProdOfferingCode }).subscribe(
      (response) => {
        var temp = response[CommonConstant.ReturnObj];
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].RefProdCompntCode == "LOB") {
            tempLobCode = temp[i].CompntValue;
          } else if (temp[i].RefProdCompntCode == "CURR") {
            tempCurrCode = temp[i].CompntValue;
          } else if (temp[i].RefProdCompntCode == "PAYFREQ") {
            var listPayFreqCode = temp[i].CompntValue.split(";");
            if (listPayFreqCode.length == 1) {
              tempPayFreqCode = temp[i].CompntValue;
            } else {
              tempPayFreqCode = null;
            }
          } else if (temp[i].RefProdCompntCode == "PROD_TYPE") {
            tempRefProdTypeCode = temp[i].CompntValue;
          } else {
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

    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "a.ORI_OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [ev.target.selectedOptions[0].value];
    arrCopyLookupCrit.push(addCrit);

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'vrl.BIZ_TMPLT_CODE';
    critObj.value = CommonConstant.CFRFN4W;
    arrCopyLookupCrit.push(critObj);

    this.inputLookupObjCopyProduct.addCritInput = arrCopyLookupCrit;
    this.ucLookupCopyProduct.setAddCritInput();

    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [ev.target.selectedOptions[0].value];
    arrAddCrit.push(addCrit);

    var addCritBizTempalte = new CriteriaObj();
    addCritBizTempalte.DataType = "text";
    addCritBizTempalte.propName = "rlob.BIZ_TMPLT_CODE";
    addCritBizTempalte.restriction = AdInsConstant.RestrictionEq;
    addCritBizTempalte.value = CommonConstant.CFRFN4W;
    arrAddCrit.push(addCritBizTempalte);

    this.inputLookupObjName.addCritInput = arrAddCrit;
    this.ucLookupOffering.setAddCritInput();
  }
}
