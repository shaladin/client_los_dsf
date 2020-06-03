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
  verfQuestionAnswerObj: VerfQuestionAnswerCustomObj = new VerfQuestionAnswerCustomObj();
  newVerfResultHObj: VerfResultHObj = new VerfResultHObj();
  VerfResultDForm: FormArray = this.fb.array([]);
  ListVerfAnswer = [];
  VerfResultHList = new Array<VerfResultHObj>();
  AgrmntNo : any;
  TaskListId : any;

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
    var RefStatusObj = {
      StatusGrpCode: "VERF_RESULT_STAT"
    };
    this.http.post(AdInsConstant.GetListActiveRefStatusByStatusGrpCode, RefStatusObj).subscribe(
      (response) => {
        this.RefStatusList = response["ReturnObject"];
      },
      (error) => {
        console.log(error);
      }
    );

    var VerfQAObj = {
      AppId: this.AppId,
      Subject: this.Subject
    };
    this.http.post(AdInsConstant.GetVerfQuestionAnswerListByAppIdAndSubject, VerfQAObj).subscribe(
      (response) => {
        this.verfQuestionAnswerObj = response["ReturnObject"];
        console.log("this is verf question answer");
        console.log(this.verfQuestionAnswerObj);
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
    var agrmntObj = {
      AgrmntId: this.AgrmntId
    };
    this.http.post<AgrmntObj>(AdInsConstant.GetAgrmntByAgrmntId, agrmntObj).subscribe(
      (response) => {
        this.agrmntObj = response;

        var appObj = {
          AppId: this.agrmntObj.AppId
        };
        this.http.post<AppObj>(AdInsConstant.GetAppById, appObj).subscribe(
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

    var VerfResultHObj = {
      VerfResultHId: this.VerfResultHId
    };
    this.http.post<VerfResultHObj>(AdInsConstant.GetVerfResultHById, VerfResultHObj).subscribe(
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
      this.VerfResultDForm.push(QuestionGrp);
      var ResultGrp = this.VerfResultDForm.controls[i].get("VerfQuestionAnswerList") as FormArray;
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
    console.log(ev);

    var FormValue = this.VerfResultDForm.value;
    console.log(FormValue);

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

    var VerfResultHeaderDetail = {
      VerfResultHObj: this.newVerfResultHObj,
      VerfResultDListObj: VerfResultDList
    }

    console.log(VerfResultHeaderDetail);
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