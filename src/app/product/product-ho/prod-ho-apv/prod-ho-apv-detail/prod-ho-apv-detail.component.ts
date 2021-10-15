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
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
@Component({
  selector: 'app-prod-ho-apv-detail',
  templateUrl: './prod-ho-apv-detail.component.html'
})
export class ProdHoApvDetailComponent implements OnInit {

  ProdHId: number;
  TaskId: number;
  ApvReqId: number;
  IsReady: boolean = false;
  IsRoleAssignment: string = "";
  GenericByIdObj : GenericObj = new GenericObj();
  InputApvObj : UcInputApprovalObj = new UcInputApprovalObj();
  ReqUpdateProdPostApvObj : ReqUpdateProductPostApprovalObj = new ReqUpdateProductPostApprovalObj();
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdHId"] != null) {
        this.ProdHId = params["ProdHId"];
        this.TaskId = params["TaskId"];
        this.ApvReqId = params["ApvReqId"];
        this.IsRoleAssignment = params["IsRoleAssignment"];
      }
    });
  }

  ngOnInit() {
    let ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.TaskId;

    if(this.IsRoleAssignment != CommonConstant.TRUE){
      this.HoldTask(ApvHoldObj);
    }
    this.initInputApprovalObj();
  }

  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.TaskId;

    this.InputApvObj.TaskId = this.TaskId;
    this.InputApvObj.RequestId = this.ApvReqId;

    this.GenericByIdObj.Id = this.ProdHId;
    this.http.post(URLConstant.GetProductByHId, this.GenericByIdObj).subscribe(
      (response : GenericObj) => {
        this.InputApvObj.TrxNo = response.Code;
        this.IsReady = true;
      });
  }

  HoldTask(obj) {
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      }
    )
  }

  onApprovalSubmited(event)
  {
    let reqProdHoApvCustomObj = {
      Id: this.ProdHId,
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.ProdHOApproval, reqProdHoApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_APPRV],{ });
      }
    );
  }
  
  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_APPRV], {});
  }
}
