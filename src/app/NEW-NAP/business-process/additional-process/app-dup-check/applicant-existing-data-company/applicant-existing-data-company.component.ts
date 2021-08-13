import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { RequestSubmitAppDupCheckCustObj } from 'app/shared/model/AppDupCheckCust/RequestSubmitAppDupCheckCustObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetCustDupCheckObj } from 'app/shared/model/Request/NAP/DupCheck/ReqGetCustDupCheckObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { CustObj } from 'app/shared/model/CustObj.Model';

@Component({
  selector: 'app-applicant-existing-data-company',
  templateUrl: './applicant-existing-data-company.component.html',
  styleUrls: []
})
export class ApplicantExistingDataCompanyComponent implements OnInit {

  AppId: number;
  WfTaskListId: number;
  AppCustObj: AppCustObj;
  AppCustCompanyObj: AppCustCompanyObj;
  ListAppShareholderDuplicate: any;
  listSelectedIdShareholder: Array<number>;
  checkboxAllShareholder = false;
  cust: CustObj;
  CustNoObj: GenericObj = new GenericObj();
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NGXToastrService, 
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

  async ngOnInit() {
    this.claimTaskService.ClaimTask(this.WfTaskListId);
    await this.bindData();
    await this.processData();
  }

  bindData() {

    this.AppCustObj = new AppCustObj();
    this.AppCustCompanyObj = new AppCustCompanyObj();
    this.listSelectedIdShareholder = new Array();
  }

  processData() {


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

        this.AppCustCompanyObj = response['AppCustCompanyObj'];

        let requestDupCheck = new ReqGetCustDupCheckObj();
        requestDupCheck.CustName = this.AppCustObj.CustName;
        requestDupCheck.MrCustTypeCode = this.AppCustObj.MrCustTypeCode;
        requestDupCheck.MrCustModelCode = this.AppCustObj.MrCustModelCode;
        requestDupCheck.MrIdTypeCode = this.AppCustObj.MrIdTypeCode;
        requestDupCheck.IdNo = this.AppCustObj.IdNo;
        requestDupCheck.TaxIdNo = this.AppCustObj.TaxIdNo;
        requestDupCheck.BirthDt = this.AppCustCompanyObj.EstablishmentDt;
        requestDupCheck.MobilePhnNo1 = "-";
        requestDupCheck.RowVersion = response['AppCustObj'].RowVersion;

        //List App Shareholder Duplicate Checking
        this.http.post(URLConstant.GetAppShareholderDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.ListAppShareholderDuplicate = response['ReturnObject'];
          });
      });
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
    appDupCheckObj.CustNo = this.AppCustObj.CustNo;
    appDupCheckObj.AppId = this.AppId;
    appDupCheckObj.WfTaskListId = this.WfTaskListId;

    this.http.post(URLConstant.SubmitAppDupCheck, appDupCheckObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_PAGING], {});
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
