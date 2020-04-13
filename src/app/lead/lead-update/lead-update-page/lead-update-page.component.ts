import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { CustPersonalObj } from 'app/shared/model/CustPersonalObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-lead-update-page',
  templateUrl: './lead-update-page.component.html',
  providers: [NGXToastrService],
})
export class LeadUpdatePageComponent implements OnInit {
  LeadId: any;
  WfTaskListId: any;
  isCustomer: any;
  isLead: any;
  CustPersonalId: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      // if (params["WfTaskListId"] != null) {
      //   this.WfTaskListId = params["WfTaskListId"];
      // }
    });
  }

  ngOnInit() { 
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

}