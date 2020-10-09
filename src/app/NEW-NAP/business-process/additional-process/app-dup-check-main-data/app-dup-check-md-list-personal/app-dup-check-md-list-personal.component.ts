import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-dup-check-md-list-personal',
  templateUrl: './app-dup-check-md-list-personal.component.html',
  styleUrls: []
})
export class AppDupCheckMdListPersonalComponent implements OnInit {

  AppId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  GetCustomerDuplicateCheckUrl = URLConstant.GetCustomerAndNegativeCustDuplicateCheck;
  GetNegativeCustomerDuplicateCheckUrl = this.FondationUrl + URLConstant.GetNegativeCustomerDuplicateCheck;
  GetAppCustDuplicateCheckUrl = URLConstant.MD_GetAppCustDuplicateCheck;
  AddAppDupCheckCustUrl = URLConstant.MD_AddAppDupCheckCust;
  GetCustDataByAppId = URLConstant.GetAppCustMainDataByAppId;
  AppCustObj: AppCustObj;
  AppCustPersonalObj: AppCustPersonalObj;
  AppCustAddrObj: AppCustAddrObj;
  ListCustomerDuplicate: any;
  ListNegativeCust: any;
  ListAppCustDuplicate: any;
  RowVersion: any;


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
    this.AppCustObj = new AppCustObj();
    this.AppCustPersonalObj = new AppCustPersonalObj();
    this.AppCustAddrObj = new AppCustAddrObj();

    //Get App Cust Data
    var appObj = { "AppId": this.AppId, "IsCustomer":true };
    this.http.post(this.GetCustDataByAppId, appObj).subscribe(
      response => {
        this.AppCustObj = response['AppCustObj'];
        this.RowVersion = response['AppCustObj'].RowVersion;
        this.AppCustPersonalObj = response['AppCustPersonalObj'];
        this.AppCustAddrObj = response['AppCustAddrLegalObj'];

        var requestDupCheck = {
          "CustName": this.AppCustObj.CustName,
          "MrCustTypeCode": this.AppCustObj.MrCustTypeCode,
          "MrCustModelCode": this.AppCustObj.CustModelCode,
          "MrIdTypeCode": this.AppCustObj.MrIdTypeCode,
          "IdNo": this.AppCustObj.IdNo,
          "TaxIdNo": this.AppCustObj.TaxIdNo,
          "BirthDt": this.AppCustPersonalObj.BirthDt,
          "MotherMaidenName": this.AppCustPersonalObj.MotherMaidenName,
          "MobilePhnNo1": this.AppCustPersonalObj.MobilePhnNo1,          
          "RowVersion": this.RowVersion,
          "AppId": this.AppId
        }
        //List Cust Duplicate And List Negative Cust Duplicate Checking
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

  SelectCust(item) {
    var AppDupCheckObj = {"AppId": this.AppId, 
    "CustNo":item.CustNo};
    this.http.post(URLConstant.MD_EditCustNoAppCust, AppDupCheckObj).subscribe(
      response => {
        this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Personal"], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId } });
      });
  }

  NewCustomer(){
    var AppDupCheckObj = {"AppId": this.AppId, 
    "CustNo":this.AppCustObj.CustNo, RowVersion: ""};
    this.http.post(URLConstant.MD_EditCustNoAppCust, AppDupCheckObj).subscribe(
      (response) => {
        this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Personal"], { queryParams: { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId } });
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
