import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { ResponseTaskReassignmentDetailPageObj } from 'app/shared/model/TaskReassignment/ResponseTaskReassignmentDetailPageObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-task-reassignment-approval-detail',
  templateUrl: './task-reassignment-approval-detail.component.html',
  styles: []
})
export class TaskReassignmentApprovalDetailComponent implements OnInit {

  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  IsReady: boolean;
  ApvReqId: number;
  taskId: number;
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: string; };
  trxNo: string;
  TaskReassignmentTrxId: number;
  TaskReassignmentObj: ResponseTaskReassignmentDetailPageObj;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute
  ) { 
    this.InputApvObj = new UcInputApprovalObj();
    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.TaskReassignmentObj = new ResponseTaskReassignmentDetailPageObj();
    this.IsReady = false;
    this.route.queryParams.subscribe(params => {
      if( params["ApvReqId"] !=null){ 
        this.ApvReqId = params["ApvReqId"];
      }
      if( params["TaskId"] !=null){ 
        this.taskId = params["TaskId"];
      }
      if( params["TaskReassignmentTrxId"] !=null){ 
        this.TaskReassignmentTrxId = params["TaskReassignmentTrxId"];
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

  ngOnInit() {
    this.http.post(URLConstant.GetTaskReassignmentDetailForApproval, { TaskReassignmentTrxId: this.TaskReassignmentTrxId }).toPromise().then(
      (response: ResponseTaskReassignmentDetailPageObj) => {
        this.TaskReassignmentObj = response;
        this.initInputApprovalObj();
      }
    );
  }

  onApprovalSubmited(event) {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.TASK_REASSIGN_APV_PAGING], { });
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.TASK_REASSIGN_APV_PAGING], { });
  }

  HoldTask(obj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.TASK_REASSIGN_APV_PAGING], {});
      }
    )
  }

  initInputApprovalObj(){
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = URLConstant.GetSingleTaskInfo;
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;
    
    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
    this.InputApprovalHistoryObj.PathUrl = URLConstant.GetTaskHistory;
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
    this.InputApvObj.TrxNo =  this.TaskReassignmentObj.TaskReassignmentTrxNo;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }

}
