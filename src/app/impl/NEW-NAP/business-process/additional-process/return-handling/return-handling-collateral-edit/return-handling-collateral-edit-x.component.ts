import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { WorkflowApiObj } from 'app/shared/model/workflow/workflow-api-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResReturnHandlingDObj } from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AppObj } from 'app/shared/model/app/app.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';



@Component({
  selector: 'app-return-handling-collateral-edit-x',
  templateUrl: './return-handling-collateral-edit-x.component.html',
  providers: [NGXToastrService]
})
export class ReturnHandlingCollateralEditXComponent implements OnInit {

  isReturnHandling: boolean = false;
  appId: number;
  returnHandlingHId: number;
  wfTaskListId: any;
  appCollateralObj: Array<AppCollateralObj> = new Array();
  AppObj: NapAppModel;
  returnHandlingDObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  ReturnHandlingDData: ReturnHandlingDObj;
  BizTemplateCode: string;
  IsViewReady: boolean = false;

  ReturnHandlingForm = this.fb.group({
    ExecNotes: ['', Validators.maxLength(4000)],
  });

  rtnHandlingDObj = {
    ReturnHandlingDId: 0,
    Id: 0
  };

  appCollObj = {
    AppCollateralId: 0,
  };

  arrValue = [];

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_PAGING_X;
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {

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
    this.SetCollateralGrid();
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.claimTask();
    await this.GetAppData();
    await this.GetAppCollateralData();
    if (this.isReturnHandling == true) {
      this.MakeViewReturnInfoObj();
    }
  }

  gridAppCollateralObj: InputGridObj;
  SetCollateralGrid(){
    this.gridAppCollateralObj = new InputGridObj();
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateral.json";
    this.gridAppCollateralObj.deleteUrl = URLConstant.DeleteAppCollateral;
  }

  eventColl(ev) {
    if (ev.Key == "edit") {
      this.AddEdit(ev.RowObj.AppCollateralId);
    }

    if (ev.Key == "delete") {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        let collateralObj = new AppCollateralObj();
        collateralObj.AppCollateralId = ev.RowObj.AppCollateralId;
        collateralObj.AppId = this.appId;
        this.http.post(URLConstant.DeleteAppCollateral, collateralObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);

            let DetailForGridCollateral = {
              Data: response[CommonConstant.ReturnObj],
              Count: "0"
            };
            this.gridAppCollateralObj.resultData = DetailForGridCollateral;
          }
        );
      }
    }
  }
  claimTask() {
    if (environment.isCore) {
      if (this.wfTaskListId != "" && this.wfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
      }
    }
    else if (this.wfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
  }

  SaveForm() {
    if (this.isReturnHandling == false) {

    }
    if (this.isReturnHandling == true) {
      this.setReturnHandlingD();
      let EditReturnHandlingDUrl = environment.isCore ? URLConstant.EditReturnHandlingDV2 : URLConstant.EditReturnHandlingD;
      this.http.post(EditReturnHandlingDUrl, this.ReturnHandlingDData).subscribe(
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
      (response: NapAppModel) => {

        this.AppObj = response;
      }
    );
  }

  MakeViewReturnInfoObj() {
    if (this.returnHandlingHId > 0) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.returnHandlingHId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingAddColtr;
      this.http.post(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
        (response: ResReturnHandlingDObj) => {
          this.returnHandlingDObj = response;
        });
    }
  }

  GetAppCollateralData() {
    this.http.post(URLConstant.GetListAdditionalCollateralByAppId, { Id: this.appId }).subscribe(
      (response) => {
        this.appCollateralObj = response[CommonConstant.ReturnObj];
        let DetailForGridCollateral = {
          Data: response[CommonConstant.ReturnObj],
          Count: "0"
        }

        this.gridAppCollateralObj.resultData = DetailForGridCollateral;
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

  AddEdit(AppCollateralId: number) {
    if (this.isReturnHandling == false) {
    }
    if (this.isReturnHandling == true) {
      let mode: string = CommonConstant.ModeAddColl;
      if(AppCollateralId != 0) mode = CommonConstant.ModeEditColl;
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_DETAIL_X], { AppId: this.appId, AppCollateralId: AppCollateralId, ReturnHandlingHId: this.returnHandlingHId, WfTaskListId: this.wfTaskListId, Mode: mode });

    }
  }

}
