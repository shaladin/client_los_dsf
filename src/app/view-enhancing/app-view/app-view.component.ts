import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
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
  @ViewChild("mainInfoContainerA", { read: ViewContainerRef }) mainInfoContainer: ViewContainerRef;
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
  IsFraudDetectionResult: boolean = true;
  IsAnalysisResult: boolean = true;
  IsCollateral: boolean = true;
  IsMultiCollateral: boolean = true;
  IsApprovalHist: boolean = true;
  IsFraudDetectionMulti: boolean = true;
  IsDeviation: boolean = true;
  IsAssetExpense: boolean = true;
  IsPefindoResult: boolean = true;
  bizTemplateCode: string = "";
  isDmsReady: boolean;
  dmsObj: DMSObj;
  appNo: any;
  custNo: any;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private componentFactoryResolver: ComponentFactoryResolver, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  async ngOnInit() {
    this.arrValue.push(this.AppId);
    this.GetApp();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AppMainInfoComponent);
    const component = this.mainInfoContainer.createComponent(componentFactory);
    component.instance.arrValue = this.arrValue;
    await this.InitDms();
  }

  async InitDms() {
    this.isDmsReady = false;
    this.dmsObj = new DMSObj();
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.dmsObj.User = currentUserContext.UserName;
    this.dmsObj.Role = currentUserContext.RoleCode;
    this.dmsObj.ViewCode = CommonConstant.DmsViewCodeApp;
    var appObj = { AppId: this.AppId };

    let getApp = await this.http.post(URLConstant.GetAppById, appObj);
    let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj);

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
          var mouObj = { MouCustId: mouCustId };
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

  GetApp() {
    var appObj = {
      AppId: this.AppId,
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
          this.IsDeviation = false;
          this.IsAssetExpense = false;
          this.IsPefindoResult = false;
        }
        else if (this.bizTemplateCode == CommonConstant.CFRFN4W) {
          this.IsAsset = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
          this.IsDeviation = false;
          this.IsAssetExpense = false;
          this.IsPefindoResult = false;
        }
        else if (this.bizTemplateCode == CommonConstant.CF4W) {
          this.IsCollateral = false;
          this.IsMultiCollateral = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
          this.IsDeviation = false;
          this.IsAssetExpense = false;
          this.IsPefindoResult = false;
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
        }
        else if (this.bizTemplateCode == CommonConstant.CFNA) {
          this.IsAsset = false;
          this.IsInvoice = false;
          this.IsMultiAsset = false;
          this.IsMultiInsurance = false;
          this.IsFraudDetectionMulti = false;
          this.IsCollateral = false;
          this.IsDeviation = false;
          this.IsAssetExpense = false;
          this.IsPefindoResult = false;
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
          this.IsFraudDetectionMulti = false;
          this.IsInsurance = false;
          this.IsLifeInsurance = false;
          this.IsFraudDetectionResult = false;
          this.IsMultiCollateral = false;
        }
      }
    );
  }

  tabChangeEvent(tabChangeEvent: MatTabChangeEvent) {
    if (tabChangeEvent.index == 0) {
      this.GetApp();
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AppMainInfoComponent);
    this.mainInfoContainer.clear();
    const component = this.mainInfoContainer.createComponent(componentFactory);
    component.instance.arrValue = this.arrValue;
  }
}