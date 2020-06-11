import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { VerfQuestionAnswerCustomObj } from 'app/shared/model/VerfQuestionAnswer/VerfQuestionAnswerCustom.Model';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';
import { VerfResultDObj } from 'app/shared/model/VerfResultD/VerfResultH.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';

@Component({
  selector: 'app-cust-confirmation-subj-detail',
  templateUrl: './cust-confirmation-subj-detail.component.html',
  styleUrls: ['./cust-confirmation-subj-detail.component.scss']
})
export class CustConfirmationSubjDetailComponent implements OnInit {

  VerfResultHId: number;
  AgrmntId: number;
  AppId: number;
  Subject: string;
  agrmntObj: AgrmntObj = new AgrmntObj();
  appObj: AppObj = new AppObj();
  RefStatusList: Array<KeyValueObj> = new Array<KeyValueObj>();
  PhnList: any;
  verfQuestionAnswerObj: VerfQuestionAnswerCustomObj = new VerfQuestionAnswerCustomObj();
  newVerfResultHObj: VerfResultHObj = new VerfResultHObj();
  CustConfirm = this.fb.group({
    Notes: ["", Validators.required],
    Phn: ["", Validators.required],
    MrVerfResultHStatCode: ["", Validators.required],
    VerfResultDForm: this.fb.array([])
  })
  ListVerfAnswer = [];
  VerfResultHList = new Array<VerfResultHObj>();
  AgrmntNo : any;
  TaskListId : any;
  SubjectResponse: RefMasterObj = new RefMasterObj();

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private http: HttpClient,
    private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["VerfResultHId"] != null) {
        this.VerfResultHId = params["VerfResultHId"];
      }
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["Subject"] != null) {
        this.Subject = params["Subject"];
      }
      if (params["AgrmntNo"] != null) {
        this.AgrmntNo = params["AgrmntNo"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
    });
  }

  ngOnInit() {
    this.GetData();

    this.http.post<RefMasterObj>(AdInsConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, {MasterCode: this.Subject, RefMasterTypeCode: "VERF_SUBJ_RELATION" }).subscribe(
      (response) => {
        this.SubjectResponse = response;
      },
      (error) => {
        console.log(error);
      }
    );

    this.http.post(AdInsConstant.GetListActiveRefStatusByStatusGrpCode, {StatusGrpCode: "VERF_RESULT_STAT"}).subscribe(
      (response) => {
        this.RefStatusList = response["ReturnObject"];
        this.CustConfirm.patchValue({
          MrVerfResultHStatCode: this.RefStatusList[0].Key
        })
      },
      (error) => {
        console.log(error);
      }
    );

    this.http.post(AdInsConstant.GetListKeyValueMobilePhnByAppId, {AppId: this.AppId}).subscribe(
      (response) => {
        this.PhnList = response;
        this.CustConfirm.patchValue({
          Phn: this.PhnList[0].Key
        })
      },
      (error) => {
        console.log(error);
      }
    );

    this.http.post(AdInsConstant.GetVerfQuestionAnswerListByAppIdAndSubject, {AppId: this.AppId, Subject: this.Subject}).subscribe(
      (response) => {
        this.verfQuestionAnswerObj = response["ReturnObject"];
        if (this.verfQuestionAnswerObj != null && this.verfQuestionAnswerObj.VerfQuestionAnswerListObj.length != 0) {
          this.GenerateFormVerfQuestion(this.verfQuestionAnswerObj);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetData() {

    this.http.post<AgrmntObj>(AdInsConstant.GetAgrmntByAgrmntId, {AgrmntId: this.AgrmntId}).subscribe(
      (response) => {
        this.agrmntObj = response;
        this.http.post<AppObj>(AdInsConstant.GetAppById, {AppId: this.agrmntObj.AppId}).subscribe(
          (response) => {
            this.appObj = response;
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );

    this.http.post<VerfResultHObj>(AdInsConstant.GetVerfResultHById, { VerfResultHId: this.VerfResultHId}).subscribe(
      (response) => {
        this.newVerfResultHObj.VerfResultId = response.VerfResultId;
        this.newVerfResultHObj.VerfSchemeHId = response.VerfSchemeHId;
        this.newVerfResultHObj.MrVerfSubjectRelationCode = response.MrVerfSubjectRelationCode;
        this.newVerfResultHObj.Phn = "-";
        this.newVerfResultHObj.PhnType = "-";
        this.newVerfResultHObj.MrVerfObjectCode = "-";

        var verfResultHObj = {
          VerfResultId: this.newVerfResultHObj.VerfResultId,
          MrVerfSubjectRelationCode: this.newVerfResultHObj.MrVerfSubjectRelationCode
        };
        this.http.post(AdInsConstant.GetVerfResultHsByVerfResultIdAndSubjRelationCode, verfResultHObj).subscribe(
          (response) => {
            this.VerfResultHList = response["responseVerfResultHCustomObjs"];
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GenerateFormVerfQuestion(obj) {
    this.verfQuestionAnswerObj.VerfQuestionAnswerListObj[0].VerfQuestionGrpName
    var grpListObj = this.verfQuestionAnswerObj.VerfQuestionAnswerListObj;


    for (let i = 0; i < grpListObj.length; i++) {
        var QuestionGrp = this.fb.group({
        VerfQuestionGrpCode: grpListObj[i].VerfQuestionGrpCode,
        VerfQuestionGrpName: grpListObj[i].VerfQuestionGrpName,
        VerfQuestionAnswerList: this.fb.array([])
      }) as FormGroup;
      
      var formArray = this.CustConfirm.get('VerfResultDForm') as FormArray;
      formArray.push(QuestionGrp);
      var ResultGrp = this.CustConfirm.controls.VerfResultDForm['controls'][i].get("VerfQuestionAnswerList") as FormArray;
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
              Answer: ["", Validators.required],
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
          } else if (QuestionList[j].VerfAnswerTypeCode == "UC_INPUT_NUMBER") {
            QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
            this.ListVerfAnswer[i].push("");
          } else {
            this.ListVerfAnswer[i].push("");
          }
         ResultGrp.push(QuestionResultGrp);
        }
      }
    }
  }

  
  SaveForm(ev) {
    var FormValue = this.CustConfirm.value.VerfResultDForm;
    var VerfResultDList = new Array<VerfResultDObj>();
    for (let i = 0; i < FormValue.length; i++) {
      var currGrp = FormValue[i].VerfQuestionAnswerList;
      for (let j = 0; j < currGrp.length; j++) {
        var currAnswer = currGrp[j].ResultGrp;
        var VerfResultD = new VerfResultDObj();
        VerfResultD.VerfQuestionAnswerId = currAnswer.VerfQuestionAnswerId;
        VerfResultD.VerfQuestionText = currAnswer.VerfQuestionText;
        VerfResultD.Answer = currAnswer.Answer;
        VerfResultD.Notes = currAnswer.Notes;
        VerfResultD.SeqNo = currAnswer.SeqNo;
        VerfResultD.Score = currAnswer.Score;
        VerfResultD.VerfQuestionGroupCode = currAnswer.VerfQuestionGroupCode;

        VerfResultDList.push(VerfResultD);
      }
    }

    this.newVerfResultHObj.MrVerfObjectCode = "-";
    this.newVerfResultHObj.PhnType = "-";
    this.newVerfResultHObj.MrVerfSubjectRelationCode = this.Subject;
    this.newVerfResultHObj.Phn = this.CustConfirm.controls.Phn.value;
    this.newVerfResultHObj.MrVerfResultHStatCode = this.CustConfirm.controls.MrVerfResultHStatCode.value;
    this.newVerfResultHObj.Notes = this.CustConfirm.controls.Notes.value;
    var VerfResultHeaderDetail = {
      VerfResultHObj: this.newVerfResultHObj,
      VerfResultDListObj: VerfResultDList
    }

    this.http.post(AdInsConstant.AddVerfResultHeaderAndVerfResultDetail, VerfResultHeaderDetail).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Nap/AdminProcess/CustConfirmation/Detail"], { queryParams: { "AgrmntId": this.AgrmntId, "AgrmntNo": this.AgrmntNo , "TaskListId" : this.TaskListId,  "AppId" : this.AppId} });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}