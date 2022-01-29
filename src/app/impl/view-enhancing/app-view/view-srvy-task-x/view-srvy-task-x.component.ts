import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppObj } from 'app/shared/model/app/app.model';

@Component({
  selector: 'app-view-srvy-task-x',
  templateUrl: './view-srvy-task-x.component.html'
})
export class ViewSrvyTaskXComponent implements OnInit {
  @Input() AppId: number = 0;
  isSurvey : boolean = true;
  SurveyList: any;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    if (this.AppId != 0 && this.AppId != null && this.AppId != undefined) {
      await this.http.post(URLConstant.GetAppSurveyVerifSubjectListByAppId, { Id: this.AppId}).toPromise().then(
        (response) => {
          this.SurveyList = response['ReturnObject'];
          if(this.SurveyList.length == 0){
            this.isSurvey = false;
          }
        }
      );
    }
    await this.GetVerfResult();
  }

  verifResultObj: any;
  verfResObj = {
    TrxRefNo: '',
    MrVerfTrxTypeCode: CommonConstant.VerfTrxTypeCodeSurvey
  };

  async GetVerfResult() {
    await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      async (response: AppObj) => {
        if (response) {
          this.verfResObj.TrxRefNo = response.AppNo;
        }
      }
    );
    await this.http.post(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, this.verfResObj).toPromise().then(
      (response) => {
        this.verifResultObj = response;
        if(this.verifResultObj.VerfResultId == 0){
          this.isSurvey = true;
          console.log("ayaya");
        }
      }
    );
  }

  View(VerifResultHid) {
  var link = environment.losR3Web + NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VIEW + "?AppId=" + this.AppId + "&VerfResultHId=" + VerifResultHid;

    window.open(link , "_blank");
  }

}
