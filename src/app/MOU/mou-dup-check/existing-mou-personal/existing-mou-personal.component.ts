import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { MouCustPersonalObj } from 'app/shared/model/MouCustPersonalObj.Model';
import { RequestSubmitMouCustDupCheckObj } from 'app/shared/model/MouCustDupCheck/RequestSubmitMouCustDupCheckObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqGetMouCustDuplicateObj } from 'app/shared/model/Request/MOU/ReqGetMouCustDuplicateObj.model';
import { ReqByCustNoObj } from 'app/shared/model/Request/ReqByCustNoObj.model';

@Component({
  selector: 'app-existing-mou-personal',
  templateUrl: './existing-mou-personal.component.html',
  styleUrls: ['./existing-mou-personal.component.scss']
})
export class ExistingMouPersonalComponent implements OnInit {

  MouCustId: number;
  WfTaskListId: number;
  FondationUrl = environment.FoundationR3Url;
  MouCustObj: MouCustObj;
  MouCustPersonalObj: MouCustPersonalObj;
  ListDuplicateAppGuarantor: any;
  ListDuplicateMouGuarantor: any;
  ListDuplicateAppSpouse: any;
  ListDuplicateMouSpouse: any;
  ListDuplicateAppShareholder: any;
  ListDuplicateMouShareholder: any;
  ListSelectedIdAppGuarantor: any;
  ListSelectedIdMouGuarantor: any;
  ListSelectedIdAppSpouse: any;
  ListSelectedIdMouSpouse: any;
  ListSelectedIdAppShareholder: any;
  ListSelectedIdMouShareholder: any;
  checkboxAllGuarantor: false;
  checkboxAllMouGuarantor: false;
  checkboxAllSpouse: false;
  checkboxAllMouSpouse: false;
  checkboxAllShareholder: false;
  checkboxAllMouShareholder: false;
  RowVersion: any;
  cust: any;
  custUrl: string;
  CustNoObj: ReqByCustNoObj = new ReqByCustNoObj();
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NGXToastrService, private cookieService: CookieService
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

  ngOnInit() {
    this.MouCustObj = new MouCustObj();
    this.MouCustPersonalObj = new MouCustPersonalObj();
    this.ListSelectedIdAppGuarantor = new Array();
    this.ListSelectedIdAppSpouse = new Array();
    this.ListSelectedIdAppShareholder = new Array();
    this.ListSelectedIdMouGuarantor = new Array();
    this.ListSelectedIdMouSpouse = new Array();
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
        this.MouCustPersonalObj = response['MouCustPersonalObj'];
        
        var ReqDupCheckObj = new ReqGetMouCustDuplicateObj();
        ReqDupCheckObj.CustName =  this.MouCustObj.CustName;
        ReqDupCheckObj.MrCustTypeCode = this.MouCustObj.MrCustTypeCode;
        ReqDupCheckObj.MrCustModelCode = this.MouCustObj.CustModelCode;
        ReqDupCheckObj.MrIdTypeCode = this.MouCustObj.MrIdTypeCode;
        ReqDupCheckObj.IdNo = this.MouCustObj.IdNo;
        ReqDupCheckObj.TaxIdNo =  this.MouCustObj.TaxIdNo;
        ReqDupCheckObj.BirthDt =  this.MouCustPersonalObj.BirthDt;
        ReqDupCheckObj.MobilePhnNo1 = this.MouCustPersonalObj.MobilePhnNo1;
        ReqDupCheckObj.RowVersion = this.RowVersion;

        //List App guarantor Checking
        this.http.post(URLConstant.GetAppGuarantorDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListDuplicateAppGuarantor = response['ReturnObject'];
          });

        //List Spouse Duplicate Checking
        this.http.post(URLConstant.GetSpouseDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListDuplicateAppSpouse = response['ReturnObject'];
          });

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

        //List Spouse Duplicate Checking
        this.http.post(URLConstant.GetMouSpouseDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListDuplicateMouSpouse = response['ReturnObject'];
          });

        //List Mou Shareholder Duplicate Checking
        this.http.post(URLConstant.GetMouShareholderDuplicateCheck, ReqDupCheckObj).subscribe(
          response => {
            this.ListDuplicateMouShareholder = response['ReturnObject'];
          });
      });

  }

  Checked(type: string, Id: any, isChecked: any): void {
    if (isChecked) {
      this["ListSelectedId" + type].push(Id);
    } else {
      const index = this["ListSelectedId" + type].indexOf(Id)
      if (index > -1) { this["ListSelectedId" + type].splice(index, 1); }
    }
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
    this.checkboxAllMouGuarantor = condition;
    if (condition) {
      for (let i = 0; i < this.ListDuplicateMouGuarantor.length; i++) {
        if (this.ListSelectedIdMouGuarantor.indexOf(this.ListDuplicateMouGuarantor[i].MouGuarantorId) < 0) {
          this.ListSelectedIdMouGuarantor.push(this.ListDuplicateMouGuarantor[i].MouGuarantorId);
        }
      }

    } else {
      for (let i = 0; i < this.ListDuplicateMouGuarantor.length; i++) {
        let index = this.ListSelectedIdMouGuarantor.indexOf(this.ListDuplicateMouGuarantor[i].MouGuarantorId);
        if (index > -1) {
          this.ListSelectedIdMouGuarantor.splice(index, 1);
        }
      }
    }
  }

  SelectAllSpouse(condition) {
    this.checkboxAllSpouse = condition;
    if (condition) {
      for (let i = 0; i < this.ListDuplicateAppSpouse.length; i++) {
        if (this.ListSelectedIdAppSpouse.indexOf(this.ListDuplicateAppSpouse[i].AppCustPersonalConstactPersonId) < 0) {
          this.ListSelectedIdAppSpouse.push(this.ListDuplicateAppSpouse[i].AppCustPersonalConstactPersonId);
        }
      }

    } else {
      for (let i = 0; i < this.ListDuplicateAppSpouse.length; i++) {
        let index = this.ListSelectedIdAppSpouse.indexOf(this.ListDuplicateAppSpouse[i].AppCustPersonalConstactPersonId);
        if (index > -1) {
          this.ListSelectedIdAppSpouse.splice(index, 1);
        }
      }
    }
  }

  SelectAllMouSpouse(condition) {
    this.checkboxAllMouSpouse = condition;
    if (condition) {
      for (let i = 0; i < this.ListDuplicateMouSpouse.length; i++) {
        if (this.ListSelectedIdMouSpouse.indexOf(this.ListDuplicateMouSpouse[i].MouCustPersonalContactPersonId) < 0) {
          this.ListSelectedIdMouSpouse.push(this.ListDuplicateMouSpouse[i].MouCustPersonalContactPersonId);
        }
      }

    } else {
      for (let i = 0; i < this.ListDuplicateMouSpouse.length; i++) {
        let index = this.ListSelectedIdMouSpouse.indexOf(this.ListDuplicateMouSpouse[i].MouCustPersonalContactPersonId);
        if (index > -1) {
          this.ListSelectedIdMouSpouse.splice(index, 1);
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
    this.checkboxAllMouShareholder = condition;
    if (condition) {
      for (let i = 0; i < this.ListDuplicateMouShareholder.length; i++) {
        if (this.ListSelectedIdMouShareholder.indexOf(this.ListDuplicateMouShareholder[i].MouCustCompanyMgmntShrholderId) < 0) {
          this.ListSelectedIdMouShareholder.push(this.ListDuplicateMouShareholder[i].MouCustCompanyMgmntShrholderId);
        }
      }

    } else {
      for (let i = 0; i < this.ListDuplicateMouShareholder.length; i++) {
        let index = this.ListSelectedIdMouShareholder.indexOf(this.ListDuplicateMouShareholder[i].MouCustCompanyMgmntShrholderId);
        if (index > -1) {
          this.ListSelectedIdMouShareholder.splice(index, 1);
        }
      }
    }
  }

  Submit() {
    var appDupCheckObj = new RequestSubmitMouCustDupCheckObj();
    appDupCheckObj.AppGuarantorIds = this.ListSelectedIdAppGuarantor;
    appDupCheckObj.AppCustCompanyMgmntShrholderIds = this.ListSelectedIdAppShareholder;
    appDupCheckObj.AppCustPersonalContactPersonIds = this.ListSelectedIdAppSpouse;
    appDupCheckObj.MouGuarantorIds = this.ListSelectedIdMouGuarantor;
    appDupCheckObj.MouCustCompanyMgmntShrholderIds = this.ListSelectedIdMouShareholder;
    appDupCheckObj.MouCustPersonalContactPersonIds = this.ListSelectedIdMouSpouse;
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
    // this.router.navigateByUrl("/Nap/AddProcess/AppDupCheck/Personal?MouCustId=" + this.MouCustId + "&WfTaskListId=" + this.WfTaskListId);
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
