import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { ResponseAppCustMainDataObj } from 'app/shared/model/response-app-cust-main-data-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';

@Component({
  selector: 'app-nap-cust-main-data-dsf',
  templateUrl: './nap-cust-main-data-dsf.component.html',
  styleUrls: ['./nap-cust-main-data-dsf.component.css']
})
export class NapCustMainDataDsfComponent implements OnInit {

  private ucViewMainProd: UcviewgenericComponent;

  @ViewChild('viewMainProd') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucViewMainProd = content;
    }
  }
  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: any;
  mode: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  viewReturnInfoObj: string = "";
  MrCustTypeCode: string = "PERSONAL";
  NapObj: AppObj = new AppObj();
  IsMultiAsset: string;
  isMarried: boolean = false;
  bizTemplateCode: string;
  appCustId: number = 0;
  from: string;

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
    private toastr: NGXToastrService,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService,
    private adInsHelperService: AdInsHelperService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.mode = params["Mode"];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
      else{
        this.wfTaskListId = environment.isCore ? "" : 0;
      }
      if (params["from"] != null) {
        this.from = params["from"];
      }
    });
  }

  ngOnInit() {
    this.ClaimTask();
    this.AppStepIndex = 0;
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformationDF.json";
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

    this.NapObj.AppId = this.appId;
    let obj = {
      Id: this.appId
    }
    this.http.post(URLConstant.GetAppById, obj).subscribe(
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

    obj = {
      Id: this.NapObj.AppId
    }

    this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, obj).subscribe(
      (response) => {
        if (response.AppCustObj) {
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
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP1_PAGING_X], { "BizTemplateCode": this.bizTemplateCode });
  }

  MakeViewReturnInfoObj() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      let obj = {
        Id: this.appId,
        Code: CommonConstant.ReturnHandlingEditApp
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
    this.ucViewMainProd.initiateForm();
    //this.NextStep(AppStep, true);
  }

  getEvent(event) {
    this.isMarried = event.MrMaritalStatCode != undefined && event.MrMaritalStatCode == 'MARRIED' ? true : false;
    this.MrCustTypeCode = event.MrCustTypeCode != undefined ? event.MrCustTypeCode : CommonConstant.CustTypePersonal;
    this.NextStep(this.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.AppStepFamily : CommonConstant.AppStepShr);

    let obj = {
      Id: this.NapObj.AppId
    }
    if (!this.appCustId) {
      this.http.post(URLConstant.GetAppCustMainDataByAppId, obj).subscribe(
        (response) => {
          if (response['AppCustObj']) {
            this.MrCustTypeCode = response['AppCustObj']['MrCustTypeCode'];
            this.appCustId = response['AppCustObj'].AppCustId;
            this.isMarried = response['AppCustPersonalObj'] != undefined && response['AppCustPersonalObj'].MrMaritalStatCode == 'MARRIED' ? true : false;
          }
        }
      );
    }
  }

  async NextStep(Step, IsChangeByUser: boolean = false) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).toPromise().then(
      async (response) => {
        if (!IsChangeByUser) await this.ChangeTab(Step);
        this.stepper.to(this.AppStepIndex);
      }
    )
  }

  LastStep() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    let SubmitNapCustMainDataUrl = environment.isCore ? URLConstant.SubmitNapCustMainDataV2 : URLConstant.SubmitNapCustMainData;
    this.http.post(SubmitNapCustMainDataUrl, this.NapObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP1_PAGING_X], { "BizTemplateCode": this.bizTemplateCode });
      }
    );
  }

  ClaimTask() {
    if(environment.isCore){
      this.claimTaskService.ClaimTaskNapCustMainDataV2(this.appId, this.wfTaskListId);
    }else{
      this.claimTaskService.ClaimTaskNapCustMainData(this.appId, this.wfTaskListId);
    }
  }

  // GetCallback(ev) {
  //   AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
  // }

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

}
