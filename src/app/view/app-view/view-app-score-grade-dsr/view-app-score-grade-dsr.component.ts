import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppScoreGradeDsrObj } from 'app/shared/model/AppScoreGrade/AppScoreGradeDsrObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: "view-app-score-grade-dsr",
  templateUrl: "./view-app-score-grade-dsr.component.html",
  providers: [NGXToastrService]
})

export class ViewAppScoreGradeDsrComponent implements OnInit {
  @Input() AppId: number;
  AppScoreGradeDsrObj: AppScoreGradeDsrObj = new AppScoreGradeDsrObj();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
     this.getAppScoreGradeDsr();
  }

  getAppScoreGradeDsr() {
    var reqObj = { Id: this.AppId };
    this.http.post<AppScoreGradeDsrObj>(URLConstant.GetAppScoreGradeDsrByAppId, reqObj).subscribe(
      (response) => {
        this.AppScoreGradeDsrObj = response;
      });
  }

}
