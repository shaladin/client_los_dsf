import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { formatDate } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-credit-apv-result-ext-detail',
  templateUrl: './credit-apv-result-ext-detail.component.html'
})
export class CreditApvResultExtDetailComponent implements OnInit {
  AppId: number;
  AgrmntId: number;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  BizTemplateCode: string;
  CrdApvMainDataObj: any;
  MinDate: Date;
  UserAccess: any;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AgrmntId = params["AgrmntId"];
      this.BizTemplateCode = params["BizTemplateCode"];
    });
  }

  CrdApvRestExtForm = this.fb.group({
    NewCrdApvResultExpDt: ['', Validators.required]
  });

  ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MinDate = new Date(this.UserAccess.BusinessDt);
    this.GetMainData();
  }

  SaveForm() {
    var obj = {
      AppId: this.AppId,
      NewCrdApvResultExpDt: this.CrdApvRestExtForm.controls.NewCrdApvResultExpDt.value
    }
    this.http.post(URLConstant.SubmitNewExpDate, obj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_PAGING], { BizTemplateCode: this.BizTemplateCode });
      }
    );
  }

  GetMainData() {
    this.http.post(URLConstant.GetCreditApvResultExtMainData, {AppId: this.AppId, AgrmntId: this.AgrmntId}).subscribe(
      response => {
        this.CrdApvMainDataObj = response;
        this.CrdApvRestExtForm.patchValue({
          NewCrdApvResultExpDt: formatDate(this.CrdApvMainDataObj.CrdApvResultExpDt, 'yyyy-MM-dd', 'en-US')
        });
        var ExpDt = new Date(this.CrdApvMainDataObj.CrdApvResultExpDt);
        if (this.MinDate < ExpDt) {
          this.MinDate = ExpDt;
        }

      }
    );
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_PAGING], { BizTemplateCode: this.BizTemplateCode });
  }

  OpenView(key: string) {
    if (key == 'app') {
      AdInsHelper.OpenAppViewByAppId(this.AppId);
    } else if (key == 'agr') {
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
    }
  }
}
