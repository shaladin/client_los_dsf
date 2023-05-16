import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ResRoTelemkOfferSubjectObj } from 'app/shared/model/lead/res-ro-telemk-offer-subject-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { VerifResulHDetailObj } from 'app/shared/model/verf-result-h/verif-resul-h-detail-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { VerfResultDObj } from 'app/shared/model/verf-result-d/verf-result-d.model';
import { VerfResultHObj } from 'app/shared/model/verf-result-h/verf-result-h.model';
import { CookieService } from 'ngx-cookie';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { CommonConstantDsf } from 'app/dsf/shared/constant/CommonConstantDsf';
import { VerfResultHDsfObj } from 'app/dsf/model/VerfResultHDsfObj.Model';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { VerfResultObj } from 'app/shared/model/verf-result/verf-result.model';

@Component({
  selector: 'app-ro-telemk-offer-verif-x-dsf',
  templateUrl: './ro-telemk-offer-verif-x-dsf.component.html'
})
export class RoTelemkOfferVerifXDsfComponent implements OnInit {

  ViewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  TelemkOfferSubj: ResRoTelemkOfferSubjectObj;
  RmVerfResultStat: Array<KeyValueObj>;
  QuestionObj: object;
  ListVerfAnswer: Array<Array<string>> = [];
  // Self Custom Changes
  ListVerifResultHObj: Array<VerfResultHDsfObj> = [];
  ListCallStatus: Array<KeyValueObj>;
  ReqByCode: GenericObj = new GenericObj();
  reqVerfResultHDsf:{VerfResultHId:number, CallStatus:string, Notes:string};
  ListRefMaster: Array<RefMasterObj> = new Array<RefMasterObj>();
  IsViewSubDetail: boolean = false;
  VerifResultHDetailObj: Array<VerfResultHDsfObj>;
  PromiseOpt: string = 'PROMISE_TO_LOAN';
  listReason: Array<KeyValueObj>;
  RoTelemkOfferingForm = this.fb.group({
    RoPotentialNo: ['', Validators.required],
    IsCustWillRo: ['', Validators.required],
    PromiseToLoanDt: [null],
    Notes: [null],
    Reason: ['']
  });
  // End Self Custom Changes
  PhoneDataForm = this.fb.group({
    RoPotentialNo: [''],
    CustNo: [''],
    CustName: [''],
    MrVerfResultHStatCode: ['', [Validators.required, Validators.maxLength(50)]],
    Phn: ['', [Validators.required, Validators.maxLength(50)]],
    PhnType: ['', [Validators.required, Validators.maxLength(100)]],
    Notes: ['', [Validators.required, Validators.maxLength(4000)]],
    Score: [''],
    QuestionObjs: new FormArray([]),
    // Self Custom Changes
    CallStatus: ['', [Validators.required]],
    CallStatusDetail: [''],
    NotesDetail: ['']
    // End Self Custom Changes
  });

  roPotentialNo: string;
  verfSchemeHId: number;
  reqVerfResultObj: VerifResulHDetailObj;
  // Self Custom Changes
  verfResultData: VerfResultObj;
  // End Self Custom Changes
  isQuestionLoaded: boolean = false;
  UserAccess: Object;

  IsMandatoryArr: Array<Array<boolean>> = new Array<Array<boolean>>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private cookieService: CookieService,
    private adInsHelperService: AdInsHelperService
  ) {
    this.route.queryParams.subscribe(params => {
      this.roPotentialNo = params['RoPotentialNo'];
      // Self Custom Changes
      this.RoTelemkOfferingForm.patchValue({ RoPotentialNo: this.roPotentialNo });
      // End Self Custom Changes
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
    // Self Custom Changes
    await this.getDataFromRefMaster();
    await this.http.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstant.REF_REASON_RO_POTENTIAL }).pipe(first()).subscribe(
      (response) => {
        this.listReason = response[CommonConstant.ReturnObj];
      }
    );
    // End Self Custom Changes
  }

  // Self Custom Changes
  async getDataFromRefMaster() {
    this.ReqByCode.Code = CommonConstantDsf.TELEMK_CALL_STATUS;
    await this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCodeOrderedBySeqNo, this.ReqByCode).toPromise().then(
      (response: RefMasterObj) => {
        this.ListRefMaster = response[CommonConstant.RefMasterObjs];
      });
  }
  // End Self Custom Changes

  async getTelemkOfferSubj() {
    await this.http.post(URLConstantX.GetTelemkOfferingSubjectByRoPotentialNo, { TrxNo: this.roPotentialNo }).toPromise().then(
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
      (response: VerfResultObj) => {
        this.verfResultData = response;
      }
    );
    // Self Custom Changes
    if (!this.verfResultData || this.verfResultData['VerfResultId'] == 0) {
      let Business_Date = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE));;
      let datePipe = new DatePipe("en-US");
      let value = datePipe.transform(Business_Date, "yyyy-MM-dd");
      let businessDt = new Date(value);
      let reqAddVerifResultObj: VerfResultObj = new VerfResultObj();
      reqAddVerifResultObj.TrxRefNo = this.roPotentialNo;
      reqAddVerifResultObj.VerfDt = businessDt;
      reqAddVerifResultObj.MrVerfResultStatCode = CommonConstant.VerfResultStatCodeNew;
      reqAddVerifResultObj.MrVerfTrxTypeCode = CommonConstant.VerfSchemeCodeRoTelemkOffering;
      reqAddVerifResultObj.EmpNo = "-";
      reqAddVerifResultObj.LobCode = "-";
      reqAddVerifResultObj.LobName = "-";
      reqAddVerifResultObj.Notes = "-";
      await this.http.post(URLConstant.AddVerfResult, reqAddVerifResultObj).toPromise().then(
        (response) => {
        }
      );
      await this.http.post(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, req).toPromise().then(
        (response: VerfResultObj) => {
          this.verfResultData = response;
        }
      );
    }

    // End Self Custom Changes
  }

  async getListVerfResulHtData() {
    let req = {
      VerfResultId: this.verfResultData['VerfResultId'],
      MrVerfObjectCode: CommonConstant.RefMasterMasterCodeCustomer
    };
    // Self Custom Changes
    await this.http.post(URLConstantDsf.GetVerfResultHDsfsByVerfResultIdAndObjectCode, req).toPromise().then(
      (response) => {
        this.ListVerifResultHObj = response["responseVerfResultHDsfCustomObjs"];
      }
    );
    // End Self Custom Changes
  }

  onChangePhn() {
    let temp = this.TelemkOfferSubj.ListPhoneNo.filter(x => x.PhoneNumber == this.PhoneDataForm.controls["Phn"].value);
    this.PhoneDataForm.patchValue({ Phn: temp[0].PhoneNumber, PhnType: temp[0].PhoneType });
  }

  onChangeRmVerfResultStat() {
    if (this.PhoneDataForm.controls["MrVerfResultHStatCode"].value == CommonConstant.VerfResultStatSuccess) {
      for (let i = 0; i < this.PhoneDataForm.controls["QuestionObjs"]["controls"].length; i++) {
        for (let j = 0; j < this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"].length; j++) {
          if (this.IsMandatoryArr.length > 0 && this.IsMandatoryArr[i].length > 0 && this.IsMandatoryArr[i][j]) {
            this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"][j]["controls"]["ResultGrp"]["controls"]["Answer"].setValidators([Validators.required]);
            this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"][j]["controls"]["ResultGrp"]["controls"]["Answer"].updateValueAndValidity();
          }
        }
      }
    }else {
      for (let i = 0; i < this.PhoneDataForm.controls["QuestionObjs"]["controls"].length; i++) {
        for (let j = 0; j < this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"].length; j++) {
          this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"][j]["controls"]["ResultGrp"]["controls"]["Answer"].clearValidators();
          this.PhoneDataForm.controls["QuestionObjs"]["controls"][i]["controls"]["VerfQuestionAnswerList"]["controls"][j]["controls"]["ResultGrp"]["controls"]["Answer"].updateValueAndValidity();
        }
      }
    }
  }

  onClickCancel() {
    // Self Custom Changes
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.LEAD_POTENTIAL_RO_TEL_OFFER_PAGING], {
      //RoPotentialId: this.TelemkOfferSubj.RoPotentialId,
      //RoPotentialNo: this.TelemkOfferSubj.RoPotentialNo
    });
    // End Self Custom Changes
  }




  clearform() {
    this.PhoneDataForm.reset();
    this.PhoneDataForm = this.fb.group({
      MrVerfResultHStatCode: ['', [Validators.required, Validators.maxLength(50)]],
      Phn: ['', [Validators.required, Validators.maxLength(50)]],
      PhnType: ['', [Validators.required, Validators.maxLength(100)]],
      Notes: ['', [Validators.required, Validators.maxLength(4000)]],
      Score: [''],
      QuestionObjs: new FormArray([]),
      // Self Custom Changes
      CallStatus: ['', [Validators.required]],
      CallStatusDetail: [''],
      NotesDetail: ['']
      // End Self Custom Changes
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
        let tempIsMandatoryArr = [];
        for (let j = 0; j < QuestionList.length; j++) {
          let QuestionResultGrp = this.fb.group({
            QuestionGrp: this.fb.group({
              VerfQuestionAnswerId: QuestionList[j].VerfQuestionAnswerId,
              RefVerfAnswerTypeId: QuestionList[j].RefVerfAnswerTypeId,
              VerfQuestionCode: QuestionList[j].VerfQuestionCode,
              VerfQuestionText: QuestionList[j].VerfQuestionText,
              VerfAnswer: QuestionList[j].VerfAnswer,
              IsActive: QuestionList[j].IsActive,
              IsMandatory: QuestionList[j].IsMandatory,
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
              VerfQuestionGroupCode: grpListObj[i].VerfQuestionGrpCode,
              // Self Custom Changes
              CallStatus: "",
              CallStatusDetail: "",
              NotesDetail: ""
              // End Self Custom Changes
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
            // QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required])
          } else if (QuestionList[j].VerfAnswerTypeCode == CommonConstant.VerfAnswerTypeCodeUcInputNumber) {
            // QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required]);
            this.ListVerfAnswer[i].push("");
          } else {
            // QuestionResultGrp.controls.ResultGrp["controls"].Answer.setValidators([Validators.required])
            this.ListVerfAnswer[i].push("");
          }

          tempIsMandatoryArr.push(QuestionList[j].IsMandatory);
          ResultGrp.push(QuestionResultGrp);
        }

        this.IsMandatoryArr.push(tempIsMandatoryArr);
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
        // Self Custom Changes
        console.log(response["Id"]);
        this.reqVerfResultHDsf = {
          VerfResultHId: response["Id"],
          CallStatus: this.PhoneDataForm.controls["CallStatus"].value,
          Notes: this.PhoneDataForm.controls["Notes"].value
        }
        this.http.post(URLConstantDsf.AddVerfResultHeaderDsf, this.reqVerfResultHDsf).subscribe(
          (response2) => {
          });
        // End Self Custom Changes 
        this.toastr.successMessage(response["message"]);
        if (activeButton == "save") this.onClickCancel();
        else {
          this.getListVerfResulHtData();
          formDirective.resetForm();
          this.clearform();
        }
      });
  }

  Save() {
    if (this.ListVerifResultHObj.length < 1) {
      this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_HISTORY);
      return;
    }
    this.onClickCancel();
  }

  OpenView(key: string) {
    if (key == 'agr') {
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.TelemkOfferSubj.AgrmntId);
    } else if (key == 'cust') {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: this.TelemkOfferSubj.CustNo }).subscribe(
        response => {
          if (response["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if (response["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }
  // Self Custom Changes
  ShowDetail(VerfResultHId:number) {
    this.VerifResultHDetailObj = this.ListVerifResultHObj.filter(vrh => vrh.VerfResultHId === VerfResultHId);
    this.IsViewSubDetail = true;
    this.PhoneDataForm.controls['CallStatusDetail'].setValidators([Validators.required]);
    this.PhoneDataForm.controls['NotesDetail'].setValidators([Validators.required]);

    this.PhoneDataForm.patchValue({
      CallStatusDetail: this.VerifResultHDetailObj[0].CallStatus,
      NotesDetail: this.VerifResultHDetailObj[0].Notes
    });
  }

  gotoPageDetail()
  {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.LEAD_POTENTIAL_RO_VIEW], {
      "RoPotentialNo": this.roPotentialNo, "IsFromTelemkOffer": true
    });
  }

  hideDetail()
  {
    this.PhoneDataForm.controls['CallStatusDetail'].clearValidators();
    this.PhoneDataForm.controls['NotesDetail'].clearValidators();
    this.IsViewSubDetail = false;
  }

  saveDetail()
  {
    this.reqVerfResultHDsf = {
      VerfResultHId: this.VerifResultHDetailObj[0].VerfResultHId,
      CallStatus: this.PhoneDataForm.controls["CallStatusDetail"].value,
      Notes: this.PhoneDataForm.controls["NotesDetail"].value
    }
    if (this.reqVerfResultHDsf.Notes != "" && this.reqVerfResultHDsf.CallStatus != "")
    {
      this.http.post(URLConstantDsf.EditVerfResultHeaderDsf, this.reqVerfResultHDsf).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.IsViewSubDetail = false;
          this.getListVerfResulHtData();
          //this.clearform();
      });
    }
    else
    {
      this.toastr.warningMessage("Call Status and Notes shouldn't be empty");
    }
  }

  onChangeIsCustWillRo() {
    if (this.RoTelemkOfferingForm.controls['IsCustWillRo'].value == this.PromiseOpt)
      this.RoTelemkOfferingForm.controls['PromiseToLoanDt'].setValidators([Validators.required]);
    else
      this.RoTelemkOfferingForm.controls['PromiseToLoanDt'].clearValidators();

    if (this.RoTelemkOfferingForm.controls['IsCustWillRo'].value == "NO") {
      this.RoTelemkOfferingForm.controls['Reason'].setValidators([Validators.required]);
    } else {
      this.RoTelemkOfferingForm.controls['Reason'].clearValidators();
    }

    this.RoTelemkOfferingForm.controls['PromiseToLoanDt'].updateValueAndValidity();
    this.RoTelemkOfferingForm.controls['Reason'].updateValueAndValidity();
  }

  SaveActionForm() {
    let reqObj: object = {
      RoPotentialNo: this.RoTelemkOfferingForm.controls['RoPotentialNo'].value,
      IsCustWillRo: null,
      PromiseToLoanDt: this.RoTelemkOfferingForm.controls['IsCustWillRo'].value == this.PromiseOpt ? this.RoTelemkOfferingForm.controls['PromiseToLoanDt'].value : null,
      Notes: this.RoTelemkOfferingForm.controls['Notes'].value,
      ReasonCode: this.RoTelemkOfferingForm.controls['Reason'].value
    };

    let isWillRo = this.RoTelemkOfferingForm.controls['IsCustWillRo'].value;
    if (isWillRo == this.PromiseOpt) reqObj['IsCustWillRo'] = null;
    else if (isWillRo == 'YES') reqObj['IsCustWillRo'] = true;
    else reqObj['IsCustWillRo'] = false;

    this.http.post(URLConstant.UpdatePotentialRo, reqObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.onClickCancel();
      })
  }
  // Self Custom Changes

}
