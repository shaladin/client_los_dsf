import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { CustPersonalObj } from 'app/shared/model/CustPersonalObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-lead-input-page',
  templateUrl: './lead-input-page.component.html',
  providers: [NGXToastrService],
})
export class LeadInputPageComponent implements OnInit {
  LeadId: any;
  CopyFrom: any;
  isCustomer: any;
  isLead: any;
  CustPersonalId: any;
  TaskListId: any;
  pageType: any;
  viewLeadHeaderMainInfo : any;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["mode"] == "edit") {
        this.pageType = "UPDATE";
      }
      else {
        this.pageType = "INPUT";
      }

      if (params["CopyFrom"] != null) {
        this.CopyFrom = params["CopyFrom"];
      }
    });
  }

  ngOnInit() {
    this.viewLeadHeaderMainInfo = "./assets/ucviewgeneric/viewLeadHeader.json";
  }

  EnterTab(type) {
    if (type == "Customer") {
      this.isCustomer = true;
      this.isLead = false;
    }

    if (type == "Lead") {
      this.isCustomer = false;
      this.isLead = true;
    }
  }
  
  editMainInfoHandler(){
    this.router.navigate(["/Lead/LeadInput/MainInfo"], { queryParams: { LeadId: this.LeadId, mode: "edit" }});
  }

  cancelHandler(){
    this.router.navigate(['/Lead/Lead/Paging']);
  }

}