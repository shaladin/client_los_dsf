import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-tab-analysis-result',
  templateUrl: './tab-analysis-result.component.html',
  styleUrls: ['./tab-analysis-result.component.scss']
})
export class TabAnalysisResultComponent implements OnInit {

  @Input() appId;
  constructor(
    private http: HttpClient
  ) { }

  initData(){
    this.isFormOnCreditInvestigation= false;
    this.isFormOnCreditReview=false;
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

  async GetCreditInvestigationData(){
    var obj = { AppId: this.appId };
    await this.http.post(AdInsConstant.GetAppCrdInvstgByAppId, obj).toPromise().then(
      (response) => {
        // console.log(response);
        this.ResponseCreditInvestigationData=response;
        if(response["AppCrdInvstgHId"]!=0)
          this.isFormOnCreditInvestigation=true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetCreditReviewData(){
    var obj = { AppCrdRvwHObj: { AppId: this.appId } };
    await this.http.post(AdInsConstant.GetAppCrdRvwById, obj).toPromise().then(
      (response) => {
        // console.log(response);
        this.ResponseCreditReviewData=response["appCrdRvwHObj"];
        if(this.ResponseCreditReviewData.AppCrdRvwHId!=0)
          this.isFormOnCreditReview=true;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
