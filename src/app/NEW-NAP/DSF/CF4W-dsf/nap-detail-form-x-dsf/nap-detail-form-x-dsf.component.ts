import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { ResReturnHandlingDObj } from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/dms-label-value-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { SubmitNapObj } from 'app/shared/model/generic/submit-nap-obj.model';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
@Component({
  selector: 'app-nap-detail-form-x-dsf',
  templateUrl: './nap-detail-form-x-dsf.component.html',
  styleUrls: ['./nap-detail-form-x-dsf.component.css'],
  providers: [NGXToastrService]
})
export class NapDetailFormXDsfComponent implements OnInit {

  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: any;
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  IsMultiAsset: string;
  ListAsset: Array<AppAssetObj>;
  ReturnHandlingHId: number = 0;
  showCancel: boolean = true;
  custType: string = CommonConstant.CustTypeCompany;
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IsLastStep: boolean = false;
  IsSavedTC: boolean = false;
  IsDataReady: boolean = false;
  bizTemplateCode: string;
  IsShowMultiReferantor: number = 0;
  readonly AppCurrStepNap2 = CommonConstant.AppCurrStepNap2;

  AppStep = {
    "NAPD": 1,
    "REF": 1,
    "APP": 2,
    "ASSET": 3,
    "INS": 4,
    "LFI": 5,
    "FIN": 6,
    "TC": 7,
    "UPL_DOC": 8
  };

  ResponseReturnInfoObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;
  dmsObj: DMSObj;
  appNo: string;
  isDmsReady: boolean = false;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_NAP2_PAGING;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
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

  async ngOnInit() : Promise<void> {
    // check DMS
    await this.GetGSValueShowRferantor();
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
      });
    this.claimTask();
    this.AppStepIndex = 1;
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;

    // this.ChangeStepper();

    await this.http.post(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
      async (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          if (this.NapObj.MrCustTypeCode != null)
            this.custType = this.NapObj.MrCustTypeCode;
          this.bizTemplateCode = this.NapObj.BizTemplateCode;
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
      this.ChangeStepper();
      if (this.NapObj.AppCurrStep == CommonConstant.AppStepNapd) {
        this.NapObj.AppCurrStep = CommonConstant.AppStepRef;
        this.UpdateAppStep(this.NapObj.AppCurrStep);
      }
      this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
      this.ChooseStep(this.AppStepIndex);
    }
    this.IsDataReady = true;
    this.MakeViewReturnInfoObj();
    

  }
  async GetGSValueShowRferantor() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GsCodeIsShowMultiReferantor }).toPromise().then(
      (response) => {
        this.IsShowMultiReferantor = parseInt(response.GsValue);
      });
  }

  async initDms() {
    if (this.SysConfigResultObj.ConfigValue == '1') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      var appObj = { Id: this.appId };
      await this.http.post(URLConstant.GetAppCustByAppId, appObj).toPromise().then(
        async (response) => {
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
            if (mouId != null && mouId != 0) {
              let mouObj = { Id: mouId };
              await this.http.post(URLConstant.GetMouCustById, mouObj).toPromise().then(
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
        "ASSET": 3,
        "INS": 4,
        "LFI": 5,
        "FIN": 6,
        "TC": 7,
        "UPL_DOC": 8
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
        "UPL_DOC": 7
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
        (response: ResReturnHandlingDObj) => {
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
        this.ListAsset = response[CommonConstant.ReturnObj];
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

    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  async NextStep(Step) {
    if (this.AppStepIndex == this.AppStep[CommonConstant.AppStepApp]) {
      const appObj = { Id: this.appId };
      this.http.post(URLConstant.GetAppById, appObj).subscribe(
        (response: AppObj) => {
          if (response) {
            this.NapObj = response;
          }
        }
      );
    }
    if (Step == CommonConstant.AppStepUplDoc) {
      await this.initDms();
    }else if(Step == CommonConstant.AppStepIns){
      let ReqByIdObj = new GenericObj();
      ReqByIdObj.Id = this.appId;
      this.http.post(URLConstant.CalculateTotalAssetPriceAndDownPayment, ReqByIdObj).subscribe(
        (response) => {
        })
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
      (response) => {
      }
    )
  }

  CheckIsUseDms() {
    if (this.SysConfigResultObj.ConfigValue == '1') {
      this.NextStep(CommonConstant.AppStepUplDoc);
    } else {
      this.LastStepHandler();
    }
  }

  LastStepHandler() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    if (this.ReturnHandlingHId > 0) {
      this.IsSavedTC = true;
    } else {
      let reqObj: SubmitNapObj = new SubmitNapObj();
      reqObj.AppId = this.NapObj.AppId;
      reqObj.WfTaskListId = this.wfTaskListId;

      let SubmitNAPUrl = environment.isCore ? URLConstant.SubmitNAPV21 : URLConstant.SubmitNAP;
      this.http.post(SubmitNAPUrl, reqObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP2_PAGING], { BizTemplateCode: this.bizTemplateCode });

        })
    }
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP2_PAGING], { BizTemplateCode: this.bizTemplateCode });
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
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_NAP2_PAGING], { BizTemplateCode: CommonConstant.CF4W });
        }
      )
    }
  }

  CheckCustType(ev: string) {
    this.custType = ev;
    this.ChangeStepper();
    this.NextStep(CommonConstant.AppStepGuar);
  }

  claimTask() {
    if (environment.isCore) {
      if (this.wfTaskListId != "" && this.wfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
      }
    }
    else if (this.wfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
  }

}
