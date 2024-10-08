import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { RFAPreGoLiveObj } from 'app/shared/model/rfa-pre-go-live-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { environment } from 'environments/environment';
import { ResultAttrObj } from 'app/shared/model/type-result/result-attr-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { NapAppModel } from 'app/shared/model/nap-app.model';

@Component({
  selector: 'app-sharing-pre-go-live-request-for-approval',
  templateUrl: './pre-go-live-request-for-approval.component.html'
})
export class PreGoLiveRequestForApprovalComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: number;
  AgrmntNo: string;
  itemReason: Array<KeyValueObj>;

  RFAPreGoLive: any;
  RFAInfo: Object = new Object();
  TaskListId: any;
  AgrmntId: any;
  Token: any = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean;
  BizTemplateCode: string;
  PlafondAmt: number = 0;
  OriOfficeCode: string;
  prodOfferingCode: string = "";
  prodOfferingVersion: string = "";
  apvSchmCode: string = "";

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  ApprovalCreateOutput: any;
  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_PGL_PAGING;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cookieService: CookieService,
    private adInsHelperService: AdInsHelperService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AgrmntId = params["AgrmntId"];
      this.AgrmntNo = params["AgrmntNo"];
      this.TaskListId = params["TaskListId"];
    });
  }

  FormObj = this.fb.group({
    AppvAmt: ['']
  });

  async ngOnInit() {
    await this.GetBizTemplateCode();
    if(this.BizTemplateCode == CommonConstant.FCTR) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLiveApprovalFCTR.json";
    }
    else {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLiveApproval.json";
    }
    await this.GetApvSchemeFromRefProdCompnt();
    await this.LoadRefReason();
    await this.BindAppvAmt();
    this.initInputApprovalObj();
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
    if (ev.Key == "customer") {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: ev.ViewObj.CustNo}).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }

  async LoadRefReason() {
    var refReasonObj: ReqGetByTypeCodeObj = {
      RefReasonTypeCode: CommonConstant.RefReasonTypeCodePreGlvApv
    }
    await this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).toPromise().then(
      (response) => {
        this.itemReason = response[CommonConstant.ReturnObj];
      }
    );
  }

  SaveForm() {
    this.RFAInfo = {RFAInfo: this.FormObj.controls.RFAInfo.value};
    this.RFAPreGoLive = new RFAPreGoLiveObj();
    this.RFAPreGoLive.TaskListId = this.TaskListId;
    this.RFAPreGoLive.RowVersion = "";
    this.RFAPreGoLive.RequestRFAObj = this.RFAInfo;
    let createRFAPreGoLiveUrl = environment.isCore? URLConstant.CreateRFAPreGoLiveNewV2 : URLConstant.CreateRFAPreGoLiveNew;
    this.http.post(createRFAPreGoLiveUrl, this.RFAPreGoLive).subscribe((response) => {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_PAGING], { BizTemplateCode: localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
    });
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_DETAIL], { AgrmntId: this.AgrmntId, AppId: this.AppId, TaskListId: this.TaskListId, AgrmntNo: this.AgrmntNo });
  }

  async BindAppvAmt() {
    await this.http.post(URLConstant.GetAgrmntFinDataByAgrmntId, { Id: this.AgrmntId }).toPromise().then(
      (response) => {
        this.FormObj.patchValue({
          AppvAmt: response["NtfAmt"]
        });
        this.PlafondAmt = response["NtfAmt"];
      });
  }

  initInputApprovalObj() {
    let Attributes: Array<ResultAttrObj> = new Array();
    let Attribute1: ResultAttrObj = {
      AttributeName: "Approval Amount",
      AttributeValue: this.PlafondAmt.toString()
    };
    Attributes.push(Attribute1);
    let TypeCode = {
      "TypeCode": "PRE_GLV_APV_TYPE",
      "Attributes": Attributes,
    };
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = this.OriOfficeCode;
    this.InputObj.OfficeCodes.push(this.OriOfficeCode);
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRE_GO_LIVE_APV;
    this.InputObj.SchemeCode = this.apvSchmCode;
    this.InputObj.Reason = this.itemReason;
    this.InputObj.TrxNo = this.AgrmntNo;
    this.IsReady = true;
  }

  async GetBizTemplateCode(){
    await this.http.post<NapAppModel>(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response) => {
        if (response != undefined) {
          this.BizTemplateCode = response.BizTemplateCode;
          this.OriOfficeCode = response.OriOfficeCode;
          this.prodOfferingCode = response.ProdOfferingCode;
          this.prodOfferingVersion = response.ProdOfferingVersion;
        }
      }
    ).catch(
        (error) => {
            console.log(error);
        }
    );
  }

  async GetApvSchemeFromRefProdCompnt() {
    let obj = {
      prodOfferingCode: this.prodOfferingCode,
      prodOfferingVersion: this.prodOfferingVersion,
      refProdCompntCode: CommonConstant.ApvCategoryPreGoLive
    };
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
      response => {
        if(response != undefined){
          this.apvSchmCode = response["CompntValue"];
        }
      }
    );
  }
}
