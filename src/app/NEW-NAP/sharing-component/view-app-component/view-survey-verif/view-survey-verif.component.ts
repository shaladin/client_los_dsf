import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { DatePipe } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: "view-survey-verif",
  templateUrl: "./view-survey-verif.component.html",
  providers: [NGXToastrService]
})
export class ViewSurveyVerifComponent implements OnInit {
  @Input() appId: number;

  AppObj: AppObj;
  phoneVerifObj: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.appId = params['AppId'];
    //  }
    //});
  }

  async ngOnInit(): Promise<void> {
    this.phoneVerifObj = new Array();
    // this.appObj.AppId = this.appId;

    await this.GetAppData();

    if(this.AppObj != undefined){
      if(this.AppObj['LobCode'] == CommonConstant.CFNA){
        var obj ={
          AppNo : this.AppObj['AppNo']
        }  
        await this.http.post(URLConstant.GetParentAppIdByAppNo, obj).toPromise().then(
          (response: AppObj) => {
            this.AppObj = response;
            if(this.AppObj != undefined){
              this.appId = this.AppObj['AppId'];
            }else{
              return;
            }
          }
        );
      }
    }

    await this.GetPhnVerfSubjData();

  }

  async GetAppData() {
    await this.http.post(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
      (response: AppObj) => {
        this.AppObj = response;
      }
    );
  }

  async GetPhnVerfSubjData() {
    if (this.appId != 0) {
      await this.http.post(URLConstant.GetAppSurveyVerifSubjectListByAppId, { Id: this.appId }).toPromise().then(
        (response) => {
          this.phoneVerifObj = response;
        }
      );
    }
  }

  View(VerifResultHid, SubjectName) {
    window.open(environment.losR3Web + "/Nap/CreditProcess/SurveyVerification/Subject/View?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid, "_blank");
  }
}
