import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/app/app.model';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { forkJoin } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { SubmitNapObj } from 'app/shared/model/generic/submit-nap-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResReturnHandlingDObj } from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AppMainInfoComponent } from 'app/view-enhancing/app-main-info/app-main-info.component';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-nap-detail-form',
  templateUrl: './nap-detail-form.component.html',
  providers: [NGXToastrService]
})
export class NapDetailFormComponent implements OnInit {
  @ViewChild('viewAppMainInfo') ucViewMainProd: AppMainInfoComponent;
  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  IsMultiAsset: string;
  ListAsset: Array<AppAssetObj>;
  ReturnHandlingHId: number = 0;
  showCancel: boolean = true;
  custType: string = CommonConstant.CustTypeCompany;
  token: string = localStorage.getItem(CommonConstant.TOKEN);
  IsLastStep: boolean = false;
  IsSavedTC: boolean = false;
  bizTemplateCode: string = CommonConstant.OPL;
  isReady: boolean = false;
  IsViewReady: boolean = false;
  readonly AppCurrStepNap2 = CommonConstant.AppCurrStepNap2;

  AppStep = {
    "CMPLTN": 1,
    "NAPD": 1,
    "APP": 1,
    "ASSET": 2,
    "AEX": 3,
    "FIN": 4,
    "TC": 5,
    "UPL_DOC": 6
  };

  ResponseReturnInfoObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;
  dmsObj: DMSObj;
  appNo: string;
  isDmsReady: boolean = false;
  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: NGXToastrService,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService) {
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

  async ngOnInit() {
    this.claimTaskService.ClaimTaskNapCustMainData(this.appId, this.wfTaskListId);
    this.AppStepIndex = 1;
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;

    // this.ChangeStepper();

    await this.http.post(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
      async (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          if (this.NapObj.MrCustTypeCode != null) {
            this.custType = this.NapObj.MrCustTypeCode;
          }
        }
      });

    if (this.ReturnHandlingHId > 0) {
      this.ChangeStepper();
      this.ChooseStep(this.AppStepIndex);
    }
    else {
      if (this.NapObj.AppCurrStep == "UPL_DOC") {
        await this.initDms();
      }
      this.ChangeStepper();
      if (this.NapObj.AppCurrStep == CommonConstant.AppStepNapd) {
        this.NapObj.AppCurrStep = CommonConstant.AppStepApp;
        this.UpdateAppStep(this.NapObj.AppCurrStep);
      }
      this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
      this.ChooseStep(this.AppStepIndex);
    }
    this.isReady = true;
    this.IsViewReady = true;
    this.MakeViewReturnInfoObj();
  }

  async initDms() {
    this.isDmsReady = false;
    this.dmsObj = new DMSObj();
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.dmsObj.User = currentUserContext.UserName;
    this.dmsObj.Role = currentUserContext.RoleCode;
    this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
    var appObj = { Id: this.appId };
    let getApp = await this.http.post(URLConstant.GetAppById, appObj);
    let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
    forkJoin([getApp, getAppCust]).subscribe(
      response => {
        if (response != null && ((response["CustNo"] != null && response["CustNo"] != "") || (response["ApplicantNo"] != null && response["ApplicantNo"] != ""))) {
          let trxNo;
        this.appNo = response[0]['AppNo'];
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadDownloadView));
        let isExisting = response[1]['IsExistingCust'];
        if (isExisting) {
          trxNo = response['CustNo'];
        }
        else {
          trxNo = response['ApplicantNo'];
        }
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, trxNo));

        let mouId = response[0]['MouCustId'];
        if (mouId != null && mouId != "") {
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

  stepperMode: string = CommonConstant.CustTypeCompany;
  ChangeStepper() {
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal = new Stepper(document.querySelector('#stepperPersonal'), {
        linear: false,
        animation: true
      });
      this.stepperMode = CommonConstant.CustTypePersonal;
      document.getElementById('stepperPersonal').style.display = 'block';
      document.getElementById('stepperCompany').style.display = 'none';
      this.AppStep = {
        "CMPLTN": 1,
        "NAPD": 1,
        "APP": 1,
        "ASSET": 2,
        "AEX": 3,
        "FIN": 4,
        "TC": 5,
        "UPL_DOC": 6
      };
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany = new Stepper(document.querySelector('#stepperCompany'), {
        linear: false,
        animation: true
      });
      this.stepperMode = CommonConstant.CustTypeCompany;
      document.getElementById('stepperPersonal').style.display = 'none';
      document.getElementById('stepperCompany').style.display = 'block';
      this.AppStep = {
        "CMPLTN": 1,
        "NAPD": 1,
        "APP": 1,
        "ASSET": 2,
        "AEX": 3,
        "FIN": 4,
        "TC": 5,
        "UPL_DOC": 6
      };
    }
  }

  ChooseStep(idxStep: number) {
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.to(idxStep);
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.to(idxStep);
    }
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.ReturnHandlingHId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingEditApp;
      this.http.post(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
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
    var appObj = { Id: this.appId }
    this.http.post(URLConstant.GetAppAssetListByAppId, appObj).subscribe(
      (response) => {
        this.ListAsset = response[CommonConstant.ReturnObj];
        if (this.ListAsset != undefined && this.ListAsset != null) {
          if (this.ListAsset.length > 1)
            this.IsMultiAsset = 'True';
          else
            this.IsMultiAsset = 'False';
        }
        else
          this.IsMultiAsset = 'False';
      })
  }

  async ChangeTab(AppStep: string) {
    this.IsSavedTC = false;
    this.AppStep = {
      "CMPLTN": 1,
      "NAPD": 1,
      "APP": 1,
      "ASSET": 2,
      "AEX": 3,
      "FIN": 4,
      "TC": 5,
      "UPL_DOC": 6
    };
    if (this.ReturnHandlingHId == 0) {
      await this.UpdateAppStep(AppStep);
    }
    switch (AppStep) {
      case "APP":
        this.AppStepIndex = this.AppStep["APP"];
        break;
      case "ASSET":
        this.AppStepIndex = this.AppStep["ASSET"];
        break;
      case "AEX":
        this.AppStepIndex = this.AppStep["AEX"];
        break;
      case "FIN":
        this.AppStepIndex = this.AppStep["FIN"];
        break;
      case "TC":
        this.AppStepIndex = this.AppStep["TC"];
        break;
      case "UPL_DOC":
        this.AppStepIndex = this.AppStep["UPL_DOC"];
        break;
      default:
        break;
    }
    if (AppStep == "UPL_DOC")
      this.IsLastStep = true;
    else
      this.IsLastStep = false;

    this.ucViewMainProd.ReloadUcViewGeneric();
  }

  async NextStep(Step) {
    if (Step == "UPL_DOC") {
      this.initDms();
    }

    await this.ChangeTab(Step);
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.next();
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.next();
    }
    this.ucViewMainProd.ReloadUcViewGeneric();
  }

  async UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    await this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).toPromise().then(
      (response) => {
        this.spinner.show();
        setTimeout(() => { this.spinner.hide(); }, 1500);
      }
    )
  }

  LastStepHandler() {
    if (this.ReturnHandlingHId > 0) {
      this.IsSavedTC = true;
    } else {
      let reqObj: SubmitNapObj = new SubmitNapObj();
      reqObj.AppId = this.NapObj.AppId;
      reqObj.WfTaskListId = this.wfTaskListId;
      this.http.post(URLConstant.SubmitNAP, reqObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING], { BizTemplateCode: this.bizTemplateCode });
        })
    }
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING], { BizTemplateCode: this.bizTemplateCode });
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
      ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.controls['ReturnExecNotes'].value;
      ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

      this.http.post(URLConstant.EditReturnHandlingD, ReturnHandlingResult).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING], { BizTemplateCode: CommonConstant.OPL });
        }
      )
    }
  }

  CheckCustType(ev: string) {
    this.custType = ev;
    this.ChangeStepper();
    this.NextStep(CommonConstant.AppStepGuar);
  }

  GetCallback(ev) {
    AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
  }
}
