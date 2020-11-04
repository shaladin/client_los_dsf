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
  CustStep = {
    "Detail": 1,
    "Address": 2,
    "Contact": 3,
    "Financial": 4,
    "Legal": 5,
    "Other": 6,
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

    this.http.post(URLConstant.GetAppCustAndAppCustCompanyDataByAppCustId, {AppCustId: this.AppCustId}).subscribe(
      (response) => {
        this.AppCustCompanyId = response["AppCustCompanyId"];
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
  completionCheckingObj: any;
  Save(){
    this.http.post(URLConstant.SaveAppCustCompletion, {AppCustId: this.AppCustId}).subscribe(
      (response) => {
        this.completionCheckingObj = response;
        console.log(this.completionCheckingObj);
        if (this.completionCheckingObj.IsCompleted != true) {
          this.toastr.warningMessage('Please complete & save followong data first');
          if (this.completionCheckingObj.IsCustDetailCompleted != true) {
            this.EnterTab("Detail");
          }
          else if (this.completionCheckingObj.IsAddressCompleted != true) {
            this.EnterTab("Address");
          }
          else if (this.completionCheckingObj.IsContactInfoCompleted != true) {
            this.EnterTab("Contact");
          }
          else if (this.completionCheckingObj.IsFinacialCompleted != true) {
            this.EnterTab("Financial");
          }
          else if (this.completionCheckingObj.IsLegalDocCompleted != true) {
            this.EnterTab("Legal");
          }
          else if (this.completionCheckingObj.IsOthAttributeCompleted != true) {
            this.EnterTab("Other");
          }
        }
        else {
          this.toastr.successMessage(this.completionCheckingObj.Message);
          this.Back();
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
