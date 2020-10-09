import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-dup-check-md-list-company',
  templateUrl: './app-dup-check-md-list-company.component.html',
  styleUrls: []
})
export class AppDupCheckMdListCompanyComponent implements OnInit {

  AppId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  GetCustomerDuplicateCheckUrl = URLConstant.GetCustomerAndNegativeCustDuplicateCheck;
  GetNegativeCustomerDuplicateCheckUrl = this.FondationUrl + URLConstant.GetNegativeCustomerDuplicateCheck;
  GetAppCustDuplicateCheckUrl = URLConstant.MD_GetAppCustDuplicateCheck;
  GetCustDataByAppId = URLConstant.GetAppCustMainDataByAppId;
  AddAppDupCheckCustUrl = URLConstant.MD_AddAppDupCheckCust;
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
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
    });
  }

  ngOnInit() {
    this.ClaimTask();
    //Get App Cust Data
    this.AppCustObj = new AppCustObj();
    this.AppCustCompanyObj = new AppCustCompanyObj();
    this.AppCustAddrObj = new AppCustAddrObj();

    var appObj = { "AppId": this.AppId, "IsCustomer":true };
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
          "RowVersion": this.RowVersion,
          "AppId": this.AppId
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
    var AppDupCheckObj = {"AppId": this.AppId, 
    "CustNo":item.CustNo};
    this.http.post(URLConstant.MD_EditCustNoAppCust, AppDupCheckObj).subscribe(
      response => {
        this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId } });
      });
  }

  NewCustomer(){
    var AppDupCheckObj = {"AppId": this.AppId, 
    "CustNo": this.AppCustObj.CustNo, RowVersion: ""};
    this.http.post(URLConstant.MD_EditCustNoAppCust, AppDupCheckObj).subscribe(
      (response) => {
        this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId } });
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
