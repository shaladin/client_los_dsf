import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { environment } from '../../../../environments/environment';
import { VerfResultObj } from '../../../shared/model/VerfResult/VerfResult.Model';
import { DatePipe } from '@angular/common';
import { VerfResultHObj } from '../../../shared/model/VerfResultH/VerfResultH.Model';
import { VerfResultDObj } from '../../../shared/model/VerfResultD/VerfResultH.Model';
import { VerifResulHDetailObj } from '../../../shared/model/VerfResultH/VerifResulHDetailObj.model';



@Component({
  selector: "phone-verif-subject-verif",
  templateUrl: "./phone-verif-subject-verif.component.html",
  providers: [NGXToastrService]
})
export class PhnVerifSubjectVerifComponent implements OnInit {

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
    VerfDt: ['', Validators.required],
    MrVerfResultHStatCode: ['', [Validators.required, Validators.maxLength(50)]],
    Phn: ['', [Validators.required, Validators.maxLength(50)]],
    PhnType: ['', [Validators.required, Validators.maxLength(100)]],
    Notes: ['', Validators.maxLength(4000)],
    Score: [''],
    QuestionObjs: this.fb.array([])
  });

  PhoneDataObj: VerifResulHDetailObj;


  getVerfResultUrl: any;
  getAppUrl: any;
  getListVerfResulHtUrl: any;
  getVerfResulHtUrl: any;
  getAppCustUrl: any;
  getRefMasterUrl: any;
  getQuestionUrl: any;
  saveVerfResultHDetailUrl: any;

  viewObj: any;

  appId: any;
  verfResultHId: any;
  subjectName: string;
  subjectType: string;
  idSource: any;
  verfSchemeHId: any;

  appObj = {
    AppId: 0,
  };

  verfResObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: "PHN_VERIF",
  };

  verfResHObj = {
    VerfResultHId: 0,
    VerfResultId: 0,
    MrVerfObjectCode: "",
  };

  refMasterObj = {
    RefMasterTypeCode: "",
  };

  phnObj = {
    IdSource: 0,
    AppId: 0,
    Source: "",
  };

  verfSchemeObj = {
    VerfSchemeCode : "CF4W_PHONEVERIF",
  }

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

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
      this.verfResultHId = params["VerfResultHId"];
      this.subjectName = params["Name"];
      this.subjectType = params["Type"];
      this.idSource = params["Source"];
    });
  }

  initUrl() {
    this.getAppUrl = AdInsConstant.GetAppById;
    this.getVerfResultUrl = AdInsConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode;
    this.getListVerfResulHtUrl = AdInsConstant.GetVerfResultHsByVerfResultIdAndObjectCode;
    this.getVerfResulHtUrl = AdInsConstant.GetVerfResultHById;
    this.getAppCustUrl = AdInsConstant.GetAppCustByAppId;
    this.getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getQuestionUrl = AdInsConstant.GetVerfQuestionAnswerListByVerfSchemeCode;
    this.saveVerfResultHDetailUrl = AdInsConstant.AddVerfResultHeaderAndVerfResultDetail;
  }

  async ngOnInit(): Promise<void> {
    //this.PhoneDataForm.patchValue({
    //  Subject: this.subjectType,
    //  SubjectName: this.subjectName
    //});
    this.initUrl();
    this.setPhnObj();
    this.appObj.AppId = this.appId;
    this.GetQuestionList(this.verfSchemeObj);
    this.verfResHObj.VerfResultHId = this.verfResultHId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppData(this.appObj);
    await this.GetAppCust(this.appObj);
    await this.GetVerfResultData(this.verfResObj);

    if (this.verfResultHId != 0) {
      await this.GetVerfResultHData(this.verfResHObj);
      await this.GetListVerfResulHtData(this.verfResHObj);
    };


  }

  SaveForm() {
    this.setPhoneVerifData();
    this.http.post(this.saveVerfResultHDetailUrl, this.PhoneDataObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setPhoneVerifData() {
    var Business_Date = localStorage.getItem('BusinessDate');
    var datePipe = new DatePipe("en-US");
    var value = datePipe.transform(Business_Date, "yyyy-MM-dd");
    var businessDt = new Date(value);

    this.PhoneDataObj = new VerifResulHDetailObj();
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
      var question = new VerfResultDObj();
      question.VerfQuestionAnswerId = this.PhoneDataForm.controls["QuestionObjs"].value[i].VerfQuestionAnswerId;
      question.VerfQuestionText = this.PhoneDataForm.controls["ReservedFundObjs"].value[i].VerfQuestionText;
      question.Answer = this.PhoneDataForm.controls["ReservedFundObjs"].value[i].Answer;
      question.Notes = this.PhoneDataForm.controls["ReservedFundObjs"].value[i].Notes;
      question.VerfQuestionGroupCode = this.PhoneDataForm.controls["ReservedFundObjs"].value[i].VerfQuestionGroupCode;
      this.PhoneDataObj.VerfResultDListObj.push(question);
    }
  }

  setPhnObj() {
    this.phnObj.AppId = this.appId;
    this.phnObj.IdSource = this.idSource;
    this.phnObj.Source = this.subjectType;
  }

  async GetAppData(appObj) {
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

  async GetAppCust(appObj) {
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

  async GetQuestionList(appObj) {
    await this.http.post(this.getQuestionUrl, this.appObj).toPromise().then(
      (response) => {
        console.log(response);
        this.QuestionObj = response["ReturnObject"];
        this.verfResultDListObjs = new Array<VerfResultDObj>();
        for (let i = 0; i < this.QuestionObj.VerfQuestionAnswerListObj.length; i++) {
          for (let j = 0; j < this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList.length; j++) {
            var verfResultD = new VerfResultDObj();
            //verfResultD.VerfResultHId = this.verfResultHId;
            verfResultD.VerfQuestionAnswerId = this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList[j].VerfQuestionAnswerId;
            verfResultD.VerfQuestionText = this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList[j].VerfQuestionText;
            verfResultD.Answer = this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList[j].VerfAnswer;
            verfResultD.Notes = this.QuestionObj.VerfQuestionAnswerListObj[i].verfQuestionAnswerList[j].VerfAnswerTypeDescr;
            verfResultD.VerfQuestionGroupCode = this.QuestionObj.VerfQuestionAnswerListObj[i].VerfQuestionGrpCode;
            this.verfResultDListObjs.push(verfResultD);
          }
        }
        this.verfSchemeHId = verfResultD.VerfQuestionAnswerId = this.QuestionObj.VerfQuestionAnswerListObj[0].verfQuestionAnswerList[0].VerfSchemeHId;
        for (let k = 0; k < this.verfResultDListObjs.length; k++) {
          var listquestions = this.PhoneDataForm.controls["QuestionObjs"] as FormArray;
          listquestions.push(this.addGroup(this.verfResultDListObjs[k], k));
        }

      }
    );
  }

  addGroup(verfResultDListObjs, k) {
    return this.fb.group({
      No: [k],
      //VerfResultHId: [verfResultDListObjs.VerfResultHId],
      VerfQuestionAnswerId: [verfResultDListObjs.VerfQuestionAnswerId],
      VerfQuestionText: [verfResultDListObjs.VerfQuestionText],
      Answer: [verfResultDListObjs.Answer],
      Notes: [verfResultDListObjs.Notes],
      VerfQuestionGroupCode: [verfResultDListObjs.VerfQuestionGroupCode]
    })

  }

  async GetPhoneNumber(verfSchemeObj) {
    await this.http.post(this.getVerfResulHtUrl, this.verfSchemeObj).toPromise().then(
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

  async GetVerfResultData(verfResObj) {
    await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
      (response) => {
        console.log(response);
        this.verifResultObj = response;
        this.verfResHObj.VerfResultId = this.verifResultObj.VerfResultId;
      }
    );
  }

  async GetVerfResultHData(verfResHObj) {
    await this.http.post(this.getVerfResulHtUrl, this.verfResHObj).toPromise().then(
      (response) => {
        console.log(response);
        this.verifResultHObj = response;
        this.verfResHObj.MrVerfObjectCode = this.verifResultHObj.MrVerfObjectCode;
      }
    );
  }

  async GetListVerfResulHtData(verfResHObj) {
    await this.http.post(this.getListVerfResulHtUrl, this.verfResObj).toPromise().then(
      (response) => {
        console.log(response);
        this.listVerifResultHObj = response;
      }
    );
  }

  bindResultObj() {
    this.refMasterObj.RefMasterTypeCode = "CUSTCONF_RESULT";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
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

  PhoneChange(phnNumber, phnType) {
    this.PhoneDataForm.patchValue({
      Phn: phnNumber,
      PhnType: phnType
    });
  }
}
