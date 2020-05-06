import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tele-verif-detail',
  templateUrl: './tele-verif-detail.component.html',
})
export class TeleVerifDetailComponent implements OnInit {
  viewLeadHeaderMainInfo: any;
  isCustData: boolean;
  isLeadData: boolean;
  WfTaskListId: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      this.WfTaskListId = params["WfTaskListId"];
    })
  }

  ngOnInit() {
    this.claimTask();
    this.viewLeadHeaderMainInfo = "./assets/ucviewgeneric/viewLeadHeader.json";
  }

  EnterTab(type){
    if(type == "custData"){
      this.isCustData = true;
      this.isLeadData = false;
    }
    else if(type == "leadData"){
      this.isCustData = false;
      this.isLeadData = true;
    }
  }
  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"] };
    console.log(wfClaimObj);
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
        console.log(response);
      });
    }
}
