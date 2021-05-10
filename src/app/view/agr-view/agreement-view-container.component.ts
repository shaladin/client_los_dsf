import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';

@Component({
  selector: 'app-agreement-view-container',
  templateUrl: './agreement-view-container.component.html',
  styleUrls: []
})
export class AgreementViewContainerComponent implements OnInit {

  @Input() arrValue = [];
  AgrmntId;
  BizTemplateCode: string;
  ResponseAppDetailData;
  IsReady: boolean = false;
  IsCustomer: boolean = true;
  IsAsset: boolean = true;
  IsDocument: boolean = true;
  IsInsurance: boolean = true;
  IsAgreementCard: boolean = true;
  IsCommission: boolean = true;
  IsPurchaseOrder: boolean = true;
  IsCustomerCard: boolean = true;
  IsDeviation: boolean = true;
  IsLoanData: boolean = true;
  IsCollateral: boolean = true;
  IsDeliveryOrder: boolean = true;
  IsSummary: boolean = true;

  IsInsuranceFL4W: boolean = true;
  IsLifeInsurance: boolean = true;
  IsFinancial: boolean = true;
  IsTC: boolean = true;
  IsReservedFund: boolean = true;
  IsInvoiceData: boolean = true;
  IsComplainHandling: boolean = true;
  IsAdditionalService: boolean = true;
  IsMulti: boolean = true;
  IsAppCollateral: boolean = true;
  isDmsReady: boolean;

  agrNo: string;
  appId: string;
  dmsObj: DMSObj;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  async ngOnInit() : Promise<void> {
    this.arrValue.push(this.AgrmntId);
    await this.GetAgrmnt();
    await this.GetAppAndAppCustDetailByAgrmntId();
    await this.InitDms();
  }

  async InitDms() {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
    });
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;
      var agrObj = { Id: this.AgrmntId };
  
      await this.http.post(URLConstant.GetAgrmntByAgrmntId, agrObj).subscribe(
        (response) => {
          this.agrNo = response['AgrmntNo'];
          this.appId = response['AppId'];
          var appObj = { Id: this.appId };
          let getApp = this.http.post(URLConstant.GetAppById, appObj);
          let getAppCust = this.http.post(URLConstant.GetAppCustByAppId, appObj);
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
          forkJoin([getApp, getAppCust]).subscribe(
            (response) => {
              let appNo = response[0]['AppNo'];
              let custNo = response[1]['CustNo'];
              if (custNo != null && custNo != '') {
                this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, custNo));
              }
              this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, appNo));
              let mouCustId = response[0]['MouCustId'];
              if (mouCustId != null && mouCustId != '') {
                var mouObj = { Id: mouCustId };
                this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
                  (response) => {
                    let mouCustNo = response['MouCustNo'];
                    this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsMouId, mouCustNo));
                    this.isDmsReady = true;
                  });
              }
              else {
                this.isDmsReady = true;
              }
            }
          )
        }
      );
    }   
  }

  async GetAppAndAppCustDetailByAgrmntId() {
    var obj = { Id: this.AgrmntId };
    await this.http.post(URLConstant.GetAppAndAppCustDetailByAgrmntId, obj).toPromise().then(
      (response) => {
        this.ResponseAppDetailData = response;
      });
  }

  async GetAgrmnt() {
    var agrmntObj = {
      Id: this.AgrmntId,
    };
    this.http.post(URLConstant.GetAgrmntByAgrmntId, agrmntObj).subscribe(
      (response) => {
        var bizTemplateCode = response["BizTemplateCode"];

        if (bizTemplateCode == CommonConstant.FCTR) {
          this.IsCollateral = false;
          this.IsCommission = false;
          this.IsAsset = false;
          this.IsInsuranceFL4W = false;
          this.IsLifeInsurance = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
        }
        else if (bizTemplateCode == CommonConstant.CFRFN4W) {
          this.IsAsset = false;
          this.IsLoanData = false;
          this.IsInsuranceFL4W = false;
          this.IsLifeInsurance = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
          this.IsPurchaseOrder = false;
          this.IsDeliveryOrder = false;
          this.IsInvoiceData = false;
          this.IsMulti = false;
          this.IsCollateral = false;
        }
        else if (bizTemplateCode == CommonConstant.CF4W) {
          this.IsCollateral = false;
          this.IsInsuranceFL4W = false;
          this.IsLifeInsurance = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
          this.IsAppCollateral = false;
        }
        else if (bizTemplateCode == CommonConstant.FL4W) {
          this.IsAsset = false;
          this.IsInsurance = false;
          this.IsCustomerCard = false;
          this.IsDeviation = false;
          this.IsLoanData = false;
          this.IsInvoiceData = false;
          this.IsComplainHandling = false;
          this.IsAdditionalService = false;
          this.IsAppCollateral = false;
        }
        else if (bizTemplateCode == CommonConstant.CFNA) {
          this.IsAsset = false;
          this.IsLoanData = false;
          this.IsInsuranceFL4W = false;
          this.IsLifeInsurance = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
          this.IsDeliveryOrder = false;
          this.IsInvoiceData = false;
          this.IsCollateral = false;
        }
        this.IsReady = true;
      });
  }
}
