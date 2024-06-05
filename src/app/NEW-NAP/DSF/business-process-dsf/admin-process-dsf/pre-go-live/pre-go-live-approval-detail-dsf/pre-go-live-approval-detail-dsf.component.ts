import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { OutstandingTcObj } from 'app/shared/model/outstanding-tc-obj.model';
import { ListAppTCObj } from 'app/shared/model/list-app-tc-obj.model';
import { AppTCObj } from 'app/shared/model/app-tc-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetProdOffDByProdOffCodeAndProdCompntCodeObj } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReqGetRfaLogByTrxNoAndApvCategoryObj } from 'app/shared/model/request/nap/pre-go-live/req-get-rfa-log-by-trx-no-and-apv-category-obj.model';
import { AgrmntMasterXObj } from 'app/shared/model/agrmnt-master-x-obj.model';
import { RfaObj } from 'app/shared/model/approval/rfa-obj.model';
import { AgrmntObj } from 'app/shared/model/agrmnt/agrmnt.model';
import { ProdOfferingDObj } from 'app/shared/model/product/prod-offering-d-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { DeliveryOrderHObj } from 'app/shared/model/delivery-order-h-obj.model';
import { AgrmntFinDataObj } from 'app/shared/model/agrmnt-fin-data.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-pre-go-live-approval-detail-dsf',
  templateUrl: './pre-go-live-approval-detail-dsf.component.html',
  styleUrls: ['./pre-go-live-approval-detail-dsf.component.css']
})
export class PreGoLiveApprovalDetailDsfComponent implements OnInit {

  viewObj: string;
  TrxNo: string;
  AgrmntNo: string;
  result: AgrmntObj;
  result4: NapAppModel;
  arrValue = [];
  TCList: any;
  identifier: string = "TCList";
  IsApvReady: boolean = false;
  listAppTCObj: ListAppTCObj;
  appTC: AppTCObj;
  count1: number = 0;
  ListRfaLogObj: any;
  listPreGoLiveAppvrObj: Array<any> = new Array<any>();

  AppId: number;
  AgrmntId: number;
  token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  LeadId: number;
  bizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  MouCustId: number;
  ApvReqId: number;
  taskId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  viewAgrmntPlafond: UcViewGenericObj = new UcViewGenericObj();

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

    this.http.post(URLConstant.GetListAgrmntTcbyAgrmntId, { Id: this.AgrmntId }).subscribe(
      (response) => {
        this.TCList = response["ReturnObject"];
      });

    this.initInputApprovalObj();

    // Self Custom CR MPF Validation
    this.viewAgrmntPlafond.viewInput = "./assets/impl/ucviewgeneric/viewAgrmntPlafondDataAfterPreGoLiveXDsf.json";
    // End Self Custom CR MPF Validation
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      () => {
      },
      (error) => {
        // Self Custom CR MPF Validation
        AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_ADM_PRCS_PGL_APPRVL_PAGING_DSF], { "BizTemplateCode": this.bizTemplateCode });
        // End Self Custom CR MPF Validation
      }
    )
  }

  onAvailableNextTask() {

  }

  // Self Custom CR MPF Validation
  async onApprovalSubmited(event) {
    let ReqPreGoLiveApvCustomObj = {
      Tasks: event.Tasks
    }

    // Self Custom CR MPF Validation
    await this.http.post(URLConstantDsf.PreGoLiveApproval, ReqPreGoLiveApvCustomObj).toPromise().then(
      () => 
      {

      }
    );
    // Self Custom CR MPF Validation

    await this.http.post(URLConstantX.PreGoLiveApprovalV2X, ReqPreGoLiveApvCustomObj).toPromise().then(
      () => {
        
        AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.NAP_ADM_PRCS_PGL_APPRVL_PAGING_DSF],{ "BizTemplateCode": this.bizTemplateCode });
        
      }
    );
  }
  // End Self Custom CR MPF Validation

  onCancelClick() {
    // Self Custom CR MPF Validation
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_ADM_PRCS_PGL_APPRVL_PAGING_DSF], { "BizTemplateCode": localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
    // End Self Custom CR MPF Validation
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
    this.InputApvObj.TrxNo = this.TrxNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }

}
