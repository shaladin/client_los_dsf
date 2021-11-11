import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { URLConstant } from "app/shared/constant/URLConstant";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { ApprovalTaskService } from "app/shared/services/ApprovalTask.service";
import { AdInsHelperService } from "app/shared/services/AdInsHelper.service";
import { MouCustObj } from "app/shared/model/mou-cust-obj.model";
import { ApvViewInfo } from "app/shared/model/apv-view-info.model";
import { UcViewGenericObj } from "app/shared/model/uc-view-generic-obj.model";
import { UcInputApprovalObj } from "app/shared/model/uc-input-approval-obj.model";
import { UcInputApprovalHistoryObj } from "app/shared/model/uc-input-approval-history-obj.model";
import { UcInputApprovalGeneralInfoObj } from "app/shared/model/uc-input-approval-general-info-obj.model";
import { ChangeMouTrxObj } from "app/shared/model/change-mou-trx-obj.model";
import { environment } from "environments/environment";
import { ApprovalObj } from "app/shared/model/approval/approval-obj.model";

@Component({
  selector: "app-change-mou-approval-factoring-x",
  templateUrl: "./change-mou-approval-factoring-x.component.html"
})
export class ChangeMouApprovalFactoringXComponent implements OnInit {
  mouCustObj: MouCustObj;
  MouCustId: number;
  taskId: number;
  instanceId: number;
  inputObj: ApvViewInfo;
  MouType: string = "FACTORING";
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  TrxNo: number;
  MrCustTypeCode: string;
  changeMouTrxId: number;
  changeMouCustId: number;
  ApvReqId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  changeMouTrxObj: ChangeMouTrxObj = new ChangeMouTrxObj();
  pageTitle: string;
  ChangeMouCustId: number;
  TrxType: string;
  TrxTypeReqExp:string = CommonConstant.CHANGE_MOU_TRX_TYPE_REQ_EXP;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private adInsHelperService: AdInsHelperService
  ) {

    this.route.queryParams.subscribe(params => {

      if (params["ChangeMouTrxId"] != null) {
        this.changeMouTrxId = params["ChangeMouTrxId"];
        this.taskId = params["TaskId"];
        this.TrxNo = params["TrxNo"];
        this.instanceId = params["InstanceId"];
        this.ApvReqId = params["ApvReqId"];
        this.MouCustId = params["MouCustId"];
        this.pageTitle = params["PageTitle"];
        this.ChangeMouCustId = params["ChangeMouCustId"];
        this.TrxType = params["TrxType"];
      }
    });
  }

  ngOnInit() {

    this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewChangeMouHeaderX.json";
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.viewGenericObj.whereValue = [this.ChangeMouCustId]

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
    this.InputApvObj.TrxNo = this.TrxNo.toString();
    this.IsReady = true;
  }

  HoldTask(obj) {
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CHANGE_MOU_APV_PAGING], {});
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

}
