import { Component, OnInit, ViewChild } from '@angular/core';
import { AppObj } from 'app/shared/model/apps/apps.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Stepper from 'bs-stepper';
import { FormBuilder } from '@angular/forms';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResponseAppCustMainDataObj } from 'app/shared/model/response-app-cust-main-data-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { SubmitNapObj } from 'app/shared/model/generic/submit-nap-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { ResReturnHandlingDObj } from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html'
})
export class NapAddDetailComponent implements OnInit {
  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;

  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  NapObj: AppObj;
  ResponseReturnInfoObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  custType: string = CommonConstant.CustTypePersonal;
  isMainCustMarried: boolean = false;
  stepperMode: string = CommonConstant.CustTypePersonal;


  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "FAM": 2,
    "SHR": 2,
    "GUAR": 3,
    "APP": 4,
    "INVOICE": 5,
    // "COLL": 6,
    // "INS": 7,
    "FIN": 6,
    "TC": 7,
    "UPL_DOC": 8
  };
  dmsObj: DMSObj;
  appNo: string;
  isDmsReady: boolean = false;
  IsDataReady: boolean = false;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();

  readonly CancelLink: string = NavigationConstant.BACK_TO_PAGING2;
  readonly BackLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_EDIT_APP_PAGING;
  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private toastr: NGXToastrService, private claimTaskService: ClaimTaskService) {
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

  async ngOnInit(): Promise<void> {
    //check DMS
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms }).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
    });
    this.claimTaskService.ClaimTask(this.wfTaskListId);
    this.AppStepIndex = 0;
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    let appObj = { Id: this.appId };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response: AppObj) => {
        this.NapObj = response;
        if (this.NapObj.MrCustTypeCode != null)
          this.custType = this.NapObj.MrCustTypeCode;

        if (response.AppCurrStep == CommonConstant.AppStepUplDoc) {
          this.initDms();
        }
        this.ChangeStepper();
        this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
        this.ChooseStep(this.AppStepIndex);
        this.IsDataReady = true;
      }
    );

    await this.GetCustMainData();

    this.MakeViewReturnInfoObj();
  }

  async GetCustMainData() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.appId;
    this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, reqObj).subscribe(
      (response) => {
        if (response.AppCustObj) {
          this.isMainCustMarried = response.AppCustPersonalObj != undefined && response.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried ? true : false;
        }
      }
    );
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
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany = new Stepper(document.querySelector('#stepperCompany'), {
        linear: false,
        animation: true
      });
      this.stepperMode = CommonConstant.CustTypeCompany;
      document.getElementById('stepperPersonal').style.display = 'none';
      document.getElementById('stepperCompany').style.display = 'block';
    }
  }

  ChooseStep(idxStep: number) {
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.to(idxStep);
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.to(idxStep);
    }
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
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_PAGING], {});
  }

  MakeViewReturnInfoObj() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.appId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingEditApp;
      this.http.post(URLConstant.GetReturnHandlingDByAppIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
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
    let appObj = { Id: this.appId }
    this.http.post(URLConstant.GetAppAssetListByAppId, appObj).subscribe(
      (response) => {
        let ListAsset = response['ReturnObject'];
        if (ListAsset != undefined && ListAsset != null) {
          if (ListAsset.length > 1)
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
      case CommonConstant.AppStepFamily:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepFamily];
        break;
      case CommonConstant.AppStepShr:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepShr];
        break;
      case CommonConstant.AppStepGuar:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepGuar];
        break;
      case CommonConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepApp];
        break;
      case CommonConstant.AppStepInvoice:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepInvoice];
        break;
      // case CommonConstant.AppStepColl:
      //   this.AppStepIndex = this.AppStep[CommonConstant.AppStepColl];
      //   break;
      // case CommonConstant.AppStepIns:
      //   this.AppStepIndex = this.AppStep[CommonConstant.AppStepIns];
      //   break;
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
    this.UpdateAppStep(Step);

    if (Step == CommonConstant.AppStepUplDoc) {
      this.initDms();
    }

    this.ChangeTab(Step);
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.next();
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.next();
    }
  }

  UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    if (Step == CommonConstant.AppStepUplDoc) {
      this.initDms();
    }
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
    let reqObj: GenericObj = new GenericObj();
    reqObj.TrxNo = this.appNo;
    this.http.post(URLConstant.CreateWorkflowDuplicateCheck, reqObj).subscribe(
      (response) => {
        let reqObj: SubmitNapObj = new SubmitNapObj();
        reqObj.AppId = this.NapObj.AppId;
        reqObj.WfTaskListId = this.wfTaskListId;
        this.http.post(URLConstant.SubmitNAP, reqObj).subscribe(
          (response) => {
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_PAGING], {});
          })
      }
    );
  }

  Submit() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      let ReturnHandlingResult: ReturnHandlingDObj = new ReturnHandlingDObj();
      ReturnHandlingResult.WfTaskListId = this.wfTaskListId;
      ReturnHandlingResult.ReturnHandlingHId = this.ResponseReturnInfoObj.ReturnHandlingHId;
      ReturnHandlingResult.ReturnHandlingDId = this.ResponseReturnInfoObj.ReturnHandlingDId;
      ReturnHandlingResult.MrReturnTaskCode = this.ResponseReturnInfoObj.MrReturnTaskCode;
      ReturnHandlingResult.ReturnStat = this.ResponseReturnInfoObj.ReturnStat;
      ReturnHandlingResult.ReturnHandlingNotes = this.ResponseReturnInfoObj.ReturnHandlingNotes;
      ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.value.ReturnExecNotes;
      ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

      this.http.post(URLConstant.EditReturnHandlingD, ReturnHandlingResult).subscribe(
        () => {
        })
    }
  }

  CheckCustType(ev) {
    this.isMainCustMarried = ev.MrMaritalStatCode != undefined && ev.MrMaritalStatCode == 'MARRIED' ? true : false;
    this.custType = ev.MrCustTypeCode != undefined ? ev.MrCustTypeCode : CommonConstant.CustTypePersonal;
    this.ChangeStepper();
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.NextStep(CommonConstant.AppStepFamily);
    } else {
      this.NextStep(CommonConstant.AppStepShr);
    }
  }
}
