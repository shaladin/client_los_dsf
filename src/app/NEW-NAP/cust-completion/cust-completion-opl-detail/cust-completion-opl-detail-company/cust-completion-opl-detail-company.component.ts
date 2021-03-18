import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompletionCheckingObj } from 'app/shared/model/AppCustCompletionCheckingObj.Model';
import { ResponseAppCustCompletionCompanyDataObj } from 'app/shared/model/ResponseAppCustCompletionCompanyDataObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cust-completion-opl-detail-company',
  templateUrl: './cust-completion-opl-detail-company.component.html',
  styleUrls: []
})
export class CustCompletionOplDetailCompanyComponent implements OnInit {
  @ViewChild('viewMainInfo') ucViewMainProd: UcviewgenericComponent;
  AppId: number;
  AppCustId: number;
  WfTaskListId: number;
  AppCustCompanyId: number;
  stepIndex: number = 1;
  BizTemplateCode: string = "OPL";
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
  ValidationMessages = {
    "Detail": "Please complete required data in tab \"Customer Detail\"",
    "Address": "Please add Legal Address in tab \"Address Information\"",
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
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-opl-main-info.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    
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

    Object.keys(this.CustStep).forEach(stepName => {
      if(typeof(this.isCompleteCustStep[stepName]) == 'undefined') this.isCompleteCustStep[stepName] = false;
    });
  }

  Back() {
    if (this.ReturnHandlingHId != 0) {
      this.router.navigate([NavigationConstant.NAP_CUST_COMPL_OPL_DETAIL], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId, "ReturnHandlingHId": this.ReturnHandlingHId, "BizTemplateCode": this.BizTemplateCode } });
    }
    else {
      this.router.navigate([NavigationConstant.NAP_CUST_COMPL_OPL_DETAIL], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId, "BizTemplateCode": this.BizTemplateCode } });
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
      case "Legal":
        this.stepIndex = this.CustStep["Legal"];
        break;
      case "Other":
        this.stepIndex = this.CustStep["Other"];
        break;
    }
    this.stepper.to(this.stepIndex);
  }

  GetEvent(event: any, Step: string) {
    if(event!=null){
      if(typeof(event.IsComplete) != 'undefined') {
        Object.keys(this.CustStep).forEach(stepName => {
          if(this.CustStep[stepName] == this.stepIndex) 
            this.isCompleteCustStep[stepName] = event.IsComplete;
        });
      }
    }

    if (Step == 'Save') {
      this.Save();
    }
    else {
      this.EnterTab(Step);
      this.ucViewMainProd.initiateForm();
    }    
  }

  Save() {
    this.http.post(URLConstant.SaveAppCustCompletion, { Id: this.AppCustId }).subscribe(
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

  GetCallBack(event: any) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
    }
  }
}