import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { environment } from "environments/environment";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { ApprovalObj } from "app/shared/model/Approval/ApprovalObj.Model";
import { UcInputApprovalObj } from "app/shared/model/UcInputApprovalObj.Model";
import { UcInputApprovalHistoryObj } from "app/shared/model/UcInputApprovalHistoryObj.Model";
import { UcInputApprovalGeneralInfoObj } from "app/shared/model/UcInputApprovalGeneralInfoObj.model";
import { ChangeMouTrxObj } from "app/shared/model/ChangeMouTrxObj.Model";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";

@Component({
  selector: "app-change-mou-approval-general",
  templateUrl: "./change-mou-approval-general.component.html",
  styleUrls: []
})
export class ChangeMouApprovalGeneralComponent implements OnInit {
  MouCustId: number;
  taskId: number;
  instanceId: number;
  MouType: string = CommonConstant.GENERAL;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  MrCustTypeCode: string;
  TrxNo: number;
  changeMouTrxId: number;
  changeMouCustId: number;
  ApvReqId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  changeMouTrxObj: ChangeMouTrxObj = new ChangeMouTrxObj();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params["ChangeMouTrxId"] != null) {
        this.changeMouTrxId = params["ChangeMouTrxId"];
        this.taskId = params["TaskId"];
        this.TrxNo = params["TrxNo"];
        this.instanceId = params["InstanceId"];
        this.ApvReqId = params["ApvReqId"];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeaderFactoring.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];

    var ApvHoldObj = new ApprovalObj()
    ApvHoldObj.TaskId = this.taskId

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
    this.InputApvObj.PathUrlGetChangeFinalLevel = URLConstant.GetCanChangeMinFinalLevel;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.TrxNo = this.TrxNo.toString();
    this.IsReady = true;
  }

  HoldTask(obj) {
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      }
    )
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
    console.log(event); // cek dapat apa
    // if (event.Key == "customer") {
    //   var custObj = { CustNo: this.custno }; // nanti cek CustNo ada /gak
    //   this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
    //     response => {
    //       AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
    //     });
    // }

  }

}
