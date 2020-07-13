import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Stepper from 'bs-stepper';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-tele-verif-detail',
  templateUrl: './tele-verif-detail.component.html',
})
export class TeleVerifDetailComponent implements OnInit {
  private stepper: Stepper;
  viewLeadHeaderMainInfo: string;
  isCustData: boolean;
  isLeadData: boolean;
  WfTaskListId: number;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
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
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_NAME));
    var wfClaimObj : ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
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
