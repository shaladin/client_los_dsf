import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DatePipe } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { AppObj } from 'app/shared/model/App/App.Model';
import { environment } from 'environments/environment';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { VerfResultObj } from 'app/shared/model/verf-result/verf-result.model';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';

@Component({
  selector: 'app-survey-subject-x',
  templateUrl: './survey-subject-x.component.html',
  providers: [NGXToastrService]
})
export class SurveySubjectXComponent implements OnInit {

  getPhoneVerifSubjUrl: any;
  getVerfResultUrl: any;
  getAppUrl: any;
  addVerfResultUrl: any;
  rtnHandlingDUrl: any;
  isReturnHandling: boolean = false;

  ReturnHandlingForm = this.fb.group({
    IsAnyUpdate: [''],
    UpdateNotes: ['', Validators.maxLength(4000)],
    ExecNotes: ['', Validators.maxLength(4000)],
    SurveyMethod: ['ONSITE']
  });

  viewObj: any;
  appId: any;
  returnHandlingHId: any;
  wfTaskListId: any;

  appObj = {
    id: 0,
  };

  rtnHandlingDObj = {
    ReturnHandlingDId: 0,
  };

  verfResObj = {
    TrxRefNo: '',
    MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodeSurvey
  };

  phoneVerifObj: any;
  AppObj: any;
  verifResultObj: any;
  tempFail: any;
  tempScs: any;
  tempBlank: any;
  failCount: number = 0;
  scsCount: number = 0;
  blankCount: number = 0;
  addVerifResultObj: VerfResultObj;
  returnHandlingDObj: any;
  ReturnHandlingHData: ReturnHandlingHObj;
  OnFormReturnInfo: boolean = false;
  arrValue = [];
  SurveyMethod: string;
  isSkipSurvey: boolean = false;
  gsValueSurvey: string;

  dmsObj: DMSObj;
  NapObj: AppObj;
  appNo: string;

  isReturnOn: boolean = false;
  DDLData: { [id: string]: Array<KeyValueObj> } = {};
  readonly DDLReason: string = CommonConstant.RefReasonTypeCodeReturnHandlingGeneral;
  readonly DDLTask: string = CommonConstant.ReturnTask;
  FormReturnObj = this.fb.group({
    ReturnTo: [''],
    Reason: [''],
    Notes: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
      if (params['ReturnHandlingHId'] != null) {
        this.returnHandlingHId = params['ReturnHandlingHId'];
        this.isReturnHandling = true;
      }
      if (params['WfTaskListId'] != null) {
        this.wfTaskListId = params['WfTaskListId'];
      }
    });
  }

  initUrl() {
    this.getPhoneVerifSubjUrl = URLConstant.GetAppSurveyVerifSubjectListByAppId;
    this.getAppUrl = URLConstant.GetAppById;
    this.getVerfResultUrl = URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode;
    this.addVerfResultUrl = URLConstant.AddVerfResult;
    this.rtnHandlingDUrl = URLConstant.GetReturnHandlingDByReturnHandlingDId;
  }

  async initDms() {
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;

    await this.http.post(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
      async (response: AppObj) => {
        if (response) {
          this.NapObj = response;
        }
      }
    );

    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.dmsObj = new DMSObj();
    this.dmsObj.User = currentUserContext.UserName;
    this.dmsObj.Role = currentUserContext.RoleCode;
    this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
    await this.http.post(URLConstant.GetAppCustByAppId, { Id: this.appId }).toPromise().then(
      async (response) => {
        this.appNo = this.NapObj.AppNo;
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
        let isExisting = response['IsExistingCust'];
        if (isExisting) {
          let custNo = response['CustNo'];
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, custNo));
        } else {
          this.dmsObj.MetadataParent = null;
        }
      }
    )
  }

  async ngOnInit(): Promise<void> {
    this.arrValue.push(this.appId);
    if (this.wfTaskListId != null || this.wfTaskListId != undefined) {
      this.claimTask();
    }

    this.initUrl();
    await this.initDms();
    this.appObj.id = this.appId;
    this.viewObj = './assets/ucviewgeneric/viewNapAppMainInformation.json';
    await this.GetAppData();
    await this.GetVerfResultData();
    await this.GetPhnVerfSubjData();
    if (this.isReturnHandling == true) {
      this.MakeViewReturnInfoObj();
    } else {
      this.ReturnHandlingForm.controls.IsAnyUpdate.setValidators(Validators.required);
      this.ReturnHandlingForm.controls.IsAnyUpdate.updateValueAndValidity();
    }
    await this.bindDDLReasonReturn();
    await this.bindTaskObj();
    await this.checkSkipSurvey();
  }

  async bindDDLReasonReturn() {
    let obj: ReqGetByTypeCodeObj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeReturnHandlingGeneral };
    await this.http.post(URLConstant.GetListActiveRefReason, obj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLReason] = response[CommonConstant.ReturnObj];
      });
  }

  async bindTaskObj() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    let refMasterTypeCode = '';
    switch (BizTemplateCode) {
      case CommonConstant.CF4W:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskCF4W;
        break;
      case CommonConstant.FL4W:
        refMasterTypeCode = CommonConstant.RefMasterTypeCodeReturnTaskFL4W;
        break;
    }
    if (!refMasterTypeCode) return;
    var mrCustTypeCode;

    await this.http.post(URLConstant.GetAppCustByAppId, { Id: this.appId }).toPromise().then(
      (response: AppCustObj) => {
        mrCustTypeCode = response.MrCustTypeCode;
      }
    );

    let refMasterObj: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: refMasterTypeCode, MappingCode: mrCustTypeCode };
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, refMasterObj).toPromise().then(
      (response) => {
        this.DDLData[this.DDLTask] = response[CommonConstant.ReturnObj];
        this.DDLData[this.DDLTask] = this.DDLData[this.DDLTask].filter(x => x.Key == CommonConstant.ReturnHandlingEditApp);
      }
    );
  }

  async checkSkipSurvey(){
    let generalSettingCode = {
      Code: CommonConstantX.GsCodeIsAllowSkipSurvey
    }

    await this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingCode).toPromise().then(
      (response) => {
        this.gsValueSurvey = response['GsValue'];
      }
    );

    if(this.gsValueSurvey == 'NO')
    {
      this.ReturnHandlingForm.patchValue({
        IsAnyUpdate: 'NO'
      })
      this.ReturnHandlingForm.controls.IsAnyUpdate.disable()
      this.isSkipSurvey = false;
    }
  }

  onChangeSkipSurvey() {
    if (this.ReturnHandlingForm.controls.IsAnyUpdate.value == 'YES') {
      this.isSkipSurvey = true;
    } else {
      this.isSkipSurvey = false;
    }
  }

  async SaveForm() {
    if (this.isReturnHandling == false && this.isSkipSurvey == false) {
      if (this.phoneVerifObj == undefined || this.phoneVerifObj == null || this.phoneVerifObj.length == 0) {
        this.toastr.errorMessage('Please add survey');
        return;
      }
    }

    if (this.isSkipSurvey) {
      if (this.phoneVerifObj != undefined) {
        if (this.phoneVerifObj.length > 0) {
          this.toastr.errorMessage('Can\'t skip survey');
          return;
        }
      }
    }

    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    if (this.isReturnHandling == false) {
      let urlCompleteAppSurvey, reqObj;
      if (environment.isCore) {
        urlCompleteAppSurvey = URLConstantX.CompleteAppSurveyVerifXV2
        reqObj = {
          VerfResultNo: this.verifResultObj.VerfResultNo,
          Notes: this.ReturnHandlingForm.controls['UpdateNotes'].value,
          TaskId: this.wfTaskListId
        }
      } else {
        urlCompleteAppSurvey = URLConstant.CompleteAppSurveyVerif
        reqObj = {
          VerfResultNo: this.verifResultObj.VerfResultNo,
          Notes: this.ReturnHandlingForm.controls['UpdateNotes'].value,
          WfTaskListId: this.wfTaskListId
        }
      }
      this.http.post(urlCompleteAppSurvey, reqObj).subscribe(
        (response) => {

          this.toastr.successMessage(response['message']);
          this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_PAGING], { queryParams: { 'BizTemplateCode': BizTemplateCode } });
        });
    }
    if (this.isReturnHandling == true) {
      const ReturnHandlingDData = this.setReturnHandlingD();
      const url = environment.isCore ? URLConstant.EditReturnHandlingDV2 : URLConstant.EditReturnHandlingD;
      this.http.post(url, ReturnHandlingDData).subscribe(
        (response) => {
          this.toastr.successMessage(response['message']);
          this.router.navigate([NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SURVEY_VERIF_PAGING], { queryParams: { 'BizTemplateCode': BizTemplateCode } });
        });

    }

  }

  setReturnHandlingD(): ReturnHandlingDObj {
    let ReturnHandlingDData = new ReturnHandlingDObj();
    ReturnHandlingDData.ReturnHandlingDId = this.returnHandlingDObj.ReturnHandlingDId;
    ReturnHandlingDData.ReturnHandlingHId = this.returnHandlingDObj.ReturnHandlingHId;
    ReturnHandlingDData.MrReturnTaskCode = this.returnHandlingDObj.MrReturnTaskCode;
    ReturnHandlingDData.ReturnStat = this.returnHandlingDObj.ReturnStat;
    ReturnHandlingDData.ReturnHandlingNotes = this.returnHandlingDObj.ReturnHandlingNotes;
    ReturnHandlingDData.ReturnHandlingExecNotes = this.ReturnHandlingForm.controls['ExecNotes'].value;
    ReturnHandlingDData.WfTaskListId = this.wfTaskListId;
    ReturnHandlingDData.RowVersion = this.returnHandlingDObj.RowVersion;
    return ReturnHandlingDData;
  }

  async GetAppData() {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {

        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
      }
    );
  }

  MakeViewReturnInfoObj() {
    if (this.returnHandlingHId > 0) {
      var obj = {
        Id: this.returnHandlingHId,
        Code: CommonConstantX.ReturnHandlingAddSurveyVerf
      }
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(
        (response) => {
          this.returnHandlingDObj = response;
        });
    }
  }

  GetPhnVerfSubjData() {
    this.http.post(this.getPhoneVerifSubjUrl, this.appObj).subscribe(
      (response) => {
        this.phoneVerifObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async GetVerfResultData() {
    await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
      (response) => {
        this.verifResultObj = response;

      }
    );
    if (this.verifResultObj.VerfResultId == 0) {
      var Business_Date = localStorage.getItem(CommonConstant.BUSINESS_DATE);
      var datePipe = new DatePipe('en-US');
      var value = datePipe.transform(Business_Date, 'yyyy-MM-dd');
      var businessDt = new Date(value);

      var useraccess = localStorage.getItem(CommonConstant.USER_ACCESS);
      this.addVerifResultObj = new VerfResultObj();

      this.addVerifResultObj.TrxRefNo = this.AppObj.AppNo;
      this.addVerifResultObj.VerfDt = businessDt;
      this.addVerifResultObj.EmpNo = '-';
      this.addVerifResultObj.MrVerfResultStatCode = CommonConstant.VerfResultStatCodeNew;
      this.addVerifResultObj.MrVerfTrxTypeCode = CommonConstant.VerfTrxTypeCodeSurvey; //los-urs-153, upd trxtypecode utk survey verif
      this.addVerifResultObj.LobCode = this.AppObj.LobCode;
      this.addVerifResultObj.LobName = this.AppObj.LobCode;
      this.addVerifResultObj.Notes = '-';

      await this.http.post(this.addVerfResultUrl, this.addVerifResultObj).toPromise().then(
        (response) => {
        }
      );
      await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
        (response) => {
          this.verifResultObj = response;
        }
      );
    }
  }

  async GetReturnHandlingD() {
    this.rtnHandlingDObj.ReturnHandlingDId = this.returnHandlingHId;
    await this.http.post(this.rtnHandlingDUrl, this.rtnHandlingDObj).toPromise().then(
      (response) => {
        this.returnHandlingDObj = response;

      }
    );
  }

  View(VerifResultHid, SubjectName) {
    var link = environment.losR3Web + NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VIEW + '?AppId=' + this.appId + '&VerfResultHId=' + VerifResultHid;

    window.open(link, '_blank');
  }

  QuestionObj: any;

  async GetQuestionList(VerfQAObj): Promise<any> {
    var isExist: Boolean = true;
    await this.http.post(URLConstant.GetVerfQuestionListByAppIdAndSubjectForSurveyVerif, VerfQAObj).toPromise().then(
      (response) => {
        this.QuestionObj = response[CommonConstant.ReturnObj];
        if (this.QuestionObj != null && this.QuestionObj.VerfQuestionAnswerListObj.length != 0) {
        } else {
          this.toastr.warningMessage('Questions are not loaded, please check RULE or Question Scheme if there\'re any typos in RULE or question scheme is not available for this BizTemplateCode');
          isExist = false;
        }
      }
    );
    return isExist;
  }

  async Verif(mode: any, VerifResultHid: any, SubjectType: any, SurveyMethod: any, IdSource: any) {
    if (mode == 'add') {
      var surveymethod = this.ReturnHandlingForm.controls.SurveyMethod.value;
      var VerfQAObj = {
        AppId: this.appId,
        Subject: surveymethod
      };
      const isExist: Boolean = await this.GetQuestionList(VerfQAObj);

      if (!isExist) {
        return;
      }

      if (this.isReturnHandling == false) {
        this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VERIF], {
          queryParams: {
            'AppId': this.appId,
            'WfTaskListId': this.wfTaskListId,
            'SurveyMethod': surveymethod,
            'mode': mode
          }
        });
      }
      if (this.isReturnHandling == true) {
        this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VERIF], {
          queryParams: {
            'AppId': this.appId,
            'ReturnHandlingHId': this.returnHandlingHId,
            'WfTaskListId': this.wfTaskListId,
            'SurveyMethod': surveymethod,
            'mode': mode
          }
        });
      }
    } else {
      if (this.isReturnHandling == false) {
        this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VERIF], {
          queryParams: {
            'AppId': this.appId,
            'VerfResultHId': VerifResultHid,
            'Type': SubjectType,
            'WfTaskListId': this.wfTaskListId,
            'SurveyMethod': surveymethod,
            'mode': mode
          }
        });
      }
      if (this.isReturnHandling == true) {
        this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VERIF], {
          queryParams: {
            'AppId': this.appId,
            'VerfResultHId': VerifResultHid,
            'Type': SubjectType,
            'ReturnHandlingHId': this.returnHandlingHId,
            'WfTaskListId': this.wfTaskListId,
            'SurveyMethod': surveymethod,
            'mode': mode
          }
        });
      }
    }
  }

  async claimTask() {
    const currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (environment.isCore) {
      const wfClaimObjV2 = {
        TaskId: this.wfTaskListId,
        UserId: currentUserContext[CommonConstant.USER_NAME],
      }
      this.http.post(URLConstant.ClaimTaskV2, wfClaimObjV2).subscribe(
        (response) => {
          console.log(response);
        });
    } else {
      const wfClaimObj = {
        pWFTaskListID: this.wfTaskListId,
        pUserID: currentUserContext[CommonConstant.USER_NAME],
        isLoading: false
      };
      this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
        (response) => {
          console.log(response);
        });
    }
  }

  back() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    if (this.isReturnHandling == false) {
      this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_PAGING], { queryParams: { 'BizTemplateCode': BizTemplateCode } });
    }
    if (this.isReturnHandling == true) {
      this.router.navigate([NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SURVEY_VERIF_PAGING], { queryParams: { 'BizTemplateCode': BizTemplateCode } });
    }
  }

  SaveReturnForm() {
    let request = {
      AppId: this.appId,
      WfTaskListId: this.wfTaskListId,
      ReturnTo: this.FormReturnObj.value.ReturnTo,
      Reason: this.FormReturnObj.value.Reason,
      Notes: this.FormReturnObj.value.Notes
    };

    let SubmitReturnHandlingSurveyVerifUrl = environment.isCore ? URLConstantX.SubmitReturnHandlingSurveyVerif : "";
    this.http.post(SubmitReturnHandlingSurveyVerifUrl, request).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.back();
      });
  }

  switchForm() {
    this.FormReturnObj.patchValue({
      ReturnTo: "",
      Reason: "",
      Notes: ""
    });

    if (!this.isReturnOn) {
      this.isReturnOn = true;
      this.FormReturnObj.controls.ReturnTo.setValidators([Validators.required]);
      this.FormReturnObj.controls.Reason.setValidators([Validators.required]);
      this.FormReturnObj.controls.Notes.setValidators([Validators.required]);
    } else {
      this.isReturnOn = false;
      this.FormReturnObj.controls.ReturnTo.clearValidators();
      this.FormReturnObj.controls.Reason.clearValidators();
      this.FormReturnObj.controls.Notes.clearValidators();
    }
    this.FormReturnObj.controls.ReturnTo.updateValueAndValidity();
    this.FormReturnObj.controls.Reason.updateValueAndValidity();
    this.FormReturnObj.controls.Notes.updateValueAndValidity();

  }
}
