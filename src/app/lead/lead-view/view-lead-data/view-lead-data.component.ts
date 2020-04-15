import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LeadAssetObj } from 'app/shared/model/LeadAssetObj.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';

@Component({
  selector: 'app-view-lead-data',
  templateUrl: './view-lead-data.component.html' 
})
export class ViewLeadDataComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.GetLeadAssetByLeadIdUrl = AdInsConstant.GetLeadAssetByLeadId;
    this.GetLeadByLeadIdUrl = AdInsConstant.GetLeadByLeadId;
  }
  LeadId: any;
  viewLeadAssetDataUsed: any;
  viewLeadAssetDataNew : any;
  viewLeadAppData : any;
  viewLeadAppDataKta :any;
  GetLeadAssetByLeadIdUrl : string;
  GetLeadByLeadIdUrl : string;
  leadAssetObj : any;
  leadObj : any;
  tempLeadAssetObj : any;
  tempLeadObj : any;
  ngOnInit() {
    this.viewLeadAssetDataUsed = "./assets/ucviewgeneric/viewLeadAssetDataUsed.json";
    this.viewLeadAssetDataNew = "./assets/ucviewgeneric/viewLeadAssetDataNew.json";
    this.viewLeadAppData="./assets/ucviewgeneric/viewLeadAppData.json";
    this.viewLeadAppDataKta="./assets/ucviewgeneric/viewLeadAppDataKta.json";
     
    this.leadAssetObj = new LeadAssetObj();
    this.leadAssetObj.LeadId = this.LeadId;

    this.leadObj = new LeadObj();
    this.leadObj.LeadId = this.LeadId;
    this.http.post(this.GetLeadByLeadIdUrl, this.leadObj).subscribe(
      response => {
        this.tempLeadObj = response;      
      });

    this.http.post(this.GetLeadAssetByLeadIdUrl, this.leadAssetObj).subscribe(
      response => {
        this.tempLeadAssetObj = response;     
      });
  }

}
