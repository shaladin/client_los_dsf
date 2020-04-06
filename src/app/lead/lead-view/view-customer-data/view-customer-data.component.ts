import { Component, OnInit, Input } from '@angular/core';
import { LeadCustObj } from 'app/shared/model/LeadCustObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-customer-data',
  templateUrl: './view-customer-data.component.html',
  styleUrls: ['./view-customer-data.component.scss']
})
export class ViewCustomerDataComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.GetLeadCustByLeadIdUrl = AdInsConstant.GetLeadCustByLeadId;
  }
  viewLeadCustomerPersonalMaindata: any;
  viewLeadCustomerCompanyMaindata: any;
  viewLeadCustSocmed : any;
  LeadId: any;
  GetLeadCustByLeadIdUrl: string;
  MrCustTypeCode: string;
  LeadCustObj: any;

  ngOnInit() {
    console.log(this.MrCustTypeCode); 
    this.LeadCustObj = new LeadCustObj();
    this.LeadCustObj.LeadId = this.LeadId; 
    this.http.post(this.GetLeadCustByLeadIdUrl, this.LeadCustObj).subscribe(
      response => {
        this.MrCustTypeCode = response["MrCustTypeCode"]; 
      });
    this.viewLeadCustomerPersonalMaindata = "./assets/ucviewgeneric/viewLeadCustomerPersonal.json";
    // this.viewLeadCustomerCompanyMaindata = "./assets/ucviewgeneric/viewLeadCustomerCompany.json";
    this.viewLeadCustSocmed = "./assets/ucviewgeneric/viewLeadCustSocmed.json";

  }

}
