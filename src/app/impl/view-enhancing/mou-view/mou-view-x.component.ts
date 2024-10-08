import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';

@Component({
  selector: 'app-mou-view-x',
  templateUrl: './mou-view-x.component.html',
})
export class MouViewXComponent implements OnInit {
  @Input() inputMouCustId: number;

  MouCustId: number;
  mouCustObj: MouCustObj;
  resultData: MouCustObj;
  MrMouTypeCode: string;
  MrCustTypeCode: string;
  IsResponseProcessed: boolean = false;
  isListedCustFactoring: boolean;
  IsReady: boolean = false;
  IsDms: boolean = false;
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;
  MouCustNo: string;
  //CR Change Self Custom
  generalSettingObj: GeneralSettingObj;
  returnGeneralSettingObj: GeneralSettingObj;
  isFactNewCalc: boolean = false;
  //CR Change Self Custom
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["MouCustId"] != null)
        this.MouCustId = params["MouCustId"];
      else
        this.MouCustId = this.inputMouCustId;
    });

  }

  ngOnInit() {
    //CR Change Self Custom
    this.generalSettingObj = new GeneralSettingObj();
    this.generalSettingObj.GsCode = "IS_FACT_NEW_CALC";
    let obj = {
      Code: this.generalSettingObj.GsCode
    }
    this.http.post(URLConstant.GetGeneralSettingByCode, obj).subscribe(
      (response: GeneralSettingObj) => {
        this.returnGeneralSettingObj = response;
        this.isFactNewCalc = Boolean(this.returnGeneralSettingObj == null ? 0 : this.returnGeneralSettingObj.GsValue);
      });
    //CR Change Self Custom
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
        this.MrMouTypeCode = this.resultData['MrMouTypeCode'];
        this.MrCustTypeCode = this.resultData['MrCustTypeCode'];
        this.MouCustNo = this.resultData['MouCustNo'];
        this.http.post(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
          (response) => {
            if(response["ConfigValue"] == '1'){
              let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
              this.dmsObj = new DMSObj();
              this.dmsObj.User = currentUserContext.UserName;
              this.dmsObj.Role = currentUserContext.RoleCode;
              this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
      
              if(this.resultData['CustNo'] != null && this.resultData['CustNo'] != ""){
                this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
              }
              else{
                this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['ApplicantNo']));
              }
              this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.resultData.MouCustNo));
              this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideViewDownload));
              this.IsDms = true;
            }
            
        });


        this.IsResponseProcessed = true;
        this.IsReady = true;
      });
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
