import { Component, OnInit, ViewChild } from '@angular/core';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Stepper from 'bs-stepper';
import { FormBuilder } from '@angular/forms';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'environments/environment';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { ResReturnHandlingDObj } from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { SubmitNapObj } from 'app/shared/model/generic/submit-nap-obj.model';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';

@Component({
  selector: 'app-nap-detail-form-x',
  templateUrl: './nap-detail-form-x.component.html'
})
export class NapDetailFormXComponent implements OnInit {
  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  NapObj: AppObj;
  ResponseReturnInfoObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  IsDataReady: boolean = false;
  ReturnHandlingHId: number = 0;
  showCancel: boolean = true;
  IsLastStep: boolean = false;
  readonly AppCurrStepNap2 = CommonConstant.AppCurrStepNap2;

  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

  AppStep = {
    "NAPD": 1,
    "APP": 1,
    "INVOICE": 2,
    "COLL": 3,
    "INS": 4,
    "FIN": 5,
    "TC": 6,
    "UPL_DOC": 7
  };
  isDmsReady: boolean = false;
  dmsObj: DMSObj;
  appNo: string;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  MouCustId: number;

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_NAP2_PAGING;
  readonly BackLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING;
  constructor(private route: ActivatedRoute, private spinner: NgxSpinnerService, private http: HttpClient, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private toastr: NGXToastrService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.CheckMultiAsset();
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
        this.showCancel = false;
      }
    });
  }

  async ngOnInit(): Promise<void> {
    //check DMS
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms }).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
      });

    this.claimTask();
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFctrMainInformation.json";
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    let appObj = { Id: this.appId };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          if (this.ReturnHandlingHId > 0) {
            this.stepper.to(this.AppStepIndex);
          } else {
            if (this.NapObj.AppCurrStep == CommonConstant.AppStepNapd) {
              this.NapObj.AppCurrStep = CommonConstant.AppStepApp;
              this.UpdateAppStep(this.NapObj.AppCurrStep);
            }
            this.AppStepIndex = this.AppStep[response.AppCurrStep];
            this.MouCustId = response.MouCustId;
            this.stepper.to(this.AppStepIndex);
            if (response.AppCurrStep == CommonConstant.AppStepUplDoc) {
              this.initDms();
            }
          }
        } else {
          this.AppStepIndex = 0;
          this.stepper.to(this.AppStepIndex);
        }
      }
    );

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    this.MakeViewReturnInfoObj();
    this.IsDataReady = true;
  }

  async initDms() {
    if (this.SysConfigResultObj.ConfigValue == '1') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      let appObj = { Id: this.appId };
      this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
        response => {
          if (response != null && ((response["CustNo"] != null && response["CustNo"] != "") || (response["ApplicantNo"] != null && response["ApplicantNo"] != ""))) {
            let trxNo;
            this.appNo = this.NapObj.AppNo;
            this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
            this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadDownloadView));
            let isExisting = response['IsExistingCust'];
            if (isExisting) {
              trxNo = response['CustNo'];
            }
            else {
              trxNo = response['ApplicantNo'];
            }
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, trxNo));

            let mouId = this.NapObj.MouCustId;
            this.MouCustId = this.NapObj.MouCustId;
            console.log(this.NapObj.MouCustId);
            if (mouId != null && mouId != 0) {
              let mouObj = { Id: mouId };
              this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
                result => {
                  let mouCustNo = result['MouCustNo'];
                  this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, mouCustNo));
                  this.isDmsReady = true;
                }
              )
            }
            else {
              this.isDmsReady = true;
            }
          } else {
            this.toastr.warningMessage(ExceptionConstant.DUP_CHECK_NOT_COMPLETE);
          }
        }
      );
    }
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING], { BizTemplateCode: CommonConstant.FCTR });
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.appId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingEditApp;
      this.http.post(URLConstant.GetReturnHandlingDByAppIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
        (response: ResReturnHandlingDObj) => {
          this.ResponseReturnInfoObj = response;
          this.FormReturnObj.patchValue({
            ReturnExecNotes: this.ResponseReturnInfoObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        });
    }
  }

  CheckMultiAsset() {
    let appObj = { Id: this.appId }
    this.http.post(URLConstant.GetAppAssetListByAppId, appObj).subscribe(
      (response) => {
        let ListAsset = response['ReturnObject'];
        if (ListAsset != undefined && ListAsset != null) {
          if (ListAsset.length > 1)
            this.IsMultiAsset = true;
          else
            this.IsMultiAsset = false;
        }
        else
          this.IsMultiAsset = false;
      })
  }

  ChangeTab(AppStep) {
    if (this.ReturnHandlingHId == 0) {
      this.UpdateAppStep(AppStep);
    }
    switch (AppStep) {
      case CommonConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepApp];
        break;
      case CommonConstant.AppStepInvoice:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepInvoice];
        break;
      case CommonConstant.AppStepColl:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepColl];
        break;
      case CommonConstant.AppStepIns:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepIns];
        break;
      case CommonConstant.AppStepFin:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepFin];
        break;
      case CommonConstant.AppStepTC:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepTC];
        break;
      case CommonConstant.AppStepUplDoc:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepUplDoc];
        break;
      default:
        break;
    }
    if (AppStep == CommonConstant.AppStepUplDoc)
      this.IsLastStep = true;
    else
      this.IsLastStep = false;
    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  NextStep(Step) {
    if (this.AppStepIndex == this.AppStep[CommonConstant.AppStepApp]) {
      const appObj = { Id: this.appId };
      this.http.post(URLConstant.GetAppById, appObj).subscribe(
        (response: AppObj) => {
          if (response) {
            this.NapObj = response;
          }
        }
      );
    }
    if (Step == CommonConstant.AppStepUplDoc) {
      this.initDms();
    }
    this.ChangeTab(Step);
    this.stepper.next();
    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      () => {
        this.spinner.show();
        setTimeout(() => { this.spinner.hide(); }, 1500);
        this.ChangeTab(Step);
        this.stepper.next();
      }
    )
    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  CheckIsUseDms() {
    if (this.SysConfigResultObj.ConfigValue == '1') {
      this.NextStep(CommonConstant.AppStepUplDoc);
    } else {
      this.LastStepHandler();
    }
  }

  async LastStepHandler() {
    let reqObj: SubmitNapObj = new SubmitNapObj();
    if (this.MouCustId == null) {
      await this.http.post(URLConstant.GetMouCustByAppId, { Id: this.appId }).toPromise().then(
        (response) => {
          this.MouCustId = response["MouCustId"]
        });
    }
    let IsInValid;
    await this.http.post(URLConstant.CheckIsMouFreeze, { MouCustId: this.MouCustId }).toPromise().then(
      (response) => {
        IsInValid = response["IsFreeze"]
      });
    if (IsInValid) {
      this.toastr.warningMessage(ExceptionConstant.MOU_FREEZE_STATE);
      return
    }

    reqObj.AppId = this.NapObj.AppId;
    reqObj.WfTaskListId = this.wfTaskListId;
    let SubmitNAPUrl = environment.isCore ? URLConstant.SubmitNAPV21 : URLConstant.SubmitNAP;
    this.http.post(SubmitNAPUrl, reqObj).subscribe(
      () => {
        this.Cancel();
      })
  }

  Submit() {
    if (this.ReturnHandlingHId > 0) {
      var ReturnHandlingResult: ReturnHandlingDObj = new ReturnHandlingDObj();
      ReturnHandlingResult.WfTaskListId = this.wfTaskListId;
      ReturnHandlingResult.ReturnHandlingHId = this.ResponseReturnInfoObj.ReturnHandlingHId;
      ReturnHandlingResult.ReturnHandlingDId = this.ResponseReturnInfoObj.ReturnHandlingDId;
      ReturnHandlingResult.MrReturnTaskCode = this.ResponseReturnInfoObj.MrReturnTaskCode;
      ReturnHandlingResult.ReturnStat = this.ResponseReturnInfoObj.ReturnStat;
      ReturnHandlingResult.ReturnHandlingNotes = this.ResponseReturnInfoObj.ReturnHandlingNotes;
      ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.value.ReturnExecNotes;
      ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

      let EditReturnHandlingDUrl = environment.isCore ? URLConstant.EditReturnHandlingDV2 : URLConstant.EditReturnHandlingD;
      this.http.post(EditReturnHandlingDUrl, ReturnHandlingResult).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_NAP2_PAGING], { BizTemplateCode: CommonConstant.FCTR });
        })
    }
  }

  claimTask() {
    if (environment.isCore) {
      if (this.wfTaskListId != "" && this.wfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
      }
    }
    else if (this.wfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
  }
}
