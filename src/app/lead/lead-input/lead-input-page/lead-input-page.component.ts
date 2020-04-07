import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  isCustomer: any;
  isLead: any;
  CustPersonalId: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
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