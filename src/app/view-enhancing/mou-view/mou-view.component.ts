import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-mou-view',
  templateUrl: './mou-view.component.html',
})
export class MouViewComponent implements OnInit {
  @Input() inputMouCustId: number;

  getMouCustByIdUrl: string;
  MouCustId: number;
  mouCustObj: MouCustObj;
  resultData: MouCustObj;
  MrMouTypeCode: string;
  MrCustTypeCode: string;
  IsResponseProcessed: boolean = false;
  isListedCustFactoring: boolean;
  IsReady: boolean = false;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;
  MouCustNo: string;
  constructor(private http: HttpClient, private route: ActivatedRoute, private cookieService: CookieService) {
    this.getMouCustByIdUrl = URLConstant.GetMouCustById;
    this.route.queryParams.subscribe(params => {
      if (params["MouCustId"] != null)
        this.MouCustId = params["MouCustId"];
      else
        this.MouCustId = this.inputMouCustId;
    });

  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;

    this.http.post(this.getMouCustByIdUrl, this.mouCustObj).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
        this.MrMouTypeCode = this.resultData['MrMouTypeCode'];
        this.MrCustTypeCode = this.resultData['MrCustTypeCode'];
        this.MouCustNo = this.resultData['MouCustNo'];
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.dmsObj = new DMSObj();
        this.dmsObj.User = currentUserContext.UserName;
        this.dmsObj.Role = currentUserContext.RoleCode;
        this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.resultData.MouCustNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));

        this.IsResponseProcessed = true;
        this.IsReady = true;
      });
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }

  isDetail: boolean;
  isFee: boolean;
  isCollateral: boolean;
  isTC: boolean;
  isDocument: boolean;
  isSurvey: boolean;
  isApprovalHistory: boolean;
  isLegalReview: boolean;
  EnterTab(type) {
    if (type == "detail") {
      this.isDetail = true;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
      this.isListedCustFactoring = false;
    }
    else if (type == "fee") {
      this.isDetail = false;
      this.isFee = true;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
      this.isListedCustFactoring = false;
    }
    else if (type == "collateral") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = true;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
      this.isListedCustFactoring = false;
    }
    else if (type == "TC") {
      this.isDetail = true;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = true;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
      this.isListedCustFactoring = false;
    }
    else if (type == "document") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = true;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
      this.isListedCustFactoring = false;
    }
    else if (type == "listed customer factoring") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = true;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
      this.isListedCustFactoring = true;
    }
    else if (type == "survey") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = true;
      this.isApprovalHistory = false;
      this.isLegalReview = false;
      this.isListedCustFactoring = false;
    }
    else if (type == "approvalHistory") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = true;
      this.isLegalReview = false;
      this.isListedCustFactoring = false;
    }
    else if (type == "legalReview") {
      this.isDetail = false;
      this.isFee = false;
      this.isCollateral = false;
      this.isTC = false;
      this.isDocument = false;
      this.isSurvey = false;
      this.isApprovalHistory = false;
      this.isLegalReview = true;
      this.isListedCustFactoring = false;
    }
  }
}