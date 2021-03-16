import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-tab-analysis-result',
  templateUrl: './tab-analysis-result.component.html'
})
export class TabAnalysisResultComponent implements OnInit {

  @Input() appId;
  constructor(
    private http: HttpClient
  ) { }

  initData() {
    this.isFormOnCreditInvestigation = false;
    this.isFormOnCreditReview = false;
  }

  ResponseCreditInvestigationData;
  ResponseCreditReviewData;
  isFormOnCreditInvestigation;
  isFormOnCreditReview;
  async ngOnInit() {
    this.initData();
    await this.GetCreditInvestigationData();
    this.GetCreditReviewData();
  }

  async GetCreditInvestigationData() {
    var obj = { Id: this.appId };
    await this.http.post(URLConstant.GetAppCrdInvstgByAppId, obj).toPromise().then(
      (response) => {
        this.ResponseCreditInvestigationData = response;
        if (response["AppCrdInvstgHId"] != 0)
          this.isFormOnCreditInvestigation = true;
      });
  }

  async GetCreditReviewData() {
    var obj = { AppCrdRvwHObj: { AppId: this.appId } };
    await this.http.post(URLConstant.GetAppCrdRvwById, obj).toPromise().then(
      (response) => {
        this.ResponseCreditReviewData = response["appCrdRvwHObj"];
        if (this.ResponseCreditReviewData.AppCrdRvwHId != 0)
          this.isFormOnCreditReview = true;
      });
  }
}
