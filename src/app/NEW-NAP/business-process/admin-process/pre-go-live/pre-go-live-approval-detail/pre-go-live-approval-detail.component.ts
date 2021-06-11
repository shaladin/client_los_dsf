import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { OutstandingTcObj } from 'app/shared/model/OutstandingTcObj.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetProdOffDByProdOffCodeAndProdCompntCodeObj } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { ReqGetRfaLogByTrxNoAndApvCategoryObj } from 'app/shared/model/Request/NAP/PreGoLive/ReqGetRfaLogByTrxNoAndApvCategoryObj.model';

@Component({
  selector: 'app-pre-go-live-approval-detail',
  templateUrl: './pre-go-live-approval-detail.component.html'
})
export class PreGoLiveApprovalDetailComponent implements OnInit {
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: string; };
  viewObj: string;
  TrxNo: any;
  AgrmntNo: any;
  result: any;
  result2: any;
  result3: any;
  result4: any;
  result5: any;
  result6: any;
  arrValue = [];
  TCList: any;
  identifier: string = "TCList";
  IsApvReady: boolean = false;
  outstandingTcObj: any;
  listAppTCObj: ListAppTCObj;
  appTC: AppTCObj;
  count1: number = 0;
  ListRfaLogObj: any;
  listPreGoLiveAppvrObj: Array<any> = new Array<any>();

  AppId: any;
  AgrmntId: any;
  token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  LeadId: string;
  bizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  MouCustId: any;
  ApvReqId: number;
  taskId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AgrmntId = params["AgrmntId"];
      this.AppId = params["AppId"];
      this.TrxNo = params["TrxNo"]; //AgrmntNo
      this.taskId = params["TaskId"];
      this.ApvReqId = params["ApvReqId"];

      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = this.taskId;

      this.HoldTask(ApvHoldObj);
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    let reqGetRfaLogByTrxNoAndApvCategoryObj = new ReqGetRfaLogByTrxNoAndApvCategoryObj();
    reqGetRfaLogByTrxNoAndApvCategoryObj.TrxNo = this.TrxNo;
    reqGetRfaLogByTrxNoAndApvCategoryObj.ApvCategory = CommonConstant.ApvCategoryPreGoLive;
    this.http.post(URLConstant.GetRfaLogByTrxNoAndApvCategory, reqGetRfaLogByTrxNoAndApvCategoryObj).subscribe(
      (response) => {
        this.result = response;
        this.ListRfaLogObj = response["ListRfaLogObj"];
        for (let i = 0; i < this.ListRfaLogObj.length; i++) {
          this.listPreGoLiveAppvrObj[i] = {
            approvalBaseUrl: environment.ApprovalR3Url,
            type: 'task',
            refId: this.ListRfaLogObj[i]["RfaNo"],
            apvStat: this.ListRfaLogObj[i]["ApvStat"],
          }
        }
        this.IsApvReady = true;
      });

    this.http.post(URLConstant.GetListTCbyAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.TCList = response["AppTcs"];
      });

    this.initInputApprovalObj();
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      () => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING],{ "BizTemplateCode": this.bizTemplateCode });
      }
    )
  }

  onAvailableNextTask() {

  }

  onApprovalSubmited(event) {
    this.outstandingTcObj = new OutstandingTcObj(); 
    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();
 
    for (var i = 0; i < this.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.TCList[i].AppId;
      this.appTC.AppTcId = this.TCList[i].AppTcId;
      this.appTC.TcCode = this.TCList[i].TcCode;
      this.appTC.TcName = this.TCList[i].TcName;
      this.appTC.PriorTo = this.TCList[i].PriorTo;
      this.appTC.IsChecked = this.TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.TCList[i].CheckedDt;
      this.appTC.Notes = this.TCList[i].Notes;
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    this.outstandingTcObj.ListAppTCObj = this.listAppTCObj.AppTCObj;

    let ReqPreGoLiveApvCustomObj = {
      Tasks: event.Tasks,
      requestListOutstandingTcObj: this.outstandingTcObj
    }

    this.http.post(URLConstant.PreGoLiveApproval, ReqPreGoLiveApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING],{ "BizTemplateCode": this.bizTemplateCode });
      }
    );
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING],{ "BizTemplateCode": localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
  }

  initInputApprovalObj() {
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
    this.InputApvObj.TrxNo = this.TrxNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }
}
