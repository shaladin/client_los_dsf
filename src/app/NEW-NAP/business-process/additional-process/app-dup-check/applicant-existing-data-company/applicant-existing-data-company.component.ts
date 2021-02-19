import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { RequestSubmitAppDupCheckCustObj } from 'app/shared/model/AppDupCheckCust/RequestSubmitAppDupCheckCustObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-applicant-existing-data-company',
  templateUrl: './applicant-existing-data-company.component.html',
  styleUrls: []
})
export class ApplicantExistingDataCompanyComponent implements OnInit {

  AppId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  GetAppGuarantorDuplicateCheckUrl = this.LOSUrl + URLConstant.GetAppGuarantorDuplicateCheck;
  GetAppShareholderDuplicateCheckUrl = this.LOSUrl + URLConstant.GetAppShareholderDuplicateCheck;
  GetCustDataByAppId = URLConstant.GetCustDataByAppId;
  AppCustObj: AppCustObj;
  AppCustCompanyObj: AppCustCompanyObj;
  ListAppGuarantorDuplicate: any;
  ListSpouseDuplicate: any;
  ListAppShareholderDuplicate: any;
  listSelectedIdGuarantor: any;
  checkboxAllGuarantor = false;
  listSelectedIdShareholder: any;
  checkboxAllShareholder = false;
  RowVersion: any;
  cust: any;
  custUrl: string;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NGXToastrService, private cookieService: CookieService
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

  async ngOnInit() {
    this.ClaimTask();
    await this.bindData();
    await this.processData();
  }

  bindData() {

    this.AppCustObj = new AppCustObj();
    this.AppCustCompanyObj = new AppCustCompanyObj();
    this.listSelectedIdGuarantor = new Array();
    this.listSelectedIdShareholder = new Array();
  }

  processData() {


    //Get App Cust Data
    var appObj = { "AppId": this.AppId };
    this.http.post(this.GetCustDataByAppId, appObj).subscribe(
      response => {
        this.AppCustObj = response['AppCustObj'];
        var custObj = { CustNo: this.AppCustObj['CustNo'] };
        this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            this.cust = response;
          }
        );

        this.RowVersion = response['AppCustObj'].RowVersion;
        this.AppCustCompanyObj = response['AppCustCompanyObj'];

        var requestDupCheck = {
          "CustName": this.AppCustObj.CustName,
          "MrCustTypeCode": this.AppCustObj.MrCustTypeCode,
          "MrCustModelCode": this.AppCustObj.MrCustModelCode,
          "MrIdTypeCode": this.AppCustObj.MrIdTypeCode,
          "IdNo": this.AppCustObj.IdNo,
          "TaxIdNo": this.AppCustObj.TaxIdNo,
          "BirthDt": this.AppCustCompanyObj.EstablishmentDt,
          "MotherMaidenName": "-",
          "MobilePhnNo1": "-",
          "RowVersion": this.RowVersion
        }
        //List App guarantor Checking
        this.http.post(this.GetAppGuarantorDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListAppGuarantorDuplicate = response['ReturnObject'];
          }
        );

        //List App Shareholder Duplicate Checking
        this.http.post(this.GetAppShareholderDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListAppShareholderDuplicate = response['ReturnObject'];
          });
      });
  }

  SelectAllGuarantor(condition) {
    this.checkboxAllGuarantor = condition;
    if (condition) {
      for (let i = 0; i < this.ListAppGuarantorDuplicate.length; i++) {
        if (this.listSelectedIdGuarantor.indexOf(this.ListAppGuarantorDuplicate[i].AppGuarantorId) < 0) {
          this.listSelectedIdGuarantor.push(this.ListAppGuarantorDuplicate[i].AppGuarantorId);
        }
      }

    } else {
      for (let i = 0; i < this.ListAppGuarantorDuplicate.length; i++) {
        let index = this.listSelectedIdGuarantor.indexOf(this.ListAppGuarantorDuplicate[i].AppGuarantorId);
        if (index > -1) {
          this.listSelectedIdGuarantor.splice(index, 1);
        }
      }
    }
  }

  CheckedGuarantor(AppGuarantorId: any, isChecked: any): void {
    if (isChecked) {
      this.listSelectedIdGuarantor.push(AppGuarantorId);
    } else {
      const index = this.listSelectedIdGuarantor.indexOf(AppGuarantorId)
      if (index > -1) { this.listSelectedIdGuarantor.splice(index, 1); }
    }
  }

  SelectAllShareholder(condition) {
    this.checkboxAllShareholder = condition;
    if (condition) {
      for (let i = 0; i < this.ListAppShareholderDuplicate.length; i++) {
        if (this.listSelectedIdShareholder.indexOf(this.ListAppShareholderDuplicate[i].AppCustCompanyMgmntShrholderId) < 0) {
          this.listSelectedIdShareholder.push(this.ListAppShareholderDuplicate[i].AppCustCompanyMgmntShrholderId);
        }
      }

    } else {
      for (let i = 0; i < this.ListAppShareholderDuplicate.length; i++) {
        let index = this.listSelectedIdShareholder.indexOf(this.ListAppShareholderDuplicate[i].AppCustCompanyMgmntShrholderId);
        if (index > -1) {
          this.listSelectedIdShareholder.splice(index, 1);
        }
      }
    }
  }

  CheckedShareholder(AppCustCompanyMgmntShrholderId: any, isChecked: any): void {
    if (isChecked) {
      this.listSelectedIdShareholder.push(AppCustCompanyMgmntShrholderId);
    } else {
      const index = this.listSelectedIdShareholder.indexOf(AppCustCompanyMgmntShrholderId)
      if (index > -1) { this.listSelectedIdShareholder.splice(index, 1); }
    }
  }

  Submit() {
    var appDupCheckObj = new RequestSubmitAppDupCheckCustObj();
    appDupCheckObj.AppGuarantorIds = this.listSelectedIdGuarantor;
    appDupCheckObj.AppCustCompanyMgmntShrholderIds = this.listSelectedIdShareholder;
    appDupCheckObj.CustNo = this.AppCustObj.CustNo;
    appDupCheckObj.AppId = this.AppId;
    appDupCheckObj.WfTaskListId = this.WfTaskListId;

    this.http.post(URLConstant.SubmitAppDupCheck, appDupCheckObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING], {});
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

  Back() {
    // this.router.navigateByUrl("/Nap/AddProcess/AppDupCheck/Company?AppId=" + this.AppId + "&WfTaskListId=" + this.WfTaskListId);
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING], { "BizTemplateCode": BizTemplateCode });

  }

  OpenView(key: string, value: number) {
    if (key == "app") {
      AdInsHelper.OpenAppViewByAppId(value);
    } else if (key == "cust") {
      AdInsHelper.OpenCustomerViewByCustId(this.cust.CustId);
    }
  }
}
