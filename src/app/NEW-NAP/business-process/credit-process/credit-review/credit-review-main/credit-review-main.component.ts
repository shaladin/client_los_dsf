import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { AppCrdRvwHObj } from 'app/shared/model/AppCrdRvwHObj.Model';
import { AppCrdRvwDObj } from 'app/shared/model/AppCrdRvwDObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { ScoringResultHObj } from 'app/shared/model/ScoringResultHObj.Model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { DMSKeyObj } from 'app/shared/model/DMS/DMSKeyObj.Model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';

@Component({
  selector: 'app-credit-review-main',
  templateUrl: './credit-review-main.component.html',
  styleUrls: []
})
export class CreditReviewMainComponent implements OnInit {

  appId: number = 0;
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
  dmsObj: DMSObj;
  dmsKeyObj: DMSKeyObj;
  rootServer: string;
  appNo: string;
  custNo: string;
  isDmsReady: boolean = false;

  // ReturnForm = this.fb.group({
  //   ReturnReason: [''],
  //   ReturnReasonDesc: [''],
  //   ReturnExecNotes: [''],
  // });

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
    });
  }

  FormObj = this.fb.group({
    arr: this.fb.array([]),
    AppvAmt: [''],
    CreditScoring: [''],
    Reason: ['', Validators.required],
    ReasonDesc: [""],
    Approver: ['', Validators.required],
    ApproverDesc: [""],
    Notes: ['', Validators.required]
  });


  InitData() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    this.DDLRecommendation = new Array();
    this.DDLReasonReturn = new Array();
    this.AppStepIndex = 0;
    this.CustTypeCode = "";
    this.Arr = this.FormObj.get('arr') as FormArray;
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.ManualDeviationData = new Array();
    this.isExistedManualDeviationData = false;
    this.isReturnOn = false;
  }

  viewProdMainInfoObj;
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
  UserAccess;
  ResponseExistCreditReview;
  DDLRecommendation;
  DDLReasonReturn;
  async ngOnInit() {
    this.arrValue.push(this.appId);
    this.ClaimTask();
    this.InitData();
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppNo();
    await this.GetAppCustData();
    await this.BindDDLRecommendation();
    await this.BindDDLReasonReturn();
    await this.BindCreditAnalysisItemFormObj();
    await this.BindAppvAmt();
    await this.GetExistingCreditReviewData();
    this.InitDms();
  }

  async InitDms(){
    this.dmsObj = new DMSObj();
    this.dmsObj.User = "Admin";
    this.dmsObj.Role = "SUPUSR";
    this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
    var appObj = { AppId: this.appId };
    await this.http.post(URLConstant.GetAppCustByAppId, appObj).toPromise().then(
      (response)=>{
        this.custNo = response['CustNo'];
      }
    );
    this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));

    this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
    // this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, "2333333"));
    this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));

    this.dmsKeyObj = new DMSKeyObj();
    this.dmsKeyObj.k = CommonConstant.DmsKey;
    this.dmsKeyObj.iv = CommonConstant.DmsIV;
    this.rootServer = environment.DMSUrl;
    this.isDmsReady = true;
  }


  async GetAppNo() {
    var obj = { AppId: this.appId };
    await this.http.post<NapAppModel>(URLConstant.GetAppById, obj).toPromise().then(
      (response) => {
        if (response != undefined){
          this.GetCreditScoring(response["AppNo"]);
          this.appNo = response["AppNo"];
        }
      });
  }

  GetCreditScoring(appNo: string) {
    var obj = { ScoringResultH: { TrxSourceNo: appNo } };
    this.http.post(URLConstant.GetLatestScoringResultHByTrxSourceNo, obj).toPromise().then(
      (response) => {
        if (response["ScoringResultHObj"] != null) {
          var ScoringResult: ScoringResultHObj = response["ScoringResultHObj"];
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

  async GetAppCustData() {
    var obj = {
      AppId: this.appId,
      RowVersion: ""
    };

    await this.http.post(URLConstant.GetAppCustByAppId, obj).toPromise().then(
      (response) => {
        this.CustTypeCode = response["MrCustTypeCode"];
      });
  }

  async BindCreditAnalysisItemFormObj() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCrdRvwAnalysisItem };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        var temp = response[CommonConstant.ReturnObj];
        for (var i = 0; i < temp.length; i++) {
          var NewDataForm = this.fb.group({
            QuestionCode: temp[i].Key,
            Question: temp[i].Value,
            Answer: ["", Validators.required]
          }) as FormGroup;
          this.Arr.push(NewDataForm);
        }
      });
  }

  async BindAppvAmt() {
    var Obj = { AppId: this.appId };
    await this.http.post(URLConstant.GetAppFinDataByAppId, Obj).toPromise().then(
      (response) => {
        this.FormObj.patchValue({
          AppvAmt: response["ApvAmt"]
        });
      });
  }

  async GetExistingCreditReviewData() {
    var Obj = { appCrdRvwHObj: { AppId: this.appId } };
    await this.http.post(URLConstant.GetAppCrdRvwById, Obj).toPromise().then(
      (response) => {
        this.ResponseExistCreditReview = response["appCrdRvwHObj"];
        if (this.ResponseExistCreditReview.appCrdRvwDObjs != null) {
          for (var i = 0; i < this.ResponseExistCreditReview.appCrdRvwDObjs.length; i++) {
            var idx = this.Arr.value.indexOf(this.Arr.value.find(x => x.QuestionCode == this.ResponseExistCreditReview.appCrdRvwDObjs[i].MrAnalysisItemCode));
            this.Arr.controls[idx].patchValue({
              Answer: this.ResponseExistCreditReview.appCrdRvwDObjs[i].AnalysisResult
            });
          }
        }
      });
  }

  async BindDDLRecommendation() {
    var Obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLRecommendation = response[CommonConstant.ReturnObj];
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
    var temp = this.FormObj.value;
    var tempAppCrdRvwObj = new AppCrdRvwHObj();
    tempAppCrdRvwObj.AppId = this.appId;
    tempAppCrdRvwObj.SubmitDt = this.UserAccess.BusinessDt;
    tempAppCrdRvwObj.CrdRvwStat = CommonConstant.CrdRvwStatDone;
    tempAppCrdRvwObj.ReturnNotes = "";
    if (this.ResponseExistCreditReview != null) {
      tempAppCrdRvwObj.RowVersion = this.ResponseExistCreditReview.RowVersion;
    }
    tempAppCrdRvwObj.appCrdRvwDObjs = this.BindAppCrdRvwDObj(temp.arr);

    if (this.isReturnOn)
      temp.Approver = 0;

    var apiObj = {
      appCrdRvwHObj: tempAppCrdRvwObj,
      ApprovedById: temp.Approver,
      Reason: temp.ReasonDesc,
      Notes: temp.Notes,
      WfTaskListId: this.wfTaskListId,
      RowVersion: "",
      AppId: this.appId,
      ListDeviationResultObjs: this.ManualDeviationData
    }
    this.http.post(URLConstant.AddOrEditAppCrdRvwDataAndListManualDeviationData, apiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,["Nap/CreditProcess/CreditReview/Paging"], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  BindAppCrdRvwDObj(objArr) {
    var AppCrdRvwDObjs = new Array();
    for (var i = 0; i < objArr.length; i++) {
      var temp = new AppCrdRvwDObj();
      temp.MrAnalysisItemCode = objArr[i].QuestionCode;
      temp.AnalysisResult = objArr[i].Answer;
      if (this.ResponseExistCreditReview.appCrdRvwDObjs != null) {
        var idx = this.ResponseExistCreditReview.appCrdRvwDObjs.indexOf(this.ResponseExistCreditReview.appCrdRvwDObjs.find(x => x.MrAnalysisItemCode == objArr[i].QuestionCode));
        temp.AppCrdRvwDId = this.ResponseExistCreditReview.appCrdRvwDObjs[idx].AppCrdRvwDId;
        temp.RowVersion = this.ResponseExistCreditReview.appCrdRvwDObjs[idx].RowVersion;
      }
      AppCrdRvwDObjs.push(temp);
    }
    return AppCrdRvwDObjs;
  }

  CheckDeviationData() {
  }

  BindManualDeviationData(ev) {
    this.ManualDeviationData = ev;
    this.isExistedManualDeviationData = true;
  }

  isReturnOn;
  switchForm() {
    this.FormObj.patchValue({
      Reason: "",
      ReasonDesc: "",
      Notes: ""
    });

    if (!this.isReturnOn) {
      this.isReturnOn = true;
      this.FormObj.controls.Approver.clearValidators();
    } else {
      this.isReturnOn = false;
      this.FormObj.controls.Approver.setValidators([Validators.required]);
    }
    this.FormObj.controls.Approver.updateValueAndValidity();

  }


  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
}
