import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray, FormGroup, FormGroupDirective } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { DatePipe } from '@angular/common';
import { VerfResultDObj } from 'app/shared/model/VerfResultD/VerfResultH.Model';
import { VerifResulHDetailObj } from 'app/shared/model/VerfResultH/VerifResulHDetailObj.model';
import { environment } from 'environments/environment';



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
  getVerfResultUrl: any;
  getAppUrl: any;
  getListVerfResulHtUrl: any;
  getVerfResulHtUrl: any;
  getAppCustUrl: any;
  getRefMasterUrl: any;
  getRefStatusUrl: any;
  getQuestionUrl: any;
  saveVerfResultHDetailUrl: any;
  getPhnNumberUrl: any;

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
    AppId: 0,
  };

  verfResObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: AdInsConstant.VerfTrxTypeCodePhn,
  };

  verfResHObj = {
    VerfResultHId: 0,
    VerfResultId: 0,
    MrVerfObjectCode: "",
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

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
      this.verfResultHId = params["VerfResultHId"];
      this.subjectName = params["Name"];
      this.subjectType = params["Type"];
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

  initUrl() {
    this.getAppUrl = AdInsConstant.GetAppById;
    this.getVerfResultUrl = AdInsConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode;
    this.getListVerfResulHtUrl = AdInsConstant.GetVerfResultHsByVerfResultIdAndObjectCode;
    this.getVerfResulHtUrl = AdInsConstant.GetVerfResultHById;
    this.getAppCustUrl = AdInsConstant.GetAppCustByAppId;
    this.getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getRefStatusUrl = AdInsConstant.GetListActiveRefStatusByStatusGrpCode;
    this.getPhnNumberUrl = AdInsConstant.GetPhoneNumberByIdSourceAppIdAndSubject;
    this.getQuestionUrl = AdInsConstant.GetVerfQuestionListByAppIdAndSubjectForPhoneVerif;
    this.saveVerfResultHDetailUrl = AdInsConstant.AddVerfResultHeaderAndVerfResultDetail;
  }

  async ngOnInit(): Promise<void> {
    var VerfQAObj = {
      AppId: this.appId,
      Subject: this.subjectType
    };
    this.initUrl();
    this.setPhnObj();
    this.appObj.AppId = this.appId;
    this.verfResHObj.VerfResultHId = this.verfResultHId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.bindResultObj();
    this.bindSubjectRelationObj();
    this.GetPhoneNumber(this.phnObj);
    await this.GetQuestionList(VerfQAObj);
    await this.GetAppData();
    await this.GetAppCust();
    await this.GetVerfResultData();

    if (this.verfResultHId != 0) {
      await this.GetVerfResultHData();
      await this.GetListVerfResulHtData(this.verfResHObj);
    };


  }

  SaveForm(formDirective: FormGroupDirective) {
    var activeButton = document.activeElement.id;
    if (this.isQuestionLoaded == false) {
      this.toastr.errorMessage("Can't process further because questions are not loaded");
    }
    else {
      this.setPhoneVerifData();
      this.http.post(this.saveVerfResultHDetailUrl, this.PhoneDataObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          if (activeButton == "save") {
            if (this.isReturnHandling == false) {
              this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject?AppId=" + this.appId + "&WfTaskListId=" + this.wfTaskListId);
            }
            if (this.isReturnHandling == true) {
              this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject?AppId=" + this.appId + "&ReturnHandlingHId=" + this.returnHandlingHId + "&WfTaskListId=" + this.wfTaskListId);
            }
          }
          else {
            this.VerfResultAfterAddObj = response;
            this.verfResHObj.MrVerfObjectCode = this.VerfResultAfterAddObj.MrVerfObjectCode
            this.GetListVerfResulHtData(this.verfResHObj);
            formDirective.resetForm();
            this.clearform();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  setPhoneVerifData() {
    var businessDt = new Date();

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

  setPhnObj() {
    this.phnObj.AppId = this.appId;
    this.phnObj.IdSource = this.idSource;
    this.phnObj.Source = this.subjectType;
  }

  async GetAppData() {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {
        console.log(response);
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
        //this.PhoneDataForm.patchValue({
        //  AppNo: this.AppObj.AppNo,
        //});
      }
    );
  }

  async GetAppCust() {
    await this.http.post(this.getAppCustUrl, this.appObj).toPromise().then(
      (response) => {
        console.log(response);
        this.AppCustObj = response;
        //this.PhoneDataForm.patchValue({
        //  CustNo: this.AppCustObj.CustNo,
        //  CustName: this.AppCustObj.CustName,
        //});
      }
    );
  }

  async GetQuestionList(VerfQAObj) {
    await this.http.post(this.getQuestionUrl, VerfQAObj).toPromise().then(
      (response) => {
        console.log(response);
        this.QuestionObj = response["ReturnObject"];
        if (this.QuestionObj != null && this.QuestionObj.VerfQuestionAnswerListObj.length != 0) {
          this.verfSchemeHId = this.QuestionObj.VerfSchemeHId
          this.GenerateFormVerfQuestion();

        }
        else {
          this.isQuestionLoaded = false;
          this.toastr.errorMessage("Questions are not loaded, please check RULE or Question Scheme if there're any typos in RULE or question scheme is not available for this BizTemplateCode");
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
          if (QuestionList[j].VerfAnswerTypeCode == "DDL") {
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
          } else if (QuestionList[j].VerfAnswerTypeCode == "UC_INPUT_NUMBER") {
            QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required]);
            this.ListVerfAnswer[i].push("");
          } else {
            QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required])
            this.ListVerfAnswer[i].push("");
          }
          ResultGrp.push(QuestionResultGrp);
        }
      }
    }
  }

  async GetPhoneNumber(phnObj) {
    await this.http.post(this.getPhnNumberUrl, phnObj).toPromise().then(
      (response) => {
        console.log(response);
        this.PhoneNumberObj = response["ReturnObject"];
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
    await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
      (response) => {
        console.log(response);
        this.verifResultObj = response;
        this.verfResHObj.VerfResultId = this.verifResultObj.VerfResultId;
      }
    );
  }

  async GetVerfResultHData() {
    await this.http.post(this.getVerfResulHtUrl, this.verfResHObj).toPromise().then(
      (response) => {
        console.log(response);
        this.verifResultHObj = response;
        this.verfResHObj.MrVerfObjectCode = this.verifResultHObj.MrVerfObjectCode;
      }
    );
  }

  async GetListVerfResulHtData(verfResHObj) {
    await this.http.post(this.getListVerfResulHtUrl, verfResHObj).toPromise().then(
      (response) => {
        console.log(response);
        this.listVerifResultHObj = response["responseVerfResultHCustomObjs"];
      }
    );
  }

  bindResultObj() {
    this.refStatusObj.StatusGrpCode = "VERF_RESULT_STAT";
    this.http.post(this.getRefStatusUrl, this.refStatusObj).subscribe(
      (response) => {
        this.ResultObj = response["ReturnObject"];
        if (this.ResultObj.length > 0) {
          this.PhoneDataForm.patchValue({
            MrVerfResultHStatCode: this.ResultObj[0].Key
          });

        }
      }
    );
  }

  bindSubjectRelationObj() {
    this.refMasterObj.RefMasterTypeCode = "CUST_PERSONAL_RELATIONSHIP";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.SubjectRelationObj = response["ReturnObject"];
        if (this.SubjectRelationObj.length > 0) {
          this.PhoneDataForm.patchValue({
            MrVerfSubjectRelationCode: this.SubjectRelationObj[0].Key
          });
        }
      }
    );
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
      this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject?AppId=" + this.appId + "&WfTaskListId=" + this.wfTaskListId);
    }
    if (this.isReturnHandling == true) {
      this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject?AppId=" + this.appId + "&ReturnHandlingHId=" + this.returnHandlingHId + "&WfTaskListId=" + this.wfTaskListId);
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

  Navigate(){
    var link = environment.losR3Web + "/Nap/View/AppView/AppId=" + this.AppObj.AppId;
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });
  }

  test() {
    this.setPhoneVerifData();
    console.log(this.PhoneDataForm);
    console.log(this.PhoneDataObj);
    //if (this.isReturnHandling == false) {
    //  this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject?AppId=" + this.appId);
    //}
    //if (this.isReturnHandling == true) {
    //  this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject?AppId=" + this.appId + "&ReturnHandlingDId=" + this.returnHandlingDId + "&WfTaskListId=" + this.wfTaskListId);
    //}
  }
}


//async GetQuestionList(VerfQAObj) {
//  await this.http.post(this.getQuestionUrl, VerfQAObj).toPromise().then(
//    (response) => {
//      console.log(response);
//      this.QuestionObj = response["ReturnObject"];
//      this.verfResultDListObjs = new Array<VerfResultDObj>();
//      for (let i = 0; i < this.QuestionObj.VerfQuestionAnswerListObj.length; i++) {
//        for (let j = 0; j < this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList.length; j++) {
//          var verfResultD = new VerfResultDObj();
//          //verfResultD.VerfResultHId = this.verfResultHId;
//          verfResultD.VerfQuestionAnswerId = this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList[j].VerfQuestionAnswerId;
//          verfResultD.VerfQuestionText = this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList[j].VerfQuestionText;
//          verfResultD.Answer = this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList[j].VerfAnswer;
//          verfResultD.Notes = this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList[j].VerfAnswerTypeDescr;
//          verfResultD.VerfQuestionGroupCode = this.QuestionObj.VerfQuestionAnswerListObj[i].VerfQuestionGrpCode;
//          this.verfResultDListObjs.push(verfResultD);
//        }
//      }
//      this.verfSchemeHId = verfResultD.VerfQuestionAnswerId = this.QuestionObj.VerfQuestionAnswerListObj[0].verfQuestionAnswerList[0].VerfSchemeHId;
//      for (let k = 0; k < this.verfResultDListObjs.length; k++) {
//        var listquestions = this.PhoneDataForm.controls["QuestionObjs"] as FormArray;
//        listquestions.push(this.addGroup(this.verfResultDListObjs[k], k));
//      }

//    }
//  );
//}

//addGroup(verfResultDListObjs, k) {
//  return this.fb.group({
//    No: [k],
//    //VerfResultHId: [verfResultDListObjs.VerfResultHId],
//    VerfQuestionAnswerId: [verfResultDListObjs.VerfQuestionAnswerId],
//    VerfQuestionText: [verfResultDListObjs.VerfQuestionText],
//    Answer: [verfResultDListObjs.Answer],
//    Notes: [verfResultDListObjs.Notes],
//    VerfQuestionGroupCode: [verfResultDListObjs.VerfQuestionGroupCode]
//  })

//}
