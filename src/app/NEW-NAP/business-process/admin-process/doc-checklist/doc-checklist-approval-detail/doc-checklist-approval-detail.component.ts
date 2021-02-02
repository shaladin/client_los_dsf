import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { OutstandingTcObj } from 'app/shared/model/OutstandingTcObj.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-doc-checklist-approval-detail',
  templateUrl: './doc-checklist-approval-detail.component.html'
})
export class DocChecklistApprovalDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: string; };
  viewObj: string;
  TrxNo: any;
  arrValue = [];
  TCList: any;
  AppNo: any;
  AppObj: any;
  IsApvReady: boolean = false;
  outstandingTcObj: any;
  listAppTCObj: ListAppTCObj;
  appTC: AppTCObj;
  RfaLogObj: {
    RfaNo: any
  }
  MainInfoForm = this.fb.group({

  });
  AppId: any;
  token = localStorage.getItem(CommonConstant.TOKEN);
  LeadId: string;
  bizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  MouCustId: any;
  ApvReqId: number;
  taskId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.TrxNo = params["TrxNo"];
      this.taskId = params["TaskId"];
      this.ApvReqId = params["ApvReqId"];
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

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.http.post(URLConstant.GetListTCbyAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.TCList = response["AppTcs"];
      });
    await this.GetAppData();
    this.initInputApprovalObj();

  }

  async GetAppData() {
    var appObj = {
      AppId: this.AppId,
    };
    await this.http.post(URLConstant.GetAppById, appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.AppNo = this.AppObj.AppNo;
      }
    );
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router, ["/Nap/AdminProcess/DocChecklist/Approval/Paging"], { "BizTemplateCode": this.bizTemplateCode });
      }
    )
  }


  onApprovalSubmited(event) {
    this.outstandingTcObj = new OutstandingTcObj();
    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    for (var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.MainInfoForm.getRawValue().TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.MainInfoForm.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.MainInfoForm.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    this.outstandingTcObj.ListAppTCObj = this.listAppTCObj.AppTCObj;

    this.http.post(URLConstant.SubmitOutstandingTc, this.outstandingTcObj).subscribe(
      response => {
        // this.toastr.successMessage("Success");
        AdInsHelper.RedirectUrl(this.router, ["/Nap/AdminProcess/DocChecklist/Approval/Paging"], { "BizTemplateCode": this.bizTemplateCode });
      }
    );
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, ["/Nap/AdminProcess/DocChecklist/Approval/Paging"], { "BizTemplateCode": localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
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
    this.InputApvObj.EnvUrl = environment.FoundationR3Url;
    this.InputApvObj.PathUrlGetLevelVoting = URLConstant.GetLevelVoting;
    this.InputApvObj.PathUrlGetPossibleResult = URLConstant.GetPossibleResult;
    this.InputApvObj.PathUrlSubmitApproval = URLConstant.SubmitApproval;
    this.InputApvObj.PathUrlGetNextNodeMember = URLConstant.GetNextNodeMember;
    this.InputApvObj.PathUrlGetReasonActive = URLConstant.GetRefReasonActive;
    this.InputApvObj.PathUrlGetChangeFinalLevel = URLConstant.GetCanChangeMinFinalLevel;
    this.InputApvObj.TrxNo = this.AppNo;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }
}
