import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FraudDukcapilObj } from 'app/shared/model/FraudDukcapilObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppDupCheckObj } from 'app/shared/model/AppDupCheckCust/AppDupCheckObj.Model';
import { NegativeCustObj } from 'app/shared/model/NegativeCust.Model';
import { NegativeAssetCheckForMultiAssetObj } from 'app/shared/model/NegativeAssetCheckForMultiAssetObj.Model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { NegativeAssetObj } from 'app/shared/model/NegativeAssetObj.Model';
import { ResDuplicateCustomerObj } from 'app/shared/model/Lead/ResDuplicateCustomerObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';


@Component({
  selector: 'app-fraud-detection-verif',
  templateUrl: './fraud-detection-verif.component.html',
  styleUrls: []
})
export class FraudDetectionVerifComponent implements OnInit {

  losUrl = environment.losUrl;
  foundationUrl = environment.FoundationR3Url;
  getAppById = URLConstant.GetAppById;
  getCustDataByAppId = URLConstant.GetCustDataByAppId;
  getAppDupCheckCustByAppId = URLConstant.GetCustomerDuplicateCheck;
  getFraudDukcapilByIdNo = URLConstant.GetFraudDukcapilByIdNo;
  addAppFraudVerf = URLConstant.AddAppFraudVerf;
  getLeadByLeadId = URLConstant.GetLeadByLeadId;
  getAppAssetByAppId = URLConstant.GetAppAssetByAppId;
  getAssetNegativeDuplicateCheck = URLConstant.GetAssetNegativeDuplicateCheck;
  bussinessDt: any;
  appId: any;
  appCustObj: AppCustObj = new AppCustObj();
  appCustCompanyObj: any;
  appAssetObj: AppAssetObj;
  leadObj: any;
  appObj: AppObj;
  leadId: any;
  dukcapilObj: any;
  ListAssetNegative: Array<NegativeAssetObj> = new Array<NegativeAssetObj>();
  ListAssetNegativeAsset: Array<NegativeAssetObj> = new Array<NegativeAssetObj>();
  ListAssetNegativeCollateral: Array<NegativeAssetObj> = new Array<NegativeAssetObj>();
  listCustDuplicate: Array<ResDuplicateCustomerObj> = new Array<ResDuplicateCustomerObj>();
  closeResult: string;
  idNo: any;
  verfUser: any;
  verfDt: any;
  verfNotes: any;
  verfCode: any;
  appCustPersonalObj: any;
  RowVersion: any;
  GetNegativeCustomerDuplicateCheckUrl = URLConstant.GetNegativeCustomerDuplicateCheck;
  ListNegativeCust: Array<NegativeCustObj> = new Array<NegativeCustObj>();
  viewObj: string;
  arrValue = [];

  respAppDupCheck: any;
  respNegativeCust: any;
  respAssetNegative: any;

  WfTaskListId: number;
  custStat: string;
  mrCustTypeCode: string;
  isReady: boolean = false;


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];

      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params["WfTaskListId"]
      }
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.WfTaskListId != null || this.WfTaskListId != undefined)
      this.claimTask();

    this.getApp();
    this.arrValue.push(this.appId);
    this.viewObj = "./assets/ucviewgeneric/viewCreditInvestigationInfo.json";
    var context = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.verfUser = context[CommonConstant.USER_NAME];
    this.verfDt = context[CommonConstant.BUSINESS_DT];
    this.verfCode = context[CommonConstant.EMP_NO];
  }

  getApp(){
    var appObj = {
      AppId: this.appId,
    };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response) => {
        this.mrCustTypeCode = response["MrCustTypeCode"];
        this.isReady = true;
      }
    );
  }

  cancel() {
    var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router,["/Nap/CreditProcess/FraudDetection/Paging"], { BizTemplateCode: lobCode });
  }

  submit() {
    var verfObj = {
      "AppId": this.appId,
      "VerifyByName": this.verfUser,
      "VerifyDt": this.verfDt,
      "Notes": this.verfNotes,
      "VerifyByCode": this.verfCode,
      "VerifyStat": "Verified",
      "WfTaskId": this.WfTaskListId
    }
    this.http.post(this.addAppFraudVerf, verfObj).subscribe(
      response => {
        var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
        AdInsHelper.RedirectUrl(this.router,["/Nap/CreditProcess/FraudDetection/Paging"], { "BizTemplateCode": BizTemplateCode });
      });
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = {
      pWFTaskListID: this.WfTaskListId,
      pUserID: currentUserContext[CommonConstant.USER_NAME],
      isLoading: false
    };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
}

