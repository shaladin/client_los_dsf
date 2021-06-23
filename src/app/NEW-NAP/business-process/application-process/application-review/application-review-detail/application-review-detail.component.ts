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
import { UcDropdownListCallbackObj, UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMasterCodeObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-application-review-detail',
  templateUrl: './application-review-detail.component.html',
  styleUrls: ['./application-review-detail.component.scss']
})
export class ApplicationReviewDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();  
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      this.createComponent = content;
    }
  }
  appId: number = 0;
  wfTaskListId: number = 0;
  isReturnOn: boolean = false;
  UserAccess: CurrentUserContext;
  Arr: FormArray;
  BizTemplateCode: string = "";
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean = false;
  ApprovalCreateOutput: any;  
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
    Notes: ['']
  });

  FormReturnObj = this.fb.group({
    Reason: [''],
    ReasonDesc: [''],
    Notes: ['']
  });

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  readonly PefindoLink: string = NavigationConstant.PEFINDO_VIEW;

  DdlReasonObj: UcDropdownListObj = new UcDropdownListObj();
  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public toastr: NGXToastrService, private cookieService: CookieService) {
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
    this.initData();
    this.BindDDLReasonReturn();
    await this.ClaimTask();
    await this.GetAppNo();
    await this.BindDDLRecommendation();
    await this.BindCreditAnalysisItemFormObj();
    await this.BindApvAmt();
    await this.GetExistingCreditReviewData();
    await this.GetCrdRvwCustInfoByAppId();
    this.initInputApprovalObj();
    this.IsReady = true;
  }

  //#region Get Local Data
  ManualDeviationData: Array<DeviationResultObj> = new Array<DeviationResultObj>();
  BindManualDeviationData(ev) {
    this.ManualDeviationData = ev;
  }

  onChangeApprover(ev) {
    this.FormObj.patchValue({
      ApproverDesc: ev.target.selectedOptions[0].text
    });
  }

  onChangeReason(ev: UcDropdownListCallbackObj) {
    this.FormObj.patchValue({
      ReasonDesc: ev.selectedObj.Value
    });
    this.FormReturnObj.patchValue({
      ReasonDesc: ev.selectedObj.Value
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
      }
    );
  }

  async ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    await this.http.post(URLConstant.ClaimTask, wfClaimObj).toPromise().then((response) => {});
  }

  async GetCreditScoring(appNo: string) {
    let obj = { ScoringResultH: { TrxNo: appNo } };
    await this.http.post(URLConstant.GetLatestScoringResultHByTrxSourceNo, obj).toPromise().then(
      (response) => {
        if (response["ScoringResultHObj"] != null) {
          let ScoringResult: ScoringResultHObj = response["ScoringResultHObj"];
          this.FormObj.patchValue({
            CreditScoring: ScoringResult.ScoringValue
          });
        }
        else {
          this.FormObj.patchValue({
            CreditScoring: "-"
          });
        }
      }
    );
  }

  //#region DDL Data
  DDLData: { [id: string]: Array<{ Key: string, Value: string }> } = {};
  readonly DDLRecomendation: string = "RECOMENDED";
  async BindDDLRecommendation() {
    let Obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLRecomendation] = response[CommonConstant.ReturnObj];
      }
    );
  }

  BindDDLReasonReturn() {
    this.DdlReasonObj.apiUrl = URLConstant.GetListActiveRefReason;
    let tempReq: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    this.DdlReasonObj.requestObj = tempReq;
    this.DdlReasonObj.isSelectOutput = true;
  }
  //#endregion

  ResponseExistCreditReview;
  async GetExistingCreditReviewData() {
    let Obj = { Id: this.appId };
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
      }
    );
  }

  async BindApvAmt() {
    let Obj = { Id: this.appId };
    await this.http.post(URLConstant.GetApprovalAmount, Obj).toPromise().then(
      (response) => {
        this.FormObj.patchValue({
          ApvAmt: response["ApvAmt"]
        });
        this.TotalCostAmt = response["ApvAmt"];
      }
    );
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
      }
    );
  }

  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  isShow: boolean = false;
  captureStat: string = "";
  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.crdRvwCustInfoObj = response;
        this.isShow = true;
      }
    );

    let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCaptureStat,
      MasterCode: this.crdRvwCustInfoObj.CaptureStat
    };
    await this.http.post<KeyValueObj>(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
      (response) => {
        this.captureStat = response.Value;
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
    this.FormReturnObj.patchValue({
      Reason: "",
      ReasonDesc: "",
      Notes: ""
    });

    if (!this.isReturnOn) {
      this.isReturnOn = true;
      this.FormObj.controls.Reason.setValidators([Validators.required]);
      this.FormObj.controls.Notes.setValidators([Validators.required]);
      for(let i = 0; i < this.FormObj.controls.arr['controls'].length; i++) {
        this.FormObj.get("arr").get(i.toString()).get("Answer").clearValidators();
        this.FormObj.get("arr").get(i.toString()).get("Answer").updateValueAndValidity();
      }
      this.FormReturnObj.controls.Reason.setValidators([Validators.required]);
      this.FormReturnObj.controls.Notes.setValidators([Validators.required]);
    }
    else {
      this.isReturnOn = false;
      this.FormObj.controls.Reason.clearValidators();
      this.FormObj.controls.Notes.clearValidators();
      for(let i = 0; i < this.FormObj.controls.arr['controls'].length; i++) {
        this.FormObj.get("arr").get(i.toString()).get("Answer").setValidators([Validators.required]);
        this.FormObj.get("arr").get(i.toString()).get("Answer").updateValueAndValidity();
      }
      this.FormReturnObj.controls.Reason.clearValidators();
      this.FormReturnObj.controls.Notes.clearValidators();
    }
    this.FormObj.controls.Reason.updateValueAndValidity();
    this.FormObj.controls.Notes.updateValueAndValidity();
    this.FormReturnObj.controls.Reason.updateValueAndValidity();
    this.FormReturnObj.controls.Notes.updateValueAndValidity();
  }

  TotalCostAmt: number = 0;
  initInputApprovalObj() {
    var Attributes = [{}];
    var attribute1 = {
      "AttributeName": "Approval Amount",
      "AttributeValue": this.TotalCostAmt
    };
    Attributes.push(attribute1);

    var TypeCode = {
      "TypeCode": "APV_LIMIT",
      "Attributes": Attributes,
    };
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_APP_OPL_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_RENT_APP;
    this.InputObj.Reason = this.DDLData[this.DDLRecomendation];
    this.InputObj.TrxNo = this.appNo;
  }

  //#region Submit
  temp: any;
  SaveForm() {
    if(this.isReturnOn) {
      this.temp = this.FormReturnObj.value;
    }
    else {
      this.temp = this.FormObj.value;
    }
    let tempAppCrdRvwObj = new AppCrdRvwHObj();
    tempAppCrdRvwObj.AppId = this.appId;
    tempAppCrdRvwObj.SubmitDt = this.UserAccess.BusinessDt;
    tempAppCrdRvwObj.CrdRvwStat = CommonConstant.CrdRvwStatDone;
    tempAppCrdRvwObj.ReturnNotes = "";
    if (this.ResponseExistCreditReview != null) {
      tempAppCrdRvwObj.RowVersion = this.ResponseExistCreditReview.RowVersion;
    }
    tempAppCrdRvwObj.appCrdRvwDObjs = this.BindAppCrdRvwDObj(this.FormObj.value.arr);
    var flagId = 0;
    var rfaInfo = null;
    if (!this.isReturnOn) {
      this.ApprovalCreateOutput = this.createComponent.output();
      if (this.ApprovalCreateOutput == undefined) {
        return this.toastr.warningMessage('Failed to Get RFA Object');
      }
      else {
        flagId = 1;
        rfaInfo = this.ApprovalCreateOutput['RFAInfo'];
      }
    }

    let apiObj = {
      appCrdRvwHObj: tempAppCrdRvwObj,
      ApprovedById: flagId,
      Reason: this.temp.ReasonDesc,
      Notes: this.temp.Notes,
      WfTaskListId: this.wfTaskListId,
      RowVersion: "",
      AppId: this.appId,
      ListDeviationResultObjs: this.ManualDeviationData,
      RequestRFAObj: rfaInfo,
      TrxNo: this.appNo
    };
    this.http.post(URLConstant.CrdRvwMakeNewApproval, apiObj).subscribe(
      (response) => {
        this.toastr.successMessage("Success Submit Application Review")
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_RVW_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      }
    );
  }

  ReCaptureCreditReviewData() {
    let workflowApiObj = new WorkflowApiObj();
    workflowApiObj.TaskListId = this.wfTaskListId;
    this.http.post(URLConstant.CrdRvwDataReCapture, workflowApiObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_RVW_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      }
    );
  }

  ReCaptureDataR2() {
    this.http.post(URLConstant.ReCaptureDataR2, { AppNo: this.appNo, CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId, RowVersion: this.crdRvwCustInfoObj.RowVersion }).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_RVW_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      }
    );
  }

  BindAppCrdRvwDObj(objArr) {
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

  OpenPefindoView(){
    window.open(environment.losR3Web + NavigationConstant.PEFINDO_VIEW + "?AppId=" + this.appId, "_blank");
  }
  //#endregion
}