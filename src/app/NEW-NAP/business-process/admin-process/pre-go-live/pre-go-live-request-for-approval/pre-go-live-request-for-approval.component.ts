import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RFAPreGoLiveObj } from 'app/shared/model/RFAPreGoLiveObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';

@Component({
  selector: 'app-sharing-pre-go-live-request-for-approval',
  templateUrl: './pre-go-live-request-for-approval.component.html'
})
export class PreGoLiveRequestForApprovalComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: any;
  itemApprovedBy: any;
  AgrmntNo: any;
  itemReason: any;

  RFAPreGoLive: any;
  TaskListId: any;
  AgrmntId: any;
  Token: any = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  InputObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean;
  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }
  ApprovalCreateOutput: any;
  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_PGL_PAGING;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AgrmntId = params["AgrmntId"];
      this.AgrmntNo = params["AgrmntNo"];
      this.TaskListId = params["TaskListId"];
    });
  }

  async ngOnInit() {

    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLiveApproval.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
      {
        name: "AgrmntNo",
        environment: environment.losR3Web
      },
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    await this.LoadRefReason();
    this.initInputApprovalObj();
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
    if (ev.Key == "customer") {
      AdInsHelper.OpenCustomerViewByCustId(ev.ViewObj.AppCustId);
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
    this.ApprovalCreateOutput = this.createComponent.output();
    if (this.ApprovalCreateOutput != undefined) {
      this.RFAPreGoLive = new RFAPreGoLiveObj();
      this.RFAPreGoLive.TaskListId = this.TaskListId;
      this.RFAPreGoLive.RowVersion = "";
      this.RFAPreGoLive.RequestRFAObj = this.ApprovalCreateOutput
      this.http.post(URLConstant.CreateRFAPreGoLiveNew, this.RFAPreGoLive).subscribe((response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_PAGING], { BizTemplateCode: localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
      });
    }
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_DETAIL], { AgrmntId: this.AgrmntId, AppId: this.AppId, TaskListId: this.TaskListId, AgrmntNo: this.AgrmntNo });
  }
  initInputApprovalObj() {
    var Attributes = [{}]
    var TypeCode = {
      "TypeCode": "PRE_GLV_APV_TYPE",
      "Attributes": Attributes,
    };
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_PRE_GO_LIVE_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_APV_PRE_GO_LIVE;
    this.InputObj.Reason = this.itemReason;
    this.InputObj.TrxNo = this.AgrmntNo
    this.IsReady = true;
  }

}
