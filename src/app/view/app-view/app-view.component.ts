import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MatTabChangeEvent } from '@angular/material';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-app-view',
  templateUrl: './app-view.component.html',
  styleUrls: []
})
export class AppViewComponent implements OnInit {

  AppId: number;
  arrValue = [];
  CustType: string = "";
  AppCustObj: any;
  IsCustomer : boolean = true;
  IsGuarantor : boolean = true;
  IsReferantor : boolean = true;
  IsApplication : boolean = true;
  IsInvoice : boolean = true;
  IsAsset : boolean = true;
  IsMultiAsset : boolean = true;
  IsInsurance : boolean = true;
  IsMultiInsurance : boolean = true;
  IsLifeInsurance : boolean = true;
  IsFinancial : boolean = true;
  IsTC : boolean = true;
  IsCommission : boolean = true;
  IsReservedFund : boolean = true;
  IsPhoneVerification : boolean = true;
  IsFraudDetectionResult : boolean = true;
  IsAnalysisResult : boolean = true;
  IsCollateral : boolean = true;
  IsMultiCollateral : boolean = true;
  IsApprovalHist: boolean = true;
  IsFraudDetectionMulti: boolean = true;
  bizTemplateCode: string = "";
  isDmsReady: boolean;
  dmsObj: DMSObj;
  appNo: any;
  custNo: any; 
  agrNo: any;
  usingDmsAdins: string;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;
  
  constructor(private route: ActivatedRoute, private http: HttpClient, private componentFactoryResolver: ComponentFactoryResolver, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  async ngOnInit() : Promise<void> {
    this.arrValue.push(this.AppId);
    this.GetApp();
    this.viewAppMainInfo.ReloadUcViewGeneric();
    await this.InitDms();
  }

  async InitDms() {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.SYS_CONFIG_USING_DMS_ADINS}).toPromise().then(
      (response) => {
        this.usingDmsAdins = response["ConfigValue"];
      },
      (error) => {
        console.log(error);
        this.isDmsReady = false;
      }
    );
    if(this.usingDmsAdins == '1')
    {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.agrNo = "";
      await this.http.post(URLConstant.GetAgrmntByAppId, {Id: this.AppId}).subscribe(
        (response) => {
          this.agrNo = response['AgrmntNo'];
        }
      );
      this.dmsObj.ViewCode = "APP";
      this.dmsObj.UsingDmsAdIns = this.usingDmsAdins;
      this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
  
      await this.http.post(URLConstant.GetAppById, {Id: this.AppId}).subscribe(
        (response) => {
          let appId = response['AppId'];
          let reqAppId = { Id : appId };
          let appNo = response['AppNo'];
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsOfficeCode, response['OriOfficeCode']));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, appNo));
          this.http.post(URLConstant.GetAppCustByAppId, reqAppId).subscribe(
            (response) => {
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['CustNo']));
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsCustName, response['CustName']));
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsDealerName, "DEALER"));
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsExpiredDate, formatDate(new Date(), 'dd/MM/yyyy', 'en-US').toString()));
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsTimestamp, formatDate(new Date(), 'MM/dd/yyyy HH:mm:ss', 'en-US').toString()));
              
              this.isDmsReady = true;
            }
          );
        }
      );
    }
    else if(this.usingDmsAdins == '2')
    {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      var appObj = { Id: this.AppId };
  
      let getApp = await this.http.post(URLConstant.GetAppById, appObj)
      let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
      forkJoin([getApp, getAppCust]).subscribe(
        (response) => {
          this.appNo = response[0]['AppNo'];
          this.custNo = response[1]['CustNo'];
          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          }
          else {
            this.dmsObj.MetadataParent = null;
          }
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
          let mouCustId = response[0]['MouCustId'];
          if (mouCustId != null && mouCustId != '') {
            var mouObj = { Id: mouCustId };
            this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
              (response) => {
                let mouCustNo = response['MouCustNo'];
                this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, mouCustNo));
                this.isDmsReady = true;
              });
          }
          else {
            this.isDmsReady = true;
          }
        }
      );
    }  
    else
    {
      this.isDmsReady = false;
    }
  }

  GetApp() {
    var appObj = {
      Id: this.AppId,
    };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response) => {
        this.bizTemplateCode = response["BizTemplateCode"];
        this.CustType = response["MrCustTypeCode"];

        if (this.bizTemplateCode == CommonConstant.FCTR) {
          this.IsCollateral = false;
          this.IsGuarantor = false;
          this.IsReferantor = false;
          this.IsCommission = false;
          this.IsReservedFund = false;
          this.IsPhoneVerification = false;
          this.IsAsset = false;
          this.IsMultiAsset = false;
          this.IsFraudDetectionMulti = false;
          this.IsInsurance = false;
        }
        else if (this.bizTemplateCode == CommonConstant.CFRFN4W) {
          this.IsAsset = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
        }
        else if (this.bizTemplateCode == CommonConstant.CF4W) {
          this.IsCollateral = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
        }
        else if (this.bizTemplateCode == CommonConstant.FL4W) {
          this.IsAsset = false;
          this.IsCollateral = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsInsurance = false;
        }
        else if (this.bizTemplateCode == CommonConstant.CFNA) {
          this.IsAsset = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
          this.IsCollateral = false;
        }
      }
    );
  }

  tabChangeEvent(tabChangeEvent: MatTabChangeEvent) {
    if (tabChangeEvent.index == 0) {
      this.GetApp();
    }
    this.viewAppMainInfo.ReloadUcViewGeneric();
  }
}
