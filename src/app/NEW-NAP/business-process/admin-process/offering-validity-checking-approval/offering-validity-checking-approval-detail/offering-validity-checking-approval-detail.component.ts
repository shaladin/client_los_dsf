import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-offering-validity-checking-approval-detail',
  templateUrl: './offering-validity-checking-approval-detail.component.html'
})
export class OfferingValidityCheckingApprovalDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  BizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  ApvReqId: number;
  taskId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  TrxNo: string;
  IsReady: boolean = false;
  arrValue = [];
  constructor(private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {

      this.TrxNo = params["TrxNo"];
      this.taskId = params["TaskId"];
      this.ApvReqId = params["ApvReqId"];

      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = this.taskId;

      this.HoldTask(ApvHoldObj);
    });
  }

  ngOnInit() {
    this.arrValue.push(this.TrxNo);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewOfferingValidityCheckingApproval.json";
    this.initInputApprovalObj();
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error)=>{
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING],{ "BizTemplateCode": this.BizTemplateCode});
      }
    )
  }

  onAvailableNextTask() {

  }
  onApprovalSubmited(event) {
    let reqApvCustomObj = {
      AppId: 0,
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.Approval, reqApvCustomObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING],{ "BizTemplateCode": this.BizTemplateCode});
      });
  }

  onCancelClick()
  {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_OFFERING_VALIDITY_APPRV_PAGING],{ "BizTemplateCode": this.BizTemplateCode});
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
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
    this.InputApvObj.TrxNo = this.TrxNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }
}
