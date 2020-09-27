import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { DatePipe } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: "view-phone-verif",
  templateUrl: "./view-phone-verif.component.html"
})
export class ViewPhoneVerifComponent implements OnInit {

  getAppUrl: any;
  getPhoneVerifSubjUrl: any;
  @Input() appId: any;
  appObj = {
    AppId: 0,
  };

  AppObj: any;
  phoneVerifObj: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private router: Router) {

    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.appId = params['AppId'];
    //  }
    //});
  }

  initUrl() {
    this.getAppUrl = URLConstant.GetAppById;
    this.getPhoneVerifSubjUrl = URLConstant.GetAppPhoneVerifSubjectListByAppId;
  }

  async ngOnInit(): Promise<void> {
    this.initUrl();
    this.appObj.AppId = this.appId;
    this.GetPhnVerfSubjData();

  }

  GetPhnVerfSubjData() {
    this.http.post(this.getPhoneVerifSubjUrl, this.appObj).subscribe(
      (response) => {
        this.phoneVerifObj = response;
      }
    );
  }

  View(VerifResultHid, SubjectName) {
    window.open("/Nap/PhoneVerif/Subject/View?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid + "&Name=" + SubjectName, "_blank");
  }
}
