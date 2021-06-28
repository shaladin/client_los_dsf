import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { LtkmReqObj } from 'app/shared/model/LTKM/LtkmReqObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

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
            var obj = {
                taskId: params["TaskId"],
                instanceId: params["InstanceId"],
                approvalBaseUrl: environment.ApprovalR3Url
            }
            this.inputObj = obj;

            var ApvHoldObj = new ApprovalObj()
            ApvHoldObj.TaskId = obj.taskId

            this.HoldTask(ApvHoldObj);
        });
    }
    async ngOnInit(): Promise<void> {
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
        this.isReturnOn = false;
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
    onChangeReason(ev) {
        this.FormObj.patchValue({
            ReasonDesc: ev.target.selectedOptions[0].text
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
        this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
        this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
        this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

        this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
        this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
        this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
        this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

        this.InputApvObj = new UcInputApprovalObj();
        this.InputApvObj.TaskId = this.taskId;
        this.InputApvObj.TrxNo = this.LtkmNo;
        this.InputApvObj.RequestId = this.ApvReqId;

        this.IsReady = true;
    }

    FormObj = this.fb.group({
        arr: this.fb.array([]),
        Reason: [''],
        Notes: ['']
    });

    isReturnOn: boolean = false;
    switchForm() {
        this.FormObj.patchValue({
            Reason: "",
            ReasonDesc: "",
            Notes: ""
        });

        if (!this.isReturnOn) {
            this.isReturnOn = true;;
            this.FormObj.controls.Reason.setValidators([Validators.required]);
            this.FormObj.controls.Notes.setValidators([Validators.required]);
        } else {
            this.isReturnOn = false;
            this.FormObj.controls.Reason.clearValidators()
            this.FormObj.controls.Notes.clearValidators()
        }
        this.FormObj.controls.Reason.updateValueAndValidity();
        this.FormObj.controls.Notes.updateValueAndValidity();
    }

    SaveForm() {
        var apiObj = {
            WfTaskListId: this.WfTaskListId,
            ApvReqId: this.ApvReqId
        }
        this.http.post(URLConstant.SubmitLtkmReturnAtApv, apiObj).subscribe(
            (response) => {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LTKM_VERIFY_APV_PAGING], {});
            });
    }
}
