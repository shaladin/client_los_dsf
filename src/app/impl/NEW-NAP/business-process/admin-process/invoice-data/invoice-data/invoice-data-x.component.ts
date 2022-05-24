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

    this.http.post(URLConstant.GetAppAssetListByAgrmntId, appAssetObj).subscribe(
      (response) => {
        this.AppAssetList = response[CommonConstant.ReturnObj];
      });
  }

  async SaveForm() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_DATA_PAGING], { "BizTemplateCode": BizTemplateCode });
  }
  Cancel() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_DATA_PAGING], { "BizTemplateCode": BizTemplateCode });
  }
}
