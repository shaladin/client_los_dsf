import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { SubmitNapObj } from 'app/shared/model/Generic/SubmitNapObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ResReturnHandlingDObj } from 'app/shared/model/Response/ReturnHandling/ResReturnHandlingDObj.model';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html',
  providers: [NGXToastrService]
})
export class NapAddDetailComponent implements OnInit {
  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  IsMultiAsset: string;
  ListAsset: any;
  ReturnHandlingHId: number = 0;
  showCancel: boolean = true;
  custType: string = CommonConstant.CustTypeCompany;
  Token: any = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IsLastStep: boolean = false;
  IsSavedTC: boolean = false;
  BizTemplateCode: string = CommonConstant.OPL;
  IsViewReady: boolean = false;
  
  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  arrValue = [];

  // AppStep = {
  //   "APP": 1,
  //   "ASSET": 2,
  //   "INS": 3,
  //   "LFI": 4,
  //   "FIN": 5,
  //   "TC": 6,
  // };

  AppStep = {
    "APP": 1,
    "ASSET": 2,
    "EXPENSE": 3,
    "FIN": 4,
    "TC": 5,
  };

  ResponseReturnInfoObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService, private cookieService: CookieService) {
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

  ngOnInit() {
    this.ClaimTask();
    this.AppStepIndex = 1;
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    this.arrValue.push(this.appId);
    // this.ChangeStepper();

    if (this.ReturnHandlingHId > 0) {
      this.ChangeStepper();
      this.ChooseStep(this.AppStepIndex);
    }
    else {
      var appObj = { Id: this.appId };
      this.http.post(URLConstant.GetAppById, appObj).subscribe(
        (response: AppObj) => {
          if (response) {
            this.NapObj = response;
            if (this.NapObj.MrCustTypeCode != null)
              this.custType = this.NapObj.MrCustTypeCode;

            this.ChangeStepper();
            this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
            this.ChooseStep(this.AppStepIndex);
            this.IsViewReady = true;
          }
        }
      );
    }
    this.MakeViewReturnInfoObj();
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
      // this.AppStep = {
      //   "APP": 1,
      //   "ASSET": 2,
      //   "INS": 3,
      //   "LFI": 4,
      //   "FIN": 5,
      //   "TC": 6,
      // };
      this.AppStep = {
        "APP": 1,
        "ASSET": 2,
        "EXPENSE": 3,
        "FIN": 4,
        "TC": 5,
      };
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany = new Stepper(document.querySelector('#stepperCompany'), {
        linear: false,
        animation: true
      });
      this.stepperMode = CommonConstant.CustTypeCompany;
      document.getElementById('stepperPersonal').style.display = 'none';
      document.getElementById('stepperCompany').style.display = 'block';
      // this.AppStep = {
      //   "APP": 1,
      //   "ASSET": 2,
      //   "INS": 3,
      //   "LFI": 4,
      //   "FIN": 5,
      //   "TC": 6,
      // };
      this.AppStep = {
        "APP": 1,
        "ASSET": 2,
        "EXPENSE": 3,
        "FIN": 4,
        "TC": 5,
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
        (response : ResReturnHandlingDObj) => {
          this.ResponseReturnInfoObj = response;
          this.FormReturnObj.patchValue({
            ReturnExecNotes: this.ResponseReturnInfoObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        }
      );
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
      }
    )
  }

  ChangeTab(AppStep) {
    this.IsSavedTC = false;
    switch (AppStep) {
      // case CommonConstant.AppStepCust:
      //   this.AppStepIndex = this.AppStep[CommonConstant.AppStepCust];
      //   break;
      // case CommonConstant.AppStepGuar:
      //   this.AppStepIndex = this.AppStep[CommonConstant.AppStepGuar];
      //   break;
      case CommonConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepApp];
        break;
      case CommonConstant.AppStepAsset:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepAsset];
        break;
      case CommonConstant.AppStepExpense:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepExpense];
        break;
      // case CommonConstant.AppStepIns:
      //   this.AppStepIndex = this.AppStep[CommonConstant.AppStepIns];
      //   break;
      // case CommonConstant.AppStepLIns:
      //   this.AppStepIndex = this.AppStep[CommonConstant.AppStepLIns];
      //   break;
      case CommonConstant.AppStepFin:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepFin];
        break;
      case CommonConstant.AppStepTC:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepTC];
        break;

      default:
        break;
    }
    if (AppStep == CommonConstant.AppStepTC)
      this.IsLastStep = true;
    else
      this.IsLastStep = false;

    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  NextStep(Step) {
    if (this.ReturnHandlingHId === 0) {
      this.UpdateAppStep(Step);
    }

    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.next();
    }
    else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.next();
    }
    this.ChangeTab(Step);
  }

  UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(() => {})
  }

  LastStepHandler() {
    if (this.ReturnHandlingHId > 0) {
      this.IsSavedTC = true;
    }
    else {
      let reqObj: SubmitNapObj = new SubmitNapObj();
      reqObj.AppId = this.NapObj.AppId;
      reqObj.WfTaskListId = this.wfTaskListId;
      this.http.post(URLConstant.SubmitNAP, reqObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ROS_PAGING], { BizTemplateCode: CommonConstant.OPL }); //Diganti ROS Bila Sudah Siap
        }
      )
    }
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ROS_PAGING], { BizTemplateCode: CommonConstant.OPL }); //Diganti ROS Bila Sudah Siap
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
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING], { BizTemplateCode: CommonConstant.OPL }); //Diganti ROS Bila Sudah Siap
        }
      )
    }
  }

  ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.WfTaskListId = this.wfTaskListId;

    this.http.post(URLConstant.ClaimTaskNap, wfClaimObj).subscribe(() => { });
  }

  CheckCustType(ev: string) {
    this.custType = ev;
    this.ChangeStepper();
    this.NextStep(CommonConstant.AppStepGuar);
  }

  GetCallBack(event: any) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
    }
  }
}