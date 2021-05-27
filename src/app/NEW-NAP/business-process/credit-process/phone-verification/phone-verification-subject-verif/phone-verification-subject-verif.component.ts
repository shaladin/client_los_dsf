import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray, FormGroup, FormGroupDirective } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { VerfResultDObj } from 'app/shared/model/VerfResultD/VerfResultH.Model';
import { VerifResulHDetailObj } from 'app/shared/model/VerfResultH/VerifResulHDetailObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ReqVerfQuestionAnswerObj } from 'app/shared/model/Request/Verification/ReqVerfQuestionAnswerObj.model';
import { ReqPhoneNumberObj } from 'app/shared/model/Request/PhoneVerification/ReqPhoneNumberObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { ReqGetVerfResult4Obj, ReqGetVerfResultObj } from 'app/shared/model/VerfResult/ReqGetVerfResultObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';



@Component({
  selector: "phone-verification-subject-verif",
  templateUrl: "./phone-verification-subject-verif.component.html",
  providers: [NGXToastrService]
})
export class PhoneVerificationSubjectVerifComponent implements OnInit {

  isReturnHandling: boolean = false;

  PhoneDataForm = this.fb.group({

    //VerfResultId: ['', Validators.required],
    //VerfSchemeHId: ['', Validators.required],
    //MrVerfObjectCode: ['', [Validators.required, Validators.maxLength(50)]],
    AppNo: [''],
    CustNo: [''],
    CustName: [''],
    Subject: [''],
    SubjectName: [''],
    MrVerfSubjectRelationCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrVerfResultHStatCode: ['', [Validators.required, Validators.maxLength(50)]],
    Phn: ['', [Validators.required, Validators.maxLength(50)]],
    PhnType: ['', [Validators.required, Validators.maxLength(100)]],
    Notes: ['', [Validators.required, Validators.maxLength(4000)]],
    Score: [''],
    QuestionObjs: new FormArray([])
  });

  PhoneDataObj: VerifResulHDetailObj;

  ListVerfAnswer = [];
  custId: number;
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
    Id: 0,
  };
  IsDataReady: boolean = true;

  verfResObj: ReqGetVerfResultObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodePhn,
  };

  verfResHObj: ReqGetVerfResult4Obj = {
    VerfResultId: 0,
    MrVerfObjectCode: "",
  };

  refMasterObj = {
    RefMasterTypeCode: "",
  };

  refStatusObj = {
    StatusGrpCode: ""
  };

  PhnObj: ReqPhoneNumberObj = new ReqPhoneNumberObj();
  AppObj: AppObj = new AppObj();
  AppCustObj: any;
  verifResultObj: any;
  verifResultHObj: any;
  verifResultHDetailObj: any;
  listVerifResultHObj: any;
  verfResultDListObjs: Array<VerfResultDObj>;
  CustNoObj: GenericObj = new GenericObj();
  ResultObj: any;
  SubjectRelationObj: any;
  PhoneNumberObj: any;
  QuestionObj: any;
  isQuestionLoaded: boolean = true;
  subjectRelation: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router, private cookieService: CookieService) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
      this.verfResultHId = params["VerfResultHId"];
      this.subjectName = params["Name"];
      this.subjectType = params["Type"];
      this.subjectRelation = params["Relation"];
      this.idSource = params["Source"];
      if (params['ReturnHandlingHId'] != null) {
        this.returnHandlingHId = params['ReturnHandlingHId'];
        this.isReturnHandling = true;
      }
      if (params['WfTaskListId'] != null) {
        this.wfTaskListId = params['WfTaskListId'];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    let GetVerfQAObj = new ReqVerfQuestionAnswerObj();
    GetVerfQAObj.AppId = this.appId;
    GetVerfQAObj.Subject = this.subjectType;
    this.setPhnObj();
    this.appObj.Id = this.appId;
    this.bindResultObj();
    this.bindSubjectRelationObj();
    this.GetPhoneNumber(this.PhnObj);
    await this.GetQuestionList(GetVerfQAObj);
    await this.GetAppData();
    await this.GetAppCust();
    await this.GetVerfResultData();
    await this.GetCust();
    if (this.verfResultHId != 0) {
      await this.GetVerfResultHData();
      await this.GetListVerfResulHtData(this.verfResHObj);
    };
  }

  OpenView(key: string) {
    if (key == 'app') {
      AdInsHelper.OpenAppViewByAppId(this.appId);
    } else if (key == 'cust') {
      AdInsHelper.OpenCustomerViewByCustId(this.custId);
    }
  }

  AddDetail(formDirective: FormGroupDirective) {
    if (this.isQuestionLoaded == false) {
      this.toastr.warningMessage("Can't process further because questions are not loaded");
    }
    else {
      this.setPhoneVerifData();
      this.http.post(URLConstant.AddVerfResultHeaderAndVerfResultDetail, this.PhoneDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
            this.GetVerfResultHData();
            this.GetListVerfResulHtData(this.verfResHObj);
            formDirective.resetForm();
            this.clearform();
        });
    }
  }

  Save(){
    if(this.listVerifResultHObj.length < 1){
      this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_HISTORY);
    }else{
      if (this.isReturnHandling == false) {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_SUBJECT], { AppId: this.appId, WfTaskListId: this.wfTaskListId });
      }
      if (this.isReturnHandling == true) {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_SUBJECT], { AppId: this.appId, ReturnHandlingHId: this.returnHandlingHId, WfTaskListId: this.wfTaskListId });
      }
    }
  }

  setPhoneVerifData() {

    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    var todaydate = new Date();
    businessDt.setHours(todaydate.getHours(), todaydate.getMinutes(), todaydate.getSeconds());
    var usertimezone = businessDt.getTimezoneOffset() * 60000;
    businessDt = new Date(businessDt.getTime() - usertimezone);

    this.PhoneDataObj = new VerifResulHDetailObj();
    this.PhoneDataObj.VerfResultDListObj = new Array<VerfResultDObj>();
    this.PhoneDataObj.VerfResultHObj.VerfResultId = this.verifResultObj.VerfResultId;
    this.PhoneDataObj.VerfResultHObj.VerfSchemeHId = this.verfSchemeHId;
    this.PhoneDataObj.VerfResultHObj.MrVerfObjectCode = this.subjectType;
    this.PhoneDataObj.VerfResultHObj.MrVerfSubjectRelationCode = this.PhoneDataForm.controls["MrVerfSubjectRelationCode"].value;
    this.PhoneDataObj.VerfResultHObj.MrVerfSubjectRelationName = this.subjectName;
    this.PhoneDataObj.VerfResultHObj.VerfDt = businessDt;
    this.PhoneDataObj.VerfResultHObj.MrVerfResultHStatCode = this.PhoneDataForm.controls["MrVerfResultHStatCode"].value;
    this.PhoneDataObj.VerfResultHObj.Phn = this.PhoneDataForm.controls["Phn"].value;
    this.PhoneDataObj.VerfResultHObj.PhnType = this.PhoneDataForm.controls["PhnType"].value;
    this.PhoneDataObj.VerfResultHObj.Notes = this.PhoneDataForm.controls["Notes"].value;
    if (this.PhoneDataForm.controls["MrVerfResultHStatCode"].value == CommonConstant.VerfResultStatSuccess) {
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
  }

  setPhnObj() {
    this.PhnObj.AppId = this.appId;
    this.PhnObj.IdSource = this.idSource;
    this.PhnObj.Source = this.subjectType;
  }

  async GetAppData() {
    await this.http.post(URLConstant.GetAppById, this.appObj).toPromise().then(
      (response: AppObj) => {
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
        this.IsDataReady = true;
        //this.PhoneDataForm.patchValue({
        //  AppNo: this.AppObj.AppNo,
        //});
      }
    );
  }

  async GetAppCust() {
    await this.http.post(URLConstant.GetAppCustByAppId, this.appObj).toPromise().then(
      (response) => {
        this.AppCustObj = response;
        //this.PhoneDataForm.patchValue({
        //  CustNo: this.AppCustObj.CustNo,
        //  CustName: this.AppCustObj.CustName,
        //});
      }
    );
  }

  async GetCust() {
    this.CustNoObj.CustNo = this.AppCustObj['CustNo'];
    await this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).toPromise().then(
      (response) => {
        this.custId = response["CustId"];
      })
  };

  async GetQuestionList(GetVerfQAObj: ReqVerfQuestionAnswerObj) {
    await this.http.post(URLConstant.GetVerfQuestionListByAppIdAndSubjectForPhoneVerif, GetVerfQAObj).toPromise().then(
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
          ResultGrp.push(QuestionResultGrp);
        }
        this.ChangeResult();
      }
    }
  }

  async GetPhoneNumber(PhnObj) {
    await this.http.post(URLConstant.GetPhoneNumberByIdSourceAppIdAndSubject, PhnObj).toPromise().then(
      (response) => {
        this.PhoneNumberObj = response[CommonConstant.ReturnObj];
        if (this.PhoneNumberObj.length > 0) {
          this.PhoneDataForm.patchValue({
            Phn: this.PhoneNumberObj[0].PhoneNumber,
            PhnType: this.PhoneNumberObj[0].PhoneType
          });
        }
      }
    );
  }

  async GetVerfResultData() {
    await this.http.post(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, this.verfResObj).toPromise().then(
      (response) => {
        this.verifResultObj = response;
        this.verfResHObj.VerfResultId = this.verifResultObj.VerfResultId;
      }
    );
  }

  async GetVerfResultHData() {
    await this.http.post(URLConstant.GetVerfResultHById, { Id: this.verfResultHId }).toPromise().then(
      (response) => {
        this.verifResultHObj = response;
        this.verfResHObj.MrVerfObjectCode = this.verifResultHObj.MrVerfObjectCode;
      }
    );
  }

  async GetListVerfResulHtData(verfResHObj: ReqGetVerfResult4Obj) {
    await this.http.post(URLConstant.GetVerfResultHsByVerfResultIdAndObjectCode, verfResHObj).toPromise().then(
      (response) => {
        this.listVerifResultHObj = response["responseVerfResultHCustomObjs"];
      }
    );
  }

  bindResultObj() {
    this.refStatusObj.StatusGrpCode = CommonConstant.StatusGrpVerfResultStat;
    this.http.post(URLConstant.GetListActiveRefStatusByStatusGrpCode, { Code: CommonConstant.StatusGrpVerfResultStat }).subscribe(
      (response) => {
        this.ResultObj = response[CommonConstant.ReturnObj];
        if (this.ResultObj.length > 0) {
          this.PhoneDataForm.patchValue({
            MrVerfResultHStatCode: this.ResultObj[0].Key
          });

        }
      }
    );
  }

  bindSubjectRelationObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.SubjectRelationObj = response[CommonConstant.ReturnObj];
        // if (this.SubjectRelationObj.length > 0) {
        //   this.PhoneDataForm.patchValue({
        //     MrVerfSubjectRelationCode: this.SubjectRelationObj[0].Key
        //   });
        // }
      }
    );

    this.PhoneDataForm.patchValue({
      MrVerfSubjectRelationCode: this.subjectRelation
    });
  }

  //PhoneChange(phnNumber, phnType) {
  //  this.PhoneDataForm.patchValue({
  //    Phn: phnNumber,
  //    PhnType: phnType
  //  });
  //}

  PhoneChange() {
    var temp: any;
    temp = this.PhoneNumberObj.filter(
      x => x.PhoneNumber == this.PhoneDataForm.controls["Phn"].value);
    this.PhoneDataForm.patchValue({
      Phn: temp[0].PhoneNumber,
      PhnType: temp[0].PhoneType
    });
  }
  Cancel() {
    if (this.isReturnHandling == false) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_SUBJECT], { AppId: this.appId, WfTaskListId: this.wfTaskListId });
    }
    if (this.isReturnHandling == true) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_SUBJECT], { AppId: this.appId, ReturnHandlingHId: this.returnHandlingHId, WfTaskListId: this.wfTaskListId });
    }
  }

  clearform() {
    this.PhoneDataForm.reset();
    this.PhoneDataForm = this.fb.group({
      MrVerfSubjectRelationCode: ['', [Validators.required, Validators.maxLength(50)]],
      MrVerfResultHStatCode: ['', [Validators.required, Validators.maxLength(50)]],
      Phn: ['', [Validators.required, Validators.maxLength(50)]],
      PhnType: ['', [Validators.required, Validators.maxLength(100)]],
      Notes: ['', [Validators.required, Validators.maxLength(4000)]],
      Score: [''],
      QuestionObjs: new FormArray([])
    });
    this.PhoneDataForm.controls.Notes.markAsPristine();
    this.PhoneDataForm.markAsUntouched();


    this.GenerateFormVerfQuestion();
    if (this.PhoneNumberObj.length > 0) {
      this.PhoneDataForm.patchValue({
        Phn: this.PhoneNumberObj[0].PhoneNumber,
        PhnType: this.PhoneNumberObj[0].PhoneType
      });
    }
    if (this.SubjectRelationObj.length > 0) {
      this.PhoneDataForm.patchValue({
        MrVerfSubjectRelationCode: this.SubjectRelationObj[0].Key
      });
    }
    if (this.ResultObj.length > 0) {
      this.PhoneDataForm.patchValue({
        MrVerfResultHStatCode: this.ResultObj[0].Key
      });

    }
  }

  Navigate() {
    AdInsHelper.OpenAppViewByAppId(this.appObj.Id);
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

  test() {
    this.setPhoneVerifData();
    //if (this.isReturnHandling == false) {
    //  this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject?AppId=" + this.appId);
    //}
    //if (this.isReturnHandling == true) {
    //  this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject?AppId=" + this.appId + "&ReturnHandlingDId=" + this.returnHandlingDId + "&WfTaskListId=" + this.wfTaskListId);
    //}
  }
}
