import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { DatePipe } from '@angular/common';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ResReturnHandlingDObj } from 'app/shared/model/Response/ReturnHandling/ResReturnHandlingDObj.model';
import { ReqGetVerfResultObj } from 'app/shared/model/VerfResult/ReqGetVerfResultObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { PhoneVerifObj } from 'app/shared/model/PhoneVerifObj.model';
import { ScoringResultHObj } from 'app/shared/model/ScoringResultHObj.Model';

@Component({
  selector: "phone-verification-subject",
  templateUrl: "./phone-verification-subject.component.html",
  providers: [NGXToastrService]
})
export class PhoneVerificationSubjectComponent implements OnInit {

  isReturnHandling: boolean = false;

  ReturnHandlingForm = this.fb.group({
    IsAnyUpdate: [''],
    UpdateNotes: ['', Validators.maxLength(4000)],
    ExecNotes: ['', Validators.maxLength(4000)],
  });;

  appId: number;
  returnHandlingHId: number;
  wfTaskListId: number;

  phoneVerifObj: Array<PhoneVerifObj>;
  AppObj: AppObj;
  verifResultObj: ScoringResultHObj;
  failCount: number = 0;
  scsCount: number = 0;
  blankCount: number = 0;
  addVerifResultObj: VerfResultObj;
  returnHandlingDObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  ReturnHandlingDData: ReturnHandlingDObj;
  ReturnHandlingHData: ReturnHandlingHObj;
  OnFormReturnInfo: boolean = false;
  BizTemplateCode: string;
  IsViewReady: boolean = false;
  UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router, private cookieService: CookieService) {

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

  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);

    if (this.wfTaskListId != null || this.wfTaskListId != undefined)
      this.claimTask();

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
      if (!this.isReturnHandling) {
        this.setReturnHandlingH();
        this.http.post(URLConstant.CompleteAppPhoneVerif, this.ReturnHandlingHData).subscribe(
          (response) => {

            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_PAGING], { "BizTemplateCode": this.BizTemplateCode });
          });
      }
      if (this.isReturnHandling) {
        this.setReturnHandlingD();
        this.http.post(URLConstant.EditReturnHandlingD, this.ReturnHandlingDData).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING], { "BizTemplateCode": this.BizTemplateCode });
          });

      }
    }
    else {
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
    this.http.post(URLConstant.ResumeWorkflow, workflowApiObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING], { BizTemplateCode: this.BizTemplateCode });

      }
    );
  }

  async GetAppData() {
    await this.http.post(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
      (response: AppObj) => {
        this.AppObj = response;
        this.IsViewReady = true;
      }
    );
  }

  MakeViewReturnInfoObj() {
    if (this.returnHandlingHId > 0) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.returnHandlingHId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingAddPhnVerf;
      this.http.post(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
        (response : ResReturnHandlingDObj) => {
          this.returnHandlingDObj = response;
        });
    }
  }

  GetPhnVerfSubjData() {
    this.http.post(URLConstant.GetAppPhoneVerifSubjectListByAppId, { Id: this.appId }).subscribe(
      (response) => {
        this.phoneVerifObj = response[CommonConstant.ReturnObj];
        for (let index = 0; index < this.phoneVerifObj.length; index++) {
          const element = this.phoneVerifObj[index];
          switch (element.Result) {
            case CommonConstant.PHN_VERF_RES_SCS:
              this.scsCount++;
              break;
            case CommonConstant.PHN_VERF_RES_FAIL:
              this.failCount++;
              break;          
            case '':
              this.blankCount++;
              break;          
            default:
              break;
          }
        }
      }
    );
  }

  async GetVerfResultData() {
    let verfResObj: ReqGetVerfResultObj = { TrxRefNo: this.AppObj.AppNo, MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodePhn, };
    await this.http.post(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, verfResObj).toPromise().then(
      (response) => {
        this.verifResultObj = response["ScoringResultHObj"];

      }
    );
    if (this.verifResultObj.VerfResultId == 0) {
      var Business_Date = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE));
      var datePipe = new DatePipe("en-US");
      var value = datePipe.transform(Business_Date, "yyyy-MM-dd");
      var businessDt = new Date(value);

      this.addVerifResultObj = new VerfResultObj();

      this.addVerifResultObj.TrxRefNo = this.AppObj.AppNo;
      this.addVerifResultObj.VerfDt = businessDt;
      this.addVerifResultObj.EmpNo = "-";
      this.addVerifResultObj.MrVerfResultStatCode = CommonConstant.VerfResultStatCodeNew;
      this.addVerifResultObj.MrVerfTrxTypeCode = CommonConstant.VerfTrxTypeCodePhn;
      this.addVerifResultObj.LobCode = this.AppObj.LobCode;
      this.addVerifResultObj.LobName = this.AppObj.LobCode;
      this.addVerifResultObj.Notes = "-";

      await this.http.post(URLConstant.AddVerfResult, this.addVerifResultObj).toPromise().then(
        () => {
        }
      );
    }
  }  

  View(VerifResultHid, SubjectName) {
    var link = environment.losR3Web + NavigationConstant.NAP_CRD_PRCS_PHN_VRF_SUBJECT_VIEW + "?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid + "&Name=" + SubjectName;
    this.router.navigate([]).then(() => { window.open(link, '_blank'); });
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
    var wfClaimObj = {
      pWFTaskListID: this.wfTaskListId,
      pUserID: this.UserAccess.UserName,
      isLoading: false
    };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }

  back() {
    if (this.isReturnHandling == false) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_PHN_VRF_PAGING], { "BizTemplateCode": this.BizTemplateCode });
    }
    if (this.isReturnHandling == true) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_PHN_VRF_PAGING], { "BizTemplateCode": this.BizTemplateCode });
    }
  }

  required: boolean = false;

  CheckState(value: String){
    if (value == "YES"){
      this.ReturnHandlingForm.controls.UpdateNotes.setValidators(Validators.required);
    }else{
      this.ReturnHandlingForm.controls.UpdateNotes.clearValidators();
    }
    this.ReturnHandlingForm.controls.UpdateNotes.updateValueAndValidity();
  }
}
