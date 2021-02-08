import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

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
  MouCustNo: string;
  arrValue = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.getMouCustByIdUrl = URLConstant.GetMouCustById;
    this.route.queryParams.subscribe(params => {
      if (params["MouCustId"] != null)
        this.MouCustId = params["MouCustId"];
      else
        this.MouCustId = this.inputMouCustId;
    });

  }
  
  ngOnInit() {
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.arrValue.push(this.MouCustId);
    this.http.post(this.getMouCustByIdUrl, this.mouCustObj).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
        this.MrMouTypeCode = this.resultData['MrMouTypeCode'];
        this.MrCustTypeCode = this.resultData['MrCustTypeCode'];
        this.MouCustNo = this.resultData['MouCustNo'];
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