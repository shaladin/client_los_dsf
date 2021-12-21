import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {environment} from 'environments/environment';
import {CommonConstant} from 'app/shared/constant/CommonConstant';
import {URLConstant} from 'app/shared/constant/URLConstant';
import {AdInsHelper} from 'app/shared/AdInsHelper';
import {UcInputRFAObj} from 'app/shared/model/uc-input-rfa-obj.model';
import {UcapprovalcreateComponent} from '@adins/ucapprovalcreate';
import {DMSObj} from 'app/shared/model/dms/dms-obj.model';
import {LtkmReqObj} from 'app/shared/model/ltkm/ltkm-req-obj.model';
import {NavigationConstant} from 'app/shared/constant/NavigationConstant';
import {CookieService} from 'ngx-cookie';
import {CurrentUserContext} from 'app/shared/model/current-user-context.model';
import {ClaimTaskService} from 'app/shared/claimTask.service';
import {NGXToastrService} from 'app/components/extra/toastr/toastr.service';

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
    wfTaskListId: any;
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

    isCustTypePersonal: boolean = true;


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
        private cookieService: CookieService,
        private claimTaskService: ClaimTaskService,
        private toastr: NGXToastrService
    ) {
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
                this.CustTypeCode == 'PERSONAL' ? this.isCustTypePersonal = true : this.isCustTypePersonal = false;
            }
        });
    }

    FormObj = this.fb.group({
        arr: this.fb.array([]),
        Reason: [''],
        Notes: ['']
    });

    FormReturnObj  =this.fb.group({
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
        var Obj = { Id: this.LtkmCustId };
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
    RFAInfo: Object = new Object();
    SaveForm() {
        this.RFAInfo = {RFAInfo: this.FormObj.controls.RFAInfo.value};
        var temp = this.FormObj.value;

        if (!this.isReturnOn) {
            this.ApprovalCreateOutput = this.createComponent.output();
        }
        var apiObj = {
            LtkmCustId: this.LtkmCustId,
            Notes: temp.Notes,
            WfTaskListId: this.wfTaskListId,
            RequestRFAObj: this.RFAInfo
        }
        let submitLtkmUrl = environment.isCore? URLConstant.SubmitLtkmVerifyV2 : URLConstant.SubmitLtkmVerify;
        this.http.post(submitLtkmUrl, apiObj).subscribe(
            (response) => {
                this.toastr.successMessage(response["message"]);
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LTKM_VERIFY_PAGING], {});
        });
    }

    SaveReturnForm(){
        var temp = this.FormReturnObj.value;
        console.log(this.FormReturnObj);
        var apiObj = {
            LtkmCustId: this.LtkmCustId,
            Notes: temp.Notes,
            WfTaskListId: this.wfTaskListId,
            RequestRFAObj: this.RFAInfo
        }
        let submitLtkmUrl = environment.isCore? URLConstant.SubmitLtkmVerifyV2 : URLConstant.SubmitLtkmVerify;
        this.http.post(submitLtkmUrl, apiObj).subscribe(
            (response) => {
                this.toastr.successMessage(response["message"]);
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LTKM_VERIFY_PAGING], {});
        });
    }

    isReturnOn: boolean = false;
    switchForm() {
        this.FormReturnObj.patchValue({
            Reason: "",
            ReasonDesc: "",
            Notes: ""
        });

        if (!this.isReturnOn) {
            this.isReturnOn = true;;
            this.FormReturnObj.controls.Reason.setValidators([Validators.required]);
            this.FormReturnObj.controls.Notes.setValidators([Validators.required]);
        } else {
            this.isReturnOn = false;
            this.FormReturnObj.controls.Reason.clearValidators()
            this.FormReturnObj.controls.Notes.clearValidators()
        }
        this.FormReturnObj.controls.Reason.updateValueAndValidity();
        this.FormReturnObj.controls.Notes.updateValueAndValidity();
    }


    ClaimTask() {
        if(environment.isCore){
            if(this.wfTaskListId!= "" && this.wfTaskListId!= undefined){
                this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
            }
        }
        else if (this.wfTaskListId> 0) {
            this.claimTaskService.ClaimTask(this.wfTaskListId);
        }
    }

    initInputApprovalObj() {
        this.InputObj = new UcInputRFAObj(this.cookieService);

        // var attribute1 = {
        //     "AttributeName": "LTKM Analysis Notes",
        //     "AttributeValue": this.ltkmAnalysisNotes
        // };
        // Attributes.push(attribute1);
        let Attributes = [{}]
        var TypeCode = {
            "TypeCode": "AML_APV_TYPE",
            "Attributes": Attributes,
        };
        this.InputObj.ApvTypecodes = [TypeCode];
        this.InputObj.CategoryCode = CommonConstant.CAT_CODE_AML_APV;
        this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_AML_APV;
        this.InputObj.Reason = this.DDLReason;
        this.InputObj.TrxNo = this.LtkmNo;
        this.IsReady = true;
    }

    cancel() {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LTKM_VERIFY_PAGING], {});
    }

}
