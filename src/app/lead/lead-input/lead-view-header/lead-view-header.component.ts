import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lead-view-header',
  templateUrl: './lead-view-header.component.html',
  providers: [DecimalPipe, NGXToastrService]
})
export class LeadViewHeaderComponent implements OnInit {
  LeadId: number;
  returnLead: LeadObj;
  getLeadObj: LeadObj;
  MainInfoForm = this.fb.group({
    OfficeCode: [''],
    OfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    OrderNo: [''],
    LobCode: [''],
    LobName: [''],
    LeadSource: [''],
  });
  leadUrl: string;

  constructor(private route: ActivatedRoute,
    private http: HttpClient, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
    });
  }

  ngOnInit() {
    this.getLeadObj = new LeadObj();
    this.getLeadObj.LeadId = this.LeadId;
    let getLeadObj = { Id: this.LeadId };
    this.http.post(URLConstant.GetLeadByLeadId, getLeadObj).subscribe(
      (response: LeadObj) => {
        this.returnLead = response;
      });
  }

  AddView() {
    AdInsHelper.OpenLeadViewByLeadId(this.LeadId);
  }
}
