import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import Stepper from 'bs-stepper';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-customer-self-verification',
  templateUrl: './customer-self-verification.component.html',
  providers: [NGXToastrService]
})
export class CustomerSelfVerificationComponent implements OnInit {
  private stepper: Stepper;
  LeadId: any;
  LobCode: string;
  LeadStep: string = 'SVR';
  isCustData: boolean;
  isLeadData: boolean;
  leadObj: LeadObj;
  viewLeadHeaderMainInfo : any;
  WfTaskListId: number;
  reason : string;
  AppStepIndex :number =1;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params["LeadId"];
      if (this.LeadId == null || this.LeadId == undefined) this.LeadId = "1";

      this.WfTaskListId = params["WfTaskListId"];
      if (this.WfTaskListId == null || this.WfTaskListId == undefined) this.WfTaskListId = 0;

      this.LobCode = params["LobCode"];
      if (this.LobCode == null || this.LobCode == undefined) this.LobCode = "KTA";
    })
  }

  ngOnInit() {
    this.viewLeadHeaderMainInfo = "./assets/ucviewgeneric/viewLeadHeader.json";
    this.leadObj = new LeadObj;
    this.leadObj.LeadId = this.LeadId;
    this.http.post(URLConstant.GetLeadByLeadId, this.leadObj).subscribe(
      (response) => { 
        this.LeadStep = response["LeadStep"];
        console.log(this.LeadStep);
         if (this.LeadStep != "SVR"){
          this.reason = "resubmit"; 
         }else{ 
          if (this.WfTaskListId > 0) {
            this.claimTask();
          }
          this.stepper = new Stepper(document.querySelector('#stepper1'), {
            linear: false,
            animation: true
          })
          this.EnterTab('custData');
          this.stepper.to(1);
         }

      });

  
  }

  EnterTab(type) {
    if (type == 'custData')
    {
      this.isCustData = true;
      this.isLeadData = false;
      this.AppStepIndex = 1;
    }
    else if (type == 'leadData')
    {
      this.isCustData = false;
      this.isLeadData = true;
      this.AppStepIndex = 2;
    }
  }

  async claimTask()
  {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: "adins"};
    console.log(wfClaimObj);
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  getValue(ev)
  {
    if (ev.stepMode != undefined)
    {
      if (ev.stepMode == "next")
      {
        this.stepper.next();
        this.EnterTab("leadData");
      }
      else
        this.stepper.previous();
    }
  }
  getPage(ev)
  { 
      if (ev.pageType == "submit")
      {
        this.reason = "submit";
        this.LeadStep = "";
      }
      
  }
}
