
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import Stepper from 'bs-stepper';
import { FormBuilder } from '@angular/forms';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html'
})
export class NapAddDetailComponent implements OnInit {
  @ViewChild('viewMainProd') ucViewMainProd: UcviewgenericComponent;
  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  NapObj: AppObj;
  ResponseReturnInfoObj: ReturnHandlingDObj;
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;

  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "APP": 2,
    "INVOICE": 3,
    // "COLL": 4,
    // "INS": 5,
    "FIN": 4,
    "TC": 5
  };

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private router: Router) {
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

  ngOnInit() {

    this.ClaimTask();
    this.AppStepIndex = 0;
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFctrMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
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

    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;

    let obj = {
      Id: this.appId
    }
    this.http.post(URLConstant.GetAppById, obj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.AppStepIndex = this.AppStep[response.AppCurrStep];
          this.stepper.to(this.AppStepIndex);
        } else {
          this.AppStepIndex = 0;
          this.stepper.to(this.AppStepIndex);
        }
      }
    );

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    this.MakeViewReturnInfoObj();
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_DLFN_PAGING], {});
  }

  MakeViewReturnInfoObj() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      let obj = {
        Id: this.appId,
        Code: CommonConstant.ReturnHandlingEditApp
      }
      this.http.post(URLConstant.GetReturnHandlingDByAppIdAndMrReturnTaskCode, obj).subscribe(
        (response: ReturnHandlingDObj) => {
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

      default:
        break;
    }
    this.ucViewMainProd.initiateForm();
  }

  NextStep(Step) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) => {
        this.ChangeTab(Step);
        this.stepper.next();
      }
    )
    this.ucViewMainProd.initiateForm();
  }
  LastStepHandler() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.SubmitNAP, this.NapObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_DLFN_PAGING], {});
      })
  }

  Submit() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      let obj = {
        ReturnHandlingDId: this.ResponseReturnInfoObj.ReturnHandlingDId,
        ReturnHandlingNotes: this.ResponseReturnInfoObj.ReturnHandlingNotes,
        ReturnHandlingExecNotes: this.FormReturnObj.value.ReturnExecNotes,
        RowVersion: this.ResponseReturnInfoObj.RowVersion
      };

      this.http.post(URLConstant.EditReturnHandlingD, obj).subscribe(
        (response) => {
        })
    }
  }
  ClaimTask() {
    let currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    let wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.ClaimTaskNap, wfClaimObj).subscribe(
      (response) => {

      });
  }

  GetCallback(ev) {
    if (ev.Key == "HighlightComment") {
      let link: string;
      let custObj = { CustNo: ev.ViewObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    } else {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
}
