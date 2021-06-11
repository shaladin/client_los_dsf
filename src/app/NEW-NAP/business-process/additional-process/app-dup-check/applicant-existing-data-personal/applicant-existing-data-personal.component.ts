import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { RequestSubmitAppDupCheckCustObj } from 'app/shared/model/AppDupCheckCust/RequestSubmitAppDupCheckCustObj.Model'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetCustDupCheckObj } from 'app/shared/model/Request/NAP/DupCheck/ReqGetCustDupCheckObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { CustObj } from 'app/shared/model/CustObj.Model';

@Component({
  selector: 'app-applicant-existing-data-personal',
  templateUrl: './applicant-existing-data-personal.component.html',
  styleUrls: []
})
export class ApplicantExistingDataPersonalComponent implements OnInit {

  AppId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  AppCustObj: AppCustObj;
  AppCustPersonalObj: AppCustPersonalObj;
  ListSpouseDuplicate: any;
  ListAppShareholderDuplicate: any;
  listSelectedIdSpouse: Array<number>;
  checkboxAllSpouse: boolean;
  listSelectedIdShareholder: Array<number>;
  checkboxAllShareholder: boolean;
  cust: CustObj;
  CustNoObj: GenericObj = new GenericObj();
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

  ngOnInit() {

    this.ClaimTask();

    this.AppCustObj = new AppCustObj();
    this.AppCustPersonalObj = new AppCustPersonalObj();
    this.listSelectedIdSpouse = new Array();
    this.listSelectedIdShareholder = new Array();

    //Get App Cust Data
    var appObj = { "Id": this.AppId };
    this.http.post(URLConstant.GetCustDataByAppId, appObj).subscribe(
      response => {
        this.AppCustObj = response['AppCustObj'];

        this.CustNoObj.CustNo = this.AppCustObj['CustNo'];
        this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
          (response: CustObj) => {
            this.cust = response;
          }
        );

        this.AppCustPersonalObj = response['AppCustPersonalObj'];

        let requestDupCheck = new ReqGetCustDupCheckObj();
        requestDupCheck.CustName = this.AppCustObj.CustName;
        requestDupCheck.MrCustTypeCode = this.AppCustObj.MrCustTypeCode;
        requestDupCheck.MrCustModelCode = this.AppCustObj.MrCustModelCode;
        requestDupCheck.MrIdTypeCode = this.AppCustObj.MrIdTypeCode;
        requestDupCheck.IdNo = this.AppCustObj.IdNo;
        requestDupCheck.TaxIdNo = this.AppCustObj.TaxIdNo;
        requestDupCheck.BirthDt = this.AppCustPersonalObj.BirthDt;
        requestDupCheck.MobilePhnNo1 = this.AppCustPersonalObj.MobilePhnNo1;
        requestDupCheck.RowVersion = response['AppCustObj'].RowVersion;

        //List Spouse Duplicate Checking
        this.http.post(URLConstant.GetSpouseDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.ListSpouseDuplicate = response['ReturnObject'];
          });

        //List App Shareholder Duplicate Checking
        this.http.post(URLConstant.GetAppShareholderDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.ListAppShareholderDuplicate = response['ReturnObject'];
          });
      });

  }

  SelectAllSpouse(condition: boolean) {
    this.checkboxAllSpouse = condition;
    if (condition) {
      for (let i = 0; i < this.ListSpouseDuplicate.length; i++) {
        if (this.listSelectedIdSpouse.indexOf(this.ListSpouseDuplicate[i].AppCustPersonalConstactPersonId) < 0) {
          this.listSelectedIdSpouse.push(this.ListSpouseDuplicate[i].AppCustPersonalConstactPersonId);
        }
      }

    } else {
      for (let i = 0; i < this.ListSpouseDuplicate.length; i++) {
        let index = this.listSelectedIdSpouse.indexOf(this.ListSpouseDuplicate[i].AppCustPersonalConstactPersonId);
        if (index > -1) {
          this.listSelectedIdSpouse.splice(index, 1);
        }
      }
    }
  }

  CheckedSpouse(AppCustPersonalConstactPersonId: number, isChecked: boolean): void {
    if (isChecked) {
      this.listSelectedIdSpouse.push(AppCustPersonalConstactPersonId);
    } else {
      const index = this.listSelectedIdSpouse.indexOf(AppCustPersonalConstactPersonId)
      if (index > -1) { this.listSelectedIdSpouse.splice(index, 1); }
    }
  }

  SelectAllShareholder(condition: boolean) {
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

  CheckedShareholder(AppCustCompanyMgmntShrholderId: number, isChecked: boolean): void {
    if (isChecked) {
      this.listSelectedIdShareholder.push(AppCustCompanyMgmntShrholderId);
    } else {
      const index = this.listSelectedIdShareholder.indexOf(AppCustCompanyMgmntShrholderId)
      if (index > -1) { this.listSelectedIdShareholder.splice(index, 1); }
    }
  }

  Submit() {
    var appDupCheckObj = new RequestSubmitAppDupCheckCustObj();
    appDupCheckObj.AppCustCompanyMgmntShrholderIds = this.listSelectedIdShareholder;
    appDupCheckObj.AppCustPersonalContactPersonIds = this.listSelectedIdSpouse;
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
    // this.router.navigateByUrl("/Nap/AddProcess/AppDupCheck/Personal?AppId=" + this.AppId + "&WfTaskListId=" + this.WfTaskListId);
    var BizTemplateCode = localStorage.getItem("BizTemplateCode")
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
