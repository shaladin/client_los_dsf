import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-nap-cust-main-data',
  templateUrl: './nap-cust-main-data.component.html'
})
export class NapCustMainDataComponent implements OnInit {

  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  viewReturnInfoObj: string = "";
  MrCustTypeCode: string = "PERSONAL";
  NapObj: AppObj = new AppObj();
  IsMultiAsset: string;
  ListAsset: any;
  isMarried: boolean = false;
  bizTemplateCode: string;
  appCustId: number = 0;
  
  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "FAM": 2,
    "SHR": 3,
    "GUAR": 4,
  };

  ResponseReturnInfoObj;
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.mode = params["Mode"];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
    });
  }

  ngOnInit() {
    this.ClaimTask();
    this.AppStepIndex = 0; 
    this.NapObj.AppId = this.appId;
    this.http.post(URLConstant.GetAppById, this.NapObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          this.bizTemplateCode = this.NapObj.BizTemplateCode;
          this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
          this.stepper.to(this.AppStepIndex);
        }
        else {
          this.AppStepIndex = 0;
        }
      }
    );

    this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, this.NapObj).subscribe(
      (response) => {
        if (response.AppCustObj) 
        {
          this.MrCustTypeCode = response.AppCustObj.MrCustTypeCode;
          this.appCustId = response.AppCustObj.AppCustId;
          this.isMarried = response.AppCustPersonalObj != undefined && response.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried ? true : false;
        }
      }
    );

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
    this.MakeViewReturnInfoObj();
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router,["/Nap/MainData/NAP1/Paging"], { "BizTemplateCode": this.bizTemplateCode });
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

  ChangeTab(AppStep) {
    switch (AppStep) {
      case CommonConstant.AppStepCust:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepCust];
        break;
      case CommonConstant.AppStepFamily:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepFamily];
        break;
      case CommonConstant.AppStepGuar:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepGuar];
        break;
      case CommonConstant.AppStepShr:
          this.AppStepIndex = this.AppStep[CommonConstant.AppStepShr];
        break;
      default:
        break;
    }
    this.viewAppMainInfo.ReloadUcViewGeneric();
    this.NextStep(AppStep, true);
  }

  getEvent(event) {
    this.isMarried = event.MrMaritalStatCode != undefined && event.MrMaritalStatCode == 'MARRIED'? true : false;
    this.MrCustTypeCode = event.MrCustTypeCode != undefined? event.MrCustTypeCode : CommonConstant.CustTypePersonal;
    this.NextStep(this.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.AppStepFamily : CommonConstant.AppStepShr);
    
    //Fix untuk data kosong saat kembai ke step cust jika save new cust
    if(!this.appCustId){
      this.http.post(URLConstant.GetAppCustMainDataByAppId, this.NapObj).subscribe(
        (response) => {
          if (response['AppCustObj']){
            this.MrCustTypeCode = response['AppCustObj']['MrCustTypeCode'];
            this.appCustId = response['AppCustObj'].AppCustId;
            this.isMarried = response['AppCustPersonalObj'] != undefined && response['AppCustPersonalObj'].MrMaritalStatCode == 'MARRIED'? true : false;
          }
        }
      );
    }
  }

  async NextStep(Step, IsChangeByUser: boolean = false) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).toPromise().then(
      async (response) => {
        if(!IsChangeByUser) await this.ChangeTab(Step);
        this.stepper.to(this.AppStepIndex);
      }
    )
  }

  LastStep(){
    this.NapObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.SubmitNapCustMainData, this.NapObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router,["/Nap/MainData/NAP1/Paging"], { "BizTemplateCode": this.bizTemplateCode });
      }
    );
  }

  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.WfTaskListId = this.wfTaskListId;

    this.http.post(URLConstant.ClaimTaskNapCustmainData, wfClaimObj).subscribe(
      () => {
      });
  }
}