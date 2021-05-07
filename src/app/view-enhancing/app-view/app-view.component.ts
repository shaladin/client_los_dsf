import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MatTabChangeEvent } from '@angular/material';
import { AppMainInfoComponent } from '../app-main-info/app-main-info.component';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
<<<<<<< HEAD
import { ResponseSysConfigResultObj } from 'app/shared/model/Response/ResponseSysConfigResultObj.Model';
import { formatDate } from '@angular/common';
=======
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
>>>>>>> b33ee1e1a1537e62d740f53ec1cd5815e2817497

@Component({
  selector: 'app-app-view',
  templateUrl: './app-view.component.html',
  styleUrls: []
})
export class AppViewComponent implements OnInit {
  AppId: number;
  AppNo: string;
  arrValue = [];
  CustType: string = "";
  AppCustObj: any;
  IsCustomer: boolean = true;
  IsGuarantor: boolean = true;
  IsReferantor: boolean = true;
  IsApplication: boolean = true;
  IsInvoice: boolean = true;
  IsAsset: boolean = true;
  IsMultiAsset: boolean = true;
  IsInsurance: boolean = true;
  IsMultiInsurance: boolean = true;
  IsLifeInsurance: boolean = true;
  IsFinancial: boolean = true;
  IsTC: boolean = true;
  IsCommission: boolean = true;
  IsReservedFund: boolean = true;
  IsPhoneVerification: boolean = true;
  IsAnalysisResult: boolean = true;
  IsCollateral: boolean = true;
  IsMultiCollateral: boolean = true;
  IsApprovalHist: boolean = true;
  IsDeviation: boolean = true;
  IsAssetExpense: boolean = true;
  IsPefindoResult: boolean = true;
  IsSurveyResult: boolean = true;
  bizTemplateCode: string = "";
  isDmsReady: boolean;
  dmsObj: DMSObj;
  usingDmsAdins: string;
  agrNo: any;
  appNo: any;
  custNo: any;
  IsUseDigitalization: string;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();

  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;

  constructor(private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if(params["AppId"] == 'undefined'){
        this.AppNo = params["AppNo"]
        
      }else{
        this.AppId = params["AppId"];
      }
      
    })
    
  }

  async ngOnInit() : Promise<void> {
    this.arrValue.push(this.AppId);
    await this.GetApp();
    this.GetIsUseDigitalization();
    await this.InitDms();
  }

  async InitDms() {
    await this.http.post<ResponseSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.SYS_CONFIG_USING_DMS_ADINS}).toPromise().then(
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
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsDealerName, "TEST DEALER"));
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsExpiredDate, formatDate(new Date(), 'MM/dd/yyyy', 'en-US').toString()));
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
  
      let getApp = this.http.post(URLConstant.GetAppById, appObj);
      let getAppCust = this.http.post(URLConstant.GetAppCustByAppId, appObj);
  
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

  async GetApp() {
    var appObj = {
      Id: this.AppId,
    };

    await this.http.post(URLConstant.GetAppById, appObj).toPromise().then(
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
          this.IsInsurance = false;
          this.IsDeviation = false;
          this.IsAssetExpense = false;
          this.IsPefindoResult = false;
          this.IsSurveyResult = false;
        }
        else if (this.bizTemplateCode == CommonConstant.CFRFN4W) {
          this.IsAsset = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsDeviation = false;
          this.IsAssetExpense = false;
          this.IsPefindoResult = false;
          this.IsSurveyResult = false;
        }
        else if (this.bizTemplateCode == CommonConstant.CF4W) {
          this.IsCollateral = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsDeviation = false;
          this.IsAssetExpense = false;
          this.IsPefindoResult = false;
          this.IsSurveyResult = false;
        }
        else if (this.bizTemplateCode == CommonConstant.FL4W) {
          this.IsAsset = false;
          this.IsCollateral = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsInsurance = false;
          this.IsDeviation = false;
          this.IsAssetExpense = false;
          this.IsPefindoResult = false;
          this.IsSurveyResult = false;
        }
        else if (this.bizTemplateCode == CommonConstant.CFNA) {
          this.IsAsset = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsCollateral = false;
          this.IsDeviation = false;
          this.IsAssetExpense = false;
          this.IsPefindoResult = false;
          this.IsSurveyResult = false;
        }
        else if (this.bizTemplateCode == CommonConstant.OPL) {
          this.IsCollateral = false;
          this.IsReferantor = false;
          this.IsInvoice = false;
          this.IsMultiInsurance = false;
          this.IsCommission = false;
          this.IsCollateral = false;
          this.IsReservedFund = false;
          this.IsPhoneVerification = false;
          this.IsMultiAsset = false;
          this.IsInsurance = false;
          this.IsLifeInsurance = false;
          this.IsMultiCollateral = false;
        }
      }
    );
  }

  tabChangeEvent(tabChangeEvent: MatTabChangeEvent) {
    if (tabChangeEvent.index == 0) {
      this.GetApp();
    }
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AppMainInfoComponent);
    // this.mainInfoContainer.clear();
    // const component = this.mainInfoContainer.createComponent(componentFactory);
    // component.instance.arrValue = this.arrValue;
  }

  GetIsUseDigitalization() {

    var generalSettingObj = new GeneralSettingObj();
    generalSettingObj.GsCode = CommonConstant.GSCodeIsUseDigitalization;
    this.http.post(URLConstant.GetGeneralSettingByCode, {Code: CommonConstant.GSCodeIsUseDigitalization}).subscribe(
      (response) => {
        this.IsUseDigitalization = response["GsValue"];
      }
    )
  }
}
