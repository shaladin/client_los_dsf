import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { LtkmReqObj } from 'app/shared/model/LTKM/LtkmReqObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';

@Component({
    selector: 'app-ltkm-verify-detail',
    templateUrl: './ltkm-verify-detail.component.html',
    styleUrls: []
})
export class LtkmVerifyDetailComponent implements OnInit {
    IsSurveyVerification: boolean = true;
    LtkmReqId: number = 0;
    LtkmNo: string = "";
    LtkmCustId: number = 0;
    wfTaskListId: number;
    ManualDeviationData;
    isExistedManualDeviationData;
    apvBaseUrl = environment.ApprovalR3Url;
    indentifierReason;
    indentifierApprover;
    ReturnHandlingHId: number = 0;
    ReturnHandlingDId: number = 0;
    BizTemplateCode: string = "";
    arrValue = [];
    AppId: number;
    IsFromApp: boolean = false;
    InputObj: UcInputRFAObj;
    private createComponent: UcapprovalcreateComponent;
    @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
        if (content) {
            // initially setter gets called with undefined
            this.createComponent = content;
        }
    }
    ApprovalCreateOutput: any;
    IsReady: boolean;
    AppNo: string;
    dmsObj: DMSObj;
    appNo: string;
    custNo: string;
    isDmsReady: boolean = false;

    ltkmReq: LtkmReqObj;
    ltkmAnalysisNotes: string = "";

    // ReturnForm = this.fb.group({
    //   ReturnReason: [''],
    //   ReturnReasonDesc: [''],
    //   ReturnExecNotes: [''],
    // });

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private fb: FormBuilder,
        private router: Router,
        private cookieService: CookieService) {
        this.route.queryParams.subscribe(params => {
            if (params["LtkmNo"] != null) {
                this.LtkmNo = params["LtkmNo"];
            }
            if (params["LtkmCustId"] != null) {
                this.LtkmCustId = params["LtkmCustId"];
            }
            if (params["WfTaskListId"] != null) {
                this.wfTaskListId = params["WfTaskListId"];
            }
            if (params["MrCustTypeCode"] != null) {
                this.CustTypeCode = params["MrCustTypeCode"];
            }
        });
    }

    FormObj = this.fb.group({
        arr: this.fb.array([]),
        Reason: [''],
        Notes: ['']
    });

    InitData() {
        this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
        this.DDLReason = new Array();
        this.DDLReasonReturn = new Array();
        this.AppStepIndex = 0;
        this.Arr = this.FormObj.get('arr') as FormArray;
        this.ManualDeviationData = new Array();
        this.isExistedManualDeviationData = false;
        this.isReturnOn = false;
    }

    AppStepIndex: number = 0;
    AppStep = {
        "CUST": 0,
        "APP": 1,
        "FRD": 2,
        "DEVC": 3,
        "APV": 4,
    };
    CustTypeCode;
    Arr;
    UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    ResponseExistCreditReview;
    DDLReason;
    DDLReasonReturn;
    async ngOnInit() {
        this.AppId = 0;
        this.arrValue.push(this.LtkmCustId);
        this.ClaimTask();
        this.InitData();
        await this.GetLtkmReqByLtkmNo();
        await this.BindDDLReason();
        await this.BindDDLReasonReturn();
        this.initInputApprovalObj();
        this.GetLtkmCust();
    }

    GetLtkmCust(isFromTabChange: boolean = false) {
        var reqObj = {
            LtkmCustId: this.LtkmCustId,
        };
        this.http.post(URLConstant.GetLtkmCustById, reqObj).subscribe(
            (response) => {
                this.CustTypeCode = response["MrCustTypeCode"];

                this.http.post(URLConstant.getLtkmReqByLtkmCustId, reqObj).subscribe(
                    (response) => {
                        if (response["ReturnObject"] != undefined) {
                            this.LtkmNo = response["ReturnObject"]["LtkmNo"];
                            if (response["ReturnObject"]["LtkmSrc"] == 'APP') {
                                this.IsFromApp = true;
                                this.AppId = response["ReturnObject"]["AppId"];
                            }
                        }
                    }
                );
            }
        );
    }

    //start develop urs los 057
    async GetLtkmReqByLtkmNo() {
        var Obj = { LtkmCustId: this.LtkmCustId };
        await this.http.post<LtkmReqObj>(URLConstant.getLtkmReqByLtkmCustId, Obj).toPromise().then(
            (response) => {
                this.ltkmReq = response["ReturnObject"];
                if (this.ltkmReq != undefined) {
                    this.ltkmAnalysisNotes = this.ltkmReq['LtkmAnalysisNotes'];
                }
            });
    }

    async BindDDLReason() {
        var Obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeLtkmVerify };
        await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
            (response) => {
                this.DDLReason = response[CommonConstant.ReturnObj];
            });
    }
    //end develop urs los 057

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

    onChangeApprover(ev) {
        this.FormObj.patchValue({
            ApproverDesc: ev.target.selectedOptions[0].text
        });
    }

    EnterTab(AppStep) {
        switch (AppStep) {
            case CommonConstant.AppStepCust:
                this.AppStepIndex = this.AppStep[CommonConstant.AppStepCust];
                break;
            case CommonConstant.AppStepApp:
                this.AppStepIndex = this.AppStep[CommonConstant.AppStepApp];
                break;
            case CommonConstant.AppStepFraud:
                this.AppStepIndex = this.AppStep[CommonConstant.AppStepFraud];
                break;
            case CommonConstant.AppStepDev:
                this.AppStepIndex = this.AppStep[CommonConstant.AppStepDev];
                break;
            case CommonConstant.AppStepApv:
                this.AppStepIndex = this.AppStep[CommonConstant.AppStepApv];
                break;

            default:
                break;
        }
    }

    SaveForm() {
        console.log('richard check here');
        var temp = this.FormObj.value;
        var tempLtkmReqSubmitVerify = this.ltkmReq;
        tempLtkmReqSubmitVerify.LtkmStep = CommonConstant.LtkmStepApproval;

        if (!this.isReturnOn) {
            this.ApprovalCreateOutput = this.createComponent.output();
        }
        var apiObj = {
            LtkmCustId: this.LtkmCustId,
            Notes: temp.Notes,
            WfTaskListId: this.wfTaskListId,
            RequestRFAObj: this.ApprovalCreateOutput
        }
        this.http.post(URLConstant.SubmitLtkmVerify, apiObj).subscribe(
            (response) => {
                AdInsHelper.RedirectUrl(this.router, ["Ltkm/Verify/Paging"], {});
            });
    }

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


    ClaimTask() {
        var wfClaimObj = new ClaimWorkflowObj();
        wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
        wfClaimObj.pUserID = this.UserAccess.UserName;

        this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
            (response) => {
            });
    }

    initInputApprovalObj() {
        this.InputObj = new UcInputRFAObj(this.cookieService);
        var Attributes = []
        var attribute1 = {
            "AttributeName": "LTKM Analysis Notes",
            "AttributeValue": this.ltkmAnalysisNotes
        };
        Attributes.push(attribute1);

        var TypeCode = {
            "TypeCode": "AML_APV_TYPE",
            "Attributes": Attributes,
        };
        this.InputObj.RequestedBy = this.UserAccess.UserName;
        this.InputObj.OfficeCode = this.UserAccess.OfficeCode;
        this.InputObj.ApvTypecodes = [TypeCode];
        this.InputObj.EnvUrl = environment.FoundationR3Url;
        this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
        this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
        this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
        this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
        this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
        this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
        this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
        this.InputObj.CategoryCode = CommonConstant.CAT_CODE_AML_APV;
        this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_AML_APV;
        this.InputObj.Reason = this.DDLReason;
        this.InputObj.TrxNo = this.LtkmNo //richard
        this.IsReady = true;
    }
    cancel() {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LTKM_VERIFY_PAGING], {});
    }
}
