import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper'
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { ResponseSysConfigResultObj } from 'app/shared/model/Response/ResponseSysConfigResultObj.Model';
import { SubmitNapObj } from 'app/shared/model/Generic/SubmitNapObj.Model';

@Component({
  selector: 'app-nap-detail-form',
  templateUrl: './nap-detail-form.component.html',
  providers: [NGXToastrService]
})
export class NapDetailFormComponent implements OnInit {

  custType: string = CommonConstant.CustTypePersonal;
  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  NapObj: AppObj;
  ResponseReturnInfoObj: any;
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  ListAsset: any;
  showCancel: boolean = true;
  IsLastStep: boolean = false;
  ReturnHandlingHId: number = 0;
  IsDataReady: boolean = false;
  
  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

  AppStep = {
    "NAPD": 1,
    "REF": 1,
    "APP": 2,
    "COLL": 3,
    "INS": 4,
    "LFI": 5,
    "FIN": 6,
    "TC": 7,
    "UPL_DOC": 8,
  };
  dmsObj: DMSObj;
  appNo: string;
  isDmsReady: boolean = false;
  SysConfigResultObj: ResponseSysConfigResultObj = new ResponseSysConfigResultObj();

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING;
  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private router: Router, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.mode = params["Mode"];
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

  async ngOnInit() : Promise<void> {
    //check DMS
    await this.http.post<ResponseSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
    });

    this.ClaimTask();
    this.AppStepIndex = 1;
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    if (this.ReturnHandlingHId > 0) {
      this.stepper.to(this.AppStepIndex);
      this.IsDataReady = true;
    }
    else {
      var appObj = { Id: this.appId };
      this.http.post(URLConstant.GetAppById, appObj).subscribe(
        (response: AppObj) => {
          if (response) {
            this.NapObj = response;
            if (response["MrCustTypeCode"] != null)
              this.custType = response["MrCustTypeCode"];
            if (response.AppCurrStep == CommonConstant.AppStepUplDoc) {
              this.initDms();
            }
            this.AppStepIndex = this.AppStep[response.AppCurrStep];
            this.stepper.to(this.AppStepIndex);
          } else {
            this.AppStepIndex = 0;
            this.stepper.to(this.AppStepIndex);
          }
          this.IsDataReady = true;
        }
      );
    };

    this.MakeViewReturnInfoObj();
  }

  async initDms() {
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      var appObj = { Id: this.appId };
      this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
        response => {
          this.appNo = this.NapObj.AppNo;
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
          let isExisting = response['IsExistingCust'];
          if (isExisting) {
            let custNo = response['CustNo'];
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, custNo));
          }
          else {
            this.dmsObj.MetadataParent = null;
          }
  
          let mouId = this.NapObj.MouCustId;
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
        }
      );
    }  
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      var obj = {
        ReturnHandlingHId: this.ReturnHandlingHId,
        MrReturnTaskCode: CommonConstant.ReturnHandlingEditApp
      }
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(
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
            this.IsMultiAsset = true;
          else
            this.IsMultiAsset = false;
        }
        else
          this.IsMultiAsset = false;
      })
  }

  ChangeTab(AppStep) {
    switch (AppStep) {
      case CommonConstant.AppStepRef:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepRef];
        break;
      case CommonConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepApp];
        break;
      case CommonConstant.AppStepColl:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepColl];
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
    if (this.ReturnHandlingHId > 0) {

    }
    else {
      this.NapObj.AppCurrStep = Step;
      this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
        (response) => {
        }
      )
    }
    if (Step == CommonConstant.AppStepUplDoc) {
      this.initDms();
    }
    this.ChangeTab(Step);
    this.stepper.to(this.AppStepIndex)
  }

  CheckIsUseDms(){
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.NextStep(CommonConstant.AppStepUplDoc);
    }else{
      this.LastStepHandler();
    }
  }

  LastStepHandler() {
    let reqObj: SubmitNapObj = new SubmitNapObj();
    reqObj.AppId = this.NapObj.AppId;
    reqObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.SubmitNAP, reqObj).subscribe(
      (response) => {
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
      ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.controls['ReturnExecNotes'].value;
      ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;


      this.http.post(URLConstant.EditReturnHandlingD, ReturnHandlingResult).subscribe(
        (response) => {
        })
    }
  }
  ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.ClaimTaskNap, wfClaimObj).subscribe(
      (response) => {

      });
  }
  Cancel() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING], { BizTemplateCode: CommonConstant.CFRFN4W });
  }
}
