import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-credit-review-main',
  templateUrl: './credit-review-main.component.html',
  styleUrls: ['./credit-review-main.component.scss']
})
export class CreditReviewMainComponent implements OnInit {

  appId;
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private toastr: NGXToastrService, 
    private fb: FormBuilder) { 
      this.route.queryParams.subscribe(params => {
        this.appId = params["AppId"];
      });
    }

  InitData(){
    this.AppStep = {
      "CUST": 0,
      "APP": 1,
      "FRD": 2,
      "DEVC": 3,
      "APV": 4,
    };
    this.AppStepIndex = 0;
  }

  viewProdMainInfoObj;
  AppStepIndex;
  AppStep;
  ngOnInit() {
    this.InitData();
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
  }

  EnterTab(AppStep) {
    // console.log(AppStep);
    switch (AppStep) {
      case AdInsConstant.AppStepCust:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepCust];
        break;
      case AdInsConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepApp];
        break;
      case AdInsConstant.AppStepFraud:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepFraud];
        break;
      case AdInsConstant.AppStepDev:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepDev];
        break;
      case AdInsConstant.AppStepApv:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepApv];
        break;

      default:
        break;
    }
  }
}
