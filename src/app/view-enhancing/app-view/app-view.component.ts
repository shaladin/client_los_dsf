import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MatTabChangeEvent } from '@angular/material';
import { AppMainInfoComponent } from '../app-main-info/app-main-info.component';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { formatDate } from '@angular/common';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-app-view',
  templateUrl: './app-view.component.html',
  styleUrls: []
})
export class AppViewComponent implements OnInit {
  AppId: number;
  MouCustId: number = 0;
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
  IsApprovalHist: boolean = false;
  IsDeviation: boolean = true;
  IsAssetExpense: boolean = true;
  IsPefindoResult: boolean = true;
  IsSurveyResult: boolean = true;
  IsCustomerOpl: boolean = true;
  bizTemplateCode: string = "";
  isDmsReady: boolean;
  dmsObj: DMSObj;
  usingDmsAdins: string;
  agrNo: any;
  custNo: any;
  IsUseDigitalization: string;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  OriOfficeCode: string;

  @ViewChild('viewAppMainInfo') viewAppMainInfo: AppMainInfoComponent;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] == 'undefined') {
        this.AppNo = params["AppNo"]
      }
      else {
        this.AppId = params["AppId"];
      }
    })
  }

  async ngOnInit(): Promise<void> {
    if (this.AppId == 0) {
      await this.http.post(URLConstant.GetAppByAppNo, { TrxNo: this.AppNo }).toPromise().then(
        (response: AppObj) => {
          this.AppId = response.AppId;
          this.MouCustId = response.MouCustId;
        }
      )
    }
    else if (this.AppNo == null) {
      await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
        (response: AppObj) => {
          this.AppNo = response.AppNo;
          this.bizTemplateCode = response.BizTemplateCode;
          this.CustType = response.MrCustTypeCode;
          this.AppId = response.AppId;
          this.MouCustId = response.MouCustId;
          this.OriOfficeCode = response.OriOfficeCode;
          this.IsApprovalHist = true;
        }
      )
    }

    this.arrValue.push(this.AppId);
    await this.CheckBizTemplate();
    this.GetIsUseDigitalization();
    await this.InitDms();
    console.log(this.isDmsReady);
  }

  async InitDms() {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.SYS_CONFIG_USING_DMS_ADINS }).toPromise().then(
      (response) => {
        this.usingDmsAdins = response["ConfigValue"];
      },
      (error) => {
        console.log(error);
        this.isDmsReady = false;
      }
    );

    if (this.usingDmsAdins == '1') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.agrNo = "";
      await this.http.post(URLConstant.GetAgrmntByAppId, { Id: this.AppId }).subscribe(
        (response) => {
          this.agrNo = response['AgrmntNo'];
        }
      );
      this.dmsObj.ViewCode = "APP";
      this.dmsObj.UsingDmsAdIns = this.usingDmsAdins;
      this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));

      let reqAppId = { Id: this.AppId };
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsOfficeCode, this.OriOfficeCode));
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.AppNo));
      this.http.post(URLConstant.GetAppCustByAppId, reqAppId).subscribe(
        (response) => {
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['CustNo']));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsCustName, response['CustName']));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsDealerName, "DEALER"));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsExpiredDate, formatDate(new Date(), 'dd/MM/yyyy', 'en-US').toString()));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsTimestamp, formatDate(new Date(), 'MM/dd/yyyy HH:mm:ss', 'en-US').toString()));

          this.isDmsReady = true;
          console.log(this.isDmsReady);
        }
      );
      console.log(this.isDmsReady);
    }
    else if (this.usingDmsAdins == '2') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
      var appObj = { Id: this.AppId };

      await this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
        (response: AppCustObj) => {
          this.custNo = response.CustNo;

          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          }
          else {
            this.dmsObj.MetadataParent = null;
          }
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.AppNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
          if (this.MouCustId != null && this.MouCustId != 0) {
            var mouObj = { Id: this.MouCustId };
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
    else {
      this.isDmsReady = false;
    }
  }

  async CheckBizTemplate() {
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
      this.IsAnalysisResult = false;
      this.IsCustomerOpl = false;
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
      this.IsCustomerOpl = false;
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
      this.IsCustomerOpl = false;
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
      this.IsCustomerOpl = false;
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
      this.IsCustomerOpl = false;
    }
    else if (this.bizTemplateCode == CommonConstant.OPL) {
      this.IsCustomer = false;
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

  tabChangeEvent(tabChangeEvent: MatTabChangeEvent) {
    if (tabChangeEvent.index == 0) {
      this.CheckBizTemplate();
    }
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AppMainInfoComponent);
    // this.mainInfoContainer.clear();
    // const component = this.mainInfoContainer.createComponent(componentFactory);
    // component.instance.arrValue = this.arrValue;
  }

  GetIsUseDigitalization() {
    var generalSettingObj = new GeneralSettingObj();
    generalSettingObj.GsCode = CommonConstant.GSCodeIsUseDigitalization;
    this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeIsUseDigitalization }).subscribe(
      (response: GeneralSettingObj) => {
        this.IsUseDigitalization = response.GsValue;
      }
    )
  }
}