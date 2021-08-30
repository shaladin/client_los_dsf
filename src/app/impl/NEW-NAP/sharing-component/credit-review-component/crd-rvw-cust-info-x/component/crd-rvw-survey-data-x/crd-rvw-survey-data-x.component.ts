import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-crd-rvw-survey-data-x',
  templateUrl: './crd-rvw-survey-data-x.component.html'
})
export class CrdRvwSurveyDataXComponent implements OnInit {
  @Input() AppId: number = 0;

  SurveyList: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (this.AppId != 0 && this.AppId != null && this.AppId != undefined) {
      this.http.post(URLConstant.GetAppSurveyVerifSubjectListByAppId, { Id: this.AppId}).toPromise().then(
        (response) => {
          this.SurveyList = response['ReturnObject'];
        }
      );
    }
  }

  View(VerifResultHid) {
  var link = environment.losR3Web + NavigationConstant.NAP_CRD_PRCS_SURVEY_VERIF_SUBJECT_VIEW + "?AppId=" + this.AppId + "&VerfResultHId=" + VerifResultHid;

    window.open(link , "_blank");
  }

}
