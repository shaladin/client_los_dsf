import { ApplicationRef, Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { ScoringResultHObj } from 'app/shared/model/scoring-result-h-obj.model';
import { AppCrdRvwHObj } from 'app/shared/model/app-crd-rvw-h-obj.model';
import { AppCrdRvwDObj } from 'app/shared/model/app-crd-rvw-d-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ResultAttrObj } from 'app/shared/model/type-result/result-attr-obj.model';
import { TypeResultObj } from 'app/shared/model/type-result/type-result-obj.model';

@Component({
  selector: 'app-credit-review-cfna-detail',
  templateUrl: './credit-review-cfna-detail.component.html'
})
export class CreditReviewCfnaDetailComponent implements OnInit {

  appId: number = 0;
  wfTaskListId: number = 0;
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
  appNo: string;
  custNo: string;
  IsUseDigitalization: string;
  IsViewReady: boolean = false;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  RFAInfo: Object = new Object();
  OriOfficeCode: string;

  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  private createComponent: UcapprovalcreateComponent;
  responseListTypeCodes: Array<TypeResultObj> = new Array();
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
    private claimTaskService: ClaimTaskService,
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
    arr: this.fb.array([])
  });

  FormReturnObj  =this.fb.group({
    Reason: [''],
    Notes: ['']
  });


  InitData() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    this.IsViewReady = true;
    this.DDLRecommendation = new Array();
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
  CustTypeCode: string = "";
  Arr: FormArray;
  UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  ResponseExistCreditReview: AppCrdRvwHObj;
  DDLRecommendation: Array<KeyValueObj>;
  DDLReasonReturn: Array<KeyValueObj>;

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  async ngOnInit() : Promise<void> {
    this.claimTaskService.ClaimTask(this.wfTaskListId);
    this.InitData();
    await this.GetAppNo();
    await this.http.post(URLConstant.GetListDeviationTypeByAppNo, { TrxNo: this.AppNo }).toPromise().then(
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
    await this.GetIsUseDigitalization();
  }

  ngAfterViewInit() {
    console.log(this.createComponent)
  }
  async InitDms() {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
    });
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      this.dmsObj.User = this.UserAccess.UserName;
      this.dmsObj.Role = this.UserAccess.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      var appObj = { Id: this.appId };
  
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
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideViewDownload));
          let mouCustId = response[0]['MouCustId'];
          if (mouCustId != null && mouCustId != '') {
            var mouObj = { Id: mouCustId };
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
  }

  async GetAppNo() {
    await this.http.post<NapAppModel>(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
      (response) => {
        if (response != undefined)
          this.GetCreditScoring(response["AppNo"]);
        this.AppNo = response["AppNo"];
        this.OriOfficeCode = response["OriOfficeCode"];
      });
  }

  GetCreditScoring(appNo: string) {
    this.http.post(URLConstant.GetLatestScoringResultHByTrxSourceNo, { TrxNo: appNo }).toPromise().then(
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
    await this.http.post(URLConstant.GetAppCustByAppId, { Id: this.appId }).toPromise().then(
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
    await this.http.post(URLConstant.GetAppFinDataByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.apvAmt = response["ApvAmt"]
      });
  }

  async GetExistingCreditReviewData() {
    await this.http.post(URLConstant.GetAppCrdRvwById, { Id: this.appId }).toPromise().then(
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
    var Obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLRecommendation = response[CommonConstant.ReturnObj];
      });
  }

  async BindDDLReasonReturn() {
    var obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
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
      this.RFAInfo = {RFAInfo: this.FormObj.controls.RFAInfo.value};
    }

    var apiObj = {
      appCrdRvwHObj: tempAppCrdRvwObj,
      Notes: temp.Notes,
      WfTaskListId: this.wfTaskListId,
      RowVersion: "",
      AppId: this.appId,
      ListDeviationResultObjs: this.ManualDeviationData,
      RequestRFAObj: this.RFAInfo
    }
    this.http.post(URLConstant.AddOrEditAppCrdRvwDataAndListManualDeviationDataNew, apiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING], { "BizTemplateCode": this.BizTemplateCode, });
      });
  }

  SaveReturnForm() {
    let temp = this.FormReturnObj.value;

    let apiObj = {
      WfTaskListId: this.wfTaskListId,
      Notes: temp.Notes,
      RowVersion: "",
      AppId: this.appId
    }
    console.log(apiObj);
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
    this.FormReturnObj.patchValue({
      Reason: "",
      ReasonDesc: "",
      Notes: ""
    });

    if (!this.isReturnOn) {
      this.isReturnOn = true;
      this.FormReturnObj.controls.Reason.setValidators([Validators.required]);
      this.FormReturnObj.controls.Notes.setValidators([Validators.required]);
    } else {
      this.isReturnOn = false;
      this.FormReturnObj.controls.Reason.clearValidators();
      this.FormReturnObj.controls.Notes.clearValidators();
    }
    this.FormReturnObj.controls.Reason.updateValueAndValidity();
    this.FormReturnObj.controls.Notes.updateValueAndValidity();

  }

  initInputApprovalObj(manualDevList = null){  
    var Attributes: Array<ResultAttrObj> = new Array();
    var attribute1: ResultAttrObj = {
      AttributeName: "Approval Amount",
      AttributeValue: this.apvAmt.toString()
    };
    Attributes.push(attribute1);

    var listTypeCode: Array<TypeResultObj> = new Array();
    var TypeCode: TypeResultObj = {
      TypeCode: "CRD_APV_CF_TYPE",
      Attributes: Attributes,
    };
    listTypeCode.push(TypeCode);

    if (this.responseListTypeCodes.length > 0) {

      listTypeCode = listTypeCode.concat(this.responseListTypeCodes);
    }
    if(manualDevList != null){
      listTypeCode = listTypeCode.concat(manualDevList);
    }
    this.InputObj.RequestedBy = this.UserAccess.UserName;
    this.InputObj.OfficeCode = this.OriOfficeCode;
    this.InputObj.OfficeCodes.push(this.OriOfficeCode);
    this.InputObj.ApvTypecodes = listTypeCode;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_CRD_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_CRD_APV_CF;
    this.InputObj.Reason = this.DDLRecommendation;
    this.InputObj.TrxNo = this.AppNo
    this.IsReady = true;
  }
  cancel(){ 
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING], { "BizTemplateCode": this.BizTemplateCode });
  }

  async GetIsUseDigitalization() {
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, {Code: CommonConstant.GSCodeIsUseDigitalization}).toPromise().then(
      (response: GeneralSettingObj) => {
        this.IsUseDigitalization = response.GsValue;
      }
    )
  }
}
