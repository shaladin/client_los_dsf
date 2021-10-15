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
import { ReqUpdateProdOfferingPostApprovalObj } from 'app/shared/model/Request/Product/ReqAddEditProdOfferingObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
@Component({
  selector: 'app-prod-offering-apv-detail',
  templateUrl: './prod-offering-apv-detail.component.html'
})
export class ProdOfferingApvDetailComponent implements OnInit {

  ProdOfferingHId: number;
  TaskId: number;
  ApvReqId: number;
  IsReady: boolean = false;
  IsRoleAssignment: string = "";
  GenericByIdObj: GenericObj = new GenericObj();
  InputApvObj : UcInputApprovalObj = new UcInputApprovalObj();
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj= new UcInputApprovalGeneralInfoObj();
  ReqUpdateProdOffPostApvObj : ReqUpdateProdOfferingPostApprovalObj = new ReqUpdateProdOfferingPostApprovalObj();

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdOfferingHId"] != null) {
        this.ProdOfferingHId = params["ProdOfferingHId"];
        this.TaskId = params["TaskId"];
        this.ApvReqId = params["ApvReqId"];
        this.IsRoleAssignment = params["IsRoleAssignment"];
      }
    });
   }

  ngOnInit() {
    let ApvHoldObj = new ApprovalObj();
    ApvHoldObj.TaskId = this.TaskId;

    if(this.IsRoleAssignment != CommonConstant.TRUE){
      this.HoldTask(ApvHoldObj);
    }
    this.initInputApprovalObj();
  }

  HoldTask(obj){
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{
      }
    )
  }

  initInputApprovalObj(){
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.TaskId;

    this.InputApvObj.TaskId = this.TaskId;
    this.InputApvObj.RequestId = this.ApvReqId;

    this.GenericByIdObj.Id = this.ProdOfferingHId;
    this.http.post(URLConstant.GetProdOfferingHById, this.GenericByIdObj).subscribe(
      (response) => {
        this.InputApvObj.TrxNo = response["ProdOfferingCode"];
        this.IsReady = true;
      });
  }
 
  onApprovalSubmited(event)
  {
    let reqProdHoApvCustomObj = {
      Id: this.ProdOfferingHId,
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.ProdOfferingApproval, reqProdHoApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_OFFERING_APPRV],{ });
      }
    );
  }

  onCancelClick()
  {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_OFFERING_APPRV],{ });
  }
}
