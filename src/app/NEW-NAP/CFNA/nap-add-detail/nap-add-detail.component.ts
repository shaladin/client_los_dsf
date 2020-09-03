import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
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

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html',
  styles: []
})
export class NapAddDetailComponent implements OnInit {
  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  viewProdMainInfoObj: UcViewGenericObj = new UcViewGenericObj();
  NapObj: AppObj;
  ResponseReturnInfoObj: any;
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  ListAsset: any;
  BizTemplateCode: string;
  @ViewChild("CFNAMainInfoContainer", { read: ViewContainerRef }) mainInfoContainer: ViewContainerRef;

  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

  AppStep = {
    // "NEW": 1,
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

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private fb: FormBuilder, 
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { 
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
    this.BizTemplateCode = CommonConstant.CFNA;
  }

  ngOnInit() {
    this.ClaimTask();
    this.AppStepIndex = 0;
    // this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformationCFNA.json";
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
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
    ];
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    this.http.post(URLConstant.GetAppById, this.NapObj).subscribe(
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

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    this.MakeViewReturnInfoObj();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
    const component = this.mainInfoContainer.createComponent(componentFactory);
    component.instance.viewGenericObj = this.viewProdMainInfoObj;
    component.instance.callback.subscribe((e) => this.GetCallback(e));
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
    var appObj = { AppId: this.appId }
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
  }

  NextStep(Step) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) => {
        this.ChangeTab(Step);
        this.stepper.next();

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
        this.mainInfoContainer.clear();
        const component = this.mainInfoContainer.createComponent(componentFactory);
        component.instance.viewGenericObj = this.viewProdMainInfoObj;
        component.instance.callback.subscribe((e) => this.GetCallback(e));
      }
    )
  }
  LastStepHandler() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.SubmitNAP, this.NapObj).subscribe(
      (response) => {
        this.router.navigate(["/Nap/CFNA/Paging"])
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
        (response) => {
        })
    }
  }
  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.ClaimTaskNap, wfClaimObj).subscribe(
      (response) => {

      });
  }
  Cancel() {
    this.router.navigate(["Paging"], { relativeTo: this.route.parent, skipLocationChange: true, queryParams: { BizTemplateCode: CommonConstant.CFNA } });
  }

  GetCallback(ev) {
    AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
  }

}
