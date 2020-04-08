import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-fraud-detection-verif',
  templateUrl: './fraud-detection-verif.component.html',
  styleUrls: ['./fraud-detection-verif.component.scss']
})
export class FraudDetectionVerifComponent implements OnInit {

  losUrl = environment.losUrl;
  getCustDataByAppId = AdInsConstant.GetCustDataByAppId;
  getAppDupCheckCustByAppId = AdInsConstant.GetAppDupCheckCustByAppId;
  getFraudDukcapilByIdNo = AdInsConstant.GetFraudDukcapilByIdNo;
  addAppFraudVerf = AdInsConstant.AddAppFraudVerf;
  getLeadByLeadId = AdInsConstant.GetLeadByLeadId;
  appId: any;
  appCustObj: any;
  appCustCompanyObj: any;
  appAssetObj: any;
  leadObj: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    
  }

  GetApp(){
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
    });
    //Get App Cust Data
    this.appCustObj = new AppCustObj();
    this.appAssetObj = new AppAssetObj();
    //this.leadObj = new LeadObj();

    var appObj = { "AppId": this.appId };
    this.http.post(this.getCustDataByAppId, appObj).subscribe(
      response => {
          this.appCustObj = response["AppCustObj"];

      },
      error => {
          console.log("error")
      }
    );
  }

  GetLead(){

  }


}
