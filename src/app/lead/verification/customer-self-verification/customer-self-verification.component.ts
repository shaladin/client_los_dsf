import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import Stepper from 'bs-stepper';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';

@Component({
  selector: 'app-customer-self-verification',
  templateUrl: './customer-self-verification.component.html',
  providers: [NGXToastrService]
})
export class CustomerSelfVerificationComponent implements OnInit {
  private stepper: Stepper;
  LeadId: string;
  LobCode: string;
  isCustData: boolean;
  isLeadData: boolean;
  viewLeadHeaderMainInfo : string;
  WfTaskListId: string;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params["LeadId"];
      if (this.LeadId == null || this.LeadId == undefined) this.LeadId = "1";

      this.WfTaskListId = params["WfTaskListId"];
      if (this.WfTaskListId == null || this.WfTaskListId == undefined) this.WfTaskListId = "0";

      this.LobCode = params["LobCode"];
      if (this.LobCode == null || this.LobCode == undefined) this.LobCode = "KTA";
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
    if (type == 'custData')
    {
      this.isCustData = true;
      this.isLeadData = false;
    }
    else if (type == 'leadData')
    {
      this.isCustData = false;
      this.isLeadData = true;
    }
  }

  async claimTask(){
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj : ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId;
    wfClaimObj.pUserID = "adins";
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  getValue(ev){
    if (ev.stepMode != undefined){
      if (ev.stepMode == "next"){
        this.stepper.next();
        this.EnterTab("leadData");
      }
      else
        this.stepper.previous();
    }
  }
}
