import { Component, OnInit } from '@angular/core';
import { AppObj } from 'app/shared/model/App/App.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { ResponseSysConfigResultObj } from 'app/shared/model/Response/ResponseSysConfigResultObj.Model';

@Component({
  selector: 'app-credit-approval-cfna-detail',
  templateUrl: './credit-approval-cfna-detail.component.html'
})
export class CreditApprovalCfnaDetailComponent implements OnInit {
  appId: number;
  mrCustTypeCode: string;
  viewObj: string;
  type: string;
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: string; };
  ManualDeviationData;
  isExistedManualDeviationData;
  BizTemplateCode: string;
  AppObj: AppObj;
  ApvReqId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  taskId: number;
  dmsObj: DMSObj;
  isDmsReady: boolean;
  appNo: any;
  custNo: any;
  IsUseDigitalization: string;
  IsViewReady: boolean = false;
  SysConfigResultObj: ResponseSysConfigResultObj = new ResponseSysConfigResultObj();

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
      if (params["MrCustTypeCode"] != null) {
        this.mrCustTypeCode = params["MrCustTypeCode"];
      }
      if (params["ApvReqId"] != null) {
        this.ApvReqId = params["ApvReqId"];
      }
      if (params["TaskId"] != null) {
        this.taskId = params["TaskId"];
      }
      var obj = {
        taskId: params["TaskId"],
        instanceId: params["InstanceId"],
        approvalBaseUrl: environment.ApprovalR3Url
      }
      this.inputObj = obj;

      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = obj.taskId

      this.HoldTask(ApvHoldObj);
    });
  }
  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.viewObj = "./assets/ucviewgeneric/viewCreditApprovalInfo.json";
    await this.getApp();
    await this.initInputApprovalObj();
    await this.InitDms();
    await this.GetIsUseDigitalization();
  }

  async InitDms() {
    await this.http.post<ResponseSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
    });
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      var appObj = { Id: this.appId };
  
      let getApp = await this.http.post(URLConstant.GetAppById, appObj)
      let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
      forkJoin([getApp, getAppCust]).subscribe(
        (response) => {
          this.appNo = response[0]['AppNo'];
          this.custNo = response[1]['CustNo'];
          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          }
          else {
            this.dmsObj.MetadataParent = null;
          }
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
          let mouCustId = response[0]['MouCustId'];
          if (mouCustId != null && mouCustId != '') {
            var mouObj = { Id: mouCustId };
            this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
              (response) => {
                let mouCustNo = response['MouCustNo'];
                this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, mouCustNo));
                this.isDmsReady = true;
              });
          }
          else {
            this.isDmsReady = true;
          }
        }
      );
    } 
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      }
    )
  }

  async getApp() {
    // var appObj = new AppObj();
    // appObj.AppId = this.appId
    var appObj = { Id: this.appId };
    await this.http.post<AppObj>(URLConstant.GetAppById, appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
      });
  }
  onAvailableNextTask() {

  }
  onApprovalSubmited(event) {
    if (event[0].ApvResult.toLowerCase() == CommonConstant.ApvResultReturn.toLowerCase()) {
      var returnHandlingHObj = new ReturnHandlingHObj();
      var user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      returnHandlingHObj.AppId = this.appId;
      returnHandlingHObj.AgrmntId = null;
      returnHandlingHObj.ReturnBy = user.UserName;
      returnHandlingHObj.ReturnDt = user.BusinessDt;
      returnHandlingHObj.ReturnNotes = event[0].notes;
      returnHandlingHObj.ReturnFromTrxType = this.AppObj.AppCurrStep;

      this.http.post(URLConstant.AddReturnHandlingH, returnHandlingHObj).subscribe(
        (response) => {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
        });

    } else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
    }
  }

  onCancelClick() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": BizTemplateCode });
  }

  async initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.EnvUrl = environment.FoundationR3Url;
    this.InputApvObj.PathUrlGetLevelVoting = URLConstant.GetLevelVoting;
    this.InputApvObj.PathUrlGetPossibleResult = URLConstant.GetPossibleResult;
    this.InputApvObj.PathUrlSubmitApproval = URLConstant.SubmitApproval;
    this.InputApvObj.PathUrlGetNextNodeMember = URLConstant.GetNextNodeMember;
    this.InputApvObj.PathUrlGetReasonActive = URLConstant.GetRefReasonActive;
    this.InputApvObj.PathUrlGetChangeFinalLevel = URLConstant.GetCanChangeMinFinalLevel;
    this.InputApvObj.PathUrlReturnToLevel = URLConstant.ReturnLevel;
    this.InputApvObj.PathUrlContinueToLevel = URLConstant.ContinueToLevel;
    this.InputApvObj.TrxNo = this.AppObj.AppNo;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }

  async GetIsUseDigitalization() {
    var generalSettingObj = new GeneralSettingObj();
    generalSettingObj.GsCode = CommonConstant.GSCodeIsUseDigitalization;
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, {Code: CommonConstant.GSCodeIsUseDigitalization}).toPromise().then(
      (response: GeneralSettingObj) => {
        this.IsUseDigitalization = response.GsValue;
      }
    )
  }
}
