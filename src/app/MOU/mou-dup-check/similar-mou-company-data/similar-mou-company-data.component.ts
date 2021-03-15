import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { MouCustCompanyObj } from 'app/shared/model/MouCustCompanyObj.Model';
import { MouCustAddrObj } from 'app/shared/model/MouCustAddrObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-similar-mou-company-data',
  templateUrl: './similar-mou-company-data.component.html',
  styleUrls: ['./similar-mou-company-data.component.scss']
})
export class SimilarMouCompanyDataComponent implements OnInit {

  MouCustId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  GetCustomerDuplicateCheckUrl = URLConstant.GetCustomerAndNegativeCustDuplicateCheck;
  GetNegativeCustomerDuplicateCheckUrl = this.FondationUrl + URLConstant.GetNegativeCustomerDuplicateCheck;
  GetAppCustDuplicateCheckUrl = this.LOSUrl + URLConstant.GetAppCustDuplicateCheck;
  AddAppDupCheckCustUrl = this.LOSUrl + URLConstant.AddAppDupCheckCust;
  MouCustObj: MouCustObj; 
  MouCustCompanyObj: MouCustCompanyObj;
  MouCustAddrObj: MouCustAddrObj;
  RowVersion: any;
  ListCustomerDuplicate: any;
  ListNegativeCust: any;
  ListAppCustDuplicate: any;
  ListMouCustDuplicate: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
    });
  }

  ngOnInit() {
    //Get Mou Cust Data
    this.MouCustObj = new MouCustObj();
    this.MouCustCompanyObj = new MouCustCompanyObj();
    this.MouCustAddrObj = new MouCustAddrObj();

    this.http.post(URLConstant.GetMouCustByMouCustId, { "MouCustId": this.MouCustId }).subscribe(
      response => {
        this.MouCustObj = response['MouCustObj'];
        this.RowVersion = response['MouCustObj'].RowVersion;
        this.MouCustCompanyObj = response['MouCustCompanyObj'];
        this.MouCustAddrObj = response['MouCustAddrLegalObj'];

        var requestDupCheck = {
          "CustName": this.MouCustObj.CustName,
          "MrCustTypeCode": this.MouCustObj.MrCustTypeCode,
          "MrCustModelCode": this.MouCustObj.CustModelCode,
          "MrIdTypeCode": this.MouCustObj.MrIdTypeCode,
          "IdNo": this.MouCustObj.IdNo,
          "TaxIdNo": this.MouCustObj.TaxIdNo,
          "BirthDt" : this.MouCustCompanyObj.EstablishmentDt,
          "MotherMaidenName" : "-",
          "MobilePhnNo1" : "-",
          "RowVersion": this.RowVersion,
          "MouCustId": this.MouCustId
        }
        //List Cust And Negative Cust Dup Check
        this.http.post(this.GetCustomerDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListCustomerDuplicate = response[CommonConstant.ReturnObj].CustDuplicate;
            this.ListNegativeCust = response[CommonConstant.ReturnObj].NegativeCustDuplicate;
          });

        //List App Cust Duplicate Checking
        this.http.post(this.GetAppCustDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListAppCustDuplicate = response[CommonConstant.ReturnObj];
          });

        //List Mou Cust Duplicate Checking
        this.http.post(URLConstant.GetMouCustDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.ListMouCustDuplicate = response[CommonConstant.ReturnObj];
          });
      });

  }

  SelectCust(item) {
    this.http.post(URLConstant.EditCustNoMouCust, {"MouCustId": this.MouCustId, 
    "CustNo":item.CustNo , "ApplicantNo":item.ApplicantNo}).subscribe(
      response => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DUP_CHECK_EXIST_COY],{ "MouCustId": this.MouCustId, "WfTaskListId": this.WfTaskListId });
      });
  }

  NewCustomer(){
    this.http.post(URLConstant.EditCustNoMouCust, {"MouCustId": this.MouCustId, 
    "CustNo":this.MouCustObj.ApplicantNo, "ApplicantNo":this.MouCustObj.ApplicantNo, RowVersion: ""}).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DUP_CHECK_EXIST_COY],{ "MouCustId": this.MouCustId, "WfTaskListId": this.WfTaskListId });
      });
  }

  back() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DUP_CHECK_PAGING],{});
  }
}
