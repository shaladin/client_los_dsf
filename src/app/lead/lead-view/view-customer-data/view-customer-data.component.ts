import { Component, OnInit, Input } from '@angular/core';
import { LeadCustObj } from 'app/shared/model/LeadCustObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LeadCustSocmedObj } from 'app/shared/model/LeadCustSucmedObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-customer-data',
  templateUrl: './view-customer-data.component.html'
})
export class ViewCustomerDataComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.GetLeadCustByLeadIdUrl = URLConstant.GetLeadCustByLeadId;
    this.GetListLeadCustSocmedByLeadCustIdUrl = URLConstant.GetListLeadCustSocmedByLeadCustId;
  }
  viewLeadCustomerPersonalMaindata: UcViewGenericObj = new UcViewGenericObj();;
  LeadId: string;
  GetLeadCustByLeadIdUrl: string;
  GetListLeadCustSocmedByLeadCustIdUrl: string;
  MrCustTypeCode: string;
  leadCustObj: LeadCustObj = new LeadCustObj();
  leadCustSocmedObj: LeadCustSocmedObj = new LeadCustSocmedObj();
  tempLeadCustObj: any;
  listLeadCustSocmed: any;
  viewLeadAddressLegal: UcViewGenericObj = new UcViewGenericObj();
  viewLeadAddressResidence: UcViewGenericObj = new UcViewGenericObj();
  viewLeadCustPersonalJobData: UcViewGenericObj = new UcViewGenericObj();
  viewLeadCustPersonalFinData: UcViewGenericObj = new UcViewGenericObj();
  ngOnInit() {
    this.viewLeadCustomerPersonalMaindata.viewInput = "./assets/ucviewgeneric/viewLeadCustomerPersonal.json";
    this.viewLeadCustomerPersonalMaindata.viewEnvironment = environment.losUrl;

    this.viewLeadAddressLegal.viewInput = "./assets/ucviewgeneric/viewLeadAddressLegal.json";
    this.viewLeadAddressLegal.viewEnvironment = environment.losUrl;

    this.viewLeadAddressResidence.viewInput = "./assets/ucviewgeneric/viewLeadAddressResidence.json";
    this.viewLeadAddressResidence.viewEnvironment = environment.losUrl;

    this.viewLeadCustPersonalJobData.viewInput = "./assets/ucviewgeneric/viewLeadCustPersonalJobData.json";
    this.viewLeadCustPersonalJobData.viewEnvironment = environment.losUrl;

    this.viewLeadCustPersonalFinData.viewInput = "./assets/ucviewgeneric/viewLeadCustPersonalFinData.json";
    this.viewLeadCustPersonalFinData.viewEnvironment = environment.losUrl;

    this.leadCustObj.LeadId = this.LeadId;

    this.http.post(this.GetLeadCustByLeadIdUrl, this.leadCustObj).subscribe(
      response => {
        this.tempLeadCustObj = response;
        this.MrCustTypeCode = this.tempLeadCustObj.MrCustTypeCode;
        this.leadCustSocmedObj.LeadCustId = this.tempLeadCustObj.LeadCustId;
        this.http.post(this.GetListLeadCustSocmedByLeadCustIdUrl, this.leadCustSocmedObj).subscribe(
          response => {
            this.listLeadCustSocmed = response[CommonConstant.ReturnObj];
          });
      });
  }
}
