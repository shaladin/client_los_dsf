import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ViewHighlightCommentComponent } from 'app/NEW-NAP/sharing-component/view-app-component/view-highlight-comment/view-highlight-comment.component';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { CrdRvwAppObj } from 'app/shared/model/credit-review/crd-rvw-app-obj.model';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { CustHighlightCommentObj } from 'app/shared/model/cust-highlight-comment-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-credit-approval-detail-dsf',
  templateUrl: './credit-approval-detail-dsf.component.html',
  styleUrls: ['./credit-approval-detail-dsf.component.css']
})
export class CreditApprovalDetailDsfComponent implements OnInit {

  appId: number = 0;
  custNo: string;
  ApvReqId: number = 0;
  mrCustTypeCode: string;
  viewObj: string;
  type: string;
  inputObj: { taskId: number; instanceId: number; approvalBaseUrl: string; };
  ManualDeviationData;
  isExistedManualDeviationData;
  BizTemplateCode: string;
  AppObj: AppObj;
  IsViewReady: boolean = false;
  getEvent: Array<any> = new Array();
  custHighlightCommentObj: CustHighlightCommentObj = null;

  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  dmsObj: DMSObj;
  isDmsReady: boolean = false;
  usingDmsAdins: string;

  private viewHighlightCommentComponent: ViewHighlightCommentComponent;
  @ViewChild(ViewHighlightCommentComponent) set content(
    content: ViewHighlightCommentComponent
  ) {
    if (content) {
      // initially setter gets called with undefined
      this.viewHighlightCommentComponent = content;
    }
  };

  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;

  constructor(private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService) {
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

  readonly bizCfna: string = CommonConstant.CFNA;
  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.viewObj = "./assets/ucviewgeneric/viewCreditApprovalInfo.json";
    await this.getApp();
    await this.GetCrdRvwCustInfoByAppId();
    this.initInputApprovalObj();
    await this.InitDms();
  }

  async InitDms() {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.SYS_CONFIG_USING_DMS_ADINS }).toPromise().then(
      (response) => {
        this.usingDmsAdins = response["ConfigValue"];
      },
      (error) => {
        this.isDmsReady = false;
      }
    );

    if (this.usingDmsAdins == '1') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
    
      this.dmsObj.ViewCode = "APP";
      this.dmsObj.UsingDmsAdIns = this.usingDmsAdins;
      this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideViewDownload));

      let reqAppId = { Id: this.appId };
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsOfficeCode, this.AppObj.OriOfficeCode));
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.AppObj.AppNo));
      this.http.post(URLConstant.GetAppCustByAppId, reqAppId).subscribe(
        (response) => {
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['CustNo']));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsCustName, response['CustName']));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsDealerName, "DEALER"));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsExpiredDate, formatDate(new Date(), 'dd/MM/yyyy', 'en-US').toString()));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsTimestamp, formatDate(new Date(), 'MM/dd/yyyy HH:mm:ss', 'en-US').toString()));

          this.isDmsReady = true;
        }
      );
    }
    else if (this.usingDmsAdins == '2') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      var appObj = { Id: this.appId };
      
      await this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
        (response: AppCustObj) => {
          this.custNo = response.CustNo;

          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          }
          else {
            this.dmsObj.MetadataParent = null;
          }
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.AppObj.AppNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideViewDownload));
          
          this.isDmsReady = true;
        }
      );
    }
    else {
      this.isDmsReady = false;
    }
  }

  crdRvwAppObj: CrdRvwAppObj = new CrdRvwAppObj();
  getCrdRvwAppObj(ev: CrdRvwAppObj) {
    this.crdRvwAppObj = ev;
  }

  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  isShow: boolean = false;
  captureStat: string = "";
  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.crdRvwCustInfoObj = response;
        this.isShow = true;
      }
    );

    let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCaptureStat,
      MasterCode: this.crdRvwCustInfoObj.CaptureStat
    };
    await this.http.post<KeyValueObj>(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
      (response) => {
        this.captureStat = response.Value;
      }
    );
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        // Self Custom Change
        AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CRD_PRCS_CRD_APPRV_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode });
        // End Self Custom Change
      }
    )
  }

  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  initInputApprovalObj() {

    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.inputObj.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.inputObj.taskId;
    this.InputApvObj.TrxNo = this.AppObj.AppNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.OfficeCodes.push(this.AppObj.OriOfficeCode);
    this.IsReady = true;
  }

  //#region Uc Approval 
  async getApp() {
    // let appObj = new AppObj();
    // appObj.AppId = this.appId
    var appObj = { Id: this.appId };
    await this.http.post<AppObj>(URLConstant.GetAppById, appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
      });
  }

  onApprovalSubmited(event) {
    let ReqApvCustomObj = {
      AppId: this.appId,
      Tasks: event.Tasks
    }
    let postList = new Array<any>();

    postList.push(this.http.post(URLConstant.Approval, ReqApvCustomObj));

    if (this.viewHighlightCommentComponent != undefined) {
      if (!this.viewHighlightCommentComponent.checkIsEmptyOrNot()) {
        this.viewHighlightCommentComponent.SaveComment();
        if (this.custHighlightCommentObj !== null) {
          postList.push(this.http.post(URLConstant.AddAppCustHighlightComment, this.custHighlightCommentObj));
        }
      }
    }

    forkJoin(postList).subscribe(
      (response) => {
        this.toastr.successMessage(response[0]["Message"]);
        // Self Custom Change
        AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CRD_PRCS_CRD_APPRV_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode });
        // End Self Custom Change
      });
  }

  onAvailableNextTask() {

  }

  GetCommnet(event) {
    this.custHighlightCommentObj = event;
  }

  onCancelClick() {
    // Self Custom Change
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CRD_PRCS_CRD_APPRV_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode });
    // End Self Custom Change
  }
  //#endregion
}
