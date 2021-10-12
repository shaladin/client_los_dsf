import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AppObj } from 'app/shared/model/App/App.Model';
import { environment } from 'environments/environment';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';

@Component({
  selector: 'cessie-sharing-pre-go-live',
  templateUrl: './pre-go-live.component.html'
})
export class CessiePreGoLiveComponent implements OnInit {

  result: AgrmntObj;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  appTC: AppTCObj;
  TaskListId: any;
  ReqByIdObj: GenericObj = new GenericObj();
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  IsCheckedAll: boolean = false;

  FormObj = this.fb.group({

  });

  listAppTCObj: ListAppTCObj;
  ListAppTCObj: ListAppTCObj;

  businessDt: any;

  CessieHXId: number;
  CessieNo: string;
  ApvAmt: number = 0;
  AppObj: AppObj;
  isReadyToLoadTC: boolean;

  readonly CancelLink: string = NavigationConstant.CESSIE_PGL_PAGING;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.CessieHXId = params["CessieHXId"];
      this.CessieNo = params["CessieNo"];
      this.TaskListId = params["TaskListId"];
    });
  }

  async ngOnInit(): Promise<void> {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCessieMainInfoPreGoLive.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl + '/v1';
    var Obj = { Id: this.CessieHXId };
    await this.http.post(URLConstantX.GetApvAmount, Obj).toPromise().then(
      (response) => {
        this.ApvAmt = response["ApvAmt"];
      });

    await this.http.post(URLConstantX.GetListApp, Obj).toPromise().then(
      (response) => {
        this.AppObj = response[CommonConstant.ReturnObj][0];
        this.isReadyToLoadTC = true;
      });


    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, {Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
      });


    this.businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    // this.claimTaskService.ClaimTask(this.TaskListId);  
    if (environment.isCore) {
      if (this.TaskListId != "" && this.TaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.TaskListId);
      }
    }
    else if (this.TaskListId > 0) {
      this.claimTaskService.ClaimTask(this.TaskListId);
    }


    await this.BindDDLReason();
    await this.initInputApprovalObj();
    await this.InitDms();
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
    else if (ev.Key == "customer") {
      var custObj = {
        CustNo: ev.ViewObj.CustNo
      };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        (response) => {
          if (response['MrCustTypeCode'] == CommonConstant.CustTypePersonal) {
            AdInsHelper.OpenCustomerViewByCustId(response['CustId']);
          } else if (response['MrCustTypeCode'] == CommonConstant.CustTypeCompany) {
            AdInsHelper.OpenCustomerCoyViewByCustId(response['CustId']);
          }
        }
      )
    }
    else if (ev.Key == "mou") {
      AdInsHelper.OpenMOUCustViewByMouCustId(ev.ViewObj.MouCustId);
    }
  }

  ReceiveIsChecked(ev) {
    console.log(ev);
    this.IsCheckedAll = ev;
  }

  RFAInfo: Object = new Object();
  SaveForm(flag = true) {
    if (!this.IsCheckedAll) {
      this.toastr.warningMessage("Please Complete All Required Document");
      return;
    }

    this.RFAInfo = { RFAInfo: this.FormObj.controls.RFAInfo.value };

    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));

    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    for (var i = 0; i < this.FormObj.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.FormObj.value.TCList[i].AppId;
      this.appTC.AppTcId = this.FormObj.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.FormObj.value.TCList[i].TcCode;
      this.appTC.TcName = this.FormObj.value.TCList[i].TcName;
      this.appTC.PriorTo = this.FormObj.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.FormObj.getRawValue().TCList[i].IsChecked;
      this.appTC.IsWaived = this.FormObj.getRawValue().TCList[i].IsWaived;
      this.appTC.ExpiredDt = this.FormObj.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.FormObj.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.FormObj.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.FormObj.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.FormObj.value.TCList[i].Notes;
      this.appTC.RowVersion = this.FormObj.value.TCList[i].RowVersion;

      var prmsDt = new Date(this.appTC.PromisedDt);
      var prmsDtForm = this.FormObj.value.TCList[i].PromisedDt;

      if (this.appTC.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + this.appTC.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    var reqObj = {
      TaskListId: this.TaskListId,
      rAppTcObj: this.listAppTCObj.AppTCObj,
      CessieHXId: this.CessieHXId,
      RequestRFAObj: this.RFAInfo
    };

    this.http.post(URLConstantX.SubmitPreGoLiveCessieV2, reqObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [this.CancelLink], {});
        this.toastr.successMessage(response['message']);

      });

  }

  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  DDLReason: any;
  IsReady: Boolean = false;
  async initInputApprovalObj() {
    var Attributes = [];
    var attribute1 = {
      "AttributeName": "Approval Amount",
      "AttributeValue": this.ApvAmt
    };

    Attributes.push(attribute1);

    var TypeCode = {
      TypeCode: CommonConstantX.CESSIE_PRE_GLV_APV_TYPE,
      Attributes: Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstantX.CESSIE_PRE_GPV_APV_CATEGORY;
    this.InputObj.SchemeCode = CommonConstantX.SCHM_CODE_CESSIE_PGLV_APV;
    this.InputObj.Reason = this.DDLReason;
    this.InputObj.TrxNo = this.CessieNo
    this.IsReady = true;
  }

  async BindDDLReason() {
    var Obj = { RefReasonTypeCode: CommonConstantX.RefReasonTypeCodeCessiePreGoLive };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLReason = response[CommonConstant.ReturnObj];
      });
  }

  isDmsReady: boolean = false;
  dmsObj: DMSObj;
  mouCustNo: string;
  initDmsObj: any;
  async InitDms() {
    await this.http.post(URLConstantX.GetInitForDmsDataByCessieHXId, { Id: this.CessieHXId }).toPromise().then(
      (response) => {
        this.initDmsObj = response;
      });
    console.log(this.initDmsObj);
    if (this.SysConfigResultObj.ConfigValue == '1' && this.initDmsObj.AppNo != '' && this.initDmsObj.AgrmntNo != '') {
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;


      if (this.initDmsObj.CustNo != '') {
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.initDmsObj.CustNo));
      }
      this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.initDmsObj.AppNo));
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.initDmsObj.AgrmntNo));

      this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
      this.isDmsReady = true;
    }
  }
}
