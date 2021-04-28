import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { SubmitNapObj } from 'app/shared/model/Generic/SubmitNapObj.Model';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-app-add-detail',
  templateUrl: './app-add-detail.component.html',
  providers: [NGXToastrService]
})
export class AppAddDetailComponent implements OnInit {

  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  IsMultiAsset: string;
  ListAsset: any;
  IsViewReady: boolean = false;
  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "GUAR": 2,
    "REF": 3,
    "APP": 4,
    "ASSET": 5,
    "INS": 6,
    "LFI": 7,
    "FIN": 8,
    "TC": 9,
  };

  ResponseReturnInfoObj;
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;

  readonly CancelLink: string = NavigationConstant.NAP_CF2W_PAGING;
  readonly BackLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.mode = params["Mode"];
        this.CheckMultiAsset();
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
    });
  }

  ngOnInit() {
    //this.ClaimTask();
    this.AppStepIndex = 0;
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    var appObj = { Id: this.appId };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          this.IsViewReady = true;
          this.AppStepIndex = this.AppStep[response.AppCurrStep];
          this.stepper.to(this.AppStepIndex);
        }
        else {
          this.AppStepIndex = 0;
        }
      });

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
    this.MakeViewReturnInfoObj();
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router,[this.CancelLink], {});
  }

  MakeViewReturnInfoObj() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.appId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingEditApp;
      this.http.post(URLConstant.GetReturnHandlingDByAppIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
        (response) => {
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
        this.ListAsset = response['ReturnObject'];
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

  ChangeTab(AppStep) {
    switch (AppStep) {
      case CommonConstant.AppStepCust:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepCust];
        break;
      case CommonConstant.AppStepGuar:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepGuar];
        break;
      case CommonConstant.AppStepRef:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepRef];
        break;
      case CommonConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepApp];
        break;
      case CommonConstant.AppStepAsset:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepAsset];
        break;
      case CommonConstant.AppStepIns:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepIns];
        break;
      case CommonConstant.AppStepLIns:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepLIns];
        break;
      case CommonConstant.AppStepFin:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepFin];
        break;
      case CommonConstant.AppStepTC:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepTC];
        break;

      default:
        break;
    }
  }

  NextStep(Step) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) =>{
        this.ChangeTab(Step);
        this.stepper.next();
      }
    )
  }

  LastStepHandler() {
    let reqObj: SubmitNapObj = new SubmitNapObj();
    reqObj.AppId = this.NapObj.AppId;
    reqObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.SubmitNAP, reqObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [this.CancelLink], { LobCode: CommonConstant.CF2W });
      })
  }

  Submit() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      var ReturnHandlingResult: ReturnHandlingDObj = new ReturnHandlingDObj();
      ReturnHandlingResult.WfTaskListId = this.wfTaskListId;
      ReturnHandlingResult.ReturnHandlingHId = this.ResponseReturnInfoObj.ReturnHandlingHId;
      ReturnHandlingResult.ReturnHandlingDId = this.ResponseReturnInfoObj.ReturnHandlingDId;
      ReturnHandlingResult.MrReturnTaskCode = this.ResponseReturnInfoObj.MrReturnTaskCode;
      ReturnHandlingResult.ReturnStat = this.ResponseReturnInfoObj.ReturnStat;
      ReturnHandlingResult.ReturnHandlingNotes = this.ResponseReturnInfoObj.ReturnHandlingNotes;
      ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.value.ReturnExecNotes;
      ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

      this.http.post(URLConstant.EditReturnHandlingD, ReturnHandlingResult).subscribe(
        (response) => {
        })
    }
  }
}
