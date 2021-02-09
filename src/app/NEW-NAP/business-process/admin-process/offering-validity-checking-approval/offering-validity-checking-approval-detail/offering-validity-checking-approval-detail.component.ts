import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
@Component({
  selector: 'app-offering-validity-checking-approval-detail',
  templateUrl: './offering-validity-checking-approval-detail.component.html'
})
export class OfferingValidityCheckingApprovalDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  BizTemplateCode : string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: any; };
  token: any = localStorage.getItem(CommonConstant.TOKEN);
  ApvReqId: number;
  taskId: number; 
  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  TrxNo : string;
  IsReady: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService, private http:HttpClient) {
    this.route.queryParams.subscribe(params => {

      this.TrxNo = params["TrxNo"];
      this.taskId= params["TaskId"];
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

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewOfferingValidityCheckingApproval.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "AgrmntNo",
        environment: environment.losR3Web
      },
    ];
    this.initInputApprovalObj();
  }

  HoldTask(obj: ApprovalObj){
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{
      },
      (error)=>{
        AdInsHelper.RedirectUrl(this.router,["/Nap/AdminProcess/OfferingValidityApproval/Paging"],{ "BizTemplateCode": this.BizTemplateCode});
      }
    )
  }
  
  onAvailableNextTask() {

  }
  onApprovalSubmited() {
    this.toastr.successMessage("Success");
    AdInsHelper.RedirectUrl(this.router,["/Nap/AdminProcess/OfferingValidityApproval/Paging"],{ "BizTemplateCode": this.BizTemplateCode});
  }

  onCancelClick()
  {
    AdInsHelper.RedirectUrl(this.router,["/Nap/AdminProcess/OfferingValidityApproval/Paging"],{ "BizTemplateCode": this.BizTemplateCode});
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
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
    this.InputApvObj.TrxNo =  this.TrxNo;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }
}
