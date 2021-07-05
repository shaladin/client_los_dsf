import { Component, OnInit } from "@angular/core";
import { environment } from "environments/environment";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { ActivatedRoute, Router } from "@angular/router";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { HttpClient } from "@angular/common/http";
import { ApprovalObj } from "app/shared/model/Approval/ApprovalObj.Model";
import { URLConstant } from "app/shared/constant/URLConstant";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { UcInputApprovalObj } from "app/shared/model/UcInputApprovalObj.Model";
import { UcInputApprovalHistoryObj } from "app/shared/model/UcInputApprovalHistoryObj.Model";
import { UcInputApprovalGeneralInfoObj } from "app/shared/model/UcInputApprovalGeneralInfoObj.model";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";

@Component({
  selector: "app-change-mou-approval-financing",
  templateUrl: "./change-mou-approval-financing.component.html"
})
export class ChangeMouApprovalFinancingComponent implements OnInit {
  changeMouTrxId: number;
  resultData: any;
  changeMouCustId: number;
  taskId: number;
  TrxNo: string;
  instanceId: number;
  ApvReqId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  IsReady: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params["ChangeMouTrxId"] != null) {
        this.changeMouTrxId = params["ChangeMouTrxId"];
        this.taskId = params["TaskId"];
        this.instanceId = params["InstanceId"];
        this.ApvReqId = params["ApvReqId"];
        this.TrxNo = params["TrxNo"];
      }
    });
  }

  ngOnInit() {

    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewChangeMouHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.viewGenericObj.whereValue = [this.changeMouCustId]

    var ApvHoldObj = new ApprovalObj();
    ApvHoldObj.TaskId = this.taskId; 

    this.HoldTask(ApvHoldObj);
    this.initInputApprovalObj();
  }

  initInputApprovalObj() {
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
    this.InputApvObj.PathUrlGetChangeFinalLevel =
      URLConstant.GetCanChangeMinFinalLevel;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.TrxNo = this.TrxNo.toString();
    this.IsReady = true;

  }

  HoldTask(obj) {
    this.http
      .post(AdInsConstant.ApvHoldTaskUrl, obj)
      .subscribe((response) => { });
  }

  onApprovalSubmited(event) {
    let ReqMouApvCustomObj = {
      Tasks: event.Tasks
    };

    this.http.post(URLConstant.MouApproval, ReqMouApvCustomObj).subscribe(
      () => {
        this.toastr.successMessage("Success");
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CHANGE_MOU_APV_PAGING], {});
      }
    );
  }
  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CHANGE_MOU_APV_PAGING], {});
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData["CustNo"] };
      this.http
        .post(URLConstant.GetCustByCustNo, custObj)
        .subscribe((response) => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }
}
