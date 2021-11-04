import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { AppObj } from 'app/shared/model/apps/apps.model';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { LtkmReqObj } from 'app/shared/model/ltkm/ltkm-req-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';

@Component({
    selector: 'app-ltkm-approval-detail',
    templateUrl: './ltkm-approval-detail.component.html',
    styleUrls: []
})
export class LtkmApprovalDetailComponent implements OnInit {
    IsSurveyVerification: boolean = true;
    LtkmNo: string;
    LtkmCustId: Number;
    mrCustTypeCode: string;
    viewObj: string;
    arrValue = [];
    type: string;
    inputObj: { taskId: number; instanceId: number; approvalBaseUrl: string; };
    ManualDeviationData;
    isExistedManualDeviationData;
    BizTemplateCode: string;
    AppObj: AppObj;
    ApvReqId: number;
    InputApvObj: UcInputApprovalObj;
    InputApprovalHistoryObj: UcInputApprovalHistoryObj;
    UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
    IsReady: boolean = false;
    taskId: number;
    WfTaskListId: number;
    dmsObj: DMSObj;
    custNo: string;
    appNo: string;
    rootServer: string;
    isDmsReady: boolean = false;
    ltkmReq: LtkmReqObj;
    ltkmAnalysisNotes: string = "";
    DDLReason;
    DDLReasonReturn;
    IsGsReturn: boolean = false;

    constructor(private toastr: NGXToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private http: HttpClient) {
        this.route.queryParams.subscribe(params => {
            if (params["LtkmNo"] != null) {
                this.LtkmNo = params["LtkmNo"];
            }
            if (params["LtkmCustId"] != null) {
                this.LtkmCustId = params["LtkmCustId"];
            }
            if (params["MrCustTypeCode"] != null) {
                this.mrCustTypeCode = params["MrCustTypeCode"];
            }
            if (params["ApvReqId"] != null) {
                this.ApvReqId = params["ApvReqId"];
            }
            if (params["TaskId"] != null) {
                this.taskId = params["TaskId"];
            }
            if (params["WfTaskListId"] != null) {
                this.WfTaskListId = params["WfTaskListId"];
            }
        });
    }
    async ngOnInit(): Promise<void> {
        var ApvHoldObj = new ApprovalObj()
        ApvHoldObj.TaskId = this.taskId;

        this.HoldTask(ApvHoldObj);

        this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
        this.arrValue.push(this.LtkmCustId);
        this.InitData();
        await this.GetLtkmReqByLtkmNo();
        await this.BindDDLReasonReturn();
        this.initInputApprovalObj();
        this.SetIsGsReturn();
    }

    SetIsGsReturn() {
        var generalSettingObj: GenericObj = new GenericObj();
        generalSettingObj.Code = "IS_LTKM_VERF_APV_RETURN";
        this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).subscribe(
            (response) => {
                if (response["GsValue"] == "0")
                    this.IsGsReturn = false
                else
                    this.IsGsReturn = true
            });
    }

    InitData() {
        this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
        this.DDLReason = new Array();
        this.DDLReasonReturn = new Array();
    }

    async GetLtkmReqByLtkmNo() {
        await this.http.post<LtkmReqObj>(URLConstant.getLtkmReqByLtkmCustId, { Id: this.LtkmCustId }).toPromise().then(
            (response) => {
                this.ltkmReq = response["ReturnObject"];
                if (this.ltkmReq != undefined) {
                    this.ltkmAnalysisNotes = this.ltkmReq['LtkmAnalysisNotes'];
                }
            });
    }

    async BindDDLReasonReturn() {
        var obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
        await this.http.post(URLConstant.GetListActiveRefReason, obj).toPromise().then(
            (response) => {
                this.DDLReasonReturn = response[CommonConstant.ReturnObj];
            });
    }

    HoldTask(obj) {
        this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
            (response) => {
            },
            (error) => {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LTKM_VERIFY_APV_PAGING], {});
            }
        )
    }

    onApprovalSubmited(event) {
        let ReqLtkmApvCustomObj = {
            Tasks: event.Tasks
        }

        this.http.post(URLConstant.LtkmApproval, ReqLtkmApvCustomObj).subscribe(
            () => {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LTKM_VERIFY_APV_PAGING], {});
            }
        );
    }

    onCancelClick() {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LTKM_VERIFY_APV_PAGING], {});
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
        this.InputApvObj.TrxNo = this.LtkmNo;
        this.InputApvObj.RequestId = this.ApvReqId;

        this.IsReady = true;
    }

}
