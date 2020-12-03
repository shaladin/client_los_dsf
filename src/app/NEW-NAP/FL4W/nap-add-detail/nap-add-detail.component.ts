import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/App/App.Model';
import Stepper from 'bs-stepper';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html',
  providers: [NGXToastrService]
})
export class NapAddDetailComponent implements OnInit {
  @ViewChild('ucMainInfo') ucMainInfo: any;

  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;
  wfTaskListId: number;
  ReturnHandlingHId: number = 0;
  AppStepIndex: number = 1;
  appId: number;
  mode: string;
  viewProdMainInfoObj: UcViewGenericObj = new UcViewGenericObj();
  NapObj: AppObj = new AppObj();
  ResponseReturnInfoObj: any;
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  ListAsset: any;
  custType: string = CommonConstant.CustTypeCompany;
  stepperMode: string = CommonConstant.CustTypeCompany;
  showCancel: boolean = true;
  getApp: any;
  token: any = localStorage.getItem(CommonConstant.TOKEN);
  IsLastStep: boolean = false;
  IsSavedTC: boolean = false;
  @ViewChild("FL4WMainInfoContainer", { read: ViewContainerRef }) mainInfoContainer: ViewContainerRef;

  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "GUAR": 2,
    "REF": 3,
    "APP": 4,
    "COLL": 5,
    "INS": 6,
    "LFI": 7,
    "FIN": 8,
    "TC": 9
  };

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private router: Router, public toastr: NGXToastrService, private componentFactoryResolver: ComponentFactoryResolver) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
        this.mode = 'ReturnHandling';
        this.showCancel = false
      }
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.ClaimTask();
    this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
    this.viewProdMainInfoObj.viewEnvironment = environment.losUrl;
    this.viewProdMainInfoObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.NapObj.AppId = this.appId;

    if (this.ReturnHandlingHId > 0) {
      this.ChangeStepper();
      this.ChooseStep(this.AppStepIndex);
    } else {
      this.http.post(URLConstant.GetAppById, this.NapObj).subscribe(
        (response: AppObj) => {
          if (response) {
            this.NapObj = response;
            if (this.NapObj.MrCustTypeCode != null)
              this.custType = this.NapObj.MrCustTypeCode;

            this.ChangeStepper();
            this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
            this.ChooseStep(this.AppStepIndex);
          }
        });
    }
    this.MakeViewReturnInfoObj();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
    const component = this.mainInfoContainer.createComponent(componentFactory);
    component.instance.viewGenericObj = this.viewProdMainInfoObj;
    component.instance.callback.subscribe((e) => this.GetCallback(e));
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router,["/Nap/FinanceLeasing/Paging"], { BizTemplateCode: CommonConstant.FL4W });
  }

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
        "NEW": 1,
        "CUST": 1,
        "GUAR": 2,
        "REF": 3,
        "APP": 4,
        "COLL": 5,
        "INS": 6,
        "LFI": 7,
        "FIN": 8,
        "TC": 9,
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
        "NEW": 1,
        "CUST": 1,
        "GUAR": 2,
        "REF": 3,
        "APP": 4,
        "COLL": 5,
        "INS": 6,
        "LFI": 7,
        "FIN": 7,
        "TC": 8,
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

  NextStep(Step) {
    if (this.ReturnHandlingHId == 0) this.UpdateAppStep(Step);

    this.ChangeTab(Step);
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.next();
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.next();
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
    this.mainInfoContainer.clear();
    const component = this.mainInfoContainer.createComponent(componentFactory);
    component.instance.viewGenericObj = this.viewProdMainInfoObj;
    component.instance.callback.subscribe((e) => this.GetCallback(e));
  }

  UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) => {
        this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
        this.ChooseStep(this.AppStepIndex);
      }
    )
  }

  LastStepHandler() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    if (this.ReturnHandlingHId > 0) {
      this.IsSavedTC = true;
    } else {
      this.http.post(URLConstant.SubmitNAP, this.NapObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router,["/Nap/FinanceLeasing/Paging"], { BizTemplateCode: CommonConstant.FL4W });
        })
    }
  }

  ChangeTab(AppStep) {
    this.IsSavedTC = false;
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
      default:
        break;
    }
    if (AppStep == CommonConstant.AppStepTC)
      this.IsLastStep = true;
    else
      this.IsLastStep = false;

    // this.ucMainInfo.OnInit();
  }

  Submit() {
    if (this.ReturnHandlingHId > 0) {
      if (!this.IsSavedTC) {
        this.toastr.warningMessage(ExceptionConstant.SAVE_TC_DATA);
      }
      else {
        var ReturnHandlingResult: ReturnHandlingDObj = new ReturnHandlingDObj();
        ReturnHandlingResult.WfTaskListId = this.wfTaskListId;
        ReturnHandlingResult.ReturnHandlingDId = this.ResponseReturnInfoObj.ReturnHandlingDId;
        ReturnHandlingResult.MrReturnTaskCode = this.ResponseReturnInfoObj.MrReturnTaskCode;
        ReturnHandlingResult.ReturnStat = this.ResponseReturnInfoObj.ReturnStat;
        ReturnHandlingResult.ReturnHandlingNotes = this.ResponseReturnInfoObj.ReturnHandlingNotes;
        ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.controls['ReturnExecNotes'].value;
        ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

        this.http.post(URLConstant.EditReturnHandlingD, ReturnHandlingResult).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router,["/Nap/AddProcess/ReturnHandling/EditAppPaging"], { BizTemplateCode: CommonConstant.FL4W });
          }
        )
      }
    }
  }

  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.WfTaskListId = this.wfTaskListId;

    this.http.post(URLConstant.ClaimTaskNap, wfClaimObj).subscribe(
      () => {
      });
  }

  GetCallback(ev) {
    AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
  }

  CheckCustType(ev: string) {
    this.custType = ev;
    this.ChangeStepper();
    this.NextStep(CommonConstant.AppStepGuar);
  }
}
