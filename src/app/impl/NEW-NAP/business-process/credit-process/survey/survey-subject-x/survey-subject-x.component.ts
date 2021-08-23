import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { DatePipe } from '@angular/common';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { environment } from 'environments/environment';

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
  editRtnHandlingDUrl: any;
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
    TrxRefNo: "",
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
  ReturnHandlingDData: ReturnHandlingDObj;
  ReturnHandlingHData: ReturnHandlingHObj;
  OnFormReturnInfo: boolean = false;
  arrValue = [];
  SurveyMethod: string;
  isSkipSurvey: boolean = false;

  dmsObj: DMSObj;
  NapObj: AppObj;
  appNo: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, 
    private fb: FormBuilder, private router: Router, private cookieService: CookieService) {
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
    this.editRtnHandlingDUrl = URLConstant.EditReturnHandlingD;
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
    if (this.wfTaskListId != null || this.wfTaskListId != undefined)
      this.claimTask();

    this.initUrl();
    await this.initDms();
    this.appObj.id = this.appId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppData();
    await this.GetVerfResultData();
    await this.GetPhnVerfSubjData();
    if (this.isReturnHandling == true) {
      this.MakeViewReturnInfoObj();
    }
    else {
      this.ReturnHandlingForm.controls.IsAnyUpdate.setValidators(Validators.required);
      this.ReturnHandlingForm.controls.IsAnyUpdate.updateValueAndValidity();
    }
  }

  onChangeSkipSurvey(){
    if(this.ReturnHandlingForm.controls.IsAnyUpdate.value == 'YES'){
      this.isSkipSurvey = true;
    }else{
      this.isSkipSurvey = false;
    }
  }

  async SaveForm() {
    if(this.isReturnHandling == false && this.isSkipSurvey == false){
      if(this.phoneVerifObj == undefined || this.phoneVerifObj == null || this.phoneVerifObj.length == 0){
        this.toastr.errorMessage("Please add survey");
        return;
      }
    }

    if(this.isSkipSurvey){
      if(this.phoneVerifObj != undefined){
        if(this.phoneVerifObj.length > 0){
          this.toastr.errorMessage("Can't skip survey");
          return;
        }
      }
    }

    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    if (this.isReturnHandling == false) {
      var requestSurveyVerifOjb = {
        VerfResultNo : this.verifResultObj.VerfResultNo,
        Notes: this.ReturnHandlingForm.controls["UpdateNotes"].value,
        WfTaskListId: this.wfTaskListId
      };
      this.http.post(URLConstant.CompleteAppSurveyVerif, requestSurveyVerifOjb).subscribe(
        (response) => {

          this.toastr.successMessage(response["message"]);
          this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_PAGING], { queryParams: { "BizTemplateCode": BizTemplateCode } });
        });
    }
    if (this.isReturnHandling == true) {
      this.setReturnHandlingD();
      this.http.post(this.editRtnHandlingDUrl, this.ReturnHandlingDData).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.router.navigate([NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SURVEY_VERIF_PAGING], { queryParams: { "BizTemplateCode": BizTemplateCode } });
        });

    }

  }

  setReturnHandlingD() {
    this.ReturnHandlingDData = new ReturnHandlingDObj();
    this.ReturnHandlingDData.ReturnHandlingDId = this.returnHandlingDObj.ReturnHandlingDId;
    this.ReturnHandlingDData.ReturnHandlingHId = this.returnHandlingDObj.ReturnHandlingHId;
    this.ReturnHandlingDData.MrReturnTaskCode = this.returnHandlingDObj.MrReturnTaskCode;
    this.ReturnHandlingDData.ReturnStat = this.returnHandlingDObj.ReturnStat;
    this.ReturnHandlingDData.ReturnHandlingNotes = this.returnHandlingDObj.ReturnHandlingNotes;
    this.ReturnHandlingDData.ReturnHandlingExecNotes = this.ReturnHandlingForm.controls["ExecNotes"].value;
    this.ReturnHandlingDData.WfTaskListId = this.wfTaskListId;
    this.ReturnHandlingDData.RowVersion = this.returnHandlingDObj.RowVersion;
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
      var datePipe = new DatePipe("en-US");
      var value = datePipe.transform(Business_Date, "yyyy-MM-dd");
      var businessDt = new Date(value);

      var useraccess = localStorage.getItem(CommonConstant.USER_ACCESS);
      this.addVerifResultObj = new VerfResultObj();

      this.addVerifResultObj.TrxRefNo = this.AppObj.AppNo;
      this.addVerifResultObj.VerfDt = businessDt;
      this.addVerifResultObj.EmpNo = "-";
      this.addVerifResultObj.MrVerfResultStatCode = CommonConstant.VerfResultStatCodeNew;
      this.addVerifResultObj.MrVerfTrxTypeCode = CommonConstant.VerfTrxTypeCodeSurvey; //los-urs-153, upd trxtypecode utk survey verif
      this.addVerifResultObj.LobCode = this.AppObj.LobCode;
      this.addVerifResultObj.LobName = this.AppObj.LobCode;
      this.addVerifResultObj.Notes = "-";

      await this.http.post(this.addVerfResultUrl, this.addVerifResultObj).toPromise().then(
        (response) => {
          this.verifResultObj = new VerfResultObj();
          this.verifResultObj.VerfResultNo = response['VerfResultNo'];
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
    var link = environment.losR3Web + NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VIEW + "?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid;

    window.open(link , "_blank");
  }

  QuestionObj: any;
  async GetQuestionList(VerfQAObj) : Promise<any> {
    var isExist : Boolean = true;
    await this.http.post(URLConstant.GetVerfQuestionListByAppIdAndSubjectForSurveyVerif, VerfQAObj).toPromise().then(
      (response) => {
        this.QuestionObj = response[CommonConstant.ReturnObj];
        if (this.QuestionObj != null && this.QuestionObj.VerfQuestionAnswerListObj.length != 0) {
        }
        else {
          this.toastr.warningMessage("Questions are not loaded, please check RULE or Question Scheme if there're any typos in RULE or question scheme is not available for this BizTemplateCode");
          isExist = false;
        }
      }
    );
    return isExist;
  }

  async Verif(mode:any, VerifResultHid:any, SubjectType:any, SurveyMethod: any, IdSource:any) {
    if(mode == 'add'){
      var surveymethod = this.ReturnHandlingForm.controls.SurveyMethod.value;
      var VerfQAObj = {
        AppId: this.appId,
        Subject: surveymethod
      };
      const isExist : Boolean = await this.GetQuestionList(VerfQAObj);

      if(!isExist){
        return;
      }

      if (this.isReturnHandling == false) {
        this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VERIF], { queryParams: { "AppId": this.appId, "WfTaskListId": this.wfTaskListId, "SurveyMethod": surveymethod, "mode": mode } });
      }
      if (this.isReturnHandling == true) {        
        this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VERIF], { queryParams: { "AppId": this.appId, "ReturnHandlingHId": this.returnHandlingHId, "WfTaskListId": this.wfTaskListId, "SurveyMethod": surveymethod, "mode": mode } });
      }
    }else{
      if (this.isReturnHandling == false) {        
        this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VERIF], { queryParams: { "AppId": this.appId, "VerfResultHId": VerifResultHid, "Type": SubjectType, "WfTaskListId": this.wfTaskListId, "SurveyMethod": surveymethod, "mode": mode } });
      }
      if (this.isReturnHandling == true) {        
        this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VERIF], { queryParams: { "AppId": this.appId, "VerfResultHId": VerifResultHid, "Type": SubjectType, "ReturnHandlingHId": this.returnHandlingHId, "WfTaskListId": this.wfTaskListId, "SurveyMethod": surveymethod, "mode": mode } });
      }
    }
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = {
      pWFTaskListID: this.wfTaskListId,
      pUserID: currentUserContext[CommonConstant.USER_NAME],
      isLoading: false
    };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
        console.log(response);
      });
  }

  back() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    if (this.isReturnHandling == false) {
      this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_PAGING], { queryParams: { "BizTemplateCode": BizTemplateCode } });
    }
    if (this.isReturnHandling == true) {
      this.router.navigate([NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_SURVEY_VERIF_PAGING], { queryParams: { "BizTemplateCode": BizTemplateCode } });
    }
  }
}
