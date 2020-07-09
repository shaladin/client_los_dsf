import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { VerfQuestionAnswerCustomObj } from 'app/shared/model/VerfQuestionAnswer/VerfQuestionAnswerCustom.Model';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';

@Component({
  selector: 'app-verf-question[ParentForm][VerfSchemeCode]',
  templateUrl: './verf-question.component.html',
  styleUrls: ['./verf-question.component.scss']
})
export class VerfQuestionComponent implements OnInit {

  @Input() ParentForm: FormGroup;
  @Input() VerfSchemeCode: string;
  @Input() VerfResultHId: number;
  ListVerfAnswer = [];
  VerfResultHList = new Array<VerfResultHObj>();

  VerfQuestionAnswerCustomObj: VerfQuestionAnswerCustomObj;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.InitFormVerfQuestion();
    if(this.VerfResultHId !=0){
      this.GetHistoryList();
    }
  }


  InitFormVerfQuestion() {
    this.http.post(AdInsConstant.GetVerfQuestionAnswerListBySchemeCode, { VerfSchemeCode: this.VerfSchemeCode }).subscribe(
      (response) => {
        this.VerfQuestionAnswerCustomObj = response["ReturnObject"];
        if (this.VerfQuestionAnswerCustomObj != null && this.VerfQuestionAnswerCustomObj.VerfQuestionAnswerListObj.length != 0) {
          this.GenerateFormVerfQuestion();
        }
      }
    )

  }

  GenerateFormVerfQuestion() {
    var grpListObj = this.VerfQuestionAnswerCustomObj.VerfQuestionAnswerListObj;

    for (let i = 0; i < grpListObj.length; i++) {
      var QuestionGrp = this.fb.group({
        VerfQuestionGrpCode: grpListObj[i].VerfQuestionGrpCode,
        VerfQuestionGrpName: grpListObj[i].VerfQuestionGrpName,
        VerfQuestionAnswerList: this.fb.array([])
      }) as FormGroup;
      var VerfResultDForm =  this.ParentForm.get("VerfResultDForm") as FormArray; 
      VerfResultDForm.push(QuestionGrp);
      var ResultGrp = VerfResultDForm.controls[i].get("VerfQuestionAnswerList") as FormArray;
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
          if (QuestionList[j].VerfAnswerTypeCode == AdInsConstant.VerfAnswerTypeCodeDdl) {
            if (QuestionList[j].VerfAnswer != "") {
              var ddlList = QuestionList[j].VerfAnswer.split(";");
              this.ListVerfAnswer[i].push(ddlList);
              QuestionResultGrp.controls.ResultGrp.patchValue({
                Answer: this.ListVerfAnswer[i][j][0]
              })
            } else {
              this.ListVerfAnswer[i].push("");
            }
          } else if (QuestionList[j].VerfAnswerTypeCode == AdInsConstant.VerfAnswerTypeCodeUcInputNumber) {
            QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
            this.ListVerfAnswer[i].push("");
          } else {
            this.ListVerfAnswer[i].push("");
          }
          ResultGrp.push(QuestionResultGrp);
        }
      }
    }
    console.log(this.ParentForm.get("VerfResultDForm"));
  }

  GetHistoryList(){
    var VerfResultHObj = {
      VerfResultHId: this.VerfResultHId
    };
    this.http.post<VerfResultHObj>(AdInsConstant.GetVerfResultHById, VerfResultHObj).subscribe(
      (response) => {
        var verfResultHObj = {
          VerfResultId: response.VerfResultId,
          MrVerfSubjectRelationCode: response.MrVerfSubjectRelationCode
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

  CheckValue() {
    console.log(this.ParentForm)
  }

}
