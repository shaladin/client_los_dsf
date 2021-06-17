import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DocChecklist } from '../../../../../shared/model/DocChecklist/DocChecklist.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-doc-checklist-detail',
  templateUrl: './doc-checklist-detail.component.html'
})
export class DocChecklistDetailComponent implements OnInit {

  AppId: any;
  result: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  appTC: any;
  TaskListId: any;
  DocChecklistObj: DocChecklist = new DocChecklist();
  Token: any = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);

  IsCheckedAll: boolean = false;


  MainInfoForm = this.fb.group({
    ApprovalStatus: ['']
  })
  ListAppTCObj: ListAppTCObj;

  count1: number = 0;
  RfaLogObj: {
    RfaNo: any
  }

  inputObj2: any

  TrxNo: any;
  hasApproveFinal: boolean = false;
  hasRejectFinal: boolean = false;
  lengthListRfaLogObj: number;
  IsApvReady: boolean = false;
  isDmsReady: boolean;
  dmsObj: DMSObj;
  agrNo: any;
  custNo: any;
  appNo: any;
  dmsAppObj: DMSObj;
  mouCustNo: any;

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_DOC_CHECK_LIST_PAGING;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.TaskListId = params["TaskListId"];

      this.route.queryParams.subscribe(params => {
        if (params["BizTemplateCode"] != null) {
          localStorage.setItem("BizTemplateCode", params["BizTemplateCode"]);
        }

      });
    });
  }

  async ngOnInit() {
    // this.claimTask();
    this.claimTaskService.ClaimTask(this.TaskListId);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  ReceiveIsChecked(ev) {
    console.log(ev);
    this.IsCheckedAll = ev;
  }

  RFA() {
    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    this.ListAppTCObj = new ListAppTCObj();
    this.ListAppTCObj["ListAppTcObj"] = new Array();
    for (var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.MainInfoForm.getRawValue().TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.MainInfoForm.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.MainInfoForm.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
      this.appTC.RowVersion = this.MainInfoForm.value.TCList[i].RowVersion;

      var prmsDt = new Date(this.appTC.PromisedDt);
      var prmsDtForm = this.MainInfoForm.value.TCList[i].PromisedDt;

      if (this.appTC.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + this.appTC.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      this.ListAppTCObj["ListAppTcObj"].push(this.appTC);
    }
    this.http.post(URLConstant.EditAppTc, this.ListAppTCObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_DOC_CHECK_LIST_REQ_APPRV], { "AppId": this.AppId, "TaskListId": this.TaskListId });
        this.toastr.successMessage(response['message']);

      });

  }

  SaveForm() {
    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));

    this.ListAppTCObj = new ListAppTCObj();
    this.ListAppTCObj["ListAppTcObj"] = new Array();

    for (var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.MainInfoForm.getRawValue().TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.MainInfoForm.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.MainInfoForm.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
      this.appTC.RowVersion = this.MainInfoForm.value.TCList[i].RowVersion;

      var prmsDt = new Date(this.appTC.PromisedDt);
      var prmsDtForm = this.MainInfoForm.value.TCList[i].PromisedDt;

      if (this.appTC.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + this.appTC.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      this.ListAppTCObj["ListAppTcObj"].push(this.appTC);

    }

    this.DocChecklistObj.RListAppTcObj = this.ListAppTCObj;
    this.DocChecklistObj.TaskListId = this.TaskListId;

    this.http.post(URLConstant.SubmitDocChecklist, this.DocChecklistObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_DOC_CHECK_LIST_PAGING], {});
        this.toastr.successMessage(response['message']);
      });

  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.TaskListId;
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
}
