import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LeadAssetObj } from 'app/shared/model/Request/LEAD/LeadAssetObj.model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-lead-data',
  templateUrl: './view-lead-data.component.html' 
})
export class ViewLeadDataComponent implements OnInit {
  viewLeadAssetData: UcViewGenericObj = new UcViewGenericObj();
  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.GetLeadAssetByLeadIdUrl = URLConstant.GetLeadAssetByLeadId;
    this.GetLeadByLeadIdUrl = URLConstant.GetLeadByLeadId;
  }
  LeadId: number;
  viewLeadAppData : UcViewGenericObj = new UcViewGenericObj();
  GetLeadAssetByLeadIdUrl : string;
  GetLeadByLeadIdUrl : string;
  leadAssetObj : LeadAssetObj;
  leadObj : LeadObj;
  tempLeadAssetObj : any;
  tempLeadObj : any;
  ngOnInit() {
    this.viewLeadAssetData.viewInput = "./assets/ucviewgeneric/viewLeadAssetData.json";
    this.viewLeadAssetData.viewEnvironment = environment.losUrl;

    this.viewLeadAppData.viewInput = "./assets/ucviewgeneric/viewLeadAppData.json";
    this.viewLeadAppData.viewEnvironment = environment.losUrl;
     
    this.leadAssetObj = new LeadAssetObj();
    this.leadAssetObj.LeadId = this.LeadId;

    this.leadObj = new LeadObj();
    this.leadObj.LeadId = this.LeadId;
    var leadObj = { Id: this.LeadId };
    this.http.post(this.GetLeadByLeadIdUrl, leadObj).subscribe(
      response => {
        this.tempLeadObj = response;      
      });
    var leadAssetObj = { Id: this.LeadId };
    this.http.post(this.GetLeadAssetByLeadIdUrl, leadAssetObj).subscribe(
      response => {
        this.tempLeadAssetObj = response;     
      });
  }
}