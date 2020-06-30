import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { UcpagingComponent } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { RefLobObj } from 'app/shared/model/RefLobObj.Model';
import { VendorObj } from 'app/shared/model/Vendor.Model';
import { RefEmpForLookupObj } from 'app/shared/model/RefEmpForLookupObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';

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
    this.getLeadByLeadId = AdInsConstant.GetLeadByLeadId;
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
