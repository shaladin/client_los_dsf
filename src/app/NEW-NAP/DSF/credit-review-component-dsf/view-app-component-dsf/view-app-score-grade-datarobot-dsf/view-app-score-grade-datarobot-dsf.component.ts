import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { forkJoin } from 'rxjs';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppScoreGradeDsrObj } from 'app/shared/model/app-score-grade/app-score-grade-dsr-obj.model';
import { ThirdPartyDataRobotObj } from 'app/shared/model/third-party-data/ThirdPartyDataRobotObj.Model';

@Component({
  selector: 'app-view-app-score-grade-datarobot-dsf',
  templateUrl: './view-app-score-grade-datarobot-dsf.component.html',
  styleUrls: ['./view-app-score-grade-datarobot-dsf.component.css'],
  providers: [NGXToastrService]
})
export class ViewAppScoreGradeDatarobotDsfComponent implements OnInit {

  AppNo: string;
  AppId: number;
  MrCustTypeCode: string;
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
        this.MrCustTypeCode = response.MrCustTypeCode;
        this.dataRobotInfoObj.AppNo = this.AppNo;
        this.dataRobotInfoObj.MrCustTypeCode = this.MrCustTypeCode;
        this.http.post<ThirdPartyDataRobotObj>(URLConstantDsf.GetCrdRvwDataRobot, this.dataRobotInfoObj).subscribe(
          (response) => {
            this.dataRobotInfoObj = response;
          }
        );
      }
    );
  }
}
