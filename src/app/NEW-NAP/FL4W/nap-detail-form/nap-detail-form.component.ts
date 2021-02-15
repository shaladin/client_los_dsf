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
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-nap-detail-form',
  templateUrl: './nap-detail-form.component.html',
  providers: [NGXToastrService]
})
export class NapDetailFormComponent implements OnInit {
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
    "NAPD": 1,
    "REF": 1,
    "APP": 2,
    "ASSET": 3,
    "INS": 4,
    "LFI": 5,
    "FIN": 6,
    "TC": 7,
    "UPD":8
  };
  dmsObj: DMSObj;
  appNo: string;
  isDmsReady: boolean = false;

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
            if(response.AppCurrStep == CommonConstant.AppStepUplDoc){
              this.initDms();
            }
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

  async initDms() {
    this.isDmsReady = false;
    this.dmsObj = new DMSObj();
    let currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    this.dmsObj.User = currentUserContext.UserName;
    this.dmsObj.Role = currentUserContext.RoleCode;
    this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
    var appObj = { AppId: this.appId };
    let getApp = await this.http.post(URLConstant.GetAppById, appObj);
    let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
    forkJoin([getApp, getAppCust]).subscribe(
      response => {
        this.appNo = response[0]['AppNo'];
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
        let isExisting = response[1]['IsExistingCust'];
        if(isExisting){
          let custNo = response[1]['CustNo'];
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, custNo));
        }
        else{
          this.dmsObj.MetadataParent = null;
        }

        let mouId = response[0]['MouCustId'];
        if(mouId != null && mouId != ""){
          let mouObj = {MouCustId : mouId};
          this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
            result =>{
              let mouCustNo = result['MouCustNo'];
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, mouCustNo));
              this.isDmsReady = true;
            }
          )
        }
        else{
          this.isDmsReady = true;
        }
      }
    );
  }
  
  Cancel() {
    AdInsHelper.RedirectUrl(this.router,["/Nap/MainData/NAP2/Paging"], { BizTemplateCode: CommonConstant.FL4W });
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
        "NAPD": 1,
        "REF": 1,
        "APP": 2,
        "ASSET": 3,
        "INS": 4,
        "LFI": 5,
        "FIN": 6,
        "TC": 7,
        "UPD":8
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
        "NAPD": 1,
        "REF": 1,
        "APP": 2,
        "ASSET": 3,
        "INS": 4,
        "LFI": 5,
        "FIN": 5,
        "TC": 6,
        "UPD":7
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
    if(Step == CommonConstant.AppStepUplDoc){
      this.initDms();
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
          this.Cancel();
        })
    }
  }

  ChangeTab(AppStep) {
    this.IsSavedTC = false;
    switch (AppStep) {
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

    // this.ucMainInfo.OnInit();
  }

  Submit() {
    if (this.ReturnHandlingHId > 0) {
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
