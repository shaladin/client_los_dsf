import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import Stepper from 'bs-stepper';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/response-app-cust-main-data-obj.model';
import { SubmitNapObj } from 'app/shared/model/generic/submit-nap-obj.model';

@Component({
  selector: 'app-nap-cust-main-data-x',
  templateUrl: './nap-cust-main-data-x.component.html'
})
export class NapCustMainDataXComponent implements OnInit {

  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  copyAppId: number = null;
  wfTaskListId: any;
  mode: string;
  viewReturnInfoObj: string = "";
  MrCustTypeCode: string = "PERSONAL";
  NapObj: AppObj = new AppObj();
  IsMultiAsset: string;
  isMarried: boolean = false;
  bizTemplateCode: string;
  appCustId: number = 0;
  from:string;
  IsViewReady: boolean = false;
  lobCode: string;
  isNonMandatory: boolean;
  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;

  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "FAM": 2,
    "SHR": 3,
    "GUAR": 4,
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService, 
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.mode = params["Mode"];
      }
      if (params["CopyAppId"] != null) {
        this.copyAppId = params["CopyAppId"];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }else{
        this.wfTaskListId = environment.isCore ? "" : 0;
      }
      if(params["from"]!= null)
      {
        this.from = params["from"];
      }
    });
  }

  async ngOnInit() {
  if(environment.isCore){
    this.claimTaskService.ClaimTaskNapCustMainDataV2(this.appId, this.wfTaskListId);
  }else{
    this.claimTaskService.ClaimTaskNapCustMainData(this.appId, this.wfTaskListId);
  }
    this.AppStepIndex = 0;
    this.NapObj.AppId = this.appId;
    var appObj = { Id: this.appId };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          this.bizTemplateCode = this.NapObj.BizTemplateCode;          
          this.lobCode = this.NapObj.LobCode;          
          if(this.lobCode == 'CF' || 
            this.lobCode == 'LF'  || 
            this.lobCode == 'SLB' || 
            this.lobCode == 'MPF' || 
            this.lobCode == 'FD')
          {
            this.isNonMandatory = true
          }else {
            this.isNonMandatory = false;
          }
          this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
          this.stepper.to(this.AppStepIndex);
          this.IsViewReady = true;
        }
        else {
          this.AppStepIndex = 0;
          this.IsViewReady = true;
        }
      }
    );

    await this.GetCustMainData();

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
    // this.MakeViewReturnInfoObj();
  }

  async GetCustMainData() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.appId;
    if(this.copyAppId != null) {
      reqObj.Id = this.copyAppId;
    }
    this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, reqObj).subscribe(
      (response) => {
        if (response.AppCustObj) {
          this.MrCustTypeCode = response.AppCustObj.MrCustTypeCode;
          this.appCustId = response.AppCustObj.AppCustId;
          this.isMarried = response.AppCustPersonalObj != undefined && response.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried ? true : false;
        }
      }
    );
  }
  
  Back() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_MAIN_DATA_NAP1_PAGING], { "BizTemplateCode": this.bizTemplateCode });
    
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
  }

  async getEvent(event) {
    this.isMarried = event.MrMaritalStatCode != undefined && event.MrMaritalStatCode == 'MARRIED' ? true : false;
    this.MrCustTypeCode = event.MrCustTypeCode != undefined ? event.MrCustTypeCode : CommonConstant.CustTypePersonal;
    this.NextStep(this.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.AppStepFamily : CommonConstant.AppStepShr);

    //Fix untuk data kosong saat kembai ke step cust jika save new cust
    if (!this.appCustId) {
      await this.GetCustMainData();
    }
  }

  async NextStep(Step) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).toPromise().then(
      async (response) => {
        await this.ChangeTab(Step);
        this.stepper.to(this.AppStepIndex);
      }
    )
    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  LastStep() {
    let reqObj: SubmitNapObj = new SubmitNapObj();
    reqObj.AppId = this.NapObj.AppId;
    reqObj.WfTaskListId = this.wfTaskListId;
    reqObj.AppNo = this.NapObj.AppNo;
    reqObj.BizTemplateCode = this.NapObj.BizTemplateCode;
    reqObj.OriOfficeCode = this.NapObj.OriOfficeCode;
    let SubmitNapCustMainDataUrl = environment.isCore ? URLConstantX.SubmitNapCustMainDataV2 : URLConstant.SubmitNapCustMainData;
    this.http.post(SubmitNapCustMainDataUrl, reqObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_MAIN_DATA_NAP1_PAGING], { "BizTemplateCode": this.bizTemplateCode });
      }
    );
  }

}
