import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppScoreGradeObj } from 'app/shared/model/app-score-grade/app-score-grade-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ThirdPartyRsltHObj } from 'app/shared/model/third-party-rslt-h-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResAppScoreGradeObj } from 'app/shared/model/response/app-score/res-get-app-score.model';

@Component({
  selector: "view-app-score-grade-dukcapil",
  templateUrl: "./view-app-score-grade-dukcapil.component.html",
  providers: [NGXToastrService]
})

export class ViewAppScoreGradeDukcapilComponent implements OnInit {
  @Input() AppId: number;
  AppScoreGradeObj: ResAppScoreGradeObj = new ResAppScoreGradeObj();
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
    let reqGetAppScoreObj : GenericObj = new GenericObj();
    reqGetAppScoreObj.Id = this.AppId;
    reqGetAppScoreObj.Code = CommonConstant.ScoreTypeDukcapil
    this.http.post<ResAppScoreGradeObj>(URLConstant.GetAppScoreGradeByAppIdAndMrScoreTypeCode, reqGetAppScoreObj).subscribe(
      (response) => {
        this.AppScoreGradeObj = response;
      });
  }
}