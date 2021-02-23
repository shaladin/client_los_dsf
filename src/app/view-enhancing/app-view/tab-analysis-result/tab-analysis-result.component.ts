import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-tab-analysis-result',
  templateUrl: './tab-analysis-result.component.html'
})
export class TabAnalysisResultComponent implements OnInit {
  @Input() appId: number;
  @Input() BizTemplateCode: string;

  constructor(private http: HttpClient) { }

  initData() {
    this.isFormOnCreditInvestigation = false;
    this.isFormOnCreditReview = false;
    this.isFormOnAppReview = false;
    this.isFormOnAppReviewInfo = false;
  }

  ResponseCreditInvestigationData: any;
  ResponseCreditReviewData: any;
  ResponseAppReviewData: any;
  ResponseAppReviewInfo: any;
  isFormOnCreditInvestigation: boolean;
  isFormOnCreditReview: boolean;
  isFormOnAppReview: boolean;
  isFormOnAppReviewInfo: boolean;

  async ngOnInit() {
    this.initData();
    if(this.BizTemplateCode === CommonConstant.OPL) {
      await this.GetAppReviewData();
    }
    else {
      await this.GetCreditInvestigationData();
      await this.GetCreditReviewData();
    }
  }

  async GetCreditInvestigationData() {
    var obj = {
      AppId: this.appId
    };
    await this.http.post(URLConstant.GetAppCrdInvstgByAppId, obj).toPromise().then(
      (response) => {
        this.ResponseCreditInvestigationData = response;
        if (response["AppCrdInvstgHId"] != 0) {
          this.isFormOnCreditInvestigation = true;
        }
      }
    );
  }

  async GetCreditReviewData() {
    var obj = {
      AppCrdRvwHObj: { AppId: this.appId }
    };
    await this.http.post(URLConstant.GetAppCrdRvwById, obj).toPromise().then(
      (response) => {
        this.ResponseCreditReviewData = response["appCrdRvwHObj"];
        if (this.ResponseCreditReviewData.AppCrdRvwHId != 0) {
          this.isFormOnCreditReview = true;
        }
      }
    );
  }

  async GetAppReviewData() {
    var obj = {
      AppCrdRvwHObj: { AppId: this.appId }
    };
    await this.http.post(URLConstant.GetAppCrdRvwById, obj).toPromise().then(
      (response) => {
        this.ResponseAppReviewData = response["appCrdRvwHObj"];
        if (this.ResponseAppReviewData.AppCrdRvwHId != 0) {
          this.isFormOnAppReview = true;
        }
      }
    );
  }

  async GetAppReviewInfo() {
    var obj = {
      AppId: this.appId
    };
    await this.http.post(URLConstant.GetListAppScoreGradeByAppId, obj).toPromise().then(
      (response) => {
        this.ResponseAppReviewInfo = response[CommonConstant.ReturnObj];
        this.isFormOnAppReviewInfo = true;
      }
    );
  }
}