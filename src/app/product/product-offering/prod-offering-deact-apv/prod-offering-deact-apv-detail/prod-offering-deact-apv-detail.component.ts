import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';

@Component({
  selector: 'app-prod-offering-deact-apv-detail',
  templateUrl: './prod-offering-deact-apv-detail.component.html'
})
export class ProdOfferingDeactApvDetailComponent implements OnInit {
  TaskId: number;
  ApvReqId: number;
  ProdOfferingId: number;
  ProdOfferingHId: number;
  IsReady: boolean = false;
  GenericByIdObj: GenericObj = new GenericObj();
  ViewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  InputApvObj: UcInputApprovalObj = new UcInputApprovalObj();
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdOfferingHId"] != null) {
        this.ProdOfferingHId = params["ProdOfferingHId"];
        this.TaskId = params["TaskId"];
        this.ApvReqId = params["ApvReqId"];
        this.ProdOfferingId = params["ProdOfferingId"];
      }
    });
  }

  ngOnInit() {
    this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductOfferingMainInformationForDeactApv.json";

    let ApvHoldObj = new ApprovalObj();
    ApvHoldObj.TaskId = this.TaskId;

    this.HoldTask(ApvHoldObj);
    this.initInputApprovalObj();
  }

  HoldTask(obj) {
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_OFFERING_DEACTIVATE_APPRV], {});
      }
    )
  }

  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.TaskId;

    this.InputApvObj.TaskId = this.TaskId;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;

    this.GenericByIdObj.Id = this.ProdOfferingId;
    this.http.post(URLConstant.GetProdOfferingByProdOfferingId, this.GenericByIdObj).subscribe(
      (response) => {
        this.InputApvObj.TrxNo = response["ProdOfferingCode"];
        this.IsReady = true;
      });
  }

  onApprovalSubmited(event) {
    let reqProdHoApvCustomObj = {
      Id: this.ProdOfferingHId,
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.ProdOfferingApproval, reqProdHoApvCustomObj).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_OFFERING_DEACTIVATE_APPRV], {});
      }
    );
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_OFFERING_DEACTIVATE_APPRV], {});
  }
}
