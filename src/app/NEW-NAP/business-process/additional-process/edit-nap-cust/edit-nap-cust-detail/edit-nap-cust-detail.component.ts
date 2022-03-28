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
import { AppObj } from 'app/shared/model/app/app.model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/response-app-cust-main-data-obj.model';
import Stepper from 'bs-stepper';
import { SubmitNapObj } from 'app/shared/model/generic/submit-nap-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit-nap-cust-detail',
  templateUrl: './edit-nap-cust-detail.component.html'
})
export class EditNapCustDetailComponent implements OnInit {

  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  viewReturnInfoObj: string = "";
  MrCustTypeCode: string = "PERSONAL";
  NapObj: AppObj = new AppObj();
  isMarried: boolean = false;
  bizTemplateCode: string;
  appCustId: number = 0;
  IsViewReady: boolean = false;
  isEditNap1: boolean = true;

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
    private toastr: NGXToastrService, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
    });
  }

  async ngOnInit() {
    //save edit nap 1 log should be here
    await this.SaveEditNapCust();
    this.NapObj.AppId = this.appId;
    var appObj = { Id: this.appId };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response: AppObj) => {
        this.NapObj = response;
        this.bizTemplateCode = this.NapObj.BizTemplateCode;
        this.IsViewReady = true;
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
    await this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, reqObj).toPromise().then(
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
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_EDIT_NAP_CUST_PAGING], { "BizTemplateCode": this.bizTemplateCode });
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
    
    //Fix untuk data kosong saat kembali ke step cust jika save new cust
    if (!this.appCustId) {
      await this.GetCustMainData();
    }
  }

  async NextStep(Step) {
    this.NapObj.AppCurrStep = Step;
    await this.ChangeTab(Step);
    this.stepper.to(this.AppStepIndex);
    this.viewAppMainInfo.ReloadUcViewGeneric();
  }

  LastStep() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_EDIT_NAP_CUST_PAGING], { "BizTemplateCode": this.bizTemplateCode });
  }

  async SaveEditNapCust() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.appId;
    await this.http.post<ResponseAppCustMainDataObj>(URLConstant.AddEditNapCust, reqObj).toPromise().then(
      (response) => {
      }
    );
  }

}
