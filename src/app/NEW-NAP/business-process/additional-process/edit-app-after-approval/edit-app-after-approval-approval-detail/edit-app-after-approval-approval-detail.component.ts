import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit-app-after-approval-approval-detail',
  templateUrl: './edit-app-after-approval-approval-detail.component.html',
  styleUrls: ['./edit-app-after-approval-approval-detail.component.css']
})
export class EditAppAfterApprovalApprovalDetailComponent implements OnInit {

  EditAppAftApvTrxHId: number;
  ChangeSummaryObj: any;
  taskId: number;
  instanceId: number;
  ApvReqId: number;
  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  arrValue = [];
  BizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private toastr: NGXToastrService,
    private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      if (params["EditAppAftApvTrxHId"] != null) {
        this.EditAppAftApvTrxHId = params["EditAppAftApvTrxHId"];
        this.taskId = params["TaskId"];
        this.instanceId = params["InstanceId"];
        this.ApvReqId = params["ApvReqId"];
      }
    });
  }

  ngOnInit() {
    var ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.taskId;

    this.HoldTask(ApvHoldObj);

    this.getData();
  }

  getData()
  {
    let reqGetEditAppAftApv : GenericObj = new GenericObj();
    reqGetEditAppAftApv.Id = this.EditAppAftApvTrxHId;
    this.http.post(URLConstant.GetEditAppAftApvTrxForChangeSummaryByEditAppAftApvTrxHId, reqGetEditAppAftApv).subscribe(
      (response) => {
        this.ChangeSummaryObj = response["ReturnObject"];
        
        this.arrValue.push(this.ChangeSummaryObj.EditAppAftApvTrxHObj.AgrmntId);

        this.initInputApprovalObj();
      });
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

    this.InputApvObj.TrxNo = this.ChangeSummaryObj.EditAppAftApvTrxHObj.EditAppAftApvTrxNo;
    this.IsReady = true;
  }

  HoldTask(obj){
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{      
    
      }
    )
  }

  onApprovalSubmited(event)
  {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_EDIT_APP_AFT_APV_APPRV_PAGING],{BizTemplateCode: this.BizTemplateCode});
  }
  onCancelClick(event)
  {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_EDIT_APP_AFT_APV_APPRV_PAGING],{BizTemplateCode: this.BizTemplateCode});
  }
}
