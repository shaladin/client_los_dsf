import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { AppObj } from 'app/shared/model/App/App.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { environment } from 'environments/environment';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { DMSLabelValueObj } from 'app/shared/model/DMS/dms-label-value-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { SubmitNapObj } from 'app/shared/model/generic/submit-nap-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { ResReturnHandlingDObj } from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';

@Component({
  selector: 'app-nap-detail-form-dsf',
  templateUrl: './nap-detail-form-dsf.component.html',
  styleUrls: ['./nap-detail-form-dsf.component.css'],
  providers: [NGXToastrService]
})
export class NapDetailFormDsfComponent implements OnInit {

  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  IsMultiAsset: string;
  // ListAsset: any;
  ReturnHandlingHId: number = 0;
  showCancel: boolean = true;
  custType: string = CommonConstant.CustTypeCompany;
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IsLastStep: boolean = false;
  IsSavedTC: boolean = false;
  BizTemplateCode: string = CommonConstant.CFNA;
  @ViewChild("CFNAMainInfoContainer", { read: ViewContainerRef }) mainInfoContainer: ViewContainerRef;

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

  ResponseReturnInfoObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;
  dmsObj: DMSObj;
  appNo: string;
  isDmsReady: boolean = false;
  IsDataReady: boolean = false;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_NAP2_PAGING;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService,
    private spinner: NgxSpinnerService,
    private componentFactoryResolver: ComponentFactoryResolver, 
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        // this.CheckMultiAsset();
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
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
    });

    this.claimTask();
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformationCFNA.json";
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;

    // this.ChangeStepper();

    await this.http.post(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
      async (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          if (this.NapObj.MrCustTypeCode != null)
            this.custType = this.NapObj.MrCustTypeCode;
        }
      });

    if (this.ReturnHandlingHId > 0) {
      this.ChangeStepper();
      this.ChooseStep(this.AppStepIndex);
    }
    else {
      if (this.NapObj.AppCurrStep == CommonConstant.AppStepUplDoc) {
        await this.initDms();
      }
      if (this.NapObj.AppCurrStep == CommonConstant.AppStepNapd) {
        this.NapObj.AppCurrStep = CommonConstant.AppStepRef;
        this.UpdateAppStep(this.NapObj.AppCurrStep);
      }
      this.ChangeStepper();
      this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
      this.ChooseStep(this.AppStepIndex);
    }
    this.IsDataReady = true;
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
          if (response != null && ((response["CustNo"] != null && response["CustNo"] != "") || (response["ApplicantNo"] != null && response["ApplicantNo"] != ""))) {
            let trxNo;
          this.appNo = this.NapObj.AppNo;
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
          let isExisting = response['IsExistingCust'];
          if (isExisting) {
            trxNo = response['CustNo'];
																									
          }
          else {
            trxNo = response['ApplicantNo'];
          }
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, trxNo));
  
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
        } else {
          this.toastr.warningMessage(ExceptionConstant.DUP_CHECK_NOT_COMPLETE);
        }
      }
      );
    }  
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
        "COLL": 3,
        "INS": 4,
        "LFI": 5,
        "FIN": 5,
        "TC": 6,
        "UPL_DOC": 7,
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
        });
    }
  }

  // CheckMultiAsset() {
  //   var appObj = { Id: this.appId }
  //   this.http.post(URLConstant.GetAppAssetListByAppId, appObj).subscribe(
  //     (response) => {
  //       this.ListAsset = response[CommonConstant.ReturnObj];
  //       if (this.ListAsset != undefined && this.ListAsset != null) {
  //         if (this.ListAsset.length > 1)
  //           this.IsMultiAsset = 'True';
  //         else
  //           this.IsMultiAsset = 'False';
  //       }
  //       else
  //         this.IsMultiAsset = 'False';
  //     })
  // }

  ChangeTab(AppStep) {
    this.IsSavedTC = false;
    if (this.ReturnHandlingHId == 0) {
      this.UpdateAppStep(AppStep);
    }
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
  }

  NextStep(Step) {
    if (Step == CommonConstant.AppStepUplDoc) {
      this.initDms();
    }
    this.ChangeTab(Step);
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.next();
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.next();
    }
    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      () => {
        this.spinner.show();
        setTimeout(() => { this.spinner.hide(); }, 1500);
      }
    )
  }

  CheckIsUseDms(){
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.NextStep(CommonConstant.AppStepUplDoc);
    }else{
      this.LastStepHandler();
    }
  }

  LastStepHandler() {
    if (this.ReturnHandlingHId > 0) {
      this.IsSavedTC = true;
    } else {
      let reqObj: SubmitNapObj = new SubmitNapObj();
      reqObj.AppId = this.NapObj.AppId;
      reqObj.WfTaskListId = this.wfTaskListId;
      let SubmitNapUrl = environment.isCore? URLConstant.SubmitNAPV2 : URLConstant.SubmitNAP;
      this.http.post(SubmitNapUrl, reqObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.Cancel();
        })
    }
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP2_PAGING], { BizTemplateCode: CommonConstant.CFNA });
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

      let EditReturnHandlingDUrl = environment.isCore ? URLConstant.EditReturnHandlingDV2 : URLConstant.EditReturnHandlingD;
      this.http.post(EditReturnHandlingDUrl, ReturnHandlingResult).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_NAP2_PAGING], { BizTemplateCode: CommonConstant.CFNA });
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

  claimTask(){
    if(environment.isCore){
        if(this.wfTaskListId!= "" && this.wfTaskListId!= undefined){
            this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
          }
        }
    else if (this.wfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
  }
}
