import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-prod-ho-deact-apv-detail',
  templateUrl: './prod-ho-deact-apv-detail.component.html'
})
export class ProdHoDeactApvDetailComponent implements OnInit {

  prodHId: number;
  taskId: number;
  instanceId: number;
  inputObj: any;
  IsReady: boolean = false;
  ApvReqId: number;
  GenericByIdObj : GenericObj = new GenericObj();
  InputApvObj : UcInputApprovalObj = new UcInputApprovalObj();
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();

  constructor(private router: Router, 
              private route: ActivatedRoute,
              private http:HttpClient) { 
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
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformationForDeactApv.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    
    var obj = {
      taskId: this.taskId,
      instanceId: this.instanceId,
      approvalBaseUrl: environment.ApprovalR3Url
    }

    this.inputObj = obj;
    
    var ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = obj.taskId

    this.HoldTask(ApvHoldObj);
    this. initInputApprovalObj();
  }

  initInputApprovalObj(){
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

  onApprovalSubmited()
  {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE_APPRV],{ });
  }
  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE_APPRV],{ });
  }
}
