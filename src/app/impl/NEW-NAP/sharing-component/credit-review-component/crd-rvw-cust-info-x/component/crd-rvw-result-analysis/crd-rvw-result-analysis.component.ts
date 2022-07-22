import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-crd-rvw-result-analysis',
  templateUrl: './crd-rvw-result-analysis.component.html'
})
export class CrdRvwResultAnalysisComponent implements OnInit {

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
  BizTemplateCode
  async ngOnInit() {
    this.initData();
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    if(this.BizTemplateCode != CommonConstant.CFRFN4W)
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
    let obj = { Id: this.appId };
    await this.http.post(URLConstant.GetAppCrdRvwById, obj).toPromise().then(
      (response) => {
        this.ResponseCreditReviewData = response["appCrdRvwHObj"];
        if (this.ResponseCreditReviewData.AppCrdRvwHId != 0)
          this.isFormOnCreditReview = true;
      });
  }

}
