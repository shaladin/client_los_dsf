import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.scss']
})
export class ListCompanyComponent implements OnInit {

  AppId: any;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  GetCustomerDuplicateCheckUrl = this.FondationUrl + AdInsConstant.GetCustomerDuplicateCheck;
  GetNegativeCustomerDuplicateCheckUrl = this.FondationUrl + AdInsConstant.GetNegativeCustomerDuplicateCheck;
  GetAppCustDuplicateCheckUrl = this.LOSUrl + AdInsConstant.GetAppCustDuplicateCheck;
  GetCustDataByAppId = AdInsConstant.GetCustDataByAppId;
  AddAppDupCheckCustUrl = this.LOSUrl + AdInsConstant.AddAppDupCheckCust;
  AppCustObj: AppCustObj; 
  AppCustCompanyObj: AppCustCompanyObj;
  AppCustAddrObj: AppCustAddrObj;
  RowVersion: any;
  ListCustomerDuplicate: any;
  ListNegativeCust: any;
  ListAppCustDuplicate: any;


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
    //Get App Cust Data
    this.AppCustObj = new AppCustObj();
    this.AppCustCompanyObj = new AppCustCompanyObj();
    this.AppCustAddrObj = new AppCustAddrObj();

    var appObj = { "AppId": this.AppId };
    this.http.post(this.GetCustDataByAppId, appObj).subscribe(
      response => {
        this.AppCustObj = response['AppCustObj'];
        this.RowVersion = response['AppCustObj'].RowVersion;
        this.AppCustCompanyObj = response['AppCustCompanyObj'];
        this.AppCustAddrObj = response['AppCustAddrLegalObj'];

        var requestDupCheck = {
          "CustName": this.AppCustObj.CustName,
          "MrCustTypeCode": this.AppCustObj.MrCustTypeCode,
          "MrCustModelCode": this.AppCustObj.CustModelCode,
          "MrIdTypeCode": this.AppCustObj.MrIdTypeCode,
          "IdNo": this.AppCustObj.IdNo,
          "TaxIdNo": this.AppCustObj.TaxIdNo,
          "BirthDt" : this.AppCustCompanyObj.EstablishmentDt,
          "MotherMaidenName" : "-",
          "MobilePhnNo1" : "-",      
          "RowVersion": this.RowVersion
        }
        console.log(requestDupCheck);
        //List Cust Duplicate Checking
        this.http.post(this.GetCustomerDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListCustomerDuplicate = response['ReturnObject'];
            
          },
          error => {
            console.log("error");
          }
        );
        //List Negative Cust Duplicate Checking
        this.http.post(this.GetNegativeCustomerDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListNegativeCust = response['ReturnObject'];
          },
          error => {
            console.log("error");
          }
        );

        //List App Cust Duplicate Checking
        this.http.post(this.GetAppCustDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListAppCustDuplicate = response['ReturnObject'];
          },
          error => {
            console.log("error");
          }
        );

      },
      error => {
        console.log("error");
      }

    )

  }

  SelectCust(item) {
    var AppDupCheckObj = {"AppId": this.AppId, 
    "CustNo":item.CustNo, "CustName" : item.CustName,
    "Npwp":item.TaxIdNo, "MrIdType" : item.MrIdTypeCode, 
    "IdNo":item.IdNo, "BirthDt":item.BirthDt, "MobilePhnNo":item.MobilePhnNo1,
     "MotherMaidenName":item.MotherMaidenName, "DuplicateItem":item.DuplicateItem,
     "IsSelected":true
  }
    this.http.post(this.AddAppDupCheckCustUrl, AppDupCheckObj).subscribe(
      response => {
        this.router.navigate(["/AppDupCheck/ApplicantExistingDataCompany"], { queryParams: { "AppId": this.AppId } });
      },
      error => {
        console.log("error");
      });
  }
}
