import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
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
import { LeadObj } from 'app/shared/model/Lead.Model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { RefLobObj } from 'app/shared/model/RefLobObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-nap-from-simple-lead-detail',
  templateUrl: './nap-from-simple-lead-detail.component.html',
  styles: []
})
export class NapFromSimpleLeadDetailComponent implements OnInit {

  @ViewChild("ProdOfr", { read: ViewContainerRef }) private prodOfrLookup: ViewContainerRef;
  @ViewChild("enjiForm") private parentForm: NgForm;
  ProductOfferingNameIdentifier;
  leadId: number;
  listRefLob: Array<RefMasterObj>;
  listRefLobObj: Array<RefLobObj>;
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
    LobCode: ['', [Validators.required]],
    LobName: [''],
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
    RsvField5: [''],
  });

  inputLookupObjCopyProduct;
  inputLookupObjName;
  officeItems;
  user: CurrentUserContext;

  leadObj: LeadObj;
  bizTemplateCode: string;
  refMasterObj: RefMasterObj;
  getListActiveLob: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      this.leadId = params["LeadId"];
    });
  }

  async ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.bizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);

    let listhttpPost = new Array<any>();
    listhttpPost.push(this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodeLob }));
    listhttpPost.push(this.http.post(URLConstant.GetListRefLob, {}));

    await forkJoin(listhttpPost).toPromise().then(
      (response) => {
        this.listRefLob = response[0][CommonConstant.RefMasterObjs];
        this.listRefLobObj = response[1][CommonConstant.ReturnObj];
      }
    )
    this.MakeLookUpObj();
    await this.GetLead();
    this.NapAppForm.patchValue({
      CrtOfficeCode: this.user.OfficeCode,
      CrtOfficeName: this.user.OfficeName,
    });
    this.LobChanged();
  }

  LobChanged() {
    let refLob = this.listRefLobObj.find((x) => x.LobCode == this.NapAppForm.controls["LobCode"].value);
    if (refLob == undefined) {
      this.bizTemplateCode = null;
    } else {
      this.bizTemplateCode = refLob.BlCode;
    }
    this.arrAddCrit = new Array();

    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.OfficeCode];
    this.arrAddCrit.push(addCrit);

    var addCritBizTemplate = new CriteriaObj();
    addCritBizTemplate.DataType = "text";
    addCritBizTemplate.propName = "rlob.BIZ_TMPLT_CODE";
    addCritBizTemplate.restriction = AdInsConstant.RestrictionEq;
    addCritBizTemplate.value = this.bizTemplateCode;
    this.arrAddCrit.push(addCritBizTemplate);

    this.inputLookupObjName.addCritInput = this.arrAddCrit;

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
    this.prodOfrLookup.clear();
    const component = this.prodOfrLookup.createComponent(componentFactory);
    component.instance.lookupInput = this.inputLookupObjName;
    component.instance.parentForm = this.NapAppForm;
    component.instance.enjiForm = this.parentForm;
    component.instance.identifier = "ProductOfferingNameIdentifier";
    component.instance.lookup.subscribe((e) => { this.getLookupAppResponseName(e) });
  }

  openView() {
    window.open(environment.losR3Web + "/View/Lead?LeadId=" + this.leadId, "_blank");
  }

  arrAddCrit;
  MakeLookUpObj() {
    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObjName.urlEnviPaging = environment.losUrl;
    this.inputLookupObjName.pagingJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.genericJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.nameSelect = this.NapAppForm.controls.ProdOfferingName.value;

    this.arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.OfficeCode];
    this.arrAddCrit.push(addCrit);

    this.inputLookupObjName.addCritInput = this.arrAddCrit;
  }

  async GetLead() {

    await this.http.post(URLConstant.GetLeadByLeadId, { Id: this.leadId }).toPromise().then(
      (response) => {
        this.leadObj = response as LeadObj;
        this.NapAppForm.patchValue({
          OriOfficeCode: this.leadObj.OriOfficeCode,
          OriOfficeName: this.leadObj.OriOfficeName,
          LobCode: this.leadObj.LobCode,
          LeadId: this.leadObj.LeadId
        });
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
    var napAppObj = new NapAppModel();
    napAppObj = this.NapAppForm.value;
    napAppObj.AppCreatedDt = this.user.BusinessDt;
    napAppObj.IsAppInitDone = false;
    napAppObj.AppStat = CommonConstant.AppStepNew;
    napAppObj.AppCurrStep = CommonConstant.AppStepNew;
    napAppObj.BizTemplateCode = this.bizTemplateCode;
    napAppObj.LobCode = this.NapAppForm.controls.LobCode.value;
    napAppObj.OriOfficeCode = this.NapAppForm.controls['OriOfficeCode'].value;
    napAppObj.OriOfficeName = this.NapAppForm.controls['OriOfficeName'].value;
    napAppObj = this.CheckValue(napAppObj);
    this.http.post(URLConstant.AddAppFromSimpleLead, napAppObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        if (this.bizTemplateCode == CommonConstant.CF4W) {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CF4W_NAP1], { "AppId": response["AppId"], "from": "SMPLLEAD" });
        }
        if (this.bizTemplateCode == CommonConstant.FL4W) {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FL4W_NAP1], { "AppId": response["AppId"], "from": "SMPLLEAD" });
        }
        if (this.bizTemplateCode == CommonConstant.CFRFN4W) {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFRFN4W_NAP1], { "AppId": response["AppId"], "from": "SMPLLEAD" });
        }
        if (this.bizTemplateCode == CommonConstant.FCTR) {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_NAP1], { "AppId": response["AppId"], "from": "SMPLLEAD" });
        }
        if (this.bizTemplateCode == CommonConstant.CFNA) {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFNA_NAP1], { "AppId": response["AppId"], "from": "SMPLLEAD" });
        }
      });

  }

  test() {
    var napAppObj = new NapAppModel();
    napAppObj = this.NapAppForm.value;
    napAppObj.AppCreatedDt = this.user.BusinessDt;
    napAppObj.IsAppInitDone = false;
    napAppObj.AppStat = CommonConstant.AppStepNew;
    napAppObj.AppCurrStep = CommonConstant.AppStepNew;

    napAppObj = this.CheckValue(napAppObj);
  }

  getLookupAppResponseName(ev: any) {
    var obj = {
      ProdOfferingCode: ev.ProdOfferingCode,
      ProdOfferingVersion: ev.ProdOfferingVersion,
    };
    var tempLobCode;
    var tempCurrCode;
    var tempPayFreqCode;
    var tempRefProdTypeCode;
    this.http.post(URLConstant.GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion, obj).subscribe(
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
        this.NapAppForm.patchValue({
          ProdOfferingCode: ev.ProdOfferingCode,
          ProdOfferingName: ev.ProdOfferingName,
          ProdOfferingVersion: ev.ProdOfferingVersion,
          CurrCode: tempCurrCode,
          PayFreqCode: tempPayFreqCode,
          RefProdTypeCode: tempRefProdTypeCode
        });
      });
  }
}
