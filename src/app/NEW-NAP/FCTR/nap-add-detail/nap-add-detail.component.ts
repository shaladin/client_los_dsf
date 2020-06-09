import { Component, OnInit } from '@angular/core';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import Stepper from 'bs-stepper';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html',
  styleUrls: ['./nap-add-detail.component.scss']
})
export class NapAddDetailComponent implements OnInit {

  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  viewProdMainInfoObj: string;
  NapObj: AppObj;
  ResponseReturnInfoObj: any;
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  ListAsset: any;

  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "APP": 2,
    "INVOICE": 3,
    "COLL": 4,
    "INS": 5,
    "FIN": 6,
    "TC": 7
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
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    this.http.post(AdInsConstant.GetAppById, this.NapObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.AppStepIndex = this.AppStep[response.AppCurrStep];
          this.stepper.to(this.AppStepIndex);
          console.log(this.AppStepIndex);
        } else {
          this.AppStepIndex = 0;
          this.stepper.to(this.AppStepIndex);
          console.log(this.AppStepIndex);
        }
      }
    );

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    this.MakeViewReturnInfoObj();
  }

  MakeViewReturnInfoObj() {
    if (this.mode == AdInsConstant.ModeResultHandling) {
      var obj = {
        AppId: this.appId,
        MrReturnTaskCode: AdInsConstant.ReturnHandlingEditApp
      }
      this.http.post(AdInsConstant.GetReturnHandlingDByAppIdAndMrReturnTaskCode, obj).subscribe(
        (response) => {
          this.ResponseReturnInfoObj = response;
          this.FormReturnObj.patchValue({
            ReturnExecNotes: this.ResponseReturnInfoObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  CheckMultiAsset() {
    var appObj = { AppId: this.appId }
    this.http.post(AdInsConstant.GetAppAssetListByAppId, appObj).subscribe(
      (response) => {
        this.ListAsset = response['ReturnObject'];
        if (this.ListAsset != undefined && this.ListAsset != null) {
          if (this.ListAsset.length > 1)
            this.IsMultiAsset = true;
          else
            this.IsMultiAsset = false;
        }
        else
          this.IsMultiAsset = false;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  ChangeTab(AppStep) {
    // console.log(AppStep);
    switch (AppStep) {
      case AdInsConstant.AppStepCust:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepCust];
        break;
      case AdInsConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepApp];
        break;
        case AdInsConstant.AppStepInvoice:
          this.AppStepIndex = this.AppStep[AdInsConstant.AppStepInvoice];
          break;
      case AdInsConstant.AppStepColl:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepColl];
        break;
      case AdInsConstant.AppStepIns:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepIns];
        break;
      case AdInsConstant.AppStepFin:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepFin];
        break;
      case AdInsConstant.AppStepTC:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepTC];
        break;
        case "SUBMIT":
          this.router.navigate(["Nap/FinanceLeasing/Paging?BizTemplateCode=FL4W"], { queryParams: { BizTemplateCode: AdInsConstant.FL4W } });
          break;
      default:
        break;
    }
  }

  NextStep(Step) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(AdInsConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) => {
        console.log("Step Change to, Curr Step : " + response.AppCurrStep + ", Last Step : " + response.AppLastStep);
        this.ChangeTab(Step);
        this.stepper.next();
      },
      (error) => {
        console.error("Error when updating AppStep");
        console.error(error);
      }
    )
  }
  LastStepHandler() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    
    this.http.post(AdInsConstant.SubmitNAP, this.NapObj).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(["/Nap/ConsumerFinance/Paging"], { queryParams: { LobCode: "CF4W" } })
      },
      (error) => {
        console.log(error);
      }
    )
  }

  Submit() {
    this.ClaimTask();
    if (this.mode == AdInsConstant.ModeResultHandling) {
      var obj = {
        ReturnHandlingDId: this.ResponseReturnInfoObj.ReturnHandlingDId,
        ReturnHandlingNotes: this.ResponseReturnInfoObj.ReturnHandlingNotes,
        ReturnHandlingExecNotes: this.FormReturnObj.value.ReturnExecNotes,
        RowVersion: this.ResponseReturnInfoObj.RowVersion
      };

      this.http.post(AdInsConstant.EditReturnHandlingD, obj).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }
  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext["UserName"];
    wfClaimObj.WfTaskListId = this.wfTaskListId;
    this.http.post(AdInsConstant.ClaimTaskNap, wfClaimObj).subscribe(
      (response) => {

      });
  }
}