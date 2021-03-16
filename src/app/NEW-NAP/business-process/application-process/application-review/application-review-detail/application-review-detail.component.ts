import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCrdRvwDObj } from 'app/shared/model/AppCrdRvwDObj.Model';
import { AppCrdRvwHObj } from 'app/shared/model/AppCrdRvwHObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { DeviationResultObj } from 'app/shared/model/DeviationResultObj.Model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { ScoringResultHObj } from 'app/shared/model/ScoringResultHObj.Model';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { environment } from 'environments/environment';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-application-review-detail',
  templateUrl: './application-review-detail.component.html',
  styleUrls: ['./application-review-detail.component.scss']
})
export class ApplicationReviewDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @ViewChild(UcapprovalcreateComponent) createComponent;
  appId: number = 0;
  wfTaskListId: number = 0;
  isReturnOn: boolean = false;
  UserAccess: any;
  Arr: FormArray;
  BizTemplateCode: string = "";
  InputObj: UcInputRFAObj;
  IsReady: boolean = false;
  readonly apvBaseUrl = environment.ApprovalR3Url;

  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;

  readonly CaptureStatReq: string = CommonConstant.CaptureStatReq;
  readonly CaptureStatScs: string = CommonConstant.CaptureStatScs;
  readonly CaptureStatFail: string = CommonConstant.CaptureStatFail;

  FormObj = this.fb.group({
    arr: this.fb.array([]),
    Reason: [''],
    ReasonDesc: [''],
    Notes: [''],
  });

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public toastr: NGXToastrService, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
    });

  }

  initData() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.Arr = this.FormObj.get('arr') as FormArray;
  }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.initData();
    await this.ClaimTask();
    await this.GetAppNo();
    await this.BindDDLRecommendation();
    await this.BindDDLReasonReturn();
    await this.BindCreditAnalysisItemFormObj();
    await this.BindAppvAmt();
    await this.GetExistingCreditReviewData();
    await this.GetCrdRvwCustInfoByAppId();
    this.initInputApprovalObj();
  }

  //#region Get Local Data
  ManualDeviationData: Array<DeviationResultObj> = new Array<DeviationResultObj>();
  BindManualDeviationData(ev) {
    console.log(ev);
    this.ManualDeviationData = ev;
  }

  onChangeApprover(ev) {
    this.FormObj.patchValue({
      ApproverDesc: ev.target.selectedOptions[0].text
    });
  }

  onChangeReason(ev) {
    this.FormObj.patchValue({
      ReasonDesc: ev.target.selectedOptions[0].text
    });
  }
  //#endregion

  //#region Get API Data
  appNo: string = "";
  async GetAppNo() {
    let obj = { Id: this.appId };
    await this.http.post<NapAppModel>(URLConstant.GetAppById, obj).toPromise().then(
      async (response) => {
        if (response != undefined) {
          this.appNo = response.AppNo;
          await this.GetCreditScoring(response.AppNo);
        }
      });
  }

  async ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    await this.http.post(URLConstant.ClaimTask, wfClaimObj).toPromise().then(
      (response) => {
      });
  }

  async GetCreditScoring(appNo: string) {
    let obj = { ScoringResultH: { TrxSourceNo: appNo } };
    await this.http.post(URLConstant.GetLatestScoringResultHByTrxSourceNo, obj).toPromise().then(
      (response) => {
        if (response["ScoringResultHObj"] != null) {
          let ScoringResult: ScoringResultHObj = response["ScoringResultHObj"];
          this.FormObj.patchValue({
            CreditScoring: ScoringResult.ScoringValue
          });
        } else {
          this.FormObj.patchValue({
            CreditScoring: "-"
          });
        }
      });
  }

  //#region DDL Data
  DDLData: { [id: string]: Array<{ Key: string, Value: string }> } = {};
  readonly DDLRecomendation: string = "RECOMENDED";
  async BindDDLRecommendation() {
    let Obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLRecomendation] = response[CommonConstant.ReturnObj];
      });
  }

  readonly DDLReason: string = "REASON";
  async BindDDLReasonReturn() {
    let obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLReason] = response[CommonConstant.ReturnObj];
      });
  }
  //#endregion

  ResponseExistCreditReview;
  async GetExistingCreditReviewData() {
    let Obj = { appCrdRvwHObj: { AppId: this.appId } };
    await this.http.post(URLConstant.GetAppCrdRvwById, Obj).toPromise().then(
      (response) => {
        this.ResponseExistCreditReview = response["appCrdRvwHObj"];
        if (this.ResponseExistCreditReview.appCrdRvwDObjs != null) {
          for (let i = 0; i < this.ResponseExistCreditReview.appCrdRvwDObjs.length; i++) {
            let idx = this.Arr.value.indexOf(this.Arr.value.find(x => x.QuestionCode == this.ResponseExistCreditReview.appCrdRvwDObjs[i].MrAnalysisItemCode));
            this.Arr.controls[idx].patchValue({
              Answer: this.ResponseExistCreditReview.appCrdRvwDObjs[i].AnalysisResult
            });
          }
        }
      });
  }

  async BindAppvAmt() {
    let Obj = { AppId: this.appId };
    await this.http.post(URLConstant.GetApprovalAmount, Obj).toPromise().then(
      (response) => {
        this.FormObj.patchValue({
          AppvAmt: response["ApvAmt"]
        });
        this.PlafondAmt = response["ApvAmt"];
      });
  }

  async BindCreditAnalysisItemFormObj() {
    let refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCrdRvwAnalysisItem };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        let temp = response[CommonConstant.ReturnObj];
        for (let i = 0; i < temp.length; i++) {
          let NewDataForm = this.fb.group({
            QuestionCode: temp[i].Key,
            Question: temp[i].Value,
            Answer: ["", Validators.required]
          }) as FormGroup;
          this.Arr.push(NewDataForm);
        }
      });
  }

  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  isShow: boolean = false;
  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { AppId: this.appId }).toPromise().then(
      (response) => {
        this.crdRvwCustInfoObj = response;
        this.isShow = true;
      }
    );
  }
  //#endregion

  switchForm() {
    this.FormObj.patchValue({
      Reason: "",
      ReasonDesc: "",
      Notes: ""
    });

    //if (!this.isReturnOn) {
    //  this.isReturnOn = true;;
    //  this.FormObj.controls.Reason.setValidators([Validators.required]);
    //  this.FormObj.controls.Notes.setValidators([Validators.required]);
    //} else {
    //  this.isReturnOn = false;
    //  this.FormObj.controls.Reason.clearValidators()
    //  this.FormObj.controls.Notes.clearValidators()
    //}
    //this.FormObj.controls.Reason.updateValueAndValidity();
    //this.FormObj.controls.Notes.updateValueAndValidity();

  }

  PlafondAmt: number = 0;
  initInputApprovalObj() {
    //this.PlafondAmt = 1000000;
    this.InputObj = new UcInputRFAObj();
    var Attributes = [{}];
    var attribute1 = {
      "AttributeName": "Approval Amount",
      "AttributeValue": this.PlafondAmt
    };
    Attributes.push(attribute1);

    var TypeCode = {
      "TypeCode": "APV_LIMIT",
      "Attributes": Attributes,
    };
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_APP_OPL_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_RENT_APP;
    this.InputObj.Reason = this.DDLData[this.DDLRecomendation];
    this.InputObj.TrxNo = this.appNo;
    this.IsReady = true;
  }

  //#region Submit
  SaveForm() {
    let ApprovalCreateOutput
    
    let temp = this.FormObj.value;
    let tempAppCrdRvwObj = new AppCrdRvwHObj();
    tempAppCrdRvwObj.AppId = this.appId;
    tempAppCrdRvwObj.SubmitDt = this.UserAccess.BusinessDt;
    tempAppCrdRvwObj.CrdRvwStat = CommonConstant.CrdRvwStatDone;
    tempAppCrdRvwObj.ReturnNotes = "";
    if (this.ResponseExistCreditReview != null) {
      tempAppCrdRvwObj.RowVersion = this.ResponseExistCreditReview.RowVersion;
    }
    tempAppCrdRvwObj.appCrdRvwDObjs = this.BindAppCrdRvwDObj(temp.arr);
    var flagId = 0;
    if (!this.isReturnOn) {
      ApprovalCreateOutput = this.createComponent.output();
      if (ApprovalCreateOutput == undefined) {
        return this.toastr.warningMessage('Failed to Get RFA Object');
      }
      else {
        flagId = 1;
      }
    }

    let apiObj = {
      appCrdRvwHObj: tempAppCrdRvwObj,
      ApprovedById: flagId,
      Reason: temp.ReasonDesc,
      Notes: temp.Notes,
      WfTaskListId: this.wfTaskListId,
      RowVersion: "",
      AppId: this.appId,
      ListDeviationResultObjs: this.ManualDeviationData,
      RequestRFAObj: ApprovalCreateOutput
    };
    this.http.post(URLConstant.CrdRvwMakeNewApproval, apiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_RVW_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  ReCaptureCreditReviewData() {
    let workflowApiObj = new WorkflowApiObj();
    workflowApiObj.TaskListId = this.wfTaskListId;
    this.http.post(URLConstant.CrdRvwDataReCapture, workflowApiObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_RVW_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  ReCaptureDataR2() {
    this.http.post(URLConstant.ReCaptureDataR2, { AppNo: this.appNo, CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId, RowVersion: this.crdRvwCustInfoObj.RowVersion }).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_RVW_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  BindAppCrdRvwDObj(objArr: any) {
    let AppCrdRvwDObjs = new Array();
    for (let i = 0; i < objArr.length; i++) {
      let temp = new AppCrdRvwDObj();
      temp.MrAnalysisItemCode = objArr[i].QuestionCode;
      temp.AnalysisResult = objArr[i].Answer;
      if (this.ResponseExistCreditReview.appCrdRvwDObjs != null) {
        let idx = this.ResponseExistCreditReview.appCrdRvwDObjs.indexOf(this.ResponseExistCreditReview.appCrdRvwDObjs.find(x => x.MrAnalysisItemCode == objArr[i].QuestionCode));
        temp.AppCrdRvwDId = this.ResponseExistCreditReview.appCrdRvwDObjs[idx].AppCrdRvwDId;
        temp.RowVersion = this.ResponseExistCreditReview.appCrdRvwDObjs[idx].RowVersion;
      }
      AppCrdRvwDObjs.push(temp);
    }
    return AppCrdRvwDObjs;
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
  //#endregion
}
