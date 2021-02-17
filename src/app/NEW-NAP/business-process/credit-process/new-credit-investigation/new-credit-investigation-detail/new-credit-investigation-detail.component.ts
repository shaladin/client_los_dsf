import { Component, OnInit } from '@angular/core';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { AppCrdInvstgHObj } from 'app/shared/model/AppCrdInvstg/AppCrdInvstgHObj.Model';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCrdInvstgDObj } from 'app/shared/model/AppCrdInvstg/AppCrdInvstgDObj.Model';
import { RequestAppCrdInvstgObj } from 'app/shared/model/AppCrdInvstg/RequestAppCrdInvstgObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-credit-investigation-detail',
  templateUrl: './new-credit-investigation-detail.component.html',
  styles: []
})
export class NewCreditInvestigationDetailComponent implements OnInit {
  appId: number;
  wfTaskListId: number;
  mrCustTypeCode: string;
  BizTemplateCode: string = "";
  viewObj: string;
  analysisItemObj: Array<KeyValueObj>;
  appCrdInvstgHObj: AppCrdInvstgHObj;
  type: string;

  CreditInvestigationForm = this.fb.group({
    AppCrdInvstgDs: new FormArray([]),
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
      if (params["MrCustTypeCode"] != null) {
        this.mrCustTypeCode = params["MrCustTypeCode"];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.ClaimTask();
    this.viewObj = "./assets/ucviewgeneric/viewCreditInvestigationInfo.json";
    await this.bindAnalysisItemObj();
    this.generateFormAnalysisItem();
  }

  SaveForm() {
    var reqAppCrdInvstg = new RequestAppCrdInvstgObj();

    var user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    reqAppCrdInvstg.AppId = this.appId;
    reqAppCrdInvstg.AppCrdInvstgHObj.AppId = this.appId;
    reqAppCrdInvstg.AppCrdInvstgHObj.CrdInvstgStat = "DONE";
    reqAppCrdInvstg.AppCrdInvstgHObj.CrdRiskEmpNo = user.EmpNo;
    reqAppCrdInvstg.AppCrdInvstgHObj.SubmitDt = user.BusinessDt;
    reqAppCrdInvstg.AppCrdInvstgHObj.RowVersion = this.appCrdInvstgHObj.RowVersion;

    for (let i = 0; i < this.CreditInvestigationForm.controls["AppCrdInvstgDs"]["controls"].length; i++) {
      var appCrdInvstgD = new AppCrdInvstgDObj();

      appCrdInvstgD.MrAnalysisItemCode = this.CreditInvestigationForm.controls["AppCrdInvstgDs"]["controls"][i]["controls"].MrAnalysisItemCode.value;
      appCrdInvstgD.AnalysisResult = this.CreditInvestigationForm.controls["AppCrdInvstgDs"]["controls"][i]["controls"].AnalysisResult.value;

      reqAppCrdInvstg.AppCrdInvstgHObj.AppCrdInvstgDObjs.push(appCrdInvstgD);
    }

    reqAppCrdInvstg.WfTaskListId = this.wfTaskListId;
    var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.http.post(URLConstant.AddEditAppCrdInvstg, reqAppCrdInvstg).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);       
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_INVESTIGATION_PAGING], {  BizTemplateCode: lobCode});
      });

  }

  EnterTab(type) {
    this.type = type;
  }

  generateFormAnalysisItem() {
    if (this.appCrdInvstgHObj.AppId == 0) {
      for (let i = 0; i < this.analysisItemObj.length; i++) {
        (this.CreditInvestigationForm.controls.AppCrdInvstgDs as FormArray).push(this.addGroupByRefMaster(this.analysisItemObj[i]));
      }
    } else if (this.appCrdInvstgHObj.AppCrdInvstgDObjs != null) {
      for (let i = 0; i < this.appCrdInvstgHObj.AppCrdInvstgDObjs.length; i++) {
        (this.CreditInvestigationForm.controls.AppCrdInvstgDs as FormArray).push(this.addGroupByAppCrdInvstgH(this.appCrdInvstgHObj.AppCrdInvstgDObjs[i]));
      }
    }
  }

  addGroupByAppCrdInvstgH(appCrdInvstgDObj) {
    var group = this.fb.group({
      MrAnalysisItemCode: appCrdInvstgDObj.MrAnalysisItemCode,
      AnalysisItemName: appCrdInvstgDObj.AnalysisItemName,
      AnalysisResult: [appCrdInvstgDObj.AnalysisResult, Validators.maxLength(4000)]
    });

    return group;
  }
  addGroupByRefMaster(analysisItem) {
    var group = this.fb.group({
      MrAnalysisItemCode: analysisItem.Key,
      AnalysisItemName: analysisItem.Value,
      AnalysisResult: ['', Validators.maxLength(4000)]
    });

    return group;
  }

  async bindAnalysisItemObj() {

    var reqObj = { AppId: this.appId };

    await this.http.post<AppCrdInvstgHObj>(URLConstant.GetAppCrdInvstgByAppId, reqObj).toPromise().then(
      (response) => {
        this.appCrdInvstgHObj = response;
      }
    );
    if (this.appCrdInvstgHObj.AppId == 0) {
      var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCrdInvstgAnalysisItem };
      await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
        (response) => {
          this.analysisItemObj = response[CommonConstant.ReturnObj];
        }
      );
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
  Back() {
    var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_INVESTIGATION_PAGING], {  BizTemplateCode: lobCode });
  }

}
