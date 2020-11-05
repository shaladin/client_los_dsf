import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';
import { AppCustCompletionCheckingObj } from 'app/shared/model/AppCustCompletionCheckingObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-cust-completion-detail-personal',
  templateUrl: './cust-completion-detail-personal.component.html',
  styleUrls: ['./cust-completion-detail-personal.component.scss']
})
export class CustCompletionDetailPersonalComponent implements OnInit {
  
  @ViewChild('viewMainInfo') ucViewMainProd: UcviewgenericComponent;
  AppId: number;
  AppCustId: number;
  AppCustPersonalId: number;
  stepIndex: number = 1;
  CustModelCode: string;
  isChange: boolean = false;
  isMarried: boolean = false;
  private stepper: Stepper;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  IsCompletion: boolean = false;
  isCompletionCheck: boolean = true;
  isCompleteCustStep:object = {};
  CustStep = {
    "Detail": 1,
    "Address": 2,
    "Family": 3,
    "Job": 4,
    "Emergency": 5,
    "Financial": 6,
    "Other": 7,
  }  
  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
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
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustCompletionPersonalData.json";
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

    this.http.post(URLConstant.GetAppCustAndAppCustPersonalDataByAppCustId, {AppCustId: this.AppCustId}).subscribe(
      (response) => {
        if(response["MrMaritalStatCode"] != null && response["MrMaritalStatCode"] == CommonConstant.MasteCodeMartialStatsMarried) this.isMarried = true;
        this.CustModelCode = response["MrCustModelCode"];
        this.AppCustPersonalId = response["AppCustPersonalId"];
        this.IsCompletion = response["IsCompletion"];
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
      case "Family":
        this.stepIndex = this.CustStep["Family"];
        break;
      case "Job":
        this.stepIndex = this.CustStep["Job"];
        break;
      case "Emergency":
        this.stepIndex = this.CustStep["Emergency"];
        break;
      case "Financial":
        this.stepIndex = this.CustStep["Financial"];
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
      if(event.Key == "Detail"){
        this.CustModelCode = event.CustModelCode;
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
  completionCheckingObj: AppCustCompletionCheckingObj = new AppCustCompletionCheckingObj();
  Save(){
    this.http.post(URLConstant.SaveAppCustCompletion, {AppCustId: this.AppCustId}).subscribe(
      (response) => {
        this.completionCheckingObj.IsCompleted = response["IsCompleted"];
        this.completionCheckingObj.InCompletedStep = response["InCompletedStep"];
        console.log(this.completionCheckingObj);
        if (this.completionCheckingObj.IsCompleted != true) {
          this.toastr.warningMessage('Please complete & save followong data first');
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
