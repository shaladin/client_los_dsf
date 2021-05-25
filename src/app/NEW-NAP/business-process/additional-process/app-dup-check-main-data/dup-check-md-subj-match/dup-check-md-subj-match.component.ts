import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { ReqDupCheckAppCustObj } from 'app/shared/model/AppDupCheckCust/ReqDupCheckAppCustObj';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResAppDupCheckCustMainDataObj, ResListAppDupCheckCustMainDataObj } from 'app/shared/model/Response/NAP/DupCheck/ResAppDupCheckCustMainDataObj.model';
import { DuplicateCustObj } from 'app/shared/model/DuplicateCustObj.Model';

@Component({
  selector: 'app-dup-check-md-subj-match',
  templateUrl: './dup-check-md-subj-match.component.html',
  styleUrls: []
})
export class DupCheckMdSubjMatchComponent implements OnInit {

  AppId: number;
  appCustId: number;
  WfTaskListId: number;
  viewMainInfoObj: UcViewGenericObj = new UcViewGenericObj();
  listMasterCustDuplicate: Array<Object>;
  listNegativeCustDuplicate: Array<Object>;
  listAppCustDuplicate: Array<ResAppDupCheckCustMainDataObj> = new Array<ResAppDupCheckCustMainDataObj>();
  appCustObj: AppCustObj;
  appCustPersonalObj: AppCustPersonalObj;
  appCustCompanyObj: AppCustCompanyObj;
  reqDupCheckAppCustObj: ReqDupCheckAppCustObj = new ReqDupCheckAppCustObj();
  CustNoObj: GenericObj = new GenericObj();
  mrCustTypeCode: string;
  isLock: boolean = true;
  isMasterLock: boolean = false;
  isNegativeLock: boolean = false;
  isAppLock: boolean = false;
  IsReady: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private location: Location) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) this.AppId = params['AppId'];
      if (params['AppCustId'] != null) this.appCustId = params['AppCustId'];
      if (params['WfTaskListId'] != null) this.WfTaskListId = params['WfTaskListId'];
    });
  }

  async ngOnInit() {
    await this.getDupCheckData();
  }

  initViewMainInfo() {
    if (this.mrCustTypeCode == CommonConstant.CustTypePersonal)
      this.viewMainInfoObj.viewInput = "./assets/ucviewgeneric/viewDupCheckSubjectMatchPersonal.json";
    else if (this.mrCustTypeCode == CommonConstant.CustTypeCompany)
      this.viewMainInfoObj.viewInput = "./assets/ucviewgeneric/viewDupCheckSubjectMatchCompany.json";

    this.viewMainInfoObj.viewEnvironment = environment.losUrl;
    this.viewMainInfoObj.ddlEnvironments = [{ name: "AppNo", environment: environment.losR3Web }];
  }

  async getDupCheckData() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.appCustId;
    await this.http.post(URLConstant.GetAppCustMainDataByAppCustId, reqObj).toPromise().then(
      response => {
        this.appCustObj = response['AppCustObj'];
        this.mrCustTypeCode = this.appCustObj.MrCustTypeCode;
        this.reqDupCheckAppCustObj.AppCustId = this.appCustId;
        this.reqDupCheckAppCustObj.RowVersion = this.appCustObj.RowVersion;

        let requestDupCheck: DuplicateCustObj = new DuplicateCustObj();
        
        if (this.mrCustTypeCode == CommonConstant.CustTypePersonal) {
          this.appCustPersonalObj = response['AppCustPersonalObj'];
          requestDupCheck.CustName = this.appCustObj.CustName;
          requestDupCheck.MrCustTypeCode = this.appCustObj.MrCustTypeCode;
          requestDupCheck.MrCustModelCode = this.appCustObj.MrCustModelCode;
          requestDupCheck.MrIdTypeCode = this.appCustObj.MrIdTypeCode;
          requestDupCheck.IdNo = this.appCustObj.IdNo;
          requestDupCheck.TaxIdNo = this.appCustObj.TaxIdNo;
          requestDupCheck.BirthDt = this.appCustPersonalObj.BirthDt;
          requestDupCheck.MotherMaidenName = this.appCustPersonalObj.MotherMaidenName;
          requestDupCheck.MobilePhnNo1 = this.appCustPersonalObj.MobilePhnNo1;
          requestDupCheck.RowVersion = response['AppCustObj'].RowVersion;

        }
        else if (this.mrCustTypeCode == CommonConstant.CustTypeCompany) {
          this.appCustCompanyObj = response['AppCustCompanyObj'];
          requestDupCheck.CustName = this.appCustObj.CustName;
          requestDupCheck.MrCustTypeCode = this.appCustObj.MrCustTypeCode;
          requestDupCheck.MrCustModelCode = this.appCustObj.MrCustModelCode;
          requestDupCheck.MrIdTypeCode = this.appCustObj.MrIdTypeCode;
          requestDupCheck.IdNo = this.appCustObj.IdNo;
          requestDupCheck.TaxIdNo = this.appCustObj.TaxIdNo;
          requestDupCheck.BirthDt = this.appCustCompanyObj.EstablishmentDt;
          requestDupCheck.RowVersion = response['AppCustObj'].RowVersion;
        }

        //List Master Cust Duplicate Checking
        this.http.post(URLConstant.GetCustomerDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.listMasterCustDuplicate = response[CommonConstant.ReturnObj].CustDuplicate;
            if (response[CommonConstant.ReturnStatus] == CommonConstant.RuleBehaviourLock) {
              this.isMasterLock = true;
              this.isLock = true;
            }
            else this.isMasterLock = false;
          }
        );

        //List Negative Cust Checking
        this.http.post(URLConstant.GetNegativeCustomerDuplicateCheck, requestDupCheck).subscribe(
          response => {
            this.listNegativeCustDuplicate = response[CommonConstant.ReturnObj].NegativeCustDuplicate;
            this.isNegativeLock = (response[CommonConstant.ReturnStatus] == CommonConstant.RuleBehaviourLock);
            if (this.isNegativeLock && this.listNegativeCustDuplicate.length > 0) this.listNegativeCustDuplicate.forEach(item => {
              this.reqDupCheckAppCustObj.ListAppNegativeCustObj.push({
                'NegativeCustNo': item['NegativeCustNo'],
                'MrNegCustTypeCode': item['MrNegCustTypeCode'],
                'MrNegCustSourceCode': item['MrNegCustSourceCode'],
                'NegCustCause': item['NegCustCause'],
              })
            });
          }
        );

        //List App Cust Duplicate Checking
        this.http.post(URLConstant.MD_GetAppCustDuplicateCheck, requestDupCheck).subscribe(
          (response : ResListAppDupCheckCustMainDataObj) => {
            this.listAppCustDuplicate = response.ListDuplicateAppCust;
            if (response[CommonConstant.ReturnStatus] == CommonConstant.RuleBehaviourLock) {
              this.isLock = true;
              this.isAppLock = true;
            }
            else if (!this.isMasterLock) this.isLock = false;
          }
        );

        this.initViewMainInfo();
        this.IsReady = true;
      });
  }

  selectMasterCust(item) {
    this.reqDupCheckAppCustObj.ApplicantNo = "";
    this.reqDupCheckAppCustObj.CustNo = item.CustNo;
    this.http.post(URLConstant.MD_EditApplicantNoCustNoAppCust, this.reqDupCheckAppCustObj).subscribe(
      response => {
        this.buttonCancelOnClick();
      }
    );
  }

  selectAppCust(item) {
    this.reqDupCheckAppCustObj.CustNo = "";
    this.reqDupCheckAppCustObj.ApplicantNo = item.ApplicantNo;
    this.reqDupCheckAppCustObj.SourceAppCustId = item.AppCustId;
    this.http.post(URLConstant.MD_EditApplicantNoCustNoAppCust, this.reqDupCheckAppCustObj).subscribe(
      response => {
        this.buttonCancelOnClick();
      }
    );
  }

  checkNegCustOnChange(event, item) {
    if (event.checked)
      this.reqDupCheckAppCustObj.ListAppNegativeCustObj.push(item)
    else {
      var index = this.reqDupCheckAppCustObj.ListAppNegativeCustObj.indexOf(item);
      if (index >= 0) this.reqDupCheckAppCustObj.ListAppNegativeCustObj.splice(index, 1);
    }
  }

  buttonNewCustOnClick() {
    this.reqDupCheckAppCustObj.ApplicantNo = "";
    this.reqDupCheckAppCustObj.CustNo = "";
    this.http.post(URLConstant.MD_EditApplicantNoCustNoAppCust, this.reqDupCheckAppCustObj).subscribe(
      response => {
        this.buttonCancelOnClick();
      }
    );
  }

  buttonCancelOnClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST], { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId });
  }

  viewMainInfoCallback(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.ViewObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
    else if (event.Key == "application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
  }
}
