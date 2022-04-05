import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';


@Component({
  selector: 'app-edit-comm-after-approval-approval-detail-x',
  templateUrl: './edit-comm-after-approval-approval-detail-x.component.html'
})
export class EditCommAfterApprovalApprovalDetailXComponent implements OnInit {

  EditAppAftApvTrxHId: number;
  ChangeSummaryObj: any;
  taskId: number;
  instanceId: number;
  ApvReqId: number;
  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  IsReadySummary: boolean = false;
  arrValue = [];
  isViewReady: boolean = false;
  BizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  AppId:number;
  EditAppAftAprvTrxNo:string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["EditCommAftApvTrxId"] != null) {
        this.EditAppAftApvTrxHId = params["EditCommAftApvTrxId"];
      }
      if (params["TaskId"] != null) {
        this.taskId = params["TaskId"];
      }
      if (params["InstanceId"] != null) {
        this.instanceId = params["InstanceId"];
      }
      if (params["ApvReqId"] != null) {
        this.ApvReqId = params["ApvReqId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["EditAppAftAprvTrxNo"] != null) {
        this.EditAppAftAprvTrxNo = params["EditAppAftAprvTrxNo"];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    var ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.taskId;

    await this.HoldTask(ApvHoldObj);
    await this.getData();
    this.IsReadySummary = true;
  }

  async HoldTask(obj){
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{

      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.EDIT_COMM_AFT_APV_APPRV_PAGING],{BizTemplateCode: this.BizTemplateCode});
      }
    )
  }

  async getData()
  {
    //BAGIAN INI DIUBAH JADI 1 COMPONENT NEW / OLD (COPY COMMISSION VIEW DI APP VIEW)

    // let reqGetEditAppAftApv : GenericObj = new GenericObj();
    // reqGetEditAppAftApv.Id = this.EditAppAftApvTrxHId;
    // await this.http.post(URLConstant.GetEditAppAftApvTrxForChangeSummaryByEditAppAftApvTrxHId, reqGetEditAppAftApv).subscribe(
    //   (response) => {
    //     this.ChangeSummaryObj = response["ReturnObject"];

        // this.arrValue.push(this.ChangeSummaryObj.EditAppAftApvTrxHObj.AgrmntId);
        // this.isViewReady = true;
        this.initInputApprovalObj();
    //   });
  }

  initInputApprovalObj(){

    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.RequestId = this.ApvReqId;

    // this.InputApvObj.TrxNo = this.ChangeSummaryObj.EditAppAftApvTrxHObj.EditAppAftApvTrxNo;
    this.InputApvObj.TrxNo = this.EditAppAftAprvTrxNo
    this.IsReady = true;
  }

  onApprovalSubmited(event) {
    let ReqApvCustomObj = {
      Tasks: event.Tasks
    }
    this.http.post(URLConstantX.NewApproval, ReqApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_PGL_APPRVL_PAGING], {});
      }
    );
  }

  onCancelClick(event)
  {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.EDIT_COMM_AFT_APV_APPRV_PAGING],{BizTemplateCode: this.BizTemplateCode});
  }
}
