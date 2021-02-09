import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { DatePipe } from '@angular/common';
import { ReturnHandlingDObj } from '../../../../../shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { ReturnHandlingHObj } from '../../../../../shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { replaceAll } from 'chartist';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';



@Component({
  selector: "phone-verification-subject",
  templateUrl: "./phone-verification-subject.component.html",
  providers: [NGXToastrService]
})
export class PhoneVerificationSubjectComponent implements OnInit {


  getPhoneVerifSubjUrl: any;
  getVerfResultUrl: any;
  getAppUrl: any;
  addVerfResultUrl: any;
  rtnHandlingDUrl: any;
  editRtnHandlingDUrl: any;

  isReturnHandling: boolean = false;

  ReturnHandlingForm = this.fb.group({
    IsAnyUpdate: [''],
    UpdateNotes: ['', Validators.maxLength(4000)],
    ExecNotes: ['', Validators.maxLength(4000)],
  });
  viewObj: any;

  appId: any;
  returnHandlingHId: any;
  wfTaskListId: any;

  appObj = {
    AppId: 0,
  };

  rtnHandlingDObj = {
    ReturnHandlingDId: 0,
  };

  verfResObj =
    {
      TrxRefNo: "",
      MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodePhn,
    };
  phoneVerifObj: any;
  AppObj: any;
  verifResultObj: any;
  tempFail: any;
  tempScs: any;
  tempBlank: any;
  failCount: number = 0;
  scsCount: number = 0;
  blankCount: number = 0;
  addVerifResultObj: VerfResultObj;
  returnHandlingDObj: any;
  ReturnHandlingDData: ReturnHandlingDObj;
  ReturnHandlingHData: ReturnHandlingHObj;
  OnFormReturnInfo: boolean = false;
  arrValue = [];
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
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
    this.getPhoneVerifSubjUrl = URLConstant.GetAppPhoneVerifSubjectListByAppId;
    this.getAppUrl = URLConstant.GetAppById;
    this.getVerfResultUrl = URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode;
    this.addVerfResultUrl = URLConstant.AddVerfResult;
    this.rtnHandlingDUrl = URLConstant.GetReturnHandlingDByReturnHandlingDId;
    this.editRtnHandlingDUrl = URLConstant.EditReturnHandlingD;
  }

  async ngOnInit(): Promise<void> {
    this.arrValue.push(this.appId);
    if (this.wfTaskListId != null || this.wfTaskListId != undefined)
      this.claimTask();

    this.initUrl();
    this.appObj.AppId = this.appId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppData();
    await this.GetVerfResultData();
    await this.GetPhnVerfSubjData();
    if (this.isReturnHandling == true) {
      this.MakeViewReturnInfoObj();
    }
    else {
      this.ReturnHandlingForm.controls.IsAnyUpdate.setValidators(Validators.required);
      this.ReturnHandlingForm.controls.IsAnyUpdate.updateValueAndValidity();
    }
  }

  async SaveForm() {
    if (this.blankCount == 0) {
      var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
      if (this.isReturnHandling == false) {
        this.setReturnHandlingH();
        this.http.post(URLConstant.CompleteAppPhoneVerif, this.ReturnHandlingHData).subscribe(
          (response) => {

            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_PAGING], { "BizTemplateCode": BizTemplateCode });
          });
      }
      if (this.isReturnHandling == true) {
        this.setReturnHandlingD();
        this.http.post(this.editRtnHandlingDUrl, this.ReturnHandlingDData).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING], { "BizTemplateCode": BizTemplateCode });
          });

      }
    }
    else{
      this.toastr.warningMessage("Please verify all the subject.");
    }
  }

  setReturnHandlingD() {
    this.ReturnHandlingDData = new ReturnHandlingDObj();
    this.ReturnHandlingDData.ReturnHandlingDId = this.returnHandlingDObj.ReturnHandlingDId;
    this.ReturnHandlingDData.ReturnHandlingHId = this.returnHandlingDObj.ReturnHandlingHId;
    this.ReturnHandlingDData.MrReturnTaskCode = this.returnHandlingDObj.MrReturnTaskCode;
    this.ReturnHandlingDData.ReturnStat = this.returnHandlingDObj.ReturnStat;
    this.ReturnHandlingDData.ReturnHandlingNotes = this.returnHandlingDObj.ReturnHandlingNotes;
    this.ReturnHandlingDData.ReturnHandlingExecNotes = this.ReturnHandlingForm.controls["ExecNotes"].value;
    this.ReturnHandlingDData.WfTaskListId = this.wfTaskListId;
    this.ReturnHandlingDData.RowVersion = this.returnHandlingDObj.RowVersion;
  }

  setReturnHandlingH() {
    this.ReturnHandlingHData = new ReturnHandlingHObj();
    this.ReturnHandlingHData.AppId = this.appId;
    this.ReturnHandlingHData.ReturnBy = localStorage.getItem(CommonConstant.USER_NAME_LOCAL_STORAGE);
    this.ReturnHandlingHData.ReturnNotes = this.ReturnHandlingForm.controls.UpdateNotes.value;
    this.ReturnHandlingHData.ReturnFromTrxType = CommonConstant.TrxTypeCodePhn;
    this.ReturnHandlingHData.WfTaskListId = this.wfTaskListId;
    this.ReturnHandlingHData.IsReturn = (this.ReturnHandlingForm.controls['IsAnyUpdate'].value == 'YES') ? true : false;
  }

  SubmitReturnHandling() {
    var workflowApiObj = new WorkflowApiObj();
    workflowApiObj.TaskListId = this.wfTaskListId;
    workflowApiObj.ListValue["pBookmarkValue"] = this.ReturnHandlingForm.controls["ExecNotes"].value;
    var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.http.post(URLConstant.ResumeWorkflow, workflowApiObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING], { BizTemplateCode: lobCode });

      }
    );
  }

  async GetAppData() {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {

        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
      }
    );
  }

  MakeViewReturnInfoObj() {
    if (this.returnHandlingHId > 0) {
      var obj = {
        ReturnHandlingHId: this.returnHandlingHId,
        MrReturnTaskCode: CommonConstant.ReturnHandlingAddPhnVerf
      }
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(
        (response) => {
          this.returnHandlingDObj = response;
        });
    }
  }

  GetPhnVerfSubjData() {
    this.http.post(this.getPhoneVerifSubjUrl, this.appObj).subscribe(
      (response) => {
        this.phoneVerifObj = response;
        this.tempBlank = this.phoneVerifObj.filter(
          blank => blank.Result == '');
        this.tempScs = this.phoneVerifObj.filter(
          scs => scs.Result == 'SCS');
        this.tempFail = this.phoneVerifObj.filter(
          fail => fail.Result == 'FAIL');
        this.blankCount = this.tempBlank.length;
        this.scsCount = this.tempScs.length;
        this.failCount = this.tempFail.length;

      }
    );
  }

  async GetVerfResultData() {
    await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
      (response) => {
        this.verifResultObj = response;

      }
    );
    if (this.verifResultObj.VerfResultId == 0) {
      var Business_Date = localStorage.getItem(CommonConstant.BUSINESS_DATE);
      var datePipe = new DatePipe("en-US");
      var value = datePipe.transform(Business_Date, "yyyy-MM-dd");
      var businessDt = new Date(value);

      var useraccess = localStorage.getItem(CommonConstant.USER_ACCESS);
      this.addVerifResultObj = new VerfResultObj();

      this.addVerifResultObj.TrxRefNo = this.AppObj.AppNo;
      this.addVerifResultObj.VerfDt = businessDt;
      this.addVerifResultObj.EmpNo = "-";
      this.addVerifResultObj.MrVerfResultStatCode = CommonConstant.VerfResultStatCodeNew;
      this.addVerifResultObj.MrVerfTrxTypeCode = CommonConstant.VerfTrxTypeCodePhn;
      this.addVerifResultObj.LobCode = this.AppObj.LobCode;
      this.addVerifResultObj.LobName = this.AppObj.LobCode;
      this.addVerifResultObj.Notes = "-";

      await this.http.post(this.addVerfResultUrl, this.addVerifResultObj).toPromise().then(
        (response) => {
        }
      );
    }
  }

  async GetReturnHandlingD() {
    this.rtnHandlingDObj.ReturnHandlingDId = this.returnHandlingHId;
    await this.http.post(this.rtnHandlingDUrl, this.rtnHandlingDObj).toPromise().then(
      (response) => {
        this.returnHandlingDObj = response;

      }
    );
  }

  View(VerifResultHid, SubjectName) {
    var link = environment.losR3Web + "/Nap/CreditProcess/PhoneVerification/Subject/View?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid + "&Name=" + SubjectName;
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });

    //window.open("/Nap/CreditProcess/PhoneVerification/Subject/View?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid + "&Name=" + SubjectName, "_blank");
  }

  Verif(VerifResultHid, SubjectName, SubjectType, IdSource, SubjectRelation) {
    if (this.isReturnHandling == false) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_SUBJECT_VERIF], { "AppId": this.appId, "VerfResultHId": VerifResultHid, "Name": SubjectName, "Type": SubjectType, "Relation": SubjectRelation, "Source": IdSource, "WfTaskListId": this.wfTaskListId });

    }
    if (this.isReturnHandling == true) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_SUBJECT_VERIF], { "AppId": this.appId, "VerfResultHId": VerifResultHid, "Name": SubjectName, "Type": SubjectType, "Relation": SubjectRelation, "Source": IdSource, "ReturnHandlingHId": this.returnHandlingHId, "WfTaskListId": this.wfTaskListId });
    }
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = {
      pWFTaskListID: this.wfTaskListId,
      pUserID: currentUserContext[CommonConstant.USER_NAME],
      isLoading: false
    };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  back() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    if (this.isReturnHandling == false) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_PAGING], { "BizTemplateCode": BizTemplateCode });
    }
    if (this.isReturnHandling == true) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING], { "BizTemplateCode": BizTemplateCode });
    }
  }
}
