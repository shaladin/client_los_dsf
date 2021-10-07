import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import Stepper from 'bs-stepper';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model'; 
import { CookieService } from 'ngx-cookie';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-customer-self-verification',
  templateUrl: './customer-self-verification.component.html',
  providers: [NGXToastrService]
})
export class CustomerSelfVerificationComponent implements OnInit {
  private stepper: Stepper;
  LeadId: number;
  LobCode: string;
  LeadStep: string = 'SVR';
  isCustData: boolean;
  isLeadData: boolean;
  leadObj: LeadObj;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  WfTaskListId: any;
  reason : string;
  AppStepIndex :number =1;
  constructor(private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params["LeadId"];
      if (this.LeadId == null || this.LeadId == undefined) this.LeadId = 1;
      this.WfTaskListId = params["WfTaskListId"];
      if (this.WfTaskListId == undefined && this.WfTaskListId == null){
        this.WfTaskListId = environment.isCore ? "" : 0;
      }
      this.LobCode = params["LobCode"];
      if (this.LobCode == null || this.LobCode == undefined) this.LobCode = "KTA";
    })
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewLeadHeader.json";
    
    this.leadObj = new LeadObj;
    this.leadObj.LeadId = this.LeadId;
    var leadObj = { Id: this.LeadId };
    this.http.post(URLConstant.GetLeadByLeadId, leadObj).subscribe(
      (response) => { 
        this.LeadStep = response["LeadStep"];
         if (this.LeadStep != CommonConstant.LeadStepSelfVerification){
          this.reason = "resubmit"; 
         }else{ 
          if(environment.isCore){
            if (this.WfTaskListId != "") {
              this.claimTaskService.ClaimTaskSelfVerifV2(this.WfTaskListId);
            }
          }else{
            if (this.WfTaskListId > 0) {
              this.claimTaskService.ClaimTaskSelfVerif(this.WfTaskListId);
            }
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
