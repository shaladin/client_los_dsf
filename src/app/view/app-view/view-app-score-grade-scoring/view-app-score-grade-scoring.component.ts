import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppScoreGradeObj } from 'app/shared/model/AppScoreGrade/AppScoreGradeObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: "view-app-score-grade-scoring",
  templateUrl: "./view-app-score-grade-scoring.component.html",
  providers: [NGXToastrService]
})

export class ViewAppScoreGradeScoringComponent implements OnInit {
  @Input() AppId: number;
  AppScoreGradeObj: AppScoreGradeObj = new AppScoreGradeObj();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
     this.getAppScoreGradeScoring();
  }

  getAppScoreGradeScoring() {
    let reqGetAppScoreObj : GenericObj = new GenericObj();
    reqGetAppScoreObj.Id = this.AppId;
    reqGetAppScoreObj.Code = CommonConstant.ScoreTypeScoring;
    this.http.post<AppScoreGradeObj>(URLConstant.GetAppScoreGradeByAppIdAndMrScoreTypeCode, reqGetAppScoreObj).subscribe(
      (response) => {
        this.AppScoreGradeObj = response;
      });
  }

}
