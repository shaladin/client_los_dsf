import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { ReqGetRfaLogByTrxNoAndApvCategoryObj } from 'app/shared/model/request/nap/pre-go-live/req-get-rfa-log-by-trx-no-and-apv-category-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { CommonConstantDsf } from 'app/dsf/shared/constant/CommonConstantDsf';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-go-live-approval-detail-x-dsf',
  templateUrl: './go-live-approval-detail-x-dsf.component.html',
  styleUrls: ['./go-live-approval-detail-x-dsf.component.css']
})
export class GoLiveApprovalDetailXDsfComponent implements OnInit {

  viewObj: string;
  TrxNo: string;
  AgrmntNo: string;
  result: AgrmntObj;
  result4: NapAppModel;
  arrValue = [];
  identifier: string = "TCList";
  IsApvReady: boolean = false;
  viewAgrmnt: UcViewGenericObj = new UcViewGenericObj();
  viewAgrmntPlafond: UcViewGenericObj = new UcViewGenericObj();
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

  async ngOnInit() {
    if (this.bizTemplateCode != CommonConstant.DF) {
      this.viewAgrmnt.viewInput = "./assets/impl/ucviewgeneric/viewAgrmntDataAfterPreGoLiveX.json";
    } else {
      this.viewAgrmnt.viewInput = "./assets/impl/ucviewgeneric/viewAgrmntDataAfterPreGoLiveDlfnX.json";
    }

    // Self Custom CR MPF Validation
    if (this.bizTemplateCode == CommonConstant.CFNA)
    {
      this.viewAgrmntPlafond.viewInput = "./assets/impl/ucviewgeneric/viewAgrmntPlafondDataAfterPreGoLiveXDsf.json";
    }
    // End Self Custom CR MPF Validation
    
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

    await this.getGsDisableRequiredNotes();

    this.initInputApprovalObj();
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      () => {
      },
      (error) => {
        // Self Custom CR MPF Validation
        AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.GO_LIVE_APV_PAGING_DSF], { "BizTemplateCode": this.bizTemplateCode });
        // End Self Custom CR MPF Validation
      }
    )
  }

  onAvailableNextTask() {

  }

  // Self Custom CR MPF Validation
  async onApprovalSubmited(event) {

    let ReqPreGoLiveApvCustomObj = {
      Tasks: event.Tasks,
    }

    // Self Custom CR Change
    await this.http.post(URLConstantDsf.GoLiveApprovalX, ReqPreGoLiveApvCustomObj).toPromise().then(
      () => 
      {

      }
    );
    // Self Custom CR Change

    await this.http.post(URLConstantX.GoLiveApprovalV2X, ReqPreGoLiveApvCustomObj).toPromise().then(
      () => {
        
        AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.GO_LIVE_APV_PAGING_DSF],{ "BizTemplateCode": this.bizTemplateCode });
        
      }
    );
  }
  // End Self Custom CR MPF Validation

  onCancelClick() {
    // Self Custom CR MPF Validation
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.GO_LIVE_APV_PAGING_DSF], { "BizTemplateCode": localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
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
    this.InputApvObj.EnableRequiredNotes = false;
    this.InputApvObj.DisableRequiredNotesList = this.ListGsDisableRequiredNotes;
    this.IsReady = true;
  }

  ListGsDisableRequiredNotes : Array<string> = new Array<string>();
  async getGsDisableRequiredNotes(){
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstantX.GSCodeDisableRequiredNotesApvAct }).toPromise().then(
      (response: GeneralSettingObj) => {
        let x = response.GsValue;
        this.ListGsDisableRequiredNotes = x.split(';');
      }
    )
  }

}
