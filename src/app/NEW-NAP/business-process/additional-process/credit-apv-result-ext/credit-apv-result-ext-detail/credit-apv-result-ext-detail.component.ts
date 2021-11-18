import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { formatDate } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { environment } from 'environments/environment';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CreditApvResultExtObj } from 'app/shared/model/credit-apv-result-ext-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';

@Component({
  selector: 'app-credit-apv-result-ext-detail',
  templateUrl: './credit-apv-result-ext-detail.component.html'
})
export class CreditApvResultExtDetailComponent implements OnInit {
  AppId: number;
  AgrmntId: number;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  BizTemplateCode: string;
  CrdApvMainDataObj: CreditApvResultExtObj;
  MinDate: Date;
  UserAccess: CurrentUserContext;
  InputObj: UcInputRFAObj;
  AppNo: string;
  AgrmntNo: string;
  IsReady: boolean;
  listReason: Array<KeyValueObj>;
  selected: String;
  RequestRFAObj: any;
  private createComponent: UcapprovalcreateComponent;
  ApprovalCreateOutput: any;
  RFAInfo: Object = new Object();
  AppCrdApvResultExpDt: Date;
  AgrmntCrdApvResultExpDt: Date;

  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
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

  async ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MinDate = new Date(this.UserAccess.BusinessDt);
    await this.GetMainData();
    await this.initInputApprovalObj();
  }

  SaveForm() {
    this.ApprovalCreateOutput = this.createComponent.output();
    this.RFAInfo = { RFAInfo: this.CrdApvRestExtForm.controls.RFAInfo.value };
    if (this.ApprovalCreateOutput != undefined) {
      // this.RequestRFAObj = this.ApprovalCreateOutput;

      let obj = {
        AppId: this.AppId,
        NewCrdApvResultExpDt: this.CrdApvRestExtForm.controls.NewCrdApvResultExpDt.value,
        AgrmntId: this.AgrmntId
      }

      let sendObj = {
        ReqSubmitReqNewExpDateApv: obj,
        RequestRFAObj: this.RFAInfo
      }

      let apiUrl = environment.isCore ? URLConstant.SubmitReqNewExpDateApvV2 : URLConstant.SubmitReqNewExpDateApv;
      this.http.post(apiUrl, sendObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_PAGING], { BizTemplateCode: this.BizTemplateCode });
        }
      );
    }
  }

  async GetMainData() {
    await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      response => {
        this.AppNo = response["AppNo"];
        this.AppCrdApvResultExpDt = new Date(response["CrdApvResultExpDt"]);
      }
    );

    await this.http.post(URLConstant.GetCreditApvResultExtMainData, { AppId: this.AppId, AgrmntId: this.AgrmntId }).toPromise().then(
      async (response: CreditApvResultExtObj) => {
        console.log(response);
        this.CrdApvMainDataObj = response;
        this.AgrmntNo = this.CrdApvMainDataObj.AgrmntNo;

        let ExpDt = this.AppCrdApvResultExpDt;
        if (this.AgrmntNo != null) {
          var agrmntObj = {
            TrxNo: this.AgrmntNo
          }

          await this.http.post(URLConstant.GetAgrmntByAgrmntNo, agrmntObj).toPromise().then(
            (response) => {
              ExpDt = response["CrdApvResultExpDt"] == null ? this.AppCrdApvResultExpDt : new Date(response["CrdApvResultExpDt"]);
            });
        }

        if (this.MinDate < ExpDt) {
          this.MinDate = ExpDt;
        }

        this.CrdApvRestExtForm.patchValue({
          NewCrdApvResultExpDt: formatDate(this.MinDate, 'yyyy-MM-dd', 'en-US')
        });
      }
    );

    await this.http.post(URLConstant.GetListActiveRefReason, {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview
    }).toPromise().then(
      (response: GenericListObj) => {
        this.listReason = response.ReturnObject;
        this.CrdApvRestExtForm.patchValue({
          Reason: this.listReason[0].Key
        });
        this.selected = this.listReason[0].Key;
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
      if (this.AgrmntId != 0) {
        AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
      }
    }
  }

  initInputApprovalObj() {

    this.InputObj = new UcInputRFAObj(this.cookieService);
    let Attributes = [{}]
    let TypeCode = {
      "TypeCode": "CR_APV_RES_EXP_TYPE",
      "Attributes": Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_APV_RES_EXP_D;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_CR_APV_RES_EXP_D;
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = this.AgrmntNo == null ? this.AppNo : this.AgrmntNo;
    this.IsReady = true;
  }
}
