import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompletionCheckingObj } from 'app/shared/model/AppCustCompletionCheckingObj.Model';
import { ResponseAppCustCompletionCompanyDataObj } from 'app/shared/model/ResponseAppCustCompletionCompanyDataObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import Stepper from 'bs-stepper';

@Component({
  selector: 'app-cust-completion-detail-company-x',
  templateUrl: './cust-completion-detail-company-x.component.html'
})
export class CustCompletionDetailCompanyXComponent implements OnInit {
  @ViewChild('viewMainInfo') ucViewMainProd: UcviewgenericComponent;
  AppId: number;
  AppCustId: number;
  WfTaskListId: number;
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
    "CustAsset": 6,
    "Legal": 7,
    "Other": 8,
  }
  ValidationMessages = {
    "Detail": "Please complete required data in tab \"Customer Detail\"",
    "Address": "Please add Legal & Business Address in tab \"Address Information\"",
    "Shrholder": "Please complete required data in tab \"Management / Shareholder\"",
    "Contact": "Please complete required data in tab \"Contact Information\"",
    "Financial": "Please complete required data in tab \"Financial Data\"",
    "Legal": "Please add at least one data in tab \"Legal Document\"",
    "Other": "Please complete required data in tab \"Other Attribute\"",
  }
  ReturnHandlingHId: number = 0;
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
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustCompletionCompanyData.json";
    
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    this.http.post<ResponseAppCustCompletionCompanyDataObj>(URLConstant.GetAppCustAndAppCustCompanyDataByAppCustId, { Id: this.AppCustId }).subscribe(
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
    if (this.ReturnHandlingHId != 0) {
      this.router.navigate([NavigationConstant.NAP_CUST_COMPL_DETAIL], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId, "ReturnHandlingHId": this.ReturnHandlingHId} });
    }
    else {
      this.router.navigate([NavigationConstant.NAP_CUST_COMPL_DETAIL], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId} });
    }
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
      case "CustAsset":
        this.stepIndex = this.CustStep["CustAsset"];
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
    this.http.post(URLConstantX.SaveAppCustCompletion, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.completionCheckingObj.IsCompleted = response["IsCompleted"];
        this.completionCheckingObj.InCompletedStep = response["InCompletedStep"];
        console.log(this.completionCheckingObj);
        if (this.completionCheckingObj.IsCompleted != true) {
          let errorMsg = typeof this.ValidationMessages[this.completionCheckingObj.InCompletedStep] != 'undefined' ? this.ValidationMessages[this.completionCheckingObj.InCompletedStep] : 'To continue please click "Save & Continue" in tab '+this.completionCheckingObj.InCompletedStep;
          this.toastr.warningMessage(errorMsg);
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
