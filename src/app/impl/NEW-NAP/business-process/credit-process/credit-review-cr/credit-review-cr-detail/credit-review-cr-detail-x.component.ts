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
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { TypeResultObj } from 'app/shared/model/TypeResult/TypeResultObj.Model';
import { ResultAttrObj } from 'app/shared/model/TypeResult/ResultAttrObj.Model';
import { CrdRvwAppObj } from 'app/shared/model/CreditReview/CrdRvwAppObj.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import {ProdOfferingDObj} from 'app/shared/model/Product/ProdOfferingDObj.model';

@Component({
  selector: 'app-credit-review-cr-detail-x',
  templateUrl: './credit-review-cr-detail-x.component.html'
})
export class CreditReviewCrDetailXComponent implements OnInit {

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  appId: number = 0;
  wfTaskListId: any;
  isReturnOn: boolean = false;
  UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
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

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING + 'X';
  FormObj = this.fb.group({
    arr: this.fb.array([]),
    AppvAmt: [''],
    CreditScoring: ['']
  });

  FormReturnObj  =this.fb.group({
    Reason: [''],
    Notes: ['']
  });

  crdRvwAppObj: CrdRvwAppObj = new CrdRvwAppObj();
  lobCode: string;
  IsFD: boolean = false;

  ProdOfferingCode:string;
  ProdOfferingVersion:number;

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
    this.Arr = this.FormObj.get('arr') as FormArray;
  }

  async ngOnInit() {
    this.initData();
    this.ClaimTask();
    await this.GetAppNo();
    await this.GetListDeviation();
    await this.BindDDLRecommendation();
    await this.BindDDLReasonReturn();
    await this.BindCreditAnalysisItemFormObj();
    await this.BindAppvAmt();
    await this.GetExistingCreditReviewData();
    await this.GetCrdRvwCustInfoByAppId();
    this.initInputApprovalObj();
  }

  getCrdRvwAppObj(ev: CrdRvwAppObj) {
    this.crdRvwAppObj = ev;
  }

  responseListTypeCodes: Array<TypeResultObj> = new Array();
  async GetListDeviation(){
    await this.http.post(URLConstant.GetListDeviationTypeByAppNo, {TrxNo: this.appNo}).toPromise().then(
      (response) => {
        this.responseListTypeCodes = response['ApvTypecodes'];
      });
  }
  //#region Get Local Data
  ManualDeviationData: Array<DeviationResultObj> = new Array<DeviationResultObj>();
  async BindManualDeviationData(ev) {
    this.IsReady = false;
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
    await this.initInputApprovalObj(manualDevList);
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
          this.lobCode = response.LobCode;
          this.ProdOfferingCode = response.ProdOfferingCode;
          this.ProdOfferingVersion = response.ProdOfferingVersion;
          await this.GetCreditScoring(response.AppNo);
        }
      });

    if(this.BizTemplateCode == CommonConstant.CFNA && this.lobCode == "FD"){
      this.IsFD = true;
    }
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
  DDLData: { [id: string]: Array<KeyValueObj> } = {};
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
    let obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeReturnHandlingGeneral };
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
    await this.http.post(URLConstantX.GetApprovalAmountForCreditReviewByAppIdX, { Id: this.appId }).toPromise().then(
      (response) => {
        this.FormObj.patchValue({
          AppvAmt: response["Result"]
        });
        this.PlafondAmt = response["Result"];
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
  readonly bizCfna: string = CommonConstant.CFNA;
  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.crdRvwCustInfoObj = response;
        this.isShow = true;

        // penjagaan CF4W Fleet - impl X
        if(this.crdRvwCustInfoObj.BizTemplateCode == CommonConstant.CF4W){
          this.crdRvwCustInfoObj.BizTemplateCode = CommonConstant.FL4W;
        }

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
  async initInputApprovalObj(manualDevList = null) {
    let Attributes: Array<ResultAttrObj> = new Array();
    const attribute1: ResultAttrObj = {
      AttributeName: "Approval Amount",
      AttributeValue: this.PlafondAmt.toString()
    };
    Attributes.push(attribute1);

    let listTypeCode: Array<TypeResultObj> = new Array();
    const TypeCode: TypeResultObj = {
      TypeCode: "CRD_APV_CF_TYPE",
      Attributes: Attributes,
    };
    listTypeCode.push(TypeCode);

    if (this.responseListTypeCodes.length > 0) {
      listTypeCode = listTypeCode.concat(this.responseListTypeCodes);
    }
    if (manualDevList != null) {
      listTypeCode = listTypeCode.concat(manualDevList);
    }

    const obj = {
      ProdOfferingCode: this.ProdOfferingCode,
      RefProdCompntCode: 'CRD_APV',
      ProdOfferingVersion: this.ProdOfferingVersion
    };
    await this.http.post<ProdOfferingDObj>(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
      (resp)=>{
        this.InputObj.CategoryCode = resp.RefProdCompntCode;
        this.InputObj.SchemeCode = resp.CompntValue;
      }
    )
    this.InputObj.ApvTypecodes = listTypeCode;
    this.InputObj.Reason = this.DDLData[this.DDLRecomendation];
    this.InputObj.TrxNo = this.appNo;
    this.IsReady = true;
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
      this.RFAInfo = { RFAInfo: this.FormObj.controls.RFAInfo.value };

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

    let CrdRvwMakeNewApprovalUrl = environment.isCore ? URLConstant.CrdRvwMakeNewApprovalV2 : URLConstant.CrdRvwMakeNewApproval;
    this.http.post(CrdRvwMakeNewApprovalUrl, apiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  SaveReturnForm() {
    let temp = this.FormReturnObj.value;

    let apiObj = {
      WfTaskListId: this.wfTaskListId,
      Notes: temp.Notes,
      Reason: temp.Reason,
      RowVersion: "",
      AppId: this.appId
    }

    let CrdRvwMakeNewApprovalUrl = environment.isCore ? URLConstantX.CrdRvwMakeNewApprovalV2 : URLConstant.CrdRvwMakeNewApproval;
    this.http.post(CrdRvwMakeNewApprovalUrl, apiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode, });
      });
  }

  ReCaptureCreditReviewData() {
    let workflowApiObj = new WorkflowApiObj();
    workflowApiObj.TaskListId = this.wfTaskListId;
    let CrdRvwDataReCaptureUrl = environment.isCore ? URLConstant.CrdRvwDataReCaptureV2 : URLConstant.CrdRvwDataReCapture;
    this.http.post(CrdRvwDataReCaptureUrl, workflowApiObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_CRD_REVIEW_CR_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  ReCaptureDataR2() {
    let ReCaptureDataR2Url = environment.isCore ? URLConstant.ReCaptureDataR2V2 : URLConstant.ReCaptureDataR2;
    this.http.post(ReCaptureDataR2Url, { AppNo: this.appNo, CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId, RowVersion: this.crdRvwCustInfoObj.RowVersion }).subscribe(
      () => {
        AdInsHelper.RedirectUrl(this.router, ["Nap/CreditProcess/CreditReviewCr/Paging"], { "BizTemplateCode": this.BizTemplateCode });
      });
  }

  BindAppCrdRvwDObj(objArr: Array<any>) {
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

  ClaimTask() {
    if (environment.isCore) {
      if (this.wfTaskListId != "" && this.wfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
      }
    }
    else if (this.wfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
  }
}
