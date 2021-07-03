import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-nap-detail-form',
  templateUrl: './nap-detail-form.component.html'
})
export class NapDetailFormComponent implements OnInit {
  // @ViewChild('viewMainProd') ucViewMainProd: UcviewgenericComponent;

  private viewMainProd: UcviewgenericComponent;
  @ViewChild('viewMainProd') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewMainProd = content;
    }
  }

  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  IsMultiAsset: boolean = false;
  ReturnHandlingHId: number = 0;
  showCancel: boolean = true;
  custType: string = CommonConstant.CustTypeCompany;
  token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IsLastStep: boolean = false;
  IsSavedTC: boolean = false;
  BizTemplateCode: string = CommonConstant.CFNA;

  AppStep = {
    "NAPD": 1,
    "APP": 1,
    "INVOICE": 2,
    "FIN": 3,
    "TC": 4
  };

  ResponseReturnInfoObj: ReturnHandlingDObj;
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;
  dmsObj: DMSObj;
  appNo: string;
  isDmsReady: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
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
  //---
  ngOnInit() {
    this.ClaimTask();
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppDlfnMainInformation.json";
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

    let obj = {
      Id: this.appId
    }

    this.http.post(URLConstant.GetAppById, obj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.AppStepIndex = this.AppStep[response.AppCurrStep];
          this.stepper.to(this.AppStepIndex);
        } else {
          this.AppStepIndex = 0;
          this.stepper.to(this.AppStepIndex);
        }
      }
    );

    this.stepper = new Stepper(document.querySelector("#stepper1"), {
      linear: false,
      animation: true,
    });
    this.MakeViewReturnInfoObj();
  }

  ChooseStep(idxStep: number) { // gaad
    this.stepper.to(idxStep);
  }

  ChangeStepper() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      let obj = {
        Id: this.ReturnHandlingHId,
        Code: CommonConstant.ReturnHandlingEditApp
      }
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(  // beda sama nap add detail
        (response) => {
          this.ResponseReturnInfoObj = response;
          this.FormReturnObj.patchValue({
            ReturnExecNotes: this.ResponseReturnInfoObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        });
    }
  }

  ChangeTab(AppStep) {
    this.IsSavedTC = false;
    switch (AppStep) {
      case CommonConstant.AppStepCust:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepCust];
        break;
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

      default:
        break;
    }
    this.viewMainProd.initiateForm();
    //  this.ucViewMainProd.initiateForm();
  }

  NextStep(Step) {
    if (this.ReturnHandlingHId > 0) {

    } else {
      this.UpdateAppStep(Step);
    }
    this.ChangeTab(Step);
    this.stepper.next();
    // this.ucViewMainProd.initiateForm();
  }

  UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) => {
      }
    )
  }

  LastStepHandler() {  //lmyn miripp
    this.NapObj.WfTaskListId = this.wfTaskListId;
    if (this.ReturnHandlingHId > 0) {
      this.IsSavedTC = true;
    } else {
      this.http.post(URLConstant.SubmitNAP, this.NapObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.Cancel();
        })
    }
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_DLFN_PAGING], {});
  }

  ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.WfTaskListId = this.wfTaskListId;

    this.http.post(URLConstant.ClaimTaskNap, wfClaimObj).subscribe(
      () => {
      });
  }

  CheckCustType(ev: string) {
    this.custType = ev;
    this.ChangeStepper();
    this.NextStep(CommonConstant.AppStepGuar);
  }

  GetCallback(ev) {
    if (ev.Key == "HighlightComment") {
      let custObj = { CustNo: ev.ViewObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    } else {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

}
