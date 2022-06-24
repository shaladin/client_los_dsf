import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { ApprovalObj } from "app/shared/model/approval/approval-obj.model";
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcViewGenericObj } from "app/shared/model/uc-view-generic-obj.model";
import { AdInsHelperService } from "app/shared/services/AdInsHelper.service";
import { ApprovalTaskService } from "app/shared/services/ApprovalTask.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-mou-unfreeze-apv-detail",
  templateUrl: "./mou-unfreeze-apv-detail.component.html",
  styles: [],
})

export class MouUnfreezeApvDetailComponent implements OnInit {
  TrxId: number;
  TrxNo: string;
  taskId: number;
  instanceId: number;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  ApvReqId: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private adInsHelperService: AdInsHelperService,
    private http: HttpClient, 
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params["TrxId"] != null) {
        this.TrxId = params["TrxId"];
        this.taskId = params["TaskId"];
        this.instanceId = params["InstanceId"];
        this.ApvReqId = params["ApvReqId"];
        this.TrxNo = params["TrxNo"];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";

    var ApvHoldObj = new ApprovalObj();
    ApvHoldObj.TaskId = this.taskId;


    this.HoldTask(ApvHoldObj);
    this.initInputApprovalObj();
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        this.router.navigate([NavigationConstant.MOU_FREEZE_APV_PAGING]);
      }
    );
  }

  onAvailableNextTask(event) { }

  onApprovalSubmited(event) {

    let ReqMouApvCustomObj = {
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.MouApproval, ReqMouApvCustomObj).subscribe(
      () => {
        this.toastr.successMessage("Success");
        this.router.navigate([NavigationConstant.MOU_FREEZE_APV_PAGING]);
      }
    );


  }

  onCancelClick() {
    this.router.navigate([NavigationConstant.MOU_FREEZE_APV_PAGING]);
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: event.ViewObj["CustNo"] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }

  initInputApprovalObj() {

    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.TrxNo = this.TrxNo;
    this.IsReady = true;
  }

}
