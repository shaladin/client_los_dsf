import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { VerfQuestionAnswerCustomObj } from 'app/shared/model/VerfQuestionAnswer/VerfQuestionAnswerCustom.Model';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';
import { VerfResultDObj } from 'app/shared/model/VerfResultD/VerfResultH.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-cust-confirmation-subj-detail',
  templateUrl: './cust-confirmation-subj-detail.component.html'
})
export class CustConfirmationSubjDetailComponent implements OnInit {

  VerfResultHId: number;
  AgrmntId: number;
  AppId: number;
  Subject: string;
  agrmntObj: AgrmntObj = new AgrmntObj();
  leadObj: LeadObj = new LeadObj();
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
  AgrmntNo: string;
  TaskListId: number;
  BizTemplateCode: string;
  SubjectResponse: RefMasterObj = new RefMasterObj();
  cust: any;
  isFailed: boolean = false;
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
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  ngOnInit() {

    this.GetData();

    this.http.post<RefMasterObj>(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, { MasterCode: this.Subject, RefMasterTypeCode: CommonConstant.RefMasterTypeCodeVerfSubjRelation }).subscribe(
      (response) => {
        this.SubjectResponse = response;
      });

    this.http.post(URLConstant.GetListActiveRefStatusByStatusGrpCode, { StatusGrpCode: CommonConstant.StatusGrpVerfResultStat }).subscribe(
      (response) => {
        this.RefStatusList = response[CommonConstant.ReturnObj];
        this.CustConfirm.patchValue({
          MrVerfResultHStatCode: this.RefStatusList[0].Key
        })
      });

    this.http.post(URLConstant.GetListKeyValueMobilePhnByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.PhnList = response;
        this.CustConfirm.patchValue({
          Phn: this.PhnList[0].Key
        })
      });

    this.http.post(URLConstant.GetVerfQuestionAnswerListByAppIdAndSubject, { AppId: this.AppId, Subject: this.Subject }).subscribe(
      (response) => {
        this.verfQuestionAnswerObj = response[CommonConstant.ReturnObj];
        if (this.verfQuestionAnswerObj != null && this.verfQuestionAnswerObj.VerfQuestionAnswerListObj.length != 0) {
          this.GenerateFormVerfQuestion(CommonConstant.VerfResultStatSuccess);
        }
      });
  }

  GetData() {
    this.http.post<AgrmntObj>(URLConstant.GetAgrmntByAgrmntId, { AgrmntId: this.AgrmntId }).subscribe(
      (response) => {
        this.agrmntObj = response;
        this.http.post<AppObj>(URLConstant.GetAppById, { AppId: this.agrmntObj.AppId }).subscribe(
          (response) => {
            this.appObj = response;
          });

        if (this.agrmntObj.LeadId != null) {
          this.http.post<LeadObj>(URLConstant.GetLeadByLeadId, { LeadId: this.agrmntObj.LeadId }).subscribe(
            (response) => {
              this.leadObj = response;
            });
        }
      });

    this.http.post<VerfResultHObj>(URLConstant.GetVerfResultHById, { VerfResultHId: this.VerfResultHId }).subscribe(
      (response) => {
        this.newVerfResultHObj.VerfResultId = response.VerfResultId;
        this.newVerfResultHObj.VerfSchemeHId = response.VerfSchemeHId;
        this.newVerfResultHObj.MrVerfSubjectRelationCode = response.MrVerfSubjectRelationCode;
        this.newVerfResultHObj.Phn = "-";
        this.newVerfResultHObj.PhnType = "-";
        this.newVerfResultHObj.MrVerfObjectCode = "-";
        this.GetListVerfResultH(this.newVerfResultHObj.VerfResultId, this.newVerfResultHObj.MrVerfSubjectRelationCode);
      });
  }

  GetListVerfResultH(id, code) {
    var verfResultHObj = {
      VerfResultId: id,
      MrVerfSubjectRelationCode: code
    };
    this.http.post(URLConstant.GetVerfResultHsByVerfResultIdAndSubjRelationCode, verfResultHObj).subscribe(
      (response) => {
        this.VerfResultHList = response["responseVerfResultHCustomObjs"];
      });
  }
  GenerateFormVerfQuestion(result) {
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
              Answer: ["", result == CommonConstant.VerfResultStatSuccess ? Validators.required : []],
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
          } else if (QuestionList[j].VerfAnswerTypeCode == CommonConstant.VerfAnswerTypeCodeUcInputNumber) {
            if(result == CommonConstant.VerfResultStatSuccess){
              QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required, Validators.min(1.00)]);
            }
            this.ListVerfAnswer[i].push("");
          } else {
            this.ListVerfAnswer[i].push("");
          }
          ResultGrp.push(QuestionResultGrp);
        }
      }
    }
  }

  SaveForm(formDirective: FormGroupDirective) {
    var activeButton = document.activeElement.id;
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
    var businessDt = new Date(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));
    var todaydate = new Date();
    businessDt.setHours(todaydate.getHours(), todaydate.getMinutes(), todaydate.getSeconds());
    var usertimezone = businessDt.getTimezoneOffset() * 60000;
    businessDt = new Date(businessDt.getTime() - usertimezone);

    this.newVerfResultHObj.MrVerfObjectCode = "-";
    this.newVerfResultHObj.PhnType = "-";
    this.newVerfResultHObj.MrVerfSubjectRelationCode = this.Subject;
    this.newVerfResultHObj.Phn = this.CustConfirm.controls.Phn.value;
    this.newVerfResultHObj.MrVerfResultHStatCode = this.CustConfirm.controls.MrVerfResultHStatCode.value;
    this.newVerfResultHObj.Notes = this.CustConfirm.controls.Notes.value;
    this.newVerfResultHObj.VerfDt = businessDt;

    var VerfResultHeaderDetail = {
      VerfResultHObj: this.newVerfResultHObj,
      VerfResultDListObj: VerfResultDList
    }

    this.http.post(URLConstant.AddVerfResultHeaderAndVerfResultDetail, VerfResultHeaderDetail).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        if (activeButton == "save") {
          this.router.navigate(["/Nap/AdminProcess/CustConfirmation/Detail"], { queryParams: { "AgrmntId": this.AgrmntId, "AgrmntNo": this.AgrmntNo, "TaskListId": this.TaskListId, "AppId": this.AppId, "BizTemplateCode": this.BizTemplateCode } });
        }
        else {
          this.GetListVerfResultH(response["VerfResultId"], response["MrVerfSubjectRelationCode"]);
          formDirective.resetForm();
          this.clearform(CommonConstant.VerfResultStatSuccess, false);
        }
      });
  }

  ResultHandler(){
    var value = this.CustConfirm.controls["MrVerfResultHStatCode"].value;
    if(value != CommonConstant.VerfResultStatSuccess){
      this.isFailed = true;
    }
    this.clearform(value, false);
  }
  
  clearform(resultStat, isInit) {
    this.CustConfirm.reset();
    this.CustConfirm = this.fb.group({
      Notes: ["", Validators.required],
      Phn: ["", Validators.required],
      MrVerfResultHStatCode: ["", Validators.required],
      VerfResultDForm: this.fb.array([])
    });
    this.CustConfirm.controls.Notes.markAsPristine();
    this.CustConfirm.markAsUntouched();


    this.GenerateFormVerfQuestion(resultStat);
    if (this.PhnList.length > 0) {
      this.CustConfirm.patchValue({
        Phn: this.PhnList[0].Key
      });
    }

    if(isInit){
      if (this.RefStatusList.length > 0) {
        this.CustConfirm.patchValue({
          MrVerfResultHStatCode: this.RefStatusList[0].Key
        });
      }
    }
    else{
      this.CustConfirm.patchValue({
        MrVerfResultHStatCode: resultStat
      });
    }
    
  }

  OpenView(key: string){
    if(key == "app"){
      AdInsHelper.OpenAppViewByAppId(this.AppId);
    }else if(key == "agrmnt"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
    }else if(key == "lead"){
      AdInsHelper.OpenLeadViewByLeadId(this.leadObj.LeadId);
    }
    else if(key == "cust"){
      var custObj = { CustNo: this.agrmntObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }
}
