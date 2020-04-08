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
  viewLeadCustomerPersonalMaindata: any;
  viewLeadCustomerCompanyMaindata: any;
  viewLeadCustSocmed: any;
  LeadId: any;
  GetLeadCustByLeadIdUrl: string;
  GetListLeadCustSocmedByLeadCustIdUrl: string;
  MrCustTypeCode: string;
  leadCustObj: any;
  leadCustSocmedObj: any;
  tempLeadCustObj: any;
  listLeadCustSocmed : any;
  viewLeadAddressLegal : any;
  viewLeadAddressResidence : any;
  viewLeadCustPersonalJobData : any;
  viewLeadCustPersonalFinData : any;
  ngOnInit() {
    this.viewLeadCustomerPersonalMaindata = "./assets/ucviewgeneric/viewLeadCustomerPersonal.json";
    // this.viewLeadCustomerCompanyMaindata = "./assets/ucviewgeneric/viewLeadCustomerCompany.json";
    this.viewLeadAddressLegal = "./assets/ucviewgeneric/viewLeadAddressLegal.json";
    this.viewLeadAddressResidence = "./assets/ucviewgeneric/viewLeadAddressResidence.json";
    this.viewLeadCustPersonalJobData = "./assets/ucviewgeneric/viewLeadCustPersonalJobData.json";
    this.viewLeadCustPersonalFinData ="./assets/ucviewgeneric/viewLeadCustPersonalFinData.json";
    this.leadCustObj = new LeadCustObj();
    this.leadCustSocmedObj = new LeadCustSocmedObj();
    this.leadCustObj.LeadId = this.LeadId;


    this.http.post(this.GetLeadCustByLeadIdUrl, this.leadCustObj).subscribe(
      response => {
        this.tempLeadCustObj = response;
        this.MrCustTypeCode = this.tempLeadCustObj.MrCustTypeCode;
        this.leadCustSocmedObj.LeadCustId = this.tempLeadCustObj.LeadCustId;
        this.http.post(this.GetListLeadCustSocmedByLeadCustIdUrl, this.leadCustSocmedObj).subscribe(
          response => {
            this.listLeadCustSocmed = response["ReturnObject"];
            console.log(this.listLeadCustSocmed);
          });
      });

  
  }

}
