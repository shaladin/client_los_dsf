import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { ResponseTaskReassignmentDetailPageObj } from 'app/shared/model/task-reassignment/response-task-reassignment-detail-page-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
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
  inputObj: { taskId: number; instanceId: number; approvalBaseUrl: string; };
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
    let urlApi: string = environment.isCore ? URLConstant.GetTaskReassignmentDetailForApprovalV2 : URLConstant.GetTaskReassignmentDetailForApproval
    this.http.post(urlApi, { TaskReassignmentTrxId: this.TaskReassignmentTrxId }).toPromise().then(
      (response: ResponseTaskReassignmentDetailPageObj) => {
        this.TaskReassignmentObj = response;
        this.initInputApprovalObj();
      }
    );
  }

  onApprovalSubmited(event) {

    let ReqTaskReassignmentApvCustomObj = {
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.TaskReassignmentApproval, ReqTaskReassignmentApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.TASK_REASSIGN_APV_PAGING],{});
      }
    );
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
    this.UcInputApprovalGeneralInfoObj.PathUrl = URLConstant.GetSingleTaskInfo;
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;
    
    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.PathUrl = URLConstant.GetTaskHistory;
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.TrxNo =  this.TaskReassignmentObj.TaskReassignmentTrxNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.OfficeCodes.push(this.TaskReassignmentObj.OfficeCode);
    this.IsReady = true;
  }

}
