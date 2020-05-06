import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-customer-self-verification',
  templateUrl: './customer-self-verification.component.html',
  providers: [NGXToastrService]
})
export class CustomerSelfVerificationComponent implements OnInit {
  LeadId: any;
  LobCode: string;
  isCustData: boolean;
  isLeadData: boolean;
  viewLeadHeaderMainInfo : any;
  WfTaskListId: any;

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
    console.log('tes');
    this.claimTask();
    this.viewLeadHeaderMainInfo = "./assets/ucviewgeneric/viewLeadHeader.json";
  }

  EnterTab(type) {
    this.isCustData = true;
    this.isLeadData = true;
  }
  claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"] };
    console.log(wfClaimObj);
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
    }
}
