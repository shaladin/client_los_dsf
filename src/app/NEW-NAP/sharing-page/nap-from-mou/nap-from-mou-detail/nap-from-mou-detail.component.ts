import { Component, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-nap-from-mou-detail',
  templateUrl: './nap-from-mou-detail.component.html',
  styleUrls: ['./nap-from-mou-detail.component.scss']
})
export class NapFromMouDetailComponent implements OnInit {
  param;
  ProductOfferingIdentifier;
  ProductOfferingNameIdentifier;
  MouCustId: number;
  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];
    })
  }

  NapAppForm = this.fb.group({
    MouCustId: [''],
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

  inputLookupObjCopyProduct;
  inputLookupObjName;
  officeItems;
  user;

  MouCustObj: MouCustObj;
  bizTemplateCode: string;

  async ngOnInit(): Promise<void> {
    console.log("nap from mou")
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.bizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);

    this.MakeLookUpObj();
    await this.GetLead();
    this.NapAppForm.patchValue({
      CrtOfficeCode: this.user.OfficeCode,
      CrtOfficeName: this.user.OfficeName
    });
  }

  openView() {
    AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
  }

  arrAddCrit;
  MakeLookUpObj() {
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
    addCrit.listValue = [this.user.OfficeCode];
    this.arrAddCrit.push(addCrit);

    var addCritBizTemplate = new CriteriaObj();
    addCritBizTemplate.DataType = "text";
    addCritBizTemplate.propName = "rlob.BIZ_TMPLT_CODE";
    addCritBizTemplate.restriction = AdInsConstant.RestrictionEq;
    addCritBizTemplate.value = CommonConstant.FCTR; //this.bizTemplateCode;
    this.arrAddCrit.push(addCritBizTemplate);

    this.inputLookupObjName.addCritInput = this.arrAddCrit;
  }

  async GetLead() {
    await this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).toPromise().then(
      (response) => {
        this.MouCustObj = response as MouCustObj;
        this.NapAppForm.patchValue({
          OriOfficeCode: CommonConstant.HeadOffice,
          OriOfficeName: CommonConstant.HeadOfficeName,
          MouCustId: this.MouCustObj.MouCustId,
          MouCustNo: this.MouCustObj.MouCustNo
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
    napAppObj.BizTemplateCode = CommonConstant.FCTR; //this.bizTemplateCode;
    napAppObj.LobCode = this.NapAppForm.controls.LobCode.value;
    napAppObj.OriOfficeCode = this.NapAppForm.controls['OriOfficeCode'].value;
    napAppObj.OriOfficeName = this.NapAppForm.controls['OriOfficeName'].value;
    napAppObj = this.CheckValue(napAppObj);
    this.http.post<GenericObj>(URLConstant.AddAppFromMou, napAppObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_FCTR_ADD_DETAIL], { "AppId": response.Id });
      });

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
          LobCode: tempLobCode,
          PayFreqCode: tempPayFreqCode,
          RefProdTypeCode: tempRefProdTypeCode
        });
      });
  }
}
