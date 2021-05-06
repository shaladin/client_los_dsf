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
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetMouCustDuplicateObj } from 'app/shared/model/Request/MOU/ReqGetMouCustDuplicateObj.model';
import { ReqByCustNoObj } from 'app/shared/model/Request/ReqByCustNoObj.model';

@Component({
  selector: 'app-existing-mou-company',
  templateUrl: './existing-mou-company.component.html',
  styleUrls: ['./existing-mou-company.component.scss']
})
export class ExistingMouCompanyComponent implements OnInit {
  MouCustId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
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
  CustNoObj: ReqByCustNoObj = new ReqByCustNoObj();
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
    this.http.post(URLConstant.GetMouCustByMouCustId, { "Id": this.MouCustId }).subscribe(
      response => {
        this.MouCustObj = response['MouCustObj'];

        this.CustNoObj.CustNo = this.MouCustObj['CustNo'];
        this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
          response => {
            this.cust = response;
          }
        );

        this.RowVersion = response['MouCustObj'].RowVersion;
        this.MouCustCompanyObj = response['MouCustCompanyObj'];

        var ReqDupCheckObj = new ReqGetMouCustDuplicateObj();
        ReqDupCheckObj.CustName =  this.MouCustObj.CustName;
        ReqDupCheckObj.MrCustTypeCode = this.MouCustObj.MrCustTypeCode;
        ReqDupCheckObj.MrCustModelCode = this.MouCustObj.CustModelCode;
        ReqDupCheckObj.MrIdTypeCode = this.MouCustObj.MrIdTypeCode;
        ReqDupCheckObj.IdNo = this.MouCustObj.IdNo;
        ReqDupCheckObj.TaxIdNo =  this.MouCustObj.TaxIdNo;
        ReqDupCheckObj.BirthDt =  this.MouCustCompanyObj.EstablishmentDt;
        ReqDupCheckObj.MobilePhnNo1 = "-";
        ReqDupCheckObj.RowVersion = this.RowVersion;
        
        //List App guarantor Checking
        this.http.post(URLConstant.GetAppGuarantorDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListDuplicateAppGuarantor = response['ReturnObject'];
          }
        );

        //List App Shareholder Duplicate Checking
        this.http.post(URLConstant.GetAppShareholderDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListDuplicateAppShareholder = response['ReturnObject'];
          });

        //List Mou Guarantor Checking
        this.http.post(URLConstant.GetMouGuarantorDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListDuplicateMouGuarantor = response['ReturnObject'];
          });

        //List Mou Shareholder Duplicate Checking
        this.http.post(URLConstant.GetMouShareholderDuplicateCheck, ReqDupCheckObj).subscribe(
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
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DUP_CHECK_PAGING],{});
      });
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DUP_CHECK_PAGING],{});
  }

  OpenView(key: string, value: number) {
    if (key == "app") {
      AdInsHelper.OpenAppViewByAppId(value);
    } else if (key == "cust") {
      AdInsHelper.OpenCustomerViewByCustId(this.cust.CustId);
    }
  }
}
