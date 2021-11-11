import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppScoreGradeObj } from 'app/shared/model/app-score-grade/app-score-grade-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
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

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
     this.getAppScoreGradeDukcapil();
  }

  getAppScoreGradeDukcapil() {
    let reqGetAppScoreObj : GenericObj = new GenericObj();
    reqGetAppScoreObj.Id = this.AppId;
    reqGetAppScoreObj.Code = CommonConstant.ScoreTypeDukcapil;
    this.http.post<ResAppScoreGradeObj>(URLConstant.GetAppScoreGradeByAppIdAndMrScoreTypeCode, reqGetAppScoreObj).subscribe(
      (response) => {
        this.AppScoreGradeObj = response;
      });
  }

}
