import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { formatDate } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

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
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService) {
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
    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
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
        AdInsHelper.RedirectUrl(this.router,["/Nap/AddProcess/CreditApprovalResultExt/Paging"], { BizTemplateCode: this.BizTemplateCode });
      }
    );
  }

  GetMainData() {

    var RequestMainDataObj = {
      AppId: this.AppId,
      AgrmntId: this.AgrmntId
    }
    this.http.post(URLConstant.GetCreditApvResultExtMainData, RequestMainDataObj).subscribe(
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
    AdInsHelper.RedirectUrl(this.router,["/Nap/AddProcess/CreditApprovalResultExt/Paging"], { BizTemplateCode: this.BizTemplateCode });
  }

  OpenView(key: string) {
    if (key == 'app') {
      AdInsHelper.OpenAppViewByAppId(this.AppId);
    } else if (key == 'agr') {
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
    }
  }
}
