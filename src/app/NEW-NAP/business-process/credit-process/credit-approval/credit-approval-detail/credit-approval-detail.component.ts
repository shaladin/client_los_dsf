import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { forkJoin } from 'rxjs';
import { CustHighlightCommentObj } from 'app/shared/model/cust-highlight-comment-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { ViewHighlightCommentComponent } from 'app/NEW-NAP/sharing-component/view-app-component/view-highlight-comment/view-highlight-comment.component';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-credit-approval-detail',
  templateUrl: './credit-approval-detail.component.html'
})
export class CreditApprovalDetailComponent implements OnInit {
  appId: number;
  mrCustTypeCode: string;
  viewObj: string;
  type: string;
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
  custNo: string;
  appNo: string;
  rootServer: string;
  isDmsReady: boolean = false;
  custHighlightCommentObj: CustHighlightCommentObj = null;
  IsUseDigitalization: string;
  IsViewReady: boolean = false;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  getEvent: Array<any> = new Array();

  private viewHighlightCommentComponent: ViewHighlightCommentComponent;
  @ViewChild(ViewHighlightCommentComponent) set content(
    content: ViewHighlightCommentComponent
  ) {
    if (content) {
      // initially setter gets called with undefined
      this.viewHighlightCommentComponent = content;
    }
  } ;

  constructor(private toastr: NGXToastrService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private cookieService: CookieService) {
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

      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = params["TaskId"];

      this.HoldTask(ApvHoldObj);
    });
  }
  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.viewObj = "./assets/ucviewgeneric/viewCreditApprovalInfo.json";
    await this.getApp();
    this.initInputApprovalObj();
    await this.InitDms();
    await this.GetIsUseDigitalization();
  }

  async InitDms() {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
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
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideViewDownload));
          let mouCustId = response[0]['MouCustId'];
          if (mouCustId != null && mouCustId != '') {
            this.http.post(URLConstant.GetMouCustById, { Id: mouCustId }).subscribe(
              (response: MouCustObj) => {
                let mouCustNo = response.MouCustNo;
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
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
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
    let ReqApvCustomObj = {
      AppId: this.appId,
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.Approval, ReqApvCustomObj).subscribe(
      (response)=>{
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  onCancelClick() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": BizTemplateCode });
  }

  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.TrxNo = this.AppObj.AppNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.OfficeCodes.push(this.AppObj.OriOfficeCode);
    this.IsReady = true;
  }

  GetCommnet(event){
    this.custHighlightCommentObj = event;
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
