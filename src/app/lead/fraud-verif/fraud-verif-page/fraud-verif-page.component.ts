import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LeadCustObj } from 'app/shared/model/LeadCustObj.Model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LeadCustPersonalObj } from 'app/shared/model/LeadCustPersonalObj.Model';
import { DuplicateCustObj } from 'app/shared/model/DuplicateCustObj.Model';
import { LeadAssetObj } from 'app/shared/model/LeadAssetObj.Model';

@Component({
  selector: 'app-fraud-verif-page',
  templateUrl: './fraud-verif-page.component.html'
})
export class FraudVerifPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.LeadId = params['LeadId'];
    });
    this.GetLeadCustByLeadIdUrl = AdInsConstant.GetLeadCustByLeadId;
    this.GetLeadCustPersonalByLeadCustIdUrl = AdInsConstant.GetLeadCustPersonalByLeadCustId;
    this.GetCustomerAndNegativeCustDuplicateCheckUrl = AdInsConstant.GetCustomerAndNegativeCustDuplicateCheck;
    this.GetLeadAssetForCheckUrl = AdInsConstant.GetLeadAssetForCheck;
  }
  viewFraudVerification: any;
  DuplicateCustObj: any;
  leadCustObj: any;
  leadAssetObj : any;
  LeadId: any;
  GetLeadCustByLeadIdUrl: string;
  GetLeadCustPersonalByLeadCustIdUrl: any;
  GetCustomerAndNegativeCustDuplicateCheckUrl: string;
  GetLeadAssetForCheckUrl : string;
  tempLeadCustObj: any;
  tempLeadCustPersonalObj: any;
  leadCustPersonalObj: any;
  DuplicateStatus: string;
  ResultDuplicate: any;
  ResultDuplicateNegative: any;
  ngOnInit() {
    this.viewFraudVerification = "./assets/ucviewgeneric/viewFraudVerification.json";

    this.leadCustObj = new LeadCustObj();
    this.leadCustObj.LeadId = this.LeadId;
    this.leadCustPersonalObj = new LeadCustPersonalObj();

    this.http.post(this.GetLeadCustByLeadIdUrl, this.leadCustObj).subscribe(
      (response) => {
        this.tempLeadCustObj = response;
        this.leadCustPersonalObj.LeadCustId = this.tempLeadCustObj.LeadCustId;
        this.http.post(this.GetLeadCustPersonalByLeadCustIdUrl, this.leadCustPersonalObj).subscribe(
          (response) => {
            this.tempLeadCustPersonalObj = response; 
            this.DuplicateCustObj = new DuplicateCustObj();
            this.DuplicateCustObj.CustName = this.tempLeadCustObj.CustName;
            this.DuplicateCustObj.MrCustTypeCode = "PERSONAL";
            this.DuplicateCustObj.IdNo = this.tempLeadCustObj.IdNo;
            this.DuplicateCustObj.TaxIdNo = this.tempLeadCustObj.TaxIdNo;
            this.DuplicateCustObj.BirthDt = this.tempLeadCustPersonalObj.BirthDt;
            this.DuplicateCustObj.MotherMaidenName = this.tempLeadCustPersonalObj.MotherMaidenName;
            this.http.post(this.GetCustomerAndNegativeCustDuplicateCheckUrl, this.DuplicateCustObj).subscribe(
              (response) => {
                this.DuplicateStatus = response["Status"];
                if (this.DuplicateStatus != null && this.DuplicateStatus != undefined) {
                  this.ResultDuplicate = response["ReturnObject"]["CustDuplicate"]; 
                  this.ResultDuplicateNegative = response["ReturnObject"]["NegativeCustDuplicate"]; 
                } 
              }); 

              this.leadAssetObj = new LeadAssetObj();
              this.leadAssetObj.LeadId = this.LeadId;
              this.http.post(this.GetLeadAssetForCheckUrl, this.leadAssetObj).subscribe(
                (response) => {
                  console.log(response);
                }); 
              
          });
      });
 
  }

}
