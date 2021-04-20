import { Component, OnInit, ViewChild } from '@angular/core';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import Stepper from 'bs-stepper';
import { FormBuilder } from '@angular/forms';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { ResponseSysConfigResultObj } from 'app/shared/model/Response/ResponseSysConfigResultObj.Model';
import { SubmitNapObj } from 'app/shared/model/Generic/SubmitNapObj.Model';

@Component({
  selector: 'app-nap-detail-form',
  templateUrl: './nap-detail-form.component.html'
})
export class NapDetailFormComponent implements OnInit {
  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  NapObj: AppObj;
  ResponseReturnInfoObj: any;
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  ListAsset: any;
  IsDataReady: boolean = false;
  
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
  SysConfigResultObj: ResponseSysConfigResultObj = new ResponseSysConfigResultObj();

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING2;
  readonly BackLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING;
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
    });
  }

  async ngOnInit() : Promise<void> {
    //check DMS
    await this.http.post<ResponseSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
    });

    this.ClaimTask();
    this.AppStepIndex = 0;
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFctrMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
    ];
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    var appObj = { Id: this.appId };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          this.AppStepIndex = this.AppStep[response.AppCurrStep];
          this.stepper.to(this.AppStepIndex);
          if (response.AppCurrStep == CommonConstant.AppStepUplDoc) {
            this.initDms();
          }
          this.IsDataReady = true;
        } else {
          this.AppStepIndex = 0;
          this.stepper.to(this.AppStepIndex);
          this.IsDataReady = true;
        }
      }
    );

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

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

  Cancel() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING], { BizTemplateCode: CommonConstant.FCTR });
  }

  MakeViewReturnInfoObj() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      var obj = {
        AppId: this.appId,
        MrReturnTaskCode: CommonConstant.ReturnHandlingEditApp
      }
      this.http.post(URLConstant.GetReturnHandlingDByAppIdAndMrReturnTaskCode, obj).subscribe(
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
    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  NextStep(Step) {
    if (Step == CommonConstant.AppStepUplDoc) {
      this.initDms();
    }
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      () => {
        this.ChangeTab(Step);
        this.stepper.next();
      }
    )
    this.viewAppMainInfo.ReloadUcViewGeneric();
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
      () => {
        this.Cancel();
      })
  }

  Submit() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      var obj = {
        ReturnHandlingDId: this.ResponseReturnInfoObj.ReturnHandlingDId,
        ReturnHandlingNotes: this.ResponseReturnInfoObj.ReturnHandlingNotes,
        ReturnHandlingExecNotes: this.FormReturnObj.value.ReturnExecNotes,
        RowVersion: this.ResponseReturnInfoObj.RowVersion
      };

      this.http.post(URLConstant.EditReturnHandlingD, obj).subscribe(
        () => {
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
      () => {

      });
  }
}
