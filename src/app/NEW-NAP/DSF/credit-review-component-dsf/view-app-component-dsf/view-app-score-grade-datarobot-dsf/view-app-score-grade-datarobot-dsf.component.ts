import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppScoreGradeDsrObj } from 'app/shared/model/AppScoreGrade/AppScoreGradeDsrObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ThirdPartyDataRobotObj } from 'app/shared/model/ThirdPartyData/ThirdPartyDataRobotObj.Model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { forkJoin } from 'rxjs';
import { GetAppSubsidyByAppIdObj } from 'app/shared/model/GetAppSubsidyByAppIdObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-view-app-score-grade-datarobot-dsf',
  templateUrl: './view-app-score-grade-datarobot-dsf.component.html',
  styleUrls: ['./view-app-score-grade-datarobot-dsf.component.css'],
  providers: [NGXToastrService]
})
export class ViewAppScoreGradeDatarobotDsfComponent implements OnInit {

  AppNo: string;
  AppId: number;
  AppScoreGradeDsrObj: AppScoreGradeDsrObj = new AppScoreGradeDsrObj();
  dataRobotInfoObj:  ThirdPartyDataRobotObj = new ThirdPartyDataRobotObj();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) this.AppId = params["AppId"];
    });
  }

  ngOnInit() {
    
    var appObj = { Id: this.AppId };
    this.http.post<AppObj>(URLConstant.GetAppById, appObj).subscribe(
      (response) => {
        this.AppNo = response.AppNo;
        this.dataRobotInfoObj.AppNo = this.AppNo;
        this.http.post<ThirdPartyDataRobotObj>(URLConstantDsf.GetCrdRvwDataRobot, this.dataRobotInfoObj).subscribe(
          (response) => {
            this.dataRobotInfoObj = response;
          }
        );
      }
    );
  }
}
