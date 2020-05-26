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
    })
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
    this.ChangeTab(Step);
    this.stepper.next();
  }

  LastStepHandler(allAppReservedFundObj: AllAppReservedFundObj) {
    if (allAppReservedFundObj.ReturnHandlingHId != 0) {
      this.AllAppReservedFundObj = allAppReservedFundObj;
    }
    else {
      this.router.navigate(["/Nap/CreditProcess/CommissionReservedFund/Paging"], { queryParams: { LobCode: "CF4W" } })
    }
  }

  async ClaimTask(WfTaskListId) {
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj = { pWFTaskListID: WfTaskListId, pUserID: currentUserContext["UserName"], isLoading: false };
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }

  SubmitReturnHandling() {
    var workflowApiObj = new WorkflowApiObj();
    workflowApiObj.TaskListId = this.AllAppReservedFundObj.WfTaskIdListId;
    workflowApiObj.ListValue["pBookmarkValue"] = this.AllAppReservedFundObj.ReturnHandlingExecNotes;

    this.http.post(AdInsConstant.ResumeWorkflow, workflowApiObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Nap/AdditionalProcess/ReturnHandling/CommissionReservedFund/Paging"], { queryParams: { LobCode: "CF4W" } })
      },
      error => {
        console.log(error);
      }
    );
  }

  Back() {
    if (this.ReturnHandlingHObj.ReturnHandlingHId != 0) {
      this.router.navigate(["/Nap/AdditionalProcess/ReturnHandling/CommissionReservedFund/Paging"], { queryParams: { LobCode: "CF4W" } })
    } else {
      this.router.navigate(["/Nap/CreditProcess/CommissionReservedFund/Paging"], { queryParams: { LobCode: "CF4W" } })

    }
  }
}