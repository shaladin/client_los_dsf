import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ResRoTelemkOfferSubjectObj } from 'app/shared/model/Lead/ResRoTelemkOfferSubjectObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { VerifResulHDetailObj } from 'app/shared/model/VerfResultH/VerifResulHDetailObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { VerfResultDObj } from 'app/shared/model/VerfResultD/VerfResultD.Model';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';
import { CookieService } from 'ngx-cookie';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-ro-telemk-offer-verif',
  templateUrl: './ro-telemk-offer-verif.component.html'
})
export class RoTelemkOfferVerifComponent implements OnInit {

  ViewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  TelemkOfferSubj: ResRoTelemkOfferSubjectObj;
  RmVerfResultStat: Array<KeyValueObj>;
  QuestionObj: object;
  ListVerfAnswer: Array<Array<string>> = [];
  ListVerifResultHObj: Array<VerfResultHObj> = [];
  PhoneDataForm = this.fb.group({
    RoPotentialNo: [''],
    CustNo: [''],
    CustName: [''],
    MrVerfResultHStatCode: ['', [Validators.required, Validators.maxLength(50)]],
    Phn: ['', [Validators.required, Validators.maxLength(50)]],
    PhnType: ['', [Validators.required, Validators.maxLength(100)]],
    Notes: ['', [Validators.required, Validators.maxLength(4000)]],
    Score: [''],
    QuestionObjs: new FormArray([])
  });

  roPotentialNo: string;
  verfSchemeHId: number;
  reqVerfResultObj: VerifResulHDetailObj;
  verfResultData: object;
  isQuestionLoaded: boolean = false;
  UserAccess: Object;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      this.roPotentialNo = params['RoPotentialNo'];
    });
  }
  BusinessDt: Date;
  async ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.BusinessDt = this.UserAccess[CommonConstant.BUSINESS_DT];
    await this.getTelemkOfferSubj();
    await this.bindVerfResultStat();
    await this.getQuestionList();
    await this.getVerfResultData();
    await this.getListVerfResulHtData();
  }

  async getTelemkOfferSubj() {
    await this.http.post(URLConstant.GetTelemkOfferingSubjectByRoPotentialNo, { TrxNo: this.roPotentialNo }).toPromise().then(
      (response: ResRoTelemkOfferSubjectObj) => {
        this.TelemkOfferSubj = response;
        if (this.TelemkOfferSubj.ListPhoneNo.length > 0) {
          this.PhoneDataForm.patchValue({
            Phn: this.TelemkOfferSubj.ListPhoneNo[0].PhoneNumber,
            PhnType: this.TelemkOfferSubj.ListPhoneNo[0].PhoneType
          });
        }
      })
  }

  async bindVerfResultStat() {
    await this.http.post(URLConstant.GetListActiveRefStatusByStatusGrpCode, { Code: CommonConstant.StatusGrpVerfResultStat }).toPromise().then(
      (response) => {
        this.RmVerfResultStat = response[CommonConstant.ReturnObj];
        if (this.RmVerfResultStat.length > 0) {
          this.PhoneDataForm.patchValue({ MrVerfResultHStatCode: this.RmVerfResultStat[0].Key });
        }
      }
    );
  }

  async getQuestionList() {
    await this.http.post(URLConstant.GetVerfQuestionAnswerListByVerfSchemeCode, { Code: CommonConstant.VerfSchemeCodeRoTelemkOffering }).toPromise().then(
      (response) => {
        this.QuestionObj = response[CommonConstant.ReturnObj];
        if (this.QuestionObj != null && this.QuestionObj['VerfQuestionAnswerListObj'].length != 0) {
          this.generateFormVerfQuestion();
          this.isQuestionLoaded = true;
        }
        else {
          this.toastr.warningMessage("Questions are not loaded, please check RULE or Question Scheme if there're any typos in RULE or question scheme is not available for this BizTemplateCode");
        }
      }
    );
  }

  async getVerfResultData() {
    let req = {
      TrxRefNo: this.TelemkOfferSubj.RoPotentialNo,
      MrVerfTrxTypeCode: CommonConstant.VerfSchemeCodeRoTelemkOffering,
    };
    await this.http.post(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, req).toPromise().then(
      (response) => {
        this.verfResultData = response;
      }
    );
  }

  async getListVerfResulHtData() {
    let req = {
      VerfResultId: this.verfResultData['VerfResultId'],
      MrVerfObjectCode: CommonConstant.RefMasterMasterCodeCustomer
    };
    await this.http.post(URLConstant.GetVerfResultHsByVerfResultIdAndObjectCode, req).toPromise().then(
      (response) => {
        this.ListVerifResultHObj = response["responseVerfResultHCustomObjs"];
      }
    );
  }

  onChangePhn() {
    let temp = this.TelemkOfferSubj.ListPhoneNo.filter(x => x.PhoneNumber == this.PhoneDataForm.controls["Phn"].value);
    this.PhoneDataForm.patchValue({ Phn: temp[0].PhoneNumber, PhnType: temp[0].PhoneType });
  }

  onChangeRmVerfResultStat() {
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

  onClickCancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_POTENTIAL_RO_TEL_OFFER_DETAIL], {
      RoPotentialId: this.TelemkOfferSubj.RoPotentialId,
      RoPotentialNo: this.TelemkOfferSubj.RoPotentialNo
    });
  }




  clearform() {
    this.PhoneDataForm.reset();
    this.PhoneDataForm = this.fb.group({
      MrVerfResultHStatCode: ['', [Validators.required, Validators.maxLength(50)]],
      Phn: ['', [Validators.required, Validators.maxLength(50)]],
      PhnType: ['', [Validators.required, Validators.maxLength(100)]],
      Notes: ['', [Validators.required, Validators.maxLength(4000)]],
      Score: [''],
      QuestionObjs: new FormArray([])
    });
    this.PhoneDataForm.controls.Notes.markAsPristine();
    this.PhoneDataForm.markAsUntouched();
    if (this.RmVerfResultStat.length > 0) this.PhoneDataForm.patchValue({ MrVerfResultHStatCode: this.RmVerfResultStat[0].Key });
    this.generateFormVerfQuestion();

    if (this.TelemkOfferSubj.ListPhoneNo.length > 0) {
      this.PhoneDataForm.patchValue({
        Phn: this.TelemkOfferSubj.ListPhoneNo[0].PhoneNumber,
        PhnType: this.TelemkOfferSubj.ListPhoneNo[0].PhoneType
      });
    }
    
  }

  generateFormVerfQuestion() {
    this.QuestionObj['VerfQuestionAnswerListObj'][0].VerfQuestionGrpName
    let grpListObj = this.QuestionObj['VerfQuestionAnswerListObj'];

    for (let i = 0; i < grpListObj.length; i++) {
      let QuestionGrp = this.fb.group({
        VerfQuestionGrpCode: grpListObj[i].VerfQuestionGrpCode,
        VerfQuestionGrpName: grpListObj[i].VerfQuestionGrpName,
        VerfQuestionAnswerList: this.fb.array([])
      }) as FormGroup;
      (this.PhoneDataForm.controls["QuestionObjs"] as FormArray).push(QuestionGrp);
      let ResultGrp = this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"] as FormArray;
      let QuestionList = grpListObj[i].verfQuestionAnswerList;

      this.ListVerfAnswer.push([]);
      if (QuestionList.length != 0) {
        for (let j = 0; j < QuestionList.length; j++) {
          let QuestionResultGrp = this.fb.group({
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
              let ddlList = QuestionList[j].VerfAnswer.split(";");
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
        this.onChangeRmVerfResultStat();
      }
    }
  }

  setPhoneVerifData() {
    let businessDt = new Date(this.BusinessDt);
    let todaydate = new Date();
    businessDt.setHours(todaydate.getHours(), todaydate.getMinutes(), todaydate.getSeconds());
    let usertimezone = businessDt.getTimezoneOffset() * 60000;
    businessDt = new Date(businessDt.getTime() - usertimezone);

    this.reqVerfResultObj = new VerifResulHDetailObj();
    this.reqVerfResultObj.VerfResultDListObj = new Array<VerfResultDObj>();
    this.reqVerfResultObj.VerfResultHObj.VerfResultId = this.verfResultData['VerfResultId'];
    this.reqVerfResultObj.VerfResultHObj.VerfSchemeHId = this.QuestionObj['VerfSchemeHId'];
    this.reqVerfResultObj.VerfResultHObj.MrVerfObjectCode = CommonConstant.RefMasterMasterCodeCustomer;
    this.reqVerfResultObj.VerfResultHObj.MrVerfSubjectRelationCode = CommonConstant.RefMasterMasterCodeSelf;
    this.reqVerfResultObj.VerfResultHObj.VerfDt = businessDt;
    this.reqVerfResultObj.VerfResultHObj.MrVerfResultHStatCode = this.PhoneDataForm.controls["MrVerfResultHStatCode"].value;
    this.reqVerfResultObj.VerfResultHObj.Phn = this.PhoneDataForm.controls["Phn"].value;
    this.reqVerfResultObj.VerfResultHObj.PhnType = this.PhoneDataForm.controls["PhnType"].value;
    this.reqVerfResultObj.VerfResultHObj.Notes = this.PhoneDataForm.controls["Notes"].value;
    if (this.PhoneDataForm.controls["MrVerfResultHStatCode"].value == CommonConstant.VerfResultStatSuccess) {
      for (let i = 0; i < this.PhoneDataForm.controls["QuestionObjs"].value.length; i++) {
        let currGrp = this.PhoneDataForm.controls["QuestionObjs"].value[i].VerfQuestionAnswerList;
        for (let j = 0; j < currGrp.length; j++) {
          let currAnswer = currGrp[j].ResultGrp;
          let question = new VerfResultDObj();
          question.VerfQuestionAnswerId = currAnswer.VerfQuestionAnswerId;
          question.VerfQuestionText = currAnswer.VerfQuestionText;
          question.Answer = currAnswer.Answer;
          question.Notes = currAnswer.Notes;
          question.SeqNo = currAnswer.SeqNo;
          question.VerfQuestionGroupCode = currAnswer.VerfQuestionGroupCode;
          this.reqVerfResultObj.VerfResultDListObj.push(question);
        }
      }
    }
  }

  SaveForm(formDirective: FormGroupDirective) {
    let activeButton = document.activeElement.id;

    if (this.isQuestionLoaded == false) {
      this.toastr.warningMessage("Can't process further because questions are not loaded");
      return;
    }

    this.setPhoneVerifData();
    this.http.post(URLConstant.AddVerfResultHeaderAndVerfResultDetail, this.reqVerfResultObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        if (activeButton == "save") this.onClickCancel();
        else {
          this.getListVerfResulHtData();
          formDirective.resetForm();
          this.clearform();
        }
      });
  }

  Save(){
    if(this.ListVerifResultHObj.length < 1){
      this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_HISTORY);
      return;
    }
    this.onClickCancel();
  }

  OpenView(key: string) {
    if (key == 'agr') {
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.TelemkOfferSubj.AgrmntId);
    } else if (key == 'cust') {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: this.TelemkOfferSubj.CustNo}).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }
}
