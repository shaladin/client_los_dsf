import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompletionCheckingObj } from 'app/shared/model/AppCustCompletionCheckingObj.Model';
import { ResponseAppCustCompletionCompanyDataObj } from 'app/shared/model/ResponseAppCustCompletionCompanyDataObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cust-completion-detail-company',
  templateUrl: './cust-completion-detail-company.component.html',
  styleUrls: ['./cust-completion-detail-company.component.scss']
})
export class CustCompletionDetailCompanyComponent implements OnInit {
  @ViewChild('viewMainInfo') ucViewMainProd: UcviewgenericComponent;
  AppId: number;
  AppCustId: number;
  AppCustCompanyId: number;
  stepIndex: number = 1;
  private stepper: Stepper;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  IsCompletion: boolean = false;
  isCompletionCheck = true;
  isCompleteCustStep:object = {};
  completionCheckingObj: AppCustCompletionCheckingObj = new AppCustCompletionCheckingObj();
  
  CustStep = {
    "Detail": 1,
    "Address": 2,
    "Shrholder": 3,
    "Contact": 4,
    "Financial": 5,
    "Legal": 6,
    "Other": 7,
  }
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: NGXToastrService,
        private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
      if (params['AppCustId'] != null) {
        this.AppCustId = params['AppCustId'];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustCompletionCompanyData.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      }
    ];
    
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    this.http.post<ResponseAppCustCompletionCompanyDataObj>(URLConstant.GetAppCustAndAppCustCompanyDataByAppCustId, {AppCustId: this.AppCustId}).subscribe(
      (response) => {
        this.AppCustCompanyId = response.AppCustCompanyObj.AppCustCompanyId;
        this.IsCompletion = response.AppCustObj.IsCompletion;
      }
    );

    // set default isComplete untuk all step ke false jika belum ada defaultnya
    Object.keys(this.CustStep).forEach(stepName => {
      if(typeof(this.isCompleteCustStep[stepName]) == 'undefined') this.isCompleteCustStep[stepName] = false;
    });
  }

  Back() {
    this.location.back();
  }
  
  EnterTab(type: string) { 
    switch (type) {
      case "Detail":
        this.stepIndex = this.CustStep["Detail"];
        break;
      case "Address":
        this.stepIndex = this.CustStep["Address"];
        break;
        case "Shrholder":
          this.stepIndex = this.CustStep["Shrholder"];
          break;
      case "Contact":
        this.stepIndex = this.CustStep["Contact"];
        break;
      case "Financial":
        this.stepIndex = this.CustStep["Financial"];
        break;
      case "Legal":
        this.stepIndex = this.CustStep["Legal"];
        break;
      case "Other":
        this.stepIndex = this.CustStep["Other"];
        break;
    }
    this.stepper.to(this.stepIndex);
  }

  GetEvent(event: any, Step: string){
    if(event!=null){
      // set isComplete currStep jika ada event nya
      if(typeof(event.IsComplete) != 'undefined') {
        Object.keys(this.CustStep).forEach(stepName => {
          if(this.CustStep[stepName] == this.stepIndex) 
            this.isCompleteCustStep[stepName] = event.IsComplete;
        });
      }
    }
    if(Step == 'Save')
    {
      this.Save();
    }
    else
    {
      this.EnterTab(Step);
      this.ucViewMainProd.initiateForm();
    }    
  }
  Save() {
    this.http.post(URLConstant.SaveAppCustCompletion, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        this.completionCheckingObj.IsCompleted = response["IsCompleted"];
        this.completionCheckingObj.InCompletedStep = response["InCompletedStep"];
        console.log(this.completionCheckingObj);
        if (this.completionCheckingObj.IsCompleted != true) {
          this.toastr.warningMessage('Please complete & save following data first');
          this.EnterTab(this.completionCheckingObj.InCompletedStep);
        }
        else {
          this.toastr.successMessage(response["message"]);
          this.Back();
        }

      },
      (error) => {
        console.log(error);
      }
    )
  }
}
