import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { RFAPreGoLiveObj } from 'app/shared/model/RFAPreGoLiveObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { environment } from 'environments/environment';
import { ResultAttrObj } from 'app/shared/model/TypeResult/ResultAttrObj.Model';

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
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  ApprovalCreateOutput: any;
  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_PGL_PAGING;
  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
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
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
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
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRE_GO_LIVE_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_PRE_GO_LIVE;
    this.InputObj.Reason = this.itemReason;
    this.InputObj.TrxNo = this.AgrmntNo
    this.IsReady = true;
  }

  async GetBizTemplateCode(){
    await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response) => {
          this.BizTemplateCode = response['BizTemplateCode'];
      }
    ).catch(
        (error) => {
            console.log(error);
        }
    );
  }

}
