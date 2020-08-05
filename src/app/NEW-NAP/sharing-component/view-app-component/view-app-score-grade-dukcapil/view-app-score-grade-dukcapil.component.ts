import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppScoreGradeObj } from 'app/shared/model/AppScoreGrade/AppScoreGradeObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: "view-app-score-grade-dukcapil",
  templateUrl: "./view-app-score-grade-dukcapil.component.html",
  providers: [NGXToastrService]
})

export class ViewAppScoreGradeDukcapilComponent implements OnInit {
  @Input() AppId: number;
  AppScoreGradeObj: AppScoreGradeObj = new AppScoreGradeObj();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
     this.getAppScoreGradeDukcapil();
  }

  getAppScoreGradeDukcapil() {
    var reqObj = { AppId: this.AppId, MrScoreTypeCode: CommonConstant.ScoreTypeDukcapil };
    this.http.post<AppScoreGradeObj>(URLConstant.GetAppScoreGradeByAppIdAndMrScoreTypeCode, reqObj).subscribe(
      (response) => {
        this.AppScoreGradeObj = response;
      });
  }

}
