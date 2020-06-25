import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-app-add-detail',
  templateUrl: './app-add-detail.component.html',
  providers: [NGXToastrService]
})
export class AppAddDetailComponent implements OnInit {

  private stepper: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  viewProdMainInfoObj: string;
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  IsMultiAsset: string;
  ListAsset: any;
  token : any = localStorage.getItem("Token");

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

  ResponseReturnInfoObj;
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
        this.mode = params["Mode"];
        this.CheckMultiAsset();
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
    });
  }

  ngOnInit() {
    console.log("this");
    //this.ClaimTask();
    this.AppStepIndex = 0;
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    this.http.post(AdInsConstant.GetAppById, this.NapObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          this.AppStepIndex = this.AppStep[response.AppCurrStep];
          this.stepper.to(this.AppStepIndex);
        }
        else {
          this.AppStepIndex = 0;
        }
      },
      (error) => {
        console.log(error);
      }
    );

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
    this.MakeViewReturnInfoObj();
  }

  Cancel() {
    this.router.navigate(["/Nap/CF2W/Paging"]);
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
    this.http.post(AdInsConstant.SubmitNAP, this.NapObj).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(["/Nap/CF2W/Paging"], { queryParams: { LobCode: "CF2W" } })
      },
      (error) => {
        console.log(error);
      }
    )
  }

  Submit() {
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

  // ClaimTask(){
  //   var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
  //   var wfClaimObj = new AppObj();
  //   wfClaimObj.AppId = this.appId;
  //   wfClaimObj.Username = currentUserContext["UserName"];
  //   wfClaimObj.WfTaskListId = this.wfTaskListId;

  //   this.http.post(AdInsConstant.ClaimTaskNap, wfClaimObj).subscribe(
  //     (response) => {
    
  //     });
  // }

  GetCallback(ev){
    var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + ev.ViewObj.ProdOfferingCode + "&prodOfferingVersion=" + ev.ViewObj.ProdOfferingVersion + "&Token=" + this.token;
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });
  }
}
