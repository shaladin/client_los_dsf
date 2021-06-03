import { Component, OnInit, ViewChild } from '@angular/core';
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
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { environment } from 'environments/environment';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CreditApvResultExtObj } from 'app/shared/model/CreditApvResultExtObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';

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
  IsReady: boolean;
  listReason: Array<KeyValueObj>;
  selected: String;
  RequestRFAObj: any;
  private createComponent: UcapprovalcreateComponent;
  ApprovalCreateOutput: any;
  
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
    if(this.ApprovalCreateOutput!=undefined){
      this.RequestRFAObj = this.ApprovalCreateOutput;

      var obj = {
        AppId: this.AppId,
        NewCrdApvResultExpDt: this.CrdApvRestExtForm.controls.NewCrdApvResultExpDt.value
      }

      var sendObj = {
        RequestPurchaseOrderExtensionObj: obj,
        RequestRFAObj: this.RequestRFAObj
      }

      this.http.post(URLConstant.SubmitReqNewExpDateApv, sendObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_CRD_APPRVL_RES_EXT_PAGING], { BizTemplateCode: this.BizTemplateCode });
        }
      );
    }
  }

  async GetMainData() {
    this.http.post(URLConstant.GetCreditApvResultExtMainData, {AppId: this.AppId, AgrmntId: this.AgrmntId}).toPromise().then(
      (response: CreditApvResultExtObj) => {
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

    await this.http.post(URLConstant.GetAppById, {AppId: this.AppId}).toPromise().then(
      response => {
        this.AppNo = response["AppNo"]
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
      if(this.AgrmntId != 0){
        AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
      }
    }
  }

  initInputApprovalObj(){  
  
    this.InputObj = new UcInputRFAObj(this.cookieService);
    var Attributes = [{}] 
    var TypeCode = {
      "TypeCode" : "CR_APV_RES_EXP_TYPE",
      "Attributes" : Attributes,
    };
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_APV_RES_EXP_D;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_CR_APV_RES_EXP_D;
    this.InputObj.Reason = this.listReason;
    this.InputObj.TrxNo = this.AppNo
    this.IsReady = true;
  }
}
