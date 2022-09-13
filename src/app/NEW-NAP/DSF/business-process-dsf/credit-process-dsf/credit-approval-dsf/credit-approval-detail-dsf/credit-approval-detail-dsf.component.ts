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
import { AppObj } from 'app/shared/model/App/App.Model';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { CrdRvwAppObj } from 'app/shared/model/credit-review/crd-rvw-app-obj.model';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { CustHighlightCommentObj } from 'app/shared/model/cust-highlight-comment-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
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
