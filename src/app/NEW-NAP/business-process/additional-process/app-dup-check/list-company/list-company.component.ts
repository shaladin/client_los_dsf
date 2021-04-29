import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ReqGetAppCustDupCheckObj } from 'app/shared/model/Request/NAP/DupCheck/ReqGetCustDupCheckObj.model';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: []
})
export class ListCompanyComponent implements OnInit {

  AppId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  GetCustomerDuplicateCheckUrl = URLConstant.GetCustomerAndNegativeCustDuplicateCheck;
  GetNegativeCustomerDuplicateCheckUrl = this.FondationUrl + URLConstant.GetNegativeCustomerDuplicateCheck;
  GetAppCustDuplicateCheckUrl = this.LOSUrl + URLConstant.GetAppCustDuplicateCheck;
  GetCustDataByAppId = URLConstant.GetCustDataByAppId;
  AddAppDupCheckCustUrl = this.LOSUrl + URLConstant.AddAppDupCheckCust;
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
    private router: Router, private cookieService: CookieService
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

    var appObj = { "Id": this.AppId };
    this.http.post(this.GetCustDataByAppId, appObj).subscribe(
      response => {
        this.AppCustObj = response['AppCustObj'];
        this.RowVersion = response['AppCustObj'].RowVersion;
        this.AppCustCompanyObj = response['AppCustCompanyObj'];
        this.AppCustAddrObj = response['AppCustAddrLegalObj'];

        let requestDupCheck = new ReqGetAppCustDupCheckObj();
        requestDupCheck.CustName = this.AppCustObj.CustName;
        requestDupCheck.MrCustTypeCode = this.AppCustObj.MrCustTypeCode;
        requestDupCheck.MrCustModelCode = this.AppCustObj.MrCustModelCode;
        requestDupCheck.MrIdTypeCode = this.AppCustObj.MrIdTypeCode;
        requestDupCheck.IdNo = this.AppCustObj.IdNo;
        requestDupCheck.TaxIdNo = this.AppCustObj.TaxIdNo;
        requestDupCheck.BirthDt = this.AppCustCompanyObj.EstablishmentDt;
        requestDupCheck.RowVersion = this.RowVersion;
        requestDupCheck.AppId = this.AppCustObj.AppId;

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
  //       this.router.navigate(["/Nap/AddProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "AppId": this.AppId } });
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
  //       this.router.navigate(["/Nap/AddProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "AppId": this.AppId } });
  //     });
  // }

  SelectCust(item) {
    var AppDupCheckObj = {
      "AppId": this.AppId,
      "CustNo": item.CustNo
    };
    this.http.post(URLConstant.EditCustNoAppCust, AppDupCheckObj).subscribe(
      response => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_COY], { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId });
      });
  }

  NewCustomer() {
    var AppDupCheckObj = {
      "AppId": this.AppId,
      "CustNo": this.AppCustObj.CustNo, RowVersion: ""
    };
    this.http.post(URLConstant.EditCustNoAppCust, AppDupCheckObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_COY], { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId });
      });
  }

  ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {

      });
  }

  back() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING], { "BizTemplateCode": BizTemplateCode });
  }
}
