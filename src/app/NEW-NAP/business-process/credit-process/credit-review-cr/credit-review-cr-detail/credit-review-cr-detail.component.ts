import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { HttpClient } from '@angular/common/http';
import { ApplicationRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
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
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMasterCodeObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-credit-review-cr-detail',
  templateUrl: './credit-review-cr-detail.component.html',
  styleUrls: ['./credit-review-cr-detail.component.scss']
})
export class CreditReviewCrDetailComponent implements OnInit {

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  appId: number = 0;
  wfTaskListId: number = 0;
  isReturnOn: boolean = false;
  UserAccess: any;
  Arr: FormArray;
  BizTemplateCode: string = "";
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean = false;
  IsViewReady: boolean = false;
  RFAInfo: Object = new Object();
  readonly apvBaseUrl = environment.ApprovalR3Url;

  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;

  readonly CaptureStatReq: string = CommonConstant.CaptureStatReq;
  readonly CaptureStatScs: string = CommonConstant.CaptureStatScs;
  readonly CaptureStatFail: string = CommonConstant.CaptureStatFail;

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING;
  FormObj = this.fb.group({
    arr: this.fb.array([]),
    AppvAmt: [''],
    CreditScoring: ['']
  });

  FormReturnObj  =this.fb.group({
    Reason: [''],
    Notes: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private ref: ApplicationRef,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public toastr: ToastrService, 
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService
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
    this.IsViewReady = true;
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.Arr = this.FormObj.get('arr') as FormArray;
  }

  async ngOnInit() {
    this.initData();
    this.claimTaskService.ClaimTask(this.wfTaskListId);
    await this.GetAppNo();
    await this.GetListDeviation();
    await this.BindDDLRecommendation();
    await this.BindDDLReasonReturn();
    await this.BindCreditAnalysisItemFormObj();
    await this.BindAppvAmt();
    await this.GetExistingCreditReviewData();
    await this.GetCrdRvwCustInfoByAppId();
    this.initInputApprovalObj();
    this.IsReady = true;
  }

  responseListTypeCodes: Array<any> = new Array();
  async GetListDeviation(){    
    await this.http.post(URLConstant.GetListDeviationTypeByAppNo, {TrxNo: this.appNo}).toPromise().then(
      (response) => {
        this.responseListTypeCodes = response['ApvTypecodes'];
      });
  }
  //#region Get Local Data
  ManualDeviationData: Array<DeviationResultObj> = new Array<DeviationResultObj>();
  BindManualDeviationData(ev) {
    // this.IsReady = false;
    this.ref.tick();
    this.ManualDeviationData = ev;
    let manualDevList = []
    if (this.ManualDeviationData.length > 0) {
      for (let i = 0; i < this.ManualDeviationData.length; i++) {

        var Attributes = []
        var attribute1 = {
          "AttributeName": "ApvAt",
          "AttributeValue": this.ManualDeviationData[this.ManualDeviationData.length - 1].ApvAt
        };
        Attributes.push(attribute1);

        let TypeCode = {
          "TypeCode": this.ManualDeviationData[this.ManualDeviationData.length - 1].MrDeviationType,
          "Attributes": Attributes,
        };

        manualDevList.push(TypeCode);
      }
    }
    this.initInputApprovalObj(manualDevList);
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

  async GetCreditScoring(appNo: string) {
    let obj = { ScoringResultH: { TrxNo: appNo } };
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
    let Obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLRecomendation] = response[CommonConstant.ReturnObj];
      });
  }

  readonly DDLReason: string = "REASON";
  async BindDDLReasonReturn() {
    let obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLReason] = response[CommonConstant.ReturnObj];
      });
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
      });
  }

  async BindAppvAmt() {
    let Obj = { Id: this.appId };
    await this.http.post(URLConstant.GetAppFinDataByAppId, Obj).toPromise().then(
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

  PlafondAmt: number = 0;
  initInputApprovalObj(manualDevList = null) {
    var Attributes = [];
    var attribute1 = {
      "AttributeName": "Approval Amount",
      "AttributeValue": this.PlafondAmt
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
    if (manualDevList != null) {
      listTypeCode = listTypeCode.concat(manualDevList);
    }
    this.InputObj.ApvTypecodes = listTypeCode;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_CRD_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_CRD_APV_CF;
    this.InputObj.Reason = this.DDLData[this.DDLRecomendation];
    this.InputObj.TrxNo = this.appNo;
  }

  //#region Submit
  SaveForm() {
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

    if (!this.isReturnOn) {
      this.RFAInfo = {RFAInfo: this.FormObj.controls.RFAInfo.value};
      
    }

    let apiObj = {
      appCrdRvwHObj: tempAppCrdRvwObj,
      ApprovedById: temp.Approver,
      Reason: temp.ReasonDesc,
      Notes: temp.Notes,
      WfTaskListId: this.wfTaskListId,
      RowVersion: "",
      AppId: this.appId,
      ListDeviationResultObjs: this.ManualDeviationData,
      RequestRFAObj: this.RFAInfo
    };
    this.http.post(URLConstant.CrdRvwMakeNewApproval, apiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode });
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
    this.http.post(URLConstant.CrdRvwMakeNewApproval, apiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_PAGING], { "BizTemplateCode": this.BizTemplateCode, });
      });
  }

  ReCaptureCreditReviewData() {
    let workflowApiObj = new WorkflowApiObj();
    workflowApiObj.TaskListId = this.wfTaskListId;
    this.http.post(URLConstant.CrdRvwDataReCapture, workflowApiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  ReCaptureDataR2() {
    this.http.post(URLConstant.ReCaptureDataR2, { AppNo: this.appNo, CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId, RowVersion: this.crdRvwCustInfoObj.RowVersion }).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router, ["Nap/CreditProcess/CreditReviewCr/Paging"], { "BizTemplateCode": this.BizTemplateCode });
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
  //#endregion
}
