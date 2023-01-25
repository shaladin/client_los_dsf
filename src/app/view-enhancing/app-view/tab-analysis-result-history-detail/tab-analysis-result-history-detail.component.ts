import { Component, OnInit, Input, Output, EventEmitter, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tab-analysis-result-history-detail',
  templateUrl: './tab-analysis-result-history-detail.component.html'
})
export class TabAnalysisResultHistoryDetailComponent implements OnInit {
  @Input() appId: number;
  @Input() BizTemplateCode: string;
  @Input() appCrdRvwHId: number;

  @Output() CloseDetail: EventEmitter<object> = new EventEmitter();

  constructor(private http: HttpClient, @Optional() public activeModal: NgbActiveModal) { }

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
    var obj = { Id: this.appId };
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
    let obj = { Id: this.appCrdRvwHId };
    await this.http.post(URLConstant.GetAppCrdRvwByAppCrdRvwHId, obj).toPromise().then(
      (response) => {
        this.ResponseCreditReviewData = response["appCrdRvwHObj"];
        if (this.ResponseCreditReviewData.AppCrdRvwHId != 0) {
          this.isFormOnCreditReview = true;
        }
      }
    );
  }

  async GetAppReviewData() {
    let obj = { Id: this.appCrdRvwHId };
    await this.http.post(URLConstant.GetAppCrdRvwByAppCrdRvwHId, obj).toPromise().then(
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
      Id: this.appId
    };
    await this.http.post(URLConstant.GetListAppScoreGradeByAppId, obj).toPromise().then(
      (response) => {
        this.ResponseAppReviewInfo = response[CommonConstant.ReturnObj];
        this.isFormOnAppReviewInfo = true;
      }
    );
  }

  onBackClick(){
    this.CloseDetail.emit({});
  }
}
