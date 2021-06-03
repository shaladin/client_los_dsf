import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-credit-approval-cr-detail',
  templateUrl: './credit-approval-cr-detail.component.html',
})
export class CreditApprovalCrDetailComponent implements OnInit {

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
  
  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.viewObj = "./assets/ucviewgeneric/viewCreditApprovalInfo.json";
    await this.getApp();
    await this.GetCrdRvwCustInfoByAppId();
    this.initInputApprovalObj();
  }

  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  isShow: boolean = false;
  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.crdRvwCustInfoObj = response;
        this.isShow = true;
      }
    );
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      }
    )
  }

  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  initInputApprovalObj(){

    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.inputObj.taskId;
    
    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.inputObj.taskId;
    this.InputApvObj.TrxNo =  this.AppObj.AppNo;
    this.InputApvObj.RequestId = this.ApvReqId;
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
    this.getEvent = event;
    let isReturn: boolean = false;
    let isReject: boolean = false;
    let isReturnIndex: number = 0;

    for(let i in this.getEvent){
      if(this.getEvent[i].ApvResult.toLowerCase() == CommonConstant.ApvResultReturn.toLowerCase()) {
        isReturn = true;
        isReturnIndex = parseInt(i);
      }
      if(this.getEvent[i].ApvResult.toLowerCase() == CommonConstant.ApvResultRejectFinal.toLowerCase()) {
        isReject = true;
      }
    }

    if(isReject){
      var NegCustObj = {
        AppId: this.appId,
        MrNegCustSourceCode: CommonConstant.NegCustSourceCodeConfins,
        NegCustCause: event['reason']
      };
      this.http.post(URLConstant.AddNegativeCustByAppId, NegCustObj).subscribe(
        (response) => {
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
        });
    }
    else if(isReturn){
      var returnHandlingHObj = new ReturnHandlingHObj();
      var user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      returnHandlingHObj.AppId = this.appId;
      returnHandlingHObj.AgrmntId = null;
      returnHandlingHObj.ReturnBy = user.UserName;
      returnHandlingHObj.ReturnDt = user.BusinessDt;
      returnHandlingHObj.ReturnNotes = event[isReturnIndex]['notes'];
      returnHandlingHObj.ReturnFromTrxType = this.AppObj.AppCurrStep;

      this.http.post(URLConstant.AddReturnHandlingH, returnHandlingHObj).subscribe(
        (response) => {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
        });
    }
    else{
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
    }
  }

  onAvailableNextTask() {

  }
  
  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode });
  }
  //#endregion
}
