import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppScoreGradeObj } from 'app/shared/model/AppScoreGrade/AppScoreGradeObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ThirdPartyRsltHObj } from 'app/shared/model/ThirdPartyRsltHObj.Model';

@Component({
  selector: "view-app-score-grade-dukcapil",
  templateUrl: "./view-app-score-grade-dukcapil.component.html",
  providers: [NGXToastrService]
})

export class ViewAppScoreGradeDukcapilComponent implements OnInit {
  @Input() AppId: number;
  AppScoreGradeObj: AppScoreGradeObj = new AppScoreGradeObj();
  GetFraudResult: string;
  thirdPartyRsltHObj: ThirdPartyRsltHObj;
  ResultThirdPartyObj: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
     this.getAppScoreGradeDukcapil();
     this.GetFraudResult = URLConstant.GetFraudResult;
     this.thirdPartyRsltHObj = new ThirdPartyRsltHObj();
 
     this.http.post(URLConstant.GetAppById, { "Id": this.AppId }).subscribe(
       (response) => {
         this.thirdPartyRsltHObj.TrxNo = response['AppNo'];
         this.http.post(this.GetFraudResult, this.thirdPartyRsltHObj).subscribe(
           (response) => {
             this.ResultThirdPartyObj = response;
           });
       });
  }

  getAppScoreGradeDukcapil() {
    var reqObj = { AppId: this.AppId, MrScoreTypeCode: CommonConstant.ScoreTypeDukcapil };
    this.http.post<AppScoreGradeObj>(URLConstant.GetAppScoreGradeByAppIdAndMrScoreTypeCode, reqObj).subscribe(
      (response) => {
        this.AppScoreGradeObj = response;
      });
  }
}