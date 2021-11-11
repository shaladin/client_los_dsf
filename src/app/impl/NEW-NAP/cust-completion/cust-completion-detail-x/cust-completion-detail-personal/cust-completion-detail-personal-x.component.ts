import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import Stepper from 'bs-stepper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { ResponseAppCustCompletionPersonalDataObj } from 'app/shared/model/response-app-cust-completion-personal-data-obj.model';
import { AppCustCompletionCheckingObj } from 'app/shared/model/app-cust-completion-checking-obj.model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';

@Component({
  selector: 'app-cust-completion-detail-personal-x',
  templateUrl: './cust-completion-detail-personal-x.component.html'
})
export class CustCompletionDetailPersonalXComponent implements OnInit {

  @ViewChild('viewMainInfo') ucViewMainProd: UcviewgenericComponent;
  AppId: number;
  AppCustId: number;
  WfTaskListId: number;
  AppCustPersonalId: number;
  stepIndex: number = 1;
  CustModelCode: string;
  IsMarried: boolean = false;
  private stepper: Stepper;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  IsCompletion: boolean = false;
  isCompletionCheck: boolean = true;
  IsCustomer: boolean = false;
  isCompleteCustStep: object = {};
  CustStep = {
    "Detail": 1,
    "Address": 2,
    "Family": 3,
    "Job": 4,
    "Emergency": 5,
    "Financial": 6,
    "CustAsset": 7,
    "Other": 8,
  }
  ValidationMessages = {
    "Detail": "Please complete required data in tab \"Customer Detail\"",
    "Address": "Please add Legal & Residence Address in tab \"Address Information\"",
    "Family": "Please complete required data in tab \"Family\"",
    "Job": "Please complete required data in tab \"Job Data\"",
    "Emergency": "Please complete required data in tab \"Emergency Contact\"",
    "Financial": "Please complete required data in tab \"Financial Data\"",
    "Other": "Please complete required data in tab \"Other Attribute\"",
  }
  ReturnHandlingHId: number = 0;
  LobCode: string;
  AppCustBankAccList: Array<AppCustBankAccObj> = new Array();
  AppObj: AppObj = new AppObj();
  IsDisburseToCust: boolean = false;

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
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
      }
    });
  }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustCompletionPersonalData.json";

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })

    await this.http.post<ResponseAppCustCompletionPersonalDataObj>(URLConstant.GetAppCustAndAppCustPersonalDataByAppCustId, { Id: this.AppCustId }).toPromise().then(
      (response) => {
        if (response.AppCustPersonalObj.MrMaritalStatCode != null && response.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried) this.IsMarried = true;
        this.CustModelCode = response.AppCustObj.MrCustModelCode;
        this.AppCustPersonalId = response.AppCustPersonalObj.AppCustPersonalId;
        this.IsCompletion = response.AppCustObj.IsCompletion;
        this.IsCustomer = response.AppCustObj.IsCustomer;
      }
    );

    // set default isComplete untuk all step ke false jika belum ada defaultnya
    Object.keys(this.CustStep).forEach(stepName => {
      if (typeof (this.isCompleteCustStep[stepName]) == 'undefined') this.isCompleteCustStep[stepName] = false;
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
      case "CustAsset":
        this.stepIndex = this.CustStep["CustAsset"];
        break;
      case "Other":
        this.stepIndex = this.CustStep["Other"];
        break;
    }
    this.stepper.to(this.stepIndex);
  }

  GetEvent(event: any, Step: string) {
    if (event != null) {

      // set isComplete currStep jika ada event nya
      if (typeof (event.IsComplete) != 'undefined') {
        Object.keys(this.CustStep).forEach(stepName => {
          if (this.CustStep[stepName] == this.stepIndex)
            this.isCompleteCustStep[stepName] = event.IsComplete;
        });
      }
      if (event.Key == "Detail") {
        this.CustModelCode = event.CustModelCode;
      }
    }
    if (Step == 'Save') {
      this.Save();
    }
    else {
      if(!this.IsCustomer && Step == 'Family'){
        Step = 'Job';
      }
      this.EnterTab(Step);
      this.ucViewMainProd.initiateForm();
    }
  }

  completionCheckingObj: AppCustCompletionCheckingObj = new AppCustCompletionCheckingObj();
  async Save() {

    await this.GetAppCustBankAcc();

    if (!this.AppCustBankAccList.length && this.LobCode == "SLB") {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_INPUT_BANK_ACCOUNT);
      this.EnterTab(CommonConstantX.FINANCIAL_TAB);
      return;
    }

    if (!this.AppCustBankAccList.length && (this.LobCode == "MPF" || this.LobCode == "FD")) {
      await this.GetIsDisburseToCust();
      if (this.IsDisburseToCust === true) {
        this.toastr.warningMessage(ExceptionConstant.PLEASE_INPUT_BANK_ACCOUNT);
        this.EnterTab(CommonConstantX.FINANCIAL_TAB);
        return;
      }
    }

    this.http.post(URLConstantX.SaveAppCustCompletion, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.completionCheckingObj.IsCompleted = response["IsCompleted"];
        this.completionCheckingObj.InCompletedStep = response["InCompletedStep"];
        if (this.completionCheckingObj.IsCompleted != true) {
          let errorMsg = typeof this.ValidationMessages[this.completionCheckingObj.InCompletedStep] != 'undefined' ? this.ValidationMessages[this.completionCheckingObj.InCompletedStep] : 'To continue please click "Save & Continue" in tab ' + this.completionCheckingObj.InCompletedStep;
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

  async GetAppCustBankAcc() {
    await this.http.post<Array<AppCustBankAccObj>>(URLConstant.GetAppCustBankAccAndStatementForView, { Id: this.AppCustId }).toPromise().then(
      (response) => {
        this.AppCustBankAccList = response["AppCustBankAccList"];
      }
    );
    await this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.LobCode = response.LobCode;
      }
    );
  }

  async GetIsDisburseToCust() {
    await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      async (response: AppObj) => {
        this.AppObj = response;
        var objIsDisburse: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
        objIsDisburse.ProdOfferingCode = this.AppObj.ProdOfferingCode;
        objIsDisburse.RefProdCompntCode = CommonConstant.RefProdCompntCodeDisburseToCust;
        objIsDisburse.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;

        await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, objIsDisburse).toPromise().then(
          (response) => {
            if (response && response["StatusCode"] == "200" && response["ProdOfferingDId"] > 0) {
              this.IsDisburseToCust = response["CompntValue"] == 'Y' ? true : false;
            }
          }
        );
      }
    );
  }
}
