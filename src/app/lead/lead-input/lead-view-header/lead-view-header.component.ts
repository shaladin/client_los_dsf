import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-lead-view-header',
  templateUrl: './lead-view-header.component.html',
  providers: [DecimalPipe, NGXToastrService]
})
export class LeadViewHeaderComponent implements OnInit {
  LeadId: string;
  getLeadByLeadId: string;
  returnLead: any;
  getLeadObj: LeadObj;
  MainInfoForm = this.fb.group({
    OfficeCode: [''],
    OfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    OrderNo:[''],
    LobCode: [''],
    LobName:[''],
    LeadSource: [''],
  });
  leadUrl: string;
  
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.getLeadByLeadId = URLConstant.GetLeadByLeadId;
    this.route.queryParams.subscribe(params => {
        if (params["LeadId"] != null) {
          this.LeadId = params["LeadId"];
      }
    });
  }

  ngOnInit() {
    this.getLeadObj = new LeadObj();
    this.getLeadObj.LeadId = this.LeadId;
    this.http.post(this.getLeadByLeadId, this.getLeadObj).subscribe(
    (response) => {
        this.returnLead = response;
    });
  }

  AddView(){
    AdInsHelper.OpenLeadViewByLeadId(this.LeadId);
  }
}
