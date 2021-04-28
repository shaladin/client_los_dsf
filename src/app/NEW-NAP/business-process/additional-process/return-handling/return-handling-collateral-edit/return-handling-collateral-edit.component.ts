import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';



@Component({
  selector: 'app-return-handling-collateral-edit',
  templateUrl: './return-handling-collateral-edit.component.html',
  providers: [NGXToastrService]
})
export class ReturnHandlingCollateralEditComponent implements OnInit {

  isReturnHandling: boolean = false;
  appId: any;
  returnHandlingHId: any;
  wfTaskListId: any;
  appCollateralObj: any;
  AppObj: any;
  returnHandlingDObj: any;
  ReturnHandlingDData: ReturnHandlingDObj;
  BizTemplateCode: string;
  IsViewReady: boolean = false;
  
  ReturnHandlingForm = this.fb.group({
    ExecNotes: ['', Validators.maxLength(4000)],
  });

  appObj = {
    AppId: 0,
    Id: 0
  };

  rtnHandlingDObj = {
    ReturnHandlingDId: 0,
    Id:0
  };

  appCollObj = {
    AppCollateralId: 0,
  };

  arrValue = [];

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_PAGING;
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router, private cookieService: CookieService) {

    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
      if (params['ReturnHandlingHId'] != null) {
        this.returnHandlingHId = params['ReturnHandlingHId'];
        this.isReturnHandling = true;
      }
      if (params['WfTaskListId'] != null) {
        this.wfTaskListId = params['WfTaskListId'];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.ClaimTask();
    this.appObj.AppId = this.appId;
    this.appObj.Id = this.appId;
    await this.GetAppData();
    await this.GetAppCollateralData();
    if (this.isReturnHandling == true) {
      this.MakeViewReturnInfoObj();
    }
  }

  SaveForm() {
    if (this.isReturnHandling == false) {

    }
    if (this.isReturnHandling == true) {
      this.setReturnHandlingD();
      this.http.post(URLConstant.EditReturnHandlingD, this.ReturnHandlingDData).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
          AdInsHelper.RedirectUrl(this.router, [this.CancelLink], { BizTemplateCode: lobCode });
        });

    }
  }

  SubmitReturnHandling() {
    var workflowApiObj = new WorkflowApiObj();
    workflowApiObj.TaskListId = this.wfTaskListId;
    workflowApiObj.ListValue["pBookmarkValue"] = this.ReturnHandlingForm.controls["ExecNotes"].value;
    var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.http.post(URLConstant.ResumeWorkflow, workflowApiObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [this.CancelLink], { BizTemplateCode: lobCode });
      }
    );
  }

  setReturnHandlingD() {
    this.ReturnHandlingDData = new ReturnHandlingDObj();
    this.ReturnHandlingDData.ReturnHandlingDId = this.returnHandlingDObj.ReturnHandlingDId;
    this.ReturnHandlingDData.ReturnHandlingHId = this.returnHandlingDObj.ReturnHandlingHId;
    this.ReturnHandlingDData.MrReturnTaskCode = this.returnHandlingDObj.MrReturnTaskCode;
    this.ReturnHandlingDData.ReturnStat = this.returnHandlingDObj.ReturnStat;
    this.ReturnHandlingDData.ReturnHandlingNotes = this.returnHandlingDObj.ReturnHandlingNotes;
    this.ReturnHandlingDData.ReturnHandlingExecNotes = this.ReturnHandlingForm.controls["ExecNotes"].value;
    this.ReturnHandlingDData.WfTaskListId = this.wfTaskListId;
    this.ReturnHandlingDData.RowVersion = this.returnHandlingDObj.RowVersion;
  }

  async GetAppData() {
    var appObj1 = { Id: this.appId };
    await this.http.post(URLConstant.GetAppById, appObj1).toPromise().then(
      (response) => {

        this.AppObj = response;
      }
    );
  }

  MakeViewReturnInfoObj() {
    if (this.returnHandlingHId > 0) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.returnHandlingHId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingAddColtr;
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
        (response) => {
          this.returnHandlingDObj = response;
        });
    }
  }

  GetAppCollateralData() {
    this.http.post(URLConstant.GetListAppCollateralByAppId, this.appObj).subscribe(
      (response) => {
        this.appCollateralObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  Delete(AppCollateralId) {
    if (confirm('Are you sure to delete this data?')) {
      this.appCollObj.AppCollateralId = AppCollateralId;
      this.http.post(URLConstant.DeleteAppCollateral, this.appCollObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.GetAppCollateralData();
        });
    }

  }

  AddEdit(AppCollateralId) {
    if (this.isReturnHandling == false) {
    }
    if (this.isReturnHandling == true) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_EDIT], { AppId: this.appId, AppCollateralId: AppCollateralId, ReturnHandlingHId: this.returnHandlingHId, WfTaskListId: this.wfTaskListId });

    }
  }

  ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
}
