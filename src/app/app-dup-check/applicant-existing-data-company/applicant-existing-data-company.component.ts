import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-applicant-existing-data-company',
  templateUrl: './applicant-existing-data-company.component.html',
  styleUrls: ['./applicant-existing-data-company.component.scss']
})
export class ApplicantExistingDataCompanyComponent implements OnInit {

  AppId: any;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  GetAppGuarantorDuplicateCheckUrl = this.LOSUrl + AdInsConstant.GetAppGuarantorDuplicateCheck;
  GetAppShareholderDuplicateCheckUrl = this.LOSUrl + AdInsConstant.GetAppShareholderDuplicateCheck;
  GetCustDataByAppId = AdInsConstant.GetCustDataByAppId;
  AppCustObj : AppCustObj;
  AppCustPersonalObj : AppCustPersonalObj;
  ListAppGuarantorDuplicate : any;
  ListSpouseDuplicate : any;
  ListAppShareholderDuplicate : any;
  listSelectedIdGuarantor: any;
  checkboxAllGuarantor: false;
  listSelectedIdShareholder: any;
  checkboxAllShareholder: false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
    //Get App Cust Data
    var appObj = { "AppId": this.AppId };
    this.http.post(this.GetCustDataByAppId, appObj).subscribe(
      response => {
        this.AppCustObj = response['AppCustObj'];
        this.AppCustPersonalObj = response['AppCustPersonalObj'];
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    )
    var requestDupCheck = {    "CustName": this.AppCustObj.CustName,
    "MrCustTypeCode" : this.AppCustObj.MrCustTypeCode,
    "MrCustModelCode" : this.AppCustObj.CustModelCode,
    "MrIdTypeCode" : this.AppCustObj.MrIdTypeCode,
    "IdNo" : this.AppCustObj.IdNo,
    "TaxIdNo" : this.AppCustObj.TaxIdNo,
    "BirthDt" : this.AppCustPersonalObj.BirthDt,
    "MotherMaidenName" : this.AppCustPersonalObj.MotherMaidenName,
    "MobilePhnNo1" : this.AppCustPersonalObj.MobilePhnNo1}
    //List App guarantor Checking
    this.http.post(this.GetAppGuarantorDuplicateCheckUrl, requestDupCheck).subscribe(
      response => {
        this.ListAppGuarantorDuplicate = response['ReturnObject'];
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );

    //List App Shareholder Duplicate Checking
    this.http.post(this.GetAppShareholderDuplicateCheckUrl, requestDupCheck).subscribe(
      response => {
        this.ListAppShareholderDuplicate = response['ReturnObject'];
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
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
}
