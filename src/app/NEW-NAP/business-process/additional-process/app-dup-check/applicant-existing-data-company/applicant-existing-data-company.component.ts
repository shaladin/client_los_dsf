import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { RequestSubmitAppDupCheckCustObj } from 'app/shared/model/AppDupCheckCust/RequestSubmitAppDupCheckCustObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';

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
  GetAppGuarantorDuplicateCheckUrl = this.LOSUrl + AdInsConstant.GetAppGuarantorDuplicateCheck;
  GetAppShareholderDuplicateCheckUrl = this.LOSUrl + AdInsConstant.GetAppShareholderDuplicateCheck;
  GetCustDataByAppId = AdInsConstant.GetCustDataByAppId;
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

  async ngOnInit() {
    console.log("tes")
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
        this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            this.cust = response;
          },
          (error) => {
            console.log(error);
          }
        );

        this.RowVersion = response['AppCustObj'].RowVersion;
        this.AppCustCompanyObj = response['AppCustCompanyObj'];

        var requestDupCheck = {
          "CustName": this.AppCustObj.CustName,
          "MrCustTypeCode": this.AppCustObj.MrCustTypeCode,
          "MrCustModelCode": this.AppCustObj.CustModelCode,
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
          },
          () => {
            console.log("error")
          }
        );

        //List App Shareholder Duplicate Checking
        this.http.post(this.GetAppShareholderDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListAppShareholderDuplicate = response['ReturnObject'];
            console.log(this.ListAppShareholderDuplicate[0]);
          },
          () => {
            console.log("error")
          }
        );
      },
      () => {
        console.log("error")
      }
    )

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

    this.http.post(AdInsConstant.SubmitAppDupCheck, appDupCheckObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Paging"]);
      },
      (error) => {
        console.log(error);
      });
  }

  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext["UserName"];

    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {

      });
  }

  Back() {
    // this.router.navigateByUrl("/Nap/AdditionalProcess/AppDupCheck/Company?AppId=" + this.AppId + "&WfTaskListId=" + this.WfTaskListId);
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
