import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppWizardObj } from 'app/shared/model/App/AppWizard.Model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-app-add-detail',
  templateUrl: './app-add-detail.component.html',
  providers: [NGXToastrService]
})
export class AppAddDetailComponent implements OnInit {

  appId: number;
  mode: string;
  viewProdMainInfoObj: string;
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  AppStepIndex: number;

  AppStep = {
    "NEW": 0,
    "CUST": 0,
    "GUAR": 1,
    "REF": 2,
    "APP": 3,
    "ASSET": 4,
    "INS": 5,
    "LFI": 6,
    "FIN": 7,
    "TC": 8,
  };

  ResponseReturnInfoObj;
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;
  MakeViewReturnInfoObj(){
    if(this.mode == AdInsConstant.ModeResultHandling){
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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.mode = params["Mode"];
      }
    });
  }

  ngOnInit() {
    console.log("this")
    this.AppStepIndex = 0;
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    // this.NapObj = new AppObj();
    // this.NapObj.AppId = this.appId;
    // this.http.post(AdInsConstant.GetAppById, this.NapObj).subscribe(
    //   (response: AppObj) => {
    //     if (response) {
    //       this.AppStepIndex = this.AppStep[response.AppCurrStep];
    //     }else{
    //       this.AppStepIndex = 0;
    //     }
    //   }
    // );
    this.MakeViewReturnInfoObj();
  }

  EnterTab(AppStep) {
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

  // WizardNavigation(AppWizard : AppWizardObj){
  //   console.log("WIZNAV")
  //   this.AppStepIndex = this.AppStep[AppWizard.AppStep];
  //   AppWizard.Wizard.goToNextStep();
  // }

  Submit(){
    if(this.mode == AdInsConstant.ModeResultHandling){
      var obj = {
        ReturnHandlingDId: this.ResponseReturnInfoObj.ReturnHandlingDId,
        ReturnHandlingNotes: this.ResponseReturnInfoObj.ReturnHandlingNotes,
        ReturnHandlingExecNotes: this.FormReturnObj.value.ReturnExecNotes,
        RowVersion: this.ResponseReturnInfoObj.RowVersion
      };
  
      this.http.post(AdInsConstant.EditReturnHandlingDNotesData, obj).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }
}
