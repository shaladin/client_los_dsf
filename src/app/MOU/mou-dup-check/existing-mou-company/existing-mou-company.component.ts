import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
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
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { CustObj } from 'app/shared/model/CustObj.Model';

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
  ListDuplicateMouGuarantor: any;
  ListDuplicateAppShareholder: any;
  ListDuplicateMouShareholder: any;
  ListSelectedIdAppShareholder: Array<number>;
  ListSelectedIdMouGuarantor: Array<number>;
  ListSelectedIdMouShareholder: Array<number>;
  checkboxAllGuarantor = false;
  checkboxAllShareholder = false;
  RowVersion: string;
  cust: CustObj;
  custUrl: string;
  CustNoObj: GenericObj = new GenericObj();
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
    this.ListSelectedIdAppShareholder = new Array();
    this.ListSelectedIdMouGuarantor = new Array();
    this.ListSelectedIdMouShareholder = new Array();

    //Get Mou Cust Data
    this.http.post(URLConstant.GetMouCustByMouCustId, { "Id": this.MouCustId }).subscribe(
      response => {
        this.MouCustObj = response['MouCustObj'];

        this.CustNoObj.CustNo = this.MouCustObj['CustNo'];
        this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
          (response: CustObj) => {
            this.cust = response;
          }
        );

        this.RowVersion = response['MouCustObj'].RowVersion;
        this.MouCustCompanyObj = response['MouCustCompanyObj'];

        var ReqDupCheckObj = new ReqGetMouCustDuplicateObj();
        ReqDupCheckObj.CustName = this.MouCustObj.CustName;
        ReqDupCheckObj.MrCustTypeCode = this.MouCustObj.MrCustTypeCode;
        ReqDupCheckObj.MrCustModelCode = this.MouCustObj.CustModelCode;
        ReqDupCheckObj.MrIdTypeCode = this.MouCustObj.MrIdTypeCode;
        ReqDupCheckObj.IdNo = this.MouCustObj.IdNo;
        ReqDupCheckObj.TaxIdNo = this.MouCustObj.TaxIdNo;
        ReqDupCheckObj.BirthDt = this.MouCustCompanyObj.EstablishmentDt;
        ReqDupCheckObj.MobilePhnNo1 = "-";
        ReqDupCheckObj.RowVersion = this.RowVersion;

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

  Checked(type: string, Id: number, isChecked: boolean): void {
    if (isChecked) {
      this["ListSelectedId" + type].push(Id);
    } else {
      const index = this["ListSelectedId" + type].indexOf(Id)
      if (index > -1) { this["ListSelectedId" + type].splice(index, 1); }
    }
  }

  Submit() {
    var appDupCheckObj = new RequestSubmitMouCustDupCheckObj();
    appDupCheckObj.AppCustCompanyMgmntShrholderIds = this.ListSelectedIdAppShareholder;
    appDupCheckObj.MouGuarantorIds = this.ListSelectedIdMouGuarantor;
    appDupCheckObj.MouCustCompanyMgmntShrholderIds = this.ListSelectedIdMouShareholder;
    appDupCheckObj.CustNo = this.MouCustObj.CustNo;
    appDupCheckObj.MouCustId = this.MouCustId;
    appDupCheckObj.WfTaskListId = this.WfTaskListId;

    this.http.post(URLConstant.SubmitMouDupCheck, appDupCheckObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_DUP_CHECK_PAGING], {});
      });
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_DUP_CHECK_PAGING], {});
  }

  OpenView(key: string, value: number) {
    if (key == "app") {
      AdInsHelper.OpenAppViewByAppId(value);
    } else if (key == "cust") {
      AdInsHelper.OpenCustomerViewByCustId(this.cust.CustId);
    }
  }
}
