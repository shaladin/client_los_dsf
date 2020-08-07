import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { MouCustCompanyObj } from 'app/shared/model/MouCustCompanyObj.Model';
import { MouCustAddrObj } from 'app/shared/model/MouCustAddrObj.Model';

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
  GetCustDataByAppId = URLConstant.GetCustDataByAppId;
  AddAppDupCheckCustUrl = this.LOSUrl + URLConstant.AddAppDupCheckCust;
  GetMouCustDuplicateCheckUrl = "";
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
      if (params['mouCustId'] != null) {
        this.MouCustId = params['mouCustId'];
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
    });
  }

  ngOnInit() {
    this.ClaimTask();
    //Get App Cust Data
    this.MouCustObj = new MouCustObj();
    this.MouCustCompanyObj = new MouCustCompanyObj();
    this.MouCustAddrObj = new MouCustAddrObj();

    var appObj = { "MouCustId": this.MouCustId };
    this.http.post(this.GetCustDataByAppId, appObj).subscribe(
      response => {
        this.MouCustObj = response['MouCustObj'];
        this.RowVersion = response['MouCustObj'].RowVersion;
        this.MouCustCompanyObj = response['MouCustCompanyObj'];
        this.MouCustAddrObj = response['AppCustAddrLegalObj'];

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
        this.http.post(this.GetMouCustDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListMouCustDuplicate = response[CommonConstant.ReturnObj];
          });
      });

  }

  // SelectCust(item) {
  //   var AppDupCheckObj = {"AppId": this.AppId, 
  //   "CustNo":item.CustNo, "CustName" : item.CustName,
  //   "Npwp":item.TaxIdNo, "MrIdType" : item.MrIdTypeCode, 
  //   "IdNo":item.IdNo, "BirthDt":item.BirthDt, "MobilePhnNo":item.MobilePhnNo1,
  //    "MotherMaidenName":item.MotherMaidenName, "DuplicateItem":item.DuplicateItem,
  //    "IsSelected":true
  // }
  //   this.http.post(this.AddAppDupCheckCustUrl, AppDupCheckObj).subscribe(
  //     response => {
  //       this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "AppId": this.AppId } });
  //     });
  // }

  // SelectCust(item) {
  //   var AppDupCheckObj = {"AppId": this.AppId, 
  //   "CustNo":item.CustNo, "CustName" : item.CustName,
  //   "Npwp":item.TaxIdNo, "MrIdType" : item.MrIdTypeCode, 
  //   "IdNo":item.IdNo, "BirthDt":item.BirthDt, "MobilePhnNo":item.MobilePhnNo1,
  //    "MotherMaidenName":item.MotherMaidenName, "DuplicateItem":item.DuplicateItem,
  //    "IsSelected":true
  // }
  //   this.http.post(this.AddAppDupCheckCustUrl, AppDupCheckObj).subscribe(
  //     response => {
  //       this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "AppId": this.AppId } });
  //     });
  // }

  SelectCust(item) {
    var AppDupCheckObj = {"MouCustId": this.MouCustId, 
    "CustNo":item.CustNo};
    this.http.post(URLConstant.EditCustNoAppCust, AppDupCheckObj).subscribe(
      response => {
        this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "MouCustId": this.MouCustId, "WfTaskListId": this.WfTaskListId } });
      });
  }

  NewCustomer(){
    var AppDupCheckObj = {"MouCustId": this.MouCustId, 
    "CustNo": this.MouCustObj.CustNo, RowVersion: ""};
    this.http.post(URLConstant.EditCustNoAppCust, AppDupCheckObj).subscribe(
      (response) => {
        this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "MouCustId": this.MouCustId, "WfTaskListId": this.WfTaskListId } });
      });
  }

  ClaimTask(){
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
    
      });
  }

  back() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Paging"], { queryParams: { "BizTemplateCode": BizTemplateCode } });
  }
}
