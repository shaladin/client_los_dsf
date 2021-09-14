import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResponseAppCustCompletionPersonalDataObj } from 'app/shared/model/ResponseAppCustCompletionPersonalDataObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import Stepper from 'bs-stepper';
import { AppCustCompletionCheckingObj } from 'app/shared/model/AppCustCompletionCheckingObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import {DMSObj} from 'app/shared/model/DMS/DMSObj.Model';
import {AdInsHelper} from 'app/shared/AdInsHelper';
import {DMSLabelValueObj} from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import {ExceptionConstant} from 'app/shared/constant/ExceptionConstant';
import {ResSysConfigResultObj} from 'app/shared/model/Response/ResSysConfigResultObj.model';
import {CookieService} from 'ngx-cookie';
import {AppObj} from 'app/shared/model/App/App.Model';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-cust-completion-detail-personal-x',
  templateUrl: './cust-completion-detail-personal-x.component.html'
})
export class CustCompletionDetailPersonalXComponent implements OnInit {

  @ViewChild('viewMainInfo') ucViewMainProd: UcviewgenericComponent;
  AppId: number;
  AppCustId: number;
  WfTaskListId: number;
  AppCustPersonalId: number;
  stepIndex: number = 1;
  CustModelCode: string;
  IsMarried: boolean = false;
  private stepper: Stepper;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  IsCompletion: boolean = false;
  isCompleteCustStep: object = {};
  CustStep = {
    "Detail": 1,
    "Address": 2,
    "Family": 3,
    "Job": 4,
    "Emergency": 5,
    "Financial": 6,
    "CustAsset": 7,
    "Other": 8,
    "UplDoc": 9
  }
  ValidationMessages = {
    "Detail": "Please complete required data in tab \"Customer Detail\"",
    "Address": "Please add Legal & Residence Address in tab \"Address Information\"",
    "Family": "Please complete required data in tab \"Family\"",
    "Job": "Please complete required data in tab \"Job Data\"",
    "Emergency": "Please complete required data in tab \"Emergency Contact\"",
    "Financial": "Please complete required data in tab \"Financial Data\"",
    "Other": "Please complete required data in tab \"Other Attribute\"",
    "UplDoc": "Please complete required data in tab \"Upload Document\"",
  }
  ReturnHandlingHId: number = 0;

  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  dmsObj: DMSObj;
  isDmsReady = false;
  CustNo: string;

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
      if (params['AppCustId'] != null) {
        this.AppCustId = params['AppCustId'];
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
      }
    });
  }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustCompletionPersonalData.json";

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    const awaitAppCustComplPersData = this.http.post<ResponseAppCustCompletionPersonalDataObj>(URLConstant.GetAppCustAndAppCustPersonalDataByAppCustId, { Id: this.AppCustId }).toPromise().then(
      (response) => {
        if (response.AppCustPersonalObj.MrMaritalStatCode != null && response.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried) this.IsMarried = true;
        this.CustModelCode = response.AppCustObj.MrCustModelCode;
        this.AppCustPersonalId = response.AppCustPersonalObj.AppCustPersonalId;
        this.IsCompletion = response.AppCustObj.IsCompletion;
        this.CustNo = response.AppCustObj.CustNo;
      }
    );
    const awaitResSysConfResult = this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms }).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
      });

    await forkJoin([awaitAppCustComplPersData,awaitResSysConfResult]);

    // set default isComplete untuk all step ke false jika belum ada defaultnya
    Object.keys(this.CustStep).forEach(stepName => {
      if (typeof (this.isCompleteCustStep[stepName]) == 'undefined') this.isCompleteCustStep[stepName] = false;
    });
  }

  async initDms() {
    if (this.SysConfigResultObj.ConfigValue == '1') {
      const currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj = new DMSObj();
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeCust;
      this.dmsObj.MetadataParent = null;
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.CustNo));
      this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
    }
    this.isDmsReady = true
  }

  Back() {
    if (this.ReturnHandlingHId != 0) {
      this.router.navigate([NavigationConstant.NAP_CUST_COMPL_DETAIL], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId, "ReturnHandlingHId": this.ReturnHandlingHId} });
    }
    else {
      this.router.navigate([NavigationConstant.NAP_CUST_COMPL_DETAIL], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId} });
    }
  }

  EnterTab(type: string) {
    const tab = this.CustStep[type];
    if(tab!=null){
      this.stepIndex = tab;
      if(tab==this.CustStep['UplDoc']){
        this.initDms();
      }
    }
    this.stepper.to(this.stepIndex);
  }

  GetEvent(event: any, Step: string) {
    if (event != null) {

      // set isComplete currStep jika ada event nya
      if (typeof (event.IsComplete) != 'undefined') {
        Object.keys(this.CustStep).forEach(stepName => {
          if (this.CustStep[stepName] == this.stepIndex)
            this.isCompleteCustStep[stepName] = event.IsComplete;
        });
      }
      if (event.Key == "Detail") {
        this.CustModelCode = event.CustModelCode;
      }
    }
    if (Step == 'Save') {
      this.Save();
    }
    else {
      this.EnterTab(Step);
      this.ucViewMainProd.initiateForm();
    }
  }
  completionCheckingObj: AppCustCompletionCheckingObj = new AppCustCompletionCheckingObj();
  Save() {
    this.http.post(URLConstant.SaveAppCustCompletion, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.completionCheckingObj.IsCompleted = response["IsCompleted"];
        this.completionCheckingObj.InCompletedStep = response["InCompletedStep"];
        if (this.completionCheckingObj.IsCompleted != true) {
          let errorMsg = typeof this.ValidationMessages[this.completionCheckingObj.InCompletedStep] != 'undefined' ? this.ValidationMessages[this.completionCheckingObj.InCompletedStep] : 'To continue please click "Save & Continue" in tab ' + this.completionCheckingObj.InCompletedStep;
          this.toastr.warningMessage(errorMsg);
          this.EnterTab(this.completionCheckingObj.InCompletedStep);
        }
        else {
          this.toastr.successMessage(response["message"]);
          this.Back();
        }

      },
      (error) => {
        console.log(error);
      }
    )
  }
}
