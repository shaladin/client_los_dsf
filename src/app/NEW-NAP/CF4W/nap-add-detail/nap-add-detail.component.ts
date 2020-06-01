import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html',
  providers: [NGXToastrService]
})
export class NapAddDetailComponent implements OnInit {

  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  viewProdMainInfoObj: string;
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  IsMultiAsset: string;
  ListAsset: any;
  ReturnHandlingHId : number = 0;

  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "GUAR": 2,
    "REF": 3,
    "APP": 4,
    "ASSET": 5,
    "INS": 6,
    "LFI": 7,
    "FIN": 8,
    "TC": 9,
  };

  ResponseReturnInfoObj : ReturnHandlingDObj;
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.CheckMultiAsset();
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
      if(params["ReturnHandlingHId"] != null){
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
      }
    });
  }

  ngOnInit() {
    this.ClaimTask();
    this.AppStepIndex = 1;
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    if(this.ReturnHandlingHId > 0 ){
      this.stepper.to(this.AppStepIndex);
    }else{
      this.http.post(AdInsConstant.GetAppById, this.NapObj).subscribe(
        (response: AppObj) => {
          if (response) {
            this.NapObj = response;
            this.AppStepIndex = this.AppStep[response.AppCurrStep];
            this.stepper.to(this.AppStepIndex);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    this.MakeViewReturnInfoObj();
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      var obj = {
        ReturnHandlingHId: this.ReturnHandlingHId,
        MrReturnTaskCode: AdInsConstant.ReturnHandlingEditApp
      }
      this.http.post<ReturnHandlingDObj>(AdInsConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(
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
            this.IsMultiAsset = 'True';
          else
            this.IsMultiAsset = 'False';
        }
        else
          this.IsMultiAsset = 'False';
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
      case AdInsConstant.AppStepGuar:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepGuar];
        break;
      case AdInsConstant.AppStepRef:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepRef];
        break;
      case AdInsConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepApp];
        break;
      case AdInsConstant.AppStepAsset:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepAsset];
        break;
      case AdInsConstant.AppStepIns:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepIns];
        break;
      case AdInsConstant.AppStepLIns:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepLIns];
        break;
      case AdInsConstant.AppStepFin:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepFin];
        break;
      case AdInsConstant.AppStepTC:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepTC];
        break;

      default:
        break;
    }
  }

  NextStep(Step) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(AdInsConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) =>{
        console.log("Step Change to, Curr Step : "+response.AppCurrStep+", Last Step : "+response.AppLastStep);
        this.ChangeTab(Step);
        this.stepper.next();
      },
      (error)=>{
        console.error("Error when updating AppStep");
        console.error(error);
      }
    )
  }

  LastStepHandler() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    if(this.ReturnHandlingHId > 0){

    }else{
      this.http.post(AdInsConstant.SubmitNAP, this.NapObj).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(["/Nap/ConsumerFinance/InputNap/Paging"], { queryParams: {BizTemplateCode:AdInsConstant.CF4W} })
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  Submit() {
    if (this.ReturnHandlingHId > 0) {
      var ReturnHandlingResult : ReturnHandlingDObj = new ReturnHandlingDObj();
      ReturnHandlingResult.WfTaskListId = this.wfTaskListId;
      ReturnHandlingResult.MrReturnTaskCode = this.ResponseReturnInfoObj.MrReturnTaskCode;
      ReturnHandlingResult.ReturnStat = this.ResponseReturnInfoObj.ReturnStat;
      ReturnHandlingResult.ReturnHandlingNotes = this.ResponseReturnInfoObj.ReturnHandlingNotes;
      ReturnHandlingResult.ReturnHandlingExecNotes = this.ResponseReturnInfoObj.ReturnHandlingExecNotes;
      ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

      this.http.post(AdInsConstant.EditReturnHandlingDNotesData, ReturnHandlingResult).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(["/Nap/AddProcess/ReturnHandling/EditAppPaging"], { queryParams: { BizTemplateCode: AdInsConstant.CF4W } })
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  ClaimTask(){
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext["UserName"];
    wfClaimObj.WfTaskListId = this.wfTaskListId;

    this.http.post(AdInsConstant.ClaimTaskNap, wfClaimObj).subscribe(
      () => {
    
      });
  }
}
