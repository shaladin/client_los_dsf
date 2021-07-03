import { Component, OnInit } from '@angular/core';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { DuplicateCustObj } from 'app/shared/model/DuplicateCustObj.Model';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-list-personal',
  templateUrl: './list-personal.component.html',
  styleUrls: []
})
export class ListPersonalComponent implements OnInit {

  AppId: number;
  WfTaskListId: number;
  AppCustObj: AppCustObj;
  AppCustPersonalObj: AppCustPersonalObj;
  AppCustAddrObj: AppCustAddrObj;
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
    this.AppCustObj = new AppCustObj();
    this.AppCustPersonalObj = new AppCustPersonalObj();
    this.AppCustAddrObj = new AppCustAddrObj();

    //Get App Cust Data
    var appObj = { "Id": this.AppId };
    this.http.post(URLConstant.GetCustDataByAppId, appObj).subscribe(
      response => {
        this.AppCustObj = response['AppCustObj'];
        this.AppCustPersonalObj = response['AppCustPersonalObj'];
        this.AppCustAddrObj = response['AppCustAddrLegalObj'];

        let requestDupCheck: DuplicateCustObj = new DuplicateCustObj();
        requestDupCheck.CustName = this.AppCustObj.CustName;
        requestDupCheck.MrCustTypeCode = this.AppCustObj.MrCustTypeCode;
        requestDupCheck.MrCustModelCode = this.AppCustObj.MrCustModelCode;
        requestDupCheck.MrIdTypeCode = this.AppCustObj.MrIdTypeCode;
        requestDupCheck.IdNo = this.AppCustObj.IdNo;
        requestDupCheck.TaxIdNo = this.AppCustObj.TaxIdNo;
        requestDupCheck.BirthDt = this.AppCustPersonalObj.BirthDt;
        requestDupCheck.MotherMaidenName = this.AppCustPersonalObj.MotherMaidenName;
        requestDupCheck.MobilePhnNo1 = this.AppCustPersonalObj.MobilePhnNo1;
        requestDupCheck.RowVersion = response['AppCustObj'].RowVersion;
        requestDupCheck.AppId = this.AppId;

        //List Cust Duplicate And List Negative Cust Duplicate Checking
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

  SelectCust(item) {
    var AppDupCheckObj = {
      "AppId": this.AppId,
      "CustNo": item.CustNo
    };
    this.http.post(URLConstant.EditCustNoAppCust, AppDupCheckObj).subscribe(
      response => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL], { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId });
      });
  }

  NewCustomer() {
    var AppDupCheckObj = {
      "AppId": this.AppId,
      "CustNo": this.AppCustObj.CustNo, RowVersion: ""
    };
    this.http.post(URLConstant.EditCustNoAppCust, AppDupCheckObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL], { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId });
      });
  }

  back() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING], { "BizTemplateCode": BizTemplateCode });
  }

}
