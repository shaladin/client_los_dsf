import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { DuplicateCustObj } from 'app/shared/model/DuplicateCustObj.Model';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: []
})
export class ListCompanyComponent implements OnInit {

  AppId: number;
  WfTaskListId: number;
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
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService
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
    this.claimTaskService.ClaimTask(this.WfTaskListId);
    //Get App Cust Data
    this.AppCustObj = new AppCustObj();
    this.AppCustCompanyObj = new AppCustCompanyObj();
    this.AppCustAddrObj = new AppCustAddrObj();

    var appObj = { "Id": this.AppId };
    this.http.post(URLConstant.GetCustDataByAppId, appObj).subscribe(
      response => {
        this.AppCustObj = response['AppCustObj'];
        this.RowVersion = response['AppCustObj'].RowVersion;
        this.AppCustCompanyObj = response['AppCustCompanyObj'];
        this.AppCustAddrObj = response['AppCustAddrLegalObj'];

        let requestDupCheck: DuplicateCustObj = new DuplicateCustObj();
        requestDupCheck.CustName = this.AppCustObj.CustName;
        requestDupCheck.MrCustTypeCode = this.AppCustObj.MrCustTypeCode;
        requestDupCheck.MrCustModelCode = this.AppCustObj.MrCustModelCode;
        requestDupCheck.MrIdTypeCode = this.AppCustObj.MrIdTypeCode;
        requestDupCheck.IdNo = this.AppCustObj.IdNo;
        requestDupCheck.TaxIdNo = this.AppCustObj.TaxIdNo;
        requestDupCheck.BirthDt = this.AppCustCompanyObj.EstablishmentDt;
        requestDupCheck.RowVersion = this.RowVersion;

        //List Cust And Negative Cust Dup Check
        this.http.post(URLConstant.GetCustomerAndNegativeCustDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.ListCustomerDuplicate = response[CommonConstant.ReturnObj].CustDuplicate;
            this.ListNegativeCust = response[CommonConstant.ReturnObj].NegativeCustDuplicate;
          });

        //List App Cust Duplicate Checking
        this.http.post(URLConstant.GetAppCustDuplicateCheck, requestDupCheck).subscribe(
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

  back() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING], { "BizTemplateCode": BizTemplateCode });
  }
}
