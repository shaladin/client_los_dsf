import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/app/app.model';
import { AgrmntObj } from 'app/shared/model/agrmnt/agrmnt.model';
import { VerfQuestionAnswerCustomObj } from 'app/shared/model/verf-question-answer/verf-question-answer-custom.model';
import { VerfResultHObj } from 'app/shared/model/verf-result-h/verf-result-h.model';
import { VerfResultDObj } from 'app/shared/model/verf-result-d/verf-result-d.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { LeadObj } from 'app/shared/model/lead.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { ResListCustMainDataObj } from 'app/shared/model/response/nap/cust-main-data/res-list-cust-main-data-obj.model';
import { ReqVerfQuestionAnswerObj } from 'app/shared/model/request/verification/req-verf-question-answer-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReqGetVerfResult3Obj } from 'app/shared/model/verf-result/req-get-verf-result-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

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
  CustNoObj: GenericObj = new GenericObj();
  PhnList: Array<KeyValueObj> = new Array<KeyValueObj>();
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
  SubjectResponse: KeyValueObj = new KeyValueObj();
  isFailed: boolean = false;

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_DETAIL;
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder, private http: HttpClient,
    private router: Router, private toastr: NGXToastrService,
    private cookieService: CookieService,
    private adInsHelperService: AdInsHelperService) {
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

  async ngOnInit() {
    await this.GetData();

    let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeVerfSubjRelation,
      MasterCode: this.Subject
    };
    await this.http.post<KeyValueObj>(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
      (response) => {
        this.SubjectResponse = response;
      }
    );

    await this.http.post(URLConstant.GetListActiveRefStatusByStatusGrpCode, { Code: CommonConstant.StatusGrpVerfResultStat }).toPromise().then(
      (response) => {
        this.RefStatusList = response[CommonConstant.ReturnObj];
        this.CustConfirm.patchValue({
          MrVerfResultHStatCode: this.RefStatusList[0].Key
        })
      }
    );

    await this.http.post<Array<KeyValueObj>>(URLConstant.GetListKeyValueMobilePhnByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.PhnList = response[CommonConstant.ReturnObj];
        this.CustConfirm.patchValue({
          Phn: this.PhnList[0].Key
        })
      }
    );

    let GetVerfQuestionAnswerObj = new ReqVerfQuestionAnswerObj();
    GetVerfQuestionAnswerObj.AppId = this.AppId;
    GetVerfQuestionAnswerObj.Subject = this.Subject;
    await this.http.post(URLConstant.GetVerfQuestionAnswerListByAppIdAndSubject, GetVerfQuestionAnswerObj).toPromise().then(
      (response) => {
        this.verfQuestionAnswerObj = response[CommonConstant.ReturnObj];
        if (this.verfQuestionAnswerObj != null && this.verfQuestionAnswerObj.VerfQuestionAnswerListObj.length != 0) {
          this.GenerateFormVerfQuestion(this.CustConfirm.get("MrVerfResultHStatCode").value);
        }
      }
    );
  }

  async GetData() {
    this.http.post<AgrmntObj>(URLConstant.GetAgrmntByAgrmntId, { Id: this.AgrmntId }).subscribe(
      async (response) => {
        this.agrmntObj = response;
        await this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.agrmntObj.AppId }).toPromise().then(
          (response) => {
            this.appObj = response;
          }
        );

        if (this.agrmntObj.LeadId != null) {
          await this.http.post<LeadObj>(URLConstant.GetLeadByLeadId, { Id: this.agrmntObj.LeadId }).toPromise().then(
            (response) => {
              this.leadObj = response;
            }
          );
        }
      }
    );

    await this.http.post<VerfResultHObj>(URLConstant.GetVerfResultHById, { Id: this.VerfResultHId }).toPromise().then(
      async (response) => {
        this.newVerfResultHObj.VerfResultId = response.VerfResultId;
        this.newVerfResultHObj.VerfSchemeHId = response.VerfSchemeHId;
        this.newVerfResultHObj.MrVerfSubjectRelationCode = response.MrVerfSubjectRelationCode;
        this.newVerfResultHObj.Phn = "-";
        this.newVerfResultHObj.PhnType = "-";
        this.newVerfResultHObj.MrVerfObjectCode = "-";
        await this.GetListVerfResultH(this.newVerfResultHObj.VerfResultId, this.newVerfResultHObj.MrVerfSubjectRelationCode);
      }
    );

    await this.GetListCustData();
  }

  CustNo: string = "";
  CustName: string = "";
  AppCustId: number = 0;
  async GetListCustData() {
    await this.http.post(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.AppId }).toPromise().then(
      (response: ResListCustMainDataObj) => {
        if (response.ListAppCustObj.length > 0) {
          for (let index = 0; index < response.ListAppCustObj.length; index++) {
            const element = response.ListAppCustObj[index];
            if (this.Subject == CommonConstant.RoleCustData) {
              if (element.IsCustomer) {
                this.AppCustId = element.AppCustId;
                this.CustNo = element.CustNo;
                this.CustName = element.CustName;
                break;
              }
            } else if (this.Subject == CommonConstant.RoleFamilyData) {
              if (element.IsFamily && element.MrCustRelationshipCode == CommonConstant.MasteCodeRelationshipSpouse) {
                this.AppCustId = element.AppCustId;
                this.CustNo = element.CustNo;
                this.CustName = element.CustName;
                break;
              }
            }
          }
        }
      }
    );
  }

  async GetListVerfResultH(id, code) {
    var verfResultHObj: ReqGetVerfResult3Obj = {
      VerfResultId: id,
      MrVerfSubjectRelationCode: code
    };
    await this.http.post(URLConstant.GetVerfResultHsByVerfResultIdAndSubjRelationCode, verfResultHObj).toPromise().then(
      (response) => {
        this.VerfResultHList = response["responseVerfResultHCustomObjs"];
      }
    );
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
            }
            else {
              this.ListVerfAnswer[i].push("");
            }
          }
          else if (QuestionList[j].VerfAnswerTypeCode == CommonConstant.VerfAnswerTypeCodeUcInputNumber) {
            if (result == CommonConstant.VerfResultStatSuccess) {
              QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required, Validators.min(1.00)]);
            }
            this.ListVerfAnswer[i].push("");
          }
          else {
            this.ListVerfAnswer[i].push("");
          }
          ResultGrp.push(QuestionResultGrp);
        }
      }
    }
  }

  AddDetail(formDirective: FormGroupDirective) {
    var FormValue = this.CustConfirm.value.VerfResultDForm;
    var VerfResultDList = new Array<VerfResultDObj>();

    if(this.CustConfirm.controls.MrVerfResultHStatCode.value == CommonConstant.VerfResultStatSuccess) {
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
    }
    else {
      VerfResultDList = null;
    }
    
    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
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
          this.GetListVerfResultH(this.newVerfResultHObj.VerfResultId, this.newVerfResultHObj.MrVerfSubjectRelationCode);
          formDirective.resetForm();
          this.clearform(this.newVerfResultHObj.MrVerfResultHStatCode, false);
      }
    );
  }

  Save() {
    if(this.VerfResultHList.length < 1){
      this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_HISTORY);
    }else{
      AdInsHelper.RedirectUrl(this.router,[this.CancelLink], { "AgrmntId": this.AgrmntId, "AgrmntNo": this.AgrmntNo, "TaskListId": this.TaskListId, "AppId": this.AppId, "BizTemplateCode": this.BizTemplateCode });
    }
  }

  ResultHandler() {
    var value = this.CustConfirm.controls["MrVerfResultHStatCode"].value;
    if (value != CommonConstant.VerfResultStatSuccess) {
      this.isFailed = true;
    }
    this.clearform(value, false);
  }

  clearform(resultStat, isInit) {
    this.CustConfirm.reset();
    this.CustConfirm = this.fb.group({
      Notes: ["", Validators.required],
      Phn: ["", Validators.required],
      MrVerfResultHStatCode: [resultStat, Validators.required],
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

    if (isInit) {
      if (this.RefStatusList.length > 0) {
        this.CustConfirm.patchValue({
          MrVerfResultHStatCode: this.RefStatusList[0].Key
        });
      }
    }
    else {
      this.CustConfirm.patchValue({
        MrVerfResultHStatCode: resultStat
      });
    }
  }

  OpenView(key: string) {
    if (key == "app") {
      AdInsHelper.OpenAppViewByAppId(this.AppId);
    }
    else if (key == "agrmnt") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
    }
    else if (key == "lead") {
      AdInsHelper.OpenLeadViewByLeadId(this.leadObj.LeadId);
    }
    else if (key == "cust") {
      this.CustNoObj.CustNo = this.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }
}