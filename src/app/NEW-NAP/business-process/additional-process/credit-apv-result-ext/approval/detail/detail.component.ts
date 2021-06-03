import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { ReqCreditApvResultExtObj } from 'app/shared/model/Request/NAP/Business-Process/ReqCreditAprovalResultObj.model';
import { ResCreditApvResultExtObj } from 'app/shared/model/Response/NAP/Business-Process/ResCreditAprovalResultObj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-credit-approval-result-extension-approval-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class CreditApprovalResultExtensionApprovalDetailComponent implements OnInit {

  CrdApvResultExtId: number;
  taskId: number;
  instanceId: number;
  viewVendorBranchObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: number;
  AgrmntId: number;
  CrdApvMainDataObj: ResCreditApvResultExtObj;

  ApvReqId: number; 
  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  TrxNo : string;
  IsReady: boolean = false;
  constructor(private router: Router, 
     private route: ActivatedRoute,
     private toastr: NGXToastrService,
     private http: HttpClient,
     ) {

    this.route.queryParams.subscribe(params => {

      if (params["CrdApvResultExtId"] != null) {
        this.CrdApvResultExtId = params["CrdApvResultExtId"];
        this.taskId = params["TaskId"];
        this.instanceId = params["InstanceId"];
        this.ApvReqId = params["ApvReqId"];
      }
      this.AppId = params["AppId"];
      this.AgrmntId = params["AgrmntId"];
    });
  }

  async ngOnInit() {
   await this.GetMainData();

    var ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.taskId

    this.HoldTask(ApvHoldObj);
    this.initInputApprovalObj();
  }

  async GetMainData() {
    let requestMainDataObj : ReqCreditApvResultExtObj = new ReqCreditApvResultExtObj();
    requestMainDataObj.AppId = this.AppId,
    requestMainDataObj.AgrmntId = this.AgrmntId
    this.http.post<ResCreditApvResultExtObj>(URLConstant.GetCreditApvResultExtMainData, requestMainDataObj).subscribe(
      response => {
        this.CrdApvMainDataObj = response;
      }
    );
    await this.http.post<AppObj>(URLConstant.GetAppById, {Id: this.AppId}).toPromise().then(
      response => {
        this.TrxNo = response.AppNo
      }
    );
  }

  HoldTask(obj){
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{
      }
    )
  }

  onAvailableNextTask(event)
  {
  }

  onApprovalSubmited(event)
  {
    this.toastr.successMessage("Success");
    this.router.navigate([NavigationConstant.NAP_ADD_PRCS_CRD_APPR_RES_EXT_APPRVL_PAGING]);
  }

  onCancelClick()
  {
    this.router.navigate([NavigationConstant.NAP_ADD_PRCS_CRD_APPR_RES_EXT_APPRVL_PAGING]);
  }

  GetCallBack(e){
    // AdInsHelper.OpenProdOfferingViewByCodeAndVersion(e.ViewObj.ProdOfferingCode, e.ViewObj.ProdOfferingVersion);
  }

  OpenView(key: string) {
    if (key == 'app') {
      AdInsHelper.OpenAppViewByAppId(this.AppId);
    } else if (key == 'agr') {
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
    }
  }

  initInputApprovalObj(){
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;
    
    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.EnvUrl = environment.FoundationR3Url;
    this.InputApvObj.PathUrlGetLevelVoting = URLConstant.GetLevelVoting;
    this.InputApvObj.PathUrlGetPossibleResult = URLConstant.GetPossibleResult;
    this.InputApvObj.PathUrlSubmitApproval = URLConstant.SubmitApproval;
    this.InputApvObj.PathUrlGetNextNodeMember = URLConstant.GetNextNodeMember;
    this.InputApvObj.PathUrlGetReasonActive = URLConstant.GetRefReasonActive;
    this.InputApvObj.PathUrlGetChangeFinalLevel = URLConstant.GetCanChangeMinFinalLevel;
    this.InputApvObj.PathUrlReturnToLevel = URLConstant.ReturnLevel;
    this.InputApvObj.PathUrlContinueToLevel = URLConstant.ContinueToLevel;
    this.InputApvObj.TrxNo =  this.TrxNo;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }

}
