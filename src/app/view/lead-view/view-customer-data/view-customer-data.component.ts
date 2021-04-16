import { Component, OnInit } from '@angular/core';
import { LeadCustObj } from 'app/shared/model/Request/LEAD/LeadCustObj.model';
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

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.GetLeadCustByLeadIdUrl = URLConstant.GetLeadCustByLeadId;
    this.GetListLeadCustSocmedByLeadCustIdUrl = URLConstant.GetListLeadCustSocmedByLeadCustId;
  }
  
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

    var obj = { Id: this.LeadId };
    this.http.post(this.GetLeadCustByLeadIdUrl, obj).subscribe(
      response => {
        this.tempLeadCustObj = response;
        this.MrCustTypeCode = this.tempLeadCustObj.MrCustTypeCode;
        this.leadCustSocmedObj.LeadCustId = this.tempLeadCustObj.LeadCustId;
        var objListLeadCustSocmed = { Id: this.tempLeadCustObj.LeadCustId };
        this.http.post(this.GetListLeadCustSocmedByLeadCustIdUrl, objListLeadCustSocmed).subscribe(
          response => {
            this.listLeadCustSocmed = response[CommonConstant.ReturnObj];
          }
        );
      }
    );
  }
}