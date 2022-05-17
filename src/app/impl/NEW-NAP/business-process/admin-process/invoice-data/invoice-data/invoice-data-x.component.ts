import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { forkJoin } from 'rxjs';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ToastrService } from 'ngx-toastr';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { AgrmntTcObj } from 'app/shared/model/agrmnt-tc/agrmnt-tc-obj.model';
import { ReqSubmitAgrmntTcObj } from 'app/shared/model/agrmnt-tc/req-submit-agrmnt-tc-obj.model';
import { WorkflowApiObj } from 'app/shared/model/workflow/workflow-api-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-invoice-data-x',
  templateUrl: './invoice-data-x.component.html'
})
export class InvoiceDataXComponent implements OnInit {
  readonly urlDetail: string = NavigationConstant.NAP_ADM_PRCS_INVOICE_DATA_DETAIL;
  lobCode: string;
  AppId: number;
  AgrmntId: number;
  TaskListId: any;
  arrValue: Array<number> = [];
  AppAssetList = [];
  tcForm: FormGroup = this.fb.group({
  });
  isDmsReady: boolean = false;
  dmsObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  mouCustNo: string;
  isDmsAppReady: boolean;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  isNeedExtension: boolean = false;
  businessDt: Date;
  AppObj: AppObj = new AppObj();
  toastRef: any;
  BizTemplateCode: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private router: Router, private cookieService: CookieService, private claimTaskService: ClaimTaskService, private toastrSvc: ToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["LobCode"] != null) {
        this.lobCode = params["LobCode"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  async ngOnInit() {

    this.arrValue.push(this.AgrmntId);
    var appAssetObj = {
      Id: this.AgrmntId
    }
    // this.claimTask();

    this.http.post(URLConstant.GetAppAssetListByAgrmntId, appAssetObj).subscribe(
      (response) => {
        this.AppAssetList = response[CommonConstant.ReturnObj];
      });
    // await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
    //   (response) => {
    //     this.SysConfigResultObj = response
    //   });
    // await this.InitDms();
  }

  // ngOnDestroy() {
  //   if (this.toastRef != undefined && this.toastRef != null) {
  //     this.toastrSvc.clear(this.toastRef.toastId);
  //   }
  // }

  // checkValidExpDt(ExpirationDate: Date, PoNo: string, flag: boolean): boolean {
  //   let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  //   let bzDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
  //   let tempExpDt = new Date(ExpirationDate);
  //   if (bzDt.getTime() > tempExpDt.getTime()) {
  //     flag = false;
  //     throw this.toastr.typeErrorCustom(PoNo + " Need Extension.");
  //   }
  //   return flag;
  // }

  async SaveForm() {
    // var IsSave = false;
    // if (this.AppAssetList.length != 0) {
    //   for (let i = 0; i < this.AppAssetList.length; i++) {
    //     if (this.AppAssetList[i].PurchaseOrderNo == undefined) {
    //       IsSave = false;
    //       this.toastr.typeErrorCustom("Please submit purchase order first!");
    //       break;
    //     } else {
    //       IsSave = true;
    //     }

    //     if (this.AppAssetList[i].PurchaseOrderExpiredDt) {
    //       IsSave = this.checkValidExpDt(this.AppAssetList[i].PurchaseOrderExpiredDt, this.AppAssetList[i].PurchaseOrderNo, IsSave);
    //     }
    //   }
    // } else {
    //   this.toastr.typeErrorCustom("Please submit purchase order first!");
    // }

    // // let listAgrmntTcObj: Array<AgrmntTcObj> = this.SetTcForm();
    // if (IsSave) {
    //   var reqSubmitAgrmntTcObj = new ReqSubmitAgrmntTcObj();
    //   reqSubmitAgrmntTcObj.AgrmntId = this.AgrmntId;
    //   // reqSubmitAgrmntTcObj.ListAgrmntTcObj = listAgrmntTcObj;
    //   await this.http.post(URLConstant.SubmitAgrmntTc, reqSubmitAgrmntTcObj).toPromise().then(
    //     (response) => {
    //       // this.toastr.successMessage(response["Message"]);
    //       if (response["StatusCode"] != 200) {
    //         throw this.toastr.errorMessage(response["Message"]);
    //       }
    //     });
    //   var workflowModel: WorkflowApiObj = new WorkflowApiObj();
    //   workflowModel.TaskListId = this.TaskListId;
    //   workflowModel.ListValue = { "AgrmntId": this.AgrmntId.toString() };

    //   let resumeWorkflowPurcharOrderUrl = environment.isCore ? URLConstant.ResumeWorkflowPurchaseOrderV2 : URLConstant.ResumeWorkflowPurchaseOrder;
    //   this.http.post(resumeWorkflowPurcharOrderUrl, workflowModel).subscribe(
    //     (response) => {
    //       this.AppAssetList = response[CommonConstant.ReturnObj];
    //       AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_DATA_PAGING], {});
    //       this.toastr.successMessage(response["message"]);
    //     });
    // }
  }
  Cancel() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_DATA_PAGING], { "BizTemplateCode": BizTemplateCode });
  }


}
