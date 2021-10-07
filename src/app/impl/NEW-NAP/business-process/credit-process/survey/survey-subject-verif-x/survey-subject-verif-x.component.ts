import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray, FormGroup, FormGroupDirective } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { VerifResulHDetailObj } from 'app/shared/model/VerfResultH/VerifResulHDetailObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { formatDate } from '@angular/common';
import { VerfResultDObj } from 'app/shared/model/VerfResultD/VerfResultD.Model';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-survey-subject-verif-x',
  templateUrl: './survey-subject-verif-x.component.html',
  providers: [NGXToastrService]
})
export class SurveySubjectVerifXComponent implements OnInit {

  isReturnHandling: boolean = false;
  @ViewChild("fileInput") fileInput;
  @ViewChild("fileInputDescription") fileInputDescription;
  StoreFiles: Array<any>;

  PhoneDataForm = this.fb.group({
    AppNo: [''],
    CustNo: [''],
    CustName: [''],
    Subject: [''],
    SubjectName: [''],
    MrVerfSubjectRelationCode: ['', [Validators.maxLength(50)]],
    MrVerfResultHStatCode: ['', [Validators.maxLength(50)]],
    Phn: ['', [Validators.maxLength(50)]],
    PhnType: ['', [Validators.maxLength(100)]],
    Notes: ['', [Validators.required, Validators.maxLength(4000)]],
    Score: [''],
    QuestionObjs: new FormArray([]),
    UploadObjs: new FormArray([]),
    SurveyDt: ['', Validators.required],
    SurveyNo: ['']
  });

  PhoneDataObj: VerifResulHDetailObj;

  ListVerfAnswer = [];
  getVerfResultUrl: any;
  getAppUrl: any;
  getListVerfResulHtUrl: any;
  getVerfResultHUrl: any;
  getAppCustUrl: any;
  getRefMasterUrl: any;
  getRefStatusUrl: any;
  getQuestionUrl: any;
  saveVerfResultHDetailUrl: any;
  getPhnNumberUrl: any;
  custId: number;
  viewObj: any;
  VerfResultAfterAddObj: any;
  appId: number;
  returnHandlingHId: number;
  wfTaskListId: number;
  verfResultHId: number;
  subjectName: string;
  subjectType: string;
  idSource: number;
  verfSchemeHId: number;
  appObj = {
    id: 0,
  };

  verfResObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodeSurvey,
  };

  verfResHObj = {
    id: 0,
    verfResultId: 0,
    mrVerfObjectCode: ""
  };

  refMasterObj = {
    RefMasterTypeCode: "",
  };

  refStatusObj = {
    StatusGrpCode: ""
  };

  phnObj = {
    IdSource: 0,
    AppId: 0,
    Source: "",
  };

  AppObj: any;
  AppCustObj: any;
  verifResultObj: any;
  verifResultHObj: any;
  verifResultHDetailObj: any;
  listVerifResultHObj: any;
  verfResultDListObjs: Array<VerfResultDObj>;
  ResultObj: any;
  SubjectRelationObj: any;
  PhoneNumberObj: any;
  QuestionObj: any;
  isQuestionLoaded: boolean = true;
  mode:string;
  SurveyMethod:string;
  arrValue = [];
  MaxDate: Date;
  UserAccess: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.mode = params["mode"];
      this.SurveyMethod = params["SurveyMethod"];

      this.appId = params["AppId"];
      this.verfResultHId = params["VerfResultHId"];

      this.subjectType = params["Type"];

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
    this.getAppUrl = URLConstant.GetAppById;
    this.getVerfResultUrl = URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode;
    this.getListVerfResulHtUrl = URLConstant.GetVerfResultHsByVerfResultIdAndObjectCode;
    this.getVerfResultHUrl = URLConstant.GetVerfResultHById;
    this.getAppCustUrl = URLConstant.GetAppCustByAppId;
    this.getRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.getRefStatusUrl = URLConstant.GetListActiveRefStatusByStatusGrpCode;
    this.getPhnNumberUrl = URLConstant.GetPhoneNumberByIdSourceAppIdAndSubject;

    this.getQuestionUrl = URLConstant.GetVerfQuestionListByAppIdAndSubjectForSurveyVerif;
  }

  async ngOnInit(): Promise<void> {
    this.StoreFiles = new Array();
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = new Date(this.UserAccess.BusinessDt);
    this.arrValue.push(this.appId);
    var VerfQAObj = {
      AppId: this.appId,
      Subject: this.SurveyMethod
    };
    this.initUrl();
    this.appObj.id = this.appId;
    this.verfResHObj.id = this.verfResultHId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";

    await this.GetAppData();
    await this.GetVerfResultData();
    if (this.verfResultHId != 0) {
      await this.GetVerfResultHData();
      await this.GetListVerfResultHData(this.verfResHObj);
    };

    if(this.mode == 'edit'){
      await this.setData();
      this.saveVerfResultHDetailUrl = URLConstantX.EditVerfResultHeaderAndVerfResultDetailForSurveyVerif;
    }else{
      this.saveVerfResultHDetailUrl = URLConstantX.AddVerfResultHeaderAndVerfResultDetailForSurveyVerif;
      await this.GetQuestionList(VerfQAObj);
    }
  }

  async setData(){
    var VerfQAObj = {
      id : this.verfResultHId
    };

    this.PhoneDataForm.patchValue({
      SurveyNo: this.verifResultHObj.MrVerfObjectCode,
      SurveyDt: formatDate(this.verifResultHObj.VerfDt, 'yyyy-MM-dd', 'en-US'),
      Notes: this.verifResultHObj.Notes
    });

    this.getQuestionUrl = URLConstant.GetVerfQuestionListByAppIdAndSubjectForSurveyVerifEdit;
    await this.http.post(this.getQuestionUrl, VerfQAObj).toPromise().then(
      (response) => {
        this.QuestionObj = response[CommonConstant.ReturnObj];
        if (this.QuestionObj != null && this.QuestionObj.VerfQuestionAnswerListObj.length != 0) {
          this.verfSchemeHId = this.QuestionObj.VerfSchemeHId
          this.GenerateFormVerfQuestion();
        }
        else {
          this.isQuestionLoaded = false;
          this.toastr.warningMessage("Questions are not loaded, please check RULE or Question Scheme if there're any typos in RULE or question scheme is not available for this BizTemplateCode");
        }
      }
    );
  }

  SaveForm(formDirective: FormGroupDirective) {
    if (this.isQuestionLoaded == false) {
      this.toastr.warningMessage("Can't process further because questions are not loaded");
    }
    else {
      this.setPhoneVerifData();
      this.http.post(this.saveVerfResultHDetailUrl, this.PhoneDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          if (this.isReturnHandling == false) {
            this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT], { queryParams: { "AppId": this.appId, "WfTaskListId": this.wfTaskListId } });
          }
          else if (this.isReturnHandling == true) {
            this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT], { queryParams: { "AppId": this.appId, "ReturnHandlingHId": this.returnHandlingHId, "WfTaskListId": this.wfTaskListId } });
          }
        }
      );
    }
  }

  setPhoneVerifData() {
    var businessDt = new Date(this.PhoneDataForm.controls["SurveyDt"].value);
    var todaydate = new Date();
    businessDt.setHours(todaydate.getHours(), todaydate.getMinutes(), todaydate.getSeconds());
    var usertimezone = businessDt.getTimezoneOffset() * 60000;
    businessDt = new Date(businessDt.getTime() - usertimezone);

    this.PhoneDataObj = new VerifResulHDetailObj();

    if(this.mode == 'edit'){
      this.PhoneDataObj.VerfResultHObj.VerfResultHId = this.verfResultHId;
    }

    this.PhoneDataObj.VerfResultDListObj = new Array<VerfResultDObj>();
    this.PhoneDataObj.VerfResultHObj.VerfResultId = this.verifResultObj.VerfResultId;
    this.PhoneDataObj.VerfResultHObj.VerfSchemeHId = this.verfSchemeHId;

    this.PhoneDataObj.VerfResultHObj.MrVerfObjectCode = this.verfResHObj.mrVerfObjectCode;

    this.PhoneDataObj.VerfResultHObj.MrVerfSubjectRelationCode = "CUST";
    this.PhoneDataObj.VerfResultHObj.MrVerfSubjectRelationName = "-";
    this.PhoneDataObj.VerfResultHObj.VerfDt = businessDt;
    this.PhoneDataObj.VerfResultHObj.MrVerfResultHStatCode = "-";
    this.PhoneDataObj.VerfResultHObj.Phn = "0";
    this.PhoneDataObj.VerfResultHObj.PhnType = this.SurveyMethod;
    this.PhoneDataObj.VerfResultHObj.Notes = this.PhoneDataForm.controls["Notes"].value;
    for (let i = 0; i < this.PhoneDataForm.controls["QuestionObjs"].value.length; i++) {
      var currGrp = this.PhoneDataForm.controls["QuestionObjs"].value[i].VerfQuestionAnswerList;
      for (let j = 0; j < currGrp.length; j++) {
        var currAnswer = currGrp[j].ResultGrp;
        var question = new VerfResultDObj();
        question.VerfQuestionAnswerId = currAnswer.VerfQuestionAnswerId;
        question.VerfQuestionText = currAnswer.VerfQuestionText;
        question.Answer = currAnswer.Answer;
        question.Notes = currAnswer.Notes;
        question.SeqNo = currAnswer.SeqNo;
        question.VerfQuestionGroupCode = currAnswer.VerfQuestionGroupCode;
        this.PhoneDataObj.VerfResultDListObj.push(question);
      }
    }
  }

  async GetAppData() {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
      }
    );
  }

  async GetQuestionList(VerfQAObj) {
    await this.http.post(this.getQuestionUrl, VerfQAObj).toPromise().then(
      (response) => {
        this.QuestionObj = response[CommonConstant.ReturnObj];
        if (this.QuestionObj != null && this.QuestionObj.VerfQuestionAnswerListObj.length != 0) {
          this.verfSchemeHId = this.QuestionObj.VerfSchemeHId
          this.GenerateFormVerfQuestion();
        }
        else {
          this.isQuestionLoaded = false;
          this.toastr.warningMessage("Questions are not loaded, please check RULE or Question Scheme if there're any typos in RULE or question scheme is not available for this BizTemplateCode");
        }
      }
    );
  }

  GenerateFormVerfQuestion() {
    this.QuestionObj.VerfQuestionAnswerListObj[0].VerfQuestionGrpName
    var grpListObj = this.QuestionObj.VerfQuestionAnswerListObj;

    for (let i = 0; i < grpListObj.length; i++) {
      var QuestionGrp = this.fb.group({
        VerfQuestionGrpCode: grpListObj[i].VerfQuestionGrpCode,
        VerfQuestionGrpName: grpListObj[i].VerfQuestionGrpName,
        VerfQuestionAnswerList: this.fb.array([])
      }) as FormGroup;
      (this.PhoneDataForm.controls["QuestionObjs"] as FormArray).push(QuestionGrp);
      var ResultGrp = this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"] as FormArray;
      var QuestionList = grpListObj[i].verfQuestionAnswerList;

      this.ListVerfAnswer.push([]);
      if (QuestionList.length != 0) {
        for (let j = 0; j < QuestionList.length; j++) {
          var QuestionResultGrp = this.fb.group({
            QuestionGrp: this.fb.group({
              VerfQuestionAnswerId: QuestionList[j].VerfQuestionAnswerId,
              RefVerfAnswerTypeId: QuestionList[j].RefVerfAnswerTypeId,
              VerfQuestionCode: QuestionList[j].VerfQuestionCode,
              VerfQuestionText: QuestionList[j].VerfQuestionText,
              VerfAnswer: QuestionList[j].VerfAnswer,
              IsActive: QuestionList[j].IsActive,
              VerfSchemeHId: QuestionList[j].VerfSchemeHId,
              VerfQuestionGrpCode: QuestionList[j].VerfQuestionGrpCode,
              VerfQuestionGrpName: QuestionList[j].VerfQuestionGrpName,
              VerfAnswerTypeCode: QuestionList[j].VerfAnswerTypeCode,
              VerfAnswerTypeDescr: QuestionList[j].VerfAnswerTypeDescr
            }),
            ResultGrp: this.fb.group({
              VerfResultDId: 0,
              VerfResultHId: 0,
              VerfQuestionAnswerId: QuestionList[j].VerfQuestionAnswerId,
              VerfQuestionText: QuestionList[j].VerfQuestionText,
              Answer: "",
              Notes: "",
              SeqNo: j + 1,
              Score: 0,
              VerfQuestionGroupCode: grpListObj[i].VerfQuestionGrpCode
            })
          }) as FormGroup;

          if (this.mode == 'add') {
            if (QuestionList[j].VerfAnswerTypeCode == CommonConstant.VerfAnswerTypeCodeDdl) {
              if (QuestionList[j].VerfAnswer != "") {
                var ddlList = QuestionList[j].VerfAnswer.split(";");
                this.ListVerfAnswer[i].push(ddlList);
                QuestionResultGrp.controls.ResultGrp.patchValue({
                  Answer: this.ListVerfAnswer[i][j][0]
                })
              } else {
                this.ListVerfAnswer[i].push("");
              }
              QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required])
            } else if (QuestionList[j].VerfAnswerTypeCode == CommonConstant.VerfAnswerTypeCodeUcInputNumber) {
              QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required]);
              this.ListVerfAnswer[i].push("");
            } else {
              QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required])
              this.ListVerfAnswer[i].push("");
            }
          }else{
            if (QuestionList[j].VerfAnswerTypeCode == CommonConstant.VerfAnswerTypeCodeDdl) {
              if (QuestionList[j].VerfAnswer != "") {
                var ddlList = QuestionList[j].VerfAnswer.split(";");
                this.ListVerfAnswer[i].push(ddlList);
                QuestionResultGrp.controls.ResultGrp.patchValue({
                  Answer: this.ListVerfAnswer[i][j][this.ListVerfAnswer[i][j].indexOf(QuestionList[j].PastAnswer)]
                })
              } else {
                this.ListVerfAnswer[i].push("");
              }
              QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required])
            } else if (QuestionList[j].VerfAnswerTypeCode == CommonConstant.VerfAnswerTypeCodeUcInputNumber) {
              QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required]);
              this.ListVerfAnswer[i].push("");
              if(QuestionList[j].PastAnswer != undefined && QuestionList[j].PastAnswer != null){
                QuestionResultGrp.controls.ResultGrp.patchValue({
                  Answer: QuestionList[j].PastAnswer
                })
              }
            } else {
              QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required])
              this.ListVerfAnswer[i].push("");
              if(QuestionList[j].PastAnswer != undefined && QuestionList[j].PastAnswer != null){
                QuestionResultGrp.controls.ResultGrp.patchValue({
                  Answer: QuestionList[j].PastAnswer
                })
              }
            }
            QuestionResultGrp.controls.ResultGrp.patchValue({
              Notes: QuestionList[j].Notes
            })
          }
          ResultGrp.push(QuestionResultGrp);
        }
        this.ChangeResult();
      }
    }
  }

  async GetVerfResultData() {
    await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
      (response) => {
        this.verifResultObj = response;
        this.verfResHObj.verfResultId = this.verifResultObj.VerfResultId;
      }
    );
  }

  async GetVerfResultHData() {
    await this.http.post(this.getVerfResultHUrl, this.verfResHObj).toPromise().then(
      (response) => {
        this.verifResultHObj = response;
        this.verfResHObj.mrVerfObjectCode = this.verifResultHObj.MrVerfObjectCode;
        if(this.mode == 'edit'){
          this.SurveyMethod = this.verifResultHObj.PhnType;
        }
      }
    );
  }

  async GetListVerfResultHData(verfResHObj) {
    await this.http.post(this.getListVerfResulHtUrl, verfResHObj).toPromise().then(
      (response) => {
        this.listVerifResultHObj = response["responseVerfResultHCustomObjs"];
      }
    );
  }

  Cancel() {
    if (this.isReturnHandling == false) {
      this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT], { queryParams: { "AppId": this.appId, "WfTaskListId": this.wfTaskListId } });
    }
    else if (this.isReturnHandling == true) {
      this.router.navigate([NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT], { queryParams: { "AppId": this.appId, "ReturnHandlingHId": this.returnHandlingHId, "WfTaskListId": this.wfTaskListId } });
    }
  }

  ChangeResult() {
    if (this.PhoneDataForm.controls["MrVerfResultHStatCode"].value == CommonConstant.VerfResultStatSuccess) {
      for (let i = 0; i < this.PhoneDataForm.controls["QuestionObjs"]["controls"].length; i++) {
        for (let j = 0; j < this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"].length; j++) {
          this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"][j]["controls"]["ResultGrp"]["controls"]["Answer"].setValidators([Validators.required]);
          this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"][j]["controls"]["ResultGrp"]["controls"]["Answer"].updateValueAndValidity();
        }
      }
    }
    else {
      for (let i = 0; i < this.PhoneDataForm.controls["QuestionObjs"]["controls"].length; i++) {
        for (let j = 0; j < this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"].length; j++) {
          this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"][j]["controls"]["ResultGrp"]["controls"]["Answer"].clearValidators();
          this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"][j]["controls"]["ResultGrp"]["controls"]["Answer"].updateValueAndValidity();
        }
      }
    }
  }

}
