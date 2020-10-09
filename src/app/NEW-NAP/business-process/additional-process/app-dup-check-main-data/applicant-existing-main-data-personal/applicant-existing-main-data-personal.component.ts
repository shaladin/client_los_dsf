import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { RequestSubmitAppDupCheckCustObj } from 'app/shared/model/AppDupCheckCust/RequestSubmitAppDupCheckCustObj.Model'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-applicant-existing-main-data-personal',
  templateUrl: './applicant-existing-main-data-personal.component.html',
  styleUrls: []
})
export class ApplicantExistingMainDataPersonalComponent implements OnInit {

  AppId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  GetAppGuarantorDuplicateCheckUrl = URLConstant.MD_GetAppGuarantorDuplicateCheck;
  GetSpouseDuplicateCheckUrl = URLConstant.MD_GetSpouseDuplicateCheck;
  GetAppShareholderDuplicateCheckUrl = URLConstant.MD_GetAppShareholderDuplicateCheck;
  GetCustDataByAppId = URLConstant.GetAppCustMainDataByAppId;
  AppCustObj: AppCustObj;
  AppCustPersonalObj: AppCustPersonalObj;
  ListAppGuarantorDuplicate: any;
  ListSpouseDuplicate: any;
  ListAppShareholderDuplicate: any;
  listSelectedIdGuarantor: any;
  checkboxAllGuarantor: false;
  listSelectedIdSpouse: any;
  checkboxAllSpouse: false;
  listSelectedIdShareholder: any;
  checkboxAllShareholder: false;
  RowVersion: any;
  cust: any;
  custUrl: string;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NGXToastrService
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
    this.listSelectedIdGuarantor = new Array();
    this.listSelectedIdSpouse = new Array();
    this.listSelectedIdShareholder = new Array();

    //Get App Cust Data
    var appObj = { "AppId": this.AppId, "IsCustomer":true };
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
        this.AppCustPersonalObj = response['AppCustPersonalObj'];

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
          "RowVersion": this.RowVersion
        }
        //List App guarantor Checking
        this.http.post(this.GetAppGuarantorDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListAppGuarantorDuplicate = response['ReturnObject'];
          });
        //List Spouse Duplicate Checking
        this.http.post(this.GetSpouseDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListSpouseDuplicate = response['ReturnObject'];
          });

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

  SelectAllSpouse(condition) {
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

  CheckedSpouse(AppCustPersonalConstactPersonId: any, isChecked: any): void {
    if (isChecked) {
      this.listSelectedIdSpouse.push(AppCustPersonalConstactPersonId);
    } else {
      const index = this.listSelectedIdSpouse.indexOf(AppCustPersonalConstactPersonId)
      if (index > -1) { this.listSelectedIdSpouse.splice(index, 1); }
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
    appDupCheckObj.AppCustPersonalContactPersonIds = this.listSelectedIdSpouse;
    appDupCheckObj.CustNo = this.AppCustObj.CustNo;
    appDupCheckObj.AppId = this.AppId;
    appDupCheckObj.WfTaskListId = this.WfTaskListId;

    this.http.post(URLConstant.MD_SubmitAppDupCheck, appDupCheckObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Paging"]);
      });

  }

  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {

      });
  }
  Back() {
    // this.router.navigateByUrl("/Nap/AdditionalProcess/AppDupCheck/Personal?AppId=" + this.AppId + "&WfTaskListId=" + this.WfTaskListId);
    var BizTemplateCode = localStorage.getItem("BizTemplateCode")
    this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Paging"], { queryParams: { "BizTemplateCode": BizTemplateCode } });
  }

  OpenView(key: string, value: number){
    if(key == "app"){
      AdInsHelper.OpenAppViewByAppId(value);
    }else if( key == "cust"){
        AdInsHelper.OpenCustomerViewByCustId(this.cust.CustId);
    }
  }
}
