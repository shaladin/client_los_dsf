import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { WizardComponent } from 'angular-archwizard';

@Component({
  selector: 'app-app-add-detail',
  templateUrl: './app-add-detail.component.html',
  providers: [NGXToastrService, WizardComponent]
})
export class AppAddDetailComponent implements OnInit {

  appId: number;
  viewProdMainInfoObj: string;
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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private wizard: WizardComponent) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
    });
  }

  ngOnInit() {
    console.log("this")
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    this.http.post(environment.losUrl + AdInsConstant.GetAppById, this.NapObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.AppStepIndex = this.AppStep[response.AppCurrStep];
        }else{
          this.AppStepIndex = 0;
        }
      }
    )
  }

  EnterTab(AppStep) {
    console.log(AppStep);
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

  NextTab(){
    console.log(this.wizard);
    this.wizard.goToNextStep();
  }
}
