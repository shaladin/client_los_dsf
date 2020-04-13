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


@Component({
  selector: 'app-lead-view-header',
  templateUrl: './lead-view-header.component.html',
  providers: [DecimalPipe, NGXToastrService]
})
export class LeadViewHeaderComponent implements OnInit {
  inputPagingObj: any;
  user: any;
  LeadId: any;
  addLead: any;
  getLeadByLeadId: any;
  returnLead: any;
  leadObj: any;
  setLeadObj: any;
  getLeadObj: LeadObj;
  cmoNameLookUpObj: any;
  surveyorNameLookUpObj: any;
  salesNameLookUpObj:any;
  agencyLookUpObj: any;
  tempCmoName: any;
  tempCmoCode: any;
  tempSurveyorName: any;
  tempSurveyorCode: any;
  tempSalesName: any;
  tempSalesCode: any;
  tempAgencyName: any;
  tempAgencyCode: any;
  getListRefOffice: any;
  getListActiveLob: any;
  getListActiveRefMasterUrl: any;
  getVendorByVendorCode: any;
  getRefEmpForLookupEmployee: any;
  listRefOffice: any;
  refOfficeObj: any;
  listRefLob:any;
  refLobObj: any;
  leadSource: any;
  listLeadSource: any;
  vendorObj: any;
  returnVendorObj: any;
  OfficeName: any;
  LobName: any;
  pageType: string = "add";
  page:any;
  custShareholderLookUpObj1: any;
  cmoObj: any;
  returnCmoObj: any;
  surveyorObj: any;
  returnSurveyorObj: any;
  salesObj: any;
  returnSalesObj: any;
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
        console.log("aaaa")
        console.log(this.returnLead)
    });
  }
}
