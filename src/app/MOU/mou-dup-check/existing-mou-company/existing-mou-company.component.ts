import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { RequestSubmitMouCustDupCheckObj } from 'app/shared/model/MouCustDupCheck/RequestSubmitMouCustDupCheckObj.Model';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { MouCustCompanyObj } from 'app/shared/model/MouCustCompanyObj.Model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-existing-mou-company',
  templateUrl: './existing-mou-company.component.html',
  styleUrls: ['./existing-mou-company.component.scss']
})
export class ExistingMouCompanyComponent implements OnInit {
  MouCustId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  LOSUrl = environment.losUrl;
  GetAppGuarantorDuplicateCheckUrl = this.LOSUrl + URLConstant.GetAppGuarantorDuplicateCheck;
  GetAppShareholderDuplicateCheckUrl = this.LOSUrl + URLConstant.GetAppShareholderDuplicateCheck;
  MouCustObj: MouCustObj;
  MouCustCompanyObj: MouCustCompanyObj;
  ListDuplicateAppGuarantor: any;
  ListDuplicateMouGuarantor: any;
  ListDuplicateAppShareholder: any;
  ListDuplicateMouShareholder: any;
  ListSelectedIdAppGuarantor: any;
  ListSelectedIdAppShareholder: any;
  ListSelectedIdMouGuarantor: any;
  ListSelectedIdMouShareholder: any;
  checkboxAllGuarantor = false;
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
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
    });
  }

  async ngOnInit() {
    this.MouCustObj = new MouCustObj();
    this.MouCustCompanyObj = new MouCustCompanyObj();
    this.ListSelectedIdAppGuarantor = new Array();
    this.ListSelectedIdAppShareholder = new Array();
    this.ListSelectedIdMouGuarantor = new Array();
    this.ListSelectedIdMouShareholder = new Array();

    //Get Mou Cust Data
    this.http.post(URLConstant.GetMouCustByMouCustId, { "MouCustId": this.MouCustId }).subscribe(
      response => {
        this.MouCustObj = response['MouCustObj'];
        var custObj = { CustNo: this.MouCustObj['CustNo'] };
        this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            this.cust = response;
          }
        );

        this.RowVersion = response['MouCustObj'].RowVersion;
        this.MouCustCompanyObj = response['MouCustCompanyObj'];

        var requestDupCheck = {
          "CustName": this.MouCustObj.CustName,
          "MrCustTypeCode": this.MouCustObj.MrCustTypeCode,
          "MrCustModelCode": this.MouCustObj.CustModelCode,
          "MrIdTypeCode": this.MouCustObj.MrIdTypeCode,
          "IdNo": this.MouCustObj.IdNo,
          "TaxIdNo": this.MouCustObj.TaxIdNo,
          "BirthDt": this.MouCustCompanyObj.EstablishmentDt,
          "MotherMaidenName": "-",
          "MobilePhnNo1": "-",
          "RowVersion": this.RowVersion
        }

        //List App guarantor Checking
        this.http.post(this.GetAppGuarantorDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListDuplicateAppGuarantor = response['ReturnObject'];
          }
        );

        //List App Shareholder Duplicate Checking
        this.http.post(this.GetAppShareholderDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.ListDuplicateAppShareholder = response['ReturnObject'];
          });

        //List Mou Guarantor Checking
        this.http.post(URLConstant.GetMouGuarantorDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.ListDuplicateMouGuarantor = response['ReturnObject'];
          });

        //List Mou Shareholder Duplicate Checking
        this.http.post(URLConstant.GetMouShareholderDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.ListDuplicateMouShareholder = response['ReturnObject'];
          });
      });
  }

  SelectAllGuarantor(condition) {
    this.checkboxAllGuarantor = condition;
    if (condition) {
      for (let i = 0; i < this.ListDuplicateAppGuarantor.length; i++) {
        if (this.ListSelectedIdAppGuarantor.indexOf(this.ListDuplicateAppGuarantor[i].AppGuarantorId) < 0) {
          this.ListSelectedIdAppGuarantor.push(this.ListDuplicateAppGuarantor[i].AppGuarantorId);
        }
      }

    } else {
      for (let i = 0; i < this.ListDuplicateAppGuarantor.length; i++) {
        let index = this.ListSelectedIdAppGuarantor.indexOf(this.ListDuplicateAppGuarantor[i].AppGuarantorId);
        if (index > -1) {
          this.ListSelectedIdAppGuarantor.splice(index, 1);
        }
      }
    }
  }

  SelectAllMouGuarantor(condition) {
    this.checkboxAllGuarantor = condition;
    if (condition) {
      for (let i = 0; i < this.ListDuplicateMouGuarantor.length; i++) {
        if (this.ListSelectedIdMouGuarantor.indexOf(this.ListDuplicateMouGuarantor[i].AppGuarantorId) < 0) {
          this.ListSelectedIdMouGuarantor.push(this.ListDuplicateMouGuarantor[i].AppGuarantorId);
        }
      }

    } else {
      for (let i = 0; i < this.ListDuplicateMouGuarantor.length; i++) {
        let index = this.ListSelectedIdMouGuarantor.indexOf(this.ListDuplicateMouGuarantor[i].AppGuarantorId);
        if (index > -1) {
          this.ListSelectedIdMouGuarantor.splice(index, 1);
        }
      }
    }
  }

  SelectAllShareholder(condition) {
    this.checkboxAllShareholder = condition;
    if (condition) {
      for (let i = 0; i < this.ListDuplicateAppShareholder.length; i++) {
        if (this.ListSelectedIdAppShareholder.indexOf(this.ListDuplicateAppShareholder[i].AppCustCompanyMgmntShrholderId) < 0) {
          this.ListSelectedIdAppShareholder.push(this.ListDuplicateAppShareholder[i].AppCustCompanyMgmntShrholderId);
        }
      }

    } else {
      for (let i = 0; i < this.ListDuplicateAppShareholder.length; i++) {
        let index = this.ListSelectedIdAppShareholder.indexOf(this.ListDuplicateAppShareholder[i].AppCustCompanyMgmntShrholderId);
        if (index > -1) {
          this.ListSelectedIdAppShareholder.splice(index, 1);
        }
      }
    }
  }

  SelectAllMouShareholder(condition) {
    this.checkboxAllShareholder = condition;
    if (condition) {
      for (let i = 0; i < this.ListDuplicateAppShareholder.length; i++) {
        if (this.ListSelectedIdAppShareholder.indexOf(this.ListDuplicateAppShareholder[i].AppCustCompanyMgmntShrholderId) < 0) {
          this.ListSelectedIdAppShareholder.push(this.ListDuplicateAppShareholder[i].AppCustCompanyMgmntShrholderId);
        }
      }
    } else {
      for (let i = 0; i < this.ListDuplicateAppShareholder.length; i++) {
        let index = this.ListSelectedIdAppShareholder.indexOf(this.ListDuplicateAppShareholder[i].AppCustCompanyMgmntShrholderId);
        if (index > -1) {
          this.ListSelectedIdAppShareholder.splice(index, 1);
        }
      }
    }
  }

  Checked(type: string, Id: any, isChecked: any): void {
    if (isChecked) {
      this["ListSelectedId" + type].push(Id);
    } else {
      const index = this["ListSelectedId" + type].indexOf(Id)
      if (index > -1) { this["ListSelectedId" + type].splice(index, 1); }
    }
  }

  Submit() {
    var appDupCheckObj = new RequestSubmitMouCustDupCheckObj();
    appDupCheckObj.AppGuarantorIds = this.ListSelectedIdAppGuarantor;
    appDupCheckObj.AppCustCompanyMgmntShrholderIds = this.ListSelectedIdAppShareholder;
    appDupCheckObj.MouGuarantorIds = this.ListSelectedIdMouGuarantor;
    appDupCheckObj.MouCustCompanyMgmntShrholderIds = this.ListSelectedIdMouShareholder;
    appDupCheckObj.CustNo = this.MouCustObj.CustNo;
    appDupCheckObj.MouCustId = this.MouCustId;
    appDupCheckObj.WfTaskListId = this.WfTaskListId;

    this.http.post(URLConstant.SubmitMouDupCheck, appDupCheckObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigate(["/Mou/DuplicateCheck/Paging"]);
      });
  }

  Back() {
    this.router.navigate(["/Mou/DuplicateCheck/Paging"]);
  }

  OpenView(key: string, value: number) {
    if (key == "app") {
      AdInsHelper.OpenAppViewByAppId(value);
    } else if (key == "cust") {
      AdInsHelper.OpenCustomerViewByCustId(this.cust.CustId);
    }
  }
}
