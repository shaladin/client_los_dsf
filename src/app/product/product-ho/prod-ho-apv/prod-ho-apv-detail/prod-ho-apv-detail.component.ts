import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqUpdateProductPostApprovalObj } from 'app/shared/model/Request/Product/ReqAddEditProductObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
@Component({
  selector: 'app-prod-ho-apv-detail',
  templateUrl: './prod-ho-apv-detail.component.html'
})
export class ProdHoApvDetailComponent implements OnInit {

  prodHId: number;
  taskId: number;
  instanceId: number;
  ApvReqId: number;
  inputObj: any;
  IsReady: boolean = false;
  GenericByIdObj : GenericObj = new GenericObj();
  InputApvObj : UcInputApprovalObj = new UcInputApprovalObj();
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  ReqUpdateProdPostApvObj : ReqUpdateProductPostApprovalObj = new ReqUpdateProductPostApprovalObj();

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdHId"] != null) {
        this.prodHId = params["ProdHId"];
        this.taskId = params["TaskId"];
        this.instanceId = params["InstanceId"];
        this.ApvReqId = params["ApvReqId"];
      }
    });
  }

  ngOnInit() {
    var obj = {
      taskId: this.taskId,
      instanceId: this.instanceId,
      approvalBaseUrl: environment.ApprovalR3Url
    }

    this.inputObj = obj;

    var ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = obj.taskId

    this.HoldTask(ApvHoldObj);
    this.initInputApprovalObj();
  }

  initInputApprovalObj(){
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

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
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;

    this.GenericByIdObj.Id = this.prodHId;
    this.http.post(URLConstant.GetProductByHId, this.GenericByIdObj).subscribe(
      (response : GenericObj) => {
        this.InputApvObj.TrxNo = response.Code;
        this.IsReady = true;
      });
  }

  HoldTask(obj){
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{
      }
    )
  }

  onApprovalSubmited(event)
  {
    this.ReqUpdateProdPostApvObj = new ReqUpdateProductPostApprovalObj();
    this.ReqUpdateProdPostApvObj.ProdHId = this.prodHId, 
    this.ReqUpdateProdPostApvObj.TaskId = event[0].ApvTaskId, 
    this.ReqUpdateProdPostApvObj.Notes = event[0].Notes != undefined? event[0].Notes : "",
    this.ReqUpdateProdPostApvObj.Reason = event[0].ReasonCode, 
    this.ReqUpdateProdPostApvObj.Result = event[0].ApvResult
    this.http.post(URLConstant.UpdateProductPostApv, this.ReqUpdateProdPostApvObj).subscribe(
      () => { 
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_APPRV],{ });
      }
    );
  }
  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_APPRV],{ });
  }
}
