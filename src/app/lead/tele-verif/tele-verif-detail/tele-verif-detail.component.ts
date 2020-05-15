import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';
import Stepper from 'bs-stepper';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';

@Component({
  selector: 'app-tele-verif-detail',
  templateUrl: './tele-verif-detail.component.html',
})
export class TeleVerifDetailComponent implements OnInit {
  private stepper: Stepper;
  viewLeadHeaderMainInfo: string;
  isCustData: boolean;
  isLeadData: boolean;
  WfTaskListId: string;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  ngOnInit() {
    this.claimTask();
    this.viewLeadHeaderMainInfo = "./assets/ucviewgeneric/viewLeadHeader.json";

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
    this.EnterTab('custData');
    this.stepper.to(1);
  }

  EnterTab(type) {
    if (type == "custData") {
      this.isCustData = true;
      this.isLeadData = false;
    }
    else if (type == "leadData") {
      this.isCustData = false;
      this.isLeadData = true;
    }
  }
  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj : ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId;
    wfClaimObj.pUserID = currentUserContext["UserName"];
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
        console.log(response);
      });
  }

  getValue(ev) {
    if (ev.stepMode != undefined) {
      if (ev.stepMode == "next") {
        this.stepper.next();
        this.EnterTab("leadData");
      }
      else
        this.stepper.previous();
    }
  }
}
