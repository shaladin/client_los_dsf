import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ListAppTCObj } from 'app/shared/model/list-app-tc-obj.model';
import { AppTCObj } from 'app/shared/model/app-tc-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { NapAppModel } from 'app/shared/model/nap-app.model';

@Component({
  selector: 'app-doc-checklist-approval-detail',
  templateUrl: './doc-checklist-approval-detail.component.html'
})
export class DocChecklistApprovalDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  viewObj: string;
  TrxNo: string;
  arrValue = [];
  TCList: Array<AppTCObj> = new Array();
  AppNo: string;
  AppObj: NapAppModel;
  IsApvReady: boolean = false;
  listAppTCObj: ListAppTCObj;
  appTC: AppTCObj;
  MainInfoForm = this.fb.group({

  });
  AppId: number;
  token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  LeadId: string;
  bizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  MouCustId: number;
  ApvReqId: number;
  taskId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.TrxNo = params["TrxNo"];
      this.taskId = params["TaskId"];
      this.ApvReqId = params["ApvReqId"];

      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = params["TaskId"];

      this.HoldTask(ApvHoldObj);
    });
  }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
    this.http.post(URLConstant.GetListTCbyAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.TCList = response["AppTcs"];
      });
    await this.GetAppData();
    this.initInputApprovalObj();

  }

  async GetAppData() {
    var appObj = {
      Id: this.AppId,
    };
    await this.http.post(URLConstant.GetAppById, appObj).toPromise().then(
      (response: NapAppModel) => {
        this.AppObj = response;
        this.AppNo = response.AppNo;
      }
    );
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_DOC_CHECK_LIST_APPRV_PAGING], { "BizTemplateCode": this.bizTemplateCode });
      }
    )
  }


  onApprovalSubmited(event) {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_DOC_CHECK_LIST_APPRV_PAGING], { "BizTemplateCode": this.bizTemplateCode });
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_DOC_CHECK_LIST_APPRV_PAGING], { "BizTemplateCode": localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
  }


  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.TrxNo = this.AppNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.InputApvObj.OfficeCodes.push(this.AppObj.OriOfficeCode);
    this.IsReady = true;
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
}
