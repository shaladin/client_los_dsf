import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import Stepper from 'bs-stepper';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { AllAppReservedFundObj } from 'app/shared/model/AllAppReservedFundObj.model';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-commission-reserved-fund-detail',
  templateUrl: './commission-reserved-fund-detail.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class CommissionReservedFundDetailComponent implements OnInit {

  ReturnHandlingHObj: ReturnHandlingHObj;
  AllAppReservedFundObj: AllAppReservedFundObj;
  StepIndex: number = 1;
  private stepper: Stepper;

  Step = {
    "COM": 1,
    "RSV": 2
  };

  HandlingForm = this.fb.group({
    ReturnHandlingNotes: [''],
    ReturnHandlingExecNotes: [''],
  });

  constructor(
    private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private router: Router) {
    this.ReturnHandlingHObj = new ReturnHandlingHObj();
    this.route.queryParams.subscribe(params => {
      this.ReturnHandlingHObj.AppId = params["AppId"];
      this.ReturnHandlingHObj.WfTaskListId = params["WfTaskListId"];
      this.ReturnHandlingHObj.ReturnHandlingHId = params["ReturnHandlingHId"];
    });
  }

  viewProdMainInfoObj;

  ngOnInit() {
    this.ClaimTask(this.ReturnHandlingHObj.WfTaskListId);
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });
    this.GetAndUpdateAppStep();
  }

  NapObj: AppObj = new AppObj();
  GetAndUpdateAppStep(){
    this.NapObj.AppId=this.ReturnHandlingHObj.AppId;
    this.http.post(AdInsConstant.GetAppById, this.NapObj).subscribe(
      (response: AppObj) => {
        console.log(response);
        if (response) {
          this.NapObj = response;
          if(this.NapObj.AppCurrStep!=AdInsConstant.AppStepComm && this.NapObj.AppCurrStep!=AdInsConstant.AppStepRSVFund){
            this.NapObj.AppCurrStep = AdInsConstant.AppStepComm;
            this.http.post<AppObj>(AdInsConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
              (response) =>{
                console.log("Step Change to, Curr Step : "+response.AppCurrStep+", Last Step : "+response.AppLastStep);
                this.ChangeTab(AdInsConstant.AppStepComm);
              },
              (error)=>{
                console.error("Error when updating AppStep");
                console.error(error);
              }
            )
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ChangeTab(AppStep) {
    switch (AppStep) {
      case AdInsConstant.AppStepComm:
        this.StepIndex = this.Step[AdInsConstant.AppStepComm];
        break;
      case AdInsConstant.AppStepComm:
        this.StepIndex = this.Step[AdInsConstant.AppStepComm];
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

  LastStepHandler(allAppReservedFundObj: AllAppReservedFundObj) {
    if (allAppReservedFundObj.ReturnHandlingHId != 0) {
      this.AllAppReservedFundObj = allAppReservedFundObj;
    }
    else {
      var lobCode = localStorage.getItem("BizTemplateCode");
      this.router.navigate(["/Nap/CreditProcess/CommissionReservedFund/Paging"], { queryParams: { BizTemplateCode: lobCode } })
    }
  }

  async ClaimTask(WfTaskListId) {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: WfTaskListId, pUserID: currentUserContext["UserName"], isLoading: false };
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }

  SubmitReturnHandling() {
    var workflowApiObj = new WorkflowApiObj();
    workflowApiObj.TaskListId = this.AllAppReservedFundObj.WfTaskIdListId;
    workflowApiObj.ListValue["pBookmarkValue"] = this.AllAppReservedFundObj.ReturnHandlingExecNotes;
    var lobCode = localStorage.getItem("BizTemplateCode");
    this.http.post(AdInsConstant.ResumeWorkflow, workflowApiObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Nap/AdditionalProcess/ReturnHandling/CommissionReservedFund/Paging"], { queryParams: { BizTemplateCode: lobCode } })
      },
      error => {
        console.log(error);
      }
    );
  }

  Back() {
    // console.log("test back commReserveFund");
    // console.log(this.ReturnHandlingHObj);
    var lobCode = localStorage.getItem("BizTemplateCode");
    if (this.ReturnHandlingHObj.ReturnHandlingHId != undefined) {
      this.router.navigate(["/Nap/AdditionalProcess/ReturnHandling/CommissionReservedFund/Paging"], { queryParams: { BizTemplateCode: lobCode } })
    } else {
      this.router.navigate(["/Nap/CreditProcess/CommissionReservedFund/Paging"], { queryParams: { BizTemplateCode: lobCode } })
    }
  }
}
