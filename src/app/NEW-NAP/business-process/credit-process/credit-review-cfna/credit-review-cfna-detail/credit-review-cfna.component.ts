import { AfterViewInit, ApplicationRef, Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { ScoringResultHObj } from 'app/shared/model/ScoringResultHObj.Model';
import { AppCrdRvwHObj } from 'app/shared/model/AppCrdRvwHObj.Model';
import { AppCrdRvwDObj } from 'app/shared/model/AppCrdRvwDObj.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-credit-review-cfna',
  templateUrl: './credit-review-cfna.component.html',
  styleUrls: []
})
export class CreditReviewCfnaComponent implements OnInit, AfterViewInit {

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
  isDmsReady: boolean;
  dmsObj: DMSObj;
  appNo: any;
  custNo: string;

  // ReturnForm = this.fb.group({
  //   ReturnReason: [''],
  //   ReturnReasonDesc: [''],
  //   ReturnExecNotes: [''],
  // });
  InputObj: UcInputRFAObj;
  private createComponent: UcapprovalcreateComponent;
  responseListTypeCodes: Array<any>;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }

  ApprovalCreateOutput: any;
  IsReady: boolean;
  apvAmt: number;
  AppNo: string;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router, private cookieService: CookieService,
    private ref: ApplicationRef) {
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
    // AppvAmt: [''],
    // CreditScoring: [''],
    Reason: [''],
    // ReasonDesc: [""],
    // Approver: ['', Validators.required],
    // ApproverDesc: [""],
    Notes: ['']
  });


  InitData() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    this.DDLRecommendation = new Array();
    this.DDLReasonReturn = new Array();
    this.AppStepIndex = 0;
    this.CustTypeCode = "";
    this.Arr = this.FormObj.get('arr') as FormArray;
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
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
  UserAccess;
  ResponseExistCreditReview;
  DDLRecommendation;
  DDLReasonReturn;

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  async ngOnInit() {
    this.ClaimTask();
    this.InitData();
    await this.GetAppNo();
    var appObj = new AppObj();
    appObj.AppNo = this.AppNo;
    await this.http.post(URLConstant.GetListDeviationTypeByAppNo, appObj).toPromise().then(
      (response) => {
        this.responseListTypeCodes = response['ApvTypecodes'];
      });

    await this.GetAppCustData();
    await this.BindDDLRecommendation();
    await this.BindDDLReasonReturn();
    await this.BindCreditAnalysisItemFormObj();
    await this.BindAppvAmt();
    await this.GetExistingCreditReviewData();
    this.initInputApprovalObj();
    await this.InitDms();
  }

  ngAfterViewInit() {
    console.log(this.createComponent)
  }
  async InitDms() {
    this.isDmsReady = false;
    this.dmsObj = new DMSObj();
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.dmsObj.User = currentUserContext.UserName;
    this.dmsObj.Role = currentUserContext.RoleCode;
    this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
    var appObj = { AppId: this.appId };

    let getApp = await this.http.post(URLConstant.GetAppById, appObj)
    let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
    forkJoin([getApp, getAppCust]).subscribe(
      (response) => {
        this.appNo = response[0]['AppNo'];
        this.custNo = response[1]['CustNo'];
        if (this.custNo != null && this.custNo != '') {
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
        }
        else {
          this.dmsObj.MetadataParent = null;
        }
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
        let mouCustId = response[0]['MouCustId'];
        if (mouCustId != null && mouCustId != '') {
          var mouObj = { MouCustId: mouCustId };
          this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
            (response) => {
              let mouCustNo = response['MouCustNo'];
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, mouCustNo));
              this.isDmsReady = true;
            });
        }
        else {
          this.isDmsReady = true;
        }
      }
    );
  }

  async GetAppNo() {
    var obj = { AppId: this.appId };
    await this.http.post<NapAppModel>(URLConstant.GetAppById, obj).toPromise().then(
      (response) => {
        if (response != undefined)
          this.GetCreditScoring(response["AppNo"]);
        this.AppNo = response["AppNo"];
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
        this.apvAmt = response["ApvAmt"]
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


    if (!this.isReturnOn) {
      this.ApprovalCreateOutput = this.createComponent.output();
    }

    var apiObj = {
      appCrdRvwHObj: tempAppCrdRvwObj,
      Notes: temp.Notes,
      WfTaskListId: this.wfTaskListId,
      RowVersion: "",
      AppId: this.appId,
      ListDeviationResultObjs: this.ManualDeviationData,
      RequestRFAObj: this.ApprovalCreateOutput
    }
    this.http.post(URLConstant.AddOrEditAppCrdRvwDataAndListManualDeviationDataNew, apiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING], { "BizTemplateCode": this.BizTemplateCode, });
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
    this.IsReady = false;
    this.ref.tick();
    this.ManualDeviationData = ev;
    let manualDevList = []
    if(this.ManualDeviationData.length > 0){
      for(let i=0;i< this.ManualDeviationData.length;i++){

        var Attributes = []
        var attribute1= { 
          "AttributeName" : "ApvAt",
          "AttributeValue": this.ManualDeviationData[ this.ManualDeviationData.length -1].ApvAt
        };
        Attributes.push(attribute1);
        
        let TypeCode = {
          "TypeCode" : this.ManualDeviationData[this.ManualDeviationData.length -1].MrDeviationType,
          "Attributes" : Attributes,
        };
    
        manualDevList.push(TypeCode);
      }
    }
    this.initInputApprovalObj(manualDevList);
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
      this.isReturnOn = true;;
      this.FormObj.controls.Reason.setValidators([Validators.required]);
      this.FormObj.controls.Notes.setValidators([Validators.required]);
    } else {
      this.isReturnOn = false;
      this.FormObj.controls.Reason.clearValidators();
      this.FormObj.controls.Notes.clearValidators();
    }
    this.FormObj.controls.Reason.updateValueAndValidity();
    this.FormObj.controls.Notes.updateValueAndValidity();

  }


  ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
  initInputApprovalObj(manualDevList = null){  
    this.InputObj = new UcInputRFAObj(); 
    var Attributes = []
    var attribute1 = {
      "AttributeName": "Approval Amount",
      "AttributeValue": this.apvAmt
    }; 
    Attributes.push(attribute1);
    var listTypeCode = [];
    var TypeCode = {
      "TypeCode": "CRD_APV_CF_TYPE",
      "Attributes": Attributes,
    };
    listTypeCode.push(TypeCode);

    if (this.responseListTypeCodes.length > 0) {

      listTypeCode = listTypeCode.concat(this.responseListTypeCodes);
    }
    if(manualDevList != null){
      listTypeCode = listTypeCode.concat(manualDevList);
     }
     let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = listTypeCode;
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_CRD_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_CRD_APV_CF;
    this.InputObj.Reason = this.DDLRecommendation;
    this.InputObj.TrxNo = this.AppNo
    this.IsReady = true;
  }
  cancel(){ 
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING], { "BizTemplateCode": this.BizTemplateCode });
  }
}
