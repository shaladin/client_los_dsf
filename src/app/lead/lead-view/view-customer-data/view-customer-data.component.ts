import { Component, OnInit, Input } from '@angular/core';
import { LeadCustObj } from 'app/shared/model/LeadCustObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LeadCustSocmedObj } from 'app/shared/model/LeadCustSucmedObj.model';

@Component({
  selector: 'app-view-customer-data',
  templateUrl: './view-customer-data.component.html' 
})
export class ViewCustomerDataComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.GetLeadCustByLeadIdUrl = AdInsConstant.GetLeadCustByLeadId;
    this.GetListLeadCustSocmedByLeadCustIdUrl = AdInsConstant.GetListLeadCustSocmedByLeadCustId;
  }
  viewLeadCustomerPersonalMaindata: string;
  LeadId: string;
  GetLeadCustByLeadIdUrl: string;
  GetListLeadCustSocmedByLeadCustIdUrl: string;
  MrCustTypeCode: string;
  leadCustObj: LeadCustObj = new LeadCustObj();
  leadCustSocmedObj: LeadCustSocmedObj = new LeadCustSocmedObj();
  tempLeadCustObj: any;
  listLeadCustSocmed : any;
  viewLeadAddressLegal : string;
  viewLeadAddressResidence : string;
  viewLeadCustPersonalJobData : string;
  viewLeadCustPersonalFinData : string;
  ngOnInit() {
    this.viewLeadCustomerPersonalMaindata = "./assets/ucviewgeneric/viewLeadCustomerPersonal.json";
    this.viewLeadAddressLegal = "./assets/ucviewgeneric/viewLeadAddressLegal.json";
    this.viewLeadAddressResidence = "./assets/ucviewgeneric/viewLeadAddressResidence.json";
    this.viewLeadCustPersonalJobData = "./assets/ucviewgeneric/viewLeadCustPersonalJobData.json";
    this.viewLeadCustPersonalFinData ="./assets/ucviewgeneric/viewLeadCustPersonalFinData.json";
    this.leadCustObj.LeadId = this.LeadId;

    this.http.post(this.GetLeadCustByLeadIdUrl, this.leadCustObj).subscribe(
      response => {
        this.tempLeadCustObj = response;
        this.MrCustTypeCode = this.tempLeadCustObj.MrCustTypeCode;
        this.leadCustSocmedObj.LeadCustId = this.tempLeadCustObj.LeadCustId;
        this.http.post(this.GetListLeadCustSocmedByLeadCustIdUrl, this.leadCustSocmedObj).subscribe(
          response => {
            this.listLeadCustSocmed = response["ReturnObject"];
          });
      });
  }
}
