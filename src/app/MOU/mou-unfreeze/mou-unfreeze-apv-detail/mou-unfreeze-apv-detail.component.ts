import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { ApprovalObj } from "app/shared/model/Approval/ApprovalObj.Model"; 
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { environment } from "environments/environment";

@Component({
  selector: "app-mou-unfreeze-apv-detail",
  templateUrl: "./mou-unfreeze-apv-detail.component.html",
  styles: [],
})

export class MouUnfreezeApvDetailComponent implements OnInit {
  TrxId: number;
  TrxNo : string;
  taskId: number;
  instanceId: number;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  ApvReqId: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params["TrxId"] != null) {
        this.TrxId = params["TrxId"];
        this.taskId = params["TaskId"];
        this.instanceId = params["InstanceId"];
        this.ApvReqId = params["ApvReqId"];
        this.TrxNo = params["TrxNo"];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput =
      "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;

    var ApvHoldObj = new ApprovalObj();
    ApvHoldObj.TaskId = this.taskId;

    this.HoldTask(ApvHoldObj);
    this.initInputApprovalObj();
  }

  HoldTask(obj: any) {
    this.http
      .post(AdInsConstant.ApvHoldTaskUrl, obj)
      .subscribe((response) => {});
  }

  onAvailableNextTask(event: any) {}

  onApprovalSubmited(event: any) {
    this.toastr.successMessage("Success");
    this.router.navigate([NavigationConstant.MOU_FREEZE_APV_PAGING]);
  }

  onCancelClick() {
    this.router.navigate([NavigationConstant.MOU_FREEZE_APV_PAGING]);
  }

  GetCallBack(e: any) {
  }

  initInputApprovalObj(){

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
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.TrxNo = this.TrxNo;
    this.IsReady = true; 
  }

}
