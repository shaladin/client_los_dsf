import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResSysConfigResultObj } from '../../../shared/model/response/res-sys-config-result-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

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
  wfTaskListId: any;
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
  BizTemplateCode: string = CommonConstant.DF;
  readonly AppCurrStepNap2 = CommonConstant.AppCurrStepNap2;

  AppStep = {
    "NAPD": 1,
    "APP": 1,
    "INVOICE": 2,
    "FIN": 3,
    "TC": 4,
    "UPL_DOC": 5
  };

  ResponseReturnInfoObj: ReturnHandlingDObj;
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;
  dmsObj: DMSObj;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  appNo: string;
  isDmsReady: boolean = false;
  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_NAP2_PAGING;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService,
    private adInsHelperService: AdInsHelperService) {
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
  
  ngOnInit() {
    this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms }).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
      });

    this.ClaimTask();
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppDlfnMainInformation.json";
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

    this.stepper = new Stepper(document.querySelector("#stepper1"), {
      linear: false,
      animation: true,
    });

    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    
    let appObj = { Id: this.appId };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          if (this.ReturnHandlingHId > 0) {
            this.ChooseStep(this.AppStepIndex);
          } else {
            if (this.NapObj.AppCurrStep == CommonConstant.AppStepNapd) {
              this.NapObj.AppCurrStep = CommonConstant.AppStepApp;
              this.UpdateAppStep(this.NapObj.AppCurrStep);
            }
            this.AppStepIndex = this.AppStep[response.AppCurrStep];
            this.ChooseStep(this.AppStepIndex);
            if (response.AppCurrStep == CommonConstant.AppStepUplDoc) {
              this.initDms();
            }
          }
        } else {
          this.AppStepIndex = 0;
          this.ChooseStep(this.AppStepIndex);
        }
      }
    );

    this.MakeViewReturnInfoObj();
  }

  async initDms() {
    if (this.SysConfigResultObj.ConfigValue == '1') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      let appObj = { Id: this.appId };

      this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
        response => {
          if (response != null && ((response["CustNo"] != null && response["CustNo"] != "") || (response["ApplicantNo"] != null && response["ApplicantNo"] != ""))) {
            let trxNo;
            this.appNo = this.NapObj.AppNo;
            this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
            this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadDownloadView));
            let isExisting = response['IsExistingCust'];
            if (isExisting) {
              trxNo = response['CustNo'];
            }
            else {
              trxNo = response['ApplicantNo'];
            }
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, trxNo));

            let mouId = this.NapObj.MouCustId;
            console.log(this.NapObj.MouCustId);
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

      this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
        response => {
          this.appNo = this.NapObj.AppNo;
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadDownloadView));
          let isExisting = response['IsExistingCust'];
          if (isExisting) {
            let custNo = response['CustNo'];
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, custNo));
          }
          else {
            this.dmsObj.MetadataParent = null;
          }

          let mouId = this.NapObj.MouCustId;
          console.log(this.NapObj.MouCustId);
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

  async ChangeTab(AppStep: string) {
    if (this.ReturnHandlingHId == 0) {
      await this.UpdateAppStep(AppStep);
    }
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

    this.viewMainProd.initiateForm();
    //  this.ucViewMainProd.initiateForm();
  }

  async NextStep(Step) {
    if (Step == CommonConstant.AppStepUplDoc) {
      await this.initDms();
    }
    await this.ChangeTab(Step);
    this.stepper.next();
    // this.ucViewMainProd.initiateForm();
  }

  async UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    await this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).toPromise().then(
      (response) => {
      }
    )
  }

  LastStepHandler() {  //lmyn miripp
    this.NapObj.WfTaskListId = this.wfTaskListId;
    if (this.ReturnHandlingHId > 0) {
      this.IsSavedTC = true;
    } else {
      let SubmitNAPUrl = environment.isCore ? URLConstant.SubmitNAPV21 : URLConstant.SubmitNAP;
      this.http.post(SubmitNAPUrl, this.NapObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.Cancel();
        })
    }
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_MAIN_DATA_NAP2_PAGING], { BizTemplateCode: this.BizTemplateCode });
  }

  ClaimTask() {
    if (environment.isCore) {
      if (this.wfTaskListId != "" && this.wfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
      }
    }
    else if (this.wfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
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
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    } else {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  Submit() {
    if (this.ReturnHandlingHId > 0) {
      let ReturnHandlingResult: ReturnHandlingDObj = new ReturnHandlingDObj();
      ReturnHandlingResult.WfTaskListId = this.wfTaskListId;
      ReturnHandlingResult.ReturnHandlingHId = this.ResponseReturnInfoObj.ReturnHandlingHId;
      ReturnHandlingResult.ReturnHandlingDId = this.ResponseReturnInfoObj.ReturnHandlingDId;
      ReturnHandlingResult.MrReturnTaskCode = this.ResponseReturnInfoObj.MrReturnTaskCode;
      ReturnHandlingResult.ReturnStat = this.ResponseReturnInfoObj.ReturnStat;
      ReturnHandlingResult.ReturnHandlingNotes = this.ResponseReturnInfoObj.ReturnHandlingNotes;
      ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.controls['ReturnExecNotes'].value;
      ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

      let EditReturnHandlingDUrl = environment.isCore ? URLConstant.EditReturnHandlingDV2 : URLConstant.EditReturnHandlingD;
      console.log(ReturnHandlingResult);
      this.http.post(EditReturnHandlingDUrl, ReturnHandlingResult).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_NAP2_PAGING], { BizTemplateCode: this.BizTemplateCode });
        }
      )
    }
  }

}
